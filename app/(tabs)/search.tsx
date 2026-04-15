import { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/constants/Strings';
import { SearchResultCard } from '@/components/search-result-card';
import { EmptyState } from '@/components/empty-state';
import type { SearchResult } from '@/store/types';

const SEARCH_CATEGORIES = ['All', 'Engine', 'Safety', 'ISM', 'Navigation', 'SIRE', 'CDI', 'Certificates'] as const;

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const lang = useAppStore((s) => s.preferences.language);
  const searchResults = useAppStore((s) => s.searchResults);
  const performSearch = useAppStore((s) => s.performSearch);
  const searchHistory = useAppStore((s) => s.searchHistory);
  const addSearchHistory = useAppStore((s) => s.addSearchHistory);
  const clearSearchHistory = useAppStore((s) => s.clearSearchHistory);

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const inputRef = useRef<TextInput>(null);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      performSearch('');
      setHasSearched(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      performSearch(query, selectedCategory);
      setHasSearched(true);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, selectedCategory, performSearch]);

  const handleSubmit = useCallback(() => {
    if (query.trim()) {
      addSearchHistory(query.trim());
      performSearch(query, selectedCategory);
      setHasSearched(true);
    }
  }, [query, selectedCategory, addSearchHistory, performSearch]);

  const handleHistoryTap = useCallback((historyQuery: string) => {
    setQuery(historyQuery);
    performSearch(historyQuery, selectedCategory);
    setHasSearched(true);
  }, [selectedCategory, performSearch]);

  const renderResult = useCallback(({ item }: { item: SearchResult }) => (
    <View style={{ paddingHorizontal: 16, paddingVertical: 4 }}>
      <SearchResultCard
        result={item}
        onPress={() =>
          router.push({
            pathname: '/viewer',
            params: { docId: item.documentId, page: item.pageNumber.toString() },
          })
        }
      />
    </View>
  ), [router]);

  // Show search history when no query
  const showHistory = !query.trim() && !hasSearched;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Header */}
      <View style={{ paddingTop: insets.top + 12, gap: 14, paddingBottom: 12 }}>
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              fontFamily: Fonts.bold,
              fontSize: 28,
              color: Colors.textPrimary,
              letterSpacing: -0.5,
            }}
          >
            {t('search', lang)}
          </Text>
        </View>

        {/* Search Input */}
        <View style={{ paddingHorizontal: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: Colors.surface,
              borderRadius: 14,
              borderCurve: 'continuous',
              paddingHorizontal: 14,
              borderWidth: 1.5,
              borderColor: query ? Colors.accent + '60' : Colors.cardBorder,
              gap: 10,
              minHeight: 50,
            }}
          >
            <Ionicons name="search" size={20} color={query ? Colors.accent : Colors.textTertiary} />
            <TextInput
              ref={inputRef}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSubmit}
              placeholder={t('searchPlaceholder', lang)}
              placeholderTextColor={Colors.textTertiary}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
              style={{
                flex: 1,
                fontFamily: Fonts.regular,
                fontSize: 15,
                color: Colors.textPrimary,
                paddingVertical: 12,
              }}
            />
            {query.length > 0 && (
              <Pressable onPress={() => { setQuery(''); setHasSearched(false); }}>
                <Ionicons name="close-circle" size={20} color={Colors.textTertiary} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        >
          {SEARCH_CATEGORIES.map((cat) => {
            const isActive = cat === selectedCategory;
            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                  borderRadius: 20,
                  borderCurve: 'continuous',
                  backgroundColor: isActive ? Colors.accent + '20' : Colors.surface,
                  borderWidth: 1,
                  borderColor: isActive ? Colors.accent + '50' : Colors.cardBorder,
                }}
              >
                <Text
                  style={{
                    fontFamily: isActive ? Fonts.semiBold : Fonts.medium,
                    fontSize: 13,
                    color: isActive ? Colors.accent : Colors.textSecondary,
                  }}
                >
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Results or History */}
      {showHistory ? (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Search History */}
          {searchHistory.length > 0 && (
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontFamily: Fonts.semiBold, fontSize: 15, color: Colors.textPrimary }}>
                  {t('searchHistory', lang)}
                </Text>
                <Pressable onPress={clearSearchHistory}>
                  <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: Colors.accent }}>
                    {lang === 'en' ? 'Clear' : 'Temizle'}
                  </Text>
                </Pressable>
              </View>
              {searchHistory.map((h, i) => (
                <Pressable
                  key={i}
                  onPress={() => handleHistoryTap(h)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    paddingVertical: 8,
                  }}
                >
                  <Ionicons name="time-outline" size={18} color={Colors.textTertiary} />
                  <Text style={{ fontFamily: Fonts.regular, fontSize: 14, color: Colors.textSecondary, flex: 1 }}>
                    {h}
                  </Text>
                  <Ionicons name="arrow-forward" size={14} color={Colors.textTertiary} />
                </Pressable>
              ))}
            </View>
          )}

          {/* Search Tips */}
          <View style={{ marginTop: 32, gap: 12 }}>
            <Text style={{ fontFamily: Fonts.semiBold, fontSize: 15, color: Colors.textPrimary }}>
              {t('searchTips', lang)}
            </Text>
            {[
              { icon: 'bulb-outline' as const, text: lang === 'en' ? 'Search by keyword, equipment name, or procedure' : 'Anahtar kelime, ekipman adı veya prosedür ile arayın' },
              { icon: 'document-text-outline' as const, text: lang === 'en' ? 'Results show the exact page and context' : 'Sonuçlar tam sayfa ve bağlamı gösterir' },
              { icon: 'funnel-outline' as const, text: lang === 'en' ? 'Use category chips to narrow results' : 'Sonuçları daraltmak için kategori çiplerini kullanın' },
              { icon: 'wifi-outline' as const, text: lang === 'en' ? 'Search works fully offline' : 'Arama tamamen çevrimdışı çalışır' },
            ].map((tip, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                <Ionicons name={tip.icon} size={18} color={Colors.accent} style={{ marginTop: 2 }} />
                <Text style={{ fontFamily: Fonts.regular, fontSize: 13, color: Colors.textSecondary, flex: 1, lineHeight: 19 }}>
                  {tip.text}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(_, i) => i.toString()}
          renderItem={renderResult}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            hasSearched ? (
              <EmptyState
                icon="search"
                title={t('noResults', lang)}
                subtitle={t('tryDifferent', lang)}
                color={Colors.accent}
              />
            ) : null
          }
          ListHeaderComponent={
            searchResults.length > 0 ? (
              <View style={{ paddingHorizontal: 20, paddingVertical: 8 }}>
                <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: Colors.textTertiary }}>
                  {searchResults.length} {lang === 'en' ? 'results found' : 'sonuç bulundu'}
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}
