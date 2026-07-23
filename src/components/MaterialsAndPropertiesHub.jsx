import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  RotateCcw, 
  Award, 
  X,
  Layers,
  Recycle,
  ShieldCheck,
  Search,
  Check,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MaterialsAndPropertiesHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMaterial, setSelectedMaterial] = useState('wood');
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

  // Materials Matrix & Properties
  const materialsList = [
    {
      id: 'wood',
      name: 'Wood 🪵',
      source: 'Natural (Trees)',
      hardness: 'Hard',
      flexibility: 'Rigid',
      strength: 'Strong',
      texture: 'Rough',
      weight: 'Light to Medium',
      waterproof: false,
      transparent: false,
      conductsHeat: false,
      conductsElectricity: false,
      magnetic: false,
      recyclable: true,
      uses: 'Furniture (chairs, tables), building frames, paper pulp, wooden spoons, pencils.',
      summary: 'Wood is a natural material harvested from trees. It is strong and rigid, making it ideal for structural building, but it absorbs water unless treated with paint or varnish.'
    },
    {
      id: 'metal',
      name: 'Metal 🥄',
      source: 'Natural (Extracted from Ores)',
      hardness: 'Hard',
      flexibility: 'Rigid',
      strength: 'Very Strong',
      texture: 'Smooth',
      weight: 'Heavy',
      waterproof: true,
      transparent: false,
      conductsHeat: true,
      conductsElectricity: true,
      magnetic: true, // Some metals like iron, steel, nickel
      recyclable: true,
      uses: 'Saucepans, bridges, cars, cutlery, nails, electrical wiring (copper).',
      summary: 'Metals are strong, durable materials that conduct heat and electricity extremely well. Ferrous metals (containing iron) are also attracted to magnets.'
    },
    {
      id: 'plastic',
      name: 'Plastic 🧴',
      source: 'Manufactured (Synthetic from Petroleum)',
      hardness: 'Varies (Soft/Hard)',
      flexibility: 'Flexible or Rigid',
      strength: 'Moderate',
      texture: 'Smooth',
      weight: 'Light',
      waterproof: true,
      transparent: true, // Can be transparent or opaque
      conductsHeat: false,
      conductsElectricity: false,
      magnetic: false,
      recyclable: true,
      uses: 'Water bottles, raincoats, toys, food containers, electrical wire insulation.',
      summary: 'Plastic is a man-made synthetic material produced from petroleum oil. It is lightweight, waterproof, easy to shape into any mold, and acts as an excellent electrical insulator.'
    },
    {
      id: 'glass',
      name: 'Glass 🪟',
      source: 'Manufactured (Melted Silica Sand)',
      hardness: 'Hard (Brittle)',
      flexibility: 'Rigid',
      strength: 'Weak against impact',
      texture: 'Smooth',
      weight: 'Heavy',
      waterproof: true,
      transparent: true,
      conductsHeat: false,
      conductsElectricity: false,
      magnetic: false,
      recyclable: true,
      uses: 'Windows, drinking glasses, optical lenses, microscope slides, light bulb envelopes.',
      summary: 'Glass is created by melting silica sand at ultra-high temperatures. Its key unique property is high transparency, allowing light to pass through clearly while blocking wind and water.'
    },
    {
      id: 'rubber',
      name: 'Rubber 🎈',
      source: 'Natural (Latex tree sap) or Synthetic',
      hardness: 'Soft',
      flexibility: 'Highly Flexible & Elastic',
      strength: 'Tough',
      texture: 'Smooth',
      weight: 'Light',
      waterproof: true,
      transparent: false,
      conductsHeat: false,
      conductsElectricity: false,
      magnetic: false,
      recyclable: true,
      uses: 'Car tyres, bouncy balls, shoe soles, rubber bands, waterproof boots (wellies).',
      summary: 'Rubber is extremely elastic and flexible. It deforms under force and snaps back to its original shape, while providing high friction to prevent slipping.'
    },
    {
      id: 'fabric',
      name: 'Fabric / Textiles 🧸',
      source: 'Natural (Cotton, Wool, Silk) or Synthetic (Nylon)',
      hardness: 'Soft',
      flexibility: 'Flexible',
      strength: 'Moderate',
      texture: 'Soft / Woven',
      weight: 'Light',
      waterproof: false, // Unless coated
      transparent: false,
      conductsHeat: false,
      conductsElectricity: false,
      magnetic: false,
      recyclable: true,
      uses: 'Clothing, bath towels, bedsheets, teddy bears, curtains, upholstery.',
      summary: 'Fabrics are woven from natural or synthetic fibers. They are soft, flexible, and comfortable against human skin. Most untreated fabrics are absorbent, making them ideal for towels.'
    },
    {
      id: 'stone',
      name: 'Stone / Rock 🪨',
      source: 'Natural (Earth\'s Crust)',
      hardness: 'Very Hard',
      flexibility: 'Rigid',
      strength: 'Extremely Strong',
      texture: 'Rough',
      weight: 'Very Heavy',
      waterproof: true,
      transparent: false,
      conductsHeat: false,
      conductsElectricity: false,
      magnetic: false,
      recyclable: true,
      uses: 'Building walls, monuments, kitchen countertops, roads, statues.',
      summary: 'Stone is a naturally occurring solid mineral material. It is extremely hard, durable, and weather-resistant, lasting for thousands of years without degrading.'
    }
  ];

  // Property Definitions Key
  const propertyDefinitions = [
    { prop: 'Hard', def: 'Difficult to scratch, dent, or bend.', ex: 'Diamond, Steel, Oak wood' },
    { prop: 'Soft', def: 'Easy to press, squash, or reshape.', ex: 'Sponge, Teddy bear fabric, Clay' },
    { prop: 'Flexible', def: 'Can bend or stretch easily without snapping.', ex: 'Rubber band, Plastic ruler, Fabric' },
    { prop: 'Rigid', def: 'Stiff and does not bend when force is applied.', ex: 'Glass, Stone pillar, Metal beam' },
    { prop: 'Waterproof', def: 'Repels water; does not let liquid pass through.', ex: 'Plastic bottle, Rubber boot, Glass window' },
    { prop: 'Absorbent', def: 'Soaks up liquids readily into tiny internal pores.', ex: 'Bath towel, Sponge, Kitchen paper towel' },
    { prop: 'Transparent', def: 'Allows light to pass through clearly so objects behind are visible.', ex: 'Glass window, Clear plastic cup' },
    { prop: 'Opaque', def: 'Blocks light completely; cannot be seen through.', ex: 'Wood door, Brick wall, Steel plate' }
  ];

  // Natural vs Manufactured
  const naturalVsManufactured = [
    { type: 'Natural Materials 🌿', origin: 'Created directly by nature (plants, animals, Earth\'s crust)', items: 'Wood (trees), Cotton (plants), Wool (sheep), Leather (animal hide), Silk (silkworm), Stone, Clay' },
    { type: 'Manufactured / Synthetic Materials 🏭', origin: 'Made or processed chemically by humans in factories', items: 'Plastic (petroleum), Glass (melted sand), Concrete (cement/gravel), Steel (iron/carbon), Nylon, Paper' }
  ];

  // Best Material Selection Scenarios
  const selectionScenarios = [
    { item: 'Umbrella ☂️', question: 'Which material makes the best umbrella canopy?', choices: ['Paper', 'Glass', 'Waterproof Fabric', 'Concrete'], answer: 'Waterproof Fabric', reason: 'Lightweight, flexible to fold, and waterproof to keep rain off!' },
    { item: 'Saucepan 🍲', question: 'Which material is best for a cooking pot body?', choices: ['Metal', 'Wood', 'Rubber', 'Paper'], answer: 'Metal', reason: 'Strong, heat-resistant, and conducts thermal heat quickly to cook food!' },
    { item: 'Window Pane 🪟', question: 'Which material is best for a house window?', choices: ['Brick', 'Glass', 'Fabric', 'Cardboard'], answer: 'Glass', reason: 'Transparent to let natural sunlight inside while keeping out wind and rain!' },
    { item: 'Bath Towel 🛁', question: 'Which material is best for drying yourself after a shower?', choices: ['Glass', 'Plastic', 'Absorbent Fabric', 'Metal'], answer: 'Absorbent Fabric', reason: 'Soft on skin and highly absorbent to soak up water quickly!' }
  ];

  // Quiz Questions
  const quizQuestions = [
    {
      id: 1,
      q: 'What is the scientific difference between an Object and a Material?',
      options: [
        'An Object is the thing itself (e.g. Chair), while a Material is what it is made from (e.g. Wood)',
        'An Object is always made of glass, while a material is made of metal',
        'Objects are living things, while materials are non-living',
        'There is no difference between them'
      ],
      ans: 'An Object is the thing itself (e.g. Chair), while a Material is what it is made from (e.g. Wood)'
    },
    {
      id: 2,
      q: 'Which property describes a material that DOES NOT let water pass through it?',
      options: ['Absorbent', 'Waterproof', 'Transparent', 'Flexible'],
      ans: 'Waterproof'
    },
    {
      id: 3,
      q: 'Why is Metal used to make cooking saucepans instead of Plastic or Wood?',
      options: [
        'Metal conducts thermal heat quickly to cook food and withstands high temperatures',
        'Metal is transparent so you can see inside',
        'Metal is soft and easy to squash',
        'Metal floats on water'
      ],
      ans: 'Metal conducts thermal heat quickly to cook food and withstands high temperatures'
    },
    {
      id: 4,
      q: 'Which of the following is a Natural material harvested from living plants?',
      options: ['Plastic', 'Nylon', 'Cotton', 'Concrete'],
      ans: 'Cotton'
    },
    {
      id: 5,
      q: 'Why is Glass chosen for building house windows?',
      options: [
        'Because glass is Transparent, letting light through while blocking wind and rain',
        'Because glass is magnetic',
        'Because glass is soft and stretchy',
        'Because glass is an electrical conductor'
      ],
      ans: 'Because glass is Transparent, letting light through while blocking wind and rain'
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

  const currentMaterialData = materialsList.find(m => m.id === selectedMaterial) || materialsList[0];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 p-8 text-white shadow-xl shadow-amber-500/10">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-yellow-200" /> Science Academy • Grade 4 Material Science
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Materials & Their Properties 🪵🪟🥄
          </h1>
          <p className="text-amber-100 text-sm md:text-base max-w-2xl font-medium leading-relaxed">
            Everything around us is made from materials! Learn how scientists test and compare physical properties like hardness, flexibility, waterproofing, and transparency to choose the perfect material for every job.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={() => speakText("Materials and Their Properties. A material is what an object is made from. Different materials have different physical properties such as being hard or soft, flexible or rigid, waterproof or absorbent, transparent or opaque.")}
              className="px-4 py-2 rounded-xl bg-white text-amber-950 font-extrabold text-xs flex items-center gap-2 hover:bg-amber-50 transition-all shadow-md cursor-pointer"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
              {isPlayingAudio ? 'Stop Audio' : 'Listen to Overview'}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-900/60 hover:bg-amber-900/80 text-white font-extrabold text-xs flex items-center gap-2 border border-amber-400/30 transition-all cursor-pointer"
            >
              🖼️ View Full Infographic Chart
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Material Comparator', icon: '🪵' },
          { id: 'infographic', label: 'Full Infographic Chart', icon: '🖼️' },
          { id: 'definitions', label: 'Property Definitions', icon: '🔍' },
          { id: 'natural', label: 'Natural vs Manufactured', icon: '🌿' },
          { id: 'selection', label: 'Choosing Best Materials', icon: '☂️' },
          { id: 'recycling', label: 'Recycling & Sustainability', icon: '♻️' },
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

      {/* ==================================== TAB 1: MATERIAL COMPARATOR ==================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Quick Banner */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-4 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🧪</span>
              <div>
                <h4 className="font-extrabold text-sm">Official Materials Infographic Included</h4>
                <p className="text-amber-100 text-xs">View the high-resolution infographic chart comparing wood, metal, plastic, glass, rubber, fabric, and stone properties.</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('infographic')}
              className="px-4 py-2 rounded-xl bg-white text-amber-950 font-black text-xs hover:bg-amber-50 transition-all shrink-0 cursor-pointer shadow-sm"
            >
              View Infographic Chart →
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {materialsList.map((m) => (
              <div 
                key={m.id} 
                onClick={() => setSelectedMaterial(m.id)}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer space-y-1 ${
                  selectedMaterial === m.id ? 'bg-amber-600 border-amber-600 text-white shadow-lg scale-105' : 'bg-white border-slate-200 hover:border-amber-300'
                }`}
              >
                <div className="font-black text-xs">{m.name}</div>
                <div className={`text-[10px] font-bold ${selectedMaterial === m.id ? 'text-amber-100' : 'text-slate-500'}`}>{m.source}</div>
              </div>
            ))}
          </div>

          {/* Interactive Material Detail Panel */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  Material Profile • {currentMaterialData.source}
                </span>
                <h2 className="text-2xl font-black text-slate-800 mt-1">{currentMaterialData.name}</h2>
              </div>
              <button
                onClick={() => speakText(`${currentMaterialData.name}. Source: ${currentMaterialData.source}. ${currentMaterialData.summary}. Common uses: ${currentMaterialData.uses}`)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-800 transition-all cursor-pointer"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-amber-700">Scientific Summary</div>
              <div className="font-bold text-amber-950 text-xs md:text-sm leading-relaxed">{currentMaterialData.summary}</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-semibold">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-black uppercase">Hardness</span>
                <div className="text-slate-800 font-bold">{currentMaterialData.hardness}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-black uppercase">Flexibility</span>
                <div className="text-slate-800 font-bold">{currentMaterialData.flexibility}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-black uppercase">Waterproof?</span>
                <div className={currentMaterialData.waterproof ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                  {currentMaterialData.waterproof ? '✓ Yes (Waterproof)' : '✗ No (Absorbent/Permeable)'}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-black uppercase">Transparency</span>
                <div className={currentMaterialData.transparent ? 'text-blue-600 font-bold' : 'text-slate-700 font-bold'}>
                  {currentMaterialData.transparent ? '✓ Transparent' : '✗ Opaque'}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Everyday Applications</div>
              <div className="text-slate-700 font-medium text-xs leading-relaxed">{currentMaterialData.uses}</div>
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
              <h2 className="text-2xl font-black text-slate-800 mt-1">Materials and Their Properties Infographic</h2>
              <p className="text-slate-500 text-xs mt-1">Official high-resolution diagram detailing objects vs materials, natural vs manufactured, property testing, and recycling.</p>
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
              src="/materials_and_properties_infographic.jpg" 
              alt="Materials and Their Properties Infographic Chart" 
              className="max-w-full h-auto rounded-xl shadow-lg border border-white max-h-[800px] object-contain group-hover:scale-101 transition-transform"
            />
          </div>
        </div>
      )}

      {/* ==================================== TAB: PROPERTY DEFINITIONS ==================================== */}
      {activeTab === 'definitions' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
              Scientific Vocabulary
            </span>
            <h2 className="text-2xl font-black text-slate-800 mt-1">Key Physical Material Properties</h2>
            <p className="text-slate-500 text-xs mt-1">Scientists use precise vocabulary to describe how materials react to force, water, light, and heat.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {propertyDefinitions.map((pd, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="font-black text-base text-amber-900">{pd.prop}</div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{pd.def}</p>
                <div className="text-[11px] font-bold text-slate-700 pt-1">
                  Examples: <span className="font-normal text-slate-600">{pd.ex}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================== TAB: NATURAL VS MANUFACTURED ==================================== */}
      {activeTab === 'natural' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {naturalVsManufactured.map((nvm, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-black text-lg text-slate-900">{nvm.type}</h3>
                <p className="text-xs text-emerald-700 font-bold mt-1">{nvm.origin}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800">
                Primary Materials: {nvm.items}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==================================== TAB: CHOOSING BEST MATERIALS ==================================== */}
      {activeTab === 'selection' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
              Engineering Design Decisions
            </span>
            <h2 className="text-2xl font-black text-slate-800 mt-1">Which Material is Best for the Job?</h2>
            <p className="text-slate-500 text-xs mt-1">We choose materials based on their specific physical properties to suit an object's function!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectionScenarios.map((sc, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="font-black text-base text-slate-900">{sc.item}</h3>
                  <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-black text-xs">Ideal: {sc.answer}</span>
                </div>
                <p className="text-xs font-bold text-slate-700">{sc.question}</p>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed font-medium">
                  <strong>Why it works best: </strong>{sc.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================== TAB: RECYCLING ==================================== */}
      {activeTab === 'recycling' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Recycle className="w-8 h-8 text-emerald-600" />
            <div>
              <h2 className="text-2xl font-black text-slate-800">Recycling Materials & Sustainability</h2>
              <p className="text-slate-500 text-xs">Many manufactured and natural materials can be reprocessed and reused to protect our environment.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs font-bold text-center">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900">📄 Paper</div>
            <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-200 text-yellow-900">🧴 Plastic</div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">🪟 Glass</div>
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900">🥫 Metal</div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">📦 Cardboard</div>
          </div>
        </div>
      )}

      {/* ==================================== TAB: QUIZ ==================================== */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-800">Materials Knowledge Check</h2>
              <p className="text-slate-500 text-xs mt-1">Test your understanding of material properties, natural vs manufactured, and engineering choices.</p>
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
                <h3 className="font-extrabold text-white text-sm">Materials and Their Properties Infographic</h3>
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
              src="/materials_and_properties_infographic.jpg" 
              alt="Materials and Their Properties Infographic" 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2 border-slate-700/50 object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
