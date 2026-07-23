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
  Eye,
  Zap,
  ShieldCheck,
  Flame,
  Search,
  Compass,
  Rainbow
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LightHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMaterialType, setSelectedMaterialType] = useState('transparent');
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

  // Material Optics Classification
  const materialOptics = [
    {
      id: 'transparent',
      name: 'Transparent Materials 🪟',
      lightBehavior: 'Passes almost ALL light rays directly through',
      visibility: 'Objects behind can be seen clearly and sharp',
      color: 'bg-cyan-50 border-cyan-200 text-cyan-950',
      badgeBg: 'bg-cyan-600 text-white',
      summary: 'Transparent materials allow light to travel straight through without scattering.',
      details: [
        'Light rays pass through in straight parallel lines without bending erratically.',
        'Enables crystal-clear vision of objects on the opposite side.',
        'Examples: Clear glass windows, clean water, air, eye lenses, plastic wrap.'
      ]
    },
    {
      id: 'translucent',
      name: 'Translucent Materials 🌫️',
      lightBehavior: 'Passes SOME light rays, but scatters them in different directions',
      visibility: 'Objects behind appear blurry, fuzzy, or indistinct',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-950',
      badgeBg: 'bg-indigo-600 text-white',
      summary: 'Translucent materials let light pass through, but scramble light rays so you cannot see clear details.',
      details: [
        'Scatters light rays as they enter, diffusing illumination.',
        'Provides privacy while still allowing natural room lighting.',
        'Examples: Frosted bathroom glass, wax paper, parchment paper, thin tissue, sunglasses.'
      ]
    },
    {
      id: 'opaque',
      name: 'Opaque Materials 🧱',
      lightBehavior: 'Blocks ALL light rays completely (Reflects or Absorbs light)',
      visibility: 'NO light passes through; objects behind are completely hidden',
      color: 'bg-amber-50 border-amber-200 text-amber-950',
      badgeBg: 'bg-amber-700 text-white',
      summary: 'Opaque materials prevent light from traveling through them, creating dark shadows on the opposite side.',
      details: [
        'Light energy is either reflected off the surface or absorbed into heat energy.',
        'Casts dark shadows because light travels in straight lines and cannot bend around solid obstacles.',
        'Examples: Brick wall, wooden door, heavy textbook, cardboard box, metal sheet.'
      ]
    }
  ];

  // 5 Steps of Vision
  const visionSteps = [
    { step: '1. Light Source ☀️', desc: 'A light source (Sun, lamp, flame) emits light energy rays.' },
    { step: '2. Straight-Line Travel 📐', desc: 'Light rays travel outwards in perfectly straight lines across space.' },
    { step: '3. Object Reflection ⚽', desc: 'Light rays hit an object (like a soccer ball or book) and bounce off its surface.' },
    { step: '4. Enters Eyes 👁️', desc: 'The reflected light rays travel into our pupil and hit the retina at the back of the eye.' },
    { step: '5. Brain Interpretation 🧠', desc: 'The optic nerve sends electrical signals to the brain, allowing us to perceive shape, color, and size!' }
  ];

  // Reflection vs Refraction vs Absorption
  const lightBehaviors = [
    {
      title: 'Reflection 🪞',
      desc: 'Light bounces off smooth, shiny surfaces.',
      physics: 'The Law of Reflection states that the Angle of Incidence equals the Angle of Reflection!',
      examples: 'Flat mirrors, calm lake surfaces, polished silver spoons, shiny glass windows.'
    },
    {
      title: 'Refraction 🥛',
      desc: 'Light bends when passing from one transparent material to another.',
      physics: 'Occurs because light changes speed when moving between air, water, or glass lenses.',
      examples: 'Straw appearing bent inside a water glass, prisms splitting white light, magnifying glasses.'
    },
    {
      title: 'Absorption ☀️',
      desc: 'Light energy is absorbed by dark surfaces and converted into heat energy.',
      physics: 'Dark/black objects absorb almost all visible light wavelengths, making them hotter in sunlight.',
      examples: 'Black car seats getting hot in the summer, white shirts staying cooler under sunlight.'
    }
  ];

  // Colours of Light & ROYGBIV Spectrum
  const spectrumColors = [
    { name: 'Red ❤️', hex: 'bg-red-500 text-white' },
    { name: 'Orange 🧡', hex: 'bg-orange-500 text-white' },
    { name: 'Yellow 💛', hex: 'bg-yellow-400 text-slate-900' },
    { name: 'Green 💚', hex: 'bg-emerald-500 text-white' },
    { name: 'Blue 💙', hex: 'bg-blue-500 text-white' },
    { name: 'Indigo 🌌', hex: 'bg-indigo-700 text-white' },
    { name: 'Violet 💜', hex: 'bg-purple-600 text-white' }
  ];

  // Quiz Questions
  const quizQuestions = [
    {
      id: 1,
      q: 'How do we see objects around us?',
      options: [
        'Light travels from a source, reflects off objects, and enters our eyes',
        'Our eyes shoot out light beams to scan objects',
        'Light enters our ears and sends sound waves to the brain',
        'Objects emit their own glowing heat into our brain'
      ],
      ans: 'Light travels from a source, reflects off objects, and enters our eyes'
    },
    {
      id: 2,
      q: 'Is the Moon a natural light source?',
      options: [
        'No, the Moon does not produce light; it reflects sunlight like a giant mirror',
        'Yes, the Moon burns gas like the Sun',
        'Yes, the Moon has lightbulbs inside',
        'No, the Moon is made of liquid fire'
      ],
      ans: 'No, the Moon does not produce light; it reflects sunlight like a giant mirror'
    },
    {
      id: 3,
      q: 'What type of material allows SOME light through, causing objects behind to appear blurry (e.g. frosted glass)?',
      options: ['Translucent', 'Transparent', 'Opaque', 'Metal'],
      ans: 'Translucent'
    },
    {
      id: 4,
      q: 'What optical phenomenon causes a straw inside a glass of water to look bent or broken?',
      options: [
        'Refraction (Light bending due to speed change)',
        'Reflection (Light bouncing off a mirror)',
        'Absorption (Light turning into heat)',
        'Shadow blocking'
      ],
      ans: 'Refraction (Light bending due to speed change)'
    },
    {
      id: 5,
      q: 'Why are shadows shortest at Midday (Noon)?',
      options: [
        'Because the Sun is directly overhead high in the sky',
        'Because the Sun turns off at midday',
        'Because light travels in curves at noon',
        'Because clouds absorb all shadows'
      ],
      ans: 'Because the Sun is directly overhead high in the sky'
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

  const currentOpticData = materialOptics.find(m => m.id === selectedMaterialType) || materialOptics[0];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-600 p-8 text-white shadow-xl shadow-amber-500/10">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-yellow-200" /> Science Academy • Grade 4 Physics & Optics
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Light: How We See & How Light Travels ☀️👁️
          </h1>
          <p className="text-amber-100 text-sm md:text-base max-w-3xl font-medium leading-relaxed">
            Light is a vital form of energy that travels in straight lines! Discover how light reflects off objects into our eyes, bends during refraction, creates shadows, and splits into rainbow colors.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={() => speakText("Light: How We See and How Light Travels. We see objects when light enters our eyes. Light travels from a light source, reflects off objects, and enters our eyes so we can see them. Light travels in straight lines and interacts with materials by reflecting, refracting, being absorbed, or being blocked to create shadows.")}
              className="px-4 py-2 rounded-xl bg-white text-amber-950 font-extrabold text-xs flex items-center gap-2 hover:bg-amber-50 transition-all shadow-md cursor-pointer"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-amber-700" />}
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
          { id: 'overview', label: 'Transparent, Translucent & Opaque', icon: '🪟' },
          { id: 'infographic', label: 'Full Infographic Chart', icon: '🖼️' },
          { id: 'vision', label: 'How We See (5 Steps)', icon: '👁️' },
          { id: 'reflection', label: 'Reflection, Refraction & Absorption', icon: '🪞' },
          { id: 'shadows', label: 'Straight Lines & Shadows', icon: '☀️' },
          { id: 'spectrum', label: 'Rainbow Colors (ROYGBIV)', icon: '🌈' },
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

      {/* ==================================== TAB 1: OPTICAL MATERIAL CLASSIFICATION ==================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Quick Banner */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-4 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-3xl">💡</span>
              <div>
                <h4 className="font-extrabold text-sm">Official Light Infographic Included</h4>
                <p className="text-amber-100 text-xs">View the high-resolution infographic chart detailing light propagation, reflection, refraction bending, shadows, and rainbow spectrums.</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('infographic')}
              className="px-4 py-2 rounded-xl bg-white text-amber-950 font-black text-xs hover:bg-amber-50 transition-all shrink-0 cursor-pointer shadow-sm"
            >
              View Infographic Chart →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {materialOptics.map((m) => (
              <div 
                key={m.id} 
                onClick={() => setSelectedMaterialType(m.id)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-2 relative group ${
                  selectedMaterialType === m.id ? 'bg-amber-600 border-amber-600 text-white shadow-lg scale-102' : 'bg-white border-slate-200 hover:border-amber-300'
                }`}
              >
                <h3 className={`font-black text-sm ${selectedMaterialType === m.id ? 'text-white' : 'text-slate-800'}`}>{m.name}</h3>
                <div className={`text-[10px] font-bold ${selectedMaterialType === m.id ? 'text-amber-100' : 'text-amber-700'}`}>{m.lightBehavior}</div>
              </div>
            ))}
          </div>

          {/* Interactive Material Optics Detail Panel */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  Optical Behavior Profile
                </span>
                <h2 className="text-2xl font-black text-slate-800 mt-1">{currentOpticData.name}</h2>
              </div>
              <button
                onClick={() => speakText(`${currentOpticData.name}. Behavior: ${currentOpticData.lightBehavior}. Visibility: ${currentOpticData.visibility}. ${currentOpticData.summary}. ${currentOpticData.details.join(' ')}`)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-800 transition-all cursor-pointer"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-amber-800">Scientific Summary</div>
              <div className="font-bold text-amber-950 text-xs md:text-sm leading-relaxed">{currentOpticData.summary}</div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Key Physical Properties</h4>
              {currentOpticData.details.map((d, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-medium leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
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
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                Official Visual Reference
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">Light: How We See & How Light Travels Infographic</h2>
              <p className="text-slate-500 text-xs mt-1">Official high-resolution diagram detailing light rays, 5-step vision, reflection laws, refraction, transparent/translucent/opaque sorting, and shadows.</p>
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
              src="/light_infographic.jpg" 
              alt="Light Infographic Chart" 
              className="max-w-full h-auto rounded-xl shadow-lg border border-white max-h-[800px] object-contain group-hover:scale-101 transition-transform"
            />
          </div>
        </div>
      )}

      {/* ==================================== TAB: HOW WE SEE ==================================== */}
      {activeTab === 'vision' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
              Visual Perception
            </span>
            <h2 className="text-2xl font-black text-slate-800 mt-1">5 Steps: How Light Enables Human Vision</h2>
            <p className="text-slate-500 text-xs mt-1">Light travels from a source $\rightarrow$ reflects off objects $\rightarrow$ enters our eyes $\rightarrow$ interpreted by the brain!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {visionSteps.map((vs, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="font-black text-xs text-amber-900">{vs.step}</div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{vs.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-950">
            <strong>Crucial Rule: NO LIGHT = NO VISION! 🕶️</strong> Without light rays bouncing into our eyes, our photoreceptor cells receive no energy, resulting in absolute pitch-black darkness.
          </div>
        </div>
      )}

      {/* ==================================== TAB: REFLECTION, REFRACTION, ABSORPTION ==================================== */}
      {activeTab === 'reflection' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {lightBehaviors.map((lb, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <h3 className="font-black text-base text-amber-950">{lb.title}</h3>
              <p className="text-xs font-bold text-slate-800">{lb.desc}</p>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{lb.physics}</p>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-700">
                <strong>Examples: </strong>{lb.examples}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==================================== TAB: SHADOWS ==================================== */}
      {activeTab === 'shadows' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-xl text-slate-800 flex items-center gap-2">
              <Sun className="w-6 h-6 text-amber-500" /> Straight Lines & Shadow Physics
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Because light travels strictly in <strong>straight lines (rectilinear propagation)</strong>, when an opaque object blocks light, an area of darkness—a **shadow**—is created behind it.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-semibold text-center">
              <div className="p-4 bg-amber-50 text-amber-950 rounded-2xl border border-amber-100">
                <div className="font-black text-sm">Morning 🌅</div>
                <p className="text-slate-600 font-medium mt-1">Sun is low in the East $\rightarrow$ Casts a LONG shadow facing West.</p>
              </div>
              <div className="p-4 bg-yellow-50 text-yellow-950 rounded-2xl border border-yellow-100">
                <div className="font-black text-sm">Midday (Noon) ☀️</div>
                <p className="text-slate-600 font-medium mt-1">Sun is high directly overhead $\rightarrow$ Casts a very SHORT shadow directly underneath.</p>
              </div>
              <div className="p-4 bg-orange-50 text-orange-950 rounded-2xl border border-orange-100">
                <div className="font-black text-sm">Afternoon 🌇</div>
                <p className="text-slate-600 font-medium mt-1">Sun is low in the West $\rightarrow$ Casts a LONG shadow facing East.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB: ROYGBIV SPECTRUM ==================================== */}
      {activeTab === 'spectrum' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Rainbow className="w-8 h-8 text-amber-500" />
            <div>
              <h2 className="text-2xl font-black text-slate-800">Colours of Light (ROYGBIV Spectrum) 🌈</h2>
              <p className="text-slate-500 text-xs">Visible white light from the Sun contains all colors of the rainbow combined together!</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-7 gap-2 text-center">
            {spectrumColors.map((sc, idx) => (
              <div key={idx} className={`p-3 rounded-2xl font-black text-xs ${sc.hex} shadow-sm`}>
                {sc.name}
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-xs text-amber-950 space-y-1">
            <div className="font-bold text-amber-900">How Rainbows Form 🌧️☀️</div>
            <p>When white sunlight passes through airborne raindrops after rain, each raindrop acts like a tiny glass prism—refracting (bending) and reflecting light rays to separate white sunlight into its distinct 7 color wavelengths!</p>
          </div>
        </div>
      )}

      {/* ==================================== TAB: QUIZ ==================================== */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-800">Light Knowledge Check</h2>
              <p className="text-slate-500 text-xs mt-1">Test your understanding of vision steps, reflection/refraction, shadow lengths, and optical materials.</p>
            </div>
            {quizScore !== null && (
              <div className="px-4 py-2 rounded-2xl bg-amber-100 text-amber-950 font-black text-sm flex items-center gap-2">
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
                <h3 className="font-extrabold text-white text-sm">Light: How We See & How Light Travels Infographic</h3>
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
              src="/light_infographic.jpg" 
              alt="Light Infographic" 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2 border-slate-700/50 object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
