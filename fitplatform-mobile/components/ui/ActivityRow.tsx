import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../constants/theme';

interface ActivityRowProps {
  name: string;
  sets: number;
  reps: number;
  weight: string;
  timestamp: string;
  badge: string;
  badgeType: 'pr' | 'completed';
  icon?: string;
}

export default function ActivityRow({
  name,
  sets,
  reps,
  weight,
  timestamp,
  badge,
  badgeType,
}: ActivityRowProps) {
  return (
    <Pressable style={styles.row}>
      <View style={styles.leftSection}>
        <View style={styles.greenBar} />
        <View style={styles.iconCircle}>
          <Ionicons name="barbell" size={20} color={badgeType === 'pr' ? colors.secondary : colors.primary} />
        </View>
      </View>
      <View style={styles.center}>
        <Text style={styles.exerciseName}>{name}</Text>
        <Text style={styles.details}>
          {sets} Sets • {reps} Reps • {weight}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.timestamp}>{timestamp}</Text>
        <Text style={[styles.badge, badgeType === 'pr' ? styles.prBadge : styles.completedBadge]}>
          {badge}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.lg,
    borderRadius: radius.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  greenBar: {
    width: 4,
    height: 32,
    backgroundColor: colors.primary,
    borderRadius: 2,
    opacity: 0.5,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
  },
  exerciseName: {
    ...typography.bodyLG,
    fontWeight: '700',
    color: colors.onSurface,
  },
  details: {
    ...typography.bodyMD,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  timestamp: {
    ...typography.labelSM,
    color: colors.onSurfaceVariant,
  },
  badge: {
    ...typography.bodyMD,
    fontWeight: '700',
    marginTop: 2,
  },
  prBadge: {
    color: colors.secondary,
  },
  completedBadge: {
    color: colors.primary,
  },
});
