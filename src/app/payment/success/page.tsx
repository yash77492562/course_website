'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams?.get('session_id');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID found');
      setLoading(false);
      return;
    }

    // Simulate checking payment status
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [sessionId]);

  if (loading) {
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
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
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
          <p style={{ fontSize: '1.2rem', color: '#333' }}>Processing your payment...</p>
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

  if (error) {
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
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>Payment Error</h1>
          <p style={{ color: '#666', marginBottom: '2rem' }}>{error}</p>
          <button 
            onClick={() => router.push('/')}
            style={{
              background: '#f5576c',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

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
        <div style={{ 
          background: '#f8f9fa', 
          padding: '1.5rem', 
          borderRadius: '0.5rem',
          marginBottom: '2rem'
        }}>
          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>Session ID:</p>
          <p style={{ fontSize: '0.85rem', color: '#999', wordBreak: 'break-all' }}>{sessionId}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
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
