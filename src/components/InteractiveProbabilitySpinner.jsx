import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Play, Sparkles } from 'lucide-react';

export default function InteractiveProbabilitySpinner({
  targetProbability = '1/4',
  targetColor = 'Red',
  instruction,
  onAnswerChange,
  studentAnswer,
  disabled = false
}) {
  const numSlices = 8;
  const COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B']; // Red, Blue, Green, Amber

  // Map of slice index -> color hex
  const [sliceColors, setSliceColors] = useState(() => {
    if (studentAnswer) {
      try {
        if (typeof studentAnswer === 'string' && studentAnswer.startsWith('{')) {
          return JSON.parse(studentAnswer);
        }
      } catch (e) {}
    }
    return {
      0: '#EF4444',
      1: '#3B82F6',
      2: '#10B981',
      3: '#F59E0B',
      4: '#3B82F6',
      5: '#10B981',
      6: '#3B82F6',
      7: '#F59E0B'
    };
  });

  const [activeColor, setActiveColor] = useState('#EF4444');

  // Count red slices
  const redCount = Object.values(sliceColors).filter((c) => c === '#EF4444').length;
  const currentProbStr = `${redCount}/${numSlices}`;

  // Sync answer to parent
  useEffect(() => {
    if (onAnswerChange) {
      onAnswerChange(JSON.stringify(sliceColors));
    }
  }, [sliceColors, onAnswerChange]);

  const handleToggleSlice = (idx) => {
    if (disabled) return;
    setSliceColors((prev) => ({ ...prev, [idx]: activeColor }));
  };

  const handleReset = () => {
    if (disabled) return;
    setSliceColors({
      0: '#EF4444',
      1: '#3B82F6',
      2: '#10B981',
      3: '#F59E0B',
      4: '#3B82F6',
      5: '#10B981',
      6: '#3B82F6',
      7: '#F59E0B'
    });
  };

  // Helper function to generate SVG sector paths
  const getSectorPath = (cx, cy, r, startAngle, endAngle) => {
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="w-full bg-gradient-to-b from-rose-50/40 to-orange-50/30 border-2 border-rose-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-rose-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-rose-600 text-white font-black px-3 py-1 rounded-xl text-xs uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Probability Wheel Spinner
            </span>
            <span className="text-xs font-black text-rose-700 bg-rose-100 px-3 py-1 rounded-xl">
              Target P(Red): {targetProbability}
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-800 mt-2">
            {instruction || `Paint the spinner slices so P(Red) = ${targetProbability}.`}
          </h3>
        </div>

        {!disabled && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset Wheel
          </button>
        )}
      </div>

      {/* Paint Color Palette */}
      {!disabled && (
        <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl border border-rose-100 shadow-sm">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Paint Color:</span>
          <div className="flex gap-2">
            {COLORS.map((hex) => (
              <button
                key={hex}
                onClick={() => setActiveColor(hex)}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  activeColor === hex ? 'ring-2 ring-rose-500 ring-offset-2 scale-110' : ''
                }`}
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        </div>
      )}

      {/* SVG Spinner Wheel */}
      <div className="flex justify-center p-4 bg-white rounded-2xl border border-rose-100 shadow-sm relative">
        <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-md select-none">
          <circle cx="100" cy="100" r="95" fill="#1E293B" />
          {Array.from({ length: numSlices }).map((_, idx) => {
            const startAngle = (idx * 360) / numSlices;
            const endAngle = ((idx + 1) * 360) / numSlices;
            const hex = sliceColors[idx] || '#EF4444';
            return (
              <path
                key={idx}
                d={getSectorPath(100, 100, 90, startAngle, endAngle)}
                fill={hex}
                stroke="#1E293B"
                strokeWidth="2"
                className={`transition-colors ${disabled ? '' : 'cursor-pointer hover:opacity-85'}`}
                onClick={() => handleToggleSlice(idx)}
              />
            );
          })}
          {/* Spinner Center Pin */}
          <circle cx="100" cy="100" r="10" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" />
        </svg>
      </div>

      {/* Readout Status */}
      <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-rose-100 shadow-sm text-xs font-bold text-slate-600">
        <span className="text-slate-400 uppercase font-black">Current P(Red):</span>
        <span className="text-xl font-black text-rose-600 font-mono bg-rose-50 px-4 py-0.5 rounded-xl border border-rose-200">
          {redCount} / {numSlices} ({((redCount / numSlices) * 100).toFixed(0)}%)
        </span>
      </div>
    </div>
  );
}
