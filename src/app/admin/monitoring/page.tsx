'use client';

import { useEffect, useState, useCallback } from 'react';
import { Activity, RefreshCw, ExternalLink, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/useToast';
import { adminAPI, type HealthResponse } from '@/lib/api/admin';

function StatusIcon({ status }: { status: string }) {
  if (status === 'healthy' || status === 'connected' || status === 'available') {
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  }
  if (status === 'degraded') {
    return <AlertCircle className="w-5 h-5 text-yellow-500" />;
  }
  return <XCircle className="w-5 h-5 text-red-500" />;
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'healthy' || status === 'connected' || status === 'available') {
    return <Badge variant="success">{status}</Badge>;
  }
  if (status === 'degraded') {
    return <Badge variant="warning">{status}</Badge>;
  }
  return <Badge variant="destructive">{status}</Badge>;
}

export default function MonitoringPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchHealth = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await adminAPI.getHealth();
      setHealth(data);
      setLastUpdated(new Date());
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load health status',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchHealth();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  const getOverallStatus = () => {
    if (!health) return 'unknown';
    if (!health.components) return health.status || 'unknown';
    const statuses = Object.values(health.components);
    if (statuses.every((s) => s === 'connected' || s === 'available')) return 'healthy';
    if (statuses.some((s) => s === 'disconnected' || s === 'unavailable')) return 'unhealthy';
    return 'degraded';
  };

  const overallStatus = getOverallStatus();

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Monitoring</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              System health and performance monitoring
            </p>
          </div>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span className="text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <Button variant="outline" onClick={fetchHealth} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Overall Status */}
        <Card
          className={
            overallStatus === 'healthy'
              ? 'border-green-200 dark:border-green-800'
              : overallStatus === 'degraded'
              ? 'border-yellow-200 dark:border-yellow-800'
              : 'border-red-200 dark:border-red-800'
          }
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    overallStatus === 'healthy'
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : overallStatus === 'degraded'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30'
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}
                >
                  <Activity
                    className={`w-8 h-8 ${
                      overallStatus === 'healthy'
                        ? 'text-green-600'
                        : overallStatus === 'degraded'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    System Status:{' '}
                    <span
                      className={
                        overallStatus === 'healthy'
                          ? 'text-green-600'
                          : overallStatus === 'degraded'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }
                    >
                      {overallStatus.charAt(0).toUpperCase() + overallStatus.slice(1)}
                    </span>
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    {health ? `Version ${health.version}` : 'Loading...'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Auto-refresh: 30s</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Component Status */}
        <Card>
          <CardHeader>
            <CardTitle>Component Status</CardTitle>
            <CardDescription>Health status of individual system components</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && !health ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : health ? (
              <div className="space-y-3">
                {health.components && Object.entries(health.components).map(([name, status]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <StatusIcon status={status} />
                      <div>
                        <p className="font-medium capitalize">{name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {name === 'chromadb' && 'Vector database for semantic search'}
                          {name === 'redis' && 'Cache and session storage'}
                          {name === 'llm' && 'Language model API connection'}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={status} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">Unable to fetch health status</div>
            )}
          </CardContent>
        </Card>

        {/* External Links */}
        <Card>
          <CardHeader>
            <CardTitle>External Monitoring</CardTitle>
            <CardDescription>Links to external monitoring dashboards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <a
                href="https://grafana.vaishakmenon.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Grafana Dashboard</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Detailed metrics and visualizations
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400" />
              </a>

              <a
                href="https://api.vaishakmenon.com/metrics"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Prometheus Metrics</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Raw metrics endpoint</p>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400" />
              </a>
            </div>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <Card>
          <CardHeader>
            <CardTitle>API Endpoints</CardTitle>
            <CardDescription>Quick access to API documentation and endpoints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">GET</Badge>
                  <code className="text-sm">/health</code>
                </div>
                <span className="text-sm text-gray-500">Health check endpoint</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">GET</Badge>
                  <code className="text-sm">/metrics</code>
                </div>
                <span className="text-sm text-gray-500">Prometheus metrics</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">GET</Badge>
                  <code className="text-sm">/admin/chromadb/status</code>
                </div>
                <span className="text-sm text-gray-500">ChromaDB status</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
