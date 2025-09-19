// app/page.tsx
"use client";

import Image from "next/image";
import { useReducedMotion, motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { VARIANTS, TRANSITION, VIEWPORT } from "@/lib/motion";

export default function Home() {

    const preferReduced = useReducedMotion();
    const variants = preferReduced ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } } : VARIANTS;
    const transition = preferReduced ? { duration: 0 } : TRANSITION;

    const certifications = [
        { name: "Certified Kubernetes Administrator", file: "/certs/CKA_Cert.pdf", image: "/images/kubernetes-cka.svg", earned: "Jun 2024", verifyUrl: "https://www.credly.com/badges/6fb906d2-66a0-4f00-8803-69458e122ad1/public_url" },
        { name: "AWS Certified Cloud Practitioner", file: "/certs/AWS-CCP-Cert.pdf", image: "/images/aws-ccp.png", earned: "May 2025", verifyUrl: "https://www.credly.com/badges/dd7e3d8e-f4f0-4caa-ac05-5a50876e79a6/public_url" },
        { name: "AWS Certified AI Practitioner", file: "/certs/AWS_AI-Cert.pdf", image: "/images/aws-cap.png", earned: "Jun 2025", verifyUrl: "https://www.credly.com/badges/9c907d66-ce15-4892-b2b5-3141d9339349/public_url" },
    ];

    const list = preferReduced
        ? undefined
        : {
            hidden: { opacity: 1 },
            visible: {
                opacity: 1,
                transition: { delayChildren: 0.05, staggerChildren: 0.06 },
            },
        };

    const item = preferReduced
        ? undefined
        : {
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
        };

    return (
        <>
            {/* HERO */}
            <section id="hero" className="min-h-[75vh] flex items-center">
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
                id="about"
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
            <motion.section id="education" className="py-24 md:py-32" initial="hidden" whileInView="visible"
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
                id="certs"
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
                        {certifications.map((cert, idx) => (
                            <motion.div
                                key={idx}
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
                                        alt={cert.name}
                                        width={100}
                                        height={100}
                                        className="mb-4 object-contain"
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
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* RESUME */}
            <motion.section id="resume" className="py-24 md:py-32" initial="hidden" whileInView="visible"
                variants={variants} transition={transition} viewport={VIEWPORT}>
                <div className="mx-auto max-w-md px-4 text-center">
                    <SectionHeading id="resume">My Resume</SectionHeading>
                    <a href="/resume/Resume-Vaishak_Menon.pdf" download className="mt-4 inline-block transition-transform hover:scale-105">
                        <Image src="/resume/resume_preview.png" alt="Preview of Vaishak Menon's one-page resume" width={300} height={400} className="rounded-lg shadow-lg" />
                    </a>
                </div>
            </motion.section>

            <footer className="pb-12 text-center text-sm opacity-70">© {new Date().getFullYear()} Vaishak Menon</footer>
        </>
    );
}