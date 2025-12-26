import { useMemo, useState, useEffect } from 'react';
import { useReducedMotion, Variants } from 'framer-motion';
import { VARIANTS, TRANSITION } from '@/lib/motion';
import { ANIMATION } from '@/lib/constants';

export interface PageAnimations {
  variants: Variants;
  transition: typeof TRANSITION | { duration: 0 };
  list: Variants | undefined;
  item: Variants | undefined;
}

/**
 * Centralized animation configuration that respects user motion preferences
 * and disables animations on mobile to prevent scroll jitter.
 *
 * @example
 * const { variants, transition, list, item } = usePageAnimations();
 */
export function usePageAnimations(): PageAnimations {
  const preferReduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return useMemo(() => {
    // Disable animations for reduced motion OR mobile devices
    if (preferReduced || isMobile) {
      return {
        variants: { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } },
        transition: { duration: 0 },
        list: undefined,
        item: undefined,
      };
    }

    // Full animations for desktop users who don't prefer reduced motion
    return {
      variants: VARIANTS,
      transition: TRANSITION,
      list: {
        hidden: { opacity: 1 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: ANIMATION.stagger.delayChildren,
            staggerChildren: ANIMATION.stagger.staggerChildren,
          },
        },
      },
      item: {
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0 },
      },
    };
  }, [preferReduced, isMobile]);
}

