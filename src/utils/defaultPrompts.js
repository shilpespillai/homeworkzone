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
  logical_reasoning: getPremiumPromptTemplate('Logical Reasoning'),
  olympiad: getPremiumPromptTemplate('Olympiad Maths')
};
