// Welcome state with example questions

'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface ChatWelcomeProps {
  onExampleClick: (question: string) => void;
}

const EXAMPLE_QUESTIONS = [
  'What certifications have you earned?',
  'What was your graduate GPA?',
  'Tell me about your education',
  'What projects have you worked on?',
];

export function ChatWelcome({ onExampleClick }: ChatWelcomeProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = prefersReducedMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
      hidden: { opacity: 0, y: 16 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
      },
    };

  const itemVariants = prefersReducedMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
      hidden: { opacity: 0, y: 8 },
      visible: { opacity: 1, y: 0 },
    };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="text-center mt-20 space-y-8"
    >
      {/* Welcome heading */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Ask me anything</h1>
        <p className="text-lg opacity-70">
          I can answer questions about my education, certifications, projects, and professional background.
        </p>
      </div>

      {/* Example questions */}
      <div>
        <p className="text-sm opacity-50 mb-4">Try one of these:</p>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto"
          variants={containerVariants}
        >
          {EXAMPLE_QUESTIONS.map((question, index) => (
            <motion.button
              key={index}
              variants={itemVariants}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={() => onExampleClick(question)}
              aria-label={`Ask: ${question}`}
              className="text-left p-4 rounded-lg border border-white/20 dark:border-white/20 bg-white/5 dark:bg-white/5 hover:bg-white/10 dark:hover:bg-white/10 transition-colors"
            >
              <span className="text-sm md:text-base">{question}</span>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Powered by note */}
      <p className="text-xs opacity-40 mt-8">
        Powered by RAG (Retrieval-Augmented Generation) with real-time document search
      </p>
    </motion.div>
  );
}
