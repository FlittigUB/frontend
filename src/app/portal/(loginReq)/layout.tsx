'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuthContext } from '@/context/AuthContext';
import { usePreviousPath } from "@/context/PreviousPathContext";

interface ProtectedPortalRouteLayoutProps {
  children: React.ReactNode;
}

const ProtectedPortalRouteLayout: React.FC<ProtectedPortalRouteLayoutProps> = ({
                                                                                 children,
                                                                               }) => {
  return (
    <AuthProvider>
      <EnsureLoggedIn>{children}</EnsureLoggedIn>
    </AuthProvider>
  );
};

const EnsureLoggedIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { loggedIn, isAuthLoading } = useAuthContext();
  const { setPreviousPath } = usePreviousPath();

  useEffect(() => {
    // Once we know the user is not loading and not logged in, redirect to login
    if (!isAuthLoading && !loggedIn) {
      const currentPath = window.location.pathname;
      setPreviousPath(currentPath);
      router.replace(`/portal/logg-inn?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [loggedIn, isAuthLoading, router, setPreviousPath]);

  // Optionally render a loading state while auth is being determined
  if (isAuthLoading) {
    return <div>Loading...</div>;
  }

  // If logged in, just render the children
  return <div className="pb-20">{children}</div>;
};

export default ProtectedPortalRouteLayout;
