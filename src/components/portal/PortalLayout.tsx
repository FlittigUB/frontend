// src/components/portal/layout/PortalLayout.tsx
'use client';

import React, { useEffect, useState } from 'react';
import NavigationBar from '@/components/portal/layout/navigation/NavigationBar';
import useAuth from '@/hooks/useAuth';
import LoadingLogo from '@/components/NSRVLoader';

interface PortalLayoutProps {
  children: React.ReactNode;
}

const PortalLayout: React.FC<PortalLayoutProps> = ({ children }) => {
  const { loggedIn } = useAuth(); // No 'loading' from useAuth

  // Manage dark mode state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load user's preferred theme (if stored in localStorage or context)
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark');
    }
  }, []);

  // While authentication or any global loading is being verified, show loader
  if (!loggedIn) {
    return <LoadingLogo />;
  }

  return (
    <div
      className={`flex h-screen flex-col ${
        isDarkMode
          ? 'bg-background-dark text-foreground-dark'
          : 'bg-background text-foreground'
      }`}
    >
      {/* Navigation Bar */}
      <NavigationBar />

      {/* Main Content Area */}
      <main className="flex flex-1 justify-center overflow-y-auto">
        {/* Centered Card */}
        <div className="w-full max-w-4xl">{children}</div>
      </main>
    </div>
  );
};

export default PortalLayout;
