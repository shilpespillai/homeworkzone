import { doc, getDoc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';

export const ADMIN_EMAIL = 'shilpeshpillai81@gmail.com';

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

• Create engaging, age-appropriate questions that match the student's grade level.
• Questions should progressively increase in difficulty.
• Cover all important concepts within the specified topic.
• Avoid repeating similar questions.
• Use clear and simple language suitable for the selected grade.
• Make the worksheet enjoyable and educational.
• Ensure every question has only one correct answer.
• Do not include ambiguous questions.
• Use real-world examples wherever appropriate.
• Mix question types to maintain student engagement.

Include a balanced combination of question types such as:
- Multiple Choice Questions (MCQ)
- True or False
- Fill in the Blanks
- Match the Following
- Short Answer Questions
- Picture-based questions (describe the image instead of generating one)
- Sequence or Ordering questions (when applicable)
- Odd One Out (where applicable)`;
};

export const DEFAULT_SUBJECT_PROMPTS = {
  maths: getPremiumPromptTemplate('Maths'),
  english: getPremiumPromptTemplate('English'),
  science: getPremiumPromptTemplate('Science'),
  vocabulary: getPremiumPromptTemplate('Vocabulary & Word Power'),
  logical_reasoning: getPremiumPromptTemplate('Logical Reasoning'),
  olympiad: getPremiumPromptTemplate('Olympiad Maths'),
  hindi: getPremiumPromptTemplate('Hindi')
};

/**
 * Fetches default subject prompts merged with any custom prompts added by admin (shilpeshpillai81@gmail.com)
 */
export const getMasterDefaultPrompts = async (db) => {
  let masterPrompts = { ...DEFAULT_SUBJECT_PROMPTS };
  if (!db) return masterPrompts;

  try {
    // 1. Try system doc first
    const sysDoc = await getDoc(doc(db, 'system', 'default_subject_prompts'));
    if (sysDoc.exists() && sysDoc.data().subjectPrompts) {
      return { ...masterPrompts, ...sysDoc.data().subjectPrompts };
    }

    // 2. Query shilpeshpillai81@gmail.com teacher doc
    const q = query(collection(db, 'teachers'), where('email', '==', ADMIN_EMAIL));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const adminData = snap.docs[0].data();
      if (adminData.subjectPrompts) {
        return { ...masterPrompts, ...adminData.subjectPrompts };
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
