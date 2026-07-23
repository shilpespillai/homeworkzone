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
  Trash2,
  Heart,
  Globe,
  Compass,
  Lightbulb,
  Search
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ConservationHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSpecies, setSelectedSpecies] = useState('green');
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

  // 5 Sea Turtle Species
  const turtleSpecies = [
    {
      id: 'green',
      name: 'Green Turtle 🐢',
      diet: 'Herbivore / Seagrass & Algae',
      role: 'Seagrass Meadow Gardener',
      summary: 'Green turtles graze on seagrass beds, trimming grass blades to encourage fresh growth and nutrient cycling across ocean floors.',
      details: [
        'Adults are strictly herbivorous, feeding on marine seagrasses and macroalgae.',
        'Trimming seagrass maintains healthy breeding grounds for juvenile fish and invertebrates.',
        'Can weigh up to 180 kg and live for over 80 years!'
      ]
    },
    {
      id: 'loggerhead',
      name: 'Loggerhead Turtle 🐢',
      diet: 'Omnivore / Crabs & Shellfish',
      role: 'Crustacean Population Controller',
      summary: 'Equipped with powerful massive jaws designed to crush hard-shelled prey like crabs, clams, and sea urchins.',
      details: [
        'Named for their exceptionally large head and heavy muscular jaws.',
        'Recycles nutrients into the ocean floor when breaking open hard shells.',
        'Found in tropical and temperate ocean waters worldwide.'
      ]
    },
    {
      id: 'hawksbill',
      name: 'Hawksbill Turtle 🐢',
      diet: 'Spongivore / Marine Sponges',
      role: 'Coral Reef Protector',
      summary: 'Hawksbill turtles use their narrow bird-like beak to pick sea sponges out of narrow crevices in coral reefs.',
      details: [
        'By consuming invasive sponges, they prevent sponges from smothering fragile living corals.',
        'Highly endangered due to historic poaching for their beautiful patterned "tortoiseshell".',
        'Crucial for maintaining high coral reef biodiversity.'
      ]
    },
    {
      id: 'flatback',
      name: 'Flatback Turtle 🐢',
      diet: 'Carnivore / Crabs, Prawns & Soft Corals',
      role: 'Australian Endemic Marine Reptile',
      summary: 'Endemic exclusively to the northern continental shelf waters of Australia and Papua New Guinea.',
      details: [
        'Named for its distinctively flat, smooth carapace (shell) with upturned edges.',
        'Prefers shallow muddy and coastal waters rather than deep oceanic zones.',
        'Nests exclusively on tropical Australian beaches!'
      ]
    },
    {
      id: 'leatherback',
      name: 'Leatherback Turtle 🐢',
      diet: 'Gelatinovore / Jellyfish Specialist',
      role: 'Jellyfish Population Regulator',
      summary: 'The largest sea turtle on Earth! Instead of a hard bony shell, it has a tough leathery skin covering a flexible cartilaginous matrix.',
      details: [
        'Can grow up to 2 meters long and weigh over 700 kg!',
        'Feeds almost exclusively on jellyfish, consuming its own body weight in jellyfish daily.',
        'Critically threatened by plastic bags floating in ocean water, which look identical to jellyfish.'
      ]
    }
  ];

  // Life Cycle Steps
  const lifeCycleSteps = [
    { step: '1. Nesting Female 🏖️', desc: 'Adult female comes ashore at night on sandy beaches.' },
    { step: '2. Digging Nest ⏳', desc: 'Scoops out a deep flask-shaped nest cavity above the high tide line.' },
    { step: '3. Laying Eggs 🪺', desc: 'Lays 80 to 120 leathery ping-pong ball-sized eggs, then carefully covers the nest with sand.' },
    { step: '4. Return to Ocean 🌊', desc: 'Female crawls back into the surf, leaving eggs to incubate in warm sand for 50-60 days.' },
    { step: '5. Hatching 🐣', desc: 'Baby turtles hatch simultaneously underground and dig upward to the surface.' },
    { step: '6. Moonlight Ocean Crawl 🌙', desc: 'Hatchlings emerge at night and navigate toward the ocean by following natural moonlight reflecting off the water.' },
    { step: '7. Open Ocean Growth 🌊', desc: 'Young turtles spend 10-20 years in open ocean currents before returning to coastal feeding grounds.' },
    { step: '8. Philopatry Return 🧭', desc: 'Mature adults migrate thousands of kilometers back to the EXACT beach where they were born to lay the next generation!' }
  ];

  // Threats vs Community Solutions
  const threatsSolutions = [
    { threat: 'Plastic Pollution 🛍️', impact: 'Turtles mistake plastic bags for jellyfish, causing fatal stomach blockages.', solution: 'Reduce single-use plastic, use canvas bags, and pick up beach litter.' },
    { threat: 'Artificial Beach Lighting 💡', impact: 'Bright streetlights disorient hatchlings, leading them toward roads instead of the sea.', solution: 'Turn off outdoor beach lights or use low-level warm/red amber lighting.' },
    { threat: 'Fishing Nets & Bycatch 🕸️', impact: 'Turtles get tangled in discarded ghost nets and drown because they cannot surface for air.', solution: 'Use Turtle Excluder Devices (TEDs) on fishing trawlers and clean ghost nets.' },
    { threat: 'Coastal Development & Dune Loss 🏗️', impact: 'Vehicles and foot traffic crush underground nests and destroy sand dunes.', solution: 'Build elevated wooden boardwalks, fence off nesting zones, and prohibit beach vehicles.' }
  ];

  // Quiz Questions
  const quizQuestions = [
    {
      id: 1,
      q: 'Why are Leatherback Sea Turtles especially vulnerable to floating plastic bag pollution in the ocean?',
      options: [
        'Because floating plastic bags look exactly like jellyfish, their main food source',
        'Because plastic bags cut their flippers',
        'Because plastic bags block moonlight',
        'Because leatherbacks eat plastic for energy'
      ],
      ans: 'Because floating plastic bags look exactly like jellyfish, their main food source'
    },
    {
      id: 2,
      q: 'How do newly hatched baby sea turtles find their way to the ocean at night?',
      options: [
        'By following the natural reflection of moonlight on the ocean water',
        'By listening to car horns on roads',
        'By following bright streetlights on land',
        'By smelling palm trees'
      ],
      ans: 'By following the natural reflection of moonlight on the ocean water'
    },
    {
      id: 3,
      q: 'Which species of sea turtle has a sharp bird-like beak used to eat sea sponges on coral reefs?',
      options: ['Hawksbill Turtle', 'Green Turtle', 'Flatback Turtle', 'Leatherback Turtle'],
      ans: 'Hawksbill Turtle'
    },
    {
      id: 4,
      q: 'What extraordinary navigation feat do adult female sea turtles perform when ready to lay eggs?',
      options: [
        'They return thousands of kilometers to the exact beach where they were born (Philopatry)',
        'They lay eggs on floating iceberg ice',
        'They lay eggs in deep underwater caves',
        'They lay eggs in river mud'
      ],
      ans: 'They return thousands of kilometers to the exact beach where they were born (Philopatry)'
    },
    {
      id: 5,
      q: 'How many of the world\'s 7 sea turtle species are found in Australian waters?',
      options: ['6 out of 7 species', '1 out of 7 species', 'All 15 species', 'None'],
      ans: '6 out of 7 species'
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

  const currentSpeciesData = turtleSpecies.find(s => s.id === selectedSpecies) || turtleSpecies[0];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-700 via-emerald-700 to-cyan-800 p-8 text-white shadow-xl shadow-teal-600/10">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-yellow-300" /> Science Academy • Grade 4 Marine Biology & Conservation
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Conservation: Protect Sea Turtles 🐢🌊
          </h1>
          <p className="text-teal-100 text-sm md:text-base max-w-3xl font-medium leading-relaxed">
            Sea turtles are ancient marine reptiles that have roamed Earth's oceans for over 100 million years. Discover their vital ecological roles, nesting life cycles, threats, and community action plans!
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={() => speakText("Conservation: How Can Our Community Protect Sea Turtles? Sea turtles are ancient marine reptiles. They keep seagrass healthy, control jellyfish, and maintain coral reefs. We can protect them by reducing plastic, turning off beach lights, and protecting nesting dunes.")}
              className="px-4 py-2 rounded-xl bg-white text-teal-950 font-extrabold text-xs flex items-center gap-2 hover:bg-teal-50 transition-all shadow-md cursor-pointer"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-teal-700" />}
              {isPlayingAudio ? 'Stop Audio' : 'Listen to Overview'}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-teal-900/60 hover:bg-teal-900/80 text-white font-extrabold text-xs flex items-center gap-2 border border-teal-400/30 transition-all cursor-pointer"
            >
              🖼️ View Full Infographic Chart
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Meet the 5 Species', icon: '🐢' },
          { id: 'infographic', label: 'Full Infographic Chart', icon: '🖼️' },
          { id: 'lifecycle', label: 'Nesting Life Cycle', icon: '🪺' },
          { id: 'importance', label: 'Why Turtles Matter', icon: '🌿' },
          { id: 'threats', label: 'Threats & Community Solutions', icon: '🛡️' },
          { id: 'action', label: 'What You Can Do', icon: '♻️' },
          { id: 'quiz', label: 'Knowledge Check Quiz', icon: '🏆' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20 scale-102'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* ==================================== TAB 1: MEET THE SPECIES ==================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Quick Banner */}
          <div className="bg-gradient-to-r from-teal-600 to-cyan-700 rounded-2xl p-4 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🐢</span>
              <div>
                <h4 className="font-extrabold text-sm">Official Sea Turtle Conservation Infographic Included</h4>
                <p className="text-teal-100 text-xs">View the high-resolution infographic chart detailing sea turtle species, nesting life cycle, threats, turtle-friendly beaches, and science fieldwork.</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('infographic')}
              className="px-4 py-2 rounded-xl bg-white text-teal-950 font-black text-xs hover:bg-teal-50 transition-all shrink-0 cursor-pointer shadow-sm"
            >
              View Infographic Chart →
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {turtleSpecies.map((s) => (
              <div 
                key={s.id} 
                onClick={() => setSelectedSpecies(s.id)}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer space-y-1 ${
                  selectedSpecies === s.id ? 'bg-teal-600 border-teal-600 text-white shadow-lg scale-105' : 'bg-white border-slate-200 hover:border-teal-300'
                }`}
              >
                <div className="font-black text-xs">{s.name}</div>
                <div className={`text-[10px] font-bold ${selectedSpecies === s.id ? 'text-teal-100' : 'text-teal-600'}`}>{s.role}</div>
              </div>
            ))}
          </div>

          {/* Interactive Species Detail Panel */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                  Ecological Profile • {currentSpeciesData.diet}
                </span>
                <h2 className="text-2xl font-black text-slate-800 mt-1">{currentSpeciesData.name}</h2>
              </div>
              <button
                onClick={() => speakText(`${currentSpeciesData.name}. Role: ${currentSpeciesData.role}. ${currentSpeciesData.summary}. ${currentSpeciesData.details.join(' ')}`)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-teal-100 hover:text-teal-800 transition-all cursor-pointer"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-teal-700">Ecological Importance</div>
              <div className="font-bold text-teal-950 text-xs md:text-sm leading-relaxed">{currentSpeciesData.summary}</div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Key Species Characteristics</h4>
              {currentSpeciesData.details.map((d, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-medium leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
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
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md">
                Official Visual Reference
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">Conservation: Protecting Sea Turtles Infographic</h2>
              <p className="text-slate-500 text-xs mt-1">Official high-resolution diagram detailing sea turtle species, nesting life cycle, threats, turtle-friendly beaches, and citizen science.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 text-white font-extrabold text-xs shadow-md shadow-teal-500/20 hover:bg-teal-700 transition-all flex items-center gap-2 cursor-pointer"
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
              src="/conservation_infographic.jpg" 
              alt="Conservation Infographic Chart" 
              className="max-w-full h-auto rounded-xl shadow-lg border border-white max-h-[800px] object-contain group-hover:scale-101 transition-transform"
            />
          </div>
        </div>
      )}

      {/* ==================================== TAB: NESTING LIFE CYCLE ==================================== */}
      {activeTab === 'lifecycle' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md">
              Reproductive Cycle
            </span>
            <h2 className="text-2xl font-black text-slate-800 mt-1">8 Stages of the Sea Turtle Life Cycle</h2>
            <p className="text-slate-500 text-xs mt-1">From egg laying in warm sand dunes to navigating open oceans and returning to their birth beach!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {lifeCycleSteps.map((lc, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="font-black text-xs text-teal-900">{lc.step}</div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{lc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================== TAB: THREATS & SOLUTIONS ==================================== */}
      {activeTab === 'threats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {threatsSolutions.map((ts, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <h3 className="font-black text-base text-rose-900">{ts.threat}</h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">{ts.impact}</p>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs font-bold text-emerald-950">
                  <strong>Community Solution: </strong>{ts.solution}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================== TAB: WHAT YOU CAN DO ==================================== */}
      {activeTab === 'action' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-teal-600" />
            <div>
              <h2 className="text-2xl font-black text-slate-800">What You Can Do (Personal Action Plan)</h2>
              <p className="text-slate-500 text-xs">Small everyday actions create a massive positive impact for ocean wildlife!</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-semibold">
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 text-teal-950 space-y-1">
              <div className="font-black text-sm text-teal-900">🧹 Pick Up Beach Litter</div>
              <p>Remove plastic bottles, food wrappers, and fishing lines before high tide washes them into the ocean.</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-amber-950 space-y-1">
              <div className="font-black text-sm text-amber-900">💡 Turn Off Bright Lights</div>
              <p>Turn off bright coastal house lights during nesting season so hatchlings follow moonlight to the sea.</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-950 space-y-1">
              <div className="font-black text-sm text-emerald-900">🚯 Reduce Single-Use Plastic</div>
              <p>Use reusable cloth bags and stainless steel water bottles to stop plastic waste at its source.</p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB: QUIZ ==================================== */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-800">Conservation Knowledge Check</h2>
              <p className="text-slate-500 text-xs mt-1">Test your understanding of sea turtle species, nesting life cycles, threats, and conservation solutions.</p>
            </div>
            {quizScore !== null && (
              <div className="px-4 py-2 rounded-2xl bg-teal-100 text-teal-800 font-black text-sm flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-600" /> Score: {quizScore} / {quizQuestions.length}
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
                          ? 'bg-teal-600 border-teal-600 text-white shadow-sm'
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
              className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-extrabold text-xs shadow-lg shadow-teal-500/20 disabled:opacity-40 cursor-pointer"
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
              <span className="p-2 rounded-xl bg-teal-500/20 text-teal-400 font-bold text-xs">
                🖼️ Full Chart View
              </span>
              <div>
                <h3 className="font-extrabold text-white text-sm">Conservation: How Can Our Community Protect Sea Turtles? Infographic</h3>
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
              src="/conservation_infographic.jpg" 
              alt="Conservation Infographic" 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2 border-slate-700/50 object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
