'use client';

import { useRouter } from 'next/navigation';

export default function PaymentCancelPage() {
  const router = useRouter();

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
        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>❌</div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#333' }}>Payment Cancelled</h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
          Your payment was cancelled. No charges were made.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            onClick={() => router.back()}
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
            Try Again
          </button>
          <button 
            onClick={() => router.push('/')}
            style={{
              background: 'transparent',
              color: '#f5576c',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              border: '2px solid #f5576c',
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
