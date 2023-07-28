// StoryTowerWeb/models/Story.js
const mongoose = require('mongoose');
const Chapter = require('./Chapter');

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  chapterCount: {
    type: Number,
    default: 0,
  },
  synopsis: {
    type: String,
    required: true,
  },
  genres: {
    type: [String], // An array of strings representing genres
    required: true,
  },
  chapters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
  }],
  averageRating: {
    type: Number,
    default: 0,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
  numRatings: {
    type: Number,
    default: 0,
  },
});

storySchema.methods.calculateAverageRating = function () {
  this.averageRating = this.totalRatings / this.numRatings;
};

const Story = mongoose.model('Story', storySchema);

module.exports = Story;
