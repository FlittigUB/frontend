'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import useAuth from '@/hooks/useAuth';
import { FiArrowLeft, FiPhone, FiSmile, FiSend } from 'react-icons/fi';
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

  // The ID of the receiver (the user we're chatting with)
  const receiverId = params?.uuid?.toString();

  // For storing details about the conversation partner
  const [receiver, setReceiver] = useState<User | null>(null);

  // For real-time presence
  const [isReceiverOnline, setIsReceiverOnline] = useState<boolean>(false);

  // Our WebSocket instance
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Chat messages
  const [messages, setMessages] = useState<Message[]>([]);

  // The user’s input
  const [messageInput, setMessageInput] = useState('');

  // For auto-scroll to the bottom of chat
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // For building profile image URLs
  const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL;

  /**
   * Load the "receiver" user from our API
   */
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

  /**
   * Initialize the WebSocket, passing our token & receiver ID
   */
  useEffect(() => {
    if (loggedIn && token && receiverId) {
      // Important: pass the receiver in the query string
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
                sentByCurrentUser: payload.data.sentByCurrentUser,
              };
              // Because the server filters for this conversation,
              // we can just add to the local array
              setMessages((prev) => [...prev, newMessage]);
              break;
            }

            case 'messageToClientHistory': {
              const history: Message[] = payload.data.map((msg: any) => ({
                id: msg.id,
                content: msg.content,
                user: msg.user,
                timestamp: msg.timestamp,
                read: msg.read,
                sentByCurrentUser: msg.sentByCurrentUser,
              }));
              setMessages(history);
              break;
            }

            case 'userPresenceUpdate': {
              const { userId, online } = payload.data;
              // If it's the receiver who changed presence, update local state
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

  /**
   * Auto-scroll down whenever messages change
   */
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  /**
   * Send new message to the server
   */
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = messageInput.trim();
    if (!trimmed || !ws || ws.readyState !== WebSocket.OPEN) return;

    if (receiverId) {
      // The server expects { content, receiver }
      const payload = {
        content: trimmed,
        receiver: receiverId,
      };
      ws.send(JSON.stringify(payload));
      setMessageInput('');
    }
  };

  /**
   * If user is not logged in, show a loader or redirect
   */
  if (!loggedIn) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  /**
   * If we don't have a receiver, show a fallback message
   */
  if (!receiver) {
    return (
      <div className="flex h-full items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">Receiver not found.</h1>
      </div>
    );
  }

  return (
    <div className="from-background-gradient dark:bg-background-dark flex h-3/4 w-full flex-col bg-gradient-to-b to-white transition-shadow duration-300">
      {/* Header */}
      <div className="dark:from-background-dark from-header-gradient mb-4 flex flex-none items-center justify-between rounded-xl bg-gradient-to-r to-white p-6 shadow-button dark:bg-gradient-to-r dark:to-gray-800 dark:shadow-button-dark">
        <Link
          href="/portal/meldinger"
          className="dark:text-foreground-dark flex transform items-center rounded-full p-3 text-foreground transition hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Go Back"
        >
          <FiArrowLeft className="mr-2 h-6 w-6" />
          Tilbake
        </Link>
        <div className="flex items-center space-x-6">
          <div className="group relative h-12 w-12 overflow-hidden rounded-full bg-gray-200 shadow-inner">
            <Image
              src={
                receiver.image
                  ? `${ASSETS_URL}/${receiver.image}`
                  : '/assets/default.png'
              }
              alt={`${receiver.name || receiver.email}'s Profile`}
              fill
              className="rounded-full border border-gray-300 object-cover shadow-neumorphic-icon transition-shadow duration-300 dark:shadow-neumorphic-icon-dark"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col">
            <Link
              href={`/portal/profil/${receiver.id}`}
              className="dark:text-foreground-dark text-xl font-semibold text-foreground"
            >
              {receiver.name || receiver.email}
            </Link>
            <span className="flex items-center text-sm">
              {isReceiverOnline ? (
                <>
                  <span className="mr-1 h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
                  <span className="text-green-500">Online</span>
                </>
              ) : (
                <>
                  <span className="mr-1 h-2 w-2 rounded-full bg-gray-400"></span>
                  <span className="text-gray-500">Offline</span>
                </>
              )}
            </span>
          </div>
          <a
            href="tel:123456789"
            className="dark:text-foreground-dark transform rounded-full p-3 text-foreground transition hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Call"
          >
            <FiPhone className="h-6 w-6" />
          </a>
        </div>
      </div>

      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto rounded-xl px-4 pb-4">
        <ul className="space-y-6 pt-2">
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
                  className="mr-3 h-10 w-10 rounded-full border border-gray-300 object-cover shadow-neumorphic-icon transition-shadow duration-300 dark:shadow-neumorphic-icon-dark"
                  loading="lazy"
                />
              ) : null}
              <div
                className={`max-w-md rounded-xl p-4 ${
                  msg.sentByCurrentUser
                    ? 'bg-gradient-to-br from-yellow-300 to-yellow-400 text-foreground dark:bg-gradient-to-br dark:from-yellow-500 dark:to-yellow-600 dark:text-foregroundDark'
                    : 'dark:bg-background-dark dark:text-foreground-dark border border-gray-300 bg-secondary text-foreground'
                } shadow-neumorphic transition-shadow duration-300 dark:shadow-neumorphic-dark`}
              >
                <div className="text-sm">{msg.content}</div>
                {msg.timestamp && (
                  <div className="mt-2 text-right text-xs text-gray-500">
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
        className="dark:bg-background-dark flex flex-none items-center rounded-xl border-t border-gray-200 bg-secondary px-6 py-4 shadow-inner transition-colors duration-300 dark:border-gray-700"
      >
        <div className="relative flex w-full items-center overflow-hidden rounded-xl bg-gray-100 shadow-button dark:bg-gray-800 dark:shadow-button-dark">
          <button
            type="button"
            className="absolute left-2 transform rounded-full p-2 text-gray-500 transition hover:scale-105 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label="Add Emoji"
          >
            <FiSmile className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Write a message..."
            className="dark:text-foreground-dark flex-1 bg-transparent py-2 pl-12 pr-4 text-foreground placeholder-gray-400 focus:outline-none dark:placeholder-gray-500"
            aria-label="Message Input"
          />
          <button
            type="submit"
            className="absolute right-2 transform rounded-full bg-primary p-3 text-foreground shadow-lg transition hover:scale-105 hover:bg-yellow-400 dark:bg-primary dark:text-foregroundDark dark:hover:bg-yellow-500"
            aria-label="Send Message"
          >
            <FiSend className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
