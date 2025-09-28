// src/components/EmergancyButton.jsx
import { BellIcon } from '@heroicons/react/24/solid';
import React from 'react';
import { ref as dbRef, push, set } from 'firebase/database';
import { db } from '../utils/firebase';

const EmergancyButton = ({ userId }) => {
  const sendLocation = () => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const timestamp = new Date().toISOString();

        // push to RTDB under "emergencies"
        const newRef = push(dbRef(db, "emergencies"));
        set(newRef, {
          userId: userId || "anonymous",
          // keys the map expects:
          lat: latitude,
          lng: longitude,
          createdAt: timestamp,
        })
          .then(() => {
            console.log("Location sent to Firebase");
            alert("🚨 Emergency location sent!");
          })
          .catch((err) => {
            console.error("Error writing to Firebase:", err);
            alert("Failed to send location.");
          });
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Could not get location: " + error.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={sendLocation}
        className="relative w-36 h-36 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex flex-col items-center justify-center text-white font-bold shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 active:scale-95 group"
      >
        <div className="absolute inset-0 border-4 border-white/30 rounded-full animate-ping" />
        <div className="absolute inset-0 border-4 border-white/20 rounded-full animate-pulse" />

        <BellIcon className="h-10 w-10 mb-2 transform group-hover:scale-110 transition-transform" />
        <span className="text-xl tracking-wide">SOS ALERT</span>
      </button>
    </div>
  );
};

export default EmergancyButton;
