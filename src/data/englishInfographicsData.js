// Complete 54-Topic English Infographics Tree Curriculum
// Organized into 7 Progressive Learning Branches

export const ENGLISH_INFOGRAPHIC_DOMAINS = [
  {
    id: 'foundations',
    levelNumber: 1,
    title: 'Grammar Foundations',
    subtitle: 'Building blocks of every word & part of speech',
    icon: '🧱',
    color: 'from-blue-500 to-indigo-600',
    accentColor: '#3b82f6',
    badge: 'Level 1: Novice',
    count: 8
  },
  {
    id: 'sentence-construction',
    levelNumber: 2,
    title: 'Sentence Construction',
    subtitle: 'From simple fragments to powerful compound-complex sentences',
    icon: '🏗️',
    color: 'from-emerald-500 to-teal-600',
    accentColor: '#10b981',
    badge: 'Level 2: Builder',
    count: 10
  },
  {
    id: 'clauses-phrases',
    levelNumber: 3,
    title: 'Clauses & Phrases',
    subtitle: 'Independent, dependent, relative & participial structures',
    icon: '🧩',
    color: 'from-amber-500 to-orange-600',
    accentColor: '#f59e0b',
    badge: 'Level 3: Architect',
    count: 6
  },
  {
    id: 'verb-mastery',
    levelNumber: 4,
    title: 'Verb Mastery & Tenses',
    subtitle: 'The 12 tenses timeline, irregular verbs, agreement & modals',
    icon: '⏱️',
    color: 'from-rose-500 to-pink-600',
    accentColor: '#f43f5e',
    badge: 'Level 4: Master',
    count: 7
  },
  {
    id: 'punctuation-capitalisation',
    levelNumber: 5,
    title: 'Punctuation & Capitalisation',
    subtitle: 'Comma decision trees, apostrophes, dialogue & power punctuation',
    icon: '✒️',
    color: 'from-purple-500 to-violet-600',
    accentColor: '#8b5cf6',
    badge: 'Level 5: Detective',
    count: 7
  },
  {
    id: 'commonly-confused',
    levelNumber: 6,
    title: 'Commonly Confused Grammar',
    subtitle: 'Your/You’re, Their/There/They’re, Lie/Lay and tricky pairs',
    icon: '🔀',
    color: 'from-cyan-500 to-blue-600',
    accentColor: '#06b6d4',
    badge: 'Level 6: Specialist',
    count: 7
  },
  {
    id: 'writing-improvement',
    levelNumber: 7,
    title: 'Writing Improvement & Polish',
    subtitle: 'Show Don’t Tell, sentence variety, transitions & editing',
    icon: '🚀',
    color: 'from-orange-500 to-red-600',
    accentColor: '#f97316',
    badge: 'Level 7: Author',
    count: 9
  }
];

export const ENGLISH_INFOGRAPHICS = [
  // ==========================================
  // 1. GRAMMAR FOUNDATIONS (8 Topics)
  // ==========================================
  {
    id: '1-1-parts-of-speech-town',
    domainId: 'foundations',
    levelNumber: 1,
    topicNumber: '1.1',
    title: 'Parts of Speech Town',
    subtitle: 'Nouns, pronouns, verbs, adjectives, adverbs, prepositions, conjunctions & interjections',
    imageSrc: null
  },
  {
    id: '1-2-how-to-identify-parts-of-speech',
    domainId: 'foundations',
    levelNumber: 1,
    topicNumber: '1.2',
    title: 'Word Job Detective Lab',
    subtitle: 'How to identify parts of speech with hidden clues & substitution tests',
    imageSrc: '/infographics/english/word_job_detective_lab.jpg'
  },
  {
    id: '1-3-noun-detective',
    domainId: 'foundations',
    levelNumber: 1,
    topicNumber: '1.3',
    title: 'Noun Detective Headquarters',
    subtitle: 'Common, proper, concrete, abstract and collective nouns',
    imageSrc: '/infographics/english/noun_detective_headquarters.jpg'
  },
  {
    id: '1-4-pronoun-power',
    domainId: 'foundations',
    levelNumber: 1,
    topicNumber: '1.4',
    title: 'Pronoun Power Control Centre',
    subtitle: 'Personal, possessive, reflexive, relative and demonstrative pronouns',
    imageSrc: '/infographics/english/pronoun_power_control_centre.jpg'
  },
  {
    id: '1-5-action-linking-helping-verbs',
    domainId: 'foundations',
    levelNumber: 1,
    topicNumber: '1.5',
    title: 'Action, Linking & Helping Verbs',
    subtitle: 'Visual tests for distinguishing the three verb types',
    imageSrc: null
  },
  {
    id: '1-6-adjective-or-adverb',
    domainId: 'foundations',
    levelNumber: 1,
    topicNumber: '1.6',
    title: 'Adjective or Adverb?',
    subtitle: 'Ask: “What kind?”, “Which one?”, “How?”, “When?” or “Where?”',
    imageSrc: '/infographics/english/adjective_or_adverb.jpg'
  },
  {
    id: '1-7-preposition-position-map',
    domainId: 'foundations',
    levelNumber: 1,
    topicNumber: '1.7',
    title: 'Preposition Position Map',
    subtitle: 'Above, below, across, through, beside, between and beyond in one scene',
    imageSrc: '/infographics/english/preposition_position_map.jpg'
  },
  {
    id: '1-8-conjunction-junction',
    domainId: 'foundations',
    levelNumber: 1,
    topicNumber: '1.8',
    title: 'Conjunction Junction',
    subtitle: 'Coordinating, subordinating and correlative conjunctions',
    imageSrc: '/infographics/english/conjunction_junction.jpg'
  },

  // ==========================================
  // 2. SENTENCE CONSTRUCTION (10 Topics)
  // ==========================================
  {
    id: '2-1-anatomy-of-a-complete-sentence',
    domainId: 'sentence-construction',
    levelNumber: 2,
    topicNumber: '2.1',
    title: 'Anatomy of a Complete Sentence',
    subtitle: 'Subject + predicate + complete thought',
    imageSrc: '/infographics/english/anatomy_of_a_complete_sentence.jpg'
  },
  {
    id: '2-2-sentence-fragment-repair-shop',
    domainId: 'sentence-construction',
    levelNumber: 2,
    topicNumber: '2.2',
    title: 'Sentence Fragment Repair Shop',
    subtitle: 'What essential sentence component is missing? Grammar Garage',
    imageSrc: '/infographics/english/sentence_fragment_repair_shop.jpg'
  },
  {
    id: '2-3-run-on-sentence-rescue',
    domainId: 'sentence-construction',
    levelNumber: 2,
    topicNumber: '2.3',
    title: 'Run-on Sentence Rescue',
    subtitle: 'Separate run-ons with full stops, conjunctions or semicolons',
    imageSrc: null
  },
  {
    id: '2-4-four-sentence-types',
    domainId: 'sentence-construction',
    levelNumber: 2,
    topicNumber: '2.4',
    title: 'The Four Sentence Types',
    subtitle: 'What is the sentence doing—stating, asking, commanding or expressing strong emotion?',
    imageSrc: '/infographics/english/the_four_sentence_types.jpg'
  },
  {
    id: '2-5-simple-compound-complex-sentences',
    domainId: 'sentence-construction',
    levelNumber: 2,
    topicNumber: '2.5',
    title: 'Simple, Compound & Complex Sentences',
    subtitle: 'How clauses combine for sentence variety',
    imageSrc: null
  },
  {
    id: '2-6-compound-complex-sentence-builder',
    domainId: 'sentence-construction',
    levelNumber: 2,
    topicNumber: '2.6',
    title: 'Compound-Complex Sentence Builder',
    subtitle: 'Can we locate two complete ideas and at least one dependent idea?',
    imageSrc: '/infographics/english/compound_complex_sentence_builder.jpg'
  },
  {
    id: '2-7-subject-predicate-detective',
    domainId: 'sentence-construction',
    levelNumber: 2,
    topicNumber: '2.7',
    title: 'Subject & Predicate Detective',
    subtitle: 'Find who or what the sentence is about and what happens',
    imageSrc: null
  },
  {
    id: '2-8-direct-and-indirect-objects',
    domainId: 'sentence-construction',
    levelNumber: 2,
    topicNumber: '2.8',
    title: 'Direct & Indirect Objects',
    subtitle: 'What receives the action, and who receives that thing?',
    imageSrc: '/infographics/english/direct_and_indirect_objects.jpg'
  },
  {
    id: '2-9-sentence-expansion-ladder',
    domainId: 'sentence-construction',
    levelNumber: 2,
    topicNumber: '2.9',
    title: 'Sentence Expansion Ladder',
    subtitle: 'What useful information can be added without making the sentence confusing?',
    imageSrc: '/infographics/english/sentence_expansion_ladder.jpg'
  },
  {
    id: '2-10-sentence-combining-laboratory',
    domainId: 'sentence-construction',
    levelNumber: 2,
    topicNumber: '2.10',
    title: 'Sentence Combining Laboratory',
    subtitle: 'Which repeated ideas can be combined to improve fluency?',
    imageSrc: '/infographics/english/sentence_combining_laboratory.jpg'
  },

  // ==========================================
  // 3. CLAUSES AND PHRASES (6 Topics)
  // ==========================================
  {
    id: '3-1-independent-vs-dependent-clauses',
    domainId: 'clauses-phrases',
    levelNumber: 3,
    topicNumber: '3.1',
    title: 'Independent vs Dependent Clauses',
    subtitle: 'The “Stand Alone” test for identifying clause independence',
    imageSrc: null
  },
  {
    id: '3-2-phrase-or-clause',
    domainId: 'clauses-phrases',
    levelNumber: 3,
    topicNumber: '3.2',
    title: 'Phrase or Clause?',
    subtitle: 'Check whether a subject and verb work together',
    imageSrc: null
  },
  {
    id: '3-3-noun-adjective-and-adverb-clauses',
    domainId: 'clauses-phrases',
    levelNumber: 3,
    topicNumber: '3.3',
    title: 'Noun, Adjective & Adverb Clauses',
    subtitle: 'Identify the role of each subordinate clause in a sentence',
    imageSrc: null
  },
  {
    id: '3-4-relative-clauses',
    domainId: 'clauses-phrases',
    levelNumber: 3,
    topicNumber: '3.4',
    title: 'Relative Clauses',
    subtitle: 'Who, whom, whose, which and that connecting clauses to nouns',
    imageSrc: null
  },
  {
    id: '3-5-prepositional-phrases',
    domainId: 'clauses-phrases',
    levelNumber: 3,
    topicNumber: '3.5',
    title: 'Prepositional Phrases',
    subtitle: 'Preposition, object and the information added to the sentence',
    imageSrc: null
  },
  {
    id: '3-6-participial-gerund-infinitive-phrases',
    domainId: 'clauses-phrases',
    levelNumber: 3,
    topicNumber: '3.6',
    title: 'Participial, Gerund & Infinitive Phrases',
    subtitle: 'One verb. Many forms. Different jobs! (Describing, Naming, or Beginning with "to")',
    imageSrc: '/infographics/english/participle_gerund_infinitive_phrases.jpg'
  },

  // ==========================================
  // 4. VERB MASTERY & TENSES (7 Topics)
  // ==========================================
  {
    id: '4-1-complete-english-tense-timeline',
    domainId: 'verb-mastery',
    levelNumber: 4,
    topicNumber: '4.1',
    title: 'Complete English Tense Timeline',
    subtitle: 'Past, present and future across simple, continuous, perfect and perfect continuous',
    imageSrc: null
  },
  {
    id: '4-2-choosing-the-correct-tense',
    domainId: 'verb-mastery',
    levelNumber: 4,
    topicNumber: '4.2',
    title: 'Choosing the Correct Tense',
    subtitle: 'Time words: yesterday, right now, already, since and tomorrow',
    imageSrc: null
  },
  {
    id: '4-3-irregular-verb-transformation-map',
    domainId: 'verb-mastery',
    levelNumber: 4,
    topicNumber: '4.3',
    title: 'Irregular Verb Transformation Map',
    subtitle: 'Base, past simple and past participle patterns',
    imageSrc: null
  },
  {
    id: '4-4-subject-verb-agreement-detective',
    domainId: 'verb-mastery',
    levelNumber: 4,
    topicNumber: '4.4',
    title: 'Subject–Verb Agreement Detective',
    subtitle: 'Identify singular vs plural subjects and avoid trap phrases',
    imageSrc: null
  },
  {
    id: '4-5-active-vs-passive-voice',
    domainId: 'verb-mastery',
    levelNumber: 4,
    topicNumber: '4.5',
    title: 'Active vs Passive Voice',
    subtitle: 'Who does the action and when passive voice is useful',
    imageSrc: null
  },
  {
    id: '4-6-modal-verbs-degrees-of-certainty',
    domainId: 'verb-mastery',
    levelNumber: 4,
    topicNumber: '4.6',
    title: 'Modal Verbs & Degrees of Certainty',
    subtitle: 'Can, could, may, might, must, should, will and would',
    imageSrc: null
  },
  {
    id: '4-7-infinitive-or-gerund',
    domainId: 'verb-mastery',
    levelNumber: 4,
    topicNumber: '4.7',
    title: 'Infinitive or Gerund?',
    subtitle: 'When to use “to swim” vs “swimming” after specific verbs',
    imageSrc: null
  },

  // ==========================================
  // 5. PUNCTUATION & CAPITALISATION (7 Topics)
  // ==========================================
  {
    id: '5-1-punctuation-detectives-master-poster',
    domainId: 'punctuation-capitalisation',
    levelNumber: 5,
    topicNumber: '5.1',
    title: 'Punctuation Job Centre',
    subtitle: 'What job must the punctuation perform at this point in the sentence?',
    imageSrc: '/infographics/english/punctuation_job_centre.jpg'
  },
  {
    id: '5-2-comma-decision-tree',
    domainId: 'punctuation-capitalisation',
    levelNumber: 5,
    topicNumber: '5.2',
    title: 'Comma Decision Tree',
    subtitle: 'Is the comma separating equal items, clauses, introductions or removable information?',
    imageSrc: '/infographics/english/comma_decision_tree.jpg'
  },
  {
    id: '5-3-apostrophe-detective',
    domainId: 'punctuation-capitalisation',
    levelNumber: 5,
    topicNumber: '5.3',
    title: 'Apostrophe Detective',
    subtitle: 'Contractions vs singular possession vs plural possession',
    imageSrc: '/infographics/english/apostrophe_detective.jpg'
  },
  {
    id: '5-4-direct-speech-formula',
    domainId: 'punctuation-capitalisation',
    levelNumber: 5,
    topicNumber: '5.4',
    title: 'Direct Speech Formula',
    subtitle: 'Speech marks, commas, capital letters and dialogue tags',
    imageSrc: '/infographics/english/direct_speech_formula.jpg'
  },
  {
    id: '5-5-colon-semicolon-or-dash',
    domainId: 'punctuation-capitalisation',
    levelNumber: 5,
    topicNumber: '5.5',
    title: 'Colon, Semicolon or Dash?',
    subtitle: 'Compare when each punctuation mark works best',
    imageSrc: null
  },
  {
    id: '5-6-capital-letter-checklist',
    domainId: 'punctuation-capitalisation',
    levelNumber: 5,
    topicNumber: '5.6',
    title: 'Capital Letter Checklist',
    subtitle: 'MINTS checklist and proper nouns requiring capitals',
    imageSrc: null
  },
  {
    id: '5-7-dialogue-punctuation-masterclass',
    domainId: 'punctuation-capitalisation',
    levelNumber: 5,
    topicNumber: '5.7',
    title: 'Dialogue Punctuation Masterclass',
    subtitle: 'Speech before, speech after and speech interrupted by tags',
    imageSrc: null
  },

  // ==========================================
  // 6. COMMONLY CONFUSED GRAMMAR (7 Topics)
  // ==========================================
  {
    id: '6-1-your-youre-their-there-theyre',
    domainId: 'commonly-confused',
    levelNumber: 6,
    topicNumber: '6.1',
    title: 'Your vs You’re | Their vs There vs They’re',
    subtitle: 'Different spellings. Different meanings. Use the tests!',
    imageSrc: '/infographics/english/your_youre_their_there_theyre.jpg'
  },
  {
    id: '6-2-its-vs-its-whose-vs-whos',
    domainId: 'commonly-confused',
    levelNumber: 6,
    topicNumber: '6.2',
    title: 'Its vs It’s | Whose vs Who’s',
    subtitle: 'Possessive or contraction? Meaning matters!',
    imageSrc: '/infographics/english/its_its_whose_whos.jpg'
  },
  {
    id: '6-3-to-too-and-two',
    domainId: 'commonly-confused',
    levelNumber: 6,
    topicNumber: '6.3',
    title: 'To, Too and Two',
    subtitle: 'Direction/action (to), excess/also (too) and number (two)',
    imageSrc: null
  },
  {
    id: '6-4-then-vs-than-affect-vs-effect',
    domainId: 'commonly-confused',
    levelNumber: 6,
    topicNumber: '6.4',
    title: 'Then vs Than | Affect vs Effect',
    subtitle: 'Time, comparison, influence or result comparisons',
    imageSrc: '/infographics/english/then_than_affect_effect.jpg'
  },
  {
    id: '6-5-who-vs-whom',
    domainId: 'commonly-confused',
    levelNumber: 6,
    topicNumber: '6.5',
    title: 'Who vs Whom',
    subtitle: 'Subject or Object? Use the HE/HIM Test!',
    imageSrc: '/infographics/english/who_vs_whom.jpg'
  },
  {
    id: '6-6-fewer-vs-less-much-vs-many',
    domainId: 'commonly-confused',
    levelNumber: 6,
    topicNumber: '6.6',
    title: 'Fewer vs Less & Much vs Many',
    subtitle: 'Countable vs Uncountable (Quantity / Amount)',
    imageSrc: '/infographics/english/fewer_vs_less_much_vs_many.jpg'
  },
  {
    id: '6-7-lie-vs-lay-sit-vs-set-rise-vs-raise',
    domainId: 'commonly-confused',
    levelNumber: 6,
    topicNumber: '6.7',
    title: 'Lie vs Lay | Sit vs Set | Rise vs Raise',
    subtitle: 'Is the subject doing the action itself, or performing the action on something?',
    imageSrc: '/infographics/english/lie_lay_sit_set_rise_raise.jpg'
  },

  // ==========================================
  // 7. WRITING IMPROVEMENT & POLISH (9 Topics)
  // ==========================================
  {
    id: '7-1-weak-to-powerful-sentence',
    domainId: 'writing-improvement',
    levelNumber: 7,
    topicNumber: '7.1',
    title: 'Weak Sentence to Powerful Sentence',
    subtitle: 'Upgrading weak verbs, vague nouns and repetitive phrasing',
    imageSrc: null
  },
  {
    id: '7-2-show-dont-tell',
    domainId: 'writing-improvement',
    levelNumber: 7,
    topicNumber: '7.2',
    title: 'Show, Don’t Tell',
    subtitle: 'Sensory details, physical actions and thoughts in place of labels',
    imageSrc: null
  },
  {
    id: '7-3-vary-your-sentence-openers',
    domainId: 'writing-improvement',
    levelNumber: 7,
    topicNumber: '7.3',
    title: 'Vary Your Sentence Openers',
    subtitle: 'Time, place, -ing, -ed, -ly and conjunction starters',
    imageSrc: null
  },
  {
    id: '7-4-transition-words-by-purpose',
    domainId: 'writing-improvement',
    levelNumber: 7,
    topicNumber: '7.4',
    title: 'Transition Words by Purpose',
    subtitle: 'Addition, contrast, cause, sequence, example and conclusion words',
    imageSrc: null
  },
  {
    id: '7-5-formal-vs-informal-language',
    domainId: 'writing-improvement',
    levelNumber: 7,
    topicNumber: '7.5',
    title: 'Formal vs Informal Language',
    subtitle: 'Word choice and structure for different audiences',
    imageSrc: null
  },
  {
    id: '7-6-editing-detective-checklist-cups',
    domainId: 'writing-improvement',
    levelNumber: 7,
    topicNumber: '7.6',
    title: 'Editing Detective Checklist (CUPS)',
    subtitle: 'Capitalisation, Usage, Punctuation and Spelling protocol',
    imageSrc: null
  },
  {
    id: '7-7-proofreading-in-five-passes',
    domainId: 'writing-improvement',
    levelNumber: 7,
    topicNumber: '7.7',
    title: 'Proofreading in Five Passes',
    subtitle: 'Meaning $\\rightarrow$ sentences $\\rightarrow$ verbs $\\rightarrow$ punctuation $\\rightarrow$ spelling',
    imageSrc: null
  },
  {
    id: '7-8-avoiding-repetition',
    domainId: 'writing-improvement',
    levelNumber: 7,
    topicNumber: '7.8',
    title: 'Avoiding Repetition',
    subtitle: 'Synonyms, pronouns and rephrasing techniques',
    imageSrc: null
  },
  {
    id: '7-9-parallel-structure',
    domainId: 'writing-improvement',
    levelNumber: 7,
    topicNumber: '7.9',
    title: 'Parallel Structure',
    subtitle: 'Keep items in lists and series matching grammatically',
    imageSrc: null
  }
];
