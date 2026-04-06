'use client';

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
    console.log('[CourseAccessControl] ========== STATE UPDATE ==========');
    console.log('[CourseAccessControl] Course ID:', courseId);
    console.log('[CourseAccessControl] Is Authenticated:', isAuthenticated);
    console.log('[CourseAccessControl] User ID:', user?.id);
    console.log('[CourseAccessControl] Has Purchased:', hasPurchased);
    console.log('[CourseAccessControl] Is Checking:', isChecking);
    console.log('[CourseAccessControl] Show Payment Buttons:', !hasPurchased);
    console.log('[CourseAccessControl] ====================================');
  }, [courseId, isAuthenticated, user?.id, hasPurchased, isChecking]);

  // Additional debug for context value
  useEffect(() => {
    console.log('[CourseAccessControl] 🎯 Context Value Updated:', {
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
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{
            background: 'rgba(5, 13, 31, 0.75)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <div 
            style={{
              width: '420px',
              minHeight: '420px',
              background: 'linear-gradient(160deg, rgba(17, 34, 64, 0.95) 0%, rgba(13, 31, 64, 0.95) 60%, rgba(10, 34, 64, 0.95) 100%)',
              border: '1px solid rgba(14, 165, 233, 0.2)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '48px 40px 56px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <div className="text-center">
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔐</div>
              <h2 
                style={{ 
                  color: 'rgba(255, 255, 255, 0.95)',
                  fontFamily: 'Syne, sans-serif',
                  fontSize: '28px',
                  fontWeight: '700',
                  letterSpacing: '-0.5px',
                  marginBottom: '16px'
                }}
              >
                Login Required
              </h2>
              <p 
                style={{ 
                  color: 'rgba(255, 255, 255, 0.65)',
                  fontSize: '15px',
                  lineHeight: '1.6',
                  marginBottom: '36px'
                }}
              >
                Please login to your account to purchase this course
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                <button
                  onClick={() => router.push(`/login?redirect=/course/${courseId}`)}
                  style={{
                    width: '200px',
                    height: '52px',
                    background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                    boxShadow: '0 4px 24px rgba(14, 165, 233, 0.35)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(14, 165, 233, 0.45)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 24px rgba(14, 165, 233, 0.35)';
                  }}
                >
                  Login to Continue
                </button>
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  style={{
                    width: '200px',
                    height: '52px',
                    border: '1.5px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    background: 'transparent',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal Overlay */}
      {showCheckout && isAuthenticated && user && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{
            background: 'rgba(5, 13, 31, 0.75)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <div 
            className="rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{
              background: 'linear-gradient(160deg, rgba(17, 34, 64, 0.98) 0%, rgba(13, 31, 64, 0.98) 60%, rgba(10, 34, 64, 0.98) 100%)',
              border: '1px solid rgba(14, 165, 233, 0.2)',
              backdropFilter: 'blur(20px)'
            }}
          >
            {/* Modal Header */}
            <div 
              className="sticky top-0 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10 border-b"
              style={{
                background: 'rgba(17, 34, 64, 0.95)',
                borderColor: 'rgba(14, 165, 233, 0.15)'
              }}
            >
              <div>
                <h2 
                  className="text-xl font-bold"
                  style={{ 
                    color: 'rgba(255, 255, 255, 0.95)',
                    fontFamily: 'Syne, sans-serif'
                  }}
                >
                  Complete Your Purchase
                </h2>
                <p 
                  className="text-sm mt-1"
                  style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                >
                  {courseTitle}
                </p>
              </div>
              <button
                onClick={() => setShowCheckout(false)}
                className="p-2 rounded-lg transition-all duration-200"
                aria-label="Close"
                style={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  background: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
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
