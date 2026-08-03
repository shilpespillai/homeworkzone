export const INTERNATIONAL_EXAMS = [
  {
    id: 'nsw_selective_thinking',
    name: 'NSW Selective: Thinking Skills',
    country: '🇦🇺 Australia',
    category: 'Selective Schools',
    gradeRange: 'Grade 5 - Grade 6',
    subject: 'critical_thinking',
    defaultQuestions: 40,
    defaultTime: 40,
    promptInstruction: `You are an official test author for the NSW Selective High School Placement Test (delivered via the Janison digital assessment platform).

Generate an authentic, computer-based 'Thinking Skills' examination paper for Year 7 entry.

OFFICIAL SYLLABUS & DOMAIN BREAKDOWN (40 Questions / 40 Minutes):
1. LOGICAL REASONING (30%):
   - Deductive and inductive reasoning, identifying valid vs. invalid argument structures.
   - Knights & Knaves (truth-tellers vs. liars) scenarios, seating arrangements, and multi-variable logic elimination.
   - Conditional logic: Testing converse fallacies (If P then Q != If Q then P), contrapositives, and inverses.

2. IDENTIFYING FLAWS & ASSUMPTIONS (25%):
   - Short 40-70 word debate scenarios containing classical logical fallacies (Correlation vs. Causation, Straw Man, Ad Hominem, Over-generalization, Slippery Slope).
   - Identifying implicit unstated assumptions necessary for an argument's conclusion to hold true.

3. EVALUATING EVIDENCE & ARGUMENTS (25%):
   - Passages presenting a central claim with 4 candidate supporting or weakening statements.
   - Assessing which statement MOST strengthens or MOST weakens the argument.
   - Perspective & Point of View Analysis: Identifying underlying motives, bias, or unstated perspectives in 2-person debate arguments.

4. SPATIAL & DATA-BASED LOGIC PUZZLES (20%):
   - 3-Set Venn diagram overlap calculations, pattern rule extensions, decision tree networks, and truth-table state analysis.

FORMATTING & DISTRACTOR RULES:
• Every question MUST present a realistic 30-70 word scenario or logic puzzle.
• Provide exactly 4 options (A, B, C, D).
• Distractor traps MUST incorporate common reasoning fallacies (e.g. affirming the consequent, ignoring counter-evidence).
• Provide a step-by-step logical proof in the solution explanation for each question.`
  },
  {
    id: 'nsw_selective_math',
    name: 'NSW Selective: Mathematical Reasoning',
    country: '🇦🇺 Australia',
    category: 'Selective Schools',
    gradeRange: 'Grade 5 - Grade 6',
    subject: 'maths',
    defaultQuestions: 35,
    defaultTime: 40,
    promptInstruction: `You are an official test developer for the NSW Selective High School Placement Test (Mathematical Reasoning section).

Generate an authentic Mathematical Reasoning examination paper for Year 7 entry.

OFFICIAL SYLLABUS & DOMAIN BREAKDOWN (35 Questions / 40 Minutes - NO CALCULATORS PERMITTED):
1. NUMBER & ALGEBRA (40%):
   - Multi-step non-routine word problems, numerical sequences, and pattern rules.
   - Operations with fractions, decimals, percentages, ratios, and proportion heuristics (e.g. before-and-after ratio transfers).
   - Consecutive integer sums, Gauss summation methods, divisibility rules (2, 3, 5, 9, 10, 11), LCM/GCD word problems, and finding unit digits of large products.
   - Speed, Distance, Time & Rate Problems (e.g. catch-up travel rates, filling/draining tank rates) and In/Out Algebraic Function Machines.

2. MEASUREMENT & GEOMETRY (35%):
   - Perimeter and area of compound L-shaped figures, shaded regions of inscribed circles, squares, and right triangles.
   - Angle geometry involving parallel line transversals, interior/exterior polygon sums, and spatial 3D block net visualisations.

3. STATISTICS & PROBABILITY (25%):
   - Data-based word problems, multi-bar graphs, pie charts, mean/median/range calculations, and probability combinations.

FORMATTING & DISTRACTOR RULES:
• Calculators are STRICTLY PROHIBITED — questions must reward clever mental strategy over tedious calculation.
• Provide 4 options (A, B, C, D). Distractors must target common student errors (e.g. forgetting to halve a triangle area, miscalculating ratio parts).
• Include clear step-by-step mathematical working in the solution explanation.`
  },
  {
    id: 'vic_selective_entry',
    name: 'Victorian Selective Entry (ACER Pattern)',
    country: '🇦🇺 Australia',
    category: 'Selective Schools',
    gradeRange: 'Grade 8 - Grade 9',
    subject: 'critical_thinking',
    defaultQuestions: 35,
    defaultTime: 30,
    promptInstruction: `You are an ACER (Australian Council for Educational Research) exam author creating the Victorian Selective Entry High School Exam (Melbourne High, Mac.Robertson, Nossal, Suzanne Cory).

Generate an authentic ACER-pattern General Ability (Verbal, Reading & Quantitative Reasoning) examination paper for Year 9 entry.

OFFICIAL SYLLABUS & DOMAIN BREAKDOWN (NO CALCULATORS ALLOWED):
1. VERBAL REASONING & COMPREHENSION (50%):
   - Complex Word Analogies (A : B :: C : ?), word relationships, and vocabulary in context.
   - Letter-Code Cracking (alphabetical shift rules & cipher patterns).
   - Deductive Syllogisms, statement assumptions, and odd-word-out categorization.
   - Reading Comprehension & Humanities Reasoning: Analyzing short prose or poetry passages for central theme, tone, author intent, and inference.

2. QUANTITATIVE REASONING (50%):
   - Numerical series completion, matrix pattern deduction, and shape-symbol equations.
   - High-speed rate, time, distance, fuel consumption, and financial percentage change calculations.
   - Geometric spatial logic & visual matrix transformations.

FORMATTING RULES:
• Questions must test rapid pattern recognition under extreme time pressure (< 50 seconds per question).
• Provide 4 options (A, B, C, D) per question.
• Explanations must clearly state the exact transformation rule or algebraic formula.`
  },
  {
    id: 'icas_math',
    name: 'ICAS Mathematics (UNSW)',
    country: '🌏 International',
    category: 'ICAS Competition',
    gradeRange: 'Grade 2 - Grade 12',
    subject: 'maths',
    defaultQuestions: 35,
    defaultTime: 45,
    promptInstruction: `You are a UNSW Educational Assessment Australia (EAA) ICAS Mathematics exam setter.

Generate an authentic ICAS Mathematics competition paper testing deep problem-solving, mathematical creativity, and non-routine logic.

OFFICIAL ICAS SYLLABUS BREAKDOWN:
1. HIGH-ORDER PROBLEM SOLVING (30%):
   - Combinatorics: Permutations, combinations, path counting on grid networks, and Pigeonhole Principle application.
2. SPATIAL & GRAPHICAL VISUALIZATION (25%):
   - Nets of 3D solids, rotational symmetry, visible vs. hidden cube stacks, and shaded region grid geometry.
3. NUMBER PATTERNS & ALGEBRA (25%):
   - Modular arithmetic cycles, sequence patterns, and Alphametic (cryptarithm arithmetic addition/multiplication) puzzles.
4. DATA & CHANCE (20%):
   - Probability tree diagrams, 3-set Venn diagrams, and stem-and-leaf interpretation.
5. ADVANCED CHALLENGE SECTION (SECTION C):
   - Include 3-5 multi-step Olympiad-style questions designed to test top 1% distinction students.

FORMATTING RULES:
• Questions must range from moderate to highly challenging.
• 4 options (A, B, C, D) per question with plausible distractor traps.
• Explanations must detail the problem-solving strategy and elegant solution path.`
  },
  {
    id: 'icas_science',
    name: 'ICAS Science (UNSW)',
    country: '🌏 International',
    category: 'ICAS Competition',
    gradeRange: 'Grade 2 - Grade 12',
    subject: 'science',
    defaultQuestions: 30,
    defaultTime: 45,
    promptInstruction: `You are a lead test developer for ICAS Science (UNSW Global).

Generate an authentic ICAS Science examination paper focused strictly on scientific inquiry and experimental analysis.

OFFICIAL ICAS SCIENCE SYLLABUS BREAKDOWN:
1. EXPERIMENTAL DESIGN & VARIABLES (35%):
   - Identifying Independent, Dependent, and Controlled variables in a described experiment.
   - Evaluating experimental controls, fair testing principles, and sources of experimental error or bias.

2. DATA INTERPRETATION & GRAPH ANALYSIS (35%):
   - Line graphs, dual-axis bar charts, scatter plots, and complex data tables representing scientific phenomena.
   - Interpolating and extrapolating values from experimental data.
   - Scientific Apparatus & Measurement Calibration: Reading meniscus levels in measuring cylinders, microscope magnification calculations, and spring balance zero-error adjustments.

3. HYPOTHESIS & SCIENTIFIC REASONING (30%):
   - Evaluating whether data supports or refutes a given hypothesis using Claim-Evidence-Reasoning (CER).
   - Cause-and-effect reasoning across Biology, Physics, Chemistry, and Earth/Space Science.

FORMATTING RULES:
• EVERY question MUST present a realistic 40-80 word scenario describing an experiment, data table, or graph.
• 4 options (A, B, C, D) per question.
• Explanations must break down the scientific method and data interpretation step-by-step.`
  },
  {
    id: 'icas_digital_tech',
    name: 'ICAS Digital Technologies (UNSW)',
    country: '🌏 International',
    category: 'ICAS Competition',
    gradeRange: 'Grade 3 - Grade 10',
    subject: 'computer_science',
    defaultQuestions: 30,
    defaultTime: 45,
    promptInstruction: `You are an author for ICAS Digital Technologies (UNSW Educational Assessment Australia).

Generate an authentic ICAS Digital Technologies paper testing computer science and computational thinking concepts.

OFFICIAL ICAS DIGITAL TECH SYLLABUS BREAKDOWN:
1. ALGORITHMS & PSEUDOCODE (35%):
   - Tracing loops (FOR, WHILE), IF-ELSE conditionals, and variable state changes in pseudocode blocks.
   - Flowchart symbols, decision diamonds, and algorithmic logic tracking.

2. DATA REPRESENTATION & BINARY (25%):
   - Binary code, bit/byte conversions, hexadecimal colors (#FF0000), ASCII encoding, and lossy vs. lossless compression.

3. HARDWARE, NETWORKS & DATABASES (20%):
   - CPU, RAM, storage, input/output devices, IP addresses, routers, packets, DNS, and HTTP/HTTPS protocols.
   - Database Queries & Web Tech: Relational tables, basic SQL logic (SELECT, WHERE, ORDER BY), and HTML tag/CSS selector structure.

4. CYBERSECURITY & DIGITAL SAFETY (20%):
   - Phishing detection, password hashing, encryption principles, and digital footprints.

FORMATTING RULES:
• Include realistic pseudocode snippets, SQL queries, and network scenario descriptions.
• 4 options (A, B, C, D) per question.
• Explanations must trace pseudocode execution line-by-line.`
  },
  {
    id: 'naplan_numeracy',
    name: 'NAPLAN Numeracy Practice',
    country: '🇦🇺 Australia',
    category: 'National Assessment',
    gradeRange: 'Grade 3, 5, 7, 9',
    subject: 'maths',
    defaultQuestions: 32,
    defaultTime: 45,
    promptInstruction: `You are an ACARA (Australian Curriculum Assessment and Reporting Authority) NAPLAN test author.

Generate an authentic NAPLAN Numeracy practice examination paper aligned with the Australian Curriculum.

OFFICIAL NAPLAN SYLLABUS BREAKDOWN (Part 1 Non-Calculator & Part 2 Calculator Allowed):
1. NUMBER & ALGEBRA (40%):
   - Operations with whole numbers, fractions, decimals, percentages, money, ratios, and number patterns.
   - Algebraic expressions, linear equations, and index laws.

2. MEASUREMENT & GEOMETRY (35%):
   - 12h/24h time conversion, timetables, perimeter, area, volume of prisms, angle properties, and grid map directions.

3. STATISTICS & PROBABILITY (25%):
   - Interpreting column graphs, dot plots, pie charts, mean/median/range, and chance probabilities.

FORMATTING RULES:
• Use authentic Australian contexts (AFL scores, Australian geography, local currency).
• Clearly demarcate questions between Non-Calculator (mental strategy) and Calculator-Allowed problems.
• 4 options (A, B, C, D) per question.
• Provide clear step-by-step Australian Curriculum working.`
  },
  {
    id: 'digital_sat_math',
    name: 'Digital SAT Math Section',
    country: '🇺🇸 Global / USA',
    category: 'US College Board',
    gradeRange: 'Grade 9 - Grade 12',
    subject: 'maths',
    defaultQuestions: 22,
    defaultTime: 35,
    promptInstruction: `You are an official US College Board Digital SAT Math test author.

Generate an authentic Digital SAT Math section practice paper (Multistage Adaptive Testing format).

OFFICIAL DIGITAL SAT MATH DOMAINS (Desmos Graphing Calculator Allowed for All Questions):
1. ALGEBRA (35%):
   - Linear equations in 1 & 2 variables, systems of linear equations, linear inequalities, and interpreting linear models (y = mx + b).

2. ADVANCED MATH (35%):
   - Quadratic equations, vertex form, discriminant, factoring, exponential functions (y = a*b^x), polynomials, and radical expressions.

3. PROBLEM-SOLVING & DATA ANALYSIS (15%):
   - Percentages, ratios, rates, unit conversions, scatter plots, line of best fit, mean/median, standard deviation, and margin of error.

4. GEOMETRY & TRIGONOMETRY (15%):
   - Right triangle trigonometry (sin, cos, tan), Pythagorean theorem, circle equations (x-h)^2 + (y-k)^2 = r^2, arc length, and sector area.

FORMATTING RULES:
• Questions MUST match College Board phrasing, structure, and difficulty calibration.
• Include Student-Produced Response (Grid-In) numerical entry problems alongside multiple-choice.
• 4 options (A, B, C, D) per multiple-choice question.
• Explanations must show both algebraic solution steps and Desmos calculator techniques.`
  },
  {
    id: 'digital_sat_rw',
    name: 'Digital SAT Reading & Writing',
    country: '🇺🇸 Global / USA',
    category: 'US College Board',
    gradeRange: 'Grade 9 - Grade 12',
    subject: 'english',
    defaultQuestions: 27,
    defaultTime: 32,
    promptInstruction: `You are an official US College Board Digital SAT Reading & Writing test developer.

Generate an authentic Digital SAT Reading & Writing module paper.

OFFICIAL DIGITAL SAT R&W DOMAINS (1 Short Passage 25-150 words PER Question):
1. CRAFT & STRUCTURE (28%):
   - Words in Context (selecting high-utility academic vocabulary that fits text tone).
   - Text Structure & Purpose (analyzing passage function).
   - Cross-Text Connections (comparing paired short passages).

2. INFORMATION & IDEAS (26%):
   - Central Ideas & Details.
   - Command of Evidence (Textual & Quantitative data chart/table interpretation).
   - Inferences (completing the logical conclusion of a passage).

3. STANDARD ENGLISH CONVENTIONS (26%):
   - Boundaries: Semicolons, colons, em-dashes, comma splices.
   - Form, Structure, & Sense: Subject-verb agreement, pronoun-antecedent agreement, modifier placement.

4. EXPRESSION OF IDEAS (20%):
   - Rhetorical Synthesis (synthesizing provided bullet-point notes to achieve a specified goal) and Transitions (furthermore, however, nevertheless, consequently, for instance).

FORMATTING RULES:
• EVERY single question MUST feature a short 25-150 word self-contained passage, scientific snippet, or data table.
• Exactly 1 question per passage.
• 4 options (A, B, C, D).
• Explanations must cite textual evidence or grammatical rules.`
  },
  {
    id: 'uk_11plus_reasoning',
    name: 'UK 11+ Grammar & Independent School Entrance',
    country: '🇬🇧 United Kingdom',
    category: 'UK Entrance',
    gradeRange: 'Grade 5 - Grade 6',
    subject: 'critical_thinking',
    defaultQuestions: 30,
    defaultTime: 40,
    promptInstruction: `You are an expert test creator for UK 11+ Entrance Examinations (GL Assessment & CEM style for Grammar & Independent Schools).

Generate an authentic UK 11+ Reasoning examination paper.

OFFICIAL UK 11+ SYLLABUS BREAKDOWN:
1. VERBAL REASONING & COMPREHENSION (50%):
   - Word Analogies, Synonyms & Antonyms in context.
   - Sentence Code Cracking (alphabetical shift rules) and Hidden Words.
   - Compound Word Formation and Syllogism Deductions.
   - CEM-style Cloze passages (selecting missing words from options to complete a short literary snippet).

2. NON-VERBAL REASONING (50%):
   - 2D & 3D Spatial Rotations, Reflections, and Matrix Completion.
   - Folding Cube Nets and 3D Block Counting.

FORMATTING RULES:
• Questions must adhere to classic UK 11+ phrasing and UK English spelling.
• 4 options (A, B, C, D) per question.
• Explanations must clearly break down the verbal rule or spatial transformation pattern.`
  }
];
