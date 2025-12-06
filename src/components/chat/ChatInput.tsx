// Chat input component with character limit validation

"use client";

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { ChatLoading } from './ChatLoading';

const MAX_QUESTION_LENGTH = 2000;
const CHAR_WARNING_THRESHOLD = 1800;

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
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

  return (
    <div className="sticky bottom-0 pb-6 pt-4">
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
          className="flex-1 rounded-lg border border-white/20 dark:border-white/20 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
          className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Send
        </button>
      </div>

      {/* Character count warning */}
      {showCharCount && (
        <div
          className={`text-xs mt-2 ${
            isTooLong ? 'text-red-400' : 'text-gray-400'
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
