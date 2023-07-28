const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const authMiddleware = require('./utils/auth');

const { performWebScraping } = require('./src/scraping/webScraper');
const {typeDefs, resolvers } = require('./schemas');

const connection = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: process.env.NODE_ENV === 'development',
  context: authMiddleware,
})

const User = require('./models/User');
const Story = require('./models/Story');
const Comment = require('./models/Comment');


// Middleware to handle parsing JSON data in request body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV == 'production'){
  app.use(express.static(path.join(__dirname, '../StoryTower/build')))
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../StoryTower/'))
})


// Start the server
const startApolloServer = async () => {
  try {
    await server.start();
    server.applyMiddleware({ app });

    connection.once('open', () => {
      console.log('Connected to MongoDB.');
      console.log(`API Server running on ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('Error starting Apollo server:', error);
  }
};

startApolloServer();