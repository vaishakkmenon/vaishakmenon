// Error display component with retry functionality

"use client";

interface ChatErrorProps {
  error: string;
  onRetry: () => void;
}

export function ChatError({ error, onRetry }: ChatErrorProps) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 mb-4"
    >
      <p className="text-red-400">{error}</p>
      <button
        onClick={onRetry}
        className="mt-2 text-sm underline text-red-300 hover:text-red-200 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
