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

  // Chunk size of 3 to avoid Vercel 10s serverless timeouts
  const chunkSize = 3;
  const chunks = [];
  for (let i = 0; i < questions.length; i += chunkSize) {
    chunks.push(questions.slice(i, i + chunkSize));
  }

  const fetchChunk = async (chunk) => {
    const questionsFormatted = chunk.map(q =>
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
- ABSOLUTELY NO DOUBLE QUOTES inside the explanation strings! Use single quotes (' ') instead if you need to quote something. Unescaped double quotes will crash the JSON parser.

CRITICAL ACCURACY RULES:
- All mathematical calculations must be 100% correct — double-check arithmetic!
- All scientific facts must be accurate.
- The explanation must align with reality. If the provided 'Correct Answer' contains a blatant error (e.g., claiming 1234 is odd), DO NOT invent fake rules (like 'in this context') to justify it. Explain the actual true concept properly!

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

      const normalized = {};
      for (const [k, v] of Object.entries(parsed)) {
        normalized[k] = v;
      }
      return normalized;
    } catch (err) {
      console.error('[generateExplanations] Failed to pre-generate explanation chunk:', err);
      return {};
    }
  };

  // Run chunks sequentially to avoid 429 Too Many Requests limits (Free Tier)
  try {
    const allExplanations = {};
    for (const chunk of chunks) {
      const res = await fetchChunk(chunk);
      Object.assign(allExplanations, res);
      // Wait 1.5s between chunks to be safe against rate limits
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    return allExplanations;
  } catch (err) {
    console.error('[generateExplanations] Master fail:', err);
    return {};
  }
}
