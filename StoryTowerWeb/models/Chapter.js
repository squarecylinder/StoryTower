// StoryTowerWeb/models/Chapter.js
const mongoose = require('mongoose');
const Comment = require('./Comment'); // Import the Comment model
const Story = require('./Story'); // Import the Story model

const chapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  images: {
    type: [String], // Array of image URLs (or file paths)
    required: true,
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: true,
  },
  uploaded: {
    type: Date,
    default: Date.now,
  }
  // Any other chapter-related fields you may need
});

chapterSchema.index({ title: 1, story: 1 }, { unique: true }); // Ensure chapter title is unique per story

const Chapter = mongoose.model('Chapter', chapterSchema);

module.exports = Chapter;
