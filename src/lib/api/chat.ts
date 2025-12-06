// API service layer for RAG chatbot

import { ChatRequest, ChatResponse } from '@/lib/types/chat';

const API_BASE_URL = process.env.NEXT_PUBLIC_RAG_API_BASE_URL || 'http://localhost:8000';
const TIMEOUT_MS = 30000; // 30 seconds

/**
 * Generate a UUID v4 for session management
 */
export function generateSessionId(): string {
  return crypto.randomUUID();
}

/**
 * Send a chat message to the RAG backend
 * @param params - Chat request parameters (question and optional session_id)
 * @returns Chat response with answer, sources, and metadata
 * @throws Error with user-friendly messages for various failure modes
 */
export async function sendChatMessage(params: ChatRequest): Promise<ChatResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle various HTTP status codes
    if (response.status === 404) {
      // Session expired - caller should handle by resetting session
      const error = new Error('Session expired');
      (error as any).status = 404;
      throw error;
    }

    if (response.status === 429) {
      throw new Error('Rate limit exceeded. You can send up to 10 messages per hour. Please wait and try again.');
    }

    if (response.status >= 500) {
      throw new Error('Service temporarily unavailable. Please try again shortly.');
    }

    if (!response.ok) {
      // Try to parse error message from response
      try {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || 'Invalid request. Please try again.');
      } catch (parseError) {
        throw new Error('Invalid request. Please try again.');
      }
    }

    const data: ChatResponse = await response.json();

    // Validate response has required fields
    if (!data.answer || !data.session_id) {
      throw new Error('Received an invalid response. Please try again.');
    }

    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);

    // Handle abort (timeout)
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect. Please check your internet connection.');
    }

    // Re-throw error with status code if it exists
    if (error.status) {
      throw error;
    }

    // Re-throw our custom error messages
    throw error;
  }
}
