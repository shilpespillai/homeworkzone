import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  ChevronLeft,
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
  FlaskConical,
  X,
  Compass,
  Map,
  CreditCard,
  Palette
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentQuiz from './pages/StudentQuiz';
import { auth, db, googleProvider } from './firebase';
import { signInWithPopup, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, orderBy, arrayUnion, onSnapshot, limit } from 'firebase/firestore';
import MessagingModule from './components/MessagingModule';
import VirtualPetCompanionWidget from './components/VirtualPetCompanionWidget';
import PiggyBankWidget from './components/PiggyBankWidget';
import AdventureMazeView from './components/AdventureMazeView';
import LibraryZoneView from './components/LibraryZoneView';
import ArtsAndFunView from './components/ArtsAndFunView';
import ChildReportView from './components/ChildReportView';
import MathsLearningHub from './components/MathsLearningHub';
import BodyAndFunctionsHub from './components/BodyAndFunctionsHub';
import TeethAndFunctionsHub from './components/TeethAndFunctionsHub';
import NutritionAndDietHub from './components/NutritionAndDietHub';
import WaterCycleHub from './components/WaterCycleHub';
import StatesOfMatterHub from './components/StatesOfMatterHub';
import ClassificationOfLivingThingsHub from './components/ClassificationOfLivingThingsHub';
import AstronomyHub from './components/AstronomyHub';
import PlantsHub from './components/PlantsHub';
import ElectricityHub from './components/ElectricityHub';
import ForceAndMotionHub from './components/ForceAndMotionHub';
import MaterialsAndPropertiesHub from './components/MaterialsAndPropertiesHub';
import EcosystemsHub from './components/EcosystemsHub';
import HeatAndThermalEnergyHub from './components/HeatAndThermalEnergyHub';
import ConservationHub from './components/ConservationHub';
import FossilsHub from './components/FossilsHub';
import MagnetsHub from './components/MagnetsHub';
import LightHub from './components/LightHub';
import HeredityHub from './components/HeredityHub';
import RocksHub from './components/RocksHub';
import UnitsOfMeasurementHub from './components/UnitsOfMeasurementHub';
import TuitionPayment from './pages/TuitionPayment';
import PlatformDocumentation from './pages/PlatformDocumentation';

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

// --- NAPLAN Umbrella Mapping ---
export const getNaplanUmbrella = (subject, title) => {
   const lowerTitle = (title || '').toLowerCase();
   const lowerSub = (subject || '').toLowerCase();

   if (lowerSub.includes('math')) {
      if (/fraction|decimal|percent|ratio|rate|number|algebra|equation|pattern|multiply|divide|add|subtract|integer|factor|multiple/i.test(lowerTitle)) {
         return 'Number & Algebra';
      }
      if (/geometry|shape|symmetry|area|perimeter|volume|time|angle|map|spatial|location|3d/i.test(lowerTitle)) {
         return 'Measurement & Geometry';
      }
      if (/data|graph|chance|probability|statistic|average|mean|median|mode/i.test(lowerTitle)) {
         return 'Statistics & Probability';
      }
      return 'General Numeracy';
   }

   if (lowerSub.includes('english') || lowerSub.includes('literacy')) {
      if (/comprehension|read|infer|idea/i.test(lowerTitle)) {
         return 'Reading Comprehension';
      }
      if (/grammar|punctuate|sentence|tense|comma|apostrophe/i.test(lowerTitle)) {
         return 'Grammar & Punctuation';
      }
      if (/spell|phonic|word/i.test(lowerTitle)) {
         return 'Spelling';
      }
      if (/write|narrative|persuade|inform|compose/i.test(lowerTitle)) {
         return 'Writing & Composition';
      }
      return 'General Literacy';
   }

   if (lowerSub.includes('science')) {
      if (/bio|ecosystem|body|plant|animal|life/i.test(lowerTitle)) {
         return 'Biological Sciences';
      }
      if (/chem|matter|mixture|reaction/i.test(lowerTitle)) {
         return 'Chemical Sciences';
      }
      if (/earth|space|solar|geolog|weather/i.test(lowerTitle)) {
         return 'Earth & Space Sciences';
      }
      if (/physic|force|motion|energy|light|sound/i.test(lowerTitle)) {
         return 'Physical Sciences';
      }
      return 'General Science';
   }

   return title || 'Other Topics';
};

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

// --- Birthday Celebrations & Sprinkles components ---
const SprinklesBurst = () => {
   const particles = Array.from({ length: 45 });
   return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         {particles.map((_, i) => {
            const colors = ['#FFF', '#FFD700', '#FF69B4', '#00FFFF', '#ADFF2F', '#FF4500', '#EE82EE'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const angle = Math.random() * Math.PI * 2;
            const speed = 70 + Math.random() * 180;
            const tx = Math.cos(angle) * speed;
            const ty = Math.sin(angle) * speed - (30 + Math.random() * 60);
            const size = 6 + Math.random() * 8;
            const duration = 1.2 + Math.random() * 1.5;
            const delay = Math.random() * 0.4;
            
            const style = {
               position: 'absolute',
               left: '50%',
               top: '50%',
               width: `${size}px`,
               height: `${size}px`,
               backgroundColor: randomColor,
               borderRadius: Math.random() > 0.5 ? '50%' : '20%',
               transform: 'translate(-50%, -50%)',
               opacity: 0.9,
               animation: `sprinkle-fly ${duration}s cubic-bezier(0.1, 0.8, 0.3, 1) ${delay}s forwards`,
               '--tx': `${tx}px`,
               '--ty': `${ty}px`,
            };
            
            return <div key={i} style={style} />;
         })}
      </div>
   );
};

const BirthdayCelebration = ({ students }) => {
   const [burstKey, setBurstKey] = useState(0);
   const names = students.map(s => s.name).join(" & ");
   return (
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-400 via-orange-400 to-green-500 p-6 rounded-[32px] shadow-lg text-white mb-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-bounce-subtle">
         {/* Beautiful floating sprinkles/emojis */}
         <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-2 left-4 text-xl animate-ping select-none">🍬</div>
            <div className="absolute top-6 right-12 text-2xl animate-bounce select-none">✨</div>
            <div className="absolute bottom-3 left-1/3 text-lg animate-pulse select-none">🎈</div>
            <div className="absolute bottom-2 right-1/4 text-xl animate-bounce select-none">🧁</div>
            <div className="absolute top-1/2 left-10 text-lg animate-bounce select-none">🎉</div>
         </div>
         
         <div className="flex items-center gap-4 z-10">
            <div className="text-4xl">🎂</div>
            <div>
               <h3 className="text-xl font-black tracking-tight drop-shadow-sm">Hurray Its {names}'s birthday today!</h3>
               <p className="text-xs font-bold text-white/90">Let's celebrate and have a super fun learning day! 🎈✨</p>
            </div>
         </div>
         
         <div className="z-10">
            <button 
               onClick={() => setBurstKey(prev => prev + 1)}
               className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all border border-white/30 shadow-sm active:scale-95"
            >
               More Sprinkles 🎉
            </button>
         </div>
         
         <SprinklesBurst key={burstKey} />
      </div>
   );
};

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

  const handleSaveAvatar = async (avatarUrlToSave, isCustom = false) => {
     try {
        const savedStudent = JSON.parse(localStorage.getItem('hwz_active_student'));
        const actualClass = classroom || savedStudent?.classroom;
        const actualTeacher = teacher || savedStudent?.teacher;
        
        if (savedStudent && actualClass && actualTeacher) {
           const studentRef = doc(db, 'teachers', actualTeacher.uid, 'classrooms', actualClass.id, 'students', studentName?.trim().toLowerCase());
           
           const updateData = {
              avatarUrl: avatarUrlToSave,
              updatedAt: new Date().toISOString()
           };
           if (isCustom) {
              updateData.customAvatars = arrayUnion(avatarUrlToSave);
           }
           
           // Instantly write new avatar choice to Firestore
           await setDoc(studentRef, updateData, { merge: true });
           
           // Sync state instantly
           setProfile(prev => {
              const currentCustoms = prev.customAvatars || (prev.customAvatarUrl ? [prev.customAvatarUrl] : []);
              const newCustoms = isCustom && !currentCustoms.includes(avatarUrlToSave) 
                  ? [...currentCustoms, avatarUrlToSave] 
                  : currentCustoms;
              return { 
                 ...prev, 
                 avatarUrl: avatarUrlToSave, 
                 ...(isCustom && { customAvatars: newCustoms }) 
              };
           });
           
           // Notify parent dashboard to reload rosters
           if (onProfileUpdate) {
              onProfileUpdate();
           }
        }
     } catch (err) {
        console.error("Instant Save Avatar Error:", err);
     }
  };

  const redeemedItems = profile.redeemedItems || [];
  const hasAstronaut = redeemedItems.includes("Astronaut Helmet 🧑‍🚀");
  const hasPandaBuddy = redeemedItems.includes("Panda Buddy 🐼");

  const customUploads = profile.customAvatars || (profile.customAvatarUrl ? [profile.customAvatarUrl] : []);
  if (customUploads.length === 0 && profile.avatarUrl?.startsWith('data:image')) {
     customUploads.push(profile.avatarUrl);
  }

  const animatedMascots = [
     ...customUploads.map((url, i) => ({ name: `Photo ${i + 1} 📸`, url })),
     { name: "Owl 🦉", url: "https://img.icons8.com/fluency/96/owl.png" },
     { name: "Fox 🦊", url: "https://img.icons8.com/fluency/96/fox.png" },
     { name: "Cat 🐱", url: "https://img.icons8.com/fluency/96/cat.png" },
     { name: "Lion 🦁", url: "https://img.icons8.com/fluency/96/lion-head.png" },
     { name: "Koala 🐨", url: "https://img.icons8.com/fluency/96/koala.png" },
     { name: "Dino 🦖", url: "https://img.icons8.com/fluency/96/dinosaur.png" },
     { name: "Unicorn 🦄", url: "https://img.icons8.com/fluency/96/unicorn.png" },
     { name: "Tiger 🐯", url: "https://img.icons8.com/fluency/96/tiger.png" },
     ...(hasAstronaut ? [{ name: "Astronaut 🧑‍🚀", url: "https://img.icons8.com/fluency/96/astronaut.png", isPremium: true }] : []),
     ...(hasPandaBuddy ? [{ name: "Panda Buddy 🐼", url: "https://img.icons8.com/fluency/96/panda.png", isPremium: true }] : [])
  ];

  useEffect(() => {
    // Load existing profile data from Firestore with safe auth fallback
    const fetchProfile = async () => {
       const savedStudent = JSON.parse(localStorage.getItem('hwz_active_student'));
       const actualClass = classroom || savedStudent?.classroom;
       const actualTeacher = teacher || savedStudent?.teacher;
       if (savedStudent && actualClass && actualTeacher) {
          const studentRef = doc(db, 'teachers', actualTeacher.uid, 'classrooms', actualClass.id, 'students', studentName?.trim().toLowerCase());
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
           handleSaveAvatar(base64Url, true);
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
           const studentRef = doc(db, 'teachers', actualTeacher.uid, 'classrooms', actualClass.id, 'students', studentName?.trim().toLowerCase());
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
            <button className="w-9 h-9 bg-[#E0F2FE] rounded-full flex-center text-[#EA580C] shadow-sm hover:scale-110 transition-all relative">
               <User size={18} strokeWidth={3} />
               <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white flex-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
               </div>
            </button>
            <button className="w-9 h-9 bg-[#E0F2FE] rounded-full flex-center text-[#EA580C] shadow-sm hover:scale-110 transition-all relative">
               <Bell size={18} strokeWidth={3} />
               <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white flex-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
               </div>
            </button>
         </div>
      </div>

      {/* Top Section: Avatar & Name */}
      <div className="flex flex-col items-center gap-2">
         <div className={`w-32 h-32 bg-[#FFE4D6] rounded-full p-1 shadow-lg relative group transition-transform hover:scale-105 ${
            profile.redeemedItems?.includes("Golden Badge Frame 🏅") ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-amber-50 animate-pulse' : ''
         }`}>
            <img src={profile.avatarUrl || `https://api.dicebear.com/7.x/lorelei/svg?seed=${profile.name}`} className="w-full h-full rounded-full object-cover" alt="Avatar" />
            <button 
               onClick={() => {
                  setSelectedAvatar(profile.avatarUrl);
                  setIsAvatarModalOpen(true);
               }}
               className="absolute bottom-0 right-0 w-10 h-10 bg-[#EA580C] text-white rounded-full flex-center shadow-lg border-2 border-white hover:scale-110 active:scale-95 transition-all"
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
                  <h4 className="text-xs font-black uppercase text-[#166534] tracking-wider">Option A: Predefined Animated Mascots</h4>
                  <div className="grid grid-cols-4 gap-4">
                     {animatedMascots.map((mascot, idx) => (
                        <button 
                           key={idx}
                           onClick={() => setSelectedAvatar(mascot.url)}
                           className={`p-2 rounded-2xl border-2 transition-all hover:scale-105 relative ${selectedAvatar === mascot.url ? 'border-[#EA580C] bg-green-50/30' : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'}`}
                        >
                           <img src={mascot.url} className="w-12 h-12 object-contain mx-auto" alt={mascot.name} />
                           <span className="text-[9px] font-semibold text-slate-400 block mt-1 text-center leading-none">{mascot.name}</span>
                           {selectedAvatar === mascot.url && (
                              <div className="absolute top-1 right-1 w-4 h-4 bg-[#EA580C] text-white rounded-full flex-center text-[8px] font-bold">✓</div>
                           )}
                           {mascot.isPremium && (
                              <div className="absolute -top-1.5 -left-1.5 bg-amber-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-sm select-none" title="Unlocked Premium Reward!">👑</div>
                           )}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="h-px bg-slate-100" />

               <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-[#166534] tracking-wider">Option B: Upload Custom Photo</h4>
                  
                  <label className="border-2 border-dashed border-slate-200 hover:border-[#EA580C] rounded-3xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-slate-50/50 hover:bg-green-50/10 group">
                     <Upload className="w-8 h-8 text-slate-400 group-hover:text-[#EA580C] transition-all" />
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
                     className="flex-1 bg-[#EA580C] text-white py-3.5 rounded-2xl font-semibold text-sm shadow-lg shadow-orange-100 hover:scale-105 active:scale-95 transition-all"
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
               className="col-span-9 bg-white border border-slate-200 p-3.5 rounded-2xl text-base font-semibold text-[#475569] shadow-sm focus:border-[#EA580C] outline-none transition-all"
            />
         </div>

         <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-3 text-lg font-semibold text-[#2D3748]">Class</label>
            <input 
               type="text" 
               value={classroom?.name || profile.grade || ''}
               readOnly
               className="col-span-9 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-base font-semibold text-[#64748B] shadow-sm outline-none cursor-not-allowed"
            />
         </div>

         <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-3 text-lg font-semibold text-[#2D3748]">Birthdate</label>
            <div className="col-span-9 relative">
               <input 
                  type="date" 
                  value={profile.birthdate || '2020-05-11'}
                  onChange={(e) => setProfile({...profile, birthdate: e.target.value})}
                  className="w-full bg-white border border-slate-200 p-3.5 rounded-2xl text-base font-semibold text-[#475569] shadow-sm focus:border-[#EA580C] outline-none transition-all pr-12"
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
               className="col-span-9 bg-white border border-slate-200 p-3.5 rounded-2xl text-base font-semibold text-[#475569] shadow-sm focus:border-[#EA580C] outline-none transition-all"
            />
         </div>
      </div>

      {/* Save Button Floating */}
      <div className="flex justify-center pt-6">
         <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#EA580C] text-white px-10 py-3.5 rounded-[24px] font-semibold text-base shadow-xl shadow-orange-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
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
      <div className="w-14 h-14 bg-green-500 rounded-full flex-center text-white shadow-[0_4px_0_0_#6D28D9]">
        <Cloud className="w-7 h-7" />
      </div>
      <span className="text-sm font-black text-green-500 mt-2">General</span>
    </div>
  );
};

const HeroHomeworkCard = ({ hw, completedSubmission, hasDraft, onStart, teacher }) => {
  const isDueTomorrow = () => {
    if (!hw.dueDate) return false;
    const due = new Date(hw.dueDate);
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    return due.getDate() === tmr.getDate() && due.getMonth() === tmr.getMonth() && due.getFullYear() === tmr.getFullYear();
  };

  const dueDateStr = hw.dueDate ? new Date(hw.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'NO DUE DATE';
  const dueLabel = isDueTomorrow() ? 'DUE TOMORROW' : `DUE ${dueDateStr.toUpperCase()}`;
  
  const retentionDays = teacher?.dataRetentionPeriod !== undefined ? teacher.dataRetentionPeriod : 90;
  let daysUntilExpiry = null;
  if (retentionDays > 0) {
      const createdAtDate = hw.createdAt?.seconds ? new Date(hw.createdAt.seconds * 1000) : new Date();
      const expiryDate = new Date(createdAtDate.getTime() + retentionDays * 24 * 60 * 60 * 1000);
      const now = new Date();
      const diffMs = expiryDate.getTime() - now.getTime();
      daysUntilExpiry = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }
  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
  
  let buttonLabel = hw.type === 'test' ? "START EXAM!" : "START LEARNING!";
  let buttonBg = "bg-[#ff6a00] shadow-[0_4px_0_0_#cc5500] hover:bg-[#ff8533]";
  if (completedSubmission) {
    buttonLabel = hw.type === 'test' ? "REVIEW EXAM" : "REVIEW MISSION";
    buttonBg = "bg-[#10B981] shadow-[0_4px_0_0_#059669] hover:bg-[#34D399]";
  } else if (hasDraft) {
    buttonLabel = hw.type === 'test' ? "RESUME EXAM ⏳" : "RESUME MISSION 🚀";
    buttonBg = "bg-[#8B5CF6] shadow-[0_4px_0_0_#6D28D9] hover:bg-[#A78BFA]";
  }

  return (
    <div className="w-full mb-10">
      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-4 flex items-center gap-2">
        UP NEXT
      </h2>
      <div 
        className={`rounded-[24px] w-full relative overflow-hidden flex flex-col md:flex-row items-stretch justify-between shadow-xl group ${hw.type === 'test' ? 'bg-[#7f1d1d]' : 'bg-[#1e3a8a]'}`}
      >
        {/* The illustration on the right */}
        <div className="absolute right-0 top-0 bottom-0 w-[60%] md:w-[50%] h-full z-0 opacity-90 md:opacity-100">
          <div className={`w-full h-full absolute inset-0 bg-gradient-to-r ${hw.type === 'test' ? 'from-[#7f1d1d] via-[#7f1d1d]/60' : 'from-[#1e3a8a] via-[#1e3a8a]/60'} to-transparent z-10`} />
          <img 
            src={getSubjectAesthetics(hw.subject).img} 
            className="w-full h-full object-cover object-right" 
            alt="Hero Illustration" 
          />
        </div>

        {/* The content on the left */}
        <div className="flex-1 w-full relative z-20 flex flex-col items-start p-8 md:p-12">
          <div className="inline-block bg-[#ffce00] text-[#1e3a8a] px-4 py-1.5 rounded-full font-black text-xs md:text-sm mb-4 uppercase tracking-widest shadow-sm">
            {hw.type === 'test' ? 'EXAM IN PROGRESS' : (hw.subject === 'Science' ? 'FUN WITH SCIENCE!' : 'LEARNING QUEST!')}
          </div>
          
          <h3 className="text-white text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-2 tracking-tight drop-shadow-md">
            {hw.title}
          </h3>
          
          <p className="text-white/90 text-lg md:text-xl font-bold mb-6 max-w-xl line-clamp-2 drop-shadow-sm leading-snug">
            {hw.instructions || 'Answer the questions below to complete your mission!'}
          </p>
          
          <div className="mb-6 w-full">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <p className="text-[#ffce00] font-black text-sm md:text-base uppercase tracking-wider drop-shadow-sm">
                {dueLabel}
              </p>
              {isExpiringSoon && (
                <span className="bg-rose-500 text-white text-xs font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-sm animate-pulse">
                  ⚠️ Expires in {daysUntilExpiry === 0 ? 'today' : `${daysUntilExpiry} days`}
                </span>
              )}
            </div>
            <p className="text-white/80 text-xs md:text-sm font-bold mb-3">
              Task 1 of 4: {hw.topic || 'New Topic'}
            </p>
            <div className="w-full max-w-sm h-3 md:h-3.5 bg-black/30 rounded-full overflow-hidden">
              <div className="h-full bg-[#ffce00] rounded-full transition-all duration-1000 ease-out" style={{ width: hasDraft ? '50%' : (completedSubmission ? '100%' : '5%') }} />
            </div>
          </div>
          
          <button 
            onClick={() => onStart(hw.id, completedSubmission || null)} 
            className={`${buttonBg} text-white px-8 md:px-10 py-3.5 rounded-full font-black text-lg transition-all active:translate-y-1 active:shadow-none inline-block uppercase tracking-wider drop-shadow-md z-20 mt-2`}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const HomeworkCard = ({ hw, completedSubmission, hasDraft, delay, onStart, teacher }) => {
  const retentionDays = teacher?.dataRetentionPeriod !== undefined ? teacher.dataRetentionPeriod : 90;
  let daysUntilExpiry = null;
  if (retentionDays > 0) {
      const createdAtDate = hw.createdAt?.seconds ? new Date(hw.createdAt.seconds * 1000) : new Date();
      const expiryDate = new Date(createdAtDate.getTime() + retentionDays * 24 * 60 * 60 * 1000);
      const now = new Date();
      const diffMs = expiryDate.getTime() - now.getTime();
      daysUntilExpiry = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }
  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry >= 0;

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
        
        <div className="flex items-center flex-wrap gap-3 pt-2">
          {hasDraft && !completedSubmission && (
             <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 rounded-lg animate-pulse">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">In Progress</span>
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
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-lg text-emerald-800">
             <GraduationCap className="w-4 h-4 text-emerald-600" />
             <span className="text-[10px] font-black uppercase tracking-widest">Teacher: {hw.teacherName || teacher?.displayName || 'Classroom Teacher'}</span>
          </div>
        </div>
      </div>
      
      {/* Action Column */}
      <div className="shrink-0 flex flex-col items-end justify-center gap-4 min-w-[200px]">
        <div className="flex flex-col gap-1 items-end">
           {hw.createdAt && (
              <span className="text-xs font-bold text-slate-400">
                 Assigned: {(() => {
                    const d = hw.createdAt.toDate ? hw.createdAt.toDate() : new Date(hw.createdAt);
                    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                 })()}
              </span>
           )}
           {isExpiringSoon && (
              <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-1 rounded-md uppercase tracking-widest animate-pulse border border-rose-100 mt-1">
                 ⚠️ Expires in {daysUntilExpiry === 0 ? 'today' : `${daysUntilExpiry} days`}
              </span>
           )}
           <div className="flex items-center gap-2 text-blue-500">
              <Calendar className="w-5 h-5" />
              <div className="flex flex-col">
                 <span className="text-sm font-black text-slate-700">Due: {hw.dueDate ? new Date(hw.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No Due Date'}</span>
                 <span className="text-xs font-bold text-slate-400">{hw.dueDate ? new Date(hw.dueDate).toLocaleDateString('en-GB', { weekday: 'long' }) : ''}</span>
              </div>
           </div>
        </div>
        
        {completedSubmission ? (
           <div className="w-full">
              <button onClick={() => onStart(hw.id, completedSubmission)} className="w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-black py-3 px-6 rounded-2xl shadow-[0_4px_0_0_#34d399] active:translate-y-1 active:shadow-none transition-all">
                 {hw.type === 'test' ? 'Exam Completed (Review)' : 'Completed (Review)'}
              </button>
           </div>
        ) : hasDraft ? (
           <div className="w-full">
              <button onClick={() => onStart(hw.id, null)} className="w-full bg-orange-500 hover:bg-orange-400 text-white font-black py-3 px-6 rounded-2xl shadow-[0_4px_0_0_#4338ca] active:translate-y-1 active:shadow-none transition-all">
                 {hw.type === 'test' ? 'Resume Exam ⏳' : 'Resume Mission 🚀'}
              </button>
           </div>
        ) : (
           <div className="w-full">
              <button onClick={() => onStart(hw.id, null)} className="w-full bg-orange-500 hover:bg-orange-400 text-white font-black py-3 px-6 rounded-2xl shadow-[0_4px_0_0_#c2410c] active:translate-y-1 active:shadow-none transition-all">
                 {hw.type === 'test' ? 'Start Exam ⏳' : 'Start Homework'}
              </button>
           </div>
        )}
      </div>
    </motion.div>
  );
};

const getHomeworkDate = (hw) => {
  if (hw.createdAt) {
    return hw.createdAt.toDate ? hw.createdAt.toDate() : new Date(hw.createdAt);
  }
  if (hw.dueDate) {
    return new Date(hw.dueDate);
  }
  return new Date();
};

const getSubjectAesthetics = (sub) => {
  const s = (sub || '').toLowerCase();
  if (s.includes('math')) {
    return {
      bg: 'bg-[#1e88e5]',
      reportBg: 'bg-gradient-to-br from-blue-400 to-indigo-500 shadow-blue-500/30',
      title: 'MATH',
      reportTitle: 'MATH MISSIONS',
      subtitle: 'MATH ADVENTURE:',
      topic: 'Fraction Fun!',
      img: '/subject_math.png',
      pillBg: 'bg-[#4ade80]',
      pillText: 'text-white'
    };
  }
  if (s.includes('read') || s.includes('english')) {
    return {
      bg: 'bg-[#f97316]',
      reportBg: 'bg-gradient-to-br from-orange-400 to-rose-500 shadow-orange-500/30',
      title: 'READING',
      reportTitle: 'READING MISSIONS',
      subtitle: 'STORY TIME:',
      topic: "Maya's Magic Map",
      img: '/subject_reading.png',
      pillBg: 'bg-[#38bdf8]',
      pillText: 'text-white'
    };
  }
  if (s.includes('geo') || s.includes('hist')) {
    return {
      bg: 'bg-[#22c55e]',
      reportBg: 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-500/30',
      title: 'GEOGRAPHY',
      reportTitle: 'GEO MISSIONS',
      subtitle: 'WORLD EXPLORERS:',
      topic: 'Australia!',
      img: '/subject_geography.png',
      pillBg: 'bg-[#4ade80]',
      pillText: 'text-white'
    };
  }
  if (s.includes('art')) {
    return {
      bg: 'bg-[#ef4444]',
      reportBg: 'bg-gradient-to-br from-pink-400 to-purple-500 shadow-pink-500/30',
      title: 'ART',
      reportTitle: 'ART MISSIONS',
      subtitle: 'ART STUDIO:',
      topic: 'Colorful Creatures',
      img: '/subject_art.png',
      pillBg: 'bg-[#9f1239]',
      pillText: 'text-white'
    };
  }
  if (s.includes('hindi')) {
    return {
      bg: 'bg-[#d97706]',
      reportBg: 'bg-gradient-to-br from-amber-400 to-orange-600 shadow-amber-500/30',
      title: 'HINDI',
      reportTitle: 'HINDI MISSIONS',
      subtitle: 'LEARNING QUEST:',
      topic: 'New Adventures!',
      img: '/subject_hindi.png',
      pillBg: 'bg-[#fde047]',
      pillText: 'text-slate-800'
    };
  }
  if (s.includes('logical') || s.includes('reasoning')) {
    return {
      bg: 'bg-[#6366f1]',
      reportBg: 'bg-gradient-to-br from-indigo-400 to-purple-600 shadow-indigo-500/30',
      title: 'LOGICAL REASONING',
      reportTitle: 'REASONING MISSIONS',
      subtitle: 'LEARNING QUEST:',
      topic: 'New Adventures!',
      img: '/subject_logical_reasoning.png',
      pillBg: 'bg-[#fde047]',
      pillText: 'text-slate-800'
    };
  }
  if (s.includes('olympiad')) {
    return {
      bg: 'bg-[#ec4899]',
      reportBg: 'bg-gradient-to-br from-pink-400 to-fuchsia-600 shadow-pink-500/30',
      title: 'OLYMPIAD',
      reportTitle: 'OLYMPIAD MISSIONS',
      subtitle: 'LEARNING QUEST:',
      topic: 'New Adventures!',
      img: '/subject_olympiad.png',
      pillBg: 'bg-[#fde047]',
      pillText: 'text-slate-800'
    };
  }
  if (s.includes('science')) {
    return {
      bg: 'bg-[#0d9488]',
      reportBg: 'bg-gradient-to-br from-teal-400 to-emerald-600 shadow-teal-500/30',
      title: 'SCIENCE',
      reportTitle: 'SCIENCE MISSIONS',
      subtitle: 'LEARNING QUEST:',
      topic: 'New Adventures!',
      img: '/subject_science.png',
      pillBg: 'bg-[#fde047]',
      pillText: 'text-slate-800'
    };
  }
  
  // Generic Fallback - Dynamic Automated Assignment using deterministic hashing
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const colorsPool = [
    { bg: 'bg-[#6366f1]', reportBg: 'bg-gradient-to-br from-indigo-400 to-purple-600 shadow-indigo-500/30' },
    { bg: 'bg-[#0ea5e9]', reportBg: 'bg-gradient-to-br from-sky-400 to-blue-600 shadow-sky-500/30' },
    { bg: 'bg-[#10b981]', reportBg: 'bg-gradient-to-br from-emerald-400 to-teal-600 shadow-emerald-500/30' },
    { bg: 'bg-[#f43f5e]', reportBg: 'bg-gradient-to-br from-rose-400 to-pink-600 shadow-rose-500/30' },
    { bg: 'bg-[#eab308]', reportBg: 'bg-gradient-to-br from-yellow-400 to-amber-600 shadow-yellow-500/30' },
    { bg: 'bg-[#a855f7]', reportBg: 'bg-gradient-to-br from-purple-400 to-violet-600 shadow-purple-500/30' },
    { bg: 'bg-[#ec4899]', reportBg: 'bg-gradient-to-br from-pink-400 to-fuchsia-600 shadow-pink-500/30' },
    { bg: 'bg-[#14b8a6]', reportBg: 'bg-gradient-to-br from-teal-400 to-cyan-600 shadow-teal-500/30' },
    { bg: 'bg-[#f97316]', reportBg: 'bg-gradient-to-br from-orange-400 to-red-600 shadow-orange-500/30' },
    { bg: 'bg-[#84cc16]', reportBg: 'bg-gradient-to-br from-lime-400 to-green-600 shadow-lime-500/30' }
  ];

  const imagesPool = [
    '/fallback_backpack.png',
    '/fallback_globe.png',
    '/fallback_lightbulb.png',
    '/fallback_rocket.png',
    '/fallback_compass.png',
    '/fallback_trophy.png'
  ];

  const hashVal = hashCode(sub || 'general');
  const selectedColor = colorsPool[hashVal % colorsPool.length];
  const selectedImg = imagesPool[hashVal % imagesPool.length];

  return {
    bg: selectedColor.bg,
    reportBg: selectedColor.reportBg,
    title: sub.toUpperCase() || 'GENERAL',
    reportTitle: (sub.toUpperCase() || 'GENERAL') + ' MISSIONS',
    subtitle: 'LEARNING QUEST:',
    topic: 'New Adventures!',
    img: selectedImg,
    pillBg: 'bg-[#fde047]',
    pillText: 'text-slate-800'
  };
};

const SubjectDashboardCard = ({ subject, assignments, submissions, studentName, onSelect }) => {
  const aes = getSubjectAesthetics(subject);
  
  const total = assignments.length;
  let completed = 0;
  let inProgress = 0;
  assignments.forEach(hw => {
     const sub = submissions.find(s => s.homeworkId === hw.id);
     if (sub) {
        completed++;
     } else if (localStorage.getItem(`hz_draft_${studentName}_${hw.id}`)) {
        inProgress++;
     }
  });
  
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  let pillLabel = `${pct}% Done`;
  if (pct === 0 && inProgress === 0) pillLabel = "New";
  else if (pct === 0 && inProgress > 0) pillLabel = "In Progress";
  
  return (
    <div 
      onClick={() => onSelect(subject)}
      className={`${aes.bg} rounded-[32px] w-full min-h-[400px] relative overflow-hidden flex flex-col items-center p-4 md:p-6 shadow-xl cursor-pointer hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group`}
    >
      <div className="absolute top-4 left-4 bg-white/20 p-2 rounded-lg backdrop-blur-sm">
         <Book className="w-5 h-5 text-white" />
      </div>
      
      <div className="w-full h-[200px] mt-10 md:mt-8 rounded-[24px] overflow-hidden bg-white/10 shadow-inner flex-center relative">
         <img src={aes.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={aes.title} />
      </div>
      
      <div className="mt-6 text-center w-full flex flex-col items-center flex-1">
         <h4 className="text-white/90 font-black tracking-widest text-xs md:text-sm mb-1">{aes.title}</h4>
         <h3 className="text-white font-black text-lg md:text-xl leading-tight mb-1">{aes.subtitle}</h3>
         <p className="text-white/90 font-bold text-sm md:text-base leading-tight mb-4">{aes.topic}</p>
         
         <div className="flex justify-center gap-3 w-full mb-4">
            <div className="flex flex-col items-center bg-white/20 rounded-xl px-3 py-1">
               <span className="text-white font-black text-lg leading-none">{completed}</span>
               <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Done</span>
            </div>
            <div className="flex flex-col items-center bg-white/20 rounded-xl px-3 py-1">
               <span className="text-white font-black text-lg leading-none">{inProgress}</span>
               <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">In Prog</span>
            </div>
            <div className="flex flex-col items-center bg-white/20 rounded-xl px-3 py-1">
               <span className="text-white font-black text-lg leading-none">{total - completed - inProgress}</span>
               <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Pend</span>
            </div>
         </div>

         <div className="mt-auto pb-2">
            <span className={`${aes.pillBg} ${aes.pillText} px-6 py-2 md:py-2.5 rounded-full font-black text-sm shadow-[0_4px_0_0_rgba(0,0,0,0.15)] tracking-wide inline-block uppercase`}>
               {pillLabel}
            </span>
         </div>
      </div>
    </div>
  );
};

const MyHomework = ({ studentName, teacher, onStartMission, homeworks: initialHomeworks, submissions: initialSubmissions, title = "My Assignments", mode = "homework" }) => {
   const [activeTab, setActiveTab] = useState('To Do');
   const [activeTopicTab, setActiveTopicTab] = useState('All');
   const [subjectFilter, setSubjectFilter] = useState('All Subjects');
   const [monthFilter, setMonthFilter] = useState('All Months');
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
                           const releaseDateTime = new Date(`${hw.scheduledRelease.date}T${releaseTime}`);
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
                   return dateA - dateB;
                });
                
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

   const uniqueMonths = useMemo(() => {
      const monthsMap = {};
      homeworks.forEach(hw => {
         const date = getHomeworkDate(hw);
         const year = date.getFullYear();
         const month = date.getMonth(); // 0-11
         const key = `${year}-${String(month + 1).padStart(2, '0')}`;
         const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
         monthsMap[key] = { key, label, year, month };
      });
      
      // Sort months chronologically descending (newest first)
      return Object.values(monthsMap).sort((a, b) => {
         if (a.year !== b.year) return b.year - a.year;
         return b.month - a.month;
      });
   }, [homeworks]);

   // Build subject groupings for the grid
   const subjectsMap = {};
   homeworks.forEach(hw => {
      const sub = hw.subject || 'General';
      if (!subjectsMap[sub]) subjectsMap[sub] = [];
      subjectsMap[sub].push(hw);
   });
   const availableSubjects = Object.keys(subjectsMap).sort();

   let baseFilteredHomeworks = homeworks;
   if (subjectFilter !== 'All Subjects') {
      baseFilteredHomeworks = baseFilteredHomeworks.filter(hw => hw.subject?.toLowerCase() === subjectFilter.toLowerCase());
   }
   if (monthFilter !== 'All Months') {
      baseFilteredHomeworks = baseFilteredHomeworks.filter(hw => {
         const date = getHomeworkDate(hw);
         const year = date.getFullYear();
         const month = date.getMonth();
         const key = `${year}-${String(month + 1).padStart(2, '0')}`;
         return key === monthFilter;
      });
   }

   const completedHwIds = new Set(submissions.map(s => s.homeworkId));
   
   // Compute in-progress based on local storage drafts
   const inProgressHws = baseFilteredHomeworks.filter(hw => {
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
   const todoHws = baseFilteredHomeworks.filter(hw => !completedHwIds.has(hw.id) && !inProgressHwIds.has(hw.id));
   const completedHws = baseFilteredHomeworks.filter(hw => completedHwIds.has(hw.id));
   
   let displayedHomeworks = baseFilteredHomeworks;
   if (activeTab === 'To Do') displayedHomeworks = todoHws;
   if (activeTab === 'Completed') displayedHomeworks = completedHws;
   if (activeTab === 'In Progress') displayedHomeworks = inProgressHws;

   const tabs = [
     { id: 'To Do', label: `To Do (${todoHws.length})` },
     { id: 'In Progress', label: `In Progress (${inProgressHws.length})` },
     { id: 'Completed', label: `Completed (${completedHws.length})` }
   ];

   return (
      <div className="max-w-[100%] mx-auto w-full py-6 space-y-8 pb-20">
         {/* Header area */}
         <div className="flex items-center justify-between px-2 pt-4">
            <div className="flex items-center gap-4 relative z-10">
               <div className="w-16 h-16 bg-orange-500 rounded-[20px] shadow-[0_6px_0_0_#c2410c] flex-center transform -rotate-6">
                 <Book className="w-8 h-8 text-white" />
               </div>
               <div className="flex flex-col">
                  <h1 className="text-4xl font-black text-[#14532d] tracking-tighter uppercase">{title}</h1>
                  {subjectFilter !== 'All Subjects' && (
                     <button 
                        onClick={() => { setSubjectFilter('All Subjects'); setActiveTopicTab('All'); }}
                        className="text-orange-500 font-black text-sm flex items-center gap-1 hover:text-orange-600 transition-colors mt-1 w-fit"
                     >
                        ← Back to Assignments Grid
                     </button>
                  )}
               </div>
            </div>
            {/* Decorative Stars */}
            <div className="relative w-40 h-24 hidden md:block z-0">
               <div className="absolute right-0 bottom-0 text-[80px] leading-none z-10 animate-float drop-shadow-xl">⭐</div>
               <div className="absolute right-12 bottom-2 text-5xl z-0">📚</div>
               <div className="absolute left-4 top-4 text-amber-300 animate-pulse">✨</div>
            </div>
         </div>

         {loading ? (
            <div className="flex-center py-20"><div className="w-10 h-10 border-4 border-[#EA580C] border-t-transparent rounded-full animate-spin" /></div>
         ) : subjectFilter === 'All Subjects' ? (
            // Grid Mode
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2 mt-8">
               {availableSubjects.map(sub => (
                  <SubjectDashboardCard 
                     key={sub}
                     subject={sub}
                     assignments={subjectsMap[sub]}
                     submissions={submissions}
                     studentName={studentName}
                     onSelect={setSubjectFilter}
                  />
               ))}
               {availableSubjects.length === 0 && (
                  <div className="col-span-full text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-slate-200">
                     <p className="text-xl font-black text-slate-300">No assignments found!</p>
                  </div>
               )}
            </div>
         ) : (
            // List Mode for a Specific Subject
            <div className="space-y-6">
               {/* Navigation Tabs & Filter */}
               <div className="flex flex-col gap-4 border-b-2 border-slate-100 pb-4 relative z-10 mt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                     <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                        {tabs.map(tab => (
                          <button 
                            key={tab.id}
                            onClick={() => {
                               setActiveTab(tab.id);
                               setActiveTopicTab('All'); // Reset topic tab on main tab switch
                            }}
                            className={`px-6 py-2.5 rounded-full text-sm font-black whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
                          >
                            {tab.label}
                          </button>
                        ))}
                     </div>
                     
                     <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <div className="relative shrink-0">
                           <select 
                        value={monthFilter}
                        onChange={(e) => setMonthFilter(e.target.value)}
                        className="appearance-none bg-white border-2 border-slate-100 rounded-full pl-10 pr-10 py-2.5 text-sm font-black text-slate-600 outline-none focus:border-[#EA580C] cursor-pointer"
                     >
                        <option value="All Months">All Months</option>
                        {uniqueMonths.map(m => (
                           <option key={m.key} value={m.key}>{m.label}</option>
                        ))}
                     </select>
                     <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                     <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
               </div>
               </div>

               {/* Topic Tabs */}
               {(() => {
                  const orderedTopics = [...new Set(displayedHomeworks.map(hw => getNaplanUmbrella(hw.subject, hw.title)))];
                  if (orderedTopics.length === 0) return null;
                  return (
                     <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2">
                        <button
                           onClick={() => setActiveTopicTab('All')}
                           className={`px-4 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors ${activeTopicTab === 'All' ? 'bg-[#14532d] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                           All Topics
                        </button>
                        {orderedTopics.map(topic => (
                           <button
                              key={topic}
                              onClick={() => setActiveTopicTab(topic)}
                              className={`px-4 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors ${activeTopicTab === topic ? 'bg-[#14532d] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                           >
                              {topic}
                           </button>
                        ))}
                     </div>
                  );
               })()}
            </div>

            {/* Homework List */}
            <div className="space-y-4 relative z-10">
               {displayedHomeworks.length > 0 ? (
                  <div className="flex flex-col gap-8">
                     {(() => {
                        const groupsMap = displayedHomeworks.reduce((acc, hw) => {
                           const t = getNaplanUmbrella(hw.subject, hw.title);
                           if (!acc[t]) acc[t] = [];
                           acc[t].push(hw);
                           return acc;
                        }, {});
                        
                        const orderedTopics = [...new Set(displayedHomeworks.map(hw => getNaplanUmbrella(hw.subject, hw.title)))];
                        const topicsToRender = activeTopicTab === 'All' ? orderedTopics : [activeTopicTab];

                        return topicsToRender.map(topic => {
                           const hws = groupsMap[topic];
                           if (!hws) return null;
                           return (
                              <div key={topic} className="flex flex-col gap-4 bg-white/40 backdrop-blur-md rounded-3xl p-6 border-2 border-slate-100/60 shadow-sm">
                                 <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3 mb-2">
                                   <div className="w-10 h-10 rounded-2xl bg-[#EA580C] flex items-center justify-center text-white shadow-[0_4px_0_0_#C2410C] transform -rotate-3">
                                     <GraduationCap className="w-5 h-5" />
                                   </div>
                                   {topic}
                                 </h3>
                                 <div className="flex flex-col gap-4">
                                   {hws.map((hw, idx) => {
                                      const isHero = todoHws.length > 0 && hw.id === todoHws[0].id;
                                      const submission = submissions.find(s => s.homeworkId === hw.id);
                                      const hasDraft = localStorage.getItem(`hz_draft_${studentName}_${hw.id}`) !== null;
                                      
                                      if (isHero) {
                                         return (
                                            <HeroHomeworkCard
                                               key={hw.id}
                                               hw={hw}
                                               completedSubmission={submission}
                                               hasDraft={hasDraft}
                                               onStart={onStartMission}
                                               teacher={teacher}
                                            />
                                         );
                                      }

                                      return (
                                         <HomeworkCard 
                                            key={hw.id} 
                                            hw={hw} 
                                            completedSubmission={submission}
                                            hasDraft={hasDraft}
                                            delay={idx * 0.05}
                                            onStart={onStartMission}
                                            teacher={teacher}
                                         />
                                      );
                                   })}
                                 </div>
                              </div>
                           );
                        });
                     })()}
                  </div>
               ) : (
                  <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-slate-200">
                     <div className="text-6xl mb-4 grayscale opacity-30">🍦</div>
                     <p className="text-xl font-black text-slate-300">Nothing here! Take a break.</p>
                  </div>
               )}
               </div>
            </div>
         )}
         
         {/* Footer Mascot Banner */}
         <div className="bg-[#fff9d6] rounded-[32px] p-6 border-2 border-[#ffe87a] flex flex-col md:flex-row items-center gap-6 relative overflow-hidden mt-8">
            <div className="flex items-center gap-6 relative z-10">
               <img src="/assets/owl_mascot.png" className="w-24 h-24 object-contain animate-float drop-shadow-xl" alt="Mascot" />
               <p className="text-lg font-black text-slate-800">
                  Keep it up, {(studentName || 'Student').split(' ')[0]}! Small steps every day lead to big results! 🌈
               </p>
            </div>
            
            <div className="absolute right-10 top-0 w-64 h-64 bg-yellow-200/50 rounded-full blur-3xl -z-0 pointer-events-none" />
         </div>
      </div>
   );
};

const MissionReportModal = ({ submission, homework, onClose }) => {
   if (!submission || !homework) return null;

   const incorrectQuestions = homework.questions.filter((q) => submission.answers && submission.answers[q.id] !== q.answer);

   const formatExplanation = (text) => {
      if (!text) return null;
      // Ensure "Step X:" starts on a new line if it doesn't already
      const processedText = text.replace(/(?<!\n)\s+(Step\s+\d+:?)/gi, '\n$1');
      
      return processedText.split('\n').map((line, i) => {
         const parts = line.split(/(Step\s+\d+:?)/gi);
         return (
            <div key={i} className="mb-2 last:mb-0 leading-relaxed">
               {parts.map((part, j) => 
                  /(Step\s+\d+:?)/gi.test(part) ? <strong key={j} className="text-purple-900 font-black block mt-2 mb-1">{part}</strong> : part
               )}
            </div>
         );
      });
   };

   return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex-center p-4">
         <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative p-8 animate-in fade-in zoom-in duration-300">
            <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 p-2 rounded-full hover:bg-slate-200">
               <X className="w-5 h-5" />
            </button>
            <h2 className="text-3xl font-black text-[#14532d] mb-2">{homework.title}</h2>
            <p className="text-slate-500 font-bold mb-6 text-sm">Reviewing {incorrectQuestions.length} incorrect answers.</p>

            <div className="space-y-6">
               {incorrectQuestions.length === 0 ? (
                  <p className="text-center text-green-500 font-black text-xl py-10">Perfect! You got everything right. 🌟</p>
               ) : (
                  incorrectQuestions.map((q, idx) => {
                     const studentAnsText = submission.answers[q.id] || "No Answer";
                     const correctAnsText = q.answer;
                     const explanationText = submission.wrongAnswersExplanations ? submission.wrongAnswersExplanations[q.id] : "";
                     
                     return (
                        <div key={idx} className="bg-slate-50 border-2 border-slate-100 rounded-[24px] p-6">
                           <h4 className="font-black text-slate-700 text-lg mb-4">Q: {q.text}</h4>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                                 <span className="text-[10px] font-black uppercase text-rose-500 tracking-wider block mb-1">Your Answer</span>
                                 <p className="text-rose-700 font-bold">{studentAnsText}</p>
                              </div>
                              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                 <span className="text-[10px] font-black uppercase text-green-500 tracking-wider block mb-1">Correct Answer</span>
                                 <p className="text-green-700 font-bold">{correctAnsText}</p>
                              </div>
                           </div>
                           {explanationText && (
                              <div className="mt-4 bg-purple-50 border border-purple-200 rounded-xl p-6">
                                 <span className="text-[10px] font-black uppercase text-purple-500 tracking-wider block mb-3 flex items-center gap-2">
                                    <span>📝</span> Teacher Feedback
                                 </span>
                                 <div className="text-purple-800 font-medium text-sm">
                                    {formatExplanation(explanationText)}
                                 </div>
                              </div>
                           )}
                        </div>
                     )
                  })
               )}
            </div>
         </div>
      </div>
   );
};

const ReportSubjectCard = ({ subject, submissionsCount, averageScore, onSelect }) => {
  const aes = getSubjectAesthetics(subject);
  
  return (
    <div 
      onClick={() => onSelect(subject)}
      className={`${aes.reportBg} rounded-[32px] w-full min-h-[220px] relative overflow-hidden flex flex-col p-8 shadow-xl cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group border-4 border-white/20`}
    >
      <div className="flex flex-col items-center text-center gap-4 mb-6 relative z-10">
         <div className="w-24 h-24 rounded-full overflow-hidden bg-white/20 border-4 border-white/30 shadow-lg shrink-0 group-hover:rotate-12 transition-transform duration-500">
            <img src={aes.img} className="w-full h-full object-cover" alt={aes.reportTitle} />
         </div>
         <div>
            <h4 className="font-black tracking-widest text-xl mb-2 text-white drop-shadow-sm">{aes.reportTitle}</h4>
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-white text-sm font-bold uppercase shadow-sm">
               <span>{submissionsCount} Reports</span>
               <span className="opacity-50">•</span>
               <span>Avg {averageScore}%</span>
            </div>
         </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/10 backdrop-blur-sm flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
         <span className="text-white text-sm font-black uppercase tracking-widest">Review Mistakes</span>
         <ChevronRight className="w-5 h-5 text-white" />
      </div>
    </div>
  );
};

const MissionReports = ({ studentName, teacher, submissions: initialSubmissions, homeworks = [], onStartMission }) => {
   const [submissions, setSubmissions] = useState(initialSubmissions || []);
   const [loading, setLoading] = useState(!initialSubmissions);
   
   const [activeSubject, setActiveSubject] = useState(null);
   const [selectedMonth, setSelectedMonth] = useState('Current Month');
   
   const [reviewSubmission, setReviewSubmission] = useState(null);
   const [reviewHomework, setReviewHomework] = useState(null);

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
             setSubmissions(subList);
         } catch (err) {
            console.error("Fetch Submissions Error:", err);
         }
         setLoading(false);
      };
      fetchSubmissions();
   }, [studentName, initialSubmissions]);

   const subjectsMap = useMemo(() => {
      const map = {};
      submissions.forEach(sub => {
         const hw = homeworks.find(h => h.id === sub.homeworkId);
         if (!hw) return;
         const subject = hw.subject || 'General';
         if (!map[subject]) map[subject] = [];
         map[subject].push({ sub, hw });
      });
      return map;
   }, [submissions, homeworks]);

   const availableSubjects = Object.keys(subjectsMap).sort();

   const uniqueMonths = useMemo(() => {
      if (!activeSubject) return [];
      const items = subjectsMap[activeSubject] || [];
      const monthsMap = {};
      
      const now = new Date();
      const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      monthsMap[currentKey] = { key: 'Current Month', label: 'Current Month', year: now.getFullYear(), month: now.getMonth() };
      
      items.forEach(({ hw, sub }) => {
         const date = sub.submittedAt?.toDate ? sub.submittedAt.toDate() : new Date(sub.submittedAt || Date.now());
         const year = date.getFullYear();
         const month = date.getMonth();
         const key = `${year}-${String(month + 1).padStart(2, '0')}`;
         if (key !== currentKey) {
            const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            monthsMap[key] = { key, label, year, month };
         }
      });
      
      return Object.values(monthsMap).sort((a, b) => {
         if (a.key === 'Current Month') return -1;
         if (b.key === 'Current Month') return 1;
         if (a.year !== b.year) return b.year - a.year;
         return b.month - a.month;
      });
   }, [activeSubject, subjectsMap]);

   const filteredItems = useMemo(() => {
      if (!activeSubject) return [];
      let items = subjectsMap[activeSubject] || [];
      
      if (selectedMonth) {
         let filterYear, filterMonth;
         if (selectedMonth === 'Current Month') {
            const now = new Date();
            filterYear = now.getFullYear();
            filterMonth = now.getMonth();
         } else {
            const match = uniqueMonths.find(m => m.key === selectedMonth);
            if (match) {
               filterYear = match.year;
               filterMonth = match.month;
            }
         }
         
         if (filterYear !== undefined) {
            items = items.filter(({ sub }) => {
               const date = sub.submittedAt?.toDate ? sub.submittedAt.toDate() : new Date(sub.submittedAt || Date.now());
               return date.getFullYear() === filterYear && date.getMonth() === filterMonth;
            });
         }
      }
      
      return items.sort((a, b) => {
         const timeA = a.sub.submittedAt?.toDate ? a.sub.submittedAt.toDate().getTime() : new Date(a.sub.submittedAt || 0).getTime();
         const timeB = b.sub.submittedAt?.toDate ? b.sub.submittedAt.toDate().getTime() : new Date(b.sub.submittedAt || 0).getTime();
         return timeB - timeA;
      });
   }, [activeSubject, selectedMonth, subjectsMap, uniqueMonths]);

   return (
      <div className="max-w-[100%] mx-auto w-full py-4 space-y-10 pb-20 relative">
         {reviewSubmission && reviewHomework && (
            <MissionReportModal 
               submission={reviewSubmission} 
               homework={reviewHomework} 
               onClose={() => { setReviewSubmission(null); setReviewHomework(null); }} 
            />
         )}

         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
            <div className="space-y-1">
               <div className="flex items-center gap-4">
                  <h1 className="text-4xl font-black text-[#14532d] tracking-tight">Mission Reports</h1>
                  {activeSubject && (
                     <button 
                        onClick={() => setActiveSubject(null)}
                        className="text-[#16a34a] font-black text-sm flex items-center gap-1 hover:text-[#15803d] transition-colors bg-green-50 px-3 py-1.5 rounded-xl border border-green-200"
                     >
                        ← Back to Dossiers
                     </button>
                  )}
               </div>
               <p className="text-sm font-bold text-[#166534] italic">Review your performance and master your mistakes!</p>
            </div>
            
            {activeSubject && (
               <div className="flex items-center gap-3 bg-white p-2 rounded-[24px] border border-slate-100 shadow-sm shrink-0">
                  <div className="relative shrink-0">
                     <select 
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="appearance-none bg-slate-50 border-2 border-slate-100 rounded-full pl-10 pr-10 py-2 text-sm font-black text-slate-600 outline-none focus:border-green-400 cursor-pointer"
                     >
                        {uniqueMonths.map(m => (
                           <option key={m.key} value={m.key}>{m.label}</option>
                        ))}
                     </select>
                     <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                     <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
               </div>
            )}
         </div>

         {loading ? (
            <div className="flex-center py-20"><div className="w-10 h-10 border-4 border-[#16a34a] border-t-transparent rounded-full animate-spin" /></div>
         ) : !activeSubject ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
               {availableSubjects.map(sub => {
                  const subItems = subjectsMap[sub];
                  const avgScore = Math.round(subItems.reduce((acc, curr) => acc + (curr.sub.score || 0), 0) / subItems.length);
                  return (
                     <ReportSubjectCard 
                        key={sub}
                        subject={sub}
                        submissionsCount={subItems.length}
                        averageScore={avgScore}
                        onSelect={setActiveSubject}
                     />
                  );
               })}
               {availableSubjects.length === 0 && (
                  <div className="col-span-full text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-slate-200">
                     <p className="text-xl font-black text-slate-300">No reports yet. Complete a mission first! 🚀</p>
                  </div>
               )}
            </div>
         ) : (
            <div className="grid grid-cols-1 gap-6">
               {filteredItems.map(({ sub, hw }, i) => {
                  const hwTitle = hw ? hw.title : `Mission Result: ${sub.score}%`;
                  const hwSubject = hw ? hw.subject : "Classroom Assignment";
                  
                  let formattedDate = 'Completed';
                  if (sub.submittedAt) {
                     try {
                        const date = sub.submittedAt.toDate ? sub.submittedAt.toDate() : new Date(sub.submittedAt);
                        formattedDate = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                     } catch (e) {}
                  }

                  const hasMistakes = sub.score < 100;

                  return (
                     <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={sub.id}
                        className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:shadow-md transition-all"
                     >
                        <div className="flex items-start sm:items-center gap-6">
                           <div className="w-16 h-16 bg-green-50 rounded-2xl flex-center shadow-sm shrink-0">
                              <Trophy className={`w-8 h-8 ${sub.score >= 80 ? 'text-amber-400' : 'text-green-500'}`} />
                           </div>
                           <div className="space-y-1">
                              <h3 className="text-xl font-black text-slate-800 tracking-tight">{hwTitle}</h3>
                              <div className="flex items-center gap-2">
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{hwSubject}</span>
                                 {hw && (
                                    <>
                                       <span className="text-slate-300 text-[10px]">•</span>
                                       <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider font-bold ${sub.score >= 80 ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'}`}>
                                          Score: {sub.score}%
                                       </span>
                                    </>
                                 )}
                              </div>
                              {sub.feedback && (
                                <div className="mt-3 bg-purple-50/50 border border-purple-200 p-4 rounded-2xl relative shadow-sm max-w-lg text-left">
                                  <span className="text-[9px] font-black uppercase text-purple-500 tracking-wider block mb-1">📝 Teacher Feedback</span>
                                  <p className="text-xs font-bold text-[#5C4D9F] leading-relaxed italic">"{sub.feedback}"</p>
                                </div>
                              )}
                           </div>
                        </div>
                        <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-3 shrink-0 self-stretch sm:self-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
                           <div className="text-left sm:text-right">
                              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{formattedDate}</p>
                              <p className="text-sm font-black text-emerald-500">+{sub.correctCount * 10} XP</p>
                           </div>
                           {hasMistakes && (
                              <button 
                                 onClick={() => { setReviewSubmission(sub); setReviewHomework(hw); }}
                                 className="bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-black py-3 px-6 rounded-2xl shadow-[0_4px_0_0_#f43f5e] hover:scale-105 active:translate-y-1 active:shadow-none transition-all whitespace-nowrap"
                              >
                                 Review Mistakes 🔍
                              </button>
                           )}
                           {!hasMistakes && (
                              <div className="bg-green-100 text-green-700 text-xs font-black py-3 px-6 rounded-2xl shadow-sm whitespace-nowrap border border-green-200">
                                 Perfect Score! 🏆
                              </div>
                           )}
                        </div>
                     </motion.div>
                  );
               })}
               {filteredItems.length === 0 && (
                  <div className="text-center py-20 bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-200">
                     <p className="text-slate-400 font-bold italic">
                        No reports found for {selectedMonth}. 📅
                     </p>
                  </div>
               )}
            </div>
         )}
      </div>
   );
};

const RewardBadge = ({ icon, label, color, delay, unlocked, count, desc }) => (
   <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={`flex flex-col items-center gap-3 group cursor-pointer relative ${unlocked ? '' : 'opacity-40 grayscale'}`}
      title={desc || `${label} (${unlocked ? 'Unlocked' : 'Locked'})`}
   >
      <div className={`w-20 h-20 ${color} rounded-full flex-center shadow-md border-4 border-white group-hover:scale-110 transition-all relative`}>
         <span className="text-4xl drop-shadow-sm">{icon}</span>
         {unlocked && count > 1 && (
            <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-black w-6 h-6 rounded-full border-2 border-white flex-center shadow-md animate-bounce">
               x{count}
            </div>
         )}
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

const RewardShopItem = ({ icon, title, subtitle, points, delay, onRedeem, canAfford, isRedeemed }) => (
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
            <h4 className="text-sm font-semibold text-[#2D3748] group-hover:text-[#EA580C] transition-colors">{title}</h4>
            <p className="text-[10px] font-semibold text-slate-400">{subtitle}</p>
            <div className="flex items-center gap-1">
               <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
               <span className="text-[10px] font-bold text-slate-600">{points} points</span>
            </div>
         </div>
      </div>
      {isRedeemed ? (
         <div className="px-4 py-2 rounded-xl text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1 select-none">
            Owned ✓
         </div>
      ) : (
         <button 
            onClick={onRedeem}
            disabled={!canAfford}
            className={`px-5 py-2 rounded-xl text-[10px] font-semibold shadow-lg transition-all ${canAfford ? 'bg-[#EA580C] text-white shadow-orange-100 hover:scale-105 active:scale-95 cursor-pointer' : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'}`}
         >
            {canAfford ? 'Redeem' : 'Locked'}
         </button>
      )}
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
               <p className="text-[10px] font-black text-[#EA580C] uppercase tracking-widest">{students} Points</p>
            </div>
         </div>
      </div>
   </motion.div>
);

const MyRewards = ({ studentName, classroom, teacher, homeworks, submissions, getStudentAvatar, classroomStudents = [], currentStudentProfile, onProfileUpdate }) => {
   const safeSubmissions = submissions || [];
   const safeHomeworks = homeworks || [];
   const safeClassroomStudents = classroomStudents || [];

   const normalizeName = (name) => (name || '').trim().toLowerCase().replace(/\s+/g, ' ');
   const mySubmissions = safeSubmissions.filter(s => normalizeName(s.studentName) === normalizeName(studentName));
   const totalPoints = mySubmissions.reduce((acc, s) => acc + (s.correctCount || 0) * 10, 0);

   // Unlocking Badge calculations
   const hasMaths = mySubmissions.some(s => {
      const hw = safeHomeworks.find(h => h.id === s.homeworkId);
      return hw?.subject?.toLowerCase() === 'maths';
   });
   const hasEnglish = mySubmissions.some(s => {
      const hw = safeHomeworks.find(h => h.id === s.homeworkId);
      return hw?.subject?.toLowerCase() === 'english';
   });
   const hasScience = mySubmissions.some(s => {
      const hw = safeHomeworks.find(h => h.id === s.homeworkId);
      return hw?.subject?.toLowerCase() === 'science';
   });
   const hasMusicOrArts = mySubmissions.some(s => {
      const hw = safeHomeworks.find(h => h.id === s.homeworkId);
      return hw?.subject?.toLowerCase() === 'music' || hw?.subject?.toLowerCase() === 'arts';
   });

   const badgesList = [
      { 
         icon: "🐦", 
         label: "Early Bird", 
         color: "bg-amber-100", 
         unlocked: mySubmissions.length >= 1, 
         count: mySubmissions.length,
         desc: "Earned by submitting your first homework quiz. Stackable for each submission!"
      },
      { 
         icon: "🧮", 
         label: "Number Ninja", 
         color: "bg-emerald-100", 
         unlocked: hasMaths, 
         count: mySubmissions.filter(s => { const hw = safeHomeworks.find(h => h.id === s.homeworkId); return hw?.subject?.toLowerCase() === 'maths'; }).length,
         desc: "Scored on Mathematics homework. Stackable for each Maths quiz completed!"
      },
      { 
         icon: "🧙", 
         label: "Grammar Wizard", 
         color: "bg-green-100", 
         unlocked: hasEnglish, 
         count: mySubmissions.filter(s => { const hw = safeHomeworks.find(h => h.id === s.homeworkId); return hw?.subject?.toLowerCase() === 'english'; }).length,
         desc: "Scored on English homework. Stackable for each English quiz completed!"
      },
      { 
         icon: "🔬", 
         label: "Little Einstein", 
         color: "bg-blue-100", 
         unlocked: hasScience, 
         count: mySubmissions.filter(s => { const hw = safeHomeworks.find(h => h.id === s.homeworkId); return hw?.subject?.toLowerCase() === 'science'; }).length,
         desc: "Scored on Science homework. Stackable for each Science quiz completed!"
      },
      { 
         icon: "🎨", 
         label: "Creative Genius", 
         color: "bg-rose-100", 
         unlocked: hasMusicOrArts, 
         count: mySubmissions.filter(s => { const hw = safeHomeworks.find(h => h.id === s.homeworkId); return hw?.subject?.toLowerCase() === 'music' || hw?.subject?.toLowerCase() === 'arts'; }).length,
         desc: "Scored on Music or Arts homework. Stackable for each Creative quiz completed!"
      },
      { 
         icon: "⭐", 
         label: "Perfect Score", 
         color: "bg-green-100", 
         unlocked: mySubmissions.some(s => s.score === 100), 
         count: mySubmissions.filter(s => s.score === 100).length,
         desc: "Scored 100% on a quiz assignment. Earn a star for every perfect score!"
      },
      { 
         icon: "🚀", 
         label: "Fast Learner", 
         color: "bg-blue-100", 
         unlocked: mySubmissions.some(s => s.score >= 80), 
         count: mySubmissions.filter(s => s.score >= 80).length,
         desc: "Scored 80% or higher on a quiz assignment. Stackable for every high score!"
      },
      { 
         icon: "📚", 
         label: "Bookworm", 
         color: "bg-emerald-100", 
         unlocked: mySubmissions.length >= 3, 
         count: Math.floor(mySubmissions.length / 3),
         desc: "Completed at least 3 homework assignments. Stackable for every 3 assignments!"
      },
      { 
         icon: "🏆", 
         label: "Grand Scholar", 
         color: "bg-green-100", 
         unlocked: mySubmissions.length >= 5, 
         count: Math.floor(mySubmissions.length / 5),
         desc: "Completed at least 5 homework assignments. Stackable for every 5 assignments!"
      },
      { 
         icon: "💬", 
         label: "Co-Pilot Listener", 
         color: "bg-blue-100", 
         unlocked: mySubmissions.some(s => s.feedback), 
         count: mySubmissions.filter(s => s.feedback).length,
         desc: "Received feedback notes from the teacher. Stackable for each feedback comment!"
      },
      { 
         icon: "🔥", 
         label: "Super Scholar", 
         color: "bg-amber-100", 
         unlocked: mySubmissions.length >= 2 && (mySubmissions.reduce((acc, s) => acc + (s.score || 0), 0) / mySubmissions.length) >= 90, 
         count: mySubmissions.filter(s => (s.score || 0) >= 90).length,
         desc: "Maintain an overall quiz score average of 90%+. Stackable for each 90%+ score!"
      },
      { 
         icon: "👑", 
         label: "Score Master", 
         color: "bg-green-100", 
         unlocked: totalPoints >= 100, 
         count: Math.floor(totalPoints / 100),
         desc: "Accumulate points by completing homework quizzes. Stackable for every 100 points!"
      }
   ];

   const studentCustomBadges = (currentStudentProfile?.customBadges || [])
      .filter(Boolean)
      .map(b => ({
         icon: b?.icon || "🎖️",
         label: b?.name || b?.label,
         color: b?.color || "bg-yellow-50 text-yellow-600 border-yellow-100",
         unlocked: true,
         count: 1,
         isCustom: true,
         desc: b?.desc || b?.description || (b?.desc === "" ? "" : "Awarded by your teacher!")
      }));

   const allBadgesList = [...badgesList, ...studentCustomBadges];

   const studentScores = {};
   safeClassroomStudents.forEach(s => {
      studentScores[s.name] = 0;
   });
   safeSubmissions.forEach(sub => {
      const subName = normalizeName(sub.studentName);
      const matchedStudent = safeClassroomStudents.find(s => normalizeName(s.name) === subName || normalizeName(s.id) === subName);
      if (matchedStudent) {
         studentScores[matchedStudent.name] = (studentScores[matchedStudent.name] || 0) + (sub.correctCount || 0) * 10;
      }
   });

   const activeRegisteredName = safeClassroomStudents.find(s => normalizeName(s.name) === normalizeName(studentName))?.name || studentName;
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

   const redeemedItems = currentStudentProfile?.redeemedItems || [];
   const safeRedeemedItems = Array.isArray(redeemedItems) ? redeemedItems : [];
    
   const shopItems = [
      { icon: "https://img.icons8.com/fluency/96/astronaut.png", title: "Astronaut Helmet 🧑‍🚀", subtitle: "Accessory for your profile character", points: 30 },
      { icon: "https://img.icons8.com/fluency/96/paint-palette.png", title: "Cheerful Palette 🎨", subtitle: "Custom dashboard color theme pack", points: 20 },
      { icon: "https://img.icons8.com/fluency/96/panda.png", title: "Panda Buddy 🐼", subtitle: "Premium dashboard floating companion mascot", points: 50 },
      { icon: "https://img.icons8.com/fluency/96/medal.png", title: "Golden Badge Frame 🏅", subtitle: "Special golden border highlight for avatar", points: 15 },
      { icon: "https://img.icons8.com/fluency/96/crown.png", title: "Crown for Pet 👑", subtitle: "A shiny golden crown for your pet buddy", points: 25 },
      { icon: "https://img.icons8.com/fluency/96/wizard.png", title: "Wizard Hat for Pet 🧙", subtitle: "A magical wizard hat for your pet buddy", points: 30 },
      { icon: "https://img.icons8.com/fluency/96/poncho.png", title: "Superhero Cape for Pet 🦸", subtitle: "A cool red superhero cape for your pet buddy", points: 40 },
      { icon: "https://img.icons8.com/fluency/96/3d-glasses.png", title: "Cool Sunglasses for Pet 😎", subtitle: "Stylish sunglasses for your pet buddy", points: 15 },
      { icon: "https://img.icons8.com/fluency/96/tie.png", title: "Bowtie for Pet 🎀", subtitle: "A cute bowtie for your pet buddy", points: 10 }
   ];

   const petSpentPoints = currentStudentProfile?.petSpentPoints || 0;
   const spentPoints = shopItems.filter(item => safeRedeemedItems.includes(item.title)).reduce((sum, item) => sum + item.points, 0) + petSpentPoints;
   const pointsBalance = Math.max(0, totalPoints - spentPoints);

   const handleRedeem = async (item) => {
      if (pointsBalance < item.points) {
         alert("❌ You don't have enough points for this reward! Keep completing homework to earn more points.");
         return;
      }
      try {
         const savedStudent = JSON.parse(localStorage.getItem('hwz_active_student'));
         const actualClass = classroom || savedStudent?.classroom;
         const actualTeacher = teacher || savedStudent?.teacher;
         if (actualClass?.id && actualTeacher?.uid) {
            const studentRef = doc(db, 'teachers', actualTeacher.uid, 'classrooms', actualClass.id, 'students', studentName?.trim().toLowerCase());
            await updateDoc(studentRef, {
               redeemedItems: arrayUnion(item.title)
            });
            alert(`🎉 Redeemed successfully: ${item.title}! Head over to your profile to equip it!`);
            if (onProfileUpdate) {
               onProfileUpdate();
            }
         } else {
            alert("❌ Unable to redeem reward: Student details missing.");
         }
      } catch (err) {
         console.error("Error redeeming item:", err);
         alert("❌ Something went wrong while redeeming. Please try again.");
      }
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
               <div className="space-y-0.5">
                  <h2 className="text-6xl font-semibold text-[#2D3748] tracking-tighter">{pointsBalance} <span className="text-3xl text-[#166534]">points balance</span></h2>
                  <p className="text-xs font-bold text-slate-400 italic">Total Lifetime Earned: {totalPoints} XP</p>
               </div>
            </div>
            <div className="w-48 h-48 relative">
               <motion.div 
                  animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="w-full h-full flex-center"
               >
                  <img src="https://img.icons8.com/fluency/240/filled-star.png" className="w-full h-full object-contain drop-shadow-2xl" alt="Star Trophy" />
                  <div className="absolute top-4 right-4 w-12 h-12 bg-[#EA580C] rounded-full flex-center text-white shadow-lg border-4 border-white rotate-12">
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
               {allBadgesList.map((badge, idx) => (
                  <RewardBadge 
                     key={idx}
                     icon={badge.icon} 
                     label={badge.label} 
                     color={badge.color} 
                     delay={idx * 0.05} 
                     unlocked={badge.unlocked}
                     count={badge.count || 1}
                     desc={badge.desc}
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
                           canAfford={pointsBalance >= item.points}
                           isRedeemed={redeemedItems.includes(item.title)}
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

// Helper functions for date filtering
const isDateInCurrentWeek = (date) => {
  const now = new Date();
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return date >= startOfWeek && date <= endOfWeek;
};

const isDateInCurrentMonth = (date) => {
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

// --- Student Dashboard (Equip Final Redesign) ---
const StudentDashboard = ({ teacher, studentName, classroom, onLogout }) => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Dashboard');
  const activeNavRef = useRef(activeNav);
  useEffect(() => {
    activeNavRef.current = activeNav;
  }, [activeNav]);
  const [activeMission, setActiveMission] = useState(null);
  const [learningExpanded, setLearningExpanded] = useState(true);
  const [mathsExpanded, setMathsExpanded] = useState(true);
  const [scienceExpanded, setScienceExpanded] = useState(true);
  const [activeMathGrade, setActiveMathGrade] = useState(1);
  const [activeMathConcept, setActiveMathConcept] = useState('Numbers & Place Value');

  const [homeworks, setHomeworks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [classroomStudents, setClassroomStudents] = useState([]);
  const [standingsTimeframe, setStandingsTimeframe] = useState('all-time');
  
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const isInitialLoadRef = React.useRef(true);
  
  // Real-time listener for new messages
  useEffect(() => {
    if (!teacher?.uid || !classroom?.id || !studentName) return;
    // We query by teacherId to ensure we only get messages for this teacher's students.
    // Then we filter by recipient in memory to catch both direct messages (classId could be null) 
    // and class announcements.
    const q = query(
      collection(db, 'messages'),
      where('teacherId', '==', teacher.uid),
      orderBy('createdAt', 'desc'),
      limit(100)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let totalUnread = 0;
      
      const isRelevantMessage = (msg) => {
        // Do not notify the student about messages they sent themselves
        if (msg.senderId?.toLowerCase() === studentName?.toLowerCase()) return false;
        
        // Direct messages
        if (msg.recipientId?.toLowerCase() === studentName?.toLowerCase()) return true;
        // Class announcements (and Class Lounge messages)
        if (msg.recipientType === 'class' && msg.recipientId === classroom.id) return true;
        // Global announcements
        if (msg.recipientType === 'all') return true;
        return false;
      };

      snapshot.docChanges().forEach((change) => {
        const msg = change.doc.data();
        if (change.type === 'added' && !msg.isRead && !isInitialLoadRef.current && isRelevantMessage(msg)) {
           // Do not show popup if the user is currently on the Messages page
           if (activeNavRef.current === 'My Messages') return;
           
           if (window.showToast) {
             window.showToast({
               message: `New message from ${msg.senderName}! 💬`,
               type: 'info',
               onClick: () => setActiveNav('My Messages')
             });
           } else {
             window.alert(`New message from ${msg.senderName}! 💬`);
           }
        }
      });
      
      snapshot.forEach(doc => {
        const msg = doc.data();
        // Only count direct messages towards the unread badge 
        // since announcements cannot be marked as read by individual students in this data model.
        if (!msg.isRead && msg.recipientId?.toLowerCase() === studentName?.toLowerCase()) {
           totalUnread++;
        }
      });
      
      setUnreadMessageCount(totalUnread);
      
      if (isInitialLoadRef.current) {
        isInitialLoadRef.current = false;
      }
    });

    return () => unsubscribe();
  }, [teacher, classroom, studentName]);
  
  // Real-time presence tracking
  useEffect(() => {
    if (!teacher?.uid || !classroom?.id || !studentName) return;
    
    // We will use a dedicated root collection 'presence' for easy querying
    const presenceRef = doc(db, 'presence', `${teacher.uid}_${classroom.id}_${studentName.trim().toLowerCase()}`);
    
    // Set online
    const setOnline = () => {
      setDoc(presenceRef, {
        isOnline: true,
        lastActive: new Date().toISOString(),
        studentName: studentName.trim(),
        classId: classroom.id,
        teacherId: teacher.uid
      }, { merge: true }).catch(console.error);
    };

    // Set offline
    const setOffline = () => {
      setDoc(presenceRef, {
        isOnline: false,
        lastActive: new Date().toISOString(),
        studentName: studentName.trim(),
        classId: classroom.id,
        teacherId: teacher.uid
      }, { merge: true }).catch(console.error);
    };

    setOnline();
    const interval = setInterval(setOnline, 60000); // Heartbeat every minute
    
    window.addEventListener('beforeunload', setOffline);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', setOffline);
      setOffline();
    };
  }, [teacher, classroom, studentName]);

  const [currentStudentProfile, setCurrentStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const todayBirthdayStudents = useMemo(() => {
     return classroomStudents.filter(s => {
        if (!s.birthdate) return false;
        try {
           const today = new Date();
           const parts = s.birthdate.split('-');
           if (parts.length === 3) {
              const bMonth = parseInt(parts[1], 10) - 1;
              const bDay = parseInt(parts[2], 10);
              return today.getMonth() === bMonth && today.getDate() === bDay;
           }
           const bday = new Date(s.birthdate);
           return !isNaN(bday.getTime()) && bday.getMonth() === today.getMonth() && bday.getDate() === today.getDate();
        } catch (e) {
           return false;
        }
     });
  }, [classroomStudents]);

  const fetchData = async () => {
     try {
        const savedStudent = JSON.parse(localStorage.getItem('hwz_active_student'));
        const actualClassroom = classroom || savedStudent?.classroom;
        const actualTeacher = teacher || savedStudent?.teacher;

        let teacherUid = actualTeacher?.uid;
        
        // Dynamically verify teacher status based on teacherCode from Firestore
        if (actualTeacher?.teacherCode) {
           const teacherQ = query(collection(db, 'teachers'), where('teacherCode', '==', actualTeacher.teacherCode.toUpperCase().trim()));
           const teacherSnap = await getDocs(teacherQ);
           if (!teacherSnap.empty) {
              const latestTeacherData = teacherSnap.docs[0].data();
              teacherUid = teacherSnap.docs[0].id;
              
              const isAdminUser = latestTeacherData.isAdmin === true || latestTeacherData.role === 'admin';
              const teacherBilling = latestTeacherData.billing;
              const isPaid = teacherBilling && ['active', 'trialing'].includes(teacherBilling.status);
              
              if (!isPaid && !isAdminUser) {
                 const rawCreated = latestTeacherData.createdAt || teacherBilling?.createdAt;
                 if (rawCreated) {
                    const createdDate = new Date(rawCreated);
                    const today = new Date();
                    const diffTime = today - createdDate;
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays > 7) {
                       alert("Your classroom's trial has expired. Ask your teacher/parent to subscribe to unlock the Homework Zone! 🔒");
                       onLogout();
                       return;
                    }
                 }
              }
           }
        }
        
        if (actualClassroom?.id) {
           // Fetch homeworks for this class
           const hwQ = query(collection(db, 'homeworks'), where('assignedClassId', '==', actualClassroom.id));
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
                       const releaseDateTime = new Date(`${hw.scheduledRelease.date}T${releaseTime}`);
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
           
           setHomeworks(hwList);
        }
        
        if (actualClassroom?.id && teacherUid) {
           // Fetch classroom student rosters
           const studentsSnap = await getDocs(collection(db, 'teachers', teacherUid, 'classrooms', actualClassroom.id, 'students'));
           setClassroomStudents(studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
           
           // Direct student profile fetch
           const studentRef = doc(db, 'teachers', teacherUid, 'classrooms', actualClassroom.id, 'students', studentName?.trim().toLowerCase());
           const studentSnap = await getDoc(studentRef);
           if (studentSnap.exists()) {
              setCurrentStudentProfile(studentSnap.data());
           } else {
              // Student has been deleted from classroom/system by teacher
              onLogout();
              return;
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
            
            const subList = Object.values(combinedMap).filter(sub => !sub.classId || sub.classId === actualClassroom.id);
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

  useEffect(() => {
      const savedStudent = JSON.parse(localStorage.getItem('hwz_active_student'));
      const actualClassroom = classroom || savedStudent?.classroom;
      const actualTeacher = teacher || savedStudent?.teacher;
      if (actualClassroom?.id && actualTeacher?.uid && studentName) {
         const studentRef = doc(db, 'teachers', actualTeacher.uid, 'classrooms', actualClassroom.id, 'students', studentName?.trim().toLowerCase());
         const unsubscribe = onSnapshot(studentRef, (snapshot) => {
            if (snapshot.exists()) {
               setCurrentStudentProfile(snapshot.data());
            } else {
               // Student has been deleted from classroom/system by teacher
               console.log("Student document deleted, logging out...");
               onLogout();
            }
         }, (err) => {
            console.error("Student onSnapshot error:", err);
         });
         return () => unsubscribe();
      }
   }, [studentName, classroom, teacher, onLogout]);

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

  const totalPoints = mySubmissions.reduce((acc, s) => acc + (s.correctCount || 0) * 10, 0);
  const redeemedItems = currentStudentProfile?.redeemedItems || [];
  const safeRedeemedItems = Array.isArray(redeemedItems) ? redeemedItems : [];
  const shopItems = [
     { icon: "https://img.icons8.com/fluency/96/astronaut.png", title: "Astronaut Helmet 🧑‍🚀", subtitle: "Accessory for your profile character", points: 30 },
     { icon: "https://img.icons8.com/fluency/96/paint-palette.png", title: "Cheerful Palette 🎨", subtitle: "Custom dashboard color theme pack", points: 20 },
     { icon: "https://img.icons8.com/fluency/96/panda.png", title: "Panda Buddy 🐼", subtitle: "Premium dashboard floating companion mascot", points: 50 },
     { icon: "https://img.icons8.com/fluency/96/medal.png", title: "Golden Badge Frame 🏅", subtitle: "Special golden border highlight for avatar", points: 15 },
     { icon: "https://img.icons8.com/fluency/96/crown.png", title: "Crown for Pet 👑", subtitle: "A shiny golden crown for your pet buddy", points: 25 },
     { icon: "https://img.icons8.com/fluency/96/wizard.png", title: "Wizard Hat for Pet 🧙", subtitle: "A magical wizard hat for your pet buddy", points: 30 },
     { icon: "https://img.icons8.com/fluency/96/poncho.png", title: "Superhero Cape for Pet 🦸", subtitle: "A cool red superhero cape for your pet buddy", points: 40 },
     { icon: "https://img.icons8.com/fluency/96/3d-glasses.png", title: "Cool Sunglasses for Pet 😎", subtitle: "Stylish sunglasses for your pet buddy", points: 15 },
     { icon: "https://img.icons8.com/fluency/96/tie.png", title: "Bowtie for Pet 🎀", subtitle: "A cute bowtie for your pet buddy", points: 10 }
  ];
  const petSpentPoints = currentStudentProfile?.petSpentPoints || 0;
  const spentPoints = shopItems.filter(item => safeRedeemedItems.includes(item.title)).reduce((sum, item) => sum + item.points, 0) + petSpentPoints;
  const pointsBalance = Math.max(0, totalPoints - spentPoints);

  const [calendarView, setCalendarView] = useState('month'); // 'month' or 'week'
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(null); // { dayNum, month, year }

  // Initialize selected day on load
  useEffect(() => {
     setSelectedCalendarDay({
        dayNum: calendarDate.getDate(),
        month: calendarDate.getMonth(),
        year: calendarDate.getFullYear()
     });
  }, []);

  // Navigation handlers
  const handlePrevCalendar = () => {
     if (calendarView === 'month') {
        setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
     } else {
        const d = new Date(calendarDate);
        d.setDate(d.getDate() - 7);
        setCalendarDate(d);
     }
  };

  const handleNextCalendar = () => {
     if (calendarView === 'month') {
        setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
     } else {
        const d = new Date(calendarDate);
        d.setDate(d.getDate() + 7);
        setCalendarDate(d);
     }
  };

  // Month Names list
  const monthNames = [
     "January", "February", "March", "April", "May", "June", 
     "July", "August", "September", "October", "November", "December"
  ];

  // Get Monthly Grid Cells
  const getMonthCells = () => {
     const y = calendarDate.getFullYear();
     const m = calendarDate.getMonth();
     
     const firstDay = new Date(y, m, 1);
     const startDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday ...
     const daysInM = new Date(y, m + 1, 0).getDate();
     const daysInPrevM = new Date(y, m, 0).getDate();
     
     const cells = [];
     
     // Prev Month trailing
     for (let i = startDayOfWeek - 1; i >= 0; i--) {
        cells.push({
           dayNum: daysInPrevM - i,
           month: m === 0 ? 11 : m - 1,
           year: m === 0 ? y - 1 : y,
           isCurrentMonth: false
        });
     }
     
     // Current Month
     for (let i = 1; i <= daysInM; i++) {
        cells.push({
           dayNum: i,
           month: m,
           year: y,
           isCurrentMonth: true
        });
     }
     
     // Next Month leading
     const totalCells = cells.length <= 35 ? 35 : 42;
     const padding = totalCells - cells.length;
     for (let i = 1; i <= padding; i++) {
        cells.push({
           dayNum: i,
           month: m === 11 ? 0 : m + 1,
           year: m === 11 ? y + 1 : y,
           isCurrentMonth: false
        });
     }
     return cells;
  };

  // Get Weekly Grid Cells
  const getWeekCells = () => {
     const base = new Date(calendarDate);
     const dayOfWeek = base.getDay();
     const sunday = new Date(base);
     sunday.setDate(base.getDate() - dayOfWeek);
     
     const cells = [];
     for (let i = 0; i < 7; i++) {
        const d = new Date(sunday);
        d.setDate(sunday.getDate() + i);
        cells.push({
           dayNum: d.getDate(),
           month: d.getMonth(),
           year: d.getFullYear(),
           dateObj: d,
           isCurrentMonth: d.getMonth() === calendarDate.getMonth()
        });
     }
     return cells;
  };

  const getHomeworksForDate = (y, m, d) => {
     return homeworks.filter(hw => {
        if (!hw.dueDate) return false;
        try {
           const hwParts = hw.dueDate.split('-');
           if (hwParts.length === 3) {
              const hwYear = parseInt(hwParts[0]);
              const hwMonth = parseInt(hwParts[1]) - 1; // 0-indexed
              const hwDay = parseInt(hwParts[2]);
              return hwYear === y && hwMonth === m && hwDay === d;
           }
        } catch (e) {}
        return false;
     });
  };

  const handleLaunchHw = (hw) => {
     const isComp = completedHwIds.has(hw.id);
     if (isComp) {
        const pastSub = mySubmissions.find(s => s.homeworkId === hw.id);
        setActiveMission({ id: hw.id, pastSubmission: pastSub });
     } else {
        setActiveMission({ id: hw.id });
     }
  };

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
        icon: <BookOpen className="w-5 h-5 text-green-500" />,
        color: "bg-[#F5F3FF]",
        btnColor: hasDraft ? "bg-orange-500" : "bg-[#EA580C]",
        onClick: () => setActiveMission({ id: hw.id })
     });
  });

  recentlyGraded.slice(0, 2).forEach(sub => {
     const correspondingHw = homeworks.find(hw => hw.id === sub.homeworkId);
     todoItems.push({
        title: correspondingHw ? `Review: ${correspondingHw.title}` : "Review Feedback",
        subtitle: `Teacher gave encouragement!`,
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

  // 3. Dynamic Ranks & Achievements (All Time)
  const studentScores = {};
  classroomStudents.forEach(s => {
     studentScores[s.name] = 0;
  });
  submissions.forEach(sub => {
     const subName = normalizeName(sub.studentName);
     const matchedStudent = classroomStudents.find(s => normalizeName(s.name) === subName || normalizeName(s.id) === subName);
     if (matchedStudent) {
        studentScores[matchedStudent.name] = (studentScores[matchedStudent.name] || 0) + (sub.correctCount || 0) * 10;
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

  // Standings specific logic (with time filters)
  const standingsScores = {};
  classroomStudents.forEach(s => { standingsScores[s.name] = 0; });
  
  submissions.forEach(sub => {
     let subDate = new Date(0);
     if (sub.submittedAt?.toDate) subDate = sub.submittedAt.toDate();
     else if (sub.submittedAt) subDate = new Date(sub.submittedAt);
     
     if (standingsTimeframe === 'week' && !isDateInCurrentWeek(subDate)) return;
     if (standingsTimeframe === 'month' && !isDateInCurrentMonth(subDate)) return;

     const subName = normalizeName(sub.studentName);
     const matchedStudent = classroomStudents.find(s => normalizeName(s.name) === subName || normalizeName(s.id) === subName);
     if (matchedStudent) {
        standingsScores[matchedStudent.name] = (standingsScores[matchedStudent.name] || 0) + (sub.correctCount || 0) * 10;
     }
  });

  const sortedStandings = Object.keys(standingsScores)
     .map(name => ({ name, points: standingsScores[name] }))
     .sort((a,b) => b.points - a.points);

  const standings = sortedStandings.slice(0, 3).map((st, idx) => ({
     rank: idx + 1,
     name: st.name,
     students: st.points,
     progress: idx === 0 ? "+25" : idx === 1 ? "+15" : "+5",
     color: "text-emerald-500"
  }));

  // No mock padding — only show real students from the classroom


  // Dynamic Badges
  const badges = [
     { icon: "🐦", label: "Early Bird", color: mySubmissions.length >= 1 ? "bg-amber-100" : "bg-slate-50 opacity-40" },
     { icon: "🧮", label: "Math Wizard", color: (mySubmissions.filter(s => {
        const correspondingHw = homeworks.find(hw => hw.id === s.homeworkId);
        return correspondingHw?.subject === 'Maths';
     }).reduce((acc, s) => acc + s.score, 0) / Math.max(1, mySubmissions.filter(s => {
        const correspondingHw = homeworks.find(hw => hw.id === s.homeworkId);
        return correspondingHw?.subject === 'Maths';
     }).length)) >= 80 ? "bg-green-100" : "bg-slate-50 opacity-40" },
     { icon: "⭐", label: "Star Scholar", color: mySubmissions.some(s => s.score === 100) ? "bg-emerald-100" : "bg-slate-50 opacity-40" },
     { icon: "🏆", label: "Knowledge Champ", color: mySubmissions.length >= 3 ? "bg-rose-100" : "bg-slate-50 opacity-40" }
  ];



  // Dynamic Feed reminder
  const feedPosts = [
     {
        author: teacher?.name || "Automated Coach",
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
               onComplete={() => {
                  setActiveMission(null);
                  fetchData();
               }} 
            />
         </div>
     );
  }

  return (
<div className="flex h-screen bg-[#F9F9FF] font-sans overflow-hidden student-theme">
      {/* --- Sidebar (High Fidelity) --- */}
      <aside className="w-72 bg-[#FDFDFF] border-r border-orange-100 flex flex-col shrink-0 h-screen">
        <style>{`
          @keyframes starTwinkle {
            0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.7; }
            50% { transform: scale(1.3) rotate(15deg); opacity: 1; filter: drop-shadow(0 0 6px rgba(250, 204, 21, 0.7)); }
          }
          .animate-star-twinkle {
            animation: starTwinkle 3s ease-in-out infinite;
          }
        `}</style>
        <div className="mb-4 -mx-2 flex-center pt-6 shrink-0 relative px-6">
           <div className="relative flex items-center justify-center w-full">
              {/* Twinkling Star on Left (near logo's star) */}
              <div className="absolute left-[8%] bottom-[5%] text-amber-400 animate-star-twinkle pointer-events-none">
                 <Star className="w-4 h-4 fill-amber-400 text-amber-300" />
              </div>
              
              {/* Twinkling Sparkles on Top Right */}
              <div className="absolute right-[8%] top-[5%] text-amber-300 animate-star-twinkle pointer-events-none" style={{ animationDelay: '1.5s' }}>
                 <Sparkles className="w-3.5 h-3.5 fill-amber-300 text-amber-200" />
              </div>

              <img src="/logo.png?v=3" className="w-[70%] h-auto object-contain mix-blend-multiply hover:scale-105 transition-transform duration-300" alt="Homework Zone" />
           </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
           <SidebarNavItem icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" active={activeNav === 'Dashboard'} color="text-red-500" onClick={() => setActiveNav('Dashboard')} />
           <SidebarNavItem icon={<img src="/ic-homework.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Homework" />} label="My Homework" active={activeNav === 'My Homework'} color="text-pink-500" onClick={() => setActiveNav('My Homework')} />
           <SidebarNavItem icon={<Award className="w-5 h-5" />} label="Exam Arena" active={activeNav === 'Exam Arena'} color="text-rose-500" onClick={() => setActiveNav('Exam Arena')} />
           <SidebarNavItem icon={<Trophy className="w-5 h-5" />} label="Mission Reports" active={activeNav === 'Mission Reports'} color="text-emerald-500" onClick={() => setActiveNav('Mission Reports')} />
           <SidebarNavItem icon={<User className="w-5 h-5" />} label="My Profile" active={activeNav === 'My Profile'} color="text-green-500" onClick={() => setActiveNav('My Profile')} />
            <SidebarNavItem icon={<Compass className="w-5 h-5" />} label="Adventure Maze" active={activeNav === 'Adventure Maze'} color="text-amber-500" onClick={() => setActiveNav('Adventure Maze')} />
           <SidebarNavItem icon={<img src="/ic-messages.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Messages" />} label="My Messages" active={activeNav === 'My Messages'} color="text-cyan-500" onClick={() => setActiveNav('My Messages')} badge={unreadMessageCount} />
           <SidebarNavItem icon={<img src="/ic-rewards.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Rewards" />} label="My Rewards" active={activeNav === 'My Rewards'} color="text-orange-500" onClick={() => setActiveNav('My Rewards')} />
           <SidebarNavItem icon={<CreditCard className="w-5 h-5" />} label="Tuition & Fees" active={activeNav === 'Tuition & Fees'} color="text-green-500" onClick={() => setActiveNav('Tuition & Fees')} />
           <SidebarNavItem icon={<FileText className="w-5 h-5" />} label="Child Report" active={activeNav === 'Child Report'} color="text-rose-500" onClick={() => setActiveNav('Child Report')} />

            {/* Learning collapsible section */}
            <div className="space-y-1">
               <button
                  onClick={() => setLearningExpanded(!learningExpanded)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black transition-all ${
                     activeNav.startsWith('Learning: ')
                        ? 'bg-green-50 text-[#EA580C]'
                        : 'text-[#166534] hover:bg-slate-50 hover:text-[#14532d]'
                  }`}
               >
                  <div className="flex items-center gap-3">
                     <BookOpen className="w-5 h-5 text-orange-500" />
                     <span>Learning Academy</span>
                  </div>
                  <span className="text-[10px] font-black text-[#166534]">
                     {learningExpanded ? '▲' : '▼'}
                  </span>
               </button>
               
               <AnimatePresence>
                  {learningExpanded && (
                     <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="pl-4 mt-1 space-y-2 overflow-hidden text-left"
                     >
                        {/* Umbrella 1: MATHS */}
                        <div className="space-y-1">
                           <button
                              onClick={() => setMathsExpanded(!mathsExpanded)}
                              className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-[11px] font-black text-blue-700 bg-blue-50/70 hover:bg-blue-100/60 uppercase tracking-wider cursor-pointer"
                           >
                              <span className="flex items-center gap-1.5">🧮 MATHS</span>
                              <span className="text-[9px]">{mathsExpanded ? '▲' : '▼'}</span>
                           </button>

                           {mathsExpanded && (
                              <div className="pl-2 space-y-0.5 border-l-2 border-blue-200 ml-2">
                                 {[
                                    { name: 'Numbers & Place Value', emoji: '🔢' },
                                    { name: 'Arithmetic & Operations', emoji: '🧮' },
                                    { name: 'Fractions & Decimals', emoji: '🍕' },
                                    { name: 'Measurement & Money', emoji: '📏' },
                                    { name: 'Time & Clocks', emoji: '⏰' },
                                    { name: 'Geometry & Shapes', emoji: '📐' },
                                    { name: 'Algebra & Patterns', emoji: '⚡' },
                                    { name: 'Data & Probability', emoji: '📊' },
                                    { name: 'Vedic Maths', emoji: '🧮' }
                                 ].map((concept) => (
                                    <button
                                       key={concept.name}
                                       onClick={() => {
                                          setActiveMathConcept(concept.name);
                                          setActiveNav(`Learning: ${concept.name}`);
                                       }}
                                       className={`w-full text-left px-3 py-2 rounded-xl text-[11px] font-black transition-all flex items-center justify-between cursor-pointer ${
                                          activeNav === `Learning: ${concept.name}`
                                             ? 'bg-blue-100 text-blue-800 font-extrabold shadow-sm'
                                             : 'text-[#166534] hover:text-[#14532d] hover:bg-slate-50/60'
                                       }`}
                                    >
                                       <span>{concept.emoji} {concept.name}</span>
                                    </button>
                                 ))}
                              </div>
                           )}
                        </div>

                        {/* Umbrella 2: SCIENCE */}
                        <div className="space-y-1">
                           <button
                              onClick={() => setScienceExpanded(!scienceExpanded)}
                              className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-[11px] font-black text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100/60 uppercase tracking-wider cursor-pointer"
                           >
                              <span className="flex items-center gap-1.5">🔬 SCIENCE</span>
                              <span className="text-[9px]">{scienceExpanded ? '▲' : '▼'}</span>
                           </button>

                           {scienceExpanded && (
                              <div className="pl-2 space-y-0.5 border-l-2 border-emerald-200 ml-2">
                                 {[
                                    { name: 'Body and Functions', emoji: '🫀' },
                                    { name: 'Types of Teeth & Functions', emoji: '🦷' },
                                    { name: 'Nutrition & Balanced Diet', emoji: '🥗' },
                                    { name: 'The Water Cycle', emoji: '💧' },
                                    { name: 'States of Matter', emoji: '🧊' },
                                    { name: 'Classification of Living Things', emoji: '🦁' },
                                    { name: 'Astronomy & Space', emoji: '🚀' },
                                    { name: 'Plants & Botany', emoji: '🌻' },
                                    { name: 'Electricity & Circuits', emoji: '⚡' },
                                    { name: 'Force & Motion', emoji: '🚴' },
                                    { name: 'Materials & Properties', emoji: '🪵' },
                                    { name: 'Ecosystems & Food Chains', emoji: '🌾' },
                                    { name: 'Heat & Thermal Energy', emoji: '🌡️' },
                                    { name: 'Conservation & Sea Turtles', emoji: '🐢' },
                                    { name: 'Fossils & Ancient Life', emoji: '🦴' },
                                     { name: 'Magnets & Magnetic Forces', emoji: '🧲' },
                                     { name: 'Light & Optics', emoji: '💡' },
                                     { name: 'Traits & Heredity', emoji: '🧬' },
                                     { name: 'Rocks & Minerals', emoji: '🪨' },
                                     { name: 'Units of Measurement', emoji: '📏' }
                                 ].map((topic) => (
                                    <button
                                       key={topic.name}
                                       onClick={() => {
                                          setActiveNav(`Learning: ${topic.name}`);
                                       }}
                                       className={`w-full text-left px-3 py-2 rounded-xl text-[11px] font-black transition-all flex items-center justify-between cursor-pointer ${
                                          activeNav === `Learning: ${topic.name}`
                                             ? 'bg-emerald-100 text-emerald-800 font-extrabold shadow-sm'
                                             : 'text-[#166534] hover:text-[#14532d] hover:bg-slate-50/60'
                                       }`}
                                    >
                                       <span>{topic.emoji} {topic.name}</span>
                                    </button>
                                 ))}
                              </div>
                           )}
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>
           <div className="pt-4 pb-1 px-8 text-[10px] font-black text-[#166534] uppercase tracking-widest flex items-center gap-2 select-none border-t border-slate-50 mt-2">
              <span>🎉</span> Fun Activities
           </div>
           <SidebarNavItem icon={<Book className="w-5 h-5" />} label="Library Zone" active={activeNav === 'Library Zone'} color="text-blue-500" onClick={() => setActiveNav('Library Zone')} />
           <SidebarNavItem icon={<Palette className="w-5 h-5" />} label="Arts & Fun" active={activeNav === 'Arts & Fun'} color="text-orange-500" onClick={() => setActiveNav('Arts & Fun')} />
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
                        Hello, <span className="text-[#EA580C]">{studentName || 'Student'}</span>!
                      </h1>
                      <p className="text-base font-semibold text-[#475569] tracking-tight mt-0.5">{classroom?.name ? `${classroom.name} Student` : 'Ready to learn?'}</p>
                  </div>
                  <div className="w-16 h-16 relative">
                      <img src="/assets/owl_mascot.png" className="w-full h-full object-contain drop-shadow-xl animate-float" alt="Owl Mascot" />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                      <button className={`w-9 h-9 bg-white rounded-xl flex-center shadow-sm hover:scale-110 transition-all overflow-hidden ${
                         currentStudentProfile?.redeemedItems?.includes("Golden Badge Frame 🏅") ? 'border-2 border-amber-400 ring-2 ring-amber-300 ring-offset-1 animate-pulse' : 'border border-slate-100'
                      }`}>
                        <img src={getStudentAvatar(studentName)} className="w-full h-full object-cover" alt="Profile" />
                      </button>
                  </div>
                  <div className="flex items-center gap-1 border-b-2 border-[#EA580C] pb-1 cursor-pointer">
                      <span className="text-base font-semibold text-[#2D3748]">{activeNav}</span>
                  </div>
                  <button onClick={onLogout} className="flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-xl text-[9px] font-semibold text-rose-600 hover:bg-rose-100 transition-all border border-rose-100 shadow-sm"><LogOut className="w-3.5 h-3.5" /> Sign Out</button>
                </div>
            </nav>
          )}

          {/* --- Dashboard Grid / Content --- */}
          <main className="flex-1 overflow-y-auto no-scrollbar px-8 py-8">
            <div className="max-w-[100%] mx-auto w-full">
               {todayBirthdayStudents.length > 0 && activeNav === 'Dashboard' && (
                  <BirthdayCelebration students={todayBirthdayStudents} />
               )}
               {activeNav === 'Dashboard' && (
              <div className="grid grid-cols-12 gap-6 animate-in fade-in duration-300">
                 {/* Row 2 Left: Recent Achievements & Weekly Activity Chart */}
                 <div className="col-span-12 lg:col-span-8 bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-6 self-start">
                    <div className="grid grid-cols-12 gap-6">
                       {/* Left Panel: Achievements - Redesigned */}
                       <div className="col-span-12 md:col-span-6 flex flex-col gap-4">
                          {/* Header */}
                          <div className="flex items-center justify-between">
                             <h2 className="text-xl font-black text-[#2D3748] flex items-center gap-2">
                                <span>🏆</span> My Achievements
                             </h2>
                             <span className="text-[10px] font-black bg-amber-100 text-amber-600 px-2.5 py-1 rounded-full">
                                {badges.filter(b => !b.color.includes('opacity')).length}/{badges.length} Earned
                             </span>
                          </div>

                          {/* 2x2 Badge Grid - larger */}
                          <div className="grid grid-cols-2 gap-3 flex-1">
                             {badges.slice(0, 4).map((badge, idx) => {
                                const earned = !badge.color.includes('opacity');
                                return (
                                   <div key={idx} className={`relative flex items-center gap-3 p-4 rounded-2xl border-2 transition-all group cursor-pointer ${
                                      earned 
                                        ? 'bg-gradient-to-br from-white to-amber-50/40 border-amber-200 shadow-sm hover:shadow-md hover:-translate-y-0.5' 
                                        : 'bg-slate-50/70 border-slate-100 opacity-60'
                                   }`}>
                                      {/* Icon circle */}
                                      <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${
                                         earned ? badge.color : 'bg-slate-100'
                                      } group-hover:scale-110 transition-transform`}>
                                         {badge.icon}
                                      </div>
                                      {/* Label + status */}
                                      <div className="min-w-0">
                                         <p className={`text-xs font-black truncate ${earned ? 'text-slate-700' : 'text-slate-400'}`}>{badge.label}</p>
                                         <p className={`text-[9px] font-bold mt-0.5 ${earned ? 'text-amber-500' : 'text-slate-300'}`}>
                                            {earned ? '✅ Unlocked!' : '🔒 Locked'}
                                         </p>
                                      </div>
                                      {/* Earned glow dot */}
                                      {earned && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                                   </div>
                                );
                             })}
                          </div>

                          {/* Stats bar + CTA */}
                          <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                             <div className="flex-1 space-y-1">
                                <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-wider">
                                   <span>🏅 Rank #{activeStudentRank}</span>
                                   <span>{currentStudentScore} XP</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                   <div 
                                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-700" 
                                      style={{ width: `${Math.min(100, (currentStudentScore / Math.max(1, (sortedStudents[0]?.points || 1))) * 100)}%` }}
                                   />
                                </div>
                             </div>
                             <button 
                                onClick={() => setActiveNav('My Rewards')} 
                                className="bg-[#EA580C] text-white px-4 py-2.5 rounded-xl font-black text-[10px] shadow-md hover:bg-[#c2410c] hover:-translate-y-0.5 transition-all whitespace-nowrap"
                             >
                                View All 🎖️
                             </button>
                          </div>
                       </div>

                       {/* Right Panel: Weekly Activity Chart */}
                       <div className="col-span-12 md:col-span-6 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-6 space-y-4 flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                             <div>
                                <h2 className="text-xl font-semibold text-[#2D3748] flex items-center gap-2">
                                   <span>⚡</span> Weekly Activity
                                </h2>
                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Hover on bars to see XP progress!</p>
                             </div>
                             <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider select-none animate-pulse">
                                Live
                             </span>
                          </div>

                          {/* Custom Activity Bar Chart */}
                          <div className="flex-1 w-full min-h-[160px] flex items-end justify-between pt-6 pb-1 px-1 relative">
                             {/* Background gridlines */}
                             <div className="absolute inset-y-6 left-0 right-0 flex flex-col justify-between pointer-events-none opacity-40">
                                <div className="border-t border-dashed border-slate-200 w-full" />
                                <div className="border-t border-dashed border-slate-200 w-full" />
                                <div className="border-t border-dashed border-slate-200 w-full" />
                             </div>

                             {/* Interactive Bars */}
                             {(() => {
                                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                const weeklyPoints = [0, 0, 0, 0, 0, 0, 0];
                                
                                const now = new Date();
                                const currentDay = now.getDay();
                                const startOfWeek = new Date(now);
                                startOfWeek.setDate(now.getDate() - currentDay);
                                startOfWeek.setHours(0, 0, 0, 0);

                                mySubmissions.forEach(sub => {
                                   if (sub.submittedAt) {
                                      try {
                                         const subDate = sub.submittedAt.toDate ? sub.submittedAt.toDate() : new Date(sub.submittedAt);
                                         if (subDate >= startOfWeek) {
                                            const subDay = subDate.getDay();
                                            weeklyPoints[subDay] += (sub.correctCount || 0) * 10;
                                         }
                                      } catch (e) {}
                                   }
                                });
                                
                                const finalWeeklyPoints = weeklyPoints.map((pts, i) => {
                                   if (i > currentDay) return 0;
                                   return pts; // Only use actual points, no mock baseline
                                });
                                const maxPoints = Math.max(...finalWeeklyPoints, 100);

                                return finalWeeklyPoints.map((pts, idx) => {
                                   const percentage = (pts / maxPoints) * 100;
                                   const isToday = currentDay === idx;
                                   const isFuture = idx > currentDay;

                                   return (
                                      <div key={idx} className="flex flex-col justify-end items-center flex-1 h-full group cursor-pointer relative z-10">
                                         {/* Tooltip on Hover */}
                                         <div className="absolute bottom-[calc(100%+8px)] bg-slate-800 text-white text-[9px] font-black py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-md whitespace-nowrap z-20 transition-all duration-200 scale-90 group-hover:scale-100">
                                            {pts} XP Gained
                                         </div>
                                         
                                         {/* Interactive Bar */}
                                         <div 
                                            className={`w-7 rounded-t-xl transition-all duration-300 ${
                                               isToday 
                                                  ? 'bg-[#EA580C] shadow-[0_4px_12px_rgba(234,88,12,0.45)] border border-[#EA580C]/25' 
                                                  : 'bg-orange-100 group-hover:bg-[#EA580C]/50'
                                            }`}
                                            style={{ height: `${isFuture ? 0 : Math.max(10, percentage)}%`, opacity: isFuture ? 0 : 1 }}
                                         />
                                         
                                         {/* Weekday Label */}
                                         <span className={`text-[10px] font-bold mt-2 select-none shrink-0 ${isToday ? 'text-[#EA580C] font-black' : 'text-slate-400'}`}>
                                            {days[idx]}
                                         </span>
                                      </div>
                                   );
                                });
                             })()}
                          </div>
                       </div>
                    </div>
                 </div>

                  {/* Row 2 Right: Class Standings & Pet Widget */}
                  <div className="col-span-12 lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:row-span-2 flex flex-col gap-6">
                     <VirtualPetCompanionWidget 
                        currentStudentProfile={currentStudentProfile}
                        pointsBalance={pointsBalance}
                        onProfileUpdate={() => fetchData()}
                        teacher={teacher}
                        classroom={classroom}
                        studentName={studentName}
                     />
                     <PiggyBankWidget
                        mySubmissions={mySubmissions}
                        currentStudentProfile={currentStudentProfile}
                        teacher={teacher}
                        classroom={classroom}
                        studentName={studentName}
                     />
                     <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-6">
                        <div className="flex justify-between items-center">
                           <h2 className="text-xl font-semibold text-[#2D3748]">Class Standings</h2>
                           <select 
                              value={standingsTimeframe}
                              onChange={(e) => setStandingsTimeframe(e.target.value)}
                              className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-600 focus:outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                           >
                              <option value="all-time">All Time</option>
                              <option value="month">This Month</option>
                              <option value="week">This Week</option>
                           </select>
                        </div>
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
                  </div>

                 {/* Row 3 Left: Calendar */}
                 <div className="col-span-12 lg:col-span-8 bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-6 self-start">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
                       <div className="space-y-1">
                          <h2 className="text-xl font-black text-[#2D3748] flex items-center gap-2">
                             <span>📅</span> Mission Calendar
                          </h2>
                          <p className="text-xs text-slate-400 font-semibold">Track your homework deadlines & start missions!</p>
                       </div>
                       
                       <div className="flex flex-wrap items-center gap-3">
                          {/* Month/Week Navigation */}
                          <div className="flex items-center bg-slate-50 border border-slate-100 rounded-full px-2 py-1 shadow-inner">
                             <button onClick={handlePrevCalendar} className="p-1 hover:bg-white rounded-full transition-all text-slate-500 hover:text-[#EA580C] shadow-sm">
                                <ChevronLeft className="w-4 h-4" />
                             </button>
                             <span className="text-xs font-black text-slate-700 px-3 min-w-[120px] text-center select-none">
                                {calendarView === 'month' 
                                   ? `${monthNames[calendarDate.getMonth()]} ${calendarDate.getFullYear()}`
                                   : `Week of ${monthNames[getWeekCells()[0].month]} ${getWeekCells()[0].dayNum}`
                                }
                             </span>
                             <button onClick={handleNextCalendar} className="p-1 hover:bg-white rounded-full transition-all text-slate-500 hover:text-[#EA580C] shadow-sm">
                                <ChevronRight className="w-4 h-4" />
                             </button>
                          </div>

                          {/* View Toggle */}
                          <div className="flex bg-slate-50 border border-slate-100 rounded-2xl p-0.5 shadow-inner">
                             <button 
                                onClick={() => setCalendarView('month')} 
                                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${calendarView === 'month' ? 'bg-[#EA580C] text-white shadow-sm' : 'text-slate-500 hover:text-[#EA580C]'}`}
                             >
                                Monthly
                             </button>
                             <button 
                                onClick={() => setCalendarView('week')} 
                                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${calendarView === 'week' ? 'bg-[#EA580C] text-white shadow-sm' : 'text-slate-500 hover:text-[#EA580C]'}`}
                             >
                                Weekly
                             </button>
                          </div>
                       </div>
                    </div>

                    {calendarView === 'month' ? (
                       <div className="space-y-4">
                          {/* Month Days Weekday Headers */}
                          <div className="grid grid-cols-7 text-center border-b border-slate-50 pb-2">
                             {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <span key={day} className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{day}</span>
                             ))}
                          </div>
                          
                          {/* Month Grid */}
                          <div className="grid grid-cols-7 gap-2">
                             {getMonthCells().map((cell, idx) => {
                                const dateHws = getHomeworksForDate(cell.year, cell.month, cell.dayNum);
                                const isSelected = selectedCalendarDay && 
                                   selectedCalendarDay.dayNum === cell.dayNum && 
                                   selectedCalendarDay.month === cell.month && 
                                   selectedCalendarDay.year === cell.year;
                                
                                const isToday = new Date().getDate() === cell.dayNum && 
                                   new Date().getMonth() === cell.month && 
                                   new Date().getFullYear() === cell.year;
                                
                                return (
                                   <div 
                                      key={idx} 
                                      onClick={() => setSelectedCalendarDay({ dayNum: cell.dayNum, month: cell.month, year: cell.year })}
                                      className={`min-h-[75px] border border-slate-100 rounded-2xl p-2 relative group hover:border-[#EA580C]/50 hover:bg-[#EA580C]/5 cursor-pointer transition-all flex flex-col justify-between ${
                                         cell.isCurrentMonth ? 'bg-white text-slate-800' : 'bg-slate-50/50 text-slate-300'
                                      } ${isSelected ? 'ring-2 ring-[#EA580C] bg-[#EA580C]/5 border-[#EA580C]/20' : ''} ${
                                         isToday ? 'border-amber-400 bg-amber-50/30' : ''
                                      }`}
                                   >
                                      <div className="flex items-center justify-between">
                                         <span className={`text-[10px] font-black ${cell.isCurrentMonth ? 'text-slate-500' : 'text-slate-300'} ${isToday ? 'text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full' : ''}`}>
                                            {cell.dayNum}
                                         </span>
                                         {isToday && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                                      </div>
                                      
                                      {/* Homework Indicators */}
                                      <div className="space-y-0.5 mt-1 overflow-hidden">
                                         {dateHws.slice(0, 2).map(hw => {
                                            const isComp = completedHwIds.has(hw.id);
                                            const draftStr = localStorage.getItem(`hz_draft_${studentName}_${hw.id}`);
                                            let hasDraft = false;
                                            if (draftStr) {
                                               try {
                                                  const parsed = JSON.parse(draftStr);
                                                  hasDraft = parsed && Object.keys(parsed.answers || {}).length > 0;
                                               } catch(e) {}
                                            }
                                            
                                            let badgeColor = "bg-orange-50 text-orange-600 border-orange-100";
                                            if (isComp) badgeColor = "bg-emerald-50 text-emerald-600 border-emerald-100";
                                            else if (hasDraft) badgeColor = "bg-orange-50 text-orange-600 border-orange-200";

                                            return (
                                               <div 
                                                  key={hw.id} 
                                                  className={`text-[8px] font-bold px-1 py-0.5 rounded-lg truncate border uppercase tracking-wider text-center ${badgeColor}`}
                                               >
                                                  {hw.subject || 'Mission'}
                                               </div>
                                            );
                                         })}
                                         {dateHws.length > 2 && (
                                            <div className="text-[7px] font-black text-slate-400 text-center uppercase tracking-tighter">
                                               +{dateHws.length - 2} More
                                            </div>
                                         )}
                                      </div>
                                   </div>
                                );
                             })}
                          </div>

                          {/* Selected Day Details Panel */}
                          {selectedCalendarDay && (() => {
                             const { dayNum, month, year } = selectedCalendarDay;
                             const dateHws = getHomeworksForDate(year, month, dayNum);
                             
                             return (
                                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4 mt-4 animate-fadeIn space-y-3">
                                   <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                                      <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 select-none">
                                         <span>📌</span> Due on {monthNames[month]} {dayNum}, {year}
                                      </h3>
                                      <span className="bg-[#EA580C]/15 text-[#EA580C] text-[10px] font-black px-2 py-0.5 rounded-full select-none">
                                         {dateHws.length} {dateHws.length === 1 ? 'Mission' : 'Missions'}
                                      </span>
                                   </div>
                                   
                                   {dateHws.length > 0 ? (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                         {dateHws.map(hw => {
                                            const isComp = completedHwIds.has(hw.id);
                                            const draftStr = localStorage.getItem(`hz_draft_${studentName}_${hw.id}`);
                                            let hasDraft = false;
                                            if (draftStr) {
                                               try {
                                                  const parsed = JSON.parse(draftStr);
                                                  hasDraft = parsed && Object.keys(parsed.answers || {}).length > 0;
                                               } catch(e) {}
                                            }
                                            
                                            let badgeColor = "bg-orange-50 text-orange-600 border-orange-100";
                                            let btnText = "Start Mission 🚀";
                                            let btnStyle = "bg-orange-500 hover:bg-orange-400 shadow-[0_3px_0_0_#ea580c] hover:shadow-[0_3px_0_0_#ea580c] active:translate-y-0.5 active:shadow-none";
                                            
                                            if (isComp) {
                                               badgeColor = "bg-emerald-50 text-emerald-600 border-emerald-100";
                                               btnText = "Review Feedback 💬";
                                               btnStyle = "bg-emerald-500 hover:bg-emerald-400 shadow-[0_3px_0_0_#16a34a] hover:shadow-[0_3px_0_0_#16a34a] active:translate-y-0.5 active:shadow-none";
                                            } else if (hasDraft) {
                                               badgeColor = "bg-orange-50 text-orange-600 border-orange-200";
                                               btnText = "Resume Mission 🔄";
                                               btnStyle = "bg-orange-500 hover:bg-orange-400 shadow-[0_3px_0_0_#4f46e5] hover:shadow-[0_3px_0_0_#4f46e5] active:translate-y-0.5 active:shadow-none";
                                            }

                                            return (
                                               <div key={hw.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:scale-[1.01] transition-all gap-4">
                                                  <div className="space-y-1">
                                                     <div className="flex items-center gap-2">
                                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${badgeColor}`}>
                                                           {hw.subject || 'Homework'}
                                                        </span>
                                                        <span className="text-[9px] font-semibold text-slate-400 italic">
                                                           {hw.questions?.length || 5} Questions
                                                        </span>
                                                     </div>
                                                     <h4 className="text-sm font-black text-slate-800 leading-tight">
                                                        {hw.title}
                                                     </h4>
                                                  </div>
                                                  <button 
                                                     onClick={() => handleLaunchHw(hw)}
                                                     className={`text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow transition-all whitespace-nowrap ${btnStyle}`}
                                                  >
                                                     {btnText}
                                                  </button>
                                               </div>
                                            );
                                         })}
                                      </div>
                                   ) : (
                                      <div className="text-center py-6 text-slate-400">
                                         <span className="text-2xl">🎉</span>
                                         <p className="text-xs font-bold text-slate-400 mt-1 select-none">Hooray! No missions are due on this day.</p>
                                      </div>
                                   )}
                                </div>
                             );
                          })()}
                       </div>
                    ) : (
                       /* Weekly view */
                       <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
                          {getWeekCells().map((cell, idx) => {
                             const dateHws = getHomeworksForDate(cell.year, cell.month, cell.dayNum);
                             const isToday = new Date().getDate() === cell.dayNum && 
                                new Date().getMonth() === cell.month && 
                                new Date().getFullYear() === cell.year;
                                
                             const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                             const cellDayName = weekdays[cell.dateObj.getDay()];

                             return (
                                <div 
                                   key={idx} 
                                   className={`border border-slate-100 rounded-3xl p-3 min-h-[220px] flex flex-col justify-between transition-all ${
                                      isToday ? 'bg-amber-50/20 border-amber-300 ring-1 ring-amber-300/30' : 'bg-white'
                                   } hover:shadow-sm`}
                                >
                                   {/* Header */}
                                   <div className="border-b border-slate-50 pb-2 text-center select-none">
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{cellDayName}</p>
                                      <p className={`text-base font-black mt-0.5 inline-block ${
                                         isToday ? 'bg-amber-500 text-white w-7 h-7 rounded-full flex items-center justify-center mx-auto' : 'text-slate-800'
                                      }`}>
                                         {cell.dayNum}
                                      </p>
                                   </div>

                                   {/* Homeworks List */}
                                   <div className="flex-1 mt-2 space-y-2 overflow-y-auto max-h-[160px] scrollbar-none">
                                      {dateHws.length > 0 ? (
                                         dateHws.map(hw => {
                                            const isComp = completedHwIds.has(hw.id);
                                            const draftStr = localStorage.getItem(`hz_draft_${studentName}_${hw.id}`);
                                            let hasDraft = false;
                                            if (draftStr) {
                                               try {
                                                  const parsed = JSON.parse(draftStr);
                                                  hasDraft = parsed && Object.keys(parsed.answers || {}).length > 0;
                                               } catch(e) {}
                                            }
                                            
                                            let badgeColor = "bg-orange-50 text-orange-600 border-orange-100";
                                            let btnText = "Start 🚀";
                                            let btnStyle = "bg-orange-500 hover:bg-orange-400 shadow-[0_2px_0_0_#ea580c] active:translate-y-0.5 active:shadow-none";
                                            
                                            if (isComp) {
                                               badgeColor = "bg-emerald-50 text-emerald-600 border-emerald-100";
                                               btnText = "Review 💬";
                                               btnStyle = "bg-emerald-500 hover:bg-emerald-400 shadow-[0_2px_0_0_#16a34a] active:translate-y-0.5 active:shadow-none";
                                            } else if (hasDraft) {
                                               badgeColor = "bg-orange-50 text-orange-600 border-orange-200";
                                               btnText = "Resume 🔄";
                                               btnStyle = "bg-orange-500 hover:bg-orange-400 shadow-[0_2px_0_0_#4f46e5] active:translate-y-0.5 active:shadow-none";
                                            }

                                            return (
                                               <div key={hw.id} className="border border-slate-100 rounded-2xl p-2 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between gap-2">
                                                  <div>
                                                     <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full border uppercase tracking-wider ${badgeColor} block text-center truncate`}>
                                                        {hw.subject || 'General'}
                                                     </span>
                                                     <p className="text-[10px] font-bold text-slate-700 leading-tight mt-1 line-clamp-2" title={hw.title}>
                                                        {hw.title}
                                                     </p>
                                                  </div>
                                                  <button 
                                                     onClick={() => handleLaunchHw(hw)}
                                                     className={`w-full text-white text-[8px] font-bold py-1 px-1.5 rounded-xl shadow-sm transition-all text-center ${btnStyle}`}
                                                  >
                                                     {btnText}
                                                  </button>
                                               </div>
                                            );
                                         })
                                      ) : (
                                         <div className="h-full flex flex-col items-center justify-center text-center py-4 select-none">
                                            <span className="text-lg">🎯</span>
                                            <p className="text-[8px] font-bold text-slate-300 uppercase tracking-wider mt-1">No Missions</p>
                                         </div>
                                      )}
                                   </div>
                                </div>
                             );
                          })}
                       </div>
                    )}
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
              <MyHomework studentName={studentName} teacher={teacher} homeworks={homeworks.filter(hw => hw.type !== 'test')} submissions={mySubmissions} onStartMission={(id, pastSubmission) => setActiveMission({ id, pastSubmission })} title="My Assignments" mode="homework" />
           )}

           {activeNav === 'Exam Arena' && (
              <MyHomework studentName={studentName} teacher={teacher} homeworks={homeworks.filter(hw => hw.type === 'test')} submissions={mySubmissions} onStartMission={(id, pastSubmission) => setActiveMission({ id, pastSubmission })} title="Exam Arena" mode="test" />
           )}

           {activeNav === 'Mission Reports' && (
              <MissionReports studentName={studentName} teacher={teacher} submissions={mySubmissions} homeworks={homeworks} onStartMission={(id, pastSubmission) => setActiveMission({ id, pastSubmission })} />
           )}

           {activeNav === 'My Rewards' && (
              <MyRewards 
                  studentName={studentName} 
                  classroom={classroom}
                  teacher={teacher}
                  homeworks={homeworks}
                  submissions={submissions}
                  getStudentAvatar={getStudentAvatar}
                  classroomStudents={classroomStudents}
                  currentStudentProfile={currentStudentProfile}
                  onProfileUpdate={() => fetchData()}
               />
           )}

           {activeNav === 'My Messages' && (
              <MessagingModule 
                 studentName={studentName} 
                 teacher={teacher} 
                 classroom={classroom} 
                 classroomStudents={classroomStudents}
                 getStudentAvatar={getStudentAvatar} 
              />
           )}

           {activeNav === 'My Profile' && (
              <StudentProfile 
                 studentName={studentName} 
                 teacher={teacher} 
                 classroom={classroom} 
                 onProfileUpdate={() => fetchData()}
              />
           )}

           {activeNav === 'Adventure Maze' && (
              <AdventureMazeView
                 classroom={classroom}
                 teacher={teacher}
                 classroomStudents={classroomStudents}
                 submissions={submissions}
                 studentName={studentName}
                 getStudentAvatar={getStudentAvatar}
              />
           )}

           {activeNav === 'Tuition & Fees' && (
              <TuitionPayment
                 studentName={studentName}
                 teacher={teacher}
                 classroom={classroom}
              />
           )}

           {activeNav === 'Library Zone' && (
              <LibraryZoneView
                 studentName={studentName}
                 totalPoints={currentStudentScore}
                 teacher={teacher}
                 classroom={classroom}
              />
           )}

           {activeNav === 'Arts & Fun' && (
              <ArtsAndFunView
                 studentName={studentName}
                 currentStudentProfile={currentStudentProfile}
              />
           )}

            {activeNav === 'Child Report' && (
               <ChildReportView
                  studentName={studentName}
                  currentStudentProfile={currentStudentProfile}
                  submissions={submissions}
                  homeworks={homeworks}
               />
            )}

            {activeNav === 'Learning: Body and Functions' && (
               <BodyAndFunctionsHub />
            )}

            {activeNav === 'Learning: Types of Teeth & Functions' && (
               <TeethAndFunctionsHub />
            )}

            {activeNav === 'Learning: Nutrition & Balanced Diet' && (
               <NutritionAndDietHub />
            )}

            {activeNav === 'Learning: The Water Cycle' && (
               <WaterCycleHub />
            )}

            {activeNav === 'Learning: States of Matter' && (
               <StatesOfMatterHub />
            )}

            {activeNav === 'Learning: Classification of Living Things' && (
               <ClassificationOfLivingThingsHub />
            )}

            {activeNav === 'Learning: Astronomy & Space' && (
               <AstronomyHub />
            )}

            {activeNav === 'Learning: Plants & Botany' && (
               <PlantsHub />
            )}

            {activeNav === 'Learning: Electricity & Circuits' && (
               <ElectricityHub />
            )}

            {activeNav === 'Learning: Force & Motion' && (
               <ForceAndMotionHub />
            )}

            {activeNav === 'Learning: Materials & Properties' && (
               <MaterialsAndPropertiesHub />
            )}

            {activeNav === 'Learning: Ecosystems & Food Chains' && (
               <EcosystemsHub />
            )}

            {activeNav === 'Learning: Heat & Thermal Energy' && (
               <HeatAndThermalEnergyHub />
            )}

            {activeNav === 'Learning: Conservation & Sea Turtles' && (
               <ConservationHub />
            )}

            {activeNav === 'Learning: Fossils & Ancient Life' && (
               <FossilsHub />
            )}

            {activeNav === 'Learning: Magnets & Magnetic Forces' && (
               <MagnetsHub />
            )}

            {activeNav === 'Learning: Light & Optics' && (
               <LightHub />
            )}

            {activeNav === 'Learning: Traits & Heredity' && (
               <HeredityHub />
            )}

            {activeNav === 'Learning: Rocks & Minerals' && (
               <RocksHub />
            )}

            {activeNav === 'Learning: Units of Measurement' && (
               <UnitsOfMeasurementHub />
            )}

            {activeNav.startsWith('Learning: ') && 
             activeNav !== 'Learning: Body and Functions' && 
             activeNav !== 'Learning: Types of Teeth & Functions' && 
             activeNav !== 'Learning: Nutrition & Balanced Diet' && 
             activeNav !== 'Learning: The Water Cycle' && 
             activeNav !== 'Learning: States of Matter' && 
             activeNav !== 'Learning: Classification of Living Things' && 
             activeNav !== 'Learning: Astronomy & Space' && 
             activeNav !== 'Learning: Plants & Botany' && 
             activeNav !== 'Learning: Electricity & Circuits' && 
             activeNav !== 'Learning: Force & Motion' && 
             activeNav !== 'Learning: Materials & Properties' && 
             activeNav !== 'Learning: Ecosystems & Food Chains' && 
             activeNav !== 'Learning: Heat & Thermal Energy' && 
             activeNav !== 'Learning: Conservation & Sea Turtles' && 
             activeNav !== 'Learning: Fossils & Ancient Life' && 
             activeNav !== 'Learning: Magnets & Magnetic Forces' && 
             activeNav !== 'Learning: Light & Optics' && 
             activeNav !== 'Learning: Traits & Heredity' && 
             activeNav !== 'Learning: Rocks & Minerals' && 
             activeNav !== 'Learning: Units of Measurement' && (
               <MathsLearningHub
                  activeConcept={activeMathConcept}
                  onConceptSelect={(concept) => {
                     setActiveMathConcept(concept);
                     setActiveNav(`Learning: ${concept}`);
                  }}
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

const SidebarNavItem = ({ icon, label, active, color, onClick, badge }) => (
  <div className="px-4">
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between gap-4 px-6 py-3.5 cursor-pointer transition-all group rounded-2xl ${
        active 
          ? 'bg-[#EA580C] text-white shadow-lg shadow-orange-200 font-semibold' 
          : 'text-[#166534] hover:bg-slate-50 hover:text-[#14532d]'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-5 h-5 flex-center transition-transform group-hover:scale-110 ${active ? 'text-white' : color}`}>
           {React.isValidElement(icon) && icon.type === 'img' ? icon : React.cloneElement(icon, { size: 20, strokeWidth: 3 })}
        </div>
        <span className="text-sm tracking-tight">{label}</span>
      </div>
      {badge > 0 && (
        <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full min-w-[20px] text-center">
          {badge}
        </span>
      )}
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

const HelpAccordion = ({ question, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-slate-700 hover:bg-slate-50 transition-colors outline-none"
      >
        <span className="text-sm">{question}</span>
        <span className={`text-xs transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 text-xs text-slate-500 leading-relaxed border-t border-slate-100/50 pt-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LearningPathCard = ({ title, progress, stars, color, active, onClick }) => (
   <div className={`flex-1 ${color} p-6 rounded-[32px] border-4 ${active ? 'border-[#EA580C]' : 'border-white'} shadow-xl z-10 space-y-6 relative group hover:-translate-y-2 transition-all`}>
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
      <button 
         onClick={onClick}
         className="w-full bg-[#EA580C] hover:bg-[#c2410c] active:scale-95 text-white py-2 rounded-xl font-semibold text-[10px] shadow-md transition-all cursor-pointer"
      >
         Resume Quest 🧭
      </button>
   </div>
);

const AchievementBadge = ({ icon, label, color }) => {
   const earned = !color.includes('opacity');
   return (
      <div className="flex flex-col items-center gap-2 group cursor-pointer">
         <div className={`w-16 h-16 ${color} rounded-2xl flex-center text-3xl shadow-md border-2 border-white group-hover:scale-110 transition-transform relative`}>
            {icon}
            {earned && <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border border-white" />}
         </div>
         <span className={`text-[9px] font-black uppercase tracking-widest text-center leading-tight ${earned ? 'text-slate-600' : 'text-slate-300'}`}>{label}</span>
      </div>
   );
};

const RankCard = ({ rank, name, detail, isAlt, avatarUrl }) => (
   <div className={`flex-1 ${isAlt ? 'bg-amber-50 border-amber-100' : 'bg-[#F5F3FF] border-green-200'} p-6 rounded-[32px] border flex flex-col items-center text-center gap-4 relative overflow-hidden group hover:scale-105 transition-all shadow-sm`}>
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
  <div className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl cursor-pointer transition-all border-2 ${active ? 'bg-gradient-to-r from-green-50 to-orange-50 text-[#EA580C] border-green-200 font-semibold' : 'text-slate-400 border-transparent hover:bg-slate-50 hover:text-slate-800'}`}>
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
     <p className="text-xs font-semibold text-[#EA580C]">{score}</p>
  </div>
);

const LegendItem = ({ label, value, color }) => (
  <div className="flex items-center gap-2">
     <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
     <span className="text-[10px] font-semibold text-slate-400">{label} {value}</span>
  </div>
);

// --- Landing Page ---
const LandingPage = ({ currentUser, onTeacherLogin, onStudentLogin }) => {
  const navigate = useNavigate();

  const [showLoginModal, setShowLoginModal] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [activeHelpTab, setActiveHelpTab] = useState('student');
  const [code, setCode] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  // Create-password flow state
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [pendingStudentInfo, setPendingStudentInfo] = useState(null); // { teacherDoc, teacherData, studentDocRef, matchedStudentName, studentClass }
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [createPwLoading, setCreatePwLoading] = useState(false);
  const [createPwError, setCreatePwError] = useState('');
  const [showPwField, setShowPwField] = useState(false);
  const [teacherMode, setTeacherMode] = useState('login'); // 'login' or 'register'
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');

  // SHA-256 hash a password string (returns hex string)
  const hashPassword = async (password) => {
    const enc = new TextEncoder();
    const data = enc.encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const openLogin = (role) => {
    if (role === 'teacher' && currentUser) {
      navigate('/dashboard/teacher');
      return;
    }

    if (role === 'student') {
      const savedStudent = localStorage.getItem('hwz_active_student');
      if (savedStudent) {
        try {
          const studentData = JSON.parse(savedStudent);
          if (studentData && studentData.name) {
            onStudentLogin(studentData);
            navigate('/dashboard/student');
            return;
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }

    setErrorMsg('');
    setCode('');
    setStudentName('');
    setStudentPassword('');
    setShowPwField(false);
    setShowLoginModal(role);
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setIsLoginLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userDoc = doc(db, 'teachers', result.user.uid);
      const docSnap = await getDoc(userDoc);
      let teacherCode;
      if (!docSnap.exists()) {
        teacherCode = generateTeacherCode();
        await setDoc(userDoc, {
          uid: result.user.uid,
          displayName: result.user.displayName || result.user.email.split('@')[0],
          email: result.user.email,
          teacherCode,
          createdAt: new Date().toISOString()
        });
      } else {
        teacherCode = docSnap.data().teacherCode;
        if (!teacherCode) {
          teacherCode = generateTeacherCode();
          await setDoc(userDoc, { teacherCode }, { merge: true });
        }
      }
      onTeacherLogin({ uid: result.user.uid, email: result.user.email, displayName: result.user.displayName || result.user.email.split('@')[0], teacherCode });
      setShowLoginModal(null);
      navigate('/dashboard/teacher');
    } catch (err) {
      console.error("Google login error:", err);
      setErrorMsg(err.message || 'Google Sign In failed.');
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!teacherEmail) {
      setErrorMsg('Please enter your email address to reset your password!');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, teacherEmail);
      alert('Password reset email sent! Please check your inbox. 📬');
    } catch (err) {
      console.error("Password reset error:", err);
      setErrorMsg(err.message || 'Failed to send password reset email.');
    }
  };

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    if (showLoginModal === 'student' && (!code || !studentName)) {
      setErrorMsg('Please enter both the Teacher Code and your name!');
      return;
    }
    setIsLoginLoading(true);
    try {
      if (showLoginModal === 'teacher') {
        if (!teacherEmail || !teacherPassword) {
          setErrorMsg('Please enter both your email and password!');
          setIsLoginLoading(false);
          return;
        }
        
        let userCredential;
        let teacherCode;
        
        if (teacherMode === 'register') {
          userCredential = await createUserWithEmailAndPassword(auth, teacherEmail, teacherPassword);
          const user = userCredential.user;
          
          // Send verification email
          await sendEmailVerification(user);
          
          const userDoc = doc(db, 'teachers', user.uid);
          teacherCode = generateTeacherCode();
          
          await setDoc(userDoc, {
            uid: user.uid,
            displayName: user.email.split('@')[0],
            email: user.email,
            teacherCode,
            createdAt: new Date().toISOString()
          });
          
          // Sign out immediately so they must verify
          await signOut(auth);
          setIsLoginLoading(false);
          alert('Account created! 🚀 A verification email has been sent to your inbox. Please click the link to verify your email before logging in. 📬');
          setTeacherMode('login');
          return;
        } else {
          userCredential = await signInWithEmailAndPassword(auth, teacherEmail, teacherPassword);
          const user = userCredential.user;
          
          // Enforce email verification check
          if (!user.emailVerified) {
            setErrorMsg('Please verify your email address to log in! Check your inbox for the verification link. 📬');
            await signOut(auth);
            setIsLoginLoading(false);
            return;
          }
          
          const userDoc = doc(db, 'teachers', user.uid);
          const docSnap = await getDoc(userDoc);
          
          if (!docSnap.exists()) {
            teacherCode = generateTeacherCode();
            await setDoc(userDoc, {
              uid: user.uid,
              displayName: user.email.split('@')[0],
              email: user.email,
              teacherCode,
              createdAt: new Date().toISOString()
            });
          } else {
            teacherCode = docSnap.data().teacherCode;
            if (!teacherCode) {
              teacherCode = generateTeacherCode();
              await setDoc(userDoc, { teacherCode }, { merge: true });
            }
          }
          
          onTeacherLogin({ uid: user.uid, email: user.email, displayName: docSnap.data()?.displayName || user.email.split('@')[0], teacherCode });
        }
        
        setShowLoginModal(null);
        navigate('/dashboard/teacher');
      } else {
        const q = query(collection(db, 'teachers'), where('teacherCode', '==', code.toUpperCase().trim()));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const teacherDoc = querySnapshot.docs[0];
          const teacherData = teacherDoc.data();

          // Enforce 7-day trial check for unpaid accounts
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
                setErrorMsg("Your classroom's trial has expired. Ask your teacher/parent to subscribe to unlock the Homework Zone! 🔒");
                setIsLoginLoading(false);
                return;
              }
            }
          }

          const classroomsRef = collection(db, 'teachers', teacherDoc.id, 'classrooms');
          const classroomsSnap = await getDocs(classroomsRef);
          let studentFound = false;
          let studentClass = null;
          let matchedStudentName = null;
          let matchedStudentDoc = null;
          let matchedClassDocId = null;
          const normalizeName = (name) => (name || '').trim().toLowerCase().replace(/\s+/g, ' ');
          const cleanInputName = normalizeName(studentName);
          for (const classDoc of classroomsSnap.docs) {
            const studentsRef = collection(db, 'teachers', teacherDoc.id, 'classrooms', classDoc.id, 'students');
            const studentsSnap = await getDocs(studentsRef);
            const matchedDoc = studentsSnap.docs.find(stDoc => {
              const stData = stDoc.data();
              return normalizeName(stDoc.id) === cleanInputName || normalizeName(stData.name) === cleanInputName;
            });
            if (matchedDoc) {
              studentFound = true;
              studentClass = { id: classDoc.id, ...classDoc.data() };
              matchedStudentName = (matchedDoc.data().name || matchedDoc.id).trim();
              matchedStudentDoc = matchedDoc;
              matchedClassDocId = classDoc.id;
              const studentData = matchedDoc.data();
              const studentStatus = studentData.status;
              const isQuotaLocked = studentData.isQuotaLocked;

              if (isQuotaLocked) {
                setErrorMsg('Your account has been temporarily locked due to your class plan limits. Please speak to your teacher.');
                setIsLoginLoading(false);
                return;
              }
              if (studentStatus === 'paused') {
                setErrorMsg('Your account has been paused by your teacher. Please speak to your teacher to restore access.');
                setIsLoginLoading(false);
                return;
              }
              break;
            }
          }
          if (studentFound) {
            const studentData = matchedStudentDoc.data();
            const storedHash = studentData.passwordHash;

            if (!storedHash) {
              // First-time login: no password set → prompt to create one
              const studentDocRef = doc(db, 'teachers', teacherDoc.id, 'classrooms', matchedClassDocId, 'students', matchedStudentDoc.id);
              setPendingStudentInfo({
                teacherDoc,
                teacherData,
                studentDocRef,
                matchedStudentName,
                studentClass
              });
              setShowLoginModal(null);
              setShowCreatePassword(true);
              setIsLoginLoading(false);
              return;
            } else {
              // Returning student: verify password
              if (!showPwField) {
                // First click of "Let's Go!" when password exists → show password field
                setShowPwField(true);
                setIsLoginLoading(false);
                return;
              }
              if (!studentPassword) {
                setErrorMsg('Please enter your password!');
                setIsLoginLoading(false);
                return;
              }
              const inputHash = await hashPassword(studentPassword);
              if (inputHash !== storedHash) {
                setErrorMsg('Incorrect password. Please try again!');
                setIsLoginLoading(false);
                return;
              }
              // Password matches → log in
              onStudentLogin({ teacher: { uid: teacherDoc.id, ...teacherData }, name: matchedStudentName, classroom: studentClass });
              setShowLoginModal(null);
              setStudentPassword('');
              setShowPwField(false);
              navigate('/dashboard/student');
            }
          } else {
            setErrorMsg("Oops! Your name isn't on the class list yet. Talk to your teacher to join!");
          }
        } else {
          setErrorMsg('Invalid Teacher Code. Please check with your teacher!');
        }
      }
    } catch (error) {
      console.error('Login Error:', error);
      setErrorMsg('Login failed. Please try again!');
    }
    setIsLoginLoading(false);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* NAV */}
      <header className="bg-white shadow-sm">
        <div className="w-full px-6 py-4 flex items-center gap-6">
          <a href="#" className="flex items-center gap-3 hover:scale-[1.03] transition-transform duration-300">
            <img src="/images/owl.png" alt="Homework Zone owl" className="w-14 h-14" />
            <img src="/logo.png?v=3" className="h-14 w-auto object-contain mix-blend-multiply" alt="Homework Zone Logo" />
          </a>




          <div className="flex items-center gap-4 ml-auto">
            <Link to="/documentation" className="flex flex-col items-center text-xs font-bold text-slate-600 hover:scale-105 transition-transform duration-300">
              <span className="icon-tile bg-indigo-50 text-indigo-500">
                <FileText className="w-5 h-5 mx-auto" />
              </span>
              Docs
            </Link>
            <button onClick={() => setShowHelpModal(true)} className="flex flex-col items-center text-xs font-bold text-slate-600 hover:scale-105 transition-transform duration-300">
              <span className="icon-tile bg-blue-50" style={{ color: 'var(--blue)' }}>?</span>
              Help
            </button>
            <button onClick={() => openLogin('teacher')} className="flex flex-col items-center text-xs font-bold text-slate-600">
              <span className="icon-tile text-white" style={{ background: 'var(--blue)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
              </span>
              Parent Zone
            </button>
            <button onClick={() => openLogin('student')} className="flex items-center gap-1 bg-blue-50 rounded-full p-1 pr-2">
              <img src="/images/avatar.png" alt="Profile" className="w-10 h-10 rounded-full bg-white object-cover" />
              <span className="text-slate-500">&#9660;</span>
            </button>
          </div>
        </div>
      </header>

      <main className="w-full px-6 pb-12">

        {/* HERO */}
        <section className="relative w-full rounded-3xl mt-4 overflow-hidden shadow-sm h-[320px] md:h-[380px] lg:h-[400px] flex items-center">
          {/* Background image covering the container perfectly */}
          <img src="/images/hero-bg-cartoon.jpg?v=5" className="absolute inset-0 w-full h-full object-cover object-[center_60%]" alt="Background" />
          
          {/* Readability gradient wash on the left */}
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent w-[42%] z-10" />
          
          {/* Interactive content overlaid on top */}
          <div className="absolute inset-0 z-20 flex items-center p-6 md:p-10 lg:p-12">
            <div className="max-w-[42%]">
              <h1 className="font-display text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight text-slate-900">
                Welcome to Your<br />
                <span style={{ color: 'var(--blue)' }}>Homework Zone!</span>
              </h1>
              <p className="mt-1 md:mt-2 text-[10px] sm:text-xs md:text-sm lg:text-base text-slate-700 font-medium leading-relaxed">
                Fun places for learning &amp; adventure!
              </p>
              <button onClick={() => openLogin('student')} className="btn-bubble btn-primary mt-2 md:mt-4 lg:mt-6 scale-75 sm:scale-90 md:scale-100 origin-left">
                Start Learning <span>&#8594;</span>
              </button>
            </div>
          </div>
        </section>


        {/* FEATURE CARDS */}
        <section className="grid lg:grid-cols-3 gap-5 mt-6">

          {/* Library */}
          <article className="bg-white rounded-3xl p-5 card-shadow flex flex-col justify-between">
            <div className="grid grid-cols-5 gap-4">
              <img src="/images/library.jpg" alt="Library" className="col-span-2 rounded-2xl object-cover w-full h-full" />
              <div className="col-span-3">
                <h2 className="font-display text-2xl" style={{ color: 'var(--blue)' }}>LIBRARY</h2>
                <p className="text-slate-600 text-sm mt-1">Step into a world of stories and knowledge!</p>
                <ul className="mt-4 space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="icon-tile bg-blue-50" style={{ color: 'var(--blue)', flexShrink: 0 }}>&#128214;</span>
                    <span><b className="block">Read Books</b><span className="text-slate-500">Explore amazing books</span></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="icon-tile bg-rose-50 text-rose-500" style={{ flexShrink: 0 }}>&#127911;</span>
                    <span><b className="block">Read Along</b><span className="text-slate-500">Listen and read together</span></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="icon-tile bg-amber-50 text-amber-500" style={{ flexShrink: 0 }}>&#127942;</span>
                    <span><b className="block">Quizzes</b><span className="text-slate-500">Test what you learned</span></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="icon-tile bg-green-50 text-green-500" style={{ flexShrink: 0 }}>&#11088;</span>
                    <span><b className="block">Earn Rewards</b><span className="text-slate-500">Collect stars &amp; badges</span></span>
                  </li>
                </ul>
              </div>
            </div>
            <button onClick={() => openLogin('student')} className="btn-bubble btn-primary mt-5 w-full justify-center">
              Explore Library <span>&#8594;</span>
            </button>
          </article>

          {/* Arts */}
          <article className="bg-white rounded-3xl p-5 card-shadow flex flex-col justify-between">
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-3">
                <h2 className="font-display text-2xl" style={{ color: 'var(--purple)' }}>ARTS &amp; FUN</h2>
                <p className="text-slate-600 text-sm mt-1">Unleash your creativity and imagination!</p>
                <ul className="mt-4 space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="icon-tile bg-orange-50 text-orange-500" style={{ flexShrink: 0 }}>&#127912;</span>
                    <span><b className="block">Draw &amp; Color</b><span className="text-slate-500">Create your masterpiece</span></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="icon-tile bg-pink-50 text-pink-500" style={{ flexShrink: 0 }}>&#127925;</span>
                    <span><b className="block">Music Room</b><span className="text-slate-500">Sing, play &amp; explore sounds</span></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="icon-tile bg-cyan-50 text-cyan-500" style={{ flexShrink: 0 }}>&#9986;</span>
                    <span><b className="block">Crafts &amp; DIY</b><span className="text-slate-500">Fun crafts to try at home</span></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="icon-tile bg-fuchsia-50 text-fuchsia-500" style={{ flexShrink: 0 }}>&#127917;</span>
                    <span><b className="block">Dress Up &amp; Play</b><span className="text-slate-500">Dress up and role play</span></span>
                  </li>
                </ul>
              </div>
              <img src="/images/arts.jpg" alt="Arts" className="col-span-2 rounded-2xl object-cover w-full h-full" />
            </div>
            <button onClick={() => openLogin('student')} className="btn-purple mt-5 w-full justify-center">
              Explore Arts &amp; Fun <span>&#8594;</span>
            </button>
          </article>

          {/* Progress */}
          <article className="rounded-3xl p-5 card-shadow" style={{ background: 'linear-gradient(135deg,#eff6ff,#fdf2f8)' }}>
            <div className="flex items-center gap-3">
              <img src="/images/avatar.png" alt="Alex" className="w-14 h-14 rounded-full bg-white object-cover" />
              <div>
                <div className="font-display text-xl">Hi, Alex!</div>
                <div className="text-sm text-slate-600">Keep going, superstar!</div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.7)' }}>
              <div className="flex items-center gap-2 font-bold">
                <span className="icon-tile bg-emerald-100 text-emerald-600" style={{ width: 32, height: 32, fontSize: 16 }}>&#128737;</span>
                Level 4
              </div>
              <div className="progress mt-2"><span></span></div>
              <div className="text-xs text-slate-500 mt-1">320 / 500 XP</div>
            </div>

            <div className="mt-4">
              <div className="font-bold mb-2">Daily Quest</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.7)' }}>
                  <span className="flex items-center gap-2">&#128213; Read a story</span>
                  <span className="text-emerald-500 font-bold">&#10003;</span>
                </li>
                <li className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.7)' }}>
                  <span className="flex items-center gap-2">&#128290; Play a math game</span>
                  <span className="text-slate-300">&#9675;</span>
                </li>
                <li className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.7)' }}>
                  <span className="flex items-center gap-2">&#127912; Create art</span>
                  <span className="text-slate-300">&#9675;</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 bg-amber-50 rounded-2xl p-3 flex items-center gap-3">
              <span className="text-3xl">&#127873;</span>
              <p className="text-sm text-slate-700">Complete all quests to earn a reward!</p>
            </div>
          </article>
        </section>

        {/* PARENT & TUTOR ADVANTAGE SECTION */}
        <section className="mt-8 bg-gradient-to-br from-indigo-50 via-white to-orange-50/30 rounded-[36px] border-4 border-indigo-100 p-8 md:p-12 shadow-md relative overflow-hidden">
          {/* Decorative shapes/emojis */}
          <div className="absolute top-6 right-8 text-5xl opacity-80 select-none animate-pulse">💡</div>
          <div className="absolute bottom-6 left-6 text-5xl opacity-80 select-none">💸</div>

          <div className="max-w-4xl mx-auto space-y-8 relative z-10">
             <div className="text-center space-y-3">
                <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full tracking-widest border border-indigo-100">
                   Designed for Parents &amp; Tutors
                </span>
                <h2 className="font-display text-3xl md:text-4xl text-slate-800 leading-tight">
                   Stop Relying on Expensive Websites &amp; Workbooks!
                </h2>
                <p className="text-sm md:text-base font-medium text-slate-600 max-w-2xl mx-auto leading-relaxed">
                   Quit buying endless practice books or paying for high-priced question banks. Generate custom, curriculum-aligned homework on <strong className="text-indigo-600">any topic</strong> in seconds—tailored perfectly to your child's needs.
                </p>
             </div>

             <div className="grid md:grid-cols-3 gap-6 mt-4">
                <div className="bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-sm hover:shadow-md transition-shadow space-y-3">
                   <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl">💰</div>
                   <h3 className="font-display text-lg text-slate-800">Save Thousands of Dollars</h3>
                   <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      No more subscriptions to expensive learning platforms or constant textbook purchases. Create unlimited custom worksheets and quizzes for free.
                   </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-sm hover:shadow-md transition-shadow space-y-3">
                   <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl">🧠</div>
                   <h3 className="font-display text-lg text-slate-800">Target Any Micro-Skill</h3>
                   <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Whether they need help with decimal place values, specific punctuation, or logical puzzles, select the exact skill from our browser or type any custom prompt.
                   </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-sm hover:shadow-md transition-shadow space-y-3">
                   <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-2xl">🎮</div>
                   <h3 className="font-display text-lg text-slate-800">Self-Motivated Practice</h3>
                   <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Kids complete tasks inside a fun, gamified kids' dashboard featuring interactive adventures, mazes, pet companions, and coin collections.
                   </p>
                </div>
             </div>

             <div className="text-center pt-2">
                <button 
                   onClick={() => openLogin('teacher')} 
                   className="btn-primary inline-flex items-center gap-2 hover:scale-105 transition-all text-sm px-8 py-4 bg-indigo-600 border-indigo-700 text-white shadow-lg shadow-indigo-100"
                   style={{ background: 'var(--blue)', borderColor: 'var(--blue-dark)' }}
                >
                   Start Creating as Parent / Tutor <span>&#8594;</span>
                </button>
             </div>
          </div>
        </section>

        {/* PLAYGROUND HIGHLIGHTS & PRICING PLANS SECTION */}
        <section className="mt-20 space-y-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
             <span className="text-[10px] font-black uppercase text-orange-600 bg-orange-50 px-4 py-1.5 rounded-full tracking-widest border border-orange-100">
                Simple Licensing & Features
             </span>
             <h2 className="font-display text-4xl text-slate-800 leading-tight">
                Everything You Need for Playful Learning
             </h2>
             <p className="text-sm font-bold text-slate-500 leading-relaxed italic">
                Choose the pricing plan that fits your classroom size. Parents and students always learn 100% free!
             </p>
          </div>

          {/* Grid Layout: Vertical Highlights beside Pricing Tiers */}
          <div className="grid lg:grid-cols-12 gap-8 w-full items-stretch">

             {/* Left Column: Kid-Friendly Selling Points Panel (3/12 width) */}
             <div className="lg:col-span-3 bg-gradient-to-br from-[#FFFBEB] via-[#FFF2E8] to-[#FFF5E6] rounded-[40px] p-8 border-4 border-orange-200 shadow-xl space-y-8 flex flex-col justify-between relative overflow-hidden">
                {/* Floating stickers */}
                <div className="absolute top-4 right-4 text-4xl select-none animate-bounce" style={{ animationDuration: '3s' }}>
                   🎈
                </div>
                <div className="absolute bottom-16 right-4 text-4xl select-none animate-bounce" style={{ animationDuration: '4.5s' }}>
                   ⭐
                </div>

                <div className="space-y-6 relative z-10">
                   <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase text-[#EA580C] bg-[#FFEDD5] px-3.5 py-1.5 rounded-full tracking-wider border border-orange-100 inline-block">
                         Playground Highlights
                      </span>
                      <h3 className="font-display text-2xl text-orange-600 leading-tight">
                         A Happy Zone for Learning! 🎒
                      </h3>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">
                         Discover all the features included with every plan, designed to motivate kids and simplify homework tracking.
                      </p>
                   </div>

                   <div className="space-y-5">
                      
                      {/* Highlight 1: Homework Scheduling */}
                      <div className="flex gap-4 items-start group">
                         <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-blue-100 shrink-0 group-hover:scale-110 transition-transform">
                            <Calendar className="w-5 h-5" />
                         </div>
                         <div>
                            <h4 className="text-sm font-bold text-slate-900">Weekly Homework Scheduler</h4>
                            <p className="text-xs text-slate-700 font-normal leading-relaxed mt-0.5">
                               Schedule subject quizzes and homework missions in advance. Plan study runs with easy due-dates.
                            </p>
                         </div>
                      </div>

                      {/* Highlight 2: Kids Progress Chart */}
                      <div className="flex gap-4 items-start group">
                         <div className="w-10 h-10 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-emerald-100 shrink-0 group-hover:scale-110 transition-transform">
                            <BarChart2 className="w-5 h-5" />
                         </div>
                         <div>
                            <h4 className="text-sm font-bold text-slate-900">Visual Progress Tracking</h4>
                            <p className="text-xs text-slate-700 font-normal leading-relaxed mt-0.5">
                               Interactive graphs track accuracy, level accomplishments, and XP points. See how each kid is growing!
                            </p>
                         </div>
                      </div>

                      {/* Highlight 3: Parent-Scheduled Homework */}
                      <div className="flex gap-4 items-start group">
                         <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-purple-100 shrink-0 group-hover:scale-110 transition-transform">
                            <Book className="w-5 h-5" />
                         </div>
                         <div>
                            <h4 className="text-sm font-bold text-slate-900">Parent-Created Missions</h4>
                            <p className="text-xs text-slate-700 font-normal leading-relaxed mt-0.5">
                               Parents can create custom quizzes and worksheets from home to give kids targeted conceptual practice.
                            </p>
                         </div>
                      </div>

                      {/* Highlight 4: Error Explanations */}
                      <div className="flex gap-4 items-start group">
                         <div className="w-10 h-10 bg-gradient-to-tr from-rose-600 to-pink-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-rose-100 shrink-0 group-hover:scale-110 transition-transform">
                            <Star className="w-5 h-5" />
                         </div>
                         <div>
                            <h4 className="text-sm font-bold text-slate-900">Kid-Friendly Error Feedback</h4>
                            <p className="text-xs text-slate-700 font-normal leading-relaxed mt-0.5">
                               Instant explanations help kids understand mistakes, turning incorrect answers into key learning moments!
                            </p>
                         </div>
                      </div>

                      {/* Highlight 5: Adventure Maze & Rewards */}
                      <div className="flex gap-4 items-start group">
                         <div className="w-10 h-10 bg-gradient-to-tr from-orange-600 to-amber-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-orange-100 shrink-0 group-hover:scale-110 transition-transform">
                            <Trophy className="w-5 h-5" />
                         </div>
                         <div>
                            <h4 className="text-sm font-bold text-slate-900">Gamified Adventure Maze</h4>
                            <p className="text-xs text-slate-700 font-normal leading-relaxed mt-0.5">
                               Maze quests, boss questions, and coin collections for sticker items make studying feel like playing!
                            </p>
                         </div>
                      </div>

                   </div>
                </div>

                <div className="pt-4 border-t border-orange-200 relative z-10">
                   <div className="flex items-center gap-2 text-xs font-bold text-[#EA580C]">
                      <span>✨</span>
                      <span>Parents &amp; Students Play 100% Free!</span>
                   </div>
                </div>
             </div>

             {/* Right Column: Pricing Tiers Grid (9/12 width) */}
             <div className="lg:col-span-9 grid sm:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
                
                {/* Free Trial Card */}
                <div className="bg-white rounded-[32px] border border-slate-200 p-8 space-y-6 hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-2">
                   {/* Background Glow */}
                   <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-400/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                   
                   <div className="space-y-4 relative z-10">
                     <div className="flex justify-between items-start">
                       <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center border border-orange-100">
                         <Sparkles className="w-6 h-6 text-orange-500" />
                       </div>
                       <span className="bg-orange-50 text-orange-700 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase border border-orange-200">
                         Trial
                       </span>
                     </div>
                     <div>
                       <h3 className="text-base font-semibold text-orange-600">7-Day Free Trial</h3>
                       <p className="text-xs text-slate-500 font-normal">Full Sandbox Experience</p>
                     </div>
                     <div className="text-3xl font-semibold text-slate-900">
                       $0 <span className="text-sm font-normal text-slate-500">/ 7 days</span>
                     </div>
                     <ul className="text-xs md:text-sm text-slate-800 font-normal space-y-3 pt-2">
                       <li className="flex items-center gap-2">✔️ Unlimited students & seats</li>
                       <li className="flex items-center gap-2">✔️ Full dashboard administrative access</li>
                       <li className="flex items-center gap-2">✔️ Unlimited homework assignments</li>
                       <li className="flex items-center gap-2">✔️ No credit card required to start</li>
                     </ul>
                   </div>
                   <button onClick={() => openLogin('teacher')} className="w-full py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider bg-orange-600 hover:bg-orange-700 text-white transition-all relative z-10">
                     Start Free Trial
                   </button>
                </div>
                
                {/* Option A */}
                <div className="bg-white rounded-[32px] border border-slate-200 p-8 space-y-6 hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-2">
                   {/* Background Glow */}
                   <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-400/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                   
                   <div className="space-y-4 relative z-10">
                     <div className="flex justify-between items-start">
                       <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
                         <TrendingUp className="w-6 h-6 text-blue-600" />
                       </div>
                       <span className="bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase border border-blue-200">
                         Parents
                       </span>
                     </div>
                     <div>
                       <h3 className="text-base font-semibold text-orange-600">Option A: Elastic Monthly</h3>
                       <p className="text-xs text-slate-500 font-normal">Monthly Elastic Seats (For 1–10 students)</p>
                     </div>
                     <div className="text-3xl font-semibold text-slate-900">
                       $5.00 <span className="text-sm font-normal text-slate-500">/ student / month</span>
                     </div>
                     <ul className="text-xs md:text-sm text-slate-800 font-normal space-y-3 pt-2">
                       <li className="flex items-center gap-2">✔️ Best for parents & micro-tutors</li>
                       <li className="flex items-center gap-2">✔️ Scale up to 10 students maximum</li>
                       <li className="flex items-center gap-2">✔️ Pay only for active students ($5–$50/mo)</li>
                       <li className="flex items-center gap-2">✔️ No long term commitment</li>
                     </ul>
                   </div>
                   <button onClick={() => openLogin('teacher')} className="w-full py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider bg-blue-700 hover:bg-blue-800 text-white transition-all relative z-10">
                     Get Started
                   </button>
                </div>

                {/* Option B */}
                <div className="bg-white rounded-[32px] border-4 border-orange-300 p-8 space-y-6 hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-2">
                   {/* Background Glow */}
                   <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-400/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                   
                   <div className="space-y-4 relative z-10">
                     <div className="flex justify-between items-start">
                       <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center border border-orange-100">
                         <Users className="w-6 h-6 text-orange-600" />
                       </div>
                       <span className="bg-orange-50 text-orange-700 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase border border-orange-200">
                         Tutors
                       </span>
                     </div>
                     <div>
                       <h3 className="text-base font-semibold text-orange-600">Option B: Tuition Flat Tiers</h3>
                       <p className="text-xs text-slate-500 font-normal">Fixed Capacity Tiers (For 11–30 students)</p>
                     </div>
                     <div className="space-y-2 pt-2">
                       <div className="flex justify-between items-center text-xs md:text-sm font-normal text-slate-800">
                         <span>Starter (11–20 students)</span>
                         <span className="font-semibold text-slate-900">$45 / mo</span>
                       </div>
                       <div className="flex justify-between items-center text-xs md:text-sm font-normal text-slate-800">
                         <span>Growth (21–30 students)</span>
                         <span className="font-semibold text-slate-900">$75 / mo</span>
                       </div>
                     </div>
                     <ul className="text-xs md:text-sm text-slate-800 font-normal space-y-3 pt-2 border-t border-slate-100">
                       <li className="flex items-center gap-2">✔️ Best for tuition centers (11–30 students)</li>
                       <li className="flex items-center gap-2">✔️ Save up to 50% vs Option A rates</li>
                       <li className="flex items-center gap-2">✔️ Simple flat monthly price</li>
                       <li className="flex items-center gap-2">✔️ Switch plans instantly</li>
                     </ul>
                   </div>
                   <button onClick={() => openLogin('teacher')} className="w-full py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider bg-orange-700 hover:bg-orange-800 text-white transition-all relative z-10">
                     Get Started
                   </button>
                </div>

                {/* Option C */}
                <div className="bg-white rounded-[32px] border border-slate-200 p-8 space-y-6 hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-2">
                   {/* Background Glow */}
                   <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-400/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                   
                   <div className="space-y-4 relative z-10">
                     <div className="flex justify-between items-start">
                       <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100">
                         <GraduationCap className="w-6 h-6 text-emerald-600" />
                       </div>
                       <span className="bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase border border-emerald-200">
                         Schools
                       </span>
                     </div>
                     <div>
                       <h3 className="text-base font-semibold text-orange-600">Option C: School Graduated</h3>
                       <p className="text-xs text-slate-500 font-normal">Yearly Per-Seat Tiers (For 31+ students)</p>
                     </div>
                     <div className="space-y-2 pt-2">
                       <div className="flex justify-between text-xs md:text-sm font-normal text-slate-800">
                         <span>31–100 students</span>
                         <span className="font-semibold text-slate-900">$24 / student / yr</span>
                       </div>
                       <div className="flex justify-between text-xs md:text-sm font-normal text-slate-800">
                         <span>101–500 students</span>
                         <span className="font-semibold text-slate-900">$18 / student / yr</span>
                       </div>
                       <div className="flex justify-between text-xs md:text-sm font-normal text-slate-800">
                         <span>501–1,000 students</span>
                         <span className="font-semibold text-slate-900">$12 / student / yr</span>
                       </div>
                       <div className="flex justify-between text-xs md:text-sm font-normal text-slate-800">
                         <span>1,001+ students</span>
                         <span className="font-semibold text-slate-900">$8 / student / yr</span>
                       </div>
                     </div>
                     <ul className="text-xs md:text-sm text-slate-800 font-normal space-y-3 pt-2 border-t border-slate-100">
                       <li className="flex items-center gap-2">✔️ Requires minimum 31 student seats</li>
                       <li className="flex items-center gap-2">✔️ Perfect for whole school setups</li>
                       <li className="flex items-center gap-2">✔️ Graduated automatic discounts</li>
                       <li className="flex items-center gap-2">✔️ Billed once per year</li>
                     </ul>
                   </div>
                   <button onClick={() => openLogin('teacher')} className="w-full py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider bg-emerald-700 hover:bg-emerald-800 text-white transition-all relative z-10">
                     Get Started
                   </button>
                </div>

             </div>

          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="relative py-24 px-4 overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-display text-4xl md:text-5xl text-slate-900">
                Loved by Teachers & Parents
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                See how Homework Zone is transforming the learning experience for students around the world.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition-all duration-300 group">
                <div className="flex gap-1 text-yellow-400 mb-6">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <p className="text-slate-700 leading-relaxed mb-8 italic">
                  "Homework Zone completely changed how my students engage with their assignments. The gamified reward system keeps them coming back every day!"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-lg">
                    S
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Sarah Jenkins</h4>
                    <p className="text-sm text-slate-500">3rd Grade Teacher</p>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition-all duration-300 group relative mt-4 md:mt-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  Top Review
                </div>
                <div className="flex gap-1 text-yellow-400 mb-6">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <p className="text-slate-700 leading-relaxed mb-8 italic">
                  "As a parent, seeing my son excited to do his math homework is a miracle. He loves taking care of his virtual pet and earning coins."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-600 text-lg">
                    M
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Marcus Chen</h4>
                    <p className="text-sm text-slate-500">Parent of two</p>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 3 */}
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition-all duration-300 group">
                <div className="flex gap-1 text-yellow-400 mb-6">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <p className="text-slate-700 leading-relaxed mb-8 italic">
                  "The AI homework generator saves me literally hours every week. I can instantly create reading comprehension tasks tailored to my class."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-600 text-lg">
                    E
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Elena Rodriguez</h4>
                    <p className="text-sm text-slate-500">Primary School Educator</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Help / Documentation Modal */}
      <AnimatePresence>
        {showHelpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4"
            onClick={() => setShowHelpModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="w-full max-w-4xl bg-white rounded-3xl p-6 md:p-8 card-shadow relative flex flex-col h-[75vh] md:h-[650px] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowHelpModal(false)}
                className="absolute top-5 right-5 w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold transition-colors z-20"
              >
                &#10005;
              </button>

              {/* Title Header */}
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6 shrink-0">
                <img src="/images/owl.png" alt="Owl" className="w-12 h-12" />
                <div>
                  <h3 className="font-display text-2xl text-slate-900">Homework Zone Guide</h3>
                  <p className="text-sm text-slate-500">Learn how to explore, assign missions, and earn rewards!</p>
                </div>
              </div>

              {/* Tabs Content Layout */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden gap-6 min-h-0">
                {/* Tabs Sidebar */}
                <div className="flex md:flex-col gap-2 shrink-0 md:w-52 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 md:border-r border-slate-100 pr-0 md:pr-4">
                  <button
                    onClick={() => setActiveHelpTab('student')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black transition-all ${
                      activeHelpTab === 'student'
                        ? 'bg-blue-50 text-blue-600 font-semibold'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span>🎒</span> Student Guide
                  </button>
                  <button
                    onClick={() => setActiveHelpTab('teacher')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black transition-all ${
                      activeHelpTab === 'teacher'
                        ? 'bg-green-50 text-green-600 font-semibold'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span>👩‍🏫</span> Teacher Guide
                  </button>
                  <button
                    onClick={() => setActiveHelpTab('rewards')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black transition-all ${
                      activeHelpTab === 'rewards'
                        ? 'bg-amber-50 text-amber-600 font-semibold'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span>✨</span> Points & Shop
                  </button>
                  <button
                    onClick={() => setActiveHelpTab('faq')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black transition-all ${
                      activeHelpTab === 'faq'
                        ? 'bg-rose-50 text-rose-600 font-semibold'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span>❓</span> FAQs
                  </button>
                </div>

                {/* Tab Panel Detail Content */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                  {activeHelpTab === 'student' && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-black text-slate-800 mb-2">🎒 Student Guide: Play, Learn, and Earn!</h4>
                        <p className="text-sm text-slate-600">Homework Zone is your virtual learning playground! Complete missions set by your teacher, explore the maze, and unlock cool rewards.</p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/60">
                          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-black mb-3">1</div>
                          <h5 className="font-bold text-slate-800 text-sm mb-1">🔑 Log In Safely</h5>
                          <p className="text-xs text-slate-500">Ask your teacher for their 6-letter <strong>Teacher Code</strong>. Enter the code, select your name from the class list, and you're in!</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/60">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black mb-3">2</div>
                          <h5 className="font-bold text-slate-800 text-sm mb-1">🚀 Complete Homework Missions</h5>
                          <p className="text-xs text-slate-500">Check "My Homework" for active quizzes. Read questions carefully and submit answers to earn stars and gold coins!</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100/60">
                          <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-black mb-3">3</div>
                          <h5 className="font-bold text-slate-800 text-sm mb-1">🧭 Play in the Adventure Maze</h5>
                          <p className="text-xs text-slate-500">Navigate paths, answer questions, and defeat maze modules to earn massive XP and unlock unique master badges.</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-green-50/50 border border-green-200/60">
                          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-black mb-3">4</div>
                          <h5 className="font-bold text-slate-800 text-sm mb-1">🛍️ Shop the Reward Store</h5>
                          <p className="text-xs text-slate-500">Spend your gold coins to buy cute animal stickers, profile background wallpapers, and special customized teacher rewards!</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeHelpTab === 'teacher' && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-black text-slate-800 mb-2">👩‍🏫 Teacher Guide: Manage &amp; Inspect Mastery</h4>
                        <p className="text-sm text-slate-600">The Executive Teacher Dashboard gives you administrative powers to configure classrooms, assign tasks, and track student learning growth.</p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-green-50/50 border border-green-200/60">
                          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-black mb-3">1</div>
                          <h5 className="font-bold text-slate-800 text-sm mb-1">👥 Manage Class Rosters</h5>
                          <p className="text-xs text-slate-500">Create classes and add student names. Share your 6-character <strong>Teacher Code</strong> (shown in your sidebar) so students can log in.</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/60">
                          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-black mb-3">2</div>
                          <h5 className="font-bold text-slate-800 text-sm mb-1">📝 Assign Quizzes (Missions)</h5>
                          <p className="text-xs text-slate-500">Create homework missions in seconds. Customize question sets, due dates, and titles to align with your syllabus topics.</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100/60">
                          <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-black mb-3">3</div>
                          <h5 className="font-bold text-slate-800 text-sm mb-1">🔍 Student Detail Profiles</h5>
                          <p className="text-xs text-slate-500">Click any student in your Class Roster or Gradebook logs to open their <strong>Student Detail Modal</strong>. View detailed mastery trends and individual quiz answers.</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100/60">
                          <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-black mb-3">4</div>
                          <h5 className="font-bold text-slate-800 text-sm mb-1">🎁 Reward Store Control</h5>
                          <p className="text-xs text-slate-500">Create and list customized items. Monitor pending student redemptions in your "Pending Redemptions" panel so you can hand them out in class.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeHelpTab === 'rewards' && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-black text-slate-800 mb-2">✨ Points, Gold Coins, and Shop Items</h4>
                        <p className="text-sm text-slate-600">Encourage continuous learning through gamified progression loops. Students earn currency by working hard, which they spend on virtual stickers and real-world items.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                          <span className="text-2xl pt-1">💰</span>
                          <div>
                            <h5 className="font-bold text-slate-800 text-sm mb-1">Gold Coins (Earn Rate)</h5>
                            <p className="text-xs text-slate-500 leading-relaxed">Students earn <strong>100 Gold Coins</strong> for every correctly answered question in homework missions. An additional bonus of up to <strong>200 coins</strong> is awarded for completing missions with high accuracy!</p>
                          </div>
                        </div>

                        <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                          <span className="text-2xl pt-1">🎟️</span>
                          <div>
                            <h5 className="font-bold text-slate-800 text-sm mb-1">Teacher Custom Rewards</h5>
                            <p className="text-xs text-slate-500 leading-relaxed">Teachers can list physical and classroom rewards (such as "15 mins of Free Time" or "Sit next to a friend for a day"). When students purchase these, the teacher gets a notification in the "Rewards Dashboard" to distribute them.</p>
                          </div>
                        </div>

                        <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                          <span className="text-2xl pt-1">⭐</span>
                          <div>
                            <h5 className="font-bold text-slate-800 text-sm mb-1">Sticker Customization</h5>
                            <p className="text-xs text-slate-500 leading-relaxed">Stickers unlocked from the store can be dragged and resized onto the student's profile wallpaper canvas, giving them an interactive workspace to showcase their hard work!</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeHelpTab === 'faq' && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-black text-slate-800 mb-2">❓ Frequently Asked Questions</h4>

                      <HelpAccordion question="Where do students find their Teacher Code?">
                        Teachers can view their active 6-letter <strong>Teacher Code</strong> inside their dashboard sidebar at any time. Share this code with students so they can locate your classroom list and sign in.
                      </HelpAccordion>

                      <HelpAccordion question="What is the difference between starting accuracy and best accuracy?">
                        <strong>Starting accuracy</strong> logs the score achieved on their very first attempt at a homework mission. <strong>Best accuracy</strong> logs their highest-ever score. This helps teachers track their initial understanding vs. progress after practice.
                      </HelpAccordion>

                      <HelpAccordion question="How do teachers clear/reset homework submissions?">
                        Inside the teacher's dashboard, go to the <strong>Gradebook Logs</strong> tab, locate the student's submission, and click "Reset Submission" or delete the grade record to let the student attempt the mission again.
                      </HelpAccordion>

                      <HelpAccordion question="Do students require individual email accounts?">
                        No. Students do not need email accounts or passwords. They only enter the <strong>Teacher Code</strong> and select their name from the list. This makes login simple and safe for elementary classes.
                      </HelpAccordion>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inline Login Modal */}
      <AnimatePresence>
        {showLoginModal !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4"
            onClick={() => setShowLoginModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="w-full max-w-md bg-white rounded-3xl p-8 card-shadow relative space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowLoginModal(null)}
                className="absolute top-5 right-5 w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold transition-colors"
              >
                &#10005;
              </button>

              <div className="flex items-center gap-3">
                <img src="/images/owl.png" alt="" className="w-12 h-12" />
                <div>
                  <h3 className="font-display text-2xl text-slate-900">
                    {showLoginModal === 'teacher' ? 'Parent & Teacher Zone' : 'Student Portal'}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {showLoginModal === 'teacher' ? 'Sign in to manage your classroom' : 'Enter your details to start learning'}
                  </p>
                </div>
              </div>

              {errorMsg && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-2xl text-sm font-semibold">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {showLoginModal === 'teacher' ? (
                  <div className="space-y-4">
                    {/* Toggle Mode */}
                    <div className="flex bg-slate-100 p-1 rounded-2xl">
                      <button
                        type="button"
                        onClick={() => setTeacherMode('login')}
                        className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${teacherMode === 'login' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500'}`}
                      >
                        🔑 Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => setTeacherMode('register')}
                        className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${teacherMode === 'register' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500'}`}
                      >
                        🚀 Register
                      </button>
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Email Address</label>
                      <input
                        type="email"
                        value={teacherEmail}
                        onChange={(e) => setTeacherEmail(e.target.value)}
                        placeholder="teacher@school.com"
                        required
                        className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 outline-none focus:border-green-400 transition-colors font-bold text-center text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Password</label>
                      <input
                        type="password"
                        value={teacherPassword}
                        onChange={(e) => setTeacherPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 outline-none focus:border-green-400 transition-colors font-bold text-center text-sm"
                      />
                    </div>

                    {teacherMode === 'login' && (
                      <div className="text-right">
                        <button
                          type="button"
                          onClick={handlePasswordReset}
                          className="text-[10px] font-black text-slate-400 hover:text-green-500 transition-colors"
                        >
                          Forgot Password?
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-1.5">Teacher Code</label>
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => { setCode(e.target.value); setShowPwField(false); }}
                        placeholder="e.g. HWZ123"
                        required
                        className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 outline-none focus:border-blue-400 transition-colors font-bold text-center text-lg tracking-widest uppercase"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-1.5">Your Name</label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => { setStudentName(e.target.value); setShowPwField(false); }}
                        placeholder="e.g. Alex"
                        required
                        className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 outline-none focus:border-blue-400 transition-colors font-bold text-center text-lg"
                      />
                    </div>
                    {showPwField && (
                      <div>
                        <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-1.5">🔒 Password</label>
                        <input
                          type="password"
                          value={studentPassword}
                           onChange={(e) => setStudentPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                          autoFocus
                          className="w-full px-4 py-3 rounded-2xl border-2 border-blue-300 outline-none focus:border-blue-500 transition-colors font-bold text-center text-lg"
                        />
                        <p className="text-xs text-slate-400 text-center mt-1.5">Enter the password you set when you first logged in.</p>
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoginLoading}
                  className="btn-bubble btn-primary w-full justify-center"
                  style={isLoginLoading ? { background: '#94a3b8', boxShadow: 'none' } : {}}
                >
                  {isLoginLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                      Please wait...
                    </span>
                  ) : showLoginModal === 'teacher' ? (teacherMode === 'register' ? 'Create Account 🚀' : 'Sign In 🔑') : showPwField ? '🔓 Login' : "Let's Go!"}
                </button>
              </form>

              {showLoginModal === 'teacher' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-px bg-slate-200 flex-1" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Or Continue With</span>
                    <div className="h-px bg-slate-200 flex-1" />
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoginLoading}
                    className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 border-2 border-slate-200 active:scale-95 rounded-2xl py-3 text-sm font-black text-slate-700 shadow-sm transition-all"
                  >
                    <img src="https://img.icons8.com/color/48/google-logo.png" className="w-5 h-5" alt="Google" />
                    Sign In with Google
                  </button>
                </div>
              )}

              <div className="text-center">
                {showLoginModal === 'teacher' ? (
                  <button onClick={() => openLogin('student')} className="text-sm font-bold text-slate-400 hover:text-blue-500 transition-colors">
                    Are you a student? Click here
                  </button>
                ) : (
                  <button onClick={() => openLogin('teacher')} className="text-sm font-bold text-slate-400 hover:text-green-500 transition-colors">
                    Are you a Teacher or Parent? Click here
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Create Password Modal (first-time student login) ── */}
      <AnimatePresence>
        {showCreatePassword && pendingStudentInfo && (
          <motion.div
            key="create-pw-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(6px)' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm space-y-5"
            >
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="text-5xl">🔐</div>
                <h2 className="text-2xl font-black text-slate-800">Create Your Password</h2>
                <p className="text-sm text-slate-500">
                  Hi <strong>{pendingStudentInfo.matchedStudentName}</strong>! This is your first time logging in.
                  Please create a secret password — you'll need it every time you log in.
                </p>
              </div>

              {createPwError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-2xl text-sm font-semibold text-center">
                  {createPwError}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-1.5">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    autoFocus
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 outline-none focus:border-blue-400 transition-colors font-bold text-center text-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-1.5">Confirm Password</label>
                  <input
                    type="password"
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                    placeholder="Type it again"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 outline-none focus:border-blue-400 transition-colors font-bold text-center text-lg"
                  />
                </div>
              </div>

              <button
                disabled={createPwLoading}
                onClick={async () => {
                  setCreatePwError('');
                  if (newPassword.length < 6) {
                    setCreatePwError('Password must be at least 6 characters long.');
                    return;
                  }
                  if (newPassword !== newPasswordConfirm) {
                    setCreatePwError('Passwords do not match. Please try again!');
                    return;
                  }
                  setCreatePwLoading(true);
                  try {
                    const pwHash = await hashPassword(newPassword);
                    await updateDoc(pendingStudentInfo.studentDocRef, { passwordHash: pwHash });
                    // Auto-login the student
                    onStudentLogin({
                      teacher: { uid: pendingStudentInfo.teacherDoc.id, ...pendingStudentInfo.teacherData },
                      name: pendingStudentInfo.matchedStudentName,
                      classroom: pendingStudentInfo.studentClass
                    });
                    setShowCreatePassword(false);
                    setPendingStudentInfo(null);
                    setNewPassword('');
                    setNewPasswordConfirm('');
                    navigate('/dashboard/student');
                  } catch (err) {
                    console.error('Password creation failed:', err);
                    setCreatePwError('Something went wrong. Please try again!');
                  }
                  setCreatePwLoading(false);
                }}
                className="btn-bubble btn-primary w-full justify-center"
                style={createPwLoading ? { background: '#94a3b8', boxShadow: 'none' } : {}}
              >
                {createPwLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                    Saving...
                  </span>
                ) : '✅ Set My Password & Enter'}
              </button>

              <p className="text-xs text-slate-400 text-center">
                🔒 Your password is stored securely and privately.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- (LoginPage removed — login is handled inline by LandingPage) ---
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
          
          // Enforce 7-day trial check for unpaid accounts
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
                setErrorMsg("Your classroom's trial has expired. Ask your teacher/parent to subscribe to unlock the Homework Zone! 🔒");
                setIsLoading(false);
                return;
              }
            }
          }

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
                matchedStudentName = (matchedDoc.data().name || matchedDoc.id).trim();
                // Check if student is paused by the teacher
                const studentStatus = matchedDoc.data().status;
                if (studentStatus === 'paused') {
                   setErrorMsg("Your account has been paused by your teacher. Please speak to your teacher to restore access. 🔒");
                   alert("Your account has been paused by your teacher. Please speak to your teacher to restore access. 🔒");
                   setIsLoading(false);
                   return;
                }
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
    <div className={`min-h-screen bg-[#E0F2FE] flex-center p-6 relative overflow-hidden ${role === 'teacher' ? 'teacher-theme' : 'student-theme'}`}>
      {role === 'teacher' && (
        <style>{`
          .teacher-theme h1,
          .teacher-theme h2,
          .teacher-theme h3,
          .teacher-theme h4,
          .teacher-theme h5,
          .teacher-theme h6 {
            font-weight: 400 !important;
          }
          .teacher-theme p,
          .teacher-theme span,
          .teacher-theme div,
          .teacher-theme button,
          .teacher-theme input,
          .teacher-theme label,
          .teacher-theme small,
          .teacher-theme strong,
          .teacher-theme select,
          .teacher-theme textarea,
          .teacher-theme a,
          .teacher-theme li,
          .teacher-theme td,
          .teacher-theme th {
            font-weight: 400 !important;
          }
        `}</style>
      )}
      <div className="absolute top-10 left-1/2 -translate-x-1/2">
         <div className="bg-[#FBBF24] border-4 border-[#2D3748] px-10 py-4 rounded-3xl shadow-[4px_4px_0_0_#2D3748] transform rotate-1">
            <h2 className="text-2xl font-normal text-[#2D3748] uppercase tracking-tight">{role === 'teacher' ? 'TEACHER LOGIN' : 'STUDENT PORTAL'}</h2>
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
          className={`${isLoading ? 'bg-slate-300' : 'bg-[#38BDF8] hover:bg-[#EA580C]'} text-white border-4 border-[#2D3748] w-full py-5 rounded-3xl font-semibold text-xl uppercase tracking-tighter shadow-[0_8px_0_0_#2D3748] active:translate-y-1 active:shadow-none transition-all`}
        >
          {isLoading ? 'Wait for it...' : role === 'teacher' ? 'Sign in with Google' : "Let's Go!"}
        </button>

        <div className="space-y-3">
          <p className="text-center text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
             {role === 'teacher' ? 'Secure Teacher Link' : 'Secure Student Portal'}
          </p>
          <div className="text-center pt-1">
             <button
                onClick={() => navigate('/')}
                className="text-xs font-black text-slate-400 hover:text-[#38BDF8] transition-all duration-300 uppercase tracking-widest flex items-center justify-center gap-1.5 mx-auto hover:scale-[1.05]"
             >
                🏠 Back to Home
             </button>
          </div>
        </div>
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
  const [toasts, setToasts] = useState([]);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: '',
    resolve: null
  });

  const handleConfirm = () => {
    if (confirmModal.resolve) {
      confirmModal.resolve(true);
    }
    setConfirmModal({ isOpen: false, message: '', resolve: null });
  };

  const handleCancel = () => {
    if (confirmModal.resolve) {
      confirmModal.resolve(false);
    }
    setConfirmModal({ isOpen: false, message: '', resolve: null });
  };

  const confirmStyle = useMemo(() => {
    if (!confirmModal.message) return {};
    const msg = confirmModal.message.toLowerCase();
    if (msg.includes('delete') || msg.includes('remove') || msg.includes('🗑️') || msg.includes('trash')) {
      return {
        icon: '🗑️',
        bg: 'bg-rose-50 border border-rose-100',
        accent: 'bg-rose-500 hover:bg-rose-600 shadow-rose-100 text-white',
        title: 'Delete Confirmation',
        btnText: 'Yes, Delete'
      };
    }
    if (msg.includes('reset') || msg.includes('🔄')) {
      return {
        icon: '🔄',
        bg: 'bg-blue-50 border border-blue-100',
        accent: 'bg-blue-500 hover:bg-blue-600 shadow-blue-100 text-white',
        title: 'Reset Progress',
        btnText: 'Yes, Reset'
      };
    }
    return {
      icon: '⚠️',
      bg: 'bg-amber-50 border border-amber-100',
      accent: 'bg-amber-500 hover:bg-amber-600 shadow-amber-100 text-white',
      title: 'Confirm Action',
      btnText: 'Yes, Confirm'
    };
  }, [confirmModal.message]);

  // Setup global alert interceptor & custom confirm dialog
  useEffect(() => {
    window.alert = (message) => {
      if (message === undefined || message === null) return;
      const strMsg = typeof message === 'string' ? message : String(message);
      
      // Determine type based on emojis or key phrases
      let type = 'info';
      const lowerMsg = strMsg.toLowerCase();
      if (strMsg.includes('❌') || lowerMsg.includes('failed') || lowerMsg.includes('error') || lowerMsg.includes('invalid') || lowerMsg.includes('missing') || lowerMsg.includes('expired') || lowerMsg.includes('oops')) {
        type = 'error';
      } else if (strMsg.includes('🎉') || strMsg.includes('🚀') || strMsg.includes('✨') || lowerMsg.includes('success') || lowerMsg.includes('saved') || lowerMsg.includes('redeemed') || lowerMsg.includes('deleted')) {
        type = 'success';
      } else if (lowerMsg.includes('warn') || lowerMsg.includes('attention') || lowerMsg.includes('please') || strMsg.includes('⚠️')) {
        type = 'warning';
      }
      
      const id = Date.now() + Math.random().toString(36).substr(2, 9);
      setToasts(prev => [...prev, { id, message: strMsg, type }]);
    };

    window.showToast = ({ message, type = 'info', onClick }) => {
      const id = Date.now() + Math.random().toString(36).substr(2, 9);
      setToasts(prev => [...prev, { id, message, type, onClick }]);
    };

    window.confirmCustom = (message) => {
      return new Promise((resolve) => {
        setConfirmModal({
          isOpen: true,
          message: message || 'Are you sure you want to proceed?',
          resolve
        });
      });
    };
  }, []);

  // Handle toast auto-dismissal
  useEffect(() => {
    const activeTimers = toasts.map(toast => {
      // Auto-dismiss successes after 4 seconds. Info/Message alerts remain until closed.
      if (toast.type === 'success') {
        return setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== toast.id));
        }, 4000);
      }
      return null;
    });

    return () => {
      activeTimers.forEach(timer => timer && clearTimeout(timer));
    };
  }, [toasts]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isEmailProvider = user.providerData.some(p => p.providerId === 'password');
        if (isEmailProvider && !user.emailVerified) {
          console.log("App: Email not verified. Auto-login skipped.");
          setCurrentUser(null);
          setIsLoading(false);
          return;
        }
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
      const studentRef = doc(db, 'teachers', data.teacher.uid, 'students', data.name?.trim().toLowerCase());
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
    <>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<LandingPage currentUser={currentUser} onTeacherLogin={setCurrentUser} onStudentLogin={handleStudentLogin} />} />
          <Route path="/login/teacher" element={<div className="teacher-theme"><LoginPage role="teacher" onLogin={setCurrentUser} /></div>} />
          <Route path="/login/student" element={<div className="student-theme"><LoginPage role="student" onLogin={handleStudentLogin} /></div>} />
          <Route path="/dashboard/teacher" element={currentUser ? <div className="teacher-theme"><TeacherDashboard user={currentUser} onLogout={handleTeacherLogout} /></div> : <Navigate to="/login/teacher" />} />
          <Route path="/dashboard/student" element={<div className="student-theme"><StudentDashboard teacher={activeStudent?.teacher} studentName={activeStudent?.name} classroom={activeStudent?.classroom} onLogout={handleStudentLogout} /></div>} />
          <Route path="/quiz/sample" element={<StudentQuiz />} />
          <Route path="/documentation" element={<PlatformDocumentation />} />
        </Routes>
      </Router>

      {/* Global Premium Toast Container */}
      <div className="fixed bottom-6 right-6 z-[99999] flex flex-col-reverse gap-4 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => {
            // Default (Info/Message)
            let icon = <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${toast.id}&backgroundColor=fed7aa`} className="w-12 h-12 rounded-full border-2 border-orange-400 shadow-sm" alt="Robot" />;
            let borderClass = 'border-orange-400 bg-[#F0FDF4]'; // green-50
            let bgGlow = 'rgba(234, 88, 12, 0.2)';
            let textColor = 'text-green-800';

            if (toast.type === 'success') {
              icon = <img src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${toast.id}&backgroundColor=bbf7d0`} className="w-12 h-12 rounded-full border-2 border-emerald-400 shadow-sm" alt="Star" />;
              borderClass = 'border-emerald-400 bg-emerald-50';
              bgGlow = 'rgba(16, 185, 129, 0.2)';
              textColor = 'text-emerald-800';
            } else if (toast.type === 'error') {
              icon = <AlertCircle className="w-10 h-10 text-rose-500 fill-rose-100 animate-shake" />;
              borderClass = 'border-rose-400 bg-rose-50';
              bgGlow = 'rgba(244, 63, 94, 0.2)';
              textColor = 'text-rose-800';
            } else if (toast.type === 'warning') {
              icon = <AlertCircle className="w-10 h-10 text-orange-500 fill-orange-100 animate-pulse" />;
              borderClass = 'border-orange-500 bg-orange-50';
              bgGlow = 'rgba(245, 158, 11, 0.2)';
              textColor = 'text-orange-900';
            }

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 50, scale: 0.5, rotate: -5 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 20, transition: { duration: 0.2 } }}
                onClick={(e) => {
                  if (toast.onClick) {
                    toast.onClick();
                    setToasts(prev => prev.filter(t => t.id !== toast.id));
                  }
                }}
                className={`pointer-events-auto border-4 ${borderClass} shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[32px] p-5 flex items-center gap-4 relative overflow-hidden ${toast.onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
                style={{ boxShadow: `0 15px 30px -10px ${bgGlow}, 0 0 0 4px white inset` }}
              >
                <div className="shrink-0">
                  {icon}
                </div>
                <div className="flex-1 pr-6 flex flex-col gap-1">
                  <p className={`text-lg font-black ${textColor} leading-tight drop-shadow-sm`}>
                    {toast.message}
                  </p>
                  {toast.onClick && (
                     <span className="text-xs font-black text-orange-500 uppercase tracking-wider animate-pulse">
                        👉 Click to View!
                     </span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setToasts(prev => prev.filter(t => t.id !== toast.id));
                  }}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-orange-400 hover:text-white rounded-full bg-orange-100 hover:bg-orange-500 transition-all shadow-sm"
                >
                  <X size={18} strokeWidth={4} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Global Premium Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md"
            onClick={handleCancel}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-white rounded-[32px] border border-slate-100 max-w-sm w-full p-8 space-y-6 shadow-2xl relative flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center text-center space-y-4 w-full">
                <div className={`w-16 h-16 ${confirmStyle.bg} rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-2`}>
                  {confirmStyle.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{confirmStyle.title}</h3>
                <p className="text-sm font-bold text-slate-500 leading-relaxed whitespace-pre-line">
                  {confirmModal.message}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full pt-2">
                <button
                  onClick={handleConfirm}
                  className={`flex-1 ${confirmStyle.accent} py-3.5 px-6 rounded-2xl font-black text-sm shadow-lg active:scale-95 transition-all`}
                >
                  {confirmStyle.btnText}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 py-3.5 px-6 rounded-2xl font-black text-sm active:scale-95 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
