// app/portal/page.tsx

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import LoadingLogo from '@/components/NSRVLoader';

const PortalPage: React.FC = () => {
  const router = useRouter();
  const { userRole, isAuthLoading } = useAuthContext();

  useEffect(() => {
    // Prevent redirection while authentication is loading
    if (isAuthLoading) return;

    if (!userRole) {
      router.push('/portal/arbeidstaker');
    } else if (userRole === 'arbeidstaker') {
      router.push('/portal/arbeidstaker');
    } else if (userRole === 'arbeidsgiver') {
      router.push('/portal/arbeidsgiver');
    }
  }, [userRole, isAuthLoading, router]);

  // Optionally, show a loading indicator while authentication is being checked
  if (isAuthLoading) {
    return <LoadingLogo />; // You can replace this with a spinner or any loading component
  }

  return <LoadingLogo />; // Or any fallback UI
};

export default PortalPage;
