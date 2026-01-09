'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Download, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure worker
// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface ResumePreviewProps {
  url: string;
  className?: string;
  width?: number;
}

export function ResumePreview({ url, className, width = 600 }: ResumePreviewProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(width);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(err: Error) {
    console.error('Error loading PDF:', err);
    setError(err);
    setLoading(false);
  }

  // Simple responsive handler
  useEffect(() => {
    const updateWidth = () => {
      const container = document.getElementById('resume-preview-container');
      if (container) {
        setContainerWidth(Math.min(container.clientWidth, width));
      }
    };

    window.addEventListener('resize', updateWidth);
    // Initial calculation
    updateWidth();

    // Small delay to ensure container is rendered
    const timer = setTimeout(updateWidth, 100);

    return () => {
      window.removeEventListener('resize', updateWidth);
      clearTimeout(timer);
    };
  }, [width]);

  return (
    <div
      id="resume-preview-container"
      className={cn("relative min-h-[800px] bg-white dark:bg-zinc-900 rounded-xl overflow-hidden flex items-center justify-center", className)}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-zinc-100/50 dark:bg-zinc-800/50 backdrop-blur-sm">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      )}

      {error ? (
        <div className="flex flex-col items-center gap-4 text-red-500 p-8 text-center">
          <p>Failed to load resume preview.</p>
          {/* Note: Parent component provides the download link, so we don't need a nested <a> here which causes hydration errors */}
          <div className="flex items-center gap-2 text-primary opacity-75">
            <Download className="w-4 h-4" />
            <span>Click card to download PDF</span>
          </div>
        </div>
      ) : (
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
          className="max-w-full"
        >
          <Page
            pageNumber={1}
            width={containerWidth}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="shadow-md"
            loading={null}
          />
        </Document>
      )}
    </div>
  );
}
