'use client';

import { useState } from 'react';
import { contactApi, type ContactFormData } from '@/lib/api/contact/contactApi';
import { CustomSelect } from '@/components/features/PartnerForm/CustomSelect';

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const phoneValue = value.replace(/[^0-9+\-\s()]/g, '');
      setFormData((prev) => ({ ...prev, [name]: phoneValue }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await contactApi.submitContact(formData);

      if (response.success) {
        setStatus('success');
      } else {
        setErrorMessage(response.message || 'Failed to submit. Please try again.');
        setStatus('error');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-transparent flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white/95 backdrop-blur-xl rounded-[24px] shadow-xl p-8 sm:p-12 border border-slate-200/50">
        
        {status === 'success' ? (
           <div className="text-center py-8">
             <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
               <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
             </div>
             <h2 className="text-2xl font-bold text-slate-900 mb-4 font-display">Message Sent!</h2>
             <p className="text-slate-500 mb-8 max-w-md mx-auto">We've received your message and will get back to you as soon as possible. Usually within 24 hours.</p>
             <button 
                onClick={() => {
                  setStatus('idle');
                  setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-8 rounded-xl transition-all shadow-md shadow-blue-600/20"
             >
               Send Another Message
             </button>
           </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-blue-600 rounded-[16px] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/20">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h1 className="text-[2rem] sm:text-[2.5rem] font-display font-bold text-slate-900 mb-4 tracking-tight leading-tight">Talk to us first</h1>
              <p className="text-slate-500 text-[1.05rem] leading-relaxed max-w-lg mx-auto">Have questions? We're here to help. Fill out the form and we'll get back to you as soon as possible.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
            {status === 'error' && (
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl mb-6 text-sm text-center font-medium">
                {errorMessage}
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-slate-900 placeholder:text-slate-400" placeholder="John Doe" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-slate-900 placeholder:text-slate-400" placeholder="john@example.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number (Optional)</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-slate-900 placeholder:text-slate-400" placeholder="+1 (555) 123-4567" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Subject *</label>
                <CustomSelect
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange as any}
                  required
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
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Message *</label>
              <textarea required minLength={10} maxLength={2000} name="message" value={formData.message} onChange={handleChange} rows={5} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all resize-y text-slate-900 placeholder:text-slate-400" placeholder="Tell us more..."></textarea>
              <div className="text-right text-xs text-slate-400 mt-1">{formData.message.length}/2000</div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || formData.message.length < 10}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-md shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : 'Send Message'}
            </button>
          </form>
          </>
        )}
      </div>
    </div>
  );
}
