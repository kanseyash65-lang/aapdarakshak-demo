// src/utils/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDCcWHVVkSSFWBHxmO68wTdrWVuSvk0_HI",
  authDomain: "aapdarakshak-demo.firebaseapp.com",
  databaseURL: "https://aapdarakshak-demo-default-rtdb.firebaseio.com/",
  projectId: "aapdarakshak-demo",
  storageBucket: "aapdarakshak-demo.firebasestorage.app",
  messagingSenderId: "128095560109",
  appId: "1:128095560109:web:52419bda5afaddbe37c124",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// getMessaging must run in the browser; wrap in try/catch for SSR safety
let messaging;
try {
  messaging = getMessaging(app);
} catch (e) {
  // server/worker environment — messaging unavailable there
  // console.warn('FCM messaging not available in this environment');
}

export { db, messaging };
