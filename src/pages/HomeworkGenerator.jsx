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
import { fetchWithRetry, generateContent, getModelForGrade } from '../utils/aiClient';
import { generateExplanations } from '../utils/generateExplanations';
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
import { curriculum } from '../data/curriculum';
import { getSmartTopicTitle } from './HomeworkScheduler';

export const sanitizeQuestionData = (q) => {
  if (!q) return q;
  let text = q.text || '';
  // Strip bracketed English translations like " (Read this: ...)" or " (Translation: ...)"
  text = text.replace(/\s*\((?:Read this|Translation|In English|Meaning):?\s*[^)]+\)/gi, '').trim();

  let options = q.options;
  let answer = q.answer;

  if (Array.isArray(options)) {
    const cleanedOptions = options.map(opt => {
      if (typeof opt !== 'string') return opt;
      if (/[\u0900-\u097F]/.test(opt) || /[^\x00-\x7F]/.test(opt)) {
        return opt.replace(/\s*\([A-Za-z\s,-]+\)$/, '').trim();
      }
      return opt;
    });

    if (answer && typeof answer === 'string') {
      const matchIdx = options.findIndex(o => o === answer);
      if (matchIdx !== -1) {
        answer = cleanedOptions[matchIdx];
      } else if (/[\u0900-\u097F]/.test(answer) || /[^\x00-\x7F]/.test(answer)) {
        answer = answer.replace(/\s*\([A-Za-z\s,-]+\)$/, '').trim();
      }
    }

    options = cleanedOptions;
  }

  return {
    ...q,
    text,
    options,
    answer
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
];

export default function HomeworkGenerator({ user, classrooms = [], activeClassroom, initialDraft, subjectPrompts, onHomeworkCreated, teacherBilling, allHomeworks = [], setDashboardTab, isAdmin }) {
  const [assignmentType, setAssignmentType] = useState(initialDraft ? (initialDraft.type || 'homework') : null);
  const [formData, setFormData] = useState({
    subject: 'maths',
    title: '',
    instructions: assignmentType === 'test' ? 'Read each question carefully. You are on a timer! ⏳' : 'Read each question carefully and select the best answer! 🚀',
    aiPrompt: '',
    classId: activeClassroom?.id || '',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '',
    points: '10',
    timeLimit: '30',
    marksPerQuestion: '5',
    assignType: 'all',
    assignedStudentIds: [],
    difficulty: 'Medium'
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

  const [isCurriculumMode, setIsCurriculumMode] = useState(true);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);

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
        if (subjectPrompts[key] === null) return;
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
  const [generatedPassage, setGeneratedPassage] = useState(null);
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
      const activeModel = localStorage.getItem('hwz_active_ai') || 'gemini';

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

      const injectedPrompt = (rawInjected || '')
        .replace(/\{SUBJECT\}/gi, formData.subject || '')
        .replace(/\{GRADE\}/gi, resolvedGrade || 'Age-Appropriate')
        .replace(/\{TOPIC\}/gi, topic || '')
        .replace(/\{DIFFICULTY\}/gi, formData.difficulty || 'Medium')
        .replace(/\{QUESTION_COUNT\}/gi, String(questionCount));

      // Find up to 10 questions recently generated for this subject to prevent duplicates
      const recentlyGenerated = [];
      if (allHomeworks && allHomeworks.length > 0) {
        const matchingHws = allHomeworks
          .filter(h => h.subject?.toLowerCase() === formData.subject?.toLowerCase())
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
              if (recentlyGenerated.length >= 10) break;
            }
          }
          if (recentlyGenerated.length >= 10) break;
        }
      }
      
      const previousQuestionsBlock = recentlyGenerated.length > 0
        ? `\n        CRITICAL UNIFORMITY AVOIDANCE RULE: You MUST NOT repeat or use similar templates, wording, or scenarios to these recently generated questions for this subject. Create completely different situations, contexts, numbers, or question types:\n        ${recentlyGenerated.map((q, idx) => `        ${idx + 1}. "${q}"`).join('\n')}\n`
        : '';

      let prompt = `You are an expert curriculum designer. 
        Create a ${questionCount}-question multiple-choice quiz for students about the following topic:
        Subject: ${formData.subject}
        Topic: ${topic}
        Specific Content Instructions: ${injectedPrompt}
        ${previousQuestionsBlock}
        
        Ensure the questions test the students' knowledge on the specific content instructions provided. DO NOT generate meta-questions about the instructions themselves.
        
        CRITICAL LASER-FOCUS RULE: If a highly specific topic or micro-skill is provided (e.g., 'place value in decimal numbers' or 'identifying nouns'), EVERY SINGLE QUESTION MUST STRICTLY TEST THAT EXACT SKILL. DO NOT generate generalized questions about the broader subject (e.g., if asked for 'decimal place value', DO NOT generate questions about 'ordering decimals' or 'adding decimals'). Stay completely laser-focused on the exact requested skill!

        CRITICAL ACCURACY & QUALITY RULES:
        1. For Language / English / Language Conventions / Spellings / Literacy:
           - Identify the part of speech based strictly on its exact syntactic function inside the sentence context. E.g. in "The walk was long", "walk" is a noun. In "We walk daily", "walk" is a verb.
           - Ensure that the "answer" option is grammatically 100% correct, and the other 3 options are clearly incorrect or represent different parts of speech. No ambiguity.
           - CRITICAL VOCABULARY RULE: You MUST strictly adapt the reading level, vocabulary, and sentence structure to be age-appropriate for the specified grade level. For early learners (Foundation, Grade 1, Grade 2), use extremely simple, short, decodable words and short sentences. Avoid complex phrasing completely.
           - ABSOLUTE SUBJECT BOUNDARY RULE: English, Language Conventions, Spellings, and Literacy subjects must ONLY contain questions about grammar, punctuation, spelling, vocabulary, reading comprehension, sentence structure, or writing. NEVER include maths, arithmetic, geometry, measurement, perimeter, area, angles, fractions, statistics, data, or any other numeracy content — even if framed as a creative word problem or real-world scenario. A perimeter-of-a-whiteboard question is a MATHS question, NOT an English question. DO NOT cross subject boundaries.
        2. For Mathematics and Olympiad Maths:
           - Ensure all equations, word problems, and numeric values are mathematically correct. Double-check your own calculations so there is zero arithmetic error.
           - CRITICAL MATH RULE: Never hallucinate mathematical properties! (e.g. 1234 is EVEN, not odd. Do not confidently assert false mathematical facts). The correct answer MUST be logically and mathematically indisputable.
           - CRITICAL DIAGRAM & INTERACTIVE DISTRIBUTION RULE: For Mathematics and Olympiad Maths, you MUST ensure that exactly 60% of the questions generated are diagram-based or interactive (questions containing "svgCode", "chartData", "geometryData", "gridMapData", "numberLineData", "pathData", "instrumentData", "blockData", "[CLOCK:]", or questionType="interactive"). The remaining 40% must be plain text-based questions (without visual diagrams or interactive drag-and-drop elements). Design the quiz to strictly follow this 60% diagram/interactive and 40% text-based ratio!
        3. For Science:
           - Ensure all facts, definitions, and concepts are scientifically accurate, standard, and strictly grounded in the target grade's national curriculum (e.g., ACARA for Australia, NGSS for USA, UK National Curriculum).
           - ABSOLUTE SCIENCE CURRICULUM BOUNDARY RULE: Science questions must be strictly age-appropriate for the specified grade level. DO NOT include advanced high school or college-level concepts (such as molecular organelle biochemistry, complex chemical formulas, advanced genetics, or physics calculus) when generating primary/elementary science questions. Stay laser-focused on grade-level observational science, ecosystems, food groups, materials, forces, and real-world phenomena.
           - ABSOLUTE NO MATHS SUMS IN SCIENCE RULE: Science subjects MUST ONLY test scientific concepts, biological/physical processes, organ functions, classification, cause-and-effect, and scientific reasoning. NEVER generate primary school arithmetic sums, word problem calculations, addition/subtraction, multiplication/division, time arithmetic (e.g. 9 o'clock + 3 hours), or bar chart math counts (e.g., 'How many more cups/blocks/hours?') in a Science quiz. Even if framed with scientific words like 'digestive system' or 'nutrients', arithmetic word problems are MATHEMATICS questions, NOT Science questions. Keep Science quizzes 100% focused on scientific understanding!
        4. General & Non-English Languages:
           - The "answer" field MUST exactly match one of the 4 values inside the "options" array.
           - All options must be age-appropriate for elementary/middle school students.
           - CRITICAL: Do NOT prepend letters (e.g., A., B., C., D.) or numbers (1., 2.) to the strings in your "options" array. The UI automatically renders the A/B/C/D buttons.
           - ABSOLUTE NO UNREQUESTED TRANSLATIONS RULE: For Hindi, foreign languages, or non-English content, DO NOT include English translations in parentheses inside option strings (e.g. NEVER write "लाल (red)" or "हरा (green)"). Option strings MUST contain ONLY the target language text (e.g. "लाल", "हरा"). Appending English translations in option choices ruins language testing and reveals answers to students! DO NOT include full English translation sentences in parentheses inside question text (e.g. NEVER write "(Read this: 'This is a red flower.' What color is the flower?)"). Keep question text purely in the target language unless specifically asked for a translation task.
           - ABSOLUTE NON-TRIVIAL QUESTION RULE: Never write self-answering questions where the prompt sentence states the exact answer being asked (e.g. DO NOT write "This is a red flower. What color is the flower?" where the answer "red" is literally given in the sentence context!). Questions must test genuine comprehension or vocabulary.
        
        Return ONLY a JSON object containing:
        1. "questions": an array of objects. Each object must have: 
           - "id" (number)
           - "text" (string, the question)
           - "questionType" (string, either "multiple_choice", "text", or "interactive")
           - "interactiveType" (string, either "sorting" or "matching". REQUIRED ONLY IF questionType="interactive")
           - "options" (array of exactly 4 strings. REQUIRED for "multiple_choice". OMIT for "text" and "interactive")
           - "interactiveData" (array of strings. REQUIRED for "interactive". For "sorting", list 3-5 items to sort. For "matching", list 3-5 pairs as strings formatted "LeftItem||RightItem")
           - "answer" (string. For "multiple_choice", must match one option exactly. For "text", provide the exact correct string/spelling. For "interactive", provide a comma-separated list of the correct order or pairs, e.g. "A, B, C" or "A||1, B||2")
           - "subtopic" (string, a specific subtopic or concept under the main topic)
           - "imagePrompt" (string, OPTIONAL. ONLY use this for DECORATIVE or REALISTIC REAL-WORLD PHOTOS (e.g. "A beautiful photograph of a rainforest" or "A cute cartoon dog"). CRITICAL: NEVER use this for mathematical diagrams, probability spinners, graphs, charts, geometric shapes, clocks, or data visuals! The image generation AI CANNOT draw accurate math diagrams! For math diagrams, you MUST use "svgCode" or "chartData" instead!)
        2. "passage": an optional string. If the quiz requires a reading comprehension passage, story, or shared text that applies to the questions, provide it here. Otherwise, omit this key.
        
        CRITICAL FOR READING COMPREHENSION: DO NOT put the reading passage, story, or article inside the "text" of each question! The passage MUST be placed EXACTLY ONCE inside the root-level "passage" string key. The question "text" should only contain the actual question being asked.
        
        CRITICAL FOR INTERACTIVE QUESTIONS:
        If you want the student to physically drag and drop items into order, or connect matching pairs, use questionType="interactive". 
        - For "sorting": Provide a scrambled array of 3-5 items in "interactiveData". The student will drag to reorder them. The "answer" should be the correctly sorted items joined by commas.
        - For "matching": Provide an array of 3-5 string pairs in "interactiveData" separated by "||" (e.g. ["Apple||Fruit", "Carrot||Vegetable"]). The UI will split them and scramble the right side. The "answer" should be the correct pairs joined by commas.
        
        ${assignmentType === 'test' ? 'CRITICAL FOR TESTS: This is a formal NAPLAN-style test paper. Generate a mix of multiple_choice and text input questions. Specifically, ensure that at least 30% of questions require text input (questionType="text" with NO options array), mimicking the actual exam format.' : 'CRITICAL FOR HOMEWORK: You MUST generate a healthy mix of ALL THREE question types ("multiple_choice", "text", and "interactive"). Every homework assignment MUST include at least one "interactive" question (use "sorting" for chronological order/numerical ordering/steps, and "matching" for vocabulary/math facts/definitions). This mix is required to keep the student highly engaged.'}
        
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

      const tieredModel = getModelForGrade(resolvedGrade, formData.subject, activeModel);
      console.log(`[AI] Grade: ${resolvedGrade}, Subject: ${formData.subject} → model: ${tieredModel}`);
      const textResponse = await generateContent({
        prompt,
        responseMimeType: 'application/json',
        provider: tieredModel
      });

      const parsed = JSON.parse(textResponse);
      const rawQuestions = parsed.questions || parsed;
      const questions = Array.isArray(rawQuestions) ? rawQuestions.map(sanitizeQuestionData) : rawQuestions;
      const passage = parsed.passage || null;

      // Shuffle options for each question to randomize correct answer position
      if (Array.isArray(questions)) {
        questions.forEach(q => {
          if (q.imagePrompt && !q.imageUrl) {
            const styleModifier = " in the style of highly attractive, cute, flat vector educational clipart for children, vibrant pastel colors, clean white background, no text";
            q.imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(q.imagePrompt + styleModifier)}?width=800&height=800&nologo=true`;
          } else if (q.imageUrl && !q.imageUrl.includes('pollinations')) {
            // Delete broken hallucinated URLs
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
      const publishGrade = resolveGradeFromClassroomName(activeClassroom?.name);
      const questionsToSave = generatedQuestions || [];

      const isSpatialReasoning = (formData.title || '').toLowerCase().includes('spatial') || (formData.aiPrompt || '').toLowerCase().includes('spatial');
      const isNaplan = (formData.title || '').toLowerCase().includes('naplan') || (formData.aiPrompt || '').toLowerCase().includes('naplan');
      const finalType = isNaplan ? 'test' : assignmentType;

      // Pre-generate explanations for all questions (one API call at creation time)
      // so students never trigger live AI calls when submitting.
      let questionExplanations = {};
      if (questionsToSave.length > 0 && !isSpatialReasoning) {
        questionExplanations = await generateExplanations(questionsToSave, formData.subject, getModelForGrade(publishGrade, formData.subject, activeModel));
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
        questions: questionsToSave || [],
        questionExplanations: questionExplanations || {},
        teacherId: user?.uid || '',
        teacherName: user?.displayName || 'Classroom Teacher',
        assignType: formData.assignType || 'all',
        assignedStudentIds: formData.assignType === 'students' ? (formData.assignedStudentIds || []) : [],
        status: 'published',
        type: finalType || 'homework',
        timeLimit: formData.timeLimit || '30',
        marksPerQuestion: formData.marksPerQuestion || '5',
        difficulty: formData.difficulty || 'Medium',
        createdAt: serverTimestamp()
      });

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
        assignedStudentIds: [],
        difficulty: 'Medium'
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
      const draftGrade = resolveGradeFromClassroomName(activeClassroom?.name);
      const questionsToSave = generatedQuestions || [];

      const isSpatialReasoning = (formData.title || '').toLowerCase().includes('spatial') || (formData.aiPrompt || '').toLowerCase().includes('spatial');
      const isNaplan = (formData.title || '').toLowerCase().includes('naplan') || (formData.aiPrompt || '').toLowerCase().includes('naplan');
      const finalType = isNaplan ? 'test' : assignmentType;

      // Pre-generate explanations at draft-save time as well,
      // so they are ready when the draft is later published.
      let questionExplanations = {};
      if (questionsToSave.length > 0 && !isSpatialReasoning) {
        questionExplanations = await generateExplanations(questionsToSave, formData.subject, getModelForGrade(draftGrade, formData.subject, activeModel));
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
        questions: questionsToSave || [],
        questionExplanations: questionExplanations || {},
        teacherId: user?.uid || '',
        teacherName: user?.displayName || 'Classroom Teacher',
        assignType: formData.assignType || 'all',
        assignedStudentIds: formData.assignType === 'students' ? (formData.assignedStudentIds || []) : [],
        status: 'draft',
        type: finalType || 'homework',
        timeLimit: formData.timeLimit || '30',
        marksPerQuestion: formData.marksPerQuestion || '5',
        difficulty: formData.difficulty || 'Medium',
        createdAt: serverTimestamp()
      });

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
        assignedStudentIds: [],
        difficulty: 'Medium'
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

          {formData.subject !== 'olympiad' ? (
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
          )}

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
                        className="w-full h-12 bg-slate-50 border-2 border-slate-200 rounded-xl px-4 text-slate-700 font-bold hover:border-green-400 hover:bg-white transition-all flex items-center justify-between"
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
                                {(() => {
                                  const { text: cleanText, clockTime, inlineSvg } = parseQuestionText(q.text);
                                  return (
                                    <>
                                      <p className="font-bold text-slate-800 text-sm mb-4 whitespace-pre-wrap"><span className="text-green-600 mr-2">Q{idx + 1}.</span> {cleanText}</p>
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

      <CurriculumModal 
        isOpen={isCurriculumModalOpen}
        onClose={() => setIsCurriculumModalOpen(false)}
        curriculumData={curriculum[resolveGradeFromClassroomName(activeClassroom?.name)]?.[(formData.subject?.toLowerCase().replace('_', ' ') === 'logical reasoning') ? 'Logical Reasoning' : (formData.subject.charAt(0).toUpperCase() + formData.subject.slice(1))] || []}
        selectedSkills={selectedSkills}
        setSelectedSkills={setSelectedSkills}
        customTopics={customTopics}
        onAddCustomTopic={handleAddCustomTopic}
        onDeleteCustomTopic={handleDeleteCustomTopic}
      />
    </div>
  );
}
