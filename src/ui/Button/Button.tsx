'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils/utils';
import type { ButtonProps } from '@/types/common/types';

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  disabled, 
  className, 
  children, 
  onClick,
  href 
}: ButtonProps) {
  const baseClasses = cn(
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    {
      // Variants
      'bg-gradient-to-r from-sky-500 to-cyan-500 text-white hover:from-sky-600 hover:to-cyan-600 focus:ring-sky-500 shadow-lg hover:shadow-xl hover:-translate-y-0.5': 
        variant === 'primary',
      'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400': 
        variant === 'secondary',
      'bg-transparent text-white/80 border border-white/20 hover:border-sky-500/50 hover:text-white hover:bg-sky-500/6': 
        variant === 'ghost',
      'bg-transparent text-slate-900 border-2 border-gray-300 hover:border-sky-500 hover:text-sky-500': 
        variant === 'outline-dark',
      
      // Sizes
      'px-3 py-1.5 text-sm': size === 'sm',
      'px-6 py-3 text-sm': size === 'md',
      'px-8 py-4 text-base': size === 'lg',
      
      // Disabled state
      'opacity-50 cursor-not-allowed pointer-events-none': disabled,
    },
    className
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {children}
    </button>
  );
}