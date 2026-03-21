const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const XAI_URL = 'https://api.x.ai/v1/chat/completions';
const PERPLEXITY_URL = 'https://api.perplexity.ai/chat/completions';
const ZAI_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const KIMI_URL = 'https://api.moonshot.cn/v1/chat/completions';
const QWEN_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';

export const GEMINI_MODELS = [
  { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro 💳 (Ücretli, En Güçlü)' },
  { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash ⭐ (Ücretsiz, Hızlı)' },
  { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (Ücretsiz, Kararlı)' },
  { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (Ücretsiz, Eski)' },
];

export const OPENROUTER_MODELS = [
  { id: 'google/gemini-2.0-flash-exp:free', label: 'Gemini 2.0 Flash (Free) ⭐', free: true },
  { id: 'deepseek/deepseek-r1:free', label: 'DeepSeek R1 (Free)', free: true },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', label: 'Llama 3.3 70B (Free)', free: true },
  { id: 'mistralai/mistral-7b-instruct:free', label: 'Mistral 7B (Free)', free: true },
  { id: 'moonshotai/kimi-k2:free', label: 'Kimi K2 (Free)', free: true },
  { id: 'qwen/qwen3-235b-a22b:free', label: 'Qwen3 235B (Free)', free: true },
  { id: 'anthropic/claude-sonnet-4-6', label: 'Claude Sonnet 4.6 (Paid)', free: false },
  { id: 'openai/gpt-5', label: 'GPT-5 via OpenRouter (Paid)', free: false },
];

export const OPENAI_MODELS = [
  { id: 'gpt-5', label: 'GPT-5 ⭐ (En Güçlü)' },
  { id: 'gpt-4o', label: 'GPT-4o' },
  { id: 'gpt-4o-mini', label: 'GPT-4o Mini (Ekonomik)' },
  { id: 'o3', label: 'o3 (Reasoning)' },
  { id: 'o4-mini', label: 'o4-mini (Reasoning, Hızlı)' },
];

export const ANTHROPIC_MODELS = [
  { id: 'claude-opus-4-6', label: 'Claude Opus 4.6 ⭐ (En Güçlü)' },
  { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6 (Dengeli)' },
  { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5 (Hızlı)' },
];

export const XAI_MODELS = [
  { id: 'grok-4', label: 'Grok 4 ⭐ (En Güçlü)' },
  { id: 'grok-4-fast', label: 'Grok 4 Fast (Hızlı)' },
  { id: 'grok-3', label: 'Grok 3' },
  { id: 'grok-3-fast', label: 'Grok 3 Fast (Ekonomik)' },
];

export const PERPLEXITY_MODELS = [
  { id: 'sonar-pro', label: 'Sonar Pro ⭐ (En Güçlü)' },
  { id: 'sonar', label: 'Sonar (Dengeli)' },
  { id: 'sonar-reasoning-pro', label: 'Sonar Reasoning Pro (CoT)' },
];

export const ZAI_MODELS = [
  { id: 'glm-4.7', label: 'GLM-4.7 ⭐ (En Güçlü, 200K)' },
  { id: 'glm-4.6', label: 'GLM-4.6 (Dengeli)' },
  { id: 'glm-4-flash', label: 'GLM-4 Flash (Hızlı)' },
];

export const KIMI_MODELS = [
  { id: 'kimi-k2', label: 'Kimi K2 ⭐ (En Güçlü, 128K)' },
  { id: 'kimi-k2-thinking', label: 'Kimi K2 Thinking (Reasoning)' },
  { id: 'moonshot-v1-128k', label: 'Moonshot v1 128K (Eski)' },
];

export const QWEN_MODELS = [
  { id: 'qwen3-max', label: 'Qwen3 Max ⭐ (En Güçlü)' },
  { id: 'qwen-max-latest', label: 'Qwen Max Latest (Güncel)' },
  { id: 'qwen-plus-latest', label: 'Qwen Plus Latest (Dengeli)' },
  { id: 'qwen-turbo', label: 'Qwen Turbo (Hızlı)' },
];

async function callGeminiAPI(prompt, systemInstruction, apiKey, inlineData, isJson, model) {
  const geminiModel = model || 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;
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

async function callGroqAPI(prompt, systemInstruction, apiKey) {
  const payload = {
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt },
    ],
    temperature: 0.4,
    max_tokens: 8192,
    top_p: 0.9,
  };

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify(payload),
  });

  if (response.status === 429) return { rateLimited: true };
  if (!response.ok) throw new Error(`Groq HTTP error: ${response.status}`);

  const data = await response.json();
  return { text: data.choices?.[0]?.message?.content || 'Bir yanıt oluşturulamadı.' };
}

async function callOpenRouterAPI(prompt, systemInstruction, apiKey, model, isJson = false) {
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
  // JSON mode — only add for models that support it (non-free models and some free ones)
  // Avoids breaking free models that don't support response_format
  if (isJson && model && !model.endsWith(':free')) {
    payload.response_format = { type: 'json_object' };
  }

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

async function callOpenAIAPI(prompt, systemInstruction, apiKey, model) {
  const payload = {
    model: model || 'gpt-4o',
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt },
    ],
    temperature: 0.4,
    max_tokens: 8192,
  };

  const response = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify(payload),
  });

  if (response.status === 429) return { rateLimited: true };
  if (!response.ok) throw new Error(`OpenAI HTTP error: ${response.status}`);

  const data = await response.json();
  return { text: data.choices?.[0]?.message?.content || 'Bir yanıt oluşturulamadı.' };
}

async function callAnthropicAPI(prompt, systemInstruction, apiKey, model) {
  const payload = {
    model: model || 'claude-sonnet-4-6',
    max_tokens: 8192,
    system: systemInstruction,
    messages: [{ role: 'user', content: prompt }],
  };

  const response = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 429) return { rateLimited: true };
  if (!response.ok) throw new Error(`Anthropic HTTP error: ${response.status}`);

  const data = await response.json();
  return { text: data.content?.[0]?.text || 'Bir yanıt oluşturulamadı.' };
}

async function callXAIAPI(prompt, systemInstruction, apiKey, model) {
  const payload = {
    model: model || 'grok-4',
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt },
    ],
    temperature: 0.4,
    max_tokens: 8192,
  };

  const response = await fetch(XAI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify(payload),
  });

  if (response.status === 429) return { rateLimited: true };
  if (!response.ok) throw new Error(`xAI HTTP error: ${response.status}`);

  const data = await response.json();
  return { text: data.choices?.[0]?.message?.content || 'Bir yanıt oluşturulamadı.' };
}

async function callPerplexityAPI(prompt, systemInstruction, apiKey, model) {
  const payload = {
    model: model || 'sonar-pro',
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt },
    ],
    temperature: 0.4,
    max_tokens: 8192,
  };

  const response = await fetch(PERPLEXITY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify(payload),
  });

  if (response.status === 429) return { rateLimited: true };
  if (!response.ok) throw new Error(`Perplexity HTTP error: ${response.status}`);

  const data = await response.json();
  return { text: data.choices?.[0]?.message?.content || 'Bir yanıt oluşturulamadı.' };
}

async function callZAIAPI(prompt, systemInstruction, apiKey, model) {
  const payload = {
    model: model || 'glm-4-plus',
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt },
    ],
    temperature: 0.4,
    max_tokens: 8192,
  };

  const response = await fetch(ZAI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify(payload),
  });

  if (response.status === 429) return { rateLimited: true };
  if (!response.ok) throw new Error(`z.ai HTTP error: ${response.status}`);

  const data = await response.json();
  return { text: data.choices?.[0]?.message?.content || 'Bir yanıt oluşturulamadı.' };
}

async function callKimiAPI(prompt, systemInstruction, apiKey, model) {
  const payload = {
    model: model || 'moonshot-v1-128k',
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt },
    ],
    temperature: 0.4,
    max_tokens: 8192,
  };

  const response = await fetch(KIMI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify(payload),
  });

  if (response.status === 429) return { rateLimited: true };
  if (!response.ok) throw new Error(`Kimi HTTP error: ${response.status}`);

  const data = await response.json();
  return { text: data.choices?.[0]?.message?.content || 'Bir yanıt oluşturulamadı.' };
}

async function callQwenAPI(prompt, systemInstruction, apiKey, model) {
  const payload = {
    model: model || 'qwen-max',
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt },
    ],
    temperature: 0.4,
    max_tokens: 8192,
  };

  const response = await fetch(QWEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify(payload),
  });

  if (response.status === 429) return { rateLimited: true };
  if (!response.ok) throw new Error(`Qwen HTTP error: ${response.status}`);

  const data = await response.json();
  return { text: data.choices?.[0]?.message?.content || 'Bir yanıt oluşturulamadı.' };
}

/**
 * Unified AI API caller.
 * @param {string} provider - 'gemini' | 'groq' | 'openrouter' | 'openai' | 'anthropic' | 'xai' | 'perplexity' | 'zai' | 'kimi' | 'qwen'
 */
export async function callGemini(prompt, systemInstruction, apiKey, inlineData = null, isJson = false, provider = 'gemini', selectedModel = null) {
  // Kullanıcının seçtiği provider her zaman öncelikli — prefix override yok.
  const effectiveProvider = provider;

  const delays = [1000, 2000, 4000, 8000, 16000];

  for (let i = 0; i < 5; i++) {
    try {
      let result;
      switch (effectiveProvider) {
        case 'groq':
          result = await callGroqAPI(prompt, systemInstruction, apiKey);
          break;
        case 'openrouter':
          result = await callOpenRouterAPI(prompt, systemInstruction, apiKey, selectedModel, isJson);
          break;
        case 'openai':
          result = await callOpenAIAPI(prompt, systemInstruction, apiKey, selectedModel);
          break;
        case 'anthropic':
          result = await callAnthropicAPI(prompt, systemInstruction, apiKey, selectedModel);
          break;
        case 'xai':
          result = await callXAIAPI(prompt, systemInstruction, apiKey, selectedModel);
          break;
        case 'perplexity':
          result = await callPerplexityAPI(prompt, systemInstruction, apiKey, selectedModel);
          break;
        case 'zai':
          result = await callZAIAPI(prompt, systemInstruction, apiKey, selectedModel);
          break;
        case 'kimi':
          result = await callKimiAPI(prompt, systemInstruction, apiKey, selectedModel);
          break;
        case 'qwen':
          result = await callQwenAPI(prompt, systemInstruction, apiKey, selectedModel);
          break;
        default:
          result = await callGeminiAPI(prompt, systemInstruction, apiKey, inlineData, isJson, selectedModel);
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
