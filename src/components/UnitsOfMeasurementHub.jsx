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
  Maximize2,
  Calculator
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
      name: '1. Length & Distance 📏',
      units: 'mm, cm, m, km',
      tool: 'Ruler, Tape Measure, Trundle Wheel',
      conversions: '10 mm = 1 cm | 100 cm = 1 m | 1000 m = 1 km',
      color: 'bg-blue-50 border-blue-200 text-blue-950',
      badgeBg: 'bg-blue-600 text-white',
      summary: 'Length measures the distance between two points, height, or width of an object.',
      examples: [
        'Millimetres (mm): Tiny items like a coin thickness (2 mm) or paperclip (30 mm).',
        'Centimetres (cm): Small items like a pencil (18 cm) or textbook (25 cm).',
        'Metres (m): Larger distances like a doorway (2 m) or classroom (10 m).',
        'Kilometres (km): Long distances like a running highway (5 km) or travel between towns.'
      ]
    },
    {
      id: 'mass',
      name: '2. Mass & Weight ⚖️',
      units: 'g, kg, t',
      tool: 'Digital Scale, Balance Scale, Kitchen Scale',
      conversions: '1000 g = 1 kg | 1000 kg = 1 Tonne (t)',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-950',
      badgeBg: 'bg-emerald-600 text-white',
      summary: 'Mass measures the amount of matter in an object, telling us how light or heavy it is.',
      examples: [
        'Grams (g): Light objects like an apple (150 g) or a slice of bread (40 g).',
        'Kilograms (kg): Heavier items like a student backpack (5 kg) or dog (20 kg).',
        'Tonnes (t): Extremely heavy objects like a motorcar (1.5 t) or elephant (5 t).'
      ]
    },
    {
      id: 'capacity',
      name: '3. Capacity & Liquid Volume 🧪',
      units: 'mL, L',
      tool: 'Measuring Jug, Graduated Cylinder, Beaker',
      conversions: '1000 mL = 1 Litre (L)',
      color: 'bg-cyan-50 border-cyan-200 text-cyan-950',
      badgeBg: 'bg-cyan-600 text-white',
      summary: 'Capacity measures the maximum amount of liquid a container can hold.',
      examples: [
        'Millilitres (mL): Small liquid volumes like medicine (5 mL) or juice box (250 mL).',
        'Litres (L): Larger liquid volumes like a milk carton (2 L) or swimming pool (50,000 L).'
      ]
    },
    {
      id: 'time',
      name: '4. Time & Duration ⏱️',
      units: 's, min, h, days, weeks, years',
      tool: 'Clock, Stopwatch, Calendar, Hourglass',
      conversions: '60 s = 1 min | 60 min = 1 h | 24 h = 1 day | 7 days = 1 week | 365 days = 1 year',
      color: 'bg-purple-50 border-purple-200 text-purple-950',
      badgeBg: 'bg-purple-600 text-white',
      summary: 'Time measures the duration of events, intervals, and schedules.',
      examples: [
        'Seconds (s): Brief events like a 100 m sprint race (12 s).',
        'Minutes (min): Classroom lesson (45 min) or cooking a meal.',
        'Hours (h): School day duration (6 hours).',
        'Years: Age, birthdays, and historical timelines.'
      ]
    },
    {
      id: 'temperature',
      name: '5. Temperature 🌡️',
      units: 'Degrees Celsius (°C)',
      tool: 'Thermometer (Digital / Alcohol)',
      conversions: '0°C = Freezing Point of Water | 100°C = Boiling Point of Water',
      color: 'bg-rose-50 border-rose-200 text-rose-950',
      badgeBg: 'bg-rose-600 text-white',
      summary: 'Temperature measures how hot or cold an object or environment is in Degrees Celsius.',
      examples: [
        '100°C: Water boils to steam at sea level.',
        '37°C: Healthy human body temperature.',
        '20°C: Comfortable indoor room temperature.',
        '0°C: Water freezes into solid ice.'
      ]
    },
    {
      id: 'geometry',
      name: '6. Perimeter, Area & Volume 📐',
      units: 'm, cm², m³, mL',
      tool: 'Ruler, Grid Squares, Formula Calculations',
      conversions: 'Perimeter = Sum of sides | Area = L × W | Volume = L × W × H',
      color: 'bg-amber-50 border-amber-200 text-amber-950',
      badgeBg: 'bg-amber-700 text-white',
      summary: 'Geometric measurement calculates outer boundaries (Perimeter), flat surface space (Area), and 3D internal capacity (Volume).',
      examples: [
        'Perimeter: Distance around a garden (8m + 6m + 8m + 6m = 28 m).',
        'Area: Space inside a rectangle (4 m × 6 m = 24 m²).',
        'Volume: Space inside a 3D box or aquarium (Length × Width × Height).'
      ]
    }
  ];

  // Quiz Questions
  const quizQuestions = [
    {
      id: 1,
      q: 'How many centimetres (cm) are in 1 metre (m)?',
      options: ['10 cm', '100 cm', '1000 cm', '60 cm'],
      ans: '100 cm'
    },
    {
      id: 2,
      q: 'Which metric unit is most suitable to measure the weight of an apple?',
      options: ['Grams (g)', 'Tonnes (t)', 'Kilometres (km)', 'Litres (L)'],
      ans: 'Grams (g)'
    },
    {
      id: 3,
      q: 'What is the formula to calculate the Area of a flat rectangle?',
      options: ['Area = Length × Width', 'Area = Add all 4 sides', 'Area = Length ÷ 100', 'Area = Volume × 2'],
      ans: 'Area = Length × Width'
    },
    {
      id: 4,
      q: 'What is the normal healthy human body temperature in Degrees Celsius?',
      options: ['37°C', '100°C', '0°C', '20°C'],
      ans: '37°C'
    },
    {
      id: 5,
      q: 'How many millilitres (mL) equal 1 Litre (L) of liquid capacity?',
      options: ['1000 mL', '100 mL', '10 mL', '60 mL'],
      ans: '1000 mL'
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
          { id: 'infographic', label: 'Full Infographic Chart', icon: '🖼️' },
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
          
          {/* Quick Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-4 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📏</span>
              <div>
                <h4 className="font-extrabold text-sm">Official Measurement Infographic Included</h4>
                <p className="text-blue-100 text-xs">View the high-resolution infographic chart detailing length, mass, liquid capacity, time, temperature benchmarks, and geometric formulas.</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('infographic')}
              className="px-4 py-2 rounded-xl bg-white text-blue-950 font-black text-xs hover:bg-blue-50 transition-all shrink-0 cursor-pointer shadow-sm"
            >
              View Infographic Chart →
            </button>
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
                <div className={`text-[10px] font-bold ${selectedMetric === m.id ? 'text-blue-100' : 'text-blue-600'}`}>{m.units}</div>
              </div>
            ))}
          </div>

          {/* Interactive Metric Detail Panel */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  Standard Metric Unit • {currentMetricData.units}
                </span>
                <h2 className="text-2xl font-black text-slate-800 mt-1">{currentMetricData.name}</h2>
              </div>
              <button
                onClick={() => speakText(`${currentMetricData.name}. Standard units: ${currentMetricData.units}. Measurement tool: ${currentMetricData.tool}. Conversions: ${currentMetricData.conversions}. ${currentMetricData.summary}. ${currentMetricData.examples.join(' ')}`)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-800 transition-all cursor-pointer"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-blue-700">Conversion Rule & Tools</div>
              <div className="font-bold text-blue-950 text-xs md:text-sm leading-relaxed">
                <strong>Tool Used: </strong>{currentMetricData.tool} <br />
                <strong>Conversion Ladder: </strong>{currentMetricData.conversions}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Real-World Unit Examples</h4>
              {currentMetricData.examples.map((ex, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-medium leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>{ex}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ==================================== TAB: INFOGRAPHIC CHART ==================================== */}
      {activeTab === 'infographic' && (
        <div className="space-y-6 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                Official Visual Reference
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">Units of Measurement Infographic</h2>
              <p className="text-slate-500 text-xs mt-1">Official high-resolution diagram detailing length, mass, capacity, time, temperature, perimeter, area, and volume.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              🖼️ Open Fullscreen View
            </button>
          </div>

          <div 
            onClick={() => setIsModalOpen(true)}
            className="relative flex justify-center bg-slate-900/5 p-4 rounded-2xl border border-slate-200 overflow-hidden cursor-pointer group hover:bg-slate-900/10 transition-all"
            title="Click to Open Full Chart"
          >
            <img 
              src="/units_of_measurement_infographic.jpg" 
              alt="Units of Measurement Infographic Chart" 
              className="max-w-full h-auto rounded-xl shadow-lg border border-white max-h-[800px] object-contain group-hover:scale-101 transition-transform"
            />
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
              src="/units_of_measurement_infographic.jpg" 
              alt="Units of Measurement Infographic" 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2 border-slate-700/50 object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
