'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import LoadingLogo from '@/components/NSRVLoader';
import ChatModal from '@/components/portal/chat/ChatModal';
import { FiMessageSquare } from 'react-icons/fi';
import Navbar from '@/components/portal/layout/Navbar';
import { useOptionalAuthContext } from '@/context/AuthContext';
import BackButton from '@/components/common/BackButton';

interface PortalLayoutProps {
  children: React.ReactNode;
}

// Create a context so children can call openChatWithReceiver if needed
interface PortalLayoutContextValue {
  openChatWithReceiver: (receiverId: string) => void;
}
const PortalLayoutContext = createContext<PortalLayoutContextValue | undefined>(
  undefined
);

export function usePortalLayout() {
  const ctx = useContext(PortalLayoutContext);
  if (!ctx) {
    throw new Error('usePortalLayout must be used within PortalLayout');
  }
  return ctx;
}

const PortalLayout: React.FC<PortalLayoutProps> = ({ children }) => {
  const { loggedIn, isAuthLoading } = useOptionalAuthContext();

  // Manage dark mode state
  const [, setIsDarkMode] = useState(false);

  // State to control whether the ChatModal is open
  const [isChatOpen, setIsChatOpen] = useState(false);
  // State for which user (receiver) we want to chat with
  const [selectedReceiverId, setSelectedReceiverId] = useState('');

  // Load the user's preferred theme (if stored)
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark');
    }
  }, []);

  // Handler to open the chat modal for a specific receiver
  const openChatWithReceiver = (receiverId: string) => {
    setSelectedReceiverId(receiverId);
    setIsChatOpen(true);
  };

  // Handler to close the chat modal
  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  // NOTE: The redirection logic from before has been removed
  // so this public layout does not redirect to login.

  // Show a loading spinner if auth is still loading
  if (isAuthLoading) {
    return <LoadingLogo />;
  }

  return (
    <PortalLayoutContext.Provider value={{ openChatWithReceiver }}>
      <div className="mb-16 flex h-screen flex-col bg-background md:mb-0">
        <Navbar onOpenChat={() => openChatWithReceiver('')} />

        <main className="flex flex-1 justify-center overflow-y-auto">
          <div className="pd:mb-0 container mx-auto w-full max-w-4xl px-4 py-8 pb-16">
            <BackButton />
            {children}
          </div>
        </main>

        {/* Floating chat button – only visible if logged in */}
        {loggedIn && (
          <>
            <button
              onClick={() => openChatWithReceiver('')}
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
              initialReceiverId={selectedReceiverId}
            />
          </>
        )}
      </div>
    </PortalLayoutContext.Provider>
  );
};

export default PortalLayout;
