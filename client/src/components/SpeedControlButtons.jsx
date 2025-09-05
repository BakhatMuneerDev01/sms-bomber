import { Gauge, Zap, Clock, Turtle } from 'lucide-react';

const SpeedControlButtons = ({ value, onChange, disabled }) => {
  const speedOptions = [
    {
      value: 'Slow',
      label: 'Slow',
      description: '5 sec delay',
      icon: Turtle,
      color: 'text-blue-400'
    },
    {
      value: 'Medium',
      label: 'Medium',
      description: '2 sec delay',
      icon: Clock,
      color: 'text-yellow-400'
    },
    {
      value: 'Fast',
      label: 'Fast',
      description: '0.5 sec delay',
      icon: Zap,
      color: 'text-primary'
    }
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground flex items-center space-x-2">
        <Gauge className="h-4 w-4" />
        <span>Sending Speed</span>
      </label>
      
      <div className="grid grid-cols-3 gap-2">
        {speedOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.value;
          
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              disabled={disabled}
              className={`
                relative p-3 rounded-lg border transition-all duration-200 
                ${isSelected 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-border bg-card hover:border-primary/50 text-muted-foreground hover:text-foreground'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
              `}
            >
              <div className="flex flex-col items-center space-y-1">
                <Icon className={`h-5 w-5 ${isSelected ? 'text-primary' : option.color}`} />
                <span className="text-sm font-medium">{option.label}</span>
                <span className="text-xs opacity-75">{option.description}</span>
              </div>
              
              {isSelected && (
                <div className="absolute inset-0 rounded-lg border-2 border-primary animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
      
      <p className="text-xs text-muted-foreground text-center">
        Choose sending speed based on your requirements
      </p>
    </div>
  );
};

export default SpeedControlButtons;

