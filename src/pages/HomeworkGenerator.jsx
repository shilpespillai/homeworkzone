import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  FlaskConical, 
  Brain,
  Pencil, 
  Book, 
  Upload, 
  Users, 
  User,
  Calendar, 
  Clock, 
  Star,
  Rocket,
  Wand2,
  Trophy,
  Loader2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Trash2,
  History,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  X,
  Code,
  Coins,
  Leaf,
  Lightbulb,
  Globe,
  Lock
} from 'lucide-react';
import TextWithTables from '../components/TextWithTables';
import { motion, AnimatePresence } from 'framer-motion';

import { INTERNATIONAL_EXAMS, getNaplanDefaults } from '../data/examPresets';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, where, orderBy, deleteDoc, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { decryptText } from '../utils/crypto';
import { fetchWithRetry, generateContent, getModelForGrade } from '../utils/aiClient';
import { generateExplanations } from '../utils/generateExplanations';
import { safeParseAiJson } from '../utils/safeParseAiJson';
import { cleanFirestorePayload } from '../utils/cleanFirestorePayload';
import DynamicChart from '../components/DynamicChart';
import DynamicGeometry from '../components/DynamicGeometry';
import DynamicGridMap from '../components/DynamicGridMap';
import DynamicNumberLine from '../components/DynamicNumberLine';
import DynamicPathMap from '../components/DynamicPathMap';
import DynamicInstrument from '../components/DynamicInstrument';
import DynamicBlockStructure from '../components/DynamicBlockStructure';
import DynamicVennDiagram from '../components/DynamicVennDiagram';
import EarlyMathVisualizer from '../components/EarlyMathVisualizer';
import { ClockFace, parseQuestionText } from '../components/ClockFace';
import CurriculumModal from '../components/CurriculumModal';
import { getMasterPrompt } from '../services/promptsMasterRegistry';
import { curriculum } from '../data/curriculum';
import { SUPPORTED_LANGUAGES, getLanguageObj } from '../utils/languages';
import { getSmartTopicTitle, getCurriculumSubjectKey, sanitizeQuestionData } from '../utils/homeworkShared';
import InternationalExamHubView from '../components/InternationalExamHubView';
import PaperQuotaBoosterModal from '../components/PaperQuotaBoosterModal';
import { checkCanGeneratePaper, getBaseQuotaForPlan, recordPaperGeneration } from '../utils/quotaManager';
import { fetchPricing } from '../utils/pricingConfig';

export const resolveCustomSubjectStyle = (name) => {
  const s = (name || '').toLowerCase();

  // 1. Reading / Comprehension / Literacy / NAPLAN Reading
  if (s.includes('reading') || s.includes('comprehension') || s.includes('literacy')) {
    return {
      titleColor: 'text-rose-600',
      bgColor: 'bg-[#fff5f7]',
      borderColor: 'border-rose-200',
      selectedBorder: 'border-rose-500 ring-4 ring-rose-100',
      renderIcon: () => (
        <div className="w-16 h-20 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 shadow-inner border-4 border-rose-200">
          <BookOpen className="w-10 h-10 text-rose-500" />
        </div>
      )
    };
  }

  // 2. Writing / Vocabulary / Vocab / Grammar / Conventions / Spelling / NAPLAN Writing
  if (s.includes('writing') || s.includes('vocab') || s.includes('grammar') || s.includes('convention') || s.includes('spelling')) {
    return {
      titleColor: 'text-amber-600',
      bgColor: 'bg-[#fffbeb]',
      borderColor: 'border-amber-200',
      selectedBorder: 'border-amber-500 ring-4 ring-amber-100',
      renderIcon: () => (
        <div className="w-16 h-20 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 shadow-inner border-4 border-amber-200">
          <Pencil className="w-10 h-10 text-amber-500" />
        </div>
      )
    };
  }

  // 3. Numeracy / Math / Algebra / Geometry / Calculus / NAPLAN Numeracy
  if (s.includes('numeracy') || s.includes('math') || s.includes('algebra') || s.includes('geometry') || s.includes('calculus') || s.includes('number')) {
    return {
      titleColor: 'text-blue-600',
      bgColor: 'bg-[#eff6ff]',
      borderColor: 'border-blue-200',
      selectedBorder: 'border-blue-500 ring-4 ring-blue-100',
      renderIcon: () => (
        <div className="w-16 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shadow-inner border-4 border-blue-200">
          <Brain className="w-10 h-10 text-blue-500" />
        </div>
      )
    };
  }

  // 4. Hindi / Foreign Languages / World Studies
  if (s.includes('hindi') || s.includes('language') || s.includes('french') || s.includes('spanish') || s.includes('german') || s.includes('chinese') || s.includes('japanese') || s.includes('latin')) {
    return {
      titleColor: 'text-indigo-600',
      bgColor: 'bg-[#eef2ff]',
      borderColor: 'border-indigo-200',
      selectedBorder: 'border-indigo-500 ring-4 ring-indigo-100',
      renderIcon: () => (
        <div className="w-16 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 shadow-inner border-4 border-indigo-200">
          <Globe className="w-10 h-10 text-indigo-500" />
        </div>
      )
    };
  }

  // 5. History / Social Studies / Civics
  if (s.includes('history') || s.includes('social') || s.includes('civics') || s.includes('empire') || s.includes('war')) {
    return {
      titleColor: 'text-orange-600',
      bgColor: 'bg-[#fff7ed]',
      borderColor: 'border-orange-200',
      selectedBorder: 'border-orange-500 ring-4 ring-orange-100',
      renderIcon: () => (
        <div className="w-16 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 shadow-inner border-4 border-orange-200">
          <History className="w-10 h-10 text-orange-500" />
        </div>
      )
    };
  }

  // 6. Logical Reasoning / Logic / Reasoning / Critical Thinking
  if (s.includes('logic') || s.includes('reasoning') || s.includes('thinking') || s.includes('puzzle')) {
    return {
      titleColor: 'text-amber-600',
      bgColor: 'bg-[#fffbeb]',
      borderColor: 'border-amber-200',
      selectedBorder: 'border-amber-500 ring-4 ring-amber-100',
      renderIcon: () => (
        <div className="w-16 h-20 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 shadow-inner border-4 border-amber-200">
          <Lightbulb className="w-10 h-10 text-amber-500" />
        </div>
      )
    };
  }

  // 7. Environmental Science / Ecology / Nature / Geography
  if (s.includes('environment') || s.includes('ecology') || s.includes('nature') || s.includes('geography') || s.includes('plant')) {
    return {
      titleColor: 'text-teal-600',
      bgColor: 'bg-[#f0fdf4]',
      borderColor: 'border-teal-200',
      selectedBorder: 'border-teal-500 ring-4 ring-teal-100',
      renderIcon: () => (
        <div className="w-16 h-20 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 shadow-inner border-4 border-teal-200">
          <Leaf className="w-10 h-10 text-teal-500" />
        </div>
      )
    };
  }

  // 8. Science / Physics / Chemistry / Biology
  if (s.includes('science') || s.includes('physics') || s.includes('chem') || s.includes('bio')) {
    return {
      titleColor: 'text-green-600',
      bgColor: 'bg-[#f0fdf4]',
      borderColor: 'border-green-200',
      selectedBorder: 'border-green-500 ring-4 ring-green-100',
      renderIcon: () => (
        <div className="w-16 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-inner border-4 border-green-200">
          <FlaskConical className="w-10 h-10 text-green-500" />
        </div>
      )
    };
  }

  // 9. Art / Music / Creative
  if (s.includes('art') || s.includes('music') || s.includes('drama') || s.includes('creative') || s.includes('design')) {
    return {
      titleColor: 'text-fuchsia-600',
      bgColor: 'bg-[#fdf4ff]',
      borderColor: 'border-fuchsia-200',
      selectedBorder: 'border-fuchsia-500 ring-4 ring-fuchsia-100',
      renderIcon: () => (
        <div className="w-16 h-20 bg-fuchsia-100 rounded-full flex items-center justify-center text-fuchsia-600 shadow-inner border-4 border-fuchsia-200">
          <Sparkles className="w-10 h-10 text-fuchsia-500" />
        </div>
      )
    };
  }

  // Fallback for any other custom subject
  return {
    titleColor: 'text-purple-600',
    bgColor: 'bg-[#faf5ff]',
    borderColor: 'border-purple-200',
    selectedBorder: 'border-purple-500 ring-4 ring-purple-100',
    renderIcon: () => (
      <div className="w-16 h-20 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 shadow-inner border-4 border-purple-200">
        <Book className="w-10 h-10 text-purple-500" />
      </div>
    )
  };
};



const resolveGradeFromClassroomName = (classroomName) => {
  if (!classroomName) return 'Grade 1';
  // Foundation detection
  if (classroomName.toLowerCase().includes('foundation')) return 'Foundation';
  const match = classroomName.match(/\d+/);
  if (match) {
    const num = parseInt(match[0], 10);
    if (num >= 1 && num <= 12) {
      return `Grade ${num}`;
    }
  }
  return 'Grade 1';
};

const SUBJECTS = [
  { 
    id: 'english', 
    name: 'English', 
    titleColor: 'text-orange-500',
    bgColor: 'bg-[#fffdf0]', 
    borderColor: 'border-orange-200',
    selectedBorder: 'border-orange-400 ring-4 ring-orange-100',
    desc: 'Reading, writing, grammar and more!',
    renderGraphic: () => (
      <div className="w-16 h-20 bg-orange-500 rounded-lg flex items-center justify-center text-white font-black text-2xl shadow-[0_4px_0_0_#c2410c] transform -rotate-6">
        Aa
      </div>
    )
  },
  { 
    id: 'maths', 
    name: 'Maths', 
    titleColor: 'text-blue-500',
    bgColor: 'bg-[#f4faff]', 
    borderColor: 'border-blue-200',
    selectedBorder: 'border-blue-400 ring-4 ring-blue-100',
    desc: 'Numbers, shapes, patterns and more!',
    renderGraphic: () => (
      <div className="flex gap-1 transform rotate-2">
        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-black shadow-[0_4px_0_0_#c2410c] -translate-y-2">1</div>
        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-black shadow-[0_4px_0_0_#15803d]">2</div>
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-black shadow-[0_4px_0_0_#1d4ed8] translate-y-2">3</div>
      </div>
    )
  },
  { 
    id: 'science', 
    name: 'Science', 
    titleColor: 'text-green-600',
    bgColor: 'bg-[#f4fbf4]', 
    borderColor: 'border-green-200',
    selectedBorder: 'border-green-500 ring-4 ring-green-100',
    desc: 'Discover, explore and learn amazing things!',
    renderGraphic: () => (
      <div className="w-16 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 shadow-inner overflow-hidden border-4 border-green-200">
        <FlaskConical className="w-10 h-10 text-green-500" />
      </div>
    )
  },
  { 
    id: 'olympiad', 
    name: 'Olympiad', 
    titleColor: 'text-purple-600',
    bgColor: 'bg-[#f8f5ff]', 
    borderColor: 'border-purple-200',
    selectedBorder: 'border-purple-500 ring-4 ring-purple-100',
    desc: 'Advanced problem-solving & logic!',
    renderGraphic: () => (
      <div className="w-16 h-20 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 shadow-inner overflow-hidden border-4 border-purple-200">
        <Trophy className="w-10 h-10 text-purple-500" />
      </div>
    )
  },
  { 
    id: 'computer_science', 
    name: 'Computer Science', 
    titleColor: 'text-cyan-600',
    bgColor: 'bg-[#f0fdfa]', 
    borderColor: 'border-cyan-200',
    selectedBorder: 'border-cyan-500 ring-4 ring-cyan-100',
    desc: 'Coding, Python, Web & AI Ethics!',
    renderGraphic: () => (
      <div className="w-16 h-20 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 shadow-inner overflow-hidden border-4 border-cyan-200">
        <Code className="w-10 h-10 text-cyan-500" />
      </div>
    )
  },
  { 
    id: 'financial_literacy', 
    name: 'Financial Literacy', 
    titleColor: 'text-emerald-600',
    bgColor: 'bg-[#ecfdf5]', 
    borderColor: 'border-emerald-200',
    selectedBorder: 'border-emerald-500 ring-4 ring-emerald-100',
    desc: 'Money, saving, investing & business!',
    renderGraphic: () => (
      <div className="w-16 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-inner overflow-hidden border-4 border-emerald-200">
        <Coins className="w-10 h-10 text-emerald-500" />
      </div>
    )
  },
  { 
    id: 'environmental_science', 
    name: 'Environmental Science', 
    titleColor: 'text-teal-600',
    bgColor: 'bg-[#f0fdf4]', 
    borderColor: 'border-teal-200',
    selectedBorder: 'border-teal-500 ring-4 ring-teal-100',
    desc: 'Ecology, clean energy & sustainability!',
    renderGraphic: () => (
      <div className="w-16 h-20 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 shadow-inner overflow-hidden border-4 border-teal-200">
        <Leaf className="w-10 h-10 text-teal-500" />
      </div>
    )
  },
  { 
    id: 'logical_reasoning', 
    name: 'Logical Reasoning', 
    titleColor: 'text-amber-600',
    bgColor: 'bg-[#fffbeb]', 
    borderColor: 'border-amber-200',
    selectedBorder: 'border-amber-500 ring-4 ring-amber-100',
    desc: 'Logic, puzzles, patterns & problem solving!',
    renderGraphic: () => (
      <div className="w-16 h-20 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 shadow-inner overflow-hidden border-4 border-amber-200">
        <Lightbulb className="w-10 h-10 text-amber-500" />
      </div>
    )
  }
];

export default function HomeworkGenerator({ user, classrooms = [], activeClassroom, initialDraft, initialExam, subjectPrompts, onHomeworkCreated, teacherBilling, teacherData, allHomeworks = [], setDashboardTab, isAdmin, isSuperUser }) {
  const [assignmentType, setAssignmentType] = useState(initialDraft ? (initialDraft.type || 'homework') : (initialExam ? 'test' : null));
  const [formData, setFormData] = useState({
    subject: initialExam ? initialExam.subject : 'maths',
    title: initialExam ? `${initialExam.name} Practice Paper` : '',
    instructions: initialExam ? `Read each question carefully. You are on a ${initialExam.defaultTime}-minute timer! ⏳` : (assignmentType === 'test' ? 'Read each question carefully. You are on a timer! ⏳' : 'Read each question carefully and select the best answer! 🚀'),
    aiPrompt: initialExam ? initialExam.promptInstruction : '',
    classId: activeClassroom?.id || '',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '',
    points: '10',
    timeLimit: initialExam ? String(initialExam.defaultTime) : '30',
    marksPerQuestion: '5',
    assignType: 'all',
    assignedStudentIds: [],
    difficulty: 'Medium',
    examPreset: initialExam ? initialExam.id : null,
    isExamPaper: !!initialExam
  });

  useEffect(() => {
    // Reset/initialize form if initialDraft or initialExam changes
    if (initialDraft) {
      setAssignmentType(initialDraft.type || 'homework');
      setFormData({
        subject: initialDraft.subject || 'maths',
        title: initialDraft.title || '',
        instructions: initialDraft.instructions || '',
        aiPrompt: initialDraft.aiPrompt || '',
        classId: initialDraft.assignedClassId || '',
        dueDate: initialDraft.dueDate || '',
        time: initialDraft.time || '',
        points: initialDraft.points || '10',
        timeLimit: initialDraft.timeLimit || '30',
        marksPerQuestion: initialDraft.marksPerQuestion || '5',
        assignType: initialDraft.assignType || 'all',
        assignedStudentIds: initialDraft.assignedStudentIds || [],
        difficulty: initialDraft.difficulty || 'Medium',
        examPreset: initialDraft.examPreset || null,
        isExamPaper: initialDraft.isExamPaper || false
      });
      if (initialDraft.questions && initialDraft.questions.length > 0) {
        setGeneratedQuestions(initialDraft.questions);
        setCurrentStep('preview');
      }
    } else if (initialExam) {
      setAssignmentType('test');
      setFormData({
        subject: initialExam.subject,
        title: `${initialExam.name} Practice Paper`,
        instructions: `Read each question carefully. You are on a ${initialExam.defaultTime}-minute timer! ⏳`,
        aiPrompt: initialExam.promptInstruction,
        classId: activeClassroom?.id || '',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '',
        points: '10',
        timeLimit: String(initialExam.defaultTime),
        marksPerQuestion: '5',
        assignType: 'all',
        assignedStudentIds: [],
        difficulty: 'Medium',
        examPreset: initialExam.id,
        isExamPaper: true
      });
    }
  }, [initialDraft, initialExam, activeClassroom]);

  // Handle URL callback for successful booster credit purchase
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showBoosterModal, setShowBoosterModal] = useState(false);
  const topUpCredits = teacherBilling?.topUpCredits || 0;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('booster_success') === 'true') {
      const addedCredits = parseInt(params.get('credits'), 10) || 15;
      alert(`🎉 Success! +${addedCredits} Paper Credits have been purchased and added to your account!`);
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [user?.uid]);

  const [pricingData, setPricingData] = React.useState(null);
  React.useEffect(() => { fetchPricing().then(p => { if(p) setPricingData(p); }); }, []);

  const activePlanId = (teacherBilling && ['active', 'trialing'].includes(teacherBilling.status)) ? teacherBilling.planId : 'free';

  const quotaInfo = checkCanGeneratePaper({
    user,
    teacherProfile: teacherData || teacherBilling || {},
    teacherBilling,
    isAdmin,
    isSuperUser,
    activePlanId,
    allHomeworks,
    topUpCredits,
    pricing: pricingData || undefined
  });

  const hasReachedLimit = !quotaInfo.canGenerate;

  const limitText = (() => {
    if (isAdmin || isSuperUser) return '';
    if (quotaInfo.isUnlimited) return '';
    return `Monthly Quota: ${quotaInfo.usage} / ${quotaInfo.limit} Papers Used`;
  })();

  const checkLimitAndTrigger = () => {
    if (initialDraft?.id) {
      // Modifying an existing draft/homework is allowed
      return false;
    }
    if (hasReachedLimit) {
      if (activePlanId === 'free') {
        setShowUpgradeModal(true);
      } else {
        setShowBoosterModal(true);
      }
      return true;
    }
    return false;
  };

  const [students, setStudents] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');

  const [isCurriculumMode, setIsCurriculumMode] = useState(true);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('en');

  const [customTopics, setCustomTopics] = useState(() => {
    try {
      const saved = localStorage.getItem('hwz_custom_topics');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!user?.uid) return;
    const loadCustomTopics = async () => {
      try {
        const teacherDoc = await getDoc(doc(db, 'teachers', user.uid));
        if (teacherDoc.exists() && Array.isArray(teacherDoc.data().customTopics)) {
          setCustomTopics(teacherDoc.data().customTopics);
          localStorage.setItem('hwz_custom_topics', JSON.stringify(teacherDoc.data().customTopics));
        }
      } catch (err) {
        console.warn("Failed to fetch custom topics from Firestore:", err);
      }
    };
    loadCustomTopics();
  }, [user?.uid]);

  const currentGradeName = resolveGradeFromClassroomName(activeClassroom?.name);
  const currentSubjectKey = getCurriculumSubjectKey(formData.subject);

  const currentSubjectTopics = curriculum[currentGradeName]?.[currentSubjectKey] || [];
  const matchingCustomTopics = (customTopics || []).filter(ct => {
    if (ct.subject) return ct.subject.toLowerCase() === formData.subject?.toLowerCase();
    return true;
  });

  const hasTopicsForCurrentSubject = (currentSubjectTopics.length + matchingCustomTopics.length) > 0;

  useEffect(() => {
    if (!hasTopicsForCurrentSubject) {
      setIsCurriculumMode(false);
      setSelectedSkills([]);
    }
  }, [formData.subject, hasTopicsForCurrentSubject]);

  const handleAddCustomTopic = async (newTopic) => {
    const updated = [...customTopics, newTopic];
    setCustomTopics(updated);
    localStorage.setItem('hwz_custom_topics', JSON.stringify(updated));
    if (user?.uid) {
      try {
        await setDoc(doc(db, 'teachers', user.uid), { customTopics: updated }, { merge: true });
      } catch (err) {
        console.error("Failed to save custom topic to Firestore:", err);
      }
    }
  };

  const handleDeleteCustomTopic = async (topicId) => {
    const updated = customTopics.filter(t => t.id !== topicId);
    setCustomTopics(updated);
    localStorage.setItem('hwz_custom_topics', JSON.stringify(updated));
    if (user?.uid) {
      try {
        await setDoc(doc(db, 'teachers', user.uid), { customTopics: updated }, { merge: true });
      } catch (err) {
        console.error("Failed to delete custom topic from Firestore:", err);
      }
    }
  };

  useEffect(() => {
    if (!user?.uid || !formData.classId) {
      setStudents([]);
      return;
    }
    setIsLoadingStudents(true);
    const studentsRef = collection(db, 'teachers', user.uid, 'classrooms', formData.classId, 'students');
    const unsubscribe = onSnapshot(studentsRef, (snap) => {
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudents(list);
      setIsLoadingStudents(false);
    }, (err) => {
      console.error("Error listening to students for generator:", err);
      setIsLoadingStudents(false);
    });

    return () => unsubscribe();
  }, [formData.classId, user?.uid]);

  const lastSubjectRef = useRef(formData.subject);

  useEffect(() => {
    // Never overwrite the exam-specific promptInstruction with a generic My Prompts entry.
    // isExamPaper is set when any International Exam preset is selected.
    if (formData.isExamPaper) return;

    const normSubject = (formData.subject || '').toLowerCase();
    const matchedKey = subjectPrompts ? Object.keys(subjectPrompts).find(k => k.toLowerCase() === normSubject) : null;
    
    // Auto-fill on manual subject change, or if it is the first load and aiPrompt is empty
    if (formData.subject !== lastSubjectRef.current || !formData.aiPrompt) {
      lastSubjectRef.current = formData.subject;
      if (matchedKey && subjectPrompts[matchedKey]) {
        setFormData(prev => ({ ...prev, aiPrompt: subjectPrompts[matchedKey] }));
      } else {
        setFormData(prev => ({ ...prev, aiPrompt: getMasterPrompt(formData.subject) }));
      }
    }
  }, [formData.subject, subjectPrompts, formData.isExamPaper]);

  const getDynamicSubjects = () => {
    const list = [...SUBJECTS];
    const isExamKey = (k) => {
      const lk = (k || '').toLowerCase().trim();
      return (
        lk.startsWith('naplan') || 
        lk.startsWith('digital_sat') || 
        lk.startsWith('act_') || 
        lk.startsWith('icas_') || 
        lk.startsWith('seamo_') || 
        lk.startsWith('nsw_selective')
      );
    };

    if (subjectPrompts) {
      Object.keys(subjectPrompts).forEach(key => {
        if (subjectPrompts[key] === null || isExamKey(key)) return;
        const lowerKey = key.toLowerCase().trim();
        if (!list.some(s => s.id === lowerKey)) {
          const style = resolveCustomSubjectStyle(key);
          list.push({
            id: lowerKey,
            name: key.charAt(0).toUpperCase() + key.slice(1),
            titleColor: style.titleColor,
            bgColor: style.bgColor,
            borderColor: style.borderColor,
            selectedBorder: style.selectedBorder,
            desc: `Custom subject template for ${key.toLowerCase()}!`,
            renderGraphic: style.renderIcon
          });
        }
      });
    }
    if (activeClassroom?.subjects) {
      activeClassroom.subjects.forEach(subjectName => {
        if (isExamKey(subjectName)) return;
        const lowerKey = subjectName.toLowerCase().trim();
        if (!list.some(s => s.id === lowerKey)) {
          const style = resolveCustomSubjectStyle(subjectName);
          list.push({
            id: lowerKey,
            name: subjectName.charAt(0).toUpperCase() + subjectName.slice(1),
            titleColor: style.titleColor,
            bgColor: style.bgColor,
            borderColor: style.borderColor,
            selectedBorder: style.selectedBorder,
            desc: `Classroom subject: ${subjectName}`,
            renderGraphic: style.renderIcon
          });
        }
      });
    }
    return list;
  };
  
  // Real-time AI key resolution will be done on-the-fly during generation.
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaperRecorded, setIsPaperRecorded] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isDiscardingDraft, setIsDiscardingDraft] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState(null);
  const [generatedPassage, setGeneratedPassage] = useState(null);
  const [generatedPassagesList, setGeneratedPassagesList] = useState(null);
  const [generatedModelUsed, setGeneratedModelUsed] = useState(null);
  const [isAiAccepted, setIsAiAccepted] = useState(false);

  // Book Generator State (Pixar 12-Step Master Prompt)
  const [bookGenre, setBookGenre] = useState('Fantasy & Magic');
  const [storyThemeCategory, setStoryThemeCategory] = useState('random');
  const [customStoryPrompt, setCustomStoryPrompt] = useState('');
  const [selectedAiModel, setSelectedAiModel] = useState(() => localStorage.getItem('hwz_active_ai') || 'anthropic');
  const [openAiKey, setOpenAiKey] = useState(() => localStorage.getItem('hwz_openai_key') || '');
  const [bookTopic, setBookTopic] = useState('');
  const [bookCharacters, setBookCharacters] = useState('');
  const [bookTone, setBookTone] = useState('Inspiring & Fun');
  const [bookIllustrationStyle, setBookIllustrationStyle] = useState('Pixar 3D CGI');
  const [bookPageCount, setBookPageCount] = useState(5);
  const [generatedBook, setGeneratedBook] = useState(null);
  const [isGeneratingBook, setIsGeneratingBook] = useState(false);
  const [bookGenStatus, setBookGenStatus] = useState('');
  const [activePreviewPage, setActivePreviewPage] = useState(0);

  // Prompt Inspector State
  const [showPromptInspector, setShowPromptInspector] = useState(false);
  const [customPromptOverride, setCustomPromptOverride] = useState('');
  const [showPromptModal, setShowPromptModal] = useState(false);

  const fetchGptImage = async (promptText) => {
    console.log('[OpenAI Image Studio] Initiating image generation for prompt:', promptText?.substring(0, 60) + '...');
    try {
      // 1. Try Vercel Serverless proxy (/api/generate-image) powered by server environment variable OPENAI_API_KEY
      const vercelRes = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });

      if (vercelRes.ok) {
        const vercelData = await vercelRes.json();
        if (vercelData?.url) {
          console.log(`[OpenAI Image Studio] ✅ Success! Image received via ${vercelData.provider || 'proxy'}.`);
          return vercelData.url;
        }
      } else {
        const errJson = await vercelRes.json().catch(() => ({}));
        console.warn(`[OpenAI Image Studio] Vercel proxy returned status ${vercelRes.status}:`, errJson.error || 'Unknown error');
      }
    } catch (err) {
      console.warn('[OpenAI Image Studio] Proxy call encountered error, falling back to Multi-Engine Cascade:', err);
    }
    return null;
  };

  // Multi-Engine Cascade pre-rendering to handle high concurrency and rate-limits seamlessly
  const fetchImageAsBase64 = async (promptText) => {
    if (!promptText) return '';

    // First attempt OpenAI Image Studio if API key is configured
    const gptImg = await fetchGptImage(promptText);
    if (gptImg) return gptImg;

    // Fallback to Multi-Engine Flux/Turbo Cascade
    const encoded = encodeURIComponent(promptText);
    const engines = [
      `https://image.pollinations.ai/prompt/${encoded}?width=640&height=640&nologo=true&model=flux`,
      `https://image.pollinations.ai/prompt/${encoded}?width=640&height=640&nologo=true&model=turbo`,
      `https://image.pollinations.ai/prompt/${encoded}?width=512&height=512&nologo=true`
    ];

    for (let engineUrl of engines) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 12000);
          const res = await fetch(engineUrl, { signal: controller.signal });
          clearTimeout(timeoutId);

          if (res.status === 429) {
            console.warn(`Engine 429 rate limit hit, failing over to alternative model...`);
            await new Promise((r) => setTimeout(r, 1000));
            break; // Failover to next engine in cascade
          }

          if (!res.ok) break;

          const blob = await res.blob();
          if (blob.size < 100) break;

          return await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result || engineUrl);
            reader.onerror = () => resolve(engineUrl);
            reader.readAsDataURL(blob);
          });
        } catch (e) {
          if (e.name === 'AbortError') {
            console.log('Engine request timed out, switching to failover model...');
          } else {
            console.warn('Engine attempt fallback:', e);
          }
          await new Promise((r) => setTimeout(r, 600));
        }
      }
    }
    return `https://image.pollinations.ai/prompt/${encoded}?width=640&height=640&nologo=true`;
  };

  const getConstructedPixarPrompt = () => {
    if (customPromptOverride && customPromptOverride.trim()) {
      return customPromptOverride;
    }

    const resolvedGrade = resolveGradeFromClassroomName(activeClassroom?.name);
    const selectedLangObj = getLanguageObj(targetLanguage || 'en');
    const isNonEnglish = targetLanguage && targetLanguage !== 'en';

    // Dynamic seed arrays categorized into Space, Friends/Humans, Animals, Fantasy, Dinosaurs
    const SEED_CATEGORIES = {
      space: {
        name: "Space & Galaxy Exploration",
        heroes: [
          "Captain Leo, a 7-year-old human astronaut with a solar-powered jetpack",
          "Orion, a friendly alien kid from Planet Stardust who loves space-cookies",
          "Astro-Pug Barnaby, a brave dog piloting the Moon Rover",
          "Maya, a young star-mapper exploring the glowing rings of Saturn",
          "Ziggy the cosmic robot who repairs broken satellites with singing lasers",
          "Eliana, a human space explorer who builds a friendship with a friendly moon-creature"
        ],
        settings: [
          "The Neon Galaxy Nebula filled with floating stardust islands",
          "The Moon Station Observatory above planet Earth",
          "The Ringed City of Saturn with zero-gravity playgrounds",
          "The Meteor Crater Colony on Mars"
        ],
        quests: [
          "repairing the Starlight Compass before the solar eclipse",
          "rescuing a lost baby comet and guiding it back to the Milky Way",
          "winning the Intergalactic Jetpack Race through the Asteroid Belt"
        ]
      },
      friends: {
        name: "Friendship & Human Kids",
        heroes: [
          "Mia and Kai, two 8-year-old best friends and backyard inventors",
          "Aisha and Sam, elementary school classmates solving neighborhood mysteries",
          "Lucas and his big sister Clara on a weekend camping trip",
          "Zoe, a creative young girl building a giant cardboard castle with her best friend Noah",
          "Ethan and Maya, two playground teammates building a solar-powered go-kart"
        ],
        settings: [
          "The Oak Treehouse Workshop in a cozy suburban backyard",
          "The Elementary School Science Fair & Discovery Hall",
          "The Whispering Woods Camping Site near Pine Lake",
          "The Sunny Neighborhood Park & Secret Garden"
        ],
        quests: [
          "building the world's highest treehouse observatory",
          "solving the mystery of the missing school mascot",
          "winning the Annual Neighborhood Soapbox Derby with teamwork",
          "organizing a surprise community garden for their favorite teacher"
        ]
      },
      animals: {
        name: "Animal & Nature Adventures",
        heroes: [
          "Barnaby the brave badger who loves star-gazing and telescopes",
          "Kiko the adventurous red panda searching for the lost bamboo valley",
          "Finn the friendly sea-turtle who talks to colorful coral reefs",
          "Skye the soaring eagle chick learning to ride high mountain winds",
          "Milo the beaver architect who builds floating island bridges for forest friends",
          "Penny the penguin explorer wearing a bright yellow raincoat"
        ],
        settings: [
          "The Great Redwood Forest & Crystal Stream",
          "The Bioluminescent Coral Reef Bay",
          "The Misty Bamboo Valley of Snow Mountains",
          "The Emerald Jungle Canopy & Waterfall Lagoon"
        ],
        quests: [
          "saving the Great Coral Reef by planting glowing sea-kelp",
          "discovering the secret of the Golden Sunpetal Flower",
          "helping all the forest animals cross the rushing river before winter"
        ]
      },
      fantasy: {
        name: "Fantasy, Magic & Fairytales",
        heroes: [
          "Zari the curious dragon who breathes colorful fireworks instead of fire",
          "Princess Iris and her magical pegasus soaring over Cloud Kingdom",
          "Brix the friendly steam-powered robot with a heart of gold",
          "Pip the glowing forest sprite repairing the Tree of Life"
        ],
        settings: [
          "The Clockwork Sky Kingdom floating above the clouds",
          "The Enchanted Marshmallow Mountains & Candy Creek",
          "The Magic Academy Library where books fly like butterflies"
        ],
        quests: [
          "solving the mystery of the vanishing Rainbow Music Notes",
          "rescuing the Sleeping Tree King with kindness and courage"
        ]
      },
      dinosaurs: {
        name: "Dinosaurs & Prehistoric Quests",
        heroes: [
          "Toby the time-traveling turtle who meets friendly baby Triceratops",
          "Rexy the gentle herbivore T-Rex who loves planting flowers",
          "Dara the brave young Pterodactyl chick learning to glide"
        ],
        settings: [
          "The Hidden Dinosaur Valley of Giant Singing Ferns",
          "The Volcanic Oasis of Crystal Waterfalls"
        ],
        quests: [
          "helping a lost baby Stegosaurus find its herd",
          "discovering a glowing prehistoric crystal deep inside the Lava Cave"
        ]
      }
    };

    const categoryKeys = Object.keys(SEED_CATEGORIES);
    const chosenCatKey = (storyThemeCategory && storyThemeCategory !== 'random' && SEED_CATEGORIES[storyThemeCategory])
      ? storyThemeCategory
      : categoryKeys[Math.floor(Math.random() * categoryKeys.length)];

    const selectedCategoryObj = SEED_CATEGORIES[chosenCatKey];
    const randomHero = selectedCategoryObj.heroes[Math.floor(Math.random() * selectedCategoryObj.heroes.length)];
    const randomSetting = selectedCategoryObj.settings[Math.floor(Math.random() * selectedCategoryObj.settings.length)];
    const randomQuest = selectedCategoryObj.quests[Math.floor(Math.random() * selectedCategoryObj.quests.length)];
    const uniqueNonce = `${Date.now()}_${Math.floor(Math.random() * 999999)}`;

    return `You are an award-winning children's author, illustrator, curriculum designer, storyteller, and Pixar-level creative director.

Your task is to generate a completely NEW and ORIGINAL children's storybook every single time this prompt is executed.

MANDATORY CREATIVE SEED (UNIQUE GENERATION MANDATE #${uniqueNonce}):
You MUST invent a completely UNIQUE main character and story world for this execution.
Category Focus: ${selectedCategoryObj.name}

REQUIRED CREATIVE INSPIRATION FOR THIS SEED:
• Hero Archetype: ${randomHero}
• Unique Setting: ${randomSetting}
• Core Quest: ${randomQuest}

=========================================================
INPUT SPECIFICATIONS
=========================================================
• Target Grade / Reading Level: ${resolvedGrade}
• Illustration Style: ${bookIllustrationStyle}
• Number of Pages: ${bookPageCount} (Maximum 5 pages)
• Target Language: ${selectedLangObj.name} (${selectedLangObj.nativeName})

${customStoryPrompt ? `=========================================================
TEACHER CUSTOM CHARACTER & STORY DIRECTIVE (MANDATORY):
=========================================================
The teacher has provided specific custom character details, setting, plot, and story instructions:
"${customStoryPrompt}"

CRITICAL MANDATE: You MUST build the story around these exact custom characters, visual features, species, plot points, and lesson!
` : ''}

${isNonEnglish ? `=========================================================
CRITICAL MULTI-LANGUAGE DIRECTIVE
=========================================================
You MUST write the ENTIRE storybook — including Title, Subtitle, Back Cover Summary, Story Page Narration Text, Character Dialogue, Vocabulary word definitions, Pronunciations, Fun Facts, Comprehension Questions, and Parent Reflection Section — in ${selectedLangObj.name} (${selectedLangObj.nativeName}).

IMPORTANT EXCEPTION FOR IMAGE PROMPTS:
Keep all "coverImagePrompt" and page "imagePrompt" strings in ENGLISH so that AI text-to-image engines can accurately render the 8K illustrations.` : ''}

=========================================================
STEP 1 — RANDOMLY GENERATE THE STORY WORLD
=========================================================
Randomly generate ALL of the following:
• Story title (written in ${selectedLangObj.name})
• Subtitle (written in ${selectedLangObj.name})
• Genre
• Age group / Reading level (Suitable for ${resolvedGrade})
• Theme & Moral
• Setting, Time period & World type

Possible worlds include (do not limit yourself):
Fantasy, Jungle, Ocean, Outer Space, Dinosaur Age, Fairy Kingdom, Robot City, Candy Land, Pirate Island, Dragon Valley, Underwater Kingdom, Cloud Kingdom, Ancient Egypt, Ancient India, Haunted (friendly) Castle, Safari, Farm, Arctic, Volcano Island, Toy World, Magical Forest, Minecraft-inspired world, Steampunk City, Future Earth, Galaxy Adventure, Dream World, Animal Kingdom, Rainbow World, Monster School, Magic Academy, or invent something completely new.

=========================================================
STEP 2 — CREATE ORIGINAL CHARACTERS & VISUAL ANCHOR
=========================================================
Generate unique memorable characters.
Main Hero: Name, Age, Personality, Weakness, Strength, Goal.
Supporting Characters: Friends, Mentor, Funny Sidekick, Optional Villain, Animals, Magical Creatures.
Every character should have: Appearance, Colours, Personality, Speech style, Unique behaviour, Signature catchphrase.

CRITICAL CHARACTER CONSISTENCY DIRECTIVE:
You MUST create a dedicated "heroVisualAnchor" string that precisely defines the main character's species, body colors, clothing/scales, eye color, and visual features.
Example: "Dara, a young baby teal-blue pterodactyl with soft yellow wingtips, large expressive amber eyes, smooth scales."
- The hero MUST remain EXACTLY the same species, body color, and outfit on EVERY single page.
- NEVER introduce human characters into animal or dinosaur stories (unless the main hero was explicitly defined as a human child).
- Every page "imagePrompt" MUST start with the main hero's name and exact species.

=========================================================
STEP 3 — STORY STRUCTURE
=========================================================
Write a complete professionally structured story spanning exactly ${bookPageCount} pages (Maximum 5 pages).
Beginning: Introduce world, hero, goal, inciting incident.
Middle: Adventure, challenges, puzzles, friendship, problem solving, funny moments, twists, learning moments.
Ending: Final challenge, emotional climax, resolution, celebration, happy ending, life lesson.

=========================================================
STEP 4 — EDUCATIONAL VALUE
=========================================================
Naturally teach one or more concepts (Kindness, Friendship, Honesty, Sharing, Respect, Teamwork, Courage, Creativity, Problem Solving, Science, Nature, Animals, Space, Geography, Math, Reading, Healthy eating, Exercise, Environment, Recycling, Growth mindset, Resilience, Empathy). The lesson should never feel forced.

=========================================================
STEP 5 — COMIC PICTURE BOOK PAGE LAYOUT (${bookPageCount} PAGES - MAX 5 PAGES)
=========================================================
CRITICAL PICTURE BOOK NARRATION DIRECTIVE:
Keep the narration text for EVERY page STRICTLY 15 TO 30 WORDS MAXIMUM (1 to 2 short, punchy comic-book sentences with dialogue, suited for ${resolvedGrade}). Do NOT write long paragraphs. Each panel must fit cleanly like a comic book picture panel!

=========================================================
STEP 6 & 7 — ILLUSTRATION STYLE & IMAGE PROMPTS
=========================================================
Selected Illustration Style: ${bookIllustrationStyle}.
For EVERY page, generate a professional AI illustration prompt that DIRECTLY DEPICTS the exact scene, character action, and setting taking place in that specific page's text narration. Include character consistency (same hero appearance, clothing, species, colors on every page), visual pose, expressions, lighting, composition, camera angle, background objects, environment, depth of field, ultra detailed, 8K, children's book quality, no text inside illustration. Must be in English.

=========================================================
STEP 8 — VOCABULARY & GRAMMAR (PARTS OF SPEECH)
=========================================================
After every page include 2-4 challenging vocabulary words used in that page's text:
- Word (exact word used in the narration text)
- Part of Speech (Noun, Verb, Adjective, Adverb, Preposition, Conjunction, Pronoun, Interjection)
- Meaning (in ${selectedLangObj.name})
- Pronunciation
- Interesting Fact (in ${selectedLangObj.name})

=========================================================
STEP 9 — PARENT SECTION
=========================================================
At the end generate (in ${selectedLangObj.name}): Discussion Questions, Activities (Drawing Activity, Science Activity, Craft), Vocabulary Quiz, Life Lesson.

=========================================================
STEP 10 — COVER PAGE
=========================================================
Generate: Book Cover Title (in ${selectedLangObj.name}), Subtitle, Back Cover Summary, Front Cover Illustration Prompt (in ${bookIllustrationStyle} style, in English, no text).

=========================================================
STEP 11 — CONSISTENCY & QUALITY
=========================================================
The finished book should feel professionally published by companies like Disney, Pixar, DreamWorks, Scholastic, Penguin Kids, HarperCollins Children, Walker Books. The text narration should be punchy, short, comic-book style, and beautifully structured.

=========================================================
CRITICAL OUTPUT FORMAT REQUIREMENT:
=========================================================
You MUST return ONLY a valid JSON object matching the exact schema below. Do not include markdown code block backticks, intro text, or conversational response.

EXPECTED JSON SCHEMA:
{
  "title": "Book Cover Title in ${selectedLangObj.name}",
  "subtitle": "Catchy Subtitle in ${selectedLangObj.name}",
  "genre": "Randomly Generated Genre",
  "emoji": "Single representative emoji (e.g. 🚀, 🐉, 🐢, 🧭, 🌲)",
  "targetGrade": "${resolvedGrade}",
  "summary": "Back Cover Summary (2-3 sentences in ${selectedLangObj.name})",
  "illustrationStyle": "${bookIllustrationStyle}",
  "heroVisualAnchor": "Dara, a young baby teal-blue pterodactyl with soft yellow wingtips, large expressive amber eyes, smooth scales",
  "coverImagePrompt": "Detailed front cover illustration prompt in English, in ${bookIllustrationStyle} style, 8k, children's book quality, no text",
  "pages": [
    {
      "pageNumber": 1,
      "text": "STRICT 15-30 words MAX (1-2 punchy comic sentences in ${selectedLangObj.name} suited for ${resolvedGrade})...",
      "cameraAngle": "Wide Angle / Medium Shot / Close-up",
      "mood": "Enchanted / Adventurous / Mysterious",
      "vocabHighlights": [
        {
          "word": "courageous",
          "partOfSpeech": "Adjective",
          "definition": "Brave and ready to face danger or pain.",
          "pronunciation": "kuh-rey-juhs",
          "fact": "Interesting fun fact in ${selectedLangObj.name} about the word or concept"
        }
      ]
    }
  ],
  "comprehensionQuestions": [
    {
      "id": 1,
      "question": "Comprehension question in ${selectedLangObj.name} testing story understanding?",
      "options": ["Correct Answer in ${selectedLangObj.name}", "Option B", "Option C", "Option D"],
      "answer": "Correct Answer in ${selectedLangObj.name}",
      "explanation": "Why this answer is correct in ${selectedLangObj.name} based on the story."
    }
  ],
  "parentSection": {
    "discussionQuestions": [
      "What would you have done if you were the main hero?",
      "What was your favorite part of the adventure and why?"
    ],
    "activity": "Fun hands-on drawing, craft, or science activity related to the story topic in ${selectedLangObj.name}",
    "lifeLesson": "Core moral and emotional takeaway in ${selectedLangObj.name} for children"
  }
}`;
  };

  const handleGenerateBook = async () => {
    if (checkLimitAndTrigger()) return;
    if (!formData.classId) {
      alert("Please select a target classroom! 🏫");
      return;
    }
    const topic = bookTopic || formData.title || 'A magical adventure of discovery';
    setIsGeneratingBook(true);
    setBookGenStatus('Crafting Pixar story, vocabulary & grammar...');
    try {
      const activeModel = localStorage.getItem('hwz_active_ai') || 'anthropic';
      const resolvedGrade = resolveGradeFromClassroomName(activeClassroom?.name);

      const masterPixarPrompt = getConstructedPixarPrompt();

      const tieredModel = getModelForGrade(resolvedGrade, 'english', activeModel);
      const textResponse = await generateContent({
        prompt: masterPixarPrompt,
        responseMimeType: 'application/json',
        provider: tieredModel
      });

      const parsedBook = safeParseAiJson(textResponse);
      parsedBook.promptUsed = masterPixarPrompt;

      // Cap at maximum 5 pages
      if (parsedBook.pages && parsedBook.pages.length > 5) {
        parsedBook.pages = parsedBook.pages.slice(0, 5);
      }

      // Character Anchor Enforcement for 100% Visual Consistency
      const heroAnchor = parsedBook.heroVisualAnchor || parsedBook.heroDescription || (parsedBook.coverImagePrompt ? parsedBook.coverImagePrompt.split('.')[0] : '');

      if (parsedBook.coverImagePrompt) {
        setBookGenStatus('Rendering 8K Cover Illustration...');
        const coverStylePrompt = `${heroAnchor ? heroAnchor + '. ' : ''}${parsedBook.coverImagePrompt}, in ${parsedBook.illustrationStyle || bookIllustrationStyle} style, book cover, vibrant pastel colors, 8k, highly detailed, no text`;
        parsedBook.coverImageUrl = await fetchImageAsBase64(coverStylePrompt);
      }

      if (parsedBook.pages && Array.isArray(parsedBook.pages)) {
        for (let i = 0; i < parsedBook.pages.length; i++) {
          const p = parsedBook.pages[i];
          const rawPanelPrompt = p.imagePrompt || p.text;
          if (rawPanelPrompt) {
            setBookGenStatus(`Rendering 8K Panel Illustration ${i + 1} of ${parsedBook.pages.length}...`);

            // Always prepend heroAnchor and species consistency rule
            let consistentPrompt = rawPanelPrompt;
            if (heroAnchor && !rawPanelPrompt.toLowerCase().includes(heroAnchor.toLowerCase().slice(0, 15))) {
              consistentPrompt = `Same hero character: ${heroAnchor}. Scene action: ${rawPanelPrompt}`;
            }

            const stylePrompt = `${consistentPrompt}, in ${parsedBook.illustrationStyle || bookIllustrationStyle} style, vibrant pastel colors, consistent character appearance, 8k, highly detailed, children's book illustration, no text`;
            p.imageUrl = await fetchImageAsBase64(stylePrompt);
            await new Promise((r) => setTimeout(r, 400));
          }
        }
      }

      parsedBook.targetLanguage = targetLanguage || 'en';
      setGeneratedBook(parsedBook);
      if (!formData.title) {
        setFormData(prev => ({ ...prev, title: parsedBook.title || topic }));
      }
      setActivePreviewPage(0);

      // Auto-save & publish to Firestore immediately so it's instantly live and persistent on refresh
      if (user?.uid) {
        setBookGenStatus('Auto-publishing to Library Zone...');
        const draftGrade = resolveGradeFromClassroomName(activeClassroom?.name);
        const autoPayload = {
          teacherId: user.uid,
          classId: formData.classId || 'all',
          targetStudentIds: formData.assignType === 'students' ? (formData.assignedStudentIds || []) : [],
          title: formData.title || parsedBook.title || topic || 'Untitled Story',
          subtitle: parsedBook.subtitle || '',
          genre: parsedBook.genre || bookGenre || 'Adventure',
          emoji: parsedBook.emoji || '📖',
          targetGrade: draftGrade,
          targetLanguage: targetLanguage || 'en',
          summary: parsedBook.summary || '',
          illustrationStyle: parsedBook.illustrationStyle || bookIllustrationStyle,
          coverImagePrompt: parsedBook.coverImagePrompt || '',
          coverImageUrl: parsedBook.coverImageUrl || '',
          pages: parsedBook.pages || [],
          comprehensionQuestions: parsedBook.comprehensionQuestions || [],
          parentSection: parsedBook.parentSection || null,
          isPublished: true,
          badge: '🌟 Teacher Assigned',
          createdAt: serverTimestamp()
        };
        await addDoc(collection(db, 'custom_library_books'), autoPayload);
      }
    } catch (err) {
      console.error("Book Gen Error:", err);
      alert("Failed to generate storybook. Please try again! ❌");
    } finally {
      setIsGeneratingBook(false);
      setBookGenStatus('');
    }
  };

  const handlePublishBook = async () => {
    if (!user?.uid) {
      alert("Please log in as a teacher to publish books! 🔒");
      return;
    }
    if (!formData.classId) {
      alert("Please select a target classroom! 🏫");
      return;
    }
    if (!generatedBook) {
      alert("Please generate a storybook first! 🪄");
      return;
    }
    if (formData.assignType === 'students' && (!formData.assignedStudentIds || formData.assignedStudentIds.length === 0)) {
      alert("Please select at least one student! 👤");
      return;
    }

    setIsPublishing(true);
    try {
      const draftGrade = resolveGradeFromClassroomName(activeClassroom?.name);
      const bookPayload = {
        teacherId: user.uid,
        classId: formData.classId,
        targetStudentIds: formData.assignType === 'students' ? formData.assignedStudentIds : [],
        title: formData.title || generatedBook.title || 'Untitled Story',
        subtitle: generatedBook.subtitle || '',
        genre: generatedBook.genre || bookGenre || 'Adventure',
        emoji: generatedBook.emoji || '📖',
        targetGrade: draftGrade,
        targetLanguage: generatedBook.targetLanguage || targetLanguage || 'en',
        summary: generatedBook.summary || '',
        illustrationStyle: generatedBook.illustrationStyle || bookIllustrationStyle,
        coverImagePrompt: generatedBook.coverImagePrompt || '',
        coverImageUrl: generatedBook.coverImageUrl || '',
        pages: generatedBook.pages || [],
        comprehensionQuestions: generatedBook.comprehensionQuestions || [],
        parentSection: generatedBook.parentSection || null,
        isPublished: true,
        badge: '🌟 Teacher Assigned',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'custom_library_books'), bookPayload);
      alert("Library Storybook Published Successfully! 🚀 Available for students in Library Zone!");

      // Reset book state
      setGeneratedBook(null);
      setBookTopic('');
      if (typeof onHomeworkCreated === 'function') {
        onHomeworkCreated();
      }
    } catch (err) {
      console.error("Book Publish Error:", err);
      alert("Failed to publish library book. ❌");
    }
    setIsPublishing(false);
  };

  const [activeTab, setActiveTab] = useState('create');
  const [pastHomeworks, setPastHomeworks] = useState([]);
  
  useEffect(() => {
    if (initialDraft) {
      setFormData({
        subject: initialDraft.subject || 'maths',
        title: initialDraft.title || '',
        instructions: initialDraft.instructions || 'Read each question carefully and select the best answer! 🚀',
        aiPrompt: initialDraft.aiPrompt || '',
        classId: initialDraft.assignedClassId || '',
        dueDate: initialDraft.dueDate || '',
        time: initialDraft.time || '',
        points: initialDraft.points || '10',
        assignType: initialDraft.assignType || 'all',
        assignedStudentIds: initialDraft.assignedStudentIds || (initialDraft.assignedStudentId ? [initialDraft.assignedStudentId] : []),
        difficulty: initialDraft.difficulty || 'Medium'
      });
      setGeneratedQuestions(initialDraft.questions || null);
      setIsAiAccepted(!!initialDraft.questions);
      setActiveTab('create');
    }
  }, [initialDraft]);

  useEffect(() => {
    if (activeClassroom?.id) {
      setFormData(prev => ({ ...prev, classId: activeClassroom.id }));
    } else {
      setFormData(prev => ({ ...prev, classId: '' }));
    }
  }, [activeClassroom]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [expandedHomeworkId, setExpandedHomeworkId] = useState(null);
  const [questionCount, setQuestionCount] = useState(5);
  
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const fetchPastHomeworks = async () => {
    if (!user?.uid) return;
    setIsLoadingHistory(true);
    try {
      const q = activeClassroom 
        ? query(collection(db, 'homeworks'), where('teacherId', '==', user.uid), where('assignedClassId', '==', activeClassroom.id))
        : query(collection(db, 'homeworks'), where('teacherId', '==', user.uid));
      const snap = await getDocs(q);
      const hwList = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      
      hwList.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
      
      setPastHomeworks(hwList);
    } catch (err) {
      console.error("Fetch past homework error:", err);
    }
    setIsLoadingHistory(false);
  };

  useEffect(() => {
    if (activeTab === 'history') {
      fetchPastHomeworks();
    }
  }, [activeTab, user, activeClassroom]);

  useEffect(() => {
    if (isCurriculumMode && selectedSkills.length > 0) {
      const autoTitle = getSmartTopicTitle(selectedSkills);
      setFormData(prev => ({ ...prev, title: autoTitle }));
    } else if (isCurriculumMode && selectedSkills.length === 0) {
      setFormData(prev => ({ ...prev, title: '' }));
    }
  }, [selectedSkills, isCurriculumMode]);

  const handleDeleteHomework = async (hwId) => {
    if (!(await window.confirmCustom("Are you sure you want to delete this homework? 🗑️"))) return;
    try {
      await deleteDoc(doc(db, 'homeworks', hwId));
      fetchPastHomeworks();
    } catch (err) {
      console.error("Delete homework error:", err);
      alert("Oops! Failed to delete homework.");
    }
  };

  const getPlaceholder = () => {
    if (formData.subject === 'maths') return `e.g. 'Make ${questionCount} questions about adding fractions with unlike denominators'...`;
    if (formData.subject === 'science') return `e.g. 'Make ${questionCount} questions about the solar system and planets'...`;
    if (formData.subject === 'english') return `e.g. 'Make ${questionCount} questions about identifying nouns vs verbs in a sentence'...`;
    return "Describe what the AI should generate...";
  };

  const handleGenerateAI = async () => {
    if (checkLimitAndTrigger()) return;
    setIsAiAccepted(false);
    setIsGenerating(true);

    try {
      const activeModel = localStorage.getItem('hwz_active_ai') || 'anthropic';

      if (isCurriculumMode && selectedSkills.length === 0) {
        alert("Please select at least one Micro-Skill from the Curriculum! 🎯");
        setIsGenerating(false);
        return;
      }
      if (!isCurriculumMode && !formData.title && !formData.aiPrompt) {
        alert("Please provide either a Title or an AI Prompt to guide generation! 🎯");
        setIsGenerating(false);
        return;
      }

      const resolvedGrade = resolveGradeFromClassroomName(activeClassroom?.name);
      
      const topic = isCurriculumMode ? getSmartTopicTitle(selectedSkills) : (formData.title || (formData.aiPrompt ? formData.aiPrompt.slice(0, 45) + '...' : 'General Quiz'));
      
      const skillTitles = selectedSkills.map(s => s.title).join(", ");
      const rawInjected = isCurriculumMode 
        ? `${formData.aiPrompt || ''}\n\nCRITICAL INSTRUCTION: You must strictly generate questions focusing only on the following micro-skills: "${skillTitles}". Distribute the questions evenly across these topics. This is for ${resolvedGrade} at a ${formData.difficulty || 'Medium'} complexity level.`
        : (formData.aiPrompt || formData.title);

      const sanitizedInjected = (rawInjected || '')
        .replace(/\b\d+\s+(questions?|qs?)\b/gi, '{QUESTION_COUNT} questions');

      const injectedPrompt = sanitizedInjected
        .replace(/\{SUBJECT\}/gi, formData.subject || '')
        .replace(/\{GRADE\}/gi, resolvedGrade || 'Age-Appropriate')
        .replace(/\{TOPIC\}/gi, topic || '')
        .replace(/\{DIFFICULTY\}/gi, formData.difficulty || 'Medium')
        .replace(/\{QUESTION_COUNT\}/gi, String(questionCount));

      // Find up to 30 questions recently generated for this subject/exam to prevent duplicates
      const recentlyGenerated = [];
      if (allHomeworks && allHomeworks.length > 0) {
        const matchingHws = allHomeworks
          .filter(h => h.subject?.toLowerCase() === formData.subject?.toLowerCase() || (formData.examPreset && h.examPreset === formData.examPreset))
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        
        for (const hw of matchingHws) {
          if (hw.questions && Array.isArray(hw.questions)) {
            for (const q of hw.questions) {
              if (q.text) {
                const cleanText = q.text.replace(/<svg[\s\S]*?<\/svg>/gi, '').replace(/\[CLOCK:.*?\]/gi, '').trim();
                const preview = cleanText.split('\n')[0].slice(0, 100).trim();
                if (preview && !recentlyGenerated.includes(preview)) {
                  recentlyGenerated.push(preview);
                }
              }
              if (recentlyGenerated.length >= 30) break;
            }
          }
          if (recentlyGenerated.length >= 30) break;
        }
      }
      
      const entropySeed = `SEED-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const previousQuestionsBlock = recentlyGenerated.length > 0
        ? `\n        CRITICAL ABSOLUTE ZERO-REPETITION MANDATE (Session Entropy Seed: ${entropySeed}):
        You MUST NOT repeat or generate similar templates, character names, numbers, or question scenarios to ANY of these recently generated questions. Every single question generated in this session must feature 100% unique context, names, values, and problem structures:
        ${recentlyGenerated.map((q, idx) => `        ${idx + 1}. "${q}"`).join('\n')}\n`
        : `\n        CRITICAL ABSOLUTE ZERO-REPETITION MANDATE (Session Entropy Seed: ${entropySeed}):
        Every single question generated in this session must feature 100% unique context, character names, numbers, and problem structures. Do not use generic repetitive textbook templates.\n`;

      const langObj = getLanguageObj(targetLanguage || 'en');
      const langRule = targetLanguage && targetLanguage !== 'en'
        ? `\n        CRITICAL TARGET LANGUAGE REQUIREMENT: You MUST generate all question text, options, and explanations in ${langObj.name} (${langObj.nativeName}). Ensure accurate mathematical terminology and culturally appropriate context for ${langObj.name} speakers.`
        : '';
      const isVocab = formData.subject === 'Vocabulary' || (formData.subject || '').toLowerCase().includes('vocab') || (topic || '').toLowerCase().includes('vocab');

      let prompt = `You are an expert curriculum designer and education specialist.${isVocab ? `\nSPECIAL VOCABULARY MISSION: You are an expert Vocabulary Curriculum Director and Word Learning Coach. Your mission is to teach students 10 to 15 NEW vocabulary words every week through an INFORMATION-FIRST "Weekly Word Spotlight & Learning Guide" in "passage", followed by direct contextual application exercises in "questions".` : ''} 
        Create a ${questionCount}-question multiple-choice quiz for students about the following topic:
        Subject: ${formData.subject}
        Topic: ${topic}
        Target Language: ${langObj.name} (${langObj.nativeName})
        Specific Content Instructions: ${injectedPrompt}
        ${langRule}
        ${previousQuestionsBlock}
        
        Ensure the questions test the students' knowledge on the specific content instructions provided. DO NOT generate meta-questions about the instructions themselves.
        
        ================================================================================
        CRITICAL MANDATED GUARDRAILS FOR ALL EXAMS AND HOMEWORKS:
        ================================================================================
        1. DYNAMIC PAST-PAPER COMPLEXITY & SYLLABUS EVOLUTION ALIGNMENT:
           - Every question MUST strictly match the exact difficulty, cognitive depth, section structure, and active syllabus specifications of official ${new Date().getFullYear() - 6}–${new Date().getFullYear()} released past papers for this specific exam board (e.g. ACARA, College Board, NTA, NCERT, SEAB, AQA, Edexcel, ISEB, MAA, SIMCC, GMAC).
           - Dynamically adapt to recent curriculum revisions, digital adaptive testing shifts, and modern section structures for the active ${new Date().getFullYear()} exam cycle.
           - DO NOT generate oversimplified, generic, or trivial questions. Questions MUST reflect real competitive entrance exam pressure.

        2. ZERO HALLUCINATIONS & FACTUAL / MATH INTEGRITY:
           - 100% Mathematical, Logical, and Scientific Accuracy.
           - All arithmetic calculations, geometry side lengths, angle totals, data table values, historical dates, and scientific laws MUST be verified for 100% internal consistency.
           - NEVER hallucinate fake dates, fictitious historical events, broken formulas, or impossible geometric shapes.

        3. ZERO SELF-ANSWERING / NO LEAKING ANSWERS IN QUESTION TEXT:
           - CRITICAL RULE: DO NOT leak or reveal the correct answer or solution inside the question text or prompt!
           - The question text MUST ONLY present the problem statement, scenario, passage, or visual figure.
           - ABSOLUTELY NEVER include phrases like "The answer is B", "Therefore the value is 45", "Correct answer: C", or "(Answer: 12)" inside the question text!
           - The correct answer choice MUST ONLY appear in the designated "answer" property and options array!
        ================================================================================

        CRITICAL LASER-FOCUS RULE: If a highly specific topic or micro-skill is provided (e.g., 'place value in decimal numbers' or 'identifying nouns'), EVERY SINGLE QUESTION MUST STRICTLY TEST THAT EXACT SKILL. DO NOT generate generalized questions about the broader subject (e.g., if asked for 'decimal place value', DO NOT generate questions about 'ordering decimals' or 'adding decimals'). Stay completely laser-focused on the exact requested skill!

        CRITICAL ACCURACY & QUALITY RULES:
        1. For Language / English / Language Conventions / Spellings / Literacy:
           - Identify the part of speech based strictly on its exact syntactic function inside the sentence context. E.g. in "The walk was long", "walk" is a noun. In "We walk daily", "walk" is a verb.
           - Ensure that the "answer" option is grammatically 100% correct, and the other 3 options are clearly incorrect or represent different parts of speech. No ambiguity.
           - CRITICAL VOCABULARY RULE: You MUST strictly adapt the reading level, vocabulary, and sentence structure to be age-appropriate for the specified grade level. For early learners (Foundation, Grade 1, Grade 2), use extremely simple, short, decodable words and short sentences. Avoid complex phrasing completely.
           - ABSOLUTE SUBJECT BOUNDARY RULE: English, Language Conventions, Spellings, and Literacy subjects must ONLY contain questions about grammar, punctuation, spelling, vocabulary, reading comprehension, sentence structure, or writing. NEVER include maths, arithmetic, geometry, measurement, perimeter, area, angles, fractions, statistics, data, or any other numeracy content — even if framed as a creative word problem or real-world scenario. A perimeter-of-a-whiteboard question is a MATHS question, NOT an English question. DO NOT cross subject boundaries.
        2. For ALL Mathematics, Numeracy, NAPLAN Numeracy, ICAS Maths, Selective Maths, SAT Math, and Olympiad Maths:
           - Ensure all equations, word problems, and numeric values are mathematically correct. Double-check your own calculations so there is zero arithmetic error.
           - CRITICAL MATH RULE: Never hallucinate mathematical properties! (e.g. 1234 is EVEN, not odd. Do not confidently assert false mathematical facts). The correct answer MUST be logically and mathematically indisputable.
           - CRITICAL VISUAL DIAGRAM MANDATE (AT LEAST 40% VISUAL QUESTIONS): For ALL Mathematics, Numeracy, NAPLAN Numeracy, and Maths competitions/exams, you MUST ensure that AT LEAST 40% (4 out of every 10) of the questions generated are VISUAL DIAGRAM-BASED questions. Each visual question MUST include clean, beautifully formatted inline SVG code in the "svgCode" property representing graphs (column graphs, dot plots, pie charts), tables, number lines, clocks, measurement rulers, geometry shapes, or angle diagrams. DO NOT generate a 100% text-only numeracy paper! Always include at least 40% visual SVG diagram questions!
        3. For Science & Anatomy / Organ Systems:
           - Ensure all facts, definitions, and concepts are scientifically accurate, standard, and strictly grounded in the target grade's national curriculum (e.g., ACARA for Australia, NGSS for USA, UK National Curriculum).
           - ABSOLUTE EXAM RIGOR & ACADEMIC PHRASING RULE: Write clear, direct, formal exam-style questions suitable for Grade 4 assessments, tests, and exams. DO NOT write childish storybook scenarios, conversational fluff, or narrative filler (e.g., NEVER write "When you take a bite of a yummy sandwich...", "Imagine you ate a healthy apple...", or "Some children think..."). State questions directly and academically: e.g., "What is the primary function of the stomach in the human digestive system?", "Which organ is responsible for the majority of nutrient absorption into the bloodstream?", "What role do salivary enzymes play during digestion?".
           - ABSOLUTE ORGAN FUNCTIONALITY RULE: For human body, anatomy, and organ system topics (such as Digestion, Circulation, Respiration, Excretion), questions MUST directly test the specific functions, mechanisms, and roles of the key organs (e.g., Stomach, Small Intestine, Large Intestine, Oesophagus, Salivary Glands/Teeth, Liver, Pancreas). Use precise Grade 4 scientific terms such as "mechanical breakdown", "chemical digestion", "nutrient absorption", "gastric juices", "peristalsis", and "water reabsorption".
           - ABSOLUTE SCIENCE CURRICULUM BOUNDARY RULE: Science questions must be strictly age-appropriate for the specified grade level. DO NOT include advanced high school or college-level concepts (such as molecular organelle biochemistry, complex chemical formulas, advanced genetics, or physics calculus) when generating primary/elementary science questions. Stay laser-focused on grade-level observational science, ecosystems, food groups, materials, forces, and real-world phenomena.
           - ABSOLUTE NO MATHS SUMS IN SCIENCE RULE: Science subjects MUST ONLY test scientific concepts, biological/physical processes, organ functions, classification, cause-and-effect, and scientific reasoning. NEVER generate primary school arithmetic sums, word problem calculations, addition/subtraction, multiplication/division, time arithmetic (e.g. 9 o'clock + 3 hours), or bar chart math counts (e.g., 'How many more cups/blocks/hours?') in a Science quiz. Even if framed with scientific words like 'digestive system' or 'nutrients', arithmetic word problems are MATHEMATICS questions, NOT Science questions. Keep Science quizzes 100% focused on scientific understanding!
        4. General & Non-English Languages:
           - The "answer" field MUST exactly match one of the 4 values inside the "options" array.
           - All options must be age-appropriate for elementary/middle school students.
           - CRITICAL: Do NOT prepend letters (e.g., A., B., C., D.) or numbers (1., 2.) to the strings in your "options" array. The UI automatically renders the A/B/C/D buttons.
           - ABSOLUTE NO UNREQUESTED TRANSLATIONS RULE: For Hindi, foreign languages, or non-English content, DO NOT include English translations in parentheses inside option strings (e.g. NEVER write "लाल (red)" or "हरा (green)"). Option strings MUST contain ONLY the target language text (e.g. "लाल", "हरा"). Appending English translations in option choices ruins language testing and reveals answers to students! DO NOT include full English translation sentences in parentheses inside question text (e.g. NEVER write "(Read this: 'This is a red flower.' What color is the flower?)"). Keep question text purely in the target language unless specifically asked for a translation task.
           - ABSOLUTE NON-TRIVIAL QUESTION RULE: Never write self-answering questions where the prompt sentence states the exact answer being asked (e.g. DO NOT write "This is a red flower. What color is the flower?" where the answer "red" is literally given in the sentence context!). Questions must test genuine comprehension or vocabulary.
        5. For Vocabulary & Word Power (Mandatory Information-First Word Learning Guide & Application):
           - MANDATORY WEEKLY WORD SPOTLIGHT IN "passage": You MUST populate the root-level "passage" string key with an INFORMATION-FIRST "Weekly Word Spotlight & Learning Guide" for 6 to 8 new vocabulary words appropriate for the requested grade level.
           - For EVERY word in the learning guide, you MUST detail: 📌 Word & Part of Speech, 🔊 Phonetics / Pronunciation, 💡 Kid-Friendly Definition, 👯 Synonyms & Antonyms, ✍️ Why Writers Love This, 🔄 Replace Boring Words, 💡 Quick Writing Tips, and 📖 Example Sentence.
           - APPLICATION OVER TRICK QUIZZES: Questions MUST test direct contextual application (e.g., Fill-in-the-blank sentences: 'Liam took a _______ step' where student picks 'cautious'; or Synonym/Antonym matching). DO NOT write tricky multiple-choice questions like 'Which sentence effectively uses cautious to show a character being very careful?'. The student is learning these words this week—make the questions reinforce word meaning and contextual use!
           - CRITICAL MANDATORY ANTI-LEAK RULE FOR VOCABULARY FILL-IN-THE-BLANK: In fill-in-the-blank sentences, replace the target answer word with '_______' (7 underscores). DO NOT write the answer word directly into the sentence! The question sentence MUST NOT reveal or contain the answer word!
        
         CRITICAL MANDATORY QUESTION TEXT RULE:
         Every single question object in the "questions" array MUST have an explicit, plain-text question stem in the "text" property (e.g., "Which number represents 8 tens of thousands?", "What is the value of the underlined digit?", "Which fraction is shaded?"). NEVER put SVG code or clock tags as the ONLY content of the "text" property without a plain-text question sentence! Every question MUST have a clear, human-readable text question sentence.

         Return ONLY a JSON object containing:
        1. "questions": an array of objects. Each object must have: 
           - "id" (number)
           - "text" (string, the question)
           - "questionType" (string, either "multiple_choice", "text", or "interactive")
           - "interactiveType" (string, one of: "sorting", "matching", "fractionColoring", "clockSetting", "placeValueBlocks", "numberLinePlot", "angleMeasuring", "gridAreaPainter", "balanceScale". REQUIRED ONLY IF questionType="interactive")
           - "targetFraction" (string, e.g. "1/3", "2/3". REQUIRED for "fractionColoring")
           - "targetTime" (string, e.g. "03:45". REQUIRED for "clockSetting")
           - "targetNumber" (number, e.g. 342. REQUIRED for "placeValueBlocks")
           - "targetValue" (number, e.g. 3.5. REQUIRED for "numberLinePlot")
           - "targetAngle" (number, e.g. 65. REQUIRED for "angleMeasuring")
           - "targetArea" (number, e.g. 12. REQUIRED for "gridAreaPainter")
           - "targetX" (number, e.g. 3. REQUIRED for "balanceScale")
           - "options" (array of exactly 4 strings. REQUIRED for "multiple_choice". OMIT for "text" and "interactive")
           - "interactiveData" (array of strings. REQUIRED for "interactive". For "sorting", list 3-5 items. For "matching", list 3-5 pairs "Left||Right")
           - "answer" (string/number answer matching target)
           - "subtopic" (string, concept under main topic)
           - "imagePrompt" (string, OPTIONAL. ONLY use for decorative photos)
        2. "passage": an optional string. If the quiz requires a reading comprehension passage, story, or shared text that applies to the questions, provide it here. Otherwise, omit this key.
        
        CRITICAL FOR READING COMPREHENSION: DO NOT put the reading passage, story, or article inside the "text" of each question! The passage MUST be placed EXACTLY ONCE inside the root-level "passage" string key. The question "text" should only contain the actual question being asked.
        
        CRITICAL FOR INTERACTIVE QUESTIONS:
        If you want the student to physically interact (drag items, set clock, build place value blocks, plot number lines, measure angles, paint area grids, balance scales, or color fractions), use questionType="interactive". 
        - "sorting": Provide scrambled items in "interactiveData". Answer = correct sorted order joined by commas.
        - "matching": Provide pairs "Left||Right" in "interactiveData". Answer = correct pairs.
        - "fractionColoring": Set "targetFraction"="1/3", answer="1/3".
        - "clockSetting": Set "targetTime"="03:45", answer="03:45".
        - "placeValueBlocks": Set "targetNumber"=342, answer="342".
        - "numberLinePlot": Set "targetValue"=3.5, answer="3.5".
        - "angleMeasuring": Set "targetAngle"=65, answer="65".
        - "gridAreaPainter": Set "targetArea"=12, answer="12".
        - "balanceScale": Set "targetEquation"="2x + 4 = 10", "targetX"=3, answer="3".
        
        ${assignmentType === 'test' ? 'CRITICAL FOR TESTS: This is a formal NAPLAN-style test paper. Generate a mix of multiple_choice and text input questions. Specifically, ensure that at least 30% of questions require text input (questionType="text" with NO options array), mimicking the actual exam format.' : 'CRITICAL FOR HOMEWORK: You MUST generate a healthy mix of question types ("multiple_choice", "text", and "interactive"). Every homework assignment MUST include at least one "interactive" question from the interactive types suite.'}
        
        IF the question requires a chart, graph, table, or data interpretation, include a "chartData" object property:
        "chartData": {
          "type": "bar" | "pie" | "line" | "table",
          "title": "String title",
          "data": [{"name": "Category A", "value": 10}, {"name": "Category B", "value": 20}]
        }
        CRITICAL CHART ANSWER-HIDING RULE: If the question asks the student to FIND or CALCULATE a specific value (e.g. "what percentage is Bus?", "how many students chose Soccer?", "what is the missing value?"), you MUST set the value for the unknown/answer category to -1 in the chartData. The UI will render it as a "?" segment/bar so the answer is hidden. NEVER expose the answer as a numeric label on the chart itself. Example: if Bus=45% is the answer, use {"name": "Bus", "value": -1} in chartData.
        
        IF the question involves geometry, shapes, or area/volume, include a "geometryData" object property:
        "geometryData": {
          "type": "rectangle" | "triangle" | "circle" | "cylinder" | "cube",
          "labels": { "width": "string", "height": "string", "radius": "string", "base": "string" }
        }

        CRITICAL FOR EARLY LEARNERS (Foundation, Grade 1, Grade 2 Maths): 
        If the question involves basic counting, addition, or subtraction, you MUST include an "earlyMathData" object property to draw visual manipulatives instead of relying solely on text.
        "earlyMathData": {
          "type": "cubes" | "objects" | "ten-frame",
          "icon": "Apple" | "Star" | "Car" | "Dog" | "Cat" | "Bug" | "Flower2" (only if type="objects"),
          "groups": [
            { "count": 5, "color": "text-red-500" },
            { "count": 3, "color": "text-blue-500" }
          ]
        }
        
        IF the question involves spatial reasoning, coordinate mapping, or street maps, include a "gridMapData" object property:
        "gridMapData": {
          "columns": 5,
          "rows": 4,
          "showCompass": true,
          "scale": "1 square = 100m",
          "streetStyle": true,
          "items": [
            { "coordinate": "A4", "label": "School", "icon": "GraduationCap" },
            { "coordinate": "D3", "label": "Park", "icon": "TreePine" }
          ]
        }
        (Use lucide-react icon names for the icon field: School, TreePine, Hospital, Library, MapPin, Building, Flag, House, etc.)

        IF the question involves tracing a route, a running course, turns, or angles, include a "pathData" object property:
        "pathData": {
          "points": [
            { "x": 10, "y": 80, "label": "start" },
            { "x": 15, "y": 30, "label": "station 1", "icon": "Flag" },
            { "x": 60, "y": 40, "label": "station 2", "icon": "Flag" },
            { "x": 90, "y": 10, "label": "station 3", "icon": "Flag" }
          ],
          "showArrows": true,
          "closed": false
        }
        Note: The X and Y coordinates should be on a 0 to 100 percentage scale.

        IF the question involves placing numbers, decimals, or fractions on a line, include a "numberLineData" object property:
        "numberLineData": {
          "min": 0,
          "max": 1,
          "points": [
            { "value": 0.2, "label": "A" },
            { "value": 0.5, "label": "B" },
            { "value": 0.75, "label": "C" }
          ],
          "showLabels": true
        }
        ABSOLUTELY NO ASCII ART IN THE TEXT! DO NOT type "0 ---|---|--- 1" in the question text. You MUST use the "numberLineData" JSON object instead.

        IF the question asks students to read a measurement from an instrument (like a beaker, thermometer, or ruler), include an "instrumentData" object property:
        "instrumentData": {
          "type": "ruler" | "beaker" | "thermometer",
          "min": 0,
          "max": 100,
          "value": 45,
          "unit": "mL",
          "step": 10
        }

        IF the question involves counting stacked cubes, painted blocks, or isometric 3D spatial reasoning, include a "blockData" object property. Firebase does NOT support nested arrays, so you MUST use an array of objects for the rows:
        "blockData": {
          "rows": [
            { "columns": [5, 6, 5] },
            { "columns": [1, 2, 1] }
          ]
        }
        (Each row is an object with a "columns" array of integers representing the height of the blocks at each x,y coordinate).

        IF the question involves a Venn Diagram (sorting objects/numbers into sets), include a "vennDiagramData" object property. DO NOT try to draw Venn diagrams with raw svgCode.
        "vennDiagramData": {
          "leftLabel": "Mammals",
          "rightLabel": "Can Swim",
          "leftItems": ["Dog", "Cat"],
          "rightItems": ["Fish"],
          "intersectionItems": ["Whale", "Dolphin"],
          "outsideItems": ["Bird"]
        }

        CRITICAL FOR SPATIAL REASONING: If the question involves 3D objects, stacking blocks, nets, cross-sections, or spatial reasoning, YOU ABSOLUTELY MUST include a visual (either "blockData", "geometryData", or "svgCode"). Do NOT generate text-only 3D visualization questions! If asking about nets, use "svgCode" in the options or the main question.

        CRITICAL FOR FRACTIONS AND EQUIVALENT SHAPES:
        - If a question involves fractions, patterns, or equivalent fractions, you MUST include a visual diagram using "svgCode" representing the fraction (e.g., a circle/pizza divided into equal slices, a 2x5 grid of boxes with some colored in, or geometric shapes like triangles/hexagons/pentagons split into equal pieces with a fraction of them shaded in bright yellow or orange). Ensure the parts are mathematically equal.

        CRITICAL FOR ANGLES AND MEASUREMENTS:
        - If a question is about angles (e.g., measuring acute/obtuse/right angles, finding the missing angle in a triangle or quadrilateral, or calculating angle sums), you MUST include a geometric diagram using "svgCode". Draw the angle rays or shapes (triangle/quadrilateral) with clear black or colored lines, include curved arcs for the angles, and label the angles clearly with degrees (e.g., "70°", "130°", "x°") near their respective vertices.

        CRITICAL FOR GRAPHS AND CHARTS:
        - For questions about surveys, data, or column/bar graphs (like tracking sports preferences, favorites, etc.), include a "chartData" object or use "svgCode" to draw a beautiful grid-based bar graph with axis ticks, labels, and horizontal or vertical colored bars.

        CRITICAL FOR LOGICAL REASONING / PATTERNS: If the question involves a series of shapes changing in a logical pattern, or pattern recognition, YOU ABSOLUTELY MUST include a visual using the "svgCode" property (or inline SVG in the options) to draw the actual sequence of shapes! NEVER use placeholder text like "[Insert figure...]". You are fully capable of generating raw SVG code strings. CRITICAL: Make absolutely sure the CORRECT logical next shape is ACTUALLY present in your "options" array, and that the "answer" string is a 100% exact character-for-character match of that option. If the question involves finding a "Mirror Image" or reflection, use SVG and the 'transform="scale(-1, 1)"' attribute to easily reflect shapes.

        IF the question involves 2D Geometry, Lines of Symmetry, or Transformational Geometry (like "Which flag has 2 lines of symmetry?"), use "svgCode" directly inside the "options" array! (e.g. '["<svg ...>...</svg>", "<svg ...>...</svg>", ...]').

        CRITICAL FOR COMPLEX/CUSTOM DIAGRAMS (Cartesian Planes, Science Models, Perimeter/Area, Money):
        If the question requires a Cartesian coordinate plane (with x/y axes, e.g. from -5 to 5), a custom geometric figure (e.g., a triangle with all 3 sides labeled), or pictures of MONEY (coins and banknotes), YOU MUST USE the "svgCode" property to draw it from scratch!
        "svgCode": "<svg viewBox='0 0 400 400'>...</svg>"
        CRITICAL RULES FOR "svgCode" AESTHETICS (Make it look like premium educational clipart!):
        - 🎨 VIBRANT COLORS: NEVER use boring plain black lines on white backgrounds! Use bright, cheerful, or highly saturated hex colors (e.g., #FF6B6B red, #4ECDC4 teal, #FFE66D yellow, #6B5B95 purple, #A8E6CF mint). Fill backgrounds with a very soft pastel color instead of plain white.
        - 🖌️ THICK STROKES & ROUNDED CORNERS: Make shapes look extremely friendly and professional by using thick strokes (stroke-width="3" or "4"), and always use stroke-linecap="round" and stroke-linejoin="round".
        - ☁️ SHADOWS & DEPTH: Make shapes pop off the page! Draw a slightly offset dark-opacity copy of the shape underneath it to create a 3D drop shadow effect.
        - ✏️ PLAYFUL FONTS: Use font-family="'Nunito', 'Comic Sans MS', sans-serif" font-weight="900" and large font sizes for a playful, highly readable, child-friendly look.
        - Cartesian planes: Draw beautiful soft blue grid lines, bold colorful axes, and plot highly visible vibrant points/shapes with drop shadows.
        - Spinners & Probability: Draw gorgeous, brightly colored sections. Make the spinner arrow pop with a 3D shadow.
        - Geometry: Fill shapes with soft semi-transparent colors (fill-opacity="0.3") and use thick vibrant borders (e.g., a bright pink triangle with a thick hot pink border).
        
        CRITICAL FOR CLOCKS AND TIME: 
        DO NOT try to draw analog clocks using "svgCode" because you will likely calculate the hand angles incorrectly! INSTEAD, simply include the string "[CLOCK:HH:MM]" anywhere in your question "text" (e.g., "What time is shown on the clock? [CLOCK:02:30]"). Our system will automatically detect this and render a mathematically perfect, beautiful analog clock diagram in its place!
        IMPORTANT TIME CONVERSION RULES — you MUST follow these exactly when choosing the HH:MM value for [CLOCK:]:
        - "o'clock" → MM = 00. e.g. "3 o'clock" → [CLOCK:03:00]
        - "half past X" → MM = 30. e.g. "half past 7" → [CLOCK:07:30]
        - "quarter past X" → MM = 15. e.g. "quarter past 4" → [CLOCK:04:15]
        - "quarter to X" → HH = X-1, MM = 45. e.g. "quarter to 11" → [CLOCK:10:45], "quarter to 3" → [CLOCK:02:45]
        - "X minutes past Y" → HH = Y, MM = X. e.g. "20 minutes past 6" → [CLOCK:06:20]
        - "X minutes to Y" → HH = Y-1, MM = 60-X. e.g. "10 minutes to 5" → [CLOCK:04:50]
        - ALWAYS double-check: if the question says "quarter to 11", the clock MUST show 10:45, NOT 10:10 or 11:45.

        CRITICAL FOR BIOLOGICAL SCIENCE MODELS (Plants, Animals, Organs, Ecosystems):
        DO NOT try to draw biological organisms using "svgCode". Your raw SVG drawings of plants and animals look like rudimentary child drawings. INSTEAD, use the "imagePrompt" string property to describe a highly detailed realistic photo or textbook illustration. Formulate your question so it does NOT require A, B, C, D labels directly on the image. (e.g. Ask "Which part of a plant absorbs water?" with options "Roots", "Leaves", etc. and an imagePrompt of "A beautiful realistic 3D render of a plant showing its root system in the soil").

        CRITICAL: If the user requests a "NAPLAN" test, you MUST make the test highly pictorial and visual. Use "chartData", "geometryData", "gridMapData", "numberLineData", "pathData", "instrumentData", "blockData" or "svgCode" for at least 70% of the questions. NAPLAN heavily relies on visual stimulus for problem-solving!. NAPLAN heavily relies on visual stimulus for problem-solving!`;

      const subjectAndTitle = `${formData.subject || ''} ${formData.title || ''} ${formData.aiPrompt || ''}`;
      const tieredModel = getModelForGrade(resolvedGrade, subjectAndTitle, activeModel);
      console.log(`🤖 [HWZ AI ENGINE] Grade: ${resolvedGrade} | Subject: ${formData.subject} | Routing Model: ${tieredModel} | Target Questions: ${questionCount}`);

      const getPromptForCount = (targetCount, batchTag = '') => {
        const countInjected = (rawInjected || '')
          .replace(/\{SUBJECT\}/gi, formData.subject || '')
          .replace(/\{GRADE\}/gi, resolvedGrade || 'Age-Appropriate')
          .replace(/\{TOPIC\}/gi, topic || '')
          .replace(/\{DIFFICULTY\}/gi, formData.difficulty || 'Medium')
          .replace(/\{QUESTION_COUNT\}/gi, String(targetCount));

        return `You are an expert curriculum designer and education specialist.${isVocab ? `\nSPECIAL VOCABULARY MISSION: You are an expert Vocabulary Curriculum Director and Word Learning Coach. Your mission is to teach students 10 to 15 NEW vocabulary words every week through an INFORMATION-FIRST "Weekly Word Spotlight & Learning Guide" in "passage", followed by direct contextual application exercises in "questions".` : ''} 
        Create a ${targetCount}-question multiple-choice quiz for students about the following topic:
        Subject: ${formData.subject}
        Topic: ${topic}
        Target Language: ${langObj.name} (${langObj.nativeName})
        Specific Content Instructions: ${countInjected}
        ${langRule}
        ${previousQuestionsBlock}
        
        Ensure the questions test the students' knowledge on the specific content instructions provided. DO NOT generate meta-questions about the instructions themselves.
        
        ================================================================================
        CRITICAL MANDATED GUARDRAILS FOR ALL EXAMS AND HOMEWORKS:
        ================================================================================
        1. DYNAMIC PAST-PAPER COMPLEXITY & SYLLABUS EVOLUTION ALIGNMENT:
           - Every question MUST strictly match the exact difficulty, cognitive depth, section structure, and active syllabus specifications of official released past papers.
           - DO NOT generate oversimplified, generic, or trivial questions. Questions MUST reflect real competitive entrance exam pressure.

        2. ZERO HALLUCINATIONS & FACTUAL / MATH INTEGRITY:
           - 100% Mathematical, Logical, and Scientific Accuracy.
           - All arithmetic calculations, geometry side lengths, angle totals, data table values, historical dates, and scientific laws MUST be verified for 100% internal consistency.

        3. ZERO SELF-ANSWERING / NO LEAKING ANSWERS IN QUESTION TEXT:
           - CRITICAL RULE: DO NOT leak or reveal the correct answer or solution inside the question text or prompt!
           - The question text MUST ONLY present the problem statement, scenario, passage, or visual figure.

        4. STRICT ANTI-REPETITION & MULTI-DIMENSIONAL COGNITIVE TAXONOMY MANDATE:
           - CRITICAL BAN ON NUMBER-SWAPPING: NEVER generate repetitive questions that merely change numbers on the same procedural drill (e.g. 12 × 4, then 15 × 3, then 18 × 2).
           - Every single question MUST evaluate the concept through a completely distinct cognitive angle, representation, or thinking skill.
           - Distribute questions across the 8 Core Cognitive Dimensions:
             ① Conceptual Understanding (definitions, properties, why formulas work, non-examples/counter-examples)
             ② Procedural Fluency & Computation (efficient execution of rules/algorithms)
             ③ Real-World Context & Application (authentic situational word problems)
             ④ Logical Reasoning & Deductive Justification ("if-then" deductions, identifying underlying principles)
             ⑤ Multi-Step Problem Solving & Strategy (non-routine problems requiring strategic combination of steps)
             ⑥ Visual Interpretation & Representation (graphs, number lines, area grids, geometry models, SVGs)
             ⑦ Error Analysis & Misconception Spotting (finding the mistake in a hypothetical student's solution)
             ⑧ Higher-Order Thinking & Synthesis (reverse engineering, finding missing values to balance equations, open-ended analysis)
        ================================================================================

        CRITICAL ACCURACY & QUALITY RULES:
        1. For ALL Mathematics, Numeracy, NAPLAN Numeracy, ICAS Maths, Selective Maths, SAT Math, and Olympiad Maths:
           - Ensure all equations, word problems, and numeric values are mathematically correct.
           - CRITICAL VISUAL DIAGRAM MANDATE (AT LEAST 40% VISUAL QUESTIONS): For ALL Mathematics, Numeracy, NAPLAN Numeracy, and Maths competitions/exams, you MUST ensure that AT LEAST 40% of the questions generated are VISUAL DIAGRAM-BASED questions. Each visual question MUST include clean, beautifully formatted inline SVG code in the "svgCode" property or chart/geometry/grid data.

        Return ONLY a JSON object containing:
        1. "questions": an array of ${targetCount} objects. Each object must have: 
           - "id" (number)
           - "text" (string, the question)
           - "questionType" (string, either "multiple_choice", "text", or "interactive")
           - "cognitiveSkill" (string, one of "Conceptual Understanding", "Procedural Fluency", "Real-World Application", "Logical Reasoning", "Multi-Step Problem Solving", "Visual Interpretation", "Error Analysis", "Higher-Order Thinking")
           - "options" (array of exactly 4 strings for multiple_choice)
           - "answer" (string/number answer matching target)
           - "subtopic" (string, concept under main topic)
           - "explanation" (string, a clear 2 to 4 sentence step-by-step worked solution, formula, or grammar rationale explaining why the answer is correct)
           - "chartData", "geometryData", "gridMapData", "numberLineData", "instrumentData", "blockData", "svgCode" (for visual questions)
        2. "passage": an optional string if required for reading text.
        
        ${assignmentType === 'test' ? 'CRITICAL FOR TESTS: This is a formal NAPLAN-style test paper. Generate a mix of multiple_choice and text input questions.' : 'CRITICAL FOR HOMEWORK: Generate a healthy mix of question types.'}
        `;
      };

      let questions = [];
      let passage = null;
      let passagesList = null;
      const CHUNK_SIZE = 5;

      const isReadingExam = formData.examPreset === 'naplan_reading' || 
                            formData.examPreset === 'nsw_selective_reading' || 
                            formData.examPreset?.toLowerCase().includes('reading') || 
                            formData.subject === 'reading' || 
                            /reading\s+comprehension|stimulus\s+passages/i.test(rawInjected || '');

      let collectedQuestions = [];

      if (isReadingExam) {
        console.log(`📚 [HWZ READING ENGINE] Two-Phase Reading Generation for Year ${resolvedGrade} (${formData.examPreset || formData.title})...`);

        // Phase 1: Generate Complete Stimulus Suite (Passages & Poem)
        const stimulusPrompt = `You are an expert ACARA / Selective Reading test author and curriculum authority.
Generate an authentic 4-part Stimulus Reading Suite for Year ${resolvedGrade} students taking the ${formData.examPreset || 'Reading Assessment'} test.

MANDATORY 4-PART TEXT SUITE:
1. Text 1 (Narrative / Imaginative): An engaging 250-350 word story with rich character dialogue, setting, and subtext appropriate for Year ${resolvedGrade}.
2. Text 2 (Poetry / Poem): An original 16-24 line structured poem with 4-5 stanzas, figurative devices (metaphors, similes, personification), rhythm, and clear themes.
3. Text 3 (Informative / Scientific): A 250-350 word fascinating factual report or historical/nature article with subheadings and real facts.
4. Text 4 (Persuasive / Opinion): A 200-300 word compelling opinion piece or editorial on an engaging student-relevant topic.

Return ONLY a JSON object:
{
  "passages": [
    {
      "id": 1,
      "title": "Title of Story",
      "textType": "narrative",
      "genre": "Imaginative Narrative",
      "text": "Full story text..."
    },
    {
      "id": 2,
      "title": "Title of Poem",
      "textType": "poem",
      "genre": "Poem",
      "text": "Full poem text with stanzas..."
    },
    {
      "id": 3,
      "title": "Title of Report",
      "textType": "informative",
      "genre": "Informative Report",
      "text": "Full report text..."
    },
    {
      "id": 4,
      "title": "Title of Opinion",
      "textType": "persuasive",
      "genre": "Persuasive Argument",
      "text": "Full persuasive text..."
    }
  ]
}`;

        try {
          const stimRes = await generateContent({
            prompt: stimulusPrompt,
            responseMimeType: 'application/json',
            provider: tieredModel
          });
          const stimObj = safeParseAiJson(stimRes);
          if (Array.isArray(stimObj?.passages) && stimObj.passages.length > 0) {
            passagesList = stimObj.passages;
            passage = stimObj.passages.map(p => `### ${p.title} (${p.genre || p.textType})\n\n${p.text}`).join('\n\n---\n\n');

            // Phase 2: Distribute Questions Across the Generated Passages
            const numTexts = stimObj.passages.length;
            const baseCount = Math.floor(questionCount / numTexts);
            const remainder = questionCount % numTexts;

            const qPromises = stimObj.passages.map((p, pIdx) => {
              const countForText = baseCount + (pIdx < remainder ? 1 : 0);
              const isPoem = p.textType === 'poem' || /poem/i.test(p.genre);

              const qPrompt = `You are an expert ACARA / Selective reading test author.
Generate ${countForText} multiple-choice reading comprehension questions for Year ${resolvedGrade} students based STRICTLY on the text provided below.

TEXT TO TEST:
- Title: "${p.title}"
- Type: ${p.genre || p.textType} ${isPoem ? '(POEM)' : ''}
- Full Text:
"""
${p.text}
"""

COGNITIVE COVERAGE:
- Literal Comprehension (directly stated details)
- Inferential Comprehension (character motives, implied meaning, reading between lines)
- Evaluative / Critical Comprehension (author's craft, poetic devices, persuasive impact)
- Vocabulary in Context (figurative language, word meaning in context)

RULES:
- Exactly 4 options (A, B, C, D) per question.
- "answer" must be the correct option string.
- "explanation" must cite or quote the exact line/phrase from the text.
- Set "passageId" to ${p.id} and "passageTitle" to "${p.title}".
${isPoem ? '- Refer specifically to stanza and line numbers (e.g. "In stanza 2, why does the speaker...").' : ''}

Return ONLY a JSON object:
{
  "questions": [
    {
      "id": 1,
      "passageId": ${p.id},
      "passageTitle": "${p.title}",
      "text": "Question text...",
      "questionType": "multiple_choice",
      "cognitiveSkill": "Inferential Comprehension",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A",
      "explanation": "Explanation quoting the text..."
    }
  ]
}`;

              return generateContent({
                prompt: qPrompt,
                responseMimeType: 'application/json',
                provider: tieredModel
              }).then(res => safeParseAiJson(res)).catch(err => {
                console.warn(`[HWZ Reading Engine] Batch failed for text ${p.id}:`, err);
                return { questions: [] };
              });
            });

            const qResults = await Promise.all(qPromises);
            let readingQs = [];
            for (const resObj of qResults) {
              const raw = resObj.questions || resObj;
              if (Array.isArray(raw)) {
                readingQs.push(...raw.map(sanitizeQuestionData));
              }
            }

            if (readingQs.length > 0) {
              collectedQuestions = readingQs;
            }
          }
        } catch (stimErr) {
          console.warn("[HWZ Reading Engine] Phase 1 stimulus error:", stimErr);
        }
      }

      // If not reading exam or reading generation fallback, use standard parallel chunks
      if (collectedQuestions.length === 0) {
        const chunkCounts = [];
        let remainingToAssign = questionCount;
        while (remainingToAssign > 0) {
          const currentChunk = Math.min(remainingToAssign, CHUNK_SIZE);
          chunkCounts.push(currentChunk);
          remainingToAssign -= currentChunk;
        }

        console.log(`🚀 [HWZ SELF-HEALING ENGINE] Generating ${questionCount} questions in ${chunkCounts.length} parallel batches:`, chunkCounts);

        const batchPromises = chunkCounts.map((countToGen, idx) => {
          return generateContent({
            prompt: getPromptForCount(countToGen, `BATCH-${idx + 1}-${Date.now()}`),
            responseMimeType: 'application/json',
            provider: tieredModel
          }).then(res => safeParseAiJson(res)).catch((err) => {
            console.warn(`[HWZ Batch Engine] Batch ${idx + 1} failed:`, err);
            return { questions: [] };
          });
        });

        const batchResults = await Promise.all(batchPromises);

        for (const resObj of batchResults) {
          const rawQs = resObj.questions || resObj;
          if (Array.isArray(rawQs)) {
            collectedQuestions.push(...rawQs.map(sanitizeQuestionData));
          }
          if (!passage) {
            if (Array.isArray(resObj.passages) && resObj.passages.length > 0) {
              passagesList = resObj.passages;
              passage = resObj.passages.map(p => `### ${p.title || 'Passage ' + p.id} (${p.textType || 'Text'})\n\n${p.text}`).join('\n\n---\n\n');
            } else if (resObj.passage) {
              passage = resObj.passage;
            }
          }
        }
      }

      // SELF-HEALING TOP-UP PASS: If collected questions < questionCount, fetch deficit in parallel batches of 5!
      if (collectedQuestions.length < questionCount) {
        let deficit = questionCount - collectedQuestions.length;
        console.warn(`⚠️ [HWZ SELF-HEALING ENGINE] Deficit of ${deficit} questions detected (${collectedQuestions.length}/${questionCount}). Launching parallel top-up pass...`);
        const topUpChunks = [];
        while (deficit > 0) {
          const c = Math.min(deficit, CHUNK_SIZE);
          topUpChunks.push(c);
          deficit -= c;
        }
        try {
          const topUpPromises = topUpChunks.map((cnt, i) => {
            let promptToUse;
            if (isReadingExam && Array.isArray(passagesList) && passagesList.length > 0) {
              const targetPassage = passagesList[i % passagesList.length];
              promptToUse = `You are an expert reading comprehension test author for Year ${resolvedGrade}.
Generate exactly ${cnt} high-quality multiple choice question(s) for Year ${resolvedGrade} based DIRECTLY on this stimulus text:

### ${targetPassage.title} (${targetPassage.textType})
"""
${targetPassage.text}
"""

COGNITIVE COVERAGE:
- Literal Comprehension
- Inferential Comprehension
- Evaluative Comprehension
- Vocabulary in Context

RULES:
- Exactly 4 options (A, B, C, D) per question.
- "answer" must be the correct option string.
- "explanation" must cite or quote the text.
- Set "passageId" to ${targetPassage.id} and "passageTitle" to "${targetPassage.title}".

Return ONLY a JSON object:
{
  "questions": [
    {
      "id": 1,
      "passageId": ${targetPassage.id},
      "passageTitle": "${targetPassage.title}",
      "text": "Question text...",
      "questionType": "multiple_choice",
      "cognitiveSkill": "Inferential Comprehension",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A",
      "explanation": "Explanation..."
    }
  ]
}`;
            } else {
              promptToUse = getPromptForCount(cnt, `TOPUP-${i + 1}-${Date.now()}`);
            }

            return generateContent({
              prompt: promptToUse,
              responseMimeType: 'application/json',
              provider: tieredModel
            }).then(res => safeParseAiJson(res)).catch(() => ({ questions: [] }));
          });
          const topUpResults = await Promise.all(topUpPromises);
          for (const resObj of topUpResults) {
            const topUpQs = Array.isArray(resObj.questions || resObj) ? (resObj.questions || resObj) : [];
            collectedQuestions.push(...topUpQs.map(sanitizeQuestionData));
          }
        } catch (e) {
          console.error("[HWZ SELF-HEALING ENGINE] Top-up pass encountered issue:", e);
        }
      }

      // Guarantee exact count requested & sequential 1-based indexing
      questions = collectedQuestions.slice(0, questionCount).map((q, idx) => ({ ...q, id: idx + 1 }));

      // Shuffle options for each question to randomize correct answer position
      if (Array.isArray(questions)) {
        questions.forEach(q => {
          if (q.imageUrl && !q.imageUrl.startsWith('/')) {
            // Delete raw external/hallucinated image URLs
            delete q.imageUrl;
          }
          if (Array.isArray(q.options) && q.options.length > 0) {
            for (let i = q.options.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [q.options[i], q.options[j]] = [q.options[j], q.options[i]];
            }
          }
        });
      }

      setGeneratedQuestions(questions);
      setGeneratedPassage(passage);
      setGeneratedPassagesList(passagesList);
      setGeneratedModelUsed(tieredModel);
    } catch (err) {
      console.error("AI Gen Error:", err);
      alert("Failed to generate questions. ❌");
    } finally {
      setIsGenerating(false);
    }
  };

    const handlePublish = async () => {
    if (!generatedQuestions && checkLimitAndTrigger()) return;
    if (!formData.title) {
      alert("Please enter a title for the homework! 📝");
      return;
    }
    if (!formData.classId) {
      alert("Please select a class to assign this to! 🏫");
      return;
    }
    if (!formData.dueDate) {
      alert("Please select a due date! 📅");
      return;
    }
    if (formData.assignType === 'students' && (!formData.assignedStudentIds || formData.assignedStudentIds.length === 0)) {
      alert("Please select at least one student to assign this homework to! 👤");
      return;
    }

    setIsPublishing(true);
    try {
      const activeModel = localStorage.getItem('hwz_active_ai') || 'anthropic';
      const publishGrade = resolveGradeFromClassroomName(activeClassroom?.name);
      const questionsToSave = generatedQuestions || [];

      const isSpatialReasoning = (formData.title || '').toLowerCase().includes('spatial') || (formData.aiPrompt || '').toLowerCase().includes('spatial');
      const isExam = assignmentType === 'test' || Boolean(formData.examPreset);
      const finalType = isExam ? 'test' : 'homework';

      // ⚡ 1-PASS UPFRONT: Extract pre-generated explanations directly from questions
      const questionExplanations = {};
      const missingExplanationQs = [];
      questionsToSave.forEach((q, idx) => {
        const qId = String(q.id || idx + 1);
        if (q.explanation && typeof q.explanation === 'string' && q.explanation.trim()) {
          questionExplanations[qId] = q.explanation.trim();
        } else {
          missingExplanationQs.push(q);
        }
      });

      if (missingExplanationQs.length > 0 && !isSpatialReasoning) {
        try {
          const fallbackExps = await generateExplanations(missingExplanationQs, formData.subject, getModelForGrade(publishGrade, formData.subject, activeModel));
          Object.assign(questionExplanations, fallbackExps);
        } catch (e) {
          console.warn("Fallback explanation generation error:", e);
        }
      }

      const payload = cleanFirestorePayload({
        title: formData.title || '',
        subject: formData.subject || 'maths',
        instructions: formData.instructions || '',
        assignedClassId: formData.classId || '',
        dueDate: formData.dueDate || '',
        time: formData.time || '',
        points: formData.points || '10',
        passage: generatedPassage || null,
        passages: generatedPassagesList || null,
        questions: questionsToSave || [],
        questionExplanations: questionExplanations || {},
        teacherId: user?.uid || '',
        teacherName: user?.displayName || 'Classroom Teacher',
        assignType: formData.assignType || 'all',
        assignedStudentIds: formData.assignType === 'students' ? (formData.assignedStudentIds || []) : [],
        status: 'published',
        type: finalType,
        isExamPaper: isExam,
        examPreset: isExam ? (formData.examPreset || null) : null,
        timeLimit: formData.timeLimit || '30',
        marksPerQuestion: formData.marksPerQuestion || '5',
        difficulty: formData.difficulty || 'Medium',
        targetLanguage: targetLanguage || 'en',
        createdAt: serverTimestamp()
      });

      if (initialDraft?.id) {
        await setDoc(doc(db, 'homeworks', initialDraft.id), payload, { merge: true });
      } else {
        await addDoc(collection(db, 'homeworks'), payload);
        if (!isPaperRecorded && user?.uid) {
          await recordPaperGeneration(db, user.uid);
          setIsPaperRecorded(true);
        }
      }
      alert("Homework Published Successfully! 🚀");
      
      // Reset form
      setFormData({
        subject: 'maths',
        title: '',
        instructions: assignmentType === 'test' ? 'Read each question carefully. You are on a timer! ⏳' : 'Read each question carefully and select the best answer! 🚀',
        aiPrompt: '',
        classId: activeClassroom?.id || '',
        dueDate: '',
        time: '',
        points: '10',
        timeLimit: '30',
        marksPerQuestion: '5',
        assignType: 'all',
        assignedStudentIds: [],
        difficulty: 'Medium'
      });
      setGeneratedQuestions(null);
      setIsAiAccepted(false);
      setIsPaperRecorded(false);
      
      if (typeof onHomeworkCreated === 'function') {
        onHomeworkCreated();
      }
    } catch (err) {
      console.error("Publish Error:", err);
      alert("Failed to publish homework. ❌");
    }
    setIsPublishing(false);
  };

  const handleDiscardDraft = async () => {
    if (!initialDraft?.id) return;
    if (!(await window.confirmCustom("Are you sure you want to completely discard and delete this draft? 🗑️"))) return;
    
    setIsDiscardingDraft(true);
    try {
      await deleteDoc(doc(db, 'homeworks', initialDraft.id));
      alert("Draft Discarded Successfully! 🗑️");
      
      // Reset form
      setFormData({
        subject: 'maths',
        title: '',
        instructions: assignmentType === 'test' ? 'Read each question carefully. You are on a timer! ⏳' : 'Read each question carefully and select the best answer! 🚀',
        aiPrompt: '',
        classId: activeClassroom?.id || '',
        dueDate: '',
        time: '',
        points: '10',
        timeLimit: '30',
        marksPerQuestion: '5',
        assignType: 'all',
        assignedStudentIds: []
      });
      setGeneratedQuestions(null);
      setIsAiAccepted(false);
      setIsPaperRecorded(false);
      
      if (typeof onHomeworkCreated === 'function') {
        onHomeworkCreated();
      }
    } catch (err) {
      console.error("Discard Draft Error:", err);
      alert("Failed to discard draft. ❌");
    }
    setIsDiscardingDraft(false);
  };

  const handleSaveDraft = async () => {
    if (!generatedQuestions && checkLimitAndTrigger()) return;
    if (!formData.title) {
      alert("Please enter a title for the draft! 📝");
      return;
    }
    if (!formData.classId) {
      alert("Please select a class for the draft! 🏫");
      return;
    }
    if (formData.assignType === 'students' && (!formData.assignedStudentIds || formData.assignedStudentIds.length === 0)) {
      alert("Please select at least one student to assign this draft to! 👤");
      return;
    }

    setIsSavingDraft(true);
    try {
      const activeModel = localStorage.getItem('hwz_active_ai') || 'anthropic';
      const draftGrade = resolveGradeFromClassroomName(activeClassroom?.name);
      const questionsToSave = generatedQuestions || [];

      const isSpatialReasoning = (formData.title || '').toLowerCase().includes('spatial') || (formData.aiPrompt || '').toLowerCase().includes('spatial');
      const isExam = assignmentType === 'test' || Boolean(formData.examPreset);
      const finalType = isExam ? 'test' : 'homework';

      // ⚡ 1-PASS UPFRONT: Extract pre-generated explanations directly from questions
      const questionExplanations = {};
      const missingExplanationQs = [];
      questionsToSave.forEach((q, idx) => {
        const qId = String(q.id || idx + 1);
        if (q.explanation && typeof q.explanation === 'string' && q.explanation.trim()) {
          questionExplanations[qId] = q.explanation.trim();
        } else {
          missingExplanationQs.push(q);
        }
      });

      if (missingExplanationQs.length > 0 && !isSpatialReasoning) {
        try {
          const fallbackExps = await generateExplanations(missingExplanationQs, formData.subject, getModelForGrade(draftGrade, formData.subject, activeModel));
          Object.assign(questionExplanations, fallbackExps);
        } catch (e) {
          console.warn("Fallback draft explanation generation error:", e);
        }
      }

      const payload = cleanFirestorePayload({
        title: formData.title || '',
        subject: formData.subject || 'maths',
        instructions: formData.instructions || '',
        assignedClassId: formData.classId || '',
        dueDate: formData.dueDate || '',
        time: formData.time || '',
        points: formData.points || '10',
        passage: generatedPassage || null,
        passages: generatedPassagesList || null,
        questions: questionsToSave || [],
        questionExplanations: questionExplanations || {},
        teacherId: user?.uid || '',
        teacherName: user?.displayName || 'Classroom Teacher',
        assignType: formData.assignType || 'all',
        assignedStudentIds: formData.assignType === 'students' ? (formData.assignedStudentIds || []) : [],
        status: 'draft',
        type: finalType,
        isExamPaper: isExam,
        examPreset: isExam ? (formData.examPreset || null) : null,
        timeLimit: formData.timeLimit || '30',
        marksPerQuestion: formData.marksPerQuestion || '5',
        difficulty: formData.difficulty || 'Medium',
        createdAt: serverTimestamp()
      });

      if (initialDraft?.id) {
        await setDoc(doc(db, 'homeworks', initialDraft.id), payload, { merge: true });
      } else {
        await addDoc(collection(db, 'homeworks'), payload);
        if (!isPaperRecorded && user?.uid) {
          await recordPaperGeneration(db, user.uid);
          setIsPaperRecorded(true);
        }
      }
      alert("Homework Saved as Draft! 📝🚀");
      
      // Reset form
      setFormData({
        subject: 'maths',
        title: '',
        instructions: assignmentType === 'test' ? 'Read each question carefully. You are on a timer! ⏳' : 'Read each question carefully and select the best answer! 🚀',
        aiPrompt: '',
        classId: activeClassroom?.id || '',
        dueDate: '',
        time: '',
        points: '10',
        timeLimit: '30',
        marksPerQuestion: '5',
        assignType: 'all',
        assignedStudentIds: [],
        difficulty: 'Medium'
      });
      setGeneratedQuestions(null);
      setIsAiAccepted(false);
      setIsPaperRecorded(false);
      
      if (typeof onHomeworkCreated === 'function') {
        onHomeworkCreated();
      }
      
      fetchPastHomeworks();
    } catch (err) {
      console.error("Save Draft Error:", err);
      alert("Failed to save draft. ❌");
    }
    setIsSavingDraft(false);
  };

  return (
    <div className="max-w-6xl mx-auto animate-in font-nunito pb-10">
      
      {/* Tab Switcher & Quota Counter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="bg-slate-100 p-1.5 rounded-full flex gap-1 border border-slate-200/60 shadow-sm flex-wrap justify-center">
          <button 
            onClick={() => { setActiveTab('create'); setAssignmentType(null); }}
            className={`px-6 py-3 rounded-full font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'create' ? 'bg-white text-orange-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <PlusCircle className="w-4 h-4" /> Create New
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-full font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'history' ? 'bg-white text-orange-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <History className="w-4 h-4" /> Past Homeworks
          </button>
          <button 
            onClick={() => setActiveTab('history-tests')}
            className={`px-6 py-3 rounded-full font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'history-tests' ? 'bg-white text-orange-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <BookOpen className="w-4 h-4" /> Past Tests
          </button>
        </div>

        {/* Paper Quota Credit Badge */}
        {!quotaInfo.isUnlimited && (
          <div className="flex items-center gap-2 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200/70 rounded-full px-4 py-2 shadow-sm">
            <span className="text-sm">📄</span>
            <span className="text-xs font-bold text-slate-700">
              <strong className="text-violet-700">{quotaInfo.usage}</strong> / {quotaInfo.limit} Papers Used
            </span>
            <button
              onClick={() => setShowBoosterModal(true)}
              className="ml-1 px-3 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black text-[11px] rounded-full shadow transition-all active:scale-95 flex items-center gap-1"
            >
              <span>⚡</span> Top-Up
            </button>
          </div>
        )}
      </div>

      {activeTab === 'create' ? (
        !assignmentType ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-10">
            <h2 className="text-4xl font-black text-[#14532d]">What would you like to create?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full px-4">
              {/* Card 1: Homework */}
              <button 
                onClick={() => {
                  if (hasReachedLimit) {
                    if (activePlanId === 'free') setShowUpgradeModal(true);
                    else setShowBoosterModal(true);
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      isExamPaper: false,
                      examPreset: null,
                      title: '',
                      instructions: 'Read each question carefully and select the best answer! 🚀'
                    }));
                    setAssignmentType('homework');
                  }
                }} 
                className={`h-72 rounded-[40px] border-2 shadow-xl hover:shadow-2xl flex flex-col items-center justify-center gap-5 transition-all p-6 text-center relative overflow-hidden ${
                  hasReachedLimit 
                    ? 'bg-slate-50 border-slate-200 opacity-65 cursor-pointer' 
                    : 'bg-gradient-to-br from-white via-pink-50/40 to-rose-100/30 border-pink-200/80 hover:shadow-pink-200/50 hover:-translate-y-2 hover:border-pink-400 group cursor-pointer'
                }`}
              >
                <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg ring-4 ${
                  hasReachedLimit 
                    ? 'bg-slate-300 text-slate-500 ring-slate-100 shadow-none' 
                    : 'bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 text-white ring-pink-100 shadow-pink-500/30 group-hover:scale-110 transition-transform'
                }`}>
                  {hasReachedLimit ? <Lock className="w-11 h-11 drop-shadow-md" /> : <Pencil className="w-11 h-11 drop-shadow-md" />}
                </div>
                <div className="space-y-1">
                  <span className={`text-2xl font-black transition-colors block ${hasReachedLimit ? 'text-slate-500' : 'text-slate-800 group-hover:text-pink-600'}`}>Homework</span>
                  <span className={`text-xs font-bold block px-3 py-1 rounded-full ${hasReachedLimit ? 'bg-slate-200 text-slate-500' : 'bg-pink-100/60 text-pink-600/90'}`}>
                    {hasReachedLimit ? '🔒 Paper Limit Reached' : 'Fun & Engaging Assignments 🎨'}
                  </span>
                </div>
              </button>
              
              {/* Card 2: Test Builder */}
              <button 
                onClick={() => {
                  if (hasReachedLimit) {
                    if (activePlanId === 'free') setShowUpgradeModal(true);
                    else setShowBoosterModal(true);
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      isExamPaper: false,
                      examPreset: null,
                      title: '',
                      instructions: 'Read each question carefully. You are on a timer! ⏳'
                    }));
                    setAssignmentType('test');
                  }
                }} 
                className={`h-72 rounded-[40px] border-2 shadow-xl hover:shadow-2xl flex flex-col items-center justify-center gap-5 transition-all p-6 text-center relative overflow-hidden ${
                  hasReachedLimit 
                    ? 'bg-slate-50 border-slate-200 opacity-65 cursor-pointer' 
                    : 'bg-gradient-to-br from-white via-emerald-50/40 to-teal-100/30 border-emerald-200/80 hover:shadow-emerald-200/50 hover:-translate-y-2 hover:border-emerald-400 group cursor-pointer'
                }`}
              >
                <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg ring-4 ${
                  hasReachedLimit 
                    ? 'bg-slate-300 text-slate-500 ring-slate-100 shadow-none' 
                    : 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 text-white ring-emerald-100 shadow-emerald-500/30 group-hover:scale-110 transition-transform'
                }`}>
                  {hasReachedLimit ? <Lock className="w-11 h-11 drop-shadow-md" /> : <BookOpen className="w-11 h-11 drop-shadow-md" />}
                </div>
                <div className="space-y-1">
                  <span className={`text-2xl font-black transition-colors block ${hasReachedLimit ? 'text-slate-500' : 'text-slate-800 group-hover:text-emerald-700'}`}>Test Builder</span>
                  <span className={`text-xs font-bold block px-3 py-1 rounded-full ${hasReachedLimit ? 'bg-slate-200 text-slate-500' : 'bg-emerald-100/60 text-emerald-700/90'}`}>
                    {hasReachedLimit ? '🔒 Paper Limit Reached' : 'Timed Quizzes & Standard Tests ⏳'}
                  </span>
                </div>
              </button>

              {/* Card 3: International Exam Builder */}
              <button 
                onClick={() => {
                  if (hasReachedLimit) {
                    if (activePlanId === 'free') setShowUpgradeModal(true);
                    else setShowBoosterModal(true);
                  } else {
                    setAssignmentType('exam_hub');
                  }
                }} 
                className={`h-72 rounded-[40px] border-2 shadow-xl hover:shadow-2xl flex flex-col items-center justify-center gap-5 transition-all p-6 text-center relative overflow-hidden ${
                  hasReachedLimit 
                    ? 'bg-slate-50 border-slate-200 opacity-65 cursor-pointer' 
                    : 'bg-gradient-to-br from-white via-purple-50/60 to-amber-50/50 border-purple-200/90 hover:shadow-purple-200/60 hover:-translate-y-2 hover:border-purple-400 group cursor-pointer'
                }`}
              >
                <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg ring-4 ${
                  hasReachedLimit 
                    ? 'bg-slate-300 text-slate-500 ring-slate-100 shadow-none' 
                    : 'bg-gradient-to-tr from-purple-600 via-violet-600 to-amber-400 text-amber-300 ring-purple-100 shadow-purple-500/30 group-hover:scale-110 transition-transform'
                }`}>
                  {hasReachedLimit ? <Lock className="w-11 h-11 drop-shadow-md text-slate-500" /> : <Globe className="w-11 h-11 text-amber-300 drop-shadow-md stroke-[2.2]" />}
                </div>
                <div className="space-y-1">
                  <span className={`text-xl font-black transition-colors block ${hasReachedLimit ? 'text-slate-500' : 'text-slate-800 group-hover:text-purple-700'}`}>International Exam Builder</span>
                  <span className={`text-[10px] font-extrabold block px-3 py-1 rounded-full border ${hasReachedLimit ? 'bg-slate-200 text-slate-500 border-slate-300' : 'bg-purple-100/70 text-purple-800 border-purple-200/60'}`}>
                    {hasReachedLimit ? '🔒 Paper Limit Reached' : 'NSW Selective, ACER, ICAS, SAT, NAPLAN & 11+ 🌐'}
                  </span>
                </div>
              </button>
            </div>
          </div>
        ) : assignmentType === 'exam_hub' ? (
          <InternationalExamHubView
            onBack={() => setAssignmentType(null)}
            onSelectExam={(exam) => {
              const gradeName = resolveGradeFromClassroomName(activeClassroom?.name);
              const naplanDefs = getNaplanDefaults(exam.id, gradeName);
              const finalTime = naplanDefs ? String(naplanDefs.time) : String(exam.defaultTime);
              const finalQuestions = Math.min(50, naplanDefs ? naplanDefs.questions : (exam.defaultQuestions || 30));

              setFormData(prev => ({
                ...prev,
                subject: exam.subject,
                title: `${exam.name} Practice Paper`,
                instructions: `Read each question carefully. You are on a ${finalTime}-minute timer! ⏳`,
                aiPrompt: exam.promptInstruction,
                timeLimit: finalTime,
                examPreset: exam.id,
                isExamPaper: true
              }));
              setQuestionCount(finalQuestions);
              setIsCurriculumMode(false);
              setAssignmentType('test');
            }}
          />
        ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <button
                onClick={() => {
                  setAssignmentType(null);
                  setFormData(prev => ({ ...prev, isExamPaper: false, examPreset: null }));
                }}
                className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-black shadow-md border border-slate-200 transition-all active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-[#14532d]" /> Back to Creation Options
              </button>

              <h1 className="text-5xl font-black text-[#14532d] tracking-tight mb-2">
                {formData.isExamPaper ? 'Create Exam Paper' : assignmentType === 'test' ? 'Create Test' : 'Create Homework'}
              </h1>
              <div className="relative inline-block">
                 <p className="text-lg text-slate-500 font-bold">
                   {formData.isExamPaper ? 'Generate official, computer-based exam practice papers!' : 'Prepare fun and meaningful homework for your students!'}
                 </p>
                 <svg className="absolute -bottom-2 left-0 w-32 h-3 text-green-400 opacity-60" viewBox="0 0 100 20" preserveAspectRatio="none">
                   <path d="M0,10 Q10,20 20,10 T40,10 T60,10 T80,10 T100,10" fill="none" stroke="currentColor" strokeWidth="3" />
                 </svg>
              </div>
            </div>
            
            <div className="flex items-center gap-4 relative mt-4">
              <div className="bg-white border-2 border-pink-100 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm relative z-10">
                <Star className="w-5 h-5 text-pink-400 fill-current" />
                <span className="font-bold text-slate-700">Hi, Teacher!</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <img src="/mascot.png" alt="Mascot" className="w-20 h-20 object-contain absolute -top-8 -left-16 drop-shadow-md" />
            </div>
          </div>

      {/* Step 1: Choose Subject */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-black">1</div>
          <h2 className="text-2xl font-black text-[#14532d]">Choose Subject</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {getDynamicSubjects().map((sub) => (
            <div 
              key={sub.id}
              onClick={() => setFormData({...formData, subject: sub.id})}
              className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center group ${sub.bgColor} ${formData.subject === sub.id ? sub.selectedBorder : sub.borderColor} hover:shadow-md hover:-translate-y-0.5`}
            >
              {/* Radio Indicator */}
              <div className={`absolute top-2.5 right-2.5 w-4 h-4 rounded-full border flex items-center justify-center ${formData.subject === sub.id ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'}`}>
                {formData.subject === sub.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              
              <div className="scale-75 origin-center mb-1 flex items-center justify-center h-14">
                {sub.renderGraphic()}
              </div>
              
              <h3 className={`text-sm font-black mb-1 line-clamp-1 ${sub.titleColor}`}>{sub.name}</h3>
              
              <p className="text-slate-500 font-semibold text-[11px] leading-tight line-clamp-2 px-1">{sub.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Col: Details / Storybook Setup */}
        <div className="space-y-8">
          {formData.subject === 'library_book' ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black">2</div>
                <h2 className="text-2xl font-black text-indigo-950">Storybook Setup</h2>
              </div>

              <div className="bg-indigo-50/60 p-6 rounded-3xl border-2 border-indigo-200 flex flex-col space-y-5 text-left shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md shrink-0">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                  </div>
                  <div>
                    <h4 className="font-black text-indigo-950 text-sm">Pixar-Level AI Storybook Generator</h4>
                    <p className="text-[10px] font-bold text-indigo-600">AI automatically creates an original story, 8K illustrations, vocab tooltips, & comprehension quiz!</p>
                  </div>
                </div>

                {/* Custom Free-Text Characters & Story Instructions (Replaces old pill buttons) */}
                <div className="space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <label className="font-black text-indigo-950 text-xs flex items-center gap-1.5">
                      <span>✍️</span> Custom Characters & Story Instructions (Free-Text Prompt)
                    </label>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                      Type Anything
                    </span>
                  </div>

                  <textarea
                    rows={3}
                    value={customStoryPrompt}
                    onChange={(e) => setCustomStoryPrompt(e.target.value)}
                    placeholder="Type exact characters, species, names, setting, plot points, or lesson... (e.g. 'Dara, a baby teal baby pterodactyl with soft yellow wingtips, and Petal the stegosaurus, exploring the fern valley and solving a water crisis with teamwork')"
                    className="w-full bg-white border-2 border-slate-200 focus:border-indigo-500 rounded-2xl p-3 text-xs font-bold text-slate-800 outline-none transition-all shadow-inner placeholder:text-slate-400 placeholder:font-normal leading-relaxed"
                  />

                  {/* Quick Suggestion Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Quick Ideas:</span>
                    {[
                      { label: '🦕 Pterodactyl & Stegosaurus', text: 'Dara, a baby teal baby pterodactyl with soft yellow wingtips, and Petal, a moss-green baby stegosaurus, working together in giant fern valley.' },
                      { label: '🤝 Raju & Mohan (Village Water)', text: 'Two best friends Raju and Mohan in a small Indian village working hard together to clear stones and save the dried water well.' },
                      { label: '🚀 Space Cat Nebula', text: 'Nebula, a fluffy orange space cat in a bubble helmet saving the starship Star-Paws from a glowing space nebula.' },
                      { label: '🐢 Timmy the Tortoise', text: 'Timmy, a slow and brave little tortoise climbing a big green hill, proving that slow and steady wins the race.' }
                    ].map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCustomStoryPrompt(chip.text)}
                        className="text-[10px] font-bold text-slate-600 hover:text-indigo-700 bg-slate-100 hover:bg-indigo-50 px-2.5 py-1 rounded-xl border border-slate-200 transition-all cursor-pointer active:scale-95"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Language Selection */}
                <div className="space-y-1.5">
                  <label className="font-bold text-indigo-950 text-xs flex items-center justify-between">
                    <span>Storybook Language</span>
                    <span className="text-[10px] text-indigo-600 font-semibold">17+ Regional & Global Languages</span>
                  </label>
                  <div className="relative">
                    <select
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="w-full bg-white border-2 border-slate-200 rounded-2xl p-3.5 text-slate-800 font-bold outline-none focus:border-indigo-500 text-xs appearance-none cursor-pointer pr-10"
                    >
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name} ({lang.nativeName})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* AI Illustration Style */}
                <div className="space-y-1.5">
                  <label className="font-bold text-indigo-950 text-xs">AI Illustration Style</label>
                  <select
                    value={bookIllustrationStyle}
                    onChange={(e) => setBookIllustrationStyle(e.target.value)}
                    className="w-full bg-white border-2 border-slate-200 rounded-2xl p-3.5 text-slate-800 font-bold outline-none focus:border-indigo-500 text-xs cursor-pointer"
                  >
                    {['Pixar 3D CGI', 'Disney Storybook', 'DreamWorks 3D Animation', 'Storybook Watercolor', 'Anime Ghibli Style', 'Soft Pastels & Clay', 'Paper Cut Art'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Page Count Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-indigo-950">
                    <span>Number of Pages (Max 5)</span>
                    <span className="font-black text-indigo-600 bg-white px-2.5 py-0.5 rounded-lg border border-indigo-200">{bookPageCount} Pages</span>
                  </div>
                  <input 
                    type="range"
                    min="3"
                    max="5"
                    value={bookPageCount}
                    onChange={(e) => setBookPageCount(Number(e.target.value))}
                    className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* AI Master Prompt Inspector Toggle */}
                <div className="space-y-2 pt-2 border-t border-indigo-200/60">
                  <button
                    type="button"
                    onClick={() => setShowPromptInspector(prev => !prev)}
                    className="w-full py-2.5 px-4 bg-white border border-indigo-200 hover:bg-indigo-100 rounded-xl text-indigo-900 font-extrabold text-xs flex items-center justify-between transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Book className="w-4 h-4 text-indigo-600" />
                      {showPromptInspector ? 'Hide Master AI Prompt' : '📜 View / Edit Master AI Prompt'}
                    </span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md font-black">
                      {showPromptInspector ? 'Collapse' : 'Inspect Prompt'}
                    </span>
                  </button>

                  {showPromptInspector && (
                    <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl border border-slate-800 space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">
                          Pixar 12-Step Master Prompt Template
                        </span>
                        {customPromptOverride && (
                          <button
                            type="button"
                            onClick={() => setCustomPromptOverride('')}
                            className="text-[10px] text-amber-400 hover:underline font-bold"
                          >
                            Reset to Template
                          </button>
                        )}
                      </div>
                      <textarea
                        value={getConstructedPixarPrompt()}
                        onChange={(e) => setCustomPromptOverride(e.target.value)}
                        className="w-full h-56 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-indigo-200 outline-none focus:border-indigo-500 custom-scrollbar leading-relaxed"
                      />
                      <p className="text-[10px] text-slate-400 font-bold">
                        💡 Tip: The AI will generate a completely original story world, characters, and plot automatically! You can edit this prompt to add custom instructions.
                      </p>
                    </div>
                  )}
                </div>

                {/* Magic Generate Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (hasReachedLimit) {
                      if (activePlanId === 'free') setShowUpgradeModal(true);
                      else setShowBoosterModal(true);
                    } else {
                      handleGenerateBook();
                    }
                  }}
                  disabled={isGeneratingBook}
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    hasReachedLimit 
                      ? 'bg-slate-300 text-slate-500 cursor-pointer shadow-none' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20'
                  }`}
                >
                  {isGeneratingBook ? <Loader2 className="w-5 h-5 animate-spin" /> : hasReachedLimit ? <Lock className="w-5 h-5" /> : <Wand2 className="w-5 h-5 text-yellow-300" />}
                  {isGeneratingBook ? (bookGenStatus || 'Crafting Pixar Storybook...') : hasReachedLimit ? '🔒 Paper Limit Reached' : 'Magic Generate Storybook 🪄'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-black">2</div>
                <h2 className="text-2xl font-black text-[#14532d]">
                  {formData.isExamPaper || formData.examPreset
                    ? 'International Exam Details 🌐'
                    : assignmentType === 'test'
                    ? 'Test Details ⏱️'
                    : 'Homework Details 📝'}
                </h2>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-[#14532d]">
                  {formData.isExamPaper || formData.examPreset
                    ? 'Exam Title'
                    : assignmentType === 'test'
                    ? 'Test Title'
                    : 'Homework Title'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder={
                      formData.isExamPaper || formData.examPreset
                        ? 'Enter exam paper title (e.g. NSW Selective Practice 1)...'
                        : assignmentType === 'test'
                        ? 'Enter test title (e.g. End of Unit Quiz)...'
                        : 'Enter homework title...'
                    }
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full h-14 bg-white border-2 border-slate-200 rounded-2xl px-4 text-slate-700 font-bold outline-none focus:border-green-400 transition-colors"
                  />
                  <Pencil className="absolute right-4 top-4 w-5 h-5 text-slate-400" />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between mb-2">
                   <label className="font-bold text-[#14532d]">Number of Questions</label>
                   <span className="font-black text-green-600 bg-green-50 px-3 py-1 rounded-xl text-sm">{questionCount}</span>
                </div>
                <input 
                   type="range" 
                   min="1" 
                   max="50" 
                   value={questionCount} 
                   onChange={(e) => setQuestionCount(Number(e.target.value))}
                   className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
                   <span>1 (Quick check)</span>
                   <span>50 (Full exam)</span>
                </div>
              </div>

              {!formData.isExamPaper && (
                formData.subject !== 'olympiad' ? (
                  <div className="space-y-2 mb-6">
                    <label className="font-bold text-[#14532d] block text-sm">Complexity Level</label>
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1.5 border border-slate-200 rounded-2xl">
                      {['Easy', 'Medium', 'Hard'].map(diff => (
                        <button
                          key={diff}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, difficulty: diff }))}
                          className={`py-2.5 rounded-xl text-sm font-black transition-all ${
                            formData.difficulty === diff 
                              ? 'bg-green-600 text-white shadow-sm' 
                              : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 mb-6">
                    <label className="font-bold text-[#14532d] block text-sm">Complexity Level</label>
                    <div className="w-full py-2.5 bg-slate-50 border border-slate-200 rounded-2xl px-4 flex items-center text-sm font-bold text-green-700">
                      <span>Olympiad (Inherently Hard)</span>
                    </div>
                  </div>
                )
              )}

              <div className="space-y-6">
                {/* Unified Magic Quiz Builder Panel */}
                <div className="bg-green-50/50 p-6 rounded-3xl border-2 border-green-200/80 flex flex-col space-y-5">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#EA580C] shrink-0 border border-green-200">
                        <Wand2 className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                         <h4 className="font-black text-green-900 text-sm">Magic Quiz Builder</h4>
                         <p className="text-[10px] font-bold text-green-600/70">Automatically generate {questionCount} multiple-choice questions based on your title & AI prompt.</p>
                      </div>
                   </div>

                {hasTopicsForCurrentSubject ? (
                  <div className="space-y-3 text-left">
                    <div className="flex items-center justify-between ml-1">
                      <label className="font-bold text-[#14532d] text-xs">Curriculum Mode</label>
                      <div className="flex bg-green-100 rounded-xl p-1">
                        <button
                          onClick={() => setIsCurriculumMode(true)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${isCurriculumMode ? 'bg-white shadow-sm text-green-700' : 'text-green-600/70 hover:text-green-700'}`}
                        >
                          Browse Curriculum
                        </button>
                        <button
                          onClick={() => setIsCurriculumMode(false)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${!isCurriculumMode ? 'bg-white shadow-sm text-green-700' : 'text-green-600/70 hover:text-green-700'}`}
                        >
                          Custom Prompt
                        </button>
                      </div>
                    </div>

                    {isCurriculumMode ? (
                      <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 space-y-4">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <p className="text-xs font-bold text-slate-500 mb-1">Target Grade</p>
                          <p className="text-sm font-black text-slate-800">{resolveGradeFromClassroomName(activeClassroom?.name)}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Automatically selected based on your class.</p>
                        </div>
                        
                        <div>
                           <label className="font-bold text-[#14532d] text-xs block mb-1">Select Topics & Skills <span className="text-rose-500">*</span></label>
                           <button 
                             onClick={() => setIsCurriculumModalOpen(true)}
                             className="w-full h-12 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 text-slate-700 font-bold hover:border-green-400 hover:bg-white transition-all flex items-center justify-between cursor-pointer"
                           >
                             <span className={selectedSkills.length > 0 ? "text-green-700" : "text-slate-400"}>
                               {selectedSkills.length > 0 ? `${selectedSkills.length} skills selected` : "Browse Topics & Skills"}
                             </span>
                             <ChevronRight className="w-5 h-5 text-slate-400" />
                           </button>
                           
                           {selectedSkills.length > 0 && (
                             <div>
                               <div className="mt-3 flex items-center justify-between">
                                 <span className="text-[10px] text-slate-500 font-bold">Selected Skills</span>
                                 <button 
                                   onClick={() => setSelectedSkills([])}
                                   className="text-[10px] text-rose-500 font-bold hover:underline"
                                 >
                                   Clear All
                                 </button>
                               </div>
                               <div className="mt-2 flex flex-wrap gap-2">
                                 {selectedSkills.map(skill => (
                                   <div key={skill.id} className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                                     {skill.title.length > 20 ? skill.title.substring(0, 20) + '...' : skill.title}
                                     <X 
                                       className="w-3 h-3 cursor-pointer hover:text-green-600" 
                                       onClick={() => setSelectedSkills(prev => prev.filter(s => s.id !== skill.id))}
                                     />
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )}
                         </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <textarea 
                          placeholder={getPlaceholder()}
                          value={formData.aiPrompt}
                          onChange={(e) => setFormData({...formData, aiPrompt: e.target.value})}
                          className="w-full h-64 bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-700 font-bold outline-none focus:border-green-400 transition-colors resize-y text-xs font-sans"
                        />
                        <Wand2 className="absolute right-4 bottom-4 w-5 h-5 text-green-400 opacity-50 pointer-events-none" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 text-left">
                    <label className="font-bold text-[#14532d] text-xs block">AI Prompt / Instructions</label>
                    <div className="relative">
                      <textarea 
                        placeholder={getPlaceholder()}
                        value={formData.aiPrompt}
                        onChange={(e) => setFormData({...formData, aiPrompt: e.target.value})}
                        className="w-full h-64 bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-700 font-bold outline-none focus:border-green-400 transition-colors resize-y text-xs font-sans"
                      />
                      <Wand2 className="absolute right-4 bottom-4 w-5 h-5 text-green-400 opacity-50 pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* Target Language Selection */}
                <div className="space-y-1.5 text-left">
                  <label className="font-bold text-[#14532d] text-xs block ml-1 flex items-center justify-between">
                    <span>Quiz Generation Language</span>
                    <span className="text-[10px] text-slate-400 font-semibold">100+ Regional & Global Languages</span>
                  </label>
                  <div className="relative">
                    <select
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="w-full bg-white border-2 border-slate-200 rounded-2xl p-3.5 text-slate-800 font-bold outline-none focus:border-green-400 transition-colors text-xs appearance-none cursor-pointer pr-10"
                    >
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name} ({lang.nativeName})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="font-bold text-[#14532d] text-xs block ml-1">Instructions for Students (shown on student dashboard)</label>
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="e.g. Read each question carefully and select the best answer!"
                      value={formData.instructions}
                      onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                      className="w-full bg-white border-2 border-slate-200 rounded-2xl p-4 text-slate-700 font-bold outline-none focus:border-green-400 transition-colors text-xs"
                    />
                    <Book className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400 opacity-50" />
                  </div>
                </div>

                {generatedQuestions ? (
                   isAiAccepted ? (
                     <div className="w-full bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex items-center justify-between animate-in zoom-in duration-300">
                       <div className="flex items-center gap-3 text-emerald-700 font-bold text-xs">
                         <CheckCircle2 className="w-5 h-5" />
                         {generatedQuestions.length} Questions Saved to Draft! Scroll down to publish.
                       </div>
                       <button onClick={() => setIsAiAccepted(false)} className="text-xs text-emerald-600 font-bold hover:underline px-4 py-2 bg-white rounded-lg border border-emerald-200">View Questions</button>
                     </div>
                   ) : (
                     <div className="w-full text-left bg-white p-6 rounded-2xl border border-green-200 space-y-6">
                       <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                         <div className="flex items-center gap-2 text-emerald-600 font-black text-sm">
                           <CheckCircle2 className="w-5 h-5" /> {generatedQuestions.length} Questions Ready!
                         </div>
                         <div className="flex gap-2">
                           <button onClick={() => setIsAiAccepted(true)} className="text-xs text-white font-bold px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg shadow-sm transition-colors">Accept & Continue</button>
                         </div>
                       </div>
                       <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                         {generatedQuestions.map((q, idx) => (
                             <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                               {(() => {
                                 const { text: cleanText, clockTime, inlineSvg } = parseQuestionText(q.text);
                                 return (
                                   <>
                                     <p className="font-bold text-slate-800 text-xs mb-3 whitespace-pre-wrap">
                                       <span className="text-green-600 mr-1 font-black">Q{idx + 1}.</span> {cleanText}
                                     </p>
                                     {clockTime && (
                                       <div className="mb-4 transform scale-75 origin-top-left">
                                         <ClockFace timeStr={clockTime} />
                                       </div>
                                     )}
                                     {inlineSvg && (
                                       <div className="flex justify-center mb-4 bg-white rounded-lg p-2 border border-slate-100 shadow-sm mx-auto">
                                         <div dangerouslySetInnerHTML={{ __html: inlineSvg }} className="w-full h-auto flex justify-center" />
                                       </div>
                                     )}
                                   </>
                                 );
                               })()}
                               {q.chartData && (
                                 <div className="mb-4">
                                   <DynamicChart data={q.chartData} />
                                 </div>
                               )}
                               {q.geometryData && (
                                 <div className="mb-4">
                                   <DynamicGeometry data={q.geometryData} />
                                 </div>
                               )}
                               {q.gridMapData && (
                                 <div className="mb-4">
                                   <DynamicGridMap data={q.gridMapData} />
                                 </div>
                               )}
                               {q.numberLineData && (
                                 <div className="mb-4">
                                   <DynamicNumberLine data={q.numberLineData} />
                                 </div>
                               )}
                               {q.pathData && (
                                 <div className="mb-4 max-w-[300px] mx-auto">
                                   <DynamicPathMap data={q.pathData} />
                                 </div>
                               )}
                               {q.instrumentData && (
                                 <div className="mb-4">
                                   <DynamicInstrument data={q.instrumentData} />
                                 </div>
                               )}
                               {q.blockData && (
                                 <div className="mb-4">
                                   <DynamicBlockStructure data={q.blockData} />
                                 </div>
                               )}
                               {q.earlyMathData && (
                                 <div className="mb-4 transform scale-75 origin-top-left">
                                   <EarlyMathVisualizer data={q.earlyMathData} />
                                 </div>
                               )}
                               {q.vennDiagramData && (
                                 <div className="mb-4">
                                   <DynamicVennDiagram data={q.vennDiagramData} />
                                 </div>
                               )}
                               {q.svgCode && !q.chartData && !q.geometryData && !q.gridMapData && !q.numberLineData && !q.pathData && !q.instrumentData && !q.blockData && !q.earlyMathData && (
                                 <div className="flex justify-center mb-4 bg-white rounded-lg p-2 border border-slate-100 shadow-sm max-w-[200px] mx-auto">
                                   <div dangerouslySetInnerHTML={{ __html: q.svgCode }} className="w-full h-auto" />
                                 </div>
                               )}
                               <div className="grid grid-cols-2 gap-2">
                                 {q.options && q.options.map((opt, i) => (
                                   <div key={i} className={`px-3 py-2 rounded-lg text-[10px] font-bold border ${opt === q.answer ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-white border-slate-200 text-slate-600'}`}>
                                     {typeof opt === 'string' && opt.trim().startsWith('<svg') ? (
                                       <div dangerouslySetInnerHTML={{ __html: opt }} className="w-full flex justify-center overflow-hidden" />
                                     ) : (
                                       opt
                                     )}
                                   </div>
                                 ))}
                               </div>
                             </div>
                           ))}
                       </div>
                       <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                         <button 
                      onClick={() => {
                        if (hasReachedLimit) {
                          if (activePlanId === 'free') setShowUpgradeModal(true);
                          else setShowBoosterModal(true);
                        } else {
                          handleGenerateAI();
                        }
                      }}
                      disabled={isGenerating}
                      className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        hasReachedLimit 
                          ? 'bg-slate-300 text-slate-500 cursor-pointer shadow-none' 
                          : 'bg-[#EA580C] hover:bg-[#C2410C] text-white shadow-lg shadow-orange-100/50'
                      }`}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating Questions...
                        </>
                      ) : hasReachedLimit ? (
                        <>
                          <Lock className="w-4 h-4" />
                          🔒 Paper Limit Reached
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Auto-Generate Questions
                        </>
                      )}
                    </button>
                         <button onClick={() => {setGeneratedQuestions(null);
      setIsAiAccepted(false);
      setIsPaperRecorded(false);}} className="text-xs text-rose-500 font-bold hover:underline px-4 py-2 bg-rose-50 rounded-lg">Clear Questions</button>
                       </div>
                     </div>
                   )
                ) : (
                   <button 
                     onClick={handleGenerateAI}
                     disabled={isGenerating}
                     className="w-full bg-[#EA580C] hover:bg-[#C2410C] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-orange-100/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                   >
                     {isGenerating ? (
                       <>
                         <Loader2 className="w-4 h-4 animate-spin" />
                         Generating Questions...
                       </>
                     ) : (
                       <>
                         <Sparkles className="w-4 h-4" />
                         Auto-Generate Questions
                       </>
                     )}
                   </button>
                )}
             </div>

             <div className="space-y-2">
               <label className="font-bold text-[#14532d] flex items-center gap-2">
                 Attach Resources <span className="text-slate-400 font-normal">(optional)</span>
               </label>
               <div 
                 onClick={() => fileInputRef.current?.click()}
                 className="border-2 border-dashed border-green-200 bg-green-50/50 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-green-50 transition-colors text-center"
               >
                 <Upload className="w-6 h-6 text-green-400 mb-2" />
                 <p className="font-bold text-green-600 text-sm">Upload worksheets, images or videos</p>
                 <p className="text-xs font-bold text-slate-400">Drag & drop or click to upload</p>
                 <input 
                   type="file" 
                   multiple 
                   className="hidden" 
                   ref={fileInputRef} 
                   onChange={handleFileSelect} 
                 />
               </div>
               
               {attachments.length > 0 && (
                 <div className="flex flex-wrap gap-2 mt-4">
                   {attachments.map((file, idx) => (
                     <div key={idx} className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1.5 rounded-xl text-sm">
                       <span className="truncate max-w-[150px] font-medium">{file.name}</span>
                       <button 
                         onClick={() => removeAttachment(idx)}
                         className="p-1 hover:bg-green-200 rounded-full transition-colors"
                       >
                         <X className="w-4 h-4 text-green-600" />
                       </button>
                     </div>
                   ))}
                 </div>
               )}
             </div>
            </div>
          </>
        )}
      </div>

        {/* Right Col: Assign To / Book Preview */}
        <div className="space-y-8 relative">
          {formData.subject === 'library_book' ? (
            <div className="space-y-6 text-left">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black">3</div>
                  <h2 className="text-2xl font-black text-indigo-950">Book Preview & Publish</h2>
                </div>
                {generatedBook && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowPromptModal(true)}
                      className="px-4 py-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-black text-xs rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Book className="w-4 h-4 text-indigo-600" />
                      View AI Prompt 📜
                    </button>
                    <button
                      onClick={handlePublishBook}
                      disabled={isPublishing}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-yellow-300" />}
                      Publish to Library 🚀
                    </button>
                  </div>
                )}
              </div>

              {!generatedBook ? (
                <div className="bg-white rounded-3xl border-2 border-dashed border-indigo-200 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-500 mb-4 animate-pulse">
                    <BookOpen className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-black text-indigo-950 mb-2">No Storybook Generated Yet</h3>
                  <p className="text-xs font-bold text-slate-500 max-w-sm">Fill in the story parameters on the left and click "Magic Generate Storybook" to craft a Pixar-quality illustrated book!</p>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border-2 border-indigo-200 p-6 shadow-xl space-y-6">
                  {/* Book Title & Cover Banner */}
                  <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                    <div className="flex items-start justify-between relative z-10">
                      <div>
                        <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-wider text-indigo-200">
                          {generatedBook.genre || 'Adventure'} • {generatedBook.targetGrade || 'Grade 1'}
                        </span>
                        <h3 className="text-2xl font-black mt-2 text-yellow-300">{generatedBook.emoji} {generatedBook.title}</h3>
                        {generatedBook.subtitle && <p className="text-xs font-bold text-indigo-200 mt-0.5">{generatedBook.subtitle}</p>}
                        <p className="text-xs font-semibold text-slate-300 mt-2 max-w-lg">{generatedBook.summary}</p>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Page Reader */}
                  {generatedBook.pages && generatedBook.pages.length > 0 && (
                    <div className="space-y-4">
                      {/* Page Navigation Header */}
                      <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-2xl border border-indigo-100">
                        <button
                          onClick={() => setActivePreviewPage(prev => Math.max(0, prev - 1))}
                          disabled={activePreviewPage === 0}
                          className="px-4 py-2 bg-white rounded-xl text-xs font-black text-indigo-900 shadow-sm border border-indigo-200 disabled:opacity-40 cursor-pointer"
                        >
                          ‹ Previous Page
                        </button>
                        <span className="text-xs font-black text-indigo-950">
                          Page {activePreviewPage + 1} of {generatedBook.pages.length}
                        </span>
                        <button
                          onClick={() => setActivePreviewPage(prev => Math.min(generatedBook.pages.length - 1, prev + 1))}
                          disabled={activePreviewPage === generatedBook.pages.length - 1}
                          className="px-4 py-2 bg-white rounded-xl text-xs font-black text-indigo-900 shadow-sm border border-indigo-200 disabled:opacity-40 cursor-pointer"
                        >
                          Next Page ›
                        </button>
                      </div>

                      {/* Active Page Card */}
                      {(() => {
                        const currentPage = generatedBook.pages[activePreviewPage];
                        if (!currentPage) return null;
                        return (
                          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                            {/* Pollinations AI Image Preview */}
                            {currentPage.imageUrl && (
                              <div className="relative rounded-2xl overflow-hidden shadow-md max-h-72 flex justify-center bg-black/5">
                                <img 
                                  src={currentPage.imageUrl} 
                                  alt={`Page ${activePreviewPage + 1} Illustration`} 
                                  className="w-full h-72 object-cover rounded-2xl"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop";
                                  }}
                                />
                                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full flex gap-2">
                                  <span>🎥 {currentPage.cameraAngle || 'Wide Angle'}</span>
                                  <span>✨ {currentPage.mood || 'Magical'}</span>
                                </div>
                              </div>
                            )}

                            {/* Page Text */}
                            <p className="text-sm font-bold text-slate-800 leading-relaxed bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                              {currentPage.text}
                            </p>

                            {/* Vocab Highlights */}
                            {currentPage.vocabHighlights && currentPage.vocabHighlights.length > 0 && (
                              <div className="bg-yellow-50/80 border border-yellow-200 rounded-xl p-3 space-y-2">
                                <h5 className="text-[10px] font-black uppercase tracking-wider text-yellow-800 flex items-center gap-1">
                                  💡 Vocabulary Spotlight
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {currentPage.vocabHighlights.map((v, vIdx) => (
                                    <div key={vIdx} className="bg-white p-2.5 rounded-lg border border-yellow-100 shadow-2xs">
                                      <p className="text-xs font-black text-indigo-950">{v.word} <span className="text-[10px] text-slate-400 font-bold">[{v.pronunciation}]</span></p>
                                      <p className="text-[11px] font-semibold text-slate-600">{v.definition}</p>
                                      {v.fact && <p className="text-[10px] font-bold text-yellow-700 mt-1">✨ {v.fact}</p>}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Parent Section & Comprehension Quiz Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    {generatedBook.parentSection && (
                      <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 space-y-2">
                        <h4 className="text-xs font-black text-purple-950 uppercase tracking-wider">👨‍👩‍👧 Parent & Discussion</h4>
                        {generatedBook.parentSection.lifeLesson && (
                          <p className="text-xs font-bold text-purple-800 bg-white p-2.5 rounded-xl border border-purple-100">
                            🌟 Lesson: {generatedBook.parentSection.lifeLesson}
                          </p>
                        )}
                        {generatedBook.parentSection.activity && (
                          <p className="text-[11px] font-semibold text-purple-900">
                            🎨 Activity: {generatedBook.parentSection.activity}
                          </p>
                        )}
                      </div>
                    )}

                    {generatedBook.comprehensionQuestions && (
                      <div className="bg-green-50 p-4 rounded-2xl border border-green-100 space-y-2">
                        <h4 className="text-xs font-black text-green-950 uppercase tracking-wider">❓ Comprehension Quiz</h4>
                        <p className="text-xs font-bold text-green-800">
                          {generatedBook.comprehensionQuestions.length} Quiz questions included for student verification!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-black">3</div>
                <h2 className="text-2xl font-black text-[#14532d]">Assign To</h2>
              </div>

              <div className="space-y-6">
            <div className="space-y-2">
              <label className="font-bold text-[#14532d]">Class <span className="text-rose-500">*</span></label>
              <div className="w-full h-14 bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 flex items-center gap-3">
                <Users className="w-5 h-5 text-green-600" />
                <span className="font-black text-slate-700">{activeClassroom?.name || 'No class selected (Please select at the top)'}</span>
              </div>
            </div>

            {activeClassroom && (
              <div className="space-y-2">
                <label className="font-bold text-[#14532d] text-sm block">Assign Target</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 border border-slate-200 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, assignType: 'all', assignedStudentIds: [] }))}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${formData.assignType === 'all' ? 'bg-[#EA580C] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Whole Class
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, assignType: 'students' }))}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${formData.assignType === 'students' ? 'bg-[#EA580C] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Specific Students
                  </button>
                </div>
              </div>
            )}

            {formData.assignType === 'students' && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                <label className="font-bold text-[#14532d] text-sm block">Select Students <span className="text-rose-500">*</span></label>
                
                {/* Search Bar */}
                <div className="relative mb-3">
                  <Search className="absolute left-4 top-4 w-5 h-5 text-slate-400 z-10" />
                  <input
                    type="text"
                    placeholder="Search student name..."
                    value={studentSearchQuery}
                    onChange={(e) => setStudentSearchQuery(e.target.value)}
                    className="w-full h-14 bg-white border-2 border-slate-200 rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-700 outline-none focus:border-green-400 transition-all"
                  />
                </div>

                {/* Bulk Actions */}
                <div className="flex justify-between items-center px-1 mb-2">
                  <span className="text-xs font-bold text-slate-500">
                    {formData.assignedStudentIds.length} of {students.length} selected
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const allIds = students.map(s => s.id);
                        setFormData(prev => ({ ...prev, assignedStudentIds: allIds }));
                      }}
                      className="text-xs font-bold text-[#EA580C] hover:underline"
                    >
                      Select All
                    </button>
                    <span className="text-xs text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, assignedStudentIds: [] }));
                      }}
                      className="text-xs font-bold text-slate-500 hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Student Pills Grid */}
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border-2 border-slate-100 rounded-2xl bg-slate-50/30 custom-scrollbar">
                  {students
                    .filter(s => (s.name || s.id).toLowerCase().includes(studentSearchQuery.toLowerCase()))
                    .map(s => {
                      const isSelected = formData.assignedStudentIds.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setFormData(prev => {
                              const alreadySelected = prev.assignedStudentIds.includes(s.id);
                              const nextIds = alreadySelected
                                ? prev.assignedStudentIds.filter(id => id !== s.id)
                                : [...prev.assignedStudentIds, s.id];
                              return { ...prev, assignedStudentIds: nextIds };
                            });
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-green-50 border-green-300 text-green-700 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50/50'
                          }`}
                        >
                          <User className={`w-3.5 h-3.5 ${isSelected ? 'text-green-600' : 'text-slate-400'}`} />
                          {s.name || s.id}
                        </button>
                      );
                    })}
                  {students.filter(s => (s.name || s.id).toLowerCase().includes(studentSearchQuery.toLowerCase())).length === 0 && (
                    <div className="w-full text-center py-4 text-xs font-bold text-slate-400">
                      No students match "{studentSearchQuery}"
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="font-bold text-[#14532d]">Due Date <span className="text-rose-500">*</span></label>
              <div className="relative">
                <Calendar className="absolute left-4 top-4 w-5 h-5 text-blue-400" />
                <input 
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="w-full h-14 bg-white border-2 border-slate-200 rounded-2xl pl-12 pr-4 text-slate-700 font-bold outline-none focus:border-green-400 appearance-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-[#14532d] flex items-center gap-2">
                Time <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-4 w-5 h-5 text-rose-400" />
                <input 
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full h-14 bg-white border-2 border-slate-200 rounded-2xl pl-12 pr-4 text-slate-700 font-bold outline-none focus:border-green-400 appearance-none"
                />
              </div>
            </div>
          </div>

          {/* Kid Illustration Box */}
          <div className="mt-8 bg-orange-50/50 rounded-3xl p-8 relative flex flex-col items-center justify-end h-64 border-2 border-orange-100 overflow-visible">
             <div className="absolute -top-6 right-4 bg-pink-100 px-6 py-4 rounded-2xl rounded-br-sm shadow-sm border border-pink-200 z-10">
                <p className="font-black text-pink-700 text-sm">You're making<br/>learning awesome! 🌟</p>
             </div>
             {/* Simple drawing if mascot image doesn't exist */}
             <div className="w-48 h-48 bg-contain bg-bottom bg-no-repeat opacity-90" style={{ backgroundImage: "url('/dino-reading.png')" }}></div>
          </div>
        </>
      )}
    </div>
  </div>
      
      {/* Bottom Footer Bar */}
      <div className="mt-12 border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
        {assignmentType === 'test' ? (
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-500">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <label className="font-bold text-[#14532d] text-sm flex items-center gap-2">
                  Time Limit <span className="text-slate-400 font-normal text-xs">(minutes)</span>
                </label>
                <input 
                  type="number"
                  min="5"
                  value={formData.timeLimit}
                  onChange={(e) => setFormData({...formData, timeLimit: e.target.value})}
                  className="bg-transparent font-black text-slate-700 outline-none w-20 border-b-2 border-slate-200 focus:border-rose-400"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-500">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <label className="font-bold text-[#14532d] text-sm flex items-center gap-2">
                  Marks Per Question
                </label>
                <input 
                  type="number"
                  min="1"
                  value={formData.marksPerQuestion}
                  onChange={(e) => setFormData({...formData, marksPerQuestion: e.target.value})}
                  className="bg-transparent font-black text-slate-700 outline-none w-20 border-b-2 border-slate-200 focus:border-purple-400"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-500">
              <Star className="w-6 h-6 fill-current" />
            </div>
            <div>
              <label className="font-bold text-[#14532d] text-sm flex items-center gap-2">
                Add XP Points <span className="text-slate-400 font-normal text-xs">(optional)</span>
              </label>
              <select 
                value={formData.points}
                onChange={(e) => setFormData({...formData, points: e.target.value})}
                className="bg-transparent font-black text-slate-700 outline-none cursor-pointer"
              >
                <option value="5">5 Points</option>
                <option value="10">10 Points</option>
                <option value="20">20 Points</option>
                <option value="50">50 Points</option>
              </select>
            </div>
            <span className="text-xs font-bold text-slate-400 ml-2">Reward your students!</span>
          </div>
        )}

        <div className="flex items-center gap-4">
          {initialDraft?.id && (
            <button 
              onClick={handleDiscardDraft}
              disabled={isDiscardingDraft}
              className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-black px-8 py-4 rounded-2xl transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isDiscardingDraft ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Delete Draft 🗑️'}
            </button>
          )}
          <button 
            onClick={handleSaveDraft}
            disabled={isSavingDraft}
            className="bg-green-50 hover:bg-green-100 text-green-600 font-black px-8 py-4 rounded-2xl transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSavingDraft ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save as Draft 📝'}
          </button>
          <button 
            onClick={() => {
              if (hasReachedLimit && !generatedQuestions && !initialDraft?.id) {
                if (activePlanId === 'free') setShowUpgradeModal(true);
                else setShowBoosterModal(true);
              } else {
                handlePublish();
              }
            }}
            disabled={isPublishing}
            className={`font-black px-10 py-4 rounded-2xl flex items-center gap-3 transition-colors disabled:opacity-50 ${
              (hasReachedLimit && !generatedQuestions && !initialDraft?.id) 
                ? 'bg-slate-300 text-slate-500 cursor-pointer shadow-none' 
                : 'bg-[#2ecc71] hover:bg-[#27ae60] text-white shadow-[0_4px_0_0_#219653] hover:translate-y-1 hover:shadow-none'
            }`}
          >
            {isPublishing ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              formData.isExamPaper || formData.examPreset
                ? 'Publish International Exam 🌐🚀'
                : assignmentType === 'test'
                ? 'Publish Test Paper ⏱️🚀'
                : 'Publish Homework 📝🚀'
            )}
          </button>
        </div>
      </div>
      </>
      )
      ) : (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-5xl font-black text-[#14532d] tracking-tight mb-2">
                {activeTab === 'history-tests' ? 'Past Tests' : 'Past Homeworks'}
              </h1>
              <p className="text-lg text-slate-500 font-bold">Manage and review previously assigned {activeTab === 'history-tests' ? 'tests' : 'homework'}.</p>
            </div>
            <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm">
              <Filter className="w-5 h-5 text-green-400" />
              <div className="h-6 w-px bg-slate-200"></div>
              <div className="flex items-center gap-2">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date:</label>
                 <input 
                   type="date"
                   value={filterDate}
                   onChange={(e) => setFilterDate(e.target.value)}
                   className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer"
                 />
              </div>
              {filterDate && (
                <button onClick={() => setFilterDate('')} className="ml-2 text-xs font-bold text-rose-500 hover:underline">
                  Clear
                </button>
              )}
            </div>
          </div>
          
          {isLoadingHistory ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-500" /></div>
          ) : pastHomeworks.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
              <Book className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-bold">No past homeworks found.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {pastHomeworks.filter(hw => {
                if (activeTab === 'history-tests' && hw.type !== 'test') return false;
                if (activeTab === 'history' && hw.type === 'test') return false;

                if (!filterDate) return true;
                const assignedDate = hw.createdAt?.toMillis ? new Date(hw.createdAt.toMillis()).toISOString().split('T')[0] : '';
                const dueDate = hw.dueDate || '';
                return assignedDate === filterDate || dueDate === filterDate;
              }).map(hw => (
                <div key={hw.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative group flex flex-col w-full">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${hw.subject === 'maths' ? 'bg-blue-100 text-blue-700' : hw.subject === 'science' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {hw.subject}
                      </span>
                      <h3 className="text-xl font-black text-slate-800">{hw.title}</h3>
                    </div>
                    <div className="flex items-center gap-6 text-sm font-bold text-slate-400">
                       <div className="flex items-center gap-2" title="Date Assigned"><Calendar className="w-4 h-4" /> {hw.createdAt?.toMillis ? new Date(hw.createdAt.toMillis()).toLocaleDateString() : 'N/A'}</div>
                       <div className="flex items-center gap-2" title="Due Date"><Clock className="w-4 h-4" /> {hw.dueDate ? new Date(hw.dueDate).toLocaleDateString() : 'No Due'}</div>
                       <div className="flex items-center gap-2"><Users className="w-4 h-4" /> {hw.questions?.length || 0} Qs</div>
                       <div className="flex items-center gap-2" title={hw.assignType === 'students' && hw.assignedStudentIds ? hw.assignedStudentIds.map(id => id.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')).join(', ') : hw.assignType === 'student' && hw.assignedStudentId ? hw.assignedStudentId.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : 'Whole Class'}>
                         <User className="w-4 h-4" /> 
                         {hw.assignType === 'students' && hw.assignedStudentIds && hw.assignedStudentIds.length > 0 ? (
                           `Students: ${hw.assignedStudentIds.length}`
                         ) : hw.assignType === 'student' && hw.assignedStudentId ? (
                           `Student: ${hw.assignedStudentId.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}`
                         ) : 'Whole Class'}
                       </div>
                       
                       <button 
                         onClick={() => handleDeleteHomework(hw.id)}
                         className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-100 transition-colors opacity-0 group-hover:opacity-100 ml-4"
                         title="Delete Homework"
                       >
                         <Trash2 className="w-5 h-5" />
                       </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-500 font-bold mb-4">{hw.instructions || 'No instructions provided.'}</p>
                  
                  {hw.questions && hw.questions.length > 0 && (
                    <div className="mt-2 border-t border-slate-100 pt-4">
                      <button 
                        onClick={() => setExpandedHomeworkId(expandedHomeworkId === hw.id ? null : hw.id)}
                        className="flex items-center gap-2 text-sm font-black text-green-600 hover:text-green-700 transition-colors"
                      >
                        {expandedHomeworkId === hw.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {expandedHomeworkId === hw.id ? 'Hide Questions' : 'View Full Homework Questions'}
                      </button>
                      
                      <AnimatePresence>
                        {expandedHomeworkId === hw.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-6 space-y-4"
                          >
                            {hw.questions.map((q, idx) => (
                              <div key={idx} className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                {(() => {
                                  const { text: cleanText, clockTime, inlineSvg } = parseQuestionText(q.text);
                                  return (
                                    <>
                                      <div className="font-bold text-slate-800 text-sm mb-4 flex gap-2"><span className="text-green-600">Q{idx + 1}.</span> <div className="flex-1"><TextWithTables text={cleanText} /></div></div>
                                      {clockTime && (
                                        <div className="mb-4 transform scale-75 origin-top-left">
                                          <ClockFace timeStr={clockTime} />
                                        </div>
                                      )}
                                      {inlineSvg && (
                                        <div className="flex justify-center mb-4 bg-white rounded-lg p-2 border border-slate-100 shadow-sm mx-auto">
                                          <div dangerouslySetInnerHTML={{ __html: inlineSvg }} className="w-full h-auto flex justify-center" />
                                        </div>
                                      )}
                                    </>
                                  );
                                })()}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {q.options && q.options.map((opt, i) => (
                                    <div key={i} className={`px-4 py-3 rounded-xl text-xs font-bold border flex items-center gap-3 ${opt === q.answer ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-white border-slate-200 text-slate-600'}`}>
                                      <div className={`w-5 h-5 rounded-full flex-center text-[10px] ${opt === q.answer ? 'bg-emerald-200' : 'bg-slate-100'}`}>
                                        {['A', 'B', 'C', 'D'][i]}
                                      </div>
                                      {opt}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              ))}
              
              {pastHomeworks.length > 0 && pastHomeworks.filter(hw => {
                if (!filterDate) return true;
                const assignedDate = hw.createdAt?.toMillis ? new Date(hw.createdAt.toMillis()).toISOString().split('T')[0] : '';
                const dueDate = hw.dueDate || '';
                return assignedDate === filterDate || dueDate === filterDate;
              }).length === 0 && (
                <div className="text-center py-10 bg-white rounded-3xl border border-slate-200">
                   <p className="text-slate-500 font-bold">No homework matches this date.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 border-2 border-orange-100 shadow-2xl text-center relative animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Rocket className="w-10 h-10 text-orange-600 animate-bounce" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Upgrade Required! 🚀</h3>
            <p className="text-slate-600 font-bold mb-1">
              You have reached your current plan's homework creation limit.
            </p>
            <p className="text-[#EA580C] font-black text-sm mb-6 bg-orange-50 py-2.5 px-4 rounded-xl inline-block">
              {limitText}
            </p>
            <p className="text-xs text-slate-400 font-bold mb-8">
              Upgrade to a premium tier to get more student slots, unlimited homework generation, and other powerful features!
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  if (typeof setDashboardTab === 'function') {
                    setDashboardTab('Billing & Licenses');
                  }
                }}
                className="w-full bg-[#EA580C] hover:bg-[#C2410C] text-white py-4 rounded-2xl font-black text-sm transition-all shadow-lg shadow-orange-100/50"
              >
                Go to Billing & Licenses 💳
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-500 py-4 rounded-2xl font-black text-sm transition-all border border-slate-200"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      <PaperQuotaBoosterModal
        isOpen={showBoosterModal}
        onClose={() => setShowBoosterModal(false)}
        user={user}
        currentUsage={quotaInfo.usage}
        currentQuota={quotaInfo.limit}
        topUpCredits={topUpCredits}
        onCreditsUpdated={(newCredits) => setTopUpCredits(newCredits)}
      />

      <CurriculumModal 
        isOpen={isCurriculumModalOpen}
        onClose={() => setIsCurriculumModalOpen(false)}
        curriculumData={curriculum[resolveGradeFromClassroomName(activeClassroom?.name)]?.[getCurriculumSubjectKey(formData.subject)] || []}
        selectedSkills={selectedSkills}
        setSelectedSkills={setSelectedSkills}
        customTopics={customTopics}
        onAddCustomTopic={handleAddCustomTopic}
        onDeleteCustomTopic={handleDeleteCustomTopic}
        currentSubject={formData.subject}
      />

      {/* AI Prompt Inspector Modal */}
      {showPromptModal && generatedBook?.promptUsed && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-indigo-200 text-left">
            <div className="bg-indigo-900 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-700 rounded-xl flex items-center justify-center text-yellow-300">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white">AI Master Prompt Inspection</h3>
                  <p className="text-xs text-indigo-200 font-semibold">Exact 12-Step Pixar prompt executed for "{generatedBook.title}"</p>
                </div>
              </div>
              <button
                onClick={() => setShowPromptModal(false)}
                className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-slate-900 custom-scrollbar">
              <pre className="text-xs font-mono text-indigo-200 whitespace-pre-wrap leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
                {generatedBook.promptUsed}
              </pre>
            </div>
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowPromptModal(false)}
                className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


