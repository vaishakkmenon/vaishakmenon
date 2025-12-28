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
  feedbackSubmitted?: 'up' | 'down' | null;  // Track user feedback
  thinking?: string;             // Accumulated thinking content
  isThinking?: boolean;          // True while streaming thinking
}

export interface ChatRequest {
  question: string;              // 1-2000 characters (backend validation)
  session_id?: string;           // UUID v4
  model?: 'groq' | 'llama' | 'qwen' | 'qwen3' | 'deepinfra' | string | null;  // Model selection
  show_thinking?: boolean;       // Enable thinking process streaming
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
  thinking?: string;             // Thinking content (when show_thinking=true)
}

// Partial update during streaming
export interface StreamUpdate {
  answer?: string;
  sources?: Source[];
  grounded?: boolean;
  session_id?: string;
  ambiguity?: AmbiguityMetadata;
  thinking?: string;             // Thinking content being streamed
  isThinking?: boolean;          // True while in thinking phase
}

// Chat options for model selection and thinking display
export interface ChatOptions {
  model: 'groq' | 'qwen' | null;  // null = default (groq)
  showThinking: boolean;
}

// Feedback types
export interface FeedbackRequest {
  session_id: string;
  message_id: string;
  thumbs_up: boolean;
  comment?: string | null;
}

export interface FeedbackResponse {
  id: string;                    // UUID of the feedback record
  status: string;                // "received"
}

// API health check status
export interface HealthStatus {
  healthy: boolean;
  error?: string;
}

// API status for UI
export type ApiStatus = 'checking' | 'healthy' | 'unhealthy';

