import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, RefreshCw, Sparkles } from 'lucide-react';

// Helper function to generate SVG pie sector paths
const getSectorPath = (cx, cy, r, startAngle, endAngle) => {
  const startRad = (startAngle - 90) * (Math.PI / 180);
  const endRad = (endAngle - 90) * (Math.PI / 180);
  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
};

// Available vibrant paint colors
const PAINT_COLORS = [
  { id: 'indigo', name: 'Indigo', hex: '#6366F1', bg: 'bg-indigo-500' },
  { id: 'emerald', name: 'Emerald', hex: '#10B981', bg: 'bg-emerald-500' },
  { id: 'amber', name: 'Amber', hex: '#F59E0B', bg: 'bg-amber-500' },
  { id: 'pink', name: 'Pink', hex: '#EC4899', bg: 'bg-pink-500' },
  { id: 'purple', name: 'Purple', hex: '#8B5CF6', bg: 'bg-purple-500' },
  { id: 'orange', name: 'Orange', hex: '#F97316', bg: 'bg-orange-500' },
];

/**
 * Renders an individual shape divided into `denominator` equal sections.
 * Supports interactive clicking on any section to toggle/color it.
 */
const InteractiveFractionShape = ({
  shapeType,
  denominator = 3,
  coloredSections = {},
  selectedColor,
  onToggleSection,
  disabled = false,
  shapeTitle = ''
}) => {
  // Render shape segments
  const renderSegments = () => {
    const segments = [];
    const size = 160;
    const padding = 10;

    for (let i = 0; i < denominator; i++) {
      const isColored = Boolean(coloredSections[i]);
      const fillColor = isColored ? (coloredSections[i] || selectedColor.hex) : '#FFFFFF';

      let pathElement = null;

      if (shapeType === 'rect-horizontal') {
        // Horizontal rectangle cut into vertical columns
        const width = (size - 2 * padding) / denominator;
        const x = padding + i * width;
        const y = padding + 20;
        const height = size - 2 * padding - 40;
        pathElement = (
          <rect
            key={i}
            x={x}
            y={y}
            width={width}
            height={height}
            fill={fillColor}
            stroke="#1E293B"
            strokeWidth="2.5"
            className={`transition-colors duration-150 ${disabled ? '' : 'cursor-pointer hover:opacity-85'}`}
            onClick={() => !disabled && onToggleSection(i)}
          />
        );
      } else if (shapeType === 'circle-pie') {
        // Pie Slices Circle
        const cx = size / 2;
        const cy = size / 2;
        const radius = (size - 2 * padding) / 2;
        const angleStep = 360 / denominator;
        const startAngle = i * angleStep;
        const endAngle = (i + 1) * angleStep;
        pathElement = (
          <path
            key={i}
            d={getSectorPath(cx, cy, radius, startAngle, endAngle)}
            fill={fillColor}
            stroke="#1E293B"
            strokeWidth="2.5"
            className={`transition-colors duration-150 ${disabled ? '' : 'cursor-pointer hover:opacity-85'}`}
            onClick={() => !disabled && onToggleSection(i)}
          />
        );
      } else if (shapeType === 'triangle-centroid') {
        // Triangle split from center to vertices (for 3 parts) or vertical splits
        const cx = size / 2;
        const cy = size / 2 + 10;
        const top = { x: size / 2, y: padding };
        const left = { x: padding + 5, y: size - padding - 15 };
        const right = { x: size - padding - 5, y: size - padding - 15 };

        if (denominator === 3) {
          let dPath = '';
          if (i === 0) dPath = `M ${cx} ${cy} L ${top.x} ${top.y} L ${left.x} ${left.y} Z`;
          else if (i === 1) dPath = `M ${cx} ${cy} L ${top.x} ${top.y} L ${right.x} ${right.y} Z`;
          else dPath = `M ${cx} ${cy} L ${left.x} ${left.y} L ${right.x} ${right.y} Z`;

          pathElement = (
            <path
              key={i}
              d={dPath}
              fill={fillColor}
              stroke="#1E293B"
              strokeWidth="2.5"
              className={`transition-colors duration-150 ${disabled ? '' : 'cursor-pointer hover:opacity-85'}`}
              onClick={() => !disabled && onToggleSection(i)}
            />
          );
        } else {
          // Vertical strips for non-3 denominator triangle fallback
          const width = (size - 2 * padding) / denominator;
          const x = padding + i * width;
          pathElement = (
            <rect
              key={i}
              x={x}
              y={padding + 20}
              width={width}
              height={size - 2 * padding - 40}
              fill={fillColor}
              stroke="#1E293B"
              strokeWidth="2.5"
              className={`transition-colors duration-150 ${disabled ? '' : 'cursor-pointer hover:opacity-85'}`}
              onClick={() => !disabled && onToggleSection(i)}
            />
          );
        }
      } else if (shapeType === 'square-vertical') {
        // Square cut into vertical columns
        const width = (size - 2 * padding) / denominator;
        const x = padding + i * width;
        const y = padding + 10;
        const height = size - 2 * padding - 20;
        pathElement = (
          <rect
            key={i}
            x={x}
            y={y}
            width={width}
            height={height}
            fill={fillColor}
            stroke="#1E293B"
            strokeWidth="2.5"
            className={`transition-colors duration-150 ${disabled ? '' : 'cursor-pointer hover:opacity-85'}`}
            onClick={() => !disabled && onToggleSection(i)}
          />
        );
      } else if (shapeType === 'rect-stacked') {
        // Rectangle cut into horizontal stacked rows
        const height = (size - 2 * padding - 20) / denominator;
        const x = padding + 15;
        const y = padding + 10 + i * height;
        const width = size - 2 * padding - 30;
        pathElement = (
          <rect
            key={i}
            x={x}
            y={y}
            width={width}
            height={height}
            fill={fillColor}
            stroke="#1E293B"
            strokeWidth="2.5"
            className={`transition-colors duration-150 ${disabled ? '' : 'cursor-pointer hover:opacity-85'}`}
            onClick={() => !disabled && onToggleSection(i)}
          />
        );
      } else if (shapeType === 'strip-vertical') {
        // Thin tall rectangle cut into stacked boxes
        const height = (size - 2 * padding - 10) / denominator;
        const width = 45;
        const x = (size - width) / 2;
        const y = padding + 5 + i * height;
        pathElement = (
          <rect
            key={i}
            x={x}
            y={y}
            width={width}
            height={height}
            fill={fillColor}
            stroke="#1E293B"
            strokeWidth="2.5"
            className={`transition-colors duration-150 ${disabled ? '' : 'cursor-pointer hover:opacity-85'}`}
            onClick={() => !disabled && onToggleSection(i)}
          />
        );
      }

      segments.push(pathElement);
    }

    return segments;
  };

  const countColored = Object.keys(coloredSections).length;

  return (
    <div className="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow-sm flex flex-col items-center justify-between relative group hover:border-indigo-300 transition-all">
      {/* Top Badge */}
      <div className="w-full flex items-center justify-between mb-2 px-1">
        <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
          {shapeTitle}
        </span>
        <span
          className={`text-xs font-black px-2 py-0.5 rounded-full ${
            countColored > 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'
          }`}
        >
          {countColored}/{denominator}
        </span>
      </div>

      {/* SVG Canvas */}
      <div className="relative flex justify-center items-center my-1">
        <svg width="160" height="160" viewBox="0 0 160 160" className="drop-shadow-sm">
          {renderSegments()}
        </svg>
      </div>

      {/* Footer Status */}
      <div className="text-[11px] font-bold text-slate-400 mt-2">
        {countColored === 0 ? 'Click sections to color' : `${countColored} of ${denominator} colored`}
      </div>
    </div>
  );
};

export default function InteractiveFractionColoring({
  targetFraction = '1/3',
  instruction,
  onAnswerChange,
  studentAnswer,
  disabled = false,
  isReviewing = false
}) {
  // Parse target fraction
  const [numStr, denStr] = (targetFraction || '1/3').split('/');
  const targetNumerator = parseInt(numStr, 10) || 1;
  const targetDenominator = parseInt(denStr, 10) || 3;

  // Selected paint color
  const [selectedColor, setSelectedColor] = useState(PAINT_COLORS[0]);

  // Default shape types matching worksheet layout
  const defaultShapes = [
    { id: 'shape-0', type: 'rect-horizontal', title: 'Shape 1' },
    { id: 'shape-1', type: 'circle-pie', title: 'Shape 2' },
    { id: 'shape-2', type: 'triangle-centroid', title: 'Shape 3' },
    { id: 'shape-3', type: 'square-vertical', title: 'Shape 4' },
    { id: 'shape-4', type: 'rect-stacked', title: 'Shape 5' },
    { id: 'shape-5', type: 'strip-vertical', title: 'Shape 6' },
  ];

  // Map of shapeId -> { sectionIdx: colorHex }
  const [coloredData, setColoredData] = useState(() => {
    if (studentAnswer) {
      try {
        if (typeof studentAnswer === 'string' && studentAnswer.startsWith('{')) {
          return JSON.parse(studentAnswer);
        }
      } catch (e) {
        console.error('Error parsing studentAnswer:', e);
      }
    }
    return {};
  });

  // Sync to parent whenever coloredData changes
  useEffect(() => {
    if (onAnswerChange) {
      onAnswerChange(JSON.stringify(coloredData));
    }
  }, [coloredData, onAnswerChange]);

  // Toggle individual section of a shape
  const handleToggleSection = (shapeId, sectionIdx) => {
    setColoredData((prev) => {
      const shapeColored = { ...(prev[shapeId] || {}) };
      if (shapeColored[sectionIdx]) {
        delete shapeColored[sectionIdx];
      } else {
        shapeColored[sectionIdx] = selectedColor.hex;
      }

      const nextData = { ...prev };
      if (Object.keys(shapeColored).length === 0) {
        delete nextData[shapeId];
      } else {
        nextData[shapeId] = shapeColored;
      }
      return nextData;
    });
  };

  // Reset all colored sections
  const handleReset = () => {
    setColoredData({});
  };

  // Calculate summary stats
  const totalShapes = defaultShapes.length;
  let correctShapeCount = 0;
  defaultShapes.forEach((s) => {
    const coloredCount = Object.keys(coloredData[s.id] || {}).length;
    if (coloredCount === targetNumerator) {
      correctShapeCount++;
    }
  });

  return (
    <div className="w-full bg-gradient-to-b from-slate-50 to-orange-50/30 border-2 border-orange-200/80 rounded-3xl p-4 sm:p-6 space-y-6 shadow-sm">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-orange-500 text-white font-black px-3 py-1 rounded-xl text-xs uppercase tracking-widest flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Fractions Worksheet
            </span>
            <span className="text-xs font-black text-orange-600 bg-orange-100 px-3 py-1 rounded-xl">
              Target: {targetFraction}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-800 mt-2">
            {instruction || `Color ${targetFraction} of each shape.`}
          </h3>
        </div>

        {!disabled && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" /> Reset All
          </button>
        )}
      </div>

      {/* Paint Color Palette Bar */}
      {!disabled && (
        <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mr-2">
            <Palette className="w-4 h-4 text-indigo-500" /> Select Paint:
          </span>
          <div className="flex flex-wrap gap-2">
            {PAINT_COLORS.map((c) => {
              const isSelected = selectedColor.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedColor(c)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                    isSelected
                      ? 'ring-2 ring-indigo-500 ring-offset-2 scale-105 shadow-sm text-white'
                      : 'hover:scale-100 text-slate-700 bg-slate-100'
                  }`}
                  style={{ backgroundColor: isSelected ? c.hex : undefined }}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/50"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Grid of Shapes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {defaultShapes.map((shape) => (
          <InteractiveFractionShape
            key={shape.id}
            shapeType={shape.type}
            denominator={targetDenominator}
            coloredSections={coloredData[shape.id] || {}}
            selectedColor={selectedColor}
            onToggleSection={(secIdx) => handleToggleSection(shape.id, secIdx)}
            disabled={disabled}
            shapeTitle={shape.title}
          />
        ))}
      </div>

      {/* Summary Footer */}
      <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600">
        <span className="flex items-center gap-2">
          🎯 Goal: Color exactly <strong className="text-slate-800">{targetNumerator} section</strong> per shape.
        </span>
        <span className="font-black text-indigo-600">
          {correctShapeCount} of {totalShapes} shapes correctly colored
        </span>
      </div>
    </div>
  );
}
