import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  Document,
  Question,
  ChatMessage,
  Preferences,
  SearchResult,
  SortOption,
} from './types';
import { seedDocuments, seedQuestions } from './seed-data';

interface AppState {
  // Preferences
  preferences: Preferences;
  setLanguage: (lang: 'en' | 'tr') => void;
  setPinEnabled: (enabled: boolean) => void;
  setPinHash: (hash: string) => void;
  setAIProvider: (provider: 'gpt4' | 'gemini') => void;

  // Documents
  documents: Document[];
  addDocument: (doc: Document) => void;
  removeDocument: (id: string) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  accessDocument: (id: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchHistory: string[];
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  searchResults: SearchResult[];
  performSearch: (query: string, categoryFilter?: string) => void;

  // Questions
  questions: Question[];
  addQuestions: (questions: Question[]) => void;
  removeQuestion: (id: string) => void;

  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;

  // UI State
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  sortOption: SortOption;
  setSortOption: (opt: SortOption) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Preferences
      preferences: {
        language: 'en',
        pinEnabled: false,
        pinHash: '',
        aiProvider: 'gpt4',
      },
      setLanguage: (lang) =>
        set((s) => ({ preferences: { ...s.preferences, language: lang } })),
      setPinEnabled: (enabled) =>
        set((s) => ({ preferences: { ...s.preferences, pinEnabled: enabled } })),
      setPinHash: (hash) =>
        set((s) => ({ preferences: { ...s.preferences, pinHash: hash } })),
      setAIProvider: (provider) =>
        set((s) => ({ preferences: { ...s.preferences, aiProvider: provider } })),

      // Documents
      documents: seedDocuments,
      addDocument: (doc) =>
        set((s) => ({ documents: [doc, ...s.documents] })),
      removeDocument: (id) =>
        set((s) => ({ documents: s.documents.filter((d) => d.id !== id) })),
      updateDocument: (id, updates) =>
        set((s) => ({
          documents: s.documents.map((d) =>
            d.id === id ? { ...d, ...updates } : d
          ),
        })),
      accessDocument: (id) =>
        set((s) => ({
          documents: s.documents.map((d) =>
            d.id === id ? { ...d, lastAccessed: new Date().toISOString() } : d
          ),
        })),

      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      searchHistory: ['safety drill', 'pump pressure', 'fire extinguisher', 'MARPOL', 'ISM code'],
      addSearchHistory: (query) =>
        set((s) => {
          const filtered = s.searchHistory.filter((q) => q !== query);
          return { searchHistory: [query, ...filtered].slice(0, 10) };
        }),
      clearSearchHistory: () => set({ searchHistory: [] }),
      searchResults: [],
      performSearch: (query, categoryFilter) => {
        if (!query.trim()) {
          set({ searchResults: [] });
          return;
        }
        const docs = get().documents;
        const results: SearchResult[] = [];
        const q = query.toLowerCase();

        for (const doc of docs) {
          if (categoryFilter && categoryFilter !== 'All' && doc.category !== categoryFilter) continue;

          for (const page of doc.textIndex.pages) {
            const idx = page.text.toLowerCase().indexOf(q);
            if (idx !== -1) {
              const start = Math.max(0, idx - 60);
              const end = Math.min(page.text.length, idx + q.length + 60);
              let snippet = page.text.substring(start, end);
              if (start > 0) snippet = '...' + snippet;
              if (end < page.text.length) snippet = snippet + '...';

              results.push({
                documentId: doc.id,
                documentName: doc.filename,
                category: doc.category,
                fileType: doc.fileType,
                pageNumber: page.pageNumber,
                snippet,
                matchedTerm: query,
              });
            }
          }
        }
        set({ searchResults: results });
      },

      // Questions
      questions: seedQuestions,
      addQuestions: (newQuestions) =>
        set((s) => ({ questions: [...s.questions, ...newQuestions] })),
      removeQuestion: (id) =>
        set((s) => ({ questions: s.questions.filter((q) => q.id !== id) })),

      // Chat
      chatMessages: [],
      addChatMessage: (msg) =>
        set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
      clearChat: () => set({ chatMessages: [] }),

      // UI State
      isOnline: true,
      setIsOnline: (online) => set({ isOnline: online }),
      selectedCategory: 'All',
      setSelectedCategory: (cat) => set({ selectedCategory: cat }),
      sortOption: 'date',
      setSortOption: (opt) => set({ sortOption: opt }),
    }),
    {
      name: 'docsearch-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        preferences: state.preferences,
        documents: state.documents,
        questions: state.questions,
        searchHistory: state.searchHistory,
        chatMessages: state.chatMessages,
      }),
    }
  )
);

export type AppStore = AppState;
