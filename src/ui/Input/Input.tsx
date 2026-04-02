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
          style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '12px'
          }}
        >
          {label}
        </label>
      )}
      <input
        style={{
          width: '100%',
          padding: '12px 0',
          background: 'transparent',
          border: 'none',
          borderBottom: error ? '2px solid #ef4444' : '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '0',
          color: 'rgba(255, 255, 255, 0.95)',
          fontSize: '15px',
          transition: 'all 0.3s',
          outline: 'none'
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderBottomColor = error ? '#ef4444' : '#0ea5e9';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderBottomColor = error ? '#ef4444' : 'rgba(255, 255, 255, 0.2)';
        }}
        className={className}
        {...props}
      />
      {error && (
        <p style={{ 
          marginTop: '8px', 
          fontSize: '13px', 
          color: '#ef4444' 
        }}>
          {error}
        </p>
      )}
      
      <style jsx>{`
        input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
