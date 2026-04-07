import { FormEvent, ChangeEvent } from 'react';

interface FinalCardProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent) => void;
  isSubmitting: boolean;
  disabled: boolean;
}

export function FinalCard({ value, onChange, onSubmit, isSubmitting, disabled }: FinalCardProps) {
  return (
    <div className="card">
      <div className="progress-indicator">Step 9 of 9</div>
      <h3 className="field-title">Tell us more about yourself</h3>
      <form onSubmit={onSubmit}>
        <textarea
          name="message"
          value={value}
          onChange={onChange}
          placeholder="Share your teaching experience, achievements, or anything else you'd like us to know..."
          className="field-input"
          rows={6}
          autoFocus
          required
          minLength={20}
        />
        <div className="char-count">{value.length}/2000</div>
        <button
          type="submit"
          disabled={disabled || isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Submitting...
            </>
          ) : (
            <>
              Submit Application
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
