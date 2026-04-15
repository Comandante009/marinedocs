import { ScrollView, View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/constants/Strings';
import { StatCard } from '@/components/stat-card';
import { ActionButton } from '@/components/action-button';
import { DocumentCard } from '@/components/document-card';
import { StatusBadge } from '@/components/status-badge';
import { formatNumber } from '@/utils/helpers';
import { useMemo } from 'react';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const lang = useAppStore((s) => s.preferences.language);
  const documents = useAppStore((s) => s.documents);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const searchHistory = useAppStore((s) => s.searchHistory);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(documents.map((d) => d.category));
    return cats.size;
  }, [documents]);

  // Recent documents (last 5 accessed)
  const recentDocs = useMemo(() => {
    return [...documents]
      .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())
      .slice(0, 5);
  }, [documents]);

  const lastSearch = searchHistory[0] || '—';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.background }}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 20,
          paddingBottom: 20,
          gap: 16,
        }}
      >
        {/* Top bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                borderCurve: 'continuous',
                backgroundColor: Colors.accentDim,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: Colors.accentBorder,
              }}
            >
              <Ionicons name="boat" size={18} color={Colors.accent} />
            </View>
            <Text
              style={{
                fontFamily: Fonts.bold,
                fontSize: 22,
                color: Colors.textPrimary,
                letterSpacing: -0.5,
              }}
            >
              DocSearch
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {/* Language toggle */}
            <Pressable
              onPress={() => setLanguage(lang === 'en' ? 'tr' : 'en')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                backgroundColor: Colors.surface,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 8,
                borderCurve: 'continuous',
                borderWidth: 1,
                borderColor: Colors.cardBorder,
              }}
            >
              <Text
                style={{
                  fontFamily: lang === 'tr' ? Fonts.bold : Fonts.regular,
                  fontSize: 12,
                  color: lang === 'tr' ? Colors.accent : Colors.textTertiary,
                }}
              >
                TR
              </Text>
              <Text style={{ fontFamily: Fonts.regular, fontSize: 12, color: Colors.textTertiary }}>|</Text>
              <Text
                style={{
                  fontFamily: lang === 'en' ? Fonts.bold : Fonts.regular,
                  fontSize: 12,
                  color: lang === 'en' ? Colors.accent : Colors.textTertiary,
                }}
              >
                EN
              </Text>
            </Pressable>

            <StatusBadge />
          </View>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <StatCard
            icon="documents"
            value={formatNumber(documents.length)}
            label={t('totalDocuments', lang)}
            color={Colors.accent}
          />
          <StatCard
            icon="grid"
            value={categories}
            label={t('categories', lang)}
            color={Colors.teal}
          />
          <StatCard
            icon="search"
            value={`"${lastSearch}"`}
            label={t('lastSearch', lang)}
            color={Colors.warning}
          />
        </View>

        {/* Quick Actions */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <ActionButton
            icon="cloud-upload"
            label={t('uploadDocument', lang)}
            color={Colors.accent}
            variant="filled"
            onPress={() => router.push('/documents')}
          />
          <ActionButton
            icon="search"
            label={t('search', lang)}
            color={Colors.teal}
            variant="filled"
            onPress={() => router.push('/search')}
          />
          <ActionButton
            icon="sparkles"
            label={t('askAI', lang)}
            color="#9B59B6"
            variant="filled"
            onPress={() => router.push('/ai')}
          />
        </View>
      </View>

      {/* Recent Documents */}
      <View style={{ gap: 12, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text
            style={{
              fontFamily: Fonts.semiBold,
              fontSize: 17,
              color: Colors.textPrimary,
            }}
          >
            {t('recentDocuments', lang)}
          </Text>
          <Pressable onPress={() => router.push('/documents')}>
            <Text
              style={{
                fontFamily: Fonts.medium,
                fontSize: 13,
                color: Colors.accent,
              }}
            >
              {lang === 'en' ? 'See All' : 'Tümünü Gör'}
            </Text>
          </Pressable>
        </View>

        <View style={{ gap: 8 }}>
          {recentDocs.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              compact
              onPress={() => {
                router.push({ pathname: '/viewer', params: { docId: doc.id } });
              }}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
