import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Sparkles, HelpCircle, ArrowLeft, ArrowRight, CheckCircle, RefreshCw } from 'lucide-react';

export default function CuriousMindHub() {
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [quizScore, setQuizScore] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Sample Curious Questions
  const topics = [
    {
      id: 'goosebumps',
      title: 'Why Do Humans Get Goosebumps?',
      emoji: '🥶',
      color: 'from-amber-400 to-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-600',
      summary: 'Goosebumps are tiny reactions of your body that help protect you and keep you warm!',
      ageRange: 'Ages 6-12'
    },
    {
      id: 'rainbows',
      title: 'How are Rainbows Made in the Sky?',
      emoji: '🌈',
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-600',
      summary: 'Discover how sunlight and raindrops work together like magic prisms to paint the sky!',
      ageRange: 'Coming Soon ✨'
    },
    {
      id: 'stars',
      title: 'Why Do Stars Twinkle at Night?',
      emoji: '✨',
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      textColor: 'text-pink-600',
      summary: 'Learn how Earth\'s blanket of air plays hide-and-seek with starlight!',
      ageRange: 'Coming Soon ✨'
    }
  ];

  // Goosebumps Detailed Info
  const goosebumpsDetails = {
    title: "WHY DO HUMANS GET GOOSEBUMPS?",
    subtitle: "Goosebumps are tiny reactions of your body that help protect you and keep you warm!",
    whatAre: "Tiny bumps that appear on your skin, often with tiny hairs standing up.",
    happenWhen: [
      { id: 'cold', label: 'FEEL COLD', icon: '❄️', color: 'bg-blue-100 text-blue-800' },
      { id: 'scared', label: 'GET SCARED', icon: '👻', color: 'bg-slate-100 text-slate-800' },
      { id: 'music', label: 'LISTEN TO MUSIC', icon: '🎵', color: 'bg-orange-100 text-orange-800' },
      { id: 'emotions', label: 'STRONG EMOTIONS', icon: '⭐', color: 'bg-pink-100 text-pink-800' }
    ],
    steps: [
      {
        num: 1,
        title: "Sensing Input",
        text: "Your brain senses something cold, scary, or exciting in your surroundings.",
        illustration: "🧠"
      },
      {
        num: 2,
        title: "Sending Signal",
        text: "It sends a message through tiny pathways called nerves straight to your body.",
        illustration: "⚡"
      },
      {
        num: 3,
        title: "Reaching Muscle",
        text: "The message reaches a tiny muscle next to each hair follicle called the arrector pili muscle.",
        illustration: "🔬"
      },
      {
        num: 4,
        title: "Muscle Pulls",
        text: "The arrector pili muscle tightens up and pulls the hair follicle completely upright.",
        illustration: "💪"
      },
      {
        num: 5,
        title: "Hairs Stand Up",
        text: "The hairs stand straight up, causing the skin around them to pack together and bump up.",
        illustration: "🦔"
      },
      {
        num: 6,
        title: "Goosebumps!",
        text: "Those tiny bumps left on your skin are what we call GOOSEBUMPS! Your body is prepared!",
        illustration: "👦"
      }
    ],
    bodyReasons: [
      {
        title: "LONG AGO...",
        desc: "Our ancestors had thick body hair. Their bodies tried to trap a layer of air close to the skin to keep them warm.",
        icon: "🦔"
      },
      {
        title: "LOOK SCARIER!",
        desc: "Standing hair made our ancestors look bigger and scarier to ward off danger, just like a cat puffing up!",
        icon: "🐺"
      }
    ],
    funFacts: [
      "Everyone gets goosebumps, including you!",
      "Animals with fur also get them (you can see it in dogs and cats when they get scared!).",
      "Goosebumps usually go away in a few minutes once you feel safe or warm again."
    ],
    nextTime: "Remember, it's your amazing body working hard to protect you and help you feel everything deeply!",
    footer: "YOUR BODY IS AMAZING! It has lots of tiny, smart ways to take care of you every single day. 🌟",
    quiz: {
      question: "What is the name of the tiny muscle that pulls your hairs upright?",
      options: [
        "The Bicep Muscle 💪",
        "The Arrector Pili Muscle 🔬",
        "The Cardiac Muscle ❤️",
        "The Gluteus Muscle 🏃"
      ],
      correctIndex: 1,
      explanation: "Excellent! The arrector pili is the tiny muscle connected to each hair follicle that contracts and makes the hair stand up."
    }
  };

  const handleQuizAnswer = (index) => {
    setSelectedAnswer(index);
    setIsAnswered(true);
    if (index === goosebumpsDetails.quiz.correctIndex) {
      setQuizScore(true);
    } else {
      setQuizScore(false);
    }
  };

  const resetQuiz = () => {
    setQuizScore(null);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-orange-50 font-sans p-6 pb-20 rounded-3xl">
      <div className="max-w-6xl mx-auto">
        
        {/* Main List View */}
        <AnimatePresence mode="wait">
          {!selectedTopicId ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="inline-block bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-sm border border-amber-200"
                >
                  💡 Curious Mind Academy 💡
                </motion.div>
                
                <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-none drop-shadow-sm font-bubble">
                  Let's Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Unbelievable!</span> 🧠✨
                </h1>
                
                <p className="text-sm md:text-base text-slate-600 max-w-xl mx-auto font-medium">
                  Have you ever wondered why things happen the way they do? Click on any curious question below to unlock the secrets of our amazing world!
                </p>
              </div>

              {/* Grid of Topics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {topics.map((topic) => {
                  const isComingSoon = topic.ageRange.includes('Soon');
                  return (
                    <motion.div
                      key={topic.id}
                      whileHover={!isComingSoon ? { scale: 1.03, y: -5 } : {}}
                      whileTap={!isComingSoon ? { scale: 0.98 } : {}}
                      onClick={() => !isComingSoon && setSelectedTopicId(topic.id)}
                      className={`relative overflow-hidden rounded-3xl border-4 p-6 transition-all bg-white shadow-md ${
                        isComingSoon 
                          ? 'opacity-80 border-slate-200 cursor-not-allowed' 
                          : `${topic.borderColor} cursor-pointer hover:shadow-xl`
                      }`}
                    >
                      {/* Floating Emoji */}
                      <div className="absolute top-4 right-4 text-4xl select-none animate-bounce" style={{ animationDuration: '3s' }}>
                        {topic.emoji}
                      </div>

                      {/* Content */}
                      <div className="space-y-4 pr-12">
                        <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase">
                          {topic.ageRange}
                        </span>
                        
                        <h3 className="text-xl font-black text-slate-800 leading-tight">
                          {topic.title}
                        </h3>
                        
                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                          {topic.summary}
                        </p>

                        {!isComingSoon && (
                          <div className={`text-xs font-black flex items-center gap-1 ${topic.textColor} group`}>
                            Let's Learn! <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                          </div>
                        )}
                      </div>

                      {/* Decorative colored strip */}
                      <div className={`absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r ${topic.color}`} />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            
            // Detail View (Why do humans get goosebumps?)
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {/* Back Navigation */}
              <button
                onClick={() => {
                  setSelectedTopicId(null);
                  resetQuiz();
                }}
                className="flex items-center gap-2 bg-white border-2 border-slate-200 px-4 py-2 rounded-2xl text-xs font-black text-slate-700 hover:bg-slate-50 transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Topics
              </button>

              {/* Infographic Main Board */}
              <div className="bg-white border-4 border-orange-400 rounded-[2.5rem] shadow-xl overflow-hidden p-6 md:p-8 space-y-6 relative">
                
                {/* Rainbow corner accent */}
                <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-orange-400 via-amber-400 to-sky-400" />

                {/* Visual Infographic Sheet */}
                <div className="relative rounded-2xl overflow-hidden border-4 border-slate-100 shadow-md max-w-4xl mx-auto w-full group mt-2">
                  <img 
                    src="/curious_goosebumps.png" 
                    alt="Why Do Humans Get Goosebumps Infographic" 
                    className="w-full h-auto object-cover"
                  />
                </div>

                {/* Interactive Mini-Quiz Section */}
                <div className="border-t-4 border-dashed border-orange-100 pt-6">
                  <div className="bg-purple-50 border-4 border-purple-200 rounded-[2rem] p-6 md:p-8 space-y-6 relative overflow-hidden">
                    
                    {/* Floating star */}
                    <div className="absolute -top-4 -right-4 text-6xl text-purple-200/40 select-none font-bold">
                      ⭐
                    </div>

                    <div className="space-y-2 relative">
                      <span className="bg-purple-200 text-purple-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                        🧠 Mind Check-in Quiz!
                      </span>
                      <h4 className="text-xl font-black text-purple-950">
                        {goosebumpsDetails.quiz.question}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative">
                      {goosebumpsDetails.quiz.options.map((option, idx) => {
                        const isCorrect = idx === goosebumpsDetails.quiz.correctIndex;
                        const isSelected = idx === selectedAnswer;
                        
                        let cardStyle = "bg-white border-2 border-purple-100 hover:border-purple-300 hover:bg-purple-100/30 text-purple-900";
                        if (isAnswered) {
                          if (isCorrect) {
                            cardStyle = "bg-emerald-100 border-2 border-emerald-400 text-emerald-950 font-black";
                          } else if (isSelected) {
                            cardStyle = "bg-rose-100 border-2 border-rose-400 text-rose-950 font-black";
                          } else {
                            cardStyle = "bg-slate-50 border-2 border-slate-100 text-slate-400 opacity-60";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            disabled={isAnswered}
                            onClick={() => handleQuizAnswer(idx)}
                            className={`p-4 rounded-2xl text-xs text-left transition-all ${cardStyle} ${
                              !isAnswered ? 'active:scale-98 cursor-pointer' : 'cursor-default'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span>{option}</span>
                              {isAnswered && isCorrect && (
                                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-white/80 border-2 border-purple-100 rounded-2xl p-4 space-y-3"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{quizScore ? '🎉' : '💡'}</span>
                          <span className={`text-xs font-black ${quizScore ? 'text-emerald-700' : 'text-purple-700'}`}>
                            {quizScore ? 'Correct Answer! You\'re amazing!' : 'Nice try! Let\'s read the explanation:'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                          {goosebumpsDetails.quiz.explanation}
                        </p>
                        <button
                          onClick={resetQuiz}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1.5 px-4 rounded-xl text-[10px] transition-all active:scale-95 shadow-sm inline-block cursor-pointer"
                        >
                          Try Again!
                        </button>
                      </motion.div>
                    )}

                  </div>
                </div>

                {/* Kid-Friendly Footer Banner */}
                <div className="bg-slate-800 text-slate-100 py-4 px-6 rounded-3xl text-center border-2 border-slate-700 relative shadow-md">
                  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#fff_25%,transparent_25%,transparent_75%,#fff_75%,#fff),linear-gradient(45deg,#fff_25%,transparent_25%,transparent_75%,#fff_75%,#fff)] [background-size:20px_20px] [background-position:0_0,10px_10px]" />
                  <p className="text-xs md:text-sm font-black tracking-wide relative select-none uppercase">
                    ⭐ {goosebumpsDetails.footer} ⭐
                  </p>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
      </div>
    </div>
  );
}
