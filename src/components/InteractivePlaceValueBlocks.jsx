import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, Plus, Minus, RotateCcw, Sparkles } from 'lucide-react';

export default function InteractivePlaceValueBlocks({
  targetNumber = 342,
  instruction,
  onAnswerChange,
  studentAnswer,
  disabled = false
}) {
  const target = parseInt(targetNumber, 10) || 342;

  // Initialize counts
  const [hundreds, setHundreds] = useState(0);
  const [tens, setTens] = useState(0);
  const [ones, setOnes] = useState(0);

  // Sync with studentAnswer if present
  useEffect(() => {
    if (studentAnswer) {
      const val = parseInt(studentAnswer, 10);
      if (!isNaN(val)) {
        const h = Math.floor(val / 100);
        const t = Math.floor((val % 100) / 10);
        const o = val % 10;
        setHundreds(h);
        setTens(t);
        setOnes(o);
      }
    }
  }, []);

  // Compute total value
  const totalVal = hundreds * 100 + tens * 10 + ones;

  // Notify parent
  useEffect(() => {
    if (onAnswerChange) {
      onAnswerChange(String(totalVal));
    }
  }, [totalVal, onAnswerChange]);

  const handleReset = () => {
    if (disabled) return;
    setHundreds(0);
    setTens(0);
    setOnes(0);
  };

  return (
    <div className="w-full bg-gradient-to-b from-amber-50/40 to-orange-50/30 border-2 border-amber-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-white font-black px-3 py-1 rounded-xl text-xs uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Base-10 Blocks
            </span>
            <span className="text-xs font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-xl">
              Target: {target}
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-800 mt-2">
            {instruction || `Build the number ${target} using Base-10 blocks.`}
          </h3>
        </div>

        {!disabled && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset Blocks
          </button>
        )}
      </div>

      {/* Place Value Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hundreds (Flats) */}
        <div className="bg-white p-4 rounded-2xl border-2 border-blue-200 shadow-sm flex flex-col items-center justify-between space-y-4">
          <div className="flex items-center justify-between w-full border-b border-slate-100 pb-2">
            <span className="text-xs font-black text-blue-600 uppercase tracking-wider">
              Hundreds (100s)
            </span>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              Count: {hundreds}
            </span>
          </div>

          {/* SVG Visual Representation for Hundreds Flat */}
          <div className="flex flex-wrap gap-2 justify-center min-h-[100px] items-center p-2 bg-blue-50/50 rounded-xl w-full">
            {Array.from({ length: hundreds }).map((_, idx) => (
              <svg key={idx} width="42" height="42" viewBox="0 0 40 40" className="drop-shadow-sm">
                <rect x="2" y="2" width="36" height="36" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" rx="3" />
                <path d="M 2 14 L 38 14 M 2 26 L 38 26 M 14 2 L 14 38 M 26 2 L 26 38" stroke="#60A5FA" strokeWidth="1" />
              </svg>
            ))}
            {hundreds === 0 && (
              <span className="text-xs text-slate-400 font-bold">No hundreds added</span>
            )}
          </div>

          {!disabled && (
            <div className="flex gap-2 w-full">
              <button
                onClick={() => setHundreds((h) => Math.max(0, h - 1))}
                className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-black text-xs flex justify-center items-center gap-1"
              >
                <Minus className="w-3.5 h-3.5" /> 100
              </button>
              <button
                onClick={() => setHundreds((h) => Math.min(9, h + 1))}
                className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs flex justify-center items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> 100
              </button>
            </div>
          )}
        </div>

        {/* Tens (Rods) */}
        <div className="bg-white p-4 rounded-2xl border-2 border-emerald-200 shadow-sm flex flex-col items-center justify-between space-y-4">
          <div className="flex items-center justify-between w-full border-b border-slate-100 pb-2">
            <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">
              Tens (10s)
            </span>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              Count: {tens}
            </span>
          </div>

          {/* SVG Visual Representation for Tens Rod */}
          <div className="flex flex-wrap gap-2 justify-center min-h-[100px] items-center p-2 bg-emerald-50/50 rounded-xl w-full">
            {Array.from({ length: tens }).map((_, idx) => (
              <svg key={idx} width="14" height="50" viewBox="0 0 14 50" className="drop-shadow-sm">
                <rect x="2" y="2" width="10" height="46" fill="#10B981" stroke="#047857" strokeWidth="2" rx="2" />
                <line x1="2" y1="11" x2="12" y2="11" stroke="#6EE7B7" strokeWidth="1" />
                <line x1="2" y1="20" x2="12" y2="20" stroke="#6EE7B7" strokeWidth="1" />
                <line x1="2" y1="29" x2="12" y2="29" stroke="#6EE7B7" strokeWidth="1" />
                <line x1="2" y1="38" x2="12" y2="38" stroke="#6EE7B7" strokeWidth="1" />
              </svg>
            ))}
            {tens === 0 && (
              <span className="text-xs text-slate-400 font-bold">No tens added</span>
            )}
          </div>

          {!disabled && (
            <div className="flex gap-2 w-full">
              <button
                onClick={() => setTens((t) => Math.max(0, t - 1))}
                className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-black text-xs flex justify-center items-center gap-1"
              >
                <Minus className="w-3.5 h-3.5" /> 10
              </button>
              <button
                onClick={() => setTens((t) => Math.min(9, t + 1))}
                className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs flex justify-center items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> 10
              </button>
            </div>
          )}
        </div>

        {/* Ones (Cubes) */}
        <div className="bg-white p-4 rounded-2xl border-2 border-orange-200 shadow-sm flex flex-col items-center justify-between space-y-4">
          <div className="flex items-center justify-between w-full border-b border-slate-100 pb-2">
            <span className="text-xs font-black text-orange-600 uppercase tracking-wider">
              Ones (1s)
            </span>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
              Count: {ones}
            </span>
          </div>

          {/* SVG Visual Representation for Ones Cube */}
          <div className="flex flex-wrap gap-2 justify-center min-h-[100px] items-center p-2 bg-orange-50/50 rounded-xl w-full">
            {Array.from({ length: ones }).map((_, idx) => (
              <svg key={idx} width="16" height="16" viewBox="0 0 16 16" className="drop-shadow-sm">
                <rect x="2" y="2" width="12" height="12" fill="#F97316" stroke="#C2410C" strokeWidth="2" rx="2" />
              </svg>
            ))}
            {ones === 0 && (
              <span className="text-xs text-slate-400 font-bold">No ones added</span>
            )}
          </div>

          {!disabled && (
            <div className="flex gap-2 w-full">
              <button
                onClick={() => setOnes((o) => Math.max(0, o - 1))}
                className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-black text-xs flex justify-center items-center gap-1"
              >
                <Minus className="w-3.5 h-3.5" /> 1
              </button>
              <button
                onClick={() => setOnes((o) => Math.min(9, o + 1))}
                className="flex-1 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black text-xs flex justify-center items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> 1
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Summary Live Calculation Bar */}
      <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-amber-200 shadow-sm text-sm">
        <span className="font-bold text-slate-600">
          Equation: <span className="font-mono text-slate-800 font-black">{hundreds}00 + {tens}0 + {ones}</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-400 uppercase">Your Total:</span>
          <span className="text-2xl font-black text-amber-600 font-mono bg-amber-50 px-3 py-0.5 rounded-xl border border-amber-200">
            {totalVal}
          </span>
        </div>
      </div>
    </div>
  );
}
