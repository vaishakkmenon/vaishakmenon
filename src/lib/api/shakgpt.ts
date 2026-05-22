const STREAM_TIMEOUT_MS = 60000; // 60 seconds for streaming

/**
 * Create an error with status code attached
 */
function createStatusError(message: string, status: number): Error {
    const error = new Error(message);
    (error as Error & { status: number }).status = status;
    return error;
}

async function handleErrorResponse(response: Response): Promise<never> {
    if (response.status === 404) {
        throw createStatusError('Endpoint not found.', 404);
    }

    if (response.status === 429) {
        throw new Error('Rate limit exceeded. You can send up to 3 requests every 10 seconds. Please wait a moment and try again.');
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

export async function streamLLMCompletion(
    prompt: string,
    onToken: (token: string) => void,
    signal?: AbortSignal
): Promise<void> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), STREAM_TIMEOUT_MS);

    if (signal) {
        signal.addEventListener('abort', () => controller.abort());
    }

    try {
        const endpoint = 'https://llm.vaishakmenon.com/completion';
        const response = await fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify({ prompt: ' ' + prompt, stream: true, n_predict: 200 }),
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
        });

        if (!response.ok) {
            await handleErrorResponse(response);
        }

        if (!response.body) {
            throw new Error('Streaming not supported in this browser.');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

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

                // Parse data
                if (trimmed.startsWith('data:')) {
                    const data = trimmed.slice(5).trimStart();

                    try {
                        const parsed = JSON.parse(data);
                        if (!parsed.stop && parsed.content) {
                            onToken(parsed.content);
                        }
                    } catch {
                        // ignore malformed lines
                    }
                }
            }
        }

        clearTimeout(timeoutId);
    }
    catch (error: unknown) {
        clearTimeout(timeoutId);
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                if (signal?.aborted) return; // user stopped
                throw new Error('Request timed out. Please try again.');
            }
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error('Unable to connect. Please check your internet connection.');
            }
        }

        throw error;
    }
};