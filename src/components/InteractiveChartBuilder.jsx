import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Plus, Minus, RotateCcw, Sparkles } from 'lucide-react';

export default function InteractiveChartBuilder({
  categories = ['Apples', 'Bananas', 'Oranges'],
  targetData = { Apples: 4, Bananas: 7, Oranges: 3 },
  instruction,
  onAnswerChange,
  studentAnswer,
  disabled = false
}) {
  const catList = Array.isArray(categories) ? categories : ['Apples', 'Bananas', 'Oranges'];

  const initialHeights = (() => {
    if (studentAnswer) {
      try {
        if (typeof studentAnswer === 'string' && studentAnswer.startsWith('{')) {
          return JSON.parse(studentAnswer);
        }
      } catch (e) {}
    }
    const res = {};
    catList.forEach((c) => (res[c] = 0));
    return res;
  })();

  const [barValues, setBarValues] = useState(initialHeights);

  // Sync answer to parent
  useEffect(() => {
    if (onAnswerChange) {
      onAnswerChange(JSON.stringify(barValues));
    }
  }, [barValues, onAnswerChange]);

  const handleAdjust = (cat, delta) => {
    if (disabled) return;
    setBarValues((prev) => ({
      ...prev,
      [cat]: Math.max(0, Math.min(10, (prev[cat] || 0) + delta))
    }));
  };

  const handleReset = () => {
    if (disabled) return;
    const res = {};
    catList.forEach((c) => (res[c] = 0));
    setBarValues(res);
  };

  const maxScale = 10;
  const BAR_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

  return (
    <div className="w-full bg-gradient-to-b from-indigo-50/40 to-cyan-50/30 border-2 border-indigo-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-indigo-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-white font-black px-3 py-1 rounded-xl text-xs uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Bar Chart Builder
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-800 mt-2">
            {instruction || `Build a bar chart matching the frequency data.`}
          </h3>
        </div>

        {!disabled && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset Bars
          </button>
        )}
      </div>

      {/* Bar Chart Canvas */}
      <div className="flex justify-center items-end h-64 p-4 bg-white rounded-2xl border border-indigo-100 shadow-sm gap-6 overflow-x-auto">
        {catList.map((cat, idx) => {
          const val = barValues[cat] || 0;
          const heightPercent = (val / maxScale) * 100;
          const color = BAR_COLORS[idx % BAR_COLORS.length];
          return (
            <div key={cat} className="flex flex-col items-center flex-1 max-w-[80px] h-full justify-end">
              <span className="text-xs font-black text-slate-700 mb-1 font-mono">{val}</span>
              <motion.div
                animate={{ height: `${heightPercent}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="w-full rounded-t-xl shadow-md border-t-2 border-white/50"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs font-black text-slate-500 mt-2 truncate w-full text-center">{cat}</span>
            </div>
          );
        })}
      </div>

      {/* Adjust Controls */}
      {!disabled && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {catList.map((cat) => (
            <div key={cat} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 truncate mr-2">{cat}:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleAdjust(cat, -1)}
                  className="p-1 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-700"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-black w-6 text-center">{barValues[cat] || 0}</span>
                <button
                  onClick={() => handleAdjust(cat, 1)}
                  className="p-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
