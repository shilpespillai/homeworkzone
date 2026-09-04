import React, { useState, useMemo } from 'react';
import { BookOpen, ZoomIn, ZoomOut, RotateCcw, FileText, ChevronRight, Bookmark } from 'lucide-react';

/**
 * Utility to parse raw passage strings (or arrays) into structured passage items.
 */
export function parseStimulusPassages(rawPassage, rawPassagesArray) {
  if (Array.isArray(rawPassagesArray) && rawPassagesArray.length > 0) {
    return rawPassagesArray.map((p, idx) => ({
      id: p.id !== undefined ? p.id : idx + 1,
      title: p.title || `Text ${idx + 1}`,
      textType: (p.textType || p.genre || 'prose').toLowerCase(),
      genre: p.genre || p.textType || 'Reading Text',
      text: p.text || ''
    }));
  }

  if (typeof rawPassage !== 'string' || !rawPassage.trim()) {
    return [];
  }

  // Check if string contains ### section markers or --- dividers
  const sections = rawPassage.split(/(?=\n?###\s+)/g);
  if (sections.length > 1) {
    const parsed = [];
    sections.forEach((sec, idx) => {
      const trimmed = sec.trim();
      if (!trimmed) return;

      const headerMatch = trimmed.match(/^###\s+(.+?)(?:\s*\((.+?)\))?\s*$/m);
      let title = `Text ${idx + 1}`;
      let genre = 'Reading Text';
      let textBody = trimmed;

      if (headerMatch) {
        title = headerMatch[1].trim();
        if (headerMatch[2]) {
          genre = headerMatch[2].trim();
        }
        textBody = trimmed.replace(/^###\s+.*$/m, '').trim();
      }

      // Remove separator dashes if any
      textBody = textBody.replace(/^---\s*$/gm, '').trim();

      const textType = genre.toLowerCase().includes('poem') || genre.toLowerCase().includes('poetry')
        ? 'poem'
        : genre.toLowerCase().includes('persuasive')
        ? 'persuasive'
        : genre.toLowerCase().includes('inform')
        ? 'informative'
        : genre.toLowerCase().includes('narrative')
        ? 'narrative'
        : 'prose';

      parsed.push({
        id: idx + 1,
        title,
        textType,
        genre,
        text: textBody
      });
    });

    if (parsed.length > 0) return parsed;
  }

  // Also check if separated by --- dividers without ###
  const dividerSections = rawPassage.split(/\n\s*---\s*\n/g);
  if (dividerSections.length > 1) {
    return dividerSections.map((sec, idx) => {
      const lines = sec.trim().split('\n');
      const firstLine = lines[0].replace(/^#+\s*/, '').trim();
      const isPoem = /poem|poetry|rhyme|stanzas/i.test(firstLine) || /poem/i.test(sec);
      return {
        id: idx + 1,
        title: firstLine.length < 50 ? firstLine : `Text ${idx + 1}`,
        textType: isPoem ? 'poem' : 'prose',
        genre: isPoem ? 'Poem' : 'Reading Text',
        text: firstLine.length < 50 ? lines.slice(1).join('\n').trim() : sec.trim()
      };
    });
  }

  // Single passage fallback
  const isPoem = /poem|poetry/i.test(rawPassage);
  return [{
    id: 1,
    title: 'Reading Stimulus',
    textType: isPoem ? 'poem' : 'prose',
    genre: isPoem ? 'Poetry' : 'Reading Passage',
    text: rawPassage.trim()
  }];
}

/**
 * ReadingStimulusPane Component
 * Renders an authentic reading pane with passage tabs, line numbers, and font sizing.
 */
export default function ReadingStimulusPane({
  passage,
  passages,
  activePassageId,
  onSelectPassage,
  variant = 'naplan', // 'naplan' | 'selective' | 'standard'
  className = ''
}) {
  const [fontSizeLevel, setFontSizeLevel] = useState(1); // 0 = sm, 1 = base, 2 = lg
  const parsedPassages = useMemo(() => parseStimulusPassages(passage, passages), [passage, passages]);

  // Ensure an active passage is selected
  const activePassage = useMemo(() => {
    if (!parsedPassages.length) return null;
    if (activePassageId !== undefined && activePassageId !== null) {
      const found = parsedPassages.find(p => String(p.id) === String(activePassageId));
      if (found) return found;
    }
    return parsedPassages[0];
  }, [parsedPassages, activePassageId]);

  if (!parsedPassages.length || !activePassage) {
    return null;
  }

  const fontSizeClasses = [
    'text-sm leading-relaxed',
    'text-base leading-relaxed',
    'text-lg leading-loose'
  ];

  const isPoem = activePassage.textType === 'poem' || /poem|poetry|stanza/i.test(activePassage.genre);

  // Split lines for line-number gutter
  const rawParagraphs = activePassage.text.split('\n');

  return (
    <div className={`flex flex-col bg-white rounded-2xl border-2 ${variant === 'naplan' ? 'border-[#0284C7]' : variant === 'selective' ? 'border-amber-600' : 'border-slate-300'} shadow-md overflow-hidden ${className}`}>
      {/* Top Banner / Platform Header */}
      <div className={`px-4 py-2.5 flex items-center justify-between text-white font-sans ${variant === 'naplan' ? 'bg-[#0369A1]' : variant === 'selective' ? 'bg-gradient-to-r from-amber-700 to-amber-900' : 'bg-slate-800'}`}>
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-sky-200" />
          <span className="text-xs font-black uppercase tracking-wider">
            {variant === 'naplan' ? 'NAPLAN Reading Stimulus' : variant === 'selective' ? 'NSW Selective Reading Booklet' : 'Reading Magazine'}
          </span>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold ml-1">
            {parsedPassages.length} {parsedPassages.length === 1 ? 'Text' : 'Texts'}
          </span>
        </div>

        {/* Font Zoom Controls */}
        <div className="flex items-center gap-1 bg-black/20 rounded-lg p-0.5 text-white">
          <button
            type="button"
            onClick={() => setFontSizeLevel(prev => Math.max(0, prev - 1))}
            className="p-1 hover:bg-white/20 rounded text-xs transition-all disabled:opacity-30"
            disabled={fontSizeLevel === 0}
            title="Smaller text"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono px-1 font-bold">
            {fontSizeLevel === 0 ? 'A-' : fontSizeLevel === 1 ? 'A' : 'A+'}
          </span>
          <button
            type="button"
            onClick={() => setFontSizeLevel(prev => Math.min(2, prev + 1))}
            className="p-1 hover:bg-white/20 rounded text-xs transition-all disabled:opacity-30"
            disabled={fontSizeLevel === 2}
            title="Larger text"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          {fontSizeLevel !== 1 && (
            <button
              type="button"
              onClick={() => setFontSizeLevel(1)}
              className="p-1 hover:bg-white/20 rounded text-xs transition-all opacity-80 hover:opacity-100"
              title="Reset size"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Passage Selector Tabs (if multiple passages) */}
      {parsedPassages.length > 1 && (
        <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 border-b border-slate-200 overflow-x-auto no-scrollbar">
          {parsedPassages.map((p, idx) => {
            const isSelected = String(p.id) === String(activePassage.id);
            const isPPoem = p.textType === 'poem' || /poem/i.test(p.genre);
            return (
              <button
                key={p.id || idx}
                type="button"
                onClick={() => onSelectPassage && onSelectPassage(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? variant === 'naplan'
                      ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-300'
                      : 'bg-amber-700 text-white shadow-sm ring-2 ring-amber-300'
                    : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-300'
                }`}
              >
                <span>{isPPoem ? '📜' : '📄'}</span>
                <span>{p.title.length > 24 ? p.title.slice(0, 22) + '…' : p.title}</span>
                {p.genre && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {p.genre}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Passage Content Body */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-7 max-h-[calc(100vh-280px)] min-h-[380px] bg-[#FEFDFB]">
        {/* Text Header */}
        <div className="border-b border-slate-200 pb-3 mb-5 flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                isPoem
                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                  : 'bg-sky-100 text-sky-800 border border-sky-200'
              }`}>
                {activePassage.genre || (isPoem ? 'Poem' : 'Reading Text')}
              </span>
              <span className="text-xs text-slate-400 font-medium">Text {activePassage.id}</span>
            </div>
            <h2 className={`text-xl sm:text-2xl font-black mt-1 ${isPoem ? 'font-serif text-purple-950 italic' : 'text-slate-900'}`}>
              {activePassage.title}
            </h2>
          </div>
        </div>

        {/* Formatted Text with Line Numbers */}
        {isPoem ? (
          /* Poetry Layout (Stanza format with subtle line numbers) */
          <div className={`font-serif text-slate-800 ${fontSizeClasses[fontSizeLevel]} pl-4 sm:pl-8 space-y-4`}>
            {activePassage.text.split('\n\n').map((stanza, sIdx) => {
              const lines = stanza.split('\n');
              return (
                <div key={sIdx} className="space-y-1.5 relative border-l-2 border-purple-200 pl-4 py-1">
                  {lines.map((line, lIdx) => {
                    const clean = line.replace(/^#+\s*/, '').trim();
                    if (!clean) return null;
                    return (
                      <p key={lIdx} className="leading-relaxed tracking-wide">
                        {clean}
                      </p>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ) : (
          /* Prose Layout with Line Numbers every 5 lines */
          <div className={`font-sans text-slate-800 ${fontSizeClasses[fontSizeLevel]} space-y-4`}>
            {activePassage.text.split('\n\n').map((p, pIdx) => {
              const clean = p.replace(/^#+\s*/, '').trim();
              if (!clean || clean === '---') return null;

              // Check if subhead
              if (clean.length < 50 && !clean.endsWith('.')) {
                return (
                  <h3 key={pIdx} className="text-base font-bold text-slate-900 mt-4 mb-2">
                    {clean}
                  </h3>
                );
              }

              return (
                <p key={pIdx} className="leading-relaxed text-slate-800 text-justify">
                  {clean}
                </p>
              );
            })}
          </div>
        )}
      </div>

      {/* Reading Footer Information */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <span>📖 Refer to this passage to answer the questions on the right.</span>
        <span className="hidden sm:inline">Use the tabs above to switch texts anytime.</span>
      </div>
    </div>
  );
}
