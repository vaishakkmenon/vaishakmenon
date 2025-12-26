import { renderHook, act, waitFor } from '@testing-library/react';
import { useChatSession } from '../useChatSession';

// Create a counter for unique IDs
let idCounter = 0;

// Mock the chat API
jest.mock('@/lib/api/chat', () => ({
    generateSessionId: () => `mock-session-id-${++idCounter}`,
    checkHealth: jest.fn().mockResolvedValue({ healthy: true }),
}));

describe('useChatSession', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        idCounter = 0;
    });

    describe('initial state', () => {
        it('should generate a session ID', async () => {
            const { result } = renderHook(() => useChatSession());

            // Wait for async effects to complete
            await act(async () => {
                await new Promise((r) => setTimeout(r, 0));
            });

            expect(result.current.sessionId).toBeTruthy();
            expect(typeof result.current.sessionId).toBe('string');
        });

        it('should check API health on mount', async () => {
            const { result } = renderHook(() => useChatSession());

            // Wait for health check to complete
            await waitFor(() => {
                expect(result.current.apiStatus).toBe('healthy');
            });
        });
    });

    describe('resetSession', () => {
        it('should generate a new session ID', async () => {
            const { result } = renderHook(() => useChatSession());

            // Wait for initial effects
            await act(async () => {
                await new Promise((r) => setTimeout(r, 0));
            });

            const originalSessionId = result.current.sessionId;

            await act(async () => {
                result.current.resetSession();
            });

            // Session ID should change
            expect(result.current.sessionId).not.toBe(originalSessionId);
        });
    });

    describe('recheckHealth', () => {
        it('should be a function', async () => {
            const { result } = renderHook(() => useChatSession());

            await act(async () => {
                await new Promise((r) => setTimeout(r, 0));
            });

            expect(typeof result.current.recheckHealth).toBe('function');
        });
    });
});
