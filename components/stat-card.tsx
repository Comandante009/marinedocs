import { View, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import Ionicons from '@expo/vector-icons/Ionicons';

interface StatCardProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  value: string | number;
  label: string;
  color?: string;
}

export function StatCard({ icon, value, label, color = Colors.accent }: StatCardProps) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.card,
        borderRadius: 14,
        borderCurve: 'continuous',
        padding: 14,
        gap: 8,
        borderWidth: 1,
        borderColor: Colors.cardBorder,
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          borderCurve: 'continuous',
          backgroundColor: color + '20',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <Text
        selectable
        style={{
          fontFamily: Fonts.bold,
          fontSize: 20,
          color: Colors.textPrimary,
          fontVariant: ['tabular-nums'],
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontFamily: Fonts.medium,
          fontSize: 11,
          color: Colors.textSecondary,
          letterSpacing: 0.2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
