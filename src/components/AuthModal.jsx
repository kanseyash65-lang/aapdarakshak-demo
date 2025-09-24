// components/AuthModal.jsx
import React, { useState } from 'react';
import { 
  XMarkIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  UserIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    skills: ''
  });

  if (!isOpen) return null;

  const handleSendOtp = () => {
    // Simulate OTP sending
    if (phoneNumber.length === 10) {
      setShowOtp(true);
      alert(`OTP sent to ${phoneNumber}`);
    } else {
      alert('Please enter a valid 10-digit phone number');
    }
  };

  const handleVerifyOtp = () => {
    // Simulate OTP verification
    if (otp === '1234') { // Demo OTP
      onLogin({ phone: phoneNumber, ...userData });
      onClose();
    } else {
      alert('Invalid OTP. Try 1234 for demo.');
    }
  };

  const handleSignup = () => {
    if (userData.name && phoneNumber) {
      setShowOtp(true);
      alert(`OTP sent to ${phoneNumber}`);
    }
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

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <ShieldCheckIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {activeTab === 'login' ? 'Welcome Back' : 'Join Our Community'}
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            {activeTab === 'login' 
              ? 'Sign in to help others in need' 
              : 'Create your responder profile'
            }
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-700 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'login'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'signup'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {!showOtp ? (
          // Phone Number Input
          <div className="space-y-4">
            {activeTab === 'signup' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={userData.name}
                      onChange={(e) => setUserData({...userData, name: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email (Optional)
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={userData.email}
                      onChange={(e) => setUserData({...userData, email: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={activeTab === 'login' ? handleSendOtp : handleSignup}
              disabled={phoneNumber.length !== 10 || (activeTab === 'signup' && !userData.name)}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors"
            >
              {activeTab === 'login' ? 'Send OTP' : 'Create Account'}
            </button>
          </div>
        ) : (
          // OTP Verification
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                placeholder="Enter 4-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white text-center text-xl tracking-widest placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <p className="text-sm text-gray-400 text-center">
              OTP sent to +91 {phoneNumber}
            </p>

            <button
              onClick={handleVerifyOtp}
              disabled={otp.length !== 4}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors"
            >
              Verify & Continue
            </button>

            <button
              onClick={() => setShowOtp(false)}
              className="w-full text-blue-400 hover:text-blue-300 text-sm"
            >
              Change Phone Number
            </button>
          </div>
        )}

        <p className="text-xs text-gray-500 text-center mt-6">
          By continuing, you agree to our Terms and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default AuthModal;