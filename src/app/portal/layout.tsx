// app/portal/layout.tsx
'use client';

import React from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { AuthProvider } from '@/context/AuthContext';
import { PreviousPathProvider } from '@/context/PreviousPathContext';
import { StripeProvider } from '@/context/StripeContext';
import { GlobalChatProvider } from '@/context/GlobalChatProvider';

interface PortalRouteLayoutProps {
  children: React.ReactNode;
}

const PortalRouteLayout: React.FC<PortalRouteLayoutProps> = ({ children }) => {
  return (
    <AuthProvider>
      <StripeProvider>
      <PreviousPathProvider>
        <GlobalChatProvider>
        <PortalLayout>
          {children}
        </PortalLayout>
        </GlobalChatProvider>
      </PreviousPathProvider>
      </StripeProvider>
    </AuthProvider>
  );
};

export default PortalRouteLayout;
