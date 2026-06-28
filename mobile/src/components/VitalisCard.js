import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing } from '../theme';

/**
 * VitalisCard — Glass panel card
 *
 * Per DESIGN.md:
 *   - rgba(5,20,36,0.7) background
 *   - 24px blur (visual illusion via gradient)
 *   - 0.5px indigo stroke at 10% opacity
 *   - rounded-xl (24px) corners
 *   - Subtle gradient background
 *
 * Props:
 *   children - ReactNode
 *   style    - additional styles
 *   variant  - 'glass' | 'solid' (default: 'glass')
 */
export default function VitalisCard({ children, style, variant = 'glass' }) {
  if (variant === 'solid') {
    return (
      <View style={[styles.solidCard, style]}>
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.glassCard, style]}>
      <LinearGradient
        colors={[
          'rgba(28, 43, 60, 0.6)',
          'rgba(5, 20, 36, 0.8)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: Spacing.radiusXl }]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  glassCard: {
    borderRadius: Spacing.radiusXl,
    borderWidth: 1,
    borderColor: 'rgba(192, 193, 255, 0.10)',
    overflow: 'hidden',
    padding: Spacing.xl,
    // Elevation for Android
    elevation: 8,
    // Glow shadow for iOS
    shadowColor: '#000000',
    shadowOpacity: 0.6,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 15 },
  },
  solidCard: {
    borderRadius: Spacing.radiusXl,
    backgroundColor: Colors.surfaceContainer,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: Spacing.xl,
    elevation: 4,
  },
});
