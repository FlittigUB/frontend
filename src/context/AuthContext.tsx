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
  // 1) Provide these fields from useAuth
  const { loggedIn, token, userRole, user, isAuthLoading } = useAuth();

  return (
    <AuthContext.Provider value={{ loggedIn, token, userRole, user, isAuthLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 2) Use this in “protected” contexts or anywhere you need
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// 3) The optional version: doesn't throw
export const useOptionalAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    // fallback: user not logged in
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
