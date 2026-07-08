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
  try {
    const hwSnapshot = await db.collection('homeworks').get();
    
    for (const doc of hwSnapshot.docs) {
      const data = doc.data();
      const title = (data.title || '').toLowerCase();
      if (title.includes('naplan')) {
        for (const q of (data.questions || [])) {
          if (q.chartData) {
            console.log(`Test: ${data.title}, Q: ${q.text.substring(0, 50)}...`);
            console.log('chartData:', JSON.stringify(q.chartData, null, 2));
            console.log('-----------------');
          }
        }
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

run();
