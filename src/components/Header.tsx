// components/Header.tsx
'use client';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Home } from 'lucide-react';
import { ThemeIcon, ThemeToggle } from '@/components';
import { SOCIAL_LINKS, LAYOUT } from '@/lib/constants';

export function Header(): React.ReactElement {
    const [opacity, setOpacity] = useState<number>(1);
    const [isVisible, setIsVisible] = useState(false); // Hidden initially on mobile
    const [isMobile, setIsMobile] = useState(false);
    const lastScrollY = useRef(0);
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Check if mobile
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        const fadeStart = window.innerHeight + LAYOUT.header.fadeStart;
        const fadeEnd = window.innerHeight + LAYOUT.header.fadeEnd;

        let animationId: number | null = null;

        const onScroll = (): void => {
            if (animationId) cancelAnimationFrame(animationId);

            animationId = requestAnimationFrame(() => {
                const y = window.scrollY || document.documentElement.scrollTop;

                // Desktop: opacity fade behavior
                if (y <= fadeStart) {
                    setOpacity(1);
                } else if (y >= fadeEnd) {
                    setOpacity(0);
                } else {
                    setOpacity(1 - (y - fadeStart) / (fadeEnd - fadeStart));
                }

                // Mobile: show on scroll up, hide on scroll down
                if (window.innerWidth <= 768) {
                    const scrollingUp = y < lastScrollY.current;
                    const atTop = y < 50;

                    if (scrollingUp || atTop) {
                        setIsVisible(true);
                    } else {
                        setIsVisible(false);
                    }
                } else {
                    setIsVisible(true); // Always visible on desktop
                }

                lastScrollY.current = y;
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', checkMobile);
            if (animationId) cancelAnimationFrame(animationId);
        };
    }, []);

    const isActive = (path: string) => pathname === path;

    return (
        <header
            style={{
                opacity: isMobile ? 1 : opacity,
                transform: isMobile ? `translateY(${isVisible ? '0' : '-100%'})` : 'none',
                transition: 'transform 0.3s ease, opacity 0.3s ease',
                backgroundColor: 'var(--header-bg)'
            }}
            className="sticky top-0 z-50 backdrop-blur"
        >
            <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
                <Link
                    href="/"
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    style={{ color: 'var(--header-text)' }}
                    aria-label="Home"
                >
                    <Home className="w-5 h-5" />
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