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
  Wind,
  ZoomIn,
  Maximize2
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

  // 4 Circuit Components Data
  const circuitComponents = [
    {
      id: 'battery',
      num: '1',
      name: 'Battery (Power Cell)',
      icon: '🔋',
      symbol: '[ + | - ]',
      role: 'Voltage & Energy Source',
      summary: 'Provides pushing force (voltage) that drives electric charge (electrons) through the circuit wires.',
      details: [
        'Chemical energy stored inside the battery converts into electrical energy.',
        'Direct Current (DC) flows from the positive (+) terminal toward the negative (-) terminal.',
        'Higher voltage batteries push more electrons per second.'
      ]
    },
    {
      id: 'wires',
      num: '2',
      name: 'Conducting Wires',
      icon: '🧵',
      symbol: '————',
      role: 'Conductor Path',
      summary: 'Copper metal wires coated in plastic insulation that allow free electrons to travel easily.',
      details: [
        'Made of highly conductive metals like Copper (Cu) or Aluminium (Al).',
        'Plastic or rubber outer casing acts as an electrical insulator for safety.',
        'Complete closed loops allow continuous current flow.'
      ]
    },
    {
      id: 'bulb',
      num: '3',
      name: 'Lightbulb / Load',
      icon: '💡',
      symbol: '(X)',
      role: 'Energy Converter',
      summary: 'Transforms electrical energy into heat and radiant light energy.',
      details: [
        'Thin tungsten filament inside incandescent bulbs resists electron flow and glows hot white.',
        'Modern LED bulbs use semiconductor diodes to glow with high efficiency.',
        'Acts as the electrical load consuming circuit power.'
      ]
    },
    {
      id: 'switch',
      num: '4',
      name: 'Switch Control',
      icon: '🎛️',
      symbol: '—/ —',
      role: 'Circuit Gate Keeper',
      summary: 'Opens or closes the loop to start or safely stop electrical current flow.',
      details: [
        'CLOSED SWITCH: Creates a continuous closed circuit (Current Flows $\rightarrow$ Bulb Lights Up).',
        'OPEN SWITCH: Creates a gap or break in the circuit (Current Stops $\rightarrow$ Bulb Turns Off).',
        'Fuses and circuit breakers automatically open when current exceeds safe limits.'
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
      q: 'Which device acts as the power source that pushes electrons through an electrical circuit?',
      options: ['Lightbulb', 'Battery', 'Switch', 'Resistor'],
      ans: 'Battery'
    },
    {
      id: 2,
      q: 'What happens when a switch in a simple electrical circuit is OPENED?',
      options: [
        'The circuit is broken and electric current stops flowing',
        'The lightbulb glows twice as bright',
        'Electrons flow faster',
        'The battery recharges'
      ],
      ans: 'The circuit is broken and electric current stops flowing'
    },
    {
      id: 3,
      q: 'Why is Copper widely used to manufacture electric conducting wires?',
      options: [
        'Because Copper is an electrical insulator',
        'Because Copper is a good conductor that allows electricity to flow easily',
        'Because Copper glows in the dark',
        'Because Copper is magnetic'
      ],
      ans: 'Because Copper is a good conductor that allows electricity to flow easily'
    },
    {
      id: 4,
      q: 'What is the main difference between Series and Parallel circuits?',
      options: [
        'In Series, electricity has 1 path; in Parallel, electricity has multiple branch paths',
        'Series circuits operate without batteries',
        'Parallel circuits use rubber wires',
        'Series circuits are only used in computers'
      ],
      ans: 'In Series, electricity has 1 path; in Parallel, electricity has multiple branch paths'
    },
    {
      id: 5,
      q: 'Which material is a safe electrical INSULATOR used to coat wire handles?',
      options: ['Aluminum', 'Rubber / Plastic', 'Copper', 'Iron'],
      ans: 'Rubber / Plastic'
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-600 p-8 text-white shadow-xl shadow-amber-500/10">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-yellow-200" /> Science Academy • Grade 4 Physics & Energy
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Electricity & Simple Circuits ⚡🔋
          </h1>
          <p className="text-amber-100 text-sm md:text-base max-w-2xl font-medium">
            Electricity powers our modern world! Explore circuit components, conductors, insulators, series vs parallel connections, and electrical safety.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={() => speakText("Electricity and Simple Circuits. Electricity is the flow of tiny charged particles called electrons. A circuit must be a complete closed loop for current to flow.")}
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
          
          {/* Top Featured Infographic Poster */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-md">
                  Visual Learning Guide • Circuit Diagram Chart
                </span>
                <h3 className="text-2xl font-black text-slate-800 mt-2 flex items-center gap-2">
                  <span>🖼️</span> Electricity & Circuits Infographic Chart
                </h3>
                <p className="text-slate-500 text-xs mt-1">
                  Click the poster below to expand into full high-resolution view with conductors, series/parallel circuits, and safety.
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white font-extrabold text-xs shadow-md shadow-amber-500/20 hover:bg-amber-700 transition-all flex items-center gap-2 cursor-pointer shrink-0"
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
                src="/electricity_infographic.jpg?v=10" 
                alt="Electricity and Circuits Infographic Poster" 
                className="max-w-full h-auto rounded-xl shadow-md border border-white max-h-[650px] object-contain group-hover:scale-101 transition-transform"
              />
              <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl backdrop-blur-[2px]">
                <span className="px-6 py-3 bg-white text-slate-900 font-black text-xs rounded-2xl shadow-xl flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-amber-600" /> Click to Expand & Zoom Image
                </span>
              </div>
            </div>
          </div>
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
              {(currentComponentData?.details || []).map((d, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-medium leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{d}</span>
                </div>
              ))}
            </div>
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
              src="/electricity_infographic.jpg?v=10" 
              alt="Electricity Infographic" 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2 border-slate-700/50 object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
