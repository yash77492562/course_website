'use client';

import { useRouter } from 'next/navigation';

export default function PaymentCancelPage() {
  const router = useRouter();

  const animationStyles = (
    <style dangerouslySetInnerHTML={{__html: `
      @keyframes popIn {
        0% { opacity: 0; transform: scale(0.9) translateY(20px); }
        100% { opacity: 1; transform: scale(1) translateY(0); }
      }
      .animate-pop-in {
        animation: popIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
    `}} />
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-transparent relative overflow-hidden">
      {animationStyles}
      <div 
        className="w-full max-w-[500px] backdrop-blur-xl border border-white/60 rounded-[24px] p-12 flex flex-col items-center text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] animate-pop-in"
        style={{ backgroundColor: 'lab(96 0.4 -4.79 / 0.95)' }}
      >
        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <svg className="w-10 h-10 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        
        <h1 className="font-display italic text-[#0f172a] text-[2rem] font-bold tracking-tight mb-3">
          Payment Cancelled
        </h1>
        <p className="text-slate-500 text-[1rem] leading-[1.6] mb-8">
          Your payment was cancelled. No charges were made.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <button 
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-[1rem] px-8 py-3.5 transition-all duration-300 shadow-[0_4px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.35)] hover:-translate-y-[2px]"
          >
            Try Again
          </button>
          <button 
            onClick={() => router.push('/')}
            className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl font-semibold text-[1rem] px-8 py-3.5 transition-all duration-300 hover:-translate-y-[2px] shadow-sm hover:border-slate-300"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
