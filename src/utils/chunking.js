/**
 * Splits text into chunks of at most maxChunkSize characters.
 * Prefers splitting at newline boundaries (\n) when possible.
 *
 * @param {string} text - The text to split
 * @param {number} maxChunkSize - Maximum characters per chunk (default: 12_000)
 * @returns {string[]} Array of chunks whose concatenation equals the original text
 */
export function chunkText(text, maxChunkSize = 12_000) {
  if (text.length === 0) return [''];

  const chunks = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxChunkSize) {
      chunks.push(remaining);
      break;
    }

    let splitIndex = remaining.lastIndexOf('\n', maxChunkSize);

    // If no newline found within range, or it's too far back (< maxChunkSize - 2000),
    // fall back to a hard split at maxChunkSize
    if (splitIndex === -1 || splitIndex < maxChunkSize - 2000) {
      splitIndex = maxChunkSize;
    }

    chunks.push(remaining.slice(0, splitIndex));
    remaining = remaining.slice(splitIndex);
  }

  return chunks;
}
