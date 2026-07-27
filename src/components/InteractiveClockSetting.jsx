import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Plus, Minus, RotateCcw, Sparkles } from 'lucide-react';

export default function InteractiveClockSetting({
  targetTime = '03:45',
  instruction,
  onAnswerChange,
  studentAnswer,
  disabled = false
}) {
  // Parse target time e.g. "03:45"
  const parseTime = (timeStr) => {
    if (!timeStr) return { hour: 3, minute: 0 };
    const parts = String(timeStr).split(':');
    let h = parseInt(parts[0], 10);
    let m = parseInt(parts[1], 10);
    if (isNaN(h)) h = 12;
    if (isNaN(m)) m = 0;
    h = h % 12;
    if (h === 0) h = 12;
    return { hour: h, minute: m };
  };

  const initialParsed = studentAnswer ? parseTime(studentAnswer) : { hour: 12, minute: 0 };
  const [hour, setHour] = useState(initialParsed.hour);
  const [minute, setMinute] = useState(initialParsed.minute);

  // Sync answer to parent
  useEffect(() => {
    const formattedHour = String(hour).padStart(2, '0');
    const formattedMinute = String(minute).padStart(2, '0');
    const timeVal = `${formattedHour}:${formattedMinute}`;
    if (onAnswerChange) {
      onAnswerChange(timeVal);
    }
  }, [hour, minute, onAnswerChange]);

  const adjustMinutes = (delta) => {
    if (disabled) return;
    let totalMins = hour * 60 + minute + delta;
    if (totalMins < 0) totalMins += 12 * 60;
    let newH = Math.floor(totalMins / 60) % 12;
    if (newH === 0) newH = 12;
    let newM = totalMins % 60;
    setHour(newH);
    setMinute(newM);
  };

  const adjustHours = (delta) => {
    if (disabled) return;
    let newH = (hour + delta) % 12;
    if (newH <= 0) newH += 12;
    setHour(newH);
  };

  const handleReset = () => {
    if (disabled) return;
    setHour(12);
    setMinute(0);
  };

  // Calculate hand angles
  const minuteAngle = minute * 6; // 360 / 60
  const hourAngle = (hour % 12) * 30 + minute * 0.5; // 30 deg per hour + offset

  // Target time formatting for label
  const { hour: targetH, minute: targetM } = parseTime(targetTime);
  const formattedTarget = `${String(targetH).padStart(2, '0')}:${String(targetM).padStart(2, '0')}`;

  return (
    <div className="w-full bg-gradient-to-b from-indigo-50/40 to-blue-50/30 border-2 border-indigo-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-indigo-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-white font-black px-3 py-1 rounded-xl text-xs uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Interactive Clock
            </span>
            <span className="text-xs font-black text-indigo-700 bg-indigo-100 px-3 py-1 rounded-xl">
              Target: {formattedTarget}
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-800 mt-2">
            {instruction || `Set the clock to ${formattedTarget}`}
          </h3>
        </div>

        {!disabled && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset Clock
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* Analog Clock Face */}
        <div className="relative w-64 h-64 bg-white rounded-full border-8 border-indigo-600 shadow-xl flex items-center justify-center p-4">
          {/* Hour Numbers 1-12 */}
          {Array.from({ length: 12 }).map((_, idx) => {
            const num = idx + 1;
            const angle = num * 30 - 90;
            const rad = (angle * Math.PI) / 180;
            const radius = 95;
            const x = 110 + radius * Math.cos(rad);
            const y = 110 + radius * Math.sin(rad);
            return (
              <span
                key={num}
                className="absolute text-sm font-black text-slate-700 select-none -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}px`, top: `${y}px` }}
              >
                {num}
              </span>
            );
          })}

          {/* Clock Hands SVG */}
          <svg width="220" height="220" viewBox="0 0 220 220" className="absolute top-0 left-0">
            {/* Center Pivot Point */}
            <circle cx="110" cy="110" r="7" fill="#1E1B4B" zIndex="30" />

            {/* Hour Hand (Thicker, Shorter) */}
            <g transform={`rotate(${hourAngle} 110 110)`}>
              <line
                x1="110"
                y1="110"
                x2="110"
                y2="55"
                stroke="#6366F1"
                strokeWidth="7"
                strokeLinecap="round"
              />
            </g>

            {/* Minute Hand (Thinner, Longer) */}
            <g transform={`rotate(${minuteAngle} 110 110)`}>
              <line
                x1="110"
                y1="110"
                x2="110"
                y2="32"
                stroke="#EC4899"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>

        {/* Control Box & Digital Readout */}
        <div className="flex flex-col items-center gap-4 bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm w-full max-w-xs">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Your Clock Setting
          </span>
          <div className="text-4xl font-black text-indigo-600 font-mono tracking-wider bg-indigo-50 px-6 py-2 rounded-2xl border border-indigo-200">
            {String(hour).padStart(2, '0')}:{String(minute).padStart(2, '0')}
          </div>

          {!disabled && (
            <div className="w-full space-y-3 pt-2">
              {/* Hour Controls */}
              <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
                <span className="text-xs font-black text-slate-600 pl-2">Hours:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => adjustHours(-1)}
                    className="p-1.5 bg-white rounded-lg border border-slate-200 font-black text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => adjustHours(1)}
                    className="p-1.5 bg-white rounded-lg border border-slate-200 font-black text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Minute Controls */}
              <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
                <span className="text-xs font-black text-slate-600 pl-2">Minutes:</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => adjustMinutes(-15)}
                    className="px-2 py-1 bg-white rounded-lg border border-slate-200 font-black text-xs text-slate-700 hover:bg-pink-50 hover:text-pink-600"
                  >
                    -15m
                  </button>
                  <button
                    onClick={() => adjustMinutes(-5)}
                    className="px-2 py-1 bg-white rounded-lg border border-slate-200 font-black text-xs text-slate-700 hover:bg-pink-50 hover:text-pink-600"
                  >
                    -5m
                  </button>
                  <button
                    onClick={() => adjustMinutes(5)}
                    className="px-2 py-1 bg-white rounded-lg border border-slate-200 font-black text-xs text-slate-700 hover:bg-pink-50 hover:text-pink-600"
                  >
                    +5m
                  </button>
                  <button
                    onClick={() => adjustMinutes(15)}
                    className="px-2 py-1 bg-white rounded-lg border border-slate-200 font-black text-xs text-slate-700 hover:bg-pink-50 hover:text-pink-600"
                  >
                    +15m
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
