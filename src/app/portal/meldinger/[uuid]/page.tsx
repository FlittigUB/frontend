'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import useAuth from '@/hooks/useAuth';
import { FiArrowLeft, FiSend } from 'react-icons/fi';
import Link from 'next/link';

interface Message {
  id: string;
  content: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    image?: string;
  };
  timestamp?: string;
  read?: boolean;
  sentByCurrentUser?: boolean;
}

interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

export default function MessagePage() {
  const params = useParams();
  const { loggedIn, token } = useAuth();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');

  const receiverId = params?.uuid?.toString();
  const receiverIdRef = useRef<string | undefined>(receiverId);
  const [receiver, setReceiver] = useState<User | null>(null);
  const [isReceiverOnline, setIsReceiverOnline] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL;

  useEffect(() => {
    receiverIdRef.current = receiverId;
  }, [receiverId]);

  // Fetch receiver details
  useEffect(() => {
    const fetchReceiver = async () => {
      if (receiverId && token) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/users/${receiverId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (response.ok) {
            const data = await response.json();
            setReceiver(data.user);
          } else {
            console.error(
              'Failed to fetch receiver data:',
              response.statusText,
            );
          }
        } catch (error) {
          console.error('Error fetching receiver data:', error);
        }
      }
    };

    fetchReceiver();
  }, [receiverId, token]);

  // WebSocket Setup
  useEffect(() => {
    if (loggedIn && token && receiverId) {
      const webSocket = new WebSocket(
        `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/chat?token=${token}`,
      );
      setWs(webSocket);

      webSocket.onopen = () => console.log('Connected to WebSocket server');
      webSocket.onerror = (error) => console.error('WebSocket error:', error);

      webSocket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);

          if (payload.event === 'messageToClient') {
            const newMessage: Message = {
              id: payload.data.id,
              content: payload.data.content,
              user: payload.data.user,
              timestamp: payload.data.timestamp,
              read: payload.data.read,
              sentByCurrentUser: payload.data.sentByCurrentUser,
            };

            if (
              newMessage.user?.id === receiverIdRef.current ||
              newMessage.sentByCurrentUser
            ) {
              setMessages((prev) => [...prev, newMessage]);
            }
          } else if (payload.event === 'messageToClientHistory') {
            const historyMessages: Message[] = payload.data.map((msg: any) => ({
              id: msg.id,
              content: msg.content,
              user: msg.user,
              timestamp: msg.timestamp,
              read: msg.read,
              sentByCurrentUser: msg.sentByCurrentUser,
            }));

            const filteredHistory = historyMessages.filter(
              (msg) =>
                msg.user?.id === receiverIdRef.current || msg.sentByCurrentUser,
            );
            setMessages(filteredHistory);
          } else if (payload.event === 'userPresenceUpdate') {
            const { userId, online } = payload.data;
            if (userId === receiverIdRef.current) {
              setIsReceiverOnline(online);
            }
          }
        } catch (err) {
          console.error('Error parsing incoming message:', err);
        }
      };

      webSocket.onclose = () => console.log('WebSocket connection closed');

      return () => {
        webSocket.close();
      };
    }
  }, [loggedIn, token, receiverId]);

  // Scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = messageInput.trim();
    if (
      ws &&
      ws.readyState === WebSocket.OPEN &&
      trimmedMessage !== '' &&
      receiverId
    ) {
      const messagePayload = {
        content: trimmedMessage,
        receiver: receiverId,
      };
      ws.send(JSON.stringify(messagePayload));
      setMessageInput('');
    }
  };

  if (!loggedIn) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (!receiver) {
    return (
      <div className="flex h-full items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">Receiver not found.</h1>
      </div>
    );
  }

  return (
    <div className="flex h-3/4 w-full flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-100 p-4 shadow">
        <Link href="/portal/meldinger" className="flex items-center">
          <FiArrowLeft className="mr-2" />
          Tilbake
        </Link>
        <div className="flex items-center space-x-4">
          <Image
            src={
              receiver.image
                ? `${ASSETS_URL}/${receiver.image}`
                : '/assets/default.png'
            }
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="font-semibold">{receiver.name || receiver.email}</p>
            <p className="text-sm text-gray-500">
              {isReceiverOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 ${
              msg.sentByCurrentUser ? 'text-right' : 'text-left'
            }`}
          >
            <p
              className={`inline-block max-w-xs rounded p-2 ${
                msg.sentByCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {msg.content}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="flex bg-gray-100 p-4">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-l border p-2"
        />
        <button
          type="submit"
          className="rounded-r bg-blue-500 px-4 text-white hover:bg-blue-600"
        >
          <FiSend />
        </button>
      </form>
    </div>
  );
}
