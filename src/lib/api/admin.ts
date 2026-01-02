const API_BASE = 'https://api.vaishakmenon.com';

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface Document {
  name: string;
  path: string;
  size_bytes: number;
  size: string;
  modified: string;
  extension: string;
}

export interface DocumentContent {
  status: string;
  name: string;
  content: string;
  size_bytes: number;
  modified: string;
}

export interface DocumentsResponse {
  status: string;
  documents: Document[];
  total_count: number;
  docs_dir: string;
}

export interface ChromaDBStatus {
  status: string;
  message: string;
  path: string;
  exists: boolean;
  document_count: number;
  chunk_count: number;
  unique_sources: string[];
  storage_files_count: number;
  storage_dirs_count: number;
  total_size_bytes: number;
  total_size: string;
}

export interface CacheStats {
  total_entries: number;
  total_size_bytes: number;
  total_size: string;
  hit_rate?: number;
  miss_rate?: number;
}

export interface HealthResponse {
  status: string;
  version: string;
  components: {
    chromadb: string;
    redis: string;
    llm: string;
  };
}

export interface IngestResponse {
  status: string;
  message: string;
  ingested_chunks: number;
  bm25_stats: {
    status: string;
    doc_count: number;
  };
}

class AdminAPI {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('admin_token');
  }

  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      sessionStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
      throw new Error('Unauthorized');
    }
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(error.detail || error.message || 'Request failed');
    }
    return response.json();
  }

  // Authentication
  async login(username: string, password: string): Promise<AuthResponse> {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_BASE}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(error.detail || 'Invalid credentials');
    }

    return response.json();
  }

  async getCurrentUser(): Promise<{ username: string }> {
    const response = await fetch(`${API_BASE}/auth/users/me`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Documents
  async listDocuments(): Promise<DocumentsResponse> {
    const response = await fetch(`${API_BASE}/admin/documents`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getDocument(filename: string): Promise<DocumentContent> {
    const response = await fetch(`${API_BASE}/admin/documents/${encodeURIComponent(filename)}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async uploadDocument(file: File, overwrite = false): Promise<{ status: string; message: string; name: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('overwrite', String(overwrite));

    const token = this.getToken();
    const response = await fetch(`${API_BASE}/admin/documents/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    return this.handleResponse(response);
  }

  async saveDocument(filename: string, content: string): Promise<{ status: string; message: string }> {
    const blob = new Blob([content], { type: 'text/markdown' });
    const file = new File([blob], filename, { type: 'text/markdown' });
    return this.uploadDocument(file, true);
  }

  async deleteDocument(filename: string): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE}/admin/documents/${encodeURIComponent(filename)}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Knowledge Base
  async getChromaDBStatus(): Promise<ChromaDBStatus> {
    const response = await fetch(`${API_BASE}/admin/chromadb/status`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async ingestDocuments(): Promise<IngestResponse> {
    const response = await fetch(`${API_BASE}/ingest`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async reingestDocuments(): Promise<IngestResponse> {
    const response = await fetch(`${API_BASE}/admin/reingest`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async clearChromaDB(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE}/admin/chromadb`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Cache
  async getCacheStats(): Promise<CacheStats> {
    const response = await fetch(`${API_BASE}/admin/fallback-cache/stats`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async clearCache(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE}/admin/fallback-cache`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async cleanupExpiredCache(): Promise<{ status: string; message: string; removed_count?: number }> {
    const response = await fetch(`${API_BASE}/admin/fallback-cache/cleanup`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Health
  async getHealth(): Promise<HealthResponse> {
    const response = await fetch(`${API_BASE}/health`);
    return this.handleResponse(response);
  }
}

export const adminAPI = new AdminAPI();
