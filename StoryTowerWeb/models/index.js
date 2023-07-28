// StoryTowerWeb/models/index.js
const User = require('./User');
const Story = require('./Story');
const Comment = require('./Comment');
const StoryCatalog = require('./StoryCatalog');
const Chapter = require('./Chapter');

module.exports = {
  User,
  Story,
  Comment,
  Chapter,
  StoryCatalog,
};
