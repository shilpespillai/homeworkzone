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
