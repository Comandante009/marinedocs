// Bilingual string definitions for DocSearch
export type Language = 'en' | 'tr';

const strings = {
  // App
  appName: { en: 'DocSearch', tr: 'DocSearch' },

  // Navigation
  home: { en: 'Home', tr: 'Ana Sayfa' },
  documents: { en: 'Documents', tr: 'Belgeler' },
  search: { en: 'Search', tr: 'Arama' },
  questions: { en: 'Questions', tr: 'Sorular' },
  aiAssistant: { en: 'AI Assistant', tr: 'AI Asistan' },
  settings: { en: 'Settings', tr: 'Ayarlar' },

  // Home
  totalDocuments: { en: 'Total Documents', tr: 'Toplam Belge' },
  categories: { en: 'Categories', tr: 'Kategoriler' },
  lastSearch: { en: 'Last Search', tr: 'Son Arama' },
  uploadDocument: { en: 'Upload Document', tr: 'Belge Yükle' },
  askAI: { en: 'Ask AI', tr: 'AI\'ya Sor' },
  recentDocuments: { en: 'Recent Documents', tr: 'Son Belgeler' },
  online: { en: 'ONLINE', tr: 'ÇEVRİMİÇİ' },
  offline: { en: 'OFFLINE', tr: 'ÇEVRİMDIŞI' },

  // Documents
  sortBy: { en: 'Sort by', tr: 'Sırala' },
  name: { en: 'Name', tr: 'Ad' },
  date: { en: 'Date', tr: 'Tarih' },
  size: { en: 'Size', tr: 'Boyut' },
  category: { en: 'Category', tr: 'Kategori' },
  noDocuments: { en: 'No documents yet', tr: 'Henüz belge yok' },
  addFirstDocument: { en: 'Upload your first document to get started', tr: 'Başlamak için ilk belgenizi yükleyin' },
  today: { en: 'Today', tr: 'Bugün' },
  yesterday: { en: 'Yesterday', tr: 'Dün' },

  // Search
  searchPlaceholder: { en: 'Search for "pump pressure"...', tr: '"pompa basıncı" arayın...' },
  searchDocuments: { en: 'Search documents...', tr: 'Belgelerde ara...' },
  noResults: { en: 'No results found', tr: 'Sonuç bulunamadı' },
  tryDifferent: { en: 'Try different keywords or check spelling', tr: 'Farklı anahtar kelimeler deneyin' },
  searchHistory: { en: 'Search History', tr: 'Arama Geçmişi' },
  searchTips: { en: 'Search Tips', tr: 'Arama İpuçları' },
  openAtPage: { en: 'Open at page', tr: 'Sayfayı aç' },
  page: { en: 'Page', tr: 'Sayfa' },

  // Questions
  sireQuestions: { en: 'SIRE Questions', tr: 'SIRE Soruları' },
  cdiQuestions: { en: 'CDI Questions', tr: 'CDI Soruları' },
  findInDocuments: { en: 'Find in Documents', tr: 'Belgelerde Bul' },
  questionNumber: { en: 'Question', tr: 'Soru' },
  noQuestions: { en: 'No questions loaded', tr: 'Soru yüklenmedi' },
  uploadQuestionBank: { en: 'Upload Question Bank', tr: 'Soru Bankası Yükle' },

  // AI
  aiOnlineOnly: { en: 'AI Assistant requires an internet connection', tr: 'AI Asistan internet bağlantısı gerektirir' },
  aiWelcome: { en: 'I have access to your uploaded ship documents to answer your questions.', tr: 'Sorularınızı yanıtlamak için yüklenen gemi belgelerinize erişimim var.' },
  typeMessage: { en: 'Type your message...', tr: 'Mesajınızı yazın...' },
  send: { en: 'Send', tr: 'Gönder' },
  source: { en: 'Source', tr: 'Kaynak' },

  // Settings
  language: { en: 'Language', tr: 'Dil' },
  pinLock: { en: 'PIN Lock', tr: 'PIN Kilidi' },
  enablePin: { en: 'Enable PIN', tr: 'PIN Etkinleştir' },
  storage: { en: 'Storage', tr: 'Depolama' },
  storageUsed: { en: 'Storage Used', tr: 'Kullanılan Alan' },
  clearCache: { en: 'Clear Cache', tr: 'Önbelleği Temizle' },
  manageCategories: { en: 'Manage Categories', tr: 'Kategorileri Yönet' },
  about: { en: 'About', tr: 'Hakkında' },
  version: { en: 'Version', tr: 'Sürüm' },
  exportBackup: { en: 'Export / Backup', tr: 'Dışa Aktar / Yedekle' },
} as const;

export type StringKey = keyof typeof strings;

export function t(key: StringKey, lang: Language): string {
  return strings[key]?.[lang] ?? key;
}

export default strings;
