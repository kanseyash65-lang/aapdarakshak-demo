// src/App.jsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import EmergancySection from './components/EmergancySection';
import CommunitySection from './components/CommunitySection';
import Footer from './components/Footer';
import EmergencyAlert from './components/EmergencyAlert';
import ResponderMap from './components/ResponderMap';
import FloatingResponderButton from './components/FloatingResponderButton';
import AuthModal from './components/AuthModal';
import HelpRequestForm from './components/HelpRequestForm';
import Notification from './components/Notification'; // Import the Notification component
import { registerForPush, onForegroundMessage } from './utils/notifications';

const App = () => {
  // UI state management
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [showResponderMap, setShowResponderMap] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showHelpRequest, setShowHelpRequest] = useState(false);

  // logged-in user (null = guest)
  const [user, setUser] = useState(null);

  // Notification state
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  useEffect(() => {
    registerForPush();

    const unsubscribe = onForegroundMessage((payload) => {
      console.log('Foreground message received:', payload);
      // You can show a custom in-app notification here
      showNotification(payload.notification.body, 'success');
    });

    return () => unsubscribe();
  }, []);


  // handle login and open help form
  const handleLogin = (userData) => {
    setUser(userData);
    setShowAuthModal(false);
    setShowHelpRequest(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main sections */}
      <Header />

      <EmergancySection
        user={user}
        onEmergencyClick={() => setShowEmergencyAlert(true)}
        showNotification={showNotification}
      />

      <CommunitySection
        user={user}
        onHelpRequest={() => {
          if (user) {
            setShowHelpRequest(true);
          } else {
            setShowAuthModal(true);
          }
        }}
      />

      <Footer />

      {/* Floating responder map button */}
      <FloatingResponderButton onClick={() => setShowResponderMap(true)} />

      {/* Modals */}
      {showEmergencyAlert && (
        <EmergencyAlert onClose={() => setShowEmergencyAlert(false)} />
      )}

      {showResponderMap && (
        <ResponderMap
          isOpen={showResponderMap}
          onClose={() => setShowResponderMap(false)}
          user={user}
        />
      )}

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
      )}

      {showHelpRequest && (
        <HelpRequestForm
          isOpen={showHelpRequest}
          onClose={() => setShowHelpRequest(false)}
          user={user}
        />
      )}
      
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default App;