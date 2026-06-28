import React, { useState, useEffect, useMemo } from 'react';
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
  Sparkles,
  MoreVertical,
  Home,
  Users,
  User,
  MessageSquare,
  BarChart,
  Trophy,
  X,
  Award,
  TrendingUp,
  Clock,
  Activity,
  Send,
  GraduationCap,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  CreditCard,
  Save,
  CheckCircle,
  DollarSign,
  PauseCircle,
  PlayCircle
} from 'lucide-react';

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';

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
import { collection, doc, getDoc, setDoc, getDocs, query, orderBy, deleteDoc, where, onSnapshot, addDoc, collectionGroup, updateDoc } from 'firebase/firestore';
import HomeworkGenerator from './HomeworkGenerator';
import HomeworkScheduler from './HomeworkScheduler';
import TestReportsDashboard from '../components/TestReportsDashboard';
import { encryptText, decryptText } from '../utils/crypto';
import { fetchWithRetry, generateContent } from '../utils/aiClient';

const normalizeName = (name) => (name || '').trim().toLowerCase().replace(/\s+/g, ' ');

const getQuestionSubtopic = (hw, q) => {
  const sub = (q.subtopic || '').trim();
  const text = (q.text || '').toLowerCase();
  const title = (hw.title || '').toLowerCase();
  const subject = (hw.subject || '').toLowerCase();
  
  // Combine all context clues
  const context = `${sub} ${title} ${text}`.toLowerCase();
  
  // 1. Map context clues to a standardized core concept
  // Mathematics
  if (context.includes('fraction') || context.includes('numerator') || context.includes('denominator')) return 'Fractions';
  if (context.includes('decimal') || context.includes('tenths') || context.includes('hundredths')) return 'Decimals';
  if (context.includes('addition') || context.includes('add ') || context.includes('adding') || context.includes('sum') || context.includes('+')) return 'Addition';
  if (context.includes('subtraction') || context.includes('subtract') || context.includes('minus') || context.includes('difference') || context.includes('-')) return 'Subtraction';
  if (context.includes('multiplication') || context.includes('multiply') || context.includes('times') || context.includes('product') || context.includes('*')) return 'Multiplication';
  if (context.includes('division') || context.includes('divide') || context.includes('quotient') || context.includes('ratio')) return 'Division';
  if (context.includes('geometry') || context.includes('angle') || context.includes('shape') || context.includes('triangle') || context.includes('perimeter') || context.includes('area') || context.includes('polygon')) return 'Geometry';
  if (context.includes('algebra') || context.includes('equation') || context.includes('variable') || context.includes('expression')) return 'Algebra';
  if (context.includes('measurement') || context.includes('metric') || context.includes('ruler') || context.includes('time') || context.includes('clock') || context.includes('money') || context.includes('calendar') || context.includes('hour') || context.includes('minute')) return 'Measurement & Time';
  
  // English / Literacy
  if (context.includes('spelling') || context.includes('spell ')) return 'Spelling';
  if (context.includes('punctuation') || context.includes('comma') || context.includes('period') || context.includes('question mark') || context.includes('apostrophe') || context.includes('exclamation') || context.includes('quotation')) return 'Punctuation';
  if (context.includes('noun')) return 'Nouns';
  if (context.includes('verb') || context.includes('tense')) return 'Verbs';
  if (context.includes('adjective')) return 'Adjectives';
  if (context.includes('pronoun')) return 'Pronouns';
  if (context.includes('preposition') || context.includes('conjunction') || context.includes('adverb') || context.includes('grammar') || context.includes('sentence')) return 'Grammar & Parts of Speech';
  if (context.includes('comprehension') || context.includes('reading') || context.includes('passage') || context.includes('inference') || context.includes('context clue')) return 'Reading Comprehension';
  if (context.includes('vocabulary') || context.includes('synonym') || context.includes('antonym') || context.includes('definition') || context.includes('meaning')) return 'Vocabulary';

  // Science
  if (context.includes('planet') || context.includes('solar') || context.includes('star') || context.includes('space') || context.includes('orbit') || context.includes('universe') || context.includes('galaxy') || context.includes('moon')) return 'Space & Astronomy';
  if (context.includes('cell') || context.includes('plant') || context.includes('animal') || context.includes('photosynthesis') || context.includes('body') || context.includes('organism') || context.includes('ecosystem') || context.includes('human') || context.includes('biology')) return 'Biology & Life Sciences';
  if (context.includes('chemical') || context.includes('molecule') || context.includes('atom') || context.includes('reaction') || context.includes('element') || context.includes('state of matter') || context.includes('chemistry')) return 'Chemistry & Matter';
  if (context.includes('gravity') || context.includes('force') || context.includes('energy') || context.includes('motion') || context.includes('magnet') || context.includes('physics') || context.includes('electricity') || context.includes('light')) return 'Physics & Energy';
  if (context.includes('weather') || context.includes('climate') || context.includes('rock') || context.includes('earth') || context.includes('water cycle') || context.includes('erosion') || context.includes('soil') || context.includes('environment')) return 'Earth & Environmental Sciences';
  
  // Fallback based on Subject if available
  if (subject.includes('math') || subject.includes('arithmetic')) return 'General Maths';
  if (subject.includes('english') || subject.includes('literacy') || subject.includes('reading')) return 'General English';
  if (subject.includes('science')) return 'General Science';
  
  // Final generic fallbacks
  if (sub) {
     return sub.charAt(0).toUpperCase() + sub.slice(1);
  }
  if (hw.title) {
     return hw.title.replace(/\(Grade\s+\d+\)/i, '').trim();
  }
  return 'General Concepts';
};

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
               <p className="text-xs font-bold text-white/95">Let's celebrate our star student's special day! 🎈✨</p>
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

const GRADES = [
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4',
  'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8',
  'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
];

const resolveGradeFromClassroomName = (classroomName) => {
  if (!classroomName) return 'Grade 1';
  const match = classroomName.match(/\d+/);
  if (match) {
    const num = parseInt(match[0], 10);
    if (num >= 1 && num <= 12) {
      return `Grade ${num}`;
    }
  }
  return 'Grade 1';
};

const TeacherDashboard = ({ user, onLogout }) => {
  console.log("TeacherDashboard Rendered. User:", user);
  const [classrooms, setClassrooms] = useState([]);
  const [activeClassroom, setActiveClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState('');
  const [newClassName, setNewClassName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
   const [completionTab, setCompletionTab] = useState('lagging');
  const [teacherBilling, setTeacherBilling] = useState(null);
  const [teacherData, setTeacherData] = useState(null);
  
  // ─── Admin Executive Roles ───────────────────────────────────────────────
  const isAdminUser = teacherData?.isAdmin === true || teacherData?.role === 'admin';

  const [adminTeachers, setAdminTeachers] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');
  const [adminPlanFilter, setAdminPlanFilter] = useState('all');
  const [adminStatusFilter, setAdminStatusFilter] = useState('all');
  const [adminSortField, setAdminSortField] = useState('createdAt');
  const [adminSortOrder, setAdminSortOrder] = useState('desc');

  const fetchAdminData = async () => {
    setAdminLoading(true);
    try {
      const studentQuery = query(collectionGroup(db, 'students'));
      const studentSnap = await getDocs(studentQuery);
      const studentCounts = {};
      studentSnap.forEach(doc => {
        const parts = doc.ref.path.split('/');
        const teacherId = parts[1];
        if (teacherId) {
          studentCounts[teacherId] = (studentCounts[teacherId] || 0) + 1;
        }
      });

      const classQuery = query(collectionGroup(db, 'classrooms'));
      const classSnap = await getDocs(classQuery);
      const classCounts = {};
      classSnap.forEach(doc => {
        const parts = doc.ref.path.split('/');
        const teacherId = parts[1];
        if (teacherId) {
          classCounts[teacherId] = (classCounts[teacherId] || 0) + 1;
        }
      });

      const teachersSnap = await getDocs(collection(db, 'teachers'));
      const teachersList = [];

      teachersSnap.forEach(docSnap => {
        const data = docSnap.data();
        const teacherId = docSnap.id;
        const studentCount = studentCounts[teacherId] || 0;
        const classCount = classCounts[teacherId] || 0;
        const billing = data.billing || { planId: 'free', status: 'none', quantity: 0 };

        const rawCreated = billing?.createdAt || data?.createdAt || data?.billing?.createdAt;
        let trialDaysLeft = 7;
        if (rawCreated) {
          const diffDays = Math.floor((new Date() - new Date(rawCreated)) / (1000 * 60 * 60 * 24));
          trialDaysLeft = 7 - diffDays;
        }

        const activePlanId = (billing && ['active', 'trialing'].includes(billing.status)) ? billing.planId : 'free';
        const isPaid = activePlanId !== 'free';

        let conversionStatus = 'Active Trial';
        if (isPaid) {
          conversionStatus = 'Converted (Paid)';
        } else if (trialDaysLeft < 0) {
          conversionStatus = 'Expired Trial (Unconverted)';
        }

        teachersList.push({
          id: teacherId,
          name: data.displayName || 'Unnamed Teacher',
          email: data.email || 'No Email',
          teacherCode: data.teacherCode || 'N/A',
          createdAt: data.createdAt || billing.createdAt || new Date().toISOString(),
          billing,
          studentCount,
          classCount,
          trialDaysLeft,
          activePlanId,
          isPaid,
          conversionStatus,
          mrr: getTeacherMRR(billing, studentCount)
        });
      });

      setAdminTeachers(teachersList);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
    setAdminLoading(false);
  };

  const getTeacherMRR = (billing, studentCount) => {
    if (!billing || !['active', 'trialing'].includes(billing.status)) return 0;
    const planId = billing.planId;
    if (planId === 'option-a') {
      return studentCount * 1.50;
    }
    if (planId === 'option-b-starter') return 15;
    if (planId === 'option-b-growth') return 45;
    if (planId === 'option-b-school') return 99;
    if (planId === 'option-c') {
      return calculateOptionCAnnual(studentCount) / 12;
    }
    return 0;
  };

  useEffect(() => {
    if (activeTab === 'Admin Reports' && isAdminUser) {
      fetchAdminData();
    }
  }, [activeTab, isAdminUser]);
  const [showUpgradeAlert, setShowUpgradeAlert] = useState(false);
  const [isRedirectingStripe, setIsRedirectingStripe] = useState(false);
  const [calcSeats, setCalcSeats] = useState(15);

  const getTrialDaysLeft = () => {
    if (isAdminUser) return 9999;
    const activePlan = (teacherBilling && ['active', 'trialing'].includes(teacherBilling.status));
    if (activePlan) return 999; 
    const rawCreated = teacherBilling?.createdAt || teacherData?.createdAt || user?.createdAt;
    if (!rawCreated) return 7; 
    const createdDate = new Date(rawCreated);
    const today = new Date();
    const diffTime = today - createdDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return 7 - diffDays;
  };

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = onSnapshot(doc(db, 'teachers', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTeacherData(data);
        if (!data.createdAt) {
          setDoc(doc(db, 'teachers', user.uid), { createdAt: new Date().toISOString() }, { merge: true })
            .catch(err => console.error("Error setting createdAt:", err));
        }
        if (data.billing) {
          setTeacherBilling(data.billing);
          if (!data.billing.createdAt) {
            setDoc(doc(db, 'teachers', user.uid), {
              billing: { createdAt: data.createdAt || new Date().toISOString() }
            }, { merge: true }).catch(err => console.error("Error updating billing createdAt:", err));
          }
        } else {
          const defaultBilling = {
            planId: 'free',
            status: 'none',
            quantity: 0,
            createdAt: new Date().toISOString()
          };
          setTeacherBilling(defaultBilling);
          setDoc(doc(db, 'teachers', user.uid), { billing: defaultBilling }, { merge: true })
            .catch(err => console.error("Error setting default billing:", err));
        }
      }
    }, (err) => console.error("Error listening to teacher billing:", err));
    return () => unsub();
  }, [user]);

  // ── Tuition Fees State ──────────────────────────────────────────────
  const DEFAULT_PACKAGES = [
    { id: 'weekly',  label: 'Weekly Tuition',  description: 'Cover one week of personalised tuition sessions.',       icon: '📅', amount: 50  },
    { id: 'monthly', label: 'Monthly Tuition', description: 'Full month of homework help & learning support.',          icon: '🌟', amount: 180 },
    { id: 'term',    label: 'Term Package',    description: 'Best value — a full school term of guided study.',        icon: '🏆', amount: 500 },
    { id: 'resources', label: 'Resources Fee', description: 'Worksheets, materials & learning resource pack.',         icon: '📚', amount: 100 },
  ];
  const [tuitionPackages, setTuitionPackages] = useState(DEFAULT_PACKAGES);
  const [allGradeFees, setAllGradeFees] = useState({});
  const [tuitionCurrency, setTuitionCurrency] = useState('USD');
  const CURRENCIES = { USD: '$', EUR: '€', GBP: '£', AUD: 'A$', CAD: 'C$', NZD: 'NZ$', INR: '₹', ZAR: 'R', SGD: 'S$' };
  
  // selectedTuitionGrade is dynamically derived from the active classroom selected at the top header
  const selectedTuitionGrade = resolveGradeFromClassroomName(activeClassroom?.name);

  const getPackagesForStudent = (student) => {
    const grade = resolveGradeFromClassroomName(student.className);
    if (allGradeFees && allGradeFees[grade]) {
      return allGradeFees[grade];
    }
    return DEFAULT_PACKAGES.map(pkg => ({ ...pkg, amount: 0 }));
  };

  useEffect(() => {
    if (allGradeFees[selectedTuitionGrade]) {
      setTuitionPackages(allGradeFees[selectedTuitionGrade]);
    } else {
      setTuitionPackages(DEFAULT_PACKAGES.map(pkg => ({ ...pkg, amount: 0 })));
    }
  }, [selectedTuitionGrade, allGradeFees]);

  const [isSavingFees, setIsSavingFees] = useState(false);
  const [feesSaved, setFeesSaved] = useState(false);
  const [payments, setPayments] = useState([]);
  const [revenueYear, setRevenueYear] = useState(new Date().getFullYear());
  const [revenueMonth, setRevenueMonth] = useState(new Date().getMonth() + 1);
  const [revenueMode, setRevenueMode] = useState('Monthly'); // 'Monthly' | 'YTD'
  const [customAmountInputs, setCustomAmountInputs] = useState({});
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [dashboardTimeFilter, setDashboardTimeFilter] = useState('Weekly');
  const [timeFilteredSubmissions, setTimeFilteredSubmissions] = useState([]);
  const [showLaggingModal, setShowLaggingModal] = useState(false);
  const [remindedStudents, setRemindedStudents] = useState({});
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
  const [customSubjectInput, setCustomSubjectInput] = useState('');
  
  const [showEditClassModal, setShowEditClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [editClassName, setEditClassName] = useState('');
  const [selectedEditSubjects, setSelectedEditSubjects] = useState([]);
  const [customEditSubjectInput, setCustomEditSubjectInput] = useState('');

  const [allStudents, setAllStudents] = useState([]);
  const todayBirthdayStudents = useMemo(() => {
     const targetStudents = activeClassroom ? students : allStudents;
     return targetStudents.filter(s => {
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
  }, [students, allStudents, activeClassroom]);
  const [rosterPage, setRosterPage] = useState(1);
  const [gradebookDueDate, setGradebookDueDate] = useState('');
  const [gradebookSearch, setGradebookSearch] = useState('');
  const [filterClass, setFilterClass] = useState('All Classes');
  const [revenueClassFilter, setRevenueClassFilter] = useState('All Classes');
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [searchQuery, setSearchQuery] = useState('');
  const [rewardsTab, setRewardsTab] = useState('Overview');
  const [showAwardBadgeModal, setShowAwardBadgeModal] = useState(false);
  const [selectedStudentForBadge, setSelectedStudentForBadge] = useState(null);
  const [badgeName, setBadgeName] = useState('');
  const [badgeDesc, setBadgeDesc] = useState('');
  const [badgeIcon, setBadgeIcon] = useState('🏆');
  const [badgeColor, setBadgeColor] = useState('bg-amber-50 text-amber-600 border-amber-100');
  const [isAwardingBadge, setIsAwardingBadge] = useState(false);
  const [messagesTab, setMessagesTab] = useState('Inbox');
  const [activeChat, setActiveChat] = useState(null);
  const [teacherMessages, setTeacherMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [showNewMsgModal, setShowNewMsgModal] = useState(false);
  const [newMsgRecipientType, setNewMsgRecipientType] = useState('student');
  const [newMsgRecipientId, setNewMsgRecipientId] = useState('');
  const [newMsgSubject, setNewMsgSubject] = useState('');
  const [newMsgBody, setNewMsgBody] = useState('');
  const [selectedReportTab, setSelectedReportTab] = useState('mastery');
  const [selectedReportSubtopic, setSelectedReportSubtopic] = useState(null);
  const [selectedReportStudent, setSelectedReportStudent] = useState('');
  const [remediationModalStudent, setRemediationModalStudent] = useState(null);
  const [remediationMessageContent, setRemediationMessageContent] = useState('');
  const [isSendingRemediationMsg, setIsSendingRemediationMsg] = useState(false);
  const [conceptSearchQuery, setConceptSearchQuery] = useState('');
  const [conceptTierFilter, setConceptTierFilter] = useState('all');
  const [conceptPage, setConceptPage] = useState(1);

  // Student Profile Modal States
  const [selectedProfileStudent, setSelectedProfileStudent] = useState(null);
  const [studentProfileTab, setStudentProfileTab] = useState('mastery'); // 'mastery', 'trajectory', 'submissions'
  const [selectedProfileSubmission, setSelectedProfileSubmission] = useState(null);
  const [isProfileSubmissionFetching, setIsProfileSubmissionFetching] = useState(false);
  const [profileSubmissionHomework, setProfileSubmissionHomework] = useState(null);
  const [aiReportContent, setAiReportContent] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showReportOverlay, setShowReportOverlay] = useState(false);
  const [isPublishingReport, setIsPublishingReport] = useState(false);

  useEffect(() => {
    const fetchProfileHomeworkDetails = async () => {
      if (!selectedProfileSubmission) return;
      setIsProfileSubmissionFetching(true);
      try {
        const hwDoc = await getDoc(doc(db, 'homeworks', selectedProfileSubmission.homeworkId));
        if (hwDoc.exists()) setProfileSubmissionHomework(hwDoc.data());
        else setProfileSubmissionHomework(null);
      } catch (err) {
        console.error(err);
      } finally {
        setIsProfileSubmissionFetching(false);
      }
    };
    fetchProfileHomeworkDetails();
  }, [selectedProfileSubmission]);

  const handleGenerateAiParentReport = async (studentName, startingScore, currentScore, growth, speedBadge, masteryArray, totalQuizzes) => {
    setIsGeneratingReport(true);
    setShowReportOverlay(true);
    setAiReportContent('');

    try {
      const activeModel = localStorage.getItem('hwz_active_ai') || 'gemini';

      const className = selectedProfileStudent?.className || 'Classroom Student';
      const masteriesList = masteryArray.map(m => `- ${m.name}: ${m.correctCount}/${m.totalCount} correct (${m.accuracy}%) - Tier: ${m.tier}`).join('\n');

      const prompt = `You are an expert, encouraging elementary and middle school teacher.
      Analyze this student's progress and generate a parent-friendly report:
      Student Name: ${studentName}
      Class: ${className}
      Total Homework Quizzes Completed: ${totalQuizzes}
      Starting Accuracy: ${startingScore}%
      Current Accuracy: ${currentScore}%
      Growth Index: ${growth >= 0 ? `+${growth}%` : `${growth}%`}
      Pacing Speed: ${speedBadge}
      
      Concept Masteries:
      ${masteriesList}
      
      Write a beautifully formatted, structured report with:
      1. 🌟 General Performance Overview (encouraging, warm, and highlight their attitude/effort).
      2. 💪 Areas of Strength (list specific concepts they have mastered or are doing well in).
      3. 🎯 Key Areas for Growth & Practice (list specific concepts needing review with fun, actionable strategies parents can practice at home).
      4. 💡 Personalized Teacher's Recommendation.
      
      Keep the tone highly professional, encouraging, warm, and helpful. Use simple parent-friendly language. 
      Output the report directly as clean text or markdown (no JSON wrapper, no HTML headers, just formatted markdown text). Do not write introductory meta commentary like "Here is the report...".`;

      const textResponse = await generateContent({
        prompt,
        provider: activeModel
      });

      setAiReportContent(textResponse);
    } catch (err) {
      console.error("AI Report Gen Error:", err);
      setAiReportContent("Failed to generate report. Please verify cloud settings and try again! ❌");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handlePublishAiReportToParent = async () => {
    if (!selectedProfileStudent || !aiReportContent) return;
    setIsPublishingReport(true);
    try {
      const studentId = selectedProfileStudent.id || selectedProfileStudent.name.trim().toLowerCase();
      const classId = selectedProfileStudent.classId || activeClassroom?.id;
      
      if (!classId) {
         alert("Oops! Could not resolve classroom ID for this student. ❌");
         setIsPublishingReport(false);
         return;
      }

      const studentRef = doc(db, 'teachers', user.uid, 'classrooms', classId, 'students', studentId);
      const studentSnap = await getDoc(studentRef);
      
      let parentReports = [];
      if (studentSnap.exists()) {
        parentReports = studentSnap.data().parentReports || [];
      }

      const newReport = {
        date: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
        timestamp: Date.now(),
        content: aiReportContent,
        teacherName: user.displayName || 'Classroom Teacher'
      };

      // Prepend so the newest report is first
      parentReports = [newReport, ...parentReports];

      await setDoc(studentRef, { parentReports }, { merge: true });
      alert(`Report successfully published to the Parent Portal for ${selectedProfileStudent.name}! 📤✨`);
      setShowReportOverlay(false);
    } catch (err) {
      console.error("Publish Report Error:", err);
      alert("Failed to publish report to Parent Portal. ❌");
    } finally {
      setIsPublishingReport(false);
    }
  };

  useEffect(() => {
    setSelectedReportSubtopic(null);
    setSelectedReportStudent('');
    setConceptSearchQuery('');
    setConceptTierFilter('all');
    setConceptPage(1);
  }, [activeClassroom, activeTab, selectedReportTab]);

  useEffect(() => {
     if (activeClassroom) {
        setRevenueClassFilter(activeClassroom.name);
     } else {
        setRevenueClassFilter('All Classes');
     }
  }, [activeClassroom]);

  const [subjectPrompts, setSubjectPrompts] = useState({
    maths: 'Make 5 questions about adding fractions with unlike denominators. This is for grade 4 students.',
    english: 'Make 5 questions about identifying nouns vs verbs in a sentence. This is for grade 4 students.',
    science: 'Make 5 questions about the solar system and planets. This is for grade 4 students.'
  });
  const [newSubjectName, setNewSubjectName] = useState('');
  const [isSavingPrompts, setIsSavingPrompts] = useState(false);
  const getStudentAvatar = (name) => {
     const cleanName = name?.trim().toLowerCase();
     const st = allStudents.find(s => s.id?.trim().toLowerCase() === cleanName || s.name?.trim().toLowerCase() === cleanName);
     if (st?.avatarUrl) {
        return st.avatarUrl;
     }
     return `https://api.dicebear.com/7.x/lorelei/svg?seed=${name || 'student'}`;
  };

  const handleSavePrompts = async () => {
    if (!user?.uid) return;
    setIsSavingPrompts(true);
    try {
      await setDoc(doc(db, 'teachers', user.uid), {
        subjectPrompts: subjectPrompts
      }, { merge: true });
      alert("Generic Subject Prompts saved successfully! 🚀🪄");
    } catch (err) {
      console.error("Save Prompts Error:", err);
      alert("Failed to save prompts. ❌");
    }
    setIsSavingPrompts(false);
  };

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) {
      alert("Please enter a subject name! 🎒");
      return;
    }
    const cleanName = newSubjectName.trim().toLowerCase();
    if (subjectPrompts[cleanName] !== undefined) {
      alert("This subject already exists! ⚠️");
      return;
    }
    setSubjectPrompts(prev => ({
      ...prev,
      [cleanName]: `Make 5 questions about ${cleanName}. This is for grade 4 students.`
    }));
    setNewSubjectName('');
  };

  const handleDeleteSubject = async (subKey) => {
    if (await window.confirmCustom(`Are you sure you want to delete the generic prompt for "${subKey}"?`)) {
      setSubjectPrompts(prev => {
        const copy = { ...prev };
        delete copy[subKey];
        return copy;
      });
    }
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
  const [newGoalTrack, setNewGoalTrack] = useState('auto');
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
          if (data.subjectPrompts) {
            setSubjectPrompts(data.subjectPrompts);
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

    const activePlanId = (teacherBilling && ['active', 'trialing'].includes(teacherBilling.status)) ? teacherBilling.planId : 'free';
    const trialDays = getTrialDaysLeft();
    if (activePlanId === 'free') {
      if (trialDays < 0) {
        setShowUpgradeAlert(true);
        return;
      }
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

  const handleEditClassroom = async () => {
    if (!editClassName.trim() || !editingClass?.id || !user?.uid) {
      alert("Missing class name or teacher session! ⚠️");
      return;
    }

    try {
      const classRef = doc(db, 'teachers', user.uid, 'classrooms', editingClass.id);
      
      await updateDoc(classRef, {
        name: editClassName.trim(),
        subjects: selectedEditSubjects
      });
      
      console.log("Class updated successfully:", editingClass.id);
      setEditingClass(null);
      setEditClassName('');
      setSelectedEditSubjects([]);
      setShowEditClassModal(false);
      await fetchClassrooms();
      alert("Class updated successfully! ✨");
    } catch (err) {
      console.error("Edit Classroom Error:", err);
      alert(`Oops! Failed to update class: ${err.message} ❌`);
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
      const querySnapshot = await getDocs(collection(db, 'teachers', user.uid, 'classrooms', activeClassroom.id, 'students'));
      const studentList = querySnapshot.docs.map(doc => ({
        id: doc.id.trim(),
        ...doc.data(),
        email: `${doc.id.trim()}@example.com`
      })).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      setStudents(studentList);
    } catch (err) {
      console.error("Fetch Students Error:", err);
    }
  };

  const handleAddStudent = async () => {
    const studentName = newStudentName || newStudent;
    if (!studentName.trim() || !user?.uid || !activeClassroom) return;

    // Check billing limit before adding
    const activePlanId = (teacherBilling && ['active', 'trialing'].includes(teacherBilling.status)) ? teacherBilling.planId : 'free';
    const limit = getPlanSeatLimit(activePlanId);
    if (allStudents.length >= limit) {
      setShowUpgradeAlert(true);
      return;
    }

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

      // Trigger seat sync on Stripe for Option A or C
      if (activePlanId === 'option-a' || activePlanId === 'option-c') {
        fetch('/api/sync-seats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teacherId: user.uid })
        }).catch(err => console.warn('Background seat sync failed:', err));
      }
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
        const snapshot = await getDocs(studentsRef);
        const classStudents = snapshot.docs.map(doc => ({
          id: doc.id.trim(),
          ...doc.data(),
          className: cls.name,
          classId: cls.id,
          email: `${doc.id.trim()}@example.com`
        }));
        aggregated = [...aggregated, ...classStudents];
      }
      setAllStudents(aggregated);
    } catch (err) {
      console.error("Fetch All Students Error:", err);
    }
  };

  useEffect(() => {
    if (!user?.uid || classrooms.length === 0) {
      setAllStudents([]);
      return;
    }

    const unsubscribes = [];
    const classStudentsMap = {};

    classrooms.forEach(cls => {
      const studentsRef = collection(db, 'teachers', user.uid, 'classrooms', cls.id, 'students');
      
      const unsubscribe = onSnapshot(studentsRef, (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id.trim(),
          ...doc.data(),
          className: cls.name,
          classId: cls.id,
          email: `${doc.id.trim()}@example.com`
        }));
        classStudentsMap[cls.id] = list;

        // Flatten all student lists and update allStudents state
        const aggregated = Object.values(classStudentsMap).flat();
        setAllStudents(aggregated);
      }, (err) => {
        console.error(`Error listening to students in class ${cls.id}:`, err);
      });

      unsubscribes.push(unsubscribe);
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [user?.uid, classrooms]);

  useEffect(() => {
    if (activeClassroom) {
      const filtered = allStudents
        .filter(s => s.classId === activeClassroom.id)
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      setStudents(filtered);
    } else {
      setStudents([]);
    }
  }, [allStudents, activeClassroom]);

  useEffect(() => {
    if (user && classrooms.length > 0) {
       fetchAllStudents();
    }
  }, [user, classrooms, activeTab]);

  // ── Load tuition fees from Firestore ──────────────────────────────────
  useEffect(() => {
    if (!user?.uid) return;
    const load = async () => {
      try {
        const ref = doc(db, 'teachers', user.uid, 'settings', 'tuitionFees');
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setAllGradeFees(data);
          if (data.currency) setTuitionCurrency(data.currency);
        }
      } catch (e) { console.error('Load fees error', e); }
    };
    load();
  }, [user]);

  // ── Listen to payments collection ──────────────────────────────────────
  useEffect(() => {
    if (!user?.uid) return;
    const paymentsRef = collection(db, 'teachers', user.uid, 'payments');
    const unsubscribe = onSnapshot(paymentsRef, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPayments(list);
    }, (err) => {
      console.error("Error listening to payments:", err);
    });
    return () => unsubscribe();
  }, [user?.uid]);

  const handleSaveTuitionFees = async () => {
    if (!user?.uid) return;
    setIsSavingFees(true);
    try {
      const ref = doc(db, 'teachers', user.uid, 'settings', 'tuitionFees');
      await setDoc(ref, { 
        [selectedTuitionGrade]: tuitionPackages, 
        currency: tuitionCurrency,
        updatedAt: new Date().toISOString() 
      }, { merge: true });
      
      setAllGradeFees(prev => ({
        ...prev,
        [selectedTuitionGrade]: tuitionPackages
      }));

      setFeesSaved(true);
      setTimeout(() => setFeesSaved(false), 3000);
    } catch (e) {
      alert('Failed to save fees. Please try again.');
      console.error(e);
    }
    setIsSavingFees(false);
  };

  const updatePackage = (id, field, value) => {
    setTuitionPackages(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  // ── Toggle student active / paused status ──────────────────────────────────
  const handleToggleStudentStatus = async (student) => {
    if (!user?.uid || !student.classId) return;
    const newStatus = student.status === 'paused' ? 'active' : 'paused';
    const studentRef = doc(
      db,
      'teachers', user.uid,
      'classrooms', student.classId,
      'students', student.id
    );
    try {
      await setDoc(studentRef, { status: newStatus }, { merge: true });
      // Update local state immediately for instant UI feedback
      setAllStudents(prev =>
        prev.map(s =>
          s.id === student.id && s.classId === student.classId
            ? { ...s, status: newStatus }
            : s
        )
      );
    } catch (err) {
      console.error('Toggle student status error:', err);
      alert('Failed to update student status. Please try again.');
    }
  };

  const handleUpdateStudentPreferredPackage = async (student, packageId) => {
    if (!user?.uid || !student.classId) return;
    const studentRef = doc(db, 'teachers', user.uid, 'classrooms', student.classId, 'students', student.id);
    try {
      await setDoc(studentRef, { preferredPackage: packageId }, { merge: true });
    } catch (err) {
      console.error("Error updating preferred package:", err);
    }
  };

  const handleMarkAsPaid = async (student, packageId) => {
    if (!user?.uid) return;
    
    let amount = 0;
    let label = 'Custom Payment';
    
    if (packageId === 'custom') {
      const customVal = customAmountInputs[student.id];
      amount = parseFloat(customVal) || 0;
      label = 'Custom Payment';
    } else {
      const pkg = getPackagesForStudent(student).find(p => p.id === packageId);
      amount = pkg ? pkg.amount : 180;
      label = pkg ? pkg.label : 'Monthly Tuition';
    }
    
    const now = new Date();
    let paidDate = now;
    if (revenueMode === 'Monthly') {
      paidDate = new Date(revenueYear, revenueMonth - 1, 15);
      if (revenueYear === now.getFullYear() && revenueMonth === (now.getMonth() + 1)) {
        paidDate = now;
      }
    } else {
      paidDate = new Date(revenueYear, 5, 15);
      if (revenueYear === now.getFullYear()) {
        paidDate = now;
      }
    }
    
    const paymentRecord = {
      studentName: student.name,
      classroomId: student.classId || '',
      classroomName: student.className || '',
      amount: amount,
      packageLabel: label,
      paidAt: paidDate.toISOString(),
      month: revenueMonth,
      year: revenueYear,
      teacherUid: user.uid,
      isManual: true
    };
    
    try {
      await addDoc(collection(db, 'teachers', user.uid, 'payments'), paymentRecord);
    } catch (err) {
      console.error("Mark as paid error:", err);
      alert("Could not record payment. Please try again.");
    }
  };

  const handleMarkAsUnpaid = async (student, studentPayments) => {
    if (!user?.uid || studentPayments.length === 0) return;
    
    try {
      for (const p of studentPayments) {
        const paymentRef = doc(db, 'teachers', user.uid, 'payments', p.id);
        await deleteDoc(paymentRef);
      }
    } catch (err) {
      console.error("Mark as unpaid error:", err);
      alert("Could not remove payment. Please try again.");
    }
  };

  const handleDeleteStudent = async (e, studentId, studentName, classId) => {
    e.stopPropagation();
    const targetClassId = classId || activeClassroom?.id;
    if (!user?.uid || !targetClassId || !(await window.confirmCustom(`Remove ${studentName} from the class? 🍎`))) return;
    
    try {
      // 1. Delete student profile doc in classroom
      const studentRef = doc(db, 'teachers', user.uid, 'classrooms', targetClassId, 'students', studentId);
      await deleteDoc(studentRef);

      // 2. Delete check-in/tracking document
      const checkInRef = doc(db, 'teachers', user.uid, 'students', studentId);
      await deleteDoc(checkInRef).catch(err => console.warn("Check-in doc delete failed:", err));

      // 3. Delete student homework submissions
      const submissionsRef = collection(db, 'submissions');
      const subQuery = query(submissionsRef, where('teacherId', '==', user.uid), where('classId', '==', targetClassId));
      const subSnap = await getDocs(subQuery);
      for (const subDoc of subSnap.docs) {
        const subData = subDoc.data();
        if (normalizeName(subData.studentName) === normalizeName(studentName)) {
          await deleteDoc(doc(db, 'submissions', subDoc.id)).catch(err => console.warn("Submission delete failed:", err));
        }
      }

      // 4. Delete direct messages between student and teacher
      const messagesRef = collection(db, 'messages');
      const msgQuery = query(messagesRef, where('teacherId', '==', user.uid));
      const msgSnap = await getDocs(msgQuery);
      for (const msgDoc of msgSnap.docs) {
        const msgData = msgDoc.data();
        const isSender = msgData.senderRole === 'student' && normalizeName(msgData.senderId) === normalizeName(studentName);
        const isRecipient = msgData.recipientType === 'student' && normalizeName(msgData.recipientId) === normalizeName(studentName);
        if (isSender || isRecipient) {
          await deleteDoc(doc(db, 'messages', msgDoc.id)).catch(err => console.warn("Message delete failed:", err));
        }
      }

      // 5. Delete payment records
      const paymentsRef = collection(db, 'teachers', user.uid, 'payments');
      const payQuery = query(paymentsRef, where('classroomId', '==', targetClassId));
      const paySnap = await getDocs(payQuery);
      for (const payDoc of paySnap.docs) {
        const payData = payDoc.data();
        if (normalizeName(payData.studentName) === normalizeName(studentName)) {
          await deleteDoc(doc(db, 'teachers', user.uid, 'payments', payDoc.id)).catch(err => console.warn("Payment record delete failed:", err));
        }
      }
      
      // Refresh both states to ensure consistency
      fetchAllStudents();
      fetchStudents(); 
      fetchClassrooms(); // Update counts on main dashboard
      
      alert(`${studentName} has been removed. ✨`);

      // Trigger seat sync on Stripe for Option A or C
      const activePlanId = (teacherBilling && ['active', 'trialing'].includes(teacherBilling.status)) ? teacherBilling.planId : 'free';
      if (activePlanId === 'option-a' || activePlanId === 'option-c') {
        fetch('/api/sync-seats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teacherId: user.uid })
        }).catch(err => console.warn('Background seat sync failed:', err));
      }
    } catch (err) {
      console.error("Delete Student Error:", err);
      alert("Oops! Failed to remove student. ❌");
    }
  };

  const handleAwardBadge = async () => {
    if (!selectedStudentForBadge || !badgeName.trim() || !user?.uid) return;
    setIsAwardingBadge(true);
    try {
      const targetClassId = selectedStudentForBadge.classId || activeClassroom?.id;
      const studentId = selectedStudentForBadge.id;
      const currentBadges = selectedStudentForBadge.customBadges || [];
      const newBadge = {
        name: badgeName,
        desc: badgeDesc,
        icon: badgeIcon,
        color: badgeColor,
        awardedAt: new Date().toISOString()
      };
      const studentRef = doc(db, 'teachers', user.uid, 'classrooms', targetClassId, 'students', studentId);
      await setDoc(studentRef, {
        customBadges: [...currentBadges, newBadge]
      }, { merge: true });

      alert(`Badge "${badgeName}" awarded successfully to ${selectedStudentForBadge.name}! 🎖️✨`);
      setShowAwardBadgeModal(false);
      setBadgeName('');
      setBadgeDesc('');
      fetchStudents();
      fetchAllStudents();
    } catch (err) {
      console.error("Award Badge Error:", err);
      alert(`Oops, awarding badge failed: ${err.message}`);
    }
    setIsAwardingBadge(false);
  };

  const handleSaveGoal = async () => {
    if (!activeClassroom) return;
    try {
      await setDoc(doc(db, 'teachers', user.uid, 'classrooms', activeClassroom.id), {
        goalTitle: newGoalTitle,
        goalTarget: Number(newGoalTarget),
        activeTrack: newGoalTrack
      }, { merge: true });
      
      // Update activeClassroom locally so the UI updates instantly!
      setActiveClassroom(prev => ({
        ...prev,
        goalTitle: newGoalTitle,
        goalTarget: Number(newGoalTarget),
        activeTrack: newGoalTrack
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
    if (!(await window.confirmCustom("Are you sure you want to reset the combined points progress for this classroom goal? 🔄\n\nThis will reset the thermometer and pizza back to 0, but will NOT delete any student grades, homework submissions, or history!"))) return;
    
    try {
      // Re-calculate raw points right now so we have the absolute current total
      const classStudents = allStudents.filter(s => s.classId === activeClassroom.id);
      const computedStudents = classStudents.map(student => {
         const studentSubs = allSubmissions.filter(sub => 
            normalizeName(sub.studentName) === normalizeName(student.name)
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

  const handleSendRemediationMsg = async () => {
    if (!remediationModalStudent) return;
    if (!remediationMessageContent.trim()) {
      alert("Please write a message first! 📝");
      return;
    }
    setIsSendingRemediationMsg(true);
    try {
      await addDoc(collection(db, 'messages'), {
        teacherId: user.uid,
        senderId: user.uid,
        senderName: user.displayName || 'Teacher',
        senderRole: 'teacher',
        recipientType: 'student',
        recipientId: remediationModalStudent.name,
        recipientName: remediationModalStudent.name,
        subject: `💡 Practice Tip: ${remediationModalStudent.gapSubtopic}`,
        content: remediationMessageContent.trim(),
        createdAt: new Date().toISOString()
      });
      alert(`Remediation message sent live to ${remediationModalStudent.name}! 🚀`);
      setRemediationModalStudent(null);
      setRemediationMessageContent('');
    } catch (err) {
      console.error(err);
      alert("Failed to send message: " + err.message);
    } finally {
      setIsSendingRemediationMsg(false);
    }
  };

  const handleRemediationTrigger = (student, gapSubtopic) => {
    setSelectedDraft({
      subject: 'maths',
      title: `Remediation Quiz: ${gapSubtopic}`,
      instructions: `Hi ${student.name}! Here is a quick practice quiz to review our concepts on "${gapSubtopic}". Take your time! 🌟`,
      aiPrompt: `Generate 5 clear multiple-choice questions focusing on the subtopic "${gapSubtopic}" for remedial review. Keep explanations simple and encouraging.`,
      assignedClassId: activeClassroom?.id || '',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '15',
      points: '10'
    });
    setActiveTab('Homework');
  };

  const getPlanSeatLimit = (planId) => {
    if (isAdminUser) return Infinity;
    if (planId === 'free') {
      const trialDays = getTrialDaysLeft();
      if (trialDays >= 0) return Infinity; // Unlimited during active trial!
      return 0; // 0 students allowed (blocked) when free trial is expired and they are unpaid
    }
    switch (planId) {
      case 'option-b-starter': return 15;
      case 'option-b-growth': return 50;
      case 'option-b-school': return 150;
      case 'option-a':
      case 'option-c':
        return Infinity;
      default: return 5;
    }
  };

  const getPlanName = (planId) => {
    if (isAdminUser) return 'Admin (Unlimited Plan)';
    switch (planId) {
      case 'free': return 'Free Trial Tier';
      case 'option-a': return 'Option A (Monthly Per-Student)';
      case 'option-b-starter': return 'Option B (Starter Tier)';
      case 'option-b-growth': return 'Option B (Growth Tier)';
      case 'option-b-school': return 'Option B (School Tier)';
      case 'option-c': return 'Option C (Yearly Graduated)';
      default: return 'Free Trial Tier';
    }
  };

  const calculateOptionCAnnual = (seats) => {
    let cost = 0;
    if (seats <= 50) {
      cost = seats * 12;
    } else if (seats <= 200) {
      cost = (50 * 12) + ((seats - 50) * 8);
    } else if (seats <= 1000) {
      cost = (50 * 12) + (150 * 8) + ((seats - 200) * 5);
    } else {
      cost = (50 * 12) + (150 * 8) + (800 * 5) + ((seats - 1000) * 3);
    }
    return cost;
  };

  const handleStripeSession = async (planId, action = 'checkout') => {
    try {
      setIsRedirectingStripe(true);
      const res = await fetch('/api/billing-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: user.uid,
          email: user.email,
          planId: planId || '',
          studentCount: allStudents.length,
          successUrl: window.location.href.split('?')[0],
          cancelUrl: window.location.href.split('?')[0],
          action,
          customerId: teacherBilling?.stripeCustomerId || null
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to start billing session');
      }
    } catch (err) {
      console.error(err);
      alert('Stripe redirect failed');
    } finally {
      setIsRedirectingStripe(false);
    }
  };

  const renderBillingTab = () => {
    const activePlanId = (teacherBilling && ['active', 'trialing'].includes(teacherBilling.status)) ? teacherBilling.planId : 'free';
    const limit = getPlanSeatLimit(activePlanId);
    
    // Calculator variables
    const optionAAnnual = calcSeats * 1.5 * 12;
    let optionBPlanName = '';
    let optionBAnnual = Infinity;
    if (calcSeats <= 15) {
      optionBPlanName = 'Option B (Starter)';
      optionBAnnual = 15 * 12;
    } else if (calcSeats <= 50) {
      optionBPlanName = 'Option B (Growth)';
      optionBAnnual = 45 * 12;
    } else if (calcSeats <= 150) {
      optionBPlanName = 'Option B (School)';
      optionBAnnual = 99 * 12;
    }
    const optionCAnnual = calculateOptionCAnnual(calcSeats);

    let cheapestName = 'Option A (Monthly)';
    let cheapestAmount = optionAAnnual;
    if (optionBAnnual < cheapestAmount) {
      cheapestName = optionBPlanName;
      cheapestAmount = optionBAnnual;
    }
    if (optionCAnnual < cheapestAmount) {
      cheapestName = 'Option C (Yearly)';
      cheapestAmount = optionCAnnual;
    }
    const savings = Math.max(0, optionAAnnual - cheapestAmount);

    return (
      <div className="px-10 py-10 space-y-8 min-h-[calc(100vh-64px)] pb-40">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black text-[#14532d] tracking-tight flex items-center gap-3">
            <CreditCard className="w-9 h-9 text-blue-500" />
            Billing & Licenses
          </h1>
          <p className="text-sm font-bold text-[#166534] italic mt-1">
            Choose a plan that fits your classroom size. Parents and students pay nothing.
          </p>
        </div>

        {/* Current status card */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-7 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Current Subscription</span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">{getPlanName(activePlanId)}</h2>
              <div className="flex items-center gap-2 mt-2">
                {isAdminUser ? (
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-100 text-emerald-700 border border-emerald-300 animate-pulse">
                    Status: Administrator
                  </span>
                ) : teacherBilling && ['active', 'trialing'].includes(teacherBilling.status) ? (
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-200">
                    Status: {teacherBilling.status}
                  </span>
                ) : getTrialDaysLeft() >= 0 ? (
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-blue-50 text-blue-600 border border-blue-200 animate-pulse">
                    Status: Free Trial Active
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-rose-50 text-rose-600 border border-rose-200">
                    Status: Trial Expired
                  </span>
                )}
                <span className="text-xs font-bold text-slate-500">
                  {isAdminUser ? (
                    "Lifetime executive privilege active"
                  ) : teacherBilling?.currentPeriodEnd ? (
                    `Renews: ${new Date(teacherBilling.currentPeriodEnd).toLocaleDateString()}`
                  ) : getTrialDaysLeft() >= 0 ? (
                    `7-Day Trial: ${getTrialDaysLeft()} days left`
                  ) : (
                    "Upgrade to add students and classrooms"
                  )}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 min-w-[200px]">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Classroom Capacity</span>
              <div className="text-3xl font-black text-slate-800 mt-1">
                {allStudents.length} <span className="text-sm font-bold text-slate-400">/ {limit === Infinity ? '∞' : limit} students</span>
              </div>
              <div className="progress mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${allStudents.length >= limit ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min(100, (allStudents.length / (limit === Infinity ? 100 : limit)) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {teacherBilling?.stripeCustomerId && (
            <div className="pt-4 border-t border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <p className="text-xs text-slate-400 font-bold">
                Manage payment details, update invoice billing emails, or cancel subscription inside Stripe's customer portal.
              </p>
              <button
                onClick={() => handleStripeSession(null, 'portal')}
                disabled={isRedirectingStripe}
                className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs shadow-sm transition-all"
              >
                {isRedirectingStripe ? 'Opening Portal...' : 'Manage Billing & Invoices 💳'}
              </button>
            </div>
          )}
        </div>

        {isAdminUser ? (
          <div className="bg-[#FFFBEB] rounded-[32px] border-4 border-amber-300 p-8 space-y-6 text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-2 animate-pulse">
              👑
            </div>
            <h3 className="text-2xl font-black text-amber-900">Executive Account Clearance</h3>
            <p className="text-sm font-bold text-amber-700 max-w-2xl mx-auto leading-relaxed">
              This account is marked as an administrator. You have lifetime access with unlimited student slots, unlimited classrooms, and full feature capabilities without billing enforcement.
            </p>
          </div>
        ) : (
          <>
            {/* Pricing columns */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Plan A */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-7 space-y-6 hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
            {activePlanId === 'option-a' && (
              <div className="absolute top-4 right-4 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-blue-200">
                Active
              </div>
            )}
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-2xl font-bold">A</div>
              <div>
                <h3 className="text-lg font-black text-slate-800">Option A: Pay-As-You-Grow</h3>
                <p className="text-xs text-slate-400 font-bold">Monthly Elastic Capacity</p>
              </div>
              <div className="text-3xl font-black text-slate-800">
                $1.50 <span className="text-xs font-bold text-slate-400">/ student / month</span>
              </div>
              <ul className="text-xs text-slate-500 font-bold space-y-2.5">
                <li className="flex items-center gap-2">✔️ Pay only for active students</li>
                <li className="flex items-center gap-2">✔️ Scales automatically as you add/remove</li>
                <li className="flex items-center gap-2">✔️ No long term annual commitment</li>
                <li className="flex items-center gap-2">✔️ Perfect for tutor/mid-semester setups</li>
              </ul>
            </div>
            <button
              onClick={() => handleStripeSession('option-a')}
              disabled={activePlanId === 'option-a' || isRedirectingStripe}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                activePlanId === 'option-a'
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100 hover:scale-[1.02]'
              }`}
            >
              {activePlanId === 'option-a' ? 'Current Plan' : 'Choose Option A'}
            </button>
          </div>

          {/* Plan B */}
          <div className="bg-white rounded-[32px] border border-slate-150 p-7 space-y-6 hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
            {activePlanId.startsWith('option-b') && (
              <div className="absolute top-4 right-4 bg-[#EA580C]/10 text-[#EA580C] px-3 py-1 rounded-full text-[10px] font-black uppercase border border-[#EA580C]/20">
                Active
              </div>
            )}
            <div className="space-y-4">
              <div className="w-12 h-12 bg-orange-50 text-[#EA580C] rounded-2xl flex items-center justify-center text-2xl font-bold">B</div>
              <div>
                <h3 className="text-lg font-black text-slate-800">Option B: Monthly Flat Tiers</h3>
                <p className="text-xs text-slate-400 font-bold">Fixed Capacity Tiers</p>
              </div>
              <div className="space-y-3 pt-2">
                {[
                  { id: 'option-b-starter', name: 'Starter (Up to 15 students)', price: 15 },
                  { id: 'option-b-growth', name: 'Growth (Up to 50 students)', price: 45 },
                  { id: 'option-b-school', name: 'School (Up to 150 students)', price: 99 },
                ].map((tier) => (
                  <div key={tier.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <div>
                      <p className="text-xs font-bold text-slate-700">{tier.name}</p>
                      <p className="text-[10px] font-medium text-slate-400">${(tier.price / (tier.id === 'option-b-starter' ? 15 : tier.id === 'option-b-growth' ? 50 : 150)).toFixed(2)} / student equivalent</p>
                    </div>
                    <button
                      onClick={() => handleStripeSession(tier.id)}
                      disabled={activePlanId === tier.id || isRedirectingStripe}
                      className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                        activePlanId === tier.id
                          ? 'bg-slate-100 text-slate-400'
                          : 'bg-orange-600 hover:bg-orange-700 text-white shadow-sm'
                      }`}
                    >
                      {activePlanId === tier.id ? 'Current' : `$${tier.price}/mo`}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 text-center italic mt-2">
              Save up to 50% compared to per-student monthly packages.
            </p>
          </div>

          {/* Plan C */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-7 space-y-6 hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
            {activePlanId === 'option-c' && (
              <div className="absolute top-4 right-4 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-emerald-200">
                Active
              </div>
            )}
            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center text-2xl font-bold">C</div>
              <div>
                <h3 className="text-lg font-black text-slate-800">Option C: Graduated Annual</h3>
                <p className="text-xs text-slate-400 font-bold">Yearly Quantity-Based Volume Tiers</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Graduated Tiers (Annual)</span>
                <div className="flex justify-between text-[11px] font-bold text-slate-600">
                  <span>1–50 students</span>
                  <span>$12 / student</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-slate-600">
                  <span>51–200 students</span>
                  <span>$8 / student</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-slate-600">
                  <span>201–1000 students</span>
                  <span>$5 / student</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-slate-600">
                  <span>1001+ students</span>
                  <span>$3 / student</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleStripeSession('option-c')}
              disabled={activePlanId === 'option-c' || isRedirectingStripe}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                activePlanId === 'option-c'
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100 hover:scale-[1.02]'
              }`}
            >
              {activePlanId === 'option-c' ? 'Current Plan' : 'Choose Option C'}
            </button>
          </div>

        </div>

        {/* Pricing Calculator */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-7 space-y-6">
          <div className="border-b border-slate-50 pb-4">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              🧮 Interactive Plan Calculator
            </h3>
            <p className="text-xs text-slate-400 font-bold mt-1">
              Slide to select your expected student intake. We will calculate the total cost across all options and recommend the cheapest plan!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            
            {/* Input Slider */}
            <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-600">Expected Student Intake</span>
                <span className="text-2xl font-black text-[#EA580C] bg-white border border-slate-100 rounded-xl px-4 py-1.5 shadow-sm">
                  {calcSeats} students
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="300"
                value={calcSeats}
                onChange={(e) => setCalcSeats(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#EA580C]"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>1 Student</span>
                <span>150</span>
                <span>300 Students</span>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>Option A (Monthly Elastic):</span>
                  <span>${optionAAnnual.toLocaleString()} / year</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>Option B (Flat Tiered):</span>
                  <span>{optionBAnnual === Infinity ? 'Not Available' : `$${optionBAnnual.toLocaleString()} / year`}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>Option C (Graduated Yearly):</span>
                  <span>${optionCAnnual.toLocaleString()} / year</span>
                </div>
              </div>

              {/* Recommendation Alert */}
              <div className="bg-orange-50/70 border border-orange-200/50 rounded-2xl p-5 flex items-start gap-4">
                <div className="text-2xl mt-0.5">🏆</div>
                <div>
                  <h4 className="text-sm font-black text-orange-900">Cheapest Choice: {cheapestName}</h4>
                  <p className="text-xs text-orange-700 font-medium mt-1">
                    With {calcSeats} students, {cheapestName} costs only <span className="font-bold">${cheapestAmount.toLocaleString()} / year</span>.
                    {savings > 0 && ` That saves you $${savings.toLocaleString()} / year compared to Option A!`}
                  </p>
                </div>
            </div>
          </div>
        </div>
      </div>
          </>
        )}
      </div>
    );
  };
 
  const renderAdminReportsTab = () => {
    const totalTeachers = adminTeachers.length;
    const paidCount = adminTeachers.filter(t => t.isPaid).length;
    const activeTrialCount = adminTeachers.filter(t => !t.isPaid && t.trialDaysLeft >= 0).length;
    const expiredTrialCount = adminTeachers.filter(t => !t.isPaid && t.trialDaysLeft < 0).length;

    const planCounts = {
      'free': totalTeachers - paidCount,
      'option-a': adminTeachers.filter(t => t.activePlanId === 'option-a').length,
      'option-b-starter': adminTeachers.filter(t => t.activePlanId === 'option-b-starter').length,
      'option-b-growth': adminTeachers.filter(t => t.activePlanId === 'option-b-growth').length,
      'option-b-school': adminTeachers.filter(t => t.activePlanId === 'option-b-school').length,
      'option-c': adminTeachers.filter(t => t.activePlanId === 'option-c').length,
    };

    const totalMRR = adminTeachers.reduce((sum, t) => sum + t.mrr, 0);
    const conversionRate = totalTeachers > 0 ? ((paidCount / totalTeachers) * 100).toFixed(1) : 0;

    const filtered = adminTeachers.filter(t => {
      const matchesSearch = 
        t.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
        t.email.toLowerCase().includes(adminSearch.toLowerCase()) ||
        t.teacherCode.toLowerCase().includes(adminSearch.toLowerCase());

      const matchesPlan = 
        adminPlanFilter === 'all' ||
        (adminPlanFilter === 'free' && t.activePlanId === 'free') ||
        (adminPlanFilter === 'option-a' && t.activePlanId === 'option-a') ||
        (adminPlanFilter === 'option-b' && t.activePlanId.startsWith('option-b')) ||
        (adminPlanFilter === 'option-c' && t.activePlanId === 'option-c');

      const matchesStatus =
        adminStatusFilter === 'all' ||
        (adminStatusFilter === 'converted' && t.isPaid) ||
        (adminStatusFilter === 'active-trial' && !t.isPaid && t.trialDaysLeft >= 0) ||
        (adminStatusFilter === 'expired-trial' && !t.isPaid && t.trialDaysLeft < 0);

      return matchesSearch && matchesPlan && matchesStatus;
    });

    const sorted = [...filtered].sort((a, b) => {
      let valA = a[adminSortField];
      let valB = b[adminSortField];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return adminSortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return adminSortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const handleAdminSort = (field) => {
      if (adminSortField === field) {
        setAdminSortOrder(adminSortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        setAdminSortField(field);
        setAdminSortOrder('desc');
      }
    };

    return (
      <div className="px-10 py-10 space-y-8 min-h-[calc(100vh-64px)] pb-40">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-orange-100 pb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-[#EA580C] bg-[#FFEDD5] border border-orange-100 px-3.5 py-1.5 rounded-full tracking-widest inline-block">
              Executive Playground Admin Room
            </span>
            <h1 className="text-4xl font-black tracking-tight text-[#166534] flex items-center gap-2">
              🦉 System Analytics Dashboard
            </h1>
          </div>
          <button 
            onClick={fetchAdminData} 
            className="px-6 py-3 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-650 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-sm hover:scale-[1.02]"
          >
            Sync Records 🔄
          </button>
        </div>

        {adminLoading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border-4 border-orange-100 rounded-[32px] p-6 space-y-4 shadow-lg relative overflow-hidden group">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-orange-50 rounded-full blur-xl group-hover:scale-150 transition-transform" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Total Teachers</span>
                  <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-[#14532d]">{totalTeachers}</h3>
                  <p className="text-[10px] font-bold text-slate-400">Registered dashboard accounts</p>
                </div>
              </div>

              <div className="bg-white border-4 border-emerald-100 rounded-[32px] p-6 space-y-4 shadow-lg relative overflow-hidden group">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-50 rounded-full blur-xl group-hover:scale-150 transition-transform" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Est. Monthly Income</span>
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-emerald-600">${totalMRR.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                  <p className="text-[10px] font-bold text-slate-400">Est. MRR (ARR: ${(totalMRR * 12).toLocaleString()}/yr)</p>
                </div>
              </div>

              <div className="bg-white border-4 border-blue-100 rounded-[32px] p-6 space-y-4 shadow-lg relative overflow-hidden group">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-50 rounded-full blur-xl group-hover:scale-150 transition-transform" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Trial Conversion</span>
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-blue-655">{conversionRate}%</h3>
                  <p className="text-[10px] font-bold text-slate-400">{paidCount} paid / {totalTeachers} total users</p>
                </div>
              </div>

              <div className="bg-white border-4 border-purple-100 rounded-[32px] p-6 space-y-4 shadow-lg relative overflow-hidden group">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-50 rounded-full blur-xl group-hover:scale-150 transition-transform" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Trials Status</span>
                  <div className="w-10 h-10 bg-purple-50 text-purple-650 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">Paid Plans:</span>
                    <span className="text-[#14532d]">{paidCount}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">Active Trials:</span>
                    <span className="text-amber-600">{activeTrialCount}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400">Expired (Unconv):</span>
                    <span className="text-rose-600">{expiredTrialCount}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white border-2 border-slate-100 shadow-sm rounded-[24px] p-4 text-center space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase">Free / Trial</p>
                <p className="text-xl font-black text-slate-850">{planCounts['free']}</p>
              </div>
              <div className="bg-white border-2 border-blue-100 shadow-sm rounded-[24px] p-4 text-center space-y-1">
                <p className="text-[10px] font-black text-blue-500 uppercase">Option A</p>
                <p className="text-xl font-black text-blue-600">{planCounts['option-a']}</p>
              </div>
              <div className="bg-white border-2 border-orange-100 shadow-sm rounded-[24px] p-4 text-center space-y-1">
                <p className="text-[10px] font-black text-orange-500 uppercase">Option B Starter</p>
                <p className="text-xl font-black text-orange-600">{planCounts['option-b-starter']}</p>
              </div>
              <div className="bg-white border-2 border-orange-100 shadow-sm rounded-[24px] p-4 text-center space-y-1">
                <p className="text-[10px] font-black text-orange-500 uppercase">Option B Growth</p>
                <p className="text-xl font-black text-orange-600">{planCounts['option-b-growth']}</p>
              </div>
              <div className="bg-white border-2 border-orange-100 shadow-sm rounded-[24px] p-4 text-center space-y-1">
                <p className="text-[10px] font-black text-orange-500 uppercase">Option B School</p>
                <p className="text-xl font-black text-orange-600">{planCounts['option-b-school']}</p>
              </div>
              <div className="bg-white border-2 border-emerald-100 shadow-sm rounded-[24px] p-4 text-center space-y-1">
                <p className="text-[10px] font-black text-emerald-500 uppercase">Option C</p>
                <p className="text-xl font-black text-emerald-600">{planCounts['option-c']}</p>
              </div>
            </div>

            <div className="bg-white border-4 border-purple-100 rounded-[32px] p-6 lg:p-8 space-y-6 shadow-xl">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <h3 className="text-lg font-black text-slate-800">Registered Users & Plans</h3>
                
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  <div className="relative flex-1 lg:flex-none">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="Search email, code, name..."
                      value={adminSearch}
                      onChange={(e) => setAdminSearch(e.target.value)}
                      className="w-full lg:w-64 bg-slate-50 border-2 border-slate-100 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <select 
                    value={adminPlanFilter}
                    onChange={(e) => setAdminPlanFilter(e.target.value)}
                    className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-3 py-2.5 text-xs text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Plan Models</option>
                    <option value="free">Free / Trial</option>
                    <option value="option-a">Option A (Per-Student)</option>
                    <option value="option-b">Option B (Flat Tiers)</option>
                    <option value="option-c">Option C (Yearly)</option>
                  </select>

                  <select 
                    value={adminStatusFilter}
                    onChange={(e) => setAdminStatusFilter(e.target.value)}
                    className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-3 py-2.5 text-xs text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Conversion Statuses</option>
                    <option value="converted">Converted (Paid)</option>
                    <option value="active-trial">Active Free Trials</option>
                    <option value="expired-trial">Expired Free Trials</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto rounded-[24px] border border-slate-150 shadow-inner bg-slate-50/50">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-purple-50/80 text-slate-700 font-black border-b-2 border-slate-200/60 uppercase tracking-wider text-[9px]">
                      <th className="p-4 cursor-pointer hover:text-purple-700 select-none" onClick={() => handleAdminSort('name')}>Teacher</th>
                      <th className="p-4 cursor-pointer hover:text-purple-700 select-none" onClick={() => handleAdminSort('teacherCode')}>Code</th>
                      <th className="p-4 cursor-pointer hover:text-purple-700 select-none" onClick={() => handleAdminSort('createdAt')}>Registered</th>
                      <th className="p-4 cursor-pointer hover:text-purple-700 select-none text-center" onClick={() => handleAdminSort('studentCount')}>Students</th>
                      <th className="p-4 cursor-pointer hover:text-purple-700 select-none" onClick={() => handleAdminSort('activePlanId')}>Plan Model</th>
                      <th className="p-4 cursor-pointer hover:text-purple-700 select-none text-right" onClick={() => handleAdminSort('mrr')}>Est. MRR</th>
                      <th className="p-4 cursor-pointer hover:text-purple-700 select-none text-center" onClick={() => handleAdminSort('conversionStatus')}>Conversion Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-slate-400 font-bold">
                          No teachers match the filters.
                        </td>
                      </tr>
                    ) : (
                      sorted.map((teacher) => (
                        <tr key={teacher.id} className="hover:bg-purple-50/20 bg-white border-b border-slate-100 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-slate-800 text-sm">{teacher.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{teacher.email}</p>
                          </td>
                          <td className="p-4 font-mono font-bold text-purple-600">{teacher.teacherCode}</td>
                          <td className="p-4 text-slate-500 font-medium">
                            {new Date(teacher.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </td>
                          <td className="p-4 text-center font-bold text-slate-800">
                            {teacher.studentCount} <span className="text-[10px] text-slate-400 font-medium">({teacher.classCount} classes)</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                              teacher.activePlanId === 'free' 
                                ? 'bg-slate-50 text-slate-600 border-slate-200' 
                                : teacher.activePlanId === 'option-a'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : teacher.activePlanId === 'option-c'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-orange-50 text-orange-700 border-orange-200'
                            }`}>
                              {teacher.activePlanId === 'free' 
                                ? 'Free / Trial' 
                                : teacher.activePlanId === 'option-a'
                                ? 'Option A (Per-Student)'
                                : teacher.activePlanId === 'option-c'
                                ? 'Option C (Yearly)'
                                : `Option B (${teacher.activePlanId.split('-')[2].toUpperCase()})`
                              }
                            </span>
                          </td>
                          <td className="p-4 text-right font-black text-emerald-600 text-sm">
                            ${teacher.mrr.toFixed(2)}
                          </td>
                          <td className="p-4 text-center">
                            <span className={`px-2.5 py-1.5 rounded-full text-[10px] font-black uppercase border inline-flex items-center gap-1.5 ${
                              teacher.isPaid 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-250' 
                                : teacher.trialDaysLeft >= 0
                                ? 'bg-amber-50 text-amber-700 border-amber-250'
                                : 'bg-rose-50 text-rose-700 border-rose-250'
                            }`}>
                              {teacher.isPaid ? (
                                <>
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Paid Subscriber
                                </>
                              ) : teacher.trialDaysLeft >= 0 ? (
                                <>
                                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Active Trial ({teacher.trialDaysLeft}d)
                                </>
                              ) : (
                                <>
                                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Trial Expired
                                </>
                              )}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
      switch (activeTab) {
          case 'Dashboard': {
             const monthNames = [
               "January", "February", "March", "April", "May", "June", 
               "July", "August", "September", "October", "November", "December"
             ];
             const totalDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();
             const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay();
             const emptySpaces = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

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
                   normalizeName(sub.studentName) === normalizeName(student.name)
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

             const now = new Date();
             const thisMonthNum = now.getMonth() + 1; // 1-12
             const thisYearNum = now.getFullYear();

             // Filter payments list by active classroom (if selected) or globally
             const dashboardFilteredPayments = payments.filter(p => {
                if (!activeClassroom) return true;
                return p.classroomId === activeClassroom.id || 
                       p.classroomName === activeClassroom.name || 
                       (p.studentName && classStudents.some(s => s.name.trim().toLowerCase() === p.studentName.trim().toLowerCase()));
             });

             // Month Collected Revenue
             const monthlyCollectedDashboard = dashboardFilteredPayments.filter(p => {
                const d = new Date(p.paidAt);
                const y = p.year || d.getFullYear();
                const m = p.month || (d.getMonth() + 1);
                return y === thisYearNum && m === thisMonthNum;
             }).reduce((sum, p) => sum + (p.amount || 0), 0);

             // YTD Collected Revenue
             const ytdCollectedDashboard = dashboardFilteredPayments.filter(p => {
                const d = new Date(p.paidAt);
                const y = p.year || d.getFullYear();
                return y === thisYearNum;
             }).reduce((sum, p) => sum + (p.amount || 0), 0);

             // Expected revenue for 1 month based on current active student packages
             const expectedRevenueMonthlyDashboard = classStudents.filter(s => s.status !== 'paused').reduce((sum, student) => {
                const pkgId = student.preferredPackage || 'monthly';
                const pkg = getPackagesForStudent(student).find(p => p.id === pkgId);
                return sum + (pkg ? pkg.amount : 180);
             }, 0);

             const yearlyProjectedDashboard = expectedRevenueMonthlyDashboard * 12;

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
                const subs = classSubmissions.filter(sub => normalizeName(sub.studentName) === normalizeName(student.name));
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

             const dashboardMissingReports = [];
             classStudents.forEach(student => {
                const studentSubs = classSubmissions.filter(s => normalizeName(s.studentName) === normalizeName(student.name));
                const submittedHwIds = new Set(studentSubs.map(s => s.homeworkId));
                
                const missingHws = classHomeworks.filter(hw => !submittedHwIds.has(hw.id));
                if (missingHws.length > 0) {
                   dashboardMissingReports.push({
                      student,
                      missingHws
                   });
                }
             });
             
             const totalDashboardStudents = classStudents.length;
             const laggingCount = dashboardMissingReports.length;
             const onTrackCount = totalDashboardStudents - laggingCount;
             const onTrackPercent = totalDashboardStudents > 0 ? Math.round((onTrackCount / totalDashboardStudents) * 100) : 0;

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
                          <p className="text-sm font-bold text-[#166534]">Real-time learning diagnostic metrics across your classrooms.</p>
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

                   {/* Tuition Revenue Summary Section */}
                   <div className="space-y-3">
                      <div className="flex items-center justify-between">
                         <h3 className="text-sm font-black text-[#3C2E75] tracking-tight flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                            Tuition Revenue Summary
                         </h3>
                         <span className="text-[10px] font-black text-[#8C83B5] uppercase tracking-wider">
                            {activeClassroom ? `${activeClassroom.name} Revenue` : "All Classes Revenue"}
                         </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-6">
                         {/* Month Collected */}
                         <div className="bg-[#EAFBF7] border border-[#BCEEE2]/50 rounded-[32px] p-6 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                            <div className="space-y-2">
                               <p className="text-[10px] font-black text-[#1E8A74] uppercase tracking-widest">Month Collected</p>
                               <h3 className="text-3xl font-black text-[#1E8A74] tracking-tight">
                                  ${monthlyCollectedDashboard.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                               </h3>
                               <p className="text-[10px] font-black text-[#1E8A74]/60 italic">Collected in {monthNames[thisMonthNum - 1]} {thisYearNum}</p>
                            </div>
                            <div className="w-12 h-12 bg-[#FAF9FF] border border-white/50 rounded-2xl flex items-center justify-center shadow-inner">
                               <DollarSign className="w-6 h-6 text-[#1E8A74]" />
                            </div>
                         </div>

                         {/* Year Projected */}
                         <div className="bg-[#FAF2FF] border border-[#E8C6FF]/50 rounded-[32px] p-6 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                            <div className="space-y-2">
                               <p className="text-[10px] font-black text-[#7828B4] uppercase tracking-widest">Yearly Projected</p>
                               <h3 className="text-3xl font-black text-[#7828B4] tracking-tight">
                                  ${yearlyProjectedDashboard.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                               </h3>
                               <p className="text-[10px] font-black text-[#7828B4]/60 italic">Projected annual base revenue</p>
                            </div>
                            <div className="w-12 h-12 bg-[#FAF9FF] border border-white/50 rounded-2xl flex items-center justify-center shadow-inner">
                               <TrendingUp className="w-6 h-6 text-[#7828B4]" />
                            </div>
                         </div>

                         {/* YTD Collected */}
                         <div className="bg-[#FFFCE8] border border-[#FCEE9D]/50 rounded-[32px] p-6 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                            <div className="space-y-2">
                               <p className="text-[10px] font-black text-[#8C761E] uppercase tracking-widest">Year to Date (YTD)</p>
                               <h3 className="text-3xl font-black text-[#8C761E] tracking-tight">
                                  ${ytdCollectedDashboard.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                               </h3>
                               <p className="text-[10px] font-black text-[#8C761E]/60 italic">Actual collected this year</p>
                            </div>
                            <div className="w-12 h-12 bg-[#FAF9FF] border border-white/50 rounded-2xl flex items-center justify-center shadow-inner">
                               <Calendar className="w-6 h-6 text-[#8C761E]" />
                            </div>
                         </div>
                      </div>
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
                                        <div className="flex-1 h-px bg-[#EA580C] opacity-[0.08]" />
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
                                        <div className="w-12 bg-gradient-to-t from-[#EA580C] to-[#CE93D8] rounded-t-xl shadow-lg shadow-green-50 transition-all duration-1000 ease-out absolute bottom-0" style={{ height: `${Math.max(2, chartAverages[i] || 0)}%` }} />
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
                                        setNewGoalTrack(activeClassroom?.activeTrack || 'auto');
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
                                                 setSelectedDraft(draft);
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

                         {/* Homework Diagnosis */}
                         <div className="bg-gradient-to-br from-[#FAF2FF] to-[#F1E0FF] rounded-[32px] border border-[#E8C6FF] shadow-sm p-6 space-y-4">
                            <div className="flex items-center gap-3">
                               <span className="text-3xl">📊</span>
                               <div className="space-y-0.5">
                                  <h3 className="text-xl font-black text-[#3C2E75] tracking-tight">Homework Diagnosis</h3>
                                  <p className="text-[9px] font-black text-green-500 uppercase tracking-widest">Real-time conceptual learning gaps</p>
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
                                        <div key={gap.subject} className="bg-white/95 backdrop-blur-sm border border-[#FFEDD5] p-4 rounded-2xl space-y-3 shadow-[0_2px_8px_-3px_rgba(122,105,214,0.1)]">
                                           <div className="flex justify-between items-center">
                                              <div className="flex items-center gap-2">
                                                 <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${badgeBg} ${textColor}`}>{gap.subject}</span>
                                                 <span className="text-[10px] font-black text-[#3C2E75] truncate max-w-[140px]" title={gap.topic}>"{gap.topic}"</span>
                                              </div>
                                              <span className={`text-xs font-black ${textColor}`}>{gap.average}% Mastery</span>
                                           </div>
                                           <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                              <div className={`h-full ${progressColor}`} style={{ width: `${gap.average}%` }} />
                                           </div>
                                           <div className="bg-[#FAF2FF] rounded-xl p-3 border border-[#E8C6FF]/30">
                                              <span className="text-[8px] font-black uppercase text-green-500 tracking-wider block mb-0.5">💡 Teacher Prep Hint</span>
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


                      </div>
                   </div>

                    {/* Homework Completion & Learning Calendar Row */}
                    {activeClassroom && (
                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                          <div className="space-y-6">
                             {/* ── Homework Completion Hub ── */}
                             {(() => {
                             const completionData = classStudents.map(student => {
                             const submitted = classSubmissions.filter(s => normalizeName(s.studentName) === normalizeName(student.name));
                             const submittedIds = new Set(submitted.map(s => s.homeworkId));
                             const missing = classHomeworks.filter(hw => !submittedIds.has(hw.id));
                             const completedCount = classHomeworks.length - missing.length;
                             const completionPct = classHomeworks.length > 0 ? Math.round((completedCount / classHomeworks.length) * 100) : 100;
                             const avgScore = submitted.length > 0 ? Math.round(submitted.reduce((a, s) => a + (s.score || 0), 0) / submitted.length) : null;
                             return { student, submitted, missing, completedCount, completionPct, avgScore };
                             });
                             const onTrackStudents = completionData.filter(d => d.missing.length === 0);
                             const laggingStudents = completionData.filter(d => d.missing.length > 0).sort((a, b) => b.missing.length - a.missing.length);
                             const totalStudents = completionData.length;
                             const onTrackNum = onTrackStudents.length;
                             const laggingNum = laggingStudents.length;
                             const onTrackPct = totalStudents > 0 ? Math.round((onTrackNum / totalStudents) * 100) : 0;
                             const RADIUS = 52;
                             const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
                             const onTrackDash = (onTrackPct / 100) * CIRCUMFERENCE;
                             const laggingDash = CIRCUMFERENCE - onTrackDash;
                             return (
                             <div className="bg-white rounded-[32px] border border-[#E9E4FF] shadow-sm p-6 space-y-5 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.04] pointer-events-none" style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }} />
                             <div className="flex justify-between items-start relative z-10">
                             <div>
                             <h3 className="text-lg font-black text-[#3C2E75] tracking-tight flex items-center gap-2">
                             📋 Homework Completion Hub
                             </h3>
                             <p className="text-[10px] font-black text-[#8C83B5] uppercase tracking-widest mt-0.5">
                             Real-time student completion vs lagging breakdown
                             </p>
                             </div>
                             <div className="flex gap-2">
                             <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-100 shadow-sm">
                             <span className="text-sm font-black">{onTrackNum}</span>
                             <span className="text-[9px] font-bold uppercase tracking-wider">On Track</span>
                             </div>
                             <div className="flex items-center gap-1.5 bg-rose-50 text-rose-600 px-3 py-1.5 rounded-xl border border-rose-100 shadow-sm">
                             <span className="text-sm font-black">{laggingNum}</span>
                             <span className="text-[9px] font-bold uppercase tracking-wider">Lagging</span>
                             </div>
                             </div>
                             </div>
                             <div className="flex items-center gap-8 relative z-10">
                             <div className="relative shrink-0 w-36 h-36">
                             <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
                             <circle cx="70" cy="70" r={RADIUS} fill="none" stroke="#F3F0FF" strokeWidth="16" />
                             <circle cx="70" cy="70" r={RADIUS} fill="none" stroke="#FDA4AF" strokeWidth="16"
                             strokeDasharray={`${laggingDash} ${CIRCUMFERENCE}`} strokeDashoffset="0" strokeLinecap="round" />
                             <circle cx="70" cy="70" r={RADIUS} fill="none" stroke="#34D399" strokeWidth="16"
                             strokeDasharray={`${onTrackDash} ${CIRCUMFERENCE}`} strokeDashoffset={`-${laggingDash}`} strokeLinecap="round" />
                             </svg>
                             <div className="absolute inset-0 flex flex-col items-center justify-center">
                             <span className="text-2xl font-black text-[#3C2E75] leading-none">{onTrackPct}%</span>
                             <span className="text-[9px] font-black text-[#8C83B5] uppercase tracking-widest mt-0.5">On Track</span>
                             </div>
                             </div>
                             <div className="flex-1 space-y-4">
                             <div className="space-y-2">
                             <div className="flex justify-between items-center">
                             <div className="flex items-center gap-2">
                             <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                             <span className="text-xs font-black text-[#3C2E75]">Completed All</span>
                             </div>
                             <span className="text-xs font-black text-emerald-600">{onTrackNum} student{onTrackNum !== 1 ? 's' : ''}</span>
                             </div>
                             <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                             <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${onTrackPct}%` }} />
                             </div>
                             </div>
                             <div className="space-y-2">
                             <div className="flex justify-between items-center">
                             <div className="flex items-center gap-2">
                             <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                             <span className="text-xs font-black text-[#3C2E75]">Missing Homework</span>
                             </div>
                             <span className="text-xs font-black text-rose-500">{laggingNum} student{laggingNum !== 1 ? 's' : ''}</span>
                             </div>
                             <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                             <div className="h-full bg-gradient-to-r from-rose-400 to-rose-500 rounded-full transition-all duration-1000" style={{ width: `${100 - onTrackPct}%` }} />
                             </div>
                             </div>
                             <div className="pt-1 flex gap-3">
                             <div className="flex-1 bg-[#F5F3FF] rounded-2xl p-3 border border-[#E9E4FF] text-center">
                             <p className="text-base font-black text-[#3C2E75]">{classHomeworks.length}</p>
                             <p className="text-[9px] font-black text-[#8C83B5] uppercase tracking-wider">Total HW</p>
                             </div>
                             <div className="flex-1 bg-[#EAFBF7] rounded-2xl p-3 border border-[#BCEEE2] text-center">
                             <p className="text-base font-black text-emerald-600">{classSubmissions.length}</p>
                             <p className="text-[9px] font-black text-emerald-400 uppercase tracking-wider">Submissions</p>
                             </div>
                             </div>
                             </div>
                             </div>
                             <div className="flex bg-[#F5F3FF] p-1 rounded-2xl border border-[#E9E4FF] relative z-10">
                             <button
                             onClick={() => setCompletionTab('lagging')}
                             className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${completionTab === 'lagging' ? 'bg-white text-rose-600 shadow-sm' : 'text-[#8C83B5] hover:text-[#3C2E75]'}`}
                             >
                             ⚠️ Lagging ({laggingNum})
                             </button>
                             <button
                             onClick={() => setCompletionTab('ontrack')}
                             className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${completionTab === 'ontrack' ? 'bg-white text-emerald-600 shadow-sm' : 'text-[#8C83B5] hover:text-[#3C2E75]'}`}
                             >
                             ✅ On Track ({onTrackNum})
                             </button>
                             </div>
                             <div className="space-y-2 max-h-[280px] overflow-y-auto relative z-10">
                             {completionTab === 'lagging' && (
                             <>
                             {laggingStudents.length > 0 ? laggingStudents.map((d, idx) => (
                             <div key={d.student.id || d.student.name} className="bg-[#FFF9FB] border border-rose-100 rounded-2xl p-3 space-y-2 hover:border-rose-200 transition-all group">
                             <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2.5">
                             <span className="text-[10px] font-black text-rose-300 w-4 shrink-0">{idx + 1}.</span>
                             <img src={getStudentAvatar(d.student.name)} className="w-8 h-8 rounded-full border-2 border-white shadow-sm group-hover:scale-105 transition-transform" alt={d.student.name} />
                             <div>
                             <p className="text-xs font-black text-[#3C2E75]">{d.student.name}</p>
                             <p className="text-[9px] font-bold text-[#8C83B5]">{d.completedCount}/{classHomeworks.length} completed{d.avgScore !== null ? ` • ${d.avgScore}% avg` : ''}</p>
                             </div>
                             </div>
                             <div className="flex items-center gap-2">
                             <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100">{d.missing.length} missing</span>
                             <button
                             onClick={async () => {
                             try {
                             const { addDoc, collection } = await import('firebase/firestore');
                             const { db: fdb } = await import('../firebase');
                             await addDoc(collection(fdb, 'messages'), {
                             teacherId: user.uid, senderId: user.uid,
                             senderName: user.displayName || 'Teacher', senderRole: 'teacher',
                             recipientType: 'student', recipientId: d.student.name, recipientName: d.student.name,
                             subject: '⏰ Homework Reminder!',
                             content: `Hi ${d.student.name}! You have ${d.missing.length} assignment${d.missing.length > 1 ? 's' : ''} still to complete. Please check your homework portal and submit soon! 🚀`,
                             createdAt: new Date().toISOString()
                             });
                             alert(`✅ Reminder sent to ${d.student.name}!`);
                             } catch (err) { console.error(err); alert('Failed to send reminder.'); }
                             }}
                             className="text-[9px] font-black bg-rose-500 hover:bg-rose-600 text-white px-2.5 py-1 rounded-xl transition-colors shrink-0"
                             >
                             Remind 🔔
                             </button>
                             </div>
                             </div>
                             <div className="flex items-center gap-3">
                             <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full rounded-full bg-gradient-to-r from-rose-400 to-amber-400 transition-all duration-700" style={{ width: `${Math.max(5, d.completionPct)}%` }} />
                             </div>
                             <span className="text-[10px] font-black text-rose-500 w-8 text-right">{d.completionPct}%</span>
                             </div>
                             <div className="flex flex-wrap gap-1 pl-10">
                             {d.missing.slice(0, 4).map(hw => (
                             <span key={hw.id} className="text-[8px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase tracking-wider truncate max-w-[100px]" title={hw.title}>{hw.title}</span>
                             ))}
                             {d.missing.length > 4 && <span className="text-[8px] font-bold text-rose-400 bg-rose-50 px-1.5 py-0.5 rounded">+{d.missing.length - 4} more</span>}
                             </div>
                             </div>
                             )) : (
                             <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100 flex flex-col items-center text-center space-y-3">
                             <span className="text-4xl">🎉</span>
                             <div>
                             <h4 className="text-emerald-700 font-black text-base">Everyone is caught up!</h4>
                             <p className="text-emerald-600/80 text-xs font-bold mt-1">All students have completed their assigned homework.</p>
                             </div>
                             </div>
                             )}
                             </>
                             )}
                             {completionTab === 'ontrack' && (
                             <>
                             {onTrackStudents.length > 0 ? onTrackStudents.map((d, idx) => (
                             <div key={d.student.id || d.student.name} className="bg-[#F0FDF6] border border-emerald-100 rounded-2xl p-3 flex items-center justify-between hover:border-emerald-200 transition-all group">
                             <div className="flex items-center gap-2.5">
                             <span className="text-[10px] font-black text-emerald-300 w-4 shrink-0">{idx + 1}.</span>
                             <img src={getStudentAvatar(d.student.name)} className="w-8 h-8 rounded-full border-2 border-white shadow-sm group-hover:scale-105 transition-transform" alt={d.student.name} />
                             <div>
                             <p className="text-xs font-black text-[#3C2E75]">{d.student.name}</p>
                             <p className="text-[9px] font-bold text-[#8C83B5]">All {classHomeworks.length} done{d.avgScore !== null ? ` • ${d.avgScore}% avg` : ''}</p>
                             </div>
                             </div>
                             <div className="flex items-center gap-2">
                             {d.avgScore !== null && (
                             <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-xl border ${d.avgScore >= 85 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : d.avgScore >= 65 ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-500 border-rose-100'}`}>
                             {d.avgScore}% avg
                             </span>
                             )}
                             <span className="text-lg">✅</span>
                             </div>
                             </div>
                             )) : (
                             <div className="bg-amber-50 rounded-2xl p-8 border border-amber-100 flex flex-col items-center text-center space-y-3">
                             <span className="text-4xl">📚</span>
                             <div>
                             <h4 className="text-amber-700 font-black text-base">No submissions yet</h4>
                             <p className="text-amber-600/80 text-xs font-bold mt-1">No student has completed all assignments yet.</p>
                             </div>
                             </div>
                             )}
                             </>
                             )}
                             </div>
                             </div>
                             );
                             })()}
                          </div>
                          <div className="space-y-6 flex flex-col h-full">
                             {/* Right: Learning Calendar & Reminder Center (col-span-7) */}
                             <div className="h-full bg-gradient-to-br from-[#FCF8FF] to-[#F3EFFF] border border-[#E5DFFF] rounded-[32px] p-6 space-y-4 shadow-sm flex flex-col justify-between">
                             <div className="flex justify-between items-center border-b border-[#FFEDD5] pb-3">
                             <div className="space-y-0.5">
                             <h3 className="text-base font-black text-[#3B2B85] tracking-tight flex items-center gap-1.5">
                             <span>📅</span> Learning Calendar & Reminder Center
                             </h3>
                             <p className="text-[10px] font-bold text-[#7A69D6]">Click active quiz dates to review submissions and send reminder pings.</p>
                             </div>
                             <div className="bg-[#FFF0FA] border border-[#FFDDF5] rounded-xl px-2.5 py-1 flex items-center gap-2 shrink-0">
                             <button
                             onClick={() => {
                             if (calendarMonth === 0) {
                             setCalendarMonth(11);
                             setCalendarYear(prev => prev - 1);
                             } else {
                             setCalendarMonth(prev => prev - 1);
                             }
                             }}
                             className="w-6 h-6 hover:bg-[#FFDDF5] rounded-lg flex items-center justify-center text-[#C23C9F] text-xs font-black transition-all"
                             >
                             ◀
                             </button>
                             <span className="text-[#C23C9F] text-[10px] font-black uppercase tracking-wider select-none min-w-[80px] text-center">
                             {monthNames[calendarMonth]} {calendarYear}
                             </span>
                             <button
                             onClick={() => {
                             if (calendarMonth === 11) {
                             setCalendarMonth(0);
                             setCalendarYear(prev => prev + 1);
                             } else {
                             setCalendarMonth(prev => prev + 1);
                             }
                             }}
                             className="w-6 h-6 hover:bg-[#FFDDF5] rounded-lg flex items-center justify-center text-[#C23C9F] text-xs font-black transition-all"
                             >
                             ▶
                             </button>
                             </div>
                             </div>
                             
                             {/* Calendar Grid */}
                             <div className="grid grid-cols-7 gap-2 flex-1 pt-2">
                             {/* Day headers */}
                             {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                             <div key={day} className={`text-center text-[9px] font-black uppercase tracking-wider py-1 rounded-lg ${idx >= 5 ? 'bg-[#FFF0FA] text-[#C23C9F]' : 'bg-[#EEECFF] text-[#553EC9]'}`}>{day}</div>
                             ))}
                             
                             {/* Empty spacer days */}
                             {Array.from({ length: emptySpaces }).map((_, idx) => (
                             <div key={`empty-${idx}`} className="aspect-square bg-[#FFF9F9]/40 border border-dashed border-[#FFE3E3] rounded-2xl" />
                             ))}
                             
                             {/* Calendar days */}
                             {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => {
                             const activeHw = classHomeworks.find(hw => {
                             if (!hw.dueDate) return false;
                             try {
                             const hwDate = new Date(hw.dueDate);
                             return hwDate.getFullYear() === calendarYear && hwDate.getMonth() === calendarMonth && hwDate.getDate() === day;
                             } catch (e) {
                             return false;
                             }
                             });
                             
                             // Find students whose birthday is on this calendar month and day
                             const bdays = (activeClassroom ? students : allStudents).filter(student => {
                             if (!student.birthdate) return false;
                             try {
                             const parts = student.birthdate.split('-');
                             if (parts.length === 3) {
                             const bMonth = parseInt(parts[1], 10) - 1;
                             const bDay = parseInt(parts[2], 10);
                             return bMonth === calendarMonth && bDay === day;
                             }
                             const bdayDate = new Date(student.birthdate);
                             return !isNaN(bdayDate.getTime()) && bdayDate.getMonth() === calendarMonth && bdayDate.getDate() === day;
                             } catch (e) {
                             return false;
                             }
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
                             dayCardStyle = "bg-gradient-to-br from-[#FAF2FF] to-[#F1E0FF] border-[#E8C6FF] text-[#7828B4] shadow-md shadow-green-50/50";
                             tagStyle = "bg-[#E8C6FF] text-[#7828B4]";
                             }
                             } else if (bdays.length > 0) {
                             // Soft pink birthday theme highlight
                             dayCardStyle = "bg-gradient-to-br from-[#FFF0F6] to-[#FFE3EC] border-[#FFB6C1] text-[#C2185B] shadow-md shadow-pink-50/50";
                             }
                             
                             return (
                             <div
                             key={day}
                             className={`aspect-square rounded-2xl p-2 flex flex-col justify-between transition-all duration-300 cursor-pointer relative overflow-hidden group hover:scale-[1.04] ${dayCardStyle}`}
                             onClick={() => {
                             if (activeHw) {
                             setSelectedCalendarHw(activeHw);
                             setShowCalendarModal(true);
                             } else if (bdays.length > 0) {
                             alert(`🎉 Birthday celebration today for: ${bdays.map(s => s.name).join(', ')}! 🎂`);
                             }
                             }}
                             >
                             <div className="flex items-center justify-between w-full">
                             <span className="text-xs font-black">{day}</span>
                             {bdays.length > 0 && (
                             <span
                             className="text-xs animate-bounce"
                             title={`Birthday: ${bdays.map(s => s.name).join(', ')}`}
                             >
                             🎂
                             </span>
                             )}
                             </div>
                             
                             {activeHw && (
                             <div className={`px-1.5 py-0.5 rounded-lg text-[8px] font-black truncate shadow-sm mt-1 flex items-center gap-1 ${tagStyle}`}>
                             <span className="w-1 h-1 rounded-full bg-current shrink-0" />
                             {activeHw.subject}
                             </div>
                             )}
                             
                             {!activeHw && bdays.length > 0 && (
                             <div className="bg-white/60 border border-pink-200/50 text-[#C2185B] px-1 py-0.5 rounded-lg text-[7px] font-black truncate text-center select-none mt-1">
                             🎉 {bdays.map(s => s.name).join(', ')}
                             </div>
                             )}
                             </div>
                             );
                             })}
                             </div>
                             </div>
                          </div>
                       </div>
                    )}

                    {/* Collaborative Goal Row */}
                    {activeClassroom && (
                       <div className="grid grid-cols-12 gap-6 mt-6">
                          {/* Left: Dino Pizza Party Collaborative Goal (col-span-5) */}
                          <div className="col-span-12 max-w-4xl mx-auto w-full bg-white rounded-[32px] border border-[#E9E4FF] shadow-sm p-6 flex flex-col justify-between space-y-4">
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
                          setNewGoalTrack(activeClassroom?.activeTrack || 'auto');
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
                        <h1 className="text-4xl font-black text-[#14532d] tracking-tight">My Classes</h1>
                        <p className="text-sm font-bold text-[#166534] italic">Manage your classes and view class details.</p>
                     </div>
                     <div className="flex items-center gap-6">
                        <button 
                          onClick={() => setShowAddClassModal(true)}
                          className="bg-gradient-to-r from-[#EA580C] to-[#EA580C] text-white px-8 py-4 rounded-3xl font-black text-sm shadow-xl shadow-orange-100 flex items-center gap-3 hover:scale-105 transition-all"
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
                           onEdit={() => {
                              setEditingClass(room);
                              setEditClassName(room.name);
                              setSelectedEditSubjects(room.subjects || []);
                              setShowEditClassModal(true);
                           }}
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

            const ROSTER_PAGE_SIZE = 10;
            const rosterPageCount = Math.max(1, Math.ceil(filteredStudents.length / ROSTER_PAGE_SIZE));
            const currentPage = Math.min(rosterPage, rosterPageCount);
            const displayedStudents = filteredStudents.slice((currentPage - 1) * ROSTER_PAGE_SIZE, currentPage * ROSTER_PAGE_SIZE);

            return (
               <div className="px-10 py-10 space-y-10 min-h-[calc(100vh-64px)] pb-40 relative">
                  <div className="flex items-center justify-between">
                      <div>
                         <h1 className="text-4xl font-black text-[#14532d] tracking-tight">Student Details</h1>
                         <p className="text-sm font-bold text-[#166534] italic">
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
                               className="bg-white border-2 border-[#EA580C]/20 rounded-[24px] py-4 px-8 text-sm font-bold text-blue-900 placeholder-blue-300 focus:border-[#EA580C] outline-none transition-all shadow-sm min-w-[300px]"
                            />
                            <button 
                               onClick={handleAddStudent}
                               disabled={isAdding || !newStudent.trim()}
                               className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#EA580C] text-white p-2 rounded-xl shadow-lg shadow-orange-100 hover:scale-105 transition-all disabled:opacity-30"
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
                  <div className="bg-white rounded-[40px] border border-orange-100 shadow-sm overflow-hidden">
                     <div className="grid grid-cols-12 px-8 py-6 bg-blue-50/20 text-[10px] font-black text-blue-200 uppercase tracking-widest border-b border-orange-100">
                        <div className="col-span-3">Student Name</div>
                        <div className="col-span-1">Class</div>
                        <div className="col-span-2">Email</div>
                        <div className="col-span-2">Contact</div>
                        <div className="col-span-1">Progress</div>
                        <div className="col-span-1">Status</div>
                        <div className="col-span-2 text-right pr-4">Actions</div>
                     </div>
                     <div className="divide-y divide-blue-50">
                        {displayedStudents.map((student, idx) => {
                           const isPaused = student.status === 'paused';
                           const classHomeworks = allHomeworks.filter(hw => hw.assignedClassId === activeClassroom?.id);
                           const studentSubs = allSubmissions.filter(sub => 
                              normalizeName(sub.studentName) === normalizeName(student.name) &&
                              classHomeworks.some(hw => hw.id === sub.homeworkId)
                           );
                           const progress = classHomeworks.length > 0 
                              ? Math.min(100, Math.round((studentSubs.length / classHomeworks.length) * 100)) 
                              : 0;
                           const color = isPaused ? 'bg-slate-300' : (progress > 85 ? 'bg-emerald-500' : progress > 75 ? 'bg-blue-500' : progress > 40 ? 'bg-amber-500' : 'bg-rose-500');
                           
                           return (
                              <div key={idx} className={`grid grid-cols-12 px-8 py-6 items-center transition-all group ${
                                 isPaused
                                   ? 'bg-rose-50/40 opacity-70 hover:opacity-90'
                                   : 'hover:bg-blue-50/10'
                              }`}>
                                 <div className="col-span-3 flex items-center gap-3">
                                    <button
                                       onClick={() => {
                                          setSelectedProfileStudent(student);
                                          setStudentProfileTab('mastery');
                                          setSelectedProfileSubmission(null);
                                       }}
                                       className="flex items-center gap-3 text-left focus:outline-none hover:opacity-85 transition-opacity"
                                    >
                                       <div className="relative">
                                          <img src={getStudentAvatar(student.name)} className={`w-10 h-10 rounded-full border-2 shadow-sm bg-white p-0.5 ${
                                             isPaused ? 'border-rose-200 grayscale' : 'border-white'
                                          }`} alt={student.name} />
                                          {isPaused && (
                                             <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center border border-white">
                                                <Lock className="w-2 h-2 text-white" />
                                             </div>
                                          )}
                                       </div>
                                       <div>
                                          <span className={`text-sm font-black hover:text-[#EA580C] transition-colors ${isPaused ? 'text-slate-400 line-through' : 'text-[#14532d]'}`}>{student.name}</span>
                                          {isPaused && (
                                             <span className="ml-2 text-[9px] font-black uppercase tracking-wider text-rose-500 bg-rose-100 rounded-full px-1.5 py-0.5">Paused</span>
                                          )}
                                       </div>
                                    </button>
                                 </div>
                                 <div className="col-span-1">
                                    <span className="text-xs font-bold text-blue-400">{student.className}</span>
                                 </div>
                                 <div className="col-span-2">
                                    <span className="text-xs font-bold text-blue-400 truncate block max-w-full" title={student.email}>{student.email}</span>
                                 </div>
                                 <div className="col-span-2">
                                    <span className="text-xs font-bold text-blue-400">{student.contact || 'No Contact'}</span>
                                 </div>
                                 <div className="col-span-1 flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-blue-50 rounded-full overflow-hidden">
                                       <div className={`h-full ${color} rounded-full`} style={{ width: `${progress}%` }} />
                                    </div>
                                    <span className="text-[10px] font-black text-blue-400">{progress}%</span>
                                 </div>
                                 <div className="col-span-1">
                                    {isPaused ? (
                                       <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-600 bg-rose-100 border border-rose-200 rounded-full px-2.5 py-1">
                                          <Lock className="w-2.5 h-2.5" /> Paused
                                       </span>
                                    ) : (
                                       <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
                                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                                       </span>
                                    )}
                                 </div>
                                 <div className="col-span-2 flex items-center justify-end gap-2 pr-4">
                                    {/* Pause / Resume Toggle */}
                                    <button
                                       onClick={() => handleToggleStudentStatus(student)}
                                       className={`p-2 rounded-xl transition-all ${
                                          isPaused
                                            ? 'text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50'
                                            : 'text-rose-300 hover:text-rose-600 hover:bg-rose-50'
                                       }`}
                                       title={isPaused ? 'Resume student access' : 'Pause student access'}
                                    >
                                       {isPaused
                                          ? <PlayCircle className="w-4 h-4" />
                                          : <PauseCircle className="w-4 h-4" />
                                       }
                                    </button>
                                    <button 
                                       onClick={() => {
                                          setSelectedProfileStudent(student);
                                          setStudentProfileTab('mastery');
                                          setSelectedProfileSubmission(null);
                                       }}
                                       className="p-2 text-blue-400 hover:text-[#EA580C] hover:bg-blue-50 rounded-xl transition-all"
                                       title="View Student Analytics"
                                    >
                                       <TrendingUp className="w-4 h-4" />
                                    </button>
                                    <button 
                                       onClick={() => {
                                          setSelectedStudentForBadge(student);
                                          setBadgeIcon('🏆');
                                          setBadgeColor('bg-amber-50 text-amber-600 border-amber-100');
                                          setBadgeName('');
                                          setBadgeDesc('');
                                          setShowAwardBadgeModal(true);
                                       }}
                                       className="p-2 text-orange-300 hover:text-[#EA580C] hover:bg-orange-50 rounded-xl transition-all"
                                       title="Award Custom Badge"
                                    >
                                       <Award className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={(e) => handleDeleteStudent(e, student.id, student.name, student.classId)}
                                      className="p-2 text-rose-200 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                      title="Remove Student"
                                    >
                                       <Trash2 className="w-4 h-4" />
                                    </button>
                                 </div>
                              </div>
                           );
                        })}
                        {filteredStudents.length === 0 && (
                           <div className="py-20 text-center text-[#166534] italic font-bold">
                              No students found. 🔍
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="flex items-center justify-between px-2">
                     <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest">
                        Showing {displayedStudents.length} of {filteredStudents.length} students {filteredStudents.length !== allStudents.length ? `(from ${allStudents.length} total)` : ''}
                     </p>
                     <div className="flex items-center gap-2">
                        <button 
                           onClick={() => setRosterPage(prev => Math.max(1, prev - 1))}
                           disabled={currentPage === 1}
                           className="w-10 h-10 flex-center text-[#166534] hover:text-blue-600 disabled:opacity-30"
                           title="Previous Page"
                        >
                           <ChevronRight className="w-5 h-5 rotate-180" />
                        </button>

                        {Array.from({ length: rosterPageCount }, (_, i) => i + 1).map(pageNum => (
                           <PaginationButton 
                              key={pageNum} 
                              label={String(pageNum)} 
                              active={pageNum === currentPage} 
                              onClick={() => setRosterPage(pageNum)}
                           />
                        ))}

                        <button 
                           onClick={() => setRosterPage(prev => Math.min(rosterPageCount, prev + 1))}
                           disabled={currentPage === rosterPageCount}
                           className="w-10 h-10 flex-center text-[#166534] hover:text-blue-600 disabled:opacity-30"
                           title="Next Page"
                        >
                           <ChevronRight className="w-5 h-5" />
                        </button>
                  </div>
               </div>
               </div>
            );
         }
          case 'Homework/Test Builder':
            return (
               <div className="px-10 py-10 space-y-10 min-h-[calc(100vh-64px)] pb-40 relative">
                  <HomeworkGenerator 
                     user={user} 
                     classrooms={classrooms} 
                     activeClassroom={activeClassroom} 
                     initialDraft={selectedDraft}
                     subjectPrompts={subjectPrompts}
                     onHomeworkCreated={() => {
                        setSelectedDraft(null);
                        fetchDashboardSubmissions();
                      }} 
                      teacherBilling={teacherBilling}
                      allHomeworks={allHomeworks}
                      setDashboardTab={setActiveTab}
                      isAdmin={isAdminUser}
                   />
                 </div>
             );

          case 'Scheduler':
             return (
                <div className="px-10 py-10 space-y-10 min-h-[calc(100vh-64px)] pb-40 relative">
                   <HomeworkScheduler 
                      user={user} 
                      classrooms={classrooms} 
                      activeClassroom={activeClassroom}
                      subjectPrompts={subjectPrompts}
                      onHomeworkScheduled={() => {
                         fetchDashboardSubmissions();
                      }}
                      teacherBilling={teacherBilling}
                      allHomeworks={allHomeworks}
                      setDashboardTab={setActiveTab}
                      isAdmin={isAdminUser}
                   />
                   <GrassBorder />
                </div>
             );
          case 'Gradebook': {
            const currentSubmissions = activeClassroom ? allSubmissions.filter(s => s.classId === activeClassroom.id) : allSubmissions;
            const currentStudents = activeClassroom ? students : allStudents;
            const currentHomeworks = activeClassroom ? allHomeworks.filter(h => h.assignedClassId === activeClassroom.id) : allHomeworks;
            
            // Filter submissions by homework due date if filter is active
            const filteredGradebookSubmissions = currentSubmissions.filter(sub => {
               if (gradebookSearch && !sub.studentName?.toLowerCase().includes(gradebookSearch.toLowerCase())) {
                 return false;
               }
               if (!gradebookDueDate) return true;
               const hw = allHomeworks.find(h => h.id === sub.homeworkId);
               if (!hw?.dueDate) return false;
               try {
                  const hwDate = new Date(hw.dueDate);
                  const filterDate = new Date(gradebookDueDate);
                  return hwDate.getFullYear() === filterDate.getFullYear() &&
                         hwDate.getMonth() === filterDate.getMonth() &&
                         hwDate.getDate() === filterDate.getDate();
               } catch (e) {
                  return false;
               }
            });

            // Filter homeworks by due date for pending missions
            const filteredHomeworksForPending = currentHomeworks.filter(hw => {
               if (!gradebookDueDate) return true;
               if (!hw.dueDate) return false;
               try {
                  const hwDate = new Date(hw.dueDate);
                  const filterDate = new Date(gradebookDueDate);
                  return hwDate.getFullYear() === filterDate.getFullYear() &&
                         hwDate.getMonth() === filterDate.getMonth() &&
                         hwDate.getDate() === filterDate.getDate();
               } catch (e) {
                  return false;
               }
            });

            const missingReports = [];
            currentStudents.forEach(student => {
               if (gradebookSearch && !student.name?.toLowerCase().includes(gradebookSearch.toLowerCase())) {
                 return;
               }
               const studentSubs = currentSubmissions.filter(s => normalizeName(s.studentName) === normalizeName(student.name));
               const submittedHwIds = new Set(studentSubs.map(s => s.homeworkId));
               
               const missingHws = filteredHomeworksForPending.filter(hw => !submittedHwIds.has(hw.id));
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
                        <h1 className="text-4xl font-black text-[#14532d] tracking-tight">Gradebook</h1>
                        <p className="text-sm font-bold text-[#166534] italic">Review AI-graded results and student feedback.</p>
                     </div>
                     <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 bg-white border-2 border-green-150 px-4 py-2.5 rounded-2xl shadow-sm relative">
                           <User className="w-4 h-4 text-slate-400" />
                           <select 
                              value={gradebookSearch}
                              onChange={(e) => setGradebookSearch(e.target.value)}
                              className="bg-transparent text-sm font-bold text-slate-700 focus:outline-none w-32 md:w-48 cursor-pointer appearance-none pr-6"
                           >
                              <option value="">All Students</option>
                              {currentStudents.sort((a,b) => a.name.localeCompare(b.name)).map(student => (
                                 <option key={student.id || student.name} value={student.name}>
                                    {student.name}
                                 </option>
                              ))}
                           </select>
                           <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-16" />
                           {gradebookSearch && (
                              <button 
                                 onClick={() => setGradebookSearch('')}
                                 className="text-xs text-rose-500 hover:text-rose-700 font-bold px-1 ml-2"
                              >
                                 Clear
                              </button>
                           )}
                        </div>
                        <div className="flex items-center gap-2 bg-white border-2 border-green-150 px-4 py-2.5 rounded-2xl shadow-sm">
                           <span className="text-xs font-black text-[#EA580C] uppercase tracking-wider">Due Date:</span>
                           <input 
                              type="date"
                              value={gradebookDueDate}
                              onChange={(e) => setGradebookDueDate(e.target.value)}
                              className="bg-transparent text-sm font-bold text-blue-900 focus:outline-none"
                           />
                           {gradebookDueDate && (
                              <button 
                                 onClick={() => setGradebookDueDate('')}
                                 className="text-xs text-rose-500 hover:text-rose-700 font-bold px-1"
                              >
                                 Clear
                              </button>
                           )}
                        </div>
                        <div className="w-24 h-24">
                           <img src="/mascot.png" className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl" alt="Mascot" />
                        </div>
                     </div>
                  </div>
                  
                  {/* Mock Gradebook Table */}
                  <div className="bg-white rounded-[40px] border border-orange-100 shadow-sm overflow-hidden">
                     <div className="grid grid-cols-12 px-8 py-6 bg-blue-50/20 text-[10px] font-black text-blue-200 uppercase tracking-widest border-b border-orange-100">
                        <div className="col-span-6">Student Name</div>
                        <div className="col-span-3 text-center">Score</div>
                        <div className="col-span-3 text-right">Actions</div>
                     </div>
                     <div className="divide-y divide-blue-50">
                        {filteredGradebookSubmissions.length > 0 ? (
                           filteredGradebookSubmissions.sort((a,b) => b.submittedAt - a.submittedAt).map((sub, idx) => (
                              <div key={sub.id || idx} className="grid grid-cols-12 px-8 py-6 items-center hover:bg-blue-50/10 transition-all">
                                 <div className="col-span-6 flex items-center gap-4">
                                    <button 
                                       onClick={() => {
                                          const matched = allStudents.find(s => normalizeName(s.name) === normalizeName(sub.studentName));
                                          if (matched) {
                                             setSelectedProfileStudent(matched);
                                          } else {
                                             setSelectedProfileStudent({ name: sub.studentName, classId: sub.classId });
                                          }
                                          setStudentProfileTab('mastery');
                                          setSelectedProfileSubmission(null);
                                       }}
                                       className="shrink-0 focus:outline-none hover:scale-105 transition-transform"
                                    >
                                       <img src={getStudentAvatar(sub.studentName)} className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-white p-0.5" alt={sub.studentName} />
                                    </button>
                                    <div className="flex flex-col">
                                       <button 
                                          onClick={() => {
                                             const matched = allStudents.find(s => normalizeName(s.name) === normalizeName(sub.studentName));
                                             if (matched) {
                                                setSelectedProfileStudent(matched);
                                             } else {
                                                setSelectedProfileStudent({ name: sub.studentName, classId: sub.classId });
                                             }
                                             setStudentProfileTab('mastery');
                                             setSelectedProfileSubmission(null);
                                          }}
                                          className="text-sm font-black text-[#14532d] hover:text-[#EA580C] text-left focus:outline-none transition-colors"
                                       >
                                          {sub.studentName}
                                       </button>
                                       {(() => {
                                          const hw = allHomeworks.find(h => h.id === sub.homeworkId);
                                          if (!hw) return <span className="text-[10px] text-slate-400 font-bold mt-1">Unknown Assignment</span>;
                                          
                                          // Format short code from document ID
                                          const hwCode = hw.id ? `HW-${hw.id.slice(0, 5).toUpperCase()}` : 'N/A';
                                          
                                          // Format due date nicely
                                          const formattedDueDate = hw.dueDate ? new Date(hw.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'No Due Date';

                                          return (
                                             <div className="flex flex-col gap-1.5 mt-1.5">
                                                <div className="flex items-center gap-2">
                                                   <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                                                      hw.subject === 'maths' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                      hw.subject === 'science' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                      'bg-pink-50 text-pink-600 border-pink-100'
                                                   }`}>
                                                      {hw.subject}
                                                   </span>
                                                   <span className="text-xs font-black text-slate-700 truncate max-w-[200px]" title={hw.title}>
                                                      {hw.title}
                                                   </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                                   <span className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 font-mono text-[9px] text-slate-500">
                                                      {hwCode}
                                                   </span>
                                                   <span>•</span>
                                                   <span className="text-rose-500">
                                                      Due: {formattedDueDate}
                                                   </span>
                                                </div>
                                             </div>
                                          );
                                       })()}
                                    </div>
                                 </div>
                                 <div className="col-span-3 text-center">
                                    <span className={`px-4 py-1 rounded-full text-xs font-black ${sub.score >= 80 ? 'bg-emerald-50 text-emerald-600' : sub.score >= 50 ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
                                       {sub.score}%
                                    </span>
                                 </div>
                                 <div className="col-span-3 text-right flex flex-col items-end gap-2">
                                    <span className="text-xs font-bold text-[#166534]">
                                       {sub.submittedAt ? new Date(sub.submittedAt.toDate ? sub.submittedAt.toDate() : sub.submittedAt).toLocaleDateString() : 'Just now'}
                                    </span>
                                    <button 
                                       onClick={() => setSelectedSubmission(sub)}
                                       className="text-[10px] font-black text-orange-600 bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-xl transition-colors border border-orange-200 shadow-sm"
                                    >
                                       View Answers
                                    </button>
                                 </div>
                              </div>
                           ))
                        ) : (
                           <div className="py-20 text-center text-[#166534] italic font-bold">
                              {gradebookDueDate 
                                 ? `No mission reports due on ${new Date(gradebookDueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} found. 📅`
                                 : "No mission reports yet. 🚀"
                              }
                           </div>
                        )}
                     </div>
                  </div>

                  {missingReports.length > 0 && (
                     <div className="bg-white rounded-[40px] border border-rose-50 shadow-sm overflow-hidden mt-10">
                        <div className="px-8 py-6 bg-rose-50/30 border-b border-rose-50 flex items-center justify-between">
                           <h3 className="text-xl font-black text-rose-900 tracking-tight">Pending Missions (Not Started)</h3>
                           <span className="text-xs font-bold text-rose-400 bg-white px-3 py-1 rounded-full border border-rose-100">
                              {missingReports.length} Students Pending {gradebookDueDate ? 'on this date' : ''}
                           </span>
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
                                             const hwDueDate = h.dueDate ? new Date(h.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
                                             return (
                                                <span key={h.id} className="text-[10px] font-black text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg inline-block w-fit border border-rose-100 shadow-sm">
                                                   {h.title || h.subject || 'Mission'} 
                                                   <span className="text-rose-400 font-bold ml-1">
                                                      • ID: {h.id.slice(0,6).toUpperCase()} {dateStr ? `• Assigned: ${dateStr}` : ''} {hwDueDate ? `• Due: ${hwDueDate}` : ''}
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
         case 'Reports': {
            const currentSubmissions = activeClassroom ? allSubmissions.filter(s => s.classId === activeClassroom.id) : allSubmissions;
            const currentStudents = activeClassroom ? allStudents.filter(s => s.classId === activeClassroom.id) : allStudents;
            const currentHomeworks = activeClassroom ? allHomeworks.filter(h => h.assignedClassId === activeClassroom.id) : allHomeworks;

            if (!activeClassroom) {
               return (
                  <div className="px-10 py-10 min-h-[calc(100vh-64px)] flex-center flex-col text-center space-y-6">
                     <div className="w-32 h-32 bg-white rounded-[40px] shadow-2xl flex-center border border-orange-100">
                        <img src="/ic-homework.png" className="w-20 h-20 object-contain" alt="Classroom" />
                     </div>
                     <div className="space-y-2">
                        <h1 className="text-4xl font-black text-[#14532d] tracking-tight">Select a Classroom 🏫</h1>
                        <p className="text-sm font-bold text-[#166534] italic">Please select a classroom from the top selector to see classroom analytics reports.</p>
                     </div>
                  </div>
               );
            }

            // Calculation of subtopics for Report A
            const subtopicsData = {};
            currentSubmissions.forEach(sub => {
               const hw = allHomeworks.find(h => h.id === sub.homeworkId);
               if (!hw || !hw.questions) return;
               hw.questions.forEach(q => {
                  const subtopic = getQuestionSubtopic(hw, q);
                  if (!subtopicsData[subtopic]) {
                     subtopicsData[subtopic] = {
                        name: subtopic,
                        correctCount: 0,
                        totalCount: 0,
                        students: {},
                        questions: {}
                     };
                  }
                  const studentSelection = sub.answers?.[q.id];
                  const actualAnswer = q.answer;
                  const isCorrect = studentSelection === actualAnswer;
                  
                  subtopicsData[subtopic].totalCount += 1;
                  if (isCorrect) {
                     subtopicsData[subtopic].correctCount += 1;
                  }
                  
                  const studentName = normalizeName(sub.studentName);
                  if (!subtopicsData[subtopic].students[studentName]) {
                     subtopicsData[subtopic].students[studentName] = { correct: 0, total: 0 };
                  }
                  subtopicsData[subtopic].students[studentName].total += 1;
                  if (isCorrect) {
                     subtopicsData[subtopic].students[studentName].correct += 1;
                  }
                  
                  if (!subtopicsData[subtopic].questions[q.id]) {
                     subtopicsData[subtopic].questions[q.id] = { text: q.text, correct: 0, total: 0 };
                  }
                  subtopicsData[subtopic].questions[q.id].total += 1;
                  if (isCorrect) {
                     subtopicsData[subtopic].questions[q.id].correct += 1;
                  }
               });
            });

            const subtopicsArray = Object.keys(subtopicsData).map(name => {
               const data = subtopicsData[name];
               const accuracy = data.totalCount > 0 ? Math.round((data.correctCount / data.totalCount) * 100) : 0;
               let tier = 'Needs Focus';
               if (accuracy >= 80) tier = 'Mastered';
               else if (accuracy >= 60) tier = 'Reviewing';
               
               return {
                  name,
                  accuracy,
                  correctCount: data.correctCount,
                  totalCount: data.totalCount,
                  students: data.students,
                  questions: data.questions,
                  tier
               };
            });

            // Filtering, Sorting, and Pagination for Concept Mastery (Report A)
            const tierWeights = { 'Needs Focus': 1, 'Reviewing': 2, 'Mastered': 3 };
            const sortedAndFilteredSubtopics = subtopicsArray
               .filter(sub => {
                  const matchesSearch = sub.name.toLowerCase().includes(conceptSearchQuery.toLowerCase());
                  const matchesTier = conceptTierFilter === 'all' || sub.tier === conceptTierFilter;
                  return matchesSearch && matchesTier;
               })
               .sort((a, b) => {
                  const weightDiff = (tierWeights[a.tier] || 99) - (tierWeights[b.tier] || 99);
                  if (weightDiff !== 0) return weightDiff;
                  return a.name.localeCompare(b.name);
               });

            const itemsPerPage = 6;
            const totalPages = Math.ceil(sortedAndFilteredSubtopics.length / itemsPerPage);
            const currentPageSafe = Math.min(conceptPage, totalPages || 1);
            const displayedSubtopics = sortedAndFilteredSubtopics.slice(
               (currentPageSafe - 1) * itemsPerPage,
               currentPageSafe * itemsPerPage
            );

            // Calculations for Report B: Pacing
            const getTimeSpent = (sub, hw) => {
               if (sub.timeSpent !== undefined && sub.timeSpent > 0) return sub.timeSpent;
               const qCount = hw?.questions?.length || 5;
               return qCount * 25; 
            };

            let totalTimeSpent = 0;
            let totalQCount = 0;
            let totalSubmissionsCount = currentSubmissions.length;

            const studentPacing = {};
            currentStudents.forEach(student => {
               studentPacing[normalizeName(student.name)] = {
                  name: student.name,
                  totalTime: 0,
                  totalQ: 0,
                  subsCount: 0
               };
            });

            currentSubmissions.forEach(sub => {
               const hw = allHomeworks.find(h => h.id === sub.homeworkId);
               const qCount = hw?.questions?.length || 5;
               const time = getTimeSpent(sub, hw);
               
               totalTimeSpent += time;
               totalQCount += qCount;
               
               const normName = normalizeName(sub.studentName);
               if (!studentPacing[normName]) {
                  studentPacing[normName] = {
                     name: sub.studentName,
                     totalTime: 0,
                     totalQ: 0,
                     subsCount: 0
                  };
               }
               studentPacing[normName].totalTime += time;
               studentPacing[normName].totalQ += qCount;
               studentPacing[normName].subsCount += 1;
            });

            const classAvgTime = totalSubmissionsCount > 0 ? Math.round(totalTimeSpent / totalSubmissionsCount) : 0;
            const formatTime = (secs) => {
               if (secs < 60) return `${secs}s`;
               const m = Math.floor(secs / 60);
               const s = secs % 60;
               return s > 0 ? `${m}m ${s}s` : `${m}m`;
            };

            const quickSolvers = [];
            const pacedSolvers = [];
            const deepThinkers = [];

            Object.values(studentPacing).forEach(p => {
               if (p.subsCount === 0) return;
               const pacePerQ = p.totalQ > 0 ? p.totalTime / p.totalQ : 0;
               
               if (pacePerQ < 15) {
                  quickSolvers.push({ ...p, pacePerQ });
               } else if (pacePerQ >= 15 && pacePerQ <= 40) {
                  pacedSolvers.push({ ...p, pacePerQ });
               } else {
                  deepThinkers.push({ ...p, pacePerQ });
               }
            });

            const uniqueStudentHwPairs = new Set();
            currentSubmissions.forEach(sub => {
               uniqueStudentHwPairs.add(`${normalizeName(sub.studentName)}_${sub.homeworkId}`);
            });
            const avgAttemptsPerHw = uniqueStudentHwPairs.size > 0 
               ? (currentSubmissions.length / uniqueStudentHwPairs.size).toFixed(1) 
               : '0.0';

            const studentAttempts = {};
            currentSubmissions.forEach(sub => {
               const norm = normalizeName(sub.studentName);
               if (!studentAttempts[norm]) studentAttempts[norm] = {};
               if (!studentAttempts[norm][sub.homeworkId]) studentAttempts[norm][sub.homeworkId] = 0;
               studentAttempts[norm][sub.homeworkId] += 1;
            });

            const studentAttemptsArray = Object.values(studentPacing).map(p => {
               const norm = normalizeName(p.name);
               const attsMap = studentAttempts[norm] || {};
               const totalAttempts = Object.values(attsMap).reduce((acc, count) => acc + count, 0);
               const pacePerQ = p.totalQ > 0 ? Math.round(p.totalTime / p.totalQ) : 0;
               
               let speedBadge = 'No Data';
               let badgeColor = 'bg-slate-50 text-slate-400';
               if (p.subsCount > 0) {
                  if (pacePerQ < 15) {
                     speedBadge = 'Quick Solver ⚡';
                     badgeColor = 'bg-amber-50 text-amber-600 border border-amber-100';
                  } else if (pacePerQ >= 15 && pacePerQ <= 40) {
                     speedBadge = 'Paced Solver ⏱️';
                     badgeColor = 'bg-emerald-50 text-emerald-600 border border-emerald-100';
                  } else {
                     speedBadge = 'Deep Thinker 🧠';
                     badgeColor = 'bg-[#FFEDD5] text-[#EA580C] border border-[#FED7AA]';
                  }
               }
               
               return {
                  name: p.name,
                  avgTimePerQ: pacePerQ > 0 ? `${pacePerQ}s` : 'N/A',
                  submissionsCount: p.subsCount,
                  attemptsCount: totalAttempts,
                  speedBadge,
                  badgeColor
               };
            });

            // Calculations for Report C
            const selectedStudentSubs = currentSubmissions.filter(sub => normalizeName(sub.studentName) === normalizeName(selectedReportStudent));
            selectedStudentSubs.sort((a, b) => {
               const dateA = a.submittedAt?.toDate ? a.submittedAt.toDate() : new Date(a.submittedAt || 0);
               const dateB = b.submittedAt?.toDate ? b.submittedAt.toDate() : new Date(b.submittedAt || 0);
               return dateA - dateB;
            });

            const chartData = selectedStudentSubs.map((sub, idx) => {
               const hw = allHomeworks.find(h => h.id === sub.homeworkId);
               const hwTitle = hw ? hw.title : 'Mission';
               
               const hwSubs = currentSubmissions.filter(s => s.homeworkId === sub.homeworkId);
               const classAvg = hwSubs.length > 0 ? Math.round(hwSubs.reduce((acc, s) => acc + (s.score || 0), 0) / hwSubs.length) : 0;
               
               const dateStr = sub.submittedAt ? new Date(sub.submittedAt.toDate ? sub.submittedAt.toDate() : sub.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : `Quiz ${idx + 1}`;
               
               return {
                  name: dateStr,
                  title: hwTitle,
                  studentScore: sub.score,
                  classAverage: classAvg
               };
            });

            const startingScore = chartData.length > 0 ? chartData[0].studentScore : 0;
            const currentScore = chartData.length > 0 ? chartData[chartData.length - 1].studentScore : 0;
            const growth = chartData.length > 1 ? currentScore - startingScore : 0;

            // Calculations for Report D: Early Intervention
            const flaggedStudents = [];
            currentStudents.forEach(student => {
               const studentSubs = currentSubmissions.filter(sub => normalizeName(sub.studentName) === normalizeName(student.name));
               const subsCount = studentSubs.length;
               const avgScore = subsCount > 0 ? Math.round(studentSubs.reduce((acc, s) => acc + (s.score || 0), 0) / subsCount) : 0;
               const assignedCount = currentHomeworks.length;
               const completionRate = assignedCount > 0 ? Math.round((subsCount / assignedCount) * 100) : 0;
               
               if (avgScore < 65 || completionRate < 70) {
                  const riskLevel = (avgScore < 50 || completionRate < 50) ? 'High Risk' : 'Moderate Risk';
                  
                  const studentSubtopics = {};
                  studentSubs.forEach(sub => {
                     const hw = allHomeworks.find(h => h.id === sub.homeworkId);
                     if (!hw || !hw.questions) return;
                     
                     hw.questions.forEach(q => {
                        const subtopic = getQuestionSubtopic(hw, q);
                        if (!studentSubtopics[subtopic]) {
                           studentSubtopics[subtopic] = { correct: 0, total: 0 };
                        }
                        const studentSelection = sub.answers?.[q.id];
                        const actualAnswer = q.answer;
                        if (studentSelection === actualAnswer) {
                           studentSubtopics[subtopic].correct += 1;
                        }
                        studentSubtopics[subtopic].total += 1;
                     });
                  });
                  
                  const gaps = Object.keys(studentSubtopics)
                     .map(name => {
                        const data = studentSubtopics[name];
                        const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                        return { name, accuracy: acc };
                     })
                     .filter(item => item.accuracy < 60)
                     .map(item => item.name);
                     
                  const allStSubtopics = Object.keys(studentSubtopics).map(name => {
                     const data = studentSubtopics[name];
                     const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                     return { name, accuracy: acc };
                  });
                  allStSubtopics.sort((a, b) => a.accuracy - b.accuracy);
                  
                  const primaryGap = gaps.length > 0 
                     ? gaps.join(', ') 
                     : (allStSubtopics.length > 0 ? allStSubtopics[0].name : 'General Concepts');
                     
                  flaggedStudents.push({
                     ...student,
                     avgScore,
                     completionRate,
                     riskLevel,
                     primaryGap
                  });
               }
            });

            return (
               <div className="px-10 py-10 space-y-10 min-h-[calc(100vh-64px)] pb-40 relative">
                  {/* Top Header */}
                  <div className="flex justify-between items-center">
                     <div>
                        <span className="text-[10px] font-black uppercase text-[#EA580C] tracking-[0.2em]">Classroom Intelligence</span>
                        <h1 className="text-4xl font-black text-[#14532d] tracking-tight">Reports & Analytics</h1>
                     </div>
                     <div className="flex bg-[#FFEDD5]/50 p-1.5 rounded-[24px] border border-[#FED7AA]">
                        <button 
                           onClick={() => setSelectedReportTab('mastery')} 
                           className={`px-5 py-3 rounded-xl text-xs font-black transition-all ${selectedReportTab === 'mastery' ? 'bg-white text-[#EA580C] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                           Concept Mastery
                        </button>
                        <button 
                           onClick={() => setSelectedReportTab('pacing')} 
                           className={`px-5 py-3 rounded-xl text-xs font-black transition-all ${selectedReportTab === 'pacing' ? 'bg-white text-[#EA580C] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                           Engagement & Pacing
                        </button>
                        <button 
                           onClick={() => setSelectedReportTab('trajectory')} 
                           className={`px-5 py-3 rounded-xl text-xs font-black transition-all ${selectedReportTab === 'trajectory' ? 'bg-white text-[#EA580C] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                           Growth Trajectory
                        </button>
                        <button 
                           onClick={() => setSelectedReportTab('intervention')} 
                           className={`px-5 py-3 rounded-xl text-xs font-black transition-all ${selectedReportTab === 'intervention' ? 'bg-white text-[#EA580C] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                           Early Intervention
                        </button>
                     </div>
                  </div>

                  {/* Tab Contents */}
                  {selectedReportTab === 'mastery' && (
                     <div className="space-y-8 animate-fadeIn">
                        {!selectedReportSubtopic ? (
                           <>
                              <div className="bg-white rounded-[40px] p-8 border border-orange-100 shadow-sm space-y-4">
                                 <h2 className="text-2xl font-black text-[#14532d]">Concept Mastery Overview</h2>
                                 <p className="text-xs text-[#166534] font-medium">Grouped by subtopic based on historical quiz submissions. Click on any concept card below to drill down into question difficulty details and student accuracy rankings.</p>
                              </div>

                              {subtopicsArray.length > 0 && (
                                 <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white rounded-[32px] p-4 border border-orange-100 shadow-sm animate-fadeIn">
                                    {/* Search Input */}
                                    <div className="relative flex-1 max-w-md">
                                       <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                                       <input
                                          type="text"
                                          placeholder="Search concepts..."
                                          value={conceptSearchQuery}
                                          onChange={(e) => {
                                             setConceptSearchQuery(e.target.value);
                                             setConceptPage(1);
                                          }}
                                          className="w-full bg-slate-50 border border-slate-100 focus:border-green-300 focus:bg-white transition-all rounded-2xl py-3 pl-11 pr-10 text-xs font-bold text-[#14532d] placeholder-slate-400 focus:outline-none"
                                       />
                                       {conceptSearchQuery && (
                                          <button
                                             onClick={() => {
                                                setConceptSearchQuery('');
                                                setConceptPage(1);
                                             }}
                                             className="absolute right-3 top-3 w-5 h-5 flex items-center justify-center rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-500 transition-colors"
                                          >
                                             <X className="w-3 h-3" />
                                          </button>
                                       )}
                                    </div>

                                    {/* Filter Pills */}
                                    <div className="flex flex-wrap gap-2">
                                       {[
                                          { id: 'all', label: 'All', count: subtopicsArray.length, color: 'text-orange-600 bg-orange-50 border-orange-200' },
                                          { id: 'Needs Focus', label: 'Needs Focus ⚠️', count: subtopicsArray.filter(s => s.tier === 'Needs Focus').length, color: 'text-rose-600 bg-rose-50 border-rose-100' },
                                          { id: 'Reviewing', label: 'Reviewing ⏱️', count: subtopicsArray.filter(s => s.tier === 'Reviewing').length, color: 'text-blue-600 bg-blue-50 border-blue-100' },
                                          { id: 'Mastered', label: 'Mastered ✨', count: subtopicsArray.filter(s => s.tier === 'Mastered').length, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' }
                                       ].map((pill) => {
                                          const isActive = conceptTierFilter === pill.id;
                                          return (
                                             <button
                                                key={pill.id}
                                                onClick={() => {
                                                   setConceptTierFilter(pill.id);
                                                   setConceptPage(1);
                                                }}
                                                className={`px-4 py-2 rounded-xl text-xs font-black border transition-all flex items-center gap-2 ${
                                                   isActive 
                                                      ? `${pill.color} shadow-sm scale-105` 
                                                      : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-100'
                                                }`}
                                             >
                                                <span>{pill.label}</span>
                                                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                                                   isActive ? 'bg-white/60' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                   {pill.count}
                                                </span>
                                             </button>
                                          );
                                       })}
                                    </div>
                                 </div>
                              )}

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                 {displayedSubtopics.map((sub, idx) => {
                                    let tierColor = 'bg-rose-50 text-rose-600 border border-rose-100';
                                    let progressColor = 'bg-rose-400';
                                    if (sub.tier === 'Mastered') {
                                       tierColor = 'bg-emerald-50 text-emerald-600 border border-emerald-100';
                                       progressColor = 'bg-emerald-400';
                                    } else if (sub.tier === 'Reviewing') {
                                       tierColor = 'bg-blue-50 text-blue-600 border border-blue-100';
                                       progressColor = 'bg-blue-400';
                                    }

                                    return (
                                       <div 
                                          key={idx} 
                                          onClick={() => setSelectedReportSubtopic(sub)}
                                          className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:scale-[1.02] cursor-pointer transition-all flex flex-col justify-between h-48 group"
                                       >
                                          <div className="flex justify-between items-start">
                                             <div className="space-y-1 max-w-[70%]">
                                                <h3 className="font-black text-slate-800 text-base leading-snug group-hover:text-[#EA580C] transition-colors truncate">{sub.name}</h3>
                                                <span className="text-[10px] font-bold text-slate-400">{sub.totalCount} responses</span>
                                             </div>
                                             <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${tierColor}`}>
                                                {sub.tier}
                                             </span>
                                          </div>
                                          <div className="space-y-2">
                                             <div className="flex justify-between items-center text-xs font-black">
                                                <span className="text-slate-400">Class Accuracy</span>
                                                <span className="text-slate-800">{sub.accuracy}%</span>
                                             </div>
                                             <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full transition-all duration-500 ${progressColor}`} style={{ width: `${sub.accuracy}%` }} />
                                             </div>
                                          </div>
                                       </div>
                                    );
                                 })}
                                 
                                 {subtopicsArray.length > 0 && sortedAndFilteredSubtopics.length === 0 && (
                                    <div className="col-span-3 bg-white rounded-[40px] py-16 text-center text-slate-400 font-bold border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 animate-fadeIn">
                                       <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                          <Search className="w-6 h-6" />
                                       </div>
                                       <p className="mt-2 text-slate-600 font-black text-sm">No matching concepts found</p>
                                       <p className="text-xs text-slate-400 font-bold not-italic">Try adjusting your search terms or status filters.</p>
                                    </div>
                                 )}

                                 {subtopicsArray.length === 0 && (
                                    <div className="col-span-3 bg-white rounded-[40px] py-16 text-center text-[#166534] font-bold italic border border-orange-100 shadow-sm">
                                       No mastery data has been logged yet. Check back once students submit their quizzes! 🚀
                                    </div>
                                 )}
                              </div>

                              {/* Pagination Controls */}
                              {totalPages > 1 && (
                                 <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-[32px] p-4 border border-orange-100 shadow-sm mt-6 gap-4 animate-fadeIn">
                                    <span className="text-xs font-bold text-slate-400">
                                       Showing <span className="font-black text-slate-700">{(currentPageSafe - 1) * itemsPerPage + 1}</span> to{' '}
                                       <span className="font-black text-slate-700">
                                          {Math.min(currentPageSafe * itemsPerPage, sortedAndFilteredSubtopics.length)}
                                       </span>{' '}
                                       of <span className="font-black text-slate-700">{sortedAndFilteredSubtopics.length}</span> concepts
                                    </span>
                                    <div className="flex items-center gap-2">
                                       <button
                                          onClick={() => setConceptPage(prev => Math.max(prev - 1, 1))}
                                          disabled={currentPageSafe === 1}
                                          className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
                                             currentPageSafe === 1
                                                ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                                                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:shadow-sm'
                                          }`}
                                       >
                                          Previous
                                       </button>
                                       {Array.from({ length: totalPages }).map((_, i) => {
                                          const pageNum = i + 1;
                                          const isActive = pageNum === currentPageSafe;
                                          return (
                                             <button
                                                key={pageNum}
                                                onClick={() => setConceptPage(pageNum)}
                                                className={`w-8 h-8 rounded-xl text-xs font-black border transition-all ${
                                                   isActive
                                                      ? 'bg-[#EA580C] text-white border-[#EA580C] shadow-sm scale-105'
                                                      : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-200'
                                                }`}
                                             >
                                                {pageNum}
                                             </button>
                                          );
                                       })}
                                       <button
                                          onClick={() => setConceptPage(prev => Math.min(prev + 1, totalPages))}
                                          disabled={currentPageSafe === totalPages}
                                          className={`px-4 py-2 rounded-xl text-xs font-black border transition-all ${
                                             currentPageSafe === totalPages
                                                ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                                                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:shadow-sm'
                                          }`}
                                       >
                                          Next
                                       </button>
                                    </div>
                                 </div>
                              )}
                           </>
                        ) : (
                           <div className="space-y-8">
                              <div className="flex items-center gap-4">
                                 <button 
                                    onClick={() => setSelectedReportSubtopic(null)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-2xl transition-colors"
                                 >
                                    ← Back to Subtopics
                                 </button>
                                 <h2 className="text-2xl font-black text-[#14532d]">Drilldown: {selectedReportSubtopic.name}</h2>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                 {/* Left side: Questions analysis */}
                                 <div className="lg:col-span-7 bg-white rounded-[40px] border border-orange-100 shadow-sm p-8 space-y-6">
                                    <h3 className="text-lg font-black text-slate-800">Question Difficulty Breakdown</h3>
                                    <div className="space-y-4">
                                       {Object.entries(selectedReportSubtopic.questions).map(([qId, qData], index) => {
                                          const qAcc = qData.total > 0 ? Math.round((qData.correct / qData.total) * 100) : 0;
                                          let scoreColor = 'bg-rose-50 text-rose-600';
                                          if (qAcc >= 80) scoreColor = 'bg-emerald-50 text-emerald-600';
                                          else if (qAcc >= 60) scoreColor = 'bg-blue-50 text-blue-600';
                                          
                                          return (
                                             <div key={qId} className="p-4 bg-slate-50 rounded-2xl flex justify-between items-start gap-4 hover:bg-slate-100 transition-colors">
                                                <div className="space-y-1">
                                                   <span className="text-[10px] font-black text-[#EA580C] uppercase tracking-wider block">Question {index + 1}</span>
                                                   <p className="text-xs font-bold text-slate-700 leading-relaxed">{qData.text}</p>
                                                   <span className="text-[10px] font-bold text-slate-400 block mt-1">{qData.correct}/{qData.total} correct attempts</span>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-black whitespace-nowrap ${scoreColor}`}>
                                                   {qAcc}% accuracy
                                                </span>
                                             </div>
                                          );
                                       })}
                                    </div>
                                 </div>

                                 {/* Right side: Students accuracy ranking */}
                                 <div className="lg:col-span-5 bg-white rounded-[40px] border border-orange-100 shadow-sm p-8 space-y-6">
                                    <h3 className="text-lg font-black text-slate-800">Student Standings</h3>
                                    <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                                       {currentStudents.map((st, idx) => {
                                          const stData = selectedReportSubtopic.students[normalizeName(st.name)];
                                          const stAcc = stData && stData.total > 0 ? Math.round((stData.correct / stData.total) * 100) : null;
                                          
                                          return (
                                             <button 
                                                key={idx} 
                                                onClick={() => {
                                                   setSelectedProfileStudent(st);
                                                   setStudentProfileTab('mastery');
                                                   setSelectedProfileSubmission(null);
                                                }}
                                                className="w-full flex justify-between items-center bg-slate-50 hover:bg-slate-100 px-4 py-3 rounded-2xl transition-colors focus:outline-none hover:opacity-85 text-left"
                                             >
                                                <div className="flex items-center gap-3">
                                                   <img src={getStudentAvatar(st.name)} className="w-8 h-8 rounded-full border border-white bg-white p-0.5" alt={st.name} />
                                                   <span className="text-xs font-black text-slate-700">{st.name}</span>
                                                </div>
                                                {stAcc !== null ? (
                                                   <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${stAcc >= 80 ? 'bg-emerald-50 text-emerald-600' : stAcc >= 60 ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
                                                      {stAcc}%
                                                   </span>
                                                ) : (
                                                   <span className="text-[10px] font-bold text-slate-300 italic">No submissions</span>
                                                )}
                                             </button>
                                          );
                                       })}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        )}
                     </div>
                  )}

                  {selectedReportTab === 'pacing' && (
                     <div className="space-y-8 animate-fadeIn">
                        {/* KPI Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <div className="bg-white rounded-[40px] p-8 border border-orange-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all relative overflow-hidden h-40">
                              <div className="space-y-2 relative z-10">
                                 <h4 className="text-sm font-black text-[#14532d] tracking-tight">Average Completion Time</h4>
                                 <p className="text-4xl font-black text-[#14532d] tracking-tighter">{formatTime(classAvgTime)}</p>
                                 <p className="text-[10px] font-bold text-[#166534] uppercase tracking-widest">Class pacing average</p>
                              </div>
                              <div className="w-16 h-16 bg-[#FFEDD5] rounded-3xl flex-center text-[#EA580C] shadow-sm">
                                 <Clock className="w-8 h-8" />
                               </div>
                           </div>

                           <div className="bg-white rounded-[40px] p-8 border border-orange-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all relative overflow-hidden h-40">
                              <div className="space-y-2 relative z-10">
                                 <h4 className="text-sm font-black text-[#14532d] tracking-tight">Attempts Ratio</h4>
                                 <p className="text-4xl font-black text-[#14532d] tracking-tighter">{avgAttemptsPerHw}x</p>
                                 <p className="text-[10px] font-bold text-[#166534] uppercase tracking-widest">Average attempts per quiz</p>
                              </div>
                              <div className="w-16 h-16 bg-blue-50 rounded-3xl flex-center text-blue-600 shadow-sm">
                                 <Activity className="w-8 h-8" />
                               </div>
                           </div>

                           <div className="bg-white rounded-[40px] p-8 border border-orange-100 shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all relative overflow-hidden h-40">
                              <h4 className="text-sm font-black text-[#14532d] tracking-tight">Pacing Profile Distribution</h4>
                              <div className="grid grid-cols-3 gap-2 text-center">
                                 <div className="bg-amber-50 border border-amber-100 rounded-xl p-2">
                                    <span className="text-xs font-black text-amber-700 block">{quickSolvers.length}</span>
                                    <span className="text-[8px] font-bold text-amber-500 uppercase tracking-wider">Quick</span>
                                 </div>
                                 <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-2">
                                    <span className="text-xs font-black text-emerald-700 block">{pacedSolvers.length}</span>
                                    <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-wider">Paced</span>
                                 </div>
                                 <div className="bg-[#FFEDD5] border border-[#FED7AA] rounded-xl p-2">
                                    <span className="text-xs font-black text-[#EA580C] block">{deepThinkers.length}</span>
                                    <span className="text-[8px] font-bold text-[#EA580C]/70 uppercase tracking-wider">Deep</span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Student Pacing Table */}
                        <div className="bg-white rounded-[40px] border border-orange-100 shadow-sm overflow-hidden">
                           <div className="px-8 py-6 bg-slate-50/50 border-b border-orange-100">
                              <h3 className="text-lg font-black text-[#14532d]">Student Pacing Analyzer</h3>
                           </div>
                           <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse">
                                 <thead>
                                    <tr className="border-b border-orange-100 text-[10px] font-black uppercase text-blue-400 tracking-wider">
                                       <th className="px-8 py-4">Student</th>
                                       <th className="px-8 py-4 text-center">Average Time/Q</th>
                                       <th className="px-8 py-4 text-center">Submissions</th>
                                       <th className="px-8 py-4 text-center">Total Attempts</th>
                                       <th className="px-8 py-4 text-right">Pacing Profile</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-blue-50/50">
                                    {studentAttemptsArray.map((row, idx) => (
                                       <tr key={idx} className="hover:bg-slate-50/50 transition-colors text-xs font-bold text-slate-700">
                                          <td className="px-8 py-4 flex items-center gap-3">
                                             <img src={getStudentAvatar(row.name)} className="w-8 h-8 rounded-full border border-white bg-white p-0.5" alt={row.name} />
                                             <span className="font-black text-slate-900">{row.name}</span>
                                          </td>
                                          <td className="px-8 py-4 text-center font-bold text-slate-800">{row.avgTimePerQ}</td>
                                          <td className="px-8 py-4 text-center text-blue-500 font-black">{row.submissionsCount}</td>
                                          <td className="px-8 py-4 text-center text-slate-600 font-bold">{row.attemptsCount}</td>
                                          <td className="px-8 py-4 text-right">
                                             <span className={`px-3 py-1.5 rounded-full text-[10px] font-black inline-block ${row.badgeColor}`}>
                                                {row.speedBadge}
                                             </span>
                                          </td>
                                       </tr>
                                    ))}
                                    {studentAttemptsArray.length === 0 && (
                                       <tr>
                                          <td colSpan={5} className="py-12 text-center text-[#166534] italic font-bold">
                                             No student records available yet.
                                          </td>
                                       </tr>
                                    )}
                                 </tbody>
                              </table>
                           </div>
                        </div>
                     </div>
                  )}

                  {selectedReportTab === 'trajectory' && (
                     <div className="space-y-8 animate-fadeIn">
                        {/* Controls & Profile Card */}
                        <div className="bg-white rounded-[40px] border border-orange-100 shadow-sm p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                           <div className="space-y-2 text-center md:text-left">
                              <h2 className="text-2xl font-black text-[#14532d]">Growth Trajectory Timeline</h2>
                              <p className="text-xs text-[#166534] font-medium">Select a student from the dropdown to overlay their individual quiz performance timeline against the class average.</p>
                           </div>
                           <div className="w-full md:w-64">
                              <select 
                                 value={selectedReportStudent} 
                                 onChange={(e) => setSelectedReportStudent(e.target.value)} 
                                 className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-bold text-[#14532d] focus:outline-none focus:ring-2 focus:ring-[#EA580C]/25 shadow-sm"
                              >
                                 <option value="">-- Choose Student --</option>
                                 {currentStudents.map((st, i) => (
                                    <option key={i} value={st.name}>{st.name}</option>
                                 ))}
                              </select>
                           </div>
                        </div>

                        {selectedReportStudent ? (() => {
                           if (selectedStudentSubs.length === 0) {
                              return (
                                 <div className="bg-white rounded-[40px] py-20 text-center text-[#166534] font-bold italic border border-orange-100 shadow-sm">
                                    {selectedReportStudent} has not submitted any quizzes yet. 🎒
                                 </div>
                              );
                           }

                           return (
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                 {/* Statistics Block */}
                                 <div className="lg:col-span-4 flex flex-col gap-6">
                                    <div className="bg-white rounded-[40px] border border-orange-100 shadow-sm p-8 flex items-center justify-between">
                                       <div>
                                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Starting Accuracy</span>
                                          <span className="text-3xl font-black text-[#14532d]">{startingScore}%</span>
                                       </div>
                                       <div className="w-12 h-12 rounded-2xl bg-blue-50 flex-center text-blue-600 font-black">
                                          1st
                                       </div>
                                    </div>

                                    <div className="bg-white rounded-[40px] border border-orange-100 shadow-sm p-8 flex items-center justify-between">
                                       <div>
                                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Current Accuracy</span>
                                          <span className="text-3xl font-black text-[#14532d]">{currentScore}%</span>
                                       </div>
                                       <div className="w-12 h-12 rounded-2xl bg-orange-50 flex-center text-[#EA580C] font-black">
                                          Last
                                       </div>
                                    </div>

                                    <div className="bg-white rounded-[40px] border border-orange-100 shadow-sm p-8 flex items-center justify-between">
                                       <div>
                                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Growth Index</span>
                                          <div className="flex items-center gap-2">
                                             <span className={`text-3xl font-black ${growth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {growth >= 0 ? `+${growth}%` : `${growth}%`}
                                             </span>
                                             {growth >= 0 ? (
                                                <ArrowUpRight className="w-6 h-6 text-emerald-500" />
                                             ) : (
                                                <ArrowDownRight className="w-6 h-6 text-rose-500" />
                                             )}
                                          </div>
                                       </div>
                                       <div className={`w-12 h-12 rounded-2xl flex-center font-black ${growth >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                          {growth >= 0 ? '▲' : '▼'}
                                       </div>
                                    </div>
                                 </div>

                                 {/* Line Chart Component */}
                                 <div className="lg:col-span-8 bg-white rounded-[40px] border border-orange-100 shadow-sm p-8 space-y-6 flex flex-col justify-between">
                                    <div className="flex justify-between items-center">
                                       <h3 className="text-lg font-black text-slate-800">Performance Over Time</h3>
                                       <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-wider">
                                          <div className="flex items-center gap-1.5 text-[#EA580C]">
                                             <span className="w-3 h-3 rounded-full bg-[#EA580C] inline-block" />
                                             <span>{selectedReportStudent}</span>
                                          </div>
                                          <div className="flex items-center gap-1.5 text-[#FFAB91]">
                                             <span className="w-3 h-0.5 border-t-2 border-dashed border-[#FFAB91] inline-block" />
                                             <span>Class Average</span>
                                          </div>
                                       </div>
                                    </div>

                                    <div className="h-64 w-full">
                                       <ResponsiveContainer width="100%" height="100%">
                                          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                             <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                             <XAxis dataKey="name" stroke="#cbd5e1" style={{ fontSize: '10px', fontWeight: 'bold' }} />
                                             <YAxis domain={[0, 100]} stroke="#cbd5e1" style={{ fontSize: '10px', fontWeight: 'bold' }} />
                                             <RechartsTooltip 
                                                content={({ active, payload }) => {
                                                   if (active && payload && payload.length) {
                                                      const data = payload[0].payload;
                                                      return (
                                                         <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl text-xs space-y-1 font-bold">
                                                            <p className="text-[#EA580C] font-black">{data.title}</p>
                                                            <p className="text-slate-300">Date: {data.name}</p>
                                                            <p>Student Score: <span className="text-[#EA580C] font-black">{data.studentScore}%</span></p>
                                                            <p>Class Avg: <span className="text-[#FFAB91] font-black">{data.classAverage}%</span></p>
                                                         </div>
                                                      );
                                                   }
                                                   return null;
                                                }}
                                             />
                                             <Line type="monotone" dataKey="studentScore" stroke="#EA580C" strokeWidth={4} activeDot={{ r: 8 }} />
                                             <Line type="monotone" dataKey="classAverage" stroke="#FFAB91" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                                          </LineChart>
                                       </ResponsiveContainer>
                                    </div>
                                 </div>
                              </div>
                           );
                        })() : (
                           <div className="bg-white rounded-[40px] py-20 text-center text-[#166534] font-bold italic border border-orange-100 shadow-sm">
                              Please select a student from the dropdown menu to inspect chronological progress maps. 📈
                           </div>
                        )}
                     </div>
                  )}

                  {selectedReportTab === 'intervention' && (
                     <div className="space-y-8 animate-fadeIn">
                        <div className="bg-amber-50/50 border border-amber-100 rounded-[40px] p-8 flex gap-6">
                           <div className="w-12 h-12 shrink-0 bg-amber-400 rounded-2xl flex items-center justify-center text-white shadow-sm font-black text-xl">
                              ⚠️
                           </div>
                           <div className="space-y-2">
                              <h4 className="text-sm font-black text-amber-800 uppercase tracking-widest">Early Intervention Flags</h4>
                              <p className="text-amber-900 font-bold leading-relaxed text-xs">Students are flagged automatically for intervention if their quiz score average drops below <span className="font-black text-amber-700">65%</span> or if their quiz completion rate drops below <span className="font-black text-amber-700">70%</span> of all assigned classroom missions.</p>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {flaggedStudents.map((st, idx) => {
                              const isHighRisk = st.riskLevel === 'High Risk';
                              const badgeColor = isHighRisk 
                                 ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                                 : 'bg-amber-50 text-amber-600 border border-amber-100';

                              return (
                                 <div key={idx} className="bg-white border border-slate-100 shadow-sm rounded-[40px] p-8 flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                       <button 
                                          onClick={() => {
                                             setSelectedProfileStudent(st);
                                             setStudentProfileTab('mastery');
                                             setSelectedProfileSubmission(null);
                                          }}
                                          className="flex items-center gap-4 text-left focus:outline-none hover:opacity-85 transition-opacity"
                                       >
                                          <img src={getStudentAvatar(st.name)} className="w-12 h-12 rounded-full border-2 border-slate-50 bg-white p-0.5" alt={st.name} />
                                          <div className="space-y-0.5">
                                             <h3 className="text-base font-black text-slate-800 hover:text-[#EA580C] transition-colors">{st.name}</h3>
                                             <p className="text-[10px] font-bold text-slate-400">Classroom Student</p>
                                          </div>
                                       </button>
                                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${badgeColor}`}>
                                          {st.riskLevel}
                                       </span>
                                    </div>

                                    <div className="space-y-4">
                                       <div className="space-y-1.5">
                                          <div className="flex justify-between text-xs font-bold text-slate-500">
                                             <span>Average Quiz Grade</span>
                                             <span className={st.avgScore < 50 ? 'text-rose-500 font-black' : 'text-amber-600 font-black'}>{st.avgScore}%</span>
                                          </div>
                                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                             <div className={`h-full rounded-full ${st.avgScore < 50 ? 'bg-rose-400' : 'bg-amber-400'}`} style={{ width: `${st.avgScore}%` }} />
                                          </div>
                                       </div>

                                       <div className="space-y-1.5">
                                          <div className="flex justify-between text-xs font-bold text-slate-500">
                                             <span>Quiz Completion Rate</span>
                                             <span className={st.completionRate < 50 ? 'text-rose-500 font-black' : 'text-amber-600 font-black'}>{st.completionRate}%</span>
                                          </div>
                                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                             <div className={`h-full rounded-full ${st.completionRate < 50 ? 'bg-rose-400' : 'bg-amber-400'}`} style={{ width: `${st.completionRate}%` }} />
                                          </div>
                                       </div>

                                       <div className="bg-slate-50 p-4 rounded-2xl">
                                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Identified Learning Gap</span>
                                          <span className="text-xs font-black text-[#EA580C]">{st.primaryGap}</span>
                                       </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                       <button 
                                          onClick={() => {
                                             setRemediationModalStudent({ name: st.name, gapSubtopic: st.primaryGap });
                                             setRemediationMessageContent(`Hi ${st.name}! I noticed we could focus a bit more on "${st.primaryGap}". Let me know if you want to review this together! 🌟`);
                                          }}
                                          className="flex-1 bg-slate-50 border border-slate-100 text-slate-700 py-3 rounded-2xl text-xs font-black transition-colors hover:bg-slate-100"
                                       >
                                          📩 Direct Message
                                       </button>
                                       <button 
                                          onClick={() => handleRemediationTrigger(st, st.primaryGap)}
                                          className="flex-1 bg-[#EA580C] text-white py-3 rounded-2xl text-xs font-black hover:bg-[#C2410C] transition-colors shadow-lg shadow-orange-200"
                                       >
                                          ⚡ Remediation Homework
                                       </button>
                                    </div>
                                 </div>
                              );
                           })}
                           {flaggedStudents.length === 0 && (
                              <div className="col-span-2 bg-white rounded-[40px] py-16 text-center text-emerald-500 font-bold italic border border-orange-100 shadow-sm flex flex-col items-center justify-center space-y-4">
                                 <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex-center text-2xl">
                                    ✨
                                 </div>
                                 <p className="text-base font-black">All students are on track! No intervention flagged. 🌟</p>
                              </div>
                           )}
                        </div>
                     </div>
                  )}

                  <GrassBorder />
               </div>
            );
         }
         case 'Test Reports': {
             return (
               <div className="px-10 py-10 space-y-10 min-h-[calc(100vh-64px)] pb-40 relative">
                 <TestReportsDashboard
                   tests={allHomeworks.filter(hw => hw.type === 'test' && (!activeClassroom || hw.assignedClassId === activeClassroom.id))}
                   submissions={allSubmissions}
                   students={activeClassroom ? students : allStudents}
                 />
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
                        <h1 className="text-4xl font-black text-[#14532d] tracking-tight">Messages</h1>
                        <p className="text-sm font-bold text-[#166534] italic">Communicate with students and classrooms live.</p>
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
                        className="bg-[#EA580C] text-white px-8 py-4 rounded-3xl font-black text-sm shadow-xl shadow-orange-100 flex items-center gap-3 hover:scale-105 transition-all"
                     >
                        <Plus className="w-5 h-5" /> New Message
                     </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center gap-8 border-b border-orange-100 pb-4">
                     {['Inbox', 'Sent', 'Announcements'].map(tab => (
                        <button 
                           key={tab}
                           onClick={() => {
                              setMessagesTab(tab);
                              setActiveChat(null);
                           }}
                           className={`text-sm font-black transition-all relative py-2 ${messagesTab === tab ? 'text-[#EA580C]' : 'text-[#166534] hover:text-blue-500'}`}
                        >
                           {tab}
                           {messagesTab === tab && <motion.div layoutId="messages-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#EA580C] rounded-full" />}
                        </button>
                     ))}
                  </div>

                  <div className="grid grid-cols-12 gap-8 h-[600px]">
                     {/* Chat List */}
                     <div className="col-span-4 bg-white rounded-[40px] border border-orange-100 shadow-sm flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-orange-100">
                           <div className="relative">
                              <input type="text" placeholder="Search chats..." className="w-full bg-blue-50/50 border-none rounded-2xl py-3 px-10 text-xs font-bold text-blue-900 placeholder-blue-300" />
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#166534]" />
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
                                    <img src={getStudentAvatar(messagesTab === 'Inbox' ? msg.senderName : msg.recipientName)} className="w-12 h-12 rounded-full border-2 border-white shadow-sm bg-white p-0.5" alt="avatar" />
                                    <div className="flex-1 min-w-0">
                                       <div className="flex items-center justify-between">
                                          <p className="text-sm font-black text-[#14532d] truncate">
                                             {messagesTab === 'Inbox' ? msg.senderName : `To: ${msg.recipientName}`}
                                          </p>
                                          <span className="text-[9px] font-bold text-[#166534]">
                                             {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : ''}
                                          </span>
                                       </div>
                                       <p className="text-xs font-bold text-[#166534] truncate">{msg.content}</p>
                                    </div>
                                 </button>
                              ))
                           ) : (
                              <div className="py-20 text-center text-[#166534] font-bold italic text-sm">
                                 No messages in {messagesTab} yet.
                              </div>
                           )}
                        </div>
                     </div>

                     {/* Chat View */}
                     <div className="col-span-8 bg-white rounded-[40px] border border-orange-100 shadow-sm flex flex-col overflow-hidden bg-blue-50/5">
                        {currentChat ? (
                           <div className="flex flex-col h-full justify-between bg-white">
                              <div className="p-8 border-b border-orange-100 flex items-center justify-between bg-white">
                                 <div>
                                    <h3 className="text-lg font-black text-[#14532d]">{currentChat.subject}</h3>
                                    <p className="text-[10px] font-bold text-[#166534] uppercase tracking-widest mt-1">
                                       From: {currentChat.senderName} • To: {currentChat.recipientName} • {currentChat.createdAt ? new Date(currentChat.createdAt).toLocaleString() : ''}
                                    </p>
                                 </div>
                              </div>

                              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-slate-50/30">
                                 <div className="flex flex-col gap-4 max-w-[90%]">
                                    <div className="bg-[#FFEDD5] p-6 rounded-[32px] rounded-tl-none border border-blue-100 shadow-sm">
                                       <p className="text-sm font-bold text-[#14532d] leading-relaxed">
                                          {currentChat.content}
                                       </p>
                                    </div>
                                 </div>
                              </div>

                              {messagesTab === 'Inbox' && (
                                 <div className="p-6 border-t border-orange-100 flex items-center gap-4 bg-white">
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
                                       className="w-12 h-12 bg-[#EA580C] text-white rounded-2xl flex-center shadow-lg shadow-orange-100 hover:scale-105 transition-all"
                                    >
                                       <ArrowRight className="w-6 h-6" />
                                    </button>
                                 </div>
                              )}
                           </div>
                        ) : (
                           <div className="flex-1 flex flex-col items-center justify-center text-[#166534] font-bold italic text-sm gap-2">
                              <MessageSquare size={48} className="stroke-1 text-blue-200" />
                              <span>Select a chat to read & reply! 💌</span>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* New Message Popup Modal */}
                  {showNewMsgModal && (
                     <div className="fixed inset-0 bg-[#14532d]/20 backdrop-blur-sm z-[999] flex-center p-4">
                        <div className="bg-white rounded-[32px] border border-orange-100 w-full max-w-lg p-8 shadow-2xl relative">
                           <button 
                              onClick={() => setShowNewMsgModal(false)}
                              className="absolute top-6 right-6 text-[#166534] hover:text-blue-500 transition-all"
                           >
                              <X size={20} strokeWidth={3} />
                           </button>
                           <h3 className="text-2xl font-black text-[#14532d] mb-6 flex items-center gap-3">
                              <MessageSquare className="text-[#EA580C]" /> Create New Message
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
                                          className={`flex-1 py-2 rounded-xl text-xs font-black capitalize border transition-all ${newMsgRecipientType === type ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}
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
                                       className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-orange-50 transition-all"
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
                                       className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-orange-50 transition-all"
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
                                    className="w-full bg-white border border-blue-100 rounded-2xl py-3.5 px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-50 transition-all text-slate-700"
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
                                    className="w-full bg-white border border-blue-100 rounded-2xl py-3.5 px-5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-orange-50 transition-all text-slate-700 resize-none"
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
                                    className="flex-1 bg-[#EA580C] hover:bg-[#C2410C] text-white py-4 rounded-2xl font-black text-sm transition-colors shadow-lg shadow-orange-100"
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
                  normalizeName(sub.studentName) === normalizeName(student.name)
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

               const badges = (student.customBadges || []).map(b => ({
                  name: b.name || b.label,
                  desc: b.desc || b.description,
                  icon: b.icon || '🎖️',
                  color: b.color || 'bg-yellow-50 text-yellow-600 border-yellow-100',
                  isCustom: true
               }));
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
                  badges.push({ name: 'Homework Hero', desc: 'Completed 3+ quizzes', icon: '🏆', color: 'bg-green-50 text-green-600 border-green-200' });
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
                  const student = allStudents.find(s => normalizeName(s.name) === normalizeName(sub.studentName));
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
                        <h1 className="text-4xl font-black text-[#14532d] tracking-tight">Rewards</h1>
                        <p className="text-sm font-bold text-[#166534] italic">Motivate students with points and badges based on performance.</p>
                     </div>
                     <div className="flex items-center gap-6">
                        {/* Award Custom Badge Button */}
                        <button 
                           onClick={() => {
                              setSelectedStudentForBadge(null);
                              setBadgeIcon('🏆');
                              setBadgeColor('bg-amber-50 text-amber-600 border-amber-100');
                              setBadgeName('');
                              setBadgeDesc('');
                              setShowAwardBadgeModal(true);
                           }}
                           className="bg-[#EA580C] hover:bg-[#C2410C] text-white py-3 px-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-md flex items-center gap-2 hover:scale-105 active:scale-95"
                        >
                           <Award className="w-4 h-4" /> Award Custom Badge
                        </button>
                        {/* Class/Grade filter dropdown */}
                        <div className="flex items-center gap-3 bg-white border border-orange-100 py-3 px-5 rounded-2xl shadow-sm">
                           <span className="text-[10px] font-black uppercase text-[#166534] tracking-wider">Grade</span>
                           <select 
                              value={filterClass} 
                              onChange={(e) => setFilterClass(e.target.value)}
                              className="bg-transparent border-none text-xs font-black text-[#14532d] focus:outline-none cursor-pointer"
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
                  <div className="flex items-center gap-8 border-b border-orange-100 pb-4">
                     {['Overview', 'Badges', 'Leaderboard'].map(tab => (
                        <button 
                           key={tab}
                           onClick={() => setRewardsTab(tab)}
                           className={`text-sm font-black transition-all relative py-2 ${rewardsTab === tab ? 'text-[#EA580C]' : 'text-[#166534] hover:text-blue-500'}`}
                        >
                           {tab}
                           {rewardsTab === tab && <motion.div layoutId="rewards-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#EA580C] rounded-full" />}
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
                           <div className="col-span-7 bg-white rounded-[40px] border border-orange-100 shadow-sm p-10 space-y-8">
                              <h3 className="text-xl font-black text-[#14532d] tracking-tight">Recent Rewards</h3>
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
                                                <img src={getStudentAvatar(sub.studentName)} className="w-12 h-12 rounded-full border-2 border-white shadow-sm bg-white p-0.5" alt={sub.studentName} />
                                                <div>
                                                   <p className="text-sm font-black text-[#14532d]">{sub.studentName}</p>
                                                   <p className="text-[10px] font-bold text-[#166534] italic">{getScoreFeedback(sub.score)} (Scored {sub.score}%)</p>
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
                                    <div className="py-20 text-center text-[#166534] font-bold italic text-sm">
                                       No homework submissions to reward yet! 🌟
                                    </div>
                                 )}
                              </div>
                           </div>

                           {/* Top Badges */}
                           <div className="col-span-5 bg-white rounded-[40px] border border-orange-100 shadow-sm p-10 flex flex-col justify-between">
                              <div className="space-y-8">
                                 <h3 className="text-xl font-black text-[#14532d] tracking-tight">Badge Distribution</h3>
                                 <div className="space-y-6">
                                    <BadgeRow name="Maths Whiz" count={badgeCounts['Maths Whiz']} icon={<Zap className="w-5 h-5 text-blue-400 fill-current" />} color="bg-blue-50" />
                                    <BadgeRow name="Science Explorer" count={badgeCounts['Science Explorer']} icon={<Zap className="w-5 h-5 text-emerald-400 fill-current" />} color="bg-emerald-50" />
                                    <BadgeRow name="Super Writer" count={badgeCounts['Super Writer']} icon={<Zap className="w-5 h-5 text-amber-400 fill-current" />} color="bg-amber-50" />
                                    <BadgeRow name="Homework Hero" count={badgeCounts['Homework Hero']} icon={<Star className="w-5 h-5 text-green-500 fill-current" />} color="bg-green-50" />
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
                           { name: 'Homework Hero', desc: 'Completed at least 3 homework assignments.', icon: '🏆', color: 'bg-green-50 border-green-200 text-green-600' },
                           { name: 'Rising Star', desc: 'Earned by student after submitting their first homework quiz.', icon: '⭐', color: 'bg-rose-50 border-rose-100 text-rose-600' }
                        ].map((badge) => {
                           const earners = computedStudents.filter(s => s.badges.some(b => b.name === badge.name));

                           return (
                              <div key={badge.name} className="bg-white rounded-[40px] border border-orange-100 shadow-sm p-10 space-y-6 flex flex-col justify-between">
                                 <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                       <span className="text-4xl">{badge.icon}</span>
                                       <div>
                                          <h4 className="text-lg font-black text-[#14532d]">{badge.name}</h4>
                                          <p className="text-xs font-bold text-[#166534] italic">{badge.desc}</p>
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
                                             <span className="text-[#166534] font-bold text-xs italic">No students have unlocked this yet! Keep going! 🚀</span>
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
                     <div className="bg-white rounded-[40px] border border-orange-100 shadow-sm overflow-hidden">
                        <div className="grid grid-cols-12 px-8 py-6 bg-blue-50/20 text-[10px] font-black text-blue-200 uppercase tracking-widest border-b border-orange-100">
                           <div className="col-span-1 text-center">Rank</div>
                           <div className="col-span-3">Student Name</div>
                           <div className="col-span-2 text-center">Class / Grade</div>
                           <div className="col-span-2 text-center">Quizzes Done</div>
                           <div className="col-span-1 text-center">Avg Score</div>
                           <div className="col-span-2 text-right pr-4">Total Points</div>
                           <div className="col-span-1 text-center">Actions</div>
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
                                       <div className="col-span-3 flex items-center gap-3">
                                          <img src={getStudentAvatar(student.name)} className="w-10 h-10 rounded-full border border-slate-100 bg-white p-0.5" alt={student.name} />
                                          <div>
                                             <p className="font-black text-[#14532d]">{student.name}</p>
                                             <div className="flex gap-1.5 mt-0.5">
                                                {student.badges.map(b => (
                                                   <span key={b.name} title={b.desc} className="cursor-help">{b.icon}</span>
                                                ))}
                                             </div>
                                          </div>
                                       </div>
                                       <div className="col-span-2 text-center text-xs font-black text-[#166534]">{student.className}</div>
                                       <div className="col-span-2 text-center text-xs font-black">{student.completedCount}</div>
                                       <div className="col-span-1 text-center text-xs font-black text-emerald-500">{student.avgScore}%</div>
                                       <div className="col-span-2 text-right pr-4 font-black text-[#EA580C]">{student.points}</div>
                                       <div className="col-span-1 flex justify-center">
                                          <button
                                             onClick={() => {
                                                setSelectedStudentForBadge(student);
                                                setBadgeIcon('🏆');
                                                setBadgeColor('bg-amber-50 text-amber-600 border-amber-100');
                                                setBadgeName('');
                                                setBadgeDesc('');
                                                setShowAwardBadgeModal(true);
                                             }}
                                             title="Award Badge"
                                             className="w-8 h-8 rounded-full bg-blue-50 text-[#EA580C] hover:bg-[#EA580C] hover:text-white flex-center transition-all hover:scale-110 active:scale-95"
                                          >
                                             <Award className="w-4 h-4" />
                                          </button>
                                       </div>
                                    </div>
                                 );
                              })
                           ) : (
                              <div className="py-20 text-center text-[#166534] font-bold italic text-sm">
                                 No students in this class roster yet. Add students to get started! 🍎
                              </div>
                           )}
                        </div>
                     </div>
                  )}
               </div>
            );
         }

          case 'Class Goals': {
             if (!activeClassroom) {
                return (
                   <div className="px-10 py-20 text-center text-[#166534] font-bold italic text-sm">
                      Please select a class to view and configure collaborative goals! 🏆
                   </div>
                );
             }

             // Calculate classroom combined points
             const classStudents = allStudents.filter(s => s.classId === activeClassroom.id);
             const computedStudents = classStudents.map(student => {
                const studentSubs = allSubmissions.filter(sub => 
                   normalizeName(sub.studentName) === normalizeName(student.name)
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
                         <h1 className="text-4xl font-black text-[#14532d] tracking-tight">Classroom Collaborative Goals</h1>
                         <p className="text-sm font-bold text-[#166534] italic">Work together as a team to reach point goals and unlock class-wide prizes!</p>
                      </div>
                      <div className="w-24 h-24">
                         <img src="/mascot.png" className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl animate-float" alt="Mascot" />
                      </div>
                   </div>

                   <div className="grid grid-cols-12 gap-10">
                      {/* Goal Thermometer */}
                      <div className="col-span-8 bg-white rounded-[40px] border border-orange-100 shadow-sm p-10 space-y-8 flex flex-col justify-between">
                         <div className="space-y-4">
                            <div className="flex justify-between items-center">
                               <div>
                                  <span className="text-[10px] font-black uppercase text-green-500 tracking-wider">Active Classroom Goal</span>
                                  <h3 className="text-2xl font-black text-[#14532d]">{targetTitle}</h3>
                               </div>
                               <button 
                                  onClick={() => {
                                     setNewGoalTitle(targetTitle);
                                     setNewGoalTarget(targetGoal);
                                     setNewGoalTrack(activeClassroom?.activeTrack || 'auto');
                                     setIsEditingGoal(true);
                                  }}
                                  className="px-4 py-2 border-2 border-green-200 hover:border-green-200 text-[#EA580C] rounded-2xl text-xs font-black transition-all bg-white"
                               >
                                  Customize Goal ✏️
                               </button>
                            </div>

                            <div className="pt-6 space-y-4">
                               <div className="flex justify-between text-sm font-black text-[#14532d]">
                                  <span>Class Combined Points</span>
                                  <span>{currentClassPoints} / {targetGoal} Points</span>
                               </div>
                               
                               {/* Boutique Thermometer Progress Bar */}
                               <div className="h-8 w-full bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden p-1 shadow-inner relative flex items-center">
                                  <div 
                                     className="h-full rounded-2xl bg-gradient-to-r from-[#EA580C] to-pink-400 transition-all duration-1000 flex items-center justify-end pr-4 shadow-[0_0_12px_rgba(138,112,255,0.3)]"
                                     style={{ width: `${progressPercent}%` }}
                                  >
                                     <span className="text-[9px] font-black text-white uppercase tracking-wider">{progressPercent}%</span>
                                  </div>
                               </div>
                            </div>
                         </div>

                         <div className="bg-green-50/50 rounded-3xl p-6 border border-green-200/50 flex items-center gap-4">
                            <span className="text-4xl">🎉</span>
                            <div>
                               <p className="text-sm font-black text-[#14532d]">Goal Progress Message</p>
                               <p className="text-xs font-bold text-blue-400 italic">
                                  {progressPercent >= 100 
                                     ? `Incredible! Your class reached the goal! The Dino party is unlocked on their student panels! 🎈🦖`
                                     : `You need ${targetGoal - currentClassPoints} more points to unlock this prize. Keep submitting homework quizzes!`}
                               </p>
                            <p className="text-xs font-bold text-[#166534] italic">{progressPercent >= 100 ? 'Unlocked & Active! 🦕' : 'Goal Locked'}</p>
                         </div>
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
                         <h1 className="text-4xl font-black text-[#14532d] tracking-tight">Homework Planner Calendar</h1>
                         <p className="text-sm font-bold text-[#166534] italic">Schedule assignments, track deadlines, and send live reminder pings.</p>
                      </div>
                      <div className="w-24 h-24">
                         <img src="/mascot.png" className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl animate-float" alt="Mascot" />
                      </div>
                   </div>

                   <div className="bg-white rounded-[40px] border border-orange-100 shadow-sm p-10 space-y-8">
                      <div className="flex justify-between items-center border-b border-slate-50 pb-6">
                         <h3 className="text-xl font-black text-[#14532d]">May 2026</h3>
                         <span className="text-[10px] font-black uppercase text-[#166534] tracking-wider">Active Classroom: {activeClassroom?.name || 'All Classes'}</span>
                      </div>

                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-4">
                         {/* Day headers */}
                         {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                            <div key={day} className="text-center text-[10px] font-black text-[#166534] uppercase tracking-widest py-2">{day}</div>
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
                                  <span className="text-xs font-black text-[#14532d]">{day}</span>
                                  
                                  {activeHw && (
                                     <div className="bg-[#FFEDD5] border border-green-200/60 p-2 rounded-xl text-[9px] font-black text-green-600 truncate shadow-sm mt-2 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-400" />
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
           case 'My Prompts': {
              return (
                 <div className="px-10 py-10 space-y-10 min-h-[calc(100vh-64px)] pb-40 relative">
                    {/* Top Header */}
                    <div className="flex items-center justify-between">
                       <div>
                          <h1 className="text-4xl font-black text-[#14532d] tracking-tight">My AI Prompts</h1>
                          <p className="text-sm font-bold text-[#166534] italic">Configure default templates that automatically pre-fill the Magic Quiz Builder when a subject is chosen.</p>
                       </div>
                    </div>

                    {/* Main Form container */}
                    <div className="grid grid-cols-12 gap-8 items-start">
                       {/* Left: Prompts List */}
                       <div className="col-span-8 space-y-6">
                          {Object.keys(subjectPrompts).length > 0 ? (
                             Object.keys(subjectPrompts).map(subKey => (
                                <div key={subKey} className="bg-white rounded-[32px] border border-orange-100 shadow-sm p-6 space-y-4 hover:shadow-md transition-all relative overflow-hidden group">
                                   <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                         <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 font-black text-xs uppercase shadow-sm">
                                            {subKey.slice(0, 3)}
                                         </div>
                                         <h3 className="text-base font-black text-[#14532d] capitalize">{subKey}</h3>
                                      </div>
                                      <button 
                                         onClick={() => handleDeleteSubject(subKey)}
                                         className="text-red-400 hover:text-red-600 transition-colors w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50"
                                         title="Delete Subject"
                                      >
                                         <Trash2 className="w-4 h-4" />
                                      </button>
                                   </div>
                                   <div className="relative">
                                      <textarea 
                                         value={subjectPrompts[subKey]}
                                         onChange={(e) => setSubjectPrompts(prev => ({ ...prev, [subKey]: e.target.value }))}
                                         className="w-full h-32 bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-slate-700 font-bold outline-none focus:border-green-400 transition-colors resize-none text-xs"
                                         placeholder={`Enter generic prompt for ${subKey}...`}
                                      />
                                   </div>
                                </div>
                             ))
                          ) : (
                             <div className="text-center py-20 bg-white rounded-[32px] border border-orange-100">
                                <p className="text-[#166534] font-bold italic">No generic prompts configured. Add a subject on the right!</p>
                             </div>
                          )}

                          {/* Save Button */}
                          <div className="flex justify-end pt-4">
                             <button
                                onClick={handleSavePrompts}
                                disabled={isSavingPrompts}
                                className="bg-orange-600 hover:bg-orange-500 text-white font-black py-4 px-10 rounded-[24px] shadow-lg shadow-orange-100 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                             >
                                {isSavingPrompts ? 'Saving...' : 'Save All Prompts ✨'}
                             </button>
                          </div>
                       </div>

                       {/* Right: Add Subject Controls */}
                       <div className="col-span-4 bg-white rounded-[32px] border border-orange-100 shadow-sm p-6 space-y-6">
                          <div className="space-y-2">
                             <h3 className="text-lg font-black text-[#14532d]">Add New Subject</h3>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Create a custom prompt section</p>
                          </div>

                          <div className="space-y-4">
                             <div className="space-y-1">
                                <label className="text-xs font-black text-slate-500 block ml-1">Subject Name</label>
                                <input 
                                   type="text"
                                   value={newSubjectName}
                                   onChange={(e) => setNewSubjectName(e.target.value)}
                                   placeholder="e.g. History"
                                   className="w-full bg-slate-50 border border-slate-100 p-3.5 rounded-2xl text-xs font-semibold text-[#475569] shadow-inner focus:border-green-400 outline-none transition-all"
                                />
                             </div>
                             <button
                                onClick={handleAddSubject}
                                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-3.5 rounded-2xl shadow-md hover:scale-[1.02] active:scale-95 transition-all text-xs"
                             >
                                Create Subject Card ➕
                             </button>
                          </div>
                       </div>
                    </div>

                    <GrassBorder />
                 </div>
              );
           }
         case 'Tuition Fees': {
            return (
               <div className="px-10 py-10 space-y-8 min-h-[calc(100vh-64px)] pb-40">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                     <div>
                        <h1 className="text-4xl font-black text-[#14532d] tracking-tight flex items-center gap-3">
                           <CreditCard className="w-9 h-9 text-green-500" />
                           Tuition & Fees
                        </h1>
                        <p className="text-sm font-bold text-[#166534] italic mt-1">
                           Set prices for each payment plan. Changes are reflected immediately on the student payment page.
                        </p>
                     </div>
                     <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                        <div className="flex flex-col items-end mr-2">
                           <label className="text-[9px] font-black uppercase text-slate-400 mb-1">Currency</label>
                           <select 
                              value={tuitionCurrency}
                              onChange={(e) => setTuitionCurrency(e.target.value)}
                              className="bg-white border-2 border-slate-200 text-[#3C2E75] text-xs font-black rounded-xl px-3 py-1.5 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all cursor-pointer"
                           >
                              <option value="USD">USD ($)</option>
                              <option value="EUR">EUR (€)</option>
                              <option value="GBP">GBP (£)</option>
                              <option value="AUD">AUD (A$)</option>
                              <option value="CAD">CAD (C$)</option>
                              <option value="NZD">NZD (NZ$)</option>
                              <option value="INR">INR (₹)</option>
                              <option value="ZAR">ZAR (R)</option>
                              <option value="SGD">SGD (S$)</option>
                           </select>
                        </div>
                        <button
                           onClick={handleSaveTuitionFees}
                           disabled={isSavingFees}
                           className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg transition-all ${
                              feesSaved
                                 ? 'bg-emerald-500 text-white shadow-emerald-200'
                                 : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-200 hover:scale-[1.02] active:scale-95'
                           } disabled:opacity-50`}
                        >
                           {isSavingFees ? (
                              <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</>
                           ) : feesSaved ? (
                              <><CheckCircle className="w-4 h-4" /> Saved!</>
                           ) : (
                              <><Save className="w-4 h-4" /> Save Fees</>
                           )}
                        </button>
                     </div>
                  </div>

                  {/* Info banner */}
                  <div className="bg-green-50 border border-green-350 rounded-[24px] p-5 flex items-center gap-4">
                     <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center shrink-0">
                        <DollarSign className="w-5 h-5 text-orange-600" />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-orange-800">Live Pricing</p>
                        <p className="text-xs text-orange-600 font-medium mt-0.5">
                           Prices are saved to your account and loaded on the student payment page in real-time. Students will always see the latest prices you set here.
                        </p>
                     </div>
                  </div>

                  {/* Package Cards Grid */}
                  <div className="grid grid-cols-2 gap-6">
                     {tuitionPackages.map((pkg) => (
                        <div
                           key={pkg.id}
                           className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-7 space-y-5 hover:shadow-md transition-all relative overflow-hidden group"
                        >
                           {/* Glow accent */}
                           <div className="absolute -top-8 -right-8 w-28 h-28 bg-green-100 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-all" />

                           {/* Icon & Label row */}
                           <div className="flex items-center gap-3 relative z-10">
                              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                                 {pkg.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Package Name</label>
                                 <input
                                    type="text"
                                    value={pkg.label}
                                    onChange={(e) => updatePackage(pkg.id, 'label', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
                                 />
                              </div>
                           </div>

                           {/* Description */}
                           <div className="relative z-10">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Description</label>
                              <input
                                 type="text"
                                 value={pkg.description}
                                 onChange={(e) => updatePackage(pkg.id, 'description', e.target.value)}
                                 className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-600 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
                              />
                           </div>

                           {/* Price */}
                           <div className="relative z-10">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Price ({tuitionCurrency})</label>
                              <div className="relative">
                                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-slate-400">{CURRENCIES[tuitionCurrency] || '$'}</span>
                                 <input
                                    type="number"
                                    min="1"
                                    max="10000"
                                    step="0.01"
                                    value={pkg.amount}
                                    onChange={(e) => updatePackage(pkg.id, 'amount', parseFloat(e.target.value) || 0)}
                                    className="w-full pl-9 pr-4 py-3 bg-gradient-to-r from-green-50 to-orange-50 border-2 border-green-200 rounded-xl text-xl font-black text-orange-800 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
                                 />
                              </div>
                           </div>

                           {/* Live preview */}
                           <div className="relative z-10 bg-gradient-to-br from-slate-50 to-orange-50/50 rounded-2xl p-4 border border-slate-100">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Student Preview</p>
                              <div className="flex items-center justify-between">
                                 <div>
                                    <p className="text-sm font-bold text-slate-800">{pkg.label || 'Package Name'}</p>
                                    <p className="text-xs text-slate-400 font-medium mt-0.5">{pkg.description || 'Description'}</p>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-2xl font-black text-slate-800">{CURRENCIES[tuitionCurrency] || '$'}{pkg.amount}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">{tuitionCurrency}</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>


                  <GrassBorder />
               </div>
            );
         }

         case 'Revenue': {
            const filteredAllStudents = revenueClassFilter === 'All Classes'
               ? allStudents
               : allStudents.filter(s => s.className === revenueClassFilter);

            const activeStudents = filteredAllStudents.filter(s => s.status !== 'paused');
            
            // Expected revenue for 1 month
            const expectedRevenueMonthly = activeStudents.reduce((sum, student) => {
               const pkgId = student.preferredPackage || 'monthly';
               const pkg = getPackagesForStudent(student).find(p => p.id === pkgId);
               return sum + (pkg ? pkg.amount : 180);
            }, 0);

            // Filter payments for selected year
            const yearPayments = payments.filter(p => {
               const d = new Date(p.paidAt);
               const y = p.year || d.getFullYear();
               const matchesYear = y === revenueYear;
               if (!matchesYear) return false;
               if (revenueClassFilter === 'All Classes') return true;
               return p.classroomName === revenueClassFilter || (p.studentName && filteredAllStudents.some(s => s.name.trim().toLowerCase() === p.studentName.trim().toLowerCase()));
            });

            // Filter payments for selected month & year
            const monthlyPayments = yearPayments.filter(p => {
               const d = new Date(p.paidAt);
               const m = p.month || (d.getMonth() + 1);
               return m === revenueMonth;
            });

            const displayPayments = revenueMode === 'Monthly' ? monthlyPayments : yearPayments;
            const collectedRevenue = displayPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

            const monthsElapsed = revenueYear === new Date().getFullYear() ? (new Date().getMonth() + 1) : 12;
            const expectedRevenue = revenueMode === 'Monthly' ? expectedRevenueMonthly : (expectedRevenueMonthly * monthsElapsed);

            const collectionRate = expectedRevenue > 0 ? Math.round((collectedRevenue / expectedRevenue) * 100) : 0;

            // List of students with payment info for the selected period
            const studentRoster = filteredAllStudents.map(student => {
               const isStudentPaused = student.status === 'paused';
               
               // Payments matching this student in selected period
               const studentPayments = displayPayments.filter(p => {
                  return p.studentName && p.studentName.trim().toLowerCase() === student.name.trim().toLowerCase();
               });

               const isPaid = studentPayments.length > 0;
               const totalPaid = studentPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

               const pkgId = student.preferredPackage || 'monthly';
               const pkg = getPackagesForStudent(student).find(p => p.id === pkgId);
               const defaultPrice = pkg ? pkg.amount : 180;

               return {
                  ...student,
                  isPaid,
                  totalPaid,
                  studentPayments,
                  preferredPackageId: pkgId,
                  defaultPrice,
                  isStudentPaused
               };
            });

            const paidCount = studentRoster.filter(s => !s.isStudentPaused && s.isPaid).length;
            const activeCount = studentRoster.filter(s => !s.isStudentPaused).length;

            const months = [
               { name: "January", val: 1 },
               { name: "February", val: 2 },
               { name: "March", val: 3 },
               { name: "April", val: 4 },
               { name: "May", val: 5 },
               { name: "June", val: 6 },
               { name: "July", val: 7 },
               { name: "August", val: 8 },
               { name: "September", val: 9 },
               { name: "October", val: 10 },
               { name: "November", val: 11 },
               { name: "December", val: 12 }
            ];

            return (
               <div className="px-10 py-10 space-y-8 min-h-[calc(100vh-64px)] pb-40">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                     <div>
                        <h1 className="text-4xl font-black text-[#14532d] tracking-tight flex items-center gap-3">
                           <TrendingUp className="w-9 h-9 text-emerald-500" />
                           Revenue Report
                        </h1>
                        <p className="text-sm font-bold text-[#166534] italic mt-1">
                           Track tuition payments, view monthly/YTD revenue, and manage student payment status.
                        </p>
                     </div>

                     {/* Filters Container */}
                     <div className="flex items-center gap-3 bg-white rounded-2xl p-2 border border-slate-100 shadow-sm">
                        {/* Class/Grade filter dropdown */}
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl">
                           <span className="text-[10px] font-black uppercase text-[#166534] tracking-wider">Grade</span>
                           <select 
                              value={revenueClassFilter} 
                              onChange={(e) => {
                                 const val = e.target.value;
                                 setRevenueClassFilter(val);
                                 if (val === 'All Classes') {
                                    setActiveClassroom(null);
                                 } else {
                                    const match = classrooms.find(c => c.name === val);
                                    if (match) setActiveClassroom(match);
                                 }
                              }}
                              className="bg-transparent border-none text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                           >
                              <option value="All Classes">All Classes</option>
                              {classrooms.map(c => (
                                 <option key={c.id} value={c.name}>{c.name}</option>
                              ))}
                           </select>
                        </div>

                        {/* Toggle Mode */}
                        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                           <button
                              onClick={() => setRevenueMode('Monthly')}
                              className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                                 revenueMode === 'Monthly'
                                    ? 'bg-white text-slate-800 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600'
                              }`}
                           >
                              Monthly
                           </button>
                           <button
                              onClick={() => setRevenueMode('YTD')}
                              className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                                 revenueMode === 'YTD'
                                    ? 'bg-white text-slate-800 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600'
                              }`}
                           >
                              YTD (Year to Date)
                           </button>
                        </div>

                        {/* Month Selector (only visible in Monthly mode) */}
                        {revenueMode === 'Monthly' && (
                           <select
                              value={revenueMonth}
                              onChange={(e) => setRevenueMonth(parseInt(e.target.value))}
                              className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
                           >
                              {months.map(m => (
                                 <option key={m.val} value={m.val}>{m.name}</option>
                              ))}
                           </select>
                        )}

                        {/* Year Selector */}
                        <select
                           value={revenueYear}
                           onChange={(e) => setRevenueYear(parseInt(e.target.value))}
                           className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
                        >
                           {[2025, 2026, 2027, 2028].map(y => (
                              <option key={y} value={y}>{y}</option>
                           ))}
                        </select>
                     </div>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-4 gap-6">
                     {/* Revenue Collected */}
                     <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 relative overflow-hidden group">
                        <div className="absolute -top-6 -right-6 w-20 h-20 bg-emerald-50 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                        <div className="relative z-10 flex items-center justify-between">
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Revenue Collected</p>
                              <p className="text-3xl font-black text-emerald-600 tracking-tight mt-1">
                                 {CURRENCIES[tuitionCurrency] || '$'}{collectedRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </p>
                              <p className="text-[10px] text-slate-400 font-bold mt-1">
                                 {revenueMode === 'Monthly' ? 'For this month' : `YTD for ${revenueYear}`}
                              </p>
                           </div>
                           <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                              <DollarSign className="w-6 h-6 text-emerald-500" />
                           </div>
                        </div>
                     </div>

                     {/* Expected Revenue */}
                     <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 relative overflow-hidden group">
                        <div className="absolute -top-6 -right-6 w-20 h-20 bg-blue-50 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                        <div className="relative z-10 flex items-center justify-between">
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Expected Revenue</p>
                              <p className="text-3xl font-black text-[#14532d] tracking-tight mt-1">
                                 {CURRENCIES[tuitionCurrency] || '$'}{expectedRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </p>
                              <p className="text-[10px] text-slate-400 font-bold mt-1">
                                 Based on active student packages
                              </p>
                           </div>
                           <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                              <TrendingUp className="w-6 h-6 text-blue-500" />
                           </div>
                        </div>
                     </div>

                     {/* Collection Rate */}
                     <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 relative overflow-hidden group">
                        <div className="absolute -top-6 -right-6 w-20 h-20 bg-green-50 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                        <div className="relative z-10 flex items-center justify-between">
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Collection Rate</p>
                              <p className="text-3xl font-black text-orange-600 tracking-tight mt-1">
                                 {collectionRate}%
                              </p>
                              <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                 <div className="h-full bg-green-500 rounded-full" style={{ width: `${collectionRate}%` }} />
                              </div>
                           </div>
                           <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                              <Activity className="w-6 h-6 text-green-500" />
                           </div>
                        </div>
                     </div>

                     {/* Paid Students Ratio */}
                     <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 relative overflow-hidden group">
                        <div className="absolute -top-6 -right-6 w-20 h-20 bg-amber-50 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                        <div className="relative z-10 flex items-center justify-between">
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Paid Students</p>
                              <p className="text-3xl font-black text-amber-600 tracking-tight mt-1">
                                 {paidCount} / {activeCount}
                              </p>
                              <p className="text-[10px] text-slate-400 font-bold mt-1">
                                 {activeCount - paidCount} students remaining
                              </p>
                           </div>
                           <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                              <Users className="w-6 h-6 text-amber-500" />
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* YTD Monthly Breakdown Bar Chart Grid */}
                  {revenueMode === 'YTD' && (
                     <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 space-y-6">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                           <Calendar className="w-5 h-5 text-orange-500" />
                           {revenueYear} Monthly Revenue Breakdown
                        </h2>
                        <div className="grid grid-cols-6 gap-4">
                           {months.map(m => {
                              const monthPayments = yearPayments.filter(p => {
                                 const d = new Date(p.paidAt);
                                 const month = p.month || (d.getMonth() + 1);
                                 return month === m.val;
                              });
                              const monthCollected = monthPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
                              const isFuture = revenueYear === new Date().getFullYear() && m.val > (new Date().getMonth() + 1);

                              return (
                                 <div
                                    key={m.val}
                                    className={`p-4 rounded-2xl border text-center transition-all ${
                                       isFuture 
                                          ? 'bg-slate-50 border-slate-100 opacity-50'
                                          : monthCollected > 0
                                          ? 'bg-emerald-50/30 border-emerald-100 hover:border-emerald-200'
                                          : 'bg-white border-slate-100 hover:border-slate-200'
                                    }`}
                                 >
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{m.name.slice(0, 3)}</p>
                                    <p className={`text-base font-black mt-1 ${monthCollected > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                       ${monthCollected.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </p>
                                    <div className="w-full bg-slate-100 h-1 rounded-full mt-2.5 overflow-hidden">
                                       <div 
                                          className="h-full bg-emerald-500" 
                                          style={{ width: `${Math.min(100, expectedRevenueMonthly > 0 ? (monthCollected / expectedRevenueMonthly) * 100 : 0)}%` }} 
                                       />
                                    </div>
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  )}

                  {/* Student Payment Roster */}
                  <div className="bg-white rounded-[40px] border border-orange-100 shadow-sm overflow-hidden">
                     {/* Roster Header */}
                     <div className="px-8 py-5 bg-blue-50/10 border-b border-orange-100 flex items-center justify-between">
                        <div>
                           <h3 className="text-base font-bold text-slate-800">Student Tuition Tracking</h3>
                           <p className="text-xs text-slate-400 font-medium">Record or view payments for each student</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-1.5 text-xs font-bold text-slate-500">
                           {revenueMode === 'Monthly' 
                              ? `Roster for ${months.find(m => m.val === revenueMonth)?.name} ${revenueYear}`
                              : `Annual Roster YTD ${revenueYear}`
                           }
                        </div>
                     </div>

                     {/* Roster List Header */}
                     <div className="grid grid-cols-12 px-8 py-4 bg-blue-50/20 text-[10px] font-black text-blue-200 uppercase tracking-widest border-b border-orange-100">
                        <div className="col-span-3">Student Name</div>
                        <div className="col-span-3">Assigned Package</div>
                        <div className="col-span-2">Price ({tuitionCurrency})</div>
                        <div className="col-span-2">Payment Status</div>
                        <div className="col-span-2 text-right pr-4">Action</div>
                     </div>

                     {/* Roster list */}
                     <div className="divide-y divide-blue-50">
                        {studentRoster.map((student, idx) => {
                           const customAmount = customAmountInputs[student.id] || '';
                           const selectedPkgId = student.preferredPackageId;
                           const isCustom = selectedPkgId === 'custom';

                           return (
                              <div
                                 key={idx}
                                 className={`grid grid-cols-12 px-8 py-5 items-center transition-all ${
                                    student.isStudentPaused
                                       ? 'bg-rose-50/20 opacity-60'
                                       : student.isPaid
                                       ? 'bg-emerald-50/10'
                                       : 'hover:bg-blue-50/5'
                                 }`}
                              >
                                 {/* Student info */}
                                 <div className="col-span-3 flex items-center gap-3">
                                    <div className="relative shrink-0">
                                       <img
                                          src={getStudentAvatar(student.name)}
                                          className={`w-9 h-9 rounded-full border bg-white p-0.5 ${
                                             student.isStudentPaused ? 'border-rose-200 grayscale' : 'border-slate-200'
                                          }`}
                                          alt={student.name}
                                       />
                                    </div>
                                    <div className="min-w-0">
                                       <p className={`text-sm font-bold truncate ${student.isStudentPaused ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                          {student.name}
                                       </p>
                                       <p className="text-[10px] font-bold text-slate-400">Class: {student.className}</p>
                                    </div>
                                 </div>

                                 {/* Assigned package */}
                                 <div className="col-span-3 pr-4">
                                    <select
                                       value={student.preferredPackageId}
                                       disabled={student.isStudentPaused || student.isPaid}
                                       onChange={(e) => handleUpdateStudentPreferredPackage(student, e.target.value)}
                                       className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-green-300 disabled:bg-slate-100 disabled:text-slate-400 transition-all"
                                    >
                                       {getPackagesForStudent(student).map(pkg => (
                                          <option key={pkg.id} value={pkg.id}>
                                             {pkg.label} (${pkg.amount})
                                          </option>
                                       ))}
                                       <option value="custom">Custom Amount</option>
                                    </select>
                                 </div>

                                 {/* Price / Custom value */}
                                 <div className="col-span-2">
                                    {isCustom && !student.isPaid ? (
                                       <div className="relative w-24">
                                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">$</span>
                                          <input
                                             type="number"
                                             min="0"
                                             placeholder="Amount"
                                             value={customAmount}
                                             disabled={student.isStudentPaused}
                                             onChange={(e) => setCustomAmountInputs(prev => ({ ...prev, [student.id]: e.target.value }))}
                                             className="w-full pl-6 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-green-300"
                                          />
                                       </div>
                                    ) : (
                                       <span className="text-sm font-black text-slate-800">
                                          ${student.isPaid ? student.totalPaid : student.defaultPrice}
                                       </span>
                                    )}
                                 </div>

                                 {/* Payment status */}
                                 <div className="col-span-2">
                                    {student.isStudentPaused ? (
                                       <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-500 bg-rose-50 border border-rose-100 rounded-full px-2.5 py-1">
                                          <Lock className="w-3 h-3" /> Suspended
                                       </span>
                                    ) : student.isPaid ? (
                                       <div>
                                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
                                             <CheckCircle className="w-3 h-3 text-emerald-500 fill-emerald-50 shadow-sm" /> Paid
                                          </span>
                                          {student.studentPayments[0] && (
                                             <p className="text-[9px] text-slate-400 font-bold mt-1">
                                                Paid {new Date(student.studentPayments[0].paidAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                             </p>
                                          )}
                                       </div>
                                    ) : (
                                       <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
                                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Unpaid
                                       </span>
                                    )}
                                 </div>

                                 {/* Action button */}
                                 <div className="col-span-2 text-right pr-4">
                                    {student.isStudentPaused ? (
                                       <span className="text-xs font-bold text-slate-400 italic">No action</span>
                                    ) : student.isPaid ? (
                                       <button
                                          onClick={() => handleMarkAsUnpaid(student, student.studentPayments)}
                                          className="px-4 py-2 border border-rose-100 hover:bg-rose-50 rounded-xl text-rose-600 text-xs font-black shadow-sm transition-all hover:scale-[1.02] active:scale-95"
                                       >
                                          Mark Unpaid
                                       </button>
                                    ) : (
                                       <button
                                          onClick={() => handleMarkAsPaid(student, student.preferredPackageId)}
                                          disabled={isCustom && !customAmount}
                                          className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-black shadow-sm transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                       >
                                          Mark Paid
                                       </button>
                                    )}
                                 </div>
                              </div>
                           );
                        })}

                        {studentRoster.length === 0 && (
                           <div className="py-20 text-center text-[#166534] italic font-bold">
                              No students found. 🔍
                           </div>
                        )}
                     </div>
                  </div>

                  <GrassBorder />
               </div>
            );
         }
         case 'Billing & Licenses':
            return renderBillingTab();
         case 'Admin Reports':
            return isAdminUser ? renderAdminReportsTab() : null;
         default:
            return null;
      }
   };

   return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans teacher-theme">
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
      {/* --- Executive Hub Sidebar --- */}
      <aside className="w-80 bg-white border-r border-slate-100/60 flex flex-col shrink-0 h-screen sticky top-0 overflow-hidden">
         <style>{`
           @keyframes starTwinkle {
             0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.7; }
             50% { transform: scale(1.3) rotate(15deg); opacity: 1; filter: drop-shadow(0 0 6px rgba(250, 204, 21, 0.7)); }
           }
           .animate-star-twinkle {
             animation: starTwinkle 3s ease-in-out infinite;
           }
         `}</style>
         <div className="p-6 pb-4 mb-2 flex flex-col items-center border-b border-slate-100/60 w-full relative">
            <div className="relative flex items-center justify-center w-full">
               {/* Twinkling Star on Left (near logo's star) */}
               <div className="absolute left-[8%] bottom-[5%] text-amber-400 animate-star-twinkle pointer-events-none">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-300" />
               </div>
               
               {/* Twinkling Sparkles on Top Right */}
               <div className="absolute right-[8%] top-[5%] text-amber-300 animate-star-twinkle pointer-events-none" style={{ animationDelay: '1.5s' }}>
                  <Sparkles className="w-3.5 h-3.5 fill-amber-300 text-amber-200" />
               </div>

               <img src="/logo.png?v=3" className="w-[70%] h-auto object-contain mix-blend-multiply mb-2 hover:scale-105 transition-transform duration-300" alt="Homework Zone" />
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 flex flex-col items-center w-full">
               <span className="text-[9px] font-black uppercase tracking-widest text-[#166534]">Teacher Code</span>
               <span className="text-sm font-black text-slate-700 tracking-wider">{user?.teacherCode || user?.uid?.slice(0, 6).toUpperCase()}</span>
            </div>
         </div>

         <nav className="flex-1 px-6 space-y-2 overflow-y-auto custom-scrollbar pt-2">
            <SidebarItem id="Dashboard" label="Dashboard" icon={<LayoutDashboard />} iconColor="text-blue-500" active={activeTab === 'Dashboard'} onClick={setActiveTab} />
            <SidebarItem id="My Classes" label="My Classes" icon={<img src="/ic-classes.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Classes" />} active={activeTab === 'My Classes'} onClick={setActiveTab} />
            <SidebarItem id="Homework/Test Builder" label="Homework/Test Builder" icon={<img src="/ic-homework.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Homework" />} active={activeTab === 'Homework/Test Builder'} onClick={setActiveTab} />
            <SidebarItem id="Scheduler" label="Scheduler" icon={<Calendar className="w-5 h-5 text-pink-500" />} active={activeTab === 'Scheduler'} onClick={setActiveTab} />
            <SidebarItem id="Gradebook" label="Gradebook" icon={<Trophy className="w-5 h-5 text-emerald-500" />} active={activeTab === 'Gradebook'} onClick={setActiveTab} />
            <SidebarItem id="Reports" label="Reports" icon={<BarChart className="w-5 h-5 text-[#EA580C]" />} active={activeTab === 'Reports'} onClick={setActiveTab} />
            <SidebarItem id="Test Reports" label="Test Reports" icon={<BarChart className="w-5 h-5 text-purple-500" />} active={activeTab === 'Test Reports'} onClick={setActiveTab} />
            <SidebarItem id="Messages" label="Messages" icon={<img src="/ic-messages.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Messages" />} active={activeTab === 'Messages'} onClick={setActiveTab} />
            <SidebarItem id="Rewards" label="Rewards" icon={<img src="/ic-rewards.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Rewards" />} active={activeTab === 'Rewards'} onClick={setActiveTab} />
            <SidebarItem id="My Prompts" label="My Prompts" icon={<MessageSquare className="w-5 h-5 text-orange-500" />} active={activeTab === 'My Prompts'} onClick={setActiveTab} />
            <SidebarItem id="Tuition Fees" label="Tuition Fees" icon={<CreditCard className="w-5 h-5 text-green-500" />} active={activeTab === 'Tuition Fees'} onClick={setActiveTab} />
            <SidebarItem id="Revenue" label="Revenue" icon={<TrendingUp className="w-5 h-5 text-emerald-500" />} active={activeTab === 'Revenue'} onClick={setActiveTab} />
            <SidebarItem id="Billing & Licenses" label="Billing & Licenses" icon={<CreditCard className="w-5 h-5 text-blue-500" />} active={activeTab === 'Billing & Licenses'} onClick={setActiveTab} />
            {isAdminUser && (
              <SidebarItem id="Admin Reports" label="Admin Reports" icon={<Award className="w-5 h-5 text-purple-650 animate-pulse" />} active={activeTab === 'Admin Reports'} onClick={setActiveTab} />
            )}
         </nav>

         {/* Mascot Bottom Support */}
         <div className="p-6 mt-auto">
            <div className="bg-orange-50/50 rounded-[32px] p-8 relative group overflow-hidden border border-orange-200/50">
               <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full opacity-40" />
               <p className="text-[11px] font-bold text-orange-900 leading-tight text-center relative z-10 italic">
                  Guiding every student<br/>to their best! 🍎
               </p>
               <div className="mt-4 flex-center">
                  <img src="/mascot.png" className="w-36 h-36 object-contain animate-float mix-blend-multiply drop-shadow-xl" alt="Mascot" />
               </div>
               <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-orange-200/20 rounded-full blur-2xl" />
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
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       {activeTab === 'Dashboard' ? 'Global Overview' : (activeTab === 'Scheduler' ? 'Automated Curriculum Scheduler' : 'Class View')}
                       {activeTab !== 'Scheduler' && activeTab !== 'Billing & Licenses' && activeTab !== 'Admin Reports' && activeTab !== 'My Prompts' && ` • ${activeClassroom?.name || 'All Classes'}`}
                    </p>
                 </div>
                 
                  {activeTab !== 'Scheduler' && activeTab !== 'Billing & Licenses' && activeTab !== 'Admin Reports' && activeTab !== 'My Prompts' && (
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
                                      <div className={`w-1.5 h-1.5 rounded-full ${activeClassroom?.id === room.id ? 'bg-orange-600' : 'bg-slate-200 group-hover/item:bg-orange-300'}`} />
                                      <span className={`text-sm font-bold ${activeClassroom?.id === room.id ? 'text-orange-600' : 'text-slate-600 group-hover/item:text-slate-900'}`}>{room.name}</span>
                                   </button>
                                ))}
                             </div>
                          </motion.div>
                       )}
                    </AnimatePresence>
                 </div>
                  )}
              </div>


                 <div className="flex items-center gap-6">
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

            {todayBirthdayStudents.length > 0 && (
               <div className="px-10 pt-6">
                  <BirthdayCelebration students={todayBirthdayStudents} />
               </div>
            )}

            {renderContent()}

            {/* Goal Edit Modal - Globally Accessible across tabs */}
            {isEditingGoal && (
               <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex-center p-6">
                  <div className="max-w-md w-full bg-white rounded-[40px] p-10 space-y-8 shadow-2xl border border-orange-100 relative">
                     <h3 className="text-2xl font-black text-[#14532d]">Customize Class Goal</h3>
                     <div className="space-y-4">
                        <div>
                           <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2">Goal Name / Title</label>
                           <input 
                              type="text" 
                              value={newGoalTitle} 
                              onChange={(e) => setNewGoalTitle(e.target.value)} 
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-bold text-[#14532d] focus:outline-none"
                              placeholder="e.g. Pizza Party! 🍕"
                           />
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2">Target Points</label>
                           <input 
                              type="number" 
                              value={newGoalTarget} 
                              onChange={(e) => setNewGoalTarget(e.target.value)} 
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-bold text-[#14532d] focus:outline-none"
                              placeholder="e.g. 1500"
                           />
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2">Class Adventure Track</label>
                           <select 
                              value={newGoalTrack} 
                              onChange={(e) => setNewGoalTrack(e.target.value)} 
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-bold text-[#14532d] focus:outline-none"
                           >
                              <option value="auto">Auto-Rotate Weekly (Recommended) 🔄</option>
                              <option value="forest">Enchanted Forest 🌲</option>
                              <option value="space">Cosmic Space Maze 🚀</option>
                              <option value="sports">Sports Track 🏃</option>
                              <option value="undersea">Undersea Voyage 🌊</option>
                              <option value="candyland">Candyland Adventure 🍬</option>
                              <option value="dinosaur">Dinosaur Safari 🦖</option>
                              <option value="pirate">Pirate Treasure Hunt 🏴‍☠️</option>
                              <option value="haunted">Haunted Castle 👻</option>
                              <option value="winter">Winter Wonderland ⛄</option>
                              <option value="jungle">Jungle Explorer 🌴</option>
                              <option value="desert">Desert Mirage 🏜️</option>
                              <option value="cyber">Cyber City 🤖</option>
                              <option value="magic">Magic School 🪄</option>
                           </select>
                        </div>
                     </div>
                     <div className="flex flex-col gap-3">
                        <div className="flex gap-4">
                           <button onClick={handleSaveGoal} className="flex-1 bg-[#EA580C] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#C2410C] transition-all shadow-lg shadow-orange-100">
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

            {/* Award Custom Badge Modal */}
            {showAwardBadgeModal && (
               <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex-center p-6">
                  <div className="max-w-md w-full bg-white rounded-[40px] p-10 space-y-8 shadow-2xl border border-orange-100 relative max-h-[90vh] overflow-y-auto no-scrollbar">
                     <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-[#14532d] flex items-center gap-2">
                           <Award className="w-6 h-6 text-[#EA580C]" /> Award Badge
                        </h3>
                        <button 
                           onClick={() => setShowAwardBadgeModal(false)}
                           className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex-center text-slate-400 hover:text-slate-600 transition-colors"
                        >
                           <X className="w-4 h-4" />
                        </button>
                     </div>

                     {!selectedStudentForBadge ? (
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-[#EA580C] uppercase tracking-widest block mb-1">Select Student</label>
                           <select 
                              onChange={(e) => {
                                 const selectedId = e.target.value;
                                 const studentObj = allStudents.find(s => s.id === selectedId);
                                 setSelectedStudentForBadge(studentObj);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-5 text-sm font-bold text-[#14532d] focus:outline-none focus:border-[#EA580C] transition-all cursor-pointer"
                              defaultValue=""
                              required
                           >
                              <option value="" disabled>Choose a student...</option>
                              {allStudents.map(student => (
                                 <option key={student.id} value={student.id}>{student.name} ({student.className})</option>
                              ))}
                           </select>
                        </div>
                     ) : (
                        <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100/50 flex items-center gap-4">
                           <img 
                              src={getStudentAvatar(selectedStudentForBadge.name)} 
                              className="w-14 h-14 rounded-full border-2 border-white shadow-sm bg-white p-0.5" 
                              alt={selectedStudentForBadge.name} 
                           />
                           <div className="flex-1">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Awarding To</p>
                              <p className="text-lg font-black text-[#14532d]">{selectedStudentForBadge.name}</p>
                              <p className="text-xs font-bold text-[#EA580C] italic">{selectedStudentForBadge.className}</p>
                           </div>
                           <button 
                              type="button" 
                              onClick={() => setSelectedStudentForBadge(null)}
                              className="text-xs text-orange-500 font-bold hover:underline"
                           >
                              Change
                           </button>
                        </div>
                     )}

                     <div className="space-y-6">
                        <div>
                           <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-3">Choose Badge Icon</label>
                           <div className="grid grid-cols-6 gap-3">
                              {['🏆', '🎨', '🧪', '🤝', '🌟', '🧠', '❤️', '⚡', '🚀', '🌱', '📚', '🎖️'].map(emoji => (
                                 <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => setBadgeIcon(emoji)}
                                    className={`w-12 h-12 text-2xl flex-center rounded-2xl border transition-all ${badgeIcon === emoji ? 'bg-[#EA580C] border-[#EA580C] scale-110 shadow-md text-white' : 'bg-slate-50 border-slate-100 hover:bg-slate-100 hover:scale-105'}`}
                                 >
                                    {emoji}
                                 </button>
                              ))}
                           </div>
                        </div>

                        <div>
                           <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-3">Choose Card Color</label>
                           <div className="flex flex-wrap gap-3">
                              {[
                                 { name: 'Gold', val: 'bg-amber-50 text-amber-600 border-amber-100' },
                                 { name: 'Emerald', val: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                                 { name: 'Sky Blue', val: 'bg-blue-50 text-blue-600 border-blue-100' },
                                 { name: 'Indigo', val: 'bg-green-50 text-green-600 border-green-200' },
                                 { name: 'Rose', val: 'bg-rose-50 text-rose-600 border-rose-100' }
                              ].map(colorOpt => (
                                 <button
                                    key={colorOpt.name}
                                    type="button"
                                    onClick={() => setBadgeColor(colorOpt.val)}
                                    className={`px-4 py-2 text-xs font-black rounded-full border transition-all ${badgeColor === colorOpt.val ? 'ring-2 ring-[#EA580C] font-black scale-105' : 'opacity-85 hover:opacity-100'} ${colorOpt.val}`}
                                 >
                                    {colorOpt.name}
                                 </button>
                              ))}
                           </div>
                        </div>

                        <div>
                           <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2">Badge Name</label>
                           <input 
                              type="text" 
                              value={badgeName} 
                              onChange={(e) => setBadgeName(e.target.value)} 
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-[#14532d] focus:outline-none focus:border-[#EA580C] transition-all"
                              placeholder="e.g. Maths Genius 📐"
                              required
                           />
                        </div>

                        <div>
                           <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-2">Description</label>
                           <textarea 
                              value={badgeDesc} 
                              onChange={(e) => setBadgeDesc(e.target.value)} 
                              rows={2}
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold text-[#14532d] focus:outline-none focus:border-[#EA580C] transition-all resize-none"
                              placeholder="e.g. Awarded for explaining hard topics to friends in class."
                           />
                        </div>

                        {/* Live Preview */}
                        <div className="border border-dashed border-slate-200 rounded-3xl p-5 space-y-3">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Badge Live Preview</p>
                           <div className="flex items-center gap-4">
                              <div className={`w-14 h-14 ${badgeColor} rounded-full flex-center shadow-md border-2 border-white`}>
                                 <span className="text-2xl">{badgeIcon}</span>
                              </div>
                              <div>
                                 <h4 className="text-sm font-black text-[#14532d]">{badgeName || 'Badge Name'}</h4>
                                 <p className="text-[11px] font-bold text-[#166534] italic">{badgeDesc || 'Provide a description above.'}</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="flex gap-4 pt-2">
                        <button 
                           onClick={handleAwardBadge} 
                           disabled={isAwardingBadge || !badgeName.trim()}
                           className="flex-grow bg-[#EA580C] hover:bg-[#C2410C] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-orange-100 disabled:opacity-50"
                        >
                           {isAwardingBadge ? 'Awarding...' : 'Award Badge 🏆'}
                        </button>
                        <button 
                           onClick={() => setShowAwardBadgeModal(false)} 
                           className="flex-grow bg-slate-50 hover:bg-slate-100 text-slate-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors border border-slate-100"
                        >
                           Cancel
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
                              <span className="text-xs text-[#166534] italic">No submissions yet.</span>
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
              className="max-w-md w-full bg-white rounded-[40px] p-10 space-y-8 shadow-2xl border-8 border-orange-200"
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
                    className="w-full bg-slate-50 border-4 border-slate-50 rounded-[24px] py-4 px-6 text-sm font-bold focus:bg-white focus:border-orange-200 transition-all outline-none"
                    autoFocus
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Subjects to Teach</label>
                  <div className="flex flex-wrap gap-2 px-2">
                    {Array.from(new Set([...Object.keys(SUBJECT_ICONS), ...selectedSubjects])).map(subject => (
                      <button
                        key={subject}
                        onClick={() => {
                          if (selectedSubjects.includes(subject)) {
                            setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
                          } else {
                            setSelectedSubjects([...selectedSubjects, subject]);
                          }
                        }}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all ${selectedSubjects.includes(subject) ? 'bg-orange-600 text-white shadow-lg shadow-orange-100 scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 px-2 mt-2">
                    <input 
                      type="text" 
                      placeholder="Add custom subject" 
                      className="px-4 py-2 rounded-xl border-2 border-slate-100 text-sm focus:border-[#EA580C] focus:ring-0 w-48"
                      value={customSubjectInput}
                      onChange={(e) => setCustomSubjectInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && customSubjectInput.trim()) {
                          e.preventDefault();
                          const newSub = customSubjectInput.trim();
                          if (!selectedSubjects.includes(newSub)) {
                            setSelectedSubjects([...selectedSubjects, newSub]);
                          }
                          setCustomSubjectInput('');
                        }
                      }}
                    />
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        if (customSubjectInput.trim()) {
                          const newSub = customSubjectInput.trim();
                          if (!selectedSubjects.includes(newSub)) {
                            setSelectedSubjects([...selectedSubjects, newSub]);
                          }
                          setCustomSubjectInput('');
                        }
                      }}
                      className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button 
                    onClick={handleAddClassroom}
                    disabled={isAddingClass}
                    className={`flex-1 bg-orange-600 text-white py-4 rounded-[24px] font-black text-sm shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all active:scale-95 ${isAddingClass ? 'opacity-50 cursor-not-allowed' : ''}`}
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

      {/* --- Edit Class Modal --- */}
      <AnimatePresence>
        {showEditClassModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md w-full bg-white rounded-[40px] p-10 space-y-8 shadow-2xl border-8 border-orange-200"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Edit Class</h2>
                <p className="text-sm font-bold text-slate-400">Update your class details! ✨</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Class Name</label>
                  <input 
                    type="text" 
                    value={editClassName}
                    onChange={(e) => setEditClassName(e.target.value)}
                    placeholder="e.g. Grade 5 Adventure"
                    className="w-full bg-slate-50 border-4 border-slate-50 rounded-[24px] py-4 px-6 text-sm font-bold focus:bg-white focus:border-orange-200 transition-all outline-none"
                    autoFocus
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Subjects to Teach</label>
                  <div className="flex flex-wrap gap-2 px-2">
                    {Array.from(new Set([...Object.keys(SUBJECT_ICONS), ...selectedEditSubjects])).map(subject => (
                      <button
                        key={subject}
                        onClick={() => {
                          if (selectedEditSubjects.includes(subject)) {
                            setSelectedEditSubjects(selectedEditSubjects.filter(s => s !== subject));
                          } else {
                            setSelectedEditSubjects([...selectedEditSubjects, subject]);
                          }
                        }}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all ${selectedEditSubjects.includes(subject) ? 'bg-orange-600 text-white shadow-lg shadow-orange-100 scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 px-2 mt-2">
                    <input 
                      type="text" 
                      placeholder="Add custom subject" 
                      className="px-4 py-2 rounded-xl border-2 border-slate-100 text-sm focus:border-[#EA580C] focus:ring-0 w-48"
                      value={customEditSubjectInput}
                      onChange={(e) => setCustomEditSubjectInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && customEditSubjectInput.trim()) {
                          e.preventDefault();
                          const newSub = customEditSubjectInput.trim();
                          if (!selectedEditSubjects.includes(newSub)) {
                            setSelectedEditSubjects([...selectedEditSubjects, newSub]);
                          }
                          setCustomEditSubjectInput('');
                        }
                      }}
                    />
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        if (customEditSubjectInput.trim()) {
                          const newSub = customEditSubjectInput.trim();
                          if (!selectedEditSubjects.includes(newSub)) {
                            setSelectedEditSubjects([...selectedEditSubjects, newSub]);
                          }
                          setCustomEditSubjectInput('');
                        }
                      }}
                      className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button 
                    onClick={handleEditClassroom}
                    className={`flex-1 bg-orange-600 text-white py-4 rounded-[24px] font-black text-sm shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all active:scale-95`}
                  >
                    Save Changes
                  </button>
                  <button 
                    onClick={() => {
                      setShowEditClassModal(false);
                      setEditingClass(null);
                    }}
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
                 <div className="px-10 py-8 bg-blue-50/30 border-b border-orange-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-6">
                       <img src={getStudentAvatar(selectedSubmission.studentName)} className="w-16 h-16 rounded-full border-4 border-white shadow-md bg-blue-100" alt="Student" />
                       <div>
                          <h2 className="text-3xl font-black text-[#14532d]">{selectedSubmission.studentName}'s Report</h2>
                          <div className="flex items-center gap-4 mt-2">
                             <span className="text-sm font-bold text-blue-400">Score: {selectedSubmission.score}%</span>
                             <span className="w-1.5 h-1.5 rounded-full bg-blue-200" />
                             <span className="text-sm font-bold text-blue-400">Mission: {selectedSubmission.homeworkId.slice(0, 8)}</span>
                          </div>
                       </div>
                    </div>
                    <button 
                       onClick={() => setSelectedSubmission(null)}
                       className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-400 hover:text-rose-500 hover:bg-rose-50 hover:scale-110 transition-all shadow-sm border border-orange-100"
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
                       <h3 className="text-xl font-black text-[#14532d]">Question Breakdown</h3>
                       
                       {isFetchingReview ? (
                          <div className="py-20 flex justify-center">
                             <div className="w-10 h-10 border-4 border-blue-200 border-t-[#EA580C] rounded-full animate-spin" />
                          </div>
                       ) : reviewHomework?.questions ? (
                           <div className="space-y-8">
                              {reviewHomework.questions.map((q, qIdx) => {
                                 const studentSelection = selectedSubmission.answers?.[q.id];
                                 const actualAnswer = q.answer;
                                 
                                 return (
                                    <div key={q.id || qIdx} className="bg-[#f8f9fa] rounded-[24px] p-6 lg:p-8 space-y-5">
                                       <p className="text-[15px] font-bold text-slate-800 tracking-tight">
                                          <span className="text-green-700 font-black mr-2">Q{qIdx + 1}.</span> 
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
                          <div className="py-20 text-center text-[#166534] italic font-bold">
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
      
      {/* Student Detail Profile Modal */}
      <AnimatePresence>
        {selectedProfileStudent && (() => {
           // 1. Gather all student submissions
           const studentName = selectedProfileStudent.name;
           const studentSubs = allSubmissions.filter(sub => normalizeName(sub.studentName) === normalizeName(studentName))
                                               .sort((a, b) => {
                                                  const dateA = a.submittedAt?.toDate ? a.submittedAt.toDate() : new Date(a.submittedAt || 0);
                                                  const dateB = b.submittedAt?.toDate ? b.submittedAt.toDate() : new Date(b.submittedAt || 0);
                                                  return dateB - dateA;
                                               });

           // 2. Calculate Concept Mastery Gaps
           const studentSubtopics = {};
           studentSubs.forEach(sub => {
              const hw = allHomeworks.find(h => h.id === sub.homeworkId);
              if (!hw || !hw.questions) return;
              hw.questions.forEach(q => {
                 const subtopic = getQuestionSubtopic(hw, q);
                 if (!studentSubtopics[subtopic]) {
                    studentSubtopics[subtopic] = { correctCount: 0, totalCount: 0 };
                 }
                 const studentSelection = sub.answers?.[q.id];
                 const actualAnswer = q.answer;
                 const isCorrect = studentSelection === actualAnswer;
                 
                 studentSubtopics[subtopic].totalCount += 1;
                 if (isCorrect) {
                    studentSubtopics[subtopic].correctCount += 1;
                 }
              });
           });

           const masteryArray = Object.keys(studentSubtopics).map(name => {
              const data = studentSubtopics[name];
              const accuracy = Math.round((data.correctCount / data.totalCount) * 100);
              let tier = 'Needs Focus';
              if (accuracy >= 80) tier = 'Mastered';
              else if (accuracy >= 60) tier = 'Reviewing';
              return { name, accuracy, correctCount: data.correctCount, totalCount: data.totalCount, tier };
           }).sort((a, b) => a.accuracy - b.accuracy);

           // 3. Trajectory line chart data
           const sortedSubsChronological = [...studentSubs].sort((a, b) => {
              const dateA = a.submittedAt?.toDate ? a.submittedAt.toDate() : new Date(a.submittedAt || 0);
              const dateB = b.submittedAt?.toDate ? b.submittedAt.toDate() : new Date(b.submittedAt || 0);
              return dateA - dateB;
           });

           const chartData = sortedSubsChronological.map((sub, idx) => {
              const hw = allHomeworks.find(h => h.id === sub.homeworkId);
              const hwTitle = hw ? hw.title : 'Mission';
              
              const hwSubs = allSubmissions.filter(s => s.homeworkId === sub.homeworkId);
              const classAvg = hwSubs.length > 0 ? Math.round(hwSubs.reduce((acc, s) => acc + (s.score || 0), 0) / hwSubs.length) : 0;
              
              const dateStr = sub.submittedAt ? new Date(sub.submittedAt.toDate ? sub.submittedAt.toDate() : sub.submittedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : `Quiz ${idx + 1}`;
              
              return {
                 name: dateStr,
                 title: hwTitle,
                 studentScore: sub.score,
                 classAverage: classAvg
              };
           });

           const startingScore = chartData.length > 0 ? chartData[0].studentScore : 0;
           const currentScore = chartData.length > 0 ? chartData[chartData.length - 1].studentScore : 0;
           const growth = chartData.length > 1 ? currentScore - startingScore : 0;

           // 4. Engagement & Pacing Calculations
           let totalTimeSpent = 0;
           let totalQCount = 0;
           studentSubs.forEach(sub => {
              const hw = allHomeworks.find(h => h.id === sub.homeworkId);
              const qCount = hw?.questions?.length || 5;
              const time = sub.timeSpent !== undefined && sub.timeSpent > 0 ? sub.timeSpent : qCount * 25;
              totalTimeSpent += time;
              totalQCount += qCount;
           });

           const pacePerQ = totalQCount > 0 ? Math.round(totalTimeSpent / totalQCount) : 0;
           let speedBadge = 'No Data';
           let badgeColorClass = 'bg-slate-50 text-slate-400';
           if (studentSubs.length > 0) {
              if (pacePerQ < 15) {
                 speedBadge = 'Quick Solver ⚡';
                 badgeColorClass = 'bg-amber-50 text-amber-600 border border-amber-100';
              } else if (pacePerQ >= 15 && pacePerQ <= 40) {
                 speedBadge = 'Paced Solver ⏱️';
                 badgeColorClass = 'bg-emerald-50 text-emerald-600 border border-emerald-100';
              } else {
                 speedBadge = 'Deep Thinker 🧠';
                 badgeColorClass = 'bg-[#FFEDD5] text-[#EA580C] border border-[#FED7AA]';
              }
           }

           const formatDuration = (secs) => {
              if (secs < 60) return `${secs}s`;
              const m = Math.floor(secs / 60);
              const s = secs % 60;
              return s > 0 ? `${m}m ${s}s` : `${m}m`;
           };

           return (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                 <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    onClick={() => {
                       setSelectedProfileStudent(null);
                       setSelectedProfileSubmission(null);
                    }}
                 />
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-blue-100"
                 >
                    {/* Header */}
                    <div className="px-10 py-8 bg-blue-50/30 border-b border-orange-100 flex items-center justify-between shrink-0">
                       <div className="flex items-center gap-6">
                          <img src={getStudentAvatar(studentName)} className="w-16 h-16 rounded-full border-4 border-white shadow-md bg-blue-100" alt="Student avatar" />
                          <div>
                             <h2 className="text-3xl font-black text-[#14532d] tracking-tight">{studentName}'s Profile & Analytics</h2>
                             <div className="flex items-center gap-4 mt-2">
                                <span className="text-xs font-bold text-blue-400 bg-white border border-blue-100 px-3 py-1 rounded-full">{selectedProfileStudent.className || 'Classroom Student'}</span>
                                {studentSubs.length > 0 && (
                                   <span className={`text-xs font-black px-3 py-1 rounded-full ${badgeColorClass}`}>
                                      {speedBadge}
                                   </span>
                                )}
                             </div>
                          </div>
                       </div>
                        <div className="flex items-center gap-3">
                           {/* AI Parent Report Generator Button */}
                           <button
                              onClick={() => handleGenerateAiParentReport(studentName, startingScore, currentScore, growth, speedBadge, masteryArray, studentSubs.length)}
                              className="flex items-center gap-2 bg-[#EA580C] hover:bg-[#C2410C] text-white px-5 py-3 rounded-2xl text-xs font-black transition-all shadow-md shadow-orange-100 hover:scale-105"
                           >
                              <Sparkles className="w-4 h-4 fill-current" />
                              AI Parent Report
                           </button>

                           <button 
                              onClick={() => {
                                 setSelectedProfileStudent(null);
                                 setSelectedProfileSubmission(null);
                              }}
                              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-400 hover:text-rose-500 hover:bg-rose-50 hover:scale-110 transition-all shadow-sm border border-orange-100"
                           >
                              ✕
                           </button>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex bg-[#FFEDD5]/30 p-2 border-b border-orange-100 shrink-0">
                       <button 
                          onClick={() => {
                             setStudentProfileTab('mastery');
                             setSelectedProfileSubmission(null);
                          }} 
                          className={`flex-1 py-3.5 rounded-2xl text-xs font-black tracking-wider uppercase transition-all ${studentProfileTab === 'mastery' && !selectedProfileSubmission ? 'bg-white text-[#EA580C] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                       >
                          Concept Mastery
                       </button>
                       <button 
                          onClick={() => {
                             setStudentProfileTab('trajectory');
                             setSelectedProfileSubmission(null);
                          }} 
                          className={`flex-1 py-3.5 rounded-2xl text-xs font-black tracking-wider uppercase transition-all ${studentProfileTab === 'trajectory' ? 'bg-white text-[#EA580C] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                       >
                          Growth Trajectory
                       </button>
                       <button 
                          onClick={() => setStudentProfileTab('submissions')} 
                          className={`flex-1 py-3.5 rounded-2xl text-xs font-black tracking-wider uppercase transition-all ${studentProfileTab === 'submissions' || selectedProfileSubmission ? 'bg-white text-[#EA580C] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                       >
                          Missions & Answers
                       </button>
                    </div>

                    {/* Modal Body */}
                    <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                       
                       {/* Submission Detail View */}
                       {selectedProfileSubmission ? (
                          <div className="space-y-8 animate-fadeIn">
                             <div className="flex items-center justify-between bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                <button 
                                   onClick={() => setSelectedProfileSubmission(null)}
                                   className="flex items-center gap-2 text-xs font-black text-orange-600 hover:underline uppercase tracking-wider"
                                >
                                   ← Back to submissions list
                                </button>
                                <span className={`px-4 py-1.5 rounded-full text-xs font-black ${selectedProfileSubmission.score >= 80 ? 'bg-emerald-50 text-emerald-600' : selectedProfileSubmission.score >= 50 ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
                                   Score: {selectedProfileSubmission.score}%
                                </span>
                             </div>

                             {selectedProfileSubmission.feedback && (
                                <div className="bg-amber-50/50 border border-amber-100 rounded-[32px] p-8 flex gap-6">
                                   <div className="w-12 h-12 shrink-0 bg-amber-400 rounded-2xl flex items-center justify-center text-white shadow-sm">
                                      <Zap className="w-6 h-6" />
                                   </div>
                                   <div className="space-y-2">
                                      <h4 className="text-sm font-black text-amber-800 uppercase tracking-widest">AI Feedback</h4>
                                      <p className="text-amber-900 font-bold leading-relaxed">{selectedProfileSubmission.feedback}</p>
                                   </div>
                                </div>
                             )}

                             <div className="space-y-6">
                                <h3 className="text-xl font-black text-[#14532d]">Question Breakdown</h3>
                                
                                {isProfileSubmissionFetching ? (
                                   <div className="py-20 flex justify-center">
                                      <div className="w-10 h-10 border-4 border-blue-200 border-t-[#EA580C] rounded-full animate-spin" />
                                   </div>
                                ) : profileSubmissionHomework?.questions ? (
                                   <div className="space-y-8">
                                      {profileSubmissionHomework.questions.map((q, qIdx) => {
                                         const studentSelection = selectedProfileSubmission.answers?.[q.id];
                                         const actualAnswer = q.answer;
                                         
                                         return (
                                            <div key={q.id || qIdx} className="bg-[#f8f9fa] rounded-[24px] p-6 lg:p-8 space-y-5">
                                               <p className="text-[15px] font-bold text-slate-800 tracking-tight">
                                                  <span className="text-green-700 font-black mr-2">Q{qIdx + 1}.</span> 
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

                                               {studentSelection !== actualAnswer && (
                                                  <div className="bg-green-50 border border-green-200 p-5 rounded-2xl flex gap-3 text-left mt-4">
                                                     <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-green-200 shrink-0">
                                                        <Info className="w-5 h-5 text-green-600" />
                                                     </div>
                                                     <div className="space-y-1">
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-green-500">Explanation</p>
                                                        <p className="text-xs font-bold text-green-700 leading-relaxed whitespace-pre-line">
                                                           {selectedProfileSubmission.wrongAnswersExplanations?.[q.id] || `The correct answer is "${q.answer}".`}
                                                        </p>
                                                     </div>
                                                  </div>
                                               )}
                                            </div>
                                         );
                                      })}
                                   </div>
                                ) : (
                                   <div className="py-20 text-center text-[#166534] italic font-bold">
                                      Homework questions not available.
                                   </div>
                                )}
                             </div>
                          </div>
                       ) : (
                          <>
                             {/* Concept Mastery Tab */}
                             {studentProfileTab === 'mastery' && (
                                <div className="space-y-8 animate-fadeIn">
                                   {masteryArray.length > 0 ? (
                                      <>
                                         {/* Gaps Banner */}
                                         {masteryArray.some(m => m.accuracy < 60) && (
                                            <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl flex gap-4 text-left">
                                               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0 text-rose-500">
                                                  ⚠️
                                               </div>
                                               <div>
                                                  <h4 className="text-sm font-black text-rose-800 uppercase tracking-widest">Gaps Identified</h4>
                                                  <p className="text-xs text-rose-900 font-bold mt-1">
                                                     {studentName} is currently struggling with <span className="text-rose-600 font-black">{masteryArray.filter(m => m.accuracy < 60).map(m => m.name).join(', ')}</span>. Practice missions or direct remediation is recommended to strengthen these concept gaps.
                                                  </p>
                                               </div>
                                            </div>
                                         )}

                                         {/* Mastery Grid */}
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {masteryArray.map((m, idx) => {
                                               const barColor = m.accuracy >= 80 ? 'bg-emerald-500' : m.accuracy >= 60 ? 'bg-blue-500' : 'bg-rose-500';
                                               const badgeColor = m.accuracy >= 80 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : m.accuracy >= 60 ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-rose-50 text-rose-600 border border-rose-100';
                                               return (
                                                  <div key={idx} className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 hover:shadow-md transition-shadow animate-fadeIn">
                                                     <div className="flex justify-between items-center">
                                                        <span className="text-sm font-black text-slate-800">{m.name}</span>
                                                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${badgeColor}`}>
                                                           {m.tier}
                                                        </span>
                                                     </div>
                                                     <div className="space-y-1.5">
                                                        <div className="flex justify-between text-xs font-bold text-slate-400">
                                                           <span>Mastery Accuracy</span>
                                                           <span className="font-black text-slate-700">{m.accuracy}% ({m.correctCount}/{m.totalCount})</span>
                                                        </div>
                                                        <div className="w-full h-2.5 bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                                                           <div className={`h-full rounded-full ${barColor}`} style={{ width: `${m.accuracy}%` }} />
                                                        </div>
                                                     </div>
                                                  </div>
                                               );
                                            })}
                                         </div>
                                      </>
                                   ) : (
                                      <div className="py-20 text-center text-[#166534] font-bold italic">
                                         No mastery data has been logged yet. Check back once they submit their quizzes! 🚀
                                      </div>
                                   )}
                                </div>
                             )}

                             {/* Growth Trajectory Tab */}
                             {studentProfileTab === 'trajectory' && (
                                <div className="space-y-8 animate-fadeIn">
                                   {studentSubs.length === 0 ? (
                                      <div className="py-20 text-center text-[#166534] font-bold italic">
                                         No quiz performance data available yet.
                                      </div>
                                   ) : (
                                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                         {/* Trajectory Stats */}
                                         <div className="lg:col-span-4 flex flex-col gap-6">
                                            <div className="bg-slate-50 rounded-3xl border border-slate-150 p-6 flex items-center justify-between shadow-sm">
                                               <div>
                                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Starting Accuracy</span>
                                                  <span className="text-2xl font-black text-[#14532d]">{startingScore}%</span>
                                               </div>
                                               <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-black text-xs shadow-sm">
                                                  1st
                                               </div>
                                            </div>

                                            <div className="bg-slate-50 rounded-3xl border border-slate-150 p-6 flex items-center justify-between shadow-sm">
                                               <div>
                                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Current Accuracy</span>
                                                  <span className="text-2xl font-black text-[#14532d]">{currentScore}%</span>
                                               </div>
                                               <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-orange-600 font-black text-xs shadow-sm">
                                                  Last
                                               </div>
                                            </div>

                                            <div className="bg-slate-50 rounded-3xl border border-slate-150 p-6 flex items-center justify-between shadow-sm">
                                               <div>
                                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Growth Index</span>
                                                  <div className="flex items-center gap-2">
                                                     <span className={`text-2xl font-black ${growth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                        {growth >= 0 ? `+${growth}%` : `${growth}%`}
                                                     </span>
                                                     {growth >= 0 ? (
                                                        <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                                                     ) : (
                                                        <ArrowDownRight className="w-5 h-5 text-rose-500" />
                                                     )}
                                                  </div>
                                               </div>
                                               <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shadow-sm ${growth >= 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                                  {growth >= 0 ? '▲' : '▼'}
                                               </div>
                                            </div>
                                         </div>

                                         {/* Chart block */}
                                         <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-8 space-y-6 flex flex-col justify-between">
                                            <div className="flex justify-between items-center">
                                               <h3 className="text-md font-black text-slate-800">Performance Over Time</h3>
                                               <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-wider">
                                                  <div className="flex items-center gap-1 text-[#EA580C]">
                                                     <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C] inline-block" />
                                                     <span>{studentName}</span>
                                                  </div>
                                                  <div className="flex items-center gap-1 text-[#FFAB91]">
                                                     <span className="w-2.5 h-0.5 border-t-2 border-dashed border-[#FFAB91] inline-block" />
                                                     <span>Class Average</span>
                                                  </div>
                                               </div>
                                            </div>

                                            <div className="h-60 w-full">
                                               <ResponsiveContainer width="100%" height="100%">
                                                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                                     <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                     <XAxis dataKey="name" stroke="#cbd5e1" style={{ fontSize: '9px', fontWeight: 'bold' }} />
                                                     <YAxis domain={[0, 100]} stroke="#cbd5e1" style={{ fontSize: '9px', fontWeight: 'bold' }} />
                                                     <RechartsTooltip 
                                                        content={({ active, payload }) => {
                                                           if (active && payload && payload.length) {
                                                              const data = payload[0].payload;
                                                              return (
                                                                 <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg text-[10px] space-y-1 font-bold">
                                                                    <p className="text-[#EA580C] font-black">{data.title}</p>
                                                                    <p className="text-slate-300">Date: {data.name}</p>
                                                                    <p>Student Score: <span className="text-[#EA580C] font-black">{data.studentScore}%</span></p>
                                                                    <p>Class Average: <span className="text-[#FFAB91] font-black">{data.classAverage}%</span></p>
                                                                 </div>
                                                              );
                                                           }
                                                           return null;
                                                        }}
                                                     />
                                                     <Line type="monotone" dataKey="studentScore" stroke="#EA580C" strokeWidth={3.5} dot={{ r: 4, strokeWidth: 2 }} />
                                                     <Line type="monotone" dataKey="classAverage" stroke="#FFAB91" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                                  </LineChart>
                                               </ResponsiveContainer>
                                            </div>
                                         </div>
                                      </div>
                                   )}
                                </div>
                             )}

                             {/* Missions & Submissions list */}
                             {studentProfileTab === 'submissions' && (
                                <div className="space-y-6 animate-fadeIn">
                                   {studentSubs.length > 0 ? (
                                      <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
                                         <div className="grid grid-cols-12 px-6 py-4 bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                            <div className="col-span-6">Quiz Title</div>
                                            <div className="col-span-2 text-center">Score</div>
                                            <div className="col-span-2 text-center">Time Spent</div>
                                            <div className="col-span-2 text-right">Action</div>
                                         </div>
                                         <div className="divide-y divide-slate-100">
                                            {studentSubs.map((sub, idx) => {
                                               const hw = allHomeworks.find(h => h.id === sub.homeworkId);
                                               const hwTitle = hw ? hw.title : 'Mission';
                                               const hwSubject = hw ? hw.subject : 'general';
                                               const timeText = formatDuration(sub.timeSpent || (hw?.questions?.length || 5) * 25);
                                               
                                               return (
                                                  <div key={sub.id || idx} className="grid grid-cols-12 px-6 py-5 items-center hover:bg-slate-50/50 transition-colors">
                                                     <div className="col-span-6 flex flex-col gap-1 text-left">
                                                        <span className="text-sm font-black text-slate-800">{hwTitle}</span>
                                                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded w-fit ${
                                                           hwSubject === 'maths' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                           hwSubject === 'science' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                           'bg-pink-50 text-pink-600 border border-pink-100'
                                                        }`}>
                                                           {hwSubject}
                                                        </span>
                                                     </div>
                                                     <div className="col-span-2 text-center">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-black ${sub.score >= 80 ? 'bg-emerald-50 text-emerald-600' : sub.score >= 50 ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
                                                           {sub.score}%
                                                        </span>
                                                     </div>
                                                     <div className="col-span-2 text-center text-xs font-bold text-slate-500">
                                                        {timeText}
                                                     </div>
                                                     <div className="col-span-2 text-right">
                                                        <button 
                                                           onClick={() => setSelectedProfileSubmission(sub)}
                                                           className="text-[10px] font-black text-[#EA580C] bg-[#FFEDD5] hover:bg-[#FED7AA] px-4 py-2 rounded-xl border border-[#FED7AA] shadow-sm transition-colors"
                                                        >
                                                           View Quiz
                                                        </button>
                                                     </div>
                                                  </div>
                                               );
                                            })}
                                         </div>
                                      </div>
                                   ) : (
                                      <div className="py-20 text-center text-[#166534] font-bold italic">
                                         No missions completed yet. 🚀
                                      </div>
                                   )}
                                </div>
                             )}
                          </>
                       )}


                     {/* Report Overlay Panel */}
                     <AnimatePresence>
                       {showReportOverlay && (
                         <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-6">
                           <motion.div
                             initial={{ scale: 0.95, opacity: 0 }}
                             animate={{ scale: 1, opacity: 1 }}
                             exit={{ scale: 0.95, opacity: 0 }}
                             className="bg-white rounded-[32px] w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden border border-green-200"
                           >
                             {/* Overlay Header */}
                             <div className="px-8 py-6 bg-green-50/40 border-b border-green-100 flex items-center justify-between shrink-0">
                               <div className="flex items-center gap-3">
                                 <Sparkles className="w-5 h-5 text-green-600 fill-current" />
                                 <h3 className="text-xl font-black text-green-950">AI Parent Report Summary</h3>
                               </div>
                               <button
                                 onClick={() => setShowReportOverlay(false)}
                                 className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-500 hover:text-rose-500 hover:bg-rose-50 hover:scale-105 transition-all shadow-sm border border-green-200"
                               >
                                 ✕
                               </button>
                             </div>

                             {/* Overlay Body */}
                             <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-6">
                               {isGeneratingReport ? (
                                 <div className="py-20 flex flex-col items-center justify-center gap-4">
                                   <div className="w-12 h-12 border-4 border-green-200 border-t-[#EA580C] rounded-full animate-spin" />
                                   <p className="text-sm font-black text-green-800 animate-pulse">Analyzing submissions &amp; drafting parent report...</p>
                                 </div>
                               ) : (
                                 <div className="space-y-6">
                                   <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-slate-700 text-xs font-bold leading-relaxed whitespace-pre-wrap font-sans max-h-[50vh] overflow-y-auto custom-scrollbar">
                                     {aiReportContent}
                                   </div>

                                   <div className="flex gap-4">
                                     <button
                                       onClick={() => {
                                         navigator.clipboard.writeText(aiReportContent);
                                         alert("Report copied to clipboard! 📋✨");
                                       }}
                                       className="flex-1 py-4 bg-[#EA580C] text-white rounded-2xl text-xs font-black shadow-md shadow-orange-100 hover:bg-[#C2410C] transition-all flex items-center justify-center gap-2"
                                     >
                                       <span>📋</span> Copy to Clipboard
                                     </button>
                                     <button
                                       onClick={handlePublishAiReportToParent}
                                       disabled={isPublishingReport}
                                       className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl text-xs font-black shadow-md shadow-emerald-100 hover:bg-emerald-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                     >
                                       {isPublishingReport ? "Publishing..." : "📤 Publish to Parent Portal"}
                                     </button>
                                     <button
                                       onClick={() => {
                                         const printWindow = window.open('', '_blank');
                                         printWindow.document.write(`
                                           <html>
                                             <head>
                                               <title>AI Parent Report - ${studentName}</title>
                                               <style>
                                                 body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
                                                 h1, h2, h3 { color: #14532d; }
                                                 .header { border-bottom: 2px solid #E2E8F0; padding-bottom: 20px; margin-bottom: 30px; }
                                                 .header p { margin: 5px 0; color: #64748B; font-weight: bold; }
                                                 .content { white-space: pre-wrap; font-size: 14px; }
                                               </style>
                                             </head>
                                             <body>
                                               <div class="header">
                                                 <h1>Homework Zone - Parent Report</h1>
                                                 <p>Student: ${studentName}</p>
                                                 <p>Date: ${new Date().toLocaleDateString()}</p>
                                               </div>
                                               <div class="content">${aiReportContent}</div>
                                             </body>
                                           </html>
                                         `);
                                         printWindow.document.close();
                                         printWindow.print();
                                       }}
                                       className="py-4 px-6 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2"
                                     >
                                       <span>🖨️</span> Print
                                     </button>
                                   </div>
                                 </div>
                               )}
                             </div>
                           </motion.div>
                         </div>
                       )}
                     </AnimatePresence>
                    </div>
                 </motion.div>
              </div>
           );
        })()}
      </AnimatePresence>



       {/* Remediation Message Centered Modal */}
       <AnimatePresence>
         {remediationModalStudent && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex-center p-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="max-w-md w-full bg-white rounded-[40px] p-10 space-y-6 shadow-2xl border border-orange-100 relative animate-fadeIn"
              >
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#FFEDD5] flex-center text-[#EA580C]">
                         <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                         <h2 className="text-lg font-black text-[#14532d] tracking-tight">Direct Message</h2>
                         <p className="text-[10px] font-bold text-slate-400">Send practice tip to {remediationModalStudent.name}</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Topic Remediation</span>
                   <span className="text-xs font-black text-[#EA580C]">{remediationModalStudent.gapSubtopic}</span>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-[#14532d] ml-2">Message Content</label>
                   <textarea
                     rows={4}
                     value={remediationMessageContent}
                     onChange={(e) => setRemediationMessageContent(e.target.value)}
                     placeholder="Write your remediation message here..."
                     className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium focus:border-green-300 outline-none text-slate-700 resize-none leading-relaxed"
                   />
                </div>

                <div className="flex gap-4">
                   <button 
                     onClick={handleSendRemediationMsg} 
                     disabled={isSendingRemediationMsg}
                     className="flex-1 bg-[#EA580C] text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#C2410C] transition-colors shadow-lg shadow-orange-200 disabled:opacity-50"
                   >
                      {isSendingRemediationMsg ? 'Sending...' : 'Send Message'}
                   </button>
                   <button 
                     onClick={() => {
                       setRemediationModalStudent(null);
                       setRemediationMessageContent('');
                     }} 
                     className="w-1/3 bg-blue-50 text-blue-400 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-100 hover:text-blue-600 transition-colors"
                   >
                      Cancel
                   </button>
                </div>
              </motion.div>
            </div>
         )}
       </AnimatePresence>

       {/* Upgrade Alert Modal */}
       <AnimatePresence>
         {showUpgradeAlert && (() => {
           const activePlanId = (teacherBilling && ['active', 'trialing'].includes(teacherBilling.status)) ? teacherBilling.planId : 'free';
           const limit = getPlanSeatLimit(activePlanId);
           const trialDays = getTrialDaysLeft();
           const isTrialExpired = (activePlanId === 'free' && trialDays < 0);
           
           return (
             <div className="fixed inset-0 bg-[#3C2E75]/40 backdrop-blur-sm z-[200] flex-center p-6">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                 className="max-w-md w-full bg-white rounded-[40px] p-10 space-y-6 shadow-2xl border-8 border-orange-200 relative text-center"
               >
                 <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-2">
                   {isTrialExpired ? '🔒' : '🚀'}
                 </div>
                 <h2 className="text-2xl font-black text-[#14532d] tracking-tight">
                   {isTrialExpired ? 'Free Trial Expired' : 'Classroom Capacity Reached'}
                 </h2>
                 <p className="text-xs font-bold text-slate-500 leading-relaxed">
                   {isTrialExpired 
                     ? 'Your 7-day free trial has expired. Subscribe to one of our premium plans to unlock student additions and continue using HomeworkZone.'
                     : "You've reached your plan's seat limit of " + limit + " students. Upgrade your subscription to add more students!"}
                 </p>
                 <div className="flex flex-col gap-3 pt-2">
                   <button 
                     onClick={() => {
                       setShowUpgradeAlert(false);
                       setActiveTab('Billing & Licenses');
                     }} 
                     className="w-full bg-[#EA580C] hover:bg-[#C2410C] text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-200"
                   >
                     View Plans & Upgrade 💳
                   </button>
                   <button 
                     onClick={() => setShowUpgradeAlert(false)} 
                     className="w-full bg-slate-100 hover:bg-slate-200 text-slate-500 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                   >
                     Maybe Later
                   </button>
                 </div>
               </motion.div>
             </div>
           );
         })()}
       </AnimatePresence>
       </main>
     </div>
    );
};

const SidebarItem = ({ id, label, icon, iconColor, active, onClick }) => (
  <button 
    onClick={() => onClick(id)}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-[24px] transition-all group ${active ? 'bg-[#FFEDD5] text-[#EA580C] shadow-xl shadow-green-50' : 'text-[#166534] hover:bg-blue-50/50 hover:text-[#14532d]'}`}
  >
     <div className={`${active ? 'text-[#EA580C]' : iconColor} group-hover:scale-125 transition-transform w-6 h-6 flex-center`}>
        {React.isValidElement(icon) && icon.type === 'img' ? icon : React.cloneElement(icon, { size: 20, strokeWidth: 3, fill: "currentColor" })}
     </div>
     <span className={`text-sm font-black tracking-tight ${active ? 'text-[#EA580C]' : 'text-[#166534]'}`}>{label}</span>
  </button>
);

const PlaceholderView = ({ title, icon, description }) => (
   <div className="px-10 py-20 flex flex-col items-center justify-center text-center space-y-6">
      <div className="w-32 h-32 bg-white rounded-[40px] shadow-2xl flex-center border border-orange-100">
         <img src={icon} className="w-20 h-20 object-contain mix-blend-multiply" alt={title} />
      </div>
      <div className="space-y-2">
         <h1 className="text-4xl font-black text-[#14532d] tracking-tight">{title}</h1>
         <p className="text-sm font-bold text-[#166534] italic">{description}</p>
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

const ClassCard = ({ name, students, bgColor, kidsImg, subjects, onDelete, onView, onEdit }) => {
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
             <h3 
               className="text-2xl font-black text-[#14532d] flex items-center justify-center gap-2 group/title cursor-pointer hover:text-[#C2410C] transition-colors" 
               onClick={(e) => { e.stopPropagation(); onEdit(); }}
               title="Click to edit class"
             >
               {name}
               <Pencil className="w-6 h-6 p-1.5 bg-green-100 rounded-full text-[#166534] opacity-80 group-hover/title:opacity-100 transition-opacity ml-2" />
             </h3>
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
            className="flex-1 bg-[#EA580C] text-white py-4 rounded-3xl font-black text-sm shadow-lg shadow-orange-100 hover:scale-[1.02] transition-all"
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
      <p className="text-[10px] font-black text-[#166534] uppercase tracking-widest">{title}</p>
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
            <p className="text-sm font-black text-[#14532d]">{name}</p>
            <p className="text-[10px] font-bold text-[#166534] italic">Earned by {count} students</p>
         </div>
      </div>
   </div>
);

const PaginationButton = ({ label, active, onClick }) => (
   <button onClick={onClick} className={`w-10 h-10 rounded-xl flex-center text-sm font-black transition-all ${active ? 'bg-[#EA580C] text-white shadow-lg shadow-orange-100' : 'text-blue-400 hover:bg-blue-50'}`}>
      {label}
   </button>
);

const NavLink = ({ label, active }) => (
  <span className={`text-sm font-bold cursor-pointer transition-all ${active ? 'text-blue-900 border-b-2 border-blue-900' : 'text-blue-400 hover:text-blue-600'}`}>
    {label}
  </span>
);

const KPICard = ({ title, value, subtitle, icon, isAlt }) => (
  <div className="bg-white rounded-[40px] p-8 border border-orange-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all relative overflow-hidden h-52">
    <div className="space-y-2 relative z-10">
       <h4 className="text-sm font-black text-[#14532d] tracking-tight">{title}</h4>
       <p className="text-5xl font-black text-[#14532d] tracking-tighter">{value}</p>
       <p className="text-[10px] font-bold text-[#166534] uppercase tracking-widest">{subtitle}</p>
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
    className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-[24px] border-4 transition-all ${active ? 'bg-white border-green-200 shadow-md' : 'bg-transparent border-transparent text-blue-400 hover:bg-blue-100/50'}`}
  >
     <img src={icon} className={`w-5 h-5 ${active ? 'opacity-100' : 'opacity-40 grayscale'} transition-all`} alt={label} />
     <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-blue-900' : 'text-blue-400'}`}>{label}</span>
  </button>
);

const AiKeyInput = ({ label, value, onChange, placeholder, icon }) => (
  <div className="space-y-2">
     <label className="text-[10px] font-black uppercase text-blue-400 tracking-[0.1em] block ml-4">{label}</label>
     <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-50 rounded-lg flex-center border border-blue-100 group-focus-within:border-green-200 transition-all">
           <img src={icon} className="w-5 h-5" alt={label} />
        </div>
        <input 
          type="password" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-blue-50 border-4 border-orange-100 pl-16 pr-6 py-4 rounded-[24px] text-xs font-bold outline-none focus:bg-white focus:border-green-200 transition-all placeholder:text-[#166534]"
        />
     </div>
  </div>
);

const SubjectCard = ({ title, description, icon, color, borderColor, active, onClick }) => (
   <button 
      onClick={onClick}
      className={`relative p-8 rounded-[40px] border-4 transition-all flex flex-col items-center text-center gap-4 group ${color} ${active ? `${borderColor} shadow-xl scale-[1.02]` : 'border-transparent hover:scale-[1.01]'}`}
   >
      <div className={`absolute top-6 right-6 w-6 h-6 rounded-full border-2 flex-center transition-all ${active ? 'bg-[#EA580C] border-[#EA580C]' : 'border-blue-200 bg-white'}`}>
         {active && <Star className="w-3 h-3 text-white fill-current" />}
      </div>
      <div className="w-32 h-32 flex-center relative">
         <img src={icon} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" alt={title} />
      </div>
      <div className="space-y-1">
         <h3 className="text-2xl font-black text-[#14532d]">{title}</h3>
         <p className="text-[10px] font-bold text-blue-400 leading-tight">{description}</p>
      </div>
   </button>
);

export default TeacherDashboard;
