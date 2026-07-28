'use client';

interface HeroTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function HeroTitle({ children, className = '' }: HeroTitleProps) {
  return (
    <h1 
      className={`font-sans text-[clamp(2.6rem,5.5vw,4.2rem)] font-extrabold leading-[1.1] text-foreground tracking-tight mb-6 ${className}`}
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
      className={`text-lg md:text-xl leading-relaxed text-muted-foreground/80 max-w-[580px] mb-11 font-normal ${className}`}
    >
      {children}
    </p>
  );
}

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

// Renamed internally but keeping the export name to avoid breaking imports. 
// Uses solid block colors (Primary Teal) to match the new design system.
export function GradientText({ children, className = '' }: GradientTextProps) {
  return (
    <em 
      className={`not-italic text-primary font-bold ${className}`}
    >
      {children}
    </em>
  );
}