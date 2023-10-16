const { StoryCatalog, User } = require('../models');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'non-production-secret'; // Use a default if not set
const { signToken } = require('../utils/auth.js');

const addScrapedDataToCatalog = async ({ scrapedData }) => {
  console.log('GraphQL mutation for adding scraped data to catalog is executed!');
  try {
    for (const data of scrapedData) {
      const existingData = await StoryCatalog.findOne({
        link: data.link,
        provider: data.provider,
      });

      if (!existingData) {
        // Document does not exist, save the data
        await StoryCatalog.create({
          name: data.name,
          link: data.link,
          provider: data.provider,
        });
      } else {
        // Document already exists, skip saving
        console.log(`Data with link: ${data.link} and provider: ${data.provider} already exists.`);
      }
    }

    return true; // Indicate that the data was successfully processed
  } catch (error) {
    console.error('Error saving scraped data to catalog:', error);
    throw new Error('Internal Server Error');
  }
};

const createUser = async (_, { email, username, password }) => {
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new Error('User with this email or username already exists.');
    }
    const user = new User({ email, username, password });
    await user.save();
    return user;
  } catch (error) {
    throw new Error('Error creating user: ' + error.message);
  }
}

const loginUser = async (_, { identifier, password }) => {
  try {
    // Find the user by either email or username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if the provided password matches the stored hashed password
    const isCorrectPassword = await user.isCorrectPassword(password);

    if (!isCorrectPassword) {
      throw new Error('Invalid password');
    }

    // If credentials are correct, generate a JWT
    const token = signToken({
      username: user.username,
      email: user.email,
      _id: user._id
    });
    return { user, token }; // Return the token along with the user data
  } catch (error) {
    throw new Error(`Error logging in: ${error.message}`);
  }
}

module.exports = {
  addScrapedDataToCatalog,
  createUser,
  loginUser
};
