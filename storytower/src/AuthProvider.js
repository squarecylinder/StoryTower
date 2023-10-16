import React, { createContext, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ME } from './apolloClient';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

  // Fetch user data
  const { data, refetch } = useQuery(GET_ME);

  // Use data?.me to access user data
  const user = data?.me;
  const [loggedIn, setLoggedIn] = useState(!!user);

  const login = (userData) => {
    // Perform login actions and update loggedIn and user
    localStorage.setItem('token', userData.token);
    refetch(); // Manually refetch to update user data
    setLoggedIn(true);
  };

  const logout = () => {
    // Perform logout actions and update loggedIn and user
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
