// app/portal/layout.tsx
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import PortalLayout from '@/components/portal/PortalLayout';
import { AuthProvider } from '@/context/AuthContext';
import { PreviousPathProvider } from '@/context/PreviousPathContext';
import { StripeProvider } from '@/context/StripeContext';
import { GlobalChatProvider } from '@/context/GlobalChatProvider';
import { ThemeProvider } from '@/components/theme-provider';
import { NotificationsProvider } from "@/context/NotificationsContext";
import { Toaster } from "sonner";
//import NotificationsList from "@/components/portal/ui/NotificationsList"; // Import for typing

interface PortalRouteLayoutProps {
  children: React.ReactNode;
}

// Dynamically import the named export ThemeProvider with proper typing
const DynamicThemeProvider = dynamic<
  React.ComponentProps<typeof ThemeProvider>['children'] extends React.ReactNode
    ? React.ComponentProps<typeof ThemeProvider>
    : never
>(
  () => import('@/components/theme-provider').then((mod) => mod.ThemeProvider),
  { ssr: false }
);

const PortalRouteLayout: React.FC<PortalRouteLayoutProps> = ({ children }) => {
  return (
    <AuthProvider>
      <StripeProvider>
        <DynamicThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PreviousPathProvider>
            <NotificationsProvider>
            <GlobalChatProvider>
              {
                // TODO FIX toast
              }
              <Toaster richColors closeButton position="top-right"/>
              <PortalLayout>
                {children}
                {
                  //<NotificationsList/>
                }
              </PortalLayout>
            </GlobalChatProvider>
            </NotificationsProvider>
          </PreviousPathProvider>
        </DynamicThemeProvider>
      </StripeProvider>
    </AuthProvider>
  );
};

export default PortalRouteLayout;
