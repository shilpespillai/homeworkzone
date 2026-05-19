import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Dedicated HomeworkZone configuration with automatic fallback to testbed
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBsW3KhUinSuxr4Y3dbIVXWazyC9DeVOiU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "pantrybloom-a7237.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "pantrybloom-a7237",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "pantrybloom-a7237.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "59696142465",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:59696142465:web:a4477f72294ed2afc05580",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-KFJNDWBGM1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
