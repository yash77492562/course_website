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
          container: 'bg-white/80 border-emerald-200 shadow-[0_8px_30px_rgba(16,185,129,0.12)]',
          iconBg: 'bg-emerald-100/80 text-emerald-600',
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ),
          title: 'text-emerald-800',
          text: 'text-emerald-600/90'
        };
      case 'error':
        return {
          container: 'bg-white/80 border-red-200 shadow-[0_8px_30px_rgba(239,68,68,0.12)]',
          iconBg: 'bg-red-100/80 text-red-600',
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ),
          title: 'text-red-800',
          text: 'text-red-600/90'
        };
      case 'warning':
        return {
          container: 'bg-white/80 border-amber-200 shadow-[0_8px_30px_rgba(245,158,11,0.12)]',
          iconBg: 'bg-amber-100/80 text-amber-600',
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          title: 'text-amber-800',
          text: 'text-amber-600/90'
        };
      case 'info':
      default:
        return {
          container: 'bg-white/80 border-blue-200 shadow-[0_8px_30px_rgba(59,130,246,0.12)]',
          iconBg: 'bg-blue-100/80 text-blue-600',
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          title: 'text-blue-800',
          text: 'text-blue-600/90'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className={cn(
        'w-full max-w-sm sm:min-w-[400px] rounded-2xl border backdrop-blur-xl p-4 transition-all duration-300',
        styles.container,
        className
      )}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={cn("flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-sm", styles.iconBg)}>
          {styles.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-1">
          {title && (
            <h4 className={cn("font-bold text-[17px] mb-1 leading-tight mt-0 font-display", styles.title)}>
              {title}
            </h4>
          )}
          <p className={cn("text-[14.5px] leading-relaxed m-0 font-medium", styles.text)}>
            {message}
          </p>
        </div>

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200 border-none bg-transparent cursor-pointer"
            aria-label="Close alert"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 2L14 14M2 14L14 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Progress Bar - DISABLED: Alert only closes on X click */}
       {autoClose && (
        <div className="h-1 bg-slate-100 rounded-b-2xl overflow-hidden w-full mt-4 -mb-4 -mx-4" style={{ width: 'calc(100% + 32px)' }}>
          <div
            className={cn("h-full opacity-60", styles.iconBg.split(' ')[0])}
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
