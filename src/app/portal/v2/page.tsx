// app/portal/page.tsx

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PortalLayout from "@/components/portal/v2/PortalLayout";

const PortalPage: React.FC = () => {
  const router = useRouter();

  // Placeholder function to get user role; replace with actual logic
  const getUserRole = (): 'arbeidstaker' | 'arbeidsgiver' | null => {
    // Replace with your actual authentication and role retrieval logic
    return 'arbeidstaker'; // or 'arbeidsgiver', or null if not logged in
  };

  const userRole = getUserRole();

  useEffect(() => {
    if (!userRole) {
      router.push('/portal/log-inn');
    } else if (userRole === 'arbeidstaker') {
      router.push('/portal/v2/arbeidstaker');
    } else if (userRole === 'arbeidsgiver') {
      router.push('/portal/v2/arbeidsgiver');
    }
  }, [userRole, router]);

  return <PortalLayout>Loading...</PortalLayout>;
};

export default PortalPage;
