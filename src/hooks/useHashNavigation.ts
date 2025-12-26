'use client';

import { useEffect } from 'react';

/**
 * Hook to handle browser back/forward navigation with hash-based sections.
 * Scrolls to the target section when hash changes via browser navigation.
 */
export function useHashNavigation() {
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;

            if (hash) {
                // Scroll to the section with this ID
                const element = document.querySelector(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // No hash = scroll to top (hero section)
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        // Handle back/forward navigation
        window.addEventListener('hashchange', handleHashChange);

        // Also handle popstate for complete history navigation
        window.addEventListener('popstate', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            window.removeEventListener('popstate', handleHashChange);
        };
    }, []);
}
