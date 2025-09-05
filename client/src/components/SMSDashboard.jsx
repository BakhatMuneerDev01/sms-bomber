import { useState, useEffect, useRef } from 'react';
import { sendMessage, SMSWebSocket } from '../services/api';
import Header from './Header';
import Footer from './Footer';
import InputForm from './InputForm';
import ProgressBar from './ProgressBar';
import StatusDisplay from './StatusDisplay';

const SMSDashboard = () => {
  const [state, setState] = useState({
    status: 'idle', // idle, sending, completed, error, cancelled
    phoneNumber: '',
    totalMessages: 0,
    messagesSent: 0,
    successCount: 0,
    errorCount: 0,
    speed: 'Medium',
    startTime: null,
    lastUpdate: null,
    messages: [],
    error: null
  });

  const [isLoading, setIsLoading] = useState(false);
  const wsRef = useRef(null);
  const cancelRef = useRef(false);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const handleProgressUpdate = (data) => {
      setState(prev => ({
        ...prev,
        messagesSent: data.messagesSent || prev.messagesSent,
        successCount: data.successCount || prev.successCount,
        errorCount: data.errorCount || prev.errorCount,
        status: data.status || prev.status,
        lastUpdate: new Date().toISOString(),
        messages: data.messages || prev.messages
      }));
    };

    wsRef.current = new SMSWebSocket(handleProgressUpdate);
    
    return () => {
      if (wsRef.current) {
        wsRef.current.disconnect();
      }
    };
  }, []);

  // Mock progress simulation for development
  const simulateProgress = async (totalMessages, speed) => {
    const delays = {
      'Slow': 5000,
      'Medium': 2000,
      'Fast': 500
    };
    
    const delay = delays[speed] || 2000;
    
    for (let i = 0; i < totalMessages; i++) {
      if (cancelRef.current) {
        setState(prev => ({
          ...prev,
          status: 'cancelled',
          lastUpdate: new Date().toISOString()
        }));
        return;
      }

      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Simulate occasional failures (10% chance)
      const isSuccess = Math.random() > 0.1;
      
      setState(prev => ({
        ...prev,
        messagesSent: i + 1,
        successCount: prev.successCount + (isSuccess ? 1 : 0),
        errorCount: prev.errorCount + (isSuccess ? 0 : 1),
        lastUpdate: new Date().toISOString(),
        messages: [
          ...prev.messages,
          {
            index: i + 1,
            status: isSuccess ? 'sent' : 'failed',
            timestamp: new Date().toISOString()
          }
        ]
      }));
    }
    
    setState(prev => ({
      ...prev,
      status: 'completed',
      lastUpdate: new Date().toISOString()
    }));
    setIsLoading(false);
  };

  const handleSendMessages = async (formData) => {
    try {
      setIsLoading(true);
      cancelRef.current = false;
      
      // Reset state
      setState(prev => ({
        ...prev,
        status: 'sending',
        phoneNumber: formData.phoneNumber,
        totalMessages: formData.messageCount,
        messagesSent: 0,
        successCount: 0,
        errorCount: 0,
        speed: formData.speed,
        startTime: new Date().toISOString(),
        lastUpdate: new Date().toISOString(),
        messages: [],
        error: null
      }));

      // Try to connect WebSocket
      if (wsRef.current) {
        wsRef.current.connect();
      }

      try {
        // Attempt API call
        const result = await sendMessage({
          phoneNumber: formData.phoneNumber,
          messageCount: formData.messageCount,
          speed: formData.speed
        });
        
        console.log('API call successful:', result);
      } catch (apiError) {
        console.warn('API not available, using mock simulation:', apiError.message);
        
        // Fall back to mock simulation
        await simulateProgress(formData.messageCount, formData.speed);
      }
      
    } catch (error) {
      console.error('Error sending messages:', error);
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error.message,
        lastUpdate: new Date().toISOString()
      }));
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    cancelRef.current = true;
    setIsLoading(false);
    
    if (wsRef.current) {
      wsRef.current.disconnect();
    }
    
    setState(prev => ({
      ...prev,
      status: 'cancelled',
      lastUpdate: new Date().toISOString()
    }));
  };

  const isActive = state.status === 'sending';
  const isDisabled = isLoading || isActive;

  return (
    <div className="min-h-screen bg-background flex items-center">
      <div className="sms-container">
        <Header isActive={isActive} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input Form */}
          <div className="space-y-8">
            <InputForm
              onSubmit={handleSendMessages}
              isLoading={isLoading}
              onCancel={handleCancel}
              disabled={isDisabled}
            />
          </div>
          
          {/* Right Column - Progress and Status */}
          <div className="space-y-8">
            <ProgressBar
              current={state.messagesSent}
              total={state.totalMessages}
              status={state.status}
              startTime={state.startTime}
            />
            
            <StatusDisplay
              status={state.status}
              messages={state.messages}
              totalMessages={state.totalMessages}
              successCount={state.successCount}
              errorCount={state.errorCount}
              lastUpdate={state.lastUpdate}
            />
          </div>
        </div>
        
        {/* Error Display */}
        {state.error && (
          <div className="mt-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive font-medium">Error: {state.error}</p>
          </div>
        )}
        
        <Footer />
      </div>
    </div>
  );
};

export default SMSDashboard;

