'use client';

import React from 'react';
import Image from 'next/image';

export interface Conversation {
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

interface ConversationsListProps {
  conversations: Conversation[];
  isLoading?: boolean;
  ASSETS_URL?: string;
  onSelectConversationAction: (userId: string) => void;
  onCloseAction?: () => void; // If you want a "close" button at top
  MESSAGE_CHAR_LIMIT?: number;
}

export default function ConversationsList({
  conversations,
  isLoading,
  ASSETS_URL,
  onSelectConversationAction,
  onCloseAction,
  MESSAGE_CHAR_LIMIT = 50,
}: ConversationsListProps) {
  return (
    <div className="flex h-full w-full flex-col">
      {/* Top bar / header area */}
      <div className="flex items-center justify-between rounded-t-xl border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Dine Meldinger
        </h2>
        {onCloseAction && (
          <button
            onClick={onCloseAction}
            className="rounded-full p-2 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            ✕
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900">
        {isLoading && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Laster samtaler...
          </div>
        )}
        {!isLoading && conversations.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Ingen samtaler funnet.
          </div>
        )}
        <ul className="space-y-4">
          {conversations.map((conv) => {
            const user = conv.user;
            const lastMsg = conv.lastMessage;
            return (
              <li
                key={user.id}
                onClick={() => onSelectConversationAction(user.id)}
                className="flex items-center space-x-3 rounded-lg bg-white p-2 shadow transition hover:cursor-pointer hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <Image
                  src={`${ASSETS_URL}/${user.image || 'default.png'}`}
                  alt={`${user.name || user.email}'s avatar`}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {user.name || user.email}
                  </div>
                  <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {lastMsg.content.length > MESSAGE_CHAR_LIMIT
                      ? lastMsg.content.slice(0, MESSAGE_CHAR_LIMIT) + '...'
                      : lastMsg.content}
                  </div>
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {new Date(lastMsg.timestamp).toLocaleDateString()}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
