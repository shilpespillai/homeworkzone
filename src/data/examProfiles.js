/**
 * Master Exam Profiles Registry (v2)
 * Decoupled data profiles for standardized tests and competitions.
 * Defines calculator policy, answer choice count, domain breakdown, cognitive depth, and timing.
 */

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

  act_math_enhanced: {
    exam_id: "act_math_enhanced",
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

  naplan_language_conventions: {
    exam_id: "naplan_language_conventions",
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

  icas_mathematics: {
    exam_id: "icas_mathematics",
    display_name: "ICAS Mathematics Practice (Unofficial)",
    governing_body: "UNSW Global (ICAS Assessments)",
    year_levels: "Years 2 through 12 (Papers Introductory to J)",
    question_count_per_section: 40,
    time_limit_per_section: "45–60 minutes depending on year level",
    calculator_policy: "non-calculator for primary papers",
    answer_choice_count: 4,
    question_type_mix: "35 multiple_choice + 5 free-response",
    content_domains: [
      { name: "Number and Arithmetic / Algebra", weight_pct: 40 },
      { name: "Measures and Geometry", weight_pct: 35 },
      { name: "Chance and Data", weight_pct: 25 }
    ],
    difficulty_ordering: "ascending — questions increase in complexity through the paper",
    explanation_depth: "2-4 sentence worked solution",
    svg_visual_target_pct: 35,
    trademark_note: "ICAS is a registered trademark of UNSW Global",
    last_verified: "2026-09-02"
  },

  seamo_mathematics: {
    exam_id: "seamo_mathematics",
    display_name: "SEAMO Mathematics Olympiad Practice (Unofficial)",
    governing_body: "SEAMO Official / Terry Chew Academy",
    year_levels: "Paper K (Kindergarten) through Paper F (Grade 12)",
    question_count_per_section: { section_A_mcq: 10, section_B_mcq: 5, total: 15 },
    time_limit_per_section: "60–90 minutes depending on division",
    calculator_policy: "strictly prohibited",
    answer_choice_count: 4,
    question_type_mix: "multiple_choice heuristics and non-routine problem solving",
    content_domains: [
      { name: "Number Theory and Combinatorics", weight_pct: 40 },
      { name: "Geometry and Spatial Heuristics", weight_pct: 30 },
      { name: "Logic Puzzles and Model Method", weight_pct: 30 }
    ],
    difficulty_ordering: "ascending — Olympiad high-order heuristics",
    explanation_depth: "full step-by-step heuristic proof",
    svg_visual_target_pct: 40,
    trademark_note: "SEAMO is a trademark of Terry Chew Academy",
    last_verified: "2026-09-02"
  },

  nsw_selective_math: {
    exam_id: "nsw_selective_math",
    display_name: "NSW Selective Mathematical Reasoning Practice (Unofficial)",
    governing_body: "NSW Department of Education",
    year_levels: "Year 5 & 6 (Year 7 entry)",
    question_count_per_section: 35,
    time_limit_per_section: "40 minutes",
    calculator_policy: "strictly prohibited (non-calculator problem solving)",
    answer_choice_count: 4,
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
    last_verified: "2026-09-02"
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
    last_verified: "2026-09-02"
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
    last_verified: "2026-09-02"
  }
};
