// Source citations component with sleek card design

"use client";

import { Source } from '@/lib/types/chat';

interface ChatSourcesProps {
  sources: Source[];
}

export function ChatSources({ sources }: ChatSourcesProps) {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
      {sources.map((source, index) => (
        <SourceCard key={source.id || index} source={source} index={index} />
      ))}
    </div>
  );
}

function SourceCard({ source, index }: { source: Source; index: number }) {
  // Convert cosine distance (0-2) to relevance percentage
  const relevance = Math.max(0, (1 - source.distance / 2) * 100);

  // Determine color based on relevance
  const relevanceColor =
    relevance >= 80
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : relevance >= 60
        ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
        : 'bg-orange-500/20 text-orange-400 border-orange-500/30';

  return (
    <div className="group relative bg-white/5 border border-white/10 rounded-lg p-2.5 transition-all hover:bg-white/10 hover:border-white/20">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-mono text-blue-400 font-medium truncate pr-2" title={source.source}>
          [{index + 1}] {source.source.split('/').pop() || source.source}
        </span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${relevanceColor} flex-shrink-0`}>
          {relevance.toFixed(0)}%
        </span>
      </div>

      <p className="text-xs text-zinc-400 line-clamp-2">
        {source.text}
      </p>

      {/* Hover tooltip for full text */}
      <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity z-10 bottom-full left-0 mb-2 w-64 bg-zinc-900 border border-white/10 rounded-lg p-3 shadow-xl pointer-events-none">
        <div className="text-xs text-zinc-300 leading-relaxed max-h-48 overflow-y-auto">
          {source.text}
        </div>
      </div>
    </div>
  );
}
