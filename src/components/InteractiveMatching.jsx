import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function InteractiveMatching({ pairs, onMatch, disabled }) {
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matches, setMatches] = useState([]);
  const [wrongAttempt, setWrongAttempt] = useState(false);

  // Initialize and scramble
  useEffect(() => {
    if (!pairs) return;
    
    const lefts = [];
    const rights = [];
    
    pairs.forEach(pair => {
      const parts = pair.split('||');
      if (parts.length === 2) {
        lefts.push(parts[0]);
        rights.push(parts[1]);
      }
    });

    // Scramble right side
    const scrambledRights = [...rights].sort(() => Math.random() - 0.5);
    
    setLeftItems(lefts);
    setRightItems(scrambledRights);
  }, [pairs]);

  useEffect(() => {
    // Check match when both selected
    if (selectedLeft !== null && selectedRight !== null) {
      const leftValue = leftItems[selectedLeft];
      const rightValue = rightItems[selectedRight];
      
      // Look for the correct pair
      const isCorrect = pairs.some(p => p === `${leftValue}||${rightValue}`);
      
      if (isCorrect) {
        const newMatch = `${leftValue}||${rightValue}`;
        const updatedMatches = [...matches, newMatch];
        setMatches(updatedMatches);
        
        if (onMatch) {
          onMatch(updatedMatches);
        }
        
        setSelectedLeft(null);
        setSelectedRight(null);
      } else {
        setWrongAttempt(true);
        setTimeout(() => {
          setWrongAttempt(false);
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 800);
      }
    }
  }, [selectedLeft, selectedRight, leftItems, rightItems, matches, pairs, onMatch]);

  if (!pairs || pairs.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto py-6 grid grid-cols-2 gap-8">
      {/* Left Column */}
      <div className="space-y-4">
        {leftItems.map((item, idx) => {
          const isMatched = matches.some(m => m.startsWith(`${item}||`));
          const isSelected = selectedLeft === idx;
          return (
            <motion.button
              key={`left-${idx}`}
              whileHover={!disabled && !isMatched ? { scale: 1.02 } : {}}
              whileTap={!disabled && !isMatched ? { scale: 0.98 } : {}}
              disabled={disabled || isMatched}
              onClick={() => setSelectedLeft(idx)}
              className={`
                w-full p-4 rounded-2xl border-4 text-lg font-bold text-left transition-all
                ${isMatched ? 'bg-emerald-50 border-emerald-200 text-emerald-700 opacity-50' : 
                  isSelected ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-md' : 
                  'bg-white border-slate-100 text-slate-700 shadow-sm hover:border-indigo-200'}
                ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                ${isSelected && wrongAttempt ? 'bg-red-50 border-red-400 animate-shake' : ''}
              `}
            >
              {item}
            </motion.button>
          );
        })}
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        {rightItems.map((item, idx) => {
          const isMatched = matches.some(m => m.endsWith(`||${item}`));
          const isSelected = selectedRight === idx;
          return (
            <motion.button
              key={`right-${idx}`}
              whileHover={!disabled && !isMatched ? { scale: 1.02 } : {}}
              whileTap={!disabled && !isMatched ? { scale: 0.98 } : {}}
              disabled={disabled || isMatched}
              onClick={() => setSelectedRight(idx)}
              className={`
                w-full p-4 rounded-2xl border-4 text-lg font-bold text-center transition-all
                ${isMatched ? 'bg-emerald-50 border-emerald-200 text-emerald-700 opacity-50' : 
                  isSelected ? 'bg-amber-50 border-amber-400 text-amber-700 shadow-md' : 
                  'bg-white border-slate-100 text-slate-700 shadow-sm hover:border-amber-200'}
                ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                ${isSelected && wrongAttempt ? 'bg-red-50 border-red-400 animate-shake' : ''}
              `}
            >
              {item}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
