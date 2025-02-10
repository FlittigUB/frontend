'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import LoadingLogo from '@/components/NSRVLoader';
import ChatModal from '@/components/portal/chat/ChatModal';
import { FiMessageSquare } from 'react-icons/fi';
import Navbar from '@/components/portal/layout/Navbar';
import { useOptionalAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { usePreviousPath } from '@/context/PreviousPathContext';
import BackButton from '@/components/common/BackButton';

interface PortalLayoutProps {
  children: React.ReactNode;
}

// 1) Create a context so children can call openChatWithReceiver
interface PortalLayoutContextValue {
  openChatWithReceiver: (receiverId: string) => void;
}
const PortalLayoutContext = createContext<PortalLayoutContextValue | undefined>(
  undefined,
);

// 2) A simple hook for child components
export function usePortalLayout() {
  const ctx = useContext(PortalLayoutContext);
  if (!ctx) {
    throw new Error('usePortalLayout must be used within PortalLayout');
  }
  return ctx;
}

const PortalLayout: React.FC<PortalLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { loggedIn, isAuthLoading } = useOptionalAuthContext();
  const { previousPath, setPreviousPath } = usePreviousPath();

  // Manage dark mode state
  const [, setIsDarkMode] = useState(false);

  // State to control whether ChatModal is open
  const [isChatOpen, setIsChatOpen] = useState(false);

  // State for which user (receiver) we want to chat with
  const [selectedReceiverId, setSelectedReceiverId] = useState('');

  // Load user's preferred theme (if stored)
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark');
    }
  }, []);

  // Handler to open chat modal for a specific receiver
  const openChatWithReceiver = (receiverId: string) => {
    setSelectedReceiverId(receiverId);
    setIsChatOpen(true);
  };

  // Handler to close chat modal
  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  useEffect(() => {
    if (isAuthLoading) return; // Wait until auth state is loaded

    const currentPath = window.location.pathname;

    if (loggedIn) {
      // If on /portal/logg-inn and logged in, redirect to previousPath or /dashboard
      if (currentPath.startsWith('/portal/logg-inn')) {
        if (previousPath && !previousPath.startsWith('/portal/logg-inn')) {
          router.replace(previousPath);
        } else {
          router.replace('/dashboard'); // Safe fallback route
        }
      }
    } else {
      // If on any /portal/... route except /portal/logg-inn, redirect to /portal/logg-inn with redirect query
      if (
        currentPath.startsWith('/portal') &&
        !currentPath.startsWith('/portal/logg-inn') &&
        !currentPath.startsWith('/portal/stillinger')
      ) {
        // Set the previous path to currentPath before redirecting
        setPreviousPath(currentPath);
        router.replace(
          `/portal/logg-inn?redirect=${encodeURIComponent(currentPath)}`,
        );
      }
    }
  }, [loggedIn, isAuthLoading, previousPath, router, setPreviousPath]);

  // Show a loading spinner if auth is still loading
  if (isAuthLoading) {
    return <LoadingLogo />;
  }

  return (
    <PortalLayoutContext.Provider value={{ openChatWithReceiver }}>
      <div className={`mb-16 flex h-screen flex-col bg-background md:mb-0`}>
        <Navbar onOpenChat={() => openChatWithReceiver('')} />

        <main className="flex flex-1 justify-center overflow-y-auto">
          <div className="pd:mb-0 container mx-auto w-full max-w-4xl px-4 py-8 pb-16">
            <BackButton />
            {children}
          </div>
        </main>

        {/* Floating button: only show on md+ */}
        {loggedIn && (
          <>
            <button
              onClick={() => openChatWithReceiver('')}
              // Or pass some default or empty receiver
              className="fixed hidden items-center justify-center rounded-full bg-yellow-400 p-4 text-white shadow-lg transition hover:bg-yellow-500 md:bottom-6 md:right-6 md:flex z-50"
              aria-label="Open Chat"
            >
              Meldinger
              <FiMessageSquare className="ml-2 h-6 w-6" />
            </button>

            {/* Chat Modal */}
            <ChatModal
              isOpen={isChatOpen}
              onCloseAction={handleCloseChat}
              // pass the selectedReceiverId
              initialReceiverId={selectedReceiverId}
            />
          </>
        )}
      </div>
    </PortalLayoutContext.Provider>
  );
};

export default PortalLayout;
