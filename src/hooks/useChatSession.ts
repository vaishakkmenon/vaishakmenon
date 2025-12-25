// Custom hook for managing chat session ID with localStorage persistence

import { useState, useEffect, useCallback } from 'react';
import { generateSessionId, checkHealth } from '@/lib/api/chat';
import { ApiStatus } from '@/lib/types/chat';

const SESSION_STORAGE_KEY = 'chat-session-id';

export function useChatSession() {
  const [sessionId, setSessionId] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking');

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

    // Check API health on mount
    checkHealth().then((status) => {
      setApiStatus(status.healthy ? 'healthy' : 'unhealthy');
    });
  }, []);

  const resetSession = useCallback(() => {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    localStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
  }, []);

  const recheckHealth = useCallback(async () => {
    setApiStatus('checking');
    const status = await checkHealth();
    setApiStatus(status.healthy ? 'healthy' : 'unhealthy');
  }, []);

  return {
    sessionId: mounted ? sessionId : '',
    resetSession,
    apiStatus,
    recheckHealth,
  };
}
