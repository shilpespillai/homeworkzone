import { doc, getDoc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';

export const ADMIN_EMAIL = 'shilpeshpillai81@gmail.com';

// Super users get unlimited usage but do NOT see the Admin Reports tab.
// Only ADMIN_EMAIL has full admin access.
export const SUPER_USER_EMAILS = [
  'manoj.jose.au@gmail.com',
];

export const getPremiumPromptTemplate = (subjectName) => {
  const capsSubject = (subjectName || '').charAt(0).toUpperCase() + (subjectName || '').slice(1);
  return `You are an expert educator and curriculum designer creating practice questions for an educational learning platform used by school students.

I am creating an educational app that helps students learn **${capsSubject}**.

Generate a high-quality practice paper based on the following details:

Subject: ${capsSubject}
Grade: {GRADE}
Topic: {TOPIC}
Difficulty Level: {DIFFICULTY}
Number of Questions: {QUESTION_COUNT}

Instructions:

• Calibrate all questions against official past-year released examination papers (${new Date().getFullYear() - 6}–${new Date().getFullYear()} active releases) for cognitive depth, difficulty tier, section structure, and current syllabus specifications.
• Zero Hallucinations: Guarantee 100% mathematical, logical, and factual accuracy. All calculations, dates, geometry dimensions, and scientific concepts must be verified.
• Zero Self-Answering / Answer Leaking: NEVER leak or reveal the correct answer inside the question text stem! Question text must contain ONLY the problem statement.
• Create engaging, age-appropriate questions that match the student's grade level.
• Questions should progressively increase in difficulty.
• Cover all important concepts within the specified topic.
• Avoid repeating similar questions.
• Use clear and simple language suitable for the selected grade.
• Ensure every question has only one correct answer without ambiguity.
• Use real-world examples wherever appropriate.
• Mix question types to maintain student engagement.

Include a balanced combination of question types such as:
- Multiple Choice Questions (MCQ)
- True or False
- Fill in the Blanks
- Match the Following
- Short Answer Questions
- Odd One Out (where applicable)`;
};

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
     d) Text input sentence construction ("Write a complete sentence using the word 'resilient'...").`;
};

export const DEFAULT_SUBJECT_PROMPTS = {
  maths: getPremiumPromptTemplate('Maths'),
  english: getPremiumPromptTemplate('English'),
  science: getPremiumPromptTemplate('Science'),
  vocabulary: getVocabularyPromptTemplate(),
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
    // 1. Try system doc first
    const sysDoc = await getDoc(doc(db, 'system', 'default_subject_prompts'));
    if (sysDoc.exists() && sysDoc.data().subjectPrompts) {
      const merged = { ...masterPrompts, ...sysDoc.data().subjectPrompts };
      if (!merged.vocabulary || merged.vocabulary.includes('Vocabulary & Word Power')) {
        merged.vocabulary = getVocabularyPromptTemplate();
      }
      return merged;
    }

    // 2. Query shilpeshpillai81@gmail.com teacher doc
    const q = query(collection(db, 'teachers'), where('email', '==', ADMIN_EMAIL));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const adminData = snap.docs[0].data();
      if (adminData.subjectPrompts) {
        const merged = { ...masterPrompts, ...adminData.subjectPrompts };
        if (!merged.vocabulary || merged.vocabulary.includes('Vocabulary & Word Power')) {
          merged.vocabulary = getVocabularyPromptTemplate();
        }
        return merged;
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
