import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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
  console.log("=== DIAGNOSING FIRESTORE STATE ===");
  
  // 1. Teachers
  const teachersSnap = await getDocs(collection(db, "teachers"));
  console.log(`Found ${teachersSnap.size} teachers.`);
  for (const teacherDoc of teachersSnap.docs) {
     const tData = teacherDoc.data();
     console.log(`\nTeacher: ${tData.name || 'No Name'} (ID: ${teacherDoc.id}, Code: ${tData.teacherCode})`);
     
     // Classrooms
     const classroomsSnap = await getDocs(collection(db, "teachers", teacherDoc.id, "classrooms"));
     console.log(`  - Found ${classroomsSnap.size} classrooms.`);
     for (const classDoc of classroomsSnap.docs) {
        const cData = classDoc.data();
        console.log(`    Classroom: ${cData.name} (ID: ${classDoc.id})`);
        
        // Students
        const studentsSnap = await getDocs(collection(db, "teachers", teacherDoc.id, "classrooms", classDoc.id, "students"));
        console.log(`      * Found ${studentsSnap.size} students:`);
        studentsSnap.forEach(stDoc => {
           console.log(`        Student Doc ID: "${stDoc.id}" => `, stDoc.data());
        });
     }
  }

  // 2. Submissions
  console.log("\n=== ALL SUBMISSIONS IN DATABASE ===");
  const subSnap = await getDocs(collection(db, "submissions"));
  subSnap.forEach(sDoc => {
     const data = sDoc.data();
     console.log(`Submission ID: ${sDoc.id} => Student: "${data.studentName}", ClassId: "${data.classId}", Score: ${data.score}`);
  });
}

run().catch(console.error);
