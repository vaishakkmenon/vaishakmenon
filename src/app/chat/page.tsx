// Main chat page

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useChatSession } from '@/hooks/useChatSession';
import { useChatMessages } from '@/hooks/useChatMessages';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ChatOptions } from '@/lib/types/chat';

export default function ChatPage() {
  const { sessionId, resetSession, apiStatus, recheckHealth } = useChatSession();
  const { messages, loading, error, sendMessage, clearMessages, retryLastMessage, stopGeneration } = useChatMessages(
    sessionId,
    resetSession
  );

  // Chat options state (session only, not persisted)
  const [chatOptions, setChatOptions] = useState<ChatOptions>({
    model: null,  // null = default (groq)
    showThinking: false,
  });

  const handleClear = () => {
    clearMessages();
    resetSession();
  };

  const handleSend = (message: string) => {
    sendMessage(message, chatOptions);
  };

  return (
    <main>
      <ErrorBoundary fallback={
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-lg font-medium mb-2">Chat is temporarily unavailable</p>
            <Link href="/" className="text-blue-400 underline">Return home</Link>
          </div>
        </div>
      }>
        <ChatContainer
          messages={messages}
          loading={loading}
          error={error}
          sessionId={sessionId}
          onSend={handleSend}
          onRetry={retryLastMessage}
          onClear={handleClear}
          onStop={stopGeneration}
          apiStatus={apiStatus}
          onRecheckHealth={recheckHealth}
          chatOptions={chatOptions}
          onOptionsChange={setChatOptions}
        />
      </ErrorBoundary>
    </main>
  );
}
