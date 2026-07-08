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
    let updated = 0;
    
    for (const doc of hwSnapshot.docs) {
      const data = doc.data();
      const title = (data.title || '').toLowerCase();
      
      // Look for NAPLAN tests that are currently marked as 'lesson' (homework)
      if (title.includes('naplan') && data.type === 'lesson') {
        await db.collection('homeworks').doc(doc.id).update({
          type: 'test'
        });
        console.log(`Updated "${data.title}" from lesson to test!`);
        updated++;
      }
    }
    
    console.log(`Done! Updated ${updated} NAPLAN assignments to Test Arena.`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

run();
