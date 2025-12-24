// components/themeToggle.tsx
'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useClientOnly } from '@/hooks/useClientOnly';

/**
 * Theme toggle button for switching between dark and light modes
 *
 * Uses next-themes for theme management and prevents hydration mismatches
 * by only rendering the actual toggle after client-side mount.
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

    if (!mounted) {
        // Return a placeholder with same dimensions to avoid layout shift
        return <div className="w-6 h-6 p-2"></div>;
    }

    return (
        <button
            aria-label="Toggle theme"
            onClick={() => setTheme(current === 'dark' ? 'light' : 'dark')}
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