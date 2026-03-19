'use client';

import { SectionLabel } from '@/ui/SectionLabel/SectionLabel';
import { SectionTitle } from '@/ui/SectionTitle/SectionTitle';
import { RivaCard } from '@/ui/RivaCard/RivaCard';
import { HighlightBox } from '@/ui/HighlightBox/HighlightBox';

export function AboutSection() {
  return (
    <section 
      className="w-full"
      style={{
        background: '#f7f8fa',
        padding: '100px 5vw'
      }}
      id="about"
    >
      {/* Grid container matching original about-inner */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'center'
        }}
      >
        
        {/* Left side - RIVA Card */}
        <RivaCard />

        {/* Right side - Content */}
        <div>
          <SectionLabel>About Riva Data</SectionLabel>
          
          <SectionTitle>
            Reskilling. Innovation. Vision. Achievement. in Data.
          </SectionTitle>
          
          {/* Paragraphs */}
          <p 
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.8,
              color: '#64748b',
              marginBottom: '20px'
            }}
          >
            Riva Data is a UK-based data education institute and consultancy dedicated to bridging the gap between aspiration and expertise. We provide career-focused, practitioner-led training programmes that equip individuals with the technical skills and strategic mindset demanded by today's data-driven economy.
          </p>
          
          <p 
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.8,
              color: '#64748b',
              marginBottom: '20px'
            }}
          >
            Beyond education, we partner with organisations to architect, modernise, and scale their data capabilities — from pipeline engineering to advanced AI analytics.
          </p>

          <HighlightBox icon="🇬🇧">
            Proudly UK-based. Delivering world-class data education and consulting to professionals and organisations across Britain and beyond.
          </HighlightBox>
        </div>
      </div>
    </section>
  );
}