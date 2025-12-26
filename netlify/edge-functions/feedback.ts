// Netlify Edge Function to proxy feedback requests to backend
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
        // Parse and validate the incoming request body
        const body = await request.json();

        // Basic validation
        if (!body.session_id || !body.message_id || typeof body.thumbs_up !== 'boolean') {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: session_id, message_id, thumbs_up' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        // Forward request to backend
        const backendResponse = await fetch(`${BACKEND_URL}/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY,
            },
            body: JSON.stringify(body),
        });

        // Forward the response from backend
        const responseData = await backendResponse.text();

        return new Response(responseData, {
            status: backendResponse.status,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        console.error('Feedback proxy error:', error);
        return new Response(JSON.stringify({ error: 'Failed to submit feedback' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
