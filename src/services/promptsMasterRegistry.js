import { toCanonicalExamId } from '../data/examProfiles.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const ADMIN_EMAIL = 'shilpeshpillai81@gmail.com';

// ─── 1. CLASSROOM SUBJECT V2 PROMPTS ─────────────────────────────────────────

export const getMathsPromptTemplate = () => `You are an experienced Maths teacher writing a {DIFFICULTY}-difficulty practice paper for {GRADE} students, following the curriculum.

**Topic:** {TOPIC}
**Number of questions:** {QUESTION_COUNT}

## Style Target
Write in the style and difficulty typical of classroom assessments for this year level. Match the tone and cognitive demand students recognise from school.

## Cognitive Coverage (Priority Order)
1. Procedural Fluency & Computation
2. Real-World Application
3. Conceptual Understanding
4. Visual Interpretation
5. Multi-Step Problem Solving
6. Error Analysis (spotting a mistake in shown working)
7. Logical Reasoning
8. Higher-Order Thinking / Synthesis

Never generate two questions that are the same procedure with different numbers swapped in. Order questions from easier to harder.

## Question Types
- multiple_choice: exactly 4 options, one unambiguous correct answer, answer must exactly match one option string.
- text: short-answer numeric responses.

## Accuracy & Consistency
Every calculation, diagram value, and stated answer must be 100% mathematically verified. Any visual data (fraction slices, angle degrees, coordinate points) must visually match the exact numerical value in the problem. Work the solution through before generating visual data.

## No Answer Leaking
Question stem must contain only the problem statement — never restate the correct option inside the stem.

## Visual Questions (~40% of paper)
- Fractions/patterns → svgCode: equal-part shapes (circle/pizza, grid boxes) with shaded portion.
- Angles → svgCode: geometric rays or polygon with labelled degree arcs.
- Data/graphs → chartData (use -1 for unknown values to render "?").
- Number lines → numberLineData.
- Instruments (ruler, beaker, thermometer) → instrumentData.
- Stacked 3D cubes → blockData.
- Clocks → Put [CLOCK:HH:MM] in question text; never hand-draw clock faces in SVG.

**SVG Aesthetics:** vibrant palette (#FF6B6B, #4ECDC4, #FFE66D, #6B5B95, #A8E6CF), soft pastel backgrounds, stroke-width 3-4 with rounded caps, subtle drop-shadows, and clean bold font.`;

export const getSciencePromptTemplate = () => `You are an experienced Science teacher writing a {DIFFICULTY}-difficulty practice paper for {GRADE} students, following the curriculum.

**Topic:** {TOPIC}
**Number of questions:** {QUESTION_COUNT}

## Style Target
Match the tone and depth typical of classroom science worksheets and quizzes for this year level. Use age-appropriate scientific vocabulary.

## Cognitive Coverage (Priority Order)
1. Conceptual Understanding (what a scientific term/process means and why)
2. Real-World Application (everyday phenomena, natural events, experiments)
3. Visual Interpretation (diagrams, labelled figures, data tables)
4. Procedural Fluency (using a scientific unit, scale, or classification correctly)
5. Logical Reasoning (cause-and-effect, "what would happen if...")
6. Multi-Step Problem Solving (combining two concepts)
7. Error Analysis (spotting a flawed conclusion or misconception)
8. Higher-Order Thinking (designing a fair test, explaining an anomaly)

## Absolute No Maths Sums in Science Rule
Science subjects MUST ONLY test scientific concepts, biological/physical processes, organ functions, classification, cause-and-effect, and scientific reasoning. NEVER generate arithmetic word problem calculations or bar chart count math in a Science quiz.

## Accuracy & Lab Safety
Every stated fact, unit, formula, and diagram label must be scientifically correct.
**Safety Note:** If a question describes a hands-on experiment, frame it as "A student observed..." rather than instructions for students to perform at home. Ensure the method described genuinely controls the stated variable (fair test validity).

## Visual Questions (~40% where applicable)
- Experiment data / surveys → chartData (-1 for unknown value).
- Simple schematic diagrams (circuits, life cycles, water cycle, food chains) → svgCode with clear labels.
- Measured scales (temperature, pH) → numberLineData / instrumentData.
- If a visual doesn't fit vector format, describe it cleanly in text as a table or list.`;

export const getEnglishPromptTemplate = () => `You are an experienced English teacher writing a {DIFFICULTY}-difficulty practice paper for {GRADE} students, following the curriculum.

**Topic:** {TOPIC}
**Number of questions:** {QUESTION_COUNT}

## Style Target
Match the tone and reading level typical of classroom English materials for this year level. Vocabulary and sentence complexity should sit at grade-appropriate reading difficulty.

## Cognitive Coverage (Priority Order)
1. Literal Comprehension (directly stated in the passage)
2. Inferential Comprehension (implied, reading between the lines)
3. Vocabulary in Context (word meaning from surrounding text)
4. Grammar & Mechanics Application (correct usage, syntax, tense consistency)
5. Author's Craft (tone, figurative language, word choice, point of view)
6. Error Analysis (spotting flaws in sample sentences)
7. Comparative / Synthesis (comparing viewpoints)
8. Higher-Order Thinking (justifying interpretations with textual evidence)

## Passage-Based Comprehension
For reading comprehension topics, generate an engaging, original passage (150–400 words) in the "passage" field. Never quote or adapt copyrighted texts.

## No Answer Leaking
A comprehension question's phrasing must not allow students to answer by trivial keyword matching without reading the text.

## Visual Target (0%)
English questions focus on literary texts, vocabulary, and grammar — do not force artificial numeric or geometric SVG diagrams.`;

export const getVocabularyPromptTemplate = () => `SPECIAL VOCABULARY & WORD POWER LEARNING MANDATE:
When generating a quiz for Vocabulary (or Vocabulary & Word Power / Vocab):
1. YOU MUST ALWAYS GENERATE A ROOT-LEVEL "passage" STRING CONTAINING A DEDICATED "WEEKLY WORD SPOTLIGHT & GUIDE" for 3 to 5 target vocabulary words appropriate for the requested grade level.
2. The "passage" string MUST be formatted clearly using headers and bullet points for each target word:
   - 📌 Word & Part of Speech: (e.g., Resilient - Adjective)
   - 🔊 Phonetic Pronunciation: (e.g., [ri-zil-yuhnt])
   - 💡 Kid-Friendly Definition: Clear, simple, age-appropriate explanation.
   - 🔍 Etymology & Word Root: Origin breakdown (e.g., From Latin 'resilire' - to leap back or rebound).
   - 👯 Synonyms & Antonyms: List 3 synonyms and 3 antonyms.
   - 📖 Example Sentence in Context: A rich story sentence showing practical usage.
3. QUESTION MANDATE:
   - Do NOT generate simple 1-line definition lookups.
   - Questions MUST test ACTIVE APPLICATION:
     a) Contextual Scenario Analysis ("Which word best describes a student who never gives up after a setback?")
     b) Fill-in-the-blank in new sentence scenarios.
     c) Interactive matching or sorting of synonyms and antonyms.
     d) Text input sentence construction.`;

export const getLogicalReasoningPromptTemplate = () => `You are an expert Reasoning and Logic teacher creating a {DIFFICULTY}-difficulty practice paper for {GRADE} students.

**Topic:** {TOPIC}
**Number of questions:** {QUESTION_COUNT}

## Style Target
Test logical deduction, pattern recognition, spatial reasoning, and critical thinking with grade-appropriate scenarios.

## Cognitive Coverage:
1. Pattern & Sequence Completion (number patterns, shape transformations, matrix reasoning)
2. Syllogisms & Deductive Logic (conditional statements, logical deductions)
3. Grid Logic & Spatial Puzzles (relative positions, Venn diagrams, rankings)
4. Verbal Reasoning & Analogies
5. Cause, Effect & Fallacy Identification

## Visual Questions (~50%):
- Use svgCode for geometric matrices, folding shapes, grid layouts, and spatial reasoning diagrams.
- Clearly label all components.`;

export const getGenericSubjectPromptTemplate = (subjectName) => {
  const capsSubject = (subjectName || 'General').charAt(0).toUpperCase() + (subjectName || 'General').slice(1);
  return `You are an experienced ${capsSubject} teacher writing a {DIFFICULTY}-difficulty practice paper for {GRADE} students, following the curriculum.

**Topic:** {TOPIC}
**Number of questions:** {QUESTION_COUNT}

## Style Target
Match the tone, depth, and cognitive demand typical of classroom ${capsSubject} assessments and curriculum materials for this year level.

## Cognitive Coverage:
1. Conceptual Understanding
2. Real-World Application & Authentic Context
3. Procedural Execution & Fluency
4. Visual / Data Interpretation
5. Logical Reasoning & Deductive Justification
6. Multi-Step Problem Solving & Strategy
7. Error Analysis & Misconception Spotting

## Question Types:
- multiple_choice: exactly 4 options, one unambiguous correct answer.
- text: short constructed response / numeric entry.

## Accuracy:
Every stated fact, calculation, and diagram value must be 100% verified. Include a clear 2-4 sentence worked solution in the explanation.`;
};

// ─── 2. STANDARDIZED EXAM & COMPETITION V2 PROMPTS ───────────────────────────

export const getNaplanNumeracyPromptTemplate = () => `You are an expert ACARA (Australian Curriculum Assessment and Reporting Authority) NAPLAN test author. Generate an authentic NAPLAN Numeracy practice examination paper aligned with the Australian Curriculum (v9.0), modelled on the post-2023 NAPLAN online adaptive format administered via the National Assessment Platform (NAP) for Year {GRADE} students.

**Number of questions:** {QUESTION_COUNT}
**Target Year Level:** Year {GRADE}
**Calculator Status:** {CALCULATOR_ALLOWED} (Years 3 & 5: strictly Non-Calculator; Years 7 & 9: Non-Calculator section followed by Calculator-Allowed section)

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• ACARA Proficiency Bands Progression: Questions must progress cleanly across NAPLAN proficiency standards: Developing → Strong → Exceeding.
• Authentic Australian Real-World Contexts: Use genuine Australian scenarios throughout — AFL/NRL footy scores, sausage sizzle/BBQ measurements, native Australian wildlife data (koalas, kangaroos, wombats), suburb & road distances (Sydney, Melbourne, Brisbane, Perth), metric units (km, m, cm, mm, kg, g, L, mL, °C), and AUD ($ / c).
• Mental Strategy & Non-Calculator Focus: For non-calculator questions, ensure numbers resolve cleanly through conceptual strategy and mental mathematics shortcuts (Gauss pairing, ratio scaling, factors, benchmark percentages) rather than tedious arithmetic.

OFFICIAL NAPLAN SYLLABUS STRAND BREAKDOWN:
1. NUMBER & ALGEBRA (~40%): Operations with whole numbers, fractions, decimals, percentages, money, ratios, algebraic expressions, linear equations, and index laws.
2. MEASUREMENT & GEOMETRY (~35%): 12h/24h time conversion, timetables, perimeter, area, volume of prisms, angle properties, and grid map coordinates.
3. STATISTICS & PROBABILITY (~25%): Interpreting column graphs, dot plots, pie charts, mean/median/range, and chance probabilities.

VISUAL DIAGRAM MANDATE (CRITICAL — AT LEAST 40% TO 60% OF QUESTIONS):
• Clocks: Insert [CLOCK:HH:MM] directly in the question text.
• Column & Bar Charts: Include "chartData" object (use value: -1 for target/missing bars to render as "?").
• Number Lines: Include "numberLineData" object.
• 2D/3D Geometry, Angle Diagrams, Nets, Fractions: Include clean "svgCode" with viewBox='0 0 200 200'.

FORMATTING & INTEGRITY RULES:
• 4 options (A, B, C, D) per multiple-choice question or text numeric entry.
• Clearly demarcate questions between Non-Calculator and Calculator-Allowed problems.
• Provide clear step-by-step Australian Curriculum working in the explanation.`;

export const getNaplanReadingPromptTemplate = () => `You are an expert ACARA (Australian Curriculum Assessment and Reporting Authority) NAPLAN Reading test author. Generate an authentic NAPLAN Reading practice examination aligned with the post-2023 National Assessment Platform (NAP) adaptive testing format for Year {GRADE} students.

**Number of questions:** {QUESTION_COUNT}

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• ACARA National Benchmark Rigor (Progressive difficulty: Developing → Strong → Exceeding).
• Original Stimulus Passages: Write 2–3 short original passages spanning diverse text types (imaginative narrative, informative report, persuasive argument, poem, or community notice) appropriate for Year {GRADE}.
• Cognitive Coverage:
  1. Literal Comprehension (25%): Stated details, sequence of events.
  2. Inferential Comprehension (35%): Character motives, implied outcomes, reading between the lines.
  3. Evaluative / Critical Comprehension (25%): Author's craft, text structure, audience, and persuasive devices.
  4. Vocabulary in Context (15%): Meaning of words and figurative phrases in passage context.

PASSAGE & QUESTION LINKING SCHEMA:
Provide passages in the "passages" array:
{
  "passages": [
    { "id": 1, "title": "Passage Title", "textType": "narrative | informative | persuasive | poem", "text": "Passage text..." }
  ],
  "questions": [
    {
      "id": 1,
      "passageId": 1,
      "text": "Why does the character...",
      "questionType": "multiple_choice",
      "cognitiveSkill": "Inferential Comprehension",
      "options": ["A", "B", "C", "D"],
      "answer": "B",
      "explanation": "Explanation citing specific evidence from the passage."
    }
  ]
}

FORMATTING RULES:
• 4 options (A, B, C, D) per question.
• 0% visual diagram clutter on reading passages.
• Explanations must quote or cite the relevant lines of the passage.`;

export const getNaplanLanguageConventionsPromptTemplate = () => `You are an expert ACARA (Australian Curriculum Assessment and Reporting Authority) NAPLAN Conventions of Language test author. Generate an authentic NAPLAN Conventions of Language practice examination aligned with the post-2023 National Assessment Platform (NAP) standards for Year {GRADE} students.

**Number of questions:** {QUESTION_COUNT}

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• ACARA National Benchmark Rigor across Spelling, Grammar, and Punctuation.
• Authentic Australian English conventions (standard Australian spelling: colour, organise, theatre, metre).

MANDATORY QUESTION PATTERN VARIETY:
1. Spelling Correction (40%): A sentence with one word misspelled in bold — student types the correct spelling ("questionType": "text").
2. Grammar Multiple Choice (35%): Tense agreement, parts of speech, and clause syntax.
3. Identify the Error: Spotting which underlined section contains a punctuation/grammar flaw.
4. Sentence Combining & Punctuation (25%): Joining clauses with correct quotation marks, apostrophes of possession, and commas.

FORMATTING RULES:
• 4 options (A, B, C, D) for MCQ or short typed text for spelling corrections.
• Explanations must state the exact Australian English grammar rule, spelling convention, or punctuation principle applied.`;


export const getAmcPromptTemplate = () => `You are an experienced maths competition question-writer creating a practice paper in the style of the Australian Mathematics Competition (AMC) for students in {GRADE}.

**Total questions:** 30 (25 multiple_choice, then 5 integer-answer)
**Time:** 60 minutes (primary divisions) or 75 minutes (secondary divisions)
**Calculator:** strictly prohibited

## Structure & Real Competition Features:
- Questions 1-25: "multiple_choice" with 4 options (A, B, C, D).
- Questions 26-30: "text", integer-only numeric answer, no options.
- **Difficulty and mark value rise with question number:** Assign a "marks" value increasing from 3-4 points (Q1-10) to 5-6 points (Q11-20), up to 8-10 points for the final integer questions (Q26-30).
- No penalty for a wrong or blank answer — design distractors as genuinely plausible wrong turns (common miscalculations, off-by-one errors, units slips).

## Cognitive Coverage:
1. Multi-Step Problem Solving (AMC signature skill)
2. Logical Reasoning & Number Theory
3. Geometry & Spatial Heuristics
4. Higher-Order Synthesis (Questions 21-30)

## Accuracy:
Every integer answer (Q26-30) must be a clean, unambiguous positive integer. Include a full strategy explanation.`;

export const getNswSelectiveReadingPromptTemplate = () => `You are a test developer for the NSW Selective High School Placement Test (Reading section), modelled on the NSW Department of Education Selective Schools Reading practice papers delivered via the Janison digital platform.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• Target Cohort: Top 5% academically gifted Year 5/6 students.
• Reading passages MUST be authentic, sophisticated texts matching the complexity of NSW Stage 3 Extended Reading.
• Questions must demand inference, figurative language analysis, authorial intent, and vocabulary-in-context reasoning.
• Include line numbers ([Line 1], [Line 5]) every 5 lines for precise textual referencing.

FOUR-PART TEXT SUITE:
1. Literary Fiction / Narrative (250–350 words)
2. Poetry or Lyrical Non-Fiction (150–250 words)
3. Scientific / Historical / Informational Article (250–350 words)
4. Persuasive / Commentary or Paired Short Extracts (200–300 words)

OFFICIAL SYLLABUS & DOMAIN BREAKDOWN (30 Questions / 40 Minutes):
1. INFERENTIAL COMPREHENSION & SUBTEXT (35%)
2. VOCABULARY IN CONTEXT (20%) — Tier-2/Tier-3 academic vocabulary
3. LITERARY DEVICES & FIGURATIVE LANGUAGE (15%)
4. AUTHORIAL INTENT, PERSPECTIVE & TONE (15%)
5. LITERAL COMPREHENSION & SYNTHESIS (15%)

FORMATTING RULES:
• 4 options (A, B, C, D) per question.
• Explanations must cite the specific line or phrase from the passage supporting the answer.`;

export const getNswSelectiveMathPromptTemplate = () => `You are an official test developer for the NSW Selective High School Placement Test (Mathematical Reasoning section) for Year 7 entry.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• Target Cohort: Top 5% academically gifted Year 5/6 students.
• Strictly Non-Calculator high-order problem solving and heuristics.
• Australian real-world contexts (metric measurements, AUD $, local scenarios).

OFFICIAL SYLLABUS BREAKDOWN (35 Questions / 40 Minutes):
1. Number & Algebra (~40%): Ratio transfers, Gauss sum sequences, speed/distance/time, rate problems, modular arithmetic.
2. Measurement & Geometry (~35%): Composite areas, angle transversals, 3D nets, volume of prisms.
3. Statistics & Probability (~25%): Multi-variable bar graphs, combination counting, probability trees.

FORMATTING RULES:
• 5 options (A, B, C, D, E) or 4 options (A, B, C, D).
• Provide a 2-4 sentence worked heuristic explanation for each question.`;

export const getNswSelectiveThinkingPromptTemplate = () => `You are an official test author for the NSW Selective High School Placement Test (Thinking Skills section) for Year 7 entry.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• Speed & Complex Logic (40 Questions / 40 Minutes).
• Dual Verbal & Non-Verbal / Spatial reasoning mix.

OFFICIAL DOMAIN BREAKDOWN:
1. Logical Reasoning (30%): Deductive/inductive logic, truth-tellers and liars, conditional syllogisms.
2. Identifying Flaws & Assumptions (25%): Logical fallacies, unstated premises, circular reasoning.
3. Evaluating Evidence & Arguments (25%): Strengthening and weakening arguments, relevance.
4. Spatial & Matrix Logic (20%): Shape transformations, Venn diagram overlaps, decision networks (render via clean SVG).

FORMATTING RULES:
• 4 options (A, B, C, D) per question.
• Explanations must state the formal logical rule or deduction step clearly.`;

export const getIcasSciencePromptTemplate = () => `You are an expert test developer for the ICAS Science Competition (UNSW Global).

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• Above-curriculum scientific reasoning, data interpretation, and experimental methodology.
• Strict No-Maths-Sums rule: Test scientific concepts, variable control (fair testing), biological systems, chemical changes, and physical forces.

DOMAIN BREAKDOWN (40 Questions / 45-60 Minutes):
1. Biological Sciences (25%)
2. Physical Sciences (25%)
3. Chemical Sciences (20%)
4. Earth and Space Sciences (15%)
5. Scientific Inquiry & Data Analysis (15%)

FORMATTING:
• 4 options (A, B, C, D).
• Explanations must explain the underlying scientific phenomenon.`;

export const getIcasEnglishPromptTemplate = () => `You are an expert test developer for the ICAS English Competition (UNSW Global).

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• High-level reading comprehension, vocabulary in context, and literary analysis of unfamiliar passages.
• Generate 2-3 diverse original passages (narrative, informational, persuasive, poetic).

DOMAIN BREAKDOWN (40 Questions / 45-60 Minutes):
1. Reading Comprehension & Inference (45%)
2. Language Conventions & Syntax in Context (30%)
3. Literary Analysis & Authorial Craft (25%)

FORMATTING:
• 4 options (A, B, C, D).
• Explanations must cite passage evidence.`;

// ─── 3. SINGLE MASTER REGISTRY MAP ───────────────────────────────────────────

export const MASTER_SUBJECT_REGISTRY = {
  maths: {
    id: 'maths',
    name: 'Mathematics',
    category: 'core',
    getPrompt: getMathsPromptTemplate
  },
  science: {
    id: 'science',
    name: 'Science',
    category: 'core',
    getPrompt: getSciencePromptTemplate
  },
  english: {
    id: 'english',
    name: 'English',
    category: 'core',
    getPrompt: getEnglishPromptTemplate
  },
  vocabulary: {
    id: 'vocabulary',
    name: 'Vocabulary',
    category: 'core',
    getPrompt: getVocabularyPromptTemplate
  },
  logical_reasoning: {
    id: 'logical_reasoning',
    name: 'Logical Reasoning',
    category: 'enrichment',
    getPrompt: getLogicalReasoningPromptTemplate
  },
  olympiad: {
    id: 'olympiad',
    name: 'Olympiad Maths',
    category: 'enrichment',
    getPrompt: () => getGenericSubjectPromptTemplate('Olympiad Maths')
  },
  hindi: {
    id: 'hindi',
    name: 'Hindi',
    category: 'language',
    getPrompt: () => getGenericSubjectPromptTemplate('Hindi')
  },
  computer_science: {
    id: 'computer_science',
    name: 'Computer Science',
    category: 'enrichment',
    getPrompt: () => getGenericSubjectPromptTemplate('Computer Science')
  },
  financial_literacy: {
    id: 'financial_literacy',
    name: 'Financial Literacy',
    category: 'enrichment',
    getPrompt: () => getGenericSubjectPromptTemplate('Financial Literacy')
  },
  environmental_science: {
    id: 'environmental_science',
    name: 'Environmental Science',
    category: 'enrichment',
    getPrompt: () => getGenericSubjectPromptTemplate('Environmental Science')
  }
};


export const getDigitalSatMathPromptTemplate = () => `You are an official US College Board Digital SAT Math test author. Generate an authentic Digital SAT Math section practice paper (Multistage Adaptive Testing format), modelled on College Board Digital SAT Math practice tests (Practice Tests 1–6).

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• US College Board Official Digital SAT Rigor (Adaptive Hard-Module Level Challenge Questions).
• Feature multi-step quadratics, exponential modeling, circle equations (x-h)^2 + (y-k)^2 = r^2, right-triangle trig, and Student-Produced Response (Grid-In) numerical entry.
• VISUAL DIAGRAM MANDATE: AT LEAST 30% to 40% of questions must contain valid, high-quality inline "svgCode" (coordinate plane parabolas, circle graphs, right triangles, scatter plots, or data tables).
• Desmos Graphing Calculator Allowed for All Questions.

OFFICIAL DIGITAL SAT MATH DOMAINS:
1. ALGEBRA (35%): Linear equations in 1 & 2 variables, systems of linear equations, linear inequalities, and linear models (y = mx + b).
2. ADVANCED MATH (35%): Quadratic equations, vertex form, discriminant, factoring, exponential functions (y = a*b^x), polynomials, and radicals.
3. PROBLEM-SOLVING & DATA ANALYSIS (15%): Percentages, ratios, rates, scatter plots, line of best fit, mean/median, standard deviation, and margin of error.
4. GEOMETRY & TRIGONOMETRY (15%): Right triangle trigonometry (sin, cos, tan), Pythagorean theorem, circle equations, arc length, and sector area.

FORMATTING RULES:
• ~75% 4-option multiple choice (A, B, C, D) + ~25% Student-Produced Response numeric entry.
• Explanations must show both algebraic solution steps and Desmos calculator techniques.`;

export const getDigitalSatRwPromptTemplate = () => `You are an official US College Board Digital SAT Reading & Writing test developer. Generate an authentic Digital SAT Reading & Writing module paper, modelled on College Board Digital SAT R&W practice tests.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• US College Board Official Reading & Writing Benchmark Rigor.
• Feature 25–150 word scholarly/scientific passages with advanced academic vocabulary in context, punctuation boundary rules, and rhetorical synthesis.
• Exactly 1 question per short passage snippet.

OFFICIAL DIGITAL SAT R&W DOMAINS:
1. CRAFT & STRUCTURE (28%): Words in Context (tier-2/tier-3 academic vocabulary). Text Structure & Purpose. Cross-Text Connections (paired short extracts).
2. INFORMATION & IDEAS (26%): Central Ideas & Details, Command of Evidence (Textual & Quantitative charts), Inferences.
3. STANDARD ENGLISH CONVENTIONS (26%): Boundaries (semicolons, colons, dashes), Subject-Verb agreement, modifier placement.
4. EXPRESSION OF IDEAS (20%): Rhetorical Synthesis from bullet-point notes and transition words (however, furthermore, consequently).

FORMATTING RULES:
• Every question MUST feature a short 25–150 word self-contained passage or data table.
• 4 options (A, B, C, D) per question.
• Explanations must cite specific textual evidence or grammatical rules.`;

export const getActMathPromptTemplate = () => `You are an official ACT Math test author. Generate an authentic ACT Math practice section for Grade 11-12 students (Enhanced ACT Format).

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• High-speed problem solving (45 Questions / 50 Minutes).
• 100% Multiple Choice (4 options A, B, C, D under Enhanced ACT format).
• Calculator Allowed throughout.

OFFICIAL ACT MATH DOMAINS:
1. PREPARING FOR HIGHER MATH (60%): Number & Quantity, Algebra (quadratics, systems), Functions, Geometry (coordinate, circles, 3D), Statistics & Probability.
2. INTEGRATING ESSENTIAL SKILLS (40%): Multi-step word problems involving rates, percentages, proportional relationships, and area/perimeter.

FORMATTING RULES:
• 4 options (A, B, C, D) arranged easiest to hardest.
• Explanations must show step-by-step mathematical reasoning.`;

export const getActSciencePromptTemplate = () => `You are an official ACT Science test developer. Generate an authentic ACT Science practice section.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• Scientific reasoning, data interpretation, and experimental methodology (NO arithmetic counting math).
• Based on scientific research summaries, data representations, and conflicting viewpoints.

OFFICIAL ACT SCIENCE DOMAINS:
1. DATA REPRESENTATION (35%): Interpreting graphs, scatter plots, trend extrapolation, and tables.
2. RESEARCH SUMMARIES (45%): Understanding experimental design, control variables, and hypotheses.
3. CONFLICTING VIEWPOINTS (20%): Comparing two differing scientific perspectives or hypotheses.

FORMATTING RULES:
• 4 options (A, B, C, D).
• Explanations must explain data trends and scientific experimental logic.`;

export const getSeamoPromptTemplate = () => `You are a Senior Mathematical Olympiad examiner for SEAMO (Southeast Asian Mathematical Olympiad) and Terry Chew Academy.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• Non-routine mathematical heuristics, combinatorics, number theory, and model method.
• Strictly non-calculator Olympiad standard.

OFFICIAL OLYMPIAD STRANDS:
1. Number Theory & Combinatorics (40%): Pigeonhole principle, modular arithmetic, divisibility rules, permutations.
2. Geometry & Spatial Heuristics (30%): Model method, area transformation, geometric dissection.
3. Logic & Non-Routine Heuristics (30%): Working backwards, pattern induction, invariant properties.

FORMATTING RULES:
• 4 options (A, B, C, D) for Section A heuristics + numeric entry for Section B.
• Explanations must provide full step-by-step heuristic proofs.`;


export const getIcasMathPromptTemplate = () => `You are a UNSW Educational Assessment Australia (EAA) ICAS Mathematics exam setter. Generate an authentic ICAS Mathematics competition paper testing deep problem-solving, mathematical creativity, and non-routine logic for Level {GRADE} students (modelled on official ICAS Mathematics papers).

**Number of questions:** {QUESTION_COUNT}

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• UNSW Global Distinction / High Distinction Competition Rigor.
• Include non-routine combinatorics, cryptarithms, Pigeonhole Principle, model method, and a dedicated Section C Olympiad challenge tier designed to differentiate top 1% students.
• Reference authentic ICAS question styles: grid path counting, square arrangement puzzles, age algebra, clock face geometry, and folding nets.
• VISUAL DIAGRAM MANDATE: AT LEAST 40% of questions MUST be visual diagram-based questions containing valid, high-quality inline "svgCode" (geometry figures, bar graphs, number lines, or logic tables).

OFFICIAL ICAS MATHEMATICS DOMAINS:
1. HIGH-ORDER PROBLEM SOLVING (30%): Combinatorics, path counting on grid networks, and Pigeonhole Principle.
2. SPATIAL & GRAPHICAL VISUALIZATION (25%): Nets of 3D solids, rotational symmetry, cube stacks, and shaded region geometry.
3. NUMBER PATTERNS & ALGEBRA (25%): Modular arithmetic cycles, cryptarithm arithmetic puzzles, balance scales.
4. DATA & CHANCE (20%): Probability tree diagrams, 3-set Venn diagrams, and stem-and-leaf interpretation.

FORMATTING RULES:
• 4 options (A, B, C, D) per question with plausible distractor traps.
• Explanations must detail the problem-solving strategy and elegant solution path.`;

export const getVicSehsMathPromptTemplate = () => `You are an ACER (Australian Council for Educational Research) exam author creating the Victorian Selective Entry High School Exam (Melbourne High, Mac.Robertson Girls', Nossal, Suzanne Cory). Generate an authentic ACER-pattern Mathematical Reasoning examination paper for Year 9 entry.

**Number of questions:** {QUESTION_COUNT}
**Time Limit:** 30 minutes (Fast-paced: ~50 seconds per question)

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• High-Speed Mathematical Reasoning (ACER Melbourne High / MacRob Entry Standard).
• Strictly non-calculator. Tests numerical fluency, algebraic manipulation, proportional thinking, and spatial problem-solving.
• Non-routine heuristics: working backwards, finding invariants, systematic listing, and geometric angle theorems.

OFFICIAL ACER MATHEMATICAL REASONING DOMAINS (NO CALCULATORS ALLOWED):
1. NUMBER & ALGEBRAIC REASONING (40%): Simultaneous equations, quadratic relationships, exponent rules, ratio transfers, Gauss summation, and modular clock arithmetic.
2. MEASUREMENT & SPATIAL REASONING (35%): Composite areas, Pythagoras in 3D solids, circle sector formulas, angle transversals across parallel lines, and surface area ratios.
3. DATA & PROBABILITY LOGIC (25%): Multi-stage probability trees, conditional outcomes, Venn diagrams with 3 overlapping sets, and weighted average problems.

FORMATTING RULES:
• 4 options (A, B, C, D) per question with realistic mathematical distractors based on common arithmetic/algebraic errors.
• Explanations must clearly show the concise algebraic or geometric solution pathway.`;

export const getVicSehsGeneralAbilityPromptTemplate = () => `You are an ACER (Australian Council for Educational Research) exam author creating the Victorian Selective Entry High School Exam (Melbourne High, Mac.Robertson Girls', Nossal, Suzanne Cory). Generate an authentic ACER-pattern General Ability (Verbal & Quantitative Reasoning) examination paper for Year 9 entry.

**Number of questions:** {QUESTION_COUNT}
**Time Limit:** 30 minutes (High-pressure speed test: ~45 seconds per question)

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• Rapid Cognitive Aptitude Rigor (ACER Melbourne High / MacRob Standard).
• Target high-pressure time limits with multi-variable word analogies, letter-code shift ciphers, deductive syllogisms, and number series matrices.

OFFICIAL ACER GENERAL ABILITY DOMAINS:
1. VERBAL REASONING & ANALOGIES (35%): Complex Word Analogies (A : B :: C : ?), antonyms/synonyms in context, odd-word-out categorization, and verbal classification.
2. LOGICAL DEDUCTION & SYLLOGISMS (35%): Deductive syllogisms (All A are B, Some B are C), truth-teller/liar scenarios, statement assumptions, and letter-code substitution ciphers (e.g., +3 / -2 shift rules).
3. NUMERICAL PATTERNS & SEQUENCES (30%): Number series with alternating operations (e.g., n^2 - 1, Fibonacci variants), 3x3 numerical grid matrices, and symbol-shape arithmetic equations.

FORMATTING RULES:
• 4 options (A, B, C, D) per question.
• Explanations must clearly state the exact transformation rule, logical deduction step, or arithmetic sequence formula.`;

export const getWaGateAsetPromptTemplate = () => `You are an official test developer for the Western Australia Gifted and Talented Secondary Selective Entrance Test (GATE ASET), administered by the WA Department of Education for entry into Perth Modern School and selective programs.

**Number of questions:** {QUESTION_COUNT}
**Target Cohort:** Top 3-5% academically gifted Year 6 students sitting for Year 7 entry.

COMPLEXITY & COGNITIVE RIGOR MANDATE:
• WA GATE ASET Aptitude Rigor across Quantitative Reasoning, Reading Comprehension, and Abstract Reasoning.
• Strictly NON-CALCULATOR. Demands lateral thinking, spatial pattern matrix deduction, high-level vocabulary, and multi-step non-routine math.

OFFICIAL WA GATE ASET DOMAINS:
1. QUANTITATIVE REASONING (40%): Multi-step rate and ratio problems, balance scale logic, number pattern matrices, combinatorics, and geometry area heuristics.
2. READING & HUMANITIES REASONING (35%): Short 100-250 word authentic extracts (literary fiction, science, history). Questions test deep inference, figurative language, tone, and authorial intention.
3. ABSTRACT & SPATIAL REASONING (25%): 3x3 geometric matrix patterns, folding 3D cubes from 2D nets, reflection/rotation transformation sequences, and set classification.

FORMATTING RULES:
• 4 options (A, B, C, D) per question.
• Explanations must explain the underlying quantitative shortcut, reading evidence, or spatial transformation rule.`;

export const MASTER_EXAM_REGISTRY = {
  // NAPLAN Suite
  naplan_numeracy: {
    id: 'naplan_numeracy',
    name: 'NAPLAN Numeracy',
    country: '🇦🇺 Australia',
    category: 'National Assessment',
    getPrompt: getNaplanNumeracyPromptTemplate
  },
  naplan_reading: {
    id: 'naplan_reading',
    name: 'NAPLAN Reading',
    country: '🇦🇺 Australia',
    category: 'National Assessment',
    getPrompt: getNaplanReadingPromptTemplate
  },
  naplan_conventions: {
    id: 'naplan_conventions',
    name: 'NAPLAN Language Conventions',
    country: '🇦🇺 Australia',
    category: 'National Assessment',
    getPrompt: getNaplanLanguageConventionsPromptTemplate
  },

  // NSW Selective Suite
  nsw_selective_reading: {
    id: 'nsw_selective_reading',
    name: 'NSW Selective: Reading',
    country: '🇦🇺 Australia',
    category: 'NSW Selective Schools',
    getPrompt: getNswSelectiveReadingPromptTemplate
  },
  nsw_selective_math: {
    id: 'nsw_selective_math',
    name: 'NSW Selective: Mathematical Reasoning',
    country: '🇦🇺 Australia',
    category: 'NSW Selective Schools',
    getPrompt: getNswSelectiveMathPromptTemplate
  },
  nsw_selective_thinking: {
    id: 'nsw_selective_thinking',
    name: 'NSW Selective: Thinking Skills',
    country: '🇦🇺 Australia',
    category: 'NSW Selective Schools',
    getPrompt: getNswSelectiveThinkingPromptTemplate
  },

  // Australian Mathematics Competition (AMC)
  amc_mathematics: {
    id: 'amc_mathematics',
    name: 'Australian Mathematics Competition (AMC)',
    country: '🇦🇺 Australia',
    category: 'National Competition',
    getPrompt: getAmcPromptTemplate
  },

  // ICAS Suite
  icas_mathematics: {
    id: 'icas_mathematics',
    name: 'ICAS Mathematics',
    country: '🇦🇺 Australia',
    category: 'National Competition',
    getPrompt: getIcasMathPromptTemplate
  },
  icas_science: {
    id: 'icas_science',
    name: 'ICAS Science',
    country: '🇦🇺 Australia',
    category: 'National Competition',
    getPrompt: getIcasSciencePromptTemplate
  },
  icas_english: {
    id: 'icas_english',
    name: 'ICAS English',
    country: '🇦🇺 Australia',
    category: 'National Competition',
    getPrompt: getIcasEnglishPromptTemplate
  },

  // State Selective Entry (VIC & WA)
  vic_selective_math: {
    id: 'vic_selective_math',
    name: 'VIC Selective Entry: Mathematical Reasoning',
    country: '🇦🇺 Australia',
    category: 'Victorian Selective Schools',
    getPrompt: getVicSehsMathPromptTemplate
  },
  vic_selective_general_ability: {
    id: 'vic_selective_general_ability',
    name: 'VIC Selective Entry: General Ability',
    country: '🇦🇺 Australia',
    category: 'Victorian Selective Schools',
    getPrompt: getVicSehsGeneralAbilityPromptTemplate
  },
  wa_gate_aset: {
    id: 'wa_gate_aset',
    name: 'WA GATE: Academic Selective Entrance Test (ASET)',
    country: '🇦🇺 Australia',
    category: 'WA Selective Schools',
    getPrompt: getWaGateAsetPromptTemplate
  },

  // US College Board & ACT Suite
  digital_sat_math: {
    id: 'digital_sat_math',
    name: 'Digital SAT Math Section',
    country: '🇺🇸 Global / USA',
    category: 'US College Board',
    getPrompt: getDigitalSatMathPromptTemplate
  },
  digital_sat_reading_writing: {
    id: 'digital_sat_reading_writing',
    name: 'Digital SAT Reading & Writing',
    country: '🇺🇸 Global / USA',
    category: 'US College Board',
    getPrompt: getDigitalSatRwPromptTemplate
  },
  act_mathematics: {
    id: 'act_mathematics',
    name: 'ACT Mathematics',
    country: '🇺🇸 USA',
    category: 'US College Admission',
    getPrompt: getActMathPromptTemplate
  },
  act_science: {
    id: 'act_science',
    name: 'ACT Science',
    country: '🇺🇸 USA',
    category: 'US College Admission',
    getPrompt: getActSciencePromptTemplate
  },

  // Olympiad & International Suite
  seamo_mathematics: {
    id: 'seamo_mathematics',
    name: 'SEAMO Mathematics Olympiad',
    country: '🌏 Asia / International',
    category: 'International Olympiad',
    getPrompt: getSeamoPromptTemplate
  }
};

// ─── 4. UNIFIED RESOLVER FUNCTIONS ───────────────────────────────────────────

/**
 * Returns the verified master prompt template from the Single Source of Truth.
 */
export const getMasterPrompt = (identifier) => {
  const norm = (identifier || '').toLowerCase().trim();
  const canonicalId = toCanonicalExamId(norm);

  if (MASTER_SUBJECT_REGISTRY[norm]) {
    return MASTER_SUBJECT_REGISTRY[norm].getPrompt();
  }
  if (MASTER_EXAM_REGISTRY[canonicalId]) {
    return MASTER_EXAM_REGISTRY[canonicalId].getPrompt();
  }
  if (MASTER_EXAM_REGISTRY[norm]) {
    return MASTER_EXAM_REGISTRY[norm].getPrompt();
  }
  // Try clean key match without punctuation/underscores
  const cleanNorm = canonicalId.replace(/[^a-z0-9]/g, '');
  const examKey = Object.keys(MASTER_EXAM_REGISTRY).find(k => k.replace(/[^a-z0-9]/g, '') === cleanNorm);
  if (examKey) {
    return MASTER_EXAM_REGISTRY[examKey].getPrompt();
  }
  return getGenericSubjectPromptTemplate(identifier);
};

/**
 * Resolves the effective prompt for a teacher:
 * 1. Checks teacher's isolated custom prompt first.
 * 2. Falls back to the master v2 registry.
 */
export const getEffectivePrompt = (identifier, customTeacherPrompts = {}) => {
  const norm = (identifier || '').toLowerCase().trim();
  if (customTeacherPrompts && customTeacherPrompts[norm]) {
    return customTeacherPrompts[norm];
  }
  return getMasterPrompt(norm);
};

/**
 * Retrieves platform-wide prompt visibility settings from Firestore.
 */
export const getPromptVisibilitySettings = async (db) => {
  if (!db) return {};
  try {
    const snap = await getDoc(doc(db, 'system', 'prompt_visibility_settings'));
    if (snap.exists()) {
      return snap.data().visibility || {};
    }
  } catch (err) {
    console.warn('Could not fetch prompt visibility settings:', err);
  }
  return {};
};

/**
 * Saves platform-wide prompt visibility settings (Admin only).
 */
export const savePromptVisibilitySettings = async (db, user, visibilitySettings) => {
  if (!db || !user?.email || user.email.toLowerCase().trim() !== ADMIN_EMAIL) return;
  try {
    await setDoc(doc(db, 'system', 'prompt_visibility_settings'), {
      visibility: visibilitySettings,
      updatedAt: new Date().toISOString(),
      updatedBy: user.email
    });
  } catch (err) {
    console.error('Failed to save prompt visibility settings:', err);
  }
};
