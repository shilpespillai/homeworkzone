import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  RotateCcw, 
  Award, 
  X,
  Magnet,
  Compass,
  Zap,
  ShieldCheck,
  Globe
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MagnetsHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPoleState, setSelectedPoleState] = useState('attract_ns');
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

  // Laws of Magnetism Interaction States
  const poleInteractions = [
    {
      id: 'attract_ns',
      name: 'North (N) + South (S)',
      action: 'ATTRACT 🧲',
      rule: 'Unlike / Opposite Poles Attract!',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-950',
      badgeBg: 'bg-emerald-600 text-white',
      summary: 'When a North pole faces a South pole, their magnetic field lines pull together, drawing the two magnets towards each other.',
      details: [
        'Opposite magnetic charges create an attractive force pulling magnets together.',
        'Invisible magnetic field lines flow out of the North pole and directly into the South pole.',
        'This pull force can work through air, water, paper, and thin glass without physical contact.'
      ]
    },
    {
      id: 'repel_nn',
      name: 'North (N) + North (N)',
      action: 'REPEL 💥',
      rule: 'Like / Same Poles Repel!',
      color: 'bg-rose-50 border-rose-200 text-rose-950',
      badgeBg: 'bg-rose-600 text-white',
      summary: 'When two North poles face each other, their magnetic field lines push apart, driving the magnets away from one another.',
      details: [
        'Identical poles create a pushing repulsion force.',
        'Field lines bend away from each other, creating a gap where magnetic force resists pushing them together.',
        'You can feel the physical resistance when trying to force two like poles together by hand.'
      ]
    },
    {
      id: 'repel_ss',
      name: 'South (S) + South (S)',
      action: 'REPEL 💥',
      rule: 'Like / Same Poles Repel!',
      color: 'bg-rose-50 border-rose-200 text-rose-950',
      badgeBg: 'bg-rose-600 text-white',
      summary: 'When two South poles face each other, they also experience strong magnetic repulsion and push apart.',
      details: [
        'Just like North-North, South-South poles cannot join together.',
        'Repulsion is a definitive test to prove an object is an active magnet (rather than just a magnetic metal).'
      ]
    }
  ];

  // Magnetic vs Non-Magnetic Materials
  const materialsList = [
    { type: 'Magnetic Materials ✓ (Attracted to Magnets)', items: 'Iron nails, Steel spoons, Paper clips, Safety pins, Steel bolts, Metal washers', note: 'Contains Ferrous metals like Iron, Steel, Nickel, or Cobalt.', color: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
    { type: 'Non-Magnetic Materials ✗ (NOT Attracted)', items: 'Plastic ruler, Wooden block, Glass cup, Rubber ball, Paper, Fabric, Aluminium drink can, Copper wire', note: 'Aluminium and Copper are non-magnetic metals!', color: 'bg-rose-50 border-rose-200 text-rose-900' }
  ];

  // Shapes of Magnets
  const magnetShapes = [
    { shape: 'Horseshoe Magnet 🧲', desc: 'U-shaped magnet that brings North and South poles close together for maximum concentrated pull.' },
    { shape: 'Bar Magnet 🧱', desc: 'Rectangular bar magnet with North at one end and South at the opposite end.' },
    { shape: 'Disc & Ring Magnets ⭕', desc: 'Flat circular magnets used in speakers, fridge doors, and magnetic toys.' },
    { shape: 'Compass Needle 🧭', desc: 'A lightweight magnetized needle mounted on a pivot that aligns with Earth\'s magnetic field.' }
  ];

  // Everyday Uses of Magnets
  const everydayUses = [
    { item: 'Compass Navigation 🧭', desc: 'The magnetized needle points toward Earth\'s Magnetic North Pole to guide travelers and ships.' },
    { item: 'Scrapyard Cranes (Electromagnets) 🏗️', desc: 'Giant electromagnets switched ON to lift tons of scrap metal, then switched OFF to drop it.' },
    { item: 'Loudspeakers & Headphones 🎧', desc: 'Permanent magnets and electromagnets vibrate a membrane to produce audible sound waves.' },
    { item: 'Refrigerator Door Seals 🚪', desc: 'Flexible magnetic strips inside rubber door gaskets keep fridge doors sealed tight.' }
  ];

  // Quiz Questions
  const quizQuestions = [
    {
      id: 1,
      q: 'What happens when a North Pole (N) of one magnet faces a South Pole (S) of another magnet?',
      options: ['They ATTRACT (pull together)', 'They REPEL (push apart)', 'They explode', 'Nothing happens'],
      ans: 'They ATTRACT (pull together)'
    },
    {
      id: 2,
      q: 'Which of the following metals is MAGNETIC and will be pulled by a magnet?',
      options: ['Iron / Steel nail', 'Aluminium drink can', 'Copper wire', 'Gold ring'],
      ans: 'Iron / Steel nail'
    },
    {
      id: 3,
      q: 'Where is the magnetic field of a bar magnet at its STRONGEST intensity?',
      options: ['Near the North and South Poles', 'In the exact center', 'Underneath the floor', '10 meters away'],
      ans: 'Near the North and South Poles'
    },
    {
      id: 4,
      q: 'What is the main advantage of an Electromagnet over a regular permanent magnet?',
      options: [
        'An electromagnet can be switched ON and OFF using electricity',
        'An electromagnet works underwater without wires',
        'An electromagnet does not have poles',
        'An electromagnet is made of glass'
      ],
      ans: 'An electromagnet can be switched ON and OFF using electricity'
    },
    {
      id: 5,
      q: 'Why does a compass needle always point toward the North direction on Earth?',
      options: [
        'Because Earth itself acts like a giant magnet with its own magnetic poles',
        'Because the Sun pulls the needle',
        'Because of wind pushing the needle',
        'Because the needle is made of wood'
      ],
      ans: 'Because Earth itself acts like a giant magnet with its own magnetic poles'
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

  const currentPoleData = poleInteractions.find(p => p.id === selectedPoleState) || poleInteractions[0];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-blue-700 p-8 text-white shadow-xl shadow-red-500/10">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-yellow-300" /> Science Academy • Grade 4 Physics & Magnetism
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Magnets & Magnetic Forces 🧲✨
          </h1>
          <p className="text-rose-100 text-sm md:text-base max-w-3xl font-medium leading-relaxed">
            Magnets produce invisible magnetic fields that attract ferrous metals. Learn the fundamental laws of magnetism: opposite poles attract, like poles repel, and Earth behaves like a giant magnet!
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={() => speakText("Magnets and Magnetic Forces. Attract, Repel, and Magnetic Strength. A magnet is an object that produces an invisible magnetic force that attracts certain metals. Every magnet has two poles: North Pole and South Pole. Opposite poles attract, while like poles repel.")}
              className="px-4 py-2 rounded-xl bg-white text-rose-950 font-extrabold text-xs flex items-center gap-2 hover:bg-rose-50 transition-all shadow-md cursor-pointer"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-rose-600" />}
              {isPlayingAudio ? 'Stop Audio' : 'Listen to Overview'}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-rose-900/60 hover:bg-rose-900/80 text-white font-extrabold text-xs flex items-center gap-2 border border-rose-400/30 transition-all cursor-pointer"
            >
              🖼️ View Full Infographic Chart
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Laws of Magnetism', icon: '🧲' },
          { id: 'infographic', label: 'Full Infographic Chart', icon: '🖼️' },
          { id: 'materials', label: 'Magnetic vs Non-Magnetic', icon: '📎' },
          { id: 'field', label: 'Magnetic Fields & Strength', icon: '🌐' },
          { id: 'electromagnets', label: 'Electromagnets & Uses', icon: '⚡' },
          { id: 'earth', label: 'Earth\'s Magnetic Field & Navigation', icon: '🧭' },
          { id: 'quiz', label: 'Knowledge Check Quiz', icon: '🏆' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20 scale-102'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* ==================================== TAB 1: LAWS OF MAGNETISM ==================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Quick Banner */}
          <div className="bg-gradient-to-r from-rose-600 to-blue-700 rounded-2xl p-4 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🧲</span>
              <div>
                <h4 className="font-extrabold text-sm">Official Magnets Infographic Included</h4>
                <p className="text-rose-100 text-xs">View the high-resolution infographic chart detailing magnet poles, magnetic fields, electromagnets, and attraction/repulsion rules.</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('infographic')}
              className="px-4 py-2 rounded-xl bg-white text-rose-950 font-black text-xs hover:bg-rose-50 transition-all shrink-0 cursor-pointer shadow-sm"
            >
              View Infographic Chart →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {poleInteractions.map((p) => (
              <div 
                key={p.id} 
                onClick={() => setSelectedPoleState(p.id)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-2 relative group ${
                  selectedPoleState === p.id ? 'bg-rose-600 border-rose-600 text-white shadow-lg scale-102' : 'bg-white border-slate-200 hover:border-rose-300'
                }`}
              >
                <h3 className={`font-black text-sm ${selectedPoleState === p.id ? 'text-white' : 'text-slate-800'}`}>{p.name}</h3>
                <div className={`text-[10px] font-bold ${selectedPoleState === p.id ? 'text-rose-100' : 'text-rose-600'}`}>{p.action} • {p.rule}</div>
              </div>
            ))}
          </div>

          {/* Interactive Pole Detail Panel */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                  Magnetic Law • {currentPoleData.rule}
                </span>
                <h2 className="text-2xl font-black text-slate-800 mt-1">{currentPoleData.name}: {currentPoleData.action}</h2>
              </div>
              <button
                onClick={() => speakText(`${currentPoleData.name}. Result: ${currentPoleData.action}. Rule: ${currentPoleData.rule}. ${currentPoleData.summary}. ${currentPoleData.details.join(' ')}`)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-rose-100 hover:text-rose-800 transition-all cursor-pointer"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-rose-700">Scientific Explanation</div>
              <div className="font-bold text-rose-950 text-xs md:text-sm leading-relaxed">{currentPoleData.summary}</div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Key Physics Rules</h4>
              {currentPoleData.details.map((d, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-medium leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
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
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
                Official Visual Reference
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">Magnets and Magnetic Forces Infographic</h2>
              <p className="text-slate-500 text-xs mt-1">Official high-resolution diagram detailing magnet poles, field lines, magnetic vs non-magnetic sorting, electromagnets, and compasses.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white font-extrabold text-xs shadow-md shadow-rose-500/20 hover:bg-rose-700 transition-all flex items-center gap-2 cursor-pointer"
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
              src="/magnets_infographic.jpg" 
              alt="Magnets Infographic Chart" 
              className="max-w-full h-auto rounded-xl shadow-lg border border-white max-h-[800px] object-contain group-hover:scale-101 transition-transform"
            />
          </div>
        </div>
      )}

      {/* ==================================== TAB: MAGNETIC VS NON-MAGNETIC ==================================== */}
      {activeTab === 'materials' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {materialsList.map((m, idx) => (
            <div key={idx} className={`p-6 rounded-3xl border ${m.color} space-y-3`}>
              <h3 className="font-black text-lg">{m.type}</h3>
              <div className="p-3 bg-white/80 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800">
                Examples: {m.items}
              </div>
              <p className="text-xs font-medium italic text-slate-600">{m.note}</p>
            </div>
          ))}
        </div>
      )}

      {/* ==================================== TAB: MAGNETIC FIELDS ==================================== */}
      {activeTab === 'field' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-xl text-slate-800 flex items-center gap-2">
              <Globe className="w-6 h-6 text-blue-600" /> Invisible Magnetic Fields
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              A magnetic field is the invisible area of force around a magnet. Magnetic field lines travel from the <strong>North pole to the South pole</strong>. The field lines are packed closest and are **strongest at the two poles**!
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-xl text-slate-800">Factors Affecting Magnetic Strength</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-semibold">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-black text-rose-900">1. Size</div>
                <p className="text-slate-600 font-normal">Larger magnets generally produce stronger magnetic fields.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-black text-rose-900">2. Thickness</div>
                <p className="text-slate-600 font-normal">Thicker magnets have more aligned magnetic domains.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-black text-rose-900">3. Distance</div>
                <p className="text-slate-600 font-normal">Closer distance = stronger pull; farther distance = weaker pull.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-black text-rose-900">4. Stacking</div>
                <p className="text-slate-600 font-normal">Stacking multiple magnets together increases total magnetic pull force.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB: ELECTROMAGNETS ==================================== */}
      {activeTab === 'electromagnets' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-yellow-500" />
              <div>
                <h3 className="font-black text-xl text-slate-800">Electromagnets (Temporary Controlled Magnets)</h3>
                <p className="text-slate-500 text-xs">A magnet made by coiling copper wire around an iron nail connected to a battery circuit.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-200 text-xs text-yellow-950 space-y-2">
              <div className="font-black text-sm">Key Superpower: Can be Switched ON and OFF!</div>
              <p>When electricity flows through the coiled wire, the iron nail turns into a powerful magnet. When the electric current is switched off, the magnetism stops immediately!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {everydayUses.map((u, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-black text-sm text-slate-900">{u.item}</div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{u.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB: EARTH'S MAGNETIC FIELD ==================================== */}
      {activeTab === 'earth' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Globe className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-black text-slate-800">Earth as a Giant Bar Magnet 🌍🧭</h2>
              <p className="text-slate-500 text-xs">Earth's molten liquid iron core generates a massive planetary magnetic field surrounding our globe.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-1">
              <div className="font-bold text-blue-900">Compass Navigation</div>
              <p className="text-blue-800">A compass needle is a tiny magnet. Its North-seeking pole ($N$) aligns with Earth\'s magnetic field lines, pointing toward Magnetic North.</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
              <div className="font-bold text-emerald-900">Animal Navigation (Magnetoreception)</div>
              <p className="text-emerald-800">Sea turtles, migratory birds, and homing pigeons have natural microscopic magnetic sensors in their brains, allowing them to sense Earth\'s magnetic field to navigate across oceans!</p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB: QUIZ ==================================== */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-800">Magnets Knowledge Check</h2>
              <p className="text-slate-500 text-xs mt-1">Test your understanding of magnetic poles, attraction/repulsion, magnetic materials, and electromagnets.</p>
            </div>
            {quizScore !== null && (
              <div className="px-4 py-2 rounded-2xl bg-rose-100 text-rose-800 font-black text-sm flex items-center gap-2">
                <Award className="w-5 h-5 text-rose-600" /> Score: {quizScore} / {quizQuestions.length}
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
                          ? 'bg-rose-600 border-rose-600 text-white shadow-sm'
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
              className="px-6 py-2.5 rounded-xl bg-rose-600 text-white font-extrabold text-xs shadow-lg shadow-rose-500/20 disabled:opacity-40 cursor-pointer"
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
              <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400 font-bold text-xs">
                🖼️ Full Chart View
              </span>
              <div>
                <h3 className="font-extrabold text-white text-sm">Magnets and Magnetic Forces Infographic</h3>
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
              src="/magnets_infographic.jpg" 
              alt="Magnets Infographic" 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2 border-slate-700/50 object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
