'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { SECTION_IDS } from '@/lib/constants';
import { Sparkles, ArrowRight, Database, Bot, Layout, Terminal } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
// ...
export function ProjectsSection(): React.ReactElement {
    return (
        <section id={SECTION_IDS.projects} className="py-24 md:py-32 relative overflow-hidden">
            {/* Background decoration - temporarily disabled */}
            {/* <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10" /> */}

            <div className="mx-auto max-w-5xl px-4">
                <SectionHeading id="projects">Featured Projects</SectionHeading>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 text-center"
                >
                    <p className="text-lg opacity-70 max-w-2xl mx-auto">
                        Building intelligent applications that bridge the gap between data and user experience.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-8">
                    {/* AI Assistant Project Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="group relative rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden hover:shadow-lg dark:hover:bg-white/10 transition-all"
                    >
                        <div className="grid md:grid-cols-2 gap-8 p-8 items-center">
                            <div className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                        Interactive RAG Agent
                                    </span>
                                </div>

                                <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">
                                    AI Personal Assistant
                                </h3>

                                <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                    An intelligent chatbot that allows visitors to query my professional background.
                                    It uses Retrieval-Augmented Generation (RAG) to provide grounded answers based on my resume,
                                    portfolio, and certifications.
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { icon: Layout, label: 'Next.js 15' },
                                        { icon: Bot, label: 'Python / Groq' },
                                        { icon: Database, label: 'ChromaDB' },
                                        { icon: Terminal, label: 'RAG' },
                                    ].map((tech) => (
                                        <div key={tech.label} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                            <tech.icon className="w-3.5 h-3.5" />
                                            {tech.label}
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-2">
                                    <Link
                                        href="/chat"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-lg shadow-blue-500/20"
                                    >
                                        Try the Demo
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>

                            {/* Visual Representation */}
                            <div className="relative h-full min-h-[300px] rounded-xl bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 overflow-hidden p-6 flex flex-col shadow-inner">
                                <div className="flex items-center gap-2 mb-4 opacity-50">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>

                                <div className="space-y-4 font-mono text-sm">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
                                            <span className="text-blue-600 dark:text-blue-400 text-xs">AI</span>
                                        </div>
                                        <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-transparent rounded-lg rounded-tl-none p-3 max-w-[85%] text-zinc-600 dark:text-zinc-300 shadow-sm dark:shadow-none">
                                            <p>Hello! I can answer questions about Vaishak's experience with Python, Kubernetes, and Cloud platforms. What would you like to know?</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 flex-row-reverse">
                                        <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-white/10 flex items-center justify-center shrink-0">
                                            <span className="text-zinc-500 dark:text-zinc-400 text-xs">You</span>
                                        </div>
                                        <div className="bg-blue-600 dark:bg-blue-600/20 border border-transparent dark:border-blue-500/30 rounded-lg rounded-tr-none p-3 max-w-[85%] text-white dark:text-blue-100 shadow-sm dark:shadow-none">
                                            <p>How much experience does he have with AWS?</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
                                            <span className="text-blue-600 dark:text-blue-400 text-xs">AI</span>
                                        </div>
                                        <div className="bg-white dark:bg-white/5 border border-zinc-200 dark:border-transparent rounded-lg rounded-tl-none p-3 max-w-[85%] text-zinc-600 dark:text-zinc-300 shadow-sm dark:shadow-none">
                                            <p>Vaishak is a Certified AWS Cloud Practitioner (May 2025) and AWS AI Practitioner (June 2025). He has hands-on experience deploying scalable applications...</p>
                                            <div className="mt-2 flex gap-1">
                                                <div className="h-1.5 w-12 rounded-full bg-zinc-200 dark:bg-white/10" />
                                                <div className="h-1.5 w-8 rounded-full bg-zinc-200 dark:bg-white/10" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent dark:from-[#0a0a0a] pointer-events-none" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
