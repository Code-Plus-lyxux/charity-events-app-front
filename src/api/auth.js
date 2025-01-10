import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_URL = 'http://10.0.3.2:5001';

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, userData);
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
    const {token, userId} = response.data; 

    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('userId', userId);

    console.log('Token:', token, 'user::', userId);

    return response.data;
    
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('An error occurred while logging in');
    }
  }
};



// Reset a user's password
export const resetPassword = async (email, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/password/change`, {
      email,
      newPassword,
    });

    // Assuming the response contains a message indicating success
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

