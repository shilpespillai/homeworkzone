// Curious Mind Academy - Concept Categories & Topics Data

export const CATEGORIES = [
  { id: 'all', label: 'All Topics', icon: '🌟', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  { id: 'human_body', label: 'Human Body', icon: '🫀', color: 'bg-rose-100 text-rose-900 border-rose-300' },
  { id: 'brain_sleep', label: 'Brain, Sleep & Emotions', icon: '🧠', color: 'bg-purple-100 text-purple-900 border-purple-300' },
  { id: 'animals', label: 'Animals', icon: '🐾', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { id: 'plants', label: 'Plants', icon: '🌿', color: 'bg-green-100 text-green-900 border-green-300' },
  { id: 'space', label: 'Space', icon: '🚀', color: 'bg-blue-100 text-blue-900 border-blue-300' },
  { id: 'earth_weather', label: 'Earth & Weather', icon: '🌍', color: 'bg-cyan-100 text-cyan-900 border-cyan-300' },
  { id: 'physics_everyday', label: 'Physics & Everyday Science', icon: '⚡', color: 'bg-yellow-100 text-yellow-900 border-yellow-300' },
  { id: 'food_chemistry', label: 'Food & Chemistry', icon: '🧪', color: 'bg-teal-100 text-teal-900 border-teal-300' },
  { id: 'technology', label: 'Technology', icon: '🤖', color: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
  { id: 'fun_surprising', label: 'Fun & Surprising', icon: '✨', color: 'bg-pink-100 text-pink-900 border-pink-300' }
];

export const TOPICS = [
  // Human Body (17 Topics)
  {
    id: 'goosebumps',
    title: 'Why Do Humans Get Goosebumps?',
    category: 'human_body',
    cardImage: '/curious_whole_goosebumps.png'
  },
  {
    id: 'baby_teeth',
    title: 'Why Do Kids Lose Their Baby Teeth?',
    category: 'human_body',
    cardImage: '/curious_whole_teeth.png'
  },
  {
    id: 'constipation',
    title: 'Why Do We Get Constipated?',
    category: 'human_body',
    cardImage: '/curious_whole_constipation.png'
  },
  {
    id: 'blink',
    title: 'Why Do We Blink So Much?',
    category: 'human_body',
    cardImage: '/curious_whole_blink.png'
  },
  {
    id: 'cuts',
    title: 'Why Do Cuts Bleed?',
    category: 'human_body',
    cardImage: '/curious_whole_cuts.png'
  },
  {
    id: 'yawn',
    title: 'Why Do We Yawn?',
    category: 'human_body',
    cardImage: '/curious_whole_yawn.png'
  },
  {
    id: 'burp',
    title: 'Why Do We Burp?',
    category: 'human_body',
    cardImage: '/curious_whole_burp.png'
  },
  {
    id: 'cough',
    title: 'Why Do We Cough?',
    category: 'human_body',
    cardImage: '/curious_whole_cough.png'
  },
  {
    id: 'fart',
    title: 'Why Do We Fart?',
    category: 'human_body',
    cardImage: '/curious_whole_fart.png'
  },
  {
    id: 'feel_hungry',
    title: 'Why Do We Feel Hungry?',
    category: 'human_body',
    cardImage: '/curious_whole_feel_hungry.png'
  },
  {
    id: 'feel_thirsty',
    title: 'Why Do We Feel Thirsty?',
    category: 'human_body',
    cardImage: '/curious_whole_feel_thirsty.png'
  },
  {
    id: 'hiccup',
    title: 'Why Do We Hiccup?',
    category: 'human_body',
    cardImage: '/curious_whole_hiccup.png'
  },
  {
    id: 'shiver',
    title: 'Why Do We Shiver?',
    category: 'human_body',
    cardImage: '/curious_whole_shiver.png'
  },
  {
    id: 'sneeze',
    title: 'Why Do We Sneeze?',
    category: 'human_body',
    cardImage: '/curious_whole_sneeze.png'
  },
  {
    id: 'sweat',
    title: 'Why Do We Sweat?',
    category: 'human_body',
    cardImage: '/curious_whole_sweat.png'
  },
  {
    id: 'vomit',
    title: 'Why Do We Vomit?',
    category: 'human_body',
    cardImage: '/curious_whole_vomit.png'
  },
  {
    id: 'stomach_growl',
    title: 'Why Does Our Stomach Growl?',
    category: 'human_body',
    cardImage: '/curious_whole_stomach_growl.png'
  },

  // Brain, Sleep & Emotions (3 Topics)
  {
    id: 'cry',
    title: 'Why Do We Cry?',
    category: 'brain_sleep',
    cardImage: '/curious_whole_cry.png'
  },
  {
    id: 'forget',
    title: 'Why Do We Forget Things?',
    category: 'brain_sleep',
    cardImage: '/curious_whole_forget.jpg'
  },
  {
    id: 'dream',
    title: 'Why Do We Dream?',
    category: 'brain_sleep',
    cardImage: '/curious_whole_dream.jpg'
  }
];

export const TOPIC_DETAILS = {
  goosebumps: {
    image: '/curious_goosebumps.png',
    bgColor: 'border-orange-400',
    accentColor: 'from-orange-400 via-amber-400 to-sky-400',
    quizBg: 'bg-purple-50 border-purple-200',
    quizText: 'text-purple-950',
    quizBadge: 'bg-purple-200 text-purple-800',
    footer: "YOUR BODY IS AMAZING! It has lots of tiny, smart ways to take care of you every single day. 🌟",
    quiz: {
      question: "What is the name of the tiny muscle that pulls your hairs upright?",
      options: [
        "The Bicep Muscle 💪",
        "The Arrector Pili Muscle 🔬",
        "The Cardiac Muscle ❤️",
        "The Gluteus Muscle 🏃"
      ],
      correctIndex: 1,
      explanation: "Excellent! The arrector pili is the tiny muscle connected to each hair follicle that contracts and makes the hair stand up."
    }
  },
  baby_teeth: {
    image: '/curious_baby_teeth.png',
    bgColor: 'border-blue-400',
    accentColor: 'from-blue-400 via-sky-300 to-indigo-400',
    quizBg: 'bg-blue-50 border-blue-200',
    quizText: 'text-blue-950',
    quizBadge: 'bg-blue-200 text-blue-800',
    footer: "KEEP SMILING! Take care of your teeth today for a healthy smile tomorrow! 🪥🦷",
    quiz: {
      question: "How many baby teeth do kids have in total before they start falling out?",
      options: [
        "10 Teeth 🦷",
        "20 Teeth 🦷",
        "32 Teeth 🦷",
        "5 Teeth 🦷"
      ],
      correctIndex: 1,
      explanation: "Great job! Kids have 20 baby teeth in total (10 on the top and 10 on the bottom) which make space for their permanent teeth."
    }
  },
  constipation: {
    image: '/curious_constipation.png',
    bgColor: 'border-emerald-400',
    accentColor: 'from-emerald-400 via-teal-300 to-green-500',
    quizBg: 'bg-emerald-50 border-emerald-200',
    quizText: 'text-emerald-950',
    quizBadge: 'bg-emerald-200 text-emerald-800',
    footer: "A HAPPY TUMMY LEADS TO A HAPPY YOU! Eat well, drink water, move, and listen to your body! 🥗💦",
    quiz: {
      question: "Which organ is in charge of absorbing water from food and making poop?",
      options: [
        "The Brain 🧠",
        "The Large Intestine 💩",
        "The Heart 🫀",
        "The Stomach 🍽️"
      ],
      correctIndex: 1,
      explanation: "Correct! The Large Intestine is responsible for absorbing water from food and helping form poop."
    }
  },
  blink: {
    image: '/curious_blink.jpg',
    bgColor: 'border-sky-400',
    accentColor: 'from-sky-400 via-teal-300 to-blue-500',
    quizBg: 'bg-sky-50 border-sky-200',
    quizText: 'text-sky-950',
    quizBadge: 'bg-sky-200 text-sky-800',
    footer: "BLINKING PROTECTS YOUR EYES! It spreads tears, cleans dust, and keeps your vision crystal clear. 👁️✨",
    quiz: {
      question: "What is the thin layer of tears that covers and protects the front of your eye called?",
      options: [
        "The Eye Shield 🛡️",
        "The Tear Film 💧",
        "The Water Blanket 🌊",
        "The Eye Shell 🐚"
      ],
      correctIndex: 1,
      explanation: "Correct! The tear film is the thin layer of water, oils, and mucus spread across your eye every time you blink to keep it smooth, moist, and clean."
    }
  },
  cuts: {
    image: '/curious_cuts.png',
    bgColor: 'border-rose-400',
    accentColor: 'from-rose-400 via-amber-300 to-red-500',
    quizBg: 'bg-rose-50 border-rose-200',
    quizText: 'text-rose-950',
    quizBadge: 'bg-rose-200 text-rose-800',
    footer: "YOUR BODY IS A HEALING CHAMPION! Platelets and clots work like a tiny rescue crew to protect you! 🩹🛡️",
    quiz: {
      question: "What tiny parts in your blood rush to stick together and make a patch when you get a cut?",
      options: [
        "Platelets 🩹",
        "Bone cells 🦴",
        "Hair follicles 💇",
        "Muscle fibers 💪"
      ],
      correctIndex: 0,
      explanation: "Spot on! Platelets are the tiny blood parts that stick together like a patch crew to form a clot and stop bleeding."
    }
  },
  yawn: {
    image: '/curious_yawn.png',
    bgColor: 'border-amber-400',
    accentColor: 'from-amber-400 via-orange-300 to-sky-400',
    quizBg: 'bg-amber-50 border-amber-200',
    quizText: 'text-amber-950',
    quizBadge: 'bg-amber-200 text-amber-800',
    footer: "A YAWN IS A NATURAL REFLEX! It helps your brain reset, stretch, and stay alert. 🥱✨",
    quiz: {
      question: "What is a yawn considered in the human body?",
      options: [
        "A planned decision 🤔",
        "An automatic reflex 🥱",
        "A muscle exercise 💪",
        "A habit you practice 📋"
      ],
      correctIndex: 1,
      explanation: "Correct! A yawn is an automatic reflex that your body starts without you planning every step."
    }
  },
  burp: {
    image: '/curious_burp.png',
    bgColor: 'border-amber-400',
    accentColor: 'from-amber-400 via-orange-300 to-yellow-400',
    quizBg: 'bg-amber-50 border-amber-200',
    quizText: 'text-amber-950',
    quizBadge: 'bg-amber-200 text-amber-800',
    footer: "BURPING IS NORMAL! It's your stomach's way of gently letting out extra air bubbles! 🫧🥤",
    quiz: {
      question: "What is a burp mostly made of?",
      options: [
        "Swallowed air and gas bubbles 🫧",
        "Liquid water 💧",
        "Tiny solid food pieces 🍕",
        "Warm steam ♨️"
      ],
      correctIndex: 0,
      explanation: "Spot on! Burping is simply your body's way of releasing extra air and gas bubbles that collected in your stomach."
    }
  },
  cough: {
    image: '/curious_cough.png',
    bgColor: 'border-sky-400',
    accentColor: 'from-sky-400 via-blue-300 to-indigo-400',
    quizBg: 'bg-sky-50 border-sky-200',
    quizText: 'text-sky-950',
    quizBadge: 'bg-sky-200 text-sky-800',
    footer: "COUGHING PROTECTS YOUR LUNGS! It quickly clears out dust and irritants so you can breathe easy! 🌬️🛡️",
    quiz: {
      question: "Why does your body trigger a cough?",
      options: [
        "To make funny sounds 🎵",
        "To clear dust, mucus, or irritants from your airways 🌬️",
        "To cool down your ears 👂",
        "To exercise your teeth 🦷"
      ],
      correctIndex: 1,
      explanation: "Correct! Coughing is a protective reflex that clears out irritants and keeps your airways clean."
    }
  },
  fart: {
    image: '/curious_fart.png',
    bgColor: 'border-emerald-400',
    accentColor: 'from-emerald-400 via-teal-300 to-green-500',
    quizBg: 'bg-emerald-50 border-emerald-200',
    quizText: 'text-emerald-950',
    quizBadge: 'bg-emerald-200 text-emerald-800',
    footer: "FARTING IS A HEALTHY SIGN! It means your gut bacteria are busy digesting your nutritious food! 🥗💨",
    quiz: {
      question: "What tiny helpers in your large intestine create gas while breaking down food?",
      options: [
        "Friendly gut bacteria 🔬",
        "Muscle fibers 💪",
        "Bone cells 🦴",
        "Red blood cells 🩸"
      ],
      correctIndex: 0,
      explanation: "Great job! Trillions of helpful gut bacteria break down food fiber and create gas as a natural byproduct."
    }
  },
  feel_hungry: {
    image: '/curious_feel_hungry.png',
    bgColor: 'border-orange-400',
    accentColor: 'from-orange-400 via-amber-300 to-yellow-400',
    quizBg: 'bg-orange-50 border-orange-200',
    quizText: 'text-orange-950',
    quizBadge: 'bg-orange-200 text-orange-800',
    footer: "HUNGER IS YOUR BODY'S FUEL GAUGE! It tells you when it's time to recharge with healthy food! 🍎⚡",
    quiz: {
      question: "What is your body asking for when you feel hungry?",
      options: [
        "More sleep 💤",
        "Energy and nutrients from food 🥗",
        "A cold shower 🚿",
        "More screen time 📱"
      ],
      correctIndex: 1,
      explanation: "Spot on! Hunger is a smart chemical signal from your brain and stomach telling you that your body needs energy and nutrients."
    }
  },
  feel_thirsty: {
    image: '/curious_feel_thirsty.png',
    bgColor: 'border-cyan-400',
    accentColor: 'from-cyan-400 via-sky-300 to-blue-500',
    quizBg: 'bg-cyan-50 border-cyan-200',
    quizText: 'text-cyan-950',
    quizBadge: 'bg-cyan-200 text-cyan-800',
    footer: "WATER KEEPS YOU POWERED UP! Drink water throughout the day to keep your brain and body happy! 💧🏃",
    quiz: {
      question: "Which organ senses when your body needs more water and makes you feel thirsty?",
      options: [
        "The Brain 🧠",
        "The Big Toe 🦶",
        "The Elbow 🦴",
        "The Hair 💇"
      ],
      correctIndex: 0,
      explanation: "Correct! Your brain monitors hydration levels and sends a thirst signal so you drink water to stay balanced."
    }
  },
  hiccup: {
    image: '/curious_hiccup.png',
    bgColor: 'border-purple-400',
    accentColor: 'from-purple-400 via-fuchsia-300 to-indigo-400',
    quizBg: 'bg-purple-50 border-purple-200',
    quizText: 'text-purple-950',
    quizBadge: 'bg-purple-200 text-purple-800',
    footer: "HICCUPS ARE JUST LITTLE MUSCLE SPASMS! They usually go away all on their own! 🥤🎈",
    quiz: {
      question: "Which breathing muscle spasms or twitches when you get hiccups?",
      options: [
        "The Bicep 💪",
        "The Diaphragm 🫁",
        "The Heart ❤️",
        "The Tongue 👅"
      ],
      correctIndex: 1,
      explanation: "Spot on! The diaphragm is the dome-shaped breathing muscle below your lungs that temporarily twitches during hiccups."
    }
  },
  shiver: {
    image: '/curious_shiver.png',
    bgColor: 'border-sky-400',
    accentColor: 'from-sky-400 via-teal-300 to-blue-500',
    quizBg: 'bg-sky-50 border-sky-200',
    quizText: 'text-sky-950',
    quizBadge: 'bg-sky-200 text-sky-800',
    footer: "SHIVERING IS YOUR BODY'S NATURAL HEATER! Fast muscle vibrations generate quick warmth! ❄️🔥",
    quiz: {
      question: "How does shivering help when you feel cold?",
      options: [
        "It cools down your skin 🧊",
        "Tiny rapid muscle movements create body heat 🔥",
        "It makes you run faster 🏃",
        "It makes you sleepy 💤"
      ],
      correctIndex: 1,
      explanation: "Excellent! Shivering causes muscles to tighten and relax rapidly, which burns energy to generate warmth."
    }
  },
  sneeze: {
    image: '/curious_sneeze.png',
    bgColor: 'border-amber-400',
    accentColor: 'from-amber-400 via-orange-300 to-yellow-400',
    quizBg: 'bg-amber-50 border-amber-200',
    quizText: 'text-amber-950',
    quizBadge: 'bg-amber-200 text-amber-800',
    footer: "SNEEZING CLEANS YOUR NOSE AT HIGH SPEED! Always sneeze into your elbow to keep friends safe! 🤧✨",
    quiz: {
      question: "What is the main purpose of a sneeze?",
      options: [
        "To quickly blow out dust, pollen, and irritants from your nose 👃💨",
        "To exercise your throat 🗣️",
        "To blink faster 👁️",
        "To stretch your ears 👂"
      ],
      correctIndex: 0,
      explanation: "Spot on! A sneeze is a powerful reflex that blasts away dust and tickly irritants from your nasal passages."
    }
  },
  sweat: {
    image: '/curious_sweat.png',
    bgColor: 'border-blue-400',
    accentColor: 'from-blue-400 via-cyan-300 to-teal-400',
    quizBg: 'bg-blue-50 border-blue-200',
    quizText: 'text-blue-950',
    quizBadge: 'bg-blue-200 text-blue-800',
    footer: "SWEAT IS YOUR PERSONAL AIR CONDITIONER! It evaporates to keep you from overheating! ☀️💦",
    quiz: {
      question: "How does sweating cool down your body?",
      options: [
        "Sweat turns into ice cubes 🧊",
        "As sweat evaporates into the air, it takes heat away with it 💨",
        "Sweat makes muscles heavier 🏋️",
        "Sweat stops you from moving 🛑"
      ],
      correctIndex: 1,
      explanation: "Correct! Evaporative cooling is the science of sweat taking heat energy away from your skin as it turns to vapor."
    }
  },
  vomit: {
    image: '/curious_vomit.png',
    bgColor: 'border-rose-400',
    accentColor: 'from-rose-400 via-amber-300 to-red-400',
    quizBg: 'bg-rose-50 border-rose-200',
    quizText: 'text-rose-950',
    quizBadge: 'bg-rose-200 text-rose-800',
    footer: "VOMITING IS A PROTECTIVE REFLEX! It quickly empties your stomach if you eat something harmful! 🛡️🍵",
    quiz: {
      question: "Why does the brain trigger vomiting when you are sick or eat spoiled food?",
      options: [
        "To quickly remove harmful germs or toxins from the stomach 🛡️",
        "To make room for dessert 🍰",
        "To practice stomach exercises 🏋️",
        "To cool down your knees 🦵"
      ],
      correctIndex: 0,
      explanation: "Spot on! Vomiting is an emergency protective reflex to expel spoiled food, toxins, or viruses before they cause more harm."
    }
  },
  stomach_growl: {
    image: '/curious_stomach_growl.png',
    bgColor: 'border-teal-400',
    accentColor: 'from-teal-400 via-emerald-300 to-cyan-400',
    quizBg: 'bg-teal-50 border-teal-200',
    quizText: 'text-teal-950',
    quizBadge: 'bg-teal-200 text-teal-800',
    footer: "STOMACH GROWLS ARE SOUNDS OF DIGESTION! Liquid, air, and muscle squeezes create the rumbles! 🎵🥪",
    quiz: {
      question: "What causes the rumbling sound when your stomach growls?",
      options: [
        "A tiny monster living inside 👾",
        "Muscles squeezing fluids and gas through the digestive tract 🌊💨",
        "Your ribs rubbing together 🦴",
        "Your heart beating too loud ❤️"
      ],
      correctIndex: 1,
      explanation: "Spot on! Stomach growling (peristalsis) happens when muscles contract and squeeze liquid and air bubbles through your digestive system."
    }
  },

  // Brain, Sleep & Emotions
  cry: {
    image: '/curious_cry.png',
    bgColor: 'border-cyan-400',
    accentColor: 'from-cyan-400 via-sky-300 to-blue-500',
    quizBg: 'bg-cyan-50 border-cyan-200',
    quizText: 'text-cyan-950',
    quizBadge: 'bg-cyan-200 text-cyan-800',
    footer: "IT'S OKAY TO CRY! It is a healthy way to take care of your heart, mind, and body. ❤️💧",
    quiz: {
      question: "What type of tears are made all the time to keep your eyes moist and healthy?",
      options: [
        "Reflex Tears 🧅",
        "Emotional Tears 😭",
        "Basal Tears 💧",
        "Stress Tears ⚡"
      ],
      correctIndex: 2,
      explanation: "Spot on! Basal tears are produced continuously by your eyes to keep them clean, moist, and protected."
    }
  },
  forget: {
    image: '/curious_forget.jpg',
    bgColor: 'border-pink-400',
    accentColor: 'from-pink-400 via-rose-300 to-purple-400',
    quizBg: 'bg-pink-50 border-pink-200',
    quizText: 'text-pink-950',
    quizBadge: 'bg-pink-200 text-pink-800',
    footer: "FORGETTING IS NORMAL! It's your brain's smart way of making space and staying focused. 🧠📚",
    quiz: {
      question: "What two things give your brain time to organize and strengthen new memories?",
      options: [
        "Running fast and shouting 🏃",
        "Practice, repetition, and sleep 💤",
        "Drinking fizzy drinks 🥤",
        "Watching TV all night 📺"
      ],
      correctIndex: 1,
      explanation: "Spot on! Practice, repetition, and quality sleep give your brain the time and connections it needs to strengthen memories."
    }
  },
  dream: {
    image: '/curious_dream.jpg',
    bgColor: 'border-indigo-400',
    accentColor: 'from-indigo-400 via-purple-300 to-pink-500',
    quizBg: 'bg-indigo-50 border-indigo-200',
    quizText: 'text-indigo-950',
    quizBadge: 'bg-indigo-200 text-indigo-800',
    footer: "DREAMS ARE YOUR BRAIN'S SUPERPOWER! They help you learn, grow, and be the best YOU. 🌟💤",
    quiz: {
      question: "During which stage of sleep do we dream the most?",
      options: [
        "Deep Sleep 💤",
        "Light Sleep ⏰",
        "REM Sleep 🧠",
        "Waking Up 👁️"
      ],
      correctIndex: 2,
      explanation: "Correct! REM (Rapid Eye Movement) sleep is when your brain is very active, and that's when you have most of your vivid dreams!"
    }
  }
};
