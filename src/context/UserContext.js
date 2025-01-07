import React, { createContext, useContext, useState } from 'react';

// Create a context for user data
const UserContext = createContext(null);

// UserContext provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user object here

  // Function to set user after login
  const loginUser = (userData) => {
    setUser(userData);
  };

  // Function to logout user
  const logoutUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access user data in any component
export const useUser = () => useContext(UserContext);
