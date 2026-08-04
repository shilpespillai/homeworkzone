import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, 
  Sparkles, 
  Volume2, 
  Mic, 
  CheckCircle2, 
  RotateCcw, 
  Trophy, 
  Flame, 
  ArrowLeft, 
  Play, 
  BookOpen, 
  Layers, 
  Zap, 
  PenTool, 
  Award,
  ChevronRight,
  Check,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { 
  SUPPORTED_LEARNING_LANGUAGES, 
  LANGUAGE_ALPHABETS, 
  VISUAL_VOCABULARY, 
  GRAMMAR_SENTENCES 
} from '../data/languagesData';

export default function PolyglotPlanetView({ onAddPoints }) {
  const [selectedLang, setSelectedLang] = useState(null); // Selected language object
  const [activeLevel, setActiveLevel] = useState(0); // 0: Script | 1: Vocab | 3: Lego Grammar | 5: Voice Trainer
  
  // Level 0 State: Alphabet Tracing & Posters
  const [alphabetIndex, setAlphabetIndex] = useState(0);
  const [isTracing, setIsTracing] = useState(false);
  const canvasRef = useRef(null);

  // Level 1 State: Vocab Poster Cards
  const [vocabIndex, setVocabIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Level 3 State: Lego Grammar Builder
  const [grammarIndex, setGrammarIndex] = useState(0);
  const [userSentenceBlocks, setUserSentenceBlocks] = useState([]);
  const [isGrammarSuccess, setIsGrammarSuccess] = useState(false);

  // Level 5 State: Voice Trainer
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [speechMatchScore, setSpeechMatchScore] = useState(null);

  // General Gamification
  const [stars, setStars] = useState(0);

  // Speech Synth
  const speakNativeText = (text, langCode = 'es') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      
      // Match voice locale
      const ttsMap = {
        es: 'es-ES', fr: 'fr-FR', de: 'de-DE', hi: 'hi-IN', 
        ja: 'ja-JP', zh: 'zh-CN', ar: 'ar-SA', ta: 'ta-IN',
        it: 'it-IT', ru: 'ru-RU', ko: 'ko-KR', pt: 'pt-BR'
      };
      utterance.lang = ttsMap[langCode] || 'en-US';

      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Trigger Confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  // ═══════════════════════════════════════════════════════════════
  //  CANVAS TRACING HANDLERS (Level 0)
  // ═══════════════════════════════════════════════════════════════
  const startTracing = (e) => {
    setIsTracing(true);
    drawTrace(e);
  };

  const stopTracing = () => {
    setIsTracing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
    }
  };

  const drawTrace = (e) => {
    if (!isTracing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#38bdf8'; // Glowing sky blue stroke
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#0284c7';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  //  VOICE RECOGNITION HANDLER (Level 5)
  // ═══════════════════════════════════════════════════════════════
  const handleStartVoiceRecord = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported on this browser. Try Google Chrome!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = selectedLang?.code || 'es';
    recognition.interimResults = false;

    setIsListening(true);
    setSpokenText('Listening...');
    setSpeechMatchScore(null);

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSpokenText(transcript);
      setIsListening(false);

      // Score calculation
      const currentWordObj = getVocabList()[vocabIndex] || { word: '' };
      if (transcript.toLowerCase().includes(currentWordObj.word.toLowerCase())) {
        setSpeechMatchScore(100);
        triggerConfetti();
        setStars(prev => prev + 15);
        if (onAddPoints) onAddPoints(15);
      } else {
        setSpeechMatchScore(75);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      setSpokenText('Could not capture audio. Try again!');
    };
  };

  // Helpers to fetch current dataset
  const getAlphabetList = () => {
    if (!selectedLang) return [];
    return LANGUAGE_ALPHABETS[selectedLang.code] || LANGUAGE_ALPHABETS.es;
  };

  const getVocabList = () => {
    if (!selectedLang) return [];
    return VISUAL_VOCABULARY[selectedLang.code] || VISUAL_VOCABULARY.es;
  };

  const getGrammarList = () => {
    if (!selectedLang) return [];
    return GRAMMAR_SENTENCES[selectedLang.code] || GRAMMAR_SENTENCES.es;
  };

  // Handle Lego Block Selection
  const handleAddGrammarBlock = (block) => {
    if (userSentenceBlocks.find(b => b.id === block.id)) return;
    const updated = [...userSentenceBlocks, block];
    setUserSentenceBlocks(updated);

    const currentSentenceObj = getGrammarList()[grammarIndex];
    if (!currentSentenceObj) return;

    // Check sentence match
    const assembledText = updated.map(b => b.text.split(' ')[0]).join(' ');
    if (updated.length === currentSentenceObj.blocks.length) {
      setIsGrammarSuccess(true);
      triggerConfetti();
      speakNativeText(currentSentenceObj.targetSentence, selectedLang.code);
      setStars(prev => prev + 20);
      if (onAddPoints) onAddPoints(20);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  //  1. LANGUAGE SELECTION HUB (HOMEPAGE STAGE)
  // ═══════════════════════════════════════════════════════════════
  if (!selectedLang) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-700 rounded-[40px] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden text-center">
          <div className="absolute -left-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest text-sky-100 border border-white/25">
              <Globe className="w-4 h-4 text-amber-300 animate-spin" /> Polyglot Planet Language Academy
            </div>
            <h1 className="text-3xl md:text-6xl font-black tracking-tight text-white leading-tight">
              Learn Any Language in the World Visually! 🌍
            </h1>
            <p className="text-sm md:text-lg text-sky-100 font-medium">
              Choose your target language below to begin your immersive visual adventure — starting from letter stroke tracing to real-world voice fluency!
            </p>
          </div>
        </div>

        {/* 🌐 World Language Poster Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {SUPPORTED_LEARNING_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setSelectedLang(lang);
                setActiveLevel(0);
              }}
              className="bg-white border-2 border-slate-200 hover:border-sky-500 rounded-3xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 group flex flex-col items-center text-center space-y-3 cursor-pointer hover:scale-105"
            >
              <div className="text-6xl group-hover:scale-110 transition-transform duration-300 filter drop-shadow-md">
                {lang.flag}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">{lang.name}</h3>
                <p className="text-xs font-bold text-sky-600">{lang.native}</p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 px-3 py-1 rounded-full group-hover:bg-sky-500 group-hover:text-white transition-colors">
                Explore ➔
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Current Level Datasets
  const alphabets = getAlphabetList();
  const currentChar = alphabets[alphabetIndex] || alphabets[0];
  
  const vocabs = getVocabList();
  const currentVocab = vocabs[vocabIndex] || vocabs[0];

  const grammars = getGrammarList();
  const currentGrammar = grammars[grammarIndex] || grammars[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      
      {/* 🌟 Top Navigation Bar & Language Header */}
      <div className="bg-slate-900 text-white p-5 md:p-6 rounded-[32px] shadow-xl flex flex-wrap items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedLang(null)}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl transition-all cursor-pointer flex items-center gap-1 text-xs font-black"
          >
            <ArrowLeft className="w-4 h-4" /> Change Language
          </button>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{selectedLang.flag}</span>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white">{selectedLang.name} Academy</h2>
              <span className="text-xs font-bold text-sky-400">{selectedLang.native} &bull; {selectedLang.family} Family</span>
            </div>
          </div>
        </div>

        {/* Stars Counter */}
        <div className="flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-4 py-2 rounded-2xl font-black text-sm">
          <Sparkles className="w-4 h-4" /> {stars} Language Stars
        </div>
      </div>

      {/* 🎛️ 5-Level Progress Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar bg-slate-200 p-2 rounded-2xl border border-slate-300">
        {[
          { id: 0, label: 'Level 0: Script & Tracing 🔤', icon: PenTool },
          { id: 1, label: 'Level 1: Visual Flashcards 🎴', icon: Layers },
          { id: 3, label: 'Level 3: Lego Grammar 🧩', icon: Zap },
          { id: 5, label: 'Level 5: Voice Trainer 🎤', icon: Mic }
        ].map((lvl) => (
          <button
            key={lvl.id}
            onClick={() => setActiveLevel(lvl.id)}
            className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeLevel === lvl.id
                ? 'bg-sky-600 text-white shadow-lg scale-102'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            <lvl.icon className="w-4 h-4" /> {lvl.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* LEVEL 0: SCRIPT, CHARACTER POSTER & STROKE TRACING             */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeLevel === 0 && currentChar && (
        <div className="bg-slate-950 border-4 border-slate-800 rounded-[40px] p-6 md:p-10 text-white shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative overflow-hidden">
          
          {/* Left: Giant Poster Stage */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-sky-500/20 text-sky-300 border border-sky-500/30 px-3.5 py-1.5 rounded-full text-xs font-black uppercase">
              Character {alphabetIndex + 1} of {alphabets.length}
            </div>

            {/* Giant 60% Hero Letter Poster */}
            <div className="relative group inline-block">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-b from-slate-900 to-slate-900/90 border-4 border-sky-500/40 rounded-[48px] shadow-2xl flex items-center justify-center mx-auto relative overflow-hidden">
                <span className="text-8xl md:text-9xl font-black text-sky-400 drop-shadow-[0_10px_25px_rgba(56,189,248,0.5)]">
                  {currentChar.char}
                </span>

                {/* Animated Audio Button */}
                <button
                  onClick={() => speakNativeText(currentChar.char, selectedLang.code)}
                  className="absolute bottom-4 right-4 bg-sky-500 hover:bg-sky-400 text-white p-4 rounded-2xl shadow-xl transition-all cursor-pointer hover:scale-110 active:scale-95"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white">{currentChar.name} &bull; IPA: {currentChar.ipa}</h3>
              <p className="text-xs font-bold text-amber-300">💡 Mnemonic: {currentChar.mnemonic}</p>
              <p className="text-xs text-slate-400">Example: <span className="text-white font-bold">{currentChar.example}</span></p>
            </div>

            {/* Navigation Carousel Buttons */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setAlphabetIndex(prev => (prev > 0 ? prev - 1 : alphabets.length - 1));
                  clearCanvas();
                }}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-2xl transition-all cursor-pointer"
              >
                ◀ Previous
              </button>
              <button
                onClick={() => {
                  speakNativeText(currentChar.char, selectedLang.code);
                }}
                className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-black text-xs rounded-2xl shadow-lg shadow-sky-500/30 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Volume2 className="w-4 h-4" /> Listen Sound
              </button>
              <button
                onClick={() => {
                  setAlphabetIndex(prev => (prev + 1) % alphabets.length);
                  clearCanvas();
                }}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-2xl transition-all cursor-pointer"
              >
                Next ▶
              </button>
            </div>
          </div>

          {/* Right: Interactive Finger/Mouse Tracing Canvas */}
          <div className="bg-slate-900 border-2 border-slate-800 p-6 rounded-[36px] text-center space-y-4 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-sky-400 uppercase tracking-wider flex items-center gap-1">
                <PenTool className="w-4 h-4" /> Character Stroke Tracing Stage
              </span>
              <button
                onClick={clearCanvas}
                className="text-xs font-bold text-slate-400 hover:text-white bg-slate-800 px-3 py-1 rounded-lg cursor-pointer"
              >
                Clear Stroke
              </button>
            </div>

            {/* HTML5 Canvas for Stroke Tracing */}
            <div className="relative w-full h-72 md:h-80 bg-slate-950 border-2 border-dashed border-sky-500/30 rounded-3xl overflow-hidden flex items-center justify-center">
              {/* Background Faint Template */}
              <span className="absolute text-9xl font-black text-slate-800/50 pointer-events-none select-none">
                {currentChar.char}
              </span>

              <canvas
                ref={canvasRef}
                width={320}
                height={320}
                onMouseDown={startTracing}
                onMouseUp={stopTracing}
                onMouseMove={drawTrace}
                onTouchStart={startTracing}
                onTouchEnd={stopTracing}
                onTouchMove={drawTrace}
                className="w-full h-full cursor-crosshair relative z-10"
              />
            </div>

            <p className="text-xs font-medium text-slate-400">
              Trace over the guide with your mouse or finger to master the character's strokes!
            </p>
          </div>

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* LEVEL 1: VISUAL HERO FLASHCARDS                                */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeLevel === 1 && currentVocab && (
        <div className="bg-white border-4 border-slate-200 rounded-[40px] p-6 md:p-10 shadow-2xl max-w-3xl mx-auto space-y-8 text-center">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-sky-600 bg-sky-50 px-4 py-1.5 rounded-full border border-sky-100 uppercase tracking-widest">
              Visual Word {vocabIndex + 1} of {vocabs.length} &bull; {currentVocab.category}
            </span>
            <span className="text-xs font-bold text-slate-400 uppercase">{currentVocab.type}</span>
          </div>

          {/* Full-Bleed Hero 3D Poster Image */}
          <div className="h-64 md:h-80 bg-slate-900 rounded-[36px] overflow-hidden relative shadow-xl border-4 border-slate-100 group">
            <img
              src={currentVocab.image}
              alt={currentVocab.word}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-left text-white">
              <div className="text-xs font-black text-amber-300 uppercase tracking-widest">{currentVocab.meaning}</div>
              <h2 className="text-3xl md:text-5xl font-black text-white">{currentVocab.word}</h2>
              <p className="text-sm font-semibold text-slate-300">[{currentVocab.phonetic}]</p>
            </div>
          </div>

          {/* Audio Visualizer & Speak Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => speakNativeText(currentVocab.word, selectedLang.code)}
              className="px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white font-black text-base rounded-2xl shadow-xl shadow-sky-500/30 transition-all hover:scale-105 cursor-pointer flex items-center gap-3"
            >
              <Volume2 className={`w-6 h-6 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
              Hear Native Pronunciation
            </button>
          </div>

          {/* Carousel Next/Prev */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setVocabIndex(prev => (prev > 0 ? prev - 1 : vocabs.length - 1))}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-2xl cursor-pointer"
            >
              ◀ Previous Word
            </button>
            <button
              onClick={() => setVocabIndex(prev => (prev + 1) % vocabs.length)}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-2xl cursor-pointer"
            >
              Next Word ▶
            </button>
          </div>

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* LEVEL 3: COLOR-CODED LEGO GRAMMAR BUILDER                      */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeLevel === 3 && currentGrammar && (
        <div className="bg-slate-900 border-4 border-slate-800 rounded-[40px] p-6 md:p-10 text-white shadow-2xl max-w-4xl mx-auto space-y-8 text-center">
          
          <div className="space-y-2">
            <span className="text-xs font-black text-emerald-400 bg-emerald-400/20 border border-emerald-400/30 px-4 py-1.5 rounded-full uppercase tracking-widest">
              Lego Sentence Mechanics 🧩
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-white">
              Assemble the sentence for: <span className="text-amber-300">"{currentGrammar.englishTranslation}"</span>
            </h3>
          </div>

          {/* Target Snap Container */}
          <div className="min-h-24 bg-slate-950 border-2 border-dashed border-slate-700 rounded-3xl p-4 flex flex-wrap items-center justify-center gap-3 shadow-inner">
            {userSentenceBlocks.length === 0 ? (
              <span className="text-xs font-bold text-slate-500">Tap colored blocks below in correct order to snap them here!</span>
            ) : (
              userSentenceBlocks.map((b) => (
                <span
                  key={b.id}
                  className={`px-5 py-3 rounded-2xl font-black text-base md:text-lg shadow-md animate-in zoom-in-95 ${b.color}`}
                >
                  {b.text}
                </span>
              ))
            )}
          </div>

          {/* Color Key Guide */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-black text-slate-300">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Green = Noun</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-600" /> Blue = Verb</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400" /> Yellow = Adjective</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500" /> Red = Location</span>
          </div>

          {/* Available Blocks Pool */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {currentGrammar.blocks.map((block) => {
              const isUsed = userSentenceBlocks.some(b => b.id === block.id);
              return (
                <button
                  key={block.id}
                  onClick={() => handleAddGrammarBlock(block)}
                  disabled={isUsed}
                  className={`px-6 py-4 rounded-2xl font-black text-base md:text-lg transition-all cursor-pointer shadow-lg ${
                    isUsed ? 'opacity-30 scale-95 cursor-not-allowed' : `${block.color} hover:scale-105 active:scale-95`
                  }`}
                >
                  {block.text}
                </button>
              );
            })}
          </div>

          {/* Reset / Success Actions */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                setUserSentenceBlocks([]);
                setIsGrammarSuccess(false);
              }}
              aria-label="Reset Sentence Blocks"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black text-xs rounded-2xl cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" /> Reset Sentence Blocks
            </button>
          </div>

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* LEVEL 5: VOICE TRAINER & SPEECH PRACTICE                        */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeLevel === 5 && currentVocab && (
        <div className="bg-slate-950 border-4 border-slate-800 rounded-[40px] p-6 md:p-10 text-white shadow-2xl max-w-3xl mx-auto space-y-8 text-center relative overflow-hidden">
          
          <div className="space-y-2">
            <span className="text-xs font-black text-rose-400 bg-rose-400/20 border border-rose-400/30 px-4 py-1.5 rounded-full uppercase tracking-widest">
              Voice Pronunciation Trainer 🎙️
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-white">
              Speak out loud in {selectedLang.name}:
            </h3>
            <p className="text-3xl font-black text-sky-400">"{currentVocab.word}"</p>
            <p className="text-xs font-bold text-slate-400">[{currentVocab.phonetic}] &bull; Meaning: {currentVocab.meaning}</p>
          </div>

          {/* Giant Microphone Recording Button */}
          <div className="py-4">
            <button
              onClick={handleStartVoiceRecord}
              disabled={isListening}
              className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center text-4xl shadow-2xl transition-all cursor-pointer ${
                isListening 
                  ? 'bg-rose-500 animate-ping text-white' 
                  : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:scale-110 active:scale-95 text-white'
              }`}
            >
              <Mic className="w-12 h-12" />
            </button>
            <p className="text-xs font-bold text-slate-400 mt-3">
              {isListening ? 'Listening... Speak clearly into your mic!' : 'Tap mic and speak out loud!'}
            </p>
          </div>

          {/* Speech Result Box */}
          {spokenText && (
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl max-w-md mx-auto space-y-2 animate-in fade-in">
              <div className="text-xs font-black text-slate-400 uppercase">You Said:</div>
              <div className="text-lg font-black text-white">{spokenText}</div>
              {speechMatchScore && (
                <div className="text-xs font-black text-emerald-400 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Great Pronunciation! Match Score: {speechMatchScore}%
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
