import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../apolloClient'; // Define your login mutation

const Login = () => {
  const [loginUser] = useMutation(LOGIN_USER);

  const [userData, setUserData] = useState({
    identifier: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({
        variables: {
          identifier: userData.identifier,
          password: userData.password,
        },
      });

      if (data && data.loginUser) {
        console.log('User logged in:', data.loginUser);
      } else {
        console.error('Error logging in: No valid response received.');
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Email or Username"
          name="identifier"
          value={userData.identifier}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={userData.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
