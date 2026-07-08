import { generateContent } from './aiClient';

/**
 * Pre-generates explanations for ALL questions in a homework set.
 * Called once at homework creation time — results stored in Firestore.
 * Students read from Firestore at submission; zero runtime API calls needed.
 *
 * @param {Array}  questions - Array of question objects { id, text, options, answer, subtopic }
 * @param {string} subject   - e.g. 'maths', 'english', 'science'
 * @param {string} provider  - AI provider: 'gemini' | 'openai' | 'anthropic'
 * @returns {Promise<Object>} Map of { [questionId]: explanationString }
 */
export async function generateExplanations(questions, subject = 'general', provider = 'gemini') {
  if (!questions || questions.length === 0) return {};

  const isMath = subject?.toLowerCase() === 'maths' || subject?.toLowerCase() === 'math';

  const mathInstruction = isMath
    ? `CRITICAL (Math subject): Format each explanation as a clear step-by-step calculation. Show formulas and substitutions explicitly.
Example structure:
Step 1: Identify the values: ...
Step 2: Apply the operation: ...
Step 3: Final answer: ...`
    : '';

  const questionsFormatted = questions.map(q =>
    `ID: ${q.id}\nQuestion: "${q.text}"\nOptions: ${JSON.stringify(q.options)}\nCorrect Answer: "${q.answer}"\nSubtopic: "${q.subtopic || ''}"`
  ).join('\n\n');

  const prompt = `You are a friendly, highly-detailed, and accurate teacher preparing explanations for a ${subject} quiz.

For EACH question below, write an extremely detailed and encouraging explanation. You MUST follow this exact structure for EVERY explanation:

1. **Concept First**: Start by explicitly teaching the underlying concept or rule being tested. Explain the "why" and "how" before even mentioning the specific question. Do not skip this, even for the smallest or simplest questions.
2. **Step-by-Step Breakdown**: Walk through the problem step-by-step applying the concept.
3. **Correct Answer Validation**: State exactly why the correct answer is right.
4. **Incorrect Option Analysis**: Briefly explain why the other options are wrong (if relevant).

${mathInstruction}

CRITICAL FORMATTING RULES:
- Ensure the explanation is highly detailed.
- Use clear distinct steps.
- The step titles MUST be bolded (e.g., **Step 1: Identify the variables**).
- CRITICAL: You must output a valid JSON object. Do NOT use literal actual newlines inside your explanation strings. If you need a newline, use the exact characters "\\n".
- Escape any internal double quotes with a backslash (\\").

CRITICAL ACCURACY RULES:
- All mathematical calculations must be 100% correct — double-check arithmetic
- All scientific facts must be accurate
- All grammar/language explanations must be linguistically correct
- The explanation MUST justify the stated correct answer

Questions:
${questionsFormatted}

Return ONLY a valid JSON object where keys are the exact question IDs (as strings) and values are the explanation strings.
Example:
{
  "1": "The correct answer is 12 because 3 × 4 = 12...",
  "2": "Photosynthesis occurs in chloroplasts because..."
}

CRITICAL: Use the EXACT question ID numbers as keys. Do not add prefixes or extra text.`;

  try {
    const resultText = await generateContent({
      prompt,
      responseMimeType: 'application/json',
      provider
    });

    if (!resultText) return {};

    // Clean any markdown wrappers
    const clean = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(clean);

    // Normalize keys: ensure both numeric and string key lookups work
    const normalized = {};
    for (const [k, v] of Object.entries(parsed)) {
      normalized[k] = v;
    }
    return normalized;
  } catch (err) {
    console.error('[generateExplanations] Failed to pre-generate explanations:', err);
    return {}; // Non-fatal — student fallback AI call will handle it
  }
}
