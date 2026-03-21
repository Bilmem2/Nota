const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
export const OPENROUTER_MODELS = [
  { id: 'google/gemini-2.0-flash-exp:free', label: 'Gemini 2.0 Flash (Free) ⭐', free: true },
  { id: 'deepseek/deepseek-r1:free', label: 'DeepSeek R1 (Free)', free: true },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', label: 'Llama 3.3 70B (Free)', free: true },
  { id: 'mistralai/mistral-7b-instruct:free', label: 'Mistral 7B (Free)', free: true },
  { id: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet (Paid)', free: false },
  { id: 'openai/gpt-4o', label: 'GPT-4o (Paid)', free: false },
];

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
    temperature: 0.4,       // Daha tutarlı ve odaklı çıktı
    max_tokens: 8192,       // Maksimum derinlik
    top_p: 0.9,
  };

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

async function callOpenRouterAPI(prompt, systemInstruction, apiKey, model) {
  const payload = {
    model: model || OPENROUTER_MODELS[0].id,
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt },
    ],
    temperature: 0.4,
    max_tokens: 8192,
    top_p: 0.9,
  };

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://bilmem2.github.io/Nota/',
      'X-Title': 'Nota',
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 429) return { rateLimited: true };
  if (!response.ok) throw new Error(`OpenRouter HTTP error: ${response.status}`);

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
export async function callGemini(prompt, systemInstruction, apiKey, inlineData = null, isJson = false, provider = 'gemini', openRouterModel = null) {
  // Auto-detect provider from key prefix to prevent misconfiguration
  const effectiveProvider = apiKey.startsWith('gsk_') ? 'groq' : apiKey.startsWith('sk-or-') ? 'openrouter' : provider;
  const delays = [1000, 2000, 4000, 8000, 16000];

  for (let i = 0; i < 5; i++) {
    try {
      let result;
      if (effectiveProvider === 'groq') {
        result = await callGroqAPI(prompt, systemInstruction, apiKey, isJson);
      } else if (effectiveProvider === 'openrouter') {
        result = await callOpenRouterAPI(prompt, systemInstruction, apiKey, openRouterModel);
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
