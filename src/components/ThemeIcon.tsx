'use client';

import Image, { ImageProps } from 'next/image';
import { useTheme } from 'next-themes';
import { useClientOnly } from '@/hooks/useClientOnly';

/**
 * Theme-aware icon component that displays different SVGs based on theme
 *
 * Shows light-colored icons in dark mode and dark-colored icons in light mode
 * for optimal visibility and contrast.
 *
 * @param lightSvg - Path to light-colored SVG (shown in dark mode)
 * @param darkSvg - Path to dark-colored SVG (shown in light mode)
 * @param alt - Alt text for the image
 * @param imgProps - Additional Next.js Image props
 *
 * @returns Theme-aware image component
 *
 * @example
 * ```tsx
 * <ThemeIcon
 *   lightSvg="/images/linkedin-white.png"
 *   darkSvg="/images/linkedin.png"
 *   alt="LinkedIn"
 *   width={24}
 *   height={24}
 * />
 * ```
 */
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
}: ThemeIconProps): React.ReactElement {
    const { theme, systemTheme } = useTheme();
    const mounted = useClientOnly();

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