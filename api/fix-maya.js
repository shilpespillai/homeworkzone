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
    let updatedCount = 0;
    
    for (const doc of hwSnapshot.docs) {
      const data = doc.data();
      const title = (data.title || '').toLowerCase();
      
      if (title.includes('maya') && title.includes('magic map')) {
        console.log(`Updating document ${doc.id} ("${data.title}") from type: "${data.type}" to type: "homework"`);
        await doc.ref.update({ type: 'homework' });
        updatedCount++;
      }
    }
    
    console.log(`Successfully updated ${updatedCount} tests back to homework!`);
    process.exit(0);
  } catch (error) {
    console.error("Error migrating:", error);
    process.exit(1);
  }
}

run();
