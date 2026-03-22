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
  // --- Ücretsiz (Google) ---
  { id: 'google/gemini-2.0-flash-exp:free',                  label: 'Gemini 2.0 Flash Exp ⭐ (Free)',    free: true },
  { id: 'google/gemini-2.0-flash-thinking-exp:free',         label: 'Gemini 2.0 Flash Thinking (Free)', free: true },
  { id: 'google/gemma-3-27b-it:free',                        label: 'Gemma 3 27B (Free)',                free: true },
  { id: 'google/gemma-3-12b-it:free',                        label: 'Gemma 3 12B (Free)',                free: true },
  { id: 'google/gemma-3-4b-it:free',                         label: 'Gemma 3 4B (Free)',                 free: true },
  { id: 'google/gemma-3n-e4b-it:free',                       label: 'Gemma 3n 4B (Free)',                free: true },
  { id: 'google/gemma-3n-e2b-it:free',                       label: 'Gemma 3n 2B (Free)',                free: true },
  // --- Ücretsiz (Diğer) ---
  { id: 'meta-llama/llama-3.3-70b-instruct:free',            label: 'Llama 3.3 70B ⭐ (Free)',           free: true },
  { id: 'openai/gpt-oss-120b:free',                          label: 'GPT OSS 120B (Free)',               free: true },
  { id: 'nvidia/nemotron-3-super-120b-a12b:free',            label: 'Nemotron Super 120B (Free)',        free: true },
  { id: 'qwen/qwen3-next-80b-a3b-instruct:free',             label: 'Qwen3 Next 80B (Free)',             free: true },
  { id: 'minimax/minimax-m2.5:free',                         label: 'MiniMax M2.5 (Free)',               free: true },
  { id: 'mistralai/mistral-small-3.1-24b-instruct:free',     label: 'Mistral Small 3.1 24B (Free)',      free: true },
  { id: 'nousresearch/hermes-3-llama-3.1-405b:free',         label: 'Hermes 3 Llama 405B (Free)',        free: true },
  { id: 'qwen/qwen3-4b:free',                                label: 'Qwen3 4B (Free, Hızlı)',            free: true },
  // --- Ücretli (Google) ---
  { id: 'google/gemini-3.1-pro-preview',                     label: 'Gemini 3.1 Pro Preview (Paid)',     free: false },
  { id: 'google/gemini-3.1-flash-lite-preview',              label: 'Gemini 3.1 Flash Lite (Paid)',      free: false },
  { id: 'google/gemini-3-flash-preview',                     label: 'Gemini 3 Flash Preview (Paid)',     free: false },
  { id: 'google/gemini-2.5-pro',                             label: 'Gemini 2.5 Pro (Paid)',             free: false },
  { id: 'google/gemini-2.5-flash',                           label: 'Gemini 2.5 Flash (Paid)',           free: false },
  { id: 'google/gemini-2.5-flash-lite',                      label: 'Gemini 2.5 Flash Lite (Paid)',      free: false },
  { id: 'google/gemini-2.0-flash-001',                       label: 'Gemini 2.0 Flash (Paid)',           free: false },
  { id: 'google/gemini-2.0-flash-lite-001',                  label: 'Gemini 2.0 Flash Lite (Paid)',      free: false },
  // --- Ücretli (Diğer) ---
  { id: 'anthropic/claude-opus-4-6',                         label: 'Claude Opus 4.6 (Paid)',            free: false },
  { id: 'anthropic/claude-sonnet-4-6',                       label: 'Claude Sonnet 4.6 (Paid)',          free: false },
  { id: 'openai/gpt-5',                                      label: 'GPT-5 (Paid)',                      free: false },
  { id: 'openai/gpt-4.1',                                    label: 'GPT-4.1 (Paid)',                    free: false },
  { id: 'openai/gpt-4o',                                     label: 'GPT-4o (Paid)',                     free: false },
  { id: 'x-ai/grok-4',                                       label: 'Grok 4 (Paid)',                     free: false },
  { id: 'moonshotai/kimi-k2',                                label: 'Kimi K2 (Paid)',                    free: false },
  { id: 'qwen/qwen3-max',                                    label: 'Qwen3 Max (Paid)',                  free: false },
  { id: 'minimax/minimax-m2',                                label: 'MiniMax M2 (Paid)',                  free: false },
];

export const OPENAI_MODELS = [
  // GPT-5 serisi
  { id: 'gpt-5',          label: 'GPT-5 ⭐ (En Güçlü, Agentic)' },
  { id: 'gpt-5-mini',     label: 'GPT-5 Mini (Ekonomik GPT-5)' },
  // GPT-4.1 serisi (yeni üretim standardı)
  { id: 'gpt-4.1',        label: 'GPT-4.1 (Üretim, 1M ctx)' },
  { id: 'gpt-4.1-mini',   label: 'GPT-4.1 Mini (Dengeli)' },
  { id: 'gpt-4.1-nano',   label: 'GPT-4.1 Nano (En Ucuz)' },
  // GPT-4o serisi (eski üretim)
  { id: 'gpt-4o',         label: 'GPT-4o (Eski Üretim)' },
  { id: 'gpt-4o-mini',    label: 'GPT-4o Mini (Eski Ekonomik)' },
  // o-serisi reasoning
  { id: 'o3',             label: 'o3 (Güçlü Reasoning)' },
  { id: 'o4-mini',        label: 'o4-mini (Ekonomik Reasoning)' },
];

export const ANTHROPIC_MODELS = [
  { id: 'claude-opus-4-6',              label: 'Claude Opus 4.6 ⭐ (En Güçlü, Agentic)' },
  { id: 'claude-sonnet-4-6',            label: 'Claude Sonnet 4.6 (Dengeli, Üretim)' },
  { id: 'claude-haiku-4-5-20251001',    label: 'Claude Haiku 4.5 (Hızlı, Ekonomik)' },
];

export const XAI_MODELS = [
  { id: 'grok-4.20',      label: 'Grok 4.20 ⭐ (En Yeni, Agentic)' },
  { id: 'grok-4',         label: 'Grok 4 (Reasoning, 256K ctx)' },
  { id: 'grok-3',         label: 'Grok 3 (Dengeli)' },
  { id: 'grok-3-mini',    label: 'Grok 3 Mini (Ekonomik Reasoning)' },
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
  { id: 'kimi-k2-0905-preview',     label: 'Kimi K2 0905 ⭐ (En Güçlü, 1T param)' },
  { id: 'kimi-k2-thinking',         label: 'Kimi K2 Thinking (Derin Reasoning)' },
  { id: 'kimi-k2-thinking-turbo',   label: 'Kimi K2 Thinking Turbo (Hızlı Reasoning)' },
  { id: 'kimi-k2-turbo-preview',    label: 'Kimi K2 Turbo (Hızlı)' },
  { id: 'moonshot-v1-128k',         label: 'Moonshot v1 128K (Eski)' },
];

export const QWEN_MODELS = [
  { id: 'qwen3-max',          label: 'Qwen3 Max ⭐ (En Güçlü, 1T param)' },
  { id: 'qwen3-max-latest',   label: 'Qwen3 Max Latest (Güncel)' },
  { id: 'qwen-max-latest',    label: 'Qwen Max Latest (Kararlı)' },
  { id: 'qwen-plus-latest',   label: 'Qwen Plus Latest (Dengeli, 1M ctx)' },
  { id: 'qwen-turbo',         label: 'Qwen Turbo (Hızlı, Ekonomik)' },
  { id: 'qwen-long',          label: 'Qwen Long (10M ctx)' },
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

  if (isJson) {
    // Not: response_format bazı modellerde desteklenmediği için gönderilmiyor.
    // JSON çıktısı sistem prompt'u ile sağlanıyor.
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
  if (response.status === 401 || response.status === 403) throw new Error('OpenRouter API anahtarı geçersiz veya yetkisiz (401/403).');
  if (response.status === 404) throw new Error('OpenRouter model bulunamadı (404). Lütfen farklı bir model seçin.');
  if (!response.ok) {
    let errBody = '';
    try { errBody = await response.text(); } catch {}
    throw new Error(`OpenRouter HTTP ${response.status}: ${errBody}`);
  }

  let data;
  try { data = await response.json(); } catch { throw new Error('OpenRouter geçersiz yanıt döndürdü.'); }

  // OpenRouter hata mesajını HTTP 200 ile de döndürebilir
  if (data.error) throw new Error(`OpenRouter: ${data.error.message || JSON.stringify(data.error)}`);

  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('OpenRouter boş yanıt döndürdü.');
  return { text };
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
      // Kalıcı hatalar (auth, model bulunamadı) — retry yapma, direkt fırlat
      const msg = error.message || '';
      if (msg.includes('401') || msg.includes('403') || msg.includes('404') || msg.includes('geçersiz') || msg.includes('bulunamadı')) {
        throw error;
      }
      await new Promise(res => setTimeout(res, delays[i]));
    }
  }
}
