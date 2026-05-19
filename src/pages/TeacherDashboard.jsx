import React, { useState, useEffect } from 'react';
import {
  Pencil,
  LayoutDashboard, 
  BookOpen, 
  Search, 
  Bell, 
  Heart, 
  ChevronDown, 
  ArrowRight,
  AlertCircle,
  Settings,
  MoreHorizontal,
  LogOut,
  Zap,
  Lock,
  Trash2,
  Calendar,
  Plus,
  ChevronRight,
  Star,
  MoreVertical,
  Home,
  Users,
  User,
  MessageSquare,
  BarChart,
  Trophy,
  X
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';

const toTitleCase = (str) => {
  if (!str) return '';
  return str
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
import { collection, doc, getDoc, setDoc, getDocs, query, orderBy, deleteDoc, where, onSnapshot, addDoc } from 'firebase/firestore';
import HomeworkGenerator from './HomeworkGenerator';
import { encryptText, decryptText } from '../utils/crypto';

const TeacherDashboard = ({ user, onLogout }) => {
  console.log("TeacherDashboard Rendered. User:", user);
  const [classrooms, setClassrooms] = useState([]);
  const [activeClassroom, setActiveClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState('');
  const [newClassName, setNewClassName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [dashboardTimeFilter, setDashboardTimeFilter] = useState('Weekly');
  const [timeFilteredSubmissions, setTimeFilteredSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [reviewHomework, setReviewHomework] = useState(null);
  const [isFetchingReview, setIsFetchingReview] = useState(false);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [allHomeworks, setAllHomeworks] = useState([]);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [aiKeys, setAiKeys] = useState({
    gemini: localStorage.getItem('hwz_gemini_key') || '',
    openai: localStorage.getItem('hwz_openai_key') || '',
    anthropic: localStorage.getItem('hwz_anthropic_key') || ''
  });
  const [activeAi, setActiveAi] = useState(localStorage.getItem('hwz_active_ai') || 'gemini');
  const [showAiSettings, setShowAiSettings] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [filterClass, setFilterClass] = useState('All Classes');
  const [searchQuery, setSearchQuery] = useState('');
  const [rewardsTab, setRewardsTab] = useState('Overview');
  const [messagesTab, setMessagesTab] = useState('Inbox');
  const [activeChat, setActiveChat] = useState(null);
  const [teacherMessages, setTeacherMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [showNewMsgModal, setShowNewMsgModal] = useState(false);
  const [newMsgRecipientType, setNewMsgRecipientType] = useState('student');
  const [newMsgRecipientId, setNewMsgRecipientId] = useState('');
  const [newMsgSubject, setNewMsgSubject] = useState('');
  const [newMsgBody, setNewMsgBody] = useState('');
  const getStudentAvatar = (name) => {
     const st = allStudents.find(s => s.id?.toLowerCase() === name?.toLowerCase() || s.name?.toLowerCase() === name?.toLowerCase());
     if (st?.avatarUrl) {
        return st.avatarUrl;
     }
     return `https://api.dicebear.com/7.x/adventurer/svg?seed=${name || 'student'}`;
  };

  const [homeworkSubject, setHomeworkSubject] = useState('English');
  const [homeworkTitle, setHomeworkTitle] = useState('');
  const [homeworkInstructions, setHomeworkInstructions] = useState('');
  const [homeworkPoints, setHomeworkPoints] = useState(10);
  const [submissions, setSubmissions] = useState([]);
  
  const [selectedCalendarHw, setSelectedCalendarHw] = useState(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('Dino Pizza Party! 🍕');
  const [newGoalTarget, setNewGoalTarget] = useState(1500);
  const [dashboardRosterTab, setDashboardRosterTab] = useState('Support');

  const fetchSubmissions = async () => {
    if (!user?.uid) return;
    try {
      const q = query(
        collection(db, 'submissions'), 
        where('teacherId', '==', user.uid),
        orderBy('submittedAt', 'desc')
      );
      const snap = await getDocs(q);
      const subList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubmissions(subList);
    } catch (err) {
      console.error("Fetch Submissions Error:", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'Gradebook') {
       fetchSubmissions();
    }
  }, [activeTab]);

  const SUBJECT_ICONS = {
    'English': '/ic-homework.png',
    'Maths': '/ic-reports.png',
    'Science': '/ic-students.png',
    'Art': '/ic-rewards.png',
    'Music': '/ic-messages.png',
    'History': '/ic-classes.png'
  };

  const CLASS_IMAGES = [
    '/mascot.png',
    '/dino-reading.png',
    '/rocket_mascot.png',
    '/equip_mascot.png',
    '/student_avatar.png'
  ];

  const saveAiKeys = async () => {
    localStorage.setItem('hwz_gemini_key', aiKeys.gemini);
    localStorage.setItem('hwz_openai_key', aiKeys.openai);
    localStorage.setItem('hwz_anthropic_key', aiKeys.anthropic);
    localStorage.setItem('hwz_active_ai', activeAi);
    
    if (user?.uid) {
      try {
        const teacherDoc = await getDoc(doc(db, 'teachers', user.uid));
        const dbCode = teacherDoc.exists() ? teacherDoc.data().teacherCode : '';
        const code = user.teacherCode || dbCode || user.uid.slice(0, 6).toUpperCase();
        
        const encGemini = aiKeys.gemini ? await encryptText(aiKeys.gemini, code) : '';
        const encOpenai = aiKeys.openai ? await encryptText(aiKeys.openai, code) : '';
        const encAnthropic = aiKeys.anthropic ? await encryptText(aiKeys.anthropic, code) : '';
        
        await setDoc(doc(db, 'teachers', user.uid), {
          encryptedAiKeys: {
            gemini: encGemini,
            openai: encOpenai,
            anthropic: encAnthropic
          },
          activeAi: activeAi
        }, { merge: true });
        alert("AI Configuration saved securely to Cloud and locally! 🧠🔒");
      } catch (err) {
        console.error("Save AI settings to Firestore failed:", err);
        alert("AI Configuration saved locally, but failed to sync to Cloud. ⚠️");
      }
    } else {
      alert("AI Configuration saved locally! 🧠🔒");
    }
    setShowAiSettings(false);
  };

  useEffect(() => {
    const loadCloudAiSettings = async () => {
      if (!user?.uid) return;
      try {
        const teacherDoc = await getDoc(doc(db, 'teachers', user.uid));
        if (teacherDoc.exists()) {
          const data = teacherDoc.data();
          if (data.activeAi) {
            setActiveAi(data.activeAi);
            localStorage.setItem('hwz_active_ai', data.activeAi);
          }
          const code = user.teacherCode || data.teacherCode || user.uid.slice(0, 6).toUpperCase();
          
          if (data.encryptedAiKeys) {
            const decryptedGemini = await decryptText(data.encryptedAiKeys.gemini, code);
            const decryptedOpenai = await decryptText(data.encryptedAiKeys.openai, code);
            const decryptedAnthropic = await decryptText(data.encryptedAiKeys.anthropic, code);
            
            setAiKeys({
              gemini: decryptedGemini,
              openai: decryptedOpenai,
              anthropic: decryptedAnthropic
            });
            
            if (decryptedGemini) localStorage.setItem('hwz_gemini_key', decryptedGemini);
            if (decryptedOpenai) localStorage.setItem('hwz_openai_key', decryptedOpenai);
            if (decryptedAnthropic) localStorage.setItem('hwz_anthropic_key', decryptedAnthropic);
          } else if (aiKeys.gemini || aiKeys.openai || aiKeys.anthropic) {
            // Migrate local keys to Cloud
            const encGemini = aiKeys.gemini ? await encryptText(aiKeys.gemini, code) : '';
            const encOpenai = aiKeys.openai ? await encryptText(aiKeys.openai, code) : '';
            const encAnthropic = aiKeys.anthropic ? await encryptText(aiKeys.anthropic, code) : '';
            
            await setDoc(doc(db, 'teachers', user.uid), {
              encryptedAiKeys: {
                gemini: encGemini,
                openai: encOpenai,
                anthropic: encAnthropic
              },
              activeAi: activeAi
            }, { merge: true });
            console.log("Legacy local storage keys migrated to encrypted cloud successfully.");
          }
        }
      } catch (err) {
        console.error("Load cloud AI settings error:", err);
      }
    };
    loadCloudAiSettings();
  }, [user]);

  useEffect(() => {
    if (user?.uid) {
      fetchClassrooms();
    }
  }, [user]);

  useEffect(() => {
    if (user?.uid && activeClassroom) {
      fetchStudents();
    }
  }, [user, activeClassroom, activeTab]);

  useEffect(() => {
    if (!user?.uid) return;
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef, 
      where('teacherId', '==', user.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allMsgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => {
         const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
         const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
         return dateB - dateA;
      });
      setTeacherMessages(allMsgs);
    }, (err) => {
      console.error("Error loading teacher messages:", err);
    });
    return () => unsubscribe();
  }, [user]);

  const fetchClassrooms = async () => {
    if (!user?.uid) return;
    try {
      console.log("TeacherDashboard: Fetching classrooms for:", user.uid);
      const q = query(collection(db, 'teachers', user.uid, 'classrooms'));
      const querySnapshot = await getDocs(q);
      
      const list = await Promise.all(querySnapshot.docs.map(async docSnapshot => {
        const data = docSnapshot.data();
        const studentsSnap = await getDocs(collection(db, 'teachers', user.uid, 'classrooms', docSnapshot.id, 'students'));
        return { 
          id: docSnapshot.id, 
          ...data,
          studentCount: studentsSnap.size
        };
      }));

      const getGradeNumber = (name) => {
        if (!name) return 999;
        const match = name.match(/\d+/);
        return match ? parseInt(match[0], 10) : 999;
      };

      list.sort((a, b) => {
        const gradeA = getGradeNumber(a.name);
        const gradeB = getGradeNumber(b.name);
        if (gradeA !== gradeB) return gradeA - gradeB;
        return (a.name || '').localeCompare(b.name || '');
      });

      console.log("TeacherDashboard: Classrooms updated & sorted:", list.length);
      setClassrooms([...list]); // Use spread to force new reference
      
      if (list.length > 0 && !activeClassroom) {
        setActiveClassroom(list[0]);
      } else if (list.length === 0) {
        setActiveClassroom(null);
      }
    } catch (err) {
      console.error("TeacherDashboard: Fetch Classrooms Error:", err);
    }
  };

  const handleAddClassroom = async () => {
    console.log("Add Classroom triggered:", { newClassName, userId: user?.uid });
    if (!newClassName.trim() || !user?.uid) {
      alert("Missing class name or teacher session! ⚠️");
      return;
    }
    
    setIsAddingClass(true);
    try {
      const classId = newClassName.trim().toLowerCase().replace(/\s+/g, '-');
      const classRef = doc(db, 'teachers', user.uid, 'classrooms', classId);
      
      await setDoc(classRef, {
        name: newClassName.trim(),
        createdAt: new Date().toISOString(),
        teacherUid: user.uid,
        subjects: selectedSubjects
      });
      
      console.log("Class created successfully:", classId);
      setNewClassName('');
      setSelectedSubjects([]);
      await fetchClassrooms();
      setShowAddClassModal(false);
      alert("Class created successfully! 🎨✨");
    } catch (err) {
      console.error("Add Classroom Error:", err);
      alert(`Oops! Failed to create class: ${err.message} ❌`);
    } finally {
      setIsAddingClass(false);
    }
  };

  
  const handleRenameClassroom = async (classId, newName) => {
    if (!user?.uid) return;
    try {
      const classRef = doc(db, 'teachers', user.uid, 'classrooms', classId);
      await setDoc(classRef, { name: newName }, { merge: true });
      setClassrooms(prev => prev.map(c => c.id === classId ? { ...c, name: newName } : c));
      if (activeClassroom?.id === classId) {
         setActiveClassroom(prev => ({ ...prev, name: newName }));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to rename class. Please try again.");
    }
  };

  const handleDeleteClassroom = async (classId) => {
    console.log("TeacherDashboard: Starting deletion process for:", classId);
    if (!user?.uid) {
      alert("Session expired. Please log in again. ⚠️");
      return;
    }
    
    try {
      const classRef = doc(db, 'teachers', user.uid, 'classrooms', classId);
      console.log("TeacherDashboard: Executing deleteDoc at path:", classRef.path);
      await deleteDoc(classRef);
      console.log("TeacherDashboard: deleteDoc successfully resolved.");
      
      if (activeClassroom?.id === classId) {
        setActiveClassroom(null);
      }
      
      await fetchClassrooms();
      alert("Class deleted successfully! 🗑️✨");
    } catch (err) {
      console.error("TeacherDashboard: Delete Error:", err);
      alert(`Oops! Delete failed: ${err.message} ❌`);
    }
  };

  const fetchStudents = async () => {
    if (!user?.uid || !activeClassroom) return;
    try {
      const q = query(collection(db, 'teachers', user.uid, 'classrooms', activeClassroom.id, 'students'), orderBy('name'));
      const querySnapshot = await getDocs(q);
      const studentList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStudents(studentList);
    } catch (err) {
      console.error("Fetch Students Error:", err);
    }
  };

  const handleAddStudent = async () => {
    const studentName = newStudentName || newStudent;
    if (!studentName.trim() || !user?.uid || !activeClassroom) return;
    setIsAdding(true);
    try {
      const cleanName = toTitleCase(studentName);
      const studentRef = doc(db, 'teachers', user.uid, 'classrooms', activeClassroom.id, 'students', cleanName.toLowerCase());
      await setDoc(studentRef, {
        name: cleanName,
        addedAt: new Date().toISOString()
      });
      setNewStudentName('');
      setNewStudent('');
      fetchStudents();
      fetchAllStudents();
    } catch (err) {
      console.error("Add Student Error:", err);
    }
    setIsAdding(false);
  };

  const fetchDashboardSubmissions = async () => {
    if (!user) return;
    try {
      const hwQ = query(collection(db, 'homeworks'), where('teacherId', '==', user.uid));
      const hwSnap = await getDocs(hwQ);
      const hwMap = {};
      const hwList = [];
      hwSnap.docs.forEach(d => {
         const data = d.data();
         hwMap[d.id] = data.assignedClassId;
         hwList.push({ id: d.id, ...data });
      });
      setAllHomeworks(hwList);

      const q = query(collection(db, 'submissions'), where('teacherId', '==', user.uid));
      const snap = await getDocs(q);
      setAllSubmissions(snap.docs.map(d => ({ 
         id: d.id, 
         ...d.data(),
         classId: d.data().classId || hwMap[d.data().homeworkId] || null
      })));
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (user) fetchDashboardSubmissions();
  }, [user]);

  useEffect(() => {
    const now = new Date();
    let cutoffDate = new Date();
    if (dashboardTimeFilter === 'Daily') cutoffDate.setDate(now.getDate() - 7); // Daily shows every day of the week
    else if (dashboardTimeFilter === 'Weekly') cutoffDate.setMonth(now.getMonth() - 1); // Weekly shows every week of the month
    else if (dashboardTimeFilter === 'Monthly') cutoffDate.setFullYear(now.getFullYear() - 1); // Monthly shows every month of the year
    else cutoffDate.setDate(now.getDate() - 1); // fallback

    const filtered = allSubmissions.filter(s => {
      const subDate = s.submittedAt?.toDate ? s.submittedAt.toDate() : new Date(s.submittedAt);
      const isTimeValid = subDate >= cutoffDate;
      const isClassValid = activeClassroom ? s.classId === activeClassroom.id : true;
      return isTimeValid && isClassValid;
    });
    setTimeFilteredSubmissions(filtered);
  }, [dashboardTimeFilter, allSubmissions, activeClassroom]);

  useEffect(() => {
    const fetchHomeworkDetails = async () => {
      if (!selectedSubmission) return;
      setIsFetchingReview(true);
      try {
        const hwDoc = await getDoc(doc(db, 'homeworks', selectedSubmission.homeworkId));
        if (hwDoc.exists()) setReviewHomework(hwDoc.data());
        else setReviewHomework(null);
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetchingReview(false);
      }
    };
    fetchHomeworkDetails();
  }, [selectedSubmission]);

  const fetchAllStudents = async () => {
    if (!user?.uid || classrooms.length === 0) return;
    try {
      let aggregated = [];
      for (const cls of classrooms) {
        const studentsRef = collection(db, 'teachers', user.uid, 'classrooms', cls.id, 'students');
        const q = query(studentsRef, orderBy('addedAt', 'desc'));
        const snapshot = await getDocs(q);
        const classStudents = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          className: cls.name,
          classId: cls.id,
          email: `${doc.id}@example.com` // Mock email for UI consistency
        }));
        aggregated = [...aggregated, ...classStudents];
      }
      setAllStudents(aggregated);
    } catch (err) {
      console.error("Fetch All Students Error:", err);
    }
  };

  useEffect(() => {
    if (user && classrooms.length > 0) {
       fetchAllStudents();
    }
  }, [user, classrooms, activeTab]);

  const handleDeleteStudent = async (e, studentId, studentName, classId) => {
    e.stopPropagation();
    const targetClassId = classId || activeClassroom?.id;
    if (!user?.uid || !targetClassId || !window.confirm(`Remove ${studentName} from the class? 🍎`)) return;
    
    try {
      const studentRef = doc(db, 'teachers', user.uid, 'classrooms', targetClassId, 'students', studentId);
      await deleteDoc(studentRef);
      
      // Refresh both states to ensure consistency
      fetchAllStudents();
      fetchStudents(); 
      fetchClassrooms(); // Update counts on main dashboard
      
      alert(`${studentName} has been removed. ✨`);
    } catch (err) {
      console.error("Delete Student Error:", err);
      alert("Oops! Failed to remove student. ❌");
    }
  };

  const handleSaveGoal = async () => {
    if (!activeClassroom) return;
    try {
      await setDoc(doc(db, 'teachers', user.uid, 'classrooms', activeClassroom.id), {
        goalTitle: newGoalTitle,
        goalTarget: Number(newGoalTarget)
      }, { merge: true });
      
      // Update activeClassroom locally so the UI updates instantly!
      setActiveClassroom(prev => ({
        ...prev,
        goalTitle: newGoalTitle,
        goalTarget: Number(newGoalTarget)
      }));
      setIsEditingGoal(false);
      alert("Classroom collaborative goal saved successfully! 🚀");
    } catch (err) {
      console.error(err);
      alert("Failed to save goal.");
    }
  };

  const handleResetGoalProgress = async () => {
    if (!activeClassroom) return;
    if (!window.confirm("Are you sure you want to reset the combined points progress for this classroom goal? 🔄\n\nThis will reset the thermometer and pizza back to 0, but will NOT delete any student grades, homework submissions, or history!")) return;
    
    try {
      // Re-calculate raw points right now so we have the absolute current total
      const classStudents = allStudents.filter(s => s.classId === activeClassroom.id);
      const computedStudents = classStudents.map(student => {
         const studentSubs = allSubmissions.filter(sub => 
            sub.studentName?.toLowerCase() === student.name?.toLowerCase()
         );
         const completedCount = studentSubs.length;
         const totalScore = studentSubs.reduce((acc, sub) => acc + (sub.score || 0), 0);
         const basePoints = 100;
         return basePoints + (completedCount * 50) + totalScore;
      });

      const currentClassRawPoints = computedStudents.reduce((acc, points) => acc + points, 0);

      // Save the raw points as the new reset offset in Firestore
      await setDoc(doc(db, 'teachers', user.uid, 'classrooms', activeClassroom.id), {
        goalResetPointsOffset: currentClassRawPoints
      }, { merge: true });

      // Update local activeClassroom state
      setActiveClassroom(prev => ({
        ...prev,
        goalResetPointsOffset: currentClassRawPoints
      }));

      setIsEditingGoal(false);
      alert("Goal points progress has been reset back to 0! 🔄🎒 Let's build a new adventure!");
    } catch (err) {
      console.error("Reset Goal Progress Error:", err);
      alert("Oops! Failed to reset goal progress. ❌");
    }
  };

  const renderContent = () => {
      switch (activeTab) {
          case 'Dashboard': {
             const uniqueSubmitters = new Set(timeFilteredSubmissions.map(s => s.studentName)).size;
             const avgScoreTotal = timeFilteredSubmissions.length > 0 
                ? Math.round(timeFilteredSubmissions.reduce((acc, sub) => acc + sub.score, 0) / timeFilteredSubmissions.length)
                : 0;

             // Classrooms student point math
             const classStudents = allStudents.filter(s => !activeClassroom || s.classId === activeClassroom.id);
             const classHomeworks = allHomeworks.filter(hw => hw.status === 'published' && (!activeClassroom || hw.assignedClassId === activeClassroom.id));
             const pendingDrafts = allHomeworks.filter(hw => hw.status === 'draft' && (!activeClassroom || hw.assignedClassId === activeClassroom.id));
             const classSubmissions = allSubmissions.filter(sub => {
                if (!activeClassroom) return true;
                const hw = allHomeworks.find(h => h.id === sub.homeworkId);
                const subClassId = sub.classId || hw?.assignedClassId;
                return subClassId === activeClassroom.id;
             });

             const computedStudents = classStudents.map(student => {
                const studentSubs = allSubmissions.filter(sub => 
                   sub.studentName?.toLowerCase() === student.name?.toLowerCase()
                );
                const completedCount = studentSubs.length;
                const totalScore = studentSubs.reduce((acc, sub) => acc + (sub.score || 0), 0);
                const basePoints = 100;
                return {
                   ...student,
                   points: basePoints + (completedCount * 50) + totalScore,
                   completedCount
                };
             });

             const rawClassPoints = computedStudents.reduce((acc, s) => acc + s.points, 0);
             const resetOffset = activeClassroom?.goalResetPointsOffset || 0;
             const currentClassPoints = Math.max(0, rawClassPoints - resetOffset);
             const targetTitle = activeClassroom?.goalTitle || 'Dino Pizza Party! 🍕';
             const targetGoal = activeClassroom?.goalTarget || 1500;
             const progressPercent = Math.min(Math.round((currentClassPoints / targetGoal) * 100), 100);

             // Calculate subject averages (always pre-populate the three core areas)
             const subjectStats = {
                'Maths': { total: 0, count: 0 },
                'Science': { total: 0, count: 0 },
                'English': { total: 0, count: 0 }
             };
             classSubmissions.forEach(sub => {
                const hw = allHomeworks.find(h => h.id === sub.homeworkId);
                let subject = hw ? hw.subject : 'General';
                if (subject?.toLowerCase() === 'maths' || subject?.toLowerCase() === 'math') subject = 'Maths';
                else if (subject?.toLowerCase() === 'science') subject = 'Science';
                else if (subject?.toLowerCase() === 'english') subject = 'English';
                else subject = 'General';

                if (!subjectStats[subject]) subjectStats[subject] = { total: 0, count: 0 };
                subjectStats[subject].total += sub.score || 0;
                subjectStats[subject].count += 1;
             });

             const subjectAverages = Object.entries(subjectStats)
                .map(([subj, data]) => ({
                   subject: subj,
                   average: data.count > 0 ? Math.round(data.total / data.count) : 0,
                   count: data.count
                }))
                .filter(sa => ['Maths', 'Science', 'English'].includes(sa.subject) || sa.count > 0);

             const activeSubjectAverages = subjectAverages.filter(sa => sa.count > 0);
             const sortedByAvg = [...activeSubjectAverages].sort((a, b) => a.average - b.average);
             const weakness = sortedByAvg[0] || { subject: 'None yet', average: 100 };

             // Dynamic AI Learning Gaps Analysis based on actual student homework grades
             const learningGaps = [];
             subjectAverages.forEach(sa => {
                if (sa.count > 0 && sa.average < 75) {
                   // Find the homework in this subject with the lowest class average
                   const subjectHws = classHomeworks.filter(h => {
                      let subj = h.subject || 'General';
                      if (subj?.toLowerCase() === 'maths' || subj?.toLowerCase() === 'math') subj = 'Maths';
                      else if (subj?.toLowerCase() === 'science') subj = 'Science';
                      else if (subj?.toLowerCase() === 'english') subj = 'English';
                      return subj === sa.subject;
                   });

                   let worstHw = null;
                   let lowestAvg = 100;
                   subjectHws.forEach(hw => {
                      const hwSubs = classSubmissions.filter(sub => sub.homeworkId === hw.id);
                      if (hwSubs.length > 0) {
                         const avg = Math.round(hwSubs.reduce((a, b) => a + (b.score || 0), 0) / hwSubs.length);
                         if (avg < lowestAvg) {
                            lowestAvg = avg;
                            worstHw = hw;
                         }
                      }
                   });

                   let focusTopic = worstHw ? worstHw.title : 'General Concepts';
                   let tip = '';
                   if (sa.subject === 'Maths') {
                      tip = `Review fraction partitioning and numerator/denominator definitions in the next lesson.`;
                   } else if (sa.subject === 'Science') {
                      tip = `Use orbital visual aids and reinforce planet order/distances.`;
                   } else if (sa.subject === 'English') {
                      tip = `Spend 10 minutes practicing core vocabulary rules and dictionary spelling checks.`;
                   } else {
                      tip = `Conduct a 5-minute warm-up quiz on recent content before lecturing.`;
                   }

                   learningGaps.push({
                      subject: sa.subject,
                      average: sa.average,
                      topic: focusTopic,
                      tip: tip
                   });
                }
             });

             const studentAverages = {};
             classStudents.forEach(student => {
                const subs = classSubmissions.filter(sub => sub.studentName?.toLowerCase() === student.name?.toLowerCase());
                if (subs.length > 0) {
                   const total = subs.reduce((acc, sub) => acc + (sub.score || 0), 0);
                   studentAverages[student.name] = {
                      avg: Math.round(total / subs.length),
                      count: subs.length
                   };
                }
             });

             const struggling = Object.entries(studentAverages)
                .filter(([name, data]) => data.avg < 60)
                .map(([name, data]) => ({ name, ...data }));

             const risingStars = Object.entries(studentAverages)
                .filter(([name, data]) => data.avg >= 85 && data.count >= 1)
                .map(([name, data]) => ({ name, ...data }));

             let chartLabels = [];
             let chartData = [];
             
             if (dashboardTimeFilter === 'Daily') {
                const getDayLabel = (daysAgo) => {
                   const d = new Date();
                   d.setDate(d.getDate() - daysAgo);
                   return d.toLocaleDateString('en-US', { weekday: 'short' });
                };
                chartLabels = [getDayLabel(6), getDayLabel(5), getDayLabel(4), getDayLabel(3), getDayLabel(2), getDayLabel(1), getDayLabel(0)];
                chartData = [[], [], [], [], [], [], []];
                const now = new Date();
                timeFilteredSubmissions.forEach(sub => {
                   const subDate = sub.submittedAt?.toDate ? sub.submittedAt.toDate() : new Date(sub.submittedAt);
                   const diffDays = Math.floor((now - subDate) / (1000 * 60 * 60 * 24));
                   if (diffDays >= 0 && diffDays < 7) {
                      chartData[6 - diffDays].push(sub.score);
                   }
                });
             } else if (dashboardTimeFilter === 'Weekly') {
                chartLabels = ['Wk1', 'Wk2', 'Wk3', 'Wk4'];
                chartData = [[], [], [], []];
                const now = new Date();
                timeFilteredSubmissions.forEach(sub => {
                   const subDate = sub.submittedAt?.toDate ? sub.submittedAt.toDate() : new Date(sub.submittedAt);
                   const diffWeeks = Math.floor((now - subDate) / (1000 * 60 * 60 * 24 * 7));
                   if (diffWeeks >= 0 && diffWeeks < 4) {
                      chartData[3 - diffWeeks].push(sub.score);
                   }
                });
             } else {
                const getMonthLabel = (monthsAgo) => {
                   const d = new Date();
                   d.setMonth(d.getMonth() - monthsAgo);
                   return d.toLocaleDateString('en-US', { month: 'short' });
                };
                chartLabels = [
                   getMonthLabel(11), getMonthLabel(10), getMonthLabel(9), getMonthLabel(8),
                   getMonthLabel(7), getMonthLabel(6), getMonthLabel(5), getMonthLabel(4),
                   getMonthLabel(3), getMonthLabel(2), getMonthLabel(1), getMonthLabel(0)
                ];
                chartData = [[], [], [], [], [], [], [], [], [], [], [], []];
                const now = new Date();
                timeFilteredSubmissions.forEach(sub => {
                   const subDate = sub.submittedAt?.toDate ? sub.submittedAt.toDate() : new Date(sub.submittedAt);
                   const diffMonths = (now.getFullYear() - subDate.getFullYear()) * 12 + (now.getMonth() - subDate.getMonth());
                   if (diffMonths >= 0 && diffMonths < 12) {
                      chartData[11 - diffMonths].push(sub.score);
                   }
                });
             }

             const chartAverages = chartData.map(bucket => bucket.length > 0 ? Math.round(bucket.reduce((a,b)=>a+b,0)/bucket.length) : 0);
             const chartCounts = chartData.map(bucket => bucket.length);
             const timePeriodLabel = dashboardTimeFilter === 'Daily' ? 'week' : (dashboardTimeFilter === 'Weekly' ? 'month' : 'year');

             return (
                <div className="px-6 py-6 space-y-6 pb-20 relative min-h-[calc(100vh-64px)] bg-[#FAF9FF]">
                   {/* Top Summary Banner */}
                   <div className="flex items-center justify-between">
                       <div className="space-y-1">
                          <h1 className="text-3xl font-black text-[#3C2E75] tracking-tight">Daily Summary Hub</h1>
                          <p className="text-sm font-bold text-[#8C83B5]">Real-time learning diagnostic metrics across your classrooms.</p>
                       </div>
                       <div className="flex items-center gap-2 bg-[#FFF0FA] p-1.5 rounded-2xl border border-[#FFDDF5]">
                          {['Daily', 'Weekly', 'Monthly'].map(f => (
                             <button 
                                key={f}
                                onClick={() => setDashboardTimeFilter(f)}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${dashboardTimeFilter === f ? 'bg-white text-[#C23C9F] shadow-sm' : 'text-[#C23C9F]/60 hover:text-[#C23C9F]'}`}
                             >
                                {f}
                             </button>
                          ))}
                       </div>
                    </div>

                   {/* Colorful KPI Metrics (Curated Pastels) */}
                   <div className="grid grid-cols-4 gap-6">
                      <RewardKPICard title="Total Roster" value={activeClassroom ? students.length : allStudents.length} subtitle={activeClassroom ? "Class Active Roster" : "Global Roster"} bgColor="bg-[#FAF2FF] border-[#E8C6FF]" textColor="text-[#7828B4]" />
                      <RewardKPICard title="Average Grade" value={`${avgScoreTotal}%`} subtitle="Class Diagnostic Avg" bgColor="bg-[#EAFBF7] border-[#BCEEE2]" textColor="text-[#1E8A74]" />
                      <RewardKPICard title="Team Points Goal" value={`${progressPercent}%`} subtitle={`${currentClassPoints} / ${targetGoal} pts`} bgColor="bg-[#FFF0EB] border-[#FFD2C4]" textColor="text-[#C64F33]" />
                      <RewardKPICard title="Submissions" value={timeFilteredSubmissions.length} subtitle={`Completed this ${timePeriodLabel}`} bgColor="bg-[#FFFCE8] border-[#FCEE9D]" textColor="text-[#8C761E]" />
                   </div>

                   {/* Split Row: Performance vs Goals / AI Hub */}
                   <div className="grid grid-cols-12 gap-6">
                      {/* Left: Class Performance, Subject Mastery, & Team Goal Thermometer */}
                      <div className="col-span-8 space-y-6">
                         {/* Class Performance Graph */}
                         <div className="bg-white rounded-[32px] border border-[#E9E4FF] shadow-sm p-6 space-y-4">
                            <div>
                               <h3 className="text-sm font-black text-[#3C2E75] tracking-tight">Class Academic Progress</h3>
                               <p className="text-[9px] font-black text-[#8C83B5] uppercase tracking-widest">{dashboardTimeFilter} progress across core subjects</p>
                            </div>

                            <div className="h-48 flex items-end justify-between gap-2 pr-4 pb-4 border-b border-[#FAF2FF] relative">
                               {/* Y-Axis Guidelines */}
                               <div className="absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none z-0">
                                  {[100, 75, 50, 25, 0].map((val, i) => (
                                     <div key={i} className="w-full flex items-center gap-4">
                                        <span className="text-[10px] font-black text-[#B0A7D4] w-8 text-right">{val}%</span>
                                        <div className="flex-1 h-px bg-[#8A70FF] opacity-[0.08]" />
                                     </div>
                                  ))}
                               </div>
                               
                               <div className="w-8 shrink-0 hidden md:block" />

                               {chartLabels.map((label, i) => (
                                  <div key={i} className="flex flex-col items-center gap-4 flex-1 group relative h-full pt-4 z-10">
                                     <div className="flex-1 flex items-end gap-3 relative w-full h-full justify-center">
                                        {chartAverages[i] > 0 && (
                                            <div className="absolute -top-8 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-[11px] font-black text-[#C23C9F] bg-[#FFF0FA] px-2 py-0.5 rounded-full shadow-sm">{chartAverages[i]}%</span>
                                                <span className="text-[9px] font-bold text-slate-400 mt-1 whitespace-nowrap">{chartCounts[i]} items</span>
                                            </div>
                                        )}
                                        {/* Colorful soft purple bar */}
                                        <div className="w-12 bg-gradient-to-t from-[#8A70FF] to-[#CE93D8] rounded-t-xl shadow-lg shadow-purple-50 transition-all duration-1000 ease-out absolute bottom-0" style={{ height: `${Math.max(2, chartAverages[i] || 0)}%` }} />
                                     </div>
                                     <span className="text-[10px] font-black text-[#5C4D9F]">{label}</span>
                                  </div>
                               ))}
                            </div>
                         </div>

                         {/* Subject Diagnostic Mastery Breakdown (AI Gaps) */}
                         <div className="bg-white rounded-[32px] border border-[#E9E4FF] shadow-sm p-6 space-y-4">
                            <div className="flex justify-between items-center">
                               <div>
                                  <h3 className="text-sm font-black text-[#3C2E75] tracking-tight">Subject Diagnostic Mastery</h3>
                                  <p className="text-[9px] font-black text-[#8C83B5] uppercase tracking-widest">Calculated average scores by subject area</p>
                               </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                               {subjectAverages.map(sa => {
                                  let barColor = "bg-[#CE93D8]";
                                  let textColor = "text-[#7828B4]";
                                  let cardBg = "bg-[#FAF2FF] border-[#E8C6FF]/40";
                                  if (sa.subject === 'Maths') {
                                     barColor = "bg-[#FF7043]";
                                     textColor = "text-[#C64F33]";
                                     cardBg = "bg-[#FFF0EB] border-[#FFD2C4]/40";
                                  } else if (sa.subject === 'Science') {
                                     barColor = "bg-[#26A69A]";
                                     textColor = "text-[#1E8A74]";
                                     cardBg = "bg-[#EAFBF7] border-[#BCEEE2]/40";
                                  } else if (sa.subject === 'English') {
                                     barColor = "bg-[#FFCA28]";
                                     textColor = "text-[#8C761E]";
                                     cardBg = "bg-[#FFFCE8] border-[#FCEE9D]/40";
                                  }

                                  return (
                                     <div key={sa.subject} className={`p-4 rounded-2xl border ${cardBg} space-y-2 flex flex-col justify-between`}>
                                        <div className="flex justify-between items-center">
                                           <span className="text-xs font-black text-[#3C2E75]">{sa.subject}</span>
                                           <span className={`text-xs font-black ${textColor}`}>{sa.count > 0 ? `${sa.average}%` : 'N/A'}</span>
                                        </div>
                                        <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-slate-100">
                                           <div className={`h-full rounded-full ${barColor}`} style={{ width: `${sa.average}%` }} />
                                        </div>
                                        <span className="text-[8px] font-bold text-slate-400 block text-right">
                                           {sa.count > 0 ? `${sa.count} assignment${sa.count > 1 ? 's' : ''}` : 'No submissions yet'}
                                        </span>
                                     </div>
                                  );
                               })}
                               {subjectAverages.length === 0 && (
                                  <div className="col-span-3 text-center text-slate-400 font-bold text-xs italic py-6">No diagnostic mastery data available yet.</div>
                               )}
                            </div>
                         </div>

                         {/* Classroom Collaborative Goal Thermometer */}
                         {false && activeClassroom && (
                            <div className="bg-white rounded-[32px] border border-[#E9E4FF] shadow-sm p-6 space-y-4">
                               <div className="flex justify-between items-center">
                                  <div className="space-y-1">
                                     <span className="text-[10px] font-black uppercase text-[#FFAB91] tracking-wider">Active Classroom Collaborative Goal</span>
                                     <h3 className="text-xl font-black text-[#3C2E75]">{targetTitle}</h3>
                                  </div>
                                  <button 
                                     onClick={() => {
                                        setNewGoalTitle(targetTitle);
                                        setNewGoalTarget(targetGoal);
                                        setIsEditingGoal(true);
                                     }}
                                     className="px-5 py-2.5 border-2 border-[#FFE0D6] hover:border-[#FFAB91] text-[#C64F33] rounded-2xl text-xs font-black transition-all bg-white"
                                  >
                                     Change Goal ✏️
                                  </button>
                               </div>

                               <div className="space-y-4 pt-2">
                                  <div className="flex justify-between text-sm font-black text-[#3C2E75]">
                                     <span>Class Combined Journey Points</span>
                                     <span className="text-[#FF7043]">{currentClassPoints} / {targetGoal} Points</span>
                                  </div>
                                  
                                  {/* Beautiful Pink Thermometer Progress Bar */}
                                  <div className="h-8 w-full bg-[#FFF9F9] border border-[#FFE3E3] rounded-3xl overflow-hidden p-1 shadow-inner relative flex items-center">
                                     <div 
                                        className="h-full rounded-2xl bg-gradient-to-r from-[#FF7043] to-pink-400 transition-all duration-1000 flex items-center justify-end pr-4 shadow-[0_0_12px_rgba(255,112,67,0.35)]"
                                        style={{ width: `${progressPercent}%` }}
                                     >
                                        <span className="text-[10px] font-black text-white uppercase tracking-wider">{progressPercent}%</span>
                                     </div>
                                  </div>
                               </div>
                            </div>
                         )}
                      </div>

                      {/* Right: AI Teaching Co-Pilot Diagnostic Card */}
                      <div className="col-span-4 space-y-6">
                         {/* Pending Drafts Warning Card */}
                         {pendingDrafts.length > 0 && (
                            <div className="bg-gradient-to-br from-[#FFF0FA] to-[#FFE5F6] rounded-[32px] border border-[#FFD5F0] shadow-sm p-6 space-y-4 animate-in slide-in-from-top duration-300">
                               <div className="flex items-center gap-3">
                                  <span className="text-3xl animate-bounce">📝</span>
                                  <div>
                                     <h3 className="text-xl font-black text-[#8A1F6E] tracking-tight">Drafts Pending Review</h3>
                                     <p className="text-[9px] font-black text-[#C6339A] uppercase tracking-widest">Left to be checked & published</p>
                                  </div>
                               </div>
                               
                               <div className="space-y-2">
                                  <p className="text-xs font-bold text-[#8A1F6E]/80">
                                     You have <span className="font-black text-[#C6339A] text-sm">{pendingDrafts.length} draft homework{pendingDrafts.length > 1 ? 's' : ''}</span> saved that are not visible to students yet.
                                  </p>
                                  
                                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                                     {pendingDrafts.map(draft => (
                                        <div key={draft.id} className="bg-white/95 backdrop-blur-sm border border-[#FFDDF5] p-3 rounded-2xl flex items-center justify-between shadow-sm">
                                           <div className="flex flex-col min-w-0">
                                              <span className="text-xs font-black text-slate-800 truncate">{draft.title}</span>
                                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{draft.subject}</span>
                                           </div>
                                           <button 
                                              onClick={() => {
                                                 setActiveTab('Homework');
                                              }}
                                              className="text-[10px] font-black bg-[#C23C9F] text-white px-3 py-1.5 rounded-xl hover:bg-[#A13083] transition-colors shrink-0"
                                           >
                                              Check & Publish 🚀
                                           </button>
                                        </div>
                                     ))}
                                  </div>
                               </div>
                            </div>
                         )}

                         {/* AI Co-Pilot Intervention */}
                         <div className="bg-gradient-to-br from-[#FAF2FF] to-[#F1E0FF] rounded-[32px] border border-[#E8C6FF] shadow-sm p-6 space-y-4">
                            <div className="flex items-center gap-3">
                               <span className="text-3xl">🤖</span>
                               <div className="space-y-0.5">
                                  <h3 className="text-xl font-black text-[#3C2E75] tracking-tight">AI Co-Pilot Diagnosis</h3>
                                  <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Real-time conceptual learning gaps</p>
                               </div>
                            </div>
                            
                            <div className="space-y-3">
                               {learningGaps.length > 0 ? (
                                  learningGaps.map(gap => {
                                     let textColor = "text-[#7828B4]";
                                     let badgeBg = "bg-[#FAF2FF] border-[#E8C6FF]/40";
                                     let progressColor = "bg-[#CE93D8]";
                                     if (gap.subject === 'Maths') {
                                        textColor = "text-[#C64F33]";
                                        badgeBg = "bg-[#FFF0EB] border-[#FFD2C4]/40";
                                        progressColor = "bg-[#FF7043]";
                                     } else if (gap.subject === 'Science') {
                                        textColor = "text-[#1E8A74]";
                                        badgeBg = "bg-[#EAFBF7] border-[#BCEEE2]/40";
                                        progressColor = "bg-[#26A69A]";
                                     } else if (gap.subject === 'English') {
                                        textColor = "text-[#8C761E]";
                                        badgeBg = "bg-[#FFFCE8] border-[#FCEE9D]/40";
                                        progressColor = "bg-[#FFCA28]";
                                     }
                                     
                                     return (
                                        <div key={gap.subject} className="bg-white/95 backdrop-blur-sm border border-[#EBE4FF] p-4 rounded-2xl space-y-3 shadow-[0_2px_8px_-3px_rgba(122,105,214,0.1)]">
                                           <div className="flex justify-between items-center">
                                              <div className="flex items-center gap-2">
                                                 <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${badgeBg} ${textColor}`}>{gap.subject}</span>
                                                 <span className="text-[10px] font-black text-[#3C2E75] truncate max-w-[140px]" title={gap.topic}>"{gap.topic}"</span>
                                              </div>
                                              <span className={`text-xs font-black ${textColor}`}>{gap.average}% Mastery</span>
                                           </div>
                                           <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                              <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${gap.average}%` }} />
                                           </div>
                                           <div className="bg-[#FAF2FF] rounded-xl p-3 border border-[#E8C6FF]/30">
                                              <span className="text-[8px] font-black uppercase text-purple-400 tracking-wider block mb-0.5">💡 Teacher Prep Hint</span>
                                              <p className="text-[11px] font-bold text-[#5C4D9F] leading-snug">{gap.tip}</p>
                                           </div>
                                        </div>
                                     );
                                  })
                               ) : (
                                  <div className="bg-white/80 backdrop-blur-sm border border-[#E9E4FF] p-5 rounded-2xl text-center space-y-2">
                                     <span className="text-2xl block">🎉</span>
                                     <p className="text-xs font-black text-[#3C2E75]">All clear! No active learning gaps</p>
                                     <p className="text-[10px] font-bold text-slate-400 leading-snug">
                                        {activeSubjectAverages.length > 0 
                                           ? "Classroom averages are healthy (75%+). Students are demonstrating solid mastery!" 
                                           : "No student submission data is available yet to diagnose learning gaps."
                                        }
                                     </p>
                                  </div>
                                )}
                            </div>
                         </div>

                         {/* Compact Support & Flyers Roster (Tabbed AI Insights) */}
                         <div className="bg-white rounded-[32px] border border-[#E9E4FF] shadow-sm p-6 space-y-4">
                            <div className="flex justify-between items-center border-b border-[#FAF2FF] pb-2">
                               <h3 className="text-sm font-black text-[#3C2E75] tracking-tight">Class Support Hub</h3>
                               <div className="flex bg-[#F5F3FF] p-1 rounded-xl border border-[#EBE4FF]">
                                  <button 
                                     onClick={() => setDashboardRosterTab('Support')} 
                                     className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${dashboardRosterTab === 'Support' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                  >
                                     ⚠️ Support ({struggling.length})
                                  </button>
                                  <button 
                                     onClick={() => setDashboardRosterTab('Flyers')} 
                                     className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${dashboardRosterTab === 'Flyers' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                  >
                                     ⭐ Flyers ({risingStars.length})
                                  </button>
                               </div>
                            </div>
                            
                            <div className="space-y-3 max-h-[160px] overflow-y-auto no-scrollbar">
                               {dashboardRosterTab === 'Support' ? (
                                  struggling.map(st => (
                                     <div key={st.name} className="flex items-center justify-between border-b border-[#FAF2FF] pb-2">
                                        <div className="flex items-center gap-2">
                                           <img src={getStudentAvatar(st.name)} className="w-8 h-8 rounded-full border border-slate-100 bg-white" />
                                           <span className="text-xs font-black text-[#5C4D9F]">{st.name}</span>
                                        </div>
                                        <span className="text-xs font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">{st.avg}% avg</span>
                                     </div>
                                  ))
                               ) : (
                                  risingStars.map(st => (
                                     <div key={st.name} className="flex items-center justify-between border-b border-[#FAF2FF] pb-2">
                                        <div className="flex items-center gap-2">
                                           <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${st.name}`} className="w-8 h-8 rounded-full border border-slate-100 bg-white" />
                                           <span className="text-xs font-black text-[#5C4D9F]">{st.name}</span>
                                        </div>
                                        <span className="text-xs font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">{st.avg}% avg</span>
                                     </div>
                                  ))
                               )}
                               {dashboardRosterTab === 'Support' && struggling.length === 0 && (
                                  <div className="text-xs text-emerald-500 font-black italic text-center py-4">All students scoring above 60%! 🎉</div>
                               )}
                               {dashboardRosterTab === 'Flyers' && risingStars.length === 0 && (
                                  <div className="text-xs text-slate-400 font-black italic text-center py-4">No high flyers registered yet. 🚀</div>
                               )}
                            </div>
                         </div>
                      </div>
                   </div>

                    {/* Collaborative Goal & Calendar Side-by-Side Section */}
                    {activeClassroom && (
                       <div className="grid grid-cols-12 gap-6">
                          {/* Left: Dino Pizza Party Collaborative Goal (col-span-5) */}
                          <div className="col-span-5 bg-white rounded-[32px] border border-[#E9E4FF] shadow-sm p-6 flex flex-col justify-between space-y-4">
                             <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                   <div className="space-y-0.5">
                                      <span className="text-[9px] font-black uppercase text-[#FFAB91] tracking-wider block">Collaborative Goal</span>
                                      <h3 className="text-lg font-black text-[#3C2E75] leading-snug">{targetTitle}</h3>
                                   </div>
                                   <button 
                                      onClick={() => {
                                         setNewGoalTitle(targetTitle);
                                         setNewGoalTarget(targetGoal);
                                         setIsEditingGoal(true);
                                      }}
                                      className="px-3 py-1.5 border border-[#FFE0D6] hover:border-[#FFAB91] text-[#C64F33] rounded-xl text-[10px] font-black transition-all bg-white hover:bg-orange-50/20 shrink-0"
                                   >
                                      Change Goal ✏️
                                   </button>
                                </div>

                                <div className="flex items-center justify-between text-xs font-black text-[#3C2E75] pt-1">
                                   <span className="text-[#8C83B5]">Combined Points</span>
                                   <span className="text-[#FF7043] bg-[#FFF0EB] px-2.5 py-1 rounded-lg border border-[#FFD2C4]">{currentClassPoints} / {targetGoal} pts</span>
                                </div>
                             </div>

                             {/* Premium Round Pizza Progress Visual */}
                             <div className="flex-1 py-6 flex flex-col items-center justify-center min-h-[360px]">
                                <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 border-8 border-slate-400 rounded-full shadow-2xl p-2 select-none">
                                   {/* Steel tray details */}
                                   <div className="absolute inset-4 rounded-full border-2 border-slate-400/25" />
                                   <div className="absolute inset-8 rounded-full border border-slate-400/15" />
                                   <div className="absolute inset-16 rounded-full border border-slate-400/10" />
                                   <span className="absolute text-5xl opacity-15 select-none font-black text-slate-800">🍽️</span>

                                   {/* Crumbs & Grease marks on empty tray */}
                                   <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-amber-800/10" />
                                   <div className="absolute bottom-1/3 right-1/4 w-3 h-1.5 rounded-full bg-amber-800/15" />
                                   <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-amber-800/10" />

                                   {/* The Pizza Itself (Clipped/Masked by conic progress) */}
                                   <div 
                                      className="absolute inset-2 rounded-full overflow-hidden transition-all duration-1000 shadow-md"
                                      style={{
                                         WebkitMaskImage: `conic-gradient(black 0% ${progressPercent}%, transparent ${progressPercent}% 100%)`,
                                         maskImage: `conic-gradient(black 0% ${progressPercent}%, transparent ${progressPercent}% 100%)`
                                      }}
                                   >
                                      {/* Pizza Outer Crust (Deep Golden Woodfired) */}
                                      <div className="absolute inset-0 rounded-full bg-[#E65100] border-[16px] border-[#8D6E63] shadow-[inset_0_4px_16px_rgba(0,0,0,0.3)] flex items-center justify-center">
                                         {/* Outer golden-brown ring */}
                                         <div className="absolute inset-0.5 rounded-full border-[10px] border-[#FFE0B2]/10" />
                                      </div>

                                      {/* Rich Marinara Tomato Sauce Base */}
                                      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#D32F2F] via-[#C62828] to-[#B71C1C] shadow-[inset_0_4px_10px_rgba(0,0,0,0.4)] flex items-center justify-center">
                                         {/* Melty Cheese layer */}
                                         <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#FFF59D] via-[#FFD54F] to-[#FFB300] shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] flex items-center justify-center overflow-hidden">
                                            {/* Toasted cheese spots */}
                                            <div className="absolute top-8 left-12 w-6 h-4 rounded-full bg-[#E58F12]/15 blur-[1px]" />
                                            <div className="absolute bottom-12 right-16 w-8 h-5 rounded-full bg-[#E58F12]/20 blur-[1px]" />
                                            <div className="absolute bottom-20 left-16 w-5 h-3 rounded-full bg-[#E58F12]/15 blur-[1px]" />
                                            <div className="absolute top-16 right-10 w-7 h-4 rounded-full bg-[#E58F12]/15 blur-[1px]" />

                                            {/* Scattered Toppings (Rich variety) */}
                                            {[
                                               // Pepperonis (Rich red circles with crispy edges & grease highlight)
                                               { type: 'pepperoni', top: '15%', left: '48%', scale: 1.0 },
                                               { type: 'pepperoni', top: '28%', left: '68%', scale: 0.95 },
                                               { type: 'pepperoni', top: '45%', left: '58%', scale: 1.05 },
                                               { type: 'pepperoni', top: '72%', left: '46%', scale: 1.0 },
                                               { type: 'pepperoni', top: '65%', left: '22%', scale: 0.9 },
                                               { type: 'pepperoni', top: '28%', left: '26%', scale: 1.05 },
                                               { type: 'pepperoni', top: '40%', left: '40%', scale: 1.0 },
                                               { type: 'pepperoni', top: '50%', left: '72%', scale: 0.95 },

                                               // Basil Leaves (Vibrant green leaf shapes)
                                               { type: 'basil', top: '22%', left: '38%', rotate: '45deg' },
                                               { type: 'basil', top: '42%', left: '78%', rotate: '115deg' },
                                               { type: 'basil', top: '68%', left: '60%', rotate: '180deg' },
                                               { type: 'basil', top: '52%', left: '15%', rotate: '-45deg' },
                                               { type: 'basil', top: '18%', left: '28%', rotate: '15deg' },
                                               { type: 'basil', top: '60%', left: '38%', rotate: '95deg' },

                                               // Mushrooms (Grey-brown caps with stems)
                                               { type: 'mushroom', top: '28%', left: '55%', rotate: '-15deg' },
                                               { type: 'mushroom', top: '55%', left: '72%', rotate: '60deg' },
                                               { type: 'mushroom', top: '62%', left: '22%', rotate: '135deg' },
                                               { type: 'mushroom', top: '42%', left: '25%', rotate: '-90deg' },
                                               { type: 'mushroom', top: '45%', left: '48%', rotate: '10deg' }
                                            ].map((top, i) => {
                                               if (top.type === 'pepperoni') {
                                                  return (
                                                     <div 
                                                        key={i}
                                                        className="absolute rounded-full bg-gradient-to-br from-[#EF5350] to-[#C62828] border-2 border-[#800F0F] shadow-[0_2px_4px_rgba(0,0,0,0.25)] flex items-center justify-center animate-in zoom-in duration-300"
                                                        style={{
                                                           width: '38px',
                                                           height: '38px',
                                                           top: top.top,
                                                           left: top.left,
                                                           transform: `scale(${top.scale || 1})`,
                                                           zIndex: 5
                                                        }}
                                                     >
                                                        {/* Crispy edge rim */}
                                                        <div className="absolute inset-0.5 rounded-full border border-[#D32F2F] opacity-40" />
                                                        {/* Grease shine */}
                                                        <div className="absolute top-1 left-1.5 w-2.5 h-2.5 rounded-full bg-white/35" />
                                                        {/* Toasted spots */}
                                                        <div className="absolute bottom-1 right-2 w-1.5 h-1.5 rounded-full bg-black/15" />
                                                     </div>
                                                  );
                                               } else if (top.type === 'basil') {
                                                  return (
                                                     <div 
                                                        key={i}
                                                        className="absolute bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] border border-[#1B5E20] shadow-[0_1px_2px_rgba(0,0,0,0.15)] animate-in zoom-in duration-300"
                                                        style={{
                                                           width: '20px',
                                                           height: '11px',
                                                           top: top.top,
                                                           left: top.left,
                                                           borderRadius: '50% 0 50% 0',
                                                           transform: `rotate(${top.rotate || '0deg'})`,
                                                           zIndex: 4
                                                        }}
                                                     />
                                                  );
                                               } else if (top.type === 'mushroom') {
                                                  return (
                                                     <div 
                                                        key={i}
                                                        className="absolute flex flex-col items-center animate-in zoom-in duration-300"
                                                        style={{
                                                           top: top.top,
                                                           left: top.left,
                                                           transform: `rotate(${top.rotate || '0deg'})`,
                                                           zIndex: 3
                                                        }}
                                                     >
                                                        {/* Mushroom Cap */}
                                                        <div className="w-7 h-4.5 bg-gradient-to-br from-[#E0D8D5] to-[#BCAAA4] border border-[#5D4037] rounded-t-full shadow-[0_1.5px_2px_rgba(0,0,0,0.15)]" />
                                                        {/* Mushroom Stem */}
                                                        <div className="w-3 h-3 bg-[#E0D8D5] border-x border-b border-[#5D4037] -mt-0.5" />
                                                     </div>
                                                  );
                                               }
                                               return null;
                                            })}

                                            {/* Slice cut lines on active pizza */}
                                            <div className="absolute inset-0 opacity-15 pointer-events-none z-10">
                                               <div className="absolute inset-y-0 left-1/2 w-0.5 bg-amber-950" />
                                               <div className="absolute inset-x-0 top-1/2 h-0.5 bg-amber-955" />
                                               <div className="absolute inset-0 rotate-45 flex items-center justify-center">
                                                  <div className="w-full h-0.5 bg-amber-955" />
                                               </div>
                                               <div className="absolute inset-0 -rotate-45 flex items-center justify-center">
                                                  <div className="w-full h-0.5 bg-amber-955" />
                                               </div>
                                            </div>
                                         </div>
                                      </div>
                                   </div>

                                   {/* Slice lines to represent 8 pre-cut slices on tray background */}
                                   <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
                                      <div className="absolute inset-y-0 left-1/2 w-px bg-slate-400" />
                                      <div className="absolute inset-x-0 top-1/2 h-px bg-slate-400" />
                                      <div className="absolute inset-0 rotate-45 flex items-center justify-center">
                                         <div className="w-full h-px bg-slate-400" />
                                      </div>
                                      <div className="absolute inset-0 -rotate-45 flex items-center justify-center">
                                         <div className="w-full h-px bg-slate-400" />
                                      </div>
                                   </div>

                                   {/* Center floating baked status badge */}
                                   <div className="absolute z-20 bg-white/95 backdrop-blur-sm border-2 border-amber-500 px-3.5 py-1.5 rounded-2xl shadow-xl flex flex-col items-center">
                                      <span className="text-sm font-black text-[#3C2E75] leading-none">{progressPercent}%</span>
                                      <span className="text-[7px] font-black text-rose-500 uppercase tracking-widest mt-0.5">BAKED!</span>
                                   </div>
                                </div>
                             </div>

                             {/* Compact Reward Message */}
                             <div className="bg-[#FAF2FF] rounded-2xl p-4 border border-[#E8C6FF]/35 flex items-center gap-3">
                                <span className="text-2xl">🦖</span>
                                <div className="min-w-0 flex-1">
                                   <p className="text-[10px] font-black text-[#3C2E75] uppercase tracking-wider mb-0.5">Mascot Party Reward</p>
                                   <p className="text-[11px] font-bold text-[#5C4D9F] leading-snug">
                                      {progressPercent >= 100 
                                         ? `Fantastic! Dino Pizza Party is unlocked! 🎈🍕`
                                         : `Need ${targetGoal - currentClassPoints} more points to bake the pizza party!`}
                                   </p>
                                </div>
                             </div>
                          </div>

                          {/* Right: Learning Calendar & Reminder Center (col-span-7) */}
                          <div className="col-span-7 bg-gradient-to-br from-[#FCF8FF] to-[#F3EFFF] border border-[#E5DFFF] rounded-[32px] p-6 space-y-4 shadow-sm flex flex-col justify-between">
                             <div className="flex justify-between items-center border-b border-[#EBE4FF] pb-3">
                                <div className="space-y-0.5">
                                   <h3 className="text-base font-black text-[#3B2B85] tracking-tight flex items-center gap-1.5">
                                      <span>📅</span> Learning Calendar & Reminder Center
                                   </h3>
                                   <p className="text-[10px] font-bold text-[#7A69D6]">Click active quiz dates to review submissions and send reminder pings.</p>
                                </div>
                                <div className="bg-[#FFF0FA] border border-[#FFDDF5] rounded-xl px-3 py-1.5 flex items-center gap-1.5 shrink-0">
                                   <span className="text-[#C23C9F] text-[10px] font-black uppercase tracking-wider">May 2026</span>
                                </div>
                             </div>

                             {/* Calendar Grid */}
                             <div className="grid grid-cols-7 gap-2 flex-1 pt-2">
                                {/* Day headers */}
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                                   <div key={day} className={`text-center text-[9px] font-black uppercase tracking-wider py-1 rounded-lg ${idx >= 5 ? 'bg-[#FFF0FA] text-[#C23C9F]' : 'bg-[#EEECFF] text-[#553EC9]'}`}>{day}</div>
                                ))}

                                {/* Empty spacer days (May 1, 2026 was a Friday, so Mon-Thu empty) */}
                                {Array.from({ length: 4 }).map((_, idx) => (
                                   <div key={`empty-${idx}`} className="aspect-square bg-[#FFF9F9]/40 border border-dashed border-[#FFE3E3] rounded-2xl" />
                                ))}

                                {/* Calendar days */}
                                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                                   const dayStr = day < 10 ? `0${day}` : `${day}`;
                                   const activeHw = classHomeworks.find(hw => {
                                      const hwDueDate = hw.dueDate || '';
                                      return hwDueDate.includes(`-05-${dayStr}`) || hwDueDate.includes(`-5-${day}`);
                                   });

                                   // Vibrant kid-friendly pastel coloring by subject
                                   let dayCardStyle = "bg-white border border-[#E9E4FF] text-[#5C4D9F] hover:bg-[#F9F8FF] hover:border-[#BA68C8]";
                                   let tagStyle = "";

                                   if (activeHw) {
                                      const subj = activeHw.subject || 'General';
                                      if (subj === 'Maths') {
                                         dayCardStyle = "bg-gradient-to-br from-[#FFF0EB] to-[#FFE0D6] border-[#FFCCBC] text-[#A83D23] shadow-md shadow-orange-50/50";
                                         tagStyle = "bg-[#FFCCBC] text-[#A83D23]";
                                      } else if (subj === 'Science') {
                                         dayCardStyle = "bg-gradient-to-br from-[#EAFBF7] to-[#D1F7EC] border-[#BCEEE2] text-[#1E8A74] shadow-md shadow-teal-50/50";
                                         tagStyle = "bg-[#BCEEE2] text-[#1E8A74]";
                                      } else if (subj === 'English') {
                                         dayCardStyle = "bg-gradient-to-br from-[#FFFCE8] to-[#FFF9C4] border-[#FCEE9D] text-[#8C761E] shadow-md shadow-yellow-50/50";
                                         tagStyle = "bg-[#FCEE9D] text-[#8C761E]";
                                      } else {
                                         dayCardStyle = "bg-gradient-to-br from-[#FAF2FF] to-[#F1E0FF] border-[#E8C6FF] text-[#7828B4] shadow-md shadow-purple-50/50";
                                         tagStyle = "bg-[#E8C6FF] text-[#7828B4]";
                                      }
                                   }

                                   return (
                                      <div 
                                         key={day} 
                                         className={`aspect-square rounded-2xl p-2 flex flex-col justify-between transition-all duration-300 cursor-pointer relative overflow-hidden group hover:scale-[1.04] ${dayCardStyle}`}
                                         onClick={() => {
                                            if (activeHw) {
                                               setSelectedCalendarHw(activeHw);
                                               setShowCalendarModal(true);
                                            }
                                         }}
                                      >
                                         <span className="text-xs font-black">{day}</span>
                                         
                                         {activeHw && (
                                            <div className={`px-1.5 py-0.5 rounded-lg text-[8px] font-black truncate shadow-sm mt-1 flex items-center gap-1 ${tagStyle}`}>
                                               <span className="w-1 h-1 rounded-full bg-current shrink-0" />
                                               {activeHw.subject}
                                            </div>
                                         )}
                                      </div>
                                   );
                                })}
                             </div>
                          </div>
                       </div>
                    )}
                </div>
             );
          }

         case 'My Classes':
            return (
               <div className="px-10 py-10 space-y-12 relative min-h-[calc(100vh-64px)] pb-40">
                  <div className="flex items-center justify-between">
                     <div>
                        <h1 className="text-4xl font-black text-[#1E3A8A] tracking-tight">My Classes</h1>
                        <p className="text-sm font-bold text-blue-300 italic">Manage your classes and view class details.</p>
                     </div>
                     <div className="flex items-center gap-6">
                        <button 
                          onClick={() => setShowAddClassModal(true)}
                          className="bg-gradient-to-r from-[#8A70FF] to-[#7C3AED] text-white px-8 py-4 rounded-3xl font-black text-sm shadow-xl shadow-purple-100 flex items-center gap-3 hover:scale-105 transition-all"
                        >
                           <Plus className="w-5 h-5" /> Create Class
                        </button>
                        <div className="w-32 h-32 relative">
                           <img src="/dino-reading.png" className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl" alt="Mascot" />
                           <div className="absolute -top-2 -right-2">
                              <Star className="w-6 h-6 text-yellow-400 fill-current animate-pulse" />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {classrooms.map((room, i) => (
                        <ClassCard 
                           key={room.id}
                           name={room.name}
                           students={room.studentCount || 0}
                           bgColor={['bg-[#F3E8FF]', 'bg-[#FFF9DB]', 'bg-[#E6FCF5]', 'bg-[#E0F2FE]', 'bg-[#FFF0F0]'][i % 5]} 
                           kidsImg={CLASS_IMAGES[i % CLASS_IMAGES.length]} 
                           subjects={(room.subjects || ['English', 'Maths', 'Science']).map(sub => ({
                               name: sub,
                               icon: SUBJECT_ICONS[sub] || '/ic-homework.png'
                            }))}
                           onDelete={() => handleDeleteClassroom(room.id)}
                           onRename={(newName) => handleRenameClassroom(room.id, newName)}
                            onView={() => { 
                               setActiveClassroom(room); 
                               setFilterClass(room.name);
                               setActiveTab('Students'); 
                            }}
                        />
                     ))}
                     
                     {classrooms.length === 0 && (
                       <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-6">
                          <div className="w-40 h-40 bg-slate-50 rounded-[40px] flex-center">
                             <img src="/dino-reading.png" className="w-32 h-32 object-contain mix-blend-multiply opacity-20 grayscale" alt="Empty" />
                          </div>
                          <div className="space-y-1">
                             <h3 className="text-2xl font-black text-slate-300">No classes found</h3>
                             <p className="text-sm font-bold text-slate-300 italic">Create your first class to get started!</p>
                          </div>
                       </div>
                     )}
                  </div>

                  <GrassBorder />
               </div>
            );
         case 'Students': {
            const filteredStudents = students.filter(s => {
               return s.name.toLowerCase().includes(searchQuery.toLowerCase());
            });

            return (
               <div className="px-10 py-10 space-y-10 min-h-[calc(100vh-64px)] pb-40 relative">
                  <div className="flex items-center justify-between">
                      <div>
                         <h1 className="text-4xl font-black text-[#1E3A8A] tracking-tight">Student Details</h1>
                         <p className="text-sm font-bold text-blue-300 italic">
                            Manage your class roster.
                         </p>
                      </div>
                      <div className="flex items-center gap-6">
                         <div className="relative">
                            <input 
                               type="text"
                               placeholder={`Add student to ${activeClassroom?.name}...`}
                               value={newStudent}
                               onChange={(e) => setNewStudent(e.target.value)}
                               onKeyDown={(e) => e.key === 'Enter' && handleAddStudent()}
                               className="bg-white border-2 border-[#8A70FF]/20 rounded-[24px] py-4 px-8 text-sm font-bold text-blue-900 placeholder-blue-300 focus:border-[#8A70FF] outline-none transition-all shadow-sm min-w-[300px]"
                            />
                            <button 
                               onClick={handleAddStudent}
                               disabled={isAdding || !newStudent.trim()}
                               className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#8A70FF] text-white p-2 rounded-xl shadow-lg shadow-purple-100 hover:scale-105 transition-all disabled:opacity-30"
                            >
                               <Plus className="w-5 h-5" />
                            </button>
                         </div>
                         <div className="w-24 h-24">
                            <img src="/dino-reading.png" className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl" alt="Mascot" />
                         </div>
                      </div>
                   </div>


                  {/* Students Table */}
                  <div className="bg-white rounded-[40px] border border-blue-50 shadow-sm overflow-hidden">
                     <div className="grid grid-cols-12 px-8 py-6 bg-blue-50/20 text-[10px] font-black text-blue-200 uppercase tracking-widest border-b border-blue-50">
                        <div className="col-span-3">Student Name</div>
                        <div className="col-span-2">Class</div>
                        <div className="col-span-3">Email</div>
                        <div className="col-span-2">Progress</div>
                        <div className="col-span-2 text-right pr-4">Actions</div>
                     </div>
                     <div className="divide-y divide-blue-50">
                        {filteredStudents.map((student, idx) => {
                           const hash = student.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                           const progress = 60 + (hash % 35);
                           const color = progress > 85 ? 'bg-emerald-500' : progress > 75 ? 'bg-blue-500' : 'bg-amber-500';
                           
                           return (
                              <div key={idx} className="grid grid-cols-12 px-8 py-6 items-center hover:bg-blue-50/10 transition-all group">
                                 <div className="col-span-3 flex items-center gap-4">
                                    <img src={getStudentAvatar(student.name)} className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-white p-0.5" alt={student.name} />
                                    <span className="text-sm font-black text-[#1E3A8A]">{student.name}</span>
                                 </div>
                                 <div className="col-span-2">
                                    <span className="text-xs font-bold text-blue-400">{student.className}</span>
                                 </div>
                                 <div className="col-span-3">
                                    <span className="text-xs font-bold text-blue-400">{student.email}</span>
                                 </div>
                                 <div className="col-span-2 flex items-center gap-3">
                                    <div className="flex-1 h-2 bg-blue-50 rounded-full overflow-hidden">
                                       <div className={`h-full ${color} rounded-full`} style={{ width: `${progress}%` }} />
                                    </div>
                                    <span className="text-[10px] font-black text-blue-400">{progress}%</span>
                                 </div>
                                 <div className="col-span-2 flex items-center justify-end gap-3 pr-4">
                                    <button 
                                      onClick={(e) => handleDeleteStudent(e, student.id, student.name, student.classId)}
                                      className="p-2 text-rose-200 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                      title="Remove Student"
                                    >
                                       <Trash2 className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-blue-200 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                       <MoreVertical className="w-4 h-4" />
                                    </button>
                                 </div>
                              </div>
                           );
                        })}
                        {filteredStudents.length === 0 && (
                           <div className="py-20 text-center text-blue-300 italic font-bold">
                              No students found. 🔍
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="flex items-center justify-between px-2">
                     <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest">
                        Showing {filteredStudents.length} of {allStudents.length} students
                     </p>
                     <div className="flex items-center gap-2">
                        <PaginationButton label="1" active />
                        <PaginationButton label="2" />
                        <PaginationButton label="3" />
                        <span className="text-blue-200 px-2">...</span>
                        <PaginationButton label="10" />
                        <button className="w-10 h-10 flex-center text-blue-300 hover:text-blue-600">
                           <ChevronRight className="w-5 h-5" />
                        </button>
                  </div>
               </div>
               </div>
            );
         }
          case 'Homework':
            return (
               <div className="px-10 py-10 space-y-10 min-h-[calc(100vh-64px)] pb-40 relative">
                  <HomeworkGenerator user={user} classrooms={classrooms} activeClassroom={activeClassroom} onHomeworkCreated={fetchDashboardSubmissions} />
                  <GrassBorder />
               </div>
            );
          case 'Gradebook': {
            const currentSubmissions = activeClassroom ? allSubmissions.filter(s => s.classId === activeClassroom.id) : allSubmissions;
            const currentStudents = activeClassroom ? students : allStudents;
            const currentHomeworks = activeClassroom ? allHomeworks.filter(h => h.assignedClassId === activeClassroom.id) : allHomeworks;
            
            const missingReports = [];
            currentStudents.forEach(student => {
               const studentSubs = currentSubmissions.filter(s => s.studentName?.toLowerCase() === student.name?.toLowerCase());
               const submittedHwIds = new Set(studentSubs.map(s => s.homeworkId));
               
               const missingHws = currentHomeworks.filter(hw => !submittedHwIds.has(hw.id));
               if (missingHws.length > 0) {
                  missingReports.push({
                     student,
                     missingHws
                  });
               }
            });

            return (
               <div className="px-10 py-10 space-y-10 min-h-[calc(100vh-64px)] pb-40 relative">
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <h1 className="text-4xl font-black text-[#1E3A8A] tracking-tight">Gradebook</h1>
                        <p className="text-sm font-bold text-blue-300 italic">Review AI-graded results and student feedback.</p>
                     </div>
                     <div className="w-24 h-24">
                        <img src="/mascot.png" className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl" alt="Mascot" />
                     </div>
                  </div>
                  
                  {/* Mock Gradebook Table */}
                  <div className="bg-white rounded-[40px] border border-blue-50 shadow-sm overflow-hidden">
                     <div className="grid grid-cols-12 px-8 py-6 bg-blue-50/20 text-[10px] font-black text-blue-200 uppercase tracking-widest border-b border-blue-50">
                        <div className="col-span-6">Student Name</div>
                        <div className="col-span-3 text-center">Score</div>
                        <div className="col-span-3 text-right">Actions</div>
                     </div>
                     <div className="divide-y divide-blue-50">
                        {(activeClassroom ? allSubmissions.filter(s => s.classId === activeClassroom.id) : allSubmissions).length > 0 ? (
                           (activeClassroom ? allSubmissions.filter(s => s.classId === activeClassroom.id) : allSubmissions).sort((a,b) => b.submittedAt - a.submittedAt).map((sub, idx) => (
                              <div key={sub.id || idx} className="grid grid-cols-12 px-8 py-6 items-center hover:bg-blue-50/10 transition-all">
                                 <div className="col-span-6 flex items-center gap-4">
                                    <img src={getStudentAvatar(sub.studentName)} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt={sub.studentName} />
                                    <span className="text-sm font-black text-[#1E3A8A]">{sub.studentName}</span>
                                 </div>
                                 <div className="col-span-3 text-center">
                                    <span className={`px-4 py-1 rounded-full text-xs font-black ${sub.score >= 80 ? 'bg-emerald-50 text-emerald-600' : sub.score >= 50 ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
                                       {sub.score}%
                                    </span>
                                 </div>
                                 <div className="col-span-3 text-right flex flex-col items-end gap-2">
                                    <span className="text-xs font-bold text-blue-300">
                                       {sub.submittedAt ? new Date(sub.submittedAt.toDate ? sub.submittedAt.toDate() : sub.submittedAt).toLocaleDateString() : 'Just now'}
                                    </span>
                                    <button 
                                       onClick={() => setSelectedSubmission(sub)}
                                       className="text-[10px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors border border-indigo-100 shadow-sm"
                                    >
                                       View Answers
                                    </button>
                                 </div>
                              </div>
                           ))
                        ) : (
                           <div className="py-20 text-center text-blue-300 italic font-bold">
                              No mission reports yet. 🚀
                           </div>
                        )}
                     </div>
                  </div>

                  {missingReports.length > 0 && (
                     <div className="bg-white rounded-[40px] border border-rose-50 shadow-sm overflow-hidden mt-10">
                        <div className="px-8 py-6 bg-rose-50/30 border-b border-rose-50 flex items-center justify-between">
                           <h3 className="text-xl font-black text-rose-900 tracking-tight">Pending Missions (Not Started)</h3>
                           <span className="text-xs font-bold text-rose-400 bg-white px-3 py-1 rounded-full border border-rose-100">{missingReports.length} Students Pending</span>
                        </div>
                        <div className="divide-y divide-rose-50/50">
                           {missingReports.map(({ student, missingHws }, idx) => (
                              <div key={student.id || idx} className="grid grid-cols-12 px-8 py-6 items-center hover:bg-rose-50/10 transition-all">
                                 <div className="col-span-8 flex items-center gap-4">
                                    <img src={getStudentAvatar(student.name)} className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-white p-0.5" alt={student.name} />
                                    <div className="flex flex-col">
                                       <span className="text-sm font-black text-rose-900">{student.name}</span>
                                       <div className="flex flex-col mt-2 gap-1.5">
                                          {missingHws.map(h => {
                                             const dateStr = h.createdAt?.toDate ? h.createdAt.toDate().toLocaleDateString() : '';
                                             return (
                                                <span key={h.id} className="text-[10px] font-black text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg inline-block w-fit border border-rose-100 shadow-sm">
                                                   {h.subject || 'Mission'} 
                                                   <span className="text-rose-400 font-bold ml-1">
                                                      • ID: {h.id.slice(0,6).toUpperCase()} {dateStr ? `• ${dateStr}` : ''}
                                                   </span>
                                                </span>
                                             );
                                          })}
                                       </div>
                                    </div>
                                 </div>
                                 <div className="col-span-4 text-right">
                                    <button 
                                      onClick={() => alert(`Reminder sent to ${student.name}'s parents!`)}
                                      className="text-[10px] font-black text-rose-600 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-xl transition-colors border border-rose-100 shadow-sm"
                                    >
                                       Send Reminder
                                    </button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  <GrassBorder />
               </div>
            );
         }
         case 'Messages': {
            const filteredMessages = teacherMessages.filter(msg => {
               if (messagesTab === 'Inbox') {
                  return msg.senderRole === 'student';
               } else if (messagesTab === 'Sent') {
                  return msg.senderRole === 'teacher' && msg.recipientType === 'student';
               } else if (messagesTab === 'Announcements') {
                  return msg.senderRole === 'teacher' && (msg.recipientType === 'class' || msg.recipientType === 'all');
               }
               return false;
            });

            const currentChat = activeChat && filteredMessages.find(m => m.id === activeChat.id)
               ? activeChat 
               : (filteredMessages[0] || null);

            const handleSendReply = async () => {
               if (!replyText.trim() || !currentChat) return;
               try {
                  await addDoc(collection(db, 'messages'), {
                     teacherId: user.uid,
                     senderId: user.uid,
                     senderName: user.displayName || 'Teacher',
                     senderRole: 'teacher',
                     recipientType: 'student',
                     recipientId: currentChat.senderId,
                     recipientName: currentChat.senderName,
                     subject: `Re: ${currentChat.subject || 'Message'}`,
                     content: replyText.trim(),
                     createdAt: new Date().toISOString(),
                     classId: currentChat.classId || null
                   });
                  setReplyText('');
                  setMessagesTab('Sent');
                  alert('Reply sent! 🚀');
               } catch (err) {
                  console.error("Error replying:", err);
               }
            };

            const handleSendNewMessage = async (e) => {
               e.preventDefault();
               if (!newMsgBody.trim()) return;

               let recId = '';
               let recName = '';

               if (newMsgRecipientType === 'student') {
                  recId = newMsgRecipientId;
                  recName = newMsgRecipientId;
               } else if (newMsgRecipientType === 'class') {
                  const cls = classrooms.find(c => c.id === newMsgRecipientId);
                  recId = newMsgRecipientId;
                  recName = cls ? cls.name : 'Class';
               } else {
                  recId = 'all';
                  recName = 'All Classes';
               }

               try {
                  await addDoc(collection(db, 'messages'), {
                     teacherId: user.uid,
                     senderId: user.uid,
                     senderName: user.displayName || 'Teacher',
                     senderRole: 'teacher',
                     recipientType: newMsgRecipientType,
                     recipientId: recId,
                     recipientName: recName,
                     subject: newMsgSubject.trim() || 'Announcement',
                     content: newMsgBody.trim(),
                     createdAt: new Date().toISOString(),
                     classId: newMsgRecipientType === 'class' ? recId : null
                   });

                  setNewMsgSubject('');
                  setNewMsgBody('');
                  setShowNewMsgModal(false);
                  
                  if (newMsgRecipientType === 'student') {
                     setMessagesTab('Sent');
                  } else {
                     setMessagesTab('Announcements');
                  }
                  alert('Message sent successfully! 🚀');
               } catch (err) {
                  console.error("Error creating message:", err);
                  alert("Failed to send: " + err.message);
               }
            };

            return (
               <div className="px-10 py-10 space-y-10 min-h-[calc(100vh-64px)] pb-40 relative">
                  <div className="flex items-center justify-between">
                     <div>
                        <h1 className="text-4xl font-black text-[#1E3A8A] tracking-tight">Messages</h1>
                        <p className="text-sm font-bold text-blue-300 italic">Communicate with students and classrooms live.</p>
                     </div>
                     <button 
                        onClick={() => {
                           if (allStudents.length > 0 && !newMsgRecipientId) {
                              setNewMsgRecipientId(allStudents[0].name);
                           } else if (classrooms.length > 0 && newMsgRecipientType === 'class') {
                              setNewMsgRecipientId(classrooms[0].id);
                           } 
                           setShowNewMsgModal(true);
                        }}
                        className="bg-[#8A70FF] text-white px-8 py-4 rounded-3xl font-black text-sm shadow-xl shadow-purple-100 flex items-center gap-3 hover:scale-105 transition-all"
                     >
                        <Plus className="w-5 h-5" /> New Message
                     </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center gap-8 border-b border-blue-50 pb-4">
                     {['Inbox', 'Sent', 'Announcements'].map(tab => (
                        <button 
                           key={tab}
                           onClick={() => {
                              setMessagesTab(tab);
                              setActiveChat(null);
                           }}
                           className={`text-sm font-black transition-all relative py-2 ${messagesTab === tab ? 'text-[#8A70FF]' : 'text-blue-300 hover:text-blue-500'}`}
                        >
                           {tab}
                           {messagesTab === tab && <motion.div layoutId="messages-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#8A70FF] rounded-full" />}
                        </button>
                     ))}
                  </div>

                  <div className="grid grid-cols-12 gap-8 h-[600px]">
                     {/* Chat List */}
                     <div className="col-span-4 bg-white rounded-[40px] border border-blue-50 shadow-sm flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-blue-50">
                           <div className="relative">
                              <input type="text" placeholder="Search chats..." className="w-full bg-blue-50/50 border-none rounded-2xl py-3 px-10 text-xs font-bold text-blue-900 placeholder-blue-300" />
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
                           </div>
                        </div>
                        <div className="flex-1 overflow-y-auto divide-y divide-blue-50 custom-scrollbar">
                           {filteredMessages.length > 0 ? (
                              filteredMessages.map(msg => (
                                 <button 
                                    key={msg.id}
                                    onClick={() => setActiveChat(msg)}
                                    className={`w-full text-left p-6 flex items-center gap-4 transition-all ${currentChat?.id === msg.id ? 'bg-blue-50/50' : 'hover:bg-blue-50/30'}`}
                                 >
                                    <img src={getStudentAvatar(msg.senderName)} className="w-12 h-12 rounded-full border-2 border-white shadow-sm bg-white p-0.5" alt="avatar" />
                                    <div className="flex-1 min-w-0">
                                       <div className="flex items-center justify-between">
                                          <p className="text-sm font-black text-[#1E3A8A] truncate">
                                             {messagesTab === 'Inbox' ? msg.senderName : `To: ${msg.recipientName}`}
                                          </p>
                                          <span className="text-[9px] font-bold text-blue-300">
                                             {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : ''}
                                          </span>
                                       </div>
                                       <p className="text-xs font-bold text-blue-300 truncate">{msg.content}</p>
                                    </div>
                                 </button>
                              ))
                           ) : (
                              <div className="py-20 text-center text-blue-300 font-bold italic text-sm">
                                 No messages in {messagesTab} yet.
                              </div>
                           )}
                        </div>
                     </div>

                     {/* Chat View */}
                     <div className="col-span-8 bg-white rounded-[40px] border border-blue-50 shadow-sm flex flex-col overflow-hidden bg-blue-50/5">
                        {currentChat ? (
                           <div className="flex flex-col h-full justify-between bg-white">
                              <div className="p-8 border-b border-blue-50 flex items-center justify-between bg-white">
                                 <div>
                                    <h3 className="text-lg font-black text-[#1E3A8A]">{currentChat.subject}</h3>
                                    <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mt-1">
                                       From: {currentChat.senderName} • To: {currentChat.recipientName} • {currentChat.createdAt ? new Date(currentChat.createdAt).toLocaleString() : ''}
                                    </p>
                                 </div>
                              </div>

                              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-slate-50/30">
                                 <div className="flex flex-col gap-4 max-w-[90%]">
                                    <div className="bg-[#EBE4FF] p-6 rounded-[32px] rounded-tl-none border border-blue-100 shadow-sm">
                                       <p className="text-sm font-bold text-[#1E3A8A] leading-relaxed">
                                          {currentChat.content}
                                       </p>
                                    </div>
                                 </div>
                              </div>

                              {messagesTab === 'Inbox' && (
                                 <div className="p-6 border-t border-blue-50 flex items-center gap-4 bg-white">
                                    <div className="flex-1 relative">
                                       <input 
                                          type="text" 
                                          value={replyText}
                                          onChange={(e) => setReplyText(e.target.value)}
                                          placeholder="Type your reply..." 
                                          className="w-full bg-blue-50/50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-blue-900 placeholder-blue-300" 
                                       />
                                    </div>
                                    <button 
                                       onClick={handleSendReply}
                                       className="w-12 h-12 bg-[#8A70FF] text-white rounded-2xl flex-center shadow-lg shadow-purple-100 hover:scale-105 transition-all"
                                    >
                                       <ArrowRight className="w-6 h-6" />
                                    </button>
                                 </div>
                              )}
                           </div>
                        ) : (
                           <div className="flex-1 flex flex-col items-center justify-center text-blue-300 font-bold italic text-sm gap-2">
                              <MessageSquare size={48} className="stroke-1 text-blue-200" />
                              <span>Select a chat to read & reply! 💌</span>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* New Message Popup Modal */}
                  {showNewMsgModal && (
                     <div className="fixed inset-0 bg-[#1E3A8A]/20 backdrop-blur-sm z-[999] flex-center p-4">
                        <div className="bg-white rounded-[32px] border border-blue-50 w-full max-w-lg p-8 shadow-2xl relative">
                           <button 
                              onClick={() => setShowNewMsgModal(false)}
                              className="absolute top-6 right-6 text-blue-300 hover:text-blue-500 transition-all"
                           >
                              <X size={20} strokeWidth={3} />
                           </button>
                           <h3 className="text-2xl font-black text-[#1E3A8A] mb-6 flex items-center gap-3">
                              <MessageSquare className="text-[#8A70FF]" /> Create New Message
                           </h3>
                           
                           <form onSubmit={handleSendNewMessage} className="space-y-5">
                              <div>
                                 <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2">Recipient Type</label>
                                 <div className="flex gap-4">
                                    {['student', 'class', 'all'].map((type) => (
                                       <button
                                          key={type}
                                          type="button"
                                          onClick={() => {
                                             setNewMsgRecipientType(type);
                                             if (type === 'student' && allStudents.length > 0) {
                                                setNewMsgRecipientId(allStudents[0].name);
                                             } else if (type === 'class' && classrooms.length > 0) {
                                                setNewMsgRecipientId(classrooms[0].id);
                                             } else {
                                                setNewMsgRecipientId('all');
                                             }
                                          }}
                                          className={`flex-1 py-2 rounded-xl text-xs font-black capitalize border transition-all ${newMsgRecipientType === type ? 'bg-purple-50 border-purple-200 text-purple-600' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                                       >
                                          {type}
                                       </button>
                                    ))}
                                 </div>
                              </div>

                              {newMsgRecipientType === 'student' && (
                                 <div>
                                    <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2">Select Student</label>
                                    <select
                                       value={newMsgRecipientId}
                                       onChange={(e) => setNewMsgRecipientId(e.target.value)}
                                       className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-purple-50 transition-all"
                                       required
                                    >
                                       {allStudents.map(s => (
                                          <option key={s.id} value={s.name}>{s.name} ({s.className})</option>
                                       ))}
                                    </select>
                                 </div>
                              )}

                              {newMsgRecipientType === 'class' && (
                                 <div>
                                    <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2">Select Class</label>
                                    <select
                                       value={newMsgRecipientId}
                                       onChange={(e) => setNewMsgRecipientId(e.target.value)}
                                       className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-purple-50 transition-all"
                                       required
                                    >
                                       {classrooms.map(c => (
                                          <option key={c.id} value={c.id}>{c.name}</option>
                                       ))}
                                    </select>
                                 </div>
                              )}

                              {newMsgRecipientType === 'all' && (
                                 <div>
                                    <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2">Recipient</label>
                                    <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-bold text-slate-600">
                                       📢 All Classes & Classrooms
                                    </div>
                                 </div>
                              )}

                              <div>
                                 <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2">Subject</label>
                                 <input 
                                    type="text" 
                                    value={newMsgSubject}
                                    onChange={(e) => setNewMsgSubject(e.target.value)}
                                    placeholder="e.g. Science Experiment Guidelines"
                                    className="w-full bg-white border border-blue-100 rounded-2xl py-3.5 px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-purple-50 transition-all text-slate-700"
                                    required
                                 />
                              </div>

                              <div>
                                 <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2">Message</label>
                                 <textarea 
                                    value={newMsgBody}
                                    onChange={(e) => setNewMsgBody(e.target.value)}
                                    placeholder="Write your announcement or direct message here..."
                                    rows={4}
                                    className="w-full bg-white border border-blue-100 rounded-2xl py-3.5 px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-purple-50 transition-all text-slate-700 resize-none"
                                    required
                                 />
                              </div>

                              <div className="pt-2 flex gap-4">
                                 <button 
                                    type="button"
                                    onClick={() => setShowNewMsgModal(false)}
                                    className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-500 py-4 rounded-2xl font-black text-sm transition-colors border border-slate-100"
                                 >
                                    Cancel
                                 </button>
                                 <button 
                                    type="submit"
                                    className="flex-1 bg-[#8A70FF] hover:bg-[#765EEF] text-white py-4 rounded-2xl font-black text-sm transition-colors shadow-lg shadow-purple-100"
                                 >
                                    Send Message 🚀
                                 </button>
                              </div>
                           </form>
                        </div>
                     </div>
                  )}
               </div>
            );
         }
         case 'Rewards': {
            // Filter students list based on selected class
            const filteredStudentsList = allStudents.filter(s => {
               if (filterClass === 'All Classes') return true;
               return s.className === filterClass;
            });

            // Map each student to computed points, badges and averages based on their actual submissions
            const computedStudents = filteredStudentsList.map(student => {
               const studentSubs = allSubmissions.filter(sub => 
                  sub.studentName?.toLowerCase() === student.name?.toLowerCase()
               );

               const completedCount = studentSubs.length;
               const totalScore = studentSubs.reduce((acc, sub) => acc + (sub.score || 0), 0);
               const basePoints = 100;
               const calculatedPoints = basePoints + (completedCount * 50) + totalScore;

               // Group scores by subject
               const subjectScores = {};
               studentSubs.forEach(sub => {
                  const hw = allHomeworks.find(h => h.id === sub.homeworkId);
                  const subject = hw ? hw.subject : 'General';
                  if (!subjectScores[subject]) subjectScores[subject] = [];
                  subjectScores[subject].push(sub.score || 0);
               });

               const getAvg = (subject) => {
                  const scores = subjectScores[subject];
                  if (!scores || scores.length === 0) return 0;
                  return scores.reduce((acc, s) => acc + s, 0) / scores.length;
               };

               const badges = [];
               const mathsAvg = getAvg('Maths');
               const scienceAvg = getAvg('Science');
               const englishAvg = getAvg('English');

               if (mathsAvg >= 80) {
                  badges.push({ name: 'Maths Whiz', desc: 'Scored 80%+ in Maths', icon: '⚡', color: 'bg-blue-50 text-blue-600 border-blue-100' });
               }
               if (scienceAvg >= 80) {
                  badges.push({ name: 'Science Explorer', desc: 'Scored 80%+ in Science', icon: '🚀', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' });
               }
               if (englishAvg >= 80) {
                  badges.push({ name: 'Super Writer', desc: 'Scored 80%+ in English', icon: '📝', color: 'bg-amber-50 text-amber-600 border-amber-100' });
               }
               if (completedCount >= 3) {
                  badges.push({ name: 'Homework Hero', desc: 'Completed 3+ quizzes', icon: '🏆', color: 'bg-purple-50 text-purple-600 border-purple-100' });
               } else if (completedCount >= 1) {
                  badges.push({ name: 'Rising Star', desc: 'Active and scoring', icon: '⭐', color: 'bg-rose-50 text-rose-600 border-rose-100' });
               }

               return {
                  ...student,
                  points: calculatedPoints,
                  completedCount,
                  avgScore: completedCount > 0 ? Math.round(totalScore / completedCount) : 0,
                  badges,
                  recentSub: studentSubs.length > 0 ? studentSubs.sort((a,b) => new Date(b.submittedAt) - new Date(a.submittedAt))[0] : null
               };
            });

            // Derive aggregate values
            const totalPoints = computedStudents.reduce((acc, s) => acc + s.points, 0);
            const totalBadges = computedStudents.reduce((acc, s) => acc + s.badges.length, 0);
            const rewardedCount = computedStudents.filter(s => s.completedCount > 0).length;
            
            // Sort by points to find the top earner
            const sortedByPoints = [...computedStudents].sort((a, b) => b.points - a.points);
            const topEarner = sortedByPoints[0] || { name: 'No Student Yet', points: 100 };

            // Calculate badge distributions for the badge row display
            const badgeCounts = {
               'Maths Whiz': computedStudents.filter(s => s.badges.some(b => b.name === 'Maths Whiz')).length,
               'Science Explorer': computedStudents.filter(s => s.badges.some(b => b.name === 'Science Explorer')).length,
               'Super Writer': computedStudents.filter(s => s.badges.some(b => b.name === 'Super Writer')).length,
               'Homework Hero': computedStudents.filter(s => s.badges.some(b => b.name === 'Homework Hero')).length
            };

            // Get recent rewards based on actual submissions for the selected classroom
            const recentSubmissions = allSubmissions
               .filter(sub => {
                  const student = allStudents.find(s => s.name?.toLowerCase() === sub.studentName?.toLowerCase());
                  if (!student) return false;
                  if (filterClass === 'All Classes') return true;
                  return student.className === filterClass;
               })
               .sort((a, b) => {
                  const dateA = a.submittedAt ? (a.submittedAt.seconds ? a.submittedAt.seconds * 1000 : new Date(a.submittedAt).getTime()) : 0;
                  const dateB = b.submittedAt ? (b.submittedAt.seconds ? b.submittedAt.seconds * 1000 : new Date(b.submittedAt).getTime()) : 0;
                  return dateB - dateA;
               })
               .slice(0, 4);

            return (
               <div className="px-10 py-10 space-y-10 min-h-[calc(100vh-64px)] pb-40 relative">
                  <div className="flex items-center justify-between">
                     <div>
                        <h1 className="text-4xl font-black text-[#1E3A8A] tracking-tight">Rewards</h1>
                        <p className="text-sm font-bold text-blue-300 italic">Motivate students with points and badges based on performance.</p>
                     </div>
                     <div className="flex items-center gap-6">
                        {/* Class/Grade filter dropdown */}
                        <div className="flex items-center gap-3 bg-white border border-blue-50 py-3 px-5 rounded-2xl shadow-sm">
                           <span className="text-[10px] font-black uppercase text-blue-300 tracking-wider">Grade</span>
                           <select 
                              value={filterClass} 
                              onChange={(e) => setFilterClass(e.target.value)}
                              className="bg-transparent border-none text-xs font-black text-[#1E3A8A] focus:outline-none cursor-pointer"
                           >
                              <option value="All Classes">All Classes</option>
                              {classrooms.map(c => (
                                 <option key={c.id} value={c.name}>{c.name}</option>
                              ))}
                           </select>
                        </div>
                        <div className="w-20 h-20">
                           <img src="/mascot.png" className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl" alt="Mascot" />
                        </div>
                     </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center gap-8 border-b border-blue-50 pb-4">
                     {['Overview', 'Badges', 'Leaderboard'].map(tab => (
                        <button 
                           key={tab}
                           onClick={() => setRewardsTab(tab)}
                           className={`text-sm font-black transition-all relative py-2 ${rewardsTab === tab ? 'text-[#8A70FF]' : 'text-blue-300 hover:text-blue-500'}`}
                        >
                           {tab}
                           {rewardsTab === tab && <motion.div layoutId="rewards-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#8A70FF] rounded-full" />}
                        </button>
                     ))}
                  </div>

                  {rewardsTab === 'Overview' && (
                     <>
                        {/* KPI Row */}
                        <div className="grid grid-cols-4 gap-6">
                           <RewardKPICard title="Total Points" value={totalPoints} subtitle="Derived from grades & quizzes" bgColor="bg-blue-50/50" textColor="text-blue-600" />
                           <RewardKPICard title="Badges Earned" value={totalBadges} subtitle="Star, Whiz & Explorer" bgColor="bg-rose-50/50" textColor="text-rose-600" />
                           <RewardKPICard title="Rewarded Kids" value={rewardedCount} subtitle={`${rewardedCount}/${computedStudents.length} active students`} bgColor="bg-emerald-50/50" textColor="text-emerald-600" />
                           <RewardKPICard title="Class Champion" value={topEarner.name} subtitle={`${topEarner.points || 0} Points 🔥`} bgColor="bg-amber-50/50" textColor="text-amber-600" />
                        </div>

                        <div className="grid grid-cols-12 gap-10">
                           {/* Recent Rewards Feed */}
                           <div className="col-span-7 bg-white rounded-[40px] border border-blue-50 shadow-sm p-10 space-y-8">
                              <h3 className="text-xl font-black text-[#1E3A8A] tracking-tight">Recent Rewards</h3>
                              <div className="space-y-6">
                                 {recentSubmissions.length > 0 ? (
                                    recentSubmissions.map((sub, idx) => {
                                       const hw = allHomeworks.find(h => h.id === sub.homeworkId);
                                       const subject = hw ? hw.subject : 'Homework';
                                       const displayDate = sub.submittedAt ? (
                                          sub.submittedAt.seconds ? new Date(sub.submittedAt.seconds * 1000) : new Date(sub.submittedAt)
                                       ).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : '';

                                       const getScoreFeedback = (score) => {
                                          if (score >= 85) return `Outstanding effort in ${subject}! 🚀`;
                                          if (score >= 70) return `Great work in ${subject}! 🌟`;
                                          if (score >= 50) return `Good progress in ${subject}! 👍`;
                                          return `Completed ${subject} quiz • Keep practicing! 💪`;
                                       };

                                       return (
                                          <div key={sub.id} className="flex items-center justify-between group">
                                             <div className="flex items-center gap-4">
                                                <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${sub.studentName}`} className="w-12 h-12 rounded-full border-2 border-white shadow-sm bg-white p-0.5" alt={sub.studentName} />
                                                <div>
                                                   <p className="text-sm font-black text-[#1E3A8A]">{sub.studentName}</p>
                                                   <p className="text-[10px] font-bold text-blue-300 italic">{getScoreFeedback(sub.score)} (Scored {sub.score}%)</p>
                                                </div>
                                             </div>
                                             <div className="text-right">
                                                <p className="text-sm font-black text-emerald-500">+{sub.score + 50} pts</p>
                                                <p className="text-[9px] font-bold text-blue-200 uppercase tracking-widest">{displayDate}</p>
                                             </div>
                                          </div>
                                       );
                                    })
                                 ) : (
                                    <div className="py-20 text-center text-blue-300 font-bold italic text-sm">
                                       No homework submissions to reward yet! 🌟
                                    </div>
                                 )}
                              </div>
                           </div>

                           {/* Top Badges */}
                           <div className="col-span-5 bg-white rounded-[40px] border border-blue-50 shadow-sm p-10 flex flex-col justify-between">
                              <div className="space-y-8">
                                 <h3 className="text-xl font-black text-[#1E3A8A] tracking-tight">Badge Distribution</h3>
                                 <div className="space-y-6">
                                    <BadgeRow name="Maths Whiz" count={badgeCounts['Maths Whiz']} icon={<Zap className="w-5 h-5 text-blue-400 fill-current" />} color="bg-blue-50" />
                                    <BadgeRow name="Science Explorer" count={badgeCounts['Science Explorer']} icon={<Zap className="w-5 h-5 text-emerald-400 fill-current" />} color="bg-emerald-50" />
                                    <BadgeRow name="Super Writer" count={badgeCounts['Super Writer']} icon={<Zap className="w-5 h-5 text-amber-400 fill-current" />} color="bg-amber-50" />
                                    <BadgeRow name="Homework Hero" count={badgeCounts['Homework Hero']} icon={<Star className="w-5 h-5 text-purple-400 fill-current" />} color="bg-purple-50" />
                                 </div>
                              </div>
                              <button onClick={() => setRewardsTab('Badges')} className="w-full bg-blue-50 text-blue-600 py-4 rounded-3xl font-black text-xs hover:bg-blue-100 transition-all mt-10">
                                 View All Badge Earners
                              </button>
                           </div>
                        </div>
                     </>
                  )}

                  {rewardsTab === 'Badges' && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                           { name: 'Maths Whiz', desc: 'Scored 80% or more in Mathematics homework quizzes.', icon: '⚡', color: 'bg-blue-50 border-blue-100 text-blue-600' },
                           { name: 'Science Explorer', desc: 'Scored 80% or more in Science homework quizzes.', icon: '🚀', color: 'bg-emerald-50 border-emerald-100 text-emerald-600' },
                           { name: 'Super Writer', desc: 'Scored 80% or more in English homework quizzes.', icon: '📝', color: 'bg-amber-50 border-amber-100 text-amber-600' },
                           { name: 'Homework Hero', desc: 'Completed at least 3 homework assignments.', icon: '🏆', color: 'bg-purple-50 border-purple-100 text-purple-600' },
                           { name: 'Rising Star', desc: 'Earned by student after submitting their first homework quiz.', icon: '⭐', color: 'bg-rose-50 border-rose-100 text-rose-600' }
                        ].map((badge) => {
                           const earners = computedStudents.filter(s => s.badges.some(b => b.name === badge.name));

                           return (
                              <div key={badge.name} className="bg-white rounded-[40px] border border-blue-50 shadow-sm p-10 space-y-6 flex flex-col justify-between">
                                 <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                       <span className="text-4xl">{badge.icon}</span>
                                       <div>
                                          <h4 className="text-lg font-black text-[#1E3A8A]">{badge.name}</h4>
                                          <p className="text-xs font-bold text-blue-300 italic">{badge.desc}</p>
                                       </div>
                                    </div>
                                    
                                    <div className="border-t border-slate-50 pt-4 space-y-2">
                                       <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Earned By</p>
                                       <div className="flex flex-wrap gap-2 pt-1">
                                          {earners.map(earner => (
                                             <span key={earner.id} className="bg-slate-50 text-slate-700 text-[10px] font-black px-3.5 py-2 rounded-full border border-slate-100 flex items-center gap-2">
                                                <img src={getStudentAvatar(earner.name)} className="w-5 h-5 rounded-full bg-white border border-slate-200 p-0.5" alt="earner" />
                                                {earner.name}
                                             </span>
                                          ))}
                                          {earners.length === 0 && (
                                             <span className="text-blue-300 font-bold text-xs italic">No students have unlocked this yet! Keep going! 🚀</span>
                                          )}
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  )}

                  {rewardsTab === 'Leaderboard' && (
                     <div className="bg-white rounded-[40px] border border-blue-50 shadow-sm overflow-hidden">
                        <div className="grid grid-cols-12 px-8 py-6 bg-blue-50/20 text-[10px] font-black text-blue-200 uppercase tracking-widest border-b border-blue-50">
                           <div className="col-span-1 text-center">Rank</div>
                           <div className="col-span-4">Student Name</div>
                           <div className="col-span-2 text-center">Class / Grade</div>
                           <div className="col-span-2 text-center">Quizzes Done</div>
                           <div className="col-span-2 text-center">Average Score</div>
                           <div className="col-span-1 text-right pr-4">Total Points</div>
                        </div>
                        <div className="divide-y divide-blue-50">
                           {sortedByPoints.length > 0 ? (
                              sortedByPoints.map((student, idx) => {
                                 let rankIcon = `#${idx + 1}`;
                                 if (idx === 0) rankIcon = '🥇';
                                 else if (idx === 1) rankIcon = '🥈';
                                 else if (idx === 2) rankIcon = '🥉';

                                 return (
                                    <div key={student.id} className="grid grid-cols-12 px-8 py-6 items-center text-sm font-bold text-slate-600 hover:bg-blue-50/10 transition-colors">
                                       <div className="col-span-1 text-center text-base font-black">{rankIcon}</div>
                                       <div className="col-span-4 flex items-center gap-3">
                                          <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${student.name}`} className="w-10 h-10 rounded-full border border-slate-100 bg-white p-0.5" alt={student.name} />
                                          <div>
                                             <p className="font-black text-[#1E3A8A]">{student.name}</p>
                                             <div className="flex gap-1.5 mt-0.5">
                                                {student.badges.map(b => (
                                                   <span key={b.name} title={b.desc} className="cursor-help">{b.icon}</span>
                                                ))}
                                             </div>
                                          </div>
                                       </div>
                                       <div className="col-span-2 text-center text-xs font-black text-blue-300">{student.className}</div>
                                       <div className="col-span-2 text-center text-xs font-black">{student.completedCount}</div>
                                       <div className="col-span-2 text-center text-xs font-black text-emerald-500">{student.avgScore}%</div>
                                       <div className="col-span-1 text-right pr-4 font-black text-[#8A70FF]">{student.points}</div>
                                    </div>
                                 );
                              })
                           ) : (
                              <div className="py-20 text-center text-blue-300 font-bold italic text-sm">
                                 No students in this class roster yet. Add students to get started! 🍎
                              </div>
                           )}
                        </div>
                     </div>
                  )}
               </div>
            );
         }
          case 'AI Hub':
             return (
                <div className="px-10 py-10 space-y-10 min-h-[calc(100vh-64px)] pb-40 relative">
                   <div className="flex items-center justify-between">
                      <div>
                         <h1 className="text-4xl font-black text-[#1E3A8A] tracking-tight">AI Settings Hub</h1>
                         <p className="text-sm font-bold text-blue-300 italic">Configure your AI providers.</p>
                      </div>
                   </div>
                   <div className="bg-white rounded-[40px] border border-blue-50 shadow-sm p-10 max-w-2xl">
                      <p className="text-blue-400 font-bold mb-6">Manage API keys and configurations here.</p>
                      <div className="space-y-6">
                        <AiKeyInput label="OpenAI Key" value="" onChange={()=>{}} placeholder="sk-..." icon="/ic-homework.png" />
                      </div>
                   </div>
                </div>
             );
          case 'Class Goals': {
             if (!activeClassroom) {
                return (
                   <div className="px-10 py-20 text-center text-blue-300 font-bold italic text-sm">
                      Please select a class to view and configure collaborative goals! 🏆
                   </div>
                );
             }

             // Calculate classroom combined points
             const classStudents = allStudents.filter(s => s.classId === activeClassroom.id);
             const computedStudents = classStudents.map(student => {
                const studentSubs = allSubmissions.filter(sub => 
                   sub.studentName?.toLowerCase() === student.name?.toLowerCase()
                );
                const completedCount = studentSubs.length;
                const totalScore = studentSubs.reduce((acc, sub) => acc + (sub.score || 0), 0);
                const basePoints = 100;
                return basePoints + (completedCount * 50) + totalScore;
             });

             const rawClassPoints = computedStudents.reduce((acc, points) => acc + points, 0);
             const resetOffset = activeClassroom.goalResetPointsOffset || 0;
             const currentClassPoints = Math.max(0, rawClassPoints - resetOffset);

             // Fetch goal parameters with beautiful fallbacks
             const targetTitle = activeClassroom.goalTitle || 'Dino Pizza Party! 🍕';
             const targetGoal = activeClassroom.goalTarget || 1500;
             const progressPercent = Math.min(Math.round((currentClassPoints / targetGoal) * 100), 100);

             return (
                <div className="px-10 py-10 space-y-10 min-h-[calc(100vh-64px)] pb-40 relative">
                   <div className="flex items-center justify-between">
                      <div>
                         <h1 className="text-4xl font-black text-[#1E3A8A] tracking-tight">Classroom Collaborative Goals</h1>
                         <p className="text-sm font-bold text-blue-300 italic">Work together as a team to reach point goals and unlock class-wide prizes!</p>
                      </div>
                      <div className="w-24 h-24">
                         <img src="/mascot.png" className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl animate-float" alt="Mascot" />
                      </div>
                   </div>

                   <div className="grid grid-cols-12 gap-10">
                      {/* Goal Thermometer */}
                      <div className="col-span-8 bg-white rounded-[40px] border border-blue-50 shadow-sm p-10 space-y-8 flex flex-col justify-between">
                         <div className="space-y-4">
                            <div className="flex justify-between items-center">
                               <div>
                                  <span className="text-[10px] font-black uppercase text-purple-400 tracking-wider">Active Classroom Goal</span>
                                  <h3 className="text-2xl font-black text-[#1E3A8A]">{targetTitle}</h3>
                               </div>
                               <button 
                                  onClick={() => {
                                     setNewGoalTitle(targetTitle);
                                     setNewGoalTarget(targetGoal);
                                     setIsEditingGoal(true);
                                  }}
                                  className="px-4 py-2 border-2 border-purple-100 hover:border-purple-200 text-[#8A70FF] rounded-2xl text-xs font-black transition-all bg-white"
                               >
                                  Customize Goal ✏️
                               </button>
                            </div>

                            <div className="pt-6 space-y-4">
                               <div className="flex justify-between text-sm font-black text-[#1E3A8A]">
                                  <span>Class Combined Points</span>
                                  <span>{currentClassPoints} / {targetGoal} Points</span>
                               </div>
                               
                               {/* Boutique Thermometer Progress Bar */}
                               <div className="h-8 w-full bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden p-1 shadow-inner relative flex items-center">
                                  <div 
                                     className="h-full rounded-2xl bg-gradient-to-r from-[#8A70FF] to-pink-400 transition-all duration-1000 flex items-center justify-end pr-4 shadow-[0_0_12px_rgba(138,112,255,0.3)]"
                                     style={{ width: `${progressPercent}%` }}
                                  >
                                     <span className="text-[9px] font-black text-white uppercase tracking-wider">{progressPercent}%</span>
                                  </div>
                               </div>
                            </div>
                         </div>

                         <div className="bg-purple-50/50 rounded-3xl p-6 border border-purple-100/50 flex items-center gap-4">
                            <span className="text-4xl">🎉</span>
                            <div>
                               <p className="text-sm font-black text-[#1E3A8A]">Goal Progress Message</p>
                               <p className="text-xs font-bold text-blue-400 italic">
                                  {progressPercent >= 100 
                                     ? `Incredible! Your class reached the goal! The Dino party is unlocked on their student panels! 🎈🦖`
                                     : `You need ${targetGoal - currentClassPoints} more points to unlock this prize. Keep submitting homework quizzes!`}
                               </p>
                            </div>
                         </div>
                      </div>

                      {/* Reward Lock Status */}
                      <div className="col-span-4 bg-gradient-to-br from-indigo-50/30 to-[#EBE4FF]/20 rounded-[40px] border border-blue-50 shadow-sm p-10 flex flex-col items-center justify-center text-center space-y-6">
                         <div className={`w-32 h-32 rounded-full border-4 border-white shadow-xl flex-center ${progressPercent >= 100 ? 'bg-emerald-50 border-emerald-200 text-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                            <span className="text-5xl">{progressPercent >= 100 ? '🦖' : '🔒'}</span>
                         </div>
                         <div className="space-y-1">
                            <h4 className="text-lg font-black text-[#1E3A8A]">Party Mascot Unlock</h4>
                            <p className="text-xs font-bold text-blue-300 italic">{progressPercent >= 100 ? 'Unlocked & Active! 🦕' : 'Goal Locked'}</p>
                         </div>
                      </div>
                   </div>
                </div>
             );
          }
          case 'Calendar': {
             const classHomeworks = allHomeworks.filter(hw => !activeClassroom || hw.assignedClassId === activeClassroom.id);
             const classSubmissions = allSubmissions.filter(sub => {
                if (!activeClassroom) return true;
                const hw = allHomeworks.find(h => h.id === sub.homeworkId);
                const subClassId = sub.classId || hw?.assignedClassId;
                return subClassId === activeClassroom.id;
             });

             // Generate calendar dates for May 2026
             const daysInMonth = 31;
             const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

             return (
                <div className="px-10 py-10 space-y-10 min-h-[calc(100vh-64px)] pb-40 relative">
                   <div className="flex items-center justify-between">
                      <div>
                         <h1 className="text-4xl font-black text-[#1E3A8A] tracking-tight">Homework Planner Calendar</h1>
                         <p className="text-sm font-bold text-blue-300 italic">Schedule assignments, track deadlines, and send live reminder pings.</p>
                      </div>
                      <div className="w-24 h-24">
                         <img src="/mascot.png" className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl animate-float" alt="Mascot" />
                      </div>
                   </div>

                   <div className="bg-white rounded-[40px] border border-blue-50 shadow-sm p-10 space-y-8">
                      <div className="flex justify-between items-center border-b border-slate-50 pb-6">
                         <h3 className="text-xl font-black text-[#1E3A8A]">May 2026</h3>
                         <span className="text-[10px] font-black uppercase text-blue-300 tracking-wider">Active Classroom: {activeClassroom?.name || 'All Classes'}</span>
                      </div>

                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-4">
                         {/* Day headers */}
                         {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                            <div key={day} className="text-center text-[10px] font-black text-blue-300 uppercase tracking-widest py-2">{day}</div>
                         ))}

                         {/* Empty spacer days (May 1, 2026 was a Friday, so Mon-Thu empty) */}
                         {Array.from({ length: 4 }).map((_, idx) => (
                            <div key={`empty-${idx}`} className="aspect-square bg-slate-50/20 border border-slate-100/10 rounded-2xl" />
                         ))}

                         {/* Calendar days */}
                         {calendarDays.map(day => {
                            const dayStr = day < 10 ? `0${day}` : `${day}`;
                            const activeHw = classHomeworks.find(hw => {
                               const hwDueDate = hw.dueDate || '';
                               return hwDueDate.includes(`-05-${dayStr}`) || hwDueDate.includes(`-5-${day}`);
                            });

                            return (
                               <div 
                                  key={day} 
                                  className="aspect-square bg-slate-50/30 border border-slate-50 rounded-[24px] p-3 flex flex-col justify-between hover:bg-slate-50 transition-all cursor-pointer relative overflow-hidden group hover:scale-[1.03]"
                                  onClick={() => {
                                     if (activeHw) {
                                        setSelectedCalendarHw(activeHw);
                                        setShowCalendarModal(true);
                                     }
                                  }}
                               >
                                  <span className="text-xs font-black text-[#1E3A8A]">{day}</span>
                                  
                                  {activeHw && (
                                     <div className="bg-[#EBE4FF] border border-purple-100/60 p-2 rounded-xl text-[9px] font-black text-purple-600 truncate shadow-sm mt-2 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-purple-400" />
                                        {activeHw.subject}: {activeHw.title}
                                     </div>
                                  )}
                               </div>
                            );
                         })}
                      </div>
                   </div>
                </div>
             );
          }

         default:
            return null;
      }
   };

   return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      {/* --- Executive Hub Sidebar --- */}
      <aside className="w-80 bg-white border-r border-slate-100/60 flex flex-col shrink-0 h-screen sticky top-0 overflow-hidden">
         <div className="p-8 pb-4 mb-2 flex flex-col items-center border-b border-slate-100/60">
            <img src="/logo.png" className="w-full h-36 object-contain mix-blend-multiply mb-2" alt="Homework Zone" />

            <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 flex flex-col items-center w-full">
               <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Teacher Code</span>
               <span className="text-sm font-black text-slate-700 tracking-wider">{user?.teacherCode || user?.uid?.slice(0, 6).toUpperCase()}</span>
            </div>
         </div>

         <nav className="flex-1 px-6 space-y-2 overflow-y-auto custom-scrollbar pt-2">
            <SidebarItem id="Dashboard" label="Dashboard" icon={<LayoutDashboard />} iconColor="text-blue-500" active={activeTab === 'Dashboard'} onClick={setActiveTab} />
            <SidebarItem id="My Classes" label="My Classes" icon={<img src="/ic-classes.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Classes" />} active={activeTab === 'My Classes'} onClick={setActiveTab} />
            <SidebarItem id="Homework" label="Homework" icon={<img src="/ic-homework.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Homework" />} active={activeTab === 'Homework'} onClick={setActiveTab} />
            <SidebarItem id="Gradebook" label="Gradebook" icon={<Trophy className="w-5 h-5 text-emerald-500" />} active={activeTab === 'Gradebook'} onClick={setActiveTab} />
            <SidebarItem id="Messages" label="Messages" icon={<img src="/ic-messages.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Messages" />} active={activeTab === 'Messages'} onClick={setActiveTab} />
            <SidebarItem id="Rewards" label="Rewards" icon={<img src="/ic-rewards.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Rewards" />} active={activeTab === 'Rewards'} onClick={setActiveTab} />
            <SidebarItem id="AI Hub" label="AI Hub" icon={<Zap className="w-5 h-5 text-purple-500" />} active={showAiSettings} onClick={() => setShowAiSettings(true)} />
         </nav>

         {/* Mascot Bottom Support */}
         <div className="p-6 mt-auto">
            <div className="bg-indigo-50/50 rounded-[32px] p-8 relative group overflow-hidden border border-indigo-100/50">
               <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full opacity-40" />
               <p className="text-[11px] font-bold text-indigo-900 leading-tight text-center relative z-10 italic">
                  Guiding every student<br/>to their best! 🍎
               </p>
               <div className="mt-4 flex-center">
                  <img src="/mascot.png" className="w-36 h-36 object-contain animate-float mix-blend-multiply drop-shadow-xl" alt="Mascot" />
               </div>
               <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-indigo-200/20 rounded-full blur-2xl" />
            </div>
         </div>
      </aside>

      <main className="flex-1 overflow-y-auto no-scrollbar bg-[#F9F9FF] relative p-4 lg:p-6 flex flex-col">
        <div className="flex-1 bg-white rounded-[40px] shadow-sm flex flex-col border border-slate-100/50 relative overflow-hidden">
        {/* --- Dynamic Top Navigation --- */}
         {activeTab !== 'My Classes' && (
            <header className="h-24 bg-white border-b border-slate-50 flex items-center justify-between px-10 sticky top-0 z-50">
              <div className="flex items-center gap-8">
                 <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">{activeTab === 'Dashboard' ? 'Executive Dashboard' : activeTab}</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeTab === 'Dashboard' ? 'Global Overview' : 'Class View'} • {activeClassroom?.name || 'All Classes'}</p>
                 </div>
                 
                 <div className="relative">
                    <button 
                      onClick={() => setShowClassDropdown(!showClassDropdown)}
                      className="flex items-center gap-3 px-5 py-2.5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all group"
                    >
                       <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                       <span className="text-sm font-bold text-slate-700">{activeClassroom?.name || 'Select Class'}</span>
                       <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showClassDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                       {showClassDropdown && (
                          <motion.div 
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0, y: 10 }}
                             className="absolute top-full left-0 mt-3 w-64 bg-white rounded-[32px] shadow-2xl border border-slate-100 z-[100] overflow-hidden p-2"
                          >
                             <div className="px-4 py-3 border-b border-slate-50 mb-1">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Switch Workspaces</span>
                             </div>
                             <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                                {classrooms.map(room => (
                                   <button 
                                      key={room.id}
                                      onClick={() => { setActiveClassroom(room); setShowClassDropdown(false); }}
                                      className="w-full text-left px-4 py-3 rounded-2xl hover:bg-slate-50 transition-all group/item flex items-center gap-3"
                                   >
                                      <div className={`w-1.5 h-1.5 rounded-full ${activeClassroom?.id === room.id ? 'bg-indigo-600' : 'bg-slate-200 group-hover/item:bg-indigo-300'}`} />
                                      <span className={`text-sm font-bold ${activeClassroom?.id === room.id ? 'text-indigo-600' : 'text-slate-600 group-hover/item:text-slate-900'}`}>{room.name}</span>
                                   </button>
                                ))}
                             </div>
                          </motion.div>
                       )}
                    </AnimatePresence>
                 </div>
              </div>

              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2 bg-slate-50 rounded-2xl p-1.5 border border-slate-100">
                    <button className="w-10 h-10 bg-white rounded-xl flex-center text-slate-400 shadow-sm border border-slate-100 hover:text-indigo-600 transition-all"><Search size={18} /></button>
                    <button className="w-10 h-10 bg-white rounded-xl flex-center text-slate-400 shadow-sm border border-slate-100 hover:text-indigo-600 transition-all relative">
                       <Bell size={18} />
                       <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                    </button>
                    
                 </div>

                 <div className="h-10 w-px bg-slate-100" />

                 <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                       <span className="text-sm font-bold text-slate-800">{user?.displayName || 'Teacher'}</span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{user?.email || 'Administrator'}</span>
                    </div>
                    <button 
                      onClick={onLogout}
                      className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex-center text-rose-500 shadow-sm hover:bg-rose-50 transition-all group"
                    >
                       <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                 </div>
              </div>
            </header>
         )}

            {renderContent()}

            {/* Goal Edit Modal - Globally Accessible across tabs */}
            {isEditingGoal && (
               <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex-center p-6">
                  <div className="max-w-md w-full bg-white rounded-[40px] p-10 space-y-8 shadow-2xl border border-blue-50 relative">
                     <h3 className="text-2xl font-black text-[#1E3A8A]">Customize Class Goal</h3>
                     <div className="space-y-4">
                        <div>
                           <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2">Goal Name / Title</label>
                           <input 
                              type="text" 
                              value={newGoalTitle} 
                              onChange={(e) => setNewGoalTitle(e.target.value)} 
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-bold text-[#1E3A8A] focus:outline-none"
                              placeholder="e.g. Pizza Party! 🍕"
                           />
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2">Target Points</label>
                           <input 
                              type="number" 
                              value={newGoalTarget} 
                              onChange={(e) => setNewGoalTarget(e.target.value)} 
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-bold text-[#1E3A8A] focus:outline-none"
                              placeholder="e.g. 1500"
                           />
                        </div>
                     </div>
                     <div className="flex flex-col gap-3">
                        <div className="flex gap-4">
                           <button onClick={handleSaveGoal} className="flex-1 bg-[#8A70FF] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#7455FF] transition-all shadow-lg shadow-purple-100">
                              Save Goal 🚀
                           </button>
                           <button onClick={() => setIsEditingGoal(false)} className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors">
                              Cancel
                           </button>
                        </div>
                        <button 
                           onClick={handleResetGoalProgress}
                           className="w-full bg-red-50 hover:bg-red-100/80 text-red-500 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-red-100"
                        >
                           Reset Goal Progress 🔄
                        </button>
                     </div>
                  </div>
               </div>
            )}
{/* Global Calendar Reminder Modal */}
      {showCalendarModal && selectedCalendarHw && (() => {
         const submissions = allSubmissions.filter(s => s.homeworkId === selectedCalendarHw.id && (!activeClassroom || s.classId === activeClassroom.id));
         const classStudents = allStudents.filter(s => s.classId === selectedCalendarHw.assignedClassId);
         const normalizeName = (name) => (name || '').trim().toLowerCase().replace(/\s+/g, ' ');
         const submittedStudentNames = new Set(submissions.map(s => normalizeName(s.studentName)));
         const pendingStudents = classStudents.filter(s => !submittedStudentNames.has(normalizeName(s.name)));

         const handleSendReminderPing = async (student) => {
            try {
               await addDoc(collection(db, 'messages'), {
                  teacherId: user.uid,
                  senderId: user.uid,
                  senderName: user.displayName || 'Teacher',
                  senderRole: 'teacher',
                  recipientType: 'student',
                  recipientId: student.name,
                  recipientName: student.name,
                  subject: `⚠️ Reminder: ${selectedCalendarHw.title}`,
                  content: `Hi ${student.name}! Friendly reminder to finish your ${selectedCalendarHw.subject} quiz on "${selectedCalendarHw.title}" as soon as possible! 🚀`,
                  createdAt: new Date().toISOString()
               });
               alert(`Reminder sent live to ${student.name}! 🚀`);
            } catch (err) {
               console.error(err);
               alert("Failed to send reminder.");
            }
         };

         return (
            <div className="fixed inset-0 bg-[#3C2E75]/40 backdrop-blur-sm z-[200] flex-center p-6">
               <div className="max-w-2xl w-full bg-white rounded-[40px] p-10 space-y-8 shadow-2xl border-8 border-[#F3EFFF] relative max-h-[90vh] overflow-y-auto custom-scrollbar">
                  <div className="flex justify-between items-start">
                     <div>
                        <span className="text-[9px] font-black uppercase text-[#806BFF] tracking-wider">Mission Details</span>
                        <h3 className="text-2xl font-black text-[#3B2B85]">{selectedCalendarHw.title}</h3>
                        <p className="text-xs font-bold text-[#7A69D6] italic">{selectedCalendarHw.subject} • Due: {selectedCalendarHw.dueDate}</p>
                     </div>
                     <button onClick={() => setShowCalendarModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} strokeWidth={3} />
                     </button>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-4">
                     {/* Submitted List */}
                     <div className="space-y-4">
                        <h4 className="text-sm font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                           <span>✅</span> Submitted ({submissions.length})
                        </h4>
                        <div className="space-y-2 max-h-[250px] overflow-y-auto no-scrollbar">
                           {submissions.map(sub => (
                              <div key={sub.id} className="flex justify-between items-center bg-emerald-50/30 border border-emerald-50 p-3 rounded-2xl text-xs font-bold text-[#5C4D9F]">
                                 <span>{sub.studentName}</span>
                                 <span className="font-black text-emerald-500">{sub.score}%</span>
                              </div>
                           ))}
                           {submissions.length === 0 && (
                              <span className="text-xs text-blue-300 italic">No submissions yet.</span>
                           )}
                        </div>
                     </div>

                     {/* Pending List */}
                     <div className="space-y-4">
                        <h4 className="text-sm font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                           <span>⏳</span> Pending ({pendingStudents.length})
                        </h4>
                        <div className="space-y-2 max-h-[250px] overflow-y-auto no-scrollbar">
                           {pendingStudents.map(student => (
                              <div key={student.id} className="flex justify-between items-center bg-amber-50/30 border border-amber-50 p-3 rounded-2xl text-xs font-bold text-[#5C4D9F]">
                                 <span>{student.name}</span>
                                 <button 
                                    onClick={() => handleSendReminderPing(student)}
                                    className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-white rounded-lg text-[9px] font-black transition-colors"
                                 >
                                    Send Ping 🔔
                                 </button>
                              </div>
                           ))}
                           {pendingStudents.length === 0 && (
                              <span className="text-xs text-emerald-500 font-black italic">Excellent! Everyone has submitted! 🎉</span>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         );
      })()}

      {/* --- Add Class Modal --- */}
      <AnimatePresence>
        {showAddClassModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md w-full bg-white rounded-[40px] p-10 space-y-8 shadow-2xl border-8 border-indigo-100"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Create New Class</h2>
                <p className="text-sm font-bold text-slate-400">Give your new class a fun name! 🎨</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Class Name</label>
                  <input 
                    type="text" 
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="e.g. Grade 5 Adventure"
                    className="w-full bg-slate-50 border-4 border-slate-50 rounded-[24px] py-4 px-6 text-sm font-bold focus:bg-white focus:border-indigo-100 transition-all outline-none"
                    autoFocus
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Subjects to Teach</label>
                  <div className="flex flex-wrap gap-2 px-2">
                    {Object.keys(SUBJECT_ICONS).map(subject => (
                      <button
                        key={subject}
                        onClick={() => {
                          if (selectedSubjects.includes(subject)) {
                            setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
                          } else {
                            setSelectedSubjects([...selectedSubjects, subject]);
                          }
                        }}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all ${selectedSubjects.includes(subject) ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button 
                    onClick={handleAddClassroom}
                    disabled={isAddingClass}
                    className={`flex-1 bg-indigo-600 text-white py-4 rounded-[24px] font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 ${isAddingClass ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isAddingClass ? 'Creating...' : 'Create Class'}
                  </button>
                  <button 
                    onClick={() => setShowAddClassModal(false)}
                    className="px-8 py-4 bg-slate-100 text-slate-400 rounded-[24px] font-black text-sm hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
        
      {/* Review Modal */}
      <AnimatePresence>
        {selectedSubmission && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                 onClick={() => setSelectedSubmission(null)}
              />
              <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.9, y: 20 }}
                 className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-blue-100"
              >
                 <div className="px-10 py-8 bg-blue-50/30 border-b border-blue-50 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-6">
                       <img src={getStudentAvatar(selectedSubmission.studentName)} className="w-16 h-16 rounded-full border-4 border-white shadow-md bg-blue-100" alt="Student" />
                       <div>
                          <h2 className="text-3xl font-black text-[#1E3A8A]">{selectedSubmission.studentName}'s Report</h2>
                          <div className="flex items-center gap-4 mt-2">
                             <span className="text-sm font-bold text-blue-400">Score: {selectedSubmission.score}%</span>
                             <span className="w-1.5 h-1.5 rounded-full bg-blue-200" />
                             <span className="text-sm font-bold text-blue-400">Mission: {selectedSubmission.homeworkId.slice(0, 8)}</span>
                          </div>
                       </div>
                    </div>
                    <button 
                       onClick={() => setSelectedSubmission(null)}
                       className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-400 hover:text-rose-500 hover:bg-rose-50 hover:scale-110 transition-all shadow-sm border border-blue-50"
                    >
                       ✕
                    </button>
                 </div>

                 <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-10">
                    {selectedSubmission.feedback && (
                      <div className="bg-amber-50/50 border border-amber-100 rounded-[32px] p-8 flex gap-6">
                         <div className="w-12 h-12 shrink-0 bg-amber-400 rounded-2xl flex items-center justify-center text-white shadow-sm">
                            <Zap className="w-6 h-6" />
                         </div>
                         <div className="space-y-2">
                            <h4 className="text-sm font-black text-amber-800 uppercase tracking-widest">System Feedback</h4>
                            <p className="text-amber-900 font-bold leading-relaxed">{selectedSubmission.feedback}</p>
                         </div>
                      </div>
                    )}

                    <div className="space-y-6">
                       <h3 className="text-xl font-black text-[#1E3A8A]">Question Breakdown</h3>
                       
                       {isFetchingReview ? (
                          <div className="py-20 flex justify-center">
                             <div className="w-10 h-10 border-4 border-blue-200 border-t-[#8A70FF] rounded-full animate-spin" />
                          </div>
                       ) : reviewHomework?.questions ? (
                           <div className="space-y-8">
                              {reviewHomework.questions.map((q, qIdx) => {
                                 const studentSelection = selectedSubmission.answers?.[q.id];
                                 const actualAnswer = q.answer;
                                 
                                 return (
                                    <div key={q.id || qIdx} className="bg-[#f8f9fa] rounded-[24px] p-6 lg:p-8 space-y-5">
                                       <p className="text-[15px] font-bold text-slate-800 tracking-tight">
                                          <span className="text-purple-700 font-black mr-2">Q{qIdx + 1}.</span> 
                                          {q.text}
                                       </p>
                                       
                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          {q.options.map((opt, optIdx) => {
                                             const isStudentSelection = opt === studentSelection;
                                             const isActualCorrect = opt === actualAnswer;
                                             
                                             let optionClasses = "px-5 py-3.5 rounded-xl border flex items-center gap-4 transition-all ";
                                             
                                             if (isActualCorrect) {
                                                optionClasses += "bg-[#d1f5d3] border-emerald-300 text-emerald-900";
                                             } else if (isStudentSelection && !isActualCorrect) {
                                                optionClasses += "bg-rose-50 border-rose-200 text-rose-900";
                                             } else {
                                                optionClasses += "bg-white border-slate-200 text-slate-600";
                                             }

                                             return (
                                                <div key={optIdx} className={optionClasses}>
                                                   <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-black ${isActualCorrect ? 'bg-emerald-200/60 text-emerald-800' : isStudentSelection && !isActualCorrect ? 'bg-rose-200/60 text-rose-800' : 'bg-slate-50 text-slate-500'}`}>
                                                      {String.fromCharCode(65 + optIdx)}
                                                   </div>
                                                   <span className="text-[13px] font-bold flex-1">{opt}</span>
                                                </div>
                                             );
                                          })}
                                       </div>
                                    </div>
                                 );
                              })}
                           </div>
                       ) : (
                          <div className="py-20 text-center text-blue-300 italic font-bold">
                             Homework data not available.
                          </div>
                       )}
                    </div>
                 </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>
        </div>
      
      {/* AI Settings Centered Modal */}
      <AnimatePresence>
        {showAiSettings && (
           <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex-center p-6">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="max-w-md w-full bg-white rounded-[40px] p-10 space-y-8 shadow-2xl border border-blue-50 relative"
             >
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <Zap className="w-6 h-6 text-purple-600 fill-current" />
                     <h2 className="text-xl font-black text-[#1E3A8A] tracking-tight uppercase">AI Power Hub</h2>
                  </div>
                  <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-100">
                     <Lock className="w-3 h-3" />
                     <span className="text-[9px] font-black uppercase tracking-widest">Local</span>
                  </div>
               </div>

               <div className="flex bg-blue-50/50 rounded-2xl p-1.5 shadow-sm border border-blue-100">
                  <button onClick={() => setActiveAi('gemini')} className={`flex-1 py-3 rounded-xl flex-center gap-2 text-xs font-black transition-all ${activeAi === 'gemini' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                     <img src="https://img.icons8.com/color/48/google-logo.png" className="w-5 h-5" alt="Gemini" /> G
                  </button>
                  <button onClick={() => setActiveAi('openai')} className={`flex-1 py-3 rounded-xl flex-center gap-2 text-xs font-black transition-all ${activeAi === 'openai' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                     <img src="https://img.icons8.com/color/48/chatgpt.png" className="w-5 h-5" alt="OpenAI" /> O
                  </button>
                  <button onClick={() => setActiveAi('anthropic')} className={`flex-1 py-3 rounded-xl flex-center gap-2 text-xs font-black transition-all ${activeAi === 'anthropic' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                     <img src="https://img.icons8.com/color/48/brain.png" className="w-5 h-5" alt="Claude" /> C
                  </button>
               </div>
               
               <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-blue-400 ml-4">{activeAi === 'gemini' ? 'Google Gemini' : activeAi === 'openai' ? 'OpenAI' : 'Claude'}</span>
                  <input 
                    type="password" 
                    value={aiKeys[activeAi]}
                    onChange={(e) => setAiKeys({...aiKeys, [activeAi]: e.target.value})}
                    placeholder="•••••••••••••••••••••••••••••••••"
                    className="w-full bg-blue-50/30 border-2 border-indigo-50 rounded-2xl px-6 py-4 text-xl focus:border-purple-200 outline-none tracking-[0.2em] text-[#1E3A8A]"
                  />
               </div>
               
               <div className="flex gap-4">
                  <button onClick={saveAiKeys} className="flex-1 bg-[#8A70FF] text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#7455FF] transition-colors shadow-lg shadow-purple-200">
                     Save Key
                  </button>
                  <button onClick={() => setShowAiSettings(false)} className="w-1/3 bg-blue-50 text-blue-400 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-100 hover:text-blue-600 transition-colors">
                     Cancel
                  </button>
               </div>
             </motion.div>
           </div>
        )}
      </AnimatePresence>
      </main>
    </div>
   );
};

const SidebarItem = ({ id, label, icon, iconColor, active, onClick }) => (
  <button 
    onClick={() => onClick(id)}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-[24px] transition-all group ${active ? 'bg-[#EBE4FF] text-[#7C3AED] shadow-xl shadow-purple-50' : 'text-[#A098AE] hover:bg-blue-50/50'}`}
  >
     <div className={`${active ? 'text-[#7C3AED]' : iconColor} group-hover:scale-125 transition-transform w-6 h-6 flex-center`}>
        {React.isValidElement(icon) && icon.type === 'img' ? icon : React.cloneElement(icon, { size: 20, strokeWidth: 3, fill: "currentColor" })}
     </div>
     <span className={`text-sm font-black tracking-tight ${active ? 'text-[#7C3AED]' : 'text-[#A098AE]'}`}>{label}</span>
  </button>
);

const PlaceholderView = ({ title, icon, description }) => (
   <div className="px-10 py-20 flex flex-col items-center justify-center text-center space-y-6">
      <div className="w-32 h-32 bg-white rounded-[40px] shadow-2xl flex-center border border-blue-50">
         <img src={icon} className="w-20 h-20 object-contain mix-blend-multiply" alt={title} />
      </div>
      <div className="space-y-2">
         <h1 className="text-4xl font-black text-[#1E3A8A] tracking-tight">{title}</h1>
         <p className="text-sm font-bold text-blue-300 italic">{description}</p>
      </div>
      <div className="grid grid-cols-3 gap-6 w-full max-w-4xl mt-12">
         {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-white/50 rounded-[40px] border-2 border-dashed border-blue-100 flex-center">
               <span className="text-blue-100 font-black text-4xl">{i}</span>
            </div>
         ))}
      </div>
   </div>
);

const ClassCard = ({ name, students, bgColor, kidsImg, subjects, onDelete, onView, onRename }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);

  const handleRename = () => {
    if (editName.trim() && editName.trim() !== name) {
      onRename(editName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleRename();
    if (e.key === 'Escape') {
       setEditName(name);
       setIsEditing(false);
    }
  };

  return (
    <div className={`${bgColor} rounded-[40px] p-8 border border-white/50 shadow-sm flex flex-col gap-6 group hover:shadow-xl transition-all relative overflow-hidden`}>
       <AnimatePresence>
         {showConfirm && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="absolute inset-0 bg-rose-600/95 z-50 flex flex-col items-center justify-center p-6 text-center space-y-4"
           >
             <div className="w-16 h-16 bg-white/20 rounded-full flex-center text-white">
                <Trash2 className="w-8 h-8" />
             </div>
             <div className="space-y-1">
                <h4 className="text-white font-black text-xl">Delete Class?</h4>
                <p className="text-white/80 text-xs font-bold leading-tight">This will remove all students and data! ⚠️</p>
             </div>
             <div className="flex items-center gap-3 w-full">
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                  className="flex-1 bg-white text-rose-600 py-3 rounded-2xl font-black text-xs shadow-xl"
                >
                   Delete Now
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowConfirm(false); }}
                  className="flex-1 bg-black/20 text-white py-3 rounded-2xl font-black text-xs"
                >
                   Cancel
                </button>
             </div>
           </motion.div>
         )}
       </AnimatePresence>

       <div className="text-center space-y-1">
          {isEditing ? (
             <input 
                type="text" 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={handleKeyDown}
                className="text-2xl font-black text-[#1E3A8A] bg-white/50 border-2 border-[#8A70FF]/30 rounded-xl px-2 py-1 outline-none text-center w-[90%] focus:border-[#8A70FF] transition-all"
                autoFocus
             />
          ) : (
             <h3 
               className="text-2xl font-black text-[#1E3A8A] flex items-center justify-center gap-2 group/title cursor-pointer hover:text-[#7455FF] transition-colors" 
               onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
               title="Click to rename"
             >
               {name}
               <Pencil className="w-4 h-4 text-blue-300 opacity-0 group-hover/title:opacity-100 transition-opacity" />
             </h3>
          )}
          <p className="text-xs font-bold text-blue-400">{students} Students</p>
       </div>
       <div className="h-40 flex-center">
          <img src={kidsImg} className="h-full object-contain mix-blend-multiply" alt="Kids" />
       </div>
       <div className="flex items-center justify-around">
          {subjects.map((sub, i) => (
             <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 bg-white rounded-2xl flex-center shadow-sm">
                   <img src={sub.icon} className="w-6 h-6 object-contain mix-blend-multiply" alt={sub.name} />
                </div>
                <span className="text-[10px] font-black text-blue-400">{sub.name}</span>
             </div>
          ))}
       </div>
       <div className="flex items-center gap-3">
          <button 
            onClick={onView}
            className="flex-1 bg-[#8A70FF] text-white py-4 rounded-3xl font-black text-sm shadow-lg shadow-purple-100 hover:scale-[1.02] transition-all"
          >
             View Class
          </button>
          <button 
             onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
             className="w-12 h-12 bg-white rounded-2xl flex-center text-rose-300 shadow-sm hover:text-rose-600 hover:bg-rose-50 transition-all z-10"
             title="Delete Class"
          >
             <Trash2 className="w-5 h-5" />
          </button>
       </div>
    </div>
  );
};

const GrassBorder = () => (
  <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-0 overflow-hidden">
     <div className="absolute bottom-0 w-full h-24 bg-[#95E2B9] opacity-20 blur-3xl" />
     <div className="absolute bottom-0 w-full flex items-end justify-around px-20">
        {[...Array(12)].map((_, i) => (
           <div key={i} className="flex flex-col items-center">
              <div className={`w-8 h-${i % 2 === 0 ? '16' : '12'} bg-[#95E2B9]/30 rounded-t-full relative`}>
                 {i % 4 === 0 && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                       <Star className="w-4 h-4 text-yellow-400 fill-current opacity-40" />
                    </div>
                 )}
              </div>
           </div>
        ))}
     </div>
  </div>
);

const RewardKPICard = ({ title, value, subtitle, bgColor, textColor }) => (
   <div className={`${bgColor} rounded-[32px] p-8 border border-white/50 shadow-sm space-y-2 group hover:shadow-xl transition-all`}>
      <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest">{title}</p>
      <h3 className={`text-3xl font-black ${textColor} tracking-tight`}>{value}</h3>
      <div className="flex items-center gap-2">
         <span className="text-[10px] font-black text-blue-400 opacity-60 italic">{subtitle}</span>
      </div>
   </div>
);

const BadgeRow = ({ name, count, icon, color }) => (
   <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
         <div className={`w-12 h-12 ${color} rounded-2xl flex-center shadow-sm`}>
            {icon}
         </div>
         <div>
            <p className="text-sm font-black text-[#1E3A8A]">{name}</p>
            <p className="text-[10px] font-bold text-blue-300 italic">Earned by {count} students</p>
         </div>
      </div>
   </div>
);

const PaginationButton = ({ label, active }) => (
   <button className={`w-10 h-10 rounded-xl flex-center text-sm font-black transition-all ${active ? 'bg-[#8A70FF] text-white shadow-lg shadow-purple-100' : 'text-blue-400 hover:bg-blue-50'}`}>
      {label}
   </button>
);

const NavLink = ({ label, active }) => (
  <span className={`text-sm font-bold cursor-pointer transition-all ${active ? 'text-blue-900 border-b-2 border-blue-900' : 'text-blue-400 hover:text-blue-600'}`}>
    {label}
  </span>
);

const KPICard = ({ title, value, subtitle, icon, isAlt }) => (
  <div className="bg-white rounded-[40px] p-8 border border-blue-50 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all relative overflow-hidden h-52">
    <div className="space-y-2 relative z-10">
       <h4 className="text-sm font-black text-[#1E3A8A] tracking-tight">{title}</h4>
       <p className="text-5xl font-black text-[#1E3A8A] tracking-tighter">{value}</p>
       <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">{subtitle}</p>
    </div>
    <div className="w-28 h-28 relative">
       <div className={`absolute inset-0 overflow-hidden ${isAlt ? 'clip-path-custom-2' : 'clip-path-custom-1'}`}>
          <img src={icon} className={`w-full h-full object-cover transform scale-150 ${isAlt ? 'translate-x-4' : '-translate-x-14'}`} alt="KPI" />
       </div>
    </div>
  </div>
);

const StatusBlock = ({ count, label, avg, color, active }) => (
  <div className={`flex-1 ${color} rounded-[40px] p-8 text-white space-y-4 relative overflow-hidden shadow-lg transition-transform hover:scale-105 cursor-pointer ${active ? 'ring-4 ring-white/30' : ''}`}>
     <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex-center">
        <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=status" className="w-8 h-8 rounded-full opacity-80" alt="Avatar" />
     </div>
     <div className="space-y-1">
        <p className="text-6xl font-black leading-none">{count}</p>
        <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">{label}</p>
        <p className="text-[10px] font-black uppercase tracking-[0.2em]">{avg}</p>
     </div>
  </div>
);

const ProficiencyRow = ({ name, avatar, completed, score, attention, working, mastered, color }) => (
  <div className={`${color} rounded-[32px] p-6 grid grid-cols-12 items-center group hover:scale-[1.01] transition-all cursor-pointer border border-white shadow-sm`}>
     <div className="col-span-3 flex items-center gap-4">
        <img src={avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt={name} />
        <span className="text-sm font-black text-blue-900">{name}</span>
     </div>
     
     <div className="col-span-2 text-center text-sm font-bold text-blue-500">
        {completed}
     </div>

     <div className="col-span-3 flex-center px-10">
        <div className="w-full h-10 bg-white/50 rounded-full overflow-hidden flex items-center p-1 border border-white">
           <div className={`h-full rounded-full ${score > 70 ? 'bg-emerald-400' : score > 40 ? 'bg-amber-400' : 'bg-rose-400'}`} style={{ width: `${score}%` }} />
           <span className="ml-4 text-xs font-black text-blue-800">{score}%</span>
        </div>
     </div>

     <div className="col-span-4 flex items-center justify-around">
        <CircleIndicator value={attention} color="bg-rose-500" />
        <CircleIndicator value={working} color="bg-amber-400" />
        <CircleIndicator value={mastered} color="bg-emerald-500" isLarge />
     </div>
  </div>
);

const CircleIndicator = ({ value, color, isLarge }) => (
  <div className={`${color} ${isLarge ? 'w-14 h-14' : value > 20 ? 'w-12 h-12' : 'w-8 h-8'} rounded-full flex-center text-white text-xs font-black shadow-lg border-4 border-white/20 transform transition-transform group-hover:scale-110`}>
     {value}
  </div>
);

const AiSelector = ({ active, onClick, label, icon }) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-[24px] border-4 transition-all ${active ? 'bg-white border-purple-100 shadow-md' : 'bg-transparent border-transparent text-blue-400 hover:bg-blue-100/50'}`}
  >
     <img src={icon} className={`w-5 h-5 ${active ? 'opacity-100' : 'opacity-40 grayscale'} transition-all`} alt={label} />
     <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-blue-900' : 'text-blue-400'}`}>{label}</span>
  </button>
);

const AiKeyInput = ({ label, value, onChange, placeholder, icon }) => (
  <div className="space-y-2">
     <label className="text-[10px] font-black uppercase text-blue-400 tracking-[0.1em] block ml-4">{label}</label>
     <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-50 rounded-lg flex-center border border-blue-100 group-focus-within:border-purple-200 transition-all">
           <img src={icon} className="w-5 h-5" alt={label} />
        </div>
        <input 
          type="password" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-blue-50 border-4 border-blue-50 pl-16 pr-6 py-4 rounded-[24px] text-xs font-bold outline-none focus:bg-white focus:border-purple-100 transition-all placeholder:text-blue-300"
        />
     </div>
  </div>
);

const SubjectCard = ({ title, description, icon, color, borderColor, active, onClick }) => (
   <button 
      onClick={onClick}
      className={`relative p-8 rounded-[40px] border-4 transition-all flex flex-col items-center text-center gap-4 group ${color} ${active ? `${borderColor} shadow-xl scale-[1.02]` : 'border-transparent hover:scale-[1.01]'}`}
   >
      <div className={`absolute top-6 right-6 w-6 h-6 rounded-full border-2 flex-center transition-all ${active ? 'bg-[#8A70FF] border-[#8A70FF]' : 'border-blue-200 bg-white'}`}>
         {active && <Star className="w-3 h-3 text-white fill-current" />}
      </div>
      <div className="w-32 h-32 flex-center relative">
         <img src={icon} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" alt={title} />
      </div>
      <div className="space-y-1">
         <h3 className="text-2xl font-black text-[#1E3A8A]">{title}</h3>
         <p className="text-[10px] font-bold text-blue-400 leading-tight">{description}</p>
      </div>
   </button>
);

export default TeacherDashboard;
