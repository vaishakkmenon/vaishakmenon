// Individual message bubble component

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Message } from '@/lib/types/chat';
import { ChatSources } from './ChatSources';
import ReactMarkdown from 'react-markdown';


interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming = false }: ChatMessageProps) {
  const prefersReducedMotion = useReducedMotion();

  const variants = prefersReducedMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } };

  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  // Filter sources to only show those that are explicitly cited in the content
  // e.g. "some text [1]" -> shows source index 0 (if valid)
  const usedIndices = new Set<number>();
  if (message.content) {
    const matches = message.content.matchAll(/\[(\d+)\]/g);
    for (const match of matches) {
      const index = parseInt(match[1], 10) - 1;
      if (!isNaN(index) && index >= 0) {
        usedIndices.add(index);
      }
    }
  }

  const filteredSources = message.sources?.filter((_, index) => usedIndices.has(index)) || [];

  return (
    <motion.article
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      role="article"
      aria-label={`${message.role} message`}
    >
      <div
        className={`rounded-lg px-4 py-3 shadow-sm inline-block ${isUser
          ? 'ml-auto max-w-[80%] md:max-w-[65%] bg-white/10 dark:bg-white/10'
          : 'max-w-[85%] md:max-w-[70%] bg-white/5 dark:bg-white/5'
          }`}
      >
        <div className={`text-base md:text-lg leading-relaxed break-words ${isAssistant && !isStreaming ? '' : 'whitespace-pre-wrap'}`}>
          {isAssistant ? (
            isStreaming ? (
              // During streaming: plain text with inline cursor
              <>
                {message.content.replace(/(\[\d+\] .*?(\n|$))+$/, '').trim()}
                <span className="inline-block w-[2px] h-[1.1em] ml-0.5 bg-current animate-pulse" style={{ verticalAlign: 'text-bottom' }} />
              </>
            ) : (
              // After streaming completes: render as markdown
              <ReactMarkdown
                components={{
                  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                      {children}
                    </a>
                  ),
                  ul: ({ children }: { children?: React.ReactNode }) => <ul className="list-disc ml-6 my-1">{children}</ul>,
                  ol: ({ children }: { children?: React.ReactNode }) => <ol className="list-decimal ml-6 my-1">{children}</ol>,
                  li: ({ children }: { children?: React.ReactNode }) => <li className="mb-0.5">{children}</li>,
                  p: ({ children }: { children?: React.ReactNode }) => <p className="mb-2 last:mb-0">{children}</p>,
                  code: ({ children, className }: { children?: React.ReactNode; className?: string }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="bg-black/20 rounded px-1 py-0.5 text-sm font-mono">{children}</code>
                    ) : (
                      <code className="block bg-black/20 rounded p-2 text-sm font-mono overflow-x-auto my-2">{children}</code>
                    );
                  },
                  strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-semibold text-white/90">{children}</strong>,
                }}
              >
                {message.content.replace(/(\[\d+\] .*?(\n|$))+$/, '').trim()}
              </ReactMarkdown>
            )
          ) : (
            message.content
          )}
        </div>

        {/* Grounded warning for assistant messages */}
        {isAssistant && message.grounded === false && (
          <div className="text-amber-500 text-sm mt-2 flex items-start gap-1">
            <span>⚠️</span>
            <span>This answer may not be well-supported by available documents</span>
          </div>
        )}

        {/* Confidence indicator (Phase 3 - optional) */}
        {isAssistant && message.confidence !== undefined && message.confidence < 0.7 && (
          <div className="text-xs mt-2 opacity-70">
            Confidence: {(message.confidence * 100).toFixed(0)}%
          </div>
        )}

        {/* Query rewrite indicator (Phase 3 - optional) */}
        {isAssistant && message.rewrite_metadata && (
          <div className="text-sm text-blue-400 mt-2 bg-blue-500/10 p-2 rounded border border-blue-500/30">
            <div className="flex items-start gap-1">
              <span>🔄</span>
              <div>
                <div>
                  Query rewritten: &quot;{message.rewrite_metadata.original_query}&quot; → &quot;{message.rewrite_metadata.rewritten_query}&quot;
                </div>
                {message.rewrite_metadata.rewrite_hint && (
                  <div className="text-xs mt-1 opacity-80">{message.rewrite_metadata.rewrite_hint}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Ambiguity alert (Phase 3 - optional) */}
        {isAssistant && message.ambiguity?.is_ambiguous && message.ambiguity.clarification_requested && (
          <div className="bg-yellow-500/10 border border-yellow-500/50 p-3 rounded mt-2">
            <div className="flex items-start gap-1">
              <span>⚠️</span>
              <div>
                <div>Your question is ambiguous. The answer may be based on assumptions.</div>
                <div className="text-xs mt-1">Ambiguity score: {(message.ambiguity.score * 100).toFixed(0)}%</div>
              </div>
            </div>
          </div>
        )}

        {/* Source citations - filtered by usage */}
        {isAssistant && filteredSources.length > 0 && (
          <ChatSources sources={filteredSources} />
        )}
      </div>
    </motion.article>
  );
}
