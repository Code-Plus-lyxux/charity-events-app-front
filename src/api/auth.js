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

    console.log('Tokenfr:', token, 'user::', userId);

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

