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

  const getStatusColorClass = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SUCCEEDED':
        return 'bg-emerald-500';
      case 'PENDING':
        return 'bg-amber-500';
      case 'FAILED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
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
    <div className="group bg-white rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-shadow duration-200 flex flex-col h-full hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
      {/* Course Title and Instructor */}
      <div className="mb-4">
        <h3 className="text-[16px] font-bold text-gray-900 mb-1.5 font-sans leading-snug">
          {payment.course.title}
        </h3>
        <p className="text-[13px] text-gray-500">
          by {payment.course.instructor}
        </p>
      </div>

      {/* Payment Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 flex-1">
        <div>
          <p className="text-[11px] text-gray-400 mb-1 uppercase tracking-[0.5px]">
            Date
          </p>
          <p className="text-[13px] text-gray-700 font-medium">
            {formatDate(payment.createdAt)}
          </p>
        </div>

        <div>
          <p className="text-[11px] text-gray-400 mb-1 uppercase tracking-[0.5px]">
            Amount
          </p>
          <p className="text-[13px] text-gray-700 font-semibold">
            {formatAmount(payment.amount, payment.currency)}
          </p>
        </div>

        <div>
          <p className="text-[11px] text-gray-400 mb-1 uppercase tracking-[0.5px]">
            Status
          </p>
          <span className={`inline-block px-2.5 py-[3px] rounded-[10px] text-[11px] font-semibold text-foreground ${getStatusColorClass(payment.status)}`}>
            {getStatusText(payment.status)}
          </span>
        </div>

        <div>
          <p className="text-[11px] text-gray-400 mb-1 uppercase tracking-[0.5px]">
            Order ID
          </p>
          <p className="text-[11px] text-gray-500 font-mono">
            {payment.orderId.substring(0, 12)}...
          </p>
        </div>
      </div>

      {/* Download Invoice Button */}
      <div className="mt-auto">
        {payment.status.toUpperCase() === 'SUCCEEDED' && payment.invoiceUrl ? (
          <button
            onClick={handleDownloadInvoice}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-primary hover:bg-primary/90 shadow-sm text-foreground border-none rounded-lg cursor-pointer text-[13px] font-medium transition-all duration-200 shadow-[0_2px_8px_rgba(14,165,233,0.3)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(14,165,233,0.4)]"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Invoice
          </button>
        ) : (
          <div className="py-2.5 px-4 bg-gray-100 text-gray-400 rounded-lg text-[13px] font-medium text-center">
            No Invoice
          </div>
        )}
      </div>
    </div>
  );
}
