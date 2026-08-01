import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  RotateCcw, 
  Award, 
  X,
  Sun,
  Droplets,
  Wind,
  Flower2,
  TreePine,
  ShieldAlert,
  Sprout,
  ZoomIn,
  Maximize2,
  Layers,
  Zap,
  Info,
  ArrowRight,
  Activity,
  Flame,
  Leaf
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PlantsHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedInfographic, setSelectedInfographic] = useState('photosynthesis'); // 'photosynthesis' | 'plants'
  const [selectedPart, setSelectedPart] = useState('leaves');
  const [selectedProcessStep, setSelectedProcessStep] = useState(1);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [modalImage, setModalImage] = useState(null); // null | '/photosynthesis_infographic.jpg?v=10' | '/plants_infographic.jpg?v=10'

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

  // Plant Parts & Roles
  const plantParts = [
    {
      id: 'leaves',
      name: 'Leaves (Food Factories)',
      icon: '🍃',
      mainRole: 'Photosynthesis & Gas Exchange',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      badgeBg: 'bg-emerald-600 text-white',
      summary: 'Leaves absorb sunlight and carbon dioxide to manufacture glucose sugar (food) for the plant, releasing oxygen into the air.',
      details: [
        'Contain green pigment called Chlorophyll inside specialized organelles (chloroplasts).',
        'Have microscopic pores called Stomata on their undersides for gas exchange (taking in CO₂ and releasing O₂ & water vapour).',
        'Act as the primary site of Photosynthesis—the chemical process feeding almost all life on Earth!'
      ]
    },
    {
      id: 'stem',
      name: 'Stem (Support & Transport Highway)',
      icon: '🪵',
      mainRole: 'Structural Support & Nutrient Transport',
      color: 'bg-amber-50 border-amber-200 text-amber-900',
      badgeBg: 'bg-amber-600 text-white',
      summary: 'Supports leaves, flowers, and fruits, holding them up toward sunlight while transporting water, minerals, and sugars.',
      details: [
        'Contains Xylem vessels that carry water and dissolved minerals UPWARD from roots to leaves.',
        'Contains Phloem vessels that transport manufactured glucose sugars DOWNWARD and throughout the plant.',
        'Provides physical strength to keep the plant upright against gravity and wind.'
      ]
    },
    {
      id: 'roots',
      name: 'Roots (Anchor & Soil Absorber)',
      icon: '🌱',
      mainRole: 'Anchoring & Water/Mineral Absorption',
      color: 'bg-stone-50 border-stone-200 text-stone-900',
      badgeBg: 'bg-stone-600 text-white',
      summary: 'Anchors the plant firmly in the soil while absorbing water and vital soil minerals (nitrogen, phosphorus, potassium).',
      details: [
        'Microscopic root hairs vastly increase surface area for maximum water and mineral absorption.',
        'Prevents soil erosion by binding soil particles tightly together.',
        'Stores backup energy and starches for the plant during cold winter dormancy.'
      ]
    },
    {
      id: 'flower',
      name: 'Flower (Reproduction Organ)',
      icon: '🌸',
      mainRole: 'Sexual Reproduction & Seed Production',
      color: 'bg-rose-50 border-rose-200 text-rose-900',
      badgeBg: 'bg-rose-600 text-white',
      summary: 'Contains male and female reproductive structures that enable pollination, fertilisation, and seed creation.',
      details: [
        'Brightly coloured petals and sweet nectar attract pollinators like bees, butterflies, and hummingbirds.',
        'After successful fertilisation, the flower transforms: the ovary becomes fruit, and ovules become seeds.'
      ]
    },
    {
      id: 'fruit',
      name: 'Fruit & Seeds (Protection & Dispersal)',
      icon: '🍎',
      mainRole: 'Seed Protection & Distribution',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-900',
      badgeBg: 'bg-indigo-600 text-white',
      summary: 'The fruit develops from the swollen ovary to protect enclosed seeds and facilitate seed dispersal to new locations.',
      details: [
        'Fleshy fruits (apples, tomatoes, berries) attract animals that eat them and deposit seeds elsewhere in droppings.',
        'Seeds contain a miniature plant embryo and a packed food supply (endosperm) ready for germination.'
      ]
    }
  ];

  // Photosynthesis 6 Step-by-Step Process Flow
  const processSteps = [
    {
      step: 1,
      title: '1. Water Absorption',
      icon: '💧',
      desc: 'Roots absorb water (H₂O) and minerals from the soil, which are transported upward through Xylem vessels to the leaves.'
    },
    {
      step: 2,
      title: '2. CO₂ Intake',
      icon: '💨',
      desc: 'Leaves take in Carbon Dioxide (CO₂) gas from the surrounding air through microscopic pores called Stomata.'
    },
    {
      step: 3,
      title: '3. Light Capture',
      icon: '☀️',
      desc: 'Green Chlorophyll pigments inside leaf Chloroplasts absorb solar energy from sunlight.'
    },
    {
      step: 4,
      title: '4. Chemical Reaction',
      icon: '🧪',
      desc: 'Inside chloroplasts: Water + Carbon Dioxide + Sunlight Energy react to create Glucose (C₆H₁₂O₆) and Oxygen (O₂).'
    },
    {
      step: 5,
      title: '5. Sugar Transport',
      icon: '🍇',
      desc: 'Glucose sugar is transported via Phloem vessels to all parts of the plant for growth, flowering, fruit production, and starch storage.'
    },
    {
      step: 6,
      title: '6. Oxygen Release',
      icon: '🌬️',
      desc: 'Fresh Oxygen gas (O₂) is released into the atmosphere through stomata for animals and humans to breathe!'
    }
  ];

  // Leaf Cross-Section Anatomy Layers
  const leafLayers = [
    { name: 'Upper Epidermis 🛡️', role: 'Protective top layer with waxy cuticle to prevent water loss.' },
    { name: 'Palisade Mesophyll 🔋', role: 'Main photosynthesis factory packed densely with Chloroplasts!' },
    { name: 'Spongy Mesophyll 🌬️', role: 'Loosely arranged cells with air spaces allowing gas circulation (CO₂ & O₂).' },
    { name: 'Vein (Xylem & Phloem) 🩸', role: 'Xylem transports water in; Phloem transports manufactured glucose out.' },
    { name: 'Lower Epidermis & Stomata 🚪', role: 'Contains microscopic Stomata guard cells that open and close for gas exchange.' }
  ];

  // Factors Affecting Photosynthesis
  const factorsList = [
    { factor: 'Sunlight Intensity ☀️', impact: 'Higher light levels speed up photosynthesis until reaching maximum capacity.' },
    { factor: 'Temperature 🌡️', impact: 'Enzymes work best in warm temperatures (~20°C–30°C); extreme heat or cold slows it down.' },
    { factor: 'Water Availability 💧', impact: 'Drought causes stomata to close to save water, slowing down CO₂ intake and food production.' },
    { factor: 'CO₂ Concentration 💨', impact: 'More carbon dioxide in air boosts the rate of glucose creation.' },
    { factor: 'Leaf Health 🍃', impact: 'Healthy green leaves with rich chlorophyll produce food much faster than diseased leaves.' }
  ];

  // Photosynthesis vs Respiration Comparison Table
  const comparisonData = [
    { feature: 'Where it Occurs', photo: 'Chloroplasts (green leaf cells)', resp: 'Mitochondria (all living plant & animal cells)' },
    { feature: 'When it Occurs', photo: 'Daytime only (when sunlight is available)', resp: '24/7 Day and Night continuously' },
    { feature: 'Inputs / Ingredients', photo: 'Sunlight + Water (H₂O) + Carbon Dioxide (CO₂)', resp: 'Glucose (C₆H₁₂O₆) + Oxygen (O₂)' },
    { feature: 'Outputs / Products', photo: 'Glucose (Sugar Food) + Oxygen (O₂)', resp: 'Carbon Dioxide (CO₂) + Water (H₂O) + ATP Energy' },
    { feature: 'Energy Transformation', photo: 'Stores solar energy as chemical energy in glucose', resp: 'Releases stored energy for growth, repair, and movement' },
    { feature: 'Primary Purpose', photo: 'To MAKE food (producers)', resp: 'To USE food for energy (living work)' }
  ];

  // Flower Anatomy Parts
  const flowerAnatomy = [
    { part: 'Stamen (Male Part)', sub: 'Anther + Filament', desc: 'The male reproductive organ. The Anther produces powdery pollen grains; the Filament holds up the anther.' },
    { part: 'Pistil / Carpel (Female Part)', sub: 'Stigma + Style + Ovary + Ovule', desc: 'The female organ. The Stigma is sticky to catch pollen; the Style connects to the Ovary; the Ovule holds egg cells.' },
    { part: 'Petal', sub: 'Attractant', desc: 'Brightly coloured and scented leaf-like structures designed to attract insect and bird pollinators.' },
    { part: 'Sepal', sub: 'Protective Shield', desc: 'Small green leaf-like structures that enclose and protect the delicate flower bud before it opens.' }
  ];

  // 9 Stages of Flowering Plant Life Cycle
  const lifeCycleSteps = [
    { step: '1. Seed 🌰', desc: 'Dormant plant embryo protected by a seed coat, waiting for suitable conditions.' },
    { step: '2. Germination 🌱', desc: 'Seed absorbs water, swells, and sprouts roots downward and a shoot upward when receiving Water, Oxygen, and Warmth (WOW).' },
    { step: '3. Seedling 🌿', desc: 'Young plant grows stem, roots, and its first true leaves to begin photosynthesis.' },
    { step: '4. Mature Plant 🌻', desc: 'Plant reaches full growth and produces flowers containing reproductive organs.' },
    { step: '5. Pollination 🐝', desc: 'Insects or wind transfer pollen grains from anther to sticky stigma.' },
    { step: '6. Fertilisation 🔬', desc: 'Pollen tube grows down the style; male cell joins female egg cell in the ovule.' },
    { step: '7. Fruit & Seed Formation 🍎', desc: 'Petals drop; the ovary swells into a fruit housing fertilized ovules (seeds).' },
    { step: '8. Seed Dispersal 💨', desc: 'Seeds are spread far away via Wind, Water, Animals, Exploding Pods, or Gravity.' },
    { step: '9. New Plant Cycle 🔄', desc: 'Seed lands in fertile soil $\rightarrow$ Cycle repeats!' }
  ];

  // Plant Adaptations
  const plantAdaptations = [
    { plant: 'Cactus 🌵', habitat: 'Hot Desert', adaptation: 'Thick succulent stems store water, waxy skin prevents evaporation, and sharp spines protect against animals.' },
    { plant: 'Water Lily 🪷', habitat: 'Freshwater Ponds', adaptation: 'Flat floating leaves maximize sunlight capture; stomata located on top of leaves for air access.' },
    { plant: 'Venus Flytrap 🪵', habitat: 'Nutrient-poor Bogs', adaptation: 'Traps and digests insects to obtain vital nitrogen nutrients missing from bog soil.' }
  ];

  // Quiz Questions
  const quizQuestions = [
    {
      id: 1,
      q: 'What is the primary chemical reaction formula for Photosynthesis in green plants?',
      options: [
        'Sunlight + Water + Carbon Dioxide → Glucose + Oxygen',
        'Oxygen + Sugar → Carbon Dioxide + Water',
        'Nitrogen + Soil → Flowers + Fruit',
        'Sunlight + Salt → Water + Heat'
      ],
      ans: 'Sunlight + Water + Carbon Dioxide → Glucose + Oxygen'
    },
    {
      id: 2,
      q: 'Which microscopic organelle inside plant leaf cells contains green chlorophyll to absorb sunlight?',
      options: ['Mitochondria', 'Chloroplast', 'Nucleus', 'Stomata'],
      ans: 'Chloroplast'
    },
    {
      id: 3,
      q: 'What are Stomata on the underside of plant leaves used for?',
      options: [
        'Taking in Carbon Dioxide (CO₂) and releasing Oxygen (O₂) and water vapour',
        'Absorbing minerals from soil',
        'Attracting bees for pollination',
        'Holding up the flower'
      ],
      ans: 'Taking in Carbon Dioxide (CO₂) and releasing Oxygen (O₂) and water vapour'
    },
    {
      id: 4,
      q: 'How do plants use the Glucose sugar manufactured during photosynthesis?',
      options: [
        'To grow, produce flowers/fruits, store starch, and release energy',
        'Only to change leaf colors in autumn',
        'To attract sunlight at night',
        'To freeze water inside roots'
      ],
      ans: 'To grow, produce flowers/fruits, store starch, and release energy'
    },
    {
      id: 5,
      q: 'What vessels inside the plant stem transport water and minerals UPWARD from roots to leaves?',
      options: ['Phloem', 'Xylem', 'Stomata', 'Sepals'],
      ans: 'Xylem'
    },
    {
      id: 6,
      q: 'Where does Cellular Respiration occur inside plant and animal cells 24 hours a day?',
      options: ['Mitochondria', 'Chloroplasts', 'Petals', 'Roots'],
      ans: 'Mitochondria'
    },
    {
      id: 7,
      q: 'What percentage of Earth\'s total photosynthesis is performed by microscopic ocean phytoplankton?',
      options: ['Over 50%', 'Less than 5%', '100%', '0%'],
      ans: 'Over 50%'
    },
    {
      id: 8,
      q: 'Which part of a flower is sticky at the top to catch pollen grains transferred by pollinators?',
      options: ['Anther', 'Stigma', 'Sepal', 'Filament'],
      ans: 'Stigma'
    }
  ];

  const handleQuizSubmit = () => {
    let score = 0;
    quizQuestions.forEach(q => {
      if (quizAnswers[q.id] === q.ans) score++;
    });
    setQuizScore(score);
    if (score === quizQuestions.length) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
  };

  const currentPartData = plantParts.find(p => p.id === selectedPart) || plantParts[0];
  const currentStepData = processSteps.find(s => s.step === selectedProcessStep) || processSteps[0];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-green-800 p-8 text-white shadow-2xl border border-emerald-500/30">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-yellow-300" /> Science Academy • Grade 4 Plant Biology & Botany
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Plants, Photosynthesis & Life Cycles 🌿☀️🌸
          </h1>
          <p className="text-emerald-100 text-sm md:text-base max-w-3xl font-medium leading-relaxed">
            Plants are Earth's primary food producers! Discover how green plants turn sunlight, water, and carbon dioxide into glucose and oxygen through Photosynthesis.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={() => speakText("Welcome to Plant Biology and Photosynthesis! Photosynthesis is the chemical process where green plants use sunlight, water, and carbon dioxide to produce glucose food and fresh oxygen.")}
              className="px-4 py-2 rounded-xl bg-white text-emerald-950 font-extrabold text-xs flex items-center gap-2 hover:bg-emerald-50 transition-all shadow-md cursor-pointer"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
              {isPlayingAudio ? 'Stop Audio' : 'Listen to Overview'}
            </button>
            <button
              onClick={() => setModalImage('/photosynthesis_infographic.jpg?v=10')}
              className="px-4 py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-900 text-white font-extrabold text-xs flex items-center gap-2 border border-emerald-400/40 shadow-md transition-all cursor-pointer"
            >
              🖼️ Open Photosynthesis Chart
            </button>
            <button
              onClick={() => setModalImage('/plants_infographic.jpg?v=10')}
              className="px-4 py-2 rounded-xl bg-teal-900/60 hover:bg-teal-900/80 text-teal-100 font-extrabold text-xs flex items-center gap-2 border border-teal-400/30 transition-all cursor-pointer"
            >
              🖼️ Open Plant Life Cycles Chart
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Infographic Charts & Overview', icon: '🖼️' },
          { id: 'photosynthesis_master', label: 'Photosynthesis Masterclass', icon: '☀️' },
          { id: 'plant_parts', label: 'Plant Organs & Transport', icon: '🌿' },
          { id: 'flower_anatomy', label: 'Flower Anatomy & Pollination', icon: '🌸' },
          { id: 'lifecycles', label: '9 Life Cycle Stages', icon: '🌱' },
          { id: 'quiz', label: 'Knowledge Check Quiz', icon: '🏆' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-102'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* ==================================== TAB 1: INFOGRAPHIC CHARTS & OVERVIEW ==================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Dual Infographic Selector */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-md">
                  Visual Learning Guides • Grade 4 Science
                </span>
                <h3 className="text-2xl font-black text-slate-800 mt-2 flex items-center gap-2">
                  <span>🖼️</span> Botanical & Photosynthesis Reference Posters
                </h3>
                <p className="text-slate-500 text-xs mt-1">
                  Select a poster below to preview or click to open in full high-resolution zoom mode. Both official science charts are included!
                </p>
              </div>

              {/* Chart Switcher Buttons */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
                <button
                  onClick={() => setSelectedInfographic('photosynthesis')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    selectedInfographic === 'photosynthesis'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ☀️ Photosynthesis in Plants Chart
                </button>
                <button
                  onClick={() => setSelectedInfographic('plants')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    selectedInfographic === 'plants'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🌿 Plant Life Cycles & Anatomy Chart
                </button>
              </div>
            </div>

            {/* Selected Poster Display */}
            <div className="relative flex flex-col items-center bg-slate-950/5 p-4 rounded-2xl border border-slate-200 overflow-hidden">
              <div className="w-full flex justify-between items-center mb-3 px-2">
                <span className="font-extrabold text-slate-700 text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 text-emerald-600" />
                  {selectedInfographic === 'photosynthesis'
                    ? 'Photosynthesis in Plants - How Plants Make Their Own Food Infographic'
                    : 'Plants: Parts, Functions and Life Cycles Infographic'}
                </span>
                <button
                  onClick={() => setModalImage(selectedInfographic === 'photosynthesis' ? '/photosynthesis_infographic.jpg?v=10' : '/plants_infographic.jpg?v=10')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-md hover:bg-emerald-700 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" /> Expand Fullscreen
                </button>
              </div>

              <div 
                onClick={() => setModalImage(selectedInfographic === 'photosynthesis' ? '/photosynthesis_infographic.jpg?v=10' : '/plants_infographic.jpg?v=10')}
                className="relative cursor-pointer group rounded-xl overflow-hidden shadow-lg border border-slate-300"
              >
                <img 
                  src={selectedInfographic === 'photosynthesis' ? '/photosynthesis_infographic.jpg?v=10' : '/plants_infographic.jpg?v=10'} 
                  alt="Plant Infographic Poster" 
                  className="max-w-full h-auto max-h-[650px] object-contain group-hover:scale-101 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <span className="px-6 py-3 bg-white text-slate-950 font-black text-xs rounded-2xl shadow-xl flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-emerald-600" /> Click to Expand & Zoom High-Res Image
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Summary Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <Sun className="w-7 h-7 text-amber-500 shrink-0" />
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Chemical Reaction</span>
                  <h3 className="font-black text-xl text-slate-800">What is Photosynthesis?</h3>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Word origin: <strong>PHOTO</strong> = Light, <strong>SYNTHESIS</strong> = Putting together. It is the process green plants use to convert light energy into glucose sugar food.
              </p>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-black text-amber-950 text-center">
                Sunlight + Water (H₂O) + Carbon Dioxide (CO₂) → Glucose (Food) + Oxygen (O₂)
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <Sprout className="w-7 h-7 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Plant Organs</span>
                  <h3 className="font-black text-xl text-slate-800">Key Plant Parts Involved</h3>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">🍃 <strong>Leaves: </strong>Chloroplasts & Stomata</div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">🪵 <strong>Stem: </strong>Xylem & Phloem transport</div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">🌱 <strong>Roots: </strong>Water & mineral absorption</div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">🌸 <strong>Flowers: </strong>Seeds & Reproduction</div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ==================================== TAB 2: PHOTOSYNTHESIS MASTERCLASS ==================================== */}
      {activeTab === 'photosynthesis_master' && (
        <div className="space-y-8">
          
          {/* Photosynthesis 6 Step Interactive Flow */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-md">
                Step-by-Step Mechanism
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-2">The 6 Steps of Photosynthesis</h2>
              <p className="text-slate-500 text-xs mt-1">Click on each step to track how water, carbon dioxide, and sunlight transform into glucose sugar and oxygen.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {processSteps.map((s) => (
                <button
                  key={s.step}
                  onClick={() => setSelectedProcessStep(s.step)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    selectedProcessStep === s.step
                      ? 'bg-emerald-600 border-emerald-500 text-white font-black shadow-lg scale-102'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-2xl">{s.icon}</div>
                  <div className="font-extrabold text-xs mt-1">{s.title}</div>
                </button>
              ))}
            </div>

            {/* Selected Process Step Card */}
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded">
                  Step #{currentStepData.step} of 6
                </span>
                <button
                  onClick={() => speakText(`${currentStepData.title}. ${currentStepData.desc}`)}
                  className="p-2 rounded-xl bg-white text-emerald-700 hover:bg-emerald-100 transition-all cursor-pointer shadow-sm"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-xl font-black text-emerald-950 flex items-center gap-2">
                <span>{currentStepData.icon}</span> {currentStepData.title}
              </h3>
              <p className="text-xs leading-relaxed text-emerald-900 font-semibold">{currentStepData.desc}</p>
            </div>
          </div>

          {/* Photosynthesis vs Respiration Comparison Table */}
          <div className="bg-slate-950 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950 px-3 py-1 rounded-md border border-emerald-800">
                Cellular Energy Comparison
              </span>
              <h2 className="text-2xl font-black text-white mt-2 flex items-center gap-2">
                ⚡ Photosynthesis vs Respiration
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Photosynthesis STORES energy in glucose during daytime, while Respiration RELEASES energy 24/7 for cell work!
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900 text-slate-300 border-b border-slate-800 font-extrabold">
                    <th className="p-3">Feature</th>
                    <th className="p-3 text-emerald-400">☀️ Photosynthesis (Making Food)</th>
                    <th className="p-3 text-amber-400">🔥 Respiration (Using Energy)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                  {comparisonData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50">
                      <td className="p-3 font-black text-white">{row.feature}</td>
                      <td className="p-3 text-emerald-300 font-semibold">{row.photo}</td>
                      <td className="p-3 text-amber-300 font-semibold">{row.resp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Leaf Anatomy & Factors Affecting Photosynthesis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                🔬 Microscopic Leaf Anatomy
              </h3>
              <div className="space-y-2 text-xs">
                {leafLayers.map((ll, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-medium">
                    <div className="font-bold text-slate-900">{ll.name}</div>
                    <div className="text-slate-600 mt-0.5">{ll.role}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                🌡️ 5 Factors Affecting Photosynthesis Rate
              </h3>
              <div className="space-y-2 text-xs">
                {factorsList.map((f, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 font-medium">
                    <div className="font-bold text-emerald-950">{f.factor}</div>
                    <div className="text-emerald-900 mt-0.5">{f.impact}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ==================================== TAB 3: PLANT ORGANS & TRANSPORT ==================================== */}
      {activeTab === 'plant_parts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {plantParts.map((p) => (
              <div 
                key={p.id} 
                onClick={() => setSelectedPart(p.id)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-2 relative group ${
                  selectedPart === p.id ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-102' : 'bg-white border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="text-3xl">{p.icon}</div>
                <h3 className={`font-black text-sm ${selectedPart === p.id ? 'text-white' : 'text-slate-800'}`}>{p.name}</h3>
                <div className={`text-[10px] font-bold ${selectedPart === p.id ? 'text-emerald-100' : 'text-emerald-600'}`}>{p.mainRole}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentPartData.icon}</span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                    Plant Anatomy & Function
                  </span>
                  <h2 className="text-2xl font-black text-slate-800 mt-1">{currentPartData.name}</h2>
                </div>
              </div>
              <button
                onClick={() => speakText(`${currentPartData.name}. Main role: ${currentPartData.mainRole}. Summary: ${currentPartData.summary}. ${currentPartData.details.join(' ')}`)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800 transition-all cursor-pointer"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Primary Function</div>
              <div className="font-extrabold text-emerald-950 text-sm leading-relaxed">{currentPartData.summary}</div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Detailed Botanical Features</h4>
              {currentPartData.details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-medium leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB 4: FLOWER ANATOMY ==================================== */}
      {activeTab === 'flower_anatomy' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
                Reproductive Structure
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">Flower Anatomy & Reproductive Organs</h2>
              <p className="text-slate-500 text-xs mt-1">Flowers contain specialized male and female organs to facilitate pollination and fertilisation!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {flowerAnatomy.map((fa, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-base text-slate-900">{fa.part}</h3>
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-100 px-2 py-0.5 rounded">{fa.sub}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium pt-1">{fa.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3 text-xs text-amber-900">
              <div className="font-black text-sm text-amber-950">Pollination vs Fertilisation Breakdown</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded-xl border border-amber-100 space-y-1">
                  <div className="font-bold text-amber-900">1. Pollination</div>
                  <p>The transfer of pollen grains from the male <strong>anther</strong> to the sticky female <strong>stigma</strong> (by bees, wind, or animals).</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-amber-100 space-y-1">
                  <div className="font-bold text-amber-900">2. Fertilisation</div>
                  <p>The male cell inside pollen travels down the style to join the female egg cell inside the <strong>ovule</strong>. (Ovary becomes fruit; Ovules become seeds).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB 5: 9 LIFE CYCLE STAGES ==================================== */}
      {activeTab === 'lifecycles' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                Reproductive Stages
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">9 Stages of the Flowering Plant Life Cycle</h2>
              <p className="text-slate-500 text-xs mt-1">From seed germination to pollination, fruit formation, and seed dispersal.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {lifeCycleSteps.map((lc, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1">
                  <div className="font-black text-xs text-emerald-900">{lc.step}</div>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{lc.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-slate-800 text-base">Remarkable Plant Adaptations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {plantAdaptations.map((pa, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-black text-sm text-emerald-900">{pa.plant}</div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded inline-block">{pa.habitat}</div>
                  <p className="text-xs text-slate-600 font-medium pt-1">{pa.adaptation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB 6: KNOWLEDGE CHECK QUIZ ==================================== */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-800">Plants & Photosynthesis Knowledge Check</h2>
              <p className="text-slate-500 text-xs mt-1">Test your understanding of photosynthesis inputs/outputs, leaf stomata, xylem/phloem, and plant life cycles.</p>
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
      {modalImage && (
        <div 
          onClick={() => setModalImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col animate-fade-in select-none p-4 md:p-6"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-slate-900/90 border border-slate-800 rounded-2xl px-6 py-3.5 flex items-center justify-between gap-4 shrink-0 mb-4 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                🖼️ High-Res Chart View
              </span>
              <div>
                <h3 className="font-extrabold text-white text-sm">
                  {modalImage.includes('photosynthesis') 
                    ? 'Photosynthesis in Plants - How Plants Make Their Own Food Infographic' 
                    : 'Plants: Parts, Functions and Life Cycles Infographic'}
                </h3>
                <p className="text-slate-400 text-[11px]">Official Science Reference Guide</p>
              </div>
            </div>

            {/* Toggle chart inside modal */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setModalImage(modalImage.includes('photosynthesis') ? '/plants_infographic.jpg?v=10' : '/photosynthesis_infographic.jpg?v=10')}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs border border-slate-700 transition-all cursor-pointer"
              >
                Switch to {modalImage.includes('photosynthesis') ? 'Plant Life Cycles Chart' : 'Photosynthesis Chart'}
              </button>
              <button 
                onClick={() => setModalImage(null)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition-all shadow-lg shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <X className="w-4 h-4" /> Close
              </button>
            </div>
          </div>

          <div 
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center overflow-auto"
          >
            <img 
              src={modalImage} 
              alt="Plant Infographic" 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2 border-slate-700/50 object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
