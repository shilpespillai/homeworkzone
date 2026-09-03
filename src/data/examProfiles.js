/**
 * Master Exam Profiles Registry (v2) - Single Source of Truth
 * Decoupled canonical data profiles for standardized tests and competitions.
 * Defines calculator policy, answer choice count, domain breakdown, cognitive depth, and timing.
 */

// Legacy Alias Map for 100% Zero-Breakage Backward Compatibility
export const CANONICAL_EXAM_ID_MAP = {
  // NAPLAN
  'naplan_language_conventions': 'naplan_conventions',
  // AMC
  'amc_math_comp': 'amc_mathematics',
  'amc_primary': 'amc_mathematics',
  'amc': 'amc_mathematics',
  // ICAS
  'icas_math': 'icas_mathematics',
  'au_icas_maths': 'icas_mathematics',
  'nz_icas_maths': 'icas_mathematics',
  // VIC Selective
  'vic_selective_entry': 'vic_selective_general_ability',
  'vic_sehs_maths_reasoning': 'vic_selective_math',
  'vic_sehs_general_ability': 'vic_selective_general_ability',
  // WA GATE
  'wa_gate_aasta': 'wa_gate_aset',
  // ACT & SAT
  'act_math_enhanced': 'act_mathematics',
  'act_math': 'act_mathematics',
  'digital_sat_rw': 'digital_sat_reading_writing',
  // SEAMO
  'seamo_paper': 'seamo_mathematics'
};

export const toCanonicalExamId = (id) => {
  if (!id) return id;
  const norm = String(id).toLowerCase().trim();
  return CANONICAL_EXAM_ID_MAP[norm] || norm;
};

export const EXAM_PROFILES = {
  digital_sat_math: {
    exam_id: "digital_sat_math",
    display_name: "Digital SAT Math Practice (Unofficial)",
    governing_body: "College Board",
    year_levels: "High school (Grade 11-12)",
    question_count_per_section: { module_1: 22, module_2: 22, total: 44 },
    time_limit_per_section: "70 minutes total (35 min per module)",
    calculator_policy: "always — allowed on every question (no non-calculator module in digital format)",
    answer_choice_count: 4,
    question_type_mix: "~75% multiple_choice (4 options), ~25% free numeric entry (student-produced response)",
    content_domains: [
      { name: "Algebra", weight_pct: 35 },
      { name: "Advanced Math", weight_pct: 35 },
      { name: "Problem-Solving and Data Analysis", weight_pct: 15 },
      { name: "Geometry and Trigonometry", weight_pct: 15 }
    ],
    difficulty_ordering: "adaptive — Module 2 difficulty depends on Module 1 performance",
    explanation_depth: "2-4 sentence worked solution",
    svg_visual_target_pct: 25,
    trademark_note: "SAT is a trademark of the College Board, which is not affiliated with and does not endorse this product",
    last_verified: "2026-09-02"
  },

  digital_sat_reading_writing: {
    exam_id: "digital_sat_reading_writing",
    display_name: "Digital SAT Reading & Writing Practice (Unofficial)",
    governing_body: "College Board",
    year_levels: "High school (Grade 11-12)",
    question_count_per_section: { module_1: 27, module_2: 27, total: 54 },
    time_limit_per_section: "64 minutes total (32 min per module)",
    calculator_policy: "not applicable",
    answer_choice_count: 4,
    question_type_mix: "100% multiple_choice (1 short passage 25-150 words per question)",
    content_domains: [
      { name: "Craft and Structure (words in context, text purpose)", weight_pct: 28 },
      { name: "Information and Ideas (central ideas, evidence, inference)", weight_pct: 26 },
      { name: "Standard English Conventions (boundaries, syntax)", weight_pct: 26 },
      { name: "Expression of Ideas (rhetorical synthesis, transitions)", weight_pct: 20 }
    ],
    difficulty_ordering: "adaptive — Section 2 depends on Section 1 score",
    explanation_depth: "2-4 sentence evidence citation",
    svg_visual_target_pct: 10,
    trademark_note: "SAT is a trademark of the College Board",
    last_verified: "2026-09-02"
  },

  act_mathematics: {
    exam_id: "act_mathematics",
    display_name: "Enhanced ACT Math Practice (Unofficial)",
    governing_body: "ACT, Inc.",
    year_levels: "High school (Grade 11-12)",
    question_count_per_section: 45,
    time_limit_per_section: "50 minutes",
    calculator_policy: "always — allowed throughout the Math section",
    answer_choice_count: 4,
    question_type_mix: "100% multiple_choice (4 options under Enhanced ACT format)",
    content_domains: [
      { name: "Preparing for Higher Math (number, algebra, functions, geometry, stats)", weight_pct: 60 },
      { name: "Integrating Essential Skills", weight_pct: 40 }
    ],
    difficulty_ordering: "ascending — arranged easiest to hardest within the section",
    explanation_depth: "2-4 sentence worked solution",
    svg_visual_target_pct: 25,
    trademark_note: "ACT is a registered trademark of ACT, Inc., which is not affiliated with and does not endorse this product",
    last_verified: "2026-09-02"
  },

  act_science: {
    exam_id: "act_science",
    display_name: "ACT Science Practice (Unofficial)",
    governing_body: "ACT, Inc.",
    year_levels: "High school (Grade 11-12)",
    question_count_per_section: 40,
    time_limit_per_section: "35 minutes",
    calculator_policy: "not applicable",
    answer_choice_count: 4,
    question_type_mix: "100% multiple_choice based on research summaries & data charts",
    content_domains: [
      { name: "Research Summaries & Experimental Design", weight_pct: 45 },
      { name: "Data Representation & Trends", weight_pct: 35 },
      { name: "Conflicting Viewpoints", weight_pct: 20 }
    ],
    difficulty_ordering: "passage-grouped",
    explanation_depth: "2-4 sentence scientific rationale",
    svg_visual_target_pct: 35,
    trademark_note: "ACT is a registered trademark of ACT, Inc.",
    last_verified: "2026-09-02"
  },

  naplan_numeracy: {
    exam_id: "naplan_numeracy",
    display_name: "NAPLAN Numeracy Practice (Unofficial)",
    governing_body: "ACARA (administered by state test authorities)",
    year_levels: "Years 3, 5, 7, 9",
    question_count_per_section: { year_3: 35, year_5: 40, year_7: 45, year_9: 45 },
    time_limit_per_section: "Year 3: ~45 min, Year 5: ~50 min, Years 7 & 9: ~65 min",
    calculator_policy: "Years 3 & 5: non-calculator only. Years 7 & 9: non-calculator section followed by calculator section",
    answer_choice_count: 4,
    question_type_mix: "mixed multiple_choice and short constructed-response (typed numeric entry)",
    content_domains: [
      { name: "Number and Algebra", weight_pct: 45 },
      { name: "Measurement and Geometry", weight_pct: 35 },
      { name: "Statistics and Probability", weight_pct: 20 }
    ],
    difficulty_ordering: "computer-adaptive difficulty",
    explanation_depth: "2-4 sentence worked solution",
    svg_visual_target_pct: 40,
    trademark_note: "NAPLAN is an assessment program of ACARA; not affiliated with or endorsed by ACARA",
    last_verified: "2026-09-02"
  },

  naplan_reading: {
    exam_id: "naplan_reading",
    display_name: "NAPLAN Reading Practice (Unofficial)",
    governing_body: "ACARA",
    year_levels: "Years 3, 5, 7, 9",
    question_count_per_section: { year_3: 35, year_5: 38, year_7: 45, year_9: 45 },
    time_limit_per_section: "Years 3 & 5: ~45-50 min, Years 7 & 9: ~65 min",
    calculator_policy: "not applicable",
    answer_choice_count: 4,
    question_type_mix: "multiple_choice and short text responses across 2-4 original stimulus passages",
    content_domains: [
      { name: "Literal comprehension", weight_pct: 25 },
      { name: "Inferential comprehension", weight_pct: 45 },
      { name: "Interpretation and analysis (author's craft, purpose, tone)", weight_pct: 30 }
    ],
    difficulty_ordering: "computer-adaptive difficulty",
    explanation_depth: "2-4 sentences referencing specific passage lines",
    svg_visual_target_pct: 0,
    passage_notes: "Multiple passages across different genres (narrative, report, persuasive, poem, notice)",
    trademark_note: "NAPLAN is an assessment program of ACARA",
    last_verified: "2026-09-02"
  },

  naplan_conventions: {
    exam_id: "naplan_conventions",
    display_name: "NAPLAN Language Conventions Practice (Unofficial)",
    governing_body: "ACARA",
    year_levels: "Years 3, 5, 7, 9",
    question_count_per_section: { year_3: 45, year_5: 50, year_7: 50, year_9: 50 },
    time_limit_per_section: "Years 3 & 5: ~40 min, Years 7 & 9: ~45 min",
    calculator_policy: "not applicable",
    answer_choice_count: 4,
    question_type_mix: "typed spelling correction (text) + multiple_choice grammar/punctuation",
    content_domains: [
      { name: "Spelling (common misspellings, homophones, prefixes/suffixes)", weight_pct: 40 },
      { name: "Grammar (tense agreement, parts of speech, syntax)", weight_pct: 35 },
      { name: "Punctuation (capitalisation, quotation marks, commas, apostrophes)", weight_pct: 25 }
    ],
    difficulty_ordering: "ascending within section",
    explanation_depth: "1-2 sentence grammar or spelling rule rationale",
    svg_visual_target_pct: 0,
    trademark_note: "NAPLAN is an assessment program of ACARA",
    last_verified: "2026-09-02"
  },

  amc_mathematics: {
    exam_id: "amc_mathematics",
    display_name: "Australian Mathematics Competition Practice (Unofficial)",
    governing_body: "Australian Maths Trust (AMT)",
    year_levels: "Middle Primary (Years 3-4), Upper Primary (Years 5-6), Junior (Years 7-8), Intermediate (Years 9-10), Senior (Years 11-12)",
    question_count_per_section: 30,
    time_limit_per_section: "Primary: 60 minutes, Secondary: 75 minutes",
    calculator_policy: "strictly prohibited across all divisions",
    answer_choice_count: 5,
    question_type_mix: "Questions 1-25: multiple_choice (5 options: A, B, C, D, E); Questions 26-30: integer-only constructed response (0-999)",
    content_domains: [
      { name: "Non-routine Problem Solving & Logic", weight_pct: 40 },
      { name: "Number Theory & Arithmetic Patterns", weight_pct: 30 },
      { name: "Geometry & Spatial Reasoning", weight_pct: 20 },
      { name: "Combinatorics & Counting", weight_pct: 10 }
    ],
    difficulty_ordering: "escalating mark structure: Q1-10 (3 marks), Q11-20 (4 marks), Q21-25 (5 marks), Q26-30 (6-10 marks escalating)",
    explanation_depth: "full step-by-step mathematical proof",
    svg_visual_target_pct: 35,
    trademark_note: "Australian Mathematics Competition is an activity of the Australian Maths Trust; practice paper is unofficial and independent",
    last_verified: "2026-09-03"
  },

  icas_mathematics: {
    exam_id: "icas_mathematics",
    display_name: "ICAS Mathematics Practice (Unofficial)",
    governing_body: "Janison / UNSW Educational Assessment Australia (EAA)",
    year_levels: "Introductory (Year 2) to Level J (Year 12)",
    question_count_per_section: 35,
    time_limit_per_section: "45 minutes",
    calculator_policy: "strictly prohibited across all competition levels",
    answer_choice_count: 4,
    question_type_mix: "100% multiple_choice with high-order reasoning & non-routine problem solving",
    content_domains: [
      { name: "High-Order Problem Solving (combinatorics, path counting, pigeonhole)", weight_pct: 30 },
      { name: "Spatial & Graphical Visualization (nets, 3D solids, symmetry)", weight_pct: 25 },
      { name: "Number Patterns & Algebra (cryptarithms, modular arithmetic)", weight_pct: 25 },
      { name: "Data & Chance (probability trees, 3-set Venn diagrams)", weight_pct: 20 }
    ],
    difficulty_ordering: "progressive cognitive complexity ending in Olympiad-tier challenge",
    explanation_depth: "concise multi-step solution pathway",
    svg_visual_target_pct: 40,
    trademark_note: "ICAS is a registered trademark of Janison Solutions Pty Ltd; practice is unofficial and independent",
    last_verified: "2026-09-03"
  },

  icas_science: {
    exam_id: "icas_science",
    display_name: "ICAS Science Practice (Unofficial)",
    governing_body: "Janison / UNSW EAA",
    year_levels: "Level A (Year 3) to Level J (Year 12)",
    question_count_per_section: 30,
    time_limit_per_section: "45 minutes",
    calculator_policy: "not applicable",
    answer_choice_count: 4,
    question_type_mix: "100% multiple_choice data-interpretation and experimental reasoning",
    content_domains: [
      { name: "Observing & Measuring (scientific instruments, data units)", weight_pct: 30 },
      { name: "Interpreting Data (graphs, trend extrapolation)", weight_pct: 40 },
      { name: "Investigating & Experimental Design (controls, hypotheses)", weight_pct: 30 }
    ],
    difficulty_ordering: "progressive data complexity",
    explanation_depth: "2-4 sentence scientific rationale",
    svg_visual_target_pct: 40,
    trademark_note: "ICAS is a registered trademark of Janison Solutions Pty Ltd",
    last_verified: "2026-09-03"
  },

  icas_english: {
    exam_id: "icas_english",
    display_name: "ICAS English Practice (Unofficial)",
    governing_body: "Janison / UNSW EAA",
    year_levels: "Level A (Year 3) to Level J (Year 12)",
    question_count_per_section: 35,
    time_limit_per_section: "45 minutes",
    calculator_policy: "not applicable",
    answer_choice_count: 4,
    question_type_mix: "100% multiple_choice reading comprehension and literary appreciation",
    content_domains: [
      { name: "Reading for Meaning (inferential comprehension, nuances)", weight_pct: 45 },
      { name: "Textual Analysis & Authorial Craft (metaphor, tone, syntax)", weight_pct: 35 },
      { name: "Vocabulary & Language Conventions in Context", weight_pct: 20 }
    ],
    difficulty_ordering: "passage-grouped",
    explanation_depth: "2-4 sentences citing textual nuance",
    svg_visual_target_pct: 0,
    trademark_note: "ICAS is a registered trademark of Janison Solutions Pty Ltd",
    last_verified: "2026-09-03"
  },

  seamo_mathematics: {
    exam_id: "seamo_mathematics",
    display_name: "SEAMO Mathematics Olympiad Practice (Unofficial)",
    governing_body: "Southeast Asian Mathematical Olympiad / Terry Chew Academy",
    year_levels: "Paper A (Grade 1-2) to Paper F (Grade 11-12)",
    question_count_per_section: 25,
    time_limit_per_section: "90 minutes",
    calculator_policy: "strictly prohibited",
    answer_choice_count: 4,
    question_type_mix: "Section A (Multiple Choice, 1-20) + Section B (Free Numerical Response, 21-25)",
    content_domains: [
      { name: "Number Theory & Combinatorics (pigeonhole, parity, divisibility)", weight_pct: 40 },
      { name: "Geometry & Spatial Heuristics (model method, area transformations)", weight_pct: 30 },
      { name: "Logic & Non-Routine Heuristics (working backwards, pattern induction)", weight_pct: 30 }
    ],
    difficulty_ordering: "steep Olympiad difficulty curve",
    explanation_depth: "full step-by-step heuristic proof",
    svg_visual_target_pct: 30,
    trademark_note: "SEAMO is an international Olympiad; practice is unofficial and modelled on competition syllabus",
    last_verified: "2026-09-03"
  },

  nsw_selective_math: {
    exam_id: "nsw_selective_math",
    display_name: "NSW Selective Mathematical Reasoning Practice (Unofficial)",
    governing_body: "NSW Department of Education (Janison format)",
    year_levels: "Year 5 & 6 (Year 7 entry)",
    question_count_per_section: 35,
    time_limit_per_section: "40 minutes",
    calculator_policy: "strictly prohibited (non-calculator problem solving)",
    answer_choice_count: 5,
    question_type_mix: "100% multiple_choice with Australian context word problems",
    content_domains: [
      { name: "Number & Algebra (ratio transfers, Gauss sums, rates)", weight_pct: 40 },
      { name: "Measurement & Geometry (composite area, angle transversals, nets)", weight_pct: 35 },
      { name: "Statistics & Probability (multi-bar data, combinations)", weight_pct: 25 }
    ],
    difficulty_ordering: "mixed non-routine heuristics",
    explanation_depth: "2-4 sentence worked solution",
    svg_visual_target_pct: 40,
    trademark_note: "NSW Selective is a program of the NSW Department of Education",
    last_verified: "2026-09-03"
  },

  nsw_selective_thinking: {
    exam_id: "nsw_selective_thinking",
    display_name: "NSW Selective Thinking Skills Practice (Unofficial)",
    governing_body: "NSW Department of Education",
    year_levels: "Year 5 & 6 (Year 7 entry)",
    question_count_per_section: 40,
    time_limit_per_section: "40 minutes",
    calculator_policy: "not applicable",
    answer_choice_count: 4,
    question_type_mix: "100% multiple_choice logic puzzles and debate scenarios",
    content_domains: [
      { name: "Logical Reasoning (deductive/inductive, truth-tellers, conditional logic)", weight_pct: 30 },
      { name: "Identifying Flaws & Assumptions (fallacies, unstated premises)", weight_pct: 25 },
      { name: "Evaluating Evidence & Arguments (strengthen/weaken claims)", weight_pct: 25 },
      { name: "Spatial & Data Logic (Venn overlaps, decision networks)", weight_pct: 20 }
    ],
    difficulty_ordering: "mixed cognitive difficulty",
    explanation_depth: "step-by-step logical proof",
    svg_visual_target_pct: 25,
    trademark_note: "NSW Selective is a program of the NSW Department of Education",
    last_verified: "2026-09-03"
  },

  nsw_selective_reading: {
    exam_id: "nsw_selective_reading",
    display_name: "NSW Selective Reading Practice (Unofficial)",
    governing_body: "NSW Department of Education",
    year_levels: "Year 5 & 6 (Year 7 entry)",
    question_count_per_section: 30,
    time_limit_per_section: "40 minutes",
    calculator_policy: "not applicable",
    answer_choice_count: 4,
    question_type_mix: "multiple_choice across 3-4 literary and non-fiction texts",
    content_domains: [
      { name: "Literal comprehension", weight_pct: 20 },
      { name: "Inferential comprehension", weight_pct: 45 },
      { name: "Vocabulary in context & Authorial craft", weight_pct: 35 }
    ],
    difficulty_ordering: "passage-grouped",
    explanation_depth: "2-4 sentences referencing passage evidence",
    svg_visual_target_pct: 0,
    trademark_note: "NSW Selective is a program of the NSW Department of Education",
    last_verified: "2026-09-03"
  },

  vic_selective_math: {
    exam_id: "vic_selective_math",
    display_name: "VIC Selective Entry Mathematical Reasoning Practice (Unofficial)",
    governing_body: "ACER (on behalf of Victorian Department of Education)",
    year_levels: "Year 8 sitting for Year 9 entry (Melbourne High, MacRob, Nossal, Suzanne Cory)",
    question_count_per_section: 35,
    time_limit_per_section: "30 minutes",
    calculator_policy: "strictly prohibited (non-calculator reasoning)",
    answer_choice_count: 4,
    question_type_mix: "100% multiple_choice aptitude & non-routine problem solving",
    content_domains: [
      { name: "Number and algebraic reasoning", weight_pct: 40 },
      { name: "Measurement and spatial reasoning", weight_pct: 35 },
      { name: "Data and logical problem-solving", weight_pct: 25 }
    ],
    difficulty_ordering: "ascending in complexity",
    explanation_depth: "2-4 sentence worked solution",
    svg_visual_target_pct: 30,
    trademark_note: "ACER Selective Entry test; practice modelled on format",
    last_verified: "2026-09-03"
  },

  vic_selective_general_ability: {
    exam_id: "vic_selective_general_ability",
    display_name: "VIC Selective Entry General Ability Practice (Unofficial)",
    governing_body: "ACER",
    year_levels: "Year 8 sitting for Year 9 entry",
    question_count_per_section: 40,
    time_limit_per_section: "30 minutes",
    calculator_policy: "not applicable",
    answer_choice_count: 4,
    question_type_mix: "Verbal reasoning (analogies, deductions) and Quantitative logic",
    content_domains: [
      { name: "Verbal Analogies & Classification", weight_pct: 35 },
      { name: "Logical Deduction & Syllogisms", weight_pct: 35 },
      { name: "Numerical Patterns & Sequences", weight_pct: 30 }
    ],
    difficulty_ordering: "speed-based cognitive reasoning",
    explanation_depth: "concise logical rule explanation",
    svg_visual_target_pct: 20,
    trademark_note: "ACER Selective Entry test; practice modelled on format",
    last_verified: "2026-09-03"
  },

  wa_gate_aset: {
    exam_id: "wa_gate_aset",
    display_name: "WA GATE ASET Practice (Unofficial)",
    governing_body: "WA Department of Education",
    year_levels: "Year 6 sitting for Year 7 entry (Perth Modern & Selective Programs)",
    question_count_per_section: 35,
    time_limit_per_section: "35 minutes",
    calculator_policy: "strictly prohibited",
    answer_choice_count: 4,
    question_type_mix: "Reading Comprehension, Quantitative Reasoning, Abstract Reasoning",
    content_domains: [
      { name: "Quantitative Reasoning & Problem Solving", weight_pct: 40 },
      { name: "Reading Comprehension", weight_pct: 35 },
      { name: "Abstract & Spatial Pattern Matrices", weight_pct: 25 }
    ],
    difficulty_ordering: "mixed aptitude difficulty",
    explanation_depth: "step-by-step strategy rationale",
    svg_visual_target_pct: 25,
    trademark_note: "WA GATE ASET is an assessment of the WA Department of Education",
    last_verified: "2026-09-03"
  }
};
