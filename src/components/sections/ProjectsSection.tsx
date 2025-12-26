'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SECTION_IDS } from '@/lib/constants';
import SectionHeading from '@/components/SectionHeading';
import { projects } from '@/lib/data/projects';
import { StackedProjectCards } from '@/components/projects';

export function ProjectsSection(): React.ReactElement {
    // Disable scroll animations on mobile to prevent jitter
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        const checkDesktop = () => setShouldAnimate(window.innerWidth > 768);
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    return (
        <section id={SECTION_IDS.projects} className="py-24 md:py-32 relative overflow-hidden">
            <div className="mx-auto max-w-5xl px-4">
                <SectionHeading id="projects">Featured Projects</SectionHeading>

                <motion.div
                    initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={shouldAnimate ? { duration: 0.5 } : { duration: 0 }}
                    className="mb-12 text-center"
                >
                    <p className="text-lg opacity-70 max-w-2xl mx-auto">
                        Building intelligent applications that bridge the gap between data and user experience.
                    </p>
                </motion.div>

                {/* Stacked Card Deck */}
                <motion.div
                    initial={shouldAnimate ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={shouldAnimate ? { duration: 0.6, delay: 0.2 } : { duration: 0 }}
                >
                    <StackedProjectCards projects={projects} />
                </motion.div>
            </div>
        </section>
    );
}
