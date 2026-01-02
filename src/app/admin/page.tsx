'use client';

import { useEffect, useState } from 'react';
import { FileText, Database, HardDrive, Activity, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { adminAPI, type HealthResponse, type DocumentsResponse, type ChromaDBStatus, type CacheStats } from '@/lib/api/admin';

interface DashboardStats {
  health: HealthResponse | null;
  documents: DocumentsResponse | null;
  chromadb: ChromaDBStatus | null;
  cache: CacheStats | null;
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'healthy' || status === 'connected' || status === 'available' || status === 'populated') {
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  }
  if (status === 'degraded' || status === 'empty') {
    return <AlertCircle className="w-5 h-5 text-yellow-500" />;
  }
  return <XCircle className="w-5 h-5 text-red-500" />;
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'healthy' || status === 'connected' || status === 'available' || status === 'populated') {
    return <Badge variant="success">{status}</Badge>;
  }
  if (status === 'degraded' || status === 'empty') {
    return <Badge variant="warning">{status}</Badge>;
  }
  return <Badge variant="destructive">{status}</Badge>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    health: null,
    documents: null,
    chromadb: null,
    cache: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [health, documents, chromadb, cache] = await Promise.allSettled([
          adminAPI.getHealth(),
          adminAPI.listDocuments(),
          adminAPI.getChromaDBStatus(),
          adminAPI.getCacheStats(),
        ]);

        setStats({
          health: health.status === 'fulfilled' ? health.value : null,
          documents: documents.status === 'fulfilled' ? documents.value : null,
          chromadb: chromadb.status === 'fulfilled' ? chromadb.value : null,
          cache: cache.status === 'fulfilled' ? cache.value : null,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Overview of your RAG system status
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Documents</p>
                  <p className="text-3xl font-bold mt-1">
                    {isLoading ? '-' : stats.documents?.total_count ?? 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Vector Chunks</p>
                  <p className="text-3xl font-bold mt-1">
                    {isLoading ? '-' : stats.chromadb?.chunk_count ?? 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Database className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cache Entries</p>
                  <p className="text-3xl font-bold mt-1">
                    {isLoading ? '-' : stats.cache?.total_entries ?? 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <HardDrive className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">System Status</p>
                  <div className="mt-2">
                    {isLoading ? (
                      <Badge variant="secondary">Loading...</Badge>
                    ) : stats.health ? (
                      <StatusBadge status={stats.health.status} />
                    ) : (
                      <Badge variant="destructive">Unknown</Badge>
                    )}
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Status of all system components</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
                ))}
              </div>
            ) : stats.health ? (
              <div className="space-y-3">
                {stats.health.components && Object.entries(stats.health.components).map(([name, status]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <StatusIcon status={status} />
                      <span className="font-medium capitalize">{name}</span>
                    </div>
                    <StatusBadge status={status} />
                  </div>
                ))}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">Version</span>
                  </div>
                  <Badge variant="outline">{stats.health.version}</Badge>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Unable to fetch health status
              </div>
            )}
          </CardContent>
        </Card>

        {/* ChromaDB Status */}
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Base Status</CardTitle>
            <CardDescription>ChromaDB storage information</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              </div>
            ) : stats.chromadb ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <div className="mt-1">
                    <StatusBadge status={stats.chromadb.status} />
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Documents</p>
                  <p className="text-lg font-semibold mt-1">{stats.chromadb.document_count ?? 0}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Chunks</p>
                  <p className="text-lg font-semibold mt-1">{stats.chromadb.chunk_count ?? 0}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Storage Size</p>
                  <p className="text-lg font-semibold mt-1">{stats.chromadb.total_size}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Unable to fetch ChromaDB status
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
