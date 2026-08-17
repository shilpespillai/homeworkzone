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
    ? `CRITICAL (Math subject): State the direct calculation clearly and concisely.`
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

    const prompt = `You are a dedicated, expert teacher preparing clear, step-by-step explanations and worked methods for a ${subject} assessment.

For EACH question below, write a clear, educational, step-by-step explanation showing the exact method, formula, and logic used to arrive at the correct answer:
- For Mathematics / Science calculations: Clearly break down each step (e.g. Step 1: Calculate unit rate or value. Step 2: Perform the comparison or arithmetic operation. Step 3: Conclude with the final result).
- For English / Grammar / Reading / Vocabulary: State the underlying grammatical rule or textual evidence clearly so the student learns why the answer is correct.
- Write 2 to 4 informative, helpful sentences that explain the solution clearly.

${mathInstruction}

CRITICAL FORMATTING RULES:
- CRITICAL: You must output a valid JSON object. Do NOT use literal actual newlines inside your explanation strings. If you need a newline, use the exact characters "\\n".
- ABSOLUTELY NO DOUBLE QUOTES inside the explanation strings! Use single quotes (' ') instead if you need to quote something. Unescaped double quotes will crash the JSON parser.

CRITICAL ACCURACY RULES:
- All mathematical calculations must be 100% correct — double-check arithmetic!
- All facts must be accurate.

Questions:
${questionsFormatted}

Return ONLY a valid JSON object where keys are the exact question IDs (as strings) and values are the explanation strings.
Example:
{
  "1": "Step 1: Calculate the cost per juice box for Pack A ($6.00 ÷ 4 = $1.50). Step 2: Calculate the cost per juice box for Pack B ($7.80 ÷ 6 = $1.30). Step 3: Find the difference ($1.50 - $1.30 = $0.20). Therefore, the difference is $0.20.",
  "2": "Photosynthesis occurs in the chloroplasts of plant cells because they contain the green pigment chlorophyll, which captures sunlight to produce glucose and oxygen."
}

CRITICAL: Use the EXACT question ID numbers as keys.`;

    try {
      const resultText = await generateContent({
        prompt,
        responseMimeType: 'application/json',
        provider
      });

      if (!resultText) return {};

      // Clean any markdown wrappers
      const clean = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
      let parsed;
      try {
        parsed = JSON.parse(clean);
      } catch (jsonErr) {
        console.warn('[generateExplanations] Standard JSON parse failed, trying loose parser...', jsonErr);
        parsed = {};
        const keyPositions = [];
        const keyRegex = /(?:[{,]\s*)"(\d+)"\s*:\s*"/g;
        let match;
        while ((match = keyRegex.exec(clean)) !== null) {
          const keyStart = match[0].indexOf(`"${match[1]}"`);
          const absoluteKeyStart = match.index + keyStart;
          keyPositions.push({
            key: match[1],
            index: absoluteKeyStart,
            valueStartIndex: match.index + match[0].length
          });
        }
        for (let i = 0; i < keyPositions.length; i++) {
          const current = keyPositions[i];
          const next = keyPositions[i + 1];
          let rawValue = next 
            ? clean.substring(current.valueStartIndex, next.index) 
            : clean.substring(current.valueStartIndex);
          rawValue = rawValue.trim();
          if (rawValue.endsWith(',')) {
            rawValue = rawValue.slice(0, -1).trim();
          }
          if (rawValue.endsWith('}')) {
            rawValue = rawValue.slice(0, -1).trim();
          }
          if (rawValue.endsWith('"')) {
            rawValue = rawValue.slice(0, -1);
          }
          parsed[current.key] = rawValue
            .replace(/\\"/g, '"')
            .replace(/\\n/g, '\n')
            .replace(/\\\\/g, '\\');
        }
        if (Object.keys(parsed).length === 0) {
          throw jsonErr;
        }
      }

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
