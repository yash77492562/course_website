'use client';

import { ConsultingService } from '@/types/consulting/types';

interface ConsultingCardProps {
  service: ConsultingService;
}

export function ConsultingCard({ service }: ConsultingCardProps) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(14,165,233,0.12)',
        borderRadius: '14px',
        padding: '30px 28px',
        transition: 'background 0.25s, border-color 0.25s',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(14,165,233,0.07)';
        e.currentTarget.style.borderColor = 'rgba(14,165,233,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
        e.currentTarget.style.borderColor = 'rgba(14,165,233,0.12)';
      }}
    >
      <span
        style={{
          fontSize: '24px',
          marginBottom: '14px',
          display: 'block'
        }}
      >
        {service.icon}
      </span>
      <h3
        style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '1.05rem',
          fontWeight: 700,
          color: '#ffffff',
          marginBottom: '8px'
        }}
      >
        {service.title}
      </h3>
      <p
        style={{
          fontSize: '0.88rem',
          lineHeight: '1.6',
          color: 'rgba(255,255,255,0.5)',
          margin: 0
        }}
      >
        {service.body}
      </p>
    </div>
  );
}