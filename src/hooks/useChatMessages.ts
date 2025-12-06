// Custom hook for managing chat messages and API interactions

import { useState } from 'react';
import { Message } from '@/lib/types/chat';
import { sendChatMessage, generateSessionId } from '@/lib/api/chat';

const MAX_RETRIES = 1;

export function useChatMessages(sessionId: string, resetSession: () => void) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (question: string, retryCount = 0): Promise<void> => {
    // Clear any existing errors
    setError(null);

    // Add user message immediately (optimistic update)
    const userMessage: Message = {
      id: generateSessionId(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // Call API
      const response = await sendChatMessage({
        question,
        session_id: sessionId || undefined,
      });

      // Add assistant message with response
      const assistantMessage: Message = {
        id: generateSessionId(),
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
        confidence: response.confidence,
        grounded: response.grounded,
        timestamp: new Date(),
        rewrite_metadata: response.rewrite_metadata,
        ambiguity: response.ambiguity,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      // Handle session expiry - auto-reset and retry
      if (err.status === 404 && sessionId && retryCount < MAX_RETRIES) {
        resetSession();
        return sendMessage(question, retryCount + 1);
      }

      // Set error for all other cases
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setError(null);
  };

  const retryLastMessage = () => {
    // Find the last user message
    const lastUserMessage = [...messages]
      .reverse()
      .find((msg) => msg.role === 'user');

    if (lastUserMessage) {
      sendMessage(lastUserMessage.content);
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
    retryLastMessage,
  };
}
