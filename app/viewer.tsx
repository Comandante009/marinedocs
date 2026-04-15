import { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { useAppStore } from '@/store/useAppStore';
import { CategoryBadge } from '@/components/category-badge';
import { formatFileSize } from '@/utils/helpers';

export default function ViewerScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ docId: string; page?: string }>();
  const documents = useAppStore((s) => s.documents);
  const accessDocument = useAppStore((s) => s.accessDocument);
  const lang = useAppStore((s) => s.preferences.language);

  const document = useMemo(() => {
    const doc = documents.find((d) => d.id === params.docId);
    if (doc) accessDocument(doc.id);
    return doc;
  }, [params.docId, documents, accessDocument]);

  const [currentPage, setCurrentPage] = useState(
    params.page ? parseInt(params.page, 10) : 1
  );
  const [zoom, setZoom] = useState(1);
  const [searchInDoc, setSearchInDoc] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const pageContent = document?.textIndex.pages.find((p) => p.pageNumber === currentPage);
  const allPageNumbers = document?.textIndex.pages.map((p) => p.pageNumber).sort((a, b) => a - b) ?? [];
  const currentIdx = allPageNumbers.indexOf(currentPage);

  // Search highlight
  const highlightedContent = useMemo(() => {
    if (!pageContent?.text || !searchInDoc.trim()) return null;
    const text = pageContent.text;
    const term = searchInDoc.toLowerCase();
    const idx = text.toLowerCase().indexOf(term);
    if (idx === -1) return null;
    return {
      before: text.substring(0, idx),
      match: text.substring(idx, idx + searchInDoc.length),
      after: text.substring(idx + searchInDoc.length),
    };
  }, [pageContent, searchInDoc]);

  if (!document) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.background,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        <Ionicons name="alert-circle" size={48} color={Colors.warning} />
        <Text style={{ fontFamily: Fonts.semiBold, fontSize: 17, color: Colors.textPrimary }}>
          {lang === 'en' ? 'Document not found' : 'Belge bulunamadı'}
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={{
            backgroundColor: Colors.accent,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
            borderCurve: 'continuous',
          }}
        >
          <Text style={{ fontFamily: Fonts.semiBold, fontSize: 14, color: '#fff' }}>
            {lang === 'en' ? 'Go Back' : 'Geri Dön'}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      {/* Top Bar */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 16,
          paddingBottom: 12,
          backgroundColor: Colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: Colors.divider,
          gap: 10,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: Colors.card,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="close" size={20} color={Colors.textPrimary} />
          </Pressable>

          <View style={{ flex: 1, gap: 2 }}>
            <Text
              numberOfLines={1}
              style={{ fontFamily: Fonts.semiBold, fontSize: 15, color: Colors.textPrimary }}
            >
              {document.filename}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <CategoryBadge category={document.category} size="sm" />
              <Text style={{ fontFamily: Fonts.regular, fontSize: 11, color: Colors.textTertiary }}>
                {formatFileSize(document.fileSize)}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => setShowSearch(!showSearch)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: showSearch ? Colors.accentDim : Colors.card,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="search" size={18} color={showSearch ? Colors.accent : Colors.textPrimary} />
          </Pressable>
        </View>

        {/* Page indicator */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <Text
            style={{
              fontFamily: Fonts.medium,
              fontSize: 13,
              color: Colors.textSecondary,
              fontVariant: ['tabular-nums'],
            }}
          >
            {lang === 'en' ? 'Page' : 'Sayfa'} {currentPage} / {document.pageCount}
          </Text>
        </View>

        {/* Search within document */}
        {showSearch && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: Colors.card,
              borderRadius: 10,
              borderCurve: 'continuous',
              paddingHorizontal: 10,
              borderWidth: 1,
              borderColor: Colors.cardBorder,
              gap: 8,
            }}
          >
            <Ionicons name="search" size={16} color={Colors.textTertiary} />
            <TextInput
              value={searchInDoc}
              onChangeText={setSearchInDoc}
              placeholder={lang === 'en' ? 'Search in document...' : 'Belgede ara...'}
              placeholderTextColor={Colors.textTertiary}
              autoFocus
              style={{
                flex: 1,
                fontFamily: Fonts.regular,
                fontSize: 14,
                color: Colors.textPrimary,
                paddingVertical: 8,
              }}
            />
          </View>
        )}
      </View>

      {/* Document Content Area */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Simulated document page */}
        <View
          style={{
            backgroundColor: Colors.card,
            borderRadius: 16,
            borderCurve: 'continuous',
            padding: 24,
            minHeight: 400,
            borderWidth: 1,
            borderColor: Colors.cardBorder,
            transform: [{ scale: zoom }],
          }}
        >
          {/* Page header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: Colors.divider,
              marginBottom: 20,
            }}
          >
            <Text style={{ fontFamily: Fonts.semiBold, fontSize: 11, color: Colors.textTertiary, letterSpacing: 0.5 }}>
              {document.filename.toUpperCase()}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.medium,
                fontSize: 11,
                color: Colors.textTertiary,
                fontVariant: ['tabular-nums'],
              }}
            >
              {currentPage}
            </Text>
          </View>

          {/* Page content */}
          {pageContent ? (
            highlightedContent ? (
              <Text
                selectable
                style={{
                  fontFamily: Fonts.regular,
                  fontSize: 15,
                  color: Colors.textPrimary,
                  lineHeight: 24,
                }}
              >
                {highlightedContent.before}
                <Text
                  style={{
                    fontFamily: Fonts.bold,
                    color: Colors.accent,
                    backgroundColor: Colors.accentDim,
                  }}
                >
                  {highlightedContent.match}
                </Text>
                {highlightedContent.after}
              </Text>
            ) : (
              <Text
                selectable
                style={{
                  fontFamily: Fonts.regular,
                  fontSize: 15,
                  color: Colors.textPrimary,
                  lineHeight: 24,
                }}
              >
                {pageContent.text}
              </Text>
            )
          ) : (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
              <Ionicons name="document-text-outline" size={48} color={Colors.textTertiary} />
              <Text
                style={{
                  fontFamily: Fonts.regular,
                  fontSize: 14,
                  color: Colors.textTertiary,
                  marginTop: 12,
                  textAlign: 'center',
                }}
              >
                {lang === 'en'
                  ? 'Content for this page is not indexed.\nIn production, the full document would render here.'
                  : 'Bu sayfa için içerik dizinlenmemiş.\nÜretimde, tam belge burada oluşturulur.'}
              </Text>
            </View>
          )}
        </View>

        {/* Page navigation thumbnails */}
        <View style={{ marginTop: 20, gap: 8 }}>
          <Text style={{ fontFamily: Fonts.semiBold, fontSize: 13, color: Colors.textSecondary }}>
            {lang === 'en' ? 'Indexed Pages' : 'Dizinlenmiş Sayfalar'}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {document.textIndex.pages.map((page) => (
              <Pressable
                key={page.pageNumber}
                onPress={() => setCurrentPage(page.pageNumber)}
                style={{
                  width: 60,
                  height: 72,
                  borderRadius: 8,
                  borderCurve: 'continuous',
                  backgroundColor: currentPage === page.pageNumber ? Colors.accentDim : Colors.card,
                  borderWidth: 1.5,
                  borderColor: currentPage === page.pageNumber ? Colors.accent : Colors.cardBorder,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: Fonts.semiBold,
                    fontSize: 14,
                    color: currentPage === page.pageNumber ? Colors.accent : Colors.textSecondary,
                    fontVariant: ['tabular-nums'],
                  }}
                >
                  {page.pageNumber}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Controls */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: Math.max(insets.bottom, 12),
          paddingTop: 12,
          paddingHorizontal: 20,
          backgroundColor: Colors.tabBarBg,
          borderTopWidth: 1,
          borderTopColor: Colors.divider,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Prev/Next */}
        <Pressable
          onPress={() => {
            if (currentIdx > 0) setCurrentPage(allPageNumbers[currentIdx - 1]);
          }}
          disabled={currentIdx <= 0}
          style={({ pressed }) => ({
            width: 44,
            height: 44,
            borderRadius: 12,
            borderCurve: 'continuous',
            backgroundColor: Colors.card,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: currentIdx <= 0 ? 0.4 : pressed ? 0.7 : 1,
            borderWidth: 1,
            borderColor: Colors.cardBorder,
          })}
        >
          <Ionicons name="chevron-back" size={20} color={Colors.textPrimary} />
        </Pressable>

        {/* Zoom controls */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable
            onPress={() => setZoom(Math.max(0.5, zoom - 0.1))}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              borderCurve: 'continuous',
              backgroundColor: Colors.card,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: Colors.cardBorder,
            }}
          >
            <Ionicons name="remove" size={20} color={Colors.textPrimary} />
          </Pressable>
          <View
            style={{
              paddingHorizontal: 14,
              height: 44,
              borderRadius: 12,
              borderCurve: 'continuous',
              backgroundColor: Colors.card,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: Colors.cardBorder,
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.semiBold,
                fontSize: 13,
                color: Colors.textPrimary,
                fontVariant: ['tabular-nums'],
              }}
            >
              {Math.round(zoom * 100)}%
            </Text>
          </View>
          <Pressable
            onPress={() => setZoom(Math.min(2, zoom + 0.1))}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              borderCurve: 'continuous',
              backgroundColor: Colors.card,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: Colors.cardBorder,
            }}
          >
            <Ionicons name="add" size={20} color={Colors.textPrimary} />
          </Pressable>
        </View>

        {/* Next */}
        <Pressable
          onPress={() => {
            if (currentIdx < allPageNumbers.length - 1) setCurrentPage(allPageNumbers[currentIdx + 1]);
          }}
          disabled={currentIdx >= allPageNumbers.length - 1}
          style={({ pressed }) => ({
            width: 44,
            height: 44,
            borderRadius: 12,
            borderCurve: 'continuous',
            backgroundColor: Colors.card,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: currentIdx >= allPageNumbers.length - 1 ? 0.4 : pressed ? 0.7 : 1,
            borderWidth: 1,
            borderColor: Colors.cardBorder,
          })}
        >
          <Ionicons name="chevron-forward" size={20} color={Colors.textPrimary} />
        </Pressable>
      </View>
    </View>
  );
}
