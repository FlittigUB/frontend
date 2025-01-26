'use client';

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface Conversation {
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string;
  };
  systemBroadcast?: string;
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
  onCloseAction?: () => void;
  MESSAGE_CHAR_LIMIT?: number;
}

export default function ConversationsList({
                                            conversations,
                                            isLoading,
                                            ASSETS_URL = '',
                                            onSelectConversationAction,
                                            onCloseAction,
                                            MESSAGE_CHAR_LIMIT = 50,
                                          }: ConversationsListProps) {
  return (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-semibold">Dine Meldinger</h2>
        {onCloseAction && (
          <Button variant="ghost" size="sm" onClick={onCloseAction}>
            ✕
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 bg-muted px-4 py-2">
        {isLoading ? (
          <div className="space-y-4">
            {/* You can show a few skeleton items */}
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="flex items-center p-3">
                <Skeleton className="h-10 w-10 rounded-full mr-3" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </Card>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">
            Ingen samtaler funnet.
          </div>
        ) : (
          <ul className="space-y-4 pb-4">
            {conversations.map((conv) => {
              const { user, lastMessage, systemBroadcast } = conv;
              const shortMessage =
                lastMessage.content.length > MESSAGE_CHAR_LIMIT
                  ? lastMessage.content.slice(0, MESSAGE_CHAR_LIMIT) + '...'
                  : lastMessage.content;

              return (
                <li key={user.id}>
                  <Card
                    onClick={() => onSelectConversationAction(user.id)}
                    className="flex w-full cursor-pointer items-center p-3 transition hover:bg-card/50"
                  >
                    <Avatar className="mr-3 h-10 w-10">
                      <AvatarImage
                        src={
                          user.image
                            ? `${ASSETS_URL}/${user.image}`
                            : `${ASSETS_URL}ff6b7c58-020c-4db6-a858-cf0f8dba744c.webp`
                        }
                        alt={user.name || user.email}
                      />
                      <AvatarFallback>
                        {(user.name || user.email).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="text-sm font-semibold">
                        {user.name || user.email}
                      </div>
                      <div className="text-xs text-muted-foreground">{shortMessage}</div>
                    </div>

                    <div className="ml-auto text-xs text-muted-foreground">
                      {new Date(lastMessage.timestamp).toLocaleDateString()}
                    </div>
                  </Card>

                  {systemBroadcast && (
                    <div className="mt-1 rounded-md bg-blue-50 p-2 text-xs text-blue-700 dark:bg-blue-900 dark:text-blue-100">
                      {systemBroadcast}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </ScrollArea>
    </div>
  );
}
