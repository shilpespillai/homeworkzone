import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}
const db = admin.firestore();

async function run() {
  const hwSnapshot = await db.collection('homeworks').get();
  let updated = 0;
  
  for (const doc of hwSnapshot.docs) {
    const data = doc.data();
    const title = (data.title || '').toLowerCase();
    
    // Check for reading comprehension in TEST AREA (type: 'test')
    if (title.includes('reading comprehension') && data.type === 'test') {
      await db.collection('homeworks').doc(doc.id).update({ type: 'lesson' });
      console.log(`Updated "${data.title}" from test back to lesson!`);
      updated++;
    }
  }
  console.log(`Done! Reverted ${updated} reading comprehensions.`);
  process.exit(0);
}

run();
