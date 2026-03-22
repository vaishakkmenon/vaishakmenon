import { LucideIcon, Sparkles, Database, Bot, Layout, Terminal, Timer, ShieldCheck, Palette, Zap } from 'lucide-react';

export interface ProjectTech {
    icon: LucideIcon;
    label: string;
}

export interface Project {
    id: string;
    category: string;
    title: string;
    description: string;
    technologies: ProjectTech[];
    link: string;
    linkLabel: string;
    icon: LucideIcon;
    /** If true, this project will be displayed as a featured card with visual preview */
    featured?: boolean;
    /** Optional custom preview component key for featured projects */
    previewType?: 'chat' | 'image' | 'code' | 'pomodoro' | 'tui' | 'none';
}

export const projects: Project[] = [
    {
        id: 'rag-assistant',
        category: 'Interactive RAG Agent',
        title: 'AI Personal Assistant',
        description:
            'An intelligent chatbot that allows visitors to query my professional background. ' +
            'It uses Retrieval-Augmented Generation (RAG) to provide grounded answers based on my resume, ' +
            'portfolio, and certifications.',
        technologies: [
            { icon: Layout, label: 'Next.js 15' },
            { icon: Bot, label: 'Python / Groq' },
            { icon: Database, label: 'ChromaDB' },
            { icon: Terminal, label: 'RAG' },
        ],
        link: '/chat',
        linkLabel: 'Try the Demo',
        icon: Sparkles,
        featured: true,
        previewType: 'chat',
    },
    {
        id: 'pomodoro-focus',
        category: 'Productivity Application',
        title: '🍅 Pomodoro Focus',
        description:
            'A production-grade, immersive focus timer designed to help users maintain flow state. ' +
            'Features a customizable Pomodoro timer, integrated "Media Dock" for ambient soundscapes, ' +
            'and secure authentication via Clerk.',
        technologies: [
            { icon: Layout, label: 'Next.js 15' },
            { icon: Zap, label: 'React 19' },
            { icon: Palette, label: 'Tailwind CSS v4' },
            { icon: ShieldCheck, label: 'Clerk Auth' },
            { icon: Database, label: 'Neon / Drizzle' },
        ],
        link: 'https://pomodoro.vaishakmenon.com',
        linkLabel: 'Live Demo',
        icon: Timer,
        featured: true,
        previewType: 'pomodoro',
    },
    {
        id: 'portfolio-tui',
        category: 'Systems / DevOps',
        title: 'Portfolio TUI',
        description:
            'An SSH-accessible, terminal-based portfolio built in Go using Bubble Tea & Lip Gloss. ' +
            'Features five TrueColor themes, a procedurally animated circuit board, IP-based rate limiting, ' +
            'and a hardened Docker deployment secured with non-root user, read-only filesystem and dropped Linux capabilities.',
        technologies: [
            { icon: Terminal, label: 'Go / Bubble Tea' },
            { icon: Sparkles, label: 'Wish (SSH)' },
            { icon: Database, label: 'Docker' },
            { icon: Zap, label: 'GitHub Actions' },
        ],
        link: 'ssh://guest@tui.vaishakmenon.com',
        linkLabel: 'ssh guest@tui.vaishakmenon.com',
        icon: Terminal,
        featured: true,
        previewType: 'tui',
    },
    // Add more projects here following the same structure
];
