'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Message } from "@/common/types";
import useAuth from "@/hooks/useAuth"; // or your toast library of choice

interface GlobalChatContextType {
  messages: Message[];
  // ...any other bits of global data or methods
}

const GlobalChatContext = createContext<GlobalChatContextType>({
  messages: [],
});

export function GlobalChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [, setWs] = useState<WebSocket | null>(null);

  // Suppose you have a "useAuth" hook that gives you a token & user info
  const { loggedIn, token } = useAuth();

  useEffect(() => {
    if (!loggedIn || !token) return;

    // Connect your WebSocket at a higher level
    const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/chat?token=${token}`);
    setWs(socket);

    socket.onopen = () => {
      console.log('Global WebSocket connected');
    };

    socket.onerror = (err) => {
      console.error('Global WebSocket error:', err);
    };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        switch (payload.event) {
          case 'messageToClient': {
            const newMessage = {
              id: payload.data.id,
              content: payload.data.content,
              senderName: payload.data.user?.name || 'Unknown user',
              // ...
            };
            setMessages((prev) => [...prev, newMessage]);

            // **HERE** you show a toast notification
            // Maybe only show if it's NOT the user who sent it
            if (!payload.data.sentByCurrentUser) {
              toast.info(`Ny melding fra ${newMessage.senderName}`, {description: newMessage.content});
            }

            break;
          }
          // handle your other events like 'messageToClientHistory', 'userPresenceUpdate', etc.
          default:
            console.warn('Unknown event:', payload.event);
        }
      } catch (err) {
        console.error('Error parsing WS message:', err);
      }
    };

    socket.onclose = () => {
      console.log('Global WebSocket closed');
    };

    return () => {
      socket.close();
    };
  }, [loggedIn, token]);

  const value: GlobalChatContextType = {
    messages,
  };

  return (
    <GlobalChatContext.Provider value={value}>
      {children}
    </GlobalChatContext.Provider>
  );
}

// Export a simple hook for other components to use
export function useGlobalChat() {
  return useContext(GlobalChatContext);
}
