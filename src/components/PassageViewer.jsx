import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Volume2, 
  Eye, 
  EyeOff, 
  Lightbulb, 
  Heart, 
  Layers 
} from 'lucide-react';

/**
 * Speech synthesis helper for word pronunciation
 */
const speakWord = (text) => {
  if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.replace(/[-·]/g, ''));
  utterance.rate = 0.85;
  utterance.pitch = 1.0;
  window.speechSynthesis.speak(utterance);
};

/**
 * Helper to parse markdown-formatted Vocabulary Spotlights into structured Word object arrays
 */
const parseVocabSpotlight = (rawText) => {
  if (!rawText) return null;

  // Check if text looks like a vocabulary spotlight
  const isVocab = /Vocabulary Word|Word Spotlight|Pronunciation|Part of Speech/i.test(rawText);
  if (!isVocab) return null;

  const lines = rawText.split('\n');
  let intro = [];
  const words = [];
  let currentWord = null;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Detect word headers e.g. "## 1. Vocabulary Word: Dashed" or "### 1. Dashed" or "Word 1: Dashed"
    const isWordHeader = trimmed.toLowerCase().includes('vocabulary word:') || 
                         (trimmed.startsWith('##') && trimmed.toLowerCase().includes('word')) ||
                         /^(?:#+\s*)?\d+\.\s*Vocabulary Word/i.test(trimmed);

    if (isWordHeader) {
      if (currentWord) words.push(currentWord);

      const wordTitle = trimmed
        .replace(/^#+\s*/, '')
        .replace(/^\d+\.\s*/, '')
        .replace(/Vocabulary Word\s*:\s*/i, '')
        .trim();

      currentWord = {
        number: words.length + 1,
        word: wordTitle,
        pronunciation: '',
        partOfSpeech: '',
        meaning: '',
        whyWritersLoveIt: '',
        examples: [],
        rawDetails: []
      };
      return;
    }

    if (!currentWord) {
      if (!trimmed.startsWith('---')) {
        intro.push(trimmed.replace(/^#+\s*/, ''));
      }
      return;
    }

    // Parse attributes inside current word
    if (/Pronunciation\s*:/i.test(trimmed)) {
      currentWord.pronunciation = trimmed.replace(/^#+\s*/, '').replace(/.*?Pronunciation\s*:\s*/i, '').trim();
    } else if (/Part of Speech\s*:/i.test(trimmed)) {
      currentWord.partOfSpeech = trimmed.replace(/^#+\s*/, '').replace(/.*?Part of Speech\s*:\s*/i, '').trim();
    } else if (/Student-Friendly Meaning\s*:|Definition\s*:/i.test(trimmed)) {
      currentWord.meaning = trimmed.replace(/^#+\s*/, '').replace(/.*?(?:Student-Friendly Meaning|Definition)\s*:\s*/i, '').trim();
    } else if (/Why Writers Love This Word\s*:|Why Use It\s*:/i.test(trimmed)) {
      currentWord.whyWritersLoveIt = trimmed.replace(/^#+\s*/, '').replace(/.*?(?:Why Writers Love This Word|Why Use It)\s*:\s*/i, '').trim();
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      currentWord.examples.push(trimmed.substring(2).trim());
    } else if (!trimmed.startsWith('---')) {
      if (!currentWord.meaning) {
        currentWord.meaning = trimmed.replace(/^#+\s*/, '');
      } else {
        currentWord.rawDetails.push(trimmed.replace(/^#+\s*/, ''));
      }
    }
  });

  if (currentWord) words.push(currentWord);

  return {
    intro: intro.join(' '),
    words
  };
};

/**
 * Clean markdown formatter for general reading passages
 */
const renderFormattedMarkdown = (text) => {
  if (!text) return null;
  
  const paragraphs = text.split('\n\n');
  return paragraphs.map((p, idx) => {
    let clean = p.trim();
    if (!clean || clean === '---') return null;

    if (clean.startsWith('# ')) {
      return <h2 key={idx} className="text-xl font-black text-slate-800 border-b border-slate-200 pb-2 my-3">{clean.replace(/^#\s*/, '')}</h2>;
    }
    if (clean.startsWith('## ')) {
      return <h3 key={idx} className="text-lg font-bold text-slate-800 my-2">{clean.replace(/^##\s*/, '')}</h3>;
    }
    if (clean.startsWith('### ')) {
      return <h4 key={idx} className="text-base font-extrabold text-indigo-900 my-2">{clean.replace(/^###\s*/, '')}</h4>;
    }

    const parts = clean.split(/(\*\*.*?\*\*)/g);
    return (
      <p key={idx} className="text-base font-normal text-slate-700 leading-relaxed my-2">
        {parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={pIdx} className="font-extrabold text-slate-900">{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
      </p>
    );
  });
};

export default function PassageViewer({ 
  passage, 
  subject = '', 
  currentQuestionText = '',
  className = '' 
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const vocabData = useMemo(() => parseVocabSpotlight(passage), [passage]);

  if (!passage) return null;

  const isVocab = !!vocabData && vocabData.words.length > 0;

  return (
    <div className={`bg-white/95 backdrop-blur-md rounded-[28px] border-2 border-slate-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)] flex flex-col overflow-hidden transition-all duration-300 ${className}`}>
      
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/5 to-purple-500/10 p-4 px-6 border-b border-slate-200/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shadow-sm shrink-0">
            {isVocab ? <Sparkles className="w-5 h-5 text-amber-600" /> : <BookOpen className="w-5 h-5 text-indigo-600" />}
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              {isVocab ? 'Weekly Word Spotlight & Learning Guide' : 'Reading Passage & Stimulus'}
            </h2>
            <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
              {isVocab ? `${vocabData.words.length} Target Words • Interactive Study Guide` : 'Read carefully before answering'}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          title={isCollapsed ? "Expand Guide" : "Collapse Guide"}
        >
          {isCollapsed ? (
            <>
              <Eye className="w-3.5 h-3.5 text-slate-600" />
              <span>Show Guide</span>
            </>
          ) : (
            <>
              <EyeOff className="w-3.5 h-3.5 text-slate-600" />
              <span>Hide Guide</span>
            </>
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div className="flex flex-col flex-1 overflow-hidden">

          {/* Vocab Word Selector Tabs (if Vocabulary Guide) */}
          {isVocab && (
            <div className="bg-slate-50/80 p-2.5 px-4 border-b border-slate-200/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                  activeTab === 'all'
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> All Words ({vocabData.words.length})
              </button>

              {vocabData.words.map((w, idx) => {
                const isSelected = activeTab === idx;
                const isMentionedInQuestion = currentQuestionText && currentQuestionText.toLowerCase().includes(w.word.toLowerCase());

                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-105 font-black'
                        : isMentionedInQuestion
                        ? 'bg-amber-100 text-amber-900 border-2 border-amber-400 font-extrabold'
                        : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200'
                    }`}
                  >
                    <span>{w.word}</span>
                    {isMentionedInQuestion && <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Main Scrollable Content Body */}
          <div className="p-6 overflow-y-auto max-h-[550px] space-y-6 custom-scrollbar font-sans">

            {isVocab ? (
              <>
                {/* Intro Box if available */}
                {vocabData.intro && (activeTab === 'all' || activeTab === 'intro') && (
                  <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs font-semibold text-amber-950 leading-relaxed flex items-start gap-3 shadow-inner">
                    <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p>{vocabData.intro}</p>
                  </div>
                )}

                {/* Vocabulary Cards List */}
                <div className="space-y-4">
                  {vocabData.words
                    .filter((_, idx) => activeTab === 'all' || activeTab === idx)
                    .map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white border-2 border-slate-200/90 hover:border-indigo-300 rounded-2xl p-5 shadow-sm transition-all space-y-3.5 relative overflow-hidden group"
                      >
                        {/* Word Header & Audio Pronunciation */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 font-black text-xs flex items-center justify-center shrink-0">
                              #{item.number}
                            </span>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight capitalize">
                              {item.word}
                            </h3>
                          </div>

                          <div className="flex items-center gap-2">
                            {item.pronunciation && (
                              <button
                                onClick={() => speakWord(item.word)}
                                className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
                                title="Listen to pronunciation"
                              >
                                <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                                <span>{item.pronunciation}</span>
                              </button>
                            )}

                            {item.partOfSpeech && (
                              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-[11px] font-black uppercase tracking-wider border border-slate-200">
                                {item.partOfSpeech}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Meaning / Definition */}
                        {item.meaning && (
                          <div className="bg-indigo-50/60 border-l-4 border-indigo-500 p-3.5 rounded-r-xl">
                            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 block mb-1 flex items-center gap-1">
                              <Lightbulb className="w-3.5 h-3.5" /> Meaning
                            </span>
                            <p className="text-sm font-bold text-slate-800 leading-snug">
                              {item.meaning}
                            </p>
                          </div>
                        )}

                        {/* Why Writers Love This Word */}
                        {item.whyWritersLoveIt && (
                          <div className="bg-rose-50/60 border border-rose-200/80 p-3.5 rounded-xl">
                            <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 block mb-1 flex items-center gap-1">
                              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> Writer's Secret Power
                            </span>
                            <p className="text-xs font-medium text-slate-700 leading-relaxed italic">
                              "{item.whyWritersLoveIt}"
                            </p>
                          </div>
                        )}

                        {/* Examples */}
                        {item.examples.length > 0 && (
                          <div className="space-y-1 pt-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                              Example Sentences:
                            </span>
                            <ul className="list-disc list-inside text-xs font-medium text-slate-600 space-y-1 pl-1">
                              {item.examples.map((ex, eIdx) => (
                                <li key={eIdx}>{ex}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </>
            ) : (
              /* Standard Prose Reading Passage */
              <div className="space-y-3">
                {renderFormattedMarkdown(passage)}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
