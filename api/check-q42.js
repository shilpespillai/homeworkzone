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
  
  for (const doc of hwSnapshot.docs) {
    const data = doc.data();
    if ((data.title || '').toLowerCase().includes('naplan numeracy')) {
      for (const q of (data.questions || [])) {
        if (q.text.includes('Using the books read chart, how many more')) {
          console.log(`Question Found:`, q.text);
          console.log(`Has chartData:`, !!q.chartData);
          if (q.chartData) {
             console.log(`chartData raw:`, JSON.stringify(q.chartData));
          }
        }
      }
    }
  }
  process.exit(0);
}

run();
