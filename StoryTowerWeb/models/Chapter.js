// StoryTowerWeb/models/Chapter.js
const mongoose = require('mongoose');
const Comment = require('./Comment'); // Import the Comment model

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
  // Any other chapter-related fields you may need
});

const Chapter = mongoose.model('Chapter', chapterSchema);

module.exports = Chapter;
