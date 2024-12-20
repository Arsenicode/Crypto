// src/routes/cryptoRoutes.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

// Route to get a list of cryptos
router.get('/cryptos', async (req, res) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        sparkline: true,
        price_change_percentage: '1h,24h,7d,30d',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching cryptocurrency data.');
  }
});

// Route to get detailed information for a specific coin by name
router.get("/cryptos/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${name}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching coin details.");
  }
});

module.exports = router;
