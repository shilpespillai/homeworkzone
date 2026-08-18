import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

export default function CuriousMindHub() {
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [quizScore, setQuizScore] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Curious Questions List
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
      id: 'baby_teeth',
      title: 'Why Do Kids Lose Their Baby Teeth?',
      emoji: '🦷',
      color: 'from-blue-400 to-sky-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-600',
      summary: 'Losing baby teeth is a normal and healthy part of growing up to make space for permanent teeth!',
      ageRange: 'Ages 5-10'
    },
    {
      id: 'constipation',
      title: 'Why Do We Get Constipated?',
      emoji: '💩',
      color: 'from-emerald-400 to-teal-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-600',
      summary: 'Learn what causes constipation and how to keep your tummy happy and healthy!',
      ageRange: 'Ages 6-12'
    },
    {
      id: 'cry',
      title: 'Why Do We Cry?',
      emoji: '😢',
      color: 'from-cyan-400 to-blue-500',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      textColor: 'text-cyan-600',
      summary: 'Crying is your body\'s natural superpower! Discover types of tears and why they help us.',
      ageRange: 'Ages 5-12'
    },
    {
      id: 'forget',
      title: 'Why Do We Forget Things?',
      emoji: '🧠',
      color: 'from-pink-400 to-rose-500',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      textColor: 'text-pink-600',
      summary: 'Forgetting is normal! Learn how your brain\'s memory library works and how to remember better.',
      ageRange: 'Ages 7-12'
    },
    {
      id: 'dream',
      title: 'Why Do We Dream?',
      emoji: '💤',
      color: 'from-indigo-400 to-purple-500',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-600',
      summary: 'Dreaming is your brain\'s superpower! Find out what happens when you sleep.',
      ageRange: 'Ages 6-12'
    }
  ];

  // Dynamic Topic Details
  const TOPIC_DETAILS = {
    goosebumps: {
      image: '/curious_goosebumps.png',
      bgColor: 'border-orange-400',
      accentColor: 'from-orange-400 via-amber-400 to-sky-400',
      quizBg: 'bg-purple-50 border-purple-200',
      quizText: 'text-purple-950',
      quizBadge: 'bg-purple-200 text-purple-800',
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
    },
    baby_teeth: {
      image: '/curious_baby_teeth.png',
      bgColor: 'border-blue-400',
      accentColor: 'from-blue-400 via-sky-300 to-indigo-400',
      quizBg: 'bg-blue-50 border-blue-200',
      quizText: 'text-blue-950',
      quizBadge: 'bg-blue-200 text-blue-800',
      footer: "KEEP SMILING! Take care of your teeth today for a healthy smile tomorrow! 🪥🦷",
      quiz: {
        question: "How many baby teeth do kids have in total before they start falling out?",
        options: [
          "10 Teeth 🦷",
          "20 Teeth 🦷",
          "32 Teeth 🦷",
          "5 Teeth 🦷"
        ],
        correctIndex: 1,
        explanation: "Great job! Kids have 20 baby teeth in total (10 on the top and 10 on the bottom) which make space for their permanent teeth."
      }
    },
    constipation: {
      image: '/curious_constipation.png',
      bgColor: 'border-emerald-400',
      accentColor: 'from-emerald-400 via-teal-300 to-green-500',
      quizBg: 'bg-emerald-50 border-emerald-200',
      quizText: 'text-emerald-950',
      quizBadge: 'bg-emerald-200 text-emerald-800',
      footer: "A HAPPY TUMMY LEADS TO A HAPPY YOU! Eat well, drink water, move, and listen to your body! 🥗💦",
      quiz: {
        question: "Which organ is in charge of absorbing water from food and making poop?",
        options: [
          "The Brain 🧠",
          "The Large Intestine 💩",
          "The Heart 🫀",
          "The Stomach 🍽️"
        ],
        correctIndex: 1,
        explanation: "Correct! The Large Intestine is responsible for absorbing water from food and helping form poop."
      }
    },
    cry: {
      image: '/curious_cry.png',
      bgColor: 'border-cyan-400',
      accentColor: 'from-cyan-400 via-sky-300 to-blue-500',
      quizBg: 'bg-cyan-50 border-cyan-200',
      quizText: 'text-cyan-950',
      quizBadge: 'bg-cyan-200 text-cyan-800',
      footer: "IT'S OKAY TO CRY! It is a healthy way to take care of your heart, mind, and body. ❤️💧",
      quiz: {
        question: "What type of tears are made all the time to keep your eyes moist and healthy?",
        options: [
          "Reflex Tears 🧅",
          "Emotional Tears 😭",
          "Basal Tears 💧",
          "Stress Tears ⚡"
        ],
        correctIndex: 2,
        explanation: "Spot on! Basal tears are produced continuously by your eyes to keep them clean, moist, and protected."
      }
    },
    forget: {
      image: '/curious_forget.png',
      bgColor: 'border-pink-400',
      accentColor: 'from-pink-400 via-rose-300 to-purple-400',
      quizBg: 'bg-pink-50 border-pink-200',
      quizText: 'text-pink-950',
      quizBadge: 'bg-pink-200 text-pink-800',
      footer: "FORGETTING IS NORMAL! It's your brain's smart way of making space and staying focused. 🧠📚",
      quiz: {
        question: "How long does Sensory Memory usually last in your brain?",
        options: [
          "A few minutes ⏱️",
          "A few hours ⏱️",
          "A few seconds ⏱️",
          "Forever! ⏱️"
        ],
        correctIndex: 2,
        explanation: "Correct! Sensory memory only holds onto sights and sounds for a few seconds before letting them go to prevent overload."
      }
    },
    dream: {
      image: '/curious_dream.png',
      bgColor: 'border-indigo-400',
      accentColor: 'from-indigo-400 via-purple-300 to-pink-500',
      quizBg: 'bg-indigo-50 border-indigo-200',
      quizText: 'text-indigo-950',
      quizBadge: 'bg-indigo-200 text-indigo-800',
      footer: "DREAMS ARE YOUR BRAIN'S SUPERPOWER! They help you learn, grow, and be the best YOU. 🌟💤",
      quiz: {
        question: "During which stage of sleep do we dream the most?",
        options: [
          "Deep Sleep 💤",
          "Light Sleep ⏰",
          "REM Sleep 🧠",
          "Waking Up 👁️"
        ],
        correctIndex: 2,
        explanation: "Correct! REM (Rapid Eye Movement) sleep is when your brain is very active, and that's when you have most of your vivid dreams!"
      }
    }
  };

  const handleQuizAnswer = (index, currentDetails) => {
    setSelectedAnswer(index);
    setIsAnswered(true);
    if (index === currentDetails.quiz.correctIndex) {
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

  // Get active details
  const activeDetails = selectedTopicId ? TOPIC_DETAILS[selectedTopicId] : null;

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
                  return (
                    <motion.div
                      key={topic.id}
                      whileHover={{ scale: 1.03, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTopicId(topic.id)}
                      className={`relative overflow-hidden rounded-3xl border-4 p-6 transition-all bg-white shadow-md ${topic.borderColor} cursor-pointer hover:shadow-xl`}
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

                        <div className={`text-xs font-black flex items-center gap-1 ${topic.textColor} group`}>
                          Let's Learn! <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>

                      {/* Decorative colored strip */}
                      <div className={`absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r ${topic.color}`} />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            
            // Detail View (Goosebumps, Teeth, Constipation, Cry, Forget, Dream)
            activeDetails && (
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
                <div className={`bg-white border-4 ${activeDetails.bgColor} rounded-[2.5rem] shadow-xl overflow-hidden p-6 md:p-8 space-y-6 relative`}>
                  
                  {/* Rainbow corner accent */}
                  <div className={`absolute top-0 left-0 right-0 h-3 bg-gradient-to-r ${activeDetails.accentColor}`} />

                  {/* Visual Infographic Sheet */}
                  <div className="relative rounded-2xl overflow-hidden border-4 border-slate-100 shadow-md max-w-4xl mx-auto w-full group mt-2">
                    <img 
                      src={activeDetails.image} 
                      alt="Curious Mind Infographic" 
                      className="w-full h-auto object-cover"
                    />
                  </div>

                  {/* Interactive Mini-Quiz Section */}
                  <div className="border-t-4 border-dashed border-orange-100 pt-6">
                    <div className={`${activeDetails.quizBg} border-4 rounded-[2rem] p-6 md:p-8 space-y-6 relative overflow-hidden`}>
                      
                      {/* Floating star */}
                      <div className="absolute -top-4 -right-4 text-6xl text-purple-200/40 select-none font-bold">
                        ⭐
                      </div>

                      <div className="space-y-2 relative">
                        <span className={`${activeDetails.quizBadge} text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider`}>
                          🧠 Mind Check-in Quiz!
                        </span>
                        <h4 className={`text-xl font-black ${activeDetails.quizText}`}>
                          {activeDetails.quiz.question}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative">
                        {activeDetails.quiz.options.map((option, idx) => {
                          const isCorrect = idx === activeDetails.quiz.correctIndex;
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
                              onClick={() => handleQuizAnswer(idx, activeDetails)}
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
                            {activeDetails.quiz.explanation}
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
                      ⭐ {activeDetails.footer} ⭐
                    </p>
                  </div>

                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
        
      </div>
    </div>
  );
}
