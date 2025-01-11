'use client';

import React, { useState, FormEvent } from 'react';
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
  // Toggle showing the emoji “popup”
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // A small selection of emojis—customize as you please
  const emojis = [
    '😀', '😁', '😆', '🤣', '😊', '😇', '😍', '🤩',
    '🤔', '👋', '👌', '💯', '👏', '🔥', '🤙', '👍',
  ];

  // Insert the chosen emoji and collapse the picker
  function handleEmojiSelect(emoji: string) {
    setMessageInputAction(messageInput + emoji);
    setShowEmojiPicker(false);  // close picker automatically
  }

  return (
    <form
      onSubmit={handleSendMessageAction}
      className="relative flex items-center border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="relative flex w-full items-center rounded-full bg-white shadow-sm dark:bg-gray-900">
        {/* Emoji button – toggles the picker */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="absolute left-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
          aria-label="Add Emoji"
        >
          <FiSmile className="h-5 w-5" />
        </button>

        {/* Text input */}
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInputAction(e.target.value)}
          placeholder="Write a message..."
          className="w-full bg-transparent px-10 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none dark:text-gray-100"
        />

        {/* Send button */}
        <button
          type="submit"
          className="absolute right-2 rounded-full bg-yellow-500 p-2 text-white transition-colors hover:bg-yellow-600"
          aria-label="Send Message"
        >
          <FiSend className="h-5 w-5" />
        </button>
      </div>

      {/* Emoji picker popup */}
      {showEmojiPicker && (
        <div
          className="
            absolute bottom-[60px] left-2
            z-50
            w-[220px]
            rounded-md border border-gray-200 bg-white p-2 shadow-lg
            dark:border-gray-600 dark:bg-gray-700
          "
        >
          {/* A small arrow “tooltip style” (optional) */}
          {/*
            You can create a tail with a pseudo-element or an extra div.
            Example:
            <div className="absolute -bottom-2 left-4 h-0 w-0
                 border-x-8 border-x-transparent
                 border-t-8 border-t-white
                 dark:border-t-gray-700" />
          */}

          <div className="grid grid-cols-8 gap-1">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleEmojiSelect(emoji)}
                className="
                  rounded-md p-1 text-xl
                  transition-colors hover:bg-gray-100
                  dark:hover:bg-gray-600
                "
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
