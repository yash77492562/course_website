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
      color: '#0ea5e9',
      marginBottom: '14px'
    }}>
      <div style={{
        display: 'block',
        width: '18px',
        height: '1.5px',
        background: '#0ea5e9',
        borderRadius: '2px'
      }} />
      {children}
    </span>
  );
}