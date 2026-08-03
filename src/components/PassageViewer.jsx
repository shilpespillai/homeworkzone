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
 * Strip markdown hashes, emojis, and messy formatting
 */
const cleanText = (str) => {
  if (!str) return '';
  return str
    .replace(/^#+\s*/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|✨|💡|❤️|🧩|🔊|✍️|🚫|#\d+/gu, '')
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

    const lower = raw.toLowerCase();
    const isSectionHeader = /why writers love|replace (?:these )?boring|quick writing tip|usage note|examples?|memory trick|antonyms?|synonyms?/i.test(lower);

    // Detect new word header
    const isExplicitWordHeader = lower.includes('vocabulary word:') || 
                                 lower.includes('target word:') || 
                                 lower.includes('word spotlight:') ||
                                 (raw.startsWith('##') && lower.includes('word') && !isSectionHeader);

    // Also match lines like "1. Dashed" or "## 1. Dashed"
    const isNumberedWordMatch = !isSectionHeader && /^(?:#+\s*)?\d+\.\s*(?:Vocabulary Word\s*:)?\s*[A-Za-z\-\'\s]{2,25}$/i.test(raw);

    if (isExplicitWordHeader || isNumberedWordMatch) {
      if (currentWord) words.push(currentWord);

      let wordTitle = cleanText(raw)
        .replace(/^\d+\.\s*/, '')
        .replace(/Vocabulary Word\s*:\s*/i, '')
        .replace(/Target Word\s*:\s*/i, '')
        .replace(/Word\s*\d*\s*:\s*/i, '')
        .trim();

      if (wordTitle) {
        wordTitle = wordTitle.charAt(0).toUpperCase() + wordTitle.slice(1);
      }

      currentWord = {
        number: words.length + 1,
        word: wordTitle || `Word ${words.length + 1}`,
        pronunciation: '',
        partOfSpeech: '',
        meaning: '',
        whyWritersLoveIt: '',
        replaceBoringWords: '',
        quickWritingTips: '',
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

    const textCleaned = cleanText(raw);

    if (lower.includes('pronunciation')) {
      currentWord.pronunciation = textCleaned.replace(/^Pronunciation\s*:\s*/i, '').trim();
    } else if (lower.includes('part of speech')) {
      currentWord.partOfSpeech = textCleaned.replace(/^Part of Speech\s*:\s*/i, '').trim();
    } else if (lower.includes('meaning') || lower.includes('definition')) {
      const val = textCleaned.replace(/^(?:Student-Friendly Meaning|Meaning|Definition)\s*:\s*/i, '').trim();
      currentWord.meaning = currentWord.meaning ? `${currentWord.meaning} ${val}` : val;
    } else if (lower.includes('why writers love')) {
      const val = textCleaned.replace(/^Why Writers Love (?:This Word|This)?\s*:?\s*/i, '').trim();
      currentWord.whyWritersLoveIt = currentWord.whyWritersLoveIt ? `${currentWord.whyWritersLoveIt} ${val}` : val;
    } else if (lower.includes('replace') || lower.includes('boring words')) {
      const val = textCleaned.replace(/^Replace (?:These )?Boring Words\s*:?\s*/i, '').trim();
      currentWord.replaceBoringWords = currentWord.replaceBoringWords ? `${currentWord.replaceBoringWords} ${val}` : val;
    } else if (lower.includes('quick writing tip') || lower.includes('writing tip') || lower.includes('memory trick')) {
      const val = textCleaned.replace(/^(?:Quick Writing Tip|Writing Tip|Memory Trick)\s*:?\s*/i, '').trim();
      currentWord.quickWritingTips = currentWord.quickWritingTips ? `${currentWord.quickWritingTips} ${val}` : val;
    } else if (raw.startsWith('- ') || raw.startsWith('* ') || raw.startsWith('• ')) {
      if (textCleaned) {
        if (!currentWord.replaceBoringWords && lower.includes('synonym')) {
          currentWord.replaceBoringWords = textCleaned;
        } else {
          currentWord.examples.push(textCleaned);
        }
      }
    } else if (!raw.startsWith('---')) {
      if (!currentWord.meaning) {
        currentWord.meaning = textCleaned;
      } else if (!currentWord.whyWritersLoveIt) {
        currentWord.whyWritersLoveIt = textCleaned;
      } else if (!currentWord.quickWritingTips) {
        currentWord.quickWritingTips = textCleaned;
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
 * Clean markdown renderer for standard prose reading passages
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
    <div className={`w-full max-w-[98vw] mx-auto space-y-6 ${className}`}>
      
      {/* Page Title & Subtitle */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-normal border border-amber-200 mb-1">
          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
          <span>{isVocab ? 'Weekly Vocabulary Table' : 'Reading Passage'}</span>
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-normal text-slate-900 tracking-tight">
          {isVocab ? 'Target Words & Learning Table' : 'Read Before Answering'}
        </h1>
        
        <p className="text-sm font-normal text-slate-600 leading-relaxed">
          {isVocab 
            ? `Review all ${parsedVocab.words.length} target words in the table below. Click speaker icons to hear pronunciations. When ready, click Start Quiz.`
            : 'Read the text carefully below before continuing to the questions.'}
        </p>
      </div>

      {/* Intro Box if available */}
      {isVocab && parsedVocab.intro && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-normal text-slate-700 leading-relaxed">
          <p>{parsedVocab.intro}</p>
        </div>
      )}

      {/* Excel Data Table Grid for Vocab Words */}
      {isVocab ? (
        <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden font-sans">
          <table className="w-full text-left border-collapse text-xs sm:text-sm table-auto">
            <thead>
              <tr className="bg-slate-100/80 text-slate-600 border-b border-slate-200 font-normal uppercase tracking-wider text-[11px]">
                <th className="p-3 px-3 font-normal w-10 text-center border-r border-slate-200/60">#</th>
                <th className="p-3.5 px-4 font-normal w-[18%] border-r border-slate-200/60">Word & Details</th>
                <th className="p-3.5 px-4 font-normal w-[20%] border-r border-slate-200/60">Meaning</th>
                <th className="p-3.5 px-4 font-normal w-[22%] border-r border-slate-200/60">Why Writers Love This</th>
                <th className="p-3.5 px-4 font-normal w-[18%] border-r border-slate-200/60">Replace Boring Words</th>
                <th className="p-3.5 px-4 font-normal w-[22%]">Quick Writing Tips</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {parsedVocab.words.map((item, idx) => (
                <tr key={idx} className="hover:bg-amber-50/20 transition-colors even:bg-slate-50/40">
                  {/* Row Number */}
                  <td className="p-3 px-3 text-center font-normal text-slate-400 border-r border-slate-200/60 align-top">
                    {idx + 1}
                  </td>

                  {/* Word, Audio & POS */}
                  <td className="p-3.5 px-4 border-r border-slate-200/60 align-top space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-normal text-orange-500 capitalize">
                        {item.word}
                      </span>
                      {item.pronunciation && (
                        <button
                          onClick={() => speakWord(item.word)}
                          className="p-1 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-full border border-amber-200 text-xs font-normal flex items-center gap-1 cursor-pointer transition-all active:scale-95 shrink-0"
                          title="Listen to pronunciation"
                        >
                          <Volume2 className="w-3 h-3 text-amber-600" />
                          <span className="text-[11px] font-normal">{item.pronunciation}</span>
                        </button>
                      )}
                    </div>

                    {item.partOfSpeech && (
                      <span className="inline-block text-[11px] font-normal text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 uppercase">
                        {item.partOfSpeech}
                      </span>
                    )}
                  </td>

                  {/* Meaning Column */}
                  <td className="p-3.5 px-4 font-normal text-slate-700 leading-relaxed border-r border-slate-200/60 align-top">
                    {item.meaning || '-'}
                  </td>

                  {/* Why Writers Love This Column */}
                  <td className="p-3.5 px-4 font-normal text-slate-700 leading-relaxed border-r border-slate-200/60 align-top">
                    <span className="text-emerald-600 font-normal">Why Writers Love This - </span>
                    <span>{item.whyWritersLoveIt || 'Adds vivid description and energy to your writing.'}</span>
                  </td>

                  {/* Replace Boring Words Column */}
                  <td className="p-3.5 px-4 font-normal text-slate-700 leading-relaxed border-r border-slate-200/60 align-top">
                    <span className="text-emerald-600 font-normal">Replace Boring Words - </span>
                    <span>{item.replaceBoringWords || 'Ran, Went fast, Said, Good, Nice'}</span>
                  </td>

                  {/* Quick Writing Tips Column */}
                  <td className="p-3.5 px-4 font-normal text-slate-700 leading-relaxed align-top">
                    <span className="text-emerald-600 font-normal">Quick Writing Tips - </span>
                    <span>{item.quickWritingTips || `Use '${item.word.toLowerCase()}' when describing action scenes.`}</span>

                    {item.examples.length > 0 && (
                      <div className="mt-2 text-xs font-normal text-slate-500 italic">
                        Example: "{item.examples[0]}"
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            className="w-full sm:w-auto px-8 py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-normal text-base rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Start Quiz & Questions →</span>
          </button>
        </div>
      )}
    </div>
  );
}
