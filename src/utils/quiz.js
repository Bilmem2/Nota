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

    return JSON.parse(cleaned);
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
