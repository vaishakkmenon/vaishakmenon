// app/page.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const sectionVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
};

export default function Home() {
    const certifications = [
        { name: "Certified Kubernetes Administrator", file: "/certs/CKA_Cert.pdf", image: "/images/kubernetes-cka.svg", earned: "Jun 2024", verifyUrl: "https://www.credly.com/badges/6fb906d2-66a0-4f00-8803-69458e122ad1/public_url" },
        { name: "AWS Certified Cloud Practitioner", file: "/certs/AWS-CCP-Cert.pdf", image: "/images/aws-ccp.png", earned: "May 2025", verifyUrl: "https://www.credly.com/badges/dd7e3d8e-f4f0-4caa-ac05-5a50876e79a6/public_url" },
        { name: "AWS Certified AI Practitioner", file: "/certs/AWS_AI-Cert.pdf", image: "/images/aws-cap.png", earned: "Jun 2025", verifyUrl: "https://www.credly.com/badges/9c907d66-ce15-4892-b2b5-3141d9339349/public_url" },
    ];

    return (
        <>
            {/* HERO */}
            <section id="hero" className="min-h-[75vh] flex items-center">
                <div className="mx-auto max-w-5xl px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">Vaishak Menon</h1>
                    <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
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
            <motion.section id="about" className="py-24 md:py-32" initial="hidden" whileInView="visible"
                viewport={{ once: true, amount: 0.25 }} variants={sectionVariants} transition={{ duration: 0.6 }}>
                <div className="mx-auto max-w-3xl px-4">
                    <h2 className="text-2xl text-center font-bold">About Me</h2>
                    <hr className="my-4 border-t border-gray-300 dark:border-gray-600" />
                    <p className="leading-relaxed text-lg">
                        Recent Computer Science graduate with a versatile foundation spanning Python development,
                        machine/deep learning projects, and DevOps practices. Certified Kubernetes Administrator with
                        working knowledge of GCP, Git, Docker, and Linux. Eager to contribute on an entry-level team—whether
                        in Software Engineering, DevOps, or IT operations—and grow into a well-rounded technology professional.
                    </p>
                </div>
            </motion.section>

            {/* SKILLS */}
            <motion.section id="skills" className="py-24 md:py-32" initial="hidden" whileInView="visible"
                viewport={{ once: true, amount: 0.25 }} variants={sectionVariants} transition={{ duration: 0.6, delay: 0.05 }}>
                <div className="mx-auto max-w-4xl px-4">
                    <h2 className="text-2xl font-bold text-center">Skills</h2>
                    <hr className="my-4 border-t border-gray-300 dark:border-gray-600" />
                    <ul className="space-y-3 text-lg">
                        <li><strong>Programming &amp; Development:</strong> Python; Java; C; OOP; APIs</li>
                        <li><strong>ML / Data Science:</strong> Machine Learning; Deep Learning; PyTorch; Scikit-Learn; Pandas; NumPy; Jupyter</li>
                        <li><strong>DevOps &amp; Cloud:</strong> Kubernetes (CKA); Docker; Git; Linux; CI/CD; GCP; AWS</li>
                        <li><strong>Collaboration &amp; Tools:</strong> Agile/Scrum</li>
                    </ul>
                    <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                        Keywords: Entry-Level Software Engineer; Junior DevOps Engineer; Cloud Engineer
                    </p>
                </div>
            </motion.section>

            {/* EDUCATION */}
            <motion.section id="education" className="py-24 md:py-32" initial="hidden" whileInView="visible"
                viewport={{ once: true, amount: 0.25 }} variants={sectionVariants} transition={{ duration: 0.6, delay: 0.05 }}>
                <div className="mx-auto max-w-5xl px-4">
                    <h2 className="text-2xl font-bold text-center">Education</h2>
                    <hr className="my-4 border-t border-gray-300 dark:border-gray-600" />
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
            <motion.section id="certs" className="py-24 md:py-32" initial="hidden" whileInView="visible"
                viewport={{ once: true, amount: 0.25 }} variants={sectionVariants} transition={{ duration: 0.6, delay: 0.1 }}>
                <div className="mx-auto max-w-5xl px-4">
                    <h2 className="text-2xl font-bold text-center">Certifications</h2>
                    <hr className="my-4 border-t border-gray-300 dark:border-gray-600" />
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
                        {certifications.map((cert, idx) => (
                            <div key={idx} className="mx-auto flex h-56 w-56 flex-col items-center justify-center rounded-lg border p-4 shadow-sm transition hover:shadow">
                                <a href={cert.file} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center focus:outline-none">
                                    <Image src={cert.image} alt={cert.name} width={100} height={100} className="mb-4 object-contain" />
                                    <span className="text-center font-medium">{cert.name}</span>
                                </a>
                                <span className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                    Earned: {cert.earned} · <a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer" className="underline">Verify</a>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* RESUME */}
            <motion.section id="resume" className="py-24 md:py-32" initial="hidden" whileInView="visible"
                viewport={{ once: true, amount: 0.25 }} variants={sectionVariants} transition={{ duration: 0.6, delay: 0.15 }}>
                <div className="mx-auto max-w-md px-4 text-center">
                    <h2 className="text-2xl font-bold">My Resume</h2>
                    <a href="/resume/Resume-Vaishak_Menon.pdf" download className="mt-4 inline-block transition-transform hover:scale-105">
                        <Image src="/resume/resume_preview.png" alt="Preview of Vaishak Menon's one-page resume" width={300} height={400} className="rounded-lg shadow-lg" />
                    </a>
                </div>
            </motion.section>

            <footer className="pb-12 text-center text-sm opacity-70">© {new Date().getFullYear()} Vaishak Menon</footer>
        </>
    );
}