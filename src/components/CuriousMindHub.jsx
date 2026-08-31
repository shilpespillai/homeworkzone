import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { CATEGORIES, TOPICS, TOPIC_DETAILS } from '../data/curiousMindData';

export default function CuriousMindHub() {
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [quizScore, setQuizScore] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

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

  const topics = TOPICS;

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
                  {CATEGORIES.filter(c => c.id !== 'all').map((cat) => {
                    const catTopics = topics.filter(t => t.category === cat.id);
                    if (catTopics.length === 0) return null;

                    const catDescriptions = {
                      animals: "Discover amazing adaptations, wildlife wonders, and animal superpowers!",
                      human_body: "Discover how your amazing body heals, protects, and functions!",
                      brain_sleep: "Explore how your mind remembers, dreams, and feels feelings!",
                      physics_everyday: "Fascinating everyday physics, forces, and natural phenomena!",
                      space: "Journey through planets, stars, galaxies, and cosmic wonders!",
                      earth_weather: "Learn how oceans, mountains, clouds, and storms shape our world!",
                      plants: "Uncover how trees talk, plants drink, and flowers bloom!",
                      food_chemistry: "Tasty science, kitchen reactions, and delicious chemistry secrets!"
                    };

                    return (
                      <div key={cat.id} className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl p-2 rounded-2xl bg-slate-100 border border-slate-200">{cat.icon}</span>
                            <div>
                              <h3 className="text-lg md:text-xl font-black text-slate-900">{cat.label}</h3>
                              <p className="text-xs text-slate-500 font-bold">
                                {catDescriptions[cat.id] || `Explore curious questions about ${cat.label.toLowerCase()}!`}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setActiveCategory(cat.id)}
                            className={`text-xs font-black px-3 py-1 rounded-full border shadow-2xs hover:scale-105 transition-transform cursor-pointer ${cat.color}`}
                          >
                            {catTopics.length} Topics &rarr;
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {catTopics.map((topic) => (
                            <TopicCard 
                              key={topic.id} 
                              topic={topic} 
                              onSelect={() => setSelectedTopicId(topic.id)} 
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {/* More Categories Coming Soon Bar */}
                  {CATEGORIES.filter(c => c.id !== 'all' && topics.filter(t => t.category === c.id).length === 0).length > 0 && (
                    <div className="bg-gradient-to-r from-amber-50 via-sky-50 to-indigo-50 border-4 border-slate-100 rounded-[2.5rem] p-6 shadow-sm">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">✨</span>
                          <div>
                            <h4 className="text-sm font-black text-slate-900">More Science Discoveries Coming Soon!</h4>
                            <p className="text-xs font-bold text-slate-500">Plants, Weather, and Technology topics are currently being crafted.</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {CATEGORIES.filter(c => c.id !== 'all' && topics.filter(t => t.category === c.id).length === 0).map((cat) => (
                            <span key={cat.id} className="bg-white px-3 py-1 rounded-full text-xs font-black text-slate-700 border border-slate-200 shadow-2xs">
                              {cat.icon} {cat.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
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
