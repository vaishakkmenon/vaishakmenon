// components/themeToggle.tsx
"use client";

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { HiSun, HiMoon } from 'react-icons/hi';

export function ThemeToggle() {
    // Prevent hydration mismatch
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

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
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
            {current === 'dark' ? (
                <HiSun className="w-5 h-5" />
            ) : (
                <HiMoon className="w-5 h-5" />
            )}
        </button>
    );
}