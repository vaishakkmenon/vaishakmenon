// Main chat page

"use client";

import { useChatSession } from '@/hooks/useChatSession';
import { useChatMessages } from '@/hooks/useChatMessages';
import { ChatContainer } from '@/components/chat/ChatContainer';

export default function ChatPage() {
  const { sessionId, resetSession } = useChatSession();
  const { messages, loading, error, sendMessage, clearMessages, retryLastMessage } = useChatMessages(
    sessionId,
    resetSession
  );

  const handleClear = () => {
    clearMessages();
    resetSession();
  };

  return (
    <main>
      <ChatContainer
        messages={messages}
        loading={loading}
        error={error}
        onSend={sendMessage}
        onRetry={retryLastMessage}
        onClear={handleClear}
      />
    </main>
  );
}
