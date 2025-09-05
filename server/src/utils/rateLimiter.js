const rateLimit = require('express-rate-limit');

/**
 * Rate Limiter Configuration
 * Prevents abuse by limiting the number of requests per IP address
 */

/**
 * General API rate limiter
 * Limits requests to prevent abuse
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      message: 'Too many requests from this IP, please try again after 15 minutes.'
    });
  }
});

/**
 * Strict rate limiter for SMS sending endpoint
 * More restrictive to prevent SMS spam
 */
const smsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15, // Limit each IP to 10 SMS requests per hour
  message: {
    status: 'error',
    message: 'Too many SMS requests from this IP, please try again after 1 hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      message: 'Too many SMS requests from this IP, please try again after 1 hour.'
    });
  }
});

/**
 * Create a custom rate limiter
 * @param {number} windowMs - Time window in milliseconds
 * @param {number} max - Maximum number of requests per window
 * @param {string} message - Error message to return
 * @returns {Function} Express middleware function
 */
function createCustomLimiter(windowMs, max, message) {
  return rateLimit({
    windowMs,
    max,
    message: {
      status: 'error',
      message
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        status: 'error',
        message
      });
    }
  });
}

module.exports = {
  apiLimiter,
  smsLimiter,
  createCustomLimiter
};

