// app/portal/components/PortalLayout.tsx

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavigationBar from '@/components/portal/navigation/NavigationBar';

interface PortalLayoutProps {
  children: React.ReactNode;
}

const PortalLayout: React.FC<PortalLayoutProps> = ({ children }) => {
  const router = useRouter();

  // Placeholder function to get user role; replace with actual logic
  const getUserRole = (): 'arbeidstaker' | 'arbeidsgiver' | null => {
    // Replace with your actual authentication and role retrieval logic
    // Example: return user.role;
    return 'arbeidstaker'; // or 'arbeidsgiver', or null if not logged in
  };

  const userRole = getUserRole();

  useEffect(() => {
    if (!userRole) {
      router.push('/portal/log-inn');
    }
  }, [userRole, router]);

  if (!userRole) {
    return null; // TODO: Loading spinner
  }

  return (
    <div className="dark:bg-background-dark dark:text-foreground-dark min-h-screen bg-background px-4 pb-16 pt-12 text-foreground">
      {children}
      <NavigationBar />
    </div>
  );
};

export default PortalLayout;
