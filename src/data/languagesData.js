// ═══════════════════════════════════════════════════════════════
//  POLYGLOT PLANET - MASSIVE GLOBAL LANGUAGES ACADEMY (AUTHENTIC EUROPEAN & WORLD SCRIPTS)
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
  // --- SPANISH (Includes Ñ) ---
  es: [
    ...LATIN_ALPHABET.slice(0, 14),
    { char: 'Ñ', name: 'eñe', type: 'Consonant', ipa: '/ɲ/', mnemonic: 'Yam', example: 'Niño 👦' },
    ...LATIN_ALPHABET.slice(14)
  ],

  // --- GERMAN (Includes Ä, Ö, Ü, ß) ---
  de: [
    ...LATIN_ALPHABET,
    { char: 'Ä', name: 'a-umlaut', type: 'Vowel', ipa: '/ɛ/', mnemonic: 'Apple Umlaut', example: 'Äpfel 🍎' },
    { char: 'Ö', name: 'o-umlaut', type: 'Vowel', ipa: '/ø/', mnemonic: 'Oil Umlaut', example: 'Öl 🛢️' },
    { char: 'Ü', name: 'u-umlaut', type: 'Vowel', ipa: '/y/', mnemonic: 'Over Umlaut', example: 'Über 🚕' },
    { char: 'ß', name: 'eszett', type: 'Consonant', ipa: '/s/', mnemonic: 'Sharp S', example: 'Straße 🛣️' }
  ],

  // --- SWEDISH (Includes Å, Ä, Ö) ---
  sv: [
    ...LATIN_ALPHABET,
    { char: 'Å', name: 'å', type: 'Vowel', ipa: '/oː/', mnemonic: 'Stream', example: 'Å 🌊' },
    { char: 'Ä', name: 'ä', type: 'Vowel', ipa: '/ɛː/', mnemonic: 'Apple', example: 'Äpple 🍎' },
    { char: 'Ö', name: 'ö', type: 'Vowel', ipa: '/øː/', mnemonic: 'Island', example: 'Ö 🏝️' }
  ],

  // --- POLISH (Includes Ą, Ć, Ę, Ł, Ń, Ó, Ś, Ź, Ż) ---
  pl: [
    ...LATIN_ALPHABET,
    { char: 'Ą', name: 'ą', type: 'Vowel', ipa: '/ɔ̃/', mnemonic: 'Nasal A', example: 'Mąż 👨' },
    { char: 'Ć', name: 'ć', type: 'Consonant', ipa: '/t͡ɕ/', mnemonic: 'Soft Ch', example: 'Ćma 🦋' },
    { char: 'Ę', name: 'ę', type: 'Vowel', ipa: '/ɛ̃/', mnemonic: 'Nasal E', example: 'Gęś 🪿' },
    { char: 'Ł', name: 'ł', type: 'Consonant', ipa: '/w/', mnemonic: 'Stroke L', example: 'Łódź ⛵' },
    { char: 'Ń', name: 'ń', type: 'Consonant', ipa: '/ɲ/', mnemonic: 'Soft N', example: 'Koń 🐎' },
    { char: 'Ó', name: 'ó', type: 'Vowel', ipa: '/u/', mnemonic: 'U Sound', example: 'Ósemka 8️⃣' },
    { char: 'Ś', name: 'ś', type: 'Consonant', ipa: '/ɕ/', mnemonic: 'Soft Sh', example: 'Śnieg ❄️' },
    { char: 'Ź', name: 'ź', type: 'Consonant', ipa: '/ʑ/', mnemonic: 'Soft Zh', example: 'Źrebak 🐴' },
    { char: 'Ż', name: 'ż', type: 'Consonant', ipa: '/ʐ/', mnemonic: 'Hard Zh', example: 'Żaba 🐸' }
  ],

  // --- GREEK (HELLENIC SCRIPT - 24 LETTERS) ---
  el: [
    { char: 'Α', name: 'Alpha', type: 'Vowel', ipa: '/a/', mnemonic: 'Star', example: 'Αστέρι ⭐️' },
    { char: 'Β', name: 'Beta', type: 'Consonant', ipa: '/v/', mnemonic: 'Book', example: 'Βιβλίο 📖' },
    { char: 'Γ', name: 'Gamma', type: 'Consonant', ipa: '/ɣ/', mnemonic: 'Cat', example: 'Γάτα 🐱' },
    { char: 'Δ', name: 'Delta', type: 'Consonant', ipa: '/ð/', mnemonic: 'Tree', example: 'Дέντρο 🌳' },
    { char: 'Ε', name: 'Epsilon', type: 'Vowel', ipa: '/e/', mnemonic: 'Elephant', example: 'Ελέφαντας 🐘' },
    { char: 'Ζ', name: 'Zeta', type: 'Consonant', ipa: '/z/', mnemonic: 'Animal', example: 'Ζώο 🦁' },
    { char: 'Η', name: 'Eta', type: 'Vowel', ipa: '/i/', mnemonic: 'Sun', example: 'Ήλιος ☀️' },
    { char: 'Θ', name: 'Theta', type: 'Consonant', ipa: '/θ/', mnemonic: 'Sea', example: 'Θάλασσα 🌊' },
    { char: 'Ι', name: 'Iota', type: 'Vowel', ipa: '/i/', mnemonic: 'Horse', example: 'Ίππος 🐎' },
    { char: 'Κ', name: 'Kappa', type: 'Consonant', ipa: '/k/', mnemonic: 'Heart', example: 'Карδιά 💖' },
    { char: 'Λ', name: 'Lambda', type: 'Consonant', ipa: '/l/', mnemonic: 'Lion', example: 'Лιοντάρι 🦁' },
    { char: 'Μ', name: 'Mu', type: 'Consonant', ipa: '/m/', mnemonic: 'Apple', example: 'Μήλο 🍎' },
    { char: 'Ν', name: 'Nu', type: 'Consonant', ipa: '/n/', mnemonic: 'Water', example: 'Νερό 💧' },
    { char: 'Ξ', name: 'Xi', type: 'Consonant', ipa: '/ks/', mnemonic: 'Wood', example: 'Ξύλο 🪵' },
    { char: 'Ο', name: 'Omicron', type: 'Vowel', ipa: '/o/', mnemonic: 'Sky', example: 'Оυρανός ☁️' },
    { char: 'Π', name: 'Pi', type: 'Consonant', ipa: '/p/', mnemonic: 'Bird', example: 'Пτηνό 🐦' },
    { char: 'Ρ', name: 'Rho', type: 'Consonant', ipa: '/r/', mnemonic: 'Rose', example: 'Ρόδο 🌹' },
    { char: 'Σ', name: 'Sigma', type: 'Consonant', ipa: '/s/', mnemonic: 'House', example: 'Σπίτι 🏠' },
    { char: 'Τ', name: 'Tau', type: 'Consonant', ipa: '/t/', mnemonic: 'Song', example: 'ΤραγοÚδι 🎵' },
    { char: 'Υ', name: 'Upsilon', type: 'Vowel', ipa: '/y/', mnemonic: 'Sleep', example: 'Ύπνος 😴' },
    { char: 'Φ', name: 'Phi', type: 'Consonant', ipa: '/f/', mnemonic: 'Light', example: 'Фώς 💡' },
    { char: 'Χ', name: 'Chi', type: 'Consonant', ipa: '/x/', mnemonic: 'Hand', example: 'Χέρι ✋' },
    { char: 'Ψ', name: 'Psi', type: 'Consonant', ipa: '/ps/', mnemonic: 'Fish', example: 'Ψάρι 🐟' },
    { char: 'Ω', name: 'Omega', type: 'Vowel', ipa: '/o/', mnemonic: 'Hour', example: 'Ώρα ⏰' }
  ],

  // --- RUSSIAN (CYRILLIC SCRIPT - 33 LETTERS) ---
  ru: [
    { char: 'А', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'Watermelon', example: 'Арбуз 🍉' },
    { char: 'Б', name: 'be', type: 'Consonant', ipa: '/b/', mnemonic: 'Banana', example: 'Банан 🍌' },
    { char: 'В', name: 've', type: 'Consonant', ipa: '/v/', mnemonic: 'Wolf', example: 'Волк 🐺' },
    { char: 'Г', name: 'ge', type: 'Consonant', ipa: '/g/', mnemonic: 'Mushroom', example: 'Гриб 🍄' },
    { char: 'Д', name: 'de', type: 'Consonant', ipa: '/d/', mnemonic: 'House', example: 'Дом 🏠' },
    { char: 'Е', name: 'ye', type: 'Vowel', ipa: '/je/', mnemonic: 'Spruce', example: 'Ель 🌲' },
    { char: 'Ё', name: 'yo', type: 'Vowel', ipa: '/jo/', mnemonic: 'Hedgehog', example: 'Ёж 🦔' },
    { char: 'Ж', name: 'zhe', type: 'Consonant', ipa: '/ʐ/', mnemonic: 'Beetle', example: 'Жук 🪲' },
    { char: 'З', name: 'ze', type: 'Consonant', ipa: '/z/', mnemonic: 'Star', example: 'Звезда ⭐️' },
    { char: 'И', name: 'i', type: 'Vowel', ipa: '/i/', mnemonic: 'Needle', example: 'Игла 🪡' },
    { char: 'Й', name: 'short-i', type: 'Consonant', ipa: '/j/', mnemonic: 'Yogurt', example: 'Йогурт 🥛' },
    { char: 'К', name: 'ka', type: 'Consonant', ipa: '/k/', mnemonic: 'Cat', example: 'Кот 🐱' },
    { char: 'Л', name: 'el', type: 'Consonant', ipa: '/l/', mnemonic: 'Fox', example: 'Лиса 🦊' },
    { char: 'М', name: 'em', type: 'Consonant', ipa: '/m/', mnemonic: 'Bear', example: 'Медведь 🐻' },
    { char: 'Н', name: 'en', type: 'Consonant', ipa: '/n/', mnemonic: 'Rhino', example: 'Носорог 🦏' },
    { char: 'О', name: 'o', type: 'Vowel', ipa: '/o/', mnemonic: 'Cloud', example: 'Облако ☁️' },
    { char: 'П', name: 'pe', type: 'Consonant', ipa: '/p/', mnemonic: 'Train', example: 'Поезд 🚆' },
    { char: 'Р', name: 'er', type: 'Consonant', ipa: '/r/', mnemonic: 'Fish', example: 'Рыба 🐟' },
    { char: 'С', name: 'es', type: 'Consonant', ipa: '/s/', mnemonic: 'Elephant', example: 'Слон 🐘' },
    { char: 'Т', name: 'te', type: 'Consonant', ipa: '/t/', mnemonic: 'Tiger', example: 'Тигр 🐅' },
    { char: 'У', name: 'u', type: 'Vowel', ipa: '/u/', mnemonic: 'Duck', example: 'Утка 🦆' },
    { char: 'Ф', name: 'ef', type: 'Consonant', ipa: '/f/', mnemonic: 'Flag', example: 'Флаг 🚩' },
    { char: 'Х', name: 'kha', type: 'Consonant', ipa: '/x/', mnemonic: 'Bread', example: 'Хлеб 🍞' },
    { char: 'Ц', name: 'tse', type: 'Consonant', ipa: '/t͡s/', mnemonic: 'Flower', example: 'Цветок 🌸' },
    { char: 'Ч', name: 'che', type: 'Consonant', ipa: '/t͡ɕ/', mnemonic: 'Tea', example: 'Чай ☕' },
    { char: 'Ш', name: 'sha', type: 'Consonant', ipa: '/ʂ/', mnemonic: 'Ball', example: 'Шарик 🎈' },
    { char: 'Щ', name: 'shcha', type: 'Consonant', ipa: '/ɕː/', mnemonic: 'Pike', example: 'Щука 🐟' },
    { char: 'Э', name: 'e', type: 'Vowel', ipa: '/ɛ/', mnemonic: 'Eskimo', example: 'Эскимо 🍦' },
    { char: 'Ю', name: 'yu', type: 'Vowel', ipa: '/ju/', mnemonic: 'Skirt', example: 'Юбка 👗' },
    { char: 'Я', name: 'ya', type: 'Vowel', ipa: '/ja/', mnemonic: 'Apple', example: 'Яблоко 🍎' }
  ],

  // --- UKRAINIAN (CYRILLIC SCRIPT - 33 LETTERS) ---
  uk: [
    { char: 'А', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'Pineapple', example: 'Ананас 🍍' },
    { char: 'Б', name: 'be', type: 'Consonant', ipa: '/b/', mnemonic: 'Banana', example: 'Банан 🍌' },
    { char: 'В', name: 've', type: 'Consonant', ipa: '/v/', mnemonic: 'Water', example: 'Вода 💧' },
    { char: 'Г', name: 'he', type: 'Consonant', ipa: '/ɦ/', mnemonic: 'Mountain', example: 'Гора ⛰️' },
    { char: 'Ґ', name: 'ge', type: 'Consonant', ipa: '/g/', mnemonic: 'Button', example: 'Ґудзик 🔘' },
    { char: 'Д', name: 'de', type: 'Consonant', ipa: '/d/', mnemonic: 'Tree', example: 'Дерево 🌳' },
    { char: 'Е', name: 'e', type: 'Vowel', ipa: '/ɛ/', mnemonic: 'Excursion', example: 'Екскурсія 🚌' },
    { char: 'Є', name: 'ye', type: 'Vowel', ipa: '/jɛ/', mnemonic: 'Raccoon', example: 'Єнот 🦝' },
    { char: 'Ж', name: 'zhe', type: 'Consonant', ipa: '/ʒ/', mnemonic: 'Toad', example: 'Жаба 🐸' },
    { char: 'З', name: 'ze', type: 'Consonant', ipa: '/z/', mnemonic: 'Hare', example: 'Заєць 🐇' },
    { char: 'И', name: 'y', type: 'Vowel', ipa: '/ɪ/', mnemonic: 'Needle', example: 'Ирій 🕊️' },
    { char: 'І', name: 'i', type: 'Vowel', ipa: '/i/', mnemonic: 'Needle', example: 'Голка 🪡' },
    { char: 'Ї', name: 'yi', type: 'Vowel', ipa: '/ji/', mnemonic: 'Hedgehog', example: 'Їжак 🦔' },
    { char: 'К', name: 'ka', type: 'Consonant', ipa: '/k/', mnemonic: 'Cat', example: 'Кіт 🐱' },
    { char: 'Л', name: 'el', type: 'Consonant', ipa: '/l/', mnemonic: 'Lion', example: 'Лев 🦁' },
    { char: 'М', name: 'em', type: 'Consonant', ipa: '/m/', mnemonic: 'City', example: 'Місто 🏙️' },
    { char: 'Н', name: 'en', type: 'Consonant', ipa: '/n/', mnemonic: 'Sky', example: 'Небо ☁️' },
    { char: 'О', name: 'o', type: 'Vowel', ipa: '/ɔ/', mnemonic: 'Eagle', example: 'Орел 🦅' },
    { char: 'П', name: 'pe', type: 'Consonant', ipa: '/p/', mnemonic: 'Bird', example: 'Птах 🐦' },
    { char: 'Р', name: 'er', type: 'Consonant', ipa: '/r/', mnemonic: 'Fish', example: 'Риба 🐟' },
    { char: 'С', name: 'es', type: 'Consonant', ipa: '/s/', mnemonic: 'Sun', example: 'Сонце ☀️' },
    { char: 'Т', name: 'te', type: 'Consonant', ipa: '/t/', mnemonic: 'Tiger', example: 'Тигр 🐅' },
    { char: 'У', name: 'u', type: 'Vowel', ipa: '/u/', mnemonic: 'Morning', example: 'Ранок 🌅' },
    { char: 'Ф', name: 'ef', type: 'Consonant', ipa: '/f/', mnemonic: 'Lantern', example: 'Ліхтар 🏮' },
    { char: 'Х', name: 'kha', type: 'Consonant', ipa: '/x/', mnemonic: 'Bread', example: 'Хліб 🍞' },
    { char: 'Ц', name: 'tse', type: 'Consonant', ipa: '/t͡s/', mnemonic: 'Sugar', example: 'Цукор 🍬' },
    { char: 'Ч', name: 'che', type: 'Consonant', ipa: '/t͡ʃ/', mnemonic: 'Cup', example: 'Чашка ☕' },
    { char: 'Ш', name: 'sha', type: 'Consonant', ipa: '/ʃ/', mnemonic: 'Pinecone', example: 'Шишка 🌲' },
    { char: 'Щ', name: 'shcha', type: 'Consonant', ipa: '/ʃt͡ʃ/', mnemonic: 'Pike', example: 'Щука 🐟' },
    { char: 'Ю', name: 'yu', type: 'Vowel', ipa: '/ju/', mnemonic: 'Youth', example: 'Юність 👦' },
    { char: 'Я', name: 'ya', type: 'Vowel', ipa: '/ja/', mnemonic: 'Apple', example: 'Яблуко 🍎' }
  ],

  // --- GUJARATI (FULL VOWELS + CONSONANTS) ---
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

  // --- MARATHI ---
  mr: [
    { char: 'अ', name: 'a', type: 'Vowel', ipa: '/ə/', mnemonic: 'Pineapple', example: 'अननस 🍍' },
    { char: 'आ', name: 'aa', type: 'Vowel', ipa: '/aː/', mnemonic: 'Mango', example: 'आंबा 🥭' },
    { char: 'इ', name: 'i', type: 'Vowel', ipa: '/ɪ/', mnemonic: 'Tamarind', example: 'चिंच 🍬' },
    { char: 'क', name: 'ka', type: 'Consonant', ipa: '/kə/', mnemonic: 'Cup', example: 'कप ☕' },
    { char: 'ख', name: 'kha', type: 'Consonant', ipa: '/kʰə/', mnemonic: 'Window', example: 'खिडकी 🪟' }
  ],

  // --- BENGALI ---
  bn: [
    { char: 'অ', name: 'o', type: 'Vowel', ipa: '/ɔ/', mnemonic: 'Mango', example: 'আম 🥭' },
    { char: 'আ', name: 'aa', type: 'Vowel', ipa: '/a/', mnemonic: 'Sky', example: 'আকাশ ☁️' },
    { char: 'ক', name: 'ko', type: 'Consonant', ipa: '/k/', mnemonic: 'Banana', example: 'কলা 🍌' }
  ],

  // --- TELUGU ---
  te: [
    { char: 'అ', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'Mother', example: 'అమ్మ 👩' },
    { char: 'ఆ', name: 'aa', type: 'Vowel', ipa: '/aː/', mnemonic: 'Cow', example: 'ఆవు 🐄' },
    { char: 'క', name: 'ka', type: 'Consonant', ipa: '/k/', mnemonic: 'Lotus', example: 'కమలం 🪷' }
  ],

  // --- TAMIL ---
  ta: [
    { char: 'அ', name: 'a', type: 'Vowel', ipa: '/ʌ/', mnemonic: 'Mother', example: 'அம்மா 👩' },
    { char: 'ஆ', name: 'aa', type: 'Vowel', ipa: '/aː/', mnemonic: 'Goat', example: 'ஆடு 🐐' },
    { char: 'க', name: 'ka', type: 'Consonant', ipa: '/k/', mnemonic: 'Eye', example: 'கண் 👁️' }
  ],

  // --- MALAYALAM ---
  ml: [
    { char: 'അ', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'Elephant', example: 'ആന 🐘' },
    { char: 'ആ', name: 'aa', type: 'Vowel', ipa: '/aː/', mnemonic: 'Tortoise', example: 'ആമ 🐢' }
  ],

  // --- KANNADA ---
  kn: [
    { char: 'ಅ', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'Mother', example: 'ಅಮ್ಮ 👩' },
    { char: 'ಆ', name: 'aa', type: 'Vowel', ipa: '/aː/', mnemonic: 'Elephant', example: 'ಆನೆ 🐘' }
  ],

  // --- HINDI ---
  hi: [
    { char: 'अ', name: 'a', type: 'Vowel', ipa: '/ə/', mnemonic: 'Pomegranate', example: 'अनार 🍎' },
    { char: 'आ', name: 'aa', type: 'Vowel', ipa: '/aː/', mnemonic: 'Mango', example: 'आम 🥭' },
    { char: 'क', name: 'ka', type: 'Consonant', ipa: '/kə/', mnemonic: 'Lotus', example: 'कमल 🪷' }
  ],

  // --- THAI ---
  th: [
    { char: 'ก', name: 'Gor Kai', type: 'Consonant', ipa: '/k/', mnemonic: 'Chicken', example: 'ไก่ 🐔' },
    { char: 'ข', name: 'Khor Khai', type: 'Consonant', ipa: '/kʰ/', mnemonic: 'Egg', example: 'ไข่ 🥚' }
  ],

  // --- MANDARIN ---
  zh: [
    { char: 'ā', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'First Tone', example: '阿姨 👩' },
    { char: 'ō', name: 'o', type: 'Vowel', ipa: '/o/', mnemonic: 'Rooster', example: '嗷嗷 🐓' }
  ],

  // --- KOREAN ---
  ko: [
    { char: 'ㄱ', name: 'giyok', type: 'Consonant', ipa: '/k/', mnemonic: 'Bag', example: '가방 🎒' },
    { char: 'ㄴ', name: 'nieun', type: 'Consonant', ipa: '/n/', mnemonic: 'Tree', example: '나무 🌳' }
  ],

  // --- JAPANESE ---
  ja: [
    { char: 'あ', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'Kangaroo', example: 'あめ 🍬' },
    { char: 'い', name: 'i', type: 'Vowel', ipa: '/i/', mnemonic: 'Two Eels', example: 'いぬ 🐕' }
  ],

  // --- ARABIC ---
  ar: [
    { char: 'أ', name: 'alif', type: 'Vowel', ipa: '/aː/', mnemonic: 'Pine Tree', example: 'أسد 🦁' }
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
    { phrase: 'Каλημέρα! (Kalimera)', meaning: 'Good morning!', icon: '🌅', phonetic: 'kah-lee-meh-rah', type: 'Greeting' }
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
