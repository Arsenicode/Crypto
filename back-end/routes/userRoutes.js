const express = require("express");
const User = require("../models/User");
const { sendPriceChangeEmail } = require("../utils/emailService"); // Import the email service
const router = express.Router();

// Route to get all registered users' emails
router.get("/emails", async (req, res) => {
  try {
    const users = await User.find().select("email"); // Get all users' emails
    res.json(users); // Send the list of emails to the frontend
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;
