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
    promptInstruction: `Generate an authentic NSW Selective School Placement Test paper for 'Thinking Skills'.
Include high-level questions covering:
- Logical deduction & Knights/Knaves logic
- Identifying flaws in arguments & assumptions
- Evaluating evidence & strength of arguments
- Spatial reasoning & Venn diagram logic
Ensure questions have 4 multiple-choice options with realistic distractor traps and clear step-by-step logic explanations.`
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
    promptInstruction: `Generate an authentic NSW Selective School Placement Test paper for 'Mathematical Reasoning'.
Include non-routine multi-step word problems, geometric spatial reasoning, ratio & proportion heuristics, perimeter/area of composite figures, and pattern sequences.`
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
    promptInstruction: `Generate an authentic Victorian Selective Entry High School Exam paper (Verbal & Numerical Reasoning).
Include word analogies, letter code cracking, number series completion, speed/work rate logic, and deductive syllogisms.`
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
    promptInstruction: `Generate an authentic ICAS UNSW Mathematics competition paper.
Include high-order problem solving, spatial visualization, modular number patterns, probability trees, combinatorics, and non-standard geometric puzzles.`
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
    promptInstruction: `Generate an authentic ICAS UNSW Science competition paper.
Focus on scientific inquiry: experimental variables (independent/dependent), data table analysis, graph interpretation, scientific controls, and hypothesis evaluation.`
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
    promptInstruction: `Generate an authentic ICAS Digital Technologies competition paper.
Cover pseudocode reading, binary/hexadecimal conversions, flowchart logic, computer hardware, network protocols, and cybersecurity scenario analysis.`
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
    promptInstruction: `Generate an authentic Australian NAPLAN Numeracy practice paper covering Australian Curriculum strands: Number & Algebra, Measurement & Geometry, and Statistics & Probability.`
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
    promptInstruction: `Generate an authentic Digital SAT Math practice paper.
Cover Algebra (systems of equations), Advanced Math (quadratics, exponentials), Problem-Solving & Data Analysis (percentages, statistics), and Geometry & Trigonometry.`
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
    promptInstruction: `Generate an authentic Digital SAT Reading & Writing paper with short passages covering Craft & Structure, Information & Ideas, and Standard English Conventions.`
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
    promptInstruction: `Generate an authentic UK 11+ Entrance Exam paper covering Verbal Reasoning (analogies, word codes, vocabulary) and Non-Verbal Reasoning (spatial transformations, matrix patterns).`
  }
];
