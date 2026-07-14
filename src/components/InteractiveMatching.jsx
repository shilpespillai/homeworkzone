import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * InteractiveMatching
 * 
 * A proper "Match the Following" component:
 *  - Left column: questions/prompts (fixed order)
 *  - Right column: answers (scrambled)
 *  - Student clicks a left item, then a right item to form a pair
 *  - NO wrong-answer feedback — any connection is accepted (homework mode)
 *  - Matched pairs are highlighted with a unique color and connected by a line
 *  - Student can unmatch by clicking a matched item again
 */
export default function InteractiveMatching({ pairs, onMatch, disabled, reviewMatches }) {
  const [leftItems, setLeftItems]   = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null); // left index
  // matches: array of { leftIdx, rightIdx, color }
  const [matches, setMatches]       = useState([]);
  const svgRef                      = useRef(null);
  const containerRef                = useRef(null);
  const leftRefs                    = useRef([]);
  const rightRefs                    = useRef([]);

  const PAIR_COLORS = [
    { line: '#6366f1', bg: 'bg-indigo-100', border: 'border-indigo-400', text: 'text-indigo-700' },
    { line: '#f59e0b', bg: 'bg-amber-100',  border: 'border-amber-400',  text: 'text-amber-700' },
    { line: '#10b981', bg: 'bg-emerald-100',border: 'border-emerald-400',text: 'text-emerald-700' },
    { line: '#ef4444', bg: 'bg-rose-100',   border: 'border-rose-400',   text: 'text-rose-700' },
    { line: '#8b5cf6', bg: 'bg-violet-100', border: 'border-violet-400', text: 'text-violet-700' },
  ];

  useEffect(() => {
    if (!pairs) return;
    const lefts = [], rights = [];
    pairs.forEach(pair => {
      const parts = pair.split('||');
      if (parts.length === 2) { lefts.push(parts[0]); rights.push(parts[1]); }
    });
    setLeftItems(lefts);
    setRightItems([...rights].sort(() => Math.random() - 0.5));
    setSelectedLeft(null);
    setMatches([]);
  }, [pairs]);

  // In review mode: show correct connections from reviewMatches string
  useEffect(() => {
    if (!reviewMatches || !leftItems.length || !rightItems.length) return;
    const reviewPairs = reviewMatches.split(',').map(s => s.trim());
    const built = [];
    const usedRightIndices = new Set();

    reviewPairs.forEach((rp, i) => {
      const parts = rp.split('||');
      if (parts.length !== 2) return;
      const leftText = parts[0].trim();
      const rightText = parts[1].trim();

      const leftIdx = leftItems.indexOf(leftText);
      const rightIdx = rightItems.findIndex((val, idx) => val === rightText && !usedRightIndices.has(idx));

      if (leftIdx !== -1 && rightIdx !== -1) {
        usedRightIndices.add(rightIdx);
        built.push({
          leftIdx,
          rightIdx,
          color: PAIR_COLORS[i % PAIR_COLORS.length]
        });
      }
    });
    setMatches(built);
  }, [reviewMatches, leftItems, rightItems]);

  const reportMatches = useCallback((updatedMatches) => {
    if (!onMatch) return;
    // Report as "Left||Right, Left||Right" string
    const str = updatedMatches.map(m => {
      const leftText = leftItems[m.leftIdx];
      const rightText = rightItems[m.rightIdx];
      return `${leftText}||${rightText}`;
    }).join(', ');
    onMatch(str ? [str] : []);
  }, [onMatch, leftItems, rightItems]);

  const handleLeftClick = (idx) => {
    if (disabled) return;
    // If already matched, unmatch it
    const existingMatch = matches.find(m => m.leftIdx === idx);
    if (existingMatch) {
      const updated = matches.filter(m => m.leftIdx !== idx);
      setMatches(updated);
      reportMatches(updated);
      return;
    }
    setSelectedLeft(idx === selectedLeft ? null : idx);
  };

  const handleRightClick = (idx) => {
    if (disabled) return;
    // If already matched, unmatch it
    const existingMatch = matches.find(m => m.rightIdx === idx);
    if (existingMatch) {
      const updated = matches.filter(m => m.rightIdx !== idx);
      setMatches(updated);
      reportMatches(updated);
      setSelectedLeft(null);
      return;
    }
    if (selectedLeft === null) return;
    // Make the match
    const colorIdx = matches.length % PAIR_COLORS.length;
    const newMatch = { leftIdx: selectedLeft, rightIdx: idx, color: PAIR_COLORS[colorIdx] };
    const updated = [...matches, newMatch];
    setMatches(updated);
    reportMatches(updated);
    setSelectedLeft(null);
  };

  // Draw SVG lines between matched pairs
  const [lines, setLines] = useState([]);
  const updateLines = useCallback(() => {
    if (!containerRef.current || !svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();

    const newLines = matches.map(match => {
      const leftEl   = leftRefs.current[match.leftIdx];
      const rightEl  = rightRefs.current[match.rightIdx];
      if (!leftEl || !rightEl) return null;
      const lr = leftEl.getBoundingClientRect();
      const rr = rightEl.getBoundingClientRect();
      return {
        x1: lr.right - svgRect.left,
        y1: lr.top + lr.height / 2 - svgRect.top,
        x2: rr.left - svgRect.left,
        y2: rr.top + rr.height / 2 - svgRect.top,
        color: match.color.line,
      };
    }).filter(Boolean);
    setLines(newLines);
  }, [matches]);

  useEffect(() => {
    updateLines();
    window.addEventListener('resize', updateLines);
    return () => window.removeEventListener('resize', updateLines);
  }, [updateLines]);

  if (!pairs || pairs.length === 0) return null;

  return (
    <div ref={containerRef} className="relative w-full max-w-3xl mx-auto select-none py-4">
      {/* Hint text */}
      {!disabled && (
        <p className="text-center text-sm font-bold text-slate-400 mb-5 tracking-wide uppercase">
          Tap a left item, then a right item to connect them. Tap a connected item to undo.
        </p>
      )}

      {/* The grid */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-x-2 items-start">
        
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          {leftItems.map((item, idx) => {
            const match   = matches.find(m => m.leftIdx === idx);
            const isSelected = selectedLeft === idx && !match;
            const c = match?.color;
            return (
              <button
                key={`left-${idx}`}
                ref={el => { leftRefs.current[idx] = el; }}
                onClick={() => handleLeftClick(idx)}
                disabled={disabled}
                className={`
                  w-full p-4 rounded-2xl border-4 text-base font-bold text-left transition-all duration-200
                  ${match
                    ? `${c.bg} ${c.border} ${c.text} shadow-md`
                    : isSelected
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-800 shadow-lg ring-4 ring-indigo-200'
                      : 'bg-white border-slate-200 text-slate-700 shadow-sm hover:border-indigo-300 hover:shadow-md'
                  }
                  ${disabled ? 'cursor-default' : 'cursor-pointer'}
                `}
              >
                <span className="flex items-center gap-3">
                  {match && <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: c.line }} />}
                  {!match && isSelected && <span className="w-3 h-3 rounded-full flex-shrink-0 bg-indigo-400 animate-pulse" />}
                  {item}
                </span>
              </button>
            );
          })}
        </div>

        {/* SVG connector lines */}
        <div className="relative self-stretch" style={{ minWidth: 60 }}>
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            style={{ zIndex: 10 }}
          >
            {lines.map((l, i) => (
              <g key={i}>
                <line
                  x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                  stroke={l.color} strokeWidth="3" strokeLinecap="round"
                  strokeDasharray="0"
                  opacity="0.9"
                />
                <circle cx={l.x1} cy={l.y1} r="5" fill={l.color} />
                <circle cx={l.x2} cy={l.y2} r="5" fill={l.color} />
              </g>
            ))}
          </svg>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          {rightItems.map((item, idx) => {
            const match   = matches.find(m => m.rightIdx === idx);
            const c = match?.color;
            return (
              <button
                key={`right-${idx}`}
                ref={el => { rightRefs.current[idx] = el; }}
                onClick={() => handleRightClick(idx)}
                disabled={disabled}
                className={`
                  w-full p-4 rounded-2xl border-4 text-base font-bold text-left transition-all duration-200
                  ${match
                    ? `${c.bg} ${c.border} ${c.text} shadow-md`
                    : selectedLeft !== null
                      ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-sm hover:border-amber-400 hover:shadow-md ring-2 ring-amber-100'
                      : 'bg-white border-slate-200 text-slate-700 shadow-sm hover:border-amber-300 hover:shadow-md'
                  }
                  ${disabled ? 'cursor-default' : 'cursor-pointer'}
                `}
              >
                <span className="flex items-center gap-3">
                  {match && <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: c.line }} />}
                  {item}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Match counter */}
      {!disabled && (
        <p className="mt-6 text-center text-sm font-bold text-slate-500">
          {matches.length} of {leftItems.length} matched
        </p>
      )}
    </div>
  );
}
