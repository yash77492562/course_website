'use client';

// import { useEffect } from 'react'; // Not needed since auto-close is disabled
import { cn } from '@/lib/utils/utils';
import type { AlertProps } from './types';
import { useEffect } from 'react';

export function Alert({
  variant = 'info',
  title,
  message,
  onClose,
  autoClose = true,
  duration = 500000,
  className,
}: AlertProps) {
  // TODO: Re-enable auto-close when needed
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.98), rgba(5, 150, 105, 0.98))',
          borderColor: 'rgba(16, 185, 129, 0.4)',
          icon: '✓',
        };
      case 'error':
        return {
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.98), rgba(220, 38, 38, 0.98))',
          borderColor: 'rgba(239, 68, 68, 0.4)',
          icon: '✕',
        };
      case 'warning':
        return {
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.98), rgba(217, 119, 6, 0.98))',
          borderColor: 'rgba(245, 158, 11, 0.4)',
          icon: '⚠',
        };
      case 'info':
      default:
        return {
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.98), rgba(37, 99, 235, 0.98))',
          borderColor: 'rgba(59, 130, 246, 0.4)',
          icon: 'ℹ',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className={cn(
        'w-full max-w-sm sm:min-w-[400px] ',
        className
      )}
      style={{
        background: styles.background,
        borderRadius: '16px',
        border: `1px solid ${styles.borderColor}`,
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 30px rgba(14, 165, 233, 0.15)',
        backdropFilter: 'blur(12px)',
        padding: '16px',
      }}
    >
      <div className=" flex items-start gap-4">
        {/* Icon */}
        <div
          className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-xl"
          style={{
            background: 'rgba(255, 255, 255, 0.25)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        >
          {styles.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="text-white font-bold text-lg mb-2 leading-tight">
              {title}
            </h4>
          )}
          <p className="text-white/95 text-[15px] leading-relaxed">
            {message}
          </p>
        </div>

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/25 transition-all duration-200"
            aria-label="Close alert"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 2L14 14M2 14L14 2"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Progress Bar - DISABLED: Alert only closes on X click */}
       {autoClose && (
        <div
          className="h-1.5 bg-white/20 rounded-b-[16px] overflow-hidden"
          style={{ width: '100%' }}
        >
          <div
            className="h-full bg-white/50"
            style={{
              animation: `shrink ${duration}ms linear forwards`,
            }}
          />
        </div>
      )} 

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
