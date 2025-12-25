// TypeScript types for RAG chatbot

export interface Message {
  id: string;                    // UUID for React key
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  confidence?: number;
  grounded?: boolean;            // Track if answer is grounded in docs
  timestamp: Date;
  rewrite_metadata?: RewriteMetadata;
  ambiguity?: AmbiguityMetadata;
}

export interface ChatRequest {
  question: string;              // 1-2000 characters (backend validation)
  session_id?: string;           // UUID v4
}

export interface Source {
  id: string;                    // e.g., "resume.md:3"
  source: string;                // File path
  text: string;                  // Chunk text
  distance: number;              // Cosine distance: 0 (best) to 2 (worst)
}

export interface AmbiguityMetadata {
  is_ambiguous: boolean;
  score: number;                 // 0.0-1.0
  clarification_requested: boolean;
}

export interface RewriteMetadata {
  original_query: string;
  rewritten_query: string;
  pattern_name: string;
  pattern_type: string;
  matched_entities: Record<string, unknown>;
  rewrite_hint?: string;
  metadata_filter_addition?: Record<string, unknown>;
  latency_ms: number;
  confidence: number;            // 0.0-1.0
}

export interface ChatResponse {
  answer: string;
  sources: Source[];
  grounded: boolean;             // True if answer is based on docs
  confidence?: number;           // Optional, 0.0-1.0
  session_id: string;            // Always returned
  ambiguity?: AmbiguityMetadata;
  rewrite_metadata?: RewriteMetadata;
}

// Partial update during streaming
export interface StreamUpdate {
  answer?: string;
  sources?: Source[];
  grounded?: boolean;
  session_id?: string;
  ambiguity?: AmbiguityMetadata;
}

// API health check status
export interface HealthStatus {
  healthy: boolean;
  error?: string;
}

// API status for UI
export type ApiStatus = 'checking' | 'healthy' | 'unhealthy';
