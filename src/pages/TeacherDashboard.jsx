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
            return (
               <>
      {/* --- Dashboard Header --- */}
      <div className="px-10 py-10 flex items-center justify-between bg-[#F9F9FF]">
         <div className="flex items-center gap-6">
            <div>
               <h1 className="text-4xl font-black text-[#1E3A8A] tracking-tight">Dashboard</h1>
               <p className="text-xs font-bold text-blue-300 mt-1 italic">Manage assignments and track class progress</p>
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
                        <div className="p-4 border-b border-blue-50">
                           <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Switch Classroom</span>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                           {classrooms.map(room => (
                              <button 
                                 key={room.id}
                                 onClick={() => {
                                    setActiveClassroom(room);
                                    setShowClassDropdown(false);
                                 }}
                                 className={`w-full flex items-center justify-between px-6 py-4 text-left transition-all ${activeClassroom?.id === room.id ? 'bg-blue-50 text-blue-600' : 'text-blue-900 hover:bg-blue-50/50'}`}
                              >
                                 <span className="text-sm font-bold">{room.name}</span>
                                 {activeClassroom?.id === room.id && <Zap className="w-4 h-4 fill-current" />}
                              </button>
                           ))}
                        </div>
                        <button 
                           onClick={() => {
                              setShowAddClassModal(true);
                              setShowClassDropdown(false);
                           }}
                           className="w-full flex items-center gap-3 px-6 py-4 text-blue-600 bg-blue-50/30 hover:bg-blue-50 transition-all border-t border-blue-50"
                        >
                           <Plus className="w-4 h-4" />
                           <span className="text-sm font-black">New Class</span>
                        </button>
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>
         </div>

         <div className="flex items-center gap-4">
            <div className="relative">
               <input 
                  type="text" 
                  placeholder="Search students..."
                  className="bg-white border-none rounded-full py-3 px-12 text-sm font-bold text-blue-900 placeholder-blue-300 shadow-sm focus:ring-2 focus:ring-blue-100 transition-all w-72"
               />
               <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
            </div>
            <button className="w-12 h-12 bg-white rounded-full flex-center text-blue-300 shadow-sm hover:text-blue-600 transition-all">
               <Bell className="w-5 h-5" />
            </button>
         </div>
      </div>

      {/* --- Main Grid --- */}
      <div className="px-10 grid grid-cols-12 gap-8">
         <div className="col-span-12 grid grid-cols-4 gap-6">
            <KPICard 
               title="Total Students" 
               value={students.length} 
               subtitle="Active in this class" 
               icon={<img src="/ic-students.png" className="w-full h-full object-contain" alt="Students" />}
            />
            <KPICard 
               title="Class Proficiency" 
               value={`${Math.round(students.reduce((acc, s) => acc + (40 + (s.name.length % 50)), 0) / (students.length || 1))}%`} 
               subtitle="Average Score" 
               icon={<img src="/ic-reports.png" className="w-full h-full object-contain" alt="Proficiency" />}
               isAlt
            />
            <KPICard 
               title="Work Completed" 
               value={students.reduce((acc, s) => acc + (20 + (s.name.length % 16)), 0)} 
               subtitle="Total Homeworks" 
               icon={<img src="/ic-homework.png" className="w-full h-full object-contain" alt="Work" />}
            />
            <KPICard 
               title="Top Rewards" 
               value="🏆" 
               subtitle="Badges Earned" 
               icon={<img src="/ic-rewards.png" className="w-full h-full object-contain" alt="Rewards" />}
               isAlt
            />
         </div>

         {/* Class Roster & Prep Section */}
         <div className="col-span-12 grid grid-cols-12 gap-8">
            {/* Student List */}
            <div className="col-span-7 bg-white rounded-[40px] p-10 border border-blue-50 shadow-sm flex flex-col gap-8">
               <div className="flex items-center justify-between">
                  <div>
                     <h3 className="text-xl font-black text-[#1E3A8A] tracking-tight">Student Roster</h3>
                     <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mt-1">Manage your class list</p>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50/50 p-1.5 rounded-2xl border border-blue-50">
                     <input 
                        type="text"
                        placeholder="Quick Add..."
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddStudent()}
                        className="bg-transparent border-none px-4 py-1 text-xs font-bold text-blue-900 placeholder-blue-300 w-32 focus:ring-0"
                     />
                     <button 
                        onClick={handleAddStudent}
                        disabled={isAdding}
                        className="bg-blue-600 text-white px-6 py-2 rounded-2xl text-xs font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                     >
                        {isAdding ? '...' : 'Add Student'}
                     </button>
                  </div>
               </div>
               
               <div className="flex flex-col gap-2 overflow-y-auto max-h-[230px] pr-4 custom-scrollbar">
                   {students.map((student, idx) => (
                     <div key={idx} className="bg-blue-50/30 p-3 rounded-[24px] border border-blue-50 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                        <div className="flex items-center gap-4 flex-1">
                           <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${student.name}`} className="w-8 h-8 rounded-full border-2 border-white shadow-sm bg-white p-0.5" alt="Student" />
                           <div className="flex items-center justify-between flex-1 pr-6">
                              <span className="text-sm font-black text-[#1E3A8A]">{student.name}</span>
                              <div className="flex items-center gap-2 text-[9px] font-bold text-blue-400 bg-white/50 px-3 py-1 rounded-full border border-blue-50">
                                 <Calendar className="w-2.5 h-2.5" />
                                 <span>{student.addedAt ? new Date(student.addedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Now'}</span>
                              </div>
                           </div>
                        </div>
                        <button 
                          onClick={(e) => handleDeleteStudent(e, student.id, student.name)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-blue-200 hover:text-rose-400 hover:bg-rose-50 rounded-xl transition-all"
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                   ))}
                   {students.length === 0 && (
                     <div className="py-12 text-center text-blue-300 italic text-xs font-bold bg-blue-50/50 rounded-[32px] border-2 border-dashed border-blue-100">
                        No students yet. 🍎
                     </div>
                   )}
                </div>
            </div>

            {/* Preparation Card */}
            <div className="col-span-5 bg-white rounded-[40px] p-10 border border-blue-50 shadow-sm flex flex-col justify-between overflow-hidden relative group cursor-pointer hover:shadow-2xl transition-all">
               <div className="space-y-6">
                  <h3 className="text-xl font-black text-[#1E3A8A] tracking-tight">Quick Prepare</h3>
                  <div className="space-y-4">
                     <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-3xl border border-orange-100">
                        <div className="w-10 h-10 bg-white rounded-2xl flex-center shadow-sm">
                           <Zap className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                           <p className="text-xs font-black text-orange-900">Weekly Quiz</p>
                           <p className="text-[10px] font-bold text-orange-400">Next: Tuesday, 10 AM</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-3xl border border-blue-100">
                        <div className="w-10 h-10 bg-white rounded-2xl flex-center shadow-sm">
                           <BookOpen className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                           <p className="text-xs font-black text-blue-900">New Assignment</p>
                           <p className="text-[10px] font-bold text-blue-400">3 Drafted</p>
                        </div>
                     </div>
                  </div>
               </div>
               <button className="mt-8 bg-[#1E3A8A] text-white w-full py-4 rounded-3xl font-black text-sm shadow-xl shadow-blue-100 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group relative z-10">
                  Go to Assignments
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
               </button>
               <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-20 pointer-events-none" />
            </div>
         </div>

         {/* Student Proficiency Table */}
         <div className="col-span-12 space-y-6 pb-12">
            <div className="flex items-center justify-between">
               <div>
                  <h2 className="text-2xl font-black text-[#1E3A8A] tracking-tight">Student Proficiency</h2>
                  <p className="text-xs font-bold text-blue-300 mt-1">Detailed performance metrics per student</p>
               </div>
               <button className="px-6 py-3 bg-white text-blue-600 rounded-2xl font-black text-xs shadow-sm hover:shadow-md transition-all flex items-center gap-2">
                  Export Report <ArrowRight className="w-3 h-3" />
               </button>
            </div>

            <div className="bg-white rounded-[40px] p-10 border border-blue-50 shadow-sm space-y-6">
               <div className="grid grid-cols-12 px-6 text-[10px] font-black text-blue-200 uppercase tracking-widest">
                  <div className="col-span-3">Full Name</div>
                  <div className="col-span-2 text-center">Work Completed</div>
                  <div className="col-span-3 text-center">Average Score</div>
                  <div className="col-span-4 flex justify-around">
                     <span>Needing Attention</span>
                     <span>Working Towards</span>
                     <span>Mastered</span>
                  </div>
               </div>

               <div className="space-y-4">
                   {students.map((student, idx) => {
                     const hash = student.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                     const score = 40 + (hash % 50);
                     const completed = 20 + (hash % 16);
                     const attention = hash % 5 === 0 ? 3 : 1;
                     const working = hash % 3 === 0 ? 5 : 2;
                     const mastered = hash % 2 === 0 ? 8 : 4;

                     return (
                        <ProficiencyRow 
                           key={idx}
                           name={student.name}
                           avatar={`https://api.dicebear.com/7.x/adventurer/svg?seed=${student.name}`}
                           completed={`${completed}/36`}
                           score={`${score}%`}
                           attention={attention}
                           working={working}
                           mastered={mastered}
                           color={idx % 3 === 0 ? 'bg-rose-50/50' : idx % 3 === 1 ? 'bg-amber-50/50' : 'bg-emerald-50/50'}
                        />
                     );
                   })}
                   {students.length === 0 && (
                     <div className="py-20 text-center text-blue-300 italic font-bold">
                        Add students to see proficiency data! 📈
                     </div>
                   )}
               </div>
            </div>
         </div>
      </div>
               </>
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
            return <PlaceholderView title="Students" icon="/ic-students.png" description="Deep-dive into student performance and rosters." />;
         case 'Homework':
            return <PlaceholderView title="Homework" icon="/ic-homework.png" description="Craft and assign illustrative homework tasks." />;
         case 'Reports':
            return <PlaceholderView title="Reports" icon="/ic-reports.png" description="Analyze data-rich class performance reports." />;
         case 'Messages':
            return <PlaceholderView title="Messages" icon="/ic-messages.png" description="Connect with students and parents in real-time." />;
         case 'Rewards':
            return <PlaceholderView title="Rewards" icon="/ic-rewards.png" description="Celebrate achievements with candy-pop badges!" />;
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
            <SidebarItem id="Reports" label="Reports" icon={<img src="/ic-reports.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Reports" />} active={activeTab === 'Reports'} onClick={setActiveTab} />
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

export default TeacherDashboard;
