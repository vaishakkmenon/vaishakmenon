'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Project } from '@/lib/data/projects';
import { ChatPreview } from './previews/ChatPreview';
import { PomodoroPreview } from './previews/PomodoroPreview';

interface FeaturedProjectCardProps {
    project: Project;
    shouldAnimate: boolean;
    delay?: number;
}

export function FeaturedProjectCard({ project, shouldAnimate, delay = 0 }: FeaturedProjectCardProps): React.ReactElement {
    const Icon = project.icon;

    const renderPreview = () => {
        switch (project.previewType) {
            case 'chat':
                return <ChatPreview />;
            case 'pomodoro':
                return <PomodoroPreview />;
            case 'image':
            case 'code':
            case 'none':
            default:
                return null;
        }
    };

    return (
        <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={shouldAnimate ? { duration: 0.5, delay } : { duration: 0 }}
            className="group relative rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden hover:shadow-lg dark:hover:bg-white/10 transition-all"
        >
            <div className="grid md:grid-cols-2 gap-8 p-8 items-center">
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                            <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                            {project.category}
                        </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">
                        {project.title}
                    </h3>

                    <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                            <div
                                key={tech.label}
                                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-medium text-zinc-700 dark:text-zinc-300"
                            >
                                <tech.icon className="w-3.5 h-3.5" />
                                {tech.label}
                            </div>
                        ))}
                    </div>

                    <div className="pt-2">
                        <Link
                            href={project.link}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-lg shadow-blue-600/30 dark:shadow-blue-500/20"
                        >
                            {project.linkLabel}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* Visual Preview */}
                {project.previewType && project.previewType !== 'none' && (
                    <div className="relative h-full min-h-[300px] rounded-xl bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 overflow-hidden p-6 flex flex-col shadow-inner">
                        {renderPreview()}
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent dark:from-[#0a0a0a] pointer-events-none" />
                    </div>
                )}
            </div>
        </motion.div>
    );
}
