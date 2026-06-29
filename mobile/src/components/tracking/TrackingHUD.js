import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '../../theme';

function MetricPill({ label, value, accent }) {
  return (
    <View style={styles.metricPill}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, accent && { color: accent }]}>{value}</Text>
    </View>
  );
}

function IconAction({ icon, label, onPress, danger }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconAction,
        danger && styles.iconActionDanger,
        pressed && styles.iconActionPressed,
      ]}
      hitSlop={8}
    >
      <MaterialIcons name={icon} size={20} color={danger ? Colors.error : Colors.onSurface} />
      <Text style={[styles.iconActionLabel, danger && { color: Colors.error }]}>{label}</Text>
    </Pressable>
  );
}

export default function TrackingHUD({
  exerciseName,
  currentSet,
  targetSets,
  currentRep,
  targetReps,
  weight,
  formScore,
  elapsed,
  feedback,
  paused,
  onPause,
  onSkip,
  onFinish,
}) {
  const formColor = formScore >= 80 ? '#4EDEA3' : formScore >= 60 ? '#FFCB6B' : Colors.error;

  return (
    <View style={styles.container}>
      <View style={styles.exerciseCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.overline}>CURRENT EXERCISE</Text>
          <Text style={styles.exerciseName} numberOfLines={1}>{exerciseName}</Text>
          <Text style={styles.feedback} numberOfLines={2}>{feedback}</Text>
        </View>
        <View style={styles.liveDot} />
      </View>

      <View style={styles.metricsRow}>
        <MetricPill label="SET" value={`${currentSet}/${targetSets}`} />
        <MetricPill label="REPS" value={`${currentRep}/${targetReps}`} accent={Colors.primary} />
        <MetricPill label="LOAD" value={`${weight || 0} kg`} />
        <MetricPill label="TIME" value={elapsed} />
      </View>

      <View style={styles.formPanel}>
        <View style={styles.formHeader}>
          <Text style={styles.overline}>FORM QUALITY</Text>
          <Text style={[styles.formScore, { color: formColor }]}>{formScore}%</Text>
        </View>
        <View style={styles.formTrack}>
          <View style={[styles.formFill, { width: `${formScore}%`, backgroundColor: formColor }]} />
        </View>
      </View>

      <View style={styles.actionsRow}>
        <IconAction icon={paused ? 'play-arrow' : 'pause'} label={paused ? 'Resume' : 'Pause'} onPress={onPause} />
        <IconAction icon="skip-next" label="Skip" onPress={onSkip} />
        <IconAction icon="stop" label="Finish" onPress={onFinish} danger />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Spacing.marginMobile,
    right: Spacing.marginMobile,
    bottom: Spacing.lg,
    gap: Spacing.sm,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Spacing.radiusLg,
    backgroundColor: 'rgba(5, 20, 36, 0.78)',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  overline: {
    ...Typography.labelCaps,
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1.6,
  },
  exerciseName: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    marginTop: 2,
  },
  feedback: {
    ...Typography.caption,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4EDEA3',
    shadowColor: '#4EDEA3',
    shadowOpacity: 0.8,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  metricsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  metricPill: {
    flex: 1,
    minHeight: 58,
    borderRadius: Spacing.radiusMd,
    backgroundColor: 'rgba(5, 20, 36, 0.72)',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    justifyContent: 'center',
  },
  metricLabel: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    fontSize: 8,
    letterSpacing: 1,
  },
  metricValue: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
    fontFamily: 'HankenGrotesk_700Bold',
    marginTop: 2,
  },
  formPanel: {
    padding: Spacing.md,
    borderRadius: Spacing.radiusLg,
    backgroundColor: 'rgba(5, 20, 36, 0.72)',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  formScore: {
    ...Typography.bodyMd,
    fontFamily: 'HankenGrotesk_700Bold',
  },
  formTrack: {
    height: 7,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  formFill: {
    height: '100%',
    borderRadius: 99,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconAction: {
    flex: 1,
    height: 46,
    borderRadius: Spacing.radiusMd,
    backgroundColor: 'rgba(18, 33, 49, 0.82)',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  iconActionDanger: {
    backgroundColor: 'rgba(147, 0, 10, 0.22)',
    borderColor: 'rgba(255, 180, 171, 0.24)',
  },
  iconActionPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  iconActionLabel: {
    ...Typography.labelCaps,
    color: Colors.onSurface,
    fontSize: 10,
    letterSpacing: 1,
  },
});
