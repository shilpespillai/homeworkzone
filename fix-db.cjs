const fs = require('fs');
const admin = require('firebase-admin');

const envFile = fs.readFileSync('.env', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) env[key.trim()] = rest.join('=').trim().replace(/(^"|"$)/g, '');
});

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}
const db = admin.firestore();

async function fixUser() {
  const usersRef = db.collection('teachers');
  const all = await usersRef.get();
  
  let targetId = null;
  let currentCredits = 0;
  
  all.forEach(doc => {
    const data = doc.data();
    if (data.email === 'wolfpillai@gmail.com' || (data.billing && data.billing.email === 'wolfpillai@gmail.com')) {
      targetId = doc.id;
      currentCredits = data.topUpCredits || 0;
      console.log('Found user:', doc.id, 'Credits:', currentCredits);
    }
  });
  
  if (targetId) {
    console.log('Adding 15 credits to', targetId);
    await usersRef.doc(targetId).set({ topUpCredits: currentCredits + 15 }, { merge: true });
    console.log('Done!');
  } else {
    console.log('User not found. Will try to just update the newest user.');
  }
}

fixUser().catch(console.error);
