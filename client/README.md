# SMS Dashboard Frontend

A professional React-based SMS dashboard application with real-time progress tracking and a modern dark theme interface.

## Features

### 🎨 Modern UI/UX Design
- **Dark Theme**: Professional slate background with lime green accents
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Interactive Elements**: Smooth animations and micro-interactions
- **Accessibility**: High contrast ratios and keyboard navigation support

### 📱 Core Functionality
- **Phone Number Input**: E.164 format validation with real-time feedback
- **Message Count Control**: Adjustable message count (1-100) with increment/decrement buttons
- **Speed Control**: Three speed options (Slow, Medium, Fast) with visual indicators
- **Real-time Progress**: Live progress bar with percentage and time tracking
- **Status Monitoring**: Comprehensive status display with success/error counts
- **Activity Log**: Expandable recent activity with message timestamps

### 🔧 Technical Features
- **React 18+**: Modern React with hooks and functional components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide Icons**: Beautiful, consistent iconography
- **WebSocket Ready**: Real-time communication support
- **API Integration**: RESTful API integration with fallback simulation
- **Error Handling**: Comprehensive error states and user feedback

## Project Structure

```
sms-dashboard/
├── src/
│   ├── components/
│   │   ├── Header.jsx              # Application header with status
│   │   ├── Footer.jsx              # Footer with terms and disclaimers
│   │   ├── InputForm.jsx           # Main form container
│   │   ├── PhoneNumberInput.jsx    # Phone number input with validation
│   │   ├── MessageCountInput.jsx   # Message count selector
│   │   ├── SpeedControlButtons.jsx # Speed selection buttons
│   │   ├── ProgressBar.jsx         # Real-time progress tracking
│   │   ├── StatusDisplay.jsx       # Status and activity monitoring
│   │   └── SMSDashboard.jsx        # Main dashboard component
│   ├── services/
│   │   └── api.js                  # API integration and WebSocket
│   ├── App.jsx                     # Root application component
│   ├── App.css                     # Custom styles and theme
│   └── main.jsx                    # Application entry point
├── public/
├── package.json
└── README.md
```

## Design System

### Color Palette
- **Background**: #1E293B (slate-800)
- **Primary Text**: #F1F5F9 (slate-100)
- **Accent/Interactive**: #A3E635 (lime-400)
- **Cards/Containers**: #334155 (slate-700)
- **Success**: #65A30D (green-600)
- **Error**: #EF4444 (red-500)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 400 (Regular), 600 (Semi-bold), 700 (Bold)

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Hover effects with scale animations
- **Inputs**: Focus states with accent color borders
- **Progress**: Gradient progress bars with smooth transitions

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd sms-dashboard

# Install dependencies
pnpm install

# Start development server
pnpm run dev --host
```

### Development
The application will be available at `http://localhost:5173` (or next available port).

### Building for Production
```bash
# Build the application
pnpm run build

# Preview the build
pnpm run preview
```

## API Integration

### Backend Requirements
The frontend expects a backend API with the following endpoint:

**POST** `/api/send-sms`
```json
{
  "phoneNumber": "+1234567890",
  "messageCount": 10,
  "speed": "Medium"
}
```

### WebSocket Support
Real-time progress updates via WebSocket connection at `ws://localhost:5000`.

### Mock Mode
If the backend is not available, the application automatically falls back to mock simulation mode for development and testing.

## Features Demonstration

### Form Validation
- Real-time phone number validation (E.164 format)
- Visual feedback with success/error indicators
- Form summary with user-friendly descriptions

### Progress Tracking
- Real-time progress bar with smooth animations
- Elapsed time and ETA calculations
- Success/failure statistics
- Individual message status tracking

### Responsive Design
- Mobile-first approach
- Touch-friendly interface on mobile devices
- Adaptive layouts for different screen sizes
- Consistent experience across devices

### User Experience
- Intuitive form controls
- Clear visual hierarchy
- Helpful placeholder text and instructions
- Professional loading states and transitions

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Educational Use Notice
This tool is designed for educational and testing purposes only. Users must ensure compliance with all applicable telecommunications laws in their jurisdiction, including but not limited to the TCPA, GDPR, and similar regulations.

## License
Educational use only. See Terms & Conditions for full details.