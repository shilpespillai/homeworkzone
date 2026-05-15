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
import { collection, doc, setDoc, getDocs, query, orderBy, deleteDoc } from 'firebase/firestore';

const TeacherDashboard = ({ user, onLogout }) => {
  const [classrooms, setClassrooms] = useState([]);
  const [activeClassroom, setActiveClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState('');
  const [newClassName, setNewClassName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
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
    try {
      const q = query(collection(db, 'teachers', user.uid, 'classrooms'), orderBy('name'));
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClassrooms(list);
      if (list.length > 0 && !activeClassroom) {
        setActiveClassroom(list[0]);
      }
    } catch (err) {
      console.error("Fetch Classrooms Error:", err);
    }
  };

  const handleAddClassroom = async () => {
    if (!newClassName.trim() || !user?.uid) return;
    try {
      const classId = newClassName.trim().toLowerCase().replace(/\s+/g, '-');
      const classRef = doc(db, 'teachers', user.uid, 'classrooms', classId);
      await setDoc(classRef, {
        name: newClassName.trim(),
        createdAt: new Date().toISOString()
      });
      setNewClassName('');
      fetchClassrooms();
      setShowAddClassModal(false);
    } catch (err) {
      console.error("Add Classroom Error:", err);
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

  const handleDeleteStudent = async (e, studentId, studentName) => {
    e.stopPropagation();
    if (!user?.uid || !activeClassroom || !window.confirm(`Remove ${studentName} from your class? 🍎`)) return;
    try {
      const studentRef = doc(db, 'teachers', user.uid, 'classrooms', activeClassroom.id, 'students', studentId);
      await deleteDoc(studentRef);
      setStudents(prev => prev.filter(s => s.id !== studentId));
    } catch (err) {
      console.error("Delete Student Error:", err);
    }
  };

  const renderContent = () => {
      switch (activeTab) {
         case 'Dashboard':
            const dashboardTopEarners = allStudents.sort((a, b) => b.name.length - a.name.length).slice(0, 3);
            const avgScoreTotal = 75 + (allStudents.length % 15);

            return (
               <div className="px-10 py-10 space-y-12 pb-40 relative min-h-[calc(100vh-64px)]">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-6">
                        <div>
                           <h1 className="text-4xl font-black text-[#1E3A8A] tracking-tight">Dashboard</h1>
                           <p className="text-sm font-bold text-blue-300 italic">Welcome back! Here's how your school is sparkling today.</p>
                        </div>
                        <div className="relative">
                           <button 
                             onClick={() => setShowClassDropdown(!showClassDropdown)}
                             className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-blue-100 cursor-pointer hover:bg-blue-50 transition-all shadow-sm"
                           >
                              <span className="text-sm font-bold text-[#1E3A8A]">{activeClassroom?.name || 'Main Class'}</span>
                              <ChevronDown className={`w-4 h-4 text-blue-300 transition-transform ${showClassDropdown ? 'rotate-180' : ''}`} />
                           </button>
                           <AnimatePresence>
                              {showClassDropdown && (
                                 <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-3xl shadow-2xl border border-blue-50 z-[100] overflow-hidden"
                                 >
                                    <div className="p-4 border-b border-blue-50"><span className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Switch Classroom</span></div>
                                    <div className="max-h-60 overflow-y-auto">
                                       {classrooms.map(room => (
                                          <button 
                                             key={room.id}
                                             onClick={() => { setActiveClassroom(room); setShowClassDropdown(false); }}
                                             className={`w-full flex items-center justify-between px-6 py-4 text-left transition-all ${activeClassroom?.id === room.id ? 'bg-blue-50 text-blue-600' : 'text-blue-900 hover:bg-blue-50/50'}`}
                                          >
                                             <span className="text-sm font-bold">{room.name}</span>
                                             {activeClassroom?.id === room.id && <Zap className="w-4 h-4 fill-current" />}
                                          </button>
                                       ))}
                                    </div>
                                 </motion.div>
                              )}
                           </AnimatePresence>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="relative">
                           <input type="text" placeholder="Search students..." className="bg-white border-none rounded-full py-3 px-12 text-sm font-bold text-blue-900 placeholder-blue-300 shadow-sm focus:ring-2 focus:ring-blue-100 transition-all w-72" />
                           <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
                        </div>
                        <button className="w-12 h-12 bg-white rounded-full flex-center text-blue-300 shadow-sm hover:text-blue-600 transition-all"><Bell className="w-5 h-5" /></button>
                     </div>
                  </div>

                  {/* KPI Row */}
                  <div className="grid grid-cols-4 gap-6">
                     <RewardKPICard title="Total Students" value={allStudents.length || students.length} subtitle="+5 this month" bgColor="bg-purple-50/50" textColor="text-purple-600" />
                     <RewardKPICard title="Average Score" value={`${avgScoreTotal}%`} subtitle="+8% this month" bgColor="bg-emerald-50/50" textColor="text-emerald-600" />
                     <RewardKPICard title="Homework Sub" value="85%" subtitle="+10% this month" bgColor="bg-amber-50/50" textColor="text-amber-600" />
                     <RewardKPICard title="Active Now" value={Math.round((allStudents.length || students.length) * 0.9)} subtitle="90% of total" bgColor="bg-blue-50/50" textColor="text-blue-600" />
                  </div>

                  <div className="grid grid-cols-12 gap-10">
                     {/* Performance Chart */}
                     <div className="col-span-8 bg-white rounded-[40px] border border-blue-50 shadow-sm p-10 space-y-8">
                        <div className="flex items-center justify-between">
                           <h3 className="text-xl font-black text-[#1E3A8A] tracking-tight">Class Performance Overview</h3>
                           <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-400" /><span className="text-[10px] font-black text-blue-300 uppercase">English</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#95E2B9]" /><span className="text-[10px] font-black text-blue-300 uppercase">Maths</span></div>
                              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#FFD97D]" /><span className="text-[10px] font-black text-blue-300 uppercase">Science</span></div>
                           </div>
                        </div>

                        <div className="h-64 flex items-end justify-between px-4 pb-8 border-b border-blue-50">
                           {['Grade 2A', 'Grade 3B', 'Grade 4C'].map((grade, i) => (
                              <div key={grade} className="flex flex-col items-center gap-4 flex-1">
                                 <div className="flex items-end gap-2 h-full">
                                    <motion.div initial={{ height: 0 }} animate={{ height: `${70 + i * 5}%` }} className="w-4 bg-purple-400 rounded-t-xl" />
                                    <motion.div initial={{ height: 0 }} animate={{ height: `${85 - i * 10}%` }} className="w-4 bg-[#95E2B9] rounded-t-xl" />
                                    <motion.div initial={{ height: 0 }} animate={{ height: `${75 + i * 2}%` }} className="w-4 bg-[#FFD97D] rounded-t-xl" />
                                 </div>
                                 <span className="text-xs font-black text-blue-300">{grade}</span>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Top Performers */}
                     <div className="col-span-4 bg-white rounded-[40px] border border-blue-50 shadow-sm p-10 flex flex-col justify-between">
                        <div className="space-y-8">
                           <h3 className="text-xl font-black text-[#1E3A8A] tracking-tight">Top Performers</h3>
                           <div className="space-y-6">
                              {(allStudents.length > 0 ? allStudents : students).sort((a, b) => b.name.length - a.name.length).slice(0, 3).map((s, idx) => (
                                 <div key={idx} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                       <span className="text-sm font-black text-blue-200">{idx + 1}.</span>
                                       <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${s.name}`} className="w-10 h-10 rounded-full bg-blue-50" alt={s.name} />
                                       <span className="text-sm font-black text-[#1E3A8A]">{s.name}</span>
                                    </div>
                                    <span className="text-sm font-black text-blue-400">{95 - idx * 3}%</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                        <button className="w-full bg-blue-50 text-blue-600 py-4 rounded-3xl font-black text-xs hover:bg-blue-100 transition-all mt-10">
                           View Full Report
                        </button>
                     </div>
                  </div>

                  {/* Value-Add: AI Quick Insights */}
                  <div className="bg-gradient-to-r from-purple-600 to-[#7C3AED] rounded-[40px] p-10 text-white flex items-center justify-between shadow-2xl shadow-purple-200 overflow-hidden relative">
                     <div className="relative z-10 space-y-2">
                        <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full border border-white/30">
                           <Zap className="w-3 h-3" />
                           <span className="text-[8px] font-black uppercase tracking-widest">AI Hub Insight</span>
                        </div>
                        <h2 className="text-2xl font-black tracking-tight">Grade 3B participation is up by 25% this week! 🚀</h2>
                        <p className="text-xs font-bold opacity-80 italic">Consider sending a "Science Explorer" badge to Vihaan Gupta to maintain momentum.</p>
                     </div>
                     <div className="relative z-10">
                        <button className="bg-white text-purple-600 px-8 py-4 rounded-[24px] font-black text-sm shadow-xl hover:scale-105 transition-all">
                           Action Insight
                        </button>
                     </div>
                     <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
                     <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -ml-10 -mb-10" />
                  </div>

                  {/* Quick Roster & Prep */}
                  <div className="grid grid-cols-12 gap-10 pb-20">
                     <div className="col-span-7 bg-white rounded-[40px] p-10 border border-blue-50 shadow-sm flex flex-col gap-8">
                        <div className="flex items-center justify-between">
                           <h3 className="text-xl font-black text-[#1E3A8A] tracking-tight">Active Class Roster</h3>
                           <button className="text-xs font-black text-blue-400 hover:text-blue-600 transition-all">View All Students</button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           {students.slice(0, 6).map((student, idx) => (
                              <div key={idx} className="bg-blue-50/30 p-4 rounded-3xl border border-blue-50 flex items-center gap-4">
                                 <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${student.name}`} className="w-10 h-10 rounded-full bg-white" alt="Student" />
                                 <div>
                                    <p className="text-sm font-black text-[#1E3A8A]">{student.name}</p>
                                    <p className="text-[10px] font-bold text-blue-300">Level {10 + idx}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                     <div className="col-span-5 bg-white rounded-[40px] p-10 border border-blue-50 shadow-sm flex flex-col justify-between group cursor-pointer hover:shadow-2xl transition-all relative overflow-hidden">
                        <div className="space-y-6 relative z-10">
                           <h3 className="text-xl font-black text-[#1E3A8A] tracking-tight">Teacher Prep</h3>
                           <div className="space-y-4">
                              <div className="p-4 bg-orange-50 rounded-3xl border border-orange-100 flex items-center gap-4">
                                 <div className="w-10 h-10 bg-white rounded-2xl flex-center shadow-sm text-orange-400"><Zap className="w-5 h-5" /></div>
                                 <div><p className="text-xs font-black text-orange-900">Weekly Quiz</p><p className="text-[10px] font-bold text-orange-400">Tuesday, 10 AM</p></div>
                              </div>
                              <div className="p-4 bg-blue-50 rounded-3xl border border-blue-100 flex items-center gap-4">
                                 <div className="w-10 h-10 bg-white rounded-2xl flex-center shadow-sm text-blue-400"><BookOpen className="w-5 h-5" /></div>
                                 <div><p className="text-xs font-black text-blue-900">Homework Drafts</p><p className="text-[10px] font-bold text-blue-400">3 Pending Review</p></div>
                              </div>
                           </div>
                        </div>
                        <button className="bg-[#1E3A8A] text-white w-full py-4 rounded-3xl font-black text-sm shadow-xl mt-10 flex items-center justify-center gap-3">
                           Go to Prep Center <ArrowRight className="w-4 h-4" />
                        </button>
                        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-20 pointer-events-none" />
                     </div>
                  </div>

                  <GrassBorder />
               </div>
            );
         case 'My Classes':
            return (
               <div className="px-10 py-10 space-y-12 relative min-h-[calc(100vh-64px)] pb-40">
                  <div className="flex items-center justify-between">
                     <div>
                        <h1 className="text-4xl font-black text-[#1E3A8A] tracking-tight">My Classes</h1>
                        <p className="text-sm font-bold text-blue-300 italic">Manage your classes and view class details.</p>
                     </div>
                     <div className="flex items-center gap-6">
                        <button className="bg-gradient-to-r from-[#8A70FF] to-[#7C3AED] text-white px-8 py-4 rounded-3xl font-black text-sm shadow-xl shadow-purple-100 flex items-center gap-3 hover:scale-105 transition-all">
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

                  <div className="grid grid-cols-3 gap-8">
                     <ClassCard 
                        name="Grade 2A" 
                        students="20" 
                        bgColor="bg-[#F3E8FF]" 
                        kidsImg="/kids-pair.png"
                        subjects={[
                           { name: 'English', icon: '/ic-homework.png' },
                           { name: 'Maths', icon: '/ic-reports.png' },
                           { name: 'Science', icon: '/ic-students.png' }
                        ]}
                     />
                     <ClassCard 
                        name="Grade 3B" 
                        students="18" 
                        bgColor="bg-[#FFF9DB]" 
                        kidsImg="/kids-pair.png"
                        subjects={[
                           { name: 'English', icon: '/ic-homework.png' },
                           { name: 'Maths', icon: '/ic-reports.png' },
                           { name: 'Science', icon: '/ic-students.png' }
                        ]}
                     />
                     <ClassCard 
                        name="Grade 4C" 
                        students="22" 
                        bgColor="bg-[#E6FCF5]" 
                        kidsImg="/kids-pair.png"
                        subjects={[
                           { name: 'English', icon: '/ic-homework.png' },
                           { name: 'Maths', icon: '/ic-reports.png' },
                           { name: 'Science', icon: '/ic-students.png' }
                        ]}
                     />
                  </div>

                  <div className="border-2 border-dashed border-purple-200 rounded-[40px] p-12 bg-purple-50/20 flex flex-col items-center justify-center text-center space-y-4 group cursor-pointer hover:bg-purple-50/40 transition-all">
                     <div className="w-12 h-12 bg-gradient-to-br from-[#8A70FF] to-[#7C3AED] rounded-full flex-center text-white shadow-lg">
                        <Plus className="w-6 h-6" />
                     </div>
                     <div className="space-y-1">
                        <h3 className="text-xl font-black text-[#1E3A8A]">Create New Class</h3>
                        <p className="text-xs font-bold text-blue-300 italic">Add a new class and start learning!</p>
                     </div>
                  </div>

                  <GrassBorder />
               </div>
            );
         case 'Students':
            const filteredStudents = allStudents.filter(s => {
               const matchesClass = filterClass === 'All Classes' || s.className === filterClass;
               const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase());
               return matchesClass && matchesSearch;
            });

            return (
               <div className="px-10 py-10 space-y-10 min-h-[calc(100vh-64px)] pb-40 relative">
                  <div className="flex items-center justify-between">
                     <div>
                        <h1 className="text-4xl font-black text-[#1E3A8A] tracking-tight">Students</h1>
                        <p className="text-sm font-bold text-blue-300 italic">View and manage your students.</p>
                     </div>
                     <div className="flex items-center gap-6">
                        <button className="bg-[#8A70FF] text-white px-8 py-4 rounded-3xl font-black text-sm shadow-xl shadow-purple-100 flex items-center gap-3 hover:scale-105 transition-all">
                           <Plus className="w-5 h-5" /> Add Student
                        </button>
                        <div className="w-24 h-24">
                           <img src="/dino-reading.png" className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl" alt="Mascot" />
                        </div>
                     </div>
                  </div>

                  {/* Filters */}
                  <div className="flex items-center gap-6">
                     <div className="flex-1 relative">
                        <input 
                           type="text" 
                           placeholder="Search students..."
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="w-full bg-white border border-blue-50 rounded-[24px] py-4 px-14 text-sm font-bold text-blue-900 placeholder-blue-300 shadow-sm focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                     </div>
                     <div className="flex items-center gap-3">
                        <select 
                           value={filterClass}
                           onChange={(e) => setFilterClass(e.target.value)}
                           className="bg-white border border-blue-50 rounded-[24px] py-4 px-8 text-sm font-bold text-blue-900 shadow-sm focus:ring-2 focus:ring-blue-100 outline-none appearance-none cursor-pointer pr-12 min-w-[180px]"
                        >
                           <option>All Classes</option>
                           {classrooms.map(cls => (
                              <option key={cls.id}>{cls.name}</option>
                           ))}
                        </select>
                        <select className="bg-white border border-blue-50 rounded-[24px] py-4 px-8 text-sm font-bold text-blue-900 shadow-sm focus:ring-2 focus:ring-blue-100 outline-none appearance-none cursor-pointer pr-12 min-w-[160px]">
                           <option>All Status</option>
                           <option>Active</option>
                           <option>Inactive</option>
                        </select>
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
                                    <button className="p-2 text-blue-200 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                       <Search className="w-4 h-4" />
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
         case 'Homework':
            return (
               <div className="px-10 py-10 space-y-10 min-h-[calc(100vh-64px)] pb-40 relative overflow-y-auto custom-scrollbar">
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <h1 className="text-4xl font-black text-[#1E3A8A] tracking-tight">Create Homework</h1>
                        <p className="text-sm font-bold text-blue-300 italic">Prepare fun and meaningful homework for your students!</p>
                     </div>
                     <div className="flex items-center gap-6">
                        <div className="bg-white px-6 py-2 rounded-full border border-blue-50 shadow-sm flex items-center gap-2">
                           <Star className="w-4 h-4 text-rose-400 fill-current" />
                           <span className="text-xs font-black text-[#1E3A8A]">Hi, Teacher!</span>
                           <ChevronDown className="w-4 h-4 text-blue-300" />
                        </div>
                        <div className="w-24 h-24 relative">
                           <img src="/dino-reading.png" className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl animate-float" alt="Mascot" />
                        </div>
                     </div>
                  </div>

                  {/* Step 1: Choose Subject */}
                  <div className="space-y-6">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#8A70FF] rounded-full flex-center text-white text-xs font-black">1</div>
                        <h2 className="text-xl font-black text-[#1E3A8A] tracking-tight">Choose Subject</h2>
                     </div>
                     <div className="grid grid-cols-3 gap-8">
                        <SubjectCard 
                           title="English" 
                           description="Reading, writing, grammar and more!" 
                           icon="/ic-homework.png"
                           color="bg-[#FFF9DB]"
                           borderColor="border-[#FFE066]"
                           active={homeworkSubject === 'English'}
                           onClick={() => setHomeworkSubject('English')}
                        />
                        <SubjectCard 
                           title="Maths" 
                           description="Numbers, shapes, patterns and more!" 
                           icon="/ic-reports.png"
                           color="bg-[#E7F5FF]"
                           borderColor="border-[#A5D8FF]"
                           active={homeworkSubject === 'Maths'}
                           onClick={() => setHomeworkSubject('Maths')}
                        />
                        <SubjectCard 
                           title="Science" 
                           description="Discover, explore and learn amazing things!" 
                           icon="/ic-students.png"
                           color="bg-[#EBFBEE]"
                           borderColor="border-[#B2F2BB]"
                           active={homeworkSubject === 'Science'}
                           onClick={() => setHomeworkSubject('Science')}
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-12">
                     {/* Step 2: Homework Details */}
                     <div className="space-y-8">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-[#8A70FF] rounded-full flex-center text-white text-xs font-black">2</div>
                           <h2 className="text-xl font-black text-[#1E3A8A] tracking-tight">Homework Details</h2>
                        </div>
                        
                        <div className="space-y-6">
                           <div className="space-y-2">
                              <label className="text-xs font-black text-[#1E3A8A] ml-2 uppercase tracking-widest">Title</label>
                              <div className="relative">
                                 <input 
                                    type="text" 
                                    placeholder="Enter homework title..."
                                    value={homeworkTitle}
                                    onChange={(e) => setHomeworkTitle(e.target.value)}
                                    className="w-full bg-white border-2 border-blue-50 rounded-[24px] py-4 px-6 text-sm font-bold text-blue-900 placeholder-blue-300 focus:border-[#8A70FF] outline-none transition-all shadow-sm"
                                 />
                                 <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300 rotate-90" />
                              </div>
                           </div>

                           <div className="space-y-2">
                              <label className="text-xs font-black text-[#1E3A8A] ml-2 uppercase tracking-widest">Instructions for Students</label>
                              <div className="relative">
                                 <textarea 
                                    placeholder="Write clear instructions here..."
                                    value={homeworkInstructions}
                                    onChange={(e) => setHomeworkInstructions(e.target.value)}
                                    rows={4}
                                    className="w-full bg-white border-2 border-blue-50 rounded-[32px] py-6 px-8 text-sm font-bold text-blue-900 placeholder-blue-300 focus:border-[#8A70FF] outline-none transition-all shadow-sm resize-none"
                                 />
                                 <div className="absolute right-6 bottom-6 w-8 h-8 bg-purple-50 rounded-xl flex-center">
                                    <BookOpen className="w-4 h-4 text-[#8A70FF]" />
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-2">
                              <label className="text-xs font-black text-[#1E3A8A] ml-2 uppercase tracking-widest">Attach Resources <span className="text-blue-300 capitalize">(optional)</span></label>
                              <div className="border-2 border-dashed border-purple-200 rounded-[32px] bg-purple-50/20 p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-purple-50/40 transition-all">
                                 <div className="w-12 h-12 bg-white rounded-2xl flex-center shadow-sm text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                                    <Plus className="w-6 h-6" />
                                 </div>
                                 <p className="text-xs font-black text-[#8A70FF]">Upload worksheets, images or videos</p>
                                 <p className="text-[10px] font-bold text-blue-300 mt-1">Drag & drop or click to upload</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Step 3: Assign To */}
                     <div className="space-y-8">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-[#8A70FF] rounded-full flex-center text-white text-xs font-black">3</div>
                           <h2 className="text-xl font-black text-[#1E3A8A] tracking-tight">Assign To</h2>
                        </div>

                        <div className="space-y-6 relative">
                           <div className="space-y-2">
                              <label className="text-xs font-black text-[#1E3A8A] ml-2 uppercase tracking-widest">Class</label>
                              <div className="relative">
                                 <select className="w-full bg-white border-2 border-blue-50 rounded-[24px] py-4 px-12 text-sm font-bold text-blue-900 appearance-none outline-none shadow-sm cursor-pointer focus:border-[#8A70FF] transition-all">
                                    <option>Select a class</option>
                                    {classrooms.map(c => <option key={c.id}>{c.name}</option>)}
                                 </select>
                                 <Users className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
                                 <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
                              </div>
                           </div>

                           <div className="space-y-2">
                              <label className="text-xs font-black text-[#1E3A8A] ml-2 uppercase tracking-widest">Due Date</label>
                              <div className="relative">
                                 <input type="text" placeholder="Select due date" className="w-full bg-white border-2 border-blue-50 rounded-[24px] py-4 px-12 text-sm font-bold text-blue-900 outline-none shadow-sm cursor-pointer focus:border-[#8A70FF] transition-all" />
                                 <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
                                 <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
                              </div>
                           </div>

                           <div className="space-y-2">
                              <label className="text-xs font-black text-[#1E3A8A] ml-2 uppercase tracking-widest">Time <span className="text-blue-300 capitalize">(optional)</span></label>
                              <div className="relative">
                                 <input type="text" placeholder="Select time" className="w-full bg-white border-2 border-blue-50 rounded-[24px] py-4 px-12 text-sm font-bold text-blue-900 outline-none shadow-sm cursor-pointer focus:border-[#8A70FF] transition-all" />
                                 <Zap className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400 fill-current" />
                                 <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
                              </div>
                           </div>

                           {/* Illustration Anchor */}
                           <div className="absolute -right-10 top-full mt-4 flex flex-col items-center">
                              <div className="bg-white px-6 py-3 rounded-[24px] shadow-xl border border-rose-50 mb-4 relative">
                                 <p className="text-[10px] font-black text-[#1E3A8A] leading-tight text-center">
                                    You're making<br/>learning awesome! 🌟
                                 </p>
                                 <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-b border-r border-rose-50 rotate-45" />
                                 <Heart className="absolute -top-1 -left-1 w-3 h-3 text-rose-400 fill-current" />
                              </div>
                              <img src="/kids-pair.png" className="w-48 h-48 object-contain mix-blend-multiply drop-shadow-xl" alt="Studying child" />
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Bottom Controls */}
                  <div className="pt-20 flex items-center justify-between border-t border-blue-50 mt-20">
                     <div className="flex items-center gap-6">
                        <div className="flex flex-col gap-2">
                           <label className="text-[10px] font-black text-blue-300 uppercase tracking-widest ml-4">Add Points <span className="capitalize">(optional)</span></label>
                           <div className="flex items-center gap-3">
                              <div className="relative">
                                 <select 
                                    value={homeworkPoints}
                                    onChange={(e) => setHomeworkPoints(Number(e.target.value))}
                                    className="bg-white border-2 border-blue-50 rounded-[20px] py-3 px-10 text-xs font-black text-blue-900 appearance-none outline-none shadow-sm cursor-pointer"
                                 >
                                    <option>10</option>
                                    <option>20</option>
                                    <option>50</option>
                                    <option>100</option>
                                 </select>
                                 <Star className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-400 fill-current" />
                                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-blue-300" />
                              </div>
                              <span className="text-[10px] font-bold text-blue-300 italic">Reward your students!</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex items-center gap-6">
                        <button className="px-10 py-5 bg-[#EBE4FF] text-[#7C3AED] rounded-[24px] font-black text-sm hover:bg-purple-100 transition-all">
                           Save as Draft
                        </button>
                        <button className="px-12 py-5 bg-[#40C057] text-white rounded-[24px] font-black text-sm shadow-xl shadow-green-100 flex items-center gap-3 hover:scale-105 transition-all">
                           Publish Homework <Zap className="w-5 h-5 fill-current" />
                        </button>
                     </div>
                  </div>

                  <GrassBorder />
               </div>
            );
         case 'Messages':
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
         case 'Rewards':
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
         default:
            return null;
      }
   };

  return (
    <div className="flex min-h-screen bg-[#F5F7FA] font-sans">
      {/* --- Executive Sidebar --- */}
      <aside className="w-[300px] bg-[#FDFDFF] border-r border-blue-50 flex flex-col p-6 sticky top-0 h-screen overflow-hidden">
         <div className="mb-10 -mx-6 flex-center">
            <img src="/logo.png" className="w-[85%] h-36 object-contain mix-blend-multiply" alt="Homework Zone" />
         </div>

         <nav className="flex-1 space-y-2">
            <SidebarItem id="Dashboard" label="Dashboard" icon={<LayoutDashboard />} iconColor="text-[#8A70FF]" active={activeTab === 'Dashboard'} onClick={setActiveTab} />
            <SidebarItem id="My Classes" label="My Classes" icon={<img src="/ic-classes.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="My Classes" />} active={activeTab === 'My Classes'} onClick={setActiveTab} />
            <SidebarItem id="Students" label="Students" icon={<img src="/ic-students.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Students" />} active={activeTab === 'Students'} onClick={setActiveTab} />
            <SidebarItem id="Homework" label="Homework" icon={<img src="/ic-homework.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Homework" />} active={activeTab === 'Homework'} onClick={setActiveTab} />
            <SidebarItem id="Messages" label="Messages" icon={<img src="/ic-messages.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Messages" />} active={activeTab === 'Messages'} onClick={setActiveTab} />
            <SidebarItem id="Rewards" label="Rewards" icon={<img src="/ic-rewards.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Rewards" />} active={activeTab === 'Rewards'} onClick={setActiveTab} />
         </nav>

         {/* Mascot Section */}
         <div className="mt-10 relative">
            <div className="bg-amber-50 rounded-[32px] p-6 border border-amber-100 relative mb-8">
               <p className="text-[11px] font-black text-amber-900 leading-relaxed text-center italic">
                  Great teachers make bright futures! ❤️
               </p>
               <img src="/mascot.png" className="w-full h-40 object-contain drop-shadow-xl animate-float mix-blend-multiply" alt="Mascot" />
            </div>
            <div className="h-20 bg-emerald-400 -mx-6 -mb-6 rounded-t-[40px] opacity-20" />
         </div>
      </aside>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-20 bg-[#F9F9FF] relative">
      {/* --- Top Navigation --- */}
      <header className="h-16 bg-white border-b border-blue-50 flex items-center justify-between px-10 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
           <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF9B9B]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFD97D]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#95E2B9]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#8A70FF]" />
           </div>
           <div className="h-8 w-[1px] bg-blue-50 mx-2" />
           <div className="bg-[#F0EEFF] px-4 py-1.5 rounded-xl border border-purple-100 flex items-center gap-2">
              <span className="text-[10px] font-black text-[#8A70FF] uppercase tracking-widest">Your Code:</span>
              <span className="text-sm font-black text-[#1E3A8A] tracking-tighter">{user?.teacherCode || 'HWZ-OFFLINE'}</span>
           </div>
        </div>

        <div className="flex items-center gap-6">
           <button 
             onClick={() => setShowAiSettings(!showAiSettings)}
             className={`text-sm font-bold flex items-center gap-2 px-4 py-1.5 rounded-full transition-all ${showAiSettings ? 'bg-purple-600 text-white shadow-lg' : 'text-purple-500 hover:bg-purple-50'}`}
           >
             <Zap className="w-4 h-4" /> AI Hub
           </button>
           <div className="flex flex-col items-end">
              <span className="text-xs font-black text-[#1E3A8A] tracking-tight">Teacher Portal</span>
              <span className="text-[10px] font-bold text-blue-300 uppercase">Management Hub</span>
           </div>
           <button 
             onClick={onLogout}
             className="w-10 h-10 bg-rose-50 text-rose-500 rounded-full flex-center hover:bg-rose-100 transition-all shadow-sm"
           >
              <LogOut className="w-5 h-5" />
           </button>
        </div>
      </header>

      {/* --- AI Settings Panel --- */}
      <AnimatePresence>
        {showAiSettings && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] bg-white rounded-[40px] border-8 border-purple-100 shadow-2xl z-[100] p-10 space-y-8"
          >
             <div className="flex items-center justify-between">
                <div>
                   <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-black text-blue-900 tracking-tight">AI Power Hub</h2>
                      <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-100">
                         <Lock className="w-3 h-3" />
                         <span className="text-[8px] font-black uppercase tracking-widest">Local Only</span>
                      </div>
                   </div>
                   <p className="text-xs font-bold text-blue-400">Your keys never touch our servers. Choose your preferred engine.</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex-center text-purple-600 shadow-inner">
                   <Zap className="w-6 h-6" />
                </div>
             </div>

             <div className="flex items-center gap-3 bg-blue-50/50 p-2 rounded-[32px] border border-blue-100">
                <AiSelector active={activeAi === 'gemini'} onClick={() => setActiveAi('gemini')} label="Gemini" icon="https://img.icons8.com/color/96/google-logo.png" />
                <AiSelector active={activeAi === 'openai'} onClick={() => setActiveAi('openai')} label="OpenAI" icon="https://img.icons8.com/color/96/chatgpt.png" />
                <AiSelector active={activeAi === 'anthropic'} onClick={() => setActiveAi('anthropic')} label="Claude" icon="https://img.icons8.com/color/96/brain.png" />
             </div>

             <div className="space-y-6 pt-4 min-h-[100px]">
                {activeAi === 'gemini' && (
                  <AiKeyInput 
                    label="Google Gemini" 
                    value={aiKeys.gemini} 
                    onChange={(v) => setAiKeys({...aiKeys, gemini: v})} 
                    placeholder="Enter Gemini API Key..." 
                    icon="https://img.icons8.com/color/96/google-logo.png"
                  />
                )}
                {activeAi === 'openai' && (
                  <AiKeyInput 
                    label="OpenAI (GPT-4)" 
                    value={aiKeys.openai} 
                    onChange={(v) => setAiKeys({...aiKeys, openai: v})} 
                    placeholder="Enter OpenAI API Key..." 
                    icon="https://img.icons8.com/color/96/chatgpt.png"
                  />
                )}
                {activeAi === 'anthropic' && (
                  <AiKeyInput 
                    label="Anthropic (Claude)" 
                    value={aiKeys.anthropic} 
                    onChange={(v) => setAiKeys({...aiKeys, anthropic: v})} 
                    placeholder="Enter Anthropic API Key..." 
                    icon="https://img.icons8.com/color/96/brain.png"
                  />
                )}
             </div>

             <div className="flex items-center gap-4 pt-4">
                <button 
                  onClick={saveAiKeys}
                  className="flex-1 bg-purple-600 text-white py-4 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-purple-200 hover:bg-purple-700 transition-all active:scale-95"
                >
                   Save AI Configuration
                </button>
                <button 
                  onClick={() => setShowAiSettings(false)}
                  className="px-8 py-4 bg-blue-50 text-blue-400 rounded-[24px] font-black text-sm uppercase tracking-widest hover:bg-blue-100 transition-all"
                >
                   Cancel
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {renderContent()}
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

const ClassCard = ({ name, students, bgColor, kidsImg, subjects }) => (
  <div className={`${bgColor} rounded-[40px] p-8 border border-white/50 shadow-sm flex flex-col gap-6 group hover:shadow-xl transition-all`}>
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
        <button className="flex-1 bg-[#8A70FF] text-white py-4 rounded-3xl font-black text-sm shadow-lg shadow-purple-100 hover:scale-[1.02] transition-all">
           View Class
        </button>
        <button className="w-12 h-12 bg-white rounded-2xl flex-center text-blue-300 shadow-sm hover:text-blue-600 transition-all">
           <MoreVertical className="w-5 h-5" />
        </button>
     </div>
  </div>
);

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
