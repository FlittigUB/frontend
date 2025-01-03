'use client';

import { FormEvent } from 'react';
import { FiSmile, FiSend } from 'react-icons/fi';

interface ChatInputProps {
  messageInput: string;
  setMessageInputAction: (val: string) => void;
  handleSendMessageAction: (e: FormEvent) => void;
}

export default function ChatInput({
  messageInput,
  setMessageInputAction,
  handleSendMessageAction,
}: ChatInputProps) {
  return (
    <form
      onSubmit={handleSendMessageAction}
      className="flex items-center rounded-b-xl border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="relative flex w-full items-center rounded-full bg-white shadow-sm dark:bg-gray-900">
        <button
          type="button"
          className="absolute left-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
          aria-label="Add Emoji"
        >
          <FiSmile className="h-5 w-5" />
        </button>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInputAction(e.target.value)}
          placeholder="Write a message..."
          className="w-full bg-transparent px-10 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none dark:text-gray-100"
        />
        <button
          type="submit"
          className="absolute right-2 rounded-full bg-yellow-500 p-2 text-white transition hover:bg-yellow-600"
          aria-label="Send Message"
        >
          <FiSend className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}
