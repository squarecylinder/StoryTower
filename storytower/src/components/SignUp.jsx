import React, { useContext, useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_USER, LOGIN_USER } from '../apolloClient';
import { AuthContext } from '../AuthProvider'

const SignUp = () => {
  const { login } = useContext(AuthContext);
  const [loginUser] = useMutation(LOGIN_USER);
  const [createUser, { error }] = useMutation(CREATE_USER);

  const [userData, setUserData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createUser({
        variables: {
          email: userData.email,
          username: userData.username,
          password: userData.password,
        },
      });

      if (data && data.createUser) {
        try {
          const { data } = await loginUser({
            variables: {
              identifier: userData.username,
              password: userData.password
            },
          });
          if (data){
            login(data.loginUser)
            window.location.replace('/comics/genre/All/1')
          }
        } catch (error) {
          console.error('Error logging in:', error.message);
        }
      } else {
        console.error('Error creating user: No valid response received.');
      }
    } catch (error) {
      console.error('Error creating user:', error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSignUp} >
        <input
          type="text"
          placeholder="Email"
          name="email"
          value={userData.email}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Username"
          name="username"
          value={userData.username}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={userData.password}
          onChange={handleChange}
        />
        <button type='submit'>Sign up</button>
      </form>
      {error && (
        <div>
          <p>{error.message}</p>
        </div>
      )}
    </div>
  );
};

export default SignUp;
