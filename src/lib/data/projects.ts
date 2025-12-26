import { LucideIcon, Sparkles, Database, Bot, Layout, Terminal } from 'lucide-react';

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
    previewType?: 'chat' | 'image' | 'code' | 'none';
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
    // Add more projects here following the same structure
];
