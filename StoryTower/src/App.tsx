import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, useQuery, gql } from '@apollo/client';

const App = () => {
  // Set up the Apollo Client
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: 'http://192.168.1.70:3001/graphql', // Replace with the correct API endpoint for your Apollo Server
    }),
  });

  // GraphQL query to fetch the scraped data
  const GET_SCRAPED_DATA = gql`
    query {
      scrapedData
    }
  `;

  // Custom hook to fetch the data
  const { loading, error, data, refetch } = useQuery(GET_SCRAPED_DATA);

  const handleRefresh = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <ApolloProvider client={client}>
      <SafeAreaView style={styles.container}>
        <View style={styles.refreshButtonContainer}>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <Text style={styles.buttonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          <ScrollView style={styles.scrollContainer}>
            <Text style={styles.title}>Scraped Data:</Text>
            {loading ? <Text>Loading...</Text> : <Text>{data?.scrapedData}</Text>}
          </ScrollView>
        </View>
      </SafeAreaView>
    </ApolloProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  refreshButtonContainer: {
    alignItems: 'center',
    marginTop: '2.5%', // Adjust this value to move the refresh button lower
  },
  refreshButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column', // Ensure the content is laid out in a column
  },
  scrollContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16, // Set a fixed height to limit the scrollable area
    borderWidth: 1, // Add a border
    borderColor: 'gray', // Border color
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default App;
