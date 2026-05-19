import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ChevronRight, 
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
  Sparkles,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { decryptText } from '../utils/crypto';

export default function StudentQuiz({ homeworkId, studentName, teacher, initialSubmission, onComplete }) {
  const [resolvedAiConfig, setResolvedAiConfig] = useState(null);
  const [homework, setHomework] = useState(null);
  
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

  const [isSubmitted, setIsSubmitted] = useState(!!initialSubmission);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState(initialSubmission ? initialSubmission.correctCount : null);
  const [feedback, setFeedback] = useState(initialSubmission ? initialSubmission.feedback : '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherAiConfig = async () => {
      if (!teacher?.uid) return;
      try {
        const teacherDoc = await getDoc(doc(db, 'teachers', teacher.uid));
        if (teacherDoc.exists()) {
          const data = teacherDoc.data();
          const activeModel = data.activeAi || 'gemini';
          let activeKey = '';
          
          if (data.encryptedAiKeys && data.encryptedAiKeys[activeModel]) {
            const code = teacher.teacherCode || data.teacherCode || teacher.uid.slice(0, 6).toUpperCase();
            activeKey = await decryptText(data.encryptedAiKeys[activeModel], code);
          }
          
          setResolvedAiConfig({
            activeModel,
            activeKey
          });
        }
      } catch (err) {
        console.error("Error fetching teacher AI config:", err);
      }
    };
    fetchTeacherAiConfig();
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
    if (Object.keys(answers).length > 0 || currentIdx > 0) {
      localStorage.setItem(`hz_draft_${studentName}_${homeworkId}`, JSON.stringify({
        answers,
        currentIdx
      }));
    }
  }, [answers, currentIdx, isSubmitted, studentName, homeworkId, loading, homework]);

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

  const currentQuestion = homework.questions[currentIdx];
  const progress = ((currentIdx + 1) / homework.questions.length) * 100;

  const handleSelect = (option) => {
    if (isSubmitted) return;
    setAnswers({ ...answers, [currentQuestion.id]: option });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let correctCount = 0;
    homework.questions.forEach(q => {
      if (answers[q.id] === q.answer) correctCount++;
    });
    
    const finalScore = Math.round((correctCount / homework.questions.length) * 100);
    setScore(correctCount);

    let aiFeedback = finalScore >= 80 
      ? "Outstanding work! You've mastered this topic. Keep it up! 🌟" 
      : finalScore >= 50 
        ? "Good effort! A bit more practice and you'll be a pro. 📚" 
        : "Don't give up! Review the core concepts and try again. 🦾";

    const activeModel = resolvedAiConfig?.activeModel || localStorage.getItem('hwz_active_ai') || 'gemini';
    const activeKey = resolvedAiConfig?.activeKey || localStorage.getItem(`hwz_${activeModel}_key`);

    if (activeKey) {
      try {
        const wrongAnswers = homework.questions.filter(q => answers[q.id] !== q.answer).map(q => `Q: ${q.text}. Student answered: ${answers[q.id]}. Correct: ${q.answer}`).join(" | ");
        const prompt = `You are an encouraging teacher. The student scored ${finalScore}% on their ${homework.subject} homework. ${wrongAnswers ? "They got these wrong: " + wrongAnswers : "They got everything perfect!"} Write a 2-sentence personalized, encouraging feedback message for the student. Do not use markdown.`;

        if (activeModel.includes('gpt') || activeModel === 'openai') {
          const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${activeKey}` },
            body: JSON.stringify({
              model: 'gpt-4o',
              messages: [{ role: 'user', content: prompt }],
              temperature: 0.7
            })
          });
          if (res.ok) {
            const data = await res.json();
            aiFeedback = data.choices[0].message.content.replace(/["']/g, '');
          }
        } else if (activeModel.includes('gemini')) {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${activeKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.7 }
            })
          });
          if (res.ok) {
            const data = await res.json();
            aiFeedback = data.candidates[0].content.parts[0].text.replace(/["']/g, '');
          }
        }
      } catch (err) {
        console.error("AI Grading Error:", err);
      }
    }
    
    setFeedback(aiFeedback);

    try {
      // Save submission to Firestore
      await addDoc(collection(db, 'submissions'), {
        homeworkId,
        studentName,
        teacherId: teacher.uid,
        classId: homework.assignedClassId || null,
        score: finalScore,
        correctCount,
        totalQuestions: homework.questions.length,
        feedback: aiFeedback,
        answers,
        submittedAt: serverTimestamp()
      });
      
      // Clean up the draft progress in localStorage
      localStorage.removeItem(`hz_draft_${studentName}_${homeworkId}`);
      
      setIsSubmitted(true);
    } catch (err) {
      console.error("Submit Error:", err);
      alert("Failed to save your result. Please contact your teacher! 🆘");
    }
    setIsSubmitting(false);
  };

  if (isSubmitted && !isReviewing) {
    return (
      <QuizResults 
        score={score} 
        total={homework.questions.length} 
        percentage={(score / homework.questions.length) * 100} 
        feedback={feedback}
        onHome={onComplete}
        onReview={() => setIsReviewing(true)}
        onRetake={() => {
           setIsSubmitted(false);
           setIsReviewing(false);
           setAnswers({});
           setCurrentIdx(0);
           setScore(null);
           setFeedback('');
           // Clean up draft on retake
           localStorage.removeItem(`hz_draft_${studentName}_${homeworkId}`);
        }}
      />
    );
  }


  return (
    <div className="min-h-screen bg-[#f8f9fe] p-6 md:p-12 flex flex-col relative overflow-hidden">
      {/* Playful Background Blobs */}
      <div className="absolute w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl -top-64 -left-32 animate-pulse pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl -bottom-32 -right-32 animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />

      {/* Header & Progress */}
      <header className="max-w-4xl mx-auto w-full space-y-8 mb-12 relative z-10">
        <div className="flex flex-col gap-4">
          <button onClick={isReviewing ? () => setIsReviewing(false) : onComplete} className="flex items-center gap-2 text-slate-400 hover:text-orange-500 w-fit font-black text-sm uppercase tracking-widest transition-colors">
            <ChevronLeft className="w-4 h-4" /> {isReviewing ? "Back to Results" : "Back to Dashboard"}
          </button>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-500 text-white flex-center rounded-[20px] shadow-[0_6px_0_0_#c2410c]">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight lowercase">{homework.title} {isReviewing && "(Review)"}</h2>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-0.5 bg-orange-50 text-orange-500 rounded-full text-[10px] font-black uppercase tracking-widest">{homework.subject}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{homework.questions.length} questions</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-100 rounded-full shadow-tactile">
              <Timer className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-black text-slate-700">04:12</span>
            </div>
          </div>
        </div>

        <div className="relative pt-4">
          <div className="progress-track h-5 bg-white border-2 border-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="progress-fill h-full bg-orange-500 shadow-[0_4px_0_0_#c2410c]"
            />
          </div>
          <motion.div 
            animate={{ left: `${progress}%` }}
            className="absolute top-0 -ml-4"
          >
            <div className="w-8 h-8 bg-white border-2 border-orange-500 rounded-full flex-center shadow-lg">
              <Rocket className="w-4 h-4 text-orange-500 -rotate-45" />
            </div>
          </motion.div>
        </div>
      </header>

      {/* Question Area */}
      <main className="max-w-3xl mx-auto w-full flex-1 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIdx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="space-y-12"
          >
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-white border-2 border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Question {currentIdx + 1} of {homework.questions.length}
              </div>
              <h1 className="text-4xl font-black text-slate-900 leading-tight">
                {currentQuestion.text}
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentQuestion.options.map((option, i) => {
                const isSelected = answers[currentQuestion.id] === option;
                const isCorrectOption = currentQuestion.answer === option;
                
                let optionClass = "border-white bg-white hover:border-slate-200 shadow-[0_8px_0_0_#f1f2f6]";
                let iconClass = "bg-slate-100 text-slate-400 group-hover:rotate-6";
                let textClass = "text-slate-700";
                let showIcon = null;

                if (isReviewing) {
                  if (isCorrectOption) {
                    optionClass = "border-emerald-500 bg-emerald-50 shadow-[0_8px_0_0_#059669]";
                    iconClass = "bg-emerald-500 text-white rotate-12";
                    textClass = "text-emerald-700";
                    showIcon = <CheckCircle2 className="w-8 h-8 text-emerald-500" />;
                  } else if (isSelected) {
                    optionClass = "border-rose-500 bg-rose-50 shadow-[0_8px_0_0_#e11d48]";
                    iconClass = "bg-rose-500 text-white rotate-12";
                    textClass = "text-rose-700";
                    showIcon = <XCircle className="w-8 h-8 text-rose-500" />;
                  } else {
                    optionClass = "border-slate-100 bg-white opacity-50";
                  }
                } else {
                  if (isSelected) {
                    optionClass = "border-orange-500 bg-orange-50 shadow-[0_8px_0_0_#c2410c]";
                    iconClass = "bg-orange-500 text-white rotate-12";
                    textClass = "text-orange-500";
                    showIcon = <CheckCircle2 className="w-8 h-8 text-orange-500" />;
                  }
                }

                return (
                  <button
                    key={option}
                    onClick={() => { if (!isReviewing) handleSelect(option); }}
                    className={`group relative p-8 text-left rounded-[32px] border-2 transition-all flex items-center justify-between overflow-hidden ${isReviewing ? 'cursor-default' : 'active:scale-[0.95]'} ${optionClass}`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 flex-center rounded-2xl text-lg font-black transition-all ${iconClass}`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className={`text-xl font-black ${textClass}`}>
                        {option}
                      </span>
                    </div>
                    {showIcon && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        {showIcon}
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Actions */}
      <footer className="max-w-4xl mx-auto w-full py-12 flex items-center justify-between shrink-0 relative z-10">
        <button 
          onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
          className="btn-bubble inline-flex items-center justify-center gap-2 rounded-[24px] py-3 px-8 bg-white border-2 border-slate-200 text-slate-500 shadow-[0_6px_0_0_#f1f2f6] disabled:opacity-30 text-base font-black active:scale-[0.98] active:translate-y-0.5 transition-all select-none cursor-pointer hover:bg-slate-50"
        >
          <ChevronLeft className="w-5 h-5 shrink-0" /> back
        </button>

        {isReviewing ? (
           currentIdx === homework.questions.length - 1 ? (
             <button 
               onClick={() => setIsReviewing(false)} 
               className="btn-bubble inline-flex items-center justify-center gap-2 rounded-[24px] py-3.5 px-12 bg-orange-500 text-white shadow-[0_8px_0_0_#c2410c] text-lg font-black active:scale-[0.98] active:translate-y-0.5 transition-all select-none cursor-pointer hover:bg-orange-400"
             >
               finish review <CheckCircle2 className="w-5 h-5 shrink-0" />
             </button>
           ) : (
             <button 
               onClick={() => setCurrentIdx(prev => Math.min(homework.questions.length - 1, prev + 1))} 
               className="btn-bubble inline-flex items-center justify-center gap-2 rounded-[24px] py-3.5 px-12 bg-orange-500 text-white shadow-[0_8px_0_0_#c2410c] text-lg font-black active:scale-[0.98] active:translate-y-0.5 transition-all select-none cursor-pointer hover:bg-orange-400"
             >
               next <ChevronRight className="w-5 h-5 shrink-0" />
             </button>
           )
        ) : (
          currentIdx === homework.questions.length - 1 ? (
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || !answers[currentQuestion.id]}
              className="btn-bubble inline-flex items-center justify-center gap-2 rounded-[24px] py-3.5 px-12 bg-orange-500 text-white shadow-[0_8px_0_0_#c2410c] text-lg font-black active:scale-[0.98] active:translate-y-0.5 transition-all select-none cursor-pointer hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
              onClick={() => setCurrentIdx(prev => Math.min(homework.questions.length - 1, prev + 1))}
              className="btn-bubble inline-flex items-center justify-center gap-2 rounded-[24px] py-3.5 px-12 bg-orange-500 text-white shadow-[0_8px_0_0_#c2410c] text-lg font-black active:scale-[0.98] active:translate-y-0.5 transition-all select-none cursor-pointer hover:bg-orange-400"
            >
              next quest! <ChevronRight className="w-5 h-5 shrink-0" />
            </button>
          )
        )}
      </footer>
    </div>
  );
}

const QuizResults = ({ score, total, percentage, feedback, onHome, onReview, onRetake }) => {
  const isPassed = percentage >= 70;

  return (
    <div className="min-h-screen bg-[#f8f9fe] flex-center p-6 relative overflow-hidden">
      <div className="blob-bg w-[600px] h-[600px] bg-orange-500/20 -top-32 -right-32 animate-pulse" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        className="card-bubble max-w-xl w-full p-16 text-center space-y-10 shadow-2xl border-none relative z-10"
      >
        <div className="relative mx-auto w-40 h-40">
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className={`w-full h-full flex-center rounded-[48px] shadow-2xl ${isPassed ? 'bg-orange-500' : 'bg-rose-500'}`}
          >
            {isPassed ? <Trophy className="w-20 h-20 text-white" /> : <AlertCircle className="w-20 h-20 text-white" />}
          </motion.div>
          <div className="absolute -top-4 -right-4 bg-yellow-400 p-4 rounded-[24px] shadow-xl border-4 border-white animate-bounce">
            <Star className="w-8 h-8 text-white fill-white" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-5xl font-black tracking-tight text-slate-900 lowercase">
            {isPassed ? 'mission cleared!' : 'keep trying!'}
          </h1>
          <div className="bg-slate-50 p-6 rounded-[32px] border-2 border-slate-100 flex gap-4 text-left">
            <div className="w-12 h-12 bg-white rounded-2xl flex-center shadow-sm shrink-0">
               <BrainCircuit className="w-6 h-6 text-orange-500" />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Smart Feedback</p>
               <h3 className="text-sm font-bold text-slate-800 leading-relaxed mt-1">{feedback}</h3>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-12 py-10 bg-slate-50 rounded-[32px]">
          <div className="text-center">
            <p className="text-5xl font-black text-slate-900">{score}/{total}</p>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-2">Correct</p>
          </div>
          <div className="w-px h-16 bg-slate-200"></div>
          <div className="text-center">
            <p className="text-5xl font-black text-slate-900">{Math.round(percentage)}%</p>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-2">Score</p>
          </div>
        </div>

        <div className="pt-4 flex flex-col gap-4">
          <div className="flex gap-4">
             <button onClick={onReview} className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-700 py-4 rounded-[24px] font-black text-lg transition-all shadow-[0_4px_0_0_#fed7aa] active:translate-y-1 active:shadow-none">Review Answers</button>
             <button onClick={onRetake} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-[24px] font-black text-lg transition-all shadow-[0_4px_0_0_#e2e8f0] active:translate-y-1 active:shadow-none">Retake Mission</button>
          </div>
          <button onClick={onHome} className="w-full bg-orange-500 hover:bg-orange-400 text-white py-4 rounded-[24px] font-black text-xl transition-all shadow-[0_6px_0_0_#c2410c] active:translate-y-1 active:shadow-none mt-2">Back to Dashboard</button>
        </div>
      </motion.div>
    </div>
  );
};
