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
  Snowflake,
  Zap,
  Box,
  Droplets,
  Wind
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StatesOfMatterHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedState, setSelectedState] = useState('solid');
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

  // 3 Primary States of Matter
  const statesData = [
    {
      id: 'solid',
      num: '1',
      name: 'Solid',
      icon: '🧊',
      color: 'bg-blue-50 border-blue-200 text-blue-900',
      badgeBg: 'bg-blue-600 text-white',
      rule: 'Solids keep their own fixed shape and volume.',
      particleArrangement: 'Tightly packed in a fixed, regular lattice pattern.',
      particleMovement: 'Particles vibrate back and forth in fixed positions.',
      compressibility: 'Cannot be compressed easily.',
      flowability: 'Does not flow.',
      examples: 'Ice cubes, rocks, wooden blocks, pencils, metal spoons, solid chocolate bars.',
      keyCharacteristics: [
        'Has a definite, fixed shape that does not change on its own.',
        'Has a definite volume (takes up a specific amount of space).',
        'Strong attractive forces hold particles tightly together in place.',
        'Requires strong force or thermal heating to change form.'
      ]
    },
    {
      id: 'liquid',
      num: '2',
      name: 'Liquid',
      icon: '💧',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      badgeBg: 'bg-emerald-600 text-white',
      rule: 'Liquids flow and take the shape of their container.',
      particleArrangement: 'Close together in a random, loose arrangement.',
      particleMovement: 'Particles move, slide, and roll past each other.',
      compressibility: 'Hardly compressible.',
      flowability: 'Flows easily.',
      examples: 'Water, milk, fruit juice, cooking oil, honey, melted chocolate.',
      keyCharacteristics: [
        'Has no fixed shape—takes the exact shape of whatever container it is poured into.',
        'Has a definite fixed volume (1 Liter of water remains 1 Liter in any jar).',
        'Attractive forces are weaker than solids, allowing particles to slide.',
        'Forms a flat horizontal surface when left still under gravity.'
      ]
    },
    {
      id: 'gas',
      num: '3',
      name: 'Gas',
      icon: '💨',
      color: 'bg-purple-50 border-purple-200 text-purple-900',
      badgeBg: 'bg-purple-600 text-white',
      rule: 'Gases spread out to fill their entire container.',
      particleArrangement: 'Far apart with large empty spaces between particles.',
      particleMovement: 'Particles move very rapidly and freely in all directions.',
      compressibility: 'Can be compressed easily.',
      flowability: 'Flows and diffuses rapidly.',
      examples: 'Air, Oxygen (O₂), Water vapour, Helium (He), Carbon dioxide (CO₂).',
      keyCharacteristics: [
        'Has no fixed shape and no fixed volume.',
        'Expands completely to fill any sealed space or container.',
        'Attractive forces between particles are extremely weak.',
        'Can be squeezed into a smaller volume (compressed) because of empty space between particles.'
      ]
    }
  ];

  // Changes of State (Phase Transitions)
  const phaseChanges = [
    { name: 'Melting ☀️', process: 'Solid → Liquid', detail: 'Solid gains heat energy; particles vibrate faster and break out of fixed positions (e.g. Ice cube melting to water, solid chocolate melting).' },
    { name: 'Evaporation / Boiling ♨️', process: 'Liquid → Gas', detail: 'Liquid gains heat energy; surface particles gain enough energy to escape into invisible gas (e.g. Water boiling into steam).' },
    { name: 'Freezing ❄️', process: 'Liquid → Solid', detail: 'Liquid loses heat energy; particles slow down and lock into a fixed lattice structure (e.g. Water freezing into ice).' },
    { name: 'Condensation ☁️', process: 'Gas → Liquid', detail: 'Gas cools down and loses heat energy; fast particles slow down and cluster into liquid droplets (e.g. Steam forming water drops on cold glass).' },
    { name: 'Sublimation ⚡', process: 'Solid → Gas (Direct)', detail: 'Solid gains rapid heat energy and transforms directly into gas without becoming liquid first (e.g. Dry ice / solid CO₂).' },
    { name: 'Deposition 🌫️', process: 'Gas → Solid (Direct)', detail: 'Gas loses rapid heat energy and turns directly into solid without becoming liquid first (e.g. Frost forming on car windows in winter).' }
  ];

  // Key Science Vocabulary
  const vocabTerms = [
    { term: 'Matter', def: 'Anything that has mass and takes up space (everything around us!).' },
    { term: 'Particle', def: 'A tiny microscopic piece (atom or molecule) that makes up all matter.' },
    { term: 'State of Matter', def: 'The physical form of matter (Solid, Liquid, Gas, or Plasma).' },
    { term: 'Temperature', def: 'A scientific measure of how hot or cold something is (average kinetic energy).' },
    { term: 'Volume', def: 'The total amount of 3-dimensional space that matter occupies.' },
    { term: 'Mass', def: 'The amount of material or substance contained inside an object.' }
  ];

  // Quiz Questions
  const quizQuestions = [
    {
      id: 1,
      q: 'Which state of matter has a fixed shape and a fixed volume, with particles vibrating in fixed positions?',
      options: ['Gas', 'Liquid', 'Solid', 'Plasma'],
      ans: 'Solid'
    },
    {
      id: 2,
      q: 'What happens to the movement of particles when heat energy is added to matter?',
      options: [
        'Particles move faster and gain energy',
        'Particles stop moving completely',
        'Particles turn into water',
        'Particles move slower'
      ],
      ans: 'Particles move faster and gain energy'
    },
    {
      id: 3,
      q: 'Which process describes a Liquid losing heat energy and changing into a Solid?',
      options: ['Melting', 'Freezing', 'Evaporation', 'Sublimation'],
      ans: 'Freezing'
    },
    {
      id: 4,
      q: 'Why can Gases be compressed easily into smaller spaces?',
      options: [
        'Gas particles are very heavy',
        'Gas particles have large empty spaces between them',
        'Gas particles are locked in place',
        'Gases are always cold'
      ],
      ans: 'Gas particles have large empty spaces between them'
    },
    {
      id: 5,
      q: 'What is Plasma, the fourth state of matter?',
      options: [
        'A very cold frozen liquid',
        'A very hot, electrically charged state of matter found in stars and lightning',
        'Pure drinking water',
        'A type of solid rock'
      ],
      ans: 'A very hot, electrically charged state of matter found in stars and lightning'
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

  const currentStateData = statesData.find(s => s.id === selectedState) || statesData[0];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-yellow-300" /> Science Academy • Grade 4 Physical Science
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            States of Matter 🧊💧💨
          </h1>
          <p className="text-blue-100 text-sm md:text-base max-w-2xl font-medium">
            Everything around us is made of matter! Explore Solids, Liquids, Gases, Plasma, particle arrangements, and thermal phase changes.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={() => speakText("States of Matter. Everything around us is made of matter. The three main states of matter are Solid, Liquid, and Gas. Matter can change state when heated or cooled.")}
              className="px-4 py-2 rounded-xl bg-white text-blue-900 font-extrabold text-xs flex items-center gap-2 hover:bg-blue-50 transition-all shadow-md cursor-pointer"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
              {isPlayingAudio ? 'Stop Audio' : 'Listen to Overview'}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-800/60 hover:bg-blue-800/80 text-white font-extrabold text-xs flex items-center gap-2 border border-blue-400/30 transition-all cursor-pointer"
            >
              🖼️ View Full Infographic Chart
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Solid, Liquid & Gas', icon: '🧊' },
          { id: 'infographic', label: 'Full Infographic Chart', icon: '🖼️' },
          { id: 'changes', label: 'Changes of State', icon: '🔄' },
          { id: 'particles', label: 'Particle Behavior & Heat', icon: '⚡' },
          { id: 'plasma', label: 'Plasma & Science Vocab', icon: '🌩️' },
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

      {/* ==================================== TAB 1: 3 STATES ==================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Quick Banner */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🧊</span>
              <div>
                <h4 className="font-extrabold text-sm">Official States of Matter Chart Included</h4>
                <p className="text-indigo-100 text-xs">View the high-resolution infographic chart detailing solids, liquids, gases, particles, and phase changes.</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('infographic')}
              className="px-4 py-2 rounded-xl bg-white text-indigo-900 font-black text-xs hover:bg-indigo-50 transition-all shrink-0 cursor-pointer shadow-sm"
            >
              View Infographic Chart →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statesData.map((s) => (
              <div 
                key={s.id} 
                onClick={() => setSelectedState(s.id)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3 relative group ${
                  selectedState === s.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20 scale-102' : 'bg-white border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-8 h-8 rounded-xl font-black text-xs flex-center ${selectedState === s.id ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'}`}>
                    State #{s.num}
                  </span>
                  <span className="text-3xl">{s.icon}</span>
                </div>
                <h3 className={`font-black text-xl ${selectedState === s.id ? 'text-white' : 'text-slate-800'}`}>{s.name}</h3>
                <div className={`text-xs font-bold ${selectedState === s.id ? 'text-blue-100' : 'text-blue-600'}`}>{s.rule}</div>
              </div>
            ))}
          </div>

          {/* Interactive Detail Panel */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentStateData.icon}</span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                    Primary State #{currentStateData.num}
                  </span>
                  <h2 className="text-2xl font-black text-slate-800 mt-1">{currentStateData.name} Properties</h2>
                </div>
              </div>
              <button
                onClick={() => speakText(`${currentStateData.name}. ${currentStateData.rule}. Particle arrangement: ${currentStateData.particleArrangement}. Particle movement: ${currentStateData.particleMovement}.`)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-800 transition-all cursor-pointer"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-semibold">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-blue-700">Particle Spacing</div>
                <div className="text-blue-950 font-bold">{currentStateData.particleArrangement}</div>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-indigo-700">Particle Movement</div>
                <div className="text-indigo-950 font-bold">{currentStateData.particleMovement}</div>
              </div>
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 space-y-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-purple-700">Compressibility</div>
                <div className="text-purple-950 font-bold">{currentStateData.compressibility}</div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Everyday Examples</div>
                <div className="text-emerald-950 font-bold">{currentStateData.examples}</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Key Physical Characteristics</h4>
              {currentStateData.keyCharacteristics.map((kc, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-medium leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>{kc}</span>
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
              <h2 className="text-2xl font-black text-slate-800 mt-1">States of Matter Infographic Chart</h2>
              <p className="text-slate-500 text-xs mt-1">Official high-resolution diagram detailing solids, liquids, gases, plasma, particle model, and state changes.</p>
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
              src="/states_of_matter_infographic.jpg" 
              alt="States of Matter Infographic Chart" 
              className="max-w-full h-auto rounded-xl shadow-lg border border-white max-h-[800px] object-contain group-hover:scale-101 transition-transform"
            />
          </div>
        </div>
      )}

      {/* ==================================== TAB: CHANGES OF STATE ==================================== */}
      {activeTab === 'changes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                Thermal Transformations
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">6 Changes of State (Phase Changes)</h2>
              <p className="text-slate-500 text-xs mt-1">Matter changes state when thermal energy (heat) is added or removed!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {phaseChanges.map((pc, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-base text-slate-900">{pc.name}</h3>
                  </div>
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-900 font-extrabold text-xs inline-block">
                    {pc.process}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium pt-1">{pc.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB: PARTICLE BEHAVIOR & HEAT ==================================== */}
      {activeTab === 'particles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" /> Adding Heat (Heating)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              When matter is heated, thermal energy is converted into kinetic energy. Particles move faster, vibrate more vigorously, and spread further apart, overcoming attractive forces!
            </p>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-xs font-bold text-amber-900 space-y-1">
              <div>• Solid → Liquid (Melting)</div>
              <div>• Liquid → Gas (Evaporation / Boiling)</div>
              <div>• Solid → Gas (Sublimation)</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
              <Snowflake className="w-5 h-5 text-blue-500" /> Removing Heat (Cooling)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              When matter is cooled, thermal kinetic energy decreases. Particles move slower and pull closer together as attractive forces lock them back into structure!
            </p>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs font-bold text-blue-900 space-y-1">
              <div>• Liquid → Solid (Freezing)</div>
              <div>• Gas → Liquid (Condensation)</div>
              <div>• Gas → Solid (Deposition)</div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB: PLASMA & VOCAB ==================================== */}
      {activeTab === 'plasma' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-500" />
              <div>
                <h3 className="font-black text-xl text-slate-800">Plasma — The Fourth State of Matter 🌩️</h3>
                <p className="text-slate-500 text-xs">Very hot, supercharged gas where electrons are stripped away from atoms.</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-200 text-xs text-yellow-900 font-medium space-y-2">
              <div className="font-bold text-sm">Where is Plasma found?</div>
              <p>Plasma is rare in everyday life on Earth (except in lightning strikes, neon signs, and plasma TVs), but it is the <strong>most common state of matter in the universe</strong>—making up the Sun and all glowing stars!</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-slate-800 text-base">Key Science Vocabulary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {vocabTerms.map((vt, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-black text-sm text-blue-900">{vt.term}</div>
                  <div className="text-xs text-slate-600 font-medium">{vt.def}</div>
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
              <h2 className="text-xl font-black text-slate-800">States of Matter Knowledge Check</h2>
              <p className="text-slate-500 text-xs mt-1">Test your understanding of solids, liquids, gases, particles, and phase changes.</p>
            </div>
            {quizScore !== null && (
              <div className="px-4 py-2 rounded-2xl bg-blue-100 text-blue-800 font-black text-sm flex items-center gap-2">
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
                <h3 className="font-extrabold text-white text-sm">States of Matter Infographic</h3>
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
              src="/states_of_matter_infographic.jpg" 
              alt="States of Matter Infographic" 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2 border-slate-700/50 object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
