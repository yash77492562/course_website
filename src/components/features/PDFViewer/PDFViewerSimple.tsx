'use client';

interface PDFViewerSimpleProps {
  pdfUrl: string;
  password?: string;
  title: string;
}

export function PDFViewerSimple({ pdfUrl, password, title }: PDFViewerSimpleProps) {
  return (
    <div className="w-full h-full" style={{ minHeight: '80vh' }}>
      <iframe
        src={pdfUrl}
        title={title}
        className="w-full h-full border-0"
        style={{ minHeight: '80vh' }}
      />
    </div>
  );
}
