import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  FlaskConical, 
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
  Loader2,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Trash2,
  History,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, where, orderBy, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { decryptText } from '../utils/crypto';
import { fetchWithRetry, generateContent } from '../utils/aiClient';
import { generateExplanations } from '../utils/generateExplanations';
import DynamicChart from '../components/DynamicChart';
import DynamicGeometry from '../components/DynamicGeometry';

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
];

export default function HomeworkGenerator({ user, classrooms = [], activeClassroom, initialDraft, subjectPrompts, onHomeworkCreated, teacherBilling, allHomeworks = [], setDashboardTab, isAdmin }) {
  const [assignmentType, setAssignmentType] = useState(initialDraft ? (initialDraft.type || 'homework') : null);
  const [formData, setFormData] = useState({
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

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const activePlanId = (teacherBilling && ['active', 'trialing'].includes(teacherBilling.status)) ? teacherBilling.planId : 'free';
  const totalHomeworksCount = allHomeworks ? allHomeworks.length : 0;

  const hasReachedLimit = (() => {
    if (isAdmin) return false;
    if (activePlanId === 'free') {
      return totalHomeworksCount >= 3;
    }
    return false; // Paid tiers have unlimited homework creation
  })();

  const limitText = (() => {
    if (isAdmin) return '';
    if (activePlanId === 'free') {
      return `Free Tier Limit: 3 homeworks total (You've created ${totalHomeworksCount}/3)`;
    }
    return '';
  })();

  const checkLimitAndTrigger = () => {
    if (initialDraft?.id) {
      // Modifying an existing draft/homework is allowed
      return false;
    }
    if (hasReachedLimit) {
      setShowUpgradeModal(true);
      return true;
    }
    return false;
  };

  const [students, setStudents] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      if (!user?.uid || !formData.classId) {
        setStudents([]);
        return;
      }
      setIsLoadingStudents(true);
      try {
        const snap = await getDocs(collection(db, 'teachers', user.uid, 'classrooms', formData.classId, 'students'));
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStudents(list);
      } catch (err) {
        console.error("Error fetching students for generator:", err);
      }
      setIsLoadingStudents(false);
    };
    fetchStudents();
  }, [formData.classId, user]);

  const lastSubjectRef = useRef(formData.subject);

  useEffect(() => {
    if (subjectPrompts) {
      const normSubject = formData.subject.toLowerCase();
      const matchedKey = Object.keys(subjectPrompts).find(k => k.toLowerCase() === normSubject);
      
      // Auto-fill on manual subject change, or if it is the first load and aiPrompt is empty
      if (formData.subject !== lastSubjectRef.current || !formData.aiPrompt) {
        lastSubjectRef.current = formData.subject;
        if (matchedKey && subjectPrompts[matchedKey]) {
          setFormData(prev => ({ ...prev, aiPrompt: subjectPrompts[matchedKey] }));
        } else if (formData.subject !== lastSubjectRef.current) {
          setFormData(prev => ({ ...prev, aiPrompt: '' }));
        }
      }
    }
  }, [formData.subject, subjectPrompts]);

  const getDynamicSubjects = () => {
    const list = [...SUBJECTS];
    if (subjectPrompts) {
      Object.keys(subjectPrompts).forEach(key => {
        const lowerKey = key.toLowerCase();
        if (!list.some(s => s.id === lowerKey)) {
          list.push({
            id: lowerKey,
            name: key.charAt(0).toUpperCase() + key.slice(1),
            titleColor: 'text-orange-500',
            bgColor: 'bg-[#faf9ff]',
            borderColor: 'border-orange-200',
            selectedBorder: 'border-orange-400 ring-4 ring-orange-100',
            desc: `Custom subject template for ${key}!`,
            renderGraphic: () => (
              <div className="w-16 h-20 bg-orange-500 rounded-lg flex items-center justify-center text-white font-black text-2xl shadow-[0_4px_0_0_#4338ca] transform rotate-3">
                {key.slice(0, 2).toUpperCase()}
              </div>
            )
          });
        }
      });
    }
    if (activeClassroom?.subjects) {
      activeClassroom.subjects.forEach(subjectName => {
        const lowerKey = subjectName.toLowerCase();
        if (!list.some(s => s.id === lowerKey)) {
          list.push({
            id: lowerKey,
            name: subjectName,
            titleColor: 'text-purple-500',
            bgColor: 'bg-[#faf9ff]',
            borderColor: 'border-purple-200',
            selectedBorder: 'border-purple-400 ring-4 ring-purple-100',
            desc: `Custom subject for ${activeClassroom.name}!`,
            renderGraphic: () => (
              <div className="w-16 h-20 bg-purple-500 rounded-lg flex items-center justify-center text-white font-black text-2xl shadow-[0_4px_0_0_#4338ca] transform rotate-3">
                {subjectName.slice(0, 2).toUpperCase()}
              </div>
            )
          });
        }
      });
    }

    return list;
  };
  
  // Real-time AI key resolution will be done on-the-fly during generation.
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isDiscardingDraft, setIsDiscardingDraft] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState(null);
  const [isAiAccepted, setIsAiAccepted] = useState(false);

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
        assignedStudentIds: initialDraft.assignedStudentIds || (initialDraft.assignedStudentId ? [initialDraft.assignedStudentId] : [])
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
      const activeModel = localStorage.getItem('hwz_active_ai') || 'gemini';

      if (!formData.title && !formData.aiPrompt) {
        alert("Please provide either a Title or an AI Prompt to guide generation! 🎯");
        setIsGenerating(false);
        return;
      }

      const topic = formData.title || (formData.aiPrompt ? formData.aiPrompt.slice(0, 45) + '...' : 'General Quiz');
      
      let prompt = `You are an expert curriculum designer. 
        Create a ${questionCount}-question multiple-choice quiz for students about the following topic:
        Subject: ${formData.subject}
        Topic: ${topic}
        Specific Content Instructions: ${formData.aiPrompt || formData.title}
        
        Ensure the questions test the students' knowledge on the specific content instructions provided. DO NOT generate meta-questions about the instructions themselves.

        CRITICAL ACCURACY & QUALITY RULES:
        1. For English Grammar / Word Classification (nouns, verbs, adjectives, adverbs, prepositions, etc.):
           - Identify the part of speech based strictly on its exact syntactic function inside the sentence context. E.g. in "The walk was long", "walk" is a noun. In "We walk daily", "walk" is a verb.
           - Ensure that the "answer" option is grammatically 100% correct, and the other 3 options are clearly incorrect or represent different parts of speech. No ambiguity.
        2. For Mathematics:
           - Ensure all equations, word problems, and numeric values are mathematically correct. Double-check your own calculations so there is zero arithmetic error.
        3. For Science:
           - Ensure all facts, definitions, and concepts are scientifically accurate and standard.
        4. General:
           - The "answer" field MUST exactly match one of the 4 values inside the "options" array.
           - All options must be age-appropriate for elementary/middle school students.
        
        CRITICAL SYSTEM RULE: IF the question involves reading an analog clock, embed the time anywhere in the question text using the exact format [CLOCK:HH:MM] (e.g. [CLOCK:03:15] or [CLOCK:12:30]). The system will automatically render a visual clock for the student.
        
        Return ONLY a JSON object with a single key "questions" containing an array of objects. Each object must have: "id" (number), "text" (string, the question), "options" (array of exactly 4 strings), "answer" (string, matching one option exactly), "subtopic" (string, a specific subtopic or concept under the main topic).
        
        IF the question requires a chart, graph, or data interpretation, include a "chartData" object property:
        "chartData": {
          "type": "bar" | "pie" | "line",
          "title": "String title",
          "data": [{"name": "Category A", "value": 10}, {"name": "Category B", "value": 20}]
        }
        
        IF the question involves geometry, shapes, or area/volume, include a "geometryData" object property:
        "geometryData": {
          "type": "rectangle" | "triangle" | "circle" | "cylinder" | "cube",
          "labels": { "width": "string", "height": "string", "radius": "string", "base": "string" }
        }`;

      const textResponse = await generateContent({
        prompt,
        responseMimeType: 'application/json',
        provider: activeModel
      });

      const parsed = JSON.parse(textResponse);
      const questions = parsed.questions || parsed;

      setGeneratedQuestions(questions);
    } catch (err) {
      console.error("AI Gen Error:", err);
      alert("Failed to generate questions. ❌");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (checkLimitAndTrigger()) return;
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
      const activeModel = localStorage.getItem('hwz_active_ai') || 'gemini';
      const questionsToSave = generatedQuestions || [];

      // Pre-generate explanations for all questions (one API call at creation time)
      // so students never trigger live AI calls when submitting.
      let questionExplanations = {};
      if (questionsToSave.length > 0) {
        questionExplanations = await generateExplanations(questionsToSave, formData.subject, activeModel);
      }

      const payload = {
        title: formData.title,
        subject: formData.subject,
        instructions: formData.instructions,
        assignedClassId: formData.classId,
        dueDate: formData.dueDate,
        time: formData.time,
        points: formData.points,
        questions: questionsToSave,
        questionExplanations,
        teacherId: user?.uid,
        teacherName: user?.displayName || 'Classroom Teacher',
        assignType: formData.assignType,
        assignedStudentIds: formData.assignType === 'students' ? formData.assignedStudentIds : [],
        status: 'published',
        type: assignmentType,
        timeLimit: formData.timeLimit || '30',
        marksPerQuestion: formData.marksPerQuestion || '5',
        createdAt: serverTimestamp()
      };

      if (initialDraft?.id) {
        await setDoc(doc(db, 'homeworks', initialDraft.id), payload, { merge: true });
      } else {
        await addDoc(collection(db, 'homeworks'), payload);
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
        assignedStudentIds: []
      });
      setGeneratedQuestions(null);
      setIsAiAccepted(false);
      
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
    if (checkLimitAndTrigger()) return;
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
      const activeModel = localStorage.getItem('hwz_active_ai') || 'gemini';
      const questionsToSave = generatedQuestions || [];

      // Pre-generate explanations at draft-save time as well,
      // so they are ready when the draft is later published.
      let questionExplanations = {};
      if (questionsToSave.length > 0) {
        questionExplanations = await generateExplanations(questionsToSave, formData.subject, activeModel);
      }

      const payload = {
        title: formData.title,
        subject: formData.subject,
        instructions: formData.instructions,
        assignedClassId: formData.classId,
        dueDate: formData.dueDate || '',
        time: formData.time || '',
        points: formData.points,
        questions: questionsToSave,
        questionExplanations,
        teacherId: user?.uid,
        teacherName: user?.displayName || 'Classroom Teacher',
        assignType: formData.assignType,
        assignedStudentIds: formData.assignType === 'students' ? formData.assignedStudentIds : [],
        status: 'draft',
        type: assignmentType,
        timeLimit: formData.timeLimit || '30',
        marksPerQuestion: formData.marksPerQuestion || '5',
        createdAt: serverTimestamp()
      };

      if (initialDraft?.id) {
        await setDoc(doc(db, 'homeworks', initialDraft.id), payload, { merge: true });
      } else {
        await addDoc(collection(db, 'homeworks'), payload);
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
        assignedStudentIds: []
      });
      setGeneratedQuestions(null);
      setIsAiAccepted(false);
      
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
      
      {/* Tab Switcher */}
      <div className="flex items-center justify-center mb-8">
        <div className="bg-slate-100 p-1.5 rounded-full flex gap-1 border border-slate-200/60 shadow-sm">
          <button 
            onClick={() => { setActiveTab('create'); setAssignmentType(null); }}
            className={`px-8 py-3 rounded-full font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'create' ? 'bg-white text-orange-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <PlusCircle className="w-4 h-4" /> Create New
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-8 py-3 rounded-full font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'history' ? 'bg-white text-orange-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <History className="w-4 h-4" /> Past Homeworks
          </button>
          <button 
            onClick={() => setActiveTab('history-tests')}
            className={`px-8 py-3 rounded-full font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'history-tests' ? 'bg-white text-orange-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <BookOpen className="w-4 h-4" /> Past Tests
          </button>
        </div>
      </div>

      {activeTab === 'create' ? (
        !assignmentType ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-12">
            <h2 className="text-4xl font-black text-[#14532d]">What would you like to create?</h2>
            <div className="flex gap-8">
              <button 
                onClick={() => setAssignmentType('homework')} 
                className="w-64 h-64 bg-white rounded-[40px] border border-slate-200 shadow-xl flex flex-col items-center justify-center gap-6 hover:-translate-y-2 transition-all hover:border-pink-300 group"
              >
                <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <img src="/ic-homework.png" className="w-12 h-12 object-contain mix-blend-multiply" alt="Homework" />
                </div>
                <span className="text-2xl font-black text-slate-800">Homework</span>
              </button>
              <button 
                onClick={() => setAssignmentType('test')} 
                className="w-64 h-64 bg-white rounded-[40px] border border-slate-200 shadow-xl flex flex-col items-center justify-center gap-6 hover:-translate-y-2 transition-all hover:border-rose-300 group"
              >
                <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-12 h-12 text-rose-500" />
                </div>
                <span className="text-2xl font-black text-slate-800">Test Builder</span>
              </button>
            </div>
          </div>
        ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-5xl font-black text-[#14532d] tracking-tight mb-2">Create Homework</h1>
              <div className="relative inline-block">
                 <p className="text-lg text-slate-500 font-bold">Prepare fun and meaningful homework for your students!</p>
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {getDynamicSubjects().map((sub) => (
            <div 
              key={sub.id}
              onClick={() => setFormData({...formData, subject: sub.id})}
              className={`relative p-8 rounded-3xl border-2 cursor-pointer transition-all flex flex-col items-center text-center group ${sub.bgColor} ${formData.subject === sub.id ? sub.selectedBorder : sub.borderColor}`}
            >
              {/* Radio Button */}
              <div className={`absolute top-6 right-6 w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.subject === sub.id ? 'border-orange-1000' : 'border-slate-300 bg-white'}`}>
                {formData.subject === sub.id && <div className="w-3 h-3 rounded-full bg-blue-500" />}
              </div>
              
              <h3 className={`text-2xl font-black mb-8 ${sub.titleColor}`}>{sub.name}</h3>
              
              <div className="h-24 flex items-center justify-center mb-6">
                {sub.renderGraphic()}
              </div>
              
              <p className="text-slate-600 font-bold text-sm px-4">{sub.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Col: Details */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-black">2</div>
            <h2 className="text-2xl font-black text-[#14532d]">Homework Details</h2>
          </div>

          <div className="space-y-2">
            <label className="font-bold text-[#14532d]">Title <span className="text-rose-500">*</span></label>
            <div className="relative">
              <input 
                type="text"
                placeholder="Enter homework title..."
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

             <div className="space-y-1.5 text-left">
               <label className="font-bold text-[#14532d] text-xs block ml-1">What should the quiz be about? (AI Prompt)</label>
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
                            <p className="font-bold text-slate-800 text-xs mb-3"><span className="text-green-600 mr-1 font-black">Q{idx + 1}.</span> {q.text}</p>
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
                            {q.svgCode && !q.chartData && !q.geometryData && (
                              <div className="flex justify-center mb-4 bg-white rounded-lg p-2 border border-slate-100 shadow-sm max-w-[200px] mx-auto">
                                <div dangerouslySetInnerHTML={{ __html: q.svgCode }} className="w-full h-auto" />
                              </div>
                            )}
                            <div className="grid grid-cols-2 gap-2">
                              {q.options.map((opt, i) => (
                                <div key={i} className={`px-3 py-2 rounded-lg text-[10px] font-bold border ${opt === q.answer ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-white border-slate-200 text-slate-600'}`}>
                                  {opt}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                      <button onClick={handleGenerateAI} className="text-xs text-green-600 font-bold hover:underline px-4 py-2 bg-green-50 rounded-lg">Regenerate</button>
                      <button onClick={() => {setGeneratedQuestions(null); setIsAiAccepted(false);}} className="text-xs text-rose-500 font-bold hover:underline px-4 py-2 bg-rose-50 rounded-lg">Clear Questions</button>
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

        {/* Right Col: Assign To */}
        <div className="space-y-8 relative">
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
            onClick={handlePublish}
            disabled={isPublishing}
            className="bg-[#2ecc71] hover:bg-[#27ae60] text-white font-black px-10 py-4 rounded-2xl flex items-center gap-3 transition-colors shadow-[0_4px_0_0_#219653] hover:translate-y-1 hover:shadow-none disabled:opacity-50"
          >
            {isPublishing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publish Homework 🚀'}
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
                                <p className="font-bold text-slate-800 text-sm mb-4"><span className="text-green-600 mr-2">Q{idx + 1}.</span> {q.text}</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {q.options.map((opt, i) => (
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
    </div>
  );
}
