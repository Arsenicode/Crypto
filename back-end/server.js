const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const userPreferencesRouter = require('./routes/userPreferences');
const { checkPrices } = require('./services/priceTracker');
const connectDB = require("./config/db"); // Import the connectDB function
const authRoutes = require("./routes/authRoutes");

dotenv.config(); // Load environment variables from .env
connectDB(); // Connect to MongoDB

const app = express();
app.use(cors());
app.use(express.json());

// Define routes
app.use("/api/auth", authRoutes);

// Test route to confirm the API is running
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Protected routes (to be secured via authentication)
const protectedRoutes = require("./routes/protectedRoute");
app.use("/api/protected", protectedRoutes);

// Routes for cryptocurrency data
const cryptoRoutes = require("./routes/cryptoRoutes");
app.use("/api/crypto", cryptoRoutes);

// User preferences routes for getting and updating preferences
app.use('/api/user', userPreferencesRouter);

// Uncomment and set an interval for checking prices periodically
// You could also move the price tracking to a job scheduler like `node-cron` for more control
//checkPrices(); // Start price tracking (if necessary)

// Optionally, set an interval to check prices every hour or another interval
// setInterval(() => {
//   checkPrices(); // Run the price check periodically
// }, 60 * 60 * 1000); // Every hour (adjust time interval as needed)

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
