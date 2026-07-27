import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, Plus, Minus, RotateCcw, Sparkles } from 'lucide-react';

export default function InteractiveGeometryNet({
  targetShape = 'Cube',
  instruction,
  onAnswerChange,
  studentAnswer,
  disabled = false
}) {
  // Shape specs database
  const SHAPES = {
    'Cube': { faces: 6, edges: 12, vertices: 8, netName: '6 Square Faces Net' },
    'Square Pyramid': { faces: 5, edges: 8, vertices: 5, netName: '1 Square + 4 Triangular Faces Net' },
    'Triangular Prism': { faces: 5, edges: 9, vertices: 6, netName: '2 Triangular + 3 Rectangular Faces Net' },
    'Cylinder': { faces: 3, edges: 2, vertices: 0, netName: '2 Circular + 1 Rectangular Net' },
  };

  const shapeData = SHAPES[targetShape] || SHAPES['Cube'];

  // Student inputs for faces, edges, vertices
  const initialData = (() => {
    if (studentAnswer) {
      try {
        if (typeof studentAnswer === 'string' && studentAnswer.startsWith('{')) {
          return JSON.parse(studentAnswer);
        }
      } catch (e) {}
    }
    return { faces: 0, edges: 0, vertices: 0 };
  })();

  const [counts, setCounts] = useState(initialData);
  const [isFolded, setIsFolded] = useState(false);

  // Sync answer to parent
  useEffect(() => {
    if (onAnswerChange) {
      onAnswerChange(JSON.stringify(counts));
    }
  }, [counts, onAnswerChange]);

  const handleAdjust = (key, delta) => {
    if (disabled) return;
    setCounts((prev) => ({
      ...prev,
      [key]: Math.max(0, (prev[key] || 0) + delta)
    }));
  };

  const handleReset = () => {
    if (disabled) return;
    setCounts({ faces: 0, edges: 0, vertices: 0 });
  };

  return (
    <div className="w-full bg-gradient-to-b from-blue-50/40 to-indigo-50/30 border-2 border-blue-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-blue-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white font-black px-3 py-1 rounded-xl text-xs uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> 3D Geometry Net Explorer
            </span>
            <span className="text-xs font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-xl">
              Shape: {targetShape}
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-800 mt-2">
            {instruction || `Count the Faces, Edges, and Vertices for a ${targetShape}.`}
          </h3>
        </div>

        {!disabled && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset Counts
          </button>
        )}
      </div>

      {/* Interactive Fold / Unfold SVG Net Graphic */}
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-blue-100 shadow-sm relative space-y-4">
        <button
          onClick={() => setIsFolded(!isFolded)}
          className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full font-black text-xs hover:bg-blue-200 transition-all shadow-sm"
        >
          {isFolded ? '📄 Unfold Net to 2D' : '📦 Fold to 3D Shape'}
        </button>

        {/* Render Net Graphic */}
        <div className="w-48 h-48 flex justify-center items-center">
          {!isFolded ? (
            // 2D Net Graphic for Cube (Cross Layout)
            <svg width="140" height="140" viewBox="0 0 140 140">
              <rect x="45" y="10" width="30" height="30" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="2" rx="2" />
              <rect x="10" y="45" width="30" height="30" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="2" rx="2" />
              <rect x="45" y="45" width="30" height="30" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" rx="2" />
              <rect x="80" y="45" width="30" height="30" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="2" rx="2" />
              <rect x="115" y="45" width="30" height="30" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="2" rx="2" />
              <rect x="45" y="80" width="30" height="30" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="2" rx="2" />
            </svg>
          ) : (
            // 3D Folded Graphic
            <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-md">
              <polygon points="30,40 70,25 100,40 60,55" fill="#93C5FD" stroke="#1D4ED8" strokeWidth="2" />
              <polygon points="30,40 60,55 60,95 30,80" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
              <polygon points="60,55 100,40 100,80 60,95" fill="#2563EB" stroke="#1D4ED8" strokeWidth="2" />
            </svg>
          )}
        </div>
        <span className="text-xs font-bold text-slate-400">{shapeData.netName}</span>
      </div>

      {/* Student Counter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Faces Counter */}
        <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm flex flex-col items-center justify-between space-y-3">
          <span className="text-xs font-black text-blue-600 uppercase">Faces</span>
          <span className="text-3xl font-black text-slate-800 font-mono">{counts.faces || 0}</span>
          {!disabled && (
            <div className="flex gap-2 w-full">
              <button
                onClick={() => handleAdjust('faces', -1)}
                className="flex-1 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-black text-xs flex justify-center items-center"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleAdjust('faces', 1)}
                className="flex-1 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-black text-xs flex justify-center items-center shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Edges Counter */}
        <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm flex flex-col items-center justify-between space-y-3">
          <span className="text-xs font-black text-indigo-600 uppercase">Edges</span>
          <span className="text-3xl font-black text-slate-800 font-mono">{counts.edges || 0}</span>
          {!disabled && (
            <div className="flex gap-2 w-full">
              <button
                onClick={() => handleAdjust('edges', -1)}
                className="flex-1 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-black text-xs flex justify-center items-center"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleAdjust('edges', 1)}
                className="flex-1 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-black text-xs flex justify-center items-center shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Vertices Counter */}
        <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm flex flex-col items-center justify-between space-y-3">
          <span className="text-xs font-black text-purple-600 uppercase">Vertices</span>
          <span className="text-3xl font-black text-slate-800 font-mono">{counts.vertices || 0}</span>
          {!disabled && (
            <div className="flex gap-2 w-full">
              <button
                onClick={() => handleAdjust('vertices', -1)}
                className="flex-1 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-black text-xs flex justify-center items-center"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleAdjust('vertices', 1)}
                className="flex-1 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-black text-xs flex justify-center items-center shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
