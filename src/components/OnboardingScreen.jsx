import React, { useState } from 'react';

// Yalnızca Türkiye timezone'u (Europe/Istanbul) → Türkçe, diğer her şey → İngilizce
const isTurkish = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone === 'Europe/Istanbul';
  } catch (_) {
    return false;
  }
})();

const PROVIDERS = [
  // Ücretsiz
  { id: 'gemini',     label: 'Google Gemini', placeholder: 'AIzaSy...', free: true,
    hintTr: '2.5 Flash ücretsiz · 1M token',
    hintEn: '2.5 Flash free · 1M token',
    link: 'https://aistudio.google.com/app/apikey' },
  { id: 'groq',       label: 'Groq',          placeholder: 'gsk_...',   free: true,
    hintTr: 'Ücretsiz · Llama 3.3 70B · Çok hızlı',
    hintEn: 'Free · Llama 3.3 70B · Very fast',
    link: 'https://console.groq.com/keys' },
  { id: 'openrouter', label: 'OpenRouter',    placeholder: 'sk-or-...', free: true,
    hintTr: 'Ücretsiz modeller var · Çok seçenek',
    hintEn: 'Free models available · Many options',
    link: 'https://openrouter.ai/keys' },
  { id: 'llm7',       label: 'llm7.io',       placeholder: 'llm7-...', free: true,
    hintTr: 'Ücretsiz token · 100 req/h · token.llm7.io',
    hintEn: 'Free token · 100 req/h · token.llm7.io',
    link: 'https://token.llm7.io' },
  // Ücretli
  { id: 'openai',     label: 'OpenAI',        placeholder: 'sk-...',    free: false,
    hintTr: 'GPT-5, GPT-4o, o3...',
    hintEn: 'GPT-5, GPT-4o, o3...',
    link: 'https://platform.openai.com/api-keys' },
  { id: 'anthropic',  label: 'Anthropic',     placeholder: 'sk-ant-...', free: false,
    hintTr: 'Claude Opus / Sonnet 4.6',
    hintEn: 'Claude Opus / Sonnet 4.6',
    link: 'https://console.anthropic.com/' },
  { id: 'xai',        label: 'xAI (Grok)',    placeholder: 'xai-...',   free: false,
    hintTr: 'Grok 4, Grok 4 Fast',
    hintEn: 'Grok 4, Grok 4 Fast',
    link: 'https://console.x.ai/' },
  { id: 'perplexity', label: 'Perplexity',    placeholder: 'pplx-...', free: false,
    hintTr: 'Sonar Pro · Web aramalı',
    hintEn: 'Sonar Pro · Web search',
    link: 'https://www.perplexity.ai/settings/api' },
  { id: 'zai',        label: 'z.ai (GLM)',    placeholder: 'Bearer ...', free: true,
    hintTr: 'GLM-4.7-Flash ücretsiz · 200K token',
    hintEn: 'GLM-4.7-Flash free · 200K token',
    link: 'https://z.ai/manage-apikey/apikey-list' },
  { id: 'kimi',       label: 'Kimi AI',       placeholder: 'sk-...',    free: false,
    hintTr: 'Kimi K2 · 128K token',
    hintEn: 'Kimi K2 · 128K token',
    link: 'https://platform.moonshot.cn/' },
  { id: 'qwen',       label: 'Qwen',          placeholder: 'sk-...',    free: false,
    hintTr: 'Qwen3 Max · 1M token',
    hintEn: 'Qwen3 Max · 1M token',
    link: 'https://modelstudio.console.alibabacloud.com' },
];

const FREE_PROVIDERS = PROVIDERS.filter(p => p.free);
const PAID_PROVIDERS = PROVIDERS.filter(p => !p.free);

const I18N = {
  tr: {
    tagline: 'Sınava kadar uyumaz.',
    desc: 'PDF veya ders notunu yükle — AI senin için ders anlatsın, rehber çıkarsın, sınav hazırlasın.',
    features: [
      { icon: '�', label: 'Ders Anlatımı' },
      { icon: '�📋', label: 'Çalışma Rehberi' },
      { icon: '🎨', label: 'Görsel Özet' },
      { icon: '🎓', label: 'Sınav Modu' },
      { icon: '💬', label: 'AI Sohbet' },
      { icon: '🗺️', label: 'Kavram Haritası' },
    ],
    freeLabel: '✅ Ücretsiz Sağlayıcılar',
    paidLabel: '💳 Ücretli Sağlayıcılar',
    apiKeyLabel: (p) => `${p} API Anahtarı`,
    apiKeyLabelNoKey: 'API Anahtarı Gerekmez',
    errorEmpty: 'Lütfen bir API anahtarı girin.',
    startBtn: 'Başla →',
    startBtnNoKey: 'Anahtarsız Başla →',
    howToGet: 'API anahtarı nasıl alınır?',
    getKeyLink: 'Ücretsiz anahtar al →',
    securityNote: '🔒 Anahtarınız yalnızca tarayıcınızda saklanır, hiçbir sunucuya gönderilmez.',
    skipBtn: 'API anahtarı olmadan devam et',
    skipNote: '⚠️ AI özellikleri (ders anlatımı, sınav, sohbet vb.) API anahtarı olmadan kullanılamaz. Ayarlardan istediğin zaman ekleyebilirsin.',
    skipContinue: 'Yine de devam et →',
    footer: '© Can Sevilmiş · Nota v1.0',
  },
  en: {
    tagline: "Doesn't sleep until the exam.",
    desc: 'Upload a PDF or lecture note — AI explains it, builds a study guide, and prepares your exam.',
    features: [
      { icon: '📖', label: 'Lesson' },
      { icon: '📋', label: 'Study Guide' },
      { icon: '🎨', label: 'Visual Summary' },
      { icon: '🎓', label: 'Quiz Mode' },
      { icon: '💬', label: 'AI Chat' },
      { icon: '�️', label: 'Concept Map' },
    ],
    freeLabel: '✅ Free Providers',
    paidLabel: '💳 Paid Providers',
    apiKeyLabel: (p) => `${p} API Key`,
    apiKeyLabelNoKey: 'No API Key Required',
    errorEmpty: 'Please enter an API key.',
    startBtn: 'Get Started →',
    startBtnNoKey: 'Start Without Key →',
    howToGet: 'How do I get an API key?',
    getKeyLink: 'Get a free key →',
    securityNote: '🔒 Your key is stored only in your browser. It is never sent to any server.',
    skipBtn: 'Continue without an API key',
    skipNote: '⚠️ AI features (lesson, quiz, chat, etc.) require an API key. You can add one anytime from Settings.',
    skipContinue: 'Continue anyway →',
    footer: '© Can Sevilmiş · Nota v1.0',
  },
};

// Bu sağlayıcılar için API anahtarı gerekmez
const NO_KEY_PROVIDERS = [];

export default function OnboardingScreen({ onApiKeySubmit, onSkip }) {
  const [provider, setProvider] = useState('gemini');
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const [showSkipNote, setShowSkipNote] = useState(false);

  const lang = isTurkish ? 'tr' : 'en';
  const t = I18N[lang];
  const meta = PROVIDERS.find(p => p.id === provider);
  const noKeyRequired = NO_KEY_PROVIDERS.includes(provider);

  const detectProviderFromKey = (key) => {
    if (key.startsWith('AIzaSy'))  return 'gemini';
    if (key.startsWith('gsk_'))    return 'groq';
    if (key.startsWith('sk-or-'))  return 'openrouter';
    if (key.startsWith('sk-ant-')) return 'anthropic';
    if (key.startsWith('xai-'))    return 'xai';
    if (key.startsWith('pplx-'))   return 'perplexity';
    return null;
  };

  const detectedProvider = detectProviderFromKey(apiKey.trim());
  const hasMismatch = detectedProvider && detectedProvider !== provider;
  const mismatchLabel = PROVIDERS.find(p => p.id === detectedProvider)?.label;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (noKeyRequired) {
      onApiKeySubmit('no-key', provider);
      return;
    }
    if (!apiKey.trim()) { setError(t.errorEmpty); return; }
    setError('');
    onApiKeySubmit(apiKey.trim(), provider);
  };

  const selectProvider = (id) => {
    setProvider(id);
    setApiKey('');
    setError('');
    setShowGuide(false);
  };

  const ProviderButton = ({ p }) => (
    <button
      key={p.id}
      type="button"
      onClick={() => selectProvider(p.id)}
      className={`p-2 rounded-lg border-2 text-left transition-all ${
        provider === p.id
          ? 'border-indigo-500 bg-indigo-500/15 text-white shadow-lg shadow-indigo-900/30'
          : 'border-slate-600 text-slate-400 hover:border-slate-500 hover:bg-slate-700/40'
      }`}
    >
      <div className="font-bold text-xs leading-tight">{p.label}</div>
      <div className="text-[10px] mt-0.5 opacity-60 leading-tight">{lang === 'tr' ? p.hintTr : p.hintEn}</div>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4 py-6 overflow-y-auto">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Logo + Başlık */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center mb-3">
            <img src="/Nota/favicon.png" alt="Nota" className="w-[72px] h-[72px] rounded-2xl shadow-2xl shadow-indigo-900/60 ring-4 ring-white/10" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mb-1">Nota</h1>
          <p className="text-indigo-300 text-sm font-medium mb-2 italic">{t.tagline}</p>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm mx-auto">{t.desc}</p>
          <div className="flex flex-wrap justify-center gap-1.5 mt-3">
            {t.features.map((f) => (
              <span key={f.label} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300 font-medium">
                {f.icon} {f.label}
              </span>
            ))}
          </div>
        </div>

        {/* Kart */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/60 p-5">

          {/* Ücretsiz Sağlayıcılar */}
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-1.5">{t.freeLabel}</p>
          <div className="grid grid-cols-4 gap-1.5 mb-3">
            {FREE_PROVIDERS.map(p => <ProviderButton key={p.id} p={p} />)}
          </div>

          {/* Ücretli Sağlayıcılar */}
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">{t.paidLabel}</p>
          <div className="grid grid-cols-3 gap-1.5 mb-4 sm:grid-cols-4">
            {PAID_PROVIDERS.map(p => <ProviderButton key={p.id} p={p} />)}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                {noKeyRequired ? t.apiKeyLabelNoKey : t.apiKeyLabel(meta.label)}
              </label>
              {noKeyRequired ? (
                <div className="w-full bg-slate-900/40 border border-emerald-700/50 text-emerald-400 rounded-xl px-4 py-3 text-sm text-center">
                  ✅ {lang === 'tr' ? 'Bu sağlayıcı için anahtar gerekmez.' : 'No key required for this provider.'}
                </div>
              ) : (
                <input
                  id="apiKey"
                  type="text"
                  value={apiKey}
                  onChange={(e) => { setApiKey(e.target.value); if (error) setError(''); }}
                  placeholder={meta.placeholder}
                  className="w-full bg-slate-900/60 border border-slate-600 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition font-mono"
                />
              )}
              {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
              {hasMismatch && !error && (
                <p className="mt-2 text-xs text-amber-400">
                  ⚠️ {lang === 'tr'
                    ? `Bu anahtar ${mismatchLabel} sağlayıcısına ait görünüyor. Yine de ${meta.label} ile devam edebilirsin.`
                    : `This key looks like it belongs to ${mismatchLabel}. You can still continue with ${meta.label}.`}
                </p>
              )}
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-indigo-900/40 text-base">
              {noKeyRequired ? t.startBtnNoKey : t.startBtn}
            </button>
          </form>

          {/* API Key Rehberi — anahtarsız sağlayıcılarda gösterme */}
          {!noKeyRequired && (
            <>
              <button
                type="button"
                onClick={() => setShowGuide((v) => !v)}
                className="mt-4 w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-700/40 hover:bg-slate-700/70 border border-slate-600/60 text-slate-300 text-sm transition"
              >
                <span>{t.howToGet}</span>
                <svg className={`w-4 h-4 transition-transform ${showGuide ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showGuide && (
                <div className="mt-3 bg-slate-900/50 border border-slate-600/50 rounded-xl p-4 animate-in fade-in duration-200">
                  <a
                    href={meta.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-semibold mb-3 underline transition"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {meta.label} — {t.getKeyLink}
                  </a>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {lang === 'tr' ? meta.hintTr : meta.hintEn}
                  </p>
                </div>
              )}
            </>
          )}

          <p className="mt-5 text-center text-xs text-slate-500 leading-relaxed">{t.securityNote}</p>

          {/* Anahtarsız devam et */}
          <div className="mt-4 border-t border-slate-700/60 pt-4">
            <button
              type="button"
              onClick={() => setShowSkipNote((v) => !v)}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-400 transition underline underline-offset-2"
            >
              {t.skipBtn}
            </button>
            {showSkipNote && (
              <div className="mt-3 bg-amber-950/40 border border-amber-700/40 rounded-xl px-4 py-3 text-xs text-amber-300 leading-relaxed">
                {t.skipNote}
                <button
                  type="button"
                  onClick={onSkip}
                  className="mt-3 w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2 rounded-lg transition text-xs"
                >
                  {t.skipContinue}
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-5">{t.footer}</p>
      </div>
    </div>
  );
}
