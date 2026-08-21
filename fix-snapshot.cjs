const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf-8');

// We need to carefully extract the homeworks fetching logic and make it realtime.
// Right now, homeworks are fetched in fetchData() via:
// const hwSnap = await getDocs(hwQ);
// We can change that to set up a realtime listener for homeworks inside StudentDashboard.

// Because the user wants it to be instantaneous, let's inject a new useEffect for homeworks snapshot.
// We also need to remove the getDocs(hwQ) from fetchData to avoid double-fetching.

let newEffect = 
  useEffect(() => {
    let unsubscribe = null;
    let isMounted = true;

    const setupRealtimeHomeworks = async () => {
      try {
        const savedStudent = JSON.parse(localStorage.getItem('hwz_active_student'));
        const actualClassroom = classroom || savedStudent?.classroom;
        const actualTeacher = teacher || savedStudent?.teacher;

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
           
           unsubscribe = onSnapshot(hwQ, (hwSnap) => {
             const cleanStudentId = studentName?.trim().toLowerCase();
             const hwList = hwSnap.docs.map(doc => {
                    const data = doc.data();
                    const isNaplan = (data.title || '').toLowerCase().includes('naplan') || (data.subject || '').toLowerCase().includes('naplan');
                    if (isNaplan && data.type !== 'test') {
                       data.type = 'test';
                    }
                    return { id: doc.id, ...data };
             }).filter(hw => {
                 if (hw.status === 'draft') return false;
                 if (hw.status === 'scheduled') {
                    if (!hw.scheduledRelease?.date) return false;
                    try {
                       const releaseTime = hw.scheduledRelease.time || '00:00';
                       const releaseDateTime = new Date(\\T\\);
                       if (releaseDateTime > new Date()) return false;
                    } catch (e) {
                       return false;
                    }
                 }
                 if (hw.assignType === 'student' && hw.assignedStudentId) {
                    return hw.assignedStudentId.trim().toLowerCase() === cleanStudentId;
                 }
                 if (hw.assignType === 'students' && hw.assignedStudentIds) {
                    return Array.isArray(hw.assignedStudentIds) && hw.assignedStudentIds.map(id => id.trim().toLowerCase()).includes(cleanStudentId);
                 }
                 return true;
             });
              
             hwList.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateB - dateA;
             });
             
             setHomeworks(hwList);
           }, (err) => {
             console.error("Homeworks onSnapshot error:", err);
           });
        }
      } catch (err) {
        console.error("Setup Realtime Homeworks Error:", err);
      }
    };

    setupRealtimeHomeworks();

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [classroom?.id, teacher?.uid, studentName]);
;

// Insert the new effect after the classroom onSnapshot
content = content.replace(
    /console\.error\("Classroom onSnapshot error:", err\);\n         \}\);\n         return \(\) => unsubscribe\(\);\n      \}\n   \}, \[classroom\?\.id, teacher\?\.uid\]\);/,
    match => match + '\n' + newEffect
);

// Now remove the one-time fetch in fetchData
const oldFetch =            // Fetch homeworks for this class
           const hwQ = query(collection(db, 'homeworks'), where('teacherId', '==', teacherUid), where('assignedClassId', '==', latestClassroom.id));
           const hwSnap = await getDocs(hwQ);
           const cleanStudentId = studentName?.trim().toLowerCase();
           const hwList = hwSnap.docs.map(doc => {
                  const data = doc.data();
                  const isNaplan = (data.title || '').toLowerCase().includes('naplan') || (data.subject || '').toLowerCase().includes('naplan');
                  if (isNaplan && data.type !== 'test') {
                     data.type = 'test';
                  }
                  return { id: doc.id, ...data };
           })
              .filter(hw => {
                 if (hw.status === 'draft') return false;
                 if (hw.status === 'scheduled') {
                    if (!hw.scheduledRelease?.date) return false;
                    try {
                       const releaseTime = hw.scheduledRelease.time || '00:00';
                       const releaseDateTime = new Date(\\T\\);
                       if (releaseDateTime > new Date()) return false;
                    } catch (e) {
                       return false;
                    }
                 }
                 // Filter out student-specific homeworks that are not assigned to this student
                 if (hw.assignType === 'student' && hw.assignedStudentId) {
                    return hw.assignedStudentId.trim().toLowerCase() === cleanStudentId;
                 }
                 if (hw.assignType === 'students' && hw.assignedStudentIds) {
                    return Array.isArray(hw.assignedStudentIds) && hw.assignedStudentIds.map(id => id.trim().toLowerCase()).includes(cleanStudentId);
                 }
                 return true;
              });
              
           hwList.sort((a, b) => {
              const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return dateB - dateA;
           });
           
           setHomeworks(hwList);;

content = content.replace(oldFetch, '           // Homeworks are now fetched via real-time listener below.');

fs.writeFileSync('src/App.jsx', content, 'utf-8');
console.log('Migrated homeworks to onSnapshot!');
