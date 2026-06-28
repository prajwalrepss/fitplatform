export const colors = {
  // Surfaces (tonal layering system — NO borders, depth by color shift only)
  surfaceLowest:           '#0E0E0E',
  surface:                 '#131313',
  surfaceContainerLow:     '#1C1B1B',
  surfaceContainer:        '#201F1F',
  surfaceContainerHigh:    '#2A2A2A',
  surfaceContainerHighest: '#353534',
  surfaceBright:           '#3A3939',

  // Accents
  primary:       '#00FF85',
  primaryDim:    '#00E476',
  primaryFixed:  '#61FF97',
  secondary:     '#00D2FD',
  secondaryFixed:'#3CD7FF',
  amber:         '#FFBA38',

  // Text
  onSurface:          '#E5E2E1',
  onSurfaceVariant:   '#B9CBB9',
  onPrimary:          '#003919',
  onPrimaryContainer: '#007137',

  // Utility
  outline:        '#849584',
  outlineVariant: '#3B4B3D',
  error:          '#FFB4AB',
  errorContainer: '#93000A',
  destructive:    '#FF4444',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const typography = {
  displayXL: { fontSize: 56, fontWeight: '900' as const, letterSpacing: -1.5 },
  displayLG: { fontSize: 40, fontWeight: '900' as const, letterSpacing: -1.2, fontStyle: 'italic' as const },
  displayMD: { fontSize: 32, fontWeight: '900' as const, letterSpacing: -0.8 },

  headlineLG: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  headlineMD: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3 },
  headlineSM: { fontSize: 18, fontWeight: '600' as const, letterSpacing: -0.2 },

  bodyLG: { fontSize: 16, fontWeight: '400' as const },
  bodyMD: { fontSize: 14, fontWeight: '400' as const },

  labelLG: { fontSize: 13, fontWeight: '700' as const, letterSpacing: 1.5, textTransform: 'uppercase' as const },
  labelMD: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1.8, textTransform: 'uppercase' as const },
  labelSM: { fontSize: 10, fontWeight: '700' as const, letterSpacing: 2.0, textTransform: 'uppercase' as const },
};

export const shadows = {
  greenGlow: {
    shadowColor: '#00FF85',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  cyanGlow: {
    shadowColor: '#00D2FD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
};
