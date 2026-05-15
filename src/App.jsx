import React, { useState, useEffect } from 'react';
import Lottie from "lottie-react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Library, 
  ClipboardList, 
  MessageSquare, 
  Settings, 
  LogOut,
  Search,
  Bell,
  Sun,
  ChevronRight,
  Play,
  Award,
  Sparkles,
  Rocket,
  MoreVertical,
  CloudSun,
  Target,
  GraduationCap,
  HelpCircle,
  TrendingUp,
  BrainCircuit,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Star,
  FileText,
  Calendar,
  Share2,
  Zap,
  Clock,
  Flame,
  Trophy,
  Plus,
  Heart,
  Home,
  Users,
  User
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentQuiz from './pages/StudentQuiz';
import { auth, db, googleProvider } from './firebase';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

// Helper to generate a clean, boutique 6-digit code
const generateTeacherCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No confusing O/0 or I/1
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// --- Activity Data ---
const ACTIVITY_DATA = [
  { day: 'Mon', value: 40 },
  { day: 'Tue', value: 60 },
  { day: 'Wed', value: 80 },
  { day: 'Thu', value: 45 },
  { day: 'Fri', value: 90 },
  { day: 'Sat', value: 30 },
  { day: 'Sun', value: 50 },
];

// --- Custom Blob Chart Component ---
const BlobChart = ({ value }) => (
  <div className="relative w-48 h-48 flex-center">
    <svg viewBox="0 0 200 200" className="absolute w-full h-full opacity-60 filter blur-xl">
       <circle cx="80" cy="80" r="50" fill="#4f46e5" />
       <circle cx="120" cy="90" r="45" fill="#ec4899" />
       <circle cx="100" cy="130" r="55" fill="#a855f7" />
    </svg>
    <div className="relative z-10 w-32 h-32 rounded-full bg-white/80 backdrop-blur-md shadow-2xl flex-center border border-white/50">
       <span className="text-4xl font-black text-slate-900">{value}%</span>
    </div>
  </div>
);

// --- Student Dashboard (Equip Final Redesign) ---
const StudentDashboard = ({ teacher, studentName, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('My Progress');
  const [activeNav, setActiveNav] = useState('My Profile');

  return (
    <div className="flex min-h-screen bg-[#F9F9FF] font-sans overflow-x-hidden">
      {/* --- Sidebar (High Fidelity) --- */}
      <aside className="w-72 bg-[#FDFDFF] border-r border-blue-50 flex flex-col shrink-0 sticky top-0 h-screen z-50">
        <div className="mb-6 -mx-2 flex-center pt-8">
           <img src="/logo.png" className="w-[85%] h-36 object-contain mix-blend-multiply" alt="Homework Zone" />
        </div>

        <nav className="flex-1 px-4 space-y-1">
           <SidebarNavItem icon={<LayoutDashboard />} label="Dashboard" active={activeNav === 'Dashboard'} onClick={() => setActiveNav('Dashboard')} />
           <SidebarNavItem icon={<img src="/ic-classes.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Classes" />} label="My Classes" active={activeNav === 'My Classes'} onClick={() => setActiveNav('My Classes')} />
           <SidebarNavItem icon={<img src="/ic-homework.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Homework" />} label="My Homework" active={activeNav === 'My Homework'} onClick={() => setActiveNav('My Homework')} />
           <SidebarNavItem icon={<Zap className="w-6 h-6" />} label="My Learning" active={activeNav === 'My Learning'} onClick={() => setActiveNav('My Learning')} />
           <SidebarNavItem icon={<User className="w-4 h-4" />} label="My Profile" active={activeNav === 'My Profile'} onClick={() => setActiveNav('My Profile')} />
           <SidebarNavItem icon={<img src="/ic-messages.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Messages" />} label="My Messages" active={activeNav === 'My Messages'} onClick={() => setActiveNav('My Messages')} />
           <SidebarNavItem icon={<img src="/ic-rewards.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Rewards" />} label="My Rewards" active={activeNav === 'My Rewards'} onClick={() => setActiveNav('My Rewards')} />
        </nav>

        {/* Mascot Bottom */}
        <div className="p-6">
           <div className="bg-amber-50 rounded-[32px] p-8 relative group overflow-hidden border border-amber-100">
              <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full opacity-40" />
              <p className="text-xs font-black text-amber-900 leading-tight text-center relative z-10 italic">
                 Great learning<br/>starts with fun! 🌟
              </p>
              <div className="mt-6 flex-center">
                 <img src="/mascot.png" className="w-40 h-40 object-contain animate-float mix-blend-multiply drop-shadow-2xl" alt="Mascot" />
              </div>
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-amber-200/20 rounded-full blur-2xl" />
           </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col min-w-0">
        <nav className="max-w-[95%] mx-auto w-full px-6 py-8 flex items-center justify-between">
           <div className="flex items-center gap-8">
              <div className="flex flex-col">
                 <h1 className="text-4xl font-black text-[#1E293B] tracking-tighter leading-none">
                   Hello, <span className="text-[#8A70FF]">{studentName || 'Student'}</span>!
                 </h1>
                 <p className="text-xl font-black text-[#475569] tracking-tight mt-1">Ready to learn?</p>
              </div>
              <div className="w-24 h-24 relative -mt-4">
                 <img src="/assets/owl_mascot.png" className="w-full h-full object-contain drop-shadow-xl animate-float" alt="Owl Mascot" />
              </div>
           </div>

           <div className="flex items-center gap-8">
              <div className="flex items-center gap-4">
                 <button className="w-12 h-12 bg-white rounded-2xl flex-center shadow-sm border border-slate-100 hover:scale-110 transition-all">
                    <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${studentName || 'student'}`} className="w-8 h-8" alt="Profile" />
                 </button>
                 <button className="w-12 h-12 bg-white rounded-2xl flex-center shadow-sm border border-slate-100 text-[#8A70FF] hover:scale-110 transition-all">
                    <Plus className="w-6 h-6" />
                 </button>
                 <button className="w-12 h-12 bg-white rounded-2xl flex-center shadow-sm border border-slate-100 text-[#8A70FF] hover:scale-110 transition-all">
                    <Bell className="w-6 h-6" />
                 </button>
              </div>
              <div className="flex items-center gap-1 border-b-4 border-[#8A70FF] pb-2 cursor-pointer">
                 <span className="text-xl font-black text-[#1E293B]">{activeTab}</span>
              </div>
              <button onClick={onLogout} className="flex items-center gap-2 bg-rose-50 px-6 py-3 rounded-2xl text-xs font-black text-rose-600 hover:bg-rose-100 transition-all border border-rose-100 shadow-sm"><LogOut className="w-4 h-4" /> Sign Out</button>
           </div>
        </nav>

        {/* --- Dashboard Grid --- */}
        <main className="max-w-[95%] mx-auto w-full px-6 grid grid-cols-12 gap-10 pb-40">
           
           {/* Row 1 Left: To-Do List */}
           <div className="col-span-12 lg:col-span-5 bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm space-y-8">
              <h2 className="text-2xl font-black text-[#1E293B]">To-Do List</h2>
              <div className="space-y-4">
                 <TodoCard 
                    title="Homework: Grade 58" 
                    subtitle="English - Submit by May 5" 
                    btnText="Start Homework" 
                    icon={<BookOpen className="w-6 h-6 text-purple-400" />}
                    color="bg-purple-50"
                    btnColor="bg-[#8A70FF]"
                 />
                 <TodoCard 
                    title="Upcoming Test" 
                    subtitle="Science - Planets, May 7" 
                    btnText="Prepare" 
                    icon={<Target className="w-6 h-6 text-blue-400" />}
                    color="bg-blue-50"
                    btnColor="bg-blue-500"
                 />
                 <TodoCard 
                    title="Review" 
                    subtitle="Teacher Feedback on Maths Quiz" 
                    btnText="View Feedback" 
                    icon={<MessageSquare className="w-6 h-6 text-amber-400" />}
                    color="bg-amber-50"
                    btnColor="bg-amber-500"
                 />
              </div>
           </div>

           {/* Row 1 Right: My Learning Path */}
           <div className="col-span-12 lg:col-span-7 bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm space-y-8 relative overflow-hidden">
              <h2 className="text-2xl font-black text-[#1E293B]">My Learning Path</h2>
              <div className="flex items-center gap-6 relative">
                 <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0" />
                 <LearningPathCard 
                    title="English Grammar 1" 
                    progress={10} 
                    stars={3} 
                    color="bg-purple-50" 
                    active 
                 />
                 <LearningPathCard 
                    title="Maths: Division Basics" 
                    progress={50} 
                    stars={3} 
                    color="bg-amber-50" 
                 />
                 <LearningPathCard 
                    title="Science: Plants" 
                    progress={50} 
                    stars={4} 
                    color="bg-emerald-50" 
                 />
              </div>
           </div>

           {/* Row 2 Left: Recent Achievements */}
           <div className="col-span-12 lg:col-span-8 bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm space-y-10">
              <h2 className="text-2xl font-black text-[#1E293B]">My Recent Achievements</h2>
              <div className="grid grid-cols-12 gap-8 items-center">
                 <div className="col-span-7 grid grid-cols-4 gap-4">
                    <AchievementBadge icon="🐝" label="Spelling Bee" color="bg-amber-50" />
                    <AchievementBadge icon="🧮" label="Math Wizard" color="bg-blue-50" />
                    <AchievementBadge icon="⭐" label="Star Reader" color="bg-purple-50" />
                    <AchievementBadge icon="🦁" label="Helpful" color="bg-emerald-50" />
                    <div className="col-span-4 pt-4">
                       <button className="bg-[#8A70FF] text-white px-8 py-3 rounded-2xl font-black text-xs shadow-lg hover:scale-105 transition-all">View All Badges</button>
                    </div>
                 </div>
                 <div className="col-span-5 flex gap-4">
                    <RankCard rank={1} name="Virsan Shanna" detail="Grade 1" avatar="https://api.dicebear.com/7.x/adventurer/svg?seed=rank1" />
                    <RankCard rank={3} name="Vimen Single" detail="Leader" avatar="https://api.dicebear.com/7.x/adventurer/svg?seed=rank3" isAlt />
                 </div>
              </div>
           </div>

           {/* Row 2 Right: Class Standings */}
           <div className="col-span-12 lg:col-span-4 bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm space-y-8">
              <h2 className="text-2xl font-black text-[#1E293B]">Class Standings</h2>
              <div className="space-y-6">
                 <StandingRow rank={1} name="Vhsen Oopla" students={64} progress="+5" color="text-emerald-500" avatar="https://api.dicebear.com/7.x/adventurer/svg?seed=vhsen" />
                 <StandingRow rank={2} name="Aronya Bhanna" students={64} progress="+20" color="text-emerald-500" avatar="https://api.dicebear.com/7.x/adventurer/svg?seed=aronya" />
                 <StandingRow rank={3} name="Brohin Hetel" students={64} progress="-2" color="text-rose-500" avatar="https://api.dicebear.com/7.x/adventurer/svg?seed=brohin" />
              </div>
           </div>

           {/* Row 3 Left: Calendar */}
           <div className="col-span-12 lg:col-span-8 bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm space-y-8">
              <div className="grid grid-cols-7 text-center border-b border-slate-50 pb-4">
                 {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <span key={day} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{day}</span>
                 ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                 {[...Array(35)].map((_, i) => {
                    const day = (i % 31) + 1;
                    return (
                       <div key={i} className={`h-24 border border-slate-50 rounded-2xl p-2 relative group hover:bg-slate-50 transition-all ${i === 3 ? 'bg-indigo-50/50' : ''}`}>
                          <span className="text-xs font-bold text-slate-400">{day}</span>
                          {i === 3 && <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-orange-400 border-2 border-white" />}
                          {i === 11 && <div className="mt-2 bg-rose-50 text-rose-500 text-[8px] font-black p-1 rounded-lg">Due Test</div>}
                          {i === 18 && <div className="mt-2 bg-purple-50 text-purple-500 text-[8px] font-black p-1 rounded-lg">Due HW</div>}
                       </div>
                    );
                 })}
              </div>
           </div>

           {/* Row 3 Right: Teacher Feed */}
           <div className="col-span-12 lg:col-span-4 bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm space-y-8">
              <h2 className="text-2xl font-black text-[#1E293B]">Teacher Feed</h2>
              <div className="space-y-8">
                 <FeedPost 
                    author="Asrey Summum" 
                    time="1 day ago" 
                    content="Today we explored the solar system! Don't forget to check your homework assignments." 
                    avatar="https://api.dicebear.com/7.x/adventurer/svg?seed=asrey"
                 />
                 <FeedPost 
                    author="Ngeo Raghi" 
                    time="2 days ago" 
                    content="Great job on the Science quiz yesterday! Keep up the amazing work." 
                    avatar="https://api.dicebear.com/7.x/adventurer/svg?seed=ngeo"
                 />
              </div>
           </div>

        </main>

        <GrassBorder />
      </div>
    </div>
  );
};

const SidebarNavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-8 py-4 cursor-pointer transition-all border-l-4 group ${
      active 
        ? 'bg-[#EBE4FF] text-[#7C3AED] border-[#8A70FF] font-black shadow-sm shadow-purple-50' 
        : 'text-[#A098AE] border-transparent hover:text-slate-600 hover:bg-slate-50'
    }`}
  >
    <div className={`w-6 h-6 flex-center transition-transform group-hover:scale-125 ${active ? 'text-[#7C3AED]' : 'text-purple-400'}`}>
       {React.isValidElement(icon) && icon.type === 'img' ? icon : React.cloneElement(icon, { size: 20, strokeWidth: 3, fill: "currentColor" })}
    </div>
    <span className="text-sm tracking-tight">{label}</span>
  </button>
);

const TodoCard = ({ title, subtitle, btnText, icon, color, btnColor }) => (
   <div className={`${color} p-6 rounded-[32px] flex items-center justify-between group transition-all hover:scale-[1.02] border border-white/50 shadow-sm`}>
      <div className="flex items-center gap-6">
         <div className="w-14 h-14 bg-white rounded-2xl flex-center shadow-sm group-hover:scale-110 transition-transform">{icon}</div>
         <div className="space-y-1">
            <p className="text-base font-black text-[#1E293B]">{title}</p>
            <p className="text-[10px] font-bold text-slate-400 italic">{subtitle}</p>
         </div>
      </div>
      <button className={`${btnColor} text-white px-6 py-3 rounded-2xl font-black text-xs shadow-lg hover:brightness-110 transition-all`}>{btnText}</button>
   </div>
);

const LearningPathCard = ({ title, progress, stars, color, active }) => (
   <div className={`flex-1 ${color} p-6 rounded-[32px] border-4 ${active ? 'border-[#8A70FF]' : 'border-white'} shadow-xl z-10 space-y-6 relative group hover:-translate-y-2 transition-all`}>
      <div className="absolute -top-4 -left-4 w-10 h-10 bg-white rounded-full flex-center shadow-md text-[#FBBF24]">
         <Star className="w-6 h-6 fill-current" />
      </div>
      <div className="space-y-2">
         <p className="text-sm font-black text-[#1E293B] leading-tight h-10 overflow-hidden">{title}</p>
         <div className="h-1.5 w-full bg-white/50 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${progress}%` }} />
         </div>
      </div>
      <div className="flex items-center justify-between">
         <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
               <Star key={i} className={`w-3 h-3 ${i < stars ? 'text-[#FBBF24] fill-current' : 'text-slate-200'}`} />
            ))}
         </div>
         <span className="text-[10px] font-black text-slate-400">{progress}%</span>
      </div>
      <button className="w-full bg-[#8A70FF] text-white py-2 rounded-xl font-black text-[10px] shadow-md">Resume Learning</button>
   </div>
);

const AchievementBadge = ({ icon, label, color }) => (
   <div className="flex flex-col items-center gap-2 group cursor-pointer">
      <div className={`w-14 h-14 ${color} rounded-full flex-center text-2xl shadow-sm border-2 border-white group-hover:scale-110 transition-transform`}>{icon}</div>
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">{label}</span>
   </div>
);

const RankCard = ({ rank, name, detail, avatar, isAlt }) => (
   <div className={`flex-1 ${isAlt ? 'bg-amber-50' : 'bg-blue-50'} p-6 rounded-[32px] border border-white flex flex-col items-center text-center gap-4 relative overflow-hidden group hover:scale-105 transition-all shadow-sm`}>
      <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/50 rounded-full flex-center font-black text-2xl text-[#1E293B]/20">{rank}</div>
      <img src={avatar} className="w-16 h-16 rounded-full border-2 border-white bg-white p-1" alt={name} />
      <div>
         <p className="text-xs font-black text-[#1E293B]">{name}</p>
         <p className="text-[10px] font-bold text-slate-400">{detail}</p>
      </div>
      <Trophy className={`w-5 h-5 ${isAlt ? 'text-amber-400' : 'text-blue-400'}`} />
   </div>
);

const StandingRow = ({ rank, name, students, progress, color, avatar }) => (
   <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-100">
      <div className="flex items-center gap-4">
         <span className="text-lg font-black text-[#1E293B] w-6">{rank}</span>
         <img src={avatar} className="w-10 h-10 rounded-full border-2 border-white bg-slate-50" alt={name} />
         <div>
            <p className="text-sm font-black text-[#1E293B]">{name}</p>
            <p className="text-[9px] font-bold text-slate-400">Total {students} students</p>
         </div>
      </div>
      <span className={`text-[10px] font-black ${color}`}>{progress} pass</span>
   </div>
);

const FeedPost = ({ author, time, content, avatar }) => (
   <div className="space-y-4 group">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <img src={avatar} className="w-10 h-10 rounded-full border-2 border-white bg-slate-50" alt={author} />
            <div>
               <p className="text-sm font-black text-[#1E293B]">{author}</p>
               <p className="text-[10px] font-bold text-slate-300 italic">{time}</p>
            </div>
         </div>
         <MoreVertical className="w-4 h-4 text-slate-300" />
      </div>
      <p className="text-xs font-bold text-slate-600 leading-relaxed bg-slate-50/50 p-6 rounded-[28px] border border-slate-50 group-hover:bg-white group-hover:shadow-md transition-all">{content}</p>
      <div className="flex items-center gap-4 ml-6">
         <div className="flex items-center gap-1.5 text-slate-300"><MessageSquare className="w-3.5 h-3.5" /> <span className="text-[10px] font-black">1</span></div>
         <div className="flex items-center gap-1.5 text-slate-300"><Heart className="w-3.5 h-3.5" /> <span className="text-[10px] font-black">2</span></div>
      </div>
   </div>
);

const EquipSidebarItem = ({ icon, label, active }) => (
  <div className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl cursor-pointer transition-all border-2 ${active ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border-blue-100 font-bold' : 'text-slate-400 border-transparent hover:bg-slate-50 hover:text-slate-800'}`}>
    {icon}
    <span className="text-sm tracking-tight">{label}</span>
  </div>
);

const MetricCard = ({ label, value, trend, icon, active }) => (
  <div className={`bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-4 hover:shadow-xl transition-all group cursor-pointer ${active ? 'ring-2 ring-emerald-100' : ''}`}>
    <div className="flex items-center justify-between">
       <div className="w-12 h-12 bg-slate-50 rounded-2xl flex-center shadow-inner group-hover:scale-110 transition-transform">{icon}</div>
       {trend && <span className="text-emerald-500 text-[10px] font-black bg-emerald-50 px-2 py-1 rounded-lg">{trend}</span>}
    </div>
    <div className="space-y-1">
       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
       <p className="text-3xl font-black text-slate-900">{value}</p>
    </div>
  </div>
);

const SubjectBar = ({ label, value, color }) => (
  <div className="space-y-2">
     <div className="flex justify-between items-center">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <span className="text-xs font-black text-slate-900">{value}%</span>
     </div>
     <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner">
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} className={`h-full rounded-full ${color}`} />
     </div>
  </div>
);

const ScoreRow = ({ label, score, icon }) => (
  <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-50 flex items-center justify-between hover:bg-white hover:shadow-md transition-all cursor-pointer">
     <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-white rounded-lg flex-center shadow-sm">{icon}</div>
        <p className="text-xs font-bold text-slate-700">{label}</p>
     </div>
     <p className="text-xs font-black text-blue-600">{score}</p>
  </div>
);

const LegendItem = ({ label, value, color }) => (
  <div className="flex items-center gap-2">
     <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
     <span className="text-[10px] font-bold text-slate-400">{label} {value}</span>
  </div>
);

// --- Landing Page (Redesigned from Reference) ---
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#E0F2FE] font-sans overflow-x-hidden pb-20">
      {/* --- Playful Top Header --- */}
      <header className="max-w-[95%] mx-auto px-6 py-10 flex items-center justify-between relative z-20">
         <div className="flex items-center gap-8">
            {/* Owl Mascot sticker */}
            <motion.img 
              initial={{ rotate: -5 }}
              animate={{ rotate: 5 }}
              transition={{ repeat: Infinity, duration: 3, repeatType: 'reverse' }}
              src="/assets/owl_mascot.png" 
              className="w-32 h-32 drop-shadow-2xl" 
              alt="Owl Mascot" 
            />
            <div className="flex flex-col">
               <h1 className="text-5xl md:text-7xl font-black text-[#1E293B] tracking-tighter leading-none flex items-center gap-2">
                 HOMEWORK <br /> ZONE
               </h1>
            </div>
         </div>

         {/* Playful Header Icons */}
         <div className="hidden md:flex items-center gap-10">
            <div className="w-20 h-20 bg-white rounded-3xl border-4 border-[#334155] flex-center shadow-[6px_6px_0_0_#334155] rotate-3 hover:rotate-0 transition-all cursor-pointer">
               <img src="https://img.icons8.com/color/96/pencil.png" className="w-12 h-12" alt="Pencil" />
            </div>
            <div className="w-20 h-20 bg-white rounded-3xl border-4 border-[#334155] flex-center shadow-[6px_6px_0_0_#334155] -rotate-6 hover:rotate-0 transition-all cursor-pointer">
               <img src="https://img.icons8.com/color/96/star.png" className="w-12 h-12" alt="Star" />
            </div>
            <div className="w-20 h-20 bg-white rounded-3xl border-4 border-[#334155] flex-center shadow-[6px_6px_0_0_#334155] rotate-6 hover:rotate-0 transition-all cursor-pointer">
               <img src="https://img.icons8.com/color/96/alarm-clock.png" className="w-12 h-12" alt="Clock" />
            </div>
            <div className="flex flex-col gap-2 ml-6">
               <div className="flex gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`w-6 h-10 ${['bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-pink-400'][i]} rounded-b-xl border-4 border-[#334155] shadow-md`} />
                  ))}
               </div>
            </div>
         </div>
      </header>

      {/* --- Main Hero Banner Area --- */}
      <section className="max-w-[95%] mx-auto px-6 mt-8">
         <div className="relative bg-white rounded-[60px] border-[12px] border-[#334155] shadow-[0_30px_0_0_#334155] overflow-hidden group">
            {/* The Kids & School Illustration */}
            <div className="relative h-[400px] md:h-[600px]">
               <img src="/assets/hero_banner.png" className="w-full h-full object-cover" alt="Homework Zone Adventure" />
               
               {/* Welcome Banner Overlay */}
               <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[90%] md:w-auto text-center">
                  <div className="bg-[#FBBF24] border-[6px] border-[#334155] px-16 py-8 rounded-[40px] shadow-[8px_8px_0_0_#334155] transform -rotate-1">
                     <h2 className="text-4xl md:text-6xl font-black text-[#1E293B] uppercase tracking-tight leading-tight">
                        Welcome to your Homework Zone!
                     </h2>
                     <p className="text-sm md:text-xl font-black text-[#475569] uppercase tracking-[0.2em] mt-2">
                        Fun places for learning & adventure!
                     </p>
                  </div>
               </div>

               {/* Start Homework Button */}
               <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
                  <button 
                    onClick={() => navigate('/login/student')}
                    className="bg-[#38BDF8] hover:bg-[#0EA5E9] text-white border-[6px] border-[#334155] px-20 py-8 rounded-[40px] font-black text-3xl md:text-5xl uppercase tracking-tighter shadow-[0_12px_0_0_#334155] active:translate-y-2 active:shadow-none transition-all"
                  >
                    Start Homework!
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* --- Action Cards Grid --- */}
      <section className="max-w-[95%] mx-auto px-6 mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <ZoneCard 
            title="Daily Missions" 
            subtitle="Today's Homework!"
            image="/assets/card_daily_sticker.png"
            color="bg-[#BFDBFE]"
            btnColor="bg-[#F87171]"
            btnText="GO!"
            onClick={() => navigate('/login/student')}
         />
         <ZoneCard 
            title="Fun Games" 
            subtitle="Play & Learn!"
            image="/assets/card_games_sticker.png"
            color="bg-[#FEF9C3]"
            btnColor="bg-[#FB923C]"
            btnText="PLAY!"
            onClick={() => navigate('/login/student')}
         />
         <ZoneCard 
            title="Library" 
            subtitle="Read Stories!"
            image="/assets/card_library_sticker.png"
            color="bg-[#DCFCE7]"
            btnColor="bg-[#4ADE80]"
            btnText="GO!"
            onClick={() => navigate('/login/student')}
         />
         <ZoneCard 
            title="My Profile" 
            subtitle="Track Progress!"
            image="/assets/card_profile_sticker.png"
            color="bg-[#DBEAFE]"
            btnColor="bg-[#60A5FA]"
            btnText="GO!"
            onClick={() => navigate('/login/student')}
         />
      </section>

      {/* --- Simple Footer Icons --- */}
      <footer className="max-w-[95%] mx-auto px-6 mt-32 flex items-center justify-between py-10 border-t-8 border-white/20">
         <div className="flex items-center gap-10">
            <FooterBtn icon="https://img.icons8.com/fluency/144/help.png" label="Help" />
            <FooterBtn 
              icon="https://img.icons8.com/fluency/144/family.png" 
              label="Parent Zone" 
              onClick={() => navigate('/login/teacher')}
            />
            <FooterBtn icon="https://img.icons8.com/fluency/144/settings.png" label="Settings" />
         </div>
         <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">© 2026 HOMEWORK ZONE ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
};

const ZoneCard = ({ title, subtitle, image, color, btnColor, btnText, onClick }) => (
  <div className={`group ${color} border-[6px] border-[#334155] rounded-[48px] overflow-hidden shadow-[0_20px_0_0_#334155] flex flex-col cursor-pointer transition-all hover:-translate-y-4`}>
     {/* Card Header */}
     <div className="bg-white border-b-[6px] border-[#334155] p-8 flex items-center justify-center">
        <h3 className="text-2xl font-black text-[#1E293B] uppercase tracking-tight">{title}</h3>
     </div>
     
     {/* Card Image */}
     <div className="flex-1 p-10 flex-center relative overflow-hidden bg-white/40">
        <img src={image} className="w-full h-full object-contain drop-shadow-xl transform group-hover:scale-110 transition-transform" alt={title} />
     </div>

     {/* Card Footer Content */}
     <div className="p-10 bg-white space-y-6 text-center">
        <p className="text-xl font-black text-[#1E293B]">{subtitle}</p>
        <button 
          onClick={onClick}
          className={`${btnColor} text-white border-[6px] border-[#334155] w-full py-5 rounded-[24px] font-black text-xl uppercase tracking-[0.2em] shadow-[0_8px_0_0_#334155] active:translate-y-2 active:shadow-none transition-all`}
        >
          {btnText}
        </button>
     </div>
  </div>
);

const FooterBtn = ({ icon, label, onClick }) => (
  <div onClick={onClick} className="flex flex-col items-center gap-2 group cursor-pointer">
     <div className="w-16 h-16 bg-white rounded-[20px] border-4 border-[#334155] flex-center shadow-[4px_4px_0_0_#334155] group-hover:-translate-y-2 transition-all">
        <img src={icon} className="w-10 h-10" alt={label} />
     </div>
     <span className="text-[10px] font-black text-[#475569] uppercase tracking-widest">{label}</span>
  </div>
);

// --- Mock Login Pages ---
const LoginPage = ({ role, onLogin }) => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [studentName, setStudentName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (role === 'student' && (!code || !studentName)) {
      alert("Please enter both the Teacher Code and your name! 🎒");
      return;
    }
    setIsLoading(true);
    try {
      if (role === 'teacher') {
        const result = await signInWithPopup(auth, googleProvider);
        const userDoc = doc(db, 'teachers', result.user.uid);
        const docSnap = await getDoc(userDoc);

        let teacherCode;
        if (!docSnap.exists()) {
          teacherCode = generateTeacherCode();
          await setDoc(userDoc, {
            uid: result.user.uid,
            displayName: result.user.displayName,
            email: result.user.email,
            teacherCode: teacherCode,
            createdAt: new Date().toISOString()
          });
        } else {
          teacherCode = docSnap.data().teacherCode;
        }
        onLogin({ ...result.user, teacherCode });
        navigate('/dashboard/teacher');
      } else {
        // Student login via Teacher Code + Name Verification
        const q = query(collection(db, 'teachers'), where('teacherCode', '==', code.toUpperCase()));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const teacherDoc = querySnapshot.docs[0];
          const teacherData = teacherDoc.data();
          
          // Verify if student name is on the approved list (Search across ALL classrooms)
          const classroomsRef = collection(db, 'teachers', teacherDoc.id, 'classrooms');
          const classroomsSnap = await getDocs(classroomsRef);
          
          let studentFound = false;
          let studentClass = null;

          for (const classDoc of classroomsSnap.docs) {
            const studentRef = doc(db, 'teachers', teacherDoc.id, 'classrooms', classDoc.id, 'students', studentName.toLowerCase());
            const studentSnap = await getDoc(studentRef);
            if (studentSnap.exists()) {
              studentFound = true;
              studentClass = classDoc.data();
              break;
            }
          }

          if (studentFound) {
            onLogin({ teacher: teacherData, name: studentName, classroom: studentClass });
            navigate('/dashboard/student');
          } else {
            alert("Oops! Your name isn't on the class list yet. Talk to your teacher to join the Homework Zone! 🍎");
          }
        } else {
          alert("Invalid Teacher Code. Please check with your teacher! 🔍");
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login failed. Please try again! 🔄");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#E0F2FE] flex-center p-6 relative overflow-hidden">
      <div className="absolute top-10 left-1/2 -translate-x-1/2">
         <div className="bg-[#FBBF24] border-4 border-[#334155] px-10 py-4 rounded-3xl shadow-[4px_4px_0_0_#334155] transform rotate-1">
            <h2 className="text-2xl font-black text-[#1E293B] uppercase tracking-tight">{role === 'teacher' ? 'TEACHER LOGIN' : 'STUDENT PORTAL'}</h2>
         </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full p-12 space-y-10 bg-white rounded-[40px] border-8 border-[#334155] shadow-[0_20px_0_0_#334155] relative z-10"
      >
        <div className="text-center space-y-3">
          <p className="text-xs text-slate-400 uppercase font-black tracking-[0.25em]">
            {role === 'teacher' ? 'Manage your world' : 'Enter your details'}
          </p>
        </div>

        <div className="space-y-6">
          {role === 'teacher' ? (
            <div className="flex flex-col items-center gap-6">
               <img src="https://img.icons8.com/color/96/google-logo.png" className="w-16 h-16" alt="Google" />
               <p className="text-xs font-bold text-slate-500 text-center">Sign in with your school Google account to manage your Homework Zone.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.1em] block text-left ml-4">Teacher Code</label>
                <input 
                  type="text" 
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="EX: HWZ123" 
                  className="w-full p-4 rounded-2xl border-4 border-slate-100 outline-none focus:border-[#38BDF8] transition-all font-black text-center text-xl tracking-widest uppercase" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.1em] block text-left ml-4">Your Name</label>
                <input 
                  type="text" 
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g., Dante" 
                  className="w-full p-4 rounded-2xl border-4 border-slate-100 outline-none focus:border-[#38BDF8] transition-all font-black text-center text-xl uppercase tracking-widest" 
                />
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={isLoading}
          className={`${isLoading ? 'bg-slate-300' : 'bg-[#38BDF8] hover:bg-[#0EA5E9]'} text-white border-4 border-[#334155] w-full py-5 rounded-3xl font-black text-xl uppercase tracking-tighter shadow-[0_8px_0_0_#334155] active:translate-y-1 active:shadow-none transition-all`}
        >
          {isLoading ? 'Wait for it...' : role === 'teacher' ? 'Sign in with Google' : "Let's Go!"}
        </button>

        <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-widest">
           {role === 'teacher' ? 'Secure Teacher Link' : 'Secure Student Portal'}
        </p>
      </motion.div>
    </div>
  );
};

// --- App Router ---
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

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeStudent, setActiveStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Restore teacher session
        const userDoc = doc(db, 'teachers', user.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          setCurrentUser({ ...user, ...docSnap.data() });
        }
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    });

    // Restore student session from localStorage if exists
    const savedStudent = localStorage.getItem('hwz_active_student');
    if (savedStudent) {
      setActiveStudent(JSON.parse(savedStudent));
    }

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
      setActiveStudent(null);
      localStorage.removeItem('hwz_active_student');
      window.location.href = '/'; // Clean reset to landing
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleStudentLogin = async (data) => {
    const studentData = {
      teacher: data.teacher,
      name: data.name
    };
    setActiveStudent(studentData);
    localStorage.setItem('hwz_active_student', JSON.stringify(studentData));

    // silent check-in for the teacher to track
    try {
      const studentRef = doc(db, 'teachers', data.teacher.uid, 'students', data.name.toLowerCase());
      await setDoc(studentRef, {
        name: data.name,
        lastSeen: new Date().toISOString(),
        teacherCode: data.teacher.teacherCode
      }, { merge: true });
    } catch (err) {
      console.error("Check-in Error:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#E0F2FE] flex-center">
         <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/teacher" element={<LoginPage role="teacher" onLogin={setCurrentUser} />} />
        <Route path="/login/student" element={<LoginPage role="student" onLogin={handleStudentLogin} />} />
        <Route path="/dashboard/teacher" element={<TeacherDashboard user={currentUser} onLogout={handleLogout} />} />
        <Route path="/dashboard/student" element={<StudentDashboard teacher={activeStudent?.teacher} studentName={activeStudent?.name} onLogout={handleLogout} />} />
        <Route path="/quiz/sample" element={<StudentQuiz />} />
      </Routes>
    </Router>
  );
}
