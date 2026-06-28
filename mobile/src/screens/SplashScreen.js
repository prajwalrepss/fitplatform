import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar } from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import VitalisLogo from '../components/VitalisLogo';
import { Colors, Typography, Spacing } from '../theme';
import Screens from '../constants/screens';

/**
 * SplashScreen — Animated brand reveal
 *
 * Matches the Vitalis splash design:
 *   - Deep charcoal + shader background
 *   - Pulsing brand mark (128×128)
 *   - "Vitalis" display text (40px, 800 weight)
 *   - "Understand Your Body." subtitle
 *   - Staggered fade-in-up entry animations
 *   - Auto-navigates after 2.5s
 */
export default function SplashScreen({ navigation, route }) {
  const logoAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered fade-in
    Animated.stagger(300, [
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(subtitleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-navigate after 2.5s
    const timer = setTimeout(() => {
      const nextScreen = route?.params?.nextScreen || Screens.LOGIN;
      navigation.replace(nextScreen);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const makeEntryStyle = (anim) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
    ],
  });

  return (
    <ScreenBackground>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.content}>
        {/* Brand Mark */}
        <Animated.View style={[styles.logoWrapper, makeEntryStyle(logoAnim)]}>
          <VitalisLogo size={128} animate />
        </Animated.View>

        {/* Brand Name */}
        <Animated.View style={makeEntryStyle(titleAnim)}>
          <Text style={styles.title}>Vitalis</Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.View style={makeEntryStyle(subtitleAnim)}>
          <Text style={styles.subtitle}>Understand Your Body.</Text>
        </Animated.View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.marginMobile,
  },
  logoWrapper: {
    marginBottom: Spacing.xxl,
  },
  title: {
    ...Typography.displayLgMobile,
    color: Colors.onSurface,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.bodyLg,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
