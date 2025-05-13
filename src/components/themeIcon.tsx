'use client';

import Image, { ImageProps } from 'next/image';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

interface ThemeIconProps extends Omit<ImageProps, 'src'> {
    lightSvg: string;
    darkSvg: string;
}

export function ThemeIcon({ lightSvg, darkSvg, ...imgProps }: ThemeIconProps) {
    // 1) Always call hooks in the same order:
    const { theme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // 2) Decide which src to use
    //    Before mount: stick to lightSvg so SSR + first client render match
    //    After mount: pick based on actual theme
    const current = theme === 'system' ? systemTheme : theme;
    const src = !mounted
        ? lightSvg
        : current === 'dark'
            ? lightSvg
            : darkSvg;

    return <Image src={src} {...imgProps} />;
}