// src/app/(auth)/layout.tsx
'use client';

import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen flex-col bg-gradient-to-r from-yellow-200 to-yellow-300 text-foreground">
      <main className="flex flex-1 justify-center overflow-y-auto">
        {/* Centered Card */}
        <div className="mt-12 w-full max-w-4xl">{children}</div>
      </main>
    </div>
  );
};

export default AuthLayout;
