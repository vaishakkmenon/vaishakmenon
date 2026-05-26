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
    featured?: boolean;
    previewHeight?: string;
    previewType?: 'chat' | 'image' | 'code' | 'pomodoro' | 'tui' | 'shakgpt' | 'none';
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
        link: 'https://github.com/vaishakkmenon/RAG_Personal',
        linkLabel: 'View Code',
        icon: Sparkles,
        featured: true,
        previewHeight: '400px',
        previewType: 'chat',
    },
    {
        id: 'pomodoro-focus',
        category: 'Productivity Application',
        title: 'Pomodoro Focus',
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
        previewHeight: '400px',
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
    {
        id: 'shakgpt-visualizer',
        category: 'Machine Learning',
        title: 'ShakGPT Attention Visualizer',
        description:
            'An interactive visualization of the attention patterns inside ShakGPT, ' +
            'a 345M-parameter decoder-only transformer I built and trained from scratch. ' +
            'Pick a prompt and explore layer by layer, head by head, how each token attends ' +
            'to every other — rendered as a live heatmap from the model\'s own forward pass.',
        technologies: [
            { icon: Bot, label: 'PyTorch' },
            { icon: Sparkles, label: 'Transformers' },
            { icon: Layout, label: 'Next.js 15' },
            { icon: Palette, label: 'D3 / Visualization' },
        ],
        link: '/shakgpt',
        linkLabel: 'Explore the Visualizer',
        icon: Sparkles,
        featured: true,
        previewType: 'shakgpt',
    },
];
