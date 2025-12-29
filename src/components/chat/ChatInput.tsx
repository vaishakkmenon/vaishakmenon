// Chat input component with character limit validation and styled chat options

'use client';

import { useState, useEffect, useRef, KeyboardEvent, useCallback } from 'react';
import { ChatLoading } from './ChatLoading';
import { ChatOptions, LLMHealthStatus } from '@/lib/types/chat';
import { checkLLMHealth } from '@/lib/api/chat';
import { Brain } from 'lucide-react';

const MAX_QUESTION_LENGTH = 2000;
const CHAR_WARNING_THRESHOLD = 1800;
const HEALTH_CHECK_INTERVAL_NORMAL = 1800000; // 30 minutes when healthy
const HEALTH_CHECK_INTERVAL_DOWN = 10000; // 10 seconds when down

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  disabled: boolean;
  isStreaming?: boolean;
  chatOptions?: ChatOptions;
  onOptionsChange?: (options: ChatOptions) => void;
  error?: string | null; // Trigger health check on error
}

const defaultOptions: ChatOptions = {
  model: null,
  showThinking: false,
};

export function ChatInput({
  onSend,
  onStop,
  disabled,
  isStreaming = false,
  chatOptions = defaultOptions,
  onOptionsChange,
  error,
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const [llmHealth, setLlmHealth] = useState<LLMHealthStatus | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const healthCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check LLM health
  const checkHealth = useCallback(async () => {
    try {
      const status = await checkLLMHealth();
      setLlmHealth(status);
    } catch {
      // Silently fail - health check is optional
    }
  }, []);

  // Auto-focus on mount
  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  // Trigger health check when an error occurs (model might be down)
  useEffect(() => {
    if (error) {
      checkHealth();
    }
  }, [error, checkHealth]);

  // Adaptive health check polling - faster when down
  useEffect(() => {
    // Initial health check
    checkHealth();

    const scheduleNextCheck = () => {
      const isDown = llmHealth?.status === 'busy' || llmHealth?.status === 'error';
      const interval = isDown ? HEALTH_CHECK_INTERVAL_DOWN : HEALTH_CHECK_INTERVAL_NORMAL;

      healthCheckTimeoutRef.current = setTimeout(() => {
        checkHealth();
        scheduleNextCheck();
      }, interval);
    };

    scheduleNextCheck();

    return () => {
      if (healthCheckTimeoutRef.current) {
        clearTimeout(healthCheckTimeoutRef.current);
      }
    };
  }, [checkHealth, llmHealth?.status]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (trimmed && trimmed.length <= MAX_QUESTION_LENGTH && !disabled) {
      onSend(trimmed);
      setInput('');
      // Re-focus after sending
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isTooLong = input.length > MAX_QUESTION_LENGTH;
  const showCharCount = input.length > CHAR_WARNING_THRESHOLD;
  const canSend = input.trim().length > 0 && !isTooLong && !disabled;

  const handleModelChange = (model: 'groq' | 'qwen' | null) => {
    onOptionsChange?.({ ...chatOptions, model });
  };

  const handleThinkingToggle = () => {
    onOptionsChange?.({ ...chatOptions, showThinking: !chatOptions.showThinking });
  };

  const isQwen = chatOptions.model === 'qwen';

  // Only consider "busy" as unavailable (not errors - those could be health endpoint issues)
  const isQwenBusy = llmHealth?.status === 'busy';

  // Get status indicator (only show when we have valid status, not on errors)
  const getStatusIndicator = () => {
    if (!llmHealth || llmHealth.status === 'error') return null;

    if (llmHealth.status === 'available' && llmHealth.is_hot) {
      return (
        <span className="w-1.5 h-1.5 rounded-full bg-green-400" title="Model ready" />
      );
    }
    if (llmHealth.status === 'available') {
      return (
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" title="Model warming up" />
      );
    }
    if (llmHealth.status === 'busy') {
      return (
        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" title="High demand - may use backup" />
      );
    }
    return null;
  };

  return (
    <div className="sticky bottom-0 pb-6 pt-4">
      {/* Input row */}
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ask me about my background..."
          aria-label="Type your question"
          className="flex-1 rounded-lg border border-white/20 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {isStreaming && onStop ? (
          <button
            onClick={onStop}
            aria-label="Stop generation"
            className="px-6 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors font-medium"
          >
            Stop
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Send message"
            className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Send
          </button>
        )}
      </div>

      {/* Options row - below input */}
      {onOptionsChange && (
        <div className="flex items-center justify-between mt-3">
          {/* Segmented control for model with status indicator */}
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg border border-white/10 p-0.5 bg-white/5">
              <button
                onClick={() => handleModelChange(null)}
                disabled={isStreaming}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all disabled:cursor-not-allowed ${
                  !isQwen
                    ? 'bg-white/15 text-white'
                    : 'text-zinc-400 hover:text-zinc-300'
                }`}
                aria-pressed={!isQwen}
              >
                Llama 3.1 8B
                <span className="text-zinc-500 ml-1">Fast</span>
              </button>
              <button
                onClick={() => handleModelChange('qwen')}
                disabled={isStreaming || isQwenBusy}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all disabled:cursor-not-allowed flex items-center gap-1.5 ${
                  isQwenBusy
                    ? 'opacity-40 text-zinc-500'
                    : isQwen
                      ? 'bg-white/15 text-white'
                      : 'text-zinc-400 hover:text-zinc-300'
                }`}
                aria-pressed={isQwen}
                title={isQwenBusy ? 'Model busy - will use backup' : undefined}
              >
                Qwen 3 32B
                <span className="text-zinc-500">Smart</span>
                {getStatusIndicator()}
              </button>
            </div>

            {/* Busy/fallback notice */}
            {isQwenBusy && llmHealth?.fallback_available && (
              <span className="text-[10px] text-zinc-500">
                Will use {llmHealth.fallback_provider} if busy
              </span>
            )}
          </div>

          {/* Thinking toggle - icon button (Qwen only) */}
          <button
            onClick={handleThinkingToggle}
            disabled={isStreaming || !isQwen}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-all disabled:cursor-not-allowed ${
              !isQwen
                ? 'opacity-40 bg-white/5 border-white/10 text-zinc-500'
                : chatOptions.showThinking
                  ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:text-zinc-300 hover:border-white/20'
            }`}
            aria-pressed={chatOptions.showThinking}
            aria-label="Toggle AI reasoning display"
            title={isQwen ? 'Show AI reasoning' : 'Reasoning only available with Qwen model'}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Reasoning</span>
          </button>
        </div>
      )}

      {/* Character count warning */}
      {showCharCount && (
        <div
          className={`text-xs mt-2 ${isTooLong ? 'text-red-400' : 'text-zinc-500'}`}
        >
          {input.length}/{MAX_QUESTION_LENGTH} characters
          {isTooLong && ' - Question is too long'}
        </div>
      )}

      {/* Loading indicator */}
      {disabled && (
        <div className="mt-2">
          <ChatLoading />
        </div>
      )}
    </div>
  );
}
