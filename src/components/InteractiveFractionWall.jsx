import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, RotateCcw, Sparkles } from 'lucide-react';

export default function InteractiveFractionWall({
  targetFraction = '1/2',
  instruction,
  onAnswerChange,
  studentAnswer,
  disabled = false
}) {
  const [selectedBlocks, setSelectedBlocks] = useState(() => {
    if (studentAnswer) {
      try {
        if (typeof studentAnswer === 'string' && studentAnswer.startsWith('{')) {
          return JSON.parse(studentAnswer);
        }
      } catch (e) {}
    }
    return {};
  });

  // Fraction rows definition
  const rows = [
    { den: 1, label: '1', color: 'bg-rose-500 text-white border-rose-600' },
    { den: 2, label: '1/2', color: 'bg-orange-500 text-white border-orange-600' },
    { den: 3, label: '1/3', color: 'bg-amber-500 text-white border-amber-600' },
    { den: 4, label: '1/4', color: 'bg-emerald-500 text-white border-emerald-600' },
    { den: 6, label: '1/6', color: 'bg-teal-500 text-white border-teal-600' },
    { den: 8, label: '1/8', color: 'bg-indigo-500 text-white border-indigo-600' },
    { den: 12, label: '1/12', color: 'bg-purple-500 text-white border-purple-600' },
  ];

  // Calculate total selected fraction value
  const calculateTotalVal = () => {
    let sum = 0;
    Object.keys(selectedBlocks).forEach((key) => {
      const [denStr] = key.split('-');
      const den = parseInt(denStr, 10);
      if (den > 0) sum += 1 / den;
    });
    return Math.round(sum * 1000) / 1000;
  };

  const totalVal = calculateTotalVal();

  // Sync to parent
  useEffect(() => {
    if (onAnswerChange) {
      onAnswerChange(JSON.stringify(selectedBlocks));
    }
  }, [selectedBlocks, onAnswerChange]);

  const handleToggle = (den, idx) => {
    if (disabled) return;
    const key = `${den}-${idx}`;
    setSelectedBlocks((prev) => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = true;
      return next;
    });
  };

  const handleReset = () => {
    if (disabled) return;
    setSelectedBlocks({});
  };

  return (
    <div className="w-full bg-gradient-to-b from-orange-50/40 to-amber-50/30 border-2 border-orange-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-orange-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-orange-500 text-white font-black px-3 py-1 rounded-xl text-xs uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Fraction Wall Explorer
            </span>
            <span className="text-xs font-black text-orange-700 bg-orange-100 px-3 py-1 rounded-xl">
              Target: {targetFraction}
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-800 mt-2">
            {instruction || `Select fraction strips equivalent to ${targetFraction}.`}
          </h3>
        </div>

        {!disabled && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset Wall
          </button>
        )}
      </div>

      {/* Fraction Wall Grid */}
      <div className="space-y-2 bg-white p-4 rounded-2xl border border-orange-100 shadow-sm overflow-x-auto">
        {rows.map((r) => (
          <div key={r.den} className="flex w-full gap-1">
            {Array.from({ length: r.den }).map((_, idx) => {
              const key = `${r.den}-${idx}`;
              const isSelected = Boolean(selectedBlocks[key]);
              return (
                <button
                  key={key}
                  onClick={() => handleToggle(r.den, idx)}
                  disabled={disabled}
                  className={`flex-1 py-2 sm:py-3 text-center text-xs font-black rounded-lg transition-all duration-150 border-2 ${
                    isSelected
                      ? `${r.color} ring-2 ring-orange-400 ring-offset-1 scale-[0.98] shadow-md`
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Live Readout Stats */}
      <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-orange-100 shadow-sm text-xs font-bold text-slate-600">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 uppercase font-black">Selected Total:</span>
          <span className="text-xl font-black text-orange-600 font-mono bg-orange-50 px-3 py-0.5 rounded-xl border border-orange-200">
            {totalVal}
          </span>
        </div>
      </div>
    </div>
  );
}
