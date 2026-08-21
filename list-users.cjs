require('dotenv').config();
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

const db = admin.firestore();

async function fix() {
  const snapshot = await db.collection('teachers').get();
  console.log('Teachers:');
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(doc.id, '->', data.email, 'plan:', data.billing?.planId, 'credits:', data.topUpCredits);
  });
}
fix();
