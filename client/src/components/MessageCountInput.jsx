import { useState } from 'react';
import { Hash, Minus, Plus } from 'lucide-react';

const MessageCountInput = ({ value, onChange, error, disabled, min = 1, max = 100 }) => {
  const [focused, setFocused] = useState(false);

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value) || min;
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        Message Count
      </label>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Hash className="h-5 w-5 text-muted-foreground" />
        </div>
        
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          min={min}
          max={max}
          className={`sms-input pl-10 pr-20 text-center ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={disabled || value <= min}
            className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <div className="w-px h-4 bg-border mx-1" />
          <button
            type="button"
            onClick={handleIncrement}
            disabled={disabled || value >= max}
            className="p-1 mr-2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      
      <p className="text-xs text-muted-foreground">
        Number of messages to send ({min}-{max})
      </p>
    </div>
  );
};

export default MessageCountInput;

