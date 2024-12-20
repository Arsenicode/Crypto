// models/UserPreferences.js
const mongoose = require('mongoose');

const userPreferencesSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    unique: true, // Ensures one entry per user
  },
  selectedCoins: {
    type: [String], // Array of coin names
    required: true,
  },
});

const UserPreferences = mongoose.model('UserPreferences', userPreferencesSchema);
module.exports = UserPreferences;


