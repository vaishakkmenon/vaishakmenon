'use client';

import Image, { ImageProps } from 'next/image';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

interface ThemeIconProps extends Omit<ImageProps, 'src'> {
    lightSvg: string;
    darkSvg: string;
    alt: string;
}

export function ThemeIcon({
    lightSvg,
    darkSvg,
    alt,
    ...imgProps
}: ThemeIconProps) {
    const { theme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const current = theme === 'system' ? systemTheme : theme;
    const src = !mounted
        ? lightSvg
        : current === 'dark'
            ? lightSvg
            : darkSvg;

    return (
        <Image
            src={src}
            alt={alt}
            {...imgProps}
        />
    );
}