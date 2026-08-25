const fs = require('fs');

let content = fs.readFileSync('src/utils/defaultPrompts.js', 'utf-8');

const scholarshipFunction = `
export const getScholarshipPromptTemplate = (examName, country) => {
  return \`You are an elite academic assessment designer specializing in high-stakes scholarship and selective entry exams.

I am creating an educational app that prepares students for the **\${examName}** (\${country}).

Generate a highly rigorous, master-level practice paper based on the following details:

Subject / Exam: \${examName}
Grade: {GRADE}
Topic: {TOPIC}
Difficulty Level: {DIFFICULTY}
Number of Questions: {QUESTION_COUNT}

Instructions:

? CALIBRATION: Calibrate all questions against official past-year released examination papers for the \${examName} for the selected grade level. Match the exact cognitive depth, trick questions, distractors, and pacing expectations of the real exam.
? FRESHNESS GUARDRAIL: Generate completely unique, never-before-seen questions every time this prompt runs. Do not recycle standard examples. Use novel scenarios, varied names, and fresh data sets.
? ANSWER DISTRIBUTION: Randomize the correct answer options (A, B, C, D) evenly across the test so there is no predictable pattern.
? ZERO HALLUCINATIONS: Guarantee 100% mathematical, logical, and factual accuracy. 
? ZERO ANSWER LEAKING: NEVER leak or reveal the correct answer inside the question text stem!
? DIAGRAMMATIC & SPATIAL REASONING: If the exam format involves non-verbal, spatial, or diagrammatic reasoning, you MUST include questions that describe geometric patterns, folding paper, matrices, or visual sequences using highly descriptive text.
? PROGRESSIVE DIFFICULTY: Questions should progressively increase in difficulty, ending with the hardest discriminator questions used to separate the top 1% of students.
? QUESTION TYPES: Strictly use the question formats native to the \${examName}. Include multiple-choice questions with highly plausible distractors.

Output ONLY the practice paper content.\`;
};
`;

if (!content.includes('getScholarshipPromptTemplate')) {
  content = content.replace('export const getPremiumPromptTemplate', scholarshipFunction + '\nexport const getPremiumPromptTemplate');
}

const defaultSubjectsRegex = /export const DEFAULT_SUBJECT_PROMPTS = \{[\s\S]*?\n\};/;
const newDefaultSubjects = `export const DEFAULT_SUBJECT_PROMPTS = {
  maths: getPremiumPromptTemplate('Maths'),
  english: getPremiumPromptTemplate('English'),
  science: getPremiumPromptTemplate('Science'),
  vocabulary: getVocabularyPromptTemplate(),
  logical_reasoning: getPremiumPromptTemplate('Logical Reasoning'),
  olympiad: getPremiumPromptTemplate('Olympiad Maths'),
  hindi: getPremiumPromptTemplate('Hindi'),
  'acer_scholarship_(australia)': getScholarshipPromptTemplate('ACER / HAST Scholarship Exam', 'Australia'),
  'gate_(australia)': getScholarshipPromptTemplate('GATE (Gifted and Talented Education)', 'Australia'),
  'oc_test_(australia)': getScholarshipPromptTemplate('Opportunity Class (OC) Test', 'Australia'),
  '11_plus_cem_(uk)': getScholarshipPromptTemplate('11+ (Eleven Plus) CEM Format', 'United Kingdom'),
  '11_plus_gl_(uk)': getScholarshipPromptTemplate('11+ (Eleven Plus) GL Assessment Format', 'United Kingdom'),
  'iseb_pre_test_(uk)': getScholarshipPromptTemplate('ISEB Common Pre-Test', 'United Kingdom'),
  'ssat_(us)': getScholarshipPromptTemplate('SSAT (Secondary School Admission Test)', 'United States'),
  'isee_(us)': getScholarshipPromptTemplate('ISEE (Independent School Entrance Exam)', 'United States'),
  'cogat_(us)': getScholarshipPromptTemplate('CogAT (Cognitive Abilities Test)', 'United States'),
  'shsat_(us)': getScholarshipPromptTemplate('SHSAT (Specialized High Schools Admissions Test)', 'United States')
};`;

content = content.replace(defaultSubjectsRegex, newDefaultSubjects);

const mergeLogicRegex1 = /let adminPrompts = sysDoc\.data\(\)\.subjectPrompts;\s*\/\/ Filter out any explicitly nulled keys\s*Object\.keys\(adminPrompts\)\.forEach\(k => \{ if \(adminPrompts\[k\] === null\) delete adminPrompts\[k\]; \}\);\s*if \(\!adminPrompts\.vocabulary[\s\S]*?return adminPrompts;/;

const newMergeLogic1 = `let adminPrompts = sysDoc.data().subjectPrompts;
      let mergedPrompts = { ...masterPrompts };
      Object.keys(adminPrompts).forEach(k => {
        if (adminPrompts[k] === null) {
          delete mergedPrompts[k];
        } else {
          mergedPrompts[k] = adminPrompts[k];
        }
      });
      
      if (!mergedPrompts.vocabulary || mergedPrompts.vocabulary.includes('Vocabulary & Word Power')) {
        mergedPrompts.vocabulary = getVocabularyPromptTemplate();
      }
      return mergedPrompts;`;
content = content.replace(mergeLogicRegex1, newMergeLogic1);

const mergeLogicRegex2 = /let adminPrompts = adminData\.subjectPrompts;\s*Object\.keys\(adminPrompts\)\.forEach\(k => \{ if \(adminPrompts\[k\] === null\) delete adminPrompts\[k\]; \}\);\s*if \(\!adminPrompts\.vocabulary[\s\S]*?return adminPrompts;/;

const newMergeLogic2 = `let adminPrompts = adminData.subjectPrompts;
        let mergedPrompts = { ...masterPrompts };
        Object.keys(adminPrompts).forEach(k => {
          if (adminPrompts[k] === null) {
            delete mergedPrompts[k];
          } else {
            mergedPrompts[k] = adminPrompts[k];
          }
        });
        
        if (!mergedPrompts.vocabulary || mergedPrompts.vocabulary.includes('Vocabulary & Word Power')) {
          mergedPrompts.vocabulary = getVocabularyPromptTemplate();
        }
        return mergedPrompts;`;
content = content.replace(mergeLogicRegex2, newMergeLogic2);

fs.writeFileSync('src/utils/defaultPrompts.js', content);
console.log("Successfully patched defaultPrompts.js");
