// src/context/AuthContext.tsx

import React, { createContext, useContext } from 'react';
import useAuth from '@/hooks/useAuth';
import { User, UserRole } from '@/common/types';

interface AuthContextType {
  loggedIn: boolean;
  token: string | null;
  userRole: UserRole | null;
  user: User | null;
  isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loggedIn, token, userRole, user, isAuthLoading } = useAuth();

  return (
    <AuthContext.Provider value={{ loggedIn, token, userRole, user, isAuthLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    // If there's no AuthProvider above, we throw:
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// 1) NEW: Optional hook that does NOT throw if no provider is found
export const useOptionalAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  // If no provider, return fallback "logged out" data
  if (!context) {
    return {
      loggedIn: false,
      token: null,
      userRole: null,
      user: null,
      isAuthLoading: false
    };
  }
  return context;
};

export default AuthContext;
