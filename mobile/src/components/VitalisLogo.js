import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing } from '../theme';

/**
 * VitalisLogo — Animated brand mark with indigo pulse glow
 *
 * Matches the splash screen design:
 *   - Rounded container with dark surface background
 *   - Subtle border
 *   - Scale pulse animation (0.98 ↔ 1.02)
 *   - Indigo glow shadow
 *
 * Props:
 *   size     - number (default: 128)
 *   animate  - bool   (default: true)
 */
export default function VitalisLogo({ size = 128, animate = true }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animate) return;

    // Native transform loop
    const scaleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.98,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    // JS shadow loop
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );

    scaleLoop.start();
    glowLoop.start();

    return () => {
      scaleLoop.stop();
      glowLoop.stop();
    };
  }, [animate, scaleAnim, glowAnim]);

  const shadowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 20],
  });

  const shadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.3],
  });

  const iconSize = size * 0.4;
  const borderRadius = size > 80 ? Spacing.radiusXl : Spacing.radiusLg;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius,
          shadowColor: Colors.primaryContainer,
          shadowRadius,
          shadowOpacity,
          shadowOffset: { width: 0, height: 0 },
        },
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ scale: scaleAnim }],
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius,
          },
        ]}
      >
        <LinearGradient
          colors={[Colors.surfaceContainerHigh, Colors.surfaceDim]}
          style={[StyleSheet.absoluteFill, { borderRadius }]}
        />
        <MaterialIcons
          name="fitness-center"
          size={iconSize}
          color={Colors.primaryFixedDim}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    elevation: 8,
    overflow: 'hidden',
  },
});
