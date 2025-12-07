// components/Header.tsx
"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ThemeIcon, ThemeToggle } from "@/components"
import { SOCIAL_LINKS, LAYOUT } from '@/lib/constants'

/**
 * Sticky header with scroll-sensitive fade effect
 *
 * Features:
 * - Opacity fades from 1 to 0 as user scrolls past viewport height
 * - Sticky positioning with backdrop blur
 * - Contains navigation, social links, and theme toggle
 * - Optimized with requestAnimationFrame for smooth scrolling
 *
 * @returns Header component with navigation
 *
 * @example
 * ```tsx
 * <Header />
 * ```
 */
export function Header(): React.ReactElement {
    const [opacity, setOpacity] = useState<number>(1)

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const fadeStart = window.innerHeight + LAYOUT.header.fadeStart;
        const fadeEnd = window.innerHeight + LAYOUT.header.fadeEnd;

        if (fadeEnd <= fadeStart) {
            console.warn('Invalid fade configuration');
            return;
        }

        let animationId: number | null = null;

        const onScroll = (): void => {
            // Cancel pending animation frame to throttle updates
            if (animationId) cancelAnimationFrame(animationId);

            animationId = requestAnimationFrame(() => {
                const y = window.scrollY || document.documentElement.scrollTop;

                if (y <= fadeStart) {
                    setOpacity(1);
                } else if (y >= fadeEnd) {
                    setOpacity(0);
                } else {
                    setOpacity(1 - (y - fadeStart) / (fadeEnd - fadeStart));
                }
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', onScroll);
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [])

    return (
        <header
            style={{ opacity, transition: LAYOUT.header.fadeTransition }}
            className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/40"
        >
            <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
                <Link href="/" className="font-bold text-xl">Vaishak Menon</Link>
                <nav className="flex items-center gap-3">
                    <Link href={SOCIAL_LINKS.linkedin} target="_blank" aria-label="LinkedIn">
                        <ThemeIcon lightSvg="/images/linkedin-white.png" darkSvg="/images/linkedin.png" width={24} height={24} alt="LinkedIn" />
                    </Link>
                    <Link href={SOCIAL_LINKS.github} target="_blank" aria-label="GitHub">
                        <ThemeIcon lightSvg="/images/github-white.svg" darkSvg="/images/github.svg" width={24} height={24} alt="GitHub" />
                    </Link>
                    <ThemeToggle />
                </nav>
            </div>
        </header>
    )
}