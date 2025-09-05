import { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare, 
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const StatusDisplay = ({ 
  status = 'idle', 
  messages = [],
  totalMessages = 0,
  successCount = 0,
  errorCount = 0,
  lastUpdate = null
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [recentMessages, setRecentMessages] = useState([]);

  useEffect(() => {
    // Keep only the last 5 messages for display
    setRecentMessages(messages.slice(-5));
  }, [messages]);

  const getStatusConfig = () => {
    switch (status) {
      case 'sending':
        return {
          icon: Clock,
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/20',
          title: 'Sending in Progress',
          description: 'Messages are being sent...'
        };
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          title: 'Sending Complete',
          description: 'All messages have been processed'
        };
      case 'error':
        return {
          icon: XCircle,
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/20',
          title: 'Error Occurred',
          description: 'Some messages failed to send'
        };
      case 'cancelled':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20',
          title: 'Sending Cancelled',
          description: 'Operation was cancelled by user'
        };
      default:
        return {
          icon: Info,
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/50',
          borderColor: 'border-border',
          title: 'Ready',
          description: 'Waiting for messages to send'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="sms-card">
      <div className="space-y-4">
        {/* Status Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Status</h3>
          </div>
          
          {lastUpdate && (
            <span className="text-xs text-muted-foreground">
              Updated {formatTimestamp(lastUpdate)}
            </span>
          )}
        </div>

        {/* Current Status */}
        <div className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor}`}>
          <div className="flex items-center space-x-3">
            <Icon className={`h-6 w-6 ${config.color} ${status === 'sending' ? 'animate-pulse' : ''}`} />
            <div className="flex-1">
              <h4 className={`font-medium ${config.color}`}>{config.title}</h4>
              <p className="text-sm text-muted-foreground">{config.description}</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {totalMessages > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-foreground">{totalMessages}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            
            <div className="text-center p-3 bg-success/10 rounded-lg">
              <div className="text-lg font-bold text-success">{successCount}</div>
              <div className="text-xs text-muted-foreground">Success</div>
            </div>
            
            <div className="text-center p-3 bg-destructive/10 rounded-lg">
              <div className="text-lg font-bold text-destructive">{errorCount}</div>
              <div className="text-xs text-muted-foreground">Failed</div>
            </div>
          </div>
        )}

        {/* Recent Messages Log */}
        {recentMessages.length > 0 && (
          <div className="border-t border-border pt-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-between w-full text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              <span>Recent Activity</span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            
            {isExpanded && (
              <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                {recentMessages.map((message, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted/30 rounded text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      {message.status === 'sent' ? (
                        <CheckCircle className="h-3 w-3 text-success" />
                      ) : (
                        <XCircle className="h-3 w-3 text-destructive" />
                      )}
                      <span className="text-muted-foreground">
                        Message {message.index || index + 1}
                      </span>
                    </div>
                    <span className="text-muted-foreground">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {status === 'idle' && totalMessages === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">
              No messages sent yet. Fill out the form to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusDisplay;

