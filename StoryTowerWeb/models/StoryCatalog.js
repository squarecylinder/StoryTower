// StoryTowerWeb/models/StoryCatalog.js
const mongoose = require('mongoose');

const storyCatalogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
});

// Add a unique compound index for link and provider
storyCatalogSchema.index({ link: 1, provider: 1 }, { unique: true });

const StoryCatalog = mongoose.model('StoryCatalog', storyCatalogSchema);

module.exports = StoryCatalog;
