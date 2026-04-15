import { View, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Typography';
import type { FileType } from '@/store/types';

interface FileTypeIconProps {
  type: FileType;
  size?: number;
}

const config: Record<FileType, { label: string; color: string; bg: string }> = {
  pdf: { label: 'PDF', color: Colors.pdf, bg: Colors.pdfBg },
  docx: { label: 'DOC', color: Colors.doc, bg: Colors.docBg },
  xlsx: { label: 'XLS', color: Colors.xls, bg: Colors.xlsBg },
};

export function FileTypeIcon({ type, size = 40 }: FileTypeIconProps) {
  const { label, color, bg } = config[type];
  const fontSize = size < 36 ? 9 : 11;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 8,
        borderCurve: 'continuous',
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: color + '40',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontFamily: Fonts.bold,
          fontSize,
          color,
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
