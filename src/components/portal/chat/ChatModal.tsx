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

export default function ChatModal({
                                    isOpen,
                                    onCloseAction,
                                    initialReceiverId = '',
                                  }: ChatModalProps) {
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

  // Handle any system actions from system messages
  function handleSystemAction(actionId: string, payload?: any) {
    if (actionId === 'mark_task_complete') {
      // Example of calling your backend
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks/complete`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId: payload?.taskId }),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to mark task complete');
          // Possibly refresh messages or show success
        })
        .catch((err) => console.error(err));
    }
  }

  // Example of a pinned system announcement
  let someSystemAnnouncement;
  // someSystemAnnouncement = "This is a pinned system notice.";

  return (
    <>
      {/* Dark backdrop (optional) */}
      <div
        className={`
          fixed inset-0 z-50
          flex items-end justify-end
          transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onCloseAction}
      >
        {/* The chat modal container */}
        <div
          className={`
            md:mb-4 md:mr-4
            h-screen w-screen md:h-[600px] md:w-[400px]
            flex flex-col rounded-t-xl bg-white shadow-lg dark:bg-gray-800 md:rounded-xl

            transform transition-all duration-300 ease-in-out
            ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
          `}
          onClick={(e) => e.stopPropagation()}
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
                      />
                      {/* Optional pinned system announcement */}
                      {someSystemAnnouncement && (
                        <div className="flex items-center justify-between bg-blue-50 p-3 text-blue-700 dark:bg-blue-900 dark:text-blue-100">
                          <div>{someSystemAnnouncement}</div>
                          <button
                            onClick={() =>
                              handleSystemAction('mark_task_complete', {
                                taskId: '1234',
                              })
                            }
                            className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                          >
                            Mark Task Complete
                          </button>
                        </div>
                      )}
                      <ChatMessages
                        messages={messages}
                        messagesEndRef={messagesEndRef}
                        ASSETS_URL={ASSETS_URL}
                        onSystemAction={handleSystemAction}
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
