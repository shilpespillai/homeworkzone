import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  RotateCcw, 
  Award, 
  X,
  Search,
  Globe,
  Layers,
  ShieldCheck,
  Footprints,
  Flame,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FossilsHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFossilType, setSelectedFossilType] = useState('body');
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

  // 5 Main Types of Fossils
  const fossilTypes = [
    {
      id: 'body',
      name: '1. Body Fossils 🦴',
      icon: '🦴',
      description: 'Preserved actual physical remains of ancient living organisms.',
      summary: 'Body fossils consist of hard preserved parts of an organism, such as dinosaur bones, teeth, shells, and petrified leaf skeletons.',
      details: [
        'Hard animal tissues (bones, teeth, shells) fossilize much more easily than soft muscles or organs.',
        'Mineral-rich groundwater slowly replaces organic bone tissue cell-by-cell (Permineralisation).',
        'Examples: Tyrannosaurus rex skull, megalodon teeth, ammonite shells, petrified wood.'
      ]
    },
    {
      id: 'trace',
      name: '2. Trace Fossils 👣',
      icon: '👣',
      description: 'Preserved evidence of animal activities and behaviors.',
      summary: 'Trace fossils do not contain actual body parts, but preserve evidence of how ancient animals lived, walked, fed, and rested.',
      details: [
        'Include dinosaur footprints, tail drag marks, fossilized burrows, nests, and coprolites (fossil dung!).',
        'Provide scientists with valuable clues about animal weight, walking speed, stride length, and herd behavior.',
        'Preserved when mud or wet sand dries out and gets buried quickly under new sediment.'
      ]
    },
    {
      id: 'mould',
      name: '3. Mould Fossils 🪨',
      icon: '🪨',
      description: 'Hollow negative impression left in rock after the original organism dissolves.',
      summary: 'A mould fossil forms when an organism is buried in sediment, and its physical body slowly decays or dissolves away, leaving a hollow cavity shape behind.',
      details: [
        'Shows the outer surface texture and shape of the original shell or bone.',
        'Empty cavity inside rock acts as a natural mold.',
        'Commonly formed by ancient marine clams, sea urchins, and snail shells.'
      ]
    },
    {
      id: 'cast',
      name: '4. Cast Fossils 🏺',
      icon: '🐚',
      description: 'A 3D solid rock copy formed when minerals fill inside a mould cavity.',
      summary: 'When mineral-rich water seeps into a hollow mould fossil cavity and crystallizes, it forms a 3D solid replica or "cast" of the original organism.',
      details: [
        'Acts like plaster poured into a mold to create a solid statue.',
        'Duplicates the exact 3D shape and size of the original body part.',
        'Examples: Casts of trilobites, ammonites, and tree trunks.'
      ]
    },
    {
      id: 'amber',
      name: '5. Amber Fossils 🐝',
      icon: '🟨',
      description: 'Tree resin that traps and perfectly preserves delicate small organisms.',
      summary: 'Sticky tree sap captures small insects, spiders, or plant seeds. Over millions of years, the sap hardens into golden gemstone amber.',
      details: [
        'Preserves delicate soft-bodied organisms, including tiny wings, eyes, and hair fibers.',
        'Completely seals out oxygen and moisture, preventing decay.',
        'Scientists can study microscopic structures of prehistoric insects from 100 million years ago!'
      ]
    }
  ];

  // 8 Steps of Fossil Formation
  const formationSteps = [
    { step: '1. Organism Lives 🦕', desc: 'A dinosaur or prehistoric plant lives in a coastal or river environment.' },
    { step: '2. Organism Dies 💀', desc: 'The creature dies and its body falls into river mud, lake sediment, or ocean sand.' },
    { step: '3. Rapid Burial ⏳', desc: 'Soft tissues decay while hard bones/shells are quickly buried under layers of sand and silt before scavengers destroy them.' },
    { step: '4. Sediment Accumulation 🧱', desc: 'Over thousands of years, heavy new layers of mud and sand pile up on top, building immense pressure.' },
    { step: '5. Mineral Replacement 🔬', desc: 'Groundwater carrying dissolved silica and calcium seeps through, replacing bone material with solid rock minerals (Permineralisation).' },
    { step: '6. Rock Formation 🪨', desc: 'Sediment layers compress and cement into solid Sedimentary Rock (sandstone, limestone, or shale).' },
    { step: '7. Uplift & Erosion ⛰️', desc: 'Tectonic movement lifts rock layers; wind and water weather away top surface layers.' },
    { step: '8. Discovery by Paleontologists ⛏️', desc: 'Scientists discover the exposed fossil, carefully excavate it, and study Earth\'s ancient history!' }
  ];

  // Australian Mega-Fossils
  const australianFossils = [
    { name: 'Diprotodon 🦘', desc: 'The largest known marsupial to ever live! A giant plant-eating wombat the size of a hippopotamus.' },
    { name: 'Megalania 🦎', desc: 'A giant extinct predatory lizard that grew up to 7 meters long in prehistoric Australia.' },
    { name: 'Opalised Fossils 💎', desc: 'Rare Australian fossils (like marine plesiosaurs and shells at Lightning Ridge) that turned into sparkling gemstone opal!' },
    { name: 'Muttaburrasaurus 🦕', desc: 'A famous Australian herbivorous dinosaur discovered in Muttaburra, Queensland.' }
  ];

  // Quiz Questions
  const quizQuestions = [
    {
      id: 1,
      q: 'What is a Fossil?',
      options: [
        'The preserved remains, impression, or trace of a living thing from long ago',
        'A type of living tree',
        'A piece of plastic made in a factory',
        'A modern seashell found at the beach'
      ],
      ans: 'The preserved remains, impression, or trace of a living thing from long ago'
    },
    {
      id: 2,
      q: 'Which type of fossil preserves animal activity like footprints, burrows, and fossilized dung rather than body parts?',
      options: ['Body Fossil', 'Trace Fossil', 'Amber Fossil', 'Cast Fossil'],
      ans: 'Trace Fossil'
    },
    {
      id: 3,
      q: 'According to the Law of Superposition, where are the OLDEST fossil layers located in undisturbed sedimentary rock?',
      options: [
        'At the very BOTTOM layer',
        'At the top layer',
        'In the middle layer',
        'On trees'
      ],
      ans: 'At the very BOTTOM layer'
    },
    {
      id: 4,
      q: 'In which type of rock are almost all fossils found?',
      options: ['Sedimentary Rock (Sandstone/Limestone)', 'Volcanic Lava Rock', 'Diamond', 'Plastic'],
      ans: 'Sedimentary Rock (Sandstone/Limestone)'
    },
    {
      id: 5,
      q: 'What is the scientific title for a scientist who digs up and studies fossils to learn about ancient life?',
      options: ['Paleontologist', 'Astronaut', 'Electrician', 'Botanist'],
      ans: 'Paleontologist'
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

  const currentFossilData = fossilTypes.find(f => f.id === selectedFossilType) || fossilTypes[0];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-800 via-amber-900 to-yellow-900 p-8 text-white shadow-xl shadow-stone-800/10 border border-amber-800/50">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-amber-300" /> Science Academy • Grade 4 Earth & Historical Science
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Fossils: Discovering Earth's Ancient Life 🦴🦕
          </h1>
          <p className="text-amber-100 text-sm md:text-base max-w-3xl font-medium leading-relaxed">
            Fossils are time capsules buried in rock layers! Discover how body fossils, trace footprints, and amber resin preserve prehistoric life, revealing ancient oceans, forests, and extinct dinosaurs.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={() => speakText("Fossils: Discovering Earth's Ancient Life. Fossils tell the story of life on Earth. A fossil is the preserved remains, impression, or trace of a living thing that lived long ago. The five main types are Body fossils, Trace fossils, Mould fossils, Cast fossils, and Amber fossils.")}
              className="px-4 py-2 rounded-xl bg-white text-stone-900 font-extrabold text-xs flex items-center gap-2 hover:bg-amber-50 transition-all shadow-md cursor-pointer"
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
          { id: 'overview', label: '5 Types of Fossils', icon: '🦴' },
          { id: 'infographic', label: 'Full Infographic Chart', icon: '🖼️' },
          { id: 'formation', label: '8-Step Fossil Formation', icon: '⏳' },
          { id: 'layers', label: 'Rock Layers & Superposition', icon: '🧱' },
          { id: 'environments', label: 'Revealing Ancient Environments', icon: '🌊' },
          { id: 'australian', label: 'Australian Mega-Fossils', icon: '🦘' },
          { id: 'quiz', label: 'Knowledge Check Quiz', icon: '🏆' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-amber-700 text-white shadow-lg shadow-amber-600/20 scale-102'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* ==================================== TAB 1: 5 TYPES OF FOSSILS ==================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Quick Banner */}
          <div className="bg-gradient-to-r from-stone-800 to-amber-900 rounded-2xl p-4 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md border border-amber-800/30">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🦴</span>
              <div>
                <h4 className="font-extrabold text-sm">Official Fossils Infographic Included</h4>
                <p className="text-amber-100 text-xs">View the high-resolution infographic chart detailing body fossils, trace footprints, rock layer stratigraphy, and Australian megafauna.</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('infographic')}
              className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-black text-xs hover:bg-amber-400 transition-all shrink-0 cursor-pointer shadow-sm"
            >
              View Infographic Chart →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {fossilTypes.map((f) => (
              <div 
                key={f.id} 
                onClick={() => setSelectedFossilType(f.id)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-2 relative group ${
                  selectedFossilType === f.id ? 'bg-amber-700 border-amber-700 text-white shadow-lg scale-102' : 'bg-white border-slate-200 hover:border-amber-400'
                }`}
              >
                <div className="text-3xl">{f.icon}</div>
                <h3 className={`font-black text-sm ${selectedFossilType === f.id ? 'text-white' : 'text-slate-800'}`}>{f.name}</h3>
                <div className={`text-[10px] font-bold ${selectedFossilType === f.id ? 'text-amber-100' : 'text-amber-700'}`}>{f.description}</div>
              </div>
            ))}
          </div>

          {/* Interactive Fossil Type Detail Panel */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentFossilData.icon}</span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                    Paleontological Classification
                  </span>
                  <h2 className="text-2xl font-black text-slate-800 mt-1">{currentFossilData.name}</h2>
                </div>
              </div>
              <button
                onClick={() => speakText(`${currentFossilData.name}. Description: ${currentFossilData.description}. ${currentFossilData.summary}. ${currentFossilData.details.join(' ')}`)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-900 transition-all cursor-pointer"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-amber-800">Scientific Summary</div>
              <div className="font-bold text-stone-900 text-xs md:text-sm leading-relaxed">{currentFossilData.summary}</div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Key Geological Characteristics</h4>
              {currentFossilData.details.map((d, idx) => (
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
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                Official Visual Reference
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">Fossils: Discovering Earth's Ancient Life Infographic</h2>
              <p className="text-slate-500 text-xs mt-1">Official high-resolution diagram detailing 8-step fossil formation, 5 fossil types, Law of Superposition, and Australian megafauna.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-700 text-white font-extrabold text-xs shadow-md shadow-amber-600/20 hover:bg-amber-800 transition-all flex items-center gap-2 cursor-pointer"
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
              src="/fossils_infographic.jpg" 
              alt="Fossils Infographic Chart" 
              className="max-w-full h-auto rounded-xl shadow-lg border border-white max-h-[800px] object-contain group-hover:scale-101 transition-transform"
            />
          </div>
        </div>
      )}

      {/* ==================================== TAB: FORMATION STEPS ==================================== */}
      {activeTab === 'formation' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
              Petrifaction Process
            </span>
            <h2 className="text-2xl font-black text-slate-800 mt-1">8 Steps of Fossil Formation</h2>
            <p className="text-slate-500 text-xs mt-1">Fossilization takes thousands to millions of years under specific geological conditions!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {formationSteps.map((fs, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="font-black text-xs text-amber-900">{fs.step}</div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{fs.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================== TAB: ROCK LAYERS ==================================== */}
      {activeTab === 'layers' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-xl text-slate-800 flex items-center gap-2">
              <Layers className="w-6 h-6 text-amber-700" /> Law of Superposition (Stratigraphy)
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              In undisturbed sedimentary rock layers, the <strong>OLDEST rock layers are on the bottom</strong>, and the <strong>YOUNGEST layers are at the top</strong>! Fossils trapped within these layers allow geologists to estimate the relative age of ancient life.
            </p>
            <div className="space-y-2 text-xs font-bold text-center">
              <div className="p-3 bg-amber-100 text-amber-950 rounded-xl">Top Layer (Youngest): Mammal & Bird Fossils</div>
              <div className="p-3 bg-amber-200 text-amber-950 rounded-xl">Middle Layer: Dinosaur Bones & Fern Leaves</div>
              <div className="p-3 bg-amber-300 text-amber-950 rounded-xl">Bottom Layer (Oldest): Ancient Marine Trilobites & Ammonites</div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB: ANCIENT ENVIRONMENTS ==================================== */}
      {activeTab === 'environments' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50 space-y-2">
            <h3 className="font-black text-base text-blue-900">Marine Environment 🌊</h3>
            <p className="text-xs text-blue-800 leading-relaxed font-medium">Fossils of seashells, fish, corals, and ammonites indicate an area was once submerged underwater beneath an ancient ocean or sea.</p>
          </div>
          <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50 space-y-2">
            <h3 className="font-black text-base text-emerald-900">Forest Environment 🌲</h3>
            <p className="text-xs text-emerald-800 leading-relaxed font-medium">Petrified tree trunks, fern leaf imprints, and fossilized insects show an area was once a lush, humid primeval forest.</p>
          </div>
          <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50 space-y-2">
            <h3 className="font-black text-base text-amber-900">Desert / Land Environment 🏜️</h3>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">Dinosaur skeletons and preserved foot tracks reveal dry land or coastal floodplains where land animals walked.</p>
          </div>
        </div>
      )}

      {/* ==================================== TAB: AUSTRALIAN FOSSILS ==================================== */}
      {activeTab === 'australian' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {australianFossils.map((af, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <h3 className="font-black text-base text-amber-900">{af.name}</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{af.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* ==================================== TAB: QUIZ ==================================== */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-800">Fossils Knowledge Check</h2>
              <p className="text-slate-500 text-xs mt-1">Test your understanding of fossil types, formation steps, and rock layer superposition.</p>
            </div>
            {quizScore !== null && (
              <div className="px-4 py-2 rounded-2xl bg-amber-100 text-amber-900 font-black text-sm flex items-center gap-2">
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
                          ? 'bg-amber-700 border-amber-700 text-white shadow-sm'
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
              className="px-6 py-2.5 rounded-xl bg-amber-700 text-white font-extrabold text-xs shadow-lg shadow-amber-600/20 disabled:opacity-40 cursor-pointer"
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
                <h3 className="font-extrabold text-white text-sm">Fossils: Discovering Earth's Ancient Life Infographic</h3>
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
              src="/fossils_infographic.jpg" 
              alt="Fossils Infographic" 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2 border-slate-700/50 object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
