// services/priceTracker.js
const axios = require('axios');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const UserPreferences = require('../models/UserPreference');
require('dotenv').config();

// Function to check price and send email if price has changed
const checkPrices = async () => {
  try {
    // Fetch the list of all coins from the API
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: { vs_currency: 'usd' },
    });
    const coins = response.data;

    // Loop through all users and check if any selected coin has changed price
    const users = await UserPreferences.find();

    users.forEach(async (user) => {
      const { selectedCoins } = user;
      selectedCoins.forEach((coinName) => {
        const coin = coins.find((c) => c.name.toLowerCase() === coinName.toLowerCase());
        if (coin) {
          // Check if the coin's price has changed significantly (e.g., 5% change)
          const previousPrice = coin.current_price;
          const previousRecord = user.priceHistory[coinName] || 0;
          const priceChangePercentage = ((previousPrice - previousRecord) / previousRecord) * 100;

          if (Math.abs(priceChangePercentage) >= 5) {
            // Send an email notification
            sendEmailNotification(user.userEmail, coin.name, previousPrice, coin.current_price);
          }

          // Update user's price history
          user.priceHistory[coinName] = coin.current_price;
        }
      });
      await user.save();
    });
  } catch (error) {
    console.error('Error checking prices:', error);
  }
};

// Function to send an email notification
const sendEmailNotification = (userEmail, coinName, oldPrice, newPrice) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Price Change Notification for ${coinName}`,
    text: `The price of ${coinName} has changed from $${oldPrice} to $${newPrice}.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Run the price checker every 10 minutes (for example)
cron.schedule('*/10 * * * *', checkPrices);

module.exports = { checkPrices };
