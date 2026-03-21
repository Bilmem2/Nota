import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  FileText,
  GraduationCap,
  MessageSquare,
  UploadCloud,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  Lightbulb,
  Check,
  X as XIcon,
  RotateCw,
  ChevronRight,
  ClipboardList,
  Target,
  Settings2,
  Printer,
  Volume2,
  VolumeX,
  Workflow,
  Globe,
  Layers,
  PieChart,
  Maximize,
  Minimize,
  Library,
  PlusCircle,
  Download,
  Upload,
  Trash2,
  FolderOpen,
  Key,
} from 'lucide-react';

import { callGemini } from './utils/gemini';
import { chunkText } from './utils/chunking';
import { parseJSON, isAnswerCorrect } from './utils/quiz';
import { renderMarkdown } from './utils/markdown';
import { playSound } from './utils/sound';
import { handlePrint } from './utils/print';
import OnboardingScreen from './components/OnboardingScreen';
import VisualSummaryComponent from './components/VisualSummaryComponent';

// --- I18N ---
const T = {
  tr: {
    appName: 'Yapay Öğretmen',
    myStudies: 'Çalışmalarım', addMaterial: 'Materyal Ekle', lesson: 'Ders Anlatımı',
    notes: 'Çalışma Rehberi', visual: 'Görsel Özet', quiz: 'Sınav Modu', chat: 'Soru Sor',
    settings: 'Ayarlar', darkMode: 'Karanlık Tema', language: 'Dil', fullscreen: 'Tam Ekran',
    normalScreen: 'Normal Ekran', newStudy: 'Yeni Çalışma', importFile: 'İçeri Aktar',
    saveMaterial: 'Materyali Kaydet ve Analiz Et', generating: 'Oluşturuluyor...',
    generate: 'Oluştur', podcast: 'Podcast', podcastPlay: 'Dinle', podcastStop: 'Durdur',
    podcastGenerating: 'Podcast hazırlanıyor...', podcastReady: 'Podcast hazır, dinlemek için ▶ bas.',
    chatPlaceholder: 'Konuyla ilgili kafanıza takılanı sorun...',
    chatWelcome: 'Ben senin yapay öğretmeninim. Yüklediğin materyalle ilgili aklına takılan her soruyu bana sorabilirsin.',
    chatMaterialLoaded: 'Yeni materyal başarıyla sisteme aktarıldı. Hazırsan çalışmaya başlayalım.',
    chatNewSession: 'Yeni çalışmaya hoş geldin! Sol menüden materyal yükleyerek başlayabilirsin.',
    chatSend: 'Gönder',
    chatDisclaimer: 'Bu yanıtlar yapay zeka tarafından üretilmektedir, daima ana kaynağınızı teyit edin.',
    mockSubmit: 'Gönder ve Değerlendir',
    aiEvaluating: 'AI Değerlendiriyor...',
    pdfLoading: "Yapay Öğretmen PDF'i inceliyor, lütfen bekleyin...",
    author: '© Can Sevilmiş', version: 'Yapay Öğretmen v1.0',
    // Archive
    archiveTitle: 'Çalışma Arşivi', importBtn: 'İçeri Aktar', newStudyBtn: 'Yeni Çalışma',
    archiveEmpty: 'Henüz Kayıtlı Bir Çalışmanız Yok',
    archiveEmptyDesc: 'Sisteme yüklediğiniz her PDF veya ders notu, otomatik olarak buraya kaydedilecektir. Böylece sekmeyi kapatsanız bile kaldığınız yerden devam edebilirsiniz.',
    archiveStart: 'İlk Çalışmanı Başlat', activeLabel: 'Aktif', openLabel: 'Aç',
    // Material
    materialTitle: 'Ders Materyali Yükle', materialDesc: 'Öğrenmek istediğiniz metni yapıştırın veya PDF yükleyin.',
    filePickBtn: '.txt / .pdf Seç', studyTitleLabel: 'Çalışma Başlığı (Opsiyonel)',
    studyTitlePlaceholder: 'Örn: Hafta 3 - Enzim Kinetiği',
    materialTextPlaceholder: 'Üzerinde çalışacağımız ders notunu buraya yapıştır...',
    charReady: (n) => `${n} karakter hazır.`, charMin: 'Çalışmaya başlamak için en az 50 karakter girilmeli.',
    saveAndStart: 'Kaydet ve Derse Başla',
    // Lesson
    lessonTitle: 'Ders Anlatımı', lessonReadyTitle: 'Akademik Okuma Hazır',
    lessonReadyDesc: 'Materyaliniz incelendi. Üniversite düzeyinde, kavramsal bağlantıları kuran detaylı bir okuma yapalım mı?',
    synthesizeAll: 'Tüm Bölümleri Sentezle', downloadPdf: 'Tümünü PDF İndir',
    chapterNav: 'Bölümler:', chapterLabel: (n) => `Bölüm ${n}`,
    chapterSynthesizing: (cur, total) => `Bölüm ${cur} / ${total} sentezleniyor...`,
    chapterSynthesizingNote: 'Önceki bölümleri okumaya başlayabilirsiniz, yenisi hazırlandığında buraya eklenecektir.',
    askQuestion: 'Konuyu Tartışmak İçin Soru Sor',
    // Notes
    notesTitle: 'Sınav Çalışma Rehberi', notesReadyTitle: 'Sınav İçin Cheat Sheet Hazırlansın mı?',
    notesReadyDesc: 'Yapay zeka bu metni analiz ederek senin için kritik kavramları, süreçleri, en çok düşülen tuzakları ve muhtemel sınav sorularını içeren yapılandırılmış bir rehber çıkaracak.',
    noteSummarizing: (cur, total) => `Bölüm ${cur} / ${total} özetleniyor...`,
    noteSummarizingNote: 'Rehber hazırlanırken ekranda okunabilir şekilde belirecektir.',
    // Visual
    visualTitle: 'Görsel Özet', visualReadyTitle: 'Metni Görselleştir',
    visualReadyDesc: 'Yapay zeka metni analiz ederek senin için konunun yapısına en uygun Zaman Çizelgesi, Karşılaştırma, Veri Tablosu veya Kategori Kartlarını otomatik çizecek.',
    visualizeAll: 'Tüm Bölümleri Görselleştir',
    visualProcessing: (cur, total) => `Bölüm ${cur} / ${total} işleniyor...`,
    visualProcessingNote: 'Şablon seçiliyor, veriler hizalanıyor.',
    // Quiz
    quizPageTitle: 'İnteraktif Sınav', prevResults: 'Önceki Sınav Performansları',
    attempt: (n) => `Deneme ${n}`, score: (s) => `%${s} Başarı`,
    // Podcast
    podcastTitle: 'Podcast Modu', podcastDesc: 'Materyalinizi dinleyerek öğrenin.',
    podcastGenerateBtn: 'Podcast Oluştur',
    // Session card
    importedSuffix: ' (İçe Aktarıldı)',
    fileTypeAlert: 'Lütfen .txt veya .pdf formatında bir dosya yükleyin.',
    deleteConfirm: 'Bu çalışmayı tamamen silmek istediğine emin misin?',
    // Quiz settings
    quizSettingsTitle: 'Sınav Ayarlarını Belirle',
    quizSettingsDesc: 'Kendini ne kadar zorlamak istediğini ve soru tipini seç.',
    quizScope: 'Sınav Kapsamı (Müfredat)',
    quizScopeCurrent: 'Sadece Bu Çalışma', quizScopeCurrentDesc: 'Sadece açık olan nottan soru gelir.',
    quizScopeMixed: 'Karma Sınav (Vize/Final)', quizScopeMixedDesc: 'Arşivdeki farklı haftaları birleştir.',
    quizSelectTopics: 'Sınava Dahil Edilecek Çalışmaları (Haftaları) Seçin:',
    quizFormat: 'Sınav Formatı',
    quizInteractive: 'İnteraktif Mod', quizInteractiveDesc: 'Soruları tek tek çözüp anında öğren.',
    quizMock: 'Gerçek Deneme Sınavı', quizMockDesc: 'Tüm soruları gör, sonunda toplu değerlendiril.',
    quizCount: 'Soru Sayısı', quizDifficulty: 'Zorluk',
    difficulties: ['Kolay', 'Orta', 'Zor'],
    quizOnlyMC: 'Sadece Test Modu', quizOnlyMCDesc: 'Tüm sorular çoktan seçmeli olur.',
    quizOnlyEssay: 'Sadece Kompozisyon (Essay) Modu', quizOnlyEssayDesc: 'Sınav sadece uzun açık uçlu analiz sorularından oluşur.',
    soundEffects: 'Ses Efektleri', soundEffectsDesc: 'Geri bildirim seslerini açar veya kapatır.',
    startQuiz: 'Sınavı Başlat', selectTopicsFirst: 'Lütfen Kapsam İçin Konu Seçin',
    quizGenerating: (count) => `${count} Türkçe soru hazırlanıyor...`,
    questionLabel: (cur, total) => `Soru ${cur} / ${total}`,
    completed: 'Tamamlandı', cancel: 'İptal',
    studiedOn: (date) => `${date} tarihinde çalışıldı`,
    // Quiz result / interactive strings
    quizCorrect: 'Tebrikler, Doğru Cevap!', quizWrong: 'Maalesef Yanlış Cevap.',
    quizExamDone: 'Sınav Tamamlandı!', quizPerfSummary: 'Performans özetin aşağıda yer alıyor.',
    quizCorrectLabel: 'Doğru', quizWrongLabel: 'Yanlış', quizEmptyLabel: 'Boş',
    quizDetailTitle: 'Detaylı Soru Analizi',
    quizYourAnswer: 'Cevabınız', quizExpected: 'Beklenen Cevap',
    quizAiEval: 'AI Değerlendirmesi:', quizAcademic: 'Akademik Açıklama:',
    quizAiFeedback: 'AI Geri Bildirimi:',
    quizNewExam: 'Yeni Sınav Oluştur', quizBackSettings: 'Ayarlara Dön', quizDelete: 'Sınavı Sil',
    quizDeleteConfirm: 'Bu sınavı geçmişten silmek istediğine emin misin?',
    quizWeakBtn: 'Zayıf Yönlerimi Analiz Et', quizAnalyzing: 'Analiz yapılıyor...',
    quizPerfAnalysis: 'Performans Analizi', quizClose: 'Kapat',
    quizNextQ: 'Sonraki Soru', quizFinish: 'Sınavı Bitir',
    quizCheckAnswer: 'Cevabı Kontrol Et', quizChecking: 'AI Kontrol Ediyor...',
    quizHint: (n) => `İpucu İste (${n}/2)`, quizHint1: '1. İpucu:', quizHint2: '2. İpucu:',
    quizEssayPlaceholder: 'Kompozisyon/Analiz cevabınızı yazın...',
    quizAnswerPlaceholder: 'Cevabınızı yazın...',
    quizEssayPlaceholderMock: 'Kompozisyonunuzu buraya yazın...',
    quizMockDesc2: 'Gerçek Deneme Modu: Tüm soruları aşağıdan cevapla. Sınavı bitirdiğinde kompozisyon ve açık uçlu cevapların yapay zeka tarafından değerlendirilecek.',
    quizCancelConfirm: 'Sınavı iptal etmek istediğine emin misin? İlerleme kaydedilmeyecek.',
    quizCancelConfirmMock: 'Sınavı iptal etmek istediğine emin misin?',
    // Chat
    chatTitle: 'Akademik Sohbet', chatTyping: 'Asistanınız yanıtlıyor...',
    // Podcast
    podcastTurnInto: "Materyalini podcast'a dönüştür",
    podcastSubDesc: 'Yapay zeka materyalini doğal bir anlatıma çevirir, sonra sesli okur.',
    podcastRegen: 'Yeniden Oluştur',
    // Lesson/Notes/Visual inline strings
    lessonBolum: (n) => `Bölüm ${n}`,
    lessonSynthBtn: 'Tüm Bölümleri Sentezle',
    notesCheatBtn: 'Tüm Bölümleri Sentezle',
    visualVisBtn: 'Tüm Bölümleri Görselleştir',
    // Material overlay
    pdfAnalyzing: 'PDF Analiz Ediliyor...', pdfExtracting: 'Metinler çıkarılıyor ve işleniyor',
  },
  en: {
    appName: 'AI Teacher',
    myStudies: 'My Studies', addMaterial: 'Add Material', lesson: 'Lesson',
    notes: 'Study Guide', visual: 'Visual Summary', quiz: 'Quiz Mode', chat: 'Ask a Question',
    settings: 'Settings', darkMode: 'Dark Mode', language: 'Language', fullscreen: 'Fullscreen',
    normalScreen: 'Exit Fullscreen', newStudy: 'New Study', importFile: 'Import',
    saveMaterial: 'Save & Analyze Material', generating: 'Generating...',
    generate: 'Generate', podcast: 'Podcast', podcastPlay: 'Listen', podcastStop: 'Stop',
    podcastGenerating: 'Preparing podcast...', podcastReady: 'Podcast ready — press ▶ to listen.',
    chatPlaceholder: 'Ask anything about the material...',
    chatWelcome: 'I am your AI teacher. Feel free to ask me anything about the material you uploaded.',
    chatMaterialLoaded: 'New material loaded successfully. Ready to start whenever you are.',
    chatNewSession: 'Welcome to your new study session! Upload material from the left menu to get started.',
    chatSend: 'Send',
    chatDisclaimer: 'These responses are AI-generated. Always verify with your primary source.',
    mockSubmit: 'Submit & Evaluate',
    aiEvaluating: 'AI Evaluating...',
    pdfLoading: "AI Teacher is reading the PDF, please wait...",
    author: '© Can Sevilmiş', version: 'AI Teacher v1.0',
    // Archive
    archiveTitle: 'Study Archive', importBtn: 'Import', newStudyBtn: 'New Study',
    archiveEmpty: 'No Saved Studies Yet',
    archiveEmptyDesc: 'Every PDF or lecture note you upload will be automatically saved here, so you can pick up right where you left off even after closing the tab.',
    archiveStart: 'Start Your First Study', activeLabel: 'Active', openLabel: 'Open',
    // Material
    materialTitle: 'Upload Study Material', materialDesc: 'Paste the text you want to learn or upload a PDF.',
    filePickBtn: '.txt / .pdf Select', studyTitleLabel: 'Study Title (Optional)',
    studyTitlePlaceholder: 'e.g. Week 3 - Enzyme Kinetics',
    materialTextPlaceholder: 'Paste the lecture notes we will work on here...',
    charReady: (n) => `${n} characters ready.`, charMin: 'At least 50 characters required to start.',
    saveAndStart: 'Save & Start Lesson',
    // Lesson
    lessonTitle: 'Lesson', lessonReadyTitle: 'Academic Reading Ready',
    lessonReadyDesc: 'Your material has been reviewed. Shall we do a detailed university-level reading that builds conceptual connections?',
    synthesizeAll: 'Synthesize All Sections', downloadPdf: 'Download All as PDF',
    chapterNav: 'Sections:', chapterLabel: (n) => `Section ${n}`,
    chapterSynthesizing: (cur, total) => `Synthesizing section ${cur} / ${total}...`,
    chapterSynthesizingNote: 'You can start reading previous sections; new ones will appear here when ready.',
    askQuestion: 'Ask a Question to Discuss the Topic',
    // Notes
    notesTitle: 'Exam Study Guide', notesReadyTitle: 'Generate a Cheat Sheet for the Exam?',
    notesReadyDesc: 'The AI will analyze this text and produce a structured guide with critical concepts, processes, common traps, and likely exam questions.',
    noteSummarizing: (cur, total) => `Summarizing section ${cur} / ${total}...`,
    noteSummarizingNote: 'The guide will appear on screen as it is being prepared.',
    // Visual
    visualTitle: 'Visual Summary', visualReadyTitle: 'Visualize the Text',
    visualReadyDesc: 'The AI will analyze the text and automatically draw the most suitable Timeline, Comparison, Data Table, or Category Cards for the topic.',
    visualizeAll: 'Visualize All Sections',
    visualProcessing: (cur, total) => `Processing section ${cur} / ${total}...`,
    visualProcessingNote: 'Selecting template, aligning data.',
    // Quiz
    quizPageTitle: 'Interactive Quiz', prevResults: 'Previous Quiz Results',
    attempt: (n) => `Attempt ${n}`, score: (s) => `${s}% Score`,
    // Podcast
    podcastTitle: 'Podcast Mode', podcastDesc: 'Learn by listening to your material.',
    podcastGenerateBtn: 'Generate Podcast',
    // Session card
    importedSuffix: ' (Imported)',
    fileTypeAlert: 'Please upload a .txt or .pdf file.',
    deleteConfirm: 'Are you sure you want to permanently delete this study?',
    // Quiz settings
    quizSettingsTitle: 'Configure Your Quiz',
    quizSettingsDesc: 'Choose how challenging you want it and the question format.',
    quizScope: 'Quiz Scope (Curriculum)',
    quizScopeCurrent: 'This Study Only', quizScopeCurrentDesc: 'Questions come only from the current material.',
    quizScopeMixed: 'Mixed Quiz (Midterm/Final)', quizScopeMixedDesc: 'Combine different weeks from your archive.',
    quizSelectTopics: 'Select Studies (Weeks) to Include:',
    quizFormat: 'Quiz Format',
    quizInteractive: 'Interactive Mode', quizInteractiveDesc: 'Solve questions one by one and learn instantly.',
    quizMock: 'Mock Exam', quizMockDesc: 'See all questions, get evaluated at the end.',
    quizCount: 'Question Count', quizDifficulty: 'Difficulty',
    difficulties: ['Easy', 'Medium', 'Hard'],
    quizOnlyMC: 'Multiple Choice Only', quizOnlyMCDesc: 'All questions will be multiple choice.',
    quizOnlyEssay: 'Essay Mode Only', quizOnlyEssayDesc: 'Quiz consists only of long-form analysis questions.',
    soundEffects: 'Sound Effects', soundEffectsDesc: 'Toggle feedback sounds on or off.',
    startQuiz: 'Start Quiz', selectTopicsFirst: 'Please Select Topics for Scope',
    quizGenerating: (count) => `Preparing ${count} English questions...`,
    questionLabel: (cur, total) => `Question ${cur} / ${total}`,
    completed: 'Completed', cancel: 'Cancel',
    studiedOn: (date) => `Studied on ${date}`,
    // Quiz result / interactive strings
    quizCorrect: 'Correct!', quizWrong: 'Incorrect.',
    quizExamDone: 'Exam Completed!', quizPerfSummary: 'Your performance summary is below.',
    quizCorrectLabel: 'Correct', quizWrongLabel: 'Wrong', quizEmptyLabel: 'Blank',
    quizDetailTitle: 'Detailed Question Analysis',
    quizYourAnswer: 'Your Answer', quizExpected: 'Expected Answer',
    quizAiEval: 'AI Evaluation:', quizAcademic: 'Academic Explanation:',
    quizAiFeedback: 'AI Feedback:',
    quizNewExam: 'Generate New Quiz', quizBackSettings: 'Back to Settings', quizDelete: 'Delete Quiz',
    quizDeleteConfirm: 'Are you sure you want to delete this quiz from history?',
    quizWeakBtn: 'Analyze My Weak Points', quizAnalyzing: 'Analyzing...',
    quizPerfAnalysis: 'Performance Analysis', quizClose: 'Close',
    quizNextQ: 'Next Question', quizFinish: 'Finish Quiz',
    quizCheckAnswer: 'Check Answer', quizChecking: 'AI Checking...',
    quizHint: (n) => `Hint (${n}/2)`, quizHint1: 'Hint 1:', quizHint2: 'Hint 2:',
    quizEssayPlaceholder: 'Write your essay/detailed analysis here...',
    quizAnswerPlaceholder: 'Type your answer here...',
    quizEssayPlaceholderMock: 'Write your detailed essay here...',
    quizMockDesc2: 'Mock Exam Mode: Answer all questions below. Your answers will be submitted for holistic AI evaluation at the very end.',
    quizCancelConfirm: 'Cancel the quiz? Progress will not be saved.',
    quizCancelConfirmMock: 'Are you sure you want to cancel the quiz?',
    // Chat
    chatTitle: 'Academic Chat', chatTyping: 'Your assistant is responding...',
    // Podcast
    podcastTurnInto: 'Turn your material into a podcast',
    podcastSubDesc: 'AI will rewrite your material as a natural spoken script, then read it aloud.',
    podcastRegen: 'Regenerate',
    // Lesson/Notes/Visual inline strings
    lessonBolum: (n) => `Section ${n}`,
    lessonSynthBtn: 'Synthesize All Sections',
    notesCheatBtn: 'Synthesize All Sections',
    visualVisBtn: 'Visualize All Sections',
    // Material overlay
    pdfAnalyzing: 'Analyzing PDF...', pdfExtracting: 'Extracting and processing text',
  },
};

// --- ANA UYGULAMA BİLEŞENİ ---
export default function App() {
  // API Key state - loaded from localStorage
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [provider, setProvider] = useState(() => localStorage.getItem('ai_provider') || 'gemini');
  const [showSettings, setShowSettings] = useState(false);
  const [settingsApiKey, setSettingsApiKey] = useState('');
  const [weakAnalysis, setWeakAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('dark_mode') === 'true');
  const [appLang, setAppLang] = useState(() => localStorage.getItem('app_lang') || 'tr');
  const [podcastText, setPodcastText] = useState('');
  const [podcastPlaying, setPodcastPlaying] = useState(false);
  const podcastUtteranceRef = useRef(null);

  const t = T[appLang];

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('archive');
  const [materialText, setMaterialText] = useState('');

  const [sessionsList, setSessionsList] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [studyTitle, setStudyTitle] = useState('');

  const [savedMaterial, setSavedMaterial] = useState('');
  const [materialChunks, setMaterialChunks] = useState([]);

  const [activeChunk, setActiveChunk] = useState({ lesson: 0, notes: 0, visual: 0 });
  const [generatingIndex, setGeneratingIndex] = useState({ lesson: -1, notes: -1, visual: -1 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  const [content, setContent] = useState({
    lesson: {},
    notes: {},
    visual: {},
    quiz: null,
    quizHistory: [],
  });

  const [loading, setLoading] = useState({
    lesson: false,
    notes: false,
    visual: false,
    quiz: false,
    chat: false,
    podcast: false,
  });

  const [quizConfig, setQuizConfig] = useState({
    count: 10,
    difficulty: 'Orta',
    examMode: 'interactive',
    onlyMultipleChoice: false,
    onlyEssay: false,
    quizScope: 'current',
    selectedSessions: [],
  });

  const [soundEnabled, setSoundEnabled] = useState(true);

  const [quizState, setQuizState] = useState({
    activeMode: 'interactive',
    currentIndex: 0,
    answers: {},
    verdicts: {},
    isChecked: false,
    isEvaluating: false,
    hintLevel: 0,
    finished: false,
  });

  const [chatMessages, setChatMessages] = useState([
    { role: 'model', text: T[localStorage.getItem('app_lang') || 'tr'].chatWelcome },
  ]);
  const [currentMessage, setCurrentMessage] = useState('');

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const importFileRef = useRef(null);

  // --- HAFIZA (LOCAL STORAGE) YÖNETİMİ ---
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('dark_mode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('app_lang', appLang);
    // Sadece welcome mesajı varsa dil değişince güncelle
    setChatMessages((prev) => {
      if (prev.length === 1 && prev[0].role === 'model') {
        return [{ role: 'model', text: T[appLang].chatWelcome }];
      }
      return prev;
    });
  }, [appLang]);

  useEffect(() => {
    try {
      const localData = localStorage.getItem('akademik_asistan_sessions');
      if (localData) {
        const parsed = JSON.parse(localData);
        setSessionsList(parsed);
      }
    } catch (e) {
      console.error('Hafıza yüklenemedi', e);
    }
  }, []);

  useEffect(() => {
    if (!activeSessionId || !savedMaterial) return;

    const currentSessionData = {
      id: activeSessionId,
      title: studyTitle || 'İsimsiz Çalışma',
      lastModified: new Date().toISOString(),
      savedMaterial,
      materialChunks,
      content,
      chatMessages,
    };

    setSessionsList((prev) => {
      const existingIdx = prev.findIndex((s) => s.id === activeSessionId);
      let newList = [...prev];
      if (existingIdx >= 0) {
        newList[existingIdx] = currentSessionData;
      } else {
        newList = [currentSessionData, ...prev];
      }
      localStorage.setItem('akademik_asistan_sessions', JSON.stringify(newList));
      return newList;
    });
  }, [savedMaterial, content, chatMessages, studyTitle, activeSessionId, materialChunks]);

  const createNewSession = () => {
    setActiveSessionId(Date.now().toString());
    setStudyTitle('');
    setMaterialText('');
    setSavedMaterial('');
    setMaterialChunks([]);
    setContent({ lesson: {}, notes: {}, visual: {}, quiz: null, quizHistory: [] });
    setChatMessages([{ role: 'model', text: t.chatNewSession }]);
    setQuizState({ activeMode: 'interactive', currentIndex: 0, answers: {}, verdicts: {}, isChecked: false, isEvaluating: false, hintLevel: 0, finished: false });
    setQuizConfig((p) => ({ ...p, quizScope: 'current', selectedSessions: [] }));
    setActiveTab('material');
    setIsMobileMenuOpen(false);
  };

  const loadSession = (session) => {
    setActiveSessionId(session.id);
    setStudyTitle(session.title);
    setSavedMaterial(session.savedMaterial);
    setMaterialText(session.savedMaterial);
    setMaterialChunks(session.materialChunks || []);
    setContent(session.content || { lesson: {}, notes: {}, visual: {}, quiz: null, quizHistory: [] });
    setChatMessages(session.chatMessages || []);
    setQuizState({ activeMode: 'interactive', currentIndex: 0, answers: {}, verdicts: {}, isChecked: false, isEvaluating: false, hintLevel: 0, finished: false });
    setQuizConfig((p) => ({ ...p, quizScope: 'current', selectedSessions: [] }));
    setActiveTab('lesson');
    setIsMobileMenuOpen(false);
  };

  const deleteSession = (id, e) => {
    e.stopPropagation();
    if (window.confirm(t.deleteConfirm)) {
      setSessionsList((prev) => {
        const newList = prev.filter((s) => s.id !== id);
        localStorage.setItem('akademik_asistan_sessions', JSON.stringify(newList));
        return newList;
      });
      if (activeSessionId === id) {
        createNewSession();
        setActiveTab('archive');
      }
    }
  };

  const exportSession = (session, e) => {
    e.stopPropagation();
    const exportData = JSON.stringify(session, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${session.title.replace(/\s+/g, '_')}_Yedek.akademik`;
    link.click();
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedSession = JSON.parse(event.target.result);
        if (!importedSession.id || !importedSession.savedMaterial) {
          throw new Error('Geçersiz format');
        }
        importedSession.id = Date.now().toString();
        importedSession.title = importedSession.title + t.importedSuffix;

        setSessionsList((prev) => {
          const newList = [importedSession, ...prev];
          localStorage.setItem('akademik_asistan_sessions', JSON.stringify(newList));
          return newList;
        });
        loadSession(importedSession);
      } catch (err) {
        alert('Dosya okunamadı. Lütfen geçerli bir .akademik yedek dosyası seçin.');
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const handleCheckAnswer = async () => {
    const currentQ = content.quiz[quizState.currentIndex];
    const uAns = quizState.answers[quizState.currentIndex];
    const langPrompt = appLang === 'en' ? 'Please evaluate in English.' : 'Lütfen Türkçe değerlendir.';

    if (!uAns || uAns.toString().trim() === '') return;

    if (currentQ.tip === 'short_answer' || currentQ.tip === 'fill_blank' || currentQ.tip === 'essay') {
      setQuizState((p) => ({ ...p, isEvaluating: true }));
      try {
        const prompt = `Bir öğrencinin akademik sınav cevabını değerlendir. ${langPrompt}
Soru Tipi: ${currentQ.tip}
Soru: "${currentQ.soru}"
Beklenen Doğru Cevap / Anahtar Noktalar: "${currentQ.dogruCevap}"
Öğrencinin Verdiği Cevap: "${uAns}"

Öğrenci beklenen cevabın ana fikrini yakalamışsa isCorrect: true yap. Kısmen doğruysa tolerans gösterip doğru sayabilirsin ancak eksiklerini feedback kısmında kibarca belirt. Essay (kompozisyon) ise argümanların sağlamlığına ve beklenen anahtar noktalara değinip değinmediğine bak. Tamamen alakasızsa isCorrect: false yap. 
Çıktın SADECE geçerli bir JSON olmalıdır.
{ "isCorrect": true/false, "feedback": "Öğrenciye özel değerlendirme cümlen" }`;
        const result = await callGemini(prompt, 'Sen adil bir akademik değerlendiricisin. SADECE JSON formatında yanıt ver.', apiKey, null, true, provider);
        const parsed = parseJSON(result);

        const isCorr = parsed?.isCorrect ?? false;
        const feedback = parsed?.feedback ?? 'Değerlendirme yapılamadı.';

        setQuizState((p) => ({
          ...p,
          isEvaluating: false,
          isChecked: true,
          verdicts: { ...p.verdicts, [p.currentIndex]: { isCorrect: isCorr, feedback } },
        }));
        playSound(isCorr ? 'success' : 'error', soundEnabled);
      } catch (err) {
        const fallbackCorr = isAnswerCorrect(uAns, currentQ.dogruCevap);
        setQuizState((p) => ({
          ...p,
          isEvaluating: false,
          isChecked: true,
          verdicts: { ...p.verdicts, [p.currentIndex]: { isCorrect: fallbackCorr, feedback: 'Otomatik kontrol yapıldı.' } },
        }));
        playSound(fallbackCorr ? 'success' : 'error', soundEnabled);
      }
    } else {
      const isCorr = isAnswerCorrect(uAns, currentQ.dogruCevap);
      setQuizState((p) => ({
        ...p,
        isChecked: true,
        verdicts: { ...p.verdicts, [p.currentIndex]: { isCorrect: isCorr, feedback: null } },
      }));
      playSound(isCorr ? 'success' : 'error', soundEnabled);
    }
  };

  const handleMockExamSubmit = async () => {
    setQuizState((p) => ({ ...p, isEvaluating: true }));
    const newVerdicts = {};
    const questionsToEvaluate = [];
    const langPrompt = appLang === 'en' ? 'Provide feedback in English.' : 'Geri bildirimi Türkçe ver.';

    content.quiz.forEach((q, i) => {
      const uAns = quizState.answers[i];
      const isEmpty = !uAns || uAns.toString().trim() === '';

      if (isEmpty) {
        newVerdicts[i] = { isCorrect: false, feedback: appLang === 'en' ? 'Left blank.' : 'Boş bırakıldı.' };
      } else if (q.tip === 'multiple_choice' || q.tip === 'true_false') {
        const isCorr = isAnswerCorrect(uAns, q.dogruCevap);
        newVerdicts[i] = { isCorrect: isCorr, feedback: null };
      } else {
        questionsToEvaluate.push({ index: i, question: q, answer: uAns });
      }
    });

    if (questionsToEvaluate.length > 0) {
      const prompt = `Aşağıdaki öğrenci cevaplarını topluca değerlendir. Öğrenci ana fikri yakalamışsa true say. Kısa ve net bir feedback ver. Kompozisyonlar (essay) için anahtar argümanları kontrol et. ${langPrompt}
SADECE JSON DIZISI DÖN: [{"index": 0, "isCorrect": true, "feedback": "..."}]
Cevaplar:
${questionsToEvaluate.map((item) => `Index: ${item.index} | Tip: ${item.question.tip} | Soru: ${item.question.soru} | Beklenen: ${item.question.dogruCevap} | Verilen: ${item.answer}`).join('\n')}`;

      try {
        const result = await callGemini(prompt, 'Sen adil bir değerlendiricisin. SADECE JSON dizisi dön.', apiKey, null, true, provider);
        const parsed = parseJSON(result);
        if (Array.isArray(parsed)) {
          parsed.forEach((res) => {
            if (res.index !== undefined) {
              newVerdicts[res.index] = { isCorrect: res.isCorrect, feedback: res.feedback };
            }
          });
        }
      } catch (err) {
        console.error('Bulk AI evaluation failed', err);
      }
    }

    content.quiz.forEach((q, i) => {
      if (!newVerdicts[i]) {
        newVerdicts[i] = { isCorrect: isAnswerCorrect(quizState.answers[i], q.dogruCevap), feedback: 'Auto-checked.' };
      }
    });

    setQuizState((p) => {
      const newState = { ...p, isEvaluating: false, isChecked: true, finished: true, verdicts: newVerdicts };
      setContent((prev) => ({
        ...prev,
        quizHistory: [...(prev.quizHistory || []), { quiz: content.quiz, state: newState, config: quizConfig, date: new Date().toISOString() }],
      }));
      return newState;
    });

    const correctCount = Object.values(newVerdicts).filter((v) => v.isCorrect).length;
    const score = Math.round((correctCount / content.quiz.length) * 100);
    playSound(score >= 50 ? 'finish' : 'error', soundEnabled);
  };

  // --- Sınav Modu Hızlı Klavye (Enter) Kısayolları ---
  const handleCheckAnswerRef = useRef();
  const quizStateRef = useRef(quizState);
  const activeTabRef = useRef(activeTab);
  const contentRef = useRef(content);
  const quizConfigRef = useRef(quizConfig);
  const soundEnabledRef = useRef(soundEnabled);

  useEffect(() => {
    handleCheckAnswerRef.current = handleCheckAnswer;
    quizStateRef.current = quizState;
    activeTabRef.current = activeTab;
    contentRef.current = content;
    quizConfigRef.current = quizConfig;
    soundEnabledRef.current = soundEnabled;
  }, [handleCheckAnswer, quizState, activeTab, content, quizConfig, soundEnabled]);

  useEffect(() => {
    const handleGlobalEnter = (e) => {
      const state = quizStateRef.current;
      const currentContent = contentRef.current;

      if (activeTabRef.current === 'quiz' && state.activeMode === 'interactive' && !state.finished && !state.isEvaluating) {
        if (e.key === 'Enter' && !e.shiftKey) {
          const activeTag = document.activeElement?.tagName;
          // Allow Enter from input/textarea to trigger check, but not from textarea (multiline essay)
          if (activeTag === 'TEXTAREA') return;
          if (activeTag === 'BUTTON') return;

          if (!state.isChecked) {
            const uAns = state.answers[state.currentIndex];
            if (uAns && uAns.toString().trim() !== '') {
              e.preventDefault();
              if (handleCheckAnswerRef.current) {
                handleCheckAnswerRef.current();
              }
            }
          } else {
            e.preventDefault();
            if (state.currentIndex < currentContent.quiz.length - 1) {
              playSound('select', soundEnabledRef.current);
              setQuizState((p) => ({ ...p, currentIndex: p.currentIndex + 1, isChecked: false, hintLevel: 0, showHint: false }));
            } else {
              playSound('finish', soundEnabledRef.current);
              setQuizState((p) => {
                const newState = { ...p, finished: true };
                setContent((prev) => ({
                  ...prev,
                  quizHistory: [...(prev.quizHistory || []), { quiz: prev.quiz, state: newState, config: quizConfigRef.current, date: new Date().toISOString() }],
                }));
                return newState;
              });
            }
          }
        }
      }
    };
    window.addEventListener('keydown', handleGlobalEnter);
    return () => window.removeEventListener('keydown', handleGlobalEnter);
  }, []);

  // TAM EKRAN (FULLSCREEN) YÖNETİMİ
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      const docEl = document.documentElement;
      const requestFs = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.msRequestFullscreen;

      if (requestFs) {
        requestFs.call(docEl).catch(() => {
          setIsFullscreen(!isFullscreen);
        });
      } else {
        setIsFullscreen(!isFullscreen);
      }
    } else {
      const exitFs = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
      if (exitFs) {
        exitFs.call(document);
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const handleSaveMaterial = () => {
    if (materialText.trim().length < 50) return;

    const chunks = chunkText(materialText);

    if (!activeSessionId) {
      setActiveSessionId(Date.now().toString());
    }

    setMaterialChunks(chunks);
    setSavedMaterial(materialText);

    setGeneratingIndex({ lesson: -1, notes: -1, visual: -1 });
    setQuizState({ activeMode: 'interactive', currentIndex: 0, answers: {}, verdicts: {}, isChecked: false, isEvaluating: false, hintLevel: 0, finished: false });
    setQuizConfig((p) => ({ ...p, quizScope: 'current', selectedSessions: [] }));

    if (chatMessages.length <= 1) {
      setChatMessages([{ role: 'model', text: t.chatMaterialLoaded }]);
    }
    setActiveTab('lesson');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.name.endsWith('.pptx')) {
      alert('Sunum dosyalarınızı (PPTX) doğrudan okuyamıyorum, ancak Dosya > Farklı Kaydet diyerek PDF olarak kaydederseniz tüm içeriği anında analiz edebilirim!');
      e.target.value = null;
      return;
    }

    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setMaterialText(event.target.result);
        if (!studyTitle) setStudyTitle(file.name.replace('.txt', ''));
      };
      reader.readAsText(file);
    } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      setIsExtracting(true);
      setMaterialText(t.pdfLoading);

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const pdfjsLib = await import('pdfjs-dist');
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

          const typedArray = new Uint8Array(event.target.result);
          const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

          let fullText = '';
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item) => item.str).join(' ');
            fullText += pageText + '\n\n';
          }

          const trimmed = fullText.trim();
          if (!trimmed) {
            setMaterialText('PDF\'den metin okunamadı. Taranmış (görüntü tabanlı) PDF\'ler desteklenmiyor, lütfen metin içeren bir PDF yükleyin.');
          } else {
            setMaterialText(trimmed);
            if (!studyTitle) setStudyTitle(file.name.replace('.pdf', ''));
          }
        } catch (err) {
          console.error('PDF parse error:', err);
          setMaterialText('PDF okunurken bir hata oluştu. Lütfen farklı bir dosya deneyin.');
        } finally {
          setIsExtracting(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert(t.fileTypeAlert);
    }
    e.target.value = null;
  };

  const generateContent = async (type) => {
    if (!savedMaterial && (type !== 'quiz' || quizConfig.quizScope !== 'mixed')) return;
    setLoading((prev) => ({ ...prev, [type]: true }));

    if (type === 'quiz') {
      const isEnglish = appLang === 'en';
      const langReq = isEnglish
        ? `IMPORTANT: The generated questions, options, hints, expected correct answers, and explanations MUST BE ENTIRELY IN ENGLISH.`
        : `Sınav dili tamamen Türkçe olmalıdır.`;

      const isMock = quizConfig.examMode === 'mock';
      const isHard = quizConfig.difficulty === 'Zor';
      const isMixed = quizConfig.quizScope === 'mixed' && quizConfig.selectedSessions.length > 0;

      let typeReq = '';
      if (quizConfig.onlyMultipleChoice) {
        typeReq = `Sınavda SADECE Çoktan Seçmeli ("multiple_choice") sorular olsun.`;
      } else if (quizConfig.onlyEssay) {
        typeReq = `Sınavda SADECE Uzun Açık Uçlu Kompozisyon ("essay") soruları olsun.`;
      } else if (isMock) {
        typeReq = `Sınavda soru tiplerini şu oranda dengeli dağıt: Yaklaşık %40 Çoktan Seçmeli ("multiple_choice"), %20 Doğru-Yanlış ("true_false"), %15 Boşluk Doldurma ("fill_blank"), %15 Kısa Cevap ("short_answer") ve %10 Kompozisyon/Uzun Cevap ("essay").`;
      } else {
        typeReq = `Sınavda şu soru tiplerinin karışımı olsun: Çoktan Seçmeli ("multiple_choice"), Doğru-Yanlış ("true_false"), Boşluk Doldurma ("fill_blank"), Kısa Cevap ("short_answer") ${isHard ? 've en az 1-2 adet Kompozisyon/Analiz ("essay")' : ''}.`;
      }

      let textToAnalyze = savedMaterial;
      let mixedReq = '';

      if (isMixed) {
        const selectedMats = sessionsList
          .filter((s) => quizConfig.selectedSessions.includes(s.id))
          .map((s) => `--- [MÜFREDAT KONUSU: ${s.title}] ---\n${s.savedMaterial}`);
        textToAnalyze = selectedMats.join('\n\n');
        mixedReq = `ÖNEMLİ: Bu kapsamlı bir VİZE / FİNAL karma sınavıdır. Soruları yukarıda verilen farklı MÜFREDAT KONULARI (Haftalar) arasında dengeli bir şekilde dağıt. Sınavın her konuyu (haftayı) ölçtüğünden emin ol.`;
      }

      const prompt = `Aşağıdaki metne dayanarak ${quizConfig.count} soruluk, "${quizConfig.difficulty}" zorluk derecesinde akademik bir sınav hazırla:\n\n${textToAnalyze}`;
      const systemInstruction = `Sen adil ve yaratıcı bir üniversite profesörüsün. Çıktıyı SADECE geçerli bir JSON dizisi olarak ver. ${typeReq} ${langReq} ${mixedReq}
Format:
[
  {
    "tip": "multiple_choice" | "true_false" | "fill_blank" | "short_answer" | "essay",
    "soru": "Question text",
    "secenekler": ["Option 1", "Option 2", "Option 3"] (Only for multiple_choice/true_false. For true_false use ["True", "False"] or ["Doğru", "Yanlış"]. Null for others),
    "dogruCevap": "Exact expected answer text or expected key points for essay",
    "ipucu1": "First small hint",
    "ipucu2": "Second more detailed hint",
    "aciklama": "Detailed academic explanation of the correct answer"
  }
]
Tam ${quizConfig.count} soru hazırla. Başka hiçbir metin ekleme.`;

      try {
        const result = await callGemini(prompt, systemInstruction, apiKey, null, true, provider);
        const finalData = parseJSON(result);
        if (!finalData) throw new Error('JSON parse edilemedi');
        setQuizState((p) => ({ ...p, activeMode: quizConfig.examMode, hintLevel: 0 }));
        setContent((prev) => ({ ...prev, quiz: finalData }));
      } catch (error) {
        console.error('Sınav üretilirken hata:', error);
        alert('Sınav üretilirken bir hata oluştu. Lütfen tekrar deneyin.');
      } finally {
        setLoading((prev) => ({ ...prev, quiz: false }));
      }
      return;
    }

    for (let i = 0; i < materialChunks.length; i++) {
      if (content[type] && content[type][i]) {
        continue;
      }

      setGeneratingIndex((prev) => ({ ...prev, [type]: i }));

      let prompt = '';
      let systemInstruction = '';
      let isJson = false;

      const textToAnalyze = materialChunks[i];
      const partInfo = materialChunks.length > 1 ? `(Bölüm ${i + 1}/${materialChunks.length})` : '';

      switch (type) {
        case 'lesson':
          prompt = `Aşağıdaki ders materyalini ${partInfo} üniversite seviyesinde, akıcı, akademik ama abartıdan uzak bir dille detaylıca anlat. Materyaldeki hiçbir konuyu atlama:\n\n${textToAnalyze}`;
          systemInstruction = `Sen üniversite öğrencilerine ders anlatan saygın bir eğitmensin. Karşındaki 3. sınıf bir üniversite öğrencisi. Anlatımında çocukça, zorlama analojilerden kaçın. "Merhaba" gibi selamlamalar YAPMADAN doğrudan konuya gir.
Lütfen dersi şu yapıya sadık kalarak detaylıca anlat:
1. **Doğrudan Giriş:** Bu konunun akademik özü ve önemi nedir? 
2. **Kapsamlı ve Eksiksiz Anlatım:** Sana verilen materyaldeki HİÇBİR BİLGİYİ atlama. Gerekirse alt başlıklar ve TABLOLAR kullanarak mantığını detaylıca anlat.
3. **Stratejik Vurgular:** Konuyu anlatırken aralara uyarılar serpiştir.

ÖNEMLİ: Akademik metinleri zenginleştirmek için şu 3 özel etiketi satır başında (başka bir işaret olmadan) YERİ GELDİKÇE kullan:
- [TÜYO] : Sınavlarda çıkması muhtemel stratejik ipuçları için.
- [DİKKAT] : Sık düşülen kavram yanılgıları ve tuzaklar için.
- [ÖNEMLİ] : Kesinlikle bilinmesi gereken kritik tanımlar için.`;
          break;
        case 'notes':
          prompt = `Aşağıdaki metinden ${partInfo} üniversite düzeyinde, sınav öncesi hızlı tekrar için yapılandırılmış bir "Çalışma Rehberi" oluştur:\n\n${textToAnalyze}`;
          systemInstruction = `Sen stratejik bir akademik çalışma asistanısın. Çıktıyı SADECE Markdown formatında ver. JSON KULLANMA. Rehber şu 4 ana bölümden oluşmalı:
1. **Kritik Kavramlar Sözlüğü:** Konudaki en önemli terimler ve net tanımları.
2. **Süreçler ve İlişkiler:** Konudaki neden-sonuç ilişkileri, etki-tepki mekanizmaları veya mantıksal akış.
3. **Püf Noktalar / Buraya Dikkat:** Sınavda tuzak olabilecek detaylar. (Yazarken satır başına [TÜYO], [DİKKAT] veya [ÖNEMLİ] etiketlerinden uygun olanı koyarak tasarımsal olarak öne çıkmalarını sağla).
4. **Muhtemel Sınav Soruları:** Hocaların sınavlarda sorabileceği 3 adet potansiyel açık uçlu soru ve vurucu yanıtları.
Başka hiçbir gereksiz metin ekleme.`;
          break;
        case 'visual':
          prompt = `Aşağıdaki metni ${partInfo} analiz et ve içeriğin yapısına EN UYGUN görsel şablonu (Zaman çizelgesi, Karşılaştırma, Veri Tablosu veya Kategorik Grid) seçip oluştur:\n\n${textToAnalyze}`;
          systemInstruction = `Sen uzman bir veri görselleştirme asistanısın. Metni analiz et ve şu 4 formattan BİRİNİ seçerek SADECE JSON objesi dön.

Format 1 (Süreç/Tarihsel Akış):
{ "title": "Başlık", "layout": "timeline", "items": [ { "subtitle": "Adım", "details": "Açıklama" } ] }

Format 2 (Kategorik Bilgiler):
{ "title": "Başlık", "layout": "grid", "items": [ { "subtitle": "Kategori", "details": "Açıklama" } ] }

Format 3 (İki Kavramın Kıyaslanması - Örn DNA vs RNA):
{ "title": "Başlık", "layout": "comparison", "comparisonData": { "conceptA": "Kavram 1", "conceptB": "Kavram 2", "points": [ { "feature": "Özellik", "valA": "1. Durum", "valB": "2. Durum" } ] } }

Format 4 (Sınıflandırma/Sayısal Veri Tablosu):
{ "title": "Başlık", "layout": "table", "tableData": { "headers": ["Sütun 1", "Sütun 2", "Sütun 3"], "rows": [ ["Değer 1", "Değer 2", "Değer 3"] ] } }

Sadece içeriğe en uygun tek bir formatı seç ve JSON olarak ver. Başka metin ekleme.`;
          isJson = true;
          break;
        default:
          break;
      }

      try {
        const result = await callGemini(prompt, systemInstruction, apiKey, null, isJson, provider);
        let finalData = result;
        if (isJson) {
          finalData = parseJSON(result);
          if (!finalData) throw new Error('JSON parse edilemedi');
        }
        setContent((prev) => ({
          ...prev,
          [type]: { ...prev[type], [i]: finalData },
        }));
      } catch (error) {
        console.error(`Bölüm ${i + 1} üretilirken hata:`, error);
        setContent((prev) => ({
          ...prev,
          [type]: {
            ...prev[type],
            [i]: type === 'visual' ? null : '> ⚠️ *Sistem bu bölümü sentezlerken geçici bir hata yaşadı. Lütfen metnin orijinaline veya bir sonraki bölüme başvurunuz.*',
          },
        }));
      }
    }

    setGeneratingIndex((prev) => ({ ...prev, [type]: -1 }));
    setLoading((prev) => ({ ...prev, [type]: false }));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentMessage.trim() || !savedMaterial) return;
    const userMsg = currentMessage;
    setCurrentMessage('');
    setChatMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setLoading((prev) => ({ ...prev, chat: true }));

    let historyStats = '';
    if (content.quizHistory && content.quizHistory.length > 0) {
      historyStats =
        'ÖĞRENCİ SINAV GEÇMİŞİ VE ZAYIF YÖNLERİ:\n' +
        content.quizHistory
          .map((qh, idx) => {
            const qCorrect = qh.quiz.filter((q, i) => qh.state.verdicts[i]?.isCorrect ?? isAnswerCorrect(qh.state.answers[i], q.dogruCevap)).length;
            const score = Math.round((qCorrect / qh.quiz.length) * 100);
            return `Sınav ${idx + 1}: ${qh.config.difficulty} Zorluk, %${score} Başarı.`;
          })
          .join('\n');
    }

    const systemInstruction = `Sen üniversite öğrencilerine rehberlik eden akademik bir asistansın. Aşağıdaki referans materyali ve öğrencinin sınav geçmişini kullanarak soruları yanıtla. Zayıf yönlerini analiz edip tavsiye verebilirsin.\n\nREFERANS MATERYAL:\n${savedMaterial}\n\n${historyStats}`;
    const chatHistoryText = chatMessages
      .slice(-5)
      .map((m) => `${m.role === 'user' ? 'Öğrenci' : 'Öğretmen'}: ${m.text}`)
      .join('\n');
    const prompt = `Önceki Sohbet:\n${chatHistoryText}\n\nÖğrenci: ${userMsg}\n\nCevabın:`;

    const response = await callGemini(prompt, systemInstruction, apiKey, null, false, provider);
    setChatMessages((prev) => [...prev, { role: 'model', text: response }]);
    setLoading((prev) => ({ ...prev, chat: false }));
  };

  const generatePodcast = async () => {
    if (!savedMaterial) return;
    setPodcastText('');
    setPodcastPlaying(false);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setLoading(prev => ({ ...prev, podcast: true }));
    const isEn = appLang === 'en';
    const prompt = `${isEn ? 'Convert the following academic material into a natural, engaging podcast script. Write it as a single narrator speaking directly to a student. No headers, no bullet points — just flowing spoken language. Keep it educational but conversational.' : 'Aşağıdaki akademik materyali doğal, akıcı bir podcast anlatımına dönüştür. Tek bir anlatıcı öğrenciye doğrudan konuşuyor gibi yaz. Başlık veya madde işareti kullanma — sadece konuşma dili. Eğitici ama sohbet havasında olsun.'}\n\n${savedMaterial.slice(0, 6000)}`;
    const result = await callGemini(prompt, isEn ? 'You are a friendly academic podcast host.' : 'Sen samimi bir akademik podcast sunucususun.', apiKey, null, false, provider);
    setPodcastText(result);
    setLoading(prev => ({ ...prev, podcast: false }));
  };

  const handlePodcastPlay = () => {
    if (!podcastText || !window.speechSynthesis) return;
    if (podcastPlaying) {
      window.speechSynthesis.cancel();
      setPodcastPlaying(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(podcastText);
    utterance.lang = appLang === 'en' ? 'en-US' : 'tr-TR';
    utterance.rate = 0.95;
    utterance.onend = () => setPodcastPlaying(false);
    utterance.onerror = () => setPodcastPlaying(false);
    podcastUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setPodcastPlaying(true);
  };

  const tabs = [
    { id: 'archive', icon: <Library size={20} />, label: t.myStudies, requiresMaterial: false },
    { id: 'material', icon: <UploadCloud size={20} />, label: t.addMaterial, requiresMaterial: false },
    { id: 'lesson', icon: <BookOpen size={20} />, label: t.lesson, requiresMaterial: true },
    { id: 'notes', icon: <ClipboardList size={20} />, label: t.notes, requiresMaterial: true },
    { id: 'visual', icon: <PieChart size={20} />, label: t.visual, requiresMaterial: true },
    { id: 'quiz', icon: <GraduationCap size={20} />, label: t.quiz, requiresMaterial: true },
    { id: 'podcast', icon: <Volume2 size={20} />, label: t.podcast, requiresMaterial: true },
    { id: 'chat', icon: <MessageSquare size={20} />, label: t.chat, requiresMaterial: true },
  ];

  const renderChapterNav = (type) => {
    if (materialChunks.length <= 1) return null;
    return (
      <div className="flex flex-wrap items-center gap-2 mb-8 p-2 bg-slate-100/80 rounded-2xl border border-slate-200/60 no-print">
        <span className="text-sm font-bold text-slate-500 ml-2 mr-1">{t.chapterNav}</span>
        {materialChunks.map((_, idx) => {
          const isActive = activeChunk[type] === idx;
          const isCompleted = !!content[type][idx];
          return (
            <button
              key={idx}
              onClick={() => {
                playSound('select', soundEnabled);
                setActiveChunk((p) => ({ ...p, [type]: idx }));
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                isActive ? 'bg-white text-indigo-700 shadow-sm border border-indigo-100' : 'text-slate-600 hover:bg-slate-200 border border-transparent'
              }`}
            >
              {t.chapterLabel(idx + 1)}
              {isCompleted && <CheckCircle2 size={16} className={isActive ? 'text-emerald-500' : 'text-emerald-400'} />}
            </button>
          );
        })}
      </div>
    );
  };

  // --- ONBOARDING: API anahtarı yoksa onboarding ekranını göster ---
  if (!apiKey) {
    return (
      <OnboardingScreen
        onApiKeySubmit={(key, prov) => {
          const detectedProvider = key.startsWith('gsk_') ? 'groq' : prov;
          localStorage.setItem('gemini_api_key', key);
          localStorage.setItem('ai_provider', detectedProvider);
          setApiKey(key);
          setProvider(detectedProvider);
        }}
      />
    );
  }

  // --- AYARLAR MODALİ ---
  const SettingsModal = () => {
    const [settingsProvider, setSettingsProvider] = React.useState(provider);
    const providerInfo = {
      gemini: { label: 'Google Gemini', placeholder: 'AIzaSy...', hint: 'Dakikada 15 istek · Ücretsiz' },
      groq: { label: 'Groq', placeholder: 'gsk_...', hint: 'Dakikada 30 istek · Ücretsiz · Çok hızlı' },
    };
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Key size={20} className="text-indigo-600" /> AI Sağlayıcı Ayarları
            </h2>
            <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X size={20} className="text-slate-500" />
            </button>
          </div>

          {/* Sağlayıcı Seçimi */}
          <p className="text-sm font-medium text-slate-600 mb-2">AI Sağlayıcısı</p>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {Object.entries(providerInfo).map(([key, val]) => (
              <button
                key={key}
                type="button"
                onClick={() => { setSettingsProvider(key); setSettingsApiKey(''); }}
                className={`p-3 rounded-xl border-2 text-left transition ${
                  settingsProvider === key
                    ? 'border-indigo-500 bg-indigo-50 text-slate-800'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-sm">{val.label}</div>
                <div className="text-xs mt-1 opacity-70">{val.hint}</div>
              </button>
            ))}
          </div>

          <p className="text-sm font-medium text-slate-600 mb-2">
            {providerInfo[settingsProvider].label} API Anahtarı
          </p>
          <input
            type="text"
            value={settingsApiKey}
            onChange={(e) => setSettingsApiKey(e.target.value)}
            placeholder={`Yeni anahtar (${providerInfo[settingsProvider].placeholder})`}
            className="w-full bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition mb-4"
          />
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (settingsApiKey.trim()) {
                  const detectedProvider = settingsApiKey.trim().startsWith('gsk_') ? 'groq' : settingsProvider;
                  localStorage.setItem('gemini_api_key', settingsApiKey.trim());
                  localStorage.setItem('ai_provider', detectedProvider);
                  setApiKey(settingsApiKey.trim());
                  setProvider(detectedProvider);
                  setSettingsApiKey('');
                  setShowSettings(false);
                }
              }}
              disabled={!settingsApiKey.trim()}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-3 px-4 rounded-lg transition"
            >
              Kaydet
            </button>
            <button
              onClick={() => setShowSettings(false)}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-lg transition"
            >
              İptal
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-slate-100 font-sans text-slate-800 ${isFullscreen ? 'fixed inset-0 z-[9999] w-full h-full overflow-hidden bg-slate-50 dark:bg-slate-950 m-0 p-0' : ''}`}>
      {showSettings && <SettingsModal />}

      {/* Mobil Header */}
      <div className="md:hidden flex items-center justify-between bg-indigo-800 text-white p-4 shadow-md z-20 shrink-0">
        <div className="flex items-center gap-2 font-bold text-xl">
          <img src="/yapay-ogretmen/favicon.png" alt="logo" className="w-8 h-8 rounded-lg" />
          <span>{t.appName}</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleFullScreen} className="p-1 rounded-md hover:bg-indigo-700 transition-colors">
            {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 ease-in-out
        ${isFullscreen ? 'sticky' : 'fixed md:sticky'} top-0 left-0 h-screen w-64 bg-indigo-900 text-white shadow-xl flex flex-col z-10 print:hidden shrink-0
      `}
      >
        <div className="p-6 hidden md:flex items-center justify-between border-b border-indigo-800">
          <div className="flex items-center gap-3">
            <img src="/yapay-ogretmen/favicon.png" alt="logo" className="w-10 h-10 rounded-xl" />
            <h1 className="text-xl font-extrabold tracking-wide">{t.appName}</h1>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {tabs.map((tab) => {
            const isDisabled = tab.requiresMaterial && !savedMaterial;
            return (
              <button
                key={tab.id}
                disabled={isDisabled}
                onClick={() => {
                  playSound('select', soundEnabled);
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${activeTab === tab.id ? 'bg-indigo-600 shadow-md font-semibold text-white' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}
                  ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {isDisabled && <AlertCircle size={14} className="ml-auto opacity-70" />}
              </button>
            );
          })}
        </nav>

        {/* Settings & Fullscreen Desktop Buttons */}
        <div className="p-4 border-t border-indigo-800 hidden md:flex flex-col gap-2 shrink-0">
          <button
            onClick={() => { setSettingsApiKey(''); setShowSettings(true); }}
            className="w-full flex items-center gap-2 px-4 py-3 text-indigo-200 hover:text-white hover:bg-indigo-800 rounded-xl transition-colors font-medium text-sm"
          >
            <Key size={18} />
            <span className="flex-1 text-left">
              {provider === 'groq' ? 'Groq' : 'Gemini'}
            </span>
            {apiKey && (
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                {apiKey.slice(0, 6)}…
              </span>
            )}
          </button>
          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(d => !d)}
            className="w-full flex items-center gap-2 px-4 py-3 text-indigo-200 hover:text-white hover:bg-indigo-800 rounded-xl transition-colors font-medium text-sm"
          >
            <span className="shrink-0">{darkMode ? '☀️' : '🌙'}</span>
            <span className="flex-1 text-left truncate min-w-0">{t.darkMode}</span>
            <span className={`shrink-0 inline-flex items-center w-9 h-5 rounded-full transition-colors ${darkMode ? 'bg-indigo-400' : 'bg-indigo-700'}`}>
              <span className={`inline-block w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-4' : 'translate-x-1'}`} />
            </span>
          </button>
          {/* Language toggle */}
          <button
            onClick={() => setAppLang(l => l === 'tr' ? 'en' : 'tr')}
            className="w-full flex items-center gap-2 px-4 py-3 text-indigo-200 hover:text-white hover:bg-indigo-800 rounded-xl transition-colors font-medium text-sm"
          >
            <Globe size={18} />
            <span className="flex-1 text-left">{t.language}</span>
            <span className="text-xs font-bold bg-indigo-700 px-2 py-0.5 rounded-md">{appLang === 'tr' ? 'TR' : 'EN'}</span>
          </button>
          <button
            onClick={toggleFullScreen}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-indigo-200 hover:text-white hover:bg-indigo-800 rounded-xl transition-colors font-medium text-sm"
          >
            {isFullscreen ? <><Minimize size={18} /> {t.normalScreen}</> : <><Maximize size={18} /> {t.fullscreen}</>}
          </button>
          <div className="pt-2 text-center text-indigo-500 text-xs leading-relaxed">
            <div>{t.version}</div>
            <div>{t.author}</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 h-screen overflow-y-auto w-full bg-slate-50/50 dark:bg-slate-900 relative">
        <div className="max-w-5xl mx-auto pb-10">

          {/* TAB 0: ÇALIŞMA ARŞİVİ */}
          {activeTab === 'archive' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 px-2 gap-4">
                <div className="flex items-center gap-3">
                  <Library size={32} className="text-indigo-700" />
                  <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{t.archiveTitle}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => importFileRef.current?.click()}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 hover:border-indigo-300 text-slate-600 font-bold rounded-xl transition-all shadow-sm"
                  >
                    <Upload size={18} /> <span className="hidden sm:inline">{t.importBtn}</span>
                  </button>
                  <input type="file" accept=".akademik" className="hidden" ref={importFileRef} onChange={handleImportFile} />

                  <button
                    onClick={createNewSession}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md"
                  >
                    <PlusCircle size={18} /> {t.newStudyBtn}
                  </button>
                </div>
              </div>

              {sessionsList.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 p-12 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                  <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FolderOpen size={40} className="text-slate-400 dark:text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">{t.archiveEmpty}</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                    {t.archiveEmptyDesc}
                  </p>
                  <button
                    onClick={createNewSession}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-md transition-all inline-flex items-center gap-2"
                  >
                    <PlusCircle size={18} /> {t.archiveStart}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sessionsList.map((session) => {
                    const isActive = session.id === activeSessionId;
                    const dateObj = new Date(session.lastModified);
                    return (
                      <div
                        key={session.id}
                        onClick={() => loadSession(session)}
                        className={`bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border-2 cursor-pointer transition-all hover:-translate-y-1 relative group
                          ${isActive ? 'border-indigo-500 shadow-indigo-500/20' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'}
                        `}
                      >
                        {isActive && (
                          <div className="absolute top-4 right-4 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                            {t.activeLabel}</div>
                        )}
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                          <BookOpen size={24} />
                        </div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-1 line-clamp-2" title={session.title}>
                          {session.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-6">
                          {dateObj.toLocaleDateString('tr-TR')} • {dateObj.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-700 pt-4">
                          <button
                            onClick={(e) => exportSession(session, e)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Yedeği İndir (.akademik)"
                          >
                            <Download size={18} />
                          </button>
                          <button
                            onClick={(e) => deleteSession(session.id, e)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Sil"
                          >
                            <Trash2 size={18} />
                          </button>
                          <div className="ml-auto text-indigo-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                            {t.openLabel} <ChevronRight size={16} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 1: MATERYAL YÜKLE */}
          {activeTab === 'material' && (
            <div className="bg-white dark:bg-slate-800 p-6 md:p-10 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 rounded-2xl hidden sm:block">
                  <UploadCloud size={28} />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t.materialTitle}</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-base mt-1">{t.materialDesc}</p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isExtracting}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all border-2 border-slate-200 hover:border-indigo-300 disabled:opacity-50"
                >
                  {isExtracting ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
                  {t.filePickBtn}
                </button>
                <input type="file" accept=".txt,.pdf,.pptx" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">{t.studyTitleLabel}</label>
                <input
                  type="text"
                  value={studyTitle}
                  onChange={(e) => setStudyTitle(e.target.value)}
                  placeholder={t.studyTitlePlaceholder}
                  className="w-full p-4 text-lg rounded-xl border-2 border-slate-200 focus:border-indigo-500 bg-slate-50 focus:bg-white transition-all outline-none font-medium"
                />
              </div>

              <div className="relative">
                <textarea
                  value={materialText}
                  onChange={(e) => setMaterialText(e.target.value)}
                  disabled={isExtracting}
                  placeholder={t.materialTextPlaceholder}
                  className={`w-full h-[300px] md:h-[400px] p-6 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none text-slate-700 text-lg leading-relaxed ${isExtracting ? 'opacity-50' : ''}`}
                />
                {isExtracting && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl">
                    <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
                    <p className="text-xl font-bold text-indigo-900">{t.pdfAnalyzing}</p>
                    <p className="text-indigo-600/80 mt-2 font-medium">{t.pdfExtracting}</p>
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  {materialText.length > 0 ? (
                    <>
                      <CheckCircle2 size={18} className="text-emerald-500" /> {t.charReady(materialText.length)}
                    </>
                  ) : (
                    t.charMin
                  )}
                </p>
                <button
                  onClick={() => {
                    playSound('select', soundEnabled);
                    handleSaveMaterial();
                  }}
                  disabled={materialText.length < 50}
                  className={`
                    w-full sm:w-auto px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-lg
                    ${materialText.length >= 50 ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                  `}
                >
                  <BookOpen size={20} />
                  {t.saveAndStart}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: DERS ANLATIMI */}
          {activeTab === 'lesson' &&
            (() => {
              const isStarted = Object.keys(content.lesson).length > 0 || generatingIndex.lesson !== -1;
              const isFinished = Object.keys(content.lesson).length === materialChunks.length && materialChunks.length > 0;

              return (
                <div className="animate-in fade-in duration-500">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 px-2 gap-4">
                    <div className="flex items-center gap-3">
                      <BookOpen size={32} className="text-indigo-700" />
                      <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">{t.lessonTitle}</h2>
                    </div>
                    {isFinished && (
                      <button
                        onClick={() => handlePrint('lesson-content-area', t.lessonTitle)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 hover:border-indigo-300 text-indigo-700 font-bold rounded-xl transition-all shadow-sm w-full sm:w-auto"
                      >
                        <Printer size={18} /> <span>{t.downloadPdf}</span>
                      </button>
                    )}
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-6 md:p-12 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
                    {!isStarted ? (
                      <div className="text-center py-20">
                        <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/40 rounded-full flex items-center justify-center mx-auto mb-8">
                          <GraduationCap size={48} className="text-indigo-600" />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">{t.lessonReadyTitle}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-lg mx-auto mb-10">
                          {t.lessonReadyDesc}
                        </p>
                        <button
                          onClick={() => {
                            playSound('select', soundEnabled);
                            generateContent('lesson');
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-3 mx-auto w-full sm:w-auto justify-center"
                        >
                          {t.synthesizeAll}
                        </button>
                      </div>
                    ) : (
                      <div className="animate-in fade-in duration-500">
                        <div id="lesson-content-area" className="space-y-12">
                          {materialChunks.map((_, idx) => {
                            if (!content.lesson[idx]) return null;
                            return (
                              <div key={idx} className={`page-break ${idx > 0 ? 'pt-12 border-t-2 border-slate-100' : ''}`}>
                                {materialChunks.length > 1 && (
                                  <h2 className="text-2xl font-extrabold mb-8 text-indigo-900 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-black text-lg shrink-0">
                                      {idx + 1}
                                    </div>
                                    {t.chapterLabel(idx + 1)}
                                  </h2>
                                )}
                                {renderMarkdown(content.lesson[idx])}
                              </div>
                            );
                          })}
                        </div>

                        {generatingIndex.lesson !== -1 && (
                          <div className="flex flex-col items-center justify-center py-12 text-indigo-600 border-2 border-dashed border-indigo-100 rounded-3xl mt-12 bg-indigo-50/50 no-print">
                            <Loader2 size={40} className="animate-spin mb-4" />
                            <p className="text-lg font-bold animate-pulse text-center">
                              {t.chapterSynthesizing(generatingIndex.lesson + 1, materialChunks.length)}
                            </p>
                            <p className="text-indigo-600/60 mt-2 font-medium text-center px-4">
                              {t.chapterSynthesizingNote}
                            </p>
                          </div>
                        )}

                        {isFinished && (
                          <div className="mt-16 pt-8 border-t-2 border-slate-100 flex justify-center no-print">
                            <button
                              onClick={() => setActiveTab('chat')}
                              className="text-indigo-700 hover:text-white font-bold flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-600 px-8 py-4 rounded-2xl transition-all shadow-sm w-full sm:w-auto"
                            >
                              <MessageSquare size={20} /> {t.askQuestion}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

          {/* TAB 3: DERS NOTLARI (ÇALIŞMA REHBERİ) */}
          {activeTab === 'notes' &&
            (() => {
              const isStarted = Object.keys(content.notes).length > 0 || generatingIndex.notes !== -1;
              const isFinished = Object.keys(content.notes).length === materialChunks.length && materialChunks.length > 0;

              return (
                <div className="animate-in fade-in duration-500">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 px-2 gap-4">
                    <div className="flex items-center gap-3">
                      <ClipboardList size={32} className="text-amber-600" />
                      <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">{t.notesTitle}</h2>
                    </div>
                    {isFinished && (
                      <button
                        onClick={() => handlePrint('notes-content-area', t.notesTitle)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 hover:border-amber-300 text-amber-700 font-bold rounded-xl transition-all shadow-sm w-full sm:w-auto"
                      >
                        <Printer size={18} /> <span>{t.downloadPdf}</span>
                      </button>
                    )}
                  </div>

                  <div className="bg-amber-50 p-6 md:p-12 rounded-3xl shadow-sm border border-amber-200/60 relative overflow-hidden min-h-[500px]">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-amber-200/30 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>

                    {!isStarted ? (
                      <div className="text-center py-20 relative z-10">
                        <h3 className="text-3xl font-bold text-amber-900 mb-4">{t.notesReadyTitle}</h3>
                        <p className="text-amber-800/80 text-lg mb-10 max-w-xl mx-auto">
                          {t.notesReadyDesc}
                        </p>
                        <button
                          onClick={() => {
                            playSound('select', soundEnabled);
                            generateContent('notes');
                          }}
                          className="bg-amber-500 hover:bg-amber-600 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl shadow-amber-500/20 transition-all w-full sm:w-auto justify-center flex"
                        >
                          {t.synthesizeAll}
                        </button>
                      </div>
                    ) : (
                      <div className="relative z-10 animate-in fade-in duration-500">
                        {renderChapterNav('notes')}
                        <div id="notes-content-area" className="bg-white p-6 md:p-12 rounded-3xl shadow-sm border border-amber-100 space-y-12">
                          {materialChunks.map((_, idx) => {
                            if (!content.notes[idx]) return null;
                            return (
                              <div key={idx} className={`page-break ${idx > 0 ? 'pt-12 border-t-2 border-amber-100' : ''}`}>
                                {materialChunks.length > 1 && (
                                  <h2 className="text-2xl font-extrabold mb-8 text-amber-900 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-black text-lg shrink-0">
                                      {idx + 1}
                                    </div>
                                    {t.chapterLabel(idx + 1)}
                                  </h2>
                                )}
                                {renderMarkdown(content.notes[idx])}
                              </div>
                            );
                          })}
                        </div>

                        {generatingIndex.notes !== -1 && (
                          <div className="flex flex-col items-center justify-center py-12 text-amber-600 border-2 border-dashed border-amber-200 rounded-3xl mt-8 bg-amber-50/50 no-print">
                            <Loader2 size={40} className="animate-spin mb-4" />
                            <p className="text-lg font-bold animate-pulse text-center">
                              {t.noteSummarizing(generatingIndex.notes + 1, materialChunks.length)}
                            </p>
                            <p className="text-amber-700/60 mt-2 font-medium text-center px-4">{t.noteSummarizingNote}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

          {/* TAB 3.5: GÖRSEL ÖZET */}
          {activeTab === 'visual' &&
            (() => {
              const isStarted = Object.keys(content.visual).length > 0 || generatingIndex.visual !== -1;
              const isFinished = Object.keys(content.visual).length === materialChunks.length && materialChunks.length > 0;

              return (
                <div className="animate-in fade-in duration-500">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 px-2 gap-4">
                    <div className="flex items-center gap-3">
                      <PieChart size={32} className="text-teal-600" />
                      <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">{t.visualTitle}</h2>
                    </div>
                    {isFinished && (
                      <button
                        onClick={() => handlePrint('visual-content-area', t.visualTitle)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 hover:border-teal-300 text-teal-700 font-bold rounded-xl transition-all shadow-sm w-full sm:w-auto"
                      >
                        <Printer size={18} /> <span>{t.downloadPdf}</span>
                      </button>
                    )}
                  </div>

                  <div className="bg-teal-50/50 p-6 md:p-12 rounded-3xl shadow-sm border border-teal-200/60 relative overflow-hidden min-h-[500px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-200/20 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>

                    {!isStarted ? (
                      <div className="text-center py-20 relative z-10">
                        <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-8">
                          <Layers size={48} className="text-teal-600" />
                        </div>
                        <h3 className="text-3xl font-bold text-teal-900 mb-4">{t.visualReadyTitle}</h3>
                        <p className="text-teal-800/80 text-lg mb-10 max-w-xl mx-auto">
                          {t.visualReadyDesc}
                        </p>
                        <button
                          onClick={() => {
                            playSound('select', soundEnabled);
                            generateContent('visual');
                          }}
                          className="bg-teal-600 hover:bg-teal-700 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl shadow-teal-600/20 transition-all flex items-center justify-center w-full sm:w-auto mx-auto"
                        >
                          {t.visualizeAll}
                        </button>
                      </div>
                    ) : (
                      <div className="relative z-10 animate-in fade-in duration-500 overflow-x-auto pb-10">
                        {renderChapterNav('visual')}
                        <div id="visual-content-area" className="min-w-full md:min-w-[600px] space-y-12">
                          {materialChunks.map((_, idx) => {
                            if (!content.visual[idx]) return null;
                            return (
                              <div key={idx} className={`page-break ${idx > 0 ? 'pt-12 border-t-2 border-teal-200/50' : ''}`}>
                                {materialChunks.length > 1 && (
                                  <h2 className="text-2xl font-extrabold mb-8 text-teal-900 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-black text-lg shrink-0">
                                      {idx + 1}
                                    </div>
                                    {t.chapterLabel(idx + 1)}
                                  </h2>
                                )}
                                <VisualSummaryComponent data={content.visual[idx]} />
                              </div>
                            );
                          })}
                        </div>

                        {generatingIndex.visual !== -1 && (
                          <div className="flex flex-col items-center justify-center py-12 text-teal-600 border-2 border-dashed border-teal-200 rounded-3xl mt-8 bg-teal-50/50 no-print">
                            <Loader2 size={40} className="animate-spin mb-4" />
                            <p className="text-lg font-bold animate-pulse text-center">
                              {t.visualProcessing(generatingIndex.visual + 1, materialChunks.length)}
                            </p>
                            <p className="text-teal-700/60 mt-2 font-medium text-center px-4">{t.visualProcessingNote}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

          {/* TAB 4: SINAV MODU */}
          {activeTab === 'quiz' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex items-center gap-3 mb-8 px-2">
                <GraduationCap size={32} className="text-rose-600" />
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">{t.quizPageTitle}</h2>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 md:p-12 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
                {!content.quiz && !loading.quiz ? (
                  <div className="py-8 max-w-3xl mx-auto">
                    {content.quizHistory && content.quizHistory.length > 0 && (
                      <div className="mb-10 p-6 bg-indigo-50 border border-indigo-100 rounded-2xl">
                        <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                          <Library size={20} /> {t.prevResults}
                        </h4>
                        <div className="space-y-3">
                          {content.quizHistory.map((qh, idx) => {
                            const qCorrect = qh.quiz.filter((q, i) => qh.state.verdicts[i]?.isCorrect ?? isAnswerCorrect(qh.state.answers[i], q.dogruCevap)).length;
                            const score = Math.round((qCorrect / qh.quiz.length) * 100);
                            return (
                              <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-indigo-50/50">
                                <div>
                                  <p className="font-bold text-slate-800 text-sm">
                                    {t.attempt(idx + 1)}{' '}
                                    <span className="text-slate-400 font-medium ml-2 hidden sm:inline">
                                      ({qh.config.difficulty}, {qh.config.count} {appLang === 'en' ? 'Q' : 'Soru'})
                                    </span>
                                  </p>
                                </div>
                                <div className={`font-black ${score >= 70 ? 'text-emerald-600' : score >= 40 ? 'text-amber-500' : 'text-rose-600'}`}>{t.score(score)}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="text-center mb-10">
                      <div className="w-24 h-24 bg-rose-50 dark:bg-rose-900/30 rounded-3xl rotate-6 flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <GraduationCap size={48} className="text-rose-500 -rotate-6" />
                      </div>
                      <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">{t.quizSettingsTitle}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-lg">{t.quizSettingsDesc}</p>
                    </div>

                    <div className="space-y-8 bg-slate-50 dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-slate-700 mb-10">
                      {/* Sınav Kapsamı */}
                      <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
                        <label className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
                          <BookOpen size={20} className="text-rose-500" /> {t.quizScope}
                        </label>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                              onClick={() => { playSound('select', soundEnabled); setQuizConfig((p) => ({ ...p, quizScope: 'current' })); }}
                              className={`py-4 px-4 text-left rounded-xl font-bold transition-all border-2 ${quizConfig.quizScope === 'current' ? 'bg-rose-100 border-rose-500 text-rose-800 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500 hover:border-rose-300'}`}
                            >
                              <span className="block text-lg mb-1">{t.quizScopeCurrent}</span>
                              <span className="block text-sm font-medium opacity-80">{t.quizScopeCurrentDesc}</span>
                            </button>
                            <button
                              onClick={() => { playSound('select', soundEnabled); setQuizConfig((p) => ({ ...p, quizScope: 'mixed', selectedSessions: p.selectedSessions.length ? p.selectedSessions : [activeSessionId].filter(Boolean) })); }}
                              className={`py-4 px-4 text-left rounded-xl font-bold transition-all border-2 ${quizConfig.quizScope === 'mixed' ? 'bg-rose-100 border-rose-500 text-rose-800 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500 hover:border-rose-300'}`}
                              disabled={sessionsList.length === 0}
                            >
                              <span className="block text-lg mb-1">{t.quizScopeMixed}</span>
                              <span className="block text-sm font-medium opacity-80">{t.quizScopeMixedDesc}</span>
                            </button>
                          </div>

                          {quizConfig.quizScope === 'mixed' && sessionsList.length > 0 && (
                            <div className="bg-white dark:bg-slate-800 border-2 border-rose-200 dark:border-rose-900 rounded-xl p-5 max-h-56 overflow-y-auto space-y-2 mt-4 shadow-inner">
                              <p className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">{t.quizSelectTopics}</p>
                              {sessionsList.map((session) => (
                                <label key={session.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                                  <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500 border-slate-300 cursor-pointer"
                                    checked={quizConfig.selectedSessions.includes(session.id)}
                                    onChange={(e) => {
                                      playSound('select', soundEnabled);
                                      if (e.target.checked) {
                                        setQuizConfig((p) => ({ ...p, selectedSessions: [...p.selectedSessions, session.id] }));
                                      } else {
                                        setQuizConfig((p) => ({ ...p, selectedSessions: p.selectedSessions.filter((id) => id !== session.id) }));
                                      }
                                    }}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate">{session.title}</p>
                                    <p className="text-xs text-slate-400 truncate mt-0.5">{t.studiedOn(new Date(session.lastModified).toLocaleDateString(appLang === 'en' ? 'en-US' : 'tr-TR'))}</p>
                                  </div>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Sınav Tipi */}
                      <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
                        <label className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
                          <Layers size={20} className="text-rose-500" /> {t.quizFormat}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <button
                            onClick={() => { playSound('select', soundEnabled); setQuizConfig((p) => ({ ...p, examMode: 'interactive' })); }}
                            className={`py-4 px-4 text-left rounded-xl font-bold transition-all border-2 ${quizConfig.examMode === 'interactive' ? 'bg-rose-100 border-rose-500 text-rose-800 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500 hover:border-rose-300'}`}
                          >
                            <span className="block text-lg mb-1">{t.quizInteractive}</span>
                            <span className="block text-sm font-medium opacity-80">{t.quizInteractiveDesc}</span>
                          </button>
                          <button
                            onClick={() => { playSound('select', soundEnabled); setQuizConfig((p) => ({ ...p, examMode: 'mock' })); }}
                            className={`py-4 px-4 text-left rounded-xl font-bold transition-all border-2 ${quizConfig.examMode === 'mock' ? 'bg-rose-100 border-rose-500 text-rose-800 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500 hover:border-rose-300'}`}
                          >
                            <span className="block text-lg mb-1">{t.quizMock}</span>
                            <span className="block text-sm font-medium opacity-80">{t.quizMockDesc}</span>
                          </button>
                        </div>
                      </div>

                      {/* Soru Sayısı ve Zorluk */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
                            <Settings2 size={20} className="text-rose-500" /> {t.quizCount}
                          </label>
                          <div className="grid grid-cols-5 gap-2">
                            {[5, 10, 15, 20, 30].map((num) => (
                              <button
                                key={num}
                                onClick={() => { playSound('select', soundEnabled); setQuizConfig((p) => ({ ...p, count: num })); }}
                                className={`py-3 rounded-xl font-bold transition-all border-2 ${quizConfig.count === num ? 'bg-rose-100 border-rose-500 text-rose-800 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500 hover:border-rose-300'}`}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-200 mb-4">
                            <Target size={20} className="text-rose-500" /> {t.quizDifficulty}
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {t.difficulties.map((diff, idx) => (
                              <button
                                key={diff}
                                onClick={() => { playSound('select', soundEnabled); setQuizConfig((p) => ({ ...p, difficulty: T.tr.difficulties[idx] })); }}
                                className={`py-3 rounded-xl font-bold transition-all border-2 ${quizConfig.difficulty === T.tr.difficulties[idx] ? 'bg-rose-100 border-rose-500 text-rose-800 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500 hover:border-rose-300'}`}
                              >
                                {diff}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Toggles */}
                      <div className="pt-6 border-t border-slate-200 dark:border-slate-700 space-y-6">
                        <label className={`flex items-center gap-4 cursor-pointer group ${quizConfig.onlyEssay ? 'opacity-40' : ''}`}>
                          <div className={`relative flex items-center justify-center w-14 h-7 rounded-full transition-colors shrink-0 ${quizConfig.onlyMultipleChoice ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                            <div className={`absolute w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${quizConfig.onlyMultipleChoice ? 'translate-x-3.5' : '-translate-x-3.5'}`}></div>
                          </div>
                          <div>
                            <span className="block text-base font-bold text-slate-800 dark:text-slate-200 group-hover:text-rose-600 transition-colors">{t.quizOnlyMC}</span>
                            <span className="block text-sm text-slate-500 dark:text-slate-400 font-medium">{t.quizOnlyMCDesc}</span>
                          </div>
                          <input type="checkbox" className="hidden" disabled={quizConfig.onlyEssay} checked={quizConfig.onlyMultipleChoice} onChange={(e) => { playSound('select', soundEnabled); setQuizConfig((p) => ({ ...p, onlyMultipleChoice: e.target.checked })); }} />
                        </label>

                        <label className={`flex items-center gap-4 cursor-pointer group ${quizConfig.onlyMultipleChoice ? 'opacity-40' : ''}`}>
                          <div className={`relative flex items-center justify-center w-14 h-7 rounded-full transition-colors shrink-0 ${quizConfig.onlyEssay ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                            <div className={`absolute w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${quizConfig.onlyEssay ? 'translate-x-3.5' : '-translate-x-3.5'}`}></div>
                          </div>
                          <div>
                            <span className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-200 group-hover:text-rose-600 transition-colors">
                              <FileText size={18} /> {t.quizOnlyEssay}
                            </span>
                            <span className="block text-sm text-slate-500 dark:text-slate-400 font-medium">{t.quizOnlyEssayDesc}</span>
                          </div>
                          <input type="checkbox" className="hidden" disabled={quizConfig.onlyMultipleChoice} checked={quizConfig.onlyEssay} onChange={(e) => { playSound('select', soundEnabled); setQuizConfig((p) => ({ ...p, onlyEssay: e.target.checked })); }} />
                        </label>

                        <label className="flex items-center gap-4 cursor-pointer group">
                          <div className={`relative flex items-center justify-center w-14 h-7 rounded-full transition-colors shrink-0 ${soundEnabled ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                            <div className={`absolute w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${soundEnabled ? 'translate-x-3.5' : '-translate-x-3.5'}`}></div>
                          </div>
                          <div>
                            <span className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">
                              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />} {t.soundEffects}
                            </span>
                            <span className="block text-sm text-slate-500 dark:text-slate-400 font-medium">{t.soundEffectsDesc}</span>
                          </div>
                          <input type="checkbox" className="hidden" checked={soundEnabled} onChange={(e) => { setSoundEnabled(e.target.checked); if (e.target.checked) playSound('select', true); }} />
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={() => { playSound('select', soundEnabled); generateContent('quiz'); }}
                      disabled={quizConfig.quizScope === 'mixed' && quizConfig.selectedSessions.length === 0}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white py-5 rounded-2xl font-bold text-xl shadow-xl shadow-rose-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {quizConfig.quizScope === 'mixed' && quizConfig.selectedSessions.length === 0 ? t.selectTopicsFirst : t.startQuiz}
                    </button>
                  </div>

                ) : loading.quiz ? (
                  <div className="flex flex-col items-center justify-center py-32 text-rose-600">
                    <Loader2 size={56} className="animate-spin mb-6" />
                    <p className="text-xl font-bold animate-pulse text-center">
                      {t.quizGenerating(quizConfig.count)}
                    </p>
                  </div>
                ) : Array.isArray(content.quiz) && (
                  <div>
                    {!quizState.finished ? (
                      <div className="max-w-3xl mx-auto">
                        {quizState.activeMode === 'interactive' && (
                          <>
                            <div className="flex items-center justify-between text-base font-bold text-slate-500 mb-4">
                              <span className="bg-slate-100 dark:bg-slate-700 px-4 py-1.5 rounded-lg text-slate-700 dark:text-slate-200">{t.questionLabel(quizState.currentIndex + 1, content.quiz.length)}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-rose-600">{Math.round((quizState.currentIndex / content.quiz.length) * 100)}% {t.completed}</span>
                                <button
                                  onClick={() => { if (window.confirm(t.quizCancelConfirm)) { playSound('select', soundEnabled); setWeakAnalysis(null); setQuizState({ activeMode: 'interactive', currentIndex: 0, answers: {}, verdicts: {}, isChecked: false, isEvaluating: false, hintLevel: 0, finished: false }); setContent((prev) => ({ ...prev, quiz: null })); } }}
                                  className="text-xs text-slate-400 hover:text-rose-500 border border-slate-200 hover:border-rose-300 px-3 py-1.5 rounded-lg transition-colors font-medium"
                                >
                                  {t.cancel}
                                </button>
                              </div>
                            </div>
                            <div className="w-full bg-slate-100 h-3 rounded-full mb-10 overflow-hidden shadow-inner">
                              <div className="bg-rose-500 h-full transition-all duration-500 ease-out" style={{ width: `${(quizState.currentIndex / content.quiz.length) * 100}%` }}></div>
                            </div>
                          </>
                        )}

                        {quizState.activeMode === 'interactive' ? (
                          (() => {
                            const currentQ = content.quiz[quizState.currentIndex];
                            const uAns = quizState.answers[quizState.currentIndex];
                            const currentVerdict = quizState.verdicts[quizState.currentIndex];
                            const isCurrentCorrect = currentVerdict ? currentVerdict.isCorrect : isAnswerCorrect(uAns, currentQ.dogruCevap);

                            return (
                              <>
                                <div className="mb-10">
                                  <div className="mb-4">
                                    <span className="inline-block px-3 py-1 bg-slate-200 text-slate-700 text-xs rounded-lg uppercase tracking-widest font-bold">
                                      {currentQ.tip.replace('_', ' ')}
                                    </span>
                                  </div>
                                  <h3 className="text-2xl font-bold text-slate-800 mb-8 leading-relaxed">{currentQ.soru}</h3>

                                  <div className="space-y-4">
                                    {currentQ.tip === 'multiple_choice' || currentQ.tip === 'true_false' ? (
                                      currentQ.secenekler.map((secenek, idx) => {
                                        const isSelected = uAns === secenek;
                                        const isOptionCorrect = isAnswerCorrect(secenek, currentQ.dogruCevap);
                                        let btnClass = 'w-full text-left p-5 rounded-2xl border-2 transition-all text-lg ';
                                        if (!quizState.isChecked) {
                                          btnClass += isSelected ? 'border-rose-500 bg-rose-50 text-rose-800 font-bold' : 'border-slate-200 hover:border-rose-400 hover:bg-slate-50 text-slate-700 font-medium';
                                        } else {
                                          if (isOptionCorrect) {
                                            btnClass += 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold';
                                          } else if (isSelected && !isOptionCorrect) {
                                            btnClass += 'border-red-500 bg-red-50 text-red-800 font-bold';
                                          } else {
                                            btnClass += 'border-slate-200 opacity-50 text-slate-500 font-medium';
                                          }
                                        }
                                        return (
                                          <button key={idx} disabled={quizState.isChecked || quizState.isEvaluating} onClick={() => { playSound('select', soundEnabled); setQuizState((p) => ({ ...p, answers: { ...p.answers, [p.currentIndex]: secenek } })); }} className={btnClass}>
                                            <div className="flex items-center justify-between">
                                              <span>{secenek}</span>
                                              {quizState.isChecked && isOptionCorrect && <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />}
                                              {quizState.isChecked && isSelected && !isOptionCorrect && <XIcon size={24} className="text-red-500 shrink-0" />}
                                            </div>
                                          </button>
                                        );
                                      })
                                    ) : currentQ.tip === 'essay' ? (
                                      <textarea
                                        disabled={quizState.isChecked || quizState.isEvaluating}
                                        value={uAns || ''}
                                        onChange={(e) => setQuizState((p) => ({ ...p, answers: { ...p.answers, [p.currentIndex]: e.target.value } }))}
                                        placeholder={t.quizEssayPlaceholder}
                                        className={`w-full h-48 p-6 text-lg rounded-2xl border-2 transition-all focus:ring-4 focus:ring-rose-500/20 resize-none outline-none ${quizState.isChecked ? (isCurrentCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-red-500 bg-red-50 text-red-900') : 'border-slate-300 focus:border-rose-500 bg-slate-50 text-slate-800 font-medium'} ${quizState.isEvaluating ? 'opacity-50' : ''}`}
                                      />
                                    ) : (
                                      <div className="relative">
                                        <input
                                          type="text"
                                          disabled={quizState.isChecked || quizState.isEvaluating}
                                          value={uAns || ''}
                                          onChange={(e) => setQuizState((p) => ({ ...p, answers: { ...p.answers, [p.currentIndex]: e.target.value } }))}
                                          placeholder={t.quizAnswerPlaceholder}
                                          className={`w-full p-6 text-lg rounded-2xl border-2 transition-all focus:ring-4 focus:ring-rose-500/20 outline-none ${quizState.isChecked ? (isCurrentCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold' : 'border-red-500 bg-red-50 text-red-900 font-bold') : 'border-slate-300 focus:border-rose-500 bg-slate-50 text-slate-800 font-medium'} ${quizState.isEvaluating ? 'opacity-50' : ''}`}
                                        />
                                        {quizState.isChecked && isCurrentCorrect && <CheckCircle2 size={28} className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-500" />}
                                        {quizState.isChecked && uAns && !isCurrentCorrect && <XIcon size={28} className="absolute right-6 top-1/2 -translate-y-1/2 text-red-500" />}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {quizState.hintLevel > 0 && !quizState.isChecked && (
                                  <div className="mb-8 space-y-3">
                                    <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3 text-amber-900 text-base animate-in fade-in">
                                      <Lightbulb size={24} className="shrink-0 text-amber-500" />
                                      <p><strong>{t.quizHint1}</strong> {currentQ.ipucu1 || currentQ.ipucu}</p>
                                    </div>
                                    {quizState.hintLevel > 1 && currentQ.ipucu2 && (
                                      <div className="p-5 bg-amber-100 border border-amber-300 rounded-2xl flex gap-3 text-amber-950 text-base animate-in fade-in">
                                        <Lightbulb size={24} className="shrink-0 text-amber-600" />
                                        <p><strong>{t.quizHint2}</strong> {currentQ.ipucu2}</p>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {quizState.isChecked && (
                                  <div className={`mb-8 p-6 rounded-2xl flex gap-4 text-base animate-in fade-in slide-in-from-bottom-2 ${isCurrentCorrect ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-red-50 border border-red-200 text-red-900'}`}>
                                    {isCurrentCorrect ? <CheckCircle2 size={32} className="shrink-0 text-emerald-600" /> : <XIcon size={32} className="shrink-0 text-red-600" />}
                                    <div className="w-full">
                                      <p className="font-extrabold text-lg mb-2">
                                        {isCurrentCorrect ? t.quizCorrect : t.quizWrong}
                                      </p>
                                      {currentVerdict?.feedback ? (
                                        <div className="space-y-3 mt-3">
                                          <div className="bg-white/60 p-4 rounded-xl border border-current/10">
                                            <p className="font-bold mb-1 flex items-center gap-2"><Target size={16} /> {t.quizAiEval}</p>
                                            <p className="leading-relaxed">{currentVerdict.feedback}</p>
                                          </div>
                                          {!isCurrentCorrect && (
                                            <div className="pt-2 border-t border-current/10">
                                              <p className="text-sm opacity-80 font-bold uppercase tracking-wider mb-1">{t.quizExpected}</p>
                                              <p className="font-medium">{currentQ.dogruCevap}</p>
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <p className="leading-relaxed font-medium">{currentQ.aciklama}</p>
                                      )}
                                    </div>
                                  </div>
                                )}

                                <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-slate-100 pt-8 mt-4">
                                  {!quizState.isChecked ? (
                                    <>
                                      <button onClick={() => { playSound('select', soundEnabled); setQuizState((p) => ({ ...p, hintLevel: p.hintLevel + 1 })); }} disabled={quizState.hintLevel >= 2 || quizState.isEvaluating} className="flex items-center justify-center gap-2 px-6 py-3 text-amber-700 font-bold hover:bg-amber-100 rounded-xl transition-colors disabled:opacity-50 text-lg w-full sm:w-auto">
                                        <Lightbulb size={20} /> {t.quizHint(quizState.hintLevel)}
                                      </button>
                                      <button onClick={handleCheckAnswer} disabled={!uAns || uAns.toString().trim() === '' || quizState.isEvaluating} className="flex items-center gap-2 px-8 py-4 bg-rose-600 text-white font-bold text-lg rounded-xl hover:bg-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-rose-600/20 w-full sm:w-auto justify-center">
                                        {quizState.isEvaluating ? <><Loader2 size={20} className="animate-spin" /> {t.quizChecking}</> : <>{t.quizCheckAnswer} <Check size={20} /></>}
                                      </button>
                                    </>
                                  ) : (
                                    <div className="w-full flex justify-end">
                                      {quizState.currentIndex < content.quiz.length - 1 ? (
                                        <button onClick={() => { playSound('select', soundEnabled); setQuizState((p) => ({ ...p, currentIndex: p.currentIndex + 1, isChecked: false, hintLevel: 0, showHint: false })); }} className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold text-lg rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 w-full sm:w-auto justify-center">
                                          {t.quizNextQ} <ChevronRight size={20} />
                                        </button>
                                      ) : (
                                        <button onClick={() => { playSound('finish', soundEnabled); setQuizState((p) => { const newState = { ...p, finished: true }; setContent((prev) => ({ ...prev, quizHistory: [...(prev.quizHistory || []), { quiz: content.quiz, state: newState, config: quizConfig, date: new Date().toISOString() }] })); return newState; }); }} className="flex items-center gap-2 px-10 py-4 bg-emerald-600 text-white font-bold text-lg rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 w-full sm:w-auto justify-center">
                                          {t.quizFinish} <GraduationCap size={20} />
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </>
                            );
                          })()
                        ) : (
                          <div>
                            <div className="mb-8 p-6 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-900 font-medium flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3">
                                <Target size={24} className="mb-2 text-indigo-500 shrink-0 mt-0.5" />
                                <span>{appLang === 'en' ? t.quizMockDesc2 : t.quizMockDesc2}</span>
                              </div>
                              <button
                                onClick={() => { if (window.confirm(t.quizCancelConfirmMock)) { playSound('select', soundEnabled); setWeakAnalysis(null); setQuizState({ activeMode: 'interactive', currentIndex: 0, answers: {}, verdicts: {}, isChecked: false, isEvaluating: false, hintLevel: 0, finished: false }); setContent((prev) => ({ ...prev, quiz: null })); } }}
                                className="shrink-0 text-xs text-indigo-400 hover:text-rose-500 border border-indigo-200 hover:border-rose-300 px-3 py-1.5 rounded-lg transition-colors font-medium"
                              >
                                {t.cancel}
                              </button>
                            </div>

                            {content.quiz.map((q, i) => {
                              const uAns = quizState.answers[i];
                              return (
                                <div key={i} className="mb-8 p-6 md:p-8 bg-slate-50 rounded-3xl border-2 border-slate-200 break-inside-avoid">
                                  <div className="mb-4">
                                    <span className="inline-block px-3 py-1 bg-slate-200 text-slate-700 text-xs rounded-lg uppercase tracking-widest font-bold">{q.tip.replace('_', ' ')}</span>
                                  </div>
                                  <h4 className="font-bold text-xl mb-6 text-slate-800">
                                    <span className="text-slate-400 mr-2">{i + 1}.</span> {q.soru}
                                  </h4>
                                  <div className="space-y-3">
                                    {q.tip === 'multiple_choice' || q.tip === 'true_false' ? (
                                      q.secenekler.map((secenek, idx) => {
                                        const isSelected = uAns === secenek;
                                        return (
                                          <button key={idx} disabled={quizState.isEvaluating} onClick={() => { playSound('select', soundEnabled); setQuizState((p) => ({ ...p, answers: { ...p.answers, [i]: secenek } })); }} className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium ${isSelected ? 'border-rose-500 bg-white text-rose-800 shadow-sm' : 'border-slate-300 hover:border-rose-300 bg-white text-slate-700'}`}>
                                            {secenek}
                                          </button>
                                        );
                                      })
                                    ) : q.tip === 'essay' ? (
                                      <textarea disabled={quizState.isEvaluating} value={uAns || ''} onChange={(e) => setQuizState((p) => ({ ...p, answers: { ...p.answers, [i]: e.target.value } }))} placeholder={t.quizEssayPlaceholderMock} className="w-full h-40 p-5 text-lg rounded-xl border-2 border-slate-300 focus:border-rose-500 bg-white text-slate-800 font-medium transition-all focus:ring-4 focus:ring-rose-500/20 outline-none resize-none" />
                                    ) : (
                                      <input type="text" disabled={quizState.isEvaluating} value={uAns || ''} onChange={(e) => setQuizState((p) => ({ ...p, answers: { ...p.answers, [i]: e.target.value } }))} placeholder={t.quizAnswerPlaceholder} className="w-full p-5 text-lg rounded-xl border-2 border-slate-300 focus:border-rose-500 bg-white text-slate-800 font-medium transition-all focus:ring-4 focus:ring-rose-500/20 outline-none" />
                                    )}
                                  </div>
                                </div>
                              );
                            })}

                            <div className="mt-12 text-center border-t-2 border-slate-200 pt-10">
                              <button onClick={handleMockExamSubmit} disabled={quizState.isEvaluating} className="inline-flex items-center justify-center gap-3 px-12 py-5 bg-rose-600 text-white font-bold text-xl rounded-2xl hover:bg-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-rose-600/20 w-full sm:w-auto">
                                {quizState.isEvaluating ? <><Loader2 size={24} className="animate-spin" /> {t.aiEvaluating}</> : <>{t.mockSubmit} <CheckCircle2 size={24} /></>}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      // SINAV SONUCU
                      <div className="animate-in zoom-in-95 duration-500 max-w-4xl mx-auto">
                        {(() => {
                          const correctCount = content.quiz.filter((q, i) => quizState.verdicts[i]?.isCorrect ?? isAnswerCorrect(quizState.answers[i], q.dogruCevap)).length;
                          const answeredCount = content.quiz.filter((q, i) => quizState.answers[i] && quizState.answers[i].toString().trim() !== '').length;
                          const wrongCount = answeredCount - correctCount;
                          const emptyCount = content.quiz.length - answeredCount;
                          const score = Math.round((correctCount / content.quiz.length) * 100);

                          return (
                            <div>
                              <div className="text-center mb-12">
                                <div className="inline-flex items-center justify-center w-40 h-40 rounded-full border-[10px] border-slate-50 mb-8 bg-white shadow-2xl relative">
                                  <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 36 36">
                                    <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                    <path className={`${score >= 70 ? 'text-emerald-500' : score >= 40 ? 'text-amber-500' : 'text-rose-500'}`} strokeDasharray={`${score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                  </svg>
                                  <span className="text-5xl font-black text-slate-800">{score}</span>
                                </div>
                                <h3 className="text-3xl font-extrabold text-slate-800 mb-2">{t.quizExamDone}</h3>
                                <p className="text-slate-500 text-lg">{t.quizPerfSummary}</p>
                              </div>

                              <div className="grid grid-cols-3 gap-6 mb-12">
                                <div className="bg-emerald-50 border-2 border-emerald-100 p-4 md:p-6 rounded-3xl text-center">
                                  <div className="text-3xl md:text-4xl font-black text-emerald-600 mb-2">{correctCount}</div>
                                  <div className="text-sm md:text-base font-bold text-emerald-800 uppercase tracking-wide">{t.quizCorrectLabel}</div>
                                </div>
                                <div className="bg-rose-50 border-2 border-rose-100 p-4 md:p-6 rounded-3xl text-center">
                                  <div className="text-3xl md:text-4xl font-black text-rose-600 mb-2">{wrongCount}</div>
                                  <div className="text-sm md:text-base font-bold text-rose-800 uppercase tracking-wide">{t.quizWrongLabel}</div>
                                </div>
                                <div className="bg-slate-50 border-2 border-slate-200 p-4 md:p-6 rounded-3xl text-center">
                                  <div className="text-3xl md:text-4xl font-black text-slate-600 mb-2">{emptyCount}</div>
                                  <div className="text-sm md:text-base font-bold text-slate-800 uppercase tracking-wide">{t.quizEmptyLabel}</div>
                                </div>
                              </div>

                              <div className="space-y-6">
                                <h4 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3"><FileText size={24} /> {t.quizDetailTitle}</h4>
                                {content.quiz.map((q, i) => {
                                  const uAnswer = quizState.answers[i];
                                  const verdict = quizState.verdicts[i];
                                  const isCorrect = verdict ? verdict.isCorrect : isAnswerCorrect(uAnswer, q.dogruCevap);
                                  const isEmpty = !uAnswer || uAnswer.toString().trim() === '';
                                  return (
                                    <div key={i} className={`p-6 border-2 rounded-2xl transition-all ${isCorrect ? 'bg-white border-emerald-200 shadow-sm' : 'bg-rose-50/50 border-rose-100'}`}>
                                      <p className="font-bold text-slate-800 mb-4 text-lg leading-relaxed">
                                        <span className="inline-block px-3 py-1 bg-slate-200 text-slate-700 text-xs rounded-lg uppercase mr-3 tracking-widest font-bold">{q.tip.replace('_', ' ')}</span>
                                        {i + 1}. {q.soru}
                                      </p>
                                      <div className="flex flex-col gap-3 text-base">
                                        <div className={`flex items-start gap-3 ${isCorrect ? 'text-emerald-700' : isEmpty ? 'text-slate-500' : 'text-rose-700'}`}>
                                          <div className="mt-1">{isCorrect ? <CheckCircle2 size={20} /> : <XIcon size={20} />}</div>
                                          <div className="flex-1">
                                            <span className="font-black opacity-80 text-xs uppercase tracking-widest block mb-1">{t.quizYourAnswer}</span>
                                            <span className="font-medium whitespace-pre-wrap">{isEmpty ? (appLang === 'en' ? 'Left Blank' : 'Boş Bırakıldı') : uAnswer}</span>
                                          </div>
                                        </div>
                                        {!isCorrect && (
                                          <>
                                            <div className="flex items-start gap-3 text-emerald-700 mt-4 border-t-2 border-slate-200/60 pt-4">
                                              <CheckCircle2 size={20} className="mt-1 shrink-0" />
                                              <div>
                                                <span className="font-black opacity-80 text-xs uppercase tracking-widest block mb-1">{t.quizExpected}</span>
                                                <span className="font-bold text-lg whitespace-pre-wrap">{q.dogruCevap}</span>
                                              </div>
                                            </div>
                                            <div className="mt-5 p-5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-900 text-base">
                                              <span className="font-black flex items-center gap-2 mb-2 uppercase tracking-wide text-xs"><BookOpen size={16} /> {verdict?.feedback ? t.quizAiEval : t.quizAcademic}</span>
                                              {verdict?.feedback || q.aciklama}
                                            </div>
                                          </>
                                        )}
                                        {isCorrect && verdict?.feedback && q.tip !== 'multiple_choice' && q.tip !== 'true_false' && (
                                          <div className="mt-5 p-5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-900 text-base">
                                            <span className="font-black flex items-center gap-2 mb-2 uppercase tracking-wide text-xs"><BookOpen size={16} /> {t.quizAiFeedback}</span>
                                            {verdict.feedback}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button onClick={() => { playSound('select', soundEnabled); setWeakAnalysis(null); setQuizState({ activeMode: quizConfig.examMode, currentIndex: 0, answers: {}, verdicts: {}, isChecked: false, isEvaluating: false, hintLevel: 0, finished: false }); generateContent('quiz'); }} className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-800 text-white font-bold text-lg rounded-2xl hover:bg-slate-900 transition-colors shadow-lg">
                                  <RotateCw size={20} /> {t.quizNewExam}
                                </button>
                                <button onClick={() => { playSound('select', soundEnabled); setWeakAnalysis(null); setQuizState({ activeMode: 'interactive', currentIndex: 0, answers: {}, verdicts: {}, isChecked: false, isEvaluating: false, hintLevel: 0, finished: false }); setContent((prev) => ({ ...prev, quiz: null })); }} className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-slate-300 text-slate-700 font-bold text-lg rounded-2xl hover:bg-slate-50 transition-colors shadow-sm">
                                  <Settings2 size={20} /> {t.quizBackSettings}
                                </button>
                                <button onClick={() => {
                                  if (!window.confirm(t.quizDeleteConfirm)) return;
                                  playSound('select', soundEnabled);
                                  setWeakAnalysis(null);
                                  setContent((prev) => {
                                    const newHistory = prev.quizHistory ? prev.quizHistory.slice(0, -1) : [];
                                    return { ...prev, quiz: null, quizHistory: newHistory };
                                  });
                                  setQuizState({ activeMode: 'interactive', currentIndex: 0, answers: {}, verdicts: {}, isChecked: false, isEvaluating: false, hintLevel: 0, finished: false });
                                }} className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-rose-200 text-rose-600 font-bold text-lg rounded-2xl hover:bg-rose-50 transition-colors shadow-sm">
                                  <Trash2 size={20} /> {t.quizDelete}
                                </button>
                              </div>

                              {/* Zayıf Yönler Analizi */}
                              {content.quizHistory && content.quizHistory.length >= 2 && (
                                <div className="mt-10 border-t-2 border-slate-100 pt-10">
                                  {!weakAnalysis && !loadingAnalysis && (
                                    <button
                                      onClick={async () => {
                                        setLoadingAnalysis(true);
                                        const historyText = content.quizHistory.map((qh, idx) => {
                                          const wrongs = qh.quiz.filter((q, i) => !(qh.state.verdicts[i]?.isCorrect ?? isAnswerCorrect(qh.state.answers[i], q.dogruCevap)));
                                          return `Sınav ${idx + 1} (${qh.config.difficulty}, ${qh.quiz.length} soru):\nYanlış soruların konuları: ${wrongs.map(q => q.soru.slice(0, 80)).join(' | ') || 'Yok'}`;
                                        }).join('\n\n');
                                        const prompt = `Öğrencinin sınav geçmişi:\n${historyText}\n\nBu verilere dayanarak öğrencinin güçlü ve zayıf yönlerini analiz et. Hangi konularda tekrar çalışması gerektiğini somut olarak belirt. 3-4 cümle, Türkçe, samimi bir dille yaz.`;
                                        const result = await callGemini(prompt, 'Sen bir akademik danışmansın. Kısa, net ve motive edici bir analiz yap.', apiKey, null, false, provider);
                                        setWeakAnalysis(result);
                                        setLoadingAnalysis(false);
                                      }}
                                      className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-indigo-50 border-2 border-indigo-200 text-indigo-700 font-bold text-lg rounded-2xl hover:bg-indigo-100 transition-colors"
                                    >
                                      <PieChart size={20} /> {t.quizWeakBtn}
                                    </button>
                                  )}
                                  {loadingAnalysis && (
                                    <div className="flex items-center justify-center gap-3 py-6 text-indigo-600 font-medium">
                                      <Loader2 size={24} className="animate-spin" /> {t.quizAnalyzing}
                                    </div>
                                  )}
                                  {weakAnalysis && (
                                    <div className="p-6 bg-indigo-50 border-2 border-indigo-200 rounded-2xl animate-in fade-in">
                                      <h4 className="font-bold text-indigo-900 flex items-center gap-2 mb-3"><PieChart size={20} /> {t.quizPerfAnalysis}</h4>
                                      <p className="text-indigo-800 leading-relaxed">{weakAnalysis}</p>
                                      <button onClick={() => setWeakAnalysis(null)} className="mt-4 text-sm text-indigo-500 hover:text-indigo-700 underline">{t.quizClose}</button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: PODCAST */}
          {activeTab === 'podcast' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex items-center gap-3 mb-8 px-2">
                <Volume2 size={32} className="text-violet-600" />
                <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">{t.podcast}</h2>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 md:p-10 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
                {!podcastText && !loading.podcast && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-violet-50 dark:bg-violet-900/30 rounded-3xl flex items-center justify-center mx-auto mb-8">
                      <Volume2 size={48} className="text-violet-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
                      {t.podcastTurnInto}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                      {t.podcastSubDesc}
                    </p>
                    <button
                      onClick={generatePodcast}
                      className="inline-flex items-center gap-3 px-10 py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold text-lg rounded-2xl transition-all shadow-lg shadow-violet-600/20"
                    >
                      <Volume2 size={22} /> {t.podcastGenerateBtn}
                    </button>
                  </div>
                )}
                {loading.podcast && (
                  <div className="flex flex-col items-center justify-center py-24 text-violet-600">
                    <Loader2 size={48} className="animate-spin mb-4" />
                    <p className="font-bold text-lg animate-pulse">{t.podcastGenerating}</p>
                  </div>
                )}
                {podcastText && !loading.podcast && (
                  <div>
                    {/* Player */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 p-6 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-700 rounded-2xl">
                      <button
                        onClick={handlePodcastPlay}
                        className={`flex items-center gap-3 px-8 py-4 font-bold text-lg rounded-xl transition-all shadow-md ${podcastPlaying ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-violet-600 hover:bg-violet-700 text-white'}`}
                      >
                        {podcastPlaying ? <><VolumeX size={22} /> {t.podcastStop}</> : <><Volume2 size={22} /> {t.podcastPlay}</>}
                      </button>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">{t.podcastReady}</p>
                      <button
                        onClick={() => { window.speechSynthesis?.cancel(); setPodcastPlaying(false); setPodcastText(''); }}
                        className="ml-auto text-sm text-slate-400 hover:text-rose-500 underline transition-colors"
                      >
                        {t.podcastRegen}
                      </button>
                    </div>
                    {/* Script */}
                    <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-base bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                      {podcastText}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: SOHBET (SORU SOR) */}
          {activeTab === 'chat' && (
            <div className="animate-in fade-in duration-500 flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)]">
              <div className="flex items-center gap-3 mb-6 px-2 shrink-0">
                <MessageSquare size={32} className="text-indigo-600" />
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{t.chatTitle}</h2>
              </div>

              <div className="flex-1 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-slate-50">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`
                          max-w-[85%] md:max-w-[75%] rounded-3xl p-5 shadow-sm text-base
                          ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none font-medium' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}
                        `}
                      >
                        {msg.role === 'model' ? (
                          <div className="prose prose-indigo max-w-none">{renderMarkdown(msg.text)}</div>
                        ) : (
                          <p className="leading-relaxed">{msg.text}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {loading.chat && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-200 text-slate-500 rounded-3xl rounded-tl-none p-5 shadow-sm flex items-center gap-3 font-medium">
                        <Loader2 size={20} className="animate-spin text-indigo-500" />
                        <span>{t.chatTyping}</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-slate-200">
                  <div className="relative flex items-end gap-3">
                    <textarea
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      placeholder={t.chatPlaceholder}
                      className="w-full bg-slate-100 border-none rounded-2xl pl-5 pr-14 py-4 focus:ring-4 focus:ring-indigo-500/20 resize-none min-h-[60px] max-h-[200px] text-lg text-slate-700 font-medium"
                      rows={1}
                    />
                    <button
                      type="submit"
                      disabled={!currentMessage.trim() || loading.chat}
                      className="absolute right-3 bottom-3 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-md shadow-indigo-600/20"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-3 text-center font-medium">{t.chatDisclaimer}</p>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
