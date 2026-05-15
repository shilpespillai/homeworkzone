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
  Flame
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showMascot, setShowMascot] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMascot(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F5F7FA] font-sans">
      {/* --- Sidebar (Equip Style) --- */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 sticky top-0 h-screen z-50">
        <div className="p-8 flex items-center gap-3 text-blue-600">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex-center text-white">
              <GraduationCap className="w-5 h-5" />
           </div>
           <span className="text-2xl font-black tracking-tighter italic">Equip</span>
        </div>
        
        {/* User Profile Mini */}
        <div className="px-8 pb-8 flex items-center justify-between group cursor-pointer">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex-center text-purple-600 font-bold border-2 border-white shadow-sm">E</div>
              <div>
                 <p className="text-sm font-black text-slate-800">Emma</p>
                 <p className="text-[10px] font-bold text-slate-400">Emma@gmail.com</p>
              </div>
           </div>
           <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>

        {/* Search */}
        <div className="px-6 pb-8">
           <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-3 rounded-full flex items-center gap-4 border border-purple-100 shadow-inner group transition-all">
              <Search className="w-4 h-4 text-purple-400" />
              <input type="text" placeholder="Search for anything" className="bg-transparent border-none outline-none text-xs w-full font-bold text-slate-600" />
           </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-4 mb-2">General</p>
          <EquipSidebarItem icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" active />
          <EquipSidebarItem icon={<FileText className="w-4 h-4" />} label="Practice Tests" />
          <EquipSidebarItem icon={<TrendingUp className="w-4 h-4" />} label="My Progress" />
          <EquipSidebarItem icon={<Calendar className="w-4 h-4" />} label="Study Plan" />
          <EquipSidebarItem icon={<ClipboardList className="w-4 h-4" />} label="Notes" />
          
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-4 mt-8 mb-2">Subjects</p>
          <EquipSidebarItem icon={<BookOpen className="w-4 h-4 text-emerald-500" />} label="Reading" />
          <EquipSidebarItem icon={<FileText className="w-4 h-4 text-pink-500" />} label="Writing" />
          <EquipSidebarItem icon={<Target className="w-4 h-4 text-blue-500" />} label="Numeracy" />
          <EquipSidebarItem icon={<MessageSquare className="w-4 h-4 text-amber-500" />} label="Language" />
        </nav>

        {/* Bottom Profile */}
        <div className="p-6">
           <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[28px] p-4 flex items-center justify-between border border-white shadow-lg">
              <div className="flex items-center gap-3">
                 <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${studentName || 'student'}`} className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-white p-1" alt="Student" />
                 <div>
                    <p className="text-sm font-black text-slate-800">{studentName || 'Student'}</p>
                    <p className="text-[9px] font-bold text-slate-400">Year 9, NSW</p>
                 </div>
              </div>
              <Settings className="w-4 h-4 text-slate-400" />
           </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 flex flex-col min-w-0 p-10 space-y-10 overflow-y-auto">
        {/* Header */}
        <header className="flex items-center justify-between shrink-0">
           <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome to {teacher?.displayName || "Teacher"}'s Zone!</h2>
              <p className="text-sm font-bold text-slate-400">Ready to boost your Numeracy score today, Emma?</p>
           </div>
           <div className="flex items-center gap-4">
              <div className="bg-purple-50 text-purple-600 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-purple-100 shadow-sm flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" /> eduplan in 18 days
              </div>
              <button className="p-3 bg-white rounded-full shadow-sm border border-slate-100 text-slate-400 hover:text-blue-600 transition-all"><Bell className="w-5 h-5" /></button>
              <button onClick={onLogout} className="flex items-center gap-2 bg-rose-50 px-6 py-3 rounded-2xl text-xs font-black text-rose-600 hover:bg-rose-100 transition-all border border-rose-100 shadow-sm"><LogOut className="w-4 h-4" /> Sign Out</button>
           </div>
        </header>

        {/* Floating Mascot - 'Puff & Gone' Lottie Animation */}
        <AnimatePresence>
          {showMascot && (
            <motion.div 
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0, filter: 'blur(20px)' }}
              transition={{ duration: 1, ease: "backOut" }}
              className="fixed bottom-10 right-10 w-64 z-[100] pointer-events-none"
            >
               {/* True Animated Lottie Character */}
               <Lottie 
                 animationData={null} // We will use a URL or a local file
                 path="https://assets10.lottiefiles.com/packages/lf20_m6cu9xpk.json" // High-quality walking student
                 loop={true}
                 className="w-full h-auto"
               />
               
               {/* Speech Bubble */}
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 1.5 }}
                 className="absolute -top-12 -left-16 bg-white px-6 py-3 rounded-3xl shadow-2xl border border-slate-100"
               >
                  <p className="text-sm font-black text-slate-800 whitespace-nowrap">Hey {studentName || 'Emma'}! 👋</p>
                  <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white rotate-45 border-r border-b border-slate-100" />
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Metric Row */}
        <div className="relative grid grid-cols-4 gap-8">
           <MetricCard label="Overall Score" value="74%" trend="+5%" icon={<TrendingUp className="w-5 h-5 text-blue-500" />} />
           <MetricCard label="Tests Completed" value="42" icon={<CheckCircle2 className="w-5 h-5 text-purple-500" />} />
           <MetricCard label="Day Streak" value="12 days" icon={<Flame className="w-5 h-5 text-emerald-500" />} active />
           <MetricCard label="Study Time" value="38h" icon={<Clock className="w-5 h-5 text-amber-500" />} />
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-12 gap-10">
           {/* Subject Performance */}
           <div className="col-span-7 bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm space-y-10">
              <div className="space-y-8">
                 <h3 className="text-xl font-black text-slate-900 tracking-tight">Subject Performance</h3>
                 <div className="space-y-6">
                    <SubjectBar label="Reading" value={78} color="bg-gradient-to-r from-emerald-400 to-blue-500" />
                    <SubjectBar label="Writing" value={65} color="bg-gradient-to-r from-pink-400 to-rose-500" />
                    <SubjectBar label="Numeracy" value={84} color="bg-gradient-to-r from-blue-500 to-indigo-600" />
                    <SubjectBar label="Language Conventions" value={71} color="bg-gradient-to-r from-amber-400 to-orange-500" />
                 </div>
              </div>

              <div className="space-y-6 pt-10 border-t border-slate-50">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Scores</h4>
                 <div className="space-y-4">
                    <ScoreRow label="Practice Test #12 - Reading" score="82/100" icon={<FileText className="w-4 h-4 text-blue-400" />} />
                    <ScoreRow label="Weekly Quiz - Algebra" score="91/100" icon={<ClipboardList className="w-4 h-4 text-emerald-400" />} />
                 </div>
              </div>
           </div>

           {/* Exam Readiness */}
           <div className="col-span-5 bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm flex flex-col justify-between overflow-hidden relative">
              <div className="space-y-6 text-center">
                 <h3 className="text-xl font-black text-slate-900 tracking-tight">Exam Readiness</h3>
                 <div className="flex-center py-6">
                    <BlobChart value={73} />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                 <LegendItem label="Numeracy" value="84%" color="bg-blue-600" />
                 <LegendItem label="Reading" value="78%" color="bg-pink-400" />
                 <LegendItem label="Writing" value="65%" color="bg-purple-500" />
              </div>

              <div className="mt-10 bg-purple-50 p-6 rounded-3xl border border-purple-100 flex gap-4">
                 <div className="w-10 h-10 bg-white rounded-xl flex-center shrink-0 shadow-sm"><Zap className="w-5 h-5 text-purple-600" /></div>
                 <p className="text-[10px] font-bold text-slate-600 leading-relaxed">AI Insight: Focus on Writing clarity and paragraph structure next for a 12% potential gain.</p>
              </div>
           </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-2 gap-10">
           {/* 7-Day Activity */}
           <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm space-y-8">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">7-Day Activity</h3>
              <div className="h-64 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ACTIVITY_DATA}>
                       <Tooltip cursor={{ fill: 'transparent' }} />
                       <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={40}>
                          {ACTIVITY_DATA.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill="#a855f7" fillOpacity={index === 4 ? 1 : 0.2} />
                          ))}
                       </Bar>
                       <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Upcoming Tests */}
           <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black text-slate-900 tracking-tight">Upcoming Tests</h3>
                 <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View Calendar</button>
              </div>

              <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 flex items-center justify-between group cursor-pointer hover:shadow-lg transition-all">
                 <div className="flex items-center gap-6">
                    <div className="bg-purple-100 w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-purple-600">
                       <span className="text-xl font-black">24</span>
                       <span className="text-[9px] font-black uppercase tracking-widest">May</span>
                    </div>
                    <div className="space-y-1">
                       <div className="flex items-center gap-3">
                          <p className="text-base font-black text-slate-900">Full Length Practice Exam A</p>
                          <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest">Hard</span>
                       </div>
                       <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 120 mins</span>
                          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> All Subjects</span>
                       </div>
                    </div>
                 </div>
                 <button className="bg-white text-slate-900 px-8 py-3 rounded-2xl text-xs font-black shadow-sm border border-slate-100 hover:bg-slate-900 hover:text-white transition-all">Start</button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

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
