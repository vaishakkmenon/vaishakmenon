// Compact source pills with floating popover to the left

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Source } from '@/lib/types/chat';

interface ChatSourcesProps {
  sources: Source[];
}

interface PopoverPosition {
  top: number;
  left: number;
}

// Known acronyms that should stay uppercase
const ACRONYMS = new Set(['aws', 'ai', 'cka', 'ckad', 'gcp', 'api', 'sdk', 'cli', 'ml', 'llm']);

// Special filename mappings
const FILENAME_OVERRIDES: Record<string, string> = {
  'complete_transcript_analysis': 'Transcript',
  'master_profile': 'Master Profile',
};

// Format filename into a clean, readable display name
function formatSourceName(sourcePath: string): string {
  // Get just the filename
  const filename = sourcePath.split('/').pop() || sourcePath;

  // Remove .md extension
  const name = filename.replace(/\.md$/, '');

  // Check for special overrides first
  if (FILENAME_OVERRIDES[name]) {
    return FILENAME_OVERRIDES[name];
  }

  // Split by -- delimiter (e.g., "certificate--aws-ai-practitioner--2025-06-01")
  const parts = name.split('--');

  let namePart: string;
  if (parts.length >= 2) {
    // Take the main name part (usually the second part for certificates/experiences)
    namePart = parts[1];
  } else {
    namePart = name;
  }

  // Convert dashes and underscores to spaces, then format each word
  return namePart
    .split(/[-_]/)
    .map(word => {
      const lower = word.toLowerCase();
      // Keep acronyms uppercase
      if (ACRONYMS.has(lower)) {
        return word.toUpperCase();
      }
      // Title case regular words
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

export function ChatSources({ sources }: ChatSourcesProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [position, setPosition] = useState<PopoverPosition | null>(null);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Ensure we're mounted (for portal)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate position when active index changes
  const updatePosition = useCallback(() => {
    if (activeIndex === null || !containerRef.current) {
      setPosition(null);
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const popoverWidth = 280;
    const gap = 12;

    // Position to the left of the container
    let left = containerRect.left - popoverWidth - gap;

    // If not enough space on left, position to the right
    if (left < 10) {
      left = containerRect.right + gap;
    }

    // Vertical: align with the container top, but keep on screen
    let top = containerRect.top;
    const popoverHeight = 200; // approximate max height
    if (top + popoverHeight > window.innerHeight - 20) {
      top = window.innerHeight - popoverHeight - 20;
    }
    if (top < 10) top = 10;

    setPosition({ top, left });
  }, [activeIndex]);

  useEffect(() => {
    updatePosition();

    // Close on scroll for stability (no jiggling)
    const handleScroll = () => setActiveIndex(null);

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [updatePosition]);

  // Close popover when clicking outside
  useEffect(() => {
    if (activeIndex === null) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current && !containerRef.current.contains(target) &&
        popoverRef.current && !popoverRef.current.contains(target)
      ) {
        setActiveIndex(null);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [activeIndex]);

  if (!sources || sources.length === 0) {
    return null;
  }

  const activeSource = activeIndex !== null ? sources[activeIndex] : null;
  const activeFilename = activeSource?.source.split('/').pop() || activeSource?.source || '';

  const popover = activeSource && position && mounted ? createPortal(
    <div
      ref={popoverRef}
      className="fixed z-50 bg-zinc-800 border border-white/10 rounded-lg p-3 shadow-xl"
      style={{ top: position.top, left: position.left, width: 280 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-white truncate pr-2">
          {formatSourceName(activeSource.source)}
        </span>
        <button
          onClick={() => setActiveIndex(null)}
          className="text-zinc-500 hover:text-zinc-300 text-sm leading-none flex-shrink-0"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
      {/* Show full filename */}
      <div className="text-[10px] font-mono text-zinc-500 mb-2 truncate" title={activeFilename}>
        {activeFilename}
      </div>
      <p className="text-sm text-zinc-300 leading-relaxed max-h-40 overflow-y-auto">
        {activeSource.text}
      </p>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <div ref={containerRef} className="mt-3 pt-2 border-t border-white/5">
        {/* Compact pills row */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-zinc-500 mr-1">Sources:</span>
          {sources.map((source, index) => {
            const displayName = formatSourceName(source.source);
            const isActive = activeIndex === index;

            return (
              <button
                key={source.id || index}
                onClick={() => setActiveIndex(isActive ? null : index)}
                className={`text-xs px-2 py-0.5 rounded transition-colors ${
                  isActive
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                    : 'bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10 hover:text-zinc-300'
                }`}
                aria-expanded={isActive}
                aria-label={`View source: ${displayName}`}
              >
                [{index + 1}] {displayName}
              </button>
            );
          })}
        </div>
      </div>
      {popover}
    </>
  );
}
