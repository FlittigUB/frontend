// src/pages/portal/meldinger/page.tsx

'use client';

import PortalLayout from '@/components/portal/PortalLayout';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useAuth from '@/hooks/useAuth';

interface Conversation {
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string;
  };
  lastMessage: {
    content: string;
    timestamp: string;
    read: boolean;
  };
}

export default function ConversationsPage() {
  const { loggedIn, token, loading } = useAuth(); // **Handle 'loading' state**
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Base URL for assets
  const ASSETS_URL =
    process.env.NEXT_PUBLIC_ASSETS_URL || 'http://localhost:3003/assets/';

  // Character limit for last message content
  const MESSAGE_CHAR_LIMIT = 50;

  // Fetch conversations when logged in
  useEffect(() => {
    const fetchConversations = async () => {
      if (loggedIn && token) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/conversations`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            // Sort conversations by lastMessage.timestamp descending
            const sortedConversations = data.conversations.sort(
              (a: Conversation, b: Conversation) =>
                new Date(b.lastMessage.timestamp).getTime() -
                new Date(a.lastMessage.timestamp).getTime(),
            );
            setConversations(sortedConversations);
          } else {
            console.error('Failed to fetch conversations');
            const errorData = await response.text();
            console.error('Error response body:', errorData);
          }
        } catch (error) {
          console.error('Error fetching conversations:', error);
        }
      }
    };

    fetchConversations();
  }, [loggedIn, token]);

  // Neumorphic style classes:
  const cardClass =
    'bg-background rounded-xl shadow-neumorphic p-6 w-full flex flex-col h-full';
  const truncateClass = 'truncate overflow-hidden whitespace-nowrap';

  if (loading) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center h-full">
          <div className="loader"></div> {/* Ensure loader styles are defined */}
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className={cardClass}>
        <h1 className="mb-6 text-center text-3xl font-bold text-foreground">
          Dine Meldinger
        </h1>
        <div className="flex-1 w-full overflow-y-auto">
          <ul className="space-y-4">
            {conversations.map((conv) => (
              <li key={conv.user.id} className="flex items-center space-x-4">
                <Image
                  src={`${ASSETS_URL}/${conv.user.image || 'default.png'}`} // Fallback to default image
                  alt={`${conv.user.name || conv.user.email}'s Profile`}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover shadow-neumorphic-icon"
                />
                <div className="flex-1">
                  <Link
                    href={`/portal/meldinger/${conv.user.id}`}
                    className="text-xl font-semibold text-foreground hover:text-primary"
                  >
                    {conv.user.name || conv.user.email}
                  </Link>
                  <p className={`text-gray-600 ${truncateClass}`}>
                    {conv.lastMessage.content.length > MESSAGE_CHAR_LIMIT
                      ? `${conv.lastMessage.content.slice(0, MESSAGE_CHAR_LIMIT)}...`
                      : conv.lastMessage.content}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(conv.lastMessage.timestamp).toLocaleDateString()}
                </div>
              </li>
            ))}
            {conversations.length === 0 && (
              <li className="text-center text-gray-600">
                Ingen samtaler funnet.
              </li>
            )}
          </ul>
        </div>
      </div>
    </PortalLayout>
  );
}
