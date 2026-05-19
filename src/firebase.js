import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Dedicated HomeworkZone configuration with automatic fallback to testbed
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDU9o6KxSvV3cFPducGpYcoymEKsQ_3xd8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "homeworkzone-8eb6d.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "homeworkzone-8eb6d",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "homeworkzone-8eb6d.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "786161173476",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:786161173476:web:c24781e3fe25bb4343fdf1",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-BHVSB5QMTH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
