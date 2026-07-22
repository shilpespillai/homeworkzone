import React, { useState } from 'react';
import { 
  Heart, 
  Activity, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  CheckCircle, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Zap, 
  Award,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BodyAndFunctionsHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOrganStep, setSelectedOrganStep] = useState(1);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeEnzymeFilter, setActiveEnzymeFilter] = useState('all');
  
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

  // 7 Major Stages
  const majorStages = [
    { num: 1, title: 'Ingestion', icon: '🍎', desc: 'Food enters the mouth and digestion begins.' },
    { num: 2, title: 'Swallowing', icon: '😮', desc: 'Food is swallowed and moves down through the digestive tract.' },
    { num: 3, title: 'Mechanical Digestion', icon: '⚙️', desc: 'Food is physically broken down into smaller pieces by chewing and churning.' },
    { num: 4, title: 'Chemical Digestion', icon: '🧪', desc: 'Enzymes and acidic secretions break food down into simple nutrient molecules.' },
    { num: 5, title: 'Nutrient Absorption', icon: '🩸', desc: 'Nutrients pass through the intestinal wall into the blood or lymph system.' },
    { num: 6, title: 'Water Absorption', icon: '💧', desc: 'Water, minerals, and electrolytes are absorbed in the large intestine.' },
    { num: 7, title: 'Waste Elimination', icon: '🚽', desc: 'Indigestible waste is stored in the rectum and eliminated through the anus.' }
  ];

  // 14 Pathway Steps
  const pathwaySteps = [
    { step: 1, organ: 'Mouth', section: 'Upper Tract', icon: '👄', bg: 'bg-red-50 text-red-700 border-red-200', details: ['Chews food mechanically with teeth.', 'Saliva moistens and lubricates food.', 'Salivary amylase enzyme starts digesting starches into simple sugars.'] },
    { step: 2, organ: 'Pharynx (Throat)', section: 'Upper Tract', icon: '🗣️', bg: 'bg-orange-50 text-orange-700 border-orange-200', details: ['Passage connecting mouth to esophagus.', 'Helps propel food down during swallowing while epiglottis protects airway.'] },
    { step: 3, organ: 'Esophagus / Oesophagus', section: 'Upper Tract', icon: '🥢', bg: 'bg-amber-50 text-amber-700 border-amber-200', details: ['Muscular tube connecting throat to stomach.', 'Peristalsis moves food using wave-like involuntary muscle contractions.'] },
    { step: 4, organ: 'Stomach', section: 'Upper Tract', icon: '🫀', bg: 'bg-rose-50 text-rose-700 border-rose-200', details: ['Stores and churns food mechanically into semi-liquid chyme.', 'Hydrochloric Acid (HCl) kills harmful bacteria.', 'Pepsin enzyme digests proteins into peptides. Secretions: HCl, Pepsin, Gastric Lipase.'] },
    { step: 5, organ: 'Duodenum', section: 'Small Intestine', icon: '🌀', bg: 'bg-yellow-50 text-yellow-700 border-yellow-200', details: ['First part of the small intestine.', 'Receives acidic chyme from stomach.', 'Mixes chyme with bile (from liver) and pancreatic juice. Major site of chemical digestion.'] },
    { step: 6, organ: 'Jejunum', section: 'Small Intestine', icon: '〰️', bg: 'bg-lime-50 text-lime-700 border-lime-200', details: ['Middle section of the small intestine.', 'Major site for nutrient absorption into blood.', 'Absorbs carbohydrates, proteins, fats, vitamins, and minerals.'] },
    { step: 7, organ: 'Ileum', section: 'Small Intestine', icon: '🔄', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', details: ['Final section of the small intestine.', 'Absorbs remaining nutrients.', 'Specifically absorbs Vitamin B12 and bile salts.'] },
    { step: 8, organ: 'Cecum', section: 'Large Intestine', icon: '🥔', bg: 'bg-teal-50 text-teal-700 border-teal-200', details: ['Pouch at the beginning of the large intestine.', 'Houses beneficial gut bacteria that assist fermentation.'] },
    { step: 9, organ: 'Ascending Colon', section: 'Large Intestine', icon: '⬆️', bg: 'bg-cyan-50 text-cyan-700 border-cyan-200', details: ['Travels upward on the right side of abdomen.', 'Absorbs remaining water, sodium, and essential minerals.'] },
    { step: 10, organ: 'Transverse Colon', section: 'Large Intestine', icon: '➡️', bg: 'bg-sky-50 text-sky-700 border-sky-200', details: ['Crosses horizontally across the abdomen.', 'Continues absorbing water & electrolytes.', 'Beneficial bacteria synthesize essential Vitamin K & B group vitamins.'] },
    { step: 11, organ: 'Descending Colon', section: 'Large Intestine', icon: '⬇️', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', details: ['Passes downward on the left side.', 'Absorbs remaining water and compacts waste into solid stool (feces).'] },
    { step: 12, organ: 'Sigmoid Colon', section: 'Large Intestine', icon: '↪️', bg: 'bg-purple-50 text-purple-700 border-purple-200', details: ['S-shaped lower section of the colon.', 'Stores feces temporarily before movement into the rectum.'] },
    { step: 13, organ: 'Rectum', section: 'Lower Tract', icon: '📦', bg: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200', details: ['Final 15cm chamber of the large intestine.', 'Holds feces and signals brain sensors when ready for elimination.'] },
    { step: 14, organ: 'Anus', section: 'Lower Tract', icon: '🚪', bg: 'bg-stone-50 text-stone-700 border-stone-200', details: ['Terminal opening of the digestive tract.', 'Internal & external sphincter muscles control voluntary release of stool.'] }
  ];

  // Enzymes
  const enzymesList = [
    { name: 'Salivary Amylase', source: 'Salivary Glands', target: 'Starches (Carbohydrates)', result: 'Simple sugars (Maltose)', color: 'bg-blue-50 text-blue-800 border-blue-200' },
    { name: 'Pepsin', source: 'Stomach', target: 'Proteins', result: 'Smaller Peptides', color: 'bg-rose-50 text-rose-800 border-rose-200' },
    { name: 'Pancreatic Amylase', source: 'Pancreas', target: 'Starches', result: 'Glucose & Simple Sugars', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { name: 'Lipase', source: 'Pancreas', target: 'Emulsified Fats', result: 'Fatty Acids & Glycerol', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { name: 'Trypsin', source: 'Pancreas', target: 'Proteins & Peptides', result: 'Amino Acids', color: 'bg-purple-50 text-purple-800 border-purple-200' },
    { name: 'Bile Salts (Emulsifier)', source: 'Liver & Gallbladder', target: 'Large Fat Droplets', result: 'Small Emulsified Droplets', color: 'bg-yellow-50 text-yellow-800 border-yellow-200' }
  ];

  // Helper Organs
  const helperOrgans = [
    { organ: 'Salivary Glands', icon: '💧', role: 'Produces saliva to lubricate food; contains salivary amylase to initiate carbohydrate breakdown.' },
    { organ: 'Liver', icon: '🩺', role: 'Largest internal digestive organ. Secretes bile, processes absorbed nutrients, stores vitamins/iron, and detoxifies chemicals.' },
    { organ: 'Gallbladder', icon: '🍐', role: 'Stores and concentrates bile produced by the liver; contracts to release bile into the duodenum during meals.' },
    { organ: 'Pancreas', icon: '🥖', role: 'Produces pancreatic juice containing amylase, lipase, trypsin, and sodium bicarbonate to neutralize stomach acid.' }
  ];

  // Quiz Questions
  const quizQuestions = [
    {
      id: 1,
      q: 'Which organ is responsible for the majority of chemical digestion and nutrient absorption?',
      options: ['Stomach', 'Small Intestine', 'Large Intestine', 'Esophagus'],
      ans: 'Small Intestine'
    },
    {
      id: 2,
      q: 'What is the main function of the large intestine?',
      options: ['Digest proteins with Pepsin', 'Absorb water and minerals from indigestible waste', 'Produce bile for fat breakdown', 'Chew food into smaller pieces'],
      ans: 'Absorb water and minerals from indigestible waste'
    },
    {
      id: 3,
      q: 'Which helper organ produces bile to emulsify large fat droplets?',
      options: ['Pancreas', 'Stomach', 'Liver', 'Salivary Glands'],
      ans: 'Liver'
    },
    {
      id: 4,
      q: 'Tiny finger-like projections called villi are located inside which organ to increase absorption surface area?',
      options: ['Stomach', 'Small Intestine', 'Large Intestine', 'Pharynx'],
      ans: 'Small Intestine'
    },
    {
      id: 5,
      q: 'Fatty acids and glycerol are absorbed into which specialized lymphatic vessel inside the villi?',
      options: ['Blood Capillaries', 'Lacteal', 'Vein', 'Artery'],
      ans: 'Lacteal'
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

  const selectedStepData = pathwaySteps.find(s => s.step === selectedOrganStep) || pathwaySteps[0];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-8 text-white shadow-xl shadow-teal-500/10">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-yellow-300" /> Science Academy • Grade 4 Human Biology
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            The Human Digestive System
          </h1>
          <p className="text-emerald-100 text-sm md:text-base max-w-2xl font-medium">
            Explore the complete 14-step pathway of food, organ functions, digestive enzymes, and nutrient absorption pathways in microscopic detail.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={() => speakText("The Human Digestive System: Digestion and Absorption of Food. Food travels through 14 key pathway steps starting at the mouth and concluding at waste elimination.")}
              className="px-4 py-2 rounded-xl bg-white text-emerald-900 font-extrabold text-xs flex items-center gap-2 hover:bg-emerald-50 transition-all shadow-md cursor-pointer"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
              {isPlayingAudio ? 'Stop Audio' : 'Listen to Overview'}
            </button>
            <span className="text-xs font-bold bg-emerald-800/40 px-3 py-1.5 rounded-lg border border-emerald-400/20">
              7 Major Stages • 14 Organs • 6 Essential Enzymes
            </span>
          </div>
        </div>
        <div className="absolute right-[-40px] bottom-[-40px] opacity-10 pointer-events-none">
          <Activity className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: '7 Major Stages', icon: '⚡' },
          { id: 'infographic', label: 'Full Infographic Chart', icon: '🖼️' },
          { id: 'pathway', label: '14-Step Food Pathway', icon: '🔄' },
          { id: 'enzymes', label: 'Digestive Enzymes', icon: '🧪' },
          { id: 'absorption', label: 'Nutrient Absorption (Villi)', icon: '🔬' },
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

      {/* ==================================== TAB: INFOGRAPHIC CHART ==================================== */}
      {activeTab === 'infographic' && (
        <div className="space-y-6 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                Official Visual Reference
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">The Human Digestive System Infographic</h2>
              <p className="text-slate-500 text-xs mt-1">High-resolution diagram detailing Digestion and Absorption of Food.</p>
            </div>
            <a 
              href="/digestive_system_infographic.jpg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center gap-2"
            >
              🔍 Open Full Size Image
            </a>
          </div>

          <div className="flex justify-center bg-slate-900/5 p-4 rounded-2xl border border-slate-200 overflow-hidden">
            <img 
              src="/digestive_system_infographic.jpg" 
              alt="The Human Digestive System - Digestion and Absorption of Food Infographic" 
              className="max-w-full h-auto rounded-xl shadow-lg border border-white max-h-[800px] object-contain"
            />
          </div>
        </div>
      )}

      {/* ==================================== TAB 1: 7 MAJOR STAGES ==================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Infographic Quick Banner */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🖼️</span>
              <div>
                <h4 className="font-extrabold text-sm">Official Digestive System Chart Included</h4>
                <p className="text-emerald-100 text-xs">View the high-resolution infographic for complete anatomical diagrams.</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('infographic')}
              className="px-4 py-2 rounded-xl bg-white text-emerald-900 font-black text-xs hover:bg-emerald-50 transition-all shrink-0 cursor-pointer shadow-sm"
            >
              View Infographic Chart →
            </button>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-4">
            <div className="p-3 bg-emerald-600 text-white rounded-xl font-bold">7</div>
            <div>
              <h3 className="font-extrabold text-emerald-950 text-lg">The Seven Major Stages of Digestion</h3>
              <p className="text-slate-600 text-xs mt-1">From ingestion to elimination, food undergoes physical breaking, chemical splitting, absorption, and hydration balance.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {majorStages.map((stage) => (
              <div key={stage.num} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3 relative group">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex-center font-black text-xs">
                    #{stage.num}
                  </span>
                  <span className="text-2xl">{stage.icon}</span>
                </div>
                <h4 className="font-black text-slate-800 text-base">{stage.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{stage.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================== TAB 2: 14-STEP FOOD PATHWAY ==================================== */}
      {activeTab === 'pathway' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Pathway List Sidebar */}
          <div className="lg:col-span-5 space-y-2 max-h-[600px] overflow-y-auto pr-2">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider px-2 mb-3">Interactive Pathway (Click any organ)</h3>
            {pathwaySteps.map((step) => (
              <button
                key={step.step}
                onClick={() => setSelectedOrganStep(step.step)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                  selectedOrganStep === step.step
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/20 scale-101'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-xl flex-center font-black text-xs ${selectedOrganStep === step.step ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {step.step}
                  </span>
                  <div>
                    <div className="font-black text-xs leading-tight">{step.organ}</div>
                    <div className={`text-[10px] ${selectedOrganStep === step.step ? 'text-emerald-100' : 'text-slate-400'}`}>{step.section}</div>
                  </div>
                </div>
                <span className="text-lg">{step.icon}</span>
              </button>
            ))}
          </div>

          {/* Organ Function Detail Display */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedStepData.icon}</span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                    Step {selectedStepData.step} of 14 • {selectedStepData.section}
                  </span>
                  <h2 className="text-2xl font-black text-slate-800 mt-1">{selectedStepData.organ}</h2>
                </div>
              </div>
              <button
                onClick={() => speakText(`${selectedStepData.organ}. ${selectedStepData.details.join(' ')}`)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800 transition-all cursor-pointer"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Detailed Body Functions</h4>
              {selectedStepData.details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-medium leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>

            {/* Helper Organs Box if Small Intestine or Stomach selected */}
            {(selectedStepData.organ.includes('Duodenum') || selectedStepData.organ.includes('Stomach')) && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-2">
                  <span>🧪</span> Secretory Helper Organs Involved
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-semibold text-amber-800">
                  <div className="bg-white p-2.5 rounded-xl border border-amber-200/60">🩺 <strong>Liver:</strong> Secretes bile to break fat droplets</div>
                  <div className="bg-white p-2.5 rounded-xl border border-amber-200/60">🍐 <strong>Gallbladder:</strong> Stores & releases concentrated bile</div>
                  <div className="bg-white p-2.5 rounded-xl border border-amber-200/60 font-medium col-span-full">🥖 <strong>Pancreas:</strong> Produces pancreatic juice (amylase, lipase, trypsin) & bicarbonate to neutralize acid</div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button 
                disabled={selectedOrganStep === 1}
                onClick={() => setSelectedOrganStep(prev => Math.max(1, prev - 1))}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-extrabold disabled:opacity-30 cursor-pointer"
              >
                Previous Step
              </button>
              <button 
                disabled={selectedOrganStep === 14}
                onClick={() => setSelectedOrganStep(prev => Math.min(14, prev + 1))}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-extrabold disabled:opacity-30 cursor-pointer flex items-center gap-1"
              >
                Next Organ <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB 3: DIGESTIVE ENZYMES ==================================== */}
      {activeTab === 'enzymes' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="font-extrabold text-slate-800 text-lg">Digestive Enzymes & Secretions Master Table</h3>
              <p className="text-slate-500 text-xs mt-1">Chemical catalysts that break down complex macromolecules into absorbable nutrients.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enzymesList.map((enz, idx) => (
              <div key={idx} className={`p-5 rounded-2xl border ${enz.color} shadow-sm space-y-3`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/60">
                    Source: {enz.source}
                  </span>
                  <span className="text-lg">🧪</span>
                </div>
                <h4 className="font-black text-base">{enz.name}</h4>
                <div className="space-y-1 text-xs">
                  <div><strong>Target:</strong> {enz.target}</div>
                  <div><strong>Result:</strong> {enz.result}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Helper Organs Grid */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-slate-800 text-base">Secretory & Auxiliary Digestive Organs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {helperOrgans.map((h, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <span className="text-2xl">{h.icon}</span>
                  <div>
                    <h4 className="font-black text-xs text-slate-800">{h.organ}</h4>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">{h.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB 4: NUTRIENT ABSORPTION (VILLI) ==================================== */}
      {activeTab === 'absorption' && (
        <div className="space-y-8">
          
          {/* Villi & Microvilli Microscopic View */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 font-extrabold text-xs uppercase tracking-wider">
                Microscopic Anatomy • Small Intestine
              </span>
              <h2 className="text-2xl font-black text-slate-800">Inside the Small Intestine: Villi & Microvilli</h2>
              <p className="text-slate-600 text-xs leading-relaxed">
                The interior wall of the small intestine is folded into millions of tiny finger-like projections called <strong>Villi</strong> and microscopic <strong>Microvilli</strong>. This expands the absorption surface area to over 200 square meters!
              </p>
              
              <div className="space-y-2">
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-red-900">
                  🩸 <strong>Blood Capillaries:</strong> Directly absorb Glucose, Amino Acids, Water-soluble Vitamins, Minerals & Water into the bloodstream.
                </div>
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs font-semibold text-amber-900">
                  🥛 <strong>Lacteal (Lymphatic Vessel):</strong> Absorbs Fatty Acids and Glycerol into the lymphatic system before entering blood circulation.
                </div>
              </div>
            </div>

            {/* Visual Destination Cards */}
            <div className="lg:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="font-black text-xs uppercase tracking-wider text-slate-500">Nutrient Absorption Pathways ("What Goes Where")</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                  <span>🍞 <strong>Carbohydrates</strong> (Bread, Rice)</span>
                  <span className="font-bold text-emerald-600">→ Glucose → Bloodstream</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                  <span>🥩 <strong>Proteins</strong> (Meat, Beans)</span>
                  <span className="font-bold text-emerald-600">→ Amino Acids → Bloodstream</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                  <span>🥑 <strong>Fats</strong> (Oils, Nuts)</span>
                  <span className="font-bold text-amber-600">→ Fatty Acids + Glycerol → Lacteal</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                  <span>💧 <strong>Water & Minerals</strong></span>
                  <span className="font-bold text-blue-600">→ Large Intestine → Bloodstream</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB 5: QUIZ ==================================== */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-800">Digestion & Absorption Knowledge Check</h2>
              <p className="text-slate-500 text-xs mt-1">Test your understanding of body organ functions and nutrient pathways.</p>
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

    </div>
  );
}
