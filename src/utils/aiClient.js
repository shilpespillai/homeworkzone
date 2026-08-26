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
  // For NAPLAN, Selective, ICAS, SAT, and AMC Exams -> Always use Claude Sonnet for high reasoning & diagram JSON precision!
  const isCompetitiveExam = /naplan|selective|icas|sat|olympiad|amc/i.test(`${subject} ${grade}`);
  if (isCompetitiveExam) return 'claude-sonnet';

  const provider = (baseProvider || localStorage.getItem('hwz_active_ai') || 'anthropic').toLowerCase();

  // If user explicitly chose OpenAI
  if (provider === 'openai') return 'openai';

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

import { auth } from '../firebase';
export const generateContent = async ({ prompt, systemInstruction, responseMimeType, provider, maxTokens, temperature }) => {
  const activeProvider = provider || 'anthropic';
  let clientKey = '';
  if (typeof localStorage !== 'undefined') {
    if (activeProvider.startsWith('claude') || activeProvider === 'anthropic') {
      clientKey = localStorage.getItem('hwz_anthropic_key') || '';
    } else if (activeProvider === 'openai') {
      clientKey = localStorage.getItem('hwz_openai_key') || '';
    } else if (activeProvider === 'gemini') {
      clientKey = localStorage.getItem('hwz_gemini_key') || '';
    }
  }
  
  console.log(`[AI Client] 🚀 Sending generation request:`, {
    provider: activeProvider,
    promptLength: prompt?.length || 0,
    hasSystemInstruction: !!systemInstruction,
    hasClientKey: !!clientKey,
    hasAuthUser: !!auth?.currentUser
  });

  try {
    const token = auth?.currentUser ? await auth.currentUser.getIdToken().catch(() => '') : '';
    const res = await fetch('/api/generate-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify({ prompt, systemInstruction, responseMimeType, provider: activeProvider, maxTokens, temperature, clientKey }),
    });

    let serverError = '';
    if (res.ok) {
      const data = await res.json();
      if (data.text) {
        console.log(`[AI Client] ✅ Generation successful (${data.text.length} chars returned)`);
        return data.text;
      }
    } else {
      const errJson = await res.json().catch(() => ({}));
      serverError = errJson.error || errJson.message || `HTTP ${res.status}`;
      console.warn(`[AI Client] ⚠️ Server returned HTTP ${res.status}:`, serverError);
    }
  } catch (err) {
    console.warn(`[AI Client] ⚠️ Network / fetch call failed for ${activeProvider}:`, err.message);
  }

  // Client-side fail-safe retry using default backup engine
  if (activeProvider !== 'gemini') {
    try {
      console.log(`[AI Client] 🔄 Retrying with fallback Gemini engine...`);
      const fallbackRes = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, systemInstruction, responseMimeType, provider: 'gemini', maxTokens, temperature, clientKey }),
      });
      if (fallbackRes.ok) {
        const data = await fallbackRes.json();
        if (data.text) {
          console.log(`[AI Client] ✅ Fallback generation successful!`);
          return data.text;
        }
      } else {
        const fbErr = await fallbackRes.json().catch(() => ({}));
        console.error(`[AI Client] ❌ Fallback server returned HTTP ${fallbackRes.status}:`, fbErr);
      }
    } catch (fallbackErr) {
      console.error(`[AI Client] ❌ Backup engine also failed:`, fallbackErr.message);
    }
  }

  throw new Error("Unable to connect to AI engine. Please verify your AI API Key in Settings > AI Configuration or check system logs.");
};


