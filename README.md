# SMS Bomber

## Overview
The SMS Bomber project is a tool designed for testing and educational purposes. It allows users to simulate the sending of multiple SMS messages to a specified phone number. This project is divided into two main parts:

1. **Client**: A frontend application built with modern web technologies to provide an intuitive user interface for interacting with the SMS Bomber.
2. **Server**: A backend application that handles the logic for sending SMS messages, rate limiting, and logging message activity.

## Features
- **Frontend**:
  - User-friendly interface for entering phone numbers and message details.
  - Real-time progress tracking of SMS sending.
  - Speed control options for message dispatch.
  - Status display for sent messages.

- **Backend**:
  - API endpoints for sending SMS messages.
  - Rate limiting to prevent abuse.
  - Message logging for tracking sent messages.
  - Utility functions for generating and managing SMS content.

## Project Structure
```
client/
  src/
    components/       # Reusable UI components
    hooks/            # Custom React hooks
    lib/              # Utility functions
    services/         # API service functions
server/
  src/
    controllers/      # API controllers
    models/           # Database models
    routes/           # API routes
    utils/            # Helper utilities
```

## Prerequisites
- **Node.js**: Ensure you have Node.js installed on your system.
- **Package Manager**: Use `npm` or `pnpm` for managing dependencies.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/BakhatMuneerDev01/sms-bomber.git
   ```
2. Navigate to the project directory:
   ```bash
   cd sms-bomber
   ```
3. Install dependencies for both client and server:
   ```bash
   cd client
   pnpm install
   cd ../server
   pnpm install
   ```

## Usage
1. Start the server:
   ```bash
   cd server
   npm run start
   ```
2. Start the client:
   ```bash
   cd client
   pnpm run dev
   ```
3. Open your browser and navigate to the client application (usually `http://localhost:5173`).

## Disclaimer
This project is intended for educational purposes only. Misuse of this tool for malicious purposes is strictly prohibited. Always ensure you have permission before sending SMS messages to any phone number.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing
Contributions are welcome! Feel free to open issues or submit pull requests to improve the project.
