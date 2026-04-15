import { Pressable, View, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { Question } from '@/store/types';

interface QuestionCardProps {
  question: Question;
  isExpanded?: boolean;
  onPress?: () => void;
  onFindInDocs?: () => void;
  onAskAI?: () => void;
  isOnline?: boolean;
}

export function QuestionCard({
  question,
  isExpanded,
  onPress,
  onFindInDocs,
  onAskAI,
  isOnline,
}: QuestionCardProps) {
  const isSIRE = question.bankType === 'SIRE';
  const badgeColor = isSIRE ? Colors.categorySIRE : Colors.categoryCDI;

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
        borderColor: isExpanded ? Colors.accent + '60' : Colors.cardBorder,
      })}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 6,
            borderCurve: 'continuous',
            backgroundColor: badgeColor + '20',
            borderWidth: 1,
            borderColor: badgeColor + '40',
          }}
        >
          <Text style={{ fontFamily: Fonts.bold, fontSize: 10, color: badgeColor }}>
            {question.questionNumber}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: Fonts.medium,
            fontSize: 11,
            color: Colors.textTertiary,
            flex: 1,
          }}
          numberOfLines={1}
        >
          {question.chapterSection}
        </Text>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={Colors.textTertiary}
        />
      </View>

      {/* Question text */}
      <Text
        selectable
        style={{
          fontFamily: Fonts.regular,
          fontSize: 14,
          color: Colors.textPrimary,
          lineHeight: 21,
        }}
        numberOfLines={isExpanded ? undefined : 2}
      >
        {question.questionText}
      </Text>

      {/* Expanded actions */}
      {isExpanded && (
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
          <Pressable
            onPress={onFindInDocs}
            style={({ pressed }) => ({
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              backgroundColor: pressed ? Colors.accent + '30' : Colors.accentDim,
              paddingVertical: 10,
              borderRadius: 8,
              borderCurve: 'continuous',
              borderWidth: 1,
              borderColor: Colors.accentBorder,
            })}
          >
            <Ionicons name="search" size={14} color={Colors.accent} />
            <Text style={{ fontFamily: Fonts.semiBold, fontSize: 12, color: Colors.accent }}>
              Find in Documents
            </Text>
          </Pressable>

          {isOnline && (
            <Pressable
              onPress={onAskAI}
              style={({ pressed }) => ({
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                backgroundColor: pressed ? Colors.teal + '30' : Colors.tealDim,
                paddingVertical: 10,
                borderRadius: 8,
                borderCurve: 'continuous',
                borderWidth: 1,
                borderColor: Colors.teal + '30',
              })}
            >
              <Ionicons name="sparkles" size={14} color={Colors.teal} />
              <Text style={{ fontFamily: Fonts.semiBold, fontSize: 12, color: Colors.teal }}>
                Ask AI
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </Pressable>
  );
}
