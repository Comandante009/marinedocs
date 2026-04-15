import { useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, FlatList, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/constants/Strings';
import { QuestionCard } from '@/components/question-card';
import { EmptyState } from '@/components/empty-state';
import type { Question, QuestionBankType } from '@/store/types';

export default function QuestionsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const lang = useAppStore((s) => s.preferences.language);
  const questions = useAppStore((s) => s.questions);
  const isOnline = useAppStore((s) => s.isOnline);
  const performSearch = useAppStore((s) => s.performSearch);

  const [activeTab, setActiveTab] = useState<QuestionBankType>('SIRE');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredQuestions = useMemo(() => {
    let qs = questions.filter((q) => q.bankType === activeTab);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      qs = qs.filter(
        (q) =>
          q.questionNumber.toLowerCase().includes(query) ||
          q.questionText.toLowerCase().includes(query) ||
          q.chapterSection.toLowerCase().includes(query)
      );
    }
    return qs;
  }, [questions, activeTab, searchQuery]);

  const handleFindInDocs = useCallback((question: Question) => {
    // Extract key terms from question
    const terms = question.questionText.split(' ').slice(0, 3).join(' ');
    performSearch(terms);
    router.push('/search');
  }, [performSearch, router]);

  const handleAskAI = useCallback((question: Question) => {
    router.push({
      pathname: '/ai',
      params: { question: question.questionText },
    });
  }, [router]);

  const renderItem = useCallback(({ item }: { item: Question }) => (
    <View style={{ paddingHorizontal: 16, paddingVertical: 4 }}>
      <QuestionCard
        question={item}
        isExpanded={expandedId === item.id}
        onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}
        onFindInDocs={() => handleFindInDocs(item)}
        onAskAI={() => handleAskAI(item)}
        isOnline={isOnline}
      />
    </View>
  ), [expandedId, isOnline, handleFindInDocs, handleAskAI]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Header */}
      <View style={{ paddingTop: insets.top + 12, gap: 14, paddingBottom: 12 }}>
        <View style={{ paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text
            style={{
              fontFamily: Fonts.bold,
              fontSize: 28,
              color: Colors.textPrimary,
              letterSpacing: -0.5,
            }}
          >
            {t('questions', lang)}
          </Text>

          <Pressable
            onPress={() => {
              Alert.alert(
                t('uploadQuestionBank', lang),
                lang === 'en'
                  ? 'Import question banks from JSON, CSV, or PDF formats.'
                  : 'JSON, CSV veya PDF formatlarından soru bankalarını içe aktarın.'
              );
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: Colors.accentDim,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 10,
              borderCurve: 'continuous',
              borderWidth: 1,
              borderColor: Colors.accentBorder,
            }}
          >
            <Ionicons name="cloud-upload-outline" size={16} color={Colors.accent} />
            <Text style={{ fontFamily: Fonts.semiBold, fontSize: 12, color: Colors.accent }}>
              {lang === 'en' ? 'Upload' : 'Yükle'}
            </Text>
          </Pressable>
        </View>

        {/* Tab Switcher */}
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 16,
            backgroundColor: Colors.surface,
            borderRadius: 12,
            borderCurve: 'continuous',
            padding: 4,
            borderWidth: 1,
            borderColor: Colors.cardBorder,
          }}
        >
          {(['SIRE', 'CDI'] as QuestionBankType[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 9,
                  borderCurve: 'continuous',
                  backgroundColor: isActive ? Colors.accent : 'transparent',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: isActive ? Fonts.semiBold : Fonts.medium,
                    fontSize: 14,
                    color: isActive ? '#fff' : Colors.textSecondary,
                  }}
                >
                  {tab === 'SIRE' ? t('sireQuestions', lang) : t('cdiQuestions', lang)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Search */}
        <View style={{ paddingHorizontal: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: Colors.surface,
              borderRadius: 12,
              borderCurve: 'continuous',
              paddingHorizontal: 12,
              borderWidth: 1,
              borderColor: Colors.cardBorder,
              gap: 8,
              minHeight: 44,
            }}
          >
            <Ionicons name="search" size={18} color={Colors.textTertiary} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={lang === 'en' ? 'Search by number or keyword...' : 'Numara veya anahtar kelime ile ara...'}
              placeholderTextColor={Colors.textTertiary}
              autoCapitalize="none"
              style={{
                flex: 1,
                fontFamily: Fonts.regular,
                fontSize: 14,
                color: Colors.textPrimary,
                paddingVertical: 10,
              }}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={Colors.textTertiary} />
              </Pressable>
            )}
          </View>
        </View>
      </View>

      {/* Question List */}
      <FlatList
        data={filteredQuestions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="help-circle-outline"
            title={t('noQuestions', lang)}
            subtitle={
              searchQuery
                ? (lang === 'en' ? 'Try a different search term' : 'Farklı bir arama terimi deneyin')
                : (lang === 'en' ? 'Upload a question bank to get started' : 'Başlamak için bir soru bankası yükleyin')
            }
          />
        }
        ListHeaderComponent={
          filteredQuestions.length > 0 ? (
            <View style={{ paddingHorizontal: 20, paddingVertical: 8 }}>
              <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: Colors.textTertiary }}>
                {filteredQuestions.length} {lang === 'en' ? 'questions' : 'soru'}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
