'use client';

import { useEffect, useState, useCallback } from 'react';
import { HardDrive, RefreshCw, Trash2, Clock, Loader2, AlertTriangle } from 'lucide-react';
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
import { adminAPI, type CacheStats } from '@/lib/api/admin';

export default function CachePage() {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const { toast } = useToast();

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await adminAPI.getCacheStats();
      setStats(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load cache stats',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      await adminAPI.clearCache();
      toast({
        title: 'Cache Cleared',
        description: 'All cache entries have been removed',
        variant: 'success',
      });
      fetchStats();
    } catch (error) {
      toast({
        title: 'Clear Failed',
        description: error instanceof Error ? error.message : 'Failed to clear cache',
        variant: 'destructive',
      });
    } finally {
      setIsClearing(false);
    }
  };

  const handleCleanupExpired = async () => {
    setIsCleaning(true);
    try {
      const result = await adminAPI.cleanupExpiredCache();
      toast({
        title: 'Cleanup Complete',
        description: result.removed_count !== undefined
          ? `Removed ${result.removed_count} expired entries`
          : 'Expired entries cleaned up',
        variant: 'success',
      });
      fetchStats();
    } catch (error) {
      toast({
        title: 'Cleanup Failed',
        description: error instanceof Error ? error.message : 'Failed to cleanup expired entries',
        variant: 'destructive',
      });
    } finally {
      setIsCleaning(false);
    }
  };

  const isOperationInProgress = isClearing || isCleaning;

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Cache Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage the fallback cache for chat responses
            </p>
          </div>
          <Button variant="outline" onClick={fetchStats} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Entries</p>
                  <p className="text-3xl font-bold mt-1">
                    {isLoading ? '-' : stats?.total_entries ?? 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <HardDrive className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Size</p>
                  <p className="text-3xl font-bold mt-1">
                    {isLoading ? '-' : stats?.total_size ?? '0 B'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <HardDrive className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Hit Rate</p>
                  <p className="text-3xl font-bold mt-1">
                    {isLoading
                      ? '-'
                      : stats?.hit_rate !== undefined
                      ? `${(stats.hit_rate * 100).toFixed(1)}%`
                      : 'N/A'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cache Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              Cache Status
            </CardTitle>
            <CardDescription>
              The fallback cache stores chat responses for faster subsequent queries
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
            ) : stats ? (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600 dark:text-gray-400">Cache Status</span>
                  <Badge variant={stats.total_entries > 0 ? 'success' : 'secondary'}>
                    {stats.total_entries > 0 ? 'Active' : 'Empty'}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>
                    The cache helps reduce API calls by storing responses to frequently asked questions.
                    Clearing the cache will force fresh responses but may temporarily increase response times.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Unable to fetch cache status
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Cleanup Expired */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Cleanup Expired
              </CardTitle>
              <CardDescription>
                Remove only expired cache entries, keeping valid ones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={handleCleanupExpired}
                disabled={isOperationInProgress}
              >
                {isCleaning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cleaning...
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 mr-2" />
                    Cleanup Expired Entries
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Clear All */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-600" />
                Clear Cache
              </CardTitle>
              <CardDescription>
                Remove all cache entries (affects performance temporarily)
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                        Clear All Cache
                      </>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      Clear Cache
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove all cached chat responses. The next queries will need to
                      fetch fresh responses from the API, which may temporarily increase response times.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearCache}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Clear Cache
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
