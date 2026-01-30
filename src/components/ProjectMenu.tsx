'use client';

import * as React from 'react';
import Link from 'next/link';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { LayoutGrid, Settings } from 'lucide-react';
import { projects } from '@/lib/data/projects';
import { SOCIAL_LINKS } from '@/lib/constants';
import { ThemeIcon } from '@/components/ThemeIcon';

export function ProjectMenu() {
    return (
        <div className="relative inline-flex">
            <DropdownMenu.Root modal={false}>
                <DropdownMenu.Trigger asChild>
                    <button
                        className="flex items-center justify-center w-9 h-9 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-[var(--color-foreground)] opacity-100"
                        aria-label="Menu"
                    >
                        <LayoutGrid className="w-5 h-5 stroke-2" />
                    </button>
                </DropdownMenu.Trigger>

                {/* Portal removed to fix positioning context */}
                <DropdownMenu.Content
                    className="
                        z-[60] min-w-[320px] 
                        max-h-[85vh] overflow-y-auto
                        bg-[var(--color-background)] backdrop-blur-xl 
                        border border-[var(--color-border)] rounded-2xl p-2 
                        animate-in fade-in zoom-in-95 duration-200
                        
                        /* --- THE FINAL FIX --- */
                        !absolute             /* 1. Force absolute positioning */
                        !right-0              /* 2. Lock to right edge of container */
                        !left-auto            /* 3. Ignore Radix's 'left' calculation */
                        !top-[calc(100%+8px)] /* 4. Force vertical position */
                        
                        !transform-none       /* 5. THE KILL SWITCH: Block Radix's translate() */
                        /* --------------------- */
                    "
                    sideOffset={8}
                    side="bottom"
                    align="end"
                    alignOffset={0}
                    avoidCollisions={false}
                    collisionPadding={0}
                >


                    {/* Projects Section */}
                    <div className="p-2">
                        <div className="text-xs font-semibold text-[var(--color-muted)] px-2 mb-2 uppercase tracking-wider">
                            Projects
                        </div>
                        <div className="grid grid-cols-1 gap-1">
                            {projects.map((project) => (
                                <DropdownMenu.Item key={project.id} asChild>
                                    <Link
                                        href={project.link}
                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 focus:bg-black/5 dark:focus:bg-white/5 transition-colors group outline-none"
                                    >
                                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20 transition-colors">
                                            <project.icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-[var(--color-foreground)] truncate">
                                                {project.title}
                                            </div>
                                            <div className="text-[10px] text-[var(--color-muted)] truncate">
                                                {project.category}
                                            </div>
                                        </div>
                                    </Link>
                                </DropdownMenu.Item>
                            ))}
                        </div>
                    </div>



                    {/* Footer / Connect */}
                    <div className="p-2 grid grid-cols-3 gap-1">
                        <DropdownMenu.Item asChild>
                            <Link
                                href={SOCIAL_LINKS.github}
                                target="_blank"
                                className="flex items-center justify-center p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--color-foreground)] transition-colors"
                            >
                                <ThemeIcon lightSvg="/images/github-white.svg" darkSvg="/images/github.svg" width={20} height={20} alt="GitHub" />
                            </Link>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item asChild>
                            <Link
                                href={SOCIAL_LINKS.linkedin}
                                target="_blank"
                                className="flex items-center justify-center p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--color-foreground)] transition-colors"
                            >
                                <ThemeIcon lightSvg="/images/linkedin-white.png" darkSvg="/images/linkedin.png" width={20} height={20} alt="LinkedIn" />
                            </Link>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item asChild>
                            <Link
                                href="/admin"
                                className="flex items-center justify-center p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
                            >
                                <Settings className="w-5 h-5" />
                            </Link>
                        </DropdownMenu.Item>
                    </div>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </div>
    );
}
