const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

async function callGeminiAPI(prompt, systemInstruction, apiKey, inlineData, isJson) {
  const url = `${GEMINI_URL}?key=${apiKey}`;
  const parts = [{ text: prompt }];
  if (inlineData) parts.push({ inlineData });

  const payload = {
    contents: [{ parts }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
  };
  if (isJson) payload.generationConfig = { responseMimeType: 'application/json' };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.status === 429) return { rateLimited: true };
  if (!response.ok) throw new Error(`Gemini HTTP error: ${response.status}`);

  const data = await response.json();
  return { text: data.candidates?.[0]?.content?.parts?.[0]?.text || 'Bir yanıt oluşturulamadı.' };
}

async function callGroqAPI(prompt, systemInstruction, apiKey, isJson) {
  const payload = {
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt },
    ],
  };
  if (isJson) payload.response_format = { type: 'json_object' };

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 429) return { rateLimited: true };
  if (!response.ok) throw new Error(`Groq HTTP error: ${response.status}`);

  const data = await response.json();
  return { text: data.choices?.[0]?.message?.content || 'Bir yanıt oluşturulamadı.' };
}

/**
 * Calls the configured AI API (Gemini or Groq).
 *
 * @param {string} prompt
 * @param {string} systemInstruction
 * @param {string} apiKey
 * @param {{ mimeType: string, data: string } | null} inlineData - Only supported by Gemini
 * @param {boolean} isJson
 * @param {string} provider - 'gemini' | 'groq'
 * @returns {Promise<string>}
 */
export async function callGemini(prompt, systemInstruction, apiKey, inlineData = null, isJson = false, provider = 'gemini') {
  // Auto-detect provider from key prefix to prevent misconfiguration
  const effectiveProvider = apiKey.startsWith('gsk_') ? 'groq' : provider;
  const delays = [1000, 2000, 4000, 8000, 16000];

  for (let i = 0; i < 5; i++) {
    try {
      let result;
      if (effectiveProvider === 'groq') {
        result = await callGroqAPI(prompt, systemInstruction, apiKey, isJson);
      } else {
        result = await callGeminiAPI(prompt, systemInstruction, apiKey, inlineData, isJson);
      }

      if (result.rateLimited) {
        return 'İstek limitine ulaşıldı. Lütfen birkaç saniye bekleyip tekrar deneyin.';
      }

      return result.text;
    } catch (error) {
      if (i === 4) {
        return 'Bağlantı hatası oluştu. Lütfen internet bağlantınızı kontrol edip daha sonra tekrar deneyin.';
      }
      await new Promise(res => setTimeout(res, delays[i]));
    }
  }
}
