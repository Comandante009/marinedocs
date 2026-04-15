import { View, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import { useAppStore } from '@/store/useAppStore';

export function StatusBadge() {
  const isOnline = useAppStore((s) => s.isOnline);
  const lang = useAppStore((s) => s.preferences.language);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: isOnline ? Colors.tealDim : Colors.warningDim,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: isOnline ? Colors.teal + '40' : Colors.warning + '40',
      }}
    >
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: isOnline ? Colors.teal : Colors.warning,
        }}
      />
      <Text
        style={{
          fontFamily: Fonts.semiBold,
          fontSize: 10,
          color: isOnline ? Colors.teal : Colors.warning,
          letterSpacing: 0.5,
        }}
      >
        {isOnline ? (lang === 'en' ? 'ONLINE' : 'ÇEVRİMİÇİ') : (lang === 'en' ? 'OFFLINE' : 'ÇEVRİMDIŞI')}
      </Text>
    </View>
  );
}
