import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  ChevronRight, 
  BookOpen,
  ChevronLeft, 
  Timer, 
  Award,
  AlertCircle,
  GraduationCap,
  XCircle,
  Trophy,
  Star,
  Rocket,
  BrainCircuit,
  MessageSquare,
  Loader2,
  Paperclip,
  Sparkles,
  Upload,
  Copy,
  Download,
  Flag,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { playSuccess, playFail } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { fetchWithRetry, generateContent } from '../utils/aiClient';
import DynamicChart from '../components/DynamicChart';
import DynamicGeometry from '../components/DynamicGeometry';
import DynamicGridMap from '../components/DynamicGridMap';
import DynamicNumberLine from '../components/DynamicNumberLine';
import DynamicPathMap from '../components/DynamicPathMap';
import DynamicInstrument from '../components/DynamicInstrument';
import DynamicBlockStructure from '../components/DynamicBlockStructure';
import EarlyMathVisualizer from '../components/EarlyMathVisualizer';
import InteractiveSorting from '../components/InteractiveSorting';
import InteractiveMatching from '../components/InteractiveMatching';
import { ClockFace, parseQuestionText } from '../components/ClockFace';

const playTTS = (text) => {
  if (!text) return;
  const cleanText = text.replace(/<[^>]*>?/gm, ''); // Strip HTML if any
  const utterance = new SpeechSynthesisUtterance(cleanText);
  // Using a slightly slower, child-friendly rate
  utterance.rate = 0.9;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
};

export default function StudentQuiz({ homeworkId, studentName, teacher, initialSubmission, onComplete }) {
  const [activeModel, setActiveModel] = useState('gemini');
  const [homework, setHomework] = useState(null);
  const isSubmittingRef = useRef(false);
  
  const [currentIdx, setCurrentIdx] = useState(() => {
    if (initialSubmission) return 0;
    try {
      const draft = localStorage.getItem(`hz_draft_${studentName}_${homeworkId}`);
      if (draft) {
        const parsed = JSON.parse(draft);
        return typeof parsed.currentIdx === 'number' ? parsed.currentIdx : 0;
      }
    } catch (e) {
      console.error("Error loading draft currentIdx:", e);
    }
    return 0;
  });

  const [answers, setAnswers] = useState(() => {
    if (initialSubmission) return initialSubmission.answers || {};
    try {
      const draft = localStorage.getItem(`hz_draft_${studentName}_${homeworkId}`);
      if (draft) {
        const parsed = JSON.parse(draft);
        return parsed.answers || {};
      }
    } catch (e) {
      console.error("Error loading draft answers:", e);
    }
    return {};
  });
  const [markedForReview, setMarkedForReview] = useState(() => {
    if (initialSubmission) return {};
    try {
      const draft = localStorage.getItem(`hz_draft_${studentName}_${homeworkId}`);
      if (draft) {
        const parsed = JSON.parse(draft);
        return parsed.markedForReview || {};
      }
    } catch (e) {
      console.error("Error loading draft markedForReview:", e);
    }
    return {};
  });

  const [secondsSpent, setSecondsSpent] = useState(() => {
    if (initialSubmission) return initialSubmission.timeSpent || 0;
    try {
      const draft = localStorage.getItem(`hz_draft_${studentName}_${homeworkId}`);
      if (draft) {
        const parsed = JSON.parse(draft);
        return typeof parsed.secondsSpent === 'number' ? parsed.secondsSpent : 0;
      }
    } catch (e) {
      console.error("Error loading draft secondsSpent:", e);
    }
    return 0;
  });

  const [isSubmitted, setIsSubmitted] = useState(!!initialSubmission);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [score, setScore] = useState(initialSubmission ? initialSubmission.correctCount : null);
  const [feedback, setFeedback] = useState(initialSubmission ? initialSubmission.feedback : '');
  const [wrongAnswersExplanations, setWrongAnswersExplanations] = useState(initialSubmission?.wrongAnswersExplanations || {});
  const [loading, setLoading] = useState(true);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isSubmitted || loading || !homework || isSubmitting) return;
    const interval = setInterval(() => {
      setSecondsSpent(prev => {
        const newTime = prev + 1;
        // Auto-submit if it's a test and time has run out
        if (homework.type === 'test' && homework.timeLimit) {
          const limitSeconds = parseInt(homework.timeLimit) * 60;
          if (newTime >= limitSeconds) {
             clearInterval(interval);
             // Call submit from here. But we need a ref or something to access handleFinish
             // A simpler way is to use another useEffect to watch secondsSpent
          }
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, loading, homework, isSubmitting]);

  useEffect(() => {
    const fetchTeacherActiveModel = async () => {
      if (!teacher?.uid) return;
      try {
        const teacherDoc = await getDoc(doc(db, 'teachers', teacher.uid));
        if (teacherDoc.exists()) {
          const data = teacherDoc.data();
          if (data.activeAi) {
            setActiveModel(data.activeAi);
          }
        }
      } catch (err) {
        console.error("Error fetching teacher active model:", err);
      }
    };
    fetchTeacherActiveModel();
  }, [teacher]);

  useEffect(() => {
    const fetchHomework = async () => {
      if (!homeworkId) return;
      try {
        const docRef = doc(db, 'homeworks', homeworkId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setHomework(snap.data());
        }
      } catch (err) {
        console.error("Fetch Homework Error:", err);
      }
      setLoading(false);
    };
    fetchHomework();
  }, [homeworkId]);

  // Auto-save draft progress to localStorage
  useEffect(() => {
    if (isSubmitted || loading || !homework) return;
    if (Object.keys(answers).length > 0 || currentIdx > 0 || secondsSpent > 0 || Object.keys(markedForReview).length > 0) {
      localStorage.setItem(`hz_draft_${studentName}_${homeworkId}`, JSON.stringify({
        answers,
        currentIdx,
        secondsSpent,
        markedForReview
      }));
    }
  }, [answers, currentIdx, secondsSpent, markedForReview, isSubmitted, studentName, homeworkId, loading, homework]);

  // Handle auto-submit for tests
  useEffect(() => {
    if (homework?.type === 'test' && homework?.timeLimit && !isSubmitted && !isSubmitting) {
       const limitSeconds = parseInt(homework.timeLimit) * 60;
       if (secondsSpent >= limitSeconds) {
          handleSubmit();
       }
    }
  }, [secondsSpent, homework, isSubmitted, isSubmitting]);

  if (loading) {
    return (
      <div className="min-h-screen flex-center bg-[#F9F9FF]">
        <div className="flex flex-col items-center gap-6">
          <Rocket className="w-16 h-16 text-orange-500 animate-bounce" />
          <p className="text-xl font-black text-slate-800 lowercase">Preparing your mission...</p>
        </div>
      </div>
    );
  }

  if (!homework) {
    return (
      <div className="min-h-screen flex-center bg-[#F9F9FF]">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-full flex-center mx-auto border-4 border-white shadow-xl">
            <AlertCircle className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Mission Not Found</h2>
          <button onClick={onComplete} className="btn-bubble btn-primary">Go Back</button>
        </div>
      </div>
    );
  }

  const reviewQuestions = isReviewing 
    ? homework.questions.filter(q => {
        let isWrong = false;
        if (Object.keys(answers).length > 0) {
          isWrong = answers[q.id] !== q.answer;
        } else {
          isWrong = wrongAnswersExplanations && !!wrongAnswersExplanations[q.id];
        }
        return isReviewing === 'correct' ? !isWrong : isWrong;
      }) 
    : homework.questions;
  
  // If the filter returns empty, we can just show an empty state or fall back to all.
  // For simplicity, if they have no correct/incorrect, we just show all but we will label it appropriately later.
  const displayQuestions = (isReviewing && reviewQuestions.length === 0) ? homework.questions : reviewQuestions;

  const currentQuestion = displayQuestions[currentIdx] || displayQuestions[0];
  const progress = ((currentIdx + 1) / displayQuestions.length) * 100;

  const handleSelect = (qId, option) => {
    if (isSubmitted) return;
    setAnswers({ ...answers, [qId]: option });
  };

  async function handleSubmit() {
    if (isSubmittingRef.current || isSubmitted) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    let correctCount = 0;
    
    if (homework.type !== 'lesson') {
      homework.questions.forEach(q => {
        if (q.questionType === 'text') {
          const studentAns = (answers[q.id] || '').trim().toLowerCase();
          const correctAns = (q.answer || '').trim().toLowerCase();
          if (studentAns === correctAns) correctCount++;
        } else {
          if (answers[q.id] === q.answer) correctCount++;
        }
      });
    } else {
      correctCount = homework.questions.length;
    }
    
    const finalScore = homework.type === 'lesson' ? 100 : Math.round((correctCount / homework.questions.length) * 100);
    setScore(correctCount);

    let aiFeedback = homework.type === 'lesson' 
      ? "Great job finishing the lesson! 🌟" 
      : finalScore >= 80 
        ? "Outstanding work! You've mastered this topic. Keep it up! 🌟" 
        : finalScore >= 50 
          ? "Good effort! A bit more practice and you'll be a pro. 📚" 
          : "Don't give up! Review the core concepts and try again. 🦾";

    const wrongQuestions = homework.type === 'lesson' ? [] : homework.questions.filter(q => {
      if (q.questionType === 'text') {
        const studentAns = (answers[q.id] || '').trim().toLowerCase();
        const correctAns = (q.answer || '').trim().toLowerCase();
        return studentAns !== correctAns;
      }
      return answers[q.id] !== q.answer;
    });
    let explanations = {};

    if (homework.type !== 'lesson') {
      // ── FAST PATH: use pre-generated explanations stored on the homework ──
      // These were generated once at homework creation time (teacher side).
      // Zero API calls needed from the student side.
      const preGenerated = homework.questionExplanations;

      if (preGenerated && Object.keys(preGenerated).length > 0) {
          const excellentEmojis = ["🌟", "🎉", "🏆", "🔥", "✨"];
          const goodEmojis = ["🚀", "👍", "💡", "👏", "⭐"];
          const okayEmojis = ["📚", "🤔", "💪", "🌱", "✏️"];
          const tryAgainEmojis = ["💪", "🎯", "🧠", "🔄", "🤝"];

          const pickEmoji = (arr) => arr[Math.floor(Math.random() * arr.length)];

          if (finalScore === 100) {
            aiFeedback = `Outstanding work! A perfect score! ${pickEmoji(excellentEmojis)}`;
          } else if (finalScore >= 80) {
            aiFeedback = `Great job! You've really got the hang of this! ${pickEmoji(goodEmojis)}`;
          } else if (finalScore >= 50) {
            aiFeedback = `Good effort! Review the explanations to see where you can improve. ${pickEmoji(okayEmojis)}`;
          } else {
            aiFeedback = `Keep trying! Reviewing the answers will help you master this topic. ${pickEmoji(tryAgainEmojis)}`;
          }
        // Use pre-generated explanations — no per-student API call for explanations
        wrongQuestions.forEach(q => {
          const qIdStr = String(q.id).trim();
          explanations[q.id] = preGenerated[q.id] || preGenerated[qIdStr]
            || Object.entries(preGenerated).find(([k]) => k.toString() === qIdStr)?.[1]
            || `The correct answer is "${q.answer}".`;
        });
      } else {
        // ── FALLBACK PATH: old homeworks without pre-generated explanations ──
        // This keeps full backward compatibility without using any AI tokens!
        const excellentEmojis = ["🌟", "🎉", "🏆", "🔥", "✨"];
        const goodEmojis = ["🚀", "👍", "💡", "👏", "⭐"];
        const okayEmojis = ["📚", "🤔", "💪", "🌱", "✏️"];
        const tryAgainEmojis = ["💪", "🎯", "🧠", "🔄", "🤝"];

        const pickEmoji = (arr) => arr[Math.floor(Math.random() * arr.length)];

        if (finalScore === 100) {
          aiFeedback = `Outstanding work! A perfect score! ${pickEmoji(excellentEmojis)}`;
        } else if (finalScore >= 80) {
          aiFeedback = `Great job! You've really got the hang of this! ${pickEmoji(goodEmojis)}`;
        } else if (finalScore >= 50) {
          aiFeedback = `Good effort! Review the explanations to see where you can improve. ${pickEmoji(okayEmojis)}`;
        } else {
          aiFeedback = `Keep trying! Reviewing the answers will help you master this topic. ${pickEmoji(tryAgainEmojis)}`;
        }

        wrongQuestions.forEach(q => {
          explanations[q.id] = `The correct answer is "${q.answer}".`;
        });
      }
      
      wrongQuestions.forEach(q => {
        const qIdStr = String(q.id).trim();
        let exp = explanations[q.id] || explanations[qIdStr];

        if (!exp) {
          const matchedKey = Object.keys(explanations).find(k => {
            const cleanK = k.toLowerCase().replace(/[^a-z0-9]/g, '');
            const cleanId = qIdStr.toLowerCase().replace(/[^a-z0-9]/g, '');
            return cleanK === cleanId || cleanK.includes(`question${cleanId}`) || cleanK.endsWith(cleanId);
          });
          if (matchedKey) {
            exp = explanations[matchedKey];
          }
        }

        if (exp) {
          explanations[q.id] = exp;
        } else {
          explanations[q.id] = `The correct answer is "${q.answer}".`;
        }
      });
    }

    setWrongAnswersExplanations(explanations);
    setFeedback(aiFeedback);

    try {
      const marksPerQ = homework.marksPerQuestion ? parseInt(homework.marksPerQuestion) : 1;
      const totalMarksScored = homework.type === 'test' ? correctCount * marksPerQ : undefined;

      const submissionPayload = {
        homeworkId,
        studentName,
        teacherId: teacher.uid,
        classId: homework.assignedClassId || null,
        score: finalScore,
        correctCount,
        totalQuestions: homework.questions.length,
        feedback: aiFeedback,
        answers,
        wrongAnswersExplanations: explanations,
        timeSpent: secondsSpent,
        submittedAt: serverTimestamp()
      };

      if (totalMarksScored !== undefined) {
         submissionPayload.totalMarksScored = totalMarksScored;
      }

      await addDoc(collection(db, 'submissions'), submissionPayload);
      
      // Clean up the draft progress in localStorage
      localStorage.removeItem(`hz_draft_${studentName}_${homeworkId}`);
      
      setIsSubmitted(true);
      if (finalScore >= 70) {
        playSuccess();
        triggerConfetti();
      } else {
        playFail();
      }
    } catch (err) {
      console.error("Submit Error:", err);
      alert("Failed to save your result. Please contact your teacher! 🆘");
    }
    isSubmittingRef.current = false;
    setIsSubmitting(false);
  };

  if (isSubmitted && !isReviewing) {
    return (
      <QuizResults 
        type={homework.type}
        score={score} 
        total={homework.questions.length} 
        percentage={(score / homework.questions.length) * 100} 
        feedback={feedback}
        questions={homework.questions}
        answers={answers}
        wrongAnswersExplanations={wrongAnswersExplanations}
        onHome={onComplete}
        onReview={(type) => { setIsReviewing(type); setCurrentIdx(0); }}
        onRetake={() => {
           setIsSubmitted(false);
           setIsReviewing(false);
           setAnswers({});
           setCurrentIdx(0);
           setScore(null);
           setFeedback('');
           setWrongAnswersExplanations({});
           // Clean up draft on retake
           localStorage.removeItem(`hz_draft_${studentName}_${homeworkId}`);
        }}
      />
    );
  }


  return (
    <div className="min-h-screen bg-[#AEE6FE] p-6 md:p-8 flex flex-col relative font-sans">
      {/* Custom Background Image */}
      <div className="fixed inset-0 pointer-events-none select-none z-0">
        <div 
          className="absolute inset-0 bg-[url('/quiz-bg.jpg')] bg-cover bg-center bg-no-repeat opacity-30 mix-blend-multiply"
        />
      </div>

      {/* Header & Progress */}
      <header className={`max-w-${homework.passage ? '7xl' : '5xl'} mx-auto w-full mb-8 sticky top-4 z-50`}>
        <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 shadow-[0_8px_0_0_rgba(255,255,255,0.6)] flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col gap-4">
              <button onClick={isReviewing ? () => setIsReviewing(false) : onComplete} className="flex items-center gap-2 text-slate-400 hover:text-slate-700 font-black text-xs uppercase tracking-widest transition-colors">
                <ChevronLeft className="w-4 h-4" /> 
                <span>{isReviewing ? "BACK TO RESULTS" : "BACK TO DASHBOARD"}</span>
              </button>
              <div className="w-14 h-14 bg-[#F97316] text-white flex-center rounded-2xl shadow-[0_4px_0_0_#C2410C] shrink-0">
                <Sparkles className="w-7 h-7" />
              </div>
            </div>
            
            <div className="text-center flex-1 px-4">
               <h2 className="text-3xl font-black text-[#F97316] uppercase tracking-tight">{homework.title} {isReviewing && "(REVIEW)"}</h2>
               <p className="text-[#F97316] font-bold text-sm tracking-[0.2em] uppercase mt-0.5">ADVENTURE QUEST</p>
               <p className="text-slate-700 font-black text-sm uppercase tracking-widest mt-3">
                 {homework.subject} - {!isReviewing 
                   ? `${homework.questions.length} QUESTIONS` 
                   : (isReviewing === 'correct' ? `${displayQuestions.length} CORRECT ANSWERS` : `${displayQuestions.length} MISTAKES TO REVIEW`)}
               </p>
            </div>

            <div className="bg-[#B45309] p-1.5 rounded-[20px] shadow-[0_4px_0_0_#78350F] shrink-0">
              <div className="bg-[#FDE68A] border-2 border-[#D97706] rounded-xl px-4 py-2 flex items-center gap-2 shadow-inner">
                 <Timer className="w-5 h-5 text-[#B45309]" />
                 <span className="font-black text-[#B45309] tracking-wider text-lg">
                   {homework?.type === 'test' && homework?.timeLimit 
                     ? formatTime(Math.max(0, parseInt(homework.timeLimit) * 60 - secondsSpent))
                     : formatTime(secondsSpent)}
                 </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 px-2">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest shrink-0 whitespace-nowrap">
                {isReviewing === 'correct' ? 'CORRECT' : (isReviewing === 'incorrect' ? 'MISTAKE' : 'QUESTION')} {currentIdx + 1} OF {displayQuestions.length}
              </span>
              {homework?.type === 'test' && (
                <span className="text-[10px] font-black uppercase text-rose-500 tracking-widest shrink-0 whitespace-nowrap bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  {homework.marksPerQuestion || 1} MARKS
                </span>
              )}
              <div className="flex-1 relative flex items-center h-8">
                <div className="w-full h-4 bg-[#E0F2FE] rounded-full overflow-hidden shadow-inner">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${progress}%` }}
                     className="h-full bg-gradient-to-r from-[#38BDF8] to-[#F97316]"
                   />
                </div>
                <motion.div 
                  animate={{ left: `${progress}%` }}
                  className="absolute -ml-5 z-10 drop-shadow-md text-3xl"
                >
                  🚀
                </motion.div>
              </div>
            </div>

            {/* Question Navigation Dots */}
            {homework.type !== 'lesson' && (
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {displayQuestions.map((q, i) => {
                   let dotStatus = 'bg-slate-200 border-slate-300';
                   const hasAnswer = answers[q.id] !== undefined;
                   const isMarked = markedForReview[q.id];
                   
                   if (isReviewing) {
                       const isCorrect = q.answer === answers[q.id];
                       if (isCorrect) dotStatus = 'bg-emerald-400 border-emerald-500';
                       else if (hasAnswer) dotStatus = 'bg-rose-400 border-rose-500';
                       else dotStatus = 'bg-slate-300 border-slate-400';
                   } else {
                       if (i === currentIdx) dotStatus = 'bg-[#F97316] border-[#C2410C] scale-110';
                       else if (isMarked) dotStatus = 'bg-amber-400 border-amber-500';
                       else if (hasAnswer) dotStatus = 'bg-blue-400 border-blue-500';
                   }

                   return (
                     <button
                       key={q.id}
                       onClick={() => setCurrentIdx(i)}
                       className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${dotStatus} ${i === currentIdx ? 'ring-2 ring-orange-300 ring-offset-1' : 'hover:scale-110'} shrink-0`}
                       title={`Question ${i + 1}`}
                     >
                        {isMarked && !isReviewing && <Flag className="w-3.5 h-3.5 text-white fill-white" />}
                        {(!isMarked || isReviewing) && (
                          <span className="text-[10px] font-black text-white">{i + 1}</span>
                        )}
                     </button>
                   )
                })}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className={`max-w-${homework.passage ? '7xl' : '4xl'} mx-auto w-full flex-1 relative z-10 flex flex-col gap-6`}>
        {homework.type === 'test' && !showSummary ? (
          <div className={`w-full flex ${homework.passage ? 'flex-col lg:flex-row' : 'flex-col'} gap-8 pb-24 items-start`}>
            {homework.passage && (
              <div className="w-full lg:w-1/2 lg:sticky lg:top-[180px] bg-white/95 backdrop-blur-md rounded-[32px] p-8 shadow-[0_8px_0_0_rgba(255,255,255,0.6)] flex flex-col lg:max-h-[calc(100vh-220px)] overflow-y-auto no-scrollbar">
                <div className="flex items-center gap-2 mb-6 shrink-0">
                  <BookOpen className="w-6 h-6 text-indigo-500" />
                  <h2 className="text-xl font-black text-slate-800">Reading Passage</h2>
                </div>
                <div className="text-lg font-medium text-slate-700 leading-relaxed space-y-4 pb-4">
                  {homework.passage.split('\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
            
            <div className={`flex flex-col gap-6 ${homework.passage ? 'w-full lg:w-1/2' : 'w-full'}`}>
              {displayQuestions.map((q, index) => {
                 let { text: cleanText, clockTime, inlineSvg } = parseQuestionText(q.text);
                 const effectiveSvgCode = inlineSvg || q.svgCode;
                 const hasAnswer = answers[q.id] !== undefined;
                 const isCorrect = isReviewing ? q.answer === answers[q.id] : null;
                 const isWrong = isReviewing ? q.answer !== answers[q.id] : null;
                 
                 return (
                   <div key={q.id} className={`bg-white/95 backdrop-blur-md rounded-[32px] p-8 shadow-[0_8px_0_0_rgba(255,255,255,0.6)] flex flex-col transition-all ${isReviewing && isWrong ? 'border-4 border-rose-100' : ''}`}>
                     <div className="flex gap-6">
                       <div className="flex flex-col items-center gap-3 shrink-0">
                         <div className="w-12 h-12 bg-[#F8FAFC] text-slate-500 border-2 border-slate-200 font-black text-xl rounded-2xl flex items-center justify-center shadow-inner">
                           {index + 1}
                         </div>
                         {!isReviewing && (
                           <button
                             onClick={() => {
                               setMarkedForReview(prev => {
                                 const newState = { ...prev };
                                 if (newState[q.id]) delete newState[q.id];
                                 else newState[q.id] = true;
                                 return newState;
                               });
                             }}
                             className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${markedForReview[q.id] ? 'bg-amber-100 border-2 border-amber-300 shadow-[0_4px_0_0_#FCD34D] active:shadow-none active:translate-y-[4px]' : 'bg-white border-2 border-slate-200 shadow-[0_4px_0_0_#f1f2f6] hover:bg-slate-50 active:shadow-none active:translate-y-[4px]'}`}
                             title="Mark for review"
                           >
                             <Flag className={`w-5 h-5 ${markedForReview[q.id] ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                           </button>
                         )}
                       </div>
                       <div className="flex-1 flex flex-col">
                         <div className="text-xl font-bold text-slate-800 mb-8 whitespace-pre-wrap leading-relaxed flex items-start gap-3">
                            <button 
                              onClick={() => playTTS(cleanText)}
                              className="mt-1 p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition-colors shrink-0"
                              title="Read Aloud"
                            >
                              <Volume2 className="w-5 h-5" />
                            </button>
                            <span>{cleanText}</span>
                          </div>
                         
                         {/* Visuals */}
                         <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                           {q.chartData && <div className="w-full md:w-1/2"><DynamicChart data={q.chartData} /></div>}
                           {q.geometryData && <div className="w-full md:w-1/2"><DynamicGeometry data={q.geometryData} /></div>}
                           {q.gridMapData && <div className="w-full md:w-1/2"><DynamicGridMap data={q.gridMapData} /></div>}
                           {q.numberLineData && <div className="w-full md:w-2/3"><DynamicNumberLine data={q.numberLineData} /></div>}
                           {q.pathData && <div className="w-full md:w-1/2"><DynamicPathMap data={q.pathData} /></div>}
                           {q.instrumentData && <div className="w-full md:w-1/2"><DynamicInstrument data={q.instrumentData} /></div>}
                           {q.blockData && <div className="w-full md:w-1/2"><DynamicBlockStructure data={q.blockData} /></div>}
                           {q.earlyMathData && <div className="w-full md:w-1/2"><EarlyMathVisualizer data={q.earlyMathData} /></div>}
                           {effectiveSvgCode && !q.chartData && !q.geometryData && !q.gridMapData && !q.numberLineData && !q.pathData && !q.instrumentData && !q.blockData && !q.earlyMathData && (
                             <div className="w-64 h-64 md:w-80 md:h-80 bg-slate-50 rounded-[32px] flex-center p-4 border-4 border-slate-100 shadow-inner">
                               <div dangerouslySetInnerHTML={{ __html: effectiveSvgCode }} className="w-full h-full" />
                             </div>
                           )}
                           {q.imageUrl && !q.chartData && !q.geometryData && !q.gridMapData && !q.numberLineData && !q.pathData && !q.instrumentData && !q.blockData && !q.earlyMathData && !effectiveSvgCode && (
                             <div className="w-64 h-64 md:w-80 md:h-80 bg-slate-50 rounded-[32px] flex-center border-4 border-slate-100 shadow-inner overflow-hidden">
                               <img src={q.imageUrl} alt="Visual" className="w-full h-full object-cover" loading="lazy" />
                             </div>
                           )}
                         </div>

                         {/* Options */}
                         {q.questionType === 'interactive' ? (
                           <div className="flex flex-col gap-4">
                             {q.interactiveType === 'sorting' ? (
                               <InteractiveSorting 
                                 items={q.interactiveData} 
                                 disabled={isReviewing} 
                                 onReorder={(newOrder) => { if (!isReviewing) handleSelect(q.id, newOrder.join(', ')); }} 
                               />
                             ) : q.interactiveType === 'matching' ? (
                               <InteractiveMatching 
                                 pairs={q.interactiveData} 
                                 disabled={isReviewing} 
                                 onMatch={(newMatches) => { if (!isReviewing) handleSelect(q.id, newMatches.join(', ')); }}
                               />
                             ) : null}
                             {isReviewing && isWrong && (
                               <div className="mt-4 p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl">
                                 <p className="text-rose-600 font-black mb-1">Correct Answer:</p>
                                 <p className="text-rose-800 font-bold text-lg">{q.answer}</p>
                               </div>
                             )}
                           </div>
                         ) : q.questionType === 'text' || !q.options || q.options.length === 0 ? (
                           <div className="flex flex-col gap-2">
                             <input 
                               type="text" 
                               value={answers[q.id] || ''}
                               onChange={(e) => { if (!isReviewing) handleSelect(q.id, e.target.value) }}
                               disabled={isReviewing}
                               className={`w-full max-w-md p-5 text-xl font-bold border-4 rounded-[20px] focus:outline-none transition-all ${isReviewing ? 'bg-slate-50 cursor-not-allowed' : 'bg-white focus:border-[#38BDF8] focus:shadow-[0_0_0_4px_rgba(56,189,248,0.2)] hover:border-slate-300'} ${isReviewing && isWrong ? 'border-rose-300 text-rose-500' : isReviewing && isCorrect ? 'border-emerald-300 text-emerald-600' : 'border-slate-200 text-slate-700'}`}
                               placeholder="Type your answer here..."
                             />
                             {isReviewing && isWrong && (
                               <p className="text-rose-500 font-bold mt-2">Correct answer: {q.answer}</p>
                             )}
                           </div>
                         ) : (
                           <div className="flex flex-col gap-3 max-w-2xl">
                             {q.options.map((opt, i) => {
                               const isSelected = answers[q.id] === opt;
                               const isCorrectOption = q.answer === opt;
                               
                               let bgClass = "bg-slate-50 hover:bg-slate-100 border-slate-200";
                               let circleClass = "border-slate-300 bg-white";
                               let textClass = "text-slate-700";

                               if (isReviewing) {
                                 if (isCorrectOption) {
                                   bgClass = "bg-emerald-50 border-emerald-500 shadow-[0_4px_0_0_#10B981]";
                                   circleClass = "border-emerald-500 bg-emerald-500 text-white";
                                   textClass = "text-emerald-800 font-bold";
                                 } else if (isSelected) {
                                   bgClass = "bg-rose-50 border-rose-300 opacity-70";
                                   circleClass = "border-rose-400 bg-rose-100";
                                   textClass = "text-rose-700 line-through";
                                 } else {
                                   bgClass = "bg-slate-50 opacity-50 border-slate-200";
                                 }
                               } else if (isSelected) {
                                 bgClass = "bg-[#EFF6FF] border-[#3B82F6] shadow-[0_4px_0_0_#2563EB]";
                                 circleClass = "border-[#3B82F6] bg-[#3B82F6]";
                                 textClass = "text-[#1E3A8A] font-bold";
                               }

                               return (
                                 <label key={opt} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${isReviewing ? 'cursor-default' : 'active:translate-y-1 active:shadow-none'} ${bgClass}`}>
                                   <input 
                                     type="radio" 
                                     name={`q-${q.id}`} 
                                     value={opt}
                                     checked={isSelected}
                                     onChange={() => { if (!isReviewing) handleSelect(q.id, opt) }}
                                     disabled={isReviewing}
                                     className="sr-only"
                                   />
                                   <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${circleClass}`}>
                                      {isSelected && !isReviewing && <div className="w-3 h-3 bg-white rounded-full" />}
                                      {isReviewing && isCorrectOption && <CheckCircle2 className="w-5 h-5 text-white" />}
                                      {isReviewing && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-rose-500" />}
                                   </div>
                                   <button 
                                      onClick={(e) => { e.preventDefault(); playTTS(opt); }}
                                      className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-500 rounded-full transition-colors shrink-0"
                                      title="Read Option Aloud"
                                    >
                                      <Volume2 className="w-4 h-4" />
                                    </button>
                                   <div className={`flex-1 text-lg leading-snug ${textClass}`}>
                                     {typeof opt === 'string' && opt.trim().startsWith('<svg') ? (
                                       <div dangerouslySetInnerHTML={{ __html: opt }} className="w-full flex justify-center overflow-hidden" />
                                     ) : (
                                       opt
                                     )}
                                   </div>
                                 </label>
                               );
                             })}
                           </div>
                         )}

                         {/* Explanation Box */}
                         {isReviewing && isWrong && wrongAnswersExplanations[q.id] && (
                           <div className="mt-6 bg-amber-50 border-2 border-amber-200 p-6 rounded-2xl">
                             <div className="flex gap-3 items-center mb-2">
                               <BrainCircuit className="w-6 h-6 text-amber-600" />
                               <span className="font-black text-amber-700 uppercase tracking-widest text-[10px]">Explanation</span>
                             </div>
                             <p className="text-amber-800 font-medium">{wrongAnswersExplanations[q.id]}</p>
                           </div>
                         )}

                       </div>
                     </div>
                   </div>
                 );
              })}
            </div>

            {/* Test Mode Footer */}
            <div className="flex justify-center mt-8">
              {isReviewing ? (
                 <button 
                   onClick={() => setIsReviewing(false)}
                   className="inline-flex items-center justify-center gap-2 rounded-full py-4 px-12 bg-white text-slate-700 border-4 border-slate-200 text-xl font-black hover:bg-slate-50 transition-all"
                 >
                   Back to Results
                 </button>
              ) : (
                 <button 
                   onClick={() => setShowSummary(true)}
                   className="inline-flex items-center justify-center gap-2 rounded-full py-5 px-16 bg-[#F97316] text-white shadow-[0_8px_0_0_#C2410C] text-2xl font-black active:translate-y-[8px] active:shadow-none transition-all hover:bg-[#EA580C]"
                 >
                   Finish Exam ✨
                 </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {homework.passage && (
              <div className="lg:w-1/2 bg-white/95 backdrop-blur-md rounded-[40px] p-8 shadow-[0_16px_0_0_rgba(255,255,255,0.6)] flex flex-col max-h-[80vh] overflow-y-auto custom-scrollbar sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="w-6 h-6 text-indigo-500" />
                  <h2 className="text-xl font-black text-slate-800">Reading Passage</h2>
                </div>
                <div className="text-lg font-medium text-slate-700 leading-relaxed space-y-4">
                  {homework.passage.split('\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
        
        <div className={homework.passage ? "lg:w-1/2 flex flex-col" : "w-full flex flex-col"}>
          <AnimatePresence mode="wait">
            {showSummary ? (
              <motion.div 
              key="summary"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="bg-white/95 backdrop-blur-md rounded-[40px] p-8 md:p-12 shadow-[0_16px_0_0_rgba(255,255,255,0.6)] flex flex-col min-h-[400px]"
            >
              <div className="flex items-center gap-3 mb-8">
                <Flag className="w-8 h-8 text-amber-500 fill-amber-500" />
                <h2 className="text-3xl font-black text-slate-800">Review Your Answers</h2>
              </div>
              <p className="text-slate-600 font-bold mb-8 text-lg">
                Before submitting, make sure you've answered all questions. You can click on any question to jump back to it.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {displayQuestions.map((q, i) => {
                   const hasAnswer = answers[q.id] !== undefined;
                   const isMarked = markedForReview[q.id];
                   return (
                     <button
                       key={q.id}
                       onClick={() => { setShowSummary(false); setCurrentIdx(i); }}
                       className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all hover:scale-105 active:scale-95 ${
                         isMarked ? 'bg-amber-50 border-amber-300' :
                         hasAnswer ? 'bg-blue-50 border-blue-300' : 'bg-slate-50 border-slate-200'
                       }`}
                     >
                       <span className="text-lg font-black text-slate-700">Q{i + 1}</span>
                       {isMarked ? (
                         <span className="text-xs font-bold px-2 py-1 bg-amber-200 text-amber-800 rounded-full flex items-center gap-1"><Flag className="w-3 h-3 fill-amber-800"/> Marked</span>
                       ) : hasAnswer ? (
                         <span className="text-xs font-bold px-2 py-1 bg-blue-200 text-blue-800 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Answered</span>
                       ) : (
                         <span className="text-xs font-bold px-2 py-1 bg-slate-200 text-slate-600 rounded-full">Empty</span>
                       )}
                     </button>
                   );
                })}
              </div>

              <div className="flex items-center gap-4 mt-auto border-t border-slate-100 pt-8">
                <button 
                  onClick={() => setShowSummary(false)}
                  className="flex-1 rounded-full py-4 px-6 bg-slate-100 text-slate-500 font-black hover:bg-slate-200 transition-colors"
                >
                  Keep Working
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 rounded-full py-4 px-6 bg-[#F97316] text-white shadow-[0_6px_0_0_#C2410C] font-black active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Submit ✨'}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key={currentIdx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="bg-white/95 backdrop-blur-md rounded-[40px] p-8 md:p-12 shadow-[0_16px_0_0_rgba(255,255,255,0.6)] flex flex-col min-h-[400px]"
            >
              {homework.type === 'lesson' ? (
              <div className="flex flex-col items-center text-center space-y-8">
                {currentQuestion.imagePrompt && (
                  <img 
                    src={`https://image.pollinations.ai/prompt/${encodeURIComponent(currentQuestion.imagePrompt)}?width=800&height=500&nologo=true`}
                    alt={currentQuestion.title}
                    className="w-full max-w-3xl h-64 md:h-[400px] object-cover rounded-[32px] shadow-lg border-4 border-purple-100"
                    loading="lazy"
                  />
                )}
                <h1 className="text-3xl md:text-5xl font-black text-purple-600 leading-snug uppercase tracking-tight">
                  {currentQuestion.title}
                </h1>
                <p className="text-xl md:text-2xl font-bold text-slate-700 leading-relaxed max-w-3xl">
                  {currentQuestion.content}
                </p>
              </div>
            ) : (
              <>
                {(() => {
                  let { text: cleanText, clockTime, inlineSvg } = parseQuestionText(currentQuestion.text);
                  const effectiveSvgCode = inlineSvg || currentQuestion.svgCode;
                  const isClockRelated = cleanText.toLowerCase().includes('clock') || cleanText.toLowerCase().includes('time');
                  
                  // If it's a clock question but the AI didn't specify a time, show a default 10:10 clock
                  if (!clockTime && isClockRelated && !currentQuestion.imageUrl && !currentQuestion.chartData && !currentQuestion.geometryData && !effectiveSvgCode) {
                    clockTime = '10:10';
                  }

                  const showImage = !!currentQuestion.imageUrl;

                  return (
                    <div className="flex flex-col gap-8 items-center md:items-start mb-10 w-full">
                      <div className="w-full">
                        <div className="flex flex-col gap-6">
                           {clockTime && (
                             <div className="w-64 h-64 md:w-80 md:h-80 mx-auto shrink-0 bg-slate-50 rounded-[32px] flex-center border-4 border-slate-100 shadow-inner">
                               <div className="transform scale-125">
                                 <ClockFace timeStr={clockTime} />
                               </div>
                             </div>
                           )}
                           {cleanText?.length > 150 ? (
                             <div className="text-lg md:text-xl font-medium text-slate-700 leading-relaxed space-y-4">
                               <div className="flex justify-start mb-2">
                                 <button 
                                   onClick={(e) => { e.preventDefault(); playTTS(cleanText); }}
                                   className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition-colors font-bold text-sm"
                                 >
                                   <Volume2 className="w-4 h-4" /> Listen to Question
                                 </button>
                               </div>
                               {cleanText.split('\n').map((paragraph, idx) => (
                                 <p key={idx}>{paragraph}</p>
                               ))}
                             </div>
                           ) : (
                             <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-4">
                               <button 
                                 onClick={(e) => { e.preventDefault(); playTTS(cleanText); }}
                                 className="mt-1 p-3 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition-colors shrink-0"
                                 title="Read Aloud"
                               >
                                 <Volume2 className="w-6 h-6" />
                               </button>
                               <h1 className="text-2xl md:text-[28px] font-black text-slate-800 leading-snug uppercase text-center md:text-left tracking-tight">
                                 {cleanText}
                               </h1>
                             </div>
                           )}
                        </div>
                      </div>

                      {/* Dynamic Visuals for Quiz */}
                      {currentQuestion.chartData && (
                        <div className="w-full">
                          <DynamicChart data={currentQuestion.chartData} />
                        </div>
                      )}
                      {currentQuestion.geometryData && (
                        <div className="w-full">
                          <DynamicGeometry data={currentQuestion.geometryData} />
                        </div>
                      )}
                      {currentQuestion.gridMapData && (
                        <div className="w-full">
                          <DynamicGridMap data={currentQuestion.gridMapData} />
                        </div>
                      )}
                      {currentQuestion.numberLineData && (
                        <div className="w-full">
                          <DynamicNumberLine data={currentQuestion.numberLineData} />
                        </div>
                      )}
                      {currentQuestion.pathData && (
                        <div className="w-full">
                          <DynamicPathMap data={currentQuestion.pathData} />
                        </div>
                      )}
                      {currentQuestion.instrumentData && (
                        <div className="w-full">
                          <DynamicInstrument data={currentQuestion.instrumentData} />
                        </div>
                      )}
                      {currentQuestion.blockData && (
                        <div className="w-full">
                          <DynamicBlockStructure data={currentQuestion.blockData} />
                        </div>
                      )}
                      {currentQuestion.earlyMathData && (
                        <div className="w-full flex justify-start">
                          <EarlyMathVisualizer data={currentQuestion.earlyMathData} />
                        </div>
                      )}
                      {effectiveSvgCode && !currentQuestion.chartData && !currentQuestion.geometryData && !currentQuestion.gridMapData && !currentQuestion.numberLineData && !currentQuestion.pathData && !currentQuestion.instrumentData && !currentQuestion.blockData && !currentQuestion.earlyMathData && (
                        <div className="w-64 h-64 md:w-80 md:h-80 shrink-0 bg-slate-50 rounded-[32px] flex-center p-4 border-4 border-slate-100 shadow-inner">
                          <div dangerouslySetInnerHTML={{ __html: effectiveSvgCode }} className="w-full h-full" />
                        </div>
                      )}
                      {showImage && !currentQuestion.chartData && !currentQuestion.geometryData && !currentQuestion.gridMapData && !currentQuestion.numberLineData && !currentQuestion.pathData && !currentQuestion.instrumentData && !currentQuestion.blockData && !currentQuestion.earlyMathData && !effectiveSvgCode && (
                        <div className="w-64 h-64 md:w-80 md:h-80 shrink-0 bg-slate-50 rounded-[32px] flex-center border-4 border-slate-100 shadow-inner overflow-hidden">
                          <img 
                            src={currentQuestion.imageUrl} 
                            alt="Question visual" 
                            className="w-full h-full object-cover" 
                            loading="lazy" 
                          />
                        </div>
                      )}
                    </div>
                  );
                })()}

            {/* Options or Text/Interactive Answer Display */}
            {homework.type !== 'lesson' && (
              <>
                {currentQuestion.options && currentQuestion.options.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8">
                    {currentQuestion.options.map((option, i) => {
                      const isSelected = answers[currentQuestion.id] === option;
                      const isCorrectOption = currentQuestion.answer === option;
                      
                      const colorStyles = [
                        "bg-[#5CD6C6] shadow-[0_6px_0_0_#3B9D91] text-[#0F766E]", // A Teal
                        "bg-[#FFDE59] shadow-[0_6px_0_0_#C9A71D] text-[#854D0E]", // B Yellow
                        "bg-[#CB99FF] shadow-[0_6px_0_0_#8C52FF] text-[#581C87]", // C Purple
                        "bg-[#FF8A65] shadow-[0_6px_0_0_#D84315] text-[#7F1D1D]"  // D Coral
                      ];
                      
                      const baseColor = colorStyles[i % 4];
                      const activeState = isSelected && !isReviewing 
                        ? "ring-4 ring-offset-4 ring-slate-800 scale-[1.02] brightness-110 z-10" 
                        : "opacity-90 hover:opacity-100 scale-100";
                      
                      let reviewState = "";
                      let showIcon = null;
  
                      if (isReviewing) {
                        if (isCorrectOption) {
                          showIcon = <CheckCircle2 className="w-8 h-8 text-white fill-emerald-500" />;
                        } else if (isSelected) {
                          reviewState = "opacity-50 grayscale";
                          showIcon = <XCircle className="w-8 h-8 text-white fill-rose-500" />;
                        } else {
                          reviewState = "opacity-50";
                        }
                      } else if (isSelected) {
                        showIcon = <CheckCircle2 className="w-8 h-8 text-slate-800 fill-white drop-shadow-md" />;
                      }
  
                      return (
                        <div key={option} className="flex gap-2">
                          <button
                            onClick={() => { if (!isReviewing) handleSelect(currentQuestion.id, option); }}
                            className={`group relative flex-1 p-5 md:p-6 text-left rounded-[24px] transition-all flex items-center justify-between ${isReviewing ? 'cursor-default' : 'active:translate-y-[6px] hover:brightness-105 active:shadow-none'} ${baseColor} ${activeState} ${reviewState}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 flex-center rounded-xl bg-white/40 shadow-inner text-xl font-black">
                                {String.fromCharCode(65 + i)}
                              </div>
                              <div className={`flex-1 text-xl font-black`}>
                                {typeof option === 'string' && option.trim().startsWith('<svg') ? (
                                  <div dangerouslySetInnerHTML={{ __html: option }} className="w-full flex justify-center overflow-hidden" />
                                ) : (
                                  option
                                )}
                              </div>
                            </div>
                            {showIcon && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                {showIcon}
                              </motion.div>
                            )}
                          </button>
                          <button 
                            onClick={(e) => { e.preventDefault(); playTTS(option); }}
                            className="w-16 flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-500 rounded-[24px] transition-colors border-2 border-transparent hover:border-blue-200"
                            title="Read Option Aloud"
                          >
                            <Volume2 className="w-6 h-6" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-8 flex flex-col gap-4">
                    <div className="p-6 bg-slate-50 border-4 border-slate-200 rounded-[24px]">
                      <h3 className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-2">Your Answer</h3>
                      <p className="text-xl font-black text-slate-700">{answers[currentQuestion.id] || "No answer provided"}</p>
                    </div>
                    {isReviewing && answers[currentQuestion.id] !== currentQuestion.answer && (
                      <div className="p-6 bg-emerald-50 border-4 border-emerald-200 rounded-[24px]">
                        <h3 className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-2">Correct Answer</h3>
                        <p className="text-xl font-black text-emerald-800">{currentQuestion.answer}</p>
                      </div>
                    )}
                  </div>
                )}

                {isReviewing && (Object.keys(answers).length > 0 ? answers[currentQuestion.id] !== currentQuestion.answer : !!wrongAnswersExplanations[currentQuestion.id]) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border-2 border-green-200 p-6 rounded-[32px] shadow-sm flex gap-4 text-left mt-6 animate-in fade-in slide-in-from-bottom-2 duration-350"
                  >
                    <div className="w-12 h-12 bg-white rounded-2xl flex-center shadow-sm shrink-0 border border-green-200">
                      <BrainCircuit className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-green-500">Smart Explanation</p>
                      <p className="text-sm font-bold text-green-700 leading-relaxed whitespace-pre-line">
                        {wrongAnswersExplanations[currentQuestion.id] || `The correct answer is "${currentQuestion.answer}".`}
                      </p>
                    </div>
                  </motion.div>
                )}
              </>
            )}
            </>
            )}
            </motion.div>
          )}
        </AnimatePresence>
        </div>
        </>
        )}
      </main>

      {/* Footer Actions - Only show in non-test mode */}
      {homework.type !== 'test' && (
        <footer className={`max-w-${homework.passage ? '7xl' : '4xl'} mx-auto w-full py-12 flex items-center justify-between shrink-0 relative z-10`}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="inline-flex items-center justify-center gap-2 rounded-full py-3.5 px-8 bg-white text-slate-500 shadow-[0_6px_0_0_#f1f2f6] disabled:opacity-30 text-base font-black active:translate-y-[6px] active:shadow-none transition-all select-none cursor-pointer hover:bg-slate-50 shrink-0"
            >
              <ChevronLeft className="w-5 h-5 shrink-0" /> back
            </button>
            
            {homework.type !== 'lesson' && !isReviewing && (
              <button
                onClick={() => {
                  setMarkedForReview(prev => {
                    const newState = { ...prev };
                    if (newState[currentQuestion.id]) {
                      delete newState[currentQuestion.id];
                    } else {
                      newState[currentQuestion.id] = true;
                    }
                    return newState;
                  });
                }}
                className={`hidden md:inline-flex items-center justify-center gap-2 rounded-full py-3.5 px-6 font-black transition-all select-none cursor-pointer border-2 shrink-0 ${
                  markedForReview[currentQuestion.id] 
                    ? 'bg-amber-100 text-amber-700 border-amber-300 shadow-[0_6px_0_0_#FCD34D] active:shadow-none active:translate-y-[6px]' 
                    : 'bg-white text-slate-400 border-slate-200 shadow-[0_6px_0_0_#f1f2f6] hover:bg-slate-50 active:shadow-none active:translate-y-[6px]'
                }`}
              >
                <Flag className={`w-5 h-5 shrink-0 ${markedForReview[currentQuestion.id] ? 'fill-amber-500 text-amber-500' : ''}`} /> 
                {markedForReview[currentQuestion.id] ? 'MARKED' : 'MARK'}
              </button>
            )}
          </div>

          {homework.type === 'lesson' ? (
            currentIdx === displayQuestions.length - 1 ? (
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-full py-4 px-10 bg-[#F97316] text-white shadow-[0_6px_0_0_#C2410C] text-lg font-black active:translate-y-[6px] active:shadow-none transition-all select-none cursor-pointer hover:bg-[#EA580C]"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Finish Lesson ✨'}
              </button>
            ) : (
              <button 
                onClick={() => setCurrentIdx(prev => Math.min(displayQuestions.length - 1, prev + 1))}
                className="inline-flex items-center justify-center gap-2 rounded-full py-4 px-10 bg-[#F97316] text-white shadow-[0_6px_0_0_#C2410C] text-lg font-black active:translate-y-[6px] active:shadow-none transition-all select-none cursor-pointer hover:bg-[#EA580C]"
              >
                NEXT PAGE <ChevronRight className="w-5 h-5 shrink-0" />
              </button>
            )
          ) : isReviewing ? (
             currentIdx === displayQuestions.length - 1 ? (
               <button 
                 onClick={() => setIsReviewing(false)} 
                 className="inline-flex items-center justify-center gap-2 rounded-full py-4 px-10 bg-[#F97316] text-white shadow-[0_6px_0_0_#C2410C] text-lg font-black active:translate-y-[6px] active:shadow-none transition-all select-none cursor-pointer hover:bg-[#EA580C]"
               >
                 finish review <CheckCircle2 className="w-5 h-5 shrink-0" />
               </button>
             ) : (
               <button 
                 onClick={() => setCurrentIdx(prev => Math.min(displayQuestions.length - 1, prev + 1))} 
                 className="inline-flex items-center justify-center gap-2 rounded-full py-4 px-10 bg-[#F97316] text-white shadow-[0_6px_0_0_#C2410C] text-lg font-black active:translate-y-[6px] active:shadow-none transition-all select-none cursor-pointer hover:bg-[#EA580C]"
               >
                 next <ChevronRight className="w-5 h-5 shrink-0" />
               </button>
             )
          ) : (
            currentIdx === displayQuestions.length - 1 ? (
              <button 
                onClick={() => {
                  if (homework.type === 'test') {
                    setShowSummary(true);
                  } else {
                    handleSubmit();
                  }
                }}
                disabled={isSubmitting || (!answers[currentQuestion.id] && homework.type !== 'test')}
                className="inline-flex items-center justify-center gap-2 rounded-full py-4 px-10 bg-[#F97316] text-white shadow-[0_6px_0_0_#C2410C] text-lg font-black active:translate-y-[6px] active:shadow-none transition-all select-none cursor-pointer hover:bg-[#EA580C] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-[0_6px_0_0_#C2410C] disabled:active:translate-y-0"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    submit mission! <Star className="w-5 h-5 text-yellow-300 fill-yellow-300 shrink-0" />
                  </>
                )}
              </button>
            ) : (
              <button 
                onClick={() => setCurrentIdx(prev => Math.min(displayQuestions.length - 1, prev + 1))}
                className="inline-flex items-center justify-center gap-2 rounded-full py-4 px-10 bg-[#F97316] text-white shadow-[0_6px_0_0_#C2410C] text-lg font-black active:translate-y-[6px] active:shadow-none transition-all select-none cursor-pointer hover:bg-[#EA580C]"
              >
                NEXT QUEST! <ChevronRight className="w-5 h-5 shrink-0" />
              </button>
            )
          )}
        </footer>
      )}
    </div>
  );
}

const QuizResults = ({ type, score, total, percentage, feedback, questions, answers, wrongAnswersExplanations, onHome, onReview, onRetake }) => {
  const isPassed = percentage >= 70;
  
  // Calculate stats by difficulty
  const getDifficulty = (q) => {
    if (q.difficulty) return q.difficulty.toLowerCase();
    const len = q.text?.length || 0;
    if (len > 120) return 'challenging';
    if (len > 60) return 'medium';
    return 'easy';
  };

  const stats = {
    easy: { total: 0, correct: 0, color: 'bg-emerald-500', bg: 'bg-emerald-100', label: 'Easy' },
    medium: { total: 0, correct: 0, color: 'bg-amber-500', bg: 'bg-amber-100', label: 'Medium' },
    challenging: { total: 0, correct: 0, color: 'bg-rose-500', bg: 'bg-rose-100', label: 'Challenging' }
  };

  questions?.forEach(q => {
    const diff = getDifficulty(q);
    if (!stats[diff]) return;
    stats[diff].total += 1;
    
    let isWrong = false;
    if (answers && Object.keys(answers).length > 0) {
      isWrong = answers[q.id] !== q.answer;
    } else {
      isWrong = wrongAnswersExplanations && !!wrongAnswersExplanations[q.id];
    }
    
    if (!isWrong) {
      stats[diff].correct += 1;
    }
  });
  
  // Mascot images for kids
  const mascotPassed = "https://image.pollinations.ai/prompt/cute%20happy%20celebrating%20astronaut%20mascot%203d%20character%20award%20winner%20vibrant%20colors%20white%20background?width=400&height=400&nologo=true";
  const mascotFailed = "https://image.pollinations.ai/prompt/cute%20determined%20little%20robot%20mascot%203d%20character%20studying%20hard%20vibrant%20colors%20white%20background?width=400&height=400&nologo=true";
  const mascotLesson = "https://image.pollinations.ai/prompt/cute%20happy%20smart%20owl%20reading%20a%20book%20mascot%203d%20character%20vibrant%20colors%20white%20background?width=400&height=400&nologo=true";

  // Score Color
  let scoreColor = "text-rose-500";
  if (percentage >= 90) scoreColor = "text-emerald-500";
  else if (percentage >= 70) scoreColor = "text-amber-500";
  else if (percentage >= 50) scoreColor = "text-blue-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#AEE6FE] via-[#FFD1FF] to-[#FAD0C4] flex-center p-4 md:p-8 relative overflow-hidden font-sans">
      {/* Floating Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-bounce" />
      <div className="absolute top-10 right-10 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-pulse" />
      <div className="absolute bottom-10 left-20 w-40 h-40 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-60" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-6xl w-full bg-white/95 backdrop-blur-xl rounded-[48px] p-8 md:p-14 text-center shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] border-8 border-white relative z-10 flex flex-col md:flex-row gap-12 md:gap-20 items-center md:items-stretch"
      >
        {/* Left Column: Mascot & Title */}
        <div className="flex-1 flex flex-col items-center justify-center relative w-full">
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-yellow-400 rounded-full flex-center animate-bounce shadow-lg rotate-12 z-20">
             <Star className="w-6 h-6 text-white fill-white" />
          </div>
          <div className="absolute top-1/4 -right-4 w-12 h-12 bg-blue-400 rounded-2xl flex-center animate-pulse shadow-lg -rotate-12 z-20">
             <Rocket className="w-6 h-6 text-white" />
          </div>

          <div className="relative mx-auto w-48 h-48 md:w-80 md:h-80 mb-8 group shrink-0">
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className={`w-full h-full flex-center rounded-full shadow-[0_0_0_8px_rgba(255,255,255,0.8)] overflow-hidden border-4 ${isPassed || type === 'lesson' ? 'border-emerald-400 bg-emerald-50' : 'border-blue-400 bg-blue-50'} relative`}
            >
              <img src={type === 'lesson' ? mascotLesson : isPassed ? mascotPassed : mascotFailed} className="w-full h-full object-cover mix-blend-multiply transform group-hover:scale-110 transition-transform duration-500" alt="Mascot" />
            </motion.div>
          </div>

          <div className="space-y-4 w-full">
            <h1 className={`text-4xl md:text-5xl font-black tracking-tight uppercase ${isPassed || type === 'lesson' ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-sm' : 'text-slate-800'}`}>
              {type === 'lesson' ? 'Lesson Complete! 🎉' : isPassed ? 'Epic Win! 🎉' : "Keep Going! 💪"}
            </h1>
            
            <div className="bg-slate-50/80 backdrop-blur-md p-4 rounded-[24px] border-2 border-dashed border-slate-200 flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left w-full transform hover:scale-[1.02] transition-transform">
              <div className={`w-12 h-12 rounded-xl flex-center shadow-inner shrink-0 ${isPassed || type === 'lesson' ? 'bg-emerald-100 text-emerald-500' : 'bg-orange-100 text-orange-500'}`}>
                 <BrainCircuit className="w-6 h-6" />
              </div>
              <div className="flex-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Teacher says...</p>
                 <h3 className="text-sm font-bold text-slate-700 leading-snug italic">"{feedback}"</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Actions */}
        <div className="flex-[1.2] flex flex-col justify-between w-full gap-8 border-t-4 md:border-t-0 md:border-l-4 border-slate-100/50 pt-8 md:pt-0 md:pl-12">
          
          {type !== 'lesson' && (
            <>
              <div className="flex items-center justify-center gap-8 md:gap-16 py-8 px-4 bg-slate-50/50 rounded-[32px] border-4 border-white shadow-inner">
                <div className="text-center">
                  <p className="text-6xl md:text-8xl font-black text-slate-800 tracking-tighter">{score}<span className="text-3xl text-slate-400">/{total}</span></p>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-2 bg-white inline-block px-4 py-1.5 rounded-full shadow-sm">Correct</p>
                </div>
                <div className="w-1 h-20 bg-slate-200 rounded-full"></div>
                <div className="text-center">
                  <p className={`text-6xl md:text-8xl font-black tracking-tighter ${scoreColor}`}>{Math.round(percentage)}%</p>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-2 bg-white inline-block px-4 py-1.5 rounded-full shadow-sm">Score</p>
                </div>
              </div>

              {/* Difficulty Breakdown */}
              <div className="w-full space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 text-left px-2">Strength Breakdown</h3>
                <div className="space-y-3">
                  {['easy', 'medium', 'challenging'].map(diff => {
                    const stat = stats[diff];
                    if (stat.total === 0) return null;
                    const pct = Math.round((stat.correct / stat.total) * 100) || 0;
                    
                    return (
                      <div key={diff} className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                        <div className={`w-12 h-12 rounded-xl flex-center shrink-0 font-black text-xs ${stat.bg} ${stat.color.replace('bg-', 'text-')}`}>
                           {pct}%
                        </div>
                        <div className="flex-1 text-left">
                           <div className="flex justify-between items-end mb-1.5">
                             <span className="text-xs font-black uppercase text-slate-700 tracking-wider">{stat.label}</span>
                             <span className="text-[10px] font-bold text-slate-400">{stat.correct}/{stat.total}</span>
                           </div>
                           <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                             <div className={`h-full rounded-full ${stat.color}`} style={{ width: `${pct}%` }} />
                           </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col gap-3 w-full mt-4">
            <div className="flex flex-col md:flex-row gap-3">
               {score < total && (
                 <button onClick={() => onReview('incorrect')} className="flex-1 bg-rose-500 hover:bg-rose-400 text-white py-4 rounded-3xl font-black text-sm md:text-base transition-all shadow-[0_4px_0_0_#be123c] active:translate-y-1 active:shadow-none flex-center gap-2">
                   Mistakes <AlertCircle className="w-4 h-4" />
                 </button>
               )}
               {score > 0 && (
                 <button onClick={() => onReview('correct')} className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white py-4 rounded-3xl font-black text-sm md:text-base transition-all shadow-[0_4px_0_0_#047857] active:translate-y-1 active:shadow-none flex-center gap-2">
                   Correct <CheckCircle2 className="w-4 h-4" />
                 </button>
               )}
            </div>
            <div className="flex gap-3">
               <button onClick={onRetake} className="flex-1 bg-[#38BDF8] hover:bg-[#0EA5E9] text-white py-4 rounded-3xl font-black text-base transition-all shadow-[0_4px_0_0_#0284C7] active:translate-y-1 active:shadow-none flex-center gap-2">
                 Play Again! <Rocket className="w-5 h-5" />
               </button>
               <button onClick={onHome} className="flex-1 bg-[#1E293B] hover:bg-[#0F172A] text-white py-4 rounded-3xl font-black text-base transition-all shadow-[0_4px_0_0_#020617] active:translate-y-1 active:shadow-none">
                 Back to Base
               </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
