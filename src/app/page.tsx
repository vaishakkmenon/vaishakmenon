"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Home() {
    const TOTAL_SLOTS = 3;
    const certifications = [
        {
            name: 'Certified Kubernetes Administrator',
            file: '/certs/CKA_Cert.pdf',
            image: '/kubernetes-cka.svg',
        },
        {
            name: 'AWS Certified Cloud Practitioner',
            file: '/certs/AWS-CCP-Cert.pdf',
            image: '/aws-ccp.png',
        },
    ];

    const slots = [
        ...certifications,
        ...Array(Math.max(0, TOTAL_SLOTS - certifications.length)).fill(null),
    ] as Array<{ name: string; file: string; image: string } | null>;

    // Animation variants for sections
    const sectionVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div
            id="scroll-container"
            className="snap-container fixed inset-0 w-screen overflow-y-scroll"
            style={{ overscrollBehavior: 'contain' }}
        >
            {/* Hero Section */}
            <section className="h-screen flex flex-col justify-center items-center text-center bg-hero font-headline">
                <h1 className="text-6xl md:text-8xl font-extrabold mb-4">
                    Vaishak Menon
                </h1>
                <p className="text-xl md:text-2xl mb-8">
                    Software Engineer • ML/DL Enthusiast
                </p>
                <nav className="space-x-6">
                    <a href="#about" className="hover:underline">
                        About
                    </a>
                    <a href="#education" className="hover:underline">
                        Education
                    </a>
                    <a href="#certs" className="hover:underline">
                        Certs
                    </a>
                </nav>
            </section>

            <div id="hero-end" className="absolute top-[100vh] w-full h-0" />

            {/* About Me Section */}
            <motion.section
                id="about"
                className="h-screen flex flex-col justify-center items-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={sectionVariants}
                transition={{ duration: 0.8 }}
            >
                <section className="card p-8 border-0 max-w-3xl">
                    <h2 className="text-2xl font-bold mb-4 flex justify-center">
                        About Me
                    </h2>
                    <hr className="border-t border-gray-300 dark:border-gray-600 my-4" />
                    <p className="text-lg leading-relaxed">
                        Hi! I&apos;m a recent computer science graduate with Python development
                        and machine/deep learning project experience. A Certified Kubernetes
                        Administrator with basic GCP exposure, comfortable with Git and Docker
                        on Linux, I&apos;m seeking an entry level software engineering or DevOps role
                        where I can grow and ship reliable code.
                    </p>
                </section>
            </motion.section>

            {/* Education Section */}
            <motion.section
                id="education"
                className="h-screen flex flex-col justify-center items-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={sectionVariants}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <section className="card p-8 border-0 max-w-4xl">
                    <h2 className="text-2xl font-bold mb-4 text-center">
                        Education
                    </h2>
                    <hr className="border-t border-gray-300 dark:border-gray-600 my-4" />
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="text-center">
                            <p className="text-lg leading-relaxed mb-4">
                                School: University of Alabama at Birmingham
                            </p>
                            <ol className="list-decimal list-inside space-y-2">
                                <li>Masters of Science in Computer Science</li>
                                <li>Bachelors of Science in Computer Science</li>
                            </ol>
                        </div>
                        <div className="text-center">
                            <p className="text-lg leading-relaxed mb-4">Courses Taken:</p>
                            <ul className="grid grid-cols-2 grid-rows-3 gap-6 list-none place-items-center">
                                <li>Machine Learning</li>
                                <li>Deep Learning</li>
                                <li>Computer Vision</li>
                                <li>Foundations of Data Science</li>
                                <li>Database Systems</li>
                                <li>Advanced Algorithms and Data Structures</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </motion.section>

            {/* Certifications Section */}
            <motion.section
                id="certs"
                className="h-screen flex flex-col justify-center items-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={sectionVariants}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                <section className="card p-8 border-0 max-w-5xl">
                    <h2 className="text-2xl font-bold mb-6 text-center dark:text-dark-text">
                        Certifications
                    </h2>
                    <hr className="border-t border-gray-300 dark:border-gray-600 my-4" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-h-[80vh] overflow-y-auto">
                        {slots.map((cert, idx) =>
                            cert ? (
                                <a
                                    key={idx}
                                    href={cert.file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white dark:bg-dark-card rounded-lg shadow p-4 w-56 h-56 flex flex-col items-center justify-center transition-transform hover:scale-96"
                                >
                                    <Image
                                        src={cert.image}
                                        alt={cert.name}
                                        width={56}
                                        height={56}
                                        className="object-contain mb-4"
                                    />
                                    <span className="text-center font-medium text-gray-800 dark:text-dark-text">
                                        {cert.name}
                                    </span>
                                </a>
                            ) : (
                                <div
                                    key={idx}
                                    className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow p-6 w-56 h-56 flex flex-col items-center justify-center"
                                >
                                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Coming Soon
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                </section>
            </motion.section>

            {/* Resume Section */}
            <motion.section
                id="resume"
                className="h-screen flex flex-col justify-center items-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={sectionVariants}
                transition={{ duration: 0.8, delay: 0.6 }}
            >
                <section className="card p-6 md:p-8 text-center max-w-md">
                    <h2 className="text-2xl font-bold mb-4 dark:text-dark-text">
                        My Resume
                    </h2>
                    <a
                        href="\resume\Resume-Vaishak_Menon.pdf"
                        download
                        className="inline-block transition-transform hover:scale-105"
                    >
                        <Image
                            src="/resume/resume_preview.png"
                            alt="Resume Preview"
                            width={300}
                            height={400}
                            className="rounded-lg shadow-lg"
                        />
                    </a>
                </section>
            </motion.section>
            <section id="footer" className="flex justify-center items-center py-8">
                <footer className="text-center">
                    © {new Date().getFullYear()} Vaishak Menon. All rights reserved.
                </footer>
            </section>
        </div>
    );
}