'use client';

import { useEffect, useState, useRef } from 'react';
import useAuth from '@/hooks/useAuth';
import { Message, User } from "@/common/types";

interface UseChatProps {
  receiverId?: string;
}

export default function useChat({ receiverId }: UseChatProps) {
  const { loggedIn, token } = useAuth();
  const [receiver, setReceiver] = useState<User | null>(null);
  const [isReceiverOnline, setIsReceiverOnline] = useState<boolean>(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL;

  // 1. Load the “receiver” user from your API
  useEffect(() => {
    if (receiverId && token) {
      (async function loadReceiver() {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/${receiverId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          if (res.ok) {
            const data = await res.json();
            setReceiver(data.user);
          } else {
            console.error('Failed to fetch receiver data:', res.statusText);
          }
        } catch (error) {
          console.error('Error fetching receiver data:', error);
        }
      })();
    }
  }, [receiverId, token]);

  // 2. Initialize the WebSocket and event handlers
  useEffect(() => {
    if (loggedIn && token && receiverId) {
      const socket = new WebSocket(
        `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/chat?token=${token}&receiver=${receiverId}`
      );
      setWs(socket);

      socket.onopen = () => {
        console.log('Connected to WebSocket server');
      };

      socket.onerror = (err) => {
        console.error('WebSocket error:', err);
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          switch (payload.event) {
            case 'messageToClient': {
              const newMessage: Message = {
                id: payload.data.id,
                content: payload.data.content,
                user: payload.data.user,
                timestamp: payload.data.timestamp,
                read: payload.data.read,
                type: payload.data.type ?? 'user',
                sentByCurrentUser: payload.data.sentByCurrentUser,
              };
              setMessages((prev) => [...prev, newMessage]);
              break;
            }
            case 'messageToClientHistory': {
              console.log(payload.data.type);
              const history: Message[] = payload.data.map((msg: any) => ({
                id: msg.id,
                content: msg.content,
                user: msg.user,
                timestamp: msg.timestamp,
                read: msg.read,
                type: msg.type ?? 'user',
                sentByCurrentUser: msg.sentByCurrentUser,
              }));
              setMessages(history);
              break;
            }
            case 'systemMessageToClient': {
              // A system message from the server
              const systemMsg: Message = {
                id: payload.data.id,
                content: payload.data.content,
                timestamp: payload.data.timestamp,
                type: payload.data.type, // 'system'
                action: payload.data.action ?? undefined,
                read: payload.data.read ?? false,
                // Typically false, unless you want to treat system as "sent by me"
                sentByCurrentUser: false,
              };
              setMessages((prev) => [...prev, systemMsg]);
              break;
            }
            case 'userPresenceUpdate': {
              const { userId, online } = payload.data;
              if (userId === receiverId) {
                setIsReceiverOnline(online);
              }
              break;
            }
            default:
              console.warn('Unknown WebSocket event:', payload.event);
          }
        } catch (err) {
          console.error('Error parsing WS message:', err);
        }
      };

      socket.onclose = () => {
        console.log('WebSocket connection closed');
      };

      return () => {
        socket.close();
      };
    }
  }, [loggedIn, token, receiverId]);

  // 3. Auto-scroll to the bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 4. Send a new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = messageInput.trim();
    if (!trimmed || !ws || ws.readyState !== WebSocket.OPEN) return;

    if (receiverId) {
      const payload = {
        content: trimmed,
        receiver: receiverId,
      };
      ws.send(JSON.stringify(payload));
      setMessageInput('');
    }
  };

  return {
    loggedIn,
    receiver,
    isReceiverOnline,
    messages,
    messageInput,
    setMessageInput,
    handleSendMessage,
    messagesEndRef,
    ASSETS_URL,
  };
}
