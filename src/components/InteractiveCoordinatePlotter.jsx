import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, RotateCcw, Sparkles } from 'lucide-react';

export default function InteractiveCoordinatePlotter({
  targetPoint = '(3, 4)',
  instruction,
  onAnswerChange,
  studentAnswer,
  disabled = false
}) {
  // Parse target e.g. "(3, 4)"
  const parsePoint = (str) => {
    if (!str) return { x: 3, y: 4 };
    const matches = String(str).match(/-?\d+/g);
    if (matches && matches.length >= 2) {
      return { x: parseInt(matches[0], 10), y: parseInt(matches[1], 10) };
    }
    return { x: 3, y: 4 };
  };

  const targetObj = parsePoint(targetPoint);

  const initialPlotted = studentAnswer ? parsePoint(studentAnswer) : null;
  const [plottedPoint, setPlottedPoint] = useState(initialPlotted);

  // Sync to parent
  useEffect(() => {
    if (onAnswerChange) {
      const val = plottedPoint ? `(${plottedPoint.x}, ${plottedPoint.y})` : '';
      onAnswerChange(val);
    }
  }, [plottedPoint, onAnswerChange]);

  const handleReset = () => {
    if (disabled) return;
    setPlottedPoint(null);
  };

  // SVG Geometry
  const size = 320;
  const padding = 30;
  const gridMin = -5;
  const gridMax = 5;
  const range = gridMax - gridMin;
  const stepPx = (size - 2 * padding) / range;
  const originX = padding + (-gridMin) * stepPx;
  const originY = padding + gridMax * stepPx;

  const pointToPx = (x, y) => {
    return {
      pxX: originX + x * stepPx,
      pxY: originY - y * stepPx
    };
  };

  const handleGridClick = (xVal, yVal) => {
    if (disabled) return;
    setPlottedPoint({ x: xVal, y: yVal });
  };

  return (
    <div className="w-full bg-gradient-to-b from-indigo-50/40 to-cyan-50/30 border-2 border-indigo-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-indigo-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-white font-black px-3 py-1 rounded-xl text-xs uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Cartesian Grid Plotter
            </span>
            <span className="text-xs font-black text-indigo-700 bg-indigo-100 px-3 py-1 rounded-xl">
              Target: ({targetObj.x}, {targetObj.y})
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-800 mt-2">
            {instruction || `Plot point (${targetObj.x}, ${targetObj.y}) on the grid.`}
          </h3>
        </div>

        {!disabled && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset Point
          </button>
        )}
      </div>

      {/* Cartesian Plane SVG */}
      <div className="flex justify-center p-4 bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-x-auto">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="select-none">
          {/* Grid Lines */}
          {Array.from({ length: range + 1 }).map((_, i) => {
            const val = gridMin + i;
            const pos = padding + i * stepPx;
            return (
              <g key={i}>
                {/* Vertical grid line */}
                <line x1={pos} y1={padding} x2={pos} y2={size - padding} stroke="#E2E8F0" strokeWidth="1" />
                {/* Horizontal grid line */}
                <line x1={padding} y1={pos} x2={size - padding} y2={pos} stroke="#E2E8F0" strokeWidth="1" />
              </g>
            );
          })}

          {/* Main X and Y Axes */}
          <line x1={padding} y1={originY} x2={size - padding} y2={originY} stroke="#334155" strokeWidth="3" />
          <line x1={originX} y1={padding} x2={originX} y2={size - padding} stroke="#334155" strokeWidth="3" />

          {/* Grid Intersection Click Targets */}
          {Array.from({ length: range + 1 }).map((_, i) => {
            const xVal = gridMin + i;
            return Array.from({ length: range + 1 }).map((_, j) => {
              const yVal = gridMax - j;
              const { pxX, pxY } = pointToPx(xVal, yVal);
              return (
                <circle
                  key={`${xVal}-${yVal}`}
                  cx={pxX}
                  cy={pxY}
                  r="12"
                  fill="transparent"
                  className={`transition-all ${disabled ? '' : 'cursor-pointer hover:fill-indigo-200/50'}`}
                  onClick={() => handleGridClick(xVal, yVal)}
                />
              );
            });
          })}

          {/* Plotted Point Indicator */}
          {plottedPoint && (() => {
            const { pxX, pxY } = pointToPx(plottedPoint.x, plottedPoint.y);
            return (
              <g>
                <circle cx={pxX} cy={pxY} r="8" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="3" className="shadow-lg" />
                <rect x={pxX - 25} y={pxY - 32} width="50" height="20" rx="6" fill="#312E81" />
                <text x={pxX} y={pxY - 18} textAnchor="middle" fill="#FFFFFF" className="text-[10px] font-black">
                  ({plottedPoint.x}, {plottedPoint.y})
                </text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Readout Status */}
      <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-indigo-100 shadow-sm text-xs font-bold text-slate-600">
        <span className="text-slate-400 uppercase font-black">Plotted Coordinate:</span>
        <span className="text-xl font-black text-indigo-600 font-mono bg-indigo-50 px-4 py-0.5 rounded-xl border border-indigo-200">
          {plottedPoint ? `(${plottedPoint.x}, ${plottedPoint.y})` : 'None selected'}
        </span>
      </div>
    </div>
  );
}
