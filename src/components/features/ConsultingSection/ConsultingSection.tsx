'use client';

import { Section } from '@/ui/Section/Section';
import { SectionLabel } from '@/ui/SectionLabel/SectionLabel';
import { SectionTitle } from '@/ui/SectionTitle/SectionTitle';
import { ConsultingCard } from '@/ui/ConsultingCard/ConsultingCard';
import { ConsultingService } from '@/types/consulting/types';

interface ConsultingSectionProps {
  services: ConsultingService[];
}

export function ConsultingSection({ services }: ConsultingSectionProps) {
  return (
    <section
      style={{
        background: '#050d1f',
        position: 'relative',
        overflow: 'hidden',
        padding: '100px 5vw'
      }}
    >
      {/* Background decorations */}
      <div
        style={{
          content: '',
          position: 'absolute',
          top: '-120px',
          right: '-120px',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 60%)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          content: '',
          position: 'absolute',
          bottom: '-80px',
          left: '-80px',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 60%)',
          pointerEvents: 'none'
        }}
      />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '56px' }}>
          <SectionLabel>Consulting Services</SectionLabel>
          <SectionTitle 
            color="#fefcfcff" 
            style={{ maxWidth: '540px' }}
          >
            We Also Build the<br />Infrastructure Organisations Need
          </SectionTitle>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px'
          }}
        >
          {services.map((service, index) => (
            <ConsultingCard key={index} service={service} />
          ))}
        </div>

        <div
          style={{
            marginTop: '44px',
            padding: '28px 32px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(14,165,233,0.12)',
            borderRadius: '14px'
          }}
        >
          <p
            style={{
              fontSize: '1rem',
              lineHeight: '1.75',
              color: 'rgba(255,255,255,0.6)',
              margin: 0
            }}
          >
            Riva Data brings a <strong style={{ color: 'rgba(255,255,255,0.85)' }}>practitioner-first consulting approach</strong> to every engagement. We work as an extension of your team — understanding your data landscape, identifying gaps, and delivering robust, future-proof solutions. Whether you're starting your data journey or scaling an existing capability, we provide the <strong style={{ color: 'rgba(255,255,255,0.85)' }}>strategic and technical expertise</strong> to move with confidence.
          </p>
        </div>
      </div>
    </section>
  );
}