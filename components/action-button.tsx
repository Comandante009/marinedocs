import { Pressable, Text, View } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import Ionicons from '@expo/vector-icons/Ionicons';

interface ActionButtonProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  color?: string;
  onPress?: () => void;
  variant?: 'filled' | 'outlined';
}

export function ActionButton({
  icon,
  label,
  color = Colors.accent,
  onPress,
  variant = 'filled',
}: ActionButtonProps) {
  const isFilled = variant === 'filled';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        backgroundColor: isFilled ? color : color + '15',
        borderRadius: 12,
        borderCurve: 'continuous',
        paddingVertical: 14,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        opacity: pressed ? 0.8 : 1,
        borderWidth: isFilled ? 0 : 1,
        borderColor: color + '40',
        minHeight: 72,
      })}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: isFilled ? 'rgba(255,255,255,0.2)' : color + '20',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon} size={18} color={isFilled ? '#fff' : color} />
      </View>
      <Text
        style={{
          fontFamily: Fonts.semiBold,
          fontSize: 12,
          color: isFilled ? '#fff' : color,
          textAlign: 'center',
          letterSpacing: 0.2,
        }}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}
