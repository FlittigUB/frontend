'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiPhone } from 'react-icons/fi';
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
  onClose,
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
                : '/assets/default.png'
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
      {/* Right side (call or close buttons) */}
      <div className="flex items-center space-x-4">
        <a
          href="tel:123456789"
          className="rounded-full p-2 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
          aria-label="Call"
        >
          <FiPhone className="h-5 w-5" />
        </a>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label="Close chat"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
