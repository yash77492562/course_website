'use client';

import { cn } from '@/lib/utils/utils';

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  style?: React.CSSProperties;
}

export function SectionTitle({ children, className, color = 'currentColor', style }: SectionTitleProps) {
  return (
    <h2 
      className={cn(
        "font-sans text-[clamp(1.9rem,3.5vw,2.8rem)] font-extrabold leading-[1.2] tracking-tight mb-4",
        className
      )}
      style={{
        color,
        ...style
      }}
    >
      {children}
    </h2>
  );
}