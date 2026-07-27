import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scale, Plus, Minus, RotateCcw, Sparkles } from 'lucide-react';

export default function InteractiveBalanceScale({
  targetEquation = '2x + 4 = 10',
  targetX = 3,
  instruction,
  onAnswerChange,
  studentAnswer,
  disabled = false
}) {
  const targetVal = parseInt(targetX, 10) || 3;

  // Initial state: student sets value for x
  const initialX = studentAnswer ? parseInt(studentAnswer, 10) || 0 : 0;
  const [valX, setValX] = useState(initialX);

  // Sync to parent
  useEffect(() => {
    if (onAnswerChange) {
      onAnswerChange(String(valX));
    }
  }, [valX, onAnswerChange]);

  const handleReset = () => {
    if (disabled) return;
    setValX(0);
  };

  // Compute left and right weights
  // Left side: 2 * x + 4
  // Right side: 10
  const leftWeight = 2 * valX + 4;
  const rightWeight = 10;

  // Calculate tilt angle (-15 deg to +15 deg)
  const diff = leftWeight - rightWeight;
  const tiltAngle = Math.max(-15, Math.min(15, diff * 3));
  const isBalanced = leftWeight === rightWeight;

  return (
    <div className="w-full bg-gradient-to-b from-rose-50/40 to-amber-50/30 border-2 border-rose-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-rose-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-rose-500 text-white font-black px-3 py-1 rounded-xl text-xs uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Algebraic Balance Scale
            </span>
            <span className="text-xs font-black text-rose-700 bg-rose-100 px-3 py-1 rounded-xl">
              Equation: {targetEquation}
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-800 mt-2">
            {instruction || `Find the value of x to balance the scale: ${targetEquation}`}
          </h3>
        </div>

        {!disabled && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset Scale
          </button>
        )}
      </div>

      {/* Balance Scale SVG Canvas */}
      <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-rose-100 shadow-sm relative min-h-[220px]">
        <svg width="340" height="180" viewBox="0 0 340 180" className="select-none overflow-visible">
          {/* Base Support Fulcrum */}
          <polygon points="170,120 150,170 190,170" fill="#64748B" />
          <circle cx="170" cy="120" r="6" fill="#1E293B" />

          {/* Tilting Beam */}
          <motion.g
            animate={{ rotate: tiltAngle }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{ transformOrigin: '170px 120px' }}
          >
            {/* Beam Bar */}
            <rect x="50" y="117" width="240" height="6" fill="#334155" rx="3" />

            {/* Left Pan Hanger */}
            <line x1="70" y1="120" x2="70" y2="150" stroke="#94A3B8" strokeWidth="2" />
            <polygon points="40,150 100,150 90,158 50,158" fill="#E2E8F0" stroke="#CBD5E1" />

            {/* Right Pan Hanger */}
            <line x1="270" y1="120" x2="270" y2="150" stroke="#94A3B8" strokeWidth="2" />
            <polygon points="240,150 300,150 290,158 250,158" fill="#E2E8F0" stroke="#CBD5E1" />

            {/* Left Pan Weights Label */}
            <text x="70" y="142" textAnchor="middle" className="text-xs font-black fill-rose-600">
              Left: {leftWeight}
            </text>

            {/* Right Pan Weights Label */}
            <text x="270" y="142" textAnchor="middle" className="text-xs font-black fill-blue-600">
              Right: {rightWeight}
            </text>
          </motion.g>
        </svg>

        {/* Balance Status Badge */}
        <div
          className={`mt-2 px-4 py-1.5 rounded-full font-black text-xs transition-all ${
            isBalanced
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 scale-105 shadow-sm'
              : 'bg-amber-100 text-amber-700 border border-amber-300'
          }`}
        >
          {isBalanced ? '⚖️ Scale Balanced! (Correct)' : '⚖️ Scale Unbalanced'}
        </div>
      </div>

      {/* Control Box to adjust x */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-5 py-3 rounded-2xl border border-rose-100 shadow-sm gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-400 uppercase">Set value of x:</span>
          <span className="text-2xl font-black text-rose-600 font-mono bg-rose-50 px-4 py-0.5 rounded-xl border border-rose-200">
            x = {valX}
          </span>
        </div>

        {!disabled && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setValX((v) => Math.max(0, v - 1))}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-black text-xs"
            >
              <Minus className="w-3.5 h-3.5" /> Decrease x
            </button>
            <button
              onClick={() => setValX((v) => Math.min(20, v + 1))}
              className="flex items-center gap-1 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-black text-xs shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Increase x
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
