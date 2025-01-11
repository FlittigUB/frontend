'use client';

import React, { useEffect, useState, createContext, useContext } from 'react';
import LoadingLogo from '@/components/NSRVLoader';
import ChatModal from '@/components/portal/chat/ChatModal';
import { FiMessageSquare } from 'react-icons/fi';
import Navbar from '@/components/portal/layout/Navbar';
import { useOptionalAuthContext } from '@/context/AuthContext';
import { useRouter } from "next/navigation";
import { usePreviousPath } from "@/context/PreviousPathContext";

interface PortalLayoutProps {
  children: React.ReactNode;
}

// 1) Create a context so children can call openChatWithReceiver
interface PortalLayoutContextValue {
  openChatWithReceiver: (receiverId: string) => void;
}
const PortalLayoutContext = createContext<PortalLayoutContextValue | undefined>(undefined);

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
  const [isDarkMode, setIsDarkMode] = useState(false);

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
      // If on /portal/login and logged in, redirect to previousPath or /dashboard
      if (currentPath.startsWith('/portal/login')) {
        if (previousPath && !previousPath.startsWith('/portal/login')) {
          router.replace(previousPath);
        } else {
          router.replace('/dashboard'); // Safe fallback route
        }
      }
    } else {
      // If on any /portal/... route except /portal/login, redirect to /portal/login with redirect query
      if (currentPath.startsWith('/portal') && !currentPath.startsWith('/portal/login')) {
        // Set the previous path to currentPath before redirecting
        setPreviousPath(currentPath);
        router.replace(`/portal/login?redirect=${encodeURIComponent(currentPath)}`);
      }
    }
  }, [loggedIn, isAuthLoading, previousPath, router, setPreviousPath]);

  // Show a loading spinner if auth is still loading
  if (isAuthLoading) {
    return <LoadingLogo />;
  }

  return (
    <PortalLayoutContext.Provider value={{ openChatWithReceiver }}>
      <div
        className={`flex h-screen flex-col ${
          isDarkMode ? 'bg-background-dark text-foreground-dark' : 'bg-gray-50 text-foreground'
        }`}
      >
        <Navbar onOpenChat={() => openChatWithReceiver('')} />

        <main className="flex flex-1 justify-center overflow-y-auto">
          <div className="w-full max-w-4xl">{children}</div>
        </main>

        {/* Floating button: only show on md+ */}
        {loggedIn && (
          <>
            <button
              onClick={() => openChatWithReceiver('')}
              // Or pass some default or empty receiver
              className="
                hidden md:flex
                fixed md:bottom-6 md:right-6
                p-4 rounded-full shadow-lg
                bg-yellow-400 hover:bg-yellow-500
                text-white transition items-center justify-center
              "
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
