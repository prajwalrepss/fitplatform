import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../theme';

/**
 * VitalisDivider — Horizontal line with centered label
 *
 * e.g. ── OR CONTINUE WITH ──
 */
export default function VitalisDivider({ label = 'OR CONTINUE WITH' }) {
  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <Text style={styles.label}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.marginMobile,
    marginVertical: Spacing.lg,
    opacity: 0.6,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.outlineVariant,
  },
  label: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    marginHorizontal: Spacing.md,
  },
});
