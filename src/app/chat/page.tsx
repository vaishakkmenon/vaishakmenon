// Main chat page

'use client';

import { useChatSession } from '@/hooks/useChatSession';
import { useChatMessages } from '@/hooks/useChatMessages';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export default function ChatPage() {
  const { sessionId, resetSession, apiStatus, recheckHealth } = useChatSession();
  const { messages, loading, error, sendMessage, clearMessages, retryLastMessage, stopGeneration } = useChatMessages(
    sessionId,
    resetSession
  );

  const handleClear = () => {
    clearMessages();
    resetSession();
  };

  return (
    <main>
      <ErrorBoundary fallback={
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-lg font-medium mb-2">Chat is temporarily unavailable</p>
            <a href="/" className="text-blue-400 underline">Return home</a>
          </div>
        </div>
      }>
        <ChatContainer
          messages={messages}
          loading={loading}
          error={error}
          onSend={sendMessage}
          onRetry={retryLastMessage}
          onClear={handleClear}
          onStop={stopGeneration}
          apiStatus={apiStatus}
          onRecheckHealth={recheckHealth}
        />
      </ErrorBoundary>
    </main>
  );
}
