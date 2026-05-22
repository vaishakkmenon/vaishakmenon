import { useRef, useState, KeyboardEvent } from 'react';
import { ApiStatus } from '@/lib/types/chat';
import SectionHeading from '@/components/SectionHeading';
import { motion, useReducedMotion } from 'framer-motion';
import { streamLLMCompletion } from '@/lib/api/shakgpt';

const MAX_QUESTION_LENGTH = 2000;
const EXAMPLE_QUESTIONS = [
    'The history of the Roman Empire',
    'Once upon a time in a land far away',
    'The theory of relativity states that',
    'def fibonacci(n): ',
];

interface ShakGPTPlaygroundProps {
    apiStatus: ApiStatus;
}

export function ShakGPTPlayground({ apiStatus }: ShakGPTPlaygroundProps): React.ReactElement {
    const [prompt, setPrompt] = useState('');
    const [output, setOutput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const prefersReducedMotion = useReducedMotion();
    const inputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const containerVariants = prefersReducedMotion
        ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
        : {
            hidden: { opacity: 0, y: 16 },
            visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
            },
        };

    const itemVariants = prefersReducedMotion
        ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
        : {
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
        };

    const handleStop = () => {
        abortControllerRef.current?.abort();
    };

    const handleSend = async () => {
        abortControllerRef.current = new AbortController();
        const trimmed = prompt.trim();
        if (trimmed && trimmed.length <= MAX_QUESTION_LENGTH) {
            setIsGenerating(true);
            setOutput('');
            try {
                await streamLLMCompletion(trimmed, (token) => setOutput(prev => prev + token), abortControllerRef.current.signal);
            } finally {
                setIsGenerating(false);
            }
            setPrompt('');
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <section className="py-16">
            <div className="mx-auto max-w-5xl px-4">
                <SectionHeading id="about" max="3xl">
                    Try out my LLM yourself!
                </SectionHeading>

                <p className="text-sm opacity-50 mb-4 max-w-2xl mx-auto text-center">Try one of these:</p>
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {EXAMPLE_QUESTIONS.map((question, index) => (
                        <motion.button
                            key={index}
                            variants={itemVariants}
                            transition={{
                                duration: 0.3,
                                delay: index * 0.1,
                                ease: [0.22, 1, 0.36, 1] as const,
                            }}
                            onClick={() => setPrompt(question)}
                            aria-label={`Ask: ${question}`}
                            className="text-left p-4 rounded-lg border border-white/20 dark:border-white/20 bg-white/5 dark:bg-white/5 hover:bg-white/10 dark:hover:bg-white/10 transition-colors"
                        >
                            <span className="text-sm md:text-base">{question}</span>
                        </motion.button>
                    ))}
                </motion.div>
                <div className="flex gap-3 mt-6 max-w-2xl mx-auto">
                    <input
                        ref={inputRef}
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me anything..."
                        aria-label="Type your question"
                        className="flex-1 rounded-lg border border-white/20 bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {isGenerating ? (
                        <button
                            onClick={handleStop}
                            className="px-6 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors font-medium"
                        >
                            Stop
                        </button>
                    ) : (
                        <button
                            onClick={handleSend}
                            disabled={!prompt.trim() || apiStatus !== 'healthy'}
                            className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            Generate
                        </button>
                    )}
                </div>

                {output && (
                    <div className="mt-6 max-w-2xl mx-auto rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6">
                        <p className="font-mono text-sm leading-relaxed whitespace-pre-wrap">{output}</p>
                    </div>
                )}
            </div>
        </section >
    );
};