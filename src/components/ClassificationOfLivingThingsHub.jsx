import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  RotateCcw, 
  Award, 
  X,
  ShieldCheck,
  HeartPulse,
  Search,
  Magnet,
  Zap,
  Globe,
  ZoomIn,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ClassificationOfLivingThingsHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedGroup, setSelectedGroup] = useState('mammals');
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

  // 5 Main Vertebrate Groups Data
  const vertebrateGroups = [
    {
      id: 'mammals',
      num: '1',
      name: 'Mammals',
      icon: '🦁',
      blood: 'Warm-Blooded (Endothermic)',
      skin: 'Hair or Fur covering body',
      reproduction: 'Give birth to live young & produce milk',
      color: 'bg-amber-50 border-amber-200 text-amber-900',
      badgeBg: 'bg-amber-600 text-white',
      examples: 'Lions, humans, kangaroos, blue whales, dogs, bats.',
      keyCharacteristics: [
        'Breathe air through lungs.',
        'Mothers produce milk from mammary glands to feed babies.',
        'Regulate internal body temperature constantly regardless of weather.'
      ]
    },
    {
      id: 'birds',
      num: '2',
      name: 'Birds',
      icon: '🦅',
      blood: 'Warm-Blooded (Endothermic)',
      skin: 'Feathers and light, hollow bones',
      reproduction: 'Lay hard-shelled eggs',
      color: 'bg-sky-50 border-sky-200 text-sky-900',
      badgeBg: 'bg-sky-600 text-white',
      examples: 'Eagles, penguins, parrots, ostriches, owls.',
      keyCharacteristics: [
        'Have wings and beak (no teeth).',
        'Lightweight hollow bones designed for flight.',
        'Lay hard, waterproof calcium eggs in nests.'
      ]
    },
    {
      id: 'reptiles',
      num: '3',
      name: 'Reptiles',
      icon: '🐊',
      blood: 'Cold-Blooded (Ectothermic)',
      skin: 'Dry, scaly waterproof skin',
      reproduction: 'Lay leathery soft-shelled eggs on land',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      badgeBg: 'bg-emerald-600 text-white',
      examples: 'Crocodiles, snakes, lizards, turtles, tortoises.',
      keyCharacteristics: [
        'Breathe air using lungs.',
        'Body temperature relies on sun and shade environment.',
        'Scales prevent moisture loss in dry environments.'
      ]
    },
    {
      id: 'amphibians',
      num: '4',
      name: 'Amphibians',
      icon: '🐸',
      blood: 'Cold-Blooded (Ectothermic)',
      skin: 'Moist, permeable skin (no scales)',
      reproduction: 'Lay jelly-like eggs in water',
      color: 'bg-lime-50 border-lime-200 text-lime-900',
      badgeBg: 'bg-lime-600 text-white',
      examples: 'Frogs, toads, salamanders, newts.',
      keyCharacteristics: [
        'Undergo metamorphosis: tadpoles hatch with gills in water; adults develop lungs on land.',
        'Can absorb oxygen directly through moist skin.',
        'Must remain near moist habitats to prevent drying out.'
      ]
    },
    {
      id: 'fish',
      num: '5',
      name: 'Fish',
      icon: '🐟',
      blood: 'Cold-Blooded (Ectothermic)',
      skin: 'Scales and slimy mucus layer',
      reproduction: 'Lay soft eggs in water',
      color: 'bg-blue-50 border-blue-200 text-blue-900',
      badgeBg: 'bg-blue-600 text-white',
      examples: 'Sharks, salmon, clownfish, goldfish, tuna.',
      keyCharacteristics: [
        'Live entirely in water.',
        'Breathe dissolved oxygen from water using gills.',
        'Use fins and streamlined bodies for swimming.'
      ]
    }
  ];

  // 5 Kingdoms Data
  const kingdoms = [
    { name: 'Animal Kingdom (Animalia)', icon: '🐘', desc: 'Multicellular organisms that ingest food and move actively.' },
    { name: 'Plant Kingdom (Plantae)', icon: '🌻', desc: 'Multicellular plants that produce food via photosynthesis.' },
    { name: 'Fungi Kingdom', icon: '🍄', desc: 'Mushrooms, yeast, and moulds that absorb nutrients from decaying organic matter.' },
    { name: 'Protist Kingdom (Protista)', icon: '🔬', desc: 'Single-celled microscopic organisms like amoeba and algae.' },
    { name: 'Monera / Bacteria Kingdom', icon: '🧫', desc: 'Microscopic single-celled prokaryotes with no membrane-bound nucleus.' }
  ];

  // Quiz Questions
  const quizQuestions = [
    {
      id: 1,
      q: 'Which group of vertebrates are warm-blooded, covered in fur/hair, and feed live young with milk?',
      options: ['Reptiles', 'Amphibians', 'Mammals', 'Fish'],
      ans: 'Mammals'
    },
    {
      id: 2,
      q: 'Which animals undergo metamorphosis—hatching as aquatic tadpoles with gills before developing lungs as adults?',
      options: ['Birds', 'Amphibians', 'Reptiles', 'Mammals'],
      ans: 'Amphibians'
    },
    {
      id: 3,
      q: 'What main body feature distinguishes Vertebrates from Invertebrates?',
      options: ['Scales', 'Wings', 'Backbone (Spine)', 'Legs'],
      ans: 'Backbone (Spine)'
    },
    {
      id: 4,
      q: 'Which kingdom of living things contains green plants that produce their own food using sunlight?',
      options: ['Animalia', 'Plantae', 'Fungi', 'Monera'],
      ans: 'Plantae'
    },
    {
      id: 5,
      q: 'Are Crocodiles and Turtles warm-blooded or cold-blooded reptiles?',
      options: ['Warm-blooded', 'Cold-blooded', 'Both', 'Neither'],
      ans: 'Cold-blooded'
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

  const currentGroupData = vertebrateGroups.find(g => g.id === selectedGroup) || vertebrateGroups[0];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 p-8 text-white shadow-xl shadow-emerald-500/10">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-yellow-300" /> Science Academy • Grade 4 Biological Science
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Classification of Animals & Living Things 🦁🌱
          </h1>
          <p className="text-emerald-100 text-sm md:text-base max-w-2xl font-medium">
            Scientists classify living things into kingdoms and groups using evidence such as body coverings, backbones, reproduction, and habitats!
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={() => speakText("Classification of Animals and Living Things. Scientists classify living things by their physical features. The 5 main vertebrate groups are Mammals, Birds, Fish, Reptiles, and Amphibians.")}
              className="px-4 py-2 rounded-xl bg-white text-emerald-900 font-extrabold text-xs flex items-center gap-2 hover:bg-emerald-50 transition-all shadow-md cursor-pointer"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
              {isPlayingAudio ? 'Stop Audio' : 'Listen to Overview'}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-800/60 hover:bg-emerald-800/80 text-white font-extrabold text-xs flex items-center gap-2 border border-emerald-400/30 transition-all cursor-pointer"
            >
              🖼️ View Full Infographic Chart
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: '5 Vertebrate Groups', icon: '🐾' },
          { id: 'infographic', label: 'Full Infographic Chart', icon: '🖼️' },
          { id: 'kingdoms', label: 'The 5 Kingdoms', icon: '🌿' },
          { id: 'backbone', label: 'Vertebrates vs Invertebrates', icon: '🦴' },
          { id: 'living', label: 'Living vs Non-Living & Magnets', icon: '🌱' },
          { id: 'quiz', label: 'Knowledge Check Quiz', icon: '🏆' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-102'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* ==================================== TAB 1: 5 VERTEBRATE GROUPS ==================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Top Featured Infographic Poster */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-md">
                  Visual Learning Guide • Animal Taxonomy Chart
                </span>
                <h3 className="text-2xl font-black text-slate-800 mt-2 flex items-center gap-2">
                  <span>🖼️</span> Classification of Living Things Infographic Chart
                </h3>
                <p className="text-slate-500 text-xs mt-1">
                  Click the poster below to expand into full high-resolution view with Mammals, Birds, Reptiles, Amphibians, and Fish.
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center gap-2 cursor-pointer shrink-0"
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
                src="/classification_of_living_things_infographic.jpg" 
                alt="Classification of Living Things Infographic Poster" 
                className="max-w-full h-auto rounded-xl shadow-md border border-white max-h-[650px] object-contain group-hover:scale-101 transition-transform"
              />
              <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl backdrop-blur-[2px]">
                <span className="px-6 py-3 bg-white text-slate-900 font-black text-xs rounded-2xl shadow-xl flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-emerald-600" /> Click to Expand & Zoom Image
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {vertebrateGroups.map((g) => (
              <div 
                key={g.id} 
                onClick={() => setSelectedGroup(g.id)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-2 relative group ${
                  selectedGroup === g.id ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-102' : 'bg-white border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-7 h-7 rounded-xl font-black text-xs flex-center ${selectedGroup === g.id ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                    #{g.num}
                  </span>
                  <span className="text-2xl">{g.icon}</span>
                </div>
                <h3 className={`font-black text-sm ${selectedGroup === g.id ? 'text-white' : 'text-slate-800'}`}>{g.name}</h3>
                <div className={`text-[10px] font-bold ${selectedGroup === g.id ? 'text-emerald-100' : 'text-emerald-600'}`}>{g.bloodType}</div>
              </div>
            ))}
          </div>

          {/* Interactive Group Detail Panel */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentGroupData.icon}</span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                    Vertebrate Class #{currentGroupData.num} • {currentGroupData.bloodType}
                  </span>
                  <h2 className="text-2xl font-black text-slate-800 mt-1">{currentGroupData.name} Features</h2>
                </div>
              </div>
              <button
                onClick={() => speakText(`${currentGroupData.name}. Body covering: ${currentGroupData.covering}. Reproduction: ${currentGroupData.reproduction}. ${currentGroupData.traits.join(' ')}`)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800 transition-all cursor-pointer"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-semibold">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-amber-700">Body Covering</div>
                <div className="text-amber-950 font-bold">{currentGroupData.covering}</div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Reproduction</div>
                <div className="text-emerald-950 font-bold">{currentGroupData.reproduction}</div>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-blue-700">Famous Examples</div>
                <div className="text-blue-950 font-bold">{currentGroupData.examples}</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Key Biological Traits & Adaptations</h4>
              {currentGroupData.traits.map((trait, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-medium leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{trait}</span>
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
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                Official Visual Reference
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">Classification of Animals & Living Things Infographic</h2>
              <p className="text-slate-500 text-xs mt-1">Official high-resolution diagram detailing living vs non-living, 5 kingdoms, vertebrates, and classification evidence.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center gap-2 cursor-pointer"
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
              src="/classification_of_living_things_infographic.jpg" 
              alt="Classification of Animals and Living Things Infographic Chart" 
              className="max-w-full h-auto rounded-xl shadow-lg border border-white max-h-[800px] object-contain group-hover:scale-101 transition-transform"
            />
          </div>
        </div>
      )}

      {/* ==================================== TAB: THE 5 KINGDOMS ==================================== */}
      {activeTab === 'kingdoms' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
              Biological Taxonomy
            </span>
            <h2 className="text-2xl font-black text-slate-800 mt-1">The 5 Kingdoms of Living Things</h2>
            <p className="text-slate-500 text-xs mt-1">All living organisms on Earth are grouped into 5 broad kingdoms based on cell structure and nutrition!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fiveKingdoms.map((k, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <h3 className="font-black text-base text-slate-900">{k.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{k.desc}</p>
                <div className="pt-2 text-[11px] font-bold text-emerald-700">
                  Examples: <span className="font-normal text-slate-700">{k.ex}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================== TAB: VERTEBRATES VS INVERTEBRATES ==================================== */}
      {activeTab === 'backbone' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {backboneComparison.map((bc, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-black text-slate-800 text-lg">{bc.title}</h3>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-xs">{bc.count}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{bc.desc}</p>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-semibold">
                  <span className="text-emerald-700 font-bold">Key Examples: </span>{bc.ex}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================== TAB: LIVING VS NON-LIVING & MAGNETS ==================================== */}
      {activeTab === 'living' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-black text-emerald-800 text-base flex items-center gap-2">
                <span>🌱</span> Living Things (7 Life Processes)
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Living organisms move, respire (breathe), sense environment changes, grow, reproduce, excrete waste, and require nutrients (MRS GREN).
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-black text-rose-800 text-base flex items-center gap-2">
                <span>❌</span> Non-Living Things
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Objects that do not grow, do not breathe, do not reproduce, do not require food or water, and do not respond to their environment (e.g. rocks, cars, chairs).
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <Magnet className="w-6 h-6 text-indigo-600" />
              <h3 className="font-black text-lg text-slate-800">Bonus Science: Permanent Magnets vs Electromagnets 🧲</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-1">
                <div className="font-bold text-indigo-900">Permanent Magnets</div>
                <p className="text-indigo-800">Always magnetic, does not require electricity, cannot be turned off easily (e.g. Fridge magnets).</p>
              </div>
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 space-y-1">
                <div className="font-bold text-purple-900">Electromagnets</div>
                <p className="text-purple-800">Only magnetic when electric current flows. Can be switched ON/OFF and made stronger with more coil loops (e.g. Scrap-yard cranes).</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB: QUIZ ==================================== */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-800">Classification Knowledge Check</h2>
              <p className="text-slate-500 text-xs mt-1">Test your understanding of animal groups, backbones, and the 5 kingdoms.</p>
            </div>
            {quizScore !== null && (
              <div className="px-4 py-2 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-sm flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" /> Score: {quizScore} / {quizQuestions.length}
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
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
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
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 disabled:opacity-40 cursor-pointer"
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
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                🖼️ Full Chart View
              </span>
              <div>
                <h3 className="font-extrabold text-white text-sm">Classification of Animals and Living Things Infographic</h3>
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
              src="/classification_of_living_things_infographic.jpg" 
              alt="Classification of Animals and Living Things Infographic" 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2 border-slate-700/50 object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
