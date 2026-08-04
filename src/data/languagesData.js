// ═══════════════════════════════════════════════════════════════
//  POLYGLOT PLANET - MASSIVE GLOBAL LANGUAGES ACADEMY (FULL CHARACTER SETS)
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
  { code: 'kn', name: 'Kannada', flag: '🇮🇳', native: 'കன்னட / ಕನ್ನಡ', family: 'Dravidian' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩', native: 'Bahasa Indonesia', family: 'Austronesian' },
  { code: 'tl', name: 'Tagalog', flag: '🇵🇭', native: 'Tagalog', family: 'Austronesian' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦', native: 'Українська', family: 'Slavic' }
];

// Helper Latin Alphabet Generator for Romance/Germanic languages (Full 26 letters)
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

  // --- GUJARATI: FULL VOWELS + CONSONANTS ---
  gu: [
    // Vowels (Swar)
    { char: 'અ', name: 'a', type: 'Vowel', ipa: '/ə/', mnemonic: 'Pomegranate', example: 'દાડમ 🍎' },
    { char: 'આ', name: 'aa', type: 'Vowel', ipa: '/aː/', mnemonic: 'Mango', example: 'કેરી 🥭' },
    { char: 'ઇ', name: 'i', type: 'Vowel', ipa: '/ɪ/', mnemonic: 'Tamarind', example: 'આમલી 🍬' },
    { char: 'ઈ', name: 'ee', type: 'Vowel', ipa: '/iː/', mnemonic: 'Sugarcane', example: 'શેરડી 🌾' },
    { char: 'ઉ', name: 'u', type: 'Vowel', ipa: '/ʊ/', mnemonic: 'Owl', example: 'ઘુવડ 🦉' },
    { char: 'ઊ', name: 'oo', type: 'Vowel', ipa: '/uː/', mnemonic: 'Wool', example: 'ઊન 🧶' },
    { char: 'એ', name: 'e', type: 'Vowel', ipa: '/eː/', mnemonic: 'Heel', example: 'એડી 🦶' },
    { char: 'ઐ', name: 'ai', type: 'Vowel', ipa: '/ɛː/', mnemonic: 'Spectacles', example: 'ચશ્મા 👓' },
    { char: 'ઓ', name: 'o', type: 'Vowel', ipa: '/oː/', mnemonic: 'Mortar', example: 'ખાંડણી 🥣' },
    { char: 'ઔ', name: 'au', type: 'Vowel', ipa: '/ɔː/', mnemonic: 'Medicine', example: 'દવા 💊' },
    { char: 'અં', name: 'ang', type: 'Vowel', ipa: '/əŋ/', mnemonic: 'Grapes', example: 'દ્રાક્ષ 🍇' },
    { char: 'અঃ', name: 'ah', type: 'Vowel', ipa: '/əh/', mnemonic: 'Smile', example: 'અંતઃ 😃' },

    // Consonants (Vyanjan)
    { char: 'ક', name: 'ka', type: 'Consonant', ipa: '/kə/', mnemonic: 'Lotus', example: 'કમળ 🪷' },
    { char: 'ખ', name: 'kha', type: 'Consonant', ipa: '/kʰə/', mnemonic: 'Rabbit', example: 'સસલું 🐇' },
    { char: 'ગ', name: 'ga', type: 'Consonant', ipa: '/ɡə/', mnemonic: 'Elephant', example: 'હાથી 🐘' },
    { char: 'ઘ', name: 'gha', type: 'Consonant', ipa: '/ɡʱə/', mnemonic: 'House', example: 'ઘર 🏠' },
    { char: 'ચ', name: 'cha', type: 'Consonant', ipa: '/t͡ʃə/', mnemonic: 'Spoon', example: 'ચમચી 🥄' },
    { char: 'છ', name: 'chha', type: 'Consonant', ipa: '/t͡ʃʰə/', mnemonic: 'Umbrella', example: 'છત્રી ☂️' },
    { char: 'જ', name: 'ja', type: 'Consonant', ipa: '/d͡ʒə/', mnemonic: 'Ship', example: 'જહાજ 🚢' },
    { char: 'ઝ', name: 'jha', type: 'Consonant', ipa: '/d͡ʒʱə/', mnemonic: 'Flag', example: 'ઝંડો 🚩' },
    { char: 'ટ', name: 'ta', type: 'Consonant', ipa: '/ʈə/', mnemonic: 'Tomato', example: 'ટમેટું 🍅' },
    { char: 'ઠ', name: 'tha', type: 'Consonant', ipa: '/ʈʰə/', mnemonic: 'Stamp', example: 'ઠપ્પો 🏷️' },
    { char: 'ડ', name: 'da', type: 'Consonant', ipa: '/ɖə/', mnemonic: 'Drum', example: 'ડમરુ 🥁' },
    { char: 'ઢ', name: 'dha', type: 'Consonant', ipa: '/ɖʱə/', mnemonic: 'Shield', example: 'ઢાલ 🛡️' },
    { char: 'ણ', name: 'rna', type: 'Consonant', ipa: '/ɳə/', mnemonic: 'Arrow', example: 'બાણ 🏹' },
    { char: 'ત', name: 'ta', type: 'Consonant', ipa: '/t̪ə/', mnemonic: 'Watermelon', example: 'તરબૂચ 🍉' },
    { char: 'થ', name: 'tha', type: 'Consonant', ipa: '/t̪ʰə/', mnemonic: 'Plate', example: 'થાળી 🍽️' },
    { char: 'દ', name: 'da', type: 'Consonant', ipa: '/d̪ə/', mnemonic: 'Ink', example: 'દવાત 🖊️' },
    { char: 'ધ', name: 'dha', type: 'Consonant', ipa: '/d̪ʱə/', mnemonic: 'Bow', example: 'ધનુષ 🏹' },
    { char: 'ન', name: 'na', type: 'Consonant', ipa: '/n̪ə/', mnemonic: 'Tap', example: 'નળ 🚰' },
    { char: 'પ', name: 'pa', type: 'Consonant', ipa: '/pə/', mnemonic: 'Kite', example: 'પતંગ 🪁' },
    { char: 'ફ', name: 'pha', type: 'Consonant', ipa: '/pʰə/', mnemonic: 'Fruit', example: 'ફળ 🍎' },
    { char: 'બ', name: 'ba', type: 'Consonant', ipa: '/bə/', mnemonic: 'Duck', example: 'બતક 🦆' },
    { char: 'ભ', name: 'bha', type: 'Consonant', ipa: '/bʱə/', mnemonic: 'Bear', example: 'રીંછ 🐻' },
    { char: 'મ', name: 'ma', type: 'Consonant', ipa: '/mə/', mnemonic: 'Fish', example: 'માછલી 🐟' },
    { char: 'ય', name: 'ya', type: 'Consonant', ipa: '/jə/', mnemonic: 'Yagya', example: 'યજ્ઞ 🔥' },
    { char: 'ર', name: 'ra', type: 'Consonant', ipa: '/rə/', mnemonic: 'Chariot', example: 'રથ 🛞' },
    { char: 'લ', name: 'la', type: 'Consonant', ipa: '/lə/', mnemonic: 'Top', example: 'ભમરડો 🪀' },
    { char: 'વ', name: 'va', type: 'Consonant', ipa: '/ʋə/', mnemonic: 'Tree', example: 'વૃક્ષ 🌳' },
    { char: 'શ', name: 'sha', type: 'Consonant', ipa: '/ʃə/', mnemonic: 'Turnip', example: 'શાક 🥗' },
    { char: 'સ', name: 'sa', type: 'Consonant', ipa: '/sə/', mnemonic: 'Snake', example: 'સાપ 🐍' },
    { char: 'હ', name: 'ha', type: 'Consonant', ipa: '/ɦə/', mnemonic: 'Hands', example: 'હાથ ✋' },
    { char: 'ળ', name: 'la (retroflex)', type: 'Consonant', ipa: '/ɭə/', mnemonic: 'Ring', example: 'વીંટી 💍' }
  ],

  // --- MARATHI: FULL VOWELS + CONSONANTS ---
  mr: [
    { char: 'अ', name: 'a', type: 'Vowel', ipa: '/ə/', mnemonic: 'Pineapple', example: 'अननस 🍍' },
    { char: 'आ', name: 'aa', type: 'Vowel', ipa: '/aː/', mnemonic: 'Mango', example: 'आंबा 🥭' },
    { char: 'इ', name: 'i', type: 'Vowel', ipa: '/ɪ/', mnemonic: 'Tamarind', example: 'चिंच 🍬' },
    { char: 'ई', name: 'ee', type: 'Vowel', ipa: '/iː/', mnemonic: 'Building', example: 'इमारत 🏢' },
    { char: 'उ', name: 'u', type: 'Vowel', ipa: '/ʊ/', mnemonic: 'Owl', example: 'उल्लू 🦉' },
    { char: 'ऊ', name: 'oo', type: 'Vowel', ipa: '/uː/', mnemonic: 'Sugarcane', example: 'ऊस 🌾' },
    { char: 'ए', name: 'e', type: 'Vowel', ipa: '/eː/', mnemonic: 'Heel', example: 'एडी 🦶' },
    { char: 'ऐ', name: 'ai', type: 'Vowel', ipa: '/ɛː/', mnemonic: 'Iron', example: 'ऐरण 🔨' },
    { char: 'ओ', name: 'o', type: 'Vowel', ipa: '/oː/', mnemonic: 'Stream', example: 'ओढा 🌊' },
    { char: 'औ', name: 'au', type: 'Vowel', ipa: '/ɔː/', mnemonic: 'Medicine', example: 'औषध 💊' },
    { char: 'क', name: 'ka', type: 'Consonant', ipa: '/kə/', mnemonic: 'Cup', example: 'कप ☕' },
    { char: 'ख', name: 'kha', type: 'Consonant', ipa: '/kʰə/', mnemonic: 'Window', example: 'खिडकी 🪟' },
    { char: 'ग', name: 'ga', type: 'Consonant', ipa: '/ɡə/', mnemonic: 'Ganesh', example: 'गणपती 🛕' },
    { char: 'घ', name: 'gha', type: 'Consonant', ipa: '/ɡʱə/', mnemonic: 'House', example: 'घर 🏠' },
    { char: 'च', name: 'cha', type: 'Consonant', ipa: '/t͡ʃə/', mnemonic: 'Spoon', example: 'चाकू 🔪' },
    { char: 'छ', name: 'chha', type: 'Consonant', ipa: '/t͡ʃʰə/', mnemonic: 'Umbrella', example: 'छत्री ☂️' },
    { char: 'ज', name: 'ja', type: 'Consonant', ipa: '/d͡ʒə/', mnemonic: 'Ship', example: 'जहाज 🚢' },
    { char: 'झ', name: 'jha', type: 'Consonant', ipa: '/d͡ʒʱə/', mnemonic: 'Tree', example: 'झाड 🌳' },
    { char: 'ट', name: 'ta', type: 'Consonant', ipa: '/ʈə/', mnemonic: 'Tomato', example: 'टोमॅटो 🍅' },
    { char: 'ठ', name: 'tha', type: 'Consonant', ipa: '/ʈʰə/', mnemonic: 'Stamp', example: 'ठप्पा 🏷️' },
    { char: 'ड', name: 'da', type: 'Consonant', ipa: '/ɖə/', mnemonic: 'Box', example: 'डबा 📦' },
    { char: 'ढ', name: 'dha', type: 'Consonant', ipa: '/ɖʱə/', mnemonic: 'Cloud', example: 'ढग ☁️' },
    { char: 'ण', name: 'rna', type: 'Consonant', ipa: '/ɳə/', mnemonic: 'Arrow', example: 'बाण 🏹' },
    { char: 'त', name: 'ta', type: 'Consonant', ipa: '/t̪ə/', mnemonic: 'Balance', example: 'तराजू ⚖️' },
    { char: 'थ', name: 'tha', type: 'Consonant', ipa: '/t̪ʰə/', mnemonic: 'Thermos', example: 'थर्मस 🍶' },
    { char: 'द', name: 'da', type: 'Consonant', ipa: '/d̪ə/', mnemonic: 'Door', example: 'दार 🚪' },
    { char: 'ध', name: 'dha', type: 'Consonant', ipa: '/d̪ʱə/', mnemonic: 'Stream', example: 'धबधबा 🌊' },
    { char: 'न', name: 'na', type: 'Consonant', ipa: '/n̪ə/', mnemonic: 'Tap', example: 'नळ 🚰' },
    { char: 'प', name: 'pa', type: 'Consonant', ipa: '/pə/', mnemonic: 'Kite', example: 'पतंग 🪁' },
    { char: 'फ', name: 'pha', type: 'Consonant', ipa: '/pʰə/', mnemonic: 'Fruit', example: 'फळ 🍎' },
    { char: 'ब', name: 'ba', type: 'Consonant', ipa: '/bə/', mnemonic: 'Duck', example: 'बतख 🦆' },
    { char: 'भ', name: 'bha', type: 'Consonant', ipa: '/bʱə/', mnemonic: 'Building', example: 'इमारत 🏢' },
    { char: 'म', name: 'ma', type: 'Consonant', ipa: '/mə/', mnemonic: 'Fish', example: 'मासा 🐟' },
    { char: 'य', name: 'ya', type: 'Consonant', ipa: '/jə/', mnemonic: 'Yagya', example: 'यज्ञ 🔥' },
    { char: 'र', name: 'ra', type: 'Consonant', ipa: '/rə/', mnemonic: 'Chariot', example: 'रथ 🛞' },
    { char: 'ल', name: 'la', type: 'Consonant', ipa: '/lə/', mnemonic: 'Garlic', example: 'लसूण 🧄' },
    { char: 'व', name: 'va', type: 'Consonant', ipa: '/ʋə/', mnemonic: 'Tree', example: 'वड 🌳' },
    { char: 'श', name: 'sha', type: 'Consonant', ipa: '/ʃə/', mnemonic: 'Ostrich', example: 'शहामृग 🦩' },
    { char: 'स', name: 'sa', type: 'Consonant', ipa: '/sə/', mnemonic: 'Rabbit', example: 'ससा 🐇' },
    { char: 'ह', name: 'ha', type: 'Consonant', ipa: '/ɦə/', mnemonic: 'Elephant', example: 'हत्ती 🐘' },
    { char: 'ळ', name: 'la (retroflex)', type: 'Consonant', ipa: '/ɭə/', mnemonic: 'Fruit', example: 'फळ 🍎' }
  ],

  // --- BENGALI: FULL VOWELS + CONSONANTS ---
  bn: [
    { char: 'অ', name: 'o', type: 'Vowel', ipa: '/ɔ/', mnemonic: 'Mango', example: 'আম 🥭' },
    { char: 'আ', name: 'aa', type: 'Vowel', ipa: '/a/', mnemonic: 'Sky', example: 'আকাশ ☁️' },
    { char: 'ই', name: 'i', type: 'Vowel', ipa: '/i/', mnemonic: 'Building', example: 'ইট 🧱' },
    { char: 'ঈ', name: 'ee', type: 'Vowel', ipa: '/iː/', mnemonic: 'Eagle', example: 'ঈগল 🦅' },
    { char: 'উ', name: 'u', type: 'Vowel', ipa: '/u/', mnemonic: 'Camel', example: 'উট 🐪' },
    { char: 'ঊ', name: 'oo', type: 'Vowel', ipa: '/uː/', mnemonic: 'Wave', example: 'ঊর্মি 🌊' },
    { char: 'এ', name: 'e', type: 'Vowel', ipa: '/e/', mnemonic: 'One', example: 'এক 1️⃣' },
    { char: 'ঐ', name: 'ai', type: 'Vowel', ipa: '/oi/', mnemonic: 'Elephant', example: 'ঐরাবত 🐘' },
    { char: 'ও', name: 'o', type: 'Vowel', ipa: '/o/', mnemonic: 'Medicine', example: 'ওষুধ 💊' },
    { char: 'ক', name: 'ko', type: 'Consonant', ipa: '/k/', mnemonic: 'Banana', example: 'কলা 🍌' },
    { char: 'খ', name: 'kho', type: 'Consonant', ipa: '/kʰ/', mnemonic: 'Rabbit', example: 'খরগোশ 🐇' },
    { char: 'গ', name: 'go', type: 'Consonant', ipa: '/g/', mnemonic: 'Cow', example: 'গোরু 🐄' },
    { char: 'ঘ', name: 'gho', type: 'Consonant', ipa: '/gʱ/', mnemonic: 'House', example: 'ঘর 🏠' },
    { char: 'চ', name: 'cho', type: 'Consonant', ipa: '/t͡ʃ/', mnemonic: 'Spoon', example: 'চামচ 🥄' },
    { char: 'ছ', name: 'chho', type: 'Consonant', ipa: '/t͡ʃʰ/', mnemonic: 'Umbrella', example: 'ছাতা ☂️' },
    { char: 'জ', name: 'jo', type: 'Consonant', ipa: '/d͡ʒ/', mnemonic: 'Water', example: 'জল 💧' },
    { char: 'ঝ', name: 'jho', type: 'Consonant', ipa: '/d͡ʒʱ/', mnemonic: 'Waterfall', example: 'ঝরনা 🌊' },
    { char: 'ট', name: 'to', type: 'Consonant', ipa: '/ʈ/', mnemonic: 'Tomato', example: 'টমেটো 🍅' },
    { char: 'ড', name: 'do', type: 'Consonant', ipa: '/ɖ/', mnemonic: 'Drum', example: 'ডুগডুগি 🥁' },
    { char: 'ত', name: 'to', type: 'Consonant', ipa: '/t̪/', mnemonic: 'Watermelon', example: 'তরমুজ 🍉' },
    { char: 'দ', name: 'do', type: 'Consonant', ipa: '/d̪/', mnemonic: 'Door', example: 'দরজা 🚪' },
    { char: 'ন', name: 'no', type: 'Consonant', ipa: '/n̪/', mnemonic: 'Boat', example: 'নৌকা ⛵' },
    { char: 'প', name: 'po', type: 'Consonant', ipa: '/p/', mnemonic: 'Bird', example: 'পাখি 🐦' },
    { char: 'ফ', name: 'pho', type: 'Consonant', ipa: '/pʰ/', mnemonic: 'Fruit', example: 'ফল 🍎' },
    { char: 'ব', name: 'bo', type: 'Consonant', ipa: '/b/', mnemonic: 'Book', example: 'বই 📖' },
    { char: 'ভ', name: 'bho', type: 'Consonant', ipa: '/bʱ/', mnemonic: 'Bear', example: 'ভালুক 🐻' },
    { char: 'ম', name: 'mo', type: 'Consonant', ipa: '/m/', mnemonic: 'Fish', example: 'মাছ 🐟' },
    { char: 'র', name: 'ro', type: 'Consonant', ipa: '/r/', mnemonic: 'Night', example: 'রাত 🌃' },
    { char: 'ল', name: 'lo', type: 'Consonant', ipa: '/l/', mnemonic: 'Chili', example: 'লঙ্কা 🌶️' },
    { char: 'স', name: 'so', type: 'Consonant', ipa: '/s/', mnemonic: 'Snake', example: 'সাপ 🐍' },
    { char: 'হ', name: 'ho', type: 'Consonant', ipa: '/h/', mnemonic: 'Elephant', example: 'হাতি 🐘' }
  ],

  // --- TELUGU: FULL VOWELS + CONSONANTS ---
  te: [
    { char: 'అ', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'Mother', example: 'అమ్మ 👩' },
    { char: 'ఆ', name: 'aa', type: 'Vowel', ipa: '/aː/', mnemonic: 'Cow', example: 'ఆవు 🐄' },
    { char: 'ఇ', name: 'i', type: 'Vowel', ipa: '/i/', mnemonic: 'House', example: 'ఇల్లు 🏠' },
    { char: 'ఈ', name: 'ee', type: 'Vowel', ipa: '/iː/', mnemonic: 'Feather', example: 'ఈక 🪶' },
    { char: 'ఉ', name: 'u', type: 'Vowel', ipa: '/u/', mnemonic: 'Cradle', example: 'ఉయ్యాల 🧺' },
    { char: 'ఊ', name: 'oo', type: 'Vowel', ipa: '/uː/', mnemonic: 'Village', example: 'ఊరు 🏘️' },
    { char: 'ఎ', name: 'e', type: 'Vowel', ipa: '/e/', mnemonic: 'Rat', example: 'ఎలుక 🐀' },
    { char: 'ఏ', name: 'ee', type: 'Vowel', ipa: '/eː/', mnemonic: 'Elephant', example: 'ఏనుగు 🐘' },
    { char: 'ఐ', name: 'ai', type: 'Vowel', ipa: '/ai/', mnemonic: 'Five', example: 'ఐదు 5️⃣' },
    { char: 'ఒ', name: 'o', type: 'Vowel', ipa: '/o/', mnemonic: 'Camel', example: 'ఒంటే 🐪' },
    { char: 'ఓ', name: 'oo', type: 'Vowel', ipa: '/oː/', mnemonic: 'Ship', example: 'ఓడ 🚢' },
    { char: 'క', name: 'ka', type: 'Consonant', ipa: '/k/', mnemonic: 'Lotus', example: 'కమలం 🪷' },
    { char: 'ఖ', name: 'kha', type: 'Consonant', ipa: '/kʰ/', mnemonic: 'Sword', example: 'ఖడ్గం 🗡️' },
    { char: 'గ', name: 'ga', type: 'Consonant', ipa: '/g/', mnemonic: 'Bell', example: 'గంట 🔔' },
    { char: 'ఘ', name: 'gha', type: 'Consonant', ipa: '/gʱ/', mnemonic: 'Pitcher', example: 'ఘటం 🏺' },
    { char: 'చ', name: 'cha', type: 'Consonant', ipa: '/t͡ʃ/', mnemonic: 'Moon', example: 'చందమామ 🌙' },
    { char: 'జ', name: 'ja', type: 'Consonant', ipa: '/d͡ʒ/', mnemonic: 'Flag', example: 'జెండా 🚩' },
    { char: 'ట', name: 'ta', type: 'Consonant', ipa: '/ʈ/', mnemonic: 'Tomato', example: 'టమోటా 🍅' },
    { char: 'డ', name: 'da', type: 'Consonant', ipa: '/ɖ/', mnemonic: 'Drum', example: 'డప్పు 🥁' },
    { char: 'త', name: 'ta', type: 'Consonant', ipa: '/t̪/', mnemonic: 'Head', example: 'తల 👤' },
    { char: 'ద', name: 'da', type: 'Consonant', ipa: '/d̪/', mnemonic: 'Garland', example: 'దండ 📿' },
    { char: 'న', name: 'na', type: 'Consonant', ipa: '/n̪/', mnemonic: 'Tap', example: 'నల్లా 🚰' },
    { char: 'ప', name: 'pa', type: 'Consonant', ipa: '/p/', mnemonic: 'Fruit', example: 'పండు 🍎' },
    { char: 'ఫ', name: 'pha', type: 'Consonant', ipa: '/pʰ/', mnemonic: 'Snake hood', example: 'ఫణి 🐍' },
    { char: 'బ', name: 'ba', type: 'Consonant', ipa: '/b/', mnemonic: 'Ball', example: 'బంతి ⚽' },
    { char: 'భ', name: 'bha', type: 'Consonant', ipa: '/bʱ/', mnemonic: 'Building', example: 'భవనం 🏢' },
    { char: 'మ', name: 'ma', type: 'Consonant', ipa: '/m/', mnemonic: 'Tree', example: 'మొలక 🌱' },
    { char: 'య', name: 'ya', type: 'Consonant', ipa: '/j/', mnemonic: 'Yagya', example: 'యజ్ఞం 🔥' },
    { char: 'ర', name: 'ra', type: 'Consonant', ipa: '/r/', mnemonic: 'Chariot', example: 'రథం 🛞' },
    { char: 'ల', name: 'la', type: 'Consonant', ipa: '/l/', mnemonic: 'Anchor', example: 'లంగరు ⚓' },
    { char: 'వ', name: 'va', type: 'Consonant', ipa: '/v/', mnemonic: 'Rain', example: 'వర్షం 🌧️' },
    { char: 'స', name: 'sa', type: 'Consonant', ipa: '/s/', mnemonic: 'Sun', example: 'సూర్యుడు ☀️' },
    { char: 'హ', name: 'ha', type: 'Consonant', ipa: '/h/', mnemonic: 'Swan', example: 'హంస 🦢' }
  ],

  // --- TAMIL: FULL VOWELS + CONSONANTS ---
  ta: [
    { char: 'அ', name: 'a', type: 'Vowel', ipa: '/ʌ/', mnemonic: 'Mother', example: 'அம்மா 👩' },
    { char: 'ஆ', name: 'aa', type: 'Vowel', ipa: '/aː/', mnemonic: 'Goat', example: 'ஆடு 🐐' },
    { char: 'இ', name: 'i', type: 'Vowel', ipa: '/i/', mnemonic: 'Leaf', example: 'இலை 🍃' },
    { char: 'ஈ', name: 'ee', type: 'Vowel', ipa: '/iː/', mnemonic: 'Fly', example: 'ஈ 🪰' },
    { char: 'உ', name: 'u', type: 'Vowel', ipa: '/u/', mnemonic: 'World', example: 'உலகம் 🌍' },
    { char: 'ஊ', name: 'oo', type: 'Vowel', ipa: '/uː/', mnemonic: 'Swing', example: 'ஊஞ்சல் 🧺' },
    { char: 'எ', name: 'e', type: 'Vowel', ipa: '/e/', mnemonic: 'Rat', example: 'எலி 🐀' },
    { char: 'ஏ', name: 'ee', type: 'Vowel', ipa: '/eː/', mnemonic: 'Plow', example: 'ஏர் 🚜' },
    { char: 'ஐ', name: 'ai', type: 'Vowel', ipa: '/ai/', mnemonic: 'Five', example: 'ஐந்து 5️⃣' },
    { char: 'ஒ', name: 'o', type: 'Vowel', ipa: '/o/', mnemonic: 'Camel', example: 'ஒட்டகம் 🐪' },
    { char: 'ஓ', name: 'oo', type: 'Vowel', ipa: '/oː/', mnemonic: 'Boat', example: 'ஓடம் ⛵' },
    { char: 'ஔ', name: 'au', type: 'Vowel', ipa: '/au/', mnemonic: 'Medicine', example: 'ஔவையார் 👵' },
    { char: 'க', name: 'ka', type: 'Consonant', ipa: '/k/', mnemonic: 'Eye', example: 'கண் 👁️' },
    { char: 'ங', name: 'nga', type: 'Consonant', ipa: '/ŋ/', mnemonic: 'Crane', example: 'இங்ஙனம் 📜' },
    { char: 'ச', name: 'cha', type: 'Consonant', ipa: '/t͡ʃ/', mnemonic: 'Sun', example: 'சூரியன் ☀️' },
    { char: 'ஞ', name: 'nya', type: 'Consonant', ipa: '/ɲ/', mnemonic: 'Sun', example: 'ஞாயிறு 🌅' },
    { char: 'ட', name: 'ta', type: 'Consonant', ipa: '/ʈ/', mnemonic: 'Cart', example: 'வண்டி 🛒' },
    { char: 'ண', name: 'rna', type: 'Consonant', ipa: '/ɳ/', mnemonic: 'Veena', example: 'வீணை 🪕' },
    { char: 'த', name: 'tha', type: 'Consonant', ipa: '/t̪/', mnemonic: 'Water', example: 'தண்ணீர் 💧' },
    { char: 'ந', name: 'na', type: 'Consonant', ipa: '/n̪/', mnemonic: 'Crab', example: 'நண்டு 🦀' },
    { char: 'ப', name: 'pa', type: 'Consonant', ipa: '/p/', mnemonic: 'Fruit', example: 'பழம் 🍎' },
    { char: 'ம', name: 'ma', type: 'Consonant', ipa: '/m/', mnemonic: 'Tree', example: 'மரம் 🌳' },
    { char: 'ய', name: 'ya', type: 'Consonant', ipa: '/j/', mnemonic: 'Elephant', example: 'யானை 🐘' },
    { char: 'ர', name: 'ra', type: 'Consonant', ipa: '/r/', mnemonic: 'Chariot', example: 'ரதம் 🛞' },
    { char: 'ல', name: 'la', type: 'Consonant', ipa: '/l/', mnemonic: 'Light', example: 'விளக்கு 💡' },
    { char: 'வ', name: 'va', type: 'Consonant', ipa: '/v/', mnemonic: 'Sky', example: 'வானம் ☁️' },
    { char: 'ழ', name: 'zha', type: 'Consonant', ipa: '/ɻ/', mnemonic: 'Banana', example: 'வாழைப்பழம் 🍌' },
    { char: 'ள', name: 'la (retroflex)', type: 'Consonant', ipa: '/ɭ/', mnemonic: 'School', example: 'பள்ளி 🏫' },
    { char: 'ற', name: 'ra (trill)', type: 'Consonant', ipa: '/r/', mnemonic: 'Wind', example: 'காற்று 🌬️' },
    { char: 'ன', name: 'na (final)', type: 'Consonant', ipa: '/n/', mnemonic: 'Me', example: 'நான் 👤' }
  ],

  // --- HINDI: FULL DEVANAGARI ---
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
    { char: 'ठ', name: 'tha', type: 'Consonant', ipa: '/ʈʰə/', mnemonic: 'Stamp', example: 'ठप्पा 🏷️' },
    { char: 'ड', name: 'da', type: 'Consonant', ipa: '/ɖə/', mnemonic: 'Drum', example: 'डमरू 🥁' },
    { char: 'ढ', name: 'dha', type: 'Consonant', ipa: '/ɖʱə/', mnemonic: 'Shield', example: 'ढाल 🛡️' },
    { char: 'त', name: 'ta', type: 'Consonant', ipa: '/t̪ə/', mnemonic: 'Watermelon', example: 'तरबूज 🍉' },
    { char: 'थ', name: 'tha', type: 'Consonant', ipa: '/t̪ʰə/', mnemonic: 'Thermos', example: 'थर्मस 🍶' },
    { char: 'द', name: 'da', type: 'Consonant', ipa: '/d̪ə/', mnemonic: 'Medicine', example: 'दवा 💊' },
    { char: 'ध', name: 'dha', type: 'Consonant', ipa: '/d̪ʱə/', mnemonic: 'Bow', example: 'धनुष 🏹' },
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
    { char: 'स', name: 'sa', type: 'Consonant', ipa: '/sə/', mnemonic: 'Snake', example: 'सपेरा 🐍' },
    { char: 'ह', name: 'ha', type: 'Consonant', ipa: '/ɦə/', mnemonic: 'Elephant', example: 'हाथी 🐘' }
  ],

  // --- JAPANESE: FULL 46 HIRAGANA ---
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
    { char: 'さ', name: 'sa', type: 'Consonant', ipa: '/sa/', mnemonic: 'Smiling face', example: '魚 🐟' },
    { char: 'し', name: 'shi', type: 'Consonant', ipa: '/ɕi/', mnemonic: 'Fishing hook', example: '塩 🧂' },
    { char: 'す', name: 'su', type: 'Consonant', ipa: '/sɯ/', mnemonic: 'Noodle', example: '寿司 🍣' },
    { char: 'せ', name: 'se', type: 'Consonant', ipa: '/se/', mnemonic: 'Sun', example: '世界 🌍' },
    { char: 'そ', name: 'so', type: 'Consonant', ipa: '/so/', mnemonic: 'Zigzag', example: '空 ☁️' },
    { char: 'た', name: 'ta', type: 'Consonant', ipa: '/ta/', mnemonic: 'Hat', example: '卵 🥚' },
    { char: 'ち', name: 'chi', type: 'Consonant', ipa: '/t͡ɕi/', mnemonic: 'Cheer', example: '竹 🎍' },
    { char: 'つ', name: 'tsu', type: 'Consonant', ipa: '/t͡sɯ/', mnemonic: 'Wave', example: '月 🌙' },
    { char: 'て', name: 'te', type: 'Consonant', ipa: '/te/', mnemonic: 'Tail', example: '手 ✋' },
    { char: 'と', name: 'to', type: 'Consonant', ipa: '/to/', mnemonic: 'Toe', example: '友達 🧑‍🤝‍🧑' },
    { char: 'な', name: 'na', type: 'Consonant', ipa: '/na/', mnemonic: 'Nun', example: '夏 ☀️' },
    { char: 'に', name: 'ni', type: 'Consonant', ipa: '/ɲi/', mnemonic: 'Needle', example: '虹 🌈' },
    { char: 'ぬ', name: 'nu', type: 'Consonant', ipa: '/nɯ/', mnemonic: 'Noodle', example: '犬 🐕' },
    { char: 'ね', name: 'ne', type: 'Consonant', ipa: '/ne/', mnemonic: 'Cat', example: '猫 🐱' },
    { char: 'の', name: 'no', type: 'Consonant', ipa: '/no/', mnemonic: 'Sign', example: '乗り物 🚲' },
    { char: 'は', name: 'ha', type: 'Consonant', ipa: '/ha/', mnemonic: 'Hockey', example: '花 🌸' },
    { char: 'ひ', name: 'hi', type: 'Consonant', ipa: '/çi/', mnemonic: 'Laugh', example: '光 💡' },
    { char: 'ふ', name: 'fu', type: 'Consonant', ipa: '/ɸɯ/', mnemonic: 'Fuji', example: '船 🚢' },
    { char: 'へ', name: 'he', type: 'Consonant', ipa: '/he/', mnemonic: 'Hill', example: '部屋 🚪' },
    { char: 'ほ', name: 'ho', type: 'Consonant', ipa: '/ho/', mnemonic: 'Chimney', example: '星 ⭐️' },
    { char: 'ま', name: 'ma', type: 'Consonant', ipa: '/ma/', mnemonic: 'Mama', example: '町 🏙️' },
    { char: 'み', name: 'mi', type: 'Consonant', ipa: '/mʲi/', mnemonic: '21', example: '水 💧' },
    { char: 'む', name: 'mu', type: 'Consonant', ipa: '/mɯ/', mnemonic: 'Cow', example: '虫 🐛' },
    { char: 'め', name: 'me', type: 'Consonant', ipa: '/me/', mnemonic: 'Melon', example: '目 👁️' },
    { char: 'も', name: 'mo', type: 'Consonant', ipa: '/mo/', mnemonic: 'Hook', example: '桃 🍑' },
    { char: 'や', name: 'ya', type: 'Consonant', ipa: '/ja/', mnemonic: 'Yak', example: '山 ⛰️' },
    { char: 'ゆ', name: 'yu', type: 'Consonant', ipa: '/jɯ/', mnemonic: 'U-turn', example: '雪 ❄️' },
    { char: 'よ', name: 'yo', type: 'Consonant', ipa: '/jo/', mnemonic: 'Yo-yo', example: '夜 🌃' },
    { char: 'ら', name: 'ra', type: 'Consonant', ipa: '/ɾa/', mnemonic: 'Rabbit', example: 'ライオン 🦁' },
    { char: 'り', name: 'ri', type: 'Consonant', ipa: '/ɾi/', mnemonic: 'Reeds', example: 'りんご 🍎' },
    { char: 'る', name: 'ru', type: 'Consonant', ipa: '/ɾɯ/', mnemonic: 'Ruby', example: 'ルビー 💎' },
    { char: 'れ', name: 're', type: 'Consonant', ipa: '/ɾe/', mnemonic: 'Rest', example: '歴史 📜' },
    { char: 'ろ', name: 'ro', type: 'Consonant', ipa: '/ɾo/', mnemonic: 'Road', example: 'ローソク 🕯️' },
    { char: 'わ', name: 'wa', type: 'Consonant', ipa: '/βa/', mnemonic: 'Wasp', example: 'ワニ 🐊' },
    { char: 'を', name: 'wo', type: 'Consonant', ipa: '/o/', mnemonic: 'Splash', example: '本を飲む 📖' },
    { char: 'ん', name: 'n', type: 'Consonant', ipa: '/n/', mnemonic: 'N sound', example: '本 📚' }
  ],

  // --- ARABIC: FULL 28 LETTERS ---
  ar: [
    { char: 'أ', name: 'alif', type: 'Vowel', ipa: '/aː/', mnemonic: 'Pine Tree', example: 'أسد 🦁' },
    { char: 'ب', name: 'baa', type: 'Consonant', ipa: '/b/', mnemonic: 'Boat dot below', example: 'بيت 🏠' },
    { char: 'ت', name: 'taa', type: 'Consonant', ipa: '/t/', mnemonic: 'Smile 2 dots', example: 'تفاحة 🍎' },
    { char: 'ث', name: 'thaa', type: 'Consonant', ipa: '/θ/', mnemonic: 'Pyramid 3 dots', example: 'ثعلب 🦊' },
    { char: 'ج', name: 'jeem', type: 'Consonant', ipa: '/d͡ʒ/', mnemonic: 'Camel belly dot', example: 'جمل 🐪' },
    { char: 'ح', name: 'haa', type: 'Consonant', ipa: '/ħ/', mnemonic: 'Clean wave', example: 'حصان 🐎' },
    { char: 'خ', name: 'khaa', type: 'Consonant', ipa: '/x/', mnemonic: 'Chef hat dot', example: 'خبز 🍞' },
    { char: 'د', name: 'daal', type: 'Consonant', ipa: '/d/', mnemonic: 'Door hinge', example: 'دب 🐻' },
    { char: 'ذ', name: 'thaal', type: 'Consonant', ipa: '/ð/', mnemonic: 'Door hinge dot', example: 'ذئب 🐺' },
    { char: 'ر', name: 'raa', type: 'Consonant', ipa: '/r/', mnemonic: 'Slide', example: 'رجل 👨' },
    { char: 'ز', name: 'zay', type: 'Consonant', ipa: '/z/', mnemonic: 'Slide dot', example: 'زهرة 🌸' },
    { char: 'س', name: 'seen', type: 'Consonant', ipa: '/s/', mnemonic: 'Sun 3 rays', example: 'سمكة 🐟' },
    { char: 'ش', name: 'sheen', type: 'Consonant', ipa: '/ʃ/', mnemonic: 'Sun 3 dots', example: 'شمس ☀️' },
    { char: 'ص', name: 'saad', type: 'Consonant', ipa: '/sˤ/', mnemonic: 'Whistle', example: 'صقر 🦅' },
    { char: 'ض', name: 'daad', type: 'Consonant', ipa: '/dˤ/', mnemonic: 'Whistle dot', example: 'ضوء 💡' },
    { char: 'ط', name: 'taa', type: 'Consonant', ipa: '/tˤ/', mnemonic: 'Mast', example: 'طائرة ✈️' },
    { char: 'ظ', name: 'zaa', type: 'Consonant', ipa: '/ðˤ/', mnemonic: 'Mast dot', example: 'ظرف ✉️' },
    { char: 'ع', name: 'ayn', type: 'Consonant', ipa: '/ʕ/', mnemonic: 'Falcon beak', example: 'عين 👁️' },
    { char: 'غ', name: 'ghayn', type: 'Consonant', ipa: '/ɣ/', mnemonic: 'Beak dot', example: 'غزالة 🦌' },
    { char: 'ف', name: 'faa', type: 'Consonant', ipa: '/f/', mnemonic: 'Feather', example: 'فيل 🐘' },
    { char: 'ق', name: 'qaaf', type: 'Consonant', ipa: '/q/', mnemonic: 'Deep cup', example: 'قمر 🌙' },
    { char: 'ك', name: 'kaaf', type: 'Consonant', ipa: '/k/', mnemonic: 'Key', example: 'كتاب 📖' },
    { char: 'ل', name: 'laam', type: 'Consonant', ipa: '/l/', mnemonic: 'Umbrella', example: 'ليمون 🍋' },
    { char: 'م', name: 'meem', type: 'Consonant', ipa: '/m/', mnemonic: 'Moon circle', example: 'موز 🍌' },
    { char: 'ن', name: 'noon', type: 'Consonant', ipa: '/n/', mnemonic: 'Nest 1 egg', example: 'نجمة ⭐️' },
    { char: 'هـ', name: 'haa', type: 'Consonant', ipa: '/h/', mnemonic: 'Heart loop', example: 'هدية 🎁' },
    { char: 'و', name: 'waw', type: 'Consonant', ipa: '/w/', mnemonic: 'Whirlpool', example: 'وردة 🌹' },
    { char: 'ي', name: 'yaa', type: 'Consonant', ipa: '/j/', mnemonic: 'Swan 2 dots', example: 'يد ✋' }
  ]
};

// ═══════════════════════════════════════════════════════════════
//  LEVEL 2: ACTION VERBS & GREETINGS
// ═══════════════════════════════════════════════════════════════
export const ACTION_VERBS_GREETINGS = {
  gu: [
    { phrase: 'નમસ્તે (Namaste)', meaning: 'Hello / Greetings!', icon: '🙏', phonetic: 'na-mas-te', type: 'Greeting' },
    { phrase: 'સુપ્રભાત (Suprabhat)', meaning: 'Good morning!', icon: '🌅', phonetic: 'soo-pra-bhat', type: 'Greeting' },
    { phrase: 'આભાર (Aabhar)', meaning: 'Thank you!', icon: '🌸', phonetic: 'aa-bhar', type: 'Greeting' },
    { phrase: 'આવજો (Aavjo)', meaning: 'Goodbye!', icon: '🙋', phonetic: 'aav-jo', type: 'Greeting' },
    { phrase: 'દોડવું (Dodvu)', meaning: 'To Run', icon: '🏃', phonetic: 'dod-voo', type: 'Action Verb' },
    { phrase: 'જમવું (Jamvu)', meaning: 'To Eat', icon: '🍽️', phonetic: 'jam-voo', type: 'Action Verb' },
    { phrase: 'વાંચવું (Vanchvu)', meaning: 'To Read', icon: '📖', phonetic: 'vanch-voo', type: 'Action Verb' },
    { phrase: 'લખવું (Lakhvu)', meaning: 'To Write', icon: '✏️', phonetic: 'lakh-voo', type: 'Action Verb' }
  ],
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
  gu: [
    {
      category: '🍽️ Restaurant & Food',
      phrases: [
        { native: 'આ કેટલાનું છે? (Aa ketlanu chhe?)', english: 'How much is this?', phonetic: 'aa ket-la-nu chhe' },
        { native: 'પાણી આપો, કૃપા કરીને। (Paani aapo, kripa karine)', english: 'Please give water.', phonetic: 'paa-nee aa-po' }
      ]
    }
  ],
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
  gu: [
    {
      targetSentence: "બિલાડી સફરજન ખાય છે",
      englishTranslation: "The cat eats the apple",
      blocks: [
        { id: 'b1', text: 'બિલાડી (Biladi) 🐱', type: 'noun', color: 'bg-emerald-500 text-white' },
        { id: 'b2', text: 'સફરજન (Safarjan) 🍎', type: 'noun', color: 'bg-emerald-500 text-white' },
        { id: 'b3', text: 'ખાય છે (Khay chhe) 🍽️', type: 'verb', color: 'bg-blue-600 text-white' }
      ]
    }
  ],
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
  gu: [
    { num: 1, native: '૧', word: 'એક (Ek)', phonetic: 'ek' },
    { num: 2, native: '૨', word: 'બે (Be)', phonetic: 'be' },
    { num: 3, native: '૩', word: 'ત્રણ (Tran)', phonetic: 'tran' },
    { num: 4, native: '૪', word: 'ચાર (Char)', phonetic: 'char' },
    { num: 5, native: '૫', word: 'પાંચ (Panch)', phonetic: 'panch' }
  ],
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
  gu: [
    { id: 'cat', word: 'બિલાડી (Biladi)', meaning: 'The Cat', category: 'Animals', icon: '🐱', phonetic: 'bi-la-di' },
    { id: 'dog', word: 'કુતરો (Kutro)', meaning: 'The Dog', category: 'Animals', icon: '🐕', phonetic: 'koo-tro' },
    { id: 'apple', word: 'સફરજન (Safarjan)', meaning: 'The Apple', category: 'Food', icon: '🍎', phonetic: 'sa-far-jan' },
    { id: 'house', word: 'ઘર (Ghar)', meaning: 'The House', category: 'Home', icon: '🏠', phonetic: 'ghar' },
    { id: 'sun', word: 'સૂર્ય (Surya)', meaning: 'The Sun', category: 'Nature', icon: '☀️', phonetic: 'soor-ya' }
  ],
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
  gu: [
    {
      title: "ભાગ ૧: જાદુઈ બગીચાની સફર (Quest for Magic Garden)",
      panels: [
        { speaker: "Poly Parrot 🦜", speech: "નમસ્તે મિત્રો! આજે આપણે જાદુઈ બગીચાની સફરે જઈએ છીએ!", translation: "Hello friends! Today we are going on a quest to the magic garden!" },
        { speaker: "Dino REX 🦖", speech: "વાહ! ત્યાં મીઠાં ફળો અને સુંદર નદીઓ હશે?", translation: "Wow! Will there be sweet fruits and beautiful rivers there?" },
        { speaker: "Wise Owl 🦉", speech: "આ સોનાની ચાવી લો અને દરવાજો ખોલો.", translation: "Take this golden key and open the door." },
        { speaker: "Poly Parrot 🦜", speech: "અભિનંદન! આપણે સાથે મળીને સફળ થયા!", translation: "Congratulations! We succeeded together!" }
      ]
    }
  ],
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
        { speaker: "Dino 🦖", speech: "Regarde ces belles pommes et fleurs colorées!", translation: "Look at these beautiful apples and colorful flowers!" }
      ]
    }
  ],
  de: [
    {
      title: "Episode 1: Das Geheimnis des Zauberwalds (Mystery of Magic Forest)",
      panels: [
        { speaker: "Poly Parrot 🦜", speech: "Hallo Freunde! Heute erkunden wir den magischen Wald!", translation: "Hello friends! Today we explore the magic forest!" }
      ]
    }
  ],
  es: [
    {
      title: "Episodio 1: El Misterio del Jardín Mágico (Quest for Magic Garden)",
      panels: [
        { speaker: "Poly Parrot 🦜", speech: "¡Hola amigos! Hoy vamos a explorar el Jardín Mágico.", translation: "Hello friends! Today we are exploring the Magic Garden." }
      ]
    }
  ],
  hi: [
    {
      title: "Episode 1: जादुई बगीचे की रहस्यमयी यात्रा (The Quest for the Magic Garden)",
      panels: [
        { speaker: "Poly Parrot 🦜", speech: "नमस्ते दोस्तों! आज हम एक जादुई गुप्त बगीचे की खोज में जा रहे हैं!", translation: "Hello friends! Today we are going on a quest for a secret magic garden!" }
      ]
    }
  ]
};
