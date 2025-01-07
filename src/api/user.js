import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_URL = 'http://10.0.2.2:5001';

/**
 * Fetch user by ID
 * @returns {Promise<object>} - The user's details
 */
export const getLoggedUser = async () => {
    try {
      // Retrieve token and userId
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');

      console.log('Token:', token, userId);
  
      if (!token) {
        throw new Error('No token, authorization denied from front');
      }
      if (!userId) {
        throw new Error('User ID not found in storage');
      }
  
      // Make API request with Authorization header
      const response = await axios.get(`${API_URL}/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.data;

    } catch (error) {
      if (error.response) {
        console.error(`API Error: ${error.response.status} - ${error.response.data.message}`);
      } else {
        console.error('Network Error:', error.message);
      }
      throw new Error('Failed to fetch user');
    }
  };
  