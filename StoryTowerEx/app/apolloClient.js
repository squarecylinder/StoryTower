// apolloClient.js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://192.168.1.70:3001/graphql', // Replace with your server's URL
  cache: new InMemoryCache(),
});

export default client;
