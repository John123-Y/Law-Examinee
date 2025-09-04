// public/js/payment.ts
import axios, { AxiosResponse } from 'axios';

// Interface for API responses
interface ApiResponse {
  message: string | string[];
  data?: {
    authorization_url: string;
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const token: string | null = localStorage.getItem('token');
  if (!token) {
    alert('Please log in to make a payment');
    window.location.href = '/api/auth/login';
    return;
  }

  const paymentForm: HTMLFormElement | null = document.getElementById('paymentForm') as HTMLFormElement;

  // Helper function to format message for display
  const formatMessage = (message: string | string[]): string => {
    return Array.isArray(message) ? message.join(', ') : message;
  };

  if (paymentForm) {
    paymentForm.addEventListener('submit', async (e: Event) => {
      e.preventDefault();
      const formData: FormData = new FormData(paymentForm);
      const data: {
        amount: number;
        email: FormDataEntryValue | null;
      } = {
        amount: Number(formData.get('amount')),
        email: formData.get('email')
      };
      try {
        const response: AxiosResponse<ApiResponse> = await axios.post('/api/payments/pay', data, {
          headers: { Authorization: Bearer ${token} }
        });
        if (response.data.data?.authorization_url) {
          window.location.href = response.data.data.authorization_url;
        } else {
          alert(formatMessage(response.data.message));
        }
      } catch (error: any) {
        alert(formatMessage(error.response?.data?.message || 'Failed to initiate payment'));
      }
    });
  }
});