'use client';

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  style?: React.CSSProperties;
}

export function SectionTitle({ children, className, color = '#0f172a', style }: SectionTitleProps) {
  return (
    <h2 style={{
      fontFamily: 'Syne, sans-serif',
      fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)',
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.3px',
      color,
      marginBottom: '16px',
      ...style
    }}>
      {children}
    </h2>
  );
}