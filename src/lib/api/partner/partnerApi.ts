const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export interface PartnerFormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  expertise: string;
  experience: string;
  linkedIn?: string;
  portfolio?: string;
  teachingInterest: string;
  message: string;
}

export const partnerApi = {
  submitPartner: async (data: PartnerFormData) => {
    const response = await fetch(`${API_URL}/partner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit partner application');
    }

    return response.json();
  },
};
