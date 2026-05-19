import React, { useState, useEffect } from 'react';
import Lottie from "lottie-react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Link, Navigate } from 'react-router-dom';

const toTitleCase = (str) => {
  if (!str) return '';
  return str
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
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
  User,
  Camera,
  Upload,
  Check,
  Cloud,
  Filter,
  BarChart2,
  Book,
  FlaskConical
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
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import MessagingModule from './components/MessagingModule';

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
       <span className="text-4xl font-semibold text-slate-900">{value}%</span>
    </div>
  </div>
);

// --- Student Profile Component (High Fidelity) ---
const StudentProfile = ({ studentName, teacher, classroom, onProfileUpdate }) => {
  const [profile, setProfile] = useState({
    name: studentName || '',
    grade: classroom?.name || 'Grade 08',
    birthdate: '2010-05-11',
    contact: '',
    avatarUrl: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('');

  const handleSaveAvatar = async (avatarUrlToSave) => {
     try {
        const savedStudent = JSON.parse(localStorage.getItem('hwz_active_student'));
        const actualClass = classroom || savedStudent?.classroom;
        const actualTeacher = teacher || savedStudent?.teacher;
        
        if (savedStudent && actualClass && actualTeacher) {
           const studentRef = doc(db, 'teachers', actualTeacher.uid, 'classrooms', actualClass.id, 'students', studentName.toLowerCase());
           
           // Instantly write new avatar choice to Firestore
           await setDoc(studentRef, {
              avatarUrl: avatarUrlToSave,
              updatedAt: new Date().toISOString()
           }, { merge: true });
           
           // Sync state instantly
           setProfile(prev => ({ ...prev, avatarUrl: avatarUrlToSave }));
           
           // Notify parent dashboard to reload rosters
           if (onProfileUpdate) {
              onProfileUpdate();
           }
        }
     } catch (err) {
        console.error("Instant Save Avatar Error:", err);
     }
  };

  const animatedMascots = [
     { name: "Owl 🦉", url: "https://img.icons8.com/fluency/96/owl.png" },
     { name: "Fox 🦊", url: "https://img.icons8.com/fluency/96/fox.png" },
     { name: "Panda 🐼", url: "https://img.icons8.com/fluency/96/panda.png" },
     { name: "Lion 🦁", url: "https://img.icons8.com/fluency/96/lion-head.png" },
     { name: "Koala 🐨", url: "https://img.icons8.com/fluency/96/koala.png" },
     { name: "Dino 🦖", url: "https://img.icons8.com/fluency/96/dinosaur.png" },
     { name: "Unicorn 🦄", url: "https://img.icons8.com/fluency/96/unicorn.png" },
     { name: "Tiger 🐯", url: "https://img.icons8.com/fluency/96/tiger.png" }
  ];

  useEffect(() => {
    // Load existing profile data from Firestore with safe auth fallback
    const fetchProfile = async () => {
       const savedStudent = JSON.parse(localStorage.getItem('hwz_active_student'));
       const actualClass = classroom || savedStudent?.classroom;
       const actualTeacher = teacher || savedStudent?.teacher;
       if (savedStudent && actualClass && actualTeacher) {
          const studentRef = doc(db, 'teachers', actualTeacher.uid, 'classrooms', actualClass.id, 'students', studentName.toLowerCase());
          const snap = await getDoc(studentRef);
          if (snap.exists()) {
             const data = snap.data();
             setProfile(prev => ({
                ...prev,
                ...data,
                name: data.name || studentName
             }));
             if (data.avatarUrl) {
                setSelectedAvatar(data.avatarUrl);
             }
          }
       }
    };
    fetchProfile();
  }, [studentName, teacher, classroom]);

  const handleCustomPhotoUpload = (e) => {
     const file = e.target.files?.[0];
     if (!file) return;

     const reader = new FileReader();
     reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
           const canvas = document.createElement('canvas');
           const ctx = canvas.getContext('2d');
           canvas.width = 256;
           canvas.height = 256;
           
           const minDim = Math.min(img.width, img.height);
           const sx = (img.width - minDim) / 2;
           const sy = (img.height - minDim) / 2;
           
           ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, 256, 256);
           
           const base64Url = canvas.toDataURL('image/jpeg', 0.85);
           setSelectedAvatar(base64Url);
           handleSaveAvatar(base64Url);
           setIsAvatarModalOpen(false);
        };
        img.src = event.target.result;
     };
     reader.readAsDataURL(file);
  };

  const handleSave = async () => {
     setIsSaving(true);
     try {
        const savedStudent = JSON.parse(localStorage.getItem('hwz_active_student'));
        const actualClass = classroom || savedStudent?.classroom;
        const actualTeacher = teacher || savedStudent?.teacher;
        
        if (savedStudent && actualClass && actualTeacher) {
           const studentRef = doc(db, 'teachers', actualTeacher.uid, 'classrooms', actualClass.id, 'students', studentName.toLowerCase());
           const cleanName = toTitleCase(profile.name || studentName);
           
           // Use setDoc with { merge: true } so it safely creates the document if it doesn't exist yet
           await setDoc(studentRef, {
              ...profile,
              name: cleanName,
              updatedAt: new Date().toISOString()
           }, { merge: true });
           
           alert("Profile saved successfully! Your teacher can now see your updates. ✨");
           if (onProfileUpdate) {
              onProfileUpdate();
           }
        } else {
           console.error("Auth context missing on profile save:", { savedStudent, actualClass, actualTeacher });
           alert("Could not save: Missing login context. Please log out and log back in! 🔒");
        }
     } catch (err) {
        console.error("Save Profile Error:", err);
        alert("Failed to save profile. Please try again! 🔄");
     }
     setIsSaving(false);
  };

  return (
    <motion.div 
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       className="max-w-[100%] mx-auto w-full py-4 space-y-6 pb-20"
    >
      {/* Header Actions */}
      <div className="flex items-center justify-between">
         <h1 className="text-3xl font-semibold text-[#2D3748] tracking-tighter">My Profile</h1>
         <div className="flex items-center gap-3">
            <button className="w-9 h-9 bg-[#E0F2FE] rounded-full flex-center text-[#8A70FF] shadow-sm hover:scale-110 transition-all relative">
               <User size={18} strokeWidth={3} />
               <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white flex-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
               </div>
            </button>
            <button className="w-9 h-9 bg-[#E0F2FE] rounded-full flex-center text-[#8A70FF] shadow-sm hover:scale-110 transition-all relative">
               <Bell size={18} strokeWidth={3} />
               <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white flex-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
               </div>
            </button>
         </div>
      </div>

      {/* Top Section: Avatar & Name */}
      <div className="flex flex-col items-center gap-2">
         <div className="w-32 h-32 bg-[#FFE4D6] rounded-full p-1 shadow-lg relative group transition-transform hover:scale-105">
            <img src={profile.avatarUrl || `https://api.dicebear.com/7.x/lorelei/svg?seed=${profile.name}`} className="w-full h-full rounded-full object-cover" alt="Avatar" />
            <button 
               onClick={() => {
                  setSelectedAvatar(profile.avatarUrl);
                  setIsAvatarModalOpen(true);
               }}
               className="absolute bottom-0 right-0 w-10 h-10 bg-[#8A70FF] text-white rounded-full flex-center shadow-lg border-2 border-white hover:scale-110 active:scale-95 transition-all"
            >
               <Camera size={18} />
            </button>
         </div>
         <h2 className="text-2xl font-semibold text-[#2D3748] mt-2">{profile.name}</h2>
      </div>

      {/* Premium Avatar & Mascot Picker Modal */}
      {isAvatarModalOpen && (
         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex-center p-4">
            <div className="bg-white rounded-[36px] border border-slate-100 max-w-lg w-full p-8 space-y-6 shadow-2xl relative">
               <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-[#2D3748] tracking-tighter">Choose Profile Mascot 🎨</h3>
                  <button 
                     onClick={() => setIsAvatarModalOpen(false)}
                     className="w-9 h-9 bg-slate-50 rounded-full flex-center text-slate-400 hover:bg-slate-100 transition-all font-black text-sm"
                  >
                     ✕
                  </button>
               </div>

               <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Option A: Predefined Animated Mascots</h4>
                  <div className="grid grid-cols-4 gap-4">
                     {animatedMascots.map((mascot, idx) => (
                        <button 
                           key={idx}
                           onClick={() => setSelectedAvatar(mascot.url)}
                           className={`p-2 rounded-2xl border-2 transition-all hover:scale-105 relative ${selectedAvatar === mascot.url ? 'border-[#8A70FF] bg-purple-50/30' : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'}`}
                        >
                           <img src={mascot.url} className="w-12 h-12 object-contain mx-auto" alt={mascot.name} />
                           <span className="text-[9px] font-semibold text-slate-400 block mt-1 text-center leading-none">{mascot.name}</span>
                           {selectedAvatar === mascot.url && (
                              <div className="absolute top-1 right-1 w-4 h-4 bg-[#8A70FF] text-white rounded-full flex-center text-[8px] font-bold">✓</div>
                           )}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="h-px bg-slate-100" />

               <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Option B: Upload Custom Photo</h4>
                  
                  <label className="border-2 border-dashed border-slate-200 hover:border-[#8A70FF] rounded-3xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-slate-50/50 hover:bg-purple-50/10 group">
                     <Upload className="w-8 h-8 text-slate-400 group-hover:text-[#8A70FF] transition-all" />
                     <span className="text-xs font-semibold text-slate-600">Click to upload custom picture</span>
                     <span className="text-[10px] font-semibold text-slate-400">PNG, JPG or GIF (Auto-sized)</span>
                     <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleCustomPhotoUpload}
                        className="hidden" 
                     />
                  </label>
               </div>

               <div className="flex items-center gap-3 pt-2">
                  <button 
                     onClick={() => {
                        handleSaveAvatar(selectedAvatar);
                        setIsAvatarModalOpen(false);
                     }}
                     className="flex-1 bg-[#8A70FF] text-white py-3.5 rounded-2xl font-semibold text-sm shadow-lg shadow-purple-100 hover:scale-105 active:scale-95 transition-all"
                  >
                     Equip Mascot 🚀
                  </button>
                  <button 
                     onClick={() => setIsAvatarModalOpen(false)}
                     className="px-6 bg-slate-100 text-slate-500 py-3.5 rounded-2xl font-semibold text-sm hover:bg-slate-200 transition-all"
                  >
                     Cancel
                  </button>
               </div>
            </div>
         </div>
      )}


      {/* Form Section */}
      <div className="space-y-4 px-4">
         <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-3 text-lg font-semibold text-[#2D3748]">Name</label>
            <input 
               type="text" 
               value={profile.name}
               onChange={(e) => setProfile({...profile, name: e.target.value})}
               className="col-span-9 bg-white border border-slate-200 p-3.5 rounded-2xl text-base font-semibold text-[#475569] shadow-sm focus:border-[#8A70FF] outline-none transition-all"
            />
         </div>

         <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-3 text-lg font-semibold text-[#2D3748]">Class</label>
            <input 
               type="text" 
               value={profile.grade || ''}
               onChange={(e) => setProfile({...profile, grade: e.target.value})}
               className="col-span-9 bg-white border border-slate-200 p-3.5 rounded-2xl text-base font-semibold text-[#475569] shadow-sm focus:border-[#8A70FF] outline-none transition-all"
            />
         </div>

         <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-3 text-lg font-semibold text-[#2D3748]">Birthdate</label>
            <div className="col-span-9 relative">
               <input 
                  type="date" 
                  value={profile.birthdate || '2020-05-11'}
                  onChange={(e) => setProfile({...profile, birthdate: e.target.value})}
                  className="w-full bg-white border border-slate-200 p-3.5 rounded-2xl text-base font-semibold text-[#475569] shadow-sm focus:border-[#8A70FF] outline-none transition-all pr-12"
               />
               <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
         </div>

         <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-3 text-lg font-semibold text-[#2D3748]">Contact Info</label>
            <input 
               type="text" 
               value={profile.contact || ''}
               onChange={(e) => setProfile({...profile, contact: e.target.value})}
               className="col-span-9 bg-white border border-slate-200 p-3.5 rounded-2xl text-base font-semibold text-[#475569] shadow-sm focus:border-[#8A70FF] outline-none transition-all"
            />
         </div>
      </div>

      {/* Save Button Floating */}
      <div className="flex justify-center pt-6">
         <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#8A70FF] text-white px-10 py-3.5 rounded-[24px] font-semibold text-base shadow-xl shadow-purple-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
         >
            {isSaving ? 'Saving...' : 'Save Profile ✨'}
         </button>
      </div>
    </motion.div>
  );
};


const SubjectIcon = ({ subject }) => {
  const normalized = subject?.toLowerCase() || 'general';
  if (normalized === 'english') {
    return (
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 bg-orange-500 rounded-full flex-center text-white font-black text-2xl shadow-[0_4px_0_0_#c2410c] transform -rotate-6">Aa</div>
        <span className="text-sm font-black text-orange-500 mt-2">English</span>
      </div>
    );
  }
  if (normalized === 'maths') {
    return (
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 bg-blue-500 rounded-full flex-center text-white font-black text-2xl shadow-[0_4px_0_0_#1d4ed8] transform rotate-3">123</div>
        <span className="text-sm font-black text-blue-500 mt-2">Maths</span>
      </div>
    );
  }
  if (normalized === 'science') {
    return (
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 bg-green-500 rounded-full flex-center text-white shadow-[0_4px_0_0_#15803d]">
          <FlaskConical className="w-7 h-7" />
        </div>
        <span className="text-sm font-black text-green-500 mt-2">Science</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 bg-purple-500 rounded-full flex-center text-white shadow-[0_4px_0_0_#6D28D9]">
        <Cloud className="w-7 h-7" />
      </div>
      <span className="text-sm font-black text-purple-500 mt-2">General</span>
    </div>
  );
};

const HomeworkCard = ({ hw, completedSubmission, hasDraft, delay, onStart }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group hover:shadow-md transition-all"
    >
      {/* Subject Icon Column */}
      <div className="shrink-0 w-24 flex justify-center">
        <SubjectIcon subject={hw.subject} />
      </div>
      
      {/* Content Column */}
      <div className="flex-1 space-y-2">
        <h3 className="text-xl font-black text-slate-800">{hw.title}</h3>
        <p className="text-sm font-bold text-slate-500 line-clamp-2">{hw.instructions || 'Answer the questions below.'}</p>
        
        <div className="flex items-center gap-3 pt-2">
          {hasDraft && !completedSubmission && (
             <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 rounded-lg animate-pulse">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">In Progress</span>
             </div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 rounded-lg">
             <FileText className="w-4 h-4 text-orange-500" />
             <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{hw.questions?.length || 1} Worksheet</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-lg">
             <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
             <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{hw.points || 15} Points</span>
          </div>
        </div>
      </div>
      
      {/* Action Column */}
      <div className="shrink-0 flex flex-col items-end justify-center gap-4 min-w-[200px]">
        <div className="flex items-center gap-2 text-blue-500">
           <Calendar className="w-5 h-5" />
           <div className="flex flex-col">
              <span className="text-sm font-black text-slate-700">Due: {hw.dueDate ? new Date(hw.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No Due Date'}</span>
              <span className="text-xs font-bold text-slate-400">{hw.dueDate ? new Date(hw.dueDate).toLocaleDateString('en-GB', { weekday: 'long' }) : ''}</span>
           </div>
        </div>
        
        {completedSubmission ? (
           <div className="w-full">
              <button onClick={() => onStart(hw.id, completedSubmission)} className="w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-black py-3 px-6 rounded-2xl shadow-[0_4px_0_0_#34d399] active:translate-y-1 active:shadow-none transition-all">
                 Completed (Review)
              </button>
           </div>
        ) : hasDraft ? (
           <div className="w-full">
              <button onClick={() => onStart(hw.id, null)} className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-black py-3 px-6 rounded-2xl shadow-[0_4px_0_0_#4338ca] active:translate-y-1 active:shadow-none transition-all">
                 Resume Mission 🚀
              </button>
           </div>
        ) : (
           <div className="w-full">
              <button onClick={() => onStart(hw.id, null)} className="w-full bg-orange-500 hover:bg-orange-400 text-white font-black py-3 px-6 rounded-2xl shadow-[0_4px_0_0_#c2410c] active:translate-y-1 active:shadow-none transition-all">
                 Start Homework
              </button>
           </div>
        )}
      </div>
    </motion.div>
  );
};

const MyHomework = ({ studentName, teacher, onStartMission, homeworks: initialHomeworks, submissions: initialSubmissions }) => {
   const [activeTab, setActiveTab] = useState('All');
   const [subjectFilter, setSubjectFilter] = useState('All Subjects');
   const [homeworks, setHomeworks] = useState(initialHomeworks || []);
   const [submissions, setSubmissions] = useState(initialSubmissions || []);
   const [loading, setLoading] = useState(!initialHomeworks || !initialSubmissions);

   useEffect(() => {
      if (initialHomeworks && initialSubmissions) {
         setHomeworks(initialHomeworks);
         setSubmissions(initialSubmissions);
         setLoading(false);
         return;
      }
      const fetchData = async () => {
         const savedStudent = JSON.parse(localStorage.getItem('hwz_active_student'));
         if (savedStudent && savedStudent.classroom) {
            try {
               // Fetch homeworks
               const hwQ = query(collection(db, 'homeworks'), where('assignedClassId', '==', savedStudent.classroom.id));
               const hwSnap = await getDocs(hwQ);
               const hwList = hwSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
               setHomeworks(hwList);

                // Server-filtered parallel queries
                const cleanName = studentName?.trim();
                const subQ1 = query(collection(db, 'submissions'), where('studentName', '==', cleanName));
                const subQ2 = query(collection(db, 'submissions'), where('studentName', '==', toTitleCase(cleanName)));
                
                const [snap1, snap2] = await Promise.all([getDocs(subQ1), getDocs(subQ2)]);
                const combinedMap = {};
                snap1.docs.forEach(doc => combinedMap[doc.id] = { id: doc.id, ...doc.data() });
                snap2.docs.forEach(doc => combinedMap[doc.id] = { id: doc.id, ...doc.data() });
                
                const subList = Object.values(combinedMap);
                setSubmissions(subList);
            } catch (err) {
               console.error("Fetch Data Error:", err);
            }
         }
         setLoading(false);
      };
      fetchData();
   }, [studentName, initialHomeworks, initialSubmissions]);

   const completedHwIds = new Set(submissions.map(s => s.homeworkId));
   
   // Compute in-progress based on local storage drafts
   const inProgressHws = homeworks.filter(hw => {
      if (completedHwIds.has(hw.id)) return false;
      const draft = localStorage.getItem(`hz_draft_${studentName}_${hw.id}`);
      if (draft) {
         try {
            const parsed = JSON.parse(draft);
            return parsed && Object.keys(parsed.answers || {}).length > 0;
         } catch(e) {
            return false;
         }
      }
      return false;
   });

   const inProgressHwIds = new Set(inProgressHws.map(hw => hw.id));
   const todoHws = homeworks.filter(hw => !completedHwIds.has(hw.id) && !inProgressHwIds.has(hw.id));
   const completedHws = homeworks.filter(hw => completedHwIds.has(hw.id));
   
   let displayedHomeworks = homeworks;
   if (activeTab === 'To Do') displayedHomeworks = todoHws;
   if (activeTab === 'Completed') displayedHomeworks = completedHws;
   if (activeTab === 'In Progress') displayedHomeworks = inProgressHws;

   if (subjectFilter !== 'All Subjects') {
      displayedHomeworks = displayedHomeworks.filter(hw => hw.subject?.toLowerCase() === subjectFilter.toLowerCase());
   }

   const tabs = [
     { id: 'All', label: `All (${homeworks.length})` },
     { id: 'To Do', label: `To Do (${todoHws.length})` },
     { id: 'In Progress', label: `In Progress (${inProgressHws.length})` },
     { id: 'Completed', label: `Completed (${completedHws.length})` }
   ];

   return (
      <div className="max-w-[100%] mx-auto w-full py-6 space-y-8 pb-20">
         {/* Header area with custom illustrations */}
         <div className="flex items-center justify-between px-2 pt-4">
            <div className="flex items-center gap-4 relative z-10">
               <div className="w-16 h-16 bg-orange-500 rounded-[20px] shadow-[0_6px_0_0_#c2410c] flex-center transform -rotate-6">
                 <Book className="w-8 h-8 text-white" />
               </div>
               <h1 className="text-4xl font-black text-[#1E3A8A] tracking-tighter">My Homework</h1>
            </div>
            {/* Decorative Stars & Books */}
            <div className="relative w-40 h-24 hidden md:block z-0">
               <div className="absolute right-0 bottom-0 text-[80px] leading-none z-10 animate-float drop-shadow-xl">⭐</div>
               <div className="absolute right-12 bottom-2 text-5xl z-0">📚</div>
               <div className="absolute left-4 top-4 text-amber-300 animate-pulse">✨</div>
            </div>
         </div>

         {/* Navigation Tabs & Filter */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-slate-100 pb-4 relative z-10">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
               {tabs.map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`px-6 py-2.5 rounded-full text-sm font-black whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
                 >
                   {tab.label}
                 </button>
               ))}
            </div>
            
            <div className="relative shrink-0">
               <select 
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="appearance-none bg-white border-2 border-slate-100 rounded-full pl-10 pr-10 py-2.5 text-sm font-black text-slate-600 outline-none focus:border-[#8A70FF] cursor-pointer"
               >
                  <option>All Subjects</option>
                  <option>English</option>
                  <option>Maths</option>
                  <option>Science</option>
                  <option>General</option>
               </select>
               <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
         </div>

         {/* Homework List */}
         <div className="space-y-4 relative z-10">
            {loading ? (
               <div className="flex-center py-20"><div className="w-10 h-10 border-4 border-[#8A70FF] border-t-transparent rounded-full animate-spin" /></div>
            ) : displayedHomeworks.length > 0 ? (
               displayedHomeworks.map((hw, i) => {
                  const draftStr = localStorage.getItem(`hz_draft_${studentName}_${hw.id}`);
                  let hasDraft = false;
                  if (draftStr) {
                     try {
                        const parsed = JSON.parse(draftStr);
                        hasDraft = parsed && Object.keys(parsed.answers || {}).length > 0;
                     } catch(e) {}
                  }
                  return (
                     <HomeworkCard 
                        key={hw.id}
                        hw={hw}
                        completedSubmission={submissions.find(s => s.homeworkId === hw.id)}
                        hasDraft={hasDraft}
                        delay={i * 0.1} 
                        onStart={onStartMission}
                     />
                  );
               })
            ) : (
               <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-slate-200">
                  <div className="text-6xl mb-4 grayscale opacity-30">🍦</div>
                  <p className="text-xl font-black text-slate-300">Nothing here! Take a break.</p>
               </div>
            )}
         </div>
         
         {/* Footer Mascot Banner */}
         <div className="bg-[#fff9d6] rounded-[32px] p-6 border-2 border-[#ffe87a] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden mt-8">
            <div className="flex items-center gap-6 relative z-10">
               <img src="/assets/owl_mascot.png" className="w-24 h-24 object-contain animate-float drop-shadow-xl" alt="Mascot" />
               <p className="text-lg font-black text-slate-800">
                  Keep it up, {(studentName || 'Student').split(' ')[0]}! Small steps every day lead to big results! 🌈
               </p>
            </div>
            <button className="bg-orange-500 hover:bg-orange-400 text-white font-black py-3 px-8 rounded-2xl shadow-[0_4px_0_0_#c2410c] active:translate-y-1 active:shadow-none transition-all relative z-10 whitespace-nowrap flex items-center gap-2">
               <BarChart2 className="w-5 h-5" />
               View Progress
            </button>
            
            <div className="absolute right-10 top-0 w-64 h-64 bg-yellow-200/50 rounded-full blur-3xl -z-0 pointer-events-none" />
         </div>
      </div>
   );
};

const MissionReports = ({ studentName, teacher, submissions: initialSubmissions }) => {
   const [submissions, setSubmissions] = useState(initialSubmissions || []);
   const [loading, setLoading] = useState(!initialSubmissions);

   useEffect(() => {
      if (initialSubmissions) {
         setSubmissions(initialSubmissions);
         setLoading(false);
         return;
      }
      const fetchSubmissions = async () => {
         try {
             const cleanName = studentName?.trim();
             const q1 = query(collection(db, 'submissions'), where('studentName', '==', cleanName));
             const q2 = query(collection(db, 'submissions'), where('studentName', '==', toTitleCase(cleanName)));
             
             const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
             const combinedMap = {};
             snap1.docs.forEach(doc => combinedMap[doc.id] = { id: doc.id, ...doc.data() });
             snap2.docs.forEach(doc => combinedMap[doc.id] = { id: doc.id, ...doc.data() });
             
             const subList = Object.values(combinedMap);
            
            // Sort client-side in memory to bypass Firebase composite index requirement
            subList.sort((a, b) => {
               const timeA = a.submittedAt?.toDate ? a.submittedAt.toDate().getTime() : (a.submittedAt || 0);
               const timeB = b.submittedAt?.toDate ? b.submittedAt.toDate().getTime() : (b.submittedAt || 0);
               return timeB - timeA;
            });
            
            setSubmissions(subList);
         } catch (err) {
            console.error("Fetch Submissions Error:", err);
         }
         setLoading(false);
      };
      fetchSubmissions();
   }, [studentName, initialSubmissions]);

   return (
      <div className="max-w-[100%] mx-auto w-full py-4 space-y-10 pb-20">
         <div className="space-y-1 px-2">
            <h1 className="text-4xl font-black text-[#1E3A8A] tracking-tight">Mission Reports</h1>
            <p className="text-sm font-bold text-blue-300 italic">Review your performance and AI feedback.</p>
         </div>

         <div className="grid grid-cols-1 gap-6">
            {submissions.map((sub, i) => (
               <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={sub.id}
                  className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all"
               >
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-blue-50 rounded-2xl flex-center shadow-sm shrink-0">
                        <Trophy className={`w-8 h-8 ${sub.score >= 80 ? 'text-amber-400' : 'text-blue-400'}`} />
                     </div>
                     <div className="space-y-1">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Mission Result: {sub.score}%</h3>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Classroom Assignment</span>
                        {sub.feedback && (
                          <div className="mt-3 bg-purple-50/50 border border-purple-100 p-4 rounded-2xl relative shadow-sm max-w-lg text-left">
                            <span className="text-[9px] font-black uppercase text-purple-500 tracking-wider block mb-1">🤖 AI Teacher Feedback</span>
                            <p className="text-xs font-bold text-[#5C4D9F] leading-relaxed italic">"${sub.feedback}"</p>
                          </div>
                        )}
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{new Date(sub.submittedAt?.toDate()).toLocaleDateString()}</p>
                     <p className="text-sm font-black text-emerald-500">+{sub.correctCount * 10} pts</p>
                  </div>
               </motion.div>
            ))}
            {submissions.length === 0 && !loading && (
               <p className="text-center py-20 text-slate-300 font-bold italic">No reports yet. Complete a mission first! 🚀</p>
            )}
         </div>
      </div>
   );
};

const RewardBadge = ({ icon, label, color, delay, unlocked }) => (
   <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={`flex flex-col items-center gap-3 group cursor-pointer relative ${unlocked ? '' : 'opacity-40 grayscale'}`}
   >
      <div className={`w-20 h-20 ${color} rounded-full flex-center shadow-md border-4 border-white group-hover:scale-110 transition-all relative`}>
         <span className="text-4xl drop-shadow-sm">{icon}</span>
         {!unlocked && (
            <div className="absolute inset-0 bg-slate-900/10 rounded-full flex-center">
               <span className="text-sm">🔒</span>
            </div>
         )}
      </div>
      <div className="text-center space-y-0.5">
         <span className="text-[11px] font-black text-[#2D3748] text-center leading-tight tracking-tight uppercase px-1 block">{label}</span>
         <span className={`text-[8px] font-bold uppercase tracking-widest ${unlocked ? 'text-emerald-500' : 'text-slate-400'}`}>
            {unlocked ? 'Unlocked' : 'Locked'}
         </span>
      </div>
   </motion.div>
);

const RewardShopItem = ({ icon, title, subtitle, points, delay, onRedeem, canAfford }) => (
   <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex items-center justify-between p-4 bg-white rounded-3xl border border-slate-50 hover:shadow-md transition-all group"
   >
      <div className="flex items-center gap-4">
         <div className="w-14 h-14 bg-blue-50 rounded-full flex-center shadow-inner overflow-hidden border-2 border-white">
            <img src={icon} className="w-full h-full object-cover" alt={title} />
         </div>
         <div className="space-y-0.5">
            <h4 className="text-sm font-semibold text-[#2D3748] group-hover:text-[#8A70FF] transition-colors">{title}</h4>
            <p className="text-[10px] font-semibold text-slate-400">{subtitle}</p>
            <div className="flex items-center gap-1">
               <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
               <span className="text-[10px] font-bold text-slate-600">{points} points</span>
            </div>
         </div>
      </div>
      <button 
         onClick={onRedeem}
         disabled={!canAfford}
         className={`px-5 py-2 rounded-xl text-[10px] font-semibold shadow-lg transition-all ${canAfford ? 'bg-[#8A70FF] text-white shadow-purple-100 hover:scale-105 active:scale-95 cursor-pointer' : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'}`}
      >
         {canAfford ? 'Redeem' : 'Locked'}
      </button>
   </motion.div>
);

const LeaderboardRow = ({ rank, name, students, delay, avatarUrl }) => (
   <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`flex items-center justify-between p-4 rounded-3xl transition-all border border-transparent ${rank === 1 ? 'bg-[#FFFBEB] border-amber-100' : 'hover:bg-slate-50'}`}
   >
      <div className="flex items-center gap-4">
         <div className="w-8 flex-center">
            {rank === 1 ? (
               <div className="w-8 h-8 bg-amber-400 rounded-lg flex-center text-white shadow-md rotate-3">
                  <span className="text-sm font-bold">1</span>
               </div>
            ) : (
               <span className="text-sm font-bold text-slate-400">{rank}</span>
            )}
         </div>
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-50 overflow-hidden shadow-sm">
               <img src={avatarUrl || `https://api.dicebear.com/7.x/lorelei/svg?seed=${name}`} className="w-full h-full object-cover" alt={name} />
            </div>
            <div>
               <p className="text-sm font-semibold text-[#2D3748]">{name}</p>
               <p className="text-[10px] font-black text-[#8A70FF] uppercase tracking-widest">{students} Points</p>
            </div>
         </div>
      </div>
   </motion.div>
);

const MyRewards = ({ studentName, classroom, homeworks, submissions, getStudentAvatar, classroomStudents = [] }) => {
   const normalizeName = (name) => (name || '').trim().toLowerCase().replace(/\s+/g, ' ');
   const mySubmissions = submissions.filter(s => normalizeName(s.studentName) === normalizeName(studentName));
   const totalPoints = mySubmissions.reduce((acc, s) => acc + (s.correctCount || 0) * 10, 0);

   // Unlocking Badge calculations
   const hasMaths = mySubmissions.some(s => {
      const hw = homeworks.find(h => h.id === s.homeworkId);
      return hw?.subject?.toLowerCase() === 'maths';
   });
   const hasEnglish = mySubmissions.some(s => {
      const hw = homeworks.find(h => h.id === s.homeworkId);
      return hw?.subject?.toLowerCase() === 'english';
   });
   const hasScience = mySubmissions.some(s => {
      const hw = homeworks.find(h => h.id === s.homeworkId);
      return hw?.subject?.toLowerCase() === 'science';
   });
   const hasMusicOrArts = mySubmissions.some(s => {
      const hw = homeworks.find(h => h.id === s.homeworkId);
      return hw?.subject?.toLowerCase() === 'music' || hw?.subject?.toLowerCase() === 'arts';
   });

   const badgesList = [
      { icon: "🐦", label: "Early Bird", color: "bg-amber-100", unlocked: mySubmissions.length >= 1 },
      { icon: "🧮", label: "Number Ninja", color: "bg-emerald-100", unlocked: hasMaths },
      { icon: "🧙", label: "Grammar Wizard", color: "bg-purple-100", unlocked: hasEnglish },
      { icon: "🔬", label: "Little Einstein", color: "bg-blue-100", unlocked: hasScience },
      { icon: "🎨", label: "Creative Genius", color: "bg-rose-100", unlocked: hasMusicOrArts },
      { icon: "⭐", label: "Perfect Score", color: "bg-purple-100", unlocked: mySubmissions.some(s => s.score === 100) },
      { icon: "🚀", label: "Fast Learner", color: "bg-blue-100", unlocked: mySubmissions.some(s => s.score >= 80) },
      { icon: "📚", label: "Bookworm", color: "bg-emerald-100", unlocked: mySubmissions.length >= 3 },
      { icon: "🏆", label: "Grand Scholar", color: "bg-purple-100", unlocked: mySubmissions.length >= 5 },
      { icon: "💬", label: "Co-Pilot Listener", color: "bg-blue-100", unlocked: mySubmissions.some(s => s.feedback) },
      { icon: "🔥", label: "Super Scholar", color: "bg-amber-100", unlocked: mySubmissions.length >= 2 && (mySubmissions.reduce((acc, s) => acc + s.score, 0) / mySubmissions.length) >= 90 },
      { icon: "👑", label: "Score Master", color: "bg-purple-100", unlocked: totalPoints >= 100 }
   ];

   const studentScores = {};
   submissions.forEach(sub => {
      const subName = normalizeName(sub.studentName);
      const isInRoster = classroomStudents.some(s => normalizeName(s.id) === subName || normalizeName(s.name) === subName);
      if (sub.classId === classroom?.id || !classroom?.id || isInRoster) {
         const matchedRosterName = classroomStudents.find(s => normalizeName(s.name) === subName || normalizeName(s.id) === subName)?.name || sub.studentName;
         studentScores[matchedRosterName] = (studentScores[matchedRosterName] || 0) + (sub.correctCount || 0) * 10;
      }
   });

   const activeRegisteredName = classroomStudents.find(s => normalizeName(s.name) === normalizeName(studentName))?.name || studentName;
   if (studentScores[activeRegisteredName] === undefined) {
      studentScores[activeRegisteredName] = 0;
   }

   const sortedStudents = Object.keys(studentScores)
      .map(name => ({ name, points: studentScores[name] }))
      .sort((a,b) => b.points - a.points);

   const activeStudentRankIdx = sortedStudents.findIndex(s => normalizeName(s.name) === normalizeName(studentName));
   const activeStudentRank = activeStudentRankIdx !== -1 ? activeStudentRankIdx + 1 : 1;

   const leaderStudent = sortedStudents[0] || { name: activeRegisteredName, points: 0 };
   const currentStudentScore = studentScores[activeRegisteredName] || 0;

   const shopItems = [
      { icon: "https://img.icons8.com/fluency/96/astronaut-helmet.png", title: "Astronaut Helmet 🧑‍🚀", subtitle: "Accessory for your profile character", points: 30 },
      { icon: "https://img.icons8.com/fluency/96/palette.png", title: "Cheerful Palette 🎨", subtitle: "Custom dashboard color theme pack", points: 20 },
      { icon: "https://img.icons8.com/fluency/96/panda.png", title: "Panda Buddy 🐼", subtitle: "Premium dashboard floating companion mascot", points: 50 },
      { icon: "https://img.icons8.com/fluency/96/medal.png", title: "Golden Badge Frame 🏅", subtitle: "Special golden border highlight for avatar", points: 15 }
   ];

   const handleRedeem = (item) => {
      alert(`🎉 Redeemed successfully: ${item.title}! Head over to your profile to equip it!`);
   };

   return (
      <div className="max-w-[100%] mx-auto w-full py-4 space-y-8 pb-20">
         {/* Hero Header */}
         <div className="flex items-center justify-between px-2 relative">
            <div className="space-y-4">
               <div className="space-y-1">
                  <h1 className="text-3xl font-semibold text-[#2D3748] tracking-tighter">My Rewards Hub</h1>
                  <p className="text-sm font-semibold text-slate-400">Complete homework missions and unlock cool rewards!</p>
               </div>
               <h2 className="text-6xl font-semibold text-[#2D3748] tracking-tighter">{totalPoints} <span className="text-3xl text-slate-400">points</span></h2>
            </div>
            <div className="w-48 h-48 relative">
               <motion.div 
                  animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="w-full h-full flex-center"
               >
                  <img src="https://img.icons8.com/fluency/240/filled-star.png" className="w-full h-full object-contain drop-shadow-2xl" alt="Star Trophy" />
                  <div className="absolute top-4 right-4 w-12 h-12 bg-[#8A70FF] rounded-full flex-center text-white shadow-lg border-4 border-white rotate-12">
                     <Trophy size={20} strokeWidth={3} />
                  </div>
               </motion.div>
            </div>
         </div>

         {/* Badges Hub */}
         <div className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-sm space-y-10">
            <div className="space-y-1">
               <h3 className="text-xl font-semibold text-[#2D3748]">My Badges Collection</h3>
               <p className="text-xs text-slate-400">Earn badges by completing learning quizzes and perfect scores.</p>
            </div>
            <div className="grid grid-cols-6 gap-8">
               {badgesList.map((badge, idx) => (
                  <RewardBadge 
                     key={idx}
                     icon={badge.icon} 
                     label={badge.label} 
                     color={badge.color} 
                     delay={idx * 0.05} 
                     unlocked={badge.unlocked}
                  />
               ))}
            </div>
         </div>

         <div className="grid grid-cols-12 gap-8">
            {/* Reward Shop */}
            <div className="col-span-12 lg:col-span-7 bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-6">
               <h2 className="text-2xl font-semibold text-[#2D3748]">Reward Shop</h2>
               <div className="space-y-4">
                  {shopItems.map((item, idx) => (
                     <div key={idx}>
                        <RewardShopItem 
                           icon={item.icon}
                           title={item.title}
                           subtitle={item.subtitle}
                           points={item.points}
                           delay={1.3 + (idx * 0.1)}
                           onRedeem={() => handleRedeem(item)}
                           canAfford={totalPoints >= item.points}
                        />
                        {idx < shopItems.length - 1 && <div className="h-px bg-slate-100 mx-4 mt-4" />}
                     </div>
                  ))}
               </div>
            </div>

            {/* Leaderboard */}
            <div className="col-span-12 lg:col-span-5 bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-6">
               <h2 className="text-2xl font-semibold text-[#2D3748]">Class Leaderboard</h2>
               <div className="space-y-2">
                  {sortedStudents.slice(0, 5).map((row, idx) => (
                     <LeaderboardRow 
                        key={idx} 
                        rank={idx + 1} 
                        name={row.name} 
                        students={row.points} 
                        delay={1.5 + (idx * 0.1)} 
                        avatarUrl={getStudentAvatar ? getStudentAvatar(row.name) : `https://api.dicebear.com/7.x/lorelei/svg?seed=${row.name}`}
                     />
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};

// --- Student Dashboard (Equip Final Redesign) ---
const StudentDashboard = ({ teacher, studentName, classroom, onLogout }) => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [activeMission, setActiveMission] = useState(null);

  const [homeworks, setHomeworks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [classroomStudents, setClassroomStudents] = useState([]);
  const [currentStudentProfile, setCurrentStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
     try {
        const savedStudent = JSON.parse(localStorage.getItem('hwz_active_student'));
        const actualClassroom = classroom || savedStudent?.classroom;
        const actualTeacher = teacher || savedStudent?.teacher;
        
        if (actualClassroom?.id) {
           // Fetch homeworks for this class
           const hwQ = query(collection(db, 'homeworks'), where('assignedClassId', '==', actualClassroom.id));
           const hwSnap = await getDocs(hwQ);
           const hwList = hwSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
           setHomeworks(hwList);
        }
        
        if (actualClassroom?.id && actualTeacher?.uid) {
           // Fetch classroom student rosters
           const studentsSnap = await getDocs(collection(db, 'teachers', actualTeacher.uid, 'classrooms', actualClassroom.id, 'students'));
           setClassroomStudents(studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
           
           // Direct student profile fetch
           const studentRef = doc(db, 'teachers', actualTeacher.uid, 'classrooms', actualClassroom.id, 'students', studentName.toLowerCase());
           const studentSnap = await getDoc(studentRef);
           if (studentSnap.exists()) {
              setCurrentStudentProfile(studentSnap.data());
           }
        }
        
         // 🚀 Hardened Scalable Query: Parallel class-filtered and student-filtered queries!
         if (actualClassroom?.id) {
            const cleanName = studentName?.trim();
            const subQ1 = query(collection(db, 'submissions'), where('classId', '==', actualClassroom.id));
            const subQ2 = query(collection(db, 'submissions'), where('studentName', '==', cleanName));
            const subQ3 = query(collection(db, 'submissions'), where('studentName', '==', toTitleCase(cleanName)));
            const subQ4 = query(collection(db, 'submissions'), where('studentName', '==', cleanName.toLowerCase()));
            const subQ5 = query(collection(db, 'submissions'), where('studentName', '==', cleanName.toUpperCase()));
            
            const [snap1, snap2, snap3, snap4, snap5] = await Promise.all([
               getDocs(subQ1), 
               getDocs(subQ2), 
               getDocs(subQ3),
               getDocs(subQ4),
               getDocs(subQ5)
             ]);
            const combinedMap = {};
            snap1.docs.forEach(doc => combinedMap[doc.id] = { id: doc.id, ...doc.data() });
            snap2.docs.forEach(doc => combinedMap[doc.id] = { id: doc.id, ...doc.data() });
            snap3.docs.forEach(doc => combinedMap[doc.id] = { id: doc.id, ...doc.data() });
            snap4.docs.forEach(doc => combinedMap[doc.id] = { id: doc.id, ...doc.data() });
            snap5.docs.forEach(doc => combinedMap[doc.id] = { id: doc.id, ...doc.data() });
            
            const subList = Object.values(combinedMap);
            setSubmissions(subList);
         } else {
            setSubmissions([]);
         }
     } catch (err) {
        console.error("Dashboard Fetch Data Error:", err);
     }
     setLoading(false);
  };

  useEffect(() => {
     fetchData();
  }, [studentName, classroom, activeNav, teacher]);

  const getStudentAvatar = (name) => {
     const cleanName = name?.trim().toLowerCase();
     
     // 1. Direct logged-in student check
     if (cleanName === studentName?.trim().toLowerCase() || cleanName === currentStudentProfile?.name?.trim().toLowerCase()) {
        if (currentStudentProfile?.avatarUrl) {
           return currentStudentProfile.avatarUrl;
        }
     }
     
     // 2. Search classroom rosters
     const st = classroomStudents.find(s => s.id?.trim().toLowerCase() === cleanName || s.name?.trim().toLowerCase() === cleanName);
     if (st?.avatarUrl) {
        return st.avatarUrl;
     }
     return `https://api.dicebear.com/7.x/lorelei/svg?seed=${name || 'student'}`;
  };

  // Compute dynamic variables
  const normalizeName = (name) => (name || '').trim().toLowerCase().replace(/\s+/g, ' ');
  const mySubmissions = submissions.filter(s => normalizeName(s.studentName) === normalizeName(studentName));
  const completedHwIds = new Set(mySubmissions.map(s => s.homeworkId));
  const pendingHws = homeworks.filter(hw => !completedHwIds.has(hw.id));
  const recentlyGraded = mySubmissions.filter(s => s.feedback).sort((a,b) => b.submittedAt - a.submittedAt);

  // 1. Dynamic To-Do List
  const todoItems = [];
  pendingHws.forEach(hw => {
     const draftStr = localStorage.getItem(`hz_draft_${studentName}_${hw.id}`);
     let hasDraft = false;
     if (draftStr) {
        try {
           const parsed = JSON.parse(draftStr);
           hasDraft = parsed && Object.keys(parsed.answers || {}).length > 0;
        } catch(e) {}
     }

     todoItems.push({
        title: hw.title,
        subtitle: `${hw.subject || 'Homework'} - ${hw.questionCount || 5} Questions`,
        btnText: hasDraft ? "Resume Mission 🚀" : "Start Mission 🚀",
        icon: <BookOpen className="w-5 h-5 text-purple-500" />,
        color: "bg-[#F5F3FF]",
        btnColor: hasDraft ? "bg-indigo-500" : "bg-[#8A70FF]",
        onClick: () => setActiveMission({ id: hw.id })
     });
  });

  recentlyGraded.slice(0, 2).forEach(sub => {
     const correspondingHw = homeworks.find(hw => hw.id === sub.homeworkId);
     todoItems.push({
        title: correspondingHw ? `Review: ${correspondingHw.title}` : "Review Feedback",
        subtitle: `AI Teacher gave encouragement!`,
        btnText: "View Feedback 💬",
        icon: <MessageSquare className="w-5 h-5 text-amber-500" />,
        color: "bg-amber-50",
        btnColor: "bg-amber-500",
        onClick: () => setActiveNav('Mission Reports')
     });
  });

  if (todoItems.length === 0) {
     todoItems.push({
        title: "All Missions Completed! 🎉",
        subtitle: "Awesome job, superstar! You are completely up to date.",
        btnText: "My Rewards 🎁",
        icon: <Trophy className="w-5 h-5 text-emerald-500" />,
        color: "bg-emerald-50",
        btnColor: "bg-emerald-500",
        onClick: () => setActiveNav('My Rewards')
     });
  }

  // 2. Dynamic Learning Path (Grade 2 has Music and Arts, others have standard subjects)
  const subjects = classroom?.selectedSubjects || ['Maths', 'English', 'Science'];
  const learningPath = subjects.map((subName, index) => {
     const hwInSub = homeworks.filter(hw => hw.subject?.toLowerCase() === subName.toLowerCase());
     const completedInSub = hwInSub.filter(hw => completedHwIds.has(hw.id));
     const progress = hwInSub.length > 0 ? Math.round((completedInSub.length / hwInSub.length) * 100) : 0;
     
     const subsInSub = mySubmissions.filter(s => {
        const correspondingHw = homeworks.find(hw => hw.id === s.homeworkId);
        return correspondingHw?.subject?.toLowerCase() === subName.toLowerCase();
     });
     const avgScore = subsInSub.length > 0 ? (subsInSub.reduce((acc, s) => acc + (s.score || 0), 0) / subsInSub.length) : 0;
     const stars = avgScore > 0 ? Math.max(1, Math.min(5, Math.ceil(avgScore / 20))) : 0;

     const colors = ["bg-[#F5F3FF]", "bg-amber-50", "bg-emerald-50", "bg-rose-50", "bg-cyan-50"];
     const color = colors[index % colors.length];

     return {
        title: subName,
        progress,
        stars,
        color,
        active: index === 0
     };
  });

  // 3. Dynamic Ranks & Achievements
  const studentScores = {};
  submissions.forEach(sub => {
     const subName = normalizeName(sub.studentName);
     const isInRoster = classroomStudents.some(s => normalizeName(s.id) === subName || normalizeName(s.name) === subName);
     if (sub.classId === classroom?.id || !classroom?.id || isInRoster) {
        const name = (sub.studentName?.trim() || "Student").replace(/\s+/g, ' ');
        const matchedRosterName = classroomStudents.find(s => normalizeName(s.name) === normalizeName(name))?.name || name;
        studentScores[matchedRosterName] = (studentScores[matchedRosterName] || 0) + (sub.correctCount || 0) * 10;
     }
  });

  const activeRegisteredName = classroomStudents.find(s => normalizeName(s.name) === normalizeName(studentName))?.name || studentName;
  if (studentScores[activeRegisteredName] === undefined) {
     studentScores[activeRegisteredName] = 0;
  }

  const sortedStudents = Object.keys(studentScores)
     .map(name => ({ name, points: studentScores[name] }))
     .sort((a,b) => b.points - a.points);

  const activeStudentRankIdx = sortedStudents.findIndex(s => normalizeName(s.name) === normalizeName(studentName));
  const activeStudentRank = activeStudentRankIdx !== -1 ? activeStudentRankIdx + 1 : 1;

  const leaderStudent = sortedStudents[0] || { name: activeRegisteredName, points: 0 };
  const currentStudentScore = studentScores[activeRegisteredName] || 0;

  // Standings
  const standings = sortedStudents.slice(0, 3).map((st, idx) => ({
     rank: idx + 1,
     name: st.name,
     students: st.points,
     progress: idx === 0 ? "+25" : idx === 1 ? "+15" : "+5",
     color: "text-emerald-500"
  }));

  if (standings.length < 3) {
     const mockPeers = [
        { rank: 1, name: "Vansh Pillai", students: 120, progress: "+20", color: "text-emerald-500" },
        { rank: 2, name: "Ved Pillai", students: 80, progress: "+10", color: "text-emerald-500" },
        { rank: 3, name: studentName, students: currentStudentScore, progress: "+5", color: "text-[#8A70FF]" }
     ];
     mockPeers.forEach(peer => {
        if (peer.name !== studentName && !standings.some(s => s.name === peer.name)) {
           standings.push(peer);
        }
     });
     standings.sort((a,b) => b.students - a.students);
     standings.forEach((s, i) => s.rank = i + 1);
  }

  // Dynamic Badges
  const badges = [
     { icon: "🐦", label: "Early Bird", color: mySubmissions.length >= 1 ? "bg-amber-100" : "bg-slate-50 opacity-40" },
     { icon: "🧮", label: "Math Wizard", color: (mySubmissions.filter(s => {
        const correspondingHw = homeworks.find(hw => hw.id === s.homeworkId);
        return correspondingHw?.subject === 'Maths';
     }).reduce((acc, s) => acc + s.score, 0) / Math.max(1, mySubmissions.filter(s => {
        const correspondingHw = homeworks.find(hw => hw.id === s.homeworkId);
        return correspondingHw?.subject === 'Maths';
     }).length)) >= 80 ? "bg-purple-100" : "bg-slate-50 opacity-40" },
     { icon: "⭐", label: "Star Scholar", color: mySubmissions.some(s => s.score === 100) ? "bg-emerald-100" : "bg-slate-50 opacity-40" },
     { icon: "🏆", label: "Knowledge Champ", color: mySubmissions.length >= 3 ? "bg-rose-100" : "bg-slate-50 opacity-40" }
  ];

  // Dynamic Calendar HW due dates
  const calendarHW = {};
  pendingHws.forEach((hw, idx) => {
     const dayOffset = (idx * 5) + 3;
     calendarHW[dayOffset % 31] = hw.subject;
  });

  // Dynamic Feed reminder
  const feedPosts = [
     {
        author: teacher?.name || "AI Coach",
        time: "Today",
        content: pendingHws.length > 0 
           ? `Hey ${studentName.split(' ')[0]}! You have ${pendingHws.length} fun learning missions waiting for you. Let's start one today! 🚀` 
           : `Wow, superstar! You've completed all of your active missions. Excellent job! 🌟`
     },
     {
        author: "System Bot",
        time: "Yesterday",
        content: "Welcome to the Homework Zone dashboard! Complete missions to earn points and shop in the Reward store! 🎉"
     }
  ];

  if (activeMission) {
     return (
         <div className="student-theme">
            <StudentQuiz 
               homeworkId={activeMission.id} 
               initialSubmission={activeMission.pastSubmission}
               studentName={studentName} 
               teacher={teacher} 
               onComplete={() => setActiveMission(null)} 
            />
         </div>
     );
  }

  return (
<div className="flex h-screen bg-[#F9F9FF] font-sans overflow-hidden student-theme">
      {/* --- Sidebar (High Fidelity) --- */}
      <aside className="w-72 bg-[#FDFDFF] border-r border-blue-50 flex flex-col shrink-0 h-screen">
        <div className="mb-6 -mx-2 flex-center pt-8 shrink-0">
           <img src="/logo.png" className="w-[85%] h-36 object-contain mix-blend-multiply" alt="Homework Zone" />
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
           <SidebarNavItem icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" active={activeNav === 'Dashboard'} color="text-red-500" onClick={() => setActiveNav('Dashboard')} />
           <SidebarNavItem icon={<img src="/ic-homework.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Homework" />} label="My Homework" active={activeNav === 'My Homework'} color="text-pink-500" onClick={() => setActiveNav('My Homework')} />
           <SidebarNavItem icon={<Trophy className="w-5 h-5" />} label="Mission Reports" active={activeNav === 'Mission Reports'} color="text-emerald-500" onClick={() => setActiveNav('Mission Reports')} />
           <SidebarNavItem icon={<User className="w-5 h-5" />} label="My Profile" active={activeNav === 'My Profile'} color="text-purple-500" onClick={() => setActiveNav('My Profile')} />
           <SidebarNavItem icon={<img src="/ic-messages.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Messages" />} label="My Messages" active={activeNav === 'My Messages'} color="text-cyan-500" onClick={() => setActiveNav('My Messages')} />
           <SidebarNavItem icon={<img src="/ic-rewards.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Rewards" />} label="My Rewards" active={activeNav === 'My Rewards'} color="text-orange-500" onClick={() => setActiveNav('My Rewards')} />
        </nav>

        {/* Mascot Bottom */}
        <div className="p-6 shrink-0">
           <div className="bg-amber-50 rounded-[32px] p-8 relative group overflow-hidden border border-amber-100">
              <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full opacity-40" />
              <p className="text-xs font-semibold text-amber-900 leading-tight text-center relative z-10 italic">
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
      <div className="flex-1 flex flex-col h-screen min-w-0 bg-[#F9F9FF] p-4 lg:p-6">
        <div className="flex-1 bg-white rounded-[40px] shadow-sm overflow-hidden flex flex-col border border-slate-100/50 relative">
          
          {activeNav === 'Dashboard' && (
            <nav className="w-full px-8 py-6 flex items-center justify-between shrink-0 border-b border-slate-50/50 bg-white/50 backdrop-blur-md sticky top-0 z-20">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                      <h1 className="text-2xl font-semibold text-[#2D3748] tracking-tighter leading-none">
                        Hello, <span className="text-[#8A70FF]">{studentName || 'Student'}</span>!
                      </h1>
                      <p className="text-base font-semibold text-[#475569] tracking-tight mt-0.5">{classroom?.name ? `${classroom.name} Student` : 'Ready to learn?'}</p>
                  </div>
                  <div className="w-16 h-16 relative">
                      <img src="/assets/owl_mascot.png" className="w-full h-full object-contain drop-shadow-xl animate-float" alt="Owl Mascot" />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                      <button className="w-9 h-9 bg-white rounded-xl flex-center shadow-sm border border-slate-100 hover:scale-110 transition-all overflow-hidden">
                        <img src={getStudentAvatar(studentName)} className="w-full h-full object-cover" alt="Profile" />
                      </button>
                      <button className="w-9 h-9 bg-white rounded-xl flex-center shadow-sm border border-slate-100 text-[#8A70FF] hover:scale-110 transition-all">
                        <Plus className="w-5 h-5" />
                      </button>
                      <button className="w-9 h-9 bg-white rounded-xl flex-center shadow-sm border border-slate-100 text-[#8A70FF] hover:scale-110 transition-all">
                        <Bell className="w-5 h-5" />
                      </button>
                  </div>
                  <div className="flex items-center gap-1 border-b-2 border-[#8A70FF] pb-1 cursor-pointer">
                      <span className="text-base font-semibold text-[#2D3748]">{activeNav}</span>
                  </div>
                  <button onClick={onLogout} className="flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-xl text-[9px] font-semibold text-rose-600 hover:bg-rose-100 transition-all border border-rose-100 shadow-sm"><LogOut className="w-3.5 h-3.5" /> Sign Out</button>
                </div>
            </nav>
          )}

          {/* --- Dashboard Grid / Content --- */}
          <main className="flex-1 overflow-y-auto no-scrollbar px-8 py-8">
            <div className="max-w-[100%] mx-auto w-full">
           {activeNav === 'Dashboard' && (
              <div className="grid grid-cols-12 gap-6 animate-in fade-in duration-300">
                 {/* Row 1 Left: To-Do List */}
                 <div className="col-span-12 lg:col-span-5 bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-6">
                    <h2 className="text-xl font-semibold text-[#2D3748]">To-Do List</h2>
                    <div className="space-y-3">
                       {todoItems.slice(0, 3).map((item, idx) => (
                          <TodoCard 
                             key={idx}
                             title={item.title} 
                             subtitle={item.subtitle} 
                             btnText={item.btnText} 
                             icon={item.icon}
                             color={item.color}
                             btnColor={item.btnColor}
                             onClick={item.onClick}
                          />
                       ))}
                    </div>
                 </div>

                 {/* Row 1 Right: My Learning Path */}
                 <div className="col-span-12 lg:col-span-7 bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-6 relative overflow-hidden">
                    <h2 className="text-xl font-semibold text-[#2D3748]">My Learning Path</h2>
                    <div className="flex items-center gap-4 relative">
                       <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0" />
                       {learningPath.map((pathItem, idx) => (
                          <LearningPathCard 
                             key={idx}
                             title={pathItem.title} 
                             progress={pathItem.progress} 
                             stars={pathItem.stars} 
                             color={pathItem.color} 
                             active={pathItem.active} 
                          />
                       ))}
                    </div>
                 </div>

                 {/* Row 2 Left: Recent Achievements */}
                 <div className="col-span-12 lg:col-span-8 bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-6">
                    <h2 className="text-xl font-semibold text-[#2D3748]">My Recent Achievements</h2>
                    <div className="grid grid-cols-12 gap-6 items-center">
                       <div className="col-span-7 grid grid-cols-4 gap-3">
                          {badges.map((badge, idx) => (
                             <AchievementBadge key={idx} icon={badge.icon} label={badge.label} color={badge.color} />
                          ))}
                          <div className="col-span-4 pt-2">
                             <button onClick={() => setActiveNav('My Rewards')} className="bg-[#8A70FF] text-white px-6 py-2 rounded-xl font-semibold text-[10px] shadow-lg hover:scale-105 transition-all">View All Badges</button>
                          </div>
                       </div>
                       <div className="col-span-5 flex gap-3">
                          <RankCard rank={1} name={leaderStudent.name} detail="Class Leader" isAlt={false} avatarUrl={getStudentAvatar(leaderStudent.name)} />
                          <RankCard rank={activeStudentRank} name={studentName} detail={`${currentStudentScore} Points`} isAlt={true} avatarUrl={getStudentAvatar(studentName)} />
                       </div>
                    </div>
                 </div>

                 {/* Row 2 Right: Class Standings */}
                 <div className="col-span-12 lg:col-span-4 bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-6">
                    <h2 className="text-xl font-semibold text-[#2D3748]">Class Standings</h2>
                    <div className="space-y-4">
                       {standings.map((row, idx) => (
                          <StandingRow 
                             key={idx}
                             rank={row.rank} 
                             name={row.name} 
                             students={row.students} 
                             progress={row.progress} 
                             color={row.color} 
                             avatarUrl={getStudentAvatar(row.name)}
                          />
                       ))}
                    </div>
                 </div>

                 {/* Row 3 Left: Calendar */}
                 <div className="col-span-12 lg:col-span-8 bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-4">
                    <div className="grid grid-cols-7 text-center border-b border-slate-50 pb-2">
                       {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <span key={day} className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">{day}</span>
                       ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                       {[...Array(35)].map((_, i) => {
                          const day = (i % 31) + 1;
                          const hwDue = calendarHW[day];
                          return (
                             <div key={i} className={`h-16 border border-slate-50 rounded-xl p-1.5 relative group hover:bg-slate-50 transition-all ${i === 3 ? 'bg-[#F5F3FF]/50' : ''}`}>
                                <span className="text-[10px] font-semibold text-slate-400">{day}</span>
                                {i === 3 && <div className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full bg-orange-400 border-2 border-white animate-ping" />}
                                {hwDue && (
                                   <div className="mt-1 bg-[#F5F3FF] text-[#8A70FF] text-[6px] font-black p-0.5 rounded-md truncate uppercase tracking-tighter">Due {hwDue}</div>
                                )}
                             </div>
                          );
                       })}
                    </div>
                 </div>

                 {/* Row 3 Right: Teacher Feed */}
                 <div className="col-span-12 lg:col-span-4 bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-6">
                    <h2 className="text-xl font-semibold text-[#2D3748]">Teacher Feed</h2>
                    <div className="space-y-6">
                       {feedPosts.map((post, idx) => (
                          <FeedPost 
                             key={idx}
                             author={post.author} 
                             time={post.time} 
                             content={post.content} 
                             avatarUrl={getStudentAvatar(post.author)}
                          />
                       ))}
                    </div>
                 </div>
              </div>
           )}

           {activeNav === 'My Homework' && (
              <MyHomework studentName={studentName} teacher={teacher} homeworks={homeworks} submissions={mySubmissions} onStartMission={(id, pastSubmission) => setActiveMission({ id, pastSubmission })} />
           )}

           {activeNav === 'Mission Reports' && (
              <MissionReports studentName={studentName} teacher={teacher} submissions={mySubmissions} />
           )}

           {activeNav === 'My Rewards' && (
              <MyRewards 
                  studentName={studentName} 
                  classroom={classroom}
                  homeworks={homeworks}
                  submissions={submissions}
                  getStudentAvatar={getStudentAvatar}
                  classroomStudents={classroomStudents}
               />
           )}

           {activeNav === 'My Messages' && (
              <MessagingModule studentName={studentName} teacher={teacher} classroom={classroom} getStudentAvatar={getStudentAvatar} />
           )}

           {activeNav === 'My Profile' && (
              <StudentProfile 
                 studentName={studentName} 
                 teacher={teacher} 
                 classroom={classroom} 
                 onProfileUpdate={() => fetchData()}
              />
           )}
        </div>
          </main>
        </div>
        <GrassBorder />
      </div>
    </div>
  );
};

const SidebarNavItem = ({ icon, label, active, color, onClick }) => (
  <div className="px-4">
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-3.5 cursor-pointer transition-all group rounded-2xl ${
        active 
          ? 'bg-[#8A70FF] text-white shadow-lg shadow-purple-200 font-semibold' 
          : 'text-[#64748B] hover:bg-slate-50'
      }`}
    >
      <div className={`w-5 h-5 flex-center transition-transform group-hover:scale-110 ${active ? 'text-white' : color}`}>
         {React.isValidElement(icon) && icon.type === 'img' ? icon : React.cloneElement(icon, { size: 20, strokeWidth: 3 })}
      </div>
      <span className="text-sm tracking-tight">{label}</span>
    </button>
  </div>
);

const TodoCard = ({ title, subtitle, btnText, icon, color, btnColor, onClick }) => (
   <div className={`${color} p-6 rounded-[32px] flex items-center justify-between group transition-all hover:scale-[1.02] border border-white/50 shadow-sm`}>
      <div className="flex items-center gap-6">
         <div className="w-14 h-14 bg-white rounded-2xl flex-center shadow-sm group-hover:scale-110 transition-transform">{icon}</div>
         <div className="space-y-1">
            <p className="text-base font-semibold text-[#2D3748]">{title}</p>
            <p className="text-[10px] font-semibold text-slate-400 italic">{subtitle}</p>
         </div>
      </div>
      <button onClick={onClick} className={`${btnColor} text-white px-6 py-3 rounded-2xl font-semibold text-xs shadow-lg hover:brightness-110 transition-all`}>{btnText}</button>
   </div>
);

const LearningPathCard = ({ title, progress, stars, color, active }) => (
   <div className={`flex-1 ${color} p-6 rounded-[32px] border-4 ${active ? 'border-[#8A70FF]' : 'border-white'} shadow-xl z-10 space-y-6 relative group hover:-translate-y-2 transition-all`}>
      <div className="absolute -top-4 -left-4 w-10 h-10 bg-white rounded-full flex-center shadow-md text-[#FBBF24]">
         <Star className="w-6 h-6 fill-current" />
      </div>
      <div className="space-y-2">
         <p className="text-sm font-semibold text-[#2D3748] leading-tight h-10 overflow-hidden">{title}</p>
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
         <span className="text-[10px] font-semibold text-slate-400">{progress}%</span>
      </div>
      <button className="w-full bg-[#8A70FF] text-white py-2 rounded-xl font-semibold text-[10px] shadow-md">Resume Learning</button>
   </div>
);

const AchievementBadge = ({ icon, label, color }) => (
   <div className="flex flex-col items-center gap-2 group cursor-pointer">
      <div className={`w-14 h-14 ${color} rounded-full flex-center text-2xl shadow-sm border-2 border-white group-hover:scale-110 transition-transform`}>{icon}</div>
      <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest text-center">{label}</span>
   </div>
);

const RankCard = ({ rank, name, detail, isAlt, avatarUrl }) => (
   <div className={`flex-1 ${isAlt ? 'bg-amber-50 border-amber-100' : 'bg-[#F5F3FF] border-purple-100'} p-6 rounded-[32px] border flex flex-col items-center text-center gap-4 relative overflow-hidden group hover:scale-105 transition-all shadow-sm`}>
      <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/50 rounded-full flex-center font-semibold text-2xl text-[#2D3748]/20">{rank}</div>
      <div className="w-16 h-16 rounded-full border-2 border-white bg-white p-1 overflow-hidden">
         <img src={avatarUrl || `https://api.dicebear.com/7.x/lorelei/svg?seed=${name}`} className="w-full h-full object-cover" alt={name} />
      </div>
      <div>
         <p className="text-xs font-semibold text-[#2D3748]">{name}</p>
         <p className="text-[10px] font-semibold text-slate-400">{detail}</p>
      </div>
      <Trophy className={`w-5 h-5 ${isAlt ? 'text-amber-400' : 'text-blue-400'}`} />
   </div>
);

const StandingRow = ({ rank, name, students, progress, color, avatarUrl }) => (
   <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-100 group">
      <div className="flex items-center gap-4">
         <span className="text-lg font-semibold text-[#2D3748] w-6">{rank}</span>
         <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-50 overflow-hidden">
            <img src={avatarUrl || `https://api.dicebear.com/7.x/lorelei/svg?seed=${name}`} className="w-full h-full object-cover" alt={name} />
         </div>
         <div>
            <p className="text-sm font-semibold text-[#2D3748]">{name}</p>
            <p className="text-[9px] font-semibold text-slate-400">Total {students} Points</p>
         </div>
      </div>
      <span className={`text-[10px] font-semibold ${color}`}>{progress}</span>
   </div>
);

const FeedPost = ({ author, time, content, avatarUrl }) => (
   <div className="space-y-4 group p-4 hover:bg-slate-50/50 rounded-3xl transition-all border border-transparent hover:border-slate-100">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-50 overflow-hidden">
               <img src={avatarUrl || `https://api.dicebear.com/7.x/lorelei/svg?seed=${author}`} className="w-full h-full object-cover" alt={author} />
            </div>
            <div>
               <p className="text-sm font-semibold text-[#2D3748]">{author}</p>
               <p className="text-[10px] font-semibold text-slate-300 italic">{time}</p>
            </div>
         </div>
         <MoreVertical className="w-4 h-4 text-slate-300" />
      </div>
      <p className="text-xs font-semibold text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-[28px] border border-slate-50 group-hover:bg-white group-hover:shadow-md transition-all">{content}</p>
      <div className="flex items-center gap-4 ml-2">
         <div className="flex items-center gap-1.5 text-slate-300"><MessageSquare className="w-3.5 h-3.5" /> <span className="text-[10px] font-semibold">1</span></div>
         <div className="flex items-center gap-1.5 text-slate-300"><Heart className="w-3.5 h-3.5" /> <span className="text-[10px] font-semibold">2</span></div>
      </div>
   </div>
);

const EquipSidebarItem = ({ icon, label, active }) => (
  <div className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl cursor-pointer transition-all border-2 ${active ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-[#8A70FF] border-purple-100 font-semibold' : 'text-slate-400 border-transparent hover:bg-slate-50 hover:text-slate-800'}`}>
    {icon}
    <span className="text-sm tracking-tight">{label}</span>
  </div>
);

const MetricCard = ({ label, value, trend, icon, active }) => (
  <div className={`bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-4 hover:shadow-xl transition-all group cursor-pointer ${active ? 'ring-2 ring-emerald-100' : ''}`}>
    <div className="flex items-center justify-between">
       <div className="w-12 h-12 bg-slate-50 rounded-2xl flex-center shadow-inner group-hover:scale-110 transition-transform">{icon}</div>
       {trend && <span className="text-emerald-500 text-[10px] font-semibold bg-emerald-50 px-2 py-1 rounded-lg">{trend}</span>}
    </div>
    <div className="space-y-1">
       <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{label}</p>
       <p className="text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  </div>
);

const SubjectBar = ({ label, value, color }) => (
  <div className="space-y-2">
     <div className="flex justify-between items-center">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{label}</span>
        <span className="text-xs font-semibold text-slate-900">{value}%</span>
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
        <p className="text-xs font-semibold text-slate-700">{label}</p>
     </div>
     <p className="text-xs font-semibold text-[#8A70FF]">{score}</p>
  </div>
);

const LegendItem = ({ label, value, color }) => (
  <div className="flex items-center gap-2">
     <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
     <span className="text-[10px] font-semibold text-slate-400">{label} {value}</span>
  </div>
);

// --- Landing Page (Redesigned from Reference) ---
const LandingPage = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

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
               <h1 className="text-5xl md:text-7xl font-semibold text-[#2D3748] tracking-tighter leading-none flex items-center gap-2">
                 HOMEWORK <br /> ZONE
               </h1>
            </div>
         </div>

      </header>
      {/* --- Expandable Login Bar --- */}
      <section className="max-w-[95%] mx-auto px-6 mb-10 relative z-30">
         <AnimatePresence mode="wait">
            {!isExpanded ? (
               <motion.button
                  layoutId="login-bar"
                  onClick={() => setIsExpanded(true)}
                  className="w-full bg-[#38BDF8] hover:bg-[#8A70FF] text-white border-[6px] border-[#2D3748] py-6 px-10 rounded-[32px] font-semibold text-2xl md:text-4xl uppercase tracking-wider shadow-[0_10px_0_0_#2D3748] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-4 cursor-pointer"
               >
                  <span>🔑 Click to Enter Your Homework Zone!</span>
                  <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>🚀</motion.span>
               </motion.button>
            ) : (
               <motion.div
                  layoutId="login-bar"
                  className="w-full bg-white border-[8px] border-[#2D3748] p-10 rounded-[48px] shadow-[0_20px_0_0_#2D3748] space-y-8 relative"
               >
                  <button 
                     onClick={() => setIsExpanded(false)}
                     className="absolute top-6 right-6 w-12 h-12 bg-slate-50 border-4 border-[#2D3748] rounded-full flex-center text-[#2D3748] hover:bg-slate-100 font-black text-xl shadow-[2px_2px_0_0_#2D3748] active:translate-y-0.5 active:shadow-none transition-all"
                  >
                     ✕
                  </button>
                  <div className="text-center space-y-2">
                     <h3 className="text-3xl font-semibold text-[#2D3748] uppercase tracking-tight">Select your portal to start! 🚀</h3>
                     <p className="text-sm font-semibold uppercase text-slate-400 tracking-wider">Are you a student or a teacher/parent?</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div 
                        onClick={() => navigate('/login/student')}
                        className="group bg-[#E0F2FE] hover:bg-[#BAE6FD] border-6 border-[#2D3748] rounded-[36px] p-8 text-center cursor-pointer transition-all hover:-translate-y-2 shadow-[0_10px_0_0_#2D3748] active:translate-y-1 active:shadow-none"
                     >
                        <div className="w-20 h-20 bg-white rounded-3xl border-4 border-[#2D3748] flex-center mx-auto shadow-[4px_4px_0_0_#2D3748] mb-6 group-hover:rotate-6 transition-all">
                           <span className="text-4xl">🎒</span>
                        </div>
                        <h4 className="text-2xl font-semibold text-[#2D3748] uppercase mb-2">Student Portal</h4>
                        <p className="text-xs font-semibold text-[#475569] uppercase tracking-wider mb-6">Start your learning missions & earn points!</p>
                        <button className="bg-[#38BDF8] text-white border-4 border-[#2D3748] px-8 py-3 rounded-2xl font-bold uppercase tracking-wider shadow-[0_4px_0_0_#2D3748] group-hover:bg-[#8A70FF] transition-all">
                           Let's Go!
                        </button>
                     </div>
                     <div 
                        onClick={() => navigate('/login/teacher')}
                        className="group bg-[#FEF3C7] hover:bg-[#FDE68A] border-6 border-[#2D3748] rounded-[36px] p-8 text-center cursor-pointer transition-all hover:-translate-y-2 shadow-[0_10px_0_0_#2D3748] active:translate-y-1 active:shadow-none"
                     >
                        <div className="w-20 h-20 bg-white rounded-3xl border-4 border-[#2D3748] flex-center mx-auto shadow-[4px_4px_0_0_#2D3748] mb-6 group-hover:-rotate-6 transition-all">
                           <span className="text-4xl">🍎</span>
                        </div>
                        <h4 className="text-2xl font-semibold text-[#2D3748] uppercase mb-2">Teacher & Parent Zone</h4>
                        <p className="text-xs font-semibold text-[#475569] uppercase tracking-wider mb-6">Create homework, manage classes & grades!</p>
                        <button className="bg-[#F59E0B] text-white border-4 border-[#2D3748] px-8 py-3 rounded-2xl font-bold uppercase tracking-wider shadow-[0_4px_0_0_#2D3748] group-hover:bg-[#D97706] transition-all">
                           Sign In
                        </button>
                     </div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </section>

      {/* --- Main Hero Banner Area --- */}
      <section className="max-w-[95%] mx-auto px-6 mt-8">
         <div className="relative bg-white rounded-[60px] border-[12px] border-[#2D3748] shadow-[0_30px_0_0_#2D3748] overflow-hidden group">
            {/* The Kids & School Illustration */}
            <div className="relative h-[480px] sm:h-[580px] md:h-[720px] lg:h-[820px] xl:h-[900px]">
               <img 
                  src="/assets/hero_banner.png" 
                  className="w-full h-full object-cover" 
                  style={{ objectPosition: 'center 62%' }}
                  alt="Homework Zone Adventure" 
               />
               
               {/* Welcome Banner Overlay */}
               <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[90%] md:w-auto text-center">
                  <div className="bg-[#FBBF24] border-[6px] border-[#2D3748] px-16 py-8 rounded-[40px] shadow-[8px_8px_0_0_#2D3748] transform -rotate-1">
                     <h2 className="text-4xl md:text-6xl font-semibold text-[#2D3748] uppercase tracking-tight leading-tight">
                        Welcome to your Homework Zone!
                     </h2>
                     <p className="text-sm md:text-xl font-semibold text-[#475569] uppercase tracking-[0.2em] mt-2">
                        Fun places for learning & adventure!
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- Simple Footer Icons --- */}
      <footer className="max-w-[95%] mx-auto px-6 mt-32 flex items-center justify-between py-10 border-t-8 border-white/20">
         <div />
         <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest italic">© 2026 HOMEWORK ZONE ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
};


// --- Mock Login Pages ---
const LoginPage = ({ role, onLogin }) => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [studentName, setStudentName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async () => {
    setErrorMsg('');
    if (role === 'student' && (!code || !studentName)) {
      setErrorMsg("Please enter both the Teacher Code and your name! 🎒");
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
          if (!teacherCode) {
            teacherCode = generateTeacherCode();
            await setDoc(userDoc, { teacherCode }, { merge: true });
          }
        }
        onLogin({ 
          uid: result.user.uid, 
          email: result.user.email, 
          displayName: result.user.displayName, 
          teacherCode 
        });
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
          let matchedStudentName = null;

          const normalizeName = (name) => (name || '').trim().toLowerCase().replace(/\s+/g, ' ');
          const cleanInputName = normalizeName(studentName);

          for (const classDoc of classroomsSnap.docs) {
             const studentsRef = collection(db, 'teachers', teacherDoc.id, 'classrooms', classDoc.id, 'students');
             const studentsSnap = await getDocs(studentsRef);
             
             const matchedDoc = studentsSnap.docs.find(stDoc => {
                const stData = stDoc.data();
                return normalizeName(stDoc.id) === cleanInputName || 
                       normalizeName(stData.name) === cleanInputName;
             });

             if (matchedDoc) {
                studentFound = true;
                studentClass = { id: classDoc.id, ...classDoc.data() };
                matchedStudentName = matchedDoc.data().name || matchedDoc.id;
                break;
             }
          }

          if (studentFound) {
             onLogin({ teacher: { uid: teacherDoc.id, ...teacherData }, name: matchedStudentName, classroom: studentClass });
             navigate('/dashboard/student');
          } else {
             setErrorMsg("Oops! Your name isn't on the class list yet. Talk to your teacher to join the Homework Zone! 🍎");
             alert("Oops! Your name isn't on the class list yet. Talk to your teacher to join the Homework Zone! 🍎");
          }
        } else {
          setErrorMsg("Invalid Teacher Code. Please check with your teacher! 🔍");
          alert("Invalid Teacher Code. Please check with your teacher! 🔍");
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMsg("Login failed. Please try again! 🔄");
      alert("Login failed. Please try again! 🔄");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#E0F2FE] flex-center p-6 relative overflow-hidden">
      <div className="absolute top-10 left-1/2 -translate-x-1/2">
         <div className="bg-[#FBBF24] border-4 border-[#2D3748] px-10 py-4 rounded-3xl shadow-[4px_4px_0_0_#2D3748] transform rotate-1">
            <h2 className="text-2xl font-semibold text-[#2D3748] uppercase tracking-tight">{role === 'teacher' ? 'TEACHER LOGIN' : 'STUDENT PORTAL'}</h2>
         </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full p-12 space-y-10 bg-white rounded-[40px] border-8 border-[#2D3748] shadow-[0_20px_0_0_#2D3748] relative z-10"
      >
        <div className="text-center space-y-3">
          <p className="text-xs text-slate-400 uppercase font-semibold tracking-[0.25em]">
            {role === 'teacher' ? 'Manage your world' : 'Enter your details'}
          </p>
        </div>

        <div className="space-y-6">
          {role === 'teacher' ? (
            <div className="flex flex-col items-center gap-6">
               <img src="https://img.icons8.com/color/96/google-logo.png" className="w-16 h-16" alt="Google" />
               <p className="text-xs font-semibold text-slate-500 text-center">Sign in with your school Google account to manage your Homework Zone.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-semibold uppercase text-slate-400 tracking-[0.1em] block text-left ml-4">Teacher Code</label>
                <input 
                  type="text" 
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="EX: HWZ123" 
                  className="w-full p-4 rounded-2xl border-4 border-slate-100 outline-none focus:border-[#38BDF8] transition-all font-semibold text-center text-xl tracking-widest uppercase" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-semibold uppercase text-slate-400 tracking-[0.1em] block text-left ml-4">Your Name</label>
                <input 
                  type="text" 
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g., Dante" 
                  className="w-full p-4 rounded-2xl border-4 border-slate-100 outline-none focus:border-[#38BDF8] transition-all font-semibold text-center text-xl uppercase tracking-widest" 
                />
              </div>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border-4 border-[#2D3748] text-rose-600 px-6 py-4 rounded-3xl text-sm font-black text-center shadow-[4px_4px_0_0_#2D3748] animate-bounce-short">
             {errorMsg}
          </div>
        )}

        <button 
          onClick={handleSubmit} 
          disabled={isLoading}
          className={`${isLoading ? 'bg-slate-300' : 'bg-[#38BDF8] hover:bg-[#8A70FF]'} text-white border-4 border-[#2D3748] w-full py-5 rounded-3xl font-semibold text-xl uppercase tracking-tighter shadow-[0_8px_0_0_#2D3748] active:translate-y-1 active:shadow-none transition-all`}
        >
          {isLoading ? 'Wait for it...' : role === 'teacher' ? 'Sign in with Google' : "Let's Go!"}
        </button>

        <p className="text-center text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
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
        const userData = docSnap.exists() ? { 
          uid: user.uid, 
          email: user.email, 
          displayName: user.displayName, 
          ...docSnap.data() 
        } : { 
          uid: user.uid, 
          email: user.email, 
          displayName: user.displayName 
        };
        console.log("App: Setting currentUser:", userData);
        setCurrentUser(userData);
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

  const handleTeacherLogout = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
      window.location.href = '/'; // Clean reset to landing
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleStudentLogout = () => {
    setActiveStudent(null);
    localStorage.removeItem('hwz_active_student');
    window.location.href = '/'; // Clean reset to landing
  };

  const handleStudentLogin = async (data) => {
    const studentData = {
      teacher: data.teacher,
      name: data.name,
      classroom: data.classroom
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
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/teacher" element={<LoginPage role="teacher" onLogin={setCurrentUser} />} />
        <Route path="/login/student" element={<div className="student-theme"><LoginPage role="student" onLogin={handleStudentLogin} /></div>} />
        <Route path="/dashboard/teacher" element={currentUser ? <TeacherDashboard user={currentUser} onLogout={handleTeacherLogout} /> : <Navigate to="/login/teacher" />} />
        <Route path="/dashboard/student" element={<div className="student-theme"><StudentDashboard teacher={activeStudent?.teacher} studentName={activeStudent?.name} classroom={activeStudent?.classroom} onLogout={handleStudentLogout} /></div>} />
        <Route path="/quiz/sample" element={<StudentQuiz />} />
      </Routes>
    </Router>
  );
}
