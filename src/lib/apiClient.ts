import { db } from './firebase';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  setDoc,
  doc,
  documentId,
} from 'firebase/firestore';

// Constants
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Cache implementation using React Query
type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

class MemoryCache {
  private cache: Map<string, CacheEntry<any>> = new Map();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    const now = Date.now();
    if (now - entry.timestamp > CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(keyPrefix?: string): void {
    if (keyPrefix) {
      Array.from(this.cache.keys())
        .filter(key => key.startsWith(keyPrefix))
        .forEach(key => this.cache.delete(key));
    } else {
      this.cache.clear();
    }
  }
}

const globalCache = new MemoryCache();

// Batch request handler
type BatchRequest<T> = {
  id: string;
  resolver: (data: T) => void;
  rejecter: (error: Error) => void;
};

class BatchProcessor<T, K extends string | number> {
  private queue: Map<K, BatchRequest<T>> = new Map();
  private timer: NodeJS.Timeout | null = null;
  private delay: number;
  private maxBatchSize: number;
  private isFetching = false;

  constructor(
    private fetchFn: (ids: K[]) => Promise<Record<K, T>>,
    options: { delay?: number; maxBatchSize?: number } = {}
  ) {
    this.delay = options.delay || 50;
    this.maxBatchSize = options.maxBatchSize || 25;
  }

  request(id: K): Promise<T> {
    // Check if we already have a request for this ID in the queue
    if (this.queue.has(id)) {
      const existing = this.queue.get(id)!;
      return new Promise<T>((resolve, reject) => {
        const wrappedResolve = (data: T) => {
          resolve(data);
          existing.resolver(data);
        };
        const wrappedReject = (error: Error) => {
          reject(error);
          existing.rejecter(error);
        };
        existing.resolver = wrappedResolve;
        existing.rejecter = wrappedReject;
      });
    }

    return new Promise<T>((resolve, reject) => {
      this.queue.set(id, {
        id: id.toString(),
        resolver: resolve,
        rejecter: reject,
      });

      this.scheduleProcess();
    });
  }

  private scheduleProcess(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
    }

    if (this.isFetching) {
      return;
    }

    this.timer = setTimeout(() => this.process(), this.delay);
  }

  private async process(): Promise<void> {
    if (this.queue.size === 0 || this.isFetching) {
      return;
    }

    this.isFetching = true;
    const ids = Array.from(this.queue.keys()).slice(0, this.maxBatchSize);
    const requests = ids.map(id => this.queue.get(id)!);
    
    // Clear processed requests from the queue
    ids.forEach(id => this.queue.delete(id));

    try {
      const batchResults = await this.fetchFn(ids);
      
      requests.forEach(request => {
        const id = request.id as unknown as K;
        if (id in batchResults) {
          request.resolver(batchResults[id]);
        } else {
          request.rejecter(new Error(`No data found for id ${id}`));
        }
      });
    } catch (error) {
      requests.forEach(request => {
        request.rejecter(error as Error);
      });
    } finally {
      this.isFetching = false;
      
      // If we have more items in the queue, schedule another process
      if (this.queue.size > 0) {
        this.scheduleProcess();
      }
    }
  }
}

// Create types for each collection
export type CollectionName = 'ngos' | 'users' | 'projects' | 'donations' | 'volunteers';

// API client with caching
export class ApiClient {
  private cache: MemoryCache;
  private docBatcher: Map<CollectionName, BatchProcessor<any, string>> = new Map();

  constructor(cache: MemoryCache = globalCache) {
    this.cache = cache;
    this.initializeBatchers();
  }

  private initializeBatchers() {
    const collections: CollectionName[] = ['ngos', 'users', 'projects', 'donations', 'volunteers'];
    
    collections.forEach(collectionName => {
      this.docBatcher.set(
        collectionName,
        new BatchProcessor<any, string>(
          async (ids) => {
            const batchQuery = query(
              collection(db, collectionName),
              where(documentId(), 'in', ids)
            );
            
            const snapshot = await getDocs(batchQuery);
            const results: Record<string, any> = {};
            
            snapshot.docs.forEach(doc => {
              results[doc.id] = doc.data();
            });
            
            return results;
          },
          { delay: 50, maxBatchSize: 10 }
        )
      );
    });
  }

  // Get document by ID with batching
  async getDocument<T>(collectionName: CollectionName, id: string, skipCache = false): Promise<T | null> {
    const cacheKey = `${collectionName}:${id}`;
    
    // Try cache first
    if (!skipCache) {
      const cachedData = this.cache.get<T>(cacheKey);
      if (cachedData) return cachedData;
    }
    
    try {
      // Use batch processor if available
      if (this.docBatcher.has(collectionName)) {
        const batcher = this.docBatcher.get(collectionName)!;
        const data = await batcher.request(id);
        
        // Cache the result
        if (data) {
          this.cache.set(cacheKey, data);
        }
        
        return data;
      }
      
      // Fallback to individual fetch
      const docRef = doc(db, collectionName, id);
      const result = await this.retryOperation(() => getDoc(docRef));
      
      if (!result.exists()) return null;
      
      const data = result.data() as T;
      this.cache.set(cacheKey, data);
      
      return data;
    } catch (error) {
      console.error(`Error fetching ${collectionName}/${id}:`, error);
      return null;
    }
  }

  // Query collection with caching
  async queryCollection<T>(
    collectionName: CollectionName,
    queryConstraints: any[] = [],
    cacheKey?: string,
    skipCache = false
  ): Promise<T[]> {
    const actualCacheKey = cacheKey || `${collectionName}:query:${JSON.stringify(queryConstraints)}`;
    
    // Try cache first
    if (!skipCache) {
      const cachedData = this.cache.get<T[]>(actualCacheKey);
      if (cachedData) return cachedData;
    }
    
    try {
      const q = query(collection(db, collectionName), ...queryConstraints);
      const result = await this.retryOperation(() => getDocs(q));
      
      const data = result.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
      
      this.cache.set(actualCacheKey, data);
      
      return data;
    } catch (error) {
      console.error(`Error querying ${collectionName}:`, error);
      return [];
    }
  }
  
  // Set document with cache invalidation
  async setDocument<T>(
    collectionName: CollectionName,
    id: string,
    data: Partial<T>,
    options: { merge?: boolean } = { merge: true }
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await setDoc(docRef, data, options);
      
      // Invalidate cache
      this.cache.clear(`${collectionName}:${id}`);
      this.cache.clear(`${collectionName}:query:`);
    } catch (error) {
      console.error(`Error setting ${collectionName}/${id}:`, error);
      throw error;
    }
  }
  
  // Utility: Retry operation with exponential backoff
  private async retryOperation<T>(operation: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries <= 0) throw error;
      
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return this.retryOperation(operation, retries - 1);
    }
  }
  
  // Clear cache 
  clearCache(keyPrefix?: string): void {
    this.cache.clear(keyPrefix);
  }
}

// Create singleton instance
export const apiClient = new ApiClient(); 