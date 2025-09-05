/**
 * Message Generator Utility
 * Generates random message content for SMS sending
 */

const messageTemplates = [
  "Hello! This is a test message from our SMS service.",
  "Greetings! Hope you're having a great day!",
  "This is an automated message to test our SMS functionality.",
  "Hi there! Just checking if our SMS service is working properly.",
  "Test message #{count} - SMS delivery verification in progress.",
  "Hello! This is message number #{count} from our testing system.",
  "Automated SMS test - Message #{count} of #{total}.",
  "SMS Service Test: Message #{count} successfully queued for delivery.",
  "Testing SMS functionality - This is message #{count}.",
  "Hello! SMS test message #{count} sent at {timestamp}."
];

/**
 * Generates a random message with optional placeholders
 * @param {number} messageIndex - Current message index (1-based)
 * @param {number} totalMessages - Total number of messages being sent
 * @returns {string} Generated message content
 */
function generateRandomMessage(messageIndex = 1, totalMessages = 1) {
  const randomTemplate = messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
  
  // Replace placeholders with actual values
  return randomTemplate
    .replace(/#{count}/g, messageIndex)
    .replace(/#{total}/g, totalMessages)
    .replace(/\{timestamp\}/g, new Date().toLocaleString());
}

/**
 * Generates a custom message with user-provided content
 * @param {string} customContent - Custom message content
 * @param {number} messageIndex - Current message index
 * @returns {string} Formatted message
 */
function generateCustomMessage(customContent, messageIndex = 1) {
  return `${customContent} (Message #${messageIndex})`;
}

module.exports = {
  generateRandomMessage,
  generateCustomMessage
};

