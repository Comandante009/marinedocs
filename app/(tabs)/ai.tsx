import { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/constants/Strings';
import { ChatMessageBubble } from '@/components/chat-message';
import { StatusBadge } from '@/components/status-badge';
import type { ChatMessage, AIProvider } from '@/store/types';
import { generateId } from '@/utils/helpers';
import { useTextGeneration } from '@fastshot/ai';

export default function AIScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ question?: string }>();
  const lang = useAppStore((s) => s.preferences.language);
  const isOnline = useAppStore((s) => s.isOnline);
  const chatMessages = useAppStore((s) => s.chatMessages);
  const addChatMessage = useAppStore((s) => s.addChatMessage);
  const clearChat = useAppStore((s) => s.clearChat);
  const documents = useAppStore((s) => s.documents);
  const aiProvider = useAppStore((s) => s.preferences.aiProvider);
  const setAIProvider = useAppStore((s) => s.setAIProvider);

  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const { generateText, isLoading } = useTextGeneration();

  // Pre-fill from question param
  useEffect(() => {
    if (params.question) {
      setInputText(params.question);
    }
  }, [params.question]);

  // System welcome message
  const allMessages: ChatMessage[] = [
    {
      id: 'system-welcome',
      role: 'system',
      content: t('aiWelcome', lang),
      sources: [],
      timestamp: new Date().toISOString(),
    },
    ...chatMessages,
  ];

  // Build document context for AI
  const buildContext = useCallback(() => {
    const docSummaries = documents.slice(0, 8).map((doc) => {
      const pageTexts = doc.textIndex.pages
        .slice(0, 3)
        .map((p) => `[Page ${p.pageNumber}]: ${p.text}`)
        .join('\n');
      return `Document: ${doc.filename} (${doc.category})\n${pageTexts}`;
    });
    return docSummaries.join('\n\n---\n\n');
  }, [documents]);

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: text,
      sources: [],
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMsg);
    setInputText('');

    // Build prompt with document context
    const docContext = buildContext();
    const prompt = `You are a maritime document assistant. You have access to the following ship documents:\n\n${docContext}\n\nUser question: ${text}\n\nProvide a helpful, accurate answer based on the documents available. If citing a specific document, mention the document name and page number. Keep the response concise and professional.`;

    try {
      const response = await generateText(prompt);

      // Parse potential source citations from response
      const sources: { documentName: string; page: number }[] = [];
      const docMentions = (response as string)?.match(/(?:from|in|see|refer to)\s+([^,.\n]+(?:\.pdf|\.docx|\.xlsx))/gi);
      if (docMentions) {
        docMentions.forEach((mention: string) => {
          const filename = mention.replace(/^(?:from|in|see|refer to)\s+/i, '').trim();
          const doc = documents.find((d) =>
            d.filename.toLowerCase().includes(filename.toLowerCase().replace(/['"]/g, ''))
          );
          if (doc) {
            sources.push({ documentName: doc.filename, page: 1 });
          }
        });
      }

      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: (response as string) || (lang === 'en' ? 'I could not generate a response. Please try again.' : 'Yanıt oluşturamadım. Lütfen tekrar deneyin.'),
        sources,
        timestamp: new Date().toISOString(),
      };
      addChatMessage(assistantMsg);
    } catch {
      const errorMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: lang === 'en'
          ? 'Sorry, I encountered an error processing your request. Please try again.'
          : 'Üzgünüm, isteğinizi işlerken bir hata oluştu. Lütfen tekrar deneyin.',
        sources: [],
        timestamp: new Date().toISOString(),
      };
      addChatMessage(errorMsg);
    }
  }, [inputText, isLoading, addChatMessage, buildContext, generateText, documents, lang]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (allMessages.length > 1) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [allMessages.length]);

  const renderMessage = useCallback(({ item }: { item: ChatMessage }) => (
    <View style={{ marginVertical: 6 }}>
      <ChatMessageBubble message={item} />
    </View>
  ), []);

  // Offline state
  if (!isOnline) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: Colors.warningDim,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}
        >
          <Ionicons name="cloud-offline" size={36} color={Colors.warning} />
        </View>
        <Text
          style={{
            fontFamily: Fonts.semiBold,
            fontSize: 18,
            color: Colors.textPrimary,
            textAlign: 'center',
            marginBottom: 8,
          }}
        >
          {t('aiAssistant', lang)}
        </Text>
        <Text
          style={{
            fontFamily: Fonts.regular,
            fontSize: 14,
            color: Colors.textSecondary,
            textAlign: 'center',
            lineHeight: 21,
          }}
        >
          {t('aiOnlineOnly', lang)}
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior="padding"
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 20,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: Colors.divider,
          gap: 12,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text
              style={{
                fontFamily: Fonts.bold,
                fontSize: 22,
                color: Colors.textPrimary,
                letterSpacing: -0.5,
              }}
            >
              {t('aiAssistant', lang)}
            </Text>
            <StatusBadge />
          </View>

          <Pressable onPress={clearChat}>
            <Ionicons name="trash-outline" size={20} color={Colors.textTertiary} />
          </Pressable>
        </View>

        {/* Provider Toggle */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: Colors.surface,
            borderRadius: 10,
            borderCurve: 'continuous',
            padding: 3,
            borderWidth: 1,
            borderColor: Colors.cardBorder,
            alignSelf: 'flex-start',
          }}
        >
          {([
            { key: 'gpt4' as AIProvider, label: 'GPT-4' },
            { key: 'gemini' as AIProvider, label: 'Gemini' },
          ]).map((opt) => {
            const isActive = aiProvider === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => setAIProvider(opt.key)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                  borderRadius: 7,
                  borderCurve: 'continuous',
                  backgroundColor: isActive ? Colors.accent : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontFamily: isActive ? Fonts.semiBold : Fonts.medium,
                    fontSize: 12,
                    color: isActive ? '#fff' : Colors.textTertiary,
                  }}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={allMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ paddingVertical: 16, paddingBottom: 8 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Loading indicator */}
      {isLoading && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 20,
            paddingVertical: 8,
          }}
        >
          <ActivityIndicator size="small" color={Colors.accent} />
          <Text style={{ fontFamily: Fonts.regular, fontSize: 13, color: Colors.textSecondary }}>
            {lang === 'en' ? 'Thinking...' : 'Düşünüyor...'}
          </Text>
        </View>
      )}

      {/* Input Bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: 10,
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: Math.max(insets.bottom, 12),
          borderTopWidth: 1,
          borderTopColor: Colors.divider,
          backgroundColor: Colors.tabBarBg,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-end',
            backgroundColor: Colors.surface,
            borderRadius: 20,
            borderCurve: 'continuous',
            paddingHorizontal: 14,
            paddingVertical: 4,
            borderWidth: 1,
            borderColor: Colors.cardBorder,
            minHeight: 44,
            maxHeight: 120,
          }}
        >
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder={t('typeMessage', lang)}
            placeholderTextColor={Colors.textTertiary}
            multiline
            style={{
              flex: 1,
              fontFamily: Fonts.regular,
              fontSize: 15,
              color: Colors.textPrimary,
              paddingVertical: 8,
              maxHeight: 100,
            }}
          />
        </View>

        <Pressable
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
          style={({ pressed }) => ({
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: inputText.trim() && !isLoading ? Colors.accent : Colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Ionicons
            name="send"
            size={20}
            color={inputText.trim() && !isLoading ? '#fff' : Colors.textTertiary}
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
