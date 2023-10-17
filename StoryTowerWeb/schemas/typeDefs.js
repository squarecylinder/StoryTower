const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    email: String!
    username: String!
    profilePicture: String
    bookmarkedStories: [Story]!
    readChapters: [Chapter]!
    token: String!
  }
  
  type Manwha {
    name: String
    link: String
    provider: String
  }

  type StoryCatalog {
    _id: ID!
    name: String!
    link: String!
    provider: String!
  }

  type Story {
    _id: ID!
    title: String!
    rating: Float
    lastUpdated: String
    chapterCount: Int
    synopsis: String
    genres: [String]
    chapters: [Chapter]!
    coverArt: String
  }

  type StoryPagination {
    data: [Story!]!
    totalStories: Int!
  }

  type Chapter {
    _id: ID!
    title: String!
    images: [String]
    comments: [Comment]
    story: Story
    uploaded: String
  }

  type Comment {
    _id: ID!
    author: User!
    timestamp: String
    content: String
    story: Story!
    chapter: Chapter!
  }

  type Auth {
    token: ID!
    user: User!
  }


  type Query {
    me: User
    users: [User]
    user(id: ID!): User
    getStories(offset: Int, limit: Int): StoryPagination!
    story(id: ID!): Story
    chapters(ids: [ID!]!): [Chapter]
    chapter(id: ID!): Chapter
    comments: [Comment]
    comment(id: ID!): Comment
    getStoryCatalog: [StoryCatalog]
    searchStoriesByTitle(title: String!): [Story]
    searchStoriesByGenre(genres: String!, offset: Int, limit: Int): StoryPagination!
  }

  type Mutation {
    addScrapedDataToCatalog: [StoryCatalog!]!
    createUser(email: String!, username: String!, password: String!): User
    loginUser(identifier: String!, password: String!): User
    updateBookmarkStory(storyId: ID!, userId: ID!) : User 
  }
`;

module.exports = typeDefs;
