'use client';

import { cn } from '@/lib/utils/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'white' | 'gray' | 'dark';
  padding?: 'normal' | 'large';
}

export function Section({ 
  children, 
  className, 
  background = 'white',
  padding = 'normal'
}: SectionProps) {
  return (
    <section className={cn(
      {
        'bg-white': background === 'white',
        'bg-slate-50': background === 'gray',
        'bg-navy': background === 'dark',
        'py-25 px-[5vw]': padding === 'normal',
        'py-30 px-[5vw]': padding === 'large',
      },
      className
    )}>
      {children}
    </section>
  );
}

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
  color?: 'blue' | 'teal';
}

export function SectionLabel({ children, className, color = 'blue' }: SectionLabelProps) {
  return (
    <div className={cn(
      'inline-flex items-center gap-1.5 text-xs font-semibold tracking-[2px] uppercase mb-3.5',
      {
        'text-sky-500': color === 'blue',
        'text-cyan-500': color === 'teal',
      },
      className
    )}>
      <div className={cn(
        'w-4.5 h-0.5 rounded-sm',
        {
          'bg-sky-500': color === 'blue',
          'bg-cyan-500': color === 'teal',
        }
      )} />
      {children}
    </div>
  );
}

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}

export function SectionTitle({ children, className, light = false }: SectionTitleProps) {
  return (
    <h2 className={cn(
      'font-syne text-5xl font-bold leading-tight tracking-tight mb-4',
      light ? 'text-white' : 'text-slate-900',
      className
    )}>
      {children}
    </h2>
  );
}

interface SectionSubtitleProps {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}

export function SectionSubtitle({ children, className, light = false }: SectionSubtitleProps) {
  return (
    <p className={cn(
      'text-lg leading-relaxed max-w-2xl',
      light ? 'text-white/60' : 'text-slate-600',
      className
    )}>
      {children}
    </p>
  );
}