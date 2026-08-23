export const EXAM_REGIONS = [
  {
    id: 'australia',
    label: 'Australia & New Zealand',
    flag: '🇦🇺',
    description: 'NSW Selective, Victorian ACER, ICAS, NAPLAN & AMC papers aligned to ACARA standards.',
    gradient: 'from-emerald-600 to-teal-700',
    lightBg: 'bg-emerald-50',
    border: 'border-emerald-300',
    textColor: 'text-emerald-700',
  },
  {
    id: 'india',
    label: 'India',
    flag: '🇮🇳',
    description: 'SOF Olympiads (IMO, NSO, IEO), NTSE, and JEE Main aligned to NCERT & CBSE curriculum.',
    gradient: 'from-orange-500 to-amber-600',
    lightBg: 'bg-orange-50',
    border: 'border-orange-300',
    textColor: 'text-orange-700',
  },
  {
    id: 'singapore',
    label: 'Singapore',
    flag: '🇸🇬',
    description: 'PSLE Mathematics, English, and Science papers aligned to Singapore MOE syllabus.',
    gradient: 'from-red-600 to-rose-700',
    lightBg: 'bg-red-50',
    border: 'border-red-300',
    textColor: 'text-red-700',
  },
  {
    id: 'uk',
    label: 'United Kingdom',
    flag: '🇬🇧',
    description: 'UK 11+, 13+ Common Entrance, GCSE Mathematics and English aligned to AQA/Edexcel/CEM.',
    gradient: 'from-blue-700 to-indigo-700',
    lightBg: 'bg-blue-50',
    border: 'border-blue-300',
    textColor: 'text-blue-700',
  },
  {
    id: 'usa_canada',
    label: 'USA & Canada',
    flag: '🇺🇸',
    description: 'Digital SAT, ACT, GMAT Focus Edition (Quant, Verbal, Data Insights), AMC 8 & CEMC Gauss.',
    gradient: 'from-blue-600 to-red-600',
    lightBg: 'bg-blue-50',
    border: 'border-blue-300',
    textColor: 'text-blue-700',
  },
  {
    id: 'asia_intl',
    label: 'Asia & International',
    flag: '🌏',
    description: 'ICAS (UNSW Global), SEAMO, SASMO, and AMO — spanning 50+ countries worldwide.',
    gradient: 'from-purple-600 to-violet-700',
    lightBg: 'bg-purple-50',
    border: 'border-purple-300',
    textColor: 'text-purple-700',
  },
];

const currentExamYear = new Date().getFullYear();
const startExamYear = currentExamYear - 6;
const activeExamYearWindow = `${startExamYear}–${currentExamYear}`;

export const INTERNATIONAL_EXAMS = [
  // ─────────────────────────────────────────────────────────────────────────────
  // AUSTRALIA & NEW ZEALAND
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'nsw_selective_thinking',
    name: 'NSW Selective: Thinking Skills',
    country: '🇦🇺 Australia',
    region: 'australia',
    category: 'NSW Selective Schools',
    gradeRange: 'Grade 5 – Grade 6',
    subject: 'critical_thinking',
    defaultQuestions: 40,
    defaultTime: 40,
    promptInstruction: `You are an official test author for the NSW Selective High School Placement Test (delivered via the Janison digital assessment platform). Generate an authentic, computer-based 'Thinking Skills' examination paper for Year 7 entry, modelled on official ${activeExamYearWindow} released papers and current ${currentExamYear} syllabus specifications.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• Target Cohort: Top 5% academically gifted Year 5/6 students.
• Questions MUST match high-order cognitive complexity: multi-layered logic traps, contrapositive/converse logic, unstated assumption analysis, and non-trivial spatial deductions. DO NOT generate trivial or basic questions.
• Reference ${activeExamYearWindow} Selective Thinking Skills released samples: questions feature 40–80 word vignettes, embedded diagrams, and 4-option choices requiring elimination of plausible distractors.

OFFICIAL SYLLABUS & DOMAIN BREAKDOWN (40 Questions / 40 Minutes):
1. LOGICAL REASONING (30%): Deductive and inductive reasoning, identifying valid vs. invalid argument structures. Knights & Knaves (truth-tellers vs. liars) scenarios, seating arrangements, and multi-variable logic elimination. Conditional logic: Testing converse fallacies (If P then Q != If Q then P), contrapositives, and inverses.
2. IDENTIFYING FLAWS & ASSUMPTIONS (25%): Short 40–70 word debate scenarios containing classical logical fallacies (Correlation vs. Causation, Straw Man, Ad Hominem, Over-generalization, Slippery Slope). Identifying implicit unstated assumptions necessary for an argument's conclusion to hold true.
3. EVALUATING EVIDENCE & ARGUMENTS (25%): Passages presenting a central claim with 4 candidate supporting or weakening statements. Assessing which statement MOST strengthens or MOST weakens the argument. Perspective & Point of View Analysis.
4. SPATIAL & DATA-BASED LOGIC PUZZLES (20%): 3-Set Venn diagram overlap calculations, pattern rule extensions, decision tree networks, and truth-table state analysis.

FORMATTING & DISTRACTOR RULES:
• Every question MUST present a realistic 30–70 word scenario or logic puzzle.
• Provide exactly 4 options (A, B, C, D).
• Distractor traps MUST incorporate common reasoning fallacies.
• Provide a step-by-step logical proof in the solution explanation for each question.`,
  },
  {
    id: 'nsw_selective_math',
    name: 'NSW Selective: Mathematical Reasoning',
    country: '🇦🇺 Australia',
    region: 'australia',
    category: 'NSW Selective Schools',
    gradeRange: 'Grade 5 – Grade 6',
    subject: 'maths',
    defaultQuestions: 35,
    defaultTime: 40,
    promptInstruction: `You are an official test developer for the NSW Selective High School Placement Test (Mathematical Reasoning section). Generate an authentic Mathematical Reasoning examination paper for Year 7 entry, modelled strictly on the 2022–2024 released NSW Selective Mathematical Reasoning practice papers published by the NSW Department of Education.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• Non-calculator high-order problem solving (NSW Selective Benchmark for Top 5% students).
• Questions must require strategic shortcuts, consecutive number sum logic, speed-distance-time catch-up rates, and composite area heuristics rather than rote calculation.
• VISUAL DIAGRAM MANDATE: AT LEAST 40% (4 out of every 10) of questions MUST be visual diagram-based questions containing valid, high-quality inline "svgCode" (such as geometry shapes, angle diagrams, fraction bars, coordinate grids, or tables).
• Mirror the style of NSW Dept of Education 2024 practice paper: worded problems with Australian contexts (suburb names, cricket scores, Australian animals).

OFFICIAL SYLLABUS & DOMAIN BREAKDOWN (35 Questions / 40 Minutes — NO CALCULATORS PERMITTED):
1. NUMBER & ALGEBRA (40%): Multi-step non-routine word problems, numerical sequences, and pattern rules. Operations with fractions, decimals, percentages, ratios, and proportion heuristics (e.g. before-and-after ratio transfers). Consecutive integer sums, Gauss summation methods, divisibility rules (2, 3, 5, 9, 10, 11), LCM/GCD word problems. Speed, Distance, Time & Rate Problems and In/Out Algebraic Function Machines.
2. MEASUREMENT & GEOMETRY (35%): Perimeter and area of compound L-shaped figures, shaded regions of inscribed circles, squares, and right triangles. Angle geometry involving parallel line transversals, interior/exterior polygon sums, and spatial 3D block net visualisations.
3. STATISTICS & PROBABILITY (25%): Data-based word problems, multi-bar graphs, pie charts, mean/median/range calculations, and probability combinations.

FORMATTING & DISTRACTOR RULES:
• Calculators are STRICTLY PROHIBITED.
• Provide 4 options (A, B, C, D). Distractors must target common student errors.
• Include clear step-by-step mathematical working in the solution explanation.`,
  },
  {
    id: 'nsw_selective_reading',
    name: 'NSW Selective: Reading',
    country: '🇦🇺 Australia',
    region: 'australia',
    category: 'NSW Selective Schools',
    gradeRange: 'Grade 5 – Grade 6',
    subject: 'english',
    defaultQuestions: 30,
    defaultTime: 40,
    promptInstruction: `You are a test developer for the NSW Selective High School Placement Test (Reading section), modelled on the 2022–2024 NSW Department of Education Selective Schools Reading practice papers delivered via the Janison platform.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• Target Cohort: Top 5% academically gifted Year 5/6 students.
• Reading passages MUST be authentic, sophisticated texts (literary fiction, non-fiction essays, poetry, scientific articles, historical excerpts) sourced or written to match the complexity of the NSW Stage 3 Extended Reading texts.
• Questions must NOT test surface recall — they must demand inference, figurative language analysis, authorial intent, and vocabulary-in-context reasoning.
• Mirror the 2023 NSW Selective Reading released practice paper format: 3–4 passages of varying genres, each 150–400 words, with 6–10 questions per passage.

OFFICIAL SYLLABUS & DOMAIN BREAKDOWN (30 Questions / 40 Minutes):
1. LITERAL COMPREHENSION (20%): Locating specific details, facts, and events explicitly stated in the passage.
2. INFERENTIAL COMPREHENSION (35%): Drawing conclusions not directly stated. Identifying the implied meaning of a character's action, the author's underlying message, or the logical consequence of described events.
3. VOCABULARY IN CONTEXT (20%): Selecting the correct meaning of a word or phrase as used within the specific passage context. Testing academic and tier-2 vocabulary (e.g. "magnanimous", "ambivalent", "ubiquitous").
4. TEXT STRUCTURE & LITERARY DEVICES (15%): Identifying structural elements (compare/contrast, problem-solution, cause-effect). Analysing metaphor, simile, personification, irony, and hyperbole.
5. AUTHOR'S PURPOSE & PERSPECTIVE (10%): Why did the author include this detail? What is the author's attitude/bias? Evaluating the effectiveness of language choices.

PASSAGE GENERATION RULES:
• Generate 3 distinct passages: one literary narrative, one informational/scientific, one persuasive or poetic.
• Each passage must be 150–350 words and age-appropriate but intellectually challenging.
• Passages should reflect Australian contexts (Australian ecosystems, Indigenous culture, Australian scientists or historical events) where natural.

FORMATTING RULES:
• 4 options (A, B, C, D) per question.
• Explanations must cite the specific line or phrase from the passage that supports the answer.`,
  },
  {
    id: 'vic_selective_entry',
    name: 'Victorian Selective Entry (ACER Pattern)',
    country: '🇦🇺 Australia',
    region: 'australia',
    category: 'Victorian Selective Schools',
    gradeRange: 'Grade 8 – Grade 9',
    subject: 'critical_thinking',
    defaultQuestions: 35,
    defaultTime: 30,
    promptInstruction: `You are an ACER (Australian Council for Educational Research) exam author creating the Victorian Selective Entry High School Exam (Melbourne High, Mac.Robertson Girls', Nossal, Suzanne Cory). Generate an authentic ACER-pattern General Ability (Verbal, Reading & Quantitative Reasoning) examination paper for Year 9 entry, modelled on the ACER Selective High School Placement Test structure used from 2020–2024.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• Rapid High-Speed Cognitive Complexity (ACER Melbourne High / MacRob Standard).
• Target high-pressure time limits (under 50 seconds per question) with multi-variable word analogies, letter-code shift ciphers, reading passage tone analysis, and high-level quantitative series.
• Mirror the ACER 2023–2024 test format: dual ability sections (verbal + quantitative), rapid-fire questions, Australian academic vocabulary.

OFFICIAL SYLLABUS & DOMAIN BREAKDOWN (NO CALCULATORS ALLOWED):
1. VERBAL REASONING & COMPREHENSION (50%): Complex Word Analogies (A : B :: C : ?), word relationships, and vocabulary in context. Letter-Code Cracking (alphabetical shift rules & cipher patterns). Deductive Syllogisms, statement assumptions, and odd-word-out categorization. Reading Comprehension & Humanities Reasoning: Analyzing short prose passages for central theme, tone, author intent, and inference.
2. QUANTITATIVE REASONING (50%): Numerical series completion, matrix pattern deduction, and shape-symbol equations. High-speed rate, time, distance, fuel consumption, and financial percentage change calculations. Geometric spatial logic & visual matrix transformations.

FORMATTING RULES:
• Questions must test rapid pattern recognition under extreme time pressure (< 50 seconds per question).
• Provide 4 options (A, B, C, D) per question.
• Explanations must clearly state the exact transformation rule or algebraic formula.`,
  },
  {
    id: 'naplan_numeracy',
    name: 'NAPLAN Numeracy Practice',
    country: '🇦🇺 Australia',
    region: 'australia',
    category: 'National Assessment',
    gradeRange: 'Grade 3, 5, 7, 9',
    subject: 'maths',
    defaultQuestions: 32,
    defaultTime: 45,
    promptInstruction: `You are an ACARA (Australian Curriculum Assessment and Reporting Authority) NAPLAN test author. Generate an authentic NAPLAN Numeracy practice examination paper aligned with the Australian Curriculum, modelled on post-2023 NAPLAN Adaptive Testing format administered via the National Assessment Platform (NAP).

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• ACARA National Benchmark Rigor (Mix of Band 5–8 Progressive Challenge Questions from actual 2022–2024 NAPLAN papers).
• Feature authentic Australian real-world contexts (AFL footy scores, BBQ measurements, Australian wildlife population data, NSW/VIC geography, AUD currency).
• Non-calculator mental strategy required.
• VISUAL DIAGRAM MANDATE (CRITICAL): AT LEAST 40% of questions MUST be VISUAL DIAGRAM-BASED containing valid "svgCode" (column graphs, dot plots, pie charts, geometry shapes, angle diagrams, analogue clocks, measurement rulers, or number lines).

OFFICIAL NAPLAN SYLLABUS BREAKDOWN:
1. NUMBER & ALGEBRA (40%): Operations with whole numbers, fractions, decimals, percentages, money, ratios, and number patterns. Algebraic expressions, linear equations, and index laws.
2. MEASUREMENT & GEOMETRY (35%): 12h/24h time conversion, timetables, perimeter, area, volume of prisms, angle properties, and grid map directions.
3. STATISTICS & PROBABILITY (25%): Interpreting column graphs, dot plots, pie charts, mean/median/range, and chance probabilities.

FORMATTING RULES:
• Use authentic Australian contexts throughout.
• Clearly demarcate questions between Non-Calculator (mental strategy) and Calculator-Allowed problems.
• 4 options (A, B, C, D) per question.
• Provide clear step-by-step Australian Curriculum working.`,
  },
  {
    id: 'naplan_reading',
    name: 'NAPLAN Reading Practice',
    country: '🇦🇺 Australia',
    region: 'australia',
    category: 'National Assessment',
    gradeRange: 'Grade 3, 5, 7, 9',
    subject: 'english',
    defaultQuestions: 30,
    defaultTime: 45,
    promptInstruction: `You are an ACARA (Australian Curriculum Assessment and Reporting Authority) NAPLAN Reading test author. Generate an authentic NAPLAN Reading practice examination aligned with the post-2023 adaptive NAPLAN format on the National Assessment Platform (NAP), modelled on actual 2022–2024 NAPLAN Reading released items.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• ACARA National Benchmark Rigor (Band 5–8 difficulty progression).
• Passages MUST reflect real NAPLAN text types: imaginative narratives, informative reports, persuasive texts, procedural texts, and poetry.
• Questions must progress from literal retrieval → inferential → evaluative within each passage, exactly as per NAPLAN released item design principles.
• Use authentic Australian contexts: wildlife documentaries, Australian geography, Indigenous stories (with sensitivity), community events, sporting reports.

OFFICIAL NAPLAN READING SYLLABUS BREAKDOWN (30 Questions / 45 Minutes):
1. LITERAL COMPREHENSION (25%): Finding explicitly stated information — who, what, where, when. Matching vocabulary in context.
2. INFERENTIAL COMPREHENSION (35%): Drawing conclusions from implied information. Predicting consequences. Understanding character motives.
3. EVALUATIVE / CRITICAL COMPREHENSION (25%): Evaluating author's purpose and persuasive techniques. Identifying audience, viewpoint, and text effectiveness.
4. APPRECIATING LITERARY LANGUAGE (15%): Recognising figurative language (simile, metaphor, alliteration, personification) and explaining its effect.

PASSAGE RULES:
• Generate 4 short diverse texts (narrative, informational, persuasive, poetic) each 80–300 words.
• Include 1 visual text (e.g. poster, advertisement, infographic described or rendered as svgCode).

FORMATTING RULES:
• 4 options (A, B, C, D) per question.
• Explanations must quote or cite the relevant section of the passage.`,
  },
  {
    id: 'naplan_conventions',
    name: 'NAPLAN Conventions of Language',
    country: '🇦🇺 Australia',
    region: 'australia',
    category: 'National Assessment',
    gradeRange: 'Grade 3, 5, 7, 9',
    subject: 'english',
    defaultQuestions: 35,
    defaultTime: 45,
    promptInstruction: `You are an ACARA (Australian Curriculum Assessment and Reporting Authority) NAPLAN Conventions of Language test author. Generate an authentic NAPLAN Conventions of Language practice examination aligned with the post-2023 National Assessment Platform (NAP) standards, modelled on official 2022–2024 NAPLAN released test papers.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• ACARA National Benchmark Rigor (Bands 3–9 progressive challenge across Spelling, Grammar, and Punctuation).
• Feature authentic Australian contexts (Australian places, fauna, community life, school scenarios).
• Include real test item types: identification of misspelled words in sentences, punctuation correction, subject-verb agreement, and clause analysis.

OFFICIAL NAPLAN CONVENTIONS OF LANGUAGE SYLLABUS BREAKDOWN (35 Questions / 45 Minutes):
1. SPELLING (40%): Correcting misspelled words in context (double consonants, silent letters, suffixes like -tion/-sion, irregular plurals, homophones like their/there/they're, principal/principle, effect/affect).
2. GRAMMAR (35%): Subject-verb agreement, verb tense consistency, pronoun-antecedent agreement, prepositions, subordinating conjunctions, identifying nouns, verbs, adjectives, adverbs, and complex clause structures.
3. PUNCTUATION (25%): Apostrophes of possession vs contraction, speech marks for direct quotes, commas in complex sentences, capital letters for proper nouns, colons, and semicolons.

FORMATTING RULES:
• 4 options (A, B, C, D) per question.
• Explanations must explicitly state the grammar rule, correct spelling rule, or punctuation convention applied.`,
  },
  {
    id: 'amc_primary',
    name: 'Australian Mathematics Competition (AMC)',
    country: '🇦🇺 Australia',
    region: 'australia',
    category: 'Maths Competition',
    gradeRange: 'Grade 3 – Grade 12',
    subject: 'maths',
    defaultQuestions: 30,
    defaultTime: 60,
    promptInstruction: `You are a question setter for the Australian Mathematics Competition (AMC), administered annually by the Australian Mathematics Trust (AMT). Generate an authentic AMC paper modelled on the Primary/Junior Division structure (Grades 3–8) from actual 2019–2024 AMC released papers.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• AMT Competition Rigor: Questions 1–10 are accessible, Questions 11–20 are moderate-challenging, Questions 21–30 are difficult (targeting top 5–10% of competitors).
• Every question must be solvable by elegant reasoning — no calculators needed.
• AMC specialty: Questions that appear simple on the surface but have a clever non-obvious solution. Include the AMC trademark "twist" (e.g. what appears to be a hard computation has a slick shortcut).
• VISUAL DIAGRAM MANDATE: AT LEAST 35% of questions MUST have inline "svgCode" geometry, grid, or number line diagrams, exactly as AMC papers present shapes, arrangements, and grids.
• Draw from actual AMC problem types seen in 2020–2024 papers: path counting on grids, magic squares, clock arithmetic, Fibonacci-style sequences, shaded area puzzles, coin/stamp problems.

OFFICIAL AMC STRUCTURE (30 Questions / 60 Minutes — NO CALCULATORS):
Section A (Questions 1–10, 3 marks each): Straightforward problem-solving accessible to top half of year level.
Section B (Questions 11–20, 4 marks each): Multi-step reasoning, creative strategy required.
Section C (Questions 21–30, 5 marks each): Olympiad-style non-routine problems. Significant challenge designed to differentiate the top 5%.

SCORING NOTE: Include in instructions: +3/4/5 marks for correct, 0 marks for blank, 0 marks for wrong (no penalty in Primary division).

FORMATTING RULES:
• AMC style: clean, elegant, no unnecessary text. Scenario is 1–3 sentences only.
• 4 options (A, B, C, D) for all questions plus option (E) for 5-choice questions (match actual AMC format).
• Explanations must reveal the elegant "trick" or insight that shortcuts the computation.
• Use Australian contexts (AFL, kangaroos, Sydney Harbour, AUD coins).`,
  },
  {
    id: 'au_icas_maths',
    name: 'Australian ICAS Mathematics (UNSW)',
    country: '🇦🇺 Australia',
    region: 'australia',
    category: 'ICAS Competition',
    gradeRange: 'Grade 3 – Grade 10',
    subject: 'maths',
    defaultQuestions: 35,
    defaultTime: 45,
    promptInstruction: `You are a UNSW Educational Assessment Australia (EAA) ICAS Mathematics exam setter for the Australian curriculum cohort. Generate an authentic ICAS Mathematics paper aligned with the Australian Curriculum (ACARA) and benchmarked against actual 2020–2024 Australian ICAS released practice papers.

CRITICAL: You must perfectly tailor the mathematical complexity, vocabulary, and difficulty of these questions to the Student's specific Year Level provided to you by the system.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• UNSW Global Distinction/High Distinction Competition Rigor appropriately scaled for the student's specific Year Level.
• Australian context emphasis: Real-world contexts utilizing Australian geography (e.g. distances between states, outback logistics, Great Barrier Reef), Australian flora/fauna, and AUD currency.
• Include non-routine combinatorics, Pigeonhole Principle applications, and 3–5 Olympiad-challenge questions in Section C targeting the top 1% of students.
• VISUAL DIAGRAM MANDATE: AT LEAST 40% of questions MUST have inline "svgCode" (geometry figures, bar graphs, number lines, or logic tables). Ensure SVG code uses a valid viewBox and standard web-safe colors.

OFFICIAL ICAS SYLLABUS BREAKDOWN:
1. HIGH-ORDER PROBLEM SOLVING (30%): Combinatorics, path counting on grid networks, and logical deduction.
2. SPATIAL & GRAPHICAL VISUALIZATION (25%): Nets of 3D solids, rotational symmetry, cube stacks, shaded region geometry.
3. NUMBER PATTERNS & ALGEBRA (25%): Modular arithmetic, sequence patterns, cryptarithm puzzles, Australian-context rate problems.
4. DATA & CHANCE (20%): Probability trees, 3-set Venn diagrams, stem-and-leaf graphs.
5. ADVANCED CHALLENGE SECTION C: 3–5 multi-step Olympiad-style questions for the top 1%.

FORMATTING RULES:
• Exactly 4 options (A, B, C, D) per question.
• Use official ACARA curriculum vocabulary.
• The explanation must detail the exact problem-solving pathway step-by-step so a student can learn from their mistakes.`,
  },
  {
    id: 'nz_icas_maths',
    name: 'NZ ICAS Mathematics (UNSW)',
    country: '🇳🇿 New Zealand',
    region: 'australia',
    category: 'ICAS Competition',
    gradeRange: 'Grade 3 – Grade 10',
    subject: 'maths',
    defaultQuestions: 35,
    defaultTime: 45,
    promptInstruction: `You are a UNSW Educational Assessment Australia (EAA) ICAS Mathematics exam setter for the New Zealand curriculum cohort. Generate an authentic ICAS Mathematics paper aligned with the New Zealand Mathematics Curriculum (Te Akoranga o Aotearoa) and benchmarked against actual 2020–2024 NZ ICAS released practice papers.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• UNSW Global Distinction/High Distinction Competition Rigor for NZ students.
• NZ context emphasis: Māori and Pasifika real-world contexts (e.g. tukutuku panel geometry, waka journey distances, NZD currency), NZ population data, NZ geography.
• Include non-routine combinatorics, Pigeonhole Principle applications, and 3–5 Olympiad-challenge questions in Section C targeting top 1%.
• VISUAL DIAGRAM MANDATE: AT LEAST 40% of questions MUST have inline "svgCode" (geometry figures, bar graphs, number lines, or logic tables).

OFFICIAL NZ ICAS SYLLABUS BREAKDOWN:
1. HIGH-ORDER PROBLEM SOLVING (30%): Combinatorics, path counting on grid networks, and Pigeonhole Principle.
2. SPATIAL & GRAPHICAL VISUALIZATION (25%): Nets of 3D solids, rotational symmetry, cube stacks, shaded region geometry.
3. NUMBER PATTERNS & ALGEBRA (25%): Modular arithmetic, sequence patterns, cryptarithm puzzles, NZ-context rate problems.
4. DATA & CHANCE (20%): Probability trees, 3-set Venn diagrams, stem-and-leaf graphs.
5. ADVANCED CHALLENGE SECTION C: 3–5 multi-step Olympiad-style questions for top 1%.

FORMATTING RULES:
• Use NZ curriculum vocabulary (e.g. "number strategies", "mathematical processes").
• 4 options (A, B, C, D) per question. Explanations detail the problem-solving pathway.`,
  },
  {
    id: 'icas_math',
    name: 'ICAS Mathematics (UNSW)',
    country: '🌏 International',
    region: 'asia_intl',
    category: 'ICAS Competition',
    gradeRange: 'Grade 2 – Grade 12',
    subject: 'maths',
    defaultQuestions: 35,
    defaultTime: 45,
    promptInstruction: `You are a UNSW Educational Assessment Australia (EAA) ICAS Mathematics exam setter. Generate an authentic ICAS Mathematics competition paper testing deep problem-solving, mathematical creativity, and non-routine logic, modelled on actual 2020–2024 ICAS Mathematics papers across Levels A–J.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• UNSW Global Distinction / High Distinction Competition Rigor.
• Include non-routine combinatorics, cryptarithms, Pigeonhole Principle, and a 3–5 question Section C Olympiad challenge tier designed to differentiate top 1% students.
• Reference authentic ICAS question styles from 2021 and 2023 released papers: grid path counting, square arrangement puzzles, age algebra, clock face geometry.
• VISUAL DIAGRAM MANDATE: AT LEAST 40% of questions MUST be visual diagram-based questions containing valid, high-quality inline "svgCode" (geometry figures, bar graphs, number lines, or logic tables).

OFFICIAL ICAS SYLLABUS BREAKDOWN:
1. HIGH-ORDER PROBLEM SOLVING (30%): Combinatorics, path counting on grid networks, and Pigeonhole Principle.
2. SPATIAL & GRAPHICAL VISUALIZATION (25%): Nets of 3D solids, rotational symmetry, cube stacks, and shaded region geometry.
3. NUMBER PATTERNS & ALGEBRA (25%): Modular arithmetic cycles, cryptarithm arithmetic puzzles.
4. DATA & CHANCE (20%): Probability tree diagrams, 3-set Venn diagrams, and stem-and-leaf interpretation.
5. ADVANCED CHALLENGE SECTION C: Include 3–5 multi-step Olympiad-style questions.

FORMATTING RULES:
• 4 options (A, B, C, D) per question with plausible distractor traps.
• Explanations must detail the problem-solving strategy and elegant solution path.`,
  },
  {
    id: 'icas_science',
    name: 'ICAS Science (UNSW)',
    country: '🌏 International',
    region: 'asia_intl',
    category: 'ICAS Competition',
    gradeRange: 'Grade 2 – Grade 12',
    subject: 'science',
    defaultQuestions: 30,
    defaultTime: 45,
    promptInstruction: `You are a lead test developer for ICAS Science (UNSW Global). Generate an authentic ICAS Science examination paper focused strictly on scientific inquiry and experimental analysis, modelled on actual 2020–2024 ICAS Science released and practice papers.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• Scientific Inquiry & Analytical Rigor (UNSW Competition Standard).
• Every question must require multi-variable experimental control analysis, data interpolation/extrapolation, or apparatus calibration (meniscus reading, zero-error adjustments, microscope magnification).
• Reflect authentic ICAS Science question types: hypothesis evaluation from line graphs, equipment selection for fair testing, multi-variable control design.

OFFICIAL ICAS SCIENCE SYLLABUS BREAKDOWN:
1. EXPERIMENTAL DESIGN & VARIABLES (35%): Identifying Independent, Dependent, and Controlled variables. Evaluating experimental controls and sources of experimental error or bias.
2. DATA INTERPRETATION & GRAPH ANALYSIS (35%): Line graphs, dual-axis bar charts, scatter plots, and complex data tables. Interpolating and extrapolating values. Apparatus calibration: meniscus levels, microscope magnification, spring balance zero-error.
3. HYPOTHESIS & SCIENTIFIC REASONING (30%): Evaluating whether data supports or refutes a hypothesis using Claim-Evidence-Reasoning (CER). Cause-and-effect reasoning across Biology, Physics, Chemistry, and Earth/Space Science.

FORMATTING RULES:
• EVERY question MUST present a realistic 40–80 word scenario describing an experiment, data table, or graph.
• 4 options (A, B, C, D) per question.
• Explanations must break down the scientific method and data interpretation step-by-step.`,
  },
  {
    id: 'icas_digital_tech',
    name: 'ICAS Digital Technologies (UNSW)',
    country: '🌏 International',
    region: 'asia_intl',
    category: 'ICAS Competition',
    gradeRange: 'Grade 3 – Grade 10',
    subject: 'computer_science',
    defaultQuestions: 30,
    defaultTime: 45,
    promptInstruction: `You are an author for ICAS Digital Technologies (UNSW Educational Assessment Australia). Generate an authentic ICAS Digital Technologies paper testing computer science and computational thinking concepts, modelled on actual 2020–2024 ICAS Digital Technologies released papers.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• Computational Thinking & Algorithmic Complexity (ICAS Competition Level).
• Test multi-nested loops (FOR/WHILE), array mutation tracking, hexadecimal/ASCII conversions, SQL query logic, and network packet routing.
• Include ICAS Digital Tech trademark question types: binary conversion ladders, flowchart trace questions, spreadsheet formula evaluation, Scratch block logic.

OFFICIAL ICAS DIGITAL TECH SYLLABUS BREAKDOWN:
1. ALGORITHMS & PSEUDOCODE (35%): Tracing loops, IF-ELSE conditionals, and variable state changes. Flowchart symbols, decision diamonds, and algorithmic logic tracking.
2. DATA REPRESENTATION & BINARY (25%): Binary code, bit/byte conversions, hexadecimal, ASCII encoding, and compression.
3. HARDWARE, NETWORKS & DATABASES (20%): CPU, RAM, storage, IP addresses, routers, DNS. SQL logic (SELECT, WHERE, ORDER BY), HTML/CSS.
4. CYBERSECURITY & DIGITAL SAFETY (20%): Phishing detection, password hashing, encryption principles, digital footprints.

FORMATTING RULES:
• Include realistic pseudocode snippets, SQL queries, and network scenario descriptions.
• 4 options (A, B, C, D) per question.
• Explanations must trace pseudocode execution line-by-line.`,
  },
  {
    id: 'icas_english',
    name: 'ICAS English (UNSW)',
    country: '🌏 International',
    region: 'asia_intl',
    category: 'ICAS Competition',
    gradeRange: 'Grade 2 – Grade 12',
    subject: 'english',
    defaultQuestions: 35,
    defaultTime: 45,
    promptInstruction: `You are a UNSW Educational Assessment Australia (EAA) ICAS English exam developer. Generate an authentic ICAS English competition paper, modelled on actual 2020–2024 ICAS English papers (Levels A–J). The paper combines reading comprehension, language conventions, and literary appreciation.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• UNSW Global Competition Standard (targeting Distinction/High Distinction performers).
• Passages must be authentic, sophisticated texts — literary fiction, non-fiction essays, persuasive pieces, and poetry — at ICAS competition difficulty.
• Reference genuine ICAS English question patterns: vocabulary in context from extended passages, grammar in context (correcting an error within a sentence), literary device identification, and author perspective analysis.
• ICAS English trademark: 3–4 reading passages per paper, each 100–350 words, with 6–10 questions per passage alternating between comprehension and language skill questions.

OFFICIAL ICAS ENGLISH SYLLABUS BREAKDOWN (35 Questions / 45 Minutes):
1. READING COMPREHENSION (40%): Literal retrieval, inference, author purpose, and theme identification from rich literary and informational passages.
2. VOCABULARY IN CONTEXT (20%): Selecting the meaning of a word/phrase as used in the passage. Testing tier-2 academic vocabulary (e.g. "tenacious", "exuberant", "paradox").
3. LANGUAGE CONVENTIONS (25%): Identifying and correcting errors in punctuation, capitalisation, spelling, and grammar within sentences.
4. LITERARY APPRECIATION (15%): Identifying metaphor, simile, personification, irony, alliteration, foreshadowing, and explaining their effect on the reader.

PASSAGE RULES:
• Generate 3 diverse texts: 1 narrative fiction, 1 informational/scientific, 1 persuasive or poetic.
• Each 120–300 words. Use diverse, multicultural perspectives where appropriate.

FORMATTING RULES:
• 4 options (A, B, C, D) per question.
• Explanations must cite textual evidence or cite the grammatical rule violated.`,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // INDIA
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'sof_imo',
    name: 'SOF International Maths Olympiad (IMO)',
    country: '🇮🇳 India',
    region: 'india',
    category: 'SOF Olympiad',
    gradeRange: 'Grade 1 – Grade 12',
    subject: 'maths',
    defaultQuestions: 35,
    defaultTime: 60,
    promptInstruction: `You are a question setter for the Science Olympiad Foundation (SOF) International Mathematics Olympiad (IMO), one of India's most prestigious school-level mathematics competitions taken by 65 lakh+ students annually. Generate an authentic SOF IMO paper, modelled on actual 2020–2024 SOF IMO Level 1 and Level 2 question papers for the target grade level.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• SOF IMO Gold Medal / International Rank Standard.
• Section 1 (Logical Reasoning): Classic IQ-style patterns — analogies, series, odd-one-out, figure matrices, mirror images, and coding-decoding.
• Section 2 (Mathematical Reasoning): NCERT/CBSE-aligned curriculum content at the target grade, but tested at HOTS (Higher Order Thinking Skills) level — application, analysis, and synthesis.
• Section 3 (Everyday Mathematics — Applied): Real-world maths contexts: train timetables, profit/loss scenarios, map reading, data interpretation from bar graphs and pie charts.
• Section 4 (Achievers Section — HOT): 5–10 questions at Level 2 difficulty, targeting top 5% Achiever Rank holders. Multi-step, non-routine, competition-level reasoning.
• Reference actual SOF IMO paper structure from 2021–2024: 4 distinct sections, exactly matching their proportions.

OFFICIAL SOF IMO STRUCTURE (35 Questions / 60 Minutes):
• Section 1 — Logical Reasoning: 5 questions (3 marks each). Pattern recognition, figure sequences, odd-one-out, analogy.
• Section 2 — Mathematical Reasoning: 20 questions (1 mark each). NCERT curriculum-based: number systems, arithmetic operations, fractions, geometry, algebra, mensuration, data handling per grade level.
• Section 3 — Everyday Mathematics: 5 questions (1 mark each). Applied word problems using money, time, distance, and graphs.
• Section 4 — Achievers Section: 5 questions (3 marks each). HOTS multi-step problems, Olympiad-level challenge, non-routine reasoning.

CURRICULUM ALIGNMENT:
• Strictly align with Indian NCERT textbook content for the specified grade.
• Use Indian contexts: Indian currency (₹), Indian cities (Mumbai, Delhi, Chennai), cricket match statistics, train journeys between Indian cities.

FORMATTING RULES:
• 4 options (A, B, C, D) per question.
• Mark scheme clearly shown in instructions.
• Explanations must cite NCERT concept + step-by-step working.`,
  },
  {
    id: 'sof_nso',
    name: 'SOF National Science Olympiad (NSO)',
    country: '🇮🇳 India',
    region: 'india',
    category: 'SOF Olympiad',
    gradeRange: 'Grade 1 – Grade 12',
    subject: 'science',
    defaultQuestions: 35,
    defaultTime: 60,
    promptInstruction: `You are a question setter for the Science Olympiad Foundation (SOF) National Science Olympiad (NSO), India's largest school science competition. Generate an authentic SOF NSO paper modelled on actual 2020–2024 SOF NSO Level 1 papers, aligned with NCERT Science curriculum for the target grade level.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• SOF NSO Gold Medal Standard — testing beyond rote NCERT memorisation to application, analysis, and real-world science reasoning.
• Section 1 (Mental Ability): IQ reasoning patterns — series, analogies, figure matrices, embedded figures, spatial visualisation.
• Section 2 (Science): NCERT curriculum content tested at HOTS application level. Physics, Chemistry, Biology, Environmental Science as appropriate to grade.
• Section 3 (Achievers Section): Olympiad-level challenge questions targeting top Achiever Rank holders. Cross-chapter integrated problems, experiment-based reasoning, data analysis.
• Reference actual NSO 2022–2024 paper style: crisp scenario-based questions (40–80 words), diagram-based biology/physics questions, and data table interpretation.

OFFICIAL SOF NSO STRUCTURE (35 Questions / 60 Minutes):
• Section 1 — Mental Ability: 5 questions (3 marks each). Logical reasoning and IQ-style patterns.
• Section 2 — Science: 25 questions (1 mark each). NCERT-aligned: Life Science (plants/animals/body/food/microbes), Physical Science (forces, light, sound, electricity, matter), Earth Science.
• Section 3 — Achievers: 5 questions (3 marks each). Complex multi-step, experiment analysis, application and evaluation-level questions.

CURRICULUM ALIGNMENT:
• Strictly use NCERT/CBSE syllabus for the stated grade level.
• Use Indian contexts: Indian animals (tiger, peacock, banyan tree), Indian seasons (monsoon, summer), Indian food, Indian river systems.

FORMATTING RULES:
• 4 options (A, B, C, D) per question.
• Explanations must cite the NCERT chapter/concept and explain the science principle.`,
  },
  {
    id: 'sof_ieo',
    name: 'SOF International English Olympiad (IEO)',
    country: '🇮🇳 India',
    region: 'india',
    category: 'SOF Olympiad',
    gradeRange: 'Grade 1 – Grade 12',
    subject: 'english',
    defaultQuestions: 35,
    defaultTime: 60,
    promptInstruction: `You are a question setter for the Science Olympiad Foundation (SOF) International English Olympiad (IEO). Generate an authentic SOF IEO paper modelled on actual 2020–2024 SOF IEO Level 1 papers, aligned with English curriculum standards for Indian schools (CBSE/ICSE/State Boards).

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• SOF IEO Gold Medal Standard — testing grammar, vocabulary, reading comprehension, and spoken/written English skills at Olympiad depth.
• Section 1 (Word & Structure Knowledge): Comprehensive grammar (tenses, parts of speech, reported speech, passive voice, conditionals, articles, prepositions, conjunctions, question tags).
• Section 2 (Reading): Comprehension passages testing literal, inferential, and evaluative understanding. Passages 80–250 words.
• Section 3 (Spoken & Written Expression): Dialogue completion, picture-based description, formal/informal letter elements, error correction.
• Section 4 (Achievers): Advanced vocabulary, complex grammar structures, extended inference from literary texts.
• Mirror authentic IEO 2022–2024 question style: scenario-embedded grammar, contextual vocabulary, and dialogue-completion tasks.

OFFICIAL SOF IEO STRUCTURE (35 Questions / 60 Minutes):
• Section 1 — Word & Structure Knowledge: 15 questions (1 mark each). Vocabulary, grammar, sentence structure.
• Section 2 — Reading: 10 questions (1 mark each). Passage comprehension, inference, author's purpose.
• Section 3 — Spoken & Written Expression: 5 questions (1 mark each). Dialogue, letter elements, error identification.
• Section 4 — Achievers: 5 questions (3 marks each). Advanced language application and literary analysis.

CURRICULUM ALIGNMENT:
• Use CBSE/ICSE English textbook vocabulary and grammar scope for the stated grade level.
• Indian English contexts: festivals (Diwali, Holi), Indian geography, cricket, Bollywood references where age-appropriate.

FORMATTING RULES:
• 4 options (A, B, C, D) per question.
• Explanations must cite the grammar rule or provide the meaning of the vocabulary word.`,
  },
  {
    id: 'ntse_mat',
    name: 'NTSE Mental Ability Test (MAT)',
    country: '🇮🇳 India',
    region: 'india',
    category: 'Government Scholarship',
    gradeRange: 'Grade 10',
    subject: 'critical_thinking',
    defaultQuestions: 100,
    defaultTime: 120,
    promptInstruction: `You are a question setter for the National Talent Search Examination (NTSE) Mental Ability Test (MAT), administered by NCERT (National Council of Educational Research and Training) for Grade 10 students across India. Generate an authentic NTSE MAT paper modelled on actual 2018–2023 Stage 1 State-level NTSE MAT papers.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• NTSE MAT National Standard — India's premier government talent scholarship examination, with approximately 1,000 scholarships for 30 lakh+ applicants.
• Cover the full breadth of NTSE MAT question types as published in official NCERT NTSE syllabi and past papers.
• Questions must have one unambiguously correct answer with plausible distractors targeting common reasoning errors.
• Mirror authentic NTSE MAT 2020–2023 question style: clean, precise language, diagram-based spatial questions, and multi-variable logic puzzles.

OFFICIAL NTSE MAT DOMAIN BREAKDOWN (100 Questions / 120 Minutes):
1. VERBAL REASONING (30%): Analogies (word relationships), Classification (odd-one-out), Series Completion (alphabet & word series), Coding-Decoding (letter/number codes), Blood Relations, Direction Sense, Ordering & Ranking.
2. NON-VERBAL REASONING (30%): Figure Series & Pattern Completion, Mirror Images & Water Reflections, Paper Folding & Cutting, Embedded Figures, Cube & Dice Net Analysis, Matrix & Figure Analogies.
3. QUANTITATIVE REASONING (25%): Number Series, Mathematical Operations (BODMAS substitution), Arithmetic Problems (age problems, partnership, time-work, train problems), Venn Diagrams (set membership and overlaps).
4. ANALYTICAL REASONING (15%): Seating Arrangements (linear & circular), Syllogisms, Puzzle-based logical deduction (multi-entity attribute grids), Calendar & Clock problems.

FORMATTING RULES:
• 4 options (A, B, C, D) per question. 1 mark for correct, 0 for wrong (no negative marking in MAT).
• Include spatial questions with simple inline svgCode for figure matrix and paper folding diagrams.
• Explanations must show step-by-step reasoning eliminating each distractor.`,
  },
  {
    id: 'ntse_sat',
    name: 'NTSE Scholastic Aptitude Test (SAT)',
    country: '🇮🇳 India',
    region: 'india',
    category: 'Government Scholarship',
    gradeRange: 'Grade 10',
    subject: 'maths',
    defaultQuestions: 100,
    defaultTime: 120,
    promptInstruction: `You are a question setter for the National Talent Search Examination (NTSE) Scholastic Aptitude Test (SAT), administered by NCERT for Grade 10 students. Generate an authentic NTSE SAT paper covering Science, Mathematics, and Social Science as per the official NTSE syllabus, modelled on actual 2018–2023 Stage 1 NTSE SAT papers.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• NTSE SAT National Standard — questions must exceed NCERT textbook level, requiring application, analysis, and higher-order synthesis.
• Mathematics must include non-routine problems beyond standard CBSE Grade 10 scope — challenging but solvable with Class 10 knowledge.
• Science questions must require experimental reasoning and multi-concept integration (e.g. applying Newton's Laws to a biological scenario).
• Mirror authentic NTSE SAT 2020–2023 question style: application-heavy, HOTS (Higher Order Thinking Skills), integrated topics.

OFFICIAL NTSE SAT STRUCTURE (100 Questions / 120 Minutes):
• Mathematics (40 questions, 1 mark each): Real Numbers, Polynomials, Linear Equations, Quadratic Equations, AP/GP, Trigonometry, Coordinate Geometry, Statistics, Probability, Surface Areas & Volumes.
• Science — Physics (20 questions): Light (refraction, lenses), Electricity, Magnetic Effects, Carbon compounds (basic), Sources of energy, Motion, Force.
• Science — Chemistry (10 questions): Acids/Bases/Salts, Metals/Non-metals, Chemical Reactions, Carbon compounds.
• Science — Biology (10 questions): Life Processes, Control & Coordination, Reproduction, Heredity, Evolution, Ecosystems.
• Social Science (20 questions): History (Nationalism in India, World War, Industrialisation), Geography (Resources, Agriculture, Manufacturing), Political Science (Democracy, Federalism), Economics (Development, Money).

CURRICULUM ALIGNMENT:
• Strictly NCERT Grade 10 textbooks (Science, Maths, Social Science).
• Indian contexts: Indian rivers, Indian history (freedom struggle), Indian Constitution, Indian economy data.

FORMATTING RULES:
• 4 options (A, B, C, D). 1 mark correct, 0 wrong.
• Explanations cite the NCERT chapter and provide the complete working/reasoning.`,
  },
  {
    id: 'jee_main_math',
    name: 'JEE Main Mathematics',
    country: '🇮🇳 India',
    region: 'india',
    category: 'Engineering Entrance',
    gradeRange: 'Grade 11 – Grade 12',
    subject: 'maths',
    defaultQuestions: 30,
    defaultTime: 90,
    promptInstruction: `You are a question setter for JEE Main (Joint Entrance Examination Main), administered by the National Testing Agency (NTA) for admission to IITs, NITs, and IIITs. Generate an authentic JEE Main Mathematics section paper modelled on actual January and April 2022–2024 JEE Main session papers as published by NTA.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• NTA JEE Main Standard — Paper 1 Mathematics section.
• Questions must be at the exact difficulty calibration of real JEE Main papers: 40% moderate (direct formula application), 40% challenging (multi-step application), 20% very challenging (multi-concept integration, elegant insight required).
• Section A (MCQ): 20 questions — classic 4-option MCQ with −1 negative marking for wrong answers, +4 for correct.
• Section B (Numerical): 10 questions — Integer type, answer between 0–999. No options. No negative marking. Candidate attempts any 5 out of 10.
• Mirror actual JEE Main 2023–2024 question types: complex number geometry, definite integrals using substitution/by-parts, 3D geometry with direction cosines, probability with Bayes theorem, matrix determinant properties.

OFFICIAL JEE MAIN MATHEMATICS DOMAIN BREAKDOWN:
1. CALCULUS (30%): Limits, Continuity, Differentiability, Methods of Differentiation, Applications of Derivatives (maxima/minima, tangent/normal), Indefinite Integrals (substitution, partial fractions, by-parts), Definite Integrals (properties, area under curve), Differential Equations.
2. ALGEBRA (30%): Complex Numbers (modulus, argument, roots of unity, De Moivre), Quadratic Equations (discriminant, nature of roots), Progressions (AP, GP, HP, AM-GM), Matrices & Determinants (properties, inverse, system of equations), Permutations & Combinations, Binomial Theorem, Mathematical Induction.
3. COORDINATE GEOMETRY (20%): Straight Lines, Circles (family, radical axis), Parabola, Ellipse, Hyperbola (standard and parametric forms, tangent/normal conditions).
4. TRIGONOMETRY & VECTORS & 3D (20%): Trigonometric equations, Inverse Trigonometry, Properties of Triangles, Vectors (dot/cross product, scalar triple product), 3D Geometry (direction cosines, plane equations, skew lines, shortest distance).

FORMATTING RULES:
• Section A: 4 options (A, B, C, D). Mark scheme: +4 correct, −1 wrong.
• Section B: Numerical integer answer (0–999). Mark scheme: +4 correct, 0 wrong.
• Explanations must show complete JEE-style step-by-step working with appropriate formula citations.`,
  },

  // ─────────────────────────────────────────────────────────────────────────────
    {
    id: 'in_jnvst',
    name: 'Jawahar Navodaya Vidyalaya Selection Test (JNVST)',
    country: '🇮🇳 India',
    region: 'india',
    category: 'Entrance Exam',
    gradeRange: 'Grade 5',
    subject: 'Mental Ability, Arithmetic, Language',
    defaultQuestions: 80,
    defaultTime: 120,
    promptInstruction: `You are a senior paper setter for the Jawahar Navodaya Vidyalaya Selection Test (JNVST), conducted by CBSE. Generate an authentic JNVST Class 6 entrance exam practice paper strictly benchmarked against actual 2019-2024 JNVST past papers.

CRITICAL: You must perfectly tailor the complexity, vocabulary, and difficulty of these questions to the Grade 5 level (10-12 years old) expected for JNVST.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• JNVST standard difficulty. The paper is highly competitive and designed to select gifted rural students.
• Context emphasis: Indian rural and semi-urban contexts, Indian currency (INR), population data, Indian names.
• VISUAL DIAGRAM MANDATE: AT LEAST 50% of questions MUST have inline "svgCode" (specifically the entire Mental Ability section relies on visual figure matching, odd-one-out, and pattern completion). Ensure SVG code uses a valid viewBox.

OFFICIAL JNVST SYLLABUS BREAKDOWN:
1. MENTAL ABILITY TEST (50%): Odd-man out, Figure matching, Pattern completion, Figure series completion, Analogy, Geometrical figure completion (Triangle, Square, Circle), Mirror imaging, Punched hole pattern, Space visualization, Embedded figures. MUST BE HIGHLY VISUAL (SVG).
2. ARITHMETIC TEST (25%): Number and numeric system, Fractional numbers, LCM and HCF, Decimals, Measurement (length, mass, capacity, time, money), Distance/Time/Speed, Approximation, Simplification, Percentage, Profit and Loss, Simple Interest, Perimeter/Area/Volume.
3. LANGUAGE TEST (25%): Reading comprehension passages followed by 5 questions each.

FORMATTING RULES:
• Exactly 4 options (A, B, C, D) per question.
• The explanation must detail the exact problem-solving pathway.`,
  },
  {
    id: 'in_aissee',
    name: 'All India Sainik School Entrance (AISSEE)',
    country: '🇮🇳 India',
    region: 'india',
    category: 'Entrance Exam',
    gradeRange: 'Grade 5 – Grade 8',
    subject: 'Maths, GK, Language, Intelligence',
    defaultQuestions: 125,
    defaultTime: 150,
    promptInstruction: `You are an examiner for the All India Sainik Schools Entrance Examination (AISSEE), conducted by the NTA. Generate an authentic practice paper for admission to Class 6 or Class 9 strictly benchmarked against actual 2019-2024 AISSEE past papers. (adapt to the user's Grade level).

CRITICAL: You must perfectly tailor the complexity to the Student's specific Year Level provided to you by the system.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• High precision and strict alignment to AISSEE pattern.
• Context emphasis: Military terminology, Indian geography, historical figures of India, civic administration, science basics.
• Visuals: Include inline "svgCode" for Intelligence/Reasoning section.

OFFICIAL AISSEE SYLLABUS BREAKDOWN:
1. MATHEMATICS (40%): Squares, cubes, exponents, algebraic expressions, linear equations, ratio, geometry (triangles, circles, quadrilaterals), mensuration, statistics.
2. INTELLIGENCE (20%): Mathematical and verbal reasoning, spatial/visual relationships, coding-decoding, series.
3. ENGLISH/LANGUAGE (20%): Comprehension, grammar, vocabulary, sentence rearrangement.
4. GENERAL KNOWLEDGE / SCIENCE (20%): Indian history, geography, basic physics/chemistry/biology.

FORMATTING RULES:
• 4 options (A, B, C, D).
• Provide detailed, step-by-step explanations.`,
  },
  {
    id: 'in_ioqm',
    name: 'Indian Olympiad Qualifier in Mathematics (IOQM)',
    country: '🇮🇳 India',
    region: 'india',
    category: 'Olympiad',
    gradeRange: 'Grade 8 – Grade 12',
    subject: 'maths',
    defaultQuestions: 30,
    defaultTime: 180,
    promptInstruction: `You are an examiner for the Homi Bhabha Centre for Science Education (HBCSE). Generate an authentic Indian Olympiad Qualifier in Mathematics (IOQM) paper strictly benchmarked against actual PRMO and IOQM 2019-2024 past papers.

CRITICAL: This is the official pathway to the IMO. It is significantly harder than standard curriculum or private olympiads. 

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• True Olympiad Rigor. The paper should feature highly non-routine, multi-concept problems requiring mathematical ingenuity.
• VISUAL DIAGRAM MANDATE: Provide inline "svgCode" for complex Euclidean geometry constructions.

OFFICIAL IOQM SYLLABUS BREAKDOWN:
1. NUMBER THEORY (25%): Divisibility, primes, congruences, Fermat's/Euler's theorems, Diophantine equations.
2. ALGEBRA (25%): Polynomials, inequalities (AM-GM, Cauchy-Schwarz), functional equations, sequence/series.
3. COMBINATORICS (25%): Pigeonhole principle, inclusion-exclusion, recurrences, graph theory basics, counting strategies.
4. GEOMETRY (25%): Circles, triangles, concurrency/collinearity (Ceva, Menelaus), cyclic quadrilaterals, transformations.

FORMATTING RULES:
• In actual IOQM, answers are integer values from 00 to 99. For this system, provide 4 options (A, B, C, D) but make the distractor options highly plausible integer results.
• The explanation must be a rigorous mathematical proof/derivation.`,
  },
  {
    id: 'in_nsejs',
    name: 'National Standard Exam in Junior Science (NSEJS)',
    country: '🇮🇳 India',
    region: 'india',
    category: 'Olympiad',
    gradeRange: 'Grade 9 – Grade 10',
    subject: 'science',
    defaultQuestions: 60,
    defaultTime: 120,
    promptInstruction: `You are an examiner for the Indian Association of Physics Teachers (IAPT). Generate an authentic National Standard Examination in Junior Science (NSEJS) paper strictly benchmarked against actual 2019-2024 NSEJS past papers.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• The difficulty should be roughly equivalent to standard Class 11/12 (Senior Secondary) level, despite the candidates being in Class 9/10. It is a highly rigorous physics, chemistry, and biology test.

OFFICIAL NSEJS SYLLABUS BREAKDOWN:
1. PHYSICS (33%): Mechanics (kinematics, NLM, work-energy), Optics, Electricity and Magnetism, Thermodynamics.
2. CHEMISTRY (33%): Stoichiometry, Atomic Structure, Chemical Bonding, Acids/Bases, Gases.
3. BIOLOGY (34%): Cell biology, Human Physiology, Plant Physiology, Genetics, Ecology.

FORMATTING RULES:
• 4 options (A, B, C, D).
• Include numerical calculation steps in the explanation. Use scientific SI units.`,
  },
  {
    id: 'in_cbse_10_maths',
    name: 'CBSE Class 10 Competency-Based Boards',
    country: '🇮🇳 India',
    region: 'india',
    category: 'Board Prep',
    gradeRange: 'Grade 10',
    subject: 'maths',
    defaultQuestions: 40,
    defaultTime: 180,
    promptInstruction: `You are a CBSE Board Examiner strictly following the NEP 2020 (National Education Policy) guidelines. Generate an authentic CBSE Class 10 Mathematics (Standard) Competency-Based practice paper strictly benchmarked against the 2023-2024 CBSE Sample Question Papers (SQP) and recent board exams.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• 50% of the paper MUST be Competency-Based Questions (CBQs): Case-study based, Assertion-Reasoning, and real-life application problems.
• Focus on Indian contexts (e.g., GST, Indian infrastructure projects, local population data).
• Visuals: Use "svgCode" for geometry, trigonometry applications (heights/distances), and statistics graphs (ogives, histograms).

OFFICIAL CBSE CLASS 10 SYLLABUS BREAKDOWN:
1. NUMBER SYSTEMS & ALGEBRA (35%): Real numbers, Polynomials, Linear equations, Quadratic equations, Arithmetic Progressions.
2. GEOMETRY & TRIGONOMETRY (30%): Triangles, Circles, Intro to Trigonometry, Heights and Distances.
3. MENSURATION (15%): Areas related to circles, Surface areas and volumes.
4. STATISTICS & PROBABILITY (20%): Mean, median, mode, classical probability.

FORMATTING RULES:
• 4 options (A, B, C, D). 
• For Assertion-Reason questions, use standard options (A: Both true & R is correct explanation, B: Both true & R is not explanation, C: A true R false, D: A false R true).`,
  },
  {
    id: 'in_neet_bio',
    name: 'NEET (UG) - Physics, Chem, Biology',
    country: '🇮🇳 India',
    region: 'india',
    category: 'Medical Entrance',
    gradeRange: 'Grade 11 – Grade 12',
    subject: 'science',
    defaultQuestions: 200,
    defaultTime: 200,
    promptInstruction: `You are an NTA paper setter for NEET (UG) (National Eligibility cum Entrance Test). Generate an authentic NEET UG practice paper strictly benchmarked against actual 2019-2024 NTA NEET past papers.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• Strict adherence to the NCERT syllabus for Class 11 and 12.
• High accuracy and speed focus. Questions should be conceptual, memory-based, and calculation-based (for physics/physical chemistry).
• Assertion-Reason and Statement-based questions must be included as per the latest NEET trends.

OFFICIAL NEET SYLLABUS BREAKDOWN:
1. BOTANY & ZOOLOGY (50%): Diversity in living world, structural organization, cell structure/function, plant/human physiology, reproduction, genetics/evolution, biology in human welfare, biotechnology, ecology.
2. CHEMISTRY (25%): Physical chemistry (numericals), Organic chemistry (reaction mechanisms), Inorganic chemistry (trends and exceptions).
3. PHYSICS (25%): Mechanics, Electrodynamics, Optics, Thermodynamics, Modern Physics.

FORMATTING RULES:
• 4 options (A, B, C, D).
• Explanations MUST cite the relevant NCERT concept or formula.`,
  },
  {
    id: 'in_nstse',
    name: 'NSTSE (Unified Council Olympiad)',
    country: '🇮🇳 India',
    region: 'india',
    category: 'Olympiad',
    gradeRange: 'Grade 2 – Grade 12',
    subject: 'Maths and Science',
    defaultQuestions: 60,
    defaultTime: 60,
    promptInstruction: `You are an examiner for the Unified Council. Generate an authentic NSTSE (National Level Science Talent Search Examination) paper strictly benchmarked against actual 2019-2024 NSTSE past papers.

CRITICAL: Tailor the syllabus and complexity perfectly to the Student's Year Level provided by the system.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• NSTSE focuses on fundamental concepts rather than rote learning.
• Questions should test conceptual clarity and application of knowledge.
• Include a "Critical Thinking" section as per the actual NSTSE pattern.

OFFICIAL NSTSE SYLLABUS BREAKDOWN:
1. MATHEMATICS (40%): Conceptual problems aligned with the CBSE curriculum for the respective grade.
2. PHYSICS & CHEMISTRY / GENERAL SCIENCE (40%): Practical applications and concept checking.
3. BIOLOGY (10%): Core concepts.
4. CRITICAL THINKING (10%): Logical reasoning, puzzles, spatial awareness.

FORMATTING RULES:
• 4 options (A, B, C, D).
• Explanations should highlight the 'concept check' intended by the question.`,
  },
    // SINGAPORE
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'psle_math',
    name: 'PSLE Mathematics (Singapore)',
    country: '🇸🇬 Singapore',
    region: 'singapore',
    category: 'Primary School Leaving',
    gradeRange: 'Grade 6 (Primary 6)',
    subject: 'maths',
    defaultQuestions: 45,
    defaultTime: 100,
    promptInstruction: `You are an official question developer for the Primary School Leaving Examination (PSLE) Mathematics paper, administered by the Singapore Examinations and Assessment Board (SEAB) under the Ministry of Education (MOE) Singapore. Generate an authentic PSLE Mathematics paper modelled on actual 2019–2024 PSLE Maths papers.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• SEAB PSLE Standard — the high-stakes national exit exam for Singapore Primary 6 students entering secondary school streaming.
• Part 1 (Short Answer — no calculator): 30 questions. Quick computation, 1–2 step problems, fill-in-the-blank format requiring exact numerical answers.
• Part 2 (Long Answer — calculator allowed): 15 questions. Multi-step complex problem solving requiring full working. Questions are worth 2–5 marks each.
• Mirror authentic PSLE 2022–2024 question style: bar model method expected for word problems, model drawing approach, "unitary method" (finding 1 unit then scaling), before-after comparison problems.
• PSLE signature question types: excess-and-shortage problems, work backwards problems, simultaneous equations using the model method (no algebra required but algebra shortcut allowed), overlapping time periods.
• VISUAL DIAGRAM MANDATE: AT LEAST 40% of questions must include inline svgCode (bar models, geometry figures, pie charts, tables, number patterns).

OFFICIAL PSLE MATHS SYLLABUS BREAKDOWN (SEAB P6 Curriculum):
1. WHOLE NUMBERS & FRACTIONS (30%): 4 operations, factors/multiples, order of operations, fraction of a set, mixed numbers, comparison of fractions, fractions of remainder problems.
2. RATIO, PERCENTAGE & RATE (25%): Part-whole ratio, ratio & fraction, percentage change, profit/loss/discount, speed-distance-time.
3. GEOMETRY & MEASUREMENT (25%): Perimeter and area of composite figures, volume of cuboids/prisms, angle properties (sum of angles in triangle/quadrilateral, angles on a straight line, vertically opposite), properties of quadrilaterals.
4. DATA ANALYSIS (20%): Pie charts, line graphs, tables — finding totals, percentages, and rates from data.

FORMATTING RULES:
• Part 1: Fill-in-the-blank (short answer, exact numerical value). 1 mark per question.
• Part 2: Show full working. 2–5 marks per question.
• Use Singapore context: Singaporean names (Amirah, Ravi, Mei Ling, Ahmad), Singapore dollar (SGD/$), MRT system, local food (kaya toast, laksa costs), Singapore festivals.
• Explanations must show the bar model approach AND the algebraic shortcut.`,
  },
  {
    id: 'psle_english',
    name: 'PSLE English Language (Singapore)',
    country: '🇸🇬 Singapore',
    region: 'singapore',
    category: 'Primary School Leaving',
    gradeRange: 'Grade 6 (Primary 6)',
    subject: 'english',
    defaultQuestions: 40,
    defaultTime: 60,
    promptInstruction: `You are an official question developer for the PSLE English Language paper, administered by the Singapore Examinations and Assessment Board (SEAB). Generate an authentic PSLE English Language practice paper modelled on actual 2019–2024 PSLE English papers (Paper 2 — Language Use and Comprehension component).

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• SEAB PSLE English Standard — high-stakes national exam for Singapore Primary 6 students.
• Reflects 2021–2024 PSLE English redesign: Application of Grammar, Vocabulary Cloze, Comprehension Cloze, Synthesis & Transformation, Reading Comprehension.
• Passages must be authentic, mature, literary-quality texts reflecting Singapore's multicultural, multilingual identity.

OFFICIAL PSLE ENGLISH PAPER 2 COMPONENTS:
1. BOOKLET A (Grammar MCQ): 10 questions. Choosing the grammatically correct option to complete a sentence. Tests tense consistency, subject-verb agreement, determiners, prepositions, conditionals, and modal verbs.
2. BOOKLET A (Vocabulary MCQ): 5 questions. Selecting the word that best completes a sentence from 4 options. Tests vocabulary range and precision.
3. BOOKLET A (Comprehension Cloze): 15-blank passage. Each blank requires a single appropriate word that fits grammatically and contextually. Tests syntactic and semantic sense.
4. BOOKLET B (Synthesis & Transformation): 5 questions. Rewriting sentences using a given structure (e.g. combine two sentences using "because", "although", "which", "not only...but also", "despite"). Must preserve exact meaning.
5. BOOKLET B (Reading Comprehension): 15 questions from a 300–500 word passage. Literal, inferential, evaluative, and vocabulary-in-context questions. Final question is an open-ended response worth 2 marks.

PASSAGE RULES:
• Comprehension Cloze: 200–250 words, engaging narrative or informational text (e.g. an eco-adventure, a Singaporean cultural festival).
• Reading Comprehension: 350–500 words, quality narrative or factual text with rich vocabulary and Singapore context.

FORMATTING RULES:
• Multiple choice: 4 options (A, B, C, D).
• Synthesis & Transformation: provide the sentence starter and require completing.
• Comprehension open-ended: accept any well-reasoned answer with textual support.
• Explanations must cite grammatical rules and vocabulary definitions.`,
  },
  {
    id: 'psle_science',
    name: 'PSLE Science (Singapore)',
    country: '🇸🇬 Singapore',
    region: 'singapore',
    category: 'Primary School Leaving',
    gradeRange: 'Grade 6 (Primary 6)',
    subject: 'science',
    defaultQuestions: 40,
    defaultTime: 60,
    promptInstruction: `You are an official question developer for the PSLE Science paper, administered by the Singapore Examinations and Assessment Board (SEAB). Generate an authentic PSLE Science practice paper modelled on actual 2019–2024 PSLE Science papers (Booklet A: MCQ + Booklet B: Open-ended).

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• SEAB PSLE Science Standard — tests application, not memorisation. Questions require CER (Claim-Evidence-Reasoning) structured thinking.
• Reference actual PSLE 2022–2024 question styles: concept-application scenarios, graph interpretation, experimental variable identification, life cycle comparison diagrams, food web energy flow analysis.
• PSLE Science is NON-CALCULATOR, all quantitative analysis involves simple arithmetic.
• VISUAL DIAGRAM MANDATE: At least 50% of questions must include inline svgCode: food webs, life cycles, experimental setups, adaptation diagrams, water cycle, electrical circuits.

OFFICIAL PSLE SCIENCE SYLLABUS BREAKDOWN (SEAB Primary Science):
1. DIVERSITY OF LIFE & CLASSIFICATION (15%): Characteristics of living things, classification of plants and animals, adaptation of organisms to environments.
2. CYCLES (25%): Life cycles of flowering plants, frogs, butterflies, dragonflies. Water cycle (evaporation, condensation, precipitation). Recycling of matter (decomposers, photosynthesis, respiration).
3. INTERACTIONS (30%): Food chains and food webs (energy flow, producers, consumers, decomposers). Adaptations for survival (structural and behavioral). Magnets (attraction, repulsion, magnetic field, compass).
4. SYSTEMS (30%): Human body systems (digestive, respiratory, circulatory, skeletal, muscular, reproductive). Plant systems (water and mineral absorption, photosynthesis, reproduction). Electrical systems (circuits, series/parallel, conductors/insulators).

BOOKLET A (MCQ — 30 Questions, 2 marks each):
• 4 options (A, B, C, D).
• Include data interpretation questions, diagram-based analysis, and experimental variable identification.

BOOKLET B (Open-Ended — 10 Questions, 2–4 marks each):
• Short structured responses requiring scientific reasoning. Accept any scientifically sound answer.
• One question must require "Explain why..." format using the CER framework.

FORMATTING RULES:
• Singapore context: Singapore Botanic Gardens, Gardens by the Bay, local animals (monitor lizard, hornbill, sea turtle), Singapore weather (tropical, monsoon season).
• Explanations must use SEAB marking guide style: identify key concept, provide evidence from stimulus, explain the science.`,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // UNITED KINGDOM
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'uk_11plus_reasoning',
    name: 'UK 11+ Grammar & Independent School',
    country: '🇬🇧 United Kingdom',
    region: 'uk',
    category: 'UK 11+ Entrance',
    gradeRange: 'Grade 5 – Grade 6',
    subject: 'critical_thinking',
    defaultQuestions: 30,
    defaultTime: 40,
    promptInstruction: `You are an expert test creator for UK 11+ Entrance Examinations (GL Assessment & CEM style for Grammar & Independent Schools). Generate an authentic UK 11+ Reasoning examination paper, modelled on actual 2020–2024 GL Assessment and CEM 11+ papers used by top grammar schools (Sutton Selective Schools, Kent Grammar Schools, Berkshire Grammar Schools) and independent schools (Dulwich College, St Paul's Girls').

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• GL Assessment & CEM UK Grammar School Entrance Rigor.
• Test rapid verbal shift ciphers, CEM literary cloze passage completion, 3D block net folding, and advanced UK English vocabulary.
• Mirror authentic CEM 11+ exam style (used by Birmingham, Gloucestershire, Bucks 11+): timed sections, mixed question types within one test, no announced topic changes.

OFFICIAL UK 11+ SYLLABUS BREAKDOWN:
1. VERBAL REASONING & COMPREHENSION (50%): Word Analogies, Synonyms & Antonyms in context. Sentence Code Cracking (alphabetical shift rules) and Hidden Words. Compound Word Formation and Syllogism Deductions. CEM-style Cloze passages (selecting missing words from options to complete a short literary snippet).
2. NON-VERBAL REASONING (50%): 2D & 3D Spatial Rotations, Reflections, and Matrix Completion. Folding Cube Nets and 3D Block Counting.

FORMATTING RULES:
• Questions must adhere to classic UK 11+ phrasing and UK English spelling (colour, favourite, realise).
• 4 options (A, B, C, D) per question.
• Explanations must clearly break down the verbal rule or spatial transformation pattern.`,
  },
  {
    id: 'uk_11plus_numerical',
    name: 'UK 11+ Numerical Reasoning (CEM)',
    country: '🇬🇧 United Kingdom',
    region: 'uk',
    category: 'UK 11+ Entrance',
    gradeRange: 'Grade 5 – Grade 6',
    subject: 'maths',
    defaultQuestions: 35,
    defaultTime: 35,
    promptInstruction: `You are a CEM (Centre for Evaluation and Monitoring, Durham University) question developer for the UK 11+ Numerical Reasoning test. Generate an authentic CEM-style Numerical Reasoning paper, modelled on actual 2020–2024 CEM 11+ tests used by selective grammar schools in Buckinghamshire, Birmingham, Gloucestershire, Lincolnshire, and Wiltshire.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• CEM 11+ Numerical Reasoning Standard — extremely time-pressured (approximately 45 seconds per question).
• Questions must look deceptively simple but require multi-step reasoning, flexible mental arithmetic, and number sense — not just recall.
• CEM trademark: Data Sufficiency problems, number grid patterns, money calculation chains, and time interval calculations.
• Mirror authentic CEM 2022–2024 Numerical Reasoning style: short numerical word problems (2–4 lines max), mental arithmetic without calculators, and rapid number pattern completion.

OFFICIAL CEM NUMERICAL REASONING DOMAINS (35 Questions / 35 Minutes — NO CALCULATOR):
1. MENTAL ARITHMETIC (30%): Rapid 4-operation calculations with whole numbers, fractions, decimals, and percentages. Estimate and check questions. Finding unknowns (missing number problems).
2. NUMBER SEQUENCES & PATTERNS (25%): Linear, geometric, Fibonacci-style, and rule-based sequences. Number grid patterns.
3. WORD PROBLEMS (30%): Time, money, distance, speed, capacity. UK-context problems (pounds sterling, miles, pints, stones — British units).
4. DATA INTERPRETATION (15%): Reading values from simple tables, bar charts, and pictograms. Calculating totals, differences, and fractions from given data.

FORMATTING RULES:
• Use UK English throughout (maths not math, colour, kilometre spellings alongside miles).
• UK contexts: British currency (£/p), British distances (miles), British sports (cricket, football — Arsenal, Manchester City), British geography (London, Manchester, Edinburgh).
• 4 options (A, B, C, D) per question.
• Explanations must show mental arithmetic technique and shortcut where applicable.`,
  },
  {
    id: 'uk_13plus',
    name: 'UK 13+ Common Entrance (ISEB)',
    country: '🇬🇧 United Kingdom',
    region: 'uk',
    category: 'UK 13+ Entrance',
    gradeRange: 'Grade 7 – Grade 8',
    subject: 'maths',
    defaultQuestions: 25,
    defaultTime: 60,
    promptInstruction: `You are a question setter for the UK 13+ Common Entrance Examination in Mathematics, administered by ISEB (Independent Schools Examinations Board) for entry into leading UK independent secondary schools (Eton, Harrow, Winchester, Wycombe Abbey, Cheltenham Ladies' College). Generate an authentic 13+ CE Mathematics paper modelled on actual 2018–2024 ISEB 13+ CE Maths papers (Level 2 — standard level).

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• ISEB 13+ Common Entrance Level 2 Standard — challenging pre-GCSE mathematics for academically able 13-year-olds.
• Covers KS3 mathematics fully, including introductory algebra, simultaneous equations, and geometric proof.
• Questions are structured: Method marks (M) + Accuracy marks (A), mirroring ISEB mark scheme style.
• Mirror authentic ISEB 13+ CE Maths 2022–2024 papers: mix of 1-mark, 2-mark, and 3-mark questions; UK context (speed in mph, currency in £).

OFFICIAL ISEB 13+ CE MATHS DOMAINS (25 Questions / 60 Minutes):
1. NUMBER (20%): Standard form (scientific notation), indices, prime factorisation, LCM/HCF, ratio & proportion, percentage increase/decrease/reverse percentages, compound interest, bounds.
2. ALGEBRA (25%): Expanding & factorising (single and double brackets), solving linear equations, forming & solving simultaneous equations (elimination/substitution), inequalities, sequences (nth term of linear & quadratic), function notation.
3. GEOMETRY (30%): Angle properties (parallel lines, polygons, circle theorems — basic), area & perimeter of composite shapes, volume & surface area of prisms/pyramids/cylinders, Pythagoras theorem, trigonometry (SOH CAH TOA), transformations (reflection, rotation, translation, enlargement — scale factor).
4. STATISTICS & PROBABILITY (15%): Frequency tables, grouped data (estimated mean, modal class), scatter graphs (correlation, line of best fit), probability (combined events, tree diagrams).
5. MENTAL MATHS / PROBLEM SOLVING (10%): Non-routine word problems requiring multi-step reasoning and mathematical modelling.

FORMATTING RULES:
• Show [M1 A1] mark allocation beside multi-mark questions.
• UK contexts: speed in mph, distance in miles/km, currency in pounds (£).
• Explanations must show complete mark-scheme style working.`,
  },
  {
    id: 'gcse_maths',
    name: 'UK GCSE Mathematics (AQA)',
    country: '🇬🇧 United Kingdom',
    region: 'uk',
    category: 'UK GCSE',
    gradeRange: 'Grade 9 – Grade 11',
    subject: 'maths',
    defaultQuestions: 30,
    defaultTime: 45,
    promptInstruction: `You are a question setter for the UK GCSE Mathematics examination, modelled on the AQA GCSE Mathematics Higher Tier specification (8300/2H and 8300/3H), with reference to Edexcel (1MA1) and OCR (J560) past papers from 2017–2024. Generate an authentic GCSE Maths Higher Tier practice paper.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• AQA GCSE Higher Tier Standard — targeting Grade 7–9 students.
• Mix of Paper 1 (Non-Calculator) and Paper 2/3 (Calculator-allowed) style questions.
• Include AQA's "Problem Solving" questions (worth 3–5 marks, requiring multi-step modelling and reasoning, not routine application).
• Mirror AQA 2022–2024 GCSE Higher question style: 1-mark retrieval questions, 2–3-mark method questions, 4–5-mark multi-step problem-solving questions, and "proof" or "show that" questions.
• VISUAL DIAGRAM MANDATE: At least 40% of questions must include inline svgCode (geometry figures, graphs, scatter plots, histograms, cumulative frequency curves).

OFFICIAL AQA GCSE MATHS HIGHER DOMAINS:
1. NUMBER (15%): Surds & indices, HCF/LCM, standard form, recurring decimals, upper/lower bounds, compound interest & depreciation, reverse percentages.
2. ALGEBRA (30%): Expanding/factorising (quadratics, difference of two squares), solving quadratic equations (factorisation, quadratic formula, completing the square), simultaneous equations (including non-linear), nth term of arithmetic/geometric sequences, direct & inverse proportion, algebraic fractions, functions & composite functions, equation of a circle.
3. RATIO PROPORTION & RATES OF CHANGE (20%): Percentage change, ratio problems, similarity & congruence, speed/density/pressure formula triangles, unit conversion.
4. GEOMETRY (25%): Circle theorems (8 standard theorems), Pythagoras & trigonometry (SOH CAH TOA, sine/cosine rule, area formula), 3D geometry (volume & surface area of sphere, cone, pyramid), transformations, vectors, loci & constructions.
5. PROBABILITY & STATISTICS (10%): Relative frequency, Venn diagrams, tree diagrams (conditional probability), histograms (frequency density), cumulative frequency & box plots, scatter graphs.

FORMATTING RULES:
• Show mark allocations [1 mark] [3 marks] etc.
• Include "Show that..." and "Prove that..." proof questions.
• Explanations must follow AQA mark scheme style: method marks + accuracy marks.`,
  },
  {
    id: 'gcse_english',
    name: 'UK GCSE English Language (AQA)',
    country: '🇬🇧 United Kingdom',
    region: 'uk',
    category: 'UK GCSE',
    gradeRange: 'Grade 9 – Grade 11',
    subject: 'english',
    defaultQuestions: 8,
    defaultTime: 45,
    promptInstruction: `You are a question setter for the UK GCSE English Language examination, modelled on the AQA GCSE English Language specification (8700), with reference to past papers from AQA, Edexcel, and OCR from 2017–2024. Generate an authentic GCSE English Language Paper 1 (Explorations in Creative Reading and Writing) practice paper.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• AQA GCSE English Language Paper 1 Standard — targeting Grade 6–9 students.
• Source Text: Generate a high-quality 600–800 word literary prose extract (published-quality fiction, set in the 20th or 21st century). The text must contain rich descriptive language, narrative tension, character development, and structural techniques.
• Mirror AQA 2019–2024 Paper 1 question structure exactly — same question types, same mark allocations, same assessment objectives (AO1, AO2, AO3, AO5, AO6).

OFFICIAL AQA GCSE ENGLISH LANGUAGE PAPER 1 STRUCTURE:
SECTION A — Reading (40 marks total):
• Question 1 [4 marks, AO1]: List 4 things from lines X–Y. Simple retrieval.
• Question 2 [8 marks, AO2]: How does the writer use language to describe [aspect]? Refer to language techniques (imagery, word choice, sentence structure, tone). Use subject terminology.
• Question 3 [8 marks, AO2]: How does the writer structure the text to interest you as a reader? Consider: paragraph organisation, sentence length variation, narrative perspective shift, opening vs closing.
• Question 4 [20 marks, AO4]: A student says "[evaluative statement about the text]". To what extent do you agree? Evaluate the writer's methods and their effects.

SECTION B — Writing (40 marks total):
• Question 5 [40 marks, AO5+AO6]: Either a descriptive or narrative creative writing task inspired by a stimulus. Choices: "Write a description suggested by this image / atmosphere" OR "Continue a story that opens with [provided opening line]."

FORMATTING RULES:
• Source text must be compelling, original, published-quality literary prose.
• All reading questions must refer to specific line ranges from the source text.
• Band descriptors for writing: include AO5 (content/organisation) and AO6 (vocabulary/grammar/spelling) band guidance in the mark scheme.`,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // USA & CANADA
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'digital_sat_math',
    name: 'Digital SAT Math Section',
    country: '🇺🇸 Global / USA',
    region: 'usa_canada',
    category: 'US College Board',
    gradeRange: 'Grade 9 – Grade 12',
    subject: 'maths',
    defaultQuestions: 22,
    defaultTime: 35,
    promptInstruction: `You are an official US College Board Digital SAT Math test author. Generate an authentic Digital SAT Math section practice paper (Multistage Adaptive Testing format), modelled on actual College Board Digital SAT Math released practice tests (Practice Test 1–6, 2023–2024) available on Khan Academy and College Board.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• US College Board Official Digital SAT Rigor (Includes Section 2 Adaptive Hard-Module Level Challenge Questions).
• Feature multi-step quadratics, exponential modeling, circle equations (x-h)^2 + (y-k)^2 = r^2, right-triangle trig, and Student-Produced Response (Grid-In) numerical entry.
• VISUAL DIAGRAM MANDATE: AT LEAST 40% of questions MUST be visual diagram-based questions containing valid, high-quality inline "svgCode" (coordinate plane parabolas, circle graphs, right triangles, scatter plots, or data tables).
• Reference real SAT Math question styles from College Board 2023–2024 released tests: linear models with real-world context, system of equations from table data, quadratic vertex form application, statistics margin-of-error interpretation.

OFFICIAL DIGITAL SAT MATH DOMAINS (Desmos Graphing Calculator Allowed for All Questions):
1. ALGEBRA (35%): Linear equations in 1 & 2 variables, systems of linear equations, linear inequalities, and interpreting linear models (y = mx + b).
2. ADVANCED MATH (35%): Quadratic equations, vertex form, discriminant, factoring, exponential functions (y = a*b^x), polynomials, and radical expressions.
3. PROBLEM-SOLVING & DATA ANALYSIS (15%): Percentages, ratios, rates, unit conversions, scatter plots, line of best fit, mean/median, standard deviation, and margin of error.
4. GEOMETRY & TRIGONOMETRY (15%): Right triangle trigonometry (sin, cos, tan), Pythagorean theorem, circle equations, arc length, and sector area.

FORMATTING RULES:
• Questions MUST match College Board phrasing, structure, and difficulty calibration.
• Include Student-Produced Response (Grid-In) numerical entry problems alongside multiple-choice.
• 4 options (A, B, C, D) per multiple-choice question.
• Explanations must show both algebraic solution steps and Desmos calculator techniques.`,
  },
  {
    id: 'digital_sat_rw',
    name: 'Digital SAT Reading & Writing',
    country: '🇺🇸 Global / USA',
    region: 'usa_canada',
    category: 'US College Board',
    gradeRange: 'Grade 9 – Grade 12',
    subject: 'english',
    defaultQuestions: 27,
    defaultTime: 32,
    promptInstruction: `You are an official US College Board Digital SAT Reading & Writing test developer. Generate an authentic Digital SAT Reading & Writing module paper, modelled on actual College Board Digital SAT R&W released practice tests (Practice Test 1–6, 2023–2024).

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• US College Board Official Reading & Writing Benchmark Rigor.
• Feature 25–150 word scholarly/scientific passages with advanced academic vocabulary in context, semicolon/colon boundary rules, and rhetorical synthesis note integration.
• Reference authentic Digital SAT R&W 2023–2024 question styles: single-passage vocabulary context questions, paired passage cross-text connection questions, Note Integration "which choice most logically completes the text" questions.

OFFICIAL DIGITAL SAT R&W DOMAINS (1 Short Passage 25–150 words PER Question):
1. CRAFT & STRUCTURE (28%): Words in Context (selecting high-utility academic vocabulary that fits text tone). Text Structure & Purpose (analyzing passage function). Cross-Text Connections (comparing paired short passages).
2. INFORMATION & IDEAS (26%): Central Ideas & Details. Command of Evidence (Textual & Quantitative data chart/table interpretation). Inferences (completing the logical conclusion of a passage).
3. STANDARD ENGLISH CONVENTIONS (26%): Boundaries: Semicolons, colons, em-dashes, comma splices. Form, Structure, & Sense: Subject-verb agreement, pronoun-antecedent agreement, modifier placement.
4. EXPRESSION OF IDEAS (20%): Rhetorical Synthesis (synthesizing provided bullet-point notes to achieve a specified goal) and Transitions (furthermore, however, nevertheless, consequently, for instance).

FORMATTING RULES:
• EVERY single question MUST feature a short 25–150 word self-contained passage, scientific snippet, or data table.
• Exactly 1 question per passage.
• 4 options (A, B, C, D).
• Explanations must cite textual evidence or grammatical rules.`,
  },
  {
    id: 'act_math',
    name: 'ACT Mathematics',
    country: '🇺🇸 USA',
    region: 'usa_canada',
    category: 'US College Admission',
    gradeRange: 'Grade 9 – Grade 12',
    subject: 'maths',
    defaultQuestions: 60,
    defaultTime: 60,
    promptInstruction: `You are a question developer for the ACT Mathematics test, administered by ACT Inc. Generate an authentic ACT Math practice paper modelled on actual 2020–2024 ACT released tests and official ACT Prep Guide practice tests.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• ACT Official Mathematics Section Standard — 60 questions, 60 minutes.
• Questions progress in difficulty: Questions 1–20 (DOK 1–2, straightforward), Questions 21–40 (DOK 2–3, multi-step), Questions 41–60 (DOK 3, challenging and abstract).
• ACT Calculator Permitted throughout (unlike SAT's non-calculator section).
• ACT Trademark: 5 answer choices (A/B/C/D/E for odd-numbered, F/G/H/J/K for even-numbered). Generate in alternating A–E / F–K format as per real ACT.
• Reference authentic ACT 2022–2024 question types: trigonometric identities, logarithm properties, complex numbers (basic), permutations/combinations, geometric sequences.

OFFICIAL ACT MATH CONTENT DOMAINS (60 Questions / 60 Minutes):
1. PREPARING FOR HIGHER MATH (57–60%):
   - Number & Quantity: Rational/irrational numbers, complex numbers (i), matrices (basic operations).
   - Algebra: Linear equations, inequalities, quadratic equations, absolute value, polynomial functions, radical equations, logarithms, exponential equations.
   - Functions: Function notation, inverse functions, piecewise functions, graphical interpretation.
   - Geometry: Right triangle trigonometry, unit circle, sine/cosine graphs (amplitude, period), surface area and volume of 3D figures, coordinate geometry (distance, midpoint, slope).
   - Statistics & Probability: Combinations/permutations, conditional probability, normal distribution, data sets (mean, median, mode, range, standard deviation concept).
2. INTEGRATING ESSENTIAL SKILLS (40–43%): Pre-Algebra and Algebra I-level skills integrated into multi-step problems.
3. MODELING (>25% of questions tagged): Real-world context problems requiring mathematical modelling.

FORMATTING RULES:
• 5 options per question: A/B/C/D/E (odd questions), F/G/H/J/K (even questions).
• Include a note: Calculator permitted.
• Explanations must show complete ACT-style working, including calculator technique where applicable.`,
  },
  {
    id: 'act_science',
    name: 'ACT Science Reasoning',
    country: '🇺🇸 USA',
    region: 'usa_canada',
    category: 'US College Admission',
    gradeRange: 'Grade 9 – Grade 12',
    subject: 'science',
    defaultQuestions: 40,
    defaultTime: 35,
    promptInstruction: `You are a question developer for the ACT Science Reasoning test, administered by ACT Inc. Generate an authentic ACT Science practice paper modelled on actual 2020–2024 ACT released tests and the official ACT Prep Guide.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• ACT Science Standard — 6–7 passages (Data Representation, Research Summaries, Conflicting Viewpoints), 40 questions, 35 minutes.
• Tests scientific reasoning and data analysis skills — NOT scientific knowledge recall. Students do not need to memorise facts; they must interpret data and reasoning.
• Reference authentic ACT Science 2022–2024 passage types: Biology ecology data tables, Physics spring constant F=kx experiments, Chemistry titration curves, Earth Science climate core data.
• Each passage MUST include data in the form of tables, graphs, or diagrams (rendered as inline svgCode).

OFFICIAL ACT SCIENCE PASSAGE TYPES (40 Questions / 35 Minutes):
1. DATA REPRESENTATION (2–3 passages, 5–7 questions each, 38%): Present scientific data in graphs, tables, and diagrams. Questions test reading values, identifying trends, interpolating/extrapolating, and comparing across datasets.
2. RESEARCH SUMMARIES (2–3 passages, 6 questions each, 45%): Describe one or more experiments and their results. Questions test: identifying the purpose of the experiment, understanding experimental design, interpreting results, drawing conclusions.
3. CONFLICTING VIEWPOINTS (1 passage, 7 questions, 17%): Two or more scientists present different hypotheses or viewpoints on the same phenomenon. Questions test: summarising each viewpoint, identifying agreements/disagreements, evaluating evidence strength.

FORMATTING RULES:
• Every passage must include data tables or graphs rendered as svgCode.
• 4 options (A, B, C, D) per question.
• Passages should span Biology, Chemistry, Physics, and Earth/Space Science.
• Explanations must reference the specific data point or graph feature that supports the answer.`,
  },
  {
    id: 'amc8',
    name: 'AMC 8 Mathematics Competition',
    country: '🇺🇸 USA',
    region: 'usa_canada',
    category: 'US Maths Competition',
    gradeRange: 'Grade 5 – Grade 8',
    subject: 'maths',
    defaultQuestions: 25,
    defaultTime: 40,
    promptInstruction: `You are a question setter for the AMC 8 (American Mathematics Competition 8), administered by the Mathematical Association of America (MAA) / Art of Problem Solving for students in Grade 8 and below. Generate an authentic AMC 8 practice paper modelled on actual 2018–2024 AMC 8 official papers.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• MAA AMC 8 Standard — 25 questions, 40 minutes, no calculator.
• Difficulty progression: Questions 1–8 (straightforward, AMC Intro level), Questions 9–16 (moderate, requiring a key insight), Questions 17–25 (challenging, requiring creative problem-solving, multiple insights, and mathematical elegance).
• AMC 8 trademark: Problems that reward mathematical creativity over computational brute force. Include problems with clever "aha moment" solutions.
• Reference actual AMC 8 problems from 2020, 2021, 2022, and 2023 official papers: digit sum puzzles, clock hands angles, overlapping areas, weighted averages, counting paths in grids, geometric probability.
• VISUAL DIAGRAM MANDATE: At least 40% of questions must include inline svgCode geometry figures, grid diagrams, or number line diagrams — exactly as AMC 8 presents them.

OFFICIAL AMC 8 CONTENT AREAS (25 Questions / 40 Minutes — NO CALCULATOR):
1. ARITHMETIC & NUMBER THEORY (20%): Factors, multiples, GCD, LCM, prime factorisation, divisibility, modular arithmetic, digit sums, palindromes.
2. ALGEBRA (20%): Linear equations (one and two variables), simple systems, function evaluation, pattern finding.
3. GEOMETRY (25%): Area and perimeter of polygons and circles, similar triangles, Pythagorean theorem, coordinate geometry (distance, midpoint), angles in polygons, 3D visualisation.
4. COMBINATORICS & PROBABILITY (20%): Counting (permutations, combinations, inclusion-exclusion), tree diagrams, geometric probability, complementary counting.
5. DATA & STATISTICS (15%): Mean, median, mode, range, reading bar/pie charts, stem-and-leaf, data interpretation.

SCORING NOTE: No penalty for wrong answers. All 25 questions worth 1 point each. Maximum score: 25.

FORMATTING RULES:
• 5 answer choices per question: (A), (B), (C), (D), (E) — as per actual AMC format.
• Explanations must reveal the elegant mathematical insight or shortcut used by top AMC scorers.
• Solutions must reference Art of Problem Solving (AoPS) style: elegant, creative, non-brute-force approaches.`,
  },
  {
    id: 'cemc_gauss',
    name: 'CEMC Gauss Contest (Canada/Waterloo)',
    country: '🇨🇦 Canada',
    region: 'usa_canada',
    category: 'Canadian Maths Competition',
    gradeRange: 'Grade 7 – Grade 8',
    subject: 'maths',
    defaultQuestions: 25,
    defaultTime: 60,
    promptInstruction: `You are a question developer for the Gauss Contest, administered by the Centre for Education in Mathematics and Computing (CEMC) at the University of Waterloo, Canada. Generate an authentic Gauss Contest paper (Grade 7 or Grade 8 level) modelled on actual 2018–2024 CEMC Gauss Contest official papers published on the CEMC website.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• CEMC Gauss Contest Standard — accessible top section, challenging bottom section, with elegant solutions.
• Questions progress: Part A (10 questions, straightforward, 5 marks each), Part B (10 questions, multi-step, 6 marks each), Part C (5 questions, challenging, 8 marks each).
• CEMC Gauss trademark: Questions based on real-world Canadian contexts (Canadian geography, currency in Canadian dollars, hockey, maple syrup production, Niagara Falls distances). Problems that have clean integer answers.
• Reference authentic Gauss 2021–2024 questions: ratio problems with tables, consecutive integer puzzles, clock overlap problems, shaded region geometry, pigeonhole-based counting.
• Negative marking: Unanswered questions receive 2 marks (not a penalty); wrong answers receive 0. Encourage risk-taking insight!
• VISUAL DIAGRAM MANDATE: At least 30% of questions must include inline svgCode.

OFFICIAL CEMC GAUSS STRUCTURE (25 Questions / 60 Minutes — Calculator NOT recommended):
• Part A (10 Questions × 5 marks): Straightforward problems, single or double-step reasoning.
• Part B (10 Questions × 6 marks): Multi-step problems requiring clear strategy.
• Part C (5 Questions × 8 marks): Challenging non-routine problems. Creative, elegant solutions.

TOTAL: 150 marks maximum.

FORMATTING RULES:
• 5 answer choices per question: (A), (B), (C), (D), (E).
• Canadian contexts: Canadian dollar (CAD), distances in km, hockey, Tim Hortons references, Canadian provinces.
• Explanations must show the CEMC official solution style: clear, concise, mathematically elegant.`,
  },
  {
    id: 'gmat_focus_quant',
    name: 'GMAT Focus Edition: Quantitative Reasoning',
    country: '🇺🇸 Global / USA',
    region: 'usa_canada',
    category: 'GMAT / Business School Entrance',
    gradeRange: 'University / MBA Applicant',
    subject: 'maths',
    defaultQuestions: 21,
    defaultTime: 45,
    promptInstruction: `You are an official GMAC (Graduate Management Admission Council) test developer for the GMAT Focus Edition (Quantitative Reasoning section). Generate an authentic GMAT Focus Edition Quantitative Reasoning practice paper, modelled on official GMAC Official Guide 2023–2024 and GMAT Focus Official Practice Exams 1–6.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• GMAC GMAT Focus Official Standard — 21 questions, 45 minutes.
• Target Score Calibration: 605–755 GMAT Focus score range (75th–99th percentile difficulty).
• Format: ALL questions are Problem Solving (5 answer choices: A, B, C, D, E). Data Sufficiency has been moved to Data Insights.
• NON-CALCULATOR MANDATE: Onscreen calculator is strictly prohibited in the Quantitative Reasoning section. Mental math, algebraic factorization, and strategic shortcuts are required.
• GMAT Quant Specialty: Deceptively simple word problems with traps (units, constraints, positive integer conditions, zero edge-cases).

OFFICIAL GMAT FOCUS QUANTITATIVE SYLLABUS BREAKDOWN (21 Questions / 45 Minutes):
1. ALGEBRA & FUNCTIONS (50%): Linear & quadratic equations, inequalities (absolute value & quadratic inequalities), exponents & roots, sequence & series, functions & transformations.
2. ARITHMETIC & NUMBER PROPERTIES (50%): Prime factorization, divisibility rules, LCM/GCD, remainders, consecutive integers, ratios & proportions, percentages, averages/weighted averages, work & rate problems, distance/speed/time problems, mixture problems, and set theory (Venn overlaps).

FORMATTING RULES:
• Exactly 5 choices (A, B, C, D, E) per question.
• Every question must specify any variable constraints clearly (e.g. "If x and y are positive integers...").
• Explanations must present both the rigorous algebraic method and the fast GMAT strategy (e.g. Smart Numbers / Backsolving).`,
  },
  {
    id: 'gmat_focus_verbal',
    name: 'GMAT Focus Edition: Verbal Reasoning',
    country: '🇺🇸 Global / USA',
    region: 'usa_canada',
    category: 'GMAT / Business School Entrance',
    gradeRange: 'University / MBA Applicant',
    subject: 'english',
    defaultQuestions: 23,
    defaultTime: 45,
    promptInstruction: `You are an official GMAC (Graduate Management Admission Council) test developer for the GMAT Focus Edition (Verbal Reasoning section). Generate an authentic GMAT Focus Edition Verbal Reasoning practice paper, modelled on GMAC Official Guide 2023–2024 and GMAT Focus Practice Exams 1–6.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• GMAC GMAT Focus Official Standard — 23 questions, 45 minutes.
• Note: Sentence Correction was REMOVED in the Focus Edition. This section consists ONLY of Critical Reasoning (CR) and Reading Comprehension (RC).
• High Academic & Business Rigor: Passages and arguments feature dense academic prose in business strategy, economics, physical science, biological science, and history/social science.

OFFICIAL GMAT FOCUS VERBAL SYLLABUS BREAKDOWN (23 Questions / 45 Minutes):
1. CRITICAL REASONING (approx. 10–12 questions): Short 50–100 word arguments. Question types:
   - Weaken the Argument / Strengthen the Argument
   - Find the Underlying Assumption (Negation Test required)
   - Evaluate the Argument / Method of Reasoning
   - Boldface Argument (Identifying the structural role of two highlighted statements)
   - Draw Conclusion / Must be True / Resolve a Paradox
2. READING COMPREHENSION (approx. 11–13 questions from 3–4 passages): 200–350 word dense scholarly/business passages. Question types:
   - Main Idea / Primary Purpose
   - Supporting Idea / Specific Detail retrieval
   - Inference (What can be logically inferred based on paragraph X?)
   - Application (Applying the author's logic to a new situation)
   - Tone / Attitude / Contextual Vocabulary

FORMATTING RULES:
• 5 choices (A, B, C, D, E) per question.
• Explanations must analyze why the correct option is uniquely valid and why each distractor is wrong (e.g. Out of Scope, Shell Game, Opposite, Extreme).`,
  },
  {
    id: 'gmat_focus_data_insights',
    name: 'GMAT Focus Edition: Data Insights',
    country: '🇺🇸 Global / USA',
    region: 'usa_canada',
    category: 'GMAT / Business School Entrance',
    gradeRange: 'University / MBA Applicant',
    subject: 'critical_thinking',
    defaultQuestions: 20,
    defaultTime: 45,
    promptInstruction: `You are an official GMAC (Graduate Management Admission Council) test developer for the GMAT Focus Edition (Data Insights section). Generate an authentic GMAT Focus Edition Data Insights practice paper, modelled on GMAC Official Guide Data Insights 2023–2024.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• GMAC GMAT Focus Official Standard — 20 questions, 45 minutes.
• An onscreen calculator IS ALLOWED for Data Insights.
• Tests data literacy, statistical synthesis, and decision analysis required for modern management consulting and executive roles.

OFFICIAL GMAT FOCUS DATA INSIGHTS QUESTION TYPES (20 Questions / 45 Minutes):
1. DATA SUFFICIENCY (approx. 5–6 questions): Quantitative & algebraic statements. Determine if Statement (1) alone, Statement (2) alone, both together, or neither is sufficient to answer the question.
   - Option A: Statement (1) ALONE is sufficient, but statement (2) alone is not.
   - Option B: Statement (2) ALONE is sufficient, but statement (1) alone is not.
   - Option C: BOTH statements TOGETHER are sufficient, but NEITHER statement alone is sufficient.
   - Option D: EACH statement ALONE is sufficient.
   - Option E: Statements (1) and (2) TOGETHER are NOT sufficient.
2. GRAPHICS INTERPRETATION & TABLE ANALYSIS (approx. 5–6 questions): Analyzing complex line graphs, scatter plots with regression lines, pie charts, and sortable data tables (rendered as inline svgCode or markdown tables).
3. MULTI-SOURCE REASONING & TWO-PART ANALYSIS (approx. 8–9 questions): Synthesizing information across 2–3 tabs (e.g. email memo, strategy report, financial statement) or evaluating two dependent variables in a grid table.

FORMATTING RULES:
• Include Data Sufficiency standard A/B/C/D/E options.
• Provide SVG code or clear markdown tables for visual data questions.
• Explanations must give step-by-step mathematical or logical validation.`,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // ASIA & INTERNATIONAL
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'seamo',
    name: 'SEAMO (SE Asian Maths Olympiad)',
    country: '🌏 SE Asia',
    region: 'asia_intl',
    category: 'International Olympiad',
    gradeRange: 'Grade 1 – Grade 10',
    subject: 'maths',
    defaultQuestions: 25,
    defaultTime: 90,
    promptInstruction: `You are a question setter for SEAMO (South East Asian Mathematical Olympiad), a prestigious mathematics competition spanning 20+ countries including Singapore, Malaysia, Philippines, Thailand, Indonesia, Vietnam, and Myanmar. Generate an authentic SEAMO paper modelled on actual 2018–2024 SEAMO official papers for the target paper level (Paper A for Grade 1–2 through Paper F for Grade 9–10).

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• SEAMO International Olympiad Standard — Gold Medal level difficulty in the final 5 questions.
• Questions must emphasise elegant mathematical reasoning, creativity, and non-routine approaches over computational speed.
• SEAMO trademark: Section 1 (Multiple Choice — 20 questions, 2 points each), Section 2 (Open-Ended Short Answer — 5 questions, 4 points each, partial credit with working).
• Reference actual SEAMO 2021–2024 question types: systematic listing, number patterns, angle chasing in circles, area ratio in dissected triangles, modular arithmetic puzzles, logic grid deductions.
• VISUAL DIAGRAM MANDATE: At least 50% of questions must include inline svgCode geometry, grid, or table diagrams.

OFFICIAL SEAMO STRUCTURE (25 Questions / 90 Minutes — NO CALCULATOR):
• Section 1 — Multiple Choice (20 questions × 2 points): 4 or 5 options. Cover arithmetic, algebra, geometry, combinatorics, logic.
• Section 2 — Open-Ended (5 questions × 4 points): Non-routine problems requiring creative insight. Partial marks (2 marks) for correct method with arithmetic error.

CURRICULUM ALIGNMENT:
• Questions are accessible across different national curricula (Singapore, Malaysian, Thai, Philippine mathematics syllabi).
• Use neutral international contexts or South East Asian contexts (Songkran Festival, Bali temples, Philippine rice terraces, Singapore skyline).

FORMATTING RULES:
• Section 1: 4–5 options per question.
• Section 2: Short answer (no options), include working space indication.
• Explanations must show elegant, creative solution methods preferred in Olympiad tradition.`,
  },
  {
    id: 'sasmo',
    name: 'SASMO (Singapore & Asian Schools Math)',
    country: '🌏 Asia (50+ Countries)',
    region: 'asia_intl',
    category: 'International Olympiad',
    gradeRange: 'Grade 2 – Grade 10',
    subject: 'maths',
    defaultQuestions: 25,
    defaultTime: 75,
    promptInstruction: `You are a question setter for SASMO (Singapore and Asian Schools Math Olympiad), an international mathematics competition held in 50+ countries, administered by SIMCC (Singapore International Math Contests Centre). Generate an authentic SASMO paper modelled on actual 2019–2024 SASMO official papers at the target grade level.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• SASMO International Gold Standard — difficulty significantly above regular school curriculum, targeting the top 40% of students.
• SASMO trademark structure: Section 1 (15 MCQ, 3 points each), Section 2 (10 Short Answer, 4 points each), with a distinct difficulty ramp.
• NO PENALTY for wrong MCQ answers; −1 mark for blank answers (to discourage guessing).
• Reference authentic SASMO 2022–2024 question types: systematic counting using multiplication principle, before-after fraction transfer, circle inscribed in square area problems, code-breaking sequence logic, consecutive sum number theory.
• VISUAL DIAGRAM MANDATE: At least 40% of questions must include inline svgCode.

OFFICIAL SASMO STRUCTURE (25 Questions / 75 Minutes — NO CALCULATOR):
• Section 1 — MCQ (15 questions × 3 points): 4 options. No penalty for wrong, −1 for blank.
• Section 2 — Short Answer (10 questions × 4 points): Integer answers 000–999. Show working encouraged. Partial credit not awarded but full working reviewed.

Difficulty: Section 2 Q21–25 should be HOTS challenge questions targeting SASMO Gold/Silver medal students.

CURRICULUM ALIGNMENT:
• Aligned with Singapore MOE Primary/Secondary Mathematics Syllabus as the benchmark, adaptable for international students at the same grade level.
• Use diverse Asian-international contexts (Chinese New Year, Hari Raya, Diwali, international mathematics classroom).

FORMATTING RULES:
• Section 1: 4 options (A, B, C, D). −1 for blank.
• Section 2: Short integer answer.
• Explanations must show the elegant reasoning pathway and key insight.`,
  },
  {
    id: 'amo',
    name: 'AMO Asia Mathematical Olympiad',
    country: '🌏 Asia (35+ Countries)',
    region: 'asia_intl',
    category: 'International Olympiad',
    gradeRange: 'Grade 3 – Grade 12',
    subject: 'maths',
    defaultQuestions: 20,
    defaultTime: 90,
    promptInstruction: `You are a question setter for AMO (Asia Mathematical Olympiad), an elite international mathematics competition spanning 35+ countries in Asia and globally, hosted by SIMCC (Singapore International Math Contests Centre) and partner organizations. Generate an authentic AMO paper modelled on actual 2019–2024 AMO official papers at the Intermediate/Advanced level.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• AMO Elite Olympiad Standard — highest difficulty tier among SIMCC competitions. Questions at this level challenge even national team training students.
• AMO trademark: 15 MCQ (3 marks each), 5 Open-Ended Challenge problems (10 marks each, partial credit for method).
• Challenge problems (Q16–20) must require multi-concept integration: combinatorial geometry, number theory with modular arithmetic, functional equations, or graph theory.
• Reference authentic AMO 2021–2024 question styles: classic Olympiad combinatorics (coloring, pigeonhole), elegant number theory (Diophantine equations, GCD properties), geometry (angle chasing, trigonometric identities, coordinate geometry proofs).
• VISUAL DIAGRAM MANDATE: At least 50% of questions must include inline svgCode for geometry, combinatorics diagrams, or number theory tables.

OFFICIAL AMO STRUCTURE (20 Questions / 90 Minutes — NO CALCULATOR):
• Section 1 — MCQ (15 questions × 3 marks): 4 options. No negative marking. Creative problem-solving.
• Section 2 — Open-Ended Challenge (5 questions × 10 marks): Partial credit awarded for correct method. Full working required.

LEVEL-APPROPRIATE CONTENT:
• Primary Level (Grade 3–6): Number theory (primes, factors), combinatorics (arrangements, Pascal's triangle), geometry (area ratios).
• Junior Level (Grade 7–9): Algebra (Vieta's formulas, functional equations), advanced combinatorics, circle theorems.
• Intermediate Level (Grade 10–12): Olympiad-level proofs, complex number geometry, polynomial theory, graph theory.

FORMATTING RULES:
• Section 1: 4 options (A, B, C, D).
• Section 2: Full working required. Partial credit for method marks.
• Explanations must be at an olympiad solution standard: elegant, complete, citing key theorems (e.g. Pigeonhole, AM-GM, Fermat's Little Theorem).`,
  },
,
  {
    id: 'gate_wa',
    name: 'GATE (Gifted and Talented Education)',
    country: '🇦🇺 Australia',
    region: 'australia',
    category: 'Selective Entry',
    gradeRange: 'Grade 6',
    subject: 'maths',
    defaultQuestions: 35,
    defaultTime: 45,
    promptInstruction: `You are an elite academic assessment designer specializing in high-stakes scholarship and selective entry exams.

I am creating an educational app that prepares students for the **GATE (Gifted and Talented Education)** (Australia).

Generate a highly rigorous, master-level practice paper based on the following details:

Subject / Exam: GATE (Gifted and Talented Education)
Grade: {GRADE}
Topic: {TOPIC}
Difficulty Level: {DIFFICULTY}
Number of Questions: {QUESTION_COUNT}

Instructions:

- CALIBRATION: Calibrate all questions against official past-year released examination papers for the GATE (Gifted and Talented Education) for the selected grade level. Match the exact cognitive depth, trick questions, distractors, and pacing expectations of the real exam.
- FRESHNESS GUARDRAIL: Generate completely unique, never-before-seen questions every time this prompt runs. Do not recycle standard examples. Use novel scenarios, varied names, and fresh data sets.
- ANSWER DISTRIBUTION: Randomize the correct answer options (A, B, C, D) evenly across the test so there is no predictable pattern.
- ZERO HALLUCINATIONS: Guarantee 100% mathematical, logical, and factual accuracy. 
- ZERO ANSWER LEAKING: NEVER leak or reveal the correct answer inside the question text stem!
- DIAGRAMMATIC & SPATIAL REASONING: If the exam format involves non-verbal, spatial, or diagrammatic reasoning, you MUST include questions that describe geometric patterns, folding paper, matrices, or visual sequences using highly descriptive text (e.g. "Imagine a 3x3 grid...").
- PROGRESSIVE DIFFICULTY: Questions should progressively increase in difficulty, ending with the hardest discriminator questions used to separate the top 1% of students.
- QUESTION TYPES: Strictly use the question formats native to the GATE (Gifted and Talented Education). Include multiple-choice questions with highly plausible distractors.

Output ONLY the practice paper content.`,
  },
  {
    id: 'oc_nsw',
    name: 'Opportunity Class (OC) Test',
    country: '🇦🇺 Australia',
    region: 'australia',
    category: 'Gifted Placement',
    gradeRange: 'Grade 4 - Grade 5',
    subject: 'maths',
    defaultQuestions: 35,
    defaultTime: 40,
    promptInstruction: `You are an elite academic assessment designer specializing in high-stakes scholarship and selective entry exams.

I am creating an educational app that prepares students for the **Opportunity Class (OC) Placement Test** (Australia).

Generate a highly rigorous, master-level practice paper based on the following details:

Subject / Exam: Opportunity Class (OC) Placement Test
Grade: {GRADE}
Topic: {TOPIC}
Difficulty Level: {DIFFICULTY}
Number of Questions: {QUESTION_COUNT}

Instructions:

- CALIBRATION: Calibrate all questions against official past-year released examination papers for the Opportunity Class (OC) Placement Test for the selected grade level. Match the exact cognitive depth, trick questions, distractors, and pacing expectations of the real exam.
- FRESHNESS GUARDRAIL: Generate completely unique, never-before-seen questions every time this prompt runs. Do not recycle standard examples. Use novel scenarios, varied names, and fresh data sets.
- ANSWER DISTRIBUTION: Randomize the correct answer options (A, B, C, D) evenly across the test so there is no predictable pattern.
- ZERO HALLUCINATIONS: Guarantee 100% mathematical, logical, and factual accuracy. 
- ZERO ANSWER LEAKING: NEVER leak or reveal the correct answer inside the question text stem!
- DIAGRAMMATIC & SPATIAL REASONING: If the exam format involves non-verbal, spatial, or diagrammatic reasoning, you MUST include questions that describe geometric patterns, folding paper, matrices, or visual sequences using highly descriptive text (e.g. "Imagine a 3x3 grid...").
- PROGRESSIVE DIFFICULTY: Questions should progressively increase in difficulty, ending with the hardest discriminator questions used to separate the top 1% of students.
- QUESTION TYPES: Strictly use the question formats native to the Opportunity Class (OC) Placement Test. Include multiple-choice questions with highly plausible distractors.

Output ONLY the practice paper content.`,
  },
  {
    id: 'iseb_pre_test',
    name: 'ISEB Common Pre-Test',
    country: '🇬🇧 United Kingdom',
    region: 'uk',
    category: 'Independent Entry',
    gradeRange: 'Grade 5 - Grade 7',
    subject: 'english',
    defaultQuestions: 40,
    defaultTime: 50,
    promptInstruction: `You are an elite academic assessment designer specializing in high-stakes scholarship and selective entry exams.

I am creating an educational app that prepares students for the **ISEB Common Pre-Test** (United Kingdom).

Generate a highly rigorous, master-level practice paper based on the following details:

Subject / Exam: ISEB Common Pre-Test
Grade: {GRADE}
Topic: {TOPIC}
Difficulty Level: {DIFFICULTY}
Number of Questions: {QUESTION_COUNT}

Instructions:

- CALIBRATION: Calibrate all questions against official past-year released examination papers for the ISEB Common Pre-Test for the selected grade level. Match the exact cognitive depth, trick questions, distractors, and pacing expectations of the real exam.
- FRESHNESS GUARDRAIL: Generate completely unique, never-before-seen questions every time this prompt runs. Do not recycle standard examples. Use novel scenarios, varied names, and fresh data sets.
- ANSWER DISTRIBUTION: Randomize the correct answer options (A, B, C, D) evenly across the test so there is no predictable pattern.
- ZERO HALLUCINATIONS: Guarantee 100% mathematical, logical, and factual accuracy. 
- ZERO ANSWER LEAKING: NEVER leak or reveal the correct answer inside the question text stem!
- DIAGRAMMATIC & SPATIAL REASONING: If the exam format involves non-verbal, spatial, or diagrammatic reasoning, you MUST include questions that describe geometric patterns, folding paper, matrices, or visual sequences using highly descriptive text (e.g. "Imagine a 3x3 grid...").
- PROGRESSIVE DIFFICULTY: Questions should progressively increase in difficulty, ending with the hardest discriminator questions used to separate the top 1% of students.
- QUESTION TYPES: Strictly use the question formats native to the ISEB Common Pre-Test. Include multiple-choice questions with highly plausible distractors.

Output ONLY the practice paper content.`,
  },
  {
    id: 'ssat_us',
    name: 'SSAT (Secondary School Admission Test)',
    country: '🇺🇸 United States',
    region: 'usa_canada',
    category: 'Private School Entry',
    gradeRange: 'Grade 3 - Grade 11',
    subject: 'maths',
    defaultQuestions: 50,
    defaultTime: 60,
    promptInstruction: `You are an elite academic assessment designer specializing in high-stakes scholarship and selective entry exams.

I am creating an educational app that prepares students for the **SSAT (Secondary School Admission Test)** (United States).

Generate a highly rigorous, master-level practice paper based on the following details:

Subject / Exam: SSAT (Secondary School Admission Test)
Grade: {GRADE}
Topic: {TOPIC}
Difficulty Level: {DIFFICULTY}
Number of Questions: {QUESTION_COUNT}

Instructions:

- CALIBRATION: Calibrate all questions against official past-year released examination papers for the SSAT (Secondary School Admission Test) for the selected grade level. Match the exact cognitive depth, trick questions, distractors, and pacing expectations of the real exam.
- FRESHNESS GUARDRAIL: Generate completely unique, never-before-seen questions every time this prompt runs. Do not recycle standard examples. Use novel scenarios, varied names, and fresh data sets.
- ANSWER DISTRIBUTION: Randomize the correct answer options (A, B, C, D) evenly across the test so there is no predictable pattern.
- ZERO HALLUCINATIONS: Guarantee 100% mathematical, logical, and factual accuracy. 
- ZERO ANSWER LEAKING: NEVER leak or reveal the correct answer inside the question text stem!
- DIAGRAMMATIC & SPATIAL REASONING: If the exam format involves non-verbal, spatial, or diagrammatic reasoning, you MUST include questions that describe geometric patterns, folding paper, matrices, or visual sequences using highly descriptive text (e.g. "Imagine a 3x3 grid...").
- PROGRESSIVE DIFFICULTY: Questions should progressively increase in difficulty, ending with the hardest discriminator questions used to separate the top 1% of students.
- QUESTION TYPES: Strictly use the question formats native to the SSAT (Secondary School Admission Test). Include multiple-choice questions with highly plausible distractors.

Output ONLY the practice paper content.`,
  },
  {
    id: 'isee_us',
    name: 'ISEE (Independent School Entrance Exam)',
    country: '🇺🇸 United States',
    region: 'usa_canada',
    category: 'Private School Entry',
    gradeRange: 'Grade 2 - Grade 12',
    subject: 'maths',
    defaultQuestions: 45,
    defaultTime: 55,
    promptInstruction: `You are an elite academic assessment designer specializing in high-stakes scholarship and selective entry exams.

I am creating an educational app that prepares students for the **ISEE (Independent School Entrance Exam)** (United States).

Generate a highly rigorous, master-level practice paper based on the following details:

Subject / Exam: ISEE (Independent School Entrance Exam)
Grade: {GRADE}
Topic: {TOPIC}
Difficulty Level: {DIFFICULTY}
Number of Questions: {QUESTION_COUNT}

Instructions:

- CALIBRATION: Calibrate all questions against official past-year released examination papers for the ISEE (Independent School Entrance Exam) for the selected grade level. Match the exact cognitive depth, trick questions, distractors, and pacing expectations of the real exam.
- FRESHNESS GUARDRAIL: Generate completely unique, never-before-seen questions every time this prompt runs. Do not recycle standard examples. Use novel scenarios, varied names, and fresh data sets.
- ANSWER DISTRIBUTION: Randomize the correct answer options (A, B, C, D) evenly across the test so there is no predictable pattern.
- ZERO HALLUCINATIONS: Guarantee 100% mathematical, logical, and factual accuracy. 
- ZERO ANSWER LEAKING: NEVER leak or reveal the correct answer inside the question text stem!
- DIAGRAMMATIC & SPATIAL REASONING: If the exam format involves non-verbal, spatial, or diagrammatic reasoning, you MUST include questions that describe geometric patterns, folding paper, matrices, or visual sequences using highly descriptive text (e.g. "Imagine a 3x3 grid...").
- PROGRESSIVE DIFFICULTY: Questions should progressively increase in difficulty, ending with the hardest discriminator questions used to separate the top 1% of students.
- QUESTION TYPES: Strictly use the question formats native to the ISEE (Independent School Entrance Exam). Include multiple-choice questions with highly plausible distractors.

Output ONLY the practice paper content.`,
  },
  {
    id: 'cogat_us',
    name: 'CogAT (Cognitive Abilities Test)',
    country: '🇺🇸 United States',
    region: 'usa_canada',
    category: 'Gifted Program',
    gradeRange: 'Grade K - Grade 12',
    subject: 'logical_reasoning',
    defaultQuestions: 40,
    defaultTime: 45,
    promptInstruction: `You are an elite academic assessment designer specializing in high-stakes scholarship and selective entry exams.

I am creating an educational app that prepares students for the **CogAT (Cognitive Abilities Test)** (United States).

Generate a highly rigorous, master-level practice paper based on the following details:

Subject / Exam: CogAT (Cognitive Abilities Test)
Grade: {GRADE}
Topic: {TOPIC}
Difficulty Level: {DIFFICULTY}
Number of Questions: {QUESTION_COUNT}

Instructions:

- CALIBRATION: Calibrate all questions against official past-year released examination papers for the CogAT (Cognitive Abilities Test) for the selected grade level. Match the exact cognitive depth, trick questions, distractors, and pacing expectations of the real exam.
- FRESHNESS GUARDRAIL: Generate completely unique, never-before-seen questions every time this prompt runs. Do not recycle standard examples. Use novel scenarios, varied names, and fresh data sets.
- ANSWER DISTRIBUTION: Randomize the correct answer options (A, B, C, D) evenly across the test so there is no predictable pattern.
- ZERO HALLUCINATIONS: Guarantee 100% mathematical, logical, and factual accuracy. 
- ZERO ANSWER LEAKING: NEVER leak or reveal the correct answer inside the question text stem!
- DIAGRAMMATIC & SPATIAL REASONING: If the exam format involves non-verbal, spatial, or diagrammatic reasoning, you MUST include questions that describe geometric patterns, folding paper, matrices, or visual sequences using highly descriptive text (e.g. "Imagine a 3x3 grid...").
- PROGRESSIVE DIFFICULTY: Questions should progressively increase in difficulty, ending with the hardest discriminator questions used to separate the top 1% of students.
- QUESTION TYPES: Strictly use the question formats native to the CogAT (Cognitive Abilities Test). Include multiple-choice questions with highly plausible distractors.

Output ONLY the practice paper content.`,
  },
  {
    id: 'shsat_us',
    name: 'SHSAT (Specialized High Schools Admissions Test)',
    country: '🇺🇸 United States',
    region: 'usa_canada',
    category: 'Selective High School',
    gradeRange: 'Grade 8 - Grade 9',
    subject: 'maths',
    defaultQuestions: 57,
    defaultTime: 90,
    promptInstruction: `You are an elite academic assessment designer specializing in high-stakes scholarship and selective entry exams.

I am creating an educational app that prepares students for the **SHSAT (Specialized High Schools Admissions Test)** (United States).

Generate a highly rigorous, master-level practice paper based on the following details:

Subject / Exam: SHSAT (Specialized High Schools Admissions Test)
Grade: {GRADE}
Topic: {TOPIC}
Difficulty Level: {DIFFICULTY}
Number of Questions: {QUESTION_COUNT}

Instructions:

- CALIBRATION: Calibrate all questions against official past-year released examination papers for the SHSAT (Specialized High Schools Admissions Test) for the selected grade level. Match the exact cognitive depth, trick questions, distractors, and pacing expectations of the real exam.
- FRESHNESS GUARDRAIL: Generate completely unique, never-before-seen questions every time this prompt runs. Do not recycle standard examples. Use novel scenarios, varied names, and fresh data sets.
- ANSWER DISTRIBUTION: Randomize the correct answer options (A, B, C, D) evenly across the test so there is no predictable pattern.
- ZERO HALLUCINATIONS: Guarantee 100% mathematical, logical, and factual accuracy. 
- ZERO ANSWER LEAKING: NEVER leak or reveal the correct answer inside the question text stem!
- DIAGRAMMATIC & SPATIAL REASONING: If the exam format involves non-verbal, spatial, or diagrammatic reasoning, you MUST include questions that describe geometric patterns, folding paper, matrices, or visual sequences using highly descriptive text (e.g. "Imagine a 3x3 grid...").
- PROGRESSIVE DIFFICULTY: Questions should progressively increase in difficulty, ending with the hardest discriminator questions used to separate the top 1% of students.
- QUESTION TYPES: Strictly use the question formats native to the SHSAT (Specialized High Schools Admissions Test). Include multiple-choice questions with highly plausible distractors.

Output ONLY the practice paper content.`,
  }
];

export const getNaplanDefaults = (presetId, grade) => {
  const g = parseInt(String(grade || '').replace(/\D/g, ''), 10) || 5;

  if (presetId === 'naplan_numeracy') {
    if (g <= 3) return { questions: 35, time: 45 };
    if (g <= 5) return { questions: 40, time: 50 };
    if (g <= 7) return { questions: 48, time: 60 };
    return { questions: 48, time: 60 };
  }

  if (presetId === 'naplan_reading') {
    if (g <= 3) return { questions: 30, time: 45 };
    if (g <= 5) return { questions: 35, time: 50 };
    if (g <= 7) return { questions: 38, time: 50 };
    return { questions: 40, time: 50 };
  }

  if (presetId === 'naplan_conventions') {
    if (g <= 3) return { questions: 35, time: 45 };
    if (g <= 5) return { questions: 40, time: 45 };
    if (g <= 7) return { questions: 45, time: 45 };
    return { questions: 45, time: 45 };
  }

  return null;
};
