'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { partnerApi, type PartnerFormData } from '@/lib/api/partner/partnerApi';
import { WelcomeCard } from '@/components/features/PartnerForm/WelcomeCard';
import { FormCard } from '@/components/features/PartnerForm/FormCard';
import { FinalCard } from '@/components/features/PartnerForm/FinalCard';
import { SuccessCard } from '@/components/features/PartnerForm/SuccessCard';
import { ErrorCard } from '@/components/features/PartnerForm/ErrorCard';

export function PartnerPage() {
  const [currentCard, setCurrentCard] = useState(0);
  const [formData, setFormData] = useState<PartnerFormData>({
    name: '',
    email: '',
    phone: '',
    role: '',
    expertise: '',
    experience: '',
    linkedIn: '',
    portfolio: '',
    teachingInterest: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleNext = () => setCurrentCard((prev) => prev + 1);

 const handleChange = (
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | { target: { name: string; value: string } }
) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

  // Wrapper for CustomSelect onChange
  const handleSelectChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await partnerApi.submitPartner(formData);
      if (response.success) {
        setCurrentCard(10); // Success card
      } else {
        setErrorMessage(response.message || 'Failed to submit');
        setCurrentCard(11); // Error card
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred');
      setCurrentCard(11); // Error card
    } finally {
      setIsSubmitting(false);
    }
  };

  const cards = [
    <WelcomeCard key="welcome" onNext={handleNext} />,
    
    <FormCard
      key="name"
      step={1}
      totalSteps={9}
      title="What's your full name?"
      name="name"
      value={formData.name}
      onChange={handleChange}
      onNext={handleNext}
      placeholder="John Doe"
      disabled={formData.name.length < 2}
      minLength={2}
    />,
    
    <FormCard
      key="email"
      step={2}
      totalSteps={9}
      title="What's your email address?"
      name="email"
      type="email"
      value={formData.email}
      onChange={handleChange}
      onNext={handleNext}
      placeholder="john@example.com"
      disabled={!formData.email.includes('@')}
    />,
    
    <FormCard
      key="phone"
      step={3}
      totalSteps={9}
      title="Phone number"
      name="phone"
      type="tel"
      value={formData.phone}
      onChange={handleChange}
      onNext={handleNext}
      placeholder="+1 (555) 123-4567"
      disabled={formData.phone.length < 10}
      minLength={10}
    />,
    
    <FormCard
      key="role"
      step={4}
      totalSteps={9}
      title="What's your current role?"
      name="role"
      value={formData.role}
      onChange={handleChange}
      onNext={handleNext}
      placeholder="e.g., Data Scientist, Software Engineer"
      disabled={formData.role.length < 2}
      minLength={2}
    />,
    
    <FormCard
      key="expertise"
      step={5}
      totalSteps={9}
      title="What's your area of expertise?"
      name="expertise"
      type="select"
      value={formData.expertise}
      onChange={handleChange}
      onNext={handleNext}
      disabled={!formData.expertise}
      options={[
        { value: 'Data Science', label: 'Data Science' },
        { value: 'Data Analytics', label: 'Data Analytics' },
        { value: 'Machine Learning', label: 'Machine Learning' },
        { value: 'Artificial Intelligence', label: 'Artificial Intelligence' },
        { value: 'Software Development', label: 'Software Development' },
        { value: 'Web Development', label: 'Web Development' },
        { value: 'Cloud Computing', label: 'Cloud Computing' },
        { value: 'Cybersecurity', label: 'Cybersecurity' },
        { value: 'Business Analytics', label: 'Business Analytics' },
        { value: 'Other', label: 'Other' },
      ]}
    />,
    
    <FormCard
      key="experience"
      step={6}
      totalSteps={9}
      title="Years of experience?"
      name="experience"
      type="select"
      value={formData.experience}
      onChange={handleChange}
      onNext={handleNext}
      disabled={!formData.experience}
      options={[
        { value: '1-2 years', label: '1-2 years' },
        { value: '3-5 years', label: '3-5 years' },
        { value: '6-10 years', label: '6-10 years' },
        { value: '10+ years', label: '10+ years' },
      ]}
    />,
    
    <FormCard
      key="linkedin"
      step={7}
      totalSteps={9}
      title="LinkedIn profile (Optional)"
      name="linkedIn"
      type="url"
      value={formData.linkedIn ?? ''}
      onChange={handleChange}
      onNext={handleNext}
      placeholder="https://linkedin.com/in/yourprofile"
    />,
    
    <FormCard
      key="teaching"
      step={8}
      totalSteps={9}
      title="What would you like to teach?"
      name="teachingInterest"
      type="textarea"
      value={formData.teachingInterest}
      onChange={handleChange}
      onNext={handleNext}
      placeholder="Describe the courses or topics you'd like to teach..."
      rows={4}
      disabled={formData.teachingInterest.length < 10}
      minLength={10}
    />,
    
    <FinalCard
      key="message"
      value={formData.message}
      onChange={handleChange}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      disabled={formData.message.length < 20}
    />,
    
    <SuccessCard key="success" />,
    
    <ErrorCard
      key="error"
      message={errorMessage}
      onRetry={() => setCurrentCard(9)}
    />,
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
              <div className="card-wrapper">{card}</div>
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
          appearance: none !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
        }

        select.field-input {
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%230f172a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: right 18px center !important;
          padding-right: 45px !important;
          cursor: pointer !important;
          line-height: 1.8 !important;
        }

        select.field-input option {
          padding: 14px 18px !important;
          font-size: 1rem !important;
          color: #0f172a !important;
          background: white !important;
          line-height: 2.2 !important;
          min-height: 48px !important;
        }

        select.field-input option:hover {
          background: #f7f8fa !important;
        }

        select.field-input option:checked,
        select.field-input option:focus {
          background: linear-gradient(135deg, #0ea5e9, #06b6d4) !important;
          color: white !important;
        }

        select.field-input:hover {
          border-color: #cbd5e1 !important;
        }

        /* Firefox specific */
        @-moz-document url-prefix() {
          select.field-input option {
            padding: 12px 16px !important;
          }
        }

        .field-input:focus {
          outline: none !important;
          border-color: #0ea5e9 !important;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1) !important;
        }

        textarea.field-input {
          resize: vertical !important;
          min-height: 120px !important;
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
