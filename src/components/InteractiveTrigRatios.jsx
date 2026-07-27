import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Triangle, RotateCcw, Sparkles } from 'lucide-react';

export default function InteractiveTrigRatios({
  targetRatio = 'sin',
  targetVal = '3/5',
  instruction,
  onAnswerChange,
  studentAnswer,
  disabled = false
}) {
  const [selectedRatio, setSelectedRatio] = useState('sin');

  const opp = 3;
  const adj = 4;
  const hyp = 5;

  const sinVal = (opp / hyp).toFixed(2);
  const cosVal = (adj / hyp).toFixed(2);
  const tanVal = (opp / adj).toFixed(2);

  // Sync answer to parent
  useEffect(() => {
    if (onAnswerChange) {
      onAnswerChange(selectedRatio);
    }
  }, [selectedRatio, onAnswerChange]);

  const handleReset = () => {
    if (disabled) return;
    setSelectedRatio('sin');
  };

  return (
    <div className="w-full bg-gradient-to-b from-purple-50/40 to-indigo-50/30 border-2 border-purple-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-600 text-white font-black px-3 py-1 rounded-xl text-xs uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Trigonometry Ratios Explorer
            </span>
            <span className="text-xs font-black text-purple-700 bg-purple-100 px-3 py-1 rounded-xl">
              Target: {targetRatio.toUpperCase()}(θ) = {targetVal}
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-800 mt-2">
            {instruction || `Select the correct trig ratio for angle θ.`}
          </h3>
        </div>

        {!disabled && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset Selection
          </button>
        )}
      </div>

      {/* Right Triangle Canvas */}
      <div className="flex justify-center p-6 bg-white rounded-2xl border border-purple-100 shadow-sm">
        <svg width="240" height="180" viewBox="0 0 240 180" className="select-none">
          <polygon points="40,150 200,150 200,50" fill="#F3E8FF" stroke="#7C3AED" strokeWidth="3" />
          <rect x="185" y="135" width="15" height="15" fill="none" stroke="#7C3AED" strokeWidth="2" />
          
          {/* Angle θ arc */}
          <path d="M 70 150 A 30 30 0 0 0 62 136" fill="none" stroke="#EC4899" strokeWidth="3" />
          <text x="75" y="142" className="text-xs font-black fill-pink-600">θ</text>

          {/* Labels */}
          <text x="215" y="105" textAnchor="middle" className="text-xs font-black fill-purple-700">Opp = {opp}</text>
          <text x="120" y="170" textAnchor="middle" className="text-xs font-black fill-purple-700">Adj = {adj}</text>
          <text x="110" y="85" textAnchor="middle" className="text-xs font-black fill-indigo-600">Hyp = {hyp}</text>
        </svg>
      </div>

      {/* Ratio Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => !disabled && setSelectedRatio('sin')}
          className={`p-3 rounded-2xl border-2 font-black text-xs transition-all ${
            selectedRatio === 'sin' ? 'bg-purple-600 text-white border-purple-700 shadow-md scale-105' : 'bg-white text-slate-700 border-slate-200'
          }`}
        >
          sin(θ) = 3/5 ({sinVal})
        </button>
        <button
          onClick={() => !disabled && setSelectedRatio('cos')}
          className={`p-3 rounded-2xl border-2 font-black text-xs transition-all ${
            selectedRatio === 'cos' ? 'bg-purple-600 text-white border-purple-700 shadow-md scale-105' : 'bg-white text-slate-700 border-slate-200'
          }`}
        >
          cos(θ) = 4/5 ({cosVal})
        </button>
        <button
          onClick={() => !disabled && setSelectedRatio('tan')}
          className={`p-3 rounded-2xl border-2 font-black text-xs transition-all ${
            selectedRatio === 'tan' ? 'bg-purple-600 text-white border-purple-700 shadow-md scale-105' : 'bg-white text-slate-700 border-slate-200'
          }`}
        >
          tan(θ) = 3/4 ({tanVal})
        </button>
      </div>
    </div>
  );
}
