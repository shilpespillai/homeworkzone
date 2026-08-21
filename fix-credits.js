import admin from 'firebase-admin';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length > 1) {
    const key = parts[0];
    const val = parts.slice(1).join('=').trim().replace(/^"|"$/g, '').replace(/\\n/g, '\n');
    env[key] = val;
  }
});

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY,
  }),
});

const db = admin.firestore();

async function fix() {
  const snapshot = await db.collection('teachers').get();
  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (data.topUpCredits === 10) {
      console.log('Found affected teacher:', doc.id, data.email);
      await db.collection('teachers').doc(doc.id).set({
        topUpCredits: admin.firestore.FieldValue.increment(15)
      }, { merge: true });
      console.log('Added 15 credits to', data.email);
    }
  }
}
fix();
