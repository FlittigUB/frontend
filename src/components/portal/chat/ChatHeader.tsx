'use client';

import React from 'react';
import { User } from '@/common/types';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatHeaderProps {
  receiver: User;
  isReceiverOnline: boolean;
  ASSETS_URL: string | undefined;
}

export default function ChatHeader({
                                     receiver,
                                     isReceiverOnline,
                                     ASSETS_URL = '',
                                   }: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-3 border-b px-4 py-3">
      <Avatar className="h-10 w-10">
        <AvatarImage
          src={
            receiver.image
              ? `${ASSETS_URL}/${receiver.image}`
              : `${ASSETS_URL}ff6b7c58-020c-4db6-a858-cf0f8dba744c.webp`
          }
          alt={receiver.name || receiver.email}
        />
        <AvatarFallback>
          {(receiver.name || receiver.email)?.[0] ?? 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col leading-tight">
        <Link
          href={`/portal/profil/${receiver.id}`}
          className="text-sm font-semibold hover:underline"
        >
          {receiver.name || receiver.email}
        </Link>
        <span className="text-xs text-muted-foreground">
          {isReceiverOnline ? 'Online' : 'Offline'}
        </span>
      </div>
    </div>
  );
}
