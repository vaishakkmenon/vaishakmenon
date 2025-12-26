// Netlify Edge Function to proxy chat requests to backend
// Keeps API key server-side only

import type { Context } from '@netlify/edge-functions';

// ============================================================================
// IP-based Rate Limiting (in-memory, resets on deploy)
// ============================================================================
const RATE_LIMIT = 30; // requests per hour per IP
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

interface RateLimitRecord {
  count: number;
  windowStart: number;
}

const ipRequests = new Map<string, RateLimitRecord>();

function getClientIP(request: Request): string {
  // Cloudflare sets CF-Connecting-IP as the true client IP
  const cfIP = request.headers.get('cf-connecting-ip');
  if (cfIP) return cfIP;

  // Fallback to X-Forwarded-For (first IP in chain)
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();

  // Last resort
  return '127.0.0.1';
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const record = ipRequests.get(ip);

  // New window or expired window
  if (!record || now - record.windowStart > WINDOW_MS) {
    ipRequests.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: RATE_LIMIT - 1, resetIn: WINDOW_MS };
  }

  // Check if limit exceeded
  if (record.count >= RATE_LIMIT) {
    const resetIn = WINDOW_MS - (now - record.windowStart);
    return { allowed: false, remaining: 0, resetIn };
  }

  // Increment and allow
  record.count++;
  const resetIn = WINDOW_MS - (now - record.windowStart);
  return { allowed: true, remaining: RATE_LIMIT - record.count, resetIn };
}

// Cleanup old entries periodically (prevent memory leak)
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRequests.entries()) {
    if (now - record.windowStart > WINDOW_MS) {
      ipRequests.delete(ip);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes

// ============================================================================
// Edge Function Handler
// ============================================================================
export default async (request: Request, _context: Context) => {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Check IP-based rate limit
  const clientIP = getClientIP(request);
  const rateLimit = checkRateLimit(clientIP);

  if (!rateLimit.allowed) {
    const resetSeconds = Math.ceil(rateLimit.resetIn / 1000);
    return new Response(
      JSON.stringify({
        error: 'Rate limit exceeded',
        detail: `Too many requests. Please try again in ${Math.ceil(resetSeconds / 60)} minutes.`,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': RATE_LIMIT.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetSeconds.toString(),
          'Retry-After': resetSeconds.toString(),
        },
      }
    );
  }

  // Get secrets from environment
  const API_KEY = Deno.env.get('RAG_API_KEY');
  const BACKEND_URL = Deno.env.get('RAG_BACKEND_URL') || 'https://api.vaishakmenon.com';

  if (!API_KEY) {
    console.error('RAG_API_KEY environment variable not set');
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Parse the incoming request body
    const body = await request.json();

    // Build headers, forwarding Origin if present
    const forwardHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
      'X-API-Key': API_KEY,
    };

    // Forward Origin header for backend CORS validation
    const origin = request.headers.get('Origin');
    if (origin) {
      forwardHeaders['Origin'] = origin;
    }

    // Forward request to backend streaming endpoint
    const backendResponse = await fetch(`${BACKEND_URL}/chat/stream`, {
      method: 'POST',
      headers: forwardHeaders,
      body: JSON.stringify(body),
    });

    // If backend returned an error, forward it
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      return new Response(errorText, {
        status: backendResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Stream the response directly to the client
    return new Response(backendResponse.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(JSON.stringify({ error: 'Failed to connect to backend' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
