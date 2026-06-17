import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
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
  console.log("=== DIAGNOSING SUBMISSIONS AND STUDENTS ===");
  
  // 1. Fetch all students
  const teachersSnap = await getDocs(collection(db, "teachers"));
  console.log("\n--- STUDENTS IN CLASSROOMS ---");
  for (const teacherDoc of teachersSnap.docs) {
      const classroomsSnap = await getDocs(collection(db, "teachers", teacherDoc.id, "classrooms"));
      for (const classDoc of classroomsSnap.docs) {
         const studentsSnap = await getDocs(collection(db, "teachers", teacherDoc.id, "classrooms", classDoc.id, "students"));
         studentsSnap.forEach(stDoc => {
            console.log(`Student ID: "${stDoc.id}" => Name: "${stDoc.data().name}"`);
         });
      }
  }

  // 2. Fetch all submissions
  console.log("\n--- SUBMISSIONS IN SYSTEM ---");
  const subSnap = await getDocs(collection(db, "submissions"));
  subSnap.forEach(sDoc => {
     const data = sDoc.data();
     console.log(`Submission ID: ${sDoc.id} => StudentName: "${data.studentName}", StudentId: "${data.studentId}", HomeworkId: "${data.homeworkId}", Score: ${data.score}`);
  });

  // 3. Fetch all homeworks
  console.log("\n--- HOMEWORKS IN SYSTEM ---");
  const hwSnap = await getDocs(collection(db, "homeworks"));
  hwSnap.forEach(hDoc => {
     const data = hDoc.data();
     console.log(`Homework ID: ${hDoc.id} => Title: "${data.title}", Subject: "${data.subject}", ClassId: "${data.assignedClassId}", Status: "${data.status}"`);
  });
}

run().catch(console.error);
