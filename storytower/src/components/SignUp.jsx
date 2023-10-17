import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../apolloClient';

const SignUp = () => {
    const [createUser] = useMutation(CREATE_USER);

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
            console.log('User created:', data.createUser);
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
                {/* <button onClick={handleSignUp}>Sign Up</button> */}
                <button type='submit'>Sign up</button>
            </form>
        </div>
    );
};

export default SignUp;
