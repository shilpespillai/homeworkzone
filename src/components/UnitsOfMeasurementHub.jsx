import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  RotateCcw, 
  Award, 
  X,
  Ruler,
  Weight,
  Droplet,
  Clock,
  Thermometer,
  Box,
  ZoomIn,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function UnitsOfMeasurementHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState('length');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);

  // Audio Speech Handler
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

  // 6 Metric Dimension Categories
  const metricCategories = [
    {
      id: 'length',
      num: '1',
      name: 'Length & Distance',
      icon: '📏',
      baseUnit: 'Meter (m)',
      ladder: '1 km = 1,000 m | 1 m = 100 cm | 1 cm = 10 mm',
      color: 'bg-blue-50 border-blue-200 text-blue-900',
      badgeBg: 'bg-blue-600 text-white',
      tools: 'Ruler, Tape Measure, Trundle Wheel, Odometer',
      examples: [
        'Millimeter (mm): ant length or coin thickness.',
        'Centimeter (cm): pencil or book width.',
        'Meter (m): classroom length or door height.',
        'Kilometer (km): driving distance between cities.'
      ]
    },
    {
      id: 'mass',
      num: '2',
      name: 'Mass & Weight',
      icon: '⚖️',
      baseUnit: 'Gram (g) / Kilogram (kg)',
      ladder: '1 Tonne (t) = 1,000 kg | 1 kg = 1,000 g | 1 g = 1,000 mg',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-900',
      badgeBg: 'bg-indigo-600 text-white',
      tools: 'Digital Kitchen Scale, Balance Scale, Bathroom Scale',
      examples: [
        'Milligram (mg): feather or grain of salt.',
        'Gram (g): paperclip or dollar bill.',
        'Kilogram (kg): school bag or textbook.',
        'Tonne (t): car or elephant weight.'
      ]
    },
    {
      id: 'capacity',
      num: '3',
      name: 'Capacity & Liquid Volume',
      icon: '🧪',
      baseUnit: 'Liter (L)',
      ladder: '1 Liter (L) = 1,000 Milliliters (mL)',
      color: 'bg-cyan-50 border-cyan-200 text-cyan-900',
      badgeBg: 'bg-cyan-600 text-white',
      tools: 'Measuring Jug, Beaker, Pipette, Syringe',
      examples: [
        'Milliliter (mL): teaspoon of medicine or liquid drop.',
        'Liter (L): milk bottle, juice carton, or water jug.'
      ]
    },
    {
      id: 'time',
      num: '4',
      name: 'Time',
      icon: '⏱️',
      baseUnit: 'Second (s)',
      ladder: '1 Year = 365 Days | 1 Day = 24 Hours | 1 Hour = 60 Mins | 1 Min = 60 Secs',
      color: 'bg-purple-50 border-purple-200 text-purple-900',
      badgeBg: 'bg-purple-600 text-white',
      tools: 'Analogue Clock, Digital Stopwatch, Calendar',
      examples: [
        'Seconds (s): hand clap duration or heartbeat.',
        'Minutes (min): recess duration or short walk.',
        'Hours (h): school day length or sleep.'
      ]
    },
    {
      id: 'temperature',
      num: '5',
      name: 'Temperature',
      icon: '🌡️',
      baseUnit: 'Degrees Celsius (°C)',
      ladder: 'Freezing = 0°C | Room Temp = 20°C | Body = 37°C | Boiling = 100°C',
      color: 'bg-rose-50 border-rose-200 text-rose-900',
      badgeBg: 'bg-rose-600 text-white',
      tools: 'Thermometer, Infrared Thermal Sensor',
      examples: [
        'Freezing Point: Pure liquid water freezes into ice at 0°C.',
        'Body Temperature: Healthy human body averages 37°C.',
        'Boiling Point: Liquid water boils into steam at 100°C.'
      ]
    },
    {
      id: 'area',
      num: '6',
      name: 'Area & Volume Geometry',
      icon: '📐',
      baseUnit: 'cm², m² / cm³, m³',
      ladder: 'Area = Length × Width | Volume = Length × Width × Height',
      color: 'bg-teal-50 border-teal-200 text-teal-900',
      badgeBg: 'bg-teal-600 text-white',
      tools: 'Grid Paper, Cubic Centimeter Blocks (cm³)',
      examples: [
        'Perimeter: Total length around boundary fence.',
        'Area (m²): Total carpet floor surface space.',
        'Volume (m³): Total 3D storage space inside box.'
      ]
    }
  ];

  // Quiz Questions
  const quizQuestions = [
    {
      id: 1,
      q: 'How many Millimeters (mm) are there in exactly 1 Centimeter (cm)?',
      options: ['10 mm', '100 mm', '1,000 mm', '5 mm'],
      ans: '10 mm'
    },
    {
      id: 2,
      q: 'How many Grams (g) equal 1 Kilogram (kg)?',
      options: ['1,000 g', '100 g', '10 g', '500 g'],
      ans: '1,000 g'
    },
    {
      id: 3,
      q: 'What is the exact temperature benchmark at which pure liquid water boils into steam?',
      options: ['100°C', '0°C', '37°C', '50°C'],
      ans: '100°C'
    },
    {
      id: 4,
      q: 'What mathematical formula calculates the AREA (cm²) of a rectangle?',
      options: ['Area = Length × Width', 'Area = Length + Width', 'Area = Length ÷ Width', 'Area = 2 × (Length + Width)'],
      ans: 'Area = Length × Width'
    },
    {
      id: 5,
      q: 'Which standard metric unit would a doctor use to prescribe a small liquid dose of cough medicine?',
      options: ['Milliliters (mL)', 'KiloLiters (kL)', 'Meters (m)', 'Kilograms (kg)'],
      ans: 'Milliliters (mL)'
    }
  ];

  const handleQuizSubmit = () => {
    let score = 0;
    quizQuestions.forEach(q => {
      if (quizAnswers[q.id] === q.ans) score++;
    });
    setQuizScore(score);
    if (score === quizQuestions.length) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const currentMetricData = metricCategories.find(m => m.id === selectedMetric) || metricCategories[0];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-8 text-white shadow-xl shadow-blue-600/10">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-yellow-300" /> Mathematics & Science • Grade 4 Measurement
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Units of Measurement: Length, Mass, Capacity & More 📏⏱️
          </h1>
          <p className="text-blue-100 text-sm md:text-base max-w-3xl font-medium leading-relaxed">
            Everything can be measured! Master standard metric units for length, weight, liquid volume, time, temperature, perimeter, area, and volume with quick conversion ladders.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={() => speakText("Units of Measurement: Measuring Length, Mass, Capacity, Time, Temperature and More. Everything can be measured! Measurement tells us the size, amount, length, weight, capacity, temperature, or time of something. Standard metric units allow scientists, builders, and chefs to measure accurately.")}
              className="px-4 py-2 rounded-xl bg-white text-blue-950 font-extrabold text-xs flex items-center gap-2 hover:bg-blue-50 transition-all shadow-md cursor-pointer"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-blue-700" />}
              {isPlayingAudio ? 'Stop Audio' : 'Listen to Overview'}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-900/60 hover:bg-blue-900/80 text-white font-extrabold text-xs flex items-center gap-2 border border-blue-400/30 transition-all cursor-pointer"
            >
              🖼️ View Full Infographic Chart
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: '6 Metric Dimensions', icon: '📏' },
          { id: 'conversions', label: 'Quick Conversion Ladders', icon: '🔢' },
          { id: 'geometry', label: 'Perimeter, Area & Volume', icon: '📐' },
          { id: 'careers', label: 'Real-Life Measurement Careers', icon: '👩‍⚕️' },
          { id: 'quiz', label: 'Knowledge Check Quiz', icon: '🏆' }
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

      {/* ==================================== TAB 1: 6 METRIC DIMENSIONS ==================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Top Featured Infographic Poster */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-md">
                  Visual Learning Guide • Units of Measurement Chart
                </span>
                <h3 className="text-2xl font-black text-slate-800 mt-2 flex items-center gap-2">
                  <span>🖼️</span> Units of Measurement Infographic Chart
                </h3>
                <p className="text-slate-500 text-xs mt-1">
                  Click the poster below to expand into full high-resolution view with metric ladders, mass, volume, and geometry.
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <ZoomIn className="w-4 h-4" /> Expand Chart
              </button>
            </div>

            <div 
              onClick={() => setIsModalOpen(true)}
              className="relative flex justify-center bg-slate-900/5 p-4 rounded-2xl border border-slate-200 overflow-hidden cursor-pointer group hover:bg-slate-900/10 transition-all"
              title="Click to Open & Zoom"
            >
              <img 
                src="/units_of_measurement_infographic.jpg?v=10" 
                alt="Units of Measurement Infographic Poster" 
                className="max-w-full h-auto rounded-xl shadow-md border border-white max-h-[650px] object-contain group-hover:scale-101 transition-transform"
              />
              <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl backdrop-blur-[2px]">
                <span className="px-6 py-3 bg-white text-slate-900 font-black text-xs rounded-2xl shadow-xl flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-blue-600" /> Click to Expand & Zoom Image
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {metricCategories.map((m) => (
              <div 
                key={m.id} 
                onClick={() => setSelectedMetric(m.id)}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer space-y-1 ${
                  selectedMetric === m.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-105' : 'bg-white border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="font-black text-xs">{m.name}</div>
                <div className={`text-[10px] font-bold ${selectedMetric === m.id ? 'text-blue-100' : 'text-blue-600'}`}>{m.baseUnit}</div>
              </div>
            ))}
          </div>

          {/* Interactive Metric Detail Panel */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  Standard Metric Unit • {currentMetricData?.baseUnit}
                </span>
                <h2 className="text-2xl font-black text-slate-800 mt-1">{currentMetricData?.name}</h2>
              </div>
              <button
                onClick={() => speakText(`${currentMetricData?.name}. Base unit: ${currentMetricData?.baseUnit}. Measurement tool: ${currentMetricData?.tools}. Conversions: ${currentMetricData?.ladder}. ${(currentMetricData?.examples || []).join(' ')}`)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-800 transition-all cursor-pointer"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-blue-700">Conversion Rule & Tools</div>
              <div className="font-bold text-blue-950 text-xs md:text-sm leading-relaxed">
                <strong>Tool Used: </strong>{currentMetricData?.tools} <br />
                <strong>Conversion Ladder: </strong>{currentMetricData?.ladder}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Real-World Unit Examples</h4>
              {(currentMetricData?.examples || []).map((ex, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-medium leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>{ex}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ==================================== TAB: CONVERSIONS ==================================== */}
      {activeTab === 'conversions' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50 space-y-2">
            <h3 className="font-black text-base text-blue-900">Length Conversions 📏</h3>
            <div className="text-xs font-bold text-blue-950 space-y-1">
              <div>10 mm = 1 cm</div>
              <div>100 cm = 1 m</div>
              <div>1000 m = 1 km</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50 space-y-2">
            <h3 className="font-black text-base text-emerald-900">Mass Conversions ⚖️</h3>
            <div className="text-xs font-bold text-emerald-950 space-y-1">
              <div>1000 g = 1 kg</div>
              <div>1000 kg = 1 Tonne (t)</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-cyan-200 bg-cyan-50 space-y-2">
            <h3 className="font-black text-base text-cyan-900">Capacity Conversions 🧪</h3>
            <div className="text-xs font-bold text-cyan-950 space-y-1">
              <div>1000 mL = 1 Litre (L)</div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB: GEOMETRY (PERIMETER, AREA, VOLUME) ==================================== */}
      {activeTab === 'geometry' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50 space-y-2">
            <h3 className="font-black text-base text-amber-900">Perimeter 📐</h3>
            <p className="text-xs text-slate-700 font-medium">Distance around the outer boundary of a 2D shape.</p>
            <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs font-bold text-amber-950">
              Formula: Add all outer side lengths together!
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50 space-y-2">
            <h3 className="font-black text-base text-amber-900">Area ⬛</h3>
            <p className="text-xs text-slate-700 font-medium">Amount of flat surface space enclosed inside a 2D shape.</p>
            <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs font-bold text-amber-950">
              Formula: Length × Width (e.g. 4 m × 6 m = 24 m²)
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50 space-y-2">
            <h3 className="font-black text-base text-amber-900">Volume 📦</h3>
            <p className="text-xs text-slate-700 font-medium">Amount of 3D space occupied inside a solid object.</p>
            <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs font-bold text-amber-950">
              Formula: Length × Width × Height (cubic cm³ or m³)
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB: QUIZ ==================================== */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-800">Measurement Knowledge Check</h2>
              <p className="text-slate-500 text-xs mt-1">Test your understanding of metric units, conversions, temperature benchmarks, and geometry formulas.</p>
            </div>
            {quizScore !== null && (
              <div className="px-4 py-2 rounded-2xl bg-blue-100 text-blue-950 font-black text-sm flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" /> Score: {quizScore} / {quizQuestions.length}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {quizQuestions.map((q, idx) => (
              <div key={q.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="font-black text-xs text-slate-800">
                  Q{idx + 1}. {q.q}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: opt }))}
                      className={`p-3 rounded-xl border text-xs text-left font-bold transition-all cursor-pointer ${
                        quizAnswers[q.id] === opt
                          ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => { setQuizAnswers({}); setQuizScore(null); }}
              className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-extrabold text-xs cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button
              onClick={handleQuizSubmit}
              disabled={Object.keys(quizAnswers).length < quizQuestions.length}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20 disabled:opacity-40 cursor-pointer"
            >
              Submit Answers
            </button>
          </div>
        </div>
      )}

      {/* ==================================== FULLSCREEN IMAGE VIEW MODAL ==================================== */}
      {isModalOpen && (
        <div 
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col animate-fade-in select-none p-4 md:p-6"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-slate-900/90 border border-slate-800 rounded-2xl px-6 py-3.5 flex items-center justify-between gap-4 shrink-0 mb-4 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400 font-bold text-xs">
                🖼️ Full Chart View
              </span>
              <div>
                <h3 className="font-extrabold text-white text-sm">Units of Measurement Infographic</h3>
                <p className="text-slate-400 text-[11px]">Official Grade 4 Science & Maths Chart</p>
              </div>
            </div>

            <button 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition-all shadow-lg shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-4 h-4" /> Close
            </button>
          </div>

          <div 
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center overflow-auto"
          >
            <img 
              src="/units_of_measurement_infographic.jpg?v=10" 
              alt="Units of Measurement Infographic" 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2 border-slate-700/50 object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
