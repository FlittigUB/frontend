// app/layout.tsx or app/layout.jsx

import type { Metadata } from 'next';
import './globals.css';
import React from 'react';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Flittig UB',
  description: 'En app for å hjelpe deg med småjobber.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear(); // Fetch the current year

  return (
    <html lang="en">
    <body className="antialiased">
    {children}
    <Footer year={year} /> {/* Pass the year as a prop */}
    </body>
    </html>
  );
}
