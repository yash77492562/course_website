import { logger } from '@/lib/utils/logger';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

interface CreateOrderRequest {
  courseId: string;
  currency?: string;
}

interface CreateOrderResponse {
  success: boolean;
  orderId: string;
  clientSecret: string;
  paymentIntentId: string;
  checkoutUrl?: string; // Stripe Checkout URL
  order: {
    id: string;
    amount: number;
    currency: string;
    course: {
      title: string;
      thumbnail: string;
      instructor: string;
      price: number;
    };
  };
}

interface OrderDetails {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  currency: string;
  paymentIntentId: string;
  paymentStatus: string;
  orderStatus: string;
  metadata: any;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
  failedAt: string | null;
  course: {
    title: string;
    thumbnail: string;
    instructor: string;
  };
  payments: Array<{
    id: string;
    orderId: string;
    paymentIntentId: string;
    chargeId: string | null;
    amount: number;
    currency: string;
    status: string;
    invoiceUrl: string | null;
    invoicePdf: string | null;
    errorMessage: string | null;
    errorCode: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
}

class PaymentApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Create order and get Stripe client secret
   */
  async createOrder(
    userId: string,
    data: CreateOrderRequest
  ): Promise<CreateOrderResponse> {
    const url = `${this.baseURL}/payment/stripe/create-order`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create order');
      }

      return await response.json();
    } catch (error) {
      logger.error('Create order failed:', error);
      throw error;
    }
  }

  /**
   * Get order details
   */
  async getOrder(orderId: string): Promise<OrderDetails> {
    const url = `${this.baseURL}/payment/stripe/order/${orderId}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }

      return await response.json();
    } catch (error) {
      logger.error('Get order failed:', error);
      throw error;
    }
  }

  /**
   * Get user's orders
   */
  async getUserOrders(userId: string): Promise<OrderDetails[]> {
    const url = `${this.baseURL}/payment/stripe/orders/user/${userId}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch user orders');
      }

      return await response.json();
    } catch (error) {
      logger.error('Get user orders failed:', error);
      throw error;
    }
  }

  /**
   * Get user's purchase history
   */
  async getPurchaseHistory(userId: string): Promise<any[]> {
    const url = `${this.baseURL}/payment/stripe/purchase-history/${userId}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch purchase history');
      }

      return await response.json();
    } catch (error) {
      logger.error('Get purchase history failed:', error);
      throw error;
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentIntentId: string): Promise<any> {
    const url = `${this.baseURL}/payment/stripe/status/${paymentIntentId}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch payment status');
      }

      return await response.json();
    } catch (error) {
      logger.error('Get payment status failed:', error);
      throw error;
    }
  }

  /**
   * Get order status for polling (Step 5)
   * Returns: { orderId, status: 'pending' | 'paid' | 'failed', paidAt }
   */
  async getOrderStatus(orderId: string): Promise<{
    orderId: string;
    status: 'pending' | 'paid' | 'failed';
    paidAt: string | null;
    failedAt: string | null;
    amount: number;
    currency: string;
  }> {
    const url = `${this.baseURL}/payment/stripe/order/${orderId}/status`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch order status');
      }

      return await response.json();
    } catch (error) {
      logger.error('Get order status failed:', error);
      throw error;
    }
  }
}

export const paymentApi = new PaymentApiClient(API_BASE_URL);
