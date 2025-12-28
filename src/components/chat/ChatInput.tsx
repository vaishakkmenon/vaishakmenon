// Chat input component with character limit validation and chat options

'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { ChatLoading } from './ChatLoading';
import { ChatOptions } from '@/lib/types/chat';

const MAX_QUESTION_LENGTH = 2000;
const CHAR_WARNING_THRESHOLD = 1800;

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  disabled: boolean;
  isStreaming?: boolean;
  chatOptions?: ChatOptions;
  onOptionsChange?: (options: ChatOptions) => void;
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
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

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

  return (
    <div className="sticky bottom-0 pb-6 pt-4">
      {/* Chat options controls */}
      {onOptionsChange && (
        <div className="flex items-center gap-4 mb-3 text-sm">
          {/* Model selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="model-select" className="text-zinc-500 dark:text-zinc-400">
              Model:
            </label>
            <select
              id="model-select"
              value={chatOptions.model ?? 'groq'}
              onChange={(e) => handleModelChange(e.target.value === 'groq' ? null : e.target.value as 'qwen')}
              disabled={isStreaming}
              className="rounded-md border border-zinc-400 dark:border-white/20 bg-transparent px-2 py-1 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              aria-label="Select AI model"
            >
              <option value="groq">Llama 3.1 8B (Fast)</option>
              <option value="qwen">Qwen 3 32B (Smart)</option>
            </select>
          </div>

          {/* Thinking toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={chatOptions.showThinking}
              onChange={handleThinkingToggle}
              disabled={isStreaming}
              className="rounded border-zinc-400 dark:border-white/20 bg-transparent focus:ring-zinc-400 dark:focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Show AI reasoning"
            />
            <span className="text-zinc-500 dark:text-zinc-400">Show AI reasoning</span>
          </label>
        </div>
      )}

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
          className="flex-1 rounded-lg border border-zinc-400 dark:border-white/20 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Send
          </button>
        )}
      </div>

      {/* Character count warning */}
      {showCharCount && (
        <div
          className={`text-xs mt-2 ${isTooLong ? 'text-red-400' : 'text-gray-400'
            }`}
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
