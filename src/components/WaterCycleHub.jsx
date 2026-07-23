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
  CloudRain,
  Droplets,
  TreeDeciduous,
  Wind,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WaterCycleHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStage, setSelectedStage] = useState('evaporation');
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

  // 8 Stages of the Water Cycle
  const waterCycleStages = [
    {
      id: 'evaporation',
      num: '1',
      name: 'Evaporation',
      icon: '☀️',
      stateChange: 'Liquid → Gas (Water Vapour)',
      color: 'bg-amber-50 border-amber-200 text-amber-900',
      badgeBg: 'bg-amber-600 text-white',
      summary: 'Heat energy from the Sun warms oceans, rivers, and lakes, changing liquid water into invisible water vapour gas that rises into the sky.',
      detailedExplanation: [
        'The Sun acts as the primary engine driving the entire water cycle.',
        'Thermal energy accelerates liquid water molecules until they escape as invisible water vapour.',
        'Over 86% of global evaporation occurs from Earth\'s oceans.',
        'Warm water vapour is lighter than cool air, so it naturally rises upward into the atmosphere.'
      ]
    },
    {
      id: 'transpiration',
      num: '2',
      name: 'Transpiration',
      icon: '🍃',
      stateChange: 'Liquid (Plant Water) → Gas (Water Vapour)',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      badgeBg: 'bg-emerald-600 text-white',
      summary: 'Plants absorb water from soil through their roots and release excess water vapour into the air through microscopic leaf pores (stomata).',
      detailedExplanation: [
        'Often called "plant sweating"—it is the process of water movement through a plant and its evaporation from aerial parts.',
        'Plants absorb water and minerals from the soil through root hairs.',
        'Water travels up through the xylem vessels to the leaves to assist in photosynthesis.',
        'Microscopic pores called stomata open to release unused water vapour into the atmosphere.'
      ]
    },
    {
      id: 'condensation',
      num: '3',
      name: 'Condensation',
      icon: '☁️',
      stateChange: 'Gas (Water Vapour) → Liquid / Ice Crystals',
      color: 'bg-sky-50 border-sky-200 text-sky-900',
      badgeBg: 'bg-sky-600 text-white',
      summary: 'As warm water vapour rises into the cool upper atmosphere, it cools down and condenses into microscopic liquid water droplets, forming clouds.',
      detailedExplanation: [
        'Cold air high in the atmosphere cannot hold as much water vapour as warm air.',
        'Water vapour cools down and attaches to microscopic dust, salt, and pollen particles (condensation nuclei).',
        'Billions of tiny water droplets cluster together to form visible clouds and fog.',
        'Condensation is the exact reverse of evaporation.'
      ]
    },
    {
      id: 'precipitation',
      num: '4',
      name: 'Precipitation',
      icon: '🌧️',
      stateChange: 'Atmospheric Water → Earth Surface',
      color: 'bg-blue-50 border-blue-200 text-blue-900',
      badgeBg: 'bg-blue-600 text-white',
      summary: 'When cloud droplets become too large and heavy for rising air to support, gravity pulls them down to Earth as rain, snow, sleet, or hail.',
      detailedExplanation: [
        'As cloud droplets collide, they grow into heavy raindrops.',
        'Rain: Liquid water droplets falling when atmospheric temperatures remain above freezing (0°C).',
        'Snow: Hexagonal ice crystals forming when temperatures are below freezing.',
        'Sleet: Frozen raindrops or slushy ice pellets.',
        'Hail: Hard balls of ice formed by strong thunderstorm updrafts repeatedly lifting ice frozen layers.'
      ]
    },
    {
      id: 'collection',
      num: '5',
      name: 'Collection',
      icon: '🌊',
      stateChange: 'Surface Water Accumulation',
      color: 'bg-cyan-50 border-cyan-200 text-cyan-900',
      badgeBg: 'bg-cyan-600 text-white',
      summary: 'Precipitation gathers in natural reservoirs across Earth—such as oceans, lakes, rivers, streams, and ice sheets.',
      detailedExplanation: [
        'Oceans hold approximately 97% of Earth\'s total water supply.',
        'Freshwater lakes, rivers, and glaciers collect the remaining 3%.',
        'Collection provides the vast water reserves required for solar evaporation to restart.'
      ]
    },
    {
      id: 'runoff',
      num: '6',
      name: 'Runoff',
      icon: '🏔️',
      stateChange: 'Surface Flow via Gravity',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-900',
      badgeBg: 'bg-indigo-600 text-white',
      summary: 'Excess rain or melting snow flows over land surfaces downhill into creeks, streams, rivers, and eventually oceans.',
      detailedExplanation: [
        'Occurs when soil is fully saturated or when rain falls on impermeable surfaces (rocks, concrete, roads).',
        'Surface runoff carves valleys, shapes landscapes, and carries minerals into freshwater bodies.',
        'Melting mountain snowpacks produce spring snowmelt runoff vital for river systems.'
      ]
    },
    {
      id: 'infiltration',
      num: '7',
      name: 'Infiltration',
      icon: '🌱',
      stateChange: 'Surface Water → Soil Moisture',
      color: 'bg-stone-50 border-stone-200 text-stone-900',
      badgeBg: 'bg-stone-600 text-white',
      summary: 'Precipitation soaks deep into the ground through porous soil, sand, and rock layers, nourishing plant roots and recharging groundwater.',
      detailedExplanation: [
        'Soil acts like a natural sponge and water filter.',
        'Infiltrating water cleanses pollutants as it trickles through sand and gravel layers.',
        'Provides essential soil moisture required by agricultural crops and natural vegetation.'
      ]
    },
    {
      id: 'groundwater',
      num: '8',
      name: 'Groundwater Flow',
      icon: '🕳️',
      stateChange: 'Subsurface Movement',
      color: 'bg-teal-50 border-teal-200 text-teal-900',
      badgeBg: 'bg-teal-600 text-white',
      summary: 'Water stored in underground rock layers (aquifers) flows slowly beneath Earth\'s surface, eventually seeping back into rivers, springs, or oceans.',
      detailedExplanation: [
        'Underground aquifers store vast quantities of fresh drinking water.',
        'Groundwater moves very slowly—sometimes taking decades or centuries to travel to a spring or ocean.',
        'Feeds natural freshwater springs and provides well water for human communities.'
      ]
    }
  ];

  // Forms of Precipitation
  const precipitationTypes = [
    { type: 'Rain 🌧️', desc: 'Liquid water droplets falling when air temperatures are above freezing (0°C).' },
    { type: 'Snow ❄️', desc: 'Intricate 6-sided ice crystals falling when atmospheric temperatures are below freezing.' },
    { type: 'Sleet 🌨️', desc: 'Frozen raindrops or slushy ice pellets created when rain passes through a cold freezing layer near the ground.' },
    { type: 'Hail 🧊', desc: 'Solid chunks of ice produced inside severe thunderstorm clouds with strong rising air currents.' }
  ];

  // Why the Water Cycle Matters (6 Reasons)
  const importancePoints = [
    { title: 'Provides Fresh Water', icon: '💧', desc: 'Solar evaporation separates pure fresh water from salty ocean water, leaving salt behind.' },
    { title: 'Helps Plants Grow', icon: '🌱', desc: 'Delivers regular rainfall necessary for crops, forests, and plant photosynthesis.' },
    { title: 'Supports Animals & People', icon: '🐢', desc: 'Provides clean drinking water for human survival and animal ecosystems.' },
    { title: 'Replenishes Lakes & Rivers', icon: '🏞️', desc: 'Restores water levels in rivers, wetlands, and freshwater reservoirs.' },
    { title: 'Regulates Weather & Climate', icon: '⛅', desc: 'Distributes solar thermal energy around the globe through air currents and clouds.' },
    { title: 'Recycles Earth\'s Water', icon: '🌍', desc: 'Continuously reuses the exact same water molecules that have existed on Earth for billions of years!' }
  ];

  // Quiz Questions
  const quizQuestions = [
    {
      id: 1,
      q: 'What provides the primary heat energy that drives the entire water cycle on Earth?',
      options: ['The Moon', 'The Sun', 'Underground Volcanoes', 'Wind Currents'],
      ans: 'The Sun'
    },
    {
      id: 2,
      q: 'Which process describes liquid water changing into invisible water vapour gas when heated?',
      options: ['Condensation', 'Evaporation', 'Infiltration', 'Precipitation'],
      ans: 'Evaporation'
    },
    {
      id: 3,
      q: 'What occurs during Condensation high in the atmosphere?',
      options: [
        'Water vapour cools and turns into tiny liquid droplets that form clouds',
        'Water soaks deep into the soil',
        'Ice melts into ocean water',
        'Plants absorb water through roots'
      ],
      ans: 'Water vapour cools and turns into tiny liquid droplets that form clouds'
    },
    {
      id: 4,
      q: 'What is Transpiration?',
      options: [
        'Rain falling from clouds',
        'Plants releasing water vapour into the air from their leaves',
        'Water flowing over rocks downhill',
        'Salty ocean water evaporating'
      ],
      ans: 'Plants releasing water vapour into the air from their leaves'
    },
    {
      id: 5,
      q: 'Which term describes water soaking deep into the ground to recharge aquifers?',
      options: ['Runoff', 'Evaporation', 'Infiltration', 'Condensation'],
      ans: 'Infiltration'
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

  const currentStageData = waterCycleStages.find(s => s.id === selectedStage) || waterCycleStages[0];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-700 p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-yellow-300" /> Science Academy • Grade 4 Earth & Environmental Science
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            The Water Cycle 💧
          </h1>
          <p className="text-blue-100 text-sm md:text-base max-w-2xl font-medium">
            Water continuously moves between Earth's surface and the atmosphere in a perpetual loop powered by the Sun!
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={() => speakText("The Water Cycle. Water continuously moves between Earth's surface and the atmosphere. The main steps are Evaporation, Transpiration, Condensation, Precipitation, Collection, Runoff, Infiltration, and Groundwater Flow.")}
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
          { id: 'overview', label: '8 Water Cycle Stages', icon: '💧' },
          { id: 'infographic', label: 'Full Infographic Chart', icon: '🖼️' },
          { id: 'precipitation', label: 'Forms of Precipitation', icon: '🌧️' },
          { id: 'importance', label: 'Why It Matters', icon: '🌍' },
          { id: 'states', label: 'States of Water & Sun Engine', icon: '☀️' },
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

      {/* ==================================== TAB 1: 8 STAGES ==================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Quick Banner */}
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-4 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌧️</span>
              <div>
                <h4 className="font-extrabold text-sm">Official Water Cycle Chart Included</h4>
                <p className="text-sky-100 text-xs">View the high-resolution infographic chart detailing Evaporation, Transpiration, Condensation, Precipitation, Runoff, and Infiltration.</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('infographic')}
              className="px-4 py-2 rounded-xl bg-white text-blue-900 font-black text-xs hover:bg-sky-50 transition-all shrink-0 cursor-pointer shadow-sm"
            >
              View Infographic Chart →
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {waterCycleStages.map((s) => (
              <div 
                key={s.id} 
                onClick={() => setSelectedStage(s.id)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-2 relative group ${
                  selectedStage === s.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20 scale-102' : 'bg-white border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-7 h-7 rounded-xl font-black text-xs flex-center ${selectedStage === s.id ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'}`}>
                    #{s.num}
                  </span>
                  <span className="text-2xl">{s.icon}</span>
                </div>
                <h3 className={`font-black text-sm ${selectedStage === s.id ? 'text-white' : 'text-slate-800'}`}>{s.name}</h3>
                <div className={`text-[10px] font-bold ${selectedStage === s.id ? 'text-blue-100' : 'text-blue-600'}`}>{s.stateChange}</div>
              </div>
            ))}
          </div>

          {/* Interactive Stage Detail Panel */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentStageData.icon}</span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                    Stage #{currentStageData.num} • {currentStageData.stateChange}
                  </span>
                  <h2 className="text-2xl font-black text-slate-800 mt-1">{currentStageData.name}</h2>
                </div>
              </div>
              <button
                onClick={() => speakText(`${currentStageData.name}. ${currentStageData.summary}. ${currentStageData.detailedExplanation.join(' ')}`)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-800 transition-all cursor-pointer"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-blue-700">Stage Summary</div>
              <div className="font-extrabold text-blue-950 text-sm leading-relaxed">{currentStageData.summary}</div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Detailed Scientific Concepts</h4>
              {currentStageData.detailedExplanation.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-medium leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>{point}</span>
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
              <h2 className="text-2xl font-black text-slate-800 mt-1">The Water Cycle Infographic Chart</h2>
              <p className="text-slate-500 text-xs mt-1">Official high-resolution diagram detailing all 8 steps of the water cycle and environmental importance.</p>
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
              src="/water_cycle_infographic.jpg" 
              alt="The Water Cycle Infographic Chart" 
              className="max-w-full h-auto rounded-xl shadow-lg border border-white max-h-[800px] object-contain group-hover:scale-101 transition-transform"
            />
          </div>
        </div>
      )}

      {/* ==================================== TAB: PRECIPITATION ==================================== */}
      {activeTab === 'precipitation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                Atmospheric Moisture
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">4 Main Forms of Precipitation</h2>
              <p className="text-slate-500 text-xs mt-1">Precipitation occurs when atmospheric water falls back to Earth in liquid or solid form depending on temperature.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {precipitationTypes.map((p, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <h3 className="font-black text-base text-slate-900">{p.type}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB: IMPORTANCE ==================================== */}
      {activeTab === 'importance' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
              Ecological & Environmental Value
            </span>
            <h2 className="text-2xl font-black text-slate-800 mt-1">Why Is the Water Cycle Important?</h2>
            <p className="text-slate-500 text-xs mt-1">Without the continuous water cycle, life on Earth could not exist!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {importancePoints.map((ip, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{ip.icon}</span>
                  <h3 className="font-black text-base text-slate-800">{ip.title}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium pt-1">{ip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================== TAB: STATES & SUN ENGINE ==================================== */}
      {activeTab === 'states' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" /> Powered by the Sun
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              The Sun acts as the ultimate powerhouse of Earth\'s climate system. Its solar radiation heats ocean surface waters, initiating evaporation. Without thermal heat from the Sun, water would remain frozen or trapped, completely halting the cycle.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-500" /> 3 States of Water in the Cycle
            </h3>
            <div className="space-y-2 text-xs font-semibold text-slate-700">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                <span className="text-blue-900 font-bold">1. Liquid: </span>Oceans, lakes, rivers, raindrops, soil moisture.
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                <span className="text-amber-900 font-bold">2. Gas (Vapour): </span>Invisible water vapour rising into the warm air.
              </div>
              <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-100">
                <span className="text-cyan-900 font-bold">3. Solid: </span>Snow crystals, ice caps, glaciers, and hail.
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
              <h2 className="text-xl font-black text-slate-800">Water Cycle Knowledge Check</h2>
              <p className="text-slate-500 text-xs mt-1">Test your understanding of evaporation, condensation, precipitation, and groundwater flow.</p>
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
                <h3 className="font-extrabold text-white text-sm">The Water Cycle Infographic</h3>
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
              src="/water_cycle_infographic.jpg" 
              alt="The Water Cycle Infographic" 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2 border-slate-700/50 object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
