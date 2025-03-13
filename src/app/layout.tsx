// app/layout.tsx or app/layout.jsx
import './globals.css';
import React, { ReactNode } from 'react';
import InsightsScript from '@/components/analytics/PlausibleScript';
import GoogleTagManager from '@/components/analytics/GoogleTagManager';
import { FooterSection } from '@/components/ui/footer-section';
import { Toaster } from 'sonner';

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
