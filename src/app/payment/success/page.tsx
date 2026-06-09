'use client';

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
      console.log('🔍 Polling order status for:', pendingOrderId);

      let pollAttempts = 0;
      const maxAttempts = 15; // 30 seconds (poll every 2 seconds)
      
      const poll = setInterval(async () => {
        pollAttempts++;
        console.log(`🔄 Poll attempt ${pollAttempts}/${maxAttempts}`);

        try {
          const orderStatus = await paymentApi.getOrderStatus(pendingOrderId);
          console.log('📊 Order status:', orderStatus);

          if (orderStatus.status === 'paid') {
            clearInterval(poll);
            setStatus('success');
            localStorage.removeItem('pending_order_id');
            console.log('✅ Payment confirmed!');
          } else if (orderStatus.status === 'failed') {
            clearInterval(poll);
            setStatus('failed');
            setError('Payment failed');
            localStorage.removeItem('pending_order_id');
            console.log('❌ Payment failed');
          } else if (pollAttempts >= maxAttempts) {
            // Timeout after 30 seconds
            clearInterval(poll);
            setStatus('timeout');
            setError('Payment verification timeout. Please check your order status.');
            console.log('⏱️ Polling timeout');
          }
        } catch (err: any) {
          console.error('❌ Polling error:', err);
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

  // LOADING STATE
  if (status === 'loading') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '3rem', 
          borderRadius: '1rem', 
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          maxWidth: '500px'
        }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ fontSize: '1.2rem', color: '#333', marginBottom: '0.5rem' }}>
            Verifying your payment...
          </p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Please wait while we confirm your payment with our server
          </p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // ERROR/FAILED STATE
  if (status === 'failed' || status === 'timeout') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '3rem', 
          borderRadius: '1rem', 
          textAlign: 'center',
          maxWidth: '500px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>
            {status === 'timeout' ? 'Payment Verification Timeout' : 'Payment Error'}
          </h1>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            {error || 'Something went wrong with your payment'}
          </p>
          {orderId && (
            <div style={{ 
              background: '#f8f9fa', 
              padding: '1rem', 
              borderRadius: '0.5rem',
              marginBottom: '2rem'
            }}>
              <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>
                Order ID:
              </p>
              <p style={{ fontSize: '0.8rem', color: '#999', wordBreak: 'break-all' }}>
                {orderId}
              </p>
            </div>
          )}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => router.push('/my-courses')}
              style={{
                background: '#667eea',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Check My Courses
            </button>
            <button 
              onClick={() => router.push('/')}
              style={{
                background: 'transparent',
                color: '#667eea',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                border: '2px solid #667eea',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
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
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '3rem', 
        borderRadius: '1rem', 
        textAlign: 'center',
        maxWidth: '600px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>✅</div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>Payment Successful!</h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
          Thank you for your purchase. Your course access has been activated.
        </p>
        {orderId && (
          <div style={{ 
            background: '#f8f9fa', 
            padding: '1.5rem', 
            borderRadius: '0.5rem',
            marginBottom: '2rem'
          }}>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Order ID:</p>
            <p style={{ fontSize: '0.85rem', color: '#999', wordBreak: 'break-all' }}>{orderId}</p>
          </div>
        )}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => router.push('/my-courses')}
            style={{
              background: '#667eea',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            View My Courses
          </button>
          <button 
            onClick={() => router.push('/')}
            style={{
              background: 'transparent',
              color: '#667eea',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              border: '2px solid #667eea',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
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
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '1.5rem' }}>Loading...</div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
