import admin from 'firebase-admin';
import crypto from 'crypto';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (e) {
    console.warn('Firebase Admin init warning:', e.message);
  }
}

const db = admin.firestore();

function hashPasswordNode(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

const normalizeName = (name) => (name || '').trim().toLowerCase().replace(/\s+/g, ' ');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { action = 'verify', teacherCode, studentName, password, teacherId, classId, studentId, newPassword, messageIds } = req.body || {};

    if (action === 'mark-read') {
      if (Array.isArray(messageIds) && messageIds.length > 0) {
        const batch = db.batch();
        messageIds.forEach(id => {
          if (id) {
            const ref = db.collection('messages').doc(id);
            batch.update(ref, { isRead: true });
          }
        });
        await batch.commit().catch(e => console.warn('[mark-read batch error]', e.message));
      }
      return res.status(200).json({ success: true, count: messageIds?.length || 0 });
    }

    if (action === 'create-password') {
      if (!teacherId || !classId || !studentId || !newPassword) {
        return res.status(400).json({ error: 'Missing required fields to set password' });
      }

      if (newPassword.length < 4) {
        return res.status(400).json({ error: 'Password must be at least 4 characters long.' });
      }

      const pwHash = hashPasswordNode(newPassword);
      const studentDocRef = db.collection('teachers').doc(teacherId).collection('classrooms').doc(classId).collection('students').doc(studentId);
      
      await studentDocRef.set({ passwordHash: pwHash }, { merge: true });

      const teacherDoc = await db.collection('teachers').doc(teacherId).get();
      const teacherData = teacherDoc.data() || {};
      const classDoc = await db.collection('teachers').doc(teacherId).collection('classrooms').doc(classId).get();
      const classData = classDoc.data() || {};
      const studentDoc = await studentDocRef.get();
      const studentData = studentDoc.data() || {};

      const matchedStudentName = (studentData.name || studentId).trim();
      let customToken = null;
      try {
        customToken = await admin.auth().createCustomToken(`student_${teacherId}_${studentId}`, {
          role: 'student',
          teacherId,
          classId,
          studentName: matchedStudentName
        });
      } catch (authErr) {
        console.warn('Custom token creation skipped/failed:', authErr.message);
      }

      return res.status(200).json({
        success: true,
        customToken,
        studentName: matchedStudentName,
        classroom: { id: classId, ...classData },
        teacher: { uid: teacherId, ...teacherData }
      });
    }

    // Default: 'verify' action
    if (!teacherCode || !studentName) {
      return res.status(400).json({ error: 'Please enter both your Teacher Code and Name.' });
    }

    const cleanCode = teacherCode.toUpperCase().trim();
    const cleanInputName = normalizeName(studentName);

    // 1. Find teacher by teacherCode
    const teachersSnap = await db.collection('teachers').where('teacherCode', '==', cleanCode).limit(1).get();
    if (teachersSnap.empty) {
      return res.status(404).json({ error: 'Invalid Teacher Code. Please check with your teacher!' });
    }

    const teacherDoc = teachersSnap.docs[0];
    const teacherData = teacherDoc.data();
    const teacherIdFound = teacherDoc.id;

    // 2. Enforce 7-day trial check for unpaid accounts
    const isAdminUser = teacherData.isAdmin === true || teacherData.role === 'admin';
    const teacherBilling = teacherData.billing;
    const isPaid = teacherBilling && ['active', 'trialing'].includes(teacherBilling.status);
    if (!isPaid && !isAdminUser) {
      const rawCreated = teacherData.createdAt || teacherBilling?.createdAt;
      if (rawCreated) {
        const createdDate = new Date(rawCreated);
        const today = new Date();
        const diffTime = today - createdDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 7) {
          return res.status(403).json({ error: "Your classroom's trial has expired. Ask your teacher/parent to subscribe to unlock the Homework Zone! 🔒" });
        }
      }
    }

    // 3. Search classrooms for the student
    const classroomsSnap = await db.collection('teachers').doc(teacherIdFound).collection('classrooms').get();
    let studentFound = false;
    let matchedClassData = null;
    let matchedClassId = null;
    let matchedStudentDocId = null;
    let matchedStudentData = null;

    for (const cDoc of classroomsSnap.docs) {
      const studentsSnap = await db.collection('teachers').doc(teacherIdFound).collection('classrooms').doc(cDoc.id).collection('students').get();
      const matched = studentsSnap.docs.find(stDoc => {
        const stData = stDoc.data();
        return normalizeName(stDoc.id) === cleanInputName || normalizeName(stData.name) === cleanInputName;
      });

      if (matched) {
        studentFound = true;
        matchedClassId = cDoc.id;
        matchedClassData = { id: cDoc.id, ...cDoc.data() };
        matchedStudentDocId = matched.id;
        matchedStudentData = matched.data();
        break;
      }
    }

    if (!studentFound) {
      return res.status(404).json({ error: "Oops! Your name isn't on the class list yet. Talk to your teacher to join!" });
    }

    // 4. Check paused or quota locked
    if (matchedStudentData.isQuotaLocked) {
      return res.status(403).json({ error: 'Your account has been temporarily locked due to your class plan limits. Please speak to your teacher.' });
    }
    if (matchedStudentData.status === 'paused') {
      return res.status(403).json({ error: 'Your account has been paused by your teacher. Please speak to your teacher to restore access.' });
    }

    const storedHash = matchedStudentData.passwordHash;
    const finalStudentName = (matchedStudentData.name || matchedStudentDocId).trim();

    // 5. First-time student without password
    if (!storedHash) {
      return res.status(200).json({
        success: true,
        needsPasswordSetup: true,
        teacherId: teacherIdFound,
        classId: matchedClassId,
        studentId: matchedStudentDocId,
        studentName: finalStudentName,
        classroom: matchedClassData,
        teacher: { uid: teacherIdFound, ...teacherData }
      });
    }

    // 6. Returning student without password entered yet
    if (!password) {
      return res.status(200).json({
        success: true,
        requiresPassword: true,
        studentName: finalStudentName
      });
    }

    // 7. Verify password
    const inputHash = hashPasswordNode(password);
    if (inputHash !== storedHash) {
      return res.status(401).json({ error: 'Incorrect password. Please try again!' });
    }

    // 8. Password matches -> create custom token
    let customToken = null;
    try {
      customToken = await admin.auth().createCustomToken(`student_${teacherIdFound}_${matchedStudentDocId}`, {
        role: 'student',
        teacherId: teacherIdFound,
        classId: matchedClassId,
        studentName: finalStudentName
      });
    } catch (authErr) {
      console.warn('Custom token creation skipped/failed:', authErr.message);
    }

    return res.status(200).json({
      success: true,
      customToken,
      studentName: finalStudentName,
      classroom: matchedClassData,
      teacher: { uid: teacherIdFound, ...teacherData }
    });

  } catch (err) {
    console.error('Student Auth API Error:', err);
    return res.status(500).json({ error: err.message || 'Authentication error' });
  }
}
