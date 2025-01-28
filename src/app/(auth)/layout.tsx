// src/app/(auth)/layout.tsx
'use client';

import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="">
      <main className="">
        {/* Centered Card */}
        <div className="">{children}</div>
      </main>
    </div>
  );
};

export default AuthLayout;
