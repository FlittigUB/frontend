// app/portal/layout.tsx
'use client';

import React from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { AuthProvider } from '@/context/AuthContext';
import { PreviousPathProvider } from "@/context/PreviousPathContext";

interface PortalRouteLayoutProps {
  children: React.ReactNode;
}

const PortalRouteLayout: React.FC<PortalRouteLayoutProps> = ({ children }) => {
  return (
    <AuthProvider>
      <PreviousPathProvider>
        <PortalLayout>
          {children}
        </PortalLayout>
      </PreviousPathProvider>
    </AuthProvider>
  );
};

export default PortalRouteLayout;
