'use client';

import { useState } from 'react';
import { contactApi, type ContactFormData } from '@/lib/api/contact/contactApi';
import { CustomSelect } from '@/components/features/PartnerForm/CustomSelect';

export function ContactForm() {
  const [currentCard, setCurrentCard] = useState(0);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleNext = () => {
    setCurrentCard((prev) => prev + 1);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Wrapper for CustomSelect onChange
  const handleSelectChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await contactApi.submitContact(formData);

      if (response.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you! We will get back to you soon.',
        });
        setCurrentCard(6); // Move to success card
      } else {
        setSubmitStatus({
          type: 'error',
          message: response.message || 'Failed to submit. Please try again.',
        });
        setCurrentCard(7); // Move to error card
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'An error occurred. Please try again later.',
      });
      setCurrentCard(7); // Move to error card
    } finally {
      setIsSubmitting(false);
    }
  };

  const cards = [
    // Card 0: Welcome
    <div key="welcome" className="card-wrapper">
      <div className="card">
        <div className="icon-circle">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <h2 className="card-title">Talk to us first</h2>
        <p className="card-description">
          Have questions? We're here to help. Fill out the form and we'll get back to you as soon as possible.
        </p>
        <button onClick={handleNext} className="btn-primary">
          Get Started
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>,

    // Card 1: Name
    <div key="name" className="card-wrapper">
      <div className="card">
        <div className="progress-indicator">Step 1 of 5</div>
        <h3 className="field-title">What's your name?</h3>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          className="field-input"
          autoFocus
          onKeyPress={(e) => {
            if (e.key === 'Enter' && formData.name.length >= 2) {
              e.preventDefault();
              handleNext();
            }
          }}
        />
        <button
          onClick={handleNext}
          disabled={formData.name.length < 2}
          className="btn-primary"
        >
          Continue
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>,

    // Card 2: Email
    <div key="email" className="card-wrapper">
      <div className="card">
        <div className="progress-indicator">Step 2 of 5</div>
        <h3 className="field-title">What's your email address?</h3>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john@example.com"
          className="field-input"
          autoFocus
          onKeyPress={(e) => {
            if (e.key === 'Enter' && formData.email.includes('@')) {
              e.preventDefault();
              handleNext();
            }
          }}
        />
        <button
          onClick={handleNext}
          disabled={!formData.email.includes('@')}
          className="btn-primary"
        >
          Continue
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>,

    // Card 3: Phone
    <div key="phone" className="card-wrapper">
      <div className="card">
        <div className="progress-indicator">Step 3 of 5</div>
        <h3 className="field-title">Phone number (Optional)</h3>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+1 (555) 123-4567"
          className="field-input"
          autoFocus
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleNext();
            }
          }}
        />
        <button onClick={handleNext} className="btn-primary">
          Continue
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>,

    // Card 4: Subject
    <div key="subject" className="card-wrapper">
      <div className="card">
        <div className="progress-indicator">Step 4 of 5</div>
        <h3 className="field-title">What can we help you with?</h3>
        <CustomSelect
          name="subject"
          value={formData.subject}
          onChange={handleSelectChange}
          options={[
            { value: 'Course Inquiry', label: 'Course Inquiry' },
            { value: 'Technical Support', label: 'Technical Support' },
            { value: 'Payment Issue', label: 'Payment Issue' },
            { value: 'Partnership Opportunity', label: 'Partnership Opportunity' },
            { value: 'Feedback', label: 'Feedback' },
            { value: 'Other', label: 'Other' },
          ]}
          placeholder="Select a subject"
        />
        <button
          onClick={handleNext}
          disabled={!formData.subject}
          className="btn-primary"
        >
          Continue
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>,

    // Card 5: Message
    <div key="message" className="card-wrapper">
      <div className="card">
        <div className="progress-indicator">Step 5 of 5</div>
        <h3 className="field-title">Tell us more about your inquiry</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us more..."
            className="field-input"
            rows={6}
            autoFocus
            required
            minLength={10}
            maxLength={2000}
          />
          <div className="char-count">{formData.message.length}/2000</div>
          <button
            type="submit"
            disabled={isSubmitting || formData.message.length < 10}
            className="btn-primary"
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Sending...
              </>
            ) : (
              <>
                Send Message
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>,

    // Card 6: Success
    <div key="success" className="card-wrapper">
      <div className="card">
        <div className="icon-circle success-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2 className="card-title">Thank You!</h2>
        <p className="card-description">
          We've received your message and will get back to you as soon as possible. Usually within 24 hours.
        </p>
        <button
          onClick={() => {
            window.location.href = '/';
          }}
          className="btn-primary"
        >
          Go Home
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>
      </div>
    </div>,

    // Card 7: Error
    <div key="error" className="card-wrapper">
      <div className="card">
        <div className="icon-circle error-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 className="card-title">Oops! Something went wrong</h2>
        <p className="card-description">
          {submitStatus.message || 'We couldn\'t submit your message. Please try again or contact us directly.'}
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => setCurrentCard(5)}
            className="btn-primary"
          >
            Try Again
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
          </button>
          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className="btn-secondary"
          >
            Go Home
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </button>
        </div>
      </div>
    </div>,
  ];

  return (
    <>
      <div className="contact-page">
        <div className="cards-container">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`card-slide ${index === currentCard ? 'active' : index < currentCard ? 'prev' : 'next'}`}
            >
              {card}
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .contact-page {
          min-height: 100vh;
          background: #f7f8fa;
          padding: 120px 5vw 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow-x: hidden !important;
        }

        .cards-container {
          position: relative;
          width: 100%;
          max-width: 600px;
          min-height: 500px;
          perspective: 1000px;
        }

        .card-slide {
          position: absolute;
          width: 100%;
          transition: all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
          transform-style: preserve-3d;
        }

        .card-slide.prev {
          transform: translateX(-100%) rotateY(-90deg);
          opacity: 0;
          pointer-events: none;
        }

        .card-slide.active {
          transform: translateX(0) rotateY(0deg);
          opacity: 1;
          pointer-events: all;
          z-index: 10;
        }

        .card-slide.next {
          transform: translateX(100%) rotateY(90deg);
          opacity: 0;
          pointer-events: none;
        }

        .card-wrapper {
          width: 100%;
        }

        .card {
          background: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 16px !important;
          padding: 48px 40px !important;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06) !important;
          min-height: 400px !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          overflow: visible !important;
        }

        .icon-circle {
          width: 72px !important;
          height: 72px !important;
          background: linear-gradient(135deg, #0ea5e9, #06b6d4) !important;
          border-radius: 16px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: white !important;
          margin-bottom: 24px !important;
          animation: pulse 2s ease-in-out infinite;
        }

        .success-icon {
          background: linear-gradient(135deg, #10b981, #059669) !important;
          animation: successPulse 1s ease-in-out;
        }

        .error-icon {
          background: linear-gradient(135deg, #ef4444, #dc2626) !important;
          animation: errorShake 0.5s ease-in-out;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes successPulse {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .card-title {
          font-family: 'DM Sans', sans-serif !important;
          font-size: 2rem !important;
          font-weight: 700 !important;
          color: #0f172a !important;
          margin-bottom: 12px !important;
          letter-spacing: -0.5px !important;
        }

        .card-description {
          font-size: 1rem !important;
          color: #64748b !important;
          line-height: 1.6 !important;
          margin-bottom: 32px !important;
          max-width: 420px !important;
        }

        .progress-indicator {
          font-size: 0.85rem !important;
          color: #64748b !important;
          margin-bottom: 24px !important;
          text-transform: uppercase !important;
          letter-spacing: 1px !important;
        }

        .field-title {
          font-family: 'DM Sans', sans-serif !important;
          font-size: 1.75rem !important;
          font-weight: 700 !important;
          color: #0f172a !important;
          margin-bottom: 24px !important;
        }

        .field-input {
          width: 100% !important;
          max-width: 400px !important;
          padding: 14px 18px !important;
          border: 2px solid #e2e8f0 !important;
          border-radius: 10px !important;
          font-size: 1.05rem !important;
          font-family: 'DM Sans', sans-serif !important;
          transition: all 0.2s !important;
          background: white !important;
          color: #0f172a !important;
          margin-bottom: 24px !important;
        }

        .field-input:focus {
          outline: none !important;
          border-color: #0ea5e9 !important;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1) !important;
        }

        textarea.field-input {
          resize: vertical !important;
          min-height: 150px !important;
        }

        .char-count {
          font-size: 0.8rem !important;
          color: #64748b !important;
          margin-bottom: 16px !important;
        }

        .btn-primary {
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px !important;
          background: linear-gradient(135deg, #0ea5e9, #06b6d4) !important;
          color: white !important;
          padding: 14px 32px !important;
          border: none !important;
          border-radius: 8px !important;
          font-weight: 500 !important;
          font-size: 0.95rem !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
          box-shadow: 0 4px 24px rgba(14, 165, 233, 0.35) !important;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 32px rgba(14, 165, 233, 0.45) !important;
        }

        .btn-primary:disabled {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
          transform: none !important;
        }

        .btn-secondary {
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px !important;
          background: white !important;
          color: #0f172a !important;
          padding: 14px 32px !important;
          border: 2px solid #e2e8f0 !important;
          border-radius: 8px !important;
          font-weight: 500 !important;
          font-size: 0.95rem !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
        }

        .btn-secondary:hover {
          background: #f7f8fa !important;
          border-color: #cbd5e1 !important;
          transform: translateY(-2px) !important;
        }

        .alert {
          width: 100% !important;
          max-width: 400px !important;
          padding: 12px 16px !important;
          border-radius: 8px !important;
          margin-bottom: 20px !important;
          font-size: 0.9rem !important;
        }

        .alert-success {
          background: #d4edda !important;
          color: #155724 !important;
          border: 1px solid #c3e6cb !important;
        }

        .alert-error {
          background: #f8d7da !important;
          color: #721c24 !important;
          border: 1px solid #f5c6cb !important;
        }

        .spinner {
          width: 16px !important;
          height: 16px !important;
          border: 2px solid rgba(255, 255, 255, 0.3) !important;
          border-top-color: white !important;
          border-radius: 50% !important;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        form {
          width: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
        }

        @media (max-width: 640px) {
          .contact-page {
            padding: 80px 20px 40px !important;
          }

          .card {
            padding: 32px 24px !important;
            min-height: 350px !important;
          }

          .card-title {
            font-size: 1.5rem !important;
          }

          .field-title {
            font-size: 1.4rem !important;
          }
        }
      `}</style>
    </>
  );
}
