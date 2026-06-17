import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import fs from 'fs';
import path from 'path';

// Parse .env file locally in Node
function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf8').split('\n');
      lines.forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
          else if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
          process.env[key] = value.trim();
        }
      });
    }
  } catch (e) {
    console.warn("Could not load .env file:", e.message);
  }
}
loadEnv();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  console.log("=== DIAGNOSING FIRESTORE WRITE FOR HOMEWORKS ===");
  try {
    const payload = {
      title: "Diagnostic Test",
      subject: "maths",
      instructions: "Just a test",
      assignedClassId: "test-class-id",
      status: "draft",
      createdAt: new Date()
    };
    console.log("Attempting to write dummy homework to Firestore...");
    const docRef = await addDoc(collection(db, "homeworks"), payload);
    console.log("SUCCESS! Wrote document with ID:", docRef.id);
  } catch (err) {
    console.error("WRITE FAILED with error:", err);
  }
}

run().catch(console.error);
