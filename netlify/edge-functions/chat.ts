// Netlify Edge Function to proxy chat requests to backend
// Keeps API key server-side only

import type { Context } from '@netlify/edge-functions';

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
