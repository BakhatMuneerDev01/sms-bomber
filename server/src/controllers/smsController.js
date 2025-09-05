const twilio = require('twilio');
const MessageLog = require('../models/MessageLog');
const { generateRandomMessage } = require('../utils/messageGenerator');

// Initialize Twilio client with credentials from environment variables
// Replace TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN with your actual Twilio credentials
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID, // Your Twilio Account SID
  process.env.TWILIO_AUTH_TOKEN   // Your Twilio Auth Token
);

/**
 * Validates phone number format (E.164)
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidPhoneNumber(phoneNumber) {
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phoneNumber);
}

/**
 * Validates speed parameter
 * @param {string} speed - Speed setting to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidSpeed(speed) {
  return ['Fast', 'Medium', 'Slow'].includes(speed);
}

/**
 * Gets delay in milliseconds based on speed setting
 * @param {string} speed - Speed setting ('Fast', 'Medium', 'Slow')
 * @returns {number} Delay in milliseconds
 */
function getDelayFromSpeed(speed) {
  const delays = {
    'Slow': 5000,   // 5 seconds
    'Medium': 2000, // 2 seconds
    'Fast': 500     // 0.5 seconds
  };
  return delays[speed] || 2000; // Default to Medium if invalid
}

/**
 * Logs message to database
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} messageBody - Message content
 * @param {string} status - Twilio status
 * @param {string} messageSid - Twilio message SID (optional)
 */
async function logMessage(phoneNumber, messageBody, status, messageSid = null) {
  try {
    const newLog = new MessageLog({
      phoneNumber,
      messageBody,
      twilioStatus: status,
      twilioMessageSid: messageSid
    });
    await newLog.save();
    console.log(`Message logged: ${status} - ${phoneNumber}`);
  } catch (error) {
    console.error('Failed to log message:', error.message);
  }
}

/**
 * Sends a single SMS message
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} messageBody - Message content
 * @returns {Promise<Object>} Twilio response or error
 */
async function sendSingleMessage(phoneNumber, messageBody) {
  try {
    const message = await twilioClient.messages.create({
      body: messageBody,
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER // Replace with your actual Twilio phone number
    });

    // Log successful message
    await logMessage(phoneNumber, messageBody, message.status, message.sid);
    
    return {
      success: true,
      status: message.status,
      sid: message.sid
    };
  } catch (error) {
    console.error(`Failed to send message to ${phoneNumber}:`, error.message);
    
    // Log failed message
    await logMessage(phoneNumber, messageBody, 'failed');
    
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Main SMS sending function with queue and speed control
 * @param {string} phoneNumber - Recipient phone number
 * @param {number} messageCount - Number of messages to send
 * @param {string} speed - Speed setting ('Fast', 'Medium', 'Slow')
 * @returns {Promise<Object>} Result summary
 */
async function sendMessages(phoneNumber, messageCount, speed) {
  const delay = getDelayFromSpeed(speed);
  const results = {
    total: messageCount,
    sent: 0,
    failed: 0,
    details: []
  };

  console.log(`Starting to send ${messageCount} messages to ${phoneNumber} at ${speed} speed (${delay}ms delay)`);

  // Send messages sequentially with delay
  for (let i = 0; i < messageCount; i++) {
    try {
      // Wait for the specified delay (except for the first message)
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      // Generate random message content
      const messageBody = generateRandomMessage(i + 1, messageCount);

      // Send the message
      const result = await sendSingleMessage(phoneNumber, messageBody);

      if (result.success) {
        results.sent++;
        results.details.push({
          messageIndex: i + 1,
          status: 'sent',
          sid: result.sid
        });
      } else {
        results.failed++;
        results.details.push({
          messageIndex: i + 1,
          status: 'failed',
          error: result.error
        });
      }

      console.log(`Message ${i + 1}/${messageCount}: ${result.success ? 'Sent' : 'Failed'}`);

    } catch (error) {
      console.error(`Unexpected error sending message ${i + 1}:`, error.message);
      results.failed++;
      results.details.push({
        messageIndex: i + 1,
        status: 'failed',
        error: error.message
      });
    }
  }

  console.log(`SMS sending completed. Sent: ${results.sent}, Failed: ${results.failed}`);
  return results;
}

/**
 * Express controller for SMS sending endpoint
 * Handles POST /api/send-sms requests
 */
const sendSmsController = async (req, res) => {
  try {
    const { phoneNumber, messageCount, speed } = req.body;

    // Validate required fields
    if (!phoneNumber || !messageCount || !speed) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: phoneNumber, messageCount, and speed are required.'
      });
    }

    // Validate phone number format
    if (!isValidPhoneNumber(phoneNumber)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid phone number format. Please use E.164 format (e.g., +1234567890).'
      });
    }

    // Validate message count
    if (!Number.isInteger(messageCount) || messageCount < 1 || messageCount > 100) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid message count. Must be an integer between 1 and 100.'
      });
    }

    // Validate speed
    if (!isValidSpeed(speed)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid speed. Must be one of: Fast, Medium, Slow.'
      });
    }

    // Send immediate response to client
    res.status(200).json({
      status: 'success',
      message: 'SMS sending process initiated.',
      details: {
        phoneNumber,
        messageCount,
        speed,
        estimatedDuration: `${Math.ceil((messageCount * getDelayFromSpeed(speed)) / 1000)} seconds`
      }
    });

    // Start sending messages asynchronously (don't await)
    sendMessages(phoneNumber, messageCount, speed)
      .then(results => {
        console.log('SMS batch completed:', results);
        // Here you could emit WebSocket events or store completion status
      })
      .catch(error => {
        console.error('SMS batch failed:', error);
      });

  } catch (error) {
    console.error('SMS Controller Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error occurred while processing SMS request.'
    });
  }
};

/**
 * Get SMS logs controller
 * Handles GET /api/sms-logs requests
 */
const getSmsLogsController = async (req, res) => {
  try {
    const { phoneNumber, limit = 50, page = 1 } = req.query;
    
    const query = phoneNumber ? { phoneNumber } : {};
    const skip = (page - 1) * limit;

    const logs = await MessageLog.find(query)
      .sort({ sentAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const total = await MessageLog.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        logs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get SMS Logs Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve SMS logs.'
    });
  }
};

module.exports = {
  sendSmsController,
  getSmsLogsController,
  sendMessages // Export for potential direct use
};

