// app/portal/layout.tsx

import React from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { AuthProvider } from '@/context/AuthContext'; // Import AuthProvider

interface PortalRouteLayoutProps {
  children: React.ReactNode;
}

const PortalRouteLayout: React.FC<PortalRouteLayoutProps> = ({ children }) => {
  return (
    <AuthProvider>
      {' '}
      {/* Wrap with AuthProvider */}
      <PortalLayout>{children}</PortalLayout>
    </AuthProvider>
  );
};

export default PortalRouteLayout;
