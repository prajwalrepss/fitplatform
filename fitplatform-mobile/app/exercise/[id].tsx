import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import PoseOverlay from '../../components/tracking/PoseOverlay';
import Button from '../../components/ui/Button';
import { exercises } from '../../data/exercises';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const exercise = exercises.find((e) => e.id === Number(id)) || exercises[0];

  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(12);

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.onSurface} />
        </Pressable>

        {/* Hero Zone */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.heroCard}>
          <PoseOverlay width={160} height={180} />
          <View style={styles.muscleLabel}>
            <Text style={styles.muscleLabelText}>{exercise.muscle}</Text>
          </View>
        </Animated.View>

        {/* Exercise Info */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.infoSection}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <View style={styles.muscleBadge}>
            <Text style={styles.muscleBadgeText}>
              {exercise.name.includes('Bicep') ? 'Biceps' : exercise.muscle} · {exercise.muscle}
            </Text>
          </View>
          <Text style={styles.description}>{exercise.description}</Text>
        </Animated.View>

        {/* Specs Row */}
        <Animated.View entering={FadeInDown.delay(250).duration(400)} style={styles.specsRow}>
          <View style={styles.specCard}>
            <Text style={styles.specLabel}>REST</Text>
            <Text style={styles.specValue}>{exercise.restTime}</Text>
          </View>
          <View style={styles.specCard}>
            <Text style={styles.specLabel}>INTENSITY</Text>
            <Text style={styles.specValue}>{exercise.intensity}</Text>
          </View>
        </Animated.View>

        {/* Sets & Reps Steppers */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.steppersRow}>
          {/* Sets */}
          <View style={styles.stepperCard}>
            <Text style={styles.stepperLabel}>SETS</Text>
            <View style={styles.stepperControls}>
              <Pressable
                onPress={() => setSets(Math.max(1, sets - 1))}
                style={styles.stepperBtn}
              >
                <Ionicons name="remove" size={18} color={colors.primary} />
              </Pressable>
              <Text style={styles.stepperValue}>{sets}</Text>
              <Pressable
                onPress={() => setSets(sets + 1)}
                style={styles.stepperBtn}
              >
                <Ionicons name="add" size={18} color={colors.primary} />
              </Pressable>
            </View>
            <Text style={styles.stepperHint}>Target Volume</Text>
          </View>

          {/* Reps */}
          <View style={styles.stepperCard}>
            <Text style={styles.stepperLabel}>REPS</Text>
            <View style={styles.stepperControls}>
              <Pressable
                onPress={() => setReps(Math.max(1, reps - 1))}
                style={styles.stepperBtn}
              >
                <Ionicons name="remove" size={18} color={colors.primary} />
              </Pressable>
              <Text style={styles.stepperValue}>{reps}</Text>
              <Pressable
                onPress={() => setReps(reps + 1)}
                style={styles.stepperBtn}
              >
                <Ionicons name="add" size={18} color={colors.primary} />
              </Pressable>
            </View>
            <Text style={styles.stepperHint}>Hypertrophy range</Text>
          </View>
        </Animated.View>

        {/* Form Tips */}
        <Animated.View entering={FadeInDown.delay(350).duration(400)} style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>FORM TIPS</Text>
          {exercise.tips.map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View style={[styles.bottomCTA, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button
          title="🎯  Start AI Tracking"
          variant="primary"
          fullWidth
          onPress={() => router.push('/exercise/live')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surfaceLowest,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xxl,
    gap: spacing.xxl,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.xxl,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.greenGlow,
  },
  muscleLabel: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
  },
  muscleLabelText: {
    ...typography.labelSM,
    color: colors.primary,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  infoSection: {
    gap: spacing.md,
  },
  exerciseName: {
    ...typography.displayMD,
    fontStyle: 'italic',
    color: colors.onSurface,
  },
  muscleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
  },
  muscleBadgeText: {
    ...typography.labelSM,
    color: colors.onPrimary,
  },
  description: {
    ...typography.bodyMD,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
  },
  specsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  specCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  specLabel: {
    ...typography.labelSM,
    color: colors.onSurfaceVariant,
  },
  specValue: {
    ...typography.headlineSM,
    color: colors.onSurface,
  },
  steppersRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stepperCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  stepperLabel: {
    ...typography.labelMD,
    color: colors.onSurfaceVariant,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    ...typography.displayMD,
    color: colors.onSurface,
  },
  stepperHint: {
    ...typography.bodyMD,
    color: colors.onSurfaceVariant,
  },
  tipsSection: {
    gap: spacing.md,
  },
  tipsTitle: {
    ...typography.labelLG,
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  tipDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 8,
  },
  tipText: {
    ...typography.bodyMD,
    color: colors.onSurfaceVariant,
    flex: 1,
    lineHeight: 22,
  },
  bottomCTA: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
    backgroundColor: colors.surfaceLowest + 'F0',
  },
});
