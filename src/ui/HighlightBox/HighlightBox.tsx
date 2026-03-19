'use client';

import { cn } from '@/lib/utils/utils';

interface HighlightBoxProps {
  icon?: string;
  children: React.ReactNode;
  className?: string;
}

export function HighlightBox({ icon, children, className }: HighlightBoxProps) {
  return (
    <div 
      className={cn('flex gap-3 items-start', className)}
      style={{
        marginTop: '32px',
        padding: '20px 24px',
        background: '#ffffff',
        borderRadius: '10px',
        borderLeft: '3px solid #0ea5e9',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)'
      }}
    >
      {icon && (
        <span style={{ fontSize: '1.4rem' }}>
          {icon}
        </span>
      )}
      <div>
        <div 
          style={{
            fontSize: '0.9rem',
            margin: 0,
            color: '#0f172a',
            fontWeight: 500,
            lineHeight: 1.5
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}