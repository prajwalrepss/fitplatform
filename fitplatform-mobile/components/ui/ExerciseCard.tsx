import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors, typography, spacing, radius } from '../../constants/theme';
import type { Exercise } from '../../data/exercises';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ExerciseCardProps {
  exercise: Exercise;
}

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={() => router.push(`/exercise/${exercise.id}`)}
      onPressIn={() => { scale.value = withSpring(0.96, { damping: 15, stiffness: 300 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }); }}
      style={[styles.card, animatedStyle]}
    >
      <View style={styles.iconArea}>
        <Ionicons
          name={exercise.icon as keyof typeof Ionicons.glyphMap}
          size={28}
          color={colors.primary}
        />
      </View>
      <Text style={styles.name} numberOfLines={2}>{exercise.name}</Text>
      <View style={styles.tagsRow}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{exercise.muscle}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{exercise.difficulty}</Text>
        </View>
      </View>
      <View style={styles.arrowWrap}>
        <Ionicons name="arrow-forward" size={18} color={colors.primary} />
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.xl,
    padding: spacing.lg,
    margin: spacing.xs + 2,
  },
  iconArea: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  name: {
    ...typography.headlineSM,
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  tag: {
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  tagText: {
    ...typography.labelSM,
    color: colors.onSurfaceVariant,
    fontSize: 9,
  },
  arrowWrap: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
  },
});
