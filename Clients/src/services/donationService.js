import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.feastofestherna.com/api/v1'
  : 'http://localhost:4000/api/v1';

export const createDonation = async (donationData) => {
  try {
    const response = await axios.post(`${API_URL}/create-donation`, donationData);
    return response.data;
  } catch (error) {
    console.error('Error creating donation:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to process donation'
    };
  }
};

export const createContributionSession = async (contributionData) => {
  try {
    const response = await axios.post(`${API_URL}/create-contribution-session`, contributionData);
    return response.data;
  } catch (error) {
    console.error('Error creating contribution session:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to connect to payment service'
    };
  }
};

export const verifyDonation = async (sessionId) => {
  try {
    const response = await axios.get(`${API_URL}/verify-donation-session`, {
      params: { sessionId }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error verifying donation:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to verify donation'
    };
  }
};
