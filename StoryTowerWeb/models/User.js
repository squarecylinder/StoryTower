const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        // Add custom email validation logic here
        // For example, using a regular expression to validate the format
        return /^[\w-]+(\.[\w-]+)*@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/.test(value);
      },
      message: 'Invalid email format.',
    },
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Add custom password validation logic here
        // For example, requiring a minimum length of 8 characters
        return value.length >= 8;
      },
      message: 'Password must be at least 8 characters long.',
    },
  },
  profilePicture: {
    type: String,
    default: '',
  },
  bookmarkedStories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    default: [],
  }],
  readChapters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
    default: [],
  }],
});


userSchema.pre('save', async function (next) {
  if(this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
})

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);

module.exports = User;
