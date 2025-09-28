// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(); // uses default service account in Cloud Functions

const db = admin.database();
const messaging = admin.messaging();

exports.notifyOnEmergency = functions.database
  .ref('/emergencies/{emId}')
  .onCreate(async (snapshot, context) => {
    const emergency = snapshot.val();
    const emId = context.params.emId || '';

    // collect tokens
    const tokensSnap = await db.ref('responderTokens').once('value');
    const tokensObj = tokensSnap.val();
    if (!tokensObj) {
      console.log('No responder tokens; skipping push.');
      return null;
    }

    const tokens = Object.keys(tokensObj); // keys are tokens
    if (tokens.length === 0) {
      console.log('No tokens to send to.');
      return null;
    }

    // Notification payload
    const notification = {
      title: 'New Emergency Alert 🚨',
      body: 'Someone needs help nearby — open the app.',
    };

    // Data payload (optional)
    const data = {
      emId: emId,
      lat: emergency.lat ? String(emergency.lat) : '',
      lng: emergency.lng ? String(emergency.lng) : '',
      // you can add more fields (type, userId) if you saved them
    };

    // send in batches of 500 (sendMulticast limit)
    const BATCH = 500;
    const chunks = [];
    for (let i = 0; i < tokens.length; i += BATCH) {
      chunks.push(tokens.slice(i, i + BATCH));
    }

    const promises = chunks.map((chunk) => {
      return messaging.sendMulticast({
        tokens: chunk,
        notification,
        data,
      });
    });

    const results = await Promise.all(promises);
    console.log('Push results:', results.map(r => ({ success: r.successCount, failure: r.failureCount })));
    return null;
  });
