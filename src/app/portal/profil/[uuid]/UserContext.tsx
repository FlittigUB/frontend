// app/portal/stillinger/[slug]/UserContext.tsx
'use client';

import React, { createContext, useContext } from 'react';
import { User } from '@/common/types';

interface UserContextProps {
  user: User;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

/**
 * Provider component to supply job data to child components.
 */
export const UserProvider: React.FC<{ user: User; children: React.ReactNode }> = ({ user, children }) => {
  return <UserContext.Provider value={{ user: user }}>{children}</UserContext.Provider>;
};

/**
 * Custom hook to consume job data from context.
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useJob must be used within a JobProvider');
  }
  return context.user;
};
