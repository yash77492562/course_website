'use client';

interface StatusBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ children, className }: StatusBadgeProps) {
  return (
    <div 
      className={`inline-flex items-center rounded-full ${className || ''}`}
      style={{
        gap: '8px',
        background: 'rgba(14,165,233,0.12)',
        border: '1px solid rgba(14,165,233,0.3)',
        borderRadius: '100px',
        padding: '5px 14px 5px 8px',
        marginBottom: '28px'
      }}
    >
      <div 
        className="rounded-full animate-pulse" 
        style={{ 
          width: '8px', 
          height: '8px',
          background: '#0ea5e9' 
        }} 
      />
      <span 
        className="font-medium uppercase"
        style={{
          fontSize: '0.78rem',
          fontWeight: 500,
          letterSpacing: '1.2px',
          color: '#0ea5e9'
        }}
      >
        {children}
      </span>
    </div>
  );
}