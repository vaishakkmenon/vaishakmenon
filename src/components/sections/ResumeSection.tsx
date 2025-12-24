'use client';

import Image from 'next/image';
import { AnimatedSection } from '@/components/AnimatedSection';
import SectionHeading from '@/components/SectionHeading';
import { handleImageError } from '@/lib/imageUtils';
import { ROUTES, SECTION_IDS } from '@/lib/constants';

/**
 * Resume section with preview and download link.
 */
export function ResumeSection(): React.ReactElement {
  return (
    <AnimatedSection id={SECTION_IDS.resume} className="py-24 md:py-32">
      <div className="mx-auto max-w-md px-4 text-center">
        <SectionHeading id="resume">My Resume</SectionHeading>
        <a
          href={ROUTES.resume}
          download
          className="mt-4 inline-block transition-transform hover:scale-105"
        >
          <Image
            src={ROUTES.resumePreview}
            alt="Preview of Vaishak Menon's one-page resume"
            width={300}
            height={400}
            className="rounded-lg shadow-lg"
            onError={handleImageError}
            quality={85}
            priority={false}
          />
        </a>
      </div>
    </AnimatedSection>
  );
}
