import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  RotateCcw, 
  Award, 
  Zap, 
  Search, 
  ZoomIn, 
  Maximize2, 
  X,
  ChevronRight,
  BookOpen,
  Target,
  Brain,
  Hash,
  Ruler,
  PieChart,
  Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MathFormulaSheetHub() {
  const [activeTab, setActiveTab] = useState('poster');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeYearFilter, setActiveYearFilter] = useState('all');
  
  // Calculator Interactive States
  const [simpleInterestP, setSimpleInterestP] = useState(1000);
  const [simpleInterestR, setSimpleInterestR] = useState(5);
  const [simpleInterestT, setSimpleInterestT] = useState(2);

  const [rectLength, setRectLength] = useState(8);
  const [rectWidth, setRectWidth] = useState(5);

  const [circleRadius, setCircleRadius] = useState(7);

  const openImageModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Speech Handler
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isPlayingAudio) {
        setIsPlayingAudio(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Grade-wise Formulas Data
  const formulaCategories = [
    {
      grade: 'Foundation - Year 2',
      badge: 'Prep - Grade 2',
      color: 'bg-blue-50 text-blue-900 border-blue-200',
      badgeColor: 'bg-blue-600 text-white',
      formulas: [
        { name: 'Counting & One More / One Less', formula: 'n + 1 (one more), n - 1 (one less)', eg: 'One more than 5 is 6' },
        { name: 'Addition & Subtraction', formula: 'a + b = c, a - b = c', eg: '5 + 3 = 8, 8 - 3 = 5' },
        { name: 'Perimeter of Rectangle (Yr 2)', formula: 'P = 2(l + w)', eg: 'Length 5cm, Width 3cm → P = 2(5+3) = 16cm' },
        { name: 'Elapsed Time', formula: 'Elapsed Time = End Time - Start Time', eg: 'End 4:00 - Start 2:30 = 1 hr 30 mins' }
      ]
    },
    {
      grade: 'Year 3 - Year 4',
      badge: 'Grade 3 - 4',
      color: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      badgeColor: 'bg-emerald-600 text-white',
      formulas: [
        { name: 'Arrays & Multiplication', formula: 'Rows × Columns = Total', eg: '3 rows of 4 = 3 × 4 = 12' },
        { name: 'Area of Rectangle', formula: 'A = l × w', eg: 'Length 6m, Width 4m → Area = 24 m²' },
        { name: 'Order of Operations (BODMAS)', formula: '( ) → × or ÷ → + or -', eg: '2 + 3 × 4 = 2 + 12 = 14' },
        { name: 'Measurement Conversions', formula: '1 km = 1000m, 1m = 100cm, 1L = 1000mL', eg: '2.5 km = 2500m' }
      ]
    },
    {
      grade: 'Year 5 - Year 6',
      badge: 'Grade 5 - 6',
      color: 'bg-purple-50 text-purple-900 border-purple-200',
      badgeColor: 'bg-purple-600 text-white',
      formulas: [
        { name: 'Fraction Addition & Subtraction', formula: 'a/b ± c/d = (ad ± bc) / bd', eg: '1/2 + 1/3 = (3+2)/6 = 5/6' },
        { name: 'Percentage of a Number', formula: 'P% of n = (P / 100) × n', eg: '20% of 150 = (20/100) × 150 = 30' },
        { name: 'Simple Interest Formula', formula: 'I = (P × R × T) / 100', eg: 'P=$1000, R=5%, T=2 yrs → I = $100' },
        { name: 'Area of Triangle', formula: 'A = 1/2 × b × h', eg: 'Base 8cm, Height 5cm → Area = 20 cm²' },
        { name: 'Volume of Cuboid', formula: 'V = l × w × h', eg: '5cm × 3cm × 2cm = 30 cm³' },
        { name: 'Surface Area of Cuboid', formula: 'SA = 2(lw + lh + wh)', eg: '2(15 + 10 + 6) = 62 cm²' }
      ]
    },
    {
      grade: 'Geometry & Circles',
      badge: 'Shapes & Circles',
      color: 'bg-rose-50 text-rose-900 border-rose-200',
      badgeColor: 'bg-rose-600 text-white',
      formulas: [
        { name: 'Perimeter of Square', formula: 'P = 4s', eg: 'Side 5cm → P = 20cm' },
        { name: 'Perimeter of Triangle', formula: 'P = a + b + c', eg: 'Sides 3, 4, 5 → P = 12cm' },
        { name: 'Circle Circumference', formula: 'C = 2 × π × r (or π × d)', eg: 'Radius 7cm → C ≈ 2 × 3.1416 × 7 = 43.98cm' },
        { name: 'Circle Area', formula: 'A = π × r²', eg: 'Radius 7cm → A ≈ 3.1416 × 49 = 153.94cm²' }
      ]
    },
    {
      grade: 'Statistics & Probability',
      badge: 'Stats & Data',
      color: 'bg-amber-50 text-amber-900 border-amber-200',
      badgeColor: 'bg-amber-600 text-white',
      formulas: [
        { name: 'Mean (Average)', formula: 'Mean = Sum of all numbers / Total count', eg: '[4, 8, 12] → Sum 24 / 3 = 8' },
        { name: 'Range', formula: 'Range = Highest Value - Lowest Value', eg: '[3, 7, 15] → 15 - 3 = 12' },
        { name: 'Probability P(event)', formula: 'P = Favourable outcomes / Total outcomes', eg: 'Rolling 4 on a dice = 1 / 6' },
        { name: 'Common Fraction-Percent Conversions', formula: '1/2 = 50%, 1/4 = 25%, 3/4 = 75%, 1/5 = 20%', eg: '3/4 of 100 = 75' }
      ]
    },
    {
      grade: 'Algebra Basics',
      badge: 'Algebra',
      color: 'bg-indigo-50 text-indigo-900 border-indigo-200',
      badgeColor: 'bg-indigo-600 text-white',
      formulas: [
        { name: 'Number Expressions', formula: 'n + 5 (increased by 5), 2n (double), 3n (triple)', eg: 'Double 7 = 2(7) = 14' },
        { name: 'Perimeter Rearrangement', formula: 'P = 4s → s = P / 4', eg: 'Perimeter 24cm → Side s = 24/4 = 6cm' },
        { name: 'Area Rearrangement', formula: 'A = l × w → l = A / w  or  w = A / l', eg: 'Area 40m², Width 5m → Length = 40/5 = 8m' }
      ]
    }
  ];

  // Calculators
  const calcInterest = (simpleInterestP * simpleInterestR * simpleInterestT) / 100;
  const calcRectArea = rectLength * rectWidth;
  const calcRectPerimeter = 2 * (Number(rectLength) + Number(rectWidth));
  const calcCircleCircumference = (2 * Math.PI * circleRadius).toFixed(2);
  const calcCircleArea = (Math.PI * Math.pow(circleRadius, 2)).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-800 p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-yellow-300" /> Maths Academy • Primary & Middle Years
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Math Formula Sheet (Foundation – Grade 6)
          </h1>
          <p className="text-blue-100 text-sm md:text-base max-w-2xl font-medium">
            Complete quick reference chart for Number, Measurement, Geometry, Statistics, Probability, and Algebra formulas!
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={() => speakText("Welcome to the Math Formula Sheet! Explore essential formulas for Foundation through Grade 6, including Perimeter, Area, Volume, Interest, and Algebra.")}
              className="px-4 py-2 rounded-xl bg-white text-blue-900 font-extrabold text-xs flex items-center gap-2 hover:bg-blue-50 transition-all shadow-md cursor-pointer"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
              {isPlayingAudio ? 'Stop Audio' : 'Listen to Overview'}
            </button>
            <span className="text-xs font-bold bg-blue-900/50 px-3 py-1.5 rounded-lg border border-blue-400/20">
              Foundation to Grade 6 • 6 Core Math Strands • Interactive Calculators
            </span>
          </div>
        </div>
        <div className="absolute right-[-30px] bottom-[-30px] opacity-10 pointer-events-none">
          <Calculator className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'poster', label: 'Formula Sheet Chart Poster', icon: '📐' },
          { id: 'breakdown', label: 'Grade-by-Grade Formula Breakdown', icon: '📚' },
          { id: 'calculators', label: 'Interactive Formula Calculators', icon: '🧮' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-102'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* ==================================== TAB 1: FORMULA SHEET POSTER ==================================== */}
      {activeTab === 'poster' && (
        <div className="space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-md">
                  Official Visual Learning Guide
                </span>
                <h3 className="text-2xl font-black text-slate-800 mt-2 flex items-center gap-2">
                  <span>📐</span> Math Formula Sheet Poster (Prep – Grade 6)
                </h3>
                <p className="text-slate-500 text-xs mt-1">
                  Keep this sheet handy for daily revision! Click the poster below to expand into interactive high-resolution zoom view.
                </p>
              </div>
              <button 
                onClick={openImageModal}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <ZoomIn className="w-4 h-4" /> Expand Poster
              </button>
            </div>

            {/* Poster Image Container */}
            <div 
              onClick={openImageModal}
              className="relative flex justify-center bg-slate-900/5 p-4 rounded-2xl border border-slate-200 overflow-hidden cursor-pointer group hover:bg-slate-900/10 transition-all"
              title="Click to Open & Zoom"
            >
              <img 
                src="/math_formula_sheet_infographic.jpg?v=10" 
                alt="Math Formula Sheet Foundation - Grade 6 Infographic Poster" 
                className="max-w-full h-auto rounded-xl shadow-md border border-white max-h-[650px] object-contain group-hover:scale-101 transition-transform"
              />
              <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl backdrop-blur-[2px]">
                <span className="px-6 py-3 bg-white text-slate-900 font-black text-xs rounded-2xl shadow-xl flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-blue-600" /> Click to Expand & Zoom Formula Sheet
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 space-y-2">
              <span className="text-2xl">🔢</span>
              <h4 className="font-black text-blue-950 text-sm">Number & Operations</h4>
              <p className="text-slate-600 text-xs">Addition, subtraction, multiplication, division, fractions & decimals.</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-2">
              <span className="text-2xl">📏</span>
              <h4 className="font-black text-emerald-950 text-sm">Measurement & Conversions</h4>
              <p className="text-slate-600 text-xs">Length, mass, capacity, time, perimeter, area & unit conversions.</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 space-y-2">
              <span className="text-2xl">📐</span>
              <h4 className="font-black text-purple-950 text-sm">Geometry & Circles</h4>
              <p className="text-slate-600 text-xs">Shape sides, perimeter formulas, circle circumference & area formulas.</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-2">
              <span className="text-2xl">📊</span>
              <h4 className="font-black text-amber-950 text-sm">Stats, Algebra & Interest</h4>
              <p className="text-slate-600 text-xs">Mean, range, probability, simple interest formula ($I=PRT/100$), and variables.</p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB 2: GRADE-BY-GRADE BREAKDOWN ==================================== */}
      {activeTab === 'breakdown' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <span>📚</span> Formula Explorer by Topic & Grade
              </h3>
              <p className="text-slate-500 text-xs mt-1">Detailed formulas with step-by-step examples from Foundation up to Grade 6.</p>
            </div>
            <div className="flex gap-2">
              {['all', 'Prep - Grade 2', 'Grade 3 - 4', 'Grade 5 - 6', 'Shapes & Circles'].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveYearFilter(f)}
                  className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                    activeYearFilter === f
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f === 'all' ? 'All Formulas' : f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formulaCategories
              .filter(cat => activeYearFilter === 'all' || cat.badge === activeYearFilter)
              .map((cat, idx) => (
                <div key={idx} className={`bg-white rounded-3xl p-6 border ${cat.color} shadow-sm space-y-4`}>
                  <div className="flex justify-between items-center">
                    <h4 className="text-xl font-black text-slate-800">{cat.grade}</h4>
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${cat.badgeColor}`}>
                      {cat.badge}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {cat.formulas.map((item, fIdx) => (
                      <div key={fIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <div className="font-extrabold text-xs text-slate-800 flex items-center justify-between">
                          <span>{item.name}</span>
                          <button 
                            onClick={() => speakText(`${item.name}: Formula is ${item.formula}`)}
                            className="p-1 rounded-lg hover:bg-slate-200 text-blue-600 cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                          {item.formula}
                        </div>
                        <p className="text-[11px] text-slate-600 italic">
                          <strong>Example:</strong> {item.eg}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================== TAB 3: INTERACTIVE FORMULA CALCULATORS ==================================== */}
      {activeTab === 'calculators' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Simple Interest Calculator */}
          <div className="bg-white p-6 rounded-3xl border border-purple-200 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-purple-700">
              <Calculator className="w-5 h-5" />
              <h3 className="font-black text-lg text-slate-800">Simple Interest</h3>
            </div>
            <div className="font-mono text-xs bg-purple-50 text-purple-900 p-2.5 rounded-xl font-bold border border-purple-200">
              I = (P × R × T) / 100
            </div>
            <div className="space-y-3 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Principal P ($):</label>
                <input
                  type="number"
                  value={simpleInterestP}
                  onChange={(e) => setSimpleInterestP(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block mb-1">Rate R (% per year):</label>
                <input
                  type="number"
                  value={simpleInterestR}
                  onChange={(e) => setSimpleInterestR(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block mb-1">Time T (years):</label>
                <input
                  type="number"
                  value={simpleInterestT}
                  onChange={(e) => setSimpleInterestT(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-purple-600 text-white space-y-1">
              <span className="text-[10px] font-black uppercase text-purple-200">Calculated Interest (I)</span>
              <div className="text-2xl font-black">${calcInterest.toFixed(2)}</div>
            </div>
          </div>

          {/* Area & Perimeter Calculator */}
          <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <Ruler className="w-5 h-5" />
              <h3 className="font-black text-lg text-slate-800">Rectangle Area & Perimeter</h3>
            </div>
            <div className="font-mono text-xs bg-emerald-50 text-emerald-900 p-2.5 rounded-xl font-bold border border-emerald-200">
              A = l × w  |  P = 2(l + w)
            </div>
            <div className="space-y-3 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Length (l):</label>
                <input
                  type="number"
                  value={rectLength}
                  onChange={(e) => setRectLength(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block mb-1">Width (w):</label>
                <input
                  type="number"
                  value={rectWidth}
                  onChange={(e) => setRectWidth(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-2xl bg-emerald-600 text-white space-y-0.5">
                <span className="text-[10px] font-black uppercase text-emerald-200">Area (A)</span>
                <div className="text-xl font-black">{calcRectArea} units²</div>
              </div>
              <div className="p-3 rounded-2xl bg-teal-600 text-white space-y-0.5">
                <span className="text-[10px] font-black uppercase text-teal-200">Perimeter (P)</span>
                <div className="text-xl font-black">{calcRectPerimeter} units</div>
              </div>
            </div>
          </div>

          {/* Circle Calculator */}
          <div className="bg-white p-6 rounded-3xl border border-rose-200 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-rose-700">
              <PieChart className="w-5 h-5" />
              <h3 className="font-black text-lg text-slate-800">Circle Calculator</h3>
            </div>
            <div className="font-mono text-xs bg-rose-50 text-rose-900 p-2.5 rounded-xl font-bold border border-rose-200">
              C = 2πr  |  A = πr²
            </div>
            <div className="space-y-3 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Radius (r):</label>
                <input
                  type="number"
                  value={circleRadius}
                  onChange={(e) => setCircleRadius(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-5">
              <div className="p-3 rounded-2xl bg-rose-600 text-white space-y-0.5">
                <span className="text-[10px] font-black uppercase text-rose-200">Circumference</span>
                <div className="text-lg font-black">{calcCircleCircumference}</div>
              </div>
              <div className="p-3 rounded-2xl bg-pink-600 text-white space-y-0.5">
                <span className="text-[10px] font-black uppercase text-pink-200">Area</span>
                <div className="text-lg font-black">{calcCircleArea}</div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ==================================== FULLSCREEN IMAGE VIEW MODAL ==================================== */}
      {isModalOpen && (
        <div 
          onClick={closeModal}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col animate-fade-in select-none p-4 md:p-6"
        >
          {/* Top Control Bar */}
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-slate-900/90 border border-slate-800 rounded-2xl px-6 py-3.5 flex items-center justify-between gap-4 shrink-0 mb-4 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400 font-bold text-xs">
                📐 Full Poster View
              </span>
              <div>
                <h3 className="font-extrabold text-white text-sm">Math Formula Sheet (Foundation – Grade 6)</h3>
                <p className="text-slate-400 text-[11px]">Official Primary & Middle Years Curriculum Chart</p>
              </div>
            </div>

            <button 
              onClick={closeModal}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition-all shadow-lg shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-4 h-4" /> Close
            </button>
          </div>

          {/* Centered High-Res Image Viewport */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center overflow-auto"
          >
            <img 
              src="/math_formula_sheet_infographic.jpg?v=10" 
              alt="Math Formula Sheet Infographic Poster" 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2 border-slate-700/50 object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
