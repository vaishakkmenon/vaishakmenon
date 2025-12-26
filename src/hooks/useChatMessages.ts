// Custom hook for managing chat messages and API interactions

import { useState, useCallback, useRef } from 'react';
import { Message, StreamUpdate } from '@/lib/types/chat';
import { streamChatMessage, generateSessionId } from '@/lib/api/chat';

const MAX_RETRIES = 1;
const TYPING_SPEED_MS = 25; // Milliseconds per character for smooth typing

export function useChatMessages(sessionId: string, resetSession: () => void) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track current streaming message ID
  const streamingMessageIdRef = useRef<string | null>(null);

  // Typing animation refs
  const fullTextRef = useRef<string>('');
  const displayedLengthRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const stoppedRef = useRef<boolean>(false);

  const sendMessage = useCallback(
    async (question: string, retryCount = 0): Promise<void> => {
      setError(null);

      // Add user message immediately (optimistic update)
      const userMessage: Message = {
        id: generateSessionId(),
        role: 'user',
        content: question,
        timestamp: new Date(),
      };

      // Create placeholder for assistant message
      const assistantId = generateSessionId();
      streamingMessageIdRef.current = assistantId;

      // Reset typing animation state
      fullTextRef.current = '';
      displayedLengthRef.current = 0;
      stoppedRef.current = false;

      const assistantPlaceholder: Message = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
      setLoading(true);

      // Start typing animation interval - consistent 2 chars per tick
      const CHARS_PER_TICK = 2;

      typingIntervalRef.current = setInterval(() => {
        if (displayedLengthRef.current < fullTextRef.current.length) {
          displayedLengthRef.current = Math.min(
            displayedLengthRef.current + CHARS_PER_TICK,
            fullTextRef.current.length
          );

          const displayedText = fullTextRef.current.substring(0, displayedLengthRef.current);

          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.id !== assistantId) return msg;
              return { ...msg, content: displayedText };
            })
          );
        }
      }, TYPING_SPEED_MS);

      try {
        // Handle streaming updates - buffer the full text
        const handleUpdate = (update: StreamUpdate) => {
          if (update.answer !== undefined) {
            fullTextRef.current = update.answer;
          }

          // Update metadata immediately (not animated)
          if (update.sources || update.grounded !== undefined || update.ambiguity) {
            setMessages((prev) =>
              prev.map((msg) => {
                if (msg.id !== assistantId) return msg;
                return {
                  ...msg,
                  sources: update.sources ?? msg.sources,
                  grounded: update.grounded ?? msg.grounded,
                  ambiguity: update.ambiguity ?? msg.ambiguity,
                };
              })
            );
          }
        };

        // Create abort controller for this request
        abortControllerRef.current = new AbortController();

        // Stream the response
        const response = await streamChatMessage(
          { question, session_id: sessionId || undefined },
          handleUpdate,
          abortControllerRef.current.signal
        );

        // Wait for typing animation to complete (unless stopped)
        await new Promise<void>((resolve) => {
          const checkComplete = setInterval(() => {
            if (stoppedRef.current || displayedLengthRef.current >= fullTextRef.current.length) {
              clearInterval(checkComplete);
              resolve();
            }
          }, 50);
        });

        // If stopped, don't do final update
        if (stoppedRef.current) {
          return;
        }

        // Clear typing interval
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
        }

        // Final update with complete response
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id !== assistantId) return msg;
            return {
              ...msg,
              content: response.answer,
              sources: response.sources,
              confidence: response.confidence,
              grounded: response.grounded,
              rewrite_metadata: response.rewrite_metadata,
              ambiguity: response.ambiguity,
            };
          })
        );
      } catch (err: unknown) {
        // Clear typing interval on error
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
        }

        const error = err as Error & { status?: number };

        // If this was an intentional abort (user clicked Stop), don't treat as error
        if (error.name === 'AbortError') {
          // Keep the partial message visible, just stop loading
          return;
        }

        // Handle session expiry - auto-reset and retry
        if (error.status === 404 && sessionId && retryCount < MAX_RETRIES) {
          // Remove the placeholder messages before retry
          setMessages((prev) => prev.filter((msg) => msg.id !== assistantId));
          resetSession();
          return sendMessage(question, retryCount + 1);
        }

        // Remove placeholder assistant message on error
        setMessages((prev) => prev.filter((msg) => msg.id !== assistantId));
        setError(error.message || 'An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
        streamingMessageIdRef.current = null;
      }
    },
    [sessionId, resetSession]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const retryLastMessage = useCallback(() => {
    // Find the last user message
    const lastUserMessage = [...messages].reverse().find((msg) => msg.role === 'user');

    if (lastUserMessage) {
      // Remove the failed assistant response if there is one
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === 'assistant' && !lastMessage.content) {
        setMessages((prev) => prev.slice(0, -1));
      }
      sendMessage(lastUserMessage.content);
    }
  }, [messages, sendMessage]);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    // Set stopped flag to prevent final update
    stoppedRef.current = true;
    // Reset text refs to prevent stale content on next message
    fullTextRef.current = '';
    displayedLengthRef.current = 0;
    setLoading(false);
    streamingMessageIdRef.current = null;
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
    retryLastMessage,
    stopGeneration,
  };
}
