import admin from 'firebase-admin';

async function fetchWithRetry(url, options, maxRetries = 3, initialDelay = 1000) {
  let delay = initialDelay;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.ok || (res.status !== 503 && res.status !== 429)) {
        return res;
      }
      const errText = await res.text().catch(() => '');
      console.warn(`[AI Proxy] Request failed with status ${res.status}: ${errText}. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries})`);
      if (attempt === maxRetries - 1) {
        throw new Error(`AI request failed with ${res.status}: ${errText}`);
      }
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    } catch (err) {
      if (attempt === maxRetries - 1) throw err;
      console.warn(`[AI Proxy] Request encountered error. Retrying in ${delay}ms...`, err.message);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
  throw new Error(`AI request failed after ${maxRetries} attempts`);
}

async function getCache(db, key) {
  const doc = await db.collection('ai_cache').doc(key).get();
  if (!doc.exists) return null;
  const data = doc.data();
  if (Date.now() > data.expiresAt) return null;
  return data.text;
}

async function setCache(db, key, text, ttlHours) {
  await db.collection('ai_cache').doc(key).set({
    text,
    expiresAt: Date.now() + ttlHours * 60 * 60 * 1000
  });
}

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { prompt, systemInstruction, responseMimeType, provider: reqProvider } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    let provider = (reqProvider || process.env.SYSTEM_ACTIVE_AI || 'gemini').toLowerCase();
    const cacheKey = await sha256(provider + prompt);
    
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }
    const db = admin.firestore();

    const cached = await getCache(db, cacheKey);
    if (cached) return res.status(200).json({ text: cached });

    let apiKey = '', modelName = '', endpoint = '', headers = {}, bodyObj = {};

    if (provider === 'gemini') {
      apiKey = process.env.GEMINI_API_KEY;
      modelName = 'gemini-1.5-flash';
      if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
      endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      headers = { 'Content-Type': 'application/json' };
      const contents = systemInstruction ? [{ role: 'system', parts: [{ text: systemInstruction }] }, { parts: [{ text: prompt }] }] : [{ parts: [{ text: prompt }] }];
      bodyObj = { contents, generationConfig: { temperature: 0.7, responseMimeType: responseMimeType === 'application/json' ? 'application/json' : 'text/plain' } };
    } else if (provider === 'openai') {
      apiKey = process.env.OPENAI_API_KEY;
      modelName = 'gpt-4o';
      if (!apiKey) return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });
      endpoint = 'https://api.openai.com/v1/chat/completions';
      headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` };
      const messages = systemInstruction ? [{ role: 'system', content: systemInstruction }, { role: 'user', content: prompt }] : [{ role: 'user', content: prompt }];
      bodyObj = { model: modelName, messages, temperature: 0.7 };
      if (responseMimeType === 'application/json') bodyObj.response_format = { type: 'json_object' };
    } else if (provider === 'anthropic') {
      apiKey = process.env.ANTHROPIC_API_KEY;
      modelName = 'claude-3-5-sonnet-20241022';
      if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
      endpoint = 'https://api.anthropic.com/v1/messages';
      headers = { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' };
      bodyObj = { model: modelName, messages: [{ role: 'user', content: prompt }], max_tokens: 4096, temperature: 0.7 };
      if (systemInstruction) bodyObj.system = systemInstruction;
    } else {
      return res.status(400).json({ error: `Unsupported provider: ${provider}` });
    }

    const resAi = await fetchWithRetry(endpoint, { method: 'POST', headers, body: JSON.stringify(bodyObj) });
    if (!resAi.ok) {
      const errorBody = await resAi.text().catch(() => '');
      console.error(`[AI API Error] ${endpoint} -> ${resAi.status} ${errorBody}`);
      throw new Error(`${provider} API error: ${resAi.status} - ${errorBody}`);
    }
    const data = await resAi.json();
    let textResult = provider === 'gemini' ? data.candidates?.[0]?.content?.parts?.[0]?.text : (provider === 'openai' ? data.choices?.[0]?.message?.content : data.content?.[0]?.text) || '';

    if (responseMimeType === 'application/json') {
      const first = textResult.indexOf('{'), last = textResult.lastIndexOf('}');
      if (first !== -1 && last !== -1) textResult = textResult.substring(first, last + 1);
    }

    await setCache(db, cacheKey, textResult, responseMimeType === 'application/json' ? 24 : 6);
    return res.status(200).json({ text: textResult });
  } catch (err) {
    console.error('[AI Proxy Error]', err);
    return res.status(500).json({ error: err.message });
  }
}
