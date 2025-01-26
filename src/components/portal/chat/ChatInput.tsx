'use client';

import React, { useState, FormEvent } from 'react';
import { FiSmile, FiSend } from 'react-icons/fi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojis = [
    '😀', '😁', '😆', '🤣', '😊', '😇', '😍', '🤩',
    '🤔', '👋', '👌', '💯', '👏', '🔥', '🤙', '👍',
  ];

  function handleEmojiSelect(emoji: string) {
    setMessageInputAction(messageInput + emoji);
  }

  return (
    <form onSubmit={handleSendMessageAction} className="border-t p-4">
      <div className="flex items-center space-x-2">
        <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <FiSmile className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[220px] p-2">
            <div className="grid grid-cols-8 gap-1">
              {emojis.map((emoji) => (
                <Button
                  key={emoji}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEmojiSelect(emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInputAction(e.target.value)}
          placeholder="Skriv en melding..."
          className="flex-1"
        />

        <Button type="submit" variant="default">
          <FiSend className="mr-1 h-4 w-4" />
          Send
        </Button>
      </div>
    </form>
  );
}
