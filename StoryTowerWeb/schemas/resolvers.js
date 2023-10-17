const { AuthenticationError } = require('apollo-server-express');
const { User, Story, Comment, Chapter, StoryCatalog } = require('../models');
const { addScrapedDataToCatalog, createUser, loginUser, updateBookmarkStory } = require('./mutations'); // Import the mutation function

const resolvers = {
  Query: {
    // Add resolver functions for queries here (e.g., users, user, stories, etc.)
    me: async (parent, args, context) => {
      console.log(context.user)
      try {
        const user = await User.findById(context.user._id).populate('bookmarkedStories')
        return {user, token: context.user.token}
      } catch (error) {
        throw new AuthenticationError('Not logged in')
      }
    },
    getStories: async (_, { offset = 0, limit = 10 }) => {
      try {
         // Use the offset and limit in the find query
         const stories = await Story.find().sort({lastUpdated: -1}).skip(offset).limit(limit);

         // Get the total number of stories without pagination
         const totalStories = await Story.countDocuments();
 
         return {
           data: stories,
           totalStories,
         };
      } catch (error) {
        console.error('Error fetching Stories:', error);
        throw new Error('Internal Server Error');
      }
    },
    chapters: async (_, { ids }) => {
      try {
        // Fetch chapters based on the provided IDs
        const chapters = await Chapter.find({ _id: { $in: ids } });

        return chapters;
      } catch (error) {
        console.error('Error fetching chapters:', error);
        throw new Error('Internal Server Error');
      }
    },
    story: async (_, { id }) => {
      try {
        // Fetch story based on the provided ID
        const story = await Story.findById(id);
        return story;
      } catch (error) {
        console.error('Error fetching story:', error, id);
        throw new Error('Internal Server Error');
      }
    },
    searchStoriesByTitle: async (_, { title }) => {
      try {
        // Perform a database query to search for stories by title
        const stories = await Story.find({ title: { $regex: title, $options: 'i' } });

        return stories;
      } catch (error) {
        throw new Error('Error searching stories by title');
      }
    },
    searchStoriesByGenre: async (_, { genres, offset = 0, limit = 10 }) => {
      try {
        // Perform a database query to search for stories by genre
        const stories = await Story.find({ genres: { $regex: genres, $options: 'i' } }).sort({lastUpdated: -1}).skip(offset).limit(limit);

         // Get the total number of stories without pagination
         const totalStories = await Story.find({ genres: { $regex: genres, $options: 'i' } }).countDocuments();
         
        return {
          data: stories,
          totalStories
        }
      } catch (error) {
        console.error('Error searching stories by genre:', error);
        throw new Error('Error searching stories by genre');
      }
    },
  },
  Mutation: {
    addScrapedDataToCatalog,
    createUser,
    loginUser,
    updateBookmarkStory
  },
  User: {
    _id: (parent) => parent.user._id,
    email: (parent) => parent.user.email,
    username: (parent) => parent.user.username,
    bookmarkedStories: (parent) => parent.user.bookmarkedStories,
    readChapters: (parent) => parent.user.readChapters,
    token: (parent) => parent.token
  }
};

module.exports = resolvers
