'use client';

import { AnimatedSection } from '@/components/AnimatedSection';
import SectionHeading from '@/components/SectionHeading';
import { SECTION_IDS } from '@/lib/constants';

/**
 * About section with personal background and professional summary.
 */
export function AboutSection(): React.ReactElement {
  return (
    <AnimatedSection id={SECTION_IDS.about} className="py-24 md:py-32">
      <SectionHeading id="about" max="3xl">
        About Me
      </SectionHeading>

      <div className="mx-auto max-w-3xl px-4 translate-x-[12px] lg:translate-x-[20px]">
        <p className="leading-relaxed text-lg">
          Recent Computer Science graduate with a versatile foundation spanning
          Python development, machine/deep learning projects, and DevOps
          practices. Certified Kubernetes Administrator with working knowledge
          of GCP, Git, Docker, and Linux. Eager to contribute on an
          entry-level team—whether in Software Engineering, DevOps, or IT
          operations—and grow into a well-rounded technology professional.
        </p>
      </div>
    </AnimatedSection>
  );
}
