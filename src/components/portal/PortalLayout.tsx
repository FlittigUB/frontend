// src/components/portal/layout/PortalLayout.tsx
'use client';

import React, { useEffect, useState } from 'react';
import NavigationBar from '@/components/portal/layout/navigation/NavigationBar';
import useAuth from '@/hooks/useAuth';
import LoadingLogo from '@/components/NSRVLoader';
import ChatModal from '@/components/portal/chat/ChatModal';
import { FiMessageSquare } from 'react-icons/fi';

interface PortalLayoutProps {
  children: React.ReactNode;
}

const PortalLayout: React.FC<PortalLayoutProps> = ({ children }) => {
  const { loggedIn } = useAuth(); // No 'loading' from useAuth

  // Manage dark mode state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // State to control whether ChatModal is open
  const [isChatOpen, setIsChatOpen] = useState(false);

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

  // Handler to open chat modal
  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  // Handler to close chat modal
  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <div
      className={`flex h-screen flex-col ${
        isDarkMode
          ? 'bg-background-dark text-foreground-dark'
          : 'bg-gray-50 text-foreground'
      }`}
    >
      {/* Navigation Bar */}
      {/*
         Pass handleOpenChat to the NavigationBar so that
         on mobile, it can call setIsChatOpen(true).
      */}
      <NavigationBar onOpenChat={handleOpenChat} />

      {/* Main Content Area */}
      <main className="flex flex-1 justify-center overflow-y-auto">
        {/* Centered Card */}
        <div className="w-full max-w-4xl">{children}</div>
      </main>

      {/* Floating button in the bottom-right corner: only show on md+ (desktop/tablet) */}
      <button
        onClick={handleOpenChat}
        className="
          hidden           /* Hide on mobile */
          md:flex         /* Show on md+ */
          fixed
          md:bottom-6
          md:right-6
          p-4
          rounded-full
          shadow-lg
          bg-yellow-400
          hover:bg-yellow-500
          text-white
          transition
          items-center
          justify-center
        "
        aria-label="Open Chat"
      >
        Meldinger
        <FiMessageSquare className="ml-2 h-6 w-6" />
      </button>

      {/* Chat Modal included in the layout */}
      <ChatModal
        isOpen={isChatOpen}
        onCloseAction={handleCloseChat}
      />
    </div>
  );
};

export default PortalLayout;
