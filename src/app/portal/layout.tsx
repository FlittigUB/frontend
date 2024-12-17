// app/portal/layout.tsx
'use client';

import React from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { AuthProvider } from '@/context/AuthContext';

interface PortalRouteLayoutProps {
  children: React.ReactNode;
}

const PortalRouteLayout: React.FC<PortalRouteLayoutProps> = ({ children }) => {
  return (
    <AuthProvider>
      <PortalLayout>{children}</PortalLayout>
    </AuthProvider>
  );
};

export default PortalRouteLayout;
