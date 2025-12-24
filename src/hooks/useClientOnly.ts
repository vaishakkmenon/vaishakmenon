'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to handle client-side only rendering
 * Prevents hydration mismatches for theme-aware components
 *
 * @returns boolean - true when component has mounted on client
 *
 * @example
 * ```tsx
 * const mounted = useClientOnly();
 * if (!mounted) return <div>Loading...</div>;
 * ```
 */
export function useClientOnly(): boolean {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
