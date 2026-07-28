'use client';

import { cn } from '@/lib/utils/utils';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  className,
  containerClassName,
  ...props
}: InputProps) {
  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label
          htmlFor={props.id || props.name}
          className="block text-[14px] font-semibold text-foreground mb-2"
        >
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full px-4 py-3 bg-white border-2 text-foreground text-[15px] font-medium transition-all duration-200 outline-none placeholder:text-muted-foreground/60 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm focus:shadow-md",
          error 
            ? "border-destructive focus:border-destructive" 
            : "border-border focus:border-primary",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-2 text-[13px] text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
