import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  RotateCcw, 
  Award, 
  X,
  Dna,
  Heart,
  Sun,
  ShieldCheck,
  Search,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HeredityHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTraitType, setSelectedTraitType] = useState('inherited');
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

  // Trait Categories: Inherited vs Environmental
  const traitCategories = [
    {
      id: 'inherited',
      name: 'Inherited Traits 🧬',
      description: 'Characteristics passed down genetically from parents to offspring from birth.',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-950',
      badgeBg: 'bg-emerald-600 text-white',
      summary: 'Inherited traits are present from birth or early development and are controlled by genetic DNA passed down from biological parents.',
      examples: [
        'Eye colour (Brown, Blue, Green)',
        'Hair texture & colour (Curly, Straight, Brown, Blonde)',
        'Natural presence of freckles and cheek dimples',
        'Attached vs unattached earlobes',
        'Plant flower color & leaf shape',
        'Dog fur coat color & beak shape in birds'
      ]
    },
    {
      id: 'environmental',
      name: 'Environmental / Acquired Traits 🪴',
      description: 'Characteristics affected by nutrition, sunlight, exercise, and learning.',
      color: 'bg-amber-50 border-amber-200 text-amber-950',
      badgeBg: 'bg-amber-700 text-white',
      summary: 'Environmental traits develop over a lifetime through diet, sunlight exposure, physical exercise, injury, or learned skills.',
      examples: [
        'Plant height (More sunlight = Taller plant; Less sun = Stunted growth)',
        'Muscle strength built through physical exercise',
        'Scars from cuts or injuries',
        'Learned skills (Playing piano, speaking English, swimming)',
        'Healthy body growth shaped by nutritious food and clean water'
      ]
    }
  ];

  // Parent-Offspring Pairs
  const parentOffspringPairs = [
    { parent: 'Cow 🐄', offspring: 'Calf 🐮' },
    { parent: 'Dog 🐕', offspring: 'Puppy 🐶' },
    { parent: 'Cat 🐈', offspring: 'Kitten 🐱' },
    { parent: 'Horse 🐎', offspring: 'Foal 🐴' },
    { parent: 'Duck 🦆', offspring: 'Duckling 🐥' },
    { parent: 'Chicken 🐓', offspring: 'Chick 🐣' },
    { parent: 'Frog 🐸', offspring: 'Tadpole 🐸' },
    { parent: 'Butterfly 🦋', offspring: 'Caterpillar 🐛' },
    { parent: 'Kangaroo 🦘', offspring: 'Joey 🦘' },
    { parent: 'Penguin 🐧', offspring: 'Chick 🐥' }
  ];

  // Scientific Hypothesis Testing Example
  const hypothesisData = [
    { sun: 'Lots of Sun ☀️', height: '15 cm', leaf: 'Healthy Dark Green', growth: 'Thriving & Tall' },
    { sun: 'Partial Sun ⛅', height: '7 cm', leaf: 'Pale Green', growth: 'Moderate' },
    { sun: 'Shade / Little Sun ☁️', height: '2 cm', leaf: 'Yellowish Thin', growth: 'Stunted' }
  ];

  // Quiz Questions
  const quizQuestions = [
    {
      id: 1,
      q: 'Which of the following is an INHERITED trait passed from parents to offspring?',
      options: ['Natural eye color', 'Ability to play the piano', 'A scar on your knee', 'Speaking two languages'],
      ans: 'Natural eye color'
    },
    {
      id: 2,
      q: 'How does sunlight affect plant growth as an environmental factor?',
      options: [
        'Plants with more sunlight grow taller and healthier than shaded plants',
        'Sunlight turns plants into dogs',
        'Sunlight makes plants shrink to 0 cm',
        'Sunlight changes a plant into a animal'
      ],
      ans: 'Plants with more sunlight grow taller and healthier than shaded plants'
    },
    {
      id: 3,
      q: 'What is the correct scientific term for a baby cow?',
      options: ['Calf', 'Puppy', 'Foal', 'Joey'],
      ans: 'Calf'
    },
    {
      id: 4,
      q: 'Why is variation within a species important for survival?',
      options: [
        'Variation helps populations adapt and survive when environments change',
        'Variation makes all animals look identical',
        'Variation stops plants from growing',
        'Variation removes DNA'
      ],
      ans: 'Variation helps populations adapt and survive when environments change'
    },
    {
      id: 5,
      q: 'Are skills like swimming, riding a bicycle, or speaking a language inherited at birth?',
      options: [
        'No, these are acquired/learned skills influenced by environment and practice',
        'Yes, babies are born knowing how to ride bicycles',
        'Yes, language is encoded in eye color',
        'No, swimming is impossible'
      ],
      ans: 'No, these are acquired/learned skills influenced by environment and practice'
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

  const currentTraitData = traitCategories.find(t => t.id === selectedTraitType) || traitCategories[0];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-green-800 p-8 text-white shadow-xl shadow-emerald-600/10">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-yellow-300" /> Science Academy • Grade 4 Biology & Genetics
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Traits & Heredity: How Living Things Inherit Characteristics 🧬🌿
          </h1>
          <p className="text-emerald-100 text-sm md:text-base max-w-3xl font-medium leading-relaxed">
            Living things have unique traits! Discover how genetic characteristics are passed down from parents to offspring, how environmental factors shape growth, and why variation makes every living organism unique.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={() => speakText("Traits and Heredity: How Living Things Inherit Characteristics. Living things have traits. Many traits are inherited from biological parents, while some are influenced by the environment. Inherited traits include eye color, hair color, and dimples. Environmental factors include sunlight, nutrition, and exercise.")}
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
          { id: 'overview', label: 'Inherited vs Environmental', icon: '🧬' },
          { id: 'infographic', label: 'Full Infographic Chart', icon: '🖼️' },
          { id: 'parents', label: 'Parent & Offspring Pairs', icon: '🐣' },
          { id: 'hypothesis', label: 'Testing Environmental Effects', icon: '☀️' },
          { id: 'variation', label: 'Species Variation', icon: '👥' },
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

      {/* ==================================== TAB 1: INHERITED VS ENVIRONMENTAL ==================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Quick Banner */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-4 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🧬</span>
              <div>
                <h4 className="font-extrabold text-sm">Official Heredity & Traits Infographic Included</h4>
                <p className="text-emerald-100 text-xs">View the high-resolution infographic chart detailing inherited factors, environmental influences, parent-offspring matching, and species variation.</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('infographic')}
              className="px-4 py-2 rounded-xl bg-white text-emerald-950 font-black text-xs hover:bg-emerald-50 transition-all shrink-0 cursor-pointer shadow-sm"
            >
              View Infographic Chart →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {traitCategories.map((t) => (
              <div 
                key={t.id} 
                onClick={() => setSelectedTraitType(t.id)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-2 relative group ${
                  selectedTraitType === t.id ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg scale-102' : 'bg-white border-slate-200 hover:border-emerald-300'
                }`}
              >
                <h3 className={`font-black text-base ${selectedTraitType === t.id ? 'text-white' : 'text-slate-800'}`}>{t.name}</h3>
                <div className={`text-xs font-bold ${selectedTraitType === t.id ? 'text-emerald-100' : 'text-emerald-700'}`}>{t.description}</div>
              </div>
            ))}
          </div>

          {/* Interactive Trait Detail Panel */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  Genetics & Growth
                </span>
                <h2 className="text-2xl font-black text-slate-800 mt-1">{currentTraitData.name}</h2>
              </div>
              <button
                onClick={() => speakText(`${currentTraitData.name}. Description: ${currentTraitData.description}. ${currentTraitData.summary}. Key examples: ${currentTraitData.examples.join(', ')}`)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800 transition-all cursor-pointer"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Scientific Explanation</div>
              <div className="font-bold text-emerald-950 text-xs md:text-sm leading-relaxed">{currentTraitData.summary}</div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Key Examples & Features</h4>
              {currentTraitData.examples.map((ex, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-medium leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{ex}</span>
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
              <h2 className="text-2xl font-black text-slate-800 mt-1">Traits and Heredity Infographic</h2>
              <p className="text-slate-500 text-xs mt-1">Official high-resolution diagram detailing inherited traits, environmental factors, parent-offspring pairs, and plant/animal traits comparison.</p>
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
              src="/heredity_infographic.jpg" 
              alt="Heredity Infographic Chart" 
              className="max-w-full h-auto rounded-xl shadow-lg border border-white max-h-[800px] object-contain group-hover:scale-101 transition-transform"
            />
          </div>
        </div>
      )}

      {/* ==================================== TAB: PARENT & OFFSPRING ==================================== */}
      {activeTab === 'parents' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
              Generational Matching
            </span>
            <h2 className="text-2xl font-black text-slate-800 mt-1">Parent & Offspring Pairings</h2>
            <p className="text-slate-500 text-xs mt-1">Offspring inherit physical body structures, fur patterns, and traits from their biological parents!</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {parentOffspringPairs.map((p, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-center space-y-1">
                <div className="font-black text-sm text-slate-900">{p.parent}</div>
                <div className="text-xs font-bold text-emerald-700">↓</div>
                <div className="font-extrabold text-xs text-emerald-950">{p.offspring}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================== TAB: HYPOTHESIS TESTING ==================================== */}
      {activeTab === 'hypothesis' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-xl text-slate-800 flex items-center gap-2">
              <Sun className="w-6 h-6 text-amber-500" /> Testing Environmental Effects on Plant Growth
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              <strong>Hypothesis:</strong> "I think plants with more sunlight will grow taller." Scientists test hypotheses by measuring growth under different environmental conditions!
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100 text-slate-700">
                    <th className="p-3 font-black">Sunlight Condition</th>
                    <th className="p-3 font-black">Plant Height (cm)</th>
                    <th className="p-3 font-black">Leaf Appearance</th>
                    <th className="p-3 font-black">Growth Result</th>
                  </tr>
                </thead>
                <tbody>
                  {hypothesisData.map((h, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{h.sun}</td>
                      <td className="p-3 font-extrabold text-emerald-700">{h.height}</td>
                      <td className="p-3 text-slate-700">{h.leaf}</td>
                      <td className="p-3 text-slate-700">{h.growth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-950">
              <strong>Conclusion:</strong> Empirical data shows plants receiving lots of sunlight grew to 15 cm versus 2 cm in shade. This confirms the hypothesis that sunlight is a critical environmental factor for plant growth!
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB: SPECIES VARIATION ==================================== */}
      {activeTab === 'variation' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-emerald-600" />
            <div>
              <h2 className="text-2xl font-black text-slate-800">Variation in Living Things</h2>
              <p className="text-slate-500 text-xs">Members of the same species share basic body plans, but individual members have unique combinations of traits!</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-950 space-y-2">
            <div className="font-black text-sm">Why is Variation Important?</div>
            <p>Variation helps animal and plant populations survive changing habitats, diseases, or climate shifts. If every individual were identical, a single disease could wipe out the entire species!</p>
          </div>
        </div>
      )}

      {/* ==================================== TAB: QUIZ ==================================== */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-800">Heredity & Traits Knowledge Check</h2>
              <p className="text-slate-500 text-xs mt-1">Test your understanding of inherited traits, environmental influences, and parent-offspring pairings.</p>
            </div>
            {quizScore !== null && (
              <div className="px-4 py-2 rounded-2xl bg-emerald-100 text-emerald-950 font-black text-sm flex items-center gap-2">
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
                <h3 className="font-extrabold text-white text-sm">Traits and Heredity Infographic</h3>
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
              src="/heredity_infographic.jpg" 
              alt="Heredity Infographic" 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2 border-slate-700/50 object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
