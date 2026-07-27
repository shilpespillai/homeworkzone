import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, RotateCcw, Sparkles } from 'lucide-react';

export default function InteractiveVennDiagram({
  setALabel = 'Multiples of 2',
  setBLabel = 'Multiples of 3',
  items = ['2', '3', '6', '9', '12'],
  instruction,
  onAnswerChange,
  studentAnswer,
  disabled = false
}) {
  const itemList = Array.isArray(items) ? items : ['2', '3', '6', '9', '12'];

  // Map of itemId -> 'unassigned' | 'A' | 'B' | 'both'
  const [placements, setPlacements] = useState(() => {
    if (studentAnswer) {
      try {
        if (typeof studentAnswer === 'string' && studentAnswer.startsWith('{')) {
          return JSON.parse(studentAnswer);
        }
      } catch (e) {}
    }
    return {};
  });

  // Sync to parent
  useEffect(() => {
    if (onAnswerChange) {
      onAnswerChange(JSON.stringify(placements));
    }
  }, [placements, onAnswerChange]);

  const handleCyclePlacement = (item) => {
    if (disabled) return;
    setPlacements((prev) => {
      const current = prev[item] || 'unassigned';
      let next = 'A';
      if (current === 'A') next = 'both';
      else if (current === 'both') next = 'B';
      else if (current === 'B') next = 'unassigned';
      return { ...prev, [item]: next };
    });
  };

  const handleReset = () => {
    if (disabled) return;
    setPlacements({});
  };

  return (
    <div className="w-full bg-gradient-to-b from-indigo-50/40 to-purple-50/30 border-2 border-indigo-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-indigo-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-white font-black px-3 py-1 rounded-xl text-xs uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Venn Diagram Sorter
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-800 mt-2">
            {instruction || `Sort items into ${setALabel}, ${setBLabel}, or the Intersection.`}
          </h3>
        </div>

        {!disabled && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset Sorter
          </button>
        )}
      </div>

      {/* Unsorted Items Pool */}
      <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm space-y-2">
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">
          Items to Sort (Click item to move through sets)
        </span>
        <div className="flex flex-wrap gap-2 min-h-[48px] items-center p-2 bg-slate-50 rounded-xl">
          {itemList.map((item) => {
            const pos = placements[item] || 'unassigned';
            return (
              <button
                key={item}
                onClick={() => handleCyclePlacement(item)}
                disabled={disabled}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all shadow-sm flex items-center gap-1 ${
                  pos === 'A'
                    ? 'bg-blue-500 text-white'
                    : pos === 'both'
                    ? 'bg-purple-600 text-white'
                    : pos === 'B'
                    ? 'bg-pink-500 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {item}
                <span className="text-[10px] opacity-75 font-normal">
                  ({pos === 'unassigned' ? 'Pool' : pos === 'both' ? 'A∩B' : pos})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Overlapping Venn Circles Graphic */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-white rounded-2xl border border-indigo-100 shadow-sm">
        {/* Set A Only */}
        <div className="bg-blue-50/60 p-4 rounded-2xl border-2 border-blue-200 flex flex-col items-center min-h-[140px]">
          <span className="text-xs font-black text-blue-700 uppercase mb-3">{setALabel} Only</span>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {itemList.filter((i) => placements[i] === 'A').map((i) => (
              <span key={i} className="px-2.5 py-1 bg-blue-500 text-white rounded-lg text-xs font-black shadow-sm">
                {i}
              </span>
            ))}
          </div>
        </div>

        {/* Intersection (A & B) */}
        <div className="bg-purple-50/60 p-4 rounded-2xl border-2 border-purple-200 flex flex-col items-center min-h-[140px]">
          <span className="text-xs font-black text-purple-700 uppercase mb-3">Both (Intersection A ∩ B)</span>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {itemList.filter((i) => placements[i] === 'both').map((i) => (
              <span key={i} className="px-2.5 py-1 bg-purple-600 text-white rounded-lg text-xs font-black shadow-sm">
                {i}
              </span>
            ))}
          </div>
        </div>

        {/* Set B Only */}
        <div className="bg-pink-50/60 p-4 rounded-2xl border-2 border-pink-200 flex flex-col items-center min-h-[140px]">
          <span className="text-xs font-black text-pink-700 uppercase mb-3">{setBLabel} Only</span>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {itemList.filter((i) => placements[i] === 'B').map((i) => (
              <span key={i} className="px-2.5 py-1 bg-pink-500 text-white rounded-lg text-xs font-black shadow-sm">
                {i}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
