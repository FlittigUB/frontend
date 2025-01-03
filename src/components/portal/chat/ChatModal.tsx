'use client';

import React, { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';

import ConversationsList, { Conversation } from './ConversationsList';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import useChat from '@/hooks/useChat';

interface ChatModalProps {
  isOpen: boolean; // Whether the modal is open
  onCloseAction: () => void; // Handler to close the entire modal
}

/**
 * ChatModal – a single modal that can show:
 *   1) Conversation list
 *   2) Individual chat
 *
 * On mobile → full screen
 * On desktop → bottom-right floating window
 */
export default function ChatModal({ isOpen, onCloseAction }: ChatModalProps) {
  // State: 'list' or 'chat'
  const [view, setView] = useState<'list' | 'chat'>('list');

  // Which user (receiver) we’re chatting with
  const [selectedReceiverId, setSelectedReceiverId] = useState<string>('');

  // For your conversation list
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConversations, setLoadingConversations] =
    useState<boolean>(false);

  // The custom chat hook
  const {
    loggedIn,
    receiver,
    isReceiverOnline,
    messages,
    messageInput,
    setMessageInput,
    handleSendMessage,
    messagesEndRef,
    ASSETS_URL,
  } = useChat({ receiverId: selectedReceiverId });

  // 1) **Always** call your useEffect, even if `isOpen` or `loggedIn` is false
  useEffect(() => {
    if (loggedIn && view === 'list') {
      (async function loadConversations() {
        try {
          setLoadingConversations(true);
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/conversations`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            },
          );
          if (res.ok) {
            const data = await res.json();
            setConversations(data.conversations || []);
          } else {
            console.error('Failed to fetch conversations:', res.statusText);
          }
        } catch (error) {
          console.error('Error fetching conversations:', error);
        } finally {
          setLoadingConversations(false);
        }
      })();
    }
  }, [loggedIn, view]);

  // 2) If the user selects a conversation
  const handleSelectConversation = (receiverId: string) => {
    setSelectedReceiverId(receiverId);
    setView('chat');
  };

  // -------------------------------------------------------------------------
  // RENDER LOGIC
  // -------------------------------------------------------------------------

  // (A) If modal is not open, just return null (so it’s unmounted)
  if (!isOpen) {
    return null;
  }

  // (B) If user is not logged in, show something else
  if (!loggedIn) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
        Ikke innlogget...
      </div>
    );
  }

  // (C) If we are in "list" view, show the list of conversations
  if (view === 'list') {
    return (
      <div
        className={`fixed bottom-0 right-0 z-50 flex h-screen w-screen flex-col rounded-t-xl bg-white shadow-lg transition-all dark:bg-gray-800 md:bottom-4 md:right-4 md:h-[600px] md:w-[400px] md:rounded-xl`}
      >
        <ConversationsList
          conversations={conversations}
          isLoading={loadingConversations}
          ASSETS_URL={ASSETS_URL}
          onCloseAction={onCloseAction}
          onSelectConversationAction={handleSelectConversation}
        />
      </div>
    );
  }

  // (D) Otherwise, if "chat" view
  return (
    <div
      className={`fixed bottom-0 right-0 z-50 flex h-screen w-screen flex-col rounded-t-xl bg-white shadow-lg transition-all dark:bg-gray-800 md:bottom-4 md:right-4 md:h-[600px] md:w-[400px] md:rounded-xl`}
    >
      {/* Header bar with "back" button + "close" button */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
        <button
          onClick={() => setView('list')}
          className="flex items-center space-x-1 rounded-full p-2 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
          aria-label="Go to conversation list"
        >
          <FiArrowLeft className="h-5 w-5" />
          <span className="text-sm">Tilbake</span>
        </button>
        <button
          onClick={onCloseAction}
          className="rounded-full p-2 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          ✕
        </button>
      </div>

      {/* If we haven’t loaded the receiver yet, show a loading message */}
      {!receiver && (
        <div className="flex flex-1 items-center justify-center text-gray-500 dark:text-gray-400">
          Laster chat...
        </div>
      )}

      {receiver && (
        <>
          <ChatHeader
            receiver={receiver}
            isReceiverOnline={isReceiverOnline}
            ASSETS_URL={ASSETS_URL}
            onClose={onCloseAction}
          />
          <ChatMessages
            messages={messages}
            messagesEndRef={messagesEndRef}
            ASSETS_URL={ASSETS_URL}
          />
          <ChatInput
            messageInput={messageInput}
            setMessageInputAction={setMessageInput}
            handleSendMessageAction={handleSendMessage}
          />
        </>
      )}
    </div>
  );
}
