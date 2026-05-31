'use client';

import { SectionLabel } from '@/ui/SectionLabel/SectionLabel';
import { SectionTitle } from '@/ui/SectionTitle/SectionTitle';
import { WhyItem } from '@/ui/WhyItem/WhyItem';
import { MetricBar } from '@/ui/MetricBar/MetricBar';
import { WhyData } from '@/types/why/types';

interface WhySectionProps {
  data: WhyData;
}

export function WhySection({ data }: WhySectionProps) {
  return (
    <section
      style={{
        background: '#f7f8fa',
        padding: '100px 5vw'
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'center'
        }}
      >
        <div>
          <SectionLabel>Why Riva Data</SectionLabel>
          <SectionTitle style={{ marginBottom: '40px' }}>
            Training Built on<br />Consulting Experience
          </SectionTitle>
          <ul
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}
          >
            {data.reasons.map((reason, index) => (
              <WhyItem key={index} reason={reason} />
            ))}
          </ul>
        </div>

        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              background: '#050d1f',
              borderRadius: '20px',
              padding: '40px 32px',
              border: '1px solid rgba(14,165,233,0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Background decoration */}
            <div
              style={{
                content: '',
                position: 'absolute',
                top: '-80px',
                right: '-80px',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(14,165,233,0.2) 0%, transparent 60%)',
                pointerEvents: 'none'
              }}
            />
            
            <div
              style={{
                fontSize: '0.72rem',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#0ea5e9',
                fontWeight: 600,
                marginBottom: '24px',
                position: 'relative',
                zIndex: 1
              }}
            >
              Learner Outcomes
            </div>
            
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
                position: 'relative',
                zIndex: 1
              }}
            >
              {data.metrics.map((metric, index) => (
                <MetricBar key={index} metric={metric} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}