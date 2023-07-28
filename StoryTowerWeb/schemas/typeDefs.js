const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    email: String!
    username: String!
    profilePicture: String
    bookmarkedStories: [Story]
    readChapters: [Chapter]
  }
  
  type Manwha {
    name: String
    link: String
  }

  type Story {
    _id: ID!
    title: String!
    rating: Float
    lastUpdated: String
    chapterCount: Int
    synopsis: String
    genres: [String]
    chapters: [Chapter]
  }

  type Chapter {
    _id: ID!
    title: String!
    images: [String]
    comments: [Comment]
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

  input CreateUserInput {
    email: String!
    username: String!
    password: String!
    profilePicture: String
  }

  input CreateStoryInput {
    title: String!
    rating: Float
    lastUpdated: String
    chapterCount: Int
    synopsis: String
    genres: [String]
  }

  input CreateChapterInput {
    title: String!
    images: [String]
  }

  input CreateCommentInput {
    author: ID!
    timestamp: String
    content: String
    story: ID!
    chapter: ID!
  }

  input LoginUserInput {
    email: String!
    password: String!
  }

  type Query {
    me: User
    users: [User]
    user(id: ID!): User
    stories: [Story]
    story(id: ID!): Story
    chapters: [Chapter]
    chapter(id: ID!): Chapter
    comments: [Comment]
    comment(id: ID!): Comment
    scrapedData: [Manwha]
  }

  type Mutation {
    createUser(input: CreateUserInput!): User
    createStory(input: CreateStoryInput!): Story
    createChapter(input: CreateChapterInput!): Chapter
    createComment(input: CreateCommentInput!): Comment
    loginUser(input: LoginUserInput!): Auth
  }
`;

module.exports = typeDefs;
