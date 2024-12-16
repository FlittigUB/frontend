// src/app/portal/soknader/layout.tsx

'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';

interface SoknaderLayoutProps {
  children: React.ReactNode;
}

const SoknaderLayout: React.FC<SoknaderLayoutProps> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default SoknaderLayout;
