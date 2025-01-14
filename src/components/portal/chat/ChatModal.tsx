'use client';

import React, { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import ConversationsList, { Conversation } from './ConversationsList';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import useChat from '@/hooks/useChat';

interface ChatModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  initialReceiverId?: string;
}

export default function ChatModal({ isOpen, onCloseAction, initialReceiverId = '' }: ChatModalProps) {
  const [view, setView] = useState<'list' | 'chat'>('list');
  const [selectedReceiverId, setSelectedReceiverId] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState<boolean>(false);

  // If `initialReceiverId` changes, open directly to the chat view
  useEffect(() => {
    if (initialReceiverId) {
      setSelectedReceiverId(initialReceiverId);
      setView('chat');
    }
  }, [initialReceiverId]);

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
            }
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

  function handleSelectConversation(receiverId: string) {
    setSelectedReceiverId(receiverId);
    setView('chat');
  }

  return (
    <>
      {/* The "backdrop" – if you want a dark overlay, uncomment background-color or do something custom */}
      <div
        className={`
          fixed inset-0 z-50
          flex items-end justify-end
          transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} // optional backdrop
        onClick={onCloseAction} // Close modal when clicking on backdrop
      >
        {/* The chat modal container */}
        <div
          className={`
            md:mb-4 md:mr-4
            h-screen w-screen md:h-[600px] md:w-[400px]
            flex flex-col rounded-t-xl bg-white shadow-lg dark:bg-gray-800 md:rounded-xl

            // Slide/fade in-out transitions
            transform transition-all duration-300 ease-in-out
            ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
          `}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        >
          {/* If user not logged in */}
          {!loggedIn ? (
            <div className="flex h-full items-center justify-center text-white">
              Ikke innlogget...
              <button
                onClick={onCloseAction}
                className="ml-4 rounded-full bg-gray-200 px-3 py-1 text-gray-700"
              >
                Lukk
              </button>
            </div>
          ) : (
            <>
              {view === 'list' ? (
                <ConversationsList
                  conversations={conversations}
                  isLoading={loadingConversations}
                  ASSETS_URL={ASSETS_URL}
                  onCloseAction={onCloseAction}
                  onSelectConversationAction={handleSelectConversation}
                />
              ) : (
                <>
                  {/* Header with back/close */}
                  <div className="flex items-center justify-between border-b border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-800">
                    <button
                      onClick={() => setView('list')}
                      className="flex items-center space-x-1 rounded-full p-2 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
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
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
