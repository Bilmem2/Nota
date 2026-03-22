const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const XAI_URL = 'https://api.x.ai/v1/chat/completions';
const PERPLEXITY_URL = 'https://api.perplexity.ai/chat/completions';
const ZAI_URL = 'https://api.z.ai/api/paas/v4/chat/completions';
const KIMI_URL = 'https://api.moonshot.cn/v1/chat/completions';
const QWEN_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';

export const GEMINI_MODELS = [
  { id: 'gemini-2.5-pro',   label: 'Gemini 2.5 Pro 💳 (Ücretli, En Güçlü)' },
  { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash ⭐ (Ücretsiz*, Hızlı)' },
  { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (Ücretsiz*, Kararlı)' },
  { id: 'gemini-1.5-pro',   label: 'Gemini 1.5 Pro (Ücretsiz*, Eski)' },
];
// * Ücretsiz tier: günlük istek limiti var (2.5 Flash ~20 istek/gün)

export const OPENROUTER_MODELS = [
  // --- Ücretsiz (En İyi) ---
  { id: 'meta-llama/llama-3.3-70b-instruct:free',            label: 'Llama 3.3 70B ⭐ (Free, Önerilen)',  free: true,  maxTokens: 8192   },
  { id: 'google/gemma-3-27b-it:free',                        label: 'Gemma 3 27B (Free)',                 free: true,  maxTokens: 8192   },
  { id: 'qwen/qwen3-next-80b-a3b-instruct:free',             label: 'Qwen3 Next 80B (Free)',              free: true,  maxTokens: 8192   },
  { id: 'nvidia/nemotron-3-super-120b-a12b:free',            label: 'Nemotron Super 120B (Free)',         free: true,  maxTokens: 32768  },
  { id: 'openai/gpt-oss-120b:free',                          label: 'GPT OSS 120B (Free)',                free: true,  maxTokens: 16384  },
  { id: 'minimax/minimax-m2.5:free',                         label: 'MiniMax M2.5 (Free)',                free: true,  maxTokens: 16384  },
  { id: 'mistralai/mistral-small-3.1-24b-instruct:free',     label: 'Mistral Small 3.1 24B (Free)',       free: true,  maxTokens: 8192   },
  { id: 'nousresearch/hermes-3-llama-3.1-405b:free',         label: 'Hermes 3 Llama 405B (Free)',         free: true,  maxTokens: 8192   },
  // --- Ücretsiz (Google) ---
  { id: 'google/gemma-3-12b-it:free',                        label: 'Gemma 3 12B (Free)',                 free: true,  maxTokens: 8192   },
  { id: 'google/gemma-3-4b-it:free',                         label: 'Gemma 3 4B (Free)',                  free: true,  maxTokens: 8192   },
  { id: 'google/gemma-3n-e4b-it:free',                       label: 'Gemma 3n 4B (Free)',                 free: true,  maxTokens: 2048   },
  { id: 'google/gemma-3n-e2b-it:free',                       label: 'Gemma 3n 2B (Free)',                 free: true,  maxTokens: 2048   },
  // --- Ücretli (Google) ---
  { id: 'google/gemini-2.5-pro',                             label: 'Gemini 2.5 Pro (Paid)',              free: false, maxTokens: 65536  },
  { id: 'google/gemini-2.5-flash',                           label: 'Gemini 2.5 Flash (Paid)',            free: false, maxTokens: 65535  },
  { id: 'google/gemini-2.5-flash-lite',                      label: 'Gemini 2.5 Flash Lite (Paid)',       free: false, maxTokens: 65535  },
  { id: 'google/gemini-2.0-flash-001',                       label: 'Gemini 2.0 Flash (Paid)',            free: false, maxTokens: 8192   },
  { id: 'google/gemini-2.0-flash-lite-001',                  label: 'Gemini 2.0 Flash Lite (Paid)',       free: false, maxTokens: 8192   },
  // --- Ücretli (Diğer) ---
  { id: 'anthropic/claude-opus-4-5',                         label: 'Claude Opus 4.5 (Paid)',             free: false, maxTokens: 64000  },
  { id: 'anthropic/claude-sonnet-4-5',                       label: 'Claude Sonnet 4.5 (Paid)',           free: false, maxTokens: 64000  },
  { id: 'anthropic/claude-haiku-4-5',                        label: 'Claude Haiku 4.5 (Paid)',            free: false, maxTokens: 64000  },
  { id: 'openai/gpt-4o',                                     label: 'GPT-4o (Paid)',                      free: false, maxTokens: 16384  },
  { id: 'x-ai/grok-4',                                       label: 'Grok 4 (Paid)',                      free: false, maxTokens: 16384  },
  { id: 'moonshotai/kimi-k2-0905',                           label: 'Kimi K2 0905 (Paid)',                free: false, maxTokens: 16384  },
  { id: 'qwen/qwen3-235b-a22b',                              label: 'Qwen3 235B (Paid)',                  free: false, maxTokens: 8192   },
  { id: 'qwen/qwen-max',                                     label: 'Qwen Max (Paid)',                    free: false, maxTokens: 8192   },
  { id: 'minimax/minimax-m2.5',                              label: 'MiniMax M2.5 (Paid)',                free: false, maxTokens: 65536  },
];

export const OPENAI_MODELS = [
  // Hepsi ücretli — API anahtarı gerektirir
  // GPT-5.4 serisi (Mart 2026, en güncel)
  { id: 'gpt-5.4',        label: 'GPT-5.4 💳 (Ücretli, En Güçlü)',      maxTokens: 32768  },
  { id: 'gpt-5.4-mini',   label: 'GPT-5.4 Mini 💳 (Ücretli, Ekonomik)', maxTokens: 32768  },
  { id: 'gpt-5.4-nano',   label: 'GPT-5.4 Nano 💳 (Ücretli, En Ucuz)',  maxTokens: 32768  },
  // GPT-5 serisi
  { id: 'gpt-5',          label: 'GPT-5 💳 (Ücretli, Flagship)',         maxTokens: 32768  },
  // GPT-4.1 serisi
  { id: 'gpt-4.1',        label: 'GPT-4.1 💳 (Ücretli, 1M ctx)',        maxTokens: 32768  },
  { id: 'gpt-4.1-mini',   label: 'GPT-4.1 Mini 💳 (Ücretli, Dengeli)',  maxTokens: 32768  },
  { id: 'gpt-4.1-nano',   label: 'GPT-4.1 Nano 💳 (Ücretli, En Ucuz)', maxTokens: 32768  },
  // GPT-4o serisi
  { id: 'gpt-4o',         label: 'GPT-4o 💳 (Ücretli)',                 maxTokens: 16384  },
  { id: 'gpt-4o-mini',    label: 'GPT-4o Mini 💳 (Ücretli, Ekonomik)',  maxTokens: 16384  },
  // o-serisi reasoning
  { id: 'o3',             label: 'o3 💳 (Ücretli, Güçlü Reasoning)',    maxTokens: 100000 },
  { id: 'o4-mini',        label: 'o4-mini 💳 (Ücretli, Ekonomik)',      maxTokens: 100000 },
];

export const ANTHROPIC_MODELS = [
  // Hepsi ücretli
  { id: 'claude-opus-4-6',           label: 'Claude Opus 4.6 💳 (Ücretli, En Güçlü)',   maxTokens: 128000 },
  { id: 'claude-sonnet-4-6',         label: 'Claude Sonnet 4.6 💳 (Ücretli, Dengeli)',  maxTokens: 64000  },
  { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5 💳 (Ücretli, Ekonomik)', maxTokens: 8192   },
];

export const XAI_MODELS = [
  // Hepsi ücretli
  { id: 'grok-4.20',   label: 'Grok 4.20 💳 (Ücretli, En Yeni)',       maxTokens: 16384 },
  { id: 'grok-4',      label: 'Grok 4 💳 (Ücretli, 256K ctx)',          maxTokens: 16384 },
  { id: 'grok-3',      label: 'Grok 3 💳 (Ücretli, Dengeli)',           maxTokens: 16384 },
  { id: 'grok-3-mini', label: 'Grok 3 Mini 💳 (Ücretli, Ekonomik)',     maxTokens: 16384 },
];

export const PERPLEXITY_MODELS = [
  // Hepsi ücretli
  { id: 'sonar-pro',           label: 'Sonar Pro 💳 (Ücretli, Web Aramalı)',        maxTokens: 8192 },
  { id: 'sonar',               label: 'Sonar 💳 (Ücretli, Hızlı Web Aramalı)',     maxTokens: 8192 },
  { id: 'sonar-reasoning-pro', label: 'Sonar Reasoning Pro 💳 (Ücretli, CoT+Web)', maxTokens: 8192 },
  { id: 'sonar-deep-research', label: 'Sonar Deep Research 💳 (Ücretli, Derin)',   maxTokens: 8192 },
];
// Not: sonar-reasoning Aralık 2025'te kaldırıldı → sonar-reasoning-pro kullanın

export const ZAI_MODELS = [
  { id: 'glm-5',       label: 'GLM-5 💳 (Ücretli, En Güçlü)',        maxTokens: 8192 },
  { id: 'glm-5-turbo', label: 'GLM-5-Turbo 💳 (Ücretli, Agentic)',   maxTokens: 8192 },
  { id: 'glm-4.5',     label: 'GLM-4.5 💳 (Ücretli, MoE)',           maxTokens: 8192 },
  { id: 'glm-4-flash', label: 'GLM-4 Flash ⭐ (Ücretsiz*, Hızlı)',   maxTokens: 8192 },
];
// * GLM-4 Flash: z.ai üzerinde ücretsiz tier mevcut (rate limit var)

export const KIMI_MODELS = [
  // Hepsi ücretli
  { id: 'kimi-k2.5',              label: 'Kimi K2.5 💳 (Ücretli, En Güçlü)',          maxTokens: 16384 },
  { id: 'kimi-k2-thinking',       label: 'Kimi K2 Thinking 💳 (Ücretli, Reasoning)',  maxTokens: 16384 },
  { id: 'kimi-k2-thinking-turbo', label: 'Kimi K2 Thinking Turbo 💳 (Ücretli, Hızlı)', maxTokens: 16384 },
  { id: 'kimi-k2-0905-preview',   label: 'Kimi K2 0905 💳 (Ücretli, Coding)',         maxTokens: 16384 },
  { id: 'kimi-k2-turbo-preview',  label: 'Kimi K2 Turbo 💳 (Ücretli, 60+ tok/s)',    maxTokens: 16384 },
  { id: 'moonshot-v1-128k',       label: 'Moonshot v1 128K 💳 (Ücretli, Eski)',       maxTokens: 8192  },
];

export const QWEN_MODELS = [
  // Hepsi ücretli (DashScope'ta ücretsiz tier yok)
  { id: 'qwen3-max',        label: 'Qwen3 Max 💳 (Ücretli, En Güçlü)',       maxTokens: 16384 },
  { id: 'qwen3-max-latest', label: 'Qwen3 Max Latest 💳 (Ücretli, Güncel)',  maxTokens: 16384 },
  { id: 'qwen-max-latest',  label: 'Qwen Max Latest 💳 (Ücretli, Kararlı)', maxTokens: 8192  },
  { id: 'qwen-plus-latest', label: 'Qwen Plus Latest 💳 (Ücretli, 1M ctx)', maxTokens: 8192  },
  { id: 'qwen-turbo',       label: 'Qwen Turbo 💳 (Ücretli, Ekonomik)',     maxTokens: 8192  },
  { id: 'qwen-long',        label: 'Qwen Long 💳 (Ücretli, 10M ctx)',       maxTokens: 6144  },
];
// Not: Ücretsiz Qwen modelleri için OpenRouter'ı kullanın (qwen/qwen3-next-80b-a3b-instruct:free vb.)

export const DEEPSEEK_MODELS = [
  // Hepsi ücretli (çok düşük fiyatlı ama ücretsiz değil)
  { id: 'deepseek-chat',     label: 'DeepSeek-V3.2 💳 (Ücretli, 128K ctx)',      maxTokens: 8192  },
  { id: 'deepseek-reasoner', label: 'DeepSeek-R2 💳 (Ücretli, Thinking 64K)',    maxTokens: 65536 },
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
  // Bazı modeller (Gemini, Llama, Gemma vb.) system role'ünü desteklemez.
  // System instruction'ı user mesajına prepend ederek evrensel uyumluluk sağlıyoruz.
  const combinedUserContent = systemInstruction
    ? `${systemInstruction}\n\n---\n\n${prompt}`
    : prompt;

  const modelConfig = OPENROUTER_MODELS.find(m => m.id === model);
  const maxTokens = modelConfig?.maxTokens ?? 4096;

  const payload = {
    model: model || OPENROUTER_MODELS[0].id,
    messages: [
      { role: 'user', content: combinedUserContent },
    ],
    temperature: 0.4,
    max_tokens: maxTokens,
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
  const modelConfig = OPENAI_MODELS.find(m => m.id === model);
  const maxTokens = modelConfig?.maxTokens ?? 16384;

  const payload = {
    model: model || 'gpt-4o',
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt },
    ],
    temperature: 0.4,
    max_tokens: maxTokens,
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
  const modelConfig = ANTHROPIC_MODELS.find(m => m.id === model);
  const maxTokens = modelConfig?.maxTokens ?? 8192;

  const payload = {
    model: model || 'claude-sonnet-4-6',
    max_tokens: maxTokens,
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
  const modelConfig = XAI_MODELS.find(m => m.id === model);
  const maxTokens = modelConfig?.maxTokens ?? 16384;

  const payload = {
    model: model || 'grok-4',
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt },
    ],
    temperature: 0.4,
    max_tokens: maxTokens,
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
  const modelConfig = PERPLEXITY_MODELS.find(m => m.id === model);
  const maxTokens = modelConfig?.maxTokens ?? 8192;

  const payload = {
    model: model || 'sonar-pro',
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt },
    ],
    temperature: 0.4,
    max_tokens: maxTokens,
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
  const modelConfig = ZAI_MODELS.find(m => m.id === model);
  const maxTokens = modelConfig?.maxTokens ?? 8192;

  const payload = {
    model: model || 'glm-4-plus',
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt },
    ],
    temperature: 0.4,
    max_tokens: maxTokens,
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
  const modelConfig = KIMI_MODELS.find(m => m.id === model);
  const maxTokens = modelConfig?.maxTokens ?? 8192;

  const payload = {
    model: model || 'moonshot-v1-128k',
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt },
    ],
    temperature: 0.4,
    max_tokens: maxTokens,
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
  const modelConfig = QWEN_MODELS.find(m => m.id === model);
  const maxTokens = modelConfig?.maxTokens ?? 8192;

  const payload = {
    model: model || 'qwen-max',
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt },
    ],
    temperature: 0.4,
    max_tokens: maxTokens,
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

async function callDeepSeekAPI(prompt, systemInstruction, apiKey, model) {
  const modelConfig = DEEPSEEK_MODELS.find(m => m.id === model);
  const maxTokens = modelConfig?.maxTokens ?? 8192;

  const payload = {
    model: model || 'deepseek-chat',
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt },
    ],
    temperature: 0.4,
    max_tokens: maxTokens,
  };

  const response = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify(payload),
  });

  if (response.status === 429) return { rateLimited: true };
  if (!response.ok) throw new Error(`DeepSeek HTTP error: ${response.status}`);

  const data = await response.json();
  return { text: data.choices?.[0]?.message?.content || 'Bir yanıt oluşturulamadı.' };
}

/**
 * Unified AI API caller.
 * @param {string} provider - 'gemini' | 'groq' | 'openrouter' | 'openai' | 'anthropic' | 'xai' | 'perplexity' | 'zai' | 'kimi' | 'qwen' | 'deepseek'
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
        case 'deepseek':
          result = await callDeepSeekAPI(prompt, systemInstruction, apiKey, selectedModel);
          break;
        default:
          result = await callGeminiAPI(prompt, systemInstruction, apiKey, inlineData, isJson, selectedModel);
      }

      if (result.rateLimited) {
        throw new Error('RATE_LIMITED');
      }
      return result.text;
    } catch (error) {
      const msg = error.message || '';
      // Kalıcı hatalar — retry yapma, direkt fırlat
      if (
        msg.includes('401') || msg.includes('403') || msg.includes('404') ||
        msg.includes('400') || msg.includes('geçersiz') || msg.includes('bulunamadı')
      ) {
        throw error;
      }
      if (i === 4) {
        // Son denemede de başarısız — rate limit mi yoksa ağ hatası mı?
        throw new Error(msg === 'RATE_LIMITED' ? 'RATE_LIMITED' : 'NETWORK_ERROR');
      }
      // Rate limit — daha uzun bekleyerek retry yap
      const rateLimitDelays = [5000, 10000, 20000, 40000, 60000];
      const delay = msg === 'RATE_LIMITED' ? rateLimitDelays[i] : delays[i];
      await new Promise(res => setTimeout(res, delay));
    }
  }
}
