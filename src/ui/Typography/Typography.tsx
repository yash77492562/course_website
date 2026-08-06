'use client';

interface HeroTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function HeroTitle({ children, className = '' }: HeroTitleProps) {
  return (
    <h1 
      className={`font-sans text-[clamp(2.1rem,5.5vw,4.2rem)] font-extrabold leading-[1.1] text-foreground tracking-tight mb-6 ${className}`}
    >
      {children}
    </h1>
  );
}

interface HeroSubtitleProps {
  children: React.ReactNode;
  className?: string;
}

export function HeroSubtitle({ children, className = '' }: HeroSubtitleProps) {
  return (
    <p 
      className={`text-base md:text-xl leading-relaxed text-muted-foreground/80 max-w-[580px] mb-11 font-normal ${className}`}
    >
      {children}
    </p>
  );
}

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

// Uses linear gradient for text
export function GradientText({ children, className = '' }: GradientTextProps) {
  return (
    <em 
      className={`not-italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#505FDC] to-[#1371FF] ${className}`}
    >
      {children}
    </em>
  );
}