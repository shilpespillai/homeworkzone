import admin from 'firebase-admin';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { text, senderName, recipientName } = req.body;
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(200).json({ isSafe: true, reason: null });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback to safe if no key configured
      return res.status(200).json({ isSafe: true, reason: null });
    }

    const systemPrompt = `You are an AI Safety & Kindness Moderator for Homework Zone (an educational platform for K-12 students aged 5-18).
Your sole job is to analyze chat messages sent between students or from a student to a teacher to determine if the message is MEAN, OFFENSIVE, BULLYING, HOSTILE, INSULTING, NAME-CALLING, OR HARASSING directed towards another person.

CRITICAL DISTINCTION:
1. HARMLESS / ALLOWED (isSafe = true):
   - Frustration about schoolwork, subjects, or abstract things (e.g., "I hate fractions", "I hate tests", "I hate rain", "this math is hard").
   - Friendly greetings, polite homework questions, supportive comments, emojis.

2. MEAN / BLOCKED (isSafe = false):
   - DIRECT PERSONAL HOSTILITY: Expressions of hatred towards a person ("i hate you", "I hate teacher", "I hate [Person]").
   - INSULTS & NAME-CALLING: Calling someone nuts, crazy, duffer, idiot, dumb, stupid, loser, freak, nerd, ugly, fatty, weirdo, dummy, etc. ("are you nuts", "duffer", "you are crazy").
   - CONDESCENDING REMARKS: Comments mocking someone's intelligence or behavior ("switch your brain on", "use your head", "no brain", "nobody asked", "shut up", "you suck", "get lost").
   - Cyberbullying, harassment, threats, or vulgarity.

OUTPUT REQUIREMENT:
You MUST respond ONLY with a valid JSON object:
{
  "isSafe": false (if mean/insulting) or true (if friendly/harmless),
  "reason": "Short, encouraging explanation for the student (e.g., 'Please keep messages to teachers and classmates kind and respectful. 💛')"
}`;

    const userPrompt = `Message from ${senderName || 'Student'} to ${recipientName || 'Classmate'}: "${text.trim()}"`;

    let isSafe = true;
    let reason = null;

    if (process.env.ANTHROPIC_API_KEY) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
          max_tokens: 150,
          temperature: 0.0
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawContent = data.content?.[0]?.text || '';
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          isSafe = parsed.isSafe ?? true;
          reason = parsed.reason || null;
        }
      }
    } else if (process.env.GEMINI_API_KEY) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ parts: [{ text: userPrompt }] }],
          generationConfig: { temperature: 0.0, responseMimeType: 'application/json' }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          isSafe = parsed.isSafe ?? true;
          reason = parsed.reason || null;
        }
      }
    }

    return res.status(200).json({ isSafe, reason });
  } catch (err) {
    console.error("[Chat Safety Classifier Error]", err);
    // On error, default to safe so platform isn't blocked
    return res.status(200).json({ isSafe: true, reason: null });
  }
}
