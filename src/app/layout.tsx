// app/layout.tsx or app/layout.jsx

import type { Metadata } from 'next';
import './globals.css';
import React from 'react';

export const metadata: Metadata = {
  title: 'Flittig UB',
  description: 'En app for å hjelpe deg med småjobber.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <body className="antialiased">
    {children}
    </body>
    </html>
  );
}
