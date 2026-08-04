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
    { char: 'ج', name: 'jeem', type: 'Consonant', ipa: '/d͡ʒ/', mnemonic: 'Camel belly dot', example: 'جمل 🐪' },
    { char: 'ح', name: 'haa', type: 'Consonant', ipa: '/ħ/', mnemonic: 'Clean wave', example: 'حصان 🐎' },
    { char: 'خ', name: 'khaa', type: 'Consonant', ipa: '/x/', mnemonic: 'Chef hat dot', example: 'خبز 🍞' }
  ],
  ru: [
    { char: 'А', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'Apple', example: 'Арбуз 🍉' },
    { char: 'Б', name: 'be', type: 'Consonant', ipa: '/b/', mnemonic: 'Drum', example: 'Банан 🍌' },
    { char: 'В', name: 've', type: 'Consonant', ipa: '/v/', mnemonic: 'Wolf', example: 'Волк 🐺' },
    { char: 'Г', name: 'ge', type: 'Consonant', ipa: '/g/', mnemonic: 'Mushroom', example: 'Гриб 🍄' },
    { char: 'Д', name: 'de', type: 'Consonant', ipa: '/d/', mnemonic: 'House', example: 'Дом 🏠' }
  ],
  uk: [
    { char: 'А', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'Apple', example: 'Ананас 🍍' },
    { char: 'Б', name: 'be', type: 'Consonant', ipa: '/b/', mnemonic: 'Banana', example: 'Банан 🍌' },
    { char: 'В', name: 've', type: 'Consonant', ipa: '/v/', mnemonic: 'Water', example: 'Вода 💧' }
  ],
  el: [
    { char: 'Α', name: 'Alpha', type: 'Vowel', ipa: '/a/', mnemonic: 'Alpha', example: 'Αστέρι ⭐️' },
    { char: 'Β', name: 'Beta', type: 'Consonant', ipa: '/v/', mnemonic: 'Beta', example: 'Βιβλίο 📖' },
    { char: 'Γ', name: 'Gamma', type: 'Consonant', ipa: '/ɣ/', mnemonic: 'Gamma', example: 'Γάτα 🐱' }
  ],
  th: [
    { char: 'ก', name: 'Gor Kai', type: 'Consonant', ipa: '/k/', mnemonic: 'Chicken', example: 'ไก่ 🐔' },
    { char: 'ข', name: 'Khor Khai', type: 'Consonant', ipa: '/kʰ/', mnemonic: 'Egg', example: 'ไข่ 🥚' }
  ],
  bn: [
    { char: 'অ', name: 'o', type: 'Vowel', ipa: '/ɔ/', mnemonic: 'Mango', example: 'আম 🥭' },
    { char: 'আ', name: 'aa', type: 'Vowel', ipa: '/a/', mnemonic: 'Sky', example: 'আকাশ ☁️' }
  ],
  te: [
    { char: 'అ', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'Mother', example: 'అమ్మ 👩' },
    { char: 'ఆ', name: 'aa', type: 'Vowel', ipa: '/aː/', mnemonic: 'Cow', example: 'ఆవు 🐄' }
  ],
  mr: [
    { char: 'अ', name: 'a', type: 'Vowel', ipa: '/ə/', mnemonic: 'Pineapple', example: 'अननस 🍍' },
    { char: 'आ', name: 'aa', type: 'Vowel', ipa: '/aː/', mnemonic: 'Mango', example: 'आंबा 🥭' }
  ],
  gu: [
    { char: 'અ', name: 'a', type: 'Vowel', ipa: '/ə/', mnemonic: 'Pomegranate', example: 'ડાળમ 🍎' },
    { char: 'આ', name: 'aa', type: 'Vowel', ipa: '/aː/', mnemonic: 'Mango', example: 'કેરી 🥭' }
  ],
  ml: [
    { char: 'அ', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'Elephant', example: 'ആന 🐘' }
  ],
  kn: [
    { char: 'ಅ', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'Mother', example: 'ಅಮ್ಮ 👩' }
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
//  LEVEL 4: MULTI-PANEL GRAPHIC NOVEL NARRATIVE STORIES (NATIVE FOR EVERY SINGLE LANGUAGE)
// ═══════════════════════════════════════════════════════════════
export const GRAPHIC_NOVEL_STORIES = {
  fr: [
    {
      title: "Épisode 1: Le Mystère du Jardin Magique (Quest for Magic Garden)",
      panels: [
        { speaker: "Poly Parrot 🦜", speech: "Bonjour les amis! Aujourd'hui, nous explorons le jardin magique!", translation: "Hello friends! Today we explore the magic garden!" },
        { speaker: "Dino 🦖", speech: "Regarde ces belles pommes et fleurs colorées!", translation: "Look at these beautiful apples and colorful flowers!" },
        { speaker: "Wise Owl 🦉", speech: "Bienvenue petits aventuriers! Prenez cette clé dorée.", translation: "Welcome little adventurers! Take this golden key." },
        { speaker: "Poly Parrot 🦜", speech: "Merci! Maintenant, ouvrons la porte secrète du château!", translation: "Thank you! Now let's open the secret castle door!" }
      ]
    }
  ],
  de: [
    {
      title: "Episode 1: Das Geheimnis des Zauberwalds (Mystery of Magic Forest)",
      panels: [
        { speaker: "Poly Parrot 🦜", speech: "Hallo Freunde! Heute erkunden wir den magischen Wald!", translation: "Hello friends! Today we explore the magic forest!" },
        { speaker: "Dino 🦖", speech: "Wollte schon immer frische Äpfel und Blumen sehen!", translation: "Always wanted to see fresh apples and flowers!" },
        { speaker: "Wise Owl 🦉", speech: "Willkommen! Hier ist der goldene Schlüssel.", translation: "Welcome! Here is the golden key." }
      ]
    }
  ],
  es: [
    {
      title: "Episodio 1: El Misterio del Jardín Mágico (Quest for Magic Garden)",
      panels: [
        { speaker: "Poly Parrot 🦜", speech: "¡Hola amigos! Hoy vamos a explorar el Jardín Mágico.", translation: "Hello friends! Today we are exploring the Magic Garden." },
        { speaker: "Dino 🦖", speech: "¡Fantástico! ¡Mira esas deliciosas manzanas y flores brillantes!", translation: "Fantastic! Look at those delicious apples and bright flowers!" },
        { speaker: "Wise Owl 🦉", speech: "¡Bienvenidos aventureros! Tomen esta llave dorada.", translation: "Welcome adventurers! Take this golden key." },
        { speaker: "Poly Parrot 🦜", speech: "¡Gracias! ¡Juntos abriremos la puerta secreta!", translation: "Thank you! Together we will open the secret door!" }
      ]
    }
  ],
  hi: [
    {
      title: "Episode 1: जादुई बगीचे की रहस्यमयी यात्रा (The Quest for the Magic Garden)",
      panels: [
        { speaker: "Poly Parrot 🦜", speech: "नमस्ते दोस्तों! आज हम एक जादुई गुप्त बगीचे की खोज में जा रहे हैं!", translation: "Hello friends! Today we are going on a quest for a secret magic garden!" },
        { speaker: "Dino 🦖", speech: "वाह! क्या वहाँ मीठे फल और सुंदर नदियाँ होंगी?", translation: "Wow! Will there be sweet fruits and beautiful rivers there?" },
        { speaker: "Wise Owl 🦉", speech: "रुकिए! नदी पार करने के लिए आपको इस चाबी का सही उपयोग करना होगा।", translation: "Stop! To cross the river you must use this key correctly." },
        { speaker: "Poly Parrot 🦜", speech: "बधाई हो! देखो, जादुई बगीचे का दरवाजा खुल गया है!", translation: "Congratulations! Look, the door to the magic garden is open!" }
      ]
    }
  ],
  ja: [
    {
      title: "Episode 1: 魔法の森の大冒険 (Great Adventure in the Magic Forest)",
      panels: [
        { speaker: "Poly Parrot 🦜", speech: "こんにちは！今日は魔法の森を探検しましょう！", translation: "Hello! Let's explore the magic forest today!" },
        { speaker: "Dino 🦖", speech: "すごい！きれいな川と果物が見えます！", translation: "Amazing! I can see a pretty river and fruits!" },
        { speaker: "Wise Owl 🦉", speech: "ようこそ！この古い鍵を使ってドアを開けてください。", translation: "Welcome! Use this old key to open the door." }
      ]
    }
  ],
  zh: [
    {
      title: "第一集：魔法花园大冒险 (The Magic Garden Adventure)",
      panels: [
        { speaker: "Poly Parrot 🦜", speech: "你好朋友们！今天我们要去探索魔法花园！", translation: "Hello friends! Today we are exploring the magic garden!" },
        { speaker: "Dino 🦖", speech: "太棒了！我看到了新鲜的苹果和漂亮的鲜花！", translation: "Great! I see fresh apples and pretty flowers!" }
      ]
    }
  ],
  ar: [
    {
      title: "الحلقة 1: مغامرة الحديقة السحرية (The Magic Garden Adventure)",
      panels: [
        { speaker: "Poly Parrot 🦜", speech: "مرحباً يا أصدقاء! اليوم سنستكشف الحديقة السحرية!", translation: "Hello friends! Today we explore the magic garden!" },
        { speaker: "Dino 🦖", speech: "يا رائع! أرى الفواكه اللذيذة والزهور الملونة!", translation: "Awesome! I see delicious fruits and colorful flowers!" }
      ]
    }
  ],
  it: [
    {
      title: "Episodio 1: Il Mistero del Giardino Magico (Magic Garden Mystery)",
      panels: [
        { speaker: "Poly Parrot 🦜", speech: "Ciao amici! Oggi esploriamo il giardino magico!", translation: "Hello friends! Today we explore the magic garden!" },
        { speaker: "Dino 🦖", speech: "Fantastico! Guarda queste belle mele e fiori colorati!", translation: "Fantastic! Look at these beautiful apples and colorful flowers!" }
      ]
    }
  ],
  ru: [
    {
      title: "Эпизод 1: Тайна Волшебного Сада (Mystery of the Magic Garden)",
      panels: [
        { speaker: "Poly Parrot 🦜", speech: "Привет друзья! Сегодня мы исследуем волшебный сад!", translation: "Hello friends! Today we explore the magic garden!" },
        { speaker: "Dino 🦖", speech: "Ура! Я вижу спелые яблоки и прекрасные цветы!", translation: "Hooray! I see ripe apples and beautiful flowers!" }
      ]
    }
  ],
  ko: [
    {
      title: "에피소드 1: 마법의 정원 대모험 (Magic Garden Adventure)",
      panels: [
        { speaker: "Poly Parrot 🦜", speech: "안녕 친구들! 오늘은 마법의 정원을 탐험해 볼까요?", translation: "Hello friends! Shall we explore the magic garden today?" },
        { speaker: "Dino 🦖", speech: "와! 신난다! 맛있는 사과와 예쁜 꽃들이 보여요!", translation: "Wow! Exciting! I see delicious apples and pretty flowers!" }
      ]
    }
  ],
  pt: [
    {
      title: "Episódio 1: O Mistério do Jardim Mágico (Magic Garden Mystery)",
      panels: [
        { speaker: "Poly Parrot 🦜", speech: "Olá amigos! Hoje vamos explorar o jardim mágico!", translation: "Hello friends! Today we explore the magic garden!" },
        { speaker: "Dino 🦖", speech: "Que legal! Veja essas maçãs saborosas e flores bonitas!", translation: "So cool! See these tasty apples and pretty flowers!" }
      ]
    }
  ],
  ta: [
    {
      title: "அத்தியாயம் 1: மாயத் தோட்டத்தின் பயணம் (Magic Garden Journey)",
      panels: [
        { speaker: "Poly Parrot 🦜", speech: "வணக்கம் நண்பர்களே! இன்று நாம் மாயத் தோட்டம் செல்வோம்!", translation: "Hello friends! Today we will go to the magic garden!" },
        { speaker: "Dino 🦖", speech: "அற்புதம்! அங்கே பல இனிப்பான பழங்கள் உள்ளன!", translation: "Wonderful! There are many sweet fruits there!" }
      ]
    }
  ]
};

// ═══════════════════════════════════════════════════════════════
//  LEVEL 0.5: NATIVE NUMBERS & COUNTING
// ═══════════════════════════════════════════════════════════════
export const LANGUAGE_NUMBERS = {
  hi: [
    { num: 1, native: '१', word: 'एक (Ek)', phonetic: 'ek' },
    { num: 2, native: '२', word: 'दो (Do)', phonetic: 'do' },
    { num: 3, native: '३', word: 'तीन (Teen)', phonetic: 'teen' },
    { num: 4, native: '४', word: 'चार (Chaar)', phonetic: 'chaar' },
    { num: 5, native: '५', word: 'पाँच (Paanch)', phonetic: 'paanch' },
    { num: 10, native: '१०', word: 'दस (Das)', phonetic: 'das' }
  ],
  fr: [
    { num: 1, native: '1', word: 'Un', phonetic: 'uhn' },
    { num: 2, native: '2', word: 'Deux', phonetic: 'duh' },
    { num: 3, native: '3', word: 'Trois', phonetic: 'trwah' },
    { num: 4, native: '4', word: 'Quatre', phonetic: 'kat-ruh' },
    { num: 5, native: '5', word: 'Cinq', phonetic: 'sank' }
  ],
  es: [
    { num: 1, native: '1', word: 'Uno', phonetic: 'oo-noh' },
    { num: 2, native: '2', word: 'Dos', phonetic: 'dohs' },
    { num: 3, native: '3', word: 'Tres', phonetic: 'trays' },
    { num: 4, native: '4', word: 'Cuatro', phonetic: 'kwah-troh' },
    { num: 5, native: '5', word: 'Cinco', phonetic: 'seen-koh' }
  ]
};

// ═══════════════════════════════════════════════════════════════
//  LEVEL 2.5: SITUATIONAL PHRASEBOOK
// ═══════════════════════════════════════════════════════════════
export const SITUATIONAL_PHRASEBOOK = {
  fr: [
    {
      category: '🍽️ Restaurant & Food',
      phrases: [
        { native: 'Une table pour deux, s\'il vous plaît.', english: 'A table for two, please.', phonetic: 'oon tah-bluh poor duh' },
        { native: 'Combien ça coûte?', english: 'How much does this cost?', phonetic: 'kom-byan sah koot' }
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

// ═══════════════════════════════════════════════════════════════
//  LEVEL 2: ACTION VERBS & GREETINGS
// ═══════════════════════════════════════════════════════════════
export const ACTION_VERBS_GREETINGS = {
  fr: [
    { phrase: 'Bonjour!', meaning: 'Hello / Good day!', icon: '👋', phonetic: 'bon-zhoor', type: 'Greeting' },
    { phrase: 'Merci beaucoup!', meaning: 'Thank you very much!', icon: '🙏', phonetic: 'mair-see boh-koo', type: 'Greeting' },
    { phrase: 'Au revoir!', meaning: 'Goodbye!', icon: '🙋', phonetic: 'oh ruh-vwar', type: 'Greeting' },
    { phrase: 'Courir', meaning: 'To Run', icon: '🏃', phonetic: 'koo-reer', type: 'Action Verb' }
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
  ]
};

// ═══════════════════════════════════════════════════════════════
//  LEVEL 1: EXTENSIVE VISUAL VOCABULARY VAULT
// ═══════════════════════════════════════════════════════════════
export const VISUAL_VOCABULARY = {
  fr: [
    { id: 'cat', word: 'Le Chat', meaning: 'The Cat', category: 'Animals', icon: '🐱', phonetic: 'luh shah' },
    { id: 'dog', word: 'Le Chien', meaning: 'The Dog', category: 'Animals', icon: '🐕', phonetic: 'luh shyan' },
    { id: 'apple', word: 'La Pomme', meaning: 'The Apple', category: 'Food', icon: '🍎', phonetic: 'lah pom' },
    { id: 'house', word: 'La Maison', meaning: 'The House', category: 'Home', icon: '🏠', phonetic: 'lah may-zon' },
    { id: 'sun', word: 'Le Soleil', meaning: 'The Sun', category: 'Nature', icon: '☀️', phonetic: 'luh soh-lay' }
  ],
  es: [
    { id: 'cat', word: 'El Gato', meaning: 'The Cat', category: 'Animals', icon: '🐱', phonetic: 'el gah-toh' },
    { id: 'dog', word: 'El Perro', meaning: 'The Dog', category: 'Animals', icon: '🐕', phonetic: 'el peh-rroh' },
    { id: 'apple', word: 'La Manzana', meaning: 'The Apple', category: 'Food', icon: '🍎', phonetic: 'lah mahn-sah-nah' },
    { id: 'house', word: 'La Casa', meaning: 'The House', category: 'Home', icon: '🏠', phonetic: 'lah kah-sah' },
    { id: 'sun', word: 'El Sol', meaning: 'The Sun', category: 'Nature', icon: '☀️', phonetic: 'el sohl' }
  ],
  hi: [
    { id: 'cat', word: 'बिल्ली (Billi)', meaning: 'The Cat', category: 'Animals', icon: '🐱', phonetic: 'bil-lee' },
    { id: 'dog', word: 'कुत्ता (Kutta)', meaning: 'The Dog', category: 'Animals', icon: '🐕', phonetic: 'kut-taa' },
    { id: 'apple', word: 'सेब (Seb)', meaning: 'The Apple', category: 'Food', icon: '🍎', phonetic: 'sayb' },
    { id: 'house', word: 'घर (Ghar)', meaning: 'The House', category: 'Home', icon: '🏠', phonetic: 'ghar' },
    { id: 'sun', word: 'सूरज (Suraj)', meaning: 'The Sun', category: 'Nature', icon: '☀️', phonetic: 'soo-raj' }
  ]
};

// ═══════════════════════════════════════════════════════════════
//  LEVEL 3: COLOR-CODED LEGO GRAMMAR SENTENCES
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
