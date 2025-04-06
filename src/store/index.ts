import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { shallow } from 'zustand/shallow'
import { immer } from 'zustand/middleware/immer'
import { apiClient } from '@/lib/apiClient'
import { NgoProfile } from '@/lib/ngo'
import { UserData } from '@/lib/auth'

// Define the store state type
interface AppState {
  // Auth state
  user: UserData | null
  setUser: (user: UserData | null) => void
  
  // NGO data
  ngoProfiles: Record<string, NgoProfile>
  loadingNgos: Record<string, boolean>
  loadNgoProfile: (id: string) => Promise<NgoProfile | null>
  addNgoProfile: (ngo: NgoProfile) => void
  clearNgoProfiles: () => void
  
  // Pagination state
  paginationState: Record<string, { 
    lastDoc: any | null
    hasMore: boolean
    loading: boolean
    items: any[]
  }>
  setPaginationState: (key: string, state: Partial<{
    lastDoc: any | null
    hasMore: boolean
    loading: boolean
    items: any[]
  }>) => void
  resetPaginationState: (key: string) => void
  
  // UI state
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  
  // Theming
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  
  // App State
  appIsReady: boolean
  setAppIsReady: (ready: boolean) => void
  
  // Performance metrics
  performanceMetrics: {
    timeToFirstPaint: number | null
    timeToInteractive: number | null
    largestContentfulPaint: number | null
  }
  setPerformanceMetric: (metric: keyof AppState['performanceMetrics'], value: number) => void
  
  // Cache management
  clearCache: () => void
}

// Create store with immer for easier state updates and persist for local storage
export const useStore = create<AppState>()(
  persist(
    immer((set, get) => ({
      // Auth state
      user: null,
      setUser: (user) => set({ user }),
      
      // NGO data with caching
      ngoProfiles: {},
      loadingNgos: {},
      loadNgoProfile: async (id) => {
        // Return from cache if available
        if (get().ngoProfiles[id]) {
          return get().ngoProfiles[id];
        }
        
        // Set loading state
        set(state => {
          state.loadingNgos[id] = true;
        });
        
        try {
          const ngo = await apiClient.getDocument<NgoProfile>('ngos', id);
          
          if (ngo) {
            set(state => {
              state.ngoProfiles[id] = ngo;
              state.loadingNgos[id] = false;
            });
            return ngo;
          }
          
          set(state => {
            state.loadingNgos[id] = false;
          });
          
          return null;
        } catch (error) {
          console.error(`Failed to load NGO profile: ${id}`, error);
          set(state => {
            state.loadingNgos[id] = false;
          });
          return null;
        }
      },
      addNgoProfile: (ngo) => set(state => {
        state.ngoProfiles[ngo.id] = ngo;
      }),
      clearNgoProfiles: () => set({ ngoProfiles: {} }),
      
      // Pagination state for virtualized lists
      paginationState: {},
      setPaginationState: (key, newState) => set(state => {
        if (!state.paginationState[key]) {
          state.paginationState[key] = {
            lastDoc: null,
            hasMore: true,
            loading: false,
            items: []
          };
        }
        
        state.paginationState[key] = {
          ...state.paginationState[key],
          ...newState
        };
      }),
      resetPaginationState: (key) => set(state => {
        state.paginationState[key] = {
          lastDoc: null,
          hasMore: true,
          loading: false,
          items: []
        };
      }),
      
      // UI state
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      mobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      
      // Theming
      theme: 'light' as const,
      setTheme: (theme) => set({ theme }),
      
      // App state
      appIsReady: false,
      setAppIsReady: (ready) => set({ appIsReady: ready }),
      
      // Performance metrics
      performanceMetrics: {
        timeToFirstPaint: null,
        timeToInteractive: null,
        largestContentfulPaint: null
      },
      setPerformanceMetric: (metric, value) => set(state => {
        state.performanceMetrics[metric] = value;
      }),
      
      // Cache management
      clearCache: () => {
        apiClient.clearCache();
        set(state => {
          state.ngoProfiles = {};
          state.paginationState = {};
        });
      }
    })),
    {
      name: 'uyir-mei-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields
        user: state.user,
        theme: state.theme
      }),
    }
  )
)

// Create selector hooks for better performance
export const useUser = () => useStore(state => state.user)
export const useTheme = () => useStore(state => state.theme)
export const useNgoProfile = (id: string) => useStore(
  state => ({
    ngo: state.ngoProfiles[id],
    loading: state.loadingNgos[id] || false,
    loadNgoProfile: state.loadNgoProfile
  }),
  shallow
)

// UI state selectors
export const useSidebar = () => 
  useStore(
    state => ({ 
      open: state.sidebarOpen, 
      setOpen: state.setSidebarOpen 
    }),
    shallow
  )

export const useMobileMenu = () => 
  useStore(
    state => ({ 
      open: state.mobileMenuOpen, 
      setOpen: state.setMobileMenuOpen 
    }), 
    shallow
  )

// App readiness state
export const useAppReady = () => 
  useStore(
    state => ({ 
      isReady: state.appIsReady, 
      setReady: state.setAppIsReady 
    }),
    shallow
  )

// Metrics collector
export const usePerformanceMetrics = () => {
  // Mock implementation
  return {
    recordCLS: (value: number) => {},
    recordFID: (value: number) => {},
    recordLCP: (value: number) => {},
    recordTTFB: (value: number) => {},
    recordFCP: (value: number) => {},
    metrics: {
      cls: 0,
      fid: 0,
      lcp: 0,
      ttfb: 0,
      fcp: 0
    }
  };
};

export const useAuthStore = () => {
  return {
    user: null,
    loading: false,
    error: null,
    login: async () => {},
    logout: async () => {},
    register: async () => {}
  };
};

export const useUIStore = () => {
  return {
    theme: 'light',
    setTheme: () => {}
  };
}; 