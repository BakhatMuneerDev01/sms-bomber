require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes and middleware
const smsRoutes = require('./routes/smsRoutes.js');
const { apiLimiter } = require('./utils/rateLimiter.js');

// Initialize Express app
const app = express();

// Get port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;

/**
 * Middleware Configuration
 */

// Enable CORS for all origins (adjust in production for security)
app.use(cors({
  origin: '*', // Replace with specific origins in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Apply general rate limiting to all API routes
app.use('/api', apiLimiter);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

/**
 * Database Connection
 * Connect to MongoDB using the connection string from environment variables
 */
async function connectToDatabase() {
  try {
    // Replace MONGO_URI with your actual MongoDB connection string
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Please check your MONGO_URI environment variable');
    process.exit(1); // Exit if database connection fails
  }
}

/**
 * Routes Configuration
 */

// API routes
app.use('/api', smsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'SMS Backend API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      sendSms: 'POST /api/send-sms',
      smsLogs: 'GET /api/sms-logs',
      status: '/api/status'
    },
    documentation: 'See README.md for API documentation'
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'GET /api/status',
      'POST /api/send-sms',
      'GET /api/sms-logs'
    ]
  });
});

/**
 * Global Error Handler
 */
app.use((error, req, res, next) => {
  console.error('Global Error Handler:', error);
  
  res.status(error.status || 500).json({
    status: 'error',
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

/**
 * Graceful Shutdown Handler
 */
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  
  try {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  
  try {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

/**
 * Start Server
 */
async function startServer() {
  try {
    // Connect to database first
    await connectToDatabase();
    
    // Start the server - Listen on 0.0.0.0 for external access
    // app.listen(PORT, '0.0.0.0', () => {
    //   console.log(`🚀 SMS Backend Server is running on port ${PORT}`);
    //   console.log(`📱 API Base URL: http://localhost:${PORT}/api`);
    //   console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    //   console.log(`📊 Status: http://localhost:${PORT}/api/status`);
    //   console.log('');
    //   console.log('Environment Variables Required:');
    //   console.log('- MONGO_URI: MongoDB connection string');
    //   console.log('- TWILIO_ACCOUNT_SID: Your Twilio Account SID');
    //   console.log('- TWILIO_AUTH_TOKEN: Your Twilio Auth Token');
    //   console.log('- TWILIO_PHONE_NUMBER: Your Twilio phone number');
    //   console.log('');
    //   console.log('Ready to accept SMS requests! 📨');
    // });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = app;

