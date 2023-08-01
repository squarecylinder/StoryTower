import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import Index from './app/index';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://192.168.1.70:3001/graphql', // Replace with the correct API endpoint for your Apollo Server
  }),
});

const App = () => (
  <ApolloProvider client={client}>
    <Index />
  </ApolloProvider>
);

export default App;
