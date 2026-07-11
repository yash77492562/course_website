'use client';

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

interface PurchaseHistoryCardProps {
  payment: Payment;
}

export function PurchaseHistoryCard({ payment }: PurchaseHistoryCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SUCCEEDED':
        return '#10b981';
      case 'PENDING':
        return '#f59e0b';
      case 'FAILED':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SUCCEEDED':
        return 'Completed';
      case 'PENDING':
        return 'Pending';
      case 'FAILED':
        return 'Failed';
      default:
        return status;
    }
  };

  const handleDownloadInvoice = () => {
    if (payment.invoiceUrl) {
      logger.debug('📄 Opening invoice URL:', payment.invoiceUrl);
      // Stripe receipt URLs work as-is
      window.open(payment.invoiceUrl, '_blank');
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'box-shadow 0.2s',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    }}
    >
      {/* Course Title and Instructor */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: '#111827',
          marginBottom: '6px',
          fontFamily: 'Syne, sans-serif',
          lineHeight: '1.4'
        }}>
          {payment.course.title}
        </h3>
        <p style={{
          fontSize: '13px',
          color: '#6b7280'
        }}>
          by {payment.course.instructor}
        </p>
      </div>

      {/* Payment Details Grid */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '16px',
        flex: 1
      }}>
        <div>
          <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Date
          </p>
          <p style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>
            {formatDate(payment.createdAt)}
          </p>
        </div>

        <div>
          <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Amount
          </p>
          <p style={{ fontSize: '13px', color: '#374151', fontWeight: 600 }}>
            {formatAmount(payment.amount, payment.currency)}
          </p>
        </div>

        <div>
          <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Status
          </p>
          <span style={{
            display: 'inline-block',
            padding: '3px 10px',
            borderRadius: '10px',
            fontSize: '11px',
            fontWeight: 600,
            color: 'white',
            background: getStatusColor(payment.status)
          }}>
            {getStatusText(payment.status)}
          </span>
        </div>

        <div>
          <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Order ID
          </p>
          <p style={{ fontSize: '11px', color: '#6b7280', fontFamily: 'monospace' }}>
            {payment.orderId.substring(0, 12)}...
          </p>
        </div>
      </div>

      {/* Download Invoice Button */}
      <div style={{ marginTop: 'auto' }}>
        {payment.status.toUpperCase() === 'SUCCEEDED' && payment.invoiceUrl ? (
          <button
            onClick={handleDownloadInvoice}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '10px 16px',
              background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 2px 8px rgba(14,165,233,0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(14,165,233,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(14,165,233,0.3)';
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Invoice
          </button>
        ) : (
          <div style={{
            padding: '10px 16px',
            background: '#f3f4f6',
            color: '#9ca3af',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            textAlign: 'center'
          }}>
            No Invoice
          </div>
        )}
      </div>
    </div>
  );
}
