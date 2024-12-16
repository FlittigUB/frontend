// app/portal/page.tsx

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

const PortalPage: React.FC = () => {
  const router = useRouter();

  const userRole = useAuth().userRole;

  useEffect(() => {
    if (!userRole) {
      router.push('/portal/logg-inn');
    } else if (userRole === 'arbeidstaker') {
      router.push('/portal/arbeidstaker');
    } else if (userRole === 'arbeidsgiver') {
      router.push('/portal/arbeidsgiver');
    }
  }, [userRole, router]);

  return <>Laster...</>;
};

export default PortalPage;
