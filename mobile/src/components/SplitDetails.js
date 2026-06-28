import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../theme';
import VitalisCard from './VitalisCard';

/**
 * SplitDetails — Renders the workout schedule (Weekly Plan) of the active split.
 * Positioned in the space below the carousel card.
 *
 * Props:
 *   split - split data object containing weeklySchedule
 */
export default function SplitDetails({ split }) {
  if (!split || !split.weeklySchedule) return null;

  return (
    <VitalisCard variant="glass" style={styles.container}>
      {/* ── Title / Section Header ── */}
      <Text style={styles.sectionHeader}>WEEKLY PLAN</Text>

      {/* ── Vertical Schedule Breakdown ── */}
      <View style={styles.scheduleContainer}>
        {split.weeklySchedule.map((day, idx) => {
          const isRest = day.target.toLowerCase() === 'rest';
          return (
            <View key={idx} style={[styles.dayRow, idx < split.weeklySchedule.length - 1 && styles.borderBottom]}>
              <Text style={styles.dayLabel}>{day.day}</Text>
              <View style={styles.separatorLine} />
              <View style={[
                styles.targetContainer, 
                isRest ? styles.targetRestBg : styles.targetActiveBg
              ]}>
                <Text style={[
                  styles.targetText,
                  isRest ? styles.targetRestText : styles.targetActiveText
                ]}>
                  {day.target}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </VitalisCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.marginMobile,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
    letterSpacing: 2,
    opacity: 0.5,
    marginBottom: 16,
  },
  scheduleContainer: {
    gap: 12,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  borderBottom: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.04)',
    paddingBottom: 12,
  },
  dayLabel: {
    ...Typography.bodyMd,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 16,
  },
  targetContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 0.5,
    minWidth: 80,
    alignItems: 'center',
  },
  targetActiveBg: {
    backgroundColor: 'rgba(109, 93, 246, 0.1)',
    borderColor: 'rgba(109, 93, 246, 0.25)',
  },
  targetRestBg: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  targetText: {
    ...Typography.labelCaps,
    fontSize: 10,
    letterSpacing: 1,
  },
  targetActiveText: {
    color: '#9D8FFF',
    fontWeight: '800',
  },
  targetRestText: {
    color: Colors.onSurfaceVariant,
    opacity: 0.5,
  },
});
