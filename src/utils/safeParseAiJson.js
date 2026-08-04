/**
 * safeParseAiJson.js
 *
 * Robust JSON parser for AI-generated responses.
 * Handles the most common failure modes:
 *   1. Markdown code fences (```json ... ```)
 *   2. Trailing commas before ] or }
 *   3. Unescaped control characters (newlines/tabs inside strings)
 *   4. Unescaped double-quotes inside SVG attribute strings
 *   5. Truncated/incomplete JSON — attempts to auto-close arrays/objects
 */

/**
 * Strip markdown code fences if present.
 * e.g. ```json\n{...}\n``` → {...}
 */
function stripMarkdownFences(text) {
  return text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();
}

/**
 * Remove trailing commas before closing brackets/braces.
 * Handles:   [1, 2, 3,]   →   [1, 2, 3]
 *            {"a":1,}      →   {"a":1}
 */
function removeTrailingCommas(text) {
  return text.replace(/,\s*([}\]])/g, '$1');
}

/**
 * Fix unescaped newlines/carriage-returns/tabs inside JSON string values.
 * These are the #1 cause of "Expected ',' or ']' after array element" errors
 * when the AI puts literal newlines inside SVG or text string values.
 */
function fixUnescapedControlChars(text) {
  // Replace literal newlines/tabs that appear inside JSON string values
  // We iterate character by character tracking string context.
  let result = '';
  let inString = false;
  let prevChar = '';

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (ch === '"' && prevChar !== '\\') {
      inString = !inString;
      result += ch;
    } else if (inString) {
      if (ch === '\n') {
        result += '\\n';
      } else if (ch === '\r') {
        result += '\\r';
      } else if (ch === '\t') {
        result += '\\t';
      } else {
        result += ch;
      }
    } else {
      result += ch;
    }

    prevChar = ch;
  }

  return result;
}

/**
 * Attempt to auto-close an incomplete/truncated JSON string.
 * Counts unclosed { and [ and appends the matching closers.
 */
function autoCloseTruncatedJson(text) {
  const stack = [];
  let inString = false;
  let prevChar = '';

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (ch === '"' && prevChar !== '\\') {
      inString = !inString;
    } else if (!inString) {
      if (ch === '{' || ch === '[') {
        stack.push(ch);
      } else if (ch === '}' || ch === ']') {
        stack.pop();
      }
    }
    prevChar = ch;
  }

  // Close any open strings first
  let suffix = inString ? '"' : '';

  // Then close remaining open brackets
  while (stack.length > 0) {
    const open = stack.pop();
    suffix += open === '{' ? '}' : ']';
  }

  return text + suffix;
}

/**
 * Main export: safely parse AI-generated JSON with progressive fallbacks.
 *
 * @param {string} rawText  - Raw text returned by the AI API
 * @returns {any}           - Parsed JavaScript value
 * @throws {SyntaxError}    - If all repair attempts fail
 */
export function safeParseAiJson(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    throw new SyntaxError('safeParseAiJson: input is empty or not a string');
  }

  // Step 1: Strip markdown fences
  let text = stripMarkdownFences(rawText);

  // Step 2: Try parsing as-is (fastest path — works if API returned clean JSON)
  try {
    return JSON.parse(text);
  } catch (_) { /* continue to repair */ }

  // Step 3: Fix unescaped control characters (the most common cause of the error)
  text = fixUnescapedControlChars(text);
  try {
    return JSON.parse(text);
  } catch (_) { /* continue */ }

  // Step 4: Remove trailing commas
  text = removeTrailingCommas(text);
  try {
    return JSON.parse(text);
  } catch (_) { /* continue */ }

  // Step 5: Try to auto-close truncated JSON
  const closed = autoCloseTruncatedJson(text);
  try {
    return JSON.parse(closed);
  } catch (_) { /* continue */ }

  // Step 6: Extract just the first top-level object or array
  const objMatch = text.match(/\{[\s\S]*\}/);
  const arrMatch = text.match(/\[[\s\S]*\]/);
  const extracted = objMatch ? objMatch[0] : (arrMatch ? arrMatch[0] : null);
  if (extracted) {
    const cleanedExtracted = removeTrailingCommas(fixUnescapedControlChars(extracted));
    try {
      return JSON.parse(cleanedExtracted);
    } catch (_) { /* fall through */ }
  }

  // All attempts failed — throw with informative context
  const preview = rawText.slice(0, 200);
  throw new SyntaxError(
    `safeParseAiJson: All repair attempts failed. Response preview: ${preview}`
  );
}
