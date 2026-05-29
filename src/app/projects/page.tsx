'use client';

import { projects } from "@/lib/data/projects";
import { ProjectCard } from "@/components/projects";

export default function ProjectsPage() {
    const sortedProjects = [...projects].sort((a, b) => a.order - b.order);

    return (
        <>
            <section className="min-h-[100dvh] flex items-center">
                <div className="mx-auto max-w-2xl px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
                        Projects
                    </h1>
                    <p className="mt-10 text-base md:text-lg opacity-40 leading-relaxed">
                        I build things from scratch, usually as a way to learn. Each of the projects below started as a
                        question: how do transformers actually work, what does production deployment look like, can a
                        portfolio fit in a terminal? Productivity apps, LLMs, systems work. Each one taught me something
                        I wouldn't have learned by reading about it.
                    </p>
                </div>
            </section>
            <div className="px-4 pb-24 md:pb-32">
                <div className="mx-auto max-w-4xl space-y-6">
                    {sortedProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            shouldAnimate={false}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}