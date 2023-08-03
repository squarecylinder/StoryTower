const { AuthenticationError } = require('apollo-server-express');
const { User, Story, Comment, Chapter, StoryCatalog } = require('../models');
const { signToken } = require('../utils/auth');
const { addScrapedDataToCatalog } = require('./mutations'); // Import the mutation function

const resolvers = {
  Query: {
    // Add resolver functions for queries here (e.g., users, user, stories, etc.)
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id}).select('-__v -password');

        return userData;
      }
      throw new AuthenticationError('Not Logged In');
    },
    getStoryCatalog: async () => {
      try {
        const storyCatalog = await StoryCatalog.find();
        return storyCatalog;
      } catch (error) {
        console.error('Error fetching StoryCatalog:', error);
        throw new Error('Internal Server Error');
      }
    },
  },
  Mutation: {
    addScrapedDataToCatalog,
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
      const user = await User.findOne({ email });

      if(!user) {
        throw new AuthenticationError('Incorrect credentials')
      }

      const correctPw = await User.isCorrectPassword(password);

      if(!correctPw) {
        throw new AuthenticationError('Incorrect credentials')
      }

      const token = signToken(user);
      return { token, user}
    },
  },
};

module.exports = resolvers
