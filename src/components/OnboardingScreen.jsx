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
      { text: 'Buraya yapıştır ve Başla\'ya bas', sub: 'Anahtar sadece tarayıcında saklanır' },
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
      { text: 'Buraya yapıştır ve Başla\'ya bas', sub: 'Anahtar sadece tarayıcında saklanır' },
    ],
  },
};

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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-slate-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Yapay Öğretmen</h1>
          <p className="text-slate-400 text-sm">Başlamak için bir AI sağlayıcısı ve API anahtarı seçin.</p>
        </div>

        {/* Sağlayıcı Seçimi */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {Object.entries(GUIDES).map(([key, val]) => (
            <button
              key={key}
              type="button"
              onClick={() => { setProvider(key); setApiKey(''); setError(''); setShowGuide(false); }}
              className={`p-3 rounded-xl border-2 text-left transition ${
                provider === key
                  ? 'border-indigo-500 bg-indigo-500/10 text-white'
                  : 'border-slate-600 text-slate-400 hover:border-slate-500'
              }`}
            >
              <div className="font-bold text-sm">{val.label}</div>
              <div className="text-xs mt-1 opacity-70">{val.hint}</div>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-slate-300 mb-2">
              {info.label} API Anahtarı
            </label>
            <input
              id="apiKey"
              type="text"
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value); if (error) setError(''); }}
              placeholder={info.placeholder}
              className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            Başla
          </button>
        </form>

        {/* Nasıl alırım? toggle */}
        <button
          type="button"
          onClick={() => setShowGuide((v) => !v)}
          className="mt-5 w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-slate-300 text-sm transition"
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
          <div className="mt-3 bg-slate-700/40 border border-slate-600 rounded-xl p-4">
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

        <p className="mt-4 text-center text-xs text-slate-500">
          Anahtarınız yalnızca tarayıcınızda saklanır, hiçbir sunucuya gönderilmez.
        </p>
      </div>
    </div>
  );
}
