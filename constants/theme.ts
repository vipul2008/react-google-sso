/**
 * Premium dark theme design system for the app.
 */

export const Colors = {
  // Primary palette
  primary: '#6C63FF',
  primaryLight: '#8B85FF',
  primaryDark: '#4A42D4',

  // Accent
  accent: '#00D9FF',
  accentLight: '#33E1FF',

  // Backgrounds
  background: '#0F0F1A',
  backgroundSecondary: '#1A1A2E',
  backgroundTertiary: '#242444',
  card: '#1E1E38',
  cardHover: '#262650',

  // Text
  text: '#FFFFFF',
  textSecondary: '#A0A0C0',
  textTertiary: '#6B6B8D',

  // Semantic
  success: '#00E676',
  error: '#FF5252',
  warning: '#FFD740',
  info: '#40C4FF',

  // Borders
  border: '#2A2A4A',
  borderLight: '#3A3A5A',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.6)',
  glassBg: 'rgba(30, 30, 56, 0.85)',

  // Google
  googleRed: '#EA4335',
  googleBlue: '#4285F4',
  googleYellow: '#FBBC05',
  googleGreen: '#34A853',
  googleButtonBg: '#FFFFFF',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  hero: 36,
} as const;

export const Shadows = {
  small: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  large: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  glow: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
} as const;
