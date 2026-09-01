// Complete 54-Topic English Grammar & Writing Infographics Progressive Dataset
// Organized across 7 Progressive Levels for Kids & Students

export const ENGLISH_INFOGRAPHIC_DOMAINS = [
  {
    id: 'foundations',
    levelNumber: 1,
    title: 'Grammar Foundations',
    subtitle: 'Building blocks of every word & part of speech',
    icon: '🧱',
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-200',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
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
    borderColor: 'border-emerald-200',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    badge: 'Level 2: Builder',
    count: 10
  },
  {
    id: 'clauses-phrases',
    levelNumber: 3,
    title: 'Clauses & Phrases',
    subtitle: 'Mastering independent, dependent, relative & participial structures',
    icon: '🧩',
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-200',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
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
    borderColor: 'border-rose-200',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-700',
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
    borderColor: 'border-purple-200',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
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
    borderColor: 'border-cyan-200',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    badge: 'Level 6: Specialist',
    count: 7
  },
  {
    id: 'writing-improvement',
    levelNumber: 7,
    title: 'Writing Improvement & Polish',
    subtitle: 'Show Don’t Tell, sentence variety, transitions & CUPS editing',
    icon: '🚀',
    color: 'from-orange-500 to-red-600',
    borderColor: 'border-orange-200',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
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
    subtitle: 'Meet the 8 citizen workers of English Town, each performing a unique job!',
    badge: 'Core Foundation',
    color: 'blue',
    keyFormula: 'Sentence = 8 Citizens Working in Harmony',
    coreRule: 'Every word in a sentence has a specific job. If you know the job, you know the part of speech.',
    quickTip: 'Ask: “What job is this word doing in this exact sentence?” A word like "run" can be a verb ("I run") or a noun ("a morning run")!',
    quiz: {
      question: 'In the sentence "She carefully packed her bright yellow backpack", what part of speech is "carefully"?',
      options: ['Adjective', 'Adverb', 'Preposition', 'Conjunction'],
      correctIndex: 1,
      explanation: '"Carefully" describes HOW she packed (verb), answering the question "How?", which makes it an adverb!'
    }
  },

  {
    id: '1-2-how-to-identify-parts-of-speech',
    domainId: 'foundations',
    levelNumber: 1,
    topicNumber: '1.2',
    title: 'Word Job Detective Lab',
    subtitle: 'Don’t judge a word by its appearance—test the job it performs inside the sentence!',
    badge: 'Secret Detective Tests',
    color: 'blue',
    imageSrc: '/infographics/english/word_job_detective_lab.jpg',
    keyFormula: 'Clues + Substitution Test = 100% Identification',
    coreRule: 'Don’t guess! Use the 4 substitution tests: The Noun Test ("the/a"), Can-I Verb Test, Adverb Question Test, and Adjective Target Test.',
    quickTip: 'Always check the word’s neighbor! Adjectives describe nouns; adverbs modify verbs, adjectives, or other adverbs.',
    quiz: {
      question: 'Using the substitution test, identify the role of "whisper" in: "She heard a soft whisper."',
      options: ['Verb', 'Noun', 'Adverb', 'Pronoun'],
      correctIndex: 1,
      explanation: 'Because it has "a soft" before it ("a [whisper]"), it names a thing in this sentence, making it a Noun!'
    }
  },

  {
    id: '1-3-noun-detective',
    domainId: 'foundations',
    levelNumber: 1,
    topicNumber: '1.3',
    title: 'Noun Detective Headquarters',
    subtitle: 'Find what is being named—then collect every clue across Common, Proper, Concrete, Abstract & Collective!',
    badge: '5 Noun Categories',
    color: 'blue',
    imageSrc: '/infographics/english/noun_detective_headquarters.jpg',
    keyFormula: 'Noun = Person | Place | Thing | Idea | Group',
    coreRule: 'Proper nouns always demand a Capital Letter. Abstract nouns name feelings and concepts you cannot touch.',
    quickTip: 'Abstract Noun Trick: Can you pack it into a suitcase? If no, it’s an Abstract Noun (you can’t pack "kindness" in a box)!',
    quiz: {
      question: 'Which of the following is an ABSTRACT noun?',
      options: ['Sandwich', 'Melbourne', 'Curiosity', 'Flock'],
      correctIndex: 2,
      explanation: '"Curiosity" is an idea/quality you feel or experience, not a physical object you can hold!'
    }
  },

  {
    id: '1-4-pronoun-power',
    domainId: 'foundations',
    levelNumber: 1,
    topicNumber: '1.4',
    title: 'Pronoun Power Control Centre',
    subtitle: 'Replace repeated nouns—but keep every reference crystal clear!',
    badge: 'Word Savers',
    color: 'purple',
    imageSrc: '/infographics/english/pronoun_power_control_centre.jpg',
    keyFormula: 'Pronoun = Stands in place of the Antecedent Noun',
    coreRule: 'Always ensure your pronoun matches the noun it replaces in number and gender, avoiding ambiguity traps.',
    quickTip: 'Never use apostrophe with possessive pronouns: it’s "hers", "yours", "ours", "its" (not her’s or your’s)!',
    quiz: {
      question: 'In "The wizard built a fortress for himself", what type of pronoun is "himself"?',
      options: ['Relative', 'Reflexive', 'Demonstrative', 'Possessive'],
      correctIndex: 1,
      explanation: '"Himself" bounces the action back to the subject (the wizard), making it a Reflexive pronoun!'
    }
  },

  {
    id: '1-5-action-linking-helping-verbs',
    domainId: 'foundations',
    levelNumber: 1,
    topicNumber: '1.5',
    title: 'Action, Linking & Helping Verbs',
    subtitle: 'Visual tests for distinguishing the 3 verb engines of English',
    badge: '3 Verb Engines',
    color: 'emerald',
    keyFormula: 'Verb = Action (Run) | Linking (=) | Helping (Supporting Main Verb)',
    coreRule: 'Linking verbs act like an equals sign (=). Helping verbs team up with a main verb to show tense or mood.',
    quickTip: 'The Equals Sign Test: "She looks tired." $\\rightarrow$ She = tired (Linking!). "She looks at the map." $\\rightarrow$ Action!',
    quiz: {
      question: 'In the sentence "The dragon was sleeping peacefully", what is the role of "was"?',
      options: ['Action Verb', 'Helping Verb', 'Linking Verb', 'Adverb'],
      correctIndex: 1,
      explanation: '"Was" helps the main verb "sleeping" form the past continuous tense, making it a Helping Verb!'
    }
  },

  {
    id: '1-6-adjective-or-adverb',
    domainId: 'foundations',
    levelNumber: 1,
    topicNumber: '1.6',
    title: 'Adjective or Adverb?',
    subtitle: 'Is the word describing a noun, verb, adjective or another adverb?',
    badge: 'Target Questions',
    color: 'amber',
    imageSrc: '/infographics/english/adjective_or_adverb.jpg',
    keyFormula: 'Adjective $\\rightarrow$ Modifies Nouns | Adverb $\\rightarrow$ Modifies Verbs, Adjectives & Adverbs',
    coreRule: 'Find the target word: If describing a noun/pronoun $\\rightarrow$ Adjective. If modifying a verb/adjective/adverb $\\rightarrow$ Adverb.',
    quickTip: 'Good vs Well: "Good" is an Adjective ("He is a good singer"). "Well" is an Adverb describing the action ("He sings well").',
    quiz: {
      question: 'In "The remarkably tall giraffe reached the top branches", what is "remarkably"?',
      options: ['Adjective', 'Adverb', 'Noun', 'Preposition'],
      correctIndex: 1,
      explanation: '"Remarkably" modifies the adjective "tall" (telling to what extent it is tall), which makes it an Adverb!'
    }
  },

  {
    id: '1-7-preposition-position-map',
    domainId: 'foundations',
    levelNumber: 1,
    topicNumber: '1.7',
    title: 'Preposition Position Map',
    subtitle: 'Above, below, across, through, beside, between & beyond in one illustrated scene',
    badge: 'Spatial Visualizer',
    color: 'teal',
    keyFormula: 'Preposition + Object of Preposition = Prepositional Phrase',
    coreRule: 'Prepositions show spatial relations, temporal positions, and directional motion.',
    quickTip: 'The Plane & Cloud trick: Anything a plane can do to a cloud (fly *into*, *over*, *under*, *through*, *beside*, *around*) is a preposition!',
    quiz: {
      question: 'Identify the prepositional phrase in: "The curious fox leaped across the icy stream."',
      options: ['The curious fox', 'leaped across', 'across the icy stream', 'the icy stream'],
      correctIndex: 2,
      explanation: '"across the icy stream" begins with the preposition "across" and includes its noun object "stream"!'
    }
  },

  {
    id: '1-8-conjunction-junction',
    domainId: 'foundations',
    levelNumber: 1,
    topicNumber: '1.8',
    title: 'Conjunction Junction',
    subtitle: 'Coordinating (FANBOYS), Subordinating & Correlative conjunctions',
    badge: 'The 3 Super Glues',
    color: 'indigo',
    keyFormula: 'Coordinating (Equal) | Subordinating (Cause/Time) | Correlative (Pairs)',
    coreRule: 'FANBOYS connect equal grammatical elements; Subordinating conjunctions create dependent clauses.',
    quickTip: 'If a subordinating conjunction starts the sentence, put a comma after the clause! ("When the bell rang, we packed up.")',
    quiz: {
      question: 'Which of the following is a SUBORDINATING conjunction?',
      options: ['And', 'Although', 'But', 'So'],
      correctIndex: 1,
      explanation: '"Although" creates a dependent clause (e.g., "Although it was freezing, he wore no coat").'
    }
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
    subtitle: 'Subject + Predicate + Complete Thought: The holy trinity of every sentence',
    badge: '3 Pillars',
    color: 'emerald',
    keyFormula: 'Complete Sentence = Subject (Who/What) + Predicate (Action/State) + Complete Thought',
    coreRule: 'A sentence without a subject is incomplete; without a verb is broken; without a complete thought is a fragment.',
    quickTip: 'Test: Ask "Does this sentence leave me hanging with \'So what happened next?\'" If yes, it’s not complete!',
    quiz: {
      question: 'Which of the following is a fully COMPLETE sentence?',
      options: [
        'Running through the misty forest at midnight.',
        'Because the treasure map was torn.',
        'The brave detective solved the ancient riddle.',
        'After the sun had set behind the mountains.'
      ],
      correctIndex: 2,
      explanation: 'Option 3 has a subject ("The brave detective"), a predicate ("solved the ancient riddle"), and a complete thought standing alone.'
    }
  },

  {
    id: '2-2-sentence-fragment-repair-shop',
    domainId: 'sentence-construction',
    levelNumber: 2,
    topicNumber: '2.2',
    title: 'Sentence Fragment Repair Shop',
    subtitle: 'Identify & repair missing subjects, missing verbs, and unfinished thoughts',
    badge: 'Repair Tools',
    color: 'emerald',
    keyFormula: 'Fragment + Missing Element = 100% Repaired Sentence',
    coreRule: 'Find the broken piece: Missing Subject, Missing Verb, or Hanging Dependent Clause.',
    quickTip: 'Never let words like "Because", "Although", or "Since" sit in a sentence all alone without a second half!',
    quiz: {
      question: 'How would you best repair: "Gazing up at the shooting stars."?',
      options: [
        'Gazing up at the shooting stars in the dark.',
        'We sat quietly, gazing up at the shooting stars.',
        'Because gazing up at the shooting stars.',
        'Gazing up at the bright shooting stars tonight.'
      ],
      correctIndex: 1,
      explanation: 'Adding "We sat quietly" provides the missing subject ("We") and main verb ("sat") to complete the thought.'
    }
  },

  {
    id: '2-3-run-on-sentence-rescue',
    domainId: 'sentence-construction',
    levelNumber: 2,
    topicNumber: '2.3',
    title: 'Run-on Sentence Rescue',
    subtitle: '3 Lifesaving tools to separate colliding ideas: Full Stop, Conjunction, or Semicolon',
    badge: '3 Rescue Tools',
    color: 'emerald',
    keyFormula: 'Idea 1 [Collision] Idea 2 $\\rightarrow$ Separate with Period (.) | Comma + FANBOYS (, and) | Semicolon (;)',
    coreRule: 'Two complete sentences cannot be glued together with just a comma (Comma Splice) or nothing at all (Fused Sentence).',
    quickTip: 'A comma alone is NEVER strong enough to hold two complete sentences together (that is a comma splice crime)!',
    quiz: {
      question: 'Which of the following is a COMMA SPLICE error?',
      options: [
        'The sun rose, and the birds sang.',
        'The sun rose. The birds sang.',
        'The sun rose, the birds sang.',
        'The sun rose; the birds sang.'
      ],
      correctIndex: 2,
      explanation: '"The sun rose, the birds sang" joins two independent sentences with only a comma, creating a comma splice.'
    }
  },

  {
    id: '2-4-four-sentence-types',
    domainId: 'sentence-construction',
    levelNumber: 2,
    topicNumber: '2.4',
    title: 'Four Sentence Types',
    subtitle: 'Declarative (Statements), Interrogative (Questions), Imperative (Commands) & Exclamatory (Feelings)',
    badge: 'The 4 Voices',
    color: 'emerald',
    keyFormula: 'Declarative (.) | Interrogative (?) | Imperative (. or !) | Exclamatory (!)',
    coreRule: 'Match your sentence intention with the correct terminal punctuation mark.',
    quickTip: 'In imperative sentences ("Close the door!"), the subject is the invisible "You" — known as the Understood Subject!',
    quiz: {
      question: 'What type of sentence is "Hand me the golden key immediately."?',
      options: ['Declarative', 'Interrogative', 'Imperative', 'Exclamatory'],
      correctIndex: 2,
      explanation: 'It issues a direct command with an implied "(You)", making it an Imperative sentence.'
    }
  },

  {
    id: '2-5-simple-compound-complex-sentences',
    domainId: 'sentence-construction',
    levelNumber: 2,
    topicNumber: '2.5',
    title: 'Simple, Compound & Complex Sentences',
    subtitle: 'How clauses combine to create variety, rhythm and sophistication',
    badge: 'Clause Alchemy',
    color: 'teal',
    keyFormula: 'Simple (1 Ind) | Compound (1 Ind + 1 Ind) | Complex (1 Ind + 1 Dep)',
    coreRule: 'Varying between simple, compound, and complex sentences creates musical rhythm in writing.',
    quickTip: 'If the dependent clause comes FIRST in a complex sentence, add a comma! If it comes LAST, usually no comma is needed.',
    quiz: {
      question: 'What sentence type is: "Because she practiced every day, Maya won the chess tournament."?',
      options: ['Simple', 'Compound', 'Complex', 'Fragment'],
      correctIndex: 2,
      explanation: 'It has 1 dependent clause ("Because she practiced...") and 1 independent clause ("Maya won..."), making it Complex.'
    }
  },

  {
    id: '2-6-compound-complex-sentence-builder',
    domainId: 'sentence-construction',
    levelNumber: 2,
    topicNumber: '2.6',
    title: 'Compound-Complex Sentence Builder',
    subtitle: 'A visual assembly line for master-level sentence construction',
    badge: 'Master Builder',
    color: 'teal',
    keyFormula: '$\\ge 2$ Independent Clauses + $\\ge 1$ Dependent Clause',
    coreRule: 'Combine multiple independent clauses with at least one dependent clause for rich, nuanced narrative pacing.',
    quickTip: 'Count your verbs and connectors! 2 complete independent sentences + 1 dependent clause = Compound-Complex.',
    quiz: {
      question: 'Which of the following is a COMPOUND-COMPLEX sentence?',
      options: [
        'The rain fell and the wind blew.',
        'When the bell rang, the students stood up.',
        'Although it was late, Leo studied hard, and he aced the exam.',
        'The eagle soared majestically above the mountain peak.'
      ],
      correctIndex: 2,
      explanation: 'Option 3 has 1 dependent clause ("Although it was late") and 2 independent clauses ("Leo studied hard" and "he aced the exam").'
    }
  },

  {
    id: '2-7-subject-predicate-detective',
    domainId: 'sentence-construction',
    levelNumber: 2,
    topicNumber: '2.7',
    title: 'Subject & Predicate Detective',
    subtitle: 'Find who or what the sentence is about (Subject) and what happens (Predicate)',
    badge: 'Sentence Slicer',
    color: 'teal',
    keyFormula: 'Sentence = [ Complete Subject ] | [ Complete Predicate ]',
    coreRule: 'Draw a vertical line right before the main verb to cleanly divide Subject from Predicate.',
    quickTip: 'Simple vs Complete: Simple Subject is just the single noun ("clock"). Complete Subject includes all its adjectives and modifiers!',
    quiz: {
      question: 'In "The three young detectives searched the spooky attic", what is the SIMPLE SUBJECT?',
      options: ['The three young detectives', 'detectives', 'searched', 'spooky attic'],
      correctIndex: 1,
      explanation: '"detectives" is the core noun doing the action, making it the Simple Subject.'
    }
  },

  {
    id: '2-8-direct-and-indirect-objects',
    domainId: 'sentence-construction',
    levelNumber: 2,
    topicNumber: '2.8',
    title: 'Direct & Indirect Objects',
    subtitle: 'Ask “Verb + WHAT?” for Direct Object, and “Verb + TO/FOR WHOM?” for Indirect Object',
    badge: 'Target Receivers',
    color: 'teal',
    keyFormula: 'Subject + Verb + [Indirect Object] + [Direct Object]',
    coreRule: 'The Direct Object receives the action directly. The Indirect Object receives the Direct Object.',
    quickTip: 'If there is no Direct Object, there CANNOT be an Indirect Object! An Indirect Object always sits between the verb and Direct Object.',
    quiz: {
      question: 'In "Lucas baked his grandmother a delicious apple pie", what is the DIRECT OBJECT?',
      options: ['Lucas', 'baked', 'his grandmother', 'a delicious apple pie'],
      correctIndex: 3,
      explanation: 'Ask "Lucas baked WHAT?" $\\rightarrow$ "a delicious apple pie" (Direct Object). "His grandmother" is the Indirect Object.'
    }
  },

  {
    id: '2-9-sentence-expansion-ladder',
    domainId: 'sentence-construction',
    levelNumber: 2,
    topicNumber: '2.9',
    title: 'Sentence Expansion Ladder',
    subtitle: 'Grow “The dog ran” into a vivid, descriptive masterpiece step by step',
    badge: '5-Rung Ladder',
    color: 'teal',
    keyFormula: 'Base Kernel + WHERE + WHEN + HOW + WHY = Masterpiece Sentence',
    coreRule: 'Transform boring 3-word sentences into immersive imagery by answering the 5 expansion questions.',
    quickTip: 'Don’t just add adjectives — add prepositional phrases and reasons to make the scene truly come alive!',
    quiz: {
      question: 'Which expansion element explains WHY the action happened in Rung 5?',
      options: ['At sunrise', 'through the wildflower meadow', 'to chase a fluttering yellow butterfly', 'playfully'],
      correctIndex: 2,
      explanation: '"to chase a fluttering yellow butterfly" provides the intention/reason (Why) for the dog running.'
    }
  },

  {
    id: '2-10-sentence-combining-laboratory',
    domainId: 'sentence-construction',
    levelNumber: 2,
    topicNumber: '2.10',
    title: 'Sentence Combining Laboratory',
    subtitle: 'Turn choppy, repetitive sentences into fluent, professional writing',
    badge: 'Fluency Lab',
    color: 'teal',
    keyFormula: '3 Choppy Sentences $\\rightarrow$ 1 Elegant Fluent Sentence',
    coreRule: 'Eliminate repeated words using appositives, relative clauses, participial phrases, or conjunctions.',
    quickTip: 'Read your sentences aloud! If you sound like a robot taking quick gasps of breath, combine your sentences!',
    quiz: {
      question: 'Which is the most fluent combination of: "The storm was fierce. It destroyed the bridge. It lasted all night."?',
      options: [
        'The storm was fierce, and it destroyed the bridge, and it lasted all night.',
        'Lasting all night, the fierce storm destroyed the bridge.',
        'The storm was fierce and lasting all night it destroyed the bridge.',
        'It was a fierce storm. Destroying the bridge. Lasting all night.'
      ],
      correctIndex: 1,
      explanation: 'Option 2 eliminates repetition and uses a smooth introductory participial phrase.'
    }
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
    subtitle: 'The foolproof “Can It Stand Alone?” test',
    badge: 'Clause Tester',
    color: 'amber',
    keyFormula: 'Independent = Complete Thought | Dependent = Starts with Subordinator, Needs Support',
    coreRule: 'An independent clause is a complete adult sentence. A dependent clause is a child needing a hand to hold.',
    quickTip: 'Remove the subordinator ("When") and a dependent clause instantly becomes an independent sentence!',
    quiz: {
      question: 'Is "Because the golden dragon was sleeping in the cave" an Independent or Dependent clause?',
      options: ['Independent Clause', 'Dependent Clause', 'Prepositional Phrase', 'Complete Sentence'],
      correctIndex: 1,
      explanation: 'It starts with "Because", leaving the thought hanging, so it is a Dependent Clause.'
    }
  },

  {
    id: '3-2-phrase-or-clause',
    domainId: 'clauses-phrases',
    levelNumber: 3,
    topicNumber: '3.2',
    title: 'Phrase or Clause?',
    subtitle: 'Check whether the word group contains BOTH a subject and a verb',
    badge: 'Subject+Verb Detector',
    color: 'amber',
    keyFormula: 'Clause = Subject + Verb | Phrase = Group of words without Subject + Verb team',
    coreRule: 'If you see a subject AND a matching verb doing the action $\\rightarrow$ Clause. Otherwise $\\rightarrow$ Phrase.',
    quickTip: 'Phrases are chunks of description; clauses are units of action with an actor and verb!',
    quiz: {
      question: 'What is "under the old wooden bridge"?',
      options: ['Clause', 'Phrase', 'Sentence', 'Predicate'],
      correctIndex: 1,
      explanation: 'It has no subject or verb acting together; it is a prepositional Phrase.'
    }
  },

  {
    id: '3-3-noun-adjective-and-adverb-clauses',
    domainId: 'clauses-phrases',
    levelNumber: 3,
    topicNumber: '3.3',
    title: 'Noun, Adjective & Adverb Clauses',
    subtitle: 'Identify the exact job each subordinate clause performs inside a sentence',
    badge: 'Clause Jobs',
    color: 'amber',
    keyFormula: 'Noun Clause (Acts as Noun) | Adjective Clause (Modifies Noun) | Adverb Clause (Modifies Verb)',
    coreRule: 'Identify what part of speech the entire clause behaves as.',
    quickTip: 'The "IT" Test: If you can replace the whole clause with the word "it", it’s a Noun Clause ("I know *what happened* $\\rightarrow$ I know *it*").',
    quiz: {
      question: 'In "The castle that was built on the cliff survived the siege", what kind of clause is "that was built on the cliff"?',
      options: ['Noun Clause', 'Adjective Clause', 'Adverb Clause', 'Prepositional Phrase'],
      correctIndex: 1,
      explanation: 'It describes the noun "castle" (telling which castle), making it an Adjective (Relative) Clause.'
    }
  },

  {
    id: '3-4-relative-clauses',
    domainId: 'clauses-phrases',
    levelNumber: 3,
    topicNumber: '3.4',
    title: 'Relative Clauses',
    subtitle: 'Who, Whom, Whose, Which & That: Connecting clauses to nouns seamlessly',
    badge: 'Relative Pronouns',
    color: 'amber',
    keyFormula: 'Noun + Relative Pronoun (Who/Whom/Whose/Which/That) + Clause',
    coreRule: 'Use "who/whom" for people; "which" for extra non-essential details with commas; "that" for essential items.',
    quickTip: 'Which vs That: "Which" is like a bonus gift wrapped in commas (non-essential). "That" is locked down with no commas (essential).',
    quiz: {
      question: 'Which relative pronoun best fills the blank: "The detective _____ solved the mystery received a medal."?',
      options: ['which', 'who', 'whom', 'whose'],
      correctIndex: 1,
      explanation: '"The detective" is a person performing the action (subject), so "who" is correct.'
    }
  },

  {
    id: '3-5-prepositional-phrases',
    domainId: 'clauses-phrases',
    levelNumber: 3,
    topicNumber: '3.5',
    title: 'Prepositional Phrases',
    subtitle: 'Find the preposition, its object, and the rich descriptive information added',
    badge: 'Descriptor Chunks',
    color: 'amber',
    keyFormula: 'Preposition + [Modifiers] + Object of Preposition (Noun/Pronoun)',
    coreRule: 'Prepositional phrases act as either Adjectives (modifying nouns) or Adverbs (modifying verbs).',
    quickTip: 'The subject of a sentence will NEVER be trapped inside a prepositional phrase! Cross out prep phrases to find the real subject.',
    quiz: {
      question: 'In "The basket of ripe red apples fell onto the wooden floor", what is the subject?',
      options: ['basket', 'apples', 'floor', 'ripe red apples'],
      correctIndex: 0,
      explanation: '"of ripe red apples" is a prepositional phrase. The real subject doing the falling is "basket"!'
    }
  },

  {
    id: '3-6-participial-gerund-infinitive-phrases',
    domainId: 'clauses-phrases',
    levelNumber: 3,
    topicNumber: '3.6',
    title: 'Participial, Gerund & Infinitive Phrases',
    subtitle: 'The same verb root disguised in 3 different powerhouse roles (Verbals)',
    badge: 'The 3 Verbals',
    color: 'amber',
    keyFormula: 'Participle (Verb $\\rightarrow$ Adjective) | Gerund (Verb $\\rightarrow$ Noun) | Infinitive (To + Verb)',
    coreRule: 'Verbals look like verbs but act as Adjectives, Nouns, or Adverbs.',
    quickTip: 'Gerund vs Participle test: Replace the -ing phrase with "SOMETHING". If it makes sense, it’s a Gerund Noun!',
    quiz: {
      question: 'In "Reading fantasy novels expands your imagination", what is "Reading fantasy novels"?',
      options: ['Participial Phrase', 'Gerund Phrase', 'Infinitive Phrase', 'Prepositional Phrase'],
      correctIndex: 1,
      explanation: '"Reading fantasy novels" acts as the Subject noun of the sentence ("Something expands your imagination"), making it a Gerund Phrase.'
    }
  },

  // ==========================================
  // 4. VERB MASTERY & TENSES (7 Topics)
  // ==========================================
  {
    id: '4-1-complete-english-tense-timeline',
    domainId: 'verb-mastery',
    levelNumber: 4,
    topicNumber: '4.1',
    title: 'The Complete English Tense Timeline',
    subtitle: 'All 12 English Tenses across Past, Present & Future in one chronological map',
    badge: '12 Tenses Timeline',
    color: 'rose',
    keyFormula: '3 Time Zones (Past/Present/Future) $\\times$ 4 Aspects (Simple/Continuous/Perfect/Perfect Continuous) = 12 Tenses',
    coreRule: 'Aspects tell you whether an action is a fact (Simple), in progress (Continuous), completed (Perfect), or ongoing (Perf Cont).',
    quickTip: 'Perfect = "have/has/had + V3". Continuous = "be + verb-ing". Combine them for Perfect Continuous ("have been verb-ing")!',
    quiz: {
      question: 'What tense is "By next year, she will have graduated from university."?',
      options: ['Future Simple', 'Future Continuous', 'Future Perfect', 'Past Perfect'],
      correctIndex: 2,
      explanation: '"will have graduated" is the Future Perfect tense, showing an action completed prior to a future milestone.'
    }
  },

  {
    id: '4-2-choosing-the-correct-tense',
    domainId: 'verb-mastery',
    levelNumber: 4,
    topicNumber: '4.2',
    title: 'Choosing the Correct Tense',
    subtitle: 'Time clues & trigger words: yesterday, right now, already, since & tomorrow',
    badge: 'Time Clue Signals',
    color: 'rose',
    keyFormula: 'Time Signal Keyword $\\rightarrow$ Locks in Exact Verb Tense',
    coreRule: 'Let time clue words guide your tense choice and prevent jarring tense shifts.',
    quickTip: 'Tense Consistency Rule: Do not jump between past and present in a story unless there is a time travel transition!',
    quiz: {
      question: 'Which sentence correctly matches its time clue?',
      options: [
        'Yesterday I am going to the library.',
        'Since Monday, he has practiced piano every day.',
        'Tomorrow we went to the zoo.',
        'Right now they studied in the quiet room.'
      ],
      correctIndex: 1,
      explanation: '"Since Monday" triggers the Present Perfect ("has practiced") because the action started in the past and continues to the present.'
    }
  },

  {
    id: '4-3-irregular-verb-transformation-map',
    domainId: 'verb-mastery',
    levelNumber: 4,
    topicNumber: '4.3',
    title: 'Irregular Verb Transformation Map',
    subtitle: 'V1 (Base), V2 (Past Simple) & V3 (Past Participle) patterns decoded',
    badge: 'Transformation Patterns',
    color: 'rose',
    keyFormula: 'Base (V1) $\\rightarrow$ Past Simple (V2) $\\rightarrow$ Past Participle (V3 with has/had)',
    coreRule: 'Regular verbs add -ed (play-played-played). Irregular verbs follow vowel change and consonant shift patterns.',
    quickTip: 'Never say "I have went" or "He has took"! Always use V3 after have/has/had: "I have gone", "He has taken".',
    quiz: {
      question: 'What is the correct form: "The lake had completely ________ overnight."?',
      options: ['freeze', 'froze', 'frozen', 'freezed'],
      correctIndex: 2,
      explanation: 'After "had", you must use the V3 past participle form: "frozen".'
    }
  },

  {
    id: '4-4-subject-verb-agreement-detective',
    domainId: 'verb-mastery',
    levelNumber: 4,
    topicNumber: '4.4',
    title: 'Subject–Verb Agreement Detective',
    subtitle: 'Ignore interrupting prepositional phrases and locate the true subject noun',
    badge: 'Agreement Detective',
    color: 'rose',
    keyFormula: 'Singular Subject $\\rightarrow$ Verb with -s | Plural Subject $\\rightarrow$ Verb without -s',
    coreRule: 'Cross out the "interrupters" (prepositional phrases, appositives) between the subject and verb to avoid agreement traps.',
    quickTip: 'Singular verbs in the present tense end in -s (He run**s**, She write**s**, It glow**s**)! Plural verbs do not.',
    quiz: {
      question: 'Which verb correctly completes: "The leader of the brave warriors _____ ahead."?',
      options: ['sprint', 'sprints', 'sprinting', 'are sprinting'],
      correctIndex: 1,
      explanation: 'The real subject is "The leader" (singular). Ignore "of the brave warriors". Singular subject takes "sprints".'
    }
  },

  {
    id: '4-5-active-vs-passive-voice',
    domainId: 'verb-mastery',
    levelNumber: 4,
    topicNumber: '4.5',
    title: 'Active vs Passive Voice',
    subtitle: 'Identify who performs the action and when passive voice is strategically useful',
    badge: 'Voice Switcher',
    color: 'rose',
    keyFormula: 'Active: DOER $\\rightarrow$ Action $\\rightarrow$ Receiver | Passive: Receiver $\\leftarrow$ Action $\\leftarrow$ (By DOER)',
    coreRule: 'Active voice is dynamic, punchy, and direct. Passive voice is useful when the doer is unknown or unimportant.',
    quickTip: 'The Zombie Test: If you can add "by zombies" after the verb, the sentence is PASSIVE! ("The gold was stolen [by zombies] ✓")',
    quiz: {
      question: 'Which of the following is in the ACTIVE voice?',
      options: [
        'The mystery was solved by Sherlock.',
        'Sherlock solved the ancient mystery.',
        'The ancient mystery was solved in London.',
        'A medal was awarded to Sherlock.'
      ],
      correctIndex: 1,
      explanation: '"Sherlock solved the ancient mystery" places the doer (Sherlock) right before the action verb (solved).'
    }
  },

  {
    id: '4-6-modal-verbs-degrees-of-certainty',
    domainId: 'verb-mastery',
    levelNumber: 4,
    topicNumber: '4.6',
    title: 'Modal Verbs & Degrees of Certainty',
    subtitle: 'Can, could, may, might, must, should, will & would on the Probability Ladder',
    badge: 'Certainty Ladder',
    color: 'rose',
    keyFormula: 'Modal Verb + Base Verb = Degree of Possibility / Obligation / Permission',
    coreRule: 'Modal verbs nuance your meaning from a faint possibility (10%) to an absolute certainty (100%).',
    quickTip: 'Modal verbs NEVER take an -s ending ("He musts" is incorrect!) and are always followed by the bare base verb.',
    quiz: {
      question: 'Which modal verb expresses the HIGHEST degree of obligation/certainty?',
      options: ['might', 'could', 'must', 'may'],
      correctIndex: 2,
      explanation: '"Must" expresses necessary obligation or near 100% deduction.'
    }
  },

  {
    id: '4-7-infinitive-or-gerund',
    domainId: 'verb-mastery',
    levelNumber: 4,
    topicNumber: '4.7',
    title: 'Infinitive or Gerund?',
    subtitle: 'When to use “to swim” vs “swimming” following specific master verbs',
    badge: 'Verb Partner Rules',
    color: 'rose',
    keyFormula: 'Verb + Gerund (-ing) OR Verb + Infinitive (to + verb) OR Both with Meaning Shift',
    coreRule: 'Some verbs only pair with Gerunds (enjoy, avoid), some with Infinitives (hope, decide), and some change meaning.',
    quickTip: 'After prepositions, ALWAYS use a Gerund! ("He is good *at drawing*", "Thank you *for helping*").',
    quiz: {
      question: 'Which sentence is grammatically correct?',
      options: [
        'She avoided to make mistakes.',
        'She avoided making mistakes.',
        'She decided making mistakes.',
        'She promised making mistakes.'
      ],
      correctIndex: 1,
      explanation: '"Avoid" is a verb that must pair with a Gerund: "avoided making".'
    }
  },

  // ==========================================
  // 5. PUNCTUATION & CAPITALISATION (7 Topics)
  // ==========================================
  {
    id: '5-1-punctuation-detectives-master-poster',
    domainId: 'punctuation-capitalisation',
    levelNumber: 5,
    topicNumber: '5.1',
    title: 'Punctuation Detectives Master Poster',
    subtitle: 'The ultimate visual guide to all 14 punctuation marks in English',
    badge: 'Master Poster',
    color: 'purple',
    keyFormula: 'Punctuation = Road Signs for the Reader’s Mind',
    coreRule: 'Punctuation tells the reader when to stop, pause, breathe, question, or feel excitement.',
    quickTip: 'Without punctuation, sentences become chaos! “Let’s eat grandma!” vs “Let’s eat, grandma!”',
    quiz: {
      question: 'Which punctuation mark creates a "drumroll" to introduce a list or explanation?',
      options: ['Semicolon (;)', 'Colon (:)', 'Comma (,)', 'Hyphen (-)'],
      correctIndex: 1,
      explanation: 'The Colon (:) introduces lists, explanations, or quotes with dramatic anticipation.'
    }
  },

  {
    id: '5-2-comma-decision-tree',
    domainId: 'punctuation-capitalisation',
    levelNumber: 5,
    topicNumber: '5.2',
    title: 'Comma Decision Tree',
    subtitle: 'Lists, introductory elements, direct address, compound sentences & extra information',
    badge: '5 Comma Rules',
    color: 'purple',
    keyFormula: 'Use a comma ONLY when one of the 5 Master Comma Rules applies',
    coreRule: 'Don’t sprinkle commas randomly! Follow the 5 comma branches.',
    quickTip: 'The Breath Myth: Never place a comma just because you "feel like taking a breath". Place it only when a rule demands it!',
    quiz: {
      question: 'Which sentence correctly uses commas for an introductory clause?',
      options: [
        'Before we began our journey, we checked the map.',
        'Before we began, our journey we checked the map.',
        'Before we began our journey we checked, the map.',
        'Before, we began our journey we checked the map.'
      ],
      correctIndex: 0,
      explanation: 'The comma belongs immediately after the entire introductory dependent clause ("Before we began our journey,").'
    }
  },

  {
    id: '5-3-apostrophe-detective',
    domainId: 'punctuation-capitalisation',
    levelNumber: 5,
    topicNumber: '5.3',
    title: 'Apostrophe Detective',
    subtitle: 'Contractions vs Singular Possession vs Plural Possession & Common Traps',
    badge: 'Apostrophe Shield',
    color: 'purple',
    keyFormula: 'Contraction (Missing Letters) | Singular Possessive (’s) | Plural Possessive (s’)',
    coreRule: 'An apostrophe NEVER makes a word plural! It only shows possession or contracted missing letters.',
    quickTip: 'Irregular Plural Possession: If the plural doesn’t end in -s (children, men, women, mice), add ’s! ("children’s toys").',
    quiz: {
      question: 'How do you write that a clubhouse belongs to multiple boys?',
      options: ['The boy’s clubhouse', 'The boys clubhouse', 'The boys’ clubhouse', 'The boyes clubhouse'],
      correctIndex: 2,
      explanation: 'Multiple boys = "boys". Because it ends in -s, add the apostrophe outside: "boys’".'
    }
  },

  {
    id: '5-4-direct-speech-formula',
    domainId: 'punctuation-capitalisation',
    levelNumber: 5,
    topicNumber: '5.4',
    title: 'Direct Speech Formula',
    subtitle: 'Quotation marks, commas, capital letters & dialogue tags step by step',
    badge: '4-Step Formula',
    color: 'purple',
    keyFormula: 'Opening Quote (“) + Capital Letter + Speech + Comma/Punctuation INSIDE + Closing Quote (”) + Tag',
    coreRule: 'Punctuation marks (commas, periods, question marks, exclamation marks) go INSIDE the quotation marks.',
    quickTip: 'New Speaker = New Line! Every time a different character speaks in a story, jump to a fresh paragraph line.',
    quiz: {
      question: 'Which direct speech sentence is punctuated 100% correctly?',
      options: [
        '“We need to leave immediately”, shouted Leo.',
        '“We need to leave immediately,” shouted Leo.',
        '“we need to leave immediately,” shouted Leo.',
        '“We need to leave immediately.” shouted Leo.'
      ],
      correctIndex: 1,
      explanation: 'The comma is placed INSIDE the closing quotation mark, the quote starts with a capital letter, and the tag begins with lowercase.'
    }
  },

  {
    id: '5-5-colon-semicolon-or-dash',
    domainId: 'punctuation-capitalisation',
    levelNumber: 5,
    topicNumber: '5.5',
    title: 'Colon, Semicolon or Dash?',
    subtitle: 'Compare exactly when each power punctuation mark works best',
    badge: 'Power Punctuation Trio',
    color: 'purple',
    keyFormula: 'Colon (Announcement) | Semicolon (Balance) | Em Dash (Drama & Emphasis)',
    coreRule: 'Never mix them up: Colons introduce, semicolons balance equal thoughts, em dashes create dramatic punch.',
    quickTip: 'Before a colon, the clause MUST be a complete standalone sentence! (Don’t write "My favorites are: apples, oranges" ❌).',
    quiz: {
      question: 'Which punctuation mark best fills the blank: "The thunder rumbled violently __ the dog hid under the bed."?',
      options: ['colon (:)', 'semicolon (;)', 'comma (,)', 'hyphen (-)'],
      correctIndex: 1,
      explanation: 'A semicolon (;) connects the two independent, closely related clauses smoothly without needing "and".'
    }
  },

  {
    id: '5-6-capital-letter-checklist',
    domainId: 'punctuation-capitalisation',
    levelNumber: 5,
    topicNumber: '5.6',
    title: 'Capital Letter Checklist',
    subtitle: 'The MINTS acronym & essential capitalisation rules',
    badge: 'MINTS Protocol',
    color: 'purple',
    keyFormula: 'M (Months/Days) + I (The Pronoun "I") + N (Names) + T (Titles) + S (Start of Sentences)',
    coreRule: 'Use the MINTS checklist to catch every missing capital letter.',
    quickTip: 'Seasons (spring, summer, autumn, winter) are NOT capitalized unless they are part of a proper name (like "Winter Olympics")!',
    quiz: {
      question: 'Which word in this sentence requires a CAPITAL letter: "Last friday, captain smith sailed across the atlantic ocean."?',
      options: ['friday, captain smith, atlantic ocean', 'ocean only', 'friday only', 'captain only'],
      correctIndex: 0,
      explanation: 'Days of the week (Friday), names/titles (Captain Smith), and specific geographic bodies (Atlantic Ocean) must all be capitalized.'
    }
  },

  {
    id: '5-7-dialogue-punctuation-masterclass',
    domainId: 'punctuation-capitalisation',
    levelNumber: 5,
    topicNumber: '5.7',
    title: 'Dialogue Punctuation Masterclass',
    subtitle: 'Speech before, speech after, and speech interrupted by dialogue tags',
    badge: 'Dialogue Master',
    color: 'purple',
    keyFormula: 'Speech First | Tag First | Interrupted Speech (Split Dialogue)',
    coreRule: 'When dialogue is split mid-sentence, lower-case the second half! If it is two sentences, use a period after the tag.',
    quickTip: 'If the tag splits ONE continuous sentence, use a comma after the tag and lowercase the second quote!',
    quiz: {
      question: 'Which interrupted dialogue sentence is punctuated correctly?',
      options: [
        '“Although it is raining,” said Mia, “We should go for a walk.”',
        '“Although it is raining,” said Mia, “we should go for a walk.”',
        '“Although it is raining” said Mia “we should go for a walk.”',
        '“Although it is raining,” said Mia. “we should go for a walk.”'
      ],
      correctIndex: 1,
      explanation: 'Because "Although it is raining... we should go for a walk" is one single sentence, "we" stays lowercase.'
    }
  },

  // ==========================================
  // 6. COMMONLY CONFUSED GRAMMAR (7 Topics)
  // ==========================================
  {
    id: '6-1-your-youre-their-there-theyre',
    domainId: 'commonly-confused',
    levelNumber: 6,
    topicNumber: '6.1',
    title: 'Your vs You’re & Their vs There vs They’re',
    subtitle: 'Use expansion and replacement tricks to never mix them up again',
    badge: 'Expansion Tricks',
    color: 'cyan',
    keyFormula: 'You’re = You are | They’re = They are | There = Place (here/there) | Their = Belongs to them',
    coreRule: 'Expand the contraction! If "you are" or "they are" makes sense, use the apostrophe version.',
    quickTip: 'T-HERE has "HERE" inside it! Both "here" and "there" indicate location.',
    quiz: {
      question: 'Choose the correct pair: "_____ going to bring _____ backpacks over _____."',
      options: [
        'They’re / their / there',
        'Their / there / they’re',
        'There / their / they’re',
        'They’re / there / their'
      ],
      correctIndex: 0,
      explanation: 'They’re (They are) going to bring their (possession) backpacks over there (location).'
    }
  },

  {
    id: '6-2-its-vs-its-whose-vs-whos',
    domainId: 'commonly-confused',
    levelNumber: 6,
    topicNumber: '6.2',
    title: 'Its vs It’s & Whose vs Who’s',
    subtitle: 'The "Expand the Contraction" test for possessive vs contracted pronouns',
    badge: 'Apostrophe Trap',
    color: 'cyan',
    keyFormula: 'It’s = It is / It has | Its = Possessive (belonging to it) | Who’s = Who is | Whose = Possessive',
    coreRule: 'Possessive pronouns NEVER have apostrophes (his, hers, its, whose, ours, yours, theirs).',
    quickTip: 'Say "it is" in your head. If "The cat licked it is paw" sounds ridiculous, use ITS without the apostrophe!',
    quiz: {
      question: 'Which sentence correctly uses "its" and "it\'s"?',
      options: [
        'The bird built it’s nest because its getting cold.',
        'The bird built its nest because it’s getting cold.',
        'The bird built its nest because its getting cold.',
        'The bird built it’s nest because it’s getting cold.'
      ],
      correctIndex: 1,
      explanation: '"its nest" (possessive) and "it’s [it is] getting cold" (contraction).'
    }
  },

  {
    id: '6-3-to-too-and-two',
    domainId: 'commonly-confused',
    levelNumber: 6,
    topicNumber: '6.3',
    title: 'To, Too and Two',
    subtitle: 'Direction/Infinitive (To), Excess/Also (Too), and Number (Two)',
    badge: 'Triple Homophone',
    color: 'cyan',
    keyFormula: 'To (Direction / Action) | Too (Also / Excessively - extra "o") | Two (Number 2)',
    coreRule: 'TOO has an EXTRA "o" because it means extra/excessive or also!',
    quickTip: 'Too has too many "o"s! Use it when you mean "too hot", "too fast", or "me too".',
    quiz: {
      question: 'Fill in the blanks: "He was _____ tired _____ run the final _____ miles."',
      options: [
        'too / to / two',
        'to / too / two',
        'two / to / too',
        'too / two / to'
      ],
      correctIndex: 0,
      explanation: '"too tired" (excess), "to run" (infinitive), "two miles" (number 2).'
    }
  },

  {
    id: '6-4-then-vs-than-affect-vs-effect',
    domainId: 'commonly-confused',
    levelNumber: 6,
    topicNumber: '6.4',
    title: 'Then vs Than & Affect vs Effect',
    subtitle: 'Meaning-based visual comparisons for the most commonly mixed-up pairs',
    badge: 'Twin Pairs',
    color: 'cyan',
    keyFormula: 'Then (Time) vs Than (Comparison) | Affect (Action Verb) vs Effect (Noun Result)',
    coreRule: 'THEN connects with whEN (Time). RAVEN acronym for Affect/Effect.',
    quickTip: 'RAVEN acronym: Remember Affect is a Verb, Effect is a Noun!',
    quiz: {
      question: 'Which words correctly complete: "The medicine had an immediate _____ and made him feel stronger _____ before."?',
      options: [
        'affect / then',
        'effect / than',
        'effect / then',
        'affect / than'
      ],
      correctIndex: 1,
      explanation: '"an immediate effect" (Noun result) and "stronger than before" (Comparison).'
    }
  },

  {
    id: '6-5-who-vs-whom',
    domainId: 'commonly-confused',
    levelNumber: 6,
    topicNumber: '6.5',
    title: 'Who vs Whom',
    subtitle: 'The foolproof “He / Him” replacement trick',
    badge: 'He/Him Secret Trick',
    color: 'cyan',
    keyFormula: 'If the answer is HE $\\rightarrow$ WHO | If the answer is HIM $\\rightarrow$ WHOM (m matches m!)',
    coreRule: 'Who is the subject doing the action. Whom is the object receiving the action (notice: whoM = hiM).',
    quickTip: 'Look at the "M": hiM ends with M, theM ends with M $\\rightarrow$ use whoM!',
    quiz: {
      question: 'Which word completes: "_____ should we choose as our team captain?"',
      options: ['Who', 'Whom', 'Whose', 'Who’s'],
      correctIndex: 1,
      explanation: 'Substitute: "We should choose HIM as captain" $\\rightarrow$ "Him" ends in M, so use "Whom"!'
    }
  },

  {
    id: '6-6-fewer-vs-less-much-vs-many',
    domainId: 'commonly-confused',
    levelNumber: 6,
    topicNumber: '6.6',
    title: 'Fewer vs Less & Much vs Many',
    subtitle: 'Countable items (Fewer / Many) vs Uncountable quantities (Less / Much)',
    badge: 'Countability Scale',
    color: 'cyan',
    keyFormula: 'Can you count individual items? $\\rightarrow$ FEWER & MANY | Is it a bulk mass/liquid? $\\rightarrow$ LESS & MUCH',
    coreRule: 'If a noun can be pluralized with -s (apples, coins, hours), use FEWER/MANY. If it cannot (water, time, money), use LESS/MUCH.',
    quickTip: 'Supermarket checkout error: "10 items or less" ❌ is wrong! It should be "10 items or fewer" ✓ because you can count items!',
    quiz: {
      question: 'Which sentence correctly uses "fewer" or "less"?',
      options: [
        'I have less coins in my pocket today.',
        'Drink less glasses of water.',
        'This recipe requires fewer salt.',
        'There are fewer cars on the road today.'
      ],
      correctIndex: 3,
      explanation: 'Cars are countable (1 car, 2 cars), so "fewer cars" is grammatically correct.'
    }
  },

  {
    id: '6-7-lie-vs-lay-sit-vs-set-rise-vs-raise',
    domainId: 'commonly-confused',
    levelNumber: 6,
    topicNumber: '6.7',
    title: 'Lie vs Lay, Sit vs Set, Rise vs Raise',
    subtitle: 'Does the action need an object? (Transitive vs Intransitive verbs)',
    badge: 'Transitive Tester',
    color: 'cyan',
    keyFormula: 'No Object (You do it yourself): Lie, Sit, Rise | Needs an Object (You do it to something): Lay, Set, Raise',
    coreRule: 'Transitive verbs transfer action to an object (Lay the book, Set the table, Raise your hand). Intransitive verbs do not.',
    quickTip: 'Past tense trap: The past tense of "lie" (recline) is "lay"! ("Yesterday I lay in bed all morning").',
    quiz: {
      question: 'Which word correctly completes: "Please _____ your pencil on the desk and _____ down."?',
      options: [
        'lie / sit',
        'lay / sit',
        'lay / set',
        'lie / set'
      ],
      correctIndex: 1,
      explanation: '"lay your pencil" (takes object: pencil) and "sit down" (no object).'
    }
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
    subtitle: 'Upgrade limp verbs, vague nouns, and bland rhythm into gripping prose',
    badge: 'Power Upgrade',
    color: 'orange',
    keyFormula: 'Weak Sentence + Strong Action Verb + Specific Noun + Sensory Texture = Dynamic Writing',
    coreRule: 'Replace "was/went/got" with vivid action verbs. Ditch weak adverbs ("ran very fast" $\\rightarrow$ "sprinted").',
    quickTip: 'Don’t use a weak verb + "very" (very tired $\\rightarrow$ exhausted, very hungry $\\rightarrow$ famished)!',
    quiz: {
      question: 'Which sentence has the strongest, most vivid verbs and specific nouns?',
      options: [
        'The dog made a loud sound and went over the fence.',
        'The German shepherd leaped the wooden fence and barked furiously.',
        'The dog was jumping really high over the tall fence.',
        'A very big animal went quickly past the yard.'
      ],
      correctIndex: 1,
      explanation: 'Option 2 replaces vague words with concrete nouns ("German shepherd", "wooden fence") and vivid verbs ("leaped").'
    }
  },

  {
    id: '7-2-show-dont-tell',
    domainId: 'writing-improvement',
    levelNumber: 7,
    topicNumber: '7.2',
    title: 'Show, Don’t Tell',
    subtitle: 'Transform bland emotions into physical actions, dialogue, thoughts & sensory details',
    badge: 'Sensory Alchemy',
    color: 'orange',
    keyFormula: 'Tell (Label the emotion) $\\rightarrow$ Show (Physical sensations + Body language + Actions)',
    coreRule: 'Never just tell the reader "He was scared." Show the trembling hands, shallow breath, and pounding heartbeat.',
    quickTip: 'Use the 5 Senses test: What does the character SEE, HEAR, FEEL on their skin, SMELL, or TASTE?',
    quiz: {
      question: 'Which sentence best "SHOWS" that a character is exhausted?',
      options: [
        'Marcus was really tired after the game.',
        'Marcus felt very sleepy and wanted to go to bed.',
        'Dragging his muddy cleats, Marcus slumped onto the bench, his eyelids drooping under heavy sweat.',
        'Marcus was more exhausted than he had ever been.'
      ],
      correctIndex: 2,
      explanation: 'Option 3 uses concrete physical actions and body language (dragging cleats, slumping, drooping eyelids) to show exhaustion.'
    }
  },

  {
    id: '7-3-vary-your-sentence-openers',
    domainId: 'writing-improvement',
    levelNumber: 7,
    topicNumber: '7.3',
    title: 'Vary Your Sentence Openers',
    subtitle: 'The 6 dynamic sentence starter styles (Time, Place, -ing Verb, -ed Verb, Adverb, Conjunction)',
    badge: '6 Opener Styles',
    color: 'orange',
    keyFormula: 'Avoid starting every sentence with "The" or "I". Use the 6 Varied Openers.',
    coreRule: 'Starting every sentence with Subject-Verb makes writing repetitive. Kick off with fronted adverbials!',
    quickTip: 'Check the first word of every sentence in your draft! If 4 sentences in a row start with "He" or "The", change two of them.',
    quiz: {
      question: 'What type of sentence opener is used in: "Breathlessly, the couriers delivered the royal scroll."?',
      options: ['-ED Verb', '-LY Adverb', 'Prepositional', 'Direct Dialogue'],
      correctIndex: 1,
      explanation: '"Breathlessly" is a fronted -LY adverb modifying the entire sentence action.'
    }
  },

  {
    id: '7-4-transition-words-by-purpose',
    domainId: 'writing-improvement',
    levelNumber: 7,
    topicNumber: '7.4',
    title: 'Transition Words by Purpose',
    subtitle: 'Addition, Contrast, Cause & Effect, Sequence, Example, and Conclusion signposts',
    badge: 'Signpost Words',
    color: 'orange',
    keyFormula: 'Transition Word = Bridge between Paragraphs & Ideas',
    coreRule: 'Select transition words that match the exact logical relationship between your sentences.',
    quickTip: 'Place a comma after an introductory transition word at the start of a sentence ("Furthermore, the evidence was clear.").',
    quiz: {
      question: 'Which transition word best shows a CAUSE & EFFECT relationship?',
      options: ['Meanwhile', 'Consequently', 'In addition', 'For instance'],
      correctIndex: 1,
      explanation: '"Consequently" introduces an outcome directly caused by the previous event.'
    }
  },

  {
    id: '7-5-formal-vs-informal-language',
    domainId: 'writing-improvement',
    levelNumber: 7,
    topicNumber: '7.5',
    title: 'Formal vs Informal Language',
    subtitle: 'Tune your vocabulary and syntax to match your audience and purpose',
    badge: 'Tone Switcher',
    color: 'orange',
    keyFormula: 'Formal (Essays, Reports, Speeches) vs Informal (Chat, Personal Stories, Diaries)',
    coreRule: 'Formal writing avoids slang, contractions, clichés, and conversational fillers.',
    quickTip: 'In academic essays, avoid using "I think" or "In my opinion" — state your argument directly with authority!',
    quiz: {
      question: 'Which sentence is written in a formal academic tone?',
      options: [
        'The scientists got a bunch of cool data from the test.',
        'The researchers gathered substantial data from the laboratory trial.',
        'The scientists did stuff that was really awesome.',
        'They couldn’t believe how good the results were!'
      ],
      correctIndex: 1,
      explanation: 'Option 2 uses precise vocabulary ("researchers", "substantial data", "laboratory trial") with no slang or contractions.'
    }
  },

  {
    id: '7-6-editing-detective-checklist-cups',
    domainId: 'writing-improvement',
    levelNumber: 7,
    topicNumber: '7.6',
    title: 'Editing Detective Checklist (CUPS)',
    subtitle: 'The 4-stage CUPS protocol: Capitalisation, Usage, Punctuation, Spelling',
    badge: 'CUPS Protocol',
    color: 'orange',
    keyFormula: 'C (Capitalisation) + U (Usage & Agreement) + P (Punctuation) + S (Spelling) = Error-Free Writing',
    coreRule: 'Edit in passes! Don’t try to fix everything at once. Use the CUPS checklist systematically.',
    quickTip: 'Read your draft backwards sentence by sentence! This tricks your brain into seeing spelling and punctuation errors.',
    quiz: {
      question: 'In the CUPS editing checklist, what does the letter "U" stand for?',
      options: ['Underlining', 'Usage (Grammar & Agreement)', 'Uppercase', 'Uniqueness'],
      correctIndex: 1,
      explanation: '"U" stands for Usage, ensuring verbs agree with subjects and words are used correctly.'
    }
  },

  {
    id: '7-7-proofreading-in-five-passes',
    domainId: 'writing-improvement',
    levelNumber: 7,
    topicNumber: '7.7',
    title: 'Proofreading in Five Passes',
    subtitle: 'Pass 1: Meaning $\\rightarrow$ Pass 2: Sentences $\\rightarrow$ Pass 3: Verbs $\\rightarrow$ Pass 4: Punctuation $\\rightarrow$ Pass 5: Spelling',
    badge: '5-Pass Funnel',
    color: 'orange',
    keyFormula: 'Big Picture (Meaning & Flow) $\\rightarrow$ Medium (Sentences & Verbs) $\\rightarrow$ Detail (Punctuation & Spelling)',
    coreRule: 'Professional writers never proofread in a single pass. Funnel from big ideas down to tiny commas.',
    quickTip: 'Always read your writing out loud at least once during Pass 1. Your ears will catch rhythm problems your eyes skip over!',
    quiz: {
      question: 'Which element should you focus on FIRST during Pass 1 of proofreading?',
      options: ['Comma placement', 'Overall meaning and logical flow', 'Spelling of difficult words', 'Capital letters'],
      correctIndex: 1,
      explanation: 'Pass 1 always focuses on the big picture: meaning, logic, and clarity of ideas.'
    }
  },

  {
    id: '7-8-avoiding-repetition',
    domainId: 'writing-improvement',
    levelNumber: 7,
    topicNumber: '7.8',
    title: 'Avoiding Repetition',
    subtitle: 'Pronouns, vivid synonyms, sentence combining & reference words',
    badge: 'Echo Eliminator',
    color: 'orange',
    keyFormula: 'Repetitive Echo Words $\\rightarrow$ Pronouns + Precise Synonyms + Structural Rephrasing',
    coreRule: 'Eliminate "echo words" (repeating the same word 3 times in a paragraph) to keep prose fresh and engaging.',
    quickTip: 'Use a highlighter tool on your paper! Highlight any word that appears more than twice in the same paragraph.',
    quiz: {
      question: 'How can you best improve: "The dog barked. The dog ran. The dog found a bone."?',
      options: [
        'The dog barked and the dog ran and the dog found a bone.',
        'Barking excitedly, the golden retriever dashed across the lawn and unearthed a bone.',
        'The dog barked. He ran. He found a bone.',
        'It was a dog that barked and ran and found a bone.'
      ],
      correctIndex: 1,
      explanation: 'Option 2 eliminates repetition, varies the sentence opener, and uses vivid verbs and nouns.'
    }
  },

  {
    id: '7-9-parallel-structure',
    domainId: 'writing-improvement',
    levelNumber: 7,
    topicNumber: '7.9',
    title: 'Parallel Structure',
    subtitle: 'Keep items in lists, series, and comparisons in grammatically matching form',
    badge: 'Grammar Balance',
    color: 'orange',
    keyFormula: 'Item 1 [Verb-ing] + Item 2 [Verb-ing] + Item 3 [Verb-ing] (All Match!)',
    coreRule: 'When listing actions or attributes, all items must share the same grammatical form (all gerunds, all infinitives, or all adjectives).',
    quickTip: 'Check list items after "and" or "or"! Make sure each item begins with the exact same verb form or word class.',
    quiz: {
      question: 'Which sentence has PERFECT parallel structure?',
      options: [
        'Maya loves baking cookies, painting portraits, and to read books.',
        'Maya loves baking cookies, painting portraits, and reading books.',
        'Maya loves to bake cookies, painting portraits, and reading books.',
        'Maya loves baking cookies, painted portraits, and reads books.'
      ],
      correctIndex: 1,
      explanation: 'All three list items match with consistent gerund phrases: "baking...", "painting...", "reading...".'
    }
  }
];

// Helper functions for topic lookup & filtering
export function getInfographicsByDomain(domainId) {
  return ENGLISH_INFOGRAPHICS.filter(item => item.domainId === domainId);
}

export function getInfographicById(id) {
  return ENGLISH_INFOGRAPHICS.find(item => item.id === id);
}

export function getInfographicsByLevel(levelNumber) {
  return ENGLISH_INFOGRAPHICS.filter(item => item.levelNumber === levelNumber);
}
