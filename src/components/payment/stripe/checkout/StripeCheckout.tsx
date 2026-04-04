'use client';

import { useState, useEffect, FormEvent } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { paymentApi } from '@/lib/api/payment/paymentApi';

// Load Stripe publishable key outside component to avoid recreating on every render
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

interface CheckoutFormProps {
  orderId: string;
  courseTitle: string;
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * Stripe Payment Form Component
 * Official Stripe React implementation
 */
function CheckoutForm({
  orderId,
  courseTitle,
  amount,
  onSuccess,
  onError,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Confirm payment using Stripe's official method
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?orderId=${orderId}`,
        },
      });

      // This point will only be reached if there is an immediate error when
      // confirming the payment. Otherwise, your customer will be redirected to
      // your `return_url`. For some payment methods like iDEAL, your customer will
      // be redirected to an intermediate site first to authorize the payment, then
      // redirected to the `return_url`.
      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setErrorMessage(error.message || 'Payment failed');
        } else {
          setErrorMessage('An unexpected error occurred.');
        }
        onError?.(error.message || 'Payment failed');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
      onError?.(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-checkout-form">
      <div className="checkout-header">
        <h3>{courseTitle}</h3>
        <p className="amount">₹{amount.toLocaleString()}</p>
      </div>

      <PaymentElement />

      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="pay-button"
      >
        {isProcessing ? 'Processing...' : `Pay ₹${amount.toLocaleString()}`}
      </button>

      <p className="secure-note">
        🔒 Secure payment powered by Stripe
      </p>

      <style jsx>{`
        .stripe-checkout-form {
          max-width: 500px;
          margin: 0 auto;
          padding: 24px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        }

        .checkout-header {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e7eb;
        }

        .checkout-header h3 {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 8px 0;
        }

        .amount {
          font-size: 24px;
          font-weight: 700;
          color: #2563eb;
          margin: 0;
        }

        .error-message {
          margin: 16px 0;
          padding: 12px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
          font-size: 14px;
        }

        .pay-button {
          width: 100%;
          padding: 14px;
          margin-top: 24px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .pay-button:hover:not(:disabled) {
          background: #1d4ed8;
        }

        .pay-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .secure-note {
          margin-top: 16px;
          text-align: center;
          font-size: 13px;
          color: #6b7280;
        }
      `}</style>
    </form>
  );
}

interface StripeCheckoutProps {
  courseId: string;
  userId: string;
  courseTitle: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * Main Stripe Checkout Component
 * Handles order creation and payment flow
 */
export default function StripeCheckout({
  courseId,
  userId,
  courseTitle,
  onSuccess,
  onError,
}: StripeCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    createOrderAndRedirect();
  }, [courseId, userId]);

  const createOrderAndRedirect = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await paymentApi.createOrder(userId, {
        courseId,
        currency: 'usd',
      });

      // Redirect to Stripe Checkout
      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create order');
      onError?.(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-loading">
        <div className="spinner"></div>
        <p>Preparing checkout...</p>

        <style jsx>{`
          .checkout-loading {
            text-align: center;
            padding: 48px;
          }

          .spinner {
            width: 40px;
            height: 40px;
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

          .checkout-loading p {
            color: #6b7280;
            font-size: 14px;
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-error">
        <h3>⚠️ Error</h3>
        <p>{error}</p>
        <button onClick={createOrderAndRedirect} className="retry-button">
          Try Again
        </button>

        <style jsx>{`
          .checkout-error {
            text-align: center;
            padding: 48px;
            background: #fef2f2;
            border-radius: 12px;
          }

          .checkout-error h3 {
            color: #dc2626;
            margin-bottom: 12px;
          }

          .checkout-error p {
            color: #991b1b;
            margin-bottom: 24px;
          }

          .retry-button {
            padding: 10px 24px;
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
          }

          .retry-button:hover {
            background: #1d4ed8;
          }
        `}</style>
      </div>
    );
  }

  if (!clientSecret || !orderId) {
    return null;
  }

  // Elements options - official Stripe configuration
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#2563eb',
        colorBackground: '#ffffff',
        colorText: '#111827',
        colorDanger: '#dc2626',
        fontFamily: 'system-ui, sans-serif',
        borderRadius: '8px',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm
        orderId={orderId}
        courseTitle={courseTitle}
        amount={amount}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}
