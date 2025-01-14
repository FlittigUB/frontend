// app/layout.tsx or app/layout.jsx

import type { Metadata } from 'next';
import './globals.css';
import React from 'react';
import { Toaster } from 'sonner';
import InsightsScript from '@/components/analytics/PlausibleScript';

export const metadata: Metadata = {
  title: 'Flittig UB | Småjobber gjort enkelt',
  description: 'Flittig UB gjør det enkelt å finne eller tilby småjobber lokalt. Barnepass, rengjøring og mer – raskt og trygt i ditt nærmiljø!',
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
        <Toaster richColors position="top-right" closeButton />
        {children}
      </body>
    </html>
  );
}
