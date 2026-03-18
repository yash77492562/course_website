'use client';

import { cn } from '@/lib/utils/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-slate-200 rounded-2xl p-8 relative overflow-hidden',
        hover && 'transition-all duration-300 cursor-pointer hover:-translate-y-1.5 hover:shadow-xl hover:shadow-sky-500/12 hover:border-sky-500/40',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {hover && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-500 to-cyan-500 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
      )}
      {children}
    </div>
  );
}

interface CardIconProps {
  children: React.ReactNode;
  className?: string;
}

export function CardIcon({ children, className }: CardIconProps) {
  return (
    <div className={cn(
      'w-13 h-13 rounded-xl bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center text-xl mb-5',
      className
    )}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn(
      'font-syne text-xl font-bold text-slate-900 mb-2.5 tracking-tight',
      className
    )}>
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn(
      'text-sm leading-relaxed text-slate-600 mb-6',
      className
    )}>
      {children}
    </p>
  );
}