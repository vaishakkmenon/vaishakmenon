// components/themeToggle.tsx
'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useClientOnly } from '@/hooks/useClientOnly';
import { useCallback } from 'react';
import { themeTransitionManager } from '@/lib/themeTransition';

/**
 * Theme toggle button for switching between dark and light modes
 *
 * Uses next-themes for theme management and a custom tile-flip
 * transition animation on large screens, with a circular reveal
 * fallback on mobile. Falls back to instant switch when
 * prefers-reduced-motion is set or View Transitions API is unavailable.
 *
 * @returns Theme toggle button with sun/moon icons
 *
 * @example
 * ```tsx
 * <ThemeToggle />
 * ```
 */
export function ThemeToggle(): React.ReactElement {
    // Prevent hydration mismatch
    const mounted = useClientOnly();

    const { theme, setTheme, systemTheme } = useTheme();
    const current = theme === 'system' ? systemTheme : theme;

    const toggleTheme = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        const fromTheme = current === 'dark' ? 'dark' : 'light';
        const toTheme = current === 'dark' ? 'light' : 'dark';

        // Get click position for circular reveal animation
        const clickPosition = {
            x: event.clientX,
            y: event.clientY
        };

        // Trigger the theme transition (tile-flip on desktop, circular reveal on mobile)
        themeTransitionManager.transition(
            fromTheme,
            toTheme,
            () => setTheme(toTheme),
            clickPosition
        );
    }, [current, setTheme]);

    if (!mounted) {
        // Return a placeholder with same dimensions to avoid layout shift
        return <div className="w-6 h-6 p-2"></div>;
    }

    return (
        <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="p-2 rounded transition-colors"
        >
            {current === 'dark' ? (
                <Sun className="w-5 h-5" />
            ) : (
                <Moon className="w-5 h-5 text-gray-700 hover:text-gray-900 transition-colors" />
            )}
        </button>
    );
}
