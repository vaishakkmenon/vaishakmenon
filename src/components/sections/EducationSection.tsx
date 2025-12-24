'use client';

import { AnimatedSection } from '@/components/AnimatedSection';
import SectionHeading from '@/components/SectionHeading';
import { SECTION_IDS } from '@/lib/constants';

/**
 * Education section displaying degrees and relevant coursework.
 */
export function EducationSection(): React.ReactElement {
  return (
    <AnimatedSection id={SECTION_IDS.education} className="py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-4">
        <SectionHeading id="education">Education</SectionHeading>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="text-center">
            <p className="mb-4 text-lg leading-relaxed">
              School: University of Alabama at Birmingham
            </p>
            <ol className="list-inside list-decimal space-y-2">
              <li>Masters of Science in Computer Science</li>
              <li>Bachelors of Science in Computer Science</li>
            </ol>
          </div>
          <div className="text-center">
            <p className="mb-4 text-lg leading-relaxed">Courses Taken:</p>
            <ul className="grid grid-cols-2 grid-rows-3 place-items-center gap-6">
              <li>Machine Learning</li>
              <li>Deep Learning</li>
              <li>Computer Vision</li>
              <li>Foundations of Data Science</li>
              <li>Database Systems</li>
              <li>Advanced Algorithms and Data Structures</li>
            </ul>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
