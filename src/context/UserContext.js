import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLoggedUser } from '../api/user'; 

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeUser = async () => {
            try {
                const fetchedUser = await getLoggedUser();
                setUser(fetchedUser);
            } catch (error) {
                console.error('Error initializing user:', error.message);
                // Handle user not logged in or API failure
            } finally {
                setLoading(false);
            }
        };

        initializeUser();
    }, []);

    const loginUser = async (userData, token) => {
        try {
            setUser(userData);
            await AsyncStorage.setItem('userId', userData._id); // Assuming userData has an `id` field
            await AsyncStorage.setItem('token', token);
        } catch (error) {
            console.error('Failed to save user:', error);
        }
    };

    const logoutUser = async () => {
        try {
            setUser(null);
            await AsyncStorage.removeItem('userId');
            await AsyncStorage.removeItem('token');
        } catch (error) {
            console.error('Failed to clear user data:', error);
        }
    };

    return (
        <UserContext.Provider value={{ user, loginUser, logoutUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};
