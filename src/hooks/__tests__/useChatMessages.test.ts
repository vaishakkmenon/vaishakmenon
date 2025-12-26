import { renderHook, act, waitFor } from '@testing-library/react';
import { useChatMessages } from '../useChatMessages';

// Mock the chat API
jest.mock('@/lib/api/chat', () => ({
    generateSessionId: () => 'test-session-id-' + Math.random().toString(36).substring(7),
    streamChatMessage: jest.fn(),
}));

describe('useChatMessages', () => {
    const mockResetSession = jest.fn();
    const testSessionId = 'test-session-123';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('initial state', () => {
        it('should start with empty messages', () => {
            const { result } = renderHook(() =>
                useChatMessages(testSessionId, mockResetSession)
            );

            expect(result.current.messages).toEqual([]);
            expect(result.current.loading).toBe(false);
            expect(result.current.error).toBeNull();
        });
    });

    describe('clearMessages', () => {
        it('should clear all messages', () => {
            const { result } = renderHook(() =>
                useChatMessages(testSessionId, mockResetSession)
            );

            // Start with clearing (even if empty)
            act(() => {
                result.current.clearMessages();
            });

            expect(result.current.messages).toEqual([]);
            expect(result.current.error).toBeNull();
        });
    });

    describe('sendMessage', () => {
        it('should add user message optimistically', async () => {
            const { streamChatMessage } = require('@/lib/api/chat');
            streamChatMessage.mockResolvedValue({
                answer: 'Test response',
                sources: [],
                grounded: true,
                session_id: testSessionId,
            });

            const { result } = renderHook(() =>
                useChatMessages(testSessionId, mockResetSession)
            );

            act(() => {
                result.current.sendMessage('Hello');
            });

            // User message should appear immediately
            expect(result.current.messages.length).toBeGreaterThan(0);
            expect(result.current.messages[0].role).toBe('user');
            expect(result.current.messages[0].content).toBe('Hello');
        });
    });

    describe('stopGeneration', () => {
        it('should set loading to false', () => {
            const { result } = renderHook(() =>
                useChatMessages(testSessionId, mockResetSession)
            );

            act(() => {
                result.current.stopGeneration();
            });

            expect(result.current.loading).toBe(false);
        });
    });
});
