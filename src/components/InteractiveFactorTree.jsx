import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitFork, RotateCcw, Sparkles } from 'lucide-react';

export default function InteractiveFactorTree({
  targetNumber = 24,
  instruction,
  onAnswerChange,
  studentAnswer,
  disabled = false
}) {
  const target = parseInt(targetNumber, 10) || 24;

  // Prime factors of target
  const getPrimeFactors = (n) => {
    const factors = [];
    let d = 2;
    while (n >= 2) {
      if (n % d === 0) {
        factors.push(d);
        n = n / d;
      } else {
        d++;
      }
    }
    return factors;
  };

  const primeFactors = getPrimeFactors(target);

  // Student inputs list of prime factors e.g. "2, 2, 2, 3"
  const [selectedPrimes, setSelectedPrimes] = useState(() => {
    if (studentAnswer) {
      return String(studentAnswer).split(',').map((s) => parseInt(s.trim(), 10)).filter(Boolean);
    }
    return [];
  });

  // Sync answer to parent
  useEffect(() => {
    if (onAnswerChange) {
      onAnswerChange(selectedPrimes.join(', '));
    }
  }, [selectedPrimes, onAnswerChange]);

  const handleAddPrime = (p) => {
    if (disabled) return;
    setSelectedPrimes((prev) => [...prev, p]);
  };

  const handleRemovePrime = (idx) => {
    if (disabled) return;
    setSelectedPrimes((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleReset = () => {
    if (disabled) return;
    setSelectedPrimes([]);
  };

  return (
    <div className="w-full bg-gradient-to-b from-emerald-50/40 to-teal-50/30 border-2 border-emerald-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-emerald-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-600 text-white font-black px-3 py-1 rounded-xl text-xs uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Prime Factorization Tree
            </span>
            <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-xl">
              Target: {target}
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-800 mt-2">
            {instruction || `Decompose ${target} into its prime factors.`}
          </h3>
        </div>

        {!disabled && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset Tree
          </button>
        )}
      </div>

      {/* Factor Tree Canvas */}
      <div className="flex flex-col items-center p-6 bg-white rounded-2xl border border-emerald-100 shadow-sm space-y-4">
        <div className="w-14 h-14 bg-emerald-600 text-white font-black text-xl rounded-full flex items-center justify-center shadow-lg border-4 border-emerald-300">
          {target}
        </div>

        <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Select Prime Factors Below:
        </div>

        {!disabled && (
          <div className="flex flex-wrap justify-center gap-2">
            {[2, 3, 5, 7, 11, 13].map((p) => (
              <button
                key={p}
                onClick={() => handleAddPrime(p)}
                className="w-10 h-10 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-black text-sm shadow-md transition-all scale-105"
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Prime Factors Tray */}
      <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm space-y-2">
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest block">
          Your Prime Factor Decomposition
        </span>
        <div className="flex flex-wrap items-center gap-2 min-h-[48px] p-2 bg-emerald-50/50 rounded-xl">
          {selectedPrimes.map((p, idx) => (
            <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white font-black text-xs rounded-lg shadow-sm">
              <span>{p}</span>
              {!disabled && (
                <button onClick={() => handleRemovePrime(idx)} className="hover:text-rose-200">×</button>
              )}
            </div>
          ))}
          {selectedPrimes.length === 0 && (
            <span className="text-xs text-slate-400 font-bold">Tap prime numbers above to build tree</span>
          )}
        </div>
      </div>
    </div>
  );
}
