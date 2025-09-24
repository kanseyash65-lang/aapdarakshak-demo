import React, { useState } from 'react'
import Header from './components/Header'
import EmergancySection from './components/EmergancySection'
import CommunitySection from './components/CommunitySection'
import Footer from './components/Footer'
import EmergencyAlert from './components/EmergencyAlert'
import ResponderMap from './components/ResponderMap'
import FloatingResponderButton from './components/FloatingResponderButton'
import AuthModal from './components/AuthModal'
import HelpRequestForm from './components/HelpRequestForm'

const App = () => {
 
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [showResponderMap, setShowResponderMap] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const [showHelpRequest, setShowHelpRequest] = useState(false);


  const handleLogin = (userData) => {
  setUser(userData);
  setShowAuthModal(false);
  setShowHelpRequest(true); // <-- open the form after login
};


  return (
    <div>
      <div>
        <Header/>
      <EmergancySection onEmergencyClick={()=> setShowEmergencyAlert(true)}/>
      <CommunitySection 
       user={user}
       onHelpRequest={() => {
         if (user) {
           setShowHelpRequest(true);
         } else {
           setShowAuthModal(true);
         }
       }} />
      <Footer/>
      </div>

      <FloatingResponderButton onClick={()=> setShowResponderMap(true)}/>

      {showEmergencyAlert &&(
        <EmergencyAlert onClose={()=> setShowEmergencyAlert(false)}/>
      )}

      {showResponderMap && (
        <ResponderMap 
          isOpen={showResponderMap}
      onClose={()=> setShowResponderMap(false)}
        />
      )}

      {showAuthModal &&(
        <AuthModal
        isOpen={showAuthModal}
        onClose={()=>setShowAuthModal(false)}
        onLogin={handleLogin}
        />
      )}

      {showHelpRequest &&(
        <HelpRequestForm
        isOpen={showHelpRequest}
        onClose={()=> setShowHelpRequest(false)}
        user={user}
        />
      )}
    </div>
  )
}

export default App