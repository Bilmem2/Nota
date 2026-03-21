import React, { useState } from 'react';

const GUIDES = {
  gemini: {
    label: 'Google Gemini',
    placeholder: 'AIzaSy...',
    link: 'https://aistudio.google.com/app/apikey',
    linkText: "Google AI Studio'dan ücretsiz anahtar al",
    hint: 'Dakikada 15 istek · Ücretsiz',
    steps: [
      { text: 'Yukarıdaki bağlantıya tıkla', sub: 'Google hesabınla giriş yap' },
      { text: '"Create API Key" butonuna bas', sub: 'Herhangi bir proje seçebilirsin' },
      { text: 'Oluşan anahtarı kopyala', sub: '"AIzaSy..." ile başlar' },
      { text: "Buraya yapıştır ve Başla'ya bas", sub: 'Anahtar sadece tarayıcında saklanır' },
    ],
  },
  groq: {
    label: 'Groq',
    placeholder: 'gsk_...',
    link: 'https://console.groq.com/keys',
    linkText: "Groq Console'dan ücretsiz anahtar al",
    hint: 'Dakikada 30 istek · Ücretsiz · Çok hızlı',
    steps: [
      { text: 'Yukarıdaki bağlantıya tıkla', sub: 'Ücretsiz hesap oluştur veya giriş yap' },
      { text: '"Create API Key" butonuna bas', sub: 'İstediğin bir isim ver' },
      { text: 'Oluşan anahtarı kopyala', sub: '"gsk_..." ile başlar' },
      { text: "Buraya yapıştır ve Başla'ya bas", sub: 'Anahtar sadece tarayıcında saklanır' },
    ],
  },
};

const FEATURES = [
  { icon: '📖', label: 'Ders Anlatımı' },
  { icon: '📋', label: 'Çalışma Rehberi' },
  { icon: '🎨', label: 'Görsel Özet' },
  { icon: '🎓', label: 'Sınav Modu' },
  { icon: '💬', label: 'AI Sohbet' },
  { icon: '🎙️', label: 'Podcast' },
];

export default function OnboardingScreen({ onApiKeySubmit }) {
  const [provider, setProvider] = useState('gemini');
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [showGuide, setShowGuide] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('Lütfen bir API anahtarı girin.');
      return;
    }
    setError('');
    onApiKeySubmit(apiKey.trim(), provider);
  };

  const info = GUIDES[provider];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      {/* Arka plan dekoratif blur'lar */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo + Başlık */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-5">
            <img
              src="/yapay-ogretmen/favicon.png"
              alt="Yapay Öğretmen"
              className="w-20 h-20 rounded-2xl shadow-2xl shadow-indigo-900/60 ring-4 ring-white/10"
            />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Yapay Öğretmen
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
            PDF veya ders notunu yükle — AI senin için ders anlatsın, rehber çıkarsın, sınav hazırlasın.
          </p>

          {/* Özellik etiketleri */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {FEATURES.map((f) => (
              <span
                key={f.label}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300 font-medium"
              >
                {f.icon} {f.label}
              </span>
            ))}
          </div>
        </div>

        {/* Kart */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/60 p-7">
          {/* Sağlayıcı Seçimi */}
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">AI Sağlayıcısı</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {Object.entries(GUIDES).map(([key, val]) => (
              <button
                key={key}
                type="button"
                onClick={() => { setProvider(key); setApiKey(''); setError(''); setShowGuide(false); }}
                className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                  provider === key
                    ? 'border-indigo-500 bg-indigo-500/15 text-white shadow-lg shadow-indigo-900/30'
                    : 'border-slate-600 text-slate-400 hover:border-slate-500 hover:bg-slate-700/40'
                }`}
              >
                <div className="font-bold text-sm">{val.label}</div>
                <div className="text-xs mt-1 opacity-60">{val.hint}</div>
              </button>
            ))}
          </div>

          {/* API Key formu */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                {info.label} API Anahtarı
              </label>
              <input
                id="apiKey"
                type="text"
                value={apiKey}
                onChange={(e) => { setApiKey(e.target.value); if (error) setError(''); }}
                placeholder={info.placeholder}
                className="w-full bg-slate-900/60 border border-slate-600 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition font-mono"
              />
              {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-indigo-900/40 text-base"
            >
              Başla →
            </button>
          </form>

          {/* Nasıl alırım? toggle */}
          <button
            type="button"
            onClick={() => setShowGuide((v) => !v)}
            className="mt-4 w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-700/40 hover:bg-slate-700/70 border border-slate-600/60 text-slate-300 text-sm transition"
          >
            <span>API anahtarı nasıl alınır?</span>
            <svg
              className={`w-4 h-4 transition-transform ${showGuide ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showGuide && (
            <div className="mt-3 bg-slate-900/50 border border-slate-600/50 rounded-xl p-4 animate-in fade-in duration-200">
              <a
                href={info.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-semibold mb-4 underline transition"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {info.linkText}
              </a>
              <ol className="space-y-3">
                {info.steps.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <div className="text-slate-200 text-sm font-medium">{step.text}</div>
                      <div className="text-slate-400 text-xs mt-0.5">{step.sub}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <p className="mt-5 text-center text-xs text-slate-500 leading-relaxed">
            🔒 Anahtarınız yalnızca tarayıcınızda saklanır, hiçbir sunucuya gönderilmez.
          </p>
        </div>

        <p className="text-center text-xs text-slate-600 mt-5">© Can Sevilmiş · Yapay Öğretmen v1.0</p>
      </div>
    </div>
  );
}
