'use client';

import Link from 'next/link';
import { Icons } from '@/ui/Icons/Icons';
import type { ProgramCardProps } from '@/types/program/types';

export function ProgramCard({ program }: ProgramCardProps) {
  return (
    <div 
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '36px 32px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.28s, box-shadow 0.28s, border-color 0.28s',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 20px 48px rgba(14,165,233,0.12)';
        e.currentTarget.style.borderColor = 'rgba(14,165,233,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#e2e8f0';
      }}
    >
      {/* Bottom accent line */}
      <div style={{
        content: '',
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        height: '3px',
        background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
        transform: 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform 0.3s ease'
      }} />
      
      {/* Icon */}
      <div style={{
        width: '52px',
        height: '52px',
        borderRadius: '12px',
        background: 'rgba(6,182,212,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '22px',
        marginBottom: '20px',
        border: '1px solid rgba(6,182,212,0.2)'
      }}>
        {program.icon}
      </div>
      
      {/* Title */}
      <h3 style={{
        fontFamily: 'Syne, sans-serif',
        fontSize: '1.2rem',
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: '10px',
        letterSpacing: '-0.2px'
      }}>
        {program.title}
      </h3>
      
      {/* Description */}
      <p style={{
        fontSize: '0.9rem',
        lineHeight: '1.65',
        color: '#64748b',
        marginBottom: '24px'
      }}>
        {program.body}
      </p>
      
      {/* Tags */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        marginBottom: '24px'
      }}>
        {program.tags.map((tag) => (
          <span 
            key={tag}
            style={{
              fontSize: '0.72rem',
              fontWeight: '500',
              letterSpacing: '0.4px',
              padding: '3px 10px',
              background: '#eef0f5',
              color: '#64748b',
              borderRadius: '100px'
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      
      {/* CTA Link */}
      <Link 
        href={program.ctaHref}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.85rem',
          fontWeight: '500',
          color: '#0ea5e9',
          textDecoration: 'none',
          transition: 'gap 0.2s'
        }}
      >
        {program.ctaText}
        <Icons.ArrowRight />
      </Link>
    </div>
  );
}