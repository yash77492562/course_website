'use client';

import { cn } from '@/lib/utils/utils';

interface RivaCardProps {
  className?: string;
}

export function RivaCard({ className }: RivaCardProps) {
  return (
    <div className={cn('relative', className)}>
      <div 
        className="relative overflow-hidden"
        style={{
          background: '#050d1f',
          borderRadius: '16px',
          padding: '40px 36px',
          border: '1px solid rgba(14,165,233,0.15)'
        }}
      >
        {/* Top gradient border */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)'
          }}
        />
        
        {/* RIVA Acronym */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          {/* R */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <span 
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '1.6rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                minWidth: '30px'
              }}
            >
              R
            </span>
            <span 
              style={{
                fontSize: '0.95rem',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.7)'
              }}
            >
              Reskilling
            </span>
          </div>
          
          {/* I */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <span 
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '1.6rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                minWidth: '30px'
              }}
            >
              I
            </span>
            <span 
              style={{
                fontSize: '0.95rem',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.7)'
              }}
            >
              Innovation
            </span>
          </div>
          
          {/* V */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <span 
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '1.6rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                minWidth: '30px'
              }}
            >
              V
            </span>
            <span 
              style={{
                fontSize: '0.95rem',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.7)'
              }}
            >
              Vision
            </span>
          </div>
          
          {/* A */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <span 
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '1.6rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                minWidth: '30px'
              }}
            >
              A
            </span>
            <span 
              style={{
                fontSize: '0.95rem',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.7)'
              }}
            >
              Achievement
            </span>
          </div>
          
          {/* IN DATA separator */}
          <div 
            style={{
              marginTop: '8px',
              paddingTop: '18px',
              borderTop: '1px solid rgba(255,255,255,0.07)'
            }}
          >
            <span 
              style={{
                fontSize: '0.78rem',
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}
            >
              in Data
            </span>
          </div>
        </div>
        
        {/* Bottom decoration */}
        <div 
          style={{
            position: 'absolute',
            bottom: '-20px',
            right: '-20px',
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />
      </div>
    </div>
  );
}