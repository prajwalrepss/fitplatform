import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../constants/theme';

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  accentColor?: string;
  style?: ViewStyle;
  compact?: boolean;
}

export default function StatCard({
  label,
  value,
  unit,
  icon,
  accentColor,
  style,
  compact = false,
}: StatCardProps) {
  return (
    <View
      style={[
        styles.card,
        accentColor ? { borderLeftWidth: 4, borderLeftColor: accentColor + '33' } : null,
        compact && styles.compact,
        style,
      ]}
    >
      {icon && (
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={18} color={colors.primary} />
        </View>
      )}
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, compact && styles.compactValue]}>{value}</Text>
        {unit && (
          <Text style={[styles.unit, { color: accentColor || colors.primary }]}>{unit}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    justifyContent: 'space-between',
  },
  compact: {
    padding: spacing.lg,
  },
  iconWrap: {
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.labelSM,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  value: {
    ...typography.displayMD,
    color: colors.onSurface,
  },
  compactValue: {
    fontSize: 24,
  },
  unit: {
    ...typography.labelSM,
    color: colors.primary,
  },
});
