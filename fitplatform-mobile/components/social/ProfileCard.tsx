import React from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../constants/theme';
import PromptBlock from './PromptBlock';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProfileCardProps {
  name: string;
  age: number;
  distance: string;
  frequency: string;
  style_type: string;
  streak: number;
  image: string;
  prompts: { question: string; answer: string }[];
}

export default function ProfileCard({
  name,
  age,
  distance,
  frequency,
  style_type,
  streak,
  image,
  prompts,
}: ProfileCardProps) {
  return (
    <View style={styles.card}>
      {/* Photo Section */}
      <View style={styles.photoSection}>
        <Image source={{ uri: image }} style={styles.photo} />
        <LinearGradient
          colors={['transparent', colors.surfaceLowest]}
          style={styles.gradient}
          start={{ x: 0, y: 0.6 }}
          end={{ x: 0, y: 1 }}
        />
        <View style={styles.infoAnchor}>
          <Text style={styles.nameAge}>{name.toUpperCase()}, {age}</Text>
          <Text style={styles.distance}>{distance}</Text>
          <View style={styles.pillsRow}>
            <View style={styles.primaryPill}>
              <Text style={styles.primaryPillText}>⚡ {frequency}</Text>
            </View>
            <View style={styles.darkPill}>
              <Text style={styles.darkPillText}>💪 {style_type}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Prompt Blocks */}
      <View style={styles.promptsContainer}>
        {prompts.map((p, i) => (
          <PromptBlock key={i} question={p.question} answer={p.answer} />
        ))}

        {/* Streak Badge */}
        <View style={styles.streakBadge}>
          <Ionicons name="trophy" size={18} color={colors.amber} />
          <Text style={styles.streakLabel}>ACTIVE STREAK</Text>
          <Text style={styles.streakValue}>{streak} DAYS</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.xxl + 4,
    overflow: 'hidden',
    width: SCREEN_WIDTH - spacing.xxl * 2,
    alignSelf: 'center',
  },
  photoSection: {
    aspectRatio: 3 / 4,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
  },
  infoAnchor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xxl,
  },
  nameAge: {
    ...typography.displayMD,
    fontStyle: 'italic',
    color: '#FFFFFF',
  },
  distance: {
    ...typography.bodyMD,
    color: colors.secondaryFixed,
    letterSpacing: 1,
    marginTop: spacing.xs,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  primaryPill: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
  },
  primaryPillText: {
    ...typography.labelSM,
    color: colors.onPrimary,
  },
  darkPill: {
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
  },
  darkPillText: {
    ...typography.labelSM,
    color: colors.onSurface,
  },
  promptsContainer: {
    padding: spacing.xl,
    gap: spacing.md,
  },
  streakBadge: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  streakLabel: {
    ...typography.labelSM,
    color: colors.onSurfaceVariant,
    flex: 1,
  },
  streakValue: {
    ...typography.labelLG,
    color: colors.primary,
  },
});
