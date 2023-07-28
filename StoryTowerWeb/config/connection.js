const mongoose = require('mongoose');

// Function to connect to a MongoDB database and return the connection object
async function connectToDatabase(uri) {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB successfully.');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

// Database connection URI for the StoryTower database
const uriForStoryTower = 'mongodb+srv://ziencck:1BQIV8RAximzbhbK@StoryCluster.orgtir5.mongodb.net/StoryTower?retryWrites=true&w=majority';

// Export the StoryTower connection
module.exports = {
    connectToStoryTower: () => {
        return connectToDatabase(uriForStoryTower)
          .then(() => mongoose.connection)
          .catch((error) => {
            console.error('Error connecting to StoryTower database:', error);
            throw error;
          });
      },
  };
