import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme';

/**
 * ScreenBackground — Animated deep-charcoal background
 *
 * Approximates the WebGL shader "muscle fiber contour lines" effect
 * using layered LinearGradients with a subtle pulsing animation.
 * Used as the base layer for every screen in the app.
 */
export default function ScreenBackground({ children, style }) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const contourOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.02, 0.07],
  });

  return (
    <View style={[styles.root, style]}>
      {/* Base background */}
      <View style={StyleSheet.absoluteFill}>
        {/* Radial glow — top-center origin */}
        <LinearGradient
          colors={['rgba(99,102,241,0.06)', 'rgba(5,20,36,0)', 'rgba(5,20,36,0)']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.7 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Anatomical contour line simulation */}
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: contourOpacity }]}>
          <LinearGradient
            colors={[
              'rgba(97,100,242,0.15)',
              'transparent',
              'rgba(97,100,242,0.08)',
              'transparent',
              'rgba(97,100,242,0.05)',
            ]}
            start={{ x: 0.3, y: 0 }}
            end={{ x: 0.7, y: 1 }}
            locations={[0, 0.25, 0.5, 0.75, 1]}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        {/* Subtle bottom warm gradient */}
        <LinearGradient
          colors={['transparent', 'rgba(5,20,36,0.3)']}
          start={{ x: 0.5, y: 0.8 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
