import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Grid, RotateCcw, Sparkles } from 'lucide-react';

export default function InteractiveGridAreaPainter({
  targetArea = 12,
  rows = 5,
  cols = 6,
  instruction,
  onAnswerChange,
  studentAnswer,
  disabled = false
}) {
  const target = parseInt(targetArea, 10) || 12;

  // Matrix state: map of "r-c" -> true
  const [paintedCells, setPaintedCells] = useState(() => {
    if (studentAnswer) {
      try {
        if (typeof studentAnswer === 'string' && studentAnswer.startsWith('{')) {
          return JSON.parse(studentAnswer);
        }
      } catch (e) {}
    }
    return {};
  });

  const areaCount = Object.keys(paintedCells).length;

  // Compute perimeter of painted cells
  const calculatePerimeter = () => {
    let p = 0;
    Object.keys(paintedCells).forEach((key) => {
      const [rStr, cStr] = key.split('-');
      const r = parseInt(rStr, 10);
      const c = parseInt(cStr, 10);

      // Check 4 edges
      if (!paintedCells[`${r - 1}-${c}`]) p++;
      if (!paintedCells[`${r + 1}-${c}`]) p++;
      if (!paintedCells[`${r}-${c - 1}`]) p++;
      if (!paintedCells[`${r}-${c + 1}`]) p++;
    });
    return p;
  };

  const perimeterCount = calculatePerimeter();

  // Sync answer to parent
  useEffect(() => {
    if (onAnswerChange) {
      onAnswerChange(JSON.stringify(paintedCells));
    }
  }, [paintedCells, onAnswerChange]);

  const handleToggleCell = (r, c) => {
    if (disabled) return;
    const key = `${r}-${c}`;
    setPaintedCells((prev) => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = true;
      return next;
    });
  };

  const handleReset = () => {
    if (disabled) return;
    setPaintedCells({});
  };

  return (
    <div className="w-full bg-gradient-to-b from-blue-50/40 to-cyan-50/30 border-2 border-blue-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-blue-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white font-black px-3 py-1 rounded-xl text-xs uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Grid Area & Perimeter
            </span>
            <span className="text-xs font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-xl">
              Target Area: {target} sq units
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-800 mt-2">
            {instruction || `Paint a shape with an area of ${target} square units.`}
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

      {/* Grid Canvas */}
      <div className="flex justify-center p-4 bg-white rounded-2xl border border-blue-100 shadow-sm overflow-x-auto">
        <div
          className="grid gap-1.5 p-2 bg-slate-100 rounded-2xl"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((_, c) => {
              const key = `${r}-${c}`;
              const isPainted = Boolean(paintedCells[key]);
              return (
                <button
                  key={key}
                  onClick={() => handleToggleCell(r, c)}
                  disabled={disabled}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl transition-all duration-150 border-2 ${
                    isPainted
                      ? 'bg-blue-500 border-blue-700 shadow-md scale-95'
                      : 'bg-white border-slate-200 hover:border-blue-400'
                  }`}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Live Readout Stats */}
      <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-blue-100 shadow-sm text-xs font-bold text-slate-600">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 uppercase font-black">Painted Area:</span>
          <span className="text-xl font-black text-blue-600 font-mono bg-blue-50 px-3 py-0.5 rounded-xl border border-blue-200">
            {areaCount} sq units
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 uppercase font-black">Perimeter:</span>
          <span className="text-xl font-black text-indigo-600 font-mono bg-indigo-50 px-3 py-0.5 rounded-xl border border-indigo-200">
            {perimeterCount} units
          </span>
        </div>
      </div>
    </div>
  );
}
