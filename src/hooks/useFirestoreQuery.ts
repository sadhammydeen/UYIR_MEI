import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient, CollectionName } from '@/lib/apiClient';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import throttle from 'lodash.throttle';

interface UseFirestoreQueryOptions<T> {
  enabled?: boolean;
  cacheKey?: string;
  skipCache?: boolean;
  queryKey?: string;
  onSuccess?: (data: T[]) => void;
  onError?: (error: Error) => void;
  suspense?: boolean;
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean | 'always';
  keepPreviousData?: boolean;
}

export function useFirestoreQuery<T>(
  collectionName: CollectionName,
  queryConstraints: any[] = [],
  options: UseFirestoreQueryOptions<T> = {}
) {
  const {
    enabled = true,
    cacheKey,
    skipCache = false,
    queryKey = `${collectionName}:query:${JSON.stringify(queryConstraints)}`,
    onSuccess,
    onError,
    suspense = false,
    staleTime = 1000 * 60, // 1 minute
    cacheTime = 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus = false,
    refetchOnMount = true,
    keepPreviousData = true,
  } = options;

  // Use React Query for optimized data fetching
  const { data, isLoading, isError, error, refetch } = useQuery<T[], Error>(
    [queryKey, collectionName, JSON.stringify(queryConstraints)],
    async () => {
      return apiClient.queryCollection<T>(
        collectionName,
        queryConstraints,
        cacheKey,
        skipCache
      );
    },
    {
      enabled,
      onSuccess,
      onError,
      suspense,
      staleTime,
      cacheTime,
      refetchOnWindowFocus,
      refetchOnMount,
      keepPreviousData,
      useErrorBoundary: suspense,
    }
  );

  // Throttled refetch to prevent too many API calls
  const throttledRefetch = useCallback(
    throttle(() => {
      refetch();
    }, 500),
    [refetch]
  );

  return {
    data: data || [],
    isLoading,
    isError,
    error,
    refetch: throttledRefetch,
  };
}

interface UseFirestoreDocumentOptions<T> {
  enabled?: boolean;
  skipCache?: boolean;
  queryKey?: string;
  onSuccess?: (data: T | null) => void;
  onError?: (error: Error) => void;
  suspense?: boolean;
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean | 'always';
}

export function useFirestoreDocument<T>(
  collectionName: CollectionName,
  documentId: string | null | undefined,
  options: UseFirestoreDocumentOptions<T> = {}
) {
  const {
    enabled = !!documentId,
    skipCache = false,
    queryKey = `${collectionName}:${documentId}`,
    onSuccess,
    onError,
    suspense = false,
    staleTime = 1000 * 60, // 1 minute
    cacheTime = 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus = false,
    refetchOnMount = true,
  } = options;

  // Use React Query
  const { data, isLoading, isError, error, refetch } = useQuery<T | null, Error>(
    [queryKey, collectionName, documentId],
    async () => {
      if (!documentId) return null;
      return apiClient.getDocument<T>(collectionName, documentId, skipCache);
    },
    {
      enabled: enabled && !!documentId,
      onSuccess,
      onError,
      suspense,
      staleTime,
      cacheTime,
      refetchOnWindowFocus,
      refetchOnMount,
      useErrorBoundary: suspense,
    }
  );

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
}

interface UseFirestoreMutationOptions<T, R> {
  onSuccess?: (data: R, variables: T) => void;
  onError?: (error: Error, variables: T) => void;
  onSettled?: (data: R | undefined, error: Error | null, variables: T) => void;
  invalidateQueries?: string[];
}

export function useFirestoreMutation<T, R = void>(
  mutationFn: (data: T) => Promise<R>,
  options: UseFirestoreMutationOptions<T, R> = {}
) {
  const { onSuccess, onError, onSettled, invalidateQueries = [] } = options;
  const queryClient = useQueryClient();
  
  const { mutate, mutateAsync, isLoading, isError, error, reset } = useMutation<R, Error, T>(
    mutationFn,
    {
      onSuccess: (data, variables) => {
        // Invalidate relevant queries
        if (invalidateQueries.length > 0) {
          invalidateQueries.forEach(queryKey => {
            queryClient.invalidateQueries(queryKey);
          });
        }
        
        if (onSuccess) onSuccess(data, variables);
      },
      onError,
      onSettled,
    }
  );

  return {
    mutate,
    mutateAsync,
    isLoading,
    isError,
    error,
    reset,
  };
} 