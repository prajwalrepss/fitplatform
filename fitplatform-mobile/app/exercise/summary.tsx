import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import StatCard from '../../components/ui/StatCard';
import PerformanceBar from '../../components/ui/PerformanceBar';
import Button from '../../components/ui/Button';

const FORM_BARS = [78, 82, 85, 90, 88, 92, 87, 89];

export default function SessionSummaryScreen() {
  const insets = useSafeAreaInsets();
  const checkScale = useSharedValue(0);
  const { reps, duration, form } = useLocalSearchParams<{ reps?: string; duration?: string; form?: string }>();

  const finalReps = reps || "48";
  const finalDuration = duration || "12:34";
  const finalForm = form || "89%";

  useEffect(() => {
    checkScale.value = withSpring(1, { damping: 12, stiffness: 200 });
  }, []);

  const checkAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.xxxl }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Check Circle */}
      <Animated.View style={[styles.checkCircle, checkAnimStyle]}>
        <Ionicons name="checkmark" size={40} color="#FFFFFF" />
      </Animated.View>

      {/* Title */}
      <Text style={styles.title}>Session Complete!</Text>
      <Text style={styles.subtitle}>Great work, Prajwal 💪</Text>

      {/* Stats Grid */}
      <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.statsGrid}>
        <StatCard
          label="Reps"
          value={finalReps}
          icon="repeat-outline"
          compact
          style={styles.statHalf}
        />
        <StatCard
          label="Duration"
          value={finalDuration}
          icon="time-outline"
          compact
          style={styles.statHalf}
        />
        <StatCard
          label="Avg Form"
          value={finalForm}
          icon="trending-up-outline"
          compact
          style={styles.statHalf}
        />
        <StatCard
          label="Calories"
          value="120"
          icon="flame-outline"
          compact
          style={styles.statHalf}
        />
      </Animated.View>

      {/* Form Over Time */}
      <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.formCard}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>FORM OVER TIME</Text>
          <View style={styles.stableBadge}>
            <Text style={styles.stableBadgeText}>STABLE</Text>
          </View>
        </View>
        <View style={styles.barChart}>
          {FORM_BARS.map((val, i) => (
            <View key={i} style={styles.barColumn}>
              <View
                style={[
                  styles.bar,
                  {
                    height: `${val}%`,
                    backgroundColor: val >= 85 ? colors.primary : colors.amber,
                  },
                ]}
              />
            </View>
          ))}
        </View>
      </Animated.View>

      {/* AI Coaching Insights */}
      <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.insightsCard}>
        <View style={styles.insightsAccent} />
        <View style={styles.insightsContent}>
          <View style={styles.insightsHeader}>
            <Ionicons name="sparkles" size={16} color={colors.primary} />
            <Text style={styles.insightsLabel}>AI COACHING INSIGHTS</Text>
          </View>
          <Text style={styles.insightsBody}>
            Your tempo was exceptionally consistent during the second half. Focus on a fuller lockout in your final reps to maximize triceps engagement.
          </Text>
        </View>
      </Animated.View>

      {/* CTAs */}
      <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.ctaSection}>
        <Button
          title="▶ Start Another"
          variant="primary"
          fullWidth
          onPress={() => router.push('/(tabs)/workouts')}
        />
        <View style={{ height: spacing.md }} />
        <Button
          title="🏠 Go Home"
          variant="secondary"
          fullWidth
          onPress={() => router.push('/(tabs)')}
        />
      </Animated.View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surfaceLowest,
  },
  content: {
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
    gap: spacing.xxl,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    ...typography.headlineLG,
    color: colors.onSurface,
  },
  subtitle: {
    ...typography.bodyLG,
    color: colors.onSurfaceVariant,
    marginTop: -spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    width: '100%',
  },
  statHalf: {
    flexBasis: '47%',
    flexGrow: 1,
  },
  formCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.xl,
    padding: spacing.xl,
    width: '100%',
    ...shadows.greenGlow,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  formTitle: {
    ...typography.labelLG,
    color: colors.onSurface,
  },
  stableBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  stableBadgeText: {
    ...typography.labelSM,
    color: colors.primary,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 80,
    gap: spacing.xs,
  },
  barColumn: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    borderRadius: 2,
    width: '100%',
  },
  insightsCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.xl,
    overflow: 'hidden',
    flexDirection: 'row',
    width: '100%',
  },
  insightsAccent: {
    width: 3,
    backgroundColor: colors.primary,
  },
  insightsContent: {
    flex: 1,
    padding: spacing.xl,
    gap: spacing.md,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  insightsLabel: {
    ...typography.labelSM,
    color: colors.primary,
  },
  insightsBody: {
    ...typography.bodyMD,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
  },
  ctaSection: {
    width: '100%',
  },
});
