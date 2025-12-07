'use client';

import { motion, Variants } from 'framer-motion';
import { usePageAnimations } from '@/hooks/usePageAnimations';
import { VIEWPORT } from '@/lib/motion';

export interface AnimatedSectionProps {
  /** Section ID for navigation */
  id: string;
  /** Additional CSS classes */
  className?: string;
  /** Child elements to render */
  children: React.ReactNode;
  /** Optional custom variants (uses page defaults if not provided) */
  variants?: Variants;
}

/**
 * Reusable animated section component with accessibility support.
 * Automatically respects user's reduced motion preferences.
 *
 * @example
 * <AnimatedSection id="about" className="py-24">
 *   <h2>About Me</h2>
 *   <p>Content here...</p>
 * </AnimatedSection>
 */
export function AnimatedSection({
  id,
  className,
  children,
  variants: customVariants,
}: AnimatedSectionProps): React.ReactElement {
  const { variants: defaultVariants, transition } = usePageAnimations();

  return (
    <motion.section
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={customVariants || defaultVariants}
      transition={transition}
    >
      {children}
    </motion.section>
  );
}
