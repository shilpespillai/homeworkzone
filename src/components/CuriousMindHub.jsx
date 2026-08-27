import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

export default function CuriousMindHub() {
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [quizScore, setQuizScore] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Logical Categories matching curriculum roadmap
  const CATEGORIES = [
    { id: 'all', label: 'All Topics', icon: '🌟', color: 'bg-amber-100 text-amber-900 border-amber-300' },
    { id: 'human_body', label: 'Human Body', icon: '🫀', color: 'bg-rose-100 text-rose-900 border-rose-300' },
    { id: 'brain_sleep', label: 'Brain, Sleep & Emotions', icon: '🧠', color: 'bg-purple-100 text-purple-900 border-purple-300' },
    { id: 'animals', label: 'Animals', icon: '🐾', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    { id: 'plants', label: 'Plants', icon: '🌿', color: 'bg-green-100 text-green-900 border-green-300' },
    { id: 'space', label: 'Space', icon: '🚀', color: 'bg-blue-100 text-blue-900 border-blue-300' },
    { id: 'earth_weather', label: 'Earth & Weather', icon: '🌍', color: 'bg-cyan-100 text-cyan-900 border-cyan-300' },
    { id: 'physics_everyday', label: 'Physics & Everyday Science', icon: '⚡', color: 'bg-yellow-100 text-yellow-900 border-yellow-300' },
    { id: 'food_chemistry', label: 'Food & Chemistry', icon: '🧪', color: 'bg-teal-100 text-teal-900 border-teal-300' },
    { id: 'technology', label: 'Technology', icon: '🤖', color: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
    { id: 'fun_surprising', label: 'Fun & Surprising', icon: '✨', color: 'bg-pink-100 text-pink-900 border-pink-300' }
  ];

  // Helper to render "Unbelievable!" in playful colors matching mockup
  const renderColorfulText = (text) => {
    const colors = [
      'text-orange-500', 'text-amber-500', 'text-emerald-500', 
      'text-sky-500', 'text-indigo-500', 'text-purple-500', 'text-pink-500'
    ];
    return text.split('').map((char, index) => {
      const colorClass = colors[index % colors.length];
      return (
        <span key={index} className={colorClass}>
          {char}
        </span>
      );
    });
  };

  // Topics mapped to logical groups
  const topics = [
    {
      id: 'goosebumps',
      title: 'Why Do Humans Get Goosebumps?',
      category: 'human_body',
      cardImage: '/curious_whole_goosebumps.png'
    },
    {
      id: 'baby_teeth',
      title: 'Why Do Kids Lose Their Baby Teeth?',
      category: 'human_body',
      cardImage: '/curious_whole_teeth.png'
    },
    {
      id: 'constipation',
      title: 'Why Do We Get Constipated?',
      category: 'human_body',
      cardImage: '/curious_whole_constipation.png'
    },
    {
      id: 'blink',
      title: 'Why Do We Blink So Much?',
      category: 'human_body',
      cardImage: '/curious_whole_blink.png'
    },
    {
      id: 'cuts',
      title: 'Why Do Cuts Bleed?',
      category: 'human_body',
      cardImage: '/curious_whole_cuts.png'
    },
    {
      id: 'cry',
      title: 'Why Do We Cry?',
      category: 'brain_sleep',
      cardImage: '/curious_whole_cry.png'
    },
    {
      id: 'forget',
      title: 'Why Do We Forget Things?',
      category: 'brain_sleep',
      cardImage: '/curious_whole_forget.jpg'
    },
    {
      id: 'dream',
      title: 'Why Do We Dream?',
      category: 'brain_sleep',
      cardImage: '/curious_whole_dream.jpg'
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
      image: '/curious_forget.jpg',
      bgColor: 'border-pink-400',
      accentColor: 'from-pink-400 via-rose-300 to-purple-400',
      quizBg: 'bg-pink-50 border-pink-200',
      quizText: 'text-pink-950',
      quizBadge: 'bg-pink-200 text-pink-800',
      footer: "FORGETTING IS NORMAL! It's your brain's smart way of making space and staying focused. 🧠📚",
      quiz: {
        question: "What two things give your brain time to organize and strengthen new memories?",
        options: [
          "Running fast and shouting 🏃",
          "Practice, repetition, and sleep 💤",
          "Drinking fizzy drinks 🥤",
          "Watching TV all night 📺"
        ],
        correctIndex: 1,
        explanation: "Spot on! Practice, repetition, and quality sleep give your brain the time and connections it needs to strengthen memories."
      }
    },
    dream: {
      image: '/curious_dream.jpg',
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
    },
    blink: {
      image: '/curious_blink.jpg',
      bgColor: 'border-sky-400',
      accentColor: 'from-sky-400 via-teal-300 to-blue-500',
      quizBg: 'bg-sky-50 border-sky-200',
      quizText: 'text-sky-950',
      quizBadge: 'bg-sky-200 text-sky-800',
      footer: "BLINKING PROTECTS YOUR EYES! It spreads tears, cleans dust, and keeps your vision crystal clear. 👁️✨",
      quiz: {
        question: "What is the thin layer of tears that covers and protects the front of your eye called?",
        options: [
          "The Eye Shield 🛡️",
          "The Tear Film 💧",
          "The Water Blanket 🌊",
          "The Eye Shell 🐚"
        ],
        correctIndex: 1,
        explanation: "Correct! The tear film is the thin layer of water, oils, and mucus spread across your eye every time you blink to keep it smooth, moist, and clean."
      }
    },
    cuts: {
      image: '/curious_cuts.png',
      bgColor: 'border-rose-400',
      accentColor: 'from-rose-400 via-amber-300 to-red-500',
      quizBg: 'bg-rose-50 border-rose-200',
      quizText: 'text-rose-950',
      quizBadge: 'bg-rose-200 text-rose-800',
      footer: "YOUR BODY IS A HEALING CHAMPION! Platelets and clots work like a tiny rescue crew to protect you! 🩹🛡️",
      quiz: {
        question: "What tiny parts in your blood rush to stick together and make a patch when you get a cut?",
        options: [
          "Platelets 🩹",
          "Bone cells 🦴",
          "Hair follicles 💇",
          "Muscle fibers 💪"
        ],
        correctIndex: 0,
        explanation: "Spot on! Platelets are the tiny blood parts that stick together like a patch crew to form a clot and stop bleeding."
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

  const activeDetails = selectedTopicId ? TOPIC_DETAILS[selectedTopicId] : null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-4 md:p-8 rounded-[40px] shadow-inner select-none">
      <div className="w-full space-y-8">
        
        {/* Main Landing View */}
        <AnimatePresence mode="wait">
          {!selectedTopicId ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Recreated Header Banner from the single image */}
              <div className="w-full rounded-[2.5rem] overflow-hidden shadow-md border-4 border-slate-100 bg-white">
                <img 
                  src="/curious_header_banner.png" 
                  alt="Curious Mind Academy Banner" 
                  className="w-full h-auto block select-none pointer-events-none"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="w-full overflow-x-auto pb-2 scrollbar-none">
                <div className="flex items-center gap-2.5 min-w-max">
                  {CATEGORIES.map((cat) => {
                    const count = cat.id === 'all' 
                      ? topics.length 
                      : topics.filter(t => t.category === cat.id).length;
                    const isActive = activeCategory === cat.id;

                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer border shadow-sm ${
                          isActive 
                            ? 'bg-slate-900 text-white border-slate-900 scale-105 shadow-md' 
                            : `${cat.color} hover:scale-102 hover:shadow`
                        }`}
                      >
                        <span className="text-sm">{cat.icon}</span>
                        <span>{cat.label}</span>
                        {count > 0 && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive ? 'bg-white/20 text-white' : 'bg-black/10 text-slate-800'
                          }`}>
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Topics Rendering: Grouped Sections when 'all', or filtered grid */}
              {activeCategory === 'all' ? (
                <div className="space-y-8">
                  {/* Group 1: Human Body */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl p-2 rounded-2xl bg-rose-100 text-rose-800">🫀</span>
                        <div>
                          <h3 className="text-lg md:text-xl font-black text-slate-900">Human Body</h3>
                          <p className="text-xs text-slate-500 font-bold">Discover how your amazing body heals, protects, and functions!</p>
                        </div>
                      </div>
                      <span className="text-xs font-black bg-rose-100 text-rose-800 px-3 py-1 rounded-full border border-rose-200">
                        {topics.filter(t => t.category === 'human_body').length} Topics
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {topics.filter(t => t.category === 'human_body').map((topic) => (
                        <TopicCard 
                          key={topic.id} 
                          topic={topic} 
                          onSelect={() => setSelectedTopicId(topic.id)} 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Group 2: Brain, Sleep & Emotions */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl p-2 rounded-2xl bg-purple-100 text-purple-800">🧠</span>
                        <div>
                          <h3 className="text-lg md:text-xl font-black text-slate-900">Brain, Sleep &amp; Emotions</h3>
                          <p className="text-xs text-slate-500 font-bold">Explore how your mind remembers, dreams, and feels feelings!</p>
                        </div>
                      </div>
                      <span className="text-xs font-black bg-purple-100 text-purple-800 px-3 py-1 rounded-full border border-purple-200">
                        {topics.filter(t => t.category === 'brain_sleep').length} Topics
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {topics.filter(t => t.category === 'brain_sleep').map((topic) => (
                        <TopicCard 
                          key={topic.id} 
                          topic={topic} 
                          onSelect={() => setSelectedTopicId(topic.id)} 
                        />
                      ))}
                    </div>
                  </div>

                  {/* More Categories Coming Soon Bar */}
                  <div className="bg-gradient-to-r from-amber-50 via-sky-50 to-indigo-50 border-4 border-slate-100 rounded-[2.5rem] p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">✨</span>
                        <div>
                          <h4 className="text-sm font-black text-slate-900">More Science Discoveries Coming Soon!</h4>
                          <p className="text-xs font-bold text-slate-500">Animals, Plants, Space, Weather, Physics &amp; Technology are on the way.</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {['🐾 Animals', '🌿 Plants', '🚀 Space', '🌍 Weather', '⚡ Physics', '🧪 Chemistry'].map((tag, idx) => (
                          <span key={idx} className="bg-white px-3 py-1 rounded-full text-xs font-black text-slate-700 border border-slate-200 shadow-2xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Filtered Category View */
                <div className="space-y-4">
                  {topics.filter(t => t.category === activeCategory).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {topics.filter(t => t.category === activeCategory).map((topic) => (
                        <TopicCard 
                          key={topic.id} 
                          topic={topic} 
                          onSelect={() => setSelectedTopicId(topic.id)} 
                        />
                      ))}
                    </div>
                  ) : (
                    /* Empty Category State */
                    <div className="bg-white border-4 border-slate-100 rounded-[2.5rem] p-12 text-center space-y-4 shadow-sm">
                      <div className="text-5xl">🚀</div>
                      <h4 className="text-xl font-black text-slate-900">
                        {CATEGORIES.find(c => c.id === activeCategory)?.label} Questions Launching Soon!
                      </h4>
                      <p className="max-w-md mx-auto text-xs text-slate-500 font-bold leading-relaxed">
                        Our science explorers are crafting amazing infographics and quizzes for this topic. Check back soon!
                      </p>
                      <button 
                        onClick={() => setActiveCategory('all')}
                        className="btn-bubble btn-primary scale-90"
                      >
                        Explore All Topics <span>&#8594;</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Footer Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Card: 3 Features */}
                <div className="md:col-span-2 bg-white border-4 border-slate-100 rounded-[2rem] p-5 flex flex-col sm:flex-row items-center justify-around gap-4 shadow-sm">
                  
                  {/* Feature 1 */}
                  <div className="flex items-center gap-3 text-left">
                    <span className="text-2xl p-2 rounded-2xl bg-sky-50">🔍</span>
                    <div>
                      <span className="text-xs font-black text-slate-800 block">Be Curious</span>
                      <span className="text-[10px] font-bold text-slate-400 block leading-tight">Ask questions and<br />explore more!</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="hidden sm:block h-8 w-0.5 bg-slate-100" />

                  {/* Feature 2 */}
                  <div className="flex items-center gap-3 text-left">
                    <span className="text-2xl p-2 rounded-2xl bg-orange-50">🚀</span>
                    <div>
                      <span className="text-xs font-black text-slate-800 block">Learn Smart</span>
                      <span className="text-[10px] font-bold text-slate-400 block leading-tight">Fun facts, easy<br />explanations!</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="hidden sm:block h-8 w-0.5 bg-slate-100" />

                  {/* Feature 3 */}
                  <div className="flex items-center gap-3 text-left">
                    <span className="text-2xl p-2 rounded-2xl bg-amber-50">🏆</span>
                    <div>
                      <span className="text-xs font-black text-slate-800 block">Earn Rewards</span>
                      <span className="text-[10px] font-bold text-slate-400 block leading-tight">Keep learning and<br />earn points!</span>
                    </div>
                  </div>

                </div>

                {/* Right Card: Keep Exploring! */}
                <div className="bg-amber-50/50 border-4 border-amber-200 rounded-[2rem] p-5 flex items-center justify-between gap-4 shadow-sm relative overflow-hidden group">
                  <div className="text-left space-y-1 z-10">
                    <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
                      <span>⭐</span> Keep Exploring!
                    </div>
                    <p className="text-[10px] font-bold text-amber-700 leading-tight">
                      There's always something<br />new to discover!
                    </p>
                  </div>
                  
                  {/* Star Character */}
                  <div className="w-16 h-16 shrink-0 relative flex items-center justify-center z-10">
                    <img 
                      src="/curious_footer_star.png" 
                      alt="Happy Star" 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>

            </motion.div>
          ) : (
            
            // Detail View (Infographic & Quiz)
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
                  <div className="relative rounded-2xl overflow-hidden border-4 border-slate-100 shadow-md w-full group mt-2">
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

function TopicCard({ topic, onSelect }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="relative rounded-[2rem] overflow-hidden shadow-md cursor-pointer border-4 border-white hover:border-slate-300 transition-all aspect-[16/9] bg-white group flex items-center justify-center"
    >
      <img 
        src={topic.cardImage} 
        alt={topic.title} 
        className="w-full h-full object-contain select-none pointer-events-none"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
    </motion.div>
  );
}
