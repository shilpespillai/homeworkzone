import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, Plus, Minus, RotateCcw, Sparkles } from 'lucide-react';

export default function InteractiveAngleBuilder({
  targetAngle = 65,
  instruction,
  onAnswerChange,
  studentAnswer,
  disabled = false
}) {
  const target = parseInt(targetAngle, 10) || 65;

  const initialDeg = studentAnswer ? parseInt(studentAnswer, 10) || 0 : 0;
  const [angle, setAngle] = useState(initialDeg);

  // Sync to parent
  useEffect(() => {
    if (onAnswerChange) {
      onAnswerChange(String(angle));
    }
  }, [angle, onAnswerChange]);

  const handleReset = () => {
    if (disabled) return;
    setAngle(0);
  };

  const adjustAngle = (delta) => {
    if (disabled) return;
    setAngle((a) => {
      let next = a + delta;
      if (next < 0) next = 0;
      if (next > 360) next = 360;
      return next;
    });
  };

  // Classify Angle Type
  const getAngleType = (deg) => {
    if (deg === 0) return 'Zero';
    if (deg < 90) return 'Acute Angle';
    if (deg === 90) return 'Right Angle';
    if (deg < 180) return 'Obtuse Angle';
    if (deg === 180) return 'Straight Angle';
    return 'Reflex Angle';
  };

  // SVG Geometry
  const cx = 150;
  const cy = 160;
  const rayLength = 110;

  // Rotating Ray Coordinates (angle measured counterclockwise from 0deg East)
  const rad = (-angle * Math.PI) / 180;
  const rayX = cx + rayLength * Math.cos(rad);
  const rayY = cy + rayLength * Math.sin(rad);

  // Arc path for angle indicator
  const arcRadius = 45;
  const arcStartX = cx + arcRadius;
  const arcStartY = cy;
  const arcEndX = cx + arcRadius * Math.cos(rad);
  const arcEndY = cy + arcRadius * Math.sin(rad);
  const largeArc = angle > 180 ? 1 : 0;
  const arcPath = `M ${arcStartX} ${arcStartY} A ${arcRadius} ${arcRadius} 0 ${largeArc} 0 ${arcEndX} ${arcEndY}`;

  return (
    <div className="w-full bg-gradient-to-b from-purple-50/40 to-violet-50/30 border-2 border-purple-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-600 text-white font-black px-3 py-1 rounded-xl text-xs uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Protractor & Angle Builder
            </span>
            <span className="text-xs font-black text-purple-700 bg-purple-100 px-3 py-1 rounded-xl">
              Target: {target}°
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-800 mt-2">
            {instruction || `Construct a ${target}° angle.`}
          </h3>
        </div>

        {!disabled && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset Angle
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* SVG Interactive Protractor Canvas */}
        <div className="relative bg-white p-4 rounded-3xl border-2 border-purple-100 shadow-md flex items-center justify-center">
          <svg width="300" height="220" viewBox="0 0 300 220" className="select-none">
            {/* Semi-circular Protractor Backdrop */}
            <path
              d="M 30 160 A 120 120 0 0 1 270 160 Z"
              fill="#F5F3FF"
              stroke="#DDD6FE"
              strokeWidth="2"
            />

            {/* Protractor Tick Marks every 10 deg */}
            {Array.from({ length: 19 }).map((_, idx) => {
              const deg = idx * 10;
              const r = (-deg * Math.PI) / 180;
              const x1 = cx + 110 * Math.cos(r);
              const y1 = cy + 110 * Math.sin(r);
              const x2 = cx + 120 * Math.cos(r);
              const y2 = cy + 120 * Math.sin(r);
              return (
                <line
                  key={deg}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#A78BFA"
                  strokeWidth={deg % 30 === 0 ? '2' : '1'}
                />
              );
            })}

            {/* Angle Arc Fill */}
            {angle > 0 && (
              <path d={arcPath} fill="none" stroke="#EC4899" strokeWidth="3" />
            )}

            {/* Fixed Base Ray (0 deg East) */}
            <line
              x1={cx}
              y1={cy}
              x2={cx + rayLength}
              y2={cy}
              stroke="#1E293B"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Interactive Rotating Ray */}
            <line
              x1={cx}
              y1={cy}
              x2={rayX}
              y2={rayY}
              stroke="#8B5CF6"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Vertex Point */}
            <circle cx={cx} cy={cy} r="6" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="2" />
          </svg>
        </div>

        {/* Readout & Adjustment Controls */}
        <div className="flex flex-col items-center gap-4 bg-white p-5 rounded-2xl border border-purple-100 shadow-sm w-full max-w-xs">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Angle Degree
          </span>
          <div className="text-4xl font-black text-purple-600 font-mono tracking-wider bg-purple-50 px-6 py-2 rounded-2xl border border-purple-200">
            {angle}°
          </div>
          <span className="text-xs font-black px-3 py-1 rounded-full bg-purple-100 text-purple-700">
            {getAngleType(angle)}
          </span>

          {!disabled && (
            <div className="w-full space-y-3 pt-2">
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => adjustAngle(-15)}
                  className="py-1.5 bg-slate-100 hover:bg-slate-200 font-black text-xs text-slate-700 rounded-xl"
                >
                  -15°
                </button>
                <button
                  onClick={() => adjustAngle(-5)}
                  className="py-1.5 bg-slate-100 hover:bg-slate-200 font-black text-xs text-slate-700 rounded-xl"
                >
                  -5°
                </button>
                <button
                  onClick={() => adjustAngle(5)}
                  className="py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-sm"
                >
                  +5°
                </button>
                <button
                  onClick={() => adjustAngle(15)}
                  className="py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-sm"
                >
                  +15°
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setAngle(90)}
                  className="flex-1 py-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 font-black text-xs text-purple-700 rounded-xl"
                >
                  Snap 90°
                </button>
                <button
                  onClick={() => setAngle(180)}
                  className="flex-1 py-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 font-black text-xs text-purple-700 rounded-xl"
                >
                  Snap 180°
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
