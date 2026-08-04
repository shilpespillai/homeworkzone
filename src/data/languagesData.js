// ═══════════════════════════════════════════════════════════════
//  POLYGLOT PLANET - COMPREHENSIVE GLOBAL LANGUAGE SCRIPT DATABASE
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
  { code: 'kn', name: 'Kannada', flag: '🇮🇳', native: 'ಕನ್ನಡ', family: 'Dravidian' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩', native: 'Bahasa Indonesia', family: 'Austronesian' },
  { code: 'tl', name: 'Tagalog', flag: '🇵🇭', native: 'Tagalog', family: 'Austronesian' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦', native: 'Українська', family: 'Slavic' }
];

// Basic Latin Alphabet (A-Z)
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
  // --- FRENCH (With Accents) ---
  fr: [
    ...LATIN_ALPHABET,
    { char: 'É', name: 'e-accent-aigu', type: 'Vowel', ipa: '/e/', mnemonic: 'School', example: 'École 🏫' },
    { char: 'È', name: 'e-accent-grave', type: 'Vowel', ipa: '/ɛ/', mnemonic: 'Mother', example: 'Mère 👩' },
    { char: 'Ç', name: 'c-cedilla', type: 'Consonant', ipa: '/s/', mnemonic: 'Boy', example: 'Garçon 👦' }
  ],

  // --- GERMAN (With Umlauts & Eszett) ---
  de: [
    ...LATIN_ALPHABET,
    { char: 'Ä', name: 'a-umlaut', type: 'Vowel', ipa: '/ɛ/', mnemonic: 'Apples', example: 'Äpfel 🍎' },
    { char: 'Ö', name: 'o-umlaut', type: 'Vowel', ipa: '/ø/', mnemonic: 'Oil', example: 'Öl 🛢️' },
    { char: 'Ü', name: 'u-umlaut', type: 'Vowel', ipa: '/y/', mnemonic: 'Uber', example: 'Über 🚕' },
    { char: 'ß', name: 'eszett', type: 'Consonant', ipa: '/s/', mnemonic: 'Street', example: 'Straße 🛣️' }
  ],

  // --- SPANISH (With Ñ) ---
  es: [
    ...LATIN_ALPHABET.slice(0, 14),
    { char: 'Ñ', name: 'eñe', type: 'Consonant', ipa: '/ɲ/', mnemonic: 'Boy', example: 'Niño 👦' },
    ...LATIN_ALPHABET.slice(14)
  ],

  // --- SWEDISH (With Å, Ä, Ö) ---
  sv: [
    ...LATIN_ALPHABET,
    { char: 'Å', name: 'å', type: 'Vowel', ipa: '/oː/', mnemonic: 'River', example: 'Å 🌊' },
    { char: 'Ä', name: 'ä', type: 'Vowel', ipa: '/ɛː/', mnemonic: 'Apple', example: 'Äpple 🍎' },
    { char: 'Ö', name: 'ö', type: 'Vowel', ipa: '/øː/', mnemonic: 'Island', example: 'Ö 🏝️' }
  ],

  // --- POLISH (With Ą, Ć, Ę, Ł, Ń, Ó, Ś, Ź, Ż) ---
  pl: [
    ...LATIN_ALPHABET,
    { char: 'Ą', name: 'ą', type: 'Vowel', ipa: '/ɔ̃/', mnemonic: 'Husband', example: 'Mąż 👨' },
    { char: 'Ć', name: 'ć', type: 'Consonant', ipa: '/t͡ɕ/', mnemonic: 'Moth', example: 'Ćma 🦋' },
    { char: 'Ę', name: 'ę', type: 'Vowel', ipa: '/ɛ̃/', mnemonic: 'Goose', example: 'Gęś 🪿' },
    { char: 'Ł', name: 'ł', type: 'Consonant', ipa: '/w/', mnemonic: 'Boat', example: 'Łódź ⛵' },
    { char: 'Ń', name: 'ń', type: 'Consonant', ipa: '/ɲ/', mnemonic: 'Horse', example: 'Koń 🐎' },
    { char: 'Ó', name: 'ó', type: 'Vowel', ipa: '/u/', mnemonic: 'Eight', example: 'Ósemka 8️⃣' },
    { char: 'Ś', name: 'ś', type: 'Consonant', ipa: '/ɕ/', mnemonic: 'Snow', example: 'Śnieg ❄️' },
    { char: 'Ź', name: 'ź', type: 'Consonant', ipa: '/ʑ/', mnemonic: 'Foal', example: 'Źrebak 🐴' },
    { char: 'Ż', name: 'ż', type: 'Consonant', ipa: '/ʐ/', mnemonic: 'Frog', example: 'Żaba 🐸' }
  ],

  // --- TURKISH (With Ç, Ğ, İ, Ö, Ş, Ü) ---
  tr: [
    { char: 'A', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'Car', example: 'Araba 🚗' },
    { char: 'B', name: 'be', type: 'Consonant', ipa: '/b/', mnemonic: 'Fish', example: 'Balık 🐟' },
    { char: 'C', name: 'ce', type: 'Consonant', ipa: '/d͡ʒ/', mnemonic: 'Walnut', example: 'Ceviz 🥜' },
    { char: 'Ç', name: 'çe', type: 'Consonant', ipa: '/t͡ʃ/', mnemonic: 'Flower', example: 'Çiçek 🌸' },
    { char: 'D', name: 'de', type: 'Consonant', ipa: '/d/', mnemonic: 'Sea', example: 'Deniz 🌊' },
    { char: 'E', name: 'e', type: 'Vowel', ipa: '/e/', mnemonic: 'Home', example: 'Ev 🏠' },
    { char: 'F', name: 'fe', type: 'Consonant', ipa: '/f/', mnemonic: 'Elephant', example: 'Fil 🐘' },
    { char: 'G', name: 'ge', type: 'Consonant', ipa: '/g/', mnemonic: 'Sun', example: 'Güneş ☀️' },
    { char: 'Ğ', name: 'yumuşak-g', type: 'Consonant', ipa: '/ɰ/', mnemonic: 'Tree', example: 'Ağaç 🌳' },
    { char: 'H', name: 'he', type: 'Consonant', ipa: '/h/', mnemonic: 'Carrot', example: 'Havuç 🥕' },
    { char: 'I', name: 'dotless-i', type: 'Vowel', ipa: '/ɯ/', mnemonic: 'Spinach', example: 'Ispanak 🥬' },
    { char: 'İ', name: 'dotted-i', type: 'Vowel', ipa: '/i/', mnemonic: 'Fig', example: 'Incir 🫐' },
    { char: 'Ö', name: 'o-umlaut', type: 'Vowel', ipa: '/œ/', mnemonic: 'Duck', example: 'Ördek 🦆' },
    { char: 'Ş', name: 'se-cedilla', type: 'Consonant', ipa: '/ʃ/', mnemonic: 'Hat', example: 'Şapka 🧢' },
    { char: 'Ü', name: 'u-umlaut', type: 'Vowel', ipa: '/y/', mnemonic: 'Grape', example: 'Üzüm 🍇' }
  ],

  // --- VIETNAMESE (With Ă, Â, Đ, Ê, Ô, Ơ, Ư) ---
  vi: [
    { char: 'A', name: 'a', type: 'Vowel', ipa: '/aː/', mnemonic: 'Shirt', example: 'Áo 👕' },
    { char: 'Ă', name: 'a-breve', type: 'Vowel', ipa: '/a/', mnemonic: 'Eat', example: 'Ăn 🍽️' },
    { char: 'Â', name: 'a-circumflex', type: 'Vowel', ipa: '/ə/', mnemonic: 'Warm', example: 'Ấm ☕' },
    { char: 'B', name: 'be', type: 'Consonant', ipa: '/ɓ/', mnemonic: 'Sea', example: 'Biển 🌊' },
    { char: 'C', name: 'co', type: 'Consonant', ipa: '/k/', mnemonic: 'Fish', example: 'Cá 🐟' },
    { char: 'D', name: 'de', type: 'Consonant', ipa: '/z/', mnemonic: 'Goat', example: 'Dê 🐐' },
    { char: 'Đ', name: 'd-stroke', type: 'Consonant', ipa: '/ɗ/', mnemonic: 'Lamp', example: 'Đèn 💡' },
    { char: 'E', name: 'e', type: 'Vowel', ipa: '/ɛ/', mnemonic: 'Baby', example: 'Em 👶' },
    { char: 'Ê', name: 'e-circumflex', type: 'Vowel', ipa: '/e/', mnemonic: 'Snail', example: 'Ốc 🐚' },
    { char: 'G', name: 'ge', type: 'Consonant', ipa: '/ɣ/', mnemonic: 'Chicken', example: 'Gà 🐔' },
    { char: 'H', name: 'hat', type: 'Consonant', ipa: '/h/', mnemonic: 'Flower', example: 'Hoa 🌸' },
    { char: 'O', name: 'o', type: 'Vowel', ipa: '/ɔ/', mnemonic: 'Bee', example: 'Ong 🐝' },
    { char: 'Ô', name: 'o-circumflex', type: 'Vowel', ipa: '/o/', mnemonic: 'Umbrella', example: 'Ô ☂️' },
    { char: 'Ơ', name: 'o-horn', type: 'Vowel', ipa: '/əː/', mnemonic: 'Market', example: 'Chợ 🏪' },
    { char: 'Ư', name: 'u-horn', type: 'Vowel', ipa: '/ɨ/', mnemonic: 'Rain', example: 'Mưa 🌧️' }
  ],

  // --- ITALIAN, DUTCH, PORTUGUESE, INDONESIAN, TAGALOG ---
  it: LATIN_ALPHABET,
  nl: LATIN_ALPHABET,
  pt: LATIN_ALPHABET,
  id: LATIN_ALPHABET,
  tl: LATIN_ALPHABET,

  // --- GUJARATI: FULL VOWELS + CONSONANTS ---
  gu: [
    // Vowels
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
    { char: 'અઃ', name: 'ah', type: 'Vowel', ipa: '/əh/', mnemonic: 'Smile', example: 'અંતઃ 😃' },

    // Consonants
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

  // --- MALAYALAM: FULL VOWELS + CONSONANTS ---
  ml: [
    { char: 'അ', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'Elephant', example: 'ആന 🐘' },
    { char: 'ആ', name: 'aa', type: 'Vowel', ipa: '/aː/', mnemonic: 'Tortoise', example: 'ആമ 🐢' },
    { char: 'ഇ', name: 'i', type: 'Vowel', ipa: '/i/', mnemonic: 'Leaf', example: 'ഇല 🍃' },
    { char: 'ഈ', name: 'ee', type: 'Vowel', ipa: '/iː/', mnemonic: 'Fly', example: 'ഈച്ച 🪰' },
    { char: 'ഉ', name: 'u', type: 'Vowel', ipa: '/u/', mnemonic: 'Ant', example: 'ഉറുമ്പ് 🐜' },
    { char: 'ഊ', name: 'oo', type: 'Vowel', ipa: '/uː/', mnemonic: 'Swing', example: 'ഊഞ്ഞാൽ 🧺' },
    { char: 'എ', name: 'e', type: 'Vowel', ipa: '/e/', mnemonic: 'Rat', example: 'എലി 🐀' },
    { char: 'ഏ', name: 'ee', type: 'Vowel', ipa: '/eː/', mnemonic: 'Cardamom', example: 'ഏലക്ക 🫚' },
    { char: 'ഐ', name: 'ai', type: 'Vowel', ipa: '/ai/', mnemonic: 'Five', example: 'അഞ്ച് 5️⃣' },
    { char: 'ഒ', name: 'o', type: 'Vowel', ipa: '/o/', mnemonic: 'Camel', example: 'ഒട്ടകം 🐪' },
    { char: 'ഓ', name: 'oo', type: 'Vowel', ipa: '/oː/', mnemonic: 'Stream', example: 'ഓട 🌊' },
    { char: 'ഔ', name: 'au', type: 'Vowel', ipa: '/au/', mnemonic: 'Medicine', example: 'ഔഷധം 💊' },
    { char: 'ക', name: 'ka', type: 'Consonant', ipa: '/k/', mnemonic: 'Eye', example: 'കണ്ണ് 👁️' },
    { char: 'ഖ', name: 'kha', type: 'Consonant', ipa: '/kʰ/', mnemonic: 'Sword', example: 'ഖഡ്ഗം 🗡️' },
    { char: 'ഗ', name: 'ga', type: 'Consonant', ipa: '/g/', mnemonic: 'Elephant', example: 'ഗജം 🐘' },
    { char: 'ഘ', name: 'gha', type: 'Consonant', ipa: '/gʱ/', mnemonic: 'Pitcher', example: 'ഘടം 🏺' },
    { char: 'ച', name: 'cha', type: 'Consonant', ipa: '/t͡ʃ/', mnemonic: 'Spoon', example: 'ചമച 🥄' },
    { char: 'ജ', name: 'ja', type: 'Consonant', ipa: '/d͡ʒ/', mnemonic: 'Water', example: 'ജലം 💧' },
    { char: 'ട', name: 'ta', type: 'Consonant', ipa: '/ʈ/', mnemonic: 'Tomato', example: 'തക്കാളി 🍅' },
    { char: 'ഡ', name: 'da', type: 'Consonant', ipa: '/ɖ/', mnemonic: 'Drum', example: 'ഡപ്പ 🥁' },
    { char: 'ത', name: 'ta', type: 'Consonant', ipa: '/t̪/', mnemonic: 'Head', example: 'തല 👤' },
    { char: 'ദ', name: 'da', type: 'Consonant', ipa: '/d̪/', mnemonic: 'Lamp', example: 'ദീപം 💡' },
    { char: 'ന', name: 'na', type: 'Consonant', ipa: '/n̪/', mnemonic: 'Dog', example: 'നായ 🐕' },
    { char: 'പ', name: 'pa', type: 'Consonant', ipa: '/p/', mnemonic: 'Milk', example: 'പാൽ 🥛' },
    { char: 'ഫ', name: 'pha', type: 'Consonant', ipa: '/pʰ/', mnemonic: 'Fruit', example: 'ഫലം 🍎' },
    { char: 'ബ', name: 'ba', type: 'Consonant', ipa: '/b/', mnemonic: 'Child', example: 'ബാലൻ 👦' },
    { char: 'ഭ', name: 'bha', type: 'Consonant', ipa: '/bʱ/', mnemonic: 'House', example: 'ഭവനം 🏠' },
    { char: 'മ', name: 'ma', type: 'Consonant', ipa: '/m/', mnemonic: 'Fish', example: 'മീൻ 🐟' },
    { char: 'യ', name: 'ya', type: 'Consonant', ipa: '/j/', mnemonic: 'Car', example: 'യാത്ര 🚗' },
    { char: 'ര', name: 'ra', type: 'Consonant', ipa: '/r/', mnemonic: 'Night', example: 'രാത്രി 🌃' },
    { char: 'ല', name: 'la', type: 'Consonant', ipa: '/l/', mnemonic: 'Clove', example: 'ലവംഗം 🫚' },
    { char: 'വ', name: 'va', type: 'Consonant', ipa: '/v/', mnemonic: 'Air', example: 'वायु 🌬️' }
  ],

  // --- KANNADA: FULL VOWELS + CONSONANTS ---
  kn: [
    { char: 'ಅ', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'Mother', example: 'ಅಮ್ಮ 👩' },
    { char: 'ಆ', name: 'aa', type: 'Vowel', ipa: '/aː/', mnemonic: 'Elephant', example: 'ಆನೆ 🐘' },
    { char: 'ಇ', name: 'i', type: 'Vowel', ipa: '/i/', mnemonic: 'Rat', example: 'ಇಲಿ 🐀' },
    { char: 'ಈ', name: 'ee', type: 'Vowel', ipa: '/iː/', mnemonic: 'Feather', example: 'ಈಜು 🏊' },
    { char: 'ಉ', name: 'u', type: 'Vowel', ipa: '/u/', mnemonic: 'Gift', example: 'ಉಡುಗೊರೆ 🎁' },
    { char: 'ಊ', name: 'oo', type: 'Vowel', ipa: '/uː/', mnemonic: 'Village', example: 'ಊರು 🏘️' },
    { char: 'ಋ', name: 'ri', type: 'Vowel', ipa: '/rɪ/', mnemonic: 'Sage', example: 'ಋಷಿ 🧘' },
    { char: 'ಎ', name: 'e', type: 'Vowel', ipa: '/e/', mnemonic: 'Leaf', example: 'ಎಲೆ 🍃' },
    { char: 'ಏ', name: 'ee', type: 'Vowel', ipa: '/eː/', mnemonic: 'Seven', example: 'ಏಳು 7️⃣' },
    { char: 'ಐ', name: 'ai', type: 'Vowel', ipa: '/ai/', mnemonic: 'Five', example: 'ಐದು 5️⃣' },
    { char: 'ಒ', name: 'o', type: 'Vowel', ipa: '/o/', mnemonic: 'Camel', example: 'ಒಂಟೆ 🐪' },
    { char: 'ಓ', name: 'oo', type: 'Vowel', ipa: '/oː/', mnemonic: 'Stream', example: 'ಓಟ 🏃' },
    { char: 'ಔ', name: 'au', type: 'Vowel', ipa: '/au/', mnemonic: 'Medicine', example: 'ಔಷಧ 💊' },
    { char: 'ಕ', name: 'ka', type: 'Consonant', ipa: '/k/', mnemonic: 'Lotus', example: 'कमल 🪷' },
    { char: 'ಖ', name: 'kha', type: 'Consonant', ipa: '/kʰ/', mnemonic: 'Bird', example: 'ಖಗ 🐦' },
    { char: 'ಗ', name: 'ga', type: 'Consonant', ipa: '/g/', mnemonic: 'Bell', example: 'ಗಂಟೆ 🔔' },
    { char: 'ಘ', name: 'gha', type: 'Consonant', ipa: '/gʱ/', mnemonic: 'Pitcher', example: 'ಘಟ 🏺' },
    { char: 'ಚ', name: 'cha', type: 'Consonant', ipa: '/t͡ʃ/', mnemonic: 'Spoon', example: 'ಚಮಚ 🥄' },
    { char: 'ಜ', name: 'ja', type: 'Consonant', ipa: '/d͡ʒ/', mnemonic: 'Water', example: 'ಜಲ 💧' },
    { char: 'ಟ', name: 'ta', type: 'Consonant', ipa: '/ʈ/', mnemonic: 'Tomato', example: 'ಟೊಮೆಟೊ 🍅' },
    { char: 'ಡ', name: 'da', type: 'Consonant', ipa: '/ɖ/', mnemonic: 'Drum', example: 'ಡೋಲು 🥁' },
    { char: 'ತ', name: 'ta', type: 'Consonant', ipa: '/t̪/', mnemonic: 'Head', example: 'தலை 👤' },
    { char: 'ದ', name: 'da', type: 'Consonant', ipa: '/d̪/', mnemonic: 'Lamp', example: 'ದೀಪ 💡' },
    { char: 'ನ', name: 'na', type: 'Consonant', ipa: '/n̪/', mnemonic: 'Dog', example: 'ನಾಯಿ 🐕' },
    { char: 'ಪ', name: 'pa', type: 'Consonant', ipa: '/p/', mnemonic: 'Bird', example: 'ಹಕ್ಕಿ 🐦' },
    { char: 'ಫ', name: 'pha', type: 'Consonant', ipa: '/pʰ/', mnemonic: 'Fruit', example: 'ಫಲ 🍎' },
    { char: 'ಬ', name: 'ba', type: 'Consonant', ipa: '/b/', mnemonic: 'Duck', example: 'ಬಾತುಕೋಳಿ 🦆' },
    { char: 'ಭ', name: 'bha', type: 'Consonant', ipa: '/bʱ/', mnemonic: 'Building', example: 'భవನ 🏢' },
    { char: 'ಮ', name: 'ma', type: 'Consonant', ipa: '/m/', mnemonic: 'Tree', example: 'ಮರ 🌳' },
    { char: 'ಯ', name: 'ya', type: 'Consonant', ipa: '/j/', mnemonic: 'Yagya', example: 'ಯಜ್ಞ 🔥' },
    { char: 'ರ', name: 'ra', type: 'Consonant', ipa: '/r/', mnemonic: 'Chariot', example: 'ರಥ 🛞' },
    { char: 'ಲ', name: 'la', type: 'Consonant', ipa: '/l/', mnemonic: 'Garlic', example: 'ಬೆಳ್ಳುಳ್ಳಿ 🧄' },
    { char: 'ವ', name: 'va', type: 'Consonant', ipa: '/v/', mnemonic: 'Circle', example: 'ವೃತ್ತ ⭕' },
    { char: 'ಶ', name: 'sha', type: 'Consonant', ipa: '/ʃ/', mnemonic: 'Conch', example: 'ಶಂಖ 🐚' },
    { char: 'ಸ', name: 'sa', type: 'Consonant', ipa: '/s/', mnemonic: 'Sun', example: 'సూర్య ☀️' },
    { char: 'ಹ', name: 'ha', type: 'Consonant', ipa: '/h/', mnemonic: 'Flower', example: 'ಹೂವು 🌸' }
  ],

  // --- THAI: CONSONANTS ---
  th: [
    { char: 'ก', name: 'Gor Kai', type: 'Consonant', ipa: '/k/', mnemonic: 'Chicken', example: 'ไก่ 🐔' },
    { char: 'ข', name: 'Khor Khai', type: 'Consonant', ipa: '/kʰ/', mnemonic: 'Egg', example: 'ไข่ 🥚' },
    { char: 'ค', name: 'Khor Khwai', type: 'Consonant', ipa: '/kʰ/', mnemonic: 'Buffalo', example: 'ควาย 🐃' },
    { char: 'ง', name: 'Ngor Ngu', type: 'Consonant', ipa: '/ŋ/', mnemonic: 'Snake', example: 'งู 🐍' },
    { char: 'จ', name: 'Jor Jan', type: 'Consonant', ipa: '/t͡s/', mnemonic: 'Plate', example: 'จาน 🍽️' },
    { char: 'ฉ', name: 'Chor Ching', type: 'Consonant', ipa: '/t͡sʰ/', mnemonic: 'Cymbals', example: 'ฉิ่ง 🔔' },
    { char: 'ช', name: 'Chor Chang', type: 'Consonant', ipa: '/t͡sʰ/', mnemonic: 'Elephant', example: 'ช้าง 🐘' },
    { char: 'ซ', name: 'Sor So', type: 'Consonant', ipa: '/s/', mnemonic: 'Chain', example: 'โซ่ ⛓️' },
    { char: 'ด', name: 'Dor Dek', type: 'Consonant', ipa: '/d/', mnemonic: 'Child', example: 'เด็ก 🧒' },
    { char: 'ต', name: 'Tor Tao', type: 'Consonant', ipa: '/t/', mnemonic: 'Turtle', example: 'เต่า 🐢' },
    { char: 'ท', name: 'Thor Thahan', type: 'Consonant', ipa: '/tʰ/', mnemonic: 'Soldier', example: 'ทหาร 💂' },
    { char: 'น', name: 'Nor Nu', type: 'Consonant', ipa: '/n/', mnemonic: 'Mouse', example: 'หนู 🐀' },
    { char: 'บ', name: 'Bor Baimai', type: 'Consonant', ipa: '/b/', mnemonic: 'Leaf', example: 'ใบไม้ 🍃' },
    { char: 'ป', name: 'Por Pla', type: 'Consonant', ipa: '/p/', mnemonic: 'Fish', example: 'ปลา 🐟' },
    { char: 'ผ', name: 'Phor Phung', type: 'Consonant', ipa: '/pʰ/', mnemonic: 'Bee', example: 'ผึ้ง 🐝' },
    { char: 'ม', name: 'Mor Ma', type: 'Consonant', ipa: '/m/', mnemonic: 'Horse', example: 'ม้า 🐎' },
    { char: 'ย', name: 'Yor Yak', type: 'Consonant', ipa: '/j/', mnemonic: 'Giant', example: 'ยักษ์ 👹' },
    { char: 'ร', name: 'Ror Ruea', type: 'Consonant', ipa: '/r/', mnemonic: 'Boat', example: 'เรือ ⛵' },
    { char: 'ล', name: 'Lor Ling', type: 'Consonant', ipa: '/l/', mnemonic: 'Monkey', example: 'ลิง 🐒' },
    { char: 'ว', name: 'Wor Waen', type: 'Consonant', ipa: '/w/', mnemonic: 'Ring', example: 'แหวน 💍' },
    { char: 'ส', name: 'Sor Suea', type: 'Consonant', ipa: '/s/', mnemonic: 'Tiger', example: 'เสือ 🐅' },
    { char: 'ห', name: 'Hor Hip', type: 'Consonant', ipa: '/h/', mnemonic: 'Chest', example: 'หีบ 📦' }
  ],

  // --- MANDARIN CHINESE (PINYIN TONES + INITIALS) ---
  zh: [
    { char: 'ā', name: 'a (First Tone)', type: 'Vowel', ipa: '/a/', mnemonic: 'High Flat Tone', example: '阿姨 👩' },
    { char: 'á', name: 'a (Second Tone)', type: 'Vowel', ipa: '/a/', mnemonic: 'Rising Tone', example: '癌 🩺' },
    { char: 'ǎ', name: 'a (Third Tone)', type: 'Vowel', ipa: '/a/', mnemonic: 'Dipping Tone', example: '矮 📏' },
    { char: 'à', name: 'a (Fourth Tone)', type: 'Vowel', ipa: '/a/', mnemonic: 'Falling Tone', example: '愛 ❤️' },
    { char: 'ō', name: 'o', type: 'Vowel', ipa: '/o/', mnemonic: 'Rooster', example: '嗷嗷 🐓' },
    { char: 'ē', name: 'e', type: 'Vowel', ipa: '/e/', mnemonic: 'Goose', example: '鹅 鵝' },
    { char: 'ī', name: 'i', type: 'Vowel', ipa: '/i/', mnemonic: 'Clothes', example: '衣 👕' },
    { char: 'ū', name: 'u', type: 'Vowel', ipa: '/u/', mnemonic: 'House', example: '屋 🏠' },
    { char: 'ǖ', name: 'ü', type: 'Vowel', ipa: '/y/', mnemonic: 'Fish', example: '鱼 🐟' },
    { char: 'b', name: 'ba', type: 'Consonant', ipa: '/p/', mnemonic: 'Eight', example: '八 8️⃣' },
    { char: 'p', name: 'pa', type: 'Consonant', ipa: '/pʰ/', mnemonic: 'Climb', example: '爬 🧗' },
    { char: 'm', name: 'ma', type: 'Consonant', ipa: '/m/', mnemonic: 'Mom', example: '妈妈 👩' },
    { char: 'f', name: 'fa', type: 'Consonant', ipa: '/f/', mnemonic: 'Buddha', example: '佛 🪷' },
    { char: 'd', name: 'da', type: 'Consonant', ipa: '/t/', mnemonic: 'Big', example: '大 🐘' },
    { char: 't', name: 'ta', type: 'Consonant', ipa: '/tʰ/', mnemonic: 'He/She', example: '他 👦' },
    { char: 'n', name: 'na', type: 'Consonant', ipa: '/n/', mnemonic: 'You', example: '你 🧑' },
    { char: 'l', name: 'la', type: 'Consonant', ipa: '/l/', mnemonic: 'Dragon', example: '龙 🐉' },
    { char: 'g', name: 'ge', type: 'Consonant', ipa: '/k/', mnemonic: 'Brother', example: '哥哥 👦' },
    { char: 'k', name: 'ke', type: 'Consonant', ipa: '/kʰ/', mnemonic: 'Thirst', example: '渴 🥤' },
    { char: 'h', name: 'he', type: 'Consonant', ipa: '/x/', mnemonic: 'Drink', example: '喝 🥛' }
  ],

  // --- KOREAN HANGUL (CONSONANTS + VOWELS) ---
  ko: [
    // Consonants (Ja-um)
    { char: 'ㄱ', name: 'giyok', type: 'Consonant', ipa: '/k/', mnemonic: 'Bag', example: '가방 🎒' },
    { char: 'ㄴ', name: 'nieun', type: 'Consonant', ipa: '/n/', mnemonic: 'Tree', example: '나무 🌳' },
    { char: 'ㄷ', name: 'digeut', type: 'Consonant', ipa: '/t/', mnemonic: 'Squirrel', example: '다람쥐 🐿️' },
    { char: 'ㄹ', name: 'rieul', type: 'Consonant', ipa: '/r/', mnemonic: 'Ramen', example: '라면 🍜' },
    { char: 'ㅁ', name: 'mieum', type: 'Consonant', ipa: '/m/', mnemonic: 'Cap', example: '모자 🧢' },
    { char: 'ㅂ', name: 'bieup', type: 'Consonant', ipa: '/p/', mnemonic: 'Banana', example: '바ナナ 🍌' },
    { char: 'ㅅ', name: 'siot', type: 'Consonant', ipa: '/s/', mnemonic: 'Apple', example: '사과 🍎' },
    { char: 'ㅇ', name: 'ieung', type: 'Consonant', ipa: '/ŋ/', mnemonic: 'Baby', example: '아기 👶' },
    { char: 'ㅈ', name: 'jieut', type: 'Consonant', ipa: '/t͡s/', mnemonic: 'Ruler', example: '자 📏' },
    { char: 'ㅊ', name: 'chieut', type: 'Consonant', ipa: '/t͡sʰ/', mnemonic: 'Car', example: '차 🚗' },
    { char: 'ㅋ', name: 'kieuk', type: 'Consonant', ipa: '/kʰ/', mnemonic: 'Nose', example: '코 👃' },
    { char: 'ㅌ', name: 'tieut', type: 'Consonant', ipa: '/tʰ/', mnemonic: 'Ostrich', example: '타조 🦩' },
    { char: 'ㅍ', name: 'pieup', type: 'Consonant', ipa: '/pʰ/', mnemonic: 'Blue', example: '파랑 💙' },
    { char: 'ㅎ', name: 'hieut', type: 'Consonant', ipa: '/h/', mnemonic: 'Sky', example: '하늘 ☁️' },

    // Vowels (Mo-um)
    { char: 'ㅏ', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'Father', example: '아버지 👨' },
    { char: 'ㅑ', name: 'ya', type: 'Vowel', ipa: '/ja/', mnemonic: 'Baseball', example: '야구 ⚾' },
    { char: 'ㅓ', name: 'eo', type: 'Vowel', ipa: '/ʌ/', mnemonic: 'Mother', example: '어머니 👩' },
    { char: 'ㅕ', name: 'yeo', type: 'Vowel', ipa: '/jʌ/', mnemonic: 'Fox', example: '여우 🦊' },
    { char: 'ㅗ', name: 'o', type: 'Vowel', ipa: '/o/', mnemonic: 'Duck', example: '오리 🦆' },
    { char: '요', name: 'yo', type: 'Vowel', ipa: '/jo/', mnemonic: 'Cooking', example: '요리 🍳' },
    { char: 'ㅜ', name: 'u', type: 'Vowel', ipa: '/u/', mnemonic: 'Milk', example: '우유 🥛' },
    { char: 'ㅠ', name: 'yu', type: 'Vowel', ipa: '/ju/', mnemonic: 'Glass', example: '유리 🍸' },
    { char: 'ㅡ', name: 'eu', type: 'Vowel', ipa: '/ɯ/', mnemonic: 'Doctor', example: '의사 🧑‍⚕️' },
    { char: 'ㅣ', name: 'i', type: 'Vowel', ipa: '/i/', mnemonic: 'Tooth', example: '이 🦷' }
  ],

  // --- JAPANESE HIRAGANA (FULL 46) ---
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

  // --- ARABIC (FULL 28) ---
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
    { char: 'و', name: 'waw', type: 'Vowel', ipa: '/w/', mnemonic: 'Whirlpool', example: 'وردة 🌹' },
    { char: 'ي', name: 'yaa', type: 'Vowel', ipa: '/j/', mnemonic: 'Swan 2 dots', example: 'يد ✋' }
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
    { phrase: 'દોડવું (Dodvu)', meaning: 'To Run', icon: '🏃', phonetic: 'dod-voo', type: 'Action Verb' }
  ],
  mr: [
    { phrase: 'नमस्कार (Namaskar)', meaning: 'Hello / Greetings!', icon: '🙏', phonetic: 'nah-mas-kar', type: 'Greeting' },
    { phrase: 'शुभ प्रभात (Shubh Prabhat)', meaning: 'Good morning!', icon: '🌅', phonetic: 'shoobh pra-bhat', type: 'Greeting' },
    { phrase: 'पळणे (Palne)', meaning: 'To Run', icon: '🏃', phonetic: 'pal-ney', type: 'Action Verb' }
  ],
  fr: [
    { phrase: 'Bonjour!', meaning: 'Hello / Good day!', icon: '👋', phonetic: 'bon-zhoor', type: 'Greeting' },
    { phrase: 'Merci beaucoup!', meaning: 'Thank you very much!', icon: '🙏', phonetic: 'mair-see boh-koo', type: 'Greeting' },
    { phrase: 'Courir', meaning: 'To Run', icon: '🏃', phonetic: 'koo-reer', type: 'Action Verb' }
  ],
  de: [
    { phrase: 'Hallo!', meaning: 'Hello / Hi!', icon: '👋', phonetic: 'hah-loh', type: 'Greeting' },
    { phrase: 'Guten Morgen!', meaning: 'Good morning!', icon: '🌅', phonetic: 'goo-ten mor-gen', type: 'Greeting' },
    { phrase: 'Laufen', meaning: 'To Run', icon: '🏃', phonetic: 'low-fen', type: 'Action Verb' }
  ],
  es: [
    { phrase: '¡Hola!', meaning: 'Hello / Hi!', icon: '👋', phonetic: 'oh-lah', type: 'Greeting' },
    { phrase: '¡Buenos días!', meaning: 'Good morning!', icon: '🌅', phonetic: 'bway-nohs dee-ahs', type: 'Greeting' },
    { phrase: 'Correr', meaning: 'To Run', icon: '🏃', phonetic: 'koh-rrehr', type: 'Action Verb' }
  ],
  ru: [
    { phrase: 'Привет!', meaning: 'Hello!', icon: '👋', phonetic: 'pree-vyet', type: 'Greeting' },
    { phrase: 'Доброе утро!', meaning: 'Good morning!', icon: '🌅', phonetic: 'dob-roy-e oo-tro', type: 'Greeting' }
  ],
  el: [
    { phrase: 'Γειά σου! (Geia sou)', meaning: 'Hello!', icon: '👋', phonetic: 'yah soo', type: 'Greeting' },
    { phrase: 'Καλημέρα! (Kalimera)', meaning: 'Good morning!', icon: '🌅', phonetic: 'kah-lee-meh-rah', type: 'Greeting' }
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
        { native: 'હે कितीचे आहे? (He kitiche aahe?)', english: 'How much is this?', phonetic: 'he kee-tee-che aa-he' },
        { native: 'पाणी द्या, कृपया। (Paani dya, kripaya)', english: 'Please give water.', phonetic: 'paa-nee dya kri-pa-ya' }
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
  ]
};

export const LANGUAGE_NUMBERS = {
  gu: [
    { num: 1, native: '૧', word: 'એક (Ek)', phonetic: 'ek' },
    { num: 2, native: '૨', word: 'બે (Be)', phonetic: 'be' },
    { num: 3, native: '૩', word: 'ત્રણ (Tran)', phonetic: 'tran' }
  ],
  mr: [
    { num: 1, native: '१', word: 'एक (Ek)', phonetic: 'ek' },
    { num: 2, native: '२', word: 'दोन (Don)', phonetic: 'don' }
  ]
};

export const VISUAL_VOCABULARY = {
  gu: [
    { id: 'cat', word: 'બિલાડી (Biladi)', meaning: 'The Cat', category: 'Animals', icon: '🐱', phonetic: 'bi-la-di' },
    { id: 'dog', word: 'કુતરો (Kutro)', meaning: 'The Dog', category: 'Animals', icon: '🐕', phonetic: 'koo-tro' }
  ]
};

export const GRAPHIC_NOVEL_STORIES = {
  gu: [
    {
      title: "ભાગ ૧: જાદુઈ બગીચાની સફર (Quest for Magic Garden)",
      panels: [
        { speaker: "Poly Parrot 🦜", speech: "નમસ્તે મિત્રો! આજે આપણે જાદુઈ બગીચાની સફરે જઈએ છીએ!", translation: "Hello friends! Today we are going on a quest to the magic garden!" },
        { speaker: "Dino REX 🦖", speech: "વાહ! ત્યાં મીઠાં ફળો અને સુંદર નદીઓ હશે?", translation: "Wow! Will there be sweet fruits and beautiful rivers there?" }
      ]
    }
  ]
};
