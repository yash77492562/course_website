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
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%', maxWidth: '400px', marginBottom: '24px' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`field-input flex items-center justify-between text-left cursor-pointer mb-0 ${value ? 'text-slate-900' : 'text-gray-400'}`}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        >
          <path d="M1 1.5L6 6.5L11 1.5" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            left: dropdownRef.current?.getBoundingClientRect().left || 0,
            top: (dropdownRef.current?.getBoundingClientRect().bottom || 0) + 4,
            width: dropdownRef.current?.getBoundingClientRect().width || 400,
            background: 'white',
            border: '2px solid #e2e8f0',
            borderRadius: '10px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            maxHeight: '280px',
            overflowY: 'auto',
            overflowX: 'hidden',
            zIndex: 9999,
          }}
          className="custom-select-dropdown"
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full py-4 px-[18px] text-left border-none cursor-pointer text-[1rem] font-dm-sans transition-all duration-200 block whitespace-nowrap overflow-hidden text-ellipsis ${
                value === option.value
                  ? 'bg-primary hover:bg-primary/90 shadow-sm text-foreground'
                  : 'bg-white text-slate-900 hover:bg-slate-50'
              } ${index === options.length - 1 ? 'border-b-0' : 'border-b border-slate-100'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
      
      <style jsx>{`
        .custom-select-dropdown {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        
        .custom-select-dropdown::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-select-dropdown::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        
        .custom-select-dropdown::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        
        .custom-select-dropdown::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
