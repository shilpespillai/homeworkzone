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
  ChevronLeft,
  ChevronRight,
  Star,
  Wand2,
  MoreVertical,
  Home,
  Users,
  User,
  MessageSquare,
  BarChart as BarChartIcon,
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
  Loader2,
  Save,
  CheckCircle,
  DollarSign,
  PauseCircle,
  PlayCircle,
  Mail,
  Globe,
  FlaskConical,
  Code,
  Coins,
  RotateCcw,
  Sparkles,
  Rocket,
  Terminal,
  Key} from 'lucide-react';
import EmojiPicker from '../components/EmojiPicker';
import { calcOptionCAnnual, fetchPricing, savePricing } from '../utils/pricingConfig';

import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_SUBJECT_PROMPTS, getPremiumPromptTemplate, getMasterDefaultPrompts, saveMasterDefaultPromptsIfAdmin } from '../utils/defaultPrompts';
import { db } from '../firebase';
import { checkCanGeneratePaper } from '../utils/quotaManager';
import SystemLogsTab from '../components/admin/SystemLogsTab';
import { collection, doc, getDoc, setDoc, getDocs, query, orderBy, deleteDoc, where, onSnapshot, addDoc, collectionGroup, updateDoc, limit, getDocsFromServer, increment } from 'firebase/firestore';
import HomeworkGenerator from './HomeworkGenerator';
import HomeworkScheduler from './HomeworkScheduler';
import TestReportsDashboard from '../components/TestReportsDashboard';
import AgenticHelpAssistant from '../components/AgenticHelpAssistant';
import TeacherQuickStartLaunchpad from '../components/teacher/TeacherQuickStartLaunchpad';
import InternationalExamHubView from '../components/InternationalExamHubView';
import { encryptText, decryptText } from '../utils/crypto';
import { fetchWithRetry, generateContent } from '../utils/aiClient';
import { checkIsCorrect } from '../utils/checkIsCorrect';
import { SUPER_USER_EMAILS } from '../utils/defaultPrompts';
import { DEFAULT_ZONO_KNOWLEDGE } from '../utils/defaultZonoKnowledge';

const toTitleCase = (str) => {
  if (!str) return '';
  return str
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const normalizeName = (name) => (name || '').trim().toLowerCase().replace(/\s+/g, ' ');

const checkIsAnswerCorrect = (studentSelection, actualAnswer) => {
  if (studentSelection === undefined || studentSelection === null || actualAnswer === undefined || actualAnswer === null) return false;
  if (studentSelection === actualAnswer) return true;

  const strSel = Array.isArray(studentSelection) ? studentSelection.join(', ') : String(studentSelection).trim();
  const strAns = Array.isArray(actualAnswer) ? actualAnswer.join(', ') : String(actualAnswer).trim();

  if (strSel === strAns) return true;

  // Clean trailing bracketed translations e.g. "à¤²à¤¾à¤² (red)" -> "à¤²à¤¾à¤²"
  const cleanSel = strSel.replace(/\s*\([A-Za-z\s,-]+\)$/, '').trim().toLowerCase();
  const cleanAns = strAns.replace(/\s*\([A-Za-z\s,-]+\)$/, '').trim().toLowerCase();

  return cleanSel === cleanAns;
};

const mapToUmbrellaCategory = (subtopic = '', subject = '', hw = {}, q = {}) => {
  const t = (subtopic || '').toLowerCase().trim();
  const s = (subject || hw?.subject || '').toLowerCase().trim();
  const qCat = (q?.category || hw?.category || '').replace(/^[A-Z]{1,2}\.	*/, '').replace(/^[0-9]+\.\s*/, '').trim();

  // If question or homework already has an explicit valid category
  if (qCat && qCat.length > 2 && !qCat.toLowerCase().includes('quiz') && !qCat.toLowerCase().includes('test') && !qCat.toLowerCase().includes('mission')) {
    return qCat;
  }

  // --- MATHEMATICS MAIN HEADER TOPICS ---
  if (t.includes('fraction') && (t.includes('decimal') || t.includes('relate') || t.includes('convert'))) {
    return 'Relate fractions and decimals';
  }
  if (t.includes('fraction') || t.includes('numerator') || t.includes('denominator') || t.includes('mixed number') || t.includes('simplif') || t.includes('improper')) {
    return 'Fractions and mixed numbers';
  }
  if (t.includes('decimal') || t.includes('tenths') || t.includes('hundredths') || t.includes('thousandths')) {
    return 'Decimals';
  }
  if (t.includes('percent') || t.includes('percentage') || t.includes('ratio') || t.includes('proportion')) {
    return 'Percents and ratios';
  }
  if (t.includes('multiplication') || t.includes('multiply') || t.includes('times') || t.includes('product') || t.includes('factor') || t.includes('multiple') || t.includes('lcm') || t.includes('hcf') || t.includes('prime')) {
    return 'Multiplication';
  }
  if (t.includes('division') || t.includes('divide') || t.includes('quotient') || t.includes('remainder') || t.includes('divisib')) {
    return 'Division';
  }
  if (t.includes('addition') || t.includes('subtraction') || t.includes('add ') || t.includes('subtract') || t.includes('sum') || t.includes('difference') || t.includes('regroup') || t.includes('plus') || t.includes('minus')) {
    return 'Addition and subtraction';
  }
  if (t.includes('compare number') || t.includes('comparing and ordering') || t.includes('order number') || t.includes('put numbers in order') || t.includes('greater than') || t.includes('less than') || t.includes('ordering')) {
    return 'Comparing and ordering';
  }
  if (t.includes('even and odd') || t.includes('even or odd')) {
    return 'Even and odd';
  }
  if (t.includes('place value') || t.includes('number sense') || t.includes('roman numeral') || t.includes('rounding') || t.includes('words to digits') || t.includes('digits to words') || t.includes('place values') || t.includes('value of digit') || t.includes('whole number')) {
    return 'Place value and number sense';
  }
  if (t.includes('money') || t.includes('currency') || t.includes('coin') || t.includes('dollar') || t.includes('cent') || t.includes('cost') || t.includes('price') || t.includes('financial')) {
    return 'Money';
  }
  if (t.includes('time') || t.includes('clock') || t.includes('elapsed') || t.includes('calendar') || t.includes('duration') || t.includes('hour') || t.includes('minute') || t.includes('second')) {
    return 'Time and clock';
  }
  if (t.includes('geometry') || t.includes('shape') || t.includes('angle') || t.includes('triangle') || t.includes('quadrilateral') || t.includes('polygon') || t.includes('symmetry') || t.includes('transformation') || t.includes('circle') || t.includes('2d') || t.includes('3d') || t.includes('three-dimensional') || t.includes('two-dimensional')) {
    return 'Geometry and shapes';
  }
  if (t.includes('measurement') || t.includes('measuring') || t.includes('perimeter') || t.includes('area') || t.includes('volume') || t.includes('length') || t.includes('mass') || t.includes('weight') || t.includes('capacity') || t.includes('unit') || t.includes('metric') || t.includes('ruler')) {
    return 'Measurement, area and perimeter';
  }
  if (t.includes('data') || t.includes('graph') || t.includes('chart') || t.includes('plot') || t.includes('tally') || t.includes('table') || t.includes('venn') || t.includes('statistic') || t.includes('probability')) {
    return 'Data, graphs and probability';
  }
  if (t.includes('algebra') || t.includes('equation') || t.includes('variable') || t.includes('expression') || t.includes('pattern') || t.includes('sequence') || t.includes('series')) {
    return 'Patterns and sequences';
  }

  // --- ENGLISH / LITERACY MAIN HEADER TOPICS ---
  // 1. Vocabulary & Word Structure (Captures word meanings, definitions, synonyms, quotes like 'Glimmered', 'Cautious', 'Vast')
  if (
    t.includes('vocab') || 
    t.includes('word') || 
    t.includes('meaning') || 
    t.includes('definition') || 
    t.includes('synonym') || 
    t.includes('antonym') || 
    t.includes('prefix') || 
    t.includes('suffix') || 
    t.includes('root') || 
    t.includes('idiom') || 
    t.includes('shades of meaning') || 
    t.includes('context clue') ||
    t.includes("applying '") ||
    t.includes("understanding '") ||
    t.includes("meaning of '") ||
    t.includes("definition of '") ||
    (t.includes("'") && !t.includes('apostrophe') && !t.includes('contraction'))
  ) {
    return 'Vocabulary and word structure';
  }

  // 2. Spelling & Phonics
  if (t.includes('spelling') || t.includes('phonics') || t.includes('vowel') || t.includes('consonant') || t.includes('syllable') || t.includes('homophone') || t.includes('silent e') || t.includes('blend') || t.includes('digraph') || t.includes('rhym')) {
    return 'Spelling and phonics';
  }

  // 3. Grammar & Conventions
  if (t.includes('grammar') || t.includes('punctuation') || t.includes('noun') || t.includes('verb') || t.includes('adjective') || t.includes('adverb') || t.includes('pronoun') || t.includes('preposition') || t.includes('conjunction') || t.includes('clause') || t.includes('predicate') || t.includes('subject-verb') || t.includes('comma') || t.includes('apostrophe') || t.includes('capital') || t.includes('sentence') || t.includes('semicolon') || t.includes('colon') || t.includes('tense') || t.includes('contraction')) {
    return 'Grammar and conventions';
  }

  // 4. Reading Comprehension
  if (t.includes('reading') || t.includes('comprehension') || t.includes('passage') || t.includes('text') || t.includes('main idea') || t.includes('inference') || t.includes('theme') || t.includes('author') || t.includes('point of view') || t.includes('fact vs opinion')) {
    return 'Reading comprehension';
  }

  // 5. Writing & Text Structure
  if (t.includes('writing') || t.includes('narrative') || t.includes('persuasive') || t.includes('essay') || t.includes('paragraph') || t.includes('story') || t.includes('draft') || t.includes('edit') || t.includes('revise')) {
    return 'Writing and text structure';
  }

  // --- SCIENCE MAIN HEADER TOPICS ---
  if (t.includes('cell') || t.includes('plant') || t.includes('animal') || t.includes('organism') || t.includes('human') || t.includes('body') || t.includes('ecosystem') || t.includes('habitat') || t.includes('adaptation') || t.includes('biology') || t.includes('living thing') || t.includes('photosynthesis')) {
    return 'Living things and ecosystems';
  }
  if (t.includes('planet') || t.includes('solar') || t.includes('star') || t.includes('space') || t.includes('earth') || t.includes('moon') || t.includes('weather') || t.includes('climate') || t.includes('water cycle') || t.includes('rock') || t.includes('soil') || t.includes('atmosphere') || t.includes('orbit')) {
    return 'Earth and space sciences';
  }
  if (t.includes('force') || t.includes('motion') || t.includes('gravity') || t.includes('energy') || t.includes('light') || t.includes('sound') || t.includes('heat') || t.includes('electricity') || t.includes('magnet') || t.includes('physics')) {
    return 'Physical forces and energy';
  }
  if (t.includes('matter') || t.includes('particle') || t.includes('solid') || t.includes('liquid') || t.includes('gas') || t.includes('chemical') || t.includes('molecule') || t.includes('atom') || t.includes('mixture') || t.includes('chemistry')) {
    return 'Chemical sciences and matter';
  }

  // --- LOGICAL REASONING MAIN HEADER TOPICS ---
  if (t.includes('spatial') || t.includes('cube') || t.includes('net') || t.includes('fold') || t.includes('rotation') || t.includes('reflection') || t.includes('3d') || t.includes('view')) {
    return 'Spatial and 3D reasoning';
  }
  if (t.includes('series') || t.includes('sequence') || t.includes('missing term') || (t.includes('pattern') && s.includes('logic'))) {
    return 'Number and shape patterns';
  }
  if (t.includes('analogy') || t.includes('analogies') || t.includes('classification') || t.includes('odd one out')) {
    return 'Analogy and classification';
  }
  if (t.includes('logic') || t.includes('reasoning') || t.includes('deduction') || t.includes('ranking') || t.includes('seating') || t.includes('code') || t.includes('decoding') || t.includes('direction') || t.includes('blood relation')) {
    return 'Deductive and verbal logic';
  }

  // --- HINDI MAIN HEADER TOPICS ---
  if (t.includes('वर्णमाला') || t.includes('स्वर') || t.includes('व्यंजन') || t.includes('ध्वनि')) {
    return 'वर्णमाला और ध्वनियाँ (Alphabet & Phonetics)';
  }
  if (t.includes('व्याकरण') || t.includes('संज्ञा') || t.includes('सर्वनाम') || t.includes('क्रिया') || t.includes('विशेषण') || t.includes('काल') || t.includes('लिंग') || t.includes('वचन')) {
    return 'हिंदी व्याकरण (Hindi Grammar)';
  }
  if (t.includes('शब्द') || t.includes('पर्यायवाची') || t.includes('विलोम') || t.includes('मुहावरे') || t.includes('शब्दावली')) {
    return 'शब्द ज्ञान (Vocabulary & Synonyms)';
  }
  if (t.includes('गद्यांश') || t.includes('पठन') || t.includes('अपठित')) {
    return 'पठन और समझ (Reading & Comprehension)';
  }

  // Fallback defaults per subject domain — Never return unmapped granular strings!
  if (s.includes('math') || s.includes('numeracy')) return 'Place value and number sense';
  if (s.includes('english') || s.includes('reading') || s.includes('literacy')) return 'Vocabulary and word structure';
  if (s.includes('science')) return 'Living things and ecosystems';
  if (s.includes('logic') || s.includes('reasoning')) return 'Deductive and verbal logic';
  if (s.includes('hindi')) return 'शब्द ज्ञान (Vocabulary & Synonyms)';

  return 'Core Learning Concepts';
};

const getSubjectForUmbrellaCategory = (umbrellaName = '', rawSubject = '') => {
  const u = (umbrellaName || '').toLowerCase().trim();
  const s = (rawSubject || '').toLowerCase().trim();

  // Explicit Main Header Topic Domain Mapping
  if (
    u.includes('place value') || 
    u.includes('comparing') || 
    u.includes('even and odd') || 
    u.includes('addition') || 
    u.includes('subtraction') || 
    u.includes('multiplication') || 
    u.includes('division') || 
    u.includes('fraction') || 
    u.includes('decimal') || 
    u.includes('percent') || 
    u.includes('ratio') || 
    u.includes('money') || 
    u.includes('time and clock') || 
    u.includes('geometry') || 
    u.includes('measurement') || 
    u.includes('data, graphs') || 
    u.includes('patterns and sequences') ||
    u.includes('mathematics')
  ) {
    return 'Mathematics';
  }

  if (
    u.includes('spelling') || 
    u.includes('phonics') || 
    u.includes('grammar') || 
    u.includes('conventions') || 
    u.includes('vocabulary') || 
    u.includes('word structure') || 
    u.includes('reading') || 
    u.includes('writing') || 
    u.includes('comprehension') || 
    u.includes('literacy') || 
    u.includes('english')
  ) {
    return 'English';
  }

  if (
    u.includes('living thing') || 
    u.includes('ecosystem') || 
    u.includes('earth and space') || 
    u.includes('physical forces') || 
    u.includes('chemical sciences') || 
    u.includes('matter') || 
    u.includes('energy') || 
    u.includes('science')
  ) {
    return 'Science';
  }

  if (
    u.includes('spatial') || 
    u.includes('3d reasoning') || 
    u.includes('number and shape pattern') || 
    u.includes('analogy') || 
    u.includes('classification') || 
    u.includes('deductive') || 
    u.includes('verbal logic') || 
    u.includes('logical') || 
    u.includes('reasoning') || 
    u.includes('olympiad')
  ) {
    return 'Logical Reasoning';
  }

  if (u.includes('वर्णमाला') || u.includes('व्याकरण') || u.includes('शब्द ज्ञान') || u.includes('पठन') || u.includes('hindi')) {
    return 'Hindi';
  }

  if (u.includes('history')) return 'History';
  if (u.includes('geography')) return 'Geography';
  if (u.includes('art')) return 'Art';
  if (u.includes('music')) return 'Music';

  // Fallback to normalized rawSubject
  return normalizeToGradeSubject(rawSubject, umbrellaName);
};

const normalizeToGradeSubject = (rawSubject = '', rawSubtopic = '') => {
  const s = (rawSubject || '').toLowerCase().trim();
  const t = (rawSubtopic || '').toLowerCase().trim();

  // Test names mapping (e.g. naplan reading, naplan conventions -> English, naplan numeracy -> Mathematics)
  if (s.includes('math') || s.includes('numeracy') || s.includes('algebra') || s.includes('arithmetic') || s.includes('geometry') || s.includes('quantitative')) {
    return 'Mathematics';
  }
  if (s.includes('english') || s.includes('reading') || s.includes('writing') || s.includes('spelling') || s.includes('grammar') || s.includes('conventions') || s.includes('comprehension') || s.includes('literacy') || s.includes('vocab')) {
    return 'English';
  }
  if (s.includes('science') || s.includes('physics') || s.includes('chemistry') || s.includes('biology') || s.includes('nature') || s.includes('environment')) {
    return 'Science';
  }
  if (s.includes('logic') || s.includes('reasoning') || s.includes('spatial') || s.includes('critical thinking') || s.includes('olympiad')) {
    return 'Logical Reasoning';
  }
  if (s.includes('hindi')) {
    return 'Hindi';
  }
  if (s.includes('history') || s.includes('social') || s.includes('geography')) {
    return 'History';
  }
  if (s.includes('art')) {
    return 'Art';
  }
  if (s.includes('music')) {
    return 'Music';
  }

  // Fallback check by subtopic
  if (t.includes('fraction') || t.includes('number') || t.includes('math') || t.includes('geometry') || t.includes('algebra') || t.includes('time') || t.includes('stat') || t.includes('measurement') || t.includes('money')) {
    return 'Mathematics';
  }
  if (t.includes('spell') || t.includes('grammar') || t.includes('reading') || t.includes('word') || t.includes('verb') || t.includes('clause') || t.includes('sentence') || t.includes('punctuation') || t.includes('vocab')) {
    return 'English';
  }
  if (t.includes('logic') || t.includes('pattern') || t.includes('cube') || t.includes('reasoning') || t.includes('spatial')) {
    return 'Logical Reasoning';
  }
  if (t.includes('planet') || t.includes('particle') || t.includes('science') || t.includes('matter') || t.includes('cell') || t.includes('earth')) {
    return 'Science';
  }

  if (rawSubject && rawSubject.trim()) {
    const clean = rawSubject.trim();
    if (clean.toLowerCase() === 'maths') return 'Mathematics';
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  }
  return 'General';
};

const getQuestionSubtopic = (hw, q) => {
  if (q.subtopic && typeof q.subtopic === 'string' && q.subtopic.trim()) {
    return q.subtopic.trim();
  }
  if (hw.topics && Array.isArray(hw.topics) && hw.topics.length > 0) {
    const validTopic = hw.topics.find(t => typeof t === 'string' && t.trim().length > 0);
    if (validTopic) return validTopic.trim();
  }
  if (hw.selectedSkills && Array.isArray(hw.selectedSkills) && hw.selectedSkills.length > 0) {
    const validSkill = hw.selectedSkills.find(s => typeof s === 'string' && s.trim().length > 0);
    if (validSkill) return validSkill.trim();
  }
  if (hw.skillTitle && typeof hw.skillTitle === 'string' && hw.skillTitle.trim()) {
    return hw.skillTitle.trim();
  }

  const sub = (q.subtopic || '').trim();
  const text = (q.text || '').toLowerCase();
  const title = (hw.title || '').toLowerCase();
  const subject = (hw.subject || '').toLowerCase();
  const context = `${sub} ${title} ${text}`.toLowerCase();

  if (context.includes('fraction') || context.includes('numerator') || context.includes('denominator')) return 'Fractions';
  if (context.includes('decimal') || context.includes('tenths') || context.includes('hundredths')) return 'Decimals';
  if (context.includes('addition') || context.includes('add ') || context.includes('adding') || context.includes('sum') || context.includes('+')) return 'Addition';
  if (context.includes('subtraction') || context.includes('subtract') || context.includes('minus') || context.includes('difference') || context.includes('-')) return 'Subtraction';
  if (context.includes('multiplication') || context.includes('multiply') || context.includes('times') || context.includes('product') || context.includes('*')) return 'Multiplication';
  if (context.includes('division') || context.includes('divide') || context.includes('quotient') || context.includes('ratio')) return 'Division';
  if (context.includes('geometry') || context.includes('angle') || context.includes('shape') || context.includes('triangle') || context.includes('perimeter') || context.includes('area') || context.includes('polygon')) return 'Geometry';
  if (context.includes('algebra') || context.includes('equation') || context.includes('variable') || context.includes('expression')) return 'Algebra';
  if (context.includes('measurement') || context.includes('metric') || context.includes('ruler') || context.includes('time') || context.includes('clock') || context.includes('money') || context.includes('calendar') || context.includes('hour') || context.includes('minute')) return 'Measurement & Time';
  
  if (context.includes('spelling') || context.includes('spell ')) return 'Spelling';
  if (context.includes('punctuation') || context.includes('comma') || context.includes('period') || context.includes('question mark') || context.includes('apostrophe') || context.includes('exclamation') || context.includes('quotation')) return 'Punctuation';
  if (context.includes('noun')) return 'Nouns';
  if (context.includes('verb') || context.includes('tense')) return 'Verbs';
  if (context.includes('adjective')) return 'Adjectives';
  if (context.includes('pronoun')) return 'Pronouns';
  if (context.includes('preposition') || context.includes('conjunction') || context.includes('adverb') || context.includes('grammar') || context.includes('sentence')) return 'Grammar & Parts of Speech';
  if (context.includes('comprehension') || context.includes('reading') || context.includes('passage') || context.includes('inference') || context.includes('context clue')) return 'Reading Comprehension';
  if (context.includes('vocabulary') || context.includes('synonym') || context.includes('antonym') || context.includes('definition') || context.includes('meaning')) return 'Vocabulary';

  if (context.includes('planet') || context.includes('solar') || context.includes('star') || context.includes('space') || context.includes('orbit') || context.includes('universe') || context.includes('galaxy') || context.includes('moon')) return 'Space & Astronomy';
  if (context.includes('cell') || context.includes('plant') || context.includes('animal') || context.includes('photosynthesis') || context.includes('body') || context.includes('organism') || context.includes('ecosystem') || context.includes('human') || context.includes('biology')) return 'Biology & Life Sciences';
  if (context.includes('chemical') || context.includes('molecule') || context.includes('atom') || context.includes('reaction') || context.includes('element') || context.includes('state of matter') || context.includes('chemistry')) return 'Chemistry & Matter';
  if (context.includes('gravity') || context.includes('force') || context.includes('energy') || context.includes('motion') || context.includes('magnet') || context.includes('physics') || context.includes('electricity') || context.includes('light')) return 'Physics & Energy';
  if (context.includes('weather') || context.includes('climate') || context.includes('rock') || context.includes('earth') || context.includes('water cycle') || context.includes('erosion') || context.includes('soil') || context.includes('environment')) return 'Earth & Environmental Sciences';
  
  if (hw.title && typeof hw.title === 'string' && hw.title.trim() && !hw.title.toLowerCase().includes('quiz') && !hw.title.toLowerCase().includes('mission')) {
    return hw.title.trim();
  }
  
  if (subject.includes('math') || subject.includes('arithmetic')) return 'General Maths';
  if (subject.includes('english') || subject.includes('literacy') || subject.includes('reading')) return 'General English';
  if (subject.includes('science')) return 'General Science';
  
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
            <div className="absolute top-2 left-4 text-xl animate-ping select-none">ðŸ¬</div>
            <div className="absolute top-6 right-12 text-2xl animate-bounce select-none">✨¨</div>
            <div className="absolute bottom-3 left-1/3 text-lg animate-pulse select-none">🎈</div>
            <div className="absolute bottom-2 right-1/4 text-xl animate-bounce select-none">🧠</div>
            <div className="absolute top-1/2 left-10 text-lg animate-bounce select-none">🎉</div>
         </div>
         
         <div className="flex items-center gap-4 z-10">
            <div className="text-4xl">🎂</div>
            <div>
               <h3 className="text-xl font-black tracking-tight drop-shadow-sm">Hurray Its {names}'s birthday today!</h3>
               <p className="text-xs font-bold text-white/95">Let's celebrate our star student's special day! 🎈✨¨</p>
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

const ContactUsTab = ({ user, teacherData }) => {
  const [senderName, setSenderName] = useState(teacherData?.name || user?.displayName || '');
  const [senderEmail, setSenderEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('General Query');
  const [queryText, setQueryText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [autoReplyMessage, setAutoReplyMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!senderName.trim() || !senderEmail.trim() || !queryText.trim()) {
      setErrorMessage('Please fill out your name, email, and query.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // 1. Write submission to Firestore 'contacts' collection
      await addDoc(collection(db, 'contacts'), {
        senderName: senderName.trim(),
        senderEmail: senderEmail.trim(),
        query: queryText.trim(),
        subject: subject || 'General Query',
        recipientEmail: 'aihealthtec@gmail.com',
        teacherUid: user?.uid || null,
        createdAt: new Date().toISOString(),
        status: 'unread'
      });

      // 2. Call serverless API endpoint /api/contact
      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: senderName.trim(),
            email: senderEmail.trim(),
            query: queryText.trim(),
            subject: subject
          })
        });
      } catch (apiErr) {
        console.warn('Backend contact API call error:', apiErr);
      }

      // 3. Set Auto Reply confirmation text exact matching user specification:
      // "Hello member, We have got your email and will reply back as soon as possible ". Thanks,  HomeworkZone Team
      const reply = "Hello member, We have got your email and will reply back as soon as possible. Thanks, HomeworkZone Team";
      setAutoReplyMessage(reply);
      setSubmitted(true);
      setQueryText('');
    } catch (err) {
      console.error('Contact submission error:', err);
      setErrorMessage('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider">
            <Mail className="w-4 h-4 text-pink-200" /> Direct Support & Support Desk
          </div>
          <h2 className="text-3xl font-black tracking-tight">Contact Us</h2>
          <p className="text-sm font-medium text-white/90 max-w-xl">
            Have questions, feedback, or need help? Send us a message and our team will get back to you as soon as possible.
          </p>
        </div>
        <div className="absolute -right-6 -bottom-10 opacity-20 pointer-events-none">
          <Send className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Confirmation Card if Submitted */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border-2 border-emerald-200 rounded-[28px] p-6 text-emerald-900 shadow-md space-y-3"
        >
          <div className="flex items-center gap-3 text-emerald-700 font-black text-lg">
            <CheckCircle className="w-6 h-6 text-emerald-500" /> Message Sent Successfully!
          </div>
          <p className="text-xs text-emerald-800 font-bold">
            Your query has been sent to our support team.
          </p>
          <div className="bg-white p-4 rounded-2xl border border-emerald-200 text-xs font-bold text-slate-700 leading-relaxed shadow-inner">
            💬 <span className="text-indigo-600 font-black">Auto-Reply Notification:</span> "{autoReplyMessage}"
          </div>
          <button
            onClick={() => setSubmitted(false)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-black text-xs hover:bg-emerald-700 transition-all shadow-sm"
          >
            Send Another Message
          </button>
        </motion.div>
      )}

      {/* Main Form */}
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 space-y-6">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-500" /> Send Message to HomeworkZone Team
        </h3>

        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Sender Name */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-600 uppercase tracking-wider block">Your Name</label>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Sender Email */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-600 uppercase tracking-wider block">Your Email Address</label>
              <input
                type="email"
                required
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Topic / Subject */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-600 uppercase tracking-wider block">Topic / Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-all"
            >
              <option value="General Query">General Query</option>
              <option value="Technical Support">Technical Support</option>
              <option value="Billing & License Question">Billing & License Question</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Curriculum & Content">Curriculum & Content Inquiry</option>
            </select>
          </div>

          {/* Query Message Textarea */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-600 uppercase tracking-wider block">Your Query / Message</label>
            <textarea
              required
              rows={5}
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="Describe your query or feedback in detail..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>Sending Query...</>
            ) : (
              <>
                <Send className="w-4 h-4" /> Submit Query
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};


const AdminPricingSettings = () => {
  const [pricing, setPricing] = React.useState(null);
  const [saving, setSaving] = React.useState(false);
  
  React.useEffect(() => {
    fetchPricing().then(setPricing);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePricing(pricing);
      alert('Saved! All plans now use the updated pricing, seat limits and paper quotas.');
    } catch(e) {
      alert('Error saving: ' + e.message);
    }
    setSaving(false);
  };

  if (!pricing) return null;

  return (
    <div className="bg-white border-4 border-indigo-100 rounded-[32px] p-8 space-y-8 shadow-lg mb-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-indigo-900 flex items-center gap-2">
          <CreditCard className="w-6 h-6" />
          Global Pricing Configuration
        </h2>
        <p className="text-xs font-bold text-slate-500">
          Changes saved here instantly update Stripe checkouts, seat limits, and paper quotas across the entire platform.
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* ── Free Trial ─────────────────────────────────────────── */}
        <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border-2 border-slate-200">
          <h4 className="text-sm font-black text-slate-700">Free Trial</h4>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Seat Limit</label>
              <input type="number" step="1" min="1"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-700 bg-white"
                value={pricing.free_seatLimit ?? ''}
                onChange={(e) => setPricing({...pricing, free_seatLimit: Number(e.target.value)})} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Paper Quota (Total)</label>
              <input type="number" step="1" min="1"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-700 bg-white"
                value={pricing.free_paperQuota ?? ''}
                onChange={(e) => setPricing({...pricing, free_paperQuota: Number(e.target.value)})} />
            </div>
          </div>
        </div>

        {/* ── Option A ────────────────────────────────────────────── */}
        <div className="space-y-4 p-5 bg-blue-50 rounded-2xl border-2 border-blue-200">
          <h4 className="text-sm font-black text-blue-700">Option A (Elastic)</h4>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Price per student / mo</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input type="number" step="0.5" 
                  className="w-full border-2 border-slate-200 rounded-xl pl-7 pr-4 py-2 text-sm font-black text-slate-700 bg-white" 
                  value={pricing.optionA_perStudentPerMonth ?? ''} 
                  onChange={(e) => setPricing({...pricing, optionA_perStudentPerMonth: Number(e.target.value)})} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Seat Limit</label>
              <input type="number" step="1" min="1"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-700 bg-white"
                value={pricing.optionA_seatLimit ?? ''}
                onChange={(e) => setPricing({...pricing, optionA_seatLimit: Number(e.target.value)})} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Paper Quota / mo</label>
              <input type="number" step="1" min="1"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-700 bg-white"
                value={pricing.optionA_paperQuota ?? ''}
                onChange={(e) => setPricing({...pricing, optionA_paperQuota: Number(e.target.value)})} />
            </div>
          </div>
        </div>

        {/* ── Option B Starter ────────────────────────────────────── */}
        <div className="space-y-4 p-5 bg-orange-50 rounded-2xl border-2 border-orange-200">
          <h4 className="text-sm font-black text-orange-600">Option B (Starter)</h4>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Flat Price / mo</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input type="number" step="1" 
                  className="w-full border-2 border-slate-200 rounded-xl pl-7 pr-4 py-2 text-sm font-black text-slate-700 bg-white" 
                  value={pricing.optionB_starter_price ?? ''} 
                  onChange={(e) => setPricing({...pricing, optionB_starter_price: Number(e.target.value)})} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Seat Limit</label>
              <input type="number" step="1" min="1"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-700 bg-white"
                value={pricing.optionB_starter_maxStudents ?? ''}
                onChange={(e) => setPricing({...pricing, optionB_starter_maxStudents: Number(e.target.value)})} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Paper Quota / mo</label>
              <input type="number" step="1" min="1"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-700 bg-white"
                value={pricing.optionB_starter_paperQuota ?? ''}
                onChange={(e) => setPricing({...pricing, optionB_starter_paperQuota: Number(e.target.value)})} />
            </div>
          </div>
        </div>

        {/* ── Option B Growth ─────────────────────────────────────── */}
        <div className="space-y-4 p-5 bg-orange-50 rounded-2xl border-2 border-orange-200">
          <h4 className="text-sm font-black text-orange-600">Option B (Growth)</h4>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Flat Price / mo</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input type="number" step="1" 
                  className="w-full border-2 border-slate-200 rounded-xl pl-7 pr-4 py-2 text-sm font-black text-slate-700 bg-white" 
                  value={pricing.optionB_growth_price ?? ''} 
                  onChange={(e) => setPricing({...pricing, optionB_growth_price: Number(e.target.value)})} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Seat Limit</label>
              <input type="number" step="1" min="1"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-700 bg-white"
                value={pricing.optionB_growth_maxStudents ?? ''}
                onChange={(e) => setPricing({...pricing, optionB_growth_maxStudents: Number(e.target.value)})} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Paper Quota / mo</label>
              <input type="number" step="1" min="1"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-700 bg-white"
                value={pricing.optionB_growth_paperQuota ?? ''}
                onChange={(e) => setPricing({...pricing, optionB_growth_paperQuota: Number(e.target.value)})} />
            </div>
          </div>
        </div>

        {/* ── Option C ────────────────────────────────────────────── */}
        <div className="space-y-4 p-5 bg-emerald-50 rounded-2xl border-2 border-emerald-200 col-span-1 md:col-span-2 xl:col-span-4">
          <h4 className="text-sm font-black text-emerald-700">Option C (Yearly Graduated)</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tier 1 (≤100) / yr</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input type="number" step="1" 
                  className="w-full border-2 border-slate-200 rounded-xl pl-7 pr-4 py-2 text-sm font-black text-slate-700 bg-white" 
                  value={pricing.optionC_tier1_rate ?? ''} 
                  onChange={(e) => setPricing({...pricing, optionC_tier1_rate: Number(e.target.value)})} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tier 2 (≤500) / yr</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input type="number" step="1" 
                  className="w-full border-2 border-slate-200 rounded-xl pl-7 pr-4 py-2 text-sm font-black text-slate-700 bg-white" 
                  value={pricing.optionC_tier2_rate ?? ''} 
                  onChange={(e) => setPricing({...pricing, optionC_tier2_rate: Number(e.target.value)})} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tier 3 (≤1000) / yr</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input type="number" step="1" 
                  className="w-full border-2 border-slate-200 rounded-xl pl-7 pr-4 py-2 text-sm font-black text-slate-700 bg-white" 
                  value={pricing.optionC_tier3_rate ?? ''} 
                  onChange={(e) => setPricing({...pricing, optionC_tier3_rate: Number(e.target.value)})} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tier 4 (1001+) / yr</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input type="number" step="1" 
                  className="w-full border-2 border-slate-200 rounded-xl pl-7 pr-4 py-2 text-sm font-black text-slate-700 bg-white" 
                  value={pricing.optionC_tier4_rate ?? ''} 
                  onChange={(e) => setPricing({...pricing, optionC_tier4_rate: Number(e.target.value)})} />
              </div>
            </div>
            
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Seat Limit</label>
              <div className="text-2xl font-black text-emerald-600 pt-1">∞</div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Paper Quota / yr</label>
              <input type="number" step="1" min="1"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-700 bg-white"
                value={pricing.optionC_paperQuota ?? ''}
                onChange={(e) => setPricing({...pricing, optionC_paperQuota: Number(e.target.value)})} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-100">
        <button onClick={handleSave} disabled={saving} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-md transition-all active:scale-95 disabled:opacity-60">
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </div>
  );
};
const TeacherDashboard = ({ user, onLogout }) => {
  console.log("TeacherDashboard Rendered. User:", user);
  const [classrooms, setClassrooms] = useState([]);
  const [activeClassroom, setActiveClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [globalPricing, setGlobalPricing] = useState({ optionA_perStudentPerMonth: 5, optionA_seatLimit: 10, optionA_paperQuota: 25, optionB_starter_price: 50, optionB_starter_maxStudents: 20, optionB_starter_paperQuota: 60, optionB_growth_price: 80, optionB_growth_maxStudents: 30, optionB_growth_paperQuota: 100, optionB_school_price: 99, optionB_school_maxStudents: 150, optionB_school_paperQuota: 150, optionC_tier1_rate: 24, optionC_tier2_rate: 20, optionC_tier3_rate: 16, optionC_tier4_rate: 14, optionC_paperQuota: 2500, free_seatLimit: 5, free_paperQuota: 5 });

  useEffect(() => {
    fetchPricing().then(p => { if(p) setGlobalPricing(p); });
  }, []);
  const [newStudent, setNewStudent] = useState('');
  const [newClassName, setNewClassName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [completionTab, setCompletionTab] = useState('lagging');
  const [selectedExamForBuilder, setSelectedExamForBuilder] = useState(null);
  const [teacherBilling, setTeacherBilling] = useState(null);
  const [teacherData, setTeacherData] = useState(null);
  
  // ─── Admin Executive Roles ───────────────────────────────────────────────
  // isAdminUser → full admin (unlimited + Admin Reports tab) — shilpeshpillai81@gmail.com only
  // isSuperUser → unlimited usage only, no Admin Reports
  const isAdminUser = teacherData?.isAdmin === true || teacherData?.role === 'admin';
  const isPromptAdmin = isAdminUser || (user?.email?.toLowerCase().trim() === 'shilpeshpillai81@gmail.com');
  const isSuperUser = SUPER_USER_EMAILS.includes((teacherData?.email || '').toLowerCase().trim()) || teacherData?.isSuperUser === true;

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
      const activeTeacherClassrooms = {};
      const classQuery = query(collectionGroup(db, 'classrooms'));
      const classSnap = await getDocsFromServer(classQuery);
      const classCounts = {};
      classSnap.forEach(doc => {
        const parts = doc.ref.path.split('/');
        const teacherId = parts[1];
        const classroomId = doc.id;
        if (teacherId) {
          classCounts[teacherId] = (classCounts[teacherId] || 0) + 1;
          if (!activeTeacherClassrooms[teacherId]) {
            activeTeacherClassrooms[teacherId] = new Set();
          }
          activeTeacherClassrooms[teacherId].add(classroomId);
        }
      });

      const studentQuery = query(collectionGroup(db, 'students'));
      const studentSnap = await getDocsFromServer(studentQuery);
      const studentCounts = {};
      studentSnap.forEach(doc => {
        const parts = doc.ref.path.split('/');
        if (parts.length === 6 && parts[0] === 'teachers' && parts[2] === 'classrooms' && parts[4] === 'students') {
          const teacherId = parts[1];
          const classroomId = parts[3];
          const teacherActiveClasses = activeTeacherClassrooms[teacherId];
          if (teacherActiveClasses && teacherActiveClasses.has(classroomId)) {
            studentCounts[teacherId] = (studentCounts[teacherId] || 0) + 1;
          }
        }
      });

      const homeworkSnap = await getDocsFromServer(collection(db, 'homeworks'));
      const homeworkCounts = {};
      const subjectByTeacher = {}; // { teacherId: { Maths: 3, English: 2, ... } }
      homeworkSnap.forEach(doc => {
        const data = doc.data();
        const teacherId = data.teacherId;
        if (teacherId) {
          homeworkCounts[teacherId] = (homeworkCounts[teacherId] || 0) + 1;
          const subj = (data.subject || 'Other').trim();
          if (!subjectByTeacher[teacherId]) subjectByTeacher[teacherId] = {};
          subjectByTeacher[teacherId][subj] = (subjectByTeacher[teacherId][subj] || 0) + 1;
        }
      });

      const teachersSnap = await getDocsFromServer(collection(db, 'teachers'));
      const teachersList = [];

      teachersSnap.forEach(docSnap => {
        const data = docSnap.data();
        const teacherId = docSnap.id;
        const studentCount = studentCounts[teacherId] || 0;
        const classCount = classCounts[teacherId] || 0;
        const homeworkCount = homeworkCounts[teacherId] || 0;
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
          location: data.location || null,
          studentCount,
          classCount,
          homeworkCount,
          subjectCounts: subjectByTeacher[teacherId] || {},
          trialDaysLeft,
          activePlanId,
          isPaid,
          conversionStatus,
          mrr: getTeacherMRR(billing, studentCount),
          isSuperUser: data.isSuperUser === true
        });
      });

      setAdminTeachers(teachersList);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
    setAdminLoading(false);
  };

  const handleToggleSuperUser = async (teacherId, currentValue) => {
    try {
      const newValue = !currentValue;
      await setDoc(doc(db, 'teachers', teacherId), { isSuperUser: newValue }, { merge: true });
      setAdminTeachers(prev =>
        prev.map(t => t.id === teacherId ? { ...t, isSuperUser: newValue } : t)
      );
    } catch (err) {
      console.error('Error toggling super user:', err);
      alert('Failed to update super user status.');
    }
  };

  const getTeacherMRR = (billing, studentCount) => {
    if (!billing || !['active', 'trialing'].includes(billing.status)) return 0;
    const planId = billing.planId;
    if (planId === 'option-a') {
      return studentCount * globalPricing.optionA_perStudentPerMonth;
    }
    if (planId === 'option-b-starter') return globalPricing.optionB_starter_price;
    if (planId === 'option-b-growth') return globalPricing.optionB_growth_price;
    if (planId === 'option-b-school') return globalPricing.optionB_school_price;
    if (planId === 'option-c') {
      return calculateOptionCAnnual(studentCount) / 12;
    }
    return 0;
  };

  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [boosterSuccessData, setBoosterSuccessData] = useState(null);
  const [boosterErrorMsg, setBoosterErrorMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    const isBooster = params.get('booster_success') === 'true';

    if (sessionId && user?.uid && !isVerifyingPayment) {
      const verifyPayment = async () => {
        setIsVerifyingPayment(true);
        try {
          const action = isBooster ? 'verify-booster' : 'verify-subscription';
          const res = await fetch('/api/billing-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, sessionId, teacherId: user.uid, email: user.email || 'sub@topup.com' })
          });
          const data = await res.json();
          if (data.success) {
            if (isBooster) {
              const credits = data.credits || 15;
              // Visual immediate bump
              setTeacherData(prev => ({
                ...prev,
                topUpCredits: (prev?.topUpCredits || 0) + credits
              }));
              setBoosterSuccessData(credits);
            } else {
              setTeacherData(prev => ({
                ...prev,
                billing: { ...prev?.billing, planId: data.planId, status: 'active' }
              }));
              setTimeout(() => alert('Subscription activated successfully!'), 500);
            }
          } else {
            setBoosterErrorMsg(data.message || 'Still processing or failed.');
          }
        } catch (err) {
          console.error('Error verifying payment:', err);
          setBoosterErrorMsg('Network error verifying payment.');
        } finally {
          setIsVerifyingPayment(false);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      };
      
      // Prevent double calling
      const processed = localStorage.getItem(`verify_${sessionId}`);
      if (!processed) {
        localStorage.setItem(`verify_${sessionId}`, 'true');
        verifyPayment();
      } else {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [user]);

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
        
        // Auto-capture location metadata for regional reports if missing
        if (!data.location) {
          try {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
            const locale = navigator.language || 'Unknown';
            setDoc(doc(db, 'teachers', user.uid), { location: { timeZone, locale } }, { merge: true })
              .catch(err => console.error("Error setting location:", err));
          } catch (e) {
            console.error("Could not capture location metadata", e);
          }
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
    { id: 'monthly', label: 'Monthly Tuition', description: 'Full month of homework help & learning support.',          icon: '🚀', amount: 180 },
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
      setTuitionPackages(allGradeFees[selectedTuitionGrade].map(pkg => ({ ...pkg, icon: DEFAULT_PACKAGES.find(d => d.id === pkg.id)?.icon || pkg.icon })));
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
  
  // Data Management Settings
  const [dataRetentionPeriod, setDataRetentionPeriod] = useState(90); // 90 days default
  const [lastPurgedAt, setLastPurgedAt] = useState(null);
  const [zonoKnowledgeText, setZonoKnowledgeText] = useState(DEFAULT_ZONO_KNOWLEDGE);
  const [isSavingZono, setIsSavingZono] = useState(false);

  useEffect(() => {
    const fetchZonoKnowledge = async () => {
      try {
        const snap = await getDoc(doc(db, 'system', 'zono_knowledge'));
        if (snap.exists() && snap.data()?.text) {
          setZonoKnowledgeText(snap.data().text);
        }
      } catch (err) {
        console.warn("Could not fetch Zono knowledge:", err);
      }
    };
    fetchZonoKnowledge();
  }, []);
  const [newStudentName, setNewStudentName] = useState('');
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [customSubjectInput, setCustomSubjectInput] = useState('');
  const [newChatDisabled, setNewChatDisabled] = useState(false);
  
  const [showEditClassModal, setShowEditClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [editClassName, setEditClassName] = useState('');
  const [selectedEditSubjects, setSelectedEditSubjects] = useState([]);
  const [customEditSubjectInput, setCustomEditSubjectInput] = useState('');
  const [editChatDisabled, setEditChatDisabled] = useState(false);

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
  const [badgeIcon, setBadgeIcon] = useState('ðŸ†');
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
  const [selectedReportSubject, setSelectedReportSubject] = useState('');
  const [selectedReportTimeRange, setSelectedReportTimeRange] = useState('all');
  const [remediationModalStudent, setRemediationModalStudent] = useState(null);
  const [remediationMessageContent, setRemediationMessageContent] = useState('');
  const [isSendingRemediationMsg, setIsSendingRemediationMsg] = useState(false);
  const [conceptSearchQuery, setConceptSearchQuery] = useState('');
  const [conceptTierFilter, setConceptTierFilter] = useState('Needs Focus');
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

  const handleGenerateAiParentReport = async (studentName, startingScore, currentScore, growth, speedBadge, masteryArray, totalQuizzes, timeSpentToday, timeSpentWeek, timeSpentMonth, timeSpentYear) => {
    setIsGeneratingReport(true);
    setShowReportOverlay(true);
    setAiReportContent('');

    try {
      const activeModel = localStorage.getItem('hwz_active_ai') || 'gemini';

      const className = selectedProfileStudent?.className || activeClassroom?.name || 'Classroom Student';
      const teacherName = user?.displayName?.trim() || activeClassroom?.teacherName || 'Classroom Teacher';

      const masteriesList = masteryArray.map(m => `- ${m.name}: ${m.correctCount}/${m.totalCount} correct (${m.accuracy}%) - Tier: ${m.tier}`).join('\n');

      const prompt = `You are an expert educator named "${teacherName}" teaching ${className}.
      Analyze this student's progress OVER THE LAST 4 WEEKS ONLY and generate an 80% visual-friendly, highly concise parent report summary for ${studentName}:
      
      Student Name: ${studentName}
      Classroom / Grade: ${className}
      Teacher Name: ${teacherName}
      Time Window: Last 4 Weeks Only
      4-Week Homework Quizzes Completed: ${totalQuizzes}
      Starting Accuracy: ${startingScore}%
      Current Accuracy: ${currentScore}%
      Growth Index: ${growth >= 0 ? `+${growth}%` : `${growth}%`}
      Pacing Speed: ${speedBadge}

      4-Week Time Dedicated on Homework Zone:
      - Today: ${timeSpentToday} minutes
      - This Week: ${timeSpentWeek} minutes
      - Last 4 Weeks Total: ${timeSpentMonth} minutes
      
      Umbrella Concept Masteries (Last 4 Weeks):
      ${masteriesList}
      
      CRITICAL CONCISE FORMAT & LENGTH RULES:
      1. Keep the entire text extremely CONCISE (under 140 words total!). Parents do NOT have time for long text essays.
      2. Focus strictly on broad umbrella categories (e.g. "Number & Operations", "Geometry & Measurement", "Grammar & Conventions").
      3. Structure into 4 short bulleted sections:
         - 🌟 Performance Overview (1-2 short encouraging sentences)
         - â±ï¸ Dedication & Effort (1 short sentence on consistency)
         - 💪 Key Strengths (top 2-3 umbrella domains mastered)
         - 🎯 Focus Areas (top 1-2 umbrella domains needing review with 1 quick home tip)
         - 💡 Teacher Recommendation (1 concise closing sentence)
      
      CRITICAL NAME & PLACEHOLDER RULE:
      - Sign at bottom: Warm regards, ${teacherName} (${className} Teacher).
      - NEVER write "[Teacher's Name]", "[Teacher Name]", "[Your Name]", or any bracketed placeholders anywhere in the text!`;

      const textResponse = await generateContent({
        prompt,
        provider: activeModel
      });

      setAiReportContent(textResponse);
    } catch (err) {
      console.error("AI Report Gen Error:", err);
      setAiReportContent("Failed to generate report. Please verify cloud settings and try again! âŒ");
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
         alert("Oops! Could not resolve classroom ID for this student. âŒ");
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
      alert(`Report successfully published to the Parent Portal for ${selectedProfileStudent.name}! 📤✨¨`);
      setShowReportOverlay(false);
    } catch (err) {
      console.error("Publish Report Error:", err);
      alert("Failed to publish report to Parent Portal. âŒ");
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

  const [subjectPrompts, setSubjectPrompts] = useState(DEFAULT_SUBJECT_PROMPTS);
  const [masterPromptsMap, setMasterPromptsMap] = useState(DEFAULT_SUBJECT_PROMPTS);
  const [promptViewMode, setPromptViewMode] = useState('personal');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [isSavingPrompts, setIsSavingPrompts] = useState(false);
  const [activePromptModalSubject, setActivePromptModalSubject] = useState(null);
  const [editingPromptContent, setEditingPromptContent] = useState('');

  const resolveSubjectStyle = (name) => {
    const s = (name || '').toLowerCase();
    if (s.includes('math') || s.includes('numeracy') || s.includes('algebra') || s.includes('geometry') || s.includes('number')) {
      return {
        titleColor: 'text-[#0284c7]',
        bgColor: 'bg-[#f0f9ff]',
        borderColor: 'border-[#bae6fd]',
        selectedBorder: 'border-[#0284c7] ring-4 ring-sky-100',
        renderIcon: () => (
          <div className="w-14 h-14 rounded-2xl bg-sky-100/80 border-2 border-sky-200 flex items-center justify-center text-sky-600 shadow-sm">
            <span className="text-xl font-black">1 2 3</span>
          </div>
        )
      };
    }
    if (s.includes('english') || s.includes('reading') || s.includes('writing') || s.includes('literacy') || s.includes('grammar') || s.includes('spelling') || s.includes('vocab')) {
      return {
        titleColor: 'text-[#d97706]',
        bgColor: 'bg-[#fffbeb]',
        borderColor: 'border-[#fde68a]',
        selectedBorder: 'border-[#d97706] ring-4 ring-amber-100',
        renderIcon: () => (
          <div className="w-14 h-14 rounded-2xl bg-amber-100/80 border-2 border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
            <span className="text-xl font-black">Aa</span>
          </div>
        )
      };
    }
    if (s.includes('science') || s.includes('biology') || s.includes('chemistry') || s.includes('physics')) {
      return {
        titleColor: 'text-[#059669]',
        bgColor: 'bg-[#ecfdf5]',
        borderColor: 'border-[#a7f3d0]',
        selectedBorder: 'border-[#059669] ring-4 ring-emerald-100',
        renderIcon: () => (
          <div className="w-14 h-14 rounded-2xl bg-emerald-100/80 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
            <FlaskConical className="w-7 h-7 text-emerald-600" />
          </div>
        )
      };
    }
    if (s.includes('olympiad') || s.includes('trophy') || s.includes('contest')) {
      return {
        titleColor: 'text-[#7c3aed]',
        bgColor: 'bg-[#f5f3ff]',
        borderColor: 'border-[#ddd6fe]',
        selectedBorder: 'border-[#7c3aed] ring-4 ring-purple-100',
        renderIcon: () => (
          <div className="w-14 h-14 rounded-2xl bg-purple-100/80 border-2 border-purple-200 flex items-center justify-center text-purple-600 shadow-sm">
            <Trophy className="w-7 h-7 text-purple-600" />
          </div>
        )
      };
    }
    if (s.includes('computer') || s.includes('code') || s.includes('tech') || s.includes('python')) {
      return {
        titleColor: 'text-[#0891b2]',
        bgColor: 'bg-[#ecfeff]',
        borderColor: 'border-[#a5f3fc]',
        selectedBorder: 'border-[#0891b2] ring-4 ring-cyan-100',
        renderIcon: () => (
          <div className="w-14 h-14 rounded-2xl bg-cyan-100/80 border-2 border-cyan-200 flex items-center justify-center text-cyan-600 shadow-sm">
            <Code className="w-7 h-7 text-cyan-600" />
          </div>
        )
      };
    }
    if (s.includes('finance') || s.includes('money') || s.includes('business')) {
      return {
        titleColor: 'text-[#10b981]',
        bgColor: 'bg-[#ecfdf5]',
        borderColor: 'border-[#a7f3d0]',
        selectedBorder: 'border-[#10b981] ring-4 ring-emerald-100',
        renderIcon: () => (
          <div className="w-14 h-14 rounded-2xl bg-emerald-100/80 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
            <Coins className="w-7 h-7 text-emerald-600" />
          </div>
        )
      };
    }
    if (s.includes('history') || s.includes('social') || s.includes('geography')) {
      return {
        titleColor: 'text-[#c2410c]',
        bgColor: 'bg-[#fff7ed]',
        borderColor: 'border-[#ffedd5]',
        selectedBorder: 'border-[#c2410c] ring-4 ring-orange-100',
        renderIcon: () => (
          <div className="w-14 h-14 rounded-2xl bg-orange-100/80 border-2 border-orange-200 flex items-center justify-center text-orange-600 shadow-sm">
            <Globe className="w-7 h-7 text-orange-600" />
          </div>
        )
      };
    }
    return {
      titleColor: 'text-emerald-700',
      bgColor: 'bg-[#f0fdf4]',
      borderColor: 'border-emerald-200',
      selectedBorder: 'border-emerald-600 ring-4 ring-emerald-100',
      renderIcon: () => (
        <div className="w-14 h-14 rounded-2xl bg-emerald-100/80 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
          <Pencil className="w-7 h-7 text-emerald-600" />
        </div>
      )
    };
  };

  const handleOpenPromptModal = (subKey) => {
    setActivePromptModalSubject(subKey);
    const currentMap = (isPromptAdmin && promptViewMode === 'global') ? masterPromptsMap : subjectPrompts;
    setEditingPromptContent(currentMap[subKey] || getPremiumPromptTemplate(subKey));
  };

  const handleSaveModalPrompt = async () => {
    if (!activePromptModalSubject) return;
    setIsSavingPrompts(true);
    
    if (isPromptAdmin && promptViewMode === 'global') {
      const updatedPrompts = {
        ...masterPromptsMap,
        [activePromptModalSubject]: editingPromptContent
      };
      setMasterPromptsMap(updatedPrompts);
      if (user?.uid) {
        try {
          await saveMasterDefaultPromptsIfAdmin(db, user, updatedPrompts);
        } catch (err) {
          console.error("Save Master Prompt Error:", err);
        }
      }
    } else {
      const updatedPrompts = {
        ...subjectPrompts,
        [activePromptModalSubject]: editingPromptContent
      };
      setSubjectPrompts(updatedPrompts);
      if (user?.uid) {
        try {
          await updateDoc(doc(db, 'teachers', user.uid), {
            subjectPrompts: updatedPrompts
          });
        } catch (err) {
          console.error("Save Prompt Error:", err);
        }
      }
    }
    setIsSavingPrompts(false);
    setActivePromptModalSubject(null);
  };
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
      if (isPromptAdmin && promptViewMode === 'global') {
        await saveMasterDefaultPromptsIfAdmin(db, user, masterPromptsMap);
        alert("Global Master Prompts saved successfully! 🌍🚀");
      } else {
        await updateDoc(doc(db, 'teachers', user.uid), {
          subjectPrompts: subjectPrompts
        });
        alert("Personal Subject Prompts saved successfully! 🚀🪄");
      }
    } catch (err) {
      console.error("Save Prompts Error:", err);
      alert("Failed to save prompts. ❌");
    }
    setIsSavingPrompts(false);
  };

  const getPremiumPromptTemplate = (subjectName) => {
    const capsSubject = subjectName.charAt(0).toUpperCase() + subjectName.slice(1);
    return `You are an expert educator and curriculum designer creating practice questions for an educational learning platform used by school students.

I am creating an educational app that helps students learn **${capsSubject}**.

Generate a high-quality practice paper based on the following details:

Subject: ${capsSubject}
Grade: {GRADE}
Topic: {TOPIC}
Difficulty Level: {DIFFICULTY}
Number of Questions: {QUESTION_COUNT}

Instructions:

• Create engaging, age-appropriate questions that match the student's grade level.
• Questions should progressively increase in difficulty.
• Cover all important concepts within the specified topic.
• Avoid repeating similar questions.
• Use clear and simple language suitable for the selected grade.
• Make the worksheet enjoyable and educational.
• Ensure every question has only one correct answer.
• Do not include ambiguous questions.
• Use real-world examples wherever appropriate.
• Mix question types to maintain student engagement.

Include a balanced combination of question types such as:
- Multiple Choice Questions (MCQ)
- True or False
- Fill in the Blanks
- Match the Following
- Short Answer Questions
- Picture-based questions (describe the image instead of generating one)
- Sequence or Ordering questions (when applicable)
- Odd One Out (where applicable)`;
  };

  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) {
      alert("Please enter a subject name! 🎨");
      return;
    }
    const cleanName = newSubjectName.trim().toLowerCase();
    const displaySubject = newSubjectName.trim();
    
    if (isPromptAdmin && promptViewMode === 'global') {
      if (masterPromptsMap[cleanName] !== undefined && masterPromptsMap[cleanName] !== null) {
        alert("This subject already exists in Global Prompts! 💡");
        return;
      }
      setMasterPromptsMap(prev => ({
        ...prev,
        [cleanName]: "Generating premium prompt using AI... 🪄 Please wait a moment."
      }));
    } else {
      if (subjectPrompts[cleanName] !== undefined && subjectPrompts[cleanName] !== null) {
        alert("This subject already exists in Personal Prompts! 💡");
        return;
      }
      setSubjectPrompts(prev => ({
        ...prev,
        [cleanName]: "Generating premium prompt using AI... 🪄 Please wait a moment."
      }));
    }
    setNewSubjectName('');

    try {
      const generatedText = await generateContent({
        prompt: `Write a highly detailed, customized, and structured instruction prompt template for another AI to generate high-quality worksheets and questions specifically for the subject: "${displaySubject}". The generated prompt must contain subject-specific details (for example, if the subject is "${displaySubject}", the instructions must specify key concepts, terminology, question structures, and topics unique to "${displaySubject}"). It should dynamically cater to the grade and difficulty level selected. Do not write a generic template containing '{SUBJECT}'. Write a concrete prompt tailored specifically to "${displaySubject}". Output only the prompt text itself, with no explanations or markdown quotes.`,
        systemInstruction: "You are an expert AI prompt engineer. Write a highly detailed, professional, structured instruction prompt for another AI to generate high-quality worksheets and questions. Output ONLY the resulting prompt.",
        provider: "gemini"
      });
      if (generatedText) {
        if (isPromptAdmin && promptViewMode === 'global') {
          setMasterPromptsMap(prev => ({ ...prev, [cleanName]: generatedText.trim() }));
        } else {
          setSubjectPrompts(prev => ({ ...prev, [cleanName]: generatedText.trim() }));
        }
      }
    } catch (err) {
      console.error("AI prompt generation error:", err);
      if (isPromptAdmin && promptViewMode === 'global') {
        setMasterPromptsMap(prev => ({ ...prev, [cleanName]: getPremiumPromptTemplate(cleanName) }));
      } else {
        setSubjectPrompts(prev => ({ ...prev, [cleanName]: getPremiumPromptTemplate(cleanName) }));
      }
    }
  };

  const handleDeleteSubject = async (subKey) => {
    if (await window.confirmCustom(`Are you sure you want to delete the generic prompt for "${subKey}"?`)) {
      if (isPromptAdmin && promptViewMode === 'global') {
        const updated = { ...masterPromptsMap };
        updated[subKey] = null;
        setMasterPromptsMap(updated);
        if (user?.uid) {
          try {
            await saveMasterDefaultPromptsIfAdmin(db, user, updated);
          } catch (err) {
            console.error("Failed to delete from global master:", err);
          }
        }
      } else {
        const updated = { ...subjectPrompts };
        updated[subKey] = null;
        setSubjectPrompts(updated);
        if (user?.uid) {
          try {
            await updateDoc(doc(db, 'teachers', user.uid), {
              subjectPrompts: updated
            });
          } catch (err) {
            console.error("Failed to delete subject prompt from database:", err);
          }
        }
      }
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
  const [newGoalTitle, setNewGoalTitle] = useState('Dino Pizza Party! ðŸ•');
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
        alert("AI Configuration saved securely to Cloud and locally! 🧠 🔒");
      } catch (err) {
        console.error("Save AI settings to Firestore failed:", err);
        alert("AI Configuration saved locally, but failed to sync to Cloud. ⚠️ï¸");
      }
    } else {
      alert("AI Configuration saved locally! 🧠 🔒");
    }
    setShowAiSettings(false);
  };

  useEffect(() => {
    const loadCloudAiSettings = async () => {
      if (!user?.uid) return;
      try {
        const masterPrompts = await getMasterDefaultPrompts(db);
        setMasterPromptsMap(masterPrompts);
        const teacherDoc = await getDoc(doc(db, 'teachers', user.uid));
        if (teacherDoc.exists()) {
          const data = teacherDoc.data();
          if (data.activeAi) {
            setActiveAi(data.activeAi);
            localStorage.setItem('hwz_active_ai', data.activeAi);
          }
          if (data.subjectPrompts) {
            setSubjectPrompts(data.subjectPrompts);
          } else {
            setSubjectPrompts(masterPrompts);
          }
          let loadedRetention = 90;
          let loadedPurgedAt = null;
          if (data.dataRetentionPeriod !== undefined) {
            loadedRetention = data.dataRetentionPeriod;
            setDataRetentionPeriod(data.dataRetentionPeriod);
          }
          if (data.lastPurgedAt) {
            loadedPurgedAt = data.lastPurgedAt;
            setLastPurgedAt(data.lastPurgedAt);
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

          // Auto-Purge Check
          if (loadedRetention !== -1) {
             const now = Date.now();
             const lastPurgeMs = loadedPurgedAt ? new Date(loadedPurgedAt).getTime() : 0;
             const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
             if (now - lastPurgeMs > sevenDaysMs) {
                console.log("Triggering auto-purge in background...");
                runPurge(loadedRetention).catch(console.error);
             }
          }
        }
      } catch (err) {
        console.error("Load cloud AI settings error:", err);
      }
    };
    loadCloudAiSettings();
  }, [user]);

  const runPurge = async (retentionDays) => {
    if (!user?.uid || retentionDays === -1) return;
    const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000).toISOString();
    
    const collectionsToPurge = [
       { name: 'homeworks', dateField: 'createdAt' },
       { name: 'submissions', dateField: 'submittedAt' },
       { name: 'messages', dateField: 'createdAt' }
    ];

    let totalDeleted = 0;

    for (const coll of collectionsToPurge) {
       try {
          const q = query(
             collection(db, coll.name),
             where('teacherId', '==', user.uid),
             where(coll.dateField, '<', cutoffDate),
             limit(100)
          );
          
          let hasMore = true;
          while (hasMore) {
             const snap = await getDocs(q);
             if (snap.empty) {
                hasMore = false;
                break;
             }
             
             const deletePromises = snap.docs.map(docSnap => deleteDoc(doc(db, coll.name, docSnap.id)));
             await Promise.all(deletePromises);
             totalDeleted += snap.docs.length;
             
             if (snap.docs.length < 100) {
                hasMore = false;
             }
          }
       } catch (err) {
          console.error(`Error purging ${coll.name}:`, err);
       }
    }

    const nowIso = new Date().toISOString();
    setLastPurgedAt(nowIso);
    await setDoc(doc(db, 'teachers', user.uid), {
       lastPurgedAt: nowIso
    }, { merge: true });
    
    return totalDeleted;
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
  }, [user, activeClassroom, activeTab]);

  const isInitialMessagesLoadRef = React.useRef(true);
  const teacherChatEndRef = React.useRef(null);

  useEffect(() => {
    if (!user?.uid) return;
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef, 
      where('teacherId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(100)
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
      
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added' && !isInitialMessagesLoadRef.current) {
          const msg = change.doc.data();
          if (!msg.isRead && msg.recipientId === user.uid) {
            if (window.showToast) {
              window.showToast({
                message: `New message from ${msg.senderName}! 💬`,
                type: 'info',
                onClick: () => setActiveTab('Messages')
              });
            } else {
              window.alert(`New message from ${msg.senderName}! 💬`);
            }
          }
        }
      });
      
      setTeacherMessages(allMsgs);
      
      if (isInitialMessagesLoadRef.current) {
         isInitialMessagesLoadRef.current = false;
      }
    }, (err) => {
      console.error("Error loading teacher messages:", err);
    });
    return () => unsubscribe();
  }, [user]);

  // Mark viewed messages as read
  useEffect(() => {
    if (activeTab === 'Messages') {
      // In TeacherDashboard, currentChat falls back to the first message if activeChat isn't set
      const currentChat = (activeChat && teacherMessages.find(m => m.id === activeChat.id))
         ? activeChat 
         : (teacherMessages.filter(msg => msg.senderRole === 'student')[0] || null);

      if (currentChat && !currentChat.isRead && currentChat.recipientId === user?.uid) {
        updateDoc(doc(db, 'messages', currentChat.id), { isRead: true }).catch(console.error);
      }
    }
  }, [activeTab, activeChat, teacherMessages, user]);

  useEffect(() => {
    if (activeTab === 'Messages') {
      setTimeout(() => {
        teacherChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    }
  }, [activeTab, activeChat, teacherMessages]);

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
      alert("Missing class name or teacher session! ⚠️ï¸");
      return;
    }

    const simulatedPlan = typeof localStorage !== 'undefined' ? localStorage.getItem('hwz_simulated_plan') : null;
    const activePlanId = simulatedPlan || ((teacherBilling && ['active', 'trialing'].includes(teacherBilling.status)) ? teacherBilling.planId : 'free');
    
    const isFree = activePlanId === 'free' || activePlanId === 'free_trial' || activePlanId === 'free_expired';
    if (isFree && classrooms.length >= 2) {
      setShowUpgradeAlert(true);
      return;
    }

    setIsAddingClass(true);
    try {
      const classId = newClassName.trim().toLowerCase().replace(/\s+/g, '-');
      const classRef = doc(db, 'teachers', user.uid, 'classrooms', classId);
      
      await setDoc(classRef, {
        name: newClassName.trim(),
        createdAt: new Date().toISOString(),
        teacherUid: user.uid,
        subjects: selectedSubjects,
        chatDisabled: newChatDisabled
      });
      
      console.log("Class created successfully:", classId);
      setNewClassName('');
      setSelectedSubjects([]);
      setNewChatDisabled(false);
      await fetchClassrooms();
      setShowAddClassModal(false);
      alert("Class created successfully! 🎨✨¨");
    } catch (err) {
      console.error("Add Classroom Error:", err);
      alert(`Oops! Failed to create class: ${err.message} âŒ`);
    } finally {
      setIsAddingClass(false);
    }
  };

  const handleEditClassroom = async () => {
    if (!editClassName.trim() || !editingClass?.id || !user?.uid) {
      alert("Missing class name or teacher session! ⚠️ï¸");
      return;
    }

    try {
      const classRef = doc(db, 'teachers', user.uid, 'classrooms', editingClass.id);
      
      await updateDoc(classRef, {
        name: editClassName.trim(),
        subjects: selectedEditSubjects,
        chatDisabled: editChatDisabled
      });
      
      console.log("Class updated successfully:", editingClass.id);
      setEditingClass(null);
      setEditClassName('');
      setSelectedEditSubjects([]);
      setEditChatDisabled(false);
      setShowEditClassModal(false);
      await fetchClassrooms();
      alert("Class updated successfully! ✨¨");
    } catch (err) {
      console.error("Edit Classroom Error:", err);
      alert(`Oops! Failed to update class: ${err.message} âŒ`);
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

      // Trigger seat sync on Stripe for Option A or C
      const activePlanId = (teacherBilling && ['active', 'trialing'].includes(teacherBilling.status)) ? teacherBilling.planId : 'free';
      if (activePlanId === 'option-a' || activePlanId === 'option-c') {
        fetch('/api/sync-seats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teacherId: user.uid })
        }).catch(err => console.warn('Background seat sync failed on class delete:', err));
      }
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
    const simulatedPlan = typeof localStorage !== 'undefined' ? localStorage.getItem('hwz_simulated_plan') : null;
    const activePlanId = simulatedPlan || ((teacherBilling && ['active', 'trialing'].includes(teacherBilling.status)) ? teacherBilling.planId : 'free');
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
        
        // Ensure aggregated is sorted deterministically for stable quota assignment
        aggregated.sort((a, b) => {
           const timeA = a.addedAt ? new Date(a.addedAt).getTime() : 0;
           const timeB = b.addedAt ? new Date(b.addedAt).getTime() : 0;
           if (timeA !== timeB) return timeA - timeB;
           return (a.name || '').localeCompare(b.name || '');
        });

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

  const syncStudentQuotaLocks = async (studentsList) => {
    if (!user?.uid) return;
    
    const simulatedPlan = typeof localStorage !== 'undefined' ? localStorage.getItem('hwz_simulated_plan') : null;
    const activePlanId = simulatedPlan || ((teacherBilling && ['active', 'trialing'].includes(teacherBilling.status)) ? teacherBilling.planId : 'free');
    const limit = getPlanSeatLimit(activePlanId);
    
    // Check if any lock status has changed in-memory
    let localChanged = false;
    const updatedList = studentsList.map((student, index) => {
      const shouldBeLocked = index >= limit;
      if (!!student.isQuotaLocked !== shouldBeLocked) {
        localChanged = true;
        return { ...student, isQuotaLocked: shouldBeLocked };
      }
      return student;
    });

    if (localChanged) {
      setAllStudents(updatedList);
    }

    if (simulatedPlan) {
      // If simulating, keep it completely local/client-side and do NOT write to database
      return;
    }
    
    // Write to Firestore only for real plan actions
    const updates = [];
    studentsList.forEach((student, index) => {
      const shouldBeLocked = index >= limit;
      if (!!student.isQuotaLocked !== shouldBeLocked) {
        updates.push({
          ref: doc(db, 'teachers', user.uid, 'classrooms', student.classId, 'students', student.id),
          shouldBeLocked
        });
      }
    });

    if (updates.length > 0) {
      console.log(`Syncing real quota locks for ${updates.length} students to Firestore...`);
      try {
         for (const update of updates) {
           await setDoc(update.ref, { isQuotaLocked: update.shouldBeLocked }, { merge: true });
         }
      } catch(err) {
         console.error("Failed to sync quota locks:", err);
      }
    }
  };

  useEffect(() => {
    if (allStudents.length > 0) {
       syncStudentQuotaLocks(allStudents);
    }
  }, [allStudents.length, teacherBilling]);

  useEffect(() => {
    if (activeClassroom) {
      const filtered = allStudents
        .filter(s => s.classId === activeClassroom?.id)
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
      const payload = { 
        [selectedTuitionGrade]: tuitionPackages, 
        tuitionPackages: tuitionPackages,
        defaultPackages: tuitionPackages,
        currency: tuitionCurrency,
        updatedAt: new Date().toISOString() 
      };
      if (activeClassroom?.id) payload[activeClassroom.id] = tuitionPackages;
      if (activeClassroom?.name) payload[activeClassroom.name] = tuitionPackages;

      await setDoc(ref, payload, { merge: true });
      
      setAllGradeFees(prev => ({
        ...prev,
        [selectedTuitionGrade]: tuitionPackages,
        tuitionPackages: tuitionPackages,
        defaultPackages: tuitionPackages
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

  
  const handleResetStudentPassword = async (student) => {
    if (!user?.uid || !student.classId) return;
    if (!(await window.confirmCustom(`Are you sure you want to reset the password for ${student.name}?\n\nThey will be prompted to create a brand new password the next time they log in.`))) return;
    
    const studentRef = doc(
      db,
      'teachers', user.uid,
      'classrooms', student.classId,
      'students', student.id
    );
    try {
      await updateDoc(studentRef, { passwordHash: null });
      alert(`Password reset for ${student.name}! They can now log in and create a new password.`);
    } catch (err) {
      console.error('Reset student password error:', err);
      alert('Failed to reset password. Please try again.');
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
    if (!user?.uid || !targetClassId || !(await window.confirmCustom(`Remove ${studentName} from the class? 🍊`))) return;
    
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
      
      alert(`${studentName} has been removed. ✨¨`);

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
      alert("Oops! Failed to remove student. âŒ");
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

      alert(`Badge "${badgeName}" awarded successfully to ${selectedStudentForBadge.name}! 🎖️✨¨`);
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
      await setDoc(doc(db, 'teachers', user.uid, 'classrooms', activeClassroom?.id), {
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
      const classStudents = allStudents.filter(s => s.classId === activeClassroom?.id);
      const computedStudents = classStudents.map(student => {
         const studentSubs = allSubmissions.filter(sub => 
            normalizeName(sub.studentName) === normalizeName(student.name) && (!sub.classId || sub.classId === activeClassroom?.id)
         );
         const completedCount = studentSubs.length;
         const totalScore = studentSubs.reduce((acc, sub) => acc + (sub.score || 0), 0);
         const basePoints = 100;
         return basePoints + (completedCount * 50) + totalScore;
      });

      const currentClassRawPoints = computedStudents.reduce((acc, points) => acc + points, 0);

      // Save the raw points as the new reset offset in Firestore
      await setDoc(doc(db, 'teachers', user.uid, 'classrooms', activeClassroom?.id), {
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
      alert("Oops! Failed to reset goal progress. â Œ");
    }
  };

  const [isCancellingSub, setIsCancellingSub] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [upgradeTargetPlan, setUpgradeTargetPlan] = useState(null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleCancelSubscription = () => {
    setShowCancelModal(true);
  };

  const executeCancelSubscription = async () => {
    setShowCancelModal(false);
    setIsCancellingSub(true);
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subscriptionId: teacherBilling?.stripeSubscriptionId,
          email: user?.email
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to cancel');
      
      // Update local state immediately for UI responsiveness
      setTeacherBilling(prev => ({ ...prev, cancelAtPeriodEnd: true }));
      
      // Force Firestore update to prevent desync if Stripe webhook fails/delays
      await setDoc(doc(db, 'teachers', user.uid), {
        billing: { cancelAtPeriodEnd: true }
      }, { merge: true }).catch(err => console.error("Firestore sync error:", err));

    } catch (err) {
      console.error(err);
      alert("Error canceling subscription: " + err.message);
    } finally {
      setIsCancellingSub(false);
    }
  };


  const [isResumingSub, setIsResumingSub] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const handleResumeSubscription = () => {
    setShowResumeModal(true);
  };

  const executeResumeSubscription = async () => {
    setShowResumeModal(false);
    setIsResumingSub(true);
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subscriptionId: teacherBilling?.stripeSubscriptionId, 
          email: user?.email,
          resume: true 
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to resume');
      
      // Update local state immediately for UI responsiveness
      setTeacherBilling(prev => ({ ...prev, cancelAtPeriodEnd: false }));
      
      // Force Firestore update to prevent desync if Stripe webhook fails/delays
      await setDoc(doc(db, 'teachers', user.uid), {
        billing: { cancelAtPeriodEnd: false }
      }, { merge: true }).catch(err => console.error("Firestore sync error:", err));

    } catch (err) {
      console.error(err);
      alert("Error resuming subscription: " + err.message);
    } finally {
      setIsResumingSub(false);
    }
  };

  const handleSendRemediationMsg = async () => {
    if (!remediationModalStudent) return;
    if (!remediationMessageContent.trim()) {
      alert("Please write a message first! 📝");
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
    setActiveTab('Homework/Test Builder');
  };

  const getPlanSeatLimit = (planId) => {
    const simulatedPlan = typeof localStorage !== 'undefined' ? localStorage.getItem('hwz_simulated_plan') : null;
    const isMaxed = simulatedPlan && simulatedPlan.endsWith('_maxed');
    const cleanPlan = isMaxed ? simulatedPlan.replace('_maxed', '') : simulatedPlan;
    const effectivePlan = cleanPlan || planId;

    if (isAdminUser && !simulatedPlan) return Infinity;

    if (isMaxed) return allStudents.length || 0; // Blocks new additions without locking existing students!

    if (effectivePlan === 'free_expired' || effectivePlan === 'free_trial' || effectivePlan === 'free') {
      return globalPricing.free_seatLimit ?? 5;
    }
    switch (effectivePlan) {
      case 'option-b-starter': return globalPricing.optionB_starter_maxStudents ?? 20;
      case 'option-b-growth': return globalPricing.optionB_growth_maxStudents ?? 30;
      case 'option-b-school': return globalPricing.optionB_school_maxStudents ?? 150;
      case 'option-a':
      case 'option_a_elastic': {
        return globalPricing.optionA_seatLimit ?? 10;
      }
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
    return calcOptionCAnnual(seats, globalPricing);
  };

  const executeDirectUpgrade = async () => {
    setIsUpgrading(true);
    try {
      const res = await fetch('/api/billing-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: user.uid,
          email: user.email,
          planId: upgradeTargetPlan,
          studentCount: allStudents.length,
          successUrl: window.location.href.split('?')[0],
          cancelUrl: window.location.href.split('?')[0],
          action: 'upgrade',
        })
      });
      const data = await res.json();
      if (data.success) {
        window.location.reload(); // Refresh to show new state
      } else {
        alert(data.error || 'Failed to upgrade plan.');
        setIsUpgrading(false);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upgrade plan.');
      setIsUpgrading(false);
    }
  };

  const handleStripeSession = async (planId, action = 'checkout') => {
    // Prevent double subscriptions by forcing active users to use the Customer Portal for upgrades
    const currentPlanId = teacherBilling?.planId || 'free';
    if (action === 'checkout' && teacherBilling?.status === 'active' && currentPlanId !== 'free' && currentPlanId !== 'free_trial' && currentPlanId !== 'free_expired') {
      setUpgradeTargetPlan(planId);
      return;
    }

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

  const handleSaveDataSettings = async () => {
    try {
      await setDoc(doc(db, 'teachers', user.uid), {
        dataRetentionPeriod: dataRetentionPeriod
      }, { merge: true });
      alert("Data Retention Settings Saved! 💾");
    } catch (err) {
      console.error("Save Data Settings Error:", err);
      alert("Oops! Could not save data settings.");
    }
  };

  const handleManualPurge = async () => {
    if (dataRetentionPeriod === -1) {
      alert("Your retention policy is set to 'Forever'. Please select a timeframe before purging.");
      return;
    }
    const daysStr = dataRetentionPeriod + " Days";
    if (await window.confirmCustom(`Are you sure you want to PERMANENTLY DELETE all Homeworks, Tests, Gradebooks, and Messages older than ${daysStr}? 🗑️ï¸\n\nThis cannot be undone.`)) {
      try {
        const deletedCount = await runPurge(dataRetentionPeriod);
        alert(`Purge Complete! 🧹 Deleted ${deletedCount || 0} old records.`);
      } catch (err) {
        console.error("Purge Error:", err);
        alert("Oops! Something went wrong while purging.");
      }
    }
  };

  const handleSaveZonoKnowledge = async () => {
    if (!isAdminUser) return;
    setIsSavingZono(true);
    try {
      await setDoc(doc(db, 'system', 'zono_knowledge'), {
        text: zonoKnowledgeText,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email || 'admin'
      });
      alert("Zono Brain Knowledge Base saved and published live! 🦖🧠");
    } catch (err) {
      console.error("Save Zono Knowledge Error:", err);
      alert("Oops! Failed to save Zono knowledge base.");
    } finally {
      setIsSavingZono(false);
    }
  };

  const renderSettingsTab = () => {
    return (
      <div className="px-10 py-10 space-y-10 min-h-[calc(100vh-64px)] pb-40 animate-fadeIn relative">
        {/* Header */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50" />
          <div className="relative z-10">
            <h1 className="text-4xl font-black text-[#14532d] tracking-tight flex items-center gap-4">
              <Settings className="w-10 h-10 text-slate-500" />
              Teacher Settings
            </h1>
            <p className="text-slate-500 mt-2 font-medium max-w-2xl">
              Manage your global preferences, data retention policies, and account settings.
            </p>
          </div>
        </div>

        {/* Data Retention & Purge Section */}
        <div className="bg-white rounded-[40px] border border-orange-100 shadow-sm p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-40 transition-opacity group-hover:opacity-70" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Trash2 className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Data Retention & Purging</h2>
                <p className="text-sm font-bold text-slate-500 mt-1">Keep your database lightweight and performant.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-orange-50/50 rounded-3xl border border-orange-100 space-y-4">
                <h3 className="text-sm font-black text-orange-900 uppercase tracking-wider">Automated Cleanup Policy</h3>
                <p className="text-sm text-slate-600 font-medium">
                  Set how long you want to keep historical <b>Homeworks, Tests, Submissions, and Chat Messages</b>. The app will automatically run a background cleanup every 7 days based on this policy.
                </p>
                
                <div className="flex items-center gap-4">
                  <select
                    value={dataRetentionPeriod}
                    onChange={(e) => setDataRetentionPeriod(parseInt(e.target.value))}
                    className="bg-white border-2 border-orange-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-orange-400 w-64 shadow-sm"
                  >
                    <option value={30}>30 Days</option>
                    <option value={90}>3 Months (90 Days)</option>
                    <option value={180}>6 Months (180 Days)</option>
                    <option value={365}>1 Year (365 Days)</option>
                    <option value={-1}>Forever (No Auto-Purge)</option>
                  </select>
                  
                  <button
                    onClick={handleSaveDataSettings}
                    className="px-6 py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white rounded-xl text-sm font-black transition-all shadow-md active:scale-95"
                  >
                    Save Policy
                  </button>
                </div>
                
                {lastPurgedAt && (
                  <p className="text-xs font-bold text-orange-600 mt-2">
                    Last automatic purge ran on: {new Date(lastPurgedAt).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between p-6 bg-rose-50/50 rounded-3xl border border-rose-100">
                <div>
                  <h3 className="text-sm font-black text-rose-700 uppercase tracking-wider mb-1">Manual Purge</h3>
                  <p className="text-sm text-slate-600 font-medium">Instantly delete data older than your selected retention policy.</p>
                </div>
                <button
                  onClick={handleManualPurge}
                  className="px-6 py-3 bg-white border-2 border-rose-200 hover:border-rose-400 text-rose-600 rounded-xl text-sm font-black transition-all shadow-sm flex items-center gap-2 group-hover:shadow-md"
                >
                  <Trash2 className="w-4 h-4" />
                  Purge Data Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Zono Assistant Brain & Knowledge Base Editor (Admin Only) */}
        {isAdminUser && (
          <div className="bg-white rounded-[40px] border border-orange-100 shadow-sm p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-40 transition-opacity group-hover:opacity-70" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md">
                    <img src="/zono.jpg" className="w-10 h-10 object-cover rounded-full" alt="Zono Brain" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-black text-slate-800 tracking-tight">Zono AI Brain & Knowledge Base</h2>
                      <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                        Admin Only
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-500 mt-1">
                      Customize instructions, rules, and app manual guidelines used by the floating Zono AI assistant.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (window.confirm("Reset knowledge base back to default app manual?")) {
                        setZonoKnowledgeText(DEFAULT_ZONO_KNOWLEDGE);
                      }
                    }}
                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-black transition-all flex items-center gap-1.5"
                    title="Reset to Default"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Default
                  </button>
                  <button
                    onClick={handleSaveZonoKnowledge}
                    disabled={isSavingZono}
                    className="px-6 py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white rounded-xl text-sm font-black transition-all shadow-md active:scale-95 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSavingZono ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSavingZono ? 'Saving Live...' : 'Save Knowledge Base'}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Knowledge Base Document (Markdown / Text)
                  </label>
                  <span className="text-xs font-bold text-slate-400">
                    {zonoKnowledgeText.length} characters
                  </span>
                </div>
                <textarea
                  rows={14}
                  value={zonoKnowledgeText}
                  onChange={(e) => setZonoKnowledgeText(e.target.value)}
                  placeholder="Enter custom application instructions, workflow guidelines, and manual rules for Zono..."
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-orange-400 focus:bg-white rounded-2xl p-5 text-xs font-mono text-slate-800 leading-relaxed outline-none transition-all resize-y"
                />
              </div>
            </div>
          </div>
        )}
        
        <GrassBorder />
      </div>
    );
  };

  const renderBillingTab = () => {
    const simulatedPlan = typeof localStorage !== 'undefined' ? localStorage.getItem('hwz_simulated_plan') : null;
    const activePlanId = simulatedPlan || ((teacherBilling && ['active', 'trialing'].includes(teacherBilling.status)) ? teacherBilling.planId : 'free');
    const limit = getPlanSeatLimit(activePlanId);
    
    // Calculator variables
    const optionAAnnual = calcSeats * globalPricing.optionA_perStudentPerMonth * 12;
    let optionBPlanName = '';
    let optionBAnnual = Infinity;
    if (calcSeats >= 11 && calcSeats <= 20) {
      optionBPlanName = 'Option B (Starter)';
      optionBAnnual = 50 * 12;
    } else if (calcSeats >= 21 && calcSeats <= 30) {
      optionBPlanName = 'Option B (Growth)';
      optionBAnnual = 80 * 12;
    }
    const optionCAnnual = calcSeats < 31 ? Infinity : calculateOptionCAnnual(calcSeats);

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
                  {/* Stripe Loading Overlay */}
                  {isRedirectingStripe && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                      <div className="bg-white rounded-[40px] p-10 max-w-sm w-full shadow-2xl flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in duration-300">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                          <Loader2 className="w-24 h-24 text-blue-100 animate-spin absolute" strokeWidth={3} />
                          <Loader2 className="w-24 h-24 text-blue-600 animate-spin absolute" style={{ animationDuration: '2s', animationDirection: 'reverse' }} strokeWidth={2} strokeDasharray="50 100" />
                          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center relative z-10 shadow-inner">
                            <Lock className="w-6 h-6 text-blue-600" strokeWidth={2.5} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Secure Checkout</h3>
                          <p className="text-xs font-bold text-slate-400">Connecting to Stripe banking portal...</p>
                        </div>
                      </div>
                    </div>
                  )}
          
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
                ) : teacherBilling?.cancelAtPeriodEnd ? (
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-50 text-amber-700 border border-amber-200">
                    Status: Cancels at Period End
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
                  ) : teacherBilling?.cancelAtPeriodEnd && teacherBilling?.currentPeriodEnd ? (
                    `Expires: ${new Date(teacherBilling.currentPeriodEnd).toLocaleDateString()}`
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
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Student Seats</span>
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

          {(teacherBilling?.stripeCustomerId || teacherBilling?.stripeSubscriptionId || teacherBilling?.status === 'active' || teacherBilling?.status === 'trialing') && (
            <div className="pt-4 border-t border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <p className="text-xs text-slate-400 font-bold">
                {teacherBilling.cancelAtPeriodEnd 
                  ? "Your subscription is scheduled to cancel at the end of the billing period."
                  : "Manage payment details, update invoice billing emails, or cancel your subscription."}
              </p>
              <div className="flex gap-3">
                
                <button
                  onClick={() => handleStripeSession(null, 'portal')}
                  disabled={isRedirectingStripe}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs shadow-sm transition-all"
                >
                  {isRedirectingStripe ? 'Opening Portal...' : 'Manage Billing 💳'}
                </button>
              </div>
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
                <h3 className="text-lg font-black text-slate-800">Parent/Tutors</h3>
                <p className="text-xs text-slate-400 font-bold">Monthly Elastic Capacity</p>
              </div>
              <div className="text-3xl font-black text-slate-800">
                ${globalPricing.optionA_perStudentPerMonth.toFixed(2)} <span className="text-xs font-bold text-slate-400">/ student / month</span>
              </div>
              <ul className="text-xs text-slate-500 font-bold space-y-2.5">
                <li className="flex items-center gap-2">✨ Pay only for active students</li>
                <li className="flex items-center gap-2">📈 Scales automatically as you add/remove</li>
                <li className="flex items-center gap-2">📄 {globalPricing.optionA_paperQuota} papers / month included</li>
                <li className="flex items-center gap-2">🔓 No long term annual commitment</li>
                <li className="flex items-center gap-2">🎯 Perfect for tutor/mid-semester setups</li>
              </ul>
            </div>
            {activePlanId === 'option-a' ? (
              <div className="flex flex-col gap-2">
                {teacherBilling?.cancelAtPeriodEnd ? (
                  <>
                    <div className="w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-center bg-amber-50 text-amber-600 border border-amber-200">
                      Cancels at end of cycle
                    </div>
                    <button
                      onClick={handleResumeSubscription}
                      disabled={isResumingSub}
                      className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-all border border-emerald-100 flex items-center justify-center gap-2"
                    >
                      {isResumingSub ? 'Resuming...' : 'Resume Plan ♻️'}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest text-center bg-slate-100 text-slate-500 border border-slate-200">
                      Current Plan
                    </div>
                    <button
                      onClick={handleCancelSubscription}
                      disabled={isCancellingSub}
                      className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all border border-rose-100 flex items-center justify-center gap-2"
                    >
                      {isCancellingSub ? 'Canceling...' : 'Unsubscribe 🚫'}
                    </button>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleStripeSession('option-a')}
                disabled={isRedirectingStripe}
                className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100 hover:scale-[1.02]"
              >
                Choose Option A
              </button>
            )}
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
                  { id: 'option-b-starter', name: 'Starter (11-20 students)', price: globalPricing.optionB_starter_price, seats: 20, papers: globalPricing.optionB_starter_paperQuota },
                  { id: 'option-b-growth', name: 'Growth (21-30 students)', price: globalPricing.optionB_growth_price, seats: 30, papers: globalPricing.optionB_growth_paperQuota },
                  
                ].map((tier) => (
                  <div key={tier.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <div>
                      <p className="text-xs font-bold text-slate-700">{tier.name}</p>
                      <p className="text-[10px] font-medium text-slate-400 mb-1">${(tier.price / tier.seats).toFixed(2)} / student equivalent</p>
                      <p className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 inline-block">📄 {tier.papers} papers / mo</p>
                    </div>
                    {activePlanId === tier.id ? (
                      <div className="flex flex-col gap-1 w-24">
                        {teacherBilling?.cancelAtPeriodEnd ? (
                           <>
                             <div className="px-2 py-1 rounded-xl text-[8px] font-black uppercase tracking-wider text-center bg-amber-50 text-amber-600 border border-amber-200 mb-1">
                               Cancels
                             </div>
                             <button
                               onClick={handleResumeSubscription}
                               disabled={isResumingSub}
                               className="px-2 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-all text-center border border-emerald-100"
                             >
                               {isResumingSub ? '...' : 'Resume ♻️'}
                             </button>
                           </>
                        ) : (
                           <>
                             <div className="px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider text-center bg-slate-100 text-slate-500">
                               Active
                             </div>
                             <button
                               onClick={handleCancelSubscription}
                               disabled={isCancellingSub}
                               className="px-2 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all text-center border border-rose-100"
                             >
                               {isCancellingSub ? '...' : 'Unsubscribe'}
                             </button>
                           </>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStripeSession(tier.id)}
                        disabled={isRedirectingStripe}
                        className="px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all bg-orange-600 hover:bg-orange-700 text-white shadow-sm"
                      >
                        {`${tier.price}/mo`}
                      </button>
                    )}
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
                  <span>31-100 students</span>
                  <span>$24 / student / yr</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-slate-600">
                  <span>101-500 students</span>
                  <span>$20 / student / yr</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-slate-600">
                  <span>501-1,000 students</span>
                  <span>$16 / student / yr</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-slate-600">
                  <span>1,001+ students</span>
                  <span>$14 / student / yr</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1.5 rounded mt-2 border border-emerald-100">
                  <span>Includes</span>
                  <span>📄 {globalPricing.optionC_paperQuota} papers / year</span>
                </div>
              </div>
            </div>
            {activePlanId === 'option-c' ? (
              <div className="flex flex-col gap-2">
                {teacherBilling?.cancelAtPeriodEnd ? (
                  <>
                    <div className="w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-center bg-amber-50 text-amber-600 border border-amber-200">
                      Cancels at end of cycle
                    </div>
                    <button
                      onClick={handleResumeSubscription}
                      disabled={isResumingSub}
                      className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-all border border-emerald-100 flex items-center justify-center gap-2"
                    >
                      {isResumingSub ? 'Resuming...' : 'Resume Plan ♻️'}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest text-center bg-slate-100 text-slate-500 border border-slate-200">
                      Current Plan
                    </div>
                    <button
                      onClick={handleCancelSubscription}
                      disabled={isCancellingSub}
                      className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all border border-rose-100 flex items-center justify-center gap-2"
                    >
                      {isCancellingSub ? 'Canceling...' : 'Unsubscribe 🚫'}
                    </button>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleStripeSession('option-c')}
                disabled={isRedirectingStripe}
                className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100 hover:scale-[1.02]"
              >
                Choose Option C
              </button>
            )}
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
                  <span>{optionCAnnual === Infinity ? 'Not Available' : `$${optionCAnnual.toLocaleString()} / year`}</span>
                </div>
              </div>

              {/* Recommendation Alert */}
              <div className="bg-orange-50/70 border border-orange-200/50 rounded-2xl p-5 flex items-start gap-4">
                <div className="text-2xl mt-0.5">💡</div>
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
    const totalHomeworks = adminTeachers.reduce((sum, t) => sum + (t.homeworkCount || 0), 0);

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
          <AdminPricingSettings />
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
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

              <div className="bg-white border-4 border-violet-100 rounded-[32px] p-6 space-y-4 shadow-lg relative overflow-hidden group">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-violet-50 rounded-full blur-xl group-hover:scale-150 transition-transform" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Total Papers Created</span>
                  <div className="w-10 h-10 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-violet-700">{totalHomeworks}</h3>
                  <p className="text-[10px] font-bold text-slate-400">Total generated assignments</p>
                </div>
              </div>

              <div className="bg-white border-4 border-purple-100 rounded-[32px] p-6 space-y-4 shadow-lg relative overflow-hidden group">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-50 rounded-full blur-xl group-hover:scale-150 transition-transform" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Trials Status</span>
                  <div className="w-10 h-10 bg-purple-50 text-purple-650 rounded-xl flex items-center justify-center">
                    <Wand2 className="w-5 h-5" />
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
                      <th className="p-4 cursor-pointer hover:text-purple-700 select-none text-center" onClick={() => handleAdminSort('homeworkCount')}>Papers</th>
                      <th className="p-4 cursor-pointer hover:text-purple-700 select-none" onClick={() => handleAdminSort('activePlanId')}>Plan Model</th>
                      <th className="p-4 cursor-pointer hover:text-purple-700 select-none text-right" onClick={() => handleAdminSort('mrr')}>Est. MRR</th>
                      <th className="p-4 cursor-pointer hover:text-purple-700 select-none text-center" onClick={() => handleAdminSort('conversionStatus')}>Conversion Status</th>
                      <th className="p-4 text-center text-[9px]">Super User</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="p-8 text-center text-slate-400 font-bold">
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
                          <td className="p-4 text-center font-bold text-slate-800">
                            {teacher.homeworkCount}
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
                          <td className="p-4 text-center">
                            <label className="relative inline-flex items-center cursor-pointer group" title={teacher.isSuperUser ? 'Remove super user access' : 'Grant super user (unlimited) access'}>
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={!!teacher.isSuperUser}
                                onChange={() => handleToggleSuperUser(teacher.id, teacher.isSuperUser)}
                              />
                              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-500 group-hover:ring-2 group-hover:ring-violet-200 transition-all" />
                            </label>
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

        {/* ───────────────────────────────────────────────────── */}
        {/* REPORT 1: MRR TREND CHART                            */}
        {/* ───────────────────────────────────────────────────── */}
        {(() => {
          const now = new Date();
          const monthLabels = [];
          const mrrByMonth = [];
          for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            monthLabels.push(d.toLocaleString('default', { month: 'short', year: '2-digit' }));
            // Estimate: teachers whose billing started on or before this month and are still active
            const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
            const mrr = adminTeachers.reduce((sum, t) => {
              if (!t.isPaid) return sum;
              const start = t.billing?.createdAt ? new Date(t.billing.createdAt) : null;
              const end = t.billing?.currentPeriodEnd ? new Date(t.billing.currentPeriodEnd) : null;
              if (start && start <= monthEnd && (!end || end >= d)) return sum + t.mrr;
              return sum;
            }, 0);
            mrrByMonth.push(mrr);
          }
          const maxMRR = Math.max(...mrrByMonth, 1);
          const chartH = 120;
          const chartW = 700;
          const pts = mrrByMonth.map((v, i) => {
            const x = (i / (mrrByMonth.length - 1)) * (chartW - 40) + 20;
            const y = chartH - 20 - ((v / maxMRR) * (chartH - 30));
            return { x, y, v };
          });
          const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
          const areaD = `${pathD} L ${pts[pts.length-1].x} ${chartH - 20} L ${pts[0].x} ${chartH - 20} Z`;
          return (
            <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full tracking-widest inline-block">Revenue Trend</span>
                  <h3 className="text-xl font-black text-slate-800 mt-1">📈 MRR Over Time (12 Months)</h3>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-emerald-600">${mrrByMonth[mrrByMonth.length - 1].toFixed(0)}</p>
                  <p className="text-[10px] font-bold text-slate-400">Current Month MRR</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <svg viewBox={`0 0 ${chartW} ${chartH + 20}`} className="w-full" style={{ minWidth: 400 }}>
                  {/* Grid lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                    const y = chartH - 20 - pct * (chartH - 30);
                    return (
                      <g key={i}>
                        <line x1="20" y1={y} x2={chartW - 20} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                        <text x="14" y={y + 4} fontSize="7" fill="#94a3b8" textAnchor="end">${(maxMRR * pct).toFixed(0)}</text>
                      </g>
                    );
                  })}
                  {/* Area fill */}
                  <path d={areaD} fill="url(#mrrGrad)" opacity="0.3" />
                  <defs>
                    <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Line */}
                  <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Points */}
                  {pts.map((p, i) => (
                    <g key={i}>
                      <circle cx={p.x} cy={p.y} r="4" fill="#10b981" />
                      <text x={p.x} y={chartH + 10} fontSize="7" fill="#64748b" textAnchor="middle">{monthLabels[i]}</text>
                    </g>
                  ))}
                </svg>
              </div>
              <div className="flex gap-6 pt-2 border-t border-slate-50">
                <div>
                  <p className="text-xs font-black text-slate-800">${mrrByMonth.reduce((a,b)=>a+b,0).toFixed(0)}</p>
                  <p className="text-[10px] font-bold text-slate-400">12-Month Total</p>
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800">${(mrrByMonth[mrrByMonth.length-1] * 12).toFixed(0)}</p>
                  <p className="text-[10px] font-bold text-slate-400">Projected ARR</p>
                </div>
                <div>
                  <p className={`text-xs font-black ${mrrByMonth[mrrByMonth.length-1] >= mrrByMonth[mrrByMonth.length-2] ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {mrrByMonth[mrrByMonth.length-2] > 0 ? `${mrrByMonth[mrrByMonth.length-1] >= mrrByMonth[mrrByMonth.length-2] ? '+' : ''}${(((mrrByMonth[mrrByMonth.length-1] - mrrByMonth[mrrByMonth.length-2]) / mrrByMonth[mrrByMonth.length-2]) * 100).toFixed(1)}%` : 'N/A'}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400">Month-over-Month</p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ───────────────────────────────────────────────────── */}
        {/* REPORT 2: TOP REVENUE GENERATORS                     */}
        {/* ───────────────────────────────────────────────────── */}
        {(() => {
          const topRevenue = [...adminTeachers]
            .filter(t => t.mrr > 0)
            .sort((a, b) => b.mrr - a.mrr)
            .slice(0, 10);
          const totalMRRAll = adminTeachers.reduce((s, t) => s + t.mrr, 0);
          const planLabel = id => {
            if (id === 'option-a') return 'Per-Student';
            if (id === 'option-b-starter') return 'Starter';
            if (id === 'option-b-growth') return 'Growth';
            if (id === 'option-b-school') return 'School';
            if (id === 'option-c') return 'Annual';
            return 'Free';
          };
          const planColor = id => {
            if (id === 'option-b-school' || id === 'option-c') return 'bg-violet-100 text-violet-700';
            if (id === 'option-b-growth') return 'bg-blue-100 text-blue-700';
            if (id === 'option-b-starter') return 'bg-sky-100 text-sky-700';
            if (id === 'option-a') return 'bg-emerald-100 text-emerald-700';
            return 'bg-slate-100 text-slate-500';
          };
          return (
            <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-violet-600 bg-violet-50 border border-violet-100 px-3 py-1 rounded-full tracking-widest inline-block">Revenue Leaders</span>
                  <h3 className="text-xl font-black text-slate-800 mt-1">🏆 Top Revenue Generators</h3>
                </div>
                <p className="text-[10px] font-bold text-slate-400">Top 10 by Monthly Revenue</p>
              </div>
              {topRevenue.length === 0 ? (
                <p className="text-sm text-slate-400 font-bold text-center py-8">No paid subscribers yet</p>
              ) : (
                <div className="space-y-2">
                  {topRevenue.map((t, idx) => {
                    const pct = totalMRRAll > 0 ? ((t.mrr / totalMRRAll) * 100).toFixed(1) : 0;
                    const barW = totalMRRAll > 0 ? (t.mrr / topRevenue[0].mrr) * 100 : 0;
                    return (
                      <div key={t.id} className="flex items-center gap-3 group">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${idx === 0 ? 'bg-amber-400 text-white' : idx === 1 ? 'bg-slate-300 text-white' : idx === 2 ? 'bg-orange-300 text-white' : 'bg-slate-100 text-slate-500'}`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-black text-slate-800 truncate">{t.name}</span>
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${planColor(t.activePlanId)}`}>{planLabel(t.activePlanId)}</span>
                            <span className="text-[9px] font-bold text-slate-400 ml-auto flex-shrink-0">{t.studentCount} students · {pct}% of MRR</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full transition-all duration-700" style={{ width: `${barW}%` }} />
                          </div>
                        </div>
                        <div className="text-sm font-black text-emerald-600 flex-shrink-0 w-16 text-right">${t.mrr.toFixed(2)}</div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="pt-3 border-t border-slate-50 flex gap-6">
                <div>
                  <p className="text-xs font-black text-slate-800">${topRevenue.reduce((s,t)=>s+t.mrr,0).toFixed(2)}</p>
                  <p className="text-[10px] font-bold text-slate-400">Top-10 MRR Total</p>
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800">{totalMRRAll > 0 ? ((topRevenue.reduce((s,t)=>s+t.mrr,0)/totalMRRAll)*100).toFixed(1) : 0}%</p>
                  <p className="text-[10px] font-bold text-slate-400">Of Total MRR</p>
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800">{topRevenue.length > 0 ? `$${(topRevenue.reduce((s,t)=>s+t.mrr,0)/topRevenue.length).toFixed(2)}` : '$0'}</p>
                  <p className="text-[10px] font-bold text-slate-400">Avg MRR per Top-10</p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ───────────────────────────────────────────────────── */}
        {/* REPORT 3: TOP PAPER CREATORS                         */}
        {/* ───────────────────────────────────────────────────── */}
        {(() => {
          const topCreators = [...adminTeachers]
            .filter(t => (t.homeworkCount || 0) > 0)
            .sort((a, b) => (b.homeworkCount || 0) - (a.homeworkCount || 0))
            .slice(0, 10);
          const maxHW = topCreators[0]?.homeworkCount || 1;
          return (
            <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full tracking-widest inline-block">Engagement Leaders</span>
                  <h3 className="text-xl font-black text-slate-800 mt-1">📝 Top Paper Creators</h3>
                </div>
                <p className="text-[10px] font-bold text-slate-400">Most Engaged Teachers</p>
              </div>
              {topCreators.length === 0 ? (
                <p className="text-sm text-slate-400 font-bold text-center py-8">No homework data yet</p>
              ) : (
                <div className="space-y-2">
                  {topCreators.map((t, idx) => {
                    const barW = (t.homeworkCount / maxHW) * 100;
                    const createdDate = t.createdAt ? new Date(t.createdAt) : null;
                    const weeksActive = createdDate ? Math.max(1, Math.floor((new Date() - createdDate) / (7 * 24 * 60 * 60 * 1000))) : 1;
                    const perWeek = (t.homeworkCount / weeksActive).toFixed(1);
                    return (
                      <div key={t.id} className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${idx === 0 ? 'bg-amber-400 text-white' : idx === 1 ? 'bg-slate-300 text-white' : idx === 2 ? 'bg-orange-300 text-white' : 'bg-slate-100 text-slate-500'}`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-black text-slate-800 truncate">{t.name}</span>
                            {t.isPaid
                              ? <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Paid</span>
                              : t.trialDaysLeft >= 0
                                ? <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">Trial</span>
                                : <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700">Expired</span>
                            }
                            <span className="text-[9px] font-bold text-slate-400 ml-auto flex-shrink-0">{perWeek}/wk · {t.studentCount} students</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-700" style={{ width: `${barW}%` }} />
                          </div>
                        </div>
                        <div className="text-sm font-black text-orange-600 flex-shrink-0 w-10 text-right">{t.homeworkCount}</div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="pt-3 border-t border-slate-50 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-black text-slate-800">{adminTeachers.reduce((s,t)=>s+(t.homeworkCount||0),0)}</p>
                  <p className="text-[10px] font-bold text-slate-400">Total Papers Created</p>
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800">{adminTeachers.filter(t=>t.homeworkCount>0).length}</p>
                  <p className="text-[10px] font-bold text-slate-400">Active Creators</p>
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800">
                    {adminTeachers.filter(t=>t.homeworkCount>0).length > 0
                      ? (adminTeachers.reduce((s,t)=>s+(t.homeworkCount||0),0) / adminTeachers.filter(t=>t.homeworkCount>0).length).toFixed(1)
                      : 0}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400">Avg Papers/Teacher</p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ───────────────────────────────────────────────────── */}
        {/* REPORT 4: TRIAL FUNNEL & CHURN RISK                  */}
        {/* ───────────────────────────────────────────────────── */}
        {(() => {
          const total = adminTeachers.length;
          const paid = adminTeachers.filter(t => t.isPaid).length;
          const activeTrial = adminTeachers.filter(t => !t.isPaid && t.trialDaysLeft >= 0).length;
          const expiredUnconverted = adminTeachers.filter(t => !t.isPaid && t.trialDaysLeft < 0).length;
          const highRisk = adminTeachers.filter(t => !t.isPaid && t.trialDaysLeft >= 0 && t.trialDaysLeft <= 2 && (t.homeworkCount || 0) === 0);
          const medRisk = adminTeachers.filter(t => !t.isPaid && t.trialDaysLeft > 2 && t.trialDaysLeft <= 5);
          const convRate = total > 0 ? ((paid / total) * 100).toFixed(1) : 0;
          const funnelSteps = [
            { label: 'Total Signups', count: total, color: 'bg-slate-400', pct: 100 },
            { label: 'Active Trial', count: activeTrial, color: 'bg-amber-400', pct: total > 0 ? (activeTrial/total)*100 : 0 },
            { label: 'Converted Paid', count: paid, color: 'bg-emerald-500', pct: total > 0 ? (paid/total)*100 : 0 },
            { label: 'Expired (Lost)', count: expiredUnconverted, color: 'bg-rose-400', pct: total > 0 ? (expiredUnconverted/total)*100 : 0 },
          ];
          return (
            <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full tracking-widest inline-block">Funnel Analysis</span>
                  <h3 className="text-xl font-black text-slate-800 mt-1">🔻 Trial Funnel & Churn Risk</h3>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-emerald-600">{convRate}%</p>
                  <p className="text-[10px] font-bold text-slate-400">Conversion Rate</p>
                </div>
              </div>
              {/* Funnel bars */}
              <div className="space-y-2">
                {funnelSteps.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-500 w-32 flex-shrink-0">{s.label}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
                      <div className={`h-full ${s.color} rounded-full flex items-center justify-end pr-2 transition-all duration-700`} style={{ width: `${Math.max(s.pct, 2)}%` }}>
                        <span className="text-[9px] font-black text-white">{s.count}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 w-10 text-right">{s.pct.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
              {/* Churn Risk Alerts */}
              {(highRisk.length > 0 || medRisk.length > 0) && (
                <div className="space-y-2 pt-2 border-t border-slate-50">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">⚠️ At-Risk Teachers — Reach Out Now</p>
                  {highRisk.map(t => (
                    <div key={t.id} className="flex items-center gap-3 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-2.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-black text-rose-800 truncate block">{t.name}</span>
                        <span className="text-[9px] font-bold text-rose-500">{t.email} · Trial expires in {t.trialDaysLeft}d · 0 papers created</span>
                      </div>
                      <span className="text-[9px] font-black bg-rose-200 text-rose-700 px-2 py-0.5 rounded-full flex-shrink-0">🔴 HIGH RISK</span>
                    </div>
                  ))}
                  {medRisk.map(t => (
                    <div key={t.id} className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-2.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-black text-amber-800 truncate block">{t.name}</span>
                        <span className="text-[9px] font-bold text-amber-600">{t.email} · Trial expires in {t.trialDaysLeft}d</span>
                      </div>
                      <span className="text-[9px] font-black bg-amber-200 text-amber-700 px-2 py-0.5 rounded-full flex-shrink-0">🟡 MED RISK</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* ───────────────────────────────────────────────────── */}
        {/* REPORT 5: UPCOMING RENEWALS CALENDAR (30-day)        */}
        {/* ───────────────────────────────────────────────────── */}
        {(() => {
          const now = new Date();
          const in30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          const renewals = adminTeachers
            .filter(t => t.isPaid && t.billing?.currentPeriodEnd)
            .map(t => ({ ...t, renewDate: new Date(t.billing.currentPeriodEnd) }))
            .filter(t => t.renewDate >= now && t.renewDate <= in30)
            .sort((a, b) => a.renewDate - b.renewDate);
          const expiringTrials = adminTeachers
            .filter(t => !t.isPaid && t.trialDaysLeft >= 0 && t.trialDaysLeft <= 30)
            .sort((a, b) => a.trialDaysLeft - b.trialDaysLeft);
          const cancelledPaid = adminTeachers
            .filter(t => t.billing?.status === 'canceled' && t.billing?.currentPeriodEnd)
            .map(t => ({ ...t, endDate: new Date(t.billing.currentPeriodEnd) }))
            .filter(t => t.endDate >= now)
            .sort((a, b) => a.endDate - b.endDate);
          const renewalRevenue = renewals.reduce((s, t) => s + t.mrr, 0);
          return (
            <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full tracking-widest inline-block">30-Day Outlook</span>
                  <h3 className="text-xl font-black text-slate-800 mt-1">📅 Renewals & Expiry Calendar</h3>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-blue-600">${renewalRevenue.toFixed(0)}</p>
                  <p className="text-[10px] font-bold text-slate-400">Revenue Renewing in 30d</p>
                </div>
              </div>

              {/* Renewals */}
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">✅ Paid Renewals ({renewals.length})</p>
                {renewals.length === 0 && <p className="text-xs text-slate-400 font-bold">No renewals in next 30 days</p>}
                {renewals.map(t => {
                  const daysUntil = Math.ceil((t.renewDate - now) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={t.id} className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-black text-emerald-800 truncate block">{t.name}</span>
                        <span className="text-[9px] font-bold text-emerald-600">Renews {t.renewDate.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })} · {t.studentCount} students</span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-black text-emerald-700">${t.mrr.toFixed(2)}/mo</p>
                        <p className="text-[9px] font-bold text-emerald-500">in {daysUntil}d</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Expiring Trials */}
              {expiringTrials.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">⏳ Trials Expiring ({expiringTrials.length})</p>
                  {expiringTrials.map(t => (
                    <div key={t.id} className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-2.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-black text-amber-800 truncate block">{t.name}</span>
                        <span className="text-[9px] font-bold text-amber-600">{t.email} · {t.homeworkCount} papers · {t.studentCount} students</span>
                      </div>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ${t.trialDaysLeft <= 2 ? 'bg-rose-200 text-rose-700' : 'bg-amber-200 text-amber-700'}`}>
                        {t.trialDaysLeft}d left
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Cancellations */}
              {cancelledPaid.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">🚫 Cancellations (access until period end)</p>
                  {cancelledPaid.map(t => (
                    <div key={t.id} className="flex items-center gap-3 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-2.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-black text-rose-800 truncate block">{t.name}</span>
                        <span className="text-[9px] font-bold text-rose-500">Access until {t.endDate.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</span>
                      </div>
                      <p className="text-xs font-black text-rose-600 flex-shrink-0">-${t.mrr.toFixed(2)}/mo lost</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* ───────────────────────────────────────────────────── */}
        {/* REPORT 6: REVENUE BY SUBJECT                         */}
        {/* ───────────────────────────────────────────────────── */}
        {(() => {
          const subjStats = {};
          adminTeachers.forEach(t => {
            const subjects = Object.keys(t.subjectCounts || {});
            const totalHw = t.homeworkCount || 1;
            subjects.forEach(s => {
              const subjName = s || 'Other';
              if (!subjStats[subjName]) subjStats[subjName] = { count: 0, hw: 0, mrr: 0, paidTeachers: 0 };
              subjStats[subjName].count += 1;
              subjStats[subjName].hw += t.subjectCounts[s];
              if (t.isPaid) {
                subjStats[subjName].paidTeachers += 1;
                subjStats[subjName].mrr += t.mrr * (t.subjectCounts[s] / totalHw);
              }
            });
          });
          const topSubjects = Object.entries(subjStats)
            .sort((a, b) => b[1].mrr - a[1].mrr)
            .slice(0, 8);
            
          const totalAttributedMRR = topSubjects.reduce((s, a) => s + a[1].mrr, 0);

          return (
            <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-pink-600 bg-pink-50 border border-pink-100 px-3 py-1 rounded-full tracking-widest inline-block">Content Attribution</span>
                  <h3 className="text-xl font-black text-slate-800 mt-1">📚 Revenue by Subject</h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400">Attributed by % of total papers</p>
                </div>
              </div>
              
              {topSubjects.length === 0 ? (
                <p className="text-sm text-slate-400 font-bold text-center py-8">No subject data available</p>
              ) : (
                <div className="space-y-3 mt-4">
                  {topSubjects.map(([subj, stats], idx) => {
                    const pct = totalAttributedMRR > 0 ? ((stats.mrr / totalAttributedMRR) * 100).toFixed(1) : 0;
                    return (
                      <div key={subj} className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-xs font-black">
                          <span className="text-slate-800 flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-pink-500' : idx < 3 ? 'bg-purple-400' : 'bg-slate-300'}`}></span>
                            {subj}
                          </span>
                          <span className="text-pink-600">${stats.mrr.toFixed(2)} <span className="text-[9px] text-slate-400 font-bold">({pct}%)</span></span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 w-32 text-right">
                            {stats.paidTeachers} paid users · {stats.hw} papers
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* ───────────────────────────────────────────────────── */}
        {/* REPORT 7: ENGAGEMENT-TO-REVENUE CORRELATION          */}
        {/* ───────────────────────────────────────────────────── */}
        {(() => {
          const buckets = [
            { label: '0 Papers', min: 0, max: 0, teachers: 0, paid: 0, mrr: 0 },
            { label: '1-5 Papers', min: 1, max: 5, teachers: 0, paid: 0, mrr: 0 },
            { label: '6-20 Papers', min: 6, max: 20, teachers: 0, paid: 0, mrr: 0 },
            { label: '21+ Papers', min: 21, max: 99999, teachers: 0, paid: 0, mrr: 0 },
          ];
          adminTeachers.forEach(t => {
            const count = t.homeworkCount || 0;
            const b = buckets.find(b => count >= b.min && count <= b.max);
            if (b) {
              b.teachers++;
              if (t.isPaid) {
                b.paid++;
                b.mrr += t.mrr;
              }
            }
          });

          return (
            <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full tracking-widest inline-block">Engagement Analytics</span>
                  <h3 className="text-xl font-black text-slate-800 mt-1">⚡ Engagement vs Conversion</h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400">Value of user activity</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                {buckets.map((b, i) => {
                  const convRate = b.teachers > 0 ? ((b.paid / b.teachers) * 100).toFixed(1) : 0;
                  return (
                    <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center text-center space-y-2">
                      <h4 className="text-xs font-black text-slate-800 bg-white border border-slate-200 px-3 py-1 rounded-full">{b.label}</h4>
                      <div className="py-2">
                        <p className="text-2xl font-black text-indigo-600">{convRate}%</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Conversion</p>
                      </div>
                      <div className="w-full h-px bg-slate-200 my-1"></div>
                      <div className="w-full flex justify-between px-1">
                        <div className="text-left">
                          <p className="text-[10px] font-black text-slate-700">${b.mrr.toFixed(0)}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase">MRR</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-700">{b.paid}/{b.teachers}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase">Paid Users</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ───────────────────────────────────────────────────── */}
        {/* REPORT 5: REVENUE BY REGION / LOCALE                 */}
        {/* ───────────────────────────────────────────────────── */}
        {(() => {
          const regions = {};
          
          const mapTimeZoneToRegion = (tz) => {
             if (!tz || tz === 'Unknown') return 'Unknown / Global';
             if (tz.includes('Australia') || tz.includes('Pacific/Auckland')) return 'Australia & Oceania';
             if (tz.includes('America/')) return 'North America';
             if (tz.includes('Europe/') || tz.includes('London')) return 'Europe & UK';
             if (tz.includes('Asia/')) return 'Asia';
             if (tz.includes('Africa/')) return 'Africa';
             return tz.split('/')[0] || 'Unknown / Global';
          };

          adminTeachers.forEach(t => {
             // Fallback to billing country if Stripe ever adds it, else use the timezone we capture on load
             let regionName = 'Unknown / Global';
             if (t.billing?.country) {
                regionName = t.billing.country;
             } else if (t.location?.timeZone) {
                regionName = mapTimeZoneToRegion(t.location.timeZone);
             }

             if (!regions[regionName]) regions[regionName] = { mrr: 0, count: 0 };
             
             // Count any teacher towards the region, not just paid ones
             if (t.isPaid) {
               regions[regionName].mrr += t.mrr;
               regions[regionName].count++;
             }
          });

          const sorted = Object.entries(regions)
            .filter(a => a[1].mrr > 0)
            .sort((a,b) => b[1].mrr - a[1].mrr);

          return (
            <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-cyan-600 bg-cyan-50 border border-cyan-100 px-3 py-1 rounded-full tracking-widest inline-block">Geographic Data</span>
                  <h3 className="text-xl font-black text-slate-800 mt-1">🌍 Revenue by Region</h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400">Based on billing data</p>
                </div>
              </div>
              
              {sorted.length === 0 ? (
                <p className="text-sm text-slate-400 font-bold text-center py-8">No regional revenue data yet</p>
              ) : (
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {sorted.map(([country, stats], i) => (
                    <div key={country} className="flex items-center gap-3 bg-cyan-50/30 border border-cyan-100/50 rounded-2xl p-3">
                      <div className="text-2xl">{country === 'Unknown / Global' ? '🌐' : '📍'}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-slate-800 truncate">{country}</p>
                        <p className="text-[9px] font-bold text-slate-400">{stats.count} paid subscriptions</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-cyan-600">${stats.mrr.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="bg-slate-50 rounded-xl p-3 text-[10px] font-bold text-slate-500 flex gap-2 items-start mt-4">
                <span>💡</span>
                <p>Regions are automatically inferred from the teacher's browser timezone when they log in to the dashboard.</p>
              </div>
            </div>
          );
        })()}

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
             const classStudents = allStudents.filter(s => !activeClassroom || s.classId === activeClassroom?.id);
             const classHomeworks = allHomeworks.filter(hw => hw.status === 'published' && (!activeClassroom || hw.assignedClassId === activeClassroom?.id));
             const pendingDrafts = allHomeworks.filter(hw => hw.status === 'draft' && (!activeClassroom || hw.assignedClassId === activeClassroom?.id));
             const classSubmissions = allSubmissions.filter(sub => {
                if (!activeClassroom) return true;
                const hw = allHomeworks.find(h => h.id === sub.homeworkId);
                const subClassId = sub.classId || hw?.assignedClassId;
                return subClassId === activeClassroom.id;
             });

             const computedStudents = classStudents.map(student => {
                const studentSubs = allSubmissions.filter(sub => 
                   normalizeName(sub.studentName) === normalizeName(student.name) && (!sub.classId || sub.classId === activeClassroom?.id)
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
             const targetTitle = activeClassroom?.goalTitle || 'Dino Pizza Party! ðŸ•';
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

                          const simulatedPlan = typeof localStorage !== 'undefined' ? localStorage.getItem('hwz_simulated_plan') : null;
             const activePlanId = simulatedPlan || ((teacherBilling && ['active', 'trialing'].includes(teacherBilling.status)) ? teacherBilling.planId : 'free');
             const seatLimit = getPlanSeatLimit(activePlanId);
             const cleanPlanIdForClass = activePlanId ? activePlanId.replace('_maxed', '') : 'free';
             const classLimit = (isAdminUser && !simulatedPlan) ? Infinity : ((cleanPlanIdForClass === 'free' || cleanPlanIdForClass === 'free_trial' || cleanPlanIdForClass === 'free_expired') ? 2 : Infinity);
             
             const quotaInfo = checkCanGeneratePaper({
                user,
                isAdmin: isAdminUser,
                isSuperUser: false,
                activePlanId,
                allHomeworks,
                topUpCredits: teacherData?.topUpCredits || 0
             });

             return (
                <div className="px-6 py-6 space-y-6 pb-20 relative min-h-[calc(100vh-64px)] bg-[#FAF9FF]">

                   {/* 3-Step Teacher Quick-Start Launchpad */}
                   <TeacherQuickStartLaunchpad
                     classrooms={classrooms}
                     allStudents={allStudents}
                     allHomeworks={allHomeworks}
                     teacherCode={user?.teacherCode || teacherData?.teacherCode || user?.uid?.slice(0, 6).toUpperCase()}
                     onNavigateTab={setActiveTab}
                     onOpenCreateClass={() => {
                       setActiveTab('My Classes');
                       setShowAddClassModal(true);
                     }}
                   />

                   {/* Limits & Quotas Status Bar */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border border-[#E9E3FF] p-6 rounded-[32px] shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl animate-pulse">
                          🏫
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Classrooms Remaining</span>
                          <span className="text-lg font-black text-slate-800">
                            {classLimit === Infinity ? 'Unlimited (∞)' : `${Math.max(0, classLimit - classrooms.length)} / ${classLimit} Left`}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium block">
                            {classrooms.length} created
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-xl animate-pulse">
                          👥
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Student Seats Remaining</span>
                          <span className="text-lg font-black text-slate-800">
                            {seatLimit === Infinity ? 'Unlimited (∞)' : `${Math.max(0, seatLimit - allStudents.length)} / ${seatLimit} Left`}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium block">
                            {allStudents.length} seats filled
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-xl animate-pulse">
                          📄
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Papers Remaining</span>
                          <span className="text-lg font-black text-slate-800">
                            {quotaInfo.isUnlimited ? 'Unlimited (∞)' : `${Math.max(0, quotaInfo.limit - quotaInfo.usage)} / ${quotaInfo.limit} Left`}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium block">
                            {quotaInfo.usage} papers generated
                          </span>
                        </div>
                      </div>
                   </div>
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
                                     <h3 className="text-xl font-black text-[#3C2E75]">
                                       {targetTitle}
                                       <button 
                                          onClick={() => {
                                             setNewGoalTitle(targetTitle);
                                             setNewGoalTarget(targetGoal);
                                             setNewGoalTrack(activeClassroom?.activeTrack || 'auto');
                                             setIsEditingGoal(true);
                                          }}
                                          className="ml-2 inline-flex items-center text-[#C64F33] hover:text-[#FF7043]"
                                       >
                                          <Pencil className="w-3.5 h-3.5" />
                                       </button>
                                     </h3>
                                  </div>
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
                                  <span className="text-3xl animate-bounce">📁</span>
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
                                                 setActiveTab('Homework/Test Builder');
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
                             ✨ On Track ({onTrackNum})
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
                             await addDoc(collection(db, 'messages'), {
                             teacherId: user.uid, senderId: user.uid,
                             senderName: user.displayName || 'Teacher', senderRole: 'teacher',
                             recipientType: 'student', recipientId: d.student.name, recipientName: d.student.name,
                             subject: '⏳ Homework Reminder!',
                             content: `Hi ${d.student.name}! You have ${d.missing.length} assignment${d.missing.length > 1 ? 's' : ''} still to complete. Please check your homework portal and submit soon! 🚀`,
                             createdAt: new Date().toISOString()
                             });
                             alert(`✨ Reminder sent to ${d.student.name}!`);
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
                             <span className="text-lg">✨</span>
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
                             <ChevronLeft className="w-3 h-3" />
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
                             <ChevronRight className="w-3 h-3" />
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

                </div>
             );
          }

         case 'My Classes':
            {
             const simulatedPlan = typeof localStorage !== 'undefined' ? localStorage.getItem('hwz_simulated_plan') : null;
             const activePlanId = simulatedPlan || ((teacherBilling && ['active', 'trialing'].includes(teacherBilling.status)) ? teacherBilling.planId : 'free');
             const cleanPlanIdForClass = activePlanId ? activePlanId.replace('_maxed', '') : 'free';
             const classLimit = (isAdminUser && !simulatedPlan) ? Infinity : ((cleanPlanIdForClass === 'free' || cleanPlanIdForClass === 'free_trial' || cleanPlanIdForClass === 'free_expired') ? 2 : Infinity);
             const isClassLimitReached = classrooms.length >= classLimit;

             return (
               <div className="px-10 py-10 space-y-12 relative min-h-[calc(100vh-64px)] pb-40">
                  <div className="flex items-center justify-between">
                     <div>
                        <h1 className="text-4xl font-black text-[#14532d] tracking-tight">My Classes</h1>
                        <p className="text-sm font-bold text-[#166534] italic">Manage your classes and view class details.</p>
                     </div>
                     <div className="flex items-center gap-6">
                        <button 
                           onClick={() => {
                             if (isClassLimitReached) {
                               setShowUpgradeAlert(true);
                             } else {
                               setShowAddClassModal(true);
                             }
                           }}
                           className={`px-8 py-4 rounded-3xl font-black text-sm shadow-xl flex items-center gap-3 transition-all ${
                             isClassLimitReached 
                               ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none border border-slate-200' 
                               : 'bg-gradient-to-r from-[#EA580C] to-[#EA580C] text-white shadow-orange-100 hover:scale-105 cursor-pointer'
                           }`}
                         >
                            {isClassLimitReached ? <Lock className="w-5 h-5" /> : <Plus className="w-5 h-5" />} 
                            {isClassLimitReached ? `Limit Reached (${classrooms.length}/${classLimit} Classes)` : 'Create Class'}
                         </button>
                        <div className="w-32 h-32 relative">
                           <img src="/dino-reading.png" className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl" alt="Mascot" />
                           <div className="absolute -top-2 -right-2">
                              <Star className="w-6 h-6 text-yellow-400 fill-current animate-pulse" />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
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
                              setEditChatDisabled(room.chatDisabled || false);
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
          }
         case 'Students': {
             const simulatedPlan = typeof localStorage !== 'undefined' ? localStorage.getItem('hwz_simulated_plan') : null;
             const activePlanId = simulatedPlan || ((teacherBilling && ['active', 'trialing'].includes(teacherBilling.status)) ? teacherBilling.planId : 'free');
             const limit = getPlanSeatLimit(activePlanId);
             const isSeatLimitReached = allStudents.length >= limit;

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
                                disabled={isSeatLimitReached}
                                placeholder={isSeatLimitReached ? "Seat limit reached." : `Add student to ${activeClassroom?.name}...`}
                                value={newStudent}
                                onChange={(e) => setNewStudent(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !isSeatLimitReached && handleAddStudent()}
                                className={`rounded-[24px] py-4 pl-8 pr-16 text-sm font-bold placeholder-blue-300 outline-none transition-all shadow-sm min-w-[300px] border-2 ${
                                  isSeatLimitReached 
                                    ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed' 
                                    : 'bg-white border-[#EA580C]/20 text-blue-900 focus:border-[#EA580C]'
                                }`}
                             />
                             <button 
                                onClick={() => {
                                  if (isSeatLimitReached) {
                                    setShowUpgradeAlert(true);
                                  } else {
                                    handleAddStudent();
                                  }
                                }}
                                disabled={isAdding || (!newStudent.trim() && !isSeatLimitReached)}
                                className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
                                  isSeatLimitReached 
                                    ? 'bg-slate-300 text-slate-500 cursor-pointer shadow-none' 
                                    : 'bg-[#EA580C] text-white shadow-lg shadow-orange-100 hover:scale-105 disabled:opacity-30'
                                }`}
                             >
                                {isSeatLimitReached ? <Lock className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
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
                           const isQuotaLocked = student.isQuotaLocked;
                           const isPaused = student.status === 'paused' || isQuotaLocked;
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
                                 isQuotaLocked
                                   ? 'bg-amber-50/40 opacity-70 hover:opacity-90'
                                   : isPaused
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
                                       disabled={isQuotaLocked}
                                       className="flex items-center gap-3 text-left focus:outline-none hover:opacity-85 transition-opacity disabled:cursor-not-allowed"
                                    >
                                       <div className="relative">
                                          <img src={getStudentAvatar(student.name)} className={`w-10 h-10 rounded-full border-2 shadow-sm bg-white p-0.5 ${
                                             isQuotaLocked ? 'border-amber-200 grayscale' : isPaused ? 'border-rose-200 grayscale' : 'border-white'
                                          }`} alt={student.name} />
                                          {isQuotaLocked ? (
                                             <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center border border-white" title="Locked by plan limit">
                                                <Lock className="w-2 h-2 text-white" />
                                             </div>
                                          ) : isPaused ? (
                                             <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center border border-white">
                                                <Lock className="w-2 h-2 text-white" />
                                             </div>
                                          ) : null}
                                       </div>
                                       <div>
                                          <span className={`text-sm font-black hover:text-[#EA580C] transition-colors ${isQuotaLocked ? 'text-amber-700' : isPaused ? 'text-slate-400 line-through' : 'text-[#14532d]'}`}>{student.name}</span>
                                          {isQuotaLocked ? (
                                             <span className="ml-2 text-[9px] font-black uppercase tracking-wider text-amber-600 bg-amber-100 rounded-full px-1.5 py-0.5">Over Limit</span>
                                          ) : isPaused ? (
                                             <span className="ml-2 text-[9px] font-black uppercase tracking-wider text-rose-500 bg-rose-100 rounded-full px-1.5 py-0.5">Paused</span>
                                          ) : null}
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
                                    {isQuotaLocked ? (
                                       <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-700 bg-amber-100 border border-amber-200 rounded-full px-2.5 py-1">
                                          <Lock className="w-2.5 h-2.5" /> Locked
                                       </span>
                                    ) : isPaused ? (
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
                                          setBadgeIcon('ðŸ†');
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
                                      <button 
                                         onClick={() => handleResetStudentPassword(student)}
                                         className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                                         title="Reset student password"
                                      >
                                         <Key className="w-4 h-4" />
                                      </button>
                                 </div>
                              </div>
                           );
                        })}
                        {filteredStudents.length === 0 && (
                           <div className="py-20 text-center text-[#166534] italic font-bold">
                              No students found. 🔍
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
            const isSuperUser = user?.email && SUPER_USER_EMAILS.includes(user.email);
            return (
               <div className="px-10 py-10 space-y-10 min-h-[calc(100vh-64px)] pb-40 relative">
                  <HomeworkGenerator 
                     user={user} 
                     classrooms={classrooms} 
                     activeClassroom={activeClassroom} 
                     initialDraft={selectedDraft}
                     initialExam={selectedExamForBuilder}
                     subjectPrompts={subjectPrompts}
                     onHomeworkCreated={() => {
                        setSelectedDraft(null);
                        setSelectedExamForBuilder(null);
                        fetchDashboardSubmissions();
                      }} 
                      teacherBilling={teacherBilling}
                      allHomeworks={allHomeworks}
                      setDashboardTab={setActiveTab}
                      isAdmin={isAdminUser}
                      isSuperUser={isSuperUser}
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
            const currentSubmissions = activeClassroom ? allSubmissions.filter(s => s.classId === activeClassroom?.id) : allSubmissions;
            const currentStudents = activeClassroom ? students : allStudents;
            const currentHomeworks = activeClassroom ? allHomeworks.filter(h => h.assignedClassId === activeClassroom?.id) : allHomeworks;
            
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
            const currentSubmissions = activeClassroom ? allSubmissions.filter(s => s.classId === activeClassroom?.id) : allSubmissions;
            const currentStudents = activeClassroom ? allStudents.filter(s => s.classId === activeClassroom?.id) : allStudents;
            const currentHomeworks = activeClassroom ? allHomeworks.filter(h => h.assignedClassId === activeClassroom?.id) : allHomeworks;

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

            // Filter out tests, exams, quizzes, mock papers - only keep real core subjects
            const isTestOrExamSubject = (s = '') => {
               const lower = (s || '').toLowerCase();
               return (
                  lower.includes('test') || 
                  lower.includes('quiz') || 
                  lower.includes('exam') || 
                  lower.includes('naplan') || 
                  lower.includes('icas') || 
                  lower.includes('mock') || 
                  lower.includes('assessment') || 
                  lower.includes('paper') ||
                  lower.includes('diagnostic') ||
                  lower.includes('term') ||
                  lower.includes('competition')
               );
            };

            // Normalize subject names for clean filtering & deduplication
            const normalizeSubjectName = (name = '') => {
               const s = (name || '').trim();
               const lower = s.toLowerCase();
               if (lower === 'maths' || lower === 'math' || lower.includes('numeracy')) return 'Mathematics';
               if (lower === 'olympiad' || lower === 'olympiad maths' || lower === 'logical reasoning' || lower === 'logic' || lower.includes('reasoning')) return 'Logical Reasoning';
               if (lower === 'english' || lower === 'literacy' || lower === 'reading' || lower === 'writing' || lower === 'grammar') return 'English';
               if (lower === 'science' || lower.includes('physics') || lower.includes('chemistry') || lower.includes('biology')) return 'Science';
               if (lower === 'hindi') return 'Hindi';
               if (lower === 'vocabulary' || lower === 'vocab' || lower === 'vocabularly') return 'Vocabulary';
               if (lower === 'computer science' || lower === 'coding') return 'Computer Science';
               if (lower === 'financial literacy') return 'Financial Literacy';
               if (lower === 'environmental science') return 'Environmental Science';
               if (lower === 'history' || lower === 'social studies') return 'History';
               if (lower === 'geography') return 'Geography';
               return s.charAt(0).toUpperCase() + s.slice(1);
            };

            // Only Real Core Subjects (Grade Curriculum + Active Custom Subject Prompts)
            const baseSubjects = ['English', 'Mathematics', 'Science', 'Logical Reasoning', 'Hindi'];
            const promptSubjects = Object.keys(subjectPrompts || {})
               .filter(k => {
                  const val = subjectPrompts[k];
                  if (val === null || val === undefined) return false;
                  if (typeof k !== 'string' || !k.trim()) return false;
                  if (isTestOrExamSubject(k)) return false;
                  return true;
               })
               .map(normalizeSubjectName);

            const gradeSubjectsList = Array.from(new Set([
               ...baseSubjects,
               ...promptSubjects
            ])).filter(Boolean);

            const checkSubjectMatchesFilter = (umbrellaSubject, hwSubject, selectedSubject, subtopic = '') => {
               if (!selectedSubject) return true;
               const selNorm = selectedSubject.toLowerCase().trim();
               const umbNorm = (umbrellaSubject || '').toLowerCase().trim();
               const hwNorm = (hwSubject || '').toLowerCase().trim();
               const topicNorm = (subtopic || '').toLowerCase().trim();

               // Direct match
               if (umbNorm === selNorm || hwNorm === selNorm) return true;

               // English & Sub-disciplines
               if (selNorm === 'english') {
                  return umbNorm === 'english' || hwNorm.includes('english') || hwNorm.includes('vocab') || hwNorm.includes('reading') || hwNorm.includes('writing') || hwNorm.includes('grammar') || hwNorm.includes('spelling');
               }

               // Mathematics
               if (selNorm === 'mathematics') {
                  return umbNorm === 'mathematics' || hwNorm.includes('math') || hwNorm.includes('numeracy');
               }

               // Science
               if (selNorm === 'science') {
                  return umbNorm === 'science' || hwNorm.includes('science');
               }

               // Logical Reasoning
               if (selNorm === 'logical reasoning') {
                  return umbNorm === 'logical reasoning' || hwNorm.includes('logic') || hwNorm.includes('reason') || hwNorm.includes('olympiad');
               }

               // Vocabulary specific filter
               if (selNorm.includes('vocab')) {
                  return hwNorm.includes('vocab') || topicNorm.includes('vocab') || topicNorm.includes('word');
               }

               // Hindi
               if (selNorm === 'hindi') {
                  return umbNorm === 'hindi' || hwNorm.includes('hindi');
               }

               // General fallback
               return hwNorm.includes(selNorm) || topicNorm.includes(selNorm) || umbNorm.includes(selNorm);
            };

            // Class-wide concept accuracy for benchmark
            const classSubtopicsData = {};
            currentSubmissions.forEach(sub => {
               const hw = allHomeworks.find(h => h.id === sub.homeworkId);
               if (!hw || !hw.questions) return;
               hw.questions.forEach(q => {
                  const rawSubtopic = getQuestionSubtopic(hw, q);
                  const subtopic = mapToUmbrellaCategory(rawSubtopic, hw.subject);
                  const umbrellaSubject = getSubjectForUmbrellaCategory(subtopic, hw.subject);
                  
                  // Subject filtering supporting both core curriculum & teacher prompt subjects
                  if (!checkSubjectMatchesFilter(umbrellaSubject, hw.subject, selectedReportSubject, subtopic)) return;

                  if (!classSubtopicsData[subtopic]) {
                     classSubtopicsData[subtopic] = {
                        name: subtopic,
                        subject: umbrellaSubject,
                        correctCount: 0,
                        totalCount: 0
                     };
                  }
                  const studentSelection = sub.answers?.[q.id];
                  const actualAnswer = q.answer;
                  const isCorrect = checkIsAnswerCorrect(studentSelection, actualAnswer);
                  
                  classSubtopicsData[subtopic].totalCount += 1;
                  if (isCorrect) {
                     classSubtopicsData[subtopic].correctCount += 1;
                  }
               });
            });

            // Calculation of umbrella concept mastery for Report A
            const subtopicsData = {};
            const masterySubmissions = selectedReportStudent 
               ? currentSubmissions.filter(sub => normalizeName(sub.studentName) === normalizeName(selectedReportStudent))
               : currentSubmissions;

            masterySubmissions.forEach(sub => {
               const hw = allHomeworks.find(h => h.id === sub.homeworkId);
               if (!hw || !hw.questions) return;
               hw.questions.forEach(q => {
                  const rawSubtopic = getQuestionSubtopic(hw, q);
                  const subtopic = mapToUmbrellaCategory(rawSubtopic, hw.subject);
                  const umbrellaSubject = getSubjectForUmbrellaCategory(subtopic, hw.subject);
                  
                  // Subject filtering supporting both core curriculum & teacher prompt subjects
                  if (!checkSubjectMatchesFilter(umbrellaSubject, hw.subject, selectedReportSubject, subtopic)) return;

                  if (!subtopicsData[subtopic]) {
                     subtopicsData[subtopic] = {
                        name: subtopic,
                        subject: umbrellaSubject,
                        correctCount: 0,
                        totalCount: 0
                     };
                  }
                  const studentSelection = sub.answers?.[q.id];
                  const actualAnswer = q.answer;
                  const isCorrect = checkIsAnswerCorrect(studentSelection, actualAnswer);
                  
                  subtopicsData[subtopic].totalCount += 1;
                  if (isCorrect) {
                     subtopicsData[subtopic].correctCount += 1;
                  }
               });
            });

            const subtopicsArray = Object.keys(subtopicsData).map(name => {
               const data = subtopicsData[name];
               const accuracy = data.totalCount > 0 ? Math.round((data.correctCount / data.totalCount) * 100) : 0;
               let tier = 'Needs Focus';
               if (accuracy >= 80) tier = 'Mastered';
               else if (accuracy >= 60) tier = 'Reviewing';
               
               const classData = classSubtopicsData[name];
               const classAverage = classData && classData.totalCount > 0 
                  ? Math.round((classData.correctCount / classData.totalCount) * 100) 
                  : 0;
               
               return {
                  name,
                  subject: data.subject,
                  accuracy,
                  classAverage,
                  correctCount: data.correctCount,
                  totalCount: data.totalCount,
                  tier
               };
            });

            // Class-wide accuracy by grade curriculum subject
            const classSubjectsData = {};
            gradeSubjectsList.forEach(name => {
               classSubjectsData[name] = { name, correctCount: 0, totalCount: 0 };
            });

            currentSubmissions.forEach(sub => {
               const hw = allHomeworks.find(h => h.id === sub.homeworkId);
               if (!hw || !hw.questions) return;
               
               hw.questions.forEach(q => {
                  const rawSubtopic = getQuestionSubtopic(hw, q);
                  const subtopic = mapToUmbrellaCategory(rawSubtopic, hw.subject);
                  const subjectName = getSubjectForUmbrellaCategory(subtopic, hw.subject);
                  if (!classSubjectsData[subjectName]) {
                     classSubjectsData[subjectName] = {
                        name: subjectName,
                        correctCount: 0,
                        totalCount: 0
                     };
                  }
                  
                  const studentSelection = sub.answers?.[q.id];
                  const actualAnswer = q.answer;
                  const isCorrect = checkIsAnswerCorrect(studentSelection, actualAnswer);
                  
                  classSubjectsData[subjectName].totalCount += 1;
                  if (isCorrect) {
                     classSubjectsData[subjectName].correctCount += 1;
                  }
               });
            });

            // Selected student accuracy by grade curriculum subject
            const studentSubjectsData = {};
            gradeSubjectsList.forEach(name => {
               studentSubjectsData[name] = { name, correctCount: 0, totalCount: 0 };
            });

            const subjectSubmissions = selectedReportStudent 
               ? currentSubmissions.filter(sub => normalizeName(sub.studentName) === normalizeName(selectedReportStudent))
               : currentSubmissions;

            subjectSubmissions.forEach(sub => {
               const hw = allHomeworks.find(h => h.id === sub.homeworkId);
               if (!hw || !hw.questions) return;
               
               hw.questions.forEach(q => {
                  const rawSubtopic = getQuestionSubtopic(hw, q);
                  const subtopic = mapToUmbrellaCategory(rawSubtopic, hw.subject);
                  const subjectName = getSubjectForUmbrellaCategory(subtopic, hw.subject);
                  if (!studentSubjectsData[subjectName]) {
                     studentSubjectsData[subjectName] = {
                        name: subjectName,
                        correctCount: 0,
                        totalCount: 0
                     };
                  }
                  
                  const studentSelection = sub.answers?.[q.id];
                  const actualAnswer = q.answer;
                  const isCorrect = checkIsAnswerCorrect(studentSelection, actualAnswer);
                  
                  studentSubjectsData[subjectName].totalCount += 1;
                  if (isCorrect) {
                     studentSubjectsData[subjectName].correctCount += 1;
                  }
               });
            });

            const subjectsArray = Object.keys(classSubjectsData)
               .filter(name => gradeSubjectsList.includes(name) || classSubjectsData[name].totalCount > 0)
               .map(name => {
                  const classData = classSubjectsData[name];
                  const classAverage = classData.totalCount > 0 ? Math.round((classData.correctCount / classData.totalCount) * 100) : 0;
                  
                  const studentData = studentSubjectsData[name];
                  const accuracy = studentData && studentData.totalCount > 0 
                     ? Math.round((studentData.correctCount / studentData.totalCount) * 100) 
                     : (selectedReportStudent ? 0 : classAverage);
                  
                  let tier = 'Needs Focus';
                  if (accuracy >= 80) tier = 'Mastered';
                  else if (accuracy >= 60) tier = 'Reviewing';

                  return {
                     name,
                     accuracy,
                     classAverage,
                     tier
                  };
               }).sort((a, b) => b.accuracy - a.accuracy);

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
                     speedBadge = 'Quick Solver ⚠️¡';
                     badgeColor = 'bg-amber-50 text-amber-600 border border-amber-100';
                  } else if (pacePerQ >= 15 && pacePerQ <= 40) {
                     speedBadge = 'Paced Solver â±ï¸';
                     badgeColor = 'bg-emerald-50 text-emerald-600 border border-emerald-100';
                  } else {
                     speedBadge = 'Deep Thinker 🧠 ';
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

            // Calculations for Report C: Growth Trajectory over time
            const classroomHws = [...currentHomeworks].sort((a, b) => {
               const dateA = new Date(a.dueDate || a.createdAt || 0);
               const dateB = new Date(b.dueDate || b.createdAt || 0);
               return dateA - dateB;
            });

            const filteredClassroomHws = classroomHws.filter(hw => {
               // Subject Filter
               if (selectedReportSubject) {
                  const subjectMatch = (hw.subject || '').toLowerCase() === selectedReportSubject.toLowerCase();
                  if (!subjectMatch) return false;
               }
               
               // Time Range Filter
               if (selectedReportTimeRange && selectedReportTimeRange !== 'all') {
                  const hwDate = new Date(hw.dueDate || hw.createdAt || 0);
                  const now = new Date();
                  
                  if (selectedReportTimeRange === 'week') {
                     const diffTime = Math.abs(now - hwDate);
                     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                     if (diffDays > 7) return false;
                  } else if (selectedReportTimeRange === 'month') {
                     const diffTime = Math.abs(now - hwDate);
                     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                     if (diffDays > 30) return false;
                  } else if (selectedReportTimeRange === 'ytd') {
                     const startOfYear = new Date(now.getFullYear(), 0, 1);
                     if (hwDate < startOfYear) return false;
                  }
               }
               
               return true;
            });

            const trajectoryChartData = filteredClassroomHws.map((hw, idx) => {
               const hwSubs = currentSubmissions.filter(s => s.homeworkId === hw.id);
               const classAvg = hwSubs.length > 0 ? Math.round(hwSubs.reduce((acc, s) => acc + (s.score || 0), 0) / hwSubs.length) : 0;
               
               let studentScore = null;
               if (selectedReportStudent) {
                  const studentSub = hwSubs.find(s => normalizeName(s.studentName) === normalizeName(selectedReportStudent));
                  if (studentSub) {
                     studentScore = studentSub.score;
                  }
               }
               
               const dateStr = hw.dueDate ? new Date(hw.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : `Quiz ${idx + 1}`;
               
               return {
                  name: dateStr,
                  title: hw.title,
                  studentScore,
                  classAverage: classAvg
               };
            }).filter(item => {
               if (!selectedReportStudent) {
                  return item.classAverage > 0;
               }
               return true;
            });

            const startingScore = trajectoryChartData.length > 0 
               ? (selectedReportStudent 
                  ? (trajectoryChartData.find(d => d.studentScore !== null)?.studentScore || 0)
                  : trajectoryChartData[0].classAverage) 
               : 0;

            const currentScore = trajectoryChartData.length > 0 
               ? (selectedReportStudent 
                  ? [...trajectoryChartData].reverse().find(d => d.studentScore !== null)?.studentScore || 0
                  : trajectoryChartData[trajectoryChartData.length - 1].classAverage) 
               : 0;

            const growth = trajectoryChartData.length > 1 ? currentScore - startingScore : 0;
            
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
                        const rawSubtopic = getQuestionSubtopic(hw, q);
                   const subtopic = mapToUmbrellaCategory(rawSubtopic, hw.subject);
                        if (!studentSubtopics[subtopic]) {
                           studentSubtopics[subtopic] = { correct: 0, total: 0 };
                        }
                        const studentSelection = sub.answers?.[q.id];
                        const actualAnswer = q.answer;
                        if (checkIsAnswerCorrect(studentSelection, actualAnswer)) {
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
                        {/* Header & Student Filter */}
                        {/* Header & Student/Subject Filter */}
                        <div className="bg-white rounded-[40px] p-8 border border-orange-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
                           <div className="space-y-2 text-center lg:text-left flex-1">
                              <h2 className="text-2xl font-black text-[#14532d]">
                                 Concept Mastery Overview {selectedReportSubject ? `— ${selectedReportSubject}` : ''} {selectedReportStudent ? `(${selectedReportStudent})` : ''}
                              </h2>
                              <p className="text-xs text-[#166534] font-medium">
                                 Grouped by umbrella category based on historical quiz submissions. Filter by grade subjects or individual students to evaluate specific curriculum learning goals.
                              </p>
                           </div>
                           <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                              {/* Subject Filter for Grade Curriculum */}
                              <div className="w-full sm:w-56">
                                 <select 
                                    value={selectedReportSubject} 
                                    onChange={(e) => {
                                       setSelectedReportSubject(e.target.value);
                                       setConceptPage(1);
                                    }} 
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-bold text-[#14532d] focus:outline-none focus:ring-2 focus:ring-[#EA580C]/25 shadow-sm cursor-pointer"
                                 >
                                    <option value="">All Subjects (Grade Curriculum)</option>
                                    {gradeSubjectsList.map((subj, i) => (
                                       <option key={i} value={subj}>{subj}</option>
                                    ))}
                                 </select>
                              </div>

                              {/* Student Filter */}
                              <div className="w-full sm:w-56">
                                 <select 
                                    value={selectedReportStudent} 
                                    onChange={(e) => setSelectedReportStudent(e.target.value)} 
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-sm font-bold text-[#14532d] focus:outline-none focus:ring-2 focus:ring-[#EA580C]/25 shadow-sm cursor-pointer"
                                 >
                                    <option value="">All Students (Class Average)</option>
                                    {currentStudents.map((st, i) => (
                                       <option key={i} value={st.name}>{st.name}</option>
                                    ))}
                                 </select>
                              </div>
                           </div>
                        </div>
                        {subtopicsArray.length > 0 ? (
                           <>
                              {/* Charts Row — Pie + Bar */}
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                 {/* Pie Chart — Tier Distribution */}
                                 <div className="bg-white rounded-[40px] p-8 border border-orange-100 shadow-sm">
                                    <h3 className="text-sm font-black text-[#14532d] uppercase tracking-widest mb-6">Tier Distribution</h3>
                                    <div className="flex items-center justify-center gap-8">
                                       <ResponsiveContainer width={180} height={180}>
                                          <PieChart>
                                             <Pie
                                                data={[
                                                   { name: 'Mastered', value: subtopicsArray.filter(s => s.tier === 'Mastered').length },
                                                   { name: 'Reviewing', value: subtopicsArray.filter(s => s.tier === 'Reviewing').length },
                                                   { name: 'Needs Focus', value: subtopicsArray.filter(s => s.tier === 'Needs Focus').length }
                                                ].filter(d => d.value > 0)}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={80}
                                                paddingAngle={3}
                                                dataKey="value"
                                                strokeWidth={0}
                                             >
                                                {[
                                                   { name: 'Mastered', color: '#34d399' },
                                                   { name: 'Reviewing', color: '#60a5fa' },
                                                   { name: 'Needs Focus', color: '#fb7185' }
                                                ].filter(d => subtopicsArray.some(s => s.tier === d.name)).map((entry, index) => (
                                                   <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                             </Pie>
                                             <RechartsTooltip
                                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: '12px', fontWeight: 700 }}
                                             />
                                          </PieChart>
                                       </ResponsiveContainer>
                                       <div className="space-y-3">
                                          {[
                                             { label: 'Mastered', color: 'bg-emerald-400', count: subtopicsArray.filter(s => s.tier === 'Mastered').length },
                                             { label: 'Reviewing', color: 'bg-blue-400', count: subtopicsArray.filter(s => s.tier === 'Reviewing').length },
                                             { label: 'Needs Focus', color: 'bg-rose-400', count: subtopicsArray.filter(s => s.tier === 'Needs Focus').length }
                                          ].map(item => (
                                             <div key={item.label} className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                                <span className="text-xs font-black text-slate-700">{item.label}</span>
                                                <span className="text-xs font-black text-slate-400">{item.count}</span>
                                             </div>
                                          ))}
                                       </div>
                                    </div>
                                 </div>

                                 {/* Radar Chart — Accuracy by Subject */}
                                  <div className="bg-white rounded-[40px] p-8 border border-orange-100 shadow-sm flex flex-col justify-between">
                                     <h3 className="text-sm font-black text-[#14532d] uppercase tracking-widest mb-4">Subject Performance Profile</h3>
                                     <ResponsiveContainer width="100%" height={260}>
                                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={subjectsArray}>
                                           <PolarGrid stroke="#f1f5f9" />
                                           <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700, fill: '#334155' }} />
                                           <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8, fill: '#94a3b8' }} axisLine={false} />
                                           {selectedReportStudent ? (
                                              <>
                                                 <Radar name="Student Accuracy" dataKey="accuracy" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
                                                 <Radar name="Class Average" dataKey="classAverage" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.15} />
                                              </>
                                           ) : (
                                              <Radar name="Class Average" dataKey="classAverage" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                                           )}
                                           <RechartsTooltip
                                              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: '12px', fontWeight: 700 }}
                                           />
                                           <Legend 
                                              verticalAlign="bottom" 
                                              height={36} 
                                              iconType="circle"
                                              iconSize={8}
                                              wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingTop: '10px' }}
                                           />
                                        </RadarChart>
                                     </ResponsiveContainer>
                                  </div>
                              </div>

                              {/* Filter Pills — Focus, Review, Mastered ONLY (No "All") */}
                              <div className="flex flex-wrap gap-3 justify-center">
                                 {[
                                    { id: 'Needs Focus', label: 'Needs Focus', count: subtopicsArray.filter(s => s.tier === 'Needs Focus').length, color: 'text-rose-600 bg-rose-50 border-rose-200' },
                                    { id: 'Reviewing', label: 'Reviewing', count: subtopicsArray.filter(s => s.tier === 'Reviewing').length, color: 'text-blue-600 bg-blue-50 border-blue-200' },
                                    { id: 'Mastered', label: 'Mastered', count: subtopicsArray.filter(s => s.tier === 'Mastered').length, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' }
                                 ].map((pill) => {
                                    const isActive = conceptTierFilter === pill.id;
                                    return (
                                       <button
                                          key={pill.id}
                                          onClick={() => setConceptTierFilter(pill.id)}
                                          className={`px-5 py-2.5 rounded-2xl text-xs font-black border transition-all flex items-center gap-2.5 ${
                                             isActive 
                                                ? `${pill.color} shadow-sm scale-105 ring-2 ring-offset-1 ring-current` 
                                                : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-100'
                                          }`}
                                       >
                                          <span>{pill.label}</span>
                                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                                             isActive ? 'bg-white/70' : 'bg-slate-100 text-slate-500'
                                          }`}>
                                             {pill.count}
                                          </span>
                                       </button>
                                    );
                                 })}
                              </div>

                              {/* Topic Cards Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                 {sortedAndFilteredSubtopics.map((sub, idx) => {
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
                                          className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between h-44"
                                       >
                                          <div className="flex justify-between items-start gap-2">
                                             <h3 className="font-black text-slate-800 text-sm leading-snug flex-1 truncate">{sub.name}</h3>
                                             <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${tierColor}`}>
                                                {sub.tier}
                                             </span>
                                          </div>
                                          <span className="text-[10px] font-bold text-slate-400 mt-1">{sub.totalCount} responses</span>
                                          <div className="mt-auto space-y-1.5">
                                             <div className="flex justify-between items-center text-xs font-black">
                                                <span className="text-slate-400">Class Accuracy</span>
                                                <span className="text-slate-800">{sub.accuracy}%</span>
                                             </div>
                                             <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full transition-all duration-700 ${progressColor}`} style={{ width: `${sub.accuracy}%` }} />
                                             </div>
                                          </div>
                                       </div>
                                    );
                                 })}

                                 {sortedAndFilteredSubtopics.length === 0 && (
                                    <div className="col-span-3 bg-white rounded-[40px] py-16 text-center text-slate-400 font-bold border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 animate-fadeIn">
                                       <Search className="w-6 h-6 text-slate-300" />
                                       <p className="mt-2 text-slate-600 font-black text-sm">No concepts in this tier</p>
                                       <p className="text-xs text-slate-400 font-bold">Select another tier above to view concepts.</p>
                                    </div>
                                 )}
                              </div>
                           </>
                        ) : (
                           <div className="text-center py-20 bg-white rounded-[40px] border border-orange-100 shadow-sm space-y-3">
                              <div className="text-5xl">📊</div>
                              <h3 className="text-lg font-black text-[#14532d]">No Concept Data Yet</h3>
                              <p className="text-xs font-bold text-slate-400">Assign some quizzes and check back once students start submitting! 🚀</p>
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
                              <p className="text-xs text-[#166534] font-medium">Select a student, subject, and time range to overlay timelines against the class average.</p>
                           </div>
                           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
                              <div className="w-full sm:w-44">
                                 <label className="text-[9px] font-black text-[#166534] uppercase tracking-wider block mb-1">Subject</label>
                                 <select 
                                    value={selectedReportSubject} 
                                    onChange={(e) => setSelectedReportSubject(e.target.value)} 
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-2.5 px-3 text-xs font-bold text-[#14532d] focus:outline-none focus:ring-2 focus:ring-[#EA580C]/25 shadow-sm"
                                 >
                                    <option value="">All Subjects</option>
                                    <option value="maths">Mathematics</option>
                                    <option value="english">English</option>
                                    <option value="science">Science</option>
                                    <option value="logical reasoning">Logical Reasoning</option>
                                    <option value="olympiad">Olympiad</option>
                                 </select>
                              </div>
                              <div className="w-full sm:w-44">
                                 <label className="text-[9px] font-black text-[#166534] uppercase tracking-wider block mb-1">Time Range</label>
                                 <select 
                                    value={selectedReportTimeRange} 
                                    onChange={(e) => setSelectedReportTimeRange(e.target.value)} 
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-2.5 px-3 text-xs font-bold text-[#14532d] focus:outline-none focus:ring-2 focus:ring-[#EA580C]/25 shadow-sm"
                                 >
                                    <option value="all">All Time</option>
                                    <option value="week">Last 7 Days</option>
                                    <option value="month">Last 30 Days</option>
                                    <option value="ytd">Year to Date (YTD)</option>
                                 </select>
                              </div>
                              <div className="w-full sm:w-44">
                                 <label className="text-[9px] font-black text-[#166534] uppercase tracking-wider block mb-1">Student</label>
                                 <select 
                                    value={selectedReportStudent} 
                                    onChange={(e) => setSelectedReportStudent(e.target.value)} 
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-2.5 px-3 text-xs font-bold text-[#14532d] focus:outline-none focus:ring-2 focus:ring-[#EA580C]/25 shadow-sm"
                                 >
                                    <option value="">All Students (Class Avg)</option>
                                    {currentStudents.map((st, i) => (
                                       <option key={i} value={st.name}>{st.name}</option>
                                    ))}
                                 </select>
                              </div>
                           </div>
                        </div>

                        {(() => {
                           if (trajectoryChartData.length === 0) {
                              return (
                                 <div className="bg-white rounded-[40px] py-20 text-center text-[#166534] font-bold italic border border-orange-100 shadow-sm">
                                    No completed quiz data matches these filters.
                                 </div>
                              );
                           }

                           return (
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                 {/* Statistics Block */}
                                 <div className="lg:col-span-4 flex flex-col gap-6">
                                    <div className="bg-white rounded-[40px] border border-orange-100 shadow-sm p-8 flex items-center justify-between">
                                       <div>
                                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                                             {selectedReportStudent ? 'Starting Accuracy' : 'Class Start Avg'}
                                          </span>
                                          <span className="text-3xl font-black text-[#14532d]">{startingScore}%</span>
                                       </div>
                                       <div className="w-12 h-12 rounded-2xl bg-blue-50 flex-center text-blue-600 font-black">
                                          1st
                                       </div>
                                    </div>

                                    <div className="bg-white rounded-[40px] border border-orange-100 shadow-sm p-8 flex items-center justify-between">
                                       <div>
                                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                                             {selectedReportStudent ? 'Current Accuracy' : 'Class Current Avg'}
                                          </span>
                                          <span className="text-3xl font-black text-[#14532d]">{currentScore}%</span>
                                       </div>
                                       <div className="w-12 h-12 rounded-2xl bg-orange-50 flex-center text-[#EA580C] font-black">
                                          Last
                                       </div>
                                    </div>

                                    <div className="bg-white rounded-[40px] border border-orange-100 shadow-sm p-8 flex items-center justify-between">
                                       <div>
                                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                                             {selectedReportStudent ? 'Growth Index' : 'Class Growth Index'}
                                          </span>
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
                                          {growth >= 0 ? '↑' : '↓'}
                                       </div>
                                    </div>
                                 </div>

                                 {/* Line Chart Component */}
                                 <div className="lg:col-span-8 bg-white rounded-[40px] border border-orange-100 shadow-sm p-8 space-y-6 flex flex-col justify-between">
                                    <div className="flex justify-between items-center">
                                       <h3 className="text-lg font-black text-slate-800">Performance Over Time</h3>
                                       <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-wider">
                                          {selectedReportStudent && (
                                             <div className="flex items-center gap-1.5 text-[#EA580C]">
                                                <span className="w-3 h-3 rounded-full bg-[#EA580C] inline-block" />
                                                <span>{selectedReportStudent}</span>
                                             </div>
                                          )}
                                          <div className="flex items-center gap-1.5 text-[#FFAB91]">
                                             <span className="w-3 h-0.5 border-t-2 border-dashed border-[#FFAB91] inline-block" />
                                             <span>Class Average</span>
                                          </div>
                                       </div>
                                    </div>

                                    <div className="h-64 w-full">
                                       <ResponsiveContainer width="100%" height="100%">
                                          <LineChart data={trajectoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                             <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                             <XAxis dataKey="name" stroke="#cbd5e1" style={{ fontSize: '10px', fontWeight: 'bold' }} />
                                             <YAxis domain={[0, 100]} stroke="#cbd5e1" style={{ fontSize: '10px', fontWeight: 'bold' }} />
                                             <RechartsTooltip 
                                                content={({ active, payload }) => {
                                                   if (active && payload && payload.length) {
                                                      const data = payload[0].payload;
                                                      return (
                                                         <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl text-xs space-y-1 font-bold">
                                                            <p className="text-orange-400 font-black">{data.title}</p>
                                                            <p className="text-slate-300">Date: {data.name}</p>
                                                            {selectedReportStudent && data.studentScore !== null && (
                                                               <p>Student Score: <span className="text-[#EA580C] font-black">{data.studentScore}%</span></p>
                                                            )}
                                                            <p>Class Avg: <span className="text-[#FFAB91] font-black">{data.classAverage}%</span></p>
                                                         </div>
                                                      );
                                                   }
                                                   return null;
                                                }}
                                             />
                                             {selectedReportStudent && (
                                                <Line type="monotone" dataKey="studentScore" stroke="#EA580C" strokeWidth={4} activeDot={{ r: 8 }} connectNulls />
                                             )}
                                             <Line type="monotone" dataKey="classAverage" stroke="#FFAB91" strokeWidth={3} strokeDasharray="5 5" dot={true} />
                                          </LineChart>
                                       </ResponsiveContainer>
                                    </div>
                                 </div>
                              </div>
                           );
                        })()}
                     </div>
                  )}

                  {selectedReportTab === 'intervention' && (
                     <div className="space-y-8 animate-fadeIn">
                        <div className="bg-amber-50/50 border border-amber-100 rounded-[40px] p-8 flex gap-6">
                           <div className="w-12 h-12 shrink-0 bg-amber-400 rounded-2xl flex items-center justify-center text-white shadow-sm font-black text-xl">
                              !
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
                                             setRemediationMessageContent(`Hi ${st.name}! I noticed we could focus a bit more on "${st.primaryGap}". Let me know if you want to review this together!`);
                                          }}
                                          className="flex-1 bg-slate-50 border border-slate-100 text-slate-700 py-3 rounded-2xl text-xs font-black transition-colors hover:bg-slate-100"
                                       >
                                          Direct Message
                                       </button>
                                       <button 
                                          onClick={() => handleRemediationTrigger(st, st.primaryGap)}
                                          className="flex-1 bg-[#EA580C] text-white py-3 rounded-2xl text-xs font-black hover:bg-[#C2410C] transition-colors shadow-lg shadow-orange-200"
                                       >
                                          ⚠️¡ Remediation Homework
                                       </button>
                                    </div>
                                 </div>
                              );
                           })}
                           {flaggedStudents.length === 0 && (
                              <div className="col-span-2 bg-white rounded-[40px] py-16 text-center text-emerald-500 font-bold italic border border-orange-100 shadow-sm flex flex-col items-center justify-center space-y-4">
                                 <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex-center text-2xl">
                                    ✨¨
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
                   tests={allHomeworks.filter(hw => (hw.type === 'test' || hw.isExamPaper || !!hw.examPreset) && (!activeClassroom || hw.assignedClassId === activeClassroom?.id))}
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
                  return msg.senderRole === 'student' && msg.recipientType === 'teacher';
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

            const handleDeleteMessage = async (e, msgId) => {
               e.stopPropagation(); // prevent chat selection
               if (await window.confirmCustom("Are you sure you want to delete this message forever? 🗑️ï¸")) {
                  try {
                     await deleteDoc(doc(db, 'messages', msgId));
                     if (activeChat?.id === msgId) setActiveChat(null);
                  } catch (err) {
                     console.error("Error deleting message:", err);
                     alert("Oops! Could not delete message. âŒ");
                  }
               }
            };

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
                                 <div 
                                    key={msg.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => setActiveChat(msg)}
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveChat(msg); }}
                                    className={`w-full text-left p-6 flex items-center gap-4 transition-all group ${currentChat?.id === msg.id ? 'bg-blue-50/50' : 'hover:bg-blue-50/30'}`}
                                 >
                                    <img src={getStudentAvatar(messagesTab === 'Inbox' ? msg.senderName : msg.recipientName)} className="w-12 h-12 rounded-full border-2 border-white shadow-sm bg-white p-0.5 shrink-0" alt="avatar" />
                                    <div className="flex-1 min-w-0">
                                       <div className="flex items-center justify-between">
                                          <p className="text-sm font-black text-[#14532d] truncate">
                                             {messagesTab === 'Inbox' ? msg.senderName : `To: ${msg.recipientName}`}
                                          </p>
                                          <div className="flex items-center gap-2">
                                             <button 
                                                onClick={(e) => { e.stopPropagation(); handleDeleteMessage(e, msg.id); }}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                title="Delete Message"
                                             >
                                                <Trash2 className="w-4 h-4" />
                                             </button>
                                             <span className="text-[9px] font-bold text-[#166534]">
                                                {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : ''}
                                             </span>
                                          </div>
                                       </div>
                                       <p className="text-xs font-bold text-[#166534] truncate">{msg.content}</p>
                                    </div>
                                 </div>
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
                                 <div ref={teacherChatEndRef} />
                              </div>

                              {messagesTab === 'Inbox' && (
                                 <div className="p-6 border-t border-orange-100 flex items-center gap-4 bg-white">
                                    <div className="flex-1 relative flex items-center">
                                       <input 
                                          type="text" 
                                          value={replyText}
                                          onChange={(e) => setReplyText(e.target.value)}
                                          onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                                          placeholder="Type your reply..." 
                                          className="w-full bg-blue-50/50 border-none rounded-2xl py-4 pl-6 pr-14 text-sm font-bold text-blue-900 placeholder-blue-300" 
                                       />
                                       <div className="absolute right-2">
                                          <EmojiPicker onSelectEmoji={(emoji) => setReplyText(prev => prev + emoji)} />
                                       </div>
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
                  normalizeName(sub.studentName) === normalizeName(student.name) && (!sub.classId || sub.classId === activeClassroom?.id)
               );

               const getSubScore = (sub) => {
                  if (sub.score !== undefined) return sub.score;
                  if (sub.totalQuestions > 0) return Math.round(((sub.correctCount || 0) / sub.totalQuestions) * 100);
                  return 0;
               };

               const completedCount = studentSubs.length;
               const totalScore = studentSubs.reduce((acc, sub) => acc + getSubScore(sub), 0);
               const basePoints = 100;
               const calculatedPoints = basePoints + (completedCount * 50) + totalScore;

               // Group scores by subject
               const subjectScores = {};
               studentSubs.forEach(sub => {
                  const hw = allHomeworks.find(h => h.id === sub.homeworkId);
                  const subject = hw ? hw.subject : 'General';
                  if (!subjectScores[subject]) subjectScores[subject] = [];
                  subjectScores[subject].push(getSubScore(sub));
               });

               const getAvg = (subject) => {
                  const scores = subjectScores[subject];
                  if (!scores || scores.length === 0) return 0;
                  return scores.reduce((acc, s) => acc + s, 0) / scores.length;
               };

               const badges = (student.customBadges || []).map(b => ({
                  name: b.name || b.label,
                  desc: b.desc || b.description,
                  icon: b.icon || '🎖️',
                  color: b.color || 'bg-yellow-50 text-yellow-600 border-yellow-100',
                  isCustom: true
               }));
               const mathsAvg = getAvg('maths');
               const scienceAvg = getAvg('science');
               const englishAvg = getAvg('english');

               if (mathsAvg >= 80) {
                  badges.push({ name: 'Maths Whiz', desc: 'Scored 80%+ in Maths', icon: '⚠️¡', color: 'bg-blue-50 text-blue-600 border-blue-100' });
               }
               if (scienceAvg >= 80) {
                  badges.push({ name: 'Science Explorer', desc: 'Scored 80%+ in Science', icon: '🚀', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' });
               }
               if (englishAvg >= 80) {
                  badges.push({ name: 'Super Writer', desc: 'Scored 80%+ in English', icon: '📝', color: 'bg-amber-50 text-amber-600 border-amber-100' });
               }
               if (completedCount >= 3) {
                  badges.push({ name: 'Homework Hero', desc: 'Completed 3+ quizzes', icon: 'ðŸ†', color: 'bg-green-50 text-green-600 border-green-200' });
               } else if (completedCount >= 1) {
                  badges.push({ name: 'Rising Star', desc: 'Active and scoring', icon: 'â­', color: 'bg-rose-50 text-rose-600 border-rose-100' });
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
                              setBadgeIcon('ðŸ†');
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
                                          if (score >= 50) return `Good progress in ${subject}! 👍`;
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
                           { name: 'Maths Whiz', desc: 'Scored 80% or more in Mathematics homework quizzes.', icon: '⚠️¡', color: 'bg-blue-50 border-blue-100 text-blue-600' },
                           { name: 'Science Explorer', desc: 'Scored 80% or more in Science homework quizzes.', icon: '🚀', color: 'bg-emerald-50 border-emerald-100 text-emerald-600' },
                           { name: 'Super Writer', desc: 'Scored 80% or more in English homework quizzes.', icon: '📝', color: 'bg-amber-50 border-amber-100 text-amber-600' },
                           { name: 'Homework Hero', desc: 'Completed at least 3 homework assignments.', icon: 'ðŸ†', color: 'bg-green-50 border-green-200 text-green-600' },
                           { name: 'Rising Star', desc: 'Earned by student after submitting their first homework quiz.', icon: 'â­', color: 'bg-rose-50 border-rose-100 text-rose-600' }
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
                                                setBadgeIcon('ðŸ†');
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
                                 No students in this class roster yet. Add students to get started! ðŸŽ
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
                      Please select a class to view and configure collaborative goals! ðŸ†
                   </div>
                );
             }

             // Calculate classroom combined points
             const classStudents = allStudents.filter(s => s.classId === activeClassroom?.id);
             const computedStudents = classStudents.map(student => {
                const studentSubs = allSubmissions.filter(sub => 
                   normalizeName(sub.studentName) === normalizeName(student.name) && (!sub.classId || sub.classId === activeClassroom?.id)
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
             const targetTitle = activeClassroom.goalTitle || 'Dino Pizza Party! ðŸ•';
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
                                  Customize Goal ✨ï¸
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
                            <p className="text-xs font-bold text-[#166534] italic">{progressPercent >= 100 ? 'Unlocked & Active! 🦖' : 'Goal Locked'}</p>
                         </div>
                      </div>
                   </div>
                </div>
                </div>
);
          }
          case 'Calendar': {
             const classHomeworks = allHomeworks.filter(hw => !activeClassroom || hw.assignedClassId === activeClassroom?.id);
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
              const currentPrompts = (isPromptAdmin && promptViewMode === 'global') ? masterPromptsMap : subjectPrompts;
              const activeSubjectKeys = Object.keys(currentPrompts || {}).filter(k => currentPrompts[k] !== null);

              return (
                 <div className="px-6 sm:px-10 py-10 space-y-8 min-h-[calc(100vh-64px)] pb-40 relative font-sans">
                    
                    {/* Top Banner & Header */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-sm space-y-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
                       <div className="space-y-1">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-800 rounded-full text-xs font-black border border-orange-200 mb-1">
                             <MessageSquare className="w-3.5 h-3.5 text-orange-500" />
                             <span>Master Prompt Library</span>
                          </div>
                          <h1 className="text-2xl sm:text-3xl font-black text-[#14532d] tracking-tight">
                             {isPromptAdmin && promptViewMode === 'global' ? 'Global Master Prompts' : 'My Subject Prompts'}
                          </h1>
                          {isPromptAdmin && (
                            <div className="flex bg-emerald-50/50 p-1 rounded-xl w-fit mt-2 border border-emerald-100">
                              <button 
                                onClick={() => setPromptViewMode('personal')} 
                                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${promptViewMode === 'personal' ? 'bg-white text-emerald-700 shadow-sm border border-emerald-200' : 'text-emerald-600 hover:bg-emerald-50'}`}
                              >
                                Personal
                              </button>
                              <button 
                                onClick={() => setPromptViewMode('global')} 
                                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${promptViewMode === 'global' ? 'bg-white text-emerald-700 shadow-sm border border-emerald-200' : 'text-emerald-600 hover:bg-emerald-50'}`}
                              >
                                Global Master
                              </button>
                            </div>
                          )}
                          <p className="text-sm font-semibold text-slate-600 max-w-2xl">
                             Configure default master AI prompts for each subject. Click any subject card to customize its prompt or generate a tailored template with AI!
                          </p>
                       </div>

                       {/* Quick Add Subject Bar */}
                       <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 shrink-0">
                          <input
                             type="text"
                             value={newSubjectName}
                             onChange={(e) => setNewSubjectName(e.target.value)}
                             onKeyDown={(e) => { if (e.key === 'Enter') handleAddSubject(); }}
                             placeholder="New Subject Name (e.g. History)..."
                             className="bg-transparent px-3 py-2 text-xs font-semibold text-slate-800 outline-none w-48 sm:w-64"
                          />
                          <button
                             onClick={handleAddSubject}
                             className="bg-orange-600 hover:bg-orange-500 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 shrink-0 cursor-pointer"
                          >
                             <Plus className="w-4 h-4" />
                             <span>Add Subject</span>
                          </button>
                       </div>
                    </div>

                    {/* Subject Icon Cards Grid (Matching Homework Generator Style) */}
                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                          <h2 className="text-lg font-black text-[#14532d] flex items-center gap-2">
                             <span>📚</span> Available Subjects ({activeSubjectKeys.length})
                          </h2>
                          <span className="text-xs font-bold text-slate-400">Click any card to edit prompt template</span>
                       </div>

                       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                          {activeSubjectKeys.map((subKey) => {
                             const style = resolveSubjectStyle(subKey);
                             const displayName = subKey.charAt(0).toUpperCase() + subKey.slice(1);
                             const currentMap = (isPromptAdmin && promptViewMode === 'global') ? masterPromptsMap : subjectPrompts;
                             const hasPrompt = !!currentMap[subKey];

                             return (
                                <div
                                   key={subKey}
                                   onClick={() => handleOpenPromptModal(subKey)}
                                   className={`relative p-5 rounded-3xl border-2 cursor-pointer transition-all flex flex-col items-center text-center group ${style.bgColor} ${style.borderColor} hover:${style.selectedBorder} hover:shadow-lg hover:-translate-y-1`}
                                >
                                   {/* Delete Button */}
                                   <button
                                      onClick={(e) => {
                                         e.stopPropagation();
                                         handleDeleteSubject(subKey);
                                      }}
                                      className="absolute top-3 right-3 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-red-50"
                                      title="Delete Subject Prompt"
                                   >
                                      <Trash2 className="w-4 h-4" />
                                   </button>

                                   {/* Subject Icon */}
                                   <div className="mb-3 scale-95 origin-center group-hover:scale-105 transition-transform">
                                      {style.renderIcon()}
                                   </div>

                                   {/* Subject Title */}
                                   <h3 className={`text-base font-black mb-1 capitalize line-clamp-1 ${style.titleColor}`}>
                                      {displayName}
                                   </h3>

                                   {/* Status Subtitle */}
                                   <p className="text-[11px] font-semibold text-slate-500 leading-tight px-1 line-clamp-2">
                                      {hasPrompt ? 'Click to edit prompt template ✏️' : 'No prompt set • Click to add ➕'}
                                   </p>
                                </div>
                             );
                          })}
                       </div>
                    </div>

                    {/* POP-UP EDIT MODAL */}
                    <AnimatePresence>
                       {activePromptModalSubject && (
                          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                             <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="bg-white rounded-3xl max-w-2xl w-full border-2 border-slate-200 shadow-2xl overflow-hidden font-sans flex flex-col max-h-[90vh]"
                             >
                                {/* Modal Header */}
                                {(() => {
                                   const style = resolveSubjectStyle(activePromptModalSubject);
                                   const displayName = activePromptModalSubject.charAt(0).toUpperCase() + activePromptModalSubject.slice(1);
                                   return (
                                      <div className={`p-6 ${style.bgColor} border-b ${style.borderColor} flex items-center justify-between shrink-0`}>
                                         <div className="flex items-center gap-3">
                                            <div className="scale-75 origin-left">
                                               {style.renderIcon()}
                                            </div>
                                            <div>
                                               <h3 className={`text-xl font-black capitalize ${style.titleColor}`}>
                                                  {displayName} Master Prompt
                                               </h3>
                                               <p className="text-xs font-semibold text-slate-600">
                                                  Edit default prompt template for {displayName}
                                               </p>
                                            </div>
                                         </div>
                                         <button
                                            onClick={() => setActivePromptModalSubject(null)}
                                            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white/80 rounded-full transition-colors"
                                         >
                                            <X className="w-5 h-5" />
                                         </button>
                                      </div>
                                   );
                                })()}

                                  {/* Modal Content */}
                                  <div className="p-6 space-y-4 overflow-y-auto flex-1">
                                     {(() => {
                                        const isMasterSubject = (() => {
                                           if (!activePromptModalSubject) return false;
                                           const sub = activePromptModalSubject.toLowerCase().trim();
                                           const masterKeys = Object.keys(masterPromptsMap || {}).map(k => k.toLowerCase().trim());
                                           const defaultKeys = Object.keys(DEFAULT_SUBJECT_PROMPTS || {}).map(k => k.toLowerCase().trim());
                                           return masterKeys.includes(sub) || defaultKeys.includes(sub) || sub === "vocabulary";
                                        })();

                                        return (
                                           <div className="flex items-center justify-between gap-2 flex-wrap">
                                              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                                                 AI Prompt Template
                                              </label>
                                              <div className="flex items-center gap-2">
                                                 {isMasterSubject ? (
                                                    <button
                                                       type="button"
                                                       onClick={async () => {
                                                          if (window.confirm(`Reset "${activePromptModalSubject}" prompt back to your original default template?`)) {
                                                             const masterPrompts = await getMasterDefaultPrompts(db);
                                                             const defaultText = masterPrompts[activePromptModalSubject] || masterPrompts[activePromptModalSubject.toLowerCase()] || getPremiumPromptTemplate(activePromptModalSubject);
                                                             setEditingPromptContent(defaultText);
                                                          }
                                                       }}
                                                       className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                                                       title="Reload the original master template prompt generated by admin"
                                                    >
                                                       <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                                                       <span>Reload Master Template</span>
                                                    </button>
                                                 ) : (
                                                    <button
                                                       type="button"
                                                       disabled={editingPromptContent.startsWith("Generating")}
                                                       onClick={async () => {
                                                          setEditingPromptContent("Generating premium prompt using AI... Please wait a moment.");
                                                          try {
                                                             const generatedText = await generateContent({
                                                                prompt: `Write a highly detailed, customized, and structured instruction prompt template for another AI to generate high-quality worksheets and questions specifically for the subject: "${activePromptModalSubject}". The generated prompt must contain subject-specific details (key concepts, terminology, question structures, and topics unique to "${activePromptModalSubject}"). It should dynamically cater to the grade and difficulty level selected. Do not write a generic template containing '{SUBJECT}'. Write a concrete prompt tailored specifically to "${activePromptModalSubject}". Output only the prompt text itself, with no explanations or markdown quotes.`,
                                                                systemInstruction: "You are an expert AI prompt engineer. Write a highly detailed, professional, structured instruction prompt for another AI to generate high-quality worksheets and questions. Output ONLY the resulting prompt.",
                                                                provider: "gemini"
                                                             });
                                                             if (generatedText) {
                                                                setEditingPromptContent(generatedText.trim());
                                                             }
                                                          } catch (err) {
                                                             console.error("AI prompt generation error:", err);
                                                             setEditingPromptContent(getPremiumPromptTemplate(activePromptModalSubject));
                                                          }
                                                       }}
                                                       className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer disabled:opacity-50"
                                                    >
                                                       <Wand2 className="w-3.5 h-3.5 text-amber-600" />
                                                       <span>{editingPromptContent.startsWith("Generating") ? "Generating..." : "Auto-Structure Template"}</span>
                                                    </button>
                                                 )}
                                              </div>
                                           </div>
                                        );
                                     })()}

                                   <textarea
                                      rows={10}
                                      value={editingPromptContent}
                                      onChange={(e) => setEditingPromptContent(e.target.value)}
                                      className="w-full bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 rounded-2xl p-4 text-xs font-mono font-medium text-slate-800 outline-none transition-colors leading-relaxed resize-none shadow-inner"
                                      placeholder={`Enter custom AI prompt template for ${activePromptModalSubject}...`}
                                   />
                                </div>

                                {/* Modal Footer */}
                                <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
                                   <button
                                      type="button"
                                      onClick={() => {
                                         handleDeleteSubject(activePromptModalSubject);
                                         setActivePromptModalSubject(null);
                                      }}
                                      className="text-red-500 hover:text-red-700 font-bold text-xs px-3 py-2 rounded-xl hover:bg-red-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                                   >
                                      <Trash2 className="w-4 h-4" />
                                      <span>Delete Subject</span>
                                   </button>

                                   <div className="flex items-center gap-3">
                                      <button
                                         type="button"
                                         onClick={() => setActivePromptModalSubject(null)}
                                         className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-2xl transition-colors cursor-pointer"
                                      >
                                         Cancel
                                      </button>
                                      <button
                                         type="button"
                                         disabled={isSavingPrompts}
                                         onClick={handleSaveModalPrompt}
                                         className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-black text-xs rounded-2xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                      >
                                         <Save className="w-4 h-4" />
                                         <span>{isSavingPrompts ? 'Saving...' : 'Save Prompt 💾'}</span>
                                      </button>
                                   </div>
                                </div>
                             </motion.div>
                          </div>
                       )}
                    </AnimatePresence>

                    <GrassBorder />
                 </div>
              );
           }
         case 'Tuition Fees': {
            return (
               <div className="px-10 py-10 space-y-8 min-h-[calc(100vh-64px)] pb-40">
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
                              No students found. 🔍
                           </div>
                        )}
                     </div>
                  </div>

                  <GrassBorder />
               </div>
            );
         }
         case 'Settings':
            return renderSettingsTab();
         case 'Billing & Licenses':
            return renderBillingTab();
         case 'Contact Us':
            return <ContactUsTab user={user} teacherData={teacherData} />;
         case 'Admin Reports':
              return isAdminUser ? renderAdminReportsTab() : null;
           case 'System Logs':
              return isAdminUser ? <SystemLogsTab adminTeachers={adminTeachers} /> : null;
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
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-200" />
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
            <SidebarItem id="Reports" label="Reports" icon={<BarChartIcon className="w-5 h-5 text-[#EA580C]" />} active={activeTab === 'Reports'} onClick={setActiveTab} />
            <SidebarItem id="Test Reports" label="Test Reports" icon={<BarChartIcon className="w-5 h-5 text-purple-500" />} active={activeTab === 'Test Reports'} onClick={setActiveTab} />
            {(() => {
               const unreadMessageCount = teacherMessages.filter(msg => msg.recipientId === user?.uid && !msg.isRead).length;
               return (
                  <SidebarItem id="Messages" label="Messages" icon={<img src="/ic-messages.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Messages" />} active={activeTab === 'Messages'} onClick={setActiveTab} badge={unreadMessageCount} />
               );
            })()}
            <SidebarItem id="Rewards" label="Rewards" icon={<img src="/ic-rewards.png" className="w-6 h-6 object-contain mix-blend-multiply" alt="Rewards" />} active={activeTab === 'Rewards'} onClick={setActiveTab} />
            <SidebarItem id="My Prompts" label="My Prompts" icon={<MessageSquare className="w-5 h-5 text-orange-500" />} active={activeTab === 'My Prompts'} onClick={setActiveTab} />
            <SidebarItem id="Tuition Fees" label="Tuition Fees" icon={<CreditCard className="w-5 h-5 text-green-500" />} active={activeTab === 'Tuition Fees'} onClick={setActiveTab} />
            <SidebarItem id="Revenue" label="Revenue" icon={<TrendingUp className="w-5 h-5 text-emerald-500" />} active={activeTab === 'Revenue'} onClick={setActiveTab} />
            <SidebarItem id="Billing & Licenses" label="Billing & Licenses" icon={<CreditCard className="w-5 h-5 text-blue-500" />} active={activeTab === 'Billing & Licenses'} onClick={setActiveTab} />
            <SidebarItem id="Settings" label="Settings" icon={<Settings className="w-5 h-5 text-slate-500" />} active={activeTab === 'Settings'} onClick={setActiveTab} />
            <SidebarItem id="Contact Us" label="Contact Us" icon={<Mail className="w-5 h-5 text-indigo-500" />} active={activeTab === 'Contact Us'} onClick={setActiveTab} />
            {isAdminUser && (
              <>
                <SidebarItem id="Admin Reports" label="Admin Reports" icon={<Award className="w-5 h-5 text-purple-650 animate-pulse" />} active={activeTab === 'Admin Reports'} onClick={setActiveTab} />
                <SidebarItem id="System Logs" label="System Logs" icon={<Terminal className="w-5 h-5 text-rose-500" />} active={activeTab === 'System Logs'} onClick={setActiveTab} />
              </>
            )}
         </nav>

         {/* Mascot Bottom Support */}
         <div className="p-6 mt-auto">
            <div className="bg-orange-50/50 rounded-[32px] p-8 relative group overflow-hidden border border-orange-200/50">
               <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full opacity-40" />
               <p className="text-[11px] font-bold text-orange-900 leading-tight text-center relative z-10 italic">
                  Guiding every student<br/>to their best! 🌟
               </p>
               <div className="mt-4 flex-center">
                  <img src="/mascot.png" className="w-36 h-36 object-contain animate-float mix-blend-multiply drop-shadow-xl" alt="Mascot" />
               </div>
               <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-orange-200/20 rounded-full blur-2xl" />
            </div>
         </div>
      </aside>

      <main className="flex-1 overflow-y-auto no-scrollbar bg-[#F9F9FF] relative p-4 lg:p-6 flex flex-col">
        {(() => {
           const lockedCount = allStudents.filter(s => s.isQuotaLocked).length;
           if (lockedCount > 0) {
              return (
                 <div className="bg-amber-50 border border-amber-200 text-amber-800 px-6 py-3 rounded-2xl mb-4 flex items-center justify-between shadow-sm animate-pulse">
                    <div className="flex items-center gap-3">
                       <AlertCircle className="w-5 h-5 text-amber-600" />
                       <p className="text-sm font-bold">
                          You have {lockedCount} {lockedCount === 1 ? 'student' : 'students'} locked due to your current seat limit.
                       </p>
                    </div>
                    <button onClick={() => setActiveTab('Billing & Licenses')} className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black shadow-sm transition-all active:scale-95">
                       Upgrade Plan to Unlock
                    </button>
                 </div>
              );
           }
           return null;
        })()}
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
                 <div className="flex items-center gap-3">
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
                  {/* Change Adventure Maze Goal Button near Grade/Class selector */}
                  <button
                     onClick={() => {
                        setNewGoalTitle(activeClassroom?.goalTitle || 'Class Adventure Goal 🏆');
                        setNewGoalTarget(activeClassroom?.goalTarget || 1500);
                        setNewGoalTrack(activeClassroom?.activeTrack || 'auto');
                        setIsEditingGoal(true);
                     }}
                     className="flex items-center gap-2 px-4 py-2.5 bg-orange-50 hover:bg-orange-100 text-[#EA580C] rounded-2xl border border-orange-200/60 text-xs font-black transition-all shadow-sm active:scale-95 cursor-pointer shrink-0 ml-2"
                     title="Change Class Adventure Maze Goal & Theme"
                  >
                     <Pencil className="w-3.5 h-3.5" />
                     <span>Change Goal</span>
                  </button>
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
                              placeholder="e.g. Pizza Party! ðŸ•"
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
                              <option value="barbie">Dream World 🎀</option>
                              <option value="minecraft">Block Builder's Quest â›ï¸</option>
                              <option value="sonic">Sonic Grand Prix 🦔</option>
                              <option value="mario">Super Adventure Kingdom ðŸ„</option>
                              <option value="forest">Enchanted Forest 🌲</option>
                              <option value="space">Cosmic Space Maze 🚀</option>
                              <option value="island">Adventure Island ðŸï¸</option>
                              <option value="sports">Sports Track ðŸƒ</option>
                              <option value="undersea">Undersea Voyage 🌊</option>
                              <option value="candyland">Candyland Adventure ðŸ¬</option>
                              <option value="dinosaur">Dinosaur Safari 🦖</option>
                              <option value="pirate">Pirate Treasure Hunt ðŸ´â€â˜ ï¸</option>
                              <option value="haunted">Haunted Castle 👍»</option>
                              <option value="winter">Winter Wonderland â›„</option>
                              <option value="jungle">Jungle Explorer 🌴</option>
                              <option value="desert">Desert Mirage ðŸœï¸</option>
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
                              {['ðŸ†', '🎨', '🧠ª', 'ðŸ¤', '🌟', '🧠 ', 'â¤ï¸', '⚠️¡', '🚀', 'ðŸŒ±', '📚', '🎖️'].map(emoji => (
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
                              placeholder="e.g. Maths Genius 📝"
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
                           {isAwardingBadge ? 'Awarding...' : 'Award Badge ðŸ†'}
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
         const submissions = allSubmissions.filter(s => s.homeworkId === selectedCalendarHw.id && (!activeClassroom || s.classId === activeClassroom?.id));
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
                  subject: `⚠️ï¸ Reminder: ${selectedCalendarHw.title}`,
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
                           <span>✨…</span> Submitted ({submissions.length})
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
                           <span>â³</span> Pending ({pendingStudents.length})
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

                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-[20px] mb-2 select-none">
                  <div>
                    <label className="text-xs font-black text-slate-700 block">Disable Chat / Messaging</label>
                    <span className="text-[9px] font-bold text-slate-400">Prevent students from sending or viewing chat messages</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={newChatDisabled}
                    onChange={(e) => setNewChatDisabled(e.target.checked)}
                    className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
                  />
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
                <p className="text-sm font-bold text-slate-400">Update your class details! ✨¨</p>
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

                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-[20px] mb-2 select-none">
                  <div>
                    <label className="text-xs font-black text-slate-700 block">Disable Chat / Messaging</label>
                    <span className="text-[9px] font-bold text-slate-400">Prevent students from sending or viewing chat messages</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={editChatDisabled}
                    onChange={(e) => setEditChatDisabled(e.target.checked)}
                    className="w-5 h-5 accent-orange-600 rounded cursor-pointer"
                  />
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
                       ✨•
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
                                  const qId = q.id !== undefined && q.id !== null ? q.id : (qIdx + 1);
                                  const studentSelection = 
                                    selectedSubmission.answers?.[q.id] ?? 
                                    selectedSubmission.answers?.[String(q.id)] ?? 
                                    selectedSubmission.answers?.[`idx_${qIdx}`] ?? 
                                    selectedSubmission.answers?.[qIdx + 1] ?? 
                                    selectedSubmission.answers?.[qIdx];

                                  const actualAnswer = q.answer !== undefined ? q.answer : (q.correctAnswer !== undefined ? q.correctAnswer : '');
                                  const isCorrect = checkIsCorrect(q, studentSelection);

                                  const explanationText = 
                                    selectedSubmission.wrongAnswersExplanations?.[q.id] ||
                                    selectedSubmission.wrongAnswersExplanations?.[String(q.id)] ||
                                    selectedSubmission.wrongAnswersExplanations?.[`idx_${qIdx}`] ||
                                    selectedSubmission.wrongAnswersExplanations?.[qIdx + 1] ||
                                    reviewHomework.questionExplanations?.[q.id] ||
                                    reviewHomework.questionExplanations?.[String(q.id)] ||
                                    reviewHomework.questionExplanations?.[`idx_${qIdx}`] ||
                                    reviewHomework.questionExplanations?.[qIdx + 1] ||
                                    q.explanation ||
                                    `The correct answer is "${actualAnswer}".`;
                                  
                                  return (
                                     <div key={q.id || qIdx} className={`rounded-[24px] p-6 lg:p-8 space-y-5 border-2 ${isCorrect ? 'bg-[#f8fafc] border-emerald-100' : 'bg-rose-50/40 border-rose-200'}`}>
                                        <div className="flex items-start justify-between gap-4">
                                           <p className="text-[15px] font-bold text-slate-800 tracking-tight flex-1">
                                              <span className={`font-black mr-2 px-2 py-0.5 rounded-lg text-xs ${isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                                 Q{qIdx + 1}
                                              </span> 
                                              {q.text}
                                           </p>
                                           <span className={`px-3 py-1 rounded-full text-xs font-black shrink-0 ${isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                              {isCorrect ? '✓ Correct' : '✕ Incorrect'}
                                           </span>
                                        </div>
                                        
                                        {q.options && q.options.length > 0 ? (
                                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                              {q.options.map((opt, optIdx) => {
                                                 const isStudentSelection = checkIsCorrect({ answer: opt, questionType: 'text' }, studentSelection) || opt === studentSelection || String(opt).trim().toLowerCase() === String(studentSelection || '').trim().toLowerCase();
                                                 const isActualCorrect = checkIsCorrect({ answer: opt, questionType: 'text' }, actualAnswer) || opt === actualAnswer || String(opt).trim().toLowerCase() === String(actualAnswer || '').trim().toLowerCase();
                                                 
                                                 let optionClasses = "px-5 py-3.5 rounded-xl border flex items-center gap-4 transition-all ";
                                                 
                                                 if (isActualCorrect) {
                                                    optionClasses += "bg-[#d1f5d3] border-emerald-400 text-emerald-900 shadow-sm";
                                                 } else if (isStudentSelection && !isActualCorrect) {
                                                    optionClasses += "bg-rose-100 border-rose-300 text-rose-900 shadow-sm";
                                                 } else {
                                                    optionClasses += "bg-white border-slate-200 text-slate-600";
                                                 }

                                                 return (
                                                    <div key={optIdx} className={optionClasses}>
                                                       <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-black ${isActualCorrect ? 'bg-emerald-300 text-emerald-900' : isStudentSelection && !isActualCorrect ? 'bg-rose-300 text-rose-900' : 'bg-slate-100 text-slate-500'}`}>
                                                          {String.fromCharCode(65 + optIdx)}
                                                       </div>
                                                       <span className="text-[13px] font-bold flex-1">{opt}</span>
                                                       {isActualCorrect && (
                                                          <span className="text-[9px] uppercase tracking-wider font-black text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-md">
                                                             Correct Answer
                                                          </span>
                                                       )}
                                                       {isStudentSelection && !isActualCorrect && (
                                                          <span className="text-[9px] uppercase tracking-wider font-black text-rose-800 bg-rose-200/80 px-2 py-0.5 rounded-md">
                                                             Student's Answer
                                                          </span>
                                                       )}
                                                    </div>
                                                 );
                                              })}
                                           </div>
                                        ) : (
                                           <div className="flex flex-col gap-3">
                                             <div className={`p-4 rounded-xl border-2 ${isCorrect ? 'bg-[#d1f5d3] border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
                                               <p className="text-xs font-black uppercase mb-1 opacity-60">Student Answer</p>
                                               <p className="font-bold">{studentSelection || '(No answer provided)'}</p>
                                             </div>
                                             {!isCorrect && (
                                               <div className="p-4 rounded-xl border-2 bg-emerald-50 border-emerald-200 text-emerald-900">
                                                 <p className="text-xs font-black uppercase mb-1 opacity-60">Correct Answer</p>
                                                 <p className="font-bold">{actualAnswer}</p>
                                               </div>
                                             )}
                                           </div>
                                        )}

                                        {/* Explanation Card when answer is incorrect */}
                                        {!isCorrect && (
                                           <div className="bg-amber-50/90 border border-amber-200 p-5 rounded-2xl flex gap-3 text-left mt-4 shadow-sm">
                                              <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center border border-amber-200 shrink-0">
                                                 <Info className="w-5 h-5 text-amber-700" />
                                              </div>
                                              <div className="space-y-1 flex-1">
                                                 <p className="text-[10px] font-black uppercase tracking-widest text-amber-800">💡 Explanation & Method</p>
                                                 <p className="text-xs font-bold text-amber-900 leading-relaxed whitespace-pre-line">
                                                    {explanationText}
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
           const studentSubs = allSubmissions.filter(sub => normalizeName(sub.studentName) === normalizeName(studentName) && (!sub.classId || sub.classId === activeClassroom?.id))
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
                 const isCorrect = checkIsAnswerCorrect(studentSelection, actualAnswer);
                 
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
                 speedBadge = 'Quick Solver ⚠️¡';
                 badgeColorClass = 'bg-amber-50 text-amber-600 border border-amber-100';
              } else if (pacePerQ >= 15 && pacePerQ <= 40) {
                 speedBadge = 'Paced Solver â±ï¸';
                 badgeColorClass = 'bg-emerald-50 text-emerald-600 border border-emerald-100';
              } else {
                 speedBadge = 'Deep Thinker 🧠 ';
                 badgeColorClass = 'bg-[#FFEDD5] text-[#EA580C] border border-[#FED7AA]';
              }
           }

           const formatDuration = (secs) => {
              if (secs < 60) return `${secs}s`;
              const m = Math.floor(secs / 60);
              const s = secs % 60;
              return s > 0 ? `${m}m ${s}s` : `${m}m`;
           };

           const now = new Date();
           const oneDayMs = 24 * 60 * 60 * 1000;
           let timeSpentToday = 0;
           let timeSpentWeek = 0;
           let timeSpentMonth = 0;
           let timeSpentYear = 0;
           
           studentSubs.forEach(sub => {
              if (sub.timeSpent && sub.submittedAt) {
                 const subDate = sub.submittedAt.toDate ? sub.submittedAt.toDate() : new Date(sub.submittedAt);
                 const diffDays = (now - subDate) / oneDayMs;
                 const mins = sub.timeSpent / 60;
                 if (diffDays <= 1) timeSpentToday += mins;
                 if (diffDays <= 7) timeSpentWeek += mins;
                 if (diffDays <= 30) timeSpentMonth += mins;
                 if (diffDays <= 365) timeSpentYear += mins;
              }
           });
           timeSpentToday = Math.round(timeSpentToday);
           timeSpentWeek = Math.round(timeSpentWeek);
           timeSpentMonth = Math.round(timeSpentMonth);
           timeSpentYear = Math.round(timeSpentYear);

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
                              onClick={() => handleGenerateAiParentReport(studentName, startingScore, currentScore, growth, speedBadge, masteryArray, studentSubs.length, timeSpentToday, timeSpentWeek, timeSpentMonth, timeSpentYear)}
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
                              ✨•
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
                                   â† Back to submissions list
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
                                         const studentSelection = 
                                           selectedProfileSubmission.answers?.[q.id] ?? 
                                           selectedProfileSubmission.answers?.[String(q.id)] ?? 
                                           selectedProfileSubmission.answers?.[`idx_${qIdx}`] ?? 
                                           selectedProfileSubmission.answers?.[qIdx + 1] ?? 
                                           selectedProfileSubmission.answers?.[qIdx];

                                         const actualAnswer = q.answer !== undefined ? q.answer : (q.correctAnswer !== undefined ? q.correctAnswer : '');
                                         const isCorrect = checkIsCorrect(q, studentSelection);

                                         const explanationText = 
                                           selectedProfileSubmission.wrongAnswersExplanations?.[q.id] ||
                                           selectedProfileSubmission.wrongAnswersExplanations?.[String(q.id)] ||
                                           selectedProfileSubmission.wrongAnswersExplanations?.[`idx_${qIdx}`] ||
                                           selectedProfileSubmission.wrongAnswersExplanations?.[qIdx + 1] ||
                                           profileSubmissionHomework.questionExplanations?.[q.id] ||
                                           profileSubmissionHomework.questionExplanations?.[String(q.id)] ||
                                           profileSubmissionHomework.questionExplanations?.[`idx_${qIdx}`] ||
                                           profileSubmissionHomework.questionExplanations?.[qIdx + 1] ||
                                           q.explanation ||
                                           `The correct answer is "${actualAnswer}".`;
                                         
                                         return (
                                            <div key={q.id || qIdx} className={`rounded-[24px] p-6 lg:p-8 space-y-5 border-2 ${isCorrect ? 'bg-[#f8fafc] border-emerald-100' : 'bg-rose-50/40 border-rose-200'}`}>
                                               <div className="flex items-start justify-between gap-4">
                                                  <p className="text-[15px] font-bold text-slate-800 tracking-tight flex-1">
                                                     <span className={`font-black mr-2 px-2 py-0.5 rounded-lg text-xs ${isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                                        Q{qIdx + 1}
                                                     </span> 
                                                     {q.text}
                                                  </p>
                                                  <span className={`px-3 py-1 rounded-full text-xs font-black shrink-0 ${isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                     {isCorrect ? '✓ Correct' : '✕ Incorrect'}
                                                  </span>
                                               </div>
                                               
                                               {q.options && q.options.length > 0 ? (
                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                     {q.options.map((opt, optIdx) => {
                                                        const optLetter = String.fromCharCode(65 + optIdx);
                                                        const optLetterLower = optLetter.toLowerCase();
                                                        const cleanStudentSel = String(studentSelection ?? '').trim().toLowerCase();
                                                        const cleanOpt = String(opt ?? '').trim().toLowerCase();
                                                        const cleanActual = String(actualAnswer ?? '').trim().toLowerCase();

                                                        const isStudentSelection = Boolean(
                                                          studentSelection !== undefined && studentSelection !== null && cleanStudentSel !== '' && (
                                                            cleanStudentSel === optLetterLower ||
                                                            cleanStudentSel === String(optIdx) ||
                                                            cleanStudentSel === String(optIdx + 1) ||
                                                            cleanStudentSel === cleanOpt ||
                                                            checkIsCorrect({ answer: opt, questionType: 'text' }, studentSelection) ||
                                                            cleanOpt.startsWith(cleanStudentSel) ||
                                                            cleanStudentSel.startsWith(cleanOpt) ||
                                                            cleanStudentSel === `${optLetterLower}. ${cleanOpt}` ||
                                                            cleanStudentSel === `${optLetterLower}) ${cleanOpt}` ||
                                                            cleanStudentSel === `${optLetterLower} - ${cleanOpt}`
                                                          )
                                                        );

                                                        const isActualCorrect = Boolean(
                                                          actualAnswer !== undefined && actualAnswer !== null && cleanActual !== '' && (
                                                            cleanActual === optLetterLower ||
                                                            cleanActual === String(optIdx) ||
                                                            cleanActual === String(optIdx + 1) ||
                                                            cleanActual === cleanOpt ||
                                                            checkIsCorrect({ answer: opt, questionType: 'text' }, actualAnswer) ||
                                                            cleanOpt.startsWith(cleanActual) ||
                                                            cleanActual.startsWith(cleanOpt) ||
                                                            cleanActual === `${optLetterLower}. ${cleanOpt}` ||
                                                            cleanActual === `${optLetterLower}) ${cleanOpt}` ||
                                                            cleanActual === `${optLetterLower} - ${cleanOpt}`
                                                          )
                                                        );
                                                        
                                                        let optionClasses = "px-5 py-3.5 rounded-xl border flex items-center gap-4 transition-all ";
                                                        
                                                        if (isActualCorrect) {
                                                           optionClasses += "bg-[#d1f5d3] border-emerald-400 text-emerald-900 shadow-sm";
                                                        } else if (isStudentSelection && !isActualCorrect) {
                                                           optionClasses += "bg-rose-100 border-rose-300 text-rose-900 shadow-sm";
                                                        } else {
                                                           optionClasses += "bg-white border-slate-200 text-slate-600";
                                                        }

                                                        return (
                                                           <div key={optIdx} className={optionClasses}>
                                                              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-black ${isActualCorrect ? 'bg-emerald-300 text-emerald-900' : isStudentSelection && !isActualCorrect ? 'bg-rose-300 text-rose-900' : 'bg-slate-100 text-slate-500'}`}>
                                                                 {optLetter}
                                                              </div>
                                                              <span className="text-[13px] font-bold flex-1">{opt}</span>
                                                              {isActualCorrect && (
                                                                 <span className="text-[9px] uppercase tracking-wider font-black text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-md">
                                                                    Correct Answer
                                                                 </span>
                                                              )}
                                                              {isStudentSelection && !isActualCorrect && (
                                                                 <span className="text-[9px] uppercase tracking-wider font-black text-rose-800 bg-rose-200/80 px-2 py-0.5 rounded-md">
                                                                    Student's Answer
                                                                 </span>
                                                              )}
                                                           </div>
                                                        );
                                                     })}
                                                  </div>
                                               ) : (
                                                  <div className="flex flex-col gap-3">
                                                    <div className={`p-4 rounded-xl border-2 ${isCorrect ? 'bg-[#d1f5d3] border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
                                                      <p className="text-xs font-black uppercase mb-1 opacity-60">Student Answer</p>
                                                      <p className="font-bold">{studentSelection || '(No answer provided)'}</p>
                                                    </div>
                                                    {!isCorrect && (
                                                      <div className="p-4 rounded-xl border-2 bg-emerald-50 border-emerald-200 text-emerald-900">
                                                        <p className="text-xs font-black uppercase mb-1 opacity-60">Correct Answer</p>
                                                        <p className="font-bold">{actualAnswer}</p>
                                                      </div>
                                                    )}
                                                  </div>
                                               )}

                                               {/* Explanation Card when answer is incorrect */}
                                               {!isCorrect && (
                                                  <div className="bg-amber-50/90 border border-amber-200 p-5 rounded-2xl flex gap-3 text-left mt-4 shadow-sm">
                                                     <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center border border-amber-200 shrink-0">
                                                        <Info className="w-5 h-5 text-amber-700" />
                                                     </div>
                                                     <div className="space-y-1 flex-1">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-800">💡 Explanation & Method</p>
                                                        <p className="text-xs font-bold text-amber-900 leading-relaxed whitespace-pre-line">
                                                           {explanationText}
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
                                         {/* Time Dedicated Summary */}
                                         <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-3xl p-6 shadow-sm animate-fadeIn space-y-4 mb-6">
                                            <h3 className="text-sm font-black text-[#166534] uppercase tracking-widest flex items-center gap-2">
                                               <Clock className="w-5 h-5 text-[#22c55e]" />
                                               Time Dedicated on Homework Zone
                                            </h3>
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                               <div className="bg-white rounded-2xl border border-emerald-100 p-4 text-center">
                                                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Today</span>
                                                  <span className="text-2xl font-black text-[#14532d]">{timeSpentToday} <span className="text-sm">mins</span></span>
                                               </div>
                                               <div className="bg-white rounded-2xl border border-emerald-100 p-4 text-center">
                                                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">This Week</span>
                                                  <span className="text-2xl font-black text-[#14532d]">{timeSpentWeek} <span className="text-sm">mins</span></span>
                                               </div>
                                               <div className="bg-white rounded-2xl border border-emerald-100 p-4 text-center">
                                                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">This Month</span>
                                                  <span className="text-2xl font-black text-[#14532d]">{timeSpentMonth} <span className="text-sm">mins</span></span>
                                               </div>
                                               <div className="bg-white rounded-2xl border border-emerald-100 p-4 text-center">
                                                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">This Year</span>
                                                  <span className="text-2xl font-black text-[#14532d]">{timeSpentYear} <span className="text-sm">mins</span></span>
                                               </div>
                                            </div>
                                         </div>

                                         {/* Gaps Banner */}
                                         {masteryArray.some(m => m.accuracy < 60) && (
                                            <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl flex gap-4 text-left mb-6">
                                               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0 text-rose-500">
                                                  ⚠️ï¸
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
                                 ✨•
                               </button>
                             </div>

                             {/* Overlay Body */}
                             <div className="flex-1 p-8 overflow-y-auto custom-scrollbar space-y-6">
                               {isGeneratingReport ? (
                                 <div className="py-20 flex flex-col items-center justify-center gap-4">
                                   <div className="w-12 h-12 border-4 border-green-200 border-t-[#EA580C] rounded-full animate-spin" />
                                   <p className="text-sm font-black text-green-800 animate-pulse">Analyzing 4-week submissions &amp; compiling visual report...</p>
                                 </div>
                               ) : (
                                 <div className="space-y-6">
                                   {/* 80% Visual KPI Gauges Header */}
                                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-100 p-4 rounded-3xl">
                                     <div className="bg-white p-3.5 rounded-2xl border border-slate-100 text-center shadow-sm">
                                       <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">4-Wk Accuracy</span>
                                       <span className="text-xl font-black text-emerald-600">{currentScore}%</span>
                                     </div>
                                     <div className="bg-white p-3.5 rounded-2xl border border-slate-100 text-center shadow-sm">
                                       <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">4-Wk Growth</span>
                                       <span className="text-xl font-black text-orange-600">{growth >= 0 ? `+${growth}%` : `${growth}%`}</span>
                                     </div>
                                     <div className="bg-white p-3.5 rounded-2xl border border-slate-100 text-center shadow-sm">
                                       <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Practice Time</span>
                                       <span className="text-xl font-black text-purple-600">{timeSpentMonth}m</span>
                                     </div>
                                     <div className="bg-white p-3.5 rounded-2xl border border-slate-100 text-center shadow-sm">
                                       <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Missions</span>
                                       <span className="text-xl font-black text-blue-600">{studentSubs.length}</span>
                                     </div>
                                   </div>

                                   {/* Umbrella Skill Mastery Visual Progress Bars */}
                                   {masteryArray.length > 0 && (
                                     <div className="bg-white border border-slate-150 rounded-3xl p-5 space-y-3 shadow-sm">
                                       <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                         <span>📊</span> 4-Week Umbrella Skill Masteries
                                       </h4>
                                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                         {masteryArray.map((m, idx) => {
                                           const barColor = m.accuracy >= 80 ? 'bg-emerald-500' : m.accuracy >= 60 ? 'bg-blue-500' : 'bg-rose-500';
                                           return (
                                             <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5">
                                               <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                                                 <span className="truncate max-w-[170px]">{m.name}</span>
                                                 <span className="font-black text-slate-900">{m.accuracy}%</span>
                                               </div>
                                               <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                                 <div className={`h-full rounded-full ${barColor}`} style={{ width: `${m.accuracy}%` }} />
                                               </div>
                                             </div>
                                           );
                                         })}
                                       </div>
                                     </div>
                                   )}

                                   {/* Concise 20% Text Summary */}
                                   <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-slate-700 text-xs font-bold leading-relaxed whitespace-pre-wrap font-sans max-h-[35vh] overflow-y-auto custom-scrollbar">
                                     {aiReportContent}
                                   </div>

                                   <div className="flex gap-4">
                                     <button
                                       onClick={() => {
                                         navigator.clipboard.writeText(aiReportContent);
                                         alert("Report copied to clipboard! 📋✨¨");
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
                                       <span>🖨️</span> Print
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

       {/* Resume Subscription Modal */}
       <AnimatePresence>
         {showResumeModal && (
           <div className="fixed inset-0 bg-[#3C2E75]/40 backdrop-blur-sm z-[200] flex-center p-6">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="max-w-md w-full bg-white rounded-[40px] p-10 space-y-6 shadow-2xl border-8 border-emerald-100 relative text-center"
             >
               <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2 text-emerald-500">
                 <Zap className="w-10 h-10" />
               </div>
               <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                 Resume Subscription?
               </h2>
               <p className="text-sm font-medium text-slate-500 pb-2">
                 Your plan will be fully reinstated and will automatically renew at the end of your current billing cycle. Welcome back!
               </p>
               <div className="flex flex-col gap-3 pt-2">
                 <button 
                   onClick={executeResumeSubscription}
                   disabled={isResumingSub}
                   className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-200 disabled:opacity-50"
                 >
                   {isResumingSub ? 'Resuming...' : 'Yes, Resume Plan'}
                 </button>
                 <button 
                   onClick={() => setShowResumeModal(false)}
                   disabled={isResumingSub}
                   className="w-full bg-slate-100 hover:bg-slate-200 text-slate-500 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50"
                 >
                   Keep Canceled
                 </button>
               </div>
             </motion.div>
           </div>
         )}
       </AnimatePresence>

       {/* Upgrade Confirmation Modal */}
       <AnimatePresence>
         {upgradeTargetPlan && (
           <div className="fixed inset-0 bg-[#3C2E75]/40 backdrop-blur-sm z-[200] flex-center p-6">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="max-w-md w-full bg-white rounded-[40px] p-10 space-y-6 shadow-2xl border-8 border-emerald-200 relative text-center"
             >
               <button 
                 onClick={() => !isUpgrading && setUpgradeTargetPlan(null)}
                 className="absolute top-4 right-4 w-10 h-10 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-full flex-center transition-colors"
               >
                 <X className="w-5 h-5" />
               </button>
               <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-2 text-emerald-500">
                 <Rocket className="w-10 h-10" />
               </div>
               <h3 className="text-2xl font-black text-emerald-900">Confirm Upgrade</h3>
               <p className="text-sm font-bold text-emerald-700 leading-relaxed">
                 You are about to upgrade your subscription! Your unused time from your current plan will be <strong>automatically prorated</strong> and credited to this transaction.
               </p>
               <div className="flex flex-col gap-3 pt-2">
                 <button 
                   onClick={executeDirectUpgrade}
                   disabled={isUpgrading}
                   className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-200 disabled:opacity-50"
                 >
                   {isUpgrading ? 'Upgrading Plan...' : 'Confirm & Upgrade'}
                 </button>
                 <button 
                   onClick={() => setUpgradeTargetPlan(null)}
                   disabled={isUpgrading}
                   className="w-full bg-slate-100 hover:bg-slate-200 text-slate-500 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50"
                 >
                   Nevermind
                 </button>
               </div>
             </motion.div>
           </div>
         )}
       </AnimatePresence>


       {/* Cancel Subscription Modal */}
       <AnimatePresence>
         {showCancelModal && (
           <div className="fixed inset-0 bg-[#3C2E75]/40 backdrop-blur-sm z-[200] flex-center p-6">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="max-w-md w-full bg-white rounded-[40px] p-10 space-y-6 shadow-2xl border-8 border-rose-100 relative text-center"
             >
               <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-2 text-rose-500">
                 <AlertCircle className="w-10 h-10" />
               </div>
               <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                 Cancel Subscription?
               </h2>
               <p className="text-sm font-medium text-slate-500 pb-2">
                 Are you sure you want to cancel? You will retain access to your students and classes until the end of your current billing cycle.
               </p>
               <div className="flex flex-col gap-3 pt-2">
                 <button 
                   onClick={executeCancelSubscription}
                   disabled={isCancellingSub}
                   className="w-full bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-200 disabled:opacity-50"
                 >
                   {isCancellingSub ? 'Canceling...' : 'Yes, Cancel Subscription'}
                 </button>
                 <button 
                   onClick={() => setShowCancelModal(false)}
                   disabled={isCancellingSub}
                   className="w-full bg-slate-100 hover:bg-slate-200 text-slate-500 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50"
                 >
                   Keep My Plan
                 </button>
               </div>
             </motion.div>
           </div>
         )}
       </AnimatePresence>

       {/* Upgrade Alert Modal */}
       <AnimatePresence>
         {showUpgradeAlert && (() => {
            const simulatedPlan = typeof localStorage !== 'undefined' ? localStorage.getItem('hwz_simulated_plan') : null;
            const activePlanId = simulatedPlan || ((teacherBilling && ['active', 'trialing'].includes(teacherBilling.status)) ? teacherBilling.planId : 'free');
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
       {/* Booster Success Modal */}
      <AnimatePresence>
        {boosterSuccessData && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-[40px] p-10 max-w-sm w-full shadow-2xl flex flex-col items-center text-center space-y-6"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center border-8 border-green-50 mb-2">
                <span className="text-5xl">✅</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-slate-800">Payment Verified!</h3>
                <p className="text-slate-600 font-medium">Successfully added <strong className="text-violet-600 font-black">{boosterSuccessData}</strong> papers to your quota.</p>
                <p className="text-sm text-slate-500">Your new papers are immediately available to use.</p>
              </div>
              <button 
                onClick={() => setBoosterSuccessData(null)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-95"
              >
                Awesome!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Booster Error Modal */}
      <AnimatePresence>
        {boosterErrorMsg && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-[40px] p-10 max-w-sm w-full shadow-2xl flex flex-col items-center text-center space-y-6"
            >
              <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center border-8 border-rose-50 mb-2">
                <span className="text-5xl">⚠️</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-slate-800">Verification Notice</h3>
                <p className="text-slate-600 font-medium">{boosterErrorMsg}</p>
                <p className="text-xs text-slate-500">If your payment was successful, it will be added shortly.</p>
              </div>
              <button 
                onClick={() => setBoosterErrorMsg('')}
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-4 rounded-2xl transition-all active:scale-95"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Verifying Loading Overlay */}
      <AnimatePresence>
        {isVerifyingPayment && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex flex-col items-center justify-center p-4 text-white">
             <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
             <p className="font-bold text-lg animate-pulse">Verifying secure payment...</p>
          </div>
        )}
      </AnimatePresence>

       <AgenticHelpAssistant setDashboardTab={setActiveTab} />
        </main>
     </div>
    );
};

const SidebarItem = ({ id, label, icon, iconColor, active, onClick, badge }) => (
  <button 
    onClick={() => onClick(id)}
    className={`w-full flex items-center justify-between gap-4 px-6 py-4 rounded-[24px] transition-all group ${active ? 'bg-[#FFEDD5] text-[#EA580C] shadow-xl shadow-green-50' : 'text-[#166534] hover:bg-blue-50/50 hover:text-[#14532d]'}`}
  >
     <div className="flex items-center gap-4">
       <div className={`${active ? 'text-[#EA580C]' : iconColor} group-hover:scale-125 transition-transform w-6 h-6 flex-center`}>
          {React.isValidElement(icon) && icon.type === 'img' ? icon : React.cloneElement(icon, { size: 20, strokeWidth: 3, fill: "currentColor" })}
       </div>
       <span className={`text-sm font-black tracking-tight ${active ? 'text-[#EA580C]' : 'text-[#166534]'}`}>{label}</span>
     </div>
     {badge > 0 && (
       <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full min-w-[20px] text-center">
         {badge}
       </span>
     )}
  </button>
);

const ClassCard = ({ name, students, bgColor, kidsImg, subjects, onDelete, onView, onEdit }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className={`${bgColor} rounded-3xl p-5 border border-white/60 shadow-sm flex flex-col gap-3.5 max-w-[260px] w-full mx-auto group hover:shadow-md transition-all relative overflow-hidden`}>
       <AnimatePresence>
         {showConfirm && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="absolute inset-0 bg-rose-600/95 z-50 flex flex-col items-center justify-center p-5 text-center space-y-3"
           >
             <div className="w-12 h-12 bg-white/20 rounded-full flex-center text-white">
                <Trash2 className="w-6 h-6" />
             </div>
             <div className="space-y-0.5">
                <h4 className="text-white font-black text-lg">Delete Class?</h4>
                <p className="text-white/80 text-[11px] font-bold leading-tight">This will remove all students and data!</p>
             </div>
             <div className="flex items-center gap-2.5 w-full pt-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                  className="flex-1 bg-white text-rose-600 py-2 rounded-xl font-black text-xs shadow-md"
                >
                   Delete
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowConfirm(false); }}
                  className="flex-1 bg-black/20 text-white py-2 rounded-xl font-black text-xs"
                >
                   Cancel
                </button>
             </div>
           </motion.div>
         )}
       </AnimatePresence>

       {/* Title & Student Count */}
       <div className="text-center space-y-0.5">
          <h3 
            className="text-lg font-black text-[#14532d] flex items-center justify-center gap-1.5 group/title cursor-pointer hover:text-[#C2410C] transition-colors" 
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            title="Click to edit class"
          >
            <span>{name}</span>
            <Pencil className="w-3.5 h-3.5 p-0.5 bg-green-100/80 rounded-full text-[#166534] opacity-80 group-hover/title:opacity-100 transition-opacity" />
          </h3>
          <p className="text-[11px] font-bold text-blue-500">{students} Students</p>
       </div>

       {/* Mascot Avatar */}
       <div className="h-24 flex-center py-0.5">
          <img src={kidsImg} className="h-full object-contain mix-blend-multiply" alt="Kids" />
       </div>

       {/* Wrap-friendly Subject Icons */}
       <div className="flex flex-wrap items-center justify-center gap-1.5 max-h-16 overflow-y-auto px-1 py-0.5 custom-scrollbar">
          {subjects.map((sub, i) => (
             <div key={i} className="flex flex-col items-center gap-0.5 group/sub" title={sub.name}>
                <div className="w-7 h-7 bg-white/90 rounded-lg flex-center shadow-sm border border-white/60 p-1 group-hover/sub:scale-105 transition-transform">
                   <img src={sub.icon} className="w-4 h-4 object-contain mix-blend-multiply" alt={sub.name} />
                </div>
                <span className="text-[8.5px] font-extrabold text-[#166534] max-w-[46px] truncate text-center leading-none">
                   {sub.name}
                </span>
             </div>
          ))}
       </div>

       {/* View Class & Delete Action Bar */}
       <div className="flex items-center justify-center gap-2 pt-1">
          <button 
            onClick={onView}
            className="px-6 py-2 bg-[#EA580C] hover:bg-[#D97706] text-white rounded-xl font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer"
          >
             View Class
          </button>
          <button 
             onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
             className="w-8 h-8 bg-white rounded-xl flex-center text-rose-300 shadow-sm hover:text-rose-600 hover:bg-rose-50 transition-all z-10 shrink-0 cursor-pointer"
             title="Delete Class"
          >
             <Trash2 className="w-3.5 h-3.5" />
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













