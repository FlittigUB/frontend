// src/context/AuthContext.tsx
'use client';
import React, { createContext, useContext, ReactNode } from 'react';
import useAuth from '../hooks/useAuth';
import { User, UserRole } from '@/common/types';

// Define the shape of your authentication context
interface AuthContextProps {
  loggedIn: boolean;
  token: string | null;
  userRole: UserRole;
  user: User | null;
  loading: boolean;
}

// Define the props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// Create the AuthContext with an initial value of undefined
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// AuthProvider component that wraps your app and provides authentication state
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
};
