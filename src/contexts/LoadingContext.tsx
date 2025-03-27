import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  loadingText: string;
  setLoadingText: (text: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 200);
    } else {
      setProgress(100);
      setTimeout(() => setProgress(0), 300);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, loadingText, setLoadingText }}>
      {isLoading && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-t-theuyir-yellow border-r-theuyir-pink border-b-theuyir-yellow border-l-theuyir-pink rounded-full animate-spin"></div>
            <div className="mt-4 text-center font-medium text-theuyir-darkgrey">{loadingText}</div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
            <div 
              className="h-full bg-theuyir-yellow transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
