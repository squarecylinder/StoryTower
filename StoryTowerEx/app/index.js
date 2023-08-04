import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, FlatList, Image, useWindowDimensions } from 'react-native';
import Header from './components/Header'; // Import the Header component
import client, { GET_STORIES } from './apolloClient'; // Import the Apollo client instance

const minCols = 2;

const calcNumColumns = (width) => {
  const cols = width / 200; // Assuming each item width is 90 (based on the example)
  const colsFloor = Math.floor(cols) > minCols ? Math.floor(cols) : minCols;
  const colsMinusMargin = cols - (2 * colsFloor * 1); // Assuming margin of 1 (based on the example)

  if (colsMinusMargin < colsFloor && colsFloor > minCols) {
    return colsFloor - 1;
  } else {
    return colsFloor;
  }
};

const formatData = (data, numColumns) => {
  const formattedData = [...data]; // Create a new array using the spread operator
  const amountFullRows = Math.floor(formattedData.length / numColumns);
  let amountItemsLastRow = formattedData.length - amountFullRows * numColumns;
 console.log(amountItemsLastRow)
  while (amountItemsLastRow !== numColumns && amountItemsLastRow !== 0) {
    formattedData.push({ key: `empty-${amountItemsLastRow}`, empty: true });
    amountItemsLastRow++;
  }
  return formattedData;
};


const Index = () => {
  // State to store the fetched data
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const [numColumns, setNumColumns] = useState(calcNumColumns(width));

  // Function to fetch the data from the server
  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await client.query({ query: GET_STORIES });
      setStories(data.getStories);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setNumColumns(calcNumColumns(width));
  }, [width]);

  // Function to handle refreshing the data
  const handleRefresh = () => {
    fetchData();
  };

  // Function to render each story item in the FlatList
  const renderStoryItem = ({ item }) => (
    <View key={item._id} style={styles.item}>
      <Image source={{ uri: item.coverArt }} style={styles.coverArt} resizeMode="contain" />
      <Text style={styles.itemText}>{item.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.refreshButtonContainer}>
        <Pressable style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.buttonText}>Refresh</Text>
        </Pressable>
      </View>
      <View style={styles.contentContainer}>
        <FlatList
          key={numColumns}
          data={formatData(stories, numColumns)}
          numColumns={numColumns}
          renderItem={renderStoryItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.scrollContainer}
          ListEmptyComponent={<Text>Loading...</Text>}
          refreshing={loading}
          onRefresh={handleRefresh}
        />
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
    flexGrow: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  item: {
    backgroundColor: '#A1A1A1',
    alignItems: 'center',
    justifyContent: 'top',
    flex: 1,
    margin: 1,
    height: 300,
    width: 200,
    padding: 10
  },
  itemText: {
    color: '#fff',
  },
  coverArt: {
    width: 250,
    height: 250,
    marginBottom: 0,
  },
  itemTransparent: {
    backgroundColor: 'transparent',
  },
});

export default Index;
