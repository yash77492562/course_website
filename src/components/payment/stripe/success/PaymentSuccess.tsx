'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { paymentApi } from '@/lib/api/payment/paymentApi';

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId') || null;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    } else {
      setError('No order ID provided');
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const orderData = await paymentApi.getOrder(orderId!);
      setOrder(orderData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-success-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Verifying payment...</p>
        </div>

        <style jsx>{`
          .payment-success-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            background: #f9fafb;
          }

          .loading {
            text-align: center;
          }

          .spinner {
            width: 48px;
            height: 48px;
            margin: 0 auto 16px;
            border: 4px solid #e5e7eb;
            border-top-color: #2563eb;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          .loading p {
            color: #6b7280;
          }
        `}</style>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="payment-success-container">
        <div className="error-card">
          <div className="error-icon">⚠️</div>
          <h2>Unable to verify payment</h2>
          <p>{error || 'Order not found'}</p>
          <a href="/" className="btn-primary">
            Go to Home
          </a>
        </div>

        <style jsx>{`
          .payment-success-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            background: #f9fafb;
          }

          .error-card {
            max-width: 500px;
            padding: 48px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
            text-align: center;
          }

          .error-icon {
            font-size: 64px;
            margin-bottom: 24px;
          }

          .error-card h2 {
            font-size: 24px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 12px;
          }

          .error-card p {
            color: #6b7280;
            margin-bottom: 32px;
          }

          .btn-primary {
            display: inline-block;
            padding: 12px 32px;
            background: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: background 0.2s;
          }

          .btn-primary:hover {
            background: #1d4ed8;
          }
        `}</style>
      </div>
    );
  }

  const isSuccess = order.paymentStatus === 'SUCCEEDED';
  const isPending = order.paymentStatus === 'PENDING' || order.paymentStatus === 'PROCESSING';
  const isFailed = order.paymentStatus === 'FAILED' || order.paymentStatus === 'CANCELED';

  return (
    <div className="payment-success-container">
      <div className="success-card">
        {isSuccess && (
          <>
            <div className="success-icon">✅</div>
            <h1>Payment Successful!</h1>
            <p className="subtitle">
              Thank you for enrolling in {order.course.title}
            </p>

            <div className="order-details">
              <div className="detail-row">
                <span className="label">Order ID:</span>
                <span className="value">{order.id}</span>
              </div>
              <div className="detail-row">
                <span className="label">Amount Paid:</span>
                <span className="value">₹{order.amount.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span className="label">Status:</span>
                <span className="value status-success">Completed</span>
              </div>
              <div className="detail-row">
                <span className="label">Date:</span>
                <span className="value">
                  {new Date(order.paidAt || order.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="actions">
              <a href="/courses" className="btn-primary">
                View My Courses
              </a>
              {order.payments[0]?.invoiceUrl && (
                <a
                  href={order.payments[0].invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Download Receipt
                </a>
              )}
            </div>

            <p className="note">
              You will receive a confirmation email shortly with course access details.
            </p>
          </>
        )}

        {isPending && (
          <>
            <div className="pending-icon">⏳</div>
            <h1>Payment Processing</h1>
            <p className="subtitle">
              Your payment is being processed. This may take a few moments.
            </p>

            <div className="order-details">
              <div className="detail-row">
                <span className="label">Order ID:</span>
                <span className="value">{order.id}</span>
              </div>
              <div className="detail-row">
                <span className="label">Status:</span>
                <span className="value status-pending">Processing</span>
              </div>
            </div>

            <button onClick={fetchOrderDetails} className="btn-primary">
              Refresh Status
            </button>
          </>
        )}

        {isFailed && (
          <>
            <div className="failed-icon">❌</div>
            <h1>Payment Failed</h1>
            <p className="subtitle">
              {order.payments[0]?.errorMessage || 'Your payment could not be processed'}
            </p>

            <div className="actions">
              <a href={`/course/${order.courseId}`} className="btn-primary">
                Try Again
              </a>
              <a href="/" className="btn-secondary">
                Go to Home
              </a>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .payment-success-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .success-card {
          max-width: 600px;
          width: 100%;
          padding: 48px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          text-align: center;
        }

        .success-icon,
        .pending-icon,
        .failed-icon {
          font-size: 80px;
          margin-bottom: 24px;
        }

        h1 {
          font-size: 32px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 12px;
        }

        .subtitle {
          font-size: 18px;
          color: #6b7280;
          margin-bottom: 32px;
        }

        .order-details {
          background: #f9fafb;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 32px;
          text-align: left;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .label {
          font-weight: 600;
          color: #6b7280;
        }

        .value {
          color: #111827;
          font-weight: 500;
        }

        .status-success {
          color: #10b981;
        }

        .status-pending {
          color: #f59e0b;
        }

        .actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-bottom: 24px;
        }

        .btn-primary,
        .btn-secondary {
          padding: 14px 32px;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          border: none;
          cursor: pointer;
          font-size: 16px;
        }

        .btn-primary {
          background: #2563eb;
          color: white;
        }

        .btn-primary:hover {
          background: #1d4ed8;
        }

        .btn-secondary {
          background: white;
          color: #2563eb;
          border: 2px solid #2563eb;
        }

        .btn-secondary:hover {
          background: #eff6ff;
        }

        .note {
          font-size: 14px;
          color: #6b7280;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
