// StoryTower/src/App.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';

const App = () => {
  const [scrapedData, setScrapedData] = useState('');

  // Function to fetch the data from your backend server
  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.1.70:3000/scrape'); // Use the correct IP address here
      const data = await response.text();
      setScrapedData(data);

      console.log('Scraped Data:', data.slice(0, 50)); // Log the first 50 characters of the data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.refreshButtonContainer}>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.title}>Scraped Data:</Text>
          {scrapedData ? <Text>{scrapedData}</Text> : <Text>Loading...</Text>}
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
