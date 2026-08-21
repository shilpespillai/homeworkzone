const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf-8');

const faultyHook =       let unsubscribe = null;
      
      const setupRealtimeHomeworks = async () => {
         if (!actualClassroom?.id || !actualTeacher) return;
         let teacherUid = actualTeacher.uid;
         if (!teacherUid && actualTeacher.teacherCode) {
            const teacherQ = query(collection(db, 'teachers'), where('teacherCode', '==', actualTeacher.teacherCode.toUpperCase().trim()));
            const teacherSnap = await getDocs(teacherQ);
            if (!teacherSnap.empty) {
               teacherUid = teacherSnap.docs[0].id;
            }
         }
         if (teacherUid && actualClassroom.id) {
            const hwQ = query(collection(db, 'homeworks'), where('teacherId', '==', teacherUid), where('assignedClassId', '==', actualClassroom.id));
            unsubscribe = onSnapshot(hwQ, (hwSnap) => {;

const fixedHook =       let unsubscribe = null;
      let isMounted = true;
      
      const setupRealtimeHomeworks = async () => {
         if (!actualClassroom?.id || !actualTeacher) return;
         let teacherUid = actualTeacher.uid;
         if (!teacherUid && actualTeacher.teacherCode) {
            const teacherQ = query(collection(db, 'teachers'), where('teacherCode', '==', actualTeacher.teacherCode.toUpperCase().trim()));
            const teacherSnap = await getDocs(teacherQ);
            if (!teacherSnap.empty) {
               teacherUid = teacherSnap.docs[0].id;
            }
         }
         if (teacherUid && actualClassroom.id && isMounted) {
            const hwQ = query(collection(db, 'homeworks'), where('teacherId', '==', teacherUid), where('assignedClassId', '==', actualClassroom.id));
            unsubscribe = onSnapshot(hwQ, (hwSnap) => {;

const faultyCleanup =       setupRealtimeHomeworks();
      
      return () => {
         if (unsubscribe) unsubscribe();
      };;

const fixedCleanup =       setupRealtimeHomeworks();
      
      return () => {
         isMounted = false;
         if (unsubscribe) unsubscribe();
      };;

content = content.replace(faultyHook, fixedHook);
content = content.replace(faultyCleanup, fixedCleanup);
fs.writeFileSync('src/App.jsx', content, 'utf-8');
console.log('Fixed async cleanup race condition in homeworks onSnapshot hook.');
