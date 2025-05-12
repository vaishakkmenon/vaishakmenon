// components/ThemeToggle.tsx
'use client';
import { useTheme } from './themeContext';
import { HiSun, HiMoon } from 'react-icons/hi';

export function ThemeToggle() {
    const { theme, toggle } = useTheme();
    return (
        <button
            onClick={toggle}
            aria-label="Toggle light/dark mode"
            className="p-2 rounded focus:outline-none"
        >
            {theme === 'dark' ? <HiSun size={20} /> : <HiMoon size={20} />}
        </button>
    );
}
