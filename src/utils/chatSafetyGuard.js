// Kid Safety & Friendly Chat Guardrail for Homework Zone

// Explicit profanity, slurs, direct personal hostility & harassment phrases for instant Layer 1 check (<1ms)
const FAST_BLOCK_TERMS = [
  // Profanity & Vulgarity
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'cunt', 'dick', 'pussy', 'cock', 'slut', 'whore',
  'damn', 'crap', 'piss', 'nigger', 'nigga', 'faggot', 'retard', 'spastic', 'kys', 'kill yourself',

  // Direct Personal Hostility & Insults
  'hate you', 'you suck', 'shut up', 'stupid', 'idiot', 'loser', 'dumb', 'ugly', 'fat',
  'freak', 'weirdo', 'nerd', 'lame', 'nobody likes you', 'go away', 'fool', 'trash', 'garbage',
  'dumbass', 'fatty', 'stinky', 'scam', 'duffer', 'are you nuts', 'are you crazy',

  // Brain/Intelligence Mocking
  'switch your brain on', 'turn your brain on', 'use your brain', 'no brain', 'brainless',
  'get lost', 'nobody asked', 'mind your own business', 'shut your mouth', 'dummy'
];

/**
 * Fast local check (<1ms) for explicit profanity, slurs, and direct personal insults
 */
export const validateChatMessage = (text) => {
  if (!text || typeof text !== 'string') {
    return { isSafe: true, flaggedWord: null };
  }

  const cleanText = text.toLowerCase().trim();

  for (const term of FAST_BLOCK_TERMS) {
    const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(cleanText) || cleanText.includes(term)) {
      return {
        isSafe: false,
        flaggedWord: term,
        message: `Let's keep Homework Zone friendly and kind! 💛 Please rephrase your message without mean or inappropriate words.`
      };
    }
  }

  return { isSafe: true, flaggedWord: null };
};

/**
 * AI Context & Sentiment Safety Classifier
 * Evaluates message intent & context for subtle or unusual phrasing that passes Layer 1.
 */
export const validateChatMessageAsync = async (text, senderName = 'Student', recipientName = 'Classmate') => {
  // Layer 1: Fast Local Check (<1ms)
  const localCheck = validateChatMessage(text);
  if (!localCheck.isSafe) return localCheck;

  // Layer 2: AI Intent & Kindness Moderator
  try {
    const res = await fetch('/api/classify-chat-safety', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, senderName, recipientName })
    });
    if (res.ok) {
      const data = await res.json();
      if (!data.isSafe) {
        return {
          isSafe: false,
          message: data.reason || `Let's keep Homework Zone friendly and kind! 💛 Please rephrase your message.`
        };
      }
    }
  } catch (err) {
    console.warn("AI Chat safety classifier offline, defaulting to safe:", err);
  }

  return { isSafe: true, flaggedWord: null };
};

/**
 * Censors explicit words in a string by replacing them with heart emojis
 */
export const sanitizeChatMessage = (text) => {
  if (!text || typeof text !== 'string') return text;
  let sanitized = text;

  for (const term of FAST_BLOCK_TERMS) {
    const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    sanitized = sanitized.replace(regex, '💛💛💛');
  }

  return sanitized;
};
