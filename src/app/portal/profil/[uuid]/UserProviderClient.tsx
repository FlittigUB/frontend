// app/portal/stillinger/[slug]/JobProviderClient.tsx
'use client';

import React from 'react';
import { User } from '@/common/types';
import { UserProvider } from '@/app/portal/profil/[uuid]/UserContext';

interface UserProviderClientProps {
  user: User;
  children: React.ReactNode;
}

/**
 * Client component that provides job context to its children.
 */
const JobProviderClient: React.FC<UserProviderClientProps> = ({ user, children }) => {
  return <UserProvider user={user}>{children}</UserProvider>;
};

export default JobProviderClient;
