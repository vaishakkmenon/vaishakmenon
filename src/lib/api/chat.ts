// API service layer for RAG chatbot
// Uses Netlify Edge Functions as proxy to protect API key

import { ChatRequest, ChatResponse, StreamUpdate, HealthStatus } from '@/lib/types/chat';

// API endpoints - use edge function proxy by default
// For local dev without Netlify CLI, set NEXT_PUBLIC_RAG_API_BASE_URL to backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_RAG_API_BASE_URL || '/api';

// Whether we're using the edge function proxy (no API key needed in frontend)
const USE_PROXY = !process.env.NEXT_PUBLIC_RAG_API_BASE_URL;

const TIMEOUT_MS = 30000; // 30 seconds
const STREAM_TIMEOUT_MS = 60000; // 60 seconds for streaming
const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 1000;

/**
 * Generate a UUID v4 for session management
 * Uses crypto.randomUUID if available, falls back to manual generation
 */
export function generateSessionId(): string {
  // crypto.randomUUID requires HTTPS or localhost, fallback for HTTP
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback UUID v4 generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Check if the API is healthy
 * Uses /api/health (edge function) or direct backend /health
 */
export async function checkHealth(): Promise<HealthStatus> {
  try {
    // Both proxy and direct use /health path (API_BASE_URL already has correct base)
    const healthEndpoint = `${API_BASE_URL}/health`;
    const response = await fetch(healthEndpoint, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    return { healthy: response.ok };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { healthy: false, error: message };
  }
}

/**
 * Retry wrapper with exponential backoff for 5xx errors
 */
async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const status = (error as { status?: number }).status || 0;
      const isRetryable = status >= 500 && status < 600;

      if (!isRetryable || attempt === MAX_RETRIES) {
        throw error;
      }

      const delay = INITIAL_DELAY_MS * Math.pow(2, attempt);
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw lastError || new Error('Retry failed');
}

/**
 * Create an error with status code attached
 */
function createStatusError(message: string, status: number): Error {
  const error = new Error(message);
  (error as Error & { status: number }).status = status;
  return error;
}

/**
 * Handle HTTP error responses consistently
 */
async function handleErrorResponse(response: Response): Promise<never> {
  if (response.status === 404) {
    throw createStatusError('Session expired', 404);
  }

  if (response.status === 429) {
    throw new Error('Rate limit exceeded. You can send up to 10 messages per hour. Please wait and try again.');
  }

  if (response.status >= 500) {
    throw createStatusError('Service temporarily unavailable. Please try again shortly.', response.status);
  }

  try {
    const errorData = await response.json();
    throw new Error(errorData.detail || errorData.message || 'Invalid request. Please try again.');
  } catch {
    throw new Error('Invalid request. Please try again.');
  }
}

/**
 * Build headers for API requests
 * Only includes API key for direct backend calls (not edge function proxy)
 */
function buildHeaders(accept?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (accept) {
    headers['Accept'] = accept;
  }
  // Only include API key for direct backend calls (local dev without Netlify)
  if (!USE_PROXY) {
    const apiKey = process.env.NEXT_PUBLIC_RAG_API_KEY || '';
    if (apiKey) {
      headers['X-API-Key'] = apiKey;
    }
  }
  return headers;
}

/**
 * Send a chat message to the RAG backend (non-streaming)
 * Note: Currently unused - streaming is preferred
 */
export async function sendChatMessage(params: ChatRequest): Promise<ChatResponse> {
  return withRetry(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      // When using proxy, /api/chat forwards to streaming endpoint
      // For direct backend, use /chat endpoint
      const endpoint = USE_PROXY ? `${API_BASE_URL}/chat` : `${API_BASE_URL}/chat`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(params),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await handleErrorResponse(response);
      }

      const data: ChatResponse = await response.json();

      if (!data.answer || !data.session_id) {
        throw new Error('Received an invalid response. Please try again.');
      }

      return data;
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new Error('Unable to connect. Please check your internet connection.');
        }
      }

      throw error;
    }
  });
}

/**
 * Stream a chat message from the RAG backend using SSE
 *
 * Backend SSE format:
 *   event: metadata
 *   data: {"sources": [...], "grounded": true, "session_id": "...", "is_ambiguous": false}
 *
 *   event: token
 *   data: "text chunk"
 *
 *   event: done
 *   data:
 *
 *   event: error
 *   data: {"detail": "Error message"}
 */
export async function streamChatMessage(
  params: ChatRequest,
  onUpdate: (update: StreamUpdate) => void,
  externalSignal?: AbortSignal
): Promise<ChatResponse> {
  return withRetry(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), STREAM_TIMEOUT_MS);

    // If external signal aborts, abort our controller too
    if (externalSignal) {
      externalSignal.addEventListener('abort', () => controller.abort());
    }

    try {
      // Edge function proxy at /api/chat forwards to backend /chat/stream
      // Direct backend uses /chat/stream
      const endpoint = USE_PROXY ? `${API_BASE_URL}/chat` : `${API_BASE_URL}/chat/stream`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: buildHeaders('text/event-stream'),
        body: JSON.stringify(params),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await handleErrorResponse(response);
      }

      if (!response.body) {
        throw new Error('Streaming not supported in this browser.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // Accumulated response
      let answer = '';
      let sources: ChatResponse['sources'] = [];
      let grounded = false;
      let sessionId = params.session_id || '';
      let ambiguity: ChatResponse['ambiguity'] | undefined;
      let rewriteMetadata: ChatResponse['rewrite_metadata'] | undefined;
      let confidence: number | undefined;

      // SSE parsing state
      let currentEvent = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        // Keep incomplete last line in buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();

          // Skip empty lines and comments
          if (!trimmed || trimmed.startsWith(':')) {
            continue;
          }

          // Parse event type
          if (trimmed.startsWith('event:')) {
            currentEvent = trimmed.slice(6).trim();
            continue;
          }

          // Parse data
          if (trimmed.startsWith('data:')) {
            const data = trimmed.slice(5).trimStart();

            switch (currentEvent) {
              case 'metadata': {
                try {
                  const metadata = JSON.parse(data);
                  if (metadata.sources) sources = metadata.sources;
                  if (metadata.grounded !== undefined) grounded = metadata.grounded;
                  if (metadata.session_id) sessionId = metadata.session_id;
                  if (metadata.is_ambiguous !== undefined) {
                    ambiguity = {
                      is_ambiguous: metadata.is_ambiguous,
                      score: metadata.ambiguity_score || 0,
                      clarification_requested: metadata.clarification_requested || false,
                    };
                  }
                  if (metadata.ambiguity) ambiguity = metadata.ambiguity;
                  if (metadata.rewrite_metadata) rewriteMetadata = metadata.rewrite_metadata;
                  if (metadata.confidence !== undefined) confidence = metadata.confidence;

                  onUpdate({ sources, grounded, session_id: sessionId, ambiguity });
                } catch {
                  // Ignore parse errors for metadata
                }
                break;
              }

              case 'token': {
                // Token data is a plain string (may be JSON-encoded)
                let tokenText = data;
                // Try to parse if it looks like JSON string
                if (data.startsWith('"') && data.endsWith('"')) {
                  try {
                    tokenText = JSON.parse(data);
                  } catch {
                    // Use raw data
                  }
                }
                answer += tokenText;
                onUpdate({ answer });
                break;
              }

              case 'error': {
                try {
                  const errorData = JSON.parse(data);
                  throw new Error(errorData.detail || 'Stream error occurred');
                } catch (e) {
                  if (e instanceof Error && e.message !== 'Stream error occurred') {
                    throw e;
                  }
                  throw new Error(data || 'Stream error occurred');
                }
              }

              case 'done': {
                // Stream complete - nothing to do
                break;
              }

              default: {
                // Unknown event type - ignore
                break;
              }
            }
          }
        }
      }

      // Build final response
      const finalResponse: ChatResponse = {
        answer,
        sources,
        grounded,
        session_id: sessionId,
        confidence,
        ambiguity,
        rewrite_metadata: rewriteMetadata,
      };

      if (!finalResponse.answer || !finalResponse.session_id) {
        throw new Error('Received an incomplete response. Please try again.');
      }

      return finalResponse;
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new Error('Unable to connect. Please check your internet connection.');
        }
      }

      throw error;
    }
  });
}
