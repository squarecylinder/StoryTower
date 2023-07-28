import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { ApolloClient, InMemoryCache, HttpLink, gql, useMutation } from '@apollo/client';
import Header from './components/Header'; // Import the Header component

// Interface to define the shape of each item in scrapedData
interface ScrapedDataItem {
  name: string;
  link: string;
  provider: string;
}

// Set up the Apollo Client
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://192.168.1.70:3001/graphql', // Replace with the correct API endpoint for your Apollo Server
  }),
});

const App = () => {
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
  const [scrapedData, setScrapedData] = useState<ScrapedDataItem[]>([]);
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
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>
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

export default App;
