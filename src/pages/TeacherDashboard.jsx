import React, { useState, useEffect } from 'react';
import { 
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
  Trophy
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, doc, getDoc, setDoc, getDocs, query, orderBy, deleteDoc, where } from 'firebase/firestore';
import HomeworkGenerator from './HomeworkGenerator';

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
  const [allStudents, setAllStudents] = useState([]);
  const [filterClass, setFilterClass] = useState('All Classes');
  const [searchQuery, setSearchQuery] = useState('');
  const [rewardsTab, setRewardsTab] = useState('Overview');
  const [messagesTab, setMessagesTab] = useState('Inbox');
  const [activeChat, setActiveChat] = useState(null);
  const [homeworkSubject, setHomeworkSubject] = useState('English');
  const [homeworkTitle, setHomeworkTitle] = useState('');
  const [homeworkInstructions, setHomeworkInstructions] = useState('');
  const [homeworkPoints, setHomeworkPoints] = useState(10);
  const [selectedSubjects, setSelectedSubjects] = useState(['English', 'Maths', 'Science']);
  const [submissions, setSubmissions] = useState([]);

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

  const saveAiKeys = () => {
    localStorage.setItem('hwz_gemini_key', aiKeys.gemini);
    localStorage.setItem('hwz_openai_key', aiKeys.openai);
    localStorage.setItem('hwz_anthropic_key', aiKeys.anthropic);
    localStorage.setItem('hwz_active_ai', activeAi);
    alert("AI Configuration saved locally! 🧠🔒");
    setShowAiSettings(false);
  };

  useEffect(() => {
    if (user?.uid) {
      fetchClassrooms();
    }
  }, [user]);

  useEffect(() => {
    if (user?.uid && activeClassroom) {
      fetchStudents();
    }
  }, [user, activeClassroom]);

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

      console.log("TeacherDashboard: Classrooms updated:", list.length);
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
      const studentRef = doc(db, 'teachers', user.uid, 'classrooms', activeClassroom.id, 'students', studentName.trim().toLowerCase());
      await setDoc(studentRef, {
        name: studentName.trim(),
        addedAt: new Date().toISOString()
      });
      setNewStudentName('');
      setNewStudent('');
      fetchStudents();
    } catch (err) {
      console.error("Add Student Error:", err);
    }
    setIsAdding(false);
  };

  const fetchDashboardSubmissions = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'submissions'), where('teacherId', '==', user.uid));
      const snap = await getDocs(q);
      setAllSubmissions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (user) fetchDashboardSubmissions();
  }, [user]);

  useEffect(() => {
    const now = new Date();
    let cutoffDate = new Date();
    if (dashboardTimeFilter === 'Weekly') cutoffDate.setDate(now.getDate() - 7);
    else if (dashboardTimeFilter === 'Monthly') cutoffDate.setMonth(now.getMonth() - 1);
    else cutoffDate.setDate(now.getDate() - 1); // Daily

    const filtered = allSubmissions.filter(s => {
      const subDate = s.submittedAt?.toDate ? s.submittedAt.toDate() : new Date(s.submittedAt);
      return subDate >= cutoffDate;
    });
    setTimeFilteredSubmissions(filtered);
  }, [dashboardTimeFilter, allSubmissions]);

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
    if (activeTab === 'Students') {
       fetchAllStudents();
    }
  }, [activeTab, classrooms]);

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

  const renderContent = () => {
      switch (activeTab) {
         case 'Dashboard': {
            const uniqueSubmitters = new Set(timeFilteredSubmissions.map(s => s.studentName)).size;
            const avgScoreTotal = timeFilteredSubmissions.length > 0 
               ? Math.round(timeFilteredSubmissions.reduce((acc, sub) => acc + sub.score, 0) / timeFilteredSubmissions.length)
               : 0;

            const studentAvgScores = {};
            timeFilteredSubmissions.forEach(sub => {
               if (!studentAvgScores[sub.studentName]) studentAvgScores[sub.studentName] = { total: 0, count: 0 };
               studentAvgScores[sub.studentName].total += sub.score;
               studentAvgScores[sub.studentName].count += 1;
            });

            const topPerformers = Object.entries(studentAvgScores)
               .map(([name, data]) => ({ name, avgScore: Math.round(data.total / data.count), count: data.count }))
               .sort((a, b) => b.avgScore - a.avgScore)
               .slice(0, 3);

            let chartLabels = [];
            let chartData = [];
            
            if (dashboardTimeFilter === 'Weekly') {
               chartLabels = ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'];
               chartData = [[], [], [], [], [], [], []];
               const now = new Date();
               timeFilteredSubmissions.forEach(sub => {
                  const subDate = sub.submittedAt?.toDate ? sub.submittedAt.toDate() : new Date(sub.submittedAt);
                  const diffDays = Math.floor((now - subDate) / (1000 * 60 * 60 * 24));
                  if (diffDays >= 0 && diffDays < 7) {
                     chartData[6 - diffDays].push(sub.score);
                  }
               });
            } else {
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
            }

            const chartAverages = chartData.map(bucket => bucket.length > 0 ? Math.round(bucket.reduce((a,b)=>a+b,0)/bucket.length) : 0);
            const chartCounts = chartData.map(bucket => bucket.length);

            return (
               <div className="px-10 py-10 space-y-12 pb-40 relative min-h-[calc(100vh-64px)]">
                  <div className="flex items-center justify-between">
                      <div className="space-y-1">
                         <h1 className="text-3xl font-black text-slate-800 tracking-tight">Daily Summary</h1>
                         <p className="text-sm font-bold text-slate-400">Real-time performance metrics across your active classrooms.</p>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
                         {['Daily', 'Weekly', 'Monthly'].map(f => (
                            <button 
                               key={f}
                               onClick={() => setDashboardTimeFilter(f)}
                               className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${dashboardTimeFilter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                               {f}
                            </button>
                         ))}
                      </div>
                   </div>

                  <div className="grid grid-cols-4 gap-6">
                     <RewardKPICard title="Total Students" value={allStudents.length || students.length} subtitle="Active Roster" bgColor="bg-slate-50/50" textColor="text-slate-800" />
                     <RewardKPICard title="Average Score" value={`${avgScoreTotal}%`} subtitle="Across all subjects" bgColor="bg-emerald-50/50" textColor="text-emerald-600" />
                     <RewardKPICard title="Participation" value={students.length > 0 ? Math.round((uniqueSubmitters/students.length)*100) + '%' : '0%'} subtitle="Missions complete" bgColor="bg-amber-50/50" textColor="text-amber-600" />
                     <RewardKPICard title="Submissions" value={timeFilteredSubmissions.length} subtitle={`This ${dashboardTimeFilter.toLowerCase()}`} bgColor="bg-indigo-50/50" textColor="text-indigo-600" />
                  </div>

                  <div className="grid grid-cols-12 gap-10">
                      <div className="col-span-8 bg-white rounded-[40px] border border-slate-100/60 shadow-sm p-8 space-y-8">
                         <div>
                            <h3 className="text-xl font-bold text-slate-800 tracking-tight">Class Performance</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dashboardTimeFilter} progress across core subjects</p>
                         </div>

                         <div className="h-64 flex items-end justify-between gap-2 pr-4 pb-8 border-b border-slate-50 relative">
                            {/* Y-Axis Guidelines */}
                            <div className="absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none z-0">
                               {[100, 75, 50, 25, 0].map((val, i) => (
                                  <div key={i} className="w-full flex items-center gap-4">
                                     <span className="text-[10px] font-bold text-slate-300 w-8 text-right">{val}%</span>
                                     <div className="flex-1 h-px bg-slate-900 opacity-[0.04]" />
                                  </div>
                               ))}
                            </div>
                            
                            <div className="w-8 shrink-0 hidden md:block" />

                            {chartLabels.map((label, i) => (
                               <div key={i} className="flex flex-col items-center gap-4 flex-1 group relative h-full pt-4 z-10">
                                  <div className="flex-1 flex items-end gap-3 relative w-full h-full justify-center">
                                     {chartAverages[i] > 0 && (
                                         <div className="absolute -top-8 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                             <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full shadow-sm">{chartAverages[i]}%</span>
                                             <span className="text-[9px] font-bold text-slate-400 mt-1 whitespace-nowrap">{chartCounts[i]} items</span>
                                         </div>
                                     )}
                                     <div className="w-12 bg-indigo-500 rounded-t-lg shadow-lg shadow-indigo-100 transition-all duration-1000 ease-out absolute bottom-0" style={{ height: `${Math.max(2, chartAverages[i] || 0)}%` }} />
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-800">{label}</span>
                               </div>
                            ))}
                         </div>
                      </div>

                     <div className="col-span-4 bg-white rounded-[40px] border border-blue-50 shadow-sm p-8 flex flex-col justify-between">
                        <div className="space-y-6">
                           <h3 className="text-xl font-black text-[#1E3A8A] tracking-tight">Top Performers</h3>
                           <div className="space-y-4">
                              {topPerformers.length > 0 ? topPerformers.map((s, idx) => (
                                 <div key={idx} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-2xl transition-colors">
                                    <div className="flex items-center gap-4">
                                       <span className="text-sm font-black text-blue-200">{idx + 1}.</span>
                                       <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${s.name}`} className="w-10 h-10 rounded-full bg-blue-50" alt={s.name} />
                                       <div className="flex flex-col">
                                          <span className="text-sm font-black text-[#1E3A8A]">{s.name}</span>
                                          <span className="text-[10px] font-bold text-slate-400">{s.count} Missions Completed</span>
                                       </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                       <span className="text-sm font-black text-blue-400">{s.avgScore}%</span>
                                       <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">Avg Score</span>
                                    </div>
                                 </div>
                              )) : (
                                 <div className="text-xs font-bold text-slate-400 text-center py-4">No data this period</div>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
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
                           kidsImg={['/kids-pair.png', '/kiddy_hero_kids.png', '/student_avatar_main.png'][i % 3]} 
                           subjects={(room.subjects || ['English', 'Maths', 'Science']).map(sub => ({
                               name: sub,
                               icon: SUBJECT_ICONS[sub] || '/ic-homework.png'
                            }))}
                           onDelete={() => handleDeleteClassroom(room.id)}
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
                                    <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${student.name}`} className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-white p-0.5" alt={student.name} />
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
                  <HomeworkGenerator user={user} classrooms={classrooms} />
                  <GrassBorder />
               </div>
            );
          case 'Gradebook':
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
                        <div className="col-span-4">Student Name</div>
                        <div className="col-span-3">Mission</div>
                        <div className="col-span-2 text-center">Score</div>
                        <div className="col-span-3 text-right">Actions</div>
                     </div>
                     <div className="divide-y divide-blue-50">
                        {allSubmissions.length > 0 ? (
                           allSubmissions.sort((a,b) => b.submittedAt - a.submittedAt).map((sub, idx) => (
                              <div key={sub.id || idx} className="grid grid-cols-12 px-8 py-6 items-center hover:bg-blue-50/10 transition-all">
                                 <div className="col-span-4 flex items-center gap-4">
                                    <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${sub.studentName}`} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt={sub.studentName} />
                                    <div className="flex flex-col">
                                       <span className="text-sm font-black text-[#1E3A8A]">{sub.studentName}</span>
                                       <span className="text-[10px] font-bold text-blue-400 italic">Feedback: "{sub.feedback}"</span>
                                    </div>
                                 </div>
                                 <div className="col-span-3">
                                    <span className="text-xs font-bold text-blue-400">Mission ID: {sub.homeworkId.slice(0, 8)}...</span>
                                 </div>
                                 <div className="col-span-2 text-center">
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
               <GrassBorder />
            </div>
         );
         case 'Messages': {
            const chats = [
               { id: 1, name: 'Grade 2A Parents', lastMsg: 'Thank you for attending the...', time: '10:30 AM', type: 'Class', date: '3 May 2024' },
               { id: 2, name: 'Ananya Patel (Parent)', lastMsg: 'Regarding homework...', time: 'Yesterday', type: 'Individual' },
               { id: 3, name: 'Vihaan Gupta (Parent)', lastMsg: 'Thank you for the update!', time: 'Yesterday', type: 'Individual' },
               { id: 4, name: 'Grade 3B Parents', lastMsg: 'Reminder: Science project...', time: '2 May', type: 'Class' },
               { id: 5, name: 'Myra Singh (Parent)', lastMsg: 'Can we schedule a meeting?', time: '1 May', type: 'Individual' }
            ];
            const currentChat = activeChat || chats[0];

            return (
               <div className="px-10 py-10 space-y-10 min-h-[calc(100vh-64px)] pb-40 relative">
                  <div className="flex items-center justify-between">
                     <div>
                        <h1 className="text-4xl font-black text-[#1E3A8A] tracking-tight">Messages</h1>
                        <p className="text-sm font-bold text-blue-300 italic">Communicate with students and parents.</p>
                     </div>
                     <button className="bg-[#8A70FF] text-white px-8 py-4 rounded-3xl font-black text-sm shadow-xl shadow-purple-100 flex items-center gap-3 hover:scale-105 transition-all">
                        <Plus className="w-5 h-5" /> New Message
                     </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center gap-8 border-b border-blue-50 pb-4">
                     {['Inbox', 'Sent', 'Announcements'].map(tab => (
                        <button 
                           key={tab}
                           onClick={() => setMessagesTab(tab)}
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
                           {chats.map(chat => (
                              <button 
                                 key={chat.id}
                                 onClick={() => setActiveChat(chat)}
                                 className={`w-full text-left p-6 flex items-center gap-4 transition-all ${currentChat.id === chat.id ? 'bg-blue-50/50' : 'hover:bg-blue-50/30'}`}
                              >
                                 <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${chat.name}`} className="w-12 h-12 rounded-full border-2 border-white shadow-sm bg-white p-0.5" alt={chat.name} />
                                 <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                       <p className="text-sm font-black text-[#1E3A8A] truncate">{chat.name}</p>
                                       <span className="text-[9px] font-bold text-blue-300">{chat.time}</span>
                                    </div>
                                    <p className="text-xs font-bold text-blue-300 truncate">{chat.lastMsg}</p>
                                 </div>
                              </button>
                           ))}
                        </div>
                     </div>

                     {/* Chat View */}
                     <div className="col-span-8 bg-white rounded-[40px] border border-blue-50 shadow-sm flex flex-col overflow-hidden">
                        <div className="p-8 border-b border-blue-50 flex items-center justify-between">
                           <div>
                              <h3 className="text-lg font-black text-[#1E3A8A]">{currentChat.name}</h3>
                              <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">{currentChat.date || 'Today'}</p>
                           </div>
                           <div className="flex items-center gap-4">
                              <button className="w-10 h-10 bg-blue-50 text-blue-400 rounded-xl flex-center hover:bg-blue-100 transition-all"><Settings className="w-4 h-4" /></button>
                              <button className="w-10 h-10 bg-blue-50 text-blue-400 rounded-xl flex-center hover:bg-blue-100 transition-all"><MoreVertical className="w-4 h-4" /></button>
                           </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-blue-50/10">
                           <div className="flex flex-col gap-4 max-w-[80%]">
                              <div className="bg-[#EBE4FF] p-6 rounded-[32px] rounded-tl-none border border-blue-100 shadow-sm">
                                 <p className="text-sm font-bold text-[#1E3A8A] leading-relaxed">
                                    Thank you for attending the parent meeting today. Please find the homework guidelines attached.
                                 </p>
                                 <p className="text-sm font-bold text-[#1E3A8A] mt-4">Let me know if you have any questions!</p>
                                 <div className="flex items-center gap-2 mt-4">
                                    <Heart className="w-4 h-4 text-rose-400 fill-current" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-200" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-200" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-200" />
                                 </div>
                              </div>
                              <div className="bg-white p-4 rounded-3xl border border-blue-50 flex items-center justify-between group cursor-pointer hover:shadow-md transition-all">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-rose-50 rounded-xl flex-center text-rose-500">
                                       <BookOpen className="w-5 h-5" />
                                    </div>
                                    <div>
                                       <p className="text-xs font-black text-[#1E3A8A]">Homework_Guidelines.pdf</p>
                                       <p className="text-[10px] font-bold text-blue-300">1.4 MB</p>
                                    </div>
                                 </div>
                                 <button className="p-2 text-blue-200 group-hover:text-blue-600"><Plus className="w-5 h-5 rotate-45" /></button>
                              </div>
                           </div>
                        </div>

                        <div className="p-6 border-t border-blue-50 flex items-center gap-4">
                           <button className="w-12 h-12 bg-blue-50 text-blue-400 rounded-2xl flex-center hover:bg-blue-100 transition-all"><Plus className="w-6 h-6" /></button>
                           <div className="flex-1 relative">
                              <input type="text" placeholder="Type your message..." className="w-full bg-blue-50/50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-blue-900 placeholder-blue-300" />
                           </div>
                           <button className="w-12 h-12 bg-[#8A70FF] text-white rounded-2xl flex-center shadow-lg shadow-purple-100 hover:scale-105 transition-all">
                              <ArrowRight className="w-6 h-6" />
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            );
         }
         case 'Rewards': {
            const topEarner = allStudents.sort((a, b) => b.name.length - a.name.length)[0] || { name: 'Vihaan Gupta' };
            const totalPoints = allStudents.reduce((acc, s) => acc + (100 + (s.name.length * 5)), 0);

            return (
               <div className="px-10 py-10 space-y-10 min-h-[calc(100vh-64px)] pb-40 relative">
                  <div className="flex items-center justify-between">
                     <div>
                        <h1 className="text-4xl font-black text-[#1E3A8A] tracking-tight">Rewards</h1>
                        <p className="text-sm font-bold text-blue-300 italic">Motivate students with points and badges.</p>
                     </div>
                     <div className="w-24 h-24">
                        <img src="/mascot.png" className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl" alt="Mascot" />
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

                  {/* KPI Row */}
                  <div className="grid grid-cols-4 gap-6">
                     <RewardKPICard title="Total Points" value={totalPoints} subtitle="+150 this week" bgColor="bg-blue-50/50" textColor="text-blue-600" />
                     <RewardKPICard title="Badges Earned" value="24" subtitle={<Star className="w-4 h-4 text-yellow-400 fill-current" />} bgColor="bg-rose-50/50" textColor="text-rose-600" />
                     <RewardKPICard title="Students Rewarded" value={Math.round(allStudents.length * 0.75)} subtitle={`${75}% of total`} bgColor="bg-emerald-50/50" textColor="text-emerald-600" />
                     <RewardKPICard title="This Week's Top" value={topEarner.name} subtitle={<Trophy className="w-4 h-4 text-amber-400 fill-current" />} bgColor="bg-amber-50/50" textColor="text-amber-600" />
                  </div>

                  <div className="grid grid-cols-12 gap-10">
                     {/* Recent Rewards */}
                     <div className="col-span-7 bg-white rounded-[40px] border border-blue-50 shadow-sm p-10 space-y-8">
                        <h3 className="text-xl font-black text-[#1E3A8A] tracking-tight">Recent Rewards</h3>
                        <div className="space-y-6">
                           {allStudents.slice(0, 4).map((s, idx) => (
                              <div key={idx} className="flex items-center justify-between group">
                                 <div className="flex items-center gap-4">
                                    <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${s.name}`} className="w-12 h-12 rounded-full border-2 border-white shadow-sm bg-white p-0.5" alt={s.name} />
                                    <div>
                                       <p className="text-sm font-black text-[#1E3A8A]">{s.name}</p>
                                       <p className="text-[10px] font-bold text-blue-300 italic">{idx % 2 === 0 ? 'Excellent in Maths Quiz' : 'Great Homework Completion'}</p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-sm font-black text-emerald-500">+{30 + (idx * 10)} points</p>
                                    <p className="text-[9px] font-bold text-blue-200 uppercase tracking-widest">{idx + 1} May</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Top Badges */}
                     <div className="col-span-5 bg-white rounded-[40px] border border-blue-50 shadow-sm p-10 flex flex-col justify-between">
                        <div className="space-y-8">
                           <h3 className="text-xl font-black text-[#1E3A8A] tracking-tight">Top Badges</h3>
                           <div className="space-y-6">
                              <BadgeRow name="Super Star" count="20" icon={<Star className="w-5 h-5 text-yellow-400 fill-current" />} color="bg-yellow-50" />
                              <BadgeRow name="Maths Whiz" count="18" icon={<Zap className="w-5 h-5 text-blue-400 fill-current" />} color="bg-blue-50" />
                              <BadgeRow name="Science Explorer" count="15" icon={<Zap className="w-5 h-5 text-emerald-400 fill-current" />} color="bg-emerald-50" />
                              <BadgeRow name="Helpful Friend" count="12" icon={<Heart className="w-5 h-5 text-rose-400 fill-current" />} color="bg-rose-50" />
                           </div>
                        </div>
                        <button className="w-full bg-blue-50 text-blue-600 py-4 rounded-3xl font-black text-xs hover:bg-blue-100 transition-all mt-10">
                           View All Badges
                        </button>
                     </div>
                  </div>
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
         default:
            return null;
      }
   };

   return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      {/* --- Executive Hub Sidebar --- */}
      <aside className="w-80 bg-white border-r border-slate-100/60 flex flex-col shrink-0 h-screen sticky top-0 overflow-hidden">
         <div className="p-8 pb-4 mb-2 flex flex-col items-center border-b border-slate-100/60">
            <img src="/logo.png" className="w-[85%] h-24 object-contain mix-blend-multiply mb-4" alt="Homework Zone" />

            <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 flex flex-col items-center w-full">
               <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Teacher Code</span>
               <span className="text-sm font-black text-slate-700 tracking-wider">{user?.uid?.slice(0, 6).toUpperCase()}</span>
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
         {activeTab === 'Dashboard' && (
            <header className="h-24 bg-white border-b border-slate-50 flex items-center justify-between px-10 sticky top-0 z-50">
              <div className="flex items-center gap-8">
                 <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Executive Dashboard</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Overview • {activeClassroom?.name || 'All Classes'}</p>
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
                       <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${selectedSubmission.studentName}`} className="w-16 h-16 rounded-full border-4 border-white shadow-md bg-blue-100" alt="Student" />
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

const ClassCard = ({ name, students, bgColor, kidsImg, subjects, onDelete, onView }) => {
  const [showConfirm, setShowConfirm] = useState(false);

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
          <h3 className="text-2xl font-black text-[#1E3A8A]">{name}</h3>
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
