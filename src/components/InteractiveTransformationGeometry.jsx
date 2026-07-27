import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Move, RotateCw, RefreshCw, RotateCcw, Sparkles } from 'lucide-react';

export default function InteractiveTransformationGeometry({
  targetTransform = 'Translate (2, 3)',
  targetShiftX = 2,
  targetShiftY = 3,
  instruction,
  onAnswerChange,
  studentAnswer,
  disabled = false
}) {
  const reqX = parseInt(targetShiftX, 10) || 2;
  const reqY = parseInt(targetShiftY, 10) || 3;

  const [shiftX, setShiftX] = useState(0);
  const [shiftY, setShiftY] = useState(0);

  // Sync to parent
  useEffect(() => {
    if (onAnswerChange) {
      onAnswerChange(`dx=${shiftX},dy=${shiftY}`);
    }
  }, [shiftX, shiftY, onAnswerChange]);

  const handleReset = () => {
    if (disabled) return;
    setShiftX(0);
    setShiftY(0);
  };

  // SVG Geometry
  const size = 260;
  const padding = 20;
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

  // Base Triangle Vertices: (1,1), (3,1), (1,3)
  const basePts = [
    pointToPx(1, 1),
    pointToPx(3, 1),
    pointToPx(1, 3)
  ];
  const basePointsStr = basePts.map((p) => `${p.pxX},${p.pxY}`).join(' ');

  // Transformed Triangle Vertices
  const transPts = [
    pointToPx(1 + shiftX, 1 + shiftY),
    pointToPx(3 + shiftX, 1 + shiftY),
    pointToPx(1 + shiftX, 3 + shiftY)
  ];
  const transPointsStr = transPts.map((p) => `${p.pxX},${p.pxY}`).join(' ');

  return (
    <div className="w-full bg-gradient-to-b from-cyan-50/40 to-blue-50/30 border-2 border-cyan-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-cyan-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-cyan-600 text-white font-black px-3 py-1 rounded-xl text-xs uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Transformation Geometry
            </span>
            <span className="text-xs font-black text-cyan-700 bg-cyan-100 px-3 py-1 rounded-xl">
              Target Shift: (+{reqX}, +{reqY})
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-800 mt-2">
            {instruction || `Translate the shape by (+${reqX}, +${reqY}).`}
          </h3>
        </div>

        {!disabled && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset Shape
          </button>
        )}
      </div>

      {/* Grid Canvas */}
      <div className="flex justify-center p-4 bg-white rounded-2xl border border-cyan-100 shadow-sm">
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

          {/* Original Shape (Ghost) */}
          <polygon points={basePointsStr} fill="#94A3B8" fillOpacity="0.3" stroke="#64748B" strokeWidth="2" strokeDasharray="4 4" />

          {/* Transformed Shape */}
          <polygon points={transPointsStr} fill="#06B6D4" fillOpacity="0.8" stroke="#0891B2" strokeWidth="3" />
        </svg>
      </div>

      {/* Transformation Controls */}
      <div className="bg-white p-4 rounded-2xl border border-cyan-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-400 uppercase">Current Shift:</span>
          <span className="text-xl font-black text-cyan-600 font-mono bg-cyan-50 px-4 py-0.5 rounded-xl border border-cyan-200">
            dx: {shiftX >= 0 ? `+${shiftX}` : shiftX}, dy: {shiftY >= 0 ? `+${shiftY}` : shiftY}
          </span>
        </div>

        {!disabled && (
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-black text-slate-400">Horizontal (dx)</span>
              <div className="flex gap-1">
                <button onClick={() => setShiftX((x) => Math.max(-5, x - 1))} className="px-2 py-1 bg-slate-100 rounded-lg font-black text-xs text-slate-700">-1</button>
                <button onClick={() => setShiftX((x) => Math.min(5, x + 1))} className="px-2 py-1 bg-cyan-600 rounded-lg font-black text-xs text-white shadow-sm">+1</button>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-black text-slate-400">Vertical (dy)</span>
              <div className="flex gap-1">
                <button onClick={() => setShiftY((y) => Math.max(-5, y - 1))} className="px-2 py-1 bg-slate-100 rounded-lg font-black text-xs text-slate-700">-1</button>
                <button onClick={() => setShiftY((y) => Math.min(5, y + 1))} className="px-2 py-1 bg-cyan-600 rounded-lg font-black text-xs text-white shadow-sm">+1</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
