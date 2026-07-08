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
        if (q.text.includes('number of books read by four students')) {
          console.log(`Question Found:`, q.text);
          console.log(`Has chartData:`, !!q.chartData);
          if (q.chartData) {
             console.log(`chartData isArray:`, Array.isArray(q.chartData));
             console.log(`chartData length:`, q.chartData.length);
             console.log(`chartData first element:`, q.chartData[0]);
             console.log(`chartData raw:`, JSON.stringify(q.chartData));
          }
        }
      }
    }
  }
  process.exit(0);
}

run();
