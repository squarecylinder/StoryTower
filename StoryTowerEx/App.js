// App.js
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './app/apolloClient';
import Index from './app/index';

const App = () => (
  <ApolloProvider client={client}>
    <Index />
  </ApolloProvider>
);

export default App;
