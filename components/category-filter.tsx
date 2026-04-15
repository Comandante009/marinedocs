import { ScrollView, Pressable, Text } from 'react-native';
import { Colors, categoryColors, CATEGORIES } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
  categories?: readonly string[];
}

export function CategoryFilter({ selected, onSelect, categories = CATEGORIES }: CategoryFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
    >
      {categories.map((cat) => {
        const isActive = cat === selected;
        const color = categoryColors[cat] || Colors.accent;
        return (
          <Pressable
            key={cat}
            onPress={() => onSelect(cat)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 10,
              borderCurve: 'continuous',
              backgroundColor: isActive ? color + '25' : Colors.surface,
              borderWidth: 1,
              borderColor: isActive ? color + '60' : Colors.cardBorder,
              minHeight: 36,
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: isActive ? Fonts.semiBold : Fonts.medium,
                fontSize: 13,
                color: isActive ? color : Colors.textSecondary,
              }}
            >
              {cat}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
