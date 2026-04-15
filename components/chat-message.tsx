import { View, Text, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { ChatMessage as ChatMessageType } from '@/store/types';

interface ChatMessageProps {
  message: ChatMessageType;
  onCopy?: () => void;
}

export function ChatMessageBubble({ message, onCopy }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <View
        style={{
          backgroundColor: Colors.surface,
          borderRadius: 12,
          borderCurve: 'continuous',
          padding: 14,
          marginHorizontal: 16,
          borderWidth: 1,
          borderColor: Colors.cardBorder,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Ionicons name="information-circle" size={16} color={Colors.accent} />
          <Text style={{ fontFamily: Fonts.semiBold, fontSize: 12, color: Colors.accent }}>
            System
          </Text>
        </View>
        <Text
          selectable
          style={{
            fontFamily: Fonts.regular,
            fontSize: 14,
            color: Colors.textSecondary,
            lineHeight: 20,
          }}
        >
          {message.content}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        alignItems: isUser ? 'flex-end' : 'flex-start',
        paddingHorizontal: 16,
      }}
    >
      <View
        style={{
          maxWidth: '85%',
          backgroundColor: isUser ? Colors.accent : Colors.card,
          borderRadius: 16,
          borderCurve: 'continuous',
          padding: 14,
          borderWidth: isUser ? 0 : 1,
          borderColor: Colors.cardBorder,
          borderBottomRightRadius: isUser ? 4 : 16,
          borderBottomLeftRadius: isUser ? 16 : 4,
        }}
      >
        <Text
          selectable
          style={{
            fontFamily: Fonts.regular,
            fontSize: 14,
            color: isUser ? '#FFFFFF' : Colors.textPrimary,
            lineHeight: 21,
          }}
        >
          {message.content}
        </Text>

        {/* Source citations */}
        {message.sources && message.sources.length > 0 && (
          <View style={{ marginTop: 10, gap: 4 }}>
            {message.sources.map((source, idx) => (
              <View
                key={idx}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 6,
                  borderCurve: 'continuous',
                }}
              >
                <Ionicons name="document-text-outline" size={12} color={Colors.textSecondary} />
                <Text
                  selectable
                  style={{
                    fontFamily: Fonts.medium,
                    fontSize: 11,
                    color: Colors.textSecondary,
                    flex: 1,
                  }}
                  numberOfLines={1}
                >
                  Source: {source.documentName}, page {source.page}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Copy button for assistant messages */}
      {!isUser && onCopy && (
        <Pressable
          onPress={onCopy}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            paddingHorizontal: 8,
            paddingVertical: 4,
            marginTop: 4,
          }}
        >
          <Ionicons name="copy-outline" size={12} color={Colors.textTertiary} />
          <Text style={{ fontFamily: Fonts.regular, fontSize: 11, color: Colors.textTertiary }}>
            Copy
          </Text>
        </Pressable>
      )}
    </View>
  );
}
