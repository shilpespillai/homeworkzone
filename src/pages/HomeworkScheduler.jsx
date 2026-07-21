import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  Trash2, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  FileText,
  AlertCircle,
  User,
  Users,
  Search,
  Pause,
  Play,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, where, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { decryptText } from '../utils/crypto';
import { fetchWithRetry, generateContent, getModelForGrade } from '../utils/aiClient';
import { generateExplanations } from '../utils/generateExplanations';
import CurriculumModal from '../components/CurriculumModal';
import { curriculum } from '../data/curriculum';

// Module-level lock to prevent double-execution (e.g. from React StrictMode double mounts or rapid mount cycles)
const activeAutomationsLock = typeof window !== 'undefined'
  ? (window.activeAutomationsLock = window.activeAutomationsLock || new Set())
  : new Set();

const CURRICULUMS = [
  { id: 'acara', name: 'Australia (ACARA)', flag: '🇦🇺' },
  { id: 'uk', name: 'United Kingdom (National)', flag: '🇬🇧' },
  { id: 'us', name: 'United States (Common Core)', flag: '🇺🇸' },
  { id: 'cbse', name: 'India (CBSE)', flag: '🇮🇳' },
  { id: 'ib', name: 'International Baccalaureate (IB)', flag: '🌐' }
];

const GRADES = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const SUBJECTS = [
  { id: 'english', name: 'English', emoji: '📚', color: 'text-orange-500', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
  { id: 'maths', name: 'Maths', emoji: '🔢', color: 'text-blue-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  { id: 'science', name: 'Science', emoji: '🧪', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  { id: 'olympiad', name: 'Olympiad Maths', emoji: '🏆', color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' }
];

export const cleanCategoryName = (cat) => {
  if (!cat) return '';
  // Strip leading section codes like "A.\t", "B. ", "1. ", "10.\t", "F. ", "3.1 " etc.
  return cat.replace(/^[A-Z0-9]+(?:\.[0-9]+)*[\.\t\s]+\s*/i, '').trim();
};

export const getSmartTopicTitle = (skills) => {
  if (!skills || skills.length === 0) return '';

  const categoryMap = new Map();
  skills.forEach(s => {
    const rawCat = s.category || s.topicCategory || '';
    const cleanCat = cleanCategoryName(rawCat);
    if (cleanCat && !categoryMap.has(cleanCat)) {
      categoryMap.set(cleanCat, rawCat);
    }
  });

  const categories = Array.from(categoryMap.keys());

  if (categories.length === 0) {
    if (skills.length === 1) return skills[0].title;
    return `${skills[0].title} & ${skills.length - 1} more`;
  }

  if (categories.length === 1) {
    return categories[0];
  }

  if (categories.length === 2) {
    const combined = `${categories[0]} & ${categories[1]}`;
    if (combined.length <= 55) {
      return combined;
    }
    return `${categories[0]} & 1 more topic`;
  }

  const combinedTwo = `${categories[0]}, ${categories[1]}`;
  if (combinedTwo.length <= 45) {
    return `${combinedTwo} & ${categories.length - 2} more`;
  }

  return `${categories[0]} & ${categories.length - 1} more topics`;
};


// Compile a prompt template by replacing keywords case-insensitively
const compilePrompt = (customPrompt, params) => {
  if (!customPrompt) return '';
  let compiled = customPrompt;
  
  const replacements = {
    topic: params.topic,
    grade: params.grade,
    difficulty: params.difficulty,
    curriculum: params.curriculumName || params.curriculum,
    subject: params.subject,
    questionCount: params.questionCount,
    question_count: params.questionCount,
    points: params.points
  };

  Object.entries(replacements).forEach(([key, val]) => {
    const stringVal = String(val || '');
    const regexSquare = new RegExp(`\\[${key}\\]`, 'gi');
    const regexCurly = new RegExp(`\\{${key}\\}`, 'gi');
    compiled = compiled.replace(regexSquare, stringVal).replace(regexCurly, stringVal);
  });

  return compiled;
};

export default function HomeworkScheduler({ user, classrooms = [], activeClassroom, subjectPrompts = {}, onHomeworkScheduled, teacherBilling, allHomeworks = [], setDashboardTab, isAdmin }) {
  const [formData, setFormData] = useState({
    subject: 'maths',
    topic: '',
    curriculum: 'acara',
    grade: 'Grade 4',
    difficulty: 'Medium',
    questionCount: 5,
    points: '10',
    selectedClasses: [],
    releaseDate: '',
    releaseTime: '08:00',
    dueDate: '',
    dueTime: '17:00',
    publishType: 'draft', // 'draft', 'publish_now', or 'publish_scheduled'
    recurrence: 'none', // 'none', 'daily', 'weekly', 'monthly'
    recurrenceDay: '1', // '1' = Monday, '2' = Tuesday, etc.
    recurrenceDate: '1', // '1' to '28' for monthly
    dueDateOffset: 7,
    assignType: 'all',
    assignedStudentIds: [],
    assignmentType: 'homework' // 'homework' or 'test'
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
    if (hasReachedLimit) {
      setShowUpgradeModal(true);
      return true;
    }
    return false;
  };

  const [students, setStudents] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  
  // States for editing an active automation
  const [editingAutomationId, setEditingAutomationId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [activeAutomationTab, setActiveAutomationTab] = useState('All');
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!user?.uid || !activeClassroom?.id) {
        setStudents([]);
        return;
      }
      setIsLoadingStudents(true);
      try {
        const snap = await getDocs(collection(db, 'teachers', user.uid, 'classrooms', activeClassroom.id, 'students'));
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStudents(list);
      } catch (err) {
        console.error("Error fetching students for scheduler:", err);
      }
      setIsLoadingStudents(false);
    };
    fetchStudents();
  }, [activeClassroom?.id, user]);

  const dynamicSubjects = useMemo(() => {
    const list = [...SUBJECTS];
    
    const getSubjectEmoji = (name) => {
      const lower = name.toLowerCase();
      if (lower.includes('math') || lower.includes('numeracy')) return '🔢';
      if (lower.includes('science')) return '🧪';
      if (lower.includes('read') || lower.includes('writ') || lower.includes('language') || lower.includes('english')) return '📝';
      if (lower.includes('history') || lower.includes('geography') || lower.includes('social')) return '🌍';
      if (lower.includes('art') || lower.includes('music')) return '🎨';
      return '📚';
    };

    // Add from subjectPrompts
    if (subjectPrompts) {
      Object.keys(subjectPrompts).forEach(key => {
        if (subjectPrompts[key] === null) return;
        const lowerKey = key.toLowerCase();
        if (!list.some(s => s.id === lowerKey)) {
          list.push({
            id: lowerKey,
            name: key.charAt(0).toUpperCase() + key.slice(1),
            emoji: getSubjectEmoji(key),
            color: 'text-purple-500',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200'
          });
        }
      });
    }

    // Add from activeClassroom
    if (activeClassroom?.subjects) {
      activeClassroom.subjects.forEach(subjectName => {
        const lowerKey = subjectName.toLowerCase();
        if (!list.some(s => s.id === lowerKey)) {
          list.push({
            id: lowerKey,
            name: subjectName,
            emoji: getSubjectEmoji(subjectName),
            color: 'text-pink-500',
            bgColor: 'bg-pink-50',
            borderColor: 'border-pink-200'
          });
        }
      });
    }

    return list;
  }, [subjectPrompts, activeClassroom?.subjects]);

  const handleRecurrenceChange = (type) => {
    setFormData(prev => {
      let nextPublishType = prev.publishType;
      if (type === 'none') {
        if (prev.publishType === 'publish_now') {
          nextPublishType = 'publish_scheduled';
        }
      } else {
        if (prev.publishType === 'publish_scheduled') {
          nextPublishType = 'publish_now';
        }
      }
      return {
        ...prev,
        recurrence: type,
        publishType: nextPublishType
      };
    });
  };

  const handleSaveAutomationEdit = async (id) => {
    try {
      const updates = {};
      if (editForm.releaseTime) updates.releaseTime = editForm.releaseTime;
      if (editForm.assignmentType) updates.type = editForm.assignmentType;
      if (editForm.recurrenceDay) updates.recurrenceDay = editForm.recurrenceDay;
      if (editForm.recurrenceDate) updates.recurrenceDate = editForm.recurrenceDate;
      
      await updateDoc(doc(db, 'recurring_schedules', id), updates);
      setEditingAutomationId(null);
      setEditForm({});
      fetchRecurringSchedules();
    } catch (err) {
      console.error("Error saving automation edit:", err);
      alert("Oops! Could not save changes.");
    }
  };

  const handlePublishTypeChange = (action) => {
    setFormData(prev => {
      let nextPublishType = 'draft';
      if (action === 'publish') {
        nextPublishType = prev.recurrence === 'none' ? 'publish_scheduled' : 'publish_now';
      }
      return {
        ...prev,
        publishType: nextPublishType
      };
    });
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [scheduledItems, setScheduledItems] = useState([]);
  const [recurringItems, setRecurringItems] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [isCheckingAutomations, setIsCheckingAutomations] = useState(false);

  // Set default selected classroom and resolve grade if available
  useEffect(() => {
    if (activeClassroom?.id) {
      const resolvedGrade = (() => {
        if (!activeClassroom.name) return 'Grade 4';
        const match = activeClassroom.name.match(/\d+/);
        if (match) {
          const num = parseInt(match[0], 10);
          if (num >= 1 && num <= 12) {
            return `Grade ${num}`;
          }
        }
        return 'Grade 4';
      })();
      setFormData(prev => ({ 
        ...prev, 
        selectedClasses: [activeClassroom.id],
        grade: resolvedGrade,
        assignType: 'all',
        assignedStudentIds: []
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        selectedClasses: [],
        grade: 'Grade 4',
        assignType: 'all',
        assignedStudentIds: []
      }));
    }
  }, [activeClassroom]);

  // Load scheduled and draft items
  const fetchScheduledHistory = async () => {
    if (!user?.uid) return;
    setIsLoadingHistory(true);
    try {
      const q = query(collection(db, 'homeworks'), where('teacherId', '==', user.uid));
      const snap = await getDocs(q);
      const items = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      
      // Sort by creation date descending
      items.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });

      setScheduledItems(items);
    } catch (err) {
      console.error("Fetch scheduled items error:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const fetchRecurringSchedules = async () => {
    if (!user?.uid) return;
    try {
      const q = query(collection(db, 'recurring_schedules'), where('teacherId', '==', user.uid));
      const snap = await getDocs(q);
      const list = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      list.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt ? Date.now() : 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt ? Date.now() : 0);
        return timeB - timeA;
      });
      setRecurringItems(list);
    } catch (err) {
      console.error("Fetch recurring schedules error:", err);
    }
  };

  // Helper to fetch past quiz questions to avoid repetitions
  const fetchPastQuestions = async (classIds) => {
    if (!classIds || classIds.length === 0) return [];
    try {
      const pastQuestionsList = [];
      for (const classId of classIds) {
        const q = query(
          collection(db, 'homeworks'), 
          where('assignedClassId', '==', classId)
        );
        const snap = await getDocs(q);
        const hws = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Sort client-side by creation date descending
        hws.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return timeB - timeA;
        });

        // Get questions from last 3 homeworks
        const recentHws = hws.slice(0, 3);
        recentHws.forEach(hw => {
          if (Array.isArray(hw.questions)) {
            hw.questions.forEach(q => {
              if (q.text && !pastQuestionsList.includes(q.text)) {
                pastQuestionsList.push(q.text);
              }
            });
          }
        });
      }
      return pastQuestionsList;
    } catch (err) {
      console.error("Error fetching past questions:", err);
      return [];
    }
  };

  // Run automatically when scheduler loads — catch-up for any missed slots
  const checkAndRunAutomations = async () => {
    if (!user?.uid || isCheckingAutomations) return;
    setIsCheckingAutomations(true);
    try {
      const q = query(
        collection(db, 'recurring_schedules'), 
        where('teacherId', '==', user.uid),
        where('isActive', '==', true)
      );
      const snap = await getDocs(q);
      const activeSchedules = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      
      const now = new Date();
      let generatedAny = false;

      const getLocalDateString = (date) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const todayStr = getLocalDateString(now);

      for (const sched of activeSchedules) {
        const lastRunDate = sched.lastRun?.toDate ? sched.lastRun.toDate() : null;
        const lastRunTime = lastRunDate ? lastRunDate.getTime() : 0;

        const [targetHour, targetMin] = (sched.releaseTime || '08:00').split(':').map(Number);

        // Find the most recent slot that should have triggered
        let latestScheduled = new Date(now);
        latestScheduled.setHours(targetHour, targetMin, 0, 0);

        // If we haven't reached today's release time, the last slot was yesterday
        if (now < latestScheduled) {
          latestScheduled.setDate(latestScheduled.getDate() - 1);
        }

        // For weekly, rewind to the correct weekday
        if (sched.recurrence === 'weekly') {
          const targetDay = parseInt(sched.recurrenceDay, 10);
          const currentDay = latestScheduled.getDay();
          let dayDiff = currentDay - targetDay;
          if (dayDiff < 0) dayDiff += 7;
          latestScheduled.setDate(latestScheduled.getDate() - dayDiff);
        } else if (sched.recurrence === 'monthly') {
          const targetDate = parseInt(sched.recurrenceDate || '1', 10);
          const currentMonth = latestScheduled.getMonth();
          const currentYear = latestScheduled.getFullYear();
          let targetMonthDate = new Date(currentYear, currentMonth, targetDate, targetHour, targetMin, 0, 0);

          if (now < targetMonthDate) {
             targetMonthDate.setMonth(targetMonthDate.getMonth() - 1);
          }
          latestScheduled = targetMonthDate;
        }

        // Only run if the most recent scheduled slot is exactly TODAY (no historical catch-up)
        const isScheduledForToday = latestScheduled.toDateString() === now.toDateString();
        const shouldRun = (lastRunTime < latestScheduled.getTime()) && isScheduledForToday;

        if (shouldRun) {
          const lockKey = `${sched.id}_${todayStr}`;
          if (activeAutomationsLock.has(lockKey)) {
            console.log(`[Scheduler] Automation ${sched.id} already running in this session. Skipping.`);
            continue;
          }
          activeAutomationsLock.add(lockKey);
          try {
            await executeRecurringGeneration(sched);
            generatedAny = true;
          } catch (err) {
            console.error(`Failed to execute recurring generation for ${sched.id}:`, err);
            activeAutomationsLock.delete(lockKey);
          }
        }
      }

      if (generatedAny) {
        fetchScheduledHistory();
      }
    } catch (err) {
      console.error("Failed checking/running automations:", err);
    } finally {
      setIsCheckingAutomations(false);
    }
  };


  const executeRecurringGeneration = async (sched) => {
    if (hasReachedLimit) {
      console.log(`[Scheduler] Automation skipped because limit reached.`);
      return;
    }
    const schedRef = doc(db, 'recurring_schedules', sched.id);
    const originalLastRun = sched.lastRun || null;

    try {
      // 1. Immediately update lastRun in Firestore to prevent other concurrent checks / tabs from running it
      await updateDoc(schedRef, { lastRun: serverTimestamp() });

      let activeModel = localStorage.getItem('hwz_active_ai') || 'gemini';
      let teacherPrompts = {
        maths: 'Make 5 questions about adding fractions with unlike denominators. This is for grade 4 students.',
        english: 'Make 5 questions about identifying nouns vs verbs in a sentence. This is for grade 4 students.',
        science: 'Make 5 questions about the solar system and planets. This is for grade 4 students.',
        logical_reasoning: 'Generate 5 logical reasoning questions. Focus on puzzles, patterns, seating arrangements, coding-decoding, syllogisms, or blood relations suitable for the grade level. Ensure highly visual structure and logical flow.',
        olympiad: 'Generate 5 Olympiad-level maths questions. Focus on advanced problem-solving, combinatorics, number theory, and logic. Ensure that at least 60% of the questions contain visual mathematical diagrams (using custom svgCode or chartData/geometryData) or interactive components to make them highly challenging and engaging.'
      };

      if (user?.uid) {
        const teacherDoc = await getDoc(doc(db, 'teachers', user.uid));
        if (teacherDoc.exists()) {
          const data = teacherDoc.data();
          if (data.activeAi) activeModel = data.activeAi;
          if (data.subjectPrompts) {
            teacherPrompts = { ...teacherPrompts, ...data.subjectPrompts };
            Object.keys(teacherPrompts).forEach(k => {
              if (teacherPrompts[k] === null) delete teacherPrompts[k];
            });
          }
        }
      }

      // Fetch custom prompt from My Prompts (case-insensitive subject matching)
      const normSubject = sched.subject.toLowerCase();
      const matchedKey = teacherPrompts ? Object.keys(teacherPrompts).find(k => k.toLowerCase() === normSubject) : null;
      const customPrompt = (matchedKey && teacherPrompts[matchedKey]) ? teacherPrompts[matchedKey] : '';

      let prompt = "";
      if (customPrompt) {
        prompt = compilePrompt(customPrompt, {
          topic: sched.topic,
          grade: sched.grade,
          difficulty: sched.difficulty,
          curriculum: sched.curriculum,
          curriculumName: sched.curriculumName || 'ACARA',
          subject: sched.subject,
          questionCount: sched.questionCount || 5,
          points: sched.points || '10'
        });
        
        prompt += `\n\nReturn ONLY a JSON object with a single key "questions" containing an array of exactly ${sched.questionCount || 5} objects. Each object must have: "id" (number), "text" (string, the question), "options" (array of exactly 4 strings), "answer" (string, matching one option exactly), and "subtopic" (string, a specific subtopic or concept under the main topic, e.g. "Adding Fractions", "Identifying Nouns", "Photosynthesis", etc.). Do not include any markdown formatting.`;
      } else {
        prompt = `You are an expert curriculum designer. 
        Create a ${sched.questionCount || 5}-question multiple-choice quiz for students on the following:
        Subject: ${sched.subject}
        Topic/Concept: ${sched.topic}
        ${sched.selectedSkills && sched.selectedSkills.length > 0 ? `Specific Micro-Skills / Subtopics to Cover: ${sched.selectedSkills.map(s => s.title).join(', ')}` : ''}
        Grade Level: ${sched.grade}
        Difficulty: ${sched.difficulty}
        Curriculum Alignment: Strictly match the ${sched.curriculumName || 'ACARA'} standards for ${sched.grade} at a ${sched.difficulty} difficulty.
        
        Ensure the questions test the students' knowledge on the specific topic at the selected grade and difficulty.

        CRITICAL ACCURACY & QUALITY RULES:
        1. For English Grammar / Language Conventions / Spellings / Literacy / Word Classification (nouns, verbs, adjectives, adverbs, prepositions, etc.):
           - Identify the part of speech based strictly on its exact syntactic function inside the sentence context. E.g. in "The walk was long", "walk" is a noun. In "We walk daily", "walk" is a verb.
           - Ensure that the "answer" option is grammatically 100% correct, and the other 3 options are clearly incorrect or represent different parts of speech. No ambiguity.
           - ABSOLUTE SUBJECT BOUNDARY RULE: English, Language Conventions, Spellings, and Literacy subjects must ONLY contain questions about grammar, punctuation, spelling, vocabulary, reading comprehension, sentence structure, or writing. NEVER include maths, arithmetic, geometry, measurement, perimeter, area, angles, fractions, statistics, data, or any other numeracy content — even if framed as a creative word problem or real-world scenario. DO NOT cross subject boundaries.
        2. For Mathematics and Olympiad Maths:
           - Ensure all equations, word problems, and numeric values are mathematically correct. Double-check your own calculations so there is zero arithmetic error.
           - The correct answer MUST be logically and mathematically indisputable.
           - CRITICAL DIAGRAM & INTERACTIVE DISTRIBUTION RULE: For Mathematics and Olympiad Maths, you MUST ensure that exactly 60% of the questions generated are diagram-based or interactive (questions containing "svgCode", "chartData", "geometryData", "gridMapData", "numberLineData", "pathData", "instrumentData", "blockData", "[CLOCK:]", or questionType="interactive"). The remaining 40% must be plain text-based questions (without visual diagrams or interactive drag-and-drop elements). Design the quiz to strictly follow this 60% diagram/interactive and 40% text-based ratio!
        3. For Science:
           - Ensure all facts, definitions, and concepts are scientifically accurate and standard.
        4. General:
           - The "answer" field MUST exactly match one of the 4 values inside the "options" array.
           - All options must be age-appropriate for elementary/middle school students.
           - Do NOT prepend letters (e.g., A., B., C., D.) to the option strings.

        Return ONLY a JSON object containing:
        1. "questions": an array of objects. Each object must have: 
           - "id" (number)
           - "text" (string, the question)
           - "questionType" (string, "multiple_choice")
           - "options" (array of exactly 4 strings)
           - "answer" (string, must match one option exactly)
           - "subtopic" (string, specific subtopic or concept)
           - "imagePrompt" (string, OPTIONAL. ONLY for decorative or real-world photos. NEVER use for math diagrams)
           - "svgCode" (string, OPTIONAL. For custom diagrams, geometry shapes, fraction models, mirror images, spinner layouts, etc.)
           - "chartData" (object, OPTIONAL. For bar, line, pie, or table visuals)
           - "geometryData" (object, OPTIONAL. For rectangle, triangle, circle, cylinder, cube with labels)
           - "earlyMathData" (object, OPTIONAL. For basic counting, cubes, ten-frames)
           - "gridMapData" (object, OPTIONAL. For 2D grid coordinates, maps, coordinate reading)
           - "pathData" (object, OPTIONAL. For routes, turns, angles)
           - "numberLineData" (object, OPTIONAL. For fractions/decimals on a number line)
           - "instrumentData" (object, OPTIONAL. For ruler, beaker, thermometer measurements)
           - "blockData" (object, OPTIONAL. For stacked 3D cubes/blocks)
           - "vennDiagramData" (object, OPTIONAL. For set sorting)
        2. "passage": an optional string. If the quiz requires a reading comprehension passage, story, or shared text, provide it here. Otherwise, omit this key.

        CRITICAL FOR FRACTIONS AND EQUIVALENT SHAPES:
        - If a question involves fractions, patterns, or equivalent fractions, you MUST include a visual diagram using "svgCode" representing the fraction (e.g., a circle/pizza divided into equal slices, a 2x5 grid of boxes with some colored in, or geometric shapes like triangles/hexagons/pentagons split into equal pieces with a fraction of them shaded in bright yellow or orange). Ensure the parts are mathematically equal.

        CRITICAL FOR ANGLES AND MEASUREMENTS:
        - If a question is about angles (e.g., measuring acute/obtuse/right angles, finding the missing angle in a triangle or quadrilateral, or calculating angle sums), you MUST include a geometric diagram using "svgCode". Draw the angle rays or shapes (triangle/quadrilateral) with clear black or colored lines, include curved arcs for the angles, and label the angles clearly with degrees (e.g., "70°", "130°", "x°") near their respective vertices.

        CRITICAL FOR GRAPHS AND CHARTS:
        - For questions about surveys, data, or column/bar graphs (like tracking sports preferences, favorites, etc.), include a "chartData" object or use "svgCode" to draw a beautiful grid-based bar graph with axis ticks, labels, and horizontal or vertical colored bars.
        - CRITICAL CHART ANSWER-HIDING RULE: If the question asks the student to FIND or CALCULATE a specific value (e.g. "what percentage is Bus?", "how many students chose Soccer?", "what is the missing value?"), you MUST set the value for the unknown/answer category to -1 in chartData. The UI will render it as a "?" segment/bar so the answer is hidden. NEVER expose the answer as a numeric label on the chart itself. Example: if Bus=45% is the answer, use {"name": "Bus", "value": -1} in chartData.


        CRITICAL RULES FOR "svgCode" AESTHETICS (Make it look like premium educational clipart!):
        - 🎨 VIBRANT COLORS: NEVER use boring plain black lines on white backgrounds! Use bright, cheerful, or highly saturated hex colors (e.g., #FF6B6B red, #4ECDC4 teal, #FFE66D yellow, #6B5B95 purple, #A8E6CF mint). Fill backgrounds with a very soft pastel color instead of plain white.
        - 🖌️ THICK STROKES & ROUNDED CORNERS: Make shapes look extremely friendly and professional by using thick strokes (stroke-width="3" or "4"), and always use stroke-linecap="round" and stroke-linejoin="round".
        - ☁️ SHADOWS & DEPTH: Make shapes pop off the page! Draw a slightly offset dark-opacity copy of the shape underneath it to create a 3D drop shadow effect.
        - ✏️ PLAYFUL FONTS: Use font-family="'Nunito', 'Comic Sans MS', sans-serif" font-weight="900" and large font sizes for a playful, highly readable, child-friendly look.

        CRITICAL FOR CLOCKS AND TIME: 
        DO NOT try to draw analog clocks using "svgCode"! INSTEAD, simply include the string "[CLOCK:HH:MM]" anywhere in your question "text" (e.g., "What time is shown on the clock? [CLOCK:02:30]"). Our system will automatically detect this and render a mathematically perfect, beautiful analog clock diagram in its place!`;
      }

      // Fetch past questions to avoid duplication
      const pastQuestions = await fetchPastQuestions(sched.selectedClasses);
      if (pastQuestions.length > 0) {
        prompt += `\n\nCRITICAL: To prevent duplication and ensure academic variety, do NOT generate questions that are identical, highly similar, or test the exact same numbers/phrases as these past questions from recent assignments:\n` + 
          pastQuestions.slice(0, 15).map((q, idx) => `- "${q}"`).join('\n');
      }

      const tieredModel1 = getModelForGrade(sched.grade, sched.subject, activeModel);
      const textResponse = await generateContent({
        prompt,
        responseMimeType: 'application/json',
        provider: tieredModel1
      });

      const parsed = JSON.parse(textResponse);
      const questions = parsed.questions || parsed;
      const passage = parsed.passage || null;

      if (!Array.isArray(questions) || questions.length === 0) {
        // Revert lastRun in Firestore since generation failed to produce questions
        await updateDoc(schedRef, { lastRun: originalLastRun });
        return;
      }

      const title = `${sched.topic} (${sched.grade})`;

      const todayDateStr = new Date().toISOString().split('T')[0];
      const futureDue = new Date();
      futureDue.setDate(futureDue.getDate() + (sched.dueDateOffset || 7));
      const formattedDueDate = futureDue.toISOString().split('T')[0];

      // Pre-generate explanations once — all students share them (zero runtime AI calls)
      const questionExplanations = await generateExplanations(questions, sched.subject, tieredModel1);

      for (const classId of sched.selectedClasses) {
        const statusVal = sched.publishType === 'draft' 
          ? 'draft' 
          : (sched.publishType === 'publish_scheduled' ? 'scheduled' : 'published');

        const payload = {
          title,
          subject: sched.subject,
          instructions: `Complete this automated ${sched.subject} ${sched.type === 'test' ? 'test' : 'homework'} on ${sched.topic}. Built for ${sched.grade} (${sched.difficulty}) matching the ${sched.curriculumName || 'ACARA'} standard. 🤖`,
          assignedClassId: classId,
          dueDate: formattedDueDate,
          time: sched.dueTime || '17:00',
          points: sched.points || '10',
          passage: passage,
          questions: questions,
          questionExplanations,
          teacherId: user?.uid,
          teacherName: user?.displayName || sched.teacherName || 'Classroom Teacher',
          status: statusVal,
          type: sched.type || 'homework',
          assignType: sched.assignType || 'all',
          assignedStudentIds: sched.assignType === 'students' ? (sched.assignedStudentIds || []) : [],
          scheduledRelease: statusVal === 'scheduled' ? {
            date: todayDateStr,
            time: sched.releaseTime || '08:00'
          } : null,
          metadata: {
            curriculum: sched.curriculum,
            curriculumName: sched.curriculumName || 'ACARA',
            grade: sched.grade,
            difficulty: sched.difficulty,
            topic: sched.topic,
            scheduledVia: 'Auto-Scheduler',
            scheduleProfileId: sched.id
          },
          createdAt: serverTimestamp()
        };
        await addDoc(collection(db, 'homeworks'), payload);
      }
    } catch (err) {
      console.error("Execute recurring generation error:", err);
      // Revert lastRun in Firestore so it can be retried on next cycle
      try {
        await updateDoc(schedRef, { lastRun: originalLastRun });
      } catch (revertErr) {
        console.error("Failed to revert lastRun after error:", revertErr);
      }
      throw err;
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchScheduledHistory();
      fetchRecurringSchedules();
      checkAndRunAutomations();
    }
  }, [user]);

  const handleClassToggle = (classId) => {
    setFormData(prev => {
      const alreadySelected = prev.selectedClasses.includes(classId);
      const newClasses = alreadySelected
        ? prev.selectedClasses.filter(id => id !== classId)
        : [...prev.selectedClasses, classId];
      return { ...prev, selectedClasses: newClasses };
    });
  };

  const handleGenerateAndSchedule = async (e) => {
    e.preventDefault();
    if (checkLimitAndTrigger()) return;
    if (!formData.topic.trim()) {
      alert("Please enter a homework topic/concept! 🎯");
      return;
    }
    if (formData.selectedClasses.length === 0) {
      alert("Please select at least one classroom! 🏫");
      return;
    }
    if (formData.assignType === 'students' && (!formData.assignedStudentIds || formData.assignedStudentIds.length === 0)) {
      alert("Please select at least one student to assign this homework to! 👤");
      return;
    }
    if (formData.recurrence === 'none' && !formData.dueDate) {
      alert("Please select a due date! 📅");
      return;
    }
    if (formData.recurrence === 'none' && formData.publishType === 'publish_scheduled' && (!formData.releaseDate || !formData.releaseTime)) {
      alert("Please configure a future release date and time! ⏰");
      return;
    }

    setIsGenerating(true);
    try {
      // 1. Secure AI Model Preference Resolution
      let activeModel = localStorage.getItem('hwz_active_ai') || 'gemini';

      if (user?.uid) {
        try {
          const teacherDoc = await getDoc(doc(db, 'teachers', user.uid));
          if (teacherDoc.exists()) {
            const data = teacherDoc.data();
            if (data.activeAi) {
              activeModel = data.activeAi;
            }
          }
        } catch (dbErr) {
          console.warn("Cloud settings load failed:", dbErr);
        }
      }

      const curriculumObj = CURRICULUMS.find(c => c.id === formData.curriculum);
      const curriculumName = curriculumObj ? curriculumObj.name : formData.curriculum;

      // 2. Save Recurring Schedule if configured and short-circuit
      if (formData.recurrence !== 'none') {
        const offset = parseInt(formData.dueDateOffset, 10) || 7;

        const schedulePayload = {
          teacherId: user?.uid,
          teacherName: user?.displayName || 'Classroom Teacher',
          subject: formData.subject,
          topic: formData.topic,
          selectedSkills: selectedSkills || [],
          curriculum: formData.curriculum,
          curriculumName,
          grade: formData.grade,
          difficulty: formData.difficulty,
          questionCount: formData.questionCount,
          points: formData.points,
          selectedClasses: formData.selectedClasses,
          recurrence: formData.recurrence,
          recurrenceDay: formData.recurrenceDay || '1',
          recurrenceDate: formData.recurrenceDate || '1',
          publishType: formData.publishType,
          releaseTime: formData.releaseTime || '08:00',
          dueTime: formData.dueTime || '17:00',
          dueDateOffset: offset,
          assignType: formData.assignType,
          assignedStudentIds: formData.assignType === 'students' ? formData.assignedStudentIds : [],
          type: formData.assignmentType || 'homework',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          lastRun: serverTimestamp(), // Initialized to now to prevent retroactively running past occurrences
          createdAt: serverTimestamp(),
          isActive: true
        };
        await addDoc(collection(db, 'recurring_schedules'), schedulePayload);

        alert(`Successfully created recurring homework automation! 🤖`);

        // Reset topic and class selections
        setSelectedSkills([]);
        setFormData(prev => ({
          ...prev,
          topic: '',
          selectedClasses: activeClassroom?.id ? [activeClassroom.id] : [],
          recurrence: 'none',
          dueDateOffset: 7,
          assignType: 'all',
          assignedStudentIds: []
        }));

        // Refresh automations
        fetchRecurringSchedules();
        setIsGenerating(false);
        return;
      }

      // 3. For One-time schedule: Generate homework immediately
      const title = `${formData.topic} (${formData.grade})`;

      // Fetch custom prompt from My Prompts (case-insensitive subject matching)
      const normSubject = formData.subject.toLowerCase();
      const matchedKey = subjectPrompts ? Object.keys(subjectPrompts).find(k => k.toLowerCase() === normSubject) : null;
      const customPrompt = (matchedKey && subjectPrompts[matchedKey]) ? subjectPrompts[matchedKey] : '';
      let prompt = "";
      if (customPrompt) {
        prompt = compilePrompt(customPrompt, {
          topic: formData.topic,
          grade: formData.grade,
          difficulty: formData.difficulty,
          curriculum: formData.curriculum,
          curriculumName,
          subject: formData.subject,
          questionCount: formData.questionCount,
          points: formData.points
        });
        
        prompt += `\n\nReturn ONLY a JSON object containing:\n1. "questions": an array of exactly ${formData.questionCount} objects. Each object must have: "id" (number), "text" (string, the question), "options" (array of exactly 4 strings), "answer" (string, matching one option exactly), and "subtopic" (string, a specific subtopic or concept under the main topic).\n2. "passage": an optional string. If the quiz requires a reading comprehension passage, story, or shared text that applies to the questions, provide it here. Otherwise, omit this key.\nDo not include any markdown formatting.`;
      } else {
        prompt = `You are an expert curriculum designer. 
        Create a ${formData.questionCount}-question multiple-choice quiz for students on the following:
        Subject: ${formData.subject}
        Topic/Concept: ${formData.topic}
        ${selectedSkills && selectedSkills.length > 0 ? `Specific Micro-Skills / Subtopics to Cover: ${selectedSkills.map(s => s.title).join(', ')}` : ''}
        Grade Level: ${formData.grade}
        Difficulty: ${formData.difficulty}
        Curriculum Alignment: Strictly match the ${curriculumName} standards for ${formData.grade} at a ${formData.difficulty} difficulty.
        
        Ensure the questions test the students' knowledge on the specific topic at the selected grade and difficulty.

        CRITICAL ACCURACY & QUALITY RULES:
        1. For English Grammar / Language Conventions / Spellings / Literacy / Word Classification (nouns, verbs, adjectives, adverbs, prepositions, etc.):
           - Identify the part of speech based strictly on its exact syntactic function inside the sentence context. E.g. in "The walk was long", "walk" is a noun. In "We walk daily", "walk" is a verb.
           - Ensure that the "answer" option is grammatically 100% correct, and the other 3 options are clearly incorrect or represent different parts of speech. No ambiguity.
           - ABSOLUTE SUBJECT BOUNDARY RULE: English, Language Conventions, Spellings, and Literacy subjects must ONLY contain questions about grammar, punctuation, spelling, vocabulary, reading comprehension, sentence structure, or writing. NEVER include maths, arithmetic, geometry, measurement, perimeter, area, angles, fractions, statistics, data, or any other numeracy content — even if framed as a creative word problem or real-world scenario. DO NOT cross subject boundaries.
        2. For Mathematics and Olympiad Maths:

            - Ensure all equations, word problems, and numeric values are mathematically correct. Double-check your own calculations so there is zero arithmetic error.
            - The correct answer MUST be logically and mathematically indisputable.
            - CRITICAL DIAGRAM & INTERACTIVE DISTRIBUTION RULE: For Mathematics and Olympiad Maths, you MUST ensure that exactly 60% of the questions generated are diagram-based or interactive (questions containing "svgCode", "chartData", "geometryData", "gridMapData", "numberLineData", "pathData", "instrumentData", "blockData", "[CLOCK:]", or questionType="interactive"). The remaining 40% must be plain text-based questions (without visual diagrams or interactive drag-and-drop elements). Design the quiz to strictly follow this 60% diagram/interactive and 40% text-based ratio!
        3. For Science:
           - Ensure all facts, definitions, and concepts are scientifically accurate and standard.
        4. General:
           - The "answer" field MUST exactly match one of the 4 values inside the "options" array.
           - All options must be age-appropriate for elementary/middle school students.
           - Do NOT prepend letters (e.g., A., B., C., D.) to the option strings.

        Return ONLY a JSON object containing:
        1. "questions": an array of objects. Each object must have: 
           - "id" (number)
           - "text" (string, the question)
           - "questionType" (string, "multiple_choice")
           - "options" (array of exactly 4 strings)
           - "answer" (string, must match one option exactly)
           - "subtopic" (string, specific subtopic or concept)
           - "imagePrompt" (string, OPTIONAL. ONLY for decorative or real-world photos. NEVER use for math diagrams)
           - "svgCode" (string, OPTIONAL. For custom diagrams, geometry shapes, fraction models, mirror images, spinner layouts, etc.)
           - "chartData" (object, OPTIONAL. For bar, line, pie, or table visuals)
           - "geometryData" (object, OPTIONAL. For rectangle, triangle, circle, cylinder, cube with labels)
           - "earlyMathData" (object, OPTIONAL. For basic counting, cubes, ten-frames)
           - "gridMapData" (object, OPTIONAL. For 2D grid coordinates, maps, coordinate reading)
           - "pathData" (object, OPTIONAL. For routes, turns, angles)
           - "numberLineData" (object, OPTIONAL. For fractions/decimals on a number line)
           - "instrumentData" (object, OPTIONAL. For ruler, beaker, thermometer measurements)
           - "blockData" (object, OPTIONAL. For stacked 3D cubes/blocks)
           - "vennDiagramData" (object, OPTIONAL. For set sorting)
        2. "passage": an optional string. If the quiz requires a reading comprehension passage, story, or shared text, provide it here. Otherwise, omit this key.

        CRITICAL FOR FRACTIONS AND EQUIVALENT SHAPES:
        - If a question involves fractions, patterns, or equivalent fractions, you MUST include a visual diagram using "svgCode" representing the fraction (e.g., a circle/pizza divided into equal slices, a 2x5 grid of boxes with some colored in, or geometric shapes like triangles/hexagons/pentagons split into equal pieces with a fraction of them shaded in bright yellow or orange). Ensure the parts are mathematically equal.

        CRITICAL FOR ANGLES AND MEASUREMENTS:
        - If a question is about angles (e.g., measuring acute/obtuse/right angles, finding the missing angle in a triangle or quadrilateral, or calculating angle sums), you MUST include a geometric diagram using "svgCode". Draw the angle rays or shapes (triangle/quadrilateral) with clear black or colored lines, include curved arcs for the angles, and label the angles clearly with degrees (e.g., "70°", "130°", "x°") near their respective vertices.

        CRITICAL FOR GRAPHS AND CHARTS:
        - For questions about surveys, data, or column/bar graphs (like tracking sports preferences, favorites, etc.), include a "chartData" object or use "svgCode" to draw a beautiful grid-based bar graph with axis ticks, labels, and horizontal or vertical colored bars.

        CRITICAL RULES FOR "svgCode" AESTHETICS (Make it look like premium educational clipart!):
        - 🎨 VIBRANT COLORS: NEVER use boring plain black lines on white backgrounds! Use bright, cheerful, or highly saturated hex colors (e.g., #FF6B6B red, #4ECDC4 teal, #FFE66D yellow, #6B5B95 purple, #A8E6CF mint). Fill backgrounds with a very soft pastel color instead of plain white.
        - 🖌️ THICK STROKES & ROUNDED CORNERS: Make shapes look extremely friendly and professional by using thick strokes (stroke-width="3" or "4"), and always use stroke-linecap="round" and stroke-linejoin="round".
        - ☁️ SHADOWS & DEPTH: Make shapes pop off the page! Draw a slightly offset dark-opacity copy of the shape underneath it to create a 3D drop shadow effect.
        - ✏️ PLAYFUL FONTS: Use font-family="'Nunito', 'Comic Sans MS', sans-serif" font-weight="900" and large font sizes for a playful, highly readable, child-friendly look.

        CRITICAL FOR CLOCKS AND TIME: 
        DO NOT try to draw analog clocks using "svgCode"! INSTEAD, simply include the string "[CLOCK:HH:MM]" anywhere in your question "text" (e.g., "What time is shown on the clock? [CLOCK:02:30]"). Our system will automatically detect this and render a mathematically perfect, beautiful analog clock diagram in its place!`;
      }

      // Fetch past questions to avoid repetition
      const pastQuestions = await fetchPastQuestions(formData.selectedClasses);
      if (pastQuestions.length > 0) {
        prompt += `\n\nCRITICAL: To prevent duplication and ensure academic variety, do NOT generate questions that are identical, highly similar, or test the exact same numbers/phrases as these past questions from recent assignments:\n` + 
          pastQuestions.slice(0, 15).map((q, idx) => `- "${q}"`).join('\n');
      }

      const tieredModel2 = getModelForGrade(formData.grade, formData.subject, activeModel);
      const textResponse = await generateContent({
        prompt,
        responseMimeType: 'application/json',
        provider: tieredModel2
      });

      const parsed = JSON.parse(textResponse);
      const questions = parsed.questions || parsed;
      const passage = parsed.passage || null;

      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("Invalid questions array returned from AI.");
      }

      // Pre-generate explanations once for all students (zero runtime AI at submission)
      const questionExplanations = await generateExplanations(questions, formData.subject, tieredModel2);

      // Save homeworks
      for (const classId of formData.selectedClasses) {
        const statusVal = formData.publishType === 'draft' 
          ? 'draft' 
          : (formData.publishType === 'publish_scheduled' ? 'scheduled' : 'published');

        const payload = {
          title,
          subject: formData.subject,
          instructions: `Complete this scheduled ${formData.subject} homework on ${formData.topic}. Built for ${formData.grade} (${formData.difficulty}) matching the ${curriculumName} standard. 🚀`,
          assignedClassId: classId,
          dueDate: formData.dueDate,
          time: formData.dueTime || '17:00',
          points: formData.points,
          passage: passage,
          questions: questions,
          questionExplanations,
          teacherId: user?.uid,
          teacherName: user?.displayName || 'Classroom Teacher',
          status: statusVal,
          type: formData.assignmentType || 'homework',
          assignType: formData.assignType,
          assignedStudentIds: formData.assignType === 'students' ? formData.assignedStudentIds : [],
          scheduledRelease: formData.publishType === 'publish_scheduled' ? {
            date: formData.releaseDate,
            time: formData.releaseTime
          } : null,
          metadata: {
            curriculum: formData.curriculum,
            curriculumName,
            grade: formData.grade,
            difficulty: formData.difficulty,
            topic: formData.topic,
            scheduledVia: 'Scheduler'
          },
          createdAt: serverTimestamp()
        };

        await addDoc(collection(db, 'homeworks'), payload);
      }

      alert(`Successfully generated and scheduled homework! 🎉`);
      
      // Reset topic and class selections
      setSelectedSkills([]);
      setFormData(prev => ({
        ...prev,
        topic: '',
        selectedClasses: activeClassroom?.id ? [activeClassroom.id] : [],
        recurrence: 'none',
        dueDateOffset: 7,
        assignType: 'all',
        assignedStudentIds: []
      }));

      // Refresh list
      fetchScheduledHistory();
      fetchRecurringSchedules();

      if (typeof onHomeworkScheduled === 'function') {
        onHomeworkScheduled();
      }
    } catch (err) {
      console.error("Scheduling generation failed:", err);
      alert("Oops! Failed to schedule homework generation. Please ensure your AI keys are valid and try again. ❌");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishDraft = async (id) => {
    try {
      const docRef = doc(db, 'homeworks', id);
      await updateDoc(docRef, { status: 'published', scheduledRelease: null });
      alert("Draft verified and published successfully! 🚀");
      fetchScheduledHistory();
      if (typeof onHomeworkScheduled === 'function') {
        onHomeworkScheduled();
      }
    } catch (err) {
      console.error("Publish draft error:", err);
      alert("Failed to publish draft homework.");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!(await window.confirmCustom("Are you sure you want to delete this scheduled/draft homework? 🗑️"))) return;
    try {
      await deleteDoc(doc(db, 'homeworks', id));
      alert("Deleted successfully!");
      fetchScheduledHistory();
      if (typeof onHomeworkScheduled === 'function') {
        onHomeworkScheduled();
      }
    } catch (err) {
      console.error("Delete homework error:", err);
      alert("Failed to delete homework.");
    }
  };

  return (
    <div className="w-full px-4 lg:px-8 max-w-[1600px] mx-auto font-nunito pb-16 space-y-12">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-black text-emerald-700 tracking-tight mb-2">Curriculum Scheduler</h1>
          <p className="text-xl text-slate-500 font-bold">Schedule AI-generated homework mapped to local country standards across classes.</p>
        </div>
        <div className="flex items-center gap-4 bg-green-50/50 border border-green-200 rounded-3xl p-4 shadow-sm">
          <span className="text-3xl">🗓️</span>
          <div>
            <h4 className="text-sm font-black text-emerald-950">AI Scheduler</h4>
            <p className="text-xs font-bold text-green-600">Autogenerates & schedules quizzes</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Config */}
        <div className="lg:col-span-8 bg-white border-4 border-emerald-100 rounded-[36px] p-6 lg:p-8 shadow-xl shadow-emerald-100/50 space-y-8">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-5">
            <Sparkles className="text-green-500 w-6 h-6 animate-pulse" />
            <h2 className="text-xl font-black text-emerald-700">Configure Curriculum Schedule</h2>
          </div>

          <form onSubmit={handleGenerateAndSchedule} className="space-y-6">
            
            {/* Subject Select */}
            <div className="space-y-2">
              <label className="text-sm font-black text-pink-500 uppercase tracking-wider block">1. Select Subject</label>
              <div className="grid grid-cols-3 gap-4">
                {dynamicSubjects.map(sub => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, subject: sub.id }))}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${
                      formData.subject === sub.id 
                        ? `${sub.borderColor} bg-white ring-4 ring-slate-50` 
                        : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                    }`}
                  >
                    <span className="text-3xl group-hover:scale-110 transition-transform">{sub.emoji}</span>
                    <span className={`text-sm font-black ${sub.color}`}>{sub.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Core Topic / Topic Instruction */}
            <div className="space-y-1.5">
              <label className="text-sm font-black text-blue-500 uppercase tracking-wider block">2. Homework Title / Topic</label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="e.g. Week 1 Practice, Water cycle, Past continuous tense..."
                  value={formData.topic}
                  onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                  className="flex-1 h-14 bg-slate-50 border border-slate-200 rounded-2xl px-5 text-base md:text-lg font-bold text-emerald-700 focus:outline-none focus:border-[#EA580C] focus:bg-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setIsCurriculumModalOpen(true)}
                  className="h-14 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-2xl flex items-center gap-2 text-sm transition-all shadow-md shrink-0"
                >
                  <BookOpen className="w-4 h-4" />
                  Browse
                </button>
              </div>
              {selectedSkills.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-bold">Selected Skills</span>
                    <button 
                      type="button"
                      onClick={() => {
                        setSelectedSkills([]);
                        setFormData(prev => ({ ...prev, topic: '' }));
                      }}
                      className="text-[10px] text-rose-500 font-bold hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((s, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs px-3 py-1.5 rounded-full">
                        {s.title}
                        <button type="button" onClick={() => {
                          const updated = selectedSkills.filter((_, idx) => idx !== i);
                          setSelectedSkills(updated);
                          if (updated.length > 0) {
                            setFormData(prev => ({ ...prev, topic: getSmartTopicTitle(updated) }));
                          } else {
                            setFormData(prev => ({ ...prev, topic: '' }));
                          }
                        }} className="text-indigo-400 hover:text-indigo-600 ml-0.5">✕</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Curriculum Alignment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-black text-purple-500 uppercase tracking-wider block">3. Curriculum Standard</label>
                <select
                  value={formData.curriculum}
                  onChange={(e) => setFormData(prev => ({ ...prev, curriculum: e.target.value }))}
                  className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-4 text-base md:text-lg font-bold text-emerald-700 focus:outline-none focus:border-[#EA580C] transition-all cursor-pointer"
                >
                  {CURRICULUMS.map(c => (
                    <option key={c.id} value={c.id}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-black text-amber-500 uppercase tracking-wider block">4. Target Grade</label>
                <div className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-4 flex items-center text-sm font-bold text-emerald-700">
                  <span>{formData.grade} (Derived from classroom name)</span>
                </div>
              </div>
            </div>

            {/* Difficulty & Question Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {formData.subject !== 'olympiad' ? (
                <div className="space-y-1.5">
                  <label className="text-sm font-black text-teal-500 uppercase tracking-wider block">5. Complexity</label>
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1.5 border border-slate-100 rounded-2xl">
                    {DIFFICULTIES.map(diff => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, difficulty: diff }))}
                        className={`py-2 rounded-xl text-sm font-black transition-all ${
                          formData.difficulty === diff 
                            ? 'bg-[#EA580C] text-white shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-sm font-black text-teal-500 uppercase tracking-wider block">5. Complexity</label>
                  <div className="w-full h-11 bg-slate-50 border border-slate-200 rounded-2xl px-4 flex items-center text-sm font-bold text-[#EA580C]">
                    <span>Olympiad (Inherently Hard)</span>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-black text-rose-500 uppercase tracking-wider block">6. Quiz Length</label>
                  <span className="text-sm font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg">{formData.questionCount} Qs</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="100"
                  value={formData.questionCount}
                  onChange={(e) => setFormData(prev => ({ ...prev, questionCount: parseInt(e.target.value, 10) }))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#EA580C]"
                />
              </div>
            </div>

            {/* Task Type */}
            <div className="space-y-2 border-t border-slate-50 pt-5">
              <label className="text-sm font-black text-rose-500 uppercase tracking-wider block">7. Task Type</label>
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 border border-slate-200 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, assignmentType: 'homework' }))}
                  className={`py-2 px-4 rounded-xl text-sm font-bold transition-all ${formData.assignmentType === 'homework' ? 'bg-[#EA580C] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  📝 Homework
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, assignmentType: 'test' }))}
                  className={`py-2 px-4 rounded-xl text-sm font-bold transition-all ${formData.assignmentType === 'test' ? 'bg-[#EA580C] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  🎯 Test / Quiz
                </button>
              </div>
            </div>

            {/* Class Target Selection */}
            <div className="space-y-2 border-t border-slate-50 pt-5">
              <label className="text-sm font-black text-fuchsia-500 uppercase tracking-wider block">8. Assigned Classroom</label>
              <div className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-4 flex items-center gap-3 text-sm font-bold text-emerald-700">
                <span>🏫 {activeClassroom?.name || 'No class selected (Please select at the top)'}</span>
              </div>
            </div>

            {activeClassroom && (
              <div className="space-y-2">
                <label className="text-sm font-black text-violet-500 uppercase tracking-wider block">Assign Target</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 border border-slate-200 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, assignType: 'all', assignedStudentIds: [] }))}
                    className={`py-2 px-4 rounded-xl text-sm font-bold transition-all ${formData.assignType === 'all' ? 'bg-[#EA580C] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Whole Class
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, assignType: 'students' }))}
                    className={`py-2 px-4 rounded-xl text-sm font-bold transition-all ${formData.assignType === 'students' ? 'bg-[#EA580C] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Specific Students
                  </button>
                </div>
              </div>
            )}

            {formData.assignType === 'students' && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                <label className="text-sm font-black text-cyan-500 uppercase tracking-wider block">Select Students <span className="text-rose-500">*</span></label>
                
                {/* Search Bar */}
                <div className="relative mb-3">
                  <Search className="absolute left-4 top-4.5 w-5 h-5 text-slate-400 z-10" />
                  <input
                    type="text"
                    placeholder="Search student name..."
                    value={studentSearchQuery}
                    onChange={(e) => setStudentSearchQuery(e.target.value)}
                    className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-10 text-slate-700 font-bold outline-none focus:border-green-400 appearance-none"
                  />
                </div>

                {/* Bulk Actions */}
                <div className="flex justify-between items-center px-1 mb-2">
                  <span className="text-sm font-bold text-slate-500">
                    {formData.assignedStudentIds.length} of {students.length} selected
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const allIds = students.map(s => s.id);
                        setFormData(prev => ({ ...prev, assignedStudentIds: allIds }));
                      }}
                      className="text-sm font-bold text-[#EA580C] hover:underline"
                    >
                      Select All
                    </button>
                    <span className="text-xs text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, assignedStudentIds: [] }));
                      }}
                      className="text-sm font-bold text-slate-500 hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Student Pills Grid */}
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border border-slate-100 rounded-2xl bg-slate-50/30 custom-scrollbar">
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

            {/* Date Configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-50 pt-5">
              {formData.recurrence !== 'none' ? (
                <div className="space-y-1.5">
                  <label className="text-sm font-black text-orange-500 uppercase tracking-wider block">Days to Complete</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-4 w-4 h-4 text-orange-400 z-10" />
                    <select
                      value={formData.dueDateOffset}
                      onChange={(e) => setFormData(prev => ({ ...prev, dueDateOffset: parseInt(e.target.value, 10) }))}
                      className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-10 text-xs font-bold text-emerald-700 focus:outline-none focus:border-[#EA580C] transition-all cursor-pointer appearance-none"
                    >
                      <option value="1">1 Day</option>
                      <option value="2">2 Days</option>
                      <option value="3">3 Days</option>
                      <option value="4">4 Days</option>
                      <option value="5">5 Days</option>
                      <option value="6">6 Days</option>
                      <option value="7">7 Days (1 Week)</option>
                      <option value="10">10 Days</option>
                      <option value="14">14 Days (2 Weeks)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-sm font-black text-orange-500 uppercase tracking-wider block">Due Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-4 w-4 h-4 text-orange-400" />
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-xs font-bold text-emerald-700 focus:outline-none focus:border-[#EA580C] transition-all"
                      required={formData.recurrence === 'none'}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-black text-lime-600 uppercase tracking-wider block">Due Time</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-4 w-4 h-4 text-orange-400" />
                  <input
                    type="time"
                    value={formData.dueTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueTime: e.target.value }))}
                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-xs font-bold text-emerald-700 focus:outline-none focus:border-[#EA580C] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Unified Schedule & Release Settings Section */}
            <div className="space-y-6 border-t border-slate-50 pt-5">
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6 text-emerald-500" />
                <h3 className="text-xl font-black text-emerald-600">8. Schedule & Release Settings</h3>
              </div>

              {/* Step A: Frequency / Recurrence Selection */}
              <div className="space-y-2">
                <label className="text-sm font-black text-emerald-500 uppercase tracking-wider block">Select Recurrence Frequency</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => handleRecurrenceChange('none')}
                    className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition-all ${
                      formData.recurrence === 'none'
                        ? 'border-[#EA580C] bg-[#EA580C]/5 text-emerald-900'
                        : 'border-2 border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex-center shrink-0 mt-0.5 ${formData.recurrence === 'none' ? 'bg-[#EA580C] border-[#EA580C] text-white' : 'border-slate-300'}`}>
                      {formData.recurrence === 'none' && <Check size={12} strokeWidth={4} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-emerald-700">One-Time</h4>
                      <p className="text-xs text-slate-500 font-bold mt-1 leading-normal">Create this assignment only once.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRecurrenceChange('daily')}
                    className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition-all ${
                      formData.recurrence === 'daily'
                        ? 'border-[#EA580C] bg-[#EA580C]/5 text-emerald-900'
                        : 'border-2 border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex-center shrink-0 mt-0.5 ${formData.recurrence === 'daily' ? 'bg-[#EA580C] border-[#EA580C] text-white' : 'border-slate-300'}`}>
                      {formData.recurrence === 'daily' && <Check size={12} strokeWidth={4} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-emerald-700">Daily Auto</h4>
                      <p className="text-xs text-slate-500 font-bold mt-1 leading-normal">Automatically generate this homework once every day.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRecurrenceChange('weekly')}
                    className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition-all ${
                      formData.recurrence === 'weekly'
                        ? 'border-[#EA580C] bg-[#EA580C]/5 text-emerald-900'
                        : 'border-2 border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex-center shrink-0 mt-0.5 ${formData.recurrence === 'weekly' ? 'bg-[#EA580C] border-[#EA580C] text-white' : 'border-slate-300'}`}>
                      {formData.recurrence === 'weekly' && <Check size={12} strokeWidth={4} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-emerald-700">Weekly Auto</h4>
                      <p className="text-xs text-slate-500 font-bold mt-1 leading-normal">Automatically generate this homework once every week.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRecurrenceChange('monthly')}
                    className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition-all ${
                      formData.recurrence === 'monthly'
                        ? 'border-[#EA580C] bg-[#EA580C]/5 text-emerald-900'
                        : 'border-2 border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex-center shrink-0 mt-0.5 ${formData.recurrence === 'monthly' ? 'bg-[#EA580C] border-[#EA580C] text-white' : 'border-slate-300'}`}>
                      {formData.recurrence === 'monthly' && <Check size={12} strokeWidth={4} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-emerald-700">Monthly Auto</h4>
                      <p className="text-xs text-slate-500 font-bold mt-1 leading-normal">Automatically generate this homework once every month.</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Step B: Execution Date/Time Details */}
              <div className="space-y-2">
                <label className="text-sm font-black text-sky-500 uppercase tracking-wider block">Configure Release Time</label>
                
                {formData.recurrence === 'none' ? (
                  /* One-Time Date & Time Selection */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">Scheduled Release Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-4 w-4 h-4 text-green-400" />
                        <input
                          type="date"
                          value={formData.releaseDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, releaseDate: e.target.value }))}
                          className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-sm font-bold text-emerald-700 focus:outline-none focus:border-[#EA580C] transition-all"
                          required={formData.recurrence === 'none'}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">Scheduled Release Time</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-4 w-4 h-4 text-green-400" />
                        <input
                          type="time"
                          value={formData.releaseTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, releaseTime: e.target.value }))}
                          className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-sm font-bold text-emerald-700 focus:outline-none focus:border-[#EA580C] transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Recurring Execution Settings */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">Preferred Release Time</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-4 w-4 h-4 text-green-400" />
                        <input
                          type="time"
                          value={formData.releaseTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, releaseTime: e.target.value }))}
                          className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-sm font-bold text-emerald-700 focus:outline-none focus:border-[#EA580C] transition-all"
                          required
                        />
                      </div>
                      <p className="text-[9px] text-orange-500 font-bold mt-1">
                        ✨ Generated homework will release automatically at this preferred time on its scheduled run.
                      </p>
                    </div>

                    {formData.recurrence === 'weekly' && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">Target Day of Week</label>
                        <div className="relative">
                          <select
                            value={formData.recurrenceDay}
                            onChange={(e) => setFormData(prev => ({ ...prev, recurrenceDay: e.target.value }))}
                            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 text-sm font-bold text-emerald-700 focus:outline-none focus:border-[#EA580C] transition-all cursor-pointer appearance-none"
                          >
                            <option value="1">Monday 📅</option>
                            <option value="2">Tuesday 📅</option>
                            <option value="3">Wednesday 📅</option>
                            <option value="4">Thursday 📅</option>
                            <option value="5">Friday 📅</option>
                            <option value="6">Saturday 📅</option>
                            <option value="0">Sunday 📅</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.recurrence === 'monthly' && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider block">Target Day of Month</label>
                        <div className="relative">
                          <select
                            value={formData.recurrenceDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, recurrenceDate: e.target.value }))}
                            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 text-sm font-bold text-emerald-700 focus:outline-none focus:border-[#EA580C] transition-all cursor-pointer appearance-none"
                          >
                            {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                              <option key={day} value={day}>Day {day} 📅</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Step C: Action/Policy on execution */}
              <div className="space-y-2">
                <label className="text-sm font-black text-violet-500 uppercase tracking-wider block">Release Action (At Scheduled Time)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handlePublishTypeChange('draft')}
                    className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition-all ${
                      formData.publishType === 'draft'
                        ? 'border-[#EA580C] bg-[#EA580C]/5 text-emerald-900'
                        : 'border-2 border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex-center shrink-0 mt-0.5 ${formData.publishType === 'draft' ? 'bg-[#EA580C] border-[#EA580C] text-white' : 'border-slate-300'}`}>
                      {formData.publishType === 'draft' && <Check size={12} strokeWidth={4} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-emerald-700">Save in Draft</h4>
                      <p className="text-xs text-slate-500 font-bold mt-1 leading-normal">Requires your manual verification before students can view it.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePublishTypeChange('publish')}
                    className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition-all ${
                      formData.publishType === 'publish_now' || formData.publishType === 'publish_scheduled'
                        ? 'border-[#EA580C] bg-[#EA580C]/5 text-emerald-900'
                        : 'border-2 border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex-center shrink-0 mt-0.5 ${formData.publishType === 'publish_now' || formData.publishType === 'publish_scheduled' ? 'bg-[#EA580C] border-[#EA580C] text-white' : 'border-slate-300'}`}>
                      {(formData.publishType === 'publish_now' || formData.publishType === 'publish_scheduled') && <Check size={12} strokeWidth={4} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-emerald-700">Directly Publish</h4>
                      <p className="text-xs text-slate-500 font-bold mt-1 leading-normal">Instantly releases the homework quiz to the student portals.</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full h-16 bg-[#2ecc71] hover:bg-[#27ae60] text-white text-sm font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-green-100/50 flex-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    AI Generating & Scheduling...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {formData.recurrence !== 'none' 
                      ? 'Create Recurring Automation 🤖' 
                      : formData.publishType === 'draft' 
                        ? 'Generate & Save Drafts 📝' 
                        : formData.publishType === 'publish_scheduled'
                          ? 'Generate & Schedule Release ⏰'
                          : 'Generate & Publish Instantly 🚀'}
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Right Queue List: Drafts/Scheduled & Automations */}
        <div className="lg:col-span-4 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-emerald-700">Scheduled & Drafts</h3>
              <span className="text-sm font-black text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
                {scheduledItems.filter(i => i.status === 'draft' || i.status === 'scheduled').length} Items
              </span>
            </div>

            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
              {isLoadingHistory ? (
                <div className="p-12 text-center text-slate-400 font-bold text-sm">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3" />
                  Loading your scheduler records...
                </div>
              ) : scheduledItems.filter(i => i.status === 'draft' || i.status === 'scheduled').length === 0 ? (
                <div className="border-2 border-dashed border-slate-100 rounded-[32px] p-10 text-center text-slate-400 space-y-3 bg-slate-50/20">
                  <FileText className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="font-bold text-xs">No scheduled items found.</p>
                  <p className="text-[10px] leading-normal font-medium text-slate-400">Configure the form on the left to auto-build and schedule multiple classroom assignments.</p>
                </div>
              ) : (
                scheduledItems.filter(i => i.status === 'draft' || i.status === 'scheduled').map(item => {
                  const isExpanded = expandedId === item.id;
                  const isDraft = item.status === 'draft';
                  const isScheduled = item.status === 'scheduled';
                  const classroom = classrooms.find(c => c.id === item.assignedClassId);
                  const classLabel = classroom ? classroom.name : 'All Classes';
                  const curriculumCode = item.metadata?.curriculum || 'acara';
                  const flag = CURRICULUMS.find(c => c.id === curriculumCode)?.flag || '🇦🇺';

                  return (
                    <div 
                      key={item.id}
                      className={`bg-white border rounded-3xl transition-all ${
                        isExpanded 
                          ? 'border-orange-200 shadow-lg ring-4 ring-orange-50/30' 
                          : 'border-2 border-slate-200 shadow-sm hover:border-slate-300'
                      }`}
                    >
                      <div className="p-5 flex flex-col gap-3">
                        {/* Top Row: Meta flags & Status */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{flag}</span>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">{item.metadata?.curriculumName || 'ACARA'}</span>
                          </div>
                          <span className={`text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            isDraft 
                              ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                              : isScheduled
                                ? 'bg-green-50 text-green-600 border border-green-200'
                                : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          }`}>
                            {item.status}
                          </span>
                        </div>

                        {/* Info body */}
                        <div>
                          <h4 className="text-base font-black text-emerald-800 line-clamp-1">{item.title}</h4>
                          <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Class: {classLabel}</p>
                          {item.assignType === 'students' && item.assignedStudentIds && item.assignedStudentIds.length > 0 && (
                            <p className="text-xs font-bold text-blue-600 mt-0.5 flex items-center gap-1" title={item.assignedStudentIds.map(id => id.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')).join(', ')}>
                              <User className="w-4 h-4" /> Students: {item.assignedStudentIds.length}
                            </p>
                          )}
                          {item.assignType === 'student' && item.assignedStudentId && (
                            <p className="text-xs font-bold text-blue-600 mt-0.5 flex items-center gap-1">
                              <User className="w-4 h-4" /> Student: {item.assignedStudentId.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}
                            </p>
                          )}
                          {isScheduled && item.scheduledRelease && (
                            <p className="text-xs font-bold text-green-600 mt-0.5">
                              ⏰ Releases: {item.scheduledRelease.date} at {item.scheduledRelease.time}
                            </p>
                          )}
                        </div>

                        {/* Stats pill & details */}
                        <div className="flex items-center justify-between text-sm font-bold text-slate-400 pt-3 border-t border-slate-50">
                          <span>Due: {item.dueDate}</span>
                          <div className="flex gap-2">
                            <span className="bg-slate-50 text-slate-500 px-3 py-1 rounded-lg text-xs font-black">{item.metadata?.difficulty || 'Medium'}</span>
                            <span className="bg-slate-50 text-slate-500 px-3 py-1 rounded-lg text-xs font-black">{item.questions?.length || 0} Qs</span>
                          </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-50/60 mt-1">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : item.id)}
                            className="text-sm font-black text-[#EA580C] hover:underline flex items-center gap-1.5"
                          >
                            {isExpanded ? (
                              <>Hide Questions <ChevronUp size={16} /></>
                            ) : (
                              <>Preview Quiz <ChevronDown size={16} /></>
                            )}
                          </button>

                          <div className="flex items-center gap-2">
                            {(isDraft || isScheduled) && (
                              <button
                                onClick={() => handlePublishDraft(item.id)}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-black px-4 py-2 rounded-xl shadow-sm transition-all"
                              >
                                {isDraft ? 'Verify & Publish' : 'Release Now'}
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Question accordion preview */}
                      {isExpanded && item.questions && (
                        <div className="border-t border-slate-50 bg-slate-50/30 p-5 rounded-b-3xl space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                          {item.questions.map((q, idx) => (
                            <div key={idx} className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-sm text-left">
                              <p className="text-xs font-black text-emerald-800 mb-2">Q{idx + 1}. {q.text}</p>
                              <div className="grid grid-cols-2 gap-2">
                                {q.options.map((opt, i) => (
                                  <div key={i} className={`p-2 rounded-lg text-[9px] font-bold border ${opt === q.answer ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50/50 border-slate-100 text-slate-500'}`}>
                                    {opt}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Active Automations section */}
          <div className="space-y-6 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-emerald-700">Active Automations (Recurring)</h3>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                {recurringItems.length} Active
              </span>
            </div>

            {(() => {
              const activeAutomationSubjects = ['All', ...new Set(recurringItems.map(item => item.subject))].map(sub => {
                if (sub === 'All') return { id: 'All', name: 'All Subjects', emoji: '📋' };
                const found = dynamicSubjects.find(s => s.id === sub);
                return found || { id: sub, name: sub, emoji: '📚' };
              });
              
              const filteredRecurringItems = activeAutomationTab === 'All' 
                ? recurringItems 
                : recurringItems.filter(item => item.subject === activeAutomationTab);

              return (
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {recurringItems.length > 0 && activeAutomationSubjects.length > 2 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar shrink-0">
                      {activeAutomationSubjects.map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => setActiveAutomationTab(sub.id)}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors ${activeAutomationTab === sub.id ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                          {sub.emoji} {sub.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {recurringItems.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-100 rounded-[32px] p-8 text-center text-slate-400 space-y-2 bg-slate-50/10">
                      <Calendar className="w-6 h-6 mx-auto text-slate-300" />
                      <p className="font-bold text-[11px]">No recurring automations.</p>
                      <p className="text-[9px] font-medium text-slate-400">Select Daily or Weekly recurrence under Automation setting to run auto-generations.</p>
                    </div>
                  ) : filteredRecurringItems.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 font-bold text-sm">No automations found for this subject.</div>
                  ) : (
                    filteredRecurringItems.map(sched => {
                  const subObj = dynamicSubjects.find(s => s.id === sched.subject);
                  
                  const formatTime12h = (timeStr) => {
                    if (!timeStr) return '08:00 AM';
                    const parts = timeStr.split(':');
                    const hrs = parseInt(parts[0], 10);
                    const mins = parts[1] || '00';
                    const ampm = hrs >= 12 ? 'PM' : 'AM';
                    const displayHrs = hrs % 12 || 12;
                    return `${displayHrs.toString().padStart(2, '0')}:${mins} ${ampm}`;
                  };
                  
                  const formattedTime = formatTime12h(sched.releaseTime);
                  
                  return (
                    <div key={sched.id} className={`bg-white border-2 rounded-3xl p-5 shadow-sm transition-all ${sched.isActive === false ? 'border-slate-200 opacity-60 grayscale-[0.5]' : 'border-emerald-100 hover:border-emerald-300'}`}>
                      {editingAutomationId === sched.id ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 mb-2">
                             <span className="text-sm">{subObj?.emoji || '📚'}</span>
                             <h4 className="text-xs font-black text-emerald-800 line-clamp-1">Edit {sched.topic} Schedule</h4>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-black text-slate-500 uppercase">Time</label>
                              <input
                                type="time"
                                value={editForm.releaseTime || ''}
                                onChange={e => setEditForm(prev => ({ ...prev, releaseTime: e.target.value }))}
                                className="w-full h-8 bg-slate-50 border border-slate-200 rounded-lg px-2 text-xs font-bold text-emerald-700 focus:outline-none focus:border-[#EA580C]"
                              />
                            </div>
                            
                            <div className="space-y-1">
                              <label className="text-[10px] font-black text-slate-500 uppercase">Type</label>
                              <select
                                value={editForm.assignmentType || 'homework'}
                                onChange={e => setEditForm(prev => ({ ...prev, assignmentType: e.target.value }))}
                                className="w-full h-8 bg-slate-50 border border-slate-200 rounded-lg px-2 text-xs font-bold text-emerald-700 focus:outline-none focus:border-[#EA580C]"
                              >
                                <option value="homework">📝 Homework</option>
                                <option value="test">🎯 Test / Quiz</option>
                              </select>
                            </div>
                            
                            {sched.recurrence === 'weekly' && (
                              <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase">Day of Week</label>
                                <select
                                  value={editForm.recurrenceDay || ''}
                                  onChange={e => setEditForm(prev => ({ ...prev, recurrenceDay: e.target.value }))}
                                  className="w-full h-8 bg-slate-50 border border-slate-200 rounded-lg px-2 text-xs font-bold text-emerald-700 focus:outline-none focus:border-[#EA580C]"
                                >
                                  <option value="1">Monday</option>
                                  <option value="2">Tuesday</option>
                                  <option value="3">Wednesday</option>
                                  <option value="4">Thursday</option>
                                  <option value="5">Friday</option>
                                  <option value="6">Saturday</option>
                                  <option value="0">Sunday</option>
                                </select>
                              </div>
                            )}

                            {sched.recurrence === 'monthly' && (
                              <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase">Day of Month</label>
                                <select
                                  value={editForm.recurrenceDate || ''}
                                  onChange={e => setEditForm(prev => ({ ...prev, recurrenceDate: e.target.value }))}
                                  className="w-full h-8 bg-slate-50 border border-slate-200 rounded-lg px-2 text-xs font-bold text-emerald-700 focus:outline-none focus:border-[#EA580C]"
                                >
                                  {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                                    <option key={day} value={day}>Day {day}</option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              onClick={() => {
                                setEditingAutomationId(null);
                                setEditForm({});
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveAutomationEdit(sched.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#EA580C] text-white flex items-center gap-1 hover:bg-[#c2410c]"
                            >
                              <Save size={12} /> Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                               <span className="text-sm">{subObj?.emoji || '📚'}</span>
                               <h4 className="text-xs font-black text-emerald-800 line-clamp-1 flex items-center gap-2">
                                 {sched.topic} {sched.isActive === false && <span className="text-amber-500 ml-1">(Paused)</span>}
                                 <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider ${sched.type === 'test' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>
                                   {sched.type === 'test' ? 'Test' : 'Homework'}
                                 </span>
                               </h4>
                            </div>
                            {sched.assignType === 'students' && sched.assignedStudentIds && sched.assignedStudentIds.length > 0 && (
                              <div className="text-[10.5px] font-bold text-blue-600 flex items-center gap-1" title={sched.assignedStudentIds.map(id => id.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')).join(', ')}>
                                <User className="w-3.5 h-3.5" /> Students: {sched.assignedStudentIds.length}
                              </div>
                            )}
                            {sched.assignType === 'student' && sched.assignedStudentId && (
                              <div className="text-[10.5px] font-bold text-blue-600 flex items-center gap-1">
                                <User className="w-3.5 h-3.5" /> Student: {sched.assignedStudentId.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}
                              </div>
                            )}
                            
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50/50 text-[#EA580C] text-[9px] font-bold border border-[#EA580C]/10">
                                <Clock size={10} className="shrink-0" />
                                {formattedTime}
                              </span>
                              <span className="text-[10px] text-slate-500 font-bold">
                                {sched.recurrence === 'daily' 
                                  ? 'Daily' 
                                  : sched.recurrence === 'monthly'
                                    ? `Monthly on Day ${sched.recurrenceDate || '1'}`
                                    : `Weekly on ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][parseInt(sched.recurrenceDay, 10)]}`}
                              </span>
                              <span className="text-slate-300 text-[10px] font-bold">•</span>
                              <span className="text-[10px] text-slate-500 font-bold">{sched.grade} ({sched.difficulty})</span>
                            </div>

                            <p className="text-[9px] text-[#EA580C] font-black uppercase pt-0.5">
                              Curriculum: {sched.curriculumName || 'ACARA'}
                            </p>
                          </div>

                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => {
                                setEditingAutomationId(sched.id);
                                setEditForm({
                                  releaseTime: sched.releaseTime || '08:00',
                                  assignmentType: sched.type || 'homework',
                                  recurrenceDay: sched.recurrenceDay || '1',
                                  recurrenceDate: sched.recurrenceDate || '1'
                                });
                              }}
                              className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                              title="Edit Automation Schedule"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  const newStatus = !(sched.isActive ?? true);
                                  await updateDoc(doc(db, 'recurring_schedules', sched.id), { isActive: newStatus });
                                  fetchRecurringSchedules();
                                } catch (err) {
                                  console.error("Error toggling automation:", err);
                                  alert("Oops! Could not update automation status.");
                                }
                              }}
                              className={`p-2 rounded-xl transition-all ${sched.isActive !== false ? 'text-amber-500 hover:bg-amber-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                              title={sched.isActive !== false ? "Pause Automation" : "Resume Automation"}
                            >
                              {sched.isActive !== false ? <Pause size={13} /> : <Play size={13} />}
                            </button>
                            <button
                              onClick={async () => {
                                if (await window.confirmCustom("Delete this recurring homework automation? 🗑️")) {
                                  await deleteDoc(doc(db, 'recurring_schedules', sched.id));
                                  alert("Deleted automation schedule!");
                                  fetchRecurringSchedules();
                                }
                              }}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                              title="Delete Automation"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            );
            })()}
          </div>
        </div>
      </div>
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 border-2 border-orange-100 shadow-2xl text-center relative animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-orange-600 animate-bounce" />
            </div>
            <h3 className="text-2xl font-black text-emerald-800 mb-2">Upgrade Required! 🚀</h3>
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
      {isCurriculumModalOpen && (
        <CurriculumModal
          isOpen={isCurriculumModalOpen}
          onClose={() => {
            setIsCurriculumModalOpen(false);
            if (selectedSkills.length > 0) {
              setFormData(prev => ({ ...prev, topic: getSmartTopicTitle(selectedSkills) }));
            }
          }}
          curriculumData={curriculum[formData.grade]?.[(formData.subject?.toLowerCase().replace('_', ' ') === 'logical reasoning') ? 'Logical Reasoning' : (formData.subject.charAt(0).toUpperCase() + formData.subject.slice(1))] || []}
          selectedSkills={selectedSkills}
          setSelectedSkills={(updaterFnOrValue) => {
            const updated = typeof updaterFnOrValue === 'function' ? updaterFnOrValue(selectedSkills) : updaterFnOrValue;
            setSelectedSkills(updated);
            if (updated.length > 0) {
              setFormData(prev => ({ ...prev, topic: getSmartTopicTitle(updated) }));
            } else {
              setFormData(prev => ({ ...prev, topic: '' }));
            }
          }}
        />
      )}
    </div>
  );
}
