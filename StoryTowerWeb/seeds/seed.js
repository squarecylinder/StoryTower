const mongoose = require('mongoose');
const faker = require('faker');
const connection = require('../config/connection');
const User = require('../models/User');
const Story = require('../models/Story');
const Chapter = require('../models/Chapter');
const Comment = require('../models/Comment');

async function seed() {
  try {
    // Connect to the StoryTower database
    await connection.connectToStoryTower();

    // Clear existing data from the StoryTower database
    await mongoose.connection.dropDatabase();

    // Create test users in the StoryTower database
    const users = [];
    for (let i = 0; i < 5; i++) {
      const newUser = new User({
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: faker.internet.password(),
        profilePicture: faker.image.avatar(),
      });
      users.push(newUser);
    }
    await User.insertMany(users);

    // Create test stories in the StoryTower database
    const stories = [];
    for (let i = 0; i < 5; i++) {
      const newStory = new Story({
        title: faker.lorem.words(3),
        rating: faker.datatype.number({ min: 0, max: 5 }),
        lastUpdated: faker.date.past(),
        chapterCount: faker.datatype.number({ min: 5, max: 20 }),
        synopsis: faker.lorem.paragraph(),
        genres: [faker.random.arrayElement(['Fantasy', 'Sci-Fi', 'Adventure', 'Romance'])],
      });
      stories.push(newStory);
    }
    await Story.insertMany(stories);

    // Create chapters and comments for each story in the StoryTower database
    for (const story of stories) {
      const chapters = [];
      for (let i = 1; i <= story.chapterCount; i++) {
        const newChapter = new Chapter({
          title: `Chapter ${i}`,
          images: [faker.image.imageUrl()],
          comments: [],
        });
        chapters.push(newChapter);
      }
      await Chapter.insertMany(chapters);

      for (const chapter of chapters) {
        const comments = [];
        for (let i = 0; i < faker.datatype.number({ min: 0, max: 5 }); i++) {
          const user = faker.random.arrayElement(users);
          const newComment = new Comment({
            author: user._id,
            timestamp: faker.date.past(),
            content: faker.lorem.sentence(),
            story: story._id,
            chapter: chapter._id,
          });
          comments.push(newComment);
        }
        chapter.comments = comments.map((comment) => comment._id);
        await Comment.insertMany(comments);
      }

      story.chapters = chapters.map((chapter) => chapter._id);
      await story.save();
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
