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
  required?: boolean;
}

export function CustomSelect({ name, value, onChange, options, placeholder = 'Select an option', required = false }: CustomSelectProps) {
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
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-xl border flex items-center justify-between text-left cursor-pointer transition-all ${
          isOpen ? 'border-blue-600 ring-2 ring-blue-600/30' : 'border-slate-200 hover:border-blue-600'
        } ${value ? 'text-slate-900 bg-white' : 'text-slate-400 bg-white'}`}
      >
        <span className="block truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          className={`transition-transform duration-200 flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        >
          <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Hidden input to make sure the value is submitted and required validation works */}
      {required && (
        <input 
          tabIndex={-1} 
          className="absolute opacity-0 w-0 h-0 bottom-0 left-1/2"
          required 
          value={value} 
          onChange={() => {}} 
        />
      )}

      {isOpen && (
        <div
          className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto custom-select-dropdown"
          style={{
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
          }}
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full py-3 px-4 text-left border-none cursor-pointer text-sm md:text-base font-medium transition-colors block whitespace-nowrap overflow-hidden text-ellipsis ${
                value === option.value
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-transparent text-slate-700 hover:bg-slate-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
      
      <style jsx>{`
        .custom-select-dropdown {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        
        .custom-select-dropdown::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-select-dropdown::-webkit-scrollbar-track {
          background: transparent;
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
