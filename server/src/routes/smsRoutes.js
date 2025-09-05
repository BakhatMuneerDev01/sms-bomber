const express = require('express');
const { sendSmsController, getSmsLogsController } = require('../controllers/smsController');
const { smsLimiter } = require('../utils/rateLimiter');

const router = express.Router();

/**
 * SMS Routes
 * Defines all SMS-related API endpoints
 */

/**
 * POST /api/send-sms
 * Send SMS messages to a phone number
 * 
 * Request Body:
 * {
 *   "phoneNumber": "+1234567890",  // E.164 format required
 *   "messageCount": 10,            // Integer >= 1
 *   "speed": "Fast"                // "Fast", "Medium", or "Slow"
 * }
 * 
 * Response:
 * {
 *   "status": "success",
 *   "message": "SMS sending process initiated."
 * }
 */
router.post('/send-sms', smsLimiter, sendSmsController);

/**
 * GET /api/sms-logs
 * Retrieve SMS message logs
 * 
 * Query Parameters:
 * - phoneNumber (optional): Filter by phone number
 * - limit (optional): Number of records per page (default: 50)
 * - page (optional): Page number (default: 1)
 * 
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "logs": [...],
 *     "pagination": {...}
 *   }
 * }
 */
router.get('/sms-logs', getSmsLogsController);

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'SMS Backend API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * GET /api/status
 * API status and configuration info (non-sensitive)
 */
router.get('/status', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      service: 'SMS Backend API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 5000,
      database: 'Connected', // You could add actual DB connection check here
      features: {
        smsSupported: true,
        rateLimitingEnabled: true,
        loggingEnabled: true
      }
    }
  });
});

module.exports = router;

