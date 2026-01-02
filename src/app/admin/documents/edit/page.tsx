'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2, FileText, Clock, HardDrive } from 'lucide-react';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { adminAPI, type DocumentContent } from '@/lib/api/admin';

function DocumentEditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filename = searchParams.get('file') || '';
  const [document, setDocument] = useState<DocumentContent | null>(null);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  const fetchDocument = useCallback(async () => {
    if (!filename) {
      router.push('/admin/documents');
      return;
    }
    try {
      setIsLoading(true);
      const doc = await adminAPI.getDocument(filename);
      setDocument(doc);
      setContent(doc.content);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load document',
        variant: 'destructive',
      });
      router.push('/admin/documents');
    } finally {
      setIsLoading(false);
    }
  }, [filename, router, toast]);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  useEffect(() => {
    setHasChanges(document?.content !== content);
  }, [content, document]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await adminAPI.saveDocument(filename, content);
      toast({
        title: 'Saved',
        description: 'Document saved successfully',
        variant: 'success',
      });
      setDocument((prev) => prev ? { ...prev, content } : null);
      setHasChanges(false);
    } catch (error) {
      toast({
        title: 'Save failed',
        description: error instanceof Error ? error.message : 'Failed to save document',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await adminAPI.deleteDocument(filename);
      toast({
        title: 'Deleted',
        description: 'Document deleted successfully',
        variant: 'success',
      });
      router.push('/admin/documents');
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: error instanceof Error ? error.message : 'Failed to delete document',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (!filename) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/documents">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              {filename}
            </h1>
            {document && (
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span className="flex items-center gap-1">
                  <HardDrive className="w-4 h-4" />
                  {formatSize(document.size_bytes)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDate(document.modified)}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Badge variant="warning">Unsaved changes</Badge>
          )}
          <Button onClick={handleSave} disabled={isSaving || !hasChanges}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Document</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{filename}&quot;? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Tabs defaultValue="edit" className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Editor</CardTitle>
                <TabsList>
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="edit" className="mt-0">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[500px] font-mono text-sm"
                  placeholder="Enter markdown content..."
                />
              </TabsContent>
              <TabsContent value="preview" className="mt-0">
                <div className="min-h-[500px] p-4 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-auto">
                  <pre className="whitespace-pre-wrap font-mono text-sm">{content}</pre>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      )}
    </div>
  );
}

export default function DocumentEditorPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="space-y-6">
          <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
          <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
        </div>
      }>
        <DocumentEditorContent />
      </Suspense>
    </ProtectedRoute>
  );
}
