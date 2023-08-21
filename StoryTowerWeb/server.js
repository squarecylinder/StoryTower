const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const authMiddleware = require('./utils/auth');
const https = require('https');
const fs = require('fs');

require('./src/cronJobs');

const { typeDefs, resolvers } = require('./schemas');

const connection = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  cache: 'bounded',
})

// Middleware to handle parsing JSON data in request body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// I dont have a build command, should I?
// if (process.env.NODE_ENV == 'production') {
//   app.use(express.static(path.join(__dirname, '../StoryTower/build')))
// }

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../StoryTower/'))
})

// const privateKey = fs.readFileSync('./server.key', 'utf8');
// const certificate = fs.readFileSync('./server.crt', 'utf8');

// const credentials = { key: privateKey, cert: certificate };
// Start the server
const startApolloServer = async () => {
  try {
    // Await server.start() before applying the middleware
    await server.start();
    server.applyMiddleware({ app });

    // Establish MongoDB connection
    connection.on('open', () => {
      console.log('Connected to MongoDB.');
      // Start Apollo Server after the MongoDB connection is open
      // const httpsServer = https.createServer(credentials, app);
      app.listen(PORT, () => {
        console.log(`API Server running at http://${process.env.SERVER_IP}:${PORT}${server.graphqlPath}`);
      });
    });
  } catch (error) {
    console.error('Error starting Apollo server:', error);
  }
};

startApolloServer();