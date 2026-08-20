import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const [,, uid] = process.argv;

if (!uid) {
  console.error("Please provide a user ID! Usage: node simulate-max.js <UID>");
  process.exit(1);
}

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
    console.log(`Maxing out limits for user: ${uid}...`);
    await db.collection('teachers').doc(uid).set({
      homeworkCount: 5,   // Max free papers
      classCount: 1,      // Max free classes
      studentCount: 2     // Max free students
    }, { merge: true });
    
    console.log("✅ Success! The user is now maxed out on the Free Trial.");
    console.log("Refresh the dashboard/app to see the paywalls trigger.");
  } catch (error) {
    console.error("Error updating user:", error);
  }
}

run();
