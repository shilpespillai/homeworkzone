// ═══════════════════════════════════════════════════════════════
//  POLYGLOT PLANET - COMPREHENSIVE GLOBAL LANGUAGE DATABASE
// ═══════════════════════════════════════════════════════════════

export const SUPPORTED_LEARNING_LANGUAGES = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸', native: 'Español', scriptType: 'latin', family: 'Romance' },
  { code: 'fr', name: 'French', flag: '🇫🇷', native: 'Français', scriptType: 'latin', family: 'Romance' },
  { code: 'de', name: 'German', flag: '🇩🇪', native: 'Deutsch', scriptType: 'latin', family: 'Germanic' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', native: 'हिन्दी', scriptType: 'devanagari', family: 'Indo-Aryan' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', native: '日本語', scriptType: 'kana', family: 'Japonic' },
  { code: 'zh', name: 'Mandarin Chinese', flag: '🇨🇳', native: '中文', scriptType: 'hanzi', family: 'Sino-Tibetan' },
  { code: 'ar', name: 'Arabic', flag: '🇦🇪', native: 'العربية', scriptType: 'arabic_rtl', family: 'Afroasiatic' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳', native: 'தமிழ்', scriptType: 'indic', family: 'Dravidian' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', native: 'Italiano', scriptType: 'latin', family: 'Romance' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', native: 'Русский', scriptType: 'cyrillic', family: 'Slavic' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', native: '한국어', scriptType: 'hangul', family: 'Koreanic' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷', native: 'Português', scriptType: 'latin', family: 'Romance' }
];

// Level 0: Alphabets, Characters & Stroke Tracing Data
export const LANGUAGE_ALPHABETS = {
  es: [
    { char: 'A', name: 'a', ipa: '/a/', mnemonic: '🍎 Apple (Manzana)', example: 'Agua 💧 (Water)', audioText: 'Ah' },
    { char: 'B', name: 'be', ipa: '/b/', mnemonic: '⛵ Boat (Barco)', example: 'Barco ⛵ (Boat)', audioText: 'Bay' },
    { char: 'C', name: 'ce', ipa: '/k/', mnemonic: '🏠 House (Casa)', example: 'Casa 🏠 (House)', audioText: 'Say' },
    { char: 'D', name: 'de', ipa: '/d/', mnemonic: '🎲 Dice (Dado)', example: 'Dado 🎲 (Dice)', audioText: 'Day' },
    { char: 'E', name: 'e', ipa: '/e/', mnemonic: '🐘 Elephant (Elefante)', example: 'Elefante 🐘 (Elephant)', audioText: 'Eh' },
    { char: 'F', name: 'efe', ipa: '/f/', mnemonic: '🔥 Fire (Fuego)', example: 'Fuego 🔥 (Fire)', audioText: 'Eh-fay' },
    { char: 'G', name: 'ge', ipa: '/g/', mnemonic: '🐱 Cat (Gato)', example: 'Gato 🐱 (Cat)', audioText: 'Hay' }
  ],
  hi: [
    { char: 'अ', name: 'a', ipa: '/ə/', mnemonic: '🥭 Mango (Amr)', example: 'अनार 🍎 (Pomegranate)', audioText: 'Uh' },
    { char: 'आ', name: 'aa', ipa: '/aː/', mnemonic: '🥭 Mango (Aam)', example: 'आम 🥭 (Mango)', audioText: 'Aa' },
    { char: 'इ', name: 'i', ipa: '/ɪ/', mnemonic: '🧱 Building (Imarat)', example: 'इमली 🍬 (Tamarind)', audioText: 'Ih' },
    { char: 'ई', name: 'ee', ipa: '/iː/', mnemonic: '🌾 Sugarcane (Eekh)', example: 'ईख 🌾 (Sugarcane)', audioText: 'Ee' },
    { char: 'क', name: 'ka', ipa: '/kə/', mnemonic: 'Lotus (Kamal)', example: 'कमल 🪷 (Lotus)', audioText: 'Kah' },
    { char: 'ख', name: 'kha', ipa: '/kʰə/', mnemonic: 'Rabbit (Khargosh)', example: 'खरगोश 🐇 (Rabbit)', audioText: 'Khah' }
  ],
  ja: [
    { char: 'あ', name: 'a', ipa: '/a/', mnemonic: '🦘 Kangaroo holding pouch', example: 'あめ 🍬 (Candy)', audioText: 'Ah' },
    { char: 'い', name: 'i', ipa: '/i/', mnemonic: '🐕 Two Eels swimming', example: 'いぬ 🐕 (Dog)', audioText: 'Ee' },
    { char: 'う', name: 'u', ipa: '/u/', mnemonic: '🐈 Heavy bag on back', example: '海 🌊 (Sea)', audioText: 'Oo' },
    { char: 'え', name: 'e', ipa: '/e/', mnemonic: '🪶 Exotic bird', example: 'えんぴつ ✏️ (Pencil)', audioText: 'Eh' },
    { char: 'お', name: 'o', ipa: '/o/', mnemonic: '⛳ Golf player golfing', example: 'おにぎり 🍙 (Rice ball)', audioText: 'Oh' }
  ],
  fr: [
    { char: 'A', name: 'a', ipa: '/a/', mnemonic: '🛩️ Airplane (Avion)', example: 'Avion 🛩️ (Airplane)', audioText: 'Ah' },
    { char: 'B', name: 'bé', ipa: '/b/', mnemonic: '🚤 Boat (Bateau)', example: 'Bateau 🚤 (Boat)', audioText: 'Bay' },
    { char: 'C', name: 'cé', ipa: '/k/', mnemonic: '🐶 Dog (Chien)', example: 'Chat 🐱 (Cat)', audioText: 'Say' },
    { char: 'D', name: 'dé', ipa: '/d/', mnemonic: '🐬 Dolphin (Dauphin)', example: 'Dauphin 🐬 (Dolphin)', audioText: 'Day' }
  ],
  ar: [
    { char: 'أ', name: 'alif', ipa: '/aː/', mnemonic: '🌲 Tall Pine Tree', example: 'أسد 🦁 (Lion)', audioText: 'Alif' },
    { char: 'ب', name: 'baa', ipa: '/b/', mnemonic: '⛵ Boat with one dot below', example: 'بيت 🏠 (House)', audioText: 'Baa' },
    { char: 'ت', name: 'taa', ipa: '/t/', mnemonic: 'Smile with two eyes above', example: 'تفاحة 🍎 (Apple)', audioText: 'Taa' },
    { char: 'ث', name: 'thaa', ipa: '/θ/', mnemonic: 'Pyramid of three dots above', example: 'ثعلب 🦊 (Fox)', audioText: 'Thaa' }
  ]
};

// Level 1: Visual Hero Vocabulary Items (1,000+ Words Structure with 3D Image URLs)
export const VISUAL_VOCABULARY = {
  es: [
    { id: 'sun', word: 'El Sol', meaning: 'The Sun', category: 'Nature', image: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?auto=format&fit=crop&w=800&q=80', phonetic: 'el sohl', type: 'noun' },
    { id: 'cat', word: 'El Gato', meaning: 'The Cat', category: 'Animals', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80', phonetic: 'el gah-toh', type: 'noun' },
    { id: 'apple', word: 'La Manzana', meaning: 'The Apple', category: 'Food', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80', phonetic: 'lah mahn-sah-nah', type: 'noun' },
    { id: 'house', word: 'La Casa', meaning: 'The House', category: 'Home', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80', phonetic: 'lah kah-sah', type: 'noun' },
    { id: 'car', word: 'El Coche', meaning: 'The Car', category: 'Transport', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80', phonetic: 'el koh-chay', type: 'noun' },
    { id: 'run', word: 'Correr', meaning: 'To Run', category: 'Actions', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80', phonetic: 'koh-rrehr', type: 'verb' },
    { id: 'eat', word: 'Comer', meaning: 'To Eat', category: 'Actions', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80', phonetic: 'koh-mehr', type: 'verb' }
  ],
  hi: [
    { id: 'sun', word: 'सूरज (Suraj)', meaning: 'The Sun', category: 'Nature', image: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?auto=format&fit=crop&w=800&q=80', phonetic: 'soo-raj', type: 'noun' },
    { id: 'cat', word: 'बिल्ली (Billi)', meaning: 'The Cat', category: 'Animals', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80', phonetic: 'bil-lee', type: 'noun' },
    { id: 'apple', word: 'सेब (Seb)', meaning: 'The Apple', category: 'Food', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80', phonetic: 'sayb', type: 'noun' },
    { id: 'house', word: 'घर (Ghar)', meaning: 'The House', category: 'Home', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80', phonetic: 'ghar', type: 'noun' }
  ],
  ja: [
    { id: 'cat', word: '猫 (Neko)', meaning: 'The Cat', category: 'Animals', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80', phonetic: 'neh-koh', type: 'noun' },
    { id: 'sun', word: '太陽 (Taiyou)', meaning: 'The Sun', category: 'Nature', image: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?auto=format&fit=crop&w=800&q=80', phonetic: 'ta-ee-yoh', type: 'noun' },
    { id: 'apple', word: 'りんご (Ringo)', meaning: 'The Apple', category: 'Food', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80', phonetic: 'reen-goh', type: 'noun' }
  ],
  fr: [
    { id: 'cat', word: 'Le Chat', meaning: 'The Cat', category: 'Animals', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80', phonetic: 'luh shah', type: 'noun' },
    { id: 'sun', word: 'Le Soleil', meaning: 'The Sun', category: 'Nature', image: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?auto=format&fit=crop&w=800&q=80', phonetic: 'luh so-lay', type: 'noun' }
  ]
};

// Level 3: Color-Coded Lego Grammar Sentences
export const GRAMMAR_SENTENCES = {
  es: [
    {
      targetSentence: "El gato come la manzana",
      englishTranslation: "The cat eats the apple",
      blocks: [
        { id: 'b1', text: 'El gato 🐱', type: 'noun', color: 'bg-emerald-500 text-white' },
        { id: 'b2', text: 'come 🍽️', type: 'verb', color: 'bg-blue-600 text-white' },
        { id: 'b3', text: 'la manzana 🍎', type: 'noun', color: 'bg-emerald-500 text-white' }
      ]
    },
    {
      targetSentence: "El coche rápido corre en el parque",
      englishTranslation: "The fast car runs in the park",
      blocks: [
        { id: 'b1', text: 'El coche 🚗', type: 'noun', color: 'bg-emerald-500 text-white' },
        { id: 'b2', text: 'rápido ⚡', type: 'adj', color: 'bg-amber-400 text-slate-950' },
        { id: 'b3', text: 'corre 🏃', type: 'verb', color: 'bg-blue-600 text-white' },
        { id: 'b4', text: 'en el parque 🌳', type: 'place', color: 'bg-rose-500 text-white' }
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
      targetSentence: "猫がらんごを食べます",
      englishTranslation: "The cat eats an apple",
      blocks: [
        { id: 'b1', text: '猫 (Neko) 🐱', type: 'noun', color: 'bg-emerald-500 text-white' },
        { id: 'b2', text: 'りんご (Ringo) 🍎', type: 'noun', color: 'bg-emerald-500 text-white' },
        { id: 'b3', text: 'を食べます (Tabemasu) 🍽️', type: 'verb', color: 'bg-blue-600 text-white' }
      ]
    }
  ]
};
