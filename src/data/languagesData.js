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
  { char: 'J', name: 'j', type: 'Consonant', ipa: '/ʒ/', mnemonic: 'Juice', example: 'Jardin 🏡' },
  { char: 'K', name: 'k', type: 'Consonant', ipa: '/k/', mnemonic: 'Koala', example: 'Koala 🐨' },
  { char: 'L', name: 'l', type: 'Consonant', ipa: '/l/', mnemonic: 'Lion', example: 'Lion 🦁' },
  { char: 'M', name: 'm', type: 'Consonant', ipa: '/m/', mnemonic: 'Moon', example: 'Lune 🌙' },
  { char: 'N', name: 'n', type: 'Consonant', ipa: '/n/', mnemonic: 'Nest', example: 'Nuage ☁️' },
  { char: 'O', name: 'o', type: 'Vowel', ipa: '/o/', mnemonic: 'Orange', example: 'Oiseau 🐦' },
  { char: 'P', name: 'p', type: 'Consonant', ipa: '/p/', mnemonic: 'Pencil', example: 'Pomme 🍎' },
  { char: 'Q', name: 'q', type: 'Consonant', ipa: '/k/', mnemonic: 'Queen', example: 'Quatre 4️⃣' },
  { char: 'R', name: 'r', type: 'Consonant', ipa: '/r/', mnemonic: 'Rose', example: 'Robot 🤖' },
  { char: 'S', name: 's', type: 'Consonant', ipa: '/s/', mnemonic: 'Sun', example: 'Soleil ☀️' },
  { char: 'T', name: 't', type: 'Consonant', ipa: '/t/', mnemonic: 'Tree', example: 'Train 🚆' },
  { char: 'U', name: 'u', type: 'Vowel', ipa: '/u/', mnemonic: 'Umbrella', example: 'Usine 🏭' },
  { char: 'V', name: 'v', type: 'Consonant', ipa: '/v/', mnemonic: 'Violin', example: 'Vache 🐄' },
  { char: 'W', name: 'w', type: 'Consonant', ipa: '/w/', mnemonic: 'Wagon', example: 'Wagon 🚃' },
  { char: 'X', name: 'x', type: 'Consonant', ipa: '/ks/', mnemonic: 'Xylophone', example: 'Xylophone 🎼' },
  { char: 'Y', name: 'y', type: 'Vowel', ipa: '/j/', mnemonic: 'Yacht', example: 'Yacht 🛥️' },
  { char: 'Z', name: 'z', type: 'Consonant', ipa: '/z/', mnemonic: 'Zebra', example: 'Zèbre 🦓' }
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

  hi: [
    { char: 'अ', name: 'a', type: 'Vowel', ipa: '/ə/', mnemonic: 'Pomegranate', example: 'अनार 🍎' },
    { char: 'आ', name: 'aa', type: 'Vowel', ipa: '/aː/', mnemonic: 'Mango', example: 'आम 🥭' },
    { char: 'इ', name: 'i', type: 'Vowel', ipa: '/ɪ/', mnemonic: 'Tamarind', example: 'इमली 🍬' },
    { char: 'ई', name: 'ee', type: 'Vowel', ipa: '/iː/', mnemonic: 'Sugarcane', example: 'ईख 🌾' },
    { char: 'उ', name: 'u', type: 'Vowel', ipa: '/ʊ/', mnemonic: 'Owl', example: 'उल्लू 🦉' },
    { char: 'ऊ', name: 'oo', type: 'Vowel', ipa: '/uː/', mnemonic: 'Wool', example: 'ऊन 🧶' },
    { char: 'ए', name: 'e', type: 'Vowel', ipa: '/eː/', mnemonic: 'Heel', example: 'एड़ी 🦶' },
    { char: 'ऐ', name: 'ai', type: 'Vowel', ipa: '/ɛː/', mnemonic: 'Spectacles', example: 'ऐनक 👓' },
    { char: 'ओ', name: 'o', type: 'Vowel', ipa: '/oː/', mnemonic: 'Mortar', example: 'ओखली 🥣' },
    { char: 'औ', name: 'au', type: 'Vowel', ipa: '/ɔː/', mnemonic: 'Woman', example: 'औरत 👩' },
    { char: 'क', name: 'ka', type: 'Consonant', ipa: '/kə/', mnemonic: 'Lotus', example: 'कमल 🪷' },
    { char: 'ख', name: 'kha', type: 'Consonant', ipa: '/kʰə/', mnemonic: 'Rabbit', example: 'खरगोश 🐇' },
    { char: 'ग', name: 'ga', type: 'Consonant', ipa: '/ɡə/', mnemonic: 'Flowerpot', example: 'गमला 🪴' },
    { char: 'घ', name: 'gha', type: 'Consonant', ipa: '/ɡʱə/', mnemonic: 'House', example: 'घर 🏠' },
    { char: 'च', name: 'cha', type: 'Consonant', ipa: '/t͡ʃə/', mnemonic: 'Spoon', example: 'चम्मच 🥄' },
    { char: 'छ', name: 'chha', type: 'Consonant', ipa: '/t͡ʃʰə/', mnemonic: 'Umbrella', example: 'छतरी ☂️' },
    { char: 'ज', name: 'ja', type: 'Consonant', ipa: '/d͡ʒə/', mnemonic: 'Ship', example: 'जहाज 🚢' },
    { char: 'झ', name: 'jha', type: 'Consonant', ipa: '/d͡ʒʱə/', mnemonic: 'Flag', example: 'झंडा 🚩' },
    { char: 'ट', name: 'ta', type: 'Consonant', ipa: '/ʈə/', mnemonic: 'Tomato', example: 'टमाटर 🍅' },
    { char: 'ड', name: 'da', type: 'Consonant', ipa: '/ɖə/', mnemonic: 'Drum', example: 'डमरू 🥁' },
    { char: 'त', name: 'ta', type: 'Consonant', ipa: '/t̪ə/', mnemonic: 'Watermelon', example: 'तरबूज 🍉' },
    { char: 'द', name: 'da', type: 'Consonant', ipa: '/d̪ə/', mnemonic: 'Medicine', example: 'दवा 💊' },
    { char: 'न', name: 'na', type: 'Consonant', ipa: '/n̪ə/', mnemonic: 'Tap', example: 'नल 🚰' },
    { char: 'प', name: 'pa', type: 'Consonant', ipa: '/pə/', mnemonic: 'Kite', example: 'पतंग 🪁' },
    { char: 'फ', name: 'pha', type: 'Consonant', ipa: '/pʰə/', mnemonic: 'Fruit', example: 'फल 🍎' },
    { char: 'ब', name: 'ba', type: 'Consonant', ipa: '/bə/', mnemonic: 'Duck', example: 'बतख 🦆' },
    { char: 'भ', name: 'bha', type: 'Consonant', ipa: '/bʱə/', mnemonic: 'Bear', example: 'भालू 🐻' },
    { char: 'म', name: 'ma', type: 'Consonant', ipa: '/mə/', mnemonic: 'Fish', example: 'मछली 🐟' },
    { char: 'य', name: 'ya', type: 'Consonant', ipa: '/jə/', mnemonic: 'Yagya', example: 'यज्ञ 🔥' },
    { char: 'र', name: 'ra', type: 'Consonant', ipa: '/rə/', mnemonic: 'Chariot', example: 'रथ 🛞' },
    { char: 'ल', name: 'la', type: 'Consonant', ipa: '/lə/', mnemonic: 'Top', example: 'लट्टू 🪀' },
    { char: 'व', name: 'va', type: 'Consonant', ipa: '/ʋə/', mnemonic: 'Tree', example: 'वृक्ष 🌳' },
    { char: 'स', name: 'sa', type: 'Consonant', ipa: '/sə/', mnemonic: 'Snake charmer', example: 'सपेरा 🐍' },
    { char: 'ह', name: 'ha', type: 'Consonant', ipa: '/ɦə/', mnemonic: 'Elephant', example: 'हाथी 🐘' }
  ],
  ja: [
    { char: 'あ', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'Kangaroo', example: 'あめ 🍬' },
    { char: 'い', name: 'i', type: 'Vowel', ipa: '/i/', mnemonic: 'Two Eels', example: 'いぬ 🐕' },
    { char: 'う', name: 'u', type: 'Vowel', ipa: '/u/', mnemonic: 'Heavy bag', example: '海 🌊' },
    { char: 'え', name: 'e', type: 'Vowel', ipa: '/e/', mnemonic: 'Exotic bird', example: 'えんぴつ ✏️' },
    { char: 'お', name: 'o', type: 'Vowel', ipa: '/o/', mnemonic: 'Golf player', example: 'おにぎり 🍙' },
    { char: 'か', name: 'ka', type: 'Consonant', ipa: '/ka/', mnemonic: 'Kite', example: '川 🏞️' },
    { char: 'き', name: 'ki', type: 'Consonant', ipa: '/ki/', mnemonic: 'Key', example: '木 🌳' },
    { char: 'く', name: 'ku', type: 'Consonant', ipa: '/ku/', mnemonic: 'Cuckoo', example: '車 🚗' },
    { char: 'け', name: 'ke', type: 'Consonant', ipa: '/ke/', mnemonic: 'Keg', example: '毛 🧶' },
    { char: 'こ', name: 'ko', type: 'Consonant', ipa: '/ko/', mnemonic: 'Koi fish', example: '子供 🧒' },
    { char: 'さ', name: 'sa', type: 'Consonant', ipa: '/sa/', mnemonic: 'Smiling face', example: '魚 🐟' }
  ],
  ar: [
    { char: 'أ', name: 'alif', type: 'Vowel', ipa: '/aː/', mnemonic: 'Pine Tree', example: 'أسد 🦁' },
    { char: 'ب', name: 'baa', type: 'Consonant', ipa: '/b/', mnemonic: 'Boat dot below', example: 'بيت 🏠' },
    { char: 'ت', name: 'taa', type: 'Consonant', ipa: '/t/', mnemonic: 'Smile 2 dots', example: 'تفاحة 🍎' },
    { char: 'ث', name: 'thaa', type: 'Consonant', ipa: '/θ/', mnemonic: 'Pyramid 3 dots', example: 'ثعلب 🦊' },
    { char: 'ج', name: 'jeem', type: 'Consonant', ipa: '/d͡ʒ/', mnemonic: 'Camel belly dot', example: 'جمل 🐪' }
  ],
  ru: [
    { char: 'А', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'Apple', example: 'Арбуз 🍉' },
    { char: 'Б', name: 'be', type: 'Consonant', ipa: '/b/', mnemonic: 'Drum', example: 'Банан 🍌' },
    { char: 'В', name: 've', type: 'Consonant', ipa: '/v/', mnemonic: 'Wolf', example: 'Волк 🐺' }
  ],
  uk: [
    { char: 'А', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'Apple', example: 'Ананас 🍍' },
    { char: 'Б', name: 'be', type: 'Consonant', ipa: '/b/', mnemonic: 'Banana', example: 'Банан 🍌' }
  ],
  zh: [
    { char: 'ā', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'First Tone', example: '阿姨 👩' },
    { char: 'ō', name: 'o', type: 'Vowel', ipa: '/o/', mnemonic: 'Rooster', example: '嗷嗷 🐓' }
  ],
  ko: [
    { char: 'ㄱ', name: 'giyok', type: 'Consonant', ipa: '/k/', mnemonic: 'Gun shape', example: '가방 🎒' },
    { char: 'ㄴ', name: 'nieun', type: 'Consonant', ipa: '/n/', mnemonic: 'Nose angle', example: '나무 🌳' }
  ],
  ta: [
    { char: 'அ', name: 'a', type: 'Vowel', ipa: '/ʌ/', mnemonic: 'Mother', example: 'அம்மா 👩' },
    { char: 'ஆ', name: 'aa', type: 'Vowel', ipa: '/aː/', mnemonic: 'Goat', example: 'ஆடு 🐐' }
  ]
};

// ═══════════════════════════════════════════════════════════════
//  LEVEL 2: ACTION VERBS & GREETINGS (NATIVE DICTIONARIES)
// ═══════════════════════════════════════════════════════════════
export const ACTION_VERBS_GREETINGS = {
  fr: [
    { phrase: 'Bonjour!', meaning: 'Hello / Good day!', icon: '👋', phonetic: 'bon-zhoor', type: 'Greeting' },
    { phrase: 'Bonsoir!', meaning: 'Good evening!', icon: '🌆', phonetic: 'bon-swar', type: 'Greeting' },
    { phrase: 'Merci beaucoup!', meaning: 'Thank you very much!', icon: '🙏', phonetic: 'mair-see boh-koo', type: 'Greeting' },
    { phrase: 'Au revoir!', meaning: 'Goodbye!', icon: '🙋', phonetic: 'oh ruh-vwar', type: 'Greeting' },
    { phrase: 'Courir', meaning: 'To Run', icon: '🏃', phonetic: 'koo-reer', type: 'Action Verb' },
    { phrase: 'Manger', meaning: 'To Eat', icon: '🍽️', phonetic: 'mahn-zhay', type: 'Action Verb' },
    { phrase: 'Lire', meaning: 'To Read', icon: '📖', phonetic: 'leer', type: 'Action Verb' },
    { phrase: 'Écrire', meaning: 'To Write', icon: '✏️', phonetic: 'ay-kreer', type: 'Action Verb' },
    { phrase: 'Dormir', meaning: 'To Sleep', icon: '😴', phonetic: 'dor-meer', type: 'Action Verb' }
  ],
  de: [
    { phrase: 'Hallo!', meaning: 'Hello / Hi!', icon: '👋', phonetic: 'hah-loh', type: 'Greeting' },
    { phrase: 'Guten Morgen!', meaning: 'Good morning!', icon: '🌅', phonetic: 'goo-ten mor-gen', type: 'Greeting' },
    { phrase: 'Danke schön!', meaning: 'Thank you very much!', icon: '🙏', phonetic: 'dahn-keh shuen', type: 'Greeting' },
    { phrase: 'Auf Wiedersehen!', meaning: 'Goodbye!', icon: '🙋', phonetic: 'owf vee-der-zay-en', type: 'Greeting' },
    { phrase: 'Laufen', meaning: 'To Run', icon: '🏃', phonetic: 'low-fen', type: 'Action Verb' },
    { phrase: 'Essen', meaning: 'To Eat', icon: '🍽️', phonetic: 'ehs-sen', type: 'Action Verb' },
    { phrase: 'Lesen', meaning: 'To Read', icon: '📖', phonetic: 'lay-zen', type: 'Action Verb' },
    { phrase: 'Schreiben', meaning: 'To Write', icon: '✏️', phonetic: 'shry-ben', type: 'Action Verb' },
    { phrase: 'Schlafen', meaning: 'To Sleep', icon: '😴', phonetic: 'shlah-fen', type: 'Action Verb' }
  ],
  es: [
    { phrase: '¡Hola!', meaning: 'Hello / Hi!', icon: '👋', phonetic: 'oh-lah', type: 'Greeting' },
    { phrase: '¡Buenos días!', meaning: 'Good morning!', icon: '🌅', phonetic: 'bway-nohs dee-ahs', type: 'Greeting' },
    { phrase: '¡Gracias!', meaning: 'Thank you!', icon: '🙏', phonetic: 'grah-see-ahs', type: 'Greeting' },
    { phrase: 'Correr', meaning: 'To Run', icon: '🏃', phonetic: 'koh-rrehr', type: 'Action Verb' },
    { phrase: 'Comer', meaning: 'To Eat', icon: '🍽️', phonetic: 'koh-mehr', type: 'Action Verb' },
    { phrase: 'Leer', meaning: 'To Read', icon: '📖', phonetic: 'lay-ehr', type: 'Action Verb' },
    { phrase: 'Escribir', meaning: 'To Write', icon: '✏️', phonetic: 'ehs-kree-beer', type: 'Action Verb' },
    { phrase: 'Dormir', meaning: 'To Sleep', icon: '😴', phonetic: 'dohr-meer', type: 'Action Verb' }
  ],
  it: [
    { phrase: 'Ciao!', meaning: 'Hello / Hi!', icon: '👋', phonetic: 'chow', type: 'Greeting' },
    { phrase: 'Buongiorno!', meaning: 'Good morning!', icon: '🌅', phonetic: 'bwon-johr-noh', type: 'Greeting' },
    { phrase: 'Grazie mille!', meaning: 'Thank you so much!', icon: '🙏', phonetic: 'grah-tsee-eh meel-leh', type: 'Greeting' },
    { phrase: 'Arrivederci!', meaning: 'Goodbye!', icon: '🙋', phonetic: 'ahr-ree-veh-dair-chee', type: 'Greeting' },
    { phrase: 'Correre', meaning: 'To Run', icon: '🏃', phonetic: 'kor-reh-reh', type: 'Action Verb' },
    { phrase: 'Mangiare', meaning: 'To Eat', icon: '🍽️', phonetic: 'mahn-jah-reh', type: 'Action Verb' }
  ],
  ru: [
    { phrase: 'Привет!', meaning: 'Hello!', icon: '👋', phonetic: 'pree-vyet', type: 'Greeting' },
    { phrase: 'Доброе утро!', meaning: 'Good morning!', icon: '🌅', phonetic: 'dob-roy-e oo-tro', type: 'Greeting' },
    { phrase: 'Спасибо!', meaning: 'Thank you!', icon: '🙏', phonetic: 'spa-see-ba', type: 'Greeting' },
    { phrase: 'Бегать', meaning: 'To Run', icon: '🏃', phonetic: 'bye-gat', type: 'Action Verb' },
    { phrase: 'Есть', meaning: 'To Eat', icon: '🍽️', phonetic: 'yest', type: 'Action Verb' }
  ],
  pt: [
    { phrase: 'Olá!', meaning: 'Hello!', icon: '👋', phonetic: 'oh-lah', type: 'Greeting' },
    { phrase: 'Bom dia!', meaning: 'Good morning!', icon: '🌅', phonetic: 'bom dee-ah', type: 'Greeting' },
    { phrase: 'Obrigado!', meaning: 'Thank you!', icon: '🙏', phonetic: 'oh-bree-gah-doo', type: 'Greeting' },
    { phrase: 'Correr', meaning: 'To Run', icon: '🏃', phonetic: 'koh-hehr', type: 'Action Verb' },
    { phrase: 'Comer', meaning: 'To Eat', icon: '🍽️', phonetic: 'koh-mehr', type: 'Action Verb' }
  ],
  hi: [
    { phrase: 'नमस्ते (Namaste)', meaning: 'Hello / Greetings!', icon: '🙏', phonetic: 'nah-mas-tay', type: 'Greeting' },
    { phrase: 'सुप्रभात (Suprabhat)', meaning: 'Good morning!', icon: '🌅', phonetic: 'soo-prah-bhaat', type: 'Greeting' },
    { phrase: 'धन्यवाद (Dhanyavaad)', meaning: 'Thank you!', icon: '🌸', phonetic: 'dhan-yah-vaad', type: 'Greeting' },
    { phrase: 'दौड़ना (Daudna)', meaning: 'To Run', icon: '🏃', phonetic: 'daud-nah', type: 'Action Verb' },
    { phrase: 'खाना (Khana)', meaning: 'To Eat', icon: '🍽️', phonetic: 'khaa-nah', type: 'Action Verb' }
  ],
  ja: [
    { phrase: 'こんにちは (Konnichiwa)', meaning: 'Hello!', icon: '👋', phonetic: 'kon-nee-chee-wah', type: 'Greeting' },
    { phrase: 'おはようございます (Ohayou)', meaning: 'Good morning!', icon: '🌅', phonetic: 'oh-hah-yoh', type: 'Greeting' },
    { phrase: 'ありがとうございます (Arigatou)', meaning: 'Thank you!', icon: '🙏', phonetic: 'ah-ree-gah-toh', type: 'Greeting' },
    { phrase: '走る (Hashiru)', meaning: 'To Run', icon: '🏃', phonetic: 'hah-shee-roo', type: 'Action Verb' },
    { phrase: '食べる (Taberu)', meaning: 'To Eat', icon: '🍽️', phonetic: 'tah-beh-roo', type: 'Action Verb' }
  ],
  zh: [
    { phrase: '你好！ (Nǐ hǎo)', meaning: 'Hello!', icon: '👋', phonetic: 'nee how', type: 'Greeting' },
    { phrase: '早上好！ (Zǎoshang hǎo)', meaning: 'Good morning!', icon: '🌅', phonetic: 'zhow shang how', type: 'Greeting' },
    { phrase: '谢谢！ (Xièxiè)', meaning: 'Thank you!', icon: '🙏', phonetic: 'sheh sheh', type: 'Greeting' },
    { phrase: '跑步 (Pǎobù)', meaning: 'To Run', icon: '🏃', phonetic: 'pow boo', type: 'Action Verb' },
    { phrase: '吃饭 (Chīfàn)', meaning: 'To Eat', icon: '🍽️', phonetic: 'churr fan', type: 'Action Verb' }
  ],
  ko: [
    { phrase: '안녕하세요! (Annyeonghaseyo)', meaning: 'Hello!', icon: '👋', phonetic: 'ahn-nyong-ha-seh-yo', type: 'Greeting' },
    { phrase: '감사합니다! (Gamsahamnida)', meaning: 'Thank you!', icon: '🙏', phonetic: 'gahm-sah-hahm-nee-da', type: 'Greeting' },
    { phrase: '달리기 (Dalligi)', meaning: 'To Run', icon: '🏃', phonetic: 'dahl-lee-gee', type: 'Action Verb' },
    { phrase: '먹기 (Meokgi)', meaning: 'To Eat', icon: '🍽️', phonetic: 'muhk-gee', type: 'Action Verb' }
  ],
  ar: [
    { phrase: 'مرحباً! (Marhaban)', meaning: 'Hello!', icon: '👋', phonetic: 'mar-ha-ban', type: 'Greeting' },
    { phrase: 'صباح الخير! (Sabah al-khair)', meaning: 'Good morning!', icon: '🌅', phonetic: 'sa-bah al-khair', type: 'Greeting' },
    { phrase: 'شكراً! (Shukran)', meaning: 'Thank you!', icon: '🙏', phonetic: 'shuk-ran', type: 'Greeting' },
    { phrase: 'الجري (Al-jari)', meaning: 'To Run', icon: '🏃', phonetic: 'al-ja-ree', type: 'Action Verb' },
    { phrase: 'الأكل (Al-akl)', meaning: 'To Eat', icon: '🍽️', phonetic: 'al-a-kl', type: 'Action Verb' }
  ],
  ta: [
    { phrase: 'வணக்கம்! (Vanakkam)', meaning: 'Hello!', icon: '👋', phonetic: 'va-nak-kam', type: 'Greeting' },
    { phrase: 'நன்றி! (Nandri)', meaning: 'Thank you!', icon: '🙏', phonetic: 'nan-dri', type: 'Greeting' },
    { phrase: 'ஓடுதல் (Oduthal)', meaning: 'To Run', icon: '🏃', phonetic: 'o-du-thal', type: 'Action Verb' },
    { phrase: 'சாப்பிடுதல் (Sappiduthal)', meaning: 'To Eat', icon: '🍽️', phonetic: 'sap-pi-du-thal', type: 'Action Verb' }
  ]
};

// ═══════════════════════════════════════════════════════════════
//  LEVEL 2.5: SITUATIONAL PHRASEBOOK (NATIVE DICTIONARIES)
// ═══════════════════════════════════════════════════════════════
export const SITUATIONAL_PHRASEBOOK = {
  fr: [
    {
      category: '🍽️ Restaurant & Food',
      phrases: [
        { native: 'Une table pour deux, s\'il vous plaît.', english: 'A table for two, please.', phonetic: 'oon tah-bluh poor duh' },
        { native: 'Combien ça coûte?', english: 'How much does this cost?', phonetic: 'kom-byan sah koot' },
        { native: 'L\'addition, s\'il vous plaît.', english: 'The bill, please.', phonetic: 'lah-dee-syon' }
      ]
    },
    {
      category: '🧭 Directions & Travel',
      phrases: [
        { native: 'Où sont les toilettes?', english: 'Where is the bathroom?', phonetic: 'oo son lay twa-let' },
        { native: 'Où est la gare?', english: 'Where is the station?', phonetic: 'oo ay lah gar' }
      ]
    }
  ],
  de: [
    {
      category: '🍽️ Restaurant & Food',
      phrases: [
        { native: 'Einen Tisch für zwei, bitte.', english: 'A table for two, please.', phonetic: 'eye-nen tish fuer tsvay' },
        { native: 'Wie viel kostet das?', english: 'How much does this cost?', phonetic: 'vee feel kos-tet das' },
        { native: 'Die Rechnung, bitte.', english: 'The bill, please.', phonetic: 'dee rech-noong' }
      ]
    },
    {
      category: '🧭 Directions & Travel',
      phrases: [
        { native: 'Wo ist die Toilette?', english: 'Where is the bathroom?', phonetic: 'voh ist dee twah-let-teh' },
        { native: 'Wo ist der Bahnhof?', english: 'Where is the train station?', phonetic: 'voh ist dair bahn-hof' }
      ]
    }
  ],
  es: [
    {
      category: '🍽️ Restaurant & Food',
      phrases: [
        { native: 'Una mesa para dos, por favor.', english: 'A table for two, please.', phonetic: 'oo-nah me-sah pah-rah dohs' },
        { native: '¿Cuánto cuesta esto?', english: 'How much does this cost?', phonetic: 'kwahn-toh kwes-tah ehs-toh' },
        { native: 'La cuenta, por favor.', english: 'The bill, please.', phonetic: 'lah kwen-tah' }
      ]
    },
    {
      category: '🧭 Directions & Travel',
      phrases: [
        { native: '¿Dónde está el baño?', english: 'Where is the bathroom?', phonetic: 'dohn-day ehs-tah el bah-nyoh' }
      ]
    }
  ],
  it: [
    {
      category: '🍽️ Restaurant & Food',
      phrases: [
        { native: 'Un tavolo per due, per favore.', english: 'A table for two, please.', phonetic: 'oon tah-vo-lo pair doo-eh' },
        { native: 'Quanto costa?', english: 'How much does this cost?', phonetic: 'kwan-to kos-ta' },
        { native: 'Il conto, per favore.', english: 'The bill, please.', phonetic: 'eel kon-to' }
      ]
    }
  ],
  ru: [
    {
      category: '🍽️ Restaurant & Food',
      phrases: [
        { native: 'Столик на двоих, пожалуйста.', english: 'A table for two, please.', phonetic: 'sto-lik na dvo-ikh' },
        { native: 'Сколько это стоит?', english: 'How much does this cost?', phonetic: 'skol-ko e-to sto-it' }
      ]
    }
  ],
  pt: [
    {
      category: '🍽️ Restaurant & Food',
      phrases: [
        { native: 'Uma mesa para dois, por favor.', english: 'A table for two, please.', phonetic: 'oo-ma me-sa pa-ra doys' },
        { native: 'Quanto custa isto?', english: 'How much does this cost?', phonetic: 'kwan-to koos-ta ees-to' }
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
  ],
  ja: [
    {
      category: '🍽️ Restaurant & Food',
      phrases: [
        { native: '二人用の席をお願いします。', english: 'A table for two, please.', phonetic: 'futari-you no seki wo onegaishimasu' },
        { native: 'これはいくらですか？', english: 'How much is this?', phonetic: 'kore wa ikura desu ka' }
      ]
    }
  ],
  zh: [
    {
      category: '🍽️ Restaurant & Food',
      phrases: [
        { native: '两个人，谢谢。', english: 'A table for two, please.', phonetic: 'liang ge ren, xie xie' },
        { native: '这个多少钱？', english: 'How much is this?', phonetic: 'zhe ge duo shao qian' }
      ]
    }
  ],
  ko: [
    {
      category: '🍽️ Restaurant & Food',
      phrases: [
        { native: '두 명 자리가 있나요?', english: 'A table for two, please.', phonetic: 'du myeong jariga innayo' },
        { native: '이거 얼마예요?', english: 'How much is this?', phonetic: 'igeo eolmayeyo' }
      ]
    }
  ],
  ar: [
    {
      category: '🍽️ Restaurant & Food',
      phrases: [
        { native: 'طاولة لشخصين، من فضلك.', english: 'A table for two, please.', phonetic: 'tawila li-shakhsayn' },
        { native: 'كم سعر هذا؟', english: 'How much is this?', phonetic: 'kam si\'r hadha' }
      ]
    }
  ],
  ta: [
    {
      category: '🍽️ Restaurant & Food',
      phrases: [
        { native: 'இதன் விலை என்ன?', english: 'How much is this?', phonetic: 'idhan vilai enna' },
        { native: 'தண்ணீர் தாருங்கள்.', english: 'Please give water.', phonetic: 'thanneer thaarungal' }
      ]
    }
  ]
};

// ═══════════════════════════════════════════════════════════════
//  LEVEL 3: COLOR-CODED LEGO GRAMMAR SENTENCES (NATIVE DICTIONARIES)
// ═══════════════════════════════════════════════════════════════
export const GRAMMAR_SENTENCES = {
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
  it: [
    {
      targetSentence: "Il gatto mangia la mela",
      englishTranslation: "The cat eats the apple",
      blocks: [
        { id: 'b1', text: 'Il gatto 🐱', type: 'noun', color: 'bg-emerald-500 text-white' },
        { id: 'b2', text: 'mangia 🍽️', type: 'verb', color: 'bg-blue-600 text-white' },
        { id: 'b3', text: 'la mela 🍎', type: 'noun', color: 'bg-emerald-500 text-white' }
      ]
    }
  ],
  ru: [
    {
      targetSentence: "Кот ест яблоко",
      englishTranslation: "The cat eats the apple",
      blocks: [
        { id: 'b1', text: 'Кот 🐱', type: 'noun', color: 'bg-emerald-500 text-white' },
        { id: 'b2', text: 'ест 🍽️', type: 'verb', color: 'bg-blue-600 text-white' },
        { id: 'b3', text: 'яблоко 🍎', type: 'noun', color: 'bg-emerald-500 text-white' }
      ]
    }
  ],
  pt: [
    {
      targetSentence: "O gato come a maçã",
      englishTranslation: "The cat eats the apple",
      blocks: [
        { id: 'b1', text: 'O gato 🐱', type: 'noun', color: 'bg-emerald-500 text-white' },
        { id: 'b2', text: 'come 🍽️', type: 'verb', color: 'bg-blue-600 text-white' },
        { id: 'b3', text: 'a maçã 🍎', type: 'noun', color: 'bg-emerald-500 text-white' }
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
  ],
  ja: [
    {
      targetSentence: "猫がりんごを食べます",
      englishTranslation: "The cat eats an apple",
      blocks: [
        { id: 'b1', text: '猫 (Neko) 🐱', type: 'noun', color: 'bg-emerald-500 text-white' },
        { id: 'b2', text: 'りんご (Ringo) 🍎', type: 'noun', color: 'bg-emerald-500 text-white' },
        { id: 'b3', text: 'を食べます (Tabemasu) 🍽️', type: 'verb', color: 'bg-blue-600 text-white' }
      ]
    }
  ],
  zh: [
    {
      targetSentence: "猫吃苹果",
      englishTranslation: "The cat eats an apple",
      blocks: [
        { id: 'b1', text: '猫 🐱', type: 'noun', color: 'bg-emerald-500 text-white' },
        { id: 'b2', text: '吃 🍽️', type: 'verb', color: 'bg-blue-600 text-white' },
        { id: 'b3', text: '苹果 🍎', type: 'noun', color: 'bg-emerald-500 text-white' }
      ]
    }
  ],
  ko: [
    {
      targetSentence: "고양이가 사과를 먹어요",
      englishTranslation: "The cat eats an apple",
      blocks: [
        { id: 'b1', text: '고양이가 🐱', type: 'noun', color: 'bg-emerald-500 text-white' },
        { id: 'b2', text: '사과를 🍎', type: 'noun', color: 'bg-emerald-500 text-white' },
        { id: 'b3', text: '먹어요 🍽️', type: 'verb', color: 'bg-blue-600 text-white' }
      ]
    }
  ],
  ar: [
    {
      targetSentence: "القط يأكل التفاحة",
      englishTranslation: "The cat eats the apple",
      blocks: [
        { id: 'b1', text: 'القط 🐱', type: 'noun', color: 'bg-emerald-500 text-white' },
        { id: 'b2', text: 'يأكل 🍽️', type: 'verb', color: 'bg-blue-600 text-white' },
        { id: 'b3', text: 'التفاحة 🍎', type: 'noun', color: 'bg-emerald-500 text-white' }
      ]
    }
  ],
  ta: [
    {
      targetSentence: "பூனை ஆப்பிள் சாப்பிடுகிறது",
      englishTranslation: "The cat eats the apple",
      blocks: [
        { id: 'b1', text: 'பூனை 🐱', type: 'noun', color: 'bg-emerald-500 text-white' },
        { id: 'b2', text: 'ஆப்பிள் 🍎', type: 'noun', color: 'bg-emerald-500 text-white' },
        { id: 'b3', text: 'சாப்பிடுகிறது 🍽️', type: 'verb', color: 'bg-blue-600 text-white' }
      ]
    }
  ]
};

// ═══════════════════════════════════════════════════════════════
//  LEVEL 1: EXTENSIVE VISUAL VOCABULARY VAULT (NATIVE DICTIONARIES)
// ═══════════════════════════════════════════════════════════════
export const VISUAL_VOCABULARY = {
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
    { id: 'apple', word: 'Der Apfel', meaning: 'The Apple', category: 'Food', icon: '🍎', phonetic: 'dair ap-fel' },
    { id: 'house', word: 'Das Haus', meaning: 'The House', category: 'Home', icon: '🏠', phonetic: 'das hows' },
    { id: 'sun', word: 'Die Sonne', meaning: 'The Sun', category: 'Nature', icon: '☀️', phonetic: 'dee zon-neh' }
  ],
  es: [
    { id: 'cat', word: 'El Gato', meaning: 'The Cat', category: 'Animals', icon: '🐱', phonetic: 'el gah-toh' },
    { id: 'dog', word: 'El Perro', meaning: 'The Dog', category: 'Animals', icon: '🐕', phonetic: 'el peh-rroh' },
    { id: 'apple', word: 'La Manzana', meaning: 'The Apple', category: 'Food', icon: '🍎', phonetic: 'lah mahn-sah-nah' },
    { id: 'house', word: 'La Casa', meaning: 'The House', category: 'Home', icon: '🏠', phonetic: 'lah kah-sah' },
    { id: 'sun', word: 'El Sol', meaning: 'The Sun', category: 'Nature', icon: '☀️', phonetic: 'el sohl' }
  ],
  it: [
    { id: 'cat', word: 'Il Gatto', meaning: 'The Cat', category: 'Animals', icon: '🐱', phonetic: 'eel gat-to' },
    { id: 'dog', word: 'Il Cane', meaning: 'The Dog', category: 'Animals', icon: '🐕', phonetic: 'eel ka-ne' },
    { id: 'apple', word: 'La Mela', meaning: 'The Apple', category: 'Food', icon: '🍎', phonetic: 'la me-la' },
    { id: 'house', word: 'La Casa', meaning: 'The House', category: 'Home', icon: '🏠', phonetic: 'la ka-sa' },
    { id: 'sun', word: 'Il Sole', meaning: 'The Sun', category: 'Nature', icon: '☀️', phonetic: 'eel so-le' }
  ],
  ru: [
    { id: 'cat', word: 'Кот (Kot)', meaning: 'The Cat', category: 'Animals', icon: '🐱', phonetic: 'kot' },
    { id: 'dog', word: 'Собака (Sobaka)', meaning: 'The Dog', category: 'Animals', icon: '🐕', phonetic: 'so-ba-ka' },
    { id: 'apple', word: 'Яблоко (Yabloko)', meaning: 'The Apple', category: 'Food', icon: '🍎', phonetic: 'ya-blo-ko' },
    { id: 'house', word: 'Дом (Dom)', meaning: 'The House', category: 'Home', icon: '🏠', phonetic: 'dom' },
    { id: 'sun', word: 'Солнце (Solntse)', meaning: 'The Sun', category: 'Nature', icon: '☀️', phonetic: 'soln-tse' }
  ],
  pt: [
    { id: 'cat', word: 'O Gato', meaning: 'The Cat', category: 'Animals', icon: '🐱', phonetic: 'oo gah-too' },
    { id: 'dog', word: 'O Cão', meaning: 'The Dog', category: 'Animals', icon: '🐕', phonetic: 'oo kow' },
    { id: 'apple', word: 'A Maçã', meaning: 'The Apple', category: 'Food', icon: '🍎', phonetic: 'ah mah-saw' },
    { id: 'house', word: 'A Casa', meaning: 'The House', category: 'Home', icon: '🏠', phonetic: 'ah kah-sah' },
    { id: 'sun', word: 'O Sol', meaning: 'The Sun', category: 'Nature', icon: '☀️', phonetic: 'oo saul' }
  ],
  hi: [
    { id: 'cat', word: 'बिल्ली (Billi)', meaning: 'The Cat', category: 'Animals', icon: '🐱', phonetic: 'bil-lee' },
    { id: 'dog', word: 'कुत्ता (Kutta)', meaning: 'The Dog', category: 'Animals', icon: '🐕', phonetic: 'kut-taa' },
    { id: 'apple', word: 'सेब (Seb)', meaning: 'The Apple', category: 'Food', icon: '🍎', phonetic: 'sayb' },
    { id: 'house', word: 'घर (Ghar)', meaning: 'The House', category: 'Home', icon: '🏠', phonetic: 'ghar' },
    { id: 'sun', word: 'सूरज (Suraj)', meaning: 'The Sun', category: 'Nature', icon: '☀️', phonetic: 'soo-raj' }
  ],
  ja: [
    { id: 'cat', word: '猫 (Neko)', meaning: 'The Cat', category: 'Animals', icon: '🐱', phonetic: 'neh-koh' },
    { id: 'dog', word: '犬 (Inu)', meaning: 'The Dog', category: 'Animals', icon: '🐕', phonetic: 'ee-noo' },
    { id: 'apple', word: 'りんご (Ringo)', meaning: 'The Apple', category: 'Food', icon: '🍎', phonetic: 'reen-goh' },
    { id: 'sun', word: '太陽 (Taiyou)', meaning: 'The Sun', category: 'Nature', icon: '☀️', phonetic: 'ta-ee-yoh' }
  ],
  zh: [
    { id: 'cat', word: '猫 (Māo)', meaning: 'The Cat', category: 'Animals', icon: '🐱', phonetic: 'mow' },
    { id: 'dog', word: '狗 (Gǒu)', meaning: 'The Dog', category: 'Animals', icon: '🐕', phonetic: 'gow' },
    { id: 'apple', word: '苹果 (Píngguǒ)', meaning: 'The Apple', category: 'Food', icon: '🍎', phonetic: 'ping gwo' },
    { id: 'sun', word: '太阳 (Tàiyáng)', meaning: 'The Sun', category: 'Nature', icon: '☀️', phonetic: 'tie yang' }
  ],
  ko: [
    { id: 'cat', word: '고양이 (Goyangi)', meaning: 'The Cat', category: 'Animals', icon: '🐱', phonetic: 'go-yang-i' },
    { id: 'dog', word: '개 (Gae)', meaning: 'The Dog', category: 'Animals', icon: '🐕', phonetic: 'gae' },
    { id: 'apple', word: '사과 (Sagwa)', meaning: 'The Apple', category: 'Food', icon: '🍎', phonetic: 'sah-gwah' }
  ],
  ar: [
    { id: 'cat', word: 'قط (Qitt)', meaning: 'The Cat', category: 'Animals', icon: '🐱', phonetic: 'qitt' },
    { id: 'dog', word: 'كلب (Kalb)', meaning: 'The Dog', category: 'Animals', icon: '🐕', phonetic: 'kalb' },
    { id: 'apple', word: 'تفاحة (Tuffaha)', meaning: 'The Apple', category: 'Food', icon: '🍎', phonetic: 'tuf-fa-ha' }
  ],
  ta: [
    { id: 'cat', word: 'பூனை (Poonai)', meaning: 'The Cat', category: 'Animals', icon: '🐱', phonetic: 'poo-nai' },
    { id: 'dog', word: 'நாய் (Naai)', meaning: 'The Dog', category: 'Animals', icon: '🐕', phonetic: 'naai' }
  ]
};
