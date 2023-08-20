// App.js
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './app/apolloClient';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './app/AppNavigator';

const App = () => (
  <ApolloProvider client={client}>
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  </ApolloProvider>
);

export default App;
