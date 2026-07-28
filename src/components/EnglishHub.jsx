import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  RotateCcw, 
  Award, 
  PenTool, 
  Layers, 
  Zap, 
  HelpCircle,
  Brain,
  MessageSquare,
  Bookmark,
  ChevronRight,
  RefreshCw,
  Search,
  Star,
  ZoomIn,
  Maximize2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function EnglishHub({ topicName }) {
  const [activeTab, setActiveTab] = useState(
    topicName ? getTabFromTopic(topicName) : 'grammar'
  );
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Interactive tool states
  const [selectedPartOfSpeech, setSelectedPartOfSpeech] = useState('nouns');
  const [vocabSearch, setVocabSearch] = useState('');
  const [selectedPassage, setSelectedPassage] = useState(1);
  const [writingPromptIndex, setWritingPromptIndex] = useState(0);
  
  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);

  function getTabFromTopic(topic) {
    if (topic?.includes('Grammar') || topic?.includes('Guide')) return 'grammar';
    if (topic?.includes('Vocabulary') || topic?.includes('Spelling')) return 'vocab';
    if (topic?.includes('Reading') || topic?.includes('Comprehension')) return 'reading';
    if (topic?.includes('Sentence') || topic?.includes('Punctuation')) return 'punctuation';
    if (topic?.includes('Writing') || topic?.includes('Creative')) return 'writing';
    return 'grammar';
  }

  const openImageModal = () => setIsModalOpen(true);

  // Speech Handler
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

  // Parts of Speech Data
  const partsOfSpeech = {
    nouns: {
      title: 'Nouns (Naming Words)',
      icon: '🏛️',
      definition: 'A noun names a person, place, thing, or idea.',
      types: [
        { name: 'Proper Noun', desc: 'Specific names (always capitalized)', eg: 'London, Emma, Jupiter, Tuesday' },
        { name: 'Common Noun', desc: 'General names for people, places, or things', eg: 'city, girl, planet, day' },
        { name: 'Abstract Noun', desc: 'Ideas, emotions, or qualities', eg: 'courage, happiness, freedom, wisdom' },
        { name: 'Collective Noun', desc: 'Names for groups of people or items', eg: 'flock of birds, team of players, herd of cattle' }
      ],
      examples: ['The **dragon** soared high above the **mountains**.', '**Sophia** felt immense **joy** after winning the **trophy**.']
    },
    verbs: {
      title: 'Verbs (Action & State Words)',
      icon: '🏃',
      definition: 'A verb describes an action, state of being, or occurrence.',
      types: [
        { name: 'Action Verbs', desc: 'Physical or mental actions', eg: 'run, jump, think, create' },
        { name: 'Linking Verbs', desc: 'Connect subject to a description', eg: 'is, am, are, was, seem' },
        { name: 'Helping Verbs', desc: 'Assist the main verb with tense', eg: 'will, have, should, can' }
      ],
      examples: ['The lightning **flashed** across the midnight sky.', 'They **will explore** the ancient cavern tomorrow.']
    },
    adjectives: {
      title: 'Adjectives (Describing Words)',
      icon: '🎨',
      definition: 'An adjective modifies or describes a noun or pronoun.',
      types: [
        { name: 'Descriptive', desc: 'tells quality or state', eg: 'sparkling, gigantic, mysterious' },
        { name: 'Quantitative', desc: 'tells quantity or number', eg: 'many, several, three, double' },
        { name: 'Demonstrative', desc: 'points out specific items', eg: 'this, that, these, those' }
      ],
      examples: ['The **courageous** knight held a **glowing** shield.', 'She found **three** **rare** gemstones in the stream.']
    },
    adverbs: {
      title: 'Adverbs (Modifying Words)',
      icon: '⚡',
      definition: 'An adverb modifies a verb, adjective, or another adverb (answers how, when, where, why).',
      types: [
        { name: 'Adverb of Manner', desc: 'How something is done', eg: 'swiftly, gracefully, quietly' },
        { name: 'Adverb of Time', desc: 'When something happens', eg: 'yesterday, soon, now, later' },
        { name: 'Adverb of Place', desc: 'Where something happens', eg: 'everywhere, nearby, outside' }
      ],
      examples: ['The cheetah sprinted **swiftly** through the grass.', 'The wizard will arrive **soon**.']
    },
    prepositions: {
      title: 'Prepositions (Position & Relationship Words)',
      icon: '🗺️',
      definition: 'A preposition shows the relationship between a noun and other words in a sentence.',
      types: [
        { name: 'Place/Location', desc: 'Indicates position', eg: 'under, above, inside, between' },
        { name: 'Time', desc: 'Indicates timing', eg: 'before, after, during, until' },
        { name: 'Direction', desc: 'Indicates movement', eg: 'towards, into, across, through' }
      ],
      examples: ['The secret key was hidden **under** the marble statue.', 'We walked **through** the enchanting forest.']
    }
  };

  // Vocabulary Data
  const vocabCards = [
    { word: 'Benevolent', type: 'Adjective', meaning: 'Kind, generous, and caring about others.', synonym: 'Kindhearted, Charitable', antonym: 'Cruel, Malevolent', eg: 'The benevolent queen opened her gardens to everyone in the village.' },
    { word: 'Elated', type: 'Adjective', meaning: 'Extremely happy and excited.', synonym: 'Overjoyed, Thrilled', antonym: 'Despondent, Sad', eg: 'The team was elated when they scored the winning goal.' },
    { word: 'Meticulous', type: 'Adjective', meaning: 'Showing great attention to detail; very careful.', synonym: 'Thorough, Precise', antonym: 'Careless, Sloppy', eg: 'The artist spent months making meticulous brushstrokes on the canvas.' },
    { word: 'Resilient', type: 'Adjective', meaning: 'Able to withstand or recover quickly from difficult conditions.', synonym: 'Strong, Adaptable', antonym: 'Fragile, Weak', eg: 'The resilient oak tree stood firm despite the strong storm.' },
    { word: 'Formidable', type: 'Adjective', meaning: 'Inspiring respect or fear through being impressively large or powerful.', synonym: 'Imposing, Mighty', antonym: 'Weak, Feeble', eg: 'The mountain climbers faced a formidable blizzard near the peak.' },
    { word: 'Luminous', type: 'Adjective', meaning: 'Emitting or reflecting light; glowing softly.', synonym: 'Radiant, Shimmering', antonym: 'Dim, Dark', eg: 'The fireflies created a luminous pathway through the night woods.' }
  ];

  // Reading Passages
  const readingPassages = [
    {
      id: 1,
      title: 'The Mystery of the Whispering Lighthouse',
      level: 'Intermediate (Grade 4-6)',
      genre: 'Adventure & Mystery',
      content: `For over fifty years, the Beacon Rock Lighthouse stood silently guarding the rocky shores of Mist River Bay. Mariners spoke of a subtle, melodic humming sound that echoed from its glass lantern room whenever storm clouds rolled in. Twelve-year-old Leo and his sister Maya set out to uncover the truth. Guided by an old brass compass and a pocket notebook, they climbed the 120 spiral stairs. Near the top, they discovered that the sound wasn't magic—it was wind passing through ancient bronze acoustic pipes designed by the original architect to signal sailors in dense fog!`,
      questions: [
        { q: 'What is the main idea of the story?', options: ['Leo and Maya get lost at sea', 'Children discover how an old lighthouse creates its mystery sound', 'A lighthouse gets destroyed in a storm', 'How sailors build brass compasses'], ans: 'Children discover how an old lighthouse creates its mystery sound' },
        { q: 'What caused the melodic humming sound?', options: ['A ghost inside the lantern room', 'Wind passing through ancient bronze acoustic pipes', 'Radio signals from ships', 'Waves crashing against rocks'], ans: 'Wind passing through ancient bronze acoustic pipes' }
      ]
    },
    {
      id: 2,
      title: 'The Monarch Butterfly Journey',
      level: 'Informational (Science & Nature)',
      genre: 'Non-Fiction',
      content: `Every autumn, millions of North American Monarch butterflies undertake an astounding 3,000-mile migration southward to the oyamel fir forests of central Mexico. Despite their fragile wings, which weigh less than a single paperclip, these remarkable insects navigate across mountains, rivers, and cities using a combination of the sun\'s position and internal magnetic receptors. Monarch caterpillars feed exclusively on milkweed plants, which contain natural compounds that make the mature butterflies unpalatable to predators like birds.`,
      questions: [
        { q: 'Why are milkweed plants important to Monarch caterpillars?', options: ['They help butterflies sleep', 'They feed caterpillars and make butterflies unpalatable to predators', 'They protect butterflies from winter snow', 'They provide water during flight'], ans: 'They feed caterpillars and make butterflies unpalatable to predators' },
        { q: 'How far do Monarch butterflies migrate each autumn?', options: ['10 miles', '300 miles', '3,000 miles', '30,000 miles'], ans: '3,000 miles' }
      ]
    }
  ];

  // Writing Prompts
  const writingPrompts = [
    "Imagine you discover a secret door in your school library that leads to a world made entirely of books and floating islands.",
    "Write a persuasive letter to your principal proposing a weekly outdoor science and exploration day.",
    "Describe a day in the life of an astronaut who discovers a friendly alien pet on Mars.",
    "Write a narrative poem about a thunderstorm rolling over a peaceful village at dusk."
  ];

  // Quiz Questions
  const quizQuestions = [
    {
      id: 1,
      q: 'Which word is a Proper Noun in the sentence: "Lucas visited Paris last summer"?',
      options: ['visited', 'summer', 'Paris', 'last'],
      ans: 'Paris'
    },
    {
      id: 2,
      q: 'Which of the following is a synonym for the word "Benevolent"?',
      options: ['Greedy', 'Kindhearted', 'Aggressive', 'Lazy'],
      ans: 'Kindhearted'
    },
    {
      id: 3,
      q: 'Identify the adverb in the sentence: "The horse ran swiftly across the meadow."',
      options: ['horse', 'ran', 'swiftly', 'meadow'],
      ans: 'swiftly'
    },
    {
      id: 4,
      q: 'Which sentence uses correct punctuation?',
      options: [
        'Where are you going asked Sarah?',
        '"Where are you going?" asked Sarah.',
        'where are you going, asked Sarah.',
        '"Where are you going asked Sarah"'
      ],
      ans: '"Where are you going?" asked Sarah.'
    },
    {
      id: 5,
      q: 'What type of word is "under" in: "The puppy slept under the cozy blanket"?',
      options: ['Verb', 'Adjective', 'Preposition', 'Conjunction'],
      ans: 'Preposition'
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

  const filteredVocab = vocabCards.filter(item => 
    item.word.toLowerCase().includes(vocabSearch.toLowerCase()) ||
    item.meaning.toLowerCase().includes(vocabSearch.toLowerCase()) ||
    item.synonym.toLowerCase().includes(vocabSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans">
      
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-800 p-8 text-white shadow-xl shadow-indigo-500/10">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-yellow-300" /> English & Language Arts Academy
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            English Grammar & Literature Hub
          </h1>
          <p className="text-purple-100 text-sm md:text-base max-w-2xl font-medium">
            Explore the complete Grammar Guide chart, Parts of Speech, Tenses, Vocabulary, Punctuation rules, and Creative Writing!
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button 
              onClick={() => speakText("Welcome to the English Academy Grammar Guide! Explore Parts of Speech, Sentence Types, Tenses, Punctuation, and Vocabulary.")}
              className="px-4 py-2 rounded-xl bg-white text-indigo-900 font-extrabold text-xs flex items-center gap-2 hover:bg-purple-50 transition-all shadow-md cursor-pointer"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-indigo-600" />}
              {isPlayingAudio ? 'Stop Audio' : 'Listen to Introduction'}
            </button>
            <span className="text-xs font-bold bg-indigo-900/50 px-3 py-1.5 rounded-lg border border-purple-400/20">
              Grammar Poster • Parts of Speech • Tenses • Vocabulary
            </span>
          </div>
        </div>
        <div className="absolute right-[-30px] bottom-[-30px] opacity-10 pointer-events-none">
          <BookOpen className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'grammar', label: 'Grammar Guide & Poster', icon: '📜' },
          { id: 'parts', label: 'Parts of Speech & Tenses', icon: '📝' },
          { id: 'vocab', label: 'Vocabulary & Word Power', icon: '🔤' },
          { id: 'reading', label: 'Reading Comprehension', icon: '📖' },
          { id: 'punctuation', label: 'Sentence Types & Punctuation', icon: '✍️' },
          { id: 'writing', label: 'Creative Writing Studio', icon: '🎨' },
          { id: 'quiz', label: 'English Master Quiz', icon: '🏆' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 scale-102'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* ==================================== TAB 1: GRAMMAR GUIDE POSTER (FIRST PAGE OF TOPIC) ==================================== */}
      {activeTab === 'grammar' && (
        <div className="space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-3 py-1 rounded-md">
                  Official Visual Learning Reference
                </span>
                <h3 className="text-2xl font-black text-slate-800 mt-2 flex items-center gap-2">
                  <span>📜</span> Grammar Guide - The Rules Behind Great Writing
                </h3>
                <p className="text-slate-500 text-xs mt-1">
                  Click the poster below to expand into interactive high-resolution zoom view with parts of speech, tenses, sentence structure, and punctuation rules.
                </p>
              </div>
              <button 
                onClick={openImageModal}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <ZoomIn className="w-4 h-4" /> Expand Poster
              </button>
            </div>

            {/* Poster Image Container */}
            <div 
              onClick={openImageModal}
              className="relative flex justify-center bg-slate-900/5 p-4 rounded-2xl border border-slate-200 overflow-hidden cursor-pointer group hover:bg-slate-900/10 transition-all"
              title="Click to Open & Zoom"
            >
              <img 
                src="/english_grammar_guide_infographic.jpg" 
                alt="Grammar Guide - The rules behind great writing Infographic Poster" 
                className="max-w-full h-auto rounded-xl shadow-md border border-white max-h-[650px] object-contain group-hover:scale-101 transition-transform"
              />
              <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl backdrop-blur-[2px]">
                <span className="px-6 py-3 bg-white text-slate-900 font-black text-xs rounded-2xl shadow-xl flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-indigo-600" /> Click to Expand & Zoom Poster
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 space-y-2">
              <span className="text-2xl">✨</span>
              <h4 className="font-black text-indigo-950 text-sm">Clear Ideas</h4>
              <p className="text-slate-600 text-xs leading-relaxed">Good grammar helps you share your thoughts clearly so others understand your message instantly.</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 space-y-2">
              <span className="text-2xl">🗣️</span>
              <h4 className="font-black text-purple-950 text-sm">Sound Confident</h4>
              <p className="text-slate-600 text-xs leading-relaxed">Mastering proper sentence structures and word choices builds confidence in speaking and writing.</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 space-y-2">
              <span className="text-2xl">📚</span>
              <h4 className="font-black text-blue-950 text-sm">Better Stories & Essays</h4>
              <p className="text-slate-600 text-xs leading-relaxed">Apply punctuation, tenses, and strong vocabulary to craft captivating stories and top-grade essays.</p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB 2: PARTS OF SPEECH & TENSES ==================================== */}
      {activeTab === 'parts' && (
        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 flex items-start gap-4">
            <div className="p-3 bg-indigo-600 text-white rounded-xl font-bold">📝</div>
            <div>
              <h3 className="font-extrabold text-indigo-950 text-lg">Parts of Speech Masterclass</h3>
              <p className="text-slate-600 text-xs mt-1">Select a category below to explore definitions, types, and real sentence examples.</p>
            </div>
          </div>

          {/* Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {Object.keys(partsOfSpeech).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedPartOfSpeech(key)}
                className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 cursor-pointer transition-all ${
                  selectedPartOfSpeech === key
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{partsOfSpeech[key].icon}</span> {partsOfSpeech[key].title}
              </button>
            ))}
          </div>

          {/* Active Card Content */}
          {partsOfSpeech[selectedPartOfSpeech] && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md space-y-6 animate-fade-in">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{partsOfSpeech[selectedPartOfSpeech].icon}</span>
                <div>
                  <h3 className="text-2xl font-black text-slate-800">{partsOfSpeech[selectedPartOfSpeech].title}</h3>
                  <p className="text-indigo-600 font-bold text-sm mt-0.5">{partsOfSpeech[selectedPartOfSpeech].definition}</p>
                </div>
              </div>

              {/* Types Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {partsOfSpeech[selectedPartOfSpeech].types.map((t, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                    <div className="font-black text-indigo-900 text-sm flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">{idx+1}</span>
                      {t.name}
                    </div>
                    <p className="text-slate-600 text-xs">{t.desc}</p>
                    <div className="text-xs font-semibold text-indigo-700 bg-white px-3 py-1.5 rounded-lg border border-indigo-100 inline-block">
                      <strong>Examples:</strong> {t.eg}
                    </div>
                  </div>
                ))}
              </div>

              {/* Example Sentences */}
              <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl space-y-2">
                <div className="text-xs font-black uppercase text-indigo-400 tracking-wider">Example Sentences in Action:</div>
                {partsOfSpeech[selectedPartOfSpeech].examples.map((ex, i) => (
                  <div key={i} className="text-sm font-medium flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-indigo-400" />
                    <span dangerouslySetInnerHTML={{ __html: ex.replace(/\*\*(.*?)\*\*/g, '<strong className="text-yellow-300 font-bold">$1</strong>') }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================== TAB 3: VOCABULARY & WORD POWER ==================================== */}
      {activeTab === 'vocab' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <span>🔤</span> Vocabulary & Word Power Cards
              </h3>
              <p className="text-slate-500 text-xs mt-1">Expand your word power with meanings, synonyms, antonyms, and usage.</p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search word or meaning..."
                value={vocabSearch}
                onChange={(e) => setVocabSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVocab.map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4 relative group">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-2xl font-black text-indigo-950">{item.word}</h4>
                    <span className="text-[10px] font-extrabold uppercase bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full mt-1 inline-block">
                      {item.type}
                    </span>
                  </div>
                  <button 
                    onClick={() => speakText(`${item.word}: ${item.meaning}`)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-100 text-indigo-600 transition-colors cursor-pointer"
                    title="Pronounce Word"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-slate-600 text-xs font-medium leading-relaxed">{item.meaning}</p>

                <div className="space-y-1.5 text-xs">
                  <div className="bg-emerald-50 text-emerald-900 p-2 rounded-xl border border-emerald-100">
                    <strong>Synonyms:</strong> {item.synonym}
                  </div>
                  <div className="bg-rose-50 text-rose-900 p-2 rounded-xl border border-rose-100">
                    <strong>Antonyms:</strong> {item.antonym}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-700 italic border border-slate-100">
                  "{item.eg}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================== TAB 4: READING COMPREHENSION ==================================== */}
      {activeTab === 'reading' && (
        <div className="space-y-6">
          <div className="flex gap-2">
            {readingPassages.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPassage(p.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  selectedPassage === p.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Passage {p.id}: {p.title}
              </button>
            ))}
          </div>

          {readingPassages.find(p => p.id === selectedPassage) && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Passage Body */}
              <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                      {readingPassages.find(p => p.id === selectedPassage).genre}
                    </span>
                    <h3 className="text-xl font-black text-slate-800 mt-1">
                      {readingPassages.find(p => p.id === selectedPassage).title}
                    </h3>
                  </div>
                  <button 
                    onClick={() => speakText(readingPassages.find(p => p.id === selectedPassage).content)}
                    className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-slate-700 text-sm md:text-base leading-relaxed font-serif">
                  {readingPassages.find(p => p.id === selectedPassage).content}
                </p>
              </div>

              {/* Passage Questions */}
              <div className="lg:col-span-5 bg-indigo-50/60 p-6 rounded-3xl border border-indigo-100 space-y-4">
                <h4 className="font-black text-indigo-950 text-base flex items-center gap-2">
                  <span>🧠</span> Comprehension Check
                </h4>
                {readingPassages.find(p => p.id === selectedPassage).questions.map((q, qIdx) => (
                  <div key={qIdx} className="bg-white p-4 rounded-2xl border border-indigo-100 space-y-3">
                    <p className="font-extrabold text-xs text-slate-800">{qIdx+1}. {q.q}</p>
                    <div className="space-y-1.5">
                      {q.options.map(opt => (
                        <div key={opt} className={`p-2.5 rounded-xl text-xs font-bold border ${opt === q.ans ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                          {opt} {opt === q.ans && '✓'}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================== TAB 5: SENTENCE STRUCTURE & PUNCTUATION ==================================== */}
      {activeTab === 'punctuation' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <span>✍️</span> 4 Types of Sentences
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                <h4 className="font-black text-blue-900 text-sm">1. Declarative (Statement)</h4>
                <p className="text-xs text-slate-600 mt-0.5">Makes a statement. Ends with a period (.).</p>
                <span className="text-xs italic text-blue-800 mt-1 block">Example: The sun rises in the east.</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                <h4 className="font-black text-amber-900 text-sm">2. Interrogative (Question)</h4>
                <p className="text-xs text-slate-600 mt-0.5">Asks a question. Ends with a question mark (?).</p>
                <span className="text-xs italic text-amber-800 mt-1 block">Example: Did you finish reading the chapter?</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                <h4 className="font-black text-emerald-900 text-sm">3. Imperative (Command/Request)</h4>
                <p className="text-xs text-slate-600 mt-0.5">Gives an order or advice. Ends with (.) or (!).</p>
                <span className="text-xs italic text-emerald-800 mt-1 block">Example: Please close the laboratory door quietly.</span>
              </div>
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
                <h4 className="font-black text-rose-900 text-sm">4. Exclamatory (Strong Emotion)</h4>
                <p className="text-xs text-slate-600 mt-0.5">Expresses excitement or shock. Ends with (!).</p>
                <span className="text-xs italic text-rose-800 mt-1 block">Example: What a spectacular rainbow!</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <span>📍</span> Essential Punctuation Rules
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
                <h4 className="font-black text-purple-900 text-sm">Quotation Marks (" ")</h4>
                <p className="text-xs text-slate-600">Used around direct speech or dialogue.</p>
                <span className="text-xs font-bold text-purple-800 block mt-1">"We found the golden compass," whispered Alex.</span>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                <h4 className="font-black text-indigo-900 text-sm">Apostrophe (')</h4>
                <p className="text-xs text-slate-600">Shows possession (The dragon's lair) or contractions (can't, don't).</p>
              </div>
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100">
                <h4 className="font-black text-teal-900 text-sm">Commas (,)</h4>
                <p className="text-xs text-slate-600">Separates items in a list, clauses, or introductory phrases.</p>
                <span className="text-xs font-bold text-teal-800 block mt-1">We bought apples, oranges, grapes, and berries.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================== TAB 6: CREATIVE WRITING STUDIO ==================================== */}
      {activeTab === 'writing' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">
                Story Engine & Writing Prompts
              </span>
              <h3 className="text-2xl font-black text-slate-800 mt-1">Creative Story Generator</h3>
              <p className="text-slate-500 text-xs">Need inspiration for your story? Click to generate a brand new story prompt!</p>
            </div>
            <button
              onClick={() => setWritingPromptIndex((prev) => (prev + 1) % writingPrompts.length)}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md flex items-center gap-2 cursor-pointer shrink-0"
            >
              <RefreshCw className="w-4 h-4" /> Next Prompt
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-200">
            <span className="text-xs font-black uppercase text-purple-700 tracking-wider">Your Story Prompt:</span>
            <p className="text-lg font-black text-purple-950 mt-2 italic">
              "{writingPrompts[writingPromptIndex]}"
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase text-slate-500">Draft Your Story Below:</label>
            <textarea
              rows={6}
              placeholder="Once upon a time..."
              className="w-full p-4 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      )}

      {/* ==================================== TAB 7: ENGLISH MASTER QUIZ ==================================== */}
      {activeTab === 'quiz' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-800">English Knowledge Check</h2>
              <p className="text-slate-500 text-xs">Test your mastery of nouns, verbs, vocabulary, punctuation, and grammar rules!</p>
            </div>
            {quizScore !== null && (
              <div className="px-4 py-2 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 font-black text-sm">
                Score: {quizScore} / {quizQuestions.length}
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
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
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
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/20 disabled:opacity-40 cursor-pointer"
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
          {/* Top Control Bar */}
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-slate-900/90 border border-slate-800 rounded-2xl px-6 py-3.5 flex items-center justify-between gap-4 shrink-0 mb-4 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 font-bold text-xs">
                📜 Full Poster View
              </span>
              <div>
                <h3 className="font-extrabold text-white text-sm">Grammar Guide - The Rules Behind Great Writing</h3>
                <p className="text-slate-400 text-[11px]">Official English Curriculum Chart & Reference Poster</p>
              </div>
            </div>

            <button 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition-all shadow-lg shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-4 h-4" /> Close
            </button>
          </div>

          {/* Centered High-Res Image Viewport */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center overflow-auto"
          >
            <img 
              src="/english_grammar_guide_infographic.jpg" 
              alt="Grammar Guide Infographic Poster" 
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2 border-slate-700/50 object-contain"
            />
          </div>
        </div>
      )}

    </div>
  );
}
