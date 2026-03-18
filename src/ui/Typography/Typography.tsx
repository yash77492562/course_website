'use client';

interface HeroTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function HeroTitle({ children, className }: HeroTitleProps) {
  return (
    <h1 
      className={className}
      style={{
        fontFamily: 'var(--font-syne), Syne, sans-serif',
        fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)',
        fontWeight: 800,
        lineHeight: '1.1',
        color: '#ffffff',
        letterSpacing: '-0.5px',
        marginBottom: '24px'
      }}
    >
      {children}
    </h1>
  );
}

interface HeroSubtitleProps {
  children: React.ReactNode;
  className?: string;
}

export function HeroSubtitle({ children, className }: HeroSubtitleProps) {
  return (
    <p 
      className={className}
      style={{
        fontSize: '1.1rem',
        lineHeight: '1.75',
        color: 'rgba(255,255,255,0.6)',
        maxWidth: '580px',
        marginBottom: '44px',
        fontWeight: 300
      }}
    >
      {children}
    </p>
  );
}

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export function GradientText({ children, className }: GradientTextProps) {
  return (
    <em 
      className={className}
      style={{
        fontStyle: 'normal',
        background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}
    >
      {children}
    </em>
  );
}