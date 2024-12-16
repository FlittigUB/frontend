'use client';

import React, { useEffect, useState } from 'react';
import NavigationBar from '@/components/portal/layout/navigation/NavigationBar';
import useAuth from '@/hooks/useAuth';
import Spinner from '@/components/common/Spinner';

interface PortalLayoutProps {
  children: React.ReactNode;
}

const PortalLayout: React.FC<PortalLayoutProps> = ({ children }) => {
  const { loggedIn } = useAuth();

  // Manage dark mode state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load user's preferred theme (if stored in localStorage or context)
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark');
    }
  }, []);

  // Toggle dark mode
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
/*  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light'); // Save preference
  };*/

  // While authentication is being verified, show nothing or a loader
  if (!loggedIn) {
    return (
      <>
        <Spinner />
      </>
    );
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
        <div className="mt-12 w-full max-w-4xl">{children}</div>
      </main>
    </div>
  );
};

export default PortalLayout;
