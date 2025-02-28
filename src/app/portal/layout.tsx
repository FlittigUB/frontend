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
import { NotificationsProvider } from '@/context/NotificationsContext';
import useAuth from '@/hooks/useAuth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
  { ssr: false },
);

const PortalRouteLayout: React.FC<PortalRouteLayoutProps> = ({ children }) => {
  const { loggedIn, userRole, profileCompleted, user } = useAuth();
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
                <PortalLayout>
                  {loggedIn &&
                    user &&
                    userRole === 'arbeidstaker' &&
                    !profileCompleted && (
                      <Alert className="flex items-center gap-2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_ASSETS_URL}722b612f-b083-4a34-bef7-4b884bbeb2dc.png`}
                          alt={'Benny bever maskott'}
                          width={75}
                          height={75}
                          className="shrink-0"
                        />
                        <div>
                          <AlertTitle>
                            Du er ett steg unna å søke på jobber!
                          </AlertTitle>
                          <AlertDescription>
                            Du mangler en konto for utbetaling. Klikk på lenken
                            under for å fullføre din konto.
                          </AlertDescription>
                          {
                            // TODO create account link upon registration of arbeidstaker
                          }
                          {user.account_url ? (
                            <Button asChild variant="link">
                              <Link href={user.account_url}></Link>
                            </Button>
                          ) : (
                            <p>
                              Det er et problem med din konto. Kontakt
                              kundeservice for å fullføre konto
                            </p>
                          )}
                        </div>
                      </Alert>
                    )}
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
