# SMS Backend API

A Node.js backend service for sending SMS messages using Twilio with rate limiting, message logging, and queue management.

## Features

- 📱 Send SMS messages via Twilio API
- 🚦 Configurable sending speed (Fast, Medium, Slow)
- 📊 Message logging to MongoDB
- 🛡️ Rate limiting to prevent abuse
- 🔄 Sequential message sending with delays
- 📝 Comprehensive API documentation
- ⚡ Express.js REST API
- 🗄️ MongoDB integration with Mongoose

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Twilio account with SMS capabilities

## Installation

1. Clone or download the project
2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
# Server Configuration
PORT=5000

# MongoDB Configuration
# Replace with your actual MongoDB connection string
MONGO_URI=mongodb://localhost:27017/sms-backend

# Twilio Configuration
# Replace with your actual Twilio Account SID from https://console.twilio.com/
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here

# Replace with your actual Twilio Auth Token from https://console.twilio.com/
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here

# Replace with your actual Twilio phone number in E.164 format (e.g., +1234567890)
TWILIO_PHONE_NUMBER=+1234567890
```

## Getting Your Twilio Credentials

1. Sign up for a Twilio account at https://www.twilio.com/
2. Go to the Twilio Console: https://console.twilio.com/
3. Find your Account SID and Auth Token on the dashboard
4. Purchase a phone number or use the trial number
5. Replace the placeholder values in your `.env` file

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT).

## API Endpoints

### 1. Send SMS Messages
**POST** `/api/send-sms`

Send multiple SMS messages to a phone number with configurable speed.

**Request Body:**
```json
{
  "phoneNumber": "+1234567890",
  "messageCount": 10,
  "speed": "Fast"
}
```

**Parameters:**
- `phoneNumber` (string, required): Phone number in E.164 format
- `messageCount` (number, required): Number of messages to send (1-100)
- `speed` (string, required): Sending speed - "Fast" (0.5s), "Medium" (2s), or "Slow" (5s)

**Success Response (200):**
```json
{
  "status": "success",
  "message": "SMS sending process initiated.",
  "details": {
    "phoneNumber": "+1234567890",
    "messageCount": 10,
    "speed": "Fast",
    "estimatedDuration": "5 seconds"
  }
}
```

**Error Response (400):**
```json
{
  "status": "error",
  "message": "Invalid phone number format. Please use E.164 format (e.g., +1234567890)."
}
```

### 2. Get SMS Logs
**GET** `/api/sms-logs`

Retrieve SMS message logs with pagination.

**Query Parameters:**
- `phoneNumber` (optional): Filter by phone number
- `limit` (optional): Records per page (default: 50)
- `page` (optional): Page number (default: 1)

**Example:** `/api/sms-logs?phoneNumber=+1234567890&limit=20&page=1`

**Response:**
```json
{
  "status": "success",
  "data": {
    "logs": [
      {
        "_id": "...",
        "phoneNumber": "+1234567890",
        "messageBody": "Hello! This is a test message...",
        "twilioStatus": "sent",
        "sentAt": "2024-01-15T10:30:00.000Z",
        "twilioMessageSid": "SM..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

### 3. Health Check
**GET** `/api/health`

Check if the API is running.

**Response:**
```json
{
  "status": "success",
  "message": "SMS Backend API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600
}
```

### 4. API Status
**GET** `/api/status`

Get API status and configuration information.

**Response:**
```json
{
  "status": "success",
  "data": {
    "service": "SMS Backend API",
    "version": "1.0.0",
    "environment": "development",
    "port": 5000,
    "database": "Connected",
    "features": {
      "smsSupported": true,
      "rateLimitingEnabled": true,
      "loggingEnabled": true
    }
  }
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **General API**: 100 requests per 15 minutes per IP
- **SMS Endpoint**: 10 requests per hour per IP

When rate limit is exceeded, you'll receive a 429 status code:
```json
{
  "status": "error",
  "message": "Too many requests from this IP, please try again after 15 minutes."
}
```

## Database Schema

### MessageLog Collection
```javascript
{
  phoneNumber: String,      // E.164 format phone number
  messageBody: String,      // SMS message content
  twilioStatus: String,     // Twilio status (queued, sent, failed, etc.)
  sentAt: Date,            // Timestamp when message was sent
  twilioMessageSid: String, // Twilio message ID for tracking
  createdAt: Date,         // Auto-generated timestamp
  updatedAt: Date          // Auto-generated timestamp
}
```

## Project Structure

```
sms-backend/
├── src/
│   ├── controllers/
│   │   └── smsController.js     # SMS business logic
│   ├── models/
│   │   └── MessageLog.js        # MongoDB schema
│   ├── routes/
│   │   └── smsRoutes.js         # API route definitions
│   ├── utils/
│   │   ├── messageGenerator.js  # Random message generation
│   │   └── rateLimiter.js       # Rate limiting configuration
│   └── server.js                # Main server file
├── package.json                 # Dependencies and scripts
├── .env.example                 # Environment variables template
└── README.md                    # This file
```

## Error Handling

The API provides comprehensive error handling:

- **400 Bad Request**: Invalid input data
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server or database errors

All errors follow this format:
```json
{
  "status": "error",
  "message": "Descriptive error message"
}
```

## Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Validates phone numbers and parameters
- **Environment Variables**: Sensitive data stored securely
- **CORS Configuration**: Configurable cross-origin access
- **Error Sanitization**: No sensitive data in error responses

## Testing the API

### Using curl:
```bash
# Send SMS
curl -X POST http://localhost:5000/api/send-sms \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1234567890",
    "messageCount": 3,
    "speed": "Medium"
  }'

# Get logs
curl http://localhost:5000/api/sms-logs

# Health check
curl http://localhost:5000/api/health
```

### Using Postman:
1. Import the API endpoints
2. Set Content-Type to `application/json`
3. Use the request body examples above

## Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Configure proper CORS origins
4. Set up process management (PM2, Docker, etc.)

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src/ ./src/
EXPOSE 5000
CMD ["npm", "start"]
```

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Check your `MONGO_URI` in `.env`
   - Ensure MongoDB is running
   - Verify network connectivity

2. **Twilio Authentication Error**
   - Verify `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN`
   - Check Twilio account status
   - Ensure phone number is verified

3. **Rate Limit Issues**
   - Wait for the rate limit window to reset
   - Consider implementing user-specific rate limiting

4. **Phone Number Format Error**
   - Use E.164 format: `+1234567890`
   - Include country code
   - No spaces or special characters

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Twilio documentation
3. Check MongoDB connection
4. Verify environment variables

---

**Note**: Remember to replace all placeholder values in your `.env` file with actual credentials before running the application.

