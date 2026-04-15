import { useState, useMemo, useCallback } from 'react';
import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/constants/Strings';
import { CategoryFilter } from '@/components/category-filter';
import { DocumentCard } from '@/components/document-card';
import { EmptyState } from '@/components/empty-state';
import type { Document, SortOption } from '@/store/types';

const SORT_OPTIONS: { key: SortOption; labelEn: string; labelTr: string }[] = [
  { key: 'date', labelEn: 'Date', labelTr: 'Tarih' },
  { key: 'name', labelEn: 'Name', labelTr: 'Ad' },
  { key: 'category', labelEn: 'Category', labelTr: 'Kategori' },
  { key: 'size', labelEn: 'Size', labelTr: 'Boyut' },
];

export default function DocumentsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const lang = useAppStore((s) => s.preferences.language);
  const documents = useAppStore((s) => s.documents);
  const removeDocument = useAppStore((s) => s.removeDocument);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState<SortOption>('date');
  const [showSort, setShowSort] = useState(false);

  // Filter and sort
  const filteredDocs = useMemo(() => {
    let docs = [...documents];
    if (selectedCategory !== 'All') {
      docs = docs.filter((d) => d.category === selectedCategory);
    }
    switch (sortOption) {
      case 'name':
        docs.sort((a, b) => a.filename.localeCompare(b.filename));
        break;
      case 'date':
        docs.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
        break;
      case 'category':
        docs.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case 'size':
        docs.sort((a, b) => b.fileSize - a.fileSize);
        break;
    }
    return docs;
  }, [documents, selectedCategory, sortOption]);

  const handleLongPress = useCallback((doc: Document) => {
    Alert.alert(
      doc.filename,
      lang === 'en' ? 'Choose an action' : 'Bir işlem seçin',
      [
        {
          text: lang === 'en' ? 'View' : 'Görüntüle',
          onPress: () => router.push({ pathname: '/viewer', params: { docId: doc.id } }),
        },
        {
          text: lang === 'en' ? 'Delete' : 'Sil',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              lang === 'en' ? 'Delete Document' : 'Belgeyi Sil',
              lang === 'en'
                ? `Are you sure you want to delete "${doc.filename}"?`
                : `"${doc.filename}" belgesini silmek istediğinize emin misiniz?`,
              [
                { text: lang === 'en' ? 'Cancel' : 'İptal', style: 'cancel' },
                {
                  text: lang === 'en' ? 'Delete' : 'Sil',
                  style: 'destructive',
                  onPress: () => removeDocument(doc.id),
                },
              ]
            );
          },
        },
        { text: lang === 'en' ? 'Cancel' : 'İptal', style: 'cancel' },
      ]
    );
  }, [lang, removeDocument, router]);

  const sortLabel = SORT_OPTIONS.find((o) => o.key === sortOption);

  const renderItem = useCallback(({ item }: { item: Document }) => (
    <View style={{ paddingHorizontal: 16, paddingVertical: 4 }}>
      <DocumentCard
        document={item}
        onPress={() => router.push({ pathname: '/viewer', params: { docId: item.id } })}
        onLongPress={() => handleLongPress(item)}
      />
    </View>
  ), [router, handleLongPress]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Header */}
      <View style={{ paddingTop: insets.top + 12, paddingBottom: 12, gap: 14 }}>
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              fontFamily: Fonts.bold,
              fontSize: 28,
              color: Colors.textPrimary,
              letterSpacing: -0.5,
            }}
          >
            {t('documents', lang)}
          </Text>
        </View>

        {/* Category filter */}
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

        {/* Sort */}
        <View style={{ paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable
            onPress={() => setShowSort(!showSort)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Text style={{ fontFamily: Fonts.medium, fontSize: 13, color: Colors.textSecondary }}>
              {t('sortBy', lang)}: {lang === 'en' ? sortLabel?.labelEn : sortLabel?.labelTr}
            </Text>
            <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} />
          </Pressable>

          <Text style={{ fontFamily: Fonts.regular, fontSize: 13, color: Colors.textTertiary }}>
            {filteredDocs.length} {lang === 'en' ? 'documents' : 'belge'}
          </Text>
        </View>

        {/* Sort dropdown */}
        {showSort && (
          <View
            style={{
              marginHorizontal: 20,
              backgroundColor: Colors.card,
              borderRadius: 12,
              borderCurve: 'continuous',
              borderWidth: 1,
              borderColor: Colors.cardBorder,
              overflow: 'hidden',
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <Pressable
                key={opt.key}
                onPress={() => {
                  setSortOption(opt.key);
                  setShowSort(false);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 12,
                  backgroundColor: sortOption === opt.key ? Colors.accentDim : 'transparent',
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.divider,
                }}
              >
                <Text
                  style={{
                    fontFamily: sortOption === opt.key ? Fonts.semiBold : Fonts.regular,
                    fontSize: 14,
                    color: sortOption === opt.key ? Colors.accent : Colors.textPrimary,
                  }}
                >
                  {lang === 'en' ? opt.labelEn : opt.labelTr}
                </Text>
                {sortOption === opt.key && (
                  <Ionicons name="checkmark" size={16} color={Colors.accent} />
                )}
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Document List */}
      <FlatList
        data={filteredDocs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="folder-open"
            title={t('noDocuments', lang)}
            subtitle={t('addFirstDocument', lang)}
          />
        }
      />

      {/* FAB */}
      <Pressable
        style={({ pressed }) => ({
          position: 'absolute',
          bottom: 24,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: 16,
          borderCurve: 'continuous',
          backgroundColor: Colors.accent,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.8 : 1,
          boxShadow: '0 4px 16px rgba(30, 144, 255, 0.4)',
        })}
        onPress={() => {
          Alert.alert(
            lang === 'en' ? 'Upload Document' : 'Belge Yükle',
            lang === 'en'
              ? 'In production, this would open the document picker to select PDF, DOC, or XLS files.'
              : 'Üretimde, PDF, DOC veya XLS dosyalarını seçmek için belge seçici açılır.'
          );
        }}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </View>
  );
}
