import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus, Minus, RotateCcw, Sparkles } from 'lucide-react';

export default function InteractiveNumberLinePlotter({
  targetValue = 4,
  min = -5,
  max = 10,
  step = 1,
  instruction,
  onAnswerChange,
  studentAnswer,
  disabled = false
}) {
  const target = parseFloat(targetValue) || 4;
  const minVal = parseFloat(min);
  const maxVal = parseFloat(max);
  const stepVal = parseFloat(step) || 1;

  const initialVal = studentAnswer !== undefined && studentAnswer !== '' ? parseFloat(studentAnswer) : 0;
  const [currentVal, setCurrentVal] = useState(initialVal);

  // Sync to parent
  useEffect(() => {
    if (onAnswerChange) {
      onAnswerChange(String(currentVal));
    }
  }, [currentVal, onAnswerChange]);

  const handleReset = () => {
    if (disabled) return;
    setCurrentVal(0);
  };

  const adjustVal = (delta) => {
    if (disabled) return;
    setCurrentVal((v) => {
      const next = Math.round((v + delta) * 100) / 100;
      return Math.max(minVal, Math.min(maxVal, next));
    });
  };

  // SVG Calculations
  const width = 600;
  const height = 140;
  const paddingHorizontal = 40;
  const lineY = 80;
  const lineLength = width - 2 * paddingHorizontal;

  const valueToX = (val) => {
    const fraction = (val - minVal) / (maxVal - minVal);
    return paddingHorizontal + fraction * lineLength;
  };

  // Generate tick marks
  const tickCount = Math.floor((maxVal - minVal) / stepVal);
  const ticks = [];
  for (let i = 0; i <= tickCount; i++) {
    const val = minVal + i * stepVal;
    ticks.push(Math.round(val * 100) / 100);
  }

  const markerX = valueToX(currentVal);
  const zeroX = valueToX(0);

  return (
    <div className="w-full bg-gradient-to-b from-teal-50/40 to-emerald-50/30 border-2 border-teal-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-teal-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-teal-600 text-white font-black px-3 py-1 rounded-xl text-xs uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Number Line Plotter
            </span>
            <span className="text-xs font-black text-teal-700 bg-teal-100 px-3 py-1 rounded-xl">
              Target: {target}
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-800 mt-2">
            {instruction || `Plot ${target} on the number line.`}
          </h3>
        </div>

        {!disabled && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset Pin
          </button>
        )}
      </div>

      {/* SVG Canvas Number Line */}
      <div className="w-full bg-white p-4 rounded-2xl border border-teal-100 shadow-sm flex flex-col items-center overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-2xl select-none">
          {/* Main Axis Line */}
          <line
            x1={paddingHorizontal - 10}
            y1={lineY}
            x2={width - paddingHorizontal + 10}
            y2={lineY}
            stroke="#0F766E"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Left/Right Arrows */}
          <polygon
            points={`${paddingHorizontal - 15},${lineY} ${paddingHorizontal - 5},${lineY - 6} ${paddingHorizontal - 5},${lineY + 6}`}
            fill="#0F766E"
          />
          <polygon
            points={`${width - paddingHorizontal + 15},${lineY} ${width - paddingHorizontal + 5},${lineY - 6} ${width - paddingHorizontal + 5},${lineY + 6}`}
            fill="#0F766E"
          />

          {/* Jump Arc from 0 to currentVal if non-zero */}
          {currentVal !== 0 && (
            <path
              d={`M ${zeroX} ${lineY} Q ${(zeroX + markerX) / 2} ${lineY - 45} ${markerX} ${lineY}`}
              fill="none"
              stroke="#0D9488"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />
          )}

          {/* Tick Marks & Labels */}
          {ticks.map((t) => {
            const x = valueToX(t);
            const isZero = t === 0;
            return (
              <g
                key={t}
                className={`cursor-pointer ${disabled ? '' : 'hover:opacity-80'}`}
                onClick={() => !disabled && setCurrentVal(t)}
              >
                <line
                  x1={x}
                  y1={lineY - (isZero ? 12 : 7)}
                  x2={x}
                  y2={lineY + (isZero ? 12 : 7)}
                  stroke={isZero ? '#0F766E' : '#94A3B8'}
                  strokeWidth={isZero ? '3' : '2'}
                />
                <text
                  x={x}
                  y={lineY + 28}
                  textAnchor="middle"
                  className={`text-xs font-black select-none ${isZero ? 'fill-teal-700' : 'fill-slate-600'}`}
                >
                  {t}
                </text>
              </g>
            );
          })}

          {/* Plotted Pin Indicator */}
          <motion.g
            animate={{ x: markerX }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <circle cx="0" cy={lineY} r="9" fill="#0D9488" stroke="#FFFFFF" strokeWidth="3" />
            {/* Pin Pointer Flag */}
            <path d="M 0 -8 L -12 -32 L 12 -32 Z" fill="#0D9488" />
            <rect x="-16" y="-48" width="32" height="18" rx="5" fill="#0F766E" />
            <text x="0" y="-35" textAnchor="middle" fill="#FFFFFF" className="text-[10px] font-black">
              {currentVal}
            </text>
          </motion.g>
        </svg>
      </div>

      {/* Control Buttons & Readout */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white px-5 py-3 rounded-2xl border border-teal-100 shadow-sm gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-400 uppercase">Plotted Point:</span>
          <span className="text-2xl font-black text-teal-600 font-mono bg-teal-50 px-4 py-0.5 rounded-xl border border-teal-200">
            {currentVal}
          </span>
        </div>

        {!disabled && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => adjustVal(-stepVal)}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-black text-xs"
            >
              <Minus className="w-3.5 h-3.5" /> Move Left
            </button>
            <button
              onClick={() => adjustVal(stepVal)}
              className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-black text-xs shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Move Right
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
