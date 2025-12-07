'use client';

/**
 * Error boundary for handling runtime errors in the application
 * Automatically catches errors in components and provides a fallback UI
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center">
        Something went wrong!
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
        {error.message || 'An unexpected error occurred'}
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20 transition-colors font-medium"
      >
        Try again
      </button>
    </div>
  );
}
