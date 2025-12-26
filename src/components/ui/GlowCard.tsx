'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface GlowCardProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export function GlowCard({ children, className = '', delay = 0 }: GlowCardProps) {
    // Always render with animation initially (matches SSR), then disable on mobile after mount
    const [shouldAnimate, setShouldAnimate] = useState(true);

    useEffect(() => {
        // After hydration, check if mobile and disable animations
        const checkMobile = () => setShouldAnimate(window.innerWidth > 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
            whileInView={shouldAnimate ? { opacity: 1, y: 0 } : {}}
            viewport={{ once: true }}
            transition={shouldAnimate ? { duration: 0.5, delay } : {}}
            className={`group relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-sm dark:shadow-none hover:shadow-md dark:hover:bg-white/10 dark:hover:border-white/20 transition-all duration-300 ${className}`}
        >
            {/* White Light Orb - Top Left */}
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none bg-white/10 dark:bg-white/15" />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
