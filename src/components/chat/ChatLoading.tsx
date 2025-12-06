// Loading indicator with pulsing dots animation

"use client";

import { motion } from 'framer-motion';

export function ChatLoading() {
  return (
    <div className="flex items-center gap-1 p-4" role="status" aria-live="polite" aria-label="Thinking">
      <span className="sr-only">Thinking...</span>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-white/40 dark:bg-white/40"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
