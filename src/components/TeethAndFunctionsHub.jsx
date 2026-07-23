import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  RotateCcw, 
  Award, 
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TeethAndFunctionsHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTooth, setSelectedTooth] = useState('incisors');
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

  // 4 Types of Teeth
  const teethTypes = [
    {
      id: 'incisors',
      name: 'Incisors (Front Teeth)',
      num: '1',
      count: '8 total (4 top, 4 bottom)',
      shape: 'Chisel-shaped with flat, sharp cutting edges',
      icon: '🍎',
      bg: 'bg-blue-50 border-blue-200 text-blue-900',
      badgeBg: 'bg-blue-600 text-white',
      mainFunction: 'Cutting and Biting Food',
      example: 'Biting into a fresh apple, sandwich, or carrot.',
      details: [
        'Located right in the front of your mouth (4 on top jaw, 4 on bottom jaw).',
        'Have sharp, chisel-shaped edges like scissors to cut through food easily.',
        'They are the very first teeth to make contact with food when you take a bite.'
      ]
    },
    {
      id: 'canines',
      name: 'Canines (Pointed Teeth)',
      num: '2',
      count: '4 total (2 top, 2 bottom)',
      shape: 'Sharp, pointed crown like a dog or wolf tooth',
      icon: '🍗',
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      badgeBg: 'bg-emerald-600 text-white',
      mainFunction: 'Tearing Food',
      example: 'Tearing tough foods like meat, chicken, or crusty bread.',
      details: [
        'Located next to the incisors at the corners of your smile.',
        'Have sharp, pointed crowns designed to hold and tear food apart.',
        'Sometimes called "eyeteeth" because they sit directly beneath the eyes.'
      ]
    },
    {
      id: 'premolars',
      name: 'Premolars (Middle Back Teeth)',
      num: '3',
      count: '8 total (4 top, 4 bottom)',
      shape: 'Flat top surface with 2 pointed cusps (bicuspids)',
      icon: '🥕',
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
      badgeBg: 'bg-amber-600 text-white',
      mainFunction: 'Crushing and Grinding Food',
      example: 'Crushing firm foods like carrots, celery, or crackers.',
      details: [
        'Located between your sharp canines and broad back molars.',
        'Have a flat top surface with ridges (cusps) to crush and tear food into smaller pieces.',
        'Children get premolars when their primary milk teeth fall out and adult teeth grow.'
      ]
    },
    {
      id: 'molars',
      name: 'Molars (Back Teeth)',
      num: '4',
      count: '8 to 12 total (including wisdom teeth)',
      shape: 'Large, broad, flat surface with deep grooves',
      icon: '🍞',
      bg: 'bg-purple-50 border-purple-200 text-purple-900',
      badgeBg: 'bg-purple-600 text-white',
      mainFunction: 'Grinding Food into Fine Pieces',
      example: 'Grinding bread, nuts, grains, and rice before swallowing.',
      details: [
        'Located at the very back of the mouth (largest and strongest teeth).',
        'Have wide, flat surfaces with deep grooves to grind food into a soft paste so it is safe to swallow.',
        'Includes the 4 "wisdom teeth" which appear in late teenage years or early adulthood.'
      ]
    }
  ];

  // Tooth Anatomy Parts
  const toothParts = [
    { part: 'Crown', icon: '👑', color: 'bg-indigo-50 border-indigo-200 text-indigo-900', desc: 'The visible white part of the tooth that sits above the gum line.' },
    { part: 'Enamel', icon: '🛡️', color: 'bg-cyan-50 border-cyan-200 text-cyan-900', desc: 'The hard, outer protective shell. It is the hardest tissue in the human body—even harder than bone!' },
    { part: 'Dentin', icon: '🦴', color: 'bg-amber-50 border-amber-200 text-amber-900', desc: 'The hard, yellow calcified layer beneath enamel that protects the inner nerve chamber.' },
    { part: 'Pulp', icon: '🩸', color: 'bg-rose-50 border-rose-200 text-rose-900', desc: 'The soft living center of the tooth containing blood vessels and sensitive nerve fibers.' },
    { part: 'Root', icon: '🌱', color: 'bg-stone-50 border-stone-200 text-stone-900', desc: 'The lower two-thirds of the tooth anchored beneath the gums into the jawbone.' }
  ];

  // Quiz Questions
  const quizQuestions = [
    {
      id: 1,
      q: 'Which type of teeth are located right in the front and are used for cutting and biting food?',
      options: ['Molars', 'Incisors', 'Canines', 'Premolars'],
      ans: 'Incisors'
    },
    {
      id: 2,
      q: 'What is the primary function of pointed Canine teeth?',
      options: ['Grinding grains', 'Tearing food apart', 'Crushing vegetables', 'Absorbing water'],
      ans: 'Tearing food apart'
    },
    {
      id: 3,
      q: 'Which layer of the tooth is the hardest substance in the entire human body?',
      options: ['Pulp', 'Dentin', 'Enamel', 'Gum'],
      ans: 'Enamel'
    },
    {
      id: 4,
      q: 'Which broad back teeth are designed specifically for grinding food into a soft paste before swallowing?',
      options: ['Incissors', 'Canines', 'Molars', 'Front teeth'],
      ans: 'Molars'
    },
    {
      id: 5,
      q: 'How many total teeth are in a complete adult permanent set (including wisdom teeth)?',
      options: ['20 teeth', '32 teeth', '28 teeth', '16 teeth'],
      ans: '32 teeth'
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

  const currentToothData = teethTypes.find(t => t.id === selectedTooth) || teethTypes[0];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-700 p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-yellow-300" /> Science Academy • Grade 4 Human Biology
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Types of Teeth and Their Functions 🦷
          </h1>
          <p className="text-blue-100 text-sm md:text-base max-w-2xl font-medium">
            Discover the 4 distinct types of teeth, their unique shapes, exact functions in chewing, and internal tooth anatomy.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={() => speakText("Types of Teeth and Their Functions. Humans have four main types of teeth: Incisors for cutting, Canines for tearing, Premolars for crushing, and Molars for grinding.")}
              className="px-4 py-2 rounded-xl bg-white text-blue-900 font-extrabold text-xs flex items-center gap-2 hover:bg-blue-50 transition-all shadow-md cursor-pointer"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
              {isPlayingAudio ? 'Stop Audio' : 'Listen to Overview'}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-800/60 hover:bg-blue-800/80 text-white font-extrabold text-xs flex items-center gap-2 border border-blue-400/30 transition-all cursor-pointer"
            >
              🖼️ View Full Chart
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: '4 Teeth Types', icon: '🦷' },
          { id: 'infographic', label: 'Full Infographic Chart', icon: '🖼️' },
          { id: 'anatomy', label: 'Tooth Anatomy & Parts', icon: '🔬' },
          { id: 'care', label: 'Oral Care & Sets', icon: '🪥' },
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

      {/* ==================================== TAB 1: 4 TEETH TYPES ==================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Infographic Quick Banner */}
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-4 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🦷</span>
              <div>
                <h4 className="font-extrabold text-sm">Official Types of Teeth Chart Included</h4>
                <p className="text-sky-100 text-xs">View the high-resolution infographic chart detailing incisors, canines, premolars, and molars.</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('infographic')}
              className="px-4 py-2 rounded-xl bg-white text-blue-900 font-black text-xs hover:bg-sky-50 transition-all shrink-0 cursor-pointer shadow-sm"
            >
              View Infographic Chart →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {teethTypes.map((t) => (
              <div 
                key={t.id} 
                onClick={() => setSelectedTooth(t.id)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3 relative group ${
                  selectedTooth === t.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20 scale-102' : 'bg-white border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-8 h-8 rounded-xl font-black text-xs flex-center ${selectedTooth === t.id ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'}`}>
                    #{t.num}
                  </span>
                  <span className="text-3xl">{t.icon}</span>
                </div>
                <h3 className={`font-black text-base ${selectedTooth === t.id ? 'text-white' : 'text-slate-800'}`}>{t.name}</h3>
                <div className={`text-xs font-bold ${selectedTooth === t.id ? 'text-blue-100' : 'text-blue-600'}`}>{t.mainFunction}</div>
                <p className={`text-xs leading-relaxed ${selectedTooth === t.id ? 'text-blue-50' : 'text-slate-500'}`}>{t.count}</p>
              </div>
            ))}
          </div>

          {/* Interactive Tooth Detail Panel */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentToothData.icon}</span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                    Tooth Group #{currentToothData.num} • {currentToothData.count}
                  </span>
                  <h2 className="text-2xl font-black text-slate-800 mt-1">{currentToothData.name}</h2>
                </div>
              </div>
              <button
                onClick={() => speakText(`${currentToothData.name}. Main function: ${currentToothData.mainFunction}. ${currentToothData.details.join(' ')}`)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-800 transition-all cursor-pointer"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-blue-700">Primary Job / Function</div>
                <div className="font-extrabold text-blue-950 text-base">{currentToothData.mainFunction}</div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Real-Life Eating Example</div>
                <div className="font-extrabold text-emerald-950 text-base">{currentToothData.example}</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Key Biological Characteristics</h4>
              {currentToothData.details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-medium leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
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
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                Official Visual Reference
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">Types of Teeth and Their Functions Infographic</h2>
              <p className="text-slate-500 text-xs mt-1">Official high-resolution diagram detailing incisors, canines, premolars, and molars.</p>
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
              src="/types_of_teeth_infographic.jpg" 
              alt="Types of Teeth and Their Functions Infographic Chart" 
              className="max-w-full h-auto rounded-xl shadow-lg border border-white max-h-[800px] object-contain group-hover:scale-101 transition-transform"
            />
          </div>
        </div>
      )}

      {/* ==================================== TAB: TOOTH ANATOMY ==================================== */}
      {activeTab === 'anatomy' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                Anatomical Structure
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">Parts of a Tooth & Their Functions</h2>
              <p className="text-slate-500 text-xs mt-1">Every tooth is made of several layers protecting sensitive nerves and blood vessels inside.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {toothParts.map((tp, idx) => (
                <div key={idx} className={`p-5 rounded-2xl border ${tp.color} space-y-2`}>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{tp.icon}</span>
                    <span className="text-xs font-extrabold uppercase tracking-wider opacity-60">Layer #{idx + 1}</span>
                  </div>
                  <h3 className="font-black text-base">{tp.part}</h3>
                  <p className="text-xs leading-relaxed opacity-90">{tp.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB: ORAL CARE & SETS ==================================== */}
      {activeTab === 'care' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
              <span>🦷</span> Milk Teeth vs Adult Permanent Teeth
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="font-black text-amber-900 text-sm">Primary (Milk) Teeth — 20 Total</div>
                <p className="text-amber-800 mt-1">Children begin growing milk teeth around 6 months old. A complete set has 20 teeth. They fall out between ages 6 and 12 to make room for adult teeth.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
                <div className="font-black text-blue-900 text-sm">Permanent (Adult) Teeth — 32 Total</div>
                <p className="text-blue-800 mt-1">Adults have up to 32 permanent teeth (8 incisors, 4 canines, 8 premolars, and 12 molars including 4 wisdom teeth).</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
              <span>🪥</span> Healthy Dental Care Guidelines
            </h3>
            <div className="space-y-2 text-xs font-medium text-slate-700">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Brush teeth twice daily for 2 full minutes using fluoridated toothpaste.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Floss daily between teeth to remove hidden food particles and plaque.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Limit sugary snacks, sodas, and sticky candies that cause tooth decay and cavities.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB: QUIZ ==================================== */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-800">Types of Teeth Knowledge Check</h2>
              <p className="text-slate-500 text-xs mt-1">Test your understanding of tooth types, functions, and anatomy.</p>
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
                <h3 className="font-extrabold text-white text-sm">Types of Teeth and Their Functions Infographic</h3>
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
              src="/types_of_teeth_infographic.jpg" 
              alt="Types of Teeth and Their Functions Infographic" 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2 border-slate-700/50 object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
