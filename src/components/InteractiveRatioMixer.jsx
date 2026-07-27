import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Beaker, Plus, Minus, RotateCcw, Sparkles } from 'lucide-react';

export default function InteractiveRatioMixer({
  targetRatio = '2:3',
  instruction,
  onAnswerChange,
  studentAnswer,
  disabled = false
}) {
  const [partA, setPartA] = useState(1);
  const [partB, setPartB] = useState(1);

  // Sync answer to parent
  useEffect(() => {
    if (onAnswerChange) {
      onAnswerChange(`${partA}:${partB}`);
    }
  }, [partA, partB, onAnswerChange]);

  const handleReset = () => {
    if (disabled) return;
    setPartA(1);
    setPartB(1);
  };

  const totalParts = partA + partB;
  const percentA = (partA / totalParts) * 100;
  const percentB = (partB / totalParts) * 100;

  return (
    <div className="w-full bg-gradient-to-b from-amber-50/40 to-orange-50/30 border-2 border-amber-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-white font-black px-3 py-1 rounded-xl text-xs uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Ratio Liquid Mixer
            </span>
            <span className="text-xs font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-xl">
              Target Ratio: {targetRatio}
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-800 mt-2">
            {instruction || `Mix Liquid A and Liquid B in the ratio ${targetRatio}.`}
          </h3>
        </div>

        {!disabled && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset Beaker
          </button>
        )}
      </div>

      {/* Beaker Graphic & Controls */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* SVG Beaker Visualizer */}
        <div className="relative w-48 h-56 bg-white rounded-b-3xl border-4 border-slate-300 shadow-md p-2 flex flex-col justify-end overflow-hidden">
          {/* Liquid B (Bottom Layer - Yellow) */}
          <motion.div
            animate={{ height: `${percentB}%` }}
            className="w-full bg-amber-400 opacity-90 transition-all"
          />
          {/* Liquid A (Top Layer - Red) */}
          <motion.div
            animate={{ height: `${percentA}%` }}
            className="w-full bg-rose-500 opacity-90 transition-all"
          />
          <span className="absolute top-2 left-3 text-xs font-black text-slate-400">Beaker</span>
        </div>

        {/* Adjust Parts Controls */}
        <div className="space-y-4 bg-white p-5 rounded-2xl border border-amber-100 shadow-sm w-full max-w-xs">
          {/* Liquid A Control */}
          <div className="flex items-center justify-between bg-rose-50 p-3 rounded-xl border border-rose-200">
            <span className="text-xs font-black text-rose-700">Liquid A (Red):</span>
            <div className="flex items-center gap-2">
              {!disabled && (
                <button
                  onClick={() => setPartA((a) => Math.max(1, a - 1))}
                  className="p-1 bg-white rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
              )}
              <span className="text-sm font-black text-slate-800 w-6 text-center">{partA}</span>
              {!disabled && (
                <button
                  onClick={() => setPartA((a) => Math.min(10, a + 1))}
                  className="p-1 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Liquid B Control */}
          <div className="flex items-center justify-between bg-amber-50 p-3 rounded-xl border border-amber-200">
            <span className="text-xs font-black text-amber-700">Liquid B (Yellow):</span>
            <div className="flex items-center gap-2">
              {!disabled && (
                <button
                  onClick={() => setPartB((b) => Math.max(1, b - 1))}
                  className="p-1 bg-white rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
              )}
              <span className="text-sm font-black text-slate-800 w-6 text-center">{partB}</span>
              {!disabled && (
                <button
                  onClick={() => setPartB((b) => Math.min(10, b + 1))}
                  className="p-1 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-400 uppercase font-black">Current Ratio: </span>
            <span className="text-xl font-black text-amber-600 font-mono">{partA} : {partB}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
