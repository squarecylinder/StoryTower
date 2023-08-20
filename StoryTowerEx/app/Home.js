import React, { useState, useEffect, useRef } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PAGE_SIZE = 24;
const minCols = 2;

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

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [numColumns, setNumColumns] = useState(calcNumColumns(width));
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [initialRender, setInitialRender] = useState(true);
  const [formattedData, setFormattedData] = useState([]);
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const flatListRef = useRef(null)

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const offset = (page - 1) * PAGE_SIZE;
      const { data } = await client.query({
        query: GET_STORIES,
        variables: { offset, limit: PAGE_SIZE },
      });
  
      setFormattedData(formatData(data.getStories.data, numColumns));
      setTotalPages(Math.ceil(data.getStories.totalStories / PAGE_SIZE));
      setCurrentPage(page);
      await AsyncStorage.setItem('currentPage', page.toString());
    } catch (error) {
      console.error('Error fetching data:', error.message);
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
    flatListRef.current.scrollToOffset({ animated: false, offset: 0 });
  };

  // const handlePageClick = (page) => {
  //   setCurrentPage(page);
  //   navigation.push('Home', { page }); // Navigate with page parameter
  // };

  const renderStoryItem = ({ item }) => (
    <View key={item._id} style={styles.item}>
        <Image source={{ uri: item.coverArt }} style={styles.coverArt} resizeMode="contain" 
          onError={() => console.log("Image failed to load: ", item.coverArt)}
        />
      <Text style={styles.itemText}>{item.title}</Text>
    </View>
  );

  const renderPaginationButton = (page) => {
    const isActive = page === currentPage
    return (
    <Pressable
      key={page}
      style={[styles.paginationButton, isActive && styles.activePaginationButton]}
      onPress={() => handlePageClick(page)}
      android_ripple={{ color: 'lightgray', borderless: true }}
    >
      <Text style={[styles.paginationButtonText, isActive && styles.activePaginationButtonText]}>{page}</Text>
    </Pressable>
  );
  }

  const renderPagination = () => {
    const pages = [];
  
    const renderEllipsis = (key) => (
      <Text key={key} style={[styles.paginationButtonText, styles.ellipsis]}>
        ...
      </Text>
    );
  
    // Add the first and second pages
    if (totalPages > 0) {
      pages.push(renderPaginationButton(1));
    }
    if (totalPages > 1) {
      pages.push(renderPaginationButton(2));
    }
  
    // Add ellipsis or pages in the middle
    if (totalPages > 3) {
      if (currentPage > 4) {
        pages.push(renderEllipsis('ellipsis-start'));
      }
      for (let i = Math.max(currentPage - 1, 3); i <= Math.min(currentPage + 1, totalPages - 2); i++) {
        pages.push(renderPaginationButton(i));
      }
      if (currentPage < totalPages - 3) {
        pages.push(renderEllipsis('ellipsis-end'));
      }
    } else {
      for (let i = 3; i <= totalPages - 2; i++) {
        pages.push(renderPaginationButton(i));
      }
    }
  
    // Add the second-to-last and last pages
    if (totalPages > 2) {
      pages.push(renderPaginationButton(totalPages - 1));
    }
    if (totalPages > 1) {
      pages.push(renderPaginationButton(totalPages));
    }
  
    return pages;
  };

  const flatListProps = {
    ref: flatListRef,
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
          onPress={() => handlePageClick(1)}
          android_ripple={{ color: 'lightgray', borderless: true }}
          disabled={currentPage === 1}
        >
          <Text style={styles.paginationButtonText}>{"<<"}</Text>
        </Pressable>
        <Pressable
          style={styles.paginationButton}
          onPress={() => handlePageClick(currentPage - 1)}
          android_ripple={{ color: 'lightgray', borderless: true }}
          disabled={currentPage === 1}
        >
          <Text style={styles.paginationButtonText}>{"<"}</Text>
        </Pressable>
        {renderPagination()}
        <Pressable
          style={styles.paginationButton}
          onPress={() => handlePageClick(currentPage + 1)}
          android_ripple={{ color: 'lightgray', borderless: true }}
          disabled={currentPage === totalPages}
        >
          <Text style={styles.paginationButtonText}>{">"}</Text>
        </Pressable>
        <Pressable
          style={styles.paginationButton}
          onPress={() => handlePageClick(totalPages)}
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
    width: 225,
    height: 225,
    marginBottom: 0,
  },
  itemTransparent: {
    backgroundColor: 'transparent',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  activePaginationButton: {
    backgroundColor: 'gray', // Change the color for the active page button
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4, // For Android shadow
  },
  activePaginationButtonText: {
    color: 'white', // Change the text color for the active page button
    fontWeight: 'bold',
  },
  paginationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  paginationButtonText: {
    fontSize: 16,
  },
  ellipsis:{
    alignSelf: 'flex-end'
  }
});

export default Home;
