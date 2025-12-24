import { useMemo } from 'react';
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
 * Centralized animation configuration that respects user motion preferences.
 * Returns all animation variants needed for page sections with proper accessibility support.
 *
 * @example
 * const { variants, transition, list, item } = usePageAnimations();
 */
export function usePageAnimations(): PageAnimations {
  const preferReduced = useReducedMotion();

  return useMemo(() => {
    // If user prefers reduced motion, return no-op animations
    if (preferReduced) {
      return {
        variants: { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } },
        transition: { duration: 0 },
        list: undefined,
        item: undefined,
      };
    }

    // Full animations for users who don't prefer reduced motion
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
  }, [preferReduced]);
}
