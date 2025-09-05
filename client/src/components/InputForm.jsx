import { useState } from 'react';
import { Send, Loader2, StopCircle } from 'lucide-react';
import PhoneNumberInput from './PhoneNumberInput';
import MessageCountInput from './MessageCountInput';
import SpeedControlButtons from './SpeedControlButtons';

const InputForm = ({ 
  onSubmit, 
  isLoading = false, 
  onCancel,
  disabled = false 
}) => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    messageCount: 10,
    speed: 'Medium'
  });
  
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Phone number validation
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+[1-9]\d{1,14}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number in E.164 format';
    }
    
    // Message count validation
    if (!formData.messageCount || formData.messageCount < 1) {
      newErrors.messageCount = 'Message count must be at least 1';
    } else if (formData.messageCount > 100) {
      newErrors.messageCount = 'Message count cannot exceed 100';
    }
    
    // Speed validation
    if (!['Slow', 'Medium', 'Fast'].includes(formData.speed)) {
      newErrors.speed = 'Please select a valid speed';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  return (
    <div className="sms-card">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-2 mb-6">
          <Send className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Send Messages</h2>
        </div>

        {/* Phone Number Input */}
        <PhoneNumberInput
          value={formData.phoneNumber}
          onChange={(value) => handleInputChange('phoneNumber', value)}
          error={errors.phoneNumber}
          disabled={disabled}
        />

        {/* Message Count Input */}
        <MessageCountInput
          value={formData.messageCount}
          onChange={(value) => handleInputChange('messageCount', value)}
          error={errors.messageCount}
          disabled={disabled}
          min={1}
          max={100}
        />

        {/* Speed Control */}
        <SpeedControlButtons
          value={formData.speed}
          onChange={(value) => handleInputChange('speed', value)}
          disabled={disabled}
        />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {!isLoading ? (
            <button
              type="submit"
              disabled={disabled}
              className="sms-button-primary flex-1 flex items-center justify-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Send Messages</span>
            </button>
          ) : (
            <div className="flex gap-3 flex-1">
              <button
                type="button"
                disabled
                className="sms-button-primary flex-1 flex items-center justify-center space-x-2 opacity-75"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sending...</span>
              </button>
              
              <button
                type="button"
                onClick={onCancel}
                className="sms-button-secondary flex items-center justify-center space-x-2"
              >
                <StopCircle className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>

        {/* Form Summary */}
        {formData.phoneNumber && formData.messageCount && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Summary:</strong> Send {formData.messageCount} message{formData.messageCount !== 1 ? 's' : ''} 
              {' '}to {formData.phoneNumber} at {formData.speed.toLowerCase()} speed
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default InputForm;

