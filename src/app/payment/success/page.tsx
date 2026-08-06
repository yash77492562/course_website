'use client';

import { logger } from '@/lib/utils/logger';
import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { paymentApi } from '@/lib/api/payment/paymentApi';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams?.get('session_id');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'timeout'>('loading');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // STEP 6: Poll order status to confirm payment
    const pollOrderStatus = async () => {
      // Get orderId from localStorage (stored before Stripe redirect)
      const pendingOrderId = localStorage.getItem('pending_order_id');
      
      if (!pendingOrderId) {
        setError('No order ID found');
        setStatus('failed');
        return;
      }

      setOrderId(pendingOrderId);
      logger.debug('🔍 Polling order status for:', pendingOrderId);

      let pollAttempts = 0;
      const maxAttempts = 15; // 30 seconds (poll every 2 seconds)
      
      const poll = setInterval(async () => {
        pollAttempts++;
        logger.debug(`🔄 Poll attempt ${pollAttempts}/${maxAttempts}`);

        try {
          const orderStatus = await paymentApi.getOrderStatus(pendingOrderId);
          logger.debug('📊 Order status:', orderStatus);

          if (orderStatus.status === 'paid') {
            clearInterval(poll);
            setStatus('success');
            localStorage.removeItem('pending_order_id');
            logger.debug('✅ Payment confirmed!');
          } else if (orderStatus.status === 'failed') {
            clearInterval(poll);
            setStatus('failed');
            setError('Payment failed');
            localStorage.removeItem('pending_order_id');
            logger.debug('❌ Payment failed');
          } else if (pollAttempts >= maxAttempts) {
            // Timeout after 30 seconds
            clearInterval(poll);
            setStatus('timeout');
            setError('Payment verification timeout. Please check your order status.');
            logger.debug('⏱️ Polling timeout');
          }
        } catch (err: any) {
          logger.error('❌ Polling error:', err);
          if (pollAttempts >= maxAttempts) {
            clearInterval(poll);
            setStatus('failed');
            setError(err.message || 'Failed to verify payment');
          }
        }
      }, 2000); // Poll every 2 seconds

      // Cleanup on unmount
      return () => clearInterval(poll);
    };

    pollOrderStatus();
  }, []);

  // Shared Animation Styles
  const animationStyles = (
    <style dangerouslySetInnerHTML={{__html: `
      @keyframes popIn {
        0% { opacity: 0; transform: scale(0.9) translateY(20px); }
        100% { opacity: 1; transform: scale(1) translateY(0); }
      }
      @keyframes checkmarkPop {
        0% { transform: scale(0); opacity: 0; }
        60% { transform: scale(1.15); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .animate-pop-in {
        animation: popIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      .animate-checkmark {
        animation: checkmarkPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 0.2s;
        opacity: 0;
      }
    `}} />
  );

  // LOADING STATE
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-transparent relative overflow-hidden">
        {animationStyles}
        <div 
          className="w-full max-w-[500px] backdrop-blur-xl border border-white/60 rounded-[24px] p-12 flex flex-col items-center text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] animate-pop-in"
          style={{ backgroundColor: 'lab(92 -3.12 -0.26 / 0.9)' }}
        >
          <div style={{ 
            width: '64px', 
            height: '64px', 
            border: '4px solid rgba(13, 148, 136, 0.1)',
            borderTop: '4px solid #0d9488',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '1.5rem'
          }}></div>
          
          <h2 className="font-display italic text-[#0f172a] text-[1.75rem] font-bold tracking-tight mb-2">
            Verifying your payment...
          </h2>
          <p className="text-slate-500 text-[1rem] leading-[1.6]">
            Please wait while we confirm your transaction securely.
          </p>
        </div>
      </div>
    );
  }

  // ERROR/FAILED STATE
  if (status === 'failed' || status === 'timeout') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-transparent relative overflow-hidden">
        {animationStyles}
        <div 
          className="w-full max-w-[500px] backdrop-blur-xl border border-white/60 rounded-[24px] p-12 flex flex-col items-center text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] animate-pop-in"
          style={{ backgroundColor: 'lab(92 -3.12 -0.26 / 0.9)' }}
        >
          <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-6 shadow-sm animate-checkmark">
            <svg className="w-10 h-10 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </div>
          
          <h1 className="font-display italic text-[#0f172a] text-[2rem] font-bold tracking-tight mb-3">
            {status === 'timeout' ? 'Verification Timeout' : 'Payment Error'}
          </h1>
          <p className="text-slate-500 text-[1rem] leading-[1.6] mb-8">
            {error || 'Something went wrong with your payment. Please try again.'}
          </p>
          
          {(orderId || sessionId) && (
            <div className="w-full bg-white/60 backdrop-blur-sm border border-rose-100 p-4 rounded-[16px] mb-8 flex flex-col items-center gap-3">
              {orderId && (
                <div className="flex flex-col items-center">
                  <span className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-rose-500 mb-1">Order ID</span>
                  <span className="text-[0.8rem] text-slate-500 font-mono break-all text-center">{orderId}</span>
                </div>
              )}
              {sessionId && (
                <div className="flex flex-col items-center">
                  <span className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-rose-500 mb-1">Payment ID</span>
                  <span className="text-[0.8rem] text-slate-500 font-mono break-all text-center">{sessionId}</span>
                </div>
              )}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <button 
              onClick={() => router.push('/my-courses')}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-[1rem] px-8 py-3.5 transition-all duration-300 shadow-[0_4px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.35)] hover:-translate-y-[2px]"
            >
              Check My Courses
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

  // SUCCESS STATE
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-transparent relative overflow-hidden">
      {animationStyles}
      <div 
        className="w-full max-w-[600px] backdrop-blur-xl border border-white/60 rounded-[24px] p-6 sm:p-12 flex flex-col items-center text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] animate-pop-in"
        style={{ backgroundColor: 'lab(96 0.4 -4.79 / 0.95)' }}
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-5 sm:mb-6 shadow-sm animate-checkmark">
          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-[#059669]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        </div>
        
        <h1 className="font-display italic text-[#0f172a] text-[2rem] sm:text-[2.5rem] font-bold tracking-tight mb-2 sm:mb-4 leading-[1.1]">
          Payment Successful!
        </h1>
        <p className="text-slate-500 text-[1rem] sm:text-[1.1rem] leading-[1.6] mb-8 sm:mb-10 max-w-sm px-2">
          Thank you for your purchase. Your course access has been permanently activated.
        </p>
        
        {(orderId || sessionId) && (
          <div className="w-full bg-white/60 backdrop-blur-sm border border-emerald-100 p-4 sm:p-5 rounded-[16px] mb-8 sm:mb-10 flex flex-col items-center gap-3 sm:gap-4">
            {orderId && (
              <div className="flex flex-col items-center w-full px-2">
                <span className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-blue-600 mb-1">Order ID</span>
                <span className="text-[0.75rem] sm:text-[0.8rem] text-slate-500 font-mono break-all text-center w-full">{orderId}</span>
              </div>
            )}
            {sessionId && (
              <div className="flex flex-col items-center w-full px-2">
                <span className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-blue-600 mb-1">Payment ID</span>
                <span className="text-[0.75rem] sm:text-[0.8rem] text-slate-500 font-mono break-all text-center w-full">{sessionId}</span>
              </div>
            )}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center">
          <button 
            onClick={() => router.push('/my-courses')}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-[1rem] sm:text-[1.05rem] px-8 py-3.5 sm:py-4 transition-all duration-300 shadow-[0_4px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.35)] hover:-translate-y-[2px]"
          >
            View My Courses
          </button>
          <button 
            onClick={() => router.push('/')}
            className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl font-semibold text-[1rem] sm:text-[1.05rem] px-8 py-3.5 sm:py-4 transition-all duration-300 hover:-translate-y-[2px] shadow-sm hover:border-slate-300"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-slate-500 text-[1.1rem]">Loading securely...</div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
