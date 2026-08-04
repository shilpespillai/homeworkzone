// ═══════════════════════════════════════════════════════════════
//  POLYGLOT PLANET - COMPREHENSIVE GLOBAL LANGUAGE DATABASE
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
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷', native: 'Português', family: 'Romance' }
];

// ═══════════════════════════════════════════════════════════════
//  LEVEL 0: COMPLETE ALPHABETS & CHARACTER SETS (100% COVERAGE)
// ═══════════════════════════════════════════════════════════════
export const LANGUAGE_ALPHABETS = {
  // --- 🇮🇳 HINDI: FULL DEVANAGARI (13 Vowels + 33 Consonants = 46 Letters) ---
  hi: [
    // Vowels (Swar)
    { char: 'अ', name: 'a', type: 'Vowel', ipa: '/ə/', mnemonic: 'Pomegranate (Anar)', example: 'अनार 🍎 (Pomegranate)' },
    { char: 'आ', name: 'aa', type: 'Vowel', ipa: '/aː/', mnemonic: 'Mango (Aam)', example: 'आम 🥭 (Mango)' },
    { char: 'इ', name: 'i', type: 'Vowel', ipa: '/ɪ/', mnemonic: 'Tamarind (Imli)', example: 'इमली 🍬 (Tamarind)' },
    { char: 'ई', name: 'ee', type: 'Vowel', ipa: '/iː/', mnemonic: 'Sugarcane (Eekh)', example: 'ईख 🌾 (Sugarcane)' },
    { char: 'उ', name: 'u', type: 'Vowel', ipa: '/ʊ/', mnemonic: 'Owl (Ullu)', example: 'उल्लू 🦉 (Owl)' },
    { char: 'ऊ', name: 'oo', type: 'Vowel', ipa: '/uː/', mnemonic: 'Wool (Oon)', example: 'ऊन 🧶 (Wool)' },
    { char: 'ऋ', name: 'ri', type: 'Vowel', ipa: '/rɪ/', mnemonic: 'Sage (Rishi)', example: 'ऋषि 🧘 (Sage)' },
    { char: 'ए', name: 'e', type: 'Vowel', ipa: '/eː/', mnemonic: 'Heel (Eedi)', example: 'एड़ी 🦶 (Heel)' },
    { char: 'ऐ', name: 'ai', type: 'Vowel', ipa: '/ɛː/', mnemonic: 'Spectacles (Ainak)', example: 'ऐनक 👓 (Spectacles)' },
    { char: 'ओ', name: 'o', type: 'Vowel', ipa: '/oː/', mnemonic: 'Mortar (Okhli)', example: 'ओखली 🥣 (Mortar)' },
    { char: 'औ', name: 'au', type: 'Vowel', ipa: '/ɔː/', mnemonic: 'Woman (Aurat)', example: 'औरत 👩 (Woman)' },
    { char: 'अं', name: 'ang', type: 'Vowel', ipa: '/əŋ/', mnemonic: 'Grapes (Angoor)', example: 'अंगूर 🍇 (Grapes)' },
    { char: 'अः', name: 'ah', type: 'Vowel', ipa: '/əh/', mnemonic: 'Aha! Smile', example: 'अतः 😃 (Hence)' },

    // Consonants (Vyanjan - Ka to Ha)
    { char: 'क', name: 'ka', type: 'Consonant', ipa: '/kə/', mnemonic: 'Lotus (Kamal)', example: 'कमल 🪷 (Lotus)' },
    { char: 'ख', name: 'kha', type: 'Consonant', ipa: '/kʰə/', mnemonic: 'Rabbit (Khargosh)', example: 'खरगोश 🐇 (Rabbit)' },
    { char: 'ग', name: 'ga', type: 'Consonant', ipa: '/ɡə/', mnemonic: 'Flowerpot (Gamla)', example: 'गमला 🪴 (Flowerpot)' },
    { char: 'घ', name: 'gha', type: 'Consonant', ipa: '/ɡʱə/', mnemonic: 'House (Ghar)', example: 'घर 🏠 (House)' },
    { char: 'ङ', name: 'nga', type: 'Consonant', ipa: '/ŋə/', mnemonic: 'Nga sound', example: 'वाङ्मय 📜 (Literature)' },
    { char: 'च', name: 'cha', type: 'Consonant', ipa: '/t͡ʃə/', mnemonic: 'Spoon (Chammach)', example: 'चम्मच 🥄 (Spoon)' },
    { char: 'छ', name: 'chha', type: 'Consonant', ipa: '/t͡ʃʰə/', mnemonic: 'Umbrella (Chhatri)', example: 'छतरी ☂️ (Umbrella)' },
    { char: 'ज', name: 'ja', type: 'Consonant', ipa: '/d͡ʒə/', mnemonic: 'Ship (Jahaz)', example: 'जहाज 🚢 (Ship)' },
    { char: 'झ', name: 'jha', type: 'Consonant', ipa: '/d͡ʒʱə/', mnemonic: 'Flag (Jhanda)', example: 'झंडा 🚩 (Flag)' },
    { char: 'ञ', name: 'nya', type: 'Consonant', ipa: '/ɲə/', mnemonic: 'Nya sound', example: 'ज्ञान 🧠 (Knowledge)' },
    { char: 'ट', name: 'ta (retroflex)', type: 'Consonant', ipa: '/ʈə/', mnemonic: 'Tomato (Tamatar)', example: 'टमाटर 🍅 (Tomato)' },
    { char: 'ठ', name: 'tha (retroflex)', type: 'Consonant', ipa: '/ʈʰə/', mnemonic: 'Stamp (Thappa)', example: 'ठप्पा 🏷️ (Stamp)' },
    { char: 'ड', name: 'da (retroflex)', type: 'Consonant', ipa: '/ɖə/', mnemonic: 'Drum (Damru)', example: 'डमरू 🥁 (Drum)' },
    { char: 'ढ', name: 'dha (retroflex)', type: 'Consonant', ipa: '/ɖʱə/', mnemonic: 'Shield (Dhal)', example: 'ढाल 🛡️ (Shield)' },
    { char: 'ण', name: 'rna', type: 'Consonant', ipa: '/ɳə/', mnemonic: 'Rna sound', example: 'बाण 🏹 (Arrow)' },
    { char: 'त', name: 'ta (dental)', type: 'Consonant', ipa: '/t̪ə/', mnemonic: 'Watermelon (Tarbooz)', example: 'तरबूज 🍉 (Watermelon)' },
    { char: 'थ', name: 'tha (dental)', type: 'Consonant', ipa: '/t̪ʰə/', mnemonic: 'Thermos (Thermas)', example: 'थर्मस 🍶 (Thermos)' },
    { char: 'द', name: 'da (dental)', type: 'Consonant', ipa: '/d̪ə/', mnemonic: 'Medicine (Dawa)', example: 'दवा 💊 (Medicine)' },
    { char: 'ध', name: 'dha (dental)', type: 'Consonant', ipa: '/d̪ʱə/', mnemonic: 'Bow (Dhanush)', example: 'धनुष 🏹 (Bow)' },
    { char: 'न', name: 'na', type: 'Consonant', ipa: '/n̪ə/', mnemonic: 'Tap (Nal)', example: 'नल 🚰 (Tap)' },
    { char: 'प', name: 'pa', type: 'Consonant', ipa: '/pə/', mnemonic: 'Kite (Patang)', example: 'पतंग 🪁 (Kite)' },
    { char: 'फ', name: 'pha', type: 'Consonant', ipa: '/pʰə/', mnemonic: 'Fruit (Phal)', example: 'फल 🍎 (Fruit)' },
    { char: 'ब', name: 'ba', type: 'Consonant', ipa: '/bə/', mnemonic: 'Duck (Batakh)', example: 'बतख 🦆 (Duck)' },
    { char: 'भ', name: 'bha', type: 'Consonant', ipa: '/bʱə/', mnemonic: 'Bear (Bhalu)', example: 'भालू 🐻 (Bear)' },
    { char: 'म', name: 'ma', type: 'Consonant', ipa: '/mə/', mnemonic: 'Fish (Machhli)', example: 'मछली 🐟 (Fish)' },
    { char: 'य', name: 'ya', type: 'Consonant', ipa: '/jə/', mnemonic: 'Yagya', example: 'यज्ञ 🔥 (Yagya)' },
    { char: 'र', name: 'ra', type: 'Consonant', ipa: '/rə/', mnemonic: 'Chariot (Rath)', example: 'रथ 🛞 (Chariot)' },
    { char: 'ल', name: 'la', type: 'Consonant', ipa: '/lə/', mnemonic: 'Top (Lattu)', example: 'लट्टू 🪀 (Top)' },
    { char: 'व', name: 'va', type: 'Consonant', ipa: '/ʋə/', mnemonic: 'Tree (Vriksh)', example: 'वृक्ष 🌳 (Tree)' },
    { char: 'श', name: 'sha', type: 'Consonant', ipa: '/ʃə/', mnemonic: 'Turnip (Shalgam)', example: 'शलजम 🧅 (Turnip)' },
    { char: 'ष', name: 'sha (retroflex)', type: 'Consonant', ipa: '/ʂə/', mnemonic: 'Hexagon (Shatkon)', example: 'षट्कोण 🛑 (Hexagon)' },
    { char: 'स', name: 'sa', type: 'Consonant', ipa: '/sə/', mnemonic: 'Snake charmer (Sapera)', example: 'सपेरा 🐍 (Snake charmer)' },
    { char: 'ह', name: 'ha', type: 'Consonant', ipa: '/ɦə/', mnemonic: 'Elephant (Hathi)', example: 'हाथी 🐘 (Elephant)' }
  ],

  // --- 🇯🇵 JAPANESE: FULL HIRAGANA (46 Characters) ---
  ja: [
    { char: 'あ', name: 'a', type: 'Vowel', ipa: '/a/', mnemonic: 'Kangaroo holding pouch', example: 'あめ 🍬 (Candy)' },
    { char: 'い', name: 'i', type: 'Vowel', ipa: '/i/', mnemonic: 'Two Eels swimming', example: 'いぬ 🐕 (Dog)' },
    { char: 'う', name: 'u', type: 'Vowel', ipa: '/u/', mnemonic: 'Heavy bag on back', example: '海 🌊 (Sea)' },
    { char: 'え', name: 'e', type: 'Vowel', ipa: '/e/', mnemonic: 'Exotic bird', example: 'えんぴつ ✏️ (Pencil)' },
    { char: 'お', name: 'o', type: 'Vowel', ipa: '/o/', mnemonic: 'Golf player golfing', example: 'おにぎり 🍙 (Rice ball)' },
    { char: 'か', name: 'ka', type: 'K-Row', ipa: '/ka/', mnemonic: 'Kite flying in wind', example: '川 🏞️ (River)' },
    { char: 'き', name: 'ki', type: 'K-Row', ipa: '/ki/', mnemonic: 'Key opening a lock', example: '木 🌳 (Tree)' },
    { char: 'く', name: 'ku', type: 'K-Row', ipa: '/ku/', mnemonic: 'Cuckoo bird beak', example: '車 🚗 (Car)' },
    { char: 'け', name: 'ke', type: 'K-Row', ipa: '/ke/', mnemonic: 'Keg of juice', example: '毛 🧶 (Hair)' },
    { char: 'こ', name: 'ko', type: 'K-Row', ipa: '/ko/', mnemonic: 'Cozy koi fish', example: '子供 🧒 (Child)' },
    { char: 'さ', name: 'sa', type: 'S-Row', ipa: '/sa/', mnemonic: 'Smiling face', example: '魚 🐟 (Fish)' },
    { char: 'し', name: 'shi', type: 'S-Row', ipa: '/ɕi/', mnemonic: 'Fishing hook', example: '塩 🧂 (Salt)' },
    { char: 'す', name: 'su', type: 'S-Row', ipa: '/sɯ/', mnemonic: 'Swirling noodle', example: '寿司 🍣 (Sushi)' },
    { char: 'せ', name: 'se', type: 'S-Row', ipa: '/se/', mnemonic: 'Setting sun', example: '世界 🌍 (World)' },
    { char: 'そ', name: 'so', type: 'S-Row', ipa: '/so/', mnemonic: 'Zigzag needle', example: '空 ☁️ (Sky)' },
    { char: 'た', name: 'ta', type: 'T-Row', ipa: '/ta/', mnemonic: 'Magic hat', example: '卵 🥚 (Egg)' },
    { char: 'ち', name: 'chi', type: 'T-Row', ipa: '/t͡ɕi/', mnemonic: 'Cheerleader', example: '竹 🎍 (Bamboo)' },
    { char: 'つ', name: 'tsu', type: 'T-Row', ipa: '/t͡sɯ/', mnemonic: 'Tsunami wave', example: '月 🌙 (Moon)' },
    { char: 'て', name: 'te', type: 'T-Row', ipa: '/te/', mnemonic: 'Dog\'s tail', example: '手 ✋ (Hand)' },
    { char: 'と', name: 'to', type: 'T-Row', ipa: '/to/', mnemonic: 'Thorn in toe', example: '友達 🧑‍🤝‍🧑 (Friend)' },
    { char: 'な', name: 'na', type: 'N-Row', ipa: '/na/', mnemonic: 'Nun praying', example: '夏 ☀️ (Summer)' },
    { char: 'に', name: 'ni', type: 'N-Row', ipa: '/ɲi/', mnemonic: 'Needle & thread', example: '虹 🌈 (Rainbow)' },
    { char: 'ぬ', name: 'nu', type: 'N-Row', ipa: '/nɯ/', mnemonic: 'Noodle loop', example: '犬 🐕 (Dog)' },
    { char: 'ね', name: 'ne', type: 'N-Row', ipa: '/ne/', mnemonic: 'Sleeping cat', example: '猫 🐱 (Cat)' },
    { char: 'の', name: 'no', type: 'N-Row', ipa: '/no/', mnemonic: 'No-entry sign', example: '乗り物 🚲 (Vehicle)' },
    { char: 'は', name: 'ha', type: 'H-Row', ipa: '/ha/', mnemonic: 'Hockey stick', example: '花 🌸 (Flower)' },
    { char: 'ひ', name: 'hi', type: 'H-Row', ipa: '/çi/', mnemonic: 'He-he laugh', example: '光 💡 (Light)' },
    { char: 'ふ', name: 'fu', type: 'H-Row', ipa: '/ɸɯ/', mnemonic: 'Mount Fuji', example: '船 🚢 (Ship)' },
    { char: 'へ', name: 'he', type: 'H-Row', ipa: '/he/', mnemonic: 'High hill', example: '部屋 🚪 (Room)' },
    { char: 'ほ', name: 'ho', type: 'H-Row', ipa: '/ho/', mnemonic: 'Hot chimney', example: '星 ⭐️ (Star)' },
    { char: 'ま', name: 'ma', type: 'M-Row', ipa: '/ma/', mnemonic: 'Mama\'s apron', example: '町 🏙️ (Town)' },
    { char: 'み', name: 'mi', type: 'M-Row', ipa: '/mʲi/', mnemonic: 'Lucky 21', example: '水 💧 (Water)' },
    { char: 'む', name: 'mu', type: 'M-Row', ipa: '/mɯ/', mnemonic: 'Moo-cow', example: '虫 🐛 (Insect)' },
    { char: 'め', name: 'me', type: 'M-Row', ipa: '/me/', mnemonic: 'Melon slice', example: '目 👁️ (Eye)' },
    { char: 'も', name: 'mo', type: 'M-Row', ipa: '/mo/', mnemonic: 'Fishing hooks', example: '桃 🍑 (Peach)' },
    { char: 'や', name: 'ya', type: 'Y-Row', ipa: '/ja/', mnemonic: 'Yak horns', example: '山 ⛰️ (Mountain)' },
    { char: 'ゆ', name: 'yu', type: 'Y-Row', ipa: '/jɯ/', mnemonic: 'U-turn', example: '雪 ❄️ (Snow)' },
    { char: 'よ', name: 'yo', type: 'Y-Row', ipa: '/jo/', mnemonic: 'Yo-yo', example: '夜 🌃 (Night)' },
    { char: 'ら', name: 'ra', type: 'R-Row', ipa: '/ɾa/', mnemonic: 'Rabbit', example: 'ライオン 🦁 (Lion)' },
    { char: 'り', name: 'ri', type: 'R-Row', ipa: '/ɾi/', mnemonic: 'Reeds', example: 'りんご 🍎 (Apple)' },
    { char: 'る', name: 'ru', type: 'R-Row', ipa: '/ɾɯ/', mnemonic: 'Ruby loop', example: 'ルビー 💎 (Ruby)' },
    { char: 'れ', name: 're', type: 'R-Row', ipa: '/ɾe/', mnemonic: 'Resting person', example: '歴史 📜 (History)' },
    { char: 'ろ', name: 'ro', type: 'R-Row', ipa: '/ɾo/', mnemonic: 'Road curve', example: 'ローソク 🕯️ (Candle)' },
    { char: 'わ', name: 'wa', type: 'W-Row', ipa: '/βa/', mnemonic: 'Wasp', example: 'ワニ 🐊 (Crocodile)' },
    { char: 'を', name: 'wo', type: 'W-Row', ipa: '/o/', mnemonic: 'Water splash', example: '本を飲む 📖 (Read a book)' },
    { char: 'ん', name: 'n', type: 'N-End', ipa: '/n/', mnemonic: 'N sound', example: '本 📚 (Book)' }
  ],

  // --- 🇦🇪 ARABIC: FULL 28 LETTERS ---
  ar: [
    { char: 'أ', name: 'alif', ipa: '/aː/', mnemonic: 'Pine Tree', example: 'أسد 🦁 (Lion)' },
    { char: 'ب', name: 'baa', ipa: '/b/', mnemonic: 'Boat dot below', example: 'بيت 🏠 (House)' },
    { char: 'ت', name: 'taa', ipa: '/t/', mnemonic: 'Smile 2 dots', example: 'تفاحة 🍎 (Apple)' },
    { char: 'ث', name: 'thaa', ipa: '/θ/', mnemonic: 'Pyramid 3 dots', example: 'ثعلب 🦊 (Fox)' },
    { char: 'ج', name: 'jeem', ipa: '/d͡ʒ/', mnemonic: 'Camel belly dot', example: 'جمل 🐪 (Camel)' },
    { char: 'ح', name: 'haa', ipa: '/ħ/', mnemonic: 'Clean wave', example: 'حصان 🐎 (Horse)' },
    { char: 'خ', name: 'khaa', ipa: '/x/', mnemonic: 'Chef hat dot', example: 'خبز 🍞 (Bread)' },
    { char: 'د', name: 'daal', ipa: '/d/', mnemonic: 'Door hinge', example: 'دب 🐻 (Bear)' },
    { char: 'ذ', name: 'thaal', ipa: '/ð/', mnemonic: 'Door hinge with dot', example: 'ذئب 🐺 (Wolf)' },
    { char: 'ر', name: 'raa', ipa: '/r/', mnemonic: 'Curved slide', example: 'رجل 👨 (Man)' },
    { char: 'ز', name: 'zay', ipa: '/z/', mnemonic: 'Slide with dot', example: 'زهرة 🌸 (Flower)' },
    { char: 'س', name: 'seen', ipa: '/s/', mnemonic: 'Sun 3 rays', example: 'سمكة 🐟 (Fish)' },
    { char: 'ش', name: 'sheen', ipa: '/ʃ/', mnemonic: 'Sun 3 dots', example: 'شمس ☀️ (Sun)' },
    { char: 'ص', name: 'saad', ipa: '/sˤ/', mnemonic: 'Whistle loop', example: 'صقر 🦅 (Falcon)' },
    { char: 'ض', name: 'daad', ipa: '/dˤ/', mnemonic: 'Whistle with dot', example: 'ضوء 💡 (Light)' },
    { char: 'ط', name: 'taa (emphatic)', ipa: '/tˤ/', mnemonic: 'Tall mast', example: 'طائرة ✈️ (Airplane)' },
    { char: 'ظ', name: 'zaa (emphatic)', ipa: '/ðˤ/', mnemonic: 'Sailboat with dot', example: 'ظرف ✉️ (Envelope)' },
    { char: 'ع', name: 'ayn', ipa: '/ʕ/', mnemonic: 'Falcon beak', example: 'عين 👁️ (Eye)' },
    { char: 'غ', name: 'ghayn', ipa: '/ɣ/', mnemonic: 'Beak with dot', example: 'غزالة 🦌 (Gazelle)' },
    { char: 'ف', name: 'faa', ipa: '/f/', mnemonic: 'Feather dot', example: 'فيل 🐘 (Elephant)' },
    { char: 'ق', name: 'qaaf', ipa: '/q/', mnemonic: 'Deep cup 2 dots', example: 'قمر 🌙 (Moon)' },
    { char: 'ك', name: 'kaaf', ipa: '/k/', mnemonic: 'Key shape', example: 'كتاب 📖 (Book)' },
    { char: 'ل', name: 'laam', ipa: '/l/', mnemonic: 'Lemon umbrella', example: 'ليمون 🍋 (Lemon)' },
    { char: 'م', name: 'meem', ipa: '/m/', mnemonic: 'Moon circle stem', example: 'موز 🍌 (Banana)' },
    { char: 'ن', name: 'noon', ipa: '/n/', mnemonic: 'Nest 1 egg', example: 'نجمة ⭐️ (Star)' },
    { char: 'هـ', name: 'haa (soft)', ipa: '/h/', mnemonic: 'Heart loop', example: 'هدية 🎁 (Gift)' },
    { char: 'و', name: 'waw', ipa: '/w/', mnemonic: 'Whirlpool', example: 'وردة 🌹 (Rose)' },
    { char: 'ي', name: 'yaa', ipa: '/j/', mnemonic: 'Swan 2 dots', example: 'يد ✋ (Hand)' }
  ],

  // --- 🇪🇸 SPANISH FULL A-Z ALPHABET ---
  es: [
    { char: 'A', name: 'a', ipa: '/a/', mnemonic: 'Apple', example: 'Agua 💧 (Water)' },
    { char: 'B', name: 'be', ipa: '/b/', mnemonic: 'Boat', example: 'Barco ⛵ (Boat)' },
    { char: 'C', name: 'ce', ipa: '/k/', mnemonic: 'House', example: 'Casa 🏠 (House)' },
    { char: 'D', name: 'de', ipa: '/d/', mnemonic: 'Dice', example: 'Dado 🎲 (Dice)' },
    { char: 'E', name: 'e', ipa: '/e/', mnemonic: 'Elephant', example: 'Elefante 🐘 (Elephant)' },
    { char: 'F', name: 'efe', ipa: '/f/', mnemonic: 'Fire', example: 'Fuego 🔥 (Fire)' },
    { char: 'G', name: 'ge', ipa: '/g/', mnemonic: 'Cat', example: 'Gato 🐱 (Cat)' },
    { char: 'H', name: 'hache', ipa: '/h/', mnemonic: 'Ice', example: 'Hielo 🧊 (Ice)' },
    { char: 'I', name: 'i', ipa: '/i/', mnemonic: 'Island', example: 'Isla 🏝️ (Island)' },
    { char: 'J', name: 'jota', ipa: '/x/', mnemonic: 'Giraffe', example: 'Jirafa 🦒 (Giraffe)' },
    { char: 'K', name: 'ka', ipa: '/k/', mnemonic: 'Koala', example: 'Koala 🐨 (Koala)' },
    { char: 'L', name: 'ele', ipa: '/l/', mnemonic: 'Moon', example: 'Luna 🌙 (Moon)' },
    { char: 'M', name: 'eme', ipa: '/m/', mnemonic: 'Apple', example: 'Manzana 🍎 (Apple)' },
    { char: 'N', name: 'ene', ipa: '/n/', mnemonic: 'Cloud', example: 'Nube ☁️ (Cloud)' },
    { char: 'Ñ', name: 'eñe', ipa: '/ɲ/', mnemonic: 'Yam', example: 'Niño 👦 (Boy)' },
    { char: 'O', name: 'o', ipa: '/o/', mnemonic: 'Bear', example: 'Oso 🐻 (Bear)' },
    { char: 'P', name: 'pe', ipa: '/p/', mnemonic: 'Dog', example: 'Perro 🐕 (Dog)' },
    { char: 'Q', name: 'cu', ipa: '/k/', mnemonic: 'Cheese', example: 'Queso 🧀 (Cheese)' },
    { char: 'R', name: 'ere', ipa: '/r/', mnemonic: 'Clock', example: 'Reloj ⏰ (Clock)' },
    { char: 'S', name: 'ese', ipa: '/s/', mnemonic: 'Sun', example: 'Sol ☀️ (Sun)' },
    { char: 'T', name: 'te', ipa: '/t/', mnemonic: 'Tiger', example: 'Tigre 🐅 (Tiger)' },
    { char: 'U', name: 'u', ipa: '/u/', mnemonic: 'Grapes', example: 'Uvas 🍇 (Grapes)' },
    { char: 'V', name: 've', ipa: '/b/', mnemonic: 'Cow', example: 'Vaca 🐄 (Cow)' },
    { char: 'W', name: 'doble ve', ipa: '/w/', mnemonic: 'Wifi', example: 'Windsurf 🏄' },
    { char: 'X', name: 'equis', ipa: '/ks/', mnemonic: 'Xylophone', example: 'Xilófono 🎼' },
    { char: 'Y', name: 'i griega', ipa: '/j/', mnemonic: 'Yacht', example: 'Yate 🛥️' },
    { char: 'Z', name: 'zeta', ipa: '/θ/', mnemonic: 'Fox', example: 'Zorro 🦊 (Fox)' }
  ]
};

// ═══════════════════════════════════════════════════════════════
//  LEVEL 4: MULTI-PANEL GRAPHIC NOVEL NARRATIVE STORIES (7 PANELS EACH)
// ═══════════════════════════════════════════════════════════════
export const GRAPHIC_NOVEL_STORIES = {
  hi: [
    {
      title: "Episode 1: जादुई बगीचे की रहस्यमयी यात्रा (The Quest for the Magic Garden)",
      panels: [
        {
          speaker: "Poly Parrot 🦜",
          avatar: "🦜",
          speech: "नमस्ते दोस्तों! आज हम एक जादुई गुप्त बगीचे की खोज में जा रहे हैं!",
          translation: "Hello friends! Today we are going on a quest for a secret magic garden!"
        },
        {
          speaker: "Dino 🦖",
          avatar: "🦖",
          speech: "वाह! क्या वहाँ मीठे फल और सुंदर नदियाँ होंगी?",
          translation: "Wow! Will there be sweet fruits and beautiful rivers there?"
        },
        {
          speaker: "Poly Parrot 🦜",
          avatar: "🦜",
          speech: "हाँ! लेकिन पहले हमें उस पुरानी जादुई नदी को पार करना होगा।",
          translation: "Yes! But first we must cross that ancient magic river."
        },
        {
          speaker: "Wise Owl 🦉",
          avatar: "🦉",
          speech: "रुकिए! नदी पार करने के लिए आपको इस पहेली का सही उत्तर देना होगा।",
          translation: "Stop! To cross the river you must answer this riddle correctly."
        },
        {
          speaker: "Dino 🦖",
          avatar: "🦖",
          speech: "हम तैयार हैं! बताइए पहेली क्या है?",
          translation: "We are ready! Tell us what the riddle is?"
        },
        {
          speaker: "Wise Owl 🦉",
          avatar: "🦉",
          speech: "शाबाश! आपने सही पहेली सुलझा ली! यह रही जादुई चाबी।",
          translation: "Bravo! You solved the riddle correctly! Here is the magic key."
        },
        {
          speaker: "Poly Parrot 🦜",
          avatar: "🦜",
          speech: "बधाई हो! देखो, जादुई बगीचे का दरवाजा खुल गया है! हमने कर दिखाया!",
          translation: "Congratulations! Look, the door to the magic garden is open! We did it!"
        }
      ]
    }
  ],
  es: [
    {
      title: "Episode 1: El Misterio del Bosque Encantado (Mystery of Enchanted Forest)",
      panels: [
        {
          speaker: "Poly Parrot 🦜",
          avatar: "🦜",
          speech: "¡Hola amigos! Hoy vamos a explorar el Bosque Encantado.",
          translation: "Hello friends! Today we are exploring the Enchanted Forest."
        },
        {
          speaker: "Dino 🦖",
          speech: "¡Fantástico! Escucho el sonido de una cascada mágica.",
          translation: "Fantastic! I hear the sound of a magical waterfall."
        },
        {
          speaker: "Wise Owl 🦉",
          speech: "¡Bienvenidos jóvenes aventureros! Tomen este mapa antiguo.",
          translation: "Welcome young adventurers! Take this ancient map."
        },
        {
          speaker: "Poly Parrot 🦜",
          speech: "¡Mira Dino! El mapa nos muestra el camino hacia el castillo.",
          translation: "Look Dino! The map shows us the path to the castle."
        },
        {
          speaker: "Dino 🦖",
          speech: "¡Vamos corriendo! ¡Me encanta descubrir nuevos lugares!",
          translation: "Let's run! I love discovering new places!"
        },
        {
          speaker: "Wise Owl 🦉",
          speech: "¡Felicidades! Han encontrado el tesoro de la sabiduría.",
          translation: "Congratulations! You have found the treasure of wisdom."
        },
        {
          speaker: "Poly Parrot 🦜",
          speech: "¡Lo logramos juntos! ¡Qué gran aventura!",
          translation: "We achieved it together! What a great adventure!"
        }
      ]
    }
  ],
  ja: [
    {
      title: "Episode 1: 魔法の森の大冒険 (Great Adventure in the Magic Forest)",
      panels: [
        {
          speaker: "Poly Parrot 🦜",
          avatar: "🦜",
          speech: "こんにちは！今日は魔法の森を探検しましょう！",
          translation: "Hello! Let's explore the magic forest today!"
        },
        {
          speaker: "Dino 🦖",
          avatar: "🦖",
          speech: "すごい！きれいな川と果物が見えます！",
          translation: "Amazing! I can see a pretty river and fruits!"
        },
        {
          speaker: "Wise Owl 🦉",
          avatar: "🦉",
          speech: "ようこそ！この古い鍵を使ってドアを開けてください。",
          translation: "Welcome! Use this old key to open the door."
        },
        {
          speaker: "Poly Parrot 🦜",
          avatar: "🦜",
          speech: "ありがとう！さあ、一緒に行きましょう！",
          translation: "Thank you! Now, let me go together!"
        },
        {
          speaker: "Dino 🦖",
          avatar: "🦖",
          speech: "やったー！宝箱を見つけました！",
          translation: "Yay! We found the treasure chest!"
        }
      ]
    }
  ]
};

// ═══════════════════════════════════════════════════════════════
//  LEVEL 0.5: NATIVE NUMBERS & COUNTING (1 TO 100)
// ═══════════════════════════════════════════════════════════════
export const LANGUAGE_NUMBERS = {
  hi: [
    { num: 1, native: '१', word: 'एक (Ek)', phonetic: 'ek' },
    { num: 2, native: '२', word: 'दो (Do)', phonetic: 'do' },
    { num: 3, native: '३', word: 'तीन (Teen)', phonetic: 'teen' },
    { num: 4, native: '४', word: 'चार (Chaar)', phonetic: 'chaar' },
    { num: 5, native: '५', word: 'पाँच (Paanch)', phonetic: 'paanch' },
    { num: 6, native: '६', word: 'छह (Chhah)', phonetic: 'chhah' },
    { num: 7, native: '७', word: 'सात (Saat)', phonetic: 'saat' },
    { num: 8, native: '८', word: 'आठ (Aath)', phonetic: 'aath' },
    { num: 9, native: '९', word: 'नौ (Nau)', phonetic: 'nau' },
    { num: 10, native: '१०', word: 'दस (Das)', phonetic: 'das' },
    { num: 20, native: '२०', word: 'बीस (Bees)', phonetic: 'bees' },
    { num: 50, native: '५०', word: 'पचास (Pachas)', phonetic: 'pachas' },
    { num: 100, native: '१००', word: 'सौ (Sau)', phonetic: 'sau' }
  ],
  ja: [
    { num: 1, native: '一', word: 'いち (Ichi)', phonetic: 'ee-chee' },
    { num: 2, native: '二', word: 'に (Ni)', phonetic: 'nee' },
    { num: 3, native: '三', word: 'さん (San)', phonetic: 'sahn' },
    { num: 4, native: '四', word: 'よん (Yon)', phonetic: 'yohn' },
    { num: 5, native: '五', word: 'ご (Go)', phonetic: 'goh' },
    { num: 6, native: '六', word: 'ろく (Roku)', phonetic: 'roh-koo' },
    { num: 7, native: '七', word: 'なな (Nana)', phonetic: 'nah-nah' },
    { num: 8, native: '八', word: 'はち (Hachi)', phonetic: 'hah-chee' },
    { num: 9, native: '九', word: 'きゅう (Kyuu)', phonetic: 'kyoo' },
    { num: 10, native: '十', word: 'じゅう (Juu)', phonetic: 'joo' },
    { num: 100, native: '百', word: 'ひゃく (Hyaku)', phonetic: 'hyah-koo' }
  ],
  es: [
    { num: 1, native: '1', word: 'Uno', phonetic: 'oo-noh' },
    { num: 2, native: '2', word: 'Dos', phonetic: 'dohs' },
    { num: 3, native: '3', word: 'Tres', phonetic: 'trays' },
    { num: 4, native: '4', word: 'Cuatro', phonetic: 'kwah-troh' },
    { num: 5, native: '5', word: 'Cinco', phonetic: 'seen-koh' },
    { num: 6, native: '6', word: 'Seis', phonetic: 'says' },
    { num: 7, native: '7', word: 'Siete', phonetic: 'syeh-tay' },
    { num: 8, native: '8', word: 'Ocho', phonetic: 'oh-choh' },
    { num: 9, native: '9', word: 'Nueve', phonetic: 'nway-bay' },
    { num: 10, native: '10', word: 'Diez', phonetic: 'dyehs' },
    { num: 100, native: '100', word: 'Cien', phonetic: 'syehn' }
  ]
};

// ═══════════════════════════════════════════════════════════════
//  LEVEL 2.5: SITUATIONAL CONVERSATIONAL PHRASEBOOK
// ═══════════════════════════════════════════════════════════════
export const SITUATIONAL_PHRASEBOOK = {
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
        { native: '¿Dónde está el baño?', english: 'Where is the bathroom?', phonetic: 'dohn-day ehs-tah el bah-nyoh' },
        { native: '¿Dónde está la estación?', english: 'Where is the station?', phonetic: 'dohn-day ehs-tah lah ehs-tah-syohn' }
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
        { native: 'これをください。', english: 'Please give me this.', phonetic: 'koh-reh oh koo-dah-sa-ee' },
        { native: 'いくらですか？', english: 'How much is it?', phonetic: 'ee-koo-rah des-kah' }
      ]
    }
  ]
};

// ═══════════════════════════════════════════════════════════════
//  LEVEL 2: ACTION VERBS & GREETINGS
// ═══════════════════════════════════════════════════════════════
export const ACTION_VERBS_GREETINGS = {
  es: [
    { phrase: '¡Hola!', meaning: 'Hello / Hi!', icon: '👋', phonetic: 'oh-lah', type: 'Greeting' },
    { phrase: '¡Buenos días!', meaning: 'Good morning!', icon: '🌅', phonetic: 'bway-nohs dee-ahs', type: 'Greeting' },
    { phrase: '¡Buenas noches!', meaning: 'Good night!', icon: '🌙', phonetic: 'bway-nahs noh-chays', type: 'Greeting' },
    { phrase: '¡Gracias!', meaning: 'Thank you!', icon: '🙏', phonetic: 'grah-see-ahs', type: 'Greeting' },
    { phrase: '¡Por favor!', meaning: 'Please!', icon: '🌸', phonetic: 'pohr fah-vohr', type: 'Greeting' },
    { phrase: '¡Hasta luego!', meaning: 'See you later!', icon: '🙋', phonetic: 'ahs-tah lway-goh', type: 'Greeting' },
    { phrase: 'Correr', meaning: 'To Run', icon: '🏃', phonetic: 'koh-rrehr', type: 'Action Verb' },
    { phrase: 'Comer', meaning: 'To Eat', icon: '🍽️', phonetic: 'koh-mehr', type: 'Action Verb' },
    { phrase: 'Leer', meaning: 'To Read', icon: '📖', phonetic: 'lay-ehr', type: 'Action Verb' },
    { phrase: 'Escribir', meaning: 'To Write', icon: '✏️', phonetic: 'ehs-kree-beer', type: 'Action Verb' },
    { phrase: 'Dormir', meaning: 'To Sleep', icon: '😴', phonetic: 'dohr-meer', type: 'Action Verb' },
    { phrase: 'Bailar', meaning: 'To Dance', icon: '💃', phonetic: 'bye-lahr', type: 'Action Verb' },
    { phrase: 'Cantar', meaning: 'To Sing', icon: '🎤', phonetic: 'kahn-tahr', type: 'Action Verb' },
    { phrase: 'Jugar', meaning: 'To Play', icon: '⚽', phonetic: 'hoo-gahr', type: 'Action Verb' },
    { phrase: 'Nadar', meaning: 'To Swim', icon: '🏊', phonetic: 'nah-dahr', type: 'Action Verb' },
    { phrase: 'Saltar', meaning: 'To Jump', icon: '🦘', phonetic: 'sahl-tahr', type: 'Action Verb' }
  ],
  hi: [
    { phrase: 'नमस्ते (Namaste)', meaning: 'Hello / Greetings!', icon: '🙏', phonetic: 'nah-mas-tay', type: 'Greeting' },
    { phrase: 'सुप्रभात (Suprabhat)', meaning: 'Good morning!', icon: '🌅', phonetic: 'soo-prah-bhaat', type: 'Greeting' },
    { phrase: 'धन्यवाद (Dhanyavaad)', meaning: 'Thank you!', icon: '🌸', phonetic: 'dhan-yah-vaad', type: 'Greeting' },
    { phrase: 'कृपया (Kripaya)', meaning: 'Please!', icon: '✨', phonetic: 'kri-pah-yah', type: 'Greeting' },
    { phrase: 'फिर मिलेंगे (Phir Milenge)', meaning: 'See you again!', icon: '🙋', phonetic: 'phir mi-len-gay', type: 'Greeting' },
    { phrase: 'दौड़ना (Daudna)', meaning: 'To Run', icon: '🏃', phonetic: 'daud-nah', type: 'Action Verb' },
    { phrase: 'खाना (Khana)', meaning: 'To Eat', icon: '🍽️', phonetic: 'khaa-nah', type: 'Action Verb' },
    { phrase: 'पढ़ना (Padhna)', meaning: 'To Read', icon: '📖', phonetic: 'padh-nah', type: 'Action Verb' },
    { phrase: 'लिखना (Likhna)', meaning: 'To Write', icon: '✏️', phonetic: 'likh-nah', type: 'Action Verb' },
    { phrase: 'सोना (Sona)', meaning: 'To Sleep', icon: '😴', phonetic: 'so-nah', type: 'Action Verb' },
    { phrase: 'नाचना (Nachna)', meaning: 'To Dance', icon: '💃', phonetic: 'naach-nah', type: 'Action Verb' },
    { phrase: 'गाना (Gana)', meaning: 'To Sing', icon: '🎤', phonetic: 'gaa-nah', type: 'Action Verb' }
  ],
  ja: [
    { phrase: 'こんにちは (Konnichiwa)', meaning: 'Hello!', icon: '👋', phonetic: 'kon-nee-chee-wah', type: 'Greeting' },
    { phrase: 'おはよう (Ohayou)', meaning: 'Good morning!', icon: '🌅', phonetic: 'oh-hah-yoh', type: 'Greeting' },
    { phrase: 'ありがとう (Arigatou)', meaning: 'Thank you!', icon: '🙏', phonetic: 'ah-ree-gah-toh', type: 'Greeting' },
    { phrase: 'さようなら (Sayounara)', meaning: 'Goodbye!', icon: '🙋', phonetic: 'sah-yoo-nah-rah', type: 'Greeting' },
    { phrase: '走る (Hashiru)', meaning: 'To Run', icon: '🏃', phonetic: 'hah-shee-roo', type: 'Action Verb' },
    { phrase: '食べる (Taberu)', meaning: 'To Eat', icon: '🍽️', phonetic: 'tah-beh-roo', type: 'Action Verb' },
    { phrase: '読む (Yomu)', meaning: 'To Read', icon: '📖', phonetic: 'yoh-moo', type: 'Action Verb' },
    { phrase: '書く (Kaku)', meaning: 'To Write', icon: '✏️', phonetic: 'kah-koo', type: 'Action Verb' },
    { phrase: '寝る (Neru)', meaning: 'To Sleep', icon: '😴', phonetic: 'neh-roo', type: 'Action Verb' }
  ]
};

// ═══════════════════════════════════════════════════════════════
//  LEVEL 1: EXTENSIVE VOCABULARY VAULT
// ═══════════════════════════════════════════════════════════════
export const VISUAL_VOCABULARY = {
  es: [
    { id: 'cat', word: 'El Gato', meaning: 'The Cat', category: 'Animals', icon: '🐱', phonetic: 'el gah-toh' },
    { id: 'dog', word: 'El Perro', meaning: 'The Dog', category: 'Animals', icon: '🐕', phonetic: 'el peh-rroh' },
    { id: 'bird', word: 'El Pájaro', meaning: 'The Bird', category: 'Animals', icon: '🐦', phonetic: 'el pah-hah-roh' },
    { id: 'lion', word: 'El León', meaning: 'The Lion', category: 'Animals', icon: '🦁', phonetic: 'el lay-ohn' },
    { id: 'tiger', word: 'El Tigre', meaning: 'The Tiger', category: 'Animals', icon: '🐅', phonetic: 'el tee-gray' },
    { id: 'elephant', word: 'El Elefante', meaning: 'The Elephant', category: 'Animals', icon: '🐘', phonetic: 'el eh-lay-fahn-tay' },
    { id: 'apple', word: 'La Manzana', meaning: 'The Apple', category: 'Food', icon: '🍎', phonetic: 'lah mahn-sah-nah' },
    { id: 'banana', word: 'El Plátano', meaning: 'The Banana', category: 'Food', icon: '🍌', phonetic: 'el plah-tah-noh' },
    { id: 'water', word: 'El Agua', meaning: 'Water', category: 'Food', icon: '💧', phonetic: 'el ah-gwah' },
    { id: 'house', word: 'La Casa', meaning: 'The House', category: 'Home', icon: '🏠', phonetic: 'lah kah-sah' },
    { id: 'sun', word: 'El Sol', meaning: 'The Sun', category: 'Nature', icon: '☀️', phonetic: 'el sohl' }
  ],
  hi: [
    { id: 'cat', word: 'बिल्ली (Billi)', meaning: 'The Cat', category: 'Animals', icon: '🐱', phonetic: 'bil-lee' },
    { id: 'dog', word: 'कुत्ता (Kutta)', meaning: 'The Dog', category: 'Animals', icon: '🐕', phonetic: 'kut-taa' },
    { id: 'lion', word: 'शेर (Sher)', meaning: 'The Lion', category: 'Animals', icon: '🦁', phonetic: 'shayr' },
    { id: 'elephant', word: 'हाथी (Hathi)', meaning: 'The Elephant', category: 'Animals', icon: '🐘', phonetic: 'haa-thee' },
    { id: 'apple', word: 'सेब (Seb)', meaning: 'The Apple', category: 'Food', icon: '🍎', phonetic: 'sayb' },
    { id: 'mango', word: 'आम (Aam)', meaning: 'The Mango', category: 'Food', icon: '🥭', phonetic: 'aam' },
    { id: 'water', word: 'पानी (Paani)', meaning: 'Water', category: 'Food', icon: '💧', phonetic: 'paa-nee' },
    { id: 'house', word: 'घर (Ghar)', meaning: 'The House', category: 'Home', icon: '🏠', phonetic: 'ghar' },
    { id: 'sun', word: 'सूरज (Suraj)', meaning: 'The Sun', category: 'Nature', icon: '☀️', phonetic: 'soo-raj' }
  ],
  ja: [
    { id: 'cat', word: '猫 (Neko)', meaning: 'The Cat', category: 'Animals', icon: '🐱', phonetic: 'neh-koh' },
    { id: 'dog', word: '犬 (Inu)', meaning: 'The Dog', category: 'Animals', icon: '🐕', phonetic: 'ee-noo' },
    { id: 'sun', word: '太陽 (Taiyou)', meaning: 'The Sun', category: 'Nature', icon: '☀️', phonetic: 'ta-ee-yoh' },
    { id: 'apple', word: 'りんご (Ringo)', meaning: 'The Apple', category: 'Food', icon: '🍎', phonetic: 'reen-goh' }
  ]
};

// ═══════════════════════════════════════════════════════════════
//  LEVEL 3: COLOR-CODED LEGO GRAMMAR SENTENCES
// ═══════════════════════════════════════════════════════════════
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
  ]
};
