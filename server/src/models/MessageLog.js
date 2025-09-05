const mongoose = require('mongoose');

/**
 * MessageLog Schema
 * Stores records of each SMS message sent through the system
 */
const messageLogSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    // E.164 format validation
    match: /^\+[1-9]\d{1,14}$/
  },
  messageBody: {
    type: String,
    required: true,
    maxlength: 1600 // SMS character limit
  },
  twilioStatus: {
    type: String,
    required: true,
    enum: ['queued', 'sending', 'sent', 'failed', 'delivered', 'undelivered']
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  // Optional: Store Twilio message SID for tracking
  twilioMessageSid: {
    type: String,
    sparse: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Index for efficient queries
messageLogSchema.index({ phoneNumber: 1, sentAt: -1 });
messageLogSchema.index({ twilioStatus: 1 });

module.exports = mongoose.model('MessageLog', messageLogSchema);

