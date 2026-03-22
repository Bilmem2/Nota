/**
 * Strips code fences (```json, ```) from text and parses it as JSON.
 * Returns null on failure.
 *
 * @param {string} text
 * @returns {object|null}
 */
export function parseJSON(text) {
  try {
    // <think>...</think> bloğunu temizle (Qwen3, DeepSeek-R1 vb. reasoning modeller)
    let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    cleaned = cleaned.replace(/```json/gi, '').replace(/```/g, '').trim();

    // İlk { veya [ karakterinden itibaren al
    const firstBrace = cleaned.indexOf('{');
    const firstBracket = cleaned.indexOf('[');
    let startChar = '';
    let endChar = '';
    let startIndex = -1;

    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      startChar = '{'; endChar = '}'; startIndex = firstBrace;
    } else if (firstBracket !== -1) {
      startChar = '['; endChar = ']'; startIndex = firstBracket;
    }

    if (startIndex !== -1) {
      const endIndex = cleaned.lastIndexOf(endChar);
      if (endIndex > startIndex) {
        cleaned = cleaned.substring(startIndex, endIndex + 1);
      }
    }

    const parsed = JSON.parse(cleaned);

    // Groq json_object mode wraps arrays in an object — unwrap it
    if (parsed && !Array.isArray(parsed) && typeof parsed === 'object') {
      const values = Object.values(parsed);
      if (values.length === 1 && Array.isArray(values[0])) {
        return values[0];
      }
      // Also handle nested arrays like { questions: [...] }
      for (const val of values) {
        if (Array.isArray(val) && val.length > 0) return val;
      }
    }

    return parsed;
  } catch (e) {
    console.error('JSON parse error:', e);
    return null;
  }
}

/**
 * Compares two answers using Turkish locale case-insensitive comparison.
 * Also handles partial matches for fill-in-the-blank and short answer questions:
 * - Normalizes whitespace and punctuation
 * - Checks if one answer contains the other (for partial credit)
 * Satisfies symmetry: isAnswerCorrect(a, b) === isAnswerCorrect(b, a)
 *
 * @param {string} userAnswer
 * @param {string} correctAnswer
 * @returns {boolean}
 */
export function isAnswerCorrect(userAnswer, correctAnswer) {
  if (!userAnswer || !correctAnswer) return false;

  // Normalize: lowercase, trim, collapse whitespace, remove trailing punctuation
  const normalize = (s) =>
    s.toString()
      .trim()
      .toLocaleLowerCase('tr')
      .replace(/\s+/g, ' ')
      .replace(/[.,;:!?]+$/, '');

  const a = normalize(userAnswer);
  const b = normalize(correctAnswer);

  // Exact match
  if (a === b) return true;

  // One contains the other (handles "Pfu DNA polimeraz" vs "Pfu DNA polimeraz enzimi" etc.)
  if (a.includes(b) || b.includes(a)) return true;

  return false;
}
