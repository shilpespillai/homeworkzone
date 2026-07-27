import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coins, Plus, Minus, RotateCcw, Sparkles, Globe } from 'lucide-react';

export default function InteractiveMoneyCounter({
  targetAmount = '4.50',
  instruction,
  onAnswerChange,
  studentAnswer,
  disabled = false
}) {
  const [currency, setCurrency] = useState('USD'); // 'USD' | 'INR' | 'EUR' | 'GBP'

  const CURRENCIES = {
    USD: { symbol: '$', name: 'US Dollars' },
    INR: { symbol: '₹', name: 'Indian Rupees' },
    EUR: { symbol: '€', name: 'Euros' },
    GBP: { symbol: '£', name: 'British Pounds' }
  };

  const activeCurr = CURRENCIES[currency] || CURRENCIES.USD;

  const parseAmount = (val) => {
    if (!val) return 4.5;
    const clean = String(val).replace(/[$₹€£]/g, '').trim();
    const num = parseFloat(clean);
    return isNaN(num) ? 4.5 : num;
  };

  const target = parseAmount(targetAmount);

  // Denominations list
  const DENOMS = [
    { id: '500', name: `${activeCurr.symbol}500`, val: 500.0, color: 'bg-indigo-600 text-white', label: `${activeCurr.symbol}500` },
    { id: '100', name: `${activeCurr.symbol}100`, val: 100.0, color: 'bg-purple-600 text-white', label: `${activeCurr.symbol}100` },
    { id: '50', name: `${activeCurr.symbol}50`, val: 50.0, color: 'bg-cyan-600 text-white', label: `${activeCurr.symbol}50` },
    { id: '20', name: `${activeCurr.symbol}20`, val: 20.0, color: 'bg-emerald-600 text-white', label: `${activeCurr.symbol}20` },
    { id: '10', name: `${activeCurr.symbol}10 Note`, val: 10.0, color: 'bg-blue-500 text-white', label: `${activeCurr.symbol}10` },
    { id: '5', name: `${activeCurr.symbol}5 Note`, val: 5.0, color: 'bg-pink-500 text-white', label: `${activeCurr.symbol}5` },
    { id: '2', name: `${activeCurr.symbol}2 Coin`, val: 2.0, color: 'bg-amber-400 text-slate-800 font-black', label: `${activeCurr.symbol}2` },
    { id: '1', name: `${activeCurr.symbol}1 Coin`, val: 1.0, color: 'bg-amber-300 text-slate-800 font-black', label: `${activeCurr.symbol}1` },
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
      onAnswerChange(`${activeCurr.symbol}${roundedTotal.toFixed(2)}`);
    }
  }, [roundedTotal, currency, onAnswerChange]);

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
              <Sparkles className="w-3.5 h-3.5" /> Multi-Currency Counter
            </span>
            <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-xl">
              Target: {activeCurr.symbol}{target.toFixed(2)}
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-800 mt-2">
            {instruction || `Count out exactly ${activeCurr.symbol}${target.toFixed(2)} using notes and coins.`}
          </h3>
        </div>

        {!disabled && (
          <div className="flex items-center gap-2">
            {/* Currency Selector */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              <Globe className="w-3.5 h-3.5 text-emerald-600 ml-1" />
              {Object.keys(CURRENCIES).map((c) => (
                <button
                  key={c}
                  onClick={() => { setCurrency(c); setCounts({}); }}
                  className={`px-2 py-0.5 rounded-lg text-xs font-black transition-all ${
                    currency === c ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {CURRENCIES[c].symbol} {c}
                </button>
              ))}
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset
            </button>
          </div>
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
          Your Paid Coins & Notes ({activeCurr.name})
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
          {activeCurr.symbol}{roundedTotal.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
