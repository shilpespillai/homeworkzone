import React, { useState } from 'react';
import { motion } from 'framer-motion';

// --- HELPER: SVG Circular Sector Path ---
const getSectorPath = (x, y, r, startAngle, endAngle) => {
  const startRad = (startAngle - 90) * Math.PI / 180.0;
  const endRad = (endAngle - 90) * Math.PI / 180.0;
  const x1 = x + r * Math.cos(startRad);
  const y1 = y + r * Math.sin(startRad);
  const x2 = x + r * Math.cos(endRad);
  const y2 = y + r * Math.sin(endRad);
  
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${x} ${y} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
};

// ==========================================
// 1. FRACTIONS VISUALIZER (Interactive)
// ==========================================
export const FractionVisualizer = () => {
  const [slices, setSlices] = useState(4);
  const [selectedCount, setSelectedCount] = useState(1);

  const increaseSlices = () => {
    if (slices < 12) {
      setSlices(s => s + 1);
      setSelectedCount(1);
    }
  };

  const decreaseSlices = () => {
    if (slices > 2) {
      setSlices(s => s - 1);
      setSelectedCount(1);
    }
  };

  return (
    <div className="bg-orange-50/20 border border-green-200 rounded-3xl p-6 space-y-6 text-center">
      <h4 className="text-xs font-black text-green-700 uppercase tracking-widest text-left">🍰 Playful Pizza Slicer</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Interactive Pizza SVG */}
        <div className="flex justify-center relative">
          <svg width="180" height="180" viewBox="0 0 200 200" className="drop-shadow-md">
            {/* Outer Crust */}
            <circle cx="100" cy="100" r="95" fill="#E2A154" stroke="#C37B2B" strokeWidth="4" />
            {/* Inner Cheese Base */}
            <circle cx="100" cy="100" r="82" fill="#FFD05B" />
            
            {/* Render Pizza Slices */}
            {Array.from({ length: slices }).map((_, idx) => {
              const startAngle = (idx * 360) / slices;
              const endAngle = ((idx + 1) * 360) / slices;
              const isSelected = idx < selectedCount;
              
              return (
                <path
                  key={idx}
                  d={getSectorPath(100, 100, 80, startAngle, endAngle)}
                  fill={isSelected ? "#FF9A3C" : "#FFD05B"}
                  stroke="#C37B2B"
                  strokeWidth="1.5"
                  className="transition-colors duration-200 cursor-pointer"
                  onClick={() => setSelectedCount(idx + 1)}
                />
              );
            })}

            {/* Pepperonis on Selected Slices */}
            {Array.from({ length: slices }).map((_, idx) => {
              const angle = ((idx + 0.5) * 360) / slices - 90;
              const rad = (angle * Math.PI) / 180;
              const pepperoniX = 100 + 50 * Math.cos(rad);
              const pepperoniY = 100 + 50 * Math.sin(rad);
              const isSelected = idx < selectedCount;

              if (!isSelected) return null;

              return (
                <circle
                  key={idx}
                  cx={pepperoniX}
                  cy={pepperoniY}
                  r="10"
                  fill="#D32F2F"
                  stroke="#9A0007"
                  strokeWidth="1"
                />
              );
            })}
          </svg>
        </div>

        {/* Control Box */}
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-slate-500 uppercase">Total Slices:</span>
            <div className="flex gap-2">
              <button 
                onClick={decreaseSlices} 
                className="w-8 h-8 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-sm font-black flex items-center justify-center"
              >
                -
              </button>
              <span className="text-sm font-black text-slate-800 w-6 text-center leading-8">{slices}</span>
              <button 
                onClick={increaseSlices} 
                className="w-8 h-8 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-sm font-black flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-slate-500 uppercase">Slices Taken:</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedCount(c => Math.max(1, c - 1))} 
                className="w-8 h-8 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-sm font-black flex items-center justify-center"
              >
                -
              </button>
              <span className="text-sm font-black text-slate-800 w-6 text-center leading-8">{selectedCount}</span>
              <button 
                onClick={() => setSelectedCount(c => Math.min(slices, c + 1))} 
                className="w-8 h-8 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-sm font-black flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center gap-4">
            <span className="text-xs font-black text-slate-500 uppercase">My Fraction:</span>
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-green-700 leading-none">{selectedCount}</span>
              <div className="w-8 h-0.5 bg-slate-800 my-0.5" />
              <span className="text-lg font-black text-green-700 leading-none">{slices}</span>
            </div>
            <span className="text-xs font-bold text-slate-500 italic">
              ({selectedCount} out of {slices} slices!)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. PLACE VALUE VISUALIZER (Interactive)
// ==========================================
export const PlaceValueVisualizer = () => {
  const [value, setValue] = useState(34);

  const ones = value % 10;
  const tens = Math.floor((value % 100) / 10);
  const hundreds = Math.floor(value / 100);

  return (
    <div className="bg-orange-50/20 border border-blue-100 rounded-3xl p-6 space-y-6 text-left">
      <h4 className="text-xs font-black text-blue-700 uppercase tracking-widest">🏢 Place Value Block Builder</h4>
      
      {/* Slider Control */}
      <div className="space-y-2">
        <label className="text-xs font-black text-slate-500 uppercase block">Enter Number (0-500): {value}</label>
        <input 
          type="range" 
          min="0" 
          max="500" 
          value={value} 
          onChange={(e) => setValue(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-4 text-center">
        {/* Hundreds Box */}
        <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100/50 space-y-3">
          <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest block">Hundreds ({hundreds})</span>
          <div className="flex flex-wrap gap-2 justify-center min-h-[60px] items-center">
            {hundreds > 0 ? (
              Array.from({ length: hundreds }).map((_, i) => (
                <div key={i} className="w-12 h-12 bg-amber-200 border-2 border-amber-400 rounded-md grid grid-cols-10 grid-rows-10 opacity-80 shadow-sm">
                  {Array.from({ length: 100 }).map((_, j) => (
                    <div key={j} className="border-[0.2px] border-amber-400" />
                  ))}
                </div>
              ))
            ) : (
              <span className="text-[10px] font-bold text-slate-400 italic">Empty</span>
            )}
          </div>
        </div>

        {/* Tens Box */}
        <div className="bg-green-50/50 rounded-2xl p-4 border border-green-100/50 space-y-3">
          <span className="text-[10px] font-black text-green-700 uppercase tracking-widest block">Tens ({tens})</span>
          <div className="flex flex-wrap gap-2 justify-center min-h-[60px] items-center">
            {tens > 0 ? (
              Array.from({ length: tens }).map((_, i) => (
                <div key={i} className="w-4 h-12 bg-green-200 border-2 border-green-400 rounded-md flex flex-col justify-between shadow-sm">
                  {Array.from({ length: 10 }).map((_, j) => (
                    <div key={j} className="border-b-[0.5px] border-green-400 flex-1" />
                  ))}
                </div>
              ))
            ) : (
              <span className="text-[10px] font-bold text-slate-400 italic">Empty</span>
            )}
          </div>
        </div>

        {/* Ones Box */}
        <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50 space-y-3">
          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest block">Ones ({ones})</span>
          <div className="flex flex-wrap gap-2 justify-center min-h-[60px] items-center">
            {ones > 0 ? (
              Array.from({ length: ones }).map((_, i) => (
                <div key={i} className="w-3.5 h-3.5 bg-emerald-200 border-2 border-emerald-400 rounded shadow-sm" />
              ))
            ) : (
              <span className="text-[10px] font-bold text-slate-400 italic">Empty</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. ANALOG CLOCK VISUALIZER (Interactive)
// ==========================================
export const ClockVisualizer = () => {
  const [timePreset, setTimePreset] = useState("3:00");
  
  // Resolve angles based on preset
  let hourAngle = 0;
  let minuteAngle = 0;

  if (timePreset === "3:00") {
    hourAngle = 90;
    minuteAngle = 0;
  } else if (timePreset === "4:30") {
    hourAngle = 135;
    minuteAngle = 180;
  } else if (timePreset === "10:15") {
    hourAngle = 307.5;
    minuteAngle = 90;
  } else if (timePreset === "8:45") {
    hourAngle = 262.5;
    minuteAngle = 270;
  }

  return (
    <div className="bg-orange-50/20 border border-amber-100 rounded-3xl p-6 space-y-6 text-left">
      <h4 className="text-xs font-black text-amber-700 uppercase tracking-widest">⏰ Tick-Tock Clock Face</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* SVG Clock */}
        <div className="flex justify-center">
          <svg width="160" height="160" viewBox="0 0 200 200" className="drop-shadow-md">
            {/* Clock Frame */}
            <circle cx="100" cy="100" r="95" fill="#FFF" stroke="#4A5568" strokeWidth="6" />
            <circle cx="100" cy="100" r="88" fill="none" stroke="#E2E8F0" strokeWidth="2" />
            
            {/* Center Pin */}
            <circle cx="100" cy="100" r="6" fill="#1A202C" z="20" />
            
            {/* Clock Numbers */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = ((i + 1) * 360) / 12 - 90;
              const rad = (angle * Math.PI) / 180;
              const numX = 100 + 72 * Math.cos(rad);
              const numY = 105 + 72 * Math.sin(rad); // offset y slightly for text alignment
              return (
                <text 
                  key={i} 
                  x={numX} 
                  y={numY} 
                  textAnchor="middle" 
                  className="font-black text-sm text-[#2D3748]"
                >
                  {i + 1}
                </text>
              );
            })}

            {/* Hour Hand (Short, Red) */}
            <line
              x1="100"
              y1="100"
              x2={100 + 45 * Math.cos(((hourAngle - 90) * Math.PI) / 180)}
              y2={100 + 45 * Math.sin(((hourAngle - 90) * Math.PI) / 180)}
              stroke="#E53E3E"
              strokeWidth="5.5"
              strokeLinecap="round"
            />

            {/* Minute Hand (Long, Blue) */}
            <line
              x1="100"
              y1="100"
              x2={100 + 65 * Math.cos(((minuteAngle - 90) * Math.PI) / 180)}
              y2={100 + 65 * Math.sin(((minuteAngle - 90) * Math.PI) / 180)}
              stroke="#3182CE"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Preset Selector */}
        <div className="space-y-3">
          <span className="text-xs font-black text-slate-500 uppercase block">Choose Preset Time:</span>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "3 O'Clock", val: "3:00" },
              { label: "Half Past 4", val: "4:30" },
              { label: "Quarter Past 10", val: "10:15" },
              { label: "Quarter To 9", val: "8:45" }
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setTimePreset(preset.val)}
                className={`py-2 px-3 rounded-xl text-[10px] font-black tracking-wider transition-all border ${
                  timePreset === preset.val
                    ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs font-bold text-slate-500 italic">
            Digital Clock: <span className="text-amber-600 font-black font-mono bg-amber-50 px-2.5 py-1 rounded-md">{timePreset}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. CHARLIE THE CROCODILE (Comparing Numbers)
// ==========================================
export const ComparingCrocodile = () => {
  const [numA, setNumA] = useState(12);
  const [numB, setNumB] = useState(8);

  const getSign = () => {
    if (numA > numB) return ">";
    if (numA < numB) return "<";
    return "=";
  };

  return (
    <div className="bg-orange-50/20 border border-emerald-100 rounded-3xl p-6 space-y-6 text-left">
      <h4 className="text-xs font-black text-emerald-700 uppercase tracking-widest">🐊 Hungry Crocodile Charlie</h4>

      {/* Inputs sliders */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase">Snack A: {numA}</label>
          <input
            type="range"
            min="0"
            max="30"
            value={numA}
            onChange={(e) => setNumA(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-500 h-1.5 bg-emerald-50 rounded"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase">Snack B: {numB}</label>
          <input
            type="range"
            min="0"
            max="30"
            value={numB}
            onChange={(e) => setNumB(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-500 h-1.5 bg-emerald-50 rounded"
          />
        </div>
      </div>

      {/* Comparison Display */}
      <div className="flex items-center justify-center gap-6 py-4 bg-white rounded-2xl border border-slate-100 shadow-inner">
        <span className="text-3xl font-black text-slate-800">{numA}</span>
        
        {/* Charlie mouth visualizer */}
        <div className="w-16 h-16 flex items-center justify-center relative">
          {getSign() === ">" && (
            <svg viewBox="0 0 100 100" className="w-full h-full fill-emerald-500 animate-pulse">
              {/* Crocodile open mouth facing LEFT to eat A */}
              <polygon points="10,50 90,15 95,25 35,50 95,75 90,85" />
              <circle cx="80" cy="35" r="5" fill="#FFF" />
              <circle cx="80" cy="35" r="2.5" fill="#000" />
            </svg>
          )}
          {getSign() === "<" && (
            <svg viewBox="0 0 100 100" className="w-full h-full fill-emerald-500 animate-pulse">
              {/* Crocodile open mouth facing RIGHT to eat B */}
              <polygon points="90,50 10,15 5,25 65,50 5,75 10,85" />
              <circle cx="20" cy="35" r="5" fill="#FFF" />
              <circle cx="20" cy="35" r="2.5" fill="#000" />
            </svg>
          )}
          {getSign() === "=" && (
            <div className="text-4xl font-black text-emerald-500">=</div>
          )}
        </div>

        <span className="text-3xl font-black text-slate-800">{numB}</span>
      </div>

      <p className="text-xs text-center font-bold text-slate-500 italic">
        {numA === numB ? (
          "Both snacks are identical! Charlie is looking confused. 🐊"
        ) : (
          `Charlie's mouth opens wide towards ${numA > numB ? numA : numB} because it's a bigger snack! 😋`
        )}
      </p>
    </div>
  );
};

// ==========================================
// 5. 3D SHAPES VISUALIZER (Interactive)
// ==========================================
export const Shapes3DVisualizer = () => {
  const [activeShape, setActiveShape] = useState("cube");

  return (
    <div className="bg-orange-50/20 border border-cyan-100 rounded-3xl p-6 space-y-6 text-left">
      <h4 className="text-xs font-black text-cyan-700 uppercase tracking-widest">💎 3D Shapes Solid Inspector</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Render 3D SVG Shape based on selection */}
        <div className="flex justify-center bg-white rounded-2xl p-6 border border-slate-100 shadow-sm min-h-[140px] items-center">
          {activeShape === "cube" && (
            <svg width="120" height="120" viewBox="0 0 120 120">
              {/* Shaded Cube Face coordinates */}
              {/* Back Face */}
              <polygon points="30,20 90,20 100,50 40,50" fill="#a5f3fc" stroke="#0891b2" strokeWidth="1.5" />
              {/* Left Face */}
              <polygon points="10,50 40,50 30,110 10,110" fill="#22d3ee" stroke="#0891b2" strokeWidth="1.5" />
              {/* Bottom Face */}
              <polygon points="30,110 90,110 100,80 40,80" fill="#e0f7fa" stroke="#0891b2" strokeWidth="1.5" opacity="0.5" />
              {/* Front Face */}
              <polygon points="10,50 70,50 70,110 10,110" fill="#06b6d4" stroke="#0891b2" strokeWidth="2" />
              {/* Top Face */}
              <polygon points="10,50 70,50 90,20 30,20" fill="#67e8f9" stroke="#0891b2" strokeWidth="2" />
              {/* Right Face */}
              <polygon points="70,50 90,20 90,80 70,110" fill="#0891b2" stroke="#0891b2" strokeWidth="2" opacity="0.9" />
            </svg>
          )}

          {activeShape === "sphere" && (
            <svg width="120" height="120" viewBox="0 0 120 120">
              <defs>
                <radialGradient id="sphereGrad" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#67e8f9" />
                  <stop offset="50%" stopColor="#0891b2" />
                  <stop offset="100%" stopColor="#0e7490" />
                </radialGradient>
              </defs>
              <circle cx="60" cy="60" r="50" fill="url(#sphereGrad)" stroke="#0891b2" strokeWidth="1.5" />
              {/* Dashed back shadow lines */}
              <path d="M 10 60 A 50 20 0 0 0 110 60" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="3,3" />
              <path d="M 10 60 A 50 20 0 0 1 110 60" fill="none" stroke="#22d3ee" strokeWidth="1" />
            </svg>
          )}

          {activeShape === "cone" && (
            <svg width="120" height="120" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="coneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#67e8f9" />
                  <stop offset="70%" stopColor="#0891b2" />
                  <stop offset="100%" stopColor="#0e7490" />
                </linearGradient>
              </defs>
              {/* Cone Face */}
              <polygon points="60,10 10,95 110,95" fill="url(#coneGrad)" stroke="#0891b2" strokeWidth="1.5" />
              {/* Ellipse base */}
              <ellipse cx="60" cy="95" rx="50" ry="15" fill="#22d3ee" stroke="#0891b2" strokeWidth="1.5" opacity="0.8" />
            </svg>
          )}

          {activeShape === "cylinder" && (
            <svg width="120" height="120" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="cylGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#67e8f9" />
                  <stop offset="50%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#0891b2" />
                </linearGradient>
              </defs>
              {/* Main tube body */}
              <rect x="20" y="30" width="80" height="60" fill="url(#cylGrad)" stroke="#0891b2" strokeWidth="1.5" />
              {/* Top Face */}
              <ellipse cx="60" cy="30" rx="40" ry="12" fill="#e0f7fa" stroke="#0891b2" strokeWidth="1.5" />
              {/* Bottom Face */}
              <ellipse cx="60" cy="90" rx="40" ry="12" fill="#0891b2" stroke="#0891b2" strokeWidth="1.5" opacity="0.8" />
            </svg>
          )}
        </div>

        {/* Buttons List */}
        <div className="space-y-3">
          <span className="text-xs font-black text-slate-500 uppercase block">Select Solid:</span>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "cube", label: "Cube 🎲" },
              { id: "sphere", label: "Sphere ⚽" },
              { id: "cone", label: "Cone 🍦" },
              { id: "cylinder", label: "Cylinder 🥫" }
            ].map((shape) => (
              <button
                key={shape.id}
                onClick={() => setActiveShape(shape.id)}
                className={`py-2 px-3 rounded-xl text-[10px] font-black tracking-wider transition-all border ${
                  activeShape === shape.id
                    ? 'bg-cyan-100 border-cyan-300 text-cyan-900 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {shape.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 text-xs font-bold text-slate-500 italic">
            {activeShape === "cube" && "Cubes have 6 square faces, 8 vertices, and 12 equal edges!"}
            {activeShape === "sphere" && "Spheres are perfectly round balls with 1 curved surface and 0 edges!"}
            {activeShape === "cone" && "Cones have 1 circular base, 1 curved surface, and 1 sharp vertex point!"}
            {activeShape === "cylinder" && "Cylinders have 2 circular flat bases and 1 cylinder curved surface!"}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. DETAILED POSTER INFOGRAPHIC: LET'S LEARN FRACTIONS!
// ==========================================
export const FractionsPosterInfographic = () => {
  const [sec1Slices, setSec1Slices] = useState(4);
  const [sec2Selected, setSec2Selected] = useState(1);
  const [sec3Base, setSec3Base] = useState(2);
  const [sec3Mult, setSec3Mult] = useState(2);
  const [sec4Left, setSec4Left] = useState(2);
  const [sec4Right, setSec4Right] = useState(3);

  const leftVal = sec4Left / 4;
  const rightVal = sec4Right / 4;
  let tiltAngle = 0;
  if (leftVal > rightVal) tiltAngle = -12;
  if (leftVal < rightVal) tiltAngle = 12;

  return (
    <div className="bg-[#FFFDF6] border-4 border-amber-300 rounded-[32px] overflow-hidden shadow-xl max-w-5xl mx-auto text-left font-sans select-none my-6">
      {/* Banner Header */}
      <div className="bg-[#0D9488] px-6 py-4 flex items-center justify-between text-white border-b-4 border-amber-300">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🍕</span>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">Let's Learn Fractions!</h2>
        </div>
        <div className="flex items-center gap-1.5 bg-teal-800/50 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider">
          <span>You've got this!</span>
          <span>🏆</span>
        </div>
      </div>

      {/* Grid Poster Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-amber-200 bg-white">
        
        {/* SECTION 1: WHAT IS A FRACTION? */}
        <div className="flex flex-col min-h-[460px] bg-sky-50/5">
          <div className="bg-[#0284C7] text-white text-[10px] font-black uppercase tracking-wider py-2.5 px-4 text-center">
            Section 1: What is a Fraction?
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-800 leading-tight">Fractions are equal parts of a whole!</h4>
              <p className="text-[9px] font-bold text-slate-400">Click below to change the pizza cut slices.</p>
            </div>

            {/* Pizza Slices Drawer */}
            <div className="flex justify-center my-2">
              <svg width="110" height="110" viewBox="0 0 100 100">
                {/* Crust */}
                <circle cx="50" cy="50" r="47" fill="#E2A154" stroke="#C37B2B" strokeWidth="2.5" />
                {/* Cheese */}
                <circle cx="50" cy="50" r="41" fill="#FFD05B" />
                {/* Divider lines */}
                {Array.from({ length: sec1Slices }).map((_, idx) => {
                  const angle = (idx * 360) / sec1Slices;
                  const rad = (angle * Math.PI) / 180;
                  const endX = 50 + 41 * Math.cos(rad);
                  const endY = 50 + 41 * Math.sin(rad);
                  return (
                    <line
                      key={idx}
                      x1="50"
                      y1="50"
                      x2={endX}
                      y2={endY}
                      stroke="#C37B2B"
                      strokeWidth="1.5"
                    />
                  );
                })}
              </svg>
            </div>

            <div className="flex justify-center gap-1.5">
              {[2, 4, 8].map(parts => (
                <button
                  key={parts}
                  onClick={() => setSec1Slices(parts)}
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-black border transition-all ${
                    sec1Slices === parts
                      ? 'bg-sky-100 border-sky-300 text-sky-900 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {parts} parts
                </button>
              ))}
            </div>

            <div className="bg-sky-50 border border-sky-100 rounded-xl p-2.5 text-center">
              <span className="text-[9px] font-black text-sky-800 block uppercase tracking-wider">Each slice =</span>
              <div className="flex flex-col items-center justify-center mt-1">
                <span className="text-sm font-black text-sky-900 leading-none">1</span>
                <div className="w-5 h-0.5 bg-sky-900 my-0.5" />
                <span className="text-sm font-black text-sky-900 leading-none">{sec1Slices}</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: NUMERATOR & DENOMINATOR */}
        <div className="flex flex-col min-h-[460px] bg-amber-50/5">
          <div className="bg-[#D97706] text-white text-[10px] font-black uppercase tracking-wider py-2.5 px-4 text-center">
            Section 2: Numerator &amp; Denominator
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-800 leading-tight">Two parts to every fraction!</h4>
              <p className="text-[9px] font-bold text-slate-400">Click slices to change pieces we have.</p>
            </div>

            {/* Interactive Pie Chart (6 parts) */}
            <div className="flex justify-center my-2">
              <svg width="110" height="110" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
                {Array.from({ length: 6 }).map((_, idx) => {
                  const startAngle = (idx * 360) / 6;
                  const endAngle = ((idx + 1) * 360) / 6;
                  const isSelected = idx < sec2Selected;

                  return (
                    <path
                      key={idx}
                      d={getSectorPath(50, 50, 43, startAngle, endAngle)}
                      fill={isSelected ? "#F59E0B" : "#FEF3C7"}
                      stroke="#D97706"
                      strokeWidth="1.5"
                      className="cursor-pointer hover:opacity-95 transition-opacity"
                      onClick={() => setSec2Selected(idx + 1)}
                    />
                  );
                })}
              </svg>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 bg-amber-50/50 p-2 rounded-lg border border-amber-100/50">
                <span className="text-[#D97706] font-black">Numerator:</span>
                <span>Taken ({sec2Selected})</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 bg-amber-50/50 p-2 rounded-lg border border-amber-100/50">
                <span className="text-slate-700 font-black">Denominator:</span>
                <span>Total Slices (6)</span>
              </div>
            </div>

            {/* fraction display */}
            <div className="flex items-center justify-center bg-amber-50 p-2 rounded-xl border border-amber-100">
              <div className="flex flex-col items-center">
                <span className="text-base font-black text-amber-900 leading-none">{sec2Selected}</span>
                <div className="w-6 h-0.5 bg-amber-900 my-0.5" />
                <span className="text-base font-black text-amber-900 leading-none">6</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: EQUIVALENT FRACTIONS */}
        <div className="flex flex-col min-h-[460px] bg-green-50/5">
          <div className="bg-[#EA580C] text-white text-[10px] font-black uppercase tracking-wider py-2.5 px-4 text-center">
            Section 3: Equivalent Fractions
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-800 leading-tight">Same size, different cuts!</h4>
              <p className="text-[9px] font-bold text-slate-400">Choose base fraction &amp; multiplier below:</p>
            </div>

            {/* Base Fraction and Multiplier Controls */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1 text-left">
                <span className="text-[8px] font-black uppercase text-slate-400 block">Base:</span>
                <div className="flex gap-1">
                  {[2, 3, 4].map(b => (
                    <button
                      key={b}
                      onClick={() => setSec3Base(b)}
                      className={`flex-1 py-1 rounded-md text-[8px] font-black border transition-all ${
                        sec3Base === b
                          ? 'bg-green-100 border-green-300 text-green-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      1/{b}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1 text-left">
                <span className="text-[8px] font-black uppercase text-slate-400 block">Multiply by:</span>
                <div className="flex gap-1">
                  {[2, 3].map(m => (
                    <button
                      key={m}
                      onClick={() => setSec3Mult(m)}
                      className={`flex-1 py-1 rounded-md text-[8px] font-black border transition-all ${
                        sec3Mult === m
                          ? 'bg-green-100 border-green-300 text-green-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      x{m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cookie equivalent SVG */}
            <div className="flex justify-center gap-2 my-2">
              {/* Left Cookie */}
              <div className="flex flex-col items-center gap-1.5">
                <svg width="65" height="65" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="#DDB892" stroke="#7F5539" strokeWidth="2" />
                  {Array.from({ length: sec3Base }).map((_, idx) => {
                    const startAngle = (idx * 360) / sec3Base;
                    const endAngle = ((idx + 1) * 360) / sec3Base;
                    const isSelected = idx === 0;
                    return (
                      <path
                        key={idx}
                        d={getSectorPath(50, 50, 44, startAngle, endAngle)}
                        fill={isSelected ? "#EA580C" : "#FFFDF5"}
                        fillOpacity={isSelected ? 0.6 : 0.9}
                        stroke="#7F5539"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                  {/* Chocolate chips */}
                  <circle cx="35" cy="35" r="2.5" fill="#4a3b32" />
                  <circle cx="65" cy="65" r="2.5" fill="#4a3b32" />
                </svg>
                <div className="flex flex-col items-center text-[10px] font-black text-green-800">
                  <span>1</span>
                  <div className="w-3.5 h-0.5 bg-green-800 my-0.5" />
                  <span>{sec3Base}</span>
                </div>
              </div>

              <div className="text-base font-black text-green-700 self-center">=</div>

              {/* Right Cookie */}
              <div className="flex flex-col items-center gap-1.5">
                <svg width="65" height="65" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="#DDB892" stroke="#7F5539" strokeWidth="2" />
                  {Array.from({ length: sec3Base * sec3Mult }).map((_, idx) => {
                    const startAngle = (idx * 360) / (sec3Base * sec3Mult);
                    const endAngle = ((idx + 1) * 360) / (sec3Base * sec3Mult);
                    const isSelected = idx < sec3Mult;
                    return (
                      <path
                        key={idx}
                        d={getSectorPath(50, 50, 44, startAngle, endAngle)}
                        fill={isSelected ? "#EA580C" : "#FFFDF5"}
                        fillOpacity={isSelected ? 0.6 : 0.9}
                        stroke="#7F5539"
                        strokeWidth="1"
                      />
                    );
                  })}
                  {/* Chocolate chips */}
                  <circle cx="45" cy="25" r="2" fill="#4a3b32" />
                  <circle cx="55" cy="75" r="2" fill="#4a3b32" />
                </svg>
                <div className="flex flex-col items-center text-[10px] font-black text-green-800">
                  <span>{sec3Mult}</span>
                  <div className="w-3.5 h-0.5 bg-green-800 my-0.5" />
                  <span>{sec3Base * sec3Mult}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-2.5 text-[9px] font-bold text-green-900 leading-relaxed text-center">
              Multiplying numerator and denominator by <strong>{sec3Mult}</strong> gives the equivalent fraction <strong>{sec3Mult}/{sec3Base * sec3Mult}</strong>! 🍪
            </div>
          </div>
        </div>

        {/* SECTION 4: COMPARING FRACTIONS */}
        <div className="flex flex-col min-h-[460px] bg-rose-50/5">
          <div className="bg-[#E11D48] text-white text-[10px] font-black uppercase tracking-wider py-2.5 px-4 text-center">
            Section 4: Comparing Fractions
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-800 leading-tight">Same denominator, compare top!</h4>
              <p className="text-[9px] font-bold text-slate-400">Select fractions to watch the balance tilt.</p>
            </div>

            {/* Tilting Balance Scale SVG */}
            <div className="flex justify-center my-2 h-24 relative">
              <svg width="130" height="90" viewBox="0 0 150 100" className="overflow-visible">
                <line x1="75" y1="20" x2="75" y2="85" stroke="#475569" strokeWidth="4" />
                <polygon points="50,85 100,85 75,70" fill="#475569" />

                <g style={{ transform: `rotate(${tiltAngle}deg)`, transformOrigin: '75px 20px', transition: 'transform 350ms ease' }}>
                  <line x1="20" y1="20" x2="130" y2="20" stroke="#475569" strokeWidth="3.5" />
                  
                  {/* Left Pan */}
                  <line x1="20" y1="20" x2="20" y2="50" stroke="#94A3B8" strokeWidth="1" />
                  <ellipse cx="20" cy="50" rx="20" ry="4" fill="#E2E8F0" stroke="#475569" strokeWidth="1" />
                  <text x="20" y="47" textAnchor="middle" className="text-[7.5px] font-black fill-[#E11D48]">{sec4Left}/4</text>

                  {/* Right Pan */}
                  <line x1="130" y1="20" x2="130" y2="50" stroke="#94A3B8" strokeWidth="1" />
                  <ellipse cx="130" cy="50" rx="20" ry="4" fill="#E2E8F0" stroke="#475569" strokeWidth="1" />
                  <text x="130" y="47" textAnchor="middle" className="text-[7.5px] font-black fill-[#E11D48]">{sec4Right}/4</text>
                </g>
              </svg>
            </div>

            {/* Scale selectors */}
            <div className="flex justify-between items-center gap-1">
              <select
                value={sec4Left}
                onChange={(e) => setSec4Left(parseInt(e.target.value, 10))}
                className="bg-slate-50 border border-slate-200 rounded-lg p-1 text-[9px] font-black"
              >
                <option value="1">1/4</option>
                <option value="2">2/4</option>
                <option value="3">3/4</option>
                <option value="4">4/4</option>
              </select>

              <div className="text-sm font-black text-rose-600">
                {sec4Left > sec4Right ? ">" : sec4Left < sec4Right ? "<" : "="}
              </div>

              <select
                value={sec4Right}
                onChange={(e) => setSec4Right(parseInt(e.target.value, 10))}
                className="bg-slate-50 border border-slate-200 rounded-lg p-1 text-[9px] font-black"
              >
                <option value="1">1/4</option>
                <option value="2">2/4</option>
                <option value="3">3/4</option>
                <option value="4">4/4</option>
              </select>
            </div>

            <div className="bg-rose-50 border border-rose-100 rounded-xl p-2.5 text-[9px] font-bold text-rose-900 leading-relaxed text-center">
              {sec4Left === sec4Right ? "Perfect Balance!" : `${sec4Left > sec4Right ? `${sec4Left}/4` : `${sec4Right}/4`} is heavier!`}
            </div>
          </div>
        </div>

      </div>

      {/* Footer message */}
      <div className="bg-amber-100 px-6 py-2.5 text-center border-t border-amber-200 text-amber-950 text-[10px] font-black">
        ⭐ Remember: Practice makes you a fractions superstar!
      </div>
    </div>
  );
};

// ==========================================
// 7. ANGLES VISUALIZER (Interactive)
// ==========================================
export const AngleVisualizer = () => {
  const [angle, setAngle] = useState(45);
  
  const rad = (angle * Math.PI) / 180;
  const lineX = 100 + 80 * Math.cos(-rad); // y-axis is inverted in SVG
  const lineY = 150 + 80 * Math.sin(-rad);
  
  // arc coordinates
  const arcX = 100 + 25 * Math.cos(-rad);
  const arcY = 150 + 25 * Math.sin(-rad);
  const largeArcFlag = angle > 180 ? 1 : 0;
  const arcPath = `M 125 150 A 25 25 0 ${largeArcFlag} 0 ${arcX} ${arcY}`;
  
  const getAngleName = (deg) => {
    if (deg === 0) return "Zero Angle";
    if (deg < 90) return "Acute Angle (Smaller than 90°)";
    if (deg === 90) return "Right Angle (Exactly 90°)";
    if (deg < 180) return "Obtuse Angle (Between 90° and 180°)";
    if (deg === 180) return "Straight Angle (Exactly 180°)";
    return `${deg}° Angle`;
  };
  
  return (
    <div className="bg-orange-50/20 border border-orange-200 rounded-3xl p-6 space-y-6 text-left my-2">
      <h4 className="text-xs font-black text-orange-700 uppercase tracking-widest">📐 Interactive Angle Investigator</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="flex justify-center bg-white rounded-2xl p-4 border border-slate-100 shadow-sm relative">
          <svg width="200" height="180" viewBox="0 0 200 180" className="overflow-visible">
            {/* Vertex base point */}
            <circle cx="100" cy="150" r="5" fill="#4338CA" />
            
            {/* Baseline (Horizontal ray) */}
            <line x1="100" y1="150" x2="180" y2="150" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            <polygon points="180,146 188,150 180,154" fill="#475569" />
            
            {/* Rotated ray */}
            <line x1="100" y1="150" x2={lineX} y2={lineY} stroke="#4F46E5" strokeWidth="4" strokeLinecap="round" />
            {angle > 0 && (
              <g style={{ transform: `rotate(${-angle}deg)`, transformOrigin: '100px 150px' }}>
                <polygon points="180,146 188,150 180,154" fill="#4F46E5" />
              </g>
            )}
            
            {/* Angle Arc */}
            {angle > 0 && angle < 180 && (
              <path d={arcPath} fill="none" stroke="#818CF8" strokeWidth="3" />
            )}
            
            {/* Square corner helper for 90 degrees */}
            {angle === 90 && (
              <rect x="100" y="135" width="15" height="15" fill="none" stroke="#E11D48" strokeWidth="2" />
            )}
            
            {/* Angle text */}
            <text x="105" y="130" className="text-xs font-black fill-orange-600">{angle}°</text>
          </svg>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 uppercase">Adjust angle: {angle}°</label>
            <input
              type="range"
              min="0"
              max="180"
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value, 10))}
              className="w-full accent-orange-600 h-2 bg-orange-50 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-xs font-bold text-orange-950 space-y-1">
            <span className="font-black text-orange-800 uppercase block tracking-wider text-[10px]">Classification:</span>
            <p className="text-sm font-black">{getAngleName(angle)}</p>
            <p className="text-slate-500 font-bold leading-relaxed pt-1 text-[11px]">
              {angle < 90 && "Acute angles are sharp and narrow, like a slice of pizza! 🍕"}
              {angle === 90 && "Right angles make a perfect L-shape, like the corner of a book! 📚"}
              {angle > 90 && angle < 180 && "Obtuse angles are wide and open, like a folding fan! 🪭"}
              {angle === 180 && "Straight angles are perfectly flat, like a straight road! 🛣️"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. NUMBER LINE VISUALIZER (Interactive)
// ==========================================
export const NumberLineVisualizer = () => {
  const [val, setVal] = useState(5);
  
  const ticks = Array.from({ length: 11 });
  const getTickX = (i) => 20 + i * 18;
  
  return (
    <div className="bg-orange-50/20 border border-emerald-100 rounded-3xl p-6 space-y-4 text-left my-2">
      <h4 className="text-xs font-black text-emerald-700 uppercase tracking-widest">🐸 Interactive Number Line Jump</h4>
      
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm overflow-visible flex justify-center">
        <svg width="230" height="90" viewBox="0 0 220 90" className="overflow-visible">
          {/* Number Line horizontal bar */}
          <line x1="10" y1="60" x2="210" y2="60" stroke="#475569" strokeWidth="3" />
          <polygon points="10,56 4,60 10,64" fill="#475569" />
          <polygon points="210,56 216,60 210,64" fill="#475569" />
          
          {/* Ticks and Labels */}
          {ticks.map((_, i) => {
            const x = getTickX(i);
            const isSelected = i === val;
            return (
              <g key={i}>
                <line x1={x} y1="53" x2={x} y2={i % 5 === 0 ? "67" : "62"} stroke={isSelected ? "#10B981" : "#94A3B8"} strokeWidth={isSelected ? "3" : "1.5"} />
                <text x={x} y="82" textAnchor="middle" className={`text-[10px] font-black ${isSelected ? 'fill-emerald-600 text-xs' : 'fill-slate-400'}`}>{i}</text>
              </g>
            );
          })}
          
          {/* Jumps (drawn as arcs from 0 to val) */}
          {Array.from({ length: val }).map((_, i) => {
            const startX = getTickX(i);
            const endX = getTickX(i + 1);
            const midX = (startX + endX) / 2;
            const path = `M ${startX} 60 Q ${midX} 35 ${endX} 60`;
            return (
              <path key={i} d={path} fill="none" stroke="#A7F3D0" strokeWidth="2" strokeDasharray="2,1" />
            );
          })}
          
          {/* Frog Icon at current value */}
          <g style={{ transform: `translate(${getTickX(val) - 10}px, 20px)`, transition: 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            <text className="text-xl">🐸</text>
          </g>
        </svg>
      </div>
      
      <div className="flex items-center gap-4">
        <input
          type="range"
          min="0"
          max="10"
          value={val}
          onChange={(e) => setVal(parseInt(e.target.value, 10))}
          className="w-full accent-emerald-500 h-2 bg-emerald-50 rounded-lg appearance-none cursor-pointer"
        />
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 text-center text-xs font-black text-emerald-950 shrink-0 font-mono">
          Current: {val}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 9. OPERATIONS VISUALIZER (Interactive)
// ==========================================
export const OperationsVisualizer = () => {
  const [numA, setNumA] = useState(4);
  const [numB, setNumB] = useState(3);
  const [op, setOp] = useState('+');
  
  const handleSetOp = (newOp) => {
    setOp(newOp);
    if (newOp === '/') {
      setNumA(6);
      setNumB(2);
    } else if (newOp === '-') {
      setNumA(Math.max(numA, numB));
    }
  };
  
  const handleSetA = (val) => {
    if (op === '-') {
      setNumA(Math.max(val, numB));
    } else {
      setNumA(val);
    }
  };
  
  const handleSetB = (val) => {
    if (op === '-') {
      setNumB(Math.min(val, numA));
    } else if (op === '/') {
      setNumB(Math.max(1, val));
    } else {
      setNumB(val);
    }
  };
  
  const getResult = () => {
    if (op === '+') return numA + numB;
    if (op === '-') return numA - numB;
    if (op === '*') return numA * numB;
    if (op === '/') return (numA / numB).toFixed(1).replace('.0', '');
    return 0;
  };
  
  return (
    <div className="bg-orange-50/20 border border-rose-100 rounded-3xl p-6 space-y-6 text-left my-2">
      <h4 className="text-xs font-black text-rose-700 uppercase tracking-widest">🧮 Interactive Operations Array</h4>
      
      {/* Operation Selector */}
      <div className="flex bg-rose-50/50 p-1 rounded-xl border border-rose-100/50 w-full gap-1">
        {['+', '-', '*', '/'].map(symbol => (
          <button
            key={symbol}
            onClick={() => handleSetOp(symbol)}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-black transition-all ${
              op === symbol
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {symbol === '+' && 'Addition (+)'}
            {symbol === '-' && 'Subtraction (-)'}
            {symbol === '*' && 'Multiplication (x)'}
            {symbol === '/' && 'Division (÷)'}
          </button>
        ))}
      </div>
      
      {/* Control Sliders */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase">Number A: {numA}</label>
          <input
            type="range"
            min="1"
            max="10"
            value={numA}
            onChange={(e) => handleSetA(parseInt(e.target.value, 10))}
            className="w-full accent-rose-500 h-1.5 bg-rose-50 rounded"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase">
            {op === '/' ? 'Baskets (B):' : 'Number B:'} {numB}
          </label>
          <input
            type="range"
            min="1"
            max={op === '-' ? numA : 10}
            value={numB}
            onChange={(e) => handleSetB(parseInt(e.target.value, 10))}
            className="w-full accent-rose-500 h-1.5 bg-rose-50 rounded"
          />
        </div>
      </div>
      
      {/* Visualizer Display Area */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[140px] space-y-4">
        {op === '+' && (
          <div className="flex flex-wrap gap-2 justify-center max-w-md">
            <div className="flex flex-wrap gap-1 p-2 bg-red-50/50 rounded-xl border border-red-100">
              {Array.from({ length: numA }).map((_, i) => <span key={i} className="text-xl">🍎</span>)}
            </div>
            <span className="text-xl font-black self-center text-slate-400">+</span>
            <div className="flex flex-wrap gap-1 p-2 bg-emerald-50/50 rounded-xl border border-emerald-100">
              {Array.from({ length: numB }).map((_, i) => <span key={i} className="text-xl">🍏</span>)}
            </div>
          </div>
        )}
        
        {op === '-' && (
          <div className="flex flex-wrap gap-2 justify-center p-2 bg-red-50/20 rounded-xl border border-slate-100">
            {Array.from({ length: numA }).map((_, i) => {
              const isCrossed = i >= numA - numB;
              return (
                <div key={i} className="relative w-8 h-8 flex items-center justify-center text-xl bg-white border border-slate-100 rounded-lg shadow-sm">
                  <span>🍎</span>
                  {isCrossed && (
                    <div className="absolute inset-0 flex items-center justify-center text-rose-500 font-black text-2xl select-none">✕</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        {op === '*' && (
          <div className="flex flex-col gap-1 items-center bg-amber-50/10 p-3 rounded-xl border border-slate-100">
            {Array.from({ length: numA }).map((_, rIdx) => (
              <div key={rIdx} className="flex gap-1">
                {Array.from({ length: numB }).map((_, cIdx) => (
                  <span key={cIdx} className="text-lg">⭐</span>
                ))}
              </div>
            ))}
          </div>
        )}
        
        {op === '/' && (
          <div className="flex flex-col gap-3 w-full">
            <div className="flex flex-wrap gap-1 justify-center">
              {Array.from({ length: numA }).map((_, i) => <span key={i} className="text-lg">🍎</span>)}
            </div>
            <div className="text-[10px] text-center font-black text-slate-400 uppercase">Shared Equally:</div>
            <div className="grid gap-2 justify-center" style={{ gridTemplateColumns: `repeat(${Math.min(5, numB)}, minmax(0, 1fr))` }}>
              {Array.from({ length: numB }).map((_, bIdx) => {
                const shareCount = Math.floor(numA / numB);
                const remainder = numA % numB;
                const getExtra = bIdx < remainder ? 1 : 0;
                const itemInBasketCount = shareCount + getExtra;
                
                return (
                  <div key={bIdx} className="border border-amber-300 bg-amber-50/40 rounded-xl p-2 flex flex-col items-center min-w-[50px] shadow-sm">
                    <span className="text-[8px] font-black text-amber-800 uppercase block mb-1">Basket {bIdx + 1}</span>
                    <div className="flex flex-wrap gap-0.5 justify-center">
                      {Array.from({ length: itemInBasketCount }).map((_, i) => <span key={i} className="text-sm">🍎</span>)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <div className="text-sm font-black text-slate-800 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100 font-mono">
          {numA} {op === '*' ? 'x' : op === '/' ? '÷' : op} {numB} = <span className="text-rose-500 font-black">{getResult()}</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 10. MEASUREMENT VISUALIZER (Interactive)
// ==========================================
export const MeasurementVisualizer = () => {
  const [mode, setMode] = useState('length'); // 'length', 'weight', 'capacity'
  const [len, setLen] = useState(8); 
  const [cap, setCap] = useState(600); 
  const [weightLeft, setWeightLeft] = useState('apple'); 
  const [weightRight, setWeightRight] = useState('toy');
  
  const weights = {
    feather: { label: "Feather 🪶", val: 1 },
    apple: { label: "Apple 🍎", val: 100 },
    toy: { label: "Teddy 🧸", val: 200 },
    brick: { label: "Brick 🧱", val: 500 }
  };
  
  const wl = weights[weightLeft].val;
  const wr = weights[weightRight].val;
  let weightTilt = 0;
  if (wl > wr) weightTilt = -15;
  if (wl < wr) weightTilt = 15;
  
  return (
    <div className="bg-orange-50/20 border border-cyan-100 rounded-3xl p-6 space-y-6 text-left my-2">
      <h4 className="text-xs font-black text-cyan-700 uppercase tracking-widest">📐 Interactive Measurement Laboratory</h4>
      
      {/* Mode Selector */}
      <div className="flex bg-cyan-50/50 p-1 rounded-xl border border-cyan-100/50 w-full gap-1">
        {[
          { id: 'length', label: 'Length 📏' },
          { id: 'weight', label: 'Weight ⚖️' },
          { id: 'capacity', label: 'Capacity 🥛' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all ${
              mode === tab.id
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[160px]">
        
        {/* LENGTH MODE */}
        {mode === 'length' && (
          <div className="w-full space-y-5">
            <div className="flex justify-center bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              <svg width="220" height="90" viewBox="0 0 220 90" className="overflow-visible">
                <g transform="translate(10, 10)">
                  <rect x="0" y="10" width="10" height="20" fill="#FDA4AF" rx="2" />
                  <rect x="10" y="10" width="6" height="20" fill="#94A3B8" />
                  <rect x="16" y="10" width={len * 12} height="20" fill="#FBBF24" />
                  <polygon points={`${16 + len * 12},10 ${30 + len * 12},20 ${16 + len * 12},30`} fill="#FED7AA" />
                  <polygon points={`${24 + len * 12},15 ${30 + len * 12},20 ${24 + len * 12},25`} fill="#334155" />
                </g>
                
                <rect x="10" y="55" width="200" height="20" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" rx="3" />
                {Array.from({ length: 13 }).map((_, i) => {
                  const x = 10 + i * 15;
                  return (
                    <g key={i}>
                      <line x1={x} y1="55" x2={x} y2={i % 5 === 0 ? "67" : "62"} stroke="#64748B" strokeWidth="1" />
                      {i % 5 === 0 && <text x={x} y="72" textAnchor="middle" className="text-[7px] font-black fill-slate-500">{i}cm</text>}
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="2"
                max="12"
                value={len}
                onChange={(e) => setLen(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-500 h-2 bg-cyan-50 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs font-black text-cyan-950 shrink-0 font-mono">
                Length: <span className="bg-cyan-50 border border-cyan-100 px-2 py-1 rounded">{len} cm</span>
              </div>
            </div>
          </div>
        )}
        
        {/* WEIGHT MODE */}
        {mode === 'weight' && (
          <div className="w-full space-y-4">
            <div className="flex justify-center">
              <svg width="150" height="100" viewBox="0 0 150 100" className="overflow-visible">
                <line x1="75" y1="20" x2="75" y2="85" stroke="#475569" strokeWidth="4" />
                <polygon points="50,85 100,85 75,70" fill="#475569" />
                
                <g style={{ transform: `rotate(${weightTilt}deg)`, transformOrigin: '75px 20px', transition: 'transform 350ms ease' }}>
                  <line x1="20" y1="20" x2="130" y2="20" stroke="#475569" strokeWidth="3" />
                  
                  {/* Left Pan */}
                  <line x1="20" y1="20" x2="20" y2="50" stroke="#94A3B8" strokeWidth="1" />
                  <ellipse cx="20" cy="50" rx="20" ry="4" fill="#E2E8F0" stroke="#475569" strokeWidth="1" />
                  <text x="20" y="46" textAnchor="middle" className="text-[6.5px] font-black fill-slate-700">{weightLeft === 'apple' ? '🍎' : weightLeft === 'brick' ? '🧱' : weightLeft === 'feather' ? '🪶' : '🧸'}</text>
                  
                  {/* Right Pan */}
                  <line x1="130" y1="20" x2="130" y2="50" stroke="#94A3B8" strokeWidth="1" />
                  <ellipse cx="130" cy="50" rx="20" ry="4" fill="#E2E8F0" stroke="#475569" strokeWidth="1" />
                  <text x="130" y="46" textAnchor="middle" className="text-[6.5px] font-black fill-slate-700">{weightRight === 'apple' ? '🍎' : weightRight === 'brick' ? '🧱' : weightRight === 'feather' ? '🪶' : '🧸'}</text>
                </g>
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-slate-400 uppercase block">Left Pan:</span>
                <select
                  value={weightLeft}
                  onChange={(e) => setWeightLeft(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-black w-full"
                >
                  {Object.keys(weights).map(k => <option key={k} value={k}>{weights[k].label} ({weights[k].val}g)</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black text-slate-400 uppercase block">Right Pan:</span>
                <select
                  value={weightRight}
                  onChange={(e) => setWeightRight(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-black w-full"
                >
                  {Object.keys(weights).map(k => <option key={k} value={k}>{weights[k].label} ({weights[k].val}g)</option>)}
                </select>
              </div>
            </div>
            <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-2.5 text-[10px] font-bold text-cyan-900 leading-relaxed text-center w-full">
              {wl === wr ? "Scale is balanced! Both weigh the same." : `${wl > wr ? weights[weightLeft].label : weights[weightRight].label} is heavier!`}
            </div>
          </div>
        )}
        
        {/* CAPACITY MODE */}
        {mode === 'capacity' && (
          <div className="w-full space-y-4">
            <div className="flex justify-center">
              <svg width="100" height="110" viewBox="0 0 100 110" className="overflow-visible">
                <path d="M 30 10 L 30 100 A 10 10 0 0 0 40 110 L 60 110 A 10 10 0 0 0 70 100 L 70 10" fill="none" stroke="#64748B" strokeWidth="3" />
                <path 
                  d={`M 30 ${100 - (cap * 0.08)} L 30 100 A 10 10 0 0 0 40 110 L 60 110 A 10 10 0 0 0 70 100 L 70 ${100 - (cap * 0.08)} Z`} 
                  fill="#38BDF8" 
                  opacity="0.85" 
                />
                {[200, 400, 600, 800, 1000].map(m => {
                  const y = 100 - (m * 0.08);
                  return (
                    <g key={m}>
                      <line x1="65" y1={y} x2="70" y2={y} stroke="#475569" strokeWidth="1.5" />
                      <text x="75" y={y + 3} className="text-[7px] font-black fill-slate-500">{m}ml</text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="1000"
                step="50"
                value={cap}
                onChange={(e) => setCap(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-500 h-2 bg-cyan-50 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs font-black text-cyan-950 shrink-0 font-mono">
                Volume: <span className="bg-cyan-50 border border-cyan-100 px-2 py-1 rounded">{cap} ml</span>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

// ==========================================
// 11. MONEY VISUALIZER (Interactive)
// ==========================================
export const MoneyVisualizer = () => {
  const [coins, setCoins] = useState([]);
  
  const coinTypes = [
    { id: 'penny', label: '1¢ Penny', val: 0.01, icon: '🪙', color: 'bg-[#D68C45]' },
    { id: 'nickel', label: '5¢ Nickel', val: 0.05, icon: '🪙', color: 'bg-[#94A3B8]' },
    { id: 'dime', label: '10¢ Dime', val: 0.10, icon: '🪙', color: 'bg-[#CBD5E1]' },
    { id: 'quarter', label: '25¢ Quarter', val: 0.25, icon: '🪙', color: 'bg-[#64748B]' },
    { id: 'dollar', label: '$1.00 Bill', val: 1.00, icon: '💵', color: 'bg-[#A7F3D0]' }
  ];
  
  const addMoney = (val) => {
    setCoins([...coins, val]);
  };
  
  const getTotal = () => {
    return coins.reduce((acc, c) => acc + c, 0).toFixed(2);
  };
  
  return (
    <div className="bg-orange-50/20 border border-amber-100 rounded-3xl p-6 space-y-6 text-left my-2">
      <h4 className="text-xs font-black text-amber-700 uppercase tracking-widest">🪙 Interactive Cash Piggy Bank</h4>
      
      <div className="space-y-2">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Tap to add money:</span>
        <div className="grid grid-cols-5 gap-1.5">
          {coinTypes.map(c => (
            <button
              key={c.id}
              onClick={() => addMoney(c.val)}
              className="py-2 px-1 rounded-xl text-[9px] font-black text-slate-800 border border-slate-200 hover:scale-105 active:scale-95 transition-all bg-white shadow-sm flex flex-col items-center gap-1"
            >
              <span className="text-base">{c.icon}</span>
              <span className="leading-tight text-center">{c.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center min-h-[130px] justify-between space-y-3 relative overflow-hidden">
        <div className="absolute top-2 right-2 text-5xl opacity-5">🐷</div>
        
        <div className="flex flex-wrap gap-1.5 justify-center max-h-[80px] overflow-y-auto w-full custom-scrollbar p-1">
          {coins.length > 0 ? (
            coins.map((cVal, idx) => {
              const type = coinTypes.find(t => t.val === cVal);
              return (
                <div 
                  key={idx} 
                  className={`${type.color} text-slate-900 border border-slate-400/30 text-[9px] font-black rounded-full w-8 h-8 flex items-center justify-center shadow-sm`}
                >
                  {type.val === 1.00 ? '💵' : `${type.val * 100}¢`}
                </div>
              );
            })
          ) : (
            <span className="text-xs font-bold text-slate-400 italic self-center">Piggy bank is empty! Click coins to add money.</span>
          )}
        </div>
        
        <div className="flex items-center gap-3 border-t border-slate-100 pt-3 w-full justify-between shrink-0">
          <button 
            onClick={() => setCoins([])} 
            className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-[9px] font-black hover:bg-rose-100 transition-colors"
          >
            Reset Bank
          </button>
          <div className="text-sm font-black text-[#166534] bg-[#FFEDD5] px-4 py-1.5 rounded-full border border-green-200 font-mono">
            Total: <span className="text-[#EA580C] font-black">${getTotal()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 12. EVEN & ODD VISUALIZER (Interactive)
// ==========================================
export const EvenOddVisualizer = () => {
  const [val, setVal] = useState(6);
  
  const isEven = val % 2 === 0;
  const pairsCount = Math.floor(val / 2);
  const hasRemainder = val % 2 !== 0;
  
  return (
    <div className="bg-orange-50/20 border border-green-200 rounded-3xl p-6 space-y-6 text-left my-2">
      <h4 className="text-xs font-black text-orange-700 uppercase tracking-widest">👯 Partner Pairer (Even &amp; Odd)</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl p-5 border border-slate-100 shadow-sm min-h-[150px] space-y-4">
          <div className="flex flex-wrap gap-4 justify-center items-center">
            {Array.from({ length: pairsCount }).map((_, pIdx) => (
              <div key={pIdx} className="border-2 border-dashed border-green-350 bg-green-50/35 p-1.5 rounded-2xl flex gap-1.5 shadow-sm">
                <span className="text-2xl">🧸</span>
                <span className="text-2xl">🧸</span>
              </div>
            ))}
            
            {hasRemainder && (
              <div className="border-2 border-solid border-rose-300 bg-rose-50/50 p-1.5 rounded-2xl flex flex-col items-center shadow-sm relative animate-bounce">
                <span className="text-2xl">🧸</span>
                <span className="absolute -top-3 -right-3 text-[9px] bg-rose-500 text-white font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">Lonely!</span>
              </div>
            )}
          </div>
          
          <div className={`px-4 py-1.5 rounded-full text-xs font-black border font-mono ${
            isEven 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {val} is {isEven ? 'EVEN (Perfect Pairs! 🎉)' : 'ODD (1 Left Over! 🧸)'}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 uppercase">Select a Number: {val}</label>
            <input
              type="range"
              min="1"
              max="12"
              value={val}
              onChange={(e) => setVal(parseInt(e.target.value, 10))}
              className="w-full accent-orange-600 h-2 bg-green-50 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <p className="text-xs text-slate-500 font-bold leading-relaxed">
            {isEven 
              ? `We can group all ${val} teddy bears into ${pairsCount} perfect pairs of friends. No one is left alone!` 
              : `We have ${pairsCount} pairs of teddy bears, but 1 teddy bear is left out and has no partner. That makes ${val} an odd number!`
            }
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 13. ROMAN NUMERALS VISUALIZER (Interactive)
// ==========================================
export const RomanNumeralsVisualizer = () => {
  const [num, setNum] = useState(45);
  
  const getRoman = (n) => {
    const romanMap = [
      { v: 100, s: 'C' },
      { v: 90, s: 'XC' },
      { v: 50, s: 'L' },
      { v: 40, s: 'XL' },
      { v: 10, s: 'X' },
      { v: 9, s: 'IX' },
      { v: 5, s: 'V' },
      { v: 4, s: 'IV' },
      { v: 1, s: 'I' }
    ];
    let result = '';
    let rem = n;
    romanMap.forEach(item => {
      while (rem >= item.v) {
        result += item.s;
        rem -= item.v;
      }
    });
    return result;
  };
  
  const tens = Math.floor((num % 100) / 10) * 10;
  const ones = num % 10;
  const hundreds = Math.floor(num / 100) * 100;
  
  return (
    <div className="bg-orange-50/20 border border-sky-100 rounded-3xl p-6 space-y-6 text-left my-2">
      <h4 className="text-xs font-black text-sky-700 uppercase tracking-widest">🏛️ Roman Numeral Builder</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 uppercase">Number: {num}</label>
            <input
              type="range"
              min="1"
              max="100"
              value={num}
              onChange={(e) => setNum(parseInt(e.target.value, 10))}
              className="w-full accent-sky-500 h-2 bg-sky-50 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase">Roman Code Chart:</span>
            <div className="grid grid-cols-5 gap-1 text-center font-black text-[10px]">
              <div className="bg-slate-50 p-1 rounded">I = 1</div>
              <div className="bg-slate-50 p-1 rounded">V = 5</div>
              <div className="bg-slate-50 p-1 rounded">X = 10</div>
              <div className="bg-slate-50 p-1 rounded">L = 50</div>
              <div className="bg-slate-50 p-1 rounded">C = 100</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl p-6 border border-sky-50 shadow-sm flex flex-col items-center justify-center min-h-[160px] space-y-4 text-center">
          <div className="flex gap-2 items-center">
            {hundreds > 0 && (
              <div className="bg-sky-50 border border-sky-100 rounded-xl px-3 py-2">
                <span className="text-[10px] text-slate-400 font-bold block">{hundreds}</span>
                <span className="text-sm font-black text-sky-700">{getRoman(hundreds)}</span>
              </div>
            )}
            {tens > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl px-3 py-2">
                <span className="text-[10px] text-slate-400 font-bold block">{tens}</span>
                <span className="text-sm font-black text-orange-700">{getRoman(tens)}</span>
              </div>
            )}
            {ones > 0 && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                <span className="text-[10px] text-slate-400 font-bold block">{ones}</span>
                <span className="text-sm font-black text-amber-700">{getRoman(ones)}</span>
              </div>
            )}
          </div>
          
          <div className="text-3xl font-black text-sky-600 font-serif tracking-widest bg-sky-50/35 px-6 py-3 rounded-2xl border-2 border-dashed border-sky-200">
            {getRoman(num)}
          </div>
          
          <span className="text-[11px] font-bold text-slate-500">
            {num} is written as <span className="font-mono text-sky-600 font-black">{getRoman(num)}</span>!
          </span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 14. AREA & PERIMETER VISUALIZER (Interactive)
// ==========================================
export const AreaPerimeterVisualizer = () => {
  const [w, setW] = useState(6);
  const [h, setH] = useState(4);
  const [shape, setShape] = useState('rectangle'); 
  const [showArea, setShowArea] = useState(true);
  const [showPerimeter, setShowPerimeter] = useState(false);
  
  const area = shape === 'rectangle' ? w * h : (w * h) / 2;
  const perimeter = shape === 'rectangle' 
    ? 2 * w + 2 * h 
    : (w + h + Math.sqrt(w * w + h * h)).toFixed(1).replace('.0', '');
    
  return (
    <div className="bg-orange-50/20 border border-green-200 rounded-3xl p-6 space-y-6 text-left my-2">
      <h4 className="text-xs font-black text-green-700 uppercase tracking-widest">📐 Area &amp; Perimeter Grid</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex gap-2 bg-green-50 p-1 rounded-xl w-fit border border-green-200">
          <button
            onClick={() => setShape('rectangle')}
            className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
              shape === 'rectangle' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500'
            }`}
          >
            Rectangle
          </button>
          <button
            onClick={() => setShape('triangle')}
            className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
              shape === 'triangle' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500'
            }`}
          >
            Right Triangle
          </button>
        </div>
        
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2 text-xs font-black text-slate-500 cursor-pointer">
            <input
              type="checkbox"
              checked={showArea}
              onChange={() => setShowArea(!showArea)}
              className="rounded border-slate-300 text-green-600 focus:ring-green-500 w-4 h-4"
            />
            Show Area 🟩
          </label>
          <label className="flex items-center gap-2 text-xs font-black text-slate-500 cursor-pointer">
            <input
              type="checkbox"
              checked={showPerimeter}
              onChange={() => setShowPerimeter(!showPerimeter)}
              className="rounded border-slate-300 text-green-600 focus:ring-green-500 w-4 h-4"
            />
            Show Perimeter 🔴
          </label>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="flex justify-center bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <svg width="220" height="220" viewBox="0 0 220 220" className="bg-orange-50/20 border border-slate-200">
            {Array.from({ length: 11 }).map((_, i) => (
              <g key={i}>
                <line x1={i * 20 + 10} y1="10" x2={i * 20 + 10} y2="210" stroke="#E2E8F0" strokeWidth="1" />
                <line x1="10" y1={i * 20 + 10} x2="210" y2={i * 20 + 10} stroke="#E2E8F0" strokeWidth="1" />
              </g>
            ))}
            
            {showArea && (
              shape === 'rectangle' ? (
                <rect
                  x="10"
                  y="10"
                  width={w * 20}
                  height={h * 20}
                  fill="#EA580C"
                  fillOpacity="0.15"
                />
              ) : (
                <path
                  d={`M 10 10 L ${w * 20 + 10} 10 L 10 ${h * 20 + 10} Z`}
                  fill="#EA580C"
                  fillOpacity="0.15"
                />
              )
            )}
            
            {showArea && (
              shape === 'rectangle' ? (
                Array.from({ length: w }).map((_, col) => 
                  Array.from({ length: h }).map((_, row) => {
                    const cellNum = row * w + col + 1;
                    return (
                      <text
                        key={`${col}-${row}`}
                        x={col * 20 + 20}
                        y={row * 20 + 24}
                        fontSize="8"
                        fontWeight="black"
                        fill="#EA580C"
                        textAnchor="middle"
                        opacity="0.6"
                      >
                        {cellNum}
                      </text>
                    );
                  })
                )
              ) : (
                Array.from({ length: w }).map((_, col) => 
                  Array.from({ length: h }).map((_, row) => {
                    if ((row + 0.5)/h + (col + 0.5)/w < 1) {
                      return (
                        <text
                          key={`${col}-${row}`}
                          x={col * 20 + 20}
                          y={row * 20 + 24}
                          fontSize="8"
                          fontWeight="black"
                          fill="#EA580C"
                          textAnchor="middle"
                          opacity="0.6"
                        >
                          1
                        </text>
                      );
                    }
                    return null;
                  })
                )
              )
            )}
            
            {shape === 'rectangle' ? (
              <rect
                x="10"
                y="10"
                width={w * 20}
                height={h * 20}
                fill="none"
                stroke={showPerimeter ? "#EF4444" : "#EA580C"}
                strokeWidth={showPerimeter ? "4" : "2"}
                className="transition-all"
              />
            ) : (
              <path
                d={`M 10 10 L ${w * 20 + 10} 10 L 10 ${h * 20 + 10} Z`}
                fill="none"
                stroke={showPerimeter ? "#EF4444" : "#EA580C"}
                strokeWidth={showPerimeter ? "4" : "2"}
                className="transition-all"
              />
            )}
          </svg>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase">Width (Base): {w}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={w}
              onChange={(e) => setW(parseInt(e.target.value, 10))}
              className="w-full accent-green-600 h-1.5 bg-green-50 rounded"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase">Height: {h}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={h}
              onChange={(e) => setH(parseInt(e.target.value, 10))}
              className="w-full accent-green-600 h-1.5 bg-green-50 rounded"
            />
          </div>
          
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex justify-between items-center bg-green-50/50 px-4 py-2 rounded-xl border border-green-200">
              <span className="text-[10px] font-black text-green-700 uppercase">Area 🟩</span>
              <span className="text-sm font-black text-green-950 font-mono">
                {shape === 'rectangle' ? `${w} x ${h} = ` : `(${w} x ${h}) ÷ 2 = `}
                <span className="text-green-600">{area}</span> units²
              </span>
            </div>
            <div className="flex justify-between items-center bg-red-50/50 px-4 py-2 rounded-xl border border-red-100">
              <span className="text-[10px] font-black text-red-700 uppercase">Perimeter 🔴</span>
              <span className="text-sm font-black text-red-950 font-mono">
                {shape === 'rectangle' ? `2x(${w}+${h}) = ` : `${w} + ${h} + hyp = `}
                <span className="text-red-600">{perimeter}</span> units
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 15. GRAPHS VISUALIZER (Interactive)
// ==========================================
export const GraphsVisualizer = () => {
  const [apples, setApples] = useState(4);
  const [bananas, setBananas] = useState(6);
  const [cherries, setCherries] = useState(2);
  const [mode, setMode] = useState('bar'); 
  
  const values = [apples, bananas, cherries];
  const total = apples + bananas + cherries;
  const average = (total / 3).toFixed(1).replace('.0', '');
  
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted[1];
  
  const getMode = () => {
    const counts = {};
    let max = 0;
    let modes = [];
    values.forEach(v => {
      counts[v] = (counts[v] || 0) + 1;
      if (counts[v] > max) {
        max = counts[v];
      }
    });
    for (const v in counts) {
      if (counts[v] === max) {
        modes.push(v);
      }
    }
    return modes.join(', ');
  };
  
  const range = Math.max(...values) - Math.min(...values);

  return (
    <div className="bg-orange-50/20 border border-sky-100 rounded-3xl p-6 space-y-6 text-left my-2">
      <h4 className="text-xs font-black text-sky-700 uppercase tracking-widest">📊 Fruit Graphs &amp; Stats Helper</h4>
      
      <div className="flex bg-sky-50 p-1 rounded-xl border border-sky-100 w-full gap-1">
        {['bar', 'picto', 'line', 'stats'].map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-black transition-all ${
              mode === m ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {m === 'bar' && 'Bar Graph'}
            {m === 'picto' && 'Pictograph'}
            {m === 'line' && 'Line Graph'}
            {m === 'stats' && 'Mean & Median'}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[180px]">
          {mode === 'bar' && (
            <div className="flex gap-8 items-end h-[120px] w-full max-w-[200px] border-b-2 border-l-2 border-slate-200 px-4 pb-1 relative">
              <div className="flex-1 flex flex-col items-center">
                <div 
                  className="w-8 bg-red-400 border-2 border-red-500 rounded-t-lg transition-all duration-300"
                  style={{ height: `${apples * 15}px` }}
                />
                <span className="text-[10px] font-black text-slate-500 mt-2">🍎</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div 
                  className="w-8 bg-yellow-400 border-2 border-yellow-500 rounded-t-lg transition-all duration-300"
                  style={{ height: `${bananas * 15}px` }}
                />
                <span className="text-[10px] font-black text-slate-500 mt-2">🍌</span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div 
                  className="w-8 bg-rose-500 border-2 border-rose-600 rounded-t-lg transition-all duration-300"
                  style={{ height: `${cherries * 15}px` }}
                />
                <span className="text-[10px] font-black text-slate-500 mt-2">🍒</span>
              </div>
            </div>
          )}
          
          {mode === 'picto' && (
            <div className="space-y-3 w-full px-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-1.5">
                <span className="text-lg">🍎:</span>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: apples }).map((_, i) => <span key={i} className="text-base">🍎</span>)}
                </div>
              </div>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-1.5">
                <span className="text-lg">🍌:</span>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: bananas }).map((_, i) => <span key={i} className="text-base">🍌</span>)}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">🍒:</span>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: cherries }).map((_, i) => <span key={i} className="text-base">🍒</span>)}
                </div>
              </div>
            </div>
          )}
          
          {mode === 'line' && (
            <svg width="200" height="150" viewBox="0 0 200 150" className="overflow-visible">
              <line x1="20" y1="10" x2="20" y2="130" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="20" y1="130" x2="190" y2="130" stroke="#cbd5e1" strokeWidth="2" />
              
              {[2, 4, 6, 8].map(yVal => (
                <line key={yVal} x1="20" y1={130 - yVal * 15} x2="180" y2={130 - yVal * 15} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
              ))}
              
              <polyline
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="3"
                points={`50,${130 - apples*15} 100,${130 - bananas*15} 150,${130 - cherries*15}`}
                className="transition-all duration-300"
              />
              <circle cx="50" cy={130 - apples*15} r="5" fill="#ef4444" stroke="white" strokeWidth="1.5" />
              <circle cx="100" cy={130 - bananas*15} r="5" fill="#facc15" stroke="white" strokeWidth="1.5" />
              <circle cx="150" cy={130 - cherries*15} r="5" fill="#f43f5e" stroke="white" strokeWidth="1.5" />
              
              <text x="50" y="145" fontSize="10" fontWeight="bold" fill="#64748b" textAnchor="middle">🍎</text>
              <text x="100" y="145" fontSize="10" fontWeight="bold" fill="#64748b" textAnchor="middle">🍌</text>
              <text x="150" y="145" fontSize="10" fontWeight="bold" fill="#64748b" textAnchor="middle">🍒</text>
            </svg>
          )}
          
          {mode === 'stats' && (
            <div className="space-y-2 w-full text-center">
              <div className="bg-sky-50 rounded-xl p-2 border border-sky-100">
                <span className="text-[10px] text-slate-400 font-bold block">Sorted Numbers:</span>
                <span className="text-sm font-black text-sky-800">{sorted.join(', ')}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-left text-[11px] font-bold text-slate-600">
                <div className="bg-slate-50 p-1.5 rounded">
                  <span className="text-sky-600 font-black block text-[9px] uppercase">Mean (Average):</span>
                  <span>{average}</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded">
                  <span className="text-sky-600 font-black block text-[9px] uppercase">Median (Middle):</span>
                  <span>{median}</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded">
                  <span className="text-sky-600 font-black block text-[9px] uppercase">Mode (Most):</span>
                  <span>{getMode()}</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded">
                  <span className="text-sky-600 font-black block text-[9px] uppercase">Range:</span>
                  <span>{range}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-slate-500 uppercase flex items-center gap-1">🍎 Apples:</span>
            <div className="flex gap-2">
              <button onClick={() => setApples(a => Math.max(1, a - 1))} className="w-8 h-8 bg-white border rounded text-xs font-black hover:bg-slate-50">-</button>
              <span className="text-sm font-black w-6 text-center leading-8">{apples}</span>
              <button onClick={() => setApples(a => Math.min(8, a + 1))} className="w-8 h-8 bg-white border rounded text-xs font-black hover:bg-slate-50">+</button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-slate-500 uppercase flex items-center gap-1">🍌 Bananas:</span>
            <div className="flex gap-2">
              <button onClick={() => setBananas(b => Math.max(1, b - 1))} className="w-8 h-8 bg-white border rounded text-xs font-black hover:bg-slate-50">-</button>
              <span className="text-sm font-black w-6 text-center leading-8">{bananas}</span>
              <button onClick={() => setBananas(b => Math.min(8, b + 1))} className="w-8 h-8 bg-white border rounded text-xs font-black hover:bg-slate-50">+</button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-slate-500 uppercase flex items-center gap-1">🍒 Cherries:</span>
            <div className="flex gap-2">
              <button onClick={() => setCherries(c => Math.max(1, c - 1))} className="w-8 h-8 bg-white border rounded text-xs font-black hover:bg-slate-50">-</button>
              <span className="text-sm font-black w-6 text-center leading-8">{cherries}</span>
              <button onClick={() => setCherries(c => Math.min(8, c + 1))} className="w-8 h-8 bg-white border rounded text-xs font-black hover:bg-slate-50">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 16. ALGEBRA VISUALIZER (Interactive)
// ==========================================
export const AlgebraVisualizer = () => {
  const [tab, setTab] = useState('scale'); 
  const [scaleX, setScaleX] = useState(5);
  const [scaleConst, setScaleConst] = useState(3);
  const [scaleTarget, setScaleTarget] = useState(8);
  
  const [machInput, setMachInput] = useState(4);
  const [machRule, setMachRule] = useState('* 2'); 
  const getMachOutput = () => {
    if (machRule === '* 2') return machInput * 2;
    if (machRule === '+ 3') return machInput + 3;
    if (machRule === '- 1') return machInput - 1;
    return machInput;
  };

  return (
    <div className="bg-orange-50/20 border border-emerald-100 rounded-3xl p-6 space-y-6 text-left my-2">
      <h4 className="text-xs font-black text-emerald-700 uppercase tracking-widest">⚡ Algebra: Scales &amp; Machines</h4>
      
      <div className="flex gap-2 bg-emerald-50 p-1 rounded-xl w-fit border border-emerald-100">
        <button
          onClick={() => setTab('scale')}
          className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
            tab === 'scale' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'
          }`}
        >
          Balance Scale
        </button>
        <button
          onClick={() => setTab('machine')}
          className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
            tab === 'machine' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'
          }`}
        >
          Function Machine
        </button>
      </div>
      
      {tab === 'scale' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[170px] space-y-4">
            <span className="text-xs font-black text-slate-400">Equation: x + {scaleConst} = {scaleTarget}</span>
            <svg width="220" height="100" viewBox="0 0 220 100" className="overflow-visible">
              <rect x="105" y="40" width="10" height="50" fill="#94a3b8" />
              <rect x="80" y="85" width="60" height="10" fill="#64748b" rx="2" />
              
              {(() => {
                const currentLeft = scaleX + scaleConst;
                const angle = (currentLeft - scaleTarget) * 4; 
                const clampedAngle = Math.max(-20, Math.min(20, angle));
                
                return (
                  <g transform={`rotate(${clampedAngle}, 110, 45)`}>
                    <line x1="30" y1="45" x2="190" y2="45" stroke="#475569" strokeWidth="4" />
                    
                    <line x1="30" y1="45" x2="30" y2="65" stroke="#94a3b8" strokeWidth="2" />
                    <path d="M 10 65 L 50 65 L 30 75 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
                    <g transform="translate(15, 50)">
                      <rect x="0" y="0" width="15" height="15" fill="#f59e0b" stroke="#d97706" strokeWidth="1" rx="2" />
                      <text x="7.5" y="11" fontSize="10" fontWeight="black" fill="white" textAnchor="middle">x</text>
                      {Array.from({ length: scaleConst }).map((_, i) => (
                        <circle key={i} cx={25 + (i * 8)} cy="8" r="3" fill="#10b981" />
                      ))}
                    </g>
                    
                    <line x1="190" y1="45" x2="190" y2="65" stroke="#94a3b8" strokeWidth="2" />
                    <path d="M 170 65 L 210 65 L 190 75 Z" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
                    <g transform="translate(172, 53)">
                      {Array.from({ length: scaleTarget }).map((_, i) => {
                        const row = Math.floor(i / 5);
                        const col = i % 5;
                        return (
                          <circle key={i} cx={col * 7} cy={row * 7} r="2.5" fill="#3b82f6" />
                        );
                      })}
                    </g>
                  </g>
                );
              })()}
            </svg>
            <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
              scaleX + scaleConst === scaleTarget 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {scaleX + scaleConst === scaleTarget ? 'Balanced! 🎉' : 'Unbalanced! Find x! ⚖️'}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 uppercase">Solve for x: {scaleX}</label>
              <input
                type="range"
                min="1"
                max="10"
                value={scaleX}
                onChange={(e) => setScaleX(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 h-1.5 bg-emerald-50 rounded"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500">
              <div className="bg-slate-50 p-2 rounded">
                <span className="text-slate-400 block font-black uppercase">Left Scale:</span>
                <span className="text-sm font-black text-slate-700">x + {scaleConst} = {scaleX + scaleConst}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded">
                <span className="text-slate-400 block font-black uppercase">Right Scale:</span>
                <span className="text-sm font-black text-slate-700">{scaleTarget}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {tab === 'machine' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[170px] space-y-4 relative overflow-hidden">
            <svg width="180" height="120" viewBox="0 0 180 120" className="overflow-visible">
              <path d="M 70 10 L 110 10 L 100 30 L 80 30 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
              <rect x="65" y="30" width="50" height="50" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" rx="5" />
              <circle cx="90" cy="55" r="15" fill="#166534" />
              <text x="90" y="59" fontSize="11" fontWeight="black" fill="white" textAnchor="middle">
                {machRule.replace(' ', '')}
              </text>
              <path d="M 75 80 L 105 80 L 120 105 L 60 105 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
              
              <circle cx="90" cy="5" r="8" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
              <text x="90" y="8" fontSize="8" fontWeight="black" fill="white" textAnchor="middle">{machInput}</text>
              
              <circle cx="90" cy="110" r="10" fill="#10b981" stroke="#047857" strokeWidth="1.5" />
              <text x="90" y="113" fontSize="9" fontWeight="black" fill="white" textAnchor="middle">{getMachOutput()}</text>
            </svg>
            <span className="text-xs font-black text-slate-500">
              Input <span className="text-amber-500 font-black">{machInput}</span> outputs <span className="text-emerald-500 font-black">{getMachOutput()}</span>!
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 uppercase">Input Number: {machInput}</label>
              <input
                type="range"
                min="1"
                max="10"
                value={machInput}
                onChange={(e) => setMachInput(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 h-1.5 bg-emerald-50 rounded"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Machine Rule:</label>
              <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                {['* 2', '+ 3', '- 1'].map(rule => (
                  <button
                    key={rule}
                    onClick={() => setMachRule(rule)}
                    className={`flex-1 py-1 rounded-lg text-xs font-black transition-all ${
                      machRule === rule ? 'bg-white text-emerald-700 shadow-sm border border-emerald-100' : 'text-slate-500'
                    }`}
                  >
                    {rule === '* 2' && 'Double (x2)'}
                    {rule === '+ 3' && 'Add 3 (+3)'}
                    {rule === '- 1' && 'Minus 1 (-1)'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 17. VOLUME VISUALIZER (Interactive)
// ==========================================
export const VolumeVisualizer = () => {
  const [w, setW] = useState(3);
  const [h, setH] = useState(2);
  const [d, setD] = useState(2);
  
  const volume = w * h * d;
  
  return (
    <div className="bg-orange-50/20 border border-[#F59E0B]/10 rounded-3xl p-6 space-y-6 text-left my-2">
      <h4 className="text-xs font-black text-amber-700 uppercase tracking-widest">📦 Isometric Volume Builder</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[170px]">
          <svg width="200" height="160" viewBox="0 0 200 160" className="overflow-visible">
            {(() => {
              const size = 16;
              const cos30 = 0.866;
              const sin30 = 0.5;
              const originX = 100;
              const originY = 80;
              
              const cubes = [];
              for (let z = 0; z < h; z++) {
                for (let y = d - 1; y >= 0; y--) {
                  for (let x = 0; x < w; x++) {
                    const cx = originX + (x - y) * size * cos30;
                    const cy = originY + (x + y) * size * sin30 - z * size * 1.15;
                    cubes.push({ x: cx, y: cy, id: `${x}-${y}-${z}` });
                  }
                }
              }
              
              return cubes.map(cube => (
                <g key={cube.id} className="transition-all duration-200">
                  <path
                    d={`M ${cube.x} ${cube.y - size/2} 
                       L ${cube.x + size*cos30} ${cube.y} 
                       L ${cube.x} ${cube.y + size/2} 
                       L ${cube.x - size*cos30} ${cube.y} Z`}
                    fill="#FDE68A"
                    stroke="#D97706"
                    strokeWidth="0.5"
                  />
                  <path
                    d={`M ${cube.x - size*cos30} ${cube.y} 
                       L ${cube.x} ${cube.y + size/2} 
                       L ${cube.x} ${cube.y + size*1.5/2} 
                       L ${cube.x - size*cos30} ${cube.y + size*1.0/2} Z`}
                    fill="#F59E0B"
                    stroke="#D97706"
                    strokeWidth="0.5"
                  />
                  <path
                    d={`M ${cube.x} ${cube.y + size/2} 
                       L ${cube.x + size*cos30} ${cube.y} 
                       L ${cube.x + size*cos30} ${cube.y + size*1.0/2} 
                       L ${cube.x} ${cube.y + size*1.5/2} Z`}
                    fill="#D97706"
                    stroke="#B45309"
                    strokeWidth="0.5"
                  />
                </g>
              ));
            })()}
          </svg>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase">Width (w): {w}</label>
            <input
              type="range"
              min="1"
              max="5"
              value={w}
              onChange={(e) => setW(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 h-1.5 bg-amber-50 rounded"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase">Height (h): {h}</label>
            <input
              type="range"
              min="1"
              max="5"
              value={h}
              onChange={(e) => setH(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 h-1.5 bg-amber-50 rounded"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase">Depth (d): {d}</label>
            <input
              type="range"
              min="1"
              max="5"
              value={d}
              onChange={(e) => setD(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 h-1.5 bg-amber-50 rounded"
            />
          </div>
          
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 text-center font-mono">
            <span className="text-[10px] font-black text-amber-700 uppercase block mb-1">Volume</span>
            <span className="text-base font-black text-amber-950">
              {w} x {h} x {d} = <span className="text-amber-600 font-black">{volume}</span> units³
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 18. NUMBER THEORY VISUALIZER (Interactive)
// ==========================================
export const NumberTheoryVisualizer = () => {
  const [numA, setNumA] = useState(12);
  const [numB, setNumB] = useState(18);
  const [tab, setTab] = useState('rainbow'); 
  
  const getFactors = (n) => {
    const facts = [];
    for (let i = 1; i <= n; i++) {
      if (n % i === 0) facts.push(i);
    }
    return facts;
  };
  
  const factorsA = getFactors(numA);
  const isPrimeA = factorsA.length === 2; 
  
  const factorsB = getFactors(numB);
  const commonFactors = factorsA.filter(f => factorsB.includes(f));
  const hcf = Math.max(...commonFactors);
  
  const getMultiples = (n, limit = 10) => {
    return Array.from({ length: limit }).map((_, i) => n * (i + 1));
  };
  const multsA = getMultiples(numA, 10);
  const multsB = getMultiples(numB, 10);
  const commonMults = multsA.filter(m => multsB.includes(m));
  const lcm = commonMults.length > 0 ? Math.min(...commonMults) : numA * numB;

  return (
    <div className="bg-orange-50/20 border border-orange-200 rounded-3xl p-6 space-y-6 text-left my-2">
      <h4 className="text-xs font-black text-orange-700 uppercase tracking-widest">🌈 Number Theory Explorer</h4>
      
      <div className="flex gap-2 bg-orange-50 p-1 rounded-xl w-fit border border-orange-200">
        <button
          onClick={() => setTab('rainbow')}
          className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
            tab === 'rainbow' ? 'bg-white text-orange-700 shadow-sm' : 'text-slate-500'
          }`}
        >
          Factor Rainbow
        </button>
        <button
          onClick={() => setTab('venn')}
          className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
            tab === 'venn' ? 'bg-white text-orange-700 shadow-sm' : 'text-slate-500'
          }`}
        >
          GCF &amp; LCM Venn
        </button>
      </div>
      
      {tab === 'rainbow' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 uppercase">Select Number: {numA}</label>
              <input
                type="range"
                min="2"
                max="36"
                value={numA}
                onChange={(e) => setNumA(parseInt(e.target.value, 10))}
                className="w-full accent-orange-500 h-1.5 bg-orange-50 rounded"
              />
            </div>
            
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-1">
              <span className="text-[10px] text-slate-400 font-black uppercase">Result:</span>
              <div className="text-sm font-bold text-slate-700">
                {numA} is a <span className={`font-black ${isPrimeA ? 'text-emerald-600' : 'text-orange-600'}`}>
                  {isPrimeA ? 'PRIME NUMBER 🌟' : 'COMPOSITE NUMBER 🧩'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden">
            <svg width="200" height="110" className="overflow-visible">
              {factorsA.map((fact, idx) => {
                const partnerIdx = factorsA.length - 1 - idx;
                if (idx > partnerIdx) return null;
                
                const startX = 20 + idx * 16;
                const endX = 180 - idx * 16;
                const radiusX = (endX - startX) / 2;
                const radiusY = Math.max(15, 60 - idx * 10);
                
                const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];
                const strokeColor = colors[idx % colors.length];
                
                return (
                  <path
                    key={idx}
                    d={`M ${startX} 90 A ${radiusX} ${radiusY} 0 0 1 ${endX} 90`}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                );
              })}
              
              {factorsA.map((fact, idx) => {
                const x = factorsA.length === 1 ? 100 : 20 + idx * (160 / (factorsA.length - 1 || 1));
                return (
                  <g key={idx}>
                    <circle cx={x} cy="90" r="8" fill="#e0e7ff" stroke="#818cf8" strokeWidth="1" />
                    <text x={x} y="93" fontSize="8" fontWeight="black" fill="#312e81" textAnchor="middle">{fact}</text>
                  </g>
                );
              })}
            </svg>
            <span className="text-[10px] text-slate-400 font-black uppercase mt-4">Factors: {factorsA.join(', ')}</span>
          </div>
        </div>
      )}
      
      {tab === 'venn' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase">Number A: {numA}</label>
                <input
                  type="range"
                  min="2"
                  max="24"
                  value={numA}
                  onChange={(e) => setNumA(parseInt(e.target.value, 10))}
                  className="w-full accent-orange-500 h-1.5 bg-orange-50 rounded"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase">Number B: {numB}</label>
                <input
                  type="range"
                  min="2"
                  max="24"
                  value={numB}
                  onChange={(e) => setNumB(parseInt(e.target.value, 10))}
                  className="w-full accent-orange-500 h-1.5 bg-orange-50 rounded"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-[10px] font-black text-slate-600 bg-white p-3 border border-slate-100 rounded-xl shadow-sm">
              <div>
                <span className="text-red-500 block uppercase">GCF / HCF:</span>
                <span className="text-xs font-black font-mono text-slate-800">{hcf}</span>
              </div>
              <div>
                <span className="text-blue-500 block uppercase">LCM:</span>
                <span className="text-xs font-black font-mono text-slate-800">{lcm}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[160px]">
            <svg width="200" height="120" className="overflow-visible">
              <circle cx="75" cy="60" r="45" fill="#ef4444" fillOpacity="0.1" stroke="#ef4444" strokeWidth="2" />
              <text x="40" y="30" fontSize="9" fontWeight="black" fill="#b91c1c">Set A ({numA})</text>
              
              <circle cx="125" cy="60" r="45" fill="#3b82f6" fillOpacity="0.1" stroke="#3b82f6" strokeWidth="2" />
              <text x="160" y="30" fontSize="9" fontWeight="black" fill="#1d4ed8" textAnchor="end">Set B ({numB})</text>
              
              {(() => {
                const aOnly = factorsA.filter(f => !factorsB.includes(f));
                return aOnly.slice(0, 3).map((f, i) => (
                  <text key={f} x="50" y={50 + i * 14} fontSize="9" fontWeight="black" fill="#b91c1c" textAnchor="middle">{f}</text>
                ));
              })()}
              
              {(() => {
                const bOnly = factorsB.filter(f => !factorsA.includes(f));
                return bOnly.slice(0, 3).map((f, i) => (
                  <text key={f} x="150" y={50 + i * 14} fontSize="9" fontWeight="black" fill="#1d4ed8" textAnchor="middle">{f}</text>
                ));
              })()}
              
              {commonFactors.slice(0, 3).map((f, i) => (
                <text key={f} x="100" y={50 + i * 14} fontSize="10" fontWeight="black" fill="#4f46e5" textAnchor="middle">{f}</text>
              ))}
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 19. GEOMETRY 2D VISUALIZER (Interactive)
// ==========================================
export const Geometry2DVisualizer = () => {
  const [shape, setShape] = useState('square'); 
  const [showSymmetry, setShowSymmetry] = useState(false);
  const [showLines, setShowLines] = useState(false);
  
  return (
    <div className="bg-orange-50/20 border border-blue-100 rounded-3xl p-6 space-y-6 text-left my-2">
      <h4 className="text-xs font-black text-blue-700 uppercase tracking-widest">📐 2D Shape &amp; Symmetry Lab</h4>
      
      <div className="flex flex-wrap gap-1 bg-blue-50 p-1 rounded-xl w-full border border-blue-100">
        {['triangle', 'square', 'rectangle', 'trapezoid', 'circle'].map(s => (
          <button
            key={s}
            onClick={() => setShape(s)}
            className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-black uppercase transition-all ${
              shape === s ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[170px]">
          <svg width="180" height="150" viewBox="0 0 180 150" className="overflow-visible">
            {shape === 'triangle' && (
              <polygon points="90,20 30,120 150,120" fill="#e0f2fe" stroke="#0284c7" strokeWidth="3" />
            )}
            {shape === 'square' && (
              <rect x="40" y="25" width="100" height="100" fill="#e0f2fe" stroke="#0284c7" strokeWidth="3" />
            )}
            {shape === 'rectangle' && (
              <rect x="25" y="35" width="130" height="80" fill="#e0f2fe" stroke="#0284c7" strokeWidth="3" />
            )}
            {shape === 'trapezoid' && (
              <polygon points="60,35 120,35 155,115 25,115" fill="#e0f2fe" stroke="#0284c7" strokeWidth="3" />
            )}
            {shape === 'circle' && (
              <circle cx="90" cy="75" r="50" fill="#e0f2fe" stroke="#0284c7" strokeWidth="3" />
            )}
            
            {showSymmetry && (
              <g>
                <line x1="90" y1="10" x2="90" y2="140" stroke="#ef4444" strokeWidth="2" strokeDasharray="4" />
                {['square', 'rectangle', 'circle'].includes(shape) && (
                  <line x1="10" y1="75" x2="170" y2="75" stroke="#ef4444" strokeWidth="2" strokeDasharray="4" />
                )}
                {['square', 'circle'].includes(shape) && (
                  <>
                    <line x1="20" y1="10" x2="160" y2="140" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4" />
                    <line x1="160" y1="10" x2="20" y2="140" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4" />
                  </>
                )}
              </g>
            )}
            
            {showLines && (
              <g>
                {['square', 'rectangle'].includes(shape) && (
                  <>
                    <path d="M 85,25 L 90,20 L 95,25" fill="none" stroke="#22c55e" strokeWidth="2" />
                    <path d="M 85,115 L 90,120 L 95,115" fill="none" stroke="#22c55e" strokeWidth="2" />
                  </>
                )}
                {['square', 'rectangle'].includes(shape) && (
                  <rect x={shape === 'rectangle' ? "25" : "40"} y={shape === 'rectangle' ? "35" : "25"} width="10" height="10" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
                )}
              </g>
            )}
          </svg>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => setShowSymmetry(!showSymmetry)}
            className={`w-full py-2.5 px-4 rounded-2xl text-xs font-black border transition-all flex items-center justify-between ${
              showSymmetry ? 'bg-red-50 border-red-200 text-red-700 shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>🔴 Show Lines of Symmetry</span>
            <span>{showSymmetry ? 'ON' : 'OFF'}</span>
          </button>
          
          <button
            onClick={() => setShowLines(!showLines)}
            className={`w-full py-2.5 px-4 rounded-2xl text-xs font-black border transition-all flex items-center justify-between ${
              showLines ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>🟢 Show Details (Parallel/Angles)</span>
            <span>{showLines ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 20. PERCENTAGE VISUALIZER (Interactive)
// ==========================================
export const PercentageVisualizer = () => {
  const [percent, setPercent] = useState(40);
  const [tab, setTab] = useState('chocolate'); 
  
  const [price, setPrice] = useState(50);
  const discountAmount = ((price * percent) / 100).toFixed(1).replace('.0', '');
  const finalPrice = (price - discountAmount).toFixed(1).replace('.0', '');

  return (
    <div className="bg-orange-50/20 border border-pink-100 rounded-3xl p-6 space-y-6 text-left my-2">
      <h4 className="text-xs font-black text-pink-700 uppercase tracking-widest">🍫 Percentage &amp; Decimal Visualizer</h4>
      
      <div className="flex gap-2 bg-pink-50 p-1 rounded-xl w-fit border border-pink-100">
        <button
          onClick={() => setTab('chocolate')}
          className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
            tab === 'chocolate' ? 'bg-white text-pink-700 shadow-sm' : 'text-slate-500'
          }`}
        >
          Chocolate Grid
        </button>
        <button
          onClick={() => setTab('sandbox')}
          className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
            tab === 'sandbox' ? 'bg-white text-pink-700 shadow-sm' : 'text-slate-500'
          }`}
        >
          Discount Sandbox
        </button>
      </div>
      
      {tab === 'chocolate' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="bg-[#FAF7F2] border border-amber-200 rounded-2xl p-4 shadow-inner flex justify-center">
            <div className="grid grid-cols-10 gap-0.5 border border-amber-900/40 bg-amber-950/20 p-1 rounded-lg">
              {Array.from({ length: 100 }).map((_, idx) => {
                const isEaten = idx < percent;
                return (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-sm transition-all duration-300 ${
                      isEaten ? 'bg-amber-900 border border-amber-950 scale-90' : 'bg-amber-100 border border-amber-200'
                    }`}
                  />
                );
              })}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 uppercase">Set Percentage: {percent}%</label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={percent}
                onChange={(e) => setPercent(parseInt(e.target.value, 10))}
                className="w-full accent-pink-500 h-1.5 bg-pink-50 rounded"
              />
            </div>
            
            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs font-bold text-slate-600">
              <div className="flex justify-between p-2 bg-white border border-slate-100 rounded-xl shadow-sm">
                <span>Percentage:</span>
                <span className="font-black text-pink-600">{percent}%</span>
              </div>
              <div className="flex justify-between p-2 bg-white border border-slate-100 rounded-xl shadow-sm">
                <span>Decimal Equivalent:</span>
                <span className="font-black text-pink-600 font-mono">{(percent / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-2 bg-white border border-slate-100 rounded-xl shadow-sm">
                <span>Fraction Equivalent:</span>
                <span className="font-black text-pink-600 font-mono">
                  {percent}/100 = {percent % 10 === 0 ? `${percent/10}/10` : `${percent}/100`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {tab === 'sandbox' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 uppercase">Original Price: ${price}</label>
              <input
                type="range"
                min="10"
                max="200"
                step="10"
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value, 10))}
                className="w-full accent-pink-500 h-1.5 bg-pink-50 rounded"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black text-slate-500 uppercase">Discount Percent: {percent}%</label>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={percent}
                onChange={(e) => setPercent(parseInt(e.target.value, 10))}
                className="w-full accent-pink-500 h-1.5 bg-pink-50 rounded"
              />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-2 text-center">
            <span className="text-[10px] text-slate-400 font-black uppercase">Sales Tag</span>
            <div className="text-2xl font-black text-slate-800">
              Original: <span className="line-through text-slate-400">${price}</span>
            </div>
            <div className="text-3xl font-black text-pink-600">
              Sale Price: ${finalPrice}
            </div>
            <div className="text-xs text-emerald-600 font-bold bg-emerald-50 rounded-full px-3 py-1 w-fit mx-auto border border-emerald-100">
              You Save: ${discountAmount} ({percent}% off!)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 21. COORDINATE PLANE VISUALIZER (Interactive)
// ==========================================
export const CoordinatePlaneVisualizer = () => {
  const [cx, setCx] = useState(2);
  const [cy, setCy] = useState(3);
  
  const getQuadrant = () => {
    if (cx > 0 && cy > 0) return 'Quadrant I (+, +)';
    if (cx < 0 && cy > 0) return 'Quadrant II (-, +)';
    if (cx < 0 && cy < 0) return 'Quadrant III (-, -)';
    if (cx > 0 && cy < 0) return 'Quadrant IV (+, -)';
    if (cx === 0 && cy === 0) return 'Origin (0,0)';
    return 'On Axis';
  };

  return (
    <div className="bg-orange-50/20 border border-orange-200 rounded-3xl p-6 space-y-6 text-left my-2">
      <h4 className="text-xs font-black text-orange-700 uppercase tracking-widest">🌐 Coordinate Plane Plotter</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex justify-center">
          <svg width="180" height="180" viewBox="0 0 200 200" className="bg-orange-50/20">
            {Array.from({ length: 11 }).map((_, i) => {
              const gridOffset = i * 16 + 20;
              return (
                <g key={i}>
                  <line x1={gridOffset} y1="20" x2={gridOffset} y2="180" stroke="#E2E8F0" strokeWidth="0.5" />
                  <line x1="20" y1={gridOffset} x2="180" y2={gridOffset} stroke="#E2E8F0" strokeWidth="0.5" />
                </g>
              );
            })}
            
            <line x1="100" y1="10" x2="100" y2="190" stroke="#475569" strokeWidth="2" />
            <line x1="10" y1="100" x2="190" y2="100" stroke="#475569" strokeWidth="2" />
            
            {(() => {
              const sx = 100 + cx * 16;
              const sy = 100 - cy * 16;
              return (
                <g>
                  <line x1="100" y1={sy} x2={sx} y2={sy} stroke="#6366f1" strokeWidth="1" strokeDasharray="3" />
                  <line x1={sx} y1="100" x2={sx} y2={sy} stroke="#6366f1" strokeWidth="1" strokeDasharray="3" />
                  <circle cx={sx} cy={sy} r="6" fill="#6366f1" stroke="white" strokeWidth="1.5" className="animate-pulse" />
                </g>
              );
            })()}
            
            <text x="190" y="112" fontSize="8" fontWeight="black" fill="#475569" textAnchor="end">X</text>
            <text x="106" y="20" fontSize="8" fontWeight="black" fill="#475569">Y</text>
          </svg>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 uppercase">X Coordinate: {cx}</label>
            <input
              type="range"
              min="-5"
              max="5"
              value={cx}
              onChange={(e) => setCx(parseInt(e.target.value, 10))}
              className="w-full accent-orange-500 h-1.5 bg-orange-50 rounded"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-500 uppercase">Y Coordinate: {cy}</label>
            <input
              type="range"
              min="-5"
              max="5"
              value={cy}
              onChange={(e) => setCy(parseInt(e.target.value, 10))}
              className="w-full accent-orange-500 h-1.5 bg-orange-50 rounded"
            />
          </div>
          
          <div className="bg-orange-50 rounded-2xl p-4 border border-orange-200 text-center font-mono">
            <span className="text-[10px] font-black text-orange-700 uppercase block mb-1">Ordered Pair</span>
            <span className="text-base font-black text-orange-950">
              ({cx}, {cy})
            </span>
            <span className="text-[10px] font-bold text-slate-500 block mt-1">{getQuadrant()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 22. PROBABILITY VISUALIZER (Interactive)
// ==========================================
export const ProbabilityVisualizer = () => {
  const [spinning, setSpinning] = useState(false);
  const [spinAngle, setSpinAngle] = useState(0);
  const [results, setResults] = useState({ Red: 0, Blue: 0, Green: 0, Yellow: 0 });
  const [totalSpins, setTotalSpins] = useState(0);
  
  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    const extraAngle = Math.floor(Math.random() * 360);
    const newAngle = spinAngle + 1440 + extraAngle;
    setSpinAngle(newAngle);
    
    setTimeout(() => {
      setSpinning(false);
      const landing = (360 - (newAngle % 360)) % 360;
      let color = 'Red';
      if (landing >= 0 && landing < 90) color = 'Red';
      else if (landing >= 90 && landing < 180) color = 'Yellow';
      else if (landing >= 180 && landing < 270) color = 'Green';
      else color = 'Blue';
      
      setResults(prev => ({ ...prev, [color]: prev[color] + 1 }));
      setTotalSpins(t => t + 1);
    }, 2000);
  };
  
  const getExperimentalProb = (color) => {
    if (totalSpins === 0) return '0%';
    return `${Math.round((results[color] / totalSpins) * 100)}%`;
  };

  return (
    <div className="bg-orange-50/20 border border-rose-100 rounded-3xl p-6 space-y-6 text-left my-2">
      <h4 className="text-xs font-black text-rose-700 uppercase tracking-widest">🎡 Probability Spinner Wheel</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[170px] relative">
          <div className="absolute top-[18px] z-10 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-rose-500 drop-shadow-sm" />
          
          <div 
            className="w-32 h-32 rounded-full relative transition-transform duration-[2000ms] ease-out border-4 border-slate-700 drop-shadow-md"
            style={{ transform: `rotate(${spinAngle}deg)` }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full rounded-full">
              <path d="M 50 50 L 50 0 A 50 50 0 0 1 100 50 Z" fill="#f87171" />
              <path d="M 50 50 L 100 50 A 50 50 0 0 1 50 100 Z" fill="#fbbf24" />
              <path d="M 50 50 L 50 100 A 50 50 0 0 1 0 50 Z" fill="#34d399" />
              <path d="M 50 50 L 0 50 A 50 50 0 0 1 50 0 Z" fill="#60a5fa" />
            </svg>
          </div>
          
          <button
            onClick={handleSpin}
            disabled={spinning}
            className="mt-4 px-6 py-2 bg-rose-500 hover:bg-rose-600 disabled:bg-slate-300 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-all"
          >
            {spinning ? 'Spinning...' : 'Spin Wheel! 🚀'}
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl shadow-inner space-y-2">
            <span className="text-[10px] text-slate-400 font-black uppercase">Spins Tally: {totalSpins}</span>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-600">
              <div className="bg-red-50/50 p-2 rounded border border-red-100 flex justify-between">
                <span>🔴 Red:</span>
                <span className="font-black">{results.Red} ({getExperimentalProb('Red')})</span>
              </div>
              <div className="bg-yellow-50/50 p-2 rounded border border-yellow-100 flex justify-between">
                <span>🟡 Yellow:</span>
                <span className="font-black">{results.Yellow} ({getExperimentalProb('Yellow')})</span>
              </div>
              <div className="bg-emerald-50/50 p-2 rounded border border-emerald-100 flex justify-between">
                <span>🟢 Green:</span>
                <span className="font-black">{results.Green} ({getExperimentalProb('Green')})</span>
              </div>
              <div className="bg-blue-50/50 p-2 rounded border border-blue-100 flex justify-between">
                <span>🔵 Blue:</span>
                <span className="font-black">{results.Blue} ({getExperimentalProb('Blue')})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 22. DECIMAL VISUALIZER
// ==========================================
export const DecimalVisualizer = () => {
  const [filled, setFilled] = useState(34);
  return (
    <div className="bg-sky-50/50 border border-sky-100 rounded-3xl p-6 space-y-6 text-center">
      <h4 className="text-xs font-black text-sky-700 uppercase tracking-widest text-left">🟩 Decimal Grid (Hundredths)</h4>
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="grid grid-cols-10 gap-0.5 p-2 bg-white rounded-xl shadow-sm border border-slate-100 cursor-pointer"
             onMouseLeave={(e) => { if(e.buttons !== 1) {} }}>
          {Array.from({length: 100}).map((_, i) => (
            <div key={i} 
                 onMouseEnter={(e) => { if (e.buttons === 1) setFilled(i + 1) }}
                 onClick={() => setFilled(i + 1)}
                 className={`w-4 h-4 sm:w-6 sm:h-6 rounded-sm transition-colors ${i < filled ? 'bg-sky-400' : 'bg-slate-100'}`} />
          ))}
        </div>
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-xs font-black text-slate-400 uppercase block mb-1">Decimal</span>
            <span className="text-4xl font-black text-sky-600">0.{filled < 10 ? '0'+filled : filled === 100 ? '1.00' : filled}</span>
          </div>
          <div className="text-center">
            <span className="text-xs font-black text-slate-400 uppercase block mb-1">Fraction</span>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-slate-700">{filled}</span>
              <div className="w-12 h-0.5 bg-slate-300 my-1"/>
              <span className="text-2xl font-black text-slate-700">100</span>
            </div>
          </div>
          <div className="text-center">
            <span className="text-xs font-black text-slate-400 uppercase block mb-1">Percentage</span>
            <span className="text-2xl font-black text-emerald-500">{filled}%</span>
          </div>
          <input type="range" min="0" max="100" value={filled} onChange={e => setFilled(parseInt(e.target.value))} className="w-full accent-sky-500" />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 23. RATIO VISUALIZER
// ==========================================
export const RatioVisualizer = () => {
  const [apples, setApples] = useState(4);
  const [bananas, setBananas] = useState(6);
  
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(apples, bananas) || 1;
  const simplifiedApples = apples / divisor;
  const simplifiedBananas = bananas / divisor;

  return (
    <div className="bg-yellow-50/50 border border-yellow-200 rounded-3xl p-6 space-y-6 text-center">
      <h4 className="text-xs font-black text-yellow-700 uppercase tracking-widest text-left">⚖️ Fruit Ratios</h4>
      <div className="flex flex-col md:flex-row items-center justify-around gap-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 justify-center max-w-[200px] min-h-[100px] content-start bg-white p-4 rounded-2xl shadow-sm border border-red-100">
            {Array.from({length: apples}).map((_, i) => <span key={i} className="text-3xl">🍎</span>)}
          </div>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => setApples(a => Math.max(0, a - 1))} className="w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold hover:bg-red-200">-</button>
            <span className="text-xl font-black">{apples}</span>
            <button onClick={() => setApples(a => Math.min(20, a + 1))} className="w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold hover:bg-red-200">+</button>
          </div>
        </div>

        <div className="text-center space-y-2">
          <span className="text-xs font-black text-slate-400 uppercase block">Ratio</span>
          <div className="text-5xl font-black text-slate-800">
            {apples}<span className="text-slate-300 mx-2">:</span>{bananas}
          </div>
          {divisor > 1 && (
            <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full inline-block mt-2">
              <span className="text-xs font-black uppercase">Simplified: </span>
              <span className="font-black text-lg">{simplifiedApples}:{simplifiedBananas}</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 justify-center max-w-[200px] min-h-[100px] content-start bg-white p-4 rounded-2xl shadow-sm border border-yellow-100">
            {Array.from({length: bananas}).map((_, i) => <span key={i} className="text-3xl">🍌</span>)}
          </div>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => setBananas(a => Math.max(0, a - 1))} className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 font-bold hover:bg-yellow-200">-</button>
            <span className="text-xl font-black">{bananas}</span>
            <button onClick={() => setBananas(a => Math.min(20, a + 1))} className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 font-bold hover:bg-yellow-200">+</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 24. TIMES TABLE GRID VISUALIZER
// ==========================================
export const TimesTableGridVisualizer = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedCol, setSelectedCol] = useState(null);

  const nums = Array.from({length: 12}, (_, i) => i + 1);

  return (
    <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-6 space-y-6 text-center">
      <h4 className="text-xs font-black text-indigo-700 uppercase tracking-widest text-left">✖️ Times Tables Grid</h4>
      <div className="flex flex-col xl:flex-row items-center justify-center gap-8 overflow-x-auto w-full">
        <div className="grid gap-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 min-w-max"
             style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}>
          <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center font-black text-slate-300 text-[10px] sm:text-xs">✖️</div>
          {nums.map(n => (
            <div key={`h-${n}`} className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center font-black text-xs sm:text-sm rounded-lg ${selectedCol === n ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-400 bg-slate-50'}`}>
              {n}
            </div>
          ))}
          {nums.map(r => (
            <React.Fragment key={`row-${r}`}>
              <div className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center font-black text-xs sm:text-sm rounded-lg ${selectedRow === r ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-400 bg-slate-50'}`}>
                {r}
              </div>
              {nums.map(c => {
                const isSelected = selectedRow === r && selectedCol === c;
                const isHighlight = selectedRow === r || selectedCol === c;
                return (
                  <div key={`${r}-${c}`} 
                       onClick={() => { setSelectedRow(r); setSelectedCol(c); }}
                       className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-bold rounded-lg cursor-pointer transition-colors
                         ${isSelected ? 'bg-emerald-500 text-white shadow-md font-black scale-110 z-10 relative' : 
                           isHighlight ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600'}`}>
                    {r * c}
                  </div>
                )
              })}
            </React.Fragment>
          ))}
        </div>
        
        <div className="h-32 flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-indigo-100 shadow-inner w-full xl:w-64 shrink-0">
          {selectedRow && selectedCol ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} key={`${selectedRow}-${selectedCol}`} className="text-center">
              <div className="text-3xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
                <span className="text-indigo-500">{selectedRow}</span> 
                <span className="text-slate-300">×</span> 
                <span className="text-indigo-500">{selectedCol}</span> 
                <span className="text-slate-300">=</span> 
                <span className="text-emerald-500 text-4xl">{selectedRow * selectedCol}</span>
              </div>
            </motion.div>
          ) : (
            <span className="text-slate-400 font-bold text-sm">Click a square to reveal!</span>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 25. NUMBER PATTERN VISUALIZER
// ==========================================
export const NumberPatternVisualizer = () => {
  const [skipCount, setSkipCount] = useState(2);
  const nums = Array.from({length: 100}, (_, i) => i + 1);

  return (
    <div className="bg-pink-50/50 border border-pink-100 rounded-3xl p-6 space-y-6 text-center">
      <h4 className="text-xs font-black text-pink-700 uppercase tracking-widest text-left">🔢 100-Chart Patterns</h4>
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        
        <div className="grid grid-cols-10 gap-1 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
          {nums.map(n => {
            const isMatch = n % skipCount === 0;
            return (
              <div key={n} className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-[10px] sm:text-xs font-bold rounded-md transition-colors duration-300
                ${isMatch ? 'bg-pink-500 text-white shadow-sm font-black' : 'text-slate-400 bg-slate-50'}`}>
                {n}
              </div>
            )
          })}
        </div>

        <div className="space-y-6 bg-white p-6 rounded-3xl border border-pink-100 shadow-sm w-full md:w-64">
          <div>
            <span className="text-xs font-black text-slate-400 uppercase block mb-3">Skip Count By:</span>
            <div className="flex flex-wrap gap-2 justify-center">
              {[2,3,4,5,10].map(s => (
                <button key={s} 
                        onClick={() => setSkipCount(s)}
                        className={`w-10 h-10 rounded-xl font-black transition-all ${skipCount === s ? 'bg-pink-500 text-white shadow-md scale-110' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 bg-pink-50 rounded-2xl">
             <span className="text-sm font-black text-pink-800">
               Notice the pattern!
             </span>
             <p className="text-xs font-bold text-pink-600/70 mt-1">
               When you count by {skipCount}s, the numbers line up in special columns or diagonals.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};
// ==========================================
// 26. SHAPE SLICER VISUALIZER (Halves, Thirds, Fourths)
// ==========================================
export const ShapeSlicerVisualizer = () => {
  const [slices, setSlices] = useState(2);
  const [eaten, setEaten] = useState(0);

  const handleSlice = (num) => {
    setSlices(num);
    setEaten(0);
  };

  const toggleSlice = () => {
    if (eaten < slices) {
      setEaten(eaten + 1);
    } else {
      setEaten(0);
    }
  };

  return (
    <div className="bg-amber-50/50 border border-amber-200 rounded-3xl p-6 space-y-6 text-center">
      <h4 className="text-xs font-black text-amber-700 uppercase tracking-widest text-left">🍕 Shape Slicer</h4>
      <div className="flex flex-col md:flex-row items-center justify-around gap-6">
        
        <div className="space-y-4">
          <span className="text-xs font-black text-slate-400 uppercase block">Cut the Pizza!</span>
          <div className="flex flex-col gap-2">
            <button onClick={() => handleSlice(2)} className={`px-4 py-2 rounded-xl font-black transition-all ${slices === 2 ? 'bg-amber-500 text-white shadow-md' : 'bg-white text-slate-500 hover:bg-slate-100'}`}>Cut into Halves (2)</button>
            <button onClick={() => handleSlice(3)} className={`px-4 py-2 rounded-xl font-black transition-all ${slices === 3 ? 'bg-amber-500 text-white shadow-md' : 'bg-white text-slate-500 hover:bg-slate-100'}`}>Cut into Thirds (3)</button>
            <button onClick={() => handleSlice(4)} className={`px-4 py-2 rounded-xl font-black transition-all ${slices === 4 ? 'bg-amber-500 text-white shadow-md' : 'bg-white text-slate-500 hover:bg-slate-100'}`}>Cut into Fourths (4)</button>
          </div>
        </div>

        <div className="relative w-48 h-48 sm:w-64 sm:h-64 cursor-pointer" onClick={toggleSlice}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="50" cy="50" r="48" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
            {Array.from({length: slices}).map((_, i) => {
              const angle = 360 / slices;
              const startAngle = i * angle;
              const endAngle = (i + 1) * angle;
              const startX = 50 + 48 * Math.cos((startAngle - 90) * Math.PI / 180);
              const startY = 50 + 48 * Math.sin((startAngle - 90) * Math.PI / 180);
              const endX = 50 + 48 * Math.cos((endAngle - 90) * Math.PI / 180);
              const endY = 50 + 48 * Math.sin((endAngle - 90) * Math.PI / 180);
              const largeArc = angle > 180 ? 1 : 0;
              const isEaten = i < eaten;
              return (
                <path 
                  key={i}
                  d={`M 50 50 L ${startX} ${startY} A 48 48 0 ${largeArc} 1 ${endX} ${endY} Z`}
                  fill={isEaten ? 'transparent' : '#fbbf24'}
                  stroke="#d97706"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
              )
            })}
          </svg>
          <div className="absolute -bottom-4 right-0 bg-white px-3 py-1 rounded-full border border-amber-200 shadow-sm text-xs font-black text-amber-600">
            Click to Eat!
          </div>
        </div>

        <div className="text-center space-y-2">
          <span className="text-xs font-black text-slate-400 uppercase block">Remaining</span>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-black text-slate-800">{slices - eaten}</span>
            <div className="w-12 h-1 bg-slate-300 my-1"/>
            <span className="text-4xl font-black text-slate-800">{slices}</span>
          </div>
          <p className="text-xs font-bold text-slate-500 mt-2 max-w-[120px]">
            {slices - eaten} out of {slices} equal parts
          </p>
        </div>

      </div>
    </div>
  );
};

// ==========================================
// 27. EQUIVALENT FRACTION BALANCER
// ==========================================
export const EquivalentFractionBalancer = () => {
  const [filledLeft, setFilledLeft] = useState(1);
  const leftTotal = 2;
  const multiplier = 2; 
  const rightTotal = leftTotal * multiplier;
  const filledRight = filledLeft * multiplier;

  return (
    <div className="bg-emerald-50/50 border border-emerald-200 rounded-3xl p-6 space-y-6 text-center">
      <h4 className="text-xs font-black text-emerald-700 uppercase tracking-widest text-left">⚖️ Equivalent Fractions</h4>
      <p className="text-sm font-bold text-slate-600 mb-4">Paint the left grid to see the equivalent fraction on the right!</p>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-12">
        
        <div className="space-y-4 flex flex-col items-center">
          <div className="grid grid-cols-1 gap-1 border-4 border-slate-700 bg-slate-700 w-24 h-48 rounded-lg cursor-pointer overflow-hidden shadow-md">
            {Array.from({length: leftTotal}).map((_, i) => (
              <div 
                key={i} 
                onClick={() => setFilledLeft(i + 1)}
                className={`w-full h-full transition-colors ${i < filledLeft ? 'bg-emerald-400' : 'bg-white hover:bg-emerald-50'}`} 
              />
            ))}
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-slate-800">{filledLeft}</span>
            <div className="w-8 h-1 bg-slate-300 my-1"/>
            <span className="text-3xl font-black text-slate-800">{leftTotal}</span>
          </div>
        </div>

        <div className="text-4xl font-black text-slate-300">=</div>

        <div className="space-y-4 flex flex-col items-center">
          <div className="grid grid-cols-2 gap-1 border-4 border-slate-700 bg-slate-700 w-24 h-48 rounded-lg overflow-hidden shadow-md">
            {Array.from({length: rightTotal}).map((_, i) => (
              <div 
                key={i} 
                className={`w-full h-full transition-all duration-500 ${i < filledRight ? 'bg-emerald-400' : 'bg-white'}`} 
              />
            ))}
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black text-slate-800">{filledRight}</span>
            <div className="w-8 h-1 bg-slate-300 my-1"/>
            <span className="text-3xl font-black text-slate-800">{rightTotal}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

// ==========================================
// 28. COMPARING FRACTIONS CROCODILE
// ==========================================
export const ComparingFractionsCrocodile = () => {
  const [leftNum, setLeftNum] = useState(3);
  const [leftDen, setLeftDen] = useState(4);
  const [rightNum, setRightNum] = useState(1);
  const [rightDen, setRightDen] = useState(2);
  const [result, setResult] = useState(null);

  const leftValue = leftNum / leftDen;
  const rightValue = rightNum / rightDen;

  const handleCompare = (symbol) => {
    let isCorrect = false;
    if (symbol === '>' && leftValue > rightValue) isCorrect = true;
    if (symbol === '<' && leftValue < rightValue) isCorrect = true;
    if (symbol === '=' && leftValue === rightValue) isCorrect = true;
    
    setResult(isCorrect ? 'correct' : 'incorrect');
    setTimeout(() => setResult(null), 2000);
  };

  return (
    <div className="bg-violet-50/50 border border-violet-200 rounded-3xl p-6 space-y-6 text-center relative">
      <h4 className="text-xs font-black text-violet-700 uppercase tracking-widest text-left">🐊 Hungry Crocodile</h4>
      <p className="text-sm font-bold text-slate-600 mb-4">The crocodile always eats the biggest fraction! Which way will it face?</p>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        {/* Left Fraction */}
        <div className="flex flex-col items-center space-y-4 z-10 relative">
           <div className="w-32 h-48 bg-white border-2 border-slate-200 rounded-xl overflow-hidden relative shadow-inner">
             <div className="absolute bottom-0 left-0 w-full bg-violet-400 transition-all duration-500" style={{ height: `${(leftNum/leftDen)*100}%` }} />
             {/* grid lines */}
             {Array.from({length: leftDen - 1}).map((_, i) => (
               <div key={i} className="absolute w-full h-[2px] bg-white/50" style={{ top: `${((i+1)/leftDen)*100}%` }} />
             ))}
           </div>
           <div className="flex flex-col items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
             <button onClick={() => setLeftNum(n => Math.min(leftDen, n + 1))} className="text-slate-400 hover:text-violet-500">▲</button>
             <span className="text-2xl font-black">{leftNum}</span>
             <button onClick={() => setLeftNum(n => Math.max(1, n - 1))} className="text-slate-400 hover:text-violet-500">▼</button>
             <div className="w-8 h-1 bg-slate-300 my-1"/>
             <span className="text-2xl font-black">{leftDen}</span>
           </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 z-10 relative">
          <button onClick={() => handleCompare('>')} className="w-16 h-16 bg-white rounded-full text-3xl shadow-md border-2 border-slate-100 hover:scale-110 hover:border-violet-400 transition-all font-black text-slate-700">&gt;</button>
          <button onClick={() => handleCompare('=')} className="w-16 h-16 bg-white rounded-full text-3xl shadow-md border-2 border-slate-100 hover:scale-110 hover:border-violet-400 transition-all font-black text-slate-700">=</button>
          <button onClick={() => handleCompare('<')} className="w-16 h-16 bg-white rounded-full text-3xl shadow-md border-2 border-slate-100 hover:scale-110 hover:border-violet-400 transition-all font-black text-slate-700">&lt;</button>
        </div>

        {/* Right Fraction */}
        <div className="flex flex-col items-center space-y-4 z-10 relative">
           <div className="w-32 h-48 bg-white border-2 border-slate-200 rounded-xl overflow-hidden relative shadow-inner">
             <div className="absolute bottom-0 left-0 w-full bg-violet-400 transition-all duration-500" style={{ height: `${(rightNum/rightDen)*100}%` }} />
             {/* grid lines */}
             {Array.from({length: rightDen - 1}).map((_, i) => (
               <div key={i} className="absolute w-full h-[2px] bg-white/50" style={{ top: `${((i+1)/rightDen)*100}%` }} />
             ))}
           </div>
           <div className="flex flex-col items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
             <button onClick={() => setRightNum(n => Math.min(rightDen, n + 1))} className="text-slate-400 hover:text-violet-500">▲</button>
             <span className="text-2xl font-black">{rightNum}</span>
             <button onClick={() => setRightNum(n => Math.max(1, n - 1))} className="text-slate-400 hover:text-violet-500">▼</button>
             <div className="w-8 h-1 bg-slate-300 my-1"/>
             <span className="text-2xl font-black">{rightDen}</span>
           </div>
        </div>

      </div>

      {result === 'correct' && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border-4 border-emerald-400 text-emerald-500 font-black text-3xl animate-bounce">
            🐊 Chomp! Correct!
          </div>
        </div>
      )}
      {result === 'incorrect' && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border-4 border-rose-400 text-rose-500 font-black text-3xl">
            🐊 Hmm, try again!
          </div>
        </div>
      )}
    </div>
  );
};
