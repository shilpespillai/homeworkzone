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
  Loader2,
  Paperclip,
  Sparkles,
  Upload,
  Copy,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { playSuccess, playFail } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { fetchWithRetry, generateContent } from '../utils/aiClient';

export default function StudentQuiz({ homeworkId, studentName, teacher, initialSubmission, onComplete }) {
  const [activeModel, setActiveModel] = useState('gemini');
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
      setSecondsSpent(prev => prev + 1);
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
    if (Object.keys(answers).length > 0 || currentIdx > 0 || secondsSpent > 0) {
      localStorage.setItem(`hz_draft_${studentName}_${homeworkId}`, JSON.stringify({
        answers,
        currentIdx,
        secondsSpent
      }));
    }
  }, [answers, currentIdx, secondsSpent, isSubmitted, studentName, homeworkId, loading, homework]);

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

    const wrongQuestions = homework.questions.filter(q => answers[q.id] !== q.answer);
    let explanations = {};

    // ── FAST PATH: use pre-generated explanations stored on the homework ──
    // These were generated once at homework creation time (teacher side).
    // Zero API calls needed from the student side.
    const preGenerated = homework.questionExplanations;

    if (preGenerated && Object.keys(preGenerated).length > 0) {
      try {
        // Just generate a short personalized feedback sentence — small, cheap, student-specific
        const feedbackPrompt = `A student scored ${finalScore}% on a ${homework.subject} quiz titled "${homework.title}". Write exactly 2 short encouraging sentences of feedback for the student. Be warm and age-appropriate. Return plain text only, no JSON, no markdown.`;
        const feedbackText = await generateContent({
          prompt: feedbackPrompt,
          responseMimeType: 'text/plain',
          provider: activeModel
        });
        if (feedbackText && feedbackText.trim()) {
          aiFeedback = feedbackText.replace(/['"]/g, '').trim();
        }
      } catch (err) {
        console.warn('[StudentQuiz] Personalized feedback generation failed (non-fatal):', err);
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
      // This keeps full backward compatibility.
      try {
        const wrongAnswersFormatted = wrongQuestions.map((q) => {
          return `ID: ${q.id}\nQuestion: "${q.text}"\nOptions: ${JSON.stringify(q.options)}\nCorrect Answer: "${q.answer}"\nStudent Selected: "${answers[q.id]}"`;
        }).join("\n\n");

        let mathInstruction = "";
        if (homework.subject?.toLowerCase() === 'maths' || homework.subject?.toLowerCase() === 'math') {
          mathInstruction = `CRITICAL: Since this is a Math homework, do NOT write the explanation as a single prose paragraph. Instead, format it as a clear, step-by-step mathematical calculation showing the formulas and substitutions. Break down each step on a new line (use \\n for line breaks) so it looks like a clean calculation.\nExample structure:\nStep 1: Identify the values: ...\nStep 2: Add/Subtract the values: ...\nStep 3: Find the final answer: ...`;
        }

        const combinedPrompt = `You are an encouraging and clear teacher. A student scored ${finalScore}% on their ${homework.subject} homework (quiz title: "${homework.title}").\n\nFirst, write a 2-sentence personalized, encouraging feedback message for the student. Do not use markdown in this feedback message.\nSecond, for each of the wrong questions below, write a friendly and detailed explanation explaining why the correct option is the right answer and clarifying any confusion. Keep the tone encouraging, warm, and appropriate for students.\n\nCRITICAL ACCURACY & QUALITY RULES:\n1. Every mathematical calculation, formula, explanation, scientific fact, or grammatical definition must be 100% correct. Double-check all explanations for factual and computational accuracy.\n2. The explanation must directly justify why the correct option is the only correct answer.\n\n${mathInstruction}\n\nWrong questions:\n${wrongAnswersFormatted || "None! The student got a perfect score!"}\n\nReturn ONLY a valid JSON object matching this schema. Do not include markdown code block formatting (such as \`\`\`json).\nCRITICAL: The keys in the "explanations" object MUST be the exact, literal question IDs provided in the "Wrong questions" list (for example, if the question ID is "1", the key MUST be "1" exactly). Do not add any prefix, suffix, or extra words to the keys.\n\nSchema:\n{\n  "feedback": "Encouraging feedback message...",\n  "explanations": {\n    "INSERT_EXACT_QUESTION_ID_HERE": "Explanation for that specific question..."\n  }\n}`;

        const resultText = await generateContent({
          prompt: combinedPrompt,
          responseMimeType: 'application/json',
          provider: activeModel
        });

        if (resultText) {
          const cleanJson = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanJson);
          if (parsed.feedback) {
            aiFeedback = parsed.feedback.replace(/['"]/g, '');
          }
          if (parsed.explanations) {
            explanations = parsed.explanations;
          }
        }
      } catch (err) {
        console.error("AI grading/explanations execution failed:", err);
      }
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

    setWrongAnswersExplanations(explanations);
    setFeedback(aiFeedback);

    try {
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
        wrongAnswersExplanations: explanations,
        timeSpent: secondsSpent,
        submittedAt: serverTimestamp()
      });
      
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
           setWrongAnswersExplanations({});
           // Clean up draft on retake
           localStorage.removeItem(`hz_draft_${studentName}_${homeworkId}`);
        }}
      />
    );
  }


  return (
    <div className="min-h-screen bg-[#AEE6FE] p-6 md:p-8 flex flex-col relative overflow-hidden font-sans">
      {/* Planetary Adventure Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {/* Floating Emojis */}
        <div className="absolute top-[10%] left-[5%] md:left-[8%] text-[80px] md:text-[140px] opacity-80 transform -rotate-12 animate-[bounce_5s_ease-in-out_infinite]">🪐</div>
        <div className="absolute top-[15%] right-[5%] md:right-[10%] text-[90px] md:text-[150px] opacity-90 transform rotate-12 animate-[bounce_6s_ease-in-out_infinite]">🚀</div>
        <div className="absolute top-[60%] right-[2%] md:right-[5%] text-[80px] md:text-[140px] opacity-80 transform rotate-[15deg] animate-[bounce_7s_ease-in-out_infinite]">🌍</div>
        <div className="absolute bottom-[20%] left-[5%] md:left-[10%] text-[80px] md:text-[130px] opacity-70 transform -rotate-[10deg] animate-[bounce_8s_ease-in-out_infinite]">🛸</div>
        
        {/* Cute Stars (some with faces) */}
        <div className="absolute top-[8%] left-[40%] text-[50px] md:text-[80px] opacity-90 animate-pulse">⭐</div>
        <div className="absolute top-[25%] right-[20%] text-[40px] md:text-[70px] opacity-80 animate-pulse" style={{ animationDelay: '1s' }}>🌟</div>
        <div className="absolute bottom-[30%] left-[20%] md:left-[25%] text-[50px] md:text-[80px] opacity-90 animate-pulse" style={{ animationDelay: '0.5s' }}>⭐</div>
        <div className="absolute top-[45%] left-[2%] md:left-[5%] text-[30px] md:text-[50px] opacity-70 animate-pulse">✨</div>
        <div className="absolute bottom-[10%] right-[25%] md:right-[30%] text-[50px] md:text-[80px] opacity-80 animate-pulse" style={{ animationDelay: '1.5s' }}>🌟</div>
        
        {/* Confetti & Small elements */}
        <div className="absolute top-[20%] right-[35%] w-3 h-3 bg-pink-400 rounded-sm rotate-45 opacity-80" />
        <div className="absolute bottom-[35%] right-[15%] w-2 h-4 bg-emerald-400 rounded-full -rotate-12 opacity-80" />
        <div className="absolute top-[50%] left-[15%] w-4 h-4 bg-purple-400 rounded-full opacity-80" />
        <div className="absolute top-[15%] left-[30%] w-2 h-5 bg-yellow-400 rounded-sm rotate-[30deg] opacity-70" />
        <div className="absolute bottom-[25%] right-[5%] w-3 h-3 bg-blue-400 rounded-full opacity-70" />

        {/* Faint Math Symbols & Percentages */}
        <span className="absolute top-[18%] right-[45%] text-blue-500/20 font-black text-2xl rotate-12">5%</span>
        <span className="absolute bottom-[40%] left-[18%] text-blue-500/20 font-black text-3xl -rotate-12">%</span>
        <span className="absolute top-[35%] left-[8%] text-blue-500/10 font-black text-5xl rotate-45">+</span>
        <span className="absolute bottom-[15%] right-[12%] text-blue-500/10 font-black text-5xl -rotate-12">×</span>
        <span className="absolute top-[50%] right-[20%] text-blue-500/10 font-black text-4xl rotate-12">÷</span>
      </div>

      {/* Header & Progress */}
      <header className="max-w-5xl mx-auto w-full mb-8 relative z-10">
        <div className="flex justify-between items-center mb-4 px-4">
          <button onClick={isReviewing ? () => setIsReviewing(false) : onComplete} className="flex items-center gap-3 text-slate-700 hover:text-slate-900 font-black text-xs uppercase tracking-widest transition-colors">
            <ChevronLeft className="w-5 h-5" /> 
            <div className="flex flex-col text-left leading-tight">
              <span>{isReviewing ? "BACK TO RESULTS" : "BACK TO DASHBOARD"}</span>
              <span className="text-[9px] text-slate-500">BACK TO HOMEWORK ZONE!</span>
            </div>
          </button>
          
          <div className="flex items-center gap-2">
             <button className="w-10 h-10 rounded-full bg-slate-500/20 text-slate-600 flex-center hover:bg-slate-500/30 transition-colors"><Upload className="w-5 h-5" /></button>
             <button className="w-10 h-10 rounded-full bg-slate-500/20 text-slate-600 flex-center hover:bg-slate-500/30 transition-colors"><Copy className="w-5 h-5" /></button>
             <button className="w-10 h-10 rounded-full bg-slate-500/20 text-slate-600 flex-center hover:bg-slate-500/30 transition-colors"><Download className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-[32px] p-6 shadow-[0_8px_0_0_rgba(255,255,255,0.6)]">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-[#F97316] text-white flex-center rounded-2xl shadow-[0_4px_0_0_#C2410C] shrink-0">
              <Sparkles className="w-7 h-7" />
            </div>
            
            <div className="text-center flex-1 px-4">
               <h2 className="text-3xl font-black text-[#F97316] uppercase tracking-tight">{homework.title} {isReviewing && "(REVIEW)"}</h2>
               <p className="text-[#F97316] font-bold text-sm tracking-[0.2em] uppercase mt-0.5">ADVENTURE QUEST</p>
               <p className="text-slate-700 font-black text-sm uppercase tracking-widest mt-3">{homework.subject} - {homework.questions.length} QUESTIONS</p>
            </div>

            <div className="bg-[#B45309] p-1.5 rounded-[20px] shadow-[0_4px_0_0_#78350F] shrink-0">
              <div className="bg-[#FDE68A] border-2 border-[#D97706] rounded-xl px-4 py-2 flex items-center gap-2 shadow-inner">
                 <Timer className="w-5 h-5 text-[#B45309]" />
                 <span className="font-black text-[#B45309] tracking-wider text-lg">{formatTime(secondsSpent)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 px-2">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest shrink-0 whitespace-nowrap">
              QUESTION {currentIdx + 1} OF {homework.questions.length}
            </span>
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
        </div>
      </header>

      {/* Question Area */}
      <main className="max-w-4xl mx-auto w-full flex-1 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIdx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="bg-white rounded-[32px] p-6 md:p-10 shadow-[0_8px_0_0_rgba(255,255,255,0.6)]"
          >
            {/* Question Text & Image */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-[24px] overflow-hidden shrink-0 shadow-inner bg-slate-50 flex-center">
                <img 
                  src={`https://image.pollinations.ai/prompt/${encodeURIComponent('cute cartoon illustration ' + (currentQuestion.imagePrompt || currentQuestion.text).substring(0, 60))}?width=400&height=400&nologo=true`}
                  alt="Question illustration"
                  className="w-full h-full object-cover mix-blend-multiply"
                  loading="lazy"
                  onError={(e) => { e.target.src = 'https://api.dicebear.com/7.x/shapes/svg?seed=' + currentQuestion.id; }}
                />
              </div>
              <h1 className="text-2xl md:text-[28px] font-black text-slate-800 leading-snug uppercase text-center md:text-left tracking-tight">
                {currentQuestion.text}
              </h1>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                const activeState = isSelected && !isReviewing ? "ring-4 ring-offset-2 ring-white" : "";
                
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
                }

                return (
                  <button
                    key={option}
                    onClick={() => { if (!isReviewing) handleSelect(option); }}
                    className={`group relative p-5 md:p-6 text-left rounded-[24px] transition-all flex items-center justify-between ${isReviewing ? 'cursor-default' : 'active:translate-y-[6px] hover:brightness-105 active:shadow-none'} ${baseColor} ${activeState} ${reviewState}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex-center rounded-xl bg-white/40 shadow-inner text-xl font-black">
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className={`text-xl font-black`}>
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

            {isReviewing && answers[currentQuestion.id] !== currentQuestion.answer && (
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
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Actions */}
      <footer className="max-w-4xl mx-auto w-full py-12 flex items-center justify-between shrink-0 relative z-10">
        <button 
          onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
          className="inline-flex items-center justify-center gap-2 rounded-full py-3.5 px-8 bg-white text-slate-500 shadow-[0_6px_0_0_#f1f2f6] disabled:opacity-30 text-base font-black active:translate-y-[6px] active:shadow-none transition-all select-none cursor-pointer hover:bg-slate-50"
        >
          <ChevronLeft className="w-5 h-5 shrink-0" /> back
        </button>

        {isReviewing ? (
           currentIdx === homework.questions.length - 1 ? (
             <button 
               onClick={() => setIsReviewing(false)} 
               className="inline-flex items-center justify-center gap-2 rounded-full py-4 px-10 bg-[#F97316] text-white shadow-[0_6px_0_0_#C2410C] text-lg font-black active:translate-y-[6px] active:shadow-none transition-all select-none cursor-pointer hover:bg-[#EA580C]"
             >
               finish review <CheckCircle2 className="w-5 h-5 shrink-0" />
             </button>
           ) : (
             <button 
               onClick={() => setCurrentIdx(prev => Math.min(homework.questions.length - 1, prev + 1))} 
               className="inline-flex items-center justify-center gap-2 rounded-full py-4 px-10 bg-[#F97316] text-white shadow-[0_6px_0_0_#C2410C] text-lg font-black active:translate-y-[6px] active:shadow-none transition-all select-none cursor-pointer hover:bg-[#EA580C]"
             >
               next <ChevronRight className="w-5 h-5 shrink-0" />
             </button>
           )
        ) : (
          currentIdx === homework.questions.length - 1 ? (
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || !answers[currentQuestion.id]}
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
              onClick={() => setCurrentIdx(prev => Math.min(homework.questions.length - 1, prev + 1))}
              className="inline-flex items-center justify-center gap-2 rounded-full py-4 px-10 bg-[#F97316] text-white shadow-[0_6px_0_0_#C2410C] text-lg font-black active:translate-y-[6px] active:shadow-none transition-all select-none cursor-pointer hover:bg-[#EA580C]"
            >
              NEXT QUEST! <ChevronRight className="w-5 h-5 shrink-0" />
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
