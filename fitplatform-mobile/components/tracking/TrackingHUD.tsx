import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, typography, spacing, radius } from '../../constants/theme';
import RepCounter from './RepCounter';
import PerformanceBar from '../ui/PerformanceBar';
import AIFeedbackChip from '../ui/AIFeedbackChip';
import Button from '../ui/Button';

interface TrackingHUDProps {
  reps: number;
  formScore: number;
  feedback: string;
  onPause?: () => void;
  onEnd?: () => void;
}

export default function TrackingHUD({
  reps,
  formScore,
  feedback,
  onPause,
  onEnd,
}: TrackingHUDProps) {
  return (
    <View style={styles.container}>
      <BlurView intensity={60} tint="dark" style={styles.blur}>
        <View style={styles.content}>
          {/* Rep Counter */}
          <RepCounter count={reps} />

          {/* Form Score */}
          <View style={styles.formSection}>
            <View style={styles.formHeader}>
              <Text style={styles.formLabel}>FORM SCORE</Text>
              <Text style={styles.formPercent}>{formScore}%</Text>
            </View>
            <PerformanceBar value={formScore} />
            <View style={styles.formScale}>
              <Text style={styles.critical}>CRITICAL</Text>
              <Text style={styles.optimal}>OPTIMAL</Text>
            </View>
          </View>

          {/* AI Feedback */}
          <AIFeedbackChip message={feedback} />

          {/* Action Buttons */}
          <View style={styles.buttonsRow}>
            <View style={styles.buttonWrap}>
              <Button
                title="⏸ Pause"
                variant="secondary"
                onPress={onPause}
                fullWidth
              />
            </View>
            <View style={styles.buttonWrap}>
              <Button
                title="🛑 End Workout"
                variant="danger"
                onPress={onEnd}
                fullWidth
              />
            </View>
          </View>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
  },
  blur: {
    overflow: 'hidden',
  },
  content: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: spacing.xxl,
    paddingBottom: spacing.xxxl + 16,
    gap: spacing.xl,
  },
  formSection: {
    gap: spacing.sm,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formLabel: {
    ...typography.labelSM,
    color: colors.onSurfaceVariant,
  },
  formPercent: {
    ...typography.bodyMD,
    fontWeight: '700',
    color: colors.amber,
  },
  formScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  critical: {
    ...typography.labelSM,
    color: colors.error,
    fontSize: 8,
  },
  optimal: {
    ...typography.labelSM,
    color: colors.primary,
    fontSize: 8,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  buttonWrap: {
    flex: 1,
  },
});
