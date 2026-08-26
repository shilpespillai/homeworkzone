export const config = {
  maxDuration: 60, // Allow up to 60s for OpenAI image generation
};

import admin from 'firebase-admin';
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const authHeader = req.headers.authorization || '';
    const idToken = authHeader.replace('Bearer ', '');
    if (!idToken) return res.status(401).json({ error: 'Unauthorized' });
    try {
      if (process.env.FIREBASE_PROJECT_ID) {
        if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert({ projectId: process.env.FIREBASE_PROJECT_ID, clientEmail: process.env.FIREBASE_CLIENT_EMAIL, privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')?.replace(/\n/g, '\n') }) });
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        if (decodedToken?.firebase?.sign_in_provider === 'anonymous') return res.status(403).json({ error: 'Forbidden' });
        
        // RATE LIMITING
        const db = admin.firestore();
        const rateLimitRef = db.collection('api_rate_limits').doc(decodedToken.uid);
        const rateLimitDoc = await rateLimitRef.get();
        const now = Date.now();
        let shouldBlock = false;
        if (!rateLimitDoc.exists) {
          await rateLimitRef.set({ count: 1, windowStart: now });
        } else {
          const data = rateLimitDoc.data();
          if (now - data.windowStart < 60000) {
            if (data.count >= 15) shouldBlock = true;
            else await rateLimitRef.update({ count: admin.firestore.FieldValue.increment(1) });
          } else await rateLimitRef.set({ count: 1, windowStart: now });
        }
        if (shouldBlock) {
          await db.collection('error_logs').add({
            timestamp: new Date().toISOString(), message: `🚨 SECURITY ALERT: Image API Rate Limit Exceeded`,
            stack: `Teacher UID: ${decodedToken.uid}\nTriggered >15 Image generations per minute.`,
            source: 'api/generate-image', userName: decodedToken.email || decodedToken.uid, userAgent: 'Backend Security', resolved: false
          });
          return res.status(429).json({ error: 'Too many requests.' });
        }
      }
    } catch(e) { return res.status(403).json({ error: 'Forbidden' }); }
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const cleanPrompt = String(prompt).trim().slice(0, 900);
    const rawKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;

    if (rawKey) {
      const openaiKey = String(rawKey).trim().replace(/^["']|["']$/g, '');

      // Attempt 1: gpt-image-2 (1536x1024, High Quality)
      try {
        const responseGpt2 = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-image-2',
            prompt: cleanPrompt,
            size: '1536x1024',
            quality: 'high'
          })
        });

        if (responseGpt2.ok) {
          const dataGpt2 = await responseGpt2.json();
          const imgUrl2 = dataGpt2.data?.[0]?.url;
          if (imgUrl2) {
            return res.status(200).json({ url: imgUrl2, provider: 'gpt-image-2' });
          }
        }
      } catch (eGpt2) {
        console.warn('[gpt-image-2 Exception]:', eGpt2.message);
      }

      // Attempt 2: gpt-image-1 (1536x1024, High Quality)
      try {
        const responseGpt = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-image-1',
            prompt: cleanPrompt,
            size: '1536x1024',
            quality: 'high'
          })
        });

        if (responseGpt.ok) {
          const dataGpt = await responseGpt.json();
          const imgUrl = dataGpt.data?.[0]?.url;
          if (imgUrl) {
            return res.status(200).json({ url: imgUrl, provider: 'gpt-image-1' });
          }
        }
      } catch (eGpt) {
        console.warn('[gpt-image-1 Exception]:', eGpt.message);
      }

      // Attempt 3: OpenAI DALL-E 3 (1024x1024, Standard Quality)
      try {
        const response3 = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt: cleanPrompt,
            n: 1,
            size: '1024x1024',
            quality: 'standard'
          })
        });

        if (response3.ok) {
          const data3 = await response3.json();
          const imgUrl3 = data3.data?.[0]?.url;
          if (imgUrl3) {
            return res.status(200).json({ url: imgUrl3, provider: 'dall-e-3' });
          }
        }
      } catch (e3) {
        console.warn('[DALL-E 3 Exception]:', e3.message);
      }

      // Attempt 4: DALL-E 2 Fallback
      try {
        const response2 = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: 'dall-e-2',
            prompt: cleanPrompt.slice(0, 400),
            n: 1,
            size: '1024x1024'
          })
        });

        if (response2.ok) {
          const data2 = await response2.json();
          const imgUrl2 = data2.data?.[0]?.url;
          if (imgUrl2) {
            return res.status(200).json({ url: imgUrl2, provider: 'dall-e-2' });
          }
        }
      } catch (e2) {
        console.warn('[DALL-E 2 Exception]:', e2.message);
      }
    }

    // Attempt 5: High-Definition Pollinations Nano-Banana / Flux Engine Fallback
    const encodedPrompt = encodeURIComponent(cleanPrompt + ", cute 3d pixar style, children book illustration, 8k, highly detailed");
    const fallbackUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1536&height=1024&nologo=true&model=flux`;
    return res.status(200).json({ url: fallbackUrl, provider: 'nano-banana-flux' });

  } catch (err) {
    console.error('[Image Proxy Error]', err);
    return res.status(500).json({ error: err.message });
  }
}


