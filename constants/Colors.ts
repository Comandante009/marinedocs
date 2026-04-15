// DocSearch Maritime Dark Theme
export const Colors = {
  // Core backgrounds
  background: '#0A1628',
  surface: '#0F2040',
  card: '#162B4D',
  cardHover: '#1C3460',
  cardBorder: '#1E3A5F',

  // Accents
  accent: '#1E90FF',
  accentDim: 'rgba(30, 144, 255, 0.15)',
  accentBorder: 'rgba(30, 144, 255, 0.3)',
  teal: '#00D4AA',
  tealDim: 'rgba(0, 212, 170, 0.15)',
  warning: '#FF6B35',
  warningDim: 'rgba(255, 107, 53, 0.15)',
  danger: '#FF4757',
  dangerDim: 'rgba(255, 71, 87, 0.15)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#8BA5C8',
  textTertiary: '#5A7499',
  textInverse: '#0A1628',

  // File type colors
  pdf: '#E74C3C',
  pdfBg: 'rgba(231, 76, 60, 0.15)',
  doc: '#3498DB',
  docBg: 'rgba(52, 152, 219, 0.15)',
  xls: '#2ECC71',
  xlsBg: 'rgba(46, 204, 113, 0.15)',

  // Category colors
  categorySafety: '#FF6B35',
  categoryNavigation: '#1E90FF',
  categoryCargo: '#9B59B6',
  categoryEngine: '#2ECC71',
  categoryISM: '#E67E22',
  categoryISPS: '#E74C3C',
  categorySIRE: '#1ABC9C',
  categoryCDI: '#3498DB',
  categoryCertificates: '#F1C40F',
  categoryManuals: '#8BA5C8',

  // Tab bar
  tabBarBg: '#0D1F38',
  tabBarBorder: '#1A2E4A',
  tabActive: '#1E90FF',
  tabInactive: '#5A7499',

  // Misc
  divider: '#1A2E4A',
  overlay: 'rgba(0, 0, 0, 0.6)',
  shadow: 'rgba(0, 0, 0, 0.4)',

  // Status
  online: '#00D4AA',
  offline: '#FF6B35',
} as const;

// Category color mapping
export const categoryColors: Record<string, string> = {
  All: Colors.accent,
  Safety: Colors.categorySafety,
  Navigation: Colors.categoryNavigation,
  Cargo: Colors.categoryCargo,
  Engine: Colors.categoryEngine,
  ISM: Colors.categoryISM,
  ISPS: Colors.categoryISPS,
  SIRE: Colors.categorySIRE,
  CDI: Colors.categoryCDI,
  Certificates: Colors.categoryCertificates,
  Manuals: Colors.categoryManuals,
};

export const CATEGORIES = [
  'All', 'Safety', 'Navigation', 'Cargo', 'Engine',
  'ISM', 'ISPS', 'SIRE', 'CDI', 'Certificates', 'Manuals',
] as const;

export type Category = (typeof CATEGORIES)[number];
