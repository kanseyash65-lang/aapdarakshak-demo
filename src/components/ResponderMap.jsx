// src/components/ResponderMap.jsx
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../utils/firebase';
import { ref as dbRef, onValue, set as dbSet, remove as dbRemove } from 'firebase/database';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import {
  MapPinIcon,
  ArrowPathIcon,
  ClockIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';

// keep your small custom icon so markers render correctly
const markerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/252/252025.png',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

const FlyTo = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position && Array.isArray(position) && position.length === 2) {
      map.flyTo(position, 13, { duration: 1.0 });
    }
  }, [position, map]);
  return null;
};

const ResponderMap = ({ onClose, isOpen, user }) => {
  const [activeEmergencies, setActiveEmergencies] = useState([]);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [latestPosition, setLatestPosition] = useState(null);

  // in-app toasts (simple)
  const [toasts, setToasts] = useState([]);
  const seenRef = useRef(new Set()); // track seen emergency ids to produce toasts only for new ones

  // helper - add toast
  const addToast = (text) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
  };

  // helper - get responder identity (prefer logged in user, else localStorage)
  const getResponderIdentity = () => {
    if (user && (user.id || user.uid)) {
      return {
        responderId: user.id ?? user.uid,
        responderName: user.name ?? user.displayName ?? 'Responder'
      };
    }
    // fallback: local identity stored in localStorage
    let responderId = localStorage.getItem('responderId');
    let responderName = localStorage.getItem('responderName');
    if (!responderId) {
      responderId = 'resp_' + Math.random().toString(36).slice(2, 9);
      localStorage.setItem('responderId', responderId);
    }
    if (!responderName) {
      // ask once, optional; if user cancels leave as 'Anonymous'
      const n = prompt('Enter name to display to victim/responders (optional)', '');
      responderName = n ? n.trim() : 'Anonymous';
      localStorage.setItem('responderName', responderName);
    }
    return { responderId, responderName };
  };

  // helper - check if current responder is already responding to an emergency
  const isCurrentResponding = (em) => {
    const { responderId } = getResponderIdentity();
    if (!em?.responders) return false;
    return em.responders.some(r => r.responderId === responderId);
  };

  // toggle join/leave responder for an emergency
  const toggleRespond = async (em) => {
    try {
      const { responderId, responderName } = getResponderIdentity();
      const responderPath = `emergencies/${em.id}/responders/${responderId}`;
      const responderRef = dbRef(db, responderPath);

      const currentlyResponding = isCurrentResponding(em);
      if (currentlyResponding) {
        // leave
        await dbRemove(responderRef);
        addToast('You left the response for this emergency.');
      } else {
        // join
        await dbSet(responderRef, {
          responderId,
          responderName,
          joinedAt: new Date().toISOString(),
        });
        addToast('You joined - responders will be visible to victim.');
      }
    } catch (err) {
      console.error('Error toggling responder:', err);
      alert('Failed to update responder status. Check console.');
    }
  };

  // listen to RTDB /emergencies (real-time)
  useEffect(() => {
    const r = dbRef(db, 'emergencies');
    const unsubscribe = onValue(r, (snapshot) => {
      const val = snapshot.val() || {};
      // object -> array
      const arr = Object.entries(val).map(([id, data]) => ({ id, ...data }));

      // normalize fields & responders (responders might be object keyed by responderId)
      const normalized = arr.map((e) => {
        let respondersArr = [];
        if (e.responders) {
          if (Array.isArray(e.responders)) respondersArr = e.responders.filter(Boolean);
          else respondersArr = Object.entries(e.responders).map(([k, v]) => ({ key: k, ...v }));
        }
        return {
          ...e,
          lat: e.lat ?? e.latitude ?? null,
          lng: e.lng ?? e.longitude ?? null,
          createdAt: e.createdAt ?? e.timestamp ?? null,
          responders: respondersArr,
        };
      });

      // sort newest first by createdAt (string ISO is fine)
      normalized.sort((a, b) => {
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setActiveEmergencies(normalized);

      // set latest position for fly-to
      if (normalized.length > 0) {
        const top = normalized[0];
        const lat = Number(top.lat);
        const lng = Number(top.lng);
        if (!isNaN(lat) && !isNaN(lng)) setLatestPosition([lat, lng]);
        else setLatestPosition(null);
      } else {
        setLatestPosition(null);
      }

      // produce toast(s) for newly seen emergencies
      normalized.forEach((e) => {
        if (!seenRef.current.has(e.id)) {
          seenRef.current.add(e.id);
          const latText = e.lat ? Number(e.lat).toFixed(3) : 'unknown';
          const lngText = e.lng ? Number(e.lng).toFixed(3) : 'unknown';
          addToast(`New emergency reported at ${latText}, ${lngText}`);
        }
      });
    });

    return () => {
      // unsubscribe
      unsubscribe();
    };
  }, [user]); // user included so identity-based behavior remains consistent across user change

  // This useEffect will automatically update the selectedEmergency details
  // whenever the main activeEmergencies list changes from the database.
  useEffect(() => {
    if (!selectedEmergency) {
      return;
    }
    const freshEmergencyData = activeEmergencies.find(e => e.id === selectedEmergency.id);
    if (freshEmergencyData) {
      setSelectedEmergency(freshEmergencyData);
    } else {
      // If the emergency is no longer in the active list, close the modal.
      setSelectedEmergency(null);
    }
  }, [activeEmergencies]);

  if (!isOpen) return null;

  const defaultCenter = [20.5937, 78.9629];

  return (
    <>
      {/* tiny toast stack (top-right) - minimal UI, won't break your layout */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="bg-gray-800/90 text-white px-4 py-2 rounded-md shadow-lg text-sm">
            {t.text}
          </div>
        ))}
      </div>

      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-3xl p-6 w-full max-w-md relative max-h-[90vh] overflow-hidden">
          <button onClick={onClose} className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white">
            <XMarkIcon className="w-6 h-6" />
          </button>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Emergency Responses</h2>
            <button onClick={() => window.location.reload()} className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600">
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Map */}
          <div className="rounded-2xl h-64 mb-6 overflow-hidden">
            <MapContainer center={defaultCenter} zoom={5} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {activeEmergencies.map((em) => {
                const lat = Number(em.lat);
                const lng = Number(em.lng);
                if (isNaN(lat) || isNaN(lng)) return null;
                const created = em.createdAt ? new Date(em.createdAt).toLocaleString() : 'N/A';
                const respondersCount = em.responders ? em.responders.length : 0;
                const respondersPreview = em.responders && em.responders.slice(0, 3).map(r => r.responderName || r.responderId).join(', ');

                return (
                  <Marker key={em.id} position={[lat, lng]} icon={markerIcon}>
                    <Popup>
                      🚨 <strong>Emergency</strong>
                      <br />
                      Lat: {lat}, Lng: {lng}
                      <br />
                      Time: {created}
                      <br />
                      Responders: {respondersCount} {respondersCount > 0 ? `(${respondersPreview}${respondersCount>3 ? ', …' : ''})` : ''}
                    </Popup>
                  </Marker>
                );
              })}

              {/* fly to newest alert when it appears */}
              {latestPosition && <FlyTo position={latestPosition} />}
            </MapContainer>
          </div>

          {/* List */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Active Emergencies ({activeEmergencies.length})</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {activeEmergencies.map((em) => {
                const lat = Number(em.lat);
                const lng = Number(em.lng);
                const created = em.createdAt ? new Date(em.createdAt).toLocaleString() : 'N/A';
                const respondersCount = em.responders ? em.responders.length : 0;
                const preview = em.responders && em.responders.slice(0, 3).map(r => r.responderName || r.responderId).join(', ');

                return (
                  <div
                    key={em.id}
                    className="bg-gray-700 rounded-xl p-4 cursor-pointer hover:bg-gray-600 transition-colors border border-red-400/30"
                    onClick={() => setSelectedEmergency(em)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-red-300">Emergency</h4>
                        <div className="flex items-center text-sm text-gray-300 mt-2">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          {isNaN(lat) || isNaN(lng) ? 'Location unavailable' : `Lat: ${lat}, Lng: ${lng}`}
                        </div>
                        <div className="flex items-center text-sm text-gray-400 mt-1">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {created}
                        </div>

                        <div className="text-xs text-gray-300 mt-2">
                          Responders: {respondersCount} {respondersCount > 0 ? ` — ${preview}${respondersCount>3 ? ', …' : ''}` : ''}
                        </div>
                      </div>
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    </div>
                  </div>
                );
              })}

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

          {/* Selected emergency modal */}
          {selectedEmergency && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setSelectedEmergency(null)}
              />
              <div className="bg-gray-800 rounded-3xl p-6 w-full max-w-md relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-red-300">Emergency Details</h3>
                  <button onClick={() => setSelectedEmergency(null)} className="text-gray-400 hover:text-white">
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-white">Lat: {selectedEmergency.lat}</p>
                  <p className="text-white">Lng: {selectedEmergency.lng}</p>
                  <p className="text-white">Reported: {selectedEmergency.createdAt ? new Date(selectedEmergency.createdAt).toLocaleString() : 'N/A'}</p>

                  <div className="text-sm text-gray-300">
                    Responders: {selectedEmergency.responders ? selectedEmergency.responders.length : 0}
                    {selectedEmergency.responders && selectedEmergency.responders.length > 0 && (
                      <div className="mt-2 text-xs text-gray-400">
                        {selectedEmergency.responders.slice(0,5).map(r => r.responderName || r.responderId).join(', ')}
                        {selectedEmergency.responders.length > 5 ? ', …' : ''}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={async () => {
                        const wasResponding = isCurrentResponding(selectedEmergency);
                        await toggleRespond(selectedEmergency);

                        if (wasResponding) {
                          onClose();
                        }
                      }}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-colors"
                    >
                      {isCurrentResponding(selectedEmergency) ? 'Stop Responding' : "I'm Responding"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default ResponderMap;