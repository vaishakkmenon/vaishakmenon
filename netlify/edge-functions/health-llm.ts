// Netlify Edge Function to proxy LLM health check requests to backend

import type { Context } from '@netlify/edge-functions';

export default async (request: Request, _context: Context) => {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // Only allow GET requests
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const BACKEND_URL = Deno.env.get('RAG_BACKEND_URL') || 'https://api.vaishakmenon.com';

  try {
    // Forward request to backend LLM health endpoint
    const backendResponse = await fetch(`${BACKEND_URL}/health/llm`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseText = await backendResponse.text();

    return new Response(responseText, {
      status: backendResponse.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('LLM health check proxy error:', error);
    return new Response(JSON.stringify({
      status: 'error',
      error: 'Failed to connect to backend'
    }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
