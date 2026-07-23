import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  RotateCcw, 
  Award, 
  X,
  Trees,
  Sun,
  Droplets,
  Wind,
  ShieldAlert,
  Globe,
  Recycle,
  Sprout
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function EcosystemsHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRole, setSelectedRole] = useState('producer');
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

  // Food Chain Roles
  const rolesInEcosystem = [
    {
      id: 'producer',
      name: 'Producers (Autotrophs)',
      icon: '🌱',
      energyRole: 'Makes food via Photosynthesis',
      examples: 'Green trees, grass, terrestrial plants, aquatic algae, phytoplankton.',
      summary: 'Producers absorb solar energy from the Sun and convert carbon dioxide and water into glucose sugars and oxygen. They form the foundational base of all food chains.',
      details: [
        'Do not need to eat other organisms to survive.',
        'Convert solar energy into chemical energy stored in plant tissue.',
        'Without producers, no other animal life could exist on Earth!'
      ]
    },
    {
      id: 'primary_consumer',
      name: 'Primary Consumers (Herbivores)',
      icon: '🐇',
      energyRole: 'Eats Producers (Plants)',
      examples: 'Rabbits, kangaroos, grasshoppers, cows, caterpillars, small herbivorous fish.',
      summary: 'Primary consumers are plant-eating animals that gain energy directly by consuming producers.',
      details: [
        'Have digestive systems adapted for breaking down tough plant cellulose.',
        'Transfer energy from plant tissues to animal biomass.',
        'Act as prey for secondary consumers.'
      ]
    },
    {
      id: 'secondary_consumer',
      name: 'Secondary Consumers (Carnivores/Omnivores)',
      icon: '🐸',
      energyRole: 'Eats Primary Consumers',
      examples: 'Frogs, small birds, snakes, lizards, foxes, medium fish.',
      summary: 'Secondary consumers hunt and eat primary consumers (herbivores) or consume both plants and animals.',
      details: [
        'Keep herbivore populations balanced so overgrazing does not destroy plant habitats.',
        'May be carnivores (meat-only) or omnivores (plant and meat eaters).'
      ]
    },
    {
      id: 'tertiary_consumer',
      name: 'Tertiary Consumers (Apex Predators)',
      icon: '🦅',
      energyRole: 'Top Predators',
      examples: 'Eagles, hawks, owls, lions, sharks, crocodiles, wolves.',
      summary: 'Tertiary consumers sit at the highest trophic level of the food chain with few or no natural predators.',
      details: [
        'Regulate the entire ecosystem by controlling numbers of secondary and primary consumers.',
        'Require large territories and abundant prey populations to survive.'
      ]
    },
    {
      id: 'decomposer',
      name: 'Decomposers (Recyclers)',
      icon: '🍄',
      energyRole: 'Recycles Dead Organic Matter',
      examples: 'Mushrooms (fungi), earthworms, soil bacteria, dung beetles.',
      summary: 'Decomposers break down dead plants, animal carcasses, and waste into essential minerals and soil nutrients.',
      details: [
        'Act as nature\'s ultimate waste management system.',
        'Return nitrogen, phosphorus, and carbon back to the soil so green plants can absorb them and grow again!'
      ]
    }
  ];

  // Types of Ecosystems
  const ecosystemTypes = [
    { name: 'Forest Ecosystem 🌲', desc: 'Dense canopy of trees supporting koalas, birds, insects, deer, fungi, and rich leaf-litter soil.' },
    { name: 'Grassland Ecosystem 🌾', desc: 'Open grassy plains with sparse trees, supporting kangaroos, rabbits, grazing livestock, and birds of prey.' },
    { name: 'Freshwater Pond Ecosystem 🐸', desc: 'Standing fresh water supporting lily pads, algae, frogs, ducks, tadpoles, dragonflies, and fish.' },
    { name: 'Ocean Marine Ecosystem 🌊', desc: 'Earth\'s largest ecosystem containing saltwater, coral reefs, sea turtles, whales, dolphins, and octopuses.' }
  ];

  // Biotic vs Abiotic Factors
  const bioticAbiotic = [
    { type: 'Biotic Factors (Living Things) 🐾', desc: 'All living organisms that grow, reproduce, and require energy.', items: 'Plants, Animals, Fungi, Microorganisms (Bacteria & Protists)' },
    { type: 'Abiotic Factors (Non-Living Environment) ☀️', desc: 'Non-living physical and chemical components that support life.', items: 'Sunlight, Water, Air (Oxygen & CO₂), Soil, Rocks, Rain, Temperature' }
  ];

  // Food Chains vs Food Webs
  const chainVsWeb = [
    { type: 'Food Chain 🔗', desc: 'A single linear sequence showing how energy passes directly from one organism to another (e.g. Sun → Grass → Grasshopper → Frog → Snake → Eagle).' },
    { type: 'Food Web 🕸️', desc: 'A complex network of interconnected, overlapping food chains representing all feeding relationships in a real natural community.' }
  ];

  // Quiz Questions
  const quizQuestions = [
    {
      id: 1,
      q: 'What is the scientific term for an organism that makes its own food using sunlight via Photosynthesis?',
      options: ['Consumer', 'Producer (Autotroph)', 'Decomposer', 'Apex Predator'],
      ans: 'Producer (Autotroph)'
    },
    {
      id: 2,
      q: 'Which of the following is an ABIOTIC (non-living) factor in a forest ecosystem?',
      options: ['Koala', 'Sunlight & Rain', 'Mushroom', 'Oak tree'],
      ans: 'Sunlight & Rain'
    },
    {
      id: 3,
      q: 'What vital role do Decomposers (like fungi and earthworms) play in an ecosystem?',
      options: [
        'They break down dead matter and return nutrients back to the soil',
        'They eat live eagles',
        'They produce sunlight',
        'They freeze water into ice'
      ],
      ans: 'They break down dead matter and return nutrients back to the soil'
    },
    {
      id: 4,
      q: 'How does Energy flow through a food chain?',
      options: [
        'Energy flows in ONE direction starting from the Sun, decreasing at each level as heat',
        'Energy goes backward from eagles to grass',
        'Energy increases at every level',
        'Energy comes from rocks'
      ],
      ans: 'Energy flows in ONE direction starting from the Sun, decreasing at each level as heat'
    },
    {
      id: 5,
      q: 'What is the difference between a Food Chain and a Food Web?',
      options: [
        'A food chain is a single pathway; a food web is a network of many connected food chains',
        'A food chain is underwater; a food web is on land',
        'Food webs only contain plants',
        'There is no difference'
      ],
      ans: 'A food chain is a single pathway; a food web is a network of many connected food chains'
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

  const currentRoleData = rolesInEcosystem.find(r => r.id === selectedRole) || rolesInEcosystem[0];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-green-800 p-8 text-white shadow-xl shadow-emerald-600/10">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-yellow-300" /> Science Academy • Grade 4 Environmental Science
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Ecosystems & Energy Flow 🌾🌲🌊
          </h1>
          <p className="text-emerald-100 text-sm md:text-base max-w-3xl font-medium leading-relaxed">
            An ecosystem is a community of living things (biotic) interacting with each other and their non-living environment (abiotic). Energy flows in one direction, while matter is continuously recycled!
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={() => speakText("Ecosystems: Living Things, Food Chains and the Flow of Matter. Everything in an ecosystem is connected. Producers make food, consumers eat other organisms, and decomposers recycle nutrients back into the soil.")}
              className="px-4 py-2 rounded-xl bg-white text-emerald-950 font-extrabold text-xs flex items-center gap-2 hover:bg-emerald-50 transition-all shadow-md cursor-pointer"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
              {isPlayingAudio ? 'Stop Audio' : 'Listen to Overview'}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-900/80 text-white font-extrabold text-xs flex items-center gap-2 border border-emerald-400/30 transition-all cursor-pointer"
            >
              🖼️ View Full Infographic Chart
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Roles in Food Chains', icon: '🌱' },
          { id: 'infographic', label: 'Full Infographic Chart', icon: '🖼️' },
          { id: 'types', label: '4 Major Ecosystem Types', icon: '🌊' },
          { id: 'biotic_abiotic', label: 'Biotic vs Abiotic Factors', icon: '☀️' },
          { id: 'foodwebs', label: 'Food Chains vs Food Webs', icon: '🕸️' },
          { id: 'matter_energy', label: 'Energy Flow & Matter Recycling', icon: '♻️' },
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

      {/* ==================================== TAB 1: ROLES IN FOOD CHAINS ==================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Quick Banner */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-4 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌾</span>
              <div>
                <h4 className="font-extrabold text-sm">Official Ecosystems Infographic Included</h4>
                <p className="text-emerald-100 text-xs">View the high-resolution infographic chart detailing food chains, food webs, energy flow, and nutrient cycling.</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('infographic')}
              className="px-4 py-2 rounded-xl bg-white text-emerald-950 font-black text-xs hover:bg-emerald-50 transition-all shrink-0 cursor-pointer shadow-sm"
            >
              View Infographic Chart →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {rolesInEcosystem.map((r) => (
              <div 
                key={r.id} 
                onClick={() => setSelectedRole(r.id)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-2 relative group ${
                  selectedRole === r.id ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg scale-102' : 'bg-white border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="text-3xl">{r.icon}</div>
                <h3 className={`font-black text-sm ${selectedRole === r.id ? 'text-white' : 'text-slate-800'}`}>{r.name}</h3>
                <div className={`text-[10px] font-bold ${selectedRole === r.id ? 'text-emerald-100' : 'text-emerald-600'}`}>{r.energyRole}</div>
              </div>
            ))}
          </div>

          {/* Interactive Role Detail Panel */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentRoleData.icon}</span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    Trophic Level Role • {currentRoleData.energyRole}
                  </span>
                  <h2 className="text-2xl font-black text-slate-800 mt-1">{currentRoleData.name}</h2>
                </div>
              </div>
              <button
                onClick={() => speakText(`${currentRoleData.name}. Role: ${currentRoleData.energyRole}. ${currentRoleData.summary}. Examples: ${currentRoleData.examples}`)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800 transition-all cursor-pointer"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Scientific Summary</div>
              <div className="font-bold text-emerald-950 text-xs md:text-sm leading-relaxed">{currentRoleData.summary}</div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Key Biological Functions</h4>
              {currentRoleData.details.map((d, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-medium leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{d}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Famous Examples</div>
              <div className="text-slate-700 font-medium text-xs leading-relaxed">{currentRoleData.examples}</div>
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
              <h2 className="text-2xl font-black text-slate-800 mt-1">Ecosystems: Living Things & Food Chains Infographic</h2>
              <p className="text-slate-500 text-xs mt-1">Official high-resolution diagram detailing biotic/abiotic factors, food chains, food webs, energy flow, and decomposers.</p>
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
              src="/ecosystems_infographic.jpg" 
              alt="Ecosystems Infographic Chart" 
              className="max-w-full h-auto rounded-xl shadow-lg border border-white max-h-[800px] object-contain group-hover:scale-101 transition-transform"
            />
          </div>
        </div>
      )}

      {/* ==================================== TAB: TYPES OF ECOSYSTEMS ==================================== */}
      {activeTab === 'types' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ecosystemTypes.map((e, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <h3 className="font-black text-base text-slate-900">{e.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{e.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* ==================================== TAB: BIOTIC VS ABIOTIC ==================================== */}
      {activeTab === 'biotic_abiotic' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bioticAbiotic.map((ba, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-black text-lg text-slate-900">{ba.type}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{ba.desc}</p>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs font-bold text-emerald-950">
                Examples: {ba.items}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==================================== TAB: FOOD CHAINS VS WEBS ==================================== */}
      {activeTab === 'foodwebs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {chainVsWeb.map((cw, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-black text-lg text-slate-900">{cw.type}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{cw.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* ==================================== TAB: MATTER & ENERGY ==================================== */}
      {activeTab === 'matter_energy' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-xl text-slate-800 flex items-center gap-2">
              <Sun className="w-6 h-6 text-amber-500" /> One-Way Energy Flow (Decreases at Each Level)
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Energy enters ecosystems from the Sun. Plants convert ~1% of sunlight into food energy. As animals eat plants and each other, only about <strong>10% of energy</strong> is passed to the next trophic level—the remaining 90% is used for movement, breathing, growth, and lost as body heat!
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-xl text-slate-800 flex items-center gap-2">
              <Recycle className="w-6 h-6 text-emerald-600" /> Continuous Recycling of Matter
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Unlike energy, <strong>matter is never lost or destroyed—it is continuously recycled</strong>! Soil nutrients $\rightarrow$ Plants $\rightarrow$ Herbivores $\rightarrow$ Predators $\rightarrow$ Decomposers break down dead matter $\rightarrow$ Nutrients returned to soil.
            </p>
          </div>
        </div>
      )}

      {/* ==================================== TAB: QUIZ ==================================== */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-800">Ecosystems Knowledge Check</h2>
              <p className="text-slate-500 text-xs mt-1">Test your understanding of producers, consumers, decomposers, and energy flow.</p>
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
                <h3 className="font-extrabold text-white text-sm">Ecosystems: Living Things & Food Chains Infographic</h3>
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
              src="/ecosystems_infographic.jpg" 
              alt="Ecosystems Infographic" 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2 border-slate-700/50 object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
