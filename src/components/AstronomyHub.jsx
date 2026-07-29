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
  ShieldAlert,
  ZoomIn,
  Maximize2,
  Layers,
  Zap,
  Info,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AstronomyHub() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedInfographic, setSelectedInfographic] = useState('solar_system'); // 'solar_system' | 'astronomy'
  const [selectedPlanet, setSelectedPlanet] = useState('earth');
  const [selectedSunLayer, setSelectedSunLayer] = useState('core');
  const [selectedPhase, setSelectedPhase] = useState('new');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [modalImage, setModalImage] = useState(null); // null | '/solar_system_infographic.jpg' | '/astronomy_infographic.jpg'

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

  // Solar System 8 Planets Data
  const planetsData = [
    {
      id: 'mercury',
      name: 'Mercury',
      symbol: '☿',
      tagline: 'The Innermost & Smallest Planet',
      type: 'Terrestrial (Rocky)',
      gradient: 'from-amber-600 via-stone-500 to-slate-700',
      textColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/20 border-amber-500/30 text-amber-300',
      order: '1st planet from Sun',
      distanceAU: '0.39 AU',
      distanceKm: '57.9 million km',
      radius: '2,440 km (0.38 Earths)',
      dayLength: '59 Earth days',
      yearLength: '88 Earth days',
      moons: '0 Moons',
      atmosphere: 'Thin exosphere (Sodium, Helium, Hydrogen)',
      surfaceTemp: '-180°C to 430°C',
      summary: 'Mercury is the closest planet to the Sun and the smallest in our Solar System. It speeds around the Sun faster than any other planet!',
      keyFacts: [
        'Speed Demon: Travels around the Sun at ~47 km/s (105,000 mph).',
        'Extreme Temperature Swings: Scorching hot on the sunlit side (430°C), freezing cold at night (-180°C) due to no thick atmosphere.',
        'Cratered Surface: Heavily pockmarked with impact craters, resembling Earth\'s Moon.'
      ]
    },
    {
      id: 'venus',
      name: 'Venus',
      symbol: '♀',
      tagline: 'Earth\'s Toxic Twin & Hottest Planet',
      type: 'Terrestrial (Rocky)',
      gradient: 'from-amber-500 via-orange-500 to-yellow-600',
      textColor: 'text-amber-300',
      badgeBg: 'bg-orange-500/20 border-orange-500/30 text-amber-200',
      order: '2nd planet from Sun',
      distanceAU: '0.72 AU',
      distanceKm: '108.2 million km',
      radius: '6,052 km (0.95 Earths)',
      dayLength: '243 Earth days (slowest rotation)',
      yearLength: '225 Earth days',
      moons: '0 Moons',
      atmosphere: 'Thick CO₂ (96.5%) with Sulfuric Acid clouds',
      surfaceTemp: '~465°C (Hottest planet!)',
      summary: 'Venus is surrounded by a dense atmosphere of carbon dioxide that traps solar heat in a runaway greenhouse effect, making it hot enough to melt lead!',
      keyFacts: [
        'Backward Spinner: Rotates backwards (retrograde) relative to most planets; the Sun rises in the West and sets in the East.',
        'Day Longer than Year: Takes 243 Earth days to rotate once, but only 225 Earth days to complete an orbit around the Sun!',
        'Crushing Pressure: Atmospheric surface pressure is 92 times greater than Earth\'s—equivalent to 900 meters underwater.'
      ]
    },
    {
      id: 'earth',
      name: 'Earth',
      symbol: '♁',
      tagline: 'Our Home Planet & Ocean World',
      type: 'Terrestrial (Rocky)',
      gradient: 'from-blue-600 via-cyan-500 to-emerald-600',
      textColor: 'text-cyan-300',
      badgeBg: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-200',
      order: '3rd planet from Sun',
      distanceAU: '1.00 AU',
      distanceKm: '149.6 million km',
      radius: '6,371 km',
      dayLength: '24 hours',
      yearLength: '365.25 Earth days',
      moons: '1 Moon (Luna)',
      atmosphere: '78% Nitrogen, 21% Oxygen, 1% Argon/CO₂',
      surfaceTemp: '-89°C to 58°C (Avg: 15°C)',
      summary: 'Earth is the only known planet in the universe to support life, featuring abundant liquid water oceans, a protective atmosphere, and a dynamic climate.',
      keyFacts: [
        'Goldilocks Zone: Positioned at just the right distance from the Sun where liquid water can remain stable on the surface.',
        'Magnetic Shield: Generated by molten iron in its outer core, protecting life from harmful solar and cosmic radiation.',
        '23.5° Axial Tilt: Causes the predictable cycle of Spring, Summer, Autumn, and Winter.'
      ]
    },
    {
      id: 'mars',
      name: 'Mars',
      symbol: '♂',
      tagline: 'The Red Planet & Future Frontier',
      type: 'Terrestrial (Rocky)',
      gradient: 'from-red-600 via-orange-600 to-amber-700',
      textColor: 'text-red-400',
      badgeBg: 'bg-red-500/20 border-red-500/30 text-red-300',
      order: '4th planet from Sun',
      distanceAU: '1.52 AU',
      distanceKm: '227.9 million km',
      radius: '3,390 km (0.53 Earths)',
      dayLength: '24 h 40 min (1 Sol)',
      yearLength: '687 Earth days',
      moons: '2 Moons (Phobos & Deimos)',
      atmosphere: 'Thin CO₂ atmosphere (95%)',
      surfaceTemp: '-125°C to 20°C (Avg: -62°C)',
      summary: 'Mars gets its distinct rusty reddish color from iron oxide minerals covering its desert surface. It has giant volcanoes, deep canyons, and polar ice caps.',
      keyFacts: [
        'Olympus Mons: Home to the largest volcano in the Solar System—3 times taller than Mount Everest!',
        'Valles Marineris: A canyon system 4,000 km long and up to 7 km deep, dwarfing Earth\'s Grand Canyon.',
        'Dust Storms: Can grow into global, planet-encircling clouds of dust that last for months.'
      ]
    },
    {
      id: 'jupiter',
      name: 'Jupiter',
      symbol: '♃',
      tagline: 'King of Planets & Cosmic Shield',
      type: 'Gas Giant',
      gradient: 'from-amber-700 via-orange-700 to-yellow-800',
      textColor: 'text-amber-300',
      badgeBg: 'bg-amber-600/20 border-amber-500/30 text-amber-200',
      order: '5th planet from Sun',
      distanceAU: '5.20 AU',
      distanceKm: '778.6 million km',
      radius: '69,911 km (11x Earths)',
      dayLength: '9 h 56 min (fastest spin)',
      yearLength: '11.86 Earth years',
      moons: '95+ Moons (Ganymede is largest)',
      atmosphere: '89% Hydrogen, 10% Helium',
      surfaceTemp: '-110°C (Cloud tops)',
      summary: 'Jupiter is the largest planet in our Solar System—more than twice as massive as all other planets combined! It is a gas giant made primarily of hydrogen and helium.',
      keyFacts: [
        'Great Red Spot: A colossal hurricane-like storm bigger than Earth that has been raging for at least 400 years.',
        'Fastest Spin: Rotates in under 10 hours, creating strong jet stream belts and flattening its equator slightly.',
        'Ganymede: Its largest moon is larger than the planet Mercury and possesses its own magnetic field!'
      ]
    },
    {
      id: 'saturn',
      name: 'Saturn',
      symbol: '♄',
      tagline: 'Jewel of the Solar System & Ringed Giant',
      type: 'Gas Giant',
      gradient: 'from-yellow-600 via-amber-600 to-amber-800',
      textColor: 'text-yellow-300',
      badgeBg: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-200',
      order: '6th planet from Sun',
      distanceAU: '9.58 AU',
      distanceKm: '1.43 billion km',
      radius: '58,232 km (9.4x Earths)',
      dayLength: '10 h 33 min',
      yearLength: '29.46 Earth years',
      moons: '140+ Moons (Titan is largest)',
      atmosphere: '96% Hydrogen, 3% Helium',
      surfaceTemp: '-140°C (Cloud tops)',
      summary: 'Saturn is world-famous for its magnificent system of shiny rings composed of trillions of icy chunks, dust, and rock particles ranging from microscopic dust to house-sized boulders.',
      keyFacts: [
        'Would Float in Water: Saturn has the lowest density of any planet; if you had a bathtub large enough, Saturn would float!',
        'Spectacular Ring System: Spans up to 282,000 km wide but is amazingly paper-thin (only ~10 meters thick in places).',
        'Titan Moon: The only moon in the Solar System with a thick atmosphere and liquid methane lakes on its surface.'
      ]
    },
    {
      id: 'uranus',
      name: 'Uranus',
      symbol: '♅',
      tagline: 'The Sideways Ice Giant',
      type: 'Ice Giant',
      gradient: 'from-cyan-500 via-teal-600 to-blue-800',
      textColor: 'text-cyan-300',
      badgeBg: 'bg-teal-500/20 border-teal-500/30 text-teal-200',
      order: '7th planet from Sun',
      distanceAU: '19.22 AU',
      distanceKm: '2.87 billion km',
      radius: '25,362 km (4x Earths)',
      dayLength: '17 h 14 min',
      yearLength: '84 Earth years',
      moons: '27 Moons (Titania, Oberon)',
      atmosphere: '83% Hydrogen, 15% Helium, 2% Methane',
      surfaceTemp: '-224°C (Coldest atmosphere!)',
      summary: 'Uranus is an ice giant filled with dense icy materials (water, ammonia, methane). Methane gas absorbs red light, giving Uranus its soft pale blue-green glow.',
      keyFacts: [
        'Tilted 98 Degrees: Rotates on its side like a rolling ball, likely due to a giant collision with an Earth-sized protoplanet billions of years ago.',
        'Coldest Planetary Atmosphere: Reaches icy record temperatures down to -224°C.',
        'Faint Ring System: Possesses 13 faint, dark planetary rings and 27 inner moons.'
      ]
    },
    {
      id: 'neptune',
      name: 'Neptune',
      symbol: '♆',
      tagline: 'Windy Deep-Blue Outer World',
      type: 'Ice Giant',
      gradient: 'from-blue-600 via-indigo-700 to-slate-900',
      textColor: 'text-blue-300',
      badgeBg: 'bg-blue-600/20 border-blue-500/30 text-blue-200',
      order: '8th planet from Sun',
      distanceAU: '30.05 AU',
      distanceKm: '4.50 billion km',
      radius: '24,622 km (3.9x Earths)',
      dayLength: '16 h 6 min',
      yearLength: '164.8 Earth years',
      moons: '14 Moons (Triton is largest)',
      atmosphere: '80% Hydrogen, 19% Helium, 1% Methane',
      surfaceTemp: '-218°C',
      summary: 'Neptune is the farthest official planet from the Sun. It is a dark, cold, ice giant whipped by supersonic winds faster than the speed of sound!',
      keyFacts: [
        'Supersonic Winds: Features the fastest recorded winds in the Solar System, reaching up to 2,100 km/h (1,300 mph).',
        'Triton\'s Cryovolcanoes: Its largest moon Triton orbits backwards (retrograde) and shoots icy geysers of liquid nitrogen into space.',
        'Sunlight Delay: Located so far out (30 AU) that sunlight takes over 4 hours and 10 minutes to reach Neptune, appearing 900 times dimmer!'
      ]
    }
  ];

  // 5 Officially Recognized Dwarf Planets Data
  const dwarfPlanetsData = [
    {
      name: 'Pluto 🪐',
      location: 'Kuiper Belt (Outer Solar System)',
      size: 'Radius: 1,188 km',
      moons: '5 Moons (Charon, Nix, Hydra, Kerberos, Styx)',
      desc: 'Famous icy world with a heart-shaped nitrogen glacier (Tombaugh Regio) and a thin atmosphere that expands when closer to the Sun.'
    },
    {
      name: 'Ceres ☄️',
      location: 'Asteroid Belt (between Mars & Jupiter)',
      size: 'Radius: 473 km',
      moons: '0 Moons',
      desc: 'The largest object in the Asteroid Belt and the only dwarf planet located in the inner Solar System. Contains bright salt-deposit spots and water ice.'
    },
    {
      name: 'Haumea 🏉',
      location: 'Kuiper Belt',
      size: 'Size: ~1,632 km x 996 km (Elongated)',
      moons: '2 Moons (Hiʻiaka & Namaka)',
      desc: 'Spins so rapidly (once every 3.9 hours) that centrifugal force has stretched it into the shape of a flattened football! Possesses faint rings.'
    },
    {
      name: 'Makemake ❄️',
      location: 'Kuiper Belt',
      size: 'Radius: ~715 km',
      moons: '1 Moon (MK2)',
      desc: 'An extremely cold world covered in frozen methane and ethane ice, discovered in 2005. It helped prompt the definition of dwarf planets.'
    },
    {
      name: 'Eris 🏔️',
      location: 'Scattered Disc (Beyond Kuiper Belt)',
      size: 'Radius: 1,163 km',
      moons: '1 Moon (Dysnomia)',
      desc: 'One of the most massive dwarf planets known. Located 68 AU from the Sun, taking 558 Earth years to complete a single orbit!'
    }
  ];

  // Layers of the Sun Data
  const sunLayersData = [
    {
      id: 'core',
      name: '1. The Core (Nuclear Engine)',
      temp: '~15,000,000 °C',
      type: 'Interior Layer',
      desc: 'The central power generator of the Sun. Immense gravitational pressure fuses Hydrogen atoms into Helium, releasing massive nuclear energy.'
    },
    {
      id: 'radiative',
      name: '2. Radiative Zone',
      temp: '~7,000,000 °C to 2,000,000 °C',
      type: 'Interior Layer',
      desc: 'Energy created in the core travels extremely slowly outward as high-energy light photons, taking up to 100,000 years to pass through this dense zone!'
    },
    {
      id: 'convective',
      name: '3. Convective Zone',
      temp: '~2,000,000 °C to 5,500 °C',
      type: 'Interior Layer',
      desc: 'Hot plasma gas bubbles rise toward the surface, cool down, and sink back toward the interior, creating huge circulating convection currents.'
    },
    {
      id: 'photosphere',
      name: '4. Photosphere (Visible Surface)',
      temp: '~5,500 °C',
      type: 'Atmospheric Layer',
      desc: 'The bright visible surface of the Sun that emits sunlight and heat toward Earth. Sunspots (cooler magnetic regions) appear on this layer.'
    },
    {
      id: 'chromosphere',
      name: '5. Chromosphere (Lower Atmosphere)',
      temp: '~6,000 °C to 20,000 °C',
      type: 'Atmospheric Layer',
      desc: 'A reddish glow layer above the photosphere. Features solar prominences—glowing loops of hot hydrogen gas extending into space.'
    },
    {
      id: 'corona',
      name: '6. Corona (Outer Atmosphere)',
      temp: '~1,000,000 °C to 3,000,000 °C',
      type: 'Atmospheric Layer',
      desc: 'The wispy, superheated outer halo extending millions of kilometers into space. Visible as a shining white crown during a Total Solar Eclipse.'
    }
  ];

  // 8 Moon Phases Data
  const moonPhases = [
    {
      id: 'new',
      num: '1',
      name: 'New Moon',
      icon: '🌑',
      appearance: 'Completely Dark / Invisible',
      lightSide: '0% visible from Earth',
      summary: 'The Moon is positioned directly between Earth and the Sun. The illuminated half faces away from Earth, making the Moon invisible.',
      detailedExplanation: [
        'Marks the official beginning of the 29.5-day synodic lunar cycle.',
        'Rises at sunrise and sets at sunset, tracking the Sun across the daytime sky.',
        'Solar Eclipses can ONLY occur during a New Moon phase when alignment is exact.'
      ]
    },
    {
      id: 'waxing_crescent',
      num: '2',
      name: 'Waxing Crescent',
      icon: '🌒',
      appearance: 'Thin sliver of light on the right',
      lightSide: '1% – 49% visible',
      summary: 'As the Moon orbits away from the Sun, a thin silver sliver of sunlight becomes visible on the right edge.',
      detailedExplanation: [
        '"Waxing" means growing larger in illumination day by day.',
        'Best viewed in the western sky right after sunset.',
        'Earthshine (sunlight reflected off Earth) dimly illuminates the dark portion.'
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
        'Traveled 1/4 of its total orbital cycle.',
        'Rises around noon and reaches its highest point in the sky at sunset.',
        'The boundary line separating light from shadow is called the "terminator".'
      ]
    },
    {
      id: 'waxing_gibbous',
      num: '4',
      name: 'Waxing Gibbous',
      icon: '🌔',
      appearance: 'More than half lit (Right side)',
      lightSide: '51% – 99% visible',
      summary: 'The illuminated portion grows larger than half, shaping like a swollen oval as it approaches a full moon.',
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
      summary: 'Earth is positioned between the Sun and Moon. The entire face of the Moon facing Earth is fully illuminated by sunlight.',
      detailedExplanation: [
        'Rises in the east as the Sun sets in the west, staying visible all night.',
        'Craters, maria (dark ancient lava plains), and bright rays are clearly visible.',
        'Lunar Eclipses can ONLY occur during a Full Moon when Earth casts its shadow.'
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
    { name: 'Southern Cross (Crux) ⚓', sky: 'Southern Hemisphere', desc: 'A famous 4-star cross constellation used for navigation and featured prominently on national flags.' },
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

  // Expanded Quiz Questions
  const quizQuestions = [
    {
      id: 1,
      q: 'Which planet is the largest in our Solar System and features the 400-year-old Great Red Spot storm?',
      options: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'],
      ans: 'Jupiter'
    },
    {
      id: 2,
      q: 'What unit of measurement represents the average distance from Earth to the Sun (~149.6 million km)?',
      options: ['Light Year (LY)', 'Astronomical Unit (AU)', 'Parsec (pc)', 'Kilometer (km)'],
      ans: 'Astronomical Unit (AU)'
    },
    {
      id: 3,
      q: 'How long does it take for Earth to complete one full rotation on its tilted axis?',
      options: ['365 days', '24 hours', '27 days', '12 hours'],
      ans: '24 hours'
    },
    {
      id: 4,
      q: 'What keeps the planets in stable orbits around the Sun without flying off into deep space?',
      options: [
        'The balance between the Sun\'s gravitational pull and the planet\'s forward motion (inertia)',
        'Solar wind pushing the planets from behind',
        'Magnetic ropes attached to the Sun',
        'Thick clouds of space dust blocking the planets'
      ],
      ans: 'The balance between the Sun\'s gravitational pull and the planet\'s forward motion (inertia)'
    },
    {
      id: 5,
      q: 'Which dwarf planet is located in the Asteroid Belt between Mars and Jupiter?',
      options: ['Pluto', 'Ceres', 'Eris', 'Haumea'],
      ans: 'Ceres'
    },
    {
      id: 6,
      q: 'Why is Venus the hottest planet in the Solar System (~465°C), even though Mercury is closer to the Sun?',
      options: [
        'Its dense carbon dioxide atmosphere causes an extreme runaway greenhouse effect',
        'It is covered in liquid lava oceans',
        'It has two suns orbiting around it',
        'It spins 100 times faster than Earth'
      ],
      ans: 'Its dense carbon dioxide atmosphere causes an extreme runaway greenhouse effect'
    },
    {
      id: 7,
      q: 'Which Moon phase occurs when the Moon is directly between Earth and the Sun, making it invisible?',
      options: ['Full Moon', 'New Moon', 'First Quarter', 'Waxing Gibbous'],
      ans: 'New Moon'
    },
    {
      id: 8,
      q: 'What percentage of the Solar System\'s total mass is contained inside the Sun?',
      options: ['50%', '75%', '90%', '99.86%'],
      ans: '99.86%'
    },
    {
      id: 9,
      q: 'Where do long-period comets originate from in the far outer boundaries of the Solar System?',
      options: ['The Oort Cloud', 'The Asteroid Belt', 'Earth\'s Atmosphere', 'The Sun\'s Corona'],
      ans: 'The Oort Cloud'
    },
    {
      id: 10,
      q: 'Which ice giant planet rotates on its side with a dramatic 98° axial tilt?',
      options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
      ans: 'Uranus'
    }
  ];

  const handleQuizSubmit = () => {
    let score = 0;
    quizQuestions.forEach(q => {
      if (quizAnswers[q.id] === q.ans) score++;
    });
    setQuizScore(score);
    if (score === quizQuestions.length) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
  };

  const currentPlanetData = planetsData.find(p => p.id === selectedPlanet) || planetsData[2];
  const currentSunLayer = sunLayersData.find(l => l.id === selectedSunLayer) || sunLayersData[0];
  const currentPhaseData = moonPhases.find(p => p.id === selectedPhase) || moonPhases[0];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 p-8 text-white shadow-2xl border border-indigo-800/50">
        {/* Background Decorative Grid/Stars */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-md text-xs font-bold tracking-wider uppercase text-blue-300">
            <Sparkles className="w-4 h-4 text-yellow-300" /> Science Academy • Grade 4 Space & Astronomy
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
            The Solar System & Astronomy 🪐🚀✨
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-3xl font-medium leading-relaxed">
            Explore our cosmic neighbourhood! Discover the Sun's nuclear engine, the 8 planets, dwarf planets, orbital gravity mechanics, moon phases, and distant star constellations.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={() => speakText("Welcome to Astronomy and Space Science! Learn about the Sun, eight planets from Mercury to Neptune, dwarf planets, orbital motion, and the eight phases of the Moon.")}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-extrabold text-xs flex items-center gap-2 hover:bg-blue-500 transition-all shadow-md cursor-pointer"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4 text-red-300" /> : <Volume2 className="w-4 h-4 text-white" />}
              {isPlayingAudio ? 'Stop Audio' : 'Listen to Overview'}
            </button>
            <button
              onClick={() => setModalImage('/solar_system_infographic.jpg')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              🖼️ Open Solar System Chart
            </button>
            <button
              onClick={() => setModalImage('/astronomy_infographic.jpg')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
            >
              🖼️ Open Astronomy Chart
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Infographic Charts & Overview', icon: '🖼️' },
          { id: 'planets', label: 'The 8 Planets', icon: '🪐' },
          { id: 'sun_dwarf', label: 'The Sun & Dwarf Planets', icon: '☀️' },
          { id: 'orbits_space', label: 'Orbital Motion & Deep Space', icon: '☄️' },
          { id: 'moon', label: '8 Phases of the Moon', icon: '🌕' },
          { id: 'stars_constellations', label: 'Star Colors & Constellations', icon: '✨' },
          { id: 'shadows', label: 'Day, Night & Shadows', icon: '🌅' },
          { id: 'quiz', label: 'Knowledge Check Quiz', icon: '🏆' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-102'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* ==================================== TAB 1: INFOGRAPHIC CHARTS & OVERVIEW ==================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Dual Infographic Selector */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-md">
                  Visual Learning Posters • Grade 4 Science
                </span>
                <h3 className="text-2xl font-black text-slate-800 mt-2 flex items-center gap-2">
                  <span>🖼️</span> Space & Astronomy Visual Reference Posters
                </h3>
                <p className="text-slate-500 text-xs mt-1">
                  Select a poster below to preview or click to open in full high-resolution zoom mode. Both official science charts are included!
                </p>
              </div>

              {/* Chart Switcher Buttons */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
                <button
                  onClick={() => setSelectedInfographic('solar_system')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    selectedInfographic === 'solar_system'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🪐 Solar System Chart
                </button>
                <button
                  onClick={() => setSelectedInfographic('astronomy')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    selectedInfographic === 'astronomy'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🌍 Astronomy & Stars Chart
                </button>
              </div>
            </div>

            {/* Selected Poster Display */}
            <div className="relative flex flex-col items-center bg-slate-950/5 p-4 rounded-2xl border border-slate-200 overflow-hidden">
              <div className="w-full flex justify-between items-center mb-3 px-2">
                <span className="font-extrabold text-slate-700 text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  {selectedInfographic === 'solar_system'
                    ? 'The Solar System - Our Cosmic Neighbourhood Infographic'
                    : 'Astronomy: Earth, Moon, Sun & Stars Infographic'}
                </span>
                <button
                  onClick={() => setModalImage(selectedInfographic === 'solar_system' ? '/solar_system_infographic.jpg' : '/astronomy_infographic.jpg')}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-md hover:bg-blue-700 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ZoomIn className="w-4 h-4" /> Expand Fullscreen
                </button>
              </div>

              <div 
                onClick={() => setModalImage(selectedInfographic === 'solar_system' ? '/solar_system_infographic.jpg' : '/astronomy_infographic.jpg')}
                className="relative cursor-pointer group rounded-xl overflow-hidden shadow-lg border border-slate-300"
              >
                <img 
                  src={selectedInfographic === 'solar_system' ? '/solar_system_infographic.jpg' : '/astronomy_infographic.jpg'} 
                  alt="Space Infographic Poster" 
                  className="max-w-full h-auto max-h-[650px] object-contain group-hover:scale-101 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <span className="px-6 py-3 bg-white text-slate-950 font-black text-xs rounded-2xl shadow-xl flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-blue-600" /> Click to Expand & Zoom High-Res Image
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Summary Cards Grid */}
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
                Earth spins continuously around its imaginary tilted axis (23.5°) once every <strong>24 hours</strong>, rotating from West to East.
              </p>
              <div className="space-y-2 text-xs font-semibold text-slate-700">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                  <span><strong>Daytime: </strong>The side facing TOWARDS the Sun receives direct sunlight.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 flex items-center gap-2">
                  <Moon className="w-4 h-4 text-slate-300 shrink-0" />
                  <span><strong>Nighttime: </strong>The side facing AWAY from the Sun is in shadow.</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                <Sun className="w-7 h-7 text-amber-500 shrink-0" />
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded">365.25 Days / 1 Year</span>
                  <h3 className="font-black text-xl text-slate-800">Earth's Orbit & Seasons</h3>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Earth travels along an elliptical path around the Sun once every <strong>365.25 days</strong> (1 solar year).
              </p>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-2 text-xs font-medium text-indigo-950">
                <div className="font-bold text-sm text-indigo-900">Why do we have Seasons?</div>
                <p className="leading-relaxed">
                  Seasons are caused by Earth's <strong>23.5° axial tilt</strong> as it revolves around the Sun. When a hemisphere tilts towards the Sun, it experiences Summer. When it tilts away, it experiences Winter.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ==================================== TAB 2: THE 8 PLANETS ==================================== */}
      {activeTab === 'planets' && (
        <div className="space-y-6">
          
          {/* Planet Navigation Bar */}
          <div className="bg-slate-950 p-4 rounded-3xl border border-slate-800 shadow-xl space-y-3">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
              Select a planet to explore stats, atmosphere, and distance:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {planetsData.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlanet(p.id)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between ${
                    selectedPlanet === p.id 
                      ? 'bg-blue-600 border-blue-400 text-white shadow-lg scale-102' 
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-2xl">{p.symbol}</span>
                  <span className="font-black text-xs mt-1">{p.name}</span>
                  <span className="text-[9px] opacity-75 font-medium">{p.distanceAU}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Selected Planet Card */}
          <div className={`rounded-3xl p-6 md:p-8 text-white shadow-2xl border border-slate-700/50 bg-gradient-to-br ${currentPlanetData.gradient} space-y-6`}>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/20">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-black/30 backdrop-blur-md border border-white/20">
                  {currentPlanetData.order} • {currentPlanetData.type}
                </div>
                <h2 className="text-3xl md:text-4xl font-black flex items-center gap-3">
                  <span>{currentPlanetData.symbol}</span> {currentPlanetData.name}
                </h2>
                <p className="text-xs md:text-sm font-semibold opacity-90">{currentPlanetData.tagline}</p>
              </div>

              <button
                onClick={() => speakText(`${currentPlanetData.name}. ${currentPlanetData.tagline}. Distance from Sun: ${currentPlanetData.distanceAU} or ${currentPlanetData.distanceKm}. ${currentPlanetData.summary}`)}
                className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-extrabold text-xs flex items-center gap-2 border border-white/30 transition-all cursor-pointer shrink-0"
              >
                <Volume2 className="w-4 h-4" /> Listen to Planet Facts
              </button>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 space-y-1">
                <div className="text-[10px] uppercase font-bold text-white/70">Distance from Sun</div>
                <div className="font-black text-sm">{currentPlanetData.distanceAU}</div>
                <div className="text-[10px] text-white/80 font-medium">{currentPlanetData.distanceKm}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 space-y-1">
                <div className="text-[10px] uppercase font-bold text-white/70">Radius & Size</div>
                <div className="font-black text-sm">{currentPlanetData.radius}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 space-y-1">
                <div className="text-[10px] uppercase font-bold text-white/70">Day / Rotation</div>
                <div className="font-black text-sm">{currentPlanetData.dayLength}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 space-y-1">
                <div className="text-[10px] uppercase font-bold text-white/70">Year / Orbit</div>
                <div className="font-black text-sm">{currentPlanetData.yearLength}</div>
              </div>
            </div>

            {/* Summary & Atmosphere */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 space-y-2">
                <div className="text-xs font-black uppercase tracking-wider text-white/80">Planet Overview</div>
                <p className="text-xs leading-relaxed font-medium">{currentPlanetData.summary}</p>
              </div>
              <div className="p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 space-y-2">
                <div className="text-xs font-black uppercase tracking-wider text-white/80">Atmosphere & Moons</div>
                <div className="text-xs font-bold">Atmosphere: <span className="font-normal opacity-90">{currentPlanetData.atmosphere}</span></div>
                <div className="text-xs font-bold">Moons Count: <span className="font-normal opacity-90">{currentPlanetData.moons}</span></div>
                <div className="text-xs font-bold">Surface Temp: <span className="font-normal opacity-90">{currentPlanetData.surfaceTemp}</span></div>
              </div>
            </div>

            {/* Key Facts List */}
            <div className="space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-white/80">Special Scientific Features</div>
              <div className="space-y-2">
                {currentPlanetData.keyFacts.map((fact, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 text-xs font-medium leading-relaxed">
                    <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                    <span>{fact}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Planetary Distance Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
              📊 Solar System Distance Comparison Table (AU vs Kilometers)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-extrabold">
                    <th className="p-3">Planet</th>
                    <th className="p-3">Average Distance (AU)</th>
                    <th className="p-3">Distance in Kilometers</th>
                    <th className="p-3">Orbital Period (Year)</th>
                    <th className="p-3">Moons</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {planetsData.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3 font-black text-slate-900 flex items-center gap-2">
                        <span>{p.symbol}</span> {p.name}
                      </td>
                      <td className="p-3 font-extrabold text-blue-700">{p.distanceAU}</td>
                      <td className="p-3">{p.distanceKm}</td>
                      <td className="p-3">{p.yearLength}</td>
                      <td className="p-3">{p.moons}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ==================================== TAB 3: THE SUN & DWARF PLANETS ==================================== */}
      {activeTab === 'sun_dwarf' && (
        <div className="space-y-8">
          
          {/* Section A: The Sun & Nuclear Fusion */}
          <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 rounded-3xl p-6 md:p-8 text-white border border-amber-800/40 shadow-xl space-y-6">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-amber-800/40">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-950/80 px-3 py-1 rounded-md border border-amber-700/50">
                  The Powerhouse • 99.86% of Solar System Mass
                </span>
                <h2 className="text-3xl font-black text-white mt-2 flex items-center gap-2">
                  <Sun className="w-8 h-8 text-amber-400 animate-pulse" /> The Sun (Sol) & Its 6 Layers
                </h2>
                <p className="text-amber-200/80 text-xs mt-1 max-w-2xl">
                  Type: G2V Yellow Dwarf Star • Diameter: 1.39 million km (109 times Earth) • Surface Temp: ~5,500 °C • Core Temp: ~15,000,000 °C
                </p>
              </div>

              <div className="px-4 py-3 rounded-2xl bg-amber-900/40 border border-amber-700/50 text-xs font-bold text-amber-200">
                ⚡ Energy: Nuclear fusion of Hydrogen into Helium
              </div>
            </div>

            {/* Sun Layers Selector */}
            <div className="space-y-3">
              <div className="text-xs font-black uppercase tracking-wider text-amber-300">Click a layer to inspect its temperature and physics:</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {sunLayersData.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => setSelectedSunLayer(layer.id)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedSunLayer === layer.id
                        ? 'bg-amber-500 text-slate-950 border-amber-300 font-black shadow-lg scale-102'
                        : 'bg-slate-900 border-slate-800 text-amber-200 hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-xs font-extrabold">{layer.name.split(' ')[1]}</div>
                    <div className="text-[10px] opacity-80 mt-1 font-semibold">{layer.temp}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Sun Layer Detail Card */}
            <div className="p-6 rounded-2xl bg-amber-950/40 border border-amber-700/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-950 px-2.5 py-1 rounded border border-amber-800">
                  {currentSunLayer.type} • Temperature: {currentSunLayer.temp}
                </span>
                <button
                  onClick={() => speakText(`${currentSunLayer.name}. Temperature: ${currentSunLayer.temp}. ${currentSunLayer.desc}`)}
                  className="p-2 rounded-xl bg-amber-900/50 text-amber-200 hover:bg-amber-800 transition-all cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-xl font-black text-amber-200">{currentSunLayer.name}</h3>
              <p className="text-xs leading-relaxed text-amber-100 font-medium">{currentSunLayer.desc}</p>
            </div>

          </div>

          {/* Section B: The 5 Dwarf Planets */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-3 py-1 rounded-md">
                Outer Realm Objects
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-2">The 5 Officially Recognized Dwarf Planets</h2>
              <p className="text-slate-500 text-xs mt-1">
                Dwarf planets are celestial bodies that orbit the Sun and have enough gravity to be round, but have not cleared their orbital neighborhood of other debris.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {dwarfPlanetsData.map((dp, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <h3 className="font-black text-lg text-slate-900">{dp.name}</h3>
                    <div className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {dp.location}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{dp.desc}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200 text-[11px] font-bold text-slate-700 space-y-0.5">
                    <div>{dp.size}</div>
                    <div className="text-blue-700">{dp.moons}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ==================================== TAB 4: ORBITAL MOTION & DEEP SPACE ==================================== */}
      {activeTab === 'orbits_space' && (
        <div className="space-y-8">
          
          {/* How Does It All Stay Together? */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <Compass className="w-8 h-8 text-blue-600 shrink-0" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-md">
                  Celestial Mechanics
                </span>
                <h2 className="text-2xl font-black text-slate-800 mt-1">How Does It All Stay Together? (Gravity & Inertia)</h2>
              </div>
            </div>

            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium">
              The Sun's immense mass contains <strong>99.86%</strong> of all matter in the Solar System. Its massive gravitational force pulls all planets inward towards the center. At the same time, planets possess sideways forward motion (<strong>inertia</strong>).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="font-black text-amber-900 text-sm flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-600" /> Gravity Pulls Inward
                </div>
                <p className="text-xs text-amber-950 leading-relaxed font-medium">
                  The Sun's strong gravitational pull constantly pulls planets toward the center of the Solar System.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                <div className="font-black text-blue-900 text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" /> Forward Motion (Inertia)
                </div>
                <p className="text-xs text-blue-950 leading-relaxed font-medium">
                  Planets are traveling forward through space at high speeds (Earth travels at ~107,000 km/h).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="font-black text-emerald-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" /> Orbital Balance = Orbit
                </div>
                <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                  The perfect balance between inward gravity and forward inertia locks planets into smooth elliptical paths (orbits)!
                </p>
              </div>
            </div>
          </div>

          {/* Deep Space Objects: Asteroids, Comets, Kuiper Belt, Oort Cloud */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="font-black text-lg text-slate-800 flex items-center gap-2">
                ☄️ Comets & Asteroids
              </div>
              <div className="space-y-3 text-xs text-slate-600 font-medium">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-extrabold text-slate-900 text-sm">Asteroids (Rocky Objects)</div>
                  <p>Lumpy rocky objects mostly located in the Asteroid Belt between Mars and Jupiter. Remnants from the early Solar System 4.6 billion years ago.</p>
                </div>
                <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-100 space-y-1">
                  <div className="font-extrabold text-cyan-900 text-sm">Comets (Icy Dust Balls)</div>
                  <p>Dirty snowballs of ice, frozen gases, and dust from outer space. When near the Sun, solar heat vaporizes ice, forming a glowing tail of gas pointing away from the Sun (e.g. Halley's Comet every ~76 years).</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="font-black text-lg text-slate-800 flex items-center gap-2">
                🌌 Beyond Our Solar System
              </div>
              <div className="space-y-3 text-xs text-slate-600 font-medium">
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-1">
                  <div className="font-extrabold text-indigo-900 text-sm">The Kuiper Belt (30 AU – 50 AU)</div>
                  <p>A giant donut-shaped ring beyond Neptune filled with hundreds of thousands of icy bodies and dwarf planets like Pluto, Eris, Haumea, and Makemake.</p>
                </div>
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 space-y-1">
                  <div className="font-extrabold text-purple-900 text-sm">The Oort Cloud (2,000 AU – 100,000 AU)</div>
                  <p>A colossal spherical shell of icy objects surrounding the outer edges of our Solar System, believed to be the home of long-period comets.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ==================================== TAB 5: 8 PHASES OF THE MOON ==================================== */}
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

      {/* ==================================== TAB 6: STAR COLORS & CONSTELLATIONS ==================================== */}
      {activeTab === 'stars_constellations' && (
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                Stellar Physics
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">Star Brightness & Color Temperatures</h2>
              <p className="text-slate-500 text-xs mt-1">The Sun is a medium-sized yellow star located ~150 million km from Earth. Other stars appear as tiny twinkling dots because they are trillions of km away!</p>
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

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-900 flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0" />
              <span><strong>SAFETY WARNING: </strong>Never look directly at the Sun with the naked eye, binoculars, or telescopes! Doing so can cause permanent blindness. Always use pinhole projection boxes or ISO-certified solar viewing glasses.</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                Deep Space Patterns
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1">Famous Constellations & Night Sky</h2>
              <p className="text-slate-500 text-xs mt-1">As Earth orbits the Sun, our night side points towards different parts of space, revealing different constellations each season.</p>
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

        </div>
      )}

      {/* ==================================== TAB 7: DAY, NIGHT & SHADOWS ==================================== */}
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

      {/* ==================================== TAB 8: KNOWLEDGE CHECK QUIZ ==================================== */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-800">Solar System & Astronomy Knowledge Check</h2>
              <p className="text-slate-500 text-xs mt-1">Test your understanding of planets, AU distances, dwarf planets, gravity, moon phases, and the Sun.</p>
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
      {modalImage && (
        <div 
          onClick={() => setModalImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col animate-fade-in select-none p-4 md:p-6"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-slate-900/90 border border-slate-800 rounded-2xl px-6 py-3.5 flex items-center justify-between gap-4 shrink-0 mb-4 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400 font-bold text-xs">
                🖼️ High-Res Chart View
              </span>
              <div>
                <h3 className="font-extrabold text-white text-sm">
                  {modalImage.includes('solar_system') 
                    ? 'The Solar System - Our Cosmic Neighbourhood Infographic' 
                    : 'Astronomy: Earth, Moon, Sun & Stars Infographic'}
                </h3>
                <p className="text-slate-400 text-[11px]">Official Science Reference Guide</p>
              </div>
            </div>

            {/* Toggle chart inside modal */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setModalImage(modalImage.includes('solar_system') ? '/astronomy_infographic.jpg' : '/solar_system_infographic.jpg')}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs border border-slate-700 transition-all cursor-pointer"
              >
                Switch to {modalImage.includes('solar_system') ? 'Astronomy Chart' : 'Solar System Chart'}
              </button>
              <button 
                onClick={() => setModalImage(null)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition-all shadow-lg shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer"
              >
                <X className="w-4 h-4" /> Close
              </button>
            </div>
          </div>

          <div 
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center overflow-auto"
          >
            <img 
              src={modalImage} 
              alt="Space Infographic" 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2 border-slate-700/50 object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
