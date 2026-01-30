// components/ThemeToggle.tsx
'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useClientOnly } from '@/hooks/useClientOnly';
import { useCallback } from 'react';
import { themeTransitionManager } from '@/lib/themeTransition';
import { useKeybind } from '@/hooks/useKeybind';

/**
 * Theme toggle button for switching between dark and light modes
 */
export function ThemeToggle(): React.ReactElement {
    const mounted = useClientOnly();
    const { theme, setTheme, systemTheme } = useTheme();
    const current = theme === 'system' ? systemTheme : theme;

    /**
     * Unified Toggle Logic
     * Accepts optional coordinates (x, y). If not provided, defaults to center screen.
     */
    const triggerThemeSwitch = useCallback((x?: number, y?: number) => {
        const fromTheme = current === 'dark' ? 'dark' : 'light';
        const toTheme = current === 'dark' ? 'light' : 'dark';

        // Use provided coordinates OR default to center of viewport
        // (Center is used for Keybinds)
        const transitionX = x ?? (typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
        const transitionY = y ?? (typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

        themeTransitionManager.transition(
            fromTheme,
            toTheme,
            () => setTheme(toTheme),
            { x: transitionX, y: transitionY }
        );
    }, [current, setTheme]);

    // 1. Handle Mouse Click (Uses Mouse Position)
    const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        triggerThemeSwitch(event.clientX, event.clientY);
    }, [triggerThemeSwitch]);

    // 2. Handle Keybind: Ctrl + Alt + L (Uses Center Position)
    useKeybind(
        {
            key: 'l',
            ctrlKey: true,
            altKey: true
        },
        () => triggerThemeSwitch(), // No args = defaults to center
        { enabled: mounted }
    );

    if (!mounted) {
        return <div className="w-6 h-6 p-2"></div>;
    }

    return (
        <button
            aria-label="Toggle theme"
            onClick={handleClick}
            className="p-2 rounded transition-colors text-[var(--color-foreground)] hover:bg-black/5 dark:hover:bg-white/10 opacity-100"
            title="Toggle Theme (Ctrl + Alt + L)"
        >
            {current === 'dark' ? (
                <Sun className="w-5 h-5 stroke-2" />
            ) : (
                <Moon className="w-5 h-5 transition-colors stroke-2" />
            )}
        </button>
    );
}