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
              <div className="bg-white border-4 border-orange-400 rounded-[2.5rem] shadow-xl overflow-hidden p-6 md:p-10 space-y-8 relative">
                
                {/* Rainbow corner accent */}
                <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-orange-400 via-amber-400 to-sky-400" />

                {/* Banner Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4 border-b-4 border-dashed border-orange-100 pb-6">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">🤔</span>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Human Body Mysteries
                      </span>
                    </div>
                    
                    <h2 className="text-3xl md:text-5xl font-black text-slate-800 leading-none font-bubble">
                      WHY DO HUMANS GET <span className="text-orange-500 underline decoration-wavy decoration-amber-400">GOOSEBUMPS?</span>
                    </h2>
                    
                    <p className="text-sm text-slate-600 font-semibold max-w-xl">
                      {goosebumpsDetails.subtitle}
                    </p>
                  </div>

                  {/* Trigger List Grid */}
                  <div className="bg-slate-50 p-4 rounded-3xl border-2 border-slate-100 space-y-2 md:w-80">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block text-center">
                      GOOSEBUMPS CAN HAPPEN WHEN YOU...
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {goosebumpsDetails.happenWhen.map((item) => (
                        <div
                          key={item.id}
                          className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all hover:scale-105 ${item.color} border-current/10`}
                        >
                          <span className="text-2xl mb-1">{item.icon}</span>
                          <span className="text-[9px] font-black tracking-tight leading-tight">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Infographic Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Left Column: What are Goosebumps */}
                  <div className="lg:col-span-3 space-y-4">
                    <div className="bg-sky-50 border-4 border-sky-200 rounded-3xl p-5 space-y-4 text-center">
                      <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold shadow-sm">
                        ❓
                      </div>
                      <h4 className="text-lg font-black text-sky-800 uppercase tracking-tight">
                        What are Goosebumps?
                      </h4>
                      <p className="text-xs text-sky-900 leading-relaxed font-semibold">
                        {goosebumpsDetails.whatAre}
                      </p>

                      {/* Skin close-up simulation */}
                      <div className="relative h-28 rounded-2xl overflow-hidden border-2 border-sky-300 bg-orange-100 flex items-center justify-center shadow-inner group">
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]" />
                        
                        {/* Simulating goosebumps skin */}
                        <div className="flex gap-4 items-center justify-center">
                          {[1, 2, 3].map((i) => (
                            <motion.div
                              key={i}
                              animate={{ y: [0, -4, 0] }}
                              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.3 }}
                              className="w-4 h-4 rounded-full bg-orange-200 border border-orange-300 relative flex items-center justify-center shadow-sm"
                            >
                              <div className="w-0.5 h-6 bg-amber-800 origin-bottom transform rotate-12 -mt-4" />
                            </motion.div>
                          ))}
                        </div>
                        <span className="absolute bottom-1 right-2 text-[8px] font-black text-sky-700 bg-white/80 px-1.5 py-0.5 rounded">
                          Skin Close-up!
                        </span>
                      </div>
                    </div>

                    {/* Fun Facts card */}
                    <div className="bg-amber-50 border-4 border-amber-200 rounded-3xl p-5 space-y-3">
                      <div className="flex items-center gap-2 border-b-2 border-dashed border-amber-200 pb-2">
                        <Lightbulb className="w-5 h-5 text-amber-600" />
                        <h4 className="text-base font-black text-amber-800 uppercase tracking-tight">
                          Fun Facts!
                        </h4>
                      </div>
                      <ul className="space-y-2">
                        {goosebumpsDetails.funFacts.map((fact, idx) => (
                          <li key={idx} className="text-xs text-amber-900 font-semibold leading-relaxed flex gap-2">
                            <span>✨</span>
                            <span>{fact}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Middle Column: 6-Step Visual Process */}
                  <div className="lg:col-span-9 space-y-6">
                    <div className="bg-orange-50/50 border-4 border-orange-200 rounded-3xl p-5 md:p-6 space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-black text-orange-800 uppercase tracking-tight flex items-center gap-2">
                          <span>🔬</span> HOW DO GOOSEBUMPS HAPPEN?
                        </h4>
                        
                        {/* Steps navigator */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                            disabled={activeStep === 0}
                            className="bg-white border-2 border-orange-200 p-1.5 rounded-xl disabled:opacity-50 active:scale-90 transition-all cursor-pointer"
                          >
                            <ArrowLeft className="w-4 h-4 text-orange-600" />
                          </button>
                          <span className="text-xs font-black text-orange-800 flex items-center px-1">
                            Step {activeStep + 1} of 6
                          </span>
                          <button
                            onClick={() => setActiveStep(prev => Math.min(5, prev + 1))}
                            disabled={activeStep === 5}
                            className="bg-white border-2 border-orange-200 p-1.5 rounded-xl disabled:opacity-50 active:scale-90 transition-all cursor-pointer"
                          >
                            <ArrowRight className="w-4 h-4 text-orange-600" />
                          </button>
                        </div>
                      </div>

                      {/* Horizontal steps visual deck */}
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                        {goosebumpsDetails.steps.map((step, idx) => {
                          const isActive = idx === activeStep;
                          return (
                            <div
                              key={step.num}
                              onClick={() => setActiveStep(idx)}
                              className={`rounded-2xl p-3 border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between h-36 ${
                                isActive
                                  ? 'bg-white border-orange-400 shadow-md ring-4 ring-orange-200 scale-105'
                                  : 'bg-orange-50/60 border-orange-100 hover:bg-white hover:border-orange-200'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className={`text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center text-white ${
                                  isActive ? 'bg-orange-500' : 'bg-slate-300'
                                }`}>
                                  {step.num}
                                </span>
                              </div>
                              
                              <span className="text-3xl my-2 block select-none">
                                {step.illustration}
                              </span>
                              
                              <span className="text-[10px] font-black text-slate-800 leading-tight block">
                                {step.title}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Active step explanation text */}
                      <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border-2 border-orange-100 rounded-2xl p-4 flex gap-4 items-center"
                      >
                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-2xl font-bold shrink-0">
                          {goosebumpsDetails.steps[activeStep].illustration}
                        </div>
                        <div className="space-y-1">
                          <h5 className="text-sm font-black text-orange-900">
                            Step {goosebumpsDetails.steps[activeStep].num}: {goosebumpsDetails.steps[activeStep].title}
                          </h5>
                          <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                            {goosebumpsDetails.steps[activeStep].text}
                          </p>
                        </div>
                      </motion.div>
                    </div>

                    {/* Why does our body do this & Next time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Body reasons */}
                      <div className="bg-emerald-50 border-4 border-emerald-200 rounded-3xl p-5 space-y-4">
                        <h4 className="text-base font-black text-emerald-800 uppercase tracking-tight flex items-center gap-2 border-b-2 border-dashed border-emerald-200 pb-2">
                          <span>🦔</span> Why does our body do this?
                        </h4>
                        
                        <div className="space-y-3">
                          {goosebumpsDetails.bodyReasons.map((reason, idx) => (
                            <div key={idx} className="flex gap-3 items-start">
                              <span className="text-2xl bg-emerald-100 p-1.5 rounded-xl block shrink-0">{reason.icon}</span>
                              <div className="space-y-0.5">
                                <span className="text-[10px] font-black text-emerald-800 block uppercase">
                                  {reason.title}
                                </span>
                                <p className="text-[11px] text-emerald-950 font-semibold leading-relaxed">
                                  {reason.desc}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Next Time card */}
                      <div className="bg-pink-50 border-4 border-pink-200 rounded-3xl p-5 space-y-4 flex flex-col justify-between">
                        <div className="space-y-3">
                          <h4 className="text-base font-black text-pink-800 uppercase tracking-tight flex items-center gap-2 border-b-2 border-dashed border-pink-200 pb-2">
                            <span>❤️</span> Next time you get them...
                          </h4>
                          <p className="text-xs text-pink-950 font-semibold leading-relaxed">
                            {goosebumpsDetails.nextTime}
                          </p>
                        </div>

                        {/* Interactive mini widget */}
                        <div className="bg-white border-2 border-pink-100 rounded-2xl p-3 text-center space-y-2">
                          <span className="text-[9px] font-black text-slate-500 uppercase">
                            Expose your body knowledge!
                          </span>
                          <button
                            onClick={() => {
                              const randomStep = Math.floor(Math.random() * 6);
                              setActiveStep(randomStep);
                            }}
                            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-1.5 px-3 rounded-xl text-[10px] transition-all active:scale-95 shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" /> Roll a Random Step!
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

                {/* Interactive Mini-Quiz Section */}
                <div className="border-t-4 border-dashed border-orange-100 pt-8 mt-4">
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
