const API_BASE_URL = 'http://localhost:5000/api';

export const sendMessage = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/send-sms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to send SMS');
    }

    return result;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Mock data for development
export const mockData = {
  messageStatus: "success",
  totalMessages: 10,
  messagesSent: 0,
  progressPercentage: 0,
  startTime: "2025-09-02T12:00:00Z"
};

// WebSocket connection for real-time updates
export class SMSWebSocket {
  constructor(onProgressUpdate) {
    this.onProgressUpdate = onProgressUpdate;
    this.ws = null;
  }

  connect() {
    try {
      this.ws = new WebSocket('ws://localhost:5000');
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const progressData = JSON.parse(event.data);
          this.onProgressUpdate(progressData);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

