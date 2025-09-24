// components/FloatingResponderButton.jsx
import React from 'react';
import { UserGroupIcon } from '@heroicons/react/24/solid';

const FloatingResponderButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-full shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 transition-all duration-300 hover:scale-110 z-40 group"
    >
      <UserGroupIcon className="w-6 h-6" />
      <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full px-2 py-1 shadow-lg">
        Live
      </span>
    </button>
  );
};

export default FloatingResponderButton;