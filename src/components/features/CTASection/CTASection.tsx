'use client';

import { SectionLabel } from '@/ui/SectionLabel/SectionLabel';
import { SectionTitle } from '@/ui/SectionTitle/SectionTitle';

export function CTASection() {
  return (
    <section
      id="contact"
      style={{
        background: '#ffffff',
        textAlign: 'center',
        padding: '120px 5vw'
      }}
    >
      <div
        style={{
          maxWidth: '640px',
          margin: '0 auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <SectionLabel>Get Started</SectionLabel>
        </div>
        
        <h2
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            lineHeight: '1.2',
            letterSpacing: '-0.3px',
            color: '#0f172a',
            marginBottom: '18px'
          }}
        >
          Start Your Data<br />Transformation Today.
        </h2>
        
        <p
          style={{
            fontSize: '1.05rem',
            lineHeight: '1.7',
            color: '#64748b',
            maxWidth: '480px',
            margin: '0 auto 44px',
            textAlign: 'center'
          }}
        >
          Whether you're an individual looking to break into data or an organisation ready to unlock the power of your data assets — Riva Data is your partner.
        </p>
        
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          <a
            href="#"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#050d1f',
              color: '#fff',
              padding: '14px 30px',
              borderRadius: '8px',
              fontWeight: 500,
              fontSize: '0.95rem',
              textDecoration: 'none',
              transition: 'background 0.2s, transform 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#112247';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#050d1f';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Apply Now
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          
          <a
            href="#"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'transparent',
              color: '#0f172a',
              padding: '13px 28px',
              borderRadius: '8px',
              border: '1.5px solid #d1d5db',
              fontWeight: 400,
              fontSize: '0.95rem',
              textDecoration: 'none',
              transition: 'border-color 0.2s, color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0ea5e9';
              e.currentTarget.style.color = '#0ea5e9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.color = '#0f172a';
            }}
          >
            Book a Consultation
          </a>
        </div>
      </div>
    </section>
  );
}