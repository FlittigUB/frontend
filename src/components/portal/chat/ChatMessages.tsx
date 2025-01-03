'use client';

import Image from 'next/image';
import { Message } from '@/hooks/useChat';

interface ChatMessagesProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  ASSETS_URL: string | undefined;
}

export default function ChatMessages({
  messages,
  messagesEndRef,
  ASSETS_URL,
}: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4">
      <ul className="space-y-4 pt-2">
        {messages.map((msg) => (
          <li
            key={msg.id}
            className={`flex ${
              msg.sentByCurrentUser ? 'justify-end' : 'justify-start'
            }`}
          >
            {/* Show sender’s avatar if the user is not the current sender */}
            {!msg.sentByCurrentUser && msg.user?.image && (
              <Image
                src={`${ASSETS_URL}/${msg.user.image}`}
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
        ))}
        <div ref={messagesEndRef} />
      </ul>
    </div>
  );
}
