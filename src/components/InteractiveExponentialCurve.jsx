import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, RotateCcw, Sparkles } from 'lucide-react';

export default function InteractiveExponentialCurve({
  targetBase = 2,
  instruction,
  onAnswerChange,
  studentAnswer,
  disabled = false
}) {
  const reqB = parseFloat(targetBase) || 2;

  const [base, setBase] = useState(1.5);

  // Sync to parent
  useEffect(() => {
    if (onAnswerChange) {
      onAnswerChange(`b=${base}`);
    }
  }, [base, onAnswerChange]);

  const handleReset = () => {
    if (disabled) return;
    setBase(1.5);
  };

  // SVG Geometry
  const size = 300;
  const padding = 30;
  const gridMin = -4;
  const gridMax = 8;
  const range = gridMax - gridMin;
  const stepPx = (size - 2 * padding) / range;
  const originX = padding + (-gridMin) * stepPx;
  const originY = padding + gridMax * stepPx;

  const pointToPx = (x, y) => ({
    pxX: originX + x * stepPx,
    pxY: originY - y * stepPx
  });

  // Points for y = b^x
  const curvePoints = [];
  for (let x = -4; x <= 3; x += 0.2) {
    const y = Math.pow(base, x);
    const pt = pointToPx(x, y);
    curvePoints.push(`${pt.pxX},${pt.pxY}`);
  }
  const pathD = `M ${curvePoints.join(' L ')}`;

  return (
    <div className="w-full bg-gradient-to-b from-blue-50/40 to-cyan-50/30 border-2 border-blue-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-blue-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white font-black px-3 py-1 rounded-xl text-xs uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Exponential Growth Grapher
            </span>
            <span className="text-xs font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-xl">
              Target Base: {reqB} (y = {reqB}^x)
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-800 mt-2">
            {instruction || `Graph the exponential curve y = ${reqB}^x.`}
          </h3>
        </div>

        {!disabled && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset Base
          </button>
        )}
      </div>

      {/* SVG Canvas */}
      <div className="flex justify-center p-4 bg-white rounded-2xl border border-blue-100 shadow-sm overflow-x-auto">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="select-none">
          {/* Axes */}
          <line x1={padding} y1={originY} x2={size - padding} y2={originY} stroke="#334155" strokeWidth="2.5" />
          <line x1={originX} y1={padding} x2={originX} y2={size - padding} stroke="#334155" strokeWidth="2.5" />

          {/* Exponential Curve */}
          <path d={pathD} fill="none" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Base Control */}
      <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm flex items-center justify-between">
        <span className="text-xs font-black text-slate-400 uppercase">Equation Base (b):</span>
        <span className="text-xl font-black text-blue-600 font-mono bg-blue-50 px-4 py-0.5 rounded-xl border border-blue-200">
          y = {base}^x
        </span>
        {!disabled && (
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.5"
            value={base}
            onChange={(e) => setBase(parseFloat(e.target.value))}
            className="w-36 accent-blue-600"
          />
        )}
      </div>
    </div>
  );
}
