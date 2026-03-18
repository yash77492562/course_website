'use client';

import { ArrowRightIcon } from '@/ui/Icons/Icons';
import { Reveal } from '@/ui/Animation/Animation';

export function HeroSection() {
  return (
    <section className="min-h-screen relative flex items-center overflow-hidden" 
             style={{ 
               background: 'linear-gradient(160deg, #050d1f 0%, #0d1f40 60%, #0a2240 100%)',
               padding: '100px 5vw 80px'
             }}>
      {/* Animated SVG Background */}
      <svg 
        className="absolute inset-0 pointer-events-none z-0" 
        viewBox="0 0 1440 900" 
        fill="none" 
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {/* Network lines with animations */}
        <g stroke="rgba(14,165,233,0.12)" strokeWidth="1">
          <line x1="200" y1="100" x2="480" y2="300">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite"/>
          </line>
          <line x1="480" y1="300" x2="800" y2="180">
            <animate attributeName="opacity" values="0.5;0.9;0.5" dur="5s" repeatCount="indefinite"/>
          </line>
          <line x1="800" y1="180" x2="1100" y2="400">
            <animate attributeName="opacity" values="0.2;0.7;0.2" dur="3.5s" repeatCount="indefinite"/>
          </line>
          <line x1="1100" y1="400" x2="1350" y2="220">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="4.5s" repeatCount="indefinite"/>
          </line>
          <line x1="480" y1="300" x2="640" y2="560">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="5.5s" repeatCount="indefinite"/>
          </line>
          <line x1="640" y1="560" x2="900" y2="480">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="4s" repeatCount="indefinite"/>
          </line>
          <line x1="900" y1="480" x2="1100" y2="400">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite"/>
          </line>
          <line x1="200" y1="100" x2="320" y2="420" />
          <line x1="320" y1="420" x2="640" y2="560" />
          <line x1="900" y1="480" x2="1200" y2="700" />
          <line x1="1200" y1="700" x2="1350" y2="220" />
        </g>
        
        {/* Animated nodes */}
        <g fill="rgba(14,165,233,0.4)">
          <circle cx="200" cy="100" r="3">
            <animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite"/>
          </circle>
          <circle cx="480" cy="300" r="4">
            <animate attributeName="r" values="4;6;4" dur="4s" repeatCount="indefinite"/>
          </circle>
          <circle cx="800" cy="180" r="3">
            <animate attributeName="r" values="3;5;3" dur="3.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="1100" cy="400" r="5">
            <animate attributeName="r" values="5;7;5" dur="2.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="640" cy="560" r="3">
            <animate attributeName="r" values="3;5;3" dur="4.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="900" cy="480" r="4">
            <animate attributeName="r" values="4;6;4" dur="3s" repeatCount="indefinite"/>
          </circle>
          <circle cx="320" cy="420" r="3"/>
          <circle cx="1350" cy="220" r="3"/>
          <circle cx="1200" cy="700" r="3"/>
        </g>
        
        {/* Ambient glow */}
        <defs>
          <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.25"/>
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="1100" cy="200" r="300" fill="url(#glow1)" opacity="0.4"/>
        <circle cx="400" cy="700" r="250" fill="url(#glow2)" opacity="0.25"/>
      </svg>

      {/* Hero Content */}
      <div className="relative z-10" style={{ maxWidth: '720px' }}>
        <Reveal>
          <div className="inline-flex items-center rounded-full"
               style={{
                 gap: '8px',
                 background: 'rgba(14,165,233,0.12)',
                 border: '1px solid rgba(14,165,233,0.3)',
                 borderRadius: '100px',
                 padding: '5px 14px 5px 8px',
                 marginBottom: '28px'
               }}>
            <div className="rounded-full animate-pulse" 
                 style={{ 
                   width: '8px', 
                   height: '8px',
                   background: '#0ea5e9' 
                 }} />
            <span className="font-medium uppercase"
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    letterSpacing: '1.2px',
                    color: '#0ea5e9'
                  }}>
              UK-Based Data Education & Consulting
            </span>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <h1 style={{
                fontFamily: 'var(--font-syne), Syne, sans-serif',
                fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)',
                fontWeight: 800,
                lineHeight: '1.1',
                color: '#ffffff',
                letterSpacing: '-0.5px',
                marginBottom: '24px'
              }}>
            Build Your Future<br />
            in <em style={{
              fontStyle: 'normal',
              background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Data</em> with<br />
            Riva Data
          </h1>
        </Reveal>

        <Reveal delay={2}>
          <p style={{
               fontSize: '1.1rem',
               lineHeight: '1.75',
               color: 'rgba(255,255,255,0.6)',
               maxWidth: '580px',
               marginBottom: '44px',
               fontWeight: 300
             }}>
            Reskilling professionals into industry-ready Data Analysts, Data Engineers, and Data Scientists through practical, real-world training and innovation-driven learning.
          </p>
        </Reveal>

        <Reveal delay={3}>
          <div className="flex gap-4 flex-wrap">
            <a 
              href="#programs" 
              className="inline-flex items-center gap-2 text-white no-underline transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                padding: '14px 30px',
                borderRadius: '8px',
                fontWeight: 500,
                fontSize: '0.95rem',
                boxShadow: '0 4px 24px rgba(14,165,233,0.35)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(14,165,233,0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(14,165,233,0.35)';
              }}
            >
              Explore Programs
              <ArrowRightIcon size={16} />
            </a>
            <a 
              href="#consulting" 
              className="inline-flex items-center gap-2 bg-transparent no-underline transition-all duration-200"
              style={{
                color: 'rgba(255,255,255,0.8)',
                padding: '13px 28px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                fontWeight: 400,
                fontSize: '0.95rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(14,165,233,0.5)';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.background = 'rgba(14,165,233,0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Partner With Us
            </a>
          </div>
        </Reveal>
      </div>

      {/* Hero Stats */}
      <div className="absolute bottom-12 right-[5vw] z-10 hidden lg:flex gap-12">
        <Reveal delay={4}>
          <div className="text-center">
            <div className="font-syne text-[32px] font-extrabold text-white leading-none mb-1">
              <span className="bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] bg-clip-text text-transparent">3</span>
            </div>
            <div className="text-[12.48px] tracking-[0.8px] uppercase text-[rgba(255,255,255,0.4)] leading-tight">
              Specialist<br />Programs
            </div>
          </div>
        </Reveal>

        <Reveal delay={5}>
          <div className="text-center">
            <div className="font-syne text-[32px] font-extrabold text-white leading-none mb-1">
              <span className="bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] bg-clip-text text-transparent">100%</span>
            </div>
            <div className="text-[12.48px] tracking-[0.8px] uppercase text-[rgba(255,255,255,0.4)] leading-tight">
              Industry<br />Aligned
            </div>
          </div>
        </Reveal>

        <Reveal delay={6}>
          <div className="text-center">
            <div className="font-syne text-[32px] font-extrabold text-white leading-none mb-1">
              <span className="bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] bg-clip-text text-transparent">UK</span>
            </div>
            <div className="text-[12.48px] tracking-[0.8px] uppercase text-[rgba(255,255,255,0.4)] leading-tight">
              Based &<br />Accredited
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}