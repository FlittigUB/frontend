'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PreviousPathContextType {
  previousPath: string | null;
  setPreviousPath: (path: string) => void;
}

const PreviousPathContext = createContext<PreviousPathContextType | undefined>(undefined);

export const PreviousPathProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [previousPath, setPreviousPathState] = useState<string | null>(null);

  useEffect(() => {
    // Exclude /portal/login and any /portal/... to prevent overwriting previousPath
    if (!pathname.startsWith('/portal/login') && !pathname.startsWith('/portal')) {
      setPreviousPathState(pathname);
    }
    // If the current path is /portal/login or /portal/..., keep previousPath unchanged
  }, [pathname]);

  const setPreviousPath = (path: string) => {
    setPreviousPathState(path);
  };

  return (
    <PreviousPathContext.Provider value={{ previousPath, setPreviousPath }}>
      {children}
    </PreviousPathContext.Provider>
  );
};

export const usePreviousPath = (): PreviousPathContextType => {
  const context = useContext(PreviousPathContext);
  if (!context) {
    throw new Error('usePreviousPath must be used within a PreviousPathProvider');
  }
  return context;
};
