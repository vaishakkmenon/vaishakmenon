'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';
import SectionHeading from '@/components/SectionHeading';
import { usePageAnimations } from '@/hooks/usePageAnimations';
import { handleImageError } from '@/lib/imageUtils';
import { CERTIFICATIONS } from '@/lib/data/certifications';
import { SECTION_IDS } from '@/lib/constants';

/**
 * Certifications section displaying professional certifications with badges and verification links.
 */
export function CertificationsSection(): React.ReactElement {
  const { list, item } = usePageAnimations();

  return (
    <AnimatedSection id={SECTION_IDS.certs} className="py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-4">
        <SectionHeading id="certs">Certifications</SectionHeading>

        <motion.div
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3"
          variants={list}
        >
          {CERTIFICATIONS && CERTIFICATIONS.length > 0 ? (
            CERTIFICATIONS.map((cert) => {
              // Validate required fields
              if (!cert?.id || !cert?.name || !cert?.image || !cert?.file) {
                if (process.env.NODE_ENV === 'development') {
                  console.warn('Invalid certification data:', cert);
                }
                return null;
              }

              return (
                <motion.div
                  key={cert.id}
                  variants={item}
                  className="mx-auto flex h-56 w-56 flex-col items-center justify-center rounded-lg border p-4 shadow-sm transition hover:shadow"
                >
                  <a
                    href={cert.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center focus:outline-none"
                  >
                    <Image
                      src={cert.image}
                      alt={`${cert.name} certification badge`}
                      width={100}
                      height={100}
                      className="mb-4 object-contain"
                      onError={handleImageError}
                      quality={85}
                      priority={false}
                    />
                    <span className="text-center font-medium">{cert.name}</span>
                  </a>
                  <span className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    Earned: {cert.earned} ·{' '}
                    <a
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline-sm"
                    >
                      Verify
                    </a>
                  </span>
                </motion.div>
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
