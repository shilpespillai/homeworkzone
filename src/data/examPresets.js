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
    promptInstruction: `You are a senior exam designer for the NSW Selective High School Placement Test (Thinking Skills section).

Generate an authentic, highly challenging Thinking Skills examination paper for entry into Year 7 Selective High Schools.

EXAM SPECIFICATION & STRUCTURE:
1. LOGICAL DEDUCTION (25%):
   - Knights & Knaves (truth-tellers vs. liars) scenarios
   - Seating arrangement ordering & multi-variable logic elimination
   - Conditional logic (If P then Q; contrapositive validity vs. converse fallacies)

2. IDENTIFYING FLAWS & ASSUMPTIONS (25%):
   - Short 40-60 word debate arguments containing classical fallacies (Correlation vs. Causation, Straw Man, Ad Hominem, Over-generalization)
   - Implicit assumptions required to make an argument valid

3. EVALUATING EVIDENCE & ARGUMENTS (25%):
   - Passages presenting a claim with 4 candidate supporting/weakening statements
   - Assessing which statement MOST strengthens or MOST weakens the argument

4. SPATIAL & QUANTITATIVE REASONING (25%):
   - 3-Set Venn diagram overlap calculations
   - Binary tree decision paths & network logic

FORMATTING RULES:
• Every question must present a clear, realistic 30-70 word scenario/stimulus.
• Provide exactly 4 multiple-choice options (A, B, C, D) with realistic distractor traps.
• Distractors must represent common logical errors (e.g., assuming the converse, ignoring counter-evidence).
• Include a clear, step-by-step logical proof in the solution explanation for each question.`
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
    promptInstruction: `You are a senior curriculum author creating a NSW Selective High School Placement Test (Mathematical Reasoning) paper.

Generate an authentic, high-level Mathematical Reasoning examination paper.

EXAM SPECIFICATION & STRUCTURE:
1. NON-ROUTINE WORD PROBLEMS (30%):
   - Rate, time, and distance problems involving accelerating or meeting vehicles
   - Work-rate puzzles (cooperative filling pipes, shared jobs)
   - Chicken and rabbit heuristic problems (excess & deficit equations)

2. GEOMETRY & SPATIAL MEASUREMENT (25%):
   - Perimeter and area of compound L-shaped and overlapping figures
   - Shaded region area calculations involving inscribed circles, squares, and right triangles
   - Angle geometry involving parallel lines, transversals, and polygon interior/exterior sums

3. RATIO, PERCENTAGE & PROPORTION (25%):
   - Multi-stage ratio transformations (before and after transfers)
   - Profit, loss, discount, and percentage mixture problems

4. NUMBER THEORY & PATTERNS (20%):
   - Consecutive integer sums, Gauss summation series
   - Divisibility rules, LCM/GCD word problems, and finding unit digits of large products

FORMATTING RULES:
• Questions must be framed in realistic Australian context scenarios.
• Each question must have 4 multiple-choice options (A, B, C, D).
• Distractors must include common calculation traps (e.g., forgetting to halve a triangle area, miscalculating a ratio total).
• Provide step-by-step mathematical working in the answer explanation.`
  },
  {
    id: 'vic_selective_entry',
    name: 'Victorian Selective Entry (Edutest / ACER)',
    country: '🇦🇺 Australia',
    category: 'Selective Schools',
    gradeRange: 'Grade 8 - Grade 9',
    subject: 'critical_thinking',
    defaultQuestions: 35,
    defaultTime: 30,
    promptInstruction: `You are an expert test creator for Victorian Selective Entry High School Exams (Melbourne High, Mac.Robertson, Nossal, Suzanne Cory).

Generate an authentic Edutest / ACER style Verbal & Numerical Reasoning exam paper.

EXAM SPECIFICATION & STRUCTURE:
1. VERBAL REASONING (50%):
   - Complex Word Analogies (A : B :: C : ?)
   - Letter-Code Cracking & Alphabet Shift Rules
   - Word Relationships, Synonyms, Antonyms, & Odd Word Out
   - Deductive Syllogisms (All X are Y; Some Y are Z)

2. NUMERICAL REASONING (50%):
   - Number & Letter Pattern Matrix Completion
   - Speed, Distance, Time, and Fuel Consumption Rates
   - Financial profit & percentage change word logic
   - Symbol math (substituting shapes/symbols for algebraic values)

FORMATTING RULES:
• Questions must test rapid pattern recognition under tight time constraints.
• Provide 4 distinct options (A, B, C, D) per question.
• Explanations must clearly state the exact transformation rule or algebraic formula used.`
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
    promptInstruction: `You are an UNSW Educational Assessment Australia (EAA) ICAS Mathematics exam setter.

Generate an authentic ICAS Mathematics competition paper testing deep problem-solving and mathematical creativity.

EXAM SPECIFICATION:
1. HIGH-ORDER PROBLEM SOLVING (30%):
   - Combinatorics: Permutations, combinations, path counting on grid networks
   - Pigeonhole Principle application in sock/card/color drawing scenarios

2. SPATIAL & GRAPHICAL VISUALIZATION (25%):
   - Nets of 3D solids, rotational symmetry, visible vs. hidden cube stacks
   - Grid coordinate geometry & area of shaded segments on grid maps

3. NUMBER PATTERNS & ALGEBRA (25%):
   - Modular arithmetic patterns, repeating sequence cycles
   - Alphametics (cryptarithm arithmetic addition/multiplication puzzles)

4. DATA & CHANCE (20%):
   - Probability tree diagrams, Venn diagram 3-set intersections, stem-and-leaf interpretation

FORMATTING RULES:
• Questions should range from moderate to highly challenging.
• 4 multiple-choice options (A, B, C, D) per question.
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
    promptInstruction: `You are a lead science developer for ICAS Science (UNSW Global).

Generate an authentic ICAS Science examination paper focused strictly on scientific inquiry and experimental analysis.

EXAM SPECIFICATION:
1. EXPERIMENTAL DESIGN & VARIABLES (35%):
   - Identifying Independent, Dependent, and Controlled variables in a described experiment
   - Evaluating experimental controls and identifying sources of error or bias

2. DATA INTERPRETATION & GRAPH ANALYSIS (35%):
   - Line graphs, bar charts, scatterplots, and data tables representing scientific phenomena
   - Interpolating and extrapolating values from complex experimental data

3. HYPOTHESIS & SCIENTIFIC REASONING (30%):
   - Evaluating whether experimental results support or refute a given hypothesis
   - Cause-and-effect reasoning across Biology, Physics, Chemistry, and Earth/Space Science

FORMATTING RULES:
• Every question MUST include a detailed 40-80 word scenario describing a realistic scientific investigation, data table, or experiment.
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

EXAM SPECIFICATION:
1. ALGORITHMS & PSEUDOCODE (35%):
   - Tracing loops (FOR, WHILE), IF-ELSE conditionals, and variables in pseudocode blocks
   - Flowchart symbols, decision diamonds, and algorithmic logic tracking

2. DATA REPRESENTATION & BINARY (25%):
   - Binary code, bit/byte conversions, hexadecimal colors, ASCII encoding
   - Data compression concepts (lossy vs. lossless)

3. HARDWARE & NETWORKS (20%):
   - CPU, RAM, storage, input/output devices
   - IP addresses, routers, packets, DNS, and web browser protocols

4. CYBERSECURITY & DIGITAL SAFETY (20%):
   - Phishing detection, strong password hashing, encryption principles, digital footprints

FORMATTING RULES:
• Include realistic pseudocode snippets and network scenario descriptions.
• 4 multiple-choice options (A, B, C, D) per question.
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
    promptInstruction: `You are an Australian Curriculum Assessment and Reporting Authority (ACARA) NAPLAN test developer.

Generate an authentic NAPLAN Numeracy practice examination paper aligned with the Australian Curriculum.

EXAM SPECIFICATION:
1. NUMBER & ALGEBRA (40%):
   - Fractions, decimals, percentages, money calculations, and number patterns
   - Linear equations, index laws, and proportional reasoning

2. MEASUREMENT & GEOMETRY (35%):
   - Time conversion (12h/24h), timetables, perimeter, area, volume of prisms
   - Angle properties, 2D shape transformations, grid map directions

3. STATISTICS & PROBABILITY (25%):
   - Column graphs, dot plots, pie charts, mean/median/range, spinner probabilities

FORMATTING RULES:
• Use authentic Australian contexts (e.g. AFL scores, Australian geography, local currency).
• 4 multiple-choice options (A, B, C, D) per question.
• Explanations must provide clear Australian curriculum working steps.`
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

Generate an authentic Digital SAT Math section practice paper.

EXAM SPECIFICATION:
1. ALGEBRA (35%):
   - Linear equations in 1 and 2 variables, systems of linear equations, linear inequalities
   - Interpreting linear models ($y = mx + b$) in real-world contexts

2. ADVANCED MATH (35%):
   - Quadratic equations, vertex form, discriminant, factoring
   - Exponential functions ($y = a \\cdot b^x$), growth/decay rates
   - Polynomial expressions, rational equations, and radical expressions

3. PROBLEM-SOLVING & DATA ANALYSIS (15%):
   - Percentages, ratios, rates, unit conversions
   - Scatter plots, line of best fit, mean/median, standard deviation concepts

4. GEOMETRY & TRIGONOMETRY (15%):
   - Right triangle trigonometry ($\sin, \cos, \tan$), Pythagorean theorem
   - Circle equations $(x-h)^2 + (y-k)^2 = r^2$, arc length, sector area

FORMATTING RULES:
• Questions must match College Board phrasing and structure.
• 4 options (A, B, C, D) per question.
• Explanations must show both algebraic solution methods and calculator-assisted strategies.`
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
    promptInstruction: `You are a Digital SAT Reading & Writing test developer for the US College Board.

Generate an authentic Digital SAT Reading & Writing module paper.

EXAM SPECIFICATION:
1. CRAFT & STRUCTURE (30%):
   - Words in Context (selecting high-utility academic vocabulary that fits the text tone)
   - Text Structure & Purpose (analyzing passage function)
   - Cross-Text Connections (comparing two short passages)

2. INFORMATION & IDEAS (35%):
   - Central Ideas & Details
   - Command of Evidence (Textual & Quantitative data chart interpretation)
   - Inferences (completing the logical conclusion of a passage)

3. STANDARD ENGLISH CONVENTIONS (35%):
   - Boundaries: Semicolons, colons, dashes, comma splices
   - Form, Structure, & Sense: Subject-verb agreement, pronoun-antecedent agreement, modifier placement

FORMATTING RULES:
• EVERY question MUST feature a short 25-120 word self-contained passage or data table.
• Exactly 1 question per passage.
• 4 multiple-choice options (A, B, C, D).
• Explanations must detail the grammatical rule or textual evidence supporting the answer.`
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

EXAM SPECIFICATION:
1. VERBAL REASONING (50%):
   - Word Analogies & Synonyms/Antonyms in context
   - Sentence Code Cracking & Letter-Shift Encryption
   - Hidden Words & Compound Word Formation
   - Deductive Logic & Sentence Completion

2. NON-VERBAL REASONING (50%):
   - 2D & 3D Spatial Rotations & Reflections
   - Folding Cube Nets & 3D Block Counting
   - Pattern Matrix Series Completion (Odd One Out, Similar Matrices)

FORMATTING RULES:
• Questions must adhere to classic UK 11+ phrasing and UK English spelling.
• 4 multiple-choice options (A, B, C, D) per question.
• Explanations must clearly break down the verbal rule or spatial transformation pattern.`
  }
];
