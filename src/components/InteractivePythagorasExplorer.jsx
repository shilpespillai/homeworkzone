import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Triangle, Plus, Minus, RotateCcw, Sparkles } from 'lucide-react';

export default function InteractivePythagorasExplorer({
  targetHypotenuse = 5,
  instruction,
  onAnswerChange,
  studentAnswer,
  disabled = false
}) {
  const cTarget = parseFloat(targetHypotenuse) || 5;

  const [sideA, setSideA] = useState(3);
  const [sideB, setSideB] = useState(4);

  // Compute calculated hypotenuse c = sqrt(a^2 + b^2)
  const calcC = Math.sqrt(sideA * sideA + sideB * sideB);
  const roundedC = Math.round(calcC * 100) / 100;

  // Sync to parent
  useEffect(() => {
    if (onAnswerChange) {
      onAnswerChange(`a=${sideA},b=${sideB},c=${roundedC}`);
    }
  }, [sideA, sideB, roundedC, onAnswerChange]);

  const handleReset = () => {
    if (disabled) return;
    setSideA(3);
    setSideB(4);
  };

  return (
    <div className="w-full bg-gradient-to-b from-purple-50/40 to-indigo-50/30 border-2 border-purple-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-600 text-white font-black px-3 py-1 rounded-xl text-xs uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Pythagoras Theorem Explorer
            </span>
            <span className="text-xs font-black text-purple-700 bg-purple-100 px-3 py-1 rounded-xl">
              Target Hypotenuse (c): {cTarget}
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-800 mt-2">
            {instruction || `Adjust legs a and b to form hypotenuse c = ${cTarget}.`}
          </h3>
        </div>

        {!disabled && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset Triangle
          </button>
        )}
      </div>

      {/* Right-Angled Triangle SVG Canvas */}
      <div className="flex justify-center p-6 bg-white rounded-2xl border border-purple-100 shadow-sm">
        <svg width="260" height="200" viewBox="0 0 260 200" className="select-none">
          {/* Right Triangle */}
          <polygon points="40,160 200,160 40,40" fill="#F3E8FF" stroke="#7C3AED" strokeWidth="3" />
          {/* Right Angle Symbol */}
          <rect x="40" y="145" width="15" height="15" fill="none" stroke="#7C3AED" strokeWidth="2" />

          {/* Leg A label */}
          <text x="25" y="105" textAnchor="middle" className="text-xs font-black fill-purple-700">a = {sideA}</text>

          {/* Leg B label */}
          <text x="120" y="180" textAnchor="middle" className="text-xs font-black fill-purple-700">b = {sideB}</text>

          {/* Hypotenuse C label */}
          <text x="130" y="90" textAnchor="middle" className="text-xs font-black fill-pink-600">c = {roundedC}</text>
        </svg>
      </div>

      {/* Adjust Controls & Formula Box */}
      <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between text-xs font-black">
          <span className="text-slate-400 uppercase">Pythagorean Theorem:</span>
          <span className="text-purple-700 font-mono text-base">
            {sideA}² + {sideB}² = {sideA * sideA} + {sideB * sideB} = {sideA * sideA + sideB * sideB}
          </span>
        </div>

        {!disabled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Side A Control */}
            <div className="flex items-center justify-between bg-purple-50 p-3 rounded-xl border border-purple-200">
              <span className="text-xs font-black text-purple-700">Leg a: {sideA}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setSideA((a) => Math.max(1, a - 1))} className="p-1 bg-white rounded-lg text-slate-700">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setSideA((a) => Math.min(12, a + 1))} className="p-1 bg-purple-600 text-white rounded-lg">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Side B Control */}
            <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-xl border border-indigo-200">
              <span className="text-xs font-black text-indigo-700">Leg b: {sideB}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setSideB((b) => Math.max(1, b - 1))} className="p-1 bg-white rounded-lg text-slate-700">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setSideB((b) => Math.min(12, b + 1))} className="p-1 bg-indigo-600 text-white rounded-lg">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
