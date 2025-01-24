// app/layout.tsx or app/layout.jsx

import type { Metadata } from 'next';
import './globals.css';
import React from 'react';
import { Toaster } from 'sonner';
import InsightsScript from '@/components/analytics/PlausibleScript';
import GoogleTagManager from '@/components/analytics/GoogleTagManager';

export const metadata: Metadata = {
  title: 'Flittig | Småjobber gjort enkelt med Flittig UB',
  description:
    'Trenger du barnepass, rengjøring eller hagearbeid? Flittig gjør det enkelt å koble lokalt talent med deg som trenger en hjelpende hånd!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <InsightsScript />
        <GoogleTagManager/>
        <Toaster richColors position="top-right" closeButton />
        {children}
      </body>
    </html>
  );
}
