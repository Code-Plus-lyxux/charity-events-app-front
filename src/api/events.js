import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_URL = 'http://10.0.2.2:5001';

export const fetchEvents = async (status, page, pageSize) => {
    try {
        const token = await AsyncStorage.getItem('token');
        console.log('Token::edf', token);

        if (!token) {
            throw new Error('No token found');
        }

        const response = await axios.get(`${API_URL}/api/events`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { status, page, pageSize },
        });
        console.log('Request URL:', `${API_URL}/api/events`);
        console.log('Headers:', { Authorization: `Bearer ${token}` });
        console.log('Params:', { status, page, pageSize });



        return response.data;
    } catch (error) {
        console.error('Error fetching events:', error);

        if (error.response) {
            console.error('Error response data:', error.response.data);
        } else {
            console.error('Network or other error:', error);
        }

        throw error;
    }
};

