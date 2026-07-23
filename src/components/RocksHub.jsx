import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  RotateCcw, 
  Award, 
  X,
  Mountain,
  Layers,
  Flame,
  ShieldCheck,
  Search,
  Hammer
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RocksHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRockType, setSelectedRockType] = useState('igneous');
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

  // The 3 Main Rock Types
  const rockTypes = [
    {
      id: 'igneous',
      name: '1. Igneous Rocks 🔥',
      origin: 'Formed from cooled, hardened molten magma or lava',
      color: 'bg-rose-50 border-rose-200 text-rose-950',
      badgeBg: 'bg-rose-600 text-white',
      summary: 'Igneous rocks form when super-heated liquid rock (magma underground or lava above ground) cools down and solidifies into hard stone.',
      details: [
        'Intrusive Igneous (e.g. Granite): Cools slowly deep underground, forming large visible mineral crystals.',
        'Extrusive Igneous (e.g. Basalt, Pumice, Obsidian): Cools rapidly on Earth\'s surface after volcanic eruption, forming fine grains or glass.',
        'Characteristics: Extremely hard, tough, no distinct layers, rarely contains fossils.'
      ]
    },
    {
      id: 'sedimentary',
      name: '2. Sedimentary Rocks 🧱',
      origin: 'Formed from compressed and cemented layers of sediment',
      color: 'bg-amber-50 border-amber-200 text-amber-950',
      badgeBg: 'bg-amber-700 text-white',
      summary: 'Sedimentary rocks form over thousands of years as sand, mud, shells, and rock fragments are deposited in layers and squeezed together.',
      details: [
        'Formation Steps: Weathering → Erosion → Deposition → Compaction → Cementation.',
        'Examples: Sandstone, Limestone, Shale, Conglomerate.',
        'Special Feature: Almost ALL fossils are found in Sedimentary rocks!'
      ]
    },
    {
      id: 'metamorphic',
      name: '3. Metamorphic Rocks 🌋',
      origin: 'Formed when existing rocks are transformed by intense heat and pressure',
      color: 'bg-purple-50 border-purple-200 text-purple-950',
      badgeBg: 'bg-purple-700 text-white',
      summary: 'Metamorphic rocks are "changed rocks". Deep underground heat and crushing tectonic pressure alter pre-existing rocks into new, denser rocks.',
      details: [
        'Limestone transforms under heat & pressure into Marble 🏛️.',
        'Shale transforms under heat & pressure into Slate 🏠.',
        'Granite transforms under heat & pressure into Gneiss.',
        'Characteristics: Highly durable, often ribboned or crystalline texture.'
      ]
    }
  ];

  // Mohs Hardness Scale (1-10)
  const hardnessScale = [
    { rating: 1, mineral: 'Talc', desc: 'Softest mineral; easily scratched by fingernail' },
    { rating: 2, mineral: 'Gypsum', desc: 'Soft mineral; used in plasterboard' },
    { rating: 3, mineral: 'Calcite', desc: 'Scratched easily by a copper coin' },
    { rating: 4, mineral: 'Fluorite', desc: 'Scratched by a steel knife' },
    { rating: 5, mineral: 'Apatite', desc: 'Scratched by a glass plate' },
    { rating: 6, mineral: 'Feldspar / Pyrite', desc: 'Scratches glass; dull to metallic luster' },
    { rating: 7, mineral: 'Quartz 💎', desc: 'Very hard; abundant in sand and granite' },
    { rating: 8, mineral: 'Topaz', desc: 'Precious gemstone' },
    { rating: 9, mineral: 'Corundum (Ruby/Sapphire)', desc: 'Extremely hard gemstone' },
    { rating: 10, mineral: 'Diamond 💎✨', desc: 'Hardest known natural substance on Earth!' }
  ];

  // Australian Mineral Treasures
  const australianMinerals = [
    { name: 'Opal 💎', location: 'Lightning Ridge, NSW', desc: 'Australia\'s national gemstone! Formed when silica-rich water seeped into ancient marine fossils.' },
    { name: 'Gold 🪙', location: 'Kalgoorlie, WA', desc: 'High-purity precious metallic element mined extensively across Australia.' },
    { name: 'Iron Ore 🪨', location: 'Pilbara, WA', desc: 'Essential raw material for manufacturing steel, supporting global construction.' },
    { name: 'Uluru Sandstone ⛰️', location: 'Central NT', desc: 'A colossal arkosic sandstone monolith rising out of Australia\'s red center.' }
  ];

  // Quiz Questions
  const quizQuestions = [
    {
      id: 1,
      q: 'What is the main difference between a Rock and a Mineral?',
      options: [
        'A mineral is a pure natural substance; a rock is made of one or more minerals combined',
        'Rocks are always soft, minerals are liquid',
        'Minerals are made of wood; rocks are made of plastic',
        'There is no difference'
      ],
      ans: 'A mineral is a pure natural substance; a rock is made of one or more minerals combined'
    },
    {
      id: 2,
      q: 'In which category of rock are almost ALL prehistoric fossils discovered?',
      options: ['Sedimentary Rock (Sandstone/Limestone)', 'Igneous Rock (Granite/Basalt)', 'Volcanic Lava', 'Metamorphic Rock'],
      ans: 'Sedimentary Rock (Sandstone/Limestone)'
    },
    {
      id: 3,
      q: 'What is the HARDEST natural mineral on Earth according to the Mohs Hardness Scale (Rating 10)?',
      options: ['Diamond', 'Talc', 'Quartz', 'Calcite'],
      ans: 'Diamond'
    },
    {
      id: 4,
      q: 'Which rock type forms when existing limestone or shale is baked under intense underground heat and pressure?',
      options: ['Metamorphic Rock (Marble/Slate)', 'Igneous Rock', 'Sedimentary Rock', 'Magma'],
      ans: 'Metamorphic Rock (Marble/Slate)'
    },
    {
      id: 5,
      q: 'What is the scientific difference between Weathering and Erosion?',
      options: [
        'Weathering breaks rocks into pieces; Erosion carries and moves those pieces away',
        'Weathering melts rocks; Erosion turns rocks into ice',
        'Weathering is done by animals; Erosion is done by fire',
        'They are identical processes'
      ],
      ans: 'Weathering breaks rocks into pieces; Erosion carries and moves those pieces away'
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

  const currentRockData = rockTypes.find(r => r.id === selectedRockType) || rockTypes[0];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-800 via-zinc-800 to-amber-900 p-8 text-white shadow-xl shadow-stone-800/10">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-amber-300" /> Science Academy • Grade 4 Earth Science & Geology
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Rocks & Minerals: Earth's Building Blocks 🪨💎
          </h1>
          <p className="text-amber-100 text-sm md:text-base max-w-3xl font-medium leading-relaxed">
            Rocks tell the story of Earth! Discover how Igneous, Sedimentary, and Metamorphic rocks form, explore the Mohs Hardness Scale, and learn how minerals shape everyday items from smartphones to skyscrapers.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={() => speakText("Rocks and Minerals: Exploring Earth's Building Blocks. Rocks and minerals help us understand Earth. A rock is a natural solid made from one or more minerals. A mineral is a naturally occurring pure substance with its own specific color, hardness, and crystal shape. The three main rock types are Igneous, Sedimentary, and Metamorphic.")}
              className="px-4 py-2 rounded-xl bg-white text-stone-950 font-extrabold text-xs flex items-center gap-2 hover:bg-amber-50 transition-all shadow-md cursor-pointer"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-amber-700" />}
              {isPlayingAudio ? 'Stop Audio' : 'Listen to Overview'}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-stone-900/60 hover:bg-stone-900/80 text-white font-extrabold text-xs flex items-center gap-2 border border-amber-400/30 transition-all cursor-pointer"
            >
              🖼️ View Full Infographic Chart
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'The 3 Rock Types', icon: '🪨' },
          { id: 'infographic', label: 'Full Infographic Chart', icon: '🖼️' },
          { id: 'hardness', label: 'Mohs Hardness Scale (1-10)', icon: '💎' },
          { id: 'sedimentary', label: '6-Step Sedimentary Process', icon: '🧱' },
          { id: 'australian', label: 'Australian Rocks & Minerals', icon: '🦘' },
          { id: 'quiz', label: 'Knowledge Check Quiz', icon: '🏆' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-amber-800 text-white shadow-lg shadow-amber-700/20 scale-102'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* ==================================== TAB 1: THE 3 ROCK TYPES ==================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Quick Banner */}
          <div className="bg-gradient-to-r from-stone-800 to-zinc-900 rounded-2xl p-4 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🪨</span>
              <div>
                <h4 className="font-extrabold text-sm">Official Rocks & Minerals Infographic Included</h4>
                <p className="text-amber-100 text-xs">View the high-resolution infographic chart detailing rock properties, mineral identification, Mohs hardness, and the rock cycle.</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('infographic')}
              className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-black text-xs hover:bg-amber-400 transition-all shrink-0 cursor-pointer shadow-sm"
            >
              View Infographic Chart →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {rockTypes.map((r) => (
              <div 
                key={r.id} 
                onClick={() => setSelectedRockType(r.id)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-2 relative group ${
                  selectedRockType === r.id ? 'bg-amber-800 border-amber-800 text-white shadow-lg scale-102' : 'bg-white border-slate-200 hover:border-amber-300'
                }`}
              >
                <h3 className={`font-black text-base ${selectedRockType === r.id ? 'text-white' : 'text-slate-800'}`}>{r.name}</h3>
                <div className={`text-xs font-bold ${selectedRockType === r.id ? 'text-amber-100' : 'text-amber-800'}`}>{r.origin}</div>
              </div>
            ))}
          </div>

          {/* Interactive Rock Detail Panel */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  Geological Classification
                </span>
                <h2 className="text-2xl font-black text-slate-800 mt-1">{currentRockData.name}</h2>
              </div>
              <button
                onClick={() => speakText(`${currentRockData.name}. Origin: ${currentRockData.origin}. ${currentRockData.summary}. ${currentRockData.details.join(' ')}`)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-800 transition-all cursor-pointer"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-amber-800">Geological Formation</div>
              <div className="font-bold text-amber-950 text-xs md:text-sm leading-relaxed">{currentRockData.summary}</div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Key Rock Characteristics</h4>
              {currentRockData.details.map((d, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-medium leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
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
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md">
                Official Visual Reference
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">Rocks and Minerals Infographic</h2>
              <p className="text-slate-500 text-xs mt-1">Official high-resolution diagram detailing rock properties, mineral identification, Mohs scale, weathering, and Australian mining.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-800 text-white font-extrabold text-xs shadow-md shadow-amber-700/20 hover:bg-amber-900 transition-all flex items-center gap-2 cursor-pointer"
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
              src="/rocks_infographic.jpg" 
              alt="Rocks Infographic Chart" 
              className="max-w-full h-auto rounded-xl shadow-lg border border-white max-h-[800px] object-contain group-hover:scale-101 transition-transform"
            />
          </div>
        </div>
      )}

      {/* ==================================== TAB: MOHS HARDNESS SCALE ==================================== */}
      {activeTab === 'hardness' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md">
              Mineral Diagnostic Testing
            </span>
            <h2 className="text-2xl font-black text-slate-800 mt-1">Mohs Hardness Scale (1 to 10) 💎</h2>
            <p className="text-slate-500 text-xs mt-1">Measures a mineral's resistance to scratching. Rating 1 is softest; Rating 10 is hardest!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {hardnessScale.map((hs) => (
              <div key={hs.rating} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-xl bg-amber-800 text-white font-black text-sm shrink-0">
                  #{hs.rating}
                </span>
                <div>
                  <div className="font-extrabold text-xs text-slate-900">{hs.mineral}</div>
                  <div className="text-[11px] text-slate-600 font-medium">{hs.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================== TAB: SEDIMENTARY PROCESS ==================================== */}
      {activeTab === 'sedimentary' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-xl text-slate-800 flex items-center gap-2">
              <Layers className="w-6 h-6 text-amber-800" /> 6 Steps of Sedimentary Rock Formation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-semibold">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-1">
                <div className="font-black text-amber-950">1. Weathering 🌧️</div>
                <p className="text-slate-600 font-medium">Wind, rain, and ice break rocks into small pieces.</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-1">
                <div className="font-black text-amber-950">2. Erosion 🌊</div>
                <p className="text-slate-600 font-medium">Rivers and wind carry sediments away to lakes/oceans.</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-1">
                <div className="font-black text-amber-950">3. Deposition 🏖️</div>
                <p className="text-slate-600 font-medium">Sediments settle at the bottom in flat layers.</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-1">
                <div className="font-black text-amber-950">4. More Layers 🧱</div>
                <p className="text-slate-600 font-medium">Heavy new layers pile up over thousands of years.</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-1">
                <div className="font-black text-amber-950">5. Compaction 🗜️</div>
                <p className="text-slate-600 font-medium">Immense pressure squeezes water and air out.</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-1">
                <div className="font-black text-amber-950">6. Sedimentary Rock 🪨</div>
                <p className="text-slate-600 font-medium">Minerals cement the layers into solid rock!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB: AUSTRALIAN MINERALS ==================================== */}
      {activeTab === 'australian' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {australianMinerals.map((am, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-base text-amber-950">{am.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md">{am.location}</span>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{am.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* ==================================== TAB: QUIZ ==================================== */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-800">Rocks & Minerals Knowledge Check</h2>
              <p className="text-slate-500 text-xs mt-1">Test your understanding of rock classifications, Mohs hardness, and sedimentary formation.</p>
            </div>
            {quizScore !== null && (
              <div className="px-4 py-2 rounded-2xl bg-amber-100 text-amber-950 font-black text-sm flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-700" /> Score: {quizScore} / {quizQuestions.length}
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
                          ? 'bg-amber-800 border-amber-800 text-white shadow-sm'
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
              className="px-6 py-2.5 rounded-xl bg-amber-800 text-white font-extrabold text-xs shadow-lg shadow-amber-700/20 disabled:opacity-40 cursor-pointer"
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
                <h3 className="font-extrabold text-white text-sm">Rocks and Minerals Infographic</h3>
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
              src="/rocks_infographic.jpg" 
              alt="Rocks Infographic" 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2 border-slate-700/50 object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
