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
  Sprout
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PlantsHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPart, setSelectedPart] = useState('leaves');
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

  // Plant Parts & Functions
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
    { step: '2. Germination  🌱', desc: 'Seed absorbs water, swells, and sprouts roots downward and a shoot upward when receiving Water, Oxygen, and Warmth (WOW).' },
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
    { plant: 'Cactus 🌵', habitat: 'Hot Desert', adaptation: 'Thick fleshy stem stores water; sharp spines reduce transpiration water loss and deter herbivores.' },
    { plant: 'Water Lily 🪷', habitat: 'Aquatic Ponds', adaptation: 'Broad floating leaves with stomata on top to absorb sunlight and air on water surface.' },
    { plant: 'Climbing Vine / Ivy 🌿', habitat: 'Dense Forests', adaptation: 'Coiling tendrils anchor to tree trunks to climb high into sunny canopy layers.' },
    { plant: 'Mangrove 🪵', habitat: 'Muddy Salty Swamps', adaptation: 'Specialized breathing roots (pneumatophores) grow upward out of mud to absorb atmospheric oxygen.' },
    { plant: 'Conifer (Pine) 🌲', habitat: 'Cold Snowy Regions', adaptation: 'Needle-like leaves with thick waxy cuticles withstand freezing temperatures and prevent snow breakage.' }
  ];

  // Quiz Questions
  const quizQuestions = [
    {
      id: 1,
      q: 'Which process describes plants using sunlight, water, and carbon dioxide to make glucose food in their leaves?',
      options: ['Germination', 'Photosynthesis', 'Pollination', 'Transpiration'],
      ans: 'Photosynthesis'
    },
    {
      id: 2,
      q: 'Which flower part is sticky and catches pollen grains brought by insects or wind?',
      options: ['Anther', 'Sepal', 'Stigma', 'Filament'],
      ans: 'Stigma'
    },
    {
      id: 3,
      q: 'After successful fertilisation in a flower, what does the Ovary develop into?',
      options: ['A Seed', 'A Fruit', 'A Root', 'A Sepal'],
      ans: 'A Fruit'
    },
    {
      id: 4,
      q: 'What three essential conditions are required for a seed to Germinate (WOW)?',
      options: [
        'Water, Oxygen, and Suitable Warmth',
        'Fertilizer, Sugar, and Darkness',
        'Ice, Carbon Dioxide, and Salt',
        'Wind, Soil, and Insects'
      ],
      ans: 'Water, Oxygen, and Suitable Warmth'
    },
    {
      id: 5,
      q: 'How do Non-flowering Conifer plants (like pine trees) reproduce instead of using flowers?',
      options: [
        'They produce seeds inside fleshy apples',
        'They produce pollen and seeds on Cone scales',
        'They do not produce seeds at all',
        'They grow underwater'
      ],
      ans: 'They produce pollen and seeds on Cone scales'
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

  const currentPartData = plantParts.find(p => p.id === selectedPart) || plantParts[0];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 p-8 text-white shadow-xl shadow-emerald-500/10">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-yellow-300" /> Science Academy • Grade 4 Plant Biology & Botany
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Plants: Parts, Functions & Life Cycles 🌻🌱
          </h1>
          <p className="text-emerald-100 text-sm md:text-base max-w-2xl font-medium leading-relaxed">
            Plants are living things that grow, manufacture food via photosynthesis, reproduce through flowers or cones, and generate oxygen to keep Earth healthy!
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={() => speakText("Plants: Parts, Functions and Life Cycles. Plants are living things. Roots absorb water, stems transport nutrients, leaves make food through photosynthesis, and flowers produce seeds for reproduction.")}
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
          { id: 'overview', label: 'Plant Parts & Roles', icon: '🌿' },
          { id: 'infographic', label: 'Full Infographic Chart', icon: '🖼️' },
          { id: 'flower_anatomy', label: 'Flower Anatomy & Pollination', icon: '🌸' },
          { id: 'lifecycles', label: 'Life Cycles (Flowering vs Conifer)', icon: '🔄' },
          { id: 'photosynthesis', label: 'Photosynthesis & Adaptations', icon: '☀️' },
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

      {/* ==================================== TAB 1: PLANT PARTS ==================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Quick Banner */}
          <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-4 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌿</span>
              <div>
                <h4 className="font-extrabold text-sm">Official Plants Infographic Chart Included</h4>
                <p className="text-teal-100 text-xs">View the high-resolution infographic chart detailing flower parts, pollination, germination, photosynthesis, and conifer life cycles.</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('infographic')}
              className="px-4 py-2 rounded-xl bg-white text-emerald-900 font-black text-xs hover:bg-teal-50 transition-all shrink-0 cursor-pointer shadow-sm"
            >
              View Infographic Chart →
            </button>
          </div>

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

          {/* Interactive Detail Panel */}
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

      {/* ==================================== TAB: INFOGRAPHIC CHART ==================================== */}
      {activeTab === 'infographic' && (
        <div className="space-y-6 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                Official Visual Reference
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">Plants: Parts, Functions & Life Cycles Infographic</h2>
              <p className="text-slate-500 text-xs mt-1">Official high-resolution diagram detailing plant organs, flower structure, pollination, seed dispersal, and conifer cycles.</p>
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
              src="/plants_infographic.jpg" 
              alt="Plants Infographic Chart" 
              className="max-w-full h-auto rounded-xl shadow-lg border border-white max-h-[800px] object-contain group-hover:scale-101 transition-transform"
            />
          </div>
        </div>
      )}

      {/* ==================================== TAB: FLOWER ANATOMY ==================================== */}
      {activeTab === 'flower_anatomy' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
                Reproductive Structure
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">Flower Anatomy & Reproductive Parts</h2>
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

      {/* ==================================== TAB: LIFE CYCLES ==================================== */}
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
            <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
              <TreePine className="w-5 h-5 text-emerald-700" /> Flowering Plants vs Conifers (Gymnosperms)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 space-y-1">
                <div className="font-bold text-rose-900">Flowering Plants (Angiosperms)</div>
                <p className="text-rose-800">Produce flowers and enclose seeds inside fruits (e.g. apple trees, roses, sunflowers).</p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
                <div className="font-bold text-emerald-900">Conifer Trees (Gymnosperms)</div>
                <p className="text-emerald-800">Non-flowering plants that produce male & female <strong>Cones</strong>. Seeds grow on open cone scales without fruits (e.g. pine, fir, spruce).</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB: PHOTOSYNTHESIS & ADAPTATIONS ==================================== */}
      {activeTab === 'photosynthesis' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <Sun className="w-7 h-7 text-amber-500" />
              <div>
                <h3 className="font-black text-xl text-slate-800">Photosynthesis Equation & Essentials</h3>
                <p className="text-slate-500 text-xs">Plants make their own glucose food using light energy absorbed by chlorophyll.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 font-extrabold text-xs text-amber-950 text-center shadow-inner">
              Sunlight + Water (H₂O) + Carbon Dioxide (CO₂) → Glucose (Food) + Oxygen (O₂)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs font-semibold text-slate-700">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">☀️ Sunlight</div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">💧 Water</div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">💨 Air (CO₂)</div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">🧪 Soil Nutrients</div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">🌡️ Warmth</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-slate-800 text-base">Remarkable Plant Adaptations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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

      {/* ==================================== TAB: QUIZ ==================================== */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-800">Plants Knowledge Check</h2>
              <p className="text-slate-500 text-xs mt-1">Test your understanding of plant parts, photosynthesis, pollination, and life cycles.</p>
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
                <h3 className="font-extrabold text-white text-sm">Plants: Parts, Functions and Life Cycles Infographic</h3>
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
              src="/plants_infographic.jpg" 
              alt="Plants Infographic" 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2 border-slate-700/50 object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
