'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Dialog, DialogPortal, DialogContent } from '@/components/ui/dialog';
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

  // Hook-based chat functionality
  const {
    loggedIn,
    receiver,
    isReceiverOnline,
    messages,
    messageInput,
    setMessageInput,
    handleSendMessage,
    ASSETS_URL,
  } = useChat({ receiverId: selectedReceiverId });

  // Create a ref for autoscroll in ChatMessages
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversation list when user is logged in & in 'list' view
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

  // Select a conversation => switch to chat view
  function handleSelectConversation(receiverId: string) {
    setSelectedReceiverId(receiverId);
    setView('chat');
  }

  // Example: handle system actions (e.g., "mark task complete")
  function handleSystemAction(actionId: string, payload?: any) {
    if (actionId === 'mark_task_complete') {
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

  // Example pinned system announcement; set to null if unused
  const someSystemAnnouncement: string | null = null;
  // someSystemAnnouncement = "This is a pinned system notice.";

  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogPortal>
        {/*
          We remove DialogOverlay to avoid a backdrop
          and position the dialog in bottom-right
        */}
        <div className="fixed bottom-4 right-4 z-50 flex items-end justify-end">
          <DialogContent
            className="
              m-0 p-0
              h-[600px] w-[400px]
            "
          >
            {/* If not logged in, display a fallback */}
            {!loggedIn ? (
              <div className="flex h-full flex-col items-center justify-center p-4">
                <p className="mb-2 text-sm text-muted-foreground">
                  Ikke innlogget...
                </p>
                <Button variant="secondary" onClick={onCloseAction}>
                  Lukk
                </Button>
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
                  <div className="flex h-full flex-col">
                    {/* Header area */}
                    <div className="flex items-center justify-between border-b p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setView('list')}
                      >
                        <FiArrowLeft className="mr-1.5 h-4 w-4" />
                        Tilbake
                      </Button>
                    </div>

                    {!receiver && (
                      <div className="flex flex-1 items-center justify-center">
                        <p className="text-sm text-muted-foreground">Laster chat...</p>
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
                          <div className="bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-900 dark:text-blue-100">
                            <div className="flex items-center justify-between">
                              <span>{someSystemAnnouncement}</span>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() =>
                                  handleSystemAction('mark_task_complete', {
                                    taskId: '1234',
                                  })
                                }
                              >
                                Mark Task Complete
                              </Button>
                            </div>
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
                  </div>
                )}
              </>
            )}
          </DialogContent>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
