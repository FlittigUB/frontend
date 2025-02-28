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
  profileCompleted: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loggedIn, token, userRole, user, isAuthLoading, profileCompleted } = useAuth();

  return (
    <AuthContext.Provider value={{ loggedIn, token, userRole, user, isAuthLoading, profileCompleted }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const useOptionalAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      loggedIn: false,
      token: null,
      userRole: null,
      user: null,
      isAuthLoading: false,
      profileCompleted: false,
    };
  }
  return context;
};

export default AuthContext;
