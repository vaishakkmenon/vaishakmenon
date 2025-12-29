// Main chat container with auto-scroll and layout

'use client';

import { useEffect, useRef } from 'react';
import { Message, ApiStatus, ChatOptions } from '@/lib/types/chat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatError } from './ChatError';
import { ChatWelcome } from './ChatWelcome';

interface ChatContainerProps {
  messages: Message[];
  loading: boolean;
  error: string | null;
  sessionId?: string;
  onSend: (message: string) => void;
  onRetry: () => void;
  onClear?: () => void;
  onStop?: () => void;
  apiStatus?: ApiStatus;
  onRecheckHealth?: () => void;
  chatOptions?: ChatOptions;
  onOptionsChange?: (options: ChatOptions) => void;
}

export function ChatContainer({
  messages,
  loading,
  error,
  sessionId,
  onSend,
  onRetry,
  onClear,
  onStop,
  apiStatus = 'healthy',
  onRecheckHealth,
  chatOptions,
  onOptionsChange,
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isApiDown = apiStatus === 'unhealthy';

  return (
    <div className="min-h-screen flex flex-col max-w-3xl mx-auto px-4 py-24">
      {/* API Status Warning */}
      {isApiDown && (
        <div className="mb-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              Chat service is currently unavailable. Please try again later.
            </p>
            {onRecheckHealth && (
              <button
                onClick={onRecheckHealth}
                className="text-yellow-700 dark:text-yellow-300 text-sm underline hover:no-underline ml-4"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      )}

      {/* Header with optional clear button */}
      {messages.length > 0 && onClear && (
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Chat</h1>
          <button
            onClick={onClear}
            className="text-sm underline opacity-70 hover:opacity-100 transition-opacity"
          >
            Clear conversation
          </button>
        </div>
      )}

      {/* Messages list */}
      <div className="flex-1 mb-4 space-y-4">
        {messages.length === 0 && !loading && (
          <ChatWelcome onExampleClick={onSend} />
        )}

        {messages.map((message, index) => {
          // Last assistant message while loading = currently streaming
          const isLastMessage = index === messages.length - 1;
          const isStreaming = loading && isLastMessage && message.role === 'assistant';
          return (
            <ChatMessage
              key={message.id}
              message={message}
              isStreaming={isStreaming}
              sessionId={sessionId}
            />
          );
        })}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Error display */}
      {error && <ChatError error={error} onRetry={onRetry} />}

      {/* Input */}
      <ChatInput
        onSend={onSend}
        onStop={onStop}
        disabled={loading || isApiDown}
        isStreaming={loading}
        chatOptions={chatOptions}
        onOptionsChange={onOptionsChange}
        error={error}
      />
    </div>
  );
}
