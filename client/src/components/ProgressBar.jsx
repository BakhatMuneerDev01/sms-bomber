import { useState, useEffect } from 'react';
import { Activity, CheckCircle, XCircle } from 'lucide-react';

const ProgressBar = ({ 
  current = 0, 
  total = 0, 
  status = 'idle', // idle, sending, completed, error
  startTime = null 
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  
  useEffect(() => {
    let interval;
    if (status === 'sending' && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const start = new Date(startTime);
        setElapsedTime(Math.floor((now - start) / 1000));
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, startTime]);

  const percentage = total > 0 ? (current / total) * 100 : 0;
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return <Activity className="h-5 w-5 text-primary animate-pulse" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Activity className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'sending':
        return 'Sending messages...';
      case 'completed':
        return 'All messages sent successfully!';
      case 'error':
        return 'Error occurred during sending';
      default:
        return 'Ready to send';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'sending':
        return 'text-primary';
      case 'completed':
        return 'text-success';
      case 'error':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="sms-card">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <h3 className="text-lg font-semibold text-foreground">Progress</h3>
          </div>
          
          {status === 'sending' && (
            <div className="text-sm text-muted-foreground">
              {formatTime(elapsedTime)}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Messages sent</span>
            <span className="font-medium text-foreground">
              {current} / {total}
            </span>
          </div>
          
          <div className="sms-progress-bar">
            <div 
              className="sms-progress-fill"
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span className="font-medium">{percentage.toFixed(1)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Status */}
        <div className="pt-2 border-t border-border">
          <p className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </p>
          
          {status === 'sending' && total > 0 && (
            <div className="mt-2 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div>
                <span className="block">Remaining:</span>
                <span className="font-medium text-foreground">{total - current}</span>
              </div>
              <div>
                <span className="block">ETA:</span>
                <span className="font-medium text-foreground">
                  {current > 0 && elapsedTime > 0 
                    ? formatTime(Math.ceil((total - current) * (elapsedTime / current)))
                    : '--:--'
                  }
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;

