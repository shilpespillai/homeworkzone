import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Plus, Minus, RotateCcw, Sparkles } from 'lucide-react';

export default function InteractiveFunctionGrapher({
  targetSlope = 2,
  targetIntercept = 1,
  instruction,
  onAnswerChange,
  studentAnswer,
  disabled = false
}) {
  const mTarget = parseFloat(targetSlope) || 2;
  const cTarget = parseFloat(targetIntercept) || 1;

  const [slope, setSlope] = useState(1);
  const [intercept, setIntercept] = useState(0);

  // Sync to parent
  useEffect(() => {
    if (onAnswerChange) {
      onAnswerChange(`m=${slope},c=${intercept}`);
    }
  }, [slope, intercept, onAnswerChange]);

  const handleReset = () => {
    if (disabled) return;
    setSlope(1);
    setIntercept(0);
  };

  // SVG Geometry
  const size = 300;
  const padding = 30;
  const gridMin = -5;
  const gridMax = 5;
  const range = gridMax - gridMin;
  const stepPx = (size - 2 * padding) / range;
  const originX = padding + (-gridMin) * stepPx;
  const originY = padding + gridMax * stepPx;

  const pointToPx = (x, y) => ({
    pxX: originX + x * stepPx,
    pxY: originY - y * stepPx
  });

  // Calculate endpoints for current line y = mx + c
  const p1 = pointToPx(-5, slope * -5 + intercept);
  const p2 = pointToPx(5, slope * 5 + intercept);

  return (
    <div className="w-full bg-gradient-to-b from-blue-50/40 to-indigo-50/30 border-2 border-blue-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-blue-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white font-black px-3 py-1 rounded-xl text-xs uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Linear Function Grapher
            </span>
            <span className="text-xs font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-xl">
              Target: y = {mTarget}x {cTarget >= 0 ? `+ ${cTarget}` : `- ${Math.abs(cTarget)}`}
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-800 mt-2">
            {instruction || `Graph the line y = ${mTarget}x ${cTarget >= 0 ? `+ ${cTarget}` : `- ${Math.abs(cTarget)}`}.`}
          </h3>
        </div>

        {!disabled && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset Sliders
          </button>
        )}
      </div>

      {/* SVG Function Canvas */}
      <div className="flex justify-center p-4 bg-white rounded-2xl border border-blue-100 shadow-sm overflow-x-auto">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="select-none">
          {/* Grid lines */}
          {Array.from({ length: range + 1 }).map((_, i) => {
            const pos = padding + i * stepPx;
            return (
              <g key={i}>
                <line x1={pos} y1={padding} x2={pos} y2={size - padding} stroke="#E2E8F0" strokeWidth="1" />
                <line x1={padding} y1={pos} x2={size - padding} y2={pos} stroke="#E2E8F0" strokeWidth="1" />
              </g>
            );
          })}

          {/* Axes */}
          <line x1={padding} y1={originY} x2={size - padding} y2={originY} stroke="#334155" strokeWidth="2.5" />
          <line x1={originX} y1={padding} x2={originX} y2={size - padding} stroke="#334155" strokeWidth="2.5" />

          {/* Function Line */}
          <line
            x1={p1.pxX}
            y1={p1.pxY}
            x2={p2.pxX}
            y2={p2.pxY}
            stroke="#2563EB"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Y-Intercept Point */}
          {(() => {
            const intPt = pointToPx(0, intercept);
            return <circle cx={intPt.pxX} cy={intPt.pxY} r="6" fill="#EC4899" stroke="#FFFFFF" strokeWidth="2" />;
          })()}
        </svg>
      </div>

      {/* Sliders & Equation Box */}
      <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-400 uppercase">Your Equation:</span>
          <span className="text-xl font-black text-blue-600 font-mono bg-blue-50 px-4 py-1 rounded-xl border border-blue-200">
            y = {slope}x {intercept >= 0 ? `+ ${intercept}` : `- ${Math.abs(intercept)}`}
          </span>
        </div>

        {!disabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Slope Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-black text-slate-600">
                <span>Slope (m): {slope}</span>
              </div>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.5"
                value={slope}
                onChange={(e) => setSlope(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Y-Intercept Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-black text-slate-600">
                <span>Y-Intercept (c): {intercept}</span>
              </div>
              <input
                type="range"
                min="-5"
                max="5"
                step="1"
                value={intercept}
                onChange={(e) => setIntercept(parseFloat(e.target.value))}
                className="w-full accent-pink-600"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
