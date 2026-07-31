export const config = {
  maxDuration: 60, // Allow up to 60s for OpenAI image generation
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
