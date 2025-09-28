// public/firebase-messaging-sw.js
// Use compat libraries for service worker
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDCcWHVVkSSFWBHxmO68wTdrWVuSvk0_HI",
  authDomain: "aapdarakshak-demo.firebaseapp.com",
  projectId: "aapdarakshak-demo",
  storageBucket: "aapdarakshak-demo.firebasestorage.app",
  messagingSenderId: "128095560109",
  appId: "1:128095560109:web:52419bda5afaddbe37c124",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Background handler
messaging.onBackgroundMessage(function(payload) {
  // payload.notification should exist if you send a notification payload
  const title = payload.notification?.title || 'Emergency Alert';
  const options = {
    body: payload.notification?.body || 'Open app for details',
    data: payload.data || {},
    // add icon / badge here if desired
  };

  self.registration.showNotification(title, options);
});
