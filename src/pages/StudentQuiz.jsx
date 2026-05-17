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
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAI } from '../context/AIContext';

export default function StudentQuiz({ homeworkId, studentName, teacher, onComplete }) {
  const [homework, setHomework] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const { apiKey, model } = useAI();

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

  if (loading) {
    return (
      <div className="min-h-screen flex-center bg-[#F9F9FF]">
        <div className="flex flex-col items-center gap-6">
          <Rocket className="w-16 h-16 text-[#8A70FF] animate-bounce" />
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

    if (apiKey) {
      try {
        const wrongAnswers = homework.questions.filter(q => answers[q.id] !== q.answer).map(q => `Q: ${q.text}. Student answered: ${answers[q.id]}. Correct: ${q.answer}`).join(" | ");
        const prompt = `You are an encouraging teacher. The student scored ${finalScore}% on their ${homework.config.subject} homework. ${wrongAnswers ? "They got these wrong: " + wrongAnswers : "They got everything perfect!"} Write a 2-sentence personalized, encouraging feedback message for the student. Do not use markdown.`;

        if (model.includes('gpt')) {
          const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
              model: model,
              messages: [{ role: 'user', content: prompt }],
              temperature: 0.7
            })
          });
          if (res.ok) {
            const data = await res.json();
            aiFeedback = data.choices[0].message.content.replace(/["']/g, '');
          }
        } else if (model.includes('gemini')) {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
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
        score: finalScore,
        correctCount,
        totalQuestions: homework.questions.length,
        feedback: aiFeedback,
        answers,
        submittedAt: serverTimestamp()
      });
      
      setIsSubmitted(true);
    } catch (err) {
      console.error("Submit Error:", err);
      alert("Failed to save your result. Please contact your teacher! 🆘");
    }
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <QuizResults 
        score={score} 
        total={homework.questions.length} 
        percentage={(score / homework.questions.length) * 100} 
        feedback={feedback}
        onHome={onComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fe] p-6 md:p-12 flex flex-col relative overflow-hidden">
      {/* Playful Background Blobs */}
      <div className="blob-bg w-[500px] h-[500px] bg-primary/20 -top-64 -left-32 animate-pulse" />
      <div className="blob-bg w-[400px] h-[400px] bg-blue-500/10 -bottom-32 -right-32 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Header & Progress */}
      <header className="max-w-4xl mx-auto w-full space-y-8 mb-12 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#8A70FF] text-white flex-center rounded-[20px] shadow-[0_6px_0_0_#6D28D9]">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight lowercase">{homework.title}</h2>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 bg-purple-50 text-[#8A70FF] rounded-full text-[10px] font-black uppercase tracking-widest">{homework.config.subject}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{homework.questions.length} questions</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-100 rounded-full shadow-tactile">
            <Timer className="w-4 h-4 text-[#8A70FF]" />
            <span className="text-sm font-black text-slate-700">04:12</span>
          </div>
        </div>

        <div className="relative pt-4">
          <div className="progress-track h-5 bg-white border-2 border-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="progress-fill h-full bg-[#8A70FF] shadow-[0_4px_0_0_#6D28D9]"
            />
          </div>
          <motion.div 
            animate={{ left: `${progress}%` }}
            className="absolute top-0 -ml-4"
          >
            <div className="w-8 h-8 bg-white border-2 border-[#8A70FF] rounded-full flex-center shadow-lg">
              <Rocket className="w-4 h-4 text-[#8A70FF] -rotate-45" />
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
                return (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    className={`group relative p-8 text-left rounded-[32px] border-2 transition-all active:scale-[0.95] flex items-center justify-between overflow-hidden ${
                      isSelected 
                        ? 'border-[#8A70FF] bg-purple-50 shadow-[0_8px_0_0_#6D28D9]' 
                        : 'border-white bg-white hover:border-slate-200 shadow-[0_8px_0_0_#f1f2f6]'
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 flex-center rounded-2xl text-lg font-black transition-all ${
                        isSelected ? 'bg-[#8A70FF] text-white rotate-12' : 'bg-slate-100 text-slate-400 group-hover:rotate-6'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className={`text-xl font-black ${isSelected ? 'text-[#8A70FF]' : 'text-slate-700'}`}>
                        {option}
                      </span>
                    </div>
                    {isSelected && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <CheckCircle2 className="w-8 h-8 text-[#8A70FF]" />
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
          className="btn-bubble bg-white border-2 border-slate-100 text-slate-400 shadow-[0_6px_0_0_#f1f2f6] disabled:opacity-30"
        >
          <ChevronLeft className="w-6 h-6" /> back
        </button>

        {currentIdx === homework.questions.length - 1 ? (
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || !answers[currentQuestion.id]}
            className="btn-bubble btn-primary px-16 text-xl shadow-[0_8px_0_0_#6D28D9]"
          >
            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>submit mission! <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" /></>}
          </button>
        ) : (
          <button 
            onClick={() => setCurrentIdx(prev => Math.min(homework.questions.length - 1, prev + 1))}
            className="btn-bubble btn-primary px-16 text-xl shadow-[0_8px_0_0_#6D28D9]"
          >
            next quest! <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </footer>
    </div>
  );
}

const QuizResults = ({ score, total, percentage, feedback, onHome }) => {
  const isPassed = percentage >= 70;

  return (
    <div className="min-h-screen bg-[#f8f9fe] flex-center p-6 relative overflow-hidden">
      <div className="blob-bg w-[600px] h-[600px] bg-accent/20 -top-32 -right-32 animate-pulse" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        className="card-bubble max-w-xl w-full p-16 text-center space-y-10 shadow-2xl border-none relative z-10"
      >
        <div className="relative mx-auto w-40 h-40">
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className={`w-full h-full flex-center rounded-[48px] shadow-2xl ${isPassed ? 'bg-accent' : 'bg-rose-500'}`}
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
               <BrainCircuit className="w-6 h-6 text-[#8A70FF]" />
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Feedback</p>
               <p className="text-sm font-bold text-slate-600 italic">"{feedback}"</p>
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

        <div className="pt-4">
          <button className="btn-bubble btn-primary w-full text-xl" onClick={onHome}>Back to Dashboard</button>
        </div>
      </motion.div>
    </div>
  );
};
