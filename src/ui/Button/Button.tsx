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
    'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 no-underline',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    {
      // Disabled state
      'opacity-50 cursor-not-allowed pointer-events-none': disabled,
    },
    className
  );

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
          color: '#ffffff',
          padding: size === 'lg' ? '14px 30px' : size === 'sm' ? '8px 20px' : '12px 24px',
          borderRadius: '8px',
          fontWeight: 500,
          fontSize: size === 'lg' ? '0.95rem' : size === 'sm' ? '0.85rem' : '0.9rem',
          boxShadow: '0 4px 24px rgba(14,165,233,0.35)',
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: 'rgba(255,255,255,0.8)',
          padding: size === 'lg' ? '13px 28px' : size === 'sm' ? '7px 18px' : '11px 22px',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.2)',
          fontWeight: 400,
          fontSize: size === 'lg' ? '0.95rem' : size === 'sm' ? '0.85rem' : '0.9rem',
        };
      case 'secondary':
        return {
          background: '#f1f5f9',
          color: '#334155',
          padding: size === 'lg' ? '14px 30px' : size === 'sm' ? '8px 20px' : '12px 24px',
          borderRadius: '8px',
          fontWeight: 500,
          fontSize: size === 'lg' ? '0.95rem' : size === 'sm' ? '0.85rem' : '0.9rem',
        };
      default:
        return {};
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (variant === 'primary') {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 8px 32px rgba(14,165,233,0.45)';
    } else if (variant === 'ghost') {
      e.currentTarget.style.borderColor = 'rgba(14,165,233,0.5)';
      e.currentTarget.style.color = '#ffffff';
      e.currentTarget.style.background = 'rgba(14,165,233,0.06)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (variant === 'primary') {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 24px rgba(14,165,233,0.35)';
    } else if (variant === 'ghost') {
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
      e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
      e.currentTarget.style.background = 'transparent';
    }
  };

  if (href) {
    return (
      <Link 
        href={href} 
        className={baseClasses}
        style={getVariantStyles()}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
      style={getVariantStyles()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
}