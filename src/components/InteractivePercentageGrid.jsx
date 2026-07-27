import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Grid, RotateCcw, Sparkles } from 'lucide-react';

export default function InteractivePercentageGrid({
  targetPercentage = '45%',
  instruction,
  onAnswerChange,
  studentAnswer,
  disabled = false
}) {
  const parsePct = (val) => {
    if (!val) return 45;
    const num = parseInt(String(val).replace('%', '').trim(), 10);
    return isNaN(num) ? 45 : num;
  };

  const target = parsePct(targetPercentage);

  // Array of 100 tiles state
  const [tiles, setTiles] = useState(() => {
    if (studentAnswer) {
      try {
        if (typeof studentAnswer === 'string' && studentAnswer.startsWith('{')) {
          return JSON.parse(studentAnswer);
        }
      } catch (e) {}
    }
    return {};
  });

  const coloredCount = Object.keys(tiles).length;

  // Sync to parent
  useEffect(() => {
    if (onAnswerChange) {
      onAnswerChange(JSON.stringify(tiles));
    }
  }, [tiles, onAnswerChange]);

  const handleToggleTile = (idx) => {
    if (disabled) return;
    setTiles((prev) => {
      const next = { ...prev };
      if (next[idx]) delete next[idx];
      else next[idx] = true;
      return next;
    });
  };

  const handleReset = () => {
    if (disabled) return;
    setTiles({});
  };

  return (
    <div className="w-full bg-gradient-to-b from-teal-50/40 to-emerald-50/30 border-2 border-teal-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-teal-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-teal-600 text-white font-black px-3 py-1 rounded-xl text-xs uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Percentage Hundred Grid
            </span>
            <span className="text-xs font-black text-teal-700 bg-teal-100 px-3 py-1 rounded-xl">
              Target: {target}%
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-800 mt-2">
            {instruction || `Color ${target}% of the 100-grid below.`}
          </h3>
        </div>

        {!disabled && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Clear Grid
          </button>
        )}
      </div>

      {/* 10x10 Grid Canvas */}
      <div className="flex justify-center p-4 bg-white rounded-2xl border border-teal-100 shadow-sm overflow-x-auto">
        <div className="grid grid-cols-10 gap-1 p-2 bg-slate-100 rounded-xl max-w-xs sm:max-w-md w-full">
          {Array.from({ length: 100 }).map((_, idx) => {
            const isColored = Boolean(tiles[idx]);
            return (
              <button
                key={idx}
                onClick={() => handleToggleTile(idx)}
                disabled={disabled}
                className={`aspect-square rounded-md transition-all border ${
                  isColored ? 'bg-teal-500 border-teal-700 shadow-sm scale-95' : 'bg-white border-slate-200 hover:border-teal-400'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Readout Status */}
      <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-teal-100 shadow-sm text-xs font-bold text-slate-600">
        <span className="text-slate-400 uppercase font-black">Colored Fraction:</span>
        <span className="text-xl font-black text-teal-600 font-mono bg-teal-50 px-4 py-0.5 rounded-xl border border-teal-200">
          {coloredCount} / 100 = {coloredCount}% = {(coloredCount / 100).toFixed(2)}
        </span>
      </div>
    </div>
  );
}
