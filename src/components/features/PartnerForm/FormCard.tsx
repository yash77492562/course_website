import { ChangeEvent, KeyboardEvent } from 'react';
import { CustomSelect } from './CustomSelect';

interface FormCardProps {
  step: number;
  totalSteps: number;
  title: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | { target: { name: string; value: string } }) => void;
  onNext: () => void;
  type?: 'text' | 'email' | 'tel' | 'url' | 'select' | 'textarea';
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  disabled?: boolean;
  minLength?: number;
}

export function FormCard({
  step,
  totalSteps,
  title,
  name,
  value,
  onChange,
  onNext,
  type = 'text',
  placeholder,
  options,
  rows = 4,
  disabled = false,
  minLength = 0,
}: FormCardProps) {
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !disabled && value.length >= minLength) {
      e.preventDefault();
      onNext();
    }
  };

  return (
    <div className="card">
      <div className="progress-indicator">Step {step} of {totalSteps}</div>
      <h3 className="field-title">{title}</h3>
      
      {type === 'select' ? (
        <CustomSelect
          name={name}
          value={value}
          onChange={onChange}
          options={options || []}
          placeholder={placeholder}
        />
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="field-input"
          rows={rows}
          autoFocus
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="field-input"
          autoFocus
          onKeyPress={handleKeyPress}
        />
      )}
      
      <button
        onClick={onNext}
        disabled={disabled}
        className="btn-primary"
      >
        Continue
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
