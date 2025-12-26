'use client';
import { useEffect } from 'react';

/**
 * Mouse-following spotlight effect overlay
 *
 * Creates a gradient spotlight that follows the mouse cursor.
 * Automatically disabled for users with prefers-reduced-motion.
 * Uses CSS custom properties (--mx, --my) for positioning.
 *
 * Performance optimized with requestAnimationFrame throttling.
 *
 * @returns Spotlight overlay element
 */
export default function Spotlight(): React.ReactElement {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

        // Set initial position
        document.documentElement.style.setProperty('--mx', '50%');
        document.documentElement.style.setProperty('--my', '30%');

        let frameId: number | null = null;

        const onMove = (e: MouseEvent): void => {
            if (frameId) return;

            frameId = requestAnimationFrame(() => {
                document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
                document.documentElement.style.setProperty('--my', `${e.clientY}px`);
                frameId = null;
            });
        };

        window.addEventListener('mousemove', onMove, { passive: true });

        return () => {
            window.removeEventListener('mousemove', onMove);
            if (frameId) cancelAnimationFrame(frameId);
        };
    }, []);

    return <div aria-hidden className="spotlight" />;
}