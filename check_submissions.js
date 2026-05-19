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
