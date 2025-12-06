// Custom hook for managing chat session ID with localStorage persistence

import { useState, useEffect } from 'react';
import { generateSessionId } from '@/lib/api/chat';

const SESSION_STORAGE_KEY = 'chat-session-id';

export function useChatSession() {
  const [sessionId, setSessionId] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Try to retrieve existing session from localStorage
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);

    if (stored) {
      setSessionId(stored);
    } else {
      // Generate new session ID
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      localStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
    }
  }, []);

  const resetSession = () => {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    localStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
  };

  return {
    sessionId: mounted ? sessionId : '', // Return empty string until mounted to prevent hydration mismatch
    resetSession,
  };
}
