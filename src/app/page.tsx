// app/page.tsx
"use client";

import Image from "next/image";
import { useMemo } from 'react';
import { useReducedMotion, motion, Variants } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { VARIANTS, TRANSITION, VIEWPORT } from "@/lib/motion";
import { CERTIFICATIONS } from "@/lib/data/certifications";
import { ROUTES, ANIMATION, SECTION_IDS } from '@/lib/constants';

export default function Home(): React.ReactElement {

    const preferReduced: boolean | null = useReducedMotion();

    const variants: Variants = useMemo(() =>
        preferReduced
            ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
            : VARIANTS,
        [preferReduced]
    );

    const transition = useMemo(() =>
        preferReduced ? { duration: 0 } : TRANSITION,
        [preferReduced]
    );

    const list: Variants | undefined = useMemo(() =>
        preferReduced
            ? undefined
            : {
                hidden: { opacity: 1 },
                visible: {
                    opacity: 1,
                    transition: {
                        delayChildren: ANIMATION.stagger.delayChildren,
                        staggerChildren: ANIMATION.stagger.staggerChildren
                    },
                },
            },
        [preferReduced]
    );

    const item: Variants | undefined = useMemo(() =>
        preferReduced
            ? undefined
            : {
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0 },
            },
        [preferReduced]
    );

    return (
        <>
            {/* HERO */}
            <section id={SECTION_IDS.hero} className="min-h-[75vh] flex items-center">
                <div className="mx-auto max-w-5xl px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">Vaishak Menon</h1>
                    <p className="mt-4 text-xl">
                        Entry-Level Software Engineer | Python Developer | Certified Kubernetes Administrator
                    </p>
                    <nav className="mt-6 flex items-center justify-center gap-6 text-base">
                        <a href="#about" className="link-underline underline-offset-4 hover:opacity-80">About</a>
                        <a href="#education" className="link-underline underline-offset-4 hover:opacity-80">Education</a>
                        <a href="#certs" className="link-underline underline-offset-4 hover:opacity-80">Certs</a>
                        <a href="#resume" className="link-underline underline-offset-4 hover:opacity-80">Resume</a>
                    </nav>
                </div>
            </section>

            {/* ABOUT */}
            <motion.section
                id={SECTION_IDS.about}
                className="py-24 md:py-32"
                initial="hidden"
                whileInView="visible"
                variants={variants}
                transition={transition}
                viewport={VIEWPORT}
            >
                {/* Heading at section container width so divider spans wide */}
                <SectionHeading id="about" max="3xl">About Me</SectionHeading>

                {/* Content remains comfortably narrow */}
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
            </motion.section>

            {/* EDUCATION */}
            <motion.section id={SECTION_IDS.education} className="py-24 md:py-32" initial="hidden" whileInView="visible"
                variants={variants} transition={transition} viewport={VIEWPORT}>
                <div className="mx-auto max-w-5xl px-4">
                    <SectionHeading id="education">Education</SectionHeading>
                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="text-center">
                            <p className="mb-4 text-lg leading-relaxed">School: University of Alabama at Birmingham</p>
                            <ol className="list-inside list-decimal space-y-2">
                                <li>Masters of Science in Computer Science</li>
                                <li>Bachelors of Science in Computer Science</li>
                            </ol>
                        </div>
                        <div className="text-center">
                            <p className="mb-4 text-lg leading-relaxed">Courses Taken:</p>
                            <ul className="grid grid-cols-2 grid-rows-3 place-items-center gap-6">
                                <li>Machine Learning</li><li>Deep Learning</li><li>Computer Vision</li>
                                <li>Foundations of Data Science</li><li>Database Systems</li><li>Advanced Algorithms and Data Structures</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* CERTIFICATIONS */}
            <motion.section
                id={SECTION_IDS.certs}
                className="py-24 md:py-32"
                initial="hidden"
                whileInView="visible"
                variants={variants}
                transition={transition}
                viewport={VIEWPORT}
            >
                <div className="mx-auto max-w-5xl px-4">
                    <SectionHeading id="certs">Certifications</SectionHeading>

                    {/* parent controls stagger of children */}
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
                                                onError={(e) => {
                                                    console.error(`Failed to load image: ${cert.image}`);
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                                quality={85}
                                                priority={false}
                                            />
                                            <span className="text-center font-medium">{cert.name}</span>
                                        </a>
                                        <span className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                            Earned: {cert.earned} ·{" "}
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
            </motion.section>

            {/* RESUME */}
            <motion.section id={SECTION_IDS.resume} className="py-24 md:py-32" initial="hidden" whileInView="visible"
                variants={variants} transition={transition} viewport={VIEWPORT}>
                <div className="mx-auto max-w-md px-4 text-center">
                    <SectionHeading id="resume">My Resume</SectionHeading>
                    <a href={ROUTES.resume} download className="mt-4 inline-block transition-transform hover:scale-105">
                        <Image
                            src={ROUTES.resumePreview}
                            alt="Preview of Vaishak Menon's one-page resume"
                            width={300}
                            height={400}
                            className="rounded-lg shadow-lg"
                            onError={(e) => {
                                console.error('Failed to load resume preview');
                                e.currentTarget.style.display = 'none';
                            }}
                            quality={85}
                            priority={false}
                        />
                    </a>
                </div>
            </motion.section>

            <footer className="pb-12 text-center text-sm opacity-70">© {new Date().getFullYear()} Vaishak Menon</footer>
        </>
    );
}