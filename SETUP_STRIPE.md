# Frontend Stripe Setup

## 1. Install Dependencies

```bash
cd frontend
npm install @stripe/stripe-js @stripe/react-stripe-js
```

## 2. Create Environment File

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3002/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51T7LdLRQS35ZvArNrKl6R1ByWttZDqu32bWgT5l3r1JTRjnbKB9sP28uXcwoZBUTXiWdeVzigjxx3h2NjztWeOeQ00sNK3PS3J
```

## 3. Files Created

✅ `src/lib/api/paymentApi.ts` - Payment API client
✅ `src/components/payment/stripe/checkout/StripeCheckout.tsx` - Checkout component
✅ `src/components/payment/stripe/success/PaymentSuccess.tsx` - Success page

## 4. Usage Example

Replace your hardcoded Stripe checkout URL with:

```tsx
'use client';

import { useState } from 'react';
import StripeCheckout from '@/components/payment/stripe/checkout/StripeCheckout';

export default function CoursePaymentButton({ course, userId }: { course: any; userId: string }) {
  const [showCheckout, setShowCheckout] = useState(false);

  if (showCheckout) {
    return (
      <div className="checkout-container">
        <button 
          onClick={() => setShowCheckout(false)}
          className="back-button"
        >
          ← Back
        </button>
        
        <StripeCheckout
          courseId={course.id}
          userId={userId}
          courseTitle={course.title}
          onSuccess={() => {
            // Payment successful - redirect to courses
            window.location.href = '/my-courses';
          }}
          onError={(error) => {
            console.error('Payment error:', error);
            alert('Payment failed: ' + error);
          }}
        />
      </div>
    );
  }

  return (
    <button 
      onClick={() => setShowCheckout(true)}
      className="btn-primary"
    >
      Pay Now - ₹{course.price.toLocaleString()}
    </button>
  );
}
```

## 5. Create Success Page Route

Create `frontend/src/app/payment/success/page.tsx`:

```tsx
import PaymentSuccess from '@/components/payment/stripe/success/PaymentSuccess';

export default function PaymentSuccessPage() {
  return <PaymentSuccess />;
}
```

## 6. Test the Integration

1. Start backend: `cd backend && npm run start:dev`
2. Start frontend: `cd frontend && npm run dev`
3. Navigate to a course page
4. Click "Pay Now"
5. Use test card: `4242 4242 4242 4242`
6. Any future date for expiry
7. Any 3-digit CVC

## 7. Stripe Test Cards

```
✅ Success: 4242 4242 4242 4242
❌ Decline: 4000 0000 0000 0002
🔐 3D Secure: 4000 0025 0000 3155
```

## 8. Monitor Payments

- Stripe Dashboard: https://dashboard.stripe.com/test/payments
- Backend logs: Check console for payment events
- Database: Check `orders` and `payments` collections

## Done!

Your payment integration is complete with:
- ✅ Dynamic pricing from database
- ✅ Secure Stripe checkout
- ✅ Payment status tracking
- ✅ Success/failure handling
- ✅ Invoice generation
- ✅ Course enrollment on success
