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

let cachedAnthropicModels = null;
let lastAnthropicModelFetch = 0;

async function getLiveAnthropicModels(apiKey) {
  const now = Date.now();
  if (cachedAnthropicModels && (now - lastAnthropicModelFetch < 3600000)) {
    return cachedAnthropicModels;
  }
  try {
    const res = await fetch('https://api.anthropic.com/v1/models', {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      }
    });
    if (res.ok) {
      const data = await res.json();
      const rawList = data.data || [];
      rawList.sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return timeB - timeA;
      });
      const modelIds = rawList.map(m => m.id);
      if (modelIds.length > 0) {
        cachedAnthropicModels = modelIds;
        lastAnthropicModelFetch = now;
        console.log(`[AI Router] Discovered live active Anthropic models (sorted newest first):`, modelIds.join(', '));
        return modelIds;
      }
    }
  } catch (e) {
    console.warn(`[AI Router] Dynamic Anthropic model discovery failed:`, e.message);
  }
  return null;
}

async function resolveBestAnthropicModel(apiKey, provider) {
  const liveModels = await getLiveAnthropicModels(apiKey);
  const tier = provider.replace('claude-', '').replace('anthropic', 'sonnet').toLowerCase(); // haiku | sonnet | opus
  
  if (liveModels && liveModels.length > 0) {
    const matching = liveModels.filter(m => m.toLowerCase().includes(tier));
    if (matching.length > 0) {
      return matching[0]; // Pure dynamic selection from API!
    }
    return liveModels[0];
  }
  
  // Generic dynamic fallback aliases supported by Anthropic API
  return `claude-${tier}-latest`;
}

let cachedGeminiModels = null;
let lastGeminiModelFetch = 0;

async function getLiveGeminiModels(apiKey) {
  const now = Date.now();
  if (cachedGeminiModels && (now - lastGeminiModelFetch < 3600000)) {
    return cachedGeminiModels;
  }
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (res.ok) {
      const data = await res.json();
      const rawList = data.models || [];
      const validModels = rawList
        .filter(m => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
        .map(m => m.name.replace('models/', ''));
      
      if (validModels.length > 0) {
        cachedGeminiModels = validModels;
        lastGeminiModelFetch = now;
        console.log(`[AI Router] Discovered live active Gemini models:`, validModels.join(', '));
        return validModels;
      }
    }
  } catch (e) {
    console.warn(`[AI Router] Dynamic Gemini model discovery failed:`, e.message);
  }
  return null;
}

async function resolveBestGeminiModel(apiKey, preference = 'flash') {
  const liveModels = await getLiveGeminiModels(apiKey);
  if (liveModels && liveModels.length > 0) {
    const preferred = liveModels.filter(m => m.includes(preference));
    if (preferred.length > 0) {
      // Prioritize the newest generation flash models
      const latest = preferred.find(m => m.includes('2.5-flash')) ||
                     preferred.find(m => m.includes('2.0-flash')) ||
                     preferred.find(m => m.includes('1.5-flash')) ||
                     preferred.find(m => m.includes('flash-latest')) ||
                     preferred[0];
      return latest;
    }
    return liveModels[0];
  }
  return 'gemini-1.5-flash';
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const authHeader = req.headers.authorization || '';
    const idToken = authHeader.replace('Bearer ', '').trim();

    const { prompt, systemInstruction, responseMimeType, provider: reqProvider, maxTokens, temperature, clientKey, images } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    let provider = (reqProvider || process.env.SYSTEM_ACTIVE_AI || 'gemini').toLowerCase();
    const hasImages = Array.isArray(images) && images.length > 0;
    const cacheKey = await sha256(provider + prompt + (hasImages ? JSON.stringify(images.map(i => i.data?.slice(0, 100))) : ''));
    
    let db = null;
    let decodedToken = null;
    try {
      if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert({
              projectId: process.env.FIREBASE_PROJECT_ID,
              clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
              privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')?.replace(/\n/g, '\n'),
            }),
          });
        }
        db = admin.firestore();
        
        // --- 1. USER AUTHENTICATION & TIER VERIFICATION ---
        let userPlan = 'free';
        let uid = 'anonymous';

        if (idToken) {
          try {
            decodedToken = await admin.auth().verifyIdToken(idToken);
            uid = decodedToken.uid;

            // Check if user has an active paid subscription in Firestore
            const teacherDoc = await db.collection('teachers').doc(uid).get();
            if (teacherDoc.exists) {
              const teacherData = teacherDoc.data();
              const planId = teacherData?.billing?.planId || 'free';
              if (planId !== 'free' && planId !== 'free_trial' && planId !== 'free_expired') {
                userPlan = 'paid';
              }
            }
          } catch (authErr) {
            console.warn(`[AI Proxy] Token verification failed:`, authErr.message);
          }
        }

        // --- 2. TIERED MODEL ENFORCEMENT ---
        // If free user requests Claude Opus without own clientKey, route them to Haiku / Gemini
        if (userPlan === 'free' && !clientKey) {
          if (provider.includes('opus')) {
            console.log(`[AI Tier Gate] Free user ${uid} requested Opus without personal API key. Routing to claude-haiku.`);
            provider = 'claude-haiku';
          }
        }

        // --- 3. AUDIT LOGGING & RATE LIMITING ---
        const userUsageRef = db.collection('ai_usage').doc(uid);
        const usageDoc = await userUsageRef.get();
        const now = Date.now();
        let requestsInWindow = 0;

        if (usageDoc.exists) {
          const usageData = usageDoc.data();
          const windowStart = usageData.windowStart || now;
          if (now - windowStart < 60000) { // 1-minute window
            requestsInWindow = (usageData.requests || 0) + 1;
          } else {
            requestsInWindow = 1;
          }
        } else {
          requestsInWindow = 1;
        }

        await userUsageRef.set({
          requests: requestsInWindow,
          windowStart: requestsInWindow === 1 ? now : (usageDoc.data()?.windowStart || now),
          lastRequest: now,
          email: decodedToken?.email || 'unauthenticated',
          plan: userPlan
        }, { merge: true });

        // Rate limit: 25 req/min for free, 80 req/min for paid
        const rateLimitMax = userPlan === 'paid' ? 80 : 25;
        if (requestsInWindow > rateLimitMax) {
          // Log security violation to error_logs for admin panel
          await db.collection('error_logs').add({
            message: `Rate limit exceeded (${requestsInWindow} req/min). Plan: ${userPlan}`,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            userId: uid,
            userEmail: decodedToken?.email || 'Anonymous',
            source: 'api/generate-content',
            userName: decodedToken?.email || uid,
            userAgent: req.headers['user-agent'] || 'Backend Security',
            resolved: false
          });
          return res.status(429).json({ error: 'Too many requests. Please wait a minute before generating more content.' });
        }
        // --- END RATE LIMITING ---

      } else {
        console.warn(`[AI Proxy] Missing Firebase Admin environment variables. Bypassing Auth & cache.`);
      }
    
    } catch (dbErr) {
      console.warn(`[AI Proxy] Rate limit check skipped:`, dbErr.message);
    }

    let cached = null;
    if (db && !hasImages) {
      try {
        cached = await getCache(db, cacheKey);
      } catch (cacheErr) {
        console.warn(`[AI Proxy] Failed to lookup cache:`, cacheErr.message);
      }
    }
    if (cached) return res.status(200).json({ text: cached });

    let apiKey = '', modelName = '', endpoint = '', headers = {}, bodyObj = {};

    if (provider === 'gemini') {
      apiKey = process.env.GEMINI_API_KEY || (clientKey?.startsWith('AIzaSy') ? clientKey : '');
      if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured in server environment' });
      modelName = await resolveBestGeminiModel(apiKey, 'flash');
      endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      headers = { 'Content-Type': 'application/json' };
      
      const parts = [{ text: prompt }];
      if (hasImages) {
        images.forEach(img => {
          if (img?.data) {
            parts.push({
              inlineData: {
                mimeType: img.mimeType || 'image/jpeg',
                data: img.data.replace(/^data:image\/\w+;base64,/, '')
              }
            });
          }
        });
      }

      bodyObj = {
        contents: [{ parts }],
        generationConfig: { 
          temperature: typeof temperature === 'number' ? temperature : 0.7,
          responseMimeType: responseMimeType === 'application/json' ? 'application/json' : 'text/plain' 
        }
      };
      if (maxTokens) {
        bodyObj.generationConfig.maxOutputTokens = maxTokens;
      }
      if (systemInstruction) {
        bodyObj.systemInstruction = { parts: [{ text: systemInstruction }] };
      }
    } else if (provider === 'openai') {
      apiKey = process.env.OPENAI_API_KEY || (clientKey?.startsWith('sk-') ? clientKey : '');
      modelName = 'gpt-4o';
      if (!apiKey) return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });
      endpoint = 'https://api.openai.com/v1/chat/completions';
      headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` };
      
      let userContent = prompt;
      if (hasImages) {
        userContent = [{ type: 'text', text: prompt }];
        images.forEach(img => {
          if (img?.data) {
            const url = img.data.startsWith('data:') ? img.data : `data:${img.mimeType || 'image/jpeg'};base64,${img.data}`;
            userContent.push({ type: 'image_url', image_url: { url } });
          }
        });
      }

      const messages = systemInstruction ? [{ role: 'system', content: systemInstruction }, { role: 'user', content: userContent }] : [{ role: 'user', content: userContent }];
      bodyObj = { model: modelName, messages, temperature: 0.7 };
      if (responseMimeType === 'application/json') bodyObj.response_format = { type: 'json_object' };
    } else if (provider === 'anthropic' || provider.startsWith('claude')) {
      apiKey = process.env.ANTHROPIC_API_KEY || (clientKey?.startsWith('sk-ant-') ? clientKey : '');
      
      // Fallback to Gemini if Anthropic key is not configured
      if (!apiKey && process.env.GEMINI_API_KEY) {
        console.warn(`[AI Proxy] ANTHROPIC_API_KEY not found. Falling back to Gemini API.`);
        provider = 'gemini';
        apiKey = process.env.GEMINI_API_KEY;
        modelName = await resolveBestGeminiModel(apiKey, 'flash');
        endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        headers = { 'Content-Type': 'application/json' };
        
        const parts = [{ text: prompt }];
        if (hasImages) {
          images.forEach(img => {
            if (img?.data) {
              parts.push({
                inlineData: {
                  mimeType: img.mimeType || 'image/jpeg',
                  data: img.data.replace(/^data:image\/\w+;base64,/, '')
                }
              });
            }
          });
        }

        bodyObj = {
          contents: [{ parts }],
          generationConfig: { temperature: 0.7, responseMimeType: responseMimeType === 'application/json' ? 'application/json' : 'text/plain' }
        };
        if (systemInstruction) {
          bodyObj.systemInstruction = { parts: [{ text: systemInstruction }] };
        }
      } else if (!apiKey) {
        return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured on server' });
      } else {
        modelName = await resolveBestAnthropicModel(apiKey, provider);
        endpoint = 'https://api.anthropic.com/v1/messages';
        headers = { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' };
        
        let userContent = prompt;
        if (hasImages) {
          userContent = [];
          images.forEach(img => {
            if (img?.data) {
              userContent.push({
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: img.mimeType || 'image/jpeg',
                  data: img.data.replace(/^data:image\/\w+;base64,/, '')
                }
              });
            }
          });
          userContent.push({ type: 'text', text: prompt });
        }

        bodyObj = { model: modelName, messages: [{ role: 'user', content: userContent }], max_tokens: maxTokens || 4096, temperature: 0.7 };
        if (systemInstruction) bodyObj.system = systemInstruction;
      }
    } else {
      return res.status(400).json({ error: `Unsupported provider: ${provider}` });
    }

    console.log(`🤖 [AI ROUTER LOG] Executing Request -> Provider: ${provider.toUpperCase()} | Model: ${modelName} | Prompt Length: ${prompt.length} chars`);

    let resAi = await fetchWithRetry(endpoint, { method: 'POST', headers, body: JSON.stringify(bodyObj) }).catch((err) => {
      console.warn(`[AI Proxy] Primary call to ${provider} (${modelName}) failed:`, err.message);
      return { ok: false, status: 500 };
    });
    
    // Auto-retry with live discovered models if primary call failed
    if (!resAi.ok && provider.startsWith('claude')) {
      const liveDiscovered = (await getLiveAnthropicModels(apiKey)) || [];
      for (const fbModel of liveDiscovered) {
        if (fbModel === modelName) continue;
        console.warn(`[AI Proxy] Model ${modelName} failed. Retrying with live discovered model ${fbModel}`);
        bodyObj.model = fbModel;
        const resFb = await fetchWithRetry(endpoint, { method: 'POST', headers, body: JSON.stringify(bodyObj) }).catch(() => null);
        if (resFb && resFb.ok) {
          resAi = resFb;
          modelName = fbModel;
          break;
        }
      }
    }

    // Auto-retry with live discovered Gemini models if primary call failed
    if (!resAi.ok && provider === 'gemini') {
      const liveGemini = (await getLiveGeminiModels(apiKey)) || ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-flash-latest', 'gemini-1.5-pro'];
      for (const fbModel of liveGemini) {
        if (fbModel === modelName) continue;
        console.warn(`[AI Proxy] Gemini Model ${modelName} failed. Retrying with live discovered ${fbModel}`);
        const fbEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${fbModel}:generateContent?key=${apiKey}`;
        const resFb = await fetchWithRetry(fbEndpoint, { method: 'POST', headers, body: JSON.stringify(bodyObj) }).catch(() => null);
        if (resFb && resFb.ok) {
          resAi = resFb;
          modelName = fbModel;
          break;
        }
      }
    }

    // ULTIMATE FAIL-SAFE: If provider failed, automatically fall back to Gemini Flash!
    if (!resAi.ok && (process.env.GEMINI_API_KEY || clientKey) && provider !== 'gemini') {
      console.warn(`[AI Proxy] Provider ${provider} (${modelName}) failed. Automatically falling back to Gemini API...`);
      const gApiKey = clientKey || process.env.GEMINI_API_KEY;
      const gModelName = 'gemini-1.5-flash';
      const gEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${gModelName}:generateContent?key=${gApiKey}`;
      const gHeaders = { 'Content-Type': 'application/json' };
      const gBodyObj = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, responseMimeType: responseMimeType === 'application/json' ? 'application/json' : 'text/plain' }
      };
      if (systemInstruction) {
        gBodyObj.systemInstruction = { parts: [{ text: systemInstruction }] };
      }
      const resGemini = await fetchWithRetry(gEndpoint, { method: 'POST', headers: gHeaders, body: JSON.stringify(gBodyObj) }).catch(() => null);
      if (resGemini && resGemini.ok) {
        resAi = resGemini;
        provider = 'gemini';
      }
    }

    if (!resAi.ok) {
      const errText = resAi.text ? await resAi.text().catch(() => '') : '';
      console.error(`[AI API Error] Generation failed:`, errText);
      return res.status(502).json({ error: `AI provider error: ${errText || 'Invalid API Key or rate limit reached.'}` });
    }

    const data = await resAi.json();
    let textResult = provider === 'gemini' ? data.candidates?.[0]?.content?.parts?.[0]?.text : (provider === 'openai' ? data.choices?.[0]?.message?.content : data.content?.[0]?.text) || '';

    if (responseMimeType === 'application/json') {
      const first = textResult.indexOf('{'), last = textResult.lastIndexOf('}');
      if (first !== -1 && last !== -1) textResult = textResult.substring(first, last + 1);
    }

    if (db) {
      try {
        await setCache(db, cacheKey, textResult, 72);
      } catch (cacheErr) {
        console.warn(`[AI Proxy] Failed to save cache:`, cacheErr.message);
      }
    }
    return res.status(200).json({ text: textResult });
  } catch (err) {
    console.error('[AI Proxy Error]', err);
    return res.status(500).json({ error: "Our learning engine is briefly recalibrating content. Please try again in a moment." });
  }
}
