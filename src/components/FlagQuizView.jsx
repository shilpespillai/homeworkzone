import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  Sparkles, 
  Flame, 
  RotateCcw, 
  Volume2, 
  Globe, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Clock, 
  Award, 
  ChevronRight, 
  Search, 
  Zap,
  BookOpen,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ═══════════════════════════════════════════════════════════════
//  COMPREHENSIVE COUNTRY FLAGS DATABASE
// ═══════════════════════════════════════════════════════════════
const COUNTRIES_DATA = [
  // --- ASIA ---
  { code: 'in', name: 'India', capital: 'New Delhi', continent: 'Asia', flag: '🇮🇳', fact: 'Home to the Taj Mahal and the world\'s largest democracy.' },
  { code: 'jp', name: 'Japan', capital: 'Tokyo', continent: 'Asia', flag: '🇯🇵', fact: 'Known as the Land of the Rising Sun and famous for sushi and cherry blossoms.' },
  { code: 'kr', name: 'South Korea', capital: 'Seoul', continent: 'Asia', flag: '🇰🇷', fact: 'Famous for K-pop, taekwondo, and high-tech innovation.' },
  { code: 'cn', name: 'China', capital: 'Beijing', continent: 'Asia', flag: '🇨🇳', fact: 'Home to the Great Wall of China and giant pandas.' },
  { code: 'sg', name: 'Singapore', capital: 'Singapore', continent: 'Asia', flag: '🇸🇬', fact: 'A vibrant island city-state famous for Gardens by the Bay.' },
  { code: 'th', name: 'Thailand', capital: 'Bangkok', continent: 'Asia', flag: '🇹🇭', fact: 'Known as the Land of Smiles with beautiful golden temples.' },
  { code: 'vn', name: 'Vietnam', capital: 'Hanoi', continent: 'Asia', flag: '🇻🇳', fact: 'Famous for Ha Long Bay, delicious pho, and rich history.' },
  { code: 'np', name: 'Nepal', capital: 'Kathmandu', continent: 'Asia', flag: '🇳🇵', fact: 'Home to Mount Everest, the tallest mountain on Earth.' },
  { code: 'lk', name: 'Sri Lanka', capital: 'Sri Jayawardenepura Kotte', continent: 'Asia', flag: '🇱🇰', fact: 'An emerald island famous for tea, elephants, and ancient ruins.' },
  { code: 'sa', name: 'Saudi Arabia', capital: 'Riyadh', continent: 'Asia', flag: '🇸🇦', fact: 'Famous for its vast desert dunes and historic holy cities.' },
  { code: 'ae', name: 'United Arab Emirates', capital: 'Abu Dhabi', continent: 'Asia', flag: '🇦🇪', fact: 'Home to the Burj Khalifa, the tallest building in the world.' },
  { code: 'my', name: 'Malaysia', capital: 'Kuala Lumpur', continent: 'Asia', flag: '🇲🇾', fact: 'Famous for the iconic Petronas Twin Towers.' },
  { code: 'id', name: 'Indonesia', capital: 'Jakarta', continent: 'Asia', flag: '🇮🇩', fact: 'The world\'s largest island country with over 17,000 islands.' },
  { code: 'ph', name: 'Philippines', capital: 'Manila', continent: 'Asia', flag: '🇵🇭', fact: 'An archipelago of 7,000+ islands with crystal-clear beaches.' },

  // --- EUROPE ---
  { code: 'fr', name: 'France', capital: 'Paris', continent: 'Europe', flag: '🇫🇷', fact: 'Famous for the Eiffel Tower, fine pastries, and art museums.' },
  { code: 'gb', name: 'United Kingdom', capital: 'London', continent: 'Europe', flag: '🇬🇧', fact: 'Home to Big Ben, red double-decker buses, and royal castles.' },
  { code: 'de', name: 'Germany', capital: 'Berlin', continent: 'Europe', flag: '🇩🇪', fact: 'Known for fairytale castles, fast autobahns, and invention.' },
  { code: 'it', name: 'Italy', capital: 'Rome', continent: 'Europe', flag: '🇮🇹', fact: 'Home to the Colosseum, pizza, pasta, and Renaissance art.' },
  { code: 'es', name: 'Spain', capital: 'Madrid', continent: 'Europe', flag: '🇪🇸', fact: 'Famous for flamenco dancing, sunny beaches, and Sagrada Familia.' },
  { code: 'ch', name: 'Switzerland', capital: 'Bern', continent: 'Europe', flag: '🇨🇭', fact: 'Known for snowy Swiss Alps, delicious chocolate, and watches.' },
  { code: 'nl', name: 'Netherlands', capital: 'Amsterdam', continent: 'Europe', flag: '🇳🇱', fact: 'Famous for colorful tulip fields, windmills, and bicycles.' },
  { code: 'se', name: 'Sweden', capital: 'Stockholm', continent: 'Europe', flag: '🇸🇪', fact: 'Home of ABBA, IKEA, and the magical Northern Lights.' },
  { code: 'no', name: 'Norway', capital: 'Oslo', continent: 'Europe', flag: '🇳🇴', fact: 'Famous for deep dramatic fjords and Midnight Sun.' },
  { code: 'gr', name: 'Greece', capital: 'Athens', continent: 'Europe', flag: '🇬🇷', fact: 'Birthplace of the Olympic Games and ancient western philosophy.' },
  { code: 'pt', name: 'Portugal', capital: 'Lisbon', continent: 'Europe', flag: '🇵🇹', fact: 'Famous for historic explorers, pastel de nata, and sunny coasts.' },
  { code: 'ie', name: 'Ireland', capital: 'Dublin', continent: 'Europe', flag: '🇮🇪', fact: 'Known as the Emerald Isle with lush green hills and shamrocks.' },
  { code: 'is', name: 'Iceland', capital: 'Reykjavik', continent: 'Europe', flag: '🇮🇸', fact: 'The Land of Fire and Ice with volcanoes, geysers, and glaciers.' },
  { code: 'ru', name: 'Russia', capital: 'Moscow', continent: 'Europe', flag: '🇷🇺', fact: 'The largest country in the world spanning 11 time zones.' },

  // --- AMERICAS ---
  { code: 'us', name: 'United States', capital: 'Washington, D.C.', continent: 'Americas', flag: '🇺🇸', fact: 'Home to the Statue of Liberty, Grand Canyon, and Hollywood.' },
  { code: 'ca', name: 'Canada', capital: 'Ottawa', continent: 'Americas', flag: '🇨🇦', fact: 'Famous for maple syrup, polite people, and Niagara Falls.' },
  { code: 'mx', name: 'Mexico', capital: 'Mexico City', continent: 'Americas', flag: '🇲🇽', fact: 'Famous for ancient Mayan pyramids, tacos, and vibrant festivals.' },
  { code: 'br', name: 'Brazil', capital: 'Brasília', continent: 'Americas', flag: '🇧🇷', fact: 'Home to the Amazon Rainforest, Carnival, and Christ the Redeemer.' },
  { code: 'ar', name: 'Argentina', capital: 'Buenos Aires', continent: 'Americas', flag: '🇦🇷', fact: 'Famous for Tango music, football legends, and Patagonia.' },
  { code: 'co', name: 'Colombia', capital: 'Bogotá', continent: 'Americas', flag: '🇨🇴', fact: 'Famous for delicious coffee, emeralds, and colorful biodiversity.' },
  { code: 'cl', name: 'Chile', capital: 'Santiago', continent: 'Americas', flag: '🇨🇱', fact: 'The narrowest country in the world extending along the Andes.' },
  { code: 'pe', name: 'Peru', capital: 'Lima', continent: 'Americas', flag: '🇵🇪', fact: 'Home to the ancient Inca citadel of Machu Picchu high in the mountains.' },
  { code: 'jm', name: 'Jamaica', capital: 'Kingston', continent: 'Americas', flag: '🇯🇲', fact: 'Famous for reggae music, sprint champions, and tropical beaches.' },

  // --- AFRICA ---
  { code: 'eg', name: 'Egypt', capital: 'Cairo', continent: 'Africa', flag: '🇪🇬', fact: 'Famous for the ancient Pyramids of Giza and the majestic Nile River.' },
  { code: 'za', name: 'South Africa', capital: 'Pretoria', continent: 'Africa', flag: '🇿🇦', fact: 'Known as the Rainbow Nation with Table Mountain and wildlife safaris.' },
  { code: 'ke', name: 'Kenya', capital: 'Nairobi', continent: 'Africa', flag: '🇰🇪', fact: 'Famous for marathon runners and the Great Wildlife Migration.' },
  { code: 'ng', name: 'Nigeria', capital: 'Abuja', continent: 'Africa', flag: '🇳🇬', fact: 'Africa\'s most populous country, famous for Afrobeats and Nollywood.' },
  { code: 'ma', name: 'Morocco', capital: 'Rabat', continent: 'Africa', flag: '🇲🇦', fact: 'Famous for colorful souk markets, Sahara dunes, and mint tea.' },

  // --- OCEANIA ---
  { code: 'au', name: 'Australia', capital: 'Canberra', continent: 'Oceania', flag: '🇦🇺', fact: 'Home to kangaroos, koalas, and the Great Barrier Reef.' },
  { code: 'nz', name: 'New Zealand', capital: 'Wellington', continent: 'Oceania', flag: '🇳🇿', fact: 'Famous for stunning landscapes, kiwi birds, and the Haka dance.' },
  { code: 'fj', name: 'Fiji', capital: 'Suva', continent: 'Oceania', flag: '🇫🇯', fact: 'A paradise nation of 300+ tropical South Pacific islands.' }
];

// Helper to get image URL for high res flag
const getFlagUrl = (code) => `https://flagcdn.com/w320/${code.toLowerCase()}.png`;

export default function FlagQuizView({ onAddPoints }) {
  const [selectedContinent, setSelectedContinent] = useState('All');
  const [mode, setMode] = useState('quiz'); // 'quiz' | 'rush' | 'study'
  
  // Game State
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  
  // Speed Rush Timer
  const [timeLeft, setTimeLeft] = useState(45);
  const timerRef = useRef(null);

  // Study Mode Filter & Search
  const [searchQuery, setSearchQuery] = useState('');

  // Sound Synth Helper
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Filter countries by selected continent
  const filteredCountries = COUNTRIES_DATA.filter(country => 
    selectedContinent === 'All' ? true : country.continent === selectedContinent
  );

  // Generate a round of 10 questions (or endless for rush)
  const generateQuestions = () => {
    const pool = [...filteredCountries];
    if (pool.length < 4) return;

    // Shuffle pool
    const shuffledPool = pool.sort(() => Math.random() - 0.5);

    const newQuestions = shuffledPool.map((targetCountry) => {
      // Pick 3 wrong options from pool excluding target
      const wrongOptions = pool
        .filter(c => c.code !== targetCountry.code)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const options = [targetCountry, ...wrongOptions].sort(() => Math.random() - 0.5);

      return {
        target: targetCountry,
        options: options
      };
    });

    setQuestions(newQuestions);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowHint(false);
    setIsGameOver(false);
    setTimeLeft(45);
  };

  // Start new game on continent/mode change
  useEffect(() => {
    if (mode !== 'study') {
      generateQuestions();
    }
  }, [selectedContinent, mode]);

  // Speed Rush Timer effect
  useEffect(() => {
    if (mode === 'rush' && !isGameOver && questions.length > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsGameOver(true);
            triggerConfetti();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [mode, isGameOver, questions]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleAnswer = (option) => {
    if (isAnswered) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    const currentQuestion = questions[currentIndex];
    const isCorrect = option.code === currentQuestion.target.code;

    if (isCorrect) {
      const newScore = score + 10;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);

      speakText(`Correct! ${currentQuestion.target.name}`);

      if (onAddPoints) {
        onAddPoints(10);
      }
    } else {
      setStreak(0);
      speakText(`Oops! That is ${option.name}. The correct flag is ${currentQuestion.target.name}`);
    }

    // Auto next after delay or when button pressed
    setTimeout(() => {
      handleNextQuestion(isCorrect);
    }, 1800);
  };

  const handleNextQuestion = (lastWasCorrect) => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowHint(false);
    } else {
      setIsGameOver(true);
      if (score >= 50 || (score > 0 && mode === 'rush')) {
        triggerConfetti();
      }
    }
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* 🌟 Header & Controls 🌟 */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-[32px] p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-blue-100 border border-white/20">
              <Globe className="w-4 h-4 text-amber-300" /> Geography Master Quiz
            </div>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              Guess the Country Flag! 🚩
            </h2>
            <p className="text-xs md:text-sm font-semibold text-blue-100/90 max-w-xl">
              Test your world knowledge, learn country capitals, and earn stars for your streak!
            </p>
          </div>

          {/* Stat Pill Box */}
          <div className="flex items-center gap-3 self-start md:self-auto bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
            <div className="text-center px-3">
              <div className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Score</div>
              <div className="text-xl font-black text-amber-300 flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4" /> {score}
              </div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="text-center px-3">
              <div className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Streak</div>
              <div className="text-xl font-black text-orange-300 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-orange-400" /> {streak}
              </div>
            </div>
          </div>
        </div>

        {/* Mode Selector & Filter Toolbar */}
        <div className="mt-6 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
          
          {/* Mode Tabs */}
          <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setMode('quiz')}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                mode === 'quiz' ? 'bg-white text-indigo-950 shadow-md' : 'text-blue-100 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" /> Classic Quiz
            </button>
            <button
              onClick={() => setMode('rush')}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                mode === 'rush' ? 'bg-amber-400 text-amber-950 shadow-md' : 'text-blue-100 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-amber-950" /> Speed Rush (45s)
            </button>
            <button
              onClick={() => setMode('study')}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                mode === 'study' ? 'bg-emerald-400 text-emerald-950 shadow-md' : 'text-blue-100 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Flag Atlas (Study)
            </button>
          </div>

          {/* Continent Filter Pill Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {['All', 'Asia', 'Europe', 'Americas', 'Africa', 'Oceania'].map((cont) => (
              <button
                key={cont}
                onClick={() => setSelectedContinent(cont)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer whitespace-nowrap ${
                  selectedContinent === cont 
                    ? 'bg-amber-400 text-slate-900 shadow-md' 
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                }`}
              >
                {cont === 'All' ? '🌍 All' : cont}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 1. STUDY / FLAG ATLAS MODE */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {mode === 'study' ? (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search country name or capital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm font-bold text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-xs font-black text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCountries
              .filter(c => 
                c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                c.capital.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((c) => (
                <div 
                  key={c.code}
                  className="bg-white border border-slate-200 hover:border-blue-400 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Flag Container */}
                    <div className="h-32 bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center p-2 border border-slate-100 group-hover:scale-105 transition-transform duration-300">
                      <img 
                        src={getFlagUrl(c.code)} 
                        alt={c.name}
                        className="max-h-full max-w-full object-contain rounded-md shadow-sm"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <span className="text-6xl hidden">{c.flag}</span>
                    </div>

                    {/* Country Details */}
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-black text-slate-800">{c.name}</h4>
                        <button 
                          onClick={() => speakText(`${c.name}. Capital is ${c.capital}`)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Listen Pronunciation"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs font-bold text-slate-500 flex items-center gap-1 mt-0.5">
                        🏛️ Capital: <span className="text-slate-700">{c.capital}</span>
                      </p>
                      <span className="inline-block mt-2 text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                        {c.continent}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600 leading-snug italic font-medium">
                    💡 {c.fact}
                  </p>
                </div>
              ))}
          </div>
        </div>
      ) : isGameOver ? (
        /* ═══════════════════════════════════════════════════════════════ */
        /* 2. GAME OVER / RESULT SCREEN */
        /* ═══════════════════════════════════════════════════════════════ */
        <div className="bg-white border border-slate-200 rounded-[36px] p-8 md:p-12 text-center shadow-xl max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-24 h-24 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto text-5xl shadow-inner border-4 border-amber-200 animate-bounce">
            🏆
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl md:text-3xl font-black text-slate-800">
              {score >= 80 ? 'Master Geographer! 🌍🌟' : score >= 50 ? 'Great Explorer! 🧭' : 'Good Try, Traveler! 🎒'}
            </h3>
            <p className="text-sm font-bold text-slate-500">
              {mode === 'rush' ? 'Speed Rush Completed!' : 'You answered all questions in this round!'}
            </p>
          </div>

          {/* Results Summary Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-[10px] font-black text-slate-400 uppercase">Total Score</div>
              <div className="text-2xl font-black text-blue-600 mt-1">{score} pts</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-[10px] font-black text-slate-400 uppercase">Best Streak</div>
              <div className="text-2xl font-black text-orange-500 mt-1">🔥 {bestStreak}</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm col-span-2 md:col-span-1">
              <div className="text-[10px] font-black text-slate-400 uppercase">Continent</div>
              <div className="text-base font-black text-purple-600 mt-1">{selectedContinent}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={generateQuestions}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>
            <button
              onClick={() => setMode('study')}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-sm rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" /> Study Flags First
            </button>
          </div>
        </div>
      ) : (
        /* ═══════════════════════════════════════════════════════════════ */
        /* 3. ACTIVE QUIZ QUESTION SCREEN */
        /* ═══════════════════════════════════════════════════════════════ */
        questions.length > 0 && currentQ && (
          <div className="space-y-6">
            
            {/* Progress Bar & Timer */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
              {mode === 'rush' ? (
                <div className="flex items-center gap-2 w-full">
                  <Clock className="w-5 h-5 text-amber-500 animate-pulse shrink-0" />
                  <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        timeLeft <= 10 ? 'bg-red-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${(timeLeft / 45) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-black text-slate-700 w-12 text-right">{timeLeft}s</span>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  <div className="flex gap-1.5">
                    {questions.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-2 rounded-full transition-all ${
                          idx === currentIndex
                            ? 'w-6 bg-blue-600'
                            : idx < currentIndex
                            ? 'w-2 bg-emerald-500'
                            : 'w-2 bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Question Card */}
            <div className="bg-white border-2 border-slate-200/80 rounded-[36px] p-6 md:p-10 shadow-xl space-y-8 text-center relative overflow-hidden">
              
              <div className="space-y-2">
                <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
                  Which Country Does This Flag Belong To?
                </span>
              </div>

              {/* Large Flag Display */}
              <div className="relative inline-block mx-auto group">
                <div className="h-44 md:h-56 min-w-[240px] max-w-sm bg-slate-50 border-4 border-slate-200 rounded-3xl shadow-lg p-3 flex items-center justify-center mx-auto overflow-hidden">
                  <img
                    src={getFlagUrl(currentQ.target.code)}
                    alt="Flag Question"
                    className="max-h-full max-w-full object-contain rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <span className="text-8xl hidden">{currentQ.target.flag}</span>
                </div>

                {/* Hint Button */}
                {!isAnswered && (
                  <button
                    onClick={() => setShowHint(true)}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-black text-amber-700 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-full border border-amber-200 transition-all cursor-pointer shadow-sm"
                  >
                    <HelpCircle className="w-3.5 h-3.5" /> Need a Hint?
                  </button>
                )}

                {/* Revealed Hint Box */}
                {showHint && !isAnswered && (
                  <div className="mt-3 bg-amber-100/90 text-amber-950 text-xs font-black p-3 rounded-2xl border border-amber-300 animate-in fade-in duration-200">
                    💡 Capital: <span className="underline">{currentQ.target.capital}</span> | Continent: {currentQ.target.continent}
                  </div>
                )}
              </div>

              {/* Multiple Choice Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {currentQ.options.map((option) => {
                  let btnStyle = "bg-slate-50 border-2 border-slate-200 text-slate-800 hover:border-blue-400 hover:bg-blue-50/50";
                  
                  if (isAnswered) {
                    if (option.code === currentQ.target.code) {
                      btnStyle = "bg-emerald-500 border-2 border-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-102";
                    } else if (selectedAnswer && option.code === selectedAnswer.code) {
                      btnStyle = "bg-rose-500 border-2 border-rose-600 text-white animate-shake";
                    } else {
                      btnStyle = "bg-slate-100 border-slate-200 text-slate-400 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={option.code}
                      onClick={() => handleAnswer(option)}
                      disabled={isAnswered}
                      className={`p-4 md:p-5 rounded-2xl font-black text-base md:text-lg text-left transition-all duration-200 flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-xs font-bold text-slate-500">
                          {option.flag}
                        </span>
                        {option.name}
                      </span>

                      {isAnswered && option.code === currentQ.target.code && (
                        <CheckCircle2 className="w-6 h-6 text-white shrink-0" />
                      )}
                      {isAnswered && selectedAnswer?.code === option.code && option.code !== currentQ.target.code && (
                        <XCircle className="w-6 h-6 text-white shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Fact Reveal Box after answer */}
              {isAnswered && (
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200/70 p-5 rounded-3xl text-left space-y-2 animate-in fade-in duration-300 max-w-2xl mx-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-blue-900 uppercase tracking-widest flex items-center gap-1.5">
                      🏛️ Country Spotlight: {currentQ.target.name}
                    </span>
                    <button
                      onClick={() => speakText(`${currentQ.target.name}. Capital is ${currentQ.target.capital}. ${currentQ.target.fact}`)}
                      className="text-xs font-black text-blue-600 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Speak Fact
                    </button>
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-slate-700 leading-relaxed">
                    <span className="font-black text-blue-950">Capital:</span> {currentQ.target.capital} &bull; <span className="font-black text-blue-950">Continent:</span> {currentQ.target.continent}
                  </p>
                  <p className="text-xs text-slate-600 italic">
                    💡 {currentQ.target.fact}
                  </p>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}
