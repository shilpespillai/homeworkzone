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
  Home
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
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [aiKeys, setAiKeys] = useState({
    gemini: localStorage.getItem('hwz_gemini_key') || '',
    openai: localStorage.getItem('hwz_openai_key') || '',
    anthropic: localStorage.getItem('hwz_anthropic_key') || ''
  });
  const [activeAi, setActiveAi] = useState(localStorage.getItem('hwz_active_ai') || 'gemini');
  const [showAiSettings, setShowAiSettings] = useState(false);

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
    if (!newStudent.trim() || !user?.uid || !activeClassroom) return;
    setIsAdding(true);
    try {
      const studentRef = doc(db, 'teachers', user.uid, 'classrooms', activeClassroom.id, 'students', newStudent.trim().toLowerCase());
      await setDoc(studentRef, {
        name: newStudent.trim(),
        addedAt: new Date().toISOString()
      });
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
  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans pb-20">
      {/* --- Top Navigation --- */}
      <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
           <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
           </div>
           <div className="h-8 w-[1px] bg-slate-200 mx-2" />
           <div className="bg-blue-50 px-4 py-1.5 rounded-xl border border-blue-100 flex items-center gap-2">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Your Code:</span>
              <span className="text-sm font-black text-blue-600 tracking-tighter">{user?.teacherCode || 'HWZ-OFFLINE'}</span>
           </div>
        </div>

        <nav className="flex items-center gap-10">
          <NavLink label="Dashboard" active />
          <NavLink label="Prepare" />
          <NavLink label="Teach" />
          <NavLink label="Assess" />
          <button 
            onClick={() => setShowAiSettings(!showAiSettings)}
            className={`text-sm font-bold flex items-center gap-2 px-4 py-1.5 rounded-full transition-all ${showAiSettings ? 'bg-purple-600 text-white shadow-lg' : 'text-purple-500 hover:bg-purple-50'}`}
          >
            <Zap className="w-4 h-4" /> AI Hub
          </button>
        </nav>

        <div className="flex items-center gap-6">
           <Heart className="w-5 h-5 text-slate-300 cursor-pointer hover:text-rose-500 transition-colors" />
           <div className="relative cursor-pointer">
              <Bell className="w-5 h-5 text-slate-300" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
           </div>
           <div className="flex items-center gap-4 border-l border-slate-100 pl-6">
              <button 
                onClick={onLogout}
                className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-all border border-rose-100 shadow-sm"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                 <img src={user?.photoURL || "https://i.pravatar.cc/150?u=teacher"} alt="Teacher" className="w-full h-full object-cover" />
              </div>
           </div>
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
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">AI Power Hub</h2>
                      <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-100">
                         <Lock className="w-3 h-3" />
                         <span className="text-[8px] font-black uppercase tracking-widest">Local Only</span>
                      </div>
                   </div>
                   <p className="text-xs font-bold text-slate-400">Your keys never touch our servers. Choose your preferred engine.</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex-center text-purple-600 shadow-inner">
                   <Zap className="w-6 h-6" />
                </div>
             </div>

             <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-[32px] border border-slate-100">
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
                  className="px-8 py-4 bg-slate-50 text-slate-400 rounded-[24px] font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all"
                >
                   Cancel
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Dashboard Header --- */}
      <div className="px-10 py-10 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div>
               <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard</h1>
               <p className="text-xs font-bold text-slate-400 mt-1">Manage assignments and track class progress</p>
            </div>
            <div className="relative">
               <button 
                 onClick={() => setShowClassDropdown(!showClassDropdown)}
                 className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all shadow-sm"
               >
                  <span className="text-sm font-bold text-slate-600">{activeClassroom?.name || 'Main Class'}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showClassDropdown ? 'rotate-180' : ''}`} />
               </button>

               <AnimatePresence>
                 {showClassDropdown && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 10 }}
                     className="absolute top-full left-0 mt-3 w-64 bg-white rounded-[32px] shadow-2xl border border-slate-100 p-2 z-[100]"
                   >
                      <div className="max-h-60 overflow-y-auto no-scrollbar py-2 px-2">
                         {classrooms.map(cls => (
                           <button 
                             key={cls.id}
                             onClick={() => { setActiveClassroom(cls); setShowClassDropdown(false); }}
                             className={`w-full text-left px-5 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${activeClassroom?.id === cls.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
                           >
                             {cls.name}
                           </button>
                         ))}
                      </div>
                      <div className="border-t border-slate-50 mt-2 p-2">
                         {isAddingClass ? (
                           <div className="flex items-center gap-2 px-2">
                              <input 
                                autoFocus
                                value={newClassName}
                                onChange={(e) => setNewClassName(e.target.value)}
                                placeholder="New name..."
                                className="flex-1 bg-slate-50 border-none outline-none text-[9px] font-bold p-2 rounded-lg"
                                onKeyDown={(e) => e.key === 'Enter' && handleAddClassroom()}
                              />
                              <button onClick={handleAddClassroom} className="text-blue-600 font-bold text-[10px] p-1">Add</button>
                           </div>
                         ) : (
                           <button 
                             onClick={() => setIsAddingClass(true)}
                             className="w-full py-2 rounded-xl text-[8px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                           >
                             <Plus className="w-3 h-3" />
                             Add Classroom
                           </button>
                         )}
                      </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            <div className="flex items-center -space-x-3 ml-4">
               {students.slice(0, 5).map((s, i) => (
                 <img key={i} src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${s.name}`} className="w-8 h-8 rounded-full border-2 border-white shadow-sm bg-white p-0.5" alt="Student" />
               ))}
               <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-white flex-center shadow-sm cursor-pointer hover:bg-slate-100 transition-all">
                  <ArrowRight className="w-4 h-4 text-slate-400" />
               </div>
            </div>
         </div>

         <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-rose-500 bg-rose-50 px-4 py-2 rounded-full border border-rose-100 font-bold text-xs uppercase tracking-widest">
               <AlertCircle className="w-4 h-4" /> Alerts 0
            </div>
            <div className="p-2 text-slate-300 cursor-pointer hover:text-slate-600">
               <Settings className="w-5 h-5" />
            </div>
         </div>
      </div>

      {/* --- Primary KPI Grid --- */}
      <div className="px-10 grid grid-cols-12 gap-8">
         {/* Overall Score & Work Assigned */}
         <div className="col-span-6 grid grid-cols-2 gap-8">
            <KPICard title="Overall Class Score" value="68%" subtitle="Grade Average 72%" icon="/teacher_kpis.png" />
            <KPICard title="Work Assigned" value="36" subtitle="Grade Average 30%" icon="/teacher_kpis.png" isAlt />
         </div>

         {/* Class Split Blocks */}
         <div className="col-span-6 flex gap-4">
            <StatusBlock count="5" label="25% of class" avg="grade avg 75%" color="bg-[#94d82d]" />
            <StatusBlock count="10" label="50% of class" avg="grade avg 52%" color="bg-[#fab005]" active />
            <StatusBlock count="5" label="25% of class" avg="grade avg 75%" color="bg-[#ff8787]" />
         </div>
      </div>

      <div className="px-10 mt-10 space-y-8">
         <div className="grid grid-cols-12 gap-10">
            {/* Subject Performance */}
            <div className="col-span-7 bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm space-y-10">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <h3 className="text-xl font-black text-slate-900 tracking-tight">Class Roster</h3>
                     <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                        {activeClassroom?.name || 'Main'}
                     </span>
                  </div>
                  <div className="flex items-center gap-4">
                     <input 
                        type="text" 
                        value={newStudent}
                        onChange={(e) => setNewStudent(e.target.value)}
                        placeholder="Add Student Name..." 
                        className="bg-slate-50 border border-slate-100 px-6 py-2 rounded-2xl text-xs font-bold outline-none focus:ring-2 ring-blue-100 transition-all"
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
                    <div key={idx} className="bg-slate-50 p-3 rounded-[24px] border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                       <div className="flex items-center gap-4 flex-1">
                          <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${student.name}`} className="w-8 h-8 rounded-full border-2 border-white shadow-sm bg-white p-0.5" alt="Student" />
                          <div className="flex items-center justify-between flex-1 pr-6">
                             <span className="text-sm font-black text-slate-800">{student.name}</span>
                             <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 bg-white/50 px-3 py-1 rounded-full border border-slate-100">
                                <Calendar className="w-2.5 h-2.5" />
                                <span>{student.addedAt ? new Date(student.addedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Now'}</span>
                             </div>
                          </div>
                       </div>
                       <button 
                         onClick={(e) => handleDeleteStudent(e, student.id, student.name)}
                         className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                       >
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  ))}
                  {students.length === 0 && (
                    <div className="py-12 text-center text-slate-300 italic text-xs font-bold bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100">
                       No students yet. 🍎
                    </div>
                  )}
               </div>
            </div>

            {/* Preparation Card */}
            <div className="col-span-5 bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm flex flex-col justify-between overflow-hidden relative group cursor-pointer hover:shadow-2xl transition-all">
               <div className="space-y-6">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Quick Prepare</h3>
                  <p className="text-xs font-bold text-slate-400">Design your next numeracy challenge in seconds using AI assistance.</p>
               </div>
               <div className="mt-8 bg-blue-50 p-8 rounded-[32px] border border-blue-100 flex items-center justify-between group-hover:bg-blue-600 transition-all">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white rounded-2xl flex-center shadow-sm group-hover:scale-110 transition-transform"><BookOpen className="w-6 h-6 text-blue-600" /></div>
                     <span className="text-sm font-black text-blue-700 group-hover:text-white">New Numeracy Test</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-400 group-hover:text-white" />
               </div>
            </div>
         </div>

         <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Students Proficiency</h3>
            <div className="flex items-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <span className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"><div className="w-2 h-2 rounded-full border-2 border-slate-300" /> Learning Objectives</span>
               <span className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">All Strands <ChevronDown className="w-3 h-3" /></span>
            </div>
         </div>

         <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm space-y-6">
            <div className="grid grid-cols-12 px-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">
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
               <ProficiencyRow 
                 name="Sabine Klein" 
                 avatar="https://i.pravatar.cc/150?u=sabine" 
                 completed="33/36" 
                 score={23} 
                 attention={45} 
                 working={8} 
                 mastered={7} 
                 color="bg-rose-50"
               />
               <ProficiencyRow 
                 name="Dante Podenzana" 
                 avatar="https://i.pravatar.cc/150?u=dante" 
                 completed="31/36" 
                 score={53} 
                 attention={6} 
                 working={35} 
                 mastered={19} 
                 color="bg-amber-50"
               />
               <ProficiencyRow 
                 name="Susan Chan" 
                 avatar="https://i.pravatar.cc/150?u=susan" 
                 completed="27/36" 
                 score={82} 
                 attention={0} 
                 working={14} 
                 mastered={45} 
                 color="bg-emerald-50"
               />
            </div>
         </div>
      </div>

      </div>
   );
};

const NavLink = ({ label, active }) => (
  <span className={`text-sm font-bold cursor-pointer transition-all ${active ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
    {label}
  </span>
);

const KPICard = ({ title, value, subtitle, icon, isAlt }) => (
  <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all relative overflow-hidden h-52">
    <div className="space-y-2 relative z-10">
       <h4 className="text-sm font-black text-slate-900 tracking-tight">{title}</h4>
       <p className="text-5xl font-black text-slate-900 tracking-tighter">{value}</p>
       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{subtitle}</p>
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
        <img src="https://i.pravatar.cc/150" className="w-8 h-8 rounded-full opacity-80" alt="Avatar" />
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
        <img src={avatar} className="w-10 h-10 rounded-full border-2 border-white" alt={name} />
        <span className="text-sm font-black text-slate-800">{name}</span>
     </div>
     
     <div className="col-span-2 text-center text-sm font-bold text-slate-500">
        {completed}
     </div>

     <div className="col-span-3 flex-center px-10">
        <div className="w-full h-10 bg-white/50 rounded-full overflow-hidden flex items-center p-1 border border-white">
           <div className={`h-full rounded-full ${score > 70 ? 'bg-emerald-400' : score > 40 ? 'bg-amber-400' : 'bg-rose-400'}`} style={{ width: `${score}%` }} />
           <span className="ml-4 text-xs font-black text-slate-800">{score}%</span>
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
    className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-[24px] border-4 transition-all ${active ? 'bg-white border-purple-100 shadow-md' : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-100/50'}`}
  >
     <img src={icon} className={`w-5 h-5 ${active ? 'opacity-100' : 'opacity-40 grayscale'} transition-all`} alt={label} />
     <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-slate-900' : 'text-slate-400'}`}>{label}</span>
  </button>
);

const AiKeyInput = ({ label, value, onChange, placeholder, icon }) => (
  <div className="space-y-2">
     <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.1em] block ml-4">{label}</label>
     <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-50 rounded-lg flex-center border border-slate-100 group-focus-within:border-purple-200 transition-all">
           <img src={icon} className="w-5 h-5" alt={label} />
        </div>
        <input 
          type="password" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-50 border-4 border-slate-50 pl-16 pr-6 py-4 rounded-[24px] text-xs font-bold outline-none focus:bg-white focus:border-purple-100 transition-all placeholder:text-slate-300"
        />
     </div>
  </div>
);

export default TeacherDashboard;
