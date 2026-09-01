import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  RotateCcw, 
  Award, 
  ChevronRight, 
  ChevronLeft,
  Search, 
  Star, 
  ZoomIn, 
  Maximize2, 
  X, 
  Eye, 
  FileText, 
  Lightbulb, 
  Target, 
  CheckSquare, 
  Layers, 
  Zap, 
  Compass, 
  ArrowRight,
  Printer,
  Check,
  Flame,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  ENGLISH_INFOGRAPHIC_DOMAINS, 
  ENGLISH_INFOGRAPHICS 
} from '../data/englishInfographicsData';

export default function EnglishInfographicViewer({ initialTopicId }) {
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePosterModal, setActivePosterModal] = useState(null); // stores active infographic item
  const [completedTopics, setCompletedTopics] = useState(() => {
    try {
      const saved = localStorage.getItem('hz_english_infographics_completed');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) {
      return new Set();
    }
  });

  // Speech Handler State
  const [speakingId, setSpeakingId] = useState(null);
  
  // Interactive Quiz states per item: { [itemId]: { selectedIndex, isSubmitted } }
  const [quizState, setQuizState] = useState({});

  // Sync completion to localStorage
  const toggleCompleteTopic = (id) => {
    setCompletedTopics(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.85 }
        });
      }
      try {
        localStorage.setItem('hz_english_infographics_completed', JSON.stringify([...next]));
      } catch (e) {}
      return next;
    });
  };

  // Filtered infographics list
  const filteredInfographics = useMemo(() => {
    return ENGLISH_INFOGRAPHICS.filter(item => {
      const matchesDomain = selectedDomain === 'all' || item.domainId === selectedDomain;
      const matchesLevel = selectedLevel === 'all' || item.levelNumber.toString() === selectedLevel;
      const matchesSearch = !searchQuery.trim() || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.coreRule.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.keyFormula.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDomain && matchesLevel && matchesSearch;
    });
  }, [selectedDomain, selectedLevel, searchQuery]);

  // Audio Speech Handler
  const toggleSpeak = (item) => {
    if ('speechSynthesis' in window) {
      if (speakingId === item.id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const textToRead = `${item.title}. ${item.subtitle}. Core Formula: ${item.keyFormula}. Core Rule: ${item.coreRule}. Quick Tip: ${item.quickTip || ''}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      setSpeakingId(item.id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleQuizAnswer = (itemId, optionIndex) => {
    setQuizState(prev => ({
      ...prev,
      [itemId]: {
        selectedIndex: optionIndex,
        isSubmitted: true
      }
    }));

    const item = ENGLISH_INFOGRAPHICS.find(i => i.id === itemId);
    if (item?.quiz && optionIndex === item.quiz.correctIndex) {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.8 }
      });
      // Automatically mark complete
      if (!completedTopics.has(itemId)) {
        toggleCompleteTopic(itemId);
      }
    }
  };

  // Open modal for poster view
  const openPoster = (item) => {
    setActivePosterModal(item);
  };

  const closePoster = () => {
    if (speakingId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    }
    setActivePosterModal(null);
  };

  const masteryPercent = Math.round((completedTopics.size / ENGLISH_INFOGRAPHICS.length) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* --- Header Banner --- */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider text-amber-200 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" /> 54 Progressive Visual Infographics
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <span>📚</span> English Infographics Masterclass
            </h1>
            <p className="text-blue-100 text-sm sm:text-base max-w-2xl font-medium">
              A 7-tier hierarchical visual study system designed for kids and students to master grammar, sentence building, clauses, tenses, punctuation, and writing polish.
            </p>
          </div>

          {/* Mastery Progress Card */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/25 flex flex-col items-center min-w-[200px] text-center shrink-0">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase tracking-widest mb-1">
              <Award className="w-4 h-4" /> Mastery Progress
            </div>
            <div className="text-3xl font-black text-white">
              {completedTopics.size} <span className="text-lg font-bold text-blue-200">/ {ENGLISH_INFOGRAPHICS.length}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2.5 mt-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${masteryPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-blue-100 mt-1.5">{masteryPercent}% Topics Mastered</span>
          </div>
        </div>
      </div>

      {/* --- Level Pathway Selector (7 Tiers) --- */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            7 Progressive Learning Domains
          </h3>
          <span className="text-xs font-bold text-slate-400">Click a level to filter</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <button
            onClick={() => { setSelectedDomain('all'); setSelectedLevel('all'); }}
            className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
              selectedDomain === 'all' && selectedLevel === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🌟</span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-white/20">All 54</span>
            </div>
            <div className="mt-2">
              <p className="text-xs font-black leading-tight">All Levels</p>
              <p className="text-[10px] opacity-75">Full Wall</p>
            </div>
          </button>

          {ENGLISH_INFOGRAPHIC_DOMAINS.map((domain) => {
            const isSelected = selectedDomain === domain.id;
            return (
              <button
                key={domain.id}
                onClick={() => {
                  setSelectedDomain(domain.id);
                  setSelectedLevel('all');
                }}
                className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? `bg-gradient-to-br ${domain.color} text-white shadow-md scale-[1.02] border-transparent`
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{domain.icon}</span>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {domain.count}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-[11px] font-black leading-tight truncate">{domain.title}</p>
                  <p className={`text-[9px] font-bold ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>L{domain.levelNumber}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- Search & Quick Filter Bar --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all 54 topics, rules, or formulas..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 w-full sm:w-auto justify-between sm:justify-end">
          <span>Showing <b>{filteredInfographics.length}</b> visual guides</span>
          {completedTopics.size > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Reset all completed topic checkmarks?')) {
                  setCompletedTopics(new Set());
                  localStorage.removeItem('hz_english_infographics_completed');
                }
              }}
              className="text-slate-400 hover:text-rose-600 flex items-center gap-1 text-[11px] font-bold"
            >
              <RotateCcw className="w-3 h-3" /> Reset Checkmarks
            </button>
          )}
        </div>
      </div>

      {/* --- Infographics Grid --- */}
      {filteredInfographics.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm space-y-3">
          <span className="text-4xl">🔍</span>
          <h4 className="text-lg font-black text-slate-700">No infographic topics found</h4>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Try clearing your search or picking a different level from the top navigation.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedDomain('all'); setSelectedLevel('all'); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black shadow-md hover:bg-blue-700 transition-all"
          >
            View All 54 Topics
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInfographics.map((item) => {
            const isCompleted = completedTopics.has(item.id);
            const isSpeaking = speakingId === item.id;
            const currentQuiz = quizState[item.id];
            const hasAnswered = currentQuiz?.isSubmitted;
            const isCorrect = hasAnswered && currentQuiz?.selectedIndex === item.quiz?.correctIndex;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border-2 transition-all flex flex-col justify-between overflow-hidden group hover:shadow-xl hover:-translate-y-1 relative ${
                  isCompleted 
                    ? 'border-emerald-300 shadow-emerald-50' 
                    : 'border-slate-100 shadow-sm hover:border-blue-300'
                }`}
              >
                {/* Top Banner Tag */}
                <div className="p-6 pb-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-black tracking-wider">
                        Topic {item.topicNumber}
                      </span>
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-black">
                        Level {item.levelNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleSpeak(item)}
                        title={isSpeaking ? 'Stop speech' : 'Read aloud'}
                        className={`p-2 rounded-xl transition-all ${
                          isSpeaking 
                            ? 'bg-rose-500 text-white animate-pulse' 
                            : 'bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600'
                        }`}
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => toggleCompleteTopic(item.id)}
                        title={isCompleted ? 'Mark as incomplete' : 'Mark as mastered'}
                        className={`p-2 rounded-xl transition-all ${
                          isCompleted 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-slate-100 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Formula Box */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50/60 p-3 rounded-2xl border border-blue-100/80">
                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-700 flex items-center gap-1 mb-1">
                      <Zap className="w-3 h-3 text-amber-500" /> Core Formula
                    </span>
                    <p className="text-xs font-extrabold text-blue-950 font-mono leading-relaxed">
                      {item.keyFormula}
                    </p>
                  </div>

                  {/* Core Rule Box */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs text-slate-700 font-medium space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3 text-orange-500" /> Rule
                    </span>
                    <p className="text-xs text-slate-800 leading-snug">{item.coreRule}</p>
                  </div>

                  {/* Visual Layout Preview Elements */}
                  {item.elements && item.elements.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Key Roles / Components</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {item.elements.slice(0, 4).map((elem, idx) => (
                          <div key={idx} className="bg-slate-50/80 p-2 rounded-xl border border-slate-100 text-[10px] font-bold text-slate-700 truncate">
                            {elem.role || elem.name || elem.type || elem.mark || elem.category || elem.pronoun}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Before & After Preview */}
                  {item.beforeAfter && (
                    <div className="space-y-1.5 pt-1">
                      <div className="bg-rose-50/60 border border-rose-100 p-2 rounded-xl text-[10px] text-rose-800 font-medium">
                        <b className="text-rose-600">✗ Broken:</b> {item.beforeAfter.broken}
                      </div>
                      <div className="bg-emerald-50/60 border border-emerald-100 p-2 rounded-xl text-[10px] text-emerald-800 font-medium">
                        <b className="text-emerald-600">✓ Fixed:</b> {item.beforeAfter.repaired}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Action Footer & Quick Quiz */}
                <div className="p-6 pt-0 space-y-3">
                  {/* Interactive Quick Quiz (Accordion/Card) */}
                  {item.quiz && (
                    <div className="bg-amber-50/50 rounded-2xl p-3.5 border border-amber-200/60 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-black text-amber-900 uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <Target className="w-3.5 h-3.5 text-amber-600" /> Quick Practice Check
                        </span>
                        {hasAnswered && (
                          <span className={`px-2 py-0.5 rounded-full font-black ${isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {isCorrect ? '✓ Correct!' : '✗ Try again'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-slate-800 leading-snug">
                        {item.quiz.question}
                      </p>

                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        {item.quiz.options.map((option, optIdx) => {
                          const isSelected = currentQuiz?.selectedIndex === optIdx;
                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleQuizAnswer(item.id, optIdx)}
                              className={`p-2 rounded-xl text-[11px] font-bold text-left transition-all cursor-pointer ${
                                isSelected
                                  ? (optIdx === item.quiz.correctIndex ? 'bg-emerald-600 text-white shadow-sm' : 'bg-rose-500 text-white')
                                  : 'bg-white hover:bg-amber-100/60 text-slate-700 border border-amber-100'
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>

                      {hasAnswered && (
                        <p className="text-[10px] text-slate-600 pt-1 font-medium italic">
                          💡 {item.quiz.explanation}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Expand Full Poster Button */}
                  <button
                    onClick={() => openPoster(item)}
                    className="w-full py-3 px-4 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md group-hover:bg-blue-600 cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" /> Open Full Interactive Infographic
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- FULL-SCREEN POSTER MODAL --- */}
      {activePosterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-[36px] max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-white/20 overflow-hidden relative">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-6 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black px-3 py-1 bg-white/20 backdrop-blur-md rounded-2xl">
                  {activePosterModal.topicNumber}
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">
                    Level {activePosterModal.levelNumber} Infographic Poster
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                    {activePosterModal.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSpeak(activePosterModal)}
                  className={`p-2.5 rounded-2xl transition-all ${
                    speakingId === activePosterModal.id 
                      ? 'bg-rose-500 text-white animate-pulse' 
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                  title="Read Aloud"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => window.print()}
                  className="p-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-all"
                  title="Print Poster"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={closePoster}
                  className="p-2.5 rounded-2xl bg-white/20 hover:bg-rose-500 text-white transition-all"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1 text-slate-800">
              {/* Core Formula Box Big */}
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-3xl border-2 border-indigo-100 shadow-sm space-y-2">
                <span className="text-xs font-black uppercase tracking-widest text-indigo-700 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" /> The Master Formula
                </span>
                <p className="text-lg sm:text-xl font-black text-indigo-950 font-mono leading-relaxed">
                  {activePosterModal.keyFormula}
                </p>
                <p className="text-sm text-slate-600 font-medium pt-1">
                  {activePosterModal.coreRule}
                </p>
              </div>

              {/* Town Grid / Roles / Elements Visualizer */}
              {activePosterModal.elements && activePosterModal.elements.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <Compass className="w-4 h-4 text-blue-600" /> Structure Breakdown
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {activePosterModal.elements.map((elem, idx) => (
                      <div 
                        key={idx} 
                        className={`p-4 rounded-2xl border transition-all ${elem.color || 'bg-slate-50 border-slate-200'}`}
                      >
                        <p className="font-black text-sm">{elem.role || elem.name || elem.type || elem.mark || elem.pronoun}</p>
                        {elem.job && <p className="text-[11px] font-bold opacity-85 mt-0.5">{elem.job}</p>}
                        {elem.desc && <p className="text-[11px] mt-1 opacity-90 leading-tight">{elem.desc}</p>}
                        {elem.eg && <p className="text-[10px] mt-2 font-mono font-bold bg-white/60 p-1.5 rounded-lg border border-black/5">e.g. {elem.eg}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sample Sentence Breakdown (Town Map style) */}
              {activePosterModal.sampleSentence && (
                <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-md space-y-3">
                  <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                    🔬 Live Sentence Breakdown
                  </span>
                  <p className="text-base font-bold italic text-slate-200">
                    {activePosterModal.sampleSentence.sentence}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {activePosterModal.sampleSentence.breakdown.map((chip, idx) => (
                      <div key={idx} className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 flex flex-col items-center">
                        <span className="text-xs font-bold text-white">{chip.word}</span>
                        <span className="text-[9px] font-black text-amber-300 uppercase">{chip.tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Side-by-Side Matrix / Columns */}
              {activePosterModal.adjectiveColumn && activePosterModal.adverbColumn && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50/70 p-5 rounded-3xl border border-blue-200 space-y-3">
                    <h5 className="font-black text-blue-900 text-sm">{activePosterModal.adjectiveColumn.title}</h5>
                    <ul className="space-y-1.5 text-xs text-blue-950 font-medium">
                      {activePosterModal.adjectiveColumn.questions.map((q, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-blue-500 font-bold">•</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-[11px] font-bold text-blue-700 italic pt-1">{activePosterModal.adjectiveColumn.example}</p>
                  </div>

                  <div className="bg-purple-50/70 p-5 rounded-3xl border border-purple-200 space-y-3">
                    <h5 className="font-black text-purple-900 text-sm">{activePosterModal.adverbColumn.title}</h5>
                    <ul className="space-y-1.5 text-xs text-purple-950 font-medium">
                      {activePosterModal.adverbColumn.questions.map((q, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-purple-500 font-bold">•</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-[11px] font-bold text-purple-700 italic pt-1">{activePosterModal.adverbColumn.example}</p>
                  </div>
                </div>
              )}

              {/* Step Ladder Visualizer */}
              {activePosterModal.rungs && (
                <div className="space-y-3">
                  <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    🪜 Progressive Steps
                  </h4>
                  <div className="space-y-2">
                    {activePosterModal.rungs.map((rung, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-start gap-3">
                        <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-xs font-black text-blue-900">{rung.rung}</p>
                          <p className="text-sm font-bold text-slate-800 mt-0.5">{rung.sentence}</p>
                          {rung.added && <p className="text-[10px] font-bold text-emerald-600 mt-0.5">Added: {rung.added}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Tip Box */}
              {activePosterModal.quickTip && (
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-start gap-3">
                  <span className="text-2xl shrink-0">💡</span>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-amber-900">Detective Pro Tip</span>
                    <p className="text-xs text-amber-950 font-medium mt-0.5">{activePosterModal.quickTip}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 px-6 border-t border-slate-100 flex items-center justify-between shrink-0">
              <button
                onClick={() => toggleCompleteTopic(activePosterModal.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                  completedTopics.has(activePosterModal.id)
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Check className="w-4 h-4" />
                {completedTopics.has(activePosterModal.id) ? 'Mastered ✓' : 'Mark as Mastered'}
              </button>

              <button
                onClick={closePoster}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black shadow-md cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
