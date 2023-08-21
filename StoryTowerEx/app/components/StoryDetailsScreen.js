// StoryDetailsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_CHAPTER_TITLES } from '../apolloClient'; // Update this import with the actual location of your queries

const StoryDetailsScreen = ({ route }) => {
  const { _id, title, coverArt, rating, chapters, synopsis, genres, chapterCount } = route.params.story;
  const chapterIds = []
  chapters.forEach(element => {
  chapterIds.push(element._id)
  });
  const { loading, error, data } = useQuery(GET_CHAPTER_TITLES, {
    variables: { _id, chapterIds },
  });

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    console.error('Error fetching story details:', error);
    return <Text>Error fetching story details</Text>;
  }

  // const story = data.story;
  // const chapters2 = story.chapters;
  console.log(data.chapters)
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: coverArt }} style={styles.coverArt} resizeMode="contain" />
        <Text style={styles.title}>{title}</Text>
        <Text>{synopsis}</Text>
        <Text>Genres: {genres}</Text>
        <Text style={styles.rating}>Rating: {rating}</Text>
        <Text>Chapter Count: {chapterCount}</Text>
        {/* Add Bookmark button here */}
        {/* Add First and Last chapter buttons here */}
      </View>
      {Array.isArray(data.chapters) ? (
        <ScrollView style={styles.chapterList}>
          {data.chapters.map((chapter, index) => (
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
