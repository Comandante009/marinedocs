import { Pressable, View, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { FileTypeIcon } from './file-type-icon';
import { CategoryBadge } from './category-badge';
import { formatFileSize, formatRelativeDate } from '@/utils/helpers';
import type { Document } from '@/store/types';
import Ionicons from '@expo/vector-icons/Ionicons';

interface DocumentCardProps {
  document: Document;
  onPress?: () => void;
  onLongPress?: () => void;
  compact?: boolean;
}

export function DocumentCard({ document, onPress, onLongPress, compact }: DocumentCardProps) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: pressed ? Colors.cardHover : Colors.card,
        borderRadius: 14,
        borderCurve: 'continuous',
        padding: compact ? 12 : 14,
        gap: 12,
        borderWidth: 1,
        borderColor: Colors.cardBorder,
      })}
    >
      <FileTypeIcon type={document.fileType} size={compact ? 36 : 42} />

      <View style={{ flex: 1, gap: 4 }}>
        <Text
          selectable
          numberOfLines={1}
          style={{
            fontFamily: Fonts.semiBold,
            fontSize: compact ? 14 : 15,
            color: Colors.textPrimary,
          }}
        >
          {document.filename}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <CategoryBadge category={document.category} size="sm" />
          <Text
            style={{
              fontFamily: Fonts.regular,
              fontSize: 12,
              color: Colors.textTertiary,
            }}
          >
            {formatFileSize(document.fileSize)}
          </Text>
        </View>
      </View>

      <View style={{ alignItems: 'flex-end', gap: 4 }}>
        <Text
          style={{
            fontFamily: Fonts.regular,
            fontSize: 12,
            color: Colors.textTertiary,
          }}
        >
          {formatRelativeDate(document.dateAdded)}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
      </View>
    </Pressable>
  );
}
