# Uygulama Planı: Akademik Asistan GitHub Pages Deploy

## Genel Bakış

Mevcut tek dosyalık React uygulaması (`yapay öğretmen kodu v7.txt`) Vite + React projesine taşınır, modüler dosya yapısına ayrılır ve GitHub Actions ile GitHub Pages'e otomatik deploy edilir.

## Görevler

- [x] 1. Vite + React proje iskeletini kur
  - `package.json` oluştur: `react`, `react-dom`, `lucide-react` bağımlılıkları; `@vitejs/plugin-react`, `vite`, `tailwindcss`, `postcss`, `autoprefixer` devDependencies olarak ekle
  - `vite.config.js` oluştur: `@vitejs/plugin-react` plugin'i ve `base: '/akademik-asistan/'` ayarı
  - `tailwind.config.js` ve `postcss.config.js` oluştur
  - `index.html` oluştur: Türkçe `lang`, `<div id="root">` ve `src/main.jsx` script referansı
  - `src/main.jsx` oluştur: `ReactDOM.createRoot` ile `App` bileşenini render et
  - _Gereksinimler: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Yardımcı fonksiyonları modüler dosyalara taşı
  - [x] 2.1 `src/utils/sound.js` oluştur
    - `playSound(type, enabled)` fonksiyonunu `v7.txt`'den taşı, `export` et
    - _Gereksinimler: 14.1, 14.4_

  - [x] 2.2 `src/utils/print.js` oluştur
    - `handlePrint(elementId, title)` fonksiyonunu taşı, `export` et
    - _Gereksinimler: 13.4_

  - [x] 2.3 `src/utils/gemini.js` oluştur
    - `callGemini(prompt, systemInstruction, apiKey, inlineData, isJson)` fonksiyonunu taşı
    - `apiKey` parametresini hardcode yerine dışarıdan alacak şekilde güncelle
    - Retry mantığını (5 deneme, üstel geri çekilme) koru
    - _Gereksinimler: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 2.4 `src/utils/gemini.js` için property testi yaz
    - **Property 9: Retry Sayısı Sınırı**
    - **Validates: Requirements 5.6**

  - [x] 2.5 `src/utils/chunking.js` oluştur
    - `chunkText(text, maxChunkSize = 12_000)` fonksiyonunu taşı, `export` et
    - _Gereksinimler: 7.1, 7.2_

  - [ ]* 2.6 `src/utils/chunking.js` için property testleri yaz
    - **Property 2: Chunk Birleşimi Orijinal Metne Eşit**
    - **Validates: Requirements 7.3**
    - **Property 3: Chunk Boyutu Sınırı**
    - **Validates: Requirements 7.4**

  - [x] 2.7 `src/utils/quiz.js` oluştur
    - `parseJSON(text)` ve `isAnswerCorrect(userAnswer, correctAnswer)` fonksiyonlarını taşı, `export` et
    - _Gereksinimler: 11.1, 11.2, 12.1, 12.2_

  - [ ]* 2.8 `src/utils/quiz.js` için property testleri yaz
    - **Property 5: JSON Ayrıştırma Round-Trip**
    - **Validates: Requirements 11.3**
    - **Property 6: Cevap Değerlendirme Simetrisi**
    - **Validates: Requirements 12.3**
    - **Property 7: Cevap Değerlendirme Büyük/Küçük Harf Duyarsızlığı**
    - **Validates: Requirements 12.4**

  - [x] 2.9 `src/utils/markdown.js` oluştur
    - `formatSubSup`, `formatInline`, `renderMarkdown` fonksiyonlarını taşı, `export` et
    - _Gereksinimler: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ]* 2.10 `src/utils/markdown.js` için property testi yaz
    - **Property 8: Markdown Renderer İdempotence**
    - **Validates: Requirements 10.6**

- [x] 3. Kontrol noktası — Tüm testler geçmeli
  - Tüm testlerin geçtiğini doğrula, sorular varsa kullanıcıya sor.

- [x] 4. OnboardingScreen bileşenini oluştur
  - [x] 4.1 `src/components/OnboardingScreen.jsx` oluştur
    - `onApiKeySubmit(apiKey: string)` prop'unu kabul et
    - API anahtarı giriş formu ve Google AI Studio bağlantısı (`https://aistudio.google.com/app/apikey`) ekle
    - Boş anahtar gönderimini engelle
    - _Gereksinimler: 3.1, 3.6_

  - [ ]* 4.2 OnboardingScreen için birim testi yaz
    - API anahtarı yokken ekranın gösterildiğini test et
    - Boş anahtar gönderiminin engellendiğini test et
    - _Gereksinimler: 3.1, 3.5_

- [x] 5. App.jsx'i oluştur ve tüm bileşenleri birleştir
  - [x] 5.1 `src/components/VisualSummaryComponent.jsx` oluştur
    - `VisualSummaryComponent` bileşenini `v7.txt`'den taşı
    - _Gereksinimler: 13.1_

  - [x] 5.2 `src/App.jsx` oluştur
    - `v7.txt`'deki tüm state ve handler'ları taşı
    - `apiKey` state'i ekle: `useState(() => localStorage.getItem('gemini_api_key') || '')`
    - `apiKey` yoksa `<OnboardingScreen onApiKeySubmit={...} />` render et
    - `callGemini` çağrılarına `apiKey` parametresini geç
    - Tüm `import`'ları modüler dosyalardan yap (`utils/`, `components/`)
    - _Gereksinimler: 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_

  - [ ]* 5.3 API anahtarı round-trip için property testi yaz
    - **Property 1: API Anahtarı Round-Trip**
    - **Validates: Requirements 4.3**

  - [ ]* 5.4 Oturum verisi round-trip için property testi yaz
    - **Property 4: Oturum Verisi Round-Trip**
    - **Validates: Requirements 8.3, 9.3**

  - [ ]* 5.5 Oturum silme için property testi yaz
    - **Property 12: Oturum Silme Sonrası Listeden Kaldırma**
    - **Validates: Requirements 8.4**

  - [ ]* 5.6 İçe aktarma hata yönetimi için property testi yaz
    - **Property 13: Geçersiz .akademik Dosyası Hata Yönetimi**
    - **Validates: Requirements 9.4**
    - **Property 14: İçe Aktarılan Oturuma Yeni ID Atanması**
    - **Validates: Requirements 9.5**

- [x] 6. Kontrol noktası — Tüm testler geçmeli
  - Tüm testlerin geçtiğini doğrula, sorular varsa kullanıcıya sor.

- [x] 7. Ek property testleri yaz
  - [ ]* 7.1 Ses devre dışı property testi yaz
    - **Property 15: Ses Devre Dışıyken Ses Üretilmemesi**
    - **Validates: Requirements 14.2**

  - [ ]* 7.2 PDF boyutu validasyonu property testi yaz
    - **Property 10: PDF Boyutu Validasyonu**
    - **Validates: Requirements 6.2, 6.3**

  - [ ]* 7.3 Geçersiz dosya formatı reddi property testi yaz
    - **Property 11: Geçersiz Dosya Formatı Reddi**
    - **Validates: Requirements 6.5**

  - [ ]* 7.4 Tam ekran round-trip property testi yaz
    - **Property 16: Tam Ekran Round-Trip**
    - **Validates: Requirements 15.2**

- [x] 8. GitHub Actions deploy pipeline oluştur
  - `.github/workflows/deploy.yml` dosyasını oluştur
  - `main` branch push tetikleyicisi, `npm ci` + `npm run build` adımları
  - `peaceiris/actions-gh-pages@v4` ile `dist/` dizinini `gh-pages` branch'ine yayımla
  - _Gereksinimler: 2.1, 2.2, 2.3, 2.5_

- [x] 9. README.md oluştur
  - Kurulum adımları (`npm install`, `npm run dev`)
  - Gemini API anahtarı alma talimatları (Google AI Studio bağlantısı)
  - GitHub Pages deploy talimatları (repo ayarları, `base` URL güncelleme)
  - _Gereksinimler: 1.3, 1.4, 2.4_

- [x] 10. Son kontrol noktası — Tüm testler geçmeli
  - Tüm testlerin geçtiğini doğrula, sorular varsa kullanıcıya sor.

## Notlar

- `*` ile işaretli görevler isteğe bağlıdır; hızlı MVP için atlanabilir
- Her görev belirli gereksinimlere referans verir
- Property testleri evrensel doğruluk özelliklerini doğrular; birim testleri belirli örnekleri ve kenar durumları doğrular
- Testler `npx vitest --run` ile çalıştırılır
- `fast-check` ve `vitest` test bağımlılıkları olarak eklenmeli: `npm install --save-dev fast-check vitest @testing-library/react @testing-library/jest-dom jsdom`
