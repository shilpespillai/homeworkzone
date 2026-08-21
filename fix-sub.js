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
  const teacherId = 'vRAxOVjYgrX0zWyFTuYnaQkREqK2';
  
  // Set the billing for option-a manually since the webhook failed
  const currentPeriodEnd = new Date();
  currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1); // 1 month from now
  
  const billingData = {
    planId: 'option-a',
    status: 'active',
    quantity: 1,
    currentPeriodEnd: currentPeriodEnd.toISOString(),
    cancelAtPeriodEnd: false,
    updatedAt: new Date().toISOString(),
  };

  await db.collection('teachers').doc(teacherId).set({
    billing: billingData
  }, { merge: true });
  console.log('Set Option A active for wolfpillai@gmail.com!');
}
fix();
