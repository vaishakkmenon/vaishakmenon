'use client';

import * as React from 'react';
import Link from 'next/link';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ArrowRight, LayoutGrid } from 'lucide-react';
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
                    {/* Internal Link Section */}
                    <div className="p-2">
                        <div className='text-xs font-semibold text-[var(--color-muted)] px-2 mb-2 uppercase tracking-wider'>
                            Browse
                        </div>
                        <div className="grid grid-cols-1 gap-1">
                            <DropdownMenu.Item asChild>
                                <Link
                                    href="/projects"
                                    className="flex items-center justify-between p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 focus:bg-black/5 dark:focus:bg-white/5 transition-colors group outline-none"
                                >
                                    <span className="text-sm font-medium text-[var(--color-foreground)]">
                                        Projects
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-[var(--color-muted)] group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </DropdownMenu.Item>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-[var(--color-border)] mx-2 my-1" />

                    {/* Footer / Connect */}
                    <div className="p-2 grid grid-cols-2 gap-1">
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
                    </div>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </div>
    );
}
