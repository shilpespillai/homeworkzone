import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Sparkles } from 'lucide-react';

export default function InteractiveStemLeafPlot({
  data = [12, 15, 18, 22, 25, 31, 34],
  instruction,
  onAnswerChange,
  studentAnswer,
  disabled = false
}) {
  const dataList = Array.isArray(data) ? data : [12, 15, 18, 22, 25, 31, 34];

  // Map of num -> stemId
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

  const handlePlaceNumber = (val, stem) => {
    if (disabled) return;
    setPlacements((prev) => ({ ...prev, [val]: stem }));
  };

  const handleReset = () => {
    if (disabled) return;
    setPlacements({});
  };

  const stems = [1, 2, 3, 4];

  return (
    <div className="w-full bg-gradient-to-b from-indigo-50/40 to-cyan-50/30 border-2 border-indigo-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-indigo-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-white font-black px-3 py-1 rounded-xl text-xs uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Stem-and-Leaf Plot Builder
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-800 mt-2">
            {instruction || `Place data leaves onto their matching stems.`}
          </h3>
        </div>

        {!disabled && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset Plot
          </button>
        )}
      </div>

      {/* Unsorted Leaves Pool */}
      <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm space-y-2">
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">Raw Data Pool</span>
        <div className="flex flex-wrap gap-2 min-h-[48px] items-center p-2 bg-slate-50 rounded-xl">
          {dataList.map((val, idx) => {
            const currentStem = placements[val];
            const leafVal = val % 10;
            return (
              <div key={idx} className="flex items-center gap-1 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-sm">
                <span className="font-black text-xs text-slate-700">{val}</span>
                {!disabled && (
                  <div className="flex gap-1 ml-1">
                    {stems.map((s) => (
                      <button
                        key={s}
                        onClick={() => handlePlaceNumber(val, s)}
                        className={`w-5 h-5 rounded text-[10px] font-black ${
                          currentStem === s ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-indigo-100'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stem-and-Leaf Table Canvas */}
      <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm space-y-2">
        <div className="flex border-b-2 border-indigo-600 pb-2 text-xs font-black uppercase text-indigo-700">
          <span className="w-20 text-center border-r-2 border-indigo-600">Stem</span>
          <span className="pl-4">Leaf</span>
        </div>
        {stems.map((s) => {
          const matchingLeaves = dataList.filter((val) => placements[val] === s).map((val) => val % 10);
          return (
            <div key={s} className="flex items-center py-2 border-b border-slate-100 text-sm font-black">
              <span className="w-20 text-center font-mono text-slate-800 border-r-2 border-indigo-200">{s}</span>
              <div className="pl-4 flex gap-2 font-mono text-indigo-600">
                {matchingLeaves.map((l, i) => (
                  <span key={i} className="px-2 py-0.5 bg-indigo-50 rounded border border-indigo-100">{l}</span>
                ))}
                {matchingLeaves.length === 0 && <span className="text-xs text-slate-300 font-normal">None</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
