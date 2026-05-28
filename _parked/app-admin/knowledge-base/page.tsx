'use client';

import { useEffect, useState, useCallback } from 'react';
import { Database, RefreshCw, Trash2, Plus, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/useToast';
import { adminAPI, type ChromaDBStatus } from '@/lib/api/admin';

export default function KnowledgeBasePage() {
  const [status, setStatus] = useState<ChromaDBStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isIngesting, setIsIngesting] = useState(false);
  const [isReingesting, setIsReingesting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [lastIngestResult, setLastIngestResult] = useState<{ chunks: number; docs: number } | null>(null);
  const { toast } = useToast();

  const fetchStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await adminAPI.getChromaDBStatus();
      setStatus(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load status',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleIngest = async () => {
    setIsIngesting(true);
    try {
      const result = await adminAPI.ingestDocuments();
      setLastIngestResult({
        chunks: result.ingested_chunks,
        docs: result.bm25_stats.doc_count,
      });
      toast({
        title: 'Ingestion Complete',
        description: `Ingested ${result.ingested_chunks} chunks`,
        variant: 'success',
      });
      fetchStatus();
    } catch (error) {
      toast({
        title: 'Ingestion Failed',
        description: error instanceof Error ? error.message : 'Failed to ingest documents',
        variant: 'destructive',
      });
    } finally {
      setIsIngesting(false);
    }
  };

  const handleReingest = async () => {
    setIsReingesting(true);
    try {
      const result = await adminAPI.reingestDocuments();
      setLastIngestResult({
        chunks: result.ingested_chunks,
        docs: result.bm25_stats.doc_count,
      });
      toast({
        title: 'Full Rebuild Complete',
        description: `Knowledge base rebuilt with ${result.ingested_chunks} chunks`,
        variant: 'success',
      });
      fetchStatus();
    } catch (error) {
      toast({
        title: 'Rebuild Failed',
        description: error instanceof Error ? error.message : 'Failed to rebuild knowledge base',
        variant: 'destructive',
      });
    } finally {
      setIsReingesting(false);
    }
  };

  const handleClear = async () => {
    setIsClearing(true);
    try {
      await adminAPI.clearChromaDB();
      setLastIngestResult(null);
      toast({
        title: 'Database Cleared',
        description: 'ChromaDB collection has been cleared',
        variant: 'success',
      });
      fetchStatus();
    } catch (error) {
      toast({
        title: 'Clear Failed',
        description: error instanceof Error ? error.message : 'Failed to clear database',
        variant: 'destructive',
      });
    } finally {
      setIsClearing(false);
    }
  };

  const isOperationInProgress = isIngesting || isReingesting || isClearing;

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Knowledge Base</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your ChromaDB vector database
            </p>
          </div>
          <Button variant="outline" onClick={fetchStatus} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              ChromaDB Status
            </CardTitle>
            <CardDescription>Current state of the vector database</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : status ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <div className="mt-2">
                      <Badge variant={status.status === 'populated' ? 'success' : 'warning'}>
                        {status.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Documents</p>
                    <p className="text-2xl font-bold mt-1">{status.document_count ?? 0}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Chunks</p>
                    <p className="text-2xl font-bold mt-1">{status.chunk_count ?? 0}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Storage Size</p>
                    <p className="text-2xl font-bold mt-1">{status.total_size}</p>
                  </div>
                </div>
                {status.unique_sources && status.unique_sources.length > 0 && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Indexed Documents</p>
                    <div className="flex flex-wrap gap-2">
                      {status.unique_sources.map((source) => (
                        <Badge key={source} variant="outline" className="text-xs">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Unable to fetch status
              </div>
            )}
          </CardContent>
        </Card>

        {/* Last Ingest Result */}
        {lastIngestResult && (
          <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">Last Operation Successful</p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Ingested {lastIngestResult.chunks} chunks • {lastIngestResult.docs} documents in BM25 index
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Ingest New */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Ingest Documents
              </CardTitle>
              <CardDescription>
                Add new documents to the existing knowledge base
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button
                className="w-full"
                onClick={handleIngest}
                disabled={isOperationInProgress}
              >
                {isIngesting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Ingesting...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Ingest New Documents
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Full Rebuild */}
          <Card className="flex flex-col border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-orange-600" />
                Full Rebuild
              </CardTitle>
              <CardDescription>
                Clear and rebuild the entire knowledge base
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-900/20"
                    disabled={isOperationInProgress}
                  >
                    {isReingesting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Rebuilding...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Full Rebuild
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      Confirm Full Rebuild
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will clear the entire ChromaDB collection and rebuild it from all documents.
                      This operation may take a few minutes depending on the number of documents.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleReingest}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Rebuild Knowledge Base
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

          {/* Clear Database */}
          <Card className="flex flex-col border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-600" />
                Clear Database
              </CardTitle>
              <CardDescription>
                Remove all data from ChromaDB (dangerous)
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full"
                    disabled={isOperationInProgress}
                  >
                    {isClearing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Clearing...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear Database
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="w-5 h-5" />
                      Clear ChromaDB
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all vector embeddings from ChromaDB.
                      The chat feature will not work until you reingest documents.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClear}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Yes, Clear Database
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
