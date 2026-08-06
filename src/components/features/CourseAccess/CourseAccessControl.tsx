'use client';

import { logger } from '@/lib/utils/logger';
import { useAuth } from '@/hooks/auth/useAuth';
import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useCourseAccess } from '@/hooks/course/useCourseAccess';

// Dynamically import StripeCheckout to avoid SSR issues
const StripeCheckout = dynamic(
  () => import('@/components/payment/stripe/checkout/StripeCheckout'),
  { ssr: false }
);

interface CourseAccessControlProps {
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  children: React.ReactNode;
}

interface PayNowContextType {
  handlePayNow: () => void;
  hasPurchased: boolean;
  isAuthenticated: boolean;
  showPaymentButtons: boolean; // Add this flag
}

const PayNowContext = createContext<PayNowContextType | undefined>(undefined);

export function usePayNow() {
  const context = useContext(PayNowContext);
  if (!context) {
    throw new Error('usePayNow must be used within CourseAccessControl');
  }
  return context;
}

export function CourseAccessControl({
  courseId,
  courseTitle,
  coursePrice,
  children,
}: CourseAccessControlProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  // Set flag to skip cache on first load
  useEffect(() => {
    sessionStorage.setItem(`skip_cache_${courseId}`, 'true');
  }, [courseId]);
  
  // Use the new centralized access hook
  const { hasAccess: hasPurchased, isLoading: isChecking, clearCache } = useCourseAccess(courseId);
  
  const [showCheckout, setShowCheckout] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Debug logging
  useEffect(() => {
    logger.debug('[CourseAccessControl] ========== STATE UPDATE ==========');
    logger.debug('[CourseAccessControl] Course ID:', courseId);
    logger.debug('[CourseAccessControl] Is Authenticated:', isAuthenticated);
    logger.debug('[CourseAccessControl] User ID:', user?.id);
    logger.debug('[CourseAccessControl] Has Purchased:', hasPurchased);
    logger.debug('[CourseAccessControl] Is Checking:', isChecking);
    logger.debug('[CourseAccessControl] Show Payment Buttons:', !hasPurchased);
    logger.debug('[CourseAccessControl] ====================================');
  }, [courseId, isAuthenticated, user?.id, hasPurchased, isChecking]);

  // Additional debug for context value
  useEffect(() => {
    logger.debug('[CourseAccessControl] 🎯 Context Value Updated:', {
      hasPurchased,
      isAuthenticated,
      showPaymentButtons: !hasPurchased
    });
  }, [hasPurchased, isAuthenticated]);

  const handlePayNow = () => {
    if (!isAuthenticated) {
      // Show login prompt modal instead of redirecting
      setShowLoginPrompt(true);
      return;
    }

    // Show checkout modal
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = () => {
    // Refresh the page to update purchase status
    window.location.reload();
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading course...</p>
        </div>
      </div>
    );
  }

  const contextValue: PayNowContextType = {
    handlePayNow,
    hasPurchased,
    isAuthenticated,
    showPaymentButtons: !hasPurchased, // Don't show if already purchased
  };

  return (
    <PayNowContext.Provider value={contextValue} key={`access-${hasPurchased}`}>
      {/* Show course content */}
      <div className={showCheckout || showLoginPrompt ? 'opacity-30 pointer-events-none' : ''}>
        {children}
      </div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-[100] p-4"
          style={{
            background: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <div 
            className="w-full max-w-[420px] backdrop-blur-xl border border-white/60 rounded-[24px] p-6 sm:p-10 flex flex-col items-center text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative"
            style={{ backgroundColor: 'lab(96 0.4 -4.79 / 0.95)' }}
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-5 sm:mb-6 shadow-sm">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            
            <h2 className="font-display italic text-[#0f172a] text-[1.5rem] sm:text-[2rem] font-bold tracking-tight mb-2 sm:mb-3">
              Login Required
            </h2>
            
            <p className="text-slate-500 text-[0.95rem] sm:text-[1rem] leading-[1.6] mb-6 sm:mb-8 px-2 sm:px-4">
              Please login to your account to purchase this course.
            </p>
            
            <div className="flex flex-col w-full gap-3">
              <button
                onClick={() => router.push(`/login?redirect=/course/${courseId}`)}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-[1rem] py-3.5 transition-all duration-300 shadow-[0_4px_20px_rgba(13,148,136,0.25)] hover:shadow-[0_8px_30px_rgba(13,148,136,0.35)] hover:-translate-y-[2px]"
              >
                Login to Continue
              </button>
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="w-full bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl font-semibold text-[1rem] py-3.5 transition-all duration-300 hover:-translate-y-[2px] shadow-sm hover:border-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal Overlay */}
      {showCheckout && isAuthenticated && user && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-[100] p-4"
          style={{
            background: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <div 
            className="rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/60 relative"
            style={{ backgroundColor: 'lab(96 0.4 -4.79 / 0.95)' }}
          >
            <div 
              className="sticky top-0 flex flex-row items-start justify-between rounded-t-[24px] z-10 border-b border-slate-100 backdrop-blur-md px-5 py-5 sm:px-8 sm:py-6"
              style={{ backgroundColor: 'lab(96 0.4 -4.79 / 0.95)' }}
            >
              <div className="pr-4">
                <h2 className="font-display italic text-[#0f172a] text-[1.4rem] sm:text-[1.75rem] font-bold tracking-tight mb-1 leading-[1.2]">
                  Complete Your Purchase
                </h2>
                <p className="text-slate-500 text-[0.95rem] font-medium m-0">
                  {courseTitle}
                </p>
              </div>
              <button
                onClick={() => setShowCheckout(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors border border-slate-200/60"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-8">
              <StripeCheckout
                courseId={courseId}
                userId={user.id}
                courseTitle={courseTitle}
                onSuccess={handleCheckoutSuccess}
              />
            </div>
          </div>
        </div>
      )}
    </PayNowContext.Provider>
  );
}
