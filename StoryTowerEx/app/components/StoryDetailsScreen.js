// StoryDetailsScreen.js
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const StoryDetailsScreen = ({ route }) => {
  const { title, coverArt, rating, chapters, synopsis, genres, chapterCount } = route.params.story;
    console.log(route.params.story)
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: coverArt }} style={styles.coverArt} resizeMode="contain" />
        <Text style={styles.title}>{title}</Text>
        <Text>{synopsis}</Text>
        <Text>Genres: {genres}</Text>
        <Text style={styles.rating}>Rating: {rating}</Text>
        {/* Add Bookmark button here */}
        {/* Add First and Last chapter buttons here */}
      </View>
      {Array.isArray(chapters) ? (
        <ScrollView style={styles.chapterList}>
          {chapters.map((chapter, index) => (
            <View key={index} style={styles.chapterItem}>
              <Text>{chapter.title}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text>No chapters available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  header: {
    alignItems: 'center',
  },
  coverArt: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rating: {
    fontSize: 16,
    marginBottom: 10,
  },
  chapterList: {
    flex: 1,
    marginTop: 16,
  },
  chapterItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#A1A1A1',
  },
});

export default StoryDetailsScreen;
