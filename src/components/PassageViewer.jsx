import React, { useMemo } from 'react';
import { Volume2, BookOpen } from 'lucide-react';

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
 * Strip AI symbols, markdown hashes, emojis, and messy formatting
 */
const cleanText = (str) => {
  if (!str) return '';
  return str
    // Remove markdown headers and formatting
    .replace(/^#+\s*/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    // Remove common emojis & AI symbols
    .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|✨|💡|❤️|🧩|🔊|✍️|🚫|#\d+/gu, '')
    // Remove raw bullet dashes at start
    .replace(/^[\-\*\•]\s*/, '')
    .trim();
};

/**
 * Parse raw markdown/text vocabulary guide into structured Word array
 */
const parseVocabGuide = (rawText) => {
  if (!rawText) return null;

  const isVocab = /Vocabulary Word|Word Spotlight|Pronunciation|Part of Speech|Meaning|Definition/i.test(rawText);
  if (!isVocab) return null;

  const lines = rawText.split('\n');
  let intro = [];
  const words = [];
  let currentWord = null;

  lines.forEach((line) => {
    const raw = line.trim();
    if (!raw) return;

    // Detect word headers
    const isWordHeader = raw.toLowerCase().includes('vocabulary word:') || 
                         (raw.startsWith('##') && raw.toLowerCase().includes('word')) ||
                         /^(?:#+\s*)?\d+\.\s*(?:Vocabulary Word|Word)?/i.test(raw);

    if (isWordHeader) {
      if (currentWord) words.push(currentWord);

      let wordTitle = cleanText(raw)
        .replace(/^\d+\.\s*/, '')
        .replace(/Vocabulary Word\s*:\s*/i, '')
        .replace(/Word\s*\d*\s*:\s*/i, '')
        .trim();

      // Normalize title casing (e.g. "Dashed", not "DASHED")
      if (wordTitle) {
        wordTitle = wordTitle.charAt(0).toUpperCase() + wordTitle.slice(1);
      }

      currentWord = {
        number: words.length + 1,
        word: wordTitle || `Word ${words.length + 1}`,
        pronunciation: '',
        partOfSpeech: '',
        meaning: '',
        usageNote: '',
        examples: []
      };
      return;
    }

    if (!currentWord) {
      if (!raw.startsWith('---')) {
        const cleanedIntro = cleanText(raw);
        if (cleanedIntro) intro.push(cleanedIntro);
      }
      return;
    }

    const lower = raw.toLowerCase();
    const textWithoutPrefix = cleanText(raw);

    if (lower.includes('pronunciation')) {
      currentWord.pronunciation = textWithoutPrefix.replace(/^Pronunciation\s*:\s*/i, '').trim();
    } else if (lower.includes('part of speech')) {
      currentWord.partOfSpeech = textWithoutPrefix.replace(/^Part of Speech\s*:\s*/i, '').trim();
    } else if (lower.includes('meaning') || lower.includes('definition')) {
      currentWord.meaning = textWithoutPrefix.replace(/^(?:Student-Friendly Meaning|Meaning|Definition)\s*:\s*/i, '').trim();
    } else if (lower.includes('why writers love') || lower.includes('why use') || lower.includes('usage')) {
      currentWord.usageNote = textWithoutPrefix.replace(/^(?:Why Writers Love This Word|Why Use It|Usage Note|Tip)\s*:\s*/i, '').trim();
    } else if (raw.startsWith('- ') || raw.startsWith('* ') || raw.startsWith('• ')) {
      if (textWithoutPrefix) currentWord.examples.push(textWithoutPrefix);
    } else if (!raw.startsWith('---')) {
      if (!currentWord.meaning) {
        currentWord.meaning = textWithoutPrefix;
      } else if (!currentWord.usageNote) {
        currentWord.usageNote = textWithoutPrefix;
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
 * Clean markdown renderer for standard non-vocab prose passages
 */
const renderProsePassage = (text) => {
  if (!text) return null;
  const paragraphs = text.split('\n\n');

  return (
    <div className="space-y-4 font-sans text-slate-700 leading-relaxed text-base">
      {paragraphs.map((p, idx) => {
        const cleaned = cleanText(p);
        if (!cleaned || cleaned === '---') return null;
        return (
          <p key={idx} className="font-normal text-slate-700 leading-relaxed">
            {cleaned}
          </p>
        );
      })}
    </div>
  );
};

export default function PassageViewer({ 
  passage, 
  onStartQuiz = null,
  isFullPage = true,
  className = '' 
}) {
  const parsedVocab = useMemo(() => parseVocabGuide(passage), [passage]);

  if (!passage) return null;

  const isVocab = !!parsedVocab && parsedVocab.words.length > 0;

  return (
    <div className={`w-full max-w-4xl mx-auto space-y-6 ${className}`}>
      
      {/* Page Title & Subtitle */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-medium border border-amber-200 mb-1">
          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
          <span>{isVocab ? 'Vocabulary Study Guide' : 'Reading Passage'}</span>
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {isVocab ? 'Target Words & Learning Guide' : 'Read Before Answering'}
        </h1>
        
        <p className="text-sm font-normal text-slate-600 leading-relaxed">
          {isVocab 
            ? 'Review and learn these words carefully. Click any word to hear its pronunciation. When ready, click Start Quiz below.'
            : 'Read the text carefully below before continuing to the questions.'}
        </p>
      </div>

      {/* Intro Box if available */}
      {isVocab && parsedVocab.intro && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-normal text-slate-700 leading-relaxed">
          <p>{parsedVocab.intro}</p>
        </div>
      )}

      {/* Main Content Area */}
      {isVocab ? (
        <div className="space-y-4">
          {parsedVocab.words.map((item, idx) => (
            <div 
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 transition-all hover:border-slate-300"
            >
              {/* Word Title Casing & Pronunciation Pill Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 font-semibold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 capitalize">
                    {item.word}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {item.pronunciation && (
                    <button
                      onClick={() => speakWord(item.word)}
                      className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer border border-amber-200"
                      title="Listen to pronunciation"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                      <span>{item.pronunciation}</span>
                    </button>
                  )}

                  {item.partOfSpeech && (
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200">
                      {item.partOfSpeech}
                    </span>
                  )}
                </div>
              </div>

              {/* Definition / Meaning (Regular Pleasant Font, Not Heavy Bold) */}
              {item.meaning && (
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                    Meaning
                  </span>
                  <p className="text-sm font-normal text-slate-800 leading-relaxed">
                    {item.meaning}
                  </p>
                </div>
              )}

              {/* Usage Note / Writer's Tip */}
              {item.usageNote && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 block">
                    Usage Note
                  </span>
                  <p className="text-xs font-normal text-slate-700 leading-relaxed italic">
                    "{item.usageNote}"
                  </p>
                </div>
              )}

              {/* Example Sentences */}
              {item.examples.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                    Example Sentences
                  </span>
                  <ul className="list-disc list-inside text-xs font-normal text-slate-600 space-y-1 pl-1">
                    {item.examples.map((ex, eIdx) => (
                      <li key={eIdx}>{ex}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Prose Reading Passage */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {renderProsePassage(passage)}
        </div>
      )}

      {/* Start Quiz Action Footer */}
      {onStartQuiz && (
        <div className="pt-4 flex justify-center">
          <button
            onClick={onStartQuiz}
            className="w-full sm:w-auto px-8 py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-base rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Start Quiz & Questions →</span>
          </button>
        </div>
      )}
    </div>
  );
}
