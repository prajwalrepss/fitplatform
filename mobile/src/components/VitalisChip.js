import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Typography, Spacing } from '../theme';

/**
 * VitalisChip — Small pill-shaped label
 *
 * Per DESIGN.md: high-transparency background,
 * high-contrast Hanken Grotesk label-caps text, pill shape.
 *
 * Props:
 *   label    - string
 *   active   - bool (highlights with primary color)
 *   onPress  - fn (optional — makes it tappable)
 *   icon     - ReactNode (optional, prepended)
 */
export default function VitalisChip({ label, active = false, onPress, icon }) {
  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      style={[
        styles.chip,
        active && styles.chipActive,
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.label, active && styles.labelActive]}>
        {label}
      </Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.radiusFull,
    backgroundColor: 'rgba(39, 54, 71, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  chipActive: {
    backgroundColor: 'rgba(192, 193, 255, 0.12)',
    borderColor: 'rgba(192, 193, 255, 0.3)',
  },
  iconContainer: {
    marginRight: 6,
  },
  label: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
  },
  labelActive: {
    color: Colors.primary,
  },
});
