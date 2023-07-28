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

// Define your API endpoint
app.get('/scrape', async (req, res) => {
  try {
    const scrapedData = await performWebScraping();
    res.send(scrapedData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to create a new user
app.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to create a new story
app.post('/stories', async (req, res) => {
  try {
    const newStory = new Story(req.body);
    const savedStory = await newStory.save();
    res.status(201).json(savedStory);
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to create a new comment
app.post('/comments', async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
const startApolloServer = async () => {
  console.log('Starting Apollo server...');
  try {
    console.log("TEST")
    await server.start();
    server.applyMiddleware({ app });

    const dbConnection = await connection.connectToStoryTower();

    dbConnection.on('error', (error) => {
      console.error('Error in MongoDB connection:', error);
    });

    dbConnection.once('open', () => {
      console.log('Connected to MongoDB.');
      console.log(`API Server running on ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('Error starting Apollo server:', error);
  }
};

startApolloServer();

// const port = 3000;
// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });
