import { Pressable, View, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { FileTypeIcon } from './file-type-icon';
import { CategoryBadge } from './category-badge';
import type { SearchResult } from '@/store/types';

interface SearchResultCardProps {
  result: SearchResult;
  onPress?: () => void;
}

export function SearchResultCard({ result, onPress }: SearchResultCardProps) {
  // Highlight matched term in snippet
  const renderSnippet = () => {
    const lower = result.snippet.toLowerCase();
    const termLower = result.matchedTerm.toLowerCase();
    const idx = lower.indexOf(termLower);

    if (idx === -1) {
      return (
        <Text style={{ fontFamily: Fonts.regular, fontSize: 13, color: Colors.textSecondary, lineHeight: 20 }}>
          {result.snippet}
        </Text>
      );
    }

    const before = result.snippet.substring(0, idx);
    const match = result.snippet.substring(idx, idx + result.matchedTerm.length);
    const after = result.snippet.substring(idx + result.matchedTerm.length);

    return (
      <Text style={{ fontFamily: Fonts.regular, fontSize: 13, color: Colors.textSecondary, lineHeight: 20 }}>
        {before}
        <Text style={{ fontFamily: Fonts.bold, color: Colors.accent, backgroundColor: Colors.accentDim }}>
          {match}
        </Text>
        {after}
      </Text>
    );
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? Colors.cardHover : Colors.card,
        borderRadius: 14,
        borderCurve: 'continuous',
        padding: 14,
        gap: 10,
        borderWidth: 1,
        borderColor: Colors.cardBorder,
      })}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <FileTypeIcon type={result.fileType} size={32} />
        <View style={{ flex: 1, gap: 4 }}>
          <Text
            selectable
            numberOfLines={1}
            style={{
              fontFamily: Fonts.semiBold,
              fontSize: 14,
              color: Colors.textPrimary,
            }}
          >
            {result.documentName}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <CategoryBadge category={result.category} size="sm" />
            <Text style={{ fontFamily: Fonts.medium, fontSize: 11, color: Colors.textTertiary }}>
              Page {result.pageNumber}
            </Text>
          </View>
        </View>
      </View>

      {/* Snippet */}
      <View style={{
        backgroundColor: Colors.surface,
        borderRadius: 8,
        borderCurve: 'continuous',
        padding: 10,
        borderLeftWidth: 3,
        borderLeftColor: Colors.accent,
      }}>
        {renderSnippet()}
      </View>

      {/* Open at page link */}
      <Pressable
        onPress={onPress}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
      >
        <Text
          style={{
            fontFamily: Fonts.semiBold,
            fontSize: 13,
            color: Colors.accent,
          }}
        >
          Open at page {result.pageNumber}
        </Text>
      </Pressable>
    </Pressable>
  );
}
