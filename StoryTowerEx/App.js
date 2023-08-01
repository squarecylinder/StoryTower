import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import App from './app/App';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://192.168.1.70:3001/graphql', // Replace with the correct API endpoint for your Apollo Server
  }),
});

const App = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

export default App;
