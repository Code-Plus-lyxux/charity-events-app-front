import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
//const API_URL = 'http://10.0.3.2:5001';
import { API_URL } from '../constants/api';


// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, userData);
    console.log('API Response:', process.env.API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error };  
} finally {
};
}

// Login a user
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
    console.log('API Response:', response.data);
    const { token, userId } = response.data;

    try {
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', userId);
    } catch (error) {
      console.error('Failed to store data in AsyncStorage:', error);
      throw new Error('Unable to store login details. Please try again.');
    }
    console.log('Token:', token, 'User ID:', userId);

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Server Error:', error.response.data.message);
      throw new Error(error.response.data.message);
    } else if (error.request) {
      console.error('Network Error:', error.message);
      throw new Error('Network error. Please check your connection.');
    } else {
      console.error('Error:', error.message);
      throw new Error('An unexpected error occurred.');
    }
  }
};

//Send OTP
export const sendResetOTP = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/password/reset`, { email });
    return response.data;
  } catch (error) {
    console.error('Error sending reset OTP:', error.response?.data?.error || error.message);
    throw error.response?.data || { error: 'Failed to send OTP.' };
  }
}


// verify OTP
export const verifyOTP = async (email, otp) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/password/verify`, { email, otp });
    return response.data;
  } catch (error) {
    const backendError = error.response?.data;
    console.error('Error verifying OTP:', backendError?.error || error.message);

    if (backendError?.code === 'INVALID_OTP') {
      throw new Error('The OTP entered is invalid. Please check and try again.');
    }

    if (backendError?.code === 'OTP_EXPIRED') {
      throw new Error('The OTP has expired. Please request a new OTP.');
    }

    throw new Error(backendError?.error || 'Failed to verify OTP. Please try again later.');
  }
};




// Reset a user's password
export const resetPassword = async (email, password) => {
  try {
    if (!password) {
      throw new Error('Password is required');
    }
    const response = await axios.post(`${API_URL}/api/auth/password/change`, {
      email,
      newPassword : password,
    });

    const { message } = response.data;
    console.log(message);
    return message;

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('An error occurred while resetting the password');
    }
  }
};

