import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.feastofestherna.com/api/v1'
  : 'http://localhost:4000/api/v1';

export const createPayPalOrder = async (paymentData) => {
  try {
    const response = await axios.post(`${API_URL}/create-paypal-orders`, paymentData);
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to create PayPal order');
    }
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to connect to PayPal service'
    };
  }
};

export const capturePayPalOrder = async (orderId) => {
  try {
    const response = await axios.post(`${API_URL}/verify-paypal-payment`, { 
      token: orderId 
    });
    
    return response.data;
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to complete PayPal payment'
    };
  }
};
