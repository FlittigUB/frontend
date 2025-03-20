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
import { loadStripe } from '@stripe/stripe-js'; // <-- import Stripe SDK
import axios from 'axios';

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
  const { loggedIn, userRole, profileCompleted, user, token } = useAuth();

  // Handler for employer identity verification
  const handleEmployerVerification = async () => {
    try {
      // Create verification session by calling your API endpoint.
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/createVerificationSession?userId=${user?.id}`,
        undefined,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log(response.data);
      // Adjust property name if your API returns client_secret or clientSecret.
      const clientSecret = response.data;
      console.log(clientSecret);
      if (!clientSecret) {
        console.error(
          'No client secret returned from verification session API.',
        );
        return;
      }
      // Load Stripe using your publishable key.
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
      );
      if (!stripe) {
        console.error('Stripe failed to load.');
        return;
      }
      // Use the client secret to launch the verification flow.
      // This example uses stripe.verifyIdentity(), which opens a modal.
      const result = await stripe.verifyIdentity(clientSecret);
      if (result.error) {
        console.error(result.error.message);
        // Optionally display an error alert to the user.
      } else {
        // Optionally handle successful verification completion.
        console.log('Identity verification initiated or completed:', result);
      }
    } catch (error) {
      console.error('Error during verification session creation:', error);
    }
  };

  return (
    <AuthProvider>
      <StripeProvider>
        <DynamicThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <PreviousPathProvider>
            <NotificationsProvider>
              <GlobalChatProvider>
                <PortalLayout>
                  {/* Existing alert for arbeidstaker */}
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
                          {user.account_url ? (
                            <Button asChild variant="default" className="mt-4">
                              <Link href={user.account_url}>Fullfør konto</Link>
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

                  {/* New alert for arbeidsgiver: Show if user is not verified */}
                  {loggedIn &&
                    user &&
                    userRole === 'arbeidsgiver' &&
                    !user.verified && (
                      <Alert className="flex items-center gap-2">
                        {/* Use a suitable image for identity verification */}
                        <Image
                          src={`${process.env.NEXT_PUBLIC_ASSETS_URL}722b612f-b083-4a34-bef7-4b884bbeb2dc.png`}
                          alt={'Verifiser identitet'}
                          width={75}
                          height={75}
                          className="shrink-0"
                        />
                        <div>
                          <AlertTitle>
                            Fullfør identitetsverifisering!
                          </AlertTitle>
                          <AlertDescription>
                            For å fortsette må du verifisere din identitet.
                            Klikk på knappen under for å starte prosessen.
                          </AlertDescription>
                          <Button
                            onClick={handleEmployerVerification}
                            variant="default"
                            className="mt-4"
                          >
                            Verifiser identitet
                          </Button>
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
