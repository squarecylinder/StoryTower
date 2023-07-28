const { AuthenticationError } = require('apollo-server-express');
const User = require('../models/User');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // Add resolver functions for queries here (e.g., users, user, stories, etc.)
  },
  Mutation: {
    createUser: async (parent, { input }) => {
      // Add logic to create a new user using the User model and return the created user
    },
    createStory: async (parent, { input }) => {
      // Add logic to create a new story using the Story model and return the created story
    },
    createChapter: async (parent, { input }) => {
      // Add logic to create a new chapter using the Chapter model and return the created chapter
    },
    createComment: async (parent, { input }) => {
      // Add logic to create a new comment using the Comment model and return the created comment
    },
    loginUser: async (parent, { input }) => {
      const { email, password } = input;
      // Add logic to find the user by email and check the password using the User model
      // If user is found and password is correct, create a token using the signToken function
      // Return the token and user data as an Auth object
      // If the user is not found or the password is incorrect, throw an AuthenticationError
      throw new AuthenticationError('Invalid credentials');
    },
  },
};

module.exports = resolvers;
