'use client';

import { cn } from '@/lib/utils/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'sm', 
  className 
}: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center font-medium rounded-full',
      {
        // Variants
        'bg-slate-100 text-slate-600': variant === 'default',
        'bg-sky-100 text-sky-700': variant === 'secondary',
        'border border-slate-200 text-slate-600': variant === 'outline',
        
        // Sizes
        'px-2.5 py-0.5 text-xs tracking-wide': size === 'sm',
        'px-3 py-1 text-sm': size === 'md',
      },
      className
    )}>
      {children}
    </span>
  );
}