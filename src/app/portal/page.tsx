// app/portal/page.tsx

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PortalLayout from "@/components/portal/PortalLayout";
import { getUserRole } from "@/utils/auth";

const PortalPage: React.FC = () => {
  const router = useRouter();

  const userRole = getUserRole();

  useEffect(() => {
    if (!userRole) {
      router.push('/portal/log-inn');
    } else if (userRole === 'arbeidstaker') {
      router.push('/portal/arbeidstaker');
    } else if (userRole === 'arbeidsgiver') {
      router.push('/portal/arbeidsgiver');
    }
  }, [userRole, router]);

  return <PortalLayout>Laster...</PortalLayout>;
};

export default PortalPage;
