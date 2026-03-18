'use client';

import { Button } from '@/ui/Button/Button';
import { ArrowRightIcon } from '@/ui/Icons/Icons';
import { Reveal } from '@/ui/Animation/Animation';
import { AnimatedBackground } from '@/ui/AnimatedBackground/AnimatedBackground';
import { StatusBadge } from '@/ui/StatusBadge/StatusBadge';
import { HeroTitle, HeroSubtitle, GradientText } from '@/ui/Typography/Typography';

export function HeroSection() {
  return (
    <section className="min-h-screen relative flex items-center overflow-hidden" 
             style={{ 
               background: 'linear-gradient(160deg, #050d1f 0%, #0d1f40 60%, #0a2240 100%)',
               padding: '100px 5vw 80px'
             }}>
      {/* Animated SVG Background */}
      <AnimatedBackground className="absolute inset-0 pointer-events-none z-0" />

      {/* Hero Content */}
      <div className="relative z-10" style={{ maxWidth: '720px' }}>
        <Reveal>
          <StatusBadge>
            UK-Based Data Education & Consulting
          </StatusBadge>
        </Reveal>

        <Reveal delay={1}>
          <HeroTitle>
            Build Your Future<br />
            in <GradientText>Data</GradientText> with<br />
            Riva Data
          </HeroTitle>
        </Reveal>

        <Reveal delay={2}>
          <HeroSubtitle>
            Reskilling professionals into industry-ready Data Analysts, Data Engineers, and Data Scientists through practical, real-world training and innovation-driven learning.
          </HeroSubtitle>
        </Reveal>

        <Reveal delay={3}>
          <div className="flex gap-4 flex-wrap">
            <Button href="#programs" variant="primary" size="lg">
              Explore Programs
              <ArrowRightIcon size={16} />
            </Button>
            <Button href="#consulting" variant="ghost" size="lg">
              Partner With Us
            </Button>
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