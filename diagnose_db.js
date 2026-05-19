import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsW3KhUinSuxr4Y3dbIVXWazyC9DeVOiU",
  authDomain: "pantrybloom-a7237.firebaseapp.com",
  projectId: "pantrybloom-a7237",
  storageBucket: "pantrybloom-a7237.firebasestorage.app",
  messagingSenderId: "59696142465",
  appId: "1:59696142465:web:a4477f72294ed2afc05580"
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
