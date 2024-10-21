const cors = require('cors')
const dotenv = require('dotenv');
const express = require('express');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
const userRoutes = require('./routes/userRoutes');
const auctionRoutes = require('./routes/auctionRoutes');

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();

app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
connectDB();

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API routes
app.use('/api/users', userRoutes);      // User authentication routes
app.use('/api/auctions', auctionRoutes); // Auction and bidding routes

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Define a PORT and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
