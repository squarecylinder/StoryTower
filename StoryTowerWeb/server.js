const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const authMiddleware = require('./utils/auth');
const Story = require('./models/Story')
const Chapter = require('./models/Chapter')
const aggregationPipelineFindDuplicateChapters = require('./src/aggregationPipelineFindDuplicateChapters')

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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../StoryTower/'))
})

// Start the server
const startApolloServer = async () => {
  try {
    // Await server.start() before applying the middleware
    await server.start();
    server.applyMiddleware({ app });

    // Establish MongoDB connection
    connection.on('open', async () => {
      console.log('Connected to MongoDB.');
      // Start Apollo Server after the MongoDB connection is open
      const chapterDuplicates = await Story.aggregate(aggregationPipelineFindDuplicateChapters);
      console.log(chapterDuplicates)
      if (chapterDuplicates.length > 0) {
        const [{ chapterIds }] = chapterDuplicates
        const foundChapters = await Chapter.find({ _id: chapterIds })
        console.log(foundChapters)
        if (foundChapters.length > 0) {
          // Extract the IDs of the chapters to be deleted
          const chapterIdsToDelete = foundChapters.map(chapter => chapter._id);

          // Use deleteMany to delete the chapters
          const deletionResult = await Chapter.deleteMany({ _id: { $in: chapterIdsToDelete } });

          console.log(`Deleted ${deletionResult.deletedCount} chapters.`);
        } else {
          console.log('No chapters found to delete.');
        }
      }
      app.listen(PORT, () => {
        console.log(`API Server running at http://${process.env.SERVER_IP}:${PORT}${server.graphqlPath}`);
      });
    });
  } catch (error) {
    console.error('Error starting Apollo server:', error);
  }
};

startApolloServer();