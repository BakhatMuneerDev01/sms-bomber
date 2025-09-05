import { MessageSquare, Zap } from 'lucide-react';

const Header = ({ isActive = false }) => {
  return (
    <header className="sms-card mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <MessageSquare className="h-8 w-8 text-primary" />
            {isActive && (
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-success rounded-full animate-pulse" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">SMS Dashboard</h1>
            <p className="text-sm text-muted-foreground">Send messages with real-time tracking</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
            isActive 
              ? 'bg-success/20 text-success' 
              : 'bg-muted text-muted-foreground'
          }`}>
            <Zap className="h-4 w-4" />
            <span>{isActive ? 'Active' : 'Ready'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

