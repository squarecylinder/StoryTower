// apolloClient.js
import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri:`https://storytowerserver.onrender.com/graphql`, // Replace with the correct API endpoint for your Apollo Server
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
`

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
  }
}
`;


export default client;
