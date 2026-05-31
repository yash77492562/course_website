'use client';

import { WhyMetric } from '@/types/why/types';

interface MetricBarProps {
  metric: WhyMetric;
}

export function MetricBar({ metric }: MetricBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px'
      }}
    >
      <span
        style={{
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.55)',
          minWidth: '120px'
        }}
      >
        {metric.name}
      </span>
      <div
        style={{
          flex: 1,
          height: '6px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '100px',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            height: '100%',
            background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
            borderRadius: '100px',
            width: `${metric.value}%`,
            transformOrigin: 'left',
            animation: 'growBar 1.2s ease forwards'
          }}
        />
      </div>
      <span
        style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '0.9rem',
          fontWeight: 700,
          color: '#ffffff',
          minWidth: '38px',
          textAlign: 'right'
        }}
      >
        {metric.display}
      </span>
    </div>
  );
}