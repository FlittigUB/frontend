// app/layout.tsx or app/layout.jsx
import './globals.css';
import React, { ReactNode } from 'react';
import InsightsScript from '@/components/analytics/PlausibleScript';
import GoogleTagManager from '@/components/analytics/GoogleTagManager';
import { FooterSection } from '@/components/ui/footer-section';
import { Toaster } from 'sonner';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Flittig UB – Plattform for småjobber',
  description:
    'Flittig UB kobler voksne og eldre som trenger hjelp med småjobber med unge som ønsker en ekstra inntekt. Finn jobber innen rengjøring, barnepass og mer.',
  openGraph: {
    title: 'Flittig UB – Plattform for småjobber',
    description:
      'Oppdag en enkel måte å finne hjelp eller tjene ekstra penger på. Flittig UB tilbyr småjobber innen ulike kategorier, tilgjengelig for unge og voksne.',
    url: 'https://flittigub.no/',
    siteName: 'Flittig UB',
    images: [
      {
        url: 'https://panel.flittigub.no/assets/06fff057-65a8-446d-a5c5-93e62af9623a.png',
        width: 1200,
        height: 630,
        alt: 'Flittig UB – Finn eller tilby småjobber enkelt',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flittig UB – Plattform for småjobber',
    description:
      'Koble deg til jobber i ditt nærområde og tjen ekstra penger med Flittig UB.',
    images: [
      'https://panel.flittigub.no/assets/06fff057-65a8-446d-a5c5-93e62af9623a.png',
    ],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
    <body>
    {/* AnimatePresence tracks route changes and can animate out the old page, in the new page */}
        <InsightsScript/>
        <GoogleTagManager/>
        <Toaster richColors closeButton position="top-right"/>
          {children}
        <FooterSection/>
    </body>
    </html>
  );
}
