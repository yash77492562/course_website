export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    createdAt: string;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

class ContactApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Submit contact form
   */
  async submitContact(data: ContactFormData): Promise<ContactResponse> {
    console.log('📧 Submitting contact form...');
    const response = await fetch(`${this.baseURL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error('❌ Contact form submission failed:', result.message);
      throw new Error(result.message || 'Failed to submit contact form');
    }

    console.log('✅ Contact form submitted successfully');
    return result;
  }
}

export const contactApi = new ContactApiClient(API_BASE_URL);
