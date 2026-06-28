import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, typography, spacing, radius, shadows } from '../../constants/theme';
import StatCard from '../../components/ui/StatCard';
import ActivityRow from '../../components/ui/ActivityRow';
import Button from '../../components/ui/Button';
import { recentActivities } from '../../data/exercises';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={[styles.headerWrap, { paddingTop: insets.top }]}>
        <BlurView intensity={80} tint="dark" style={styles.headerBlur}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={20} color={colors.primary} />
              </View>
              <Text style={styles.greeting}>Hey, Prajwal 👋</Text>
            </View>
            <Pressable style={styles.notifBtn}>
              <Ionicons name="notifications-outline" size={24} color={colors.onSurfaceVariant} />
            </Pressable>
          </View>
        </BlurView>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 72 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Row */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.statsGrid}>
          <StatCard
            label="Calories"
            value="2,140"
            unit="KCAL"
            style={styles.statHalf}
          />
          <StatCard
            label="7 Day Streak"
            value="7"
            unit="🔥"
            accentColor={colors.primary}
            style={styles.statHalf}
          />
          <StatCard
            label="Workouts"
            value="12"
            unit="THIS MONTH"
            accentColor={colors.secondary}
            style={styles.statFull}
          />
        </Animated.View>

        {/* Featured Workout Card */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <View style={[styles.featuredCard, shadows.greenGlow]}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=800&fit=crop' }}
              style={styles.featuredImage}
            />
            <LinearGradient
              colors={['transparent', colors.surfaceLowest + 'AA', colors.surfaceLowest]}
              style={styles.featuredGradient}
            />
            <View style={styles.featuredContent}>
              <View style={styles.tagsRow}>
                <View style={styles.tagCyan}>
                  <Text style={styles.tagCyanText}>STRENGTH</Text>
                </View>
                <View style={styles.tagDark}>
                  <Text style={styles.tagDarkText}>45 MIN</Text>
                </View>
              </View>
              <Text style={styles.featuredTitle}>Upper Body Blast</Text>
              <View style={styles.featuredMeta}>
                <Ionicons name="barbell-outline" size={14} color={colors.onSurfaceVariant} />
                <Text style={styles.featuredSubtitle}>6 Exercises</Text>
              </View>
              <Button
                title="START WORKOUT"
                icon="play"
                variant="primary"
                fullWidth
                onPress={() => router.push('/exercise/1')}
              />
            </View>
          </View>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <Pressable>
              <Text style={styles.viewHistory}>VIEW HISTORY</Text>
            </Pressable>
          </View>
          <View style={styles.activitiesList}>
            {recentActivities.map((a) => (
              <ActivityRow key={a.id} {...a} />
            ))}
          </View>
        </Animated.View>

        <View style={{ height: 100 }} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    backgroundColor: 'rgba(14,14,14,0.8)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary + '40',
  },
  greeting: {
    ...typography.headlineLG,
    color: colors.primary,
  },
  notifBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xxl,
    gap: spacing.xxl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statHalf: {
    flex: 1,
    minWidth: '45%',
    aspectRatio: 1,
  },
  statFull: {
    width: '100%',
  },
  featuredCard: {
    borderRadius: radius.xxl + 4,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerHigh,
    aspectRatio: 4 / 5,
  },
  featuredImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.4,
  },
  featuredGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  featuredContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.xxxl,
    gap: spacing.lg,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tagCyan: {
    backgroundColor: 'rgba(0,210,253,0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
  },
  tagCyanText: {
    ...typography.labelSM,
    color: colors.secondary,
  },
  tagDark: {
    backgroundColor: colors.surfaceBright + '80',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
  },
  tagDarkText: {
    ...typography.labelSM,
    color: colors.onSurface,
  },
  featuredTitle: {
    ...typography.displayMD,
    color: colors.onSurface,
    fontSize: 36,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  featuredSubtitle: {
    ...typography.bodyMD,
    color: colors.onSurfaceVariant,
  },
  recentSection: {
    gap: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.sm,
  },
  sectionTitle: {
    ...typography.headlineSM,
    color: colors.onSurface,
  },
  viewHistory: {
    ...typography.labelSM,
    color: colors.primary,
  },
  activitiesList: {
    gap: spacing.md,
  },
});
