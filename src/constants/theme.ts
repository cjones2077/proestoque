// src/constants/theme.ts
// Design Tokens do ProEstoque

export const COLORS = {
  // Cores Primárias
  primary: '#4F46E5',        // Indigo vibrante
  primaryLight: '#818CF8',   // Indigo claro
  primaryDark: '#3730A3',    // Indigo escuro

  // Cores Secundárias
  secondary: '#10B981',      // Esmeralda
  secondaryLight: '#34D399',
  secondaryDark: '#059669',

  // Cores de Estado
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',

  // Neutros
  white: '#FFFFFF',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  borderFocus: '#4F46E5',
  placeholder: '#94A3B8',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  disabled: '#CBD5E1',
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Escuros (para elementos específicos)
  dark: '#0F172A',
  darkSurface: '#1E293B',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  title: 34,
};

export const BORDER_RADIUS = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

const theme = {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  SHADOWS,
};

export default theme;
