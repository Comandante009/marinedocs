/**
 * DocSearch data model types
 */

export type FileType = 'pdf' | 'docx' | 'xlsx';

export interface Document {
  id: string;
  filename: string;
  originalName: string;
  fileType: FileType;
  category: string;
  filePath: string;
  fileSize: number;
  dateAdded: string;
  lastAccessed: string;
  pageCount: number;
  textIndex: SearchIndex;
}

export interface SearchIndex {
  documentId: string;
  pages: Array<{ pageNumber: number; text: string }>;
}

export interface SearchResult {
  documentId: string;
  documentName: string;
  category: string;
  fileType: FileType;
  pageNumber: number;
  snippet: string;
  matchedTerm: string;
}

export type QuestionBankType = 'SIRE' | 'CDI';

export interface Question {
  id: string;
  bankType: QuestionBankType;
  questionNumber: string;
  chapterSection: string;
  questionText: string;
  dateAdded: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  sources: Array<{ documentName: string; page: number }>;
  timestamp: string;
}

export type AIProvider = 'gpt4' | 'gemini';

export interface Preferences {
  language: 'en' | 'tr';
  pinEnabled: boolean;
  pinHash: string;
  aiProvider: AIProvider;
}

export type SortOption = 'name' | 'date' | 'category' | 'size';
