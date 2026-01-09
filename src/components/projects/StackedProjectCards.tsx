'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Project } from '@/lib/data/projects';
import { ChatPreview } from './previews/ChatPreview';
import { PomodoroPreview } from './previews/PomodoroPreview';

interface StackedProjectCardsProps {
    projects: Project[];
}

export function StackedProjectCards({ projects }: StackedProjectCardsProps): React.ReactElement {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const paginate = useCallback((newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => {
            let nextIndex = prevIndex + newDirection;
            if (nextIndex < 0) nextIndex = projects.length - 1;
            if (nextIndex >= projects.length) nextIndex = 0;
            return nextIndex;
        });
    }, [projects.length]);

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 100;
        if (info.offset.x > threshold) {
            paginate(-1);
        } else if (info.offset.x < -threshold) {
            paginate(1);
        }
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.8,
            rotateY: direction > 0 ? 15 : -15,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            rotateY: 0,
            zIndex: 10,
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -300 : 300,
            opacity: 0,
            scale: 0.8,
            rotateY: direction > 0 ? -15 : 15,
            zIndex: 0,
        }),
    };

    const currentProject = projects[currentIndex];
    const Icon = currentProject.icon;



    return (
        <div className="relative w-full max-w-5xl mx-auto">
            {/* Main Active Card - fixed height container prevents layout shift */}
            <div className="relative z-10 min-h-[380px] flex items-center justify-center" style={{ perspective: '1000px' }}>
                <AnimatePresence mode="popLayout" custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: 'spring', stiffness: 500, damping: 35 },
                            opacity: { duration: 0.1 },
                            scale: { duration: 0.15 },
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.7}
                        onDragEnd={handleDragEnd}
                        className="w-full cursor-grab active:cursor-grabbing"
                    >
                        <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 p-6 shadow-xl dark:shadow-2xl shadow-black/5 dark:shadow-black/20">
                            <div className={`${currentProject.previewType !== 'none' && currentProject.previewType ? 'grid md:grid-cols-2 gap-8 items-center' : ''}`}>
                                <div className="space-y-6 flex flex-col justify-center">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                            {currentProject.category}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">
                                        {currentProject.title}
                                    </h3>

                                    <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                        {currentProject.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {currentProject.technologies.map((tech) => (
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
                                            href={currentProject.link}
                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-lg shadow-blue-600/30 dark:shadow-blue-500/20"
                                        >
                                            {currentProject.linkLabel}
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Preview Section - side by side on desktop */}
                                {currentProject.previewType && currentProject.previewType !== 'none' && (
                                    <div className="hidden md:flex flex-col relative min-h-[280px] rounded-xl bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-white/10 overflow-hidden p-4 shadow-inner">
                                        {currentProject.previewType === 'chat' && <ChatPreview />}
                                        {currentProject.previewType === 'pomodoro' && <PomodoroPreview />}
                                        <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent dark:from-zinc-900 pointer-events-none" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Controls - only show when multiple projects */}
            {projects.length > 1 && (
                <>
                    <div className="flex items-center justify-center gap-4 mt-6">
                        <button
                            onClick={() => paginate(-1)}
                            className="p-2 rounded-full bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 transition-colors"
                            aria-label="Previous project"
                        >
                            <ChevronLeft className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
                        </button>

                        {/* Dots Indicator */}
                        <div className="flex gap-2">
                            {projects.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setDirection(index > currentIndex ? 1 : -1);
                                        setCurrentIndex(index);
                                    }}
                                    className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                        ? 'bg-blue-600 dark:bg-blue-400 w-6'
                                        : 'bg-zinc-300 dark:bg-white/20 hover:bg-zinc-400 dark:hover:bg-white/30'
                                        }`}
                                    aria-label={`Go to project ${index + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => paginate(1)}
                            className="p-2 rounded-full bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 transition-colors"
                            aria-label="Next project"
                        >
                            <ChevronRight className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
                        </button>
                    </div>

                    {/* Swipe hint */}
                    <p className="text-center text-sm text-zinc-400 dark:text-zinc-500 mt-4">
                        Swipe or use arrows to browse projects
                    </p>
                </>
            )}
        </div>
    );
}
