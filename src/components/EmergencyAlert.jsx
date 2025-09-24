// components/EmergencyAlert.jsx
import React, { useState, useEffect } from 'react';
import { 
  MicrophoneIcon, 
  PaperAirplaneIcon,
  MapPinIcon,
  XMarkIcon 
} from '@heroicons/react/24/solid';

const EmergencyAlert = ({ onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [emergencyType, setEmergencyType] = useState('');
  const [shareLocation, setShareLocation] = useState(true);

  const emergencyTypes = [
    'Being chased/followed',
    'Physical attack',
    'Medical emergency',
    'Fire accident',
    'Natural disaster',
    'Other danger'
  ];

  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const handleSendAlert = () => {
    // Send alert logic here
    alert('Emergency alert sent! Help is on the way.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-3xl p-6 w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 text-red-400">
          EMERGENCY ALERT
        </h2>

        {/* Emergency Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">
            What type of emergency?
          </label>
          <select 
            value={emergencyType}
            onChange={(e) => setEmergencyType(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-xl p-3 text-white"
          >
            <option value="">Select emergency type</option>
            {emergencyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Voice Recording */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">
            Record your situation (optional)
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`p-4 rounded-full ${
                isRecording 
                  ? 'bg-red-500 animate-pulse' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <MicrophoneIcon className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <div className="bg-gray-700 rounded-xl p-3">
                {isRecording ? (
                  <div className="flex items-center justify-between">
                    <span className="text-red-400">Recording... {recordingTime}s</span>
                    <div className="flex space-x-1">
                      <div className="w-1 h-4 bg-red-400 animate-pulse"></div>
                      <div className="w-1 h-6 bg-red-400 animate-pulse"></div>
                      <div className="w-1 h-4 bg-red-400 animate-pulse"></div>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400">Press to record message</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Location Sharing */}
        <div className="mb-6">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={shareLocation}
                onChange={(e) => setShareLocation(e.target.checked)}
                className="sr-only"
              />
              <div className={`block w-14 h-7 rounded-full ${
                shareLocation ? 'bg-blue-500' : 'bg-gray-600'
              }`}></div>
              <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${
                shareLocation ? 'transform translate-x-7' : ''
              }`}></div>
            </div>
            <span className="ml-3 text-sm flex items-center">
              <MapPinIcon className="w-4 h-4 mr-1" />
              Share my location with responders
            </span>
          </label>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSendAlert}
          disabled={!emergencyType}
          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
          SEND EMERGENCY ALERT
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          Alert will be sent to all responders within 2km radius
        </p>
      </div>
    </div>
  );
};

export default EmergencyAlert;