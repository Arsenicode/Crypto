// routes/userPreferences.js
const express = require('express');
const router = express.Router();
const UserPreferences = require('../models/UserPreference');

// Route to get user preferences
router.get('/preferences', async (req, res) => {
  try {
    const user = await UserPreferences.findOne({ userEmail: req.params.email });
    if (!user) {
      return res.status(404).json({ message: 'User preferences not found.' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to save user preferences
router.post('/preferences', async (req, res) => {
  const { userEmail, selectedCoins } = req.body;

  try {
    let user = await UserPreferences.findOne({ userEmail });

    if (user) {
      // If the user exists, update their preferences
      user.selectedCoins = selectedCoins;
      await user.save();
      return res.status(200).json({ message: 'Preferences updated.' });
    }

    // If the user does not exist, create a new entry
    user = new UserPreferences({ userEmail, selectedCoins });
    await user.save();
    res.status(201).json({ message: 'Preferences saved.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
