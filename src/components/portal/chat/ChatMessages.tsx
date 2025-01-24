'use client';

import Image from 'next/image';
import React from 'react';
import { Message } from "@/common/types";

interface ChatMessagesProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  ASSETS_URL: string | undefined;

  // Add a callback for system actions if needed
  onSystemAction?: (actionId: string, payload?: any) => void;
}

export default function ChatMessages({
                                       messages,
                                       messagesEndRef,
                                       ASSETS_URL,
                                       onSystemAction,
                                     }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4">
      <ul className="space-y-4 pt-2">
        {messages.map((msg) => {
          console.log(msg);
          // Check if it's a system message
          if (msg.type === 'system') {
            return (
              <li key={msg.id} className="flex justify-center">
                <div
                  className={`
                    max-w-sm rounded-xl p-3 text-center
                    bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100
                  `}
                >
                  <div className="text-sm font-semibold">
                    {msg.content}
                  </div>

                  {/* Example: If there's an action, show a button */}
                  {msg.action && (
                    <div className="mt-2">
                      <button
                        onClick={() =>
                          onSystemAction?.(msg.action!.id, msg.action!.payload)
                        }
                        className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                      >
                        {msg.action.label}
                      </button>
                    </div>
                  )}

                  {msg.timestamp && (
                    <div className="mt-1 text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  )}
                </div>
              </li>
            );
          }

          // Otherwise, render user message as normal
          return (
            <li
              key={msg.id}
              className={`flex ${
                msg.sentByCurrentUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* Show sender’s avatar if the user is not the current sender */}
              {!msg.sentByCurrentUser && msg.user?.image && (
                <Image
                  src={
                    msg.user.image
                      ? `${ASSETS_URL}/${msg.user.image}`
                      : `${ASSETS_URL}ff6b7c58-020c-4db6-a858-cf0f8dba744c.webp`
                  }
                  alt={`${msg.user.email}'s Profile`}
                  width={36}
                  height={36}
                  className="mr-2 h-9 w-9 rounded-full object-cover"
                />
              )}
              <div
                className={`max-w-sm rounded-xl p-3 ${
                  msg.sentByCurrentUser
                    ? 'bg-yellow-300 text-gray-800 dark:bg-yellow-600'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
                }`}
              >
                <div className="text-sm">{msg.content}</div>
                {msg.timestamp && (
                  <div className="mt-1 text-right text-xs text-gray-500">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                )}
              </div>
            </li>
          );
        })}
        <div ref={messagesEndRef} />
      </ul>
    </div>
  );
}
