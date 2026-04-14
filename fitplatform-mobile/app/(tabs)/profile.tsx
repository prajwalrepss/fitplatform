import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Svg, { Ellipse, Rect } from 'react-native-svg';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';

const NAV_ROWS = [
  { icon: 'analytics-outline' as const, label: 'Analytics' },
  { icon: 'time-outline' as const, label: 'History' },
  { icon: 'heart-outline' as const, label: 'Matches' },
  { icon: 'settings-outline' as const, label: 'Settings' },
];

function MuscleHeatmap() {
  return (
    <View style={heatmapStyles.container}>
      <Svg width={120} height={200} viewBox="0 0 120 200">
        {/* Head */}
        <Ellipse cx="60" cy="20" rx="14" ry="16" fill={colors.surfaceContainerHighest} />
        {/* Neck */}
        <Rect x="55" y="36" width="10" height="12" fill={colors.surfaceContainerHighest} />
        {/* Torso */}
        <Rect x="35" y="48" width="50" height="55" rx="8" fill={colors.surfaceContainerHighest} />
        {/* Left Arm (bicep highlighted) */}
        <Rect x="18" y="50" width="15" height="35" rx="6" fill={colors.primary} opacity={0.9} />
        <Rect x="16" y="85" width="12" height="30" rx="5" fill={colors.surfaceContainerHighest} />
        {/* Right Arm (bicep highlighted) */}
        <Rect x="87" y="50" width="15" height="35" rx="6" fill={colors.primary} opacity={0.9} />
        <Rect x="89" y="85" width="12" height="30" rx="5" fill={colors.surfaceContainerHighest} />
        {/* Left Leg (quad highlighted) */}
        <Rect x="37" y="106" width="18" height="50" rx="7" fill={colors.primary} opacity={0.7} />
        <Rect x="38" y="156" width="14" height="30" rx="5" fill={colors.surfaceContainerHighest} />
        {/* Right Leg (quad highlighted) */}
        <Rect x="65" y="106" width="18" height="50" rx="7" fill={colors.primary} opacity={0.7} />
        <Rect x="66" y="156" width="14" height="30" rx="5" fill={colors.surfaceContainerHighest} />
      </Svg>
    </View>
  );
}

const heatmapStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
});

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={[styles.headerWrap, { paddingTop: insets.top }]}>
        <BlurView intensity={80} tint="dark" style={styles.headerBlur}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Welcome back, Athlete</Text>
              <Text style={styles.headerSub}>ELITE TIER MEMBER</Text>
            </View>
          </View>
        </BlurView>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.avatarSection}>
          <View style={styles.avatarRing}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientRing}
            >
              <View style={styles.avatarInner}>
                <Ionicons name="person" size={48} color={colors.primary} />
              </View>
            </LinearGradient>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={16} color={colors.onPrimary} />
            </View>
          </View>
          <Text style={styles.profileName}>Prajwal</Text>
          <Text style={styles.profileSub}>CSE Student</Text>
          <Button title="Edit Profile" variant="secondary" style={styles.editBtn} />
        </Animated.View>

        {/* Stats Row */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.statsRow}>
          <StatCard label="Calories" value="2,450" compact style={styles.statItem} />
          <StatCard label="Workouts" value="12" compact style={styles.statItem} />
          <StatCard label="Streak" value="14d" compact style={styles.statItem} />
        </Animated.View>

        {/* Muscle Heatmap */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.heatmapCard}>
          <View style={styles.heatmapHeader}>
            <View>
              <Text style={styles.heatmapTitle}>MUSCLE HEATMAP</Text>
              <Text style={styles.heatmapSub}>WEEKLY IMPACT</Text>
            </View>
          </View>
          <MuscleHeatmap />
          <View style={styles.legendRow}>
            <View style={styles.legendDot} />
            <Text style={styles.legendText}>High Intensity</Text>
          </View>
        </Animated.View>

        {/* Nav Rows */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.navSection}>
          {NAV_ROWS.map((row) => (
            <Pressable key={row.label} style={styles.navRow}>
              <View style={styles.navIconCircle}>
                <Ionicons name={row.icon} size={20} color={colors.primary} />
              </View>
              <Text style={styles.navLabel}>{row.label}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.onSurfaceVariant} />
            </Pressable>
          ))}
        </Animated.View>

        {/* Logout */}
        <Pressable style={styles.logoutRow}>
          <Ionicons name="log-out-outline" size={20} color={colors.destructive} />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surfaceLowest,
  },
  headerWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    overflow: 'hidden',
  },
  headerBlur: {
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    backgroundColor: 'rgba(14,14,14,0.8)',
  },
  headerTitle: {
    ...typography.headlineLG,
    color: colors.primary,
  },
  headerSub: {
    ...typography.labelSM,
    color: colors.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xxl,
    gap: spacing.xxl,
  },
  avatarSection: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatarRing: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  gradientRing: {
    width: 132,
    height: 132,
    borderRadius: 66,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surfaceLowest,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.surfaceLowest,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    ...typography.displayMD,
    fontStyle: 'italic',
    color: colors.onSurface,
  },
  profileSub: {
    ...typography.bodyMD,
    color: colors.onSurfaceVariant,
  },
  editBtn: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.full,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statItem: {
    flex: 1,
  },
  heatmapCard: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.xl,
    padding: spacing.xl,
    ...shadows.greenGlow,
  },
  heatmapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heatmapTitle: {
    ...typography.labelLG,
    color: colors.onSurface,
  },
  heatmapSub: {
    ...typography.labelSM,
    color: colors.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  legendText: {
    ...typography.labelSM,
    color: colors.primary,
  },
  navSection: {
    gap: spacing.sm,
  },
  navRow: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  navIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    ...typography.bodyLG,
    fontWeight: '700',
    color: colors.onSurface,
    flex: 1,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },
  logoutText: {
    ...typography.bodyLG,
    color: colors.destructive,
  },
});
