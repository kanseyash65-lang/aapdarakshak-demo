// components/ResponderMap.jsx
import React, { useState, useEffect } from 'react';
import { 
  MapPinIcon, 
  UserIcon, 
  PhoneIcon, 
  ArrowPathIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';

const ResponderMap = ({ onClose, isOpen }) => {
  const [activeEmergencies, setActiveEmergencies] = useState([
    {
      id: 1,
      type: 'Being chased',
      distance: '0.8km',
      time: '2 min ago',
      location: { lat: 28.6129, lng: 77.2295 },
      person: 'Anonymous User',
      status: 'active'
    },
    {
      id: 2,
      type: 'Medical emergency',
      distance: '1.2km',
      time: '5 min ago',
      location: { lat: 28.6139, lng: 77.2095 },
      person: 'Rahul Sharma',
      status: 'active'
    }
  ]);

  const [selectedEmergency, setSelectedEmergency] = useState(null);

  if (!isOpen) return null;

  const handleAcceptEmergency = (emergencyId) => {
    alert(`You're now responding to emergency #${emergencyId}`);
    setActiveEmergencies(prev => 
      prev.filter(emergency => emergency.id !== emergencyId)
    );
    setSelectedEmergency(null);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-3xl p-6 w-full max-w-md relative max-h-[90vh] overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Emergency Responses
          </h2>
          <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600">
            <ArrowPathIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Map Area (Placeholder - would be real map in production) */}
        <div className="bg-gray-900 rounded-2xl h-48 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <MapPinIcon className="w-12 h-12 mx-auto mb-2 text-red-400" />
              <p className="text-sm">Live Map View</p>
              <p className="text-xs">(Would show real emergencies on map)</p>
            </div>
          </div>
          
          {/* Emergency markers */}
          {activeEmergencies.map(emergency => (
            <div
              key={emergency.id}
              className="absolute w-4 h-4 bg-red-500 rounded-full animate-pulse"
              style={{
                left: `${50 + (emergency.id * 10)}%`,
                top: `${40 + (emergency.id * 5)}%`
              }}
              onClick={() => setSelectedEmergency(emergency)}
            />
          ))}
        </div>

        {/* Active Emergencies List */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Active Emergencies ({activeEmergencies.length})
          </h3>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {activeEmergencies.map(emergency => (
              <div
                key={emergency.id}
                className="bg-gray-700 rounded-xl p-4 cursor-pointer hover:bg-gray-600 transition-colors border border-red-400/30"
                onClick={() => setSelectedEmergency(emergency)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-300">{emergency.type}</h4>
                    <div className="flex items-center text-sm text-gray-300 mt-2">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      {emergency.distance} away
                    </div>
                    <div className="flex items-center text-sm text-gray-400 mt-1">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {emergency.time}
                    </div>
                  </div>
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            ))}
            
            {activeEmergencies.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                  <MapPinIcon className="w-8 h-8" />
                </div>
                <p>No active emergencies in your area</p>
                <p className="text-sm mt-1">Stay alert for notifications</p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Emergency Detail Modal */}
        {selectedEmergency && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-3xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-red-300">
                  Emergency Details
                </h3>
                <button 
                  onClick={() => setSelectedEmergency(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Emergency Type</label>
                  <p className="text-white font-semibold">{selectedEmergency.type}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Distance</label>
                  <p className="text-white">{selectedEmergency.distance} from you</p>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Reported</label>
                  <p className="text-white">{selectedEmergency.time}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Person</label>
                  <p className="text-white flex items-center">
                    <UserIcon className="w-4 h-4 mr-2" />
                    {selectedEmergency.person}
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => handleAcceptEmergency(selectedEmergency.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    Accept Emergency
                  </button>
                  <button className="px-4 bg-gray-700 hover:bg-gray-600 rounded-xl">
                    <PhoneIcon className="w-5 h-5" />
                  </button>
                </div>

                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl transition-colors">
                  View on Map
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Responder Status */}
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
            <div>
              <p className="text-sm text-blue-200">You are visible as a responder</p>
              <p className="text-xs text-blue-300">5 people in your 2km radius</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponderMap;