'use client';

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Message } from "@/common/types";

interface ChatMessagesProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  ASSETS_URL: string | undefined;
  onSystemAction?: (actionId: string, payload?: any) => void;
}

export default function ChatMessages({
                                       messages,
                                       messagesEndRef,
                                       ASSETS_URL = '',
                                       onSystemAction,
                                     }: ChatMessagesProps) {
  return (
    <ScrollArea className="flex-1 px-4 py-2">
      <ul className="space-y-4">
        {messages.map((msg) => {
          // System message
          if (msg.type === 'system') {
            return (
              <li key={msg.id} className="flex justify-center">
                <div className="max-w-sm rounded-md bg-accent p-3 text-center text-accent-foreground">
                  <div className="text-sm font-semibold">{msg.content}</div>
                  {msg.action && (
                    <div className="mt-2">
                      <button
                        onClick={() =>
                          onSystemAction?.(msg.action!.id, msg.action!.payload)
                        }
                        className="rounded bg-primary px-3 py-1 text-primary-foreground hover:opacity-90"
                      >
                        {msg.action.label}
                      </button>
                    </div>
                  )}
                  {msg.timestamp && (
                    <div className="mt-1 text-xs text-muted-foreground">
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

          // Normal user message
          return (
            <li
              key={msg.id}
              className={`flex ${
                msg.sentByCurrentUser ? 'justify-end' : 'justify-start'
              } items-end`}
            >
              {!msg.sentByCurrentUser && msg.user && (
                <Avatar className="mr-2 h-8 w-8">
                  <AvatarImage
                    src={
                      msg.user.image
                        ? `${ASSETS_URL}/${msg.user.image}`
                        : `${ASSETS_URL}ff6b7c58-020c-4db6-a858-cf0f8dba744c.webp`
                    }
                    alt={msg.user.email}
                  />
                  <AvatarFallback>
                    {(msg.user.name || msg.user.email)?.[0] ?? 'U'}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-sm rounded-md px-3 py-2 text-sm ${
                  msg.sentByCurrentUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                <div>{msg.content}</div>
                {msg.timestamp && (
                  <div className="mt-1 text-right text-[0.7rem] opacity-70">
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
    </ScrollArea>
  );
}
