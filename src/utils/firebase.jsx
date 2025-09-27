// src/utils/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDCcWHVVkSSFWBHxmO68wTdrWVuSvk0_HI",
  authDomain: "aapdarakshak-demo.firebaseapp.com",
  databaseURL: "https://aapdarakshak-demo-default-rtdb.firebaseio.com/", // add this from Firebase console!
  projectId: "aapdarakshak-demo",
  storageBucket: "aapdarakshak-demo.firebasestorage.app",
  messagingSenderId: "128095560109",
  appId: "1:128095560109:web:52419bda5afaddbe37c124",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
