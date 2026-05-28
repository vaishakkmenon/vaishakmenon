'use client';

import { motion } from 'framer-motion';
import { SECTION_IDS } from '@/lib/constants';
import { TypewriterText } from '@/components/ui/TypewriterText';

const ROLES = [
  'Software Engineer',
  'Python Developer',
  'Certified Kubernetes Administrator',
  'DevOps Enthusiast',
];

/**
 * Hero section with name, title, and navigation links.
 * First section of the homepage.
 */
export function HeroSection(): React.ReactElement {
  return (
    <section id={SECTION_IDS.hero} className="min-h-[100dvh] flex items-center">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-5xl md:text-6xl font-extrabold tracking-tight"
        >
          Vaishak Menon
        </motion.h1>
        <p className="mt-2 md:mt-4 text-lg md:text-xl h-7 md:h-8">
          <TypewriterText texts={ROLES} typingSpeed={60} deletingSpeed={30} pauseDuration={2500} initialDelay={2000} />
        </p>

        <nav className="mt-4 md:mt-6 flex items-center justify-center gap-4 md:gap-6 text-sm md:text-base flex-wrap">
          <a href="#about" className="link-underline underline-offset-4 hover:opacity-80">
            About
          </a>
          <a href="#projects" className="link-underline underline-offset-4 hover:opacity-80">
            Projects
          </a>
          <a href="#education" className="link-underline underline-offset-4 hover:opacity-80">
            Education
          </a>
          <a href="#certs" className="link-underline underline-offset-4 hover:opacity-80">
            Certs
          </a>
          <a href="#resume" className="link-underline underline-offset-4 hover:opacity-80">
            Resume
          </a>
        </nav>
      </div>
    </section>
  );
}
