'use client';

import React from 'react';

import { AnimatedSection } from '@/components/AnimatedSection';
import SectionHeading from '@/components/SectionHeading';
import { SECTION_IDS } from '@/lib/constants';
import { GraduationCap, MapPin, Gamepad2, Crown, CupSoda } from 'lucide-react';

// Split into two rows for explicit layout control
const FACTS_ROW_1 = [
  { icon: GraduationCap, label: 'UAB \'25' },
  { icon: MapPin, label: 'Charlotte, NC' },
  { icon: Gamepad2, label: 'Occasional Gamer' },
];

const FACTS_ROW_2 = [
  { icon: Crown, label: 'Amateur Chess Player' },
  { icon: CupSoda, label: 'Dr. Pepper Enthusiast' },
];

/**
 * About section with personal background and professional summary.
 * Stacked layout: paragraph on top, horizontal quick facts below.
 */
export function AboutSection(): React.ReactElement {
  return (
    <AnimatedSection id={SECTION_IDS.about} className="py-24 md:py-32 relative overflow-hidden">
      <SectionHeading id="about" max="3xl">
        About Me
      </SectionHeading>

      <div className="mx-auto max-w-3xl px-4 text-center">
        {/* Professional paragraph */}
        <p className="leading-relaxed text-lg text-zinc-700 dark:text-zinc-300 mb-8">
          Recent Computer Science graduate with a versatile foundation in Python
          development, machine learning, and DevOps practices. Certified Kubernetes
          Administrator with hands-on experience in GCP, Docker, and Linux. Eager to
          contribute on an entry-level team—whether in Software Engineering, DevOps,
          or IT operations—and grow into a well-rounded technology professional.
        </p>

        {/* Quick facts - Row 1 */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-2">
          {FACTS_ROW_1.map((fact, index) => (
            <React.Fragment key={fact.label}>
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <fact.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm">{fact.label}</span>
              </div>
              {index < FACTS_ROW_1.length - 1 && (
                <span className="hidden md:inline text-zinc-300 dark:text-zinc-600">•</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Quick facts - Row 2 */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {FACTS_ROW_2.map((fact, index) => (
            <React.Fragment key={fact.label}>
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <fact.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm">{fact.label}</span>
              </div>
              {index < FACTS_ROW_2.length - 1 && (
                <span className="hidden md:inline text-zinc-300 dark:text-zinc-600">•</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

