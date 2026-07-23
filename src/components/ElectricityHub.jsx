import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  RotateCcw, 
  Award, 
  X,
  Zap,
  Lightbulb,
  Battery,
  ShieldAlert,
  Sun,
  Wind
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ElectricityHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedComponent, setSelectedComponent] = useState('battery');
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

  // Circuit Components Data
  const circuitComponents = [
    {
      id: 'battery',
      name: 'Battery / Cell',
      icon: '🔋',
      symbol: '+|i-',
      role: 'Energy Source & Voltage Push',
      summary: 'Stores chemical energy and transforms it into electrical energy, pushing electric current around the circuit from positive (+) to negative (-) terminals.',
      details: [
        'Acts as the chemical power generator of a simple circuit.',
        'Provides voltage (electrical pressure) that pushes electrons along wires.',
        'Single cell vs Multi-cell battery.'
      ]
    },
    {
      id: 'wires',
      name: 'Connecting Wires',
      icon: '🧵',
      symbol: '————',
      role: 'Electrical Conductor Pathway',
      summary: 'Copper metal wires wrapped in protective plastic insulation that carry electric current between components to complete the circuit loop.',
      details: [
        'Copper is an excellent electrical conductor with low resistance.',
        'Plastic outer coating acts as an electrical insulator to prevent short circuits and electrical shocks.'
      ]
    },
    {
      id: 'switch',
      name: 'Switch (Open / Closed)',
      icon: '🎛️',
      symbol: '-o  o-',
      role: 'Circuit Controller',
      summary: 'Opens or closes the electrical pathway to control whether electric current can flow.',
      details: [
        'Closed Switch: Completes the electrical circuit $\\rightarrow$ Current flows $\\rightarrow$ Bulb lights up.',
        'Open Switch: Breaks the electrical circuit $\\rightarrow$ Current stops $\\rightarrow$ Bulb goes OFF.'
      ]
    },
    {
      id: 'bulb',
      name: 'Lamp / Light Bulb',
      icon: '💡',
      symbol: '(X)',
      role: 'Electrical Output Transducer',
      summary: 'Transforms electrical energy into light and thermal heat energy as current passes through its thin filament.',
      details: [
        'Contains a thin tungsten wire filament.',
        'When electric current forces its way through high resistance filament, it glows brightly!'
      ]
    }
  ];

  // Conductors vs Insulators
  const materialsList = [
    { type: 'Conductors (Allow Electricity)', items: 'Copper wire, Metal spoon, Steel nail, Paper clip, Coin, Aluminum foil', icon: '⚡', color: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
    { type: 'Insulators (Stop Electricity)', items: 'Plastic, Rubber, Wood, Glass, Paper, Fabric', icon: '🛡️', color: 'bg-rose-50 border-rose-200 text-rose-900' }
  ];

  // Series vs Parallel
  const circuitTypes = [
    { name: 'Series Circuit 🔗', path: 'Single Pathway', desc: 'All components connected in one continuous line. If one bulb breaks or is removed, ALL bulbs go out because the single circuit loop is broken.' },
    { name: 'Parallel Circuit 🔀', path: 'Multiple Branching Pathways', desc: 'Components connected on separate parallel branches. If one bulb breaks, current still flows through other branches, keeping other bulbs lit!' }
  ];

  // Quiz Questions
  const quizQuestions = [
    {
      id: 1,
      q: 'Which component provides the electrical energy and pushes electric current around a simple circuit?',
      options: ['Light Bulb', 'Battery / Cell', 'Open Switch', 'Plastic Insulator'],
      ans: 'Battery / Cell'
    },
    {
      id: 2,
      q: 'What happens when a switch in an electric circuit is OPEN?',
      options: [
        'The circuit is broken and electricity CANNOT flow (Bulb OFF)',
        'The circuit is complete and electricity flows faster',
        'The battery charges automatically',
        'The wires melt'
      ],
      ans: 'The circuit is broken and electricity CANNOT flow (Bulb OFF)'
    },
    {
      id: 3,
      q: 'Which of the following materials is a good Electrical Conductor?',
      options: ['Rubber eraser', 'Copper metal wire', 'Wooden stick', 'Plastic bottle'],
      ans: 'Copper metal wire'
    },
    {
      id: 4,
      q: 'Why are Parallel Circuits used in household lighting instead of Series Circuits?',
      options: [
        'If one light bulb breaks in a parallel circuit, other lights stay ON',
        'Parallel circuits require no wires',
        'Series circuits are too cheap',
        'Parallel circuits do not use electricity'
      ],
      ans: 'If one light bulb breaks in a parallel circuit, other lights stay ON'
    },
    {
      id: 5,
      q: 'Which energy source generates clean, renewable electricity that will never run out?',
      options: ['Coal Power Station', 'Solar Panels & Wind Turbines', 'Petroleum Oil', 'Natural Gas'],
      ans: 'Solar Panels & Wind Turbines'
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

  const currentComponentData = circuitComponents.find(c => c.id === selectedComponent) || circuitComponents[0];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-600 p-8 text-white shadow-xl shadow-amber-500/10">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-yellow-200" /> Science Academy • Grade 4 Physical Science
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Electricity & Simple Circuits ⚡
          </h1>
          <p className="text-amber-100 text-sm md:text-base max-w-2xl font-medium leading-relaxed">
            Electricity is a form of energy that powers lights, appliances, and devices. Learn how electric current flows through complete circuits, conductors, insulators, and safety rules!
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={() => speakText("Electricity in Our Lives. Simple Electric Circuits. Electricity is a form of energy that flows in a complete loop from a battery through wires to light bulbs or motors.")}
              className="px-4 py-2 rounded-xl bg-white text-amber-900 font-extrabold text-xs flex items-center gap-2 hover:bg-amber-50 transition-all shadow-md cursor-pointer"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
              {isPlayingAudio ? 'Stop Audio' : 'Listen to Overview'}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-800/60 hover:bg-amber-800/80 text-white font-extrabold text-xs flex items-center gap-2 border border-amber-400/30 transition-all cursor-pointer"
            >
              🖼️ View Full Infographic Chart
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Circuit Components', icon: '🔋' },
          { id: 'infographic', label: 'Full Infographic Chart', icon: '🖼️' },
          { id: 'conductors', label: 'Conductors vs Insulators', icon: '⚡' },
          { id: 'circuits', label: 'Series vs Parallel', icon: '🔀' },
          { id: 'safety', label: 'Safety & Energy Sources', icon: '🛡️' },
          { id: 'quiz', label: 'Knowledge Check Quiz', icon: '🏆' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20 scale-102'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* ==================================== TAB 1: COMPONENTS ==================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {circuitComponents.map((c) => (
              <div 
                key={c.id} 
                onClick={() => setSelectedComponent(c.id)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-2 relative group ${
                  selectedComponent === c.id ? 'bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-500/20 scale-102' : 'bg-white border-slate-200 hover:border-amber-300'
                }`}
              >
                <div className="text-3xl">{c.icon}</div>
                <h3 className={`font-black text-sm ${selectedComponent === c.id ? 'text-white' : 'text-slate-800'}`}>{c.name}</h3>
                <div className={`text-[10px] font-bold ${selectedComponent === c.id ? 'text-amber-100' : 'text-amber-600'}`}>{c.role}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentComponentData.icon}</span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                    Circuit Symbol: {currentComponentData.symbol}
                  </span>
                  <h2 className="text-2xl font-black text-slate-800 mt-1">{currentComponentData.name}</h2>
                </div>
              </div>
              <button
                onClick={() => speakText(`${currentComponentData.name}. Role: ${currentComponentData.role}. ${currentComponentData.summary}. ${currentComponentData.details.join(' ')}`)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-800 transition-all cursor-pointer"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-amber-700">Primary Role</div>
              <div className="font-extrabold text-amber-950 text-sm leading-relaxed">{currentComponentData.summary}</div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Electrical Principles</h4>
              {currentComponentData.details.map((d, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-medium leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{d}</span>
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
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                Official Visual Reference
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">Electricity in Our Lives Infographic</h2>
              <p className="text-slate-500 text-xs mt-1">Official diagram detailing electric circuits, components, conductors/insulators, and renewable energy.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-600 text-white font-extrabold text-xs shadow-md shadow-amber-500/20 hover:bg-amber-700 transition-all flex items-center gap-2 cursor-pointer"
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
              src="/electricity_infographic.jpg" 
              alt="Electricity Infographic Chart" 
              className="max-w-full h-auto rounded-xl shadow-lg border border-white max-h-[800px] object-contain group-hover:scale-101 transition-transform"
            />
          </div>
        </div>
      )}

      {/* ==================================== TAB: CONDUCTORS & INSULATORS ==================================== */}
      {activeTab === 'conductors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {materialsList.map((m, idx) => (
            <div key={idx} className={`p-6 rounded-3xl border ${m.color} space-y-3`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{m.icon}</span>
                <h3 className="font-black text-lg">{m.type}</h3>
              </div>
              <div className="p-3 bg-white/80 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800">
                Examples: {m.items}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==================================== TAB: SERIES VS PARALLEL ==================================== */}
      {activeTab === 'circuits' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {circuitTypes.map((ct, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-black text-lg text-slate-900">{ct.name}</h3>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">{ct.path}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{ct.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* ==================================== TAB: SAFETY & ENERGY ==================================== */}
      {activeTab === 'safety' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 space-y-3 text-xs text-rose-900">
            <h3 className="font-black text-base flex items-center gap-2 text-rose-950">
              <ShieldAlert className="w-5 h-5 text-rose-600" /> Electrical Safety Rules
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-medium">
              <div>• Never put fingers or metal objects into sockets.</div>
              <div>• Keep electricity away from water.</div>
              <div>• Do not touch damaged or frayed wires.</div>
              <div>• Stay away from fallen power lines!</div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB: QUIZ ==================================== */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-800">Electricity Knowledge Check</h2>
              <p className="text-slate-500 text-xs mt-1">Test your understanding of circuits, conductors, and electrical safety.</p>
            </div>
            {quizScore !== null && (
              <div className="px-4 py-2 rounded-2xl bg-amber-100 text-amber-800 font-black text-sm flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" /> Score: {quizScore} / {quizQuestions.length}
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
                          ? 'bg-amber-600 border-amber-600 text-white shadow-sm'
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
              className="px-6 py-2.5 rounded-xl bg-amber-600 text-white font-extrabold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-40 cursor-pointer"
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
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 font-bold text-xs">
                🖼️ Full Chart View
              </span>
              <div>
                <h3 className="font-extrabold text-white text-sm">Electricity in Our Lives Infographic</h3>
                <p className="text-slate-400 text-[11px]">Official Grade 4 Science Chart</p>
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
              src="/electricity_infographic.jpg" 
              alt="Electricity Infographic" 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2 border-slate-700/50 object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
