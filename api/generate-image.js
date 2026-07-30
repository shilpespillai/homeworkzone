export const config = {
  maxDuration: 60, // Allow up to 60s for OpenAI DALL-E 3 generation
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const rawKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
    if (!rawKey) {
      return res.status(500).json({ error: 'OPENAI_API_KEY is not configured on Vercel Environment Variables.' });
    }

    const openaiKey = String(rawKey).trim().replace(/^["']|["']$/g, '');
    const cleanPrompt = String(prompt).trim().slice(0, 950);

    const response = await fetch('https://api.openai.com/v1/images/generations', {
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

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[DALL-E 3 API Error] ${response.status}: ${errText}`);
      let parsedMessage = errText;
      try {
        const parsedJson = JSON.parse(errText);
        parsedMessage = parsedJson.error?.message || errText;
      } catch (e) {}
      return res.status(response.status).json({ error: parsedMessage });
    }

    const data = await response.json();
    const imageUrl = data.data?.[0]?.url;
    if (!imageUrl) {
      return res.status(500).json({ error: 'No image URL returned from DALL-E 3' });
    }

    return res.status(200).json({ url: imageUrl });
  } catch (err) {
    console.error('[DALL-E Proxy Error]', err);
    return res.status(500).json({ error: err.message });
  }
}
