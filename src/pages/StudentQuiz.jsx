import React, { useState } from 'react';
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
  Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_QUIZ = {
  title: "addition & subtraction mastery",
  subject: "Maths",
  questions: [
    { id: 1, text: "Sarah has 45 apples. She gives 18 to Ben. How many apples does Sarah have left?", options: ["25", "27", "33", "23"], answer: "27" },
    { id: 2, text: "What is 150 + 275?", options: ["425", "375", "450", "415"], answer: "425" },
    { id: 3, text: "Which number is even?", options: ["13", "27", "44", "51"], answer: "44" },
    { id: 4, text: "If a triangle has 3 sides, how many sides do 4 triangles have?", options: ["7", "10", "12", "14"], answer: "12" },
  ]
};

export default function StudentQuiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const currentQuestion = MOCK_QUIZ.questions[currentIdx];
  const progress = ((currentIdx + 1) / MOCK_QUIZ.questions.length) * 100;

  const handleSelect = (option) => {
    if (isSubmitted) return;
    setAnswers({ ...answers, [currentQuestion.id]: option });
  };

  const handleSubmit = () => {
    let correctCount = 0;
    MOCK_QUIZ.questions.forEach(q => {
      if (answers[q.id] === q.answer) correctCount++;
    });
    setScore(correctCount);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    const percentage = (score / MOCK_QUIZ.questions.length) * 100;
    return <QuizResults score={score} total={MOCK_QUIZ.questions.length} percentage={percentage} />;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fe] p-6 md:p-12 flex flex-col relative overflow-hidden">
      {/* Playful Background Blobs */}
      <div className="blob-bg w-[500px] h-[500px] bg-primary/20 -top-64 -left-32 animate-pulse" />
      <div className="blob-bg w-[400px] h-[400px] bg-maths/20 -bottom-32 -right-32 animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Header & Progress */}
      <header className="max-w-4xl mx-auto w-full space-y-8 mb-12 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-maths text-white flex-center rounded-[20px] shadow-[0_6px_0_0_#d35400]">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight lowercase">{MOCK_QUIZ.title}</h2>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 bg-maths-soft text-maths rounded-full text-[10px] font-black uppercase tracking-widest">{MOCK_QUIZ.subject}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{MOCK_QUIZ.questions.length} questions</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-100 rounded-full shadow-tactile">
            <Timer className="w-4 h-4 text-maths" />
            <span className="text-sm font-black text-slate-700">04:12</span>
          </div>
        </div>

        <div className="relative pt-4">
          <div className="progress-track h-5 bg-white border-2 border-slate-100">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="progress-fill bg-maths shadow-[0_4px_0_0_#d35400]"
            />
          </div>
          <motion.div 
            animate={{ left: `${progress}%` }}
            className="absolute top-0 -ml-4"
          >
            <div className="w-8 h-8 bg-white border-2 border-maths rounded-full flex-center shadow-lg">
              <Rocket className="w-4 h-4 text-maths -rotate-45" />
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
                Question {currentIdx + 1} of {MOCK_QUIZ.questions.length}
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
                        ? 'border-maths bg-maths-soft shadow-[0_8px_0_0_#d35400]' 
                        : 'border-white bg-white hover:border-slate-200 shadow-[0_8px_0_0_#f1f2f6]'
                    }`}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 flex-center rounded-2xl text-lg font-black transition-all ${
                        isSelected ? 'bg-maths text-white rotate-12' : 'bg-slate-100 text-slate-400 group-hover:rotate-6'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className={`text-xl font-black ${isSelected ? 'text-maths' : 'text-slate-700'}`}>
                        {option}
                      </span>
                    </div>
                    {isSelected && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <CheckCircle2 className="w-8 h-8 text-maths" />
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

        {currentIdx === MOCK_QUIZ.questions.length - 1 ? (
          <button 
            onClick={handleSubmit}
            className="btn-bubble btn-maths px-16 text-xl"
          >
            submit exam! <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
          </button>
        ) : (
          <button 
            onClick={() => setCurrentIdx(prev => Math.min(MOCK_QUIZ.questions.length - 1, prev + 1))}
            className="btn-bubble btn-primary px-16 text-xl"
          >
            next quest! <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </footer>
    </div>
  );
}

const QuizResults = ({ score, total, percentage }) => {
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
            {isPassed ? 'awesome job!' : 'keep trying!'}
          </h1>
          <p className="text-lg text-slate-500 font-bold lowercase">You crushed the math mastery exam!</p>
        </div>

        <div className="flex items-center justify-center gap-12 py-10 bg-slate-50 rounded-[32px]">
          <div className="text-center">
            <p className="text-5xl font-black text-slate-900">{score}/{total}</p>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-2">Correct</p>
          </div>
          <div className="w-px h-16 bg-slate-200"></div>
          <div className="text-center">
            <p className="text-5xl font-black text-slate-900">{Math.round(percentage)}%</p>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-2">Accuracy</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 pt-4">
          <button className="btn-bubble bg-white border-4 border-slate-100 text-slate-500 shadow-[0_8px_0_0_#f1f2f6]" onClick={() => window.location.reload()}>try again</button>
          <button className="btn-bubble btn-primary" onClick={() => window.location.href = '/dashboard/student'}>go home</button>
        </div>
      </motion.div>
    </div>
  );
};
