import admin from 'firebase-admin';
import fs from 'fs';
const env = fs.readFileSync('.env', 'utf-8').split('\n').reduce((acc, line) => {
  const [k, ...v] = line.split('=');
  if (k && !k.startsWith('#')) acc[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
  return acc;
}, {});

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

async function find() {
  try {
    const user = await admin.auth().getUserByEmail('wolfpillai@gmail.com');
    console.log('---');
    console.log('Firebase Auth UID: ' + user.uid);
  } catch(e) { console.log('Auth error: ' + e.message); }
  
  try {
    const snap = await admin.firestore().collection('teachers').where('email', '==', 'wolfpillai@gmail.com').get();
    if (!snap.empty) {
      console.log('Firestore UID: ' + snap.docs[0].id);
    } else {
      console.log('No firestore doc found for this email.');
    }
  } catch(e) { console.log('Firestore error: ' + e.message); }
  console.log('---');
  process.exit(0);
}
find();
