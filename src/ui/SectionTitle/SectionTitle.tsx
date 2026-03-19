'use client';

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionTitle({ children, className }: SectionTitleProps) {
  return (
    <h2 style={{
      fontFamily: 'Syne, sans-serif',
      fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)',
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.3px',
      color: '#0f172a',
      marginBottom: '16px'
    }}>
      {children}
    </h2>
  );
}