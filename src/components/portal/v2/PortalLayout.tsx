// app/portal/components/PortalLayout.tsx

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavigationBar from '@/components/portal/v2/NavigationBar';
import Image from 'next/image';

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
    return null; // Or a loading spinner
  }

  return (
    <div className="dark:bg-background-dark dark:text-foreground-dark min-h-screen bg-background px-4 pb-16 pt-12 text-foreground">
      <Image
        src={`${process.env.NEXT_PUBLIC_ASSETS_URL}b8c19b1d-652e-4ac1-9bbd-fd95ef7f4ff4.png`}
        alt="Flittig UB Logo"
        className="mx-auto md:mx-0 my-0"
        width={200}
        height={100}
      />
      {children}
      <NavigationBar />
    </div>
  );
};

export default PortalLayout;
