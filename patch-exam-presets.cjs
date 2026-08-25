const fs = require('fs');

let content = fs.readFileSync('src/data/examPresets.js', 'utf-8');

const getTemplate = (examName, country) => `You are an elite academic assessment designer specializing in high-stakes scholarship and selective entry exams.

I am creating an educational app that prepares students for the **${examName}** (${country}).

Generate a highly rigorous, master-level practice paper based on the following details:

Subject / Exam: ${examName}
Grade: {GRADE}
Topic: {TOPIC}
Difficulty Level: {DIFFICULTY}
Number of Questions: {QUESTION_COUNT}

Instructions:

- CALIBRATION: Calibrate all questions against official past-year released examination papers for the ${examName} for the selected grade level. Match the exact cognitive depth, trick questions, distractors, and pacing expectations of the real exam.
- FRESHNESS GUARDRAIL: Generate completely unique, never-before-seen questions every time this prompt runs. Do not recycle standard examples. Use novel scenarios, varied names, and fresh data sets.
- ANSWER DISTRIBUTION: Randomize the correct answer options (A, B, C, D) evenly across the test so there is no predictable pattern.
- ZERO HALLUCINATIONS: Guarantee 100% mathematical, logical, and factual accuracy. 
- ZERO ANSWER LEAKING: NEVER leak or reveal the correct answer inside the question text stem!
- DIAGRAMMATIC & SPATIAL REASONING: If the exam format involves non-verbal, spatial, or diagrammatic reasoning, you MUST include questions that describe geometric patterns, folding paper, matrices, or visual sequences using highly descriptive text (e.g. "Imagine a 3x3 grid...").
- PROGRESSIVE DIFFICULTY: Questions should progressively increase in difficulty, ending with the hardest discriminator questions used to separate the top 1% of students.
- QUESTION TYPES: Strictly use the question formats native to the ${examName}. Include multiple-choice questions with highly plausible distractors.

Output ONLY the practice paper content.`;

const newExams = `,
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
    promptInstruction: \`${getTemplate('GATE (Gifted and Talented Education)', 'Australia')}\`,
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
    promptInstruction: \`${getTemplate('Opportunity Class (OC) Placement Test', 'Australia')}\`,
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
    promptInstruction: \`${getTemplate('ISEB Common Pre-Test', 'United Kingdom')}\`,
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
    promptInstruction: \`${getTemplate('SSAT (Secondary School Admission Test)', 'United States')}\`,
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
    promptInstruction: \`${getTemplate('ISEE (Independent School Entrance Exam)', 'United States')}\`,
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
    promptInstruction: \`${getTemplate('CogAT (Cognitive Abilities Test)', 'United States')}\`,
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
    promptInstruction: \`${getTemplate('SHSAT (Specialized High Schools Admissions Test)', 'United States')}\`,
  }
];`;

content = content.replace(/\r\n/g, '\n');
const targetStr = `  },
];`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, newExams);
  fs.writeFileSync('src/data/examPresets.js', content.replace(/\n/g, '\r\n'));
  console.log('Successfully patched examPresets.js');
} else {
  console.log('Target string not found');
}
