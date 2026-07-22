'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/auth/useAuth';
import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Footer } from '@/components/layout/Footer/Footer';
import { PurchaseHistoryCard } from '@/components/features/PurchaseHistory/PurchaseHistoryCard';
import footerLinksData from '@/data/footerLinks/data.json';
import { logger } from '@/lib/utils/logger';

interface Payment {
  paymentId: string;
  orderId: string;
  paymentIntentId: string;
  chargeId: string;
  amount: number;
  currency: string;
  status: string;
  invoiceUrl: string | null;
  createdAt: string;
  course: {
    id: string;
    title: string;
    thumbnail: string | null;
    instructor: string;
  };
}

export function PurchaseHistoryPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadPurchaseHistory();
    }
  }, [isAuthenticated]);

  const loadPurchaseHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;
      const response = await fetch(`${apiUrl}/payments/user/all`, {
        credentials: 'include', // httpOnly access-token cookie carries auth
      });

      if (!response.ok) {
        throw new Error(`Failed to load purchase history: ${response.status}`);
      }

      const result = await response.json();
      const data = result.data || result;
      
      setPayments(data.transactions || []);
    } catch (err) {
      logger.error('Failed to load purchase history:', err);
      setError('Failed to load your purchase history');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <>
        <Navbar />
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(160deg, #050d1f 0%, #0d1f40 60%, #0a2240 100%)'
        }}>
          <div className="h-[68px]" />
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>Checking authentication...</p>
            </div>
          </div>
        </div>
        <Footer footerData={footerLinksData} />
      </>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #050d1f 0%, #0d1f40 60%, #0a2240 100%)'
      }}>
        <div className="h-[68px]" />
        
        <div style={{ padding: '80px 5vw 80px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Page Header */}
            <div className="text-center" style={{ marginBottom: '50px' }}>
              <div style={{
                display: 'inline-block',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                color: '#0ea5e9',
                border: '1px solid rgba(14,165,233,0.3)',
                backgroundColor: 'rgba(14,165,233,0.1)',
                marginBottom: '24px'
              }}>
                Your Transactions
              </div>
              <h1 style={{
                fontSize: '42px',
                fontWeight: 700,
                color: 'white',
                marginBottom: '24px',
                fontFamily: 'Syne, sans-serif',
                letterSpacing: '-0.5px'
              }}>
                Purchase History
              </h1>
              <p style={{
                fontSize: '17px',
                color: 'rgba(255,255,255,0.7)',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: '1.6'
              }}>
                View all your course purchases and download invoices
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p style={{ color: 'rgba(255,255,255,0.7)' }}>Loading your purchase history...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center mb-8">
                <div style={{
                  color: '#ef4444',
                  marginBottom: '16px',
                  padding: '12px',
                  background: 'rgba(239,68,68,0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(239,68,68,0.3)'
                }}>
                  {error}
                </div>
                <button 
                  onClick={loadPurchaseHistory}
                  style={{
                    background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                    color: 'white',
                    padding: '10px 24px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Payments List */}
            {!loading && !error && (
              <>
                {payments.length === 0 ? (
                  <div className="text-center py-12">
                    <div style={{
                      fontSize: '64px',
                      marginBottom: '24px'
                    }}>
                      💳
                    </div>
                    <p style={{
                      fontSize: '18px',
                      color: 'rgba(255,255,255,0.6)',
                      marginBottom: '8px'
                    }}>
                      No purchase history yet
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.4)',
                      marginBottom: '24px'
                    }}>
                      Your course purchases will appear here
                    </p>
                    <button
                      onClick={() => router.push('/courses')}
                      style={{
                        background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                        color: 'white',
                        padding: '12px 28px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 500,
                        fontSize: '0.95rem'
                      }}
                    >
                      Browse Courses
                    </button>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '20px'
                  }}>
                    {payments.map((payment) => (
                      <PurchaseHistoryCard key={payment.paymentId} payment={payment} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer footerData={footerLinksData} />
    </>
  );
}
