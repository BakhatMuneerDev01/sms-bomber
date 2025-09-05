import { useState } from 'react';
import { Phone, AlertCircle, CheckCircle } from 'lucide-react';

const PhoneNumberInput = ({ value, onChange, error, disabled }) => {
  const [focused, setFocused] = useState(false);

  const validatePhoneNumber = (phone) => {
    // Basic E.164 format validation
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    return e164Regex.test(phone);
  };

  const isValid = value && validatePhoneNumber(value);
  const showError = error && !focused;
  const showSuccess = isValid && !focused && value.length > 0;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        Phone Number
      </label>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Phone className="h-5 w-5 text-muted-foreground" />
        </div>
        
        <input
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          placeholder="+1234567890"
          className={`sms-input pl-10 pr-10 ${
            showError ? 'border-destructive focus:ring-destructive' : 
            showSuccess ? 'border-success focus:ring-success' : ''
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {showError && (
            <AlertCircle className="h-5 w-5 text-destructive" />
          )}
          {showSuccess && (
            <CheckCircle className="h-5 w-5 text-success" />
          )}
        </div>
      </div>
      
      {showError && (
        <p className="text-sm text-destructive flex items-center space-x-1">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </p>
      )}
      
      {!error && (
        <p className="text-xs text-muted-foreground">
          Enter phone number in E.164 format (e.g., +1234567890)
        </p>
      )}
    </div>
  );
};

export default PhoneNumberInput;

