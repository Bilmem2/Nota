# Akademik Asistan

Yapay zeka destekli kişisel akademik çalışma asistanı. Google Gemini API kullanarak ders materyallerinden otomatik ders anlatımı, çalışma rehberi, görsel özet ve sınav soruları üretir.

---

## Kurulum

```bash
npm install
npm run dev
```

Uygulama varsayılan olarak `http://localhost:5173` adresinde çalışır.

## Gemini API Anahtarı

Uygulamayı kullanmak için bir Google Gemini API anahtarına ihtiyacınız var.

1. [Google AI Studio](https://aistudio.google.com/app/apikey) adresine gidin
2. Google hesabınızla giriş yapın
3. "Create API key" butonuna tıklayarak ücretsiz bir anahtar oluşturun
4. Uygulamayı ilk açtığınızda çıkan ekrana anahtarı girin

API anahtarı tarayıcınızın `localStorage` alanında saklanır; sunucuya gönderilmez.

## GitHub Pages'e Deploy

### 1. Repoyu fork'layın veya klonlayın

```bash
git clone https://github.com/kullanici-adi/akademik-asistan.git
cd akademik-asistan
```

### 2. `vite.config.js` içindeki `base` değerini güncelleyin

`vite.config.js` dosyasında `base` alanını kendi repo adınızla eşleştirin:

```js
base: '/your-repo-name/',
```

Örneğin repo adınız `akademik-asistan` ise:

```js
base: '/akademik-asistan/',
```

### 3. `main` branch'e push yapın

```bash
git add .
git commit -m "deploy"
git push origin main
```

GitHub Actions otomatik olarak `npm run build` çalıştırır ve `dist/` dizinini `gh-pages` branch'ine yayımlar.

### 4. GitHub Pages'i etkinleştirin

Repo sayfanızda **Settings → Pages → Source** bölümüne gidin ve kaynak olarak `gh-pages` branch'ini seçin.

Birkaç dakika içinde uygulamanız `https://kullanici-adi.github.io/your-repo-name/` adresinde yayında olur.

---

## Özellikler

- **Ders Anlatımı** — Yüklenen materyalden detaylı ders anlatımı üretir
- **Çalışma Rehberi** — Önemli kavramları ve özet bilgileri listeler
- **Görsel Özet** — Zaman çizelgesi, karşılaştırma tablosu veya grid formatında görsel özet oluşturur
- **Sınav Modu** — Çoktan seçmeli, doğru/yanlış ve kısa cevaplı sorular üretir
- **AI Sohbet** — Materyal hakkında soru-cevap yapmanızı sağlar
- **Karma Sınav** — Birden fazla oturumdan sorular içeren vize/final sınavı
- **Çalışma Arşivi** — Oturumları otomatik kaydeder, `.akademik` dosyası olarak dışa/içe aktarır
- **PDF Desteği** — PDF ve TXT dosyası yüklemeyi destekler
- **Ses Efektleri** — Etkileşimlerde Web Audio API ile ses geri bildirimi

## Teknoloji Yığını

- [React 18](https://react.dev/) — Kullanıcı arayüzü
- [Vite](https://vitejs.dev/) — Build aracı ve geliştirme sunucusu
- [Tailwind CSS](https://tailwindcss.com/) — Stil
- [Lucide React](https://lucide.dev/) — İkonlar
- [Google Gemini API](https://ai.google.dev/) — Yapay zeka içerik üretimi (`gemini-2.0-flash`)
- [GitHub Actions](https://github.com/features/actions) — Otomatik deploy pipeline
- [GitHub Pages](https://pages.github.com/) — Statik site barındırma
