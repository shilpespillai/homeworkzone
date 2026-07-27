import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Sparkles } from 'lucide-react';

export default function InteractiveQuadraticParabola({
  targetH = 2,
  targetK = -3,
  instruction,
  onAnswerChange,
  studentAnswer,
  disabled = false
}) {
  const reqH = parseFloat(targetH) || 2;
  const reqK = parseFloat(targetK) || -3;

  const [h, setH] = useState(0);
  const [k, setK] = useState(0);

  // Sync to parent
  useEffect(() => {
    if (onAnswerChange) {
      onAnswerChange(`h=${h},k=${k}`);
    }
  }, [h, k, onAnswerChange]);

  const handleReset = () => {
    if (disabled) return;
    setH(0);
    setK(0);
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

  // Calculate curve points for y = (x-h)^2 + k
  const curvePoints = [];
  for (let x = -5; x <= 5; x += 0.2) {
    const y = (x - h) * (x - h) + k;
    const pt = pointToPx(x, y);
    curvePoints.push(`${pt.pxX},${pt.pxY}`);
  }
  const pathD = `M ${curvePoints.join(' L ')}`;

  const vertexPt = pointToPx(h, k);

  return (
    <div className="w-full bg-gradient-to-b from-purple-50/40 to-pink-50/30 border-2 border-purple-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-600 text-white font-black px-3 py-1 rounded-xl text-xs uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Quadratic Parabola Grapher
            </span>
            <span className="text-xs font-black text-purple-700 bg-purple-100 px-3 py-1 rounded-xl">
              Target Vertex: ({reqH}, {reqK})
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-800 mt-2">
            {instruction || `Graph the parabola with vertex (${reqH}, ${reqK}).`}
          </h3>
        </div>

        {!disabled && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset Parabola
          </button>
        )}
      </div>

      {/* SVG Canvas */}
      <div className="flex justify-center p-4 bg-white rounded-2xl border border-purple-100 shadow-sm overflow-x-auto">
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

          {/* Parabola Curve */}
          <path d={pathD} fill="none" stroke="#9333EA" strokeWidth="3.5" strokeLinecap="round" />

          {/* Vertex Point */}
          <circle cx={vertexPt.pxX} cy={vertexPt.pxY} r="7" fill="#EC4899" stroke="#FFFFFF" strokeWidth="2" />
        </svg>
      </div>

      {/* Vertex Sliders */}
      <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between font-black text-xs">
          <span className="text-slate-400 uppercase">Current Equation & Vertex:</span>
          <span className="text-purple-700 font-mono text-sm bg-purple-50 px-3 py-1 rounded-xl border border-purple-200">
            y = (x {h >= 0 ? `- ${h}` : `+ ${Math.abs(h)}`})² {k >= 0 ? `+ ${k}` : `- ${Math.abs(k)}`} | Vertex: ({h}, {k})
          </span>
        </div>

        {!disabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-black text-slate-600 block">Vertex X (h): {h}</span>
              <input
                type="range"
                min="-5"
                max="5"
                step="1"
                value={h}
                onChange={(e) => setH(parseFloat(e.target.value))}
                className="w-full accent-purple-600"
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-black text-slate-600 block">Vertex Y (k): {k}</span>
              <input
                type="range"
                min="-5"
                max="5"
                step="1"
                value={k}
                onChange={(e) => setK(parseFloat(e.target.value))}
                className="w-full accent-pink-600"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
