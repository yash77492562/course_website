'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { partnerApi, type PartnerFormData } from '@/lib/api/partner/partnerApi';
import { CustomSelect } from '@/components/features/PartnerForm/CustomSelect';

export function PartnerPage() {
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
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const phoneValue = value.replace(/[^0-9+\-\s()]/g, '');
      setFormData((prev) => ({ ...prev, [name]: phoneValue }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await partnerApi.submitPartner(formData);
      if (response.success) {
        setStatus('success');
      } else {
        setErrorMessage(response.message || 'Failed to submit');
        setStatus('error');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'An error occurred');
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
             <h2 className="text-2xl font-bold text-slate-900 mb-4 font-display">Application Submitted!</h2>
             <p className="text-slate-500 mb-8 max-w-md mx-auto">Thank you for your interest in partnering with us. Our team will review your application and get back to you shortly.</p>
             <button 
                onClick={() => {
                  setStatus('idle');
                  setFormData({
                    name: '', email: '', phone: '', role: '', expertise: '', experience: '', linkedIn: '', portfolio: '', teachingInterest: '', message: ''
                  });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-8 rounded-xl transition-all shadow-md shadow-blue-600/20"
             >
               Submit Another
             </button>
           </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-blue-600 rounded-[16px] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/20">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h1 className="text-[2rem] sm:text-[2.5rem] font-display font-bold text-slate-900 mb-4 tracking-tight leading-tight">Partner With Us</h1>
              <p className="text-slate-500 text-[1.05rem] leading-relaxed max-w-lg mx-auto">Join our team of expert instructors. Share your knowledge and help students achieve their goals.</p>
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
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number *</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-slate-900 placeholder:text-slate-400" placeholder="+1 (555) 123-4567" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Current Role *</label>
                <input required type="text" name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-slate-900 placeholder:text-slate-400" placeholder="e.g. Data Scientist" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Area of Expertise *</label>
                <CustomSelect
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange as any}
                  required
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
                  placeholder="Select expertise"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Years of Experience *</label>
                <CustomSelect
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange as any}
                  required
                  options={[
                    { value: '1-2 years', label: '1-2 years' },
                    { value: '3-5 years', label: '3-5 years' },
                    { value: '6-10 years', label: '6-10 years' },
                    { value: '10+ years', label: '10+ years' },
                  ]}
                  placeholder="Select experience"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">LinkedIn Profile</label>
                <input type="url" name="linkedIn" value={formData.linkedIn || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-slate-900 placeholder:text-slate-400" placeholder="https://linkedin.com/in/..." />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Portfolio / Website</label>
                <input type="url" name="portfolio" value={formData.portfolio || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all text-slate-900 placeholder:text-slate-400" placeholder="https://yourwebsite.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">What would you like to teach? *</label>
              <textarea required name="teachingInterest" value={formData.teachingInterest} onChange={handleChange} rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all resize-y text-slate-900 placeholder:text-slate-400" placeholder="Describe the courses or topics you'd like to teach..."></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Message *</label>
              <textarea required name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all resize-y text-slate-900 placeholder:text-slate-400" placeholder="Any additional details you'd like to share..."></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-md shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : 'Submit Application'}
            </button>
          </form>
          </>
        )}
      </div>
    </div>
  );
}
