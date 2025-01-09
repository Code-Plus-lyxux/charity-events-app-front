import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_URL = 'http://10.0.2.2:5001';


export const fetchEvents = async (status, page, pageSize) => {
    try {
        const token = await AsyncStorage.getItem('token');
        console.log('Token', token);

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


/**
 * Fetch event details by ID
 * @param {string} id - The ID of the event to fetch
 * @returns {Promise<object>} - The event details
 */
export const getEventById = async (eventId) => {
    try {
        console.log(`Fetching event with ID: ${eventId}`);

        const token = await AsyncStorage.getItem('token');

        if (!token) {
            throw new Error('No token found');
        }

        const response = await axios.get(`${API_URL}/api/events/${eventId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        console.log("Event fetched successfully:", response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error("Error response:", error.response.data);
            throw new Error(error.response.data.message || "Failed to fetch event");
        } else {
            console.error("Network error:", error.message);
            throw new Error("An error occurred while fetching the event");
        }
    }
};


// Add a comment to an event
export const addCommentToEvent = async (eventId, comment) => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        const response = await axios.post(
            `${API_URL}/api/events/add-comment/${eventId}`,
            { comment },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data.event;
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
};


export const addUserToEvent = async (eventId, userId) => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        const response = await fetch(`${API_URL}/api/events/${eventId}/attend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            const data = await response.json();
            console.error('Failed to add user to event:', { status: response.status, data });
            throw new Error(data.message || 'Failed to add user to event');
        }

        const data = await response.json();
        return data.event;
    } catch (err) {
        console.error('Error adding user to event:', err.message);
        throw new Error(err.message || 'An error occurred while adding the user to the event');
    }
};


//Remove user from event
export const removeUserFromEvent = async (eventId) => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }
        const response = await axios.delete(`${API_URL}/api/events/${eventId}/attend`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        console.log(response.data.message);
        return response.data.event;
    } catch (error) {
        console.error("Error removing user from event:", error.response?.data?.message || error.message);
        alert("Failed to remove user from event");
    }
};