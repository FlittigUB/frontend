// app/portal/(loginReq)/layout.tsx
'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';

interface PublicPortalRouteLayoutProps {
  children: React.ReactNode;
}

const PublicPortalRouteLayout: React.FC<PublicPortalRouteLayoutProps> = ({
  children,
}) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

export default PublicPortalRouteLayout;
