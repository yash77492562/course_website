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
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return cn(
          'bg-primary text-foreground font-semibold',
          'hover:bg-primary/90 active:scale-[0.98]'
        );
      case 'ghost':
        return cn(
          'bg-transparent text-foreground border border-border font-medium',
          'hover:border-primary/50 hover:text-primary hover:bg-primary/5 active:scale-[0.98]'
        );
      case 'secondary':
        return cn(
          'bg-accent text-foreground font-semibold',
          'hover:bg-accent/90 active:scale-[0.98]'
        );
      default:
        return '';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'lg':
        return 'px-[30px] py-[14px] text-[0.95rem] rounded-lg';
      case 'sm':
        return 'px-5 py-2 text-[0.85rem] rounded-lg';
      default:
        return 'px-6 py-3 text-[0.9rem] rounded-lg';
    }
  };

  const baseClasses = cn(
    'inline-flex items-center justify-center gap-2 transition-all duration-200 no-underline',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    getVariantStyles(),
    getSizeStyles(),
    {
      'opacity-50 cursor-not-allowed pointer-events-none': disabled,
    },
    className
  );

  if (href) {
    return (
      <Link 
        href={href} 
        className={baseClasses}
      >
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