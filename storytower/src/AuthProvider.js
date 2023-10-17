import React, { createContext, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ME } from './apolloClient';

const AuthContext = createContext();
const token = localStorage.getItem('token');
const intialLoggedIn = !!token;

const AuthProvider = ({ children }) => {

  // Fetch user data
  const { data, loading, refetch } = useQuery(GET_ME, {
    onCompleted: () => {
      setUser(data.me)
    }
  });
  
  const [user, setUser] = useState(data?.me)
  const [loggedIn, setLoggedIn] = useState(intialLoggedIn);

  const login = (userData) => {
    // Perform login actions and update loggedIn and user
    localStorage.setItem('token', userData.token);
    setUser(userData.user);
    refetch(); // Manually refetch to update user data
    setLoggedIn(true);
  };

  const logout = () => {
    // Perform logout actions and update loggedIn and user
    localStorage.removeItem('token');
    setUser(null);
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
