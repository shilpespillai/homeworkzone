import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  RotateCcw, 
  Award, 
  X,
  Flame,
  Sun,
  Thermometer,
  Zap,
  ShieldCheck,
  Waves
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HeatAndThermalEnergyHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTransfer, setSelectedTransfer] = useState('conduction');
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

  // 3 Modes of Heat Transfer
  const heatTransfers = [
    {
      id: 'conduction',
      name: '1. Conduction (Direct Contact)',
      icon: '🍳',
      medium: 'Solids (Metals are best)',
      summary: 'Heat energy transfers through direct physical contact. Fast-moving, energetic particles collide with and pass energy to neighboring particles.',
      details: [
        'Occurs primarily in solid materials where particles are packed tightly together.',
        'Metals (copper, aluminum, iron, steel) have free electrons and are superior thermal conductors.',
        'Real-world examples: Metal spoon getting hot in soup, ironing clothes, pan heating on a stove, bare feet walking on hot sand.'
      ]
    },
    {
      id: 'convection',
      name: '2. Convection (Fluid Circulation)',
      icon: '🌊',
      medium: 'Liquids & Gases (Fluids)',
      summary: 'Heat transfers through the bulk movement of fluids. Warm fluid expands, becomes less dense, and rises; cooler, denser fluid sinks, creating a continuous Convection Current.',
      details: [
        'Occurs exclusively in liquids and gases (fluids) where particles can move freely.',
        'Warm air rising above a room heater or campfire is driven by thermal buoyancy.',
        'Real-world examples: Water boiling in a pot, warm air rising from a heater, sea breezes at the beach, hot-air balloons soaring.'
      ]
    },
    {
      id: 'radiation',
      name: '3. Radiation (Electromagnetic Waves)',
      icon: '☀️',
      medium: 'No Medium Required (Empty Space)',
      summary: 'Heat travels across distances as invisible infrared electromagnetic waves. It does not require physical contact or a material medium.',
      details: [
        'Can travel through the vacuum of outer space (how solar heat reaches Earth across 150 million km).',
        'Dark, dull surfaces absorb radiation best; light, shiny surfaces reflect radiation.',
        'Real-world examples: Sunlight warming Earth, feeling warmth from a campfire without touching it, heat lamps keeping food warm.'
      ]
    }
  ];

  // Conductors vs Insulators
  const conductorsInsulators = [
    { type: 'Thermal Conductors (Pass Heat Quickly)', desc: 'Materials that allow thermal energy to transfer rapidly through them.', items: 'Copper, Aluminum, Iron, Steel, Metal spoons, Metal saucepans', color: 'bg-rose-50 border-rose-200 text-rose-900' },
    { type: 'Thermal Insulators (Slow Down Heat)', desc: 'Materials that impede and slow down the transfer of thermal energy.', items: 'Wood, Plastic, Rubber, Wool, Foam, Fabric, Air pockets, Oven mitts', color: 'bg-blue-50 border-blue-200 text-blue-900' }
  ];

  // Everyday Uses
  const everydayUses = [
    { item: 'Saucepan 🍲', desc: 'Metal base conducts heat rapidly to cook food; plastic or wooden handle insulates hands from burns.' },
    { item: 'Thermos Flask 🧪', desc: 'Double-walled vacuum insulation blocks conduction, convection, and radiation to keep drinks hot or cold for hours.' },
    { item: 'Winter Jacket 🧥', desc: 'Traps pockets of still air within wool/down fibers to prevent body heat from escaping into cold air.' },
    { item: 'Oven Mitt 🥊', desc: 'Thick fabric insulator protects hands when grabbing hot baking trays.' },
    { item: 'House Insulation 🏠', desc: 'Fiberglass or foam layers in walls and ceilings reduce heat entry in summer and heat loss in winter.' }
  ];

  // Key Temperature Benchmark Values
  const tempBenchmarks = [
    { label: 'Water Freezing Point 🧊', temp: '0°C', desc: 'Liquid water turns into solid ice (Freezing).' },
    { label: 'Room Temperature 🛋️', temp: '20°C – 22°C', desc: 'Comfortable indoor ambient temperature.' },
    { label: 'Human Body Temperature 🌡️', temp: '37°C', desc: 'Normal healthy internal body temperature.' },
    { label: 'Water Boiling Point 💨', temp: '100°C', desc: 'Liquid water boils and rapidly turns into steam/water vapour at sea level.' }
  ];

  // Quiz Questions
  const quizQuestions = [
    {
      id: 1,
      q: 'What is the Golden Rule regarding the direction of Heat Transfer?',
      options: [
        'Heat ALWAYS moves from warmer objects to cooler objects',
        'Cold moves into warm objects',
        'Heat moves randomly in all directions equally',
        'Heat stays inside cold objects'
      ],
      ans: 'Heat ALWAYS moves from warmer objects to cooler objects'
    },
    {
      id: 2,
      q: 'Which mode of heat transfer occurs when a metal spoon sitting in hot soup gets hot through direct particle contact?',
      options: ['Convection', 'Radiation', 'Conduction', 'Evaporation'],
      ans: 'Conduction'
    },
    {
      id: 3,
      q: 'How does solar heat energy travel through the empty vacuum of space from the Sun to Earth?',
      options: ['Conduction', 'Convection', 'Radiation', 'Friction'],
      ans: 'Radiation'
    },
    {
      id: 4,
      q: 'Why are saucepan handles made of Wood or Plastic instead of Metal?',
      options: [
        'Wood and plastic are Thermal Insulators that prevent heat from burning your hand',
        'Metal is too soft to hold',
        'Wood and plastic make food cook faster',
        'Metal handles melt in water'
      ],
      ans: 'Wood and plastic are Thermal Insulators that prevent heat from burning your hand'
    },
    {
      id: 5,
      q: 'What happens to the particles inside a solid object when it is HEATED?',
      options: [
        'Particles move faster, vibrate rapidly, and spread further apart (Expand)',
        'Particles stop moving completely',
        'Particles shrink and get heavier',
        'Particles disappear'
      ],
      ans: 'Particles move faster, vibrate rapidly, and spread further apart (Expand)'
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

  const currentTransferData = heatTransfers.find(t => t.id === selectedTransfer) || heatTransfers[0];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-rose-600 to-amber-700 p-8 text-white shadow-xl shadow-orange-500/10">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-yellow-200" /> Science Academy • Grade 4 Physical Science
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Heat & Thermal Energy 🌡️🔥
          </h1>
          <p className="text-orange-100 text-sm md:text-base max-w-3xl font-medium leading-relaxed">
            Heat is thermal energy transferred from warmer objects to cooler objects. Discover how conduction, convection, and radiation move heat, change state, and cause thermal expansion!
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={() => speakText("Heat and Thermal Energy. How heat moves and changes materials. Heat is thermal energy transferred from a warmer object to a cooler object. Heat transfers in three ways: Conduction through direct contact, Convection through liquids and gases, and Radiation through electromagnetic waves.")}
              className="px-4 py-2 rounded-xl bg-white text-orange-950 font-extrabold text-xs flex items-center gap-2 hover:bg-orange-50 transition-all shadow-md cursor-pointer"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-orange-600" />}
              {isPlayingAudio ? 'Stop Audio' : 'Listen to Overview'}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-orange-900/60 hover:bg-orange-900/80 text-white font-extrabold text-xs flex items-center gap-2 border border-orange-400/30 transition-all cursor-pointer"
            >
              🖼️ View Full Infographic Chart
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: '3 Ways Heat Transfers', icon: '🔥' },
          { id: 'infographic', label: 'Full Infographic Chart', icon: '🖼️' },
          { id: 'conductors', label: 'Conductors & Insulators', icon: '🍳' },
          { id: 'expansion', label: 'Expansion & Contraction', icon: '🎈' },
          { id: 'measuring', label: 'Temperature & Benchmarks', icon: '🌡️' },
          { id: 'quiz', label: 'Knowledge Check Quiz', icon: '🏆' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20 scale-102'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* ==================================== TAB 1: 3 WAYS HEAT TRANSFERS ==================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Quick Banner */}
          <div className="bg-gradient-to-r from-orange-500 to-rose-600 rounded-2xl p-4 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔥</span>
              <div>
                <h4 className="font-extrabold text-sm">Official Heat & Thermal Energy Infographic Included</h4>
                <p className="text-orange-100 text-xs">View the high-resolution infographic chart detailing conduction, convection, radiation, state changes, and thermal equilibrium.</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('infographic')}
              className="px-4 py-2 rounded-xl bg-white text-orange-950 font-black text-xs hover:bg-orange-50 transition-all shrink-0 cursor-pointer shadow-sm"
            >
              View Infographic Chart →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {heatTransfers.map((t) => (
              <div 
                key={t.id} 
                onClick={() => setSelectedTransfer(t.id)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-2 relative group ${
                  selectedTransfer === t.id ? 'bg-orange-600 border-orange-600 text-white shadow-lg scale-102' : 'bg-white border-slate-200 hover:border-orange-300'
                }`}
              >
                <div className="text-3xl">{t.icon}</div>
                <h3 className={`font-black text-sm ${selectedTransfer === t.id ? 'text-white' : 'text-slate-800'}`}>{t.name}</h3>
                <div className={`text-[10px] font-bold ${selectedTransfer === t.id ? 'text-orange-100' : 'text-orange-600'}`}>{t.medium}</div>
              </div>
            ))}
          </div>

          {/* Interactive Heat Transfer Detail Panel */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentTransferData.icon}</span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-orange-700 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
                    Physics Mechanism • {currentTransferData.medium}
                  </span>
                  <h2 className="text-2xl font-black text-slate-800 mt-1">{currentTransferData.name}</h2>
                </div>
              </div>
              <button
                onClick={() => speakText(`${currentTransferData.name}. Medium: ${currentTransferData.medium}. ${currentTransferData.summary}. ${currentTransferData.details.join(' ')}`)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-orange-100 hover:text-orange-800 transition-all cursor-pointer"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-orange-700">Scientific Principle</div>
              <div className="font-bold text-orange-950 text-xs md:text-sm leading-relaxed">{currentTransferData.summary}</div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Key Physical Characteristics</h4>
              {currentTransferData.details.map((d, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-medium leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
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
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
                Official Visual Reference
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">Heat and Thermal Energy Infographic</h2>
              <p className="text-slate-500 text-xs mt-1">Official high-resolution diagram detailing heat vs temperature, conduction, convection, radiation, state changes, and expansion.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 hover:bg-orange-700 transition-all flex items-center gap-2 cursor-pointer"
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
              src="/heat_and_thermal_energy_infographic.jpg" 
              alt="Heat and Thermal Energy Infographic Chart" 
              className="max-w-full h-auto rounded-xl shadow-lg border border-white max-h-[800px] object-contain group-hover:scale-101 transition-transform"
            />
          </div>
        </div>
      )}

      {/* ==================================== TAB: CONDUCTORS & INSULATORS ==================================== */}
      {activeTab === 'conductors' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {conductorsInsulators.map((ci, idx) => (
              <div key={idx} className={`p-6 rounded-3xl border ${ci.color} space-y-3`}>
                <h3 className="font-black text-lg">{ci.type}</h3>
                <p className="text-xs leading-relaxed font-medium">{ci.desc}</p>
                <div className="p-3 bg-white/80 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800">
                  Examples: {ci.items}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-xl text-slate-800">Everyday Engineering Applications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {everydayUses.map((u, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-black text-sm text-orange-950">{u.item}</div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{u.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB: EXPANSION & CONTRACTION ==================================== */}
      {activeTab === 'expansion' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-black text-orange-800 text-lg flex items-center gap-2">
                <span>🎈</span> Thermal Expansion (Heating)
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                When materials are <strong>heated</strong>, particles gain kinetic energy, move faster, and spread further apart. This causes solids, liquids, and gases to <strong>expand</strong> in volume!
              </p>
              <div className="p-3 bg-orange-50 rounded-xl text-xs font-bold text-orange-950">
                Examples: Expansion gaps built into metal railway tracks, hot-air balloons rising as heated air expands.
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-black text-blue-800 text-lg flex items-center gap-2">
                <span>🧊</span> Thermal Contraction (Cooling)
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                When materials are <strong>cooled</strong>, particles lose kinetic energy, move more slowly, and pull closer together. This causes materials to <strong>contract</strong> (shrink in volume).
              </p>
              <div className="p-3 bg-blue-50 rounded-xl text-xs font-bold text-blue-950">
                Example: Running a tight metal jar lid under hot water causes the metal to expand slightly, breaking the seal so it opens easily!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB: MEASURING TEMPERATURE ==================================== */}
      {activeTab === 'measuring' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
                Degrees Celsius (°C)
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">Temperature Benchmarks</h2>
              <p className="text-slate-500 text-xs mt-1">Thermometers measure temperature (average particle kinetic energy), not total heat content.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {tempBenchmarks.map((tb, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="font-black text-sm text-slate-900">{tb.label}</div>
                  <div className="px-3 py-1 rounded-xl bg-orange-600 text-white font-black text-lg inline-block">{tb.temp}</div>
                  <p className="text-xs text-slate-600 font-medium pt-1">{tb.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB: QUIZ ==================================== */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-800">Heat Knowledge Check</h2>
              <p className="text-slate-500 text-xs mt-1">Test your understanding of conduction, convection, radiation, and thermal insulators.</p>
            </div>
            {quizScore !== null && (
              <div className="px-4 py-2 rounded-2xl bg-orange-100 text-orange-800 font-black text-sm flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-600" /> Score: {quizScore} / {quizQuestions.length}
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
                          ? 'bg-orange-600 border-orange-600 text-white shadow-sm'
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
              className="px-6 py-2.5 rounded-xl bg-orange-600 text-white font-extrabold text-xs shadow-lg shadow-orange-500/20 disabled:opacity-40 cursor-pointer"
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
              <span className="p-2 rounded-xl bg-orange-500/20 text-orange-400 font-bold text-xs">
                🖼️ Full Chart View
              </span>
              <div>
                <h3 className="font-extrabold text-white text-sm">Heat and Thermal Energy Infographic</h3>
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
              src="/heat_and_thermal_energy_infographic.jpg" 
              alt="Heat and Thermal Energy Infographic" 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2 border-slate-700/50 object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
