import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  useWindowDimensions,
} from 'react-native';
import Header from './components/Header';
import client, { GET_STORIES } from './apolloClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PAGE_SIZE = 24;
const minCols = 1;

const calcNumColumns = (width) => {
  const cols = width / 200;
  const colsFloor = Math.floor(cols) > minCols ? Math.floor(cols) : minCols;
  const colsMinusMargin = cols - 2 * colsFloor * 1;

  if (colsMinusMargin < colsFloor && colsFloor > minCols) {
    return colsFloor - 1;
  } else {
    return colsFloor;
  }
};

const formatData = (data, numColumns) => {
  if (!Array.isArray(data)) {
    return []; // Return an empty array if data is not valid
  }

  const formattedData = [...data];
  const amountFullRows = Math.floor(formattedData.length / numColumns);
  let amountItemsLastRow = formattedData.length - amountFullRows * numColumns;

  // If there are not enough items to fill the last row, remove empty slots
  while (amountItemsLastRow !== numColumns && amountItemsLastRow !== 0) {
    data.push({key: `empty-${amountItemsLastRow}`, empty: true});
    amountItemsLastRow++;
  }

  return formattedData;
};

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [numColumns, setNumColumns] = useState(calcNumColumns(width));
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [initialRender, setInitialRender] = useState(true);
  const [formattedData, setFormattedData] = useState([]);
  const [storiesByPage, setStoriesByPage] = useState({});
  const { width } = useWindowDimensions();
  const hideImages = width < 500;
  

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const offset = (page - 1) * 24;
      const { data } = await client.query({
        query: GET_STORIES,
        variables: { offset, limit: 24 },
      });
  
      setFormattedData(formatData(data.getStories.data, numColumns));
      setTotalPages(Math.ceil(data.getStories.totalStories / 24));
      setCurrentPage(page);
      await AsyncStorage.setItem('currentPage', page.toString());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (!initialRender) {
      fetchData(currentPage); // Only call fetchData if not the initial render
    } else {
      setInitialRender(false);
    }
  }, [currentPage, initialRender]);

  useEffect(() => {
    const newNumColumns = calcNumColumns(width);
    if (numColumns !== newNumColumns) {
      setNumColumns(newNumColumns);
    }
  }, [width]);

  useEffect(() => {
    handleRefresh(); // Fetch data for the current or stored page when the component mounts
  }, []);

  const handleRefresh = async () => {
    try {
      const storedPage = await AsyncStorage.getItem('currentPage');
      const page = storedPage ? Number(storedPage) : currentPage;
      fetchData(page); // Fetch data for the current page or the stored page
    } catch (error) {
      console.error('Error retrieving data from AsyncStorage:', error);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const renderStoryItem = ({ item }) => (
    <View key={item._id} style={styles.item}>
      {!hideImages && (
        <Image source={{ uri: item.coverArt }} style={styles.coverArt} resizeMode="contain" />
      )}
      <Text style={styles.itemText}>{item.title}</Text>
    </View>
  );

  const renderPaginationButton = (page) => (
    <Pressable
      key={page}
      style={styles.paginationButton}
      onPress={() => handlePageClick(page)}
      android_ripple={{ color: 'lightgray', borderless: true }}
    >
      <Text style={styles.paginationButtonText}>{page}</Text>
    </Pressable>
  );

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(renderPaginationButton(i));
    }
    return pages;
  };

  const flatListProps = {
    key: numColumns,
    data: formattedData,
    numColumns,
    renderItem: renderStoryItem,
    keyExtractor: (item) => item._id,
    contentContainerStyle: styles.scrollContainer,
    ListEmptyComponent: <Text>Loading...</Text>,
    refreshing: loading,
    onRefresh: handleRefresh,
    ListFooterComponent: (
      <View style={styles.paginationContainer}>
        <Pressable
          style={styles.paginationButton}
          onPress={() => handlePageClick(currentPage - 1)}
          android_ripple={{ color: 'lightgray', borderless: true }}
          disabled={currentPage === 1}
        >
          <Text style={styles.paginationButtonText}>{"<<"}</Text>
        </Pressable>
        {renderPagination()}
        <Pressable
          style={styles.paginationButton}
          onPress={() => handlePageClick(currentPage + 1)}
          android_ripple={{ color: 'lightgray', borderless: true }}
          disabled={currentPage === totalPages}
        >
          <Text style={styles.paginationButtonText}>{">>"}</Text>
        </Pressable>
      </View>
    ),
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
      <FlatList {...flatListProps} />
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
    padding: 10, // Add the minWidth property to prevent overlapping at small screen sizes
  },
  itemText: {
    color: '#fff',
  },
  coverArt: {
    width: 250,
    height: 250,
    marginBottom: 0,
    '@media (max-width: 500px)': {
      display: 'none', // Hide the cover art when screen size is below 500 pixels
    },
  },
  itemTransparent: {
    backgroundColor: 'transparent',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  paginationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  paginationButtonText: {
    fontSize: 16,
  },
});

export default Index;
