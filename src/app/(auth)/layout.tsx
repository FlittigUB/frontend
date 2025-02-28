// src/app/(auth)/layout.tsx
'use client';

import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
      <main>
        {/* Centered Card */}
        <div className="">{children}</div>
      </main>
  );
};

export default AuthLayout;
