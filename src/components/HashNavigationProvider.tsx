'use client';

import { useHashNavigation } from '@/hooks/useHashNavigation';

/**
 * Provider component to enable hash-based navigation for browser back/forward buttons.
 * Add this to the root layout to enable section navigation history.
 */
export function HashNavigationProvider({ children }: { children: React.ReactNode }) {
    useHashNavigation();
    return <>{children}</>;
}
