/**
 * Vitalis Design System — Typography
 *
 * Hanken Grotesk type scale from DESIGN.md.
 * All styles use React Native StyleSheet-compatible objects.
 */

const Typography = {
  displayLg: {
    fontFamily: 'HankenGrotesk_800ExtraBold',
    fontSize: 64,
    lineHeight: 64 * 1.1,
    letterSpacing: -2.56, // -0.04em
  },
  displayLgMobile: {
    fontFamily: 'HankenGrotesk_800ExtraBold',
    fontSize: 40,
    lineHeight: 40 * 1.1,
    letterSpacing: -1.2, // -0.03em
  },
  headlineLg: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 32,
    lineHeight: 32 * 1.2,
    letterSpacing: -0.64, // -0.02em
  },
  headlineSm: {
    fontFamily: 'HankenGrotesk_600SemiBold',
    fontSize: 24,
    lineHeight: 24 * 1.3,
    letterSpacing: 0,
  },
  bodyLg: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 18,
    lineHeight: 18 * 1.6,
    letterSpacing: 0,
  },
  bodyMd: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 16,
    lineHeight: 16 * 1.6,
    letterSpacing: 0,
  },
  labelCaps: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 12,
    lineHeight: 12,
    letterSpacing: 1.2, // 0.1em
    textTransform: 'uppercase',
  },
  // ── Utility styles ──
  buttonPrimary: {
    fontFamily: 'HankenGrotesk_600SemiBold',
    fontSize: 24,
    lineHeight: 24 * 1.3,
    letterSpacing: 0,
  },
  buttonSecondary: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 16,
    lineHeight: 16 * 1.6,
    letterSpacing: 0,
  },
  caption: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 13,
    lineHeight: 13 * 1.4,
    letterSpacing: 0.2,
  },
};

export default Typography;
