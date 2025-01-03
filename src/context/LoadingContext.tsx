// src/context/LoadingContext.tsx
'use client';
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from 'react';

interface LoadingContextType {
  startLoading: () => void;
  stopLoading: () => void;
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loadingCount, setLoadingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize startLoading and stopLoading to maintain stable references
  const startLoading = useCallback(
    () => setLoadingCount((count) => count + 1),
    [],
  );
  const stopLoading = useCallback(
    () => setLoadingCount((count) => Math.max(count - 1, 0)),
    [],
  );

  useEffect(() => {
    if (loadingCount > 0) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      setIsLoading(true);
    } else {
      // Debounce hiding the loader by 300ms
      debounceTimerRef.current = setTimeout(() => {
        setIsLoading(false);
        debounceTimerRef.current = null;
      }, 300);
    }

    // Cleanup on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [loadingCount]);

  return (
    <LoadingContext.Provider value={{ startLoading, stopLoading, isLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
