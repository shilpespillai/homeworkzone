export const config = {
  maxDuration: 60, // Allow up to 60s for OpenAI DALL-E generation
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { prompt, model } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const rawKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
    if (!rawKey) {
      return res.status(500).json({ error: 'OPENAI_API_KEY is not configured on Vercel Environment Variables.' });
    }

    const openaiKey = String(rawKey).trim().replace(/^["']|["']$/g, '');
    const cleanPrompt = String(prompt).trim().slice(0, 900);
    const primaryModel = model || 'gpt-image-1';

    // Attempt 1: Primary Model (gpt-image-1)
    let response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: primaryModel,
        prompt: cleanPrompt,
        n: 1,
        size: '1024x1024'
      })
    });

    // Attempt 2: Fallback to DALL-E 3
    if (!response.ok && primaryModel !== 'dall-e-3') {
      const err1Text = await response.text();
      console.warn(`[${primaryModel} failed (${response.status})]: ${err1Text}. Trying DALL-E 3 fallback...`);

      response = await fetch('https://api.openai.com/v1/images/generations', {
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
    }

    // Attempt 3: Fallback to DALL-E 2
    if (!response.ok) {
      const err3Text = await response.text();
      console.warn(`[DALL-E 3 failed (${response.status})]: ${err3Text}. Trying DALL-E 2 fallback...`);

      response = await fetch('https://api.openai.com/v1/images/generations', {
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

      if (!response.ok) {
        const err2Text = await response.text();
        console.error(`[OpenAI Image API Error] ${response.status}: ${err2Text}`);
        let parsedMessage = err2Text;
        try {
          const parsedJson = JSON.parse(err2Text);
          parsedMessage = parsedJson.error?.message || err2Text;
        } catch (e) {}
        return res.status(400).json({ error: `OpenAI Image API Error: ${parsedMessage}` });
      }
    }

    const data = await response.json();
    const imageUrl = data.data?.[0]?.url;
    if (!imageUrl) {
      return res.status(500).json({ error: 'No image URL returned from OpenAI' });
    }

    return res.status(200).json({ url: imageUrl });
  } catch (err) {
    console.error('[DALL-E Proxy Error]', err);
    return res.status(500).json({ error: err.message });
  }
}
