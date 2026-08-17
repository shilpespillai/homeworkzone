/**
 * Static dictionary and rubric data for NAPLAN & Essay Writing structures.
 * Keeping these static on the frontend reduces LLM token consumption by over 80%!
 */

export const WRITING_GENRES = {
  persuasive: {
    id: 'persuasive',
    name: 'NAPLAN Persuasive Writing',
    badge: 'Grade 3–9 NAPLAN Persuasive',
    icon: '🗣️',
    description: 'Convince the reader to agree with your position using strong reasons, emotive words, and evidence.',
    starters: [
      'First of all, ...',
      'In addition, ...',
      'Another compelling reason is ...',
      'Finally, ...',
      'In conclusion, ...'
    ],
    linkingWords: {
      adding: ['and', 'also', 'in addition', 'furthermore', 'moreover'],
      explaining: ['because', 'since', 'as', 'so', 'therefore'],
      contrasting: ['but', 'however', 'even though', 'although']
    },
    checklistCategories: [
      {
        id: 'ideasContent',
        title: 'IDEAS & CONTENT',
        icon: '💡',
        items: [
          'Give 3 clear reasons (like you did).',
          'Add more details and examples.',
          'Explain why each reason is important.'
        ]
      },
      {
        id: 'sentenceStructure',
        title: 'SENTENCE STRUCTURE',
        icon: '✏️',
        items: [
          'Use a variety of sentence starters.',
          'Write complete sentences.',
          'Use proper punctuation (. , ! ?).'
        ]
      },
      {
        id: 'vocabulary',
        title: 'VOCABULARY',
        icon: '📘',
        items: [
          'Use stronger and more interesting words.',
          'Avoid repeating the same words (nice, good, go).'
        ]
      },
      {
        id: 'organisation',
        title: 'ORGANISATION',
        icon: '🎯',
        items: [
          'Start with a strong opening.',
          'Use linking words (firstly, secondly, in addition, finally).',
          'End with a powerful conclusion that sums up your reasons.'
        ]
      }
    ]
  },
  narrative: {
    id: 'narrative',
    name: 'NAPLAN Narrative Writing',
    badge: 'Grade 3–9 NAPLAN Story',
    icon: '📖',
    description: 'Tell an engaging story with a clear setting, character development, complication, and resolution.',
    starters: [
      'Deep within the ...',
      'Without warning, ...',
      'As the sun began to set, ...',
      'Before anyone could react, ...',
      'Looking back at what happened, ...'
    ],
    linkingWords: {
      adding: ['meanwhile', 'suddenly', 'at that moment', 'all of a sudden'],
      explaining: ['as a result', 'for this reason', 'due to', 'instantly'],
      contrasting: ['despite this', 'unlike before', 'yet', 'nevertheless']
    },
    checklistCategories: [
      {
        id: 'ideasContent',
        title: 'STORY & SETTING',
        icon: '🌟',
        items: [
          'Establish a vivid setting and main character.',
          'Create a clear and exciting complication (problem).',
          'Provide a satisfying resolution to the conflict.'
        ]
      },
      {
        id: 'sentenceStructure',
        title: 'DESCRIPTIVE POWER',
        icon: '🎨',
        items: [
          'Use "Show, Don\'t Tell" sensory descriptions.',
          'Vary sentence lengths for dramatic tension.',
          'Include natural dialogue with speech marks.'
        ]
      },
      {
        id: 'vocabulary',
        title: 'VOCABULARY & FIGURATIVE LANGUAGE',
        icon: '💎',
        items: [
          'Use strong verbs and vivid adjectives.',
          'Incorporate figurative language (similes, metaphors).'
        ]
      },
      {
        id: 'organisation',
        title: 'PLOT STRUCTURE',
        icon: '🗺️',
        items: [
          'Strong orientation introducing time and place.',
          'Logical sequence of events leading to climax.',
          'Thoughtful ending reflecting on the journey.'
        ]
      }
    ]
  },
  informative: {
    id: 'informative',
    name: 'NAPLAN Informative Report',
    badge: 'Grade 3–9 Informative / Report',
    icon: '📊',
    description: 'Provide clear, factual information about a topic using subheadings, technical terms, and evidence.',
    starters: [
      'To begin with, ...',
      'It is widely recognized that ...',
      'Specifically, ...',
      'In addition to this, ...',
      'In summary, ...'
    ],
    linkingWords: {
      adding: ['furthermore', 'in addition', 'alongside', 'additionally'],
      explaining: ['as a result', 'this means that', 'owing to', 'consequently'],
      contrasting: ['in contrast', 'unlike', 'however', 'conversely']
    },
    checklistCategories: [
      {
        id: 'ideasContent',
        title: 'FACTS & ACCURACY',
        icon: '🔍',
        items: [
          'Provide clear classification and definition of the topic.',
          'Include accurate facts and supporting statistics/details.',
          'Explain technical processes step-by-step.'
        ]
      },
      {
        id: 'sentenceStructure',
        title: 'CLARITY & TONE',
        icon: '📢',
        items: [
          'Maintain an objective, formal third-person tone.',
          'Use clear subheadings to group information.',
          'Ensure correct technical punctuation.'
        ]
      },
      {
        id: 'vocabulary',
        title: 'TECHNICAL VOCABULARY',
        icon: '🔬',
        items: [
          'Use domain-specific technical vocabulary.',
          'Define complex terms clearly for the reader.'
        ]
      },
      {
        id: 'organisation',
        title: 'REPORT STRUCTURE',
        icon: '📋',
        items: [
          'General classification opening.',
          'Logical paragraphs organized by sub-themes.',
          'Concluding summary statement.'
        ]
      }
    ]
  },
  essay: {
    id: 'essay',
    name: 'High School Essay (PEEL / TEEL)',
    badge: 'Grade 7–12 Academic Essay',
    icon: '🎓',
    description: 'Construct a formal analytical essay structured around a clear thesis and PEEL/TEEL body paragraphs.',
    starters: [
      'Primarily, the evidence suggests ...',
      'This is exemplified when ...',
      'Consequently, it becomes evident that ...',
      'By analyzing this perspective, ...',
      'Ultimately, this underscores ...'
    ],
    linkingWords: {
      adding: ['furthermore', 'moreover', 'subsequently', 'in tandem with'],
      explaining: ['thereby demonstrating', 'thus illustrating', 'as a consequence'],
      contrasting: ['notwithstanding', 'conversely', 'nevertheless', 'whereas']
    },
    checklistCategories: [
      {
        id: 'ideasContent',
        title: 'THESIS & ARGUMENT',
        icon: '🏛️',
        items: [
          'State a clear thesis in the introduction.',
          'Support claims with direct textual evidence.',
          'Demonstrate critical analysis rather than plot summary.'
        ]
      },
      {
        id: 'sentenceStructure',
        title: 'PEEL / TEEL STRUCTURE',
        icon: '🏗️',
        items: [
          'Clear topic sentences setting up arguments.',
          'Seamless integration of quotes and evidence.',
          'Explicit linking sentences connecting back to thesis.'
        ]
      },
      {
        id: 'vocabulary',
        title: 'ACADEMIC DICTION',
        icon: '📜',
        items: [
          'Employ sophisticated analytical verbs and terms.',
          'Maintain rigorous academic tone.'
        ]
      },
      {
        id: 'organisation',
        title: 'ESSAY ARCHITECTURE',
        icon: '⚖️',
        items: [
          'Comprehensive introduction with context and roadmap.',
          'Cohesive transitions between body paragraphs.',
          'Synthesized conclusion reinforcing broader significance.'
        ]
      }
    ]
  }
};

/**
 * Intelligent client-side exemplar generator fallback.
 * Used if AI endpoints are offline or in dev mode without API keys.
 */
export const synthesizeExemplarFallback = (topic, draft, genreKey = 'persuasive', grade = 'Grade 5') => {
  const genre = WRITING_GENRES[genreKey] || WRITING_GENRES.persuasive;
  const draftLines = (draft || '').split('\n').map(l => l.trim()).filter(Boolean);
  const cleanTitle = topic || (draftLines[0]?.replace(/^#*\s*/, '') || "My Writing Journey");

  // Common weak words dictionary
  const weakWordsMap = {
    'nice': ['wonderful', 'exciting', 'delightful', 'picturesque'],
    'good': ['fantastic', 'exceptional', 'beneficial', 'rewarding'],
    'yummy': ['delicious', 'mouth-watering', 'exquisite'],
    'bad': ['challenging', 'disastrous', 'unfavourable'],
    'big': ['enormous', 'gigantic', 'monumental', 'vast'],
    'fun': ['thrilling', 'exhilarating', 'entertaining'],
    'went': ['journeyed', 'travelled', 'ventured', 'explored'],
    'said': ['explained', 'remarked', 'declared', 'expressed'],
    'happy': ['ecstatic', 'thrilled', 'overjoyed', 'delighted'],
    'a lot': ['abundant', 'numerous', 'plentiful', 'a multitude of']
  };

  const detectedReplacements = [];
  const lowerDraft = (draft || '').toLowerCase();
  for (const [weak, list] of Object.entries(weakWordsMap)) {
    if (lowerDraft.includes(weak)) {
      detectedReplacements.push({ weakWord: weak, replacements: list.slice(0, 3) });
    }
  }

  if (detectedReplacements.length === 0) {
    detectedReplacements.push(
      { weakWord: 'nice', replacements: ['wonderful', 'exciting', 'captivating'] },
      { weakWord: 'good', replacements: ['remarkable', 'outstanding', 'beneficial'] },
      { weakWord: 'yummy', replacements: ['delicious', 'tasty', 'flavourful'] }
    );
  }

  // Pre-crafted structured exemplars per genre
  if (genreKey === 'persuasive') {
    return {
      improvedTitle: cleanTitle.replace(/\?*$/, ''),
      exemplarParagraphs: [
        `In my opinion, exploring ${cleanTitle.toLowerCase().replace(/should we|why we should|how to/g, '').trim()} is an unforgettable opportunity and the perfect choice to celebrate personal growth.`,
        `1. First of all, this experience provides the essential time to truly relax, recharge, and enjoy a well-deserved break from routine school commitments.`,
        `2. In addition, it offers breathtaking locations to explore, allowing us to discover vibrant cultural landmarks and create memories that will last a lifetime.`,
        `3. Finally, it provides an incredible chance to enjoy delicious local delicacies and exciting adventures with friends and family.`,
        `In conclusion, taking on this journey is an exceptional decision because it combines relaxation, enriching cultural discovery, and unforgettable joy.`
      ],
      annotations: [
        { paraIndex: 0, targetText: "unforgettable opportunity", label: "Strong opening statement", color: "green" },
        { paraIndex: 1, targetText: "truly relax, recharge", label: "More specific and strong reason", color: "green" },
        { paraIndex: 2, targetText: "breathtaking locations to explore", label: "Better details and examples", color: "blue" },
        { paraIndex: 3, targetText: "delicious local delicacies", label: "Stronger words and feelings", color: "purple" },
        { paraIndex: 4, targetText: "exceptional decision because", label: "Stronger conclusion that restates reasons", color: "green" }
      ],
      diagnosticChecks: {
        ideasContent: [true, true, true],
        sentenceStructure: [true, true, true],
        vocabulary: [false, true],
        organisation: [true, true, true]
      },
      wordReplacements: detectedReplacements.slice(0, 4)
    };
  }

  if (genreKey === 'narrative') {
    return {
      improvedTitle: cleanTitle,
      exemplarParagraphs: [
        `As the afternoon shadows stretched across the floor, I crept quietly up the squeaking stairs into the mysterious attic, where dust danced in the pale moonlight.`,
        `Without warning, my fingers brushed against a weathered wooden chest hidden beneath a heavy canvas cloth. Inside rested an ancient parchment map illuminated by an eerie sapphire glow.`,
        `Before I could catch my breath, a hidden latch clicked and the floorboards parted beneath my feet, tumbling me into a vast subterranean labyrinth beneath our home.`,
        `Resting upon a carved stone altar stood an ornate crystal key, humming with raw energy. Clutching it tightly, I scrambled up the stone steps with my heart thumping wildly.`,
        `Looking back at that stormy afternoon, I realized our quiet house was guarding secrets far grander than anyone could have ever imagined.`
      ],
      annotations: [
        { paraIndex: 0, targetText: "dust danced in the pale moonlight", label: "Show, Don't Tell setting", color: "blue" },
        { paraIndex: 1, targetText: "eerie sapphire glow", label: "Vivid descriptive adjective", color: "purple" },
        { paraIndex: 2, targetText: "vast subterranean labyrinth", label: "Elevated story vocabulary", color: "purple" },
        { paraIndex: 3, targetText: "humming with raw energy", label: "Sensory & action tension", color: "blue" },
        { paraIndex: 4, targetText: "guarding secrets far grander", label: "Satisfying reflective resolution", color: "green" }
      ],
      diagnosticChecks: {
        ideasContent: [true, true, true],
        sentenceStructure: [true, true, true],
        vocabulary: [true, true],
        organisation: [true, true, true]
      },
      wordReplacements: detectedReplacements.slice(0, 4)
    };
  }

  if (genreKey === 'informative') {
    return {
      improvedTitle: cleanTitle,
      exemplarParagraphs: [
        `It is widely recognized that ${cleanTitle.toLowerCase()} plays a crucial role in maintaining balanced ecological systems across global habitats.`,
        `To begin with, these organisms function as vital natural pollinators. By transferring microscopic pollen grains across flowering flora, they sustain agricultural yields for hundreds of staple food crops.`,
        `Furthermore, scientific studies demonstrate that ecosystem biodiversity diminishes significantly without these active pollinators sustaining plant reproduction cycles.`,
        `In summary, safeguarding these essential species is paramount to securing global food security and preserving healthy environmental ecosystems.`
      ],
      annotations: [
        { paraIndex: 0, targetText: "vital natural pollinators", label: "Clear formal classification", color: "green" },
        { paraIndex: 1, targetText: "transferring microscopic pollen grains", label: "Technical scientific accuracy", color: "blue" },
        { paraIndex: 2, targetText: "ecosystem biodiversity diminishes", label: "Cause and effect explanation", color: "blue" },
        { paraIndex: 3, targetText: "safeguarding these essential species", label: "Synthesized summary conclusion", color: "green" }
      ],
      diagnosticChecks: {
        ideasContent: [true, true, true],
        sentenceStructure: [true, true, true],
        vocabulary: [true, true],
        organisation: [true, true, true]
      },
      wordReplacements: detectedReplacements.slice(0, 4)
    };
  }

  // Academic Essay
  return {
    improvedTitle: `A Critical Analysis of ${cleanTitle}`,
    exemplarParagraphs: [
      `In contemporary discourse, the subject of ${cleanTitle.toLowerCase()} has emerged as a cornerstone of socio-cultural analysis, warranting rigorous empirical investigation.`,
      `Primarily, the evidence underscores that systemic changes directly influence communication paradigms, thereby transforming how individuals interact within complex societal frameworks.`,
      `Furthermore, closer examination reveals that while technological integration accelerates global connectivity, it concurrently diminishes authentic interpersonal resonance.`,
      `Ultimately, a nuanced synthesis demonstrates that achieving equilibrium between modern innovation and human connection remains an imperative challenge.`
    ],
    annotations: [
      { paraIndex: 0, targetText: "rigorous empirical investigation", label: "Sophisticated thesis framing", color: "green" },
      { paraIndex: 1, targetText: "communication paradigms", label: "PEEL Point & Evidence", color: "blue" },
      { paraIndex: 2, targetText: "interpersonal resonance", label: "Critical analytical vocabulary", color: "purple" },
      { paraIndex: 3, targetText: "achieving equilibrium", label: "Synthesis conclusion", color: "green" }
    ],
    diagnosticChecks: {
      ideasContent: [true, true, true],
      sentenceStructure: [true, true, true],
      vocabulary: [true, true],
      organisation: [true, true, true]
    },
    wordReplacements: detectedReplacements.slice(0, 4)
  };
};

