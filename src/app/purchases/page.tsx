'use client';

import { logger } from '@/lib/utils/logger';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/auth/useAuth';
import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Footer } from '@/components/layout/Footer/Footer';
import footerLinksData from '@/data/footerLinks/data.json';

export default function PurchasesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      logger.debug('❌ Not authenticated, redirecting to login...');
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#fafafa]">
          <div className="h-[68px]" />
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Checking authentication...</p>
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
      <div className="min-h-screen bg-[#fafafa]">
        <div className="h-[68px]" />
        
        <div style={{ padding: '80px 5vw' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="text-center mb-12">
              <div style={{
                display: 'inline-block',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                color: '#0ea5e9',
                border: '1px solid rgba(14,165,233,0.2)',
                backgroundColor: 'rgba(14,165,233,0.05)',
                marginBottom: '16px'
              }}>
                Your Orders
              </div>
              <h1 style={{
                fontSize: '36px',
                fontWeight: 700,
                color: '#1a1a1a',
                marginBottom: '16px',
                fontFamily: 'Syne, sans-serif'
              }}>
                Purchase History
              </h1>
              <p style={{
                fontSize: '16px',
                color: '#666',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                View your purchase history and download invoices
              </p>
            </div>
            
            <div className="text-center text-gray-600 py-12">
              <p className="text-lg mb-2">Your purchase history will appear here</p>
              <p className="text-sm">All your course purchases and invoices in one place</p>
            </div>
          </div>
        </div>
      </div>
      <Footer footerData={footerLinksData} />
    </>
  );
}
