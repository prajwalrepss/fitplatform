import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const CARD_WIDTH = Math.round(SCREEN_WIDTH * 0.85);
export const CARD_HEIGHT = 440;

// Mapping training styles to badge colors
const BADGE_COLORS = {
  HYPERTROPHY: { bg: 'rgba(109,93,246,0.15)', text: '#9D8FFF', border: 'rgba(109,93,246,0.3)' },
  STRENGTH:    { bg: 'rgba(255,149,0,0.15)',   text: '#FFB347', border: 'rgba(255,149,0,0.3)' },
  ATHLETIC:    { bg: 'rgba(48,209,88,0.15)',   text: '#6BE089', border: 'rgba(48,209,88,0.3)' },
  POWERBUILDING: { bg: 'rgba(255,69,58,0.15)', text: '#FF6B6B', border: 'rgba(255,69,58,0.3)' },
};

const DIFFICULTY_BADGES = {
  BEGINNER:     { bg: 'rgba(52,199,89,0.15)',  text: '#34C759', border: 'rgba(52,199,89,0.3)' },
  INTERMEDIATE: { bg: 'rgba(0,122,255,0.15)',  text: '#007AFF', border: 'rgba(0,122,255,0.3)' },
  ADVANCED:     { bg: 'rgba(255,149,0,0.15)',  text: '#FF9500', border: 'rgba(255,149,0,0.3)' },
  ELITE:        { bg: 'rgba(255,59,48,0.15)',   text: '#FF3B30', border: 'rgba(255,59,48,0.3)' },
};

/**
 * SplitCard — Complete visual pass containing:
 *   - Split name
 *   - Difficulty (Beginner / Intermediate / Advanced / Elite)
 *   - Training Goal & Training Style
 *   - Workout Duration & Days Per Week
 *   - Recovery Rating
 *   - Primary Muscles & Estimated Weekly Volume
 *   - Short Description
 *   - Community Count
 *   - Select Button
 *
 * Props:
 *   split     - split data object
 *   isActive  - bool
 *   onSelect  - fn (called when Select button is pressed)
 */
export default function SplitCard({ split, isActive, onSelect }) {
  const goalBadge = BADGE_COLORS[split.trainingGoal?.toUpperCase()] || BADGE_COLORS.HYPERTROPHY;
  const diffBadge = DIFFICULTY_BADGES[split.difficulty?.toUpperCase()] || DIFFICULTY_BADGES.INTERMEDIATE;

  return (
    <View style={[styles.card, isActive && styles.cardActive]}>
      <LinearGradient
        colors={
          isActive
            ? ['rgba(18,33,49,0.95)', 'rgba(5,20,36,0.98)']
            : ['rgba(28,43,60,0.4)', 'rgba(12,21,31,0.6)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
      />

      {/* ── Badges Row ── */}
      <View style={styles.badgeRow}>
        <View style={[styles.badge, { backgroundColor: diffBadge.bg, borderColor: diffBadge.border }]}>
          <Text style={[styles.badgeText, { color: diffBadge.text }]}>{split.difficulty}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: goalBadge.bg, borderColor: goalBadge.border }]}>
          <Text style={[styles.badgeText, { color: goalBadge.text }]}>{split.trainingStyle}</Text>
        </View>
      </View>

      {/* ── Split Title ── */}
      <Text style={styles.splitName} numberOfLines={1}>{split.name}</Text>
      <Text style={styles.goalSubtitle}>{split.trainingGoal} Training Style</Text>

      {/* ── Details Grid ── */}
      <View style={styles.statsGrid}>
        <View style={styles.statCol}>
          <Text style={styles.statLabel}>DURATION</Text>
          <Text style={styles.statValue}>{split.duration}</Text>
        </View>
        <View style={styles.statCol}>
          <Text style={styles.statLabel}>FREQUENCY</Text>
          <Text style={styles.statValue}>{split.frequency}</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCol}>
          <Text style={styles.statLabel}>RECOVERY</Text>
          <Text style={styles.statValue}>{split.recoveryRating}</Text>
        </View>
        <View style={styles.statCol}>
          <Text style={styles.statLabel}>WEEKLY VOLUME</Text>
          <Text style={styles.statValue}>{split.weeklyVolume}</Text>
        </View>
      </View>

      {/* ── Primary Muscles ── */}
      <View style={styles.musclesSection}>
        <Text style={styles.statLabel}>PRIMARY MUSCLES</Text>
        <Text style={styles.musclesValue} numberOfLines={1}>{split.primaryMuscles}</Text>
      </View>

      {/* ── Description ── */}
      <Text style={styles.description} numberOfLines={2}>
        "{split.description}"
      </Text>

      {/* ── Footer / CTA ── */}
      <View style={styles.footer}>
        <View style={styles.communityContainer}>
          <MaterialIcons name="people" size={16} color={Colors.onSurfaceVariant} style={{ marginRight: 4 }} />
          <Text style={styles.communityText}>{split.communityCount}</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.selectButton,
            pressed && styles.selectButtonPressed,
          ]}
          onPress={onSelect}
        >
          <LinearGradient
            colors={['#6C63FF', '#564CE6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <Text style={styles.selectButtonText}>SELECT</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(192, 193, 255, 0.1)',
    padding: Spacing.xl,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  cardActive: {
    borderColor: 'rgba(109,93,246,0.45)',
    shadowColor: '#6D5DF6',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
  },
  badgeText: {
    ...Typography.labelCaps,
    fontSize: 9,
    letterSpacing: 1.5,
  },
  splitName: {
    ...Typography.headlineLg,
    color: Colors.onSurface,
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 32,
  },
  goalSubtitle: {
    ...Typography.labelCaps,
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    opacity: 0.6,
    letterSpacing: 1,
    marginTop: 2,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  statCol: {
    flex: 1,
  },
  statLabel: {
    ...Typography.labelCaps,
    fontSize: 8,
    color: Colors.onSurfaceVariant,
    opacity: 0.5,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  statValue: {
    ...Typography.bodyMd,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  musclesSection: {
    marginBottom: 12,
  },
  musclesValue: {
    ...Typography.bodyMd,
    fontSize: 13,
    fontWeight: '700',
    color: '#9D8FFF',
  },
  description: {
    ...Typography.bodyMd,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.onSurfaceVariant,
    opacity: 0.8,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 12,
  },
  communityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  communityText: {
    ...Typography.bodyMd,
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    opacity: 0.6,
  },
  selectButton: {
    width: 100,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C63FF',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    overflow: 'hidden',
  },
  selectButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.96 }],
  },
  selectButtonText: {
    ...Typography.labelCaps,
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});
