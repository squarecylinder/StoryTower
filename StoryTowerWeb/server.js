const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { authMiddleware } = require('./utils/auth');
const Story = require('./models/Story')
const Chapter = require('./models/Chapter')
const aggregationPipelineFindDuplicateChapters = require('./src/aggregationPipelineFindDuplicateChapters')
const aggregationPipelineFindNullChapters = require('./src/aggregationPipelineFindNullChapters')
const aggregationPipelineFindShadowChapters = require('./src/aggregationPipelineFindShadowChapters')
const aggregationPipelineFindOrphanedStories = require('./src/aggregationPipelineFindOrphanedStories')

const cronJob = require('./src/cronJobs');

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

      // Find any duplicate chapters to delete
      const chapterDuplicates = await Chapter.aggregate(aggregationPipelineFindDuplicateChapters);
      const chaptersToDeleteIDs = chapterDuplicates.flatMap(dupe => dupe._id.slice(1));
      const chaptersToDelete = await Chapter.find({ _id: { $in: chaptersToDeleteIDs } });

        // Log titles of chapters to be deleted
        if (chaptersToDelete.length > 0){
        console.log("Chapters to be deleted:");
        chaptersToDelete.forEach(chapter => {
          console.log("- " + chapter.title);
        });

        await Chapter.deleteMany({ _id: { $in: chaptersToDelete } });
        // Update story documents to remove deleted chapters
        for (const dupe of chapterDuplicates) {
          const storyId = dupe.story;
          const chaptersToDelete = dupe._id.slice(1); // Exclude the first chapter (to keep)
          console.log(storyId, chaptersToDelete)
  
          await Story.updateOne({ _id: storyId }, { $pull: { chapters: { $in: chaptersToDelete } } });
        }
      }

      // Find any chapters that have null images
      const nullChapters = await Chapter.aggregate(aggregationPipelineFindNullChapters)
      if (nullChapters.length > 0) {
        console.log('Found chapters with null images!');
        const _id = nullChapters.map(chapter => {return chapter._id})
        const foundChapters = await Chapter.find({ _id: _id }).select('_id')
        if (foundChapters.length > 0) {
          // Extract the IDs of the chapters to be deleted
          const chapterIdsToDelete = foundChapters.map(chapter => chapter._id);
          console.log(chapterIdsToDelete)
          // Use deleteMany to delete the chapters
          const deletionResult = await Chapter.deleteMany({ _id: { $in: chapterIdsToDelete } });

          console.log(`Deleted ${deletionResult.deletedCount} chapters.`);
        } else {
          console.log('No chapters found to delete.');
        }
      }

      // Delete any chapters from stories that point to non-existing chapters. A side-effect of the above function oopsie
      const shadowChapters = await Story.aggregate(aggregationPipelineFindShadowChapters)
      if (shadowChapters.length > 0){
          for (let i = 0; i < shadowChapters.length; i++) {
            const story = await Story.findById(shadowChapters[i]._id)
            if (story) {
              console.log('-----------', story.title, '------------')
              const missingChapters = shadowChapters[i].missing_chapters.map(id => id.toString());
              console.log('Story chapters before check', story.chapters.length)
              story.chapters = story.chapters.filter(chapter => !missingChapters.includes(chapter.toString()));
              console.log('Story chapters after check', story.chapters.length)
              console.log('----------------------------------')
              story.chapterCount = story.chapters.length
              await story.save();
            }
        }
      }
      
      const orphanedChapters = await Chapter.aggregate(aggregationPipelineFindOrphanedStories)
      if (orphanedChapters.length > 0){
        console.log('Found orphaned chapters!')
        const idsToDelete = orphanedChapters.map(chapters => chapters._id)
        const deletionResult = await Chapter.deleteMany({ _id: { $in: idsToDelete} });

        console.log(`Deleted ${deletionResult.deletedCount} chapters.`)
      }

      cronJob()

      app.listen(PORT, () => {
        console.log(`API Server running at http://${process.env.SERVER_IP}:${PORT}${server.graphqlPath}`);
      });
    });
  } catch (error) {
    console.error('Error starting Apollo server:', error);
  }
};

startApolloServer();