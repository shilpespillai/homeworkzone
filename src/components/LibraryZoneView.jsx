import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Volume2, 
  Play, 
  Pause, 
  RotateCcw, 
  Trophy, 
  Star, 
  Sparkles, 
  Brain, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight,
  HelpCircle,
  Award,
  CheckCircle,
  XCircle,
  Wand2,
  Plus,
  Trash2,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs, onSnapshot } from 'firebase/firestore';
import { fetchWithRetry, generateContent } from '../utils/aiClient';
import { getLanguageObj } from '../utils/languages';


import { STORIES, STORIES_EASY, STORIES_HARD, MATH_PUZZLES, MATH_PUZZLES_EASY, MATH_PUZZLES_HARD } from '../data/libraryStories';



export default function LibraryZoneView({ studentName, totalPoints, teacher, classroom, currentStudentProfile }) {
  const [activeTab, setActiveTab] = useState('Read Books');
  const [genreFilter, setGenreFilter] = useState('All Stories');

  // --- Story State ---
  const [selectedStory, setSelectedStory] = useState(null);
  const [storyPage, setStoryPage] = useState(0);
  const [highlightedVocabWord, setHighlightedVocabWord] = useState(null);
  const [readerViewMode, setReaderViewMode] = useState('grid'); // 'grid' | 'single'
  const [imageLoading, setImageLoading] = useState(false);
  const [imageSrcError, setImageSrcError] = useState(false);

  useEffect(() => {
    setHighlightedVocabWord(null);
  }, [storyPage, selectedStory]);

  // --- Read Along (TTS) State ---
  const [isReading, setIsReading] = useState(false);
  const [readSpeed, setReadSpeed] = useState(1); // 1 = normal, 0.8 = slow
  const synthRef = useRef(null);
  const utteranceRef = useRef(null);

  // --- Quiz State ---
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [earnedStars, setEarnedStars] = useState(0);

  // --- AI Story Generator State ---
  const [storyTopic, setStoryTopic] = useState('');
  const [storyGenre, setStoryGenre] = useState('Adventure');
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [aiError, setAiError] = useState('');

  // --- AI Puzzle Generator State ---
  const [puzzleTopic, setPuzzleTopic] = useState('');
  const [isGeneratingPuzzles, setIsGeneratingPuzzles] = useState(false);

  // Resolve grade level from classroom name (e.g. "Grade 2" -> 2)
  const getGradeLevel = () => {
    if (!classroom?.name) return 3; // Default to Grade 3 if undefined
    const match = classroom.name.match(/\d+/);
    if (match) return parseInt(match[0], 10);
    return 3;
  };
  const studentGrade = getGradeLevel();

  const FEATURED_IDS = ['two_friends_one_heart', 'lion_and_the_mouse', 'tortoise_and_the_hare', 'dog_and_his_reflection', 'hare_and_the_hound', 'fox_and_the_grapes', 'honest_woodcutter', 'monkey_and_the_crocodile', 'clever_rabbit_and_the_lion', 'three_little_pigs', 'little_red_riding_hood', 'goldilocks_and_the_three_bears', 'jack_and_the_beanstalk', 'the_ugly_duckling', 'the_princess_and_the_pea', 'hansel_and_gretel', 'the_gingerbread_man', 'the_elves_and_the_shoemaker', 'the_emperors_new_clothes', 'the_bremen_town_musicians', 'the_little_red_hen', 'stone_soup', 'the_lion_and_the_bull', 'the_monkey_and_the_wedge', 'jackal_and_the_drum', 'merchant_and_the_sweeper', 'the_crow_and_the_snake', 'boy_who_cried_wolf', 'crow_and_the_pitcher', 'ant_and_the_grasshopper', 'sonic_and_shadow'];

  const getBaseStories = () => {
    let list = STORIES;
    if (studentGrade <= 2) list = STORIES_EASY;
    else if (studentGrade >= 6) list = STORIES_HARD;

    // Always include all featured pristine stories for ALL grades
    const featuredStories = STORIES.filter(s => FEATURED_IDS.includes(s.id));
    const nonFeaturedList = list.filter(s => !FEATURED_IDS.includes(s.id));
    return [...featuredStories, ...nonFeaturedList];
  };

  const getBasePuzzles = () => {
    if (studentGrade <= 2) return MATH_PUZZLES_EASY;
    if (studentGrade >= 6) return MATH_PUZZLES_HARD;
    return MATH_PUZZLES; // Grade 3-5 (standard puzzles)
  };

  const [teacherAssignedBooks, setTeacherAssignedBooks] = useState([]);

  useEffect(() => {
    try {
      const booksCol = collection(db, 'custom_library_books');
      const unsubscribe = onSnapshot(booksCol, (snap) => {
        const list = snap.docs.map(d => ({
          id: d.id,
          ...d.data(),
          isCustom: true,
          badge: d.data().badge || '🌟 Teacher Assigned'
        })).filter(b => b.isPublished !== false);

        const filtered = list.filter(b => {
          if (b.isPublished === false) return false;

          // 1. If teacher who created it is viewing, show all books created by this teacher
          if (teacher?.uid && b.teacherId === teacher.uid) return true;

          // 2. Otherwise apply classroom / student target filtering
          if (b.assignedClassrooms && b.assignedClassrooms.length > 0) {
            if (classroom?.id && !b.assignedClassrooms.includes(classroom.id)) return false;
          }
          if (b.assignedStudents && b.assignedStudents.length > 0) {
            if (studentName && !b.assignedStudents.includes(studentName)) return false;
          }
          return true;
        });
        setTeacherAssignedBooks(filtered);
      }, (err) => {
        console.warn("Custom library books snapshot error:", err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Custom library books listener failed:", e);
    }
  }, [classroom, studentName, teacher]);

  const [deletedStoryIds, setDeletedStoryIds] = useState(() => {
    try {
      const saved = localStorage.getItem('hz_deleted_story_ids');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [customStories, setCustomStories] = useState(() => {
    try {
      const saved = localStorage.getItem('hz_custom_library_books');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [customPuzzles, setCustomPuzzles] = useState(() => {
    try {
      const saved = localStorage.getItem('hz_custom_puzzles');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const handleDeleteStory = async (storyId) => {
    if (window.confirmCustom) {
      if (!(await window.confirmCustom("Are you sure you want to delete this story? This will permanently remove it from the Library. 🗑️"))) {
        return;
      }
    } else if (!window.confirm("Are you sure you want to delete this story? This will permanently remove it from the Library.")) {
      return;
    }
    setDeletedStoryIds(prev => {
      const updated = [...prev, String(storyId)];
      localStorage.setItem('hz_deleted_story_ids', JSON.stringify(updated));
      return updated;
    });
    setCustomStories(prev => {
      const updated = prev.filter(s => String(s.id) !== String(storyId));
      localStorage.setItem('hz_custom_library_books', JSON.stringify(updated));
      return updated;
    });
    setTeacherAssignedBooks(prev => prev.filter(s => String(s.id) !== String(storyId)));
    try {
      const { deleteDoc, doc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'custom_library_books', String(storyId)));
    } catch (err) {}
  };

  const getStoryTimestamp = (s) => {
    if (String(s.id) === 'two_friends_one_heart') return 999999999999999;
    if (String(s.id) === 'lion_and_the_mouse') return 999999999999998;
    if (String(s.id) === 'tortoise_and_the_hare') return 999999999999997;
    if (String(s.id) === 'dog_and_his_reflection') return 999999999999996;
    if (String(s.id) === 'hare_and_the_hound') return 999999999999995;
    if (String(s.id) === 'fox_and_the_grapes') return 999999999999994;
    if (String(s.id) === 'honest_woodcutter') return 999999999999993;
    if (String(s.id) === 'monkey_and_the_crocodile') return 999999999999992;
    if (String(s.id) === 'clever_rabbit_and_the_lion') return 999999999999991;
    if (String(s.id) === 'three_little_pigs') return 999999999999990;
    if (String(s.id) === 'little_red_riding_hood') return 999999999999989;
    if (String(s.id) === 'goldilocks_and_the_three_bears') return 999999999999988;
    if (String(s.id) === 'jack_and_the_beanstalk') return 999999999999987;
    if (String(s.id) === 'the_ugly_duckling') return 999999999999986;
    if (String(s.id) === 'the_princess_and_the_pea') return 999999999999985;
    if (String(s.id) === 'hansel_and_gretel') return 999999999999984;
    if (String(s.id) === 'the_gingerbread_man') return 999999999999983;
    if (String(s.id) === 'the_elves_and_the_shoemaker') return 999999999999982;
    if (String(s.id) === 'the_emperors_new_clothes') return 999999999999981;
    if (String(s.id) === 'the_bremen_town_musicians') return 999999999999980;
    if (String(s.id) === 'the_little_red_hen') return 999999999999979;
    if (String(s.id) === 'stone_soup') return 999999999999978;
    if (String(s.id) === 'the_lion_and_the_bull') return 999999999999977;
    if (String(s.id) === 'the_monkey_and_the_wedge') return 999999999999976;
    if (String(s.id) === 'jackal_and_the_drum') return 999999999999975;
    if (String(s.id) === 'merchant_and_the_sweeper') return 999999999999974;
    if (String(s.id) === 'the_crow_and_the_snake') return 999999999999973;
    if (String(s.id) === 'boy_who_cried_wolf') return 999999999999972;
    if (String(s.id) === 'crow_and_the_pitcher') return 999999999999971;
    if (String(s.id) === 'ant_and_the_grasshopper') return 999999999999970;
    if (String(s.id) === 'sonic_and_shadow') return 999999999999969;
    if (s.isFeatured) return 999999999999990;
    if (s.createdAt) {
      if (typeof s.createdAt === 'number') return s.createdAt;
      if (typeof s.createdAt.toMillis === 'function') return s.createdAt.toMillis();
      if (s.createdAt.seconds) return s.createdAt.seconds * 1000;
      const parsed = Date.parse(s.createdAt);
      if (!isNaN(parsed)) return parsed;
    }
    if (s.timestamp) {
      if (typeof s.timestamp === 'number') return s.timestamp;
      const parsed = Date.parse(s.timestamp);
      if (!isNaN(parsed)) return parsed;
    }
    if (typeof s.id === 'string') {
      const match = s.id.match(/\d{10,13}/);
      if (match) return parseInt(match[0], 10);
    }
    if (typeof s.id === 'number') return 10000 - s.id;
    return 0;
  };

  const rawStories = [...getBaseStories(), ...customStories, ...teacherAssignedBooks];
  const uniqueStoriesMap = new Map();
  rawStories.forEach(s => {
    if (s && s.id && !uniqueStoriesMap.has(String(s.id))) {
      uniqueStoriesMap.set(String(s.id), s);
    }
  });

  const allStories = Array.from(uniqueStoriesMap.values())
    .filter(story => story.isFeatured || String(story.id) === 'two_friends_one_heart' || !deletedStoryIds.includes(String(story.id)))
    .sort((a, b) => getStoryTimestamp(b) - getStoryTimestamp(a));
  const allPuzzles = [...getBasePuzzles(), ...customPuzzles];

  useEffect(() => {
    setImageLoading(true);
    setImageSrcError(false);
  }, [selectedStory, storyPage]);

  // Load custom stories & puzzles from LocalStorage
  useEffect(() => {
    try {
      const key = studentName ? `hwz_custom_stories_${studentName}` : 'hwz_custom_stories';
      const savedStories = localStorage.getItem(key) || localStorage.getItem('hwz_custom_stories');
      if (savedStories) {
        setCustomStories(JSON.parse(savedStories));
      }
      const pKey = studentName ? `hwz_custom_puzzles_${studentName}` : 'hwz_custom_puzzles';
      const savedPuzzles = localStorage.getItem(pKey) || localStorage.getItem('hwz_custom_puzzles');
      if (savedPuzzles) {
        setCustomPuzzles(JSON.parse(savedPuzzles));
      }
    } catch (e) {
      console.error("Error loading local storage custom assets:", e);
    }
  }, [studentName]);

  // Initialize Speech Synth
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Helpers
  const getPageText = (story, pageIdx) => {
    const page = story.pages?.[pageIdx];
    if (!page) return '';
    return typeof page === 'string' ? page : page.text;
  };

  const getPageImage = (story, pageIdx) => {
    const page = story.pages?.[pageIdx];
    if (!page) return story.coverImageUrl || story.image || '';
    if (typeof page === 'string') return story.coverImageUrl || story.image || '';
    if (page.imageUrl) return page.imageUrl;
    if (page.image) return page.image;
    const promptText = page.imagePrompt || page.image_prompt || page.text || story.title;
    return story.coverImageUrl || story.image || '/library.jpg';
  };

  const getStoryCover = (story) => {
    if (story.coverImageUrl) return story.coverImageUrl;
    if (story.image) {
      // Cache-bust featured stories so the browser fetches the corrected image files
      return story.isFeatured ? `${story.image}?v=2` : story.image;
    }
    return '/library.jpg';
  };

  const getTeacherActiveModel = async () => {
    if (!teacher?.uid) return 'gemini';
    try {
      const teacherDoc = await getDoc(doc(db, 'teachers', teacher.uid));
      if (teacherDoc.exists()) {
        const data = teacherDoc.data();
        return data.activeAi || 'gemini';
      }
    } catch (e) {
      console.warn("Failed to read teacher active AI:", e);
    }
    return 'gemini';
  };

  const handleGenerateStory = async () => {
    if (!storyTopic.trim()) {
      setAiError("Please type a story topic! 📝");
      return;
    }
    setAiError('');
    setIsGeneratingStory(true);
    try {
      const activeModel = await getTeacherActiveModel();

      let gradeGuidelines = "";
      if (studentGrade <= 2) {
        gradeGuidelines = "Write a simple children's story suitable for Grade " + studentGrade + ". Keep the language very simple and use short sentences. Each page must contain exactly 1-2 sentences of story text.";
      } else if (studentGrade >= 6) {
        gradeGuidelines = "Write a children's story suitable for Grade " + studentGrade + ". Use slightly more engaging, rich, and descriptive vocabulary. Each page should contain 3-4 sentences of story text.";
      } else {
        gradeGuidelines = "Write a children's story suitable for Grade " + studentGrade + ". Keep it kid-friendly. Each page should contain 2-3 sentences of story text.";
      }

      const promptText = `Write a 3-page children's story about: "${storyTopic}" in the "${storyGenre}" genre.
${gradeGuidelines}
Also, suggest a cartoon illustration prompt for each page that is descriptive and scene-specific.
Return ONLY a valid JSON object matching this schema. Do not include markdown formatting or backticks.

Schema:
{
  "title": "Story Title",
  "genre": "Genre Name",
  "emoji": "Choose a single matching emoji",
  "pages": [
    {
      "text": "Page 1 story text...",
      "imagePrompt": "Detailed cartoon illustration prompt for page 1"
    },
    {
      "text": "Page 2 story text...",
      "imagePrompt": "Detailed cartoon illustration prompt for page 2"
    },
    {
      "text": "Page 3 story text...",
      "imagePrompt": "Detailed cartoon illustration prompt for page 3"
    }
  ]
}`;

      const textResponse = await generateContent({
        prompt: promptText,
        responseMimeType: 'application/json',
        provider: activeModel
      });

      const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      const newStory = {
        id: `custom_${Date.now()}`,
        title: parsed.title || storyTopic,
        genre: parsed.genre || storyGenre,
        emoji: parsed.emoji || "📖",
        pages: parsed.pages || []
      };

      const updated = [...customStories, newStory];
      setCustomStories(updated);
      localStorage.setItem(`hwz_custom_stories_${studentName}`, JSON.stringify(updated));

      // Reset states
      setStoryTopic('');
      setShowAiWriter(false);
      
      // Auto open and play confetti
      setSelectedStory(newStory);
      setStoryPage(0);
      confetti({ particleCount: 80, spread: 60 });
    } catch (err) {
      console.error("AI Story Generation failed:", err);
      setAiError("Oops, something went wrong with the AI story creation. Please try again! ☄️");
    } finally {
      setIsGeneratingStory(false);
    }
  };

  const handleGeneratePuzzles = async () => {
    setAiError('');
    setIsGeneratingPuzzles(true);
    try {
      const activeModel = await getTeacherActiveModel();

      let puzzleGuidelines = "";
      if (studentGrade <= 2) {
        puzzleGuidelines = `The puzzles must be simple and suitable for Grade ${studentGrade}.
- For addition/subtraction: keep numbers within 20.
- For patterns: simple skip counting (e.g. by 2s or 5s) or counting forward/backward.
- Keep the math operations very basic (no complex multiplication or division).`;
      } else if (studentGrade >= 6) {
        puzzleGuidelines = `The puzzles must match Grade ${studentGrade} difficulty (more challenging).
- Include topics like basic algebraic equations (e.g., solve for x, 2x + 3 = 11), percentages, ratios, or perimeter/area word problems.
- All answers must still resolve to single numeric integers.`;
      } else {
        puzzleGuidelines = `The puzzles must be suitable for Grade ${studentGrade} (medium difficulty).
- Can include simple multiplication, sharing/division, multi-step addition/subtraction, or shape features (number of sides).
- All answers must resolve to single numeric integers.`;
      }

      const promptText = `Create 5 fun, kid-friendly math puzzles about "${puzzleTopic}".
${puzzleGuidelines}

CRITICAL ACCURACY & QUALITY RULES:
1. Double-check all calculations. Every math equation, operation, word problem, and numeric answer must be 100% mathematically correct. There must be zero arithmetic errors.
2. The "answer" field must be a valid numeric integer matching the correct mathematical answer to the question.
3. Ensure questions are clear, well-phrased, and suitable for elementary/middle school students.

Each puzzle must have a clear question with emojis, a numeric integer answer, a helpful hint, and a type.
Return ONLY a valid JSON array of objects matching the schema below. Do not include markdown code block backticks.

Schema:
[
  {
    "question": "Question text with a matching emoji...",
    "answer": 12,
    "hint": "Helpful hint for kids...",
    "type": "addition" // or subtraction, pattern, geometry, multiplication, algebra, etc.
  }
]`;

      const textResponse = await generateContent({
        prompt: promptText,
        responseMimeType: 'application/json',
        provider: activeModel
      });

      const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      const oldLength = allPuzzles.length;
      const newPuzzles = parsed.map((p, idx) => ({
        id: `custom_${Date.now()}_${idx}`,
        ...p
      }));

      const updated = [...customPuzzles, ...newPuzzles];
      setCustomPuzzles(updated);
      localStorage.setItem(`hwz_custom_puzzles_${studentName}`, JSON.stringify(updated));

      // Jump to first new custom puzzle
      setCurrentQuizIndex(oldLength);
      setIsQuizCompleted(false);
      
      confetti({ particleCount: 100, spread: 70 });
    } catch (err) {
      console.error("AI Puzzle Generation failed:", err);
      alert("Oops, something went wrong with the AI puzzle creation. Please try again! ☄️");
    } finally {
      setIsGeneratingPuzzles(false);
    }
  };

  const handleDeleteCustomStory = (storyId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this custom story? 🗑️")) return;
    const updated = customStories.filter(s => s.id !== storyId);
    setCustomStories(updated);
    localStorage.setItem(`hwz_custom_stories_${studentName}`, JSON.stringify(updated));
  };

  // Handle TTS Play/Pause
  const startSpeech = (text, storyLangCode) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const langCode = storyLangCode || selectedStory?.targetLanguage || 'en';
    const langObj = getLanguageObj(langCode);
    if (langObj && langObj.ttsLang) {
      utterance.lang = langObj.ttsLang;
    }
    utterance.rate = readSpeed;
    utterance.pitch = 1.1; // Kid friendly slightly higher pitch

    utterance.onend = () => {
      setIsReading(false);
    };
    utterance.onerror = () => {
      setIsReading(false);
    };

    utteranceRef.current = utterance;
    setIsReading(true);
    synthRef.current.speak(utterance);
  };

  const pauseSpeech = () => {
    if (!synthRef.current) return;
    if (isReading) {
      synthRef.current.pause();
      setIsReading(false);
    } else {
      synthRef.current.resume();
      setIsReading(true);
    }
  };

  const stopSpeech = () => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    setIsReading(false);
  };

  // Switch Story Pages
  const handleNextPage = () => {
    if (selectedStory && storyPage < selectedStory.pages.length - 1) {
      setStoryPage(storyPage + 1);
      stopSpeech();
    }
  };

  const handlePrevPage = () => {
    if (storyPage > 0) {
      setStoryPage(storyPage - 1);
      stopSpeech();
    }
  };

  // --- Math Quiz Actions ---
  const handleNumberClick = (num) => {
    if (quizFeedback) return;
    setUserAnswer(prev => prev + num);
  };

  const handleBackspace = () => {
    if (quizFeedback) return;
    setUserAnswer(prev => prev.slice(0, -1));
  };

  const handleClearAnswer = () => {
    if (quizFeedback) return;
    setUserAnswer('');
  };

  const handleQuizSubmit = (e) => {
    if (e) e.preventDefault();
    if (!userAnswer || quizFeedback) return;

    const currentPuzzle = allPuzzles[currentQuizIndex];
    const parsedAns = parseInt(userAnswer, 10);

    if (parsedAns === currentPuzzle.answer) {
      setQuizFeedback('correct');
      setQuizScore(prev => prev + 10);
      setEarnedStars(prev => prev + 1);
      
      // Fire confetti for correct answers
      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.8 }
      });

      setTimeout(() => {
        advanceQuiz();
      }, 1500);
    } else {
      setQuizFeedback('wrong');
      setTimeout(() => {
        setQuizFeedback(null);
        setUserAnswer('');
      }, 1500);
    }
  };

  const advanceQuiz = () => {
    setQuizFeedback(null);
    setUserAnswer('');
    setShowHint(false);

    if (currentQuizIndex < allPuzzles.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      setIsQuizCompleted(true);
      // Double confetti for complete finish!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setUserAnswer('');
    setShowHint(false);
    setQuizScore(0);
    setIsQuizCompleted(false);
    setQuizFeedback(null);
    setEarnedStars(0);
  };

  // Helper to render unclustered, beautifully spaced paragraphs with interactive Vocab highlighting
  const renderStoryTextWithHighlights = (rawText, isComicMode = false) => {
    if (!rawText) return null;

    // For comic mode, keep text concise (max 2 short sentences for clean panel layout)
    let processedText = rawText;
    if (isComicMode && rawText.length > 180) {
      const sentences = rawText.match(/[^.!?]+[.!?]+/g) || [rawText];
      processedText = sentences.slice(0, 2).join(' ');
    }

    const paragraphs = processedText.split(/\n+/).filter(Boolean);

    if (isComicMode) {
      return (
        <div className="space-y-2 text-slate-800 text-xs md:text-sm leading-relaxed font-semibold text-left">
          {paragraphs.map((paragraph, pIdx) => {
            if (!highlightedVocabWord) {
              return (
                <p key={pIdx} className="bg-slate-50 border border-slate-200/90 p-3 rounded-2xl text-slate-800 font-semibold shadow-2xs">
                  "{paragraph}"
                </p>
              );
            }

            const escapedWord = highlightedVocabWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${escapedWord})`, 'gi');
            const parts = paragraph.split(regex);

            return (
              <p key={pIdx} className="bg-amber-50 border border-amber-300 p-3 rounded-2xl text-slate-900 shadow-2xs transition-all font-semibold">
                "{parts.map((part, idx) => {
                  if (part.toLowerCase() === highlightedVocabWord.toLowerCase()) {
                    return (
                      <mark
                        key={idx}
                        className="bg-amber-300 text-amber-950 font-black px-1.5 py-0.5 rounded-md shadow-2xs border border-amber-400 animate-pulse inline-block"
                      >
                        {part}
                      </mark>
                    );
                  }
                  return part;
                })}"
              </p>
            );
          })}
        </div>
      );
    }

    // Default Single Page mode text styling
    return (
      <div className="space-y-4 text-slate-800 text-base md:text-lg leading-relaxed font-medium text-left">
        {paragraphs.map((paragraph, pIdx) => {
          if (!highlightedVocabWord) {
            return (
              <p key={pIdx} className="bg-indigo-50/40 p-4 md:p-5 rounded-2xl border-l-4 border-indigo-400 shadow-2xs">
                "{paragraph}"
              </p>
            );
          }

          const escapedWord = highlightedVocabWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`(${escapedWord})`, 'gi');
          const parts = paragraph.split(regex);

          return (
            <p key={pIdx} className="bg-amber-50/60 p-4 md:p-5 rounded-2xl border-l-4 border-amber-400 shadow-2xs transition-all">
              "{parts.map((part, idx) => {
                if (part.toLowerCase() === highlightedVocabWord.toLowerCase()) {
                  return (
                    <mark
                      key={idx}
                      className="bg-amber-300 text-amber-950 font-black px-2 py-0.5 rounded-lg shadow-2xs border border-amber-400 animate-pulse inline-block"
                    >
                      {part}
                    </mark>
                  );
                }
                return part;
              })}"
            </p>
          );
        })}
      </div>
    );
  };

  if (studentGrade > 8) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6 animate-in fade-in duration-300 bg-[#FCFBF7] min-h-[70vh]">
        <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center text-4xl shadow-md border-2 border-amber-200">
          🎓
        </div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Library Zone (Grades 1–8)</h2>
        <p className="text-slate-600 font-bold text-base max-w-lg leading-relaxed">
          Library Zone picture books and math puzzles are designed for Primary & Middle School (Grades 1–8).
        </p>
        <p className="text-xs text-slate-500 font-semibold bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-xs">
          As a High School student ({classroom?.name || 'Grade 9+'}), your curriculum focuses on advanced STEM, Physics, Chemistry, and Exam preparation modules in your main dashboard. 🚀
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#FCFBF7] font-sans">
      {/* Header Banner */}
      <header className="px-8 py-6 bg-gradient-to-r from-blue-100 via-orange-50 to-amber-50 border-b border-blue-100 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <span>📚</span> Library Zone
          </h2>
          <p className="text-xs font-bold text-slate-500 mt-1">Step into a world of stories, math puzzles, and achievements!</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-blue-200/50 shadow-sm">
          <Star className="w-5 h-5 text-amber-500 fill-amber-400 animate-pulse" />
          <span className="text-sm font-black text-slate-700">{totalPoints + (earnedStars * 10)} XP</span>
        </div>
      </header>

      {/* Tabs Menu */}
      <div className="px-8 py-4 bg-white border-b border-slate-100 flex gap-3 shrink-0 overflow-x-auto no-scrollbar">
        {[
          { label: 'Read Books', icon: '📖' },
          { label: 'Read Along', icon: '🎧' },
          { label: 'Quizzes', icon: '🏆' },
          { label: 'Earn Rewards', icon: '⭐' }
        ].map(tab => (
          <button
            key={tab.label}
            onClick={() => {
              setActiveTab(tab.label);
              setSelectedStory(null);
              setStoryPage(0);
              stopSpeech();
            }}
            className={`px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2 border transition-all cursor-pointer ${
              activeTab === tab.label 
                ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20 scale-102' 
                : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main View Container */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        
        {/* ==================== 1. READ BOOKS ==================== */}
        {activeTab === 'Read Books' && (
          <div className={selectedStory ? "w-full space-y-6" : "max-w-6xl mx-auto space-y-6"}>
            {!selectedStory ? (
              <div className="space-y-6">
                {/* Hero Banner */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
                  <div className="flex-1 space-y-2">
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">📚 Story Corner</span>
                    <h3 className="text-xl font-black text-slate-800">Pick a Magical Adventure!</h3>
                    <p className="text-xs font-semibold text-slate-500">Every story comes with illustrated comic pages, vocabulary flashcards & a comprehension quiz!</p>
                  </div>
                  <img src="/assets/library_bookshelf.png" className="w-32 h-32 object-contain mix-blend-multiply" alt="Bookshelf" />
                </div>

                {/* Genre Filter Tabs */}
                {(() => {
                  const GENRE_COLLECTIONS = [
                    { label: 'All Stories', emoji: '✨', ids: null },
                    { label: 'Panchatantra', emoji: '🐘', ids: ['monkey_and_the_crocodile', 'clever_rabbit_and_the_lion', 'honest_woodcutter', 'the_lion_and_the_bull', 'the_monkey_and_the_wedge', 'jackal_and_the_drum', 'merchant_and_the_sweeper', 'the_crow_and_the_snake'] },
                    { label: "Aesop's Fables", emoji: '🐾', ids: ['lion_and_the_mouse', 'tortoise_and_the_hare', 'dog_and_his_reflection', 'hare_and_the_hound', 'fox_and_the_grapes', 'boy_who_cried_wolf', 'crow_and_the_pitcher', 'ant_and_the_grasshopper'] },
                    { label: 'Fairy Tales', emoji: '🧚', ids: ['the_ugly_duckling', 'the_princess_and_the_pea', 'hansel_and_gretel', 'the_gingerbread_man', 'the_elves_and_the_shoemaker', 'the_emperors_new_clothes', 'the_bremen_town_musicians', 'jack_and_the_beanstalk', 'goldilocks_and_the_three_bears', 'little_red_riding_hood', 'three_little_pigs'] },
                    { label: 'Featured', emoji: '🌟', ids: ['two_friends_one_heart', 'stone_soup', 'the_little_red_hen', 'sonic_and_shadow'] },
                    { label: 'AI & Custom', emoji: '🤖', ids: null, custom: true },
                  ];

                  const getFilteredStories = (collection) => {
                    if (collection.custom) return allStories.filter(s => s.isCustom || s.badge);
                    if (!collection.ids) return allStories;
                    return allStories.filter(s => collection.ids.includes(String(s.id)));
                  };

                  const activeCollection = GENRE_COLLECTIONS.find(c => c.label === genreFilter) || GENRE_COLLECTIONS[0];
                  const filteredStories = getFilteredStories(activeCollection);

                  // For "All Stories" tab, group by collection
                  const groupedForAll = genreFilter === 'All Stories'
                    ? GENRE_COLLECTIONS.filter(c => c.label !== 'All Stories').map(c => ({
                        ...c,
                        stories: getFilteredStories(c).filter(s => s)
                      })).filter(g => g.stories.length > 0)
                    : null;

                  const StoryCard = ({ story }) => (
                    <div
                      key={story.id}
                      onClick={() => { setSelectedStory(story); setStoryPage(0); }}
                      className="bg-white border-2 border-indigo-100 rounded-[32px] overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer flex flex-col group relative"
                    >
                      {story.badge && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md z-10 flex items-center gap-1 border border-indigo-300 animate-pulse">
                          {story.badge}
                        </div>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteStory(story.id, e); }}
                        className="absolute top-3 left-3 bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-500 p-2 rounded-xl border border-slate-200 z-20 transition-all shadow-md hover:scale-110 cursor-pointer"
                        title="Delete Story from Library"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="h-44 bg-gradient-to-b from-green-50 to-orange-50 flex items-center justify-center relative overflow-hidden">
                        <img
                          src={getStoryCover(story)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                          onError={(e) => { e.target.style.display = 'none'; }}
                          alt={story.title}
                        />
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">{story.genre}</span>
                          <h4 className="text-base font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{story.title}</h4>
                        </div>
                        <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-black py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors border border-blue-100/50">
                          Open Book 📖
                        </button>
                      </div>
                    </div>
                  );

                  return (
                    <div className="space-y-6">
                      {/* Genre Filter Pills */}
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {GENRE_COLLECTIONS.map(col => (
                          <button
                            key={col.label}
                            onClick={() => setGenreFilter(col.label)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-black text-xs whitespace-nowrap transition-all border-2 cursor-pointer ${
                              genreFilter === col.label
                                ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg shadow-indigo-200 scale-105'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                            }`}
                          >
                            <span>{col.emoji}</span>
                            <span>{col.label}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${genreFilter === col.label ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                              {getFilteredStories(col).length}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Story Grid — Grouped shelves for All Stories, flat grid for filtered tabs */}
                      {groupedForAll ? (
                        <div className="space-y-10">
                          {groupedForAll.map(group => (
                            <div key={group.label} className="space-y-4">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{group.emoji}</span>
                                <h3 className="text-lg font-black text-slate-800">{group.label}</h3>
                                <span className="text-xs font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{group.stories.length} stories</span>
                                <div className="flex-1 h-px bg-slate-100 ml-2" />
                                <button
                                  onClick={() => setGenreFilter(group.label)}
                                  className="text-xs font-black text-indigo-500 hover:text-indigo-700 cursor-pointer whitespace-nowrap"
                                >
                                  See all →
                                </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {group.stories.slice(0, 3).map(story => (
                                  <StoryCard key={story.id} story={story} />
                                ))}
                              </div>
                              {group.stories.length > 3 && (
                                <button
                                  onClick={() => setGenreFilter(group.label)}
                                  className="text-xs font-black text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-full transition-all cursor-pointer border border-indigo-100"
                                >
                                  +{group.stories.length - 3} more {group.label} stories →
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        filteredStories.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredStories.map(story => (
                              <StoryCard key={story.id} story={story} />
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                            <span className="text-5xl">📚</span>
                            <p className="text-sm font-black text-slate-400">No stories in this collection yet.</p>
                            <p className="text-xs text-slate-400">New stories are added regularly — check back soon!</p>
                          </div>
                        )
                      )}
                    </div>
                  );
                })()}
              </div>
            ) : selectedStory.isFlipbook ? (() => {
              const currentPage = selectedStory.pages[storyPage] || selectedStory.pages[0];
              const totalPages = selectedStory.pages.length;
              return (
                <div className="w-full animate-in fade-in duration-300">
                  {/* Flipbook Header */}
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <button
                      onClick={() => { setSelectedStory(null); setStoryPage(0); }}
                      className="text-xs font-black text-amber-950 bg-amber-400 hover:bg-amber-300 px-4 py-2 rounded-full flex items-center gap-1 border border-amber-300 transition-all shadow-md cursor-pointer active:scale-95"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back to All Books 📚
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-white drop-shadow">{selectedStory.emoji}</span>
                      <h3 className="text-base md:text-lg font-black text-white drop-shadow">{selectedStory.title}</h3>
                      <span className="text-xs font-black text-blue-300 bg-blue-950/60 px-3 py-1 rounded-full border border-blue-700/50">
                        Page {storyPage + 1} / {totalPages}
                      </span>
                    </div>
                  </div>

                  {/* Book Page */}
                  <div className="relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-3xl overflow-hidden shadow-2xl border-2 border-blue-500/30">
                    {/* Page Image */}
                    <div className="relative w-full bg-[#0a0a1a]">
                      <img
                        key={currentPage.imageUrl + storyPage}
                        src={`${currentPage.imageUrl}?v=1`}
                        alt={currentPage.title || `Page ${storyPage + 1}`}
                        className="w-full block"
                        style={{
                          animation: 'fadeIn 0.4s ease-in-out',
                          ...(currentPage.cropStyle
                            ? {
                                height: currentPage.cropStyle.height || '420px',
                                objectFit: 'cover',
                                objectPosition: currentPage.cropStyle.objectPosition || 'center'
                              }
                            : { height: 'auto' })
                        }}
                      />
                      {/* Page number badge */}
                      <div className="absolute top-3 left-3 bg-black/70 text-white text-xs font-black px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm">
                        📖 Page {storyPage + 1}
                      </div>
                    </div>

                    {/* Page Text Content */}
                    <div className="p-5 md:p-7 space-y-3">
                      {currentPage.title && (
                        <h4 className="text-lg md:text-xl font-black text-amber-300 drop-shadow">{currentPage.title}</h4>
                      )}
                      <p className="text-sm md:text-base text-slate-200 leading-relaxed font-medium">
                        {currentPage.text}
                      </p>
                    </div>

                    {/* Navigation arrows on sides */}
                    {storyPage > 0 && (
                      <button
                        onClick={() => setStoryPage(p => p - 1)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full border border-white/20 backdrop-blur-sm transition-all hover:scale-110 active:scale-95 shadow-xl cursor-pointer z-10"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    )}
                    {storyPage < totalPages - 1 && (
                      <button
                        onClick={() => setStoryPage(p => p + 1)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full border border-white/20 backdrop-blur-sm transition-all hover:scale-110 active:scale-95 shadow-xl cursor-pointer z-10"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Page Dot Navigation */}
                  <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
                    {selectedStory.pages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setStoryPage(i)}
                        className={`transition-all duration-200 rounded-full cursor-pointer ${
                          i === storyPage
                            ? 'w-6 h-3 bg-amber-400 shadow-lg shadow-amber-400/50'
                            : 'w-3 h-3 bg-slate-600 hover:bg-slate-400'
                        }`}
                        title={`Page ${i + 1}`}
                      />
                    ))}
                  </div>

                  {/* Bottom Nav Buttons */}
                  <div className="flex items-center justify-between mt-4 gap-3">
                    <button
                      onClick={() => setStoryPage(p => Math.max(0, p - 1))}
                      disabled={storyPage === 0}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm transition-all border cursor-pointer ${
                        storyPage === 0
                          ? 'bg-slate-700/40 text-slate-500 border-slate-700/30 cursor-not-allowed'
                          : 'bg-slate-700 hover:bg-slate-600 text-white border-slate-600 hover:scale-105 active:scale-95'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>

                    {storyPage === totalPages - 1 ? (
                      <div className="flex-1 text-center">
                        <span className="text-amber-400 font-black text-sm">🎉 The End! You finished the story!</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setStoryPage(p => Math.min(totalPages - 1, p + 1))}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-sm bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white border border-blue-400/50 transition-all hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
                      >
                        Next Page <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Moral + Vocab — shown on last page */}
                  {storyPage === totalPages - 1 && (
                    <div className="mt-6 space-y-4 animate-in fade-in duration-500">
                      {selectedStory.moral && (
                        <div className="bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 border-2 border-amber-300 rounded-2xl p-5 text-amber-950 shadow-lg text-center font-black text-sm md:text-base leading-relaxed">
                          🌿 Moral of the Story: {selectedStory.moral}
                        </div>
                      )}
                      {(() => {
                        const vocabs = selectedStory.vocabHighlights || [];
                        if (!vocabs.length) return null;
                        return (
                          <div className="bg-amber-50/95 border-2 border-amber-300 rounded-3xl p-5 space-y-4 shadow-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">📖</span>
                              <div>
                                <h4 className="text-sm font-black text-amber-950 uppercase tracking-wider">Vocabulary & Grammar Explorer</h4>
                                <p className="text-[10px] font-bold text-amber-700">Key words from this story!</p>
                              </div>
                              <span className="ml-auto text-[10px] font-black text-amber-800 bg-amber-200/80 px-3 py-1 rounded-full border border-amber-300">{vocabs.length} Key Words</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {vocabs.map((item, vi) => (
                                <div key={vi} className="bg-white border border-amber-200/80 rounded-2xl p-4 space-y-1.5 shadow-sm">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-black text-slate-900 capitalize">{item.word}</span>
                                    {item.partOfSpeech && <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 border border-indigo-200">{item.partOfSpeech}</span>}
                                    {item.pronunciation && <span className="text-[10px] font-mono text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50">[{item.pronunciation}]</span>}
                                  </div>
                                  <p className="text-[11px] text-slate-600 leading-snug">{item.definition}</p>
                                  {item.fact && <p className="text-[10px] text-amber-700 font-semibold italic border-t border-amber-100 pt-1.5">💡 {item.fact}</p>}
                                  <button
                                    onClick={() => startSpeech(`${item.word}. ${item.definition}`)}
                                    className="flex items-center gap-1 text-[10px] font-black text-blue-600 hover:text-blue-800 transition-colors mt-1 cursor-pointer"
                                  >
                                    🔊 Listen
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              );
            })() : selectedStory.isSingleComicSheet || selectedStory.fullCompositeImage ? (
              <div className="bg-[#111827] p-4 md:p-8 rounded-[36px] shadow-2xl border-4 border-slate-800 space-y-6 w-full animate-in fade-in duration-300">
                {/* Header with Back Button */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedStory(null)}
                      className="text-xs font-black text-amber-950 bg-amber-400 hover:bg-amber-300 px-4 py-2 rounded-full flex items-center gap-1 border border-amber-300 transition-all shadow-md cursor-pointer active:scale-95"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back to All Books 📚
                    </button>
                    <span className="text-xs font-black text-amber-400 uppercase bg-amber-950/80 px-3.5 py-1.5 rounded-full border border-amber-800/60 flex items-center gap-1.5">
                      <span>🖼️</span> Original Story Canvas
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <h3 className="text-lg md:text-xl font-black text-amber-300 drop-shadow-md">{selectedStory.title}</h3>
                    <span className="text-2xl">{selectedStory.emoji}</span>
                    <button
                      onClick={(e) => handleDeleteStory(selectedStory.id, e)}
                      className="ml-3 bg-red-600/80 hover:bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-xl border border-red-500 flex items-center gap-1 transition-all cursor-pointer shadow-md"
                      title="Delete Story from Library"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>

                {/* Display Full Image AS IT IS (Pristine, Full resolution, No subpanel squeezing) */}
                <div className="w-full bg-slate-900 rounded-3xl overflow-hidden border-2 border-amber-400/40 shadow-2xl flex justify-center items-center p-2 md:p-4">
                  <img
                    src={(() => {
                      const raw = selectedStory.image || selectedStory.pages?.[0]?.imageUrl;
                      if (!raw) return raw;
                      // Cache-bust featured story images so browser always fetches corrected assets
                      const cacheBust = selectedStory.isFeatured ? '?v=2' : '';
                      return `${raw}${cacheBust}`;
                    })()}
                    alt={selectedStory.title}
                    className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                  />
                </div>

                {/* Moral Box */}
                {selectedStory.moral && (
                  <div className="bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 border-2 border-amber-300 rounded-2xl p-5 text-amber-950 shadow-lg text-center font-black text-sm md:text-base leading-relaxed">
                    🌿 Moral of the Story: {selectedStory.moral}
                  </div>
                )}

                {/* Vocabulary & Grammar Explorer for Single Comic Sheet */}
                {(() => {
                  const allVocabs = (selectedStory.vocabHighlights || (selectedStory.pages || []).flatMap(p => p.vocabHighlights || [])).filter(Boolean);
                  if (!allVocabs || allVocabs.length === 0) return null;
                  const uniqueVocabs = Array.from(new Map(allVocabs.map(item => [item.word?.toLowerCase(), item])).values());

                  return (
                    <div className="bg-amber-50/95 border-2 border-amber-300 rounded-3xl p-5 md:p-6 space-y-4 text-left shadow-lg animate-in fade-in duration-300">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">📖</span>
                          <div>
                            <h4 className="text-sm font-black text-amber-950 uppercase tracking-wider">
                              Vocabulary & Grammar Explorer
                            </h4>
                            <p className="text-[10px] font-bold text-amber-700">Explore key vocabulary words and definitions from this story!</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-amber-800 bg-amber-200/80 px-3 py-1 rounded-full border border-amber-300">
                          {uniqueVocabs.length} Key Words
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {uniqueVocabs.map((item, vIdx) => (
                          <div
                            key={vIdx}
                            className="bg-white border border-amber-200/80 rounded-2xl p-4 space-y-1.5 shadow-xs"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-black text-slate-900 capitalize">{item.word}</span>
                                {item.partOfSpeech && (
                                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 border border-indigo-200">
                                    {item.partOfSpeech}
                                  </span>
                                )}
                                {item.pronunciation && (
                                  <span className="text-[10px] font-mono text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50">
                                    [{item.pronunciation}]
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => startSpeech(`${item.word}. ${item.definition}`)}
                                className="text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-xl flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                              >
                                <Volume2 className="w-3 h-3 text-slate-600" /> Listen
                              </button>
                            </div>
                            <p className="text-xs text-slate-700 font-semibold leading-relaxed">{item.definition}</p>
                            {item.fact && (
                              <p className="text-[10px] font-bold text-amber-900/90 italic bg-amber-50/90 p-2 rounded-xl border border-amber-200/60 mt-1">
                                💡 Fun Fact: {item.fact}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : readerViewMode === 'grid' ? (
              <div className="bg-[#111827] p-4 md:p-6 rounded-[36px] shadow-2xl border-4 border-slate-800 space-y-5 w-full animate-in fade-in duration-300">
                {/* Top Bar Header with Close & View Switcher */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedStory(null)}
                      className="text-xs font-black text-amber-950 bg-amber-400 hover:bg-amber-300 px-4 py-2 rounded-full flex items-center gap-1 border border-amber-300 transition-all shadow-md cursor-pointer active:scale-95"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back to All Books 📚
                    </button>
                    <span className="text-[10px] font-black text-amber-400 uppercase bg-amber-950/80 px-3 py-1 rounded-full border border-amber-800/60">
                      ✨ 5-Panel Picture Book Mode
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-2xl border border-slate-700">
                    <button
                      onClick={() => setReaderViewMode('grid')}
                      className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        readerViewMode === 'grid'
                          ? 'bg-amber-400 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🖼️ 5-Panel Grid
                    </button>
                    <button
                      onClick={() => setReaderViewMode('single')}
                      className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        readerViewMode === 'single'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      📖 Single Page
                    </button>
                  </div>
                </div>

                {/* 5-Panel Picture Book Grid (2 Top / 3 Bottom matching ChatGPT picture book canvas) */}
                <div className="space-y-5 w-full">
                  {/* TOP ROW: Panel 1 (Title Cover Card) + Panel 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                    {/* Panel 1: Cover & Title Card */}
                    <div className="relative rounded-3xl overflow-hidden border-2 border-slate-700/80 shadow-2xl min-h-[280px] md:min-h-[320px] flex flex-col justify-between p-6 group">
                      {/* Full Card Background Image */}
                      <img
                        src={getStoryCover(selectedStory)}
                        alt={selectedStory.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {/* Dark Gradient Overlay for Title Contrast */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/90 via-slate-950/50 to-transparent pointer-events-none" />

                      {/* Title Content */}
                      <div className="relative z-10 space-y-2 text-left max-w-md">
                        <div className="flex items-center gap-2">
                          <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md">
                            {selectedStory.genre}
                          </span>
                          <span className="text-2xl">{selectedStory.emoji}</span>
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black text-amber-300 leading-tight uppercase tracking-tight drop-shadow-xl">
                          {selectedStory.title}
                        </h2>
                        {selectedStory.subtitle && (
                          <p className="text-xs md:text-sm text-indigo-100 font-bold italic drop-shadow-md">{selectedStory.subtitle}</p>
                        )}
                      </div>

                      <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/20 mt-4">
                        <span className="text-[10px] font-black uppercase text-slate-200 tracking-wider bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
                          By Your Story Studio
                        </span>
                        {/* Panel 1 Number Badge */}
                        <div className="w-9 h-9 rounded-full bg-white text-slate-950 font-black text-base flex items-center justify-center border-2 border-slate-900 shadow-xl">
                          1
                        </div>
                      </div>
                    </div>

                    {/* Panel 2: Picture Story Panel (Clean 50/50 Split) */}
                    {(() => {
                      const page = selectedStory.pages?.[0];
                      const panelImg = page?.imageUrl || getStoryCover(selectedStory);
                      return (
                        <div className="bg-white rounded-3xl p-4 md:p-5 border-2 border-slate-200 shadow-xl flex flex-col sm:flex-row gap-4 items-center relative min-h-[280px] md:min-h-[320px] text-left group hover:border-amber-400 transition-all">
                          {/* Left Half: Clean Narration & Audio Button */}
                          <div className="w-full sm:w-1/2 space-y-3 flex-1 flex flex-col justify-between h-full">
                            <div>
                              {renderStoryTextWithHighlights(getPageText(selectedStory, 0), true)}
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-auto">
                              <button
                                onClick={() => startSpeech(getPageText(selectedStory, 0))}
                                className="text-[10px] font-black text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                              >
                                <Volume2 className="w-3.5 h-3.5 text-amber-700" /> Listen
                              </button>
                              {/* Panel 2 Number Badge */}
                              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-sm flex items-center justify-center border-2 border-amber-400 shadow-md">
                                2
                              </div>
                            </div>
                          </div>

                          {/* Right Half: Full Clear 8K Illustration */}
                          <div className="w-full sm:w-1/2 h-52 sm:h-full rounded-2xl overflow-hidden relative shrink-0 border border-slate-200 shadow-md">
                            <img
                              src={panelImg}
                              alt="Panel 2"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => { e.target.src = getStoryCover(selectedStory); }}
                            />
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* BOTTOM ROW: Panel 3 + Panel 4 + Panel 5 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                    {selectedStory.pages?.slice(1, 4).map((page, pIdx) => {
                      const panelNumber = pIdx + 3;
                      const panelImg = page.imageUrl || getStoryCover(selectedStory);
                      return (
                        <div
                          key={pIdx}
                          className="bg-white rounded-3xl p-4 md:p-5 border-2 border-slate-200 shadow-xl flex flex-col justify-between relative min-h-[300px] text-left group hover:border-amber-400 transition-all"
                        >
                          <div className="space-y-3 flex-1 flex flex-col justify-between">
                            {/* Top Half: Clear 8K Panel Artwork */}
                            <div className="h-44 w-full rounded-2xl overflow-hidden relative shrink-0 border border-slate-200 shadow-sm">
                              <img
                                src={panelImg}
                                alt={`Panel ${panelNumber}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => { e.target.src = getStoryCover(selectedStory); }}
                              />
                            </div>
                            {/* Bottom Half: Clean Narration Text Box */}
                            <div>
                              {renderStoryTextWithHighlights(getPageText(selectedStory, pIdx + 1), true)}
                            </div>
                          </div>

                          <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
                            <button
                              onClick={() => startSpeech(getPageText(selectedStory, pIdx + 1))}
                              className="text-[10px] font-black text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-amber-700" /> Listen
                            </button>
                            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-sm flex items-center justify-center border-2 border-amber-400 shadow-md">
                              {panelNumber}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Vocabulary & Grammar Explorer (Consolidated across all panels!) */}
                  {(() => {
                    const allVocabs = (selectedStory.pages || []).flatMap(p => p.vocabHighlights || []).filter(Boolean);
                    if (!allVocabs || allVocabs.length === 0) return null;

                    // Deduplicate by word name
                    const uniqueVocabs = Array.from(new Map(allVocabs.map(item => [item.word?.toLowerCase(), item])).values());

                    return (
                      <div className="bg-amber-50/90 border-2 border-amber-300 rounded-3xl p-5 md:p-6 space-y-4 text-left shadow-lg animate-in fade-in duration-300">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">📖</span>
                            <div>
                              <h4 className="text-sm font-black text-amber-950 uppercase tracking-wider">
                                Vocabulary & Grammar Explorer
                              </h4>
                              <p className="text-[10px] font-bold text-amber-700">Click any word card to highlight where it appears across the story panels!</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-amber-800 bg-amber-200/80 px-3 py-1 rounded-full border border-amber-300">
                            {uniqueVocabs.length} Key Word{uniqueVocabs.length > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {uniqueVocabs.map((item, vIdx) => {
                            const isHighlighted = highlightedVocabWord?.toLowerCase() === item.word?.toLowerCase();
                            return (
                              <div
                                key={vIdx}
                                onClick={() => setHighlightedVocabWord(prev => prev?.toLowerCase() === item.word?.toLowerCase() ? null : item.word)}
                                className={`rounded-2xl p-4 transition-all cursor-pointer border ${
                                  isHighlighted
                                    ? 'bg-amber-100 border-amber-400 shadow-md ring-2 ring-amber-300 scale-[1.01]'
                                    : 'bg-white border-amber-200/70 hover:border-amber-400 hover:bg-amber-50/50'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-black text-slate-900 capitalize">{item.word}</span>
                                    {item.partOfSpeech && (
                                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 border border-indigo-200">
                                        {item.partOfSpeech}
                                      </span>
                                    )}
                                    {item.pronunciation && (
                                      <span className="text-[10px] font-mono text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50">
                                        [{item.pronunciation}]
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setHighlightedVocabWord(prev => prev?.toLowerCase() === item.word?.toLowerCase() ? null : item.word);
                                      }}
                                      className={`text-[10px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1 transition-all cursor-pointer ${
                                        isHighlighted ? 'bg-amber-500 text-white shadow-sm' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                      }`}
                                    >
                                      📍 {isHighlighted ? 'Highlighted' : 'Highlight'}
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        startSpeech(`${item.word}. ${item.definition}`);
                                      }}
                                      className="text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                                    >
                                      <Volume2 className="w-3 h-3 text-slate-600" /> Listen
                                    </button>
                                  </div>
                                </div>
                                <p className="text-xs text-slate-700 font-semibold leading-relaxed">{item.definition}</p>
                                {item.fact && (
                                  <p className="text-[10px] font-bold text-amber-900/90 italic bg-amber-50/90 p-2 rounded-xl border border-amber-200/60 mt-2">
                                    💡 Fun Fact: {item.fact}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Bottom Moral Banner */}
                  <div className="bg-gradient-to-r from-amber-200 via-amber-100 to-orange-200 border-2 border-amber-400 rounded-3xl p-5 md:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl animate-bounce shrink-0">💡</span>
                      <div>
                        <span className="text-[10px] font-black uppercase text-amber-900 tracking-widest bg-amber-300/80 px-2.5 py-0.5 rounded-full border border-amber-400">
                          MORAL OF THE STORY
                        </span>
                        <p className="text-base md:text-xl font-black text-amber-950 mt-1">
                          {selectedStory.parentSection?.lifeLesson || "Believe in yourself. Keep trying. Big dreams grow from small beginnings!"}
                        </p>
                      </div>
                    </div>
                    <span className="text-3xl shrink-0">🌱</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border-2 border-indigo-100 rounded-[40px] shadow-xl overflow-hidden flex flex-col max-w-4xl mx-auto min-h-[500px] animate-in fade-in duration-300">
                {/* Header Banner with Single 8K Cover Image */}
                <div className="relative bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 overflow-hidden">
                  <div className="w-28 h-36 md:w-36 md:h-44 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 shrink-0 relative bg-slate-800">
                    <img 
                      src={getStoryCover(selectedStory)} 
                      className="w-full h-full object-cover" 
                      alt={selectedStory.title} 
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <span className="absolute bottom-2 right-2 text-2xl drop-shadow">{selectedStory.emoji}</span>
                  </div>
                  <div className="flex-1 space-y-2 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                      <span className="bg-indigo-500/30 text-indigo-200 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-indigo-400/30">
                        {selectedStory.genre}
                      </span>
                      {selectedStory.targetGrade && (
                        <span className="bg-purple-500/30 text-purple-200 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-purple-400/30">
                          Grade {selectedStory.targetGrade}
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                      {selectedStory.title}
                    </h3>
                    {selectedStory.subtitle && (
                      <p className="text-xs text-indigo-200 font-semibold">{selectedStory.subtitle}</p>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <button 
                      onClick={() => setSelectedStory(null)}
                      className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-black px-4 py-2 rounded-full text-xs transition-all cursor-pointer shadow-md flex items-center gap-1 border border-amber-300 active:scale-95"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back to All Books 📚
                    </button>
                    <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/20">
                      <button
                        onClick={() => setReaderViewMode('grid')}
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                          readerViewMode === 'grid' ? 'bg-amber-400 text-slate-950' : 'text-white/80'
                        }`}
                      >
                        🖼️ 5-Panel Grid
                      </button>
                      <button
                        onClick={() => setReaderViewMode('single')}
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                          readerViewMode === 'single' ? 'bg-indigo-500 text-white' : 'text-white/80'
                        }`}
                      >
                        📖 Single
                      </button>
                    </div>
                  </div>
                </div>

                {/* Page Navigation & Interactive Header Bar */}
                <div className="px-6 md:px-8 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-2">
                    📖 <span className="font-black text-indigo-600">Page {storyPage + 1}</span> of {selectedStory.pages.length}
                  </span>
                  {highlightedVocabWord && (
                    <button
                      onClick={() => setHighlightedVocabWord(null)}
                      className="text-[10px] font-black text-amber-800 bg-amber-200 hover:bg-amber-300 px-3 py-1 rounded-full transition-colors flex items-center gap-1 border border-amber-300"
                    >
                      Clear Highlight ({highlightedVocabWord}) ✕
                    </button>
                  )}
                </div>

                {/* Main Story Content & Vocabulary Section */}
                <div className="p-6 md:p-10 space-y-8 flex-1">
                  {/* Unclustered Paragraph Narration with Interactive Highlights */}
                  {renderStoryTextWithHighlights(getPageText(selectedStory, storyPage))}

                  {/* Vocabulary & Grammar Explorer */}
                  {(() => {
                    const pageObj = selectedStory.pages?.[storyPage];
                    const vocabs = typeof pageObj === 'object' ? pageObj?.vocabHighlights : null;
                    if (!vocabs || !Array.isArray(vocabs) || vocabs.length === 0) return null;
                    return (
                      <div className="bg-amber-50/90 border-2 border-amber-200 rounded-3xl p-5 md:p-6 space-y-4 text-left shadow-sm animate-in fade-in duration-300">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">📖</span>
                            <div>
                              <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider">
                                Vocabulary & Grammar Explorer
                              </h4>
                              <p className="text-[10px] font-bold text-amber-700">Click any word card to highlight where it appears in the story!</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-amber-800 bg-amber-200/80 px-3 py-1 rounded-full border border-amber-300">
                            {vocabs.length} Key Word{vocabs.length > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {vocabs.map((item, vIdx) => {
                            const isHighlighted = highlightedVocabWord?.toLowerCase() === item.word?.toLowerCase();
                            return (
                              <div
                                key={vIdx}
                                onClick={() => setHighlightedVocabWord(prev => prev?.toLowerCase() === item.word?.toLowerCase() ? null : item.word)}
                                className={`rounded-2xl p-4 transition-all cursor-pointer border ${
                                  isHighlighted
                                    ? 'bg-amber-100 border-amber-400 shadow-md ring-2 ring-amber-300 scale-[1.01]'
                                    : 'bg-white border-amber-200/70 hover:border-amber-400 hover:bg-amber-50/50'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-black text-slate-900 capitalize">{item.word}</span>
                                    {item.partOfSpeech && (
                                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 border border-indigo-200">
                                        {item.partOfSpeech}
                                      </span>
                                    )}
                                    {item.pronunciation && (
                                      <span className="text-[10px] font-mono text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50">
                                        [{item.pronunciation}]
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setHighlightedVocabWord(prev => prev?.toLowerCase() === item.word?.toLowerCase() ? null : item.word);
                                      }}
                                      className={`text-[10px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1 transition-all cursor-pointer ${
                                        isHighlighted ? 'bg-amber-500 text-white shadow-sm' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                      }`}
                                    >
                                      📍 {isHighlighted ? 'Highlighted' : 'Highlight'}
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        startSpeech(`${item.word}. ${item.definition}`);
                                      }}
                                      className="text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                                    >
                                      <Volume2 className="w-3 h-3 text-slate-600" /> Listen
                                    </button>
                                  </div>
                                </div>
                                <p className="text-xs text-slate-700 font-semibold leading-relaxed">{item.definition}</p>
                                {item.fact && (
                                  <p className="text-[10px] font-bold text-amber-900/90 italic bg-amber-50/90 p-2 rounded-xl border border-amber-200/60 mt-2">
                                    💡 Fun Fact: {item.fact}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Parent Reflection Section */}
                  {selectedStory.parentSection && storyPage === selectedStory.pages.length - 1 && (
                    <div className="bg-indigo-50/90 border-2 border-indigo-200 rounded-3xl p-5 md:p-6 space-y-3 text-left animate-in fade-in duration-300">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">💡</span>
                        <div>
                          <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider">Story Reflection & Learning</h4>
                          <p className="text-[10px] font-bold text-indigo-600">Great for parents & teachers to discuss together!</p>
                        </div>
                      </div>

                      {selectedStory.parentSection.lifeLesson && (
                        <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-2xs">
                          <p className="text-[10px] font-black uppercase text-indigo-500 tracking-wider mb-0.5">🌟 Core Moral & Life Lesson</p>
                          <p className="text-xs font-bold text-indigo-900">{selectedStory.parentSection.lifeLesson}</p>
                        </div>
                      )}

                      {selectedStory.parentSection.discussionQuestions && selectedStory.parentSection.discussionQuestions.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">❓ Reflection Questions</p>
                          <ul className="list-disc list-inside text-xs font-bold text-slate-700 space-y-1.5 bg-white p-4 rounded-2xl border border-indigo-100">
                            {selectedStory.parentSection.discussionQuestions.map((q, qIdx) => (
                              <li key={qIdx}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {selectedStory.parentSection.activity && (
                        <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-2xs">
                          <p className="text-[10px] font-black uppercase text-indigo-500 tracking-wider mb-0.5">🎨 Creative Activity</p>
                          <p className="text-xs font-bold text-slate-700">{selectedStory.parentSection.activity}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                  {/* Navigation controls */}
                  <div className="flex items-center justify-between border-t border-slate-50 pt-6 mt-6">
                    <button
                      onClick={handlePrevPage}
                      disabled={storyPage === 0}
                      className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                        storyPage === 0
                          ? 'bg-slate-50 border-slate-50 text-slate-300 cursor-not-allowed'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev Page
                    </button>

                    {storyPage < selectedStory.pages.length - 1 ? (
                      <button
                        onClick={handleNextPage}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 hover:bg-blue-500 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                      >
                        Next Page <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedStory(null);
                          // Give a little confetti for finishing a book
                          confetti({ particleCount: 30, spread: 30 });
                        }}
                        className="bg-emerald-500 text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-400 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                      >
                        Finish Story! 🎉
                      </button>
                    )}
                  </div>
                </div>
            )}
          </div>
        )}

        {/* ==================== 2. READ ALONG ==================== */}
        {activeTab === 'Read Along' && (
          <div className="max-w-5xl mx-auto space-y-6">
            {!selectedStory ? (
              <div className="space-y-6">
                <div className="bg-orange-50 border border-orange-200 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
                  <div className="flex-1 space-y-2">
                    <span className="bg-orange-100 text-orange-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">Audio Books</span>
                    <h3 className="text-xl font-black text-slate-800">Listen & Read Together!</h3>
                    <p className="text-xs font-semibold text-slate-500">Pick any story and click Play. The app will read aloud using high-quality narrator voices. Great for developing reading skills!</p>
                  </div>
                  <div className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center shadow-lg animate-bounce">
                    <Volume2 className="w-10 h-10 text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allStories.map(story => (
                    <div 
                      key={story.id}
                      onClick={() => {
                        setSelectedStory(story);
                        setStoryPage(0);
                      }}
                      className="bg-white border border-slate-100 rounded-[32px] overflow-hidden hover:shadow-lg hover:scale-102 transition-all cursor-pointer flex flex-col group border-l-4 border-l-orange-400"
                    >
                      <div className="h-40 bg-orange-50/50 flex items-center justify-center relative overflow-hidden">
                        <img 
                          src={getStoryCover(story)} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                          alt={story.title} 
                        />
                        <div className="absolute inset-0 bg-green-900/10 group-hover:bg-green-900/20 transition-all flex items-center justify-center">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-orange-400 group-hover:scale-110 transition-all">
                            <Play className="w-5 h-5 text-orange-600 fill-orange-600 ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">{story.genre}</span>
                        <h4 className="text-base font-black text-slate-800 leading-tight group-hover:text-orange-600 transition-colors">{story.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white border-2 border-orange-100 rounded-[40px] shadow-xl overflow-hidden flex flex-col max-w-4xl mx-auto min-h-[500px] animate-in fade-in duration-300">
                {/* Header Banner with Single 8K Cover Image & TTS Audio Bar */}
                <div className="relative bg-gradient-to-r from-orange-950 via-slate-900 to-amber-950 text-white p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 overflow-hidden">
                  <div className="w-28 h-36 md:w-36 md:h-44 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 shrink-0 relative bg-slate-800">
                    <img 
                      src={getStoryCover(selectedStory)} 
                      className="w-full h-full object-cover" 
                      alt={selectedStory.title} 
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <span className="absolute bottom-2 right-2 text-2xl drop-shadow">{selectedStory.emoji}</span>
                  </div>
                  <div className="flex-1 space-y-3 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                      <span className="bg-orange-500/30 text-orange-200 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-orange-400/30">
                        {selectedStory.genre}
                      </span>
                      <span className="bg-amber-500/30 text-amber-200 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-amber-400/30">
                        🎧 Narrator Room
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                      {selectedStory.title}
                    </h3>
                    
                    {/* TTS Voice Controls Bar */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex flex-wrap items-center justify-center md:justify-start gap-3 border border-white/20">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startSpeech(getPageText(selectedStory, storyPage))}
                          className="bg-orange-500 hover:bg-orange-400 text-white w-10 h-10 rounded-full flex items-center justify-center shadow transition-all active:scale-95 cursor-pointer"
                          title="Play Narration"
                        >
                          <Play className="w-5 h-5 fill-white" />
                        </button>
                        <button
                          onClick={pauseSpeech}
                          className="bg-white/20 hover:bg-white/30 text-white w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer"
                          title="Pause / Resume"
                        >
                          <Pause className="w-4 h-4" />
                        </button>
                        <button
                          onClick={stopSpeech}
                          className="bg-white/20 hover:bg-red-500/80 text-white w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer"
                          title="Stop"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-xl">
                        <span className="text-[10px] font-black text-orange-200 uppercase">Speed:</span>
                        <button 
                          onClick={() => setReadSpeed(0.8)} 
                          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${readSpeed === 0.8 ? 'bg-orange-500 text-white' : 'text-slate-300'}`}
                        >
                          Slow
                        </button>
                        <button 
                          onClick={() => setReadSpeed(1)} 
                          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${readSpeed === 1 ? 'bg-orange-500 text-white' : 'text-slate-300'}`}
                        >
                          Normal
                        </button>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedStory(null);
                      stopSpeech();
                    }}
                    className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-black px-4 py-2 rounded-full text-xs transition-all cursor-pointer shadow-md flex items-center gap-1 border border-amber-300 active:scale-95 shrink-0"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back to All Books 📚
                  </button>
                </div>

                {/* Page Progress Indicator */}
                <div className="px-6 md:px-8 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-2">
                    📖 <span className="font-black text-orange-600">Page {storyPage + 1}</span> of {selectedStory.pages.length}
                  </span>
                  {highlightedVocabWord && (
                    <button
                      onClick={() => setHighlightedVocabWord(null)}
                      className="text-[10px] font-black text-amber-800 bg-amber-200 hover:bg-amber-300 px-3 py-1 rounded-full transition-colors flex items-center gap-1 border border-amber-300"
                    >
                      Clear Highlight ({highlightedVocabWord}) ✕
                    </button>
                  )}
                </div>

                {/* Main Story Content & Vocabulary Section */}
                <div className="p-6 md:p-10 space-y-8 flex-1">
                  {/* Unclustered Paragraph Narration with Interactive Highlights */}
                  {renderStoryTextWithHighlights(getPageText(selectedStory, storyPage))}

                  {/* Vocabulary & Grammar Explorer */}
                  {(() => {
                    const pageObj = selectedStory.pages?.[storyPage];
                    const vocabs = typeof pageObj === 'object' ? pageObj?.vocabHighlights : null;
                    if (!vocabs || !Array.isArray(vocabs) || vocabs.length === 0) return null;
                    return (
                      <div className="bg-amber-50/90 border-2 border-amber-200 rounded-3xl p-5 md:p-6 space-y-4 text-left shadow-sm animate-in fade-in duration-300">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">📖</span>
                            <div>
                              <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider">
                                Vocabulary & Grammar Explorer
                              </h4>
                              <p className="text-[10px] font-bold text-amber-700">Click any word card to highlight where it appears in the story!</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-amber-800 bg-amber-200/80 px-3 py-1 rounded-full border border-amber-300">
                            {vocabs.length} Key Word{vocabs.length > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {vocabs.map((item, vIdx) => {
                            const isHighlighted = highlightedVocabWord?.toLowerCase() === item.word?.toLowerCase();
                            return (
                              <div
                                key={vIdx}
                                onClick={() => setHighlightedVocabWord(prev => prev?.toLowerCase() === item.word?.toLowerCase() ? null : item.word)}
                                className={`rounded-2xl p-4 transition-all cursor-pointer border ${
                                  isHighlighted
                                    ? 'bg-amber-100 border-amber-400 shadow-md ring-2 ring-amber-300 scale-[1.01]'
                                    : 'bg-white border-amber-200/70 hover:border-amber-400 hover:bg-amber-50/50'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-black text-slate-900 capitalize">{item.word}</span>
                                    {item.partOfSpeech && (
                                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 border border-indigo-200">
                                        {item.partOfSpeech}
                                      </span>
                                    )}
                                    {item.pronunciation && (
                                      <span className="text-[10px] font-mono text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50">
                                        [{item.pronunciation}]
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setHighlightedVocabWord(prev => prev?.toLowerCase() === item.word?.toLowerCase() ? null : item.word);
                                      }}
                                      className={`text-[10px] font-black px-2.5 py-1 rounded-xl flex items-center gap-1 transition-all cursor-pointer ${
                                        isHighlighted ? 'bg-amber-500 text-white shadow-sm' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                      }`}
                                    >
                                      📍 {isHighlighted ? 'Highlighted' : 'Highlight'}
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        startSpeech(`${item.word}. ${item.definition}`);
                                      }}
                                      className="text-[10px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                                    >
                                      <Volume2 className="w-3 h-3 text-slate-600" /> Listen
                                    </button>
                                  </div>
                                </div>
                                <p className="text-xs text-slate-700 font-semibold leading-relaxed">{item.definition}</p>
                                {item.fact && (
                                  <p className="text-[10px] font-bold text-amber-900/90 italic bg-amber-50/90 p-2 rounded-xl border border-amber-200/60 mt-2">
                                    💡 Fun Fact: {item.fact}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Parent Reflection Section */}
                  {selectedStory.parentSection && storyPage === selectedStory.pages.length - 1 && (
                    <div className="bg-indigo-50/90 border-2 border-indigo-200 rounded-3xl p-5 md:p-6 space-y-3 text-left animate-in fade-in duration-300">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">💡</span>
                        <div>
                          <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider">Story Reflection & Learning</h4>
                          <p className="text-[10px] font-bold text-indigo-600">Great for parents & teachers to discuss together!</p>
                        </div>
                      </div>

                      {selectedStory.parentSection.lifeLesson && (
                        <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-2xs">
                          <p className="text-[10px] font-black uppercase text-indigo-500 tracking-wider mb-0.5">🌟 Core Moral & Life Lesson</p>
                          <p className="text-xs font-bold text-indigo-900">{selectedStory.parentSection.lifeLesson}</p>
                        </div>
                      )}

                      {selectedStory.parentSection.discussionQuestions && selectedStory.parentSection.discussionQuestions.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">❓ Reflection Questions</p>
                          <ul className="list-disc list-inside text-xs font-bold text-slate-700 space-y-1.5 bg-white p-4 rounded-2xl border border-indigo-100">
                            {selectedStory.parentSection.discussionQuestions.map((q, qIdx) => (
                              <li key={qIdx}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {selectedStory.parentSection.activity && (
                        <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-2xs">
                          <p className="text-[10px] font-black uppercase text-indigo-500 tracking-wider mb-0.5">🎨 Creative Activity</p>
                          <p className="text-xs font-bold text-slate-700">{selectedStory.parentSection.activity}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                  {/* Navigation controls */}
                  <div className="flex items-center justify-between border-t border-slate-50 pt-6 mt-6">
                    <button
                      onClick={handlePrevPage}
                      disabled={storyPage === 0}
                      className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                        storyPage === 0
                          ? 'bg-slate-50 border-slate-50 text-slate-300 cursor-not-allowed'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev Page
                    </button>

                    {storyPage < selectedStory.pages.length - 1 ? (
                      <button
                        onClick={handleNextPage}
                        className="bg-orange-600 text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 hover:bg-orange-500 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                      >
                        Next Page <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedStory(null);
                          stopSpeech();
                          confetti({ particleCount: 30, spread: 30 });
                        }}
                        className="bg-emerald-500 text-white px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-400 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                      >
                        Finish Listening! 🎉
                      </button>
                    )}
                  </div>
                </div>
            )}
          </div>
        )}

        {/* ==================== 3. QUIZZES (30 MATH PUZZLES) ==================== */}
        {activeTab === 'Quizzes' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {!isQuizCompleted ? (
              <div className="bg-white border border-slate-100 rounded-[40px] shadow-sm overflow-hidden flex flex-col">
                {/* Score and Progress Bar */}
                <div className="px-8 py-6 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black text-amber-700 uppercase bg-amber-100/70 px-3 py-1 rounded-full flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5" /> Puzzle {currentQuizIndex + 1} of {allPuzzles.length}
                      </span>
                      <span className="text-xs font-black text-amber-600 flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-amber-500" /> Score: {quizScore} XP
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden border border-slate-200/50">
                      <div 
                        className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuizIndex) / allPuzzles.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* AI Puzzle Generator Control in header */}
                  <div className="shrink-0 flex items-center gap-2">
                    <select
                      value={puzzleTopic}
                      onChange={(e) => setPuzzleTopic(e.target.value)}
                      className="bg-white border border-amber-200 text-xs font-bold text-slate-700 rounded-xl px-2.5 py-1.5 focus:border-amber-400 outline-none"
                    >
                      <option value="Addition">Addition ➕</option>
                      <option value="Subtraction">Subtraction ➖</option>
                      <option value="Multiplication">Multiplication ✖️</option>
                      <option value="Division">Division ➗</option>
                      <option value="Geometry">Geometry 🔺</option>
                      <option value="Patterns">Patterns 🔢</option>
                      <option value="Space Math">Space Math 🚀</option>
                      <option value="Word Problems">Word Problems 📝</option>
                    </select>
                    <button
                      onClick={handleGeneratePuzzles}
                      disabled={isGeneratingPuzzles}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isGeneratingPuzzles ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                      Generate +5 Puzzles
                    </button>
                  </div>
                </div>

                {/* Math Puzzle Board */}
                <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-6 text-center">
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 leading-snug max-w-xl mx-auto select-none pt-4">
                      {allPuzzles[currentQuizIndex]?.question}
                    </h3>

                    {/* Feedback animation overlay/container */}
                    <div className="h-12 flex items-center justify-center">
                      {quizFeedback === 'correct' && (
                        <div className="flex items-center gap-2 text-emerald-500 font-black text-lg animate-bounce">
                          <CheckCircle className="w-6 h-6 fill-emerald-100" /> Correct! +10 XP 🌟
                        </div>
                      )}
                      {quizFeedback === 'wrong' && (
                        <div className="flex items-center gap-2 text-rose-500 font-black text-lg animate-wiggle">
                          <XCircle className="w-6 h-6 fill-rose-100" /> Oops! Try again! 🤔
                        </div>
                      )}
                    </div>

                    {/* Answer Display */}
                    <div className="max-w-xs mx-auto border-4 border-amber-200 bg-amber-50/20 rounded-3xl p-5 shadow-inner">
                      <span className="text-3xl font-black tracking-widest text-slate-700 min-h-[2.5rem] block select-none">
                        {userAnswer || <span className="text-slate-300 font-light font-quicksand">?</span>}
                      </span>
                    </div>
                  </div>

                  {/* Input controls & Number Pad */}
                  <div className="space-y-6">
                    {/* Kid Friendly Number Pad */}
                    <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleNumberClick(num.toString())}
                          className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-lg font-black text-slate-700 py-3.5 rounded-2xl active:scale-95 shadow-sm hover:border-amber-300 transition-all cursor-pointer"
                        >
                          {num}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={handleClearAnswer}
                        className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-[10px] font-black text-rose-600 rounded-2xl active:scale-95 shadow-sm transition-all cursor-pointer flex items-center justify-center uppercase tracking-wider"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={() => handleNumberClick('0')}
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-lg font-black text-slate-700 py-3.5 rounded-2xl active:scale-95 shadow-sm hover:border-amber-300 transition-all cursor-pointer"
                      >
                        0
                      </button>
                      <button
                        type="button"
                        onClick={handleBackspace}
                        className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[10px] font-black text-amber-700 rounded-2xl active:scale-95 shadow-sm transition-all cursor-pointer flex items-center justify-center uppercase tracking-wider"
                      >
                        Delete
                      </button>
                    </div>

                    {/* Hint and Submit buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-slate-50 pt-6">
                      <button
                        type="button"
                        onClick={() => setShowHint(!showHint)}
                        className="px-6 py-3 rounded-2xl border border-amber-300 text-amber-700 bg-amber-50/50 text-xs font-bold hover:bg-amber-50 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <HelpCircle className="w-4 h-4 text-amber-500" />
                        {showHint ? "Hide Hint" : "Get Hint"}
                      </button>

                      <button
                        type="button"
                        onClick={handleQuizSubmit}
                        disabled={!userAnswer || quizFeedback}
                        className={`px-8 py-3.5 rounded-2xl text-white text-xs font-black shadow transition-all flex items-center gap-2 active:scale-95 cursor-pointer ${
                          !userAnswer || quizFeedback
                            ? 'bg-slate-300 cursor-not-allowed shadow-none'
                            : 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/25 border-b-4 border-amber-600 active:border-b-0'
                        }`}
                      >
                        Check Answer <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Show Hint Text */}
                    {showHint && (
                      <div className="bg-amber-50 border border-dashed border-amber-200 rounded-2xl p-4 text-center max-w-md mx-auto animate-fade-in">
                        <p className="text-xs font-bold text-amber-800 leading-tight">
                          💡 Hint: {allPuzzles[currentQuizIndex]?.hint}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // Quiz Completed screen
              <div className="bg-white border border-slate-100 rounded-[40px] shadow-sm p-10 text-center space-y-6">
                <div className="w-24 h-24 bg-amber-100 rounded-full flex-center mx-auto text-5xl animate-bounce shadow">
                  🏆
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-800">Ultimate Math Wiz! 🎉</h3>
                  <p className="text-sm font-semibold text-slate-500">Amazing job! You solved all {allPuzzles.length} math puzzles successfully.</p>
                </div>

                <div className="max-w-sm mx-auto bg-amber-50/50 border border-amber-100 rounded-3xl p-6 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">XP Earned</span>
                    <span className="text-2xl font-black text-amber-600">+{allPuzzles.length * 10} XP</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Stars Collected</span>
                    <span className="text-2xl font-black text-amber-600">{allPuzzles.length} / {allPuzzles.length} ⭐</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 max-w-sm mx-auto pt-2">
                  <button
                    onClick={resetQuiz}
                    className="bg-amber-500 hover:bg-amber-400 text-white font-black px-8 py-4 rounded-3xl shadow-lg shadow-amber-500/20 transition-all border-b-4 border-amber-700 active:translate-y-0.5 active:border-b-0 cursor-pointer"
                  >
                    Play Again 🔄
                  </button>

                  <div className="w-full border-t border-slate-100 my-2" />

                  {/* AI Math Wizard on completion page */}
                  <div className="bg-gradient-to-r from-amber-50 via-orange-50/30 to-amber-50 border border-amber-100 rounded-[32px] p-6 text-center space-y-4 shadow-sm">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl">🧙‍♂️</span>
                      <h4 className="text-sm font-black text-slate-800">Math Wizard</h4>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-500 leading-normal">
                      Want more challenge? Ask the wizard to create 5 new custom math puzzles of your favorite topic!
                    </p>
                    <div className="flex flex-col gap-2">
                      <select
                        value={puzzleTopic}
                        onChange={(e) => setPuzzleTopic(e.target.value)}
                        className="bg-white border border-amber-200 text-xs font-bold text-slate-700 rounded-xl px-3 py-2 w-full outline-none"
                      >
                        <option value="Addition">Addition ➕</option>
                        <option value="Subtraction">Subtraction ➖</option>
                        <option value="Multiplication">Multiplication ✖️</option>
                        <option value="Division">Division ➗</option>
                        <option value="Geometry">Geometry 🔺</option>
                        <option value="Patterns">Patterns 🔢</option>
                        <option value="Space Math">Space Math 🚀</option>
                        <option value="Word Problems">Word Problems 📝</option>
                      </select>
                      <button
                        onClick={handleGeneratePuzzles}
                        disabled={isGeneratingPuzzles}
                        className="bg-amber-500 hover:bg-amber-400 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md shadow-amber-500/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 w-full"
                      >
                        {isGeneratingPuzzles ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                        Generate +5 Puzzles
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== 4. EARN REWARDS ==================== */}
        {activeTab === 'Earn Rewards' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
              <div className="flex-1 space-y-2">
                <span className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">Badge Collection</span>
                <h3 className="text-xl font-black text-slate-800">Earn Stars & Medals!</h3>
                <p className="text-xs font-semibold text-slate-500">Read books, listen to narration, and solve math quizzes to earn stars. These stars boost your dashboard score and unlock cool pet companion frames!</p>
              </div>
              <div className="w-20 h-20 bg-amber-500 rounded-3xl flex items-center justify-center shadow-lg">
                <Award className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Shelf Display */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-800">🏆 Your Library Trophies</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { title: "Book Worm 🐛", desc: "Read 1 complete story", completed: true, badge: "📚" },
                  { title: "Audio Listener 🎧", desc: "Listen to a full narrator story", completed: true, badge: "📢" },
                  { title: "Math Rookie 🧮", desc: "Solve 5 math puzzles", completed: earnedStars >= 5, badge: "➕" },
                  { title: "Grand Math Master 👑", desc: "Complete all 30 math puzzles", completed: isQuizCompleted, badge: "🎓" }
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className={`bg-white border border-slate-100 rounded-3xl p-6 text-center space-y-4 shadow-sm flex flex-col items-center justify-between border-b-4 ${
                      item.completed ? 'border-b-emerald-400' : 'border-b-slate-200 opacity-60'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${
                      item.completed ? 'bg-emerald-50' : 'bg-slate-50'
                    }`}>
                      {item.badge}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-800">{item.title}</h4>
                      <p className="text-[10px] font-semibold text-slate-400 leading-tight">{item.desc}</p>
                    </div>
                    <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      item.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {item.completed ? "Unlocked" : "Locked"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
