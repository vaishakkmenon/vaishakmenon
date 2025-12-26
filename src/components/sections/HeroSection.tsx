'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { SECTION_IDS } from '@/lib/constants';
import { TypewriterText } from '@/components/ui/TypewriterText';

const ROLES = [
  'Entry-Level Software Engineer',
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

        <div className="mt-5 mb-5 md:mt-8 md:mb-8 max-w-md mx-auto">
          <Link
            href="/chat"
            className="group relative flex items-center gap-3 px-4 py-3 rounded-full bg-white border-2 border-zinc-200 dark:bg-white/5 dark:border-white/10 hover:border-blue-500 hover:shadow-xl dark:hover:bg-white/10 dark:hover:border-white/20 transition-all duration-300 w-full text-left shadow-md"
          >
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
            <span className="text-zinc-700 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 font-medium">
              Ask my AI assistant about me!
            </span>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-white/5 text-[10px] font-bold text-blue-700 dark:text-zinc-500 uppercase tracking-wider border border-blue-100 dark:border-white/5">
              Beta
            </div>
          </Link>
        </div>

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
