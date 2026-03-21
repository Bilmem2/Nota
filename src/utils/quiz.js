/**
 * Strips code fences (```json, ```) from text and parses it as JSON.
 * Returns null on failure.
 *
 * @param {string} text
 * @returns {object|null}
 */
export function parseJSON(text) {
  try {
    let cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();

    if (cleaned.startsWith('[')) {
      const startIndex = cleaned.indexOf('[');
      const endIndex = cleaned.lastIndexOf(']');
      if (startIndex !== -1 && endIndex !== -1) {
        cleaned = cleaned.substring(startIndex, endIndex + 1);
      }
    } else if (cleaned.startsWith('{')) {
      const startIndex = cleaned.indexOf('{');
      const endIndex = cleaned.lastIndexOf('}');
      if (startIndex !== -1 && endIndex !== -1) {
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
 * Satisfies symmetry: isAnswerCorrect(a, b) === isAnswerCorrect(b, a)
 *
 * @param {string} userAnswer
 * @param {string} correctAnswer
 * @returns {boolean}
 */
export function isAnswerCorrect(userAnswer, correctAnswer) {
  if (!userAnswer || !correctAnswer) return false;
  const a = userAnswer.toString().trim().toLocaleLowerCase('tr');
  const b = correctAnswer.toString().trim().toLocaleLowerCase('tr');
  return a === b;
}
