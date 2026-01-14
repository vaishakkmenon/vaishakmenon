'use client';

import { AnimatedSection } from '@/components/AnimatedSection';
import SectionHeading from '@/components/SectionHeading';
import { ROUTES, SECTION_IDS } from '@/lib/constants';
import { GlowCard } from '@/components/ui/GlowCard';
import { Download } from 'lucide-react';
import dynamic from 'next/dynamic';

const ResumePreview = dynamic(() => import('@/components/ResumePreview').then(mod => mod.ResumePreview), {
  ssr: false,
});

/**
 * Resume section with preview and download link.
 */
export function ResumeSection(): React.ReactElement {
  return (
    <AnimatedSection id={SECTION_IDS.resume} className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decoration - temporarily disabled */}
      {/* <div className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl -z-10" /> */}
      <div className="mx-auto max-w-4xl px-4 text-center">
        <SectionHeading id="resume">My Resume</SectionHeading>

        <GlowCard className="mt-8 inline-block max-w-2xl mx-auto !p-0 overflow-hidden !border-none !bg-transparent !shadow-none">
          <div className="relative group cursor-pointer overflow-hidden rounded-xl">
            <a
              href={ROUTES.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <ResumePreview
                url={ROUTES.resume}
                width={600}
                className=""
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm z-20">
                <div className="flex flex-col items-center gap-2 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <Download className="w-8 h-8 opacity-80" />
                  <span className="font-medium">Download PDF</span>
                </div>
              </div>
            </a>
          </div>
        </GlowCard>
      </div>
    </AnimatedSection>
  );
}
