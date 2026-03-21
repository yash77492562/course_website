'use client';

import { WhyReason } from '@/types/why/types';

interface WhyItemProps {
  reason: WhyReason;
}

export function WhyItem({ reason }: WhyItemProps) {
  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        padding: '22px 24px',
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(14,165,233,0.3)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(14,165,233,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          flexShrink: 0,
          borderRadius: '9px',
          background: 'rgba(14,165,233,0.08)',
          border: '1px solid rgba(14,165,233,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '17px'
        }}
      >
        {reason.icon}
      </div>
      <div>
        <h4
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '0.95rem',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: '4px'
          }}
        >
          {reason.title}
        </h4>
        <p
          style={{
            fontSize: '0.85rem',
            lineHeight: '1.55',
            color: '#64748b',
            margin: 0
          }}
        >
          {reason.description}
        </p>
      </div>
    </li>
  );
}