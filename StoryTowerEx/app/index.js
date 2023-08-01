import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { gql, useMutation } from '@apollo/client';
import Header from './components/Header'; // Import the Header component
import client from './apolloClient'; // Import the Apollo client instance

const Index = () => {
  // GraphQL query to fetch the scraped data
  const GET_SCRAPED_DATA = gql`
    query ScrapedData {
      scrapedData {
        name
        link
        provider
      }
    }
  `;

  // Mutation query to add scraped data to the catalog
  const ADD_SCRAPED_DATA_TO_CATALOG = gql`
    mutation AddScrapedDataToCatalog {
      addScrapedDataToCatalog {
        success
      }
    }
  `;

  // Mutation hook for adding scraped data to the catalog
  const [addScrapedDataToCatalog] = useMutation(ADD_SCRAPED_DATA_TO_CATALOG, {
    onCompleted: async () => {
      // After adding scraped data to the catalog, fetch the updated data
      await fetchData();
    },
    onError: (error) => {
      console.error('Error adding scraped data to catalog:', error);
      setLoading(false);
    },
  });

  // State to store the fetched data
  const [scrapedData, setScrapedData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch the data from the server
  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await client.query({ query: GET_SCRAPED_DATA });
      setScrapedData(data.scrapedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to handle refreshing the data
  const handleRefresh = () => {
    fetchData();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.refreshButtonContainer}>
        <Pressable style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.buttonText}>Refresh</Text>
        </Pressable>
      </View>
      <View style={styles.contentContainer}>
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.title}>Scraped Data:</Text>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            scrapedData.map((item) => (
              <View key={item.link}>
                <Text>Name: {item.name}</Text>
                <Text>Link: {item.link}</Text>
                <Text>Provider: {item.provider}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  refreshButtonContainer: {
    alignItems: 'center',
    marginTop: '2.5%',
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
    flexDirection: 'column',
  },
  scrollContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: 'gray',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default Index;
