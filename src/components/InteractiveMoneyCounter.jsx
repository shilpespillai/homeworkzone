import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coins, Plus, Minus, RotateCcw, Sparkles } from 'lucide-react';

export default function InteractiveMoneyCounter({
  targetAmount = '4.50',
  instruction,
  onAnswerChange,
  studentAnswer,
  disabled = false
}) {
  const parseAmount = (val) => {
    if (!val) return 4.5;
    const clean = String(val).replace('$', '').trim();
    const num = parseFloat(clean);
    return isNaN(num) ? 4.5 : num;
  };

  const target = parseAmount(targetAmount);

  // Denominations list
  const DENOMS = [
    { id: '10', name: '$10 Note', val: 10.0, color: 'bg-blue-500 text-white', label: '$10' },
    { id: '5', name: '$5 Note', val: 5.0, color: 'bg-pink-500 text-white', label: '$5' },
    { id: '2', name: '$2 Coin', val: 2.0, color: 'bg-amber-400 text-slate-800 font-black', label: '$2' },
    { id: '1', name: '$1 Coin', val: 1.0, color: 'bg-amber-300 text-slate-800 font-black', label: '$1' },
    { id: '0.5', name: '50c Coin', val: 0.5, color: 'bg-slate-300 text-slate-800 font-black', label: '50c' },
    { id: '0.2', name: '20c Coin', val: 0.2, color: 'bg-slate-300 text-slate-800 font-black', label: '20c' },
    { id: '0.1', name: '10c Coin', val: 0.1, color: 'bg-slate-300 text-slate-800 font-black', label: '10c' },
  ];

  // Map of denomId -> count
  const [counts, setCounts] = useState({});

  // Calculate total
  const currentTotal = Object.keys(counts).reduce((acc, id) => {
    const denom = DENOMS.find((d) => d.id === id);
    return acc + (denom ? denom.val * counts[id] : 0);
  }, 0);

  const roundedTotal = Math.round(currentTotal * 100) / 100;

  // Sync to parent
  useEffect(() => {
    if (onAnswerChange) {
      onAnswerChange(roundedTotal.toFixed(2));
    }
  }, [roundedTotal, onAnswerChange]);

  const handleAdd = (id) => {
    if (disabled) return;
    setCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleRemove = (id) => {
    if (disabled) return;
    setCounts((prev) => {
      const next = { ...prev };
      if (next[id] > 1) next[id] -= 1;
      else delete next[id];
      return next;
    });
  };

  const handleReset = () => {
    if (disabled) return;
    setCounts({});
  };

  return (
    <div className="w-full bg-gradient-to-b from-emerald-50/40 to-teal-50/30 border-2 border-emerald-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-emerald-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-600 text-white font-black px-3 py-1 rounded-xl text-xs uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Money & Currency Counter
            </span>
            <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-xl">
              Target: ${target.toFixed(2)}
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-800 mt-2">
            {instruction || `Count out exactly $${target.toFixed(2)} using notes and coins.`}
          </h3>
        </div>

        {!disabled && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset Money
          </button>
        )}
      </div>

      {/* Denomination Buttons Tray */}
      {!disabled && (
        <div className="flex flex-wrap items-center justify-center gap-3 bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
          {DENOMS.map((d) => (
            <button
              key={d.id}
              onClick={() => handleAdd(d.id)}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs transition-all shadow-sm flex items-center gap-2 hover:scale-105 ${d.color}`}
            >
              <Coins className="w-4 h-4" /> Add {d.label}
            </button>
          ))}
        </div>
      )}

      {/* Selected Items Tray */}
      <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">
          Your Paid Coins & Notes
        </span>
        <div className="flex flex-wrap gap-3 min-h-[60px] items-center p-2 bg-emerald-50/50 rounded-xl">
          {Object.keys(counts).map((id) => {
            const d = DENOMS.find((item) => item.id === id);
            if (!d) return null;
            return (
              <div
                key={id}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 font-black text-xs ${d.color}`}
              >
                <span>{d.label} × {counts[id]}</span>
                {!disabled && (
                  <button
                    onClick={() => handleRemove(id)}
                    className="p-0.5 rounded-full hover:bg-black/20 text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
          {Object.keys(counts).length === 0 && (
            <span className="text-xs text-slate-400 font-bold">Tap coins above to add money</span>
          )}
        </div>
      </div>

      {/* Readout Status */}
      <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-emerald-100 shadow-sm text-xs font-bold text-slate-600">
        <span className="text-slate-400 uppercase font-black">Total Paid Amount:</span>
        <span className="text-2xl font-black text-emerald-600 font-mono bg-emerald-50 px-4 py-0.5 rounded-xl border border-emerald-200">
          ${roundedTotal.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
