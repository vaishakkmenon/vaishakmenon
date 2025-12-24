'use client';

import { SECTION_IDS } from '@/lib/constants';

/**
 * Hero section with name, title, and navigation links.
 * First section of the homepage.
 */
export function HeroSection(): React.ReactElement {
  return (
    <section id={SECTION_IDS.hero} className="min-h-[75vh] flex items-center">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          Vaishak Menon
        </h1>
        <p className="mt-4 text-xl">
          Entry-Level Software Engineer | Python Developer | Certified Kubernetes Administrator
        </p>
        <nav className="mt-6 flex items-center justify-center gap-6 text-base">
          <a href="#about" className="link-underline underline-offset-4 hover:opacity-80">
            About
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
