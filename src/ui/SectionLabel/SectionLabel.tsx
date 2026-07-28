'use client';

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '0.72rem',
      fontWeight: '600',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      color: 'var(--color-primary)',
      marginBottom: '14px'
    }}>
      <div style={{
        display: 'block',
        width: '18px',
        height: '1.5px',
        background: 'var(--color-primary)',
        borderRadius: '2px'
      }} />
      {children}
    </span>
  );
}