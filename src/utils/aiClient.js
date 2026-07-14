export const fetchWithRetry = async (url, options, maxRetries = 3, initialDelay = 1000) => {
  let delay = initialDelay;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.ok) {
        return res;
      }
      
      // Retry on 503 Service Unavailable or 429 Too Many Requests
      if (res.status === 503 || res.status === 429) {
        console.warn(`AI Request failed with status ${res.status}. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        continue;
      }
      
      return res; // Return other HTTP errors directly
    } catch (err) {
      if (attempt === maxRetries - 1) {
        throw err;
      }
      console.warn(`AI Request failed. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries})`, err);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
  throw new Error(`AI Request failed after ${maxRetries} attempts`);
};

/**
 * Selects the optimal Claude tier based on grade level and subject when the user
 * has chosen Anthropic/Claude as their AI provider. For all other providers
 * (gemini, openai) it returns the provider unchanged.
 *
 * Tiers:
 *   Foundation–Grade 5  → claude-haiku  (fast, cheap — spelling/basic arithmetic)
 *   Grade 6–10          → claude-sonnet (balanced — word problems, essays, science)
 *   Grade 11–12         → claude-opus   (most accurate — calculus, physics, chemistry)
 *
 * For Grade 11–12 English/Humanities (no multi-step numeric reasoning), Sonnet is
 * still sufficient so we only bump to Opus for the STEM subjects.
 */
export const getModelForGrade = (grade, subject, baseProvider) => {
  // Only apply tiering when the user has selected Claude/Anthropic
  const isAnthropic = baseProvider === 'anthropic' ||
    baseProvider === 'claude-haiku' ||
    baseProvider === 'claude-sonnet' ||
    baseProvider === 'claude-opus';

  if (!isAnthropic) return baseProvider;

  // Extract numeric grade (0 = Foundation)
  const gradeNum = grade ? parseInt(String(grade).replace(/\D/g, ''), 10) : 0;

  if (gradeNum >= 11) {
    // Senior STEM gets Opus; English/Humanities stays on Sonnet
    const isStem = /math|maths|science|physics|chemistry|calculus|biology/i.test(subject || '');
    return isStem ? 'claude-opus' : 'claude-sonnet';
  }

  if (gradeNum >= 6) return 'claude-sonnet';

  // Foundation, Grade 1–5
  return 'claude-haiku';
};

export const generateContent = async ({ prompt, systemInstruction, responseMimeType, provider }) => {
  const res = await fetch('/api/generate-content', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, systemInstruction, responseMimeType, provider }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Cloud AI generation failed: ${errorText}`);
  }
  const data = await res.json();
  return data.text;
};
