// src/utils/notifications.js
import { messaging, db } from './firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { ref as dbRef, set } from 'firebase/database';

/**
 * 1) Generate a Web Push VAPID key in Firebase Console:
 *    Firebase Console -> Project Settings -> Cloud Messaging -> Web Push certificates -> Generate key pair
 *    Put the Public VAPID key string below.
 */
const VAPID_KEY = 'YOUR_PUBLIC_VAPID_KEY_FROM_FIREBASE_CONSOLE'; // <-- REPLACE THIS

export async function registerForPush() {
  if (!messaging) {
    console.warn('FCM messaging not available (maybe running server-side).');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission not granted.');
      return null;
    }

    const fcmToken = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (!fcmToken) {
      console.warn('No FCM token received.');
      return null;
    }

    // Save token to RTDB under responderTokens/{token} so server can notify
    await set(dbRef(db, `responderTokens/${fcmToken}`), {
      createdAt: new Date().toISOString(),
    });

    console.log('Registered FCM token:', fcmToken);
    return fcmToken;
  } catch (err) {
    console.error('Error registering for push notifications:', err);
    return null;
  }
}

/** Foreground message listener: payload -> callback(payload) */
export function onForegroundMessage(callback) {
  if (!messaging) return () => {};
  return onMessage(messaging, (payload) => {
    callback(payload);
  });
}
