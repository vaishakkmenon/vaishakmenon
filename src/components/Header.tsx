// components/Header.tsx
'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeIcon, ThemeToggle } from '@/components';
import { SOCIAL_LINKS, LAYOUT } from '@/lib/constants';

// ... (JSDoc omitted for brevity) ...

export function Header(): React.ReactElement {
    const [opacity, setOpacity] = useState<number>(1);
    const pathname = usePathname();

    useEffect(() => {
        // ... (existing scroll logic) ...
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
    }, []);

    const isActive = (path: string) => pathname === path;

    return (
        <header
            style={{
                opacity,
                transition: LAYOUT.header.fadeTransition,
                backgroundColor: 'var(--header-bg)'
            }}
            className="sticky top-0 z-50 backdrop-blur"
        >
            <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
                <Link
                    href="/"
                    className="font-bold text-xl"
                    style={{ color: 'var(--header-text)' }}
                >
                    Vaishak Menon
                </Link>
                <nav className="flex items-center gap-3">
                    <Link
                        href="/chat"
                        className={`text-sm font-medium transition-opacity ${isActive('/chat') ? 'opacity-100 underline decoration-2 underline-offset-4' : 'opacity-70 hover:opacity-100'}`}
                        style={{ color: 'var(--header-text)' }}
                    >
                        Chat
                    </Link>
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
    );
}