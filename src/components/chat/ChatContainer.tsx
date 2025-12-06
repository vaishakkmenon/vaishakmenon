// Main chat container with auto-scroll and layout

"use client";

import { useEffect, useRef } from 'react';
import { Message } from '@/lib/types/chat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatError } from './ChatError';
import { ChatWelcome } from './ChatWelcome';

interface ChatContainerProps {
  messages: Message[];
  loading: boolean;
  error: string | null;
  onSend: (message: string) => void;
  onRetry: () => void;
  onClear?: () => void;
}

export function ChatContainer({
  messages,
  loading,
  error,
  onSend,
  onRetry,
  onClear,
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col max-w-3xl mx-auto px-4 py-24">
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

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Error display */}
      {error && <ChatError error={error} onRetry={onRetry} />}

      {/* Input */}
      <ChatInput onSend={onSend} disabled={loading} />
    </div>
  );
}
