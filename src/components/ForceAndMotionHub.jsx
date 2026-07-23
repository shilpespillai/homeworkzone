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
  Scale
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

  // Effects of a Force
  const forceEffects = [
    {
      id: 'start',
      name: 'Start Motion',
      icon: '⚾',
      summary: 'A force causes a stationary (still) object to start moving in the direction of the force.',
      details: [
        'Example: Hitting a stationary baseball with a bat or kicking a soccer ball on the field.',
        'An unbalanced force breaks the state of rest.'
      ]
    },
    {
      id: 'stop',
      name: 'Stop Motion',
      icon: '⚾',
      summary: 'An opposing force slows down and stops a moving object.',
      details: [
        'Example: Catching a baseball with a glove or pulling the brakes on a bicycle.',
        'Friction and air resistance act as stopping forces.'
      ]
    },
    {
      id: 'speed',
      name: 'Change Speed',
      icon: '🚗',
      summary: 'Pushes or pulls make an object move faster (accelerate) or slower (decelerate).',
      details: [
        'Pushing gas pedal applies forward engine force $\\rightarrow$ Speeds up car.',
        'Slamming brakes creates friction $\\rightarrow$ Slows down car.'
      ]
    },
    {
      id: 'direction',
      name: 'Change Direction',
      icon: '🏒',
      summary: 'A sideways force alters the path or trajectory of a moving object.',
      details: [
        'Example: A hockey stick deflecting a sliding puck around a curve.',
        'Steering wheel turning car wheels.'
      ]
    },
    {
      id: 'shape',
      name: 'Change Shape',
      icon: '🩴',
      summary: 'Forces can stretch, squash, bend, or twist physical materials.',
      details: [
        'Example: Stretching slime, squashing a rubber ball, or twisting a sponge.',
        'Deforms the physical structure.'
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
      q: 'What is the definition of a Force in physics?',
      options: ['A push or a pull', 'A type of liquid', 'Light energy from the Sun', 'Sound vibration'],
      ans: 'A push or a pull'
    },
    {
      id: 2,
      q: 'What happens to a moving car when BALANCED forces act on it?',
      options: [
        'The car continues moving at the exact same speed and direction',
        'The car immediately stops',
        'The car flies into the air',
        'The car turns upside down'
      ],
      ans: 'The car continues moving at the exact same speed and direction'
    },
    {
      id: 3,
      q: 'Which force pulls falling apples down to Earth and keeps our feet on the ground?',
      options: ['Magnetism', 'Gravity', 'Air Resistance', 'Sound'],
      ans: 'Gravity'
    },
    {
      id: 4,
      q: 'Which contact force resists sliding motion between shoes and ground to stop us from slipping?',
      options: ['Friction', 'Light', 'Electricity', 'Heat'],
      ans: 'Friction'
    },
    {
      id: 5,
      q: 'What happens when two people pull a rope in a Tug-of-War with UNBALANCED forces (15 N left vs 5 N right)?',
      options: [
        'The rope moves towards the left (stronger 15 N force)',
        'The rope stays perfectly still',
        'The rope disappears',
        'Nothing changes'
      ],
      ans: 'The rope moves towards the left (stronger 15 N force)'
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-yellow-300" /> Science Academy • Grade 4 Physical Science
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Force & Motion 🚴💨
          </h1>
          <p className="text-blue-100 text-sm md:text-base max-w-2xl font-medium leading-relaxed">
            Forces are pushes or pulls that make things move, stop, start, change speed, or change direction! Understand balanced forces, friction, and gravity.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={() => speakText("Force and Motion. Forces make things move, stop, start or change direction. A force is a push or a pull. Balanced forces cause no change in motion, while unbalanced forces cause motion to change.")}
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
          { id: 'infographic', label: 'Full Infographic Chart', icon: '🖼️' },
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
              {currentEffectData.details.map((d, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-medium leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
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
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                Official Visual Reference
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">Force and Motion Infographic</h2>
              <p className="text-slate-500 text-xs mt-1">Official diagram detailing pushes/pulls, balanced vs unbalanced forces, friction, and gravity.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2 cursor-pointer"
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
              src="/force_and_motion_infographic.jpg" 
              alt="Force and Motion Infographic Chart" 
              className="max-w-full h-auto rounded-xl shadow-lg border border-white max-h-[800px] object-contain group-hover:scale-101 transition-transform"
            />
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
