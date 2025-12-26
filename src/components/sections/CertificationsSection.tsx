'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';
import SectionHeading from '@/components/SectionHeading';
import { usePageAnimations } from '@/hooks/usePageAnimations';
import { handleImageError } from '@/lib/imageUtils';
import { CERTIFICATIONS } from '@/lib/data/certifications';
import { SECTION_IDS } from '@/lib/constants';
import { GlowCard } from '@/components/ui/GlowCard';
import { ExternalLink, Calendar, CheckCircle } from 'lucide-react';

/**
 * Certifications section displaying professional certifications with badges and verification links.
 */
export function CertificationsSection(): React.ReactElement {
  const { list, item } = usePageAnimations();

  return (
    <AnimatedSection id={SECTION_IDS.certs} className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decoration - temporarily disabled */}
      {/* <div className="absolute top-2/3 left-0 -translate-y-1/2 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl -z-10" /> */}
      <div className="mx-auto max-w-5xl px-4">
        <SectionHeading id="certs">Certifications</SectionHeading>

        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={list}
        >
          {CERTIFICATIONS && CERTIFICATIONS.length > 0 ? (
            CERTIFICATIONS.map((cert, index) => {
              if (!cert?.id || !cert?.name || !cert?.image || !cert?.file) {
                return null;
              }

              return (
                <GlowCard key={cert.id} className="h-full flex flex-col items-center text-center !p-6" delay={index * 0.1}>
                  <div className="relative w-24 h-24 mb-6 mx-auto transition-transform group-hover:scale-105 duration-300">
                    <Image
                      src={cert.image}
                      alt={`${cert.name} badge`}
                      fill
                      className="object-contain"
                      onError={handleImageError}
                      quality={85}
                    />
                  </div>

                  <h3 className="font-bold text-lg mb-2 line-clamp-2 min-h-[3.5rem] flex items-center justify-center">
                    {cert.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-6 bg-white/5 px-2.5 py-1 rounded-full">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Earned: {cert.earned}</span>
                  </div>

                  <div className="mt-auto w-full grid grid-cols-2 gap-3">
                    <a
                      href={cert.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-medium transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      View
                    </a>
                    <a
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600/20 text-xs font-medium transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Verify
                    </a>
                  </div>
                </GlowCard>
              );
            })
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No certifications available
            </p>
          )}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
