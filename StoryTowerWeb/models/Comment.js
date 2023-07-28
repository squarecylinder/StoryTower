const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
    required: true,
  },
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
  },
  chapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
  },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
