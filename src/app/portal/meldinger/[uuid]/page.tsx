// src/pages/portal/meldinger/[uuid].tsx

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import useAuth from '@/hooks/useAuth';
import { FiArrowLeft, FiPhone, FiSmile, FiSend } from 'react-icons/fi';
import Link from "next/link";

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
  const { loggedIn, token, loading } = useAuth();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');

  const receiverId = params?.uuid?.toString();
  const receiverIdRef = useRef<string | undefined>(receiverId);
  const [receiver, setReceiver] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const ASSETS_URL =
    process.env.NEXT_PUBLIC_ASSETS_URL || 'http://localhost:3003/assets';

  useEffect(() => {
    receiverIdRef.current = receiverId;
  }, [receiverId]);

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
            }
          );

          if (response.ok) {
            const data = await response.json();
            setReceiver(data.user);
          } else {
            console.error('Failed to fetch receiver data:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching receiver data:', error);
        }
      }
    };

    fetchReceiver();
  }, [receiverId, token]);

  useEffect(() => {
    if (loggedIn && token && receiverId) {
      const webSocket = new WebSocket(
        `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/chat?token=${token}`
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
              user: {
                id: msg.user.id.toString(),
                email: msg.user.email,
                name: msg.user.name,
                image: msg.user.image,
              },
              timestamp: msg.timestamp,
              read: msg.read,
              sentByCurrentUser: msg.sentByCurrentUser,
            }));

            const filteredHistory = historyMessages.filter(
              (msg) =>
                msg.user?.id === receiverIdRef.current ||
                msg.sentByCurrentUser
            );
            setMessages(filteredHistory);
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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loader"></div>
      </div>
    );
  }

  if (!receiver) {
    return (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-2xl font-bold text-red-500">
          Receiver not found.
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gradient-to-b from-background-gradient to-white dark:bg-background-dark md:w-4/5 lg:w-2/3 xl:w-[900px] mx-auto px-4 py-8 rounded-xl shadow-lg transition-shadow duration-300">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-header-gradient to-white dark:bg-gradient-to-r dark:from-background-dark dark:to-gray-800 flex items-center justify-between p-6 rounded-xl shadow-button dark:shadow-button-dark mb-4">
        <Link href="/portal/meldinger"
          className="flex items-center text-foreground dark:text-foreground-dark p-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition transform hover:scale-105"
          aria-label="Go Back"
        >
          <FiArrowLeft className="w-6 h-6 mr-2" />
          Tilbake
        </Link>
        <div className="flex items-center space-x-6">
          <Image
            src={
              receiver.image
                ? `${ASSETS_URL}/${receiver.image}`
                : '/assets/default.png'
            }
            alt={`${receiver.name || receiver.email}'s Profile`}
            width={60}
            height={60}
            className="rounded-full object-cover border border-gray-300 shadow-neumorphic-icon dark:shadow-neumorphic-icon-dark transition-shadow duration-300"
            loading="lazy"
          />
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-foreground dark:text-foreground-dark">
              {receiver.name || receiver.email}
            </h1>
            <span className="text-sm text-green-500 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
              Online
            </span>
          </div>
          <a
            href="tel:123456789"
            className="text-foreground dark:text-foreground-dark p-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition transform hover:scale-105"
            aria-label="Call"
          >
            <FiPhone className="w-6 h-6" />
          </a>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 w-full overflow-y-auto px-2 py-4 bg-gradient-to-b from-background-gradient to-white dark:bg-background-dark rounded-xl">
        <ul className="space-y-6">
          {messages.map((msg) => (
            <li
              key={msg.id}
              className={`flex ${
                msg.sentByCurrentUser ? 'justify-end' : 'justify-start'
              } animate-fade-in-up`}
            >
              {!msg.sentByCurrentUser && msg.user?.image ? (
                <Image
                  src={`${ASSETS_URL}/${msg.user.image}`}
                  alt="Sender's Profile"
                  width={40}
                  height={40}
                  className="mr-3 h-10 w-10 rounded-full object-cover border border-gray-300 shadow-neumorphic-icon dark:shadow-neumorphic-icon-dark transition-shadow duration-300"
                  loading="lazy"
                />
              ) : null}
              <div
                className={`max-w-md rounded-xl p-4 ${
                  msg.sentByCurrentUser
                    ? 'bg-gradient-to-br from-yellow-300 to-yellow-400 text-foreground dark:bg-gradient-to-br dark:from-yellow-500 dark:to-yellow-600 dark:text-foregroundDark'
                    : 'bg-secondary border border-gray-300 text-foreground dark:bg-background-dark dark:text-foreground-dark'
                } shadow-neumorphic dark:shadow-neumorphic-dark transition-shadow duration-300`}
              >
                <div className="text-sm">{msg.content}</div>
                {msg.timestamp && (
                  <div className="mt-2 text-xs text-gray-500 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                )}
              </div>
            </li>
          ))}
          <div ref={messagesEndRef} />
        </ul>
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center px-6 py-4 bg-secondary dark:bg-background-dark border-t border-gray-200 dark:border-gray-700 rounded-xl shadow-inner transition-colors duration-300"
      >
        <div className="relative flex items-center w-full bg-gray-100 dark:bg-gray-800 rounded-xl shadow-button dark:shadow-button-dark overflow-hidden">
          <button
            type="button"
            className="absolute left-2 p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition transform hover:scale-105"
            aria-label="Add Emoji"
          >
            <FiSmile className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 pl-12 pr-4 py-2 bg-transparent focus:outline-none text-foreground dark:text-foreground-dark placeholder-gray-400 dark:placeholder-gray-500"
            aria-label="Message Input"
          />
          <button
            type="submit"
            className="absolute right-2 bg-primary text-foreground dark:bg-primary dark:text-foregroundDark p-3 rounded-full hover:bg-yellow-400 dark:hover:bg-yellow-500 transition transform hover:scale-105 shadow-lg"
            aria-label="Send Message"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
