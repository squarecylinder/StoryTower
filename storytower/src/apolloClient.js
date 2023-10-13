// apolloClient.js
import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';

const graphQLURI = process.env.NODE_ENV === 'production' ? 'https://storytowerserver.onrender.com/graphql' : 'http://localhost:3001/graphql'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: graphQLURI, // Replace with the correct API endpoint for your Apollo Server
  }),
});

export const GET_STORY = gql`
  query getStory($id: ID!){
    story(id: $id){
      _id
      title
      rating
      lastUpdated
      chapterCount
      synopsis
      genres
      chapters {
        _id
      }
      coverArt
    }
  }
`;

export const SEARCH_STORIES_BY_TITLE = gql`
  query searchStoriesByTitle($title: String!) {
    searchStoriesByTitle(title: $title) {
      _id
      title
      rating
      lastUpdated
      chapterCount
      synopsis
      genres
      chapters {
        _id
      }
      coverArt
    }
  }
`;

export const SEARCH_STORIES_BY_GENRE = gql`
  query searchStoriesByGenre($genres: String!, $offset: Int, $limit: Int) {
    searchStoriesByGenre(genres: $genres, offset: $offset, limit: $limit) {
      data {
        _id
        title
        rating
        lastUpdated
        chapterCount
        synopsis
        genres
        coverArt
        chapters {
          _id
        }
      }
      totalStories
    }
  }
`;

export const GET_STORY_CATALOG = gql`
  query getStoryCatalog {
    getStoryCatalog {
      _id
      name
      link
      provider
    }
  }
`;

export const GET_STORIES = gql`
query getStories($offset: Int, $limit: Int) {
  getStories(offset: $offset, limit: $limit) {
    data {
      _id
      title
      rating
      lastUpdated
      chapterCount
      synopsis
      genres
      coverArt
      chapters {
        _id
      }
    }
    totalStories
    }
  }
`;

export const GET_CHAPTER_DETAILS = gql`
query getChapterDetails($chapterIds: [ID!]!) {
  chapters(ids: $chapterIds) {
    _id
    title
    images
    comments {
      _id
    }
    story {
      _id
    }
    uploaded
  }
}
`;

export const CREATE_USER = gql`
mutation createUser($email: String!, $username: String!, $password: String!) {
  createUser(email: $email, username: $username, password: $password) {
    _id
    email
    username
    profilePicture
    bookmarkedStories {
      _id
      title
    }
    readChapters {
      _id
      title
    }
  }
}
`;

export default client;
