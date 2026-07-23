import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  RotateCcw, 
  Award, 
  X,
  Apple,
  HeartPulse,
  Flame,
  Dumbbell,
  Brain,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function NutritionAndDietHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedGroup, setSelectedGroup] = useState('vegetables');
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

  // 5 Food Groups Data
  const foodGroups = [
    {
      id: 'vegetables',
      name: 'Vegetables',
      icon: '🥦',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      badgeBg: 'bg-emerald-600 text-white',
      mainRole: 'Rich in Vitamins & Minerals',
      examples: 'Broccoli, Carrots, Spinach, Corn, Peas, Cucumbers',
      benefits: [
        'Provides essential Vitamin A, Vitamin C, and Folate.',
        'Keeps your immune system strong to fight off illness.',
        'Rich in fiber for healthy digestive organs.'
      ]
    },
    {
      id: 'fruits',
      name: 'Fruits',
      icon: '🍎',
      color: 'bg-rose-50 border-rose-200 text-rose-900',
      badgeBg: 'bg-rose-600 text-white',
      mainRole: 'Vitamins & Natural Energy',
      examples: 'Apples, Bananas, Strawberries, Grapes, Oranges',
      benefits: [
        'Contains natural fruit sugars for quick physical energy.',
        'High in dietary fiber to aid stomach and gut digestion.',
        'Packed with antioxidants to protect body cells.'
      ]
    },
    {
      id: 'grains',
      name: 'Grains',
      icon: '🌾',
      color: 'bg-amber-50 border-amber-200 text-amber-900',
      badgeBg: 'bg-amber-600 text-white',
      mainRole: 'Carbohydrates & Brain Energy',
      examples: 'Whole grain bread, brown rice, pasta, oats, cereal',
      benefits: [
        'Provides complex carbohydrates—the main fuel for muscle activities.',
        'Slow-release glucose supports concentration and brain function during school.',
        'Whole grains contain B-vitamins and dietary fiber.'
      ]
    },
    {
      id: 'protein',
      name: 'Protein Foods',
      icon: '🥩',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-900',
      badgeBg: 'bg-indigo-600 text-white',
      mainRole: 'Muscle Building & Tissue Repair',
      examples: 'Eggs, Chicken, Fish, Beans, Lentils, Tofu, Nuts',
      benefits: [
        'Builds and maintains strong skeletal muscles.',
        'Repairs damaged tissues, cuts, and scrapes.',
        'Essential for healthy growth during childhood.'
      ]
    },
    {
      id: 'dairy',
      name: 'Dairy',
      icon: '🥛',
      color: 'bg-blue-50 border-blue-200 text-blue-900',
      badgeBg: 'bg-blue-600 text-white',
      mainRole: 'Calcium for Strong Bones & Teeth',
      examples: 'Milk, Cheese, Yogurt, Fortified Soy/Almond Milk',
      benefits: [
        'High in Calcium needed to build dense, strong bones.',
        'Contains Vitamin D for optimal calcium absorption.',
        'Strengthens enamel and protects teeth.'
      ]
    }
  ];

  // 6 Essential Nutrients & Their Roles
  const essentialNutrients = [
    { name: 'Carbohydrates', icon: '⚡', job: 'Fuel for everyday activities & exercise', sources: 'Bread, Rice, Pasta, Oats' },
    { name: 'Proteins', icon: '💪', job: 'Muscle growth & cellular repair', sources: 'Eggs, Fish, Meat, Legumes' },
    { name: 'Healthy Fats', icon: '🥑', job: 'Brain health & protecting vital organs', sources: 'Avocados, Olive Oil, Nuts' },
    { name: 'Vitamins', icon: '🛡️', job: 'Immune support & cell protection', sources: 'Fresh Fruits & Vegetables' },
    { name: 'Minerals', icon: '🦴', job: 'Strong bones, teeth & blood transport', sources: 'Milk, Leafy Greens, Iron foods' },
    { name: 'Water', icon: '💧', job: 'Hydration, temperature regulation & digestion', sources: 'Pure Water, Watermelon, Cucumbers' }
  ];

  // 6 Reasons We Need Food
  const whyWeNeedFood = [
    { title: 'Energy', icon: <Flame className="w-5 h-5 text-amber-500" />, desc: 'Powers your body to run, jump, play sports, and perform daily activities.' },
    { title: 'Growth', icon: <Dumbbell className="w-5 h-5 text-emerald-500" />, desc: 'Helps your body increase in height, weight, and muscle strength as you grow older.' },
    { title: 'Tissue Repair', icon: <HeartPulse className="w-5 h-5 text-rose-500" />, desc: 'Heals cuts, scrapes, broken bones, and worn-out body cells automatically.' },
    { title: 'Brain Development', icon: <Brain className="w-5 h-5 text-indigo-500" />, desc: 'Fuels focus, memory, problem solving, and learning capacity in school.' },
    { title: 'Healthy Organs', icon: <ShieldAlert className="w-5 h-5 text-blue-500" />, desc: 'Keeps your heart beating, lungs breathing, and digestive organs functioning.' },
    { title: 'Strong Bones & Teeth', icon: <Award className="w-5 h-5 text-purple-500" />, desc: 'Calcium and minerals build strong bones and protected teeth enamel.' }
  ];

  // Healthy Habits
  const healthyHabits = [
    { text: 'Drink plenty of water every day', icon: '💧' },
    { text: 'Eat lots of colorful vegetables', icon: '🥦' },
    { text: 'Choose whole grain breads & cereals', icon: '🌾' },
    { text: 'Eat fresh fruit every day', icon: '🍎' },
    { text: 'Exercise & play active sports regularly', icon: '🚴' },
    { text: 'Brush your teeth twice daily for 2 minutes', icon: '🪥' },
    { text: 'Get 9-11 hours of restful sleep each night', icon: '🌙' },
    { text: 'Wash your hands with soap before eating', icon: '🧼' }
  ];

  // Quiz Questions
  const quizQuestions = [
    {
      id: 1,
      q: 'Which nutrient provides the primary fuel for muscle energy during everyday physical activities?',
      options: ['Proteins', 'Carbohydrates', 'Sodium', 'Unhealthy Fats'],
      ans: 'Carbohydrates'
    },
    {
      id: 2,
      q: 'Which food group is essential for building strong muscles and repairing injured body tissues?',
      options: ['Dairy', 'Grains', 'Protein Foods', 'Sweets'],
      ans: 'Protein Foods'
    },
    {
      id: 3,
      q: 'Why should "Sometimes Foods" (like chocolates, chips, and sodas) only be enjoyed occasionally?',
      options: [
        'They are high in sugar, salt, and unhealthy fats',
        'They contain too much Vitamin C',
        'They build muscles too fast',
        'They have too much pure water'
      ],
      ans: 'They are high in sugar, salt, and unhealthy fats'
    },
    {
      id: 4,
      q: 'Which essential mineral found in milk and cheese is required for building strong bones and teeth?',
      options: ['Iron', 'Calcium', 'Potassium', 'Zinc'],
      ans: 'Calcium'
    },
    {
      id: 5,
      q: 'What is the healthiest drink for everyday hydration and digestion?',
      options: ['Fizzy Soda', 'Fruit Punch', 'Water', 'Energy Drink'],
      ans: 'Water'
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

  const currentGroupData = foodGroups.find(g => g.id === selectedGroup) || foodGroups[0];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 p-8 text-white shadow-xl shadow-emerald-500/10">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-yellow-300" /> Science Academy • Grade 4 Primary Science
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Nutrition and a Balanced Diet 🥗
          </h1>
          <p className="text-emerald-100 text-sm md:text-base max-w-2xl font-medium">
            Food gives us the energy to grow, learn, play, and stay healthy! Explore the 5 food groups, essential nutrients, and healthy daily habits.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={() => speakText("Nutrition and a Balanced Diet. Food gives us the energy to grow, learn, play, and stay healthy. A balanced diet contains the five main food groups: Vegetables, Fruits, Grains, Protein Foods, and Dairy.")}
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
          { id: 'overview', label: '5 Food Groups', icon: '🥗' },
          { id: 'infographic', label: 'Full Infographic Chart', icon: '🖼️' },
          { id: 'nutrients', label: 'Essential Nutrients & Jobs', icon: '⚡' },
          { id: 'why', label: 'Why We Need Food', icon: '🎯' },
          { id: 'lunchbox', label: 'Healthy Lunchbox & Habits', icon: '🍱' },
          { id: 'treats', label: 'Sometimes Foods', icon: '🍪' },
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

      {/* ==================================== TAB 1: 5 FOOD GROUPS ==================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Quick Banner */}
          <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-4 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🥗</span>
              <div>
                <h4 className="font-extrabold text-sm">Official Nutrition Infographic Chart Included</h4>
                <p className="text-teal-100 text-xs">View the high-resolution infographic chart detailing food groups, nutrients, lunchbox guide, and nutrition facts.</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('infographic')}
              className="px-4 py-2 rounded-xl bg-white text-emerald-900 font-black text-xs hover:bg-teal-50 transition-all shrink-0 cursor-pointer shadow-sm"
            >
              View Infographic Chart →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {foodGroups.map((g) => (
              <div 
                key={g.id} 
                onClick={() => setSelectedGroup(g.id)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3 relative group ${
                  selectedGroup === g.id ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-102' : 'bg-white border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="text-3xl">{g.icon}</div>
                <h3 className={`font-black text-base ${selectedGroup === g.id ? 'text-white' : 'text-slate-800'}`}>{g.name}</h3>
                <div className={`text-xs font-bold ${selectedGroup === g.id ? 'text-emerald-100' : 'text-emerald-600'}`}>{g.mainRole}</div>
              </div>
            ))}
          </div>

          {/* Interactive Food Group Detail Panel */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentGroupData.icon}</span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                    Food Group
                  </span>
                  <h2 className="text-2xl font-black text-slate-800 mt-1">{currentGroupData.name}</h2>
                </div>
              </div>
              <button
                onClick={() => speakText(`${currentGroupData.name}. Main role: ${currentGroupData.mainRole}. Examples: ${currentGroupData.examples}. ${currentGroupData.benefits.join(' ')}`)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800 transition-all cursor-pointer"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Primary Role</div>
                <div className="font-extrabold text-emerald-950 text-base">{currentGroupData.mainRole}</div>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-1">
                <div className="text-[10px] font-black uppercase tracking-wider text-amber-700">Healthy Examples</div>
                <div className="font-extrabold text-amber-950 text-base">{currentGroupData.examples}</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Health & Nutritional Benefits</h4>
              {currentGroupData.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-medium leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
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
              <h2 className="text-2xl font-black text-slate-800 mt-1">Nutrition and a Balanced Diet Infographic</h2>
              <p className="text-slate-500 text-xs mt-1">Official high-resolution diagram detailing food groups, nutrients, lunchbox guide, and nutrition habits.</p>
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
              src="/nutrition_and_balanced_diet_infographic.jpg" 
              alt="Nutrition and a Balanced Diet Infographic Chart" 
              className="max-w-full h-auto rounded-xl shadow-lg border border-white max-h-[800px] object-contain group-hover:scale-101 transition-transform"
            />
          </div>
        </div>
      )}

      {/* ==================================== TAB: ESSENTIAL NUTRIENTS ==================================== */}
      {activeTab === 'nutrients' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md">
                Biochemical Functions
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">The 6 Essential Nutrients & Their Jobs</h2>
              <p className="text-slate-500 text-xs mt-1">Every nutrient plays a specific biological role to keep your body energetic, focused, and disease-free.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {essentialNutrients.map((n, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 hover:border-emerald-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{n.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">Nutrient #{idx + 1}</span>
                  </div>
                  <h3 className="font-black text-base text-slate-900">{n.name}</h3>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-100 text-xs font-semibold text-slate-800">
                    <span className="text-emerald-600 font-extrabold">Job: </span>{n.job}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    <span className="font-bold text-slate-700">Healthy Sources: </span>{n.sources}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB: WHY WE NEED FOOD ==================================== */}
      {activeTab === 'why' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
              Physiological Purpose
            </span>
            <h2 className="text-2xl font-black text-slate-800 mt-1">Why Do We Need Food?</h2>
            <p className="text-slate-500 text-xs mt-1">Food provides essential energy, building blocks, and cellular protection for 6 key body needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyWeNeedFood.map((w, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-white border border-slate-200">{w.icon}</div>
                  <h3 className="font-black text-base text-slate-800">{w.title}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium pt-1">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================== TAB: LUNCHBOX & HABITS ==================================== */}
      {activeTab === 'lunchbox' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🍱</span>
              <div>
                <h3 className="font-black text-xl text-slate-800">Building a Balanced Healthy Lunchbox</h3>
                <p className="text-slate-500 text-xs">A balanced school lunchbox combines carbs, protein, veggies, fruits, and hydration.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <div className="text-amber-900 font-bold">1. Main Energy (Grains & Protein)</div>
                <p className="text-amber-800 font-normal">Whole grain sandwich with chicken, tuna, or cheese.</p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="text-emerald-900 font-bold">2. Fresh Crunch (Vegetables)</div>
                <p className="text-emerald-800 font-normal">Carrot sticks, cucumber slices, or cherry tomatoes.</p>
              </div>
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
                <div className="text-rose-900 font-bold">3. Natural Sweetener (Fruit & Dairy)</div>
                <p className="text-rose-800 font-normal">An apple, banana, or low-sugar yogurt cup.</p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                <div className="text-blue-900 font-bold">4. Pure Hydration (Water)</div>
                <p className="text-blue-800 font-normal">Fresh water bottle—the healthiest drink of all!</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
              <span>🌱</span> 8 Everyday Healthy Habits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-semibold text-slate-700">
              {healthyHabits.map((h, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <span className="text-2xl">{h.icon}</span>
                  <span>{h.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB: SOMETIMES FOODS ==================================== */}
      {activeTab === 'treats' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🍩</span>
            <div>
              <h2 className="text-2xl font-black text-slate-800">"Sometimes Foods" (Occasional Treats)</h2>
              <p className="text-slate-500 text-xs">Foods like sodas, chocolates, chips, and fast food should only be enjoyed occasionally.</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-3 text-xs text-rose-900">
            <div className="font-black text-sm text-rose-950">Why limit "Sometimes Foods"?</div>
            <p className="leading-relaxed font-medium">
              These foods are often high in added <strong>sugar</strong>, <strong>salt</strong>, and <strong>unhealthy saturated fats</strong> while offering very few essential vitamins, minerals, or fiber. Eating them too often can lead to tooth decay, low energy crashes, and health complications.
            </p>
          </div>
        </div>
      )}

      {/* ==================================== TAB: QUIZ ==================================== */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-800">Nutrition Knowledge Check</h2>
              <p className="text-slate-500 text-xs mt-1">Test your understanding of food groups, nutrients, and healthy diet habits.</p>
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
                <h3 className="font-extrabold text-white text-sm">Nutrition and a Balanced Diet Infographic</h3>
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
              src="/nutrition_and_balanced_diet_infographic.jpg" 
              alt="Nutrition and a Balanced Diet Infographic" 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2 border-slate-700/50 object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
