// ═══════════════════════════════════════════════════════════════
//  POLYGLOT PLANET - MASSIVE GLOBAL LANGUAGES ACADEMY (30+ WORLD LANGUAGES)
// ═══════════════════════════════════════════════════════════════

export const SUPPORTED_LEARNING_LANGUAGES = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸', native: 'Español', family: 'Romance' },
  { code: 'fr', name: 'French', flag: '🇫🇷', native: 'Français', family: 'Romance' },
  { code: 'de', name: 'German', flag: '🇩🇪', native: 'Deutsch', family: 'Germanic' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', native: 'हिन्दी', family: 'Indo-Aryan' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', native: '日本語', family: 'Japonic' },
  { code: 'zh', name: 'Mandarin Chinese', flag: '🇨🇳', native: '中文', family: 'Sino-Tibetan' },
  { code: 'ar', name: 'Arabic', flag: '🇦🇪', native: 'العربية', family: 'Afroasiatic' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳', native: 'தமிழ்', family: 'Dravidian' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', native: 'Italiano', family: 'Romance' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', native: 'Русский', family: 'Slavic' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', native: '한국어', family: 'Koreanic' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷', native: 'Português', family: 'Romance' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', native: 'Nederlands', family: 'Germanic' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', native: 'Türkçe', family: 'Turkic' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', native: 'Tiếng Việt', family: 'Austroasiatic' },
  { code: 'th', name: 'Thai', flag: '🇹🇭', native: 'ไทย', family: 'Kra-Dai' },
  { code: 'el', name: 'Greek', flag: '🇬🇷', native: 'Ελληνικά', family: 'Hellenic' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪', native: 'Svenska', family: 'Germanic' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱', native: 'Polski', family: 'Slavic' },
  { code: 'bn', name: 'Bengali', flag: '🇮🇳', native: 'বাংলা', family: 'Indo-Aryan' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳', native: 'తెలుగు', family: 'Dravidian' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳', native: 'मराठी', family: 'Indo-Aryan' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳', native: 'ગુજરાતી', family: 'Indo-Aryan' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳', native: 'മലയാളം', family: 'Dravidian' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳', native: 'கன்னட / ಕನ್ನಡ', family: 'Dravidian' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩', native: 'Bahasa Indonesia', family: 'Austronesian' },
  { code: 'tl', name: 'Tagalog', flag: '🇵🇭', native: 'Tagalog', family: 'Austronesian' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦', native: 'Українська', family: 'Slavic' }
];

// Helper Latin Alphabet Generator for Romance/Germanic languages
const LATIN_ALPHABET = [
  { char: 'A', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'Apple', example: 'Avion ✈️' },
  { char: 'B', name: 'b', type: 'Consonant', ipa: '/b/', mnemonic: 'Ball', example: 'Ballon 🎈' },
  { char: 'C', name: 'c', type: 'Consonant', ipa: '/k/', mnemonic: 'Cat', example: 'Chat 🐱' },
  { char: 'D', name: 'd', type: 'Consonant', ipa: '/d/', mnemonic: 'Door', example: 'Dauphin 🐬' },
  { char: 'E', name: 'e', type: 'Vowel', ipa: '/e/', mnemonic: 'Elephant', example: 'Éléphant 🐘' },
  { char: 'F', name: 'f', type: 'Consonant', ipa: '/f/', mnemonic: 'Flower', example: 'Fleur 🌸' },
  { char: 'G', name: 'g', type: 'Consonant', ipa: '/g/', mnemonic: 'Giraffe', example: 'Gâteau 🎂' },
  { char: 'H', name: 'h', type: 'Consonant', ipa: '/h/', mnemonic: 'House', example: 'Hibou 🦉' },
  { char: 'I', name: 'i', type: 'Vowel', ipa: '/i/', mnemonic: 'Island', example: 'Île 🏝️' },
  { char: 'J', name: 'j', type: 'Consonant', ipa: '/ʒ/', mnemonic: 'Juice', example: 'Jardin 🏡' }
];

export const LANGUAGE_ALPHABETS = {
  es: LATIN_ALPHABET,
  fr: LATIN_ALPHABET,
  de: LATIN_ALPHABET,
  it: LATIN_ALPHABET,
  pt: LATIN_ALPHABET,
  nl: LATIN_ALPHABET,
  tr: LATIN_ALPHABET,
  vi: LATIN_ALPHABET,
  sv: LATIN_ALPHABET,
  pl: LATIN_ALPHABET,
  id: LATIN_ALPHABET,
  tl: LATIN_ALPHABET,

  gu: [
    { char: 'અ', name: 'a', type: 'Vowel', ipa: '/ə/', mnemonic: 'Pomegranate', example: 'દાડમ 🍎' },
    { char: 'આ', name: 'aa', type: 'Vowel', ipa: '/aː/', mnemonic: 'Mango', example: 'કેરી 🥭' },
    { char: 'ઇ', name: 'i', type: 'Vowel', ipa: '/ɪ/', mnemonic: 'Tamarind', example: 'આમલી 🍬' },
    { char: 'ઈ', name: 'ee', type: 'Vowel', ipa: '/iː/', mnemonic: 'Sugarcane', example: 'શેરડી 🌾' },
    { char: 'ઉ', name: 'u', type: 'Vowel', ipa: '/ʊ/', mnemonic: 'Owl', example: 'ઘુવડ 🦉' },
    { char: 'ઊ', name: 'oo', type: 'Vowel', ipa: '/uː/', mnemonic: 'Wool', example: 'ઊન 🧶' },
    { char: 'એ', name: 'e', type: 'Vowel', ipa: '/eː/', mnemonic: 'Heel', example: 'એડી 🦶' },
    { char: 'ઓ', name: 'o', type: 'Vowel', ipa: '/oː/', mnemonic: 'Mortar', example: 'ખાંડણી 🥣' },
    { char: 'ક', name: 'ka', type: 'Consonant', ipa: '/kə/', mnemonic: 'Lotus', example: 'કમળ 🪷' },
    { char: 'ખ', name: 'kha', type: 'Consonant', ipa: '/kʰə/', mnemonic: 'Rabbit', example: 'સસલું 🐇' },
    { char: 'ગ', name: 'ga', type: 'Consonant', ipa: '/ɡə/', mnemonic: 'Elephant', example: 'હાથી 🐘' },
    { char: 'ઘ', name: 'gha', type: 'Consonant', ipa: '/ɡʱə/', mnemonic: 'House', example: 'ઘર 🏠' }
  ],
  bn: [
    { char: 'অ', name: 'o', type: 'Vowel', ipa: '/ɔ/', mnemonic: 'Mango', example: 'আম 🥭' },
    { char: 'আ', name: 'aa', type: 'Vowel', ipa: '/a/', mnemonic: 'Sky', example: 'আকাশ ☁️' },
    { char: 'ক', name: 'ko', type: 'Consonant', ipa: '/k/', mnemonic: 'Banana', example: 'কলা 🍌' }
  ],
  te: [
    { char: 'అ', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'Mother', example: 'అమ్మ 👩' },
    { char: 'ఆ', name: 'aa', type: 'Vowel', ipa: '/aː/', mnemonic: 'Cow', example: 'ఆవు 🐄' },
    { char: 'క', name: 'ka', type: 'Consonant', ipa: '/k/', mnemonic: 'Lotus', example: 'కమలం 🪷' }
  ],
  ta: [
    { char: 'அ', name: 'a', type: 'Vowel', ipa: '/ʌ/', mnemonic: 'Mother', example: 'அம்மா 👩' },
    { char: 'ஆ', name: 'aa', type: 'Vowel', ipa: '/aː/', mnemonic: 'Goat', example: 'ஆடு 🐐' },
    { char: 'க', name: 'ka', type: 'Consonant', ipa: '/k/', mnemonic: 'Eye', example: 'கண் 👁️' }
  ],
  ml: [
    { char: 'അ', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'Elephant', example: 'ആന 🐘' },
    { char: 'ആ', name: 'aa', type: 'Vowel', ipa: '/aː/', mnemonic: 'Tortoise', example: 'ஆമ 🐢' }
  ],
  kn: [
    { char: 'ಅ', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'Mother', example: 'ಅಮ್ಮ 👩' },
    { char: 'ಆ', name: 'aa', type: 'Vowel', ipa: '/aː/', mnemonic: 'Elephant', example: 'ಆನೆ 🐘' }
  ],
  mr: [
    { char: 'अ', name: 'a', type: 'Vowel', ipa: '/ə/', mnemonic: 'Pineapple', example: 'अननस 🍍' },
    { char: 'आ', name: 'aa', type: 'Vowel', ipa: '/aː/', mnemonic: 'Mango', example: 'आंबा 🥭' },
    { char: 'इ', name: 'i', type: 'Vowel', ipa: '/ɪ/', mnemonic: 'Tamarind', example: 'चिंच 🍬' }
  ],
  hi: [
    { char: 'अ', name: 'a', type: 'Vowel', ipa: '/ə/', mnemonic: 'Pomegranate', example: 'अनार 🍎' },
    { char: 'आ', name: 'aa', type: 'Vowel', ipa: '/aː/', mnemonic: 'Mango', example: 'आम 🥭' }
  ],
  ru: [
    { char: 'А', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'Watermelon', example: 'Арбуз 🍉' },
    { char: 'Б', name: 'be', type: 'Consonant', ipa: '/b/', mnemonic: 'Banana', example: 'Банан 🍌' }
  ],
  uk: [
    { char: 'А', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'Pineapple', example: 'Ананас 🍍' },
    { char: 'Б', name: 'be', type: 'Consonant', ipa: '/b/', mnemonic: 'Banana', example: 'Банан 🍌' }
  ],
  el: [
    { char: 'Α', name: 'Alpha', type: 'Vowel', ipa: '/a/', mnemonic: 'Star', example: 'Αστέρι ⭐️' },
    { char: 'Β', name: 'Beta', type: 'Consonant', ipa: '/v/', mnemonic: 'Book', example: 'Βιβλίο 📖' }
  ],
  th: [
    { char: 'ก', name: 'Gor Kai', type: 'Consonant', ipa: '/k/', mnemonic: 'Chicken', example: 'ไก่ 🐔' },
    { char: 'ข', name: 'Khor Khai', type: 'Consonant', ipa: '/kʰ/', mnemonic: 'Egg', example: 'ไข่ 🥚' }
  ],
  zh: [
    { char: 'ā', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'First Tone', example: '阿姨 👩' },
    { char: 'ō', name: 'o', type: 'Vowel', ipa: '/o/', mnemonic: 'Rooster', example: '嗷嗷 🐓' }
  ],
  ko: [
    { char: 'ㄱ', name: 'giyok', type: 'Consonant', ipa: '/k/', mnemonic: 'Bag', example: '가방 🎒' },
    { char: 'ㄴ', name: 'nieun', type: 'Consonant', ipa: '/n/', mnemonic: 'Tree', example: '나무 🌳' }
  ],
  ja: [
    { char: 'あ', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'Kangaroo', example: 'あめ 🍬' },
    { char: 'い', name: 'i', type: 'Vowel', ipa: '/i/', mnemonic: 'Two Eels', example: 'いぬ 🐕' }
  ],
  ar: [
    { char: 'أ', name: 'alif', type: 'Vowel', ipa: '/aː/', mnemonic: 'Pine Tree', example: 'أسد 🦁' }
  ]
};

export const ACTION_VERBS_GREETINGS = {
  mr: [
    { phrase: 'नमस्कार (Namaskar)', meaning: 'Hello / Greetings!', icon: '🙏', phonetic: 'nah-mas-kar', type: 'Greeting' },
    { phrase: 'शुभ प्रभात (Shubh Prabhat)', meaning: 'Good morning!', icon: '🌅', phonetic: 'shoobh pra-bhat', type: 'Greeting' },
    { phrase: 'धन्यवाद (Dhanyavaad)', meaning: 'Thank you!', icon: '🌸', phonetic: 'dhan-yah-vaad', type: 'Greeting' },
    { phrase: 'पुन्हा भेटू (Punha Bhetu)', meaning: 'See you again!', icon: '🙋', phonetic: 'poon-ha bhe-too', type: 'Greeting' },
    { phrase: 'पळणे (Palne)', meaning: 'To Run', icon: '🏃', phonetic: 'pal-ney', type: 'Action Verb' },
    { phrase: 'खाणे (Khane)', meaning: 'To Eat', icon: '🍽️', phonetic: 'kha-ney', type: 'Action Verb' },
    { phrase: 'वाचणे (Vachne)', meaning: 'To Read', icon: '📖', phonetic: 'va-chney', type: 'Action Verb' },
    { phrase: 'लिखाण (Likhan)', meaning: 'To Write', icon: '✏️', phonetic: 'lee-khan', type: 'Action Verb' }
  ],
  fr: [
    { phrase: 'Bonjour!', meaning: 'Hello / Good day!', icon: '👋', phonetic: 'bon-zhoor', type: 'Greeting' },
    { phrase: 'Bonsoir!', meaning: 'Good evening!', icon: '🌆', phonetic: 'bon-swar', type: 'Greeting' },
    { phrase: 'Merci beaucoup!', meaning: 'Thank you very much!', icon: '🙏', phonetic: 'mair-see boh-koo', type: 'Greeting' },
    { phrase: 'Au revoir!', meaning: 'Goodbye!', icon: '🙋', phonetic: 'oh ruh-vwar', type: 'Greeting' },
    { phrase: 'Courir', meaning: 'To Run', icon: '🏃', phonetic: 'koo-reer', type: 'Action Verb' },
    { phrase: 'Manger', meaning: 'To Eat', icon: '🍽️', phonetic: 'mahn-zhay', type: 'Action Verb' }
  ],
  de: [
    { phrase: 'Hallo!', meaning: 'Hello / Hi!', icon: '👋', phonetic: 'hah-loh', type: 'Greeting' },
    { phrase: 'Guten Morgen!', meaning: 'Good morning!', icon: '🌅', phonetic: 'goo-ten mor-gen', type: 'Greeting' },
    { phrase: 'Danke schön!', meaning: 'Thank you very much!', icon: '🙏', phonetic: 'dahn-keh shuen', type: 'Greeting' },
    { phrase: 'Laufen', meaning: 'To Run', icon: '🏃', phonetic: 'low-fen', type: 'Action Verb' },
    { phrase: 'Essen', meaning: 'To Eat', icon: '🍽️', phonetic: 'ehs-sen', type: 'Action Verb' }
  ],
  es: [
    { phrase: '¡Hola!', meaning: 'Hello / Hi!', icon: '👋', phonetic: 'oh-lah', type: 'Greeting' },
    { phrase: '¡Buenos días!', meaning: 'Good morning!', icon: '🌅', phonetic: 'bway-nohs dee-ahs', type: 'Greeting' },
    { phrase: '¡Gracias!', meaning: 'Thank you!', icon: '🙏', phonetic: 'grah-see-ahs', type: 'Greeting' },
    { phrase: 'Correr', meaning: 'To Run', icon: '🏃', phonetic: 'koh-rrehr', type: 'Action Verb' }
  ],
  hi: [
    { phrase: 'नमस्ते (Namaste)', meaning: 'Hello / Greetings!', icon: '🙏', phonetic: 'nah-mas-tay', type: 'Greeting' },
    { phrase: 'सुप्रभात (Suprabhat)', meaning: 'Good morning!', icon: '🌅', phonetic: 'soo-prah-bhaat', type: 'Greeting' },
    { phrase: 'दौड़ना (Daudna)', meaning: 'To Run', icon: '🏃', phonetic: 'daud-nah', type: 'Action Verb' }
  ],
  ja: [
    { phrase: 'こんにちは (Konnichiwa)', meaning: 'Hello!', icon: '👋', phonetic: 'kon-nee-chee-wah', type: 'Greeting' },
    { phrase: 'おはようございます (Ohayou)', meaning: 'Good morning!', icon: '🌅', phonetic: 'oh-hah-yoh', type: 'Greeting' },
    { phrase: '走る (Hashiru)', meaning: 'To Run', icon: '🏃', phonetic: 'hah-shee-roo', type: 'Action Verb' }
  ]
};

export const SITUATIONAL_PHRASEBOOK = {
  mr: [
    {
      category: '🍽️ Restaurant & Food',
      phrases: [
        { native: 'हे कितीचे आहे? (He kitiche aahe?)', english: 'How much is this?', phonetic: 'he kee-tee-che aa-he' },
        { native: 'पाणी द्या, कृपया। (Paani dya, kripaya)', english: 'Please give water.', phonetic: 'paa-nee dya kri-pa-ya' }
      ]
    }
  ],
  fr: [
    {
      category: '🍽️ Restaurant & Food',
      phrases: [
        { native: 'Une table pour deux, s\'il vous plaît.', english: 'A table for two, please.', phonetic: 'oon tah-bluh poor duh' },
        { native: 'Combien ça coûte?', english: 'How much does this cost?', phonetic: 'kom-byan sah koot' }
      ]
    }
  ],
  de: [
    {
      category: '🍽️ Restaurant & Food',
      phrases: [
        { native: 'Einen Tisch für zwei, bitte.', english: 'A table for two, please.', phonetic: 'eye-nen tish fuer tsvay' },
        { native: 'Wie viel kostet das?', english: 'How much does this cost?', phonetic: 'vee feel kos-tet das' }
      ]
    }
  ],
  es: [
    {
      category: '🍽️ Restaurant & Food',
      phrases: [
        { native: 'Una mesa para dos, por favor.', english: 'A table for two, please.', phonetic: 'oo-nah me-sah pah-rah dohs' },
        { native: '¿Cuánto cuesta esto?', english: 'How much does this cost?', phonetic: 'kwahn-toh kwes-tah ehs-toh' }
      ]
    }
  ],
  hi: [
    {
      category: '🍽️ Restaurant & Food',
      phrases: [
        { native: 'यह कितने का है?', english: 'How much is this?', phonetic: 'yeh kit-ne kaa hai' },
        { native: 'पानी दीजिए, कृपया।', english: 'Please give water.', phonetic: 'paa-nee dee-ji-ye' }
      ]
    }
  ]
};

export const GRAMMAR_SENTENCES = {
  mr: [
    {
      targetSentence: "मांजर सफरचंद खाते",
      englishTranslation: "The cat eats the apple",
      blocks: [
        { id: 'b1', text: 'मांजर (Manjar) 🐱', type: 'noun', color: 'bg-emerald-500 text-white' },
        { id: 'b2', text: 'सफरचंद (Safarchand) 🍎', type: 'noun', color: 'bg-emerald-500 text-white' },
        { id: 'b3', text: 'खाते (Khate) 🍽️', type: 'verb', color: 'bg-blue-600 text-white' }
      ]
    }
  ],
  fr: [
    {
      targetSentence: "Le chat mange la pomme",
      englishTranslation: "The cat eats the apple",
      blocks: [
        { id: 'b1', text: 'Le chat 🐱', type: 'noun', color: 'bg-emerald-500 text-white' },
        { id: 'b2', text: 'mange 🍽️', type: 'verb', color: 'bg-blue-600 text-white' },
        { id: 'b3', text: 'la pomme 🍎', type: 'noun', color: 'bg-emerald-500 text-white' }
      ]
    }
  ],
  de: [
    {
      targetSentence: "Die Katze frisst den Apfel",
      englishTranslation: "The cat eats the apple",
      blocks: [
        { id: 'b1', text: 'Die Katze 🐱', type: 'noun', color: 'bg-emerald-500 text-white' },
        { id: 'b2', text: 'frisst 🍽️', type: 'verb', color: 'bg-blue-600 text-white' },
        { id: 'b3', text: 'den Apfel 🍎', type: 'noun', color: 'bg-emerald-500 text-white' }
      ]
    }
  ],
  es: [
    {
      targetSentence: "El gato come la manzana",
      englishTranslation: "The cat eats the apple",
      blocks: [
        { id: 'b1', text: 'El gato 🐱', type: 'noun', color: 'bg-emerald-500 text-white' },
        { id: 'b2', text: 'come 🍽️', type: 'verb', color: 'bg-blue-600 text-white' },
        { id: 'b3', text: 'la manzana 🍎', type: 'noun', color: 'bg-emerald-500 text-white' }
      ]
    }
  ],
  hi: [
    {
      targetSentence: "बिल्ली सेब खाती है",
      englishTranslation: "The cat eats the apple",
      blocks: [
        { id: 'b1', text: 'बिल्ली (Billi) 🐱', type: 'noun', color: 'bg-emerald-500 text-white' },
        { id: 'b2', text: 'सेब (Seb) 🍎', type: 'noun', color: 'bg-emerald-500 text-white' },
        { id: 'b3', text: 'खाती है (Khati hai) 🍽️', type: 'verb', color: 'bg-blue-600 text-white' }
      ]
    }
  ]
};

export const LANGUAGE_NUMBERS = {
  mr: [
    { num: 1, native: '१', word: 'एक (Ek)', phonetic: 'ek' },
    { num: 2, native: '२', word: 'दोन (Don)', phonetic: 'don' },
    { num: 3, native: '३', word: 'तीन (Teen)', phonetic: 'teen' }
  ],
  fr: [
    { num: 1, native: '1', word: 'Un', phonetic: 'uhn' },
    { num: 2, native: '2', word: 'Deux', phonetic: 'duh' },
    { num: 3, native: '3', word: 'Trois', phonetic: 'trwah' }
  ],
  de: [
    { num: 1, native: '1', word: 'Eins', phonetic: 'eyens' },
    { num: 2, native: '2', word: 'Zwei', phonetic: 'tsvay' }
  ],
  es: [
    { num: 1, native: '1', word: 'Uno', phonetic: 'oo-noh' },
    { num: 2, native: '2', word: 'Dos', phonetic: 'dohs' }
  ],
  hi: [
    { num: 1, native: '१', word: 'एक (Ek)', phonetic: 'ek' },
    { num: 2, native: '२', word: 'दो (Do)', phonetic: 'do' }
  ]
};

export const VISUAL_VOCABULARY = {
  mr: [
    { id: 'cat', word: 'मांजर (Manjar)', meaning: 'The Cat', category: 'Animals', icon: '🐱', phonetic: 'man-jar' },
    { id: 'dog', word: 'कुत्रा (Kutra)', meaning: 'The Dog', category: 'Animals', icon: '🐕', phonetic: 'koot-ra' },
    { id: 'apple', word: 'सफरचंद (Safarchand)', meaning: 'The Apple', category: 'Food', icon: '🍎', phonetic: 'sa-far-chand' },
    { id: 'house', word: 'घर (Ghar)', meaning: 'The House', category: 'Home', icon: '🏠', phonetic: 'ghar' },
    { id: 'sun', word: 'सूर्य (Surya)', meaning: 'The Sun', category: 'Nature', icon: '☀️', phonetic: 'soor-ya' }
  ],
  fr: [
    { id: 'cat', word: 'Le Chat', meaning: 'The Cat', category: 'Animals', icon: '🐱', phonetic: 'luh shah' },
    { id: 'dog', word: 'Le Chien', meaning: 'The Dog', category: 'Animals', icon: '🐕', phonetic: 'luh shyan' },
    { id: 'apple', word: 'La Pomme', meaning: 'The Apple', category: 'Food', icon: '🍎', phonetic: 'lah pom' },
    { id: 'house', word: 'La Maison', meaning: 'The House', category: 'Home', icon: '🏠', phonetic: 'lah may-zon' },
    { id: 'sun', word: 'Le Soleil', meaning: 'The Sun', category: 'Nature', icon: '☀️', phonetic: 'luh soh-lay' }
  ],
  de: [
    { id: 'cat', word: 'Die Katze', meaning: 'The Cat', category: 'Animals', icon: '🐱', phonetic: 'dee kat-tseh' },
    { id: 'dog', word: 'Der Hund', meaning: 'The Dog', category: 'Animals', icon: '🐕', phonetic: 'dair hoond' },
    { id: 'apple', word: 'Der Apfel', meaning: 'The Apple', category: 'Food', icon: '🍎', phonetic: 'dair ap-fel' }
  ],
  es: [
    { id: 'cat', word: 'El Gato', meaning: 'The Cat', category: 'Animals', icon: '🐱', phonetic: 'el gah-toh' },
    { id: 'dog', word: 'El Perro', meaning: 'The Dog', category: 'Animals', icon: '🐕', phonetic: 'el peh-rroh' }
  ],
  hi: [
    { id: 'cat', word: 'बिल्ली (Billi)', meaning: 'The Cat', category: 'Animals', icon: '🐱', phonetic: 'bil-lee' },
    { id: 'dog', word: 'कुत्ता (Kutta)', meaning: 'The Dog', category: 'Animals', icon: '🐕', phonetic: 'kut-taa' }
  ]
};

export const GRAPHIC_NOVEL_STORIES = {
  mr: [
    {
      title: "भाग १: जादुई बागेचा प्रवास (Quest for Magic Garden)",
      panels: [
        { speaker: "Poly Parrot 🦜", speech: "नमस्कार मित्रांनो! आज आपण जादुई बागेच्या प्रवासाला जात आहोत!", translation: "Hello friends! Today we are going on a quest to the magic garden!" },
        { speaker: "Dino 🦖", speech: "अरे वा! तिथे गोड फळे आणि सुंदर नद्या असतील का?", translation: "Wow! Will there be sweet fruits and beautiful rivers there?" },
        { speaker: "Wise Owl 🦉", speech: "ही सोन्याची किल्ली घ्या आणि दरवाजा उघडा.", translation: "Take this golden key and open the door." },
        { speaker: "Poly Parrot 🦜", speech: "अभिनंदन! आम्ही एकत्र यश मिळवले!", translation: "Congratulations! We succeeded together!" }
      ]
    }
  ],
  fr: [
    {
      title: "Épisode 1: Le Mystère du Jardin Magique (Quest for Magic Garden)",
      panels: [
        { speaker: "Poly Parrot 🦜", speech: "Bonjour les amis! Aujourd'hui, nous explorons le jardin magique!", translation: "Hello friends! Today we explore the magic garden!" },
        { speaker: "Dino 🦖", speech: "Regarde ces belles pommes et fleurs colorées!", translation: "Look at these beautiful apples and colorful flowers!" },
        { speaker: "Wise Owl 🦉", speech: "Bienvenue petits aventuriers! Prenez cette clé dorée.", translation: "Welcome little adventurers! Take this golden key." }
      ]
    }
  ],
  de: [
    {
      title: "Episode 1: Das Geheimnis des Zauberwalds (Mystery of Magic Forest)",
      panels: [
        { speaker: "Poly Parrot 🦜", speech: "Hallo Freunde! Heute erkunden wir den magischen Wald!", translation: "Hello friends! Today we explore the magic forest!" },
        { speaker: "Dino 🦖", speech: "Wollte schon immer frische Äpfel und Blumen sehen!", translation: "Always wanted to see fresh apples and flowers!" }
      ]
    }
  ],
  es: [
    {
      title: "Episodio 1: El Misterio del Jardín Mágico (Quest for Magic Garden)",
      panels: [
        { speaker: "Poly Parrot 🦜", speech: "¡Hola amigos! Hoy vamos a explorar el Jardín Mágico.", translation: "Hello friends! Today we are exploring the Magic Garden." },
        { speaker: "Dino 🦖", speech: "¡Fantástico! ¡Mira esas deliciosas manzanas y flores brillantes!", translation: "Fantastic! Look at those delicious apples and bright flowers!" }
      ]
    }
  ],
  hi: [
    {
      title: "Episode 1: जादुई बगीचे की रहस्यमयी यात्रा (The Quest for the Magic Garden)",
      panels: [
        { speaker: "Poly Parrot 🦜", speech: "नमस्ते दोस्तों! आज हम एक जादुई गुप्त बगीचे की खोज में जा रहे हैं!", translation: "Hello friends! Today we are going on a quest for a secret magic garden!" },
        { speaker: "Dino 🦖", speech: "वाह! क्या वहाँ मीठे फल और सुंदर नदियाँ होंगी?", translation: "Wow! Will there be sweet fruits and beautiful rivers there?" }
      ]
    }
  ]
};
