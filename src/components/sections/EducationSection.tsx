'use client';

import { AnimatedSection } from '@/components/AnimatedSection';
import SectionHeading from '@/components/SectionHeading';
import { SECTION_IDS } from '@/lib/constants';
import { GlowCard } from '@/components/ui/GlowCard';
import { GraduationCap, BookOpen, MapPin } from 'lucide-react';

/**
 * Education section displaying degrees and relevant coursework.
 */
export function EducationSection(): React.ReactElement {
  return (
    <AnimatedSection id={SECTION_IDS.education} className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decoration - temporarily disabled */}
      {/* <div className="absolute top-1/3 right-0 -translate-y-1/2 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -z-10" /> */}
      <div className="mx-auto max-w-5xl px-4">
        <SectionHeading id="education">Education</SectionHeading>

        <div className="grid gap-6 md:grid-cols-2">
          {/* University Degree Card */}
          <GlowCard className="h-full">
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="text-sm font-mono text-zinc-400 bg-white/5 px-2 py-1 rounded">2020 - 2025</span>
              </div>

              <h3 className="text-xl font-bold mb-2">University of Alabama at Birmingham</h3>

              <div className="space-y-3 mt-2 text-zinc-400 flex-grow">
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Masters of Science in Computer Science
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Bachelors of Science in Computer Science
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm text-zinc-500">
                <MapPin className="w-4 h-4" />
                Birmingham, AL
              </div>
            </div>
          </GlowCard>

          {/* Coursework Card */}
          <GlowCard className="h-full" delay={0.1}>
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-violet-500/20 rounded-lg text-violet-400">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">Key Coursework</h3>
              </div>

              <div className="flex flex-wrap gap-2 content-start">
                {[
                  'Machine Learning', 'Deep Learning', 'Computer Vision',
                  'Data Science', 'Database Systems',
                  'Advanced Algorithms', 'Cloud Computing'
                ].map((course) => (
                  <span key={course} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-colors cursor-default">
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </GlowCard>
        </div>
      </div>
    </AnimatedSection>
  );
}
