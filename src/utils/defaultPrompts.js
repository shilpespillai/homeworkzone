import { doc, getDoc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { EXAM_PROFILES } from '../data/examProfiles';

export const ADMIN_EMAIL = 'shilpeshpillai81@gmail.com';

export const SUPER_USER_EMAILS = [
  'manoj.jose.au@gmail.com',
];

/**
 * Generic Any-Subject Homework Prompt Template (v2)
 */
export const getPremiumPromptTemplate = (subjectName) => {
  const capsSubject = (subjectName || 'General').charAt(0).toUpperCase() + (subjectName || 'General').slice(1);
  return `You are an experienced ${capsSubject} teacher writing a {DIFFICULTY}-difficulty practice paper for {GRADE} students, following the ACARA / national curriculum standards.

**Topic:** {TOPIC}
**Number of questions:** {QUESTION_COUNT}

## Style Target
Match the tone, depth, and cognitive demand typical of classroom ${capsSubject} assessments and curriculum materials for this year level.

## Cognitive Coverage
Distribute questions across genuinely distinct thinking skills:
1. Conceptual Understanding (core definitions, principles, and why mechanisms work)
2. Real-World Application & Authentic Context (practical scenarios)
3. Procedural Execution & Fluency (applying rules, methods, or syntax accurately)
4. Visual / Data Interpretation (charts, tables, diagrams where applicable)
5. Logical Reasoning & Deductive Justification (cause-and-effect, validation)
6. Multi-Step Problem Solving & Strategy (non-routine problems)
7. Error Analysis & Misconception Spotting (identifying flaws in sample reasoning)
8. Higher-Order Thinking & Synthesis (open-ended analysis and evaluation)

Order questions from foundational to advanced. Never repeat the same procedure with merely altered numbers.

## Question Types
- multiple_choice: exactly 4 options, one unambiguous correct answer matching target.
- text: short constructed response / numeric entry.

## Accuracy & Integrity
Every stated fact, calculation, and diagram value must be 100% verified and internally consistent with the solution. Work the solution through step-by-step.

## No Answer Leaking
The question stem must contain only the problem statement — never reveal or hint at the answer in the text.

## Explanations
Include a clear 2-4 sentence worked solution and rationale explaining why the answer is correct.`;
};

/**
 * Mathematics Homework Prompt (v2)
 */
export const getMathsPromptTemplate = () => {
  return `You are an experienced Maths teacher writing a {DIFFICULTY}-difficulty practice paper for {GRADE} students, following the curriculum.

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
};

/**
 * Science Homework Prompt (v2)
 */
export const getSciencePromptTemplate = () => {
  return `You are an experienced Science teacher writing a {DIFFICULTY}-difficulty practice paper for {GRADE} students, following the curriculum.

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
};

/**
 * English & Literacy Homework Prompt (v2)
 */
export const getEnglishPromptTemplate = () => {
  return `You are an experienced English teacher writing a {DIFFICULTY}-difficulty practice paper for {GRADE} students, following the curriculum.

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
};

/**
 * Vocabulary & Word Power Learning Guide Template (v2)
 */
export const getVocabularyPromptTemplate = () => {
  return `SPECIAL VOCABULARY & WORD POWER LEARNING MANDATE:
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
};

/**
 * NAPLAN Reading Prompt (v2)
 */
export const getNaplanReadingPromptTemplate = () => {
  return `You are an experienced literacy assessment writer creating a practice set in the style of NAPLAN Reading for Year {GRADE} students.

**Number of questions:** {QUESTION_COUNT}

## Style Target
Practice modelled on the NAPLAN Reading format. Write 2–3 short original passages spanning different text types appropriate to Year {GRADE} (narrative, informative report, persuasive argument, poem, or community notice).

## Cognitive Coverage
1. Literal Comprehension (directly stated details)
2. Inferential Comprehension (implied meaning, character motives)
3. Interpretation & Analysis (author's purpose, text structure, tone)
4. Vocabulary in Context
5. Language Conventions in Context

## Multi-Passage Schema Output
Provide passages in the "passages" array:
` + JSON.stringify({
  passages: [
    { id: 1, title: "Passage Title", textType: "narrative | informative | persuasive | poem", text: "Text content..." }
  ],
  questions: [
    {
      id: 1,
      passageId: 1,
      text: "Why does the character...",
      questionType: "multiple_choice",
      cognitiveSkill: "Inferential Comprehension",
      options: ["A", "B", "C", "D"],
      answer: "B",
      explanation: "Explanation referencing specific line evidence."
    }
  ]
}, null, 2) + `

Return ONLY valid JSON.`;
};

/**
 * NAPLAN Language Conventions Prompt (v2)
 */
export const getNaplanLanguageConventionsPromptTemplate = () => {
  return `You are an experienced literacy assessment writer creating a practice set in the style of NAPLAN Language Conventions for Year {GRADE} students.

**Number of questions:** {QUESTION_COUNT}

## Style Target
Practice modelled on the NAPLAN Language Conventions format. Questions are short, rule-based, and sentence-level testing Spelling, Grammar, and Punctuation.

## Question Patterns to Mix:
1. Spelling Correction: A sentence with one word misspelled — student types the correct spelling (questionType: "text").
2. Grammar Multiple Choice: A sentence with a blank or error — 4 options, one correct.
3. Identify the Error: Present a sentence and ask which underlined section contains the error.
4. Sentence Combining / Punctuation: Joining or punctuating sentences correctly.

## Cognitive Coverage:
- Spelling (40%): Common misspellings, homophones, prefixes, suffixes.
- Grammar (35%): Tense agreement, parts of speech, syntax.
- Punctuation (25%): Capitalisation, quotation marks, commas, apostrophes.

Return ONLY valid JSON matching the standard question schema.`;
};

export const DEFAULT_SUBJECT_PROMPTS = {
  maths: getMathsPromptTemplate(),
  science: getSciencePromptTemplate(),
  english: getEnglishPromptTemplate(),
  vocabulary: getVocabularyPromptTemplate(),
  naplan_reading: getNaplanReadingPromptTemplate(),
  naplan_language_conventions: getNaplanLanguageConventionsPromptTemplate(),
  logical_reasoning: getPremiumPromptTemplate('Logical Reasoning'),
  olympiad: getPremiumPromptTemplate('Olympiad Maths'),
  hindi: getPremiumPromptTemplate('Hindi')
};

/**
 * Fetches default subject prompts merged with any custom prompts added by admin (shilpeshpillai81@gmail.com)
 */
export const getMasterDefaultPrompts = async (db) => {
  let masterPrompts = { ...DEFAULT_SUBJECT_PROMPTS };
  masterPrompts.vocabulary = getVocabularyPromptTemplate();
  if (!db) return masterPrompts;

  try {
    const sysDoc = await getDoc(doc(db, 'system', 'default_subject_prompts'));
    if (sysDoc.exists() && sysDoc.data().subjectPrompts) {
      let adminPrompts = sysDoc.data().subjectPrompts;
      Object.keys(adminPrompts).forEach(k => { if (adminPrompts[k] === null) delete adminPrompts[k]; });
      
      if (!adminPrompts.vocabulary || adminPrompts.vocabulary.includes('Vocabulary & Word Power')) {
        adminPrompts.vocabulary = getVocabularyPromptTemplate();
      }
      return { ...masterPrompts, ...adminPrompts };
    }

    // Legacy fallback to admin teacher doc
    const q = query(collection(db, 'teachers'), where('email', '==', ADMIN_EMAIL));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const adminData = snap.docs[0].data();
      if (adminData.subjectPrompts) {
        let adminPrompts = adminData.subjectPrompts;
        Object.keys(adminPrompts).forEach(k => { if (adminPrompts[k] === null) delete adminPrompts[k]; });
        return { ...masterPrompts, ...adminPrompts };
      }
    }
  } catch (err) {
    console.warn("Failed to fetch master default prompts from Firestore:", err);
  }

  return masterPrompts;
};

/**
 * Saves prompts to system default if user is shilpeshpillai81@gmail.com
 */
export const saveMasterDefaultPromptsIfAdmin = async (db, user, prompts) => {
  if (!db || !user?.email || !prompts) return;
  if (user.email.toLowerCase().trim() === ADMIN_EMAIL) {
    try {
      await setDoc(doc(db, 'system', 'default_subject_prompts'), {
        subjectPrompts: prompts,
        updatedAt: new Date().toISOString(),
        updatedBy: user.email
      }, { merge: true });
    } catch (err) {
      console.error("Failed to save admin default prompts to system doc:", err);
    }
  }
};
