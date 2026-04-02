'use client';

import { usePayNow } from './CourseAccessControl';

interface PayNowButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function PayNowButton({ className, children = 'Pay Now' }: PayNowButtonProps) {
  const { handlePayNow, hasPurchased } = usePayNow();

  // Don't show button if already purchased
  if (hasPurchased) {
    return null;
  }

  return (
    <button
      onClick={handlePayNow}
      type="button"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
        color: '#fff',
        padding: '14px 30px',
        borderRadius: '8px',
        fontWeight: '500',
        fontSize: '0.95rem',
        textDecoration: 'none',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 4px 24px rgba(14, 165, 233, 0.35)',
        border: 'none',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(14, 165, 233, 0.45)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(14, 165, 233, 0.35)';
      }}
    >
      {children}
    </button>
  );
}
