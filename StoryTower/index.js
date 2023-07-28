/**
 * @format
 */

import React from 'react';
import { AppRegistry } from 'react-native';
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import App from './src/App';
import { name as appName } from './src/app.json';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://192.168.1.70:3001/graphql', // Replace with the correct API endpoint for your Apollo Server
  }),
});

const RootComponent = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

AppRegistry.registerComponent(appName, () => RootComponent);
