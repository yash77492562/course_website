'use client';

import { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  name: string;
  value: string;
  onChange: (e: { target: { name: string; value: string } }) => void;
  options: Option[];
  placeholder?: string;
}

export function CustomSelect({ name, value, onChange, options, placeholder = 'Select an option' }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="field-input"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'left',
          cursor: 'pointer',
          color: value ? '#0f172a' : '#9ca3af',
        }}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          style={{
            transition: 'transform 0.2s',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <path d="M1 1.5L6 6.5L11 1.5" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 2px)',
            left: 0,
            right: 0,
            background: 'white',
            border: '2px solid #e2e8f0',
            borderRadius: '10px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            maxHeight: '280px',
            overflowY: 'auto',
            zIndex: 1000,
          }}
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              style={{
                width: '100%',
                padding: '12px 18px',
                textAlign: 'left',
                border: 'none',
                background: value === option.value ? 'linear-gradient(135deg, #0ea5e9, #06b6d4)' : 'white',
                color: value === option.value ? 'white' : '#0f172a',
                cursor: 'pointer',
                fontSize: '1rem',
                fontFamily: 'DM Sans, sans-serif',
                transition: 'all 0.2s',
                borderBottom: index === options.length - 1 ? 'none' : '1px solid #f1f5f9',
                borderRadius: index === 0 ? '8px 8px 0 0' : index === options.length - 1 ? '0 0 8px 8px' : '0',
              }}
              onMouseEnter={(e) => {
                if (value !== option.value) {
                  e.currentTarget.style.background = '#f7f8fa';
                }
              }}
              onMouseLeave={(e) => {
                if (value !== option.value) {
                  e.currentTarget.style.background = 'white';
                }
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
