import { View, Text } from 'react-native';
import { Colors, categoryColors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';

interface CategoryBadgeProps {
  category: string;
  size?: 'sm' | 'md';
}

export function CategoryBadge({ category, size = 'sm' }: CategoryBadgeProps) {
  const color = categoryColors[category] || Colors.accent;
  const isSmall = size === 'sm';

  return (
    <View
      style={{
        paddingHorizontal: isSmall ? 8 : 10,
        paddingVertical: isSmall ? 2 : 4,
        borderRadius: 6,
        borderCurve: 'continuous',
        backgroundColor: color + '20',
        borderWidth: 1,
        borderColor: color + '40',
      }}
    >
      <Text
        style={{
          fontFamily: Fonts.semiBold,
          fontSize: isSmall ? 10 : 12,
          color,
          letterSpacing: 0.3,
        }}
      >
        {category}
      </Text>
    </View>
  );
}
