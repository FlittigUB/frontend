'use client';

import Image from 'next/image';
import Link from 'next/link';
import { User } from '@/common/types';

interface ChatHeaderProps {
  receiver: User;
  isReceiverOnline: boolean;
  ASSETS_URL: string | undefined;
  onClose?: () => void; // optional, if you want a close button for your modal
}

export default function ChatHeader({
  receiver,
  isReceiverOnline,
  ASSETS_URL,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between rounded-t-xl border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      {/* Left side */}
      <div className="flex items-center space-x-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200">
          <Image
            src={
              receiver.image
                ? `${ASSETS_URL}/${receiver.image}`
                : `${ASSETS_URL}ff6b7c58-020c-4db6-a858-cf0f8dba744c.webp`
            }
            alt={`${receiver.name || receiver.email} profile`}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <Link
            href={`/portal/profil/${receiver.id}`}
            className="block text-sm font-semibold text-gray-800 dark:text-gray-200"
          >
            {receiver.name || receiver.email}
          </Link>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {isReceiverOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    </div>
  );
}
