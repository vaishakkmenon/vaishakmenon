// Individual message bubble component

'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Message } from '@/lib/types/chat';
import { ChatSources } from './ChatSources';
import { submitFeedback } from '@/lib/api/chat';
import { ThumbsUp, ThumbsDown, ChevronDown, ChevronRight } from 'lucide-react';


interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  sessionId?: string;
}

export function ChatMessage({ message, isStreaming = false, sessionId }: ChatMessageProps) {
  const prefersReducedMotion = useReducedMotion();
  // Track selection (can change until submitted) vs submitted (locked)
  const [selectedFeedback, setSelectedFeedback] = useState<'up' | 'down' | null>(message.feedbackSubmitted || null);
  const [isSubmitted, setIsSubmitted] = useState(!!message.feedbackSubmitted);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  // Thinking section collapsed by default after completion
  const [thinkingExpanded, setThinkingExpanded] = useState(false);

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

  // Clean the message content - strip trailing source references
  const cleanedContent = message.content.replace(/(\[\d+\] .*?(\n|$))+$/, '').trim();

  const handleSelectFeedback = (thumbsUp: boolean) => {
    if (isSubmitted) return;
    const newState = thumbsUp ? 'up' : 'down';
    // Toggle: clicking same button deselects
    setSelectedFeedback(selectedFeedback === newState ? null : newState);
  };

  const handleSubmitFeedback = async () => {
    if (!sessionId || isSubmitting || !selectedFeedback || isSubmitted) return;

    setIsSubmitting(true);
    try {
      await submitFeedback({
        session_id: sessionId,
        message_id: message.id,
        thumbs_up: selectedFeedback === 'up',
        comment: comment.trim() || null,
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      // Still mark as submitted on error - feedback is best-effort
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        {/* Thinking section - progressive during stream, collapsible after */}
        {isAssistant && message.thinking && (
          isStreaming || message.isThinking ? (
            // Progressive display during streaming
            <div className="mb-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span>Thinking...</span>
              </div>
              <div className="text-sm italic opacity-70 pl-3 border-l-2 border-blue-400/30 whitespace-pre-wrap">
                {message.thinking}
              </div>
            </div>
          ) : (
            // Collapsible section after completion
            <div className="mb-3">
              <button
                onClick={() => setThinkingExpanded(!thinkingExpanded)}
                className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-300 transition-colors"
                aria-expanded={thinkingExpanded}
                aria-label={thinkingExpanded ? 'Hide reasoning' : 'Show reasoning'}
              >
                {thinkingExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
                <span>{thinkingExpanded ? 'Hide reasoning' : 'Show reasoning'}</span>
              </button>
              {thinkingExpanded && (
                <div className="mt-2 text-sm italic opacity-70 pl-3 border-l-2 border-zinc-500/30 max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {message.thinking}
                </div>
              )}
            </div>
          )
        )}

        <div className="text-base md:text-lg leading-relaxed break-words whitespace-pre-wrap">
          {cleanedContent}
          {/* Streaming cursor */}
          {isStreaming && (
            <span className="inline-block w-[2px] h-[1.1em] ml-0.5 bg-current animate-pulse align-text-bottom" />
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

        {/* Feedback - only for completed assistant messages */}
        {isAssistant && !isStreaming && message.content && sessionId && (
          <div className="flex items-center gap-1 mt-2 pt-1.5 border-t border-white/5">
            <button
              onClick={() => handleSelectFeedback(true)}
              disabled={isSubmitted}
              className={`p-1 rounded transition-colors ${selectedFeedback === 'up'
                ? 'bg-green-500/20 text-green-400'
                : isSubmitted
                  ? 'opacity-30 cursor-not-allowed text-zinc-500'
                  : 'text-zinc-500 hover:text-green-400'
                }`}
              aria-label="Thumbs up"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleSelectFeedback(false)}
              disabled={isSubmitted}
              className={`p-1 rounded transition-colors ${selectedFeedback === 'down'
                ? 'bg-red-500/20 text-red-400'
                : isSubmitted
                  ? 'opacity-30 cursor-not-allowed text-zinc-500'
                  : 'text-zinc-500 hover:text-red-400'
                }`}
              aria-label="Thumbs down"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>

            {/* Expand when feedback selected */}
            {selectedFeedback && !isSubmitted && (
              <>
                <button
                  onClick={() => setShowComment(!showComment)}
                  className="text-xs text-zinc-500 hover:text-zinc-300 ml-2"
                >
                  {showComment ? 'Hide comment' : 'Add comment'}
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  disabled={isSubmitting}
                  className="ml-auto px-2 py-0.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? '...' : 'Send'}
                </button>
              </>
            )}

            {isSubmitted && (
              <span className="text-xs text-zinc-500 ml-2">Thanks!</span>
            )}
          </div>
        )}

        {/* Comment field - outside main row for cleaner layout */}
        {isAssistant && showComment && !isSubmitted && sessionId && (
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="mt-1.5 w-full p-2 text-sm bg-white/5 border border-white/10 rounded resize-none focus:outline-none focus:border-blue-500/50"
            rows={2}
            maxLength={500}
          />
        )}
      </div>
    </motion.article>
  );
}

