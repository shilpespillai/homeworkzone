import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  RotateCcw, 
  Award, 
  Search, 
  ZoomIn, 
  ZoomOut,
  Maximize2, 
  X, 
  Eye, 
  Target, 
  Layers, 
  Zap, 
  Printer,
  Check,
  Image as ImageIcon
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
  const [zoomScale, setZoomScale] = useState(1);
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
    setZoomScale(1);
    setActivePosterModal(item);
  };

  const closePoster = () => {
    if (speakingId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    }
    setActivePosterModal(null);
    setZoomScale(1);
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
              High-resolution visual infographics across all 7 progressive learning levels. Tap any poster to zoom in and study every rule and formula!
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
            className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
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
                className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between cursor-pointer ${
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
              className="text-slate-400 hover:text-rose-600 flex items-center gap-1 text-[11px] font-bold cursor-pointer"
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
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black shadow-md hover:bg-blue-700 transition-all cursor-pointer"
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
            const hasImage = Boolean(item.imageSrc);

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border-2 transition-all flex flex-col justify-between overflow-hidden group hover:shadow-xl hover:-translate-y-1 relative ${
                  isCompleted 
                    ? 'border-emerald-300 shadow-emerald-50' 
                    : 'border-slate-100 shadow-sm hover:border-blue-300'
                }`}
              >
                {/* Image Section or Top Header */}
                {hasImage ? (
                  <div 
                    onClick={() => openPoster(item)}
                    className="relative w-full aspect-[16/9] bg-slate-900 overflow-hidden cursor-pointer group/img"
                  >
                    <img 
                      src={item.imageSrc} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 flex items-end justify-between p-4 opacity-90 group-hover/img:opacity-100 transition-opacity">
                      <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black text-white border border-white/20">
                        Level {item.levelNumber} • Topic {item.topicNumber}
                      </span>
                      <span className="px-3 py-1 bg-blue-600 text-white rounded-xl text-[10px] font-black flex items-center gap-1 shadow-lg group-hover/img:bg-blue-500 transition-colors">
                        <ZoomIn className="w-3 h-3" /> Zoom Poster
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 pb-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-black tracking-wider">
                          Topic {item.topicNumber}
                        </span>
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-black">
                          Level {item.levelNumber}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" /> Upcoming Poster
                      </span>
                    </div>
                  </div>
                )}

                {/* Content Section */}
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-black text-slate-800 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => toggleSpeak(item)}
                          title={isSpeaking ? 'Stop speech' : 'Read aloud'}
                          className={`p-1.5 rounded-lg transition-all cursor-pointer ${
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
                          className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                            isCompleted 
                              ? 'bg-emerald-500 text-white' 
                              : 'bg-slate-100 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 font-medium line-clamp-2">
                      {item.subtitle}
                    </p>

                    {/* Formula Highlight */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50/60 p-2.5 rounded-xl border border-blue-100/80">
                      <span className="text-[9px] font-black uppercase tracking-widest text-blue-700 flex items-center gap-1 mb-0.5">
                        <Zap className="w-3 h-3 text-amber-500" /> Key Rule / Formula
                      </span>
                      <p className="text-xs font-bold text-blue-950 font-mono leading-snug">
                        {item.keyFormula}
                      </p>
                    </div>
                  </div>

                  {/* Interactive Quick Quiz */}
                  {item.quiz && (
                    <div className="bg-amber-50/60 rounded-2xl p-3 border border-amber-200/60 space-y-2 mt-2">
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
                      <p className="text-[11px] font-bold text-slate-800 leading-snug">
                        {item.quiz.question}
                      </p>

                      <div className="grid grid-cols-2 gap-1 pt-0.5">
                        {item.quiz.options.map((option, optIdx) => {
                          const isSelected = currentQuiz?.selectedIndex === optIdx;
                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleQuizAnswer(item.id, optIdx)}
                              className={`p-1.5 px-2 rounded-lg text-[10px] font-bold text-left transition-all cursor-pointer truncate ${
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
                        <p className="text-[10px] text-slate-600 pt-0.5 font-medium italic">
                          💡 {item.quiz.explanation}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => openPoster(item)}
                    className="w-full py-2.5 px-3 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-sm group-hover:bg-blue-600 cursor-pointer mt-2"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    {hasImage ? 'View Full Infographic Poster' : 'Open Study Guide'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- FULL-SCREEN HIGH-RESOLUTION POSTER LIGHTBOX --- */}
      {activePosterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-[32px] max-w-6xl w-full max-h-[96vh] flex flex-col shadow-2xl border border-white/10 overflow-hidden relative text-white">
            {/* Modal Top Bar */}
            <div className="bg-slate-950 p-4 sm:p-5 px-6 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-xl font-black px-3 py-1 bg-white/10 rounded-xl">
                  {activePosterModal.topicNumber}
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                    Level {activePosterModal.levelNumber} Infographic
                  </span>
                  <h2 className="text-base sm:text-xl font-black tracking-tight text-white leading-tight">
                    {activePosterModal.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {activePosterModal.imageSrc && (
                  <div className="flex items-center bg-white/10 rounded-xl p-1 gap-1 border border-white/10">
                    <button
                      onClick={() => setZoomScale(prev => Math.max(0.7, prev - 0.2))}
                      className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-colors cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-mono px-1 font-bold">{Math.round(zoomScale * 100)}%</span>
                    <button
                      onClick={() => setZoomScale(prev => Math.min(2.5, prev + 0.2))}
                      className="p-1.5 hover:bg-white/10 rounded-lg text-white transition-colors cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setZoomScale(1)}
                      className="text-[9px] font-bold px-1.5 py-1 hover:bg-white/10 rounded text-slate-300 cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                )}

                <button
                  onClick={() => toggleSpeak(activePosterModal)}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    speakingId === activePosterModal.id 
                      ? 'bg-rose-500 text-white animate-pulse' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  title="Read Aloud"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  title="Print Poster"
                >
                  <Printer className="w-4 h-4" />
                </button>

                <button
                  onClick={closePoster}
                  className="p-2 rounded-xl bg-white/10 hover:bg-rose-500 text-white transition-all cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Poster Canvas Viewer */}
            <div className="p-4 sm:p-6 overflow-auto custom-scrollbar flex-1 flex flex-col items-center justify-center bg-slate-950/60 min-h-[60vh]">
              {activePosterModal.imageSrc ? (
                <div 
                  className="transition-transform duration-200 origin-top flex items-center justify-center max-w-full"
                  style={{ transform: `scale(${zoomScale})` }}
                >
                  <img 
                    src={activePosterModal.imageSrc} 
                    alt={activePosterModal.title}
                    className="max-w-full h-auto rounded-2xl shadow-2xl border border-white/10 object-contain max-h-[78vh]"
                  />
                </div>
              ) : (
                <div className="max-w-2xl w-full bg-white rounded-3xl p-8 text-slate-800 space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-indigo-100 space-y-2">
                    <span className="text-xs font-black uppercase tracking-widest text-indigo-700 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-500" /> Core Formula
                    </span>
                    <p className="text-lg font-black text-indigo-950 font-mono">
                      {activePosterModal.keyFormula}
                    </p>
                    <p className="text-xs text-slate-600 font-medium">
                      {activePosterModal.coreRule}
                    </p>
                  </div>

                  {activePosterModal.quickTip && (
                    <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-950">
                      <b>💡 Detective Tip:</b> {activePosterModal.quickTip}
                    </div>
                  )}

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
                    <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-600">
                      Infographic poster asset will appear here when uploaded.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Bar */}
            <div className="bg-slate-950 p-4 px-6 border-t border-white/10 flex items-center justify-between shrink-0">
              <button
                onClick={() => toggleCompleteTopic(activePosterModal.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                  completedTopics.has(activePosterModal.id)
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Check className="w-4 h-4" />
                {completedTopics.has(activePosterModal.id) ? 'Mastered ✓' : 'Mark as Mastered'}
              </button>

              <button
                onClick={closePoster}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-md cursor-pointer"
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
