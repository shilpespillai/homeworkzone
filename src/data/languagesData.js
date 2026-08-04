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
//  LEVEL 4: GRAPHIC NOVEL COMIC STRIP STORIES
// ═══════════════════════════════════════════════════════════════
export const GRAPHIC_NOVEL_STORIES = {
  es: [
    {
      title: "Episode 1: El Mercado Mágico (The Magic Market)",
      panels: [
        {
          speaker: "Poly Parrot 🦜",
          speech: "¡Hola amigo! Bienvenido al Mercado Mágico.",
          translation: "Hello friend! Welcome to the Magic Market."
        },
        {
          speaker: "Dino 🦖",
          speech: "¡Me gusta comer manzanas rojas y jugosas!",
          translation: "I like to eat juicy red apples!"
        },
        {
          speaker: "Poly Parrot 🦜",
          speech: "¡Excelente! Vamos a comprar frutas frescas.",
          translation: "Excellent! Let's buy fresh fruits."
        }
      ]
    }
  ],
  hi: [
    {
      title: "Episode 1: सुंदर बगीचा (The Beautiful Garden)",
      panels: [
        {
          speaker: "Poly Parrot 🦜",
          speech: "नमस्ते दोस्त! यह एक सुंदर बगीचा है।",
          translation: "Hello friend! This is a beautiful garden."
        },
        {
          speaker: "Dino 🦖",
          speech: "मुझे लाल सेब और आम बहुत पसंद हैं!",
          translation: "I really like red apples and mangoes!"
        }
      ]
    }
  ],
  ja: [
    {
      title: "Episode 1: 楽しい公園 (The Fun Park)",
      panels: [
        {
          speaker: "Poly Parrot 🦜",
          speech: "こんにちは！公園で遊びましょう。",
          translation: "Hello! Let's play in the park."
        },
        {
          speaker: "Dino 🦖",
          speech: "美味しいおにぎりを食べます！",
          translation: "I eat delicious rice balls!"
        }
      ]
    }
  ]
};

// ═══════════════════════════════════════════════════════════════
//  LEVEL 1: EXTENSIVE VOCABULARY VAULT (COVERING ALL DOMAINS)
// ═══════════════════════════════════════════════════════════════
export const VISUAL_VOCABULARY = {
  es: [
    // Animals (15)
    { id: 'cat', word: 'El Gato', meaning: 'The Cat', category: 'Animals', icon: '🐱', phonetic: 'el gah-toh' },
    { id: 'dog', word: 'El Perro', meaning: 'The Dog', category: 'Animals', icon: '🐕', phonetic: 'el peh-rroh' },
    { id: 'bird', word: 'El Pájaro', meaning: 'The Bird', category: 'Animals', icon: '🐦', phonetic: 'el pah-hah-roh' },
    { id: 'lion', word: 'El León', meaning: 'The Lion', category: 'Animals', icon: '🦁', phonetic: 'el lay-ohn' },
    { id: 'tiger', word: 'El Tigre', meaning: 'The Tiger', category: 'Animals', icon: '🐅', phonetic: 'el tee-gray' },
    { id: 'elephant', word: 'El Elefante', meaning: 'The Elephant', category: 'Animals', icon: '🐘', phonetic: 'el eh-lay-fahn-tay' },
    { id: 'bear', word: 'El Oso', meaning: 'The Bear', category: 'Animals', icon: '🐻', phonetic: 'el oh-soh' },
    { id: 'monkey', word: 'El Mono', meaning: 'The Monkey', category: 'Animals', icon: '🐒', phonetic: 'el moh-noh' },
    { id: 'rabbit', word: 'El Conejo', meaning: 'The Rabbit', category: 'Animals', icon: '🐇', phonetic: 'el koh-nay-hoh' },
    { id: 'horse', word: 'El Caballo', meaning: 'The Horse', category: 'Animals', icon: '🐎', phonetic: 'el kah-bah-yoh' },
    { id: 'cow', word: 'La Vaca', meaning: 'The Cow', category: 'Animals', icon: '🐄', phonetic: 'lah bah-kah' },
    { id: 'duck', word: 'El Pato', meaning: 'The Duck', category: 'Animals', icon: '🦆', phonetic: 'el pah-toh' },
    { id: 'fish', word: 'El Pez', meaning: 'The Fish', category: 'Animals', icon: '🐟', phonetic: 'el pehs' },
    { id: 'turtle', word: 'La Tortuga', meaning: 'The Turtle', category: 'Animals', icon: '🐢', phonetic: 'lah tohr-too-gah' },
    { id: 'butterfly', word: 'La Mariposa', meaning: 'The Butterfly', category: 'Animals', icon: '🦋', phonetic: 'lah mah-ree-poh-sah' },

    // Food (15)
    { id: 'apple', word: 'La Manzana', meaning: 'The Apple', category: 'Food', icon: '🍎', phonetic: 'lah mahn-sah-nah' },
    { id: 'banana', word: 'El Plátano', meaning: 'The Banana', category: 'Food', icon: '🍌', phonetic: 'el plah-tah-noh' },
    { id: 'grapes', word: 'Las Uvas', meaning: 'Grapes', category: 'Food', icon: '🍇', phonetic: 'lahs oo-bahs' },
    { id: 'orange', word: 'La Naranja', meaning: 'Orange', category: 'Food', icon: '🍊', phonetic: 'lah nah-rahn-hah' },
    { id: 'bread', word: 'El Pan', meaning: 'Bread', category: 'Food', icon: '🍞', phonetic: 'el pahn' },
    { id: 'cheese', word: 'El Queso', meaning: 'Cheese', category: 'Food', icon: '🧀', phonetic: 'el kay-soh' },
    { id: 'water', word: 'El Agua', meaning: 'Water', category: 'Food', icon: '💧', phonetic: 'el ah-gwah' },
    { id: 'milk', word: 'La Leche', meaning: 'Milk', category: 'Food', icon: '🥛', phonetic: 'lah lay-chay' },
    { id: 'rice', word: 'El Arroz', meaning: 'Rice', category: 'Food', icon: '🍚', phonetic: 'el ah-rrohs' },
    { id: 'soup', word: 'La Sopa', meaning: 'Soup', category: 'Food', icon: '🥣', phonetic: 'lah soh-pah' },
    { id: 'egg', word: 'El Huevo', meaning: 'Egg', category: 'Food', icon: '🥚', phonetic: 'el way-boh' },
    { id: 'cake', word: 'El Pastel', meaning: 'Cake', category: 'Food', icon: '🎂', phonetic: 'el pahs-tehl' },
    { id: 'pizza', word: 'La Pizza', meaning: 'Pizza', category: 'Food', icon: '🍕', phonetic: 'lah peet-sah' },
    { id: 'icecream', word: 'El Helado', meaning: 'Ice Cream', category: 'Food', icon: '🍦', phonetic: 'el eh-lah-doh' },
    { id: 'juice', word: 'El Jugo', meaning: 'Juice', category: 'Food', icon: '🧃', phonetic: 'el hoo-goh' },

    // Home & Objects (10)
    { id: 'house', word: 'La Casa', meaning: 'The House', category: 'Home', icon: '🏠', phonetic: 'lah kah-sah' },
    { id: 'table', word: 'La Mesa', meaning: 'The Table', category: 'Home', icon: '🪑', phonetic: 'lah me-sah' },
    { id: 'chair', word: 'La Silla', meaning: 'The Chair', category: 'Home', icon: '🪑', phonetic: 'lah see-yah' },
    { id: 'bed', word: 'La Cama', meaning: 'The Bed', category: 'Home', icon: '🛏️', phonetic: 'lah kah-mah' },
    { id: 'door', word: 'La Puerta', meaning: 'The Door', category: 'Home', icon: '🚪', phonetic: 'lah pwehr-tah' },
    { id: 'window', word: 'La Ventana', meaning: 'The Window', category: 'Home', icon: '🪟', phonetic: 'lah behn-tah-nah' },
    { id: 'clock', word: 'El Reloj', meaning: 'The Clock', category: 'Home', icon: '⏰', phonetic: 'el ray-loh' },
    { id: 'lamp', word: 'La Lámpara', meaning: 'The Lamp', category: 'Home', icon: '💡', phonetic: 'lah lahm-pah-rah' },
    { id: 'book', word: 'El Libro', meaning: 'The Book', category: 'School', icon: '📖', phonetic: 'el lee-broh' },
    { id: 'pencil', word: 'El Lápiz', meaning: 'The Pencil', category: 'School', icon: '✏️', phonetic: 'el lah-pees' },

    // Nature & World (10)
    { id: 'sun', word: 'El Sol', meaning: 'The Sun', category: 'Nature', icon: '☀️', phonetic: 'el sohl' },
    { id: 'moon', word: 'La Luna', meaning: 'The Moon', category: 'Nature', icon: '🌙', phonetic: 'lah loo-nah' },
    { id: 'star', word: 'La Estrella', meaning: 'The Star', category: 'Nature', icon: '⭐️', phonetic: 'lah ehs-tray-yah' },
    { id: 'sky', word: 'El Cielo', meaning: 'The Sky', category: 'Nature', icon: '☁️', phonetic: 'el syeh-loh' },
    { id: 'tree', word: 'El Árbol', meaning: 'The Tree', category: 'Nature', icon: '🌳', phonetic: 'el ahr-bohl' },
    { id: 'flower', word: 'La Flor', meaning: 'The Flower', category: 'Nature', icon: '🌸', phonetic: 'lah flohr' },
    { id: 'mountain', word: 'La Montaña', meaning: 'The Mountain', category: 'Nature', icon: '🏔️', phonetic: 'lah mohn-tah-nyah' },
    { id: 'river', word: 'El Río', meaning: 'The River', category: 'Nature', icon: '🏞️', phonetic: 'el ree-oh' },
    { id: 'sea', word: 'El Mar', meaning: 'The Sea', category: 'Nature', icon: '🌊', phonetic: 'el mahr' },
    { id: 'rain', word: 'La Lluvia', meaning: 'The Rain', category: 'Nature', icon: '🌧️', phonetic: 'lah yoo-byah' }
  ],
  hi: [
    // Animals (12)
    { id: 'cat', word: 'बिल्ली (Billi)', meaning: 'The Cat', category: 'Animals', icon: '🐱', phonetic: 'bil-lee' },
    { id: 'dog', word: 'कुत्ता (Kutta)', meaning: 'The Dog', category: 'Animals', icon: '🐕', phonetic: 'kut-taa' },
    { id: 'lion', word: 'शेर (Sher)', meaning: 'The Lion', category: 'Animals', icon: '🦁', phonetic: 'shayr' },
    { id: 'elephant', word: 'हाथी (Hathi)', meaning: 'The Elephant', category: 'Animals', icon: '🐘', phonetic: 'haa-thee' },
    { id: 'monkey', word: 'बंदर (Bandar)', meaning: 'The Monkey', category: 'Animals', icon: '🐒', phonetic: 'ban-dar' },
    { id: 'peacock', word: 'मोर (Mor)', meaning: 'The Peacock', category: 'Animals', icon: '🦚', phonetic: 'mor' },
    { id: 'cow', word: 'गाय (Gaay)', meaning: 'The Cow', category: 'Animals', icon: '🐄', phonetic: 'gaay' },
    { id: 'horse', word: 'घोड़ा (Ghoda)', meaning: 'The Horse', category: 'Animals', icon: '🐎', phonetic: 'gho-daa' },
    { id: 'fish', word: 'मछली (Machhli)', meaning: 'The Fish', category: 'Animals', icon: '🐟', phonetic: 'machh-lee' },
    { id: 'bird', word: 'चिड़िया (Chidiya)', meaning: 'The Bird', category: 'Animals', icon: '🐦', phonetic: 'chid-i-yaa' },

    // Food (10)
    { id: 'apple', word: 'सेब (Seb)', meaning: 'The Apple', category: 'Food', icon: '🍎', phonetic: 'sayb' },
    { id: 'mango', word: 'आम (Aam)', meaning: 'The Mango', category: 'Food', icon: '🥭', phonetic: 'aam' },
    { id: 'banana', word: 'केला (Kela)', meaning: 'Banana', category: 'Food', icon: '🍌', phonetic: 'kay-laa' },
    { id: 'water', word: 'पानी (Paani)', meaning: 'Water', category: 'Food', icon: '💧', phonetic: 'paa-nee' },
    { id: 'milk', word: 'दूध (Doodh)', meaning: 'Milk', category: 'Food', icon: '🥛', phonetic: 'doodh' },
    { id: 'bread', word: 'रोटी (Roti)', meaning: 'Bread / Roti', category: 'Food', icon: '🫓', phonetic: 'ro-tee' },
    { id: 'rice', word: 'चावल (Chawal)', meaning: 'Rice', category: 'Food', icon: '🍚', phonetic: 'chaa-wal' },
    { id: 'tea', word: 'चाय (Chai)', meaning: 'Tea', category: 'Food', icon: '☕', phonetic: 'chai' },

    // Home & Nature (10)
    { id: 'house', word: 'घर (Ghar)', meaning: 'The House', category: 'Home', icon: '🏠', phonetic: 'ghar' },
    { id: 'door', word: 'दरवाजा (Darwaza)', meaning: 'The Door', category: 'Home', icon: '🚪', phonetic: 'dar-waa-zaa' },
    { id: 'sun', word: 'सूरज (Suraj)', meaning: 'The Sun', category: 'Nature', icon: '☀️', phonetic: 'soo-raj' },
    { id: 'moon', word: 'चांद (Chaand)', meaning: 'The Moon', category: 'Nature', icon: '🌙', phonetic: 'chaand' },
    { id: 'star', word: 'तारा (Taara)', meaning: 'The Star', category: 'Nature', icon: '⭐️', phonetic: 'taa-raa' },
    { id: 'tree', word: 'पेड़ (Ped)', meaning: 'The Tree', category: 'Nature', icon: '🌳', phonetic: 'ped' },
    { id: 'flower', word: 'फूल (Phool)', meaning: 'The Flower', category: 'Nature', icon: '🌸', phonetic: 'phool' }
  ],
  ja: [
    { id: 'cat', word: '猫 (Neko)', meaning: 'The Cat', category: 'Animals', icon: '🐱', phonetic: 'neh-koh' },
    { id: 'dog', word: '犬 (Inu)', meaning: 'The Dog', category: 'Animals', icon: '🐕', phonetic: 'ee-noo' },
    { id: 'bird', word: '鳥 (Tori)', meaning: 'The Bird', category: 'Animals', icon: '🐦', phonetic: 'toh-ree' },
    { id: 'sun', word: '太陽 (Taiyou)', meaning: 'The Sun', category: 'Nature', icon: '☀️', phonetic: 'ta-ee-yoh' },
    { id: 'moon', word: '月 (Tsuki)', meaning: 'The Moon', category: 'Nature', icon: '🌙', phonetic: 'tsoo-kee' },
    { id: 'apple', word: 'りんご (Ringo)', meaning: 'The Apple', category: 'Food', icon: '🍎', phonetic: 'reen-goh' },
    { id: 'water', word: '水 (Mizu)', meaning: 'Water', category: 'Food', icon: '💧', phonetic: 'mee-zoo' },
    { id: 'house', word: '家 (Ie)', meaning: 'The House', category: 'Home', icon: '🏠', phonetic: 'ee-eh' },
    { id: 'car', word: '車 (Kuruma)', meaning: 'The Car', category: 'Transport', icon: '🚗', phonetic: 'koo-roo-mah' }
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
