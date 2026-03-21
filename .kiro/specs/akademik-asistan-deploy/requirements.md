# Gereksinimler Belgesi

## Giriş

Bu belge, mevcut tek dosyalık React uygulaması olan "Akademik Asistan"ın Vite + React projesi olarak yeniden yapılandırılması ve GitHub Pages'e deploy edilmesi için gereksinimleri tanımlar. Uygulama; Google Gemini API (gemini-2.0-flash) kullanarak materyal yükleme, ders anlatımı üretme, çalışma rehberi, görsel özet, sınav modu, AI sohbet, çalışma arşivi ve dışa/içe aktarma özelliklerini Türkçe arayüzle sunar.

## Sözlük

- **Uygulama**: Akademik Asistan React uygulaması
- **Vite_Projesi**: Vite build aracı ile yapılandırılmış React projesi
- **Deploy_Pipeline**: GitHub Actions veya gh-pages paketi ile otomatik dağıtım süreci
- **Gemini_API**: Google Gemini ücretsiz tier API (gemini-2.0-flash modeli)
- **API_Anahtarı**: Kullanıcının Gemini API erişim anahtarı
- **Onboarding_Ekranı**: Uygulamanın ilk açılışında API anahtarı girişi için gösterilen ekran
- **localStorage**: Tarayıcının yerel depolama alanı
- **Oturum**: Bir çalışma materyali ve ona ait üretilmiş içeriklerin bütünü
- **Chunk**: Uzun materyalin 12.000 karakter sınırında bölünmüş parçası
- **akademik_Dosyası**: Oturum verilerini içeren `.akademik` uzantılı JSON yedek dosyası
- **Markdown_Renderer**: Markdown metnini React bileşenlerine dönüştüren işleyici
- **Görsel_Özet**: Zaman çizelgesi, karşılaştırma, tablo veya grid formatında AI üretimi görsel
- **Karma_Sınav**: Birden fazla çalışma oturumundan soru içeren sınav
- **GitHub_Pages**: GitHub'ın statik site barındırma hizmeti

---

## Gereksinimler

### Gereksinim 1: Vite + React Proje Yapısı

**Kullanıcı Hikayesi:** Bir geliştirici olarak, uygulamanın standart bir Vite + React proje yapısına sahip olmasını istiyorum; böylece bağımlılıkları yönetebilir ve projeyi kolayca derleyebilirim.

#### Kabul Kriterleri

1. THE Vite_Projesi SHALL `package.json`, `vite.config.js`, `index.html` ve `src/` dizinini içermelidir.
2. THE Vite_Projesi SHALL `react`, `react-dom`, `lucide-react` ve `tailwindcss` bağımlılıklarını `package.json` içinde tanımlamalıdır.
3. THE Vite_Projesi SHALL `npm run build` komutu ile `dist/` dizinine derlenebilir olmalıdır.
4. THE Vite_Projesi SHALL `npm run dev` komutu ile yerel geliştirme sunucusunu başlatabilmelidir.
5. THE Vite_Projesi SHALL mevcut uygulamanın tüm bileşenlerini (`App.jsx`, yardımcı fonksiyonlar) `src/` dizini altında barındırmalıdır.

---

### Gereksinim 2: GitHub Pages Deploy Pipeline

**Kullanıcı Hikayesi:** Bir geliştirici olarak, `main` branch'e push yaptığımda uygulamanın otomatik olarak GitHub Pages'e deploy edilmesini istiyorum; böylece manuel adım atmadan güncel sürümü yayınlayabilirim.

#### Kabul Kriterleri

1. THE Deploy_Pipeline SHALL `.github/workflows/` dizininde bir GitHub Actions workflow dosyası içermelidir.
2. WHEN `main` branch'e push yapıldığında, THE Deploy_Pipeline SHALL `npm run build` komutunu çalıştırmalıdır.
3. WHEN derleme başarılı olduğunda, THE Deploy_Pipeline SHALL `dist/` dizinini `gh-pages` branch'ine yayımlamalıdır.
4. THE Vite_Projesi SHALL `vite.config.js` içinde GitHub Pages repository adına karşılık gelen `base` URL'yi tanımlamalıdır.
5. IF derleme başarısız olursa, THEN THE Deploy_Pipeline SHALL workflow'u hata ile sonlandırmalı ve sonraki adımları çalıştırmamalıdır.

---

### Gereksinim 3: Gemini API Anahtarı Onboarding Akışı

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, uygulamayı ilk açtığımda API anahtarımı girmek istiyorum; böylece kendi Gemini hesabımla uygulamayı kullanabilirim.

#### Kabul Kriterleri

1. WHEN Uygulama ilk açıldığında ve localStorage'da geçerli bir API anahtarı bulunmadığında, THE Onboarding_Ekranı SHALL kullanıcıya API anahtarı giriş formu göstermelidir.
2. WHEN kullanıcı geçerli bir API anahtarı girip onayladığında, THE Uygulama SHALL anahtarı localStorage'a kaydetmeli ve ana arayüzü göstermelidir.
3. THE Uygulama SHALL localStorage'dan okunan API anahtarını tüm Gemini_API çağrılarında kullanmalıdır.
4. WHEN kullanıcı API anahtarını değiştirmek istediğinde, THE Uygulama SHALL ayarlar arayüzünden anahtarı güncelleyebilmelidir.
5. IF localStorage'daki API anahtarı boş string veya tanımsız ise, THEN THE Uygulama SHALL Onboarding_Ekranı'nı göstermelidir.
6. THE Onboarding_Ekranı SHALL Gemini API anahtarının nereden alınacağına dair bir bağlantı veya yönlendirme içermelidir.

---

### Gereksinim 4: API Anahtarı Kalıcılığı (Round-Trip)

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, sayfayı yeniledikten sonra API anahtarımı tekrar girmek istemiyorum; böylece her seferinde onboarding sürecinden geçmeden uygulamayı kullanabilirim.

#### Kabul Kriterleri

1. WHEN kullanıcı API anahtarını kaydedip sayfayı yenilediğinde, THE Uygulama SHALL aynı API anahtarını localStorage'dan okuyarak Onboarding_Ekranı'nı atlamalıdır.
2. THE Uygulama SHALL API anahtarını `localStorage.setItem` ile kaydetmeli ve `localStorage.getItem` ile okumalıdır.
3. FOR ALL geçerli API anahtarı değerleri, kaydet → yenile → oku işlemi SHALL orijinal değeri döndürmelidir (round-trip özelliği).

---

### Gereksinim 5: Gemini API Entegrasyonu (gemini-2.0-flash)

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, ücretsiz Gemini API'sini kullanarak içerik üretmek istiyorum; böylece ek maliyet olmadan uygulamanın tüm özelliklerinden yararlanabilirim.

#### Kabul Kriterleri

1. THE Uygulama SHALL tüm AI içerik üretimi için `gemini-2.0-flash` modelini kullanmalıdır.
2. THE Gemini_API SHALL `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent` endpoint'ini kullanmalıdır.
3. WHEN bir API çağrısı başarısız olduğunda, THE Gemini_API SHALL en fazla 5 kez yeniden denemelidir.
4. THE Gemini_API SHALL yeniden denemeler arasında üstel geri çekilme (1s, 2s, 4s, 8s, 16s) uygulamalıdır.
5. IF 5 deneme sonunda yanıt alınamazsa, THEN THE Gemini_API SHALL kullanıcıya Türkçe hata mesajı döndürmelidir.
6. FOR ALL retry denemeleri, yeniden deneme sayısı SHALL 5'i geçmemelidir (invariant).

---

### Gereksinim 6: PDF Multimodal Desteği

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, PDF dosyalarımı yükleyerek içeriklerini analiz ettirmek istiyorum; böylece ders notlarımı farklı formatlarda kullanabilirim.

#### Kabul Kriterleri

1. WHEN kullanıcı bir PDF dosyası yüklediğinde, THE Uygulama SHALL dosyayı base64 formatına dönüştürerek Gemini_API'ye multimodal istek olarak göndermelidir.
2. THE Uygulama SHALL yalnızca 5MB veya daha küçük PDF dosyalarını kabul etmelidir.
3. IF yüklenen PDF dosyası 5MB'ı aşıyorsa, THEN THE Uygulama SHALL kullanıcıya Türkçe uyarı mesajı göstermeli ve dosyayı reddetmelidir.
4. WHILE PDF analiz edilirken, THE Uygulama SHALL kullanıcıya yükleme göstergesi (spinner) göstermelidir.
5. THE Uygulama SHALL `.txt` ve `.pdf` formatlarını desteklemeli, diğer formatlar için Türkçe uyarı göstermelidir.

---

### Gereksinim 7: Materyal Chunking

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, uzun ders materyallerimi yükleyebilmek istiyorum; böylece API token sınırlarına takılmadan büyük içerikleri analiz ettirebilirim.

#### Kabul Kriterleri

1. WHEN materyal kaydedildiğinde, THE Uygulama SHALL metni en fazla 12.000 karakterlik Chunk'lara bölmelidir.
2. THE Uygulama SHALL Chunk sınırlarını mümkün olduğunca satır sonlarında (`\n`) belirlemelidir.
3. FOR ALL materyal metinleri, tüm Chunk'ların birleşimi SHALL orijinal metne eşit olmalıdır (round-trip özelliği).
4. FOR ALL Chunk'lar, her Chunk'ın uzunluğu SHALL 12.000 karakteri geçmemelidir (invariant).

---

### Gereksinim 8: Çalışma Arşivi (localStorage Round-Trip)

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, çalışma oturumlarımın otomatik kaydedilmesini ve daha sonra yüklenebilmesini istiyorum; böylece çalışmalarıma kaldığım yerden devam edebilirim.

#### Kabul Kriterleri

1. WHEN bir oturum oluşturulduğunda veya güncellendiğinde, THE Uygulama SHALL oturum verilerini `akademik_asistan_sessions` anahtarı ile localStorage'a JSON formatında kaydetmelidir.
2. WHEN Uygulama başlatıldığında, THE Uygulama SHALL localStorage'dan mevcut oturumları yükleyerek arşiv listesini doldurmalıdır.
3. FOR ALL oturum verileri, kaydet → yenile → yükle işlemi SHALL orijinal oturum verilerini korumalıdır (round-trip özelliği).
4. WHEN kullanıcı bir oturumu sildiğinde, THE Uygulama SHALL oturumu localStorage'dan kaldırmalı ve listeyi güncellemalıdır.
5. THE Uygulama SHALL birden fazla oturumu aynı anda localStorage'da saklayabilmelidir.

---

### Gereksinim 9: .akademik Dosyası Dışa/İçe Aktarma (Round-Trip)

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, çalışma oturumlarımı `.akademik` dosyası olarak dışa aktarabilmek ve başka bir cihazda içe aktarabilmek istiyorum; böylece verilerimi taşıyabilir ve yedekleyebilirim.

#### Kabul Kriterleri

1. WHEN kullanıcı bir oturumu dışa aktardığında, THE Uygulama SHALL oturum verisini JSON formatında `.akademik` uzantılı dosya olarak indirmelidir.
2. WHEN kullanıcı bir `.akademik` dosyasını içe aktardığında, THE Uygulama SHALL dosyayı JSON olarak ayrıştırmalı ve oturumu arşive ekleyerek yüklemelidir.
3. FOR ALL geçerli oturum verileri, dışa aktar → içe aktar işlemi SHALL orijinal `savedMaterial` ve `content` verilerini korumalıdır (round-trip özelliği).
4. IF içe aktarılan dosya geçersiz JSON veya beklenen alanları içermiyorsa, THEN THE Uygulama SHALL kullanıcıya Türkçe hata mesajı göstermelidir.
5. THE Uygulama SHALL içe aktarılan oturuma yeni bir benzersiz `id` atamalıdır.

---

### Gereksinim 10: Markdown Renderer

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, AI tarafından üretilen içeriklerin biçimlendirilmiş şekilde görüntülenmesini istiyorum; böylece ders notlarını ve anlatımları okunabilir formatta görebilirim.

#### Kabul Kriterleri

1. THE Markdown_Renderer SHALL `#`, `##`, `###`, `####`, `#####` başlık seviyelerini doğru HTML etiketlerine dönüştürmelidir.
2. THE Markdown_Renderer SHALL `**metin**` kalın, `*metin*` italik ve `` `kod` `` satır içi kod formatlarını desteklemelidir.
3. THE Markdown_Renderer SHALL `[TÜYO]`, `[DİKKAT]` ve `[ÖNEMLİ]` özel etiketlerini stillendirilmiş bileşenlere dönüştürmelidir.
4. THE Markdown_Renderer SHALL Markdown tablo sözdizimini (`|` ile ayrılmış) HTML tablosuna dönüştürmelidir.
5. THE Markdown_Renderer SHALL sıralı (`1.`) ve sırasız (`-`, `*`) liste sözdizimini desteklemelidir.
6. FOR ALL Markdown metinleri, aynı metin iki kez işlendiğinde SHALL aynı çıktıyı üretmelidir (idempotence özelliği).

---

### Gereksinim 11: Sınav JSON Ayrıştırma (Round-Trip)

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, AI'ın ürettiği sınav sorularının doğru şekilde ayrıştırılmasını istiyorum; böylece sınav modu kesintisiz çalışsın.

#### Kabul Kriterleri

1. THE Uygulama SHALL Gemini_API'den dönen JSON yanıtını `parseJSON` fonksiyonu ile ayrıştırmalıdır.
2. THE Uygulama SHALL JSON yanıtındaki kod bloğu işaretlerini (` ```json `, ` ``` `) temizleyerek ayrıştırmalıdır.
3. FOR ALL geçerli sınav JSON verileri, JSON.stringify → parseJSON işlemi SHALL orijinal objeyi döndürmelidir (round-trip özelliği).
4. IF JSON ayrıştırma başarısız olursa, THEN THE Uygulama SHALL `null` döndürmeli ve kullanıcıya Türkçe hata mesajı göstermelidir.

---

### Gereksinim 12: Sınav Cevap Değerlendirme

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, sınav cevaplarımın Türkçe karakter duyarsız şekilde değerlendirilmesini istiyorum; böylece büyük/küçük harf veya Türkçe karakter farklılıkları yüzünden doğru cevabım yanlış sayılmasın.

#### Kabul Kriterleri

1. THE Uygulama SHALL çoktan seçmeli ve doğru/yanlış sorular için `isAnswerCorrect` fonksiyonu ile cevap karşılaştırması yapmalıdır.
2. THE Uygulama SHALL cevap karşılaştırmasında Türkçe locale (`tr`) duyarsız karşılaştırma kullanmalıdır.
3. FOR ALL cevap çiftleri, `isAnswerCorrect(a, b)` SHALL `isAnswerCorrect(b, a)` ile aynı sonucu döndürmelidir (simetri özelliği).
4. FOR ALL cevap çiftleri, büyük/küçük harf normalize edilmiş versiyonları SHALL aynı doğruluk sonucunu üretmelidir (metamorphic özellik).
5. WHEN kısa cevap veya kompozisyon soruları değerlendirildiğinde, THE Uygulama SHALL Gemini_API'yi kullanarak AI destekli değerlendirme yapmalıdır.

---

### Gereksinim 13: Mevcut Özelliklerin Korunması

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, mevcut uygulamadaki tüm özelliklerin Vite projesinde de çalışmasını istiyorum; böylece geçiş sürecinde hiçbir işlevsellik kaybı yaşanmasın.

#### Kabul Kriterleri

1. THE Uygulama SHALL ders anlatımı üretme, çalışma rehberi, görsel özet ve sınav modu özelliklerini korumalıdır.
2. THE Uygulama SHALL AI sohbet, ses efektleri ve tam ekran modu özelliklerini korumalıdır.
3. THE Uygulama SHALL karma sınav (vize/final) ve sınav geçmişi özelliklerini korumalıdır.
4. THE Uygulama SHALL PDF yazdırma ve içerik dışa aktarma özelliklerini korumalıdır.
5. THE Uygulama SHALL Türkçe arayüzü ve tüm Türkçe içerik üretimini korumalıdır.
6. THE Uygulama SHALL Tailwind CSS ile mevcut görsel tasarımı korumalıdır.

---

### Gereksinim 14: Ses Efektleri

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, ses efektlerini açıp kapatabilmek istiyorum; böylece sessiz ortamlarda çalışırken rahatsız edici sesler duymayayım.

#### Kabul Kriterleri

1. THE Uygulama SHALL `select`, `success`, `error` ve `finish` ses efektlerini Web Audio API ile üretmelidir.
2. WHEN ses efektleri devre dışı bırakıldığında, THE Uygulama SHALL hiçbir ses üretmemelidir.
3. WHILE ses efektleri etkin iken, THE Uygulama SHALL kullanıcı etkileşimlerinde (seçim, doğru cevap, yanlış cevap, tamamlama) ilgili sesi çalmalıdır.
4. IF Web Audio API tarayıcı tarafından desteklenmiyorsa, THEN THE Uygulama SHALL sessizce devam etmeli ve hata göstermemelidir.

---

### Gereksinim 15: Tam Ekran Modu

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, uygulamayı tam ekran modunda kullanabilmek istiyorum; böylece dikkat dağıtıcı unsurlardan uzak odaklanmış bir çalışma ortamı oluşturabilirim.

#### Kabul Kriterleri

1. WHEN kullanıcı tam ekran butonuna tıkladığında, THE Uygulama SHALL tarayıcının Fullscreen API'sini kullanarak tam ekrana geçmelidir.
2. WHEN tam ekrandan çıkıldığında, THE Uygulama SHALL normal görünüme dönmelidir.
3. IF tarayıcı Fullscreen API'sini desteklemiyorsa, THEN THE Uygulama SHALL CSS tabanlı tam ekran fallback kullanmalıdır.
4. THE Uygulama SHALL tam ekran durumunu `isFullscreen` state değişkeni ile takip etmelidir.
