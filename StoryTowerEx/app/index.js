import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import Header from './components/Header'; // Import the Header component
import client, { GET_STORY_CATALOG} from './apolloClient'; // Import the Apollo client instance

const Index = () => {
  // State to store the fetched data
  const [storyCatalog, setStoryCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch the data from the server
  const fetchData = async () => {
    try {
      setLoading(true);
      const {data} = await client.query({ query: GET_STORY_CATALOG });
      console.log(data.getStoryCatalog);
      setStoryCatalog(data.getStoryCatalog);
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
            storyCatalog.map((item) => (
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
