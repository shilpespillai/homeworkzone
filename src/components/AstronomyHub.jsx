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
  Moon,
  Compass,
  Star,
  Globe,
  Eye,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AstronomyHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPhase, setSelectedPhase] = useState('new');
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

  // 8 Moon Phases Data
  const moonPhases = [
    {
      id: 'new',
      num: '1',
      name: 'New Moon',
      icon: '🌑',
      appearance: 'Completely Dark / Invisible',
      lightSide: '0% visible from Earth',
      summary: 'The Moon is positioned directly between the Earth and the Sun. The illuminated half faces away from Earth, making the Moon invisible in the day or night sky.',
      detailedExplanation: [
        'Marks the official beginning of the 29.5-day lunar cycle (synodic month).',
        'Rises at sunrise and sets at sunset, moving across the sky with the Sun.',
        'A Solar Eclipse can ONLY occur during a New Moon phase when alignment is precise.'
      ]
    },
    {
      id: 'waxing_crescent',
      num: '2',
      name: 'Waxing Crescent',
      icon: '🌒',
      appearance: 'Thin sliver of light on the right',
      lightSide: '1% – 49% visible',
      summary: 'As the Moon moves along its orbit away from the Sun, a thin silver sliver of sunlight becomes visible on the right-hand edge.',
      detailedExplanation: [
        '"Waxing" means growing larger day by day.',
        'Best viewed in the western sky right after sunset.',
        'Earthshine (reflected sunlight from Earth) often dimly illuminates the dark portion of the Moon.'
      ]
    },
    {
      id: 'first_quarter',
      num: '3',
      name: 'First Quarter',
      icon: '🌓',
      appearance: 'Exact Half Moon (Right half lit)',
      lightSide: '50% visible',
      summary: 'The Moon has completed one-quarter of its orbit around Earth. Exactly half of the visible face is brightly illuminated on the right side.',
      detailedExplanation: [
        'Called "First Quarter" because the Moon has traveled 1/4 of its total orbital cycle.',
        'Rises around noon and reaches its highest point in the sky around sunset.',
        'The boundary line between light and dark is called the "terminator".'
      ]
    },
    {
      id: 'waxing_gibbous',
      num: '4',
      name: 'Waxing Gibbous',
      icon: '🌔',
      appearance: 'More than half lit (Right side)',
      lightSide: '51% – 99% visible',
      summary: 'The illuminated portion continues to grow larger than half, shaping like a swollen oval as it approaches a full moon.',
      detailedExplanation: [
        '"Gibbous" comes from a Latin word meaning humped or swollen.',
        'Grows brighter each night as more sunlight strikes the side facing Earth.',
        'Visible during late afternoon and stays up for most of the night.'
      ]
    },
    {
      id: 'full',
      num: '5',
      name: 'Full Moon',
      icon: '🌕',
      appearance: 'Fully lit complete disk',
      lightSide: '100% visible',
      summary: 'Earth is positioned between the Sun and the Moon. The entire face of the Moon facing Earth is fully illuminated by sunlight.',
      detailedExplanation: [
        'Rises in the east exactly as the Sun sets in the west, staying visible all night.',
        'Craters, maria (dark ancient lava plains), and bright rays are clearly visible.',
        'A Lunar Eclipse can ONLY occur during a Full Moon when Earth casts its shadow.'
      ]
    },
    {
      id: 'waning_gibbous',
      num: '6',
      name: 'Waning Gibbous',
      icon: '🌖',
      appearance: 'More than half lit (Left side)',
      lightSide: '99% – 51% visible',
      summary: 'After the Full Moon, the illuminated portion begins to shrink ("wane"). Light remains on the left side while darkness creeps in on the right.',
      detailedExplanation: [
        '"Waning" means decreasing or shrinking in size.',
        'Rises later in the evening after dark.',
        'The light shrinks from right to left.'
      ]
    },
    {
      id: 'last_quarter',
      num: '7',
      name: 'Last / Third Quarter',
      icon: '🌗',
      appearance: 'Exact Half Moon (Left half lit)',
      lightSide: '50% visible',
      summary: 'The Moon has completed three-quarters of its orbit around Earth. Exactly half of the visible face is illuminated on the left side.',
      detailedExplanation: [
        'Rises around midnight and reaches its highest point at sunrise.',
        'Also known as the Third Quarter Moon.',
        'Opposite appearance of the First Quarter.'
      ]
    },
    {
      id: 'waning_crescent',
      num: '8',
      name: 'Waning Crescent',
      icon: '🌘',
      appearance: 'Thin sliver of light on the left',
      lightSide: '49% – 1% visible',
      summary: 'A final thin crescent of light remains on the left edge before the Moon disappears into the dark New Moon phase to start the cycle again.',
      detailedExplanation: [
        'Best seen in the eastern sky just before dawn.',
        'Decreases slightly each morning until it becomes invisible.',
        'Completes the 29.5-day synodic lunar cycle.'
      ]
    }
  ];

  // Star Types & Temperature Data
  const starColors = [
    { type: 'Blue-White Stars 💙', temp: 'Super Hot (10,000°C – 30,000°C+)', desc: 'Massive, extremely energetic stars burning nuclear fuel rapidly.', ex: 'Rigel, Spica, Vega' },
    { type: 'Yellow Stars 💛', temp: 'Medium Temp (~5,500°C)', desc: 'Stable main-sequence dwarf stars like our Sun, shining steady light for billions of years.', ex: 'Our Sun, Alpha Centauri A' },
    { type: 'Red Stars ❤️', temp: 'Cooler Temp (~3,000°C)', desc: 'Cooler stars, including red dwarfs and swollen red supergiants near the end of life.', ex: 'Betelgeuse, Antares, Proxima Centauri' }
  ];

  // Constellations Data
  const constellationsList = [
    { name: 'Southern Cross (Crux) ⚓', sky: 'Southern Hemisphere', desc: 'A famous 4-star cross constellation used for navigation and featured prominently on the Australian national flag.' },
    { name: 'Orion (The Hunter) 🏹', sky: 'Equatorial / Global', desc: 'Easily recognized by "Orion\'s Belt"—three bright stars aligned in a straight row (Alnitak, Alnilam, Mintaka).' },
    { name: 'Scorpius (The Scorpion) 🦂', sky: 'Winter Night Sky', desc: 'Curved constellation resembling a scorpion with the bright red supergiant star Antares at its heart.' },
    { name: 'Canis Major (Greater Dog) 🐕', sky: 'Summer Night Sky', desc: 'Contains Sirius (the Dog Star)—the absolute brightest star in Earth\'s night sky, located 8.6 light-years away!' }
  ];

  // Shadow Mechanics
  const shadowDetails = [
    { time: 'Morning 🌅', sunPos: 'Low in the East', shadowLength: 'Very Long shadow pointing WEST', reason: 'Low sun angle casts long light rays across the ground.' },
    { time: 'Midday / Solar Noon ☀️', sunPos: 'High overhead', shadowLength: 'Shortest shadow directly beneath', reason: 'Steep vertical light angle casts minimal shadow area.' },
    { time: 'Afternoon 🌇', sunPos: 'Low in the West', shadowLength: 'Very Long shadow pointing EAST', reason: 'Low sun angle in west projects shadows towards the east.' }
  ];

  // Quiz Questions
  const quizQuestions = [
    {
      id: 1,
      q: 'How long does it take for Earth to complete one full rotation on its tilted axis?',
      options: ['365 days', '24 hours', '27 days', '12 hours'],
      ans: '24 hours'
    },
    {
      id: 2,
      q: 'Why does the Sun look so much larger and brighter than other stars in the night sky?',
      options: [
        'Because the Sun is much closer to Earth than any other star',
        'Because the Sun is the largest star in the universe',
        'Because the Sun is made of liquid water',
        'Because Earth does not orbit the Sun'
      ],
      ans: 'Because the Sun is much closer to Earth than any other star'
    },
    {
      id: 3,
      q: 'What causes the daily cycle of Day and Night on Earth?',
      options: [
        'The Moon blocking the Sun',
        'Earth rotating on its axis once every 24 hours',
        'The Sun orbiting around Earth',
        'Clouds covering the sky'
      ],
      ans: 'Earth rotating on its axis once every 24 hours'
    },
    {
      id: 4,
      q: 'Which Moon phase occurs when the Moon is directly between the Earth and Sun, making it invisible in the sky?',
      options: ['Full Moon', 'New Moon', 'First Quarter', 'Waxing Gibbous'],
      ans: 'New Moon'
    },
    {
      id: 5,
      q: 'Which star is the brightest star visible in Earth\'s night sky?',
      options: ['Betelgeuse', 'Sirius (in Canis Major)', 'Antares', 'Polaris'],
      ans: 'Sirius (in Canis Major)'
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

  const currentPhaseData = moonPhases.find(p => p.id === selectedPhase) || moonPhases[0];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 p-8 text-white shadow-xl shadow-indigo-950/20 border border-indigo-800/50">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-md text-xs font-bold tracking-wider uppercase text-blue-300">
            <Sparkles className="w-4 h-4 text-yellow-300" /> Science Academy • Grade 4 Space & Astronomy
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Astronomy: Earth, Moon, Sun & Stars 🚀✨
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-3xl font-medium leading-relaxed">
            Earth rotates on its 23.5° tilted axis every 24 hours, Earth orbits the Sun every 365.25 days, and the Moon orbits Earth every 27.3 days. Discover the mechanics of day/night, lunar phases, shadows, and distant stars!
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={() => speakText("Astronomy: Earth, Moon, Sun and Stars. Earth rotates on its axis once every 24 hours, causing day and night. Earth orbits the Sun once every 365 days, causing the seasons. The Moon orbits Earth once every month, creating the eight moon phases.")}
              className="px-4 py-2 rounded-xl bg-blue-500 text-white font-extrabold text-xs flex items-center gap-2 hover:bg-blue-600 transition-all shadow-md cursor-pointer"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4 text-red-300" /> : <Volume2 className="w-4 h-4 text-white" />}
              {isPlayingAudio ? 'Stop Audio' : 'Listen to Overview'}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
            >
              🖼️ View Full Infographic Chart
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Rotation, Orbit & Seasons', icon: '🌍' },
          { id: 'infographic', label: 'Full Infographic Chart', icon: '🖼️' },
          { id: 'moon', label: '8 Phases of the Moon', icon: '🌕' },
          { id: 'sun_stars', label: 'The Sun & Star Colors', icon: '☀️' },
          { id: 'constellations', label: 'Constellations & Night Sky', icon: '✨' },
          { id: 'shadows', label: 'Shadows & Light Travel', icon: '☀️' },
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

      {/* ==================================== TAB 1: ROTATION & ORBIT ==================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Quick Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-4 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md border border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌌</span>
              <div>
                <h4 className="font-extrabold text-sm">Official Astronomy Chart Included</h4>
                <p className="text-slate-300 text-xs">View the high-resolution infographic chart detailing rotation, orbits, 8 moon phases, star brightness, and constellations.</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('infographic')}
              className="px-4 py-2 rounded-xl bg-blue-500 text-white font-black text-xs hover:bg-blue-600 transition-all shrink-0 cursor-pointer shadow-sm"
            >
              View Infographic Chart →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <Globe className="w-7 h-7 text-blue-600 shrink-0" />
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">24 Hours / 1 Day</span>
                  <h3 className="font-black text-xl text-slate-800">Earth's Rotation (Day & Night)</h3>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Earth spins continuously around its own imaginary axis once every <strong>24 hours</strong>. Earth rotates from West to East (counter-clockwise looking down from the North Pole).
              </p>
              <div className="space-y-2 text-xs font-semibold text-slate-700">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                  <span><strong>Daytime: </strong>The side facing TOWARDS the Sun is lit up by sunlight.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 flex items-center gap-2">
                  <Moon className="w-4 h-4 text-slate-300 shrink-0" />
                  <span><strong>Nighttime: </strong>The side facing AWAY from the Sun is in darkness.</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <Sun className="w-7 h-7 text-amber-500 shrink-0" />
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">365.25 Days / 1 Year</span>
                  <h3 className="font-black text-xl text-slate-800">Earth's Orbit & Seasons</h3>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Earth travels along a curved, slightly oval (elliptical) path around the Sun once every <strong>365.25 days</strong> (1 solar year).
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-2 text-xs font-medium text-indigo-950">
                <div className="font-bold text-sm text-indigo-900">Why do we have Seasons?</div>
                <p className="leading-relaxed">
                  Seasons are caused by Earth's <strong>23.5° axial tilt</strong> as it revolves around the Sun. When a hemisphere tilts towards the Sun, it experiences Summer (longer days, direct sunlight). When it tilts away, it experiences Winter (shorter days, indirect sunlight).
                </p>
              </div>
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
              <h2 className="text-2xl font-black text-slate-800 mt-1">Astronomy: Earth, Moon, Sun & Stars Infographic</h2>
              <p className="text-slate-500 text-xs mt-1">Official high-resolution diagram detailing orbits, moon phases, shadows, star brightness, and constellations.</p>
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
              src="/astronomy_infographic.jpg" 
              alt="Astronomy Infographic Chart" 
              className="max-w-full h-auto rounded-xl shadow-lg border border-white max-h-[800px] object-contain group-hover:scale-101 transition-transform"
            />
          </div>
        </div>
      )}

      {/* ==================================== TAB: 8 MOON PHASES ==================================== */}
      {activeTab === 'moon' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {moonPhases.map((p) => (
              <div 
                key={p.id}
                onClick={() => setSelectedPhase(p.id)}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer space-y-1 ${
                  selectedPhase === p.id ? 'bg-slate-900 border-blue-500 text-white shadow-lg scale-105' : 'bg-white border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="text-2xl">{p.icon}</div>
                <div className="font-black text-[11px] leading-tight">{p.name}</div>
                <div className="text-[9px] opacity-75 font-semibold">Phase #{p.num}</div>
              </div>
            ))}
          </div>

          {/* Interactive Phase Detail Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentPhaseData.icon}</span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-950 px-2.5 py-1 rounded-md border border-blue-800">
                    Phase #{currentPhaseData.num} • {currentPhaseData.lightSide}
                  </span>
                  <h2 className="text-2xl font-black text-white mt-1">{currentPhaseData.name}</h2>
                </div>
              </div>
              <button
                onClick={() => speakText(`${currentPhaseData.name}. Appearance: ${currentPhaseData.appearance}. ${currentPhaseData.summary}. ${currentPhaseData.detailedExplanation.join(' ')}`)}
                className="p-2.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all cursor-pointer"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-blue-400">Phase Summary</div>
              <div className="font-bold text-slate-200 text-sm leading-relaxed">{currentPhaseData.summary}</div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Detailed Astronomy Concepts</h4>
              {currentPhaseData.detailedExplanation.map((exp, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-slate-800 text-slate-300 text-xs font-medium leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>{exp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB: THE SUN & STARS ==================================== */}
      {activeTab === 'sun_stars' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                Stellar Physics
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">Star Brightness & Color Temperatures</h2>
              <p className="text-slate-500 text-xs mt-1">The Sun is a medium-sized star located ~150 million km from Earth. Other stars appear as tiny dots because they are trillions of km away!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {starColors.map((sc, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <h3 className="font-black text-base text-slate-900">{sc.type}</h3>
                  <div className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-extrabold text-xs inline-block">
                    {sc.temp}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium pt-1">{sc.desc}</p>
                  <div className="text-[11px] font-bold text-blue-700">
                    Examples: <span className="font-normal text-slate-700">{sc.ex}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Safety Alert Box */}
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-900 flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0" />
              <span><strong>SAFETY WARNING: </strong>Never look directly at the Sun with the naked eye, binoculars, or telescopes! Doing so can cause permanent blindness. Always use pinhole projection boxes or ISO-certified solar viewing glasses.</span>
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB: CONSTELLATIONS ==================================== */}
      {activeTab === 'constellations' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              Deep Space Patterns
            </span>
            <h2 className="text-2xl font-black text-slate-800 mt-1">Constellations & Changing Night Sky</h2>
            <p className="text-slate-500 text-xs mt-1">As Earth orbits the Sun, our night side points out towards different parts of space, changing which constellations are visible across seasons!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {constellationsList.map((c, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <h3 className="font-black text-base text-slate-900">{c.name}</h3>
                <div className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {c.sky}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium pt-1">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================== TAB: SHADOWS ==================================== */}
      {activeTab === 'shadows' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
              Light & Shadow Behavior
            </span>
            <h2 className="text-2xl font-black text-slate-800 mt-1">How Shadows Change Throughout the Day</h2>
            <p className="text-slate-500 text-xs mt-1">A shadow forms when an opaque object blocks light. Light travels in straight lines!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shadowDetails.map((sd, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="font-black text-base text-slate-900">{sd.time}</div>
                <div className="text-xs font-bold text-amber-700">Sun Position: {sd.sunPos}</div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-extrabold text-blue-900">
                  {sd.shadowLength}
                </div>
                <p className="text-xs text-slate-600 font-medium pt-1">{sd.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================== TAB: QUIZ ==================================== */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-800">Astronomy Knowledge Check</h2>
              <p className="text-slate-500 text-xs mt-1">Test your understanding of rotation, orbit, moon phases, and stars.</p>
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
                <h3 className="font-extrabold text-white text-sm">Astronomy: Earth, Moon, Sun and Stars Infographic</h3>
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
              src="/astronomy_infographic.jpg" 
              alt="Astronomy Infographic" 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2 border-slate-700/50 object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
