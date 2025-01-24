// app/portal/stillinger/[slug]/layout.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { User } from '@/common/types';
import { fetchUser } from '@/app/portal/profil/[uuid]/fetchUser';
import UserProviderClient from '@/app/portal/profil/[uuid]/UserProviderClient';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ uuid: string }>;
}

/**
 * Layout component that fetches job data and provides it to children via context.
 */
const Layout: React.FC<LayoutProps> = async ({ children, params }) => {
  const { uuid } = await params;
  const user: User | null = await fetchUser(uuid);

  if (!user) {
    notFound();
  }

  return <UserProviderClient user={user}>{children}</UserProviderClient>;
};

export default Layout;
