import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  RotateCcw, 
  Award, 
  X,
  Compass,
  Zap,
  ShieldCheck,
  Scale,
  ZoomIn,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ForceAndMotionHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEffect, setSelectedEffect] = useState('start');
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

  // 5 Main Effects of a Force Data
  const forceEffects = [
    {
      id: 'start',
      num: '1',
      name: 'Start Motion',
      icon: '⚽',
      summary: 'A push or pull can make a stationary object begin to move.',
      details: [
        'Kicking a stationary soccer ball sitting on grass causes it to accelerate forward.',
        'Pulling open a heavy closed door from a resting state.'
      ]
    },
    {
      id: 'stop',
      num: '2',
      name: 'Stop Motion',
      icon: '🛑',
      summary: 'An opposing force can bring a moving object to a complete halt.',
      details: [
        'A goalkeeper catching a flying football in mid-air.',
        'Squeezing bicycle brake pads against rotating wheels to stop.'
      ]
    },
    {
      id: 'speed',
      num: '3',
      name: 'Change Speed',
      icon: '🚀',
      summary: 'Force can accelerate an object (go faster) or decelerate it (slow down).',
      details: [
        'Pushing a child on a swing harder speeds them up.',
        'Air resistance and friction slow down a rolling skateboard.'
      ]
    },
    {
      id: 'direction',
      num: '4',
      name: 'Change Direction',
      icon: '🎾',
      summary: 'Applying force at an angle alters the vector path of a moving object.',
      details: [
        'Hitting a moving tennis ball with a racket sends it returning across the court.',
        'Steering a bicycle handlebar changes the direction of motion.'
      ]
    },
    {
      id: 'shape',
      num: '5',
      name: 'Change Shape',
      icon: '🧩',
      summary: 'Compressing, stretching, or twisting alters physical dimensions.',
      details: [
        'Squeezing a soft foam sponge or modeling clay.',
        'Stretching an elastic rubber band or bending a metal spring.'
      ]
    }
  ];

  // Balanced vs Unbalanced Summary
  const forceBalanceComparison = [
    { type: 'Balanced Forces ⚖️', net: 'Net Force = 0 Newtons (0 N)', motion: 'NO Change in Motion', example: 'Stationary object stays still ($10\\text{ N} \\leftarrow \\square \\rightarrow 10\\text{ N}$); moving car cruises at steady speed.' },
    { type: 'Unbalanced Forces 🏎️', net: 'Net Force > 0 Newtons (> 0 N)', motion: 'Change in Motion Occurs!', example: 'Stationary object starts moving ($15\\text{ N} \\leftarrow \\square \\rightarrow 5\\text{ N}$); object speeds up, slows down, or turns.' }
  ];

  // Types of Real-World Forces
  const realWorldForces = [
    { name: 'Friction 👟', desc: 'Contact force that resists sliding motion between two surfaces touching each other. Helps us walk without slipping!' },
    { name: 'Gravity 🍎', desc: 'Non-contact force pulling all objects down towards Earth\'s center (keeps our feet on the ground!).' },
    { name: 'Air Resistance (Drag) 🪂', desc: 'Friction caused by air pushing back against a moving object (e.g., parachute slowing a skydiver).' },
    { name: 'Push & Pull Forces 🛒', desc: 'Direct contact forces applied by humans or machinery (e.g. pushing a shopping cart, pulling a wagon).' }
  ];

  // Quiz Questions
  const quizQuestions = [
    {
      id: 1,
      q: 'What is the scientific definition of a Force?',
      options: ['A push or a pull acting upon an object', 'Speed divided by time', 'Heat energy from the sun', 'Electrical voltage'],
      ans: 'A push or a pull acting upon an object'
    },
    {
      id: 2,
      q: 'What happens when BALANCED forces act upon an object?',
      options: [
        'The forces are equal and opposite, so the object remains at rest or constant speed',
        'The object speeds up rapidly',
        'The object changes shape immediately',
        'Gravity disappears'
      ],
      ans: 'The forces are equal and opposite, so the object remains at rest or constant speed'
    },
    {
      id: 3,
      q: 'Which non-contact invisible force pulls all objects down toward Earth\'s center?',
      options: ['Friction', 'Air Resistance', 'Gravity', 'Magnetism'],
      ans: 'Gravity'
    },
    {
      id: 4,
      q: 'Which contact force opposes motion whenever two surfaces rub against each other?',
      options: ['Friction', 'Gravity', 'Electrostatics', 'Tension'],
      ans: 'Friction'
    },
    {
      id: 5,
      q: 'When you squeeze a piece of soft modeling clay in your hands, which effect of force are you demonstrating?',
      options: ['Changing the shape of the object', 'Changing the color of the object', 'Stopping light', 'Generating electricity'],
      ans: 'Changing the shape of the object'
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

  const currentEffectData = forceEffects.find(e => e.id === selectedEffect) || forceEffects[0];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-700 p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-yellow-300" /> Science Academy • Grade 4 Physics & Mechanics
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Force & Motion 🏃‍♂️⚽
          </h1>
          <p className="text-blue-100 text-sm md:text-base max-w-2xl font-medium">
            Forces shape how everything moves in our universe! Explore pushes, pulls, gravity, friction, balanced vs unbalanced forces, and the 5 key effects of force.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={() => speakText("Force and Motion. A force is a push or a pull that can make objects start moving, stop, change speed, change direction, or change shape.")}
              className="px-4 py-2 rounded-xl bg-white text-blue-900 font-extrabold text-xs flex items-center gap-2 hover:bg-blue-50 transition-all shadow-md cursor-pointer"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
              {isPlayingAudio ? 'Stop Audio' : 'Listen to Overview'}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-800/60 hover:bg-blue-800/80 text-white font-extrabold text-xs flex items-center gap-2 border border-blue-400/30 transition-all cursor-pointer"
            >
              🖼️ View Full Infographic Chart
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: '5 Effects of a Force', icon: '💨' },
          { id: 'balanced', label: 'Balanced vs Unbalanced', icon: '⚖️' },
          { id: 'realworld', label: 'Real-World Forces (Gravity/Friction)', icon: '🍎' },
          { id: 'quiz', label: 'Knowledge Check Quiz', icon: '🏆' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-102'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* ==================================== TAB 1: 5 EFFECTS ==================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Top Featured Infographic Poster */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-md">
                  Visual Learning Guide • Mechanics & Physics Chart
                </span>
                <h3 className="text-2xl font-black text-slate-800 mt-2 flex items-center gap-2">
                  <span>🖼️</span> Force & Motion Infographic Chart
                </h3>
                <p className="text-slate-500 text-xs mt-1">
                  Click the poster below to expand into full high-resolution view with gravity, friction, and force effects.
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2 cursor-pointer shrink-0"
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
                src="/force_and_motion_infographic.jpg" 
                alt="Force and Motion Infographic Poster" 
                className="max-w-full h-auto rounded-xl shadow-md border border-white max-h-[650px] object-contain group-hover:scale-101 transition-transform"
              />
              <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl backdrop-blur-[2px]">
                <span className="px-6 py-3 bg-white text-slate-900 font-black text-xs rounded-2xl shadow-xl flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-blue-600" /> Click to Expand & Zoom Image
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {forceEffects.map((e) => (
              <div 
                key={e.id} 
                onClick={() => setSelectedEffect(e.id)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-2 relative group ${
                  selectedEffect === e.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20 scale-102' : 'bg-white border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="text-3xl">{e.icon}</div>
                <h3 className={`font-black text-sm ${selectedEffect === e.id ? 'text-white' : 'text-slate-800'}`}>{e.name}</h3>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentEffectData.icon}</span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                    Physics Effect
                  </span>
                  <h2 className="text-2xl font-black text-slate-800 mt-1">{currentEffectData.name}</h2>
                </div>
              </div>
              <button
                onClick={() => speakText(`${currentEffectData.name}. Summary: ${currentEffectData.summary}. ${currentEffectData.details.join(' ')}`)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-800 transition-all cursor-pointer"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-blue-700">Primary Effect</div>
              <div className="font-extrabold text-blue-950 text-sm leading-relaxed">{currentEffectData.summary}</div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Detailed Real-World Examples</h4>
              {(currentEffectData?.details || []).map((d, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-medium leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB: BALANCED VS UNBALANCED ==================================== */}
      {activeTab === 'balanced' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {forceBalanceComparison.map((fbc, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-black text-lg text-slate-900">{fbc.type}</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">{fbc.net}</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs font-extrabold text-blue-950">
                Effect: {fbc.motion}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{fbc.example}</p>
            </div>
          ))}
        </div>
      )}

      {/* ==================================== TAB: REAL WORLD FORCES ==================================== */}
      {activeTab === 'realworld' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {realWorldForces.map((rwf, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <h3 className="font-black text-base text-slate-900">{rwf.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{rwf.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* ==================================== TAB: QUIZ ==================================== */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-800">Force & Motion Knowledge Check</h2>
              <p className="text-slate-500 text-xs mt-1">Test your understanding of pushes/pulls, balanced forces, friction, and gravity.</p>
            </div>
            {quizScore !== null && (
              <div className="px-4 py-2 rounded-2xl bg-blue-100 text-blue-800 font-black text-sm flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" /> Score: {quizScore} / {quizQuestions.length}
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
                          ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
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
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20 disabled:opacity-40 cursor-pointer"
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
              <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400 font-bold text-xs">
                🖼️ Full Chart View
              </span>
              <div>
                <h3 className="font-extrabold text-white text-sm">Force and Motion Infographic</h3>
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
              src="/force_and_motion_infographic.jpg" 
              alt="Force and Motion Infographic" 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2 border-slate-700/50 object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
