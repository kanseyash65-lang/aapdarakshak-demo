// src/App.jsx
import React, { useState } from 'react';
import Header from './components/Header';
import EmergancySection from './components/EmergancySection';
import CommunitySection from './components/CommunitySection';
import Footer from './components/Footer';
import EmergencyAlert from './components/EmergencyAlert';
import ResponderMap from './components/ResponderMap';
import FloatingResponderButton from './components/FloatingResponderButton';
import AuthModal from './components/AuthModal';
import HelpRequestForm from './components/HelpRequestForm';

const App = () => {
  // UI state management
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [showResponderMap, setShowResponderMap] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showHelpRequest, setShowHelpRequest] = useState(false);

  // logged-in user (null = guest)
  const [user, setUser] = useState(null);

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
    </div>
  );
};

export default App;
