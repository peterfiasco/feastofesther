import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.feastofestherna.com/api/v1/stripe'
  : 'http://localhost:4000/api/v1/stripe';

export const createPaymentSession = async (registrationData) => {
  try {
    console.log('Creating payment session with data:', registrationData);
    const response = await axios.post(`${API_URL}/create-checkout-session`, registrationData);
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to create payment session');
    }
  } catch (error) {
    console.error('Error creating payment session:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to connect to payment service'
    };
  }
};

export const verifyPayment = async (sessionId) => {
  try {
    const response = await axios.get(`${API_URL}/verify-session`, {
      params: { sessionId }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to verify payment'
    };
  }
};
