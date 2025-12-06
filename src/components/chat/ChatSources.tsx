// Source citations component with relevance scores

"use client";

import { useState } from 'react';
import { Source } from '@/lib/types/chat';

interface ChatSourcesProps {
  sources: Source[];
}

export function ChatSources({ sources }: ChatSourcesProps) {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <details className="mt-3 text-sm">
      <summary className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
        📚 View {sources.length} source{sources.length > 1 ? 's' : ''}
      </summary>
      <div className="mt-2 space-y-2">
        {sources.map((source, index) => (
          <SourceItem key={source.id || index} source={source} />
        ))}
      </div>
    </details>
  );
}

function SourceItem({ source }: { source: Source }) {
  const [expanded, setExpanded] = useState(false);

  // Convert cosine distance (0-2) to relevance percentage
  // 0 = perfect match (100%), 2 = worst match (0%)
  const relevance = Math.max(0, (1 - source.distance / 2) * 100);

  // Determine color based on relevance
  const relevanceColor =
    relevance >= 80
      ? 'text-green-500'
      : relevance >= 60
      ? 'text-yellow-500'
      : 'text-orange-500';

  // Truncate text if too long
  const MAX_PREVIEW_LENGTH = 150;
  const needsTruncation = source.text.length > MAX_PREVIEW_LENGTH;
  const displayText = expanded || !needsTruncation
    ? source.text
    : source.text.slice(0, MAX_PREVIEW_LENGTH) + '...';

  return (
    <div className="border border-white/10 dark:border-white/10 rounded p-3 bg-white/5 dark:bg-white/5">
      {/* Source file and relevance */}
      <div className="flex items-center justify-between mb-2 text-xs">
        <span className="font-mono opacity-70">{source.source}</span>
        <span className={`font-medium ${relevanceColor}`}>
          {relevance.toFixed(0)}% relevant
        </span>
      </div>

      {/* Source text */}
      <p className="text-sm opacity-90 leading-relaxed">
        {displayText}
      </p>

      {/* Show more/less toggle */}
      {needsTruncation && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-xs underline opacity-70 hover:opacity-100 transition-opacity"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}
